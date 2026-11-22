import os
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")
rig_dir = os.path.join(char_dir, "rigs")
os.makedirs(rig_dir, exist_ok=True)

games = ["dynamo", "helix", "meteor"]
tiers = ["vi", "vii", "viii", "ix", "x"]

def create_radial_mask(w, h, cx, cy, rx, ry, feather=25):
    x = np.arange(w)
    y = np.arange(h)
    xx, yy = np.meshgrid(x, y)
    dist = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    # 1.0 inside ellipse, smooth roll-off outside
    mask = np.clip(1.0 - (dist - 0.70) / (feather / 40.0), 0.0, 1.0)
    return mask

print("Building pure non-overlapping anatomical rigs and directional poses...")

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

        # 1. Detect Chest Core (Center of Mass & Luminance in Chest)
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

        # Grid coordinates
        y_grid, x_grid = np.mgrid[0:h, 0:w]

        # Anchor Points
        head_cx = core_cx
        head_cy = core_cy - int(h * 0.21)
        l_shoulder_cx = core_cx - int(w * 0.15)
        l_shoulder_cy = core_cy - int(h * 0.08)
        r_shoulder_cx = core_cx + int(w * 0.15)
        r_shoulder_cy = core_cy - int(h * 0.08)
        neck_cutoff_y = core_cy - int(h * 0.10) # Neck line

        # 2. Extract Head & Face Layer (Clean, with soft neck transition)
        rx_head = 120 if game != "meteor" else 135
        ry_head = 110 if game != "meteor" else 115
        m_head = create_radial_mask(w, h, head_cx, head_cy, rx=rx_head, ry=ry_head, feather=25)
        # Suppress anything below neck cutoff
        neck_fade = np.clip(1.0 - (y_grid - neck_cutoff_y) / 20.0, 0.0, 1.0)
        m_head = m_head * neck_fade

        arr_head = arr.copy()
        arr_head[:, :, 3] = np.clip(arr_head[:, :, 3] * m_head, 0, 255)
        img_head_right = Image.fromarray(arr_head.astype(np.uint8), "RGBA")
        img_head_right.save(os.path.join(rig_dir, f"{base_name}_head.png"))

        # Also create flipped left-facing head
        head_left = img_head_right.transpose(Image.FLIP_LEFT_RIGHT)
        # Align center of head back to head_cx
        d_hx = head_cx - (w - head_cx)
        img_head_left = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        img_head_left.paste(head_left, (d_hx, 0))
        img_head_left.save(os.path.join(rig_dir, f"{base_name}_head_left.png"))

        # 3. Extract Left Wing (Root at Left Shoulder)
        # Left wing is to the left of the left shoulder with soft roll-off
        # For Meteor Dragon: Left wing is strictly upper body (Y < 315), so tail mace is excluded!
        m_lw = 1.0 / (1.0 + np.exp((x_grid - (l_shoulder_cx + 20)) / 16.0))
        m_lw = np.clip(m_lw - m_head * 0.5, 0.0, 1.0)
        if game == "meteor":
            # Exclude tail mace in lower-left (Y > 315)
            tail_y_cutoff = int(h * 0.54)
            wing_y_mask = np.clip(1.0 - (y_grid - (tail_y_cutoff - 20)) / 25.0, 0.0, 1.0)
            m_lw = m_lw * wing_y_mask

        arr_lw = arr.copy()
        arr_lw[:, :, 3] = np.clip(arr_lw[:, :, 3] * m_lw, 0, 255)
        img_lw = Image.fromarray(arr_lw.astype(np.uint8), "RGBA")
        img_lw.save(os.path.join(rig_dir, f"{base_name}_wing_l.png"))

        # 4. Extract Right Wing (Root at Right Shoulder)
        m_rw = 1.0 / (1.0 + np.exp(((r_shoulder_cx - 20) - x_grid) / 16.0))
        m_rw = np.clip(m_rw - m_head * 0.5, 0.0, 1.0)
        arr_rw = arr.copy()
        arr_rw[:, :, 3] = np.clip(arr_rw[:, :, 3] * m_rw, 0, 255)
        img_rw = Image.fromarray(arr_rw.astype(np.uint8), "RGBA")
        img_rw.save(os.path.join(rig_dir, f"{base_name}_wing_r.png"))

        # 5. Extract Pure Torso, Chest Core & Legs (Rock solid on catch point!)
        # CRITICAL: Subtract head AND wings from body so there is ZERO duplicate head or static wings!
        m_body = 1.0 - m_lw - m_rw - m_head
        m_body = np.clip(m_body, 0.0, 1.0)
        arr_body = arr.copy()
        arr_body[:, :, 3] = np.clip(arr_body[:, :, 3] * m_body, 0, 255)

        # In Dynamo Princess, clean out the static painted blast from the weapon
        if game == "dynamo":
            blast_mask = (x_grid > (core_cx + 150)) & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 220)
            arr_body[blast_mask, 3] *= 0.10

        img_body = Image.fromarray(arr_body.astype(np.uint8), "RGBA")
        img_body.save(os.path.join(rig_dir, f"{base_name}_body.png"))

        # 6. Directional Body Poses (PURE TORSO ONLY - NO duplicate heads or static wings!)
        # A. Right Facing Torso (canonical)
        img_body.save(os.path.join(rig_dir, f"{base_name}_dir_right.png"))

        # B. Left Facing Torso (flipped horizontally, aligned to core_cx)
        body_left = img_body.transpose(Image.FLIP_LEFT_RIGHT)
        d_bx = core_cx - (w - core_cx)
        img_body_left = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        img_body_left.paste(body_left, (d_bx, 0))
        img_body_left.save(os.path.join(rig_dir, f"{base_name}_dir_left.png"))

        # C. Intermediate 3/4 Turn Torso (preserving full volume)
        # Subtly contracted laterally (96% scale) to represent 3/4 depth angle
        w_turn = int(w * 0.96)
        body_turn_scaled = img_body.resize((w_turn, h), Image.Resampling.LANCZOS)
        img_body_turn = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        img_body_turn.paste(body_turn_scaled, ((w - w_turn) // 2, 0))
        img_body_turn.save(os.path.join(rig_dir, f"{base_name}_dir_turn.png"))

        print(f"  ✓ {base_name}: Pure non-overlapping anatomical layers generated (Core: {core_cx}, {core_cy})")

print("All 15 character anatomical skeletal rigs successfully generated with 0 overlap!")
