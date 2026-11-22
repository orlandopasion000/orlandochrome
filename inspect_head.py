import os
import numpy as np
from PIL import Image

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")

for char in ["dynamo_vi", "helix_vi", "meteor_vi"]:
    path = os.path.join(char_dir, f"{char}.png")
    im = Image.open(path)
    arr = np.array(im)
    h, w, _ = arr.shape
    alpha = arr[:, :, 3]
    
    # Upper region (Y < 250)
    ys, xs = np.where((alpha > 50) & (np.arange(h)[:, None] < 260) & (np.arange(w)[None, :] > 350) & (np.arange(w)[None, :] < 650))
    print(f"{char}: Upper central region X mean={int(np.mean(xs))}, Y mean={int(np.mean(ys))}")
