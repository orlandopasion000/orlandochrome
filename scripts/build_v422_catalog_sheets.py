"""Assemble high-resolution 5x5 labeled catalog sheets for Good & Bad powered-up node options A-E."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
CAT_DIR = ROOT / "scratch" / "v422_catalog_512"
ARTIFACTS = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039")


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


def build_sheet(title: str, subtitle: str, prefix: str, rows, out_name: str, accent_rgb):
    col_w = 240
    row_h = 240
    left_w = 220
    header_h = 104
    width = left_w + col_w * 5 + 32
    height = header_h + row_h * len(rows) + 28

    sheet = Image.new("RGBA", (width, height), (8, 13, 26, 255))
    draw = ImageDraw.Draw(sheet)
    f_title = load_font(30, True)
    f_sub = load_font(17, False)
    f_col = load_font(20, True)
    f_row = load_font(22, True)
    f_tag = load_font(15, True)

    draw.text((28, 18), title, font=f_title, fill=(248, 250, 252, 255))
    draw.text((28, 56), subtitle, font=f_sub, fill=accent_rgb + (235,))

    for c_idx, opt in enumerate(("A", "B", "C", "D", "E")):
        cx = left_w + c_idx * col_w + col_w // 2
        draw.text((cx - 46, header_h - 30), f"OPTION {opt}", font=f_col, fill=(226, 232, 240, 255))

    for r_idx, (key, label_top, label_bot) in enumerate(rows):
        y0 = header_h + r_idx * row_h
        # Row divider band
        draw.rounded_rectangle(
            [18, y0 + 8, width - 18, y0 + row_h - 8],
            radius=16,
            fill=(14, 21, 39, 220),
            outline=accent_rgb + (75,),
            width=2,
        )
        draw.text((34, y0 + 84), label_top, font=f_row, fill=accent_rgb + (255,))
        draw.text((34, y0 + 116), label_bot, font=f_sub, fill=(148, 163, 184, 255))

        for c_idx, opt in enumerate(("A", "B", "C", "D", "E")):
            x0 = left_w + c_idx * col_w
            fp = CAT_DIR / f"{prefix}_{key}_{opt}.png"
            if not fp.exists():
                raise FileNotFoundError(f"Missing catalog render: {fp}")
            tile = Image.open(fp).convert("RGBA").resize((192, 192), Image.Resampling.LANCZOS)
            sheet.alpha_composite(tile, (x0 + (col_w - 192) // 2, y0 + 16))
            draw.rounded_rectangle(
                [x0 + col_w // 2 - 42, y0 + row_h - 36, x0 + col_w // 2 + 42, y0 + row_h - 14],
                radius=9,
                fill=(9, 14, 28, 230),
                outline=accent_rgb + (135,),
                width=1,
            )
            draw.text((x0 + col_w // 2 - 22, y0 + row_h - 34), f"{label_top.split()[0][:4]} {opt}", font=f_tag, fill=(241, 245, 249, 255))

    out_path = ARTIFACTS / out_name
    sheet.save(out_path, optimize=True)
    print(f"SAVED_CATALOG -> {out_path}")


def main():
    good_rows = [
        ("missiles", "MISSILES", "Homing Volley"),
        ("hyper",    "HYPER",    "Supercharge"),
        ("dup",      "2X DUP",   "Cluster / Split"),
        ("stasis",   "STASIS",   "Chronos Slow"),
        ("vacuum",   "VACUUM",   "Magnet Pull"),
    ]
    bad_rows = [
        ("comet",  "COMET",  "Hyper Comet"),
        ("laser",  "LASER",  "Corruptor Beam"),
        ("vortex", "VORTEX", "Gravity Well"),
        ("emp",    "EMP",    "Shock Detonator"),
        ("blink",  "BLINK",  "Phase Stalker"),
    ]
    build_sheet(
        "POWERED-UP GOOD NODES — 5 LUXURY DESIGNS EACH (OPTIONS A–E)",
        "Rich royal jewel tones with balanced glow (Zero spikes · Zero white glare · Shield & +1 Life already approved!)",
        "good",
        good_rows,
        "v422_good_nodes_5_designs_catalog.png",
        (125, 211, 252),
    )
    build_sheet(
        "POWERED-UP BAD NODES — 5 HAZARD DESIGNS EACH (OPTIONS A–E)",
        "Unmistakably hazardous obsidian, dark iron, magma, crimson & void-violet aesthetics",
        "bad",
        bad_rows,
        "v422_bad_nodes_5_designs_catalog.png",
        (248, 113, 113),
    )


if __name__ == "__main__":
    main()
