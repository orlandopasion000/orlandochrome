import math
import os
from collections import deque
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter, label

ROOT = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
ASSETS = os.path.join(ROOT, "assets")
SCRATCH = os.path.join(ROOT, "scratch")
UPLOADS = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039\.user_uploaded"
os.makedirs(SCRATCH, exist_ok=True)

SRCS = {
    "helix_top": os.path.join(UPLOADS, "media_1795844070850_353b7d35.png"),
    "helix_show": os.path.join(UPLOADS, "media_1795844070857_3ec7897e.png"),
    "dynamo_top": os.path.join(UPLOADS, "media_1795844070861_383c32bd.jpg"),
    "dynamo_show": os.path.join(UPLOADS, "media_1795844070838_ca357589.jpg"),
    "meteor_top": os.path.join(UPLOADS, "media_1795844070891_342a931d.png"),
    "meteor_show": os.path.join(UPLOADS, "media_1795844070865_41b881ad.jpg"),
}


def defringe_and_clean_alpha(img: Image.Image, from_black_bg: bool = False) -> Image.Image:
    """Clean alpha transparency, strip exterior black JPG backdrop, and decontaminate edge RGB fringe."""
    rgba = img.convert("RGBA")
    arr = np.array(rgba).astype(np.float32)
    h, w, _ = arr.shape
    rgb = arr[..., :3]
    alpha = arr[..., 3]

    if from_black_bg:
        # Flood-fill from border on near-black pixels so interior dark shadows/armor stay 100% opaque
        max_c = rgb.max(axis=2)
        cand = max_c <= 24.0
        labeled, ncomp = label(cand)
        border_labels = set()
        border_labels.update(np.unique(labeled[0, :]).tolist())
        border_labels.update(np.unique(labeled[-1, :]).tolist())
        border_labels.update(np.unique(labeled[:, 0]).tolist())
        border_labels.update(np.unique(labeled[:, -1]).tolist())
        border_labels.discard(0)
        ext_bg = np.isin(labeled, list(border_labels))

        # Smooth anti-aliased alpha along foreground boundary (soft ramp between lum 10..42 on border pixels)
        dist_from_bg = distance_transform_edt(~ext_bg)
        # Keep strictly 0 outside ext_bg; feather narrow 1.8px boundary band modulated by brightness
        edge_band = (~ext_bg) & (dist_from_bg <= 2.2) & (max_c < 52.0)
        a_out = np.where(ext_bg, 0.0, 255.0)
        ramp = np.clip((max_c - 10.0) / 36.0, 0.0, 1.0)
        a_out = np.where(edge_band, ramp * 255.0, a_out)
        alpha = a_out

    # Remove fine ultra-low alpha haze & dark/colored boundary fringes on ALL images (including PNGs)
    alpha = np.where(alpha < 24.0, 0.0, alpha)
    # Remove tiny isolated orphan dust specs (< 18 px)
    labeled_fg, n_fg = label(alpha > 20.0)
    if n_fg > 1:
        counts = np.bincount(labeled_fg.ravel())
        counts[0] = 0
        keep = counts >= 22
        alpha = np.where(keep[labeled_fg], alpha, 0.0)

    # Decontaminate edge RGB pixels (0 < alpha < 225) by pulling clean interior color from nearest solid pixel (alpha >= 225)
    solid_mask = alpha >= 225.0
    if np.any(solid_mask):
        dist_to_solid, indices = distance_transform_edt(~solid_mask, return_indices=True)
        iy, ix = indices
        edge_fix = (alpha > 0.0) & (~solid_mask) & (dist_to_solid <= 4.5)
        for ch in range(3):
            clean_ch = rgb[..., ch][iy, ix]
            # Blend 75% interior color -> eliminates purple/black/cyan halo fringe along wing feather tips!
            blend = np.clip((225.0 - alpha) / 180.0, 0.25, 0.85)
            rgb[..., ch] = np.where(edge_fix, rgb[..., ch] * (1.0 - blend) + clean_ch * blend, rgb[..., ch])

    # Clear RGB cleanly where alpha == 0
    rgb = np.where((alpha > 0)[..., None], rgb, 0.0)
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out[..., 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(out, mode="RGBA")


def split_smooth(arr_full, gun_mask_bool, cx=512.0, blur_sigma=1.1):
    """Split RGBA array cleanly with feathered junction so idle body + deployed guns composite seamlessly."""
    m_f = gaussian_filter(gun_mask_bool.astype(np.float32), sigma=blur_sigma)
    m_f = np.clip(m_f, 0.0, 1.0)
    guns = arr_full.astype(np.float32).copy()
    body = arr_full.astype(np.float32).copy()
    guns[..., 3] *= m_f
    body[..., 3] *= (1.0 - m_f)
    guns[guns[..., 3] < 2.0] = 0.0
    body[body[..., 3] < 2.0] = 0.0
    return guns.astype(np.uint8), body.astype(np.uint8)


def find_centroid_and_muzzles(guns_arr, full_arr):
    alpha_full = full_arr[..., 3] > 30
    alpha_guns = guns_arr[..., 3] > 30
    ys, xs = np.where(alpha_full)
    gy, gx = np.where(alpha_guns)
    print(f"  Full alpha bbox: x=[{xs.min()}..{xs.max()}], y=[{ys.min()}..{ys.max()}]")
    print(f"  Guns alpha bbox: x=[{gx.min()}..{gx.max()}], y=[{gy.min()}..{gy.max()}]")


def process_helix():
    print("[HELIX T8]")
    raw_top = defringe_and_clean_alpha(Image.open(SRCS["helix_top"]), from_black_bg=False)
    # Pad 1024x576 -> 1024x682 shifting down +18px so central prism spearhead sits cleanly at y~20
    pad_top = Image.new("RGBA", (1024, 682), (0, 0, 0, 0))
    pad_top.paste(raw_top, (0, 18), raw_top)
    pad_top.save(os.path.join(ASSETS, "core-helix-t8.png"))

    show = defringe_and_clean_alpha(Image.open(SRCS["helix_show"]), from_black_bg=False)
    show.save(os.path.join(ASSETS, "core-helix-t8-showcase.png"))

    arr = np.array(pad_top)
    yy, xx = np.mgrid[0:682, 0:1024].astype(np.float32)
    dx = np.abs(xx - 512.0)

    # Prism Rail Cannon geometry in shifted 1024x682 (was 0..576 shifted +18):
    # - Keep twin cute unicorn ears (dx=18..42, y=184..210) cleanly intact in BODY,
    # - Carve mechanical cyan cylinder shaft strictly between ears (dx <= 16 down to y=200) into GUNS,
    # - Separate twin silver squared cannons & diagonal struts above wing edge.
    y_cut = np.where(
        dx <= 17.0,
        200.0,
        np.where(
            dx <= 52.0,
            182.0 + ((dx - 17.0) / 35.0) * 14.0,
            np.where(
                dx <= 168.0,
                262.0 + ((dx - 52.0) / 116.0) * 26.0,
                0.0,
            ),
        ),
    )
    gun_mask = (dx <= 174.0) & (yy < np.where(dx <= 168.0, y_cut, 260.0))
    guns_arr, body_arr = split_smooth(arr, gun_mask, blur_sigma=1.0)

    # Sculpt a crisp tapered glowing crystalline unicorn horn between her ears (x=512, y=132..202) in idle core-helix-t8-body.png!
    horn_layer = np.zeros((682, 1024, 4), dtype=np.float32)
    hyy, hxx = np.mgrid[130:206, 492:532].astype(np.float32)
    t_h = np.clip((204.0 - hyy) / 70.0, 0.0, 1.0)  # 0 at brow base -> 1 at tip
    hw_h = np.where((hyy >= 134.0) & (hyy <= 204.0), 8.5 * (1.0 - t_h * 0.92), 0.0)
    dhx = np.abs(hxx - 512.0)
    horn_alpha = np.where(hw_h > 0.2, np.clip((hw_h - dhx) / 1.4, 0.0, 1.0), 0.0)
    # Pearlescent spiral horn ribbing
    spiral = 0.5 + 0.5 * np.sin((hyy * 0.48) + (hxx - 512.0) * 0.22)
    edge_hi = np.clip(1.0 - dhx / np.maximum(hw_h, 1.0), 0.0, 1.0)
    horn_layer[130:206, 492:532, 0] = np.clip(165.0 + 90.0 * edge_hi + 28.0 * spiral, 0, 255)
    horn_layer[130:206, 492:532, 1] = np.clip(225.0 + 30.0 * edge_hi, 0, 255)
    horn_layer[130:206, 492:532, 2] = 255.0
    horn_layer[130:206, 492:532, 3] = np.clip(horn_alpha * 255.0, 0, 255)
    horn_img = Image.fromarray(horn_layer.astype(np.uint8), mode="RGBA")
    body_img = Image.fromarray(body_arr, mode="RGBA")
    body_img.paste(horn_img, (0, 0), horn_img)
    body_arr = np.array(body_img)

    Image.fromarray(guns_arr, mode="RGBA").save(os.path.join(ASSETS, "core-helix-t8-guns.png"))
    Image.fromarray(body_arr, mode="RGBA").save(os.path.join(ASSETS, "core-helix-t8-body.png"))
    find_centroid_and_muzzles(guns_arr, arr)
    return np.array(pad_top), body_arr, guns_arr, np.array(show)


def process_dynamo():
    print("[DYNAMO T8]")
    top = defringe_and_clean_alpha(Image.open(SRCS["dynamo_top"]), from_black_bg=True)
    top.save(os.path.join(ASSETS, "core-dynamo-t8.png"))

    show = defringe_and_clean_alpha(Image.open(SRCS["dynamo_show"]), from_black_bg=True)
    show.save(os.path.join(ASSETS, "core-dynamo-t8-showcase.png"))

    arr = np.array(top)
    yy, xx = np.mgrid[0:682, 0:1024].astype(np.float32)
    dx = np.abs(xx - 512.0)

    # Measure Royal Sapphire Cannon vs Crown/Hands/Wingtips across x in 1024x682!
    # Look at uploaded top-down Dynamo T8 (383c32bd.jpg):
    # - Central royal crown pinnacle reaches y~188 (dx <= 45); her raised open hands reach y~198 at dx~78..105.
    # - Wing upper feathered blue crystals sweep downward/inward from tip (x=18, y=135) -> shoulder hinge (x=370, y=262).
    # - Royal Sapphire Cannon (6 sapphire pods + central diamond emitter + twin cannons) fills dx <= 355 above the wing/crown curve!
    # Print row profile at dx slices inside script to verify curve tightly:
    for test_x in [512, 430, 350, 260, 180]:
        col_y = np.where(arr[:320, test_x, 3] > 40)[0]
        print(f"  x={test_x}: first_y={col_y[0] if len(col_y) else None}")

    # Piecewise smooth boundary y_cut(dx) sitting cleanly BETWEEN the Royal Sapphire Cannon (above) and her crown/hands/wings (below):
    # - dx <= 52: y_cut = 188 (strictly above her winged crown center!)
    # - 52 < dx <= 115: ramps linearly 188 -> 212 (clears raised forearms/wrists while cutting twin sapphire cannon barrels above hands)
    # - 115 < dx <= 165: y_cut = 212 -> 252 (down behind rear shoulder mounts between arm and wing)
    # - 165 < dx <= 285: y_cut = 252 -> 208 (cleanly separates middle/lower sapphire accelerator pods above blue upper wings!)
    # - 285 < dx <= 368: y_cut = 208 -> 172 (separates outermost wing-side sapphire pods cleanly above the upturned wingtips!)
    y_cut = np.where(
        dx <= 52.0,
        186.0 + (dx / 52.0) * 6.0,
        np.where(
            dx <= 115.0,
            192.0 + ((dx - 52.0) / 63.0) * 18.0,
            np.where(
                dx <= 165.0,
                210.0 + ((dx - 115.0) / 50.0) * 42.0,
                np.where(
                    dx <= 285.0,
                    252.0 - ((dx - 165.0) / 120.0) * 44.0,
                    208.0 - ((dx - 285.0) / 83.0) * 42.0,
                ),
            ),
        ),
    )
    gun_mask = (dx <= 368.0) & (yy < y_cut)
    guns_arr, body_arr = split_smooth(arr, gun_mask, blur_sigma=1.0)

    Image.fromarray(guns_arr, mode="RGBA").save(os.path.join(ASSETS, "core-dynamo-t8-guns.png"))
    Image.fromarray(body_arr, mode="RGBA").save(os.path.join(ASSETS, "core-dynamo-t8-body.png"))
    find_centroid_and_muzzles(guns_arr, arr)
    return arr, body_arr, guns_arr, np.array(show)


def process_meteor():
    print("[METEOR T8]")
    top = defringe_and_clean_alpha(Image.open(SRCS["meteor_top"]), from_black_bg=False)
    top.save(os.path.join(ASSETS, "core-meteor-t8.png"))

    show = defringe_and_clean_alpha(Image.open(SRCS["meteor_show"]), from_black_bg=True)
    show.save(os.path.join(ASSETS, "core-meteor-t8-showcase.png"))

    arr = np.array(top)
    yy, xx = np.mgrid[0:682, 0:1024].astype(np.float32)
    dx = np.abs(xx - 512.0)

    # Solar Forge Cannon sits centered at dx <= 168 (x=344..680), y < 192..215,
    # above his diagonal shoulder truss attachment (around dx=85..155, y=185..215) & wing shoulders (y >= 175 outer)!
    y_cut = np.where(
        dx <= 72.0,
        186.0,
        np.where(
            dx <= 168.0,
            186.0 - ((dx - 72.0) / 96.0) * 18.0,
            0.0,
        ),
    )
    gun_mask = (dx <= 168.0) & (yy < np.where(dx <= 168.0, y_cut, 0.0))
    guns_arr, body_arr = split_smooth(arr, gun_mask, blur_sigma=1.0)

    # Graft sleek hornless Tier VII Meteor Dragon head & upper neck seamlessly onto Tier VIII idle body!
    t7_m = Image.open(os.path.join(ASSETS, "core-meteor-t7-body.png")).convert("RGBA")
    t7_arr = np.array(t7_m).astype(np.float32)
    # Inspect neck width & alignment: head & neck sit at x=[466..558], y=[30..205]
    head_patch = t7_arr[28:205, 466:558].copy()  # 177 x 92
    # Slightly enrich saturation/contrast of grafted head so it blends seamlessly with T8 deep obsidian/sapphire/gold spine
    ph, pw, _ = head_patch.shape
    pyy, pxx = np.mgrid[0:ph, 0:pw].astype(np.float32)
    # Feather bottom junction (y_local 140..177 -> y_world 168..205) smoothly onto Tier VIII sapphire spine
    bot_fade = np.clip((175.0 - pyy) / 30.0, 0.0, 1.0)
    head_patch[..., 3] *= bot_fade
    head_img = Image.fromarray(np.clip(head_patch, 0, 255).astype(np.uint8), mode="RGBA")

    body_img = Image.fromarray(body_arr, mode="RGBA")
    # Paste centered at x=466, y=38 so hornless snout rests right above shoulder collar (y~186)
    body_img.paste(head_img, (466, 38), head_img)
    body_arr = np.array(body_img)

    Image.fromarray(guns_arr, mode="RGBA").save(os.path.join(ASSETS, "core-meteor-t8-guns.png"))
    Image.fromarray(body_arr, mode="RGBA").save(os.path.join(ASSETS, "core-meteor-t8-body.png"))
    find_centroid_and_muzzles(guns_arr, arr)
    return arr, body_arr, guns_arr, np.array(show)


def build_contact_sheet(rows_data):
    # 3 rows (Dynamo, Helix, Meteor) x 3 columns (Idle Body | Full Deployed | Showcase) on dark space bg
    cw, ch = 512, 341
    pad = 14
    sheet = Image.new("RGB", (pad + 3 * (cw + pad), pad + 3 * (ch + pad)), (10, 12, 20))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(sheet)

    for r_idx, (name, body_a, full_a, show_a) in enumerate(rows_data):
        y0 = pad + r_idx * (ch + pad)
        for c_idx, (lbl, src_a) in enumerate([("IDLE BODY", body_a), ("DEPLOYED FULL", full_a), ("SHOWCASE", show_a)]):
            x0 = pad + c_idx * (cw + pad)
            draw.rectangle([x0, y0, x0 + cw, y0 + ch], fill=(14, 17, 28), outline=(56, 70, 98))
            im = Image.fromarray(src_a, mode="RGBA")
            im.thumbnail((cw - 12, ch - 24), Image.Resampling.LANCZOS)
            px = x0 + (cw - im.width) // 2
            py = y0 + 18 + (ch - 22 - im.height) // 2
            sheet.paste(im, (px, py), im)
            draw.text((x0 + 8, y0 + 4), f"{name} T8 — {lbl}", fill=(248, 225, 135))

    out_p = os.path.join(SCRATCH, "v428_tier8_split_verify.png")
    sheet.save(out_p, quality=92)
    print("Saved verification sheet:", out_p)


if __name__ == "__main__":
    d_full, d_body, d_guns, d_show = process_dynamo()
    h_full, h_body, h_guns, h_show = process_helix()
    m_full, m_body, m_guns, m_show = process_meteor()
    build_contact_sheet([
        ("DYNAMO", d_body, d_full, d_show),
        ("HELIX", h_body, h_full, h_show),
        ("METEOR", m_body, m_full, m_show),
    ])
