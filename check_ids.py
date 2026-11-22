import re

with open(r'C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html', 'r', encoding='utf-8') as f:
    content = f.read()

ids_in_js = set(re.findall(r"document\.getElementById\(['\"](.*?)['\"]\)", content))
ids_in_html = set(re.findall(r"id=['\"](.*?)['\"]", content))

missing = ids_in_js - ids_in_html
print('IDs referenced in JS but missing in HTML:', missing)
