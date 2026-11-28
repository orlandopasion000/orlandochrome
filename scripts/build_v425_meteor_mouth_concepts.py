import math
import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

ROOT = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
ASSETS = os.path.join(ROOT, "assets")
ARTIFACTS = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039"

W, H = 560, 700
DRAG_W, DRAG_H = 420, 280
DRAG_X = (W - DRAG_W) // 2
DRAG_Y = H - DRAG_H - 34
# Snout / mouth muzzle tip in card space (core-meteor-t7 anchor at center x=280, muzzle y=DRAG_Y+14)
MOUTH_X = W // 2
MOUTH_Y = DRAG_Y + 14


def load_assets():
    dragon = Image.open(os.path.join(ASSETS, "core-meteor-t7.png")).convert("RGBA").resize(
        (DRAG_W, DRAG_H), Image.Resampling.LANCZOS
    )
    flame_tex = Image.open(os.path.join(ASSETS, "vfx-nova-flame-meteor.png")).convert("RGBA")
    wisps_tex = Image.open(os.path.join(ASSETS, "vfx-nova-wisps-meteor.png")).convert("RGBA")
    corona_tex = Image.open(os.path.join(ASSETS, "vfx-nova-corona-meteor.png")).convert("RGBA")
    missile_tex = Image.open(os.path.join(ASSETS, "vfx-meteor-fire-missile.png")).convert("RGBA")
    return dragon, flame_tex, wisps_tex, corona_tex, missile_tex


def additive_blend(base_rgb_img, overlay_rgba):
    b = np.array(base_rgb_img).astype(np.float32)
    o = np.array(overlay_rgba).astype(np.float32)
    alpha = o[..., 3:4] / 255.0
    added = b[..., :3] + o[..., :3] * alpha
    over = np.maximum(0.0, added - 255.0)
    res_rgb = np.clip(added - over * 0.42, 0, 255)
    out = b.copy()
    out[..., :3] = res_rgb
    return Image.fromarray(out.astype(np.uint8), mode="RGBA")


def alpha_blend(base_rgba, overlay_rgba):
    return Image.alpha_composite(base_rgba.convert("RGBA"), overlay_rgba.convert("RGBA"))


def make_starfield_bg():
    rng = random.Random(425)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = 9.0 + 18.0 * np.exp(-(((yy - DRAG_Y) / 250.0) ** 2))
    g = 7.0 + 7.0 * np.exp(-(((yy - DRAG_Y) / 210.0) ** 2))
    b = 14.0 + 10.0 * np.exp(-(((xx - W * 0.5) / 250.0) ** 2))
    arr = np.zeros((H, W, 4), dtype=np.uint8)
    arr[..., 0] = np.clip(r, 0, 255).astype(np.uint8)
    arr[..., 1] = np.clip(g, 0, 255).astype(np.uint8)
    arr[..., 2] = np.clip(b, 0, 255).astype(np.uint8)
    arr[..., 3] = 255
    img = Image.fromarray(arr, mode="RGBA")
    draw = ImageDraw.Draw(img)
    for _ in range(95):
        sx = rng.randint(8, W - 8)
        sy = rng.randint(55, H - 15)
        br = rng.randint(70, 200)
        sz = 1 if rng.random() < 0.8 else 2
        draw.rectangle([sx, sy, sx + sz - 1, sy + sz - 1], fill=(br, int(br * 0.92), int(br * 0.85), 255))
    return img


def warp_texture_continuous(tex_img, y_top, y_bot, hw_bot, hw_top, twist=0.0, opacity=1.0, pinch_pow=0.78):
    """Continuously warp a fire texture along a tapering/expanding dragon-breath cone (ZERO strip seams!)."""
    src = np.array(tex_img).astype(np.float32)
    sh, sw, _ = src.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    span = max(1.0, float(y_bot - y_top))
    t = (y_bot - yy) / span  # 0 at mouth nozzle -> 1 at upper flame tip
    in_y = (t >= 0.0) & (t <= 1.0)
    t_clamped = np.clip(t, 0.0, 1.0)

    hw = hw_bot + (hw_top - hw_bot) * (t_clamped ** pinch_pow)
    center_x = MOUTH_X + np.sin(t_clamped * math.pi * 4.5) * twist * (t_clamped ** 0.9)

    u = (xx - center_x) / (2.0 * np.maximum(hw, 2.0)) + 0.5
    v = 1.0 - t_clamped

    in_x = (u >= 0.0) & (u <= 1.0)
    valid = in_y & in_x

    coords_y = np.clip(v * (sh - 1.0), 0.0, sh - 1.0)
    coords_x = np.clip(u * (sw - 1.0), 0.0, sw - 1.0)

    out = np.zeros((H, W, 4), dtype=np.float32)
    for ch in range(4):
        sampled = map_coordinates(src[..., ch], [coords_y, coords_x], order=1, mode="constant", cval=0.0)
        out[..., ch] = sampled

    # Smooth nozzle taper & tip fade so there are zero hard entry/exit edges
    fade_bot = np.clip(t_clamped / 0.04, 0.0, 1.0)
    fade_top = np.clip((1.0 - t_clamped) / 0.24, 0.0, 1.0) ** 1.1
    fade_x = np.clip(1.0 - ((np.abs(u - 0.5) * 2.0) ** 3.2), 0.0, 1.0)
    mask = np.where(valid, fade_bot * fade_top * fade_x * opacity, 0.0)

    out[..., 3] = np.clip(out[..., 3] * mask, 0.0, 255.0)
    return Image.fromarray(out.astype(np.uint8), mode="RGBA")


def render_turbulent_fire_plume(
    w_top, w_bot, y_top, y_bot, seed, twist=0.0, shock_diamonds=0, dual_fang=False, heat_boost=1.0, hollow_jaw_v=False
):
    """Synthesize multi-octave turbulent blackbody thermal fire emerging from a narrow mouth opening."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rng = np.random.default_rng(seed)
    n1 = gaussian_filter(rng.normal(0.0, 1.0, (H, W)).astype(np.float32), sigma=(16.0, 8.0))
    n2 = gaussian_filter(rng.normal(0.0, 1.0, (H, W)).astype(np.float32), sigma=(7.5, 4.0))
    n3 = gaussian_filter(rng.normal(0.0, 1.0, (H, W)).astype(np.float32), sigma=(2.6, 1.8))
    turb = (n1 * 2.2 + n2 * 1.4 + n3 * 0.7) * 13.0

    span = max(1.0, float(y_bot - y_top))
    t = np.clip((y_bot - yy) / span, 0.0, 1.0)
    in_y = (yy >= y_top) & (yy <= y_bot + 16.0)

    hw = w_bot + (w_top - w_bot) * (t ** 0.82)
    center_x = MOUTH_X + np.sin(t * math.pi * 4.8) * twist * (t ** 0.85) if twist != 0.0 else float(MOUTH_X)

    if dual_fang:
        # Two crisp streams emerging out of left/right corners of the snout jaw (dx = +-14px -> merging at t=0.28)
        sep = 14.0 * np.exp(-t * 4.5)
        d1 = np.abs(xx - (center_x - sep) + turb * (0.14 + 0.85 * t)) / np.maximum(hw * 0.56, 3.0)
        d2 = np.abs(xx - (center_x + sep) + turb * (0.14 + 0.85 * t) * 0.9) / np.maximum(hw * 0.56, 3.0)
        radial = np.minimum(d1, d2)
    else:
        radial = np.abs(xx - center_x + turb * (0.12 + 0.88 * t)) / np.maximum(hw, 3.0)

    # Tight nozzle entrance at y_bot (prevents ballooning over neck!)
    v_env = np.where(
        yy > y_bot,
        np.exp(-(((yy - y_bot) / 6.5) ** 2)) * 0.85,
        np.clip(1.0 - (t ** 1.65), 0.0, 1.0),
    )
    throat_pinch = 1.0 + 0.65 * np.exp(-(((yy - (y_bot - 10.0)) / 18.0) ** 2))

    temp = np.exp(-((radial) ** 1.70)) * v_env * throat_pinch * heat_boost * (1.0 + 0.16 * (n2 * 2.4 + n3 * 1.4))

    if shock_diamonds > 0:
        ring_freq = shock_diamonds * math.pi
        diamonds = (
            (np.maximum(0.0, np.cos(t * ring_freq)) ** 4)
            * np.exp(-((np.abs(xx - MOUTH_X) / (hw * 0.45 + 3.0)) ** 2))
            * np.clip(1.0 - t * 0.85, 0.0, 1.0)
            * np.clip(t / 0.08, 0.0, 1.0)
        )
        temp += diamonds * 1.25

    temp = np.where(in_y, np.maximum(0.0, temp), 0.0)

    r = np.clip(temp * 520.0, 0, 255)
    g = np.clip((temp - 0.20) * 380.0, 0, 255)
    b = np.clip((temp - 0.62) * 310.0, 0, 255)
    alpha = np.clip((temp ** 0.72) * 245.0, 0, 255)

    arr = np.zeros((H, W, 4), dtype=np.uint8)
    arr[..., 0] = r.astype(np.uint8)
    arr[..., 1] = g.astype(np.uint8)
    arr[..., 2] = b.astype(np.uint8)
    arr[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(arr, mode="RGBA")


def overlay_sculpted_dragon_head(card, style="open_maw", eye_color=(255, 215, 90)):
    """Soft photorealistic head/snout occlusion, nostril embers & glowing brow eyes on real dragon art (zero flat polygons)."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    mx, my = float(MOUTH_X), float(DRAG_Y + 14)

    if style == "foreground_snout":
        # Option B: Re-composite the REAL painted upper dragon snout/nasal tip cleanly ABOVE the flame root
        # so the fire visibly blasts out from UNDERNEATH the snout jaw + side cheek vents!
        dragon_real = Image.open(os.path.join(ASSETS, "core-meteor-t7.png")).convert("RGBA").resize(
            (DRAG_W, DRAG_H), Image.Resampling.LANCZOS
        )
        d_full = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d_full.paste(dragon_real, (DRAG_X, DRAG_Y), dragon_real)
        d_arr = np.array(d_full).astype(np.float32)
        # Keep tight Gaussian mask over upper snout & brow (dx=+-11, dy=+2..+32 from nose tip)
        snout_mask = np.exp(-(((xx - mx) / 10.5) ** 2 + ((yy - (my + 17.0)) / 14.0) ** 2))
        snout_mask = np.clip((snout_mask - 0.12) / 0.88, 0.0, 1.0)
        # Warm orange bounce light under snout edges
        rim = np.exp(-(((np.abs(xx - mx) - 7.0) / 3.5) ** 2 + ((yy - (my + 10.0)) / 9.0) ** 2)) * 0.65
        d_arr[..., 0] = np.clip(d_arr[..., 0] + rim * 220.0, 0, 255)
        d_arr[..., 1] = np.clip(d_arr[..., 1] + rim * 125.0, 0, 255)
        d_arr[..., 3] = np.clip(d_arr[..., 3] * snout_mask, 0, 255)
        card = alpha_blend(card, Image.fromarray(d_arr.astype(np.uint8), mode="RGBA"))

    # Add soft volumetric nostril embers & glowing dragon brow eyes (smooth Gaussian falloff, never flat circles!)
    heat = np.zeros((H, W), dtype=np.float32)
    for s in (-1.0, 1.0):
        # Nostril flare near tip of snout
        nx, ny = mx + s * 5.5, my + 2.5
        heat += np.exp(-(((xx - nx) / 3.4) ** 2 + ((yy - ny) / 4.2) ** 2)) * 1.15
        # Glowing dragon eye slightly further back along jaw ridge
        ex, ey = mx + s * 10.5, my + 16.0
        heat += np.exp(-(((xx - ex) / 3.2) ** 2 + ((yy - ey) / 2.2) ** 2)) * 1.05

    arr = np.zeros((H, W, 4), dtype=np.uint8)
    arr[..., 0] = np.clip(heat * eye_color[0], 0, 255).astype(np.uint8)
    arr[..., 1] = np.clip(heat * eye_color[1], 0, 255).astype(np.uint8)
    arr[..., 2] = np.clip(heat * eye_color[2], 0, 255).astype(np.uint8)
    arr[..., 3] = np.clip(heat * 210.0, 0, 255).astype(np.uint8)
    return additive_blend(card, Image.fromarray(arr, mode="RGBA"))


def add_neck_and_jaw_lighting(card, radius_x=45, radius_y=36, intensity=0.55):
    """Add rich warm volcanic rim light over the dragon's neck, shoulders, and snout."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx = (xx - MOUTH_X) / radius_x
    dy = (yy - (MOUTH_Y + 28.0)) / radius_y
    heat = np.exp(-(dx * dx + dy * dy)) * intensity
    arr = np.zeros((H, W, 4), dtype=np.uint8)
    arr[..., 0] = np.clip(heat * 260.0, 0, 255).astype(np.uint8)
    arr[..., 1] = np.clip((heat - 0.12) * 180.0, 0, 255).astype(np.uint8)
    arr[..., 2] = np.clip((heat - 0.55) * 140.0, 0, 255).astype(np.uint8)
    arr[..., 3] = np.clip(heat * 200.0, 0, 255).astype(np.uint8)
    return additive_blend(card, Image.fromarray(arr, mode="RGBA"))


def add_ember_sparks(card, seed, count=48, spread_top=85, y_top=74, y_bot=MOUTH_Y + 4):
    rng = random.Random(seed)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        t = rng.uniform(0.04, 0.98)
        y = y_bot - t * (y_bot - y_top)
        x = MOUTH_X + rng.gauss(0.0, 8.0 + spread_top * t * 0.52)
        length = rng.uniform(6.0, 17.0) * (1.0 - 0.4 * t)
        a = int(235 * (1.0 - t * 0.65))
        draw.line([(x, y), (x + rng.uniform(-3, 3), y - length)], fill=(255, rng.randint(120, 225), rng.randint(25, 95), a), width=rng.choice([1, 2]))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.5))
    return additive_blend(card, overlay)


def draw_header_badge(card, letter, title, subtitle):
    draw = ImageDraw.Draw(card)
    draw.rectangle([0, 0, W, 68], fill=(12, 10, 16, 238))
    draw.line([0, 68, W, 68], fill=(245, 158, 11, 190), width=2)
    try:
        f_big = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
        f_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
    except Exception:
        f_big = ImageFont.load_default()
        f_sub = ImageFont.load_default()
    draw.text((18, 11), f"OPTION {letter}: {title}", fill=(255, 224, 140, 255), font=f_big)
    draw.text((18, 41), subtitle, fill=(210, 214, 224, 235), font=f_sub)
    return card


def draw_small_side_missiles(card, missile_tex):
    for sx in (MOUTH_X - 46, MOUTH_X + 46):
        m = missile_tex.resize((22, 64), Image.Resampling.LANCZOS)
        card.paste(m, (sx - 11, DRAG_Y + 6), m)
    return card


def generate_all():
    dragon, flame_tex, wisps_tex, corona_tex, missile_tex = load_assets()
    options = []

    # OPTION A: Sculpted Parted Fangs + Narrow Throat Furnace Nozzle -> Wide Cone
    cA = make_starfield_bg()
    cA.paste(dragon, (DRAG_X, DRAG_Y), dragon)
    cA = draw_small_side_missiles(cA, missile_tex)
    cA = add_neck_and_jaw_lighting(cA, radius_x=42, radius_y=34, intensity=0.45)
    fA = warp_texture_continuous(flame_tex, y_top=74, y_bot=MOUTH_Y + 2, hw_bot=9, hw_top=68, opacity=0.92, pinch_pow=0.72)
    wA = warp_texture_continuous(wisps_tex, y_top=74, y_bot=MOUTH_Y + 2, hw_bot=11, hw_top=78, opacity=0.82, pinch_pow=0.80)
    pA = render_turbulent_fire_plume(w_top=56, w_bot=7, y_top=76, y_bot=MOUTH_Y + 3, seed=101, heat_boost=1.05)
    cA = additive_blend(cA, fA)
    cA = additive_blend(cA, wA)
    cA = additive_blend(cA, pA)
    cA = overlay_sculpted_dragon_head(cA, style="open_maw")
    cA = add_ember_sparks(cA, seed=201, count=42, spread_top=66, y_top=78, y_bot=MOUTH_Y)
    cA = draw_header_badge(cA, "A", "Parted-Fang Throat Cone", "Sculpted open fangs + narrow throat nozzle -> roaring inferno cone")
    options.append(("A", cA))

    # OPTION B: Foreground Snout Bridge + Cheek Afterburner Vents + Mach Shock Diamonds
    cB = make_starfield_bg()
    cB.paste(dragon, (DRAG_X, DRAG_Y), dragon)
    cB = draw_small_side_missiles(cB, missile_tex)
    # Draw flame slightly behind upper nasal bridge tip, plus swept cheek exhaust vents!
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    vent = np.zeros((H, W), dtype=np.float32)
    for side in (-1.0, 1.0):
        vx0, vy0 = MOUTH_X + side * 12.0, MOUTH_Y + 18.0
        t_v = np.clip((xx - vx0) * side / 38.0, 0.0, 1.0)
        dy_v = np.abs((yy - (vy0 + t_v * 15.0))) / (5.5 + t_v * 10.0)
        in_x = ((xx - vx0) * side >= 0.0) & ((xx - vx0) * side <= 40.0)
        vent += np.where(in_x, np.exp(-dy_v * dy_v) * (1.0 - t_v ** 1.35) * 1.15, 0.0)
    varr = np.zeros((H, W, 4), dtype=np.uint8)
    varr[..., 0] = np.clip(vent * 280.0, 0, 255).astype(np.uint8)
    varr[..., 1] = np.clip((vent - 0.15) * 230.0, 0, 255).astype(np.uint8)
    varr[..., 2] = np.clip((vent - 0.65) * 210.0, 0, 255).astype(np.uint8)
    varr[..., 3] = np.clip(vent * 230.0, 0, 255).astype(np.uint8)
    cB = additive_blend(cB, Image.fromarray(varr, mode="RGBA"))
    fB = warp_texture_continuous(flame_tex, y_top=72, y_bot=MOUTH_Y + 4, hw_bot=10, hw_top=46, opacity=0.90, pinch_pow=0.80)
    wB = warp_texture_continuous(wisps_tex, y_top=72, y_bot=MOUTH_Y + 4, hw_bot=12, hw_top=52, opacity=0.72, pinch_pow=0.85)
    pB = render_turbulent_fire_plume(w_top=38, w_bot=9, y_top=74, y_bot=MOUTH_Y + 5, seed=102, shock_diamonds=5, heat_boost=1.18)
    cB = additive_blend(cB, fB)
    cB = additive_blend(cB, wB)
    cB = additive_blend(cB, pB)
    # Paint dragon snout bridge ON TOP of jet origin so depth shows flame pouring from UNDER nostrils/mouth!
    cB = overlay_sculpted_dragon_head(cB, style="foreground_snout", eye_color=(255, 240, 140))
    cB = add_neck_and_jaw_lighting(cB, radius_x=52, radius_y=40, intensity=0.42)
    cB = draw_header_badge(cB, "B", "Cheek-Vent Afterburner Spear", "Snout in foreground + jaw exhaust vents + 5 Mach shock diamonds")
    options.append(("B", cB))

    # OPTION C: Helical Crimson-Amber Dragon Breath + Whole-Neck Volcanic Glow
    cC = make_starfield_bg()
    cC.paste(dragon, (DRAG_X, DRAG_Y), dragon)
    cC = draw_small_side_missiles(cC, missile_tex)
    cC = add_neck_and_jaw_lighting(cC, radius_x=72, radius_y=58, intensity=0.78)
    fC = warp_texture_continuous(flame_tex, y_top=74, y_bot=MOUTH_Y + 4, hw_bot=11, hw_top=60, twist=15.0, opacity=0.92, pinch_pow=0.76)
    wC = warp_texture_continuous(wisps_tex, y_top=74, y_bot=MOUTH_Y + 4, hw_bot=14, hw_top=74, twist=-14.0, opacity=1.05, pinch_pow=0.82)
    pC = render_turbulent_fire_plume(w_top=50, w_bot=10, y_top=76, y_bot=MOUTH_Y + 6, seed=103, twist=12.0, heat_boost=1.12)
    cC = additive_blend(cC, fC)
    cC = additive_blend(cC, wC)
    cC = additive_blend(cC, pC)
    cC = overlay_sculpted_dragon_head(cC, style="open_maw", eye_color=(255, 110, 40))
    cC = add_ember_sparks(cC, seed=203, count=56, spread_top=80, y_top=76, y_bot=MOUTH_Y)
    cC = draw_header_badge(cC, "C", "Helical Breath & Maw Rimlight", "Twisting counter-spiral fire ribbons + fiery neck/scale illumination")
    options.append(("C", cC))

    # OPTION D: Twin Fang-Corner Magma Streams Converging Upward
    cD = make_starfield_bg()
    cD.paste(dragon, (DRAG_X, DRAG_Y), dragon)
    cD = draw_small_side_missiles(cD, missile_tex)
    cD = add_neck_and_jaw_lighting(cD, radius_x=48, radius_y=38, intensity=0.52)
    fD = warp_texture_continuous(flame_tex, y_top=74, y_bot=MOUTH_Y + 2, hw_bot=16, hw_top=56, opacity=0.88, pinch_pow=0.82)
    wD = warp_texture_continuous(wisps_tex, y_top=74, y_bot=MOUTH_Y + 2, hw_bot=18, hw_top=64, opacity=0.80, pinch_pow=0.85)
    pD = render_turbulent_fire_plume(w_top=44, w_bot=15, y_top=74, y_bot=MOUTH_Y + 6, seed=104, dual_fang=True, heat_boost=1.16)
    cD = additive_blend(cD, fD)
    cD = additive_blend(cD, wD)
    cD = additive_blend(cD, pD)
    cD = overlay_sculpted_dragon_head(cD, style="dual_fang", eye_color=(255, 225, 100))
    cD = add_ember_sparks(cD, seed=204, count=38, spread_top=58, y_top=76, y_bot=MOUTH_Y)
    cD = draw_header_badge(cD, "D", "Dual-Fang Convergence Jet", "Twin molten jaw streams parting around nose tip -> unified column")
    options.append(("D", cD))

    # OPTION E: Compressed Solar-Furnace Bite + Muzzle Shockwave Ring
    cE = make_starfield_bg()
    cE.paste(dragon, (DRAG_X, DRAG_Y), dragon)
    cE = draw_small_side_missiles(cE, missile_tex)
    cE = add_neck_and_jaw_lighting(cE, radius_x=52, radius_y=40, intensity=0.58)
    cor_sz = 84
    cor_crop = corona_tex.resize((cor_sz, cor_sz), Image.Resampling.LANCZOS)
    cE_cor = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cE_cor.paste(cor_crop, (MOUTH_X - cor_sz // 2, MOUTH_Y - 12 - cor_sz // 2), cor_crop)
    cE = additive_blend(cE, cE_cor)
    ring_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rdraw = ImageDraw.Draw(ring_img)
    rdraw.ellipse([MOUTH_X - 48, MOUTH_Y - 22, MOUTH_X + 48, MOUTH_Y - 4], outline=(255, 195, 85, 210), width=4)
    rdraw.ellipse([MOUTH_X - 46, MOUTH_Y - 21, MOUTH_X + 46, MOUTH_Y - 5], outline=(255, 250, 225, 215), width=2)
    ring_img = ring_img.filter(ImageFilter.GaussianBlur(radius=1.2))
    cE = additive_blend(cE, ring_img)
    fE = warp_texture_continuous(flame_tex, y_top=72, y_bot=MOUTH_Y - 2, hw_bot=9, hw_top=56, opacity=0.92, pinch_pow=0.76)
    wE = warp_texture_continuous(wisps_tex, y_top=72, y_bot=MOUTH_Y - 2, hw_bot=11, hw_top=64, opacity=0.88, pinch_pow=0.82)
    pE = render_turbulent_fire_plume(w_top=46, w_bot=8, y_top=74, y_bot=MOUTH_Y, seed=105, heat_boost=1.18)
    cE = additive_blend(cE, fE)
    cE = additive_blend(cE, wE)
    cE = additive_blend(cE, pE)
    cE = overlay_sculpted_dragon_head(cE, style="ember_cavity", eye_color=(255, 245, 180))
    cE = add_ember_sparks(cE, seed=205, count=46, spread_top=64, y_top=74, y_bot=MOUTH_Y - 2)
    cE = draw_header_badge(cE, "E", "Solar Bite Corona + Shock Ring", "Parted dark fangs biting an incandescent core + forward heat ring")
    options.append(("E", cE))

    for letter, card in options:
        p = os.path.join(ARTIFACTS, f"v425_meteor_mouth_opt_{letter}.png")
        card.convert("RGB").save(p, quality=95)
        print("Saved", p)

    pad = 16
    sheet_w = pad + 5 * (W + pad)
    sheet_h = H + 2 * pad
    sheet = Image.new("RGB", (sheet_w, sheet_h), (8, 8, 12))
    for i, (letter, card) in enumerate(options):
        sheet.paste(card.convert("RGB"), (pad + i * (W + pad), pad))
    sheet_path = os.path.join(ARTIFACTS, "v425_meteor_mouth_5_options_sheet.png")
    sheet.save(sheet_path, quality=94)
    print("Saved", sheet_path)


if __name__ == "__main__":
    generate_all()
