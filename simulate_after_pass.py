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

def simulate_after(game, tier, fps=30, total_sec=10.0):
    total_frames = int(fps * total_sec)
    base_k = f"{game}_{tier.lower()}"
    
    body = Image.open(os.path.join(rig_dir, f"{base_k}_body.png")).convert("RGBA")
    head_r = Image.open(os.path.join(rig_dir, f"{base_k}_head_r34.png")).convert("RGBA")
    head_f = Image.open(os.path.join(rig_dir, f"{base_k}_head_front.png")).convert("RGBA")
    head_l = Image.open(os.path.join(rig_dir, f"{base_k}_head_l34.png")).convert("RGBA")
    wl = Image.open(os.path.join(rig_dir, f"{base_k}_wing_l.png")).convert("RGBA")
    wr = Image.open(os.path.join(rig_dir, f"{base_k}_wing_r.png")).convert("RGBA")
    
    w_nat, h_nat = body.size
    frames = []
    reversal_frames = []
    
    x, y = 960.0, 780.0
    vx, vy = 0.0, 0.0
    yaw = 0.35
    head_angle = 0.0
    body_bank = 0.0
    wing_cycle = 0.0
    breath_phase = 0.0
    weight_shift_x = 0.0
    
    dt = 1.0 / fps
    
    for f in range(total_frames):
        t = f * dt
        target_x, target_y = 960.0, 780.0
        is_reversal = False
        
        if t < 1.5:
            target_x = 960.0; target_y = 780.0
        elif t < 3.5:
            target_x = 420.0; target_y = 780.0
        elif t < 5.0:
            target_x = 420.0; target_y = 780.0
        elif t < 7.0:
            target_x = 1500.0; target_y = 780.0
            is_reversal = True
        elif t < 8.2:
            target_x = 1100.0; target_y = 520.0
        elif t < 9.2:
            target_x = 960.0; target_y = 860.0
        else:
            target_x = 960.0; target_y = 780.0
            
        dx = target_x - x
        dy = target_y - y
        vx = (vx + dx * 13.5 * dt) * (0.74 ** (dt * 60))
        vy = (vy + dy * 13.5 * dt) * (0.74 ** (dt * 60))
        x += vx * dt
        y += vy * dt
        
        norm_vx = max(-1.0, min(1.0, vx / 14.0))
        norm_vy = max(-1.0, min(1.0, vy / 12.0))
        norm_ax = max(-1.0, min(1.0, (dx * 13.5) / 80.0))
        
        # v5 Logic: Gaze leads, head turns smoothly, weight shifts
        if abs(norm_vx) > 0.10:
            target_yaw = 1.0 if norm_vx > 0 else -1.0
            yaw += (target_yaw - yaw) * 6.5 * dt
        else:
            hover_yaw = 0.35 if yaw > 0 else -0.35
            yaw += (hover_yaw - yaw) * 4.0 * dt
            
        target_head = norm_vx * 0.32 + norm_ax * 0.18
        head_angle += (target_head - head_angle) * 12.0 * dt
        
        target_bank = norm_vx * 0.22 + norm_ax * 0.24
        body_bank += (target_bank - body_bank) * 8.5 * dt
        weight_shift_x = norm_vx * 8.0
        
        is_hover = abs(norm_vx) < 0.12 and abs(norm_vy) < 0.12
        flap_freq = 4.8 if is_hover else (5.6 + abs(norm_vx) * 2.8)
        wing_cycle += dt * flap_freq
        
        stroke_phase = wing_cycle % (math.pi * 2)
        is_downstroke = stroke_phase < math.pi * 0.85
        wing_flap = (math.cos((stroke_phase / (math.pi * 0.85)) * math.pi) * 0.32 + 0.06) if is_downstroke else (-math.cos(((stroke_phase - math.pi * 0.85) / (math.pi * 1.15)) * math.pi) * 0.32 + 0.06)
        
        lead_wing_lift = abs(norm_vx) * 0.22
        trail_wing_sweep = abs(norm_vx) * 0.16
        
        # Render Frame
        canvas = Image.new("RGBA", (1280, 720), (6, 10, 20, 255))
        draw = ImageDraw.Draw(canvas)
        
        cx = int(x * 1280 / 1920)
        cy = int(y * 720 / 1080)
        draw.ellipse([cx-20, cy-20, cx+20, cy+20], outline=(34, 197, 94, 255), width=2)
        
        cw, ch = 520, 292
        char_img = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
        
        is_facing_right = yaw >= 0
        far_sign = 1 if is_facing_right else -1
        near_sign = 1 if is_facing_right else -1
        
        # 1. Far Wing (clamped to never cross face!)
        far_flap = wing_flap - (trail_wing_sweep * far_sign)
        clamped_far = max(-0.45, min(0.55, far_flap + body_bank * 0.15))
        far_raw = wl if is_facing_right else wr
        far_rot = far_raw.rotate(-clamped_far * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
        far_dim = ImageEnhance.Brightness(far_rot).enhance(0.75)
        char_img.alpha_composite(far_dim)
        
        # 2. Torso with kinetic weight shift
        body_shifted = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
        body_shifted.paste(body, (int(weight_shift_x), 0))
        char_img.alpha_composite(body_shifted)
        
        # 3. Directional Head (R34, Front, L34)
        if yaw > 0.35:
            active_h = head_r
        elif yaw < -0.35:
            active_h = head_l
        else:
            active_h = head_f
            
        head_rot = active_h.rotate(-head_angle * 0.65 * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
        char_img.alpha_composite(head_rot)
        
        # 4. Near Wing (clamped to never cross face!)
        near_flap = wing_flap + (lead_wing_lift * near_sign)
        clamped_near = max(-0.45, min(0.60, near_flap + body_bank * 0.25))
        near_raw = wr if is_facing_right else wl
        near_rot = near_raw.rotate(-clamped_near * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
        near_lit = ImageEnhance.Brightness(near_rot).enhance(1.15)
        char_img.alpha_composite(near_lit)
        
        # Composite scaled
        char_scaled = char_img.resize((cw, ch), Image.Resampling.LANCZOS)
        char_final = char_scaled.rotate(-body_bank * 0.32 * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
        canvas.alpha_composite(char_final, (cx - cw // 2, cy - ch // 2))
        
        # HUD Readout
        draw.text((20, 20), f"v5 REBUILT {game.upper()} {tier.upper()} | Time: {t:.2f}s | Yaw: {yaw:.2f} | Head: {head_angle*180/math.pi:.1f}°", fill=(255, 255, 255))
        draw.text((20, 40), f"Action: {'REVERSING RIGHT (WEIGHT SHIFT & LEAD WING)' if is_reversal else 'STEERING LEFT (HEAD & LEAD WING)' if t < 5.0 else 'HOVER EQUILIBRIUM'}", fill=(56, 189, 248))
        
        frames.append(canvas)
        if is_reversal and f % 2 == 0:
            reversal_frames.append(canvas)
            
    # Save After Maneuver GIF
    after_gif = os.path.join(record_dir, f"After_{game}_{tier.lower()}_maneuver.gif")
    frames[::2][0].save(after_gif, save_all=True, append_images=frames[::2][1:], duration=66, loop=0)
    
    # Save After Slow Reversal GIF
    after_rev = os.path.join(record_dir, f"After_{game}_{tier.lower()}_slow_reversal.gif")
    if reversal_frames:
        reversal_frames[0].save(after_rev, save_all=True, append_images=reversal_frames[1:], duration=100, loop=0)
        
    print(f"  ✓ {game.capitalize()} {tier.upper()}: Generated After maneuver ({after_gif}) and slow reversal ({after_rev})")
    return after_gif, after_rev

def make_side_by_side_comparison(game, tier):
    before_rev_p = os.path.join(record_dir, f"Before_{game}_{tier.lower()}_slow_reversal.gif")
    after_rev_p = os.path.join(record_dir, f"After_{game}_{tier.lower()}_slow_reversal.gif")
    comp_out_p = os.path.join(record_dir, f"Comparison_{game}_{tier.lower()}_reversal.gif")
    comp_dl_p = os.path.join(dl_dir, f"Comparison_{game.capitalize()}_{tier.upper()}_Reversal.gif")
    comp_brain_p = os.path.join(brain_dir, f"Comparison_{game.capitalize()}_{tier.upper()}_Reversal.gif")
    
    if not os.path.exists(before_rev_p) or not os.path.exists(after_rev_p):
        return
        
    b_im = Image.open(before_rev_p)
    a_im = Image.open(after_rev_p)
    
    n_frames = min(b_im.n_frames, a_im.n_frames)
    comp_frames = []
    
    cw, ch = 640, 360 # Half scale each for 1280x360 side-by-side
    
    for i in range(n_frames):
        b_im.seek(i)
        a_im.seek(i)
        
        b_frame = b_im.convert("RGBA").resize((cw, ch), Image.Resampling.LANCZOS)
        a_frame = a_im.convert("RGBA").resize((cw, ch), Image.Resampling.LANCZOS)
        
        comp_canvas = Image.new("RGBA", (1280, 410), (10, 15, 28, 255))
        draw = ImageDraw.Draw(comp_canvas)
        
        # Header banner
        draw.rectangle([0, 0, 1280, 42], fill=(15, 23, 42, 255))
        draw.text((20, 12), f"BEFORE (FLAT POP / SLIDING)", fill=(239, 68, 68, 255))
        draw.text((660, 12), f"AFTER (v5 REBUILT: HEAD LEADS, WEIGHT SHIFTS, UNIFIED WINGS)", fill=(34, 197, 94, 255))
        draw.line([(640, 0), (640, 410)], fill=(56, 189, 248, 180), width=2)
        
        comp_canvas.paste(b_frame, (0, 46))
        comp_canvas.paste(a_frame, (640, 46))
        
        comp_frames.append(comp_canvas)
        
    comp_frames[0].save(comp_out_p, save_all=True, append_images=comp_frames[1:], duration=100, loop=0)
    comp_frames[0].save(comp_dl_p, save_all=True, append_images=comp_frames[1:], duration=100, loop=0)
    comp_frames[0].save(comp_brain_p, save_all=True, append_images=comp_frames[1:], duration=100, loop=0)
    print(f"  ✓ Saved side-by-side comparison: {comp_out_p}")

print("Simulating After passes and building matched side-by-side comparisons...")
for g in ["dynamo", "helix", "meteor"]:
    simulate_after(g, "vi")
    make_side_by_side_comparison(g, "vi")
print("All matched gameplay recordings and comparisons successfully generated!")
