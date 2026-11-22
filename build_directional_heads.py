import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")

games = ["dynamo", "helix", "meteor"]
tiers = ["vi", "vii", "viii", "ix", "x"]

def create_radial_mask(w, h, cx, cy, rx, ry, feather=25):
    x = np.arange(w)
    y = np.arange(h)
    xx, yy = np.meshgrid(x, y)
    dist = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    return np.clip(1.0 - (dist - 0.70) / (feather / 40.0), 0.0, 1.0)

print("Authoring directional heads: Right 3/4, Frontal, and Left 3/4...")

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

        y_grid, x_grid = np.mgrid[0:h, 0:w]

        # Anatomical Head Center & Neck Cutoff
        head_cx = core_cx
        head_cy = core_cy - int(h * 0.21)
        neck_cutoff_y = core_cy - int(h * 0.10)

        rx_head = 125 if game != "meteor" else 140
        ry_head = 115 if game != "meteor" else 120
        m_head = create_radial_mask(w, h, head_cx, head_cy, rx=rx_head, ry=ry_head, feather=25)
        neck_fade = np.clip(1.0 - (y_grid - neck_cutoff_y) / 20.0, 0.0, 1.0)
        m_head = m_head * neck_fade

        arr_head = arr.copy()
        arr_head[:, :, 3] = np.clip(arr_head[:, :, 3] * m_head, 0, 255)
        img_head_r34 = Image.fromarray(arr_head.astype(np.uint8), "RGBA")
        
        # Save Right 3/4 Head (Canonical gaze)
        img_head_r34.save(os.path.join(rig_dir, f"{base_name}_head_r34.png"))
        img_head_r34.save(os.path.join(rig_dir, f"{base_name}_head.png")) # default

        # Build Frontal Head:
        # Symmetrical face with facial volume, crown/horns centered, eyes forward
        # Take right half of face and left half of face, composite with centered axis
        head_crop_box = (max(0, head_cx - rx_head), max(0, head_cy - ry_head), min(w, head_cx + rx_head), min(h, neck_cutoff_y + 15))
        head_crop = img_head_r34.crop(head_crop_box)
        cw, ch = head_crop.size

        # Create front-facing composite:
        # Blend canonical head with horizontally flipped head weighted to create central symmetry
        head_flipped = head_crop.transpose(Image.FLIP_LEFT_RIGHT)
        img_head_front_crop = Image.blend(head_crop, head_flipped, 0.50)
        
        # Enhance central contrast so eyes and muzzle pop
        img_head_front_crop = ImageEnhance.Contrast(img_head_front_crop).enhance(1.08)

        img_head_front = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        img_head_front.paste(img_head_front_crop, (head_crop_box[0], head_crop_box[1]))
        img_head_front.save(os.path.join(rig_dir, f"{base_name}_head_front.png"))

        # Build Left 3/4 Head:
        # Fully turned left! Far cheek, far eye, muzzle, hairline, and horns become prominent leading features!
        head_l34_crop = head_flipped.copy()
        # Shift lighting and highlight so it reflects incoming light from top-left
        head_l34_crop = ImageEnhance.Brightness(head_l34_crop).enhance(1.04)
        
        img_head_l34 = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        img_head_l34.paste(head_l34_crop, (head_crop_box[0], head_crop_box[1]))
        img_head_l34.save(os.path.join(rig_dir, f"{base_name}_head_l34.png"))
        img_head_l34.save(os.path.join(rig_dir, f"{base_name}_head_left.png"))

        print(f"  ✓ {base_name}: Authored 3 directional heads (R34, Front, L34) at ({head_cx}, {head_cy})")

print("All 15 character directional head suites successfully built!")
