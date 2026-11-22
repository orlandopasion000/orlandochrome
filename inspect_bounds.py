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
    print(f"--- {char} (shape {w}x{h}) ---")
    
    # Bounding box of non-transparent pixels
    ys, xs = np.where(alpha > 30)
    print(f"  Content bounds: X [{xs.min()}, {xs.max()}], Y [{ys.min()}, {ys.max()}]")
    
    # Brightest core region in center
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    sub = lum * (alpha > 100)
    thresh = np.percentile(sub[alpha > 100], 98)
    cy, cx = np.where(sub >= thresh)
    print(f"  Detected Core Center: X={int(np.mean(cx))}, Y={int(np.mean(cy))}")
