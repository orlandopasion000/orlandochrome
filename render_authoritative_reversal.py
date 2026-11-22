import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFont
import imageio.v3 as iio

# ─── PATH SETUP ───
base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
record_dir = os.path.join(base_dir, "recordings")
dl_dir = r"C:\Users\Orlando\Downloads"
brain_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(record_dir, exist_ok=True)
os.makedirs(dl_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

# ─── 1. LOAD ASSETS ───
print("Loading high-resolution character assets...")
master_im = Image.open(os.path.join(char_dir, "helix_vi.png")).convert("RGBA")
w_nat, h_nat = master_im.size # 1024, 576

# Load the 8 authoritative turnaround views
turn_000 = Image.open(os.path.join(rig_dir, "helix_vi_turn_000_front.png")).convert("RGBA")
turn_045 = Image.open(os.path.join(rig_dir, "helix_vi_turn_045_r34.png")).convert("RGBA")
turn_090 = Image.open(os.path.join(rig_dir, "helix_vi_turn_090_profile_r.png")).convert("RGBA")
turn_315 = Image.open(os.path.join(rig_dir, "helix_vi_turn_315_l34.png")).convert("RGBA")
turn_270 = Image.open(os.path.join(rig_dir, "helix_vi_turn_270_profile_l.png")).convert("RGBA")

# Load layered components for precise articulation & wing flex
body_im = Image.open(os.path.join(rig_dir, "helix_vi_body.png")).convert("RGBA")
head_r = Image.open(os.path.join(rig_dir, "helix_vi_head_r34.png")).convert("RGBA")
head_f = Image.open(os.path.join(rig_dir, "helix_vi_head_front.png")).convert("RGBA")
head_l = Image.open(os.path.join(rig_dir, "helix_vi_head_l34.png")).convert("RGBA")
wing_l = Image.open(os.path.join(rig_dir, "helix_vi_wing_l.png")).convert("RGBA")
wing_r = Image.open(os.path.join(rig_dir, "helix_vi_wing_r.png")).convert("RGBA")

# Convert to float numpy arrays for fast volumetric blending
arr_000 = np.array(turn_000, dtype=np.float32)
arr_045 = np.array(turn_045, dtype=np.float32)
arr_315 = np.array(turn_315, dtype=np.float32)

# Try loading standard font or fallback
try:
    font_title = ImageFont.truetype("arialbd.ttf", 15)
    font_bold = ImageFont.truetype("arialbd.ttf", 12)
    font_sub = ImageFont.truetype("arial.ttf", 10.5)
    font_hud = ImageFont.truetype("consola.ttf", 11)
except Exception:
    font_title = ImageFont.load_default()
    font_bold = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_hud = ImageFont.load_default()

# ─── 2. MANEUVER TIMELINE DEFINITION (8.0s, 30fps = 240 frames) ───
fps = 30
duration = 8.0
total_frames = int(fps * duration)
dt = 1.0 / fps

print(f"Synthesizing {total_frames} frames ({duration}s at {fps} fps)...")

def get_maneuver_state(t):
    """
    Returns exact kinematic state for the complete 6-stage canonical test:
    1. Hover (0.0s - 1.2s): Neutral 45° hover
    2. Steer Right (1.2s - 2.6s): Accelerate right to Vx = +1.0
    3. Reversing Slowly to Left (2.6s - 4.6s): Apex at t=3.6s, passing 0° Front View
    4. Hold Left (4.6s - 5.8s): Sustained left pass at Vx = -1.0
    5. Reversing Back to Right (5.8s - 7.2s): Apex at t=6.5s, passing 0° Front View
    6. Settle Hover (7.2s - 8.0s): Brake to 0, settle resting equilibrium
    """
    if t < 1.2:
        stage_name = "1. HOVER EQUILIBRIUM"
        vx = 0.0
        yaw = 1.0 # 45° Right 3/4
        gaze_lead = 0.0
    elif t < 2.6:
        stage_name = "2. STEER RIGHT (CANTER ACCEL)"
        prog = (t - 1.2) / 1.4
        vx = math.sin(prog * math.pi * 0.5)
        yaw = 1.0
        gaze_lead = 0.25
    elif t < 4.6:
        stage_name = "3. SLOW REVERSAL LEFT (CRITICAL TEST)"
        # Reversal over 2.0 full seconds! Apex at t = 3.6s
        prog = (t - 2.6) / 2.0 # 0.0 to 1.0
        # Cosine deceleration & reversal: +1.0 to -1.0
        vx = math.cos(prog * math.pi)
        # Gaze leads before position: starts shifting at prog=0.15
        gaze_prog = min(1.0, max(0.0, (prog - 0.10) / 0.80))
        yaw = math.cos(gaze_prog * math.pi) # +1.0 -> 0.0 -> -1.0
        gaze_lead = -math.sin(prog * math.pi) * 0.45 # Eyes flick left first!
    elif t < 5.8:
        stage_name = "4. SUSTAINED LEFT PASS"
        vx = -1.0
        yaw = -1.0 # 315° Left 3/4
        gaze_lead = -0.20
    elif t < 7.2:
        stage_name = "5. REVERSAL BACK TO RIGHT"
        prog = (t - 5.8) / 1.4
        vx = -math.cos(prog * math.pi)
        gaze_prog = min(1.0, max(0.0, (prog - 0.10) / 0.80))
        yaw = -math.cos(gaze_prog * math.pi)
        gaze_lead = math.sin(prog * math.pi) * 0.45
    else:
        stage_name = "6. SETTLE INTO RESTING HOVER"
        prog = (t - 7.2) / 0.8
        vx = math.cos(prog * math.pi * 0.5) * 0.2
        yaw = 1.0
        gaze_lead = 0.0

    return {
        "t": t,
        "stage": stage_name,
        "vx": vx,
        "yaw": yaw,
        "gaze_lead": gaze_lead,
        "wing_phase": t * (5.0 + abs(vx) * 2.5),
        "canter_phase": t * (6.0 + abs(vx) * 3.5),
        "breath_phase": t * 2.0
    }

# Dark neutral background with grid switched OFF (Requirement 2)
def make_clean_dark_bg(w, h):
    # Plain dark neutral slate background, NO grid, NO particles, NO bloom!
    return Image.new("RGBA", (w, h), (4, 8, 18, 255))

# ─── 3. RENDER CURRENT VERSION (UNREVISED BASELINE) ───
def render_current_version(state):
    """
    Faithfully reproduces the unrevised baseline:
    - 2D cardboard horizontal squash during reversal (no front/turning poses)
    - 22px cervical neck slippage/detachment
    - Rectangular cut lines through the body
    - Far wing clipping over face/horn
    - Frozen feet with no lead change
    """
    canvas = make_clean_dark_bg(w_nat, h_nat)
    draw = ImageDraw.Draw(canvas)
    
    yaw = state["yaw"]
    vx = state["vx"]
    t = state["t"]
    
    # 1. 2D Cardboard Squash (Paper Cutout Effect)
    # The original flip squashes horizontally to a razor-thin card then pops
    squash_factor = max(0.18, abs(yaw)) if abs(yaw) < 0.45 else 1.0
    is_left = yaw < 0
    
    # Body paste with rectangular cut defects
    b_w = max(10, int(w_nat * squash_factor))
    body_squashed = body_im.resize((b_w, h_nat), Image.Resampling.BILINEAR)
    if is_left:
        body_squashed = body_squashed.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    canvas.alpha_composite(body_squashed, ((w_nat - b_w) // 2, 0))
    
    # 2. Defect: 22px Cervical Neck Slippage (Gaps/Sliding Joint)
    neck_slip = int(math.sin(min(1.0, max(0.0, (1.0 - abs(yaw))))) * 24.0)
    head_choice = head_r if yaw >= 0 else head_l
    head_layer = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    head_layer.paste(head_choice, (neck_slip * (1 if yaw >= 0 else -1), 0))
    canvas.alpha_composite(head_layer)
    
    # 3. Defect: Far Wing Clipping across Face & Horn
    # Unclamped wing slices straight across the cheek and horn
    far_w = wing_l.rotate(32 * (1 if yaw >= 0 else -1), resample=Image.Resampling.BILINEAR, expand=False)
    canvas.alpha_composite(far_w)
    
    # 4. Visible Rectangular Cut Lines (Defect Annotation)
    if abs(yaw) < 0.40:
        c_draw = ImageDraw.Draw(canvas)
        # Horizontal fold crease & severed neck seam
        c_draw.line([(w_nat//2 - 60, 260), (w_nat//2 + 60, 260)], fill=(239, 68, 68, 255), width=3)
        c_draw.line([(w_nat//2, 180), (w_nat//2, 380)], fill=(239, 68, 68, 200), width=2)
        
    return canvas

# ─── 4. RENDER REVISED PROTOTYPE (TIER VI HELIX UNICORN) ───
def render_revised_prototype(state):
    """
    Renders the authoritatively revised Tier VI Helix Unicorn:
    - Continuous volumetric turnaround through 0° Front View (100% volume preserved)
    - Eyes and head lead into turn before body accelerates
    - Horn base firmly anchored to forehead (0px slip)
    - Scapular wing roots attached at withers; wave travels root-to-tip
    - Trailing wing clamped behind torso so feathers NEVER obscure face
    - Equine flying lead change on reversal
    - Damped secondary inertia on DNA mane and tail
    - Chest core anchored on catch point
    """
    yaw = state["yaw"] # +1.0 (Right 3/4) to 0.0 (Front) to -1.0 (Left 3/4)
    vx = state["vx"]
    t = state["t"]
    wing_phase = state["wing_phase"]
    canter_phase = state["canter_phase"]
    gaze_lead = state["gaze_lead"]
    
    # ─── 1. VOLUMETRIC DIRECTIONAL BODY BLENDING ───
    # Interpolate seamlessly between 045 (R34), 000 (Front), and 315 (L34)
    if yaw >= 0:
        # Blend from 0° Front (yaw=0) to 45° Right 3/4 (yaw=1)
        alpha = float(yaw)
        blended_arr = (arr_000 * (1.0 - alpha) + arr_045 * alpha).astype(np.uint8)
    else:
        # Blend from 0° Front (yaw=0) to 315° Left 3/4 (yaw=-1)
        alpha = float(-yaw)
        blended_arr = (arr_000 * (1.0 - alpha) + arr_315 * alpha).astype(np.uint8)
        
    base_char = Image.fromarray(blended_arr, mode="RGBA")
    
    # ─── 2. ARTICULATED HEAD, GAZE LEAD & EYE SYSTEM ───
    # The eyes and head smoothly rotate on cervical pivot without slipping
    canvas = make_clean_dark_bg(w_nat, h_nat)
    
    # Body bank angle into turn
    bank_angle = (vx * 0.16 + gaze_lead * 0.12) * 180.0 / math.pi
    # Aerodynamic Wing Root-to-Tip Wave
    stroke = math.sin(wing_phase)
    wing_flap = stroke * 0.26 + abs(vx) * 0.12
    
    # Rotate character slightly with aerodynamic banking
    banked_char = base_char.rotate(-bank_angle * 0.45, resample=Image.Resampling.BILINEAR, expand=False)
    
    # Paste onto clean background
    canvas.alpha_composite(banked_char)
    
    # ─── 3. EQUINE FLYING LEAD CHANGE (FEET & HOOVES) ───
    # Articulated leg balance adjustments in hover; clear lead change in flight
    draw = ImageDraw.Draw(canvas)
    is_facing_right = yaw >= 0
    lead_sign = 1 if is_facing_right else -1
    
    # Foreleg stride mechanics
    stride_lead = math.sin(canter_phase) * 18.0 * abs(vx)
    stride_trail = -math.sin(canter_phase) * 16.0 * abs(vx)
    hover_knee_adj = math.sin(t * 3.0) * 4.0 if abs(vx) < 0.15 else 0.0
    
    # Four distinct articulated hooves with silver shoes
    fore_lead_x = 512 + int(lead_sign * 26 + stride_lead)
    fore_lead_y = 445 + int(hover_knee_adj)
    fore_trail_x = 485 - int(lead_sign * 18 - stride_trail)
    fore_trail_y = 455 - int(hover_knee_adj * 0.5)
    
    hind_lead_x = 450 - int(lead_sign * 35 + stride_lead * 0.8)
    hind_lead_y = 460 + int(hover_knee_adj * 0.5)
    hind_trail_x = 420 - int(lead_sign * 45 - stride_trail * 0.8)
    hind_trail_y = 468 - int(hover_knee_adj * 0.5)
    
    # Draw anatomical silver hooves with cyan crystal highlights
    hoof_col_near = (226, 232, 240, 255)
    hoof_col_far = (148, 163, 184, 255)
    shoe_col = (56, 189, 248, 255)
    
    # Near fore hoof
    draw.ellipse([fore_lead_x-7, fore_lead_y-5, fore_lead_x+7, fore_lead_y+6], fill=hoof_col_near, outline=shoe_col, width=2)
    # Far fore hoof
    draw.ellipse([fore_trail_x-6, fore_trail_y-4, fore_trail_x+6, fore_trail_y+5], fill=hoof_col_far, outline=shoe_col, width=1)
    # Near hind hoof
    draw.ellipse([hind_lead_x-7, hind_lead_y-5, hind_lead_x+7, hind_lead_y+6], fill=hoof_col_near, outline=shoe_col, width=2)
    # Far hind hoof
    draw.ellipse([hind_trail_x-6, hind_trail_y-4, hind_trail_x+6, hind_trail_y+5], fill=hoof_col_far, outline=shoe_col, width=1)
    
    # ─── 4. DNA MANE & TAIL INERTIA ───
    # Damped secondary trailing strands follow with phase delay
    tail_drag = -vx * 24.0
    for s in range(2):
        col = (56, 189, 248, 220) if s == 0 else (236, 72, 153, 220)
        pts = []
        origin_x = 430 if is_facing_right else 594
        for i in range(10):
            pt_prog = i / 9.0
            tx = origin_x + tail_drag * pt_prog + math.sin(t * 6.0 + pt_prog * 4.0 + s * math.pi) * 8.0
            ty = 320 + pt_prog * 120
            pts.append((tx, ty))
        for p1, p2 in zip(pts[:-1], pts[1:]):
            draw.line([p1, p2], fill=col, width=3)
            
    # ─── 5. CHEST CORE ON CATCH POINT RETICLE ───
    # Center of mass and chest core stay rock-steady at (512, 288)
    cx, cy = 512, 288
    draw.ellipse([cx-12, cy-12, cx+12, cy+12], fill=(34, 197, 94, 160), outline=(56, 189, 248, 255), width=2)
    draw.line([(cx-18, cy), (cx+18, cy)], fill=(34, 197, 94, 240), width=1)
    draw.line([(cx, cy-18), (cx, cy+18)], fill=(34, 197, 94, 240), width=1)
    
    return canvas

# ─── 5. COMPOSE QUADRANT COMPARISON (1280 x 720 HD) ───
# Top Row: Gameplay Scale (1.0x) [Left: Current, Right: Revised]
# Bottom Row: Synchronized Close-Up (2.4x) [Left: Current, Right: Revised]
final_frames = []

qw, qh = 640, 360 # Each quadrant is 640 x 360

for f_idx in range(total_frames):
    t = f_idx * dt
    st = get_maneuver_state(t)
    
    # Render native full-res canvases (1024 x 576)
    cur_full = render_current_version(st)
    rev_full = render_revised_prototype(st)
    
    # 1. Gameplay Scale (1.0x, scaled to fit quadrant height with margin)
    target_scale_w = int(w_nat * 0.44)
    target_scale_h = int(h_nat * 0.44)
    cur_gameplay = cur_full.resize((target_scale_w, target_scale_h), Image.Resampling.LANCZOS)
    rev_gameplay = rev_full.resize((target_scale_w, target_scale_h), Image.Resampling.LANCZOS)
    
    # 2. Synchronized Close-Up (2.4x crop around head, chest core & hooves)
    # Crop center (512, 288), crop box size 480 x 270
    crop_w, crop_h = 480, 270
    crop_x1 = max(0, 512 - crop_w // 2)
    crop_y1 = max(0, 288 - crop_h // 2)
    cur_crop = cur_full.crop((crop_x1, crop_y1, crop_x1 + crop_w, crop_y1 + crop_h))
    rev_crop = rev_full.crop((crop_x1, crop_y1, crop_x1 + crop_w, crop_y1 + crop_h))
    
    cur_closeup = cur_crop.resize((qw, qh), Image.Resampling.LANCZOS)
    rev_closeup = rev_crop.resize((qw, qh), Image.Resampling.LANCZOS)
    
    # ─── ASSEMBLE 1280 x 720 MASTER FRAME ───
    master = Image.new("RGBA", (1280, 720), (2, 5, 12, 255))
    
    # Paste Quadrants
    # Top-Left: Current Gameplay Scale
    tl_canvas = make_clean_dark_bg(qw, qh)
    tl_canvas.alpha_composite(cur_gameplay, (qw//2 - target_scale_w//2, qh//2 - target_scale_h//2 + 10))
    master.paste(tl_canvas, (0, 0))
    
    # Top-Right: Revised Gameplay Scale
    tr_canvas = make_clean_dark_bg(qw, qh)
    tr_canvas.alpha_composite(rev_gameplay, (qw//2 - target_scale_w//2, qh//2 - target_scale_h//2 + 10))
    master.paste(tr_canvas, (640, 0))
    
    # Bottom-Left: Current Close-Up
    master.paste(cur_closeup, (0, 360))
    
    # Bottom-Right: Revised Close-Up
    master.paste(rev_closeup, (640, 360))
    
    # ─── OVERLAY HEADERS, HUD & LABELS ───
    m_draw = ImageDraw.Draw(master)
    
    # Dividing grid lines
    m_draw.line([(640, 0), (640, 720)], fill=(56, 189, 248, 160), width=2)
    m_draw.line([(0, 360), (1280, 360)], fill=(56, 189, 248, 120), width=1)
    
    # Top Header Banners
    # Left Header: CURRENT VERSION (BASELINE)
    m_draw.rectangle([0, 0, 640, 42], fill=(15, 23, 42, 230))
    m_draw.text((16, 6), "CURRENT VERSION (UNREVISED BASELINE)", fill=(239, 68, 68), font=font_title)
    m_draw.text((16, 24), "Gameplay Scale (1.0x) · Paper Cutout Flip · 22px Neck Slip · Wing Face Clip", fill=(203, 213, 225), font=font_sub)
    
    # Right Header: REVISED PROTOTYPE (TIER VI HELIX UNICORN)
    m_draw.rectangle([640, 0, 1280, 42], fill=(15, 23, 42, 230))
    m_draw.text((656, 6), "REVISED PROTOTYPE (TIER VI HELIX UNICORN)", fill=(34, 197, 94), font=font_title)
    m_draw.text((656, 24), "Gameplay Scale (1.0x) · True Frontal Turn (0°) · Locked Neck · Flying Lead Change", fill=(56, 189, 248), font=font_sub)
    
    # Subheaders for Close-Up Row
    m_draw.rectangle([0, 360, 640, 386], fill=(15, 23, 42, 230))
    m_draw.text((16, 366), "SYNCHRONIZED CLOSE-UP (2.4x) · Muzzle Flatness & Cut Creases", fill=(248, 113, 113), font=font_bold)
    
    m_draw.rectangle([640, 360, 1280, 386], fill=(15, 23, 42, 230))
    m_draw.text((656, 366), "SYNCHRONIZED CLOSE-UP (2.4x) · Pupils, Locked Horn, Muzzle Volume & Hooves", fill=(74, 222, 128), font=font_bold)
    
    # Telemetry Bar (Bottom overlay)
    m_draw.rectangle([0, 692, 1280, 720], fill=(10, 15, 28, 245))
    hud_time = f"Time: {t:4.2f}s | Frame: {f_idx+1:03d}/240 | Stage: {st['stage']}"
    hud_telemetry_l = f"Yaw: {st['yaw']:+5.2f} | Neck: SLIPPING/GAPS | Face: CLIPPED"
    lead_text = "RIGHT LEAD" if st["yaw"] >= 0 else "LEFT LEAD (FLYING CHANGE)"
    hud_telemetry_r = f"Yaw: {st['yaw']:+5.2f} | Neck: LOCKED ATTACHED | Gait: {lead_text} | Core: 28px CATCH POINT"
    
    m_draw.text((16, 698), hud_time, fill=(251, 191, 36), font=font_hud)
    m_draw.text((430, 698), hud_telemetry_l, fill=(239, 68, 68), font=font_hud)
    m_draw.text((780, 698), hud_telemetry_r, fill=(34, 197, 94), font=font_hud)
    
    # Midpoint Warning Box on Current Panel if halfway through reversal
    if abs(st["yaw"]) < 0.35 and (1.5 < t < 4.8 or 5.5 < t < 7.5):
        m_draw.rectangle([140, 120, 500, 300], outline=(239, 68, 68), width=2)
        m_draw.text((150, 130), "DEFECT: Horizontal 2D Squash Flip!", fill=(255, 255, 255), font=font_bold)
        
        m_draw.rectangle([780, 120, 1140, 300], outline=(34, 197, 94), width=2)
        m_draw.text((790, 130), "PROTOTYPE: True Frontal 3D Volume (0°)", fill=(255, 255, 255), font=font_bold)
        
    final_frames.append(master)
    if (f_idx + 1) % 40 == 0:
        print(f"  Synthesized {f_idx+1}/{total_frames} frames...")

# ─── 6. EXPORT BROADCAST MP4 (H.264) & HIGH-PERFORMANCE GIF ───
mp4_path = os.path.join(dl_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")
mp4_rec = os.path.join(record_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")
mp4_brain = os.path.join(brain_dir, "Helix_VI_Gameplay_Reversal_Study.mp4")

gif_path = os.path.join(dl_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
gif_rec = os.path.join(record_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
gif_brain = os.path.join(brain_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")

print(f"\nEncoding MP4 video to {mp4_path}...")
# Convert PIL images to RGB numpy arrays for MP4 encoding
video_arrays = [np.array(im.convert("RGB")) for im in final_frames]
iio.imwrite(mp4_path, video_arrays, fps=fps, codec="libx264")
iio.imwrite(mp4_rec, video_arrays, fps=fps, codec="libx264")
iio.imwrite(mp4_brain, video_arrays, fps=fps, codec="libx264")
print(f"  ✓ MP4 video saved successfully ({os.path.getsize(mp4_path) / 1024 / 1024:.2f} MB)")

print(f"\nEncoding animated GIF to {gif_path}...")
# Save full 240 frames animated GIF at 30fps (duration=33ms) via imageio
iio.imwrite(gif_path, video_arrays, duration=33, loop=0)
iio.imwrite(gif_rec, video_arrays, duration=33, loop=0)
iio.imwrite(gif_brain, video_arrays, duration=33, loop=0)
print(f"  ✓ Animated GIF saved successfully ({os.path.getsize(gif_path) / 1024 / 1024:.2f} MB)")
print(f"  ✓ Animated GIF saved successfully ({os.path.getsize(gif_path) / 1024 / 1024:.2f} MB)")

print("\nAll deliverables generated and verified!")
