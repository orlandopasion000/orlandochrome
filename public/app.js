/* CHROMEFLIX · Netflix-Themed Chrome Taskbar Notes
 * Fast, smooth Messenger 2-column layout with bigger pictures and Netflix styling
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_messenger_notes_v4';
  const OLD_STORAGE_KEYS = ['chrome_taskbar_netflix_v1', 'chrome_taskbar_messenger_notes_v3'];

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

  // The 21 Chrome Profiles in order from Windows Taskband - 100% CLEAN
  const DEFAULT_PROFILES = [
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", emoji: "🌐", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", emoji: "🎓", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", emoji: "📘", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", emoji: "📊", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "Hero", email: "heroesmeraldaepicalu@gmail.com", emoji: "🧠", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 A Yify", email: "yifyyts7@gmail.com", emoji: "🎯", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 B NASH", email: "revnash0@gmail.com", emoji: "📝", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Slot #10", name: "A4 C Gwapo", email: "gwapocpogi@gmail.com", emoji: "📊", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Slot #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", emoji: "📘", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Slot #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", emoji: "🏫", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Slot #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", emoji: "⚡", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Slot #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", emoji: "📘", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Slot #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", emoji: "🎯", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Slot #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", emoji: "🧠", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Slot #17", name: "A6 scite003 Gold Cloud", email: "goldcloudblack@gmail.com", emoji: "📝", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Slot #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", emoji: "🛠️", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Slot #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", emoji: "🧮", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Slot #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", emoji: "🎓", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Slot #21", name: "pogiorlandopasion", email: "pogiorlandopasion@gmail.com", emoji: "📚", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Slot #22", name: "watchonlineapple", email: "watchonlineapple@gmail.com", emoji: "🎬", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Slot #23", name: "grammarly", email: "grammarlyorlandopasion@gmail.com", emoji: "✍️", timerUntil: null, timerDurationMs: null, isReset: false, customAvatar: null, notes: [] }
  ];

  // Old sample text to purge
  const SAMPLES_TO_PURGE = [
    "draft grade 8 st2 test",
    "revise chapter 3",
    "prepare youth devotion",
    "table of specifications",
    "sampling framework"
  ];

  // Application State
  const state = {
    profiles: [],
    activeProfileId: "p_tb_4", // Defaults to Chrome #2 or first profile
    currentFilter: "all",      // "all" | "pending" | "timers"
    searchQuery: "",
    uploadTargetId: null
  };

  // Helper to get avatar source
  function getAvatarSrc(profile) {
    if (profile.customAvatar) return profile.customAvatar;
    if (profile.profileDir) return `avatars/${encodeURIComponent(profile.profileDir)}.png`;
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23E50914'/><text x='50' y='65' font-size='48' text-anchor='middle' fill='%23fff' font-family='sans-serif'>${esc(profile.name ? profile.name[0] : 'C')}</text></svg>`;
  }

  // Toast notification
  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  // Load state and clean sample notes
  function loadState() {
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
      state.profiles = DEFAULT_PROFILES.map(def => {
        const found = loaded.find(p => p.id === def.id || (p.chromeNo === def.chromeNo && p.profileDir === def.profileDir));
        if (!found) return { ...def };

        const cleanedNotes = (found.notes || []).filter(n => {
          const txt = (n.text || '').toLowerCase();
          return !SAMPLES_TO_PURGE.some(s => txt.includes(s));
        });

        return {
          ...def,
          name: found.name || def.name,
          taskbarSlot: found.taskbarSlot !== undefined ? found.taskbarSlot : def.taskbarSlot,
          winShortcut: found.winShortcut || def.winShortcut,
          email: found.email || def.email,
          timerUntil: found.timerUntil || null,
          timerDurationMs: found.timerDurationMs || null,
          isReset: !!found.isReset,
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
    }
  }

  function getProfile(id) {
    return state.profiles.find(p => p.id === id) || state.profiles[0];
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

  // Format countdown string
  function formatRemaining(ms) {
    if (ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }

  // Compact timer label for pills
  function formatRemainingShort(ms) {
    if (ms <= 0) return '0m';
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
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

      if (filter === 'pending' && pendingCount === 0) return false;
      if (filter === 'timers' && !isTimer) return false;

      if (!query) return true;
      const inName = p.name.toLowerCase().includes(query);
      const inEmail = (p.email || '').toLowerCase().includes(query);
      const inSlot = String(p.taskbarSlot).includes(query) || (p.winShortcut || '').toLowerCase().includes(query);
      const inNotes = (p.notes || []).some(n => n.text.toLowerCase().includes(query));
      return inName || inEmail || inSlot || inNotes;
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
      const isTimer = p.timerUntil && p.timerUntil > cur;
      const isReset = p.isReset;
      const avatarSrc = getAvatarSrc(p);

      const pendingNotes = (p.notes || []).filter(n => !n.done);
      let snippet = 'No notes yet';
      let snippetClass = '';

      if (isReset) {
        snippet = '🟢 Limit Reset · Ready for work';
        snippetClass = 'reset-glow';
      } else if (isTimer) {
        snippet = `⏳ Timer: ${formatRemainingShort(p.timerUntil - cur)} left`;
        snippetClass = 'timer-glow';
      } else if (pendingNotes.length > 0) {
        snippet = `📌 ${pendingNotes[0].text}`;
        snippetClass = 'pending-glow';
      }

      // Short slot tag e.g. W+3, W+4, #10
      const slotTag = p.winShortcut.startsWith('Win + ')
        ? `W+${p.winShortcut.replace('Win + ', '')}`
        : `#${p.taskbarSlot}`;

      return `
        <div class="profile-item ${isActive ? 'active' : ''}" data-id="${p.id}">
          <!-- Bigger Picture Avatar (52px) -->
          <div class="profile-avatar-wrap">
            <img src="${avatarSrc}" class="profile-avatar-img" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23222\\'/><text x=\\'50\\' y=\\'65\\' font-size=\\'40\\' text-anchor=\\'middle\\' fill=\\'%23fff\\'>${esc(p.name ? p.name[0] : 'C')}</text></svg>'">
            <span class="profile-slot-badge">${esc(slotTag)}</span>
          </div>

          <!-- Profile Details -->
          <div class="profile-text-content">
            <div class="profile-row-header">
              <span class="profile-name">${esc(p.name)}</span>
              <span class="profile-shortcut">${esc(p.winShortcut)}</span>
            </div>
            <div class="profile-row-sub">
              <span class="profile-snippet ${snippetClass}">${esc(snippet)}</span>
              ${pendingCount > 0 ? `<span class="badge-pending-count">${pendingCount}</span>` : ''}
              ${isTimer ? `<span class="badge-timer-pill">⏳ ${formatRemainingShort(p.timerUntil - cur)}</span>` : ''}
              ${isReset ? `<span class="badge-reset-pill">🟢 Reset</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach item click handlers
    $$('.profile-item', list).forEach(item => {
      item.onclick = () => {
        state.activeProfileId = item.dataset.id;
        renderSidebar();
        renderMainChat();
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

    main.innerHTML = `
      <!-- Header with Bigger Picture (64px) & Direct Actions -->
      <header class="chat-header">
        <div class="chat-header-profile">
          <img src="${avatarSrc}" class="chat-header-avatar" id="headerAvatarImg" title="Click to upload/change photo" alt="${esc(p.name)}">
          <div class="chat-header-info">
            <div class="chat-header-title">
              <span>Chrome #${p.chromeNo}: ${esc(p.name)}</span>
            </div>
            <div class="chat-header-meta">
              ${esc(p.email)} · Taskbar Slot #${p.taskbarSlot}
            </div>
          </div>
        </div>

        <div class="chat-header-actions">
          <span class="shortcut-gold-pill">Shortcut: ${esc(p.winShortcut)}</span>
          <button class="btn-header-action" id="btnUploadPhoto">
            📷 Photo
          </button>
          <button class="btn-header-action" id="btnRenameProfile">
            ✏️ Rename
          </button>
          <button class="btn-header-action" id="btnCopyName">
            📋 Copy Name
          </button>
        </div>
      </header>

      <!-- Quick AI Limit Cooldown Bar -->
      <div class="quick-timer-bar">
        <span class="timer-bar-label">Hit AI limit? Start a quick timer:</span>
        <button class="timer-chip" data-min="15">15m</button>
        <button class="timer-chip" data-min="30">30m</button>
        <button class="timer-chip" data-min="60">1h</button>
        <button class="timer-chip" data-min="120">2h</button>
        <button class="timer-chip" data-min="180">3h</button>
        <button class="timer-chip" data-min="300">5h</button>

        <div class="timer-custom-wrap">
          <input type="number" id="customMinInput" class="timer-custom-input" placeholder="min" min="1" max="10000" value="45">
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

      <!-- Notes Stream -->
      <div class="notes-stream" id="notesStream">
        ${!notes.length ? `
          <div class="empty-notes-box">
            <div class="empty-notes-icon">📝</div>
            <div class="empty-notes-title">No pending notes for Chrome #${p.chromeNo} (${esc(p.name)})</div>
            <div class="empty-notes-subtitle">Type a note or pending task below to remember what to do.</div>
          </div>
        ` : notes.map(n => `
          <div class="note-item-wrap" data-nid="${n.id}">
            <div class="note-bubble ${n.done ? 'done' : ''}">
              <div class="note-text">${esc(n.text)}</div>
              <div class="note-bubble-actions">
                ${n.done ? `
                  <button class="btn-note-reopen" data-action="toggle-done" data-nid="${n.id}">↩ Reopen</button>
                ` : `
                  <button class="btn-note-done" data-action="toggle-done" data-nid="${n.id}">✓ Done</button>
                `}
                <button class="btn-note-delete" data-action="delete-note" data-nid="${n.id}" title="Delete note">🗑️</button>
              </div>
            </div>
            <div class="note-timestamp">
              ${new Date(n.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · ${n.done ? 'Completed' : 'Pending'}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Composer Bar (Bottom) -->
      <div class="composer-bar">
        <div class="composer-input-wrap">
          <span class="composer-icon">💬</span>
          <input type="text" id="composerInput" class="composer-input" placeholder="Type a note or pending task for ${esc(p.name)} (Press Enter to add)...">
        </div>
        <button class="btn-composer-send" id="btnSendNote">Add ✓</button>
      </div>
    `;

    // Hook up interactive handlers
    // 1. Photo upload
    const triggerUpload = () => {
      state.uploadTargetId = p.id;
      $('#globalPhotoInput').click();
    };
    $('#btnUploadPhoto').onclick = triggerUpload;
    $('#headerAvatarImg').onclick = triggerUpload;

    // 2. Rename profile
    $('#btnRenameProfile').onclick = () => {
      promptRename(p);
    };

    // 3. Copy name
    $('#btnCopyName').onclick = () => {
      navigator.clipboard.writeText(p.name).then(() => {
        showToast(`✓ Copied "${p.name}" to clipboard!`);
      }).catch(() => {
        showToast(`Profile: ${p.name}`);
      });
    };

    // 4. Quick Timer Chips
    $$('.timer-chip', main).forEach(chip => {
      chip.onclick = () => {
        const mins = parseInt(chip.dataset.min, 10);
        startCooldown(p, mins);
      };
    });

    // 5. Custom Timer
    $('#btnStartCustomTimer').onclick = () => {
      const mins = parseInt($('#customMinInput').value, 10);
      if (isNaN(mins) || mins <= 0) return;
      startCooldown(p, mins);
    };

    // 6. Clear timer
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

    // 7. Dismiss reset
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

    // 8. Note actions (Done / Delete)
    $$('.notes-stream button', main).forEach(btn => {
      btn.onclick = () => {
        const nid = btn.dataset.nid;
        const act = btn.dataset.action;
        const note = (p.notes || []).find(n => n.id === nid);
        if (!note) return;

        if (act === 'toggle-done') {
          note.done = !note.done;
          if (note.done && window.soundMgr) window.soundMgr.playReadyChime();
        } else if (act === 'delete-note') {
          p.notes = p.notes.filter(n => n.id !== nid);
        }

        saveState();
        renderSidebar();
        renderMainChat();
      };
    });

    // 9. Add note
    const input = $('#composerInput');
    const sendBtn = $('#btnSendNote');
    const handleAdd = () => {
      const text = input.value.trim();
      if (!text) return;
      if (!p.notes) p.notes = [];
      p.notes.push({
        id: uid(),
        text,
        createdAt: now(),
        done: false
      });
      input.value = '';
      saveState();
      renderSidebar();
      renderMainChat();
      showToast(`Added note to ${p.name}`);
      if (window.soundMgr) window.soundMgr.playClick();

      // Scroll to bottom
      const stream = $('#notesStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    };

    sendBtn.onclick = handleAdd;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') handleAdd();
    };
  }

  // Cooldown timer starter
  function startCooldown(profile, minutes) {
    const durationMs = minutes * 60 * 1000;
    profile.timerUntil = now() + durationMs;
    profile.timerDurationMs = durationMs;
    profile.isReset = false;
    saveState();
    renderSidebar();
    renderMainChat();
    showToast(`⏳ Cooldown set: ${minutes}m for ${profile.name}`);
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

    // Global Photo file uploader
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
