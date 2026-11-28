"""Build photorealistic 256x384 transparent RGBA blazing Solar-Magma Meteor Fire-Missile
from real painted fluid-fire sheets (ZERO cartoon triangles, ZERO step seams).
"""
import pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
ASSETS = ROOT / "assets"


def main():
    W, H = 256, 384
    flame_src = Image.open(ASSETS / "vfx-nova-flame-meteor.png").convert("RGBA")
    wisp_src = Image.open(ASSETS / "vfx-nova-wisps-meteor.png").convert("RGBA")

    fl_arr = np.asarray(flame_src.resize((W, H), Image.Resampling.LANCZOS), dtype=np.float32)
    ws_arr = np.asarray(wisp_src.resize((W, H), Image.Resampling.LANCZOS), dtype=np.float32)

    yy, xx = np.mgrid[0:H, 0:W]
    cx = (W - 1) * 0.5

    # Smooth C1 continuous supersonic roaring flame envelope (zero jumps!)
    u_nose = np.clip((yy - 28.0) / 72.0, 0.0, 1.0)
    u_tail = np.clip((yy - 80.0) / (H - 88.0), 0.0, 1.0)
    nose_env = np.sin(u_nose * MathPiHalf) if False else np.sin(u_nose * np.pi * 0.5)
    tail_env = np.power(np.maximum(0.0, 1.0 - u_tail), 0.78)
    half_w = (12.0 + 52.0 * nose_env) * np.where(yy < 80.0, 1.0, tail_env)
    turb = 1.0 + 0.16 * np.sin(yy * 0.095 + xx * 0.03) + 0.09 * np.cos(yy * 0.17 - xx * 0.05)

    dist_x = np.abs(xx - cx) / np.maximum(2.0, half_w * turb)
    plume_mask = np.clip((1.0 - np.square(dist_x)) * 1.45, 0.0, 1.0)
    top_fade = np.clip((yy - 24.0) / 28.0, 0.0, 1.0)
    bot_fade = np.clip((H - 8.0 - yy) / 72.0, 0.0, 1.0)
    env = (plume_mask * top_fade * bot_fade).astype(np.float32)

    # Rich photographic fire blend with vivid fiery orange-gold-crimson core
    comb_rgb = np.clip(fl_arr[:, :, :3] * 0.60 + ws_arr[:, :, :3] * 0.62, 0, 255)
    comb_rgb[:, :, 0] = np.clip(comb_rgb[:, :, 0] * 1.08, 0, 255)
    comb_rgb[:, :, 1] = np.clip(comb_rgb[:, :, 1] * (0.98 - u_tail * 0.44), 0, 255)
    comb_rgb[:, :, 2] = np.clip(comb_rgb[:, :, 2] * (0.72 - u_tail * 0.62), 0, 255)
    comb_a = np.clip((fl_arr[:, :, 3] * 0.78 + ws_arr[:, :, 3] * 0.58) * env * 1.35, 0, 255)
    plume_im = Image.fromarray(np.dstack([comb_rgb, comb_a]).astype(np.uint8), "RGBA")

    # Sculpted Spherical Solar-Gold & Magma Warhead Core nestled smoothly inside the flame head (y = 84)
    wy = 84.0
    dx_w = (xx - cx) / 34.0
    dy_w = (yy - wy) / 40.0  # slight sleek aerodynamic prolate taper
    d_w = np.hypot(dx_w, dy_w)
    core_g = np.exp(-np.square(d_w / 0.58))
    mid_g = np.exp(-np.square(d_w / 0.92))
    rim_arc = np.exp(-np.square((yy - (wy - 22.0)) / 12.0)) * np.exp(-np.square((xx - cx) / 28.0))

    war = np.zeros((H, W, 4), dtype=np.float32)
    war[:, :, 0] = np.clip(255.0 * mid_g + 40.0 * core_g, 0, 255)
    war[:, :, 1] = np.clip(140.0 * mid_g + 115.0 * core_g + 40.0 * rim_arc, 0, 255)
    war[:, :, 2] = np.clip(25.0 * mid_g + 195.0 * core_g + 85.0 * rim_arc, 0, 255)
    war[:, :, 3] = np.clip((mid_g * 225.0 + core_g * 255.0 + rim_arc * 165.0), 0, 255)
    war_im = Image.fromarray(war.astype(np.uint8), "RGBA")

    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(plume_im)
    out.alpha_composite(war_im)

    out_path = ASSETS / "vfx-meteor-fire-missile.png"
    out.save(out_path, optimize=True)
    print(f"SAVED -> {out_path} ({out.width}x{out.height})")


if __name__ == "__main__":
    main()
