"""Split twin shoulder weapons out of Tier VI character PNGs into paired
core-{mode}-t6-body.png and core-{mode}-t6-guns.png layers using symmetric AA polygons.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(ROOT_DIR, "assets")
SCRATCH_DIR = os.path.join(ROOT_DIR, "scratch")

# Tight left-side weapon polygons calibrated on 1024x682 Tier VI assets; mirrored across x = 1023 - x.
LEFT_POLYGONS = {
    "dynamo": [
        # Gun spire & barrel y=8..198, x=320..415; tapers y=198..225 to x=332..376 above shoulder bezel
        (320, 8),
        (416, 8),
        (416, 178),
        (394, 198),
        (376, 225),
        (334, 225),
        (320, 196),
    ],
    "helix": [
        # Shoulder caster orb & pedestal y=138..210, x=364..448; tapers y=210..227 to x=377..436
        (364, 138),
        (448, 138),
        (448, 208),
        (436, 227),
        (377, 227),
        (364, 206),
    ],
    "meteor": [
        # Volcanic tri-barrel skull turret y=78..150, x=348..424; tapers y=150..169 to x=368..406
        (348, 78),
        (424, 78),
        (424, 148),
        (406, 169),
        (368, 169),
        (348, 148),
    ],
}


def build_symmetric_mask(width: int, height: int, left_poly) -> np.ndarray:
    m_img = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(m_img)
    draw.polygon(left_poly, fill=255)
    right_poly = [(width - 1 - x, y) for (x, y) in left_poly]
    draw.polygon(right_poly, fill=255)
    # 1.2px Gaussian blur creates a clean ~1.5px AA feather transition so body + guns sum cleanly.
    m_soft = m_img.filter(ImageFilter.GaussianBlur(radius=1.0))
    return np.array(m_soft, dtype=np.float32) / 255.0


def main():
    os.makedirs(SCRATCH_DIR, exist_ok=True)
    cell_w, cell_h = 360, 240
    sheet = Image.new("RGBA", (cell_w * 3, cell_h * 3 + 36), (12, 14, 22, 255))
    sdraw = ImageDraw.Draw(sheet)

    for row_idx, mode in enumerate(("dynamo", "helix", "meteor")):
        src_path = os.path.join(ASSET_DIR, f"core-{mode}-t6.png")
        img = Image.open(src_path).convert("RGBA")
        w, h = img.size
        arr = np.array(img, dtype=np.float32)

        mask = build_symmetric_mask(w, h, LEFT_POLYGONS[mode])

        body_arr = arr.copy()
        body_arr[:, :, 3] = np.round(arr[:, :, 3] * (1.0 - mask))
        guns_arr = arr.copy()
        guns_arr[:, :, 3] = np.round(arr[:, :, 3] * mask)

        body_img = Image.fromarray(np.clip(body_arr, 0, 255).astype(np.uint8), "RGBA")
        guns_img = Image.fromarray(np.clip(guns_arr, 0, 255).astype(np.uint8), "RGBA")

        body_out = os.path.join(ASSET_DIR, f"core-{mode}-t6-body.png")
        guns_out = os.path.join(ASSET_DIR, f"core-{mode}-t6-guns.png")
        body_img.save(body_out)
        guns_img.save(guns_out)

        # Verify conservation on composite check
        recomp = body_img.copy()
        recomp.alpha_composite(guns_img, (0, 0))
        max_alpha_diff = int(np.abs(np.array(img)[:, :, 3].astype(int) - np.array(recomp)[:, :, 3].astype(int)).max())
        guns_px = int((np.array(guns_img)[:, :, 3] > 20).sum())
        print(f"{mode:6s}-t6 split: body={body_out} guns={guns_out} guns_px={guns_px} max_recomp_alpha_diff={max_alpha_diff}")

        row_y = 28 + row_idx * cell_h
        for col_idx, (label, panel_im) in enumerate((
            (f"{mode.upper()} BODY (Idle)", body_img),
            (f"{mode.upper()} GUNS ONLY", guns_img),
            (f"{mode.upper()} BODY+GUNS", recomp),
        )):
            x0 = col_idx * cell_w
            thumb = panel_im.copy()
            thumb.thumbnail((cell_w - 16, cell_h - 32), Image.Resampling.LANCZOS)
            px = x0 + (cell_w - thumb.width) // 2
            py = row_y + 24 + (cell_h - 28 - thumb.height) // 2
            sheet.alpha_composite(thumb, (px, py))
            sdraw.text((x0 + 12, row_y + 4), label, fill=(210, 235, 255, 255))

    preview_path = os.path.join(SCRATCH_DIR, "tier6_body_vs_guns_split.png")
    sheet.save(preview_path)
    print("Saved split verification sheet:", preview_path)


if __name__ == "__main__":
    main()
