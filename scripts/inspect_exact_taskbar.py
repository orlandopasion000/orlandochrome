import winreg
import re
import json
import os

key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Taskband')
val, _ = winreg.QueryValueEx(key, 'FavoritesResolve')

local_state_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Local State')
with open(local_state_path, 'r', encoding='utf-8') as f:
    ls = json.load(f)
info_cache = ls.get('profile', {}).get('info_cache', {})

print(f"Total info_cache profiles: {len(info_cache)}")

# In FavoritesResolve, Windows stores PIDL / ShellLink structures
# Let's decode latin1 and utf-16le to find all strings
latin_str = val.decode('latin1', errors='ignore')

# Split by lnk headers or find all references
# Look for pattern of shortcut names
matches = re.findall(r'([A-Za-z0-9_\-\.\@ ]+\.lnk)', latin_str)
print(f"Found {len(matches)} lnk references in FavoritesResolve:")
for i, m in enumerate(matches):
    print(f"  {i+1}: {m}")

# Also look for profile directory references in binary
pdirs = re.findall(r'Profile \d+|Default', latin_str)
print(f"\nProfile directory mentions in raw: {len(pdirs)}")

# Now let's extract the actual command lines / arguments if present
args = re.findall(r'--profile-directory=([A-Za-z0-9_ ]+)', latin_str)
print(f"Arguments found: {len(args)}")
for i, a in enumerate(args):
    print(f"  {i+1}: {a}")
