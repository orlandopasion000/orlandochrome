import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

rig_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\assets\characters\rigs"
evidence_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(evidence_dir, exist_ok=True)

# ─── 1. LOAD MASTER REFERENCE ───
hr = Image.open(os.path.join(rig_dir, "helix_vi_head_r34.png")).convert("RGBA")
master_im = Image.open(os.path.join(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\assets\characters\helix_vi.png")).convert("RGBA")
w, h = hr.size # 1024, 576

print("Rebuilding authoritative single-silhouette front view and eyelid overlays...")

# ─── 2. SCULPT CLEAN SINGLE FRONT HEAD ───
cx = 505

# Start with a pristine transparent canvas
hf_clean = Image.new("RGBA", (w, h), (0, 0, 0, 0))

# 2A. Symmetrical Horn & Crown (centered at cx)
horn_crop = hr.crop((465, 20, 545, 140))
hf_clean.paste(horn_crop, (cx - horn_crop.width // 2, 20))

# 2B. Both Ears with Feathered Alpha
r_ear = hr.crop((390, 80, 480, 180))
# Create feathered mask for ear
mask_ear = Image.new("L", r_ear.size, 255)
m_draw = ImageDraw.Draw(mask_ear)
# Feather inner edge
for i in range(15):
    m_draw.line([(r_ear.width - 15 + i, 0), (r_ear.width - 15 + i, r_ear.height)], fill=int(255 * (1 - i/15)))
r_ear.putalpha(Image.composite(r_ear.split()[-1], Image.new("L", r_ear.size, 0), mask_ear))

l_ear = r_ear.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
hf_clean.alpha_composite(r_ear, (cx - 105, 80))
hf_clean.alpha_composite(l_ear, (cx + 25, 80))

# 2C. Pearlescent Cranium, Cheeks & Single Muzzle
head_base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
d = ImageDraw.Draw(head_base)

# Soft pearlescent head mass
d.ellipse([cx - 65, 115, cx + 65, 195], fill=(235, 240, 255, 255))
d.ellipse([cx - 80, 135, cx - 10, 205], fill=(225, 235, 255, 255))
d.ellipse([cx + 10, 135, cx + 80, 205], fill=(225, 235, 255, 255))

# Tapered nasal bridge down to single muzzle
d.polygon([(cx - 22, 145), (cx + 22, 145), (cx + 34, 200), (cx - 34, 200)], fill=(242, 246, 255, 255))

# SINGLE SOLID MUZZLE: One continuous rounded muzzle contour
d.ellipse([cx - 38, 188, cx + 38, 236], fill=(248, 250, 255, 255))
d.ellipse([cx - 26, 192, cx + 26, 222], fill=(255, 255, 255, 255))
# Rounded chin
d.ellipse([cx - 24, 224, cx + 24, 246], fill=(215, 225, 248, 255))

head_base = head_base.filter(ImageFilter.GaussianBlur(radius=2.5))
hf_clean.alpha_composite(head_base)

# 2D. Facial Contours: Single Smiling Mouth & Paired Symmetrical Nostrils
details = Image.new("RGBA", (w, h), (0, 0, 0, 0))
dd = ImageDraw.Draw(details)

# Delicate nostrils
dd.ellipse([cx - 25, 204, cx - 13, 216], fill=(175, 190, 230, 255), outline=(120, 140, 200, 255))
dd.ellipse([cx + 13, 204, cx + 25, 216], fill=(175, 190, 230, 255), outline=(120, 140, 200, 255))
dd.ellipse([cx - 23, 206, cx - 15, 214], fill=(100, 120, 180, 255))
dd.ellipse([cx + 15, 206, cx + 23, 214], fill=(100, 120, 180, 255))

# SINGLE SWEET SMILING MOUTH CONTOUR (Centered under nose, width 44px)
mouth_curve = [
    (cx - 22, 226),
    (cx - 14, 230),
    (cx, 231),
    (cx + 14, 230),
    (cx + 22, 226)
]
for p1, p2 in zip(mouth_curve[:-1], mouth_curve[1:]):
    dd.line([p1, p2], fill=(90, 110, 175, 255), width=2)
# Subtle pink lip tone
dd.arc([cx - 16, 227, cx + 16, 235], start=0, end=180, fill=(236, 72, 153, 190), width=1)

hf_clean.alpha_composite(details)

# 2E. Both Eyes in Frontal Perspective (Symmetrical with painted lashes)
eye_r_crop = hr.crop((445, 128, 510, 185))
eye_l_crop = eye_r_crop.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

# Feather eye borders so there are zero rectangular cut seams
eye_mask = Image.new("L", eye_r_crop.size, 0)
em_draw = ImageDraw.Draw(eye_mask)
em_draw.ellipse([6, 6, eye_r_crop.width - 6, eye_r_crop.height - 6], fill=255)
eye_mask = eye_mask.filter(ImageFilter.GaussianBlur(radius=3.0))

eye_r_masked = eye_r_crop.copy()
eye_r_masked.putalpha(Image.composite(eye_r_crop.split()[-1], Image.new("L", eye_r_crop.size, 0), eye_mask))
eye_l_masked = eye_l_crop.copy()
eye_l_masked.putalpha(Image.composite(eye_l_crop.split()[-1], Image.new("L", eye_l_crop.size, 0), eye_mask))

hf_clean.alpha_composite(eye_r_masked, (cx - 65, 130))
hf_clean.alpha_composite(eye_l_masked, (cx + 5, 130))

# 2F. Flowing DNA Mane Framing Face
mane_l = hr.crop((360, 60, 450, 260))
mane_r = hr.crop((530, 60, 620, 260))
hf_clean.alpha_composite(mane_l, (cx - 130, 50))
hf_clean.alpha_composite(mane_r, (cx + 40, 50))

# Save the rebuilt clean front head
hf_clean_path = os.path.join(rig_dir, "helix_vi_head_front.png")
hf_clean.save(hf_clean_path, "PNG")
print(f"  ✓ Saved clean front head (single muzzle, 0 double mouths) to {hf_clean_path}")

# Save verification crop
crop_face = hf_clean.crop((350, 30, 660, 260))
crop_face.save(os.path.join(evidence_dir, "verified_single_silhouette_front_head.png"))

# ─── 3. BUILD AUTHENTIC EYELID OVERLAYS (OPEN, HALF, CLOSED) ───
# We extract the eye region (x: 445, y: 128, w: 65, h: 57)
eye_base = hr.crop((445, 128, 510, 185))
ew, eh = eye_base.size

# State 1: 100% Open Eye
eyelid_open = Image.new("RGBA", (ew, eh), (0, 0, 0, 0)) # Clean transparent (master eye shows through)

# State 2: 50% Partially Closed Eyelid
eyelid_half = Image.new("RGBA", (ew, eh), (0, 0, 0, 0))
eh_draw = ImageDraw.Draw(eyelid_half)
# Upper eyelid fold descending over top 50%
eh_draw.chord([4, -10, ew - 4, int(eh * 0.62)], start=0, end=180, fill=(230, 234, 250, 255))
# Crease shadow
eh_draw.arc([4, -8, ew - 4, int(eh * 0.60)], start=0, end=180, fill=(175, 180, 210, 255), width=2)
# Thick painted lashes following the descending lid curve
eh_draw.arc([4, int(eh * 0.20), ew - 4, int(eh * 0.64)], start=0, end=180, fill=(20, 25, 45, 255), width=3)
# Painted individual lash tips
for lx, ly, dx, dy in [(12, 28, -4, -6), (22, 32, -1, -7), (32, 34, 0, -8), (42, 33, 2, -7), (52, 29, 5, -5)]:
    eh_draw.line([(lx, ly), (lx+dx, ly+dy)], fill=(15, 20, 35, 255), width=2)
eyelid_half = eyelid_half.filter(ImageFilter.GaussianBlur(radius=0.5))

# State 3: 100% Fully Closed Eyelid
eyelid_closed = Image.new("RGBA", (ew, eh), (0, 0, 0, 0))
ec_draw = ImageDraw.Draw(eyelid_closed)
# Full pearlescent lid skin covering entire eye aperture
ec_draw.chord([4, -5, ew - 4, int(eh * 0.88)], start=0, end=180, fill=(228, 232, 248, 255))
# Soft crease
ec_draw.arc([4, int(eh * 0.15), ew - 4, int(eh * 0.60)], start=10, end=170, fill=(180, 185, 215, 255), width=2)
# Dark closed lash line resting along bottom lid contour
ec_draw.arc([4, int(eh * 0.35), ew - 4, int(eh * 0.90)], start=10, end=170, fill=(20, 25, 45, 255), width=3)
# Lashes resting downward
for lx, ly, dx, dy in [(10, 42, -4, 5), (20, 47, -2, 7), (32, 49, 0, 7), (44, 47, 2, 6), (54, 43, 5, 4)]:
    ec_draw.line([(lx, ly), (lx+dx, ly+dy)], fill=(15, 20, 35, 255), width=2)
eyelid_closed = eyelid_closed.filter(ImageFilter.GaussianBlur(radius=0.5))

eyelid_open.save(os.path.join(rig_dir, "helix_vi_eyelid_open.png"))
eyelid_half.save(os.path.join(rig_dir, "helix_vi_eyelid_half.png"))
eyelid_closed.save(os.path.join(rig_dir, "helix_vi_eyelid_closed.png"))
print("  ✓ Saved authentic eyelid overlays (open, half, closed).")

# ─── 4. REBUILD HELIX_VI_TURN_000_FRONT WITH SOLID ANATOMY ───
turn_000_clean = Image.open(os.path.join(rig_dir, "helix_vi_turn_000_front.png")).convert("RGBA")
# Composite hf_clean seamlessly
turn_000_clean.alpha_composite(hf_clean)
turn_000_clean.save(os.path.join(rig_dir, "helix_vi_turn_000_front.png"))
print("  ✓ Updated helix_vi_turn_000_front.png with solid front view.")

# Save full front view to evidence
turn_000_clean.save(os.path.join(evidence_dir, "verified_solid_turn_000_front.png"))

print("All front head & eyelid assets ready!")
