import os
import numpy as np
from PIL import Image

record_dir = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\recordings\decomp_reversal"

for char in ["dynamo_vi", "helix_vi", "meteor_vi"]:
    for phase in ["start", "mid", "end"]:
        p = os.path.join(record_dir, f"{char}_rev_{phase}.png")
        im = Image.open(p)
        print(f"{char}_{phase}: size {im.size}")
