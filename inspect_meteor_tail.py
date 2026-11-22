import os
import numpy as np
from PIL import Image

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")

for tier in ["vi", "vii", "viii", "ix", "x"]:
    path = os.path.join(char_dir, f"meteor_{tier}.png")
    im = Image.open(path)
    arr = np.array(im)
    h, w, _ = arr.shape
    alpha = arr[:, :, 3]
    
    # Check lower left quadrant: Y > h*0.5, X < w*0.35
    ys, xs = np.where((alpha > 50) & (np.arange(h)[:, None] > int(h * 0.55)) & (np.arange(w)[None, :] < int(w * 0.35)))
    if len(xs) > 0:
        print(f"meteor_{tier} tail mace bounds: X [{xs.min()}, {xs.max()}], Y [{ys.min()}, {ys.max()}] (Center: X={int(np.mean(xs))}, Y={int(np.mean(ys))})")
    else:
        print(f"meteor_{tier} no tail detected in lower-left")
