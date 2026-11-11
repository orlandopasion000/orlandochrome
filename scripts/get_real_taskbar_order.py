import winreg
import re
import json
import os

local_state_path = os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\User Data\Local State")
with open(local_state_path, "r", encoding="utf-8") as f:
    ls = json.load(f)
profiles_meta = ls.get("profile", {}).get("info_cache", {})

# Pinned order extracted directly from HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Taskband\FavoritesResolve:
pinned_chromes = [
    {"pdir": "Default", "defaultName": "Google Chrome (Default)", "emoji": "🌐", "purpose": "Primary / Default"},
    {"pdir": "Profile 16", "defaultName": "Orlando (A1 001 DepEd)", "emoji": "🎓", "purpose": "DepEd School Admin / Teaching"},
    {"pdir": "Profile 1", "defaultName": "Orlando (A2 000)", "emoji": "📘", "purpose": "General AI / Personal"},
    {"pdir": "Profile 2", "defaultName": "Orlando (A3 0817)", "emoji": "📊", "purpose": "Research / Tools"},
    {"pdir": "Profile 24", "defaultName": "Your Chrome (Hero)", "emoji": "🧠", "purpose": "AI Exploration"},
    {"pdir": "Profile 22", "defaultName": "A", "emoji": "🎯", "purpose": "Media / Tools"},
    {"pdir": "Profile 20", "defaultName": "Nash (Nash Reviewer)", "emoji": "📝", "purpose": "Ministry & Devotion Review"},
    {"pdir": "Profile 48", "defaultName": "Gwapo", "emoji": "📊", "purpose": "Grade Analysis"},
    {"pdir": "Profile 9", "defaultName": "Orlando (A5 001 Gmail)", "emoji": "📘", "purpose": "Primary Account"},
    {"pdir": "Profile 39", "defaultName": "Orlando (A6 002 Gmail)", "emoji": "🏫", "purpose": "Academic Writing"},
    {"pdir": "Profile 40", "defaultName": "Orlando (A5 003 Gmail)", "emoji": "⚡", "purpose": "Dissertation Ch. 3"},
    {"pdir": "Profile 41", "defaultName": "Orlando (A5 004 Gmail)", "emoji": "📘", "purpose": "Lesson Plans / Tests"},
    {"pdir": "Profile 52", "defaultName": "orlandopasion005@gmail.com", "emoji": "🎯", "purpose": "Test Creation ST2"},
    {"pdir": "Profile 53", "defaultName": "Orlando (006 Gmail)", "emoji": "🧠", "purpose": "Curriculum Work"},
    {"pdir": "Profile 49", "defaultName": "Gold Cloud", "emoji": "📝", "purpose": "Notes & Summaries"},
    {"pdir": "Profile 45", "defaultName": "Your Chrome (scite001)", "emoji": "🛠️", "purpose": "Literature Search"},
    {"pdir": "Profile 46", "defaultName": "Orlando (A6 scite002 Gmail)", "emoji": "🧮", "purpose": "Research Synthesis"},
    {"pdir": "Profile 44", "defaultName": "SCITE 3", "emoji": "🎓", "purpose": "Academic Citations"},
    {"pdir": "Profile 56", "defaultName": "Orlando (pogiorlando)", "emoji": "📚", "purpose": "Ministry Presentations"},
    {"pdir": "Profile 57", "defaultName": "Watch", "emoji": "🏫", "purpose": "Online Media / Video"},
    {"pdir": "Profile 58", "defaultName": "Orlando (grammarly)", "emoji": "💡", "purpose": "Grammar & Proofreading"}
]

real_profiles = []
colors = ["#3DDC97", "#4DA3FF", "#E8A33D", "#E86A8A", "#A78BFA", "#2DD4BF", "#F97316", "#84CC16", "#F472B6", "#60A5FA", "#FACC15", "#94A3B8"]

for idx, item in enumerate(pinned_chromes):
    pdir = item["pdir"]
    meta = profiles_meta.get(pdir, {})
    name = meta.get("name") or item["defaultName"]
    email = meta.get("user_name", "")
    
    # Taskbar slot position:
    # Slot 1 = File Explorer (Win + 1)
    # Slot 2 = Microsoft Edge (Win + 2)
    # Slot 3 = 1st Chrome (Win + 3)
    # Slot 4 = 2nd Chrome (Win + 4)
    # ...
    # Slot 9 = 7th Chrome (Win + 9)
    # Slot 10+ = 8th Chrome onwards (Taskbar icon #10)
    taskbar_slot = idx + 3
    win_shortcut = f"Win + {taskbar_slot}" if taskbar_slot <= 9 else f"Icon #{taskbar_slot}"
    chrome_num = idx + 1

    profile_obj = {
        "id": f"p_tb_{taskbar_slot}",
        "profileDir": pdir,
        "chromeNo": chrome_num,
        "taskbarSlot": taskbar_slot,
        "winShortcut": win_shortcut,
        "name": name,
        "email": email,
        "color": colors[idx % len(colors)],
        "emoji": item["emoji"],
        "status": "ready",
        "readyAt": None,
        "purpose": item["purpose"],
        "todos": []
    }
    real_profiles.append(profile_obj)
    print(f"Slot {taskbar_slot:2d} ({win_shortcut:7s}) | Chrome #{chrome_num:2d} | [{pdir:10s}] {name:32s} | {email}")

output_path = os.path.join(os.path.dirname(__file__), "real_taskbar_profiles.json")
with open(output_path, "w", encoding="utf-8") as out:
    json.dump(real_profiles, out, indent=2)
print("\nSaved to scripts/real_taskbar_profiles.json successfully!")
