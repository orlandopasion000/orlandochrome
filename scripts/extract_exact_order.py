import os
import re
import json
import winreg

key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Taskband')
val, _ = winreg.QueryValueEx(key, 'FavoritesResolve')

# In FavoritesResolve, paths look like:
# ...\ImplicitAppShortcuts\<hash>\<name>.lnk
# Let's find every occurrence of ImplicitAppShortcuts\<hash>\<file>.lnk or similar!
raw = val.decode('latin1', errors='ignore')

matches = re.findall(r'ImplicitAppShortcuts\\([0-9a-fA-F]+)\\([A-Za-z0-9_\-\.\@\(\) ]+\.lnk)', raw)
print(f"Total ImplicitAppShortcuts matches in FavoritesResolve: {len(matches)}")
for i, (h, name) in enumerate(matches):
    print(f"  {i+1}: hash={h} | name={name}")

# Also check for direct User Pinned\TaskBar shortcuts:
pinned_matches = re.findall(r'User Pinned\\TaskBar\\([A-Za-z0-9_\-\.\@\(\) ]+\.lnk)', raw)
print(f"\nUser Pinned TaskBar matches: {len(pinned_matches)}")
for i, name in enumerate(pinned_matches):
    print(f"  {i+1}: {name}")
