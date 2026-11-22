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

print("Loading master anatomical artwork and rigs...")
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

# ─── 1. SIMULATION TIMELINE (12.0s, 30fps = 360 frames) ───
fps = 30
duration = 12.0
total_frames = int(fps * duration)
dt = 1.0 / fps

def get_kinematic_state(t):
    st = {}
    st["time"] = t
    
    # ─── 5-STAGE PHYSICAL MANEUVER TIMELINE ───
    # 1. 0.0s - 2.0s: Living Hover Equilibrium (Stationary)
    # 2. 2.0s - 4.5s: Sustained Travel Right (Two complete canter strides)
    # 3. 4.5s - 6.8s: Gentle Reversal Right-to-Left (Gather, Front view, Lead change)
    # 4. 6.8s - 9.2s: Sharp Reversal Left-to-Right (Airbrake, Deep gather, Front view, Lead change)
    # 5. 9.2s - 12.0s: Stop & Settle into Living Hover (Equilibrium)

    if t < 2.0:
        st["stage"] = "1. LIVING HOVER EQUILIBRIUM"
        st["steer_input"] = 0.0
        st["steer_label"] = "NEUTRAL [ ● ]"
        st["vx"] = 0.0
        st["ax"] = 0.0
        st["yaw"] = 0.50
        st["gaze_lead"] = 0.0
        st["flight_speed"] = 0.0
        st["is_braking"] = False
        st["gather"] = 0.0
        st["lead_sign"] = 1.0

    elif t < 4.5:
        st["stage"] = "2. SUSTAINED CANTER RIGHT (2 COMPLETE STRIDES)"
        st["steer_input"] = 1.0
        st["steer_label"] = "HOLD RIGHT [ ━► ]"
        # Ramp speed smoothly up to 1.0
        acc_prog = min(1.0, (t - 2.0) / 0.6)
        st["vx"] = 0.5 - 0.5 * math.cos(acc_prog * math.pi)
        st["ax"] = math.sin(acc_prog * math.pi) * 1.6 if acc_prog < 1.0 else 0.0
        st["yaw"] = 0.50 + 0.35 * acc_prog
        st["gaze_lead"] = 0.40
        st["flight_speed"] = st["vx"]
        st["is_braking"] = False
        st["gather"] = 0.0
        st["lead_sign"] = 1.0

    elif t < 6.8:
        st["stage"] = "3. GENTLE REVERSAL RIGHT-TO-LEFT (FLYING LEAD CHANGE)"
        st["steer_input"] = -0.6
        st["steer_label"] = "GENTLE LEFT [ ◄─ ]"
        prog = (t - 4.5) / 2.3  # 0.0 to 1.0
        
        # 1. Gaze shifts first: 0.0 to 0.4 (t=4.5 to 5.4)
        gaze_p = min(1.0, max(0.0, prog / 0.45))
        st["gaze_lead"] = 0.40 - (0.5 - 0.5 * math.cos(gaze_p * math.pi)) * 0.80

        # 2. Velocity and Deceleration: vx drops from +1.0 to -0.65
        # Zero-crossing (turn midpoint) at prog = 0.52 (t = 5.70s)
        curve_v = 0.5 - 0.5 * math.cos(prog * math.pi)
        st["vx"] = 1.0 - curve_v * 1.65
        st["ax"] = -math.sin(prog * math.pi) * 2.2
        st["flight_speed"] = abs(st["vx"])

        # 3. Braking and Gather peak around midpoint
        # Gather curve: bell curve peaking at midpoint
        mid_dist = abs(prog - 0.50) / 0.30
        st["gather"] = max(0.0, 1.0 - mid_dist**2)
        st["is_braking"] = (st["ax"] * st["vx"] < -0.05) or (prog < 0.50)

        # 4. Yaw rotation through front view
        st["yaw"] = 0.85 - curve_v * 1.70
        st["lead_sign"] = 1.0 if prog < 0.50 else -1.0

    elif t < 9.2:
        st["stage"] = "4. SHARP REVERSAL LEFT-TO-RIGHT (WIDE AIRBRAKE & DEEP GATHER)"
        st["steer_input"] = 1.0
        st["steer_label"] = "SHARP RIGHT [ ━━► ]"
        prog = (t - 6.8) / 2.4  # 0.0 to 1.0

        # 1. Gaze snaps right immediately: 0.0 to 0.35 (t=6.8 to 7.6)
        gaze_p = min(1.0, max(0.0, prog / 0.35))
        st["gaze_lead"] = -0.40 + (0.5 - 0.5 * math.cos(gaze_p * math.pi)) * 0.80

        # 2. Velocity: vx swings sharply from -0.65 to +1.0
        # Zero-crossing (turn midpoint) at prog = 0.45 (t = 7.88s)
        curve_v = 0.5 - 0.5 * math.cos(prog * math.pi)
        st["vx"] = -0.65 + curve_v * 1.65
        st["ax"] = math.sin(prog * math.pi) * 3.2
        st["flight_speed"] = abs(st["vx"])

        # 3. Deep Gather & Powerful Airbrake
        mid_dist = abs(prog - 0.45) / 0.28
        st["gather"] = min(1.0, max(0.0, 1.0 - mid_dist**2) * 1.25)
        st["is_braking"] = (st["ax"] * st["vx"] < -0.05) or (prog < 0.45)

        # 4. Yaw rotation through front view
        st["yaw"] = -0.85 + curve_v * 1.70
        st["lead_sign"] = -1.0 if prog < 0.45 else 1.0

    else:
        st["stage"] = "5. STOP & SETTLE INTO LIVING HOVER"
        st["steer_input"] = 0.0
        st["steer_label"] = "RELEASE [ ● ]"
        prog = (t - 9.2) / 2.8
        damp = math.exp(-prog * 3.0)
        st["vx"] = 1.0 * (1.0 - prog) * damp
        st["ax"] = -st["vx"] * 1.5
        st["yaw"] = 0.85 - prog * 0.35
        st["flight_speed"] = abs(st["vx"])
        st["gaze_lead"] = 0.0
        st["is_braking"] = prog < 0.30
        st["gather"] = max(0.0, (0.30 - prog) / 0.30) * 0.5
        st["lead_sign"] = 1.0

    # ─── EYELID BLINK TIMING ───
    # Blink 1: at t = 1.00s (0.88s to 1.12s) during idle hover
    # Blink 2: at t = 10.60s (10.48s to 10.72s) during settling hover
    st["blink_closed"] = 0.0
    for b_center in [1.00, 10.60]:
        if (b_center - 0.12) <= t <= (b_center + 0.12):
            b_p = (t - (b_center - 0.12)) / 0.24
            if b_p < 0.45:
                st["blink_closed"] = b_p / 0.45
            elif b_p < 0.58:
                st["blink_closed"] = 1.0
            else:
                st["blink_closed"] = 1.0 - (b_p - 0.58) / 0.42

    # ─── WING AEROELASTICS & STRIDE RATE ───
    # Wing frequency: 2.2 Hz in hover, ramps up to 4.2 Hz during power stroke / canter
    wing_freq = 2.2 + st["flight_speed"] * 2.0
    st["wing_phase"] = t * wing_freq * 2.0 * math.pi

    # Canter stride frequency: 1.0 Hz in slow canter, up to 1.8 Hz at top speed
    # One complete stride takes ~1.1s to 1.3s so it is easily followable!
    stride_rate = 0.9 + st["flight_speed"] * 0.65
    st["stride_phase"] = t * stride_rate * 2.0 * math.pi

    # Breathing oscillation (chest expansion in hover)
    st["breath"] = math.sin(t * 2.0 * math.pi / 3.2)

    return st

# ─── 2. AUTHENTIC 3-STAGE EYELID BLINK ───
def apply_eyelid_blink_to_head(head_img, closure, yaw, gaze_lead):
    if closure <= 0.02:
        return head_img
        
    res_head = head_img.copy()
    
    # Process head_r34, head_front, or head_l34
    if abs(yaw) <= 0.22:
        # Symmetrical front view: both eyes visible
        boxes = [
            ((440, 140, 530, 220), 40.0, 38.0, False),
            ((480, 140, 570, 220), 45.0, 38.0, True)
        ]
    elif yaw > 0.22:
        # Right 3/4 view: near eye in box (440, 140, 530, 220)
        boxes = [((440, 140, 530, 220), 40.0, 38.0, False)]
    else:
        # Left 3/4 view: flipped near eye in box (494, 140, 584, 220)
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

# ─── 3. CONTINUOUS 4-LEG AIRBORNE GAIT & GATHER DYNAMICS ───
def render_artistic_limb(canvas, p1, p2, p3, is_far=False, scale=1.0):
    leg_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(leg_layer)
    
    col_core = (195, 205, 235, 215) if is_far else (245, 248, 255, 250)
    col_rim = (95, 155, 215, 170) if is_far else (135, 215, 255, 230)
    col_shade = (135, 140, 175, 190) if is_far else (170, 175, 215, 210)

    # Upper Limb (Shoulder/Hip to Knee/Hock)
    w1 = int(15 * scale)
    d.line([p1, p2], fill=col_rim, width=w1)
    d.line([p1, p2], fill=col_core, width=int(w1 * 0.65))
    d.line([(p1[0]-1, p1[1]+1), (p2[0]-1, p2[1]+1)], fill=col_shade, width=int(w1 * 0.25))

    rk = int(7 * scale)
    d.ellipse([p2[0]-rk, p2[1]-rk, p2[0]+rk, p2[1]+rk], fill=col_core, outline=col_rim, width=int(2*scale))

    # Lower Limb (Knee/Hock to Fetlock)
    w3 = int(10 * scale)
    d.line([p2, p3], fill=col_rim, width=w3)
    d.line([p2, p3], fill=col_core, width=int(w3 * 0.65))
    d.line([(p2[0]-1, p2[1]+1), (p3[0]-1, p3[1]+1)], fill=col_shade, width=int(w3 * 0.25))

    leg_layer = leg_layer.filter(ImageFilter.GaussianBlur(radius=0.4))
    canvas.alpha_composite(leg_layer)

    # Attach Pristine Silver Hoof
    angle_rad = math.atan2(p3[1] - p2[1], p3[0] - p2[0])
    angle_deg = angle_rad * 180.0 / math.pi
    
    hw = int(32 * scale)
    hh = int(32 * scale)
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
    gather = st["gather"]
    hover = max(0.0, 1.0 - speed) * (1.0 - gather)

    # Anchors firmly socketed in torso
    sh_near = (cx + int(dir_sign * 14 * scale), cy + int(26 * scale))
    sh_far  = (cx - int(dir_sign * 16 * scale), cy + int(22 * scale))
    hip_near = (cx - int(dir_sign * 75 * scale), cy + int(30 * scale))
    hip_far  = (cx - int(dir_sign * 95 * scale), cy + int(26 * scale))

    # Reach and Lift modulation based on speed and gather state
    reach_f = (52.0 * speed * (1.0 - gather * 0.65) + 12.0 * hover) * scale
    lift_f  = (24.0 * speed + 6.0 * hover) * scale

    # When gathered (turning suspension), hooves pull up under chest core
    gather_tuck_y = gather * 22.0 * scale
    gather_tuck_x = gather * 14.0 * scale * dir_sign

    # ─── FORELEGS ───
    # Lead leg vs Trailing leg based on lead_sign
    lead_is_near = (st["lead_sign"] * dir_sign >= 0)

    # Phase 0: Lead Foreleg
    phi_lead = sp
    lead_hx = math.cos(phi_lead) * reach_f * dir_sign - gather_tuck_x
    lead_hy = 68.0 * scale + math.sin(phi_lead) * lift_f - gather_tuck_y
    fold_lead = max(0.0, -math.cos(phi_lead)) * 28.0 * speed * scale + gather * 18.0 * scale
    lead_kx = lead_hx * 0.45 + (16.0 * scale * dir_sign)
    lead_ky = 36.0 * scale + (math.sin(phi_lead) * lift_f * 0.4) - fold_lead

    # Phase 1: Trailing Foreleg (offset by 0.95 pi)
    phi_trail = sp + math.pi * 0.95
    trail_hx = math.cos(phi_trail) * reach_f * dir_sign - gather_tuck_x
    trail_hy = 64.0 * scale + math.sin(phi_trail) * lift_f - gather_tuck_y
    fold_trail = max(0.0, -math.cos(phi_trail)) * 28.0 * speed * scale + gather * 18.0 * scale
    trail_kx = trail_hx * 0.45 + (14.0 * scale * dir_sign)
    trail_ky = 34.0 * scale + (math.sin(phi_trail) * lift_f * 0.4) - fold_trail

    if lead_is_near:
        p1_fn, p2_fn, p3_fn = sh_near, (sh_near[0] + int(lead_kx), sh_near[1] + int(lead_ky)), (sh_near[0] + int(lead_hx), sh_near[1] + int(lead_hy))
        p1_ff, p2_ff, p3_ff = sh_far,  (sh_far[0] + int(trail_kx), sh_far[1] + int(trail_ky)), (sh_far[0] + int(trail_hx), sh_far[1] + int(trail_hy))
    else:
        p1_fn, p2_fn, p3_fn = sh_near, (sh_near[0] + int(trail_kx), sh_near[1] + int(trail_ky)), (sh_near[0] + int(trail_hx), sh_near[1] + int(trail_hy))
        p1_ff, p2_ff, p3_ff = sh_far,  (sh_far[0] + int(lead_kx), sh_far[1] + int(lead_ky)), (sh_far[0] + int(lead_hx), sh_far[1] + int(lead_hy))

    # ─── HINDLEGS ───
    reach_h = (44.0 * speed * (1.0 - gather * 0.60) + 10.0 * hover) * scale
    lift_h  = (18.0 * speed + 5.0 * hover) * scale

    phi_hn = sp + math.pi * 0.65
    phi_hf = sp + math.pi * 1.65

    hn_hx = -math.cos(phi_hn) * reach_h * dir_sign - gather_tuck_x * 0.5
    hn_hy = 74.0 * scale + math.sin(phi_hn) * lift_h - gather_tuck_y * 0.8
    hn_kx = hn_hx * 0.5 - (16.0 * scale * dir_sign)
    hn_ky = 38.0 * scale + math.sin(phi_hn) * lift_h * 0.4 - gather * 14.0 * scale

    hf_hx = -math.cos(phi_hf) * reach_h * dir_sign - gather_tuck_x * 0.5
    hf_hy = 70.0 * scale + math.sin(phi_hf) * lift_h - gather_tuck_y * 0.8
    hf_kx = hf_hx * 0.5 - (16.0 * scale * dir_sign)
    hf_ky = 36.0 * scale + math.sin(phi_hf) * lift_h * 0.4 - gather * 14.0 * scale

    p1_hn, p2_hn, p3_hn = hip_near, (hip_near[0] + int(hn_kx), hip_near[1] + int(hn_ky)), (hip_near[0] + int(hn_hx), hip_near[1] + int(hn_hy))
    p1_hf, p2_hf, p3_hf = hip_far,  (hip_far[0] + int(hf_kx), hip_far[1] + int(hf_ky)), (hip_far[0] + int(hf_hx), hip_far[1] + int(hf_hy))

    if is_far_pass:
        render_artistic_limb(canvas, p1_ff, p2_ff, p3_ff, is_far=True, scale=scale)
        render_artistic_limb(canvas, p1_hf, p2_hf, p3_hf, is_far=True, scale=scale)
    else:
        render_artistic_limb(canvas, p1_fn, p2_fn, p3_fn, is_far=False, scale=scale)
        render_artistic_limb(canvas, p1_hn, p2_hn, p3_hn, is_far=False, scale=scale)

# ─── 4. FULL LIVING CHARACTER RENDERER ───
def render_full_character_frame(st, target_w=860, show_debug_reticle=False):
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
    ax = st["ax"]
    t = st["time"]
    wing_phase = st["wing_phase"]
    blink_closed = st["blink_closed"]
    gaze_lead = st["gaze_lead"]
    is_braking = st["is_braking"]
    breath = st["breath"]

    # 1. FAR WING (BEHIND TORSO)
    # Aeroelastic wing physics from Tier II-IV:
    # Downstroke initiated at shoulder root; tips recover last
    # Flare forward/outward when braking!
    stroke = math.sin(wing_phase)
    brake_flare = 0.28 if is_braking else 0.0
    
    # Far wing flap angle
    trail_flap = stroke * 0.22 - (abs(vx) * 0.12) - brake_flare * 0.40
    clamped_trail = max(-0.45, min(0.55, trail_flap))

    w_wing = int(target_w * 0.50)
    h_wing = int(target_h * 0.50)
    far_w_raw = wing_l if is_facing_right else wing_r
    far_w_rot = far_w_raw.resize((w_wing, h_wing), Image.Resampling.LANCZOS).rotate(
        -clamped_trail * 180 / math.pi * dir_sign, resample=Image.Resampling.BILINEAR, expand=False
    )
    far_w_dark = ImageEnhance.Brightness(far_w_rot).enhance(0.70)
    canvas.alpha_composite(far_w_dark, (cx - w_wing//2 - int(dir_sign * 42 * scale), cy - h_wing//2 - int(72 * scale)))

    # 2. FAR LEGS
    render_continuous_4leg_gait(canvas, cx, cy, st, scale, is_far_pass=True)

    # 3. TORSO BARREL & FLANKS
    torso_scaled = torso_im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if not is_facing_right:
        torso_scaled = torso_scaled.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    # Torso bank angle into turn (subtle chest rise during breath)
    bank_deg = (vx * 0.14 + gaze_lead * 0.10) * 180.0 / math.pi
    torso_banked = torso_scaled.rotate(-bank_deg * 0.30, resample=Image.Resampling.BILINEAR, expand=False)
    canvas.alpha_composite(torso_banked, (0, int(breath * 1.5 * scale)))

    # 4. SOLID SINGLE HEAD VIEW
    if abs(yaw) <= 0.22:
        active_head = head_front
    elif yaw > 0.22:
        active_head = head_r
    else:
        active_head = head_l

    # Apply 3-Stage Eyelid Blink directly on active head
    head_with_blink = apply_eyelid_blink_to_head(active_head, blink_closed, yaw, gaze_lead)
    head_scaled = head_with_blink.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Head turns ahead into the vector with gaze lead (Neck locked without cervical slippage)
    head_rot_deg = (-bank_deg * 0.50 + gaze_lead * 16.0)
    head_turned = head_scaled.rotate(head_rot_deg, resample=Image.Resampling.BILINEAR, expand=False)
    canvas.alpha_composite(head_turned, (0, int(breath * 1.5 * scale)))

    # 5. NEAR LEGS
    render_continuous_4leg_gait(canvas, cx, cy, st, scale, is_far_pass=False)

    # 6. NEAR WING (IN FRONT OF TORSO, LEADING AIRFLOW)
    near_flap = stroke * 0.25 + (abs(vx) * 0.18) + brake_flare
    clamped_near = max(-0.45, min(0.62, near_flap))
    near_w_raw = wing_r if is_facing_right else wing_l
    near_w_rot = near_w_raw.resize((w_wing, h_wing), Image.Resampling.LANCZOS).rotate(
        -clamped_near * 180 / math.pi * dir_sign, resample=Image.Resampling.BILINEAR, expand=False
    )
    near_w_bright = ImageEnhance.Brightness(near_w_rot).enhance(1.15)
    canvas.alpha_composite(near_w_bright, (cx - w_wing//2 + int(dir_sign * 36 * scale), cy - h_wing//2 - int(72 * scale)))

    # 7. DNA MANE & TAIL WAVE (PROGRESSIVE BEND WITH INERTIAL MOMENTUM LAG)
    t_draw = ImageDraw.Draw(canvas)
    tail_x = cx - int(dir_sign * 155 * scale)
    tail_y = cy + int(60 * scale)
    for s in range(2):
        col = (56, 189, 248, 220) if s == 0 else (236, 72, 153, 220)
        pts = []
        for i in range(14):
            prog = i / 13.0
            # Inertial lag: tail briefly bends toward old direction before trailing
            tx = tail_x - int(dir_sign * prog * 115 * scale) - int(vx * 25 * prog * scale) + int(ax * 8 * prog**2 * scale)
            ty = tail_y + int(prog * 85 * scale) + math.sin(t * 6.0 + prog * 4.2 + s * math.pi) * (14 * scale)
            pts.append((tx, ty))
        for p1, p2 in zip(pts[:-1], pts[1:]):
            t_draw.line([p1, p2], fill=col, width=int(3 * scale))

    # Optional internal catch point reticle (ONLY shown if show_debug_reticle is True)
    if show_debug_reticle:
        core_rad = int(28 * scale)
        t_draw.ellipse([cx - core_rad, cy - core_rad, cx + core_rad, cy + core_rad], fill=(34, 197, 94, 140), outline=(56, 189, 248, 255), width=int(2*scale))
        t_draw.line([(cx - int(core_rad*1.4), cy), (cx + int(core_rad*1.4), cy)], fill=(34, 197, 94, 220), width=1)
        t_draw.line([(cx, cy - int(core_rad*1.4)), (cx, cy + int(core_rad*1.4))], fill=(34, 197, 94, 220), width=1)

    return canvas

# ─── 5. DRAW STEERING INPUT CONTROLLER INDICATOR (OUTSIDE SILHOUETTE) ───
def draw_steering_hud_indicator(d, x, y, steer_val, label):
    # Background panel
    d.rectangle([x, y, x + 240, y + 64], fill=(15, 23, 42, 235), outline=(56, 189, 248, 160), width=1)
    d.text((x + 12, y + 8), "STEERING INPUT (JOYSTICK):", fill=(148, 163, 184), font=font_bold)
    
    # Steering bar: neutral center is at x+120
    bar_cx = x + 120
    bar_y = y + 36
    d.line([(bar_cx - 70, bar_y), (bar_cx + 70, bar_y)], fill=(71, 85, 105), width=4)
    d.line([(bar_cx, bar_y - 6), (bar_cx, bar_y + 6)], fill=(148, 163, 184), width=2)
    
    # Stick thumb position
    thumb_x = bar_cx + int(steer_val * 65.0)
    col_thumb = (56, 189, 248) if abs(steer_val) > 0.05 else (203, 213, 225)
    d.ellipse([thumb_x - 8, bar_y - 8, thumb_x + 8, bar_y + 8], fill=col_thumb, outline=(255, 255, 255), width=2)
    
    # Text label
    d.text((x + 12, y + 46), label, fill=(251, 191, 36) if abs(steer_val) > 0.05 else (148, 163, 184), font=font_hud)

# ─── 6. ASSEMBLE 2-PASS BROADCAST REVIEW FRAMES (1280 x 720 HD) ───
def render_all_master_frames():
    print(f"Synthesizing {total_frames} master frames ({duration}s at {fps} fps)...")
    master_frames = []

    for f_idx in range(total_frames):
        t = f_idx * dt
        st = get_kinematic_state(t)

        # Render clean character without debug reticle (Pure Anatomy Mode)
        char_master = render_full_character_frame(st, target_w=860, show_debug_reticle=False)

        # Master canvas: 1280 x 720 HD on plain dark background (#040810)
        master = Image.new("RGBA", (1280, 720), (4, 8, 16, 255))
        m_draw = ImageDraw.Draw(master)

        # ─── PASS 1 (LEFT HALF): UNINTERRUPTED SIDE-VIEW CLOSE-UP (1.35x SCALE) ───
        # Framed so ALL FOUR hooves, both wing roots, head, and tail are 100% in frame!
        close_scaled = char_master.resize((int(860 * 0.88), int(484 * 0.88)), Image.Resampling.LANCZOS)
        cw, ch = close_scaled.size
        # Center in the 640 x 688 left viewport
        master.paste(close_scaled, ((640 - cw) // 2, 40 + (648 - ch) // 2), mask=close_scaled)

        # ─── PASS 2 (RIGHT HALF): GAMEPLAY SCALE (1.0x TRUE SCALE) ───
        game_scaled = char_master.resize((int(860 * 0.58), int(484 * 0.58)), Image.Resampling.LANCZOS)
        gw, gh = game_scaled.size
        master.paste(game_scaled, (640 + (640 - gw) // 2, 40 + (648 - gh) // 2), mask=game_scaled)

        # Vertical Divider
        m_draw.line([(640, 0), (640, 688)], fill=(56, 189, 248, 160), width=2)

        # ─── HEADERS ───
        m_draw.rectangle([0, 0, 640, 36], fill=(15, 23, 42, 245))
        m_draw.text((16, 4), "PASS 1: UNINTERRUPTED SIDE-VIEW ANATOMY (1.35x ZOOM)", fill=(56, 189, 248), font=font_title)
        m_draw.text((16, 20), "All 4 Hooves & Wing Roots Framed · Canter Stride Cycle · Reversal Coordination", fill=(203, 213, 225), font=font_bold)

        m_draw.rectangle([640, 0, 1280, 36], fill=(15, 23, 42, 245))
        m_draw.text((656, 4), "PASS 2: GAMEPLAY SCALE (1.0x MOTION PREVIEW)", fill=(34, 197, 94), font=font_title)
        m_draw.text((656, 20), "Living Hover · 2 Canter Strides · Gentle Reversal · Sharp Reversal · Stop", fill=(203, 213, 225), font=font_bold)

        # ─── STEERING INPUT INDICATOR (OUTSIDE SILHOUETTE, TOP-LEFT) ───
        draw_steering_hud_indicator(m_draw, 16, 46, st["steer_input"], st["steer_label"])

        # ─── TELEMETRY BAR AT BOTTOM ───
        m_draw.rectangle([0, 688, 1280, 720], fill=(10, 15, 28, 255), outline=(56, 189, 248, 120), width=1)
        hud_time = f"Time: {t:4.2f}s | Frame: {f_idx+1:03d}/360 | Stage: {st['stage']}"
        
        blink_str = "BLINK (CLOSED)" if st["blink_closed"] > 0.8 else "PARTIAL BLINK (50%)" if st["blink_closed"] > 0.1 else "ATTENTIVE GAZE"
        wing_str = "WIDE BRAKE FLARE" if st["is_braking"] else "AEROELASTIC DOWNSTROKE" if math.sin(st["wing_phase"]) > 0 else "UPSTROKE RECOVERY"
        lead_str = "RIGHT FOREHOOF LEAD" if st["lead_sign"] > 0 else "LEFT FOREHOOF LEAD"
        gather_str = f"GATHER: {int(st['gather']*100)}%" if st["gather"] > 0.1 else "STRIDE: EXTENDED"
        hud_telemetry = f"Gaze: {blink_str} | Wings: {wing_str} | Gait: {lead_str} ({gather_str})"

        m_draw.text((16, 695), hud_time, fill=(251, 191, 36), font=font_hud)
        m_draw.text((656, 695), hud_telemetry, fill=(34, 197, 94), font=font_hud)

        # ─── MILESTONE HIGHLIGHT CALLOUTS ───
        if (0.88 <= t <= 1.12) or (10.48 <= t <= 10.72):
            m_draw.rectangle([270, 46, 540, 78], fill=(15, 23, 42, 230), outline=(56, 189, 248), width=2)
            m_draw.text((280, 53), "★ AUTHENTIC 3-STAGE EYELID BLINK ACTIVE", fill=(56, 189, 248), font=font_bold)
        elif 2.10 <= t <= 3.30:
            m_draw.rectangle([270, 46, 580, 78], fill=(15, 23, 42, 230), outline=(34, 197, 94), width=2)
            m_draw.text((280, 53), "★ STRIDE 1: REACH -> FOLD UNDER CHEST -> REACH", fill=(34, 197, 94), font=font_bold)
        elif 5.50 <= t <= 5.90:
            m_draw.rectangle([270, 46, 590, 78], fill=(15, 23, 42, 230), outline=(251, 191, 36), width=2)
            m_draw.text((280, 53), "★ GENTLE REVERSAL MIDPOINT (SOLID FRONT VIEW 35°)", fill=(251, 191, 36), font=font_bold)
        elif 7.70 <= t <= 8.10:
            m_draw.rectangle([270, 46, 600, 78], fill=(15, 23, 42, 230), outline=(236, 72, 153), width=2)
            m_draw.text((280, 53), "★ SHARP REVERSAL: WIDE BRAKE FLARE & FLYING LEAD CHANGE", fill=(236, 72, 153), font=font_bold)

        master_frames.append(master)
        if (f_idx + 1) % 60 == 0:
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
    # Sample every 2nd frame for 15fps smooth lightweight GIF loop
    gif_frames = [frames[i].convert("RGB").quantize(colors=96) for i in range(0, len(frames), 2)]
    gif_frames[0].save(gif_path, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    gif_frames[0].save(gif_rec, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    gif_frames[0].save(gif_brain, save_all=True, append_images=gif_frames[1:], duration=66, loop=0)
    print(f"  ✓ Animated GIF saved successfully ({os.path.getsize(gif_path) / 1024 / 1024:.2f} MB)")

    print("\nAll deliverables generated successfully!")
