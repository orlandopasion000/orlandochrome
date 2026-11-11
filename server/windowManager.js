const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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

function launchProfile(profileDir, url = '') {
  return new Promise((resolve, reject) => {
    try {
      const args = [`--profile-directory=${profileDir}`];
      if (url && typeof url === 'string' && url.trim()) {
        args.push(url.trim());
      }

      console.log(`[windowManager] Spawning Chrome: "${CHROME_PATH}" ${args.join(' ')}`);
      
      const child = spawn(CHROME_PATH, args, {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      resolve({ ok: true, profileDir });
    } catch (err) {
      console.error(`[windowManager] Launch error for ${profileDir}:`, err);
      reject(err);
    }
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

function focusProfile(profileDir, profileName = '') {
  // In Chrome on Windows, running chrome.exe --profile-directory="Profile X" automatically
  // switches focus to the existing window if it is already open, or opens it if closed.
  return launchProfile(profileDir);
}

module.exports = {
  launchProfile,
  getRunningProfiles,
  focusProfile,
  CHROME_PATH
};
