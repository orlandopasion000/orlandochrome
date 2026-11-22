import os
import numpy as np
from PIL import Image

base_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center"
char_dir = os.path.join(base_dir, "assets", "characters")

for char in ["dynamo_vi", "helix_vi", "meteor_vi"]:
    im = Image.open(os.path.join(char_dir, f"{char}.png"))
    w, h = im.size
    print(f"{char}: size {w}x{h}, mode {im.mode}")
