import os
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
os.makedirs(rig_dir, exist_ok=True)

games = ["dynamo", "helix", "meteor"]
tiers = ["vi", "vii", "viii", "ix", "x"]

def create_smooth_mask(width, height, center_x, left_bound, right_bound, roll_off=30):
    x = np.arange(width)
    y = np.arange(height)
    xx, yy = np.meshgrid(x, y)
    
    # Smooth cosine/sigmoid transition
    def ramp(val, w):
        return 1.0 / (1.0 + np.exp(-val / (w / 3.0)))
    
    # Left wing: 1 when x < left_bound, 0 when x > center_x
    m_left = ramp(left_bound - xx, roll_off)
    # Right wing: 1 when x > right_bound, 0 when x < center_x
    m_right = ramp(xx - right_bound, roll_off)
    # Body: 1 between left_bound and right_bound
    m_body = 1.0 - m_left - m_right
    m_body = np.clip(m_body, 0.0, 1.0)
    
    return m_left, m_body, m_right

print("Processing all 15 characters for modern layered directional rigs...")

for game in games:
    for tier in tiers:
        base_name = f"{game}_{tier}"
        src_path = os.path.join(char_dir, f"{base_name}.png")
        if not os.path.exists(src_path):
            print(f"Warning: {src_path} not found!")
            continue
            
        im = Image.open(src_path).convert("RGBA")
        arr = np.array(im, dtype=np.float32)
        h, w, _ = arr.shape
        alpha = arr[:, :, 3]
        
        # Detect chest core (luminance peak in center)
        lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
        center_mask = np.zeros_like(alpha, dtype=bool)
        center_mask[int(h*0.25):int(h*0.75), int(w*0.35):int(w*0.65)] = True
        valid = center_mask & (alpha > 120)
        
        if np.any(valid):
            sub_lum = lum * valid
            thresh = np.percentile(sub_lum[valid], 98)
            core_ys, core_xs = np.where((sub_lum >= thresh) & valid)
            core_cx = int(np.mean(core_xs))
            core_cy = int(np.mean(core_ys))
        else:
            core_cx = w // 2
            core_cy = h // 2
            
        # Wing and Body separation bounds
        left_boundary = core_cx - 95
        right_boundary = core_cx + 95
        roll_off = 35
        
        m_lw, m_body, m_rw = create_smooth_mask(w, h, core_cx, left_boundary, right_boundary, roll_off)
        
        # 1. Left Wing Layer
        arr_lw = arr.copy()
        arr_lw[:, :, 3] = np.clip(arr_lw[:, :, 3] * m_lw, 0, 255)
        img_lw = Image.fromarray(arr_lw.astype(np.uint8), "RGBA")
        img_lw.save(os.path.join(rig_dir, f"{base_name}_wing_l.png"))
        
        # 2. Right Wing Layer
        arr_rw = arr.copy()
        arr_rw[:, :, 3] = np.clip(arr_rw[:, :, 3] * m_rw, 0, 255)
        img_rw = Image.fromarray(arr_rw.astype(np.uint8), "RGBA")
        img_rw.save(os.path.join(rig_dir, f"{base_name}_wing_r.png"))
        
        # 3. Torso / Core / Legs Layer
        arr_body = arr.copy()
        arr_body[:, :, 3] = np.clip(arr_body[:, :, 3] * m_body, 0, 255)
        
        # For Dynamo Princess: separate the physical weapon from the painted static blast
        if game == "dynamo":
            # Mask out the static painted cyan/white blast at far right (x > core_cx + 170, high brightness)
            x_coords = np.arange(w)
            xx_grid = np.tile(x_coords, (h, 1))
            blast_mask = (xx_grid > (core_cx + 160)) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 220)
            arr_body[blast_mask, 3] *= 0.15
            
        img_body = Image.fromarray(arr_body.astype(np.uint8), "RGBA")
        img_body.save(os.path.join(rig_dir, f"{base_name}_body.png"))
        
        # 4. Generate Authored Directional Poses
        # A. Right-Facing Pose (Canonical base with depth balance)
        img_rw_lit = ImageEnhance.Brightness(img_rw).enhance(1.08)
        img_lw_shadow = ImageEnhance.Brightness(img_lw).enhance(0.88)
        
        pose_right = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        # Z-order when facing right: Far Left Wing (back) -> Torso -> Near Right Wing (front)
        pose_right.alpha_composite(img_lw_shadow)
        pose_right.alpha_composite(img_body)
        pose_right.alpha_composite(img_rw_lit)
        pose_right.save(os.path.join(rig_dir, f"{base_name}_dir_right.png"))
        
        # B. Left-Facing Pose (Authentic leftward orientation with volumetric depth)
        # When facing left: Far Right Wing (back) -> Torso (flipped horizontally around core) -> Near Left Wing (front)
        # We flip the central torso and appendages around core_cx so muzzle/horn/stride face LEFT
        body_flipped = img_body.transpose(Image.FLIP_LEFT_RIGHT)
        # Shift body so its core aligns with core_cx
        orig_body_cx = core_cx
        flipped_body_cx = w - core_cx
        shift_x = orig_body_cx - flipped_body_cx
        body_flipped_aligned = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        body_flipped_aligned.paste(body_flipped, (shift_x, 0))
        
        # Far Right Wing moves to back (darkened)
        rw_far_shadow = ImageEnhance.Brightness(img_rw).enhance(0.84)
        # Near Left Wing moves to front (lit, slightly shifted forward into bank)
        lw_near_lit = ImageEnhance.Brightness(img_lw).enhance(1.12)
        
        pose_left = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        # Z-order when facing left: Far Right Wing (back) -> Body -> Near Left Wing (front)
        pose_left.alpha_composite(rw_far_shadow)
        pose_left.alpha_composite(body_flipped_aligned)
        pose_left.alpha_composite(lw_near_lit)
        pose_left.save(os.path.join(rig_dir, f"{base_name}_dir_left.png"))
        
        # C. Three-Quarter Reversal Transition Pose (Volume-Preserving Depth Turn)
        # Does NOT squash to zero! Head and near shoulder rotate forward, far wing rotates behind torso.
        pose_turn = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        # Far wing rotated back and darkened
        far_wing_turn = ImageEnhance.Brightness(img_lw).enhance(0.78)
        far_wing_turn = far_wing_turn.transform((w, h), Image.AFFINE, (1.1, 0, 15, 0, 1.0, 0), resample=Image.BILINEAR)
        # Torso maintains 92% volume
        body_turn = img_body.transform((w, h), Image.AFFINE, (1.08, 0, -10, 0, 1.0, 0), resample=Image.BILINEAR)
        # Near wing lifted and rim-lit
        near_wing_turn = ImageEnhance.Brightness(img_rw).enhance(1.15)
        near_wing_turn = near_wing_turn.transform((w, h), Image.AFFINE, (0.95, 0, -25, 0, 1.0, -8), resample=Image.BILINEAR)
        
        pose_turn.alpha_composite(far_wing_turn)
        pose_turn.alpha_composite(body_turn)
        pose_turn.alpha_composite(near_wing_turn)
        pose_turn.save(os.path.join(rig_dir, f"{base_name}_dir_turn.png"))

        print(f"  ✓ {base_name}: layers & directional poses generated (Core: {core_cx}, {core_cy})")

print("All 15 character rigs and directional poses successfully generated!")
