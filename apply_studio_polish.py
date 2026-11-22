import os

studio_p = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"
with open(studio_p, "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

lines = text.split("\n")

# Replace drawEnhancedSkeletalRig
for i, l in enumerate(lines):
    if "function drawEnhancedSkeletalRig" in l:
        start_i = i
        for k in range(start_i, start_i + 35):
            if lines[k].strip() == "}":
                end_i = k
                break
        print(f"Replacing skeletal rig from line {start_i+1} to {end_i+1}")
        new_rig_lines = [
            "    function drawEnhancedSkeletalRig(tw, th, p) {",
            "      ctx.save();",
            "      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';",
            "      ctx.lineWidth = 2;",
            "",
            "      // Connecting bone lines",
            "      ctx.beginPath();",
            "      ctx.moveTo(0, -th * 0.28);",
            "      ctx.lineTo(0, 0);",
            "      ctx.lineTo(0, th * 0.24);",
            "      ctx.moveTo(-tw * 0.16, -th * 0.12);",
            "      ctx.lineTo(0, -th * 0.08);",
            "      ctx.lineTo(tw * 0.16, -th * 0.12);",
            "      ctx.stroke();",
            "",
            "      // Individual Joint Pivots (No connected polygon fill!)",
            "      const joints = [",
            "        [0, 0, 7, '#22c55e'],                   // Center Core",
            "        [0, -th * 0.28, 6, '#38bdf8'],          // Head / Neck",
            "        [-tw * 0.16, -th * 0.12, 5, '#38bdf8'], // Left Shoulder",
            "        [tw * 0.16, -th * 0.12, 5, '#38bdf8'],  // Right Shoulder",
            "        [0, th * 0.24, 5, '#38bdf8']            // Pelvis / Hips",
            "      ];",
            "      joints.forEach(([jx, jy, jr, col]) => {",
            "        ctx.beginPath();",
            "        ctx.arc(jx, jy, jr, 0, Math.PI * 2);",
            "        ctx.fillStyle = col;",
            "        ctx.fill();",
            "        ctx.strokeStyle = '#ffffff';",
            "        ctx.lineWidth = 1.5;",
            "        ctx.stroke();",
            "      });",
            "",
            "      ctx.restore();",
            "    }"
        ]
        lines = lines[:start_i] + new_rig_lines + lines[end_i+1:]
        break

# Replace drawTier5ReferenceGhost compositing
for i, l in enumerate(lines):
    if "function drawTier5ReferenceGhost" in l:
        print(f"Updating Tier V ghost at line {i+1}")
        for j in range(i, i+15):
            if "ctx.globalAlpha = 0.35;" in lines[j]:
                lines[j] = "      // Screen blend mode makes black background 100% transparent with zero dark box!\n      ctx.globalCompositeOperation = 'screen';\n      ctx.globalAlpha = 0.55;"
                print("Updated globalCompositeOperation and alpha!")
            if "filter" in lines[j] and "contrast" in lines[j]:
                lines[j] = "      ctx.filter = 'drop-shadow(0 0 18px rgba(251, 191, 36, 0.8)) contrast(1.25)';"
        break

with open(studio_p, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Studio HTML updated cleanly!")
