"""Copy the 9 AAA image-generator strips into scratch/v423_aaa_catalog/ and assemble
high-resolution labeled catalog boards for Powered-Up Good & Bad Nodes.
"""
import pathlib
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
ASSETS = ROOT / "assets"
SCRATCH_CAT = ROOT / "scratch" / "v423_aaa_catalog"
ARTIFACTS = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039")

GOOD_SOURCES = [
    ("MISSILES", "Homing Volley", "good_missiles_strip.jpg", "good_missiles_strip_v3_1795829392992.jpg"),
    ("HYPER",    "Supercharge",   "good_hyper_strip.jpg",    "good_hyper_strip_v3_1795829384060.jpg"),
    ("2X DUP",   "Cluster Split", "good_dup_strip.jpg",      "good_dup_strip_1795829455994.jpg"),
    ("STASIS",   "Chronos Slow",  "good_stasis_strip.jpg",   "good_stasis_strip_1795829437208.jpg"),
    ("VACUUM",   "Magnet Pull",   "good_vacuum_strip.jpg",   "good_vacuum_strip_1795829442968.jpg"),
]

BAD_SOURCES = [
    ("COMET",  "Hyper Comet",     "bad_comet_strip.jpg",  "bad_comet_strip_1795829460030.jpg"),
    ("LASER",  "Corruptor Beam",  "bad_laser_strip.jpg",  "bad_laser_strip_1795829465444.jpg"),
    ("VORTEX", "Gravity Well",    "bad_vortex_strip.jpg", "bad_vortex_strip_1795829486470.jpg"),
    ("EMP",    "Shock Detonator", "bad_emp_strip.jpg",    "bad_emp_strip_1795829490764.jpg"),
]


def load_font(size: int, bold: bool = False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for fp in candidates:
        p = pathlib.Path(fp)
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def autocrop_strip(img: Image.Image, target_w: int = 1344) -> Image.Image:
    """Trim top/bottom excess pure-black padding while preserving ~28px headroom above relics and below labels."""
    rgb = np.asarray(img.convert("RGB"))
    # Rows where content (brighter than #0e0e0e) exists across width
    row_max = rgb.max(axis=(1, 2))
    non_black = np.where(row_max > 14)[0]
    if non_black.size > 0:
        y0 = max(0, int(non_black[0]) - 26)
        y1 = min(rgb.shape[0], int(non_black[-1]) + 28)
        img = img.crop((0, y0, img.width, y1))
    if img.width != target_w:
        new_h = max(1, round(img.height * (target_w / img.width)))
        img = img.resize((target_w, new_h), Image.Resampling.LANCZOS)
    return img.convert("RGBA")


def build_board(title: str, subtitle: str, strips_data, out_name: str, accent_rgb, include_blink_fallback: bool = False):
    strip_w = 1320
    row_pad_y = 14
    header_band_h = 54
    rendered_rows = []

    for label_top, label_sub, canon_name, src_name in strips_data:
        src_path = ARTIFACTS / src_name
        if not src_path.exists():
            raise FileNotFoundError(f"Missing generated strip: {src_path}")
        dest_path = SCRATCH_CAT / canon_name
        shutil.copy2(src_path, dest_path)
        im = Image.open(dest_path)
        cropped = autocrop_strip(im, target_w=strip_w)
        rendered_rows.append(("strip", label_top, label_sub, cropped))

    if include_blink_fallback:
        rendered_rows.append(("blink_fallback", "BLINK", "Phase Stalker", None))

    f_title = load_font(32, True)
    f_sub = load_font(17, False)
    f_row = load_font(22, True)
    f_rsub = load_font(16, False)
    f_cap = load_font(16, True)

    top_h = 104
    margin_x = 28
    board_w = strip_w + margin_x * 2
    total_h = top_h + 18
    for kind, _, _, im in rendered_rows:
        if kind == "strip":
            total_h += header_band_h + im.height + row_pad_y
        else:
            total_h += header_band_h + 260 + row_pad_y

    board = Image.new("RGBA", (board_w, total_h), (5, 8, 18, 255))
    draw = ImageDraw.Draw(board)

    draw.text((margin_x, 18), title, font=f_title, fill=(248, 250, 252, 255))
    draw.text((margin_x, 60), subtitle, font=f_sub, fill=accent_rgb + (235,))

    cur_y = top_h
    for kind, label_top, label_sub, im in rendered_rows:
        box_h = header_band_h + (im.height if kind == "strip" else 260)
        draw.rounded_rectangle(
            [margin_x - 6, cur_y, board_w - margin_x + 6, cur_y + box_h],
            radius=14,
            fill=(0, 0, 0, 255),
            outline=accent_rgb + (90,),
            width=2,
        )
        draw.rounded_rectangle(
            [margin_x - 6, cur_y, board_w - margin_x + 6, cur_y + header_band_h],
            radius=14,
            fill=(14, 21, 38, 255),
        )
        draw.text((margin_x + 14, cur_y + 13), f"{label_top}", font=f_row, fill=accent_rgb + (255,))
        draw.text((margin_x + 165, cur_y + 17), f"—  {label_sub}", font=f_rsub, fill=(186, 199, 219, 255))

        if kind == "strip":
            board.alpha_composite(im, (margin_x, cur_y + header_band_h))
        else:
            note = "New 5-option generation hit image-generator 429 quota (~5h reset). Showing existing AAA painted realm variants:"
            draw.text((margin_x + 16, cur_y + header_band_h + 10), note, font=f_rsub, fill=(252, 165, 165, 240))
            realms = [
                ("EXISTING DYNAMO", "hazard-powered-dynamo-phase_stalker.png"),
                ("EXISTING HELIX",  "hazard-powered-helix-phase_stalker.png"),
                ("EXISTING METEOR", "hazard-powered-meteor-phase_stalker.png"),
            ]
            slot_w = strip_w // 3
            for r_idx, (r_lbl, r_file) in enumerate(realms):
                rp = ASSETS / r_file
                if rp.exists():
                    tile = Image.open(rp).convert("RGBA")
                    tile.thumbnail((168, 168), Image.Resampling.LANCZOS)
                    tx = margin_x + r_idx * slot_w + (slot_w - tile.width) // 2
                    ty = cur_y + header_band_h + 40
                    board.alpha_composite(tile, (tx, ty))
                    draw.text((margin_x + r_idx * slot_w + slot_w // 2 - 72, cur_y + header_band_h + 220), r_lbl, font=f_cap, fill=(226, 232, 240, 245))

        cur_y += box_h + row_pad_y

    out_path = ARTIFACTS / out_name
    board.save(out_path, optimize=True)
    print(f"SAVED_AAA_BOARD -> {out_path} ({board.width}x{board.height})")


def main():
    SCRATCH_CAT.mkdir(parents=True, exist_ok=True)
    build_board(
        "POWERED-UP GOOD NODES — AAA BAROQUE FINE-JEWELRY CATALOG (OPTIONS A–E)",
        "Hand-engraved gold, platinum & faceted royal gemstones matching Dynamo, Helix & Meteor (Shield & +1 Life already approved!)",
        GOOD_SOURCES,
        "v423_good_nodes_aaa_catalog.png",
        (125, 211, 252),
        include_blink_fallback=False,
    )
    build_board(
        "POWERED-UP BAD NODES — AAA DARK-FANTASY HAZARD CATALOG (OPTIONS A–E)",
        "Forged obsidian, volcanic basalt & crimson/void cores (BLINK A–E paused at image-generator 429 quota reset ~5h)",
        BAD_SOURCES,
        "v423_bad_nodes_aaa_catalog.png",
        (248, 113, 113),
        include_blink_fallback=True,
    )


if __name__ == "__main__":
    main()
