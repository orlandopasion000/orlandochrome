"""Encode high-quality looping 3D animated GIFs for all 3 Tier VI models + keyframe contact sheet."""
import glob
import os
from PIL import Image, ImageDraw

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRAMES_ROOT = os.path.join(ROOT_DIR, "scratch", "gif_frames")
ARTIFACT_DIR = r"C:\Users\Orlando\.gemini\antigravity\brain\15adc93a-4633-48b3-91ab-72d7cbd3f039"

OUT_NAMES = {
    "meteor": "meteor_dragon_tier6_3d.gif",
    "helix": "helix_unicorn_tier6_3d.gif",
    "dynamo": "dynamo_princess_tier6_3d.gif",
}


def main():
    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    sheet = Image.new("RGB", (320 * 3, 240 * 3 + 36), (8, 10, 20))
    sdraw = ImageDraw.Draw(sheet)

    for r_idx, (mode, gif_name) in enumerate(OUT_NAMES.items()):
        fpaths = sorted(glob.glob(os.path.join(FRAMES_ROOT, mode, "frame_*.png")))
        assert len(fpaths) >= 30, f"Missing frames for {mode}: {len(fpaths)}"
        rgb_frames = [Image.open(p).convert("RGB") for p in fpaths]

        # Build shared adaptive 256-color palette from representative frames (idle left bank, right bank, firing)
        fw, fh = rgb_frames[0].size
        sample_strip = Image.new("RGB", (fw * 3, fh))
        sample_strip.paste(rgb_frames[6], (0, 0))
        sample_strip.paste(rgb_frames[19], (fw, 0))
        sample_strip.paste(rgb_frames[29], (fw * 2, 0))
        pal_img = sample_strip.quantize(colors=256, method=Image.Quantize.FASTOCTREE)

        quant_frames = [
            fr.quantize(palette=pal_img, dither=Image.Dither.FLOYDSTEINBERG)
            for fr in rgb_frames
        ]

        out_path = os.path.join(ARTIFACT_DIR, gif_name)
        quant_frames[0].save(
            out_path,
            save_all=True,
            append_images=quant_frames[1:],
            duration=45,
            loop=0,
            optimize=True,
        )
        size_kb = os.path.getsize(out_path) / 1024.0
        print(f"Saved {out_path} ({len(quant_frames)} frames, {size_kb:.1f} KB)")

        # Add 3 keyframes (Left 3D Bank Idle, Right 3D Bank Idle, Active Weapon Burst) to contact sheet
        row_y = 28 + r_idx * 240
        for c_idx, (lbl, f_idx) in enumerate((
            (f"{mode.upper()} 3D Bank L (Idle)", 6),
            (f"{mode.upper()} 3D Bank R (Idle)", 19),
            (f"{mode.upper()} Firing Burst", 29),
        )):
            thumb = rgb_frames[f_idx].resize((308, 212), Image.Resampling.LANCZOS)
            x0 = c_idx * 320
            sheet.paste(thumb, (x0 + 6, row_y + 22))
            sdraw.text((x0 + 10, row_y + 4), lbl, fill=(220, 238, 255))

    sheet_path = os.path.join(ROOT_DIR, "scratch", "tier6_3d_keyframes.png")
    sheet.save(sheet_path)
    print("Saved keyframe verification sheet:", sheet_path)


if __name__ == "__main__":
    main()
