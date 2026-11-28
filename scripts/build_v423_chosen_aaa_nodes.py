"""Build 30 realm-specific AAA 512x512 transparent RGBA powered-up Good & Bad node sprites
(Dynamo, Helix, Meteor) from verified AAA painted catalog strips & reference art.
NO cartoonish primitives.
"""
import pathlib
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from scipy.ndimage import binary_dilation, label

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
ASSETS = ROOT / "assets"
CAT = ROOT / "scratch" / "v423_aaa_catalog"
SCRATCH = ROOT / "scratch"


def rgb_to_hsv_np(rgb: np.ndarray):
    """rgb float32 [0..1] -> h,s,v float32 [0..1]"""
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    v = maxc
    diff = maxc - minc
    s = np.where(maxc > 1e-6, diff / np.maximum(maxc, 1e-6), 0.0)
    h = np.zeros_like(maxc)
    mask = diff > 1e-6
    rc = np.where(mask, (maxc - r) / np.maximum(diff, 1e-6), 0.0)
    gc = np.where(mask, (maxc - g) / np.maximum(diff, 1e-6), 0.0)
    bc = np.where(mask, (maxc - b) / np.maximum(diff, 1e-6), 0.0)
    h = np.where(mask & (r == maxc), bc - gc, h)
    h = np.where(mask & (g == maxc), 2.0 + rc - bc, h)
    h = np.where(mask & (b == maxc), 4.0 + gc - rc, h)
    h = (h / 6.0) % 1.0
    return h, s, v


def hsv_to_rgb_np(h, s, v):
    i = np.floor(h * 6.0).astype(np.int32)
    f = (h * 6.0) - i
    p = v * (1.0 - s)
    q = v * (1.0 - s * f)
    t = v * (1.0 - s * (1.0 - f))
    i = i % 6
    r = np.choose(i, [v, q, p, p, t, v])
    g = np.choose(i, [t, v, v, q, p, p])
    b = np.choose(i, [p, p, t, v, v, q])
    return np.stack([r, g, b], axis=-1)


def find_icon_row_bounds(strip_rgb: np.ndarray):
    """Find top/bottom of the icon band, stopping right above the OPTION A-E text row."""
    h, w, _ = strip_rgb.shape
    row_active = (strip_rgb.max(axis=2) > 26).sum(axis=1) > max(8, w * 0.015)
    # Find contiguous vertical active runs
    runs = []
    in_run = False
    start = 0
    for y in range(h):
        if row_active[y] and not in_run:
            start = y
            in_run = True
        elif not row_active[y] and in_run:
            runs.append((start, y))
            in_run = False
    if in_run:
        runs.append((start, h))
    # Largest vertical height run is the relic row!
    best = max(runs, key=lambda r: r[1] - r[0])
    return max(0, best[0] - 8), min(h, best[1] + 6)


def split_five_slots(strip_path: pathlib.Path):
    """Split a 5-option horizontal black-background strip cleanly at vertical gaps."""
    im = Image.open(strip_path).convert("RGB")
    rgb = np.asarray(im)
    y0, y1 = find_icon_row_bounds(rgb)
    band = rgb[y0:y1, :, :]
    col_energy = (band.max(axis=2) > 22).sum(axis=0)
    w = im.width
    cuts = [0]
    for k in range(1, 5):
        nom = int(k * w / 5)
        win0 = max(0, nom - w // 18)
        win1 = min(w, nom + w // 18)
        valley = win0 + int(np.argmin(col_energy[win0:win1]))
        cuts.append(valley)
    cuts.append(w)
    return [im.crop((cuts[i], y0, cuts[i + 1], y1)) for i in range(5)]


def extract_rgba_clean(im_rgb: Image.Image, preserve_center_black: bool = False, interior_thresh: int = 8) -> Image.Image:
    """Flood-fill exterior black background + remove dark interior cutouts + 2px AA un-premultiply."""
    rgb = np.asarray(im_rgb.convert("RGB"), dtype=np.float32)
    h, w, _ = rgb.shape
    max_rgb = rgb.max(axis=2)

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

    if not preserve_center_black:
        dark_int = (~bg) & (max_rgb <= interior_thresh)
        lbl, num = label(dark_int)
        if num > 0:
            counts = np.bincount(lbl.ravel())
            big = np.where(counts >= 22)[0]
            big = big[big > 0]
            if big.size > 0:
                # Never punch out enclosed jewel/dial centers unless near exterior or crisp true-black hole
                bg |= np.isin(lbl, big)

    border = binary_dilation(bg, iterations=2) & (~bg)
    alpha = np.where(bg, 0.0, 1.0).astype(np.float32)
    feather = np.clip((max_rgb - 6.0) / 28.0, 0.0, 1.0)
    alpha[border] = np.minimum(alpha[border], feather[border])

    low_a = (alpha > 0.04) & (alpha < 0.99)
    for c in range(3):
        rgb[:, :, c][low_a] = np.clip(rgb[:, :, c][low_a] / np.maximum(alpha[low_a], 0.18), 0.0, 255.0)

    rgba = np.dstack([
        np.clip(rgb[:, :, 0], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 1], 0, 255).astype(np.uint8),
        np.clip(rgb[:, :, 2], 0, 255).astype(np.uint8),
        np.clip(alpha * 255.0, 0, 255).astype(np.uint8),
    ])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    return out


def fit_to_512(im: Image.Image, target_span: int = 448) -> Image.Image:
    sc = min(target_span / max(1, im.width), target_span / max(1, im.height))
    nw = max(1, round(im.width * sc))
    nh = max(1, round(im.height * sc))
    rs = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.alpha_composite(rs, ((512 - nw) // 2, (512 - nh) // 2))
    return canvas


def radial_alpha_mask(size: int, r_inner: float, r_outer: float, keep_inside: bool = True) -> np.ndarray:
    yy, xx = np.mgrid[0:size, 0:size]
    cx = (size - 1) * 0.5
    dist = np.hypot(xx - cx, yy - cx)
    t = np.clip((dist - r_inner) / max(1e-5, r_outer - r_inner), 0.0, 1.0)
    if keep_inside:
        return (1.0 - t).astype(np.float32)
    return t.astype(np.float32)


def make_perfect_sphere_overlay(size: int = 512, r: int = 212, rim_rgb=(212, 175, 95), inner_tint=(20, 26, 48)) -> tuple[Image.Image, Image.Image, np.ndarray]:
    """Return (underlay_sphere_body, specular_rim_overlay, circle_mask) for crystal-clean perfect spheres."""
    yy, xx = np.mgrid[0:size, 0:size]
    cx = (size - 1) * 0.5
    dx = (xx - cx) / r
    dy = (yy - cx) / r
    d2 = dx * dx + dy * dy
    dist = np.sqrt(d2)
    aa = np.clip((1.0 - dist) * r / 1.8 + 0.5, 0.0, 1.0)

    nz = np.sqrt(np.maximum(0.0, 1.0 - np.minimum(1.0, d2)))
    # Top-left studio key light
    lx, ly, lz = -0.45, -0.52, 0.72
    ndotl = np.clip(dx * lx + dy * ly + nz * lz, 0.0, 1.0)
    hx, hy, hz = -0.25, -0.30, 0.92
    spec = np.power(np.clip(dx * hx + dy * hy + nz * hz, 0.0, 1.0), 26.0)
    fresnel = np.power(np.clip(1.0 - nz, 0.0, 1.0), 2.8)

    under = np.zeros((size, size, 4), dtype=np.uint8)
    for c in range(3):
        val = inner_tint[c] * (0.28 + 0.85 * ndotl) + fresnel * rim_rgb[c] * 0.55
        under[:, :, c] = np.clip(val, 0, 255).astype(np.uint8)
    under[:, :, 3] = np.clip(aa * 255.0, 0, 255).astype(np.uint8)

    # Subtle dark forged metallic rim + glassy specular glaze (heavy 3D sphere, not bright neon hoop!)
    ring_band = np.exp(-np.square((dist - 0.96) / 0.026))
    dark_bevel = np.exp(-np.square((dist - 0.915) / 0.022))
    glass = np.zeros((size, size, 4), dtype=np.float32)
    for c in range(3):
        glass[:, :, c] = np.clip(
            spec * 235.0
            + fresnel * rim_rgb[c] * 0.48
            + ring_band * (rim_rgb[c] * 0.55 + 28.0) * (0.45 + 0.55 * ndotl),
            0, 255,
        )
    glass[:, :, 3] = np.clip((spec * 0.50 + fresnel * 0.34 + ring_band * 0.72 + dark_bevel * 0.25) * aa * 255.0, 0, 255)

    return Image.fromarray(under, "RGBA"), Image.fromarray(glass.astype(np.uint8), "RGBA"), aa


def apply_realm_grade(im: Image.Image, realm: str, is_bad: bool, node_key: str) -> Image.Image:
    """Distinct AAA realm metallic & gemstone grading while preserving hand-painted brushwork & contrasts."""
    arr = np.asarray(im.convert("RGBA"), dtype=np.float32)
    rgb = arr[:, :, :3] / 255.0
    a = arr[:, :, 3:4]
    h, s, v = rgb_to_hsv_np(rgb)

    if not is_bad:
        # Preserve gold filigree & cool crystals on Dynamo; shift Helix -> brushed platinum & prism cyan/magenta; Meteor -> royal forged gold & solar amber/ruby!
        if realm == "dynamo":
            pass
        elif realm == "helix":
            # Gold metals (hue ~0.04..0.17) -> brushed iridescent platinum-silver + cool ice tint
            warm_metal = (h >= 0.04) & (h <= 0.17)
            s = np.where(warm_metal, s * 0.14, np.clip(s * 1.12, 0, 1))
            v = np.where(warm_metal, np.clip(v * 1.04 + 0.02, 0, 0.96), v)
            h = np.where(warm_metal, 0.57, h)
            blue_gem = (h >= 0.52) & (h <= 0.72) & (s > 0.25)
            h = np.where(blue_gem & (v > 0.55), 0.52, np.where(blue_gem, 0.80, h))
        elif realm == "meteor":
            cool_gem = (h >= 0.44) & (h <= 0.78) & (s > 0.18)
            h = np.where(cool_gem, np.where(h < 0.62, 0.09, 0.03), h)
            s = np.where(cool_gem, np.clip(s * 1.15, 0, 1), np.clip(s * 1.10, 0, 1))
            warm = (h >= 0.02) & (h <= 0.16)
            h = np.where(warm, np.clip(h * 0.82, 0.015, 0.13), h)
    else:
        # Bad hazards: preserve crimson red-glass center on EMP; differentiate metals & energy accents clearly across ALL 3 realms!
        if node_key == "emp_detonator":
            yy, xx = np.mgrid[0:512, 0:512]
            in_red_glass = np.hypot(xx - 255.5, yy - 255.5) < 92
        else:
            in_red_glass = np.zeros((512, 512), dtype=bool)

        if realm == "dynamo":
            # Blackened cobalt-titanium steel + electric violet-crimson energy (distinct from Meteor's warm magma bronze!)
            non_glass = ~in_red_glass
            metal = non_glass & (s <= 0.42)
            h = np.where(metal, 0.61, h)
            s = np.where(metal, np.clip(s * 0.55 + 0.14, 0, 0.36), s)
            warm_energy = non_glass & (s > 0.42) & (h < 0.14)
            h = np.where(warm_energy, np.where(h > 0.05, 0.78, 0.94), h)
        elif realm == "helix":
            # Obsidian-chrome + neon magenta & toxic violet rift tint outside center EMP lens
            non_glass = ~in_red_glass
            warm_accent = non_glass & (s > 0.28) & ((h < 0.14) | (h > 0.90))
            h = np.where(warm_accent, 0.85, h)
            metal = non_glass & (s <= 0.28)
            h = np.where(metal, 0.56, h)
            s = np.where(metal, np.clip(s + 0.08, 0, 0.32), s)
        elif realm == "meteor":
            # Scorched volcanic bronze + blazing magma orange-scarlet
            non_glass = ~in_red_glass
            violet_blue = non_glass & (h >= 0.55) & (h <= 0.92) & (s > 0.22)
            h = np.where(violet_blue, 0.055, h)
            metal = non_glass & (s <= 0.26) & (v > 0.18)
            h = np.where(metal, 0.075, h)
            s = np.where(metal, np.clip(s + 0.18, 0, 0.48), s)

    out_rgb = np.clip(hsv_to_rgb_np(h, s, v) * 255.0, 0, 255)
    out = np.concatenate([out_rgb, a], axis=-1).astype(np.uint8)
    res = Image.fromarray(out, "RGBA")
    if not is_bad:
        # Balanced luxury clarity without over-bright blowout
        res = ImageEnhance.Contrast(res).enhance(1.06)
    return res


def compose_good_base(key: str, good_slots) -> Image.Image:
    if key == "missiles":
        # Option C darts centered inside Option E circular gem-inlaid filigree ring!
        ring_raw = extract_rgba_clean(good_slots["missiles"][4], preserve_center_black=False)
        ring_512 = fit_to_512(ring_raw, 458)
        # Mask out Option E's inner gem medallion while keeping Option E's outer gem ring completely intact!
        m_out = radial_alpha_mask(512, 128, 152, keep_inside=False)
        r_arr = np.asarray(ring_512, dtype=np.float32)
        r_arr[:, :, 3] *= m_out
        ring_clean = Image.fromarray(r_arr.astype(np.uint8), "RGBA")

        c_raw = extract_rgba_clean(good_slots["missiles"][2], preserve_center_black=False)
        c_512 = fit_to_512(c_raw, 336)
        m_in = radial_alpha_mask(512, 92, 134, keep_inside=True)
        c_arr = np.asarray(c_512, dtype=np.float32)
        c_arr[:, :, 3] *= m_in
        center_clean = Image.fromarray(c_arr.astype(np.uint8), "RGBA")

        base = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        base.alpha_composite(center_clean)
        base.alpha_composite(ring_clean)
        return base

    if key == "supercharge":
        # Option D overdrive lightning seal + Option B feathered speed wings!
        b_raw = extract_rgba_clean(good_slots["hyper"][1], preserve_center_black=False)
        b_wings = fit_to_512(b_raw, 476)
        w_arr = np.asarray(b_wings, dtype=np.float32)
        # Mask center orb inside Option B so only its sculpted wing crest surrounds Option D
        w_arr[:, :, 3] *= radial_alpha_mask(512, 76, 118, keep_inside=False)
        wings_clean = Image.fromarray(w_arr.astype(np.uint8), "RGBA")

        d_raw = extract_rgba_clean(good_slots["hyper"][3], preserve_center_black=False)
        d_seal = fit_to_512(d_raw, 318)

        base = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        base.alpha_composite(wings_clean)
        base.alpha_composite(d_seal)
        return base

    if key == "cluster":
        # Option D: Interlocking Twin Baroque Filigree Rings
        d_raw = extract_rgba_clean(good_slots["dup"][3], preserve_center_black=False)
        return fit_to_512(d_raw, 456)

    if key == "chronos":
        # Option B winged crystal crest + Option C celestial zodiac chronometer dial + Option B central hourglass!
        b_raw = extract_rgba_clean(good_slots["stasis"][1], preserve_center_black=False)
        b_full = fit_to_512(b_raw, 464)

        c_raw = extract_rgba_clean(good_slots["stasis"][2], preserve_center_black=False)
        c_dial = fit_to_512(c_raw, 356)

        # Punch crisp center circle out of C so B's glowing hourglass shines right in the center of the zodiac dial!
        c_arr = np.asarray(c_dial, dtype=np.float32)
        c_arr[:, :, 3] *= radial_alpha_mask(512, 56, 86, keep_inside=False)
        c_ring_dial = Image.fromarray(c_arr.astype(np.uint8), "RGBA")

        hg_arr = np.asarray(b_full, dtype=np.float32)
        hg_arr[:, :, 3] *= radial_alpha_mask(512, 66, 90, keep_inside=True)
        hourglass_core = Image.fromarray(hg_arr.astype(np.uint8), "RGBA")

        base = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        base.alpha_composite(b_full)
        base.alpha_composite(c_ring_dial)
        base.alpha_composite(hourglass_core)
        return base

    if key == "singularity":
        # Option D ornate filigree star-lantern + Option A swirling cosmic attraction vortex & heart core in center!
        a_raw = extract_rgba_clean(good_slots["vacuum"][0], preserve_center_black=True)
        # Zoom slightly into Option A's rich swirling heart center
        aw, ah = a_raw.size
        a_zoom = a_raw.crop((int(aw * 0.14), int(ah * 0.16), int(aw * 0.86), int(ah * 0.88)))
        a_center = fit_to_512(a_zoom, 340)
        a_arr = np.asarray(a_center, dtype=np.float32)
        a_arr[:, :, 3] *= radial_alpha_mask(512, 125, 168, keep_inside=True)
        a_masked = Image.fromarray(a_arr.astype(np.uint8), "RGBA")

        d_raw = extract_rgba_clean(good_slots["vacuum"][3], preserve_center_black=False)
        d_lantern = fit_to_512(d_raw, 434)
        # Open the interior glass of Option D's lantern subtly so the filigree bars overlay Option A's starry heart!
        d_arr = np.asarray(d_lantern, dtype=np.float32)
        yy, xx = np.mgrid[0:512, 0:512]
        rad = np.hypot(xx - 255.5, yy - 255.5)
        rgb = d_arr[:, :, :3]
        # Inside r < 152, keep bright gold filigree ribs while letting dark blue lantern background go transparent
        in_window = rad < 152
        lum = rgb.max(axis=2)
        gold_rib = (rgb[:, :, 0] > rgb[:, :, 2] + 22) | (lum > 145)
        fade = np.where(in_window & (~gold_rib), 0.18, 1.0)
        d_arr[:, :, 3] *= fade.astype(np.float32)
        d_cage = Image.fromarray(d_arr.astype(np.uint8), "RGBA")

        base = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        base.alpha_composite(a_masked)
        base.alpha_composite(d_cage)
        return base

    raise ValueError(key)


def compose_bad_base(key: str, bad_slots, realm: str) -> Image.Image:
    if key == "hyper_comet":
        return fit_to_512(extract_rgba_clean(bad_slots["comet"][1], preserve_center_black=False), 446)

    if key == "corruptor_laser":
        return fit_to_512(extract_rgba_clean(bad_slots["laser"][1], preserve_center_black=False), 454)

    if key == "gravity_well":
        # Option A: preserve solid black hole sphere in center!
        raw = extract_rgba_clean(bad_slots["vortex"][0], preserve_center_black=True)
        return fit_to_512(raw, 464)

    if key == "emp_detonator":
        # PERFECT SPHERE fusing Option E dark Tesla-coil cage + Option D glowing RED GLASS optical center!
        r_sph = 212
        rim = (196, 98, 72) if realm == "meteor" else ((188, 118, 224) if realm == "helix" else (182, 118, 92))
        under, glass, circ_mask = make_perfect_sphere_overlay(512, r=r_sph, rim_rgb=rim, inner_tint=(18, 20, 32))

        e_raw = extract_rgba_clean(bad_slots["emp"][4], preserve_center_black=True)
        e_512 = fit_to_512(e_raw, 434)
        e_arr = np.asarray(e_512, dtype=np.float32)
        # Clip Option E strictly inside the perfect sphere radius so zero jagged spikes break the circular perimeter!
        e_arr[:, :, 3] *= circ_mask
        e_sphere = Image.fromarray(e_arr.astype(np.uint8), "RGBA")

        d_raw = extract_rgba_clean(bad_slots["emp"][3], preserve_center_black=True)
        d_512 = fit_to_512(d_raw, 400)
        d_arr = np.asarray(d_512, dtype=np.float32)
        d_arr[:, :, 3] *= radial_alpha_mask(512, 68, 108, keep_inside=True)
        # Boost rich crimson-ruby glass vibrancy right inside center lens
        d_arr[:, :, 0] = np.clip(d_arr[:, :, 0] * 1.18 + 18, 0, 255)
        d_center = Image.fromarray(d_arr.astype(np.uint8), "RGBA")

        comp = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        comp.alpha_composite(under)
        comp.alpha_composite(e_sphere)
        comp.alpha_composite(d_center)
        comp.alpha_composite(glass)
        return comp

    if key == "phase_stalker":
        # PERFECT SPHERE encapsulating each realm's existing painted Phase Stalker AAA core!
        r_sph = 206
        rim = (244, 114, 182) if realm == "helix" else ((251, 146, 60) if realm == "meteor" else (192, 132, 252))
        tint = (32, 12, 46) if realm == "helix" else ((42, 18, 12) if realm == "meteor" else (18, 20, 44))
        under, glass, circ_mask = make_perfect_sphere_overlay(512, r=r_sph, rim_rgb=rim, inner_tint=tint)

        # Back up original painted art if not yet backed up in scratch
        bak = SCRATCH / f"orig_phase_stalker_{realm}.png"
        orig_path = ASSETS / f"hazard-powered-{realm}-phase_stalker.png"
        if not bak.exists():
            Image.open(orig_path).convert("RGBA").save(bak)
        core = Image.open(bak).convert("RGBA")
        # Crop tight to non-transparent core artwork and fill the perfect sphere generously!
        bb = core.getbbox()
        if bb:
            core = core.crop(bb)
        core_fit = fit_to_512(core, int(r_sph * 2.18))
        c_arr = np.asarray(core_fit, dtype=np.float32)
        c_arr[:, :, 3] *= circ_mask
        core_clipped = Image.fromarray(c_arr.astype(np.uint8), "RGBA")

        comp = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        comp.alpha_composite(under)
        comp.alpha_composite(core_clipped)
        comp.alpha_composite(glass)
        return comp

    raise ValueError(key)


def build_contact_sheet(title: str, rows, cols, paths_fn, out_path: pathlib.Path):
    cw, ch = 260, 260
    lw, th = 190, 64
    W = lw + len(cols) * cw + 24
    H = th + len(rows) * ch + 20
    sheet = Image.new("RGBA", (W, H), (8, 12, 24, 255))
    draw = ImageDraw.Draw(sheet)
    draw.text((24, 20), title, fill=(241, 245, 249, 255))
    for ci, col_lbl in enumerate(cols):
        draw.text((lw + ci * cw + 96, 40), col_lbl.upper(), fill=(125, 211, 252, 255))
    for ri, (rk, rlbl) in enumerate(rows):
        y0 = th + ri * ch
        draw.text((24, y0 + 116), rlbl, fill=(253, 224, 71, 255))
        for ci, ck in enumerate(cols):
            p = paths_fn(ck, rk)
            tile = Image.open(p).convert("RGBA").resize((224, 224), Image.Resampling.LANCZOS)
            sheet.alpha_composite(tile, (lw + ci * cw + 18, y0 + 18))
    sheet.save(out_path, optimize=True)
    print("SAVED_SHEET ->", out_path)


def main():
    good_slots = {
        "missiles": split_five_slots(CAT / "good_missiles_strip.jpg"),
        "hyper": split_five_slots(CAT / "good_hyper_strip.jpg"),
        "dup": split_five_slots(CAT / "good_dup_strip.jpg"),
        "stasis": split_five_slots(CAT / "good_stasis_strip.jpg"),
        "vacuum": split_five_slots(CAT / "good_vacuum_strip.jpg"),
    }
    bad_slots = {
        "comet": split_five_slots(CAT / "bad_comet_strip.jpg"),
        "laser": split_five_slots(CAT / "bad_laser_strip.jpg"),
        "vortex": split_five_slots(CAT / "bad_vortex_strip.jpg"),
        "emp": split_five_slots(CAT / "bad_emp_strip.jpg"),
    }

    good_keys = ["missiles", "supercharge", "cluster", "chronos", "singularity"]
    bad_keys = ["hyper_comet", "corruptor_laser", "gravity_well", "emp_detonator", "phase_stalker"]

    for gk in good_keys:
        base = compose_good_base(gk, good_slots)
        for realm in ("dynamo", "helix", "meteor"):
            graded = apply_realm_grade(base, realm, is_bad=False, node_key=gk)
            out_p = ASSETS / f"powerup-{realm}-{gk}.png"
            graded.save(out_p, optimize=True)
            print("SAVED_GOOD ->", out_p.name)

    for bk in bad_keys:
        for realm in ("dynamo", "helix", "meteor"):
            base = compose_bad_base(bk, bad_slots, realm)
            graded = apply_realm_grade(base, realm, is_bad=True, node_key=bk)
            out_p = ASSETS / f"hazard-powered-{realm}-{bk}.png"
            graded.save(out_p, optimize=True)
            print("SAVED_BAD ->", out_p.name)

    build_contact_sheet(
        "v423 AAA REALM GOOD RELICS (DYNAMO vs HELIX vs METEOR)",
        [("missiles", "MISSILES (C+E)"), ("supercharge", "HYPER (B+D)"), ("cluster", "2X DUP (D)"), ("chronos", "STASIS (B+C)"), ("singularity", "VACUUM (A+D)")],
        ["dynamo", "helix", "meteor"],
        lambda m, k: ASSETS / f"powerup-{m}-{k}.png",
        SCRATCH / "v423_realm_good_nodes_sheet.png",
    )
    build_contact_sheet(
        "v423 AAA REALM BAD HAZARDS (DYNAMO vs HELIX vs METEOR)",
        [("hyper_comet", "COMET (B)"), ("corruptor_laser", "LASER (B)"), ("gravity_well", "VORTEX (A)"), ("emp_detonator", "EMP (E+D Sphere)"), ("phase_stalker", "BLINK (Sphere)")],
        ["dynamo", "helix", "meteor"],
        lambda m, k: ASSETS / f"hazard-powered-{m}-{k}.png",
        SCRATCH / "v423_realm_bad_nodes_sheet.png",
    )


if __name__ == "__main__":
    main()
