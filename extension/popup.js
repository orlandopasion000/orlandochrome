// Companion Extension Popup Logic
const API_URL = 'http://127.0.0.1:48100/api';

document.addEventListener('DOMContentLoaded', async () => {
  const sel = document.getElementById('profileSelect');
  const badge = document.getElementById('statusBadge');
  const cdText = document.getElementById('countdownText');

  // Load state and profiles from local server
  try {
    const res = await fetch(`${API_URL}/state`);
    const state = await res.json();
    const profiles = state.profiles || [];

    chrome.storage.local.get(['profileDir'], (st) => {
      let currentDir = st.profileDir || '';

      sel.innerHTML = `<option value="">-- Select this profile --</option>` +
        profiles.map(p => `
          <option value="${p.profileDir}" ${p.profileDir === currentDir ? 'selected' : ''}>
            #${p.taskbarNo || '?'} ${p.name} (${p.profileDir})
          </option>
        `).join('');

      updateProfileStatus(currentDir, profiles);
    });

    sel.onchange = () => {
      const chosen = sel.value;
      chrome.storage.local.set({ profileDir: chosen });
      chrome.runtime.sendMessage({ type: 'SET_PROFILE_DIR', profileDir: chosen });
      updateProfileStatus(chosen, profiles);
    };

    function updateProfileStatus(pdir, list) {
      const p = list.find(x => x.profileDir === pdir);
      if (!p) {
        badge.className = 'status-badge';
        badge.textContent = 'Not configured';
        cdText.textContent = 'Pick this profile from the dropdown above';
        return;
      }

      const now = Date.now();
      if (p.status === 'waiting' && p.readyAt && p.readyAt > now) {
        badge.className = 'status-badge warn';
        badge.textContent = 'In Cooldown';
        const remMin = Math.ceil((p.readyAt - now) / 60000);
        cdText.textContent = `Ready in ~${remMin} min (${new Date(p.readyAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})`;
      } else {
        badge.className = 'status-badge ok';
        badge.textContent = 'Ready';
        cdText.textContent = 'Ready to work. No limits active.';
      }
    }

  } catch (err) {
    sel.innerHTML = `<option value="">Command Center server offline</option>`;
    cdText.textContent = 'Start the server at http://127.0.0.1:48100';
  }

  // Quick buttons
  document.querySelectorAll('[data-h]').forEach(btn => {
    btn.onclick = () => {
      const hrs = Number(btn.dataset.h) || 3;
      chrome.runtime.sendMessage({
        type: 'START_COOLDOWN',
        hours: hrs,
        task: 'Limit hit from popup'
      }, () => {
        window.close();
      });
    };
  });

  document.getElementById('btnOpenDashboard').onclick = () => {
    chrome.tabs.create({ url: 'http://127.0.0.1:48100' });
  };
});
