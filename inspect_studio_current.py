import os

output_html = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

# Read the current html structure as base reference
with open(output_html, "r", encoding="utf-8") as f:
    current_content = f.read()

print(f"Current HTML length: {len(current_content)} bytes")
