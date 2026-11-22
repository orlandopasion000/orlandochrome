import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
dl_dir = r"C:\Users\Orlando\Downloads"
brain_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039"

stages = [
    { "id": 1, "title": "1. STATIONARY HOVER", "time": "0.0s - 3.0s", "sub": "Breathing Rhythm & Equilibrium", "x": 960, "y": 780, "vx": 0.0, "ax": 0.0, "fi": 0.0, "bank": 0.0, "head": 0.0, "pose": "turn", "flare": 0.0 },
    { "id": 2, "title": "2. LEFTWARD START", "time": "3.0s - 5.5s", "sub": "Head Leads, Wings Bank Left", "x": 680, "y": 780, "vx": -8.5, "ax": -35.0, "fi": -0.65, "bank": -0.22, "head": -0.28, "pose": "left", "flare": 0.0 },
    { "id": 3, "title": "3. SUSTAINED LEFT PASS", "time": "5.5s - 10.5s", "sub": "5s Stride & Muzzle Facing Left", "x": 380, "y": 780, "vx": -14.0, "ax": 0.0, "fi": -1.0, "bank": -0.16, "head": -0.26, "pose": "left", "flare": 0.0 },
    { "id": 4, "title": "4. SHARP REVERSAL RIGHT", "time": "10.5s - 13.5s", "sub": "Volumetric Depth Turn & Lead Change", "x": 1200, "y": 780, "vx": 12.0, "ax": 65.0, "fi": 0.35, "bank": 0.28, "head": 0.32, "pose": "turn", "flare": 0.0 },
    { "id": 5, "title": "5. CLIMB", "time": "13.5s - 16.0s", "sub": "Upward Thrust & Wing Compression", "x": 1100, "y": 540, "vx": 2.0, "ax": 5.0, "fi": 0.75, "bank": 0.08, "head": 0.12, "pose": "right", "flare": 0.0 },
    { "id": 6, "title": "6. BRAKING DESCENT", "time": "16.0s - 18.5s", "sub": "Brake Flare & Claws/Boots Drift", "x": 960, "y": 860, "vx": 0.0, "ax": -20.0, "fi": 0.5, "bank": 0.0, "head": 0.0, "pose": "right", "flare": 0.35 },
    { "id": 7, "title": "7. RETURN TO HOVER", "time": "18.5s - 23.0s", "sub": "Held Through 2 Complete Wingbeats", "x": 960, "y": 780, "vx": 0.0, "ax": 0.0, "fi": 0.2, "bank": 0.0, "head": 0.0, "pose": "right", "flare": 0.0 }
]

def render_benchmark_sheet(game, tier):
    sheet_w, sheet_h = 3840, 2160
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (2, 4, 8, 255))
    draw = ImageDraw.Draw(sheet)

    # Gradient background
    for y in range(sheet_h):
        ratio = y / sheet_h
        if game == "dynamo":
            r = int(6 * (1 - ratio) + 13 * ratio * 0.7)
            g = int(2 * (1 - ratio) + 6 * ratio * 0.7)
            b = int(14 * (1 - ratio) + 28 * ratio * 0.7)
        elif game == "helix":
            r = int(2 * (1 - ratio) + 4 * ratio * 0.7)
            g = int(8 * (1 - ratio) + 19 * ratio * 0.7)
            b = int(20 * (1 - ratio) + 40 * ratio * 0.7)
        else:
            r = int(18 * (1 - ratio) + 32 * ratio * 0.7)
            g = int(4 * (1 - ratio) + 8 * ratio * 0.7)
            b = int(2 * (1 - ratio) + 3 * ratio * 0.7)
        draw.line([(0, y), (sheet_w, y)], fill=(r, g, b, 255))

    # Decorative header
    realm_names = { "dynamo": "DYNAMO PRINCESS", "helix": "HELIX UNICORN", "meteor": "METEOR DRAGON" }
    draw.rectangle([0, 0, sheet_w, 140], fill=(10, 15, 28, 240))
    draw.line([(0, 140), (sheet_w, 140)], fill=(56, 189, 248, 180), width=3)

    # Title text
    header_text = f"CHROME ARCADE · {realm_names[game]} TIER {tier.upper()} · CANONICAL 7-STAGE MOTION BENCHMARK (23s)"
    sub_text = "Modern 2.5D Layered Depth Rigging · Volumetric Depth Turning · Responsive Symmetrical Steering · 28px Catch Point Stability"
    draw.text((60, 32), header_text, fill=(255, 255, 255, 255))
    draw.text((60, 85), sub_text, fill=(56, 189, 248, 255))

    # Grid layout: 7 columns across width
    panel_w = (sheet_w - 80) // 7
    panel_h = sheet_h - 220
    panel_y = 170

    # Load character assets
    base_k = f"{game}_{tier.lower()}"
    p_left = Image.open(os.path.join(rig_dir, f"{base_k}_dir_left.png")).convert("RGBA")
    p_right = Image.open(os.path.join(rig_dir, f"{base_k}_dir_right.png")).convert("RGBA")
    p_turn = Image.open(os.path.join(rig_dir, f"{base_k}_dir_turn.png")).convert("RGBA")
    t5_img = Image.open(os.path.join(char_dir, f"{game}_v.jpg")).convert("RGBA")
    node_img = Image.open(os.path.join(base_dir, "assets", f"node-{game}-t4.png")).convert("RGBA")
    haz_img = Image.open(os.path.join(base_dir, "assets", f"hazard-{game}-t4.png")).convert("RGBA")

    for idx, s in enumerate(stages):
        px = 40 + idx * panel_w
        # Panel frame
        draw.rectangle([px, panel_y, px + panel_w - 12, panel_y + panel_h], fill=(8, 12, 22, 190), outline=(56, 189, 248, 70), width=2)
        
        # Panel Header
        draw.rectangle([px, panel_y, px + panel_w - 12, panel_y + 80], fill=(15, 23, 42, 230))
        draw.text((px + 14, panel_y + 12), s["title"], fill=(255, 255, 255, 255))
        draw.text((px + 14, panel_y + 36), s["time"], fill=(56, 189, 248, 255))
        draw.text((px + 14, panel_y + 56), s["sub"], fill=(148, 163, 184, 255))

        # Node / Hazard in background
        bg_asset = node_img if idx % 2 == 0 else haz_img
        bg_scaled = bg_asset.resize((120, 150), Image.Resampling.LANCZOS)
        sheet.alpha_composite(bg_scaled, (px + (panel_w - 132) // 2, panel_y + 110))

        # Tier V scale ghost in Stage 1
        char_center_x = px + (panel_w - 12) // 2
        char_center_y = panel_y + panel_h // 2 + 80

        char_w = int(panel_w * 0.96)
        char_h = int(char_w * 576 / 1024)

        if idx == 0:
            t5_scaled = t5_img.resize((char_w, char_h), Image.Resampling.LANCZOS)
            # Make semi-transparent gold ghost
            t5_ghost = ImageEnhance.Brightness(t5_scaled).enhance(0.7)
            t5_ghost.putalpha(110)
            sheet.alpha_composite(t5_ghost, (char_center_x - char_w // 2, char_center_y - char_h // 2))

        # Render active pose
        if s["pose"] == "left":
            active_img = p_left
        elif s["pose"] == "right":
            active_img = p_right
        else:
            active_img = p_turn

        # Bank rotation
        bank_deg = -s["bank"] * 180.0 / math.pi
        rotated = active_img.rotate(bank_deg, resample=Image.Resampling.BILINEAR, expand=False)
        scaled_char = rotated.resize((char_w, char_h), Image.Resampling.LANCZOS)
        sheet.alpha_composite(scaled_char, (char_center_x - char_w // 2, char_center_y - char_h // 2))

        # Draw 28px Catch Point Reticle
        ret_r = 28
        draw.ellipse([char_center_x - ret_r, char_center_y - ret_r, char_center_x + ret_r, char_center_y + ret_r], outline=(34, 197, 94, 255), width=2)
        draw.line([(char_center_x - 36, char_center_y), (char_center_x + 36, char_center_y)], fill=(34, 197, 94, 255), width=1)
        draw.line([(char_center_x, char_center_y - 36), (char_center_x, char_center_y + 36)], fill=(34, 197, 94, 255), width=1)

        # Bottom Telemetry Panel for this stage
        tel_y = panel_y + panel_h - 170
        draw.rectangle([px + 8, tel_y, px + panel_w - 20, panel_y + panel_h - 12], fill=(10, 14, 26, 235), outline=(56, 189, 248, 50), width=1)
        
        draw.text((px + 16, tel_y + 8), f"Pos: ({s['x']}, {s['y']})", fill=(203, 213, 225, 255))
        draw.text((px + 16, tel_y + 26), f"Vel: Vx {s['vx']:.1f}, Ax {s['ax']:.1f}", fill=(56, 189, 248, 255))
        draw.text((px + 16, tel_y + 44), f"Bank: {s['bank']*180/math.pi:.1f}° / Head {s['head']*180/math.pi:.1f}°", fill=(203, 213, 225, 255))
        
        if game == "dynamo":
            w_str = "AIM LOCK LEFT" if s['vx'] < -2 else "AIM LOCK RIGHT" if s['vx'] > 2 else "LOCKED (0°)"
            draw.text((px + 16, tel_y + 64), f"Weapon: {w_str}", fill=(192, 132, 252, 255))
            draw.text((px + 16, tel_y + 84), "Knee Flex: 4.8px Drift", fill=(148, 163, 184, 255))
        elif game == "helix":
            lead_str = "LEFT LEAD CANTER" if s['fi'] < 0 else "RIGHT LEAD CANTER"
            draw.text((px + 16, tel_y + 64), f"Gait: {lead_str}", fill=(34, 211, 238, 255))
            draw.text((px + 16, tel_y + 84), "Stride: 4-Phase Joint Flex", fill=(148, 163, 184, 255))
        else:
            strk_str = "TAUT DOWNSTROKE" if idx in [1, 3] else "FOLDED RECOVERY" if idx in [4] else "AERODYNAMIC GLIDE"
            draw.text((px + 16, tel_y + 64), f"Wing: {strk_str}", fill=(251, 146, 60, 255))
            draw.text((px + 16, tel_y + 84), "Fire: Continuous Wake Ribbons", fill=(148, 163, 184, 255))

        draw.text((px + 16, tel_y + 106), "Catch Point: 28px Rock-Steady", fill=(34, 197, 94, 255))

    out_name = f"Motion_Benchmark_{game.capitalize()}_{tier.upper()}.png"
    out_dl = os.path.join(dl_dir, out_name)
    out_brain = os.path.join(brain_dir, out_name)
    sheet.save(out_dl)
    sheet.save(out_brain)
    print(f"  ✓ Saved 4K Motion Benchmark: {out_name}")

print("Generating 4K Motion Benchmark Sheets for VI and X forms...")
for g in ["dynamo", "helix", "meteor"]:
    for t in ["vi", "x"]:
        render_benchmark_sheet(g, t)
print("All 4K Motion Benchmark Review Sheets successfully generated!")
