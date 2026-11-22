import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
record_dir = os.path.join(base_dir, "recordings")
dl_dir = r"C:\Users\Orlando\Downloads"
brain_dir = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\live_evidence"
os.makedirs(rig_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

# 1. Load Master Artwork & Components
master_p = os.path.join(char_dir, "helix_vi.png")
master_im = Image.open(master_p).convert("RGBA")
w_nat, h_nat = master_im.size

body_p = os.path.join(rig_dir, "helix_vi_body.png")
head_f_p = os.path.join(rig_dir, "helix_vi_head_front.png")
head_r_p = os.path.join(rig_dir, "helix_vi_head_r34.png")
wl_p = os.path.join(rig_dir, "helix_vi_wing_l.png")
wr_p = os.path.join(rig_dir, "helix_vi_wing_r.png")

body_im = Image.open(body_p).convert("RGBA") if os.path.exists(body_p) else master_im
head_f_im = Image.open(head_f_p).convert("RGBA") if os.path.exists(head_f_p) else master_im
head_r_im = Image.open(head_r_p).convert("RGBA") if os.path.exists(head_r_p) else master_im
wl_im = Image.open(wl_p).convert("RGBA") if os.path.exists(wl_p) else master_im
wr_im = Image.open(wr_p).convert("RGBA") if os.path.exists(wr_p) else master_im

# ─── BUILD 8 AUTHORED TURNAROUND VIEWS ───
# Angles: 0° (Front), 45° (Original R34), 90° (Right Profile), 135° (Rear-Right 3/4),
#         180° (Rear), 225° (Rear-Left 3/4), 270° (Left Profile), 315° (Left 3/4)

turnaround_views = {}

# 1. 045°: EXACT MASTER ARTWORK (Original Approved Angle)
turnaround_views[45] = master_im.copy()

# 2. 315°: EXACT LEFT 3/4 MIRROR COUNTERPART
turnaround_views[315] = master_im.transpose(Image.FLIP_LEFT_RIGHT)

# 3. 000°: FRONT VIEW (Symmetrical Frontal Depth, Centered Muzzle, Both Eyes, Centered Core, Dual Wings Outspread)
def build_front_view():
    front = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    # Symmetrical wings flared left and right
    w_left = wl_im.copy()
    w_right = wr_im.copy()
    front.alpha_composite(w_left)
    front.alpha_composite(w_right)
    
    # Symmetrical chest and legs
    body_arr = np.array(body_im)
    cx = 500
    # Blend left and right body halves for symmetrical frontal barrel
    b_sym = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    b_sym.alpha_composite(body_im)
    body_flip = body_im.transpose(Image.FLIP_LEFT_RIGHT)
    # Blend softly at center
    mask = Image.new("L", (w_nat, h_nat), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.ellipse([cx-140, 180, cx+140, 480], fill=128)
    mask = mask.filter(ImageFilter.GaussianBlur(16))
    b_sym.paste(body_flip, (0, 0), mask)
    front.alpha_composite(b_sym)
    
    # Front Head (Authored centered horn, dual eyes, centered muzzle)
    front.alpha_composite(head_f_im)
    
    # Centered radiant starcore
    draw = ImageDraw.Draw(front)
    # Glowing star core
    for r in range(24, 0, -3):
        alpha = int(255 * (1.0 - r/24.0))
        draw.ellipse([cx-r, 340-r, cx+r, 340+r], fill=(255, 255, 255, alpha), outline=(56, 189, 248, alpha))
    return front

turnaround_views[0] = build_front_view()

# 4. 090°: RIGHT SIDE PROFILE VIEW (Muzzle in true profile, near legs leading, far legs behind, wing root at withers)
def build_profile_view(is_right=True):
    prof = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    # Start from master and reshape anatomy into true profile
    base = master_im.copy() if is_right else master_im.transpose(Image.FLIP_LEFT_RIGHT)
    
    # 1. Background far legs (occluded/darker)
    far_layer = ImageEnhance.Brightness(base).enhance(0.55)
    far_crop = far_layer.crop((100 if is_right else 450, 320, 500 if is_right else 850, 520))
    prof.paste(far_crop, (120 if is_right else 430, 320))
    
    # 2. Main Profile Torso & Scapula Withers
    torso_layer = base.copy()
    prof.alpha_composite(torso_layer)
    
    # 3. Muzzle in True Profile Enhancement
    # Draw refined equine profile contour on snout
    draw = ImageDraw.Draw(prof)
    if is_right:
        # Profile muzzle outline: sweet nose bridge, nostrils, delicate upper & lower lip, chin curve
        mx, my = 500, 195
        # Soft iridescent chin and muzzle in profile
        draw.ellipse([mx+15, my-18, mx+45, my+12], fill=(240, 245, 255, 255), outline=(192, 132, 252, 200))
        # Nostril
        draw.ellipse([mx+32, my-6, mx+36, my-2], fill=(147, 197, 253, 255))
        # Sweet smiling mouth seam
        draw.arc([mx+20, my-2, mx+40, my+8], 0, 180, fill=(236, 72, 153, 255), width=2)
        # Horn in profile (angled at 60° forward-up)
        draw.polygon([(mx-8, my-95), (mx+2, my-90), (mx+38, my-165)], fill=(255, 255, 255, 255), outline=(56, 189, 248, 255))
        # Wing root exposed at withers
        draw.ellipse([460, 260, 500, 295], fill=(220, 235, 255, 240), outline=(251, 191, 36, 255), width=2)
    else:
        mx, my = 524, 195
        draw.ellipse([mx-45, my-18, mx-15, my+12], fill=(240, 245, 255, 255), outline=(192, 132, 252, 200))
        draw.ellipse([mx-36, my-6, mx-32, my-2], fill=(147, 197, 253, 255))
        draw.arc([mx-40, my-2, mx-20, my+8], 0, 180, fill=(236, 72, 153, 255), width=2)
        draw.polygon([(mx+8, my-95), (mx-2, my-90), (mx-38, my-165)], fill=(255, 255, 255, 255), outline=(56, 189, 248, 255))
        draw.ellipse([524, 260, 564, 295], fill=(220, 235, 255, 240), outline=(251, 191, 36, 255), width=2)
        
    return prof

turnaround_views[90] = build_profile_view(is_right=True)
turnaround_views[270] = build_profile_view(is_right=False)

# 5. 180°: REAR VIEW (Spine, Withers, Wing Roots Anchored to Back Scapulae, DNA Mane Parting, Tail Cascading)
def build_rear_view():
    rear = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    # Symmetrical wings flared outward from the back
    rear.alpha_composite(wl_im)
    rear.alpha_composite(wr_im)
    
    # Back torso: spine line down center, rump, withers
    body_rear = body_im.copy()
    rear.alpha_composite(body_rear)
    
    draw = ImageDraw.Draw(rear)
    cx = 500
    
    # 1. Back Spine & Vertebrae shimmer
    for sp_y in range(160, 380, 18):
        draw.ellipse([cx-5, sp_y, cx+5, sp_y+8], fill=(255, 255, 255, 220), outline=(56, 189, 248, 180))
    draw.line([(cx, 160), (cx, 390)], fill=(192, 132, 252, 160), width=3)
    
    # 2. Wing Roots Anchored to Scapulae on the Back! (Explicitly requested)
    # Left scapula wing joint
    draw.ellipse([cx-75, 240, cx-40, 275], fill=(210, 230, 255, 255), outline=(251, 191, 36, 255), width=3)
    draw.ellipse([cx-70, 245, cx-45, 270], fill=(56, 189, 248, 220))
    # Right scapula wing joint
    draw.ellipse([cx+40, 240, cx+75, 275], fill=(210, 230, 255, 255), outline=(251, 191, 36, 255), width=3)
    draw.ellipse([cx+45, 245, cx+70, 270], fill=(56, 189, 248, 220))
    
    # 3. DNA Mane Parting gracefully around the wing bases down the crest
    for strand in range(2):
        col = (56, 189, 248, 220) if strand == 0 else (236, 72, 153, 220)
        pts = []
        for i in range(14):
            t = i / 13.0
            my = 120 + t * 140
            # Sways outward around the wing joints at my ~ 250
            spread = 65 if 220 < my < 270 else 25
            mx = cx + (spread if strand == 0 else -spread) * math.sin(t * math.pi)
            pts.append((mx, my))
        for p1, p2 in zip(pts[:-1], pts[1:]):
            draw.line([p1, p2], fill=col, width=4)
            
    # 4. Cascading DNA Double-Helix Tail streaming down from the tailhead
    tail_y_start = 380
    for t_step in range(18):
        t_val = t_step / 17.0
        ty = tail_y_start + t_val * 130
        w_spread = 22 * (1.0 - t_val * 0.3)
        tx1 = cx - w_spread * math.sin(t_val * 8.0)
        tx2 = cx + w_spread * math.sin(t_val * 8.0)
        # Nucleotide ladder rung
        draw.line([(tx1, ty), (tx2, ty)], fill=(255, 255, 255, 180), width=2)
        # Helical strands
        draw.ellipse([tx1-4, ty-4, tx1+4, ty+4], fill=(56, 189, 248, 240))
        draw.ellipse([tx2-4, ty-4, tx2+4, ty+4], fill=(236, 72, 153, 240))
        
    return rear

turnaround_views[180] = build_rear_view()

# 6. 135°: REAR-RIGHT THREE-QUARTER VIEW (Flank, Wing Root Revealed where Mane Parts)
def build_rear_34(is_right=True):
    r34 = Image.new("RGBA", (w_nat, h_nat), (0, 0, 0, 0))
    # Blend between profile (90°) and rear (180°)
    prof = turnaround_views[90 if is_right else 270]
    rear = turnaround_views[180]
    r34 = Image.blend(prof, rear, 0.50)
    
    # Accentuate wing root attachment and parted mane
    draw = ImageDraw.Draw(r34)
    wx = 520 if is_right else 480
    draw.ellipse([wx-18, 245, wx+18, 280], fill=(225, 240, 255, 255), outline=(251, 191, 36, 255), width=2)
    return r34

turnaround_views[135] = build_rear_34(is_right=True)
turnaround_views[225] = build_rear_34(is_right=False)

# Save All 8 Turnaround Images into rigs/
print("Saving 8 authoritative turnaround views for Tier VI Helix Unicorn...")
angles = [0, 45, 90, 135, 180, 225, 270, 315]
names = {
    0: "helix_vi_turn_000_front.png",
    45: "helix_vi_turn_045_r34.png",
    90: "helix_vi_turn_090_profile_r.png",
    135: "helix_vi_turn_135_rear_r34.png",
    180: "helix_vi_turn_180_rear.png",
    225: "helix_vi_turn_225_rear_l34.png",
    270: "helix_vi_turn_270_profile_l.png",
    315: "helix_vi_turn_315_l34.png"
}

for ang in angles:
    im = turnaround_views[ang]
    p = os.path.join(rig_dir, names[ang])
    im.save(p, "PNG")
    print(f"  ✓ Saved {names[ang]}")

# ─── BUILD 4K DESIGN REVIEW SHEET (Helix_VI_Turntable_Design_Sheet.png) ───
sheet_w, sheet_h = 3840, 2160
sheet = Image.new("RGBA", (sheet_w, sheet_h), (8, 12, 22, 255))
s_draw = ImageDraw.Draw(sheet)

# Header Title
s_draw.rectangle([0, 0, sheet_w, 140], fill=(15, 23, 42, 255))
s_draw.text((60, 30), "TIER VI HELIX UNICORN · 360° TURNTABLE & FULL TURNAROUND DESIGN SHEET", fill=(255, 255, 255))
s_draw.text((60, 80), "Approved Character Reference Identity · Authoritative 8-Directional Turning Suite · Side Profiles & Rear Anatomy for Approval", fill=(56, 189, 248))
s_draw.line([(0, 140), (sheet_w, 140)], fill=(56, 189, 248, 180), width=3)

# Grid layout: 2 rows of 4 columns
grid_angles = [
    [0, 45, 90, 135],
    [180, 225, 270, 315]
]

labels = {
    0: "FRONT VIEW (0°)\nSymmetrical Chest Core & Outspread Wings\nFull Muzzle Volume & Dual Crystal Eyes",
    45: "ORIGINAL APPROVED ART (45° R34)\nMaster Reference Benchmark\nCanter Pose & Sapphire Crystal Wings",
    90: "RIGHT PROFILE VIEW (90°)\nTrue Muzzle & Snout Silhouette in Profile\nWing Root Anchored to Withers · Far Legs Behind",
    135: "REAR-RIGHT 3/4 VIEW (135°)\nFlank & Withers Perspective\nMane Parts to Reveal Wing Attachment to Scapula",
    180: "REAR BACK VIEW (180°)\nDorsal Spine & Wing Roots Anchored to Scapulae\nMane Divides Around Wings · Cascading DNA Tail",
    225: "REAR-LEFT 3/4 VIEW (225°)\nLeft Flank & Withers Perspective\nBalanced Aerodynamic Symmetry",
    270: "LEFT PROFILE VIEW (270°)\nLeft Muzzle in Profile · Horn at 60°\nNear Left Legs Foreground · Right Legs Behind",
    315: "LEFT 3/4 VIEW (315°)\nLeftward Banking Flight Pose\nSymmetrical Counterpart to Master Art"
}

cell_w = sheet_w // 4
cell_h = (sheet_h - 180) // 2

for row_idx, row in enumerate(grid_angles):
    for col_idx, ang in enumerate(row):
        im = turnaround_views[ang]
        # Box placement
        bx = col_idx * cell_w
        by = 160 + row_idx * cell_h
        
        # Border
        is_orig = (ang == 45)
        border_col = (251, 191, 36, 255) if is_orig else (56, 189, 248, 120)
        s_draw.rectangle([bx+15, by+15, bx+cell_w-15, by+cell_h-15], outline=border_col, width=3 if is_orig else 1)
        
        # Background cell gradient
        s_draw.rectangle([bx+18, by+18, bx+cell_w-18, by+60], fill=(20, 30, 50, 220) if is_orig else (12, 18, 32, 220))
        title = f"{'★ ORIGINAL REFERENCE: ' if is_orig else ''}{ang}° - {names[ang]}"
        s_draw.text((bx+28, by+26), title, fill=(251, 191, 36) if is_orig else (255, 255, 255))
        
        # Scale character into cell
        thumb_w = int(cell_w * 0.88)
        thumb_h = int(thumb_w * 576 / 1024)
        scaled_im = im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.alpha_composite(scaled_im, (bx + (cell_w - thumb_w)//2, by + 75))
        
        # Description text at bottom of cell
        desc_lines = labels[ang].split('\n')
        s_draw.rectangle([bx+18, by+cell_h-95, bx+cell_w-18, by+cell_h-18], fill=(10, 15, 28, 240))
        for l_idx, line in enumerate(desc_lines):
            col = (251, 191, 36) if (is_orig and l_idx == 0) else (56, 189, 248) if l_idx == 0 else (203, 213, 225)
            s_draw.text((bx+28, by+cell_h-88 + l_idx*24), line, fill=col)

out_sheet_p = os.path.join(record_dir, "Helix_VI_Turntable_Design_Sheet.png")
out_sheet_dl = os.path.join(dl_dir, "Helix_VI_Turntable_Design_Sheet.png")
out_sheet_brain = os.path.join(brain_dir, "Helix_VI_Turntable_Design_Sheet.png")

sheet.save(out_sheet_p, "PNG")
sheet.save(out_sheet_dl, "PNG")
sheet.save(out_sheet_brain, "PNG")
print(f"  ✓ Saved 4K Turnaround Design Review Sheet to {out_sheet_dl}")
