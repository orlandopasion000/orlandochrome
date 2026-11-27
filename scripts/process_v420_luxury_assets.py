import pathlib
from collections import deque
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, distance_transform_edt

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
ART = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039")
ASSETS = ROOT / "assets"
PBR_RAW = ROOT / "scratch" / "pbr_raw_512"

JPG_ASSETS = [
    # (source_jpg_name, dest_png_name, out_size, is_ring)
    ("chrome_dynamo_royal_shield_icon_1795782213435.jpg", "powerup-shield-dynamo.png", 256, False),
    ("chrome_helix_crystal_shield_icon_1795782211536.jpg", "powerup-shield-helix.png", 256, False),
    ("dragon_bulwark_tower_shield_v3_1795782249572.jpg", "powerup-shield-meteor.png", 256, False),
    ("chrome_dynamo_shield_ring_frame_v3_1795782261774.jpg", "shield-barrier-dynamo.png", 512, True),
    ("chrome_helix_crystal_ring_frame_v2_1795782238461.jpg", "shield-barrier-helix.png", 512, True),
    ("dragon_bulwark_ring_frame_v3_1795782256813.jpg", "shield-barrier-meteor.png", 512, True),
    ("celestial_astrolabe_relic_icon_1795782293393.jpg", "powerup-chronos-3d.png", 256, False),
    ("hazard_mine_core_1795782319879.jpg", "hazard-core-meteor-3d.png", 256, False),
]


def flood_dark_bg(max_rgb: np.ndarray, seeds: list[tuple[int, int]], thresh: int = 22) -> np.ndarray:
    h, w = max_rgb.shape
    bg = np.zeros((h, w), dtype=bool)
    q = deque()
    for sy, sx in seeds:
        if 0 <= sy < h and 0 <= sx < w and max_rgb[sy, sx] <= thresh and not bg[sy, sx]:
            bg[sy, sx] = True
            q.append((sy, sx))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not bg[ny, nx] and max_rgb[ny, nx] <= thresh:
                bg[ny, nx] = True
                q.append((ny, nx))
    return bg


def extract_clean_rgba(src_path: pathlib.Path, out_size: int, is_ring: bool) -> Image.Image:
    im = Image.open(src_path).convert("RGB")
    arr = np.asarray(im, dtype=np.uint8)
    h, w, _ = arr.shape
    max_rgb = arr.max(axis=2)

    # Auto-crop square bounding box around non-black foreground
    fg_coords = np.argwhere(max_rgb > 24)
    if fg_coords.size > 0:
        y0, x0 = fg_coords.min(axis=0)
        y1, x1 = fg_coords.max(axis=0)
        cx = (x0 + x1) * 0.5
        cy = (y0 + y1) * 0.5
        half = max(x1 - x0, y1 - y0) * 0.5 * 1.07
        sx0 = max(0, int(round(cx - half)))
        sy0 = max(0, int(round(cy - half)))
        sx1 = min(w, int(round(cx + half)))
        sy1 = min(h, int(round(cy + half)))
        side = max(sx1 - sx0, sy1 - sy0)
        square = Image.new("RGB", (side, side), (0, 0, 0))
        crop = im.crop((sx0, sy0, sx1, sy1))
        square.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
        im = square

    # Work at 2x target or current size for smooth anti-aliased alpha edge
    work_sz = max(512, out_size * 2)
    im = im.resize((work_sz, work_sz), Image.Resampling.LANCZOS)
    rgb = np.asarray(im, dtype=np.float32)
    max_rgb = rgb.max(axis=2)

    seeds = [(0, 0), (0, work_sz - 1), (work_sz - 1, 0), (work_sz - 1, work_sz - 1)]
    if is_ring:
        seeds.append((work_sz // 2, work_sz // 2))

    bg = flood_dark_bg(max_rgb.astype(np.uint8), seeds, thresh=24)

    # For rings, clear stray JPEG noise inside inner 34% center radius
    if is_ring:
        yy, xx = np.ogrid[:work_sz, :work_sz]
        dist = np.hypot(xx - work_sz * 0.5, yy - work_sz * 0.5)
        bg = bg | (dist < work_sz * 0.17)

    # Smooth feather along the 2px border between flood bg & subject
    border = binary_dilation(bg, iterations=3) & (~bg)
    alpha = np.where(bg, 0.0, 1.0).astype(np.float32)
    feather_alpha = np.clip((max_rgb - 8.0) / 30.0, 0.0, 1.0)
    alpha[border] = np.minimum(alpha[border], feather_alpha[border])

    # Unmultiply dark black halo on translucent border pixels
    low_a = (alpha > 0.04) & (alpha < 0.99)
    for c in range(3):
        rgb[:, :, c][low_a] = np.clip(rgb[:, :, c][low_a] / np.maximum(alpha[low_a], 0.14), 0.0, 255.0)

    rgba = np.dstack([
        np.clip(rgb[:, :, 0], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 1], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 2], 0, 255).astype(np.uint8),
        np.clip(alpha * 255.0, 0, 255).astype(np.uint8),
    ])
    out = Image.fromarray(rgba, mode="RGBA")
    if out.width != out_size:
        out = out.resize((out_size, out_size), Image.Resampling.LANCZOS)
    return out


def crop_and_resize_pbr(src_path: pathlib.Path, out_size: int = 256) -> Image.Image:
    im = Image.open(src_path).convert("RGBA")
    arr = np.asarray(im)
    alpha = arr[:, :, 3]
    coords = np.argwhere(alpha > 12)
    if coords.size > 0:
        y0, x0 = coords.min(axis=0)
        y1, x1 = coords.max(axis=0)
        cx = (x0 + x1) * 0.5
        cy = (y0 + y1) * 0.5
        half = max(x1 - x0, y1 - y0) * 0.5 * 1.12
        sx0 = max(0, int(round(cx - half)))
        sy0 = max(0, int(round(cy - half)))
        sx1 = min(im.width, int(round(cx + half)))
        sy1 = min(im.height, int(round(cy + half)))
        side = max(sx1 - sx0, sy1 - sy0)
        sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        crop = im.crop((sx0, sy0, sx1, sy1))
        sq.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
        im = sq
    return im.resize((out_size, out_size), Image.Resampling.LANCZOS)


def defringe_white_halo(png_path: pathlib.Path) -> None:
    im = Image.open(png_path).convert("RGBA")
    arr = np.asarray(im, dtype=np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    transparent = a < 18
    near_edge = binary_dilation(transparent, iterations=3) & (~transparent)

    min_c = np.minimum(np.minimum(r, g), b)
    max_c = np.maximum(np.maximum(r, g), b)
    sat = max_c - min_c
    # Desaturated bright chalky white edge contamination
    white_spill = (near_edge & (min_c > 140) & (sat < 62)) | ((a < 230) & (a > 0) & (min_c > 155) & (sat < 55))

    clean_src = (a >= 225) & (~white_spill) & (~near_edge)
    if not clean_src.any():
        return
    _, indices = distance_transform_edt(~clean_src, return_indices=True)
    iy, ix = indices[0], indices[1]
    for c in range(3):
        arr[:, :, c][white_spill] = arr[:, :, c][iy[white_spill], ix[white_spill]]
    # Attenuate partial edge alpha where white matte spill lived
    arr[:, :, 3][white_spill & (a < 220)] *= 0.35

    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="RGBA")
    out.save(png_path, optimize=True)


def main():
    import sys
    pbr_only = '--pbr-only' in sys.argv
    if not pbr_only:
        # 1. Process 8 image-generator JPGs into transparent RGBA PNGs
        for src_name, dst_name, sz, is_ring in JPG_ASSETS:
            src = ART / src_name
            if not src.exists():
                raise FileNotFoundError(f"Missing generated JPG: {src}")
            out_img = extract_clean_rgba(src, sz, is_ring)
            out_path = ASSETS / dst_name
            out_img.save(out_path, optimize=True)
            print(f"PROCESSED_JPG -> {dst_name} ({sz}x{sz}, ring={is_ring})")

    # 2. Crop & resize 8 Three.js 512x512 PBR renders to 256x256
    for pbr_file in sorted(PBR_RAW.glob("*.png")):
        out_img = crop_and_resize_pbr(pbr_file, 256)
        out_path = ASSETS / pbr_file.name
        out_img.save(out_path, optimize=True)
        print(f"PROCESSED_PBR -> {pbr_file.name} (256x256)")

    if not pbr_only:
        # 3. De-fringe all 15 hazard-powered-*.png assets
        powered_list = sorted(ASSETS.glob("hazard-powered-*.png"))
        for p in powered_list:
            defringe_white_halo(p)
            print(f"DEFRINGED -> {p.name}")

    # Also build a visual contact sheet of all 16 new assets so we can inspect them fast!
    all_new = [
        "powerup-shield-dynamo.png", "powerup-shield-helix.png", "powerup-shield-meteor.png",
        "shield-barrier-dynamo.png", "shield-barrier-helix.png", "shield-barrier-meteor.png",
        "powerup-missiles-3d.png", "powerup-cluster-3d.png", "powerup-supercharge-3d.png",
        "powerup-chronos-3d.png", "powerup-singularity-3d.png", "powerup-catalyst-3d.png",
        "hazard-core-dynamo-3d.png", "hazard-core-helix-3d.png", "hazard-core-meteor-3d.png",
        "hazard-seeker-ring-3d.png",
    ]
    sheet = Image.new("RGBA", (4 * 260, 4 * 260), (6, 8, 18, 255))
    for idx, fn in enumerate(all_new):
        tile = Image.open(ASSETS / fn).convert("RGBA").resize((240, 240), Image.Resampling.LANCZOS)
        gx, gy = (idx % 4) * 260 + 10, (idx // 4) * 260 + 10
        sheet.alpha_composite(tile, (gx, gy))
    sheet.save(ROOT / "scratch" / "v420_assets_contact_sheet.png", optimize=True)
    print("CONTACT_SHEET_SAVED:", ROOT / "scratch" / "v420_assets_contact_sheet.png")


if __name__ == "__main__":
    main()
