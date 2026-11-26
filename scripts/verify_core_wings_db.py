"""Automated Core Geometry Database & Complete-Wings Validator for OrlandoChrome."""
import json
import os
import sys
import numpy as np
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(ROOT_DIR, "assets")
DB_PATH = os.path.join(ASSET_DIR, "core-geometry-db.json")

MIN_EDGE_MARGIN = 12
MIN_OVERLAP_PX = 12
SPHERE_PARITY_TOL = 2
SPAN_PARITY_TOL = 2
MAX_FLAT_WALL_R = 31


def max_contig_wall(mask, x_col, tol=0):
    col = mask[:, max(0, x_col - tol):x_col + 1].any(axis=1)
    best = cur = 0
    for v in col:
        if v:
            cur += 1
            best = max(best, cur)
        else:
            cur = 0
    return best


def rotate_wing(wing_img, angle_deg, hinge_x):
    return wing_img.rotate(angle_deg, resample=Image.Resampling.BICUBIC, center=(hinge_x, 288))


def check_seam(sphere_img, right_wing_img, bezel_img, angle_deg, hinge_x):
    comp_sphere = sphere_img.copy()
    if bezel_img is not None:
        comp_sphere.alpha_composite(bezel_img, (0, 0))
    s_alpha = np.array(comp_sphere)[:, :, 3] > 80
    w_rot = rotate_wing(right_wing_img, angle_deg, hinge_x)
    w_alpha = np.array(w_rot)[:, :, 3] > 60
    wys, _ = np.where(w_alpha)
    w_top = int(wys.min()) if len(wys) else 288
    w_bot = int(wys.max()) if len(wys) else 288

    y0 = max(w_top + 12, 288 - 46)
    y1 = min(w_bot - 12, 288 + 46)
    overlaps = []
    gap_rows = 0
    for y in range(y0, y1 + 1):
        s_xs = np.where(s_alpha[y, 512:])[0]
        w_xs = np.where(w_alpha[y, :])[0]
        if len(s_xs) == 0 or len(w_xs) == 0:
            continue
        ov = int(s_xs.max()) - int(w_xs.min())
        overlaps.append(ov)
        if ov < 0:
            gap_rows += 1
    if len(overlaps) < 35:
        return len(overlaps) or 1, -999
    return gap_rows, (int(min(overlaps)) if overlaps else -999)


def main():
    if not os.path.exists(DB_PATH):
        print("FAIL: Missing geometry database:", DB_PATH)
        return 1

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    hinge_x = db["hingeXRef"]
    realms = ("dynamo", "helix", "meteor")
    tiers = (1, 2, 3, 4, 5)
    failures = []

    spheres = {m: Image.open(os.path.join(ASSET_DIR, f"core-{m}-t1.png")).convert("RGBA") for m in realms}
    bezels_t5 = {
        "dynamo": Image.open(os.path.join(ASSET_DIR, "core-dynamo-bezel-t5.png")).convert("RGBA"),
        "helix": Image.open(os.path.join(ASSET_DIR, "core-helix-bezel-t5.png")).convert("RGBA"),
        "meteor": None,
    }

    print(f"{'MODEL':14s} {'FULL WxH':11s} {'MARGINS (L/R/T/B)':19s} {'TIP_X':6s} {'WALL_R':7s} {'OVLP':5s} {'GAP(0/+10/-10)':15s} {'STATUS'}")
    print("-" * 90)

    sphere_widths = []
    for t in tiers:
        tier_full_widths = []
        for m in realms:
            full_path = os.path.join(ASSET_DIR, f"core-{m}-t{t}.png")
            im = Image.open(full_path).convert("RGBA")
            a = np.array(im)[:, :, 3] > 18
            ys, xs = np.where(a)
            fx0, fx1, fy0, fy1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
            fw, fh = fx1 - fx0 + 1, fy1 - fy0 + 1
            ml, mr, mt, mb = fx0, 1023 - fx1, fy0, 575 - fy1
            tier_full_widths.append((m, fw))

            entry = db["models"][m][str(t)]
            ok = True
            notes = []

            if min(ml, mr, mt, mb) < MIN_EDGE_MARGIN:
                ok = False
                notes.append(f"edge_clip({ml},{mr},{mt},{mb})")
            if entry["fullW"] != fw or entry["fullH"] != fh:
                ok = False
                notes.append(f"db_mismatch({entry['fullW']}x{entry['fullH']} vs {fw}x{fh})")

            tip_str = "-"
            wall_str = "-"
            ov_str = "-"
            gap_str = "-"

            if t == 1:
                sp_cols = np.where(a[276:300, :].any(axis=0))[0]
                sphere_widths.append((m, int(sp_cols.max() - sp_cols.min() + 1)))
            else:
                w_path = os.path.join(ASSET_DIR, f"core-{m}-wing-r-t{t}.png")
                wim = Image.open(w_path).convert("RGBA")
                wa = np.array(wim)[:, :, 3] > 18
                wys, wxs = np.where(wa)
                wtip = int(wxs.max())
                wtop, wbot = int(wys.min()), int(wys.max())
                tip_str = str(wtip)

                wall_r = max_contig_wall(np.array(wim)[:, :, 3] > 20, wtip, tol=0)
                wall_str = str(wall_r)
                if wall_r > MAX_FLAT_WALL_R:
                    ok = False
                    notes.append(f"flat_cut_wall_r={wall_r}>{MAX_FLAT_WALL_R}")

                if abs(wtip - db["tierMaxTipXRef"][str(t)]) > SPAN_PARITY_TOL:
                    ok = False
                    notes.append(f"tipX={wtip}!=target({db['tierMaxTipXRef'][str(t)]})")
                if wtop < MIN_EDGE_MARGIN or (575 - wbot) < MIN_EDGE_MARGIN or (511 - wtip) < MIN_EDGE_MARGIN:
                    ok = False
                    notes.append(f"wing_margin_clip")

                bez = bezels_t5[m] if t == 5 else None
                g0, ov0 = check_seam(spheres[m], wim, bez, 0.0, hinge_x)
                gp, ovp = check_seam(spheres[m], wim, bez, 10.0, hinge_x)
                gn, ovn = check_seam(spheres[m], wim, bez, -10.0, hinge_x)
                min_ov = min(ov0, ovp, ovn)
                ov_str = str(min_ov)
                gap_str = f"{g0}/{gp}/{gn}"
                if g0 > 0 or gp > 0 or gn > 0 or min_ov < MIN_OVERLAP_PX:
                    ok = False
                    notes.append(f"seam_gap({gap_str},ov={min_ov})")

            status = "PASS" if ok else "FAIL: " + ",".join(notes)
            if not ok:
                failures.append(f"{m}-t{t}: {status}")
            print(f"{m:6s}-t{t:<6d} {fw:4d}x{fh:<4d}  {ml:3d}/{mr:3d}/{mt:3d}/{mb:3d}         {tip_str:6s} {wall_str:7s} {ov_str:5s} {gap_str:15s} {status}")

        w_vals = [w for _, w in tier_full_widths]
        if max(w_vals) - min(w_vals) > SPAN_PARITY_TOL * 2:
            failures.append(f"tier-{t} cross-realm width mismatch: {tier_full_widths}")

    sp_vals = [w for _, w in sphere_widths]
    if max(sp_vals) - min(sp_vals) > SPHERE_PARITY_TOL:
        failures.append(f"sphere diameter mismatch: {sphere_widths}")

    print("-" * 82)
    print(f"T1 Sphere Widths: {sphere_widths}")

    # Verify Tier VI Hatching Assets & Calibrated Specs
    t6_specs = db.get("tier6Specs", {})
    for m in realms:
        t6_path = os.path.join(ASSET_DIR, f"core-{m}-t6.png")
        if not os.path.exists(t6_path):
            failures.append(f"Missing Tier VI sprite: {t6_path}")
            continue
        t6_im = Image.open(t6_path).convert("RGBA")
        t6_arr = np.array(t6_im)
        corners_ok = (t6_arr[0, 0, 3] == 0 and t6_arr[0, -1, 3] == 0 and t6_arr[-1, 0, 3] == 0 and t6_arr[-1, -1, 3] == 0)
        if not corners_ok:
            failures.append(f"core-{m}-t6.png corners not transparent")
        sp = t6_specs.get(m)
        if not sp or sp.get("width") != t6_im.width or sp.get("height") != t6_im.height:
            failures.append(f"tier6Specs mismatch for {m}")
        else:
            print(f"{m:6s}-t6      {t6_im.width:4d}x{t6_im.height:<4d} anchor=({sp['anchorX']},{sp['anchorY']}) muzzleL=({sp['muzzleL']['x']},{sp['muzzleL']['y']}) muzzleR=({sp['muzzleR']['x']},{sp['muzzleR']['y']}) PASS")

    if failures:
        print(f"RESULT: FAILED ({len(failures)} issues)")
        for fmsg in failures:
            print("  -", fmsg)
        return 1

    print("RESULT: ALL 15 TIER I-V MODELS + 3 TIER VI MODELS PASSED VALIDATION!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
