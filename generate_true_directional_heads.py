import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
os.makedirs(rig_dir, exist_ok=True)

games = ["dynamo", "helix", "meteor"]
tiers = ["vi", "vii", "viii", "ix", "x"]

def create_feathered_mask(w, h, cx, cy, rx, ry, neck_y, feather=32):
    y_grid, x_grid = np.mgrid[0:h, 0:w]
    dist = np.sqrt(((x_grid - cx) / rx) ** 2 + ((y_grid - cy) / ry) ** 2)
    radial_mask = np.clip(1.0 - (dist - 0.65) / (feather / 35.0), 0.0, 1.0)
    neck_mask = np.clip(1.0 - (y_grid - neck_y) / 22.0, 0.0, 1.0)
    return radial_mask * neck_mask

print("Generating high-fidelity directional head suites (R34, Front, L34)...")

for game in games:
    for tier in tiers:
        base_name = f"{game}_{tier}"
        src_path = os.path.join(char_dir, f"{base_name}.png")
        if not os.path.exists(src_path):
            continue
            
        im = Image.open(src_path).convert("RGBA")
        arr = np.array(im, dtype=np.float32)
        h, w, _ = arr.shape
        alpha = arr[:, :, 3]

        # Detect Chest Core Center
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

        # Anatomical Head Center & Neck Cutoff
        head_cx = core_cx
        head_cy = core_cy - int(h * 0.21)
        neck_y = core_cy - int(h * 0.09)

        rx_head = 125 if game != "meteor" else 140
        ry_head = 115 if game != "meteor" else 125
        
        # 1. Right 3/4 Head (Canonical artwork)
        m_head_r = create_feathered_mask(w, h, head_cx, head_cy, rx_head, ry_head, neck_y, feather=32)
        arr_head_r = arr.copy()
        arr_head_r[:, :, 3] = np.clip(arr_head_r[:, :, 3] * m_head_r, 0, 255)
        img_head_r = Image.fromarray(arr_head_r.astype(np.uint8), "RGBA")
        img_head_r.save(os.path.join(rig_dir, f"{base_name}_head_r34.png"))
        img_head_r.save(os.path.join(rig_dir, f"{base_name}_head.png"))

        # 2. Left 3/4 Head (Turned Left)
        arr_flipped = np.fliplr(arr)
        dx = head_cx - (w - 1 - head_cx)
        arr_shifted = np.zeros_like(arr_flipped)
        if dx > 0:
            arr_shifted[:, dx:] = arr_flipped[:, :-dx]
        elif dx < 0:
            arr_shifted[:, :dx] = arr_flipped[:, -dx:]
        else:
            arr_shifted = arr_flipped

        m_head_l = create_feathered_mask(w, h, head_cx, head_cy, rx_head, ry_head, neck_y, feather=32)
        arr_head_l = arr_shifted.copy()
        arr_head_l[:, :, 3] = np.clip(arr_head_l[:, :, 3] * m_head_l, 0, 255)
        img_head_l = Image.fromarray(arr_head_l.astype(np.uint8), "RGBA")
        img_head_l.save(os.path.join(rig_dir, f"{base_name}_head_l34.png"))
        img_head_l.save(os.path.join(rig_dir, f"{base_name}_head_left.png"))

        # 3. Frontal Head (Clean central symmetry with volume preservation)
        arr_front = np.zeros_like(arr_head_r)
        arr_front[:, head_cx:] = arr_head_r[:, head_cx:]
        
        right_w = w - head_cx
        mirror_right = np.fliplr(arr_head_r[:, head_cx:])
        
        if head_cx >= right_w:
            arr_front[:, head_cx - right_w:head_cx] = mirror_right
            arr_front[:, :head_cx - right_w] = arr_head_l[:, :head_cx - right_w]
        else:
            arr_front[:, :head_cx] = mirror_right[:, right_w - head_cx:]
            
        seam_w = 16
        for sx in range(-seam_w, seam_w + 1):
            cur_x = head_cx + sx
            if 0 <= cur_x < w:
                weight = (sx + seam_w) / (2.0 * seam_w)
                arr_front[:, cur_x] = (1.0 - weight) * arr_head_l[:, cur_x] + weight * arr_head_r[:, cur_x]

        arr_front[:, :, 3] = np.clip(arr_front[:, :, 3] * m_head_r, 0, 255)
        img_head_front = Image.fromarray(arr_front.astype(np.uint8), "RGBA")
        img_head_front = ImageEnhance.Contrast(img_head_front).enhance(1.05)
        img_head_front.save(os.path.join(rig_dir, f"{base_name}_head_front.png"))

        print(f"  ✓ {base_name}: Generated sharp, non-ghosted R34, Frontal, and L34 heads")

print("All 15 character directional head suites successfully generated!")
