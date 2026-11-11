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
        TargetPath = $lnk.TargetPath
        Arguments = $lnk.Arguments
    }
} | ConvertTo-Json -Depth 3
'''

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
shortcuts = json.loads(res.stdout)

# Read Local State
local_state_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Local State')
with open(local_state_path, 'r', encoding='utf-8') as f:
    ls = json.load(f)
info_cache = ls.get('profile', {}).get('info_cache', {})

shortcut_by_pdir = {}
shortcut_by_name = {}

for s in shortcuts:
    args = s.get('Arguments', '')
    m = re.search(r'--profile-directory="?([^"\s]+(?:\s+[^"\s]+)*)"?', args)
    if m:
        pdir = m.group(1).strip()
        s['profileDir'] = pdir
        shortcut_by_pdir[pdir] = s
        shortcut_by_name[s['Name']] = s

print(f"Total mapped implicit shortcuts by profileDir: {len(shortcut_by_pdir)}")

# Read FavoritesResolve from registry
key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Taskband')
val, _ = winreg.QueryValueEx(key, 'FavoritesResolve')
raw = val.decode('latin1', errors='ignore')

# Extract all .lnk occurrences in order of FavoritesResolve
lnk_matches = re.findall(r'([A-Za-z0-9_\-\.\@\(\) ]+\.lnk)', raw)
# Deduplicate while preserving order of first appearance
ordered_lnks = []
for lnk in lnk_matches:
    clean = lnk.strip()
    if clean and clean not in ordered_lnks:
        ordered_lnks.append(clean)

print(f"\nOrdered LNK items in Taskband ({len(ordered_lnks)} items):")
for i, l in enumerate(ordered_lnks):
    print(f"  Slot {i+1}: {l}")

# Now match each taskbar item
taskbar_profiles = []
slot_counter = 1

for lnk_name in ordered_lnks:
    # Check if this is Explorer or Edge
    if "File Explorer" in lnk_name or "Edge" in lnk_name:
        slot_counter += 1
        continue
    
    # Check if it is a Chrome shortcut
    matched_s = None
    if lnk_name == "Google Chrome.lnk":
        # Default profile
        pdir = "Default"
    else:
        # Search in shortcuts
        for s in shortcuts:
            if s['Name'].lower() == lnk_name.lower():
                matched_s = s
                break
        if matched_s:
            pdir = matched_s.get('profileDir')
        else:
            pdir = None

    info = info_cache.get(pdir, {}) if pdir else {}
    name = info.get('name') or (matched_s['Name'].replace(' - Chrome.lnk', '') if matched_s else lnk_name)
    email = info.get('user_name', '')
    gaia = info.get('gaia_name', '')
    
    taskbar_profiles.append({
        "slot": slot_counter,
        "lnkName": lnk_name,
        "profileDir": pdir,
        "name": name,
        "email": email,
        "gaia": gaia
    })
    slot_counter += 1

print(f"\nFinal Taskbar Chrome Profiles ({len(taskbar_profiles)} items):")
for p in taskbar_profiles:
    print(f"Slot {p['slot']:2d} | Win+{p['slot']} | [{str(p['profileDir']):10s}] {p['name']:35s} | {p['email']}")

out_file = os.path.join(os.path.dirname(__file__), "exact_taskbar_profiles.json")
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(taskbar_profiles, f, indent=2)
print("\nSaved to scripts/exact_taskbar_profiles.json")
