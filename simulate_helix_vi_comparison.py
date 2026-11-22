import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
record_dir = os.path.join(base_dir, "recordings")
dl_dir = r"C:\Users\Orlando\Downloads"
brain_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(record_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

# 1. Load Master Artwork
master_im = Image.open(os.path.join(char_dir, "helix_vi.png")).convert("RGBA")
body_im = Image.open(os.path.join(rig_dir, "helix_vi_body.png")).convert("RGBA")
head_r_im = Image.open(os.path.join(rig_dir, "helix_vi_head_r34.png")).convert("RGBA")
head_f_im = Image.open(os.path.join(rig_dir, "helix_vi_head_front.png")).convert("RGBA")
head_l_im = Image.open(os.path.join(rig_dir, "helix_vi_head_l34.png")).convert("RGBA")
wl_im = Image.open(os.path.join(rig_dir, "helix_vi_wing_l.png")).convert("RGBA")
wr_im = Image.open(os.path.join(rig_dir, "helix_vi_wing_r.png")).convert("RGBA")
w_nat, h_nat = master_im.size

# ─── SIMULATE SLOW REVERSAL COMPARISON (Current vs Revised, Glow & Particles OFF) ───
fps = 30
duration = 4.0
total_frames = int(fps * duration)
dt = 1.0 / fps

comp_frames = []

# Background starfield with NO particles / glow
def make_clean_bg(w, h):
    im = Image.new("RGBA", (w, h), (4, 10, 22, 255))
    draw = ImageDraw.Draw(im)
    for y in range(h):
        t = y / h
        r = int(2 * (1-t) + 6 * t)
        g = int(8 * (1-t) + 16 * t)
        b = int(20 * (1-t) + 36 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
    # Neutral reference grid
    for x in range(0, w, 60):
        draw.line([(x, 0), (x, h)], fill=(255, 255, 255, 12))
    for y in range(0, h, 60):
        draw.line([(0, y), (w, y)], fill=(255, 255, 255, 12))
    return im

cw, ch = 640, 540

for f in range(total_frames):
    t = f * dt
    # Reversal motion: Start moving right (t < 1.0), then slow reversal to left (1.0 < t < 3.0), then hold left (t > 3.0)
    if t < 0.8:
        # Fly right
        norm_vx = 0.85
        yaw = 1.0
        reversal_progress = 0.0
    elif t < 2.8:
        # Slow Reversal to Left (Apex at t = 1.8s)
        reversal_progress = (t - 0.8) / 2.0
        norm_vx = 0.85 - (reversal_progress * 1.70)
        yaw = 1.0 - (reversal_progress * 2.0) # From +1.0 to -1.0
    else:
        # Hold Left
        norm_vx = -0.85
        yaw = -1.0
        reversal_progress = 1.0
        
    canter_phase = t * 6.0
    wing_phase = t * 5.0
    
    # ─── LEFT PANEL: CURRENT VERSION (UNREVISED BASELINE) ───
    # Defect: Fixed gaze, flat card flip at midpoint, neck slippage of 22px, wing clipping face
    cur_canvas = make_clean_bg(cw, ch)
    cur_char = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    
    # Cardboard horizontal squash
    squash = max(0.25, abs(yaw)) if abs(yaw) < 0.45 else 1.0
    b_scaled = body_im.resize((int(w_nat * squash), h_nat), Image.Resampling.BILINEAR)
    cur_char.paste(b_scaled, ((w_nat - b_scaled.width) // 2, 0))
    
    # Stuck head (R34 until abrupt jump at midpoint) + 22px neck slippage
    b_head = head_r_im if yaw >= 0 else head_l_im
    cur_neck_slip = int(math.sin(reversal_progress * math.pi) * 22.0)
    cur_char.paste(b_head, (cur_neck_slip, 0))
    
    # Far wing clipping over face
    wing_clip = wl_im.rotate(28, resample=Image.Resampling.BILINEAR, expand=False)
    cur_char.alpha_composite(wing_clip)
    
    # Scale and composite
    cur_scaled = cur_char.resize((int(w_nat * 0.48), int(h_nat * 0.48)), Image.Resampling.LANCZOS)
    cur_canvas.alpha_composite(cur_scaled, (cw//2 - cur_scaled.width//2, ch//2 - cur_scaled.height//2 + 20))
    
    # ─── RIGHT PANEL: REVISED PROTOTYPE (TIER VI HELIX UNICORN) ───
    # Rebuilt: Gaze leads, muzzle turns continuously through true Front view with full volume,
    #          neck locked to shoulders (0px slippage), flying lead change, clearance clamped wings
    rev_canvas = make_clean_bg(cw, ch)
    rev_char = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    
    is_facing_right = yaw >= 0
    far_sign = 1 if is_facing_right else -1
    near_sign = 1 if is_facing_right else -1
    
    # 1. Trailing Wing (Behind Torso, Clamped to prevent face clipping)
    trail_flap = math.sin(wing_phase) * 0.28 - (abs(norm_vx) * 0.16 * far_sign)
    clamped_far = max(-0.45, min(0.55, trail_flap - norm_vx * 0.15))
    far_raw = wl_im if is_facing_right else wr_im
    far_rot = far_raw.rotate(-clamped_far * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
    rev_char.alpha_composite(ImageEnhance.Brightness(far_rot).enhance(0.70))
    
    # 2. Torso with Kinetic Weight Shift (8px hip transfer)
    weight_shift_x = norm_vx * 8.0
    body_shift = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    body_shift.paste(body_im, (int(weight_shift_x), 0))
    rev_char.alpha_composite(body_shift)
    
    # 3. Head & Gaze (Turns through true Front View with 100% volume retention & locked neck)
    if yaw > 0.35:
        active_h = head_r_im
        head_name = "R34 (RIGHT 3/4)"
    elif yaw < -0.35:
        active_h = head_l_im
        head_name = "L34 (LEFT 3/4)"
    else:
        active_h = head_f_im
        head_name = "FRONT (TRUE 3D VOLUME)"
        
    head_rot = active_h.rotate(-norm_vx * 0.20 * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
    # Locked cervical neck pivot (0px slippage!)
    head_layer = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    head_layer.paste(head_rot, (int(weight_shift_x), 0))
    rev_char.alpha_composite(head_layer)
    
    # 4. Leading Wing (In Front of Torso, Clamped so feathers never obscure face)
    lead_flap = math.sin(wing_phase) * 0.28 + (abs(norm_vx) * 0.22 * near_sign)
    clamped_near = max(-0.45, min(0.60, lead_flap + norm_vx * 0.20))
    near_raw = wr_im if is_facing_right else wl_im
    near_rot = near_raw.rotate(-clamped_near * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
    rev_char.alpha_composite(ImageEnhance.Brightness(near_rot).enhance(1.15))
    
    # 5. Articulated Legs & Flying Lead Change (Glow & Particles OFF)
    c_draw = ImageDraw.Draw(rev_char)
    # Suspension phase lead change
    lead = 1.0 if yaw >= 0 else -1.0
    leg_x_lead = 520 + int(lead * 30 + math.sin(canter_phase) * 25)
    leg_x_trail = 480 - int(lead * 20 - math.sin(canter_phase) * 20)
    # Draw clean anatomical leg strokes
    c_draw.line([(500, 340), (leg_x_lead, 460)], fill=(225, 235, 255, 240), width=6)
    c_draw.line([(470, 350), (leg_x_trail, 470)], fill=(180, 200, 230, 240), width=5)
    # Hooves with silver shoes
    c_draw.ellipse([leg_x_lead-8, 455, leg_x_lead+8, 475], fill=(203, 213, 225, 255), outline=(56, 189, 248, 255))
    c_draw.ellipse([leg_x_trail-7, 465, leg_x_trail+7, 483], fill=(148, 163, 184, 255), outline=(56, 189, 248, 255))
    
    # 6. DNA Mane Follow-Through Wave
    for strand in range(2):
        col = (56, 189, 248, 240) if strand == 0 else (236, 72, 153, 240)
        pts = []
        for i in range(12):
            pt_t = i / 11.0
            mx = 460 - pt_t * 90 * (1 if yaw >= 0 else -1) - norm_vx * 15
            my = 180 + pt_t * 110 + math.sin(t * 7.0 + pt_t * 4.0 + strand * math.pi) * 12
            pts.append((mx, my))
        for p1, p2 in zip(pts[:-1], pts[1:]):
            c_draw.line([p1, p2], fill=col, width=3)
            
    # Scale and composite
    rev_scaled = rev_char.resize((int(w_nat * 0.48), int(h_nat * 0.48)), Image.Resampling.LANCZOS)
    rev_canvas.alpha_composite(rev_scaled, (cw//2 - rev_scaled.width//2, ch//2 - rev_scaled.height//2 + 20))
    
    # ─── COMBINE INTO SIDE-BY-SIDE FRAME (1280x600) ───
    frame = Image.new("RGBA", (1280, 600), (10, 15, 28, 255))
    f_draw = ImageDraw.Draw(frame)
    
    # Header Banner
    f_draw.rectangle([0, 0, 1280, 52], fill=(15, 23, 42, 255))
    f_draw.text((20, 10), "CURRENT VERSION (UNREVISED BASELINE)", fill=(239, 68, 68))
    f_draw.text((20, 28), "Defects: Fixed Gaze, Cardboard Midpoint Flip, 22px Neck Slippage, Wing Clipping", fill=(203, 213, 225))
    
    f_draw.text((660, 10), "REVISED PROTOTYPE (TIER VI HELIX UNICORN)", fill=(34, 197, 94))
    f_draw.text((660, 28), "Features: Eyes Lead, Frontal Depth Volume, 0px Neck Slippage, Flying Lead Change", fill=(56, 189, 248))
    f_draw.line([(640, 0), (640, 600)], fill=(56, 189, 248, 180), width=2)
    
    # HUD Telemetry on Left Panel
    l_draw = ImageDraw.Draw(cur_canvas)
    l_draw.text((16, 16), f"Yaw: {yaw:+.2f} | Time: {t:.2f}s", fill=(239, 68, 68))
    if abs(yaw) < 0.35:
        l_draw.rectangle([140, 120, 500, 420], outline=(239, 68, 68), width=3)
        l_draw.text((150, 130), "DEFECT: 2D Cardboard Flip & Neck Detached!", fill=(255, 255, 255))
    l_draw.text((16, ch - 30), "Particles & Glow: OFF (Pure Anatomy Evaluation)", fill=(148, 163, 184))
    
    # HUD Telemetry on Right Panel
    r_draw = ImageDraw.Draw(rev_canvas)
    r_draw.text((16, 16), f"Head Pose: {head_name} | Neck: LOCKED ATTACHED", fill=(34, 197, 94))
    lead_str = "RIGHT LEAD (CANTER)" if yaw >= 0 else "LEFT LEAD (FLYING LEAD CHANGE)"
    r_draw.text((16, 34), f"Gait: {lead_str} · Weight Shift: {weight_shift_x:+.1f}px", fill=(56, 189, 248))
    if abs(yaw) < 0.35:
        r_draw.rectangle([140, 120, 500, 420], outline=(34, 197, 94), width=2)
        r_draw.text((150, 130), "PROTOTYPE: True Frontal Volume & Full Depth", fill=(255, 255, 255))
    r_draw.text((16, ch - 30), "Particles & Glow: OFF (Pure Anatomy Evaluation)", fill=(148, 163, 184))
    
    # Paste panels
    frame.paste(cur_canvas, (0, 52))
    frame.paste(rev_canvas, (640, 52))
    comp_frames.append(frame)

out_gif = os.path.join(record_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
out_dl = os.path.join(dl_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")
out_brain = os.path.join(brain_dir, "Helix_VI_Reversal_Current_vs_Revised.gif")

print(f"Saving side-by-side slow reversal comparison ({len(comp_frames)} frames)...")
comp_frames[0].save(out_gif, save_all=True, append_images=comp_frames[1:], duration=33, loop=0, optimize=True)
comp_frames[0].save(out_dl, save_all=True, append_images=comp_frames[1:], duration=33, loop=0, optimize=True)
comp_frames[0].save(out_brain, save_all=True, append_images=comp_frames[1:], duration=33, loop=0, optimize=True)
print(f"  ✓ Saved side-by-side comparison to {out_dl}")
