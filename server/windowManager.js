const { exec } = require('child_process');
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
    let args = [`--profile-directory="${profileDir}"`];
    if (url && typeof url === 'string' && url.trim()) {
      args.push(`"${url.trim()}"`);
    }

    // Windows start command
    const cmd = `start "" "${CHROME_PATH}" ${args.join(' ')}`;
    exec(cmd, (err) => {
      if (err) {
        console.error(`[windowManager] Failed to launch ${profileDir}:`, err);
        return reject(err);
      }
      console.log(`[windowManager] Launched ${profileDir}`);
      resolve({ ok: true, profileDir });
    });
  });
}

function getRunningProfiles() {
  return new Promise((resolve) => {
    // Quick PowerShell query for running chrome processes with their command lines
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
  // Try bringing the window to the front using WScript.Shell AppActivate
  return new Promise((resolve) => {
    const targetTitle = profileName ? profileName.split(' ')[0] : 'Chrome';
    const ps = `
      $wsh = New-Object -ComObject WScript.Shell;
      $activated = $wsh.AppActivate("${profileName}");
      if (-not $activated) {
        $activated = $wsh.AppActivate("${profileDir}");
      }
      $activated
    `;
    exec(`powershell -NoProfile -Command "${ps.replace(/\r?\n/g, ' ')}"`, (err, stdout) => {
      const ok = stdout && stdout.trim().toLowerCase() === 'true';
      if (!ok) {
        // If not running or couldn't focus, launch it
        launchProfile(profileDir).then(resolve).catch(() => resolve({ ok: false }));
      } else {
        resolve({ ok: true, focused: true });
      }
    });
  });
}

module.exports = {
  launchProfile,
  getRunningProfiles,
  focusProfile,
  CHROME_PATH
};
