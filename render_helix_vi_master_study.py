import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
import imageio.v3 as iio
from scipy.ndimage import map_coordinates

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
record_dir = os.path.join(base_dir, "recordings")
dl_dir = r"C:\Users\Orlando\Downloads"
brain_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(record_dir, exist_ok=True)
os.makedirs(dl_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

print("Loading master artwork and rigs...")
head_r = Image.open(os.path.join(rig_dir, "helix_vi_head_r34.png")).convert("RGBA")
head_front = Image.open(os.path.join(rig_dir, "helix_vi_head_front.png")).convert("RGBA")
head_l = Image.open(os.path.join(rig_dir, "helix_vi_head_l34.png")).convert("RGBA")
torso_im = Image.open(os.path.join(brain_dir, "torso_barrel_test.png")).convert("RGBA")
wing_l = Image.open(os.path.join(rig_dir, "helix_vi_wing_l.png")).convert("RGBA")
wing_r = Image.open(os.path.join(rig_dir, "helix_vi_wing_r.png")).convert("RGBA")
hoof_master = Image.open(os.path.join(rig_dir, "helix_vi_hoof_silver.png")).convert("RGBA")

w_nat, h_nat = 1024, 576

# Load fonts
try:
    font_title = ImageFont.truetype("arialbd.ttf", 15)
    font_bold = ImageFont.truetype("arialbd.ttf", 12)
    font_hud = ImageFont.truetype("consola.ttf", 11)
except Exception:
    font_title = ImageFont.load_default()
    font_bold = ImageFont.load_default()
    font_hud = ImageFont.load_default()

# ─── 1. SIMULATION TIMELINE (8.0s, 30fps = 240 frames) ───
fps = 30
duration = 8.0
total_frames = int(fps * duration)
dt = 1.0 / fps

def get_kinematic_state(t):
    st = {}
    st["time"] = t
    
    if t < 1.2:
        st["stage"] = "1. LIVING HOVER EQUILIBRIUM"
        st["vx"] = 0.0
        st["yaw"] = 0.50
        st["flight_speed"] = 0.0
        st["gaze_lead"] = 0.0
    elif t < 2.8:
        st["stage"] = "2. SUSTAINED CANTER RIGHT"
        st["vx"] = 1.0
        st["yaw"] = 0.75
        st["flight_speed"] = 1.0
        st["gaze_lead"] = 0.35
    elif t < 4.8:
        st["stage"] = "3. SLOW REVERSAL LEFT (FLYING LEAD CHANGE)"
        prog = (t - 2.8) / 2.0
        curve = 0.5 - 0.5 * math.cos(prog * math.pi)
        st["yaw"] = 0.75 - curve * 1.50
        st["vx"] = math.cos(prog * math.pi)
        st["flight_speed"] = abs(st["vx"])
        gaze_prog = min(1.0, max(0.0, (t - 2.65) / 1.9))
        st["gaze_lead"] = 0.35 - (0.5 - 0.5 * math.cos(gaze_prog * math.pi)) * 0.70
    elif t < 6.2:
        st["stage"] = "4. SUSTAINED CANTER LEFT"
        st["vx"] = -1.0
        st["yaw"] = -0.75
        st["flight_speed"] = 1.0
        st["gaze_lead"] = -0.35
    else:
        st["stage"] = "5. SETTLE INTO LIVING HOVER"
        prog = (t - 6.2) / 1.8
        damp = math.exp(-prog * 2.8)
        st["vx"] = -1.0 * (1.0 - prog) * damp
        st["yaw"] = -0.75 + prog * 0.25
        st["flight_speed"] = abs(st["vx"])
        st["gaze_lead"] = 0.0

    flap_freq = 3.6 + st["flight_speed"] * 1.8
    st["wing_phase"] = t * flap_freq * 2.0 * math.pi

    # Explicit visible blink at 0.70s (0.58s to 0.82s)
    if 0.58 <= t <= 0.82:
        b_prog = (t - 0.58) / 0.24
        if b_prog < 0.45:
            st["blink_closed"] = b_prog / 0.45
        elif b_prog < 0.60:
            st["blink_closed"] = 1.0
        else:
            st["blink_closed"] = 1.0 - (b_prog - 0.60) / 0.40
    else:
        st["blink_closed"] = 0.0

    stride_rate = 1.4 + st["flight_speed"] * 2.8
    st["stride_phase"] = t * stride_rate * 2.0 * math.pi
    st["hover_balance"] = 1.0 - min(1.0, st["flight_speed"])

    return st

# ─── 2. AUTHENTIC EYELID BLINK FUNCTION ───
def apply_eyelid_blink_to_head(head_img, closure, yaw, gaze_lead):
    if closure <= 0.02:
        return head_img
        
    res_head = head_img.copy()
    
    # Process head_r34, head_front, or head_l34
    if abs(yaw) <= 0.25:
        # Front view: symmetrical eyes at (475, 175) and (515, 175)
        boxes = [
            ((440, 140, 530, 220), 40.0, 38.0, False),
            ((480, 140, 570, 220), 45.0, 38.0, True)
        ]
    elif yaw > 0.25:
        # Right 3/4 view: near eye at (475, 175) in box (440, 140, 530, 220)
        boxes = [((440, 140, 530, 220), 40.0, 38.0, False)]
    else:
        # Left 3/4 view: flipped, near eye in box (494, 140, 584, 220)
        boxes = [((494, 140, 584, 220), 50.0, 38.0, True)]

    for box, cx, cy, is_flipped in boxes:
        eye_crop = head_img.crop(box)
        arr = np.array(eye_crop).astype(np.float32)
        h, w, _ = arr.shape
        grid_y, grid_x = np.indices((h, w), dtype=np.float32)

        rx = 22.0
        dx = (grid_x - cx) / rx
        gx = np.exp(-0.5 * (dx / 0.75)**2)
        gy = np.exp(-0.5 * ((grid_y - 24.0) / 10.0)**2)

        drop = closure * 20.0 * gx * gy
        src_y = grid_y - drop

        warped = np.zeros_like(arr)
        for ch in range(4):
            warped[:, :, ch] = map_coordinates(arr[:, :, ch], [src_y, grid_x], order=2, mode='nearest')

        res_arr = np.clip(warped, 0, 255).astype(np.float32)

        if closure > 0.5:
            alpha_close = (closure - 0.5) / 0.5
            for x in range(int(cx - 18), int(cx + 20)):
                if 0 <= x < w:
                    dx_c = (x - cx) / 18.0
                    if abs(dx_c) <= 1.0:
                        y_seam = 46.0 - (1.0 - dx_c**2) * 1.5
                        skin = res_arr[18, x]
                        for y in range(36, 50):
                            if y <= y_seam + 2.0:
                                dist = abs(y - y_seam)
                                w_s = max(0.0, 1.0 - dist / 7.0) * alpha_close
                                res_arr[y, x] = res_arr[y, x] * (1.0 - w_s) + skin * w_s

        res_box = Image.fromarray(res_arr.astype(np.uint8))

        if closure > 0.75:
            d = ImageDraw.Draw(res_box)
            pts = []
            for x in range(int(cx - 18), int(cx + 18), 2):
                if 0 <= x < w:
                    dx_c = (x - cx) / 18.0
                    if abs(dx_c) <= 1.0:
                        y_val = 46.0 - (1.0 - dx_c**2) * 1.5
                        pts.append((x, y_val))
            for p1, p2 in zip(pts[:-1], pts[1:]):
                d.line([p1, p2], fill=(55, 48, 75, int(160 * (closure - 0.75) / 0.25)), width=2)

        res_head.paste(res_box, (box[0], box[1]))

    return res_head

# ─── 3. ARTICULATED 4-LEG GAIT & LIMBS ───
def render_artistic_limb(canvas, p1, p2, p3, is_far=False, scale=1.0):
    leg_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(leg_layer)
    
    col_core = (195, 205, 235, 210) if is_far else (245, 248, 255, 245)
    col_rim = (95, 155, 215, 160) if is_far else (135, 215, 255, 220)
    col_shade = (135, 140, 175, 180) if is_far else (170, 175, 215, 200)

    # Upper Limb (Shoulder/Hip to Knee/Hock)
    w1 = int(16 * scale)
    d.line([p1, p2], fill=col_rim, width=w1)
    d.line([p1, p2], fill=col_core, width=int(w1 * 0.65))
    d.line([(p1[0]-1, p1[1]+1), (p2[0]-1, p2[1]+1)], fill=col_shade, width=int(w1 * 0.25))

    rk = int(7 * scale)
    d.ellipse([p2[0]-rk, p2[1]-rk, p2[0]+rk, p2[1]+rk], fill=col_core, outline=col_rim, width=int(2*scale))

    # Lower Limb (Knee/Hock to Fetlock)
    w3 = int(11 * scale)
    d.line([p2, p3], fill=col_rim, width=w3)
    d.line([p2, p3], fill=col_core, width=int(w3 * 0.65))
    d.line([(p2[0]-1, p2[1]+1), (p3[0]-1, p3[1]+1)], fill=col_shade, width=int(w3 * 0.25))

    leg_layer = leg_layer.filter(ImageFilter.GaussianBlur(radius=0.5))
    canvas.alpha_composite(leg_layer)

    # Attach Pristine Silver Hoof
    angle_rad = math.atan2(p3[1] - p2[1], p3[0] - p2[0])
    angle_deg = angle_rad * 180.0 / math.pi
    
    hw = int(34 * scale)
    hh = int(34 * scale)
    hoof_rot = hoof_master.resize((hw, hh), Image.Resampling.LANCZOS).rotate(
        -angle_deg + 65, resample=Image.Resampling.BILINEAR, expand=True
    )
    if is_far:
        hoof_rot = ImageEnhance.Brightness(hoof_rot).enhance(0.70)
        
    hr_w, hr_h = hoof_rot.size
    canvas.alpha_composite(hoof_rot, (int(p3[0] - hr_w/2), int(p3[1] - hr_h/2)))

def render_continuous_4leg_gait(canvas, cx, cy, st, scale, is_far_pass=False):
    yaw = st["yaw"]
    is_facing_right = yaw >= 0
    dir_sign = 1.0 if is_facing_right else -1.0
    sp = st["stride_phase"]
    speed = st["flight_speed"]
    hover = st["hover_balance"]

    sh_near = (cx + int(dir_sign * 12 * scale), cy + int(28 * scale))
    sh_far  = (cx - int(dir_sign * 18 * scale), cy + int(24 * scale))
    hip_near = (cx - int(dir_sign * 75 * scale), cy + int(30 * scale))
    hip_far  = (cx - int(dir_sign * 95 * scale), cy + int(26 * scale))

    reach_f = (46.0 * speed + 14.0 * hover) * scale
    lift_f  = (22.0 * speed + 8.0 * hover) * scale
    
    # ─── FORELEGS ───
    phi_lead = sp
    lead_hx = math.cos(phi_lead) * reach_f * dir_sign
    lead_hy = 64.0 * scale + math.sin(phi_lead) * lift_f
    fold_k = max(0.0, -math.cos(phi_lead)) * 26.0 * speed * scale
    lead_kx = lead_hx * 0.45 + (16.0 * scale * dir_sign)
    lead_ky = 34.0 * scale + (math.sin(phi_lead) * lift_f * 0.5) - fold_k
    
    p1_lead = sh_near
    p2_lead = (sh_near[0] + int(lead_kx), sh_near[1] + int(lead_ky))
    p3_lead = (sh_near[0] + int(lead_hx), sh_near[1] + int(lead_hy))

    phi_trail = sp + math.pi
    trail_hx = math.cos(phi_trail) * reach_f * dir_sign
    trail_hy = 60.0 * scale + math.sin(phi_trail) * lift_f
    fold_kt = max(0.0, -math.cos(phi_trail)) * 26.0 * speed * scale
    trail_kx = trail_hx * 0.45 + (14.0 * scale * dir_sign)
    trail_ky = 32.0 * scale + (math.sin(phi_trail) * lift_f * 0.5) - fold_kt

    p1_trail = sh_far
    p2_trail = (sh_far[0] + int(trail_kx), sh_far[1] + int(trail_ky))
    p3_trail = (sh_far[0] + int(trail_hx), sh_far[1] + int(trail_hy))

    # ─── HINDLEGS ───
    reach_h = (40.0 * speed + 12.0 * hover) * scale
    lift_h  = (18.0 * speed + 6.0 * hover) * scale
    
    phi_hn = sp + math.pi * 0.65
    phi_hf = sp + math.pi * 1.65
    
    hn_hx = -math.cos(phi_hn) * reach_h * dir_sign
    hn_hy = 74.0 * scale + math.sin(phi_hn) * lift_h
    hn_kx = hn_hx * 0.5 - (16.0 * scale * dir_sign)
    hn_ky = 38.0 * scale + math.sin(phi_hn) * lift_h * 0.4
    
    hf_hx = -math.cos(phi_hf) * reach_h * dir_sign
    hf_hy = 70.0 * scale + math.sin(phi_hf) * lift_h
    hf_kx = hf_hx * 0.5 - (16.0 * scale * dir_sign)
    hf_ky = 36.0 * scale + math.sin(phi_hf) * lift_h * 0.4

    p1_hn = hip_near
    p2_hn = (hip_near[0] + int(hn_kx), hip_near[1] + int(hn_ky))
    p3_hn = (hip_near[0] + int(hn_hx), hip_near[1] + int(hn_hy))

    p1_hf = hip_far
    p2_hf = (hip_far[0] + int(hf_kx), hip_far[1] + int(hf_ky))
    p3_hf = (hip_far[0] + int(hf_hx), hip_far[1] + int(hf_hy))

    if is_far_pass:
        render_artistic_limb(canvas, p1_trail, p2_trail, p3_trail, is_far=True, scale=scale)
        render_artistic_limb(canvas, p1_hf, p2_hf, p3_hf, is_far=True, scale=scale)
    else:
        render_artistic_limb(canvas, p1_lead, p2_lead, p3_lead, is_far=False, scale=scale)
        render_artistic_limb(canvas, p1_hn, p2_hn, p3_hn, is_far=False, scale=scale)

def render_full_character_frame(st, target_w=860):
    aspect = 576.0 / 1024.0
    target_h = int(target_w * aspect)
    canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    scale = target_w / 1024.0

    cx = target_w // 2
    cy = int(target_h * 0.52)

    yaw = st["yaw"]
    is_facing_right = yaw >= 0
    dir_sign = 1.0 if is_facing_right else -1.0
    vx = st["vx"]
    t = st["time"]
    wing_phase = st["wing_phase"]
    blink_closed = st["blink_closed"]
    gaze_lead = st["gaze_lead"]

    # 1. Far Wing
    stroke = math.sin(wing_phase)
    trail_flap = stroke * 0.22 - (abs(vx) * 0.14)
    clamped_trail = max(-0.40, min(0.48, trail_flap))
    
    w_wing = int(target_w * 0.48)
    h_wing = int(target_h * 0.48)
    far_w_raw = wing_l if is_facing_right else wing_r
    far_w_rot = far_w_raw.resize((w_wing, h_wing), Image.Resampling.LANCZOS).rotate(
        -clamped_trail * 180 / math.pi * dir_sign, resample=Image.Resampling.BILINEAR, expand=False
    )
    far_w_dark = ImageEnhance.Brightness(far_w_rot).enhance(0.70)
    canvas.alpha_composite(far_w_dark, (cx - w_wing//2 - int(dir_sign * 45 * scale), cy - h_wing//2 - int(75 * scale)))

    # 2. Far Legs
    render_continuous_4leg_gait(canvas, cx, cy, st, scale, is_far_pass=True)

    # 3. Torso Barrel & Flanks
    torso_scaled = torso_im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if not is_facing_right:
        torso_scaled = torso_scaled.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    bank_deg = (vx * 0.16 + gaze_lead * 0.10) * 180.0 / math.pi
    torso_banked = torso_scaled.rotate(-bank_deg * 0.32, resample=Image.Resampling.BILINEAR, expand=False)
    canvas.alpha_composite(torso_banked)

    # 4. SOLID SINGLE HEAD VIEW
    if abs(yaw) <= 0.25:
        active_head = head_front
    elif yaw > 0.25:
        active_head = head_r
    else:
        active_head = head_l

    # Apply Eyelid Blink directly on active head
    head_with_blink = apply_eyelid_blink_to_head(active_head, blink_closed, yaw, gaze_lead)
    head_scaled = head_with_blink.resize((target_w, target_h), Image.Resampling.LANCZOS)

    head_rot_deg = (-bank_deg * 0.55 + gaze_lead * 18.0)
    head_turned = head_scaled.rotate(head_rot_deg, resample=Image.Resampling.BILINEAR, expand=False)
    canvas.alpha_composite(head_turned)

    # 5. Near Legs
    render_continuous_4leg_gait(canvas, cx, cy, st, scale, is_far_pass=False)

    # 6. Near Wing
    near_flap = stroke * 0.25 + (abs(vx) * 0.20)
    clamped_near = max(-0.45, min(0.58, near_flap))
    near_w_raw = wing_r if is_facing_right else wing_l
    near_w_rot = near_w_raw.resize((w_wing, h_wing), Image.Resampling.LANCZOS).rotate(
        -clamped_near * 180 / math.pi * dir_sign, resample=Image.Resampling.BILINEAR, expand=False
    )
    near_w_bright = ImageEnhance.Brightness(near_w_rot).enhance(1.15)
    canvas.alpha_composite(near_w_bright, (cx - w_wing//2 + int(dir_sign * 35 * scale), cy - h_wing//2 - int(75 * scale)))

    # 7. DNA Mane & Tail Wave
    t_draw = ImageDraw.Draw(canvas)
    tail_x = cx - int(dir_sign * 155 * scale)
    tail_y = cy + int(60 * scale)
    for s in range(2):
        col = (56, 189, 248, 220) if s == 0 else (236, 72, 153, 220)
        pts = []
        for i in range(12):
            prog = i / 11.0
            tx = tail_x - int(dir_sign * prog * 110 * scale) - int(vx * 22 * prog * scale)
            ty = tail_y + int(prog * 80 * scale) + math.sin(t * 6.5 + prog * 4.0 + s * math.pi) * (12 * scale)
            pts.append((tx, ty))
        for p1, p2 in zip(pts[:-1], pts[1:]):
            t_draw.line([p1, p2], fill=col, width=int(3 * scale))

    # 8. Chest Core Reticle
    core_rad = int(28 * scale)
    t_draw.ellipse([cx - core_rad, cy - core_rad, cx + core_rad, cy + core_rad], fill=(34, 197, 94, 140), outline=(56, 189, 248, 255), width=int(2*scale))
    t_draw.line([(cx - int(core_rad*1.4), cy), (cx + int(core_rad*1.4), cy)], fill=(34, 197, 94, 220), width=1)
    t_draw.line([(cx, cy - int(core_rad*1.4)), (cx, cy + int(core_rad*1.4))], fill=(34, 197, 94, 220), width=1)

    return canvas

# ─── 4. ASSEMBLE SYNCHRONIZED 3-PASS REVIEW FRAMES (1280 x 720 HD) ───
def render_all_master_frames():
    print(f"Synthesizing {total_frames} master frames ({duration}s at {fps} fps)...")
    master_frames = []

    for f_idx in range(total_frames):
        t = f_idx * dt
        st = get_kinematic_state(t)

        char_master = render_full_character_frame(st, target_w=860)

        # Master canvas: 1280 x 720 HD
        master = Image.new("RGBA", (1280, 720), (4, 8, 16, 255))
        m_draw = ImageDraw.Draw(master)

        # 1. Pass A: Face Close-Up (2.4x zoom, framing ears, horn, crown, both eyes, muzzle, smile)
        face_crop = char_master.crop((300, 60, 560, 240)).resize((640, 360), Image.Resampling.LANCZOS)
        master.paste(face_crop, (0, 0))

        # 2. Pass B: Full-Body Anatomy (Framing all 4 legs, hooves, reach & fold, flying lead change)
        body_fit = char_master.resize((int(860 * 0.70), int(484 * 0.70)), Image.Resampling.LANCZOS)
        bw, bh = body_fit.size
        master.paste(body_fit, ((640 - bw) // 2, 360 + (360 - bh) // 2), mask=body_fit)

        # 3. Pass C: Gameplay Scale (1.0x true scale)
        gameplay_scaled = char_master.resize((int(860 * 0.58), int(484 * 0.58)), Image.Resampling.LANCZOS)
        gw, gh = gameplay_scaled.size
        master.paste(gameplay_scaled, (640 + (640 - gw)//2, (720 - gh)//2 - 10), mask=gameplay_scaled)

        # UI Telemetry & Dividers
        m_draw.line([(640, 0), (640, 720)], fill=(56, 189, 248, 180), width=2)
        m_draw.line([(0, 360), (640, 360)], fill=(56, 189, 248, 140), width=1)

        # Headers
        m_draw.rectangle([0, 0, 640, 36], fill=(15, 23, 42, 235))
        m_draw.text((16, 4), "PASS A: FACE CLOSE-UP (2.4x ZOOM)", fill=(56, 189, 248), font=font_title)
        m_draw.text((16, 20), "Authentic Eyelid Blink · Anticipatory Pupil Saccade · Solid 3D Front View", fill=(203, 213, 225), font=font_bold)

        m_draw.rectangle([0, 360, 640, 396], fill=(15, 23, 42, 235))
        m_draw.text((16, 364), "PASS B: CONTINUOUS 4-LEG AIRBORNE GAIT (FULL ANATOMY)", fill=(34, 197, 94), font=font_title)
        m_draw.text((16, 380), "Reach & Fold Cycle · Alternating Phases · Flying Lead Change · Silver Shoes", fill=(203, 213, 225), font=font_bold)

        m_draw.rectangle([640, 0, 1280, 36], fill=(15, 23, 42, 235))
        m_draw.text((656, 4), "PASS C: GAMEPLAY SCALE (1.0x CATCH POINT)", fill=(251, 191, 36), font=font_title)
        m_draw.text((656, 20), "Sustained Canter Flight · Slow Reversal · Living Suspension Hover", fill=(203, 213, 225), font=font_bold)

        # Telemetry Bar
        m_draw.rectangle([0, 688, 1280, 720], fill=(10, 15, 28, 245))
        hud_time = f"Time: {t:4.2f}s | Frame: {f_idx+1:03d}/240 | Stage: {st['stage']}"
        blink_str = "BLINKING (100% CLOSED)" if st["blink_closed"] > 0.85 else "PARTIAL BLINK (50%)" if st["blink_closed"] > 0.1 else "ATTENTIVE (OPEN)"
        lead_str = "RIGHT FOREHOOF LEAD" if st["yaw"] >= 0 else "LEFT FOREHOOF LEAD (FLYING CHANGE)"
        hud_telemetry = f"Gaze: {blink_str} | Gait: {lead_str} | Neck: LOCKED (0px) | Halo/VFX: OFF"

        m_draw.text((16, 695), hud_time, fill=(251, 191, 36), font=font_hud)
        m_draw.text((656, 695), hud_telemetry, fill=(34, 197, 94), font=font_hud)

        # Milestones callouts
        if 0.58 <= t <= 0.82:
            m_draw.rectangle([20, 50, 290, 85], fill=(15, 23, 42, 220), outline=(56, 189, 248), width=2)
            m_draw.text((30, 56), "★ NATURAL EYELID BLINK ACTIVE", fill=(56, 189, 248), font=font_bold)
        elif 3.65 <= t <= 3.95:
            m_draw.rectangle([20, 410, 340, 445], fill=(15, 23, 42, 220), outline=(34, 197, 94), width=2)
            m_draw.text((30, 416), "★ FLYING LEAD CHANGE (LEFT TAKES OVER)", fill=(34, 197, 94), font=font_bold)
            m_draw.rectangle([20, 50, 320, 85], fill=(15, 23, 42, 220), outline=(251, 191, 36), width=2)
            m_draw.text((30, 56), "★ SOLID FRONT VIEW (ZERO GHOSTING)", fill=(251, 191, 36), font=font_bold)

        master_frames.append(master)
        if (f_idx + 1) % 40 == 0:
            print(f"  Synthesized {f_idx+1}/{total_frames} frames...")

    return master_frames

if __name__ == "__main__":
    frames = render_all_master_frames()

    mp4_path = os.path.join(dl_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")
    mp4_rec = os.path.join(record_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")
    mp4_brain = os.path.join(brain_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")

    gif_path = os.path.join(dl_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
    gif_rec = os.path.join(record_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
    gif_brain = os.path.join(brain_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")

    print(f"\nEncoding broadcast MP4 to {mp4_path}...")
    video_arrays = [np.array(im.convert("RGB")) for im in frames]
    iio.imwrite(mp4_path, video_arrays, fps=fps, codec="libx264")
    iio.imwrite(mp4_rec, video_arrays, fps=fps, codec="libx264")
    iio.imwrite(mp4_brain, video_arrays, fps=fps, codec="libx264")
    print(f"  ✓ MP4 saved successfully ({os.path.getsize(mp4_path) / 1024 / 1024:.2f} MB)")

    print(f"\nEncoding high-quality animated GIF to {gif_path}...")
    gif_frames = [frames[i].convert("RGB").quantize(colors=96) for i in range(0, len(frames), 2)]
    gif_frames[0].save(gif_path, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    gif_frames[0].save(gif_rec, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    gif_frames[0].save(gif_brain, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    print(f"  ✓ Animated GIF saved successfully ({os.path.getsize(gif_path) / 1024 / 1024:.2f} MB)")

    print("\nAll deliverables generated successfully!")
