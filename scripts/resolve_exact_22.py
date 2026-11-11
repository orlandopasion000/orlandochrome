import os
import re
import json
import subprocess
import winreg

ps_script = r'''
$sh = New-Object -ComObject WScript.Shell
$base = "$env:APPDATA\Microsoft\Internet Explorer\Quick Launch\User Pinned\ImplicitAppShortcuts"
Get-ChildItem -Path $base -Filter "*.lnk" -Recurse | ForEach-Object {
    $lnk = $sh.CreateShortcut($_.FullName)
    [PSCustomObject]@{
        FullName = $_.FullName
        Name = $_.Name
        AppDir = $_.Directory.Name
        TargetPath = $lnk.TargetPath
        Arguments = $lnk.Arguments
    }
} | ConvertTo-Json -Depth 3
'''

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
shortcuts = json.loads(res.stdout)
shortcut_by_hash = {s['AppDir'].lower(): s for s in shortcuts}

# Read Local State
local_state_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Local State')
with open(local_state_path, 'r', encoding='utf-8') as f:
    ls = json.load(f)
info_cache = ls.get('profile', {}).get('info_cache', {})

# Ordered hashes from FavoritesResolve:
ordered_items = [
    {"type": "taskbar", "lnk": "Google Chrome.lnk", "pdir": "Default"}
]

key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Taskband')
val, _ = winreg.QueryValueEx(key, 'FavoritesResolve')
raw = val.decode('latin1', errors='ignore')

matches = re.findall(r'ImplicitAppShortcuts\\([0-9a-fA-F]+)\\([A-Za-z0-9_\-\.\@\(\) ]+\.lnk)', raw)
for h, name in matches:
    ordered_items.append({"type": "implicit", "hash": h.lower(), "lnk": name})

print(f"Total resolved items: {len(ordered_items)}")

resolved_profiles = []

for idx, item in enumerate(ordered_items):
    chrome_no = idx + 1
    taskbar_slot = idx + 3
    win_shortcut = f"Win + {taskbar_slot}" if taskbar_slot <= 9 else f"Slot #{taskbar_slot}"

    if item['type'] == 'taskbar':
        pdir = "Default"
        lnk_name = "Google Chrome.lnk"
    else:
        h = item['hash']
        s = shortcut_by_hash.get(h)
        lnk_name = item['lnk']
        if s:
            args = s.get('Arguments', '')
            m = re.search(r'--profile-directory="?([^"\s]+(?:\s+[^"\s]+)*)"?', args)
            pdir = m.group(1).strip() if m else None
        else:
            pdir = None

    info = info_cache.get(pdir, {}) if pdir else {}
    name = info.get('name') or lnk_name.replace(' - Chrome.lnk', '')
    email = info.get('user_name', '')
    gaia = info.get('gaia_name', '')

    profile_obj = {
        "id": f"p_tb_{taskbar_slot}",
        "profileDir": pdir,
        "chromeNo": chrome_no,
        "taskbarSlot": taskbar_slot,
        "winShortcut": win_shortcut,
        "name": name,
        "email": email,
        "gaia": gaia,
        "lnkName": lnk_name,
        "timerUntil": None,
        "timerDurationMs": None,
        "isReset": False,
        "customAvatar": None,
        "notes": []
    }
    resolved_profiles.append(profile_obj)
    print(f"Slot {taskbar_slot:2d} | {win_shortcut:7s} | Chrome #{chrome_no:2d} | [{str(pdir):11s}] {name:38s} | {email}")

out_path = os.path.join(os.path.dirname(__file__), "resolved_22_taskbar_profiles.json")
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(resolved_profiles, f, indent=2)

print("\nSuccessfully saved resolved_22_taskbar_profiles.json!")
