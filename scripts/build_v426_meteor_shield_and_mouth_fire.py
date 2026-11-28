import math
import os
import shutil
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

ROOT = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
ASSETS = os.path.join(ROOT, "assets")
SCRATCH = os.path.join(ROOT, "scratch")
os.makedirs(SCRATCH, exist_ok=True)


def rebuild_hornless_shield_barrier():
    """Rebuild assets/shield-barrier-meteor.png top medallion cleanly from orig, with obsidian scale infill and hornless 3D gold emblem."""
    src = os.path.join(ASSETS, "shield-barrier-meteor.png")
    bak = os.path.join(SCRATCH, "orig_shield-barrier-meteor.png")
    assert os.path.exists(bak), f"Missing backup: {bak}"

    orig = Image.open(bak).convert("RGBA")
    arr = np.array(orig)
    h, w, _ = arr.shape
    cx = 256.0

    # Sample strictly pure black volcanic scale plate (no golden border band!) from y=418..450, x=230..282
    scale_patch = arr[418:450, 230:282, :3][::-1, :, :].copy()  # 32 x 52 pure obsidian dragon scales

    # 1. Compute exact outer heraldic crest border line (keeps circular ring gear teeth outside x=[225..287] 100% untouched)
    out = arr.copy()
    for x in range(225, 288):
        dist_c = abs(x - cx)
        y_crest = 33.2 + dist_c * 0.72
        for y in range(0, 52):
            if y < y_crest and y < 50.0:
                out[y, x] = [0, 0, 0, 0]
            elif dist_c <= 24.5 and y_crest <= y < y_crest + 3.2 and y < 51.0:
                # Reconstruct clean top gold V-rim bevel where horns crossed it
                t_rim = (y - y_crest) / 3.2
                hl = 1.04 if x < cx else 0.90
                out[y, x] = [
                    int(min(255, (230 - 42 * t_rim) * hl)),
                    int(min(255, (194 - 44 * t_rim) * hl)),
                    int(min(255, (112 - 34 * t_rim) * hl)),
                    255,
                ]

    # 2. Construct exact heraldic inner black shield cavity mask (y=38..99, x=231..281)
    # Using exact inner edge boundary mapped from orig_shield-barrier-meteor.png (bottom V-tip at y=99!):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dist_x = np.abs(xx - cx)

    y_top_in = 38.0 + dist_x * 0.68
    t_bot = np.clip((yy - 50.0) / 49.0, 0.0, 1.0)
    hw_bot = 22.8 * np.sqrt(np.maximum(0.0, 1.0 - (t_bot ** 1.65)))
    in_cavity = (yy >= y_top_in) & (yy <= 99.0) & (dist_x <= np.where(yy < 52.0, 22.8, hw_bot))

    # Feather cavity mask gently by 0.75px so it blends seamlessly inside the gold rim bevel
    cav_mask = gaussian_filter(in_cavity.astype(np.float32), sigma=0.75)
    cav_mask[(yy < 36.5) | (yy > 100.2) | (dist_x > 24.0)] = 0.0

    # Clone pure obsidian dragon-scale texture across cavity bbox (y=36..101, x=230..282)
    obsidian_rgb = np.zeros((h, w, 3), dtype=np.float32)
    sp_h, sp_w, _ = scale_patch.shape  # 32 x 52
    for y_i in range(36, 102):
        sy = (y_i - 36) % sp_h
        obsidian_rgb[y_i, 230:282, :] = scale_patch[sy, :, :].astype(np.float32)
    cavity_shade = 0.68 + 0.30 * np.exp(-(((yy - 67.0) / 24.0) ** 2 + ((xx - cx) / 17.0) ** 2))
    obsidian_rgb *= cavity_shade[..., None]
    obsidian_rgb = np.clip(obsidian_rgb, 6.0, 90.0)

    out_rgb = out[..., :3].astype(np.float32)
    mix = np.clip(cav_mask * 1.25, 0.0, 1.0)[..., None]
    out_rgb = out_rgb * (1.0 - mix) + obsidian_rgb * mix
    out[..., :3] = np.clip(out_rgb, 0, 255).astype(np.uint8)
    out[..., 3] = np.maximum(out[..., 3], np.clip(cav_mask * 255.0, 0, 255).astype(np.uint8))

    # Redraw crisp inner/outer gold bezel line at top V-rim + upper shoulders so zero temple-spikes leak inside
    for x in range(230, 283):
        dc = abs(x - cx)
        yc = 34.5 + dc * 0.70
        if yc < 50.0:
            for dy_r in range(0, 4):
                yy_i = int(round(yc)) + dy_r
                if 34 <= yy_i <= 52:
                    t_r = dy_r / 3.5
                    hl = 1.03 if x < cx else 0.90
                    out[yy_i, x] = [
                        int(min(255, (226 - 44 * t_r) * hl)),
                        int(min(255, (188 - 44 * t_r) * hl)),
                        int(min(255, (108 - 32 * t_r) * hl)),
                        255,
                    ]

    # 3. Craft 100% hornless sleek 3D metallic-gold Meteor Dragon emblem (with side cannon boxes masked out so NO boxy towers beside head!)
    dragon_src = Image.open(os.path.join(ASSETS, "core-meteor-t7.png")).convert("RGBA")
    d_full = np.array(dragon_src).copy()
    # Mask out twin T7 cannon towers sitting above shoulder wing joints [375..472, 10..205] & [552..649, 10..205]
    d_full[0:205, 372:472, :] = 0
    d_full[0:205, 552:652, :] = 0
    dragon_clean = Image.fromarray(d_full, mode="RGBA")

    # Crop tight around clean hornless head + neck + spread dragon wings
    emblem_crop = dragon_clean.crop((170, 32, 854, 480))
    # Compact 34x24 relief emblem centered comfortably inside the obsidian pocket with clean margin
    emblem_small = emblem_crop.resize((34, 24), Image.Resampling.LANCZOS)
    e_arr = np.array(emblem_small).astype(np.float32)
    ea = e_arr[..., 3] / 255.0
    eluma = (0.30 * e_arr[..., 0] + 0.59 * e_arr[..., 1] + 0.11 * e_arr[..., 2]) / 255.0
    grad_y, grad_x = np.gradient(eluma)
    relief = np.clip(eluma * 1.15 - 0.16 * grad_y - 0.12 * grad_x + 0.08, 0.0, 1.15)
    gold_emblem = np.zeros_like(e_arr)
    gold_emblem[..., 0] = np.clip(62.0 + relief * 208.0, 0, 255)
    gold_emblem[..., 1] = np.clip(35.0 + (relief ** 1.10) * 184.0, 0, 255)
    gold_emblem[..., 2] = np.clip(10.0 + (relief ** 1.45) * 110.0, 0, 255)
    warm_vein = np.clip((e_arr[..., 0] - e_arr[..., 2]) / 255.0, 0.0, 1.0)
    gold_emblem[..., 0] = np.clip(gold_emblem[..., 0] + warm_vein * 26.0, 0, 255)
    gold_emblem[..., 1] = np.clip(gold_emblem[..., 1] + warm_vein * 14.0, 0, 255)
    gold_emblem[..., 3] = np.clip(ea * 255.0, 0, 255)
    emblem_img = Image.fromarray(gold_emblem.astype(np.uint8), mode="RGBA")

    sh_arr = np.zeros_like(gold_emblem)
    sh_arr[..., 3] = np.clip(ea * 200.0, 0, 255)
    shadow = Image.fromarray(sh_arr.astype(np.uint8), mode="RGBA").filter(ImageFilter.GaussianBlur(radius=1.2))

    base_img = Image.fromarray(out, mode="RGBA")
    ex = int(cx - emblem_img.width // 2)
    ey = 60
    base_img.paste(shadow, (ex, ey + 2), shadow)
    base_img.paste(emblem_img, (ex, ey), emblem_img)

    base_img.save(src)

    # Save 400% closeup inspection image of rebuilt top shield plaque
    closeup = base_img.crop((185, 10, 327, 135)).resize((142 * 4, 125 * 4), Image.Resampling.NEAREST)
    closeup_path = os.path.join(SCRATCH, "v426_shield_top_closeup.png")
    closeup.save(closeup_path)
    return src, closeup_path


def warp_helical_texture(tex_img, phase, twist_amp, w_out, h_out, y_bot, y_top, hw_bot, hw_top, freq_mult=1.0, opacity=1.0):
    """Continuously sample fire/wisp texture in helical snake paths (ZERO strip seams!)."""
    src = np.array(tex_img).astype(np.float32)
    sh, sw, _ = src.shape
    yy, xx = np.mgrid[0:h_out, 0:w_out].astype(np.float32)
    cx = w_out * 0.5

    span = max(1.0, float(y_bot - y_top))
    t = (y_bot - yy) / span
    in_y = (t >= 0.0) & (t <= 1.0)
    t_c = np.clip(t, 0.0, 1.0)

    hw = hw_bot + (hw_top - hw_bot) * (t_c ** 0.78)
    center_x = cx + np.sin(t_c * math.pi * 4.5 * freq_mult - phase) * twist_amp * (0.18 + 0.82 * t_c)

    u = (xx - center_x) / (2.0 * np.maximum(hw, 2.0)) + 0.5
    v = 1.0 - t_c
    in_x = (u >= 0.0) & (u <= 1.0)
    valid = in_y & in_x

    coords_y = np.clip(v * (sh - 1.0), 0.0, sh - 1.0)
    coords_x = np.clip(u * (sw - 1.0), 0.0, sw - 1.0)

    out = np.zeros((h_out, w_out, 4), dtype=np.float32)
    for ch in range(4):
        out[..., ch] = map_coordinates(src[..., ch], [coords_y, coords_x], order=1, mode="constant", cval=0.0)

    fade_bot = np.clip(t_c / 0.045, 0.0, 1.0)
    fade_top = np.clip((1.0 - t_c) / 0.22, 0.0, 1.0) ** 1.15
    fade_x = np.clip(1.0 - ((np.abs(u - 0.5) * 2.0) ** 3.0), 0.0, 1.0)
    mask = np.where(valid, fade_bot * fade_top * fade_x * opacity, 0.0)
    out[..., 3] = np.clip(out[..., 3] * mask, 0.0, 255.0)
    return out


def build_meteor_breath_frames():
    """Generate 4 seamless helical Option C inferno breath frames (320x768 RGBA)."""
    w, h = 320, 768
    cx = w * 0.5
    y_bot, y_top = 748.0, 24.0
    span = y_bot - y_top
    flame_tex = Image.open(os.path.join(ASSETS, "vfx-nova-flame-meteor.png")).convert("RGBA")
    wisps_tex = Image.open(os.path.join(ASSETS, "vfx-nova-wisps-meteor.png")).convert("RGBA")

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip((y_bot - yy) / span, 0.0, 1.0)
    in_y = (yy >= y_top) & (yy <= y_bot + 14.0)

    paths = []
    for idx in range(4):
        phase = idx * (math.pi * 0.5)
        # Warped real fluid fire + counter-twisting wisp ribbons
        f_arr = warp_helical_texture(flame_tex, phase, +22.0, w, h, y_bot, y_top, hw_bot=14.0, hw_top=94.0, freq_mult=1.0, opacity=0.95)
        w_arr = warp_helical_texture(wisps_tex, phase + 1.1, -20.0, w, h, y_bot, y_top, hw_bot=16.0, hw_top=112.0, freq_mult=1.15, opacity=0.95)

        # Turbulent blackbody core ribbon along helical path
        rng = np.random.default_rng(42600 + idx * 97)
        n1 = gaussian_filter(rng.normal(0.0, 1.0, (h, w)).astype(np.float32), sigma=(18.0, 8.0))
        n2 = gaussian_filter(rng.normal(0.0, 1.0, (h, w)).astype(np.float32), sigma=(7.0, 3.8))
        turb = (n1 * 2.1 + n2 * 1.3) * 11.0

        hw_core = 14.0 + (82.0 - 14.0) * (t ** 0.80)
        spine_x = cx + np.sin(t * math.pi * 4.6 - phase) * 16.0 * (0.2 + 0.8 * t)
        rad = np.abs(xx - spine_x + turb * (0.14 + 0.86 * t)) / np.maximum(hw_core, 3.0)
        v_env = np.where(yy > y_bot, np.exp(-(((yy - y_bot) / 6.0) ** 2)) * 0.8, np.clip(1.0 - (t ** 1.65), 0.0, 1.0))
        nozzle_pinch = 1.0 + 0.60 * np.exp(-(((yy - (y_bot - 14.0)) / 24.0) ** 2))
        temp = np.where(in_y, np.exp(-(rad ** 1.68)) * v_env * nozzle_pinch * 1.14 * (1.0 + 0.16 * (n1 + n2)), 0.0)

        # Combine straight luminous blackbody + warped photographic fluid textures additively
        a_f = (f_arr[..., 3:4] / 255.0)
        a_w = (w_arr[..., 3:4] / 255.0)
        rgb_bb = np.stack([
            np.clip(temp * 480.0, 0, 255),
            np.clip((temp - 0.18) * 350.0, 0, 255),
            np.clip((temp - 0.62) * 285.0, 0, 255),
        ], axis=-1)
        a_bb = np.clip((temp ** 0.72) * 235.0, 0, 255)[..., None]

        # Additive energy composition keeping RGB bright (no dark soot perimeter)
        tot_r = f_arr[..., 0:1] * a_f * 0.90 + w_arr[..., 0:1] * a_w * 0.85 + rgb_bb[..., 0:1] * 0.85
        tot_g = f_arr[..., 1:2] * a_f * 0.90 + w_arr[..., 1:2] * a_w * 0.85 + rgb_bb[..., 1:2] * 0.85
        tot_b = f_arr[..., 2:3] * a_f * 0.90 + w_arr[..., 2:3] * a_w * 0.85 + rgb_bb[..., 2:3] * 0.85

        comb_a = np.clip(np.maximum.reduce([f_arr[..., 3:4], w_arr[..., 3:4], a_bb]) * 1.05, 0.0, 255.0)
        # Straight-alpha un-premultiply so faint edges stay fiery amber/crimson rather than grey
        norm_div = np.maximum(comb_a / 255.0, 0.18)
        out = np.zeros((h, w, 4), dtype=np.uint8)
        out[..., 0] = np.clip(tot_r[..., 0] / norm_div[..., 0], 0, 255).astype(np.uint8)
        out[..., 1] = np.clip(tot_g[..., 0] / norm_div[..., 0], 0, 255).astype(np.uint8)
        out[..., 2] = np.clip(tot_b[..., 0] / norm_div[..., 0], 0, 255).astype(np.uint8)
        out[..., 3] = np.clip(comb_a[..., 0], 0, 255).astype(np.uint8)

        p = os.path.join(ASSETS, f"vfx-meteor-breath-{idx}.png")
        Image.fromarray(out, mode="RGBA").save(p)
        paths.append(p)
    return paths


def build_meteor_cheek_vents():
    """Generate Option B twin swept cheek-vent afterburner exhaust plumes (256x160 RGBA)."""
    w, h = 256, 160
    cx, cy = 128.0, 72.0
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rng = np.random.default_rng(42688)
    n1 = gaussian_filter(rng.normal(0.0, 1.0, (h, w)).astype(np.float32), sigma=(4.5, 9.0))
    n2 = gaussian_filter(rng.normal(0.0, 1.0, (h, w)).astype(np.float32), sigma=(2.2, 4.0))
    turb = (n1 * 1.6 + n2 * 0.9) * 4.5

    vent = np.zeros((h, w), dtype=np.float32)
    for side in (-1.0, 1.0):
        vx0 = cx + side * 16.0
        vy0 = cy - 4.0
        dx_out = (xx - vx0) * side
        t_v = np.clip(dx_out / 92.0, 0.0, 1.0)
        # Exhaust trails flare diagonally outward and sweep downward/backward (+0.38 * dx)
        y_spine = vy0 + t_v * 34.0 + turb * (0.2 + 0.8 * t_v)
        half_thk = 5.5 + t_v * 16.0
        dy_v = np.abs(yy - y_spine) / half_thk
        in_x = (dx_out >= -4.0) & (dx_out <= 96.0)
        enter = np.clip((dx_out + 4.0) / 8.0, 0.0, 1.0)
        exit_f = np.clip(1.0 - (t_v ** 1.3), 0.0, 1.0)
        plume = np.exp(-(dy_v ** 1.75)) * enter * exit_f * (1.15 + 0.25 * (n1 + n2))
        vent += np.where(in_x, np.maximum(0.0, plume), 0.0)

    out = np.zeros((h, w, 4), dtype=np.uint8)
    # Pure fiery orange-gold-white gas palette (straight alpha RGB keeps orange hues warm down to faint tail!)
    r_v = np.clip(255.0 * np.minimum(1.0, vent * 1.9 + 0.12), 0, 255)
    g_v = np.clip(r_v * (0.48 + 0.44 * np.clip(vent - 0.15, 0.0, 1.0)), 0, 255)
    b_v = np.clip(220.0 * np.clip(vent - 0.72, 0.0, 1.0), 0, 255)
    out[..., 0] = r_v.astype(np.uint8)
    out[..., 1] = g_v.astype(np.uint8)
    out[..., 2] = b_v.astype(np.uint8)
    out[..., 3] = np.clip((vent ** 0.85) * 230.0, 0, 255).astype(np.uint8)

    p = os.path.join(ASSETS, "vfx-meteor-cheek-vents.png")
    Image.fromarray(out, mode="RGBA").save(p)
    return p


def build_meteor_t7_snout_fg():
    """Crop real Meteor dragon upper snout & brow (220x220 from [402:622, 0:220]), masked smoothly with nostril & eye embers."""
    dragon = Image.open(os.path.join(ASSETS, "core-meteor-t7.png")).convert("RGBA")
    # Exact crop so centerMuzzle (512, 34) sits at (110, 34) and muzzleL/muzzleR width = 220!
    crop = dragon.crop((402, 0, 622, 220))
    arr = np.array(crop).astype(np.float32)
    h, w, _ = arr.shape  # 220 x 220

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Tight smooth Gaussian mask keeping strictly the armored snout & brow scales centered at (110, 66)
    mask = np.exp(-(((xx - 110.0) / 26.0) ** 2 + ((yy - 66.0) / 36.0) ** 2))
    mask = np.clip((mask - 0.14) / 0.86, 0.0, 1.0)
    # Fade bottom neck smoothly so it seamlessly joins main dragon body below y=98
    mask *= np.clip((118.0 - yy) / 28.0, 0.0, 1.0)

    # Warm orange volcanic bounce light under snout edges (stronger near tip y=24..54)
    bounce = np.exp(-(((np.abs(xx - 110.0) - 14.0) / 9.0) ** 2 + ((yy - 44.0) / 18.0) ** 2)) * 0.58
    arr[..., 0] = np.clip(arr[..., 0] + bounce * 225.0, 0, 255)
    arr[..., 1] = np.clip(arr[..., 1] + bounce * 120.0, 0, 255)
    arr[..., 2] = np.clip(arr[..., 2] + bounce * 28.0, 0, 255)

    # Add soft volumetric glowing amber nostril flares (110 +- 12, y=40) & fierce glowing eyes (110 +- 22, y=68)
    heat = np.zeros((h, w), dtype=np.float32)
    for s in (-1.0, 1.0):
        nx, ny = 110.0 + s * 11.5, 40.0
        heat += np.exp(-(((xx - nx) / 5.5) ** 2 + ((yy - ny) / 7.5) ** 2)) * 1.10
        ex, ey = 110.0 + s * 21.0, 68.0
        heat += np.exp(-(((xx - ex) / 5.0) ** 2 + ((yy - ey) / 3.8) ** 2)) * 0.95

    arr[..., 0] = np.clip(arr[..., 0] + heat * 255.0, 0, 255)
    arr[..., 1] = np.clip(arr[..., 1] + heat * 185.0, 0, 255)
    arr[..., 2] = np.clip(arr[..., 2] + heat * 65.0, 0, 255)
    arr[..., 3] = np.clip(arr[..., 3] * mask + np.clip(heat * 190.0, 0, 255) * mask, 0, 255)

    p = os.path.join(ASSETS, "vfx-meteor-t7-snout-fg.png")
    Image.fromarray(arr.astype(np.uint8), mode="RGBA").save(p)
    return p


if __name__ == "__main__":
    s_path, c_path = rebuild_hornless_shield_barrier()
    print("Rebuilt", s_path)
    print("Closeup", c_path)
    for bp in build_meteor_breath_frames():
        print("Saved", bp)
    print("Saved", build_meteor_cheek_vents())
    print("Saved", build_meteor_t7_snout_fg())
