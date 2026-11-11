const { execFile, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const HELPER_PS1 = path.join(__dirname, 'launch_helper.ps1');

function findChromeExe() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'chrome.exe';
}

const CHROME_PATH = findChromeExe();

function launchProfile(profileDir, profile = null, url = '') {
  return new Promise((resolve, reject) => {
    const shortcutPath = profile && profile.shortcutPath ? profile.shortcutPath : '';
    const taskbarNo = profile && profile.taskbarNo ? Number(profile.taskbarNo) : 0;

    const args = [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', HELPER_PS1,
      '-ProfileDir', profileDir,
      '-ShortcutPath', shortcutPath,
      '-TaskbarNo', String(taskbarNo)
    ];

    console.log(`[windowManager] Launching profile "${profileDir}" via launch_helper.ps1 (Taskbar #${taskbarNo})`);

    execFile('powershell.exe', args, (err, stdout, stderr) => {
      if (err) {
        console.warn(`[windowManager] Helper note for ${profileDir}:`, err.message);
        // Fallback: direct Windows start command with shortcut or chrome.exe
        const fallbackCmd = shortcutPath && fs.existsSync(shortcutPath)
          ? `cmd /c start "" "${shortcutPath}"`
          : `cmd /c start "" "${CHROME_PATH}" --profile-directory="${profileDir}" --source-shortcut-location=taskbar`;
        
        exec(fallbackCmd, (e2) => {
          if (e2) return reject(err);
          resolve({ ok: true, profileDir, fallback: true });
        });
        return;
      }
      console.log(`[windowManager] Launch output:`, stdout.trim());
      resolve({ ok: true, profileDir, output: stdout.trim() });
    });
  });
}

function getRunningProfiles() {
  return new Promise((resolve) => {
    const ps = `Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" | Select-Object ProcessId, CommandLine | ConvertTo-Json -Compress`;
    exec(`powershell -NoProfile -Command "${ps}"`, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
      if (err || !stdout) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(stdout);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const runningMap = {};
        for (const p of list) {
          if (!p.CommandLine) continue;
          const m = p.CommandLine.match(/--profile-directory="?([^"\s]+(?:\s+[^"\s]+)*)"?/);
          if (m) {
            const dir = m[1];
            if (!runningMap[dir]) runningMap[dir] = 0;
            runningMap[dir]++;
          }
        }
        resolve(runningMap);
      } catch (e) {
        resolve({});
      }
    });
  });
}

function focusProfile(profileDir, profile = null) {
  return launchProfile(profileDir, profile);
}

module.exports = {
  launchProfile,
  getRunningProfiles,
  focusProfile,
  CHROME_PATH
};
