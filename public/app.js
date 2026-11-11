/* OrlandoChrome · Chrome Taskbar Notes
 * Fast, smooth Messenger 2-column layout with OLED pure black theme,
 * Small Red & White / Green & White Radiant Gradient Pins,
 * Bloody Red / Dark Red Radiant Gradients, Reactions, Inline Edit,
 * Screenshot Paste/Drop, Task Forwarding, Unread Dots, and Wispr Flow Pro Dictation Suite.
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_messenger_notes_v5';
  const OLD_STORAGE_KEYS = ['chrome_taskbar_messenger_notes_v4', 'chrome_taskbar_netflix_v1', 'chrome_taskbar_messenger_notes_v3'];
  const WISPR_PREFS_KEY = 'orlandochrome_wispr_flow_pro_v1';

  // Priority & Color Reactions (Messenger / Discord Style)
  const REACTIONS_LIST = [
    { key: 'urgent',    icon: '🔥', label: 'Urgent',    cls: 'react-urgent' },
    { key: 'waiting',   icon: '⏳', label: 'Waiting',   cls: 'react-waiting' },
    { key: 'important', icon: '📌', label: 'Important', cls: 'react-important' },
    { key: 'verified',  icon: '✅', label: 'Verified',  cls: 'react-verified' }
  ];
  const REACTIONS_MAP = Object.fromEntries(REACTIONS_LIST.map(r => [r.key, r]));

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
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "A4 A Hero", email: "heroesmeraldaepicalu@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 B Yify", email: "yifyyts7@gmail.com", gaia: "Yify Yify", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 C NASH", email: "revnash0@gmail.com", gaia: "Nash Rev", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Slot #10", name: "A4 D Gwapo", email: "gwapocpogi@gmail.com", gaia: "Gwapo Pogi", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Slot #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Slot #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Slot #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Slot #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Slot #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Slot #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Slot #17", name: "A6 scite003 Gmail Gold Cloud", email: "goldcloudblack@gmail.com", gaia: "Gold Cloud Black", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Slot #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Slot #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Slot #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Slot #21", name: "A7 A pogiorlandopasion@gmail.com", email: "pogiorlandopasion@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Slot #22", name: "A7 B watchonlineapple", email: "watchonlineapple@gmail.com", gaia: "Watch Online", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Slot #23", name: "A7 C grammarlyquillbot001@gmail.com", email: "grammarlyquillbot001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] },
    { id: "p_tb_24", profileDir: "Profile 59", chromeNo: 22, taskbarSlot: 24, winShortcut: "Slot #24", name: "A7 D netflixpasion", email: "netflixpasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, customAvatar: null, notes: [] }
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
  const DEFAULT_WISPR_DICT = [
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

  // Application State
  const state = {
    profiles: [],
    activeProfileId: "p_tb_4",
    currentFilter: "all",      // "all" | "pending" | "timers"
    searchQuery: "",
    uploadTargetId: null,
    editingNoteId: null,       // Currently inline-editing note ID
    pendingAttachment: null,   // Base64 compressed image awaiting send
    pendingVoiceClip: null,    // Base64 audio clip from Wispr Flow Voice Memo
    pendingReactionTag: null,  // Reaction queued by voice command
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
    if (profile.profileDir) return `avatars/${encodeURIComponent(profile.profileDir)}.png`;
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111'/><text x='50' y='65' font-size='48' text-anchor='middle' fill='%23E50914' font-family='sans-serif'>${esc(profile.name ? profile.name[0] : 'C')}</text></svg>`;
  }

  // Toast notification
  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2500);
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

  // Load state and clean sample notes
  function loadState() {
    loadWisprPrefs();
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
          customAvatar: found.customAvatar || null,
          notes: cleanedNotes
        };
      });
    }

    state.profiles.sort((a, b) => a.taskbarSlot - b.taskbarSlot);
    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
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
        snippetHtml = '🟢 Limit Reset · Ready for work';
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
                ${isReset ? `<span class="badge-reset-pill">🟢 Reset</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Attach interactive Pin click handlers (stops propagation so clicking the pin toggles top placement cleanly)
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
      <!-- Header with Bigger Picture (60px), Unread Bookmark & Rename Action -->
      <header class="chat-header">
        <div class="chat-header-profile">
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

      <!-- Quick AI Limit Cooldown Bar -->
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
        <button class="timer-chip" data-min="1440" data-label="1d">1d</button>
        <button class="timer-chip" data-min="2880" data-label="2d">2d</button>

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

      <!-- Reset Limit Banner -->
      ${isReset ? `
        <div class="timer-reset-banner">
          <span>🟢 AI Limit Reset! Your credits &amp; quota are ready for work.</span>
          <button class="btn-banner-reset" id="btnDismissReset">✓ Acknowledge</button>
        </div>
      ` : ''}

      <!-- Notes Stream (Pure OLED Black Blank Space When Empty) -->
      <div class="notes-stream" id="notesStream">
        ${!notes.length ? '' : notes.map(n => {
          const isEditing = state.editingNoteId === n.id;
          const reactions = Array.isArray(n.reactions) ? n.reactions : [];

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
                  <div class="note-text" data-action="dblclick-edit" data-nid="${n.id}" title="Double-click to edit inline">${esc(n.text)}</div>
                ` : '')}

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
        p.isUnread = !p.isUnread;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(p.isUnread ? `● Marked ${p.name} as Unread` : `Cleared Unread mark on ${p.name}`);
      };
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

    // 7. Note actions (Done, Edit, Forward, Reactions, Lightbox, Delete)
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

    // Drag and drop screenshots onto notesStream or composer
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
  // 🎙️ WISPR FLOW PRO ENGINE (Unlimited Dictation, Style Learning, Command Mode, Audio Waveform)
  // =========================================================================
  let recognition = null;
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let waveAnimId = null;

  // Apply Personalized Writing Style & Custom Dictionary to Dictated Text
  function formatWithWisprStyle(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    // 1. Apply Personal Dictionary replacements (case-insensitive whole word)
    for (const entry of state.wispr.dictionary) {
      if (!entry.from || !entry.to) continue;
      const escaped = entry.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'gi');
      text = text.replace(re, entry.to);
    }

    // Spoken punctuation replacements
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

    // Strip common conversational filler words (Wispr Flow Auto-Polish)
    text = text
      .replace(/\b(um+|uh+|erm+|er+|hmm+)\b[,\s]*/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!text) return '';

    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    if (style === 'academic') {
      // Expand contractions for formal DepEd / Academic style
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
      // Crisp imperative task style (no trailing period needed, clean prefix)
      text = text.replace(/^(please |i need to |we need to |remember to |don't forget to )/i, '');
      if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
      text = text.replace(/\.$/, '');
    }

    return text;
  }

  // Parse and execute Wispr Flow Pro Voice Commands when Command Mode is ON
  function checkAndExecuteVoiceCommand(transcriptChunk) {
    if (!state.wispr.commandMode) return { consumed: false, text: transcriptChunk };
    const lower = transcriptChunk.trim().toLowerCase().replace(/[.!?]+$/, '');
    const activeProf = getProfile(state.activeProfileId);

    // 1. "scratch that" / "clear text" / "delete all"
    if (lower === 'scratch that' || lower === 'clear text' || lower === 'delete all') {
      const inp = $('#composerInput');
      if (inp) inp.value = '';
      showToast('🗣️ Flow Command: Cleared text');
      return { consumed: true, text: '' };
    }

    // 2. "pin profile" / "pin to top"
    if (lower.includes('pin profile') || lower.includes('pin to top')) {
      activeProf.isPinned = true;
      activeProf.pinnedAt = now();
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Pinned ${activeProf.name} to top`);
      return { consumed: true, text: '' };
    }

    // 3. "unpin profile"
    if (lower.includes('unpin profile')) {
      activeProf.isPinned = false;
      activeProf.pinnedAt = null;
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Unpinned ${activeProf.name}`);
      return { consumed: true, text: '' };
    }

    // 4. "mark unread"
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

    // 5. Reaction commands: "mark urgent", "mark waiting", "mark important", "mark verified"
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

    // 6. Timer commands: "start timer 30 minutes", "start timer 2 hours"
    const timerMatch = lower.match(/start timer (\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)/);
    if (timerMatch) {
      const val = parseInt(timerMatch[1], 10);
      const unit = timerMatch[2];
      const mins = unit.startsWith('h') ? val * 60 : val;
      if (mins > 0) {
        startCooldown(activeProf, mins);
        showToast(`🗣️ Flow Command: Started ${mins}m timer`);
        return { consumed: true, text: '' };
      }
    }

    // 7. Forward command: "forward task" / "move to next profile"
    if (lower === 'forward task' || lower === 'move to next profile') {
      const pending = (activeProf.notes || []).filter(n => !n.done);
      if (pending.length > 0) {
        openForwardModal(activeProf, pending[pending.length - 1]);
        showToast('🗣️ Flow Command: Opened Forward Task modal');
        return { consumed: true, text: '' };
      }
    }

    // 8. "send note" / "submit note" / "add task" (can also be at the end of a spoken sentence!)
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

  // Start Web Audio API Soundwave Visualizer + optional MediaRecorder
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

      // Optional Voice Memo Recorder
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

  // Toggle Wispr Flow Pro Dictation On/Off
  function toggleWisprDictation() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('⚠️ Speech Recognition is supported in Chrome / Edge.');
      return;
    }

    if (state.wispr.isListening) {
      // Stop dictation
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

    // Start Unlimited Continuous Dictation
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

      // Unlimited Session Watchdog: automatically restart if Chrome pauses recognition
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

  // Personal Writing Style Dictionary Modal (+ Teach Word)
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
  }

  // Rename Profile Modal
  function promptRename(profile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>✏️ Rename Chrome Profile</h3>
        <input type="text" id="renameVal" class="rename-input" value="${esc(profile.name)}" placeholder="Profile name">
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelRename">Cancel</button>
          <button class="btn-composer-send" id="btnConfirmRename" style="padding:8px 18px;">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const valInput = $('#renameVal', backdrop);
    valInput.focus();
    valInput.select();

    const closeDialog = () => {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    };

    const confirmRename = () => {
      const newName = valInput.value.trim();
      if (newName) {
        profile.name = newName;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Renamed profile to "${newName}"`);
      }
      closeDialog();
    };

    $('#btnCancelRename', backdrop).onclick = closeDialog;
    $('#btnConfirmRename', backdrop).onclick = confirmRename;
    valInput.onkeydown = (e) => {
      if (e.key === 'Enter') confirmRename();
      if (e.key === 'Escape') closeDialog();
    };
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
        showToast(`🟢 Cooldown finished for ${p.name}! Limit Reset.`);
      }
    });

    if (stateChanged) {
      saveState();
      renderSidebar();
      renderMainChat();
    } else {
      // Refresh live countdown string in banner if active
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

    // Global Hotkey for Wispr Flow Pro Dictation (Alt + Space or Ctrl + Shift + Space)
    document.addEventListener('keydown', (e) => {
      if ((e.altKey && e.code === 'Space') || (e.ctrlKey && e.shiftKey && e.code === 'Space')) {
        e.preventDefault();
        toggleWisprDictation();
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

    // 1-second interval for clock and cooldown countdowns
    setInterval(timerTick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
