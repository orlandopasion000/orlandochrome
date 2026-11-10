// Chrome Taskbar Sync Companion Service Worker
const WS_URL = 'ws://127.0.0.1:48100/ws';
const API_URL = 'http://127.0.0.1:48100/api';

let ws = null;
let reconnectTimer = null;
let myProfileDir = '';

// Load saved profile directory name or auto-detect
chrome.storage.local.get(['profileDir'], (res) => {
  if (res.profileDir) {
    myProfileDir = res.profileDir;
  }
  connect();
});

function connect() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('[Companion] Connected to Taskbar Command Center');
      reportStatus();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'profile_ready_alert') {
          // Can display a Chrome desktop notification
          console.log('[Companion] Profile ready:', msg.message);
        }
      } catch (e) {}
    };

    ws.onclose = () => {
      console.log('[Companion] Disconnected from Command Center. Reconnecting...');
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 4000);
    };

    ws.onerror = () => {
      ws.close();
    };
  } catch (e) {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connect, 4000);
  }
}

async function reportStatus(isFocused = true) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0] || {};

    const payload = {
      type: 'extension_hello',
      profileDir: myProfileDir || 'AutoProfile',
      url: activeTab.url || '',
      title: activeTab.title || '',
      isFocused: isFocused
    };

    ws.send(JSON.stringify(payload));
  } catch (e) {
    console.warn('[Companion] reportStatus error:', e);
  }
}

// Window & Tab focus listeners
chrome.tabs.onActivated.addListener(() => reportStatus(true));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    reportStatus(true);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  const focused = windowId !== chrome.windows.WINDOW_ID_NONE;
  reportStatus(focused);
});

// Message listener from content script or popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'LIMIT_DETECTED' || msg.type === 'START_COOLDOWN') {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'limit_hit',
        profileDir: myProfileDir,
        waitMs: (msg.hours || 3) * 3600000,
        task: msg.task || ''
      }));
      sendResponse({ ok: true });
    } else {
      // Fallback via HTTP REST
      fetch(`${API_URL}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hitLimit',
          data: { id: myProfileDir, hours: msg.hours || 3, task: msg.task || '' }
        })
      }).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
      return true;
    }
  } else if (msg.type === 'SET_PROFILE_DIR') {
    myProfileDir = msg.profileDir;
    chrome.storage.local.set({ profileDir: myProfileDir });
    reportStatus();
    sendResponse({ ok: true });
  }
});
