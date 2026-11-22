import os
import numpy as np
from PIL import Image

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")

games = ["dynamo", "helix", "meteor"]
tiers = ["vi", "vii", "viii", "ix", "x"]

print("Slicing multi-wing layers for independent articulation...")

for game in games:
    for tier in tiers:
        base_name = f"{game}_{tier}"
        wl_path = os.path.join(rig_dir, f"{base_name}_wing_l.png")
        wr_path = os.path.join(rig_dir, f"{base_name}_wing_r.png")
        
        if not os.path.exists(wl_path) or not os.path.exists(wr_path):
            continue
            
        im_l = Image.open(wl_path).convert("RGBA")
        im_r = Image.open(wr_path).convert("RGBA")
        arr_l = np.array(im_l, dtype=np.float32)
        arr_r = np.array(im_r, dtype=np.float32)
        h, w, _ = arr_l.shape

        # Vertical slicing coordinates
        # Upper wings: Y < h * 0.40
        # Middle wings: h * 0.35 <= Y < h * 0.65
        # Lower wings: Y >= h * 0.60
        y_grid = np.arange(h)[:, None]

        # Upper Wing Mask (smooth roll-off at lower edge)
        m_upper = np.clip(1.0 - (y_grid - (h * 0.38)) / (h * 0.10), 0.0, 1.0)
        # Middle Wing Mask
        m_mid = np.clip(1.0 - np.abs(y_grid - (h * 0.50)) / (h * 0.18), 0.0, 1.0)
        # Lower Wing Mask (smooth roll-off at top edge)
        m_lower = np.clip((y_grid - (h * 0.58)) / (h * 0.10), 0.0, 1.0)

        # Upper Left & Right
        l_up = arr_l.copy()
        l_up[:, :, 3] = np.clip(l_up[:, :, 3] * m_upper, 0, 255)
        Image.fromarray(l_up.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_upper_l.png"))
        r_up = arr_r.copy()
        r_up[:, :, 3] = np.clip(r_up[:, :, 3] * m_upper, 0, 255)
        Image.fromarray(r_up.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_upper_r.png"))

        # Middle Left & Right
        l_mid = arr_l.copy()
        l_mid[:, :, 3] = np.clip(l_mid[:, :, 3] * m_mid, 0, 255)
        Image.fromarray(l_mid.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_mid_l.png"))
        r_mid = arr_r.copy()
        r_mid[:, :, 3] = np.clip(r_mid[:, :, 3] * m_mid, 0, 255)
        Image.fromarray(r_mid.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_mid_r.png"))

        # Lower Left & Right
        l_low = arr_l.copy()
        l_low[:, :, 3] = np.clip(l_low[:, :, 3] * m_lower, 0, 255)
        Image.fromarray(l_low.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_lower_l.png"))
        r_low = arr_r.copy()
        r_low[:, :, 3] = np.clip(r_low[:, :, 3] * m_lower, 0, 255)
        Image.fromarray(r_low.astype(np.uint8), "RGBA").save(os.path.join(rig_dir, f"{base_name}_wing_lower_r.png"))

        print(f"  ✓ {base_name}: Generated independent Upper, Middle, and Lower wing layers")

print("All multi-wing independent layers successfully generated!")
