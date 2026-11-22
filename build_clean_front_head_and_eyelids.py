import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

rig_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\assets\characters\rigs"
evidence_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(evidence_dir, exist_ok=True)

# Load base artwork
hr = Image.open(os.path.join(rig_dir, "helix_vi_head_r34.png")).convert("RGBA")
w, h = hr.size # 1024, 576

print("Rebuilding clean single-silhouette front head...")

# ─── 1. BUILD SCULPTED FRONT HEAD WITH SINGLE MUZZLE & SINGLE MOUTH ───
# Center axis is at x = 505
cx = 505

# Start with a clean canvas
hf_clean = Image.new("RGBA", (w, h), (0, 0, 0, 0))

# 1A. Symmetrical Horn, Crown & Halo Orb (Centered at x=505)
# Crop the horn & crown from hr (centered around x=505)
horn_crop = hr.crop((460, 20, 550, 140))
hf_clean.paste(horn_crop, (cx - horn_crop.width // 2, 20))

# 1B. Cranium & Ears (Left & Right ears)
# Right ear from hr
r_ear = hr.crop((390, 80, 480, 180))
hf_clean.paste(r_ear, (cx - 105, 80))
# Left ear (mirrored with perspective lighting)
l_ear = r_ear.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
hf_clean.paste(l_ear, (cx + 25, 80))

# 1C. Forehead, Cheeks and Single Sculpted Muzzle
# Base cranium fill with pearlescent unicorn shading
head_base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
draw = ImageDraw.Draw(head_base)

# Pearlescent face gradient
# Forehead: oval between eyes
draw.ellipse([cx - 55, 120, cx + 55, 195], fill=(235, 240, 255, 255))
# Cheeks
draw.ellipse([cx - 75, 140, cx - 15, 205], fill=(228, 236, 255, 255))
draw.ellipse([cx + 15, 140, cx + 75, 205], fill=(228, 236, 255, 255))

# Bridge of nose (single, continuous, tapered from forehead to muzzle)
draw.polygon([(cx - 22, 145), (cx + 22, 145), (cx + 32, 205), (cx - 32, 205)], fill=(240, 244, 255, 255))

# SINGLE MUZZLE: One continuous rounded muzzle bulb (NOT two!)
# Muzzle bulb: centered at cx, width 72px, height 48px
draw.ellipse([cx - 36, 190, cx + 36, 238], fill=(245, 248, 255, 255))
# Muzzle highlight
draw.ellipse([cx - 24, 192, cx + 24, 222], fill=(255, 255, 255, 255))

# Chin underneath
draw.ellipse([cx - 22, 224, cx + 22, 246], fill=(215, 225, 248, 255))

# Smooth the base
head_base = head_base.filter(ImageFilter.GaussianBlur(radius=1.8))
hf_clean.alpha_composite(head_base)

# 1D. Paint Details: Single Sweet Mouth Contour, Nostrils, and Shading
detail_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
d_draw = ImageDraw.Draw(detail_layer)

# Nostrils: Delicate paired pinkish-cyan nostrils
# Left nostril
d_draw.ellipse([cx - 24, 204, cx - 14, 215], fill=(180, 195, 235, 255), outline=(130, 150, 210, 255))
# Right nostril
d_draw.ellipse([cx + 14, 204, cx + 24, 215], fill=(180, 195, 235, 255), outline=(130, 150, 210, 255))
# Inner nostril depth
d_draw.ellipse([cx - 22, 206, cx - 16, 213], fill=(120, 140, 190, 255))
d_draw.ellipse([cx + 16, 206, cx + 22, 213], fill=(120, 140, 190, 255))

# SINGLE MOUTH: One continuous smiling mouth arc centered under the nose!
# Mouth line from cx-24 to cx+24 curving up gently at both corners
mouth_pts = [
    (cx - 22, 226),
    (cx - 14, 230),
    (cx, 231),
    (cx + 14, 230),
    (cx + 22, 226)
]
for p1, p2 in zip(mouth_pts[:-1], mouth_pts[1:]):
    d_draw.line([p1, p2], fill=(100, 120, 180, 255), width=2)
# Subtle pink lip tone
d_draw.arc([cx - 16, 228, cx + 16, 236], start=0, end=180, fill=(236, 72, 153, 180), width=1)

hf_clean.alpha_composite(detail_layer)

# 1E. Symmetrical Sapphire Eyes with Painted Lashes (Frontal Perspective)
# Right Eye from hr (tapered slightly for perspective)
eye_r_crop = hr.crop((445, 128, 510, 185))
# Left Eye (mirrored)
eye_l_crop = eye_r_crop.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

# Position eyes symmetrically on either side of the nose bridge
hf_clean.alpha_composite(eye_r_crop, (cx - 65, 130))
hf_clean.alpha_composite(eye_l_crop, (cx + 5, 130))

# 1F. Flowing DNA Mane Locks Framing Face
mane_l = hr.crop((360, 60, 460, 260))
mane_r = hr.crop((520, 60, 620, 260))
hf_clean.alpha_composite(mane_l, (cx - 130, 50))
hf_clean.alpha_composite(mane_r, (cx + 30, 50))

# Save the rebuilt clean front head
hf_clean_path = os.path.join(rig_dir, "helix_vi_head_front.png")
hf_clean.save(hf_clean_path, "PNG")
print(f"  ✓ Saved clean single-silhouette front head to {hf_clean_path}")

# Save crop to evidence for visual verification
crop_check = hf_clean.crop((350, 40, 660, 260))
crop_check.save(os.path.join(evidence_dir, "clean_front_face_check.png"))

# ─── 2. BUILD EYELID POSES (OPEN, HALF-CLOSED, FULLY CLOSED) ───
print("Building authored eyelid animation poses...")
# We build an eye-and-eyelid overlay positioned over the eye region
eye_w, eye_h = 70, 60

# State 1: Open Eye (Full sapphire iris, pupil, highlights, painted lashes)
eye_open = Image.new("RGBA", (eye_w, eye_h), (0, 0, 0, 0))
eo_draw = ImageDraw.Draw(eye_open)
# Sclera
eo_draw.ellipse([8, 12, 62, 48], fill=(235, 245, 255, 255))
# Sapphire Iris
eo_draw.ellipse([18, 12, 52, 48], fill=(14, 116, 144, 255), outline=(56, 189, 248, 255), width=2)
# Emerald limbal ring
eo_draw.ellipse([22, 16, 48, 44], fill=(6, 182, 212, 255))
# Deep Pupil
eo_draw.ellipse([27, 21, 43, 39], fill=(2, 6, 23, 255))
# Specular catchlight
eo_draw.ellipse([34, 23, 40, 29], fill=(255, 255, 255, 255))
eo_draw.ellipse([28, 33, 31, 36], fill=(255, 255, 255, 200))
# Upper Eyelid & Painted Lashes
eo_draw.arc([6, 8, 64, 48], start=190, end=350, fill=(15, 23, 42, 255), width=3)
# Painted individual lashes
lashes = [(12, 18, 6, 10), (22, 13, 18, 4), (35, 10, 35, 1), (48, 13, 52, 4), (58, 18, 64, 10)]
for lx1, ly1, lx2, ly2 in lashes:
    eo_draw.line([(lx1, ly1), (lx2, ly2)], fill=(15, 23, 42, 255), width=2)

# State 2: Half-Closed Eyelid (Lid descends 50%, covering top of pupil)
eye_half = eye_open.copy()
eh_draw = ImageDraw.Draw(eye_half)
# Eyelid skin fold descending over top 50%
eh_draw.chord([6, 8, 64, 38], start=0, end=180, fill=(230, 236, 252, 255), outline=(160, 175, 215, 255))
# Curved lash line along the half-closed edge
eh_draw.arc([6, 18, 64, 44], start=0, end=180, fill=(15, 23, 42, 255), width=3)
half_lashes = [(14, 28, 10, 22), (24, 31, 22, 24), (35, 32, 35, 25), (46, 31, 48, 24), (56, 28, 60, 22)]
for lx1, ly1, lx2, ly2 in half_lashes:
    eh_draw.line([(lx1, ly1), (lx2, ly2)], fill=(15, 23, 42, 255), width=2)

# State 3: Fully Closed Eyelid (Upper lid meets lower lid; lashes resting along closed slit)
eye_closed = Image.new("RGBA", (eye_w, eye_h), (0, 0, 0, 0))
ec_draw = ImageDraw.Draw(eye_closed)
# Pearlescent lid skin
ec_draw.ellipse([8, 14, 62, 46], fill=(228, 234, 250, 255))
# Closed eyelid seam curving gently downwards
ec_draw.arc([8, 20, 62, 42], start=10, end=170, fill=(100, 116, 160, 255), width=2)
# Dark painted lashes resting along seam
ec_draw.arc([8, 22, 62, 44], start=10, end=170, fill=(15, 23, 42, 255), width=3)
closed_lashes = [(12, 30, 8, 36), (22, 33, 20, 41), (35, 34, 35, 43), (48, 33, 50, 41), (58, 30, 62, 36)]
for lx1, ly1, lx2, ly2 in closed_lashes:
    ec_draw.line([(lx1, ly1), (lx2, ly2)], fill=(15, 23, 42, 255), width=2)

# Save eyelid assets
eye_open.save(os.path.join(rig_dir, "helix_vi_eye_open.png"))
eye_half.save(os.path.join(rig_dir, "helix_vi_eye_half.png"))
eye_closed.save(os.path.join(rig_dir, "helix_vi_eye_closed.png"))
print("  ✓ Eyelid assets saved (open, half, closed).")

# Save eyelid preview sheet
eye_sheet = Image.new("RGBA", (eye_w * 3 + 40, eye_h + 30), (10, 15, 28, 255))
eye_sheet.paste(eye_open, (10, 15))
eye_sheet.paste(eye_half, (eye_w + 20, 15))
eye_sheet.paste(eye_closed, (eye_w * 2 + 30, 15))
es_draw = ImageDraw.Draw(eye_sheet)
es_draw.text((15, 0), "1. OPEN", fill=(56, 189, 248, 255))
es_draw.text((eye_w + 25, 0), "2. HALF (50%)", fill=(251, 191, 36, 255))
es_draw.text((eye_w * 2 + 35, 0), "3. CLOSED", fill=(34, 197, 94, 255))
eye_sheet.save(os.path.join(evidence_dir, "eyelid_states_sheet.png"))

# ─── 3. REBUILD TURN_000_FRONT WITH SINGLE SOLID HEAD & SCAPULAR WINGS ───
turn_000_clean = Image.open(os.path.join(rig_dir, "helix_vi_turn_000_front.png")).convert("RGBA")
# Composite clean front head over turn_000
# Mask out old head region (x: 340-670, y: 20-275)
clean_body = turn_000_clean.copy()
cb_draw = ImageDraw.Draw(clean_body)
# Paste hf_clean
clean_body.alpha_composite(hf_clean)
clean_body.save(os.path.join(rig_dir, "helix_vi_turn_000_front.png"))
print("  ✓ Updated helix_vi_turn_000_front.png with single sculpted head.")

print("Artwork generation complete!")
