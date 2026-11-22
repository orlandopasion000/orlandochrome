import os
from PIL import Image

record_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\recordings"
decomp_dir = os.path.join(record_dir, "decomp_reversal")
os.makedirs(decomp_dir, exist_ok=True)

for char in ["dynamo_vi", "helix_vi", "meteor_vi"]:
    gif_path = os.path.join(record_dir, f"Before_{char}_slow_reversal.gif")
    if os.path.exists(gif_path):
        im = Image.open(gif_path)
        print(f"Decompiling {gif_path}: {im.n_frames} frames")
        # Save frame 0 (start of reversal), frame n//2 (midpoint), frame -1 (end of reversal)
        im.seek(0)
        im.save(os.path.join(decomp_dir, f"{char}_rev_start.png"))
        im.seek(im.n_frames // 2)
        im.save(os.path.join(decomp_dir, f"{char}_rev_mid.png"))
        im.seek(im.n_frames - 1)
        im.save(os.path.join(decomp_dir, f"{char}_rev_end.png"))
        print(f"  Saved start, mid, end frames for {char}")
