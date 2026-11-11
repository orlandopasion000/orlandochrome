/* OrlandoChrome · Chrome Taskbar Notes & Command Center
 * OLED Pure Black (#000000) Theme · Small Green & White / Red & White Radiant Gradient Pins & Reset States
 * 7 High-Impact Enhancements + Wispr Flow Pro Dictation + App Distribution & Command Suite (PWA & Blank Edition)
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  // Check if running in Clean Blank Edition mode (?edition=blank) for any external laptop
  const URL_PARAMS = new URLSearchParams(window.location.search);
  const IS_BLANK_EDITION = URL_PARAMS.get('edition') === 'blank';

  const STORAGE_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_edition_profiles_v1'
    : 'chrome_taskbar_messenger_notes_v5';
  const OLD_STORAGE_KEYS = IS_BLANK_EDITION
    ? []
    : ['chrome_taskbar_messenger_notes_v4', 'chrome_taskbar_netflix_v1', 'chrome_taskbar_messenger_notes_v3'];
  const WISPR_PREFS_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_wispr_v1'
    : 'orlandochrome_wispr_flow_pro_v1';
  const TEMPLATES_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_templates_v2'
    : 'orlandochrome_quick_templates_v2';
  const LAST_MOD_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_last_mod_v1'
    : 'orlandochrome_personal_last_mod_v1';

  // Unique Client Tab ID & Real-Time Cross-Device Cloud Sync Topic (Windows · iOS · Android)
  const CLIENT_ID = uid();
  const CLOUD_SYNC_TOPIC = IS_BLANK_EDITION
    ? (URL_PARAMS.get('room') || localStorage.getItem('orlandochrome_blank_room_v1') || 'orlandochrome_blank_sync_v1')
    : 'orlandochrome_live_sync_pasion1994_v2';

  const LIVE_APP_URL = 'https://orlandopasion000.github.io/orlandochrome/';
  const BLANK_APP_URL = 'https://orlandopasion000.github.io/orlandochrome/?edition=blank';

  // Priority & Color Reactions (Messenger / Discord Style)
  const REACTIONS_LIST = [
    { key: 'urgent',    icon: '🔥', label: 'Urgent',    cls: 'react-urgent' },
    { key: 'waiting',   icon: '⏳', label: 'Waiting',   cls: 'react-waiting' },
    { key: 'important', icon: '📌', label: 'Important', cls: 'react-important' },
    { key: 'verified',  icon: '✅', label: 'Verified',  cls: 'react-verified' }
  ];
  const REACTIONS_MAP = Object.fromEntries(REACTIONS_LIST.map(r => [r.key, r]));

  // Default 1-Click Quick-Task Templates (Enhancement #1)
  const DEFAULT_TEMPLATES = IS_BLANK_EDITION
    ? [
        'Print',
        'Test',
        'Module',
        'ST',
        'Exam',
        'Video',
        'Check AI Quota'
      ]
    : [
        'Print',
        'Lesson Plan',
        'Check BOW',
        'Test',
        'Module',
        'ST',
        'Exam',
        'Video',
        'Check AI Quota'
      ];

  // Schedule from Daily Recharge Alarm (Sir Orlando V. Pasion, Jr.)
  const RECHARGE_SCHEDULE = [
    [7, 0, "work", "Arrive — read, learn, develop"],
    [8, 0, "rest", "Short recharge — 10 min"],
    [8, 10, "work", "Work and print"],
    [8, 20, "rest", "Recharge before class — 10 min"],
    [8, 30, "class", "Class: Math 8"],
    [9, 30, "rest", "Long recharge — 40 min"],
    [10, 11, "work", "Work and print"],
    [10, 30, "rest", "Recharge before class — 15 min"],
    [10, 45, "class", "Class: Math 10"],
    [11, 45, "err", "Principal’s office — log out/in"],
    [12, 0, "rest", "Lunch and recharge — 45 min"],
    [12, 45, "err", "Personal hygiene"],
    [12, 50, "rest", "Recharge before class — 10 min"],
    [13, 0, "class", "Class: Math 8"],
    [14, 0, "rest", "Longest recharge — 60 min"],
    [15, 0, "work", "Work and print"],
    [15, 10, "rest", "Quick recharge — 5 min"],
    [15, 15, "class", "Class: Gen Math 11"],
    [16, 16, "err", "Organize files"],
    [16, 21, "rest", "Recharge, then go home"],
    [20, 0, "night", "Shutdown — write tomorrow’s top 3"],
    [20, 30, "night", "Wind-down — no screens"],
    [21, 30, "night", "Bedtime"]
  ];

  // The 22 Real Chrome Profiles in exact physical order from Windows Taskband & Local State
  const DEFAULT_PROFILES = [
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "A4 A Hero", email: "heroesmeraldaepicalu@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 B Yify", email: "yifyyts7@gmail.com", gaia: "Yify Yify", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 C NASH", email: "revnash0@gmail.com", gaia: "Nash Rev", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Slot #10", name: "A4 D Gwapo", email: "gwapocpogi@gmail.com", gaia: "Gwapo Pogi", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Slot #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Slot #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Slot #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Slot #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Slot #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Slot #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Slot #17", name: "A6 scite003 Gmail Gold Cloud", email: "goldcloudblack@gmail.com", gaia: "Gold Cloud Black", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Slot #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Slot #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Slot #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Slot #21", name: "A7 A pogiorlandopasion@gmail.com", email: "pogiorlandopasion@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Slot #22", name: "A7 B watchonlineapple", email: "watchonlineapple@gmail.com", gaia: "Watch Online", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Slot #23", name: "A7 C grammarlyquillbot001@gmail.com", email: "grammarlyquillbot001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "p_tb_24", profileDir: "Profile 59", chromeNo: 22, taskbarSlot: 24, winShortcut: "Slot #24", name: "A7 D netflixpasion", email: "netflixpasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] }
  ];

  // Clean Blank Edition starter profiles (zero personal data — ready to auto-scan installed laptop's taskbar)
  const BLANK_STARTER_PROFILES = [
    { id: "b_slot_1", profileDir: "", chromeNo: 1, taskbarSlot: 1, winShortcut: "Win + 1", name: "Chrome Profile #1", email: "Click 'Scan Laptop Taskbar' to auto-detect", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "b_slot_2", profileDir: "", chromeNo: 2, taskbarSlot: 2, winShortcut: "Win + 2", name: "Chrome Profile #2", email: "Taskbar Slot #2", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] },
    { id: "b_slot_3", profileDir: "", chromeNo: 3, taskbarSlot: 3, winShortcut: "Win + 3", name: "Chrome Profile #3", email: "Taskbar Slot #3", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, notes: [] }
  ];

  // Old sample text to purge
  const SAMPLES_TO_PURGE = [
    "draft grade 8 st2 test",
    "revise chapter 3",
    "prepare youth devotion",
    "table of specifications",
    "sampling framework"
  ];

  // Default Personal Dictionary for Wispr Flow Pro
  const DEFAULT_WISPR_DICT = IS_BLANK_EDITION
    ? [
        { from: "ai", to: "AI" },
        { from: "chatgpt", to: "ChatGPT" }
      ]
    : [
        { from: "deped", to: "DepEd" },
        { from: "bow", to: "BOW" },
        { from: "st2", to: "ST2" },
        { from: "scite", to: "Scite" },
        { from: "quillbot", to: "QuillBot" },
        { from: "grammarly", to: "Grammarly" },
        { from: "math 8", to: "Math 8" },
        { from: "math 10", to: "Math 10" },
        { from: "gen math 11", to: "Gen Math 11" },
        { from: "orlando", to: "Orlando" }
      ];

  // Deferred PWA Install Prompt Event
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  // Register Service Worker for Offline PWA & iOS Home Screen Support
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  // Application State
  const state = {
    profiles: [],
    activeProfileId: IS_BLANK_EDITION ? "b_slot_1" : "p_tb_4",
    currentFilter: "all",      // "all" | "pending" | "timers"
    searchQuery: "",
    uploadTargetId: null,
    editingNoteId: null,       // Currently inline-editing note ID
    pendingAttachment: null,   // Base64 compressed image awaiting send
    pendingVoiceClip: null,    // Base64 audio clip from Wispr Flow Voice Memo
    pendingReactionTag: null,  // Reaction queued by voice command
    quickTemplates: [...DEFAULT_TEMPLATES],
    lastModified: 0,           // Timestamp of last state change for Cross-Device Cloud Sync
    cloudStatus: "connecting", // "synced" | "syncing" | "connecting" | "offline"
    lastCloudSyncAt: null,
    qrTheme: "crimson",        // "crimson" | "gold" | "emerald" | "contrast"
    wispr: {
      isListening: false,
      panelOpen: false,
      style: "polish",         // "polish" | "academic" | "action" | "raw"
      commandMode: true,
      autoSend: false,
      recordAudioClip: false,
      sessionWords: 0,
      sessionStartMs: null,
      interimText: "",
      lastCommandExecuted: "",
      dictionary: [...DEFAULT_WISPR_DICT]
    }
  };

  // Load & Save Quick Templates
  function loadTemplates() {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          // Ensure removed templates ("DepEd LIS/Form", "Scite Search") never reappear
          state.quickTemplates = parsed.filter(t => !/deped\s*lis|scite\s*search/i.test(t));
        }
      }
    } catch (e) {}
  }

  function saveTemplates() {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(state.quickTemplates));
    } catch (e) {}
  }

  // Load & Save Wispr Flow Pro preferences
  function loadWisprPrefs() {
    try {
      const raw = localStorage.getItem(WISPR_PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.style) state.wispr.style = parsed.style;
      if (typeof parsed.commandMode === 'boolean') state.wispr.commandMode = parsed.commandMode;
      if (typeof parsed.autoSend === 'boolean') state.wispr.autoSend = parsed.autoSend;
      if (typeof parsed.recordAudioClip === 'boolean') state.wispr.recordAudioClip = parsed.recordAudioClip;
      if (typeof parsed.panelOpen === 'boolean') state.wispr.panelOpen = parsed.panelOpen;
      if (Array.isArray(parsed.dictionary) && parsed.dictionary.length) {
        state.wispr.dictionary = parsed.dictionary;
      }
    } catch (e) {
      console.warn('Failed to load Wispr prefs:', e);
    }
  }

  function saveWisprPrefs() {
    try {
      localStorage.setItem(WISPR_PREFS_KEY, JSON.stringify({
        style: state.wispr.style,
        commandMode: state.wispr.commandMode,
        autoSend: state.wispr.autoSend,
        recordAudioClip: state.wispr.recordAudioClip,
        panelOpen: state.wispr.panelOpen,
        dictionary: state.wispr.dictionary
      }));
    } catch (e) {
      console.warn('Failed to save Wispr prefs:', e);
    }
  }

  // Helper to get avatar source
  function getAvatarSrc(profile) {
    if (profile.customAvatar) return profile.customAvatar;
    if (!IS_BLANK_EDITION && profile.profileDir) return `avatars/${encodeURIComponent(profile.profileDir)}.png`;
    const initial = esc(profile.name ? profile.name[0].toUpperCase() : 'C');
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><radialGradient id='g' cx='30%' cy='25%' r='75%'><stop offset='0%' stop-color='%23ff4d58'/><stop offset='50%' stop-color='%23b8000a'/><stop offset='100%' stop-color='%231a0002'/></radialGradient></defs><rect width='100' height='100' rx='50' fill='url(%23g)'/><text x='50' y='66' font-size='46' font-weight='800' text-anchor='middle' fill='%23ffffff' font-family='sans-serif'>${initial}</text></svg>`;
  }

  // Toast notification
  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // Enhancement #3: Auto-Linkify URLs inside message text & sticky notes
  function linkifyText(raw) {
    const safe = esc(raw);
    return safe.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="note-auto-link" onclick="event.stopPropagation()">🔗 ${url}</a>`;
    });
  }

  // Enhancement #5: Update Browser Tab Title with Live Pending / Reset Count
  function updateDocumentTitle() {
    const pending = totalPendingCount();
    const resets = state.profiles.filter(p => p.isReset).length;
    const totalAlerts = pending + resets;
    const baseName = IS_BLANK_EDITION ? 'OrlandoChrome · Blank Edition' : 'OrlandoChrome';
    document.title = totalAlerts > 0 ? `(${totalAlerts}) ${baseName}` : baseName;
  }

  // Enhancement #5: Fire Desktop Browser Notification on Timer Reset
  function triggerDesktopNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: 'oc-logo.svg' });
      } catch (e) {}
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          try { new Notification(title, { body, icon: 'oc-logo.svg' }); } catch (e) {}
        }
      }).catch(() => {});
    }
  }

  // Compress Image (for Ctrl+V Paste, Drag & Drop, or File Upload)
  function compressImage(fileOrBlob, maxWidth = 960, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }

  // UTF-8 Safe Base64URL Helpers for QR Code & Cloud Sync
  function toBase64Url(str) {
    try {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  }

  function fromBase64Url(b64url) {
    try {
      let b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch (e) {
      return '';
    }
  }

  // Check if profiles array has any active pending/completed notes, timers, pins, or sticky notes
  function hasAnyUserActivity(profList) {
    if (!Array.isArray(profList)) return false;
    return profList.some(p =>
      (Array.isArray(p.notes) && p.notes.length > 0) ||
      Boolean(p.timerUntil) ||
      Boolean(p.isReset) ||
      Boolean(p.isPinned) ||
      Boolean(p.isUnread) ||
      Boolean(p.stickyNote && p.stickyNote.trim())
    );
  }

  // Build Compact Cross-Device Sync Packet (for Cloud Sync & QR URL)
  function createSyncPacket(forQrCode = false) {
    const activeProfs = [];
    for (const p of state.profiles) {
      const hasNotes = Array.isArray(p.notes) && p.notes.length > 0;
      const hasTimer = Boolean(p.timerUntil) || Boolean(p.isReset);
      const hasMeta = Boolean(p.isPinned) || Boolean(p.isUnread) || Boolean(p.stickyNote);
      const def = !IS_BLANK_EDITION ? DEFAULT_PROFILES.find(d => d.id === p.id) : null;
      const hasCustomName = def ? (p.name !== def.name) : true;

      if (hasNotes || hasTimer || hasMeta || hasCustomName || IS_BLANK_EDITION) {
        if (forQrCode && !hasNotes && !hasTimer && !hasMeta && !IS_BLANK_EDITION) continue;
        const entry = { i: p.chromeNo };
        if (IS_BLANK_EDITION || hasCustomName) entry.nm = p.name;
        if (IS_BLANK_EDITION && p.email) entry.em = p.email;
        if (p.timerUntil) entry.tu = p.timerUntil;
        if (p.timerDurationMs) entry.td = p.timerDurationMs;
        if (p.isReset) entry.rs = 1;
        if (p.isPinned) {
          entry.pn = 1;
          if (p.pinnedAt) entry.pa = p.pinnedAt;
        }
        if (p.isUnread) entry.un = 1;
        if (p.stickyNote) entry.st = p.stickyNote;
        if (hasNotes) {
          entry.nt = p.notes.map(n => {
            const item = {
              id: n.id,
              t: n.text || '',
              c: n.createdAt || now()
            };
            if (n.done) item.d = 1;
            if (n.editedAt) item.e = n.editedAt;
            if (n.forwardedFrom) item.fw = n.forwardedFrom;
            if (Array.isArray(n.reactions) && n.reactions.length) item.rk = n.reactions;
            if (Array.isArray(n.subItems) && n.subItems.length) {
              item.sb = n.subItems.map(s => ({ id: s.id, t: s.text, d: s.done ? 1 : 0 }));
            }
            if (!forQrCode && n.image && n.image.length < 38000) {
              item.im = n.image;
            }
            return item;
          });
        }
        activeProfs.push(entry);
      }
    }

    return {
      v: 2,
      cid: CLIENT_ID,
      ts: state.lastModified || now(),
      ed: IS_BLANK_EDITION ? 'b' : 'p',
      tpl: forQrCode ? undefined : state.quickTemplates,
      p: activeProfs
    };
  }

  // Apply Sync Packet from QR Code URL (?sync=...) or Real-Time Cloud Sync
  function applySyncPacket(packet, sourceLabel = 'Cloud Sync') {
    if (!packet || !Array.isArray(packet.p)) return false;

    const mapByChromeNo = new Map();
    packet.p.forEach(item => {
      if (item && item.i != null) mapByChromeNo.set(Number(item.i), item);
    });

    if (IS_BLANK_EDITION && packet.p.length > 0) {
      state.profiles = packet.p.map((item, idx) => {
        const slot = idx + 1;
        const existing = state.profiles.find(ep => ep.chromeNo === item.i) || {};
        const restoredNotes = (item.nt || []).map(n => {
          const oldNote = (existing.notes || []).find(en => en.id === n.id) || {};
          return {
            id: n.id || uid(),
            text: n.t || '',
            done: Boolean(n.d),
            createdAt: n.c || now(),
            editedAt: n.e || null,
            forwardedFrom: n.fw || null,
            reactions: Array.isArray(n.rk) ? n.rk : [],
            subItems: Array.isArray(n.sb) ? n.sb.map(s => ({ id: s.id || uid(), text: s.t, done: Boolean(s.d) })) : [],
            image: n.im || oldNote.image || null,
            voiceClip: oldNote.voiceClip || null
          };
        });
        return {
          id: existing.id || `b_slot_${slot}`,
          profileDir: existing.profileDir || `Profile ${slot}`,
          chromeNo: item.i || slot,
          taskbarSlot: existing.taskbarSlot || slot,
          winShortcut: existing.winShortcut || (slot <= 9 ? `Win + ${slot}` : `Slot #${slot}`),
          name: item.nm || existing.name || `Chrome Profile #${slot}`,
          email: item.em || existing.email || `Taskbar Slot #${slot}`,
          gaia: existing.gaia || '',
          timerUntil: item.tu || null,
          timerDurationMs: item.td || null,
          isReset: Boolean(item.rs),
          isPinned: Boolean(item.pn),
          pinnedAt: item.pa || null,
          isUnread: Boolean(item.un && restoredNotes.length > 0),
          stickyNote: item.st || '',
          customAvatar: existing.customAvatar || null,
          notes: restoredNotes
        };
      });
    } else {
      state.profiles = DEFAULT_PROFILES.map(def => {
        const existing = state.profiles.find(ep => ep.id === def.id) || {};
        const item = mapByChromeNo.get(def.chromeNo);
        if (!item) {
          return {
            ...def,
            customAvatar: existing.customAvatar || null,
            timerUntil: null,
            timerDurationMs: null,
            isReset: false,
            isPinned: false,
            pinnedAt: null,
            isUnread: false,
            stickyNote: '',
            notes: []
          };
        }
        const restoredNotes = (item.nt || []).map(n => {
          const oldNote = (existing.notes || []).find(en => en.id === n.id) || {};
          return {
            id: n.id || uid(),
            text: n.t || '',
            done: Boolean(n.d),
            createdAt: n.c || now(),
            editedAt: n.e || null,
            forwardedFrom: n.fw || null,
            reactions: Array.isArray(n.rk) ? n.rk : [],
            subItems: Array.isArray(n.sb) ? n.sb.map(s => ({ id: s.id || uid(), text: s.t, done: Boolean(s.d) })) : [],
            image: n.im || oldNote.image || null,
            voiceClip: oldNote.voiceClip || null
          };
        });
        return {
          ...def,
          name: item.nm || def.name,
          timerUntil: item.tu || null,
          timerDurationMs: item.td || null,
          isReset: Boolean(item.rs),
          isPinned: Boolean(item.pn),
          pinnedAt: item.pa || null,
          isUnread: Boolean(item.un && restoredNotes.length > 0),
          stickyNote: item.st || '',
          customAvatar: existing.customAvatar || null,
          notes: restoredNotes
        };
      });
    }

    if (Array.isArray(packet.tpl) && packet.tpl.length > 0) {
      state.quickTemplates = packet.tpl.filter(t => !/deped\s*lis|scite\s*search/i.test(t));
      saveTemplates();
    }

    state.lastModified = packet.ts || now();
    state.lastCloudSyncAt = now();
    try {
      localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
    } catch (e) {}

    persistLocalOnly();
    renderSidebar();
    renderMainChat();
    updateTopbarSyncBadge('synced');
    return true;
  }

  // Ultra-compact micro-sync string (< 115 chars) so the QR code ALWAYS has giant, easy-to-scan blocks
  // while still hydrating active timers & pending notes at 0ms before Cloud Sync finishes!
  function createMicroSyncString() {
    const cur = now();
    const parts = [];
    for (const p of state.profiles) {
      const pending = (p.notes || []).filter(n => !n.done);
      const hasTimer = p.timerUntil && p.timerUntil > cur;
      if (!pending.length && !hasTimer && !p.isReset) continue;
      const remMin = hasTimer ? Math.max(1, Math.round((p.timerUntil - cur) / 60000)) : (p.isReset ? -1 : 0);
      const pinFlag = (p.isPinned && pending.length > 0) ? 1 : 0;
      const firstTxt = pending.length > 0 ? (pending[0].text || 'Task').replace(/[~|_]/g, ' ').slice(0, 26) : '';
      parts.push(`${p.chromeNo}~${remMin}~${pinFlag}~${firstTxt}`);
    }
    if (!parts.length) return '';
    return toBase64Url(parts.join('|'));
  }

  function applyMicroSyncString(b64Str) {
    if (!b64Str) return false;
    try {
      const raw = fromBase64Url(b64Str);
      if (!raw) return false;
      const entries = raw.split('|').filter(Boolean);
      if (!entries.length) return false;
      const cur = now();
      const mapByNo = new Map();
      for (const e of entries) {
        const [noStr, remStr, pinStr, ...txtParts] = e.split('~');
        const no = parseInt(noStr, 10);
        if (!isNaN(no)) {
          mapByNo.set(no, {
            remMin: parseInt(remStr, 10) || 0,
            pinned: pinStr === '1',
            text: (txtParts.join('~') || '').trim()
          });
        }
      }
      state.profiles.forEach(p => {
        const item = mapByNo.get(p.chromeNo);
        if (!item) return;
        if (item.remMin > 0) {
          p.timerUntil = cur + item.remMin * 60000;
          p.timerDurationMs = item.remMin * 60000;
          p.isReset = false;
        } else if (item.remMin === -1) {
          p.timerUntil = null;
          p.isReset = true;
        }
        if (item.pinned) {
          p.isPinned = true;
          p.pinnedAt = p.pinnedAt || cur;
        }
        if (item.text) {
          const exists = (p.notes || []).some(n => !n.done && (n.text || '').startsWith(item.text));
          if (!exists) {
            p.notes = p.notes || [];
            p.notes.push({
              id: uid(),
              text: item.text,
              done: false,
              createdAt: cur,
              reactions: [],
              subItems: []
            });
          }
        }
      });
      persistLocalOnly();
      renderSidebar();
      renderMainChat();
      return true;
    } catch (e) {
      return false;
    }
  }

  // Generate Live Sync URL with Embedded Pending Notes & Active Timers (?sync=...) for Copy Link / Native Share
  function buildLiveSyncUrl(isBlankTarget = false) {
    if (isBlankTarget) return BLANK_APP_URL;
    const base = LIVE_APP_URL;
    const pkt = createSyncPacket(true);
    if (!pkt.p || pkt.p.length === 0) return `${base}?s=1`;
    const encoded = toBase64Url(JSON.stringify(pkt));
    if (!encoded || encoded.length > 1800) return `${base}?s=1`;
    return `${base}?s=1&sync=${encoded}`;
  }

  // Generate Ultra-Scannable Short URL for QR Code (Giant QR Blocks + Instant 0ms Micro-Sync + Live Cloud Sync)
  function buildFastQrUrl(isBlankTarget = false, embedFullData = false) {
    if (isBlankTarget) return BLANK_APP_URL;
    const base = LIVE_APP_URL;
    if (embedFullData) {
      return buildLiveSyncUrl(false);
    }
    const micro = createMicroSyncString();
    // Keep QR URL under 145 characters total so QR code stays low-density with huge, instant-scan squares!
    if (micro && micro.length <= 105) {
      return `${base}?s=1&m=${micro}`;
    }
    return `${base}?s=1`;
  }

  // Update Topbar Cloud Sync Status Pill inside #btnOpenAppSuite
  function updateTopbarSyncBadge(status) {
    state.cloudStatus = status;
    const dot = $('#topbarSyncDot');
    const lbl = $('#topbarSyncLabel');
    if (!dot || !lbl) return;
    dot.className = 'sync-status-dot ' + status;
    if (status === 'syncing') {
      lbl.textContent = 'Syncing...';
    } else if (status === 'synced') {
      lbl.textContent = 'Synced';
    } else if (status === 'offline') {
      lbl.textContent = 'Local';
    } else {
      lbl.textContent = 'Ready';
    }
  }

  let cloudPushTimer = null;
  let cloudEventSource = null;

  function scheduleCloudPush() {
    updateTopbarSyncBadge('syncing');
    clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(() => {
      pushToCloudNow(false);
    }, 280);
  }

  async function pushToCloudNow(showFeedback = false) {
    try {
      updateTopbarSyncBadge('syncing');
      if (!state.lastModified) {
        state.lastModified = now();
        localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      }
      const pkt = createSyncPacket(false);
      const res = await fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(pkt)
      });
      if (res.ok) {
        state.lastCloudSyncAt = now();
        updateTopbarSyncBadge('synced');
        if (showFeedback) {
          showToast('☁️ Synced all pending notes & timers across Laptop & iPhone!');
        }
        return true;
      }
    } catch (e) {
      updateTopbarSyncBadge('offline');
    }
    return false;
  }

  async function pullFromCloud(isInitialBootstrap = false, showFeedback = false) {
    try {
      const res = await fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/json?poll=1&since=all`, {
        cache: 'no-store'
      });
      if (!res.ok) {
        updateTopbarSyncBadge('offline');
        return false;
      }
      const text = await res.text();
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      let latestPacket = null;

      for (const line of lines) {
        try {
          const env = JSON.parse(line);
          if (env && env.event === 'message' && env.message) {
            const pkt = JSON.parse(env.message);
            if (pkt && pkt.v === 2 && Array.isArray(pkt.p)) {
              if (!latestPacket || (pkt.ts || 0) >= (latestPacket.ts || 0)) {
                latestPacket = pkt;
              }
            }
          }
        } catch (err) {}
      }

      const localHasActivity = hasAnyUserActivity(state.profiles);

      // If Cloud is empty OR older than our local state, push our local state to Cloud so iPhone/other devices get it!
      if (!latestPacket) {
        if (localHasActivity) {
          await pushToCloudNow(false);
        } else {
          updateTopbarSyncBadge('synced');
        }
        return false;
      }

      const cloudTs = latestPacket.ts || 0;
      const localTs = state.lastModified || 0;
      const cloudHasActivity = latestPacket.p && latestPacket.p.length > 0;
      const forceFromQr = Boolean(state.forceCloudPullOnBoot);

      if (showFeedback || forceFromQr || cloudTs > localTs || (!localHasActivity && cloudHasActivity)) {
        state.forceCloudPullOnBoot = false;
        if (latestPacket.cid !== CLIENT_ID || showFeedback || forceFromQr || !localHasActivity) {
          applySyncPacket(latestPacket, 'Cloud Sync');
          if (showFeedback || forceFromQr) {
            showToast('📲 Synced all Pending Notes & Active Timers from Cloud!');
          }
        }
        updateTopbarSyncBadge('synced');
        return true;
      } else if (localTs > cloudTs && localHasActivity) {
        await pushToCloudNow(false);
        return true;
      }

      updateTopbarSyncBadge('synced');
    } catch (e) {
      updateTopbarSyncBadge('offline');
    }
    return false;
  }

  function initCloudSync() {
    // 1. Pull latest state or push local state on startup
    pullFromCloud(true, false);

    // 2. Open Real-Time Server-Sent Events (SSE) stream so Laptop <-> iPhone updates in < 0.5s
    try {
      if (cloudEventSource) cloudEventSource.close();
      cloudEventSource = new EventSource(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/sse`);
      cloudEventSource.onmessage = (ev) => {
        try {
          const env = JSON.parse(ev.data);
          if (env && env.event === 'message' && env.message) {
            const pkt = JSON.parse(env.message);
            if (pkt && pkt.v === 2 && pkt.cid !== CLIENT_ID) {
              if ((pkt.ts || 0) >= (state.lastModified || 0)) {
                applySyncPacket(pkt, 'Live Sync');
              }
            }
          }
        } catch (err) {}
      };
      cloudEventSource.onopen = () => updateTopbarSyncBadge('synced');
    } catch (e) {}

    // 3. Re-sync immediately when unlocking iPhone / switching back to browser tab
    window.addEventListener('focus', () => pullFromCloud(false, false));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        pullFromCloud(false, false);
      }
    });

    // 4. Periodic heartbeat check every 15 seconds
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        pullFromCloud(false, false);
      }
    }, 15000);
  }

  // Check if URL has ?sync=... or ?m=... or ?s=1 from scanning the Live QR Code
  function checkUrlSyncPacket() {
    const hasScanFlag = URL_PARAMS.get('s') === '1';
    const microB64 = URL_PARAMS.get('m');
    const syncB64 = URL_PARAMS.get('sync');

    if (hasScanFlag || microB64 || syncB64) {
      state.forceCloudPullOnBoot = true;
      window.history.replaceState({}, document.title, window.location.pathname + (IS_BLANK_EDITION ? '?edition=blank' : ''));
    }

    if (syncB64) {
      try {
        const jsonStr = fromBase64Url(syncB64);
        const pkt = JSON.parse(jsonStr);
        if (pkt && pkt.v === 2 && Array.isArray(pkt.p)) {
          return { type: 'full', pkt };
        }
      } catch (e) {
        console.warn('Failed to parse URL sync packet:', e);
      }
    }

    if (microB64) {
      return { type: 'micro', microB64 };
    }

    return null;
  }

  // Check if URL has ?import_b64=... from the Laptop Taskbar Auto-Scanner script
  function checkUrlImportedProfiles() {
    const b64 = URL_PARAMS.get('import_b64');
    if (!b64) return null;
    try {
      const jsonStr = atob(b64);
      const arr = JSON.parse(jsonStr);
      if (Array.isArray(arr) && arr.length > 0) {
        window.history.replaceState({}, document.title, window.location.pathname + (IS_BLANK_EDITION ? '?edition=blank' : ''));
        return arr;
      }
    } catch (e) {
      console.warn('Failed to parse URL imported profiles:', e);
    }
    return null;
  }

  // Load state and clean sample notes
  function loadState() {
    loadWisprPrefs();
    loadTemplates();

    const savedLastMod = parseInt(localStorage.getItem(LAST_MOD_KEY), 10);
    state.lastModified = !isNaN(savedLastMod) ? savedLastMod : 0;

    const badge = $('#brandEditionBadge');
    if (badge && IS_BLANK_EDITION) {
      badge.textContent = 'BLANK EDITION';
    }

    const urlImported = checkUrlImportedProfiles();
    if (urlImported && IS_BLANK_EDITION) {
      state.profiles = urlImported.map((p, idx) => ({
        id: p.id || `b_slot_${idx + 1}`,
        profileDir: p.profileDir || `Profile ${idx + 1}`,
        chromeNo: idx + 1,
        taskbarSlot: p.taskbarSlot || (idx + 1),
        winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
        name: p.name || `Chrome #${idx + 1}`,
        email: p.email || '',
        gaia: p.gaia || '',
        timerUntil: null,
        timerDurationMs: null,
        isReset: false,
        isPinned: false,
        pinnedAt: null,
        isUnread: false,
        stickyNote: '',
        customAvatar: p.customAvatar || null,
        notes: []
      }));
      state.activeProfileId = state.profiles[0].id;
      saveState();
      setTimeout(() => showToast(`✅ Synced ${state.profiles.length} taskbar Chrome profiles from this laptop!`), 300);
      return;
    }

    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const k of OLD_STORAGE_KEYS) {
        raw = localStorage.getItem(k);
        if (raw) break;
      }
    }

    let loaded = null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) loaded = parsed;
        else if (parsed && Array.isArray(parsed.profiles)) loaded = parsed.profiles;
      } catch (e) {
        console.warn('Failed to parse saved state:', e);
      }
    }

    if (IS_BLANK_EDITION) {
      if (!loaded || !loaded.length) {
        state.profiles = JSON.parse(JSON.stringify(BLANK_STARTER_PROFILES));
      } else {
        state.profiles = loaded.map((p, idx) => ({
          ...p,
          id: p.id || `b_slot_${idx + 1}`,
          chromeNo: p.chromeNo || (idx + 1),
          taskbarSlot: p.taskbarSlot || (idx + 1),
          winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
          stickyNote: p.stickyNote || '',
          isUnread: !!(p.isUnread && Array.isArray(p.notes) && p.notes.length > 0),
          notes: (p.notes || []).map(n => ({
            ...n,
            reactions: Array.isArray(n.reactions) ? n.reactions : [],
            subItems: Array.isArray(n.subItems) ? n.subItems : []
          }))
        }));
      }
      state.activeProfileId = state.profiles[0] ? state.profiles[0].id : 'b_slot_1';
      persistLocalOnly();
      return;
    }

    if (!loaded || !loaded.length) {
      state.profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    } else {
      // Reconcile with ground-truth laptop definitions
      state.profiles = DEFAULT_PROFILES.map(def => {
        const found = loaded.find(p => p.id === def.id || (p.chromeNo === def.chromeNo && p.profileDir === def.profileDir) || (p.profileDir === def.profileDir));
        if (!found) return { ...def };

        const cleanedNotes = (found.notes || []).filter(n => {
          const txt = (n.text || '').toLowerCase();
          return !SAMPLES_TO_PURGE.some(s => txt.includes(s));
        }).map(n => ({
          ...n,
          reactions: Array.isArray(n.reactions) ? n.reactions : [],
          subItems: Array.isArray(n.subItems) ? n.subItems : [],
          image: n.image || null,
          voiceClip: n.voiceClip || null,
          editedAt: n.editedAt || null,
          forwardedFrom: n.forwardedFrom || null
        }));

        return {
          ...def,
          // Always keep the true verified laptop name and email from ground truth
          name: def.name,
          email: def.email,
          taskbarSlot: def.taskbarSlot,
          winShortcut: def.winShortcut,
          timerUntil: found.timerUntil || null,
          timerDurationMs: found.timerDurationMs || null,
          isReset: !!found.isReset,
          isPinned: !!found.isPinned,
          pinnedAt: found.pinnedAt || null,
          isUnread: !!(found.isUnread && cleanedNotes.length > 0),
          stickyNote: found.stickyNote || '',
          customAvatar: found.customAvatar || null,
          notes: cleanedNotes
        };
      });
    }

    state.profiles.sort((a, b) => a.taskbarSlot - b.taskbarSlot);

    // If this device already has pending notes or timers from before Cloud Sync existed, stamp lastModified so it uploads on boot!
    if (!state.lastModified && hasAnyUserActivity(state.profiles)) {
      state.lastModified = now();
      try {
        localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      } catch (e) {}
    }

    // If opened via QR Code with embedded ?sync=... or ?m=... state, apply it immediately!
    const urlSyncObj = checkUrlSyncPacket();
    if (urlSyncObj) {
      if (urlSyncObj.type === 'full') {
        applySyncPacket(urlSyncObj.pkt, 'QR Scan');
      } else if (urlSyncObj.type === 'micro') {
        applyMicroSyncString(urlSyncObj.microB64);
      }
      setTimeout(() => showToast('📲 Synced Pending Notes & Active Timers from QR Code!'), 300);
      return;
    }

    persistLocalOnly();
  }

  function persistLocalOnly() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
      updateDocumentTitle();
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  function saveState(skipCloud = false) {
    try {
      state.lastModified = now();
      localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
      updateDocumentTitle();
      if (!skipCloud) {
        scheduleCloudPush();
      }
    } catch (e) {
      console.error('Failed to save state:', e);
      showToast('⚠️ Storage nearly full — consider deleting old large screenshots.');
    }
  }

  function getProfile(id) {
    return state.profiles.find(p => p.id === id) || state.profiles[0];
  }

  function hasMessages(profile) {
    return Array.isArray(profile.notes) && profile.notes.length > 0;
  }

  function countPending(profile) {
    return (profile.notes || []).filter(n => !n.done).length;
  }

  function totalPendingCount() {
    return state.profiles.reduce((sum, p) => sum + countPending(p), 0);
  }

  function totalTimersCount() {
    const cur = now();
    return state.profiles.filter(p => (p.timerUntil && p.timerUntil > cur) || p.isReset).length;
  }

  // Format complete date and time: mm/dd/yyyy hh:mm AM/PM
  function formatNoteDateTime(ts) {
    const d = new Date(ts || now());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${mm}/${dd}/${yyyy} ${timeStr}`;
  }

  // Format countdown string
  function formatRemaining(ms) {
    if (ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (days > 0) {
      return `${days}d ${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }

  // Compact timer label for pills
  function formatRemainingShort(ms) {
    if (ms <= 0) return '0m';
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (days > 0) return hrs > 0 ? `${days}d ${hrs}h` : `${days}d`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  // Daily Recharge Alarm Schedule Calculator
  function getNextAlarmInfo() {
    const d = new Date();
    const curMinutes = d.getHours() * 60 + d.getMinutes();

    for (const item of RECHARGE_SCHEDULE) {
      const itemMinutes = item[0] * 60 + item[1];
      if (itemMinutes > curMinutes) {
        return {
          diffMin: itemMinutes - curMinutes,
          title: item[3],
          type: item[2]
        };
      }
    }
    const minutesUntilTomorrow7am = (24 * 60 - curMinutes) + 7 * 60;
    return {
      diffMin: minutesUntilTomorrow7am,
      title: RECHARGE_SCHEDULE[0][3],
      type: RECHARGE_SCHEDULE[0][2]
    };
  }

  // Render Top Nav Clock Box
  function renderClockBox() {
    const box = $('#navClockBox');
    if (!box) return;
    const d = new Date();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    if (IS_BLANK_EDITION) {
      box.innerHTML = `<div class="nf-clock-digital">${timeStr}</div>`;
      return;
    }
    const alarm = getNextAlarmInfo();

    let diffText = '';
    if (alarm.diffMin >= 60) {
      const h = Math.floor(alarm.diffMin / 60);
      const m = alarm.diffMin % 60;
      diffText = `${h}h ${m}m`;
    } else {
      diffText = `${alarm.diffMin}m`;
    }

    box.innerHTML = `
      <div class="nf-clock-digital">${timeStr}</div>
      <a href="https://orlandopasion000.github.io/daily-recharge-alarm.html" target="_blank" rel="noopener noreferrer" class="nf-alarm-pill" title="Daily Recharge Alarm Schedule">
        ⏰ ${diffText} — ${esc(alarm.title)}
      </a>
    `;
  }

  // Small Green & White Radiant Gradient Orb (Replaces flat 🟢 emoji on Limit Reset)
  function renderGreenWhiteOrb() {
    return `<span class="radiant-green-white-orb" aria-hidden="true"></span>`;
  }

  // Render Interactive Pushpin Button:
  // - Unpinned: Small Red & White / Bloody Red Radiant Gradient SVG Pin
  // - Pinned:   Small Green & White Radiant Gradient SVG Pin
  function renderPinButton(profile) {
    const isPinned = !!(profile.isPinned && countPending(profile) > 0);
    if (!isPinned) {
      const rgid = `redPinGrad_${profile.id}`;
      const rnid = `redNeedleGrad_${profile.id}`;
      return `
        <button type="button" class="pin-btn unpinned" data-pin-id="${profile.id}" title="Click to pin ${esc(profile.name)} &amp; message to top">
          <svg class="pin-svg-radiant" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <defs>
              <linearGradient id="${rgid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="28%" stop-color="#FFD1D6"/>
                <stop offset="62%" stop-color="#FF1E27"/>
                <stop offset="86%" stop-color="#B8000A"/>
                <stop offset="100%" stop-color="#590004"/>
              </linearGradient>
              <linearGradient id="${rnid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#FF9EA8"/>
              </linearGradient>
            </defs>
            <g transform="rotate(45 12 12)">
              <!-- Needle -->
              <path d="M11 14 L13 14 L12.4 22.2 L12 23.2 L11.6 22.2 Z" fill="url(#${rnid})"/>
              <!-- Lower Flange / Collar -->
              <rect x="6" y="11" width="12" height="3.4" rx="1.7" fill="url(#${rgid})"/>
              <!-- Middle Cylinder Body -->
              <path d="M8.5 5.2 L15.5 5.2 L14.5 11.2 L9.5 11.2 Z" fill="url(#${rgid})"/>
              <!-- Top Cap with White & Crimson Radiant Highlight -->
              <rect x="7" y="2.2" width="10" height="3.3" rx="1.65" fill="#FFFFFF"/>
              <rect x="7.5" y="2.6" width="9" height="2.5" rx="1.25" fill="url(#${rgid})"/>
            </g>
          </svg>
        </button>
      `;
    }

    const gid = `pinGrad_${profile.id}`;
    const nid = `needleGrad_${profile.id}`;
    return `
      <button type="button" class="pin-btn pinned" data-pin-id="${profile.id}" title="Pinned to top — Click to return ${esc(profile.name)} to original location (${esc(profile.winShortcut)})">
        <svg class="pin-svg-radiant" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <defs>
            <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="32%" stop-color="#D1FAE5"/>
              <stop offset="68%" stop-color="#34D399"/>
              <stop offset="100%" stop-color="#10B981"/>
            </linearGradient>
            <linearGradient id="${nid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#A7F3D0"/>
            </linearGradient>
          </defs>
          <g transform="rotate(45 12 12)">
            <!-- Needle -->
            <path d="M11 14 L13 14 L12.4 22.2 L12 23.2 L11.6 22.2 Z" fill="url(#${nid})"/>
            <!-- Lower Flange / Collar -->
            <rect x="6" y="11" width="12" height="3.4" rx="1.7" fill="url(#${gid})"/>
            <!-- Middle Cylinder Body -->
            <path d="M8.5 5.2 L15.5 5.2 L14.5 11.2 L9.5 11.2 Z" fill="url(#${gid})"/>
            <!-- Top Cap with White Radiant Highlight -->
            <rect x="7" y="2.2" width="10" height="3.3" rx="1.65" fill="#FFFFFF"/>
            <rect x="7.5" y="2.6" width="9" height="2.5" rx="1.25" fill="url(#${gid})"/>
          </g>
        </svg>
      </button>
    `;
  }

  // Collect unique active reactions across a profile's pending notes for sidebar display
  function getSidebarReactionBadgesHtml(pendingNotes) {
    const seen = new Set();
    for (const n of pendingNotes) {
      if (Array.isArray(n.reactions)) {
        n.reactions.forEach(r => seen.add(r));
      }
    }
    if (!seen.size) return '';
    return `<span class="sidebar-reaction-badges">` +
      Array.from(seen).map(key => {
        const r = REACTIONS_MAP[key];
        if (!r) return '';
        return `<span class="sidebar-react-chip ${r.cls}" title="${esc(r.label)}">${r.icon}</span>`;
      }).join('') +
      `</span>`;
  }

  // Render Sidebar Profiles List
  function renderSidebar() {
    const list = $('#profileList');
    if (!list) return;

    const cur = now();
    const query = (state.searchQuery || '').toLowerCase().trim();
    const filter = state.currentFilter;

    // Filter profiles
    const filtered = state.profiles.filter(p => {
      const pendingCount = countPending(p);
      const isTimer = (p.timerUntil && p.timerUntil > cur) || p.isReset;

      if (filter === 'pending' && pendingCount === 0 && !p.isUnread) return false;
      if (filter === 'timers' && !isTimer) return false;

      if (!query) return true;
      const inName = p.name.toLowerCase().includes(query);
      const inEmail = (p.email || '').toLowerCase().includes(query);
      const inSlot = String(p.taskbarSlot).includes(query) || (p.winShortcut || '').toLowerCase().includes(query);
      const inNotes = (p.notes || []).some(n => (n.text || '').toLowerCase().includes(query));
      return inName || inEmail || inSlot || inNotes;
    });

    // Sort: Pinned profiles with pending messages go to the top; unpinned stay in exact original taskbarSlot order
    filtered.sort((a, b) => {
      const aPin = !!(a.isPinned && countPending(a) > 0);
      const bPin = !!(b.isPinned && countPending(b) > 0);
      if (aPin !== bPin) return aPin ? -1 : 1;
      if (aPin && bPin) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
      return a.taskbarSlot - b.taskbarSlot;
    });

    // Update filter badge counts
    $('#countAll').textContent = state.profiles.length;
    $('#countPending').textContent = totalPendingCount();
    $('#countTimers').textContent = totalTimersCount();
    updateDocumentTitle();

    if (!filtered.length) {
      list.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: var(--nf-text-muted); font-size: 13px;">
          No profiles found matching "${esc(query)}"
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(p => {
      const isActive = p.id === state.activeProfileId;
      const pendingCount = countPending(p);
      const canUnread = hasMessages(p);
      const isPinned = !!(p.isPinned && pendingCount > 0);
      const isTimer = p.timerUntil && p.timerUntil > cur;
      const isReset = p.isReset;
      const isUnread = !!(p.isUnread && canUnread);
      const avatarSrc = getAvatarSrc(p);

      const pendingNotes = (p.notes || []).filter(n => !n.done);
      let snippetHtml = '';
      let snippetClass = '';

      if (pendingNotes.length > 0) {
        const firstNote = pendingNotes[0];
        const mediaPrefix = firstNote.image ? '📸 ' : (firstNote.voiceClip ? '🎙️ ' : '');
        const displayMsg = firstNote.text ? `${mediaPrefix}${firstNote.text}` : (firstNote.image ? '📸 Screenshot attached' : '🎙️ Voice note');
        const reactBadges = getSidebarReactionBadgesHtml(pendingNotes);
        snippetHtml = `${renderPinButton(p)}<span class="snippet-msg-text">${esc(displayMsg)}</span>${reactBadges}`;
        snippetClass = isPinned ? 'pinned-glow' : 'pending-glow';
      } else if (isReset) {
        // Small Green & White Radiant Gradient for Limit Reset!
        snippetHtml = `${renderGreenWhiteOrb()}<span class="reset-msg-text">Limit Reset · Ready for work</span>`;
        snippetClass = 'reset-glow';
      } else if (isTimer) {
        snippetHtml = `⏳ Timer: ${formatRemainingShort(p.timerUntil - cur)} left`;
        snippetClass = 'timer-glow';
      } else if (isUnread) {
        snippetHtml = '● Marked as Unread — Check window next';
        snippetClass = 'unread-glow';
      }

      // Short slot tag e.g. W+3, W+4, #10
      const slotTag = p.winShortcut.startsWith('Win + ')
        ? `W+${p.winShortcut.replace('Win + ', '')}`
        : `#${p.taskbarSlot}`;

      const hasSubRowContent = Boolean(snippetHtml || pendingCount > 0 || isTimer || isReset);

      return `
        <div class="profile-item ${isActive ? 'active' : ''} ${isPinned ? 'is-pinned' : ''} ${isUnread ? 'is-unread' : ''}" data-id="${p.id}" ${canUnread ? 'title="Right-click to toggle Unread dot"' : ''}>
          <!-- Bigger Picture Avatar (52px) -->
          <div class="profile-avatar-wrap">
            <img src="${avatarSrc}" class="profile-avatar-img" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23111\\'/><text x=\\'50\\' y=\\'65\\' font-size=\\'40\\' text-anchor=\\'middle\\' fill=\\'%23fff\\'>${esc(p.name ? p.name[0] : 'C')}</text></svg>'">
            <span class="profile-slot-badge">${esc(slotTag)}</span>
            ${isUnread ? `<span class="avatar-unread-dot" title="Unread Bookmark"></span>` : ''}
          </div>

          <!-- Profile Details -->
          <div class="profile-text-content">
            <div class="profile-row-header">
              <span class="profile-name">${esc(p.name)}</span>
              <div class="profile-header-right">
                ${canUnread ? `<button type="button" class="unread-toggle-btn ${isUnread ? 'active' : ''}" data-unread-id="${p.id}" title="${isUnread ? 'Mark as Read' : 'Mark as Unread (Bookmark)'}">●</button>` : ''}
                <span class="profile-shortcut">${esc(p.winShortcut)}</span>
              </div>
            </div>
            ${hasSubRowContent ? `
              <div class="profile-row-sub">
                <div class="profile-snippet ${snippetClass}">${snippetHtml}</div>
                ${pendingCount > 0 ? `<span class="badge-pending-count">${pendingCount}</span>` : ''}
                ${isTimer ? `<span class="badge-timer-pill">⏳ ${formatRemainingShort(p.timerUntil - cur)}</span>` : ''}
                ${isReset ? `<span class="badge-reset-pill">${renderGreenWhiteOrb()}<span class="reset-pill-text">Reset</span></span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Attach interactive Pin click handlers
    $$('.pin-btn', list).forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const pid = btn.dataset.pinId;
        const prof = getProfile(pid);
        if (!prof) return;

        if (prof.isPinned) {
          prof.isPinned = false;
          prof.pinnedAt = null;
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          showToast(`Returned ${prof.name} to ${prof.winShortcut}`);
        } else {
          prof.isPinned = true;
          prof.pinnedAt = now();
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          list.scrollTo({ top: 0, behavior: 'smooth' });
          showToast(`Pinned ${prof.name} to top`);
        }
      };
    });

    // Attach Unread Dot toggle button click handlers
    $$('.unread-toggle-btn', list).forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const pid = btn.dataset.unreadId;
        const prof = getProfile(pid);
        if (!prof || !hasMessages(prof)) return;
        prof.isUnread = !prof.isUnread;
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(prof.isUnread ? `● Marked ${prof.name} as Unread` : `Cleared Unread mark on ${prof.name}`);
      };
    });

    // Attach item click & right-click (contextmenu) handlers
    $$('.profile-item', list).forEach(item => {
      item.onclick = () => {
        state.activeProfileId = item.dataset.id;
        if (window.innerWidth <= 768) {
          document.body.classList.add('mobile-chat-open');
        }
        renderSidebar();
        renderMainChat();
      };
      item.oncontextmenu = (e) => {
        const prof = getProfile(item.dataset.id);
        if (!prof || !hasMessages(prof)) return;
        e.preventDefault();
        prof.isUnread = !prof.isUnread;
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(prof.isUnread ? `● Marked ${prof.name} as Unread` : `Cleared Unread mark on ${prof.name}`);
      };
    });
  }

  // Render Right Main Chat & Notes Pane
  function renderMainChat() {
    const main = $('#chatMain');
    if (!main) return;

    const p = getProfile(state.activeProfileId);
    const cur = now();
    const isTimer = p.timerUntil && p.timerUntil > cur;
    const isReset = p.isReset;
    const rem = isTimer ? formatRemaining(p.timerUntil - cur) : '';
    const avatarSrc = getAvatarSrc(p);
    const notes = p.notes || [];
    const canUnread = hasMessages(p);
    const isUnread = !!(p.isUnread && canUnread);
    const w = state.wispr;

    main.innerHTML = `
      <!-- Header with Bigger Picture (60px), Sticky Note, Unread Bookmark & Rename Action -->
      <header class="chat-header">
        <div class="chat-header-profile">
          <button type="button" class="btn-mobile-back" id="btnMobileBackToList" title="Back to all profiles">
            ← Profiles
          </button>
          <img src="${avatarSrc}" class="chat-header-avatar" id="headerAvatarImg" title="Click to upload/change photo" alt="${esc(p.name)}">
          <div class="chat-header-info">
            <div class="chat-header-title">
              <span>Chrome #${p.chromeNo}: ${esc(p.name)}</span>
              ${isUnread ? `<span class="header-unread-pill">● UNREAD</span>` : ''}
            </div>
            <div class="chat-header-meta">
              ${esc(p.email)} · Taskbar Slot #${p.taskbarSlot}
            </div>
          </div>
        </div>

        <div class="chat-header-actions">
          ${IS_BLANK_EDITION ? `
            <button class="btn-header-action" id="btnAddSlotBlank" title="Add another taskbar Chrome profile slot">
              ➕ Add Profile
            </button>
          ` : ''}
          <button class="btn-header-action ${p.stickyNote ? 'sticky-active' : ''}" id="btnStickyNote" title="Set a permanent sticky header note for ${esc(p.name)}">
            📌 ${p.stickyNote ? 'Edit Sticky' : 'Sticky Note'}
          </button>
          ${canUnread ? `
            <button class="btn-header-action ${isUnread ? 'unread-active' : ''}" id="btnToggleUnreadHeader" title="Bookmark this profile as Unread (or right-click in sidebar)">
              ● ${isUnread ? 'Unread' : 'Mark Unread'}
            </button>
          ` : ''}
          <button class="btn-header-action" id="btnRenameProfile">
            ✏️ Rename
          </button>
        </div>
      </header>

      <!-- Clean Blank Edition Laptop Taskbar Auto-Discovery Banner -->
      ${IS_BLANK_EDITION ? `
        <div class="blank-scanner-banner">
          <div class="blank-scanner-info">
            <strong>💻 Clean Blank Edition · Laptop Taskbar Sync:</strong>
            <span>Auto-detect and load the Chrome profiles of this laptop in 1 click.</span>
          </div>
          <div class="blank-scanner-actions">
            <button type="button" class="btn-scanner-action primary" id="btnSelectLocalState" title="Select %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State to import all Chrome profiles">
              📂 Load Chrome "Local State"
            </button>
            <button type="button" class="btn-scanner-action" id="btnDownloadTaskbarScanner" title="Download 1-Click Windows Taskbar Scanner (.cmd)">
              ⚡ 1-Click Taskbar Scanner (.cmd)
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Enhancement #2: Permanent Sticky Header Note Banner (When Set) -->
      ${p.stickyNote ? `
        <div class="profile-sticky-banner" id="profileStickyBanner">
          <div class="sticky-banner-left">
            <span class="sticky-pin-tag">📌 STICKY</span>
            <span class="sticky-banner-text">${linkifyText(p.stickyNote)}</span>
          </div>
          <div class="sticky-banner-actions">
            <button type="button" class="btn-sticky-mini" id="btnEditStickyInline" title="Edit sticky note">✏️</button>
            <button type="button" class="btn-sticky-mini" id="btnClearStickyInline" title="Remove sticky note">✕</button>
          </div>
        </div>
      ` : ''}

      <!-- Quick AI Limit Cooldown Bar (Minimized & Responsive, 1d and 2d removed) -->
      <div class="quick-timer-bar">
        <span class="timer-bar-label">Start a quick timer:</span>
        <button class="timer-chip" data-min="15" data-label="15m">15m</button>
        <button class="timer-chip" data-min="30" data-label="30m">30m</button>
        <button class="timer-chip" data-min="45" data-label="45m">45m</button>
        <button class="timer-chip" data-min="60" data-label="1h">1h</button>
        <button class="timer-chip" data-min="120" data-label="2h">2h</button>
        <button class="timer-chip" data-min="180" data-label="3h">3h</button>
        <button class="timer-chip" data-min="300" data-label="5h">5h</button>
        <button class="timer-chip" data-min="720" data-label="12h">12h</button>

        <div class="timer-custom-wrap">
          <input type="number" id="customMinInput" class="timer-custom-input" placeholder="min" min="1" max="10000" value="">
          <button class="btn-start-custom" id="btnStartCustomTimer">Start ⏱️</button>
        </div>
      </div>

      <!-- Active Timer Countdown Banner -->
      ${isTimer ? `
        <div class="timer-active-banner">
          <span>⏳ Cooldown Active: <strong>${rem}</strong> remaining</span>
          <button class="btn-banner-clear" id="btnClearTimer">✕ Clear Timer</button>
        </div>
      ` : ''}

      <!-- Reset Limit Banner (Small Green & White Radiant Gradient) -->
      ${isReset ? `
        <div class="timer-reset-banner">
          <span class="reset-banner-row">${renderGreenWhiteOrb()}<span class="reset-banner-text">AI Limit Reset! Your credits &amp; quota are ready for work.</span></span>
          <button class="btn-banner-reset" id="btnDismissReset">✓ Acknowledge</button>
        </div>
      ` : ''}

      <!-- Notes Stream (Pure OLED Black Blank Space When Empty) -->
      <div class="notes-stream" id="notesStream">
        ${!notes.length ? '' : notes.map(n => {
          const isEditing = state.editingNoteId === n.id;
          const reactions = Array.isArray(n.reactions) ? n.reactions : [];
          const subItems = Array.isArray(n.subItems) ? n.subItems : [];

          return `
          <div class="note-item-wrap" data-nid="${n.id}">
            <div class="note-bubble ${n.done ? 'done' : ''} ${isEditing ? 'editing' : ''}">
              <!-- Hover Quick Reaction Bar (Messenger / Discord Style) -->
              <div class="note-reaction-picker" title="Tag message with priority reaction">
                ${REACTIONS_LIST.map(r => `
                  <button type="button" class="react-pick-btn ${reactions.includes(r.key) ? 'active' : ''}" data-action="toggle-reaction" data-nid="${n.id}" data-rkey="${r.key}" title="${esc(r.label)}">
                    ${r.icon}
                  </button>
                `).join('')}
              </div>

              <div class="note-body-col">
                ${n.forwardedFrom ? `
                  <div class="note-forwarded-tag">↪ Forwarded from <strong>${esc(n.forwardedFrom)}</strong></div>
                ` : ''}

                ${n.image ? `
                  <div class="note-media-wrap">
                    <img src="${n.image}" class="note-media-img" data-action="open-lightbox" data-nid="${n.id}" alt="Attached screenshot" title="Click to view full screen">
                  </div>
                ` : ''}

                ${n.voiceClip ? `
                  <div class="note-voice-wrap">
                    <span class="voice-badge">🎙️ Voice Note</span>
                    <audio controls src="${n.voiceClip}" class="note-audio-player"></audio>
                  </div>
                ` : ''}

                ${isEditing ? `
                  <div class="note-inline-editor">
                    <input type="text" class="note-inline-edit-input" id="inlineEditInput_${n.id}" value="${esc(n.text)}">
                    <button type="button" class="btn-inline-save" data-action="save-edit" data-nid="${n.id}">Save ✓</button>
                    <button type="button" class="btn-inline-cancel" data-action="cancel-edit" data-nid="${n.id}">Cancel</button>
                  </div>
                ` : (n.text ? `
                  <div class="note-text" data-action="dblclick-edit" data-nid="${n.id}" title="Double-click to edit inline">${linkifyText(n.text)}</div>
                ` : '')}

                <!-- Enhancement #4: Interactive Sub-Checklists Inside Message Bubble -->
                ${subItems.length > 0 ? `
                  <div class="note-subchecklist">
                    ${subItems.map(sub => `
                      <label class="subcheck-row ${sub.done ? 'sub-done' : ''}" data-action="toggle-subitem" data-nid="${n.id}" data-subid="${sub.id}">
                        <input type="checkbox" ${sub.done ? 'checked' : ''} tabindex="-1">
                        <span class="subcheck-text">${linkifyText(sub.text)}</span>
                        <button type="button" class="btn-subcheck-del" data-action="del-subitem" data-nid="${n.id}" data-subid="${sub.id}" title="Remove item">✕</button>
                      </label>
                    `).join('')}
                  </div>
                ` : ''}

                ${reactions.length > 0 ? `
                  <div class="note-reactions-row">
                    ${reactions.map(rkey => {
                      const r = REACTIONS_MAP[rkey];
                      if (!r) return '';
                      return `
                        <button type="button" class="note-reaction-pill ${r.cls}" data-action="toggle-reaction" data-nid="${n.id}" data-rkey="${r.key}" title="Click to remove ${esc(r.label)}">
                          <span>${r.icon}</span> <span>${esc(r.label)}</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                ` : ''}
              </div>

              <div class="note-bubble-actions">
                ${n.done ? `
                  <button class="btn-note-reopen" data-action="toggle-done" data-nid="${n.id}">↩ Reopen</button>
                ` : `
                  <button class="btn-note-done" data-action="toggle-done" data-nid="${n.id}">✓ Done</button>
                `}
                <button class="btn-note-action" data-action="copy-note" data-nid="${n.id}" title="Copy message text to clipboard">📋</button>
                <button class="btn-note-action" data-action="add-subitem" data-nid="${n.id}" title="Add checkable sub-item to this note">☑️</button>
                <button class="btn-note-action" data-action="start-edit" data-nid="${n.id}" title="Edit message inline">✏️</button>
                <button class="btn-note-action btn-note-forward" data-action="forward-note" data-nid="${n.id}" title="Forward or move task to another Chrome profile">↪ Forward</button>
                <button class="btn-note-delete" data-action="delete-note" data-nid="${n.id}" title="Delete note">🗑️</button>
              </div>
            </div>
            <div class="note-timestamp">
              ${formatNoteDateTime(n.createdAt)} · ${n.done ? 'Completed' : 'Pending'}
              ${n.editedAt ? ` · <span class="note-edited-label">(edited ${formatNoteDateTime(n.editedAt)})</span>` : ''}
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <!-- Pending Screenshot / Voice Clip Attachment Preview Strip -->
      ${(state.pendingAttachment || state.pendingVoiceClip) ? `
        <div class="attachment-preview-bar" id="attachmentPreviewBar">
          ${state.pendingAttachment ? `
            <div class="attach-thumb-box">
              <img src="${state.pendingAttachment}" class="attach-thumb-img" alt="Preview">
              <span class="attach-thumb-label">📸 Screenshot ready to send</span>
              <button type="button" class="btn-remove-attach" id="btnRemoveScreenshot" title="Remove screenshot">✕</button>
            </div>
          ` : ''}
          ${state.pendingVoiceClip ? `
            <div class="attach-thumb-box">
              <span class="attach-thumb-label">🎙️ Voice Memo clip attached</span>
              <audio controls src="${state.pendingVoiceClip}" class="attach-mini-audio"></audio>
              <button type="button" class="btn-remove-attach" id="btnRemoveVoiceClip" title="Remove voice clip">✕</button>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 🎙️ WISPR FLOW PRO Studio & Command Bar -->
      ${(w.panelOpen || w.isListening) ? `
        <div class="wispr-flow-bar ${w.isListening ? 'listening' : ''}" id="wisprFlowBar">
          <div class="wispr-top-row">
            <div class="wispr-brand-cluster">
              <span class="wispr-pro-badge">🎙️ WISPR FLOW PRO</span>
              <span class="wispr-status-pill" id="wisprStatusPill">
                ${w.isListening ? '🔴 LIVE DICTATION · UNLIMITED WORDS' : '⚡ READY · ALT+SPACE OR CLICK MIC'}
              </span>
            </div>

            <!-- Live Soundwave Frequency Bars -->
            <div class="wispr-waveform" id="wisprWaveform">
              ${Array.from({ length: 14 }).map((_, i) => `<span class="wispr-bar" style="height:${w.isListening ? (6 + (i % 4) * 4) : 4}px"></span>`).join('')}
            </div>

            <div class="wispr-metrics" id="wisprMetrics">
              <span><strong>${w.sessionWords}</strong> words</span>
              <span>·</span>
              <span id="wisprDurationLabel">Unlimited Flow</span>
            </div>
          </div>

          <div class="wispr-controls-row">
            <!-- Personalized Writing Style Selector -->
            <div class="wispr-control-group">
              <span class="wispr-ctrl-label">Style:</span>
              <button type="button" class="wispr-style-chip ${w.style === 'polish' ? 'active' : ''}" data-wstyle="polish" title="Removes filler words (um, uh) and auto-punctuates">✨ Auto-Polish</button>
              <button type="button" class="wispr-style-chip ${w.style === 'academic' ? 'active' : ''}" data-wstyle="academic" title="Formal DepEd &amp; scholarly capitalization">🎓 Academic / DepEd</button>
              <button type="button" class="wispr-style-chip ${w.style === 'action' ? 'active' : ''}" data-wstyle="action" title="Crisp imperative action-task formatting">⚡ Action Task</button>
              <button type="button" class="wispr-style-chip ${w.style === 'raw' ? 'active' : ''}" data-wstyle="raw" title="Exact verbatim speech">💬 Raw</button>
            </div>

            <!-- Command Mode, Auto-Send, Voice Memo & Personal Dictionary -->
            <div class="wispr-toggles-group">
              <button type="button" class="wispr-toggle-pill ${w.commandMode ? 'on' : ''}" id="btnWisprCommandMode" title="Say 'send note', 'pin profile', 'mark urgent', 'start timer 30 minutes', 'scratch that'">
                🗣️ Command Mode: ${w.commandMode ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-toggle-pill ${w.autoSend ? 'on' : ''}" id="btnWisprAutoSend" title="Automatically add note when you stop speaking">
                ⚡ Auto-Add: ${w.autoSend ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-toggle-pill ${w.recordAudioClip ? 'on' : ''}" id="btnWisprRecordClip" title="Also attach a playable audio recording to the note">
                🔊 Voice Memo: ${w.recordAudioClip ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-dict-btn" id="btnWisprDict" title="Personal Writing Style Dictionary (${w.dictionary.length} custom terms)">
                📚 + Teach Word (${w.dictionary.length})
              </button>
            </div>
          </div>

          <div class="wispr-live-preview" id="wisprLivePreview">
            ${w.interimText
              ? `<span class="wispr-interim-stream">🗣️ "${esc(w.interimText)}"</span>`
              : `<span class="wispr-cmd-hint">💡 Voice Commands: Say <em>"send note"</em>, <em>"mark urgent"</em>, <em>"pin profile"</em>, <em>"start timer 30 minutes"</em>, <em>"forward task"</em>, or <em>"scratch that"</em>.</span>`}
          </div>
        </div>
      ` : ''}

      <!-- Enhancement #1: 1-Click Quick-Task Templates Bar -->
      <div class="quick-templates-bar">
        <span class="templates-label">Quick task:</span>
        <div class="templates-chips-scroll">
          ${state.quickTemplates.map((tpl, idx) => `
            <button type="button" class="template-chip" data-tpl="${esc(tpl)}" data-tidx="${idx}" title="Click to add immediately · Shift+Click to insert in input · Right-click to remove">
              ${esc(tpl)}
            </button>
          `).join('')}
        </div>
        <button type="button" class="btn-add-template" id="btnManageTemplates" title="Add a custom 1-click quick task template">+ Template</button>
      </div>

      <!-- Composer Bar (Bottom) -->
      <div class="composer-bar">
        <button type="button" class="btn-composer-tool" id="btnAttachImage" title="Upload or attach screenshot (or press Ctrl+V)">
          📷
        </button>

        <div class="composer-input-wrap">
          <span class="composer-icon">💬</span>
          <input type="text" id="composerInput" class="composer-input" placeholder="Type, paste screenshot (Ctrl+V), or dictate for ${esc(p.name)}...">
        </div>

        <button type="button" class="btn-wispr-mic ${w.isListening ? 'listening' : ''}" id="btnWisprMic" title="Start/Stop Wispr Flow Pro Voice Dictation (Alt + Space)">
          <span class="mic-icon">${w.isListening ? '⏹️' : '🎙️'}</span>
          <span class="mic-label">${w.isListening ? 'Listening...' : 'Dictate'}</span>
        </button>

        <button type="button" class="btn-wispr-studio ${w.panelOpen ? 'active' : ''}" id="btnToggleFlowBar" title="Toggle Wispr Flow Pro Studio &amp; Voice Commands">
          ✨ Flow Pro
        </button>

        <button class="btn-composer-send" id="btnSendNote">Add ✓</button>
      </div>
    `;

    // Focus inline edit input if active
    if (state.editingNoteId) {
      const editInp = $(`#inlineEditInput_${state.editingNoteId}`, main);
      if (editInp) {
        editInp.focus();
        editInp.select();
        editInp.onkeydown = (e) => {
          if (e.key === 'Enter') saveInlineEdit(p, state.editingNoteId, editInp.value);
          if (e.key === 'Escape') {
            state.editingNoteId = null;
            renderMainChat();
          }
        };
      }
    }

    // Hook up interactive handlers
    // 0. Mobile Back to Profiles List button
    const btnMobileBack = $('#btnMobileBackToList');
    if (btnMobileBack) {
      btnMobileBack.onclick = () => {
        document.body.classList.remove('mobile-chat-open');
      };
    }

    // 1. Photo upload via clicking avatar
    const avatarImg = $('#headerAvatarImg');
    if (avatarImg) {
      avatarImg.onclick = () => {
        state.uploadTargetId = p.id;
        $('#globalPhotoInput').click();
      };
    }

    // 1b. Toggle Unread from header
    const unreadHeaderBtn = $('#btnToggleUnreadHeader');
    if (unreadHeaderBtn) {
      unreadHeaderBtn.onclick = () => {
        if (!hasMessages(p)) return;
        p.isUnread = !p.isUnread;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(p.isUnread ? `● Marked ${p.name} as Unread` : `Cleared Unread mark on ${p.name}`);
      };
    }

    // 1c. Sticky Note Header Button & Banner Controls
    const btnSticky = $('#btnStickyNote');
    if (btnSticky) btnSticky.onclick = () => promptStickyNote(p);
    const btnEditSticky = $('#btnEditStickyInline');
    if (btnEditSticky) btnEditSticky.onclick = () => promptStickyNote(p);
    const btnClearSticky = $('#btnClearStickyInline');
    if (btnClearSticky) {
      btnClearSticky.onclick = () => {
        p.stickyNote = '';
        saveState();
        renderMainChat();
        showToast(`Cleared sticky note on ${p.name}`);
      };
    }

    // 1d. Blank Edition controls
    const btnAddSlotBlank = $('#btnAddSlotBlank');
    if (btnAddSlotBlank) {
      btnAddSlotBlank.onclick = () => {
        const nextNum = state.profiles.length + 1;
        const newProf = {
          id: `b_slot_${uid()}`,
          profileDir: `Profile ${nextNum}`,
          chromeNo: nextNum,
          taskbarSlot: nextNum,
          winShortcut: nextNum <= 9 ? `Win + ${nextNum}` : `Slot #${nextNum}`,
          name: `Chrome Profile #${nextNum}`,
          email: `Taskbar Slot #${nextNum}`,
          gaia: '',
          timerUntil: null,
          timerDurationMs: null,
          isReset: false,
          isPinned: false,
          pinnedAt: null,
          isUnread: false,
          stickyNote: '',
          customAvatar: null,
          notes: []
        };
        state.profiles.push(newProf);
        state.activeProfileId = newProf.id;
        saveState();
        renderSidebar();
        renderMainChat();
        promptRename(newProf);
      };
    }
    const btnSelectLocalState = $('#btnSelectLocalState');
    if (btnSelectLocalState) {
      btnSelectLocalState.onclick = () => $('#localStateFileInput').click();
    }
    const btnDownloadScanner = $('#btnDownloadTaskbarScanner');
    if (btnDownloadScanner) {
      btnDownloadScanner.onclick = () => downloadLaptopTaskbarScannerCmd();
    }

    // 2. Rename profile
    const renameBtn = $('#btnRenameProfile');
    if (renameBtn) {
      renameBtn.onclick = () => promptRename(p);
    }

    // 3. Quick Timer Chips
    $$('.timer-chip', main).forEach(chip => {
      chip.onclick = () => {
        const mins = parseInt(chip.dataset.min, 10);
        startCooldown(p, mins, chip.dataset.label || `${mins}m`);
      };
    });

    // 4. Custom Timer
    const customStart = $('#btnStartCustomTimer');
    const customInput = $('#customMinInput');
    const triggerCustomTimer = () => {
      const mins = parseInt(customInput ? customInput.value : '', 10);
      if (isNaN(mins) || mins <= 0) return;
      startCooldown(p, mins, `${mins}m`);
    };
    if (customStart) {
      customStart.onclick = triggerCustomTimer;
    }
    if (customInput) {
      customInput.onkeydown = (e) => {
        if (e.key === 'Enter') triggerCustomTimer();
      };
    }

    // 5. Clear timer
    const clearBtn = $('#btnClearTimer');
    if (clearBtn) {
      clearBtn.onclick = () => {
        p.timerUntil = null;
        p.timerDurationMs = null;
        p.isReset = false;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Cleared cooldown timer for ${p.name}`);
      };
    }

    // 6. Dismiss reset
    const resetBtn = $('#btnDismissReset');
    if (resetBtn) {
      resetBtn.onclick = () => {
        p.isReset = false;
        p.timerUntil = null;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Acknowledged reset for ${p.name}`);
      };
    }

    // 7. Note actions (Done, Copy, Checklist, Edit, Forward, Reactions, Lightbox, Delete)
    $$('.notes-stream [data-action]', main).forEach(el => {
      const act = el.dataset.action;
      const nid = el.dataset.nid;

      if (act === 'dblclick-edit') {
        el.ondblclick = () => {
          state.editingNoteId = nid;
          renderMainChat();
        };
        return;
      }

      el.onclick = (e) => {
        e.stopPropagation();
        const note = (p.notes || []).find(n => n.id === nid);
        if (!note) return;

        if (act === 'toggle-done') {
          note.done = !note.done;
          if (note.done && window.soundMgr) window.soundMgr.playReadyChime();
          if (countPending(p) === 0) {
            p.isPinned = false;
            p.pinnedAt = null;
          }
          saveState();
          renderSidebar();
          renderMainChat();
        } else if (act === 'copy-note') {
          navigator.clipboard.writeText(note.text || '').then(() => {
            showToast('📋 Copied message to clipboard!');
          }).catch(() => {});
        } else if (act === 'add-subitem') {
          promptAddChecklistItem(p, note);
        } else if (act === 'toggle-subitem') {
          e.preventDefault();
          const subid = el.dataset.subid;
          const sub = (note.subItems || []).find(s => s.id === subid);
          if (sub) {
            sub.done = !sub.done;
            saveState();
            renderMainChat();
          }
        } else if (act === 'del-subitem') {
          e.preventDefault();
          const subid = el.dataset.subid;
          note.subItems = (note.subItems || []).filter(s => s.id !== subid);
          saveState();
          renderMainChat();
        } else if (act === 'delete-note') {
          p.notes = p.notes.filter(n => n.id !== nid);
          if (countPending(p) === 0) {
            p.isPinned = false;
            p.pinnedAt = null;
          }
          if (!hasMessages(p)) {
            p.isUnread = false;
          }
          saveState();
          renderSidebar();
          renderMainChat();
        } else if (act === 'start-edit') {
          state.editingNoteId = nid;
          renderMainChat();
        } else if (act === 'save-edit') {
          const inp = $(`#inlineEditInput_${nid}`, main);
          if (inp) saveInlineEdit(p, nid, inp.value);
        } else if (act === 'cancel-edit') {
          state.editingNoteId = null;
          renderMainChat();
        } else if (act === 'toggle-reaction') {
          const rkey = el.dataset.rkey;
          if (!Array.isArray(note.reactions)) note.reactions = [];
          if (note.reactions.includes(rkey)) {
            note.reactions = note.reactions.filter(k => k !== rkey);
          } else {
            note.reactions.push(rkey);
          }
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          renderMainChat();
        } else if (act === 'forward-note') {
          openForwardModal(p, note);
        } else if (act === 'open-lightbox') {
          openLightboxModal(note.image, note.text || p.name);
        }
      };
    });

    // 7b. Quick-Task Template Chips
    $$('.template-chip', main).forEach(chip => {
      chip.onclick = (e) => {
        const tplText = chip.dataset.tpl;
        if (!tplText) return;
        const inp = $('#composerInput');
        if (e.shiftKey && inp) {
          inp.value = inp.value ? `${inp.value.trim()} ${tplText}` : tplText;
          inp.focus();
          return;
        }
        if (!p.notes) p.notes = [];
        p.notes.push({
          id: uid(),
          text: tplText,
          image: null,
          voiceClip: null,
          reactions: [],
          subItems: [],
          createdAt: now(),
          editedAt: null,
          forwardedFrom: null,
          done: false
        });
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(`⚡ Added "${tplText}" to ${p.name}`);
      };
      chip.oncontextmenu = (e) => {
        e.preventDefault();
        const idx = parseInt(chip.dataset.tidx, 10);
        if (!isNaN(idx)) {
          const removed = state.quickTemplates.splice(idx, 1);
          saveTemplates();
          renderMainChat();
          showToast(`Removed template "${removed[0]}"`);
        }
      };
    });

    const btnManageTpl = $('#btnManageTemplates');
    if (btnManageTpl) {
      btnManageTpl.onclick = () => promptAddTemplate();
    }

    // 8. Screenshot attachment button & preview removal
    const btnAttach = $('#btnAttachImage');
    if (btnAttach) {
      btnAttach.onclick = () => $('#noteImageInput').click();
    }
    const btnRemImg = $('#btnRemoveScreenshot');
    if (btnRemImg) {
      btnRemImg.onclick = () => {
        state.pendingAttachment = null;
        renderMainChat();
      };
    }
    const btnRemVoice = $('#btnRemoveVoiceClip');
    if (btnRemVoice) {
      btnRemVoice.onclick = () => {
        state.pendingVoiceClip = null;
        renderMainChat();
      };
    }

    // Drag and drop screenshots onto notesStream
    const streamEl = $('#notesStream');
    if (streamEl) {
      streamEl.ondragover = (e) => {
        e.preventDefault();
        streamEl.classList.add('drag-over');
      };
      streamEl.ondragleave = () => streamEl.classList.remove('drag-over');
      streamEl.ondrop = async (e) => {
        e.preventDefault();
        streamEl.classList.remove('drag-over');
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
          if (imgFile) {
            const dataUrl = await compressImage(imgFile);
            state.pendingAttachment = dataUrl;
            renderMainChat();
            showToast('📸 Screenshot attached — press Enter or Add ✓ to post!');
          }
        }
      };
    }

    // 9. Wispr Flow Pro controls
    const btnMic = $('#btnWisprMic');
    if (btnMic) {
      btnMic.onclick = () => toggleWisprDictation();
    }
    const btnFlowBar = $('#btnToggleFlowBar');
    if (btnFlowBar) {
      btnFlowBar.onclick = () => {
        state.wispr.panelOpen = !state.wispr.panelOpen;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    $$('.wispr-style-chip', main).forEach(chip => {
      chip.onclick = () => {
        state.wispr.style = chip.dataset.wstyle;
        saveWisprPrefs();
        renderMainChat();
        showToast(`✨ Wispr Writing Style: ${chip.textContent.trim()}`);
      };
    });
    const btnCmdMode = $('#btnWisprCommandMode');
    if (btnCmdMode) {
      btnCmdMode.onclick = () => {
        state.wispr.commandMode = !state.wispr.commandMode;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnAutoSend = $('#btnWisprAutoSend');
    if (btnAutoSend) {
      btnAutoSend.onclick = () => {
        state.wispr.autoSend = !state.wispr.autoSend;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnRecClip = $('#btnWisprRecordClip');
    if (btnRecClip) {
      btnRecClip.onclick = () => {
        state.wispr.recordAudioClip = !state.wispr.recordAudioClip;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnDict = $('#btnWisprDict');
    if (btnDict) {
      btnDict.onclick = () => openWisprDictionaryModal();
    }

    // 10. Add note
    const input = $('#composerInput');
    const sendBtn = $('#btnSendNote');
    const handleAdd = () => {
      const text = input ? input.value.trim() : '';
      if (!text && !state.pendingAttachment && !state.pendingVoiceClip) return;
      if (!p.notes) p.notes = [];

      const initialReactions = [];
      if (state.pendingReactionTag) {
        initialReactions.push(state.pendingReactionTag);
        state.pendingReactionTag = null;
      }

      p.notes.push({
        id: uid(),
        text,
        image: state.pendingAttachment || null,
        voiceClip: state.pendingVoiceClip || null,
        reactions: initialReactions,
        subItems: [],
        createdAt: now(),
        editedAt: null,
        forwardedFrom: null,
        done: false
      });

      if (input) input.value = '';
      state.pendingAttachment = null;
      state.pendingVoiceClip = null;
      saveState();
      renderSidebar();
      renderMainChat();
      showToast(`Added note to ${p.name}`);
      if (window.soundMgr) window.soundMgr.playClick();

      // Scroll to bottom
      const stream = $('#notesStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    };

    if (sendBtn) sendBtn.onclick = handleAdd;
    if (input) {
      input.onkeydown = (e) => {
        if (e.key === 'Enter') handleAdd();
      };
    }
  }

  // Save inline edited message
  function saveInlineEdit(profile, noteId, newText) {
    const trimmed = (newText || '').trim();
    const note = (profile.notes || []).find(n => n.id === noteId);
    if (note && (trimmed || note.image || note.voiceClip)) {
      note.text = trimmed;
      note.editedAt = now();
      saveState();
      showToast('✏️ Updated message');
    }
    state.editingNoteId = null;
    renderSidebar();
    renderMainChat();
  }

  // Enhancement #1 Modal: Add Quick-Task Template
  function promptAddTemplate() {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>⚡ Add 1-Click Quick-Task Template</h3>
        <input type="text" id="newTplInput" class="rename-input" placeholder="e.g. 📄 Print Grade 10 Exam">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Tip: Right-click any template chip above the composer to delete it.
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelTpl">Cancel</button>
          <button class="btn-composer-send" id="btnSaveTpl" style="padding:8px 18px;">Add Chip ✓</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#newTplInput', backdrop);
    inp.focus();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      const val = inp.value.trim();
      if (val) {
        state.quickTemplates.push(val);
        saveTemplates();
        renderMainChat();
        showToast(`⚡ Added template "${val}"`);
      }
      close();
    };
    $('#btnCancelTpl', backdrop).onclick = close;
    $('#btnSaveTpl', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // Enhancement #2 Modal: Permanent Sticky Note Per Profile
  function promptStickyNote(profile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>📌 Sticky Header Note for ${esc(profile.name)}</h3>
        <input type="text" id="stickyValInput" class="rename-input" value="${esc(profile.stickyNote || '')}" placeholder="e.g. Dedicated to Scite Research · https://scite.ai">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Stays pinned at the top of ${esc(profile.name)}'s chat window even when daily notes are cleared. URLs become clickable automatically!
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelSticky">Cancel</button>
          <button class="btn-composer-send" id="btnSaveSticky" style="padding:8px 18px;">Save Sticky 📌</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#stickyValInput', backdrop);
    inp.focus();
    inp.select();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      profile.stickyNote = inp.value.trim();
      saveState();
      renderMainChat();
      showToast(profile.stickyNote ? `📌 Sticky note pinned for ${profile.name}` : `Cleared sticky note`);
      close();
    };
    $('#btnCancelSticky', backdrop).onclick = close;
    $('#btnSaveSticky', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // Enhancement #4 Modal: Add Sub-Checklist Item(s) Inside a Message Bubble
  function promptAddChecklistItem(profile, note) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>☑️ Add Sub-Checklist Items</h3>
        <input type="text" id="subItemValInput" class="rename-input" placeholder="Type item (or separate multiple with commas)...">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Tip: Separate multiple items with commas (e.g. <em>Print Math 8, Print Math 10, Sign logbook</em>) to add them all at once!
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelSub">Cancel</button>
          <button class="btn-composer-send" id="btnSaveSub" style="padding:8px 18px;">Add Checklist  ☑️</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#subItemValInput', backdrop);
    inp.focus();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      const raw = inp.value.trim();
      if (raw) {
        if (!Array.isArray(note.subItems)) note.subItems = [];
        const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
        parts.forEach(part => {
          note.subItems.push({ id: uid(), text: part, done: false });
        });
        saveState();
        renderMainChat();
        showToast(`☑️ Added ${parts.length} checklist item(s)`);
      }
      close();
    };
    $('#btnCancelSub', backdrop).onclick = close;
    $('#btnSaveSub', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // Enhancement #6: Jump to Next Profile with Pending Note or Limit Reset
  function jumpToNextReadyProfile() {
    const actionable = state.profiles.filter(p => countPending(p) > 0 || p.isReset || p.isUnread);
    if (!actionable.length) {
      showToast('✨ All 22 profiles are clear — no pending notes or active resets!');
      return;
    }
    const curIdx = actionable.findIndex(p => p.id === state.activeProfileId);
    const nextProf = actionable[(curIdx + 1) % actionable.length];
    state.activeProfileId = nextProf.id;
    renderSidebar();
    renderMainChat();
    const activeEl = $(`.profile-item[data-id="${nextProf.id}"]`);
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    showToast(`⚡ Jumped to ${nextProf.name} (${nextProf.winShortcut})`);
  }

  // Full-Screen Lightbox Modal for Pasted/Dropped Screenshots
  function openLightboxModal(imgSrc, caption) {
    if (!imgSrc) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="lightbox-modal">
        <img src="${imgSrc}" class="lightbox-img" alt="Full screen screenshot">
        <div class="lightbox-footer">
          <span class="lightbox-caption">${esc(caption || 'Screenshot')}</span>
          <button type="button" class="btn-composer-send" id="btnCloseLightbox" style="padding:7px 18px;">Close ✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    $('#btnCloseLightbox', backdrop).onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // 🔄 Forward / Move Task to Another Chrome Profile Modal
  function openForwardModal(sourceProfile, note) {
    const cur = now();
    const others = state.profiles.filter(p => p.id !== sourceProfile.id);

    // Find next available profile without an active cooldown timer
    const sortedAfter = [
      ...others.filter(p => p.taskbarSlot > sourceProfile.taskbarSlot),
      ...others.filter(p => p.taskbarSlot < sourceProfile.taskbarSlot)
    ];
    const nextAvailable = sortedAfter.find(p => !(p.timerUntil && p.timerUntil > cur)) || others[0];

    const executeTransfer = (targetProfile, removeSource) => {
      if (!targetProfile.notes) targetProfile.notes = [];
      targetProfile.notes.push({
        id: uid(),
        text: note.text,
        image: note.image || null,
        voiceClip: note.voiceClip || null,
        reactions: Array.isArray(note.reactions) ? [...note.reactions] : [],
        subItems: Array.isArray(note.subItems) ? JSON.parse(JSON.stringify(note.subItems)) : [],
        createdAt: now(),
        editedAt: null,
        forwardedFrom: sourceProfile.name,
        done: false
      });

      if (removeSource) {
        sourceProfile.notes = (sourceProfile.notes || []).filter(n => n.id !== note.id);
        if (countPending(sourceProfile) === 0) {
          sourceProfile.isPinned = false;
          sourceProfile.pinnedAt = null;
        }
        if (!hasMessages(sourceProfile)) {
          sourceProfile.isUnread = false;
        }
      }

      state.activeProfileId = targetProfile.id;
      saveState();
      if (window.soundMgr) window.soundMgr.playReadyChime();
      renderSidebar();
      renderMainChat();
      showToast(`${removeSource ? '↪ Moved' : '📋 Copied'} task to ${targetProfile.name} (${targetProfile.winShortcut})`);
    };

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="forward-modal">
        <div class="forward-modal-header">
          <h3>↪ Forward or Move Task</h3>
          <button type="button" class="btn-banner-clear" id="btnCloseForward">✕</button>
        </div>

        <div class="forward-task-preview">
          "${esc(note.text || (note.image ? '[Screenshot]' : '[Voice Note]'))}"
        </div>

        ${nextAvailable ? `
          <button type="button" class="btn-forward-QuickNext" id="btnQuickMoveNext">
            <span>⚡ 1-Click Move to Next Available: <strong>${esc(nextAvailable.name)}</strong> (${esc(nextAvailable.winShortcut)})</span>
            <span>↪ Move Now</span>
          </button>
        ` : ''}

        <input type="text" id="forwardSearchInput" class="rename-input" placeholder="Search target Chrome profile...">

        <div class="forward-profiles-list" id="forwardProfilesList">
          ${others.map(prof => {
            const isCooling = prof.timerUntil && prof.timerUntil > cur;
            const statusLabel = isCooling
              ? `⏳ ${formatRemainingShort(prof.timerUntil - cur)} left`
              : `🟢 Available`;
            return `
              <div class="forward-profile-row" data-fname="${esc(prof.name.toLowerCase())} ${esc(prof.winShortcut.toLowerCase())}">
                <div class="forward-prof-info">
                  <img src="${getAvatarSrc(prof)}" class="forward-prof-avatar" alt="${esc(prof.name)}">
                  <div>
                    <div class="forward-prof-name">${esc(prof.name)} <span class="forward-prof-slot">${esc(prof.winShortcut)}</span></div>
                    <div class="forward-prof-status ${isCooling ? 'cooling' : 'ready'}">${statusLabel}</div>
                  </div>
                </div>
                <div class="forward-prof-btns">
                  <button type="button" class="btn-fwd-move" data-target-id="${prof.id}" data-mode="move" title="Move task here &amp; remove from ${esc(sourceProfile.name)}">↪ Move</button>
                  <button type="button" class="btn-fwd-copy" data-target-id="${prof.id}" data-mode="copy" title="Copy task here">📋 Copy</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    $('#btnCloseForward', backdrop).onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

    const quickBtn = $('#btnQuickMoveNext', backdrop);
    if (quickBtn && nextAvailable) {
      quickBtn.onclick = () => {
        close();
        executeTransfer(nextAvailable, true);
      };
    }

    const searchInp = $('#forwardSearchInput', backdrop);
    if (searchInp) {
      searchInp.focus();
      searchInp.oninput = () => {
        const q = searchInp.value.toLowerCase().trim();
        $$('.forward-profile-row', backdrop).forEach(row => {
          row.style.display = (!q || row.dataset.fname.includes(q)) ? 'flex' : 'none';
        });
      };
    }

    $$('[data-target-id]', backdrop).forEach(btn => {
      btn.onclick = () => {
        const target = getProfile(btn.dataset.targetId);
        const isMove = btn.dataset.mode === 'move';
        close();
        if (target) executeTransfer(target, isMove);
      };
    });
  }

  // =========================================================================
  // 📲 APP DISTRIBUTION & COMMAND SUITE (PWA Install, Mobile QR, iOS Guide, Backup, Blank Edition)
  // =========================================================================
  function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // Download Zero-Warning Windows Desktop App Launcher (.cmd)
  function downloadWindowsDesktopLauncherCmd(isBlank = false) {
    const targetUrl = isBlank ? BLANK_APP_URL : LIVE_APP_URL;
    const appTitle = isBlank ? 'OrlandoChrome Blank Edition' : 'OrlandoChrome';
    const shortcutName = isBlank ? 'OrlandoChrome-Blank.url' : 'OrlandoChrome.url';
    const cmdContent = [
      '@echo off',
      'title ' + appTitle + ' Desktop App Installer',
      'echo ========================================================',
      'echo   Installing ' + appTitle + ' to Desktop...',
      'echo ========================================================',
      'set "DESKTOP=%USERPROFILE%\\Desktop"',
      '(',
      '  echo [InternetShortcut]',
      '  echo URL=' + targetUrl,
      '  echo IconIndex=0',
      ') > "%DESKTOP%\\' + shortcutName + '"',
      'start "" chrome.exe --app="' + targetUrl + '" 2>nul || start "" msedge.exe --app="' + targetUrl + '" 2>nul || start "" "' + targetUrl + '"',
      'exit'
    ].join('\r\n');
    downloadTextFile(isBlank ? 'OrlandoChrome-Blank-Desktop-App.cmd' : 'OrlandoChrome-Desktop-App.cmd', cmdContent);
    showToast('⬇ Downloaded Windows Desktop App Launcher (.cmd)!');
  }

  // Download 1-Click Laptop Taskbar Auto-Scanner (.cmd) that reads the installed laptop's Chrome profiles & opens Blank Edition synced!
  function downloadLaptopTaskbarScannerCmd() {
    const cmdContent = [
      '@echo off',
      'title OrlandoChrome - Laptop Taskbar Chrome Profile Auto-Scanner',
      'echo ====================================================================',
      'echo   Scanning this laptop\'s Chrome profiles and taskbar shortcuts...',
      'echo ====================================================================',
      'powershell -NoProfile -ExecutionPolicy Bypass -Command ^',
      '  "$lsPath = Join-Path $env:LOCALAPPDATA \'Google\\Chrome\\User Data\\Local State\'; ^',
      '   if (-not (Test-Path $lsPath)) { Write-Host \'Chrome Local State not found.\'; exit }; ^',
      '   $json = Get-Content $lsPath -Raw -Encoding UTF8 | ConvertFrom-Json; ^',
      '   $cache = $json.profile.info_cache; ^',
      '   $list = @(); $idx = 1; ^',
      '   foreach ($prop in $cache.PSObject.Properties) { ^',
      '     $v = $prop.Value; ^',
      '     $slot = $idx + 2; ^',
      '     $sc = if ($slot -le 9) { \'Win + \' + $slot } else { \'Slot #\' + $slot }; ^',
      '     $list += @{ id=(\'b_tb_\'+$slot); profileDir=$prop.Name; chromeNo=$idx; taskbarSlot=$slot; winShortcut=$sc; name=($v.name); email=($v.user_name); gaia=($v.gaia_name) }; ^',
      '     $idx++; ^',
      '   }; ^',
      '   $outJson = ($list | ConvertTo-Json -Compress); ^',
      '   $outFile = Join-Path $env:USERPROFILE \'Desktop\\my-laptop-chrome-profiles.json\'; ^',
      '   Set-Content -Path $outFile -Value $outJson -Encoding UTF8; ^',
      '   $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($outJson)); ^',
      '   $url = \'' + BLANK_APP_URL + '&import_b64=\' + $b64; ^',
      '   Start-Process \'chrome.exe\' -ArgumentList (\'--app=\'+$url)"',
      'exit'
    ].join('\r\n');
    downloadTextFile('OrlandoChrome-Taskbar-AutoScanner.cmd', cmdContent);
    showToast('⚡ Downloaded Laptop Taskbar Auto-Scanner (.cmd)!');
  }

  // Export Full JSON Backup (Enhancement #7)
  function exportFullBackupJson() {
    const payload = {
      app: 'OrlandoChrome',
      version: '5.0',
      edition: IS_BLANK_EDITION ? 'blank' : 'personal',
      exportedAt: new Date().toISOString(),
      profiles: state.profiles,
      quickTemplates: state.quickTemplates,
      wispr: {
        style: state.wispr.style,
        commandMode: state.wispr.commandMode,
        autoSend: state.wispr.autoSend,
        recordAudioClip: state.wispr.recordAudioClip,
        dictionary: state.wispr.dictionary
      }
    };
    const dateTag = new Date().toISOString().slice(0, 10);
    downloadTextFile(`orlandochrome-backup-${dateTag}.json`, JSON.stringify(payload, null, 2), 'application/json');
    showToast('💾 Backup exported (.json)!');
  }

  // Download Standalone Offline Single-File HTML
  async function downloadStandaloneHtml(isBlank = false) {
    try {
      const [cssRes, jsRes] = await Promise.all([
        fetch('styles.css').then(r => r.text()).catch(() => ''),
        fetch('app.js').then(r => r.text()).catch(() => '')
      ]);
      const standaloneHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OrlandoChrome · Standalone Offline Edition</title>
<style>${cssRes}</style>
</head>
<body class="netflix-messenger-theme">
${document.body.innerHTML}
<script>
${isBlank ? "history.replaceState({}, '', '?edition=blank');" : ""}
${jsRes}
</script>
</body>
</html>`;
      downloadTextFile(isBlank ? 'OrlandoChrome-Blank-Standalone.html' : 'OrlandoChrome-Standalone.html', standaloneHtml, 'text/html');
      showToast('💾 Downloaded Standalone (.html) App!');
    } catch (e) {
      showToast('⚠️ Failed to bundle standalone HTML.');
    }
  }

  // High-Contrast Instant-Scan QR Theme Palette Definitions (All Dark-on-Light for 0.1s Camera Lock!)
  const QR_THEMES = {
    instant: { label: '⚡ Instant Scan', fg: '000000', bg: 'ffffff', accent: '#ff2e38', glow: 'rgba(229, 9, 20, 0.55)' },
    crimson: { label: '🔴 Crimson Core', fg: '6b0005', bg: 'fff5f5', accent: '#ff2e38', glow: 'rgba(229, 9, 20, 0.65)' },
    emerald: { label: '🟢 Emerald Core', fg: '022c22', bg: 'ecfdf5', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.55)' },
    gold:    { label: '✨ Royal Gold',   fg: '1c1404', bg: 'fef9e7', accent: '#e5c97b', glow: 'rgba(226, 200, 125, 0.5)' }
  };

  // Unified Holographic App Distribution, Giant Instant-Scan QR & Cross-Device Live Sync Command Suite
  function openAppDistributionSuiteModal() {
    // Immediately push current state to cloud if this device has active notes/timers
    if (hasAnyUserActivity(state.profiles)) {
      pushToCloudNow(false);
    } else {
      pullFromCloud(false, false);
    }

    let isBlankTarget = IS_BLANK_EDITION;
    let activeThemeKey = (state.qrTheme && QR_THEMES[state.qrTheme]) ? state.qrTheme : 'instant';
    let isQrZoomed = false;

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';

    const renderModalContent = () => {
      const t = QR_THEMES[activeThemeKey] || QR_THEMES.instant;
      const fastQrUrl = buildFastQrUrl(isBlankTarget, false);
      const fullShareUrl = buildLiveSyncUrl(isBlankTarget);
      const qrSizePx = isQrZoomed ? 420 : 300;
      // ecc=L + margin=16 + unobscured modules + short URL = Giant, crisp QR blocks that scan in 0.1s!
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=440x440&ecc=L&margin=16&color=${t.fg}&bgcolor=${t.bg}&data=${encodeURIComponent(fastQrUrl)}`;

      const pendingTotal = totalPendingCount();
      const timersTotal = totalTimersCount();
      const pinnedTotal = state.profiles.filter(p => p.isPinned && countPending(p) > 0).length;

      backdrop.innerHTML = `
        <div class="qr-studio-modal unified-command-suite" style="--qr-accent:${t.accent}; --qr-glow:${t.glow};">
          <!-- Unified Holographic Header -->
          <div class="qr-studio-header">
            <div class="qr-studio-title-wrap">
              <div class="qr-studio-title-row">
                <img src="oc-logo.svg" class="suite-oc-mini-logo" alt="OC">
                <h3>App Distribution &amp; Live Sync Command Suite</h3>
                <span class="qr-studio-badge-live">${renderGreenWhiteOrb()}<span>LIVE CLOUD · PWA READY</span></span>
              </div>
              <p class="qr-studio-sub">
                Instant-Scan Giant QR, Real-Time Cross-Device Sync (Windows · iPhone/iOS · Android), 1-Click Native Install &amp; Taskbar Scanner.
              </p>
            </div>
            <button type="button" class="btn-banner-clear" id="btnCloseAppSuite" title="Close">✕</button>
          </div>

          <!-- Workspace Edition Switcher (Replaces Redundant Bottom Blank Card) -->
          <div class="qr-edition-tabs">
            <button type="button" class="qr-edition-tab ${!isBlankTarget ? 'active' : ''}" id="tabQrPersonal">
              👑 My Synced Workspace (${pendingTotal} Pending · ${timersTotal} Timers)
            </button>
            <button type="button" class="qr-edition-tab ${isBlankTarget ? 'active' : ''}" id="tabQrBlank">
              🎁 Clean Blank Edition (For Any Other Laptop / Phone)
            </button>
          </div>

          <!-- Main 2-Column Holographic Command Deck -->
          <div class="qr-studio-body ${isQrZoomed ? 'qr-zoomed-layout' : ''}">
            <!-- Left Column: Giant Unobscured Instant-Scan QR Showcase -->
            <div class="qr-holo-column">
              <div class="qr-stage-top-bar">
                <span class="qr-scan-ready-tag">📸 Instant Camera Lock · High Contrast</span>
                <button type="button" class="btn-qr-zoom-toggle" id="btnToggleQrZoom" title="Toggle Giant 420px QR Size">
                  ${isQrZoomed ? '🗕 Normal (300px)' : '🔍 Enlarge (420px)'}
                </button>
              </div>

              <div class="qr-holo-stage" id="qrHoloStage">
                <span class="qr-corner tl"></span>
                <span class="qr-corner tr"></span>
                <span class="qr-corner bl"></span>
                <span class="qr-corner br"></span>
                <div class="qr-laser-beam"></div>

                <div class="qr-img-wrapper" style="width:${qrSizePx}px; height:${qrSizePx}px;">
                  <img src="${qrApiUrl}" crossorigin="anonymous" class="qr-code-img-holo" id="qrHoloImg" style="width:${qrSizePx}px; height:${qrSizePx}px;" alt="OrlandoChrome Instant Scan QR Code">
                </div>
              </div>

              <!-- QR Color Theme Selector Pills -->
              <div class="qr-theme-pills">
                ${Object.entries(QR_THEMES).map(([k, val]) => `
                  <button type="button" class="qr-theme-pill ${activeThemeKey === k ? 'active' : ''}" data-qtheme="${k}">
                    ${val.label}
                  </button>
                `).join('')}
              </div>

              <!-- Direct QR Share & Poster Row -->
              <div class="qr-actions-grid" style="width:100%;">
                <button type="button" class="btn-composer-send" id="btnQrCopyUrl" style="justify-content:center; padding:8px 10px; font-size:0.74rem;">
                  📋 Copy Sync Link
                </button>
                <button type="button" class="btn-suite-dark" id="btnQrDownloadPng" style="padding:8px 10px; font-size:0.74rem;">
                  🖼️ Save Poster
                </button>
                <button type="button" class="btn-suite-dark" id="btnQrNativeShare" style="padding:8px 10px; font-size:0.74rem;">
                  📲 Share...
                </button>
              </div>
            </div>

            <!-- Right Column: 3 Advanced Command Modules (Zero Redundancy) -->
            <div class="qr-telemetry-column">
              <!-- Module 1: Cross-Device Live Cloud Sync Telemetry -->
              <div class="qr-telemetry-card">
                <div class="qr-telemetry-header">
                  <span>☁️ Cross-Device Live Cloud Sync (Windows · iOS · Android)</span>
                  <span class="qr-telemetry-sub">● Auto-Sync Active</span>
                </div>
                <div class="qr-metrics-grid">
                  <div class="qr-metric-box red">
                    <span class="qr-metric-num">${pendingTotal}</span>
                    <span class="qr-metric-lbl">🔴 Pending Notes</span>
                  </div>
                  <div class="qr-metric-box amber">
                    <span class="qr-metric-num">${timersTotal}</span>
                    <span class="qr-metric-lbl">⏳ Active Timers</span>
                  </div>
                  <div class="qr-metric-box green">
                    <span class="qr-metric-num">${pinnedTotal}</span>
                    <span class="qr-metric-lbl">📌 Pinned Top</span>
                  </div>
                </div>
                <div class="qr-sync-btns-row">
                  <button type="button" class="btn-qr-sync-now" id="btnQrForcePush">
                    ⚡ Push to Phone / Cloud Now
                  </button>
                  <button type="button" class="btn-qr-pull-now" id="btnQrForcePull">
                    📥 Pull Latest from Cloud
                  </button>
                </div>
              </div>

              <!-- Module 2: Install to Device & Laptop Taskbar Auto-Sync -->
              <div class="qr-telemetry-card">
                <div class="qr-telemetry-header">
                  <span>💻 Device Install &amp; Laptop Taskbar Sync</span>
                  <span class="qr-telemetry-sub" style="color:#ffd1d6; border-color:rgba(255,77,88,0.35); background:rgba(229,9,20,0.14);">Zero Warnings</span>
                </div>
                <button type="button" class="btn-suite-radiant-red" id="btnPwaOneClickInstall">
                  ⚡ 1-Click Install App (Windows · Mac · iOS · Android)
                </button>
                <div class="suite-unified-btn-row">
                  <button type="button" class="btn-suite-dark" id="btnSuiteWinApp" title="Download Windows Native App Launcher (.cmd)">
                    🖥️ Windows (.cmd)
                  </button>
                  <button type="button" class="btn-suite-dark" id="btnSuiteTaskbarSync" title="Auto-Scan this laptop's Chrome Taskbar profiles">
                    🔄 Taskbar Sync (.cmd)
                  </button>
                  <button type="button" class="btn-suite-dark" id="btnSuiteStandaloneHtml" title="Download Single-File Offline HTML">
                    💾 Offline (.html)
                  </button>
                  ${isBlankTarget ? `
                    <button type="button" class="btn-suite-dark" id="btnOpenBlankWebApp" style="border-color:#e5c97b; color:#e5c97b;">
                      🚀 Open Blank App
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Module 3: Workspace Backup & Mobile Home Screen Quick Guide -->
              <div class="qr-telemetry-card">
                <div class="qr-telemetry-header">
                  <span>🛡️ JSON Workspace Backup &amp; iPhone Setup</span>
                </div>
                <div class="suite-unified-btn-row" style="grid-template-columns: 1fr 1fr;">
                  <button type="button" class="btn-suite-dark" id="btnSuiteExportJson">
                    💾 Export Backup (.json)
                  </button>
                  <button type="button" class="btn-suite-dark" id="btnSuiteImportJson">
                    📁 Restore Backup (.json)
                  </button>
                </div>
                <div class="ios-compact-tip">
                  🍏 <strong>iPhone / iOS &amp; Android:</strong> Point your camera at the giant QR code to open with all Pending Notes &amp; Timers loaded, then tap <strong>Share (⬆️) → Add to Home Screen</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire up interactive modal handlers
      const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
      $('#btnCloseAppSuite', backdrop).onclick = close;
      backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

      $('#tabQrPersonal', backdrop).onclick = () => {
        isBlankTarget = false;
        renderModalContent();
      };
      $('#tabQrBlank', backdrop).onclick = () => {
        isBlankTarget = true;
        renderModalContent();
      };

      $('#btnToggleQrZoom', backdrop).onclick = () => {
        isQrZoomed = !isQrZoomed;
        renderModalContent();
      };

      $$('.qr-theme-pill', backdrop).forEach(pill => {
        pill.onclick = () => {
          activeThemeKey = pill.dataset.qtheme;
          state.qrTheme = activeThemeKey;
          renderModalContent();
        };
      });

      $('#btnQrForcePush', backdrop).onclick = async () => {
        const btn = $('#btnQrForcePush', backdrop);
        if (btn) btn.textContent = '🔄 Pushing to Cloud...';
        await pushToCloudNow(true);
        if (window.soundMgr) window.soundMgr.playReadyChime();
        renderModalContent();
      };

      $('#btnQrForcePull', backdrop).onclick = async () => {
        const btn = $('#btnQrForcePull', backdrop);
        if (btn) btn.textContent = '🔄 Pulling from Cloud...';
        await pullFromCloud(false, true);
        renderModalContent();
      };

      $('#btnQrCopyUrl', backdrop).onclick = () => {
        navigator.clipboard.writeText(fullShareUrl).then(() => {
          showToast('🔗 Live Sync Link (with Pending Notes & Timers) copied!');
        });
      };

      $('#btnQrNativeShare', backdrop).onclick = () => {
        if (navigator.share) {
          navigator.share({
            title: 'OrlandoChrome · Live Synced Command Center',
            text: `OrlandoChrome (${pendingTotal} Pending Notes · ${timersTotal} Active Timers)`,
            url: fullShareUrl
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(fullShareUrl).then(() => showToast('🔗 Live Sync Link copied!'));
        }
      };

      // Download Branded High-Res QR Poster (.png)
      $('#btnQrDownloadPng', backdrop).onclick = () => {
        const qrImg = $('#qrHoloImg', backdrop);
        if (!qrImg) return;
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 780;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = t.accent;
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 34px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ORLANDOCHROME', canvas.width / 2, 74);

        ctx.fillStyle = t.accent;
        ctx.font = '700 16px Inter, sans-serif';
        ctx.fillText(isBlankTarget ? 'CLEAN BLANK EDITION · SCAN TO OPEN' : 'LIVE CLOUD SYNC · iOS · WINDOWS · ANDROID', canvas.width / 2, 104);

        try {
          ctx.drawImage(qrImg, 90, 130, 460, 460);
        } catch (err) {}

        ctx.fillStyle = '#d1d5db';
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillText(`${pendingTotal} Pending Notes · ${timersTotal} Active Timers · Real-Time Sync`, canvas.width / 2, 635);

        ctx.fillStyle = '#888888';
        ctx.font = '500 13px Consolas, monospace';
        ctx.fillText(LIVE_APP_URL, canvas.width / 2, 675);

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = isBlankTarget ? 'OrlandoChrome-Blank-QR.png' : 'OrlandoChrome-LiveSync-QR.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('🖼️ Downloaded Branded QR Poster (.png)!');
      };

      // 1-Click PWA Install
      $('#btnPwaOneClickInstall', backdrop).onclick = async () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          const choice = await deferredInstallPrompt.userChoice.catch(() => null);
          deferredInstallPrompt = null;
          if (choice && choice.outcome === 'accepted') {
            showToast('✅ OrlandoChrome installed as a native app!');
            close();
          }
        } else {
          downloadWindowsDesktopLauncherCmd(isBlankTarget);
          showToast('💡 On iPhone Safari tap Share → "Add to Home Screen"; on Chrome click Install in the address bar!');
        }
      };

      $('#btnSuiteWinApp', backdrop).onclick = () => downloadWindowsDesktopLauncherCmd(isBlankTarget);
      $('#btnSuiteTaskbarSync', backdrop).onclick = () => downloadLaptopTaskbarScannerCmd();
      $('#btnSuiteStandaloneHtml', backdrop).onclick = () => downloadStandaloneHtml(isBlankTarget);

      const btnOpenBlank = $('#btnOpenBlankWebApp', backdrop);
      if (btnOpenBlank) {
        btnOpenBlank.onclick = () => window.open('?edition=blank', '_blank');
      }

      $('#btnSuiteExportJson', backdrop).onclick = () => exportFullBackupJson();
      $('#btnSuiteImportJson', backdrop).onclick = () => {
        close();
        $('#backupJsonInput').click();
      };
    };

    renderModalContent();
    document.body.appendChild(backdrop);
  }

  // Alias openMobileQrModal to openAppDistributionSuiteModal so there is zero duplication
  const openMobileQrModal = openAppDistributionSuiteModal;

  // =========================================================================
  // 🎙️ WISPR FLOW PRO ENGINE (Unlimited Dictation, Style Learning, Command Mode, Audio Waveform)
  // =========================================================================
  let recognition = null;
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let waveAnimId = null;

  function formatWithWisprStyle(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    for (const entry of state.wispr.dictionary) {
      if (!entry.from || !entry.to) continue;
      const escaped = entry.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'gi');
      text = text.replace(re, entry.to);
    }

    text = text
      .replace(/\bperiod\b/gi, '.')
      .replace(/\bcomma\b/gi, ',')
      .replace(/\bquestion mark\b/gi, '?')
      .replace(/\bexclamation mark\b/gi, '!')
      .replace(/\bcolon\b/gi, ':')
      .replace(/\bnew line\b/gi, ' — ');

    const style = state.wispr.style;
    if (style === 'raw') {
      return text;
    }

    text = text
      .replace(/\b(um+|uh+|erm+|er+|hmm+)\b[,\s]*/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!text) return '';

    text = text.charAt(0).toUpperCase() + text.slice(1);

    if (style === 'academic') {
      text = text
        .replace(/\bdon't\b/gi, 'do not')
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bi'm\b/gi, 'I am')
        .replace(/\blet's\b/gi, 'let us')
        .replace(/\bchapter (\d+)\b/gi, 'Chapter $1')
        .replace(/\bgrade (\d+)\b/gi, 'Grade $1');
      if (!/[.!?]$/.test(text)) text += '.';
    } else if (style === 'action') {
      text = text.replace(/^(please |i need to |we need to |remember to |don't forget to )/i, '');
      if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
      text = text.replace(/\.$/, '');
    }

    return text;
  }

  function checkAndExecuteVoiceCommand(transcriptChunk) {
    if (!state.wispr.commandMode) return { consumed: false, text: transcriptChunk };
    const lower = transcriptChunk.trim().toLowerCase().replace(/[.!?]+$/, '');
    const activeProf = getProfile(state.activeProfileId);

    if (lower === 'scratch that' || lower === 'clear text' || lower === 'delete all') {
      const inp = $('#composerInput');
      if (inp) inp.value = '';
      showToast('🗣️ Flow Command: Cleared text');
      return { consumed: true, text: '' };
    }

    if (lower.includes('pin profile') || lower.includes('pin to top')) {
      activeProf.isPinned = true;
      activeProf.pinnedAt = now();
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Pinned ${activeProf.name} to top`);
      return { consumed: true, text: '' };
    }

    if (lower.includes('unpin profile')) {
      activeProf.isPinned = false;
      activeProf.pinnedAt = null;
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Unpinned ${activeProf.name}`);
      return { consumed: true, text: '' };
    }

    if (lower === 'mark unread' || lower === 'mark as unread') {
      if (hasMessages(activeProf)) {
        activeProf.isUnread = true;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`🗣️ Flow Command: Marked ${activeProf.name} as Unread`);
      } else {
        showToast(`⚠️ Add a message first before marking ${activeProf.name} Unread`);
      }
      return { consumed: true, text: '' };
    }

    for (const r of REACTIONS_LIST) {
      if (lower === `mark ${r.key}` || lower === `tag ${r.key}`) {
        const pending = (activeProf.notes || []).filter(n => !n.done);
        if (pending.length > 0) {
          const latest = pending[pending.length - 1];
          if (!Array.isArray(latest.reactions)) latest.reactions = [];
          if (!latest.reactions.includes(r.key)) latest.reactions.push(r.key);
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`🗣️ Flow Command: Tagged ${r.icon} ${r.label}`);
        } else {
          state.pendingReactionTag = r.key;
          showToast(`🗣️ Flow Command: Queued ${r.icon} ${r.label} for your note`);
        }
        return { consumed: true, text: '' };
      }
    }

    const timerMatch = lower.match(/start timer (\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|day|days)/);
    if (timerMatch) {
      const val = parseInt(timerMatch[1], 10);
      const unit = timerMatch[2];
      const mins = unit.startsWith('d') ? val * 1440 : (unit.startsWith('h') ? val * 60 : val);
      if (mins > 0) {
        startCooldown(activeProf, mins);
        showToast(`🗣️ Flow Command: Started ${mins}m timer`);
        return { consumed: true, text: '' };
      }
    }

    if (lower === 'forward task' || lower === 'move to next profile') {
      const pending = (activeProf.notes || []).filter(n => !n.done);
      if (pending.length > 0) {
        openForwardModal(activeProf, pending[pending.length - 1]);
        showToast('🗣️ Flow Command: Opened Forward Task modal');
        return { consumed: true, text: '' };
      }
    }

    const sendSuffixMatch = transcriptChunk.match(/^(.*?)\b(send note|submit note|add task)\s*[.!?]*$/i);
    if (sendSuffixMatch) {
      const prefixText = sendSuffixMatch[1].trim();
      const inp = $('#composerInput');
      if (inp && prefixText) {
        const formatted = formatWithWisprStyle(prefixText);
        inp.value = inp.value ? `${inp.value.trim()} ${formatted}` : formatted;
      }
      setTimeout(() => {
        const sendBtn = $('#btnSendNote');
        if (sendBtn) sendBtn.click();
      }, 60);
      showToast('🗣️ Flow Command: Sent note!');
      return { consumed: true, text: '' };
    }

    return { consumed: false, text: transcriptChunk };
  }

  async function startAudioVisualizerAndRecorder() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animateBars = () => {
        if (!state.wispr.isListening || !analyser) return;
        analyser.getByteFrequencyData(dataArray);
        const bars = $$('#wisprWaveform .wispr-bar');
        bars.forEach((bar, i) => {
          const val = dataArray[i % dataArray.length] || 0;
          const h = Math.max(4, Math.min(26, Math.round((val / 255) * 26)));
          bar.style.height = `${h}px`;
        });
        waveAnimId = requestAnimationFrame(animateBars);
      };
      waveAnimId = requestAnimationFrame(animateBars);

      if (state.wispr.recordAudioClip && window.MediaRecorder) {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(micStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          if (!recordedChunks.length) return;
          const blob = new Blob(recordedChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onload = (ev) => {
            state.pendingVoiceClip = ev.target.result;
            renderMainChat();
          };
          reader.readAsDataURL(blob);
        };
        mediaRecorder.start();
      }
    } catch (e) {
      console.warn('Microphone visualizer stream error:', e);
    }
  }

  function stopAudioVisualizerAndRecorder() {
    if (waveAnimId) cancelAnimationFrame(waveAnimId);
    waveAnimId = null;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (e) {}
    }
    mediaRecorder = null;
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
    }
    analyser = null;
  }

  function toggleWisprDictation() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('⚠️ Speech Recognition is supported in Chrome / Edge.');
      return;
    }

    if (state.wispr.isListening) {
      state.wispr.isListening = false;
      state.wispr.interimText = '';
      if (recognition) {
        try { recognition.onend = null; recognition.stop(); } catch (e) {}
        recognition = null;
      }
      stopAudioVisualizerAndRecorder();

      const inp = $('#composerInput');
      const currentVal = inp ? inp.value.trim() : '';
      if (state.wispr.autoSend && currentVal) {
        const sendBtn = $('#btnSendNote');
        if (sendBtn) sendBtn.click();
      } else {
        renderMainChat();
        if (inp) {
          const freshInp = $('#composerInput');
          if (freshInp) {
            freshInp.value = currentVal;
            freshInp.focus();
          }
        }
      }
      showToast('⏹️ Wispr Flow Pro stopped');
      return;
    }

    state.wispr.isListening = true;
    state.wispr.panelOpen = true;
    state.wispr.sessionStartMs = now();
    state.wispr.interimText = '';
    saveWisprPrefs();

    const prevInputVal = ($('#composerInput') && $('#composerInput').value) || '';
    renderMainChat();
    const restoredInput = $('#composerInput');
    if (restoredInput) {
      restoredInput.value = prevInputVal;
      restoredInput.focus();
    }

    startAudioVisualizerAndRecorder();

    const startRecognitionInstance = () => {
      if (!state.wispr.isListening) return;
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        state.wispr.interimText = interim;
        const previewEl = $('#wisprLivePreview');
        if (previewEl) {
          previewEl.innerHTML = interim
            ? `<span class="wispr-interim-stream">🗣️ "${esc(interim)}"</span>`
            : `<span class="wispr-cmd-hint">💡 Listening continuously (Unlimited Words)...</span>`;
        }

        if (finalChunk.trim()) {
          const cmdCheck = checkAndExecuteVoiceCommand(finalChunk.trim());
          if (!cmdCheck.consumed && cmdCheck.text) {
            const polished = formatWithWisprStyle(cmdCheck.text);
            if (polished) {
              const wordsCount = polished.split(/\s+/).filter(Boolean).length;
              state.wispr.sessionWords += wordsCount;
              const inp = $('#composerInput');
              if (inp) {
                inp.value = inp.value ? `${inp.value.trim()} ${polished}` : polished;
              }
              const metricsEl = $('#wisprMetrics');
              if (metricsEl) {
                metricsEl.innerHTML = `<span><strong>${state.wispr.sessionWords}</strong> words</span><span>·</span><span>Unlimited Flow</span>`;
              }
            }
          }
        }
      };

      recognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          state.wispr.isListening = false;
          stopAudioVisualizerAndRecorder();
          renderMainChat();
          showToast('⚠️ Microphone permission denied.');
        }
      };

      recognition.onend = () => {
        if (state.wispr.isListening) {
          try {
            recognition.start();
          } catch (e) {
            setTimeout(startRecognitionInstance, 150);
          }
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    };

    startRecognitionInstance();
    if (window.soundMgr) window.soundMgr.playClick();
    showToast('🎙️ Wispr Flow Pro Active — Speak freely!');
  }

  function openWisprDictionaryModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';

    const renderDictModalContent = () => {
      backdrop.innerHTML = `
        <div class="forward-modal">
          <div class="forward-modal-header">
            <h3>📚 Wispr Flow Pro · Personal Dictionary</h3>
            <button type="button" class="btn-banner-clear" id="btnCloseWisprDict">✕</button>
          </div>
          <div style="font-size:12.5px; color:var(--nf-text-muted);">
            Teach Wispr Flow Pro your custom names, acronyms, and automatic phrase replacements:
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="dictSpokenInput" class="rename-input" placeholder="Spoken word (e.g. deped)">
            <input type="text" id="dictReplaceInput" class="rename-input" placeholder="Formatted (e.g. DepEd)">
            <button type="button" class="btn-composer-send" id="btnAddDictEntry" style="padding:8px 16px;">+ Add</button>
          </div>
          <div class="forward-profiles-list" style="max-height:240px;">
            ${state.wispr.dictionary.map((d, idx) => `
              <div class="forward-profile-row">
                <div style="font-size:13px; color:#fff;">
                  <span style="color:#ff858d;">"${esc(d.from)}"</span> → <strong style="color:#6ee7b7;">"${esc(d.to)}"</strong>
                </div>
                <button type="button" class="btn-note-delete" data-del-dict="${idx}" title="Remove word">🗑️</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
      $('#btnCloseWisprDict', backdrop).onclick = close;
      backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

      $('#btnAddDictEntry', backdrop).onclick = () => {
        const fromVal = $('#dictSpokenInput', backdrop).value.trim();
        const toVal = $('#dictReplaceInput', backdrop).value.trim();
        if (!fromVal || !toVal) return;
        state.wispr.dictionary.unshift({ from: fromVal, to: toVal });
        saveWisprPrefs();
        renderDictModalContent();
        renderMainChat();
        showToast(`📚 Taught Wispr Flow: "${fromVal}" → "${toVal}"`);
      };

      $$('[data-del-dict]', backdrop).forEach(btn => {
        btn.onclick = () => {
          const i = parseInt(btn.dataset.delDict, 10);
          state.wispr.dictionary.splice(i, 1);
          saveWisprPrefs();
          renderDictModalContent();
          renderMainChat();
        };
      });
    };

    renderDictModalContent();
    document.body.appendChild(backdrop);
  }

  // Cooldown timer starter
  function startCooldown(profile, minutes, displayLabel) {
    const durationMs = minutes * 60 * 1000;
    profile.timerUntil = now() + durationMs;
    profile.timerDurationMs = durationMs;
    profile.isReset = false;
    saveState();
    renderSidebar();
    renderMainChat();
    const labelStr = displayLabel || `${minutes}m`;
    showToast(`⏳ Cooldown set: ${labelStr} for ${profile.name}`);
    if (window.soundMgr) window.soundMgr.playClick();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  // Rename Profile Modal
  function promptRename(profile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>✏️ Edit Chrome Profile Details</h3>
        <input type="text" id="renameVal" class="rename-input" value="${esc(profile.name)}" placeholder="Profile name">
        <input type="text" id="renameEmailVal" class="rename-input" value="${esc(profile.email || '')}" placeholder="Email or subtitle (optional)">
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelRename">Cancel</button>
          <button class="btn-composer-send" id="btnConfirmRename" style="padding:8px 18px;">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const valInput = $('#renameVal', backdrop);
    const emailInput = $('#renameEmailVal', backdrop);
    valInput.focus();
    valInput.select();

    const closeDialog = () => {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    };

    const confirmRename = () => {
      const newName = valInput.value.trim();
      if (newName) {
        profile.name = newName;
        if (emailInput) profile.email = emailInput.value.trim();
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Saved profile "${newName}"`);
      }
      closeDialog();
    };

    $('#btnCancelRename', backdrop).onclick = closeDialog;
    $('#btnConfirmRename', backdrop).onclick = confirmRename;
    valInput.onkeydown = (e) => {
      if (e.key === 'Enter') confirmRename();
      if (e.key === 'Escape') closeDialog();
    };
    if (emailInput) {
      emailInput.onkeydown = (e) => {
        if (e.key === 'Enter') confirmRename();
        if (e.key === 'Escape') closeDialog();
      };
    }
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeDialog();
    };
  }

  // 1-Second Timer Tick
  function timerTick() {
    const cur = now();
    let stateChanged = false;

    state.profiles.forEach(p => {
      if (p.timerUntil && p.timerUntil <= cur) {
        p.timerUntil = null;
        p.isReset = true;
        stateChanged = true;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        showToast(`✨ Cooldown finished for ${p.name}! Limit Reset.`);
        triggerDesktopNotification(`🟢 Limit Reset: ${p.name}`, `${p.name} (${p.winShortcut}) is ready for work!`);
      }
    });

    if (stateChanged) {
      saveState();
      renderSidebar();
      renderMainChat();
    } else {
      const banner = $('.timer-active-banner strong');
      if (banner) {
        const active = getProfile(state.activeProfileId);
        if (active.timerUntil && active.timerUntil > cur) {
          banner.textContent = formatRemaining(active.timerUntil - cur);
        }
      }
    }

    renderClockBox();
  }

  // Event Listeners Setup
  function initEvents() {
    // Search input
    $('#profileSearch').oninput = (e) => {
      state.searchQuery = e.target.value;
      renderSidebar();
    };

    // Filter tabs
    const setFilter = (tab, filterName) => {
      state.currentFilter = filterName;
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSidebar();
    };

    $('#tabAll').onclick = () => setFilter($('#tabAll'), 'all');
    $('#tabPending').onclick = () => setFilter($('#tabPending'), 'pending');
    $('#tabTimers').onclick = () => setFilter($('#tabTimers'), 'timers');

    // Logo click resets filters
    $('#logoBtn').onclick = () => {
      state.searchQuery = '';
      $('#profileSearch').value = '';
      setFilter($('#tabAll'), 'all');
    };

    // Topbar App Suite and Next Ready Buttons
    const btnNextReady = $('#btnNextReady');
    if (btnNextReady) btnNextReady.onclick = () => jumpToNextReadyProfile();

    const btnOpenSuite = $('#btnOpenAppSuite');
    if (btnOpenSuite) btnOpenSuite.onclick = () => openAppDistributionSuiteModal();

    // Adjustable Width Resizer Line Between Profiles (Sidebar) and Messages (Chat Main)
    const resizer = $('#workspaceResizer');
    const sidebar = $('#appSidebar');
    const SIDEBAR_WIDTH_KEY = 'orlandochrome_sidebar_width_v1';

    if (sidebar) {
      const savedWidth = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
      if (!isNaN(savedWidth) && savedWidth >= 210 && savedWidth <= 900) {
        document.documentElement.style.setProperty('--sidebar-width', `${savedWidth}px`);
      }
    }

    if (resizer && sidebar) {
      let isDragging = false;

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const minW = 210;
        const maxW = Math.min(860, Math.floor(window.innerWidth * 0.7));
        const newWidth = Math.max(minW, Math.min(maxW, clientX));
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        resizer.classList.remove('dragging');
        document.body.classList.remove('is-resizing-pane');
        const currentW = sidebar.getBoundingClientRect().width;
        if (currentW >= 210) {
          try {
            localStorage.setItem(SIDEBAR_WIDTH_KEY, String(Math.round(currentW)));
          } catch (err) {}
        }
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      };

      const startDrag = (e) => {
        if (window.innerWidth <= 768) return;
        e.preventDefault();
        isDragging = true;
        resizer.classList.add('dragging');
        document.body.classList.add('is-resizing-pane');
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
      };

      resizer.addEventListener('mousedown', startDrag);
      resizer.addEventListener('touchstart', startDrag, { passive: false });

      // Double-click resizer line to reset to default width
      resizer.addEventListener('dblclick', () => {
        document.documentElement.style.removeProperty('--sidebar-width');
        try {
          localStorage.removeItem(SIDEBAR_WIDTH_KEY);
        } catch (err) {}
        showToast('↔️ Reset profile list width to default');
      });
    }

    // Global Photo file uploader (Profile Avatar)
    $('#globalPhotoInput').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || !state.uploadTargetId) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        const target = getProfile(state.uploadTargetId);
        if (target) {
          target.customAvatar = base64;
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`✓ Photo updated for ${target.name}!`);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    // Note Screenshot / Image file uploader
    const noteImgInput = $('#noteImageInput');
    if (noteImgInput) {
      noteImgInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const dataUrl = await compressImage(file);
        state.pendingAttachment = dataUrl;
        renderMainChat();
        showToast('📸 Screenshot ready — press Enter or Add ✓ to send!');
        e.target.value = '';
      });
    }

    // JSON Backup Restore Uploader (Enhancement #7)
    const backupInput = $('#backupJsonInput');
    if (backupInput) {
      backupInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            const profList = Array.isArray(parsed) ? parsed : parsed.profiles;
            if (Array.isArray(profList) && profList.length > 0) {
              state.profiles = profList;
              state.activeProfileId = state.profiles[0].id;
              if (Array.isArray(parsed.quickTemplates)) {
                state.quickTemplates = parsed.quickTemplates;
                saveTemplates();
              }
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`✅ Restored ${state.profiles.length} profiles from backup!`);
            } else {
              showToast('⚠️ Invalid backup JSON file.');
            }
          } catch (err) {
            showToast('⚠️ Could not parse JSON file.');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    // Blank Edition: Direct Chrome "Local State" File Parser (Detects Installed Laptop's Chrome Profiles in Browser!)
    const localStateInput = $('#localStateFileInput');
    if (localStateInput) {
      localStateInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            // Can be either Chrome's "Local State" file OR the JSON generated by our Taskbar Scanner script
            if (Array.isArray(data) && data.length > 0) {
              state.profiles = data.map((p, idx) => ({
                id: p.id || `b_slot_${idx + 1}`,
                profileDir: p.profileDir || `Profile ${idx + 1}`,
                chromeNo: idx + 1,
                taskbarSlot: p.taskbarSlot || (idx + 1),
                winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
                name: p.name || `Chrome #${idx + 1}`,
                email: p.email || '',
                gaia: p.gaia || '',
                timerUntil: null,
                timerDurationMs: null,
                isReset: false,
                isPinned: false,
                pinnedAt: null,
                isUnread: false,
                stickyNote: '',
                customAvatar: null,
                notes: []
              }));
            } else if (data && data.profile && data.profile.info_cache) {
              const cache = data.profile.info_cache;
              const entries = Object.entries(cache);
              state.profiles = entries.map(([dir, info], idx) => {
                const slot = idx + 3;
                return {
                  id: `b_tb_${slot}`,
                  profileDir: dir,
                  chromeNo: idx + 1,
                  taskbarSlot: slot,
                  winShortcut: slot <= 9 ? `Win + ${slot}` : `Slot #${slot}`,
                  name: info.name || info.shortcut_name || dir,
                  email: info.user_name || info.gaia_name || dir,
                  gaia: info.gaia_name || '',
                  timerUntil: null,
                  timerDurationMs: null,
                  isReset: false,
                  isPinned: false,
                  pinnedAt: null,
                  isUnread: false,
                  stickyNote: '',
                  customAvatar: null,
                  notes: []
                };
              });
            } else {
              showToast('⚠️ Select Chrome "Local State" or a scanned taskbar JSON file.');
              return;
            }
            if (state.profiles.length > 0) {
              state.activeProfileId = state.profiles[0].id;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`🎉 Auto-detected ${state.profiles.length} Chrome profiles from this laptop!`);
            }
          } catch (err) {
            showToast('⚠️ Failed to parse Chrome Local State file.');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    // Global Ctrl+V Paste Screenshot Handler
    document.addEventListener('paste', async (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            const dataUrl = await compressImage(blob);
            state.pendingAttachment = dataUrl;
            const prevText = ($('#composerInput') && $('#composerInput').value) || '';
            renderMainChat();
            const inp = $('#composerInput');
            if (inp) {
              inp.value = prevText;
              inp.focus();
            }
            showToast('📸 Screenshot pasted from clipboard! Press Enter to add.');
          }
          break;
        }
      }
    });

    // Enhancement #6: Global Keyboard Shortcuts (Alt+Space Dictation, Alt+↑/↓ Profile Nav, Alt+N Next Ready)
    document.addEventListener('keydown', (e) => {
      if ((e.altKey && e.code === 'Space') || (e.ctrlKey && e.shiftKey && e.code === 'Space')) {
        e.preventDefault();
        toggleWisprDictation();
      } else if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const items = $$('#profileList .profile-item');
        if (!items.length) return;
        const curIdx = items.findIndex(el => el.dataset.id === state.activeProfileId);
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const nextIdx = (curIdx + delta + items.length) % items.length;
        const nextId = items[nextIdx].dataset.id;
        state.activeProfileId = nextId;
        renderSidebar();
        renderMainChat();
        const activeEl = $(`#profileList .profile-item[data-id="${nextId}"]`);
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        jumpToNextReadyProfile();
      }
    });
  }

  // Initializer
  function init() {
    loadState();
    initEvents();
    renderSidebar();
    renderMainChat();
    renderClockBox();
    initCloudSync();

    setInterval(timerTick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
