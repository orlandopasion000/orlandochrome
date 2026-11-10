const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors and Emojis for visually distinct profiles
const PALETTE = [
  { color: '#3DDC97', emoji: '📘' },
  { color: '#4DA3FF', emoji: '🎓' },
  { color: '#E8A33D', emoji: '🛠️' },
  { color: '#E86A8A', emoji: '🧮' },
  { color: '#A78BFA', emoji: '📊' },
  { color: '#2DD4BF', emoji: '📝' },
  { color: '#F97316', emoji: '🎯' },
  { color: '#84CC16', emoji: '🧠' },
  { color: '#F472B6', emoji: '📚' },
  { color: '#60A5FA', emoji: '🏫' },
  { color: '#FACC15', emoji: '💡' },
  { color: '#94A3B8', emoji: '⚡' }
];

function scanProfiles() {
  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Local');
  const localStatePath = path.join(localAppData, 'Google', 'Chrome', 'User Data', 'Local State');
  
  let infoCache = {};
  if (fs.existsSync(localStatePath)) {
    try {
      const localState = JSON.parse(fs.readFileSync(localStatePath, 'utf8'));
      infoCache = (localState.profile && localState.profile.info_cache) || {};
    } catch (e) {
      console.warn('[profileScanner] Error reading Chrome Local State:', e.message);
    }
  }

  // Scan Windows Taskbar ImplicitAppShortcuts
  const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
  const shortcutsBase = path.join(appData, 'Microsoft', 'Internet Explorer', 'Quick Launch', 'User Pinned', 'ImplicitAppShortcuts');
  
  let shortcuts = [];
  if (fs.existsSync(shortcutsBase)) {
    const psScript = `
      $wsh = New-Object -ComObject WScript.Shell;
      Get-ChildItem -Path '${shortcutsBase}' -Recurse -Filter *.lnk | ForEach-Object {
        $sc = $wsh.CreateShortcut($_.FullName);
        [PSCustomObject]@{
          ShortcutName = $_.Name;
          Arguments = $sc.Arguments;
          TargetPath = $sc.TargetPath;
          FullPath = $_.FullName;
        }
      } | ConvertTo-Json -Compress
    `;
    try {
      const raw = execSync(`powershell -NoProfile -Command "${psScript.replace(/\r?\n/g, ' ')}"`, { 
        encoding: 'utf8', 
        maxBuffer: 10 * 1024 * 1024 
      });
      const parsed = JSON.parse(raw);
      shortcuts = Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      console.warn('[profileScanner] PowerShell shortcut scan note:', err.message);
    }
  }

  const shortcutByProfile = {};
  for (const s of shortcuts) {
    if (!s || !s.Arguments) continue;
    const m = s.Arguments.match(/--profile-directory="?([^"\s]+(?:\s+[^"\s]+)*)"?/);
    if (m) {
      const pdir = m[1];
      shortcutByProfile[pdir] = s;
    }
  }

  const profiles = [];
  let taskbarCounter = 1;

  for (const [pdir, info] of Object.entries(infoCache)) {
    const sc = shortcutByProfile[pdir];
    let displayName = info.name || pdir;
    if (sc) {
      displayName = sc.ShortcutName.replace(/ - Chrome\.lnk$/i, '').trim();
    }

    const theme = PALETTE[profiles.length % PALETTE.length];
    const isPinned = !!sc;

    profiles.push({
      id: `p_${pdir.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      profileDir: pdir,
      name: displayName,
      chromeName: info.name || pdir,
      email: info.user_name || '',
      isPinned,
      taskbarNo: isPinned ? taskbarCounter++ : null,
      shortcutPath: sc ? sc.FullPath : null,
      color: theme.color,
      emoji: theme.emoji,
      status: 'ready', // 'ready' | 'waiting' | 'running' | 'off'
      readyAt: null,
      resetH: 3.0,
      purpose: '',
      plan: '',
      task: '',
      todos: [],
      notes: '',
      notifiedFor: null,
      lastSeen: info.active_time ? Number(info.active_time) : Date.now()
    });
  }

  // Sort pinned profiles first, ordered by taskbarNo
  profiles.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (a.taskbarNo || 999) - (b.taskbarNo || 999);
  });

  return profiles;
}

module.exports = { scanProfiles };
