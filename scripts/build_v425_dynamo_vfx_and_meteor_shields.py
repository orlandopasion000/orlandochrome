import math
import os
import random
import shutil
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, label

ROOT = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
ASSETS = os.path.join(ROOT, "assets")
SCRATCH = os.path.join(ROOT, "scratch")
os.makedirs(SCRATCH, exist_ok=True)


def draw_aa_segment(buf, x0, y0, x1, y1, width, intensity):
    """Rasterize a smooth antialiased tapered segment onto float32 scalar buffer."""
    h, w = buf.shape
    dist = math.hypot(x1 - x0, y1 - y0)
    steps = max(2, int(math.ceil(dist * 2.5)))
    ts = np.linspace(0.0, 1.0, steps)
    xs = x0 + (x1 - x0) * ts
    ys = y0 + (y1 - y0) * ts
    r = max(0.55, width * 0.5)
    rad_ceil = int(math.ceil(r + 1.5))

    for px_f, py_f in zip(xs, ys):
        cx = int(round(px_f))
        cy = int(round(py_f))
        x_lo = max(0, cx - rad_ceil)
        x_hi = min(w, cx + rad_ceil + 1)
        y_lo = max(0, cy - rad_ceil)
        y_hi = min(h, cy + rad_ceil + 1)
        if x_lo >= x_hi or y_lo >= y_hi:
            continue
        yy, xx = np.mgrid[y_lo:y_hi, x_lo:x_hi]
        d = np.sqrt((xx - px_f) ** 2 + (yy - py_f) ** 2)
        cov = np.clip((r + 0.65 - d) / 1.15, 0.0, 1.0) * intensity
        buf[y_lo:y_hi, x_lo:x_hi] = np.maximum(buf[y_lo:y_hi, x_lo:x_hi], cov)


def midpoint_displace(p0, p1, roughness, depth, rng):
    pts = [p0, p1]
    disp = math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * roughness
    for _ in range(depth):
        new_pts = [pts[0]]
        for i in range(len(pts) - 1):
            ax, ay = pts[i]
            bx, by = pts[i + 1]
            mx = 0.5 * (ax + bx)
            my = 0.5 * (ay + by)
            dx = bx - ax
            dy = by - ay
            length = max(1e-6, math.hypot(dx, dy))
            nx, ny = -dy / length, dx / length
            offset = rng.gauss(0.0, 0.55) * disp
            new_pts.append((mx + nx * offset, my + ny * offset))
            new_pts.append((bx, by))
        pts = new_pts
        disp *= 0.54
    return pts


def add_electric_palette(core_map, mid_map, wide_map):
    """Map multi-scale HDR plasma intensity buffers to crisp glowing straight-alpha RGBA (zero dark soot halo)."""
    h, w = core_map.shape
    glow_wide = gaussian_filter(wide_map, sigma=16.0)
    glow_med = gaussian_filter(mid_map, sigma=5.5)
    glow_tight = gaussian_filter(core_map, sigma=1.6)
    crisp_core = gaussian_filter(core_map, sigma=0.52)

    # Energy density in [0..inf)
    energy = 0.70 * glow_wide + 1.15 * glow_med + 1.75 * glow_tight + 2.4 * crisp_core

    # Straight-alpha HDR color: stays luminous electric indigo/cyan/white even at low alpha!
    # Heat parameter t in [0, 1] from outer ionized violet -> bright cyan -> pure white arc core
    t_core = np.clip((1.15 * crisp_core + 0.55 * glow_tight) / (energy + 0.12), 0.0, 1.0)
    t_mid = np.clip((glow_med + glow_tight) / (energy + 0.18), 0.0, 1.0)

    # Base violet-indigo glow: (125, 65, 255)
    # Mid electric cyan-blue sheen: (100, 225, 255)
    # White-hot arc core: (255, 255, 255)
    r = 135.0 * (1.0 - t_mid) + 90.0 * t_mid
    g = 62.0 * (1.0 - t_mid) + 225.0 * t_mid
    b = 255.0

    # Blend toward pure incandescent white-cyan along high-current filament cores
    w_mix = np.clip(t_core * 1.45, 0.0, 1.0) ** 1.15
    r = r * (1.0 - w_mix) + 255.0 * w_mix
    g = g * (1.0 - w_mix) + 255.0 * w_mix
    b = b * (1.0 - w_mix) + 255.0 * w_mix

    # Subtle magenta-violet ionized accents along fork edges
    edge_ion = np.clip((glow_med - glow_tight * 0.65) * 1.4, 0.0, 1.0)
    r = np.clip(r + 65.0 * edge_ion * (1.0 - w_mix), 0.0, 255.0)

    alpha = np.clip(1.0 - np.exp(-energy * 1.65), 0.0, 1.0)
    yy, xx = np.mgrid[0:h, 0:w]
    edge_x = np.clip(np.minimum(xx, w - 1 - xx) / (w * 0.08), 0.0, 1.0)
    edge_y = np.clip(np.minimum(yy, h - 1 - yy) / (h * 0.04), 0.0, 1.0)
    alpha *= edge_x * edge_y

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0] = np.clip(r, 0, 255).astype(np.uint8)
    rgba[..., 1] = np.clip(g, 0, 255).astype(np.uint8)
    rgba[..., 2] = np.clip(b, 0, 255).astype(np.uint8)
    rgba[..., 3] = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, mode="RGBA")


def build_dynamo_arc(idx):
    w, h = 256, 512
    rng = random.Random(42500 + idx * 137)
    core = np.zeros((h, w), dtype=np.float32)
    mid = np.zeros((h, w), dtype=np.float32)
    wide = np.zeros((h, w), dtype=np.float32)

    cx = w * 0.5
    p0 = (cx + rng.uniform(-6, 6), 14.0)
    p1 = (cx + rng.uniform(-8, 8), h - 14.0)

    main_pts = midpoint_displace(p0, p1, roughness=0.22, depth=6, rng=rng)
    for i in range(len(main_pts) - 1):
        t = i / max(1, len(main_pts) - 1)
        taper = 1.0 - 0.18 * abs(t - 0.5)
        x0, y0 = main_pts[i]
        x1, y1 = main_pts[i + 1]
        draw_aa_segment(core, x0, y0, x1, y1, 2.3 * taper, 1.15)
        draw_aa_segment(mid, x0, y0, x1, y1, 3.8 * taper, 1.00)
        draw_aa_segment(wide, x0, y0, x1, y1, 6.0 * taper, 0.90)

    braid_pts = midpoint_displace(
        (p0[0] + rng.uniform(-12, 12), p0[1] + 8),
        (p1[0] + rng.uniform(-14, 14), p1[1] - 8),
        roughness=0.28,
        depth=6,
        rng=rng,
    )
    for i in range(len(braid_pts) - 1):
        x0, y0 = braid_pts[i]
        x1, y1 = braid_pts[i + 1]
        draw_aa_segment(core, x0, y0, x1, y1, 1.35, 0.80)
        draw_aa_segment(mid, x0, y0, x1, y1, 2.3, 0.65)
        draw_aa_segment(wide, x0, y0, x1, y1, 3.6, 0.52)

    n_pts = len(main_pts)
    branch_indices = sorted(rng.sample(range(4, n_pts - 4), 20))
    for b_idx in branch_indices:
        bx, by = main_pts[b_idx]
        side = -1.0 if rng.random() < 0.5 else 1.0
        angle = math.pi * 0.5 + side * rng.uniform(0.35, 1.05)
        if rng.random() < 0.35:
            angle = -angle if rng.random() < 0.3 else angle
        b_len = rng.uniform(34.0, 96.0)
        ex = float(np.clip(bx + math.cos(angle) * b_len, 12.0, w - 12.0))
        ey = float(np.clip(by + math.sin(angle) * b_len * rng.choice([0.85, 1.0, -0.5]), 14.0, h - 14.0))
        b_pts = midpoint_displace((bx, by), (ex, ey), roughness=0.34, depth=4, rng=rng)
        for j in range(len(b_pts) - 1):
            frac = j / max(1, len(b_pts) - 1)
            bw = max(0.60, 1.60 * (1.0 - frac * 0.65))
            bint = 0.92 * (1.0 - frac * 0.50)
            draw_aa_segment(core, b_pts[j][0], b_pts[j][1], b_pts[j + 1][0], b_pts[j + 1][1], bw, bint)
            draw_aa_segment(mid, b_pts[j][0], b_pts[j][1], b_pts[j + 1][0], b_pts[j + 1][1], bw * 1.5, bint * 0.72)
            draw_aa_segment(wide, b_pts[j][0], b_pts[j][1], b_pts[j + 1][0], b_pts[j + 1][1], bw * 2.4, bint * 0.55)

        if len(b_pts) > 5 and rng.random() < 0.75:
            ti = rng.randint(2, len(b_pts) - 2)
            tx, ty = b_pts[ti]
            t_len = rng.uniform(16.0, 42.0)
            t_ang = angle + rng.uniform(-0.8, 0.8)
            tex = float(np.clip(tx + math.cos(t_ang) * t_len, 10.0, w - 10.0))
            tey = float(np.clip(ty + math.sin(t_ang) * t_len, 10.0, h - 10.0))
            t_pts = midpoint_displace((tx, ty), (tex, tey), roughness=0.32, depth=3, rng=rng)
            for k in range(len(t_pts) - 1):
                tf = k / max(1, len(t_pts) - 1)
                tw = max(0.55, 1.00 * (1.0 - tf * 0.5))
                tint = 0.68 * (1.0 - tf * 0.55)
                draw_aa_segment(core, t_pts[k][0], t_pts[k][1], t_pts[k + 1][0], t_pts[k + 1][1], tw, tint)
                draw_aa_segment(mid, t_pts[k][0], t_pts[k][1], t_pts[k + 1][0], t_pts[k + 1][1], tw * 1.5, tint * 0.60)

    img = add_electric_palette(core, mid, wide)
    out_path = os.path.join(ASSETS, f"vfx-dynamo-arc-{idx}.png")
    img.save(out_path)
    return out_path


def build_dynamo_tesla_bolt():
    w, h = 192, 320
    rng = random.Random(42599)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = w * 0.5
    ny = (yy - 28.0) / 268.0

    half_w = np.where(
        ny < 0.22,
        np.clip(ny / 0.22, 0.0, 1.0) ** 0.72 * 18.0,
        np.clip(1.0 - (ny - 0.22) / 0.78, 0.0, 1.0) ** 1.35 * 18.0,
    )
    half_w = np.where((ny >= 0.0) & (ny <= 1.0), half_w, 0.0)

    dx = np.abs(xx - cx)
    spear = np.exp(-((dx / np.maximum(half_w * 0.42, 1.2)) ** 2)) * np.where((ny >= 0.0) & (ny <= 0.96), 1.0, 0.0)
    sheath = np.exp(-((dx / np.maximum(half_w * 1.05, 3.2)) ** 2)) * np.where((ny >= -0.02) & (ny <= 1.04), 0.85, 0.0)
    wake = np.exp(-((dx / np.maximum(half_w * 2.1 + 10.0, 10.0)) ** 2)) * np.exp(-((ny - 0.42) / 0.48) ** 2) * 0.72

    core = (spear * 1.25).astype(np.float32)
    mid = (sheath * 1.05).astype(np.float32)
    wide = (wake * 0.95).astype(np.float32)

    for b in range(3):
        sx = cx + (b - 1) * 6.0
        sy = 46.0 + b * 14.0
        ex = cx + (b - 1) * 24.0 + rng.uniform(-10, 10)
        ey = 250.0 + b * 16.0
        pts = midpoint_displace((sx, sy), (ex, ey), roughness=0.24, depth=5, rng=rng)
        for i in range(len(pts) - 1):
            frac = i / max(1, len(pts) - 1)
            tw = max(0.60, 1.40 * (1.0 - frac * 0.55))
            ti = 0.98 * (1.0 - frac * 0.45)
            draw_aa_segment(core, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw, ti)
            draw_aa_segment(mid, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw * 1.8, ti * 0.68)
            draw_aa_segment(wide, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw * 2.8, ti * 0.48)

    img = add_electric_palette(core, mid, wide)
    out_path = os.path.join(ASSETS, "vfx-dynamo-tesla-bolt.png")
    img.save(out_path)
    return out_path


def build_dynamo_origin_burst():
    """High-contrast Layla-style Astral-Lightning discharge burst (512x512 RGBA, zero NaNs)."""
    w = h = 512
    rng = random.Random(42577)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = cy = 256.0
    dx = xx - cx
    dy = yy - cy
    rr = np.sqrt(dx * dx + dy * dy)
    theta = np.arctan2(dy, dx)

    petals = np.maximum(
        0.35,
        0.72
        + 0.22 * np.cos(theta * 4.0 + rr * 0.025)
        + 0.16 * np.cos(theta * 8.0 - rr * 0.03)
        + 0.10 * np.sin(theta * 14.0),
    )
    radial_core = np.exp(-((rr / 36.0) ** 2)) * 1.55
    radial_mid = np.exp(-((rr / (82.0 * petals)) ** 1.65)) * 1.10
    radial_wide = np.exp(-((rr / (148.0 * (0.85 + 0.20 * petals))) ** 1.5)) * 0.95

    ring_r = 96.0 + 10.0 * np.cos(theta * 6.0)
    ring = np.exp(-(((rr - ring_r) / 6.5) ** 2)) * 0.65

    core = radial_core.astype(np.float32)
    mid = (radial_mid + ring).astype(np.float32)
    wide = radial_wide.astype(np.float32)

    for k in range(14):
        ang = (k / 14.0) * math.tau + rng.uniform(-0.16, 0.16)
        r_end = rng.uniform(135.0, 224.0)
        sx = cx + math.cos(ang) * 14.0
        sy = cy + math.sin(ang) * 14.0
        ex = cx + math.cos(ang + rng.uniform(-0.22, 0.22)) * r_end
        ey = cy + math.sin(ang + rng.uniform(-0.22, 0.22)) * r_end
        pts = midpoint_displace((sx, sy), (ex, ey), roughness=0.28, depth=5, rng=rng)
        for i in range(len(pts) - 1):
            frac = i / max(1, len(pts) - 1)
            tw = max(0.6, 1.85 * (1.0 - frac * 0.72))
            ti = 1.10 * (1.0 - frac * 0.62)
            draw_aa_segment(core, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw, ti)
            draw_aa_segment(mid, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw * 1.7, ti * 0.68)
            draw_aa_segment(wide, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tw * 2.5, ti * 0.50)

    img = add_electric_palette(core, mid, wide)
    out_path = os.path.join(ASSETS, "vfx-dynamo-origin-burst.png")
    img.save(out_path)
    return out_path


def remove_horns_from_shield_barrier():
    """Surgically remove ONLY the two dragon horns from assets/shield-barrier-meteor.png while keeping ring gear teeth 100% intact."""
    src = os.path.join(ASSETS, "shield-barrier-meteor.png")
    bak = os.path.join(SCRATCH, "orig_shield-barrier-meteor.png")
    if not os.path.exists(bak):
        shutil.copy2(src, bak)
    img = Image.open(bak).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape
    out = arr.copy()

    # In bak (512x512):
    # - The shield crest apex is at (256, 33.5).
    # - The upper octagonal crest V-bevel runs from (256, 33.5) out to shoulders (231, 49) & (281, 49).
    # - Above y_crest(x), everything in x=225..288 is protruding horn -> remove cleanly to transparent.
    # - Below y_crest(x), reconstruct a smooth sculpted dark obsidian shield pocket behind the hornless dragon brow.
    for x in range(225, 288):
        dist_c = abs(x - 256.0)
        y_crest = 33.2 + dist_c * 0.735
        for y in range(0, 52):
            if y < y_crest and y < 50.0:
                out[y, x] = [0, 0, 0, 0]
            elif dist_c <= 24.5 and y_crest <= y < y_crest + 2.8 and y < 51.0:
                # Smooth golden outer bevel matching the crest's original rim illumination (warmer highlight center-left)
                t_rim = (y - y_crest) / 2.8
                hl = 1.0 if x < 256 else 0.90
                out[y, x] = [
                    int(min(255, (224 - 36 * t_rim) * hl)),
                    int(min(255, (190 - 38 * t_rim) * hl)),
                    int(min(255, (112 - 30 * t_rim) * hl)),
                    255,
                ]

    # Inside the black obsidian crest pocket (above dragon brow, below the gold rim),
    # erase remaining golden horn bases using smooth dark gunmetal-obsidian bevel gradient matching the real shield backing:
    for x in range(233, 280):
        dist_c = abs(x - 256.0)
        if dist_c < 9.0 or dist_c > 23.0:
            continue
        y_crest = 33.2 + dist_c * 0.735
        y_brow = 54.0 + (dist_c - 9.0) * 0.38
        for y in range(int(math.ceil(y_crest + 2.7)), int(math.floor(y_brow))):
            r_v, g_v, b_v, a_v = out[y, x]
            if a_v > 0 and (int(r_v) + int(g_v)) > 140:
                # Subtle obsidian metallic vignette (brighter near brow/bevel edge, rich deep charcoal inside)
                depth_t = (y - (y_crest + 2.7)) / max(1.0, (y_brow - (y_crest + 2.7)))
                gloss = int(20 + 18 * (1.0 - abs(depth_t - 0.35)) + (8 if x < 256 else 0))
                out[y, x] = [gloss, gloss + 1, gloss + 4, 255]

    Image.fromarray(out, mode="RGBA").save(src)
    return src


def remove_horns_and_halo_from_powerup_shield():
    """Remove curved horns and fuzzy brown halo smoothly from assets/powerup-shield-meteor.png."""
    src = os.path.join(ASSETS, "powerup-shield-meteor.png")
    bak = os.path.join(SCRATCH, "orig_powerup-shield-meteor.png")
    if not os.path.exists(bak):
        shutil.copy2(src, bak)
    img = Image.open(bak).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape
    cx = w * 0.5

    alpha = arr[..., 3]
    center_band = slice(int(cx - 8), int(cx + 9))
    center_ys = np.where((alpha[:int(h * 0.45), center_band] > 160).any(axis=1))[0]
    apex_y = int(center_ys[0]) if len(center_ys) else int(h * 0.14)

    out = arr.copy()
    # Gentle smooth alpha edge tighten (avoids pixel stair-stepping while stripping blurry brown haze)
    a_f = out[..., 3].astype(np.float32)
    r_f = out[..., 0].astype(np.float32)
    g_f = out[..., 1].astype(np.float32)
    b_f = out[..., 2].astype(np.float32)
    luma = 0.299 * r_f + 0.587 * g_f + 0.114 * b_f

    brown_halo = (a_f > 0) & (a_f < 175) & (luma < 80) & (r_f >= b_f)
    out[brown_halo, 3] = 0
    a_norm = np.clip((out[..., 3].astype(np.float32) - 24.0) / 215.0, 0.0, 1.0)
    a_smooth = a_norm * a_norm * (3.0 - 2.0 * a_norm)
    out[..., 3] = np.clip(a_smooth * 255.0, 0, 255).astype(np.uint8)

    # Remove upper protruding horns smoothly above & flanking the central V-crest
    horn_bottom_y = apex_y + int(h * 0.16)
    for y in range(0, horn_bottom_y):
        dy = max(0.0, y - apex_y)
        allowed_hw = (w * 0.02) + (dy / max(1.0, horn_bottom_y - apex_y)) * (w * 0.25)
        for x in range(0, w):
            dist_c = abs(x - cx)
            if y < apex_y - int(h * 0.01):
                out[y, x] = [0, 0, 0, 0]
            elif dist_c > allowed_hw + 1.5:
                out[y, x] = [0, 0, 0, 0]
            elif dist_c > allowed_hw - 0.5:
                # 2px soft feather along crest shoulder cut
                frac = max(0.0, min(1.0, (allowed_hw + 1.5 - dist_c) / 2.0))
                out[y, x, 3] = int(out[y, x, 3] * frac)

    labeled, ncomp = label(out[..., 3] > 20)
    if ncomp > 1:
        counts = np.bincount(labeled.ravel())
        counts[0] = 0
        main_label = counts.argmax()
        out[(labeled > 0) & (labeled != main_label)] = [0, 0, 0, 0]

    Image.fromarray(out, mode="RGBA").save(src)
    return src


if __name__ == "__main__":
    for i in range(4):
        print("Saved", build_dynamo_arc(i))
    print("Saved", build_dynamo_tesla_bolt())
    print("Saved", build_dynamo_origin_burst())
    print("Updated", remove_horns_from_shield_barrier())
    print("Updated", remove_horns_and_halo_from_powerup_shield())
