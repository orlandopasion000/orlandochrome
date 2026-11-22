import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
record_dir = os.path.join(base_dir, "recordings")
os.makedirs(record_dir, exist_ok=True)

# Maneuver phases for 10 seconds at 30 fps (300 frames)
# 0.0 - 1.5s (0-45): Hover
# 1.5 - 3.5s (45-105): Steer Left
# 3.5 - 5.0s (105-150): Hold Left
# 5.0 - 7.0s (150-210): Reverse Right
# 7.0 - 8.2s (210-246): Climb
# 8.2 - 9.2s (246-276): Brake
# 9.2 - 10.0s (276-300): Release & Settle Hover

def simulate_maneuver(game, tier, fps=30, total_sec=10.0):
    total_frames = int(fps * total_sec)
    base_k = f"{game}_{tier.lower()}"
    
    # Load rig parts
    body = Image.open(os.path.join(rig_dir, f"{base_k}_body.png")).convert("RGBA")
    head_r = Image.open(os.path.join(rig_dir, f"{base_k}_head_r34.png")).convert("RGBA")
    head_f = Image.open(os.path.join(rig_dir, f"{base_k}_head_front.png")).convert("RGBA")
    head_l = Image.open(os.path.join(rig_dir, f"{base_k}_head_l34.png")).convert("RGBA")
    wl = Image.open(os.path.join(rig_dir, f"{base_k}_wing_l.png")).convert("RGBA")
    wr = Image.open(os.path.join(rig_dir, f"{base_k}_wing_r.png")).convert("RGBA")
    
    w_nat, h_nat = body.size
    frames = []
    reversal_frames = []
    
    # State
    x, y = 960.0, 780.0
    vx, vy = 0.0, 0.0
    yaw = 0.35
    head_angle = 0.0
    body_bank = 0.0
    wing_cycle = 0.0
    breath_phase = 0.0
    
    dt = 1.0 / fps
    
    for f in range(total_frames):
        t = f * dt
        
        # Inputs
        target_x, target_y = 960.0, 780.0
        is_reversal = False
        
        if t < 1.5:
            target_x = 960.0
            target_y = 780.0
        elif t < 3.5:
            target_x = 420.0
            target_y = 780.0
        elif t < 5.0:
            target_x = 420.0
            target_y = 780.0
        elif t < 7.0:
            target_x = 1500.0
            target_y = 780.0
            is_reversal = True
        elif t < 8.2:
            target_x = 1100.0
            target_y = 520.0
        elif t < 9.2:
            target_x = 960.0
            target_y = 860.0
        else:
            target_x = 960.0
            target_y = 780.0
            
        dx = target_x - x
        dy = target_y - y
        vx = (vx + dx * 13.5 * dt) * (0.74 ** (dt * 60))
        vy = (vy + dy * 13.5 * dt) * (0.74 ** (dt * 60))
        x += vx * dt
        y += vy * dt
        
        norm_vx = max(-1.0, min(1.0, vx / 14.0))
        norm_vy = max(-1.0, min(1.0, vy / 12.0))
        
        # Current logic
        target_yaw = 1.0 if norm_vx > 0.12 else -1.0 if norm_vx < -0.12 else yaw
        yaw += (target_yaw - yaw) * 7.5 * dt
        
        target_head = norm_vx * 0.38
        head_angle += (target_head - head_angle) * 14.0 * dt
        
        target_bank = norm_vx * 0.20
        body_bank += (target_bank - body_bank) * 9.0 * dt
        
        wing_cycle += dt * (6.6 + abs(norm_vx) * 3.4)
        breath_phase += dt * 2.6
        
        # Render Frame
        canvas = Image.new("RGBA", (1280, 720), (6, 10, 20, 255))
        draw = ImageDraw.Draw(canvas)
        
        # Draw catch reticle at (x*1280/1920, y*720/1080)
        cx = int(x * 1280 / 1920)
        cy = int(y * 720 / 1080)
        draw.ellipse([cx-20, cy-20, cx+20, cy+20], outline=(34, 197, 94, 255), width=2)
        
        # Character scale at normal gameplay size (480x270)
        cw, ch = 520, 292
        char_img = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
        
        is_facing_right = yaw >= 0
        far_wing = wl if is_facing_right else wr
        near_wing = wr if is_facing_right else wl
        
        char_img.alpha_composite(far_wing)
        char_img.alpha_composite(body)
        
        # Head choice
        if yaw > 0.35:
            active_h = head_r
        elif yaw < -0.35:
            active_h = head_l
        else:
            active_h = head_f
            
        char_img.alpha_composite(active_h)
        char_img.alpha_composite(near_wing)
        
        # Scale to gameplay size and paste at cx, cy
        char_scaled = char_img.resize((cw, ch), Image.Resampling.LANCZOS)
        char_rot = char_scaled.rotate(-body_bank * 180 / math.pi, resample=Image.Resampling.BILINEAR, expand=False)
        canvas.alpha_composite(char_rot, (cx - cw // 2, cy - ch // 2))
        
        # Draw HUD info
        draw.text((20, 20), f"{game.upper()} {tier.upper()} | Time: {t:.2f}s | Yaw: {yaw:.2f} | Bank: {body_bank*180/math.pi:.1f}°", fill=(255, 255, 255))
        draw.text((20, 40), f"Action: {'REVERSING RIGHT' if is_reversal else 'STEERING LEFT' if t < 5.0 else 'HOVER/BRAKE'}", fill=(56, 189, 248))
        
        frames.append(canvas)
        if is_reversal and f % 2 == 0:
            reversal_frames.append(canvas)
            
    # Save GIF
    gif_path = os.path.join(record_dir, f"Before_{game}_{tier.lower()}_maneuver.gif")
    frames[::2][0].save(gif_path, save_all=True, append_images=frames[::2][1:], duration=66, loop=0)
    print(f"Saved: {gif_path} ({len(frames[::2])} frames)")
    
    # Save slow reversal GIF
    rev_path = os.path.join(record_dir, f"Before_{game}_{tier.lower()}_slow_reversal.gif")
    if reversal_frames:
        reversal_frames[0].save(rev_path, save_all=True, append_images=reversal_frames[1:], duration=100, loop=0)
        print(f"Saved Slow Reversal: {rev_path} ({len(reversal_frames)} frames)")

print("Simulating baseline passes for Dynamo VI, Helix VI, and Meteor VI...")
for g in ["dynamo", "helix", "meteor"]:
    simulate_maneuver(g, "vi")
print("Baseline passes generated!")
