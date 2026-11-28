"""Build clean 1024x682 Tier VII character sprites (full, body-only, guns-only, showcase),
warm Meteor Shield relic, and visual verification contact sheets for v421.
"""
import pathlib
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_dilation, distance_transform_edt, label

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
UPLOADS = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\.user_uploaded")
ASSETS = ROOT / "assets"
SCRATCH = ROOT / "scratch"

SOURCES = {
    "dynamo": UPLOADS / "media_1795824205636_62391e86.jpg",
    "helix":  UPLOADS / "media_1795824205674_9c2a4997.png",
    "meteor": UPLOADS / "media_1795824205685_383a1a72.png",
}

# Symmetric left-side twin shoulder weapon polygons calibrated on 1024x682 Tier VII renders.
# Keeps Dynamo's raised hands (x >= 408), Helix's central horn & mane (x >= 468),
# and Meteor's central dragon head (x >= 472) 100% intact on core-{mode}-t7-body.png.
LEFT_GUN_POLYS = {
    "dynamo": [(246, 0), (404, 0), (405, 168), (392, 196), (368, 212), (296, 212), (246, 178)],
    "helix":  [(296, 0), (458, 0), (460, 174), (442, 204), (322, 204), (294, 172)],
    "meteor": [(346, 0), (456, 0), (456, 158), (438, 182), (362, 182), (346, 158)],
}


def extract_dynamo_rgba(src_path: pathlib.Path) -> Image.Image:
    im = Image.open(src_path).convert("RGB")
    rgb = np.asarray(im, dtype=np.float32)
    h, w, _ = rgb.shape
    max_rgb = rgb.max(axis=2)

    # 1. Flood-fill exterior black background from all border pixels where max_rgb <= 20
    bg = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if max_rgb[y, x] <= 20 and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if max_rgb[y, x] <= 20 and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    while q:
        cy, cx = q.popleft()
        for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
            if 0 <= ny < h and 0 <= nx < w and not bg[ny, nx] and max_rgb[ny, nx] <= 20:
                bg[ny, nx] = True
                q.append((ny, nx))

    # 2. Catch enclosed black cutouts (between raised fingers/arms/braids/wings)
    dark_interior = (~bg) & (max_rgb <= 10)
    lbl, num = label(dark_interior)
    if num > 0:
        counts = np.bincount(lbl.ravel())
        large_ids = np.where(counts >= 14)[0]
        large_ids = large_ids[large_ids > 0]
        if large_ids.size > 0:
            bg |= np.isin(lbl, large_ids)

    # 3. 2px AA border feather + un-premultiply dark edge halo
    border = binary_dilation(bg, iterations=2) & (~bg)
    alpha = np.where(bg, 0.0, 1.0).astype(np.float32)
    feather = np.clip((max_rgb - 6.0) / 30.0, 0.0, 1.0)
    alpha[border] = np.minimum(alpha[border], feather[border])

    low_a = (alpha > 0.04) & (alpha < 0.99)
    for c in range(3):
        rgb[:, :, c][low_a] = np.clip(rgb[:, :, c][low_a] / np.maximum(alpha[low_a], 0.16), 0.0, 255.0)

    rgba = np.dstack([
        np.clip(rgb[:, :, 0], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 1], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 2], 0, 255).astype(np.uint8),
        np.clip(alpha * 255.0, 0, 255).astype(np.uint8),
    ])
    return Image.fromarray(rgba, "RGBA")


def polish_rgba_edges(src_path: pathlib.Path) -> Image.Image:
    im = Image.open(src_path).convert("RGBA")
    arr = np.asarray(im, dtype=np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    arr[a < 16, 3] = 0.0
    a = arr[:, :, 3]

    transparent = a < 16
    near_edge = binary_dilation(transparent, iterations=2) & (~transparent)
    min_c = np.minimum(np.minimum(r, g), b)
    max_c = np.maximum(np.maximum(r, g), b)
    sat = max_c - min_c
    white_spill = (near_edge & (min_c > 160) & (sat < 52)) | ((a < 220) & (a > 0) & (min_c > 175) & (sat < 48))

    clean_src = (a >= 225) & (~white_spill) & (~near_edge)
    if clean_src.any() and white_spill.any():
        _, indices = distance_transform_edt(~clean_src, return_indices=True)
        iy, ix = indices[0], indices[1]
        for c in range(3):
            arr[:, :, c][white_spill] = arr[:, :, c][iy[white_spill], ix[white_spill]]
        arr[:, :, 3][white_spill & (a < 220)] *= 0.45

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


def build_symmetric_mask(width: int, height: int, left_poly) -> np.ndarray:
    m_img = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(m_img)
    draw.polygon(left_poly, fill=255)
    right_poly = [(width - 1 - x, y) for (x, y) in left_poly]
    draw.polygon(right_poly, fill=255)
    m_soft = m_img.filter(ImageFilter.GaussianBlur(radius=1.2))
    return np.asarray(m_soft, dtype=np.float32) / 255.0


def warm_meteor_shield_relic():
    p = ASSETS / "powerup-shield-meteor.png"
    if not p.exists():
        return
    im = Image.open(p).convert("RGBA")
    arr = np.asarray(im, dtype=np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    max_rgb = np.maximum(np.maximum(r, g), b)
    dark_mask = (a > 40) & (max_rgb < 75)
    if dark_mask.any():
        blend = np.clip((75.0 - max_rgb) / 75.0, 0.0, 1.0)
        arr[:, :, 0] = np.clip(r + 95.0 * blend * dark_mask, 0, 255)
        arr[:, :, 1] = np.clip(g + 58.0 * blend * dark_mask, 0, 255)
        arr[:, :, 2] = np.clip(b + 18.0 * blend * dark_mask, 0, 255)
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    out.save(p, optimize=True)
    print(f"WARMED -> {p.name} (dark_px_lifted={int(dark_mask.sum())})")


def main():
    SCRATCH.mkdir(parents=True, exist_ok=True)
    cell_w, cell_h = 360, 240
    sheet = Image.new("RGBA", (cell_w * 3, cell_h * 3 + 36), (12, 16, 28, 255))
    sdraw = ImageDraw.Draw(sheet)

    for row_idx, mode in enumerate(("dynamo", "helix", "meteor")):
        src = SOURCES[mode]
        if not src.exists():
            raise FileNotFoundError(f"Missing Tier VII source image: {src}")
        full_img = extract_dynamo_rgba(src) if mode == "dynamo" else polish_rgba_edges(src)
        assert full_img.size == (1024, 682), f"Unexpected size for {mode}: {full_img.size}"

        full_out = ASSETS / f"core-{mode}-t7.png"
        showcase_out = ASSETS / f"core-{mode}-t7-showcase.png"
        full_img.save(full_out, optimize=True)
        full_img.save(showcase_out, optimize=True)

        w, h = full_img.size
        arr = np.asarray(full_img, dtype=np.float32)
        mask = build_symmetric_mask(w, h, LEFT_GUN_POLYS[mode])

        body_arr = arr.copy()
        body_arr[:, :, 3] = np.round(arr[:, :, 3] * (1.0 - mask))
        guns_arr = arr.copy()
        guns_arr[:, :, 3] = np.round(arr[:, :, 3] * mask)

        body_img = Image.fromarray(np.clip(body_arr, 0, 255).astype(np.uint8), "RGBA")
        guns_img = Image.fromarray(np.clip(guns_arr, 0, 255).astype(np.uint8), "RGBA")

        body_out = ASSETS / f"core-{mode}-t7-body.png"
        guns_out = ASSETS / f"core-{mode}-t7-guns.png"
        body_img.save(body_out, optimize=True)
        guns_img.save(guns_out, optimize=True)

        guns_px = int((np.asarray(guns_img)[:, :, 3] > 20).sum())
        body_px = int((np.asarray(body_img)[:, :, 3] > 20).sum())
        print(f"{mode:6s}-t7: full={full_out.name} body_px={body_px} guns_px={guns_px}")

        row_y = 28 + row_idx * cell_h
        for col_idx, (label_txt, panel_im) in enumerate((
            (f"{mode.upper()} T7 BODY (Idle)", body_img),
            (f"{mode.upper()} T7 GUNS ONLY", guns_img),
            (f"{mode.upper()} T7 FULL", full_img),
        )):
            x0 = col_idx * cell_w
            thumb = panel_im.copy()
            thumb.thumbnail((cell_w - 16, cell_h - 32), Image.Resampling.LANCZOS)
            px = x0 + (cell_w - thumb.width) // 2
            py = row_y + 24 + (cell_h - 28 - thumb.height) // 2
            sheet.alpha_composite(thumb, (px, py))
            sdraw.text((x0 + 12, row_y + 4), label_txt, fill=(224, 242, 254, 255))

    split_path = SCRATCH / "tier7_body_vs_guns_split.png"
    sheet.save(split_path, optimize=True)
    print("SAVED_T7_SPLIT_SHEET:", split_path)

    warm_meteor_shield_relic()

    # Build v421 Friendly Good Relics Contact Sheet
    relics = [
        ("AEGIS SHIELD", "powerup-shield-dynamo.png"),
        ("PRISM AEGIS", "powerup-shield-helix.png"),
        ("BULWARK (WARM)", "powerup-shield-meteor.png"),
        ("MISSILES (FRIENDLY)", "powerup-missiles-3d.png"),
        ("2X CLUSTER", "powerup-cluster-3d.png"),
        ("HYPER (SUN-BLOSSOM)", "powerup-supercharge-3d.png"),
        ("CHRONOS STASIS", "powerup-chronos-3d.png"),
        ("VACUUM", "powerup-singularity-3d.png"),
        ("+1 LIFE CATALYST", "powerup-catalyst-3d.png"),
    ]
    g_sheet = Image.new("RGBA", (3 * 280, 3 * 280), (10, 18, 36, 255))
    g_draw = ImageDraw.Draw(g_sheet)
    for idx, (lbl, fn) in enumerate(relics):
        tile = Image.open(ASSETS / fn).convert("RGBA").resize((230, 230), Image.Resampling.LANCZOS)
        gx, gy = (idx % 3) * 280 + 25, (idx // 3) * 280 + 34
        g_sheet.alpha_composite(tile, (gx, gy))
        g_draw.text(((idx % 3) * 280 + 16, (idx // 3) * 280 + 8), lbl, fill=(254, 240, 138, 255))
    g_path = SCRATCH / "v421_friendly_good_relics_sheet.png"
    g_sheet.save(g_path, optimize=True)
    print("SAVED_FRIENDLY_RELICS_SHEET:", g_path)


if __name__ == "__main__":
    main()
