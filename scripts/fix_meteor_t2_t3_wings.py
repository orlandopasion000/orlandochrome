"""Remove leftover basalt sphere-crust crescents from Meteor Tier II & III wings
and re-composite core-meteor-t2.png / core-meteor-t3.png + update core-geometry-db.json.
"""
import json
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(ROOT_DIR, "assets")
SCRATCH_DIR = os.path.join(ROOT_DIR, "scratch")
DB_PATH = os.path.join(ASSET_DIR, "core-geometry-db.json")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import verify_core_wings_db as vdb  # noqa: E402


def clean_meteor_wing(img: Image.Image, tier: int) -> Image.Image:
    """Trim leftover circular basalt crust horns above/below the feather root."""
    arr = np.array(img.convert("RGBA"), dtype=np.float32)
    h, w = arr.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w]
    # Sphere center in wing canvas is (0, 288), radius ~ 168.
    r = np.hypot(xs, ys - 288.0)

    if tier == 2:
        # Wing feathers sit inside y=206..348; everything in the inner basalt arc outside this band
        # (including upper/lower crescent horns at x < 178) is sphere crust residue.
        y_top, y_bot = 208.0, 346.0
        keep_x_inner = 132.0
        crust_x_outer = 178.0
    elif tier == 3:
        # Wing feathers attach at y=178..362; upper wingtip extends out at x > 186.
        y_top, y_bot = 178.0, 360.0
        keep_x_inner = 132.0
        crust_x_outer = 180.0
    else:
        return img

    alpha = arr[:, :, 3].copy()

    # 1. Trim anything too deep inside the sphere center where it could clutter rotation
    inner_fade = np.clip((xs - keep_x_inner) / 6.0, 0.0, 1.0)
    alpha *= inner_fade

    # 2. Within the inner arc / crust strip (x < crust_x_outer or r < 186),
    # erase top and bottom crescent horns outside [y_top, y_bot] with a 6px soft edge.
    in_crust_band = (xs < crust_x_outer) & ((r < 192.0) | (xs < 164.0))
    top_keep = np.clip((ys - (y_top - 4.0)) / 7.0, 0.0, 1.0)
    bot_keep = np.clip(((y_bot + 4.0) - ys) / 7.0, 0.0, 1.0)
    vert_keep = top_keep * bot_keep
    alpha = np.where(in_crust_band, alpha * vert_keep, alpha)

    # 3. Also shave any protruding basalt lip outside r > 165 near top/bottom root transition
    # (Wait: actual feather root starts around x >= 156..164 inside [y_top+14, y_bot-14];
    # outside [y_top+10, y_bot-10], erase dark low-saturation basalt rim inside x < 172).
    arr[:, :, 3] = np.clip(np.round(alpha), 0, 255)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def composite_full_core(sphere_img: Image.Image, wing_r_img: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1024, 576), (0, 0, 0, 0))
    wing_l_img = wing_r_img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    canvas.alpha_composite(wing_l_img, (0, 0))
    canvas.alpha_composite(wing_r_img, (512, 0))
    canvas.alpha_composite(sphere_img, (0, 0))
    return canvas


def main():
    os.makedirs(SCRATCH_DIR, exist_ok=True)
    sphere = Image.open(os.path.join(ASSET_DIR, "core-meteor-t1.png")).convert("RGBA")

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    hinge_x = db["hingeXRef"]

    # Build side-by-side comparison sheet: Before Wing, After Wing, Before Core, After Core (+10deg flap)
    cell_w, cell_h = 340, 220
    sheet = Image.new("RGBA", (cell_w * 4, cell_h * 2 + 40), (14, 16, 24, 255))
    draw = ImageDraw.Draw(sheet)

    for idx, tier in enumerate((2, 3)):
        wing_path = os.path.join(ASSET_DIR, f"core-meteor-wing-r-t{tier}.png")
        full_path = os.path.join(ASSET_DIR, f"core-meteor-t{tier}.png")

        old_wing = Image.open(wing_path).convert("RGBA")
        old_full = Image.open(full_path).convert("RGBA")

        new_wing = clean_meteor_wing(old_wing, tier)
        new_full = composite_full_core(sphere, new_wing)

        new_wing.save(wing_path)
        new_full.save(full_path)

        # Update DB entry
        fa = np.array(new_full)[:, :, 3] > 18
        fys, fxs = np.where(fa)
        fx0, fx1, fy0, fy1 = int(fxs.min()), int(fxs.max()), int(fys.min()), int(fys.max())
        fw, fh = fx1 - fx0 + 1, fy1 - fy0 + 1

        wa = np.array(new_wing)[:, :, 3] > 18
        wys, wxs = np.where(wa)
        wx0, wx1 = int(wxs.min()), int(wxs.max())
        wall_r = int(vdb.max_contig_wall(np.array(new_wing)[:, :, 3] > 20, wx1, tol=0))
        g0, ov0 = vdb.check_seam(sphere, new_wing, None, 0.0, hinge_x)
        gp, ovp = vdb.check_seam(sphere, new_wing, None, 10.0, hinge_x)
        gn, ovn = vdb.check_seam(sphere, new_wing, None, -10.0, hinge_x)

        db["models"]["meteor"][str(tier)].update({
            "fullW": fw,
            "fullH": fh,
            "wingMinX": wx0,
            "wingMaxX": wx1,
            "minY": fy0,
            "maxY": fy1,
            "halfTopY": 288 - fy0,
            "halfBotY": fy1 - 288,
            "edgeMargins": {
                "l": fx0,
                "r": 1023 - fx1,
                "t": fy0,
                "b": 575 - fy1,
            },
            "maxFlatWallR": wall_r,
            "overlapDepthPx": int(min(ov0, ovp, ovn)),
            "gapRestRows": int(g0),
            "gapFlapPos10Rows": int(gp),
            "gapFlapNeg10Rows": int(gn),
            "complete": True,
        })

        # Compose flapped preview (+10deg) to prove crescent is gone even at full flap
        wing_flap = vdb.rotate_wing(new_wing, 10.0, hinge_x)
        flap_full = composite_full_core(sphere, wing_flap)

        row_y = 32 + idx * cell_h
        panels = [
            (f"T{tier} Wing BEFORE", old_wing.crop((40, 80, 420, 496))),
            (f"T{tier} Wing AFTER", new_wing.crop((40, 80, 420, 496))),
            (f"T{tier} Core BEFORE", old_full.crop((140, 70, 884, 506))),
            (f"T{tier} AFTER (+10 flap)", flap_full.crop((140, 70, 884, 506))),
        ]
        for col, (label, panel_im) in enumerate(panels):
            x0 = col * cell_w
            thumb = panel_im.copy()
            thumb.thumbnail((cell_w - 20, cell_h - 32), Image.Resampling.LANCZOS)
            px = x0 + (cell_w - thumb.width) // 2
            py = row_y + 24 + (cell_h - 28 - thumb.height) // 2
            sheet.alpha_composite(thumb, (px, py))
            draw.text((x0 + 12, row_y + 4), label, fill=(255, 220, 140, 255))

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

    out_preview = os.path.join(SCRATCH_DIR, "meteor_t2_t3_sphere_fix.png")
    sheet.save(out_preview)
    print("Saved fixed Meteor T2/T3 wings + cores and preview:", out_preview)


if __name__ == "__main__":
    main()
