p = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\generate_studio_html.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Find the first occurrence of:
marker = "</html>\n'''"
pos = text.find(marker)
if pos != -1:
    fixed_text = text[:pos + len(marker)] + """

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully wrote {out_path} ({len(html_content)} bytes)")
"""
    with open(p, "w", encoding="utf-8") as f:
        f.write(fixed_text)
    print("Fixed generate_studio_html.py successfully!")
else:
    print("Marker not found!")
