import os
import glob
import json


# We can use Windows Script Host Shell to read .lnk targets and arguments reliably!
import winreg
import subprocess

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
print(f"Total implicit shortcuts: {len(shortcuts)}")

# Also read Local State to get current names, emails, and gaia names
local_state_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Local State')
with open(local_state_path, 'r', encoding='utf-8') as f:
    ls = json.load(f)
info_cache = ls.get('profile', {}).get('info_cache', {})

# Match shortcuts with info_cache
for s in shortcuts:
    args = s.get('Arguments', '')
    pdir = None
    if '--profile-directory=' in args:
        parts = args.split('--profile-directory=')
        pdir = parts[1].split(' ')[0].strip('"')
    s['profileDir'] = pdir
    if pdir and pdir in info_cache:
        s['localStateName'] = info_cache[pdir].get('name')
        s['localStateEmail'] = info_cache[pdir].get('user_name')
        s['gaiaName'] = info_cache[pdir].get('gaia_name')
    else:
        s['localStateName'] = None
        s['localStateEmail'] = None
        s['gaiaName'] = None

out_path = os.path.join(os.path.dirname(__file__), 'all_implicit_shortcuts.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(shortcuts, f, indent=2)

print("Saved all_implicit_shortcuts.json")
