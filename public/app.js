/* CHROMEFLIX · Netflix Themed Taskbar Command Center & Notes
 * Features:
 * 1. Netflix Browse View: Giant Outline Numbers 1-10, Top 10 Row, Today's Top Picks, AI Cooldowns, All Profiles
 * 2. Messenger 2-Pane Split View: Fast note-taking & searching
 * 3. In-Place Profile Linking & Editing: Rename profiles, change taskbar slots, upload real custom photos immediately
 * 4. Expanded AI Limit Cooldowns: 15m to 24h presets + manual minutes input + "🟢 Reset" status when finished
 * 5. Live Clock & Daily Recharge Alarm Countdown Schedule
 * 6. 100% Clean Starter Template (Zero hardcoded starter notes)
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_netflix_v1';
  const OLD_STORAGE_KEY = 'chrome_taskbar_messenger_notes_v3';

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

  // The 21 Chrome Profiles in order from Windows Taskband - 100% CLEAN (0 starter notes)
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

  // Old hardcoded sample text to purge
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
    activeProfileId: "p_tb_3",
    currentView: "netflix", // "netflix" | "messenger"
    netflixFilter: "all",    // "all" | "pending" | "timers"
    messengerFilter: "all",  // "all" | "pending" | "timers"
    searchQuery: "",
    modalProfileId: null,
    uploadTargetProfileId: null
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
    el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // Load and clean state from localStorage
  function loadState() {
    let raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
    let loadedProfiles = null;

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          loadedProfiles = parsed;
        } else if (parsed && Array.isArray(parsed.profiles)) {
          loadedProfiles = parsed.profiles;
        }
      } catch (e) {
        console.warn('Failed to parse saved state:', e);
      }
    }

    if (!loadedProfiles || !loadedProfiles.length) {
      state.profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    } else {
      // Merge with defaults to guarantee all fields, strip old sample notes
      state.profiles = DEFAULT_PROFILES.map(def => {
        const found = loadedProfiles.find(p => p.id === def.id || (p.chromeNo === def.chromeNo && p.profileDir === def.profileDir));
        if (!found) return { ...def };

        const cleanedNotes = (found.notes || []).filter(note => {
          const txt = (note.text || '').toLowerCase();
          return !SAMPLES_TO_PURGE.some(sample => txt.includes(sample));
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

    // Sort profiles by taskbarSlot ascending
    state.profiles.sort((a, b) => a.taskbarSlot - b.taskbarSlot);

    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
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

  // Daily Recharge Alarm Schedule Calculator
  function getNextAlarmInfo() {
    const d = new Date();
    const curMinutes = d.getHours() * 60 + d.getMinutes();
    const curSec = d.getSeconds();

    for (const item of RECHARGE_SCHEDULE) {
      const itemMinutes = item[0] * 60 + item[1];
      if (itemMinutes > curMinutes) {
        const diffMin = itemMinutes - curMinutes;
        return {
          diffMin,
          title: item[3],
          type: item[2],
          targetHour: item[0],
          targetMin: item[1]
        };
      }
    }
    // Wraps around to tomorrow 7:00 AM
    const minutesUntilTomorrow7am = (24 * 60 - curMinutes) + 7 * 60;
    return {
      diffMin: minutesUntilTomorrow7am,
      title: RECHARGE_SCHEDULE[0][3],
      type: RECHARGE_SCHEDULE[0][2],
      targetHour: 7,
      targetMin: 0
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

  // Render Hero Spotlight Banner
  function renderHeroBanner() {
    const hero = $('#heroBanner');
    if (!hero) return;

    // Pick profile: prioritized by active timer / reset, then pending notes, then active profile
    const cur = now();
    let featured = state.profiles.find(p => p.id === state.activeProfileId);
    const withReset = state.profiles.find(p => p.isReset);
    const withTimer = state.profiles.find(p => p.timerUntil && p.timerUntil > cur);
    const withPending = state.profiles.find(p => countPending(p) > 0);

    if (withReset) featured = withReset;
    else if (withTimer) featured = withTimer;
    else if (withPending) featured = withPending;

    if (!featured) featured = state.profiles[0];

    const pendingCount = countPending(featured);
    const pendingNotes = (featured.notes || []).filter(n => !n.done);
    const snippet = pendingNotes.length ? `🔴 Pending: "${pendingNotes[0].text}"` : (featured.email || 'No pending tasks on this Chrome profile.');
    const avatarSrc = getAvatarSrc(featured);

    hero.style.backgroundImage = `url('${avatarSrc}')`;

    hero.innerHTML = `
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-series-badge">
          <span class="n-icon">N</span>
          <span>CHROME PROFILE · TASKBAR ${esc(featured.winShortcut)}</span>
        </div>
        <h1 class="hero-title">${esc(featured.name)}</h1>
        <p class="hero-subtitle">
          ${esc(featured.email)} · <span class="hero-shortcut-badge">${esc(featured.winShortcut)}</span> · Taskbar Slot #${featured.taskbarSlot}
        </p>
        <p class="hero-subtitle" style="color: ${pendingCount > 0 ? '#ff858d' : '#9ca3af'}; font-weight: ${pendingCount > 0 ? '700' : '400'};">
          ${esc(snippet)}
        </p>
        <div class="hero-actions">
          <button class="btn-netflix-play" data-action="copy-name" data-id="${featured.id}">
            ▶ Copy Name (${esc(featured.name)})
          </button>
          <button class="btn-netflix-info" data-action="open-modal" data-id="${featured.id}">
            ℹ️ More Info &amp; Notes
          </button>
        </div>
      </div>
    `;
  }

  // Render Row 1: Top 10 Taskbar Chromes Today (With Giant Outline Numbers 1 to 10!)
  function renderTop10Row() {
    const container = $('#top10Row');
    if (!container) return;

    const cur = now();
    // Take the first 10 profiles in slot order
    const top10 = state.profiles.slice(0, 10);

    container.innerHTML = top10.map((p, idx) => {
      const rank = idx + 1;
      const pendingCount = countPending(p);
      const isTimer = p.timerUntil && p.timerUntil > cur;
      const isReset = p.isReset;
      const avatarSrc = getAvatarSrc(p);

      let bottomBadge = '';
      if (isReset) {
        bottomBadge = `<div class="poster-bottom-badge reset-tag">🟢 Reset</div>`;
      } else if (isTimer) {
        const rem = formatRemaining(p.timerUntil - cur);
        bottomBadge = `<div class="poster-bottom-badge timer-tag">⏳ ${rem}</div>`;
      } else if (pendingCount > 0) {
        bottomBadge = `<div class="poster-bottom-badge">🔴 ${pendingCount} Pending</div>`;
      } else {
        bottomBadge = `<div class="poster-bottom-badge shortcut-tag">${esc(p.winShortcut)}</div>`;
      }

      return `
        <div class="top10-item" data-id="${p.id}" title="${esc(p.name)} (${esc(p.winShortcut)})">
          <div class="top10-rank-num">${rank}</div>
          <div class="card-poster">
            <span class="top10-corner-badge">TOP<br>10</span>
            <img src="${avatarSrc}" class="poster-img" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23222\\'/><text x=\\'50\\' y=\\'65\\' font-size=\\'40\\' text-anchor=\\'middle\\' fill=\\'%23fff\\'>${esc(p.name ? p.name[0] : 'C')}</text></svg>'">
            ${bottomBadge}
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Row 2: Today's Top Picks for You (Pending Work)
  function renderTopPicksRow() {
    const container = $('#topPicksRow');
    if (!container) return;

    // Filter profiles with pending notes, fallback to first 6 profiles if none
    const pendingProfiles = state.profiles.filter(p => countPending(p) > 0);
    const displayList = pendingProfiles.length ? pendingProfiles : state.profiles.slice(0, 6);

    container.innerHTML = displayList.map(p => {
      const pendingCount = countPending(p);
      const avatarSrc = getAvatarSrc(p);
      const pendingNotes = (p.notes || []).filter(n => !n.done);
      const snippet = pendingNotes.length ? `📌 ${pendingNotes[0].text}` : 'No pending tasks waiting';

      return `
        <div class="nf-card ${pendingCount > 0 ? 'has-pending' : ''}" data-id="${p.id}">
          <div class="nf-card-thumb">
            <img src="${avatarSrc}" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23222\\'/><text x=\\'50\\' y=\\'65\\' font-size=\\'40\\' text-anchor=\\'middle\\' fill=\\'%23fff\\'>${esc(p.name ? p.name[0] : 'C')}</text></svg>'">
            <span class="top10-corner-badge" style="background:${pendingCount > 0 ? 'var(--nf-red)' : '#444'}">
              ${pendingCount > 0 ? 'PENDING' : 'READY'}
            </span>
            ${pendingCount > 0 ? `<div class="poster-bottom-badge">🔴 ${pendingCount} Task${pendingCount > 1 ? 's' : ''} Waiting</div>` : `<div class="poster-bottom-badge shortcut-tag">Recently Added</div>`}
          </div>
          <div class="nf-card-info">
            <div class="nf-card-title-row">
              <span class="nf-card-title">${esc(p.name)}</span>
              <span class="nf-card-shortcut">${esc(p.winShortcut)}</span>
            </div>
            <div class="nf-card-snippet ${pendingCount > 0 ? 'pending-glow' : ''}">
              ${esc(snippet)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Row 3: Active Cooldowns & Reset Limits
  function renderCooldownsRow() {
    const container = $('#cooldownsRow');
    if (!container) return;

    const cur = now();
    const cooldownProfiles = state.profiles.filter(p => (p.timerUntil && p.timerUntil > cur) || p.isReset);

    if (!cooldownProfiles.length) {
      container.innerHTML = `
        <div style="padding: 24px 32px; background: var(--nf-surface); border: 1px dashed var(--nf-border); border-radius: 8px; color: var(--nf-tx-muted); font-size: 13.5px; width: 100%; display: flex; align-items: center; justify-content: space-between;">
          <span>⏳ No Chromes currently in cooldown. Click any profile to set an AI limit cooldown timer (15m, 1h, 5h, or custom minutes).</span>
          <button class="btn-editor" data-action="open-modal" data-id="${state.profiles[0].id}">Set Timer on Chrome #1</button>
        </div>
      `;
      return;
    }

    container.innerHTML = cooldownProfiles.map(p => {
      const avatarSrc = getAvatarSrc(p);
      const isReset = p.isReset;
      const rem = p.timerUntil ? formatRemaining(p.timerUntil - cur) : '';

      return `
        <div class="nf-card ${isReset ? 'has-reset' : 'has-timer'}" data-id="${p.id}">
          <div class="nf-card-thumb">
            <img src="${avatarSrc}" alt="${esc(p.name)}">
            <span class="top10-corner-badge" style="background:${isReset ? 'var(--nf-green)' : 'var(--nf-gold)'}; color:#000;">
              ${isReset ? 'RESET' : 'TIMER'}
            </span>
            <div class="poster-bottom-badge ${isReset ? 'reset-tag' : 'timer-tag'}">
              ${isReset ? '🟢 Limit Reset!' : `⏳ ${rem}`}
            </div>
          </div>
          <div class="nf-card-info">
            <div class="nf-card-title-row">
              <span class="nf-card-title">${esc(p.name)}</span>
              <span class="nf-card-shortcut">${esc(p.winShortcut)}</span>
            </div>
            <div class="nf-card-snippet ${isReset ? '' : 'timer-glow'}" style="${isReset ? 'color: var(--nf-green); font-weight:700;' : ''}">
              ${isReset ? '✓ Quota reset! Ready for work' : `AI Cooldown: ${rem} remaining`}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Row 4: All 21 Taskbar Profiles
  function renderAllProfilesRow() {
    const container = $('#allProfilesRow');
    if (!container) return;

    const cur = now();
    const query = state.searchQuery.toLowerCase().trim();

    const filtered = state.profiles.filter(p => {
      if (!query) return true;
      const inName = p.name.toLowerCase().includes(query);
      const inEmail = (p.email || '').toLowerCase().includes(query);
      const inSlot = String(p.taskbarSlot).includes(query) || (p.winShortcut || '').toLowerCase().includes(query);
      const inNotes = (p.notes || []).some(n => n.text.toLowerCase().includes(query));
      return inName || inEmail || inSlot || inNotes;
    });

    if (!filtered.length) {
      container.innerHTML = `<div style="padding: 20px; color: var(--nf-tx-muted);">No profiles matched "${esc(query)}".</div>`;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const pendingCount = countPending(p);
      const isTimer = p.timerUntil && p.timerUntil > cur;
      const isReset = p.isReset;
      const avatarSrc = getAvatarSrc(p);

      let badgeHtml = '';
      if (isReset) {
        badgeHtml = `<div class="poster-bottom-badge reset-tag">🟢 Reset</div>`;
      } else if (isTimer) {
        badgeHtml = `<div class="poster-bottom-badge timer-tag">⏳ ${formatRemaining(p.timerUntil - cur)}</div>`;
      } else if (pendingCount > 0) {
        badgeHtml = `<div class="poster-bottom-badge">🔴 ${pendingCount} Pending</div>`;
      } else {
        badgeHtml = `<div class="poster-bottom-badge shortcut-tag">Slot #${p.taskbarSlot}</div>`;
      }

      return `
        <div class="nf-card ${pendingCount > 0 ? 'has-pending' : ''} ${isTimer ? 'has-timer' : ''} ${isReset ? 'has-reset' : ''}" data-id="${p.id}">
          <div class="nf-card-thumb">
            <img src="${avatarSrc}" alt="${esc(p.name)}">
            <span class="top10-corner-badge">${esc(p.winShortcut)}</span>
            ${badgeHtml}
          </div>
          <div class="nf-card-info">
            <div class="nf-card-title-row">
              <span class="nf-card-title">${esc(p.name)}</span>
              <span class="nf-card-shortcut">${esc(p.winShortcut)}</span>
            </div>
            <div class="nf-card-snippet ${pendingCount > 0 ? 'pending-glow' : ''}">
              ${pendingCount > 0 ? `🔴 ${pendingCount} pending task${pendingCount > 1 ? 's' : ''}` : esc(p.email)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Netflix "More Info" Detailed Modal Dialog
  function renderNetflixModal(profileId) {
    const modal = $('#netflixModal');
    const content = $('#netflixModalContent');
    if (!modal || !content) return;

    const p = getProfile(profileId);
    state.modalProfileId = p.id;
    const cur = now();
    const isTimer = p.timerUntil && p.timerUntil > cur;
    const isReset = p.isReset;
    const rem = isTimer ? formatRemaining(p.timerUntil - cur) : '';
    const avatarSrc = getAvatarSrc(p);
    const notes = p.notes || [];

    content.innerHTML = `
      <!-- Modal Hero Header -->
      <div class="modal-hero-cover">
        <img src="${avatarSrc}" class="modal-hero-img" alt="${esc(p.name)}">
        <div class="modal-hero-gradient"></div>
        <button class="modal-close-btn" id="modalCloseBtn" title="Close">✕</button>
        <div class="modal-header-info">
          <div class="modal-title-text">
            <h2>${esc(p.name)}</h2>
            <p>${esc(p.email)} · Taskbar Slot #${p.taskbarSlot} · <strong>${esc(p.winShortcut)}</strong></p>
          </div>
          <div>
            <button class="btn-netflix-play" data-action="copy-name" data-id="${p.id}">
              ▶ Copy Name
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- 1. In-Place Profile Name & Photo Editor (Always Linked) -->
        <div class="profile-editor-box">
          <div class="editor-title">✏️ Profile Settings &amp; Picture (Directly Linked)</div>
          <div class="editor-row">
            <label style="font-size:12px; color:#aaa; width:80px;">Name:</label>
            <input type="text" id="modalEditName" class="editor-input" value="${esc(p.name)}" placeholder="Profile Name">
            <button class="btn-editor primary" id="btnSaveName">Save Name</button>
          </div>
          <div class="editor-row">
            <label style="font-size:12px; color:#aaa; width:80px;">Taskbar Slot:</label>
            <input type="number" id="modalEditSlot" class="editor-input" style="max-width:100px;" value="${p.taskbarSlot}" min="1" max="50">
            <button class="btn-editor" id="btnSaveSlot">Update Slot</button>
            <div style="flex:1;"></div>
            <button class="btn-editor" id="btnUploadPhoto">📷 Upload Photo</button>
            ${p.customAvatar ? `<button class="btn-editor" id="btnRevertPhoto" style="color:#f87171;">↩ Default Photo</button>` : ''}
          </div>
        </div>

        <!-- 2. Expanded AI Limit Cooldown Timer Section -->
        <div class="modal-timer-section">
          <div class="timer-section-header">
            <span class="timer-status-title">⏳ AI Limit Cooldown &amp; Reset Timer</span>
            ${isTimer ? `<span style="font-size:12px; color:var(--nf-gold); font-weight:700;">Active Countdown</span>` : ''}
          </div>

          ${isTimer ? `
            <div class="timer-active-banner">
              <span>⏳ Cooldown Active: <strong>${rem}</strong> remaining</span>
              <button class="btn-editor" id="btnClearTimer">✕ Clear Timer</button>
            </div>
          ` : ''}

          ${isReset ? `
            <div class="timer-reset-banner">
              <span>🟢 Limit Reset! Your AI credits &amp; quota are ready for work.</span>
              <button class="btn-editor" id="btnDismissReset" style="background:#059669; border-color:#059669; color:#fff;">✓ Acknowledge</button>
            </div>
          ` : ''}

          <!-- Timer Presets Grid -->
          <div class="timer-presets-grid">
            <button class="btn-timer-preset" data-minutes="15">15 min</button>
            <button class="btn-timer-preset" data-minutes="30">30 min</button>
            <button class="btn-timer-preset" data-minutes="45">45 min</button>
            <button class="btn-timer-preset" data-minutes="60">1 hr</button>
            <button class="btn-timer-preset" data-minutes="120">2 hr</button>
            <button class="btn-timer-preset" data-minutes="180">3 hr</button>
            <button class="btn-timer-preset" data-minutes="240">4 hr</button>
            <button class="btn-timer-preset" data-minutes="300">5 hr</button>
            <button class="btn-timer-preset" data-minutes="480">8 hr</button>
            <button class="btn-timer-preset" data-minutes="1440">24 hr</button>
          </div>

          <!-- Manual Minutes Input Bar -->
          <div class="manual-timer-bar">
            <span style="font-size:12px; color:#aaa; font-weight:600;">Manual Minutes:</span>
            <input type="number" id="manualTimerInput" class="manual-timer-input" placeholder="e.g. 45" min="1" max="10000" value="45">
            <button class="btn-editor" id="btnQuickPlus5">+5m</button>
            <button class="btn-editor" id="btnQuickPlus15">+15m</button>
            <button class="btn-editor primary" id="btnStartManualTimer">Start Timer ⏱️</button>
          </div>
        </div>

        <!-- 3. Notes & Pending Tasks Stream -->
        <div class="modal-notes-section">
          <div style="font-size:13px; font-weight:800; color:#fff; display:flex; justify-content:space-between; align-items:center;">
            <span>📌 Pending Tasks &amp; Notes (${notes.filter(n => !n.done).length} waiting)</span>
          </div>

          <div class="modal-notes-list" id="modalNotesList">
            ${!notes.length ? `<div style="text-align:center; padding:24px; color:#777; font-size:13px;">No notes for ${esc(p.name)} yet. Type below to add one!</div>` : notes.map(n => `
              <div class="modal-note-item ${n.done ? 'done' : ''}" data-nid="${n.id}">
                <div class="note-text-body">${esc(n.text)}</div>
                <div class="note-item-meta">
                  <span>${n.done ? '✓ Completed' : '🔴 Pending'}</span>
                  <div class="note-item-actions">
                    <button class="btn-note-action" data-action="toggle-done" data-nid="${n.id}">
                      ${n.done ? '↩ Reopen' : '✓ Done'}
                    </button>
                    <button class="btn-note-action delete" data-action="delete-note" data-nid="${n.id}">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Add Note Bar -->
          <div class="modal-note-composer">
            <input type="text" id="modalNoteInput" class="modal-note-input" placeholder="Type a note or pending task for ${esc(p.name)}... (Press Enter to add)">
            <button class="btn-netflix-play" id="btnModalAddNote" style="padding:10px 18px;">
              Add ✓
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    // Hook up modal event listeners
    $('#modalCloseBtn').onclick = () => closeModal();

    $('#btnSaveName').onclick = () => {
      const newName = $('#modalEditName').value.trim();
      if (!newName) return;
      p.name = newName;
      saveState();
      renderAll();
      renderNetflixModal(p.id);
      showToast(`Updated profile name to "${newName}"`);
    };

    $('#btnSaveSlot').onclick = () => {
      const newSlot = parseInt($('#modalEditSlot').value, 10);
      if (isNaN(newSlot) || newSlot < 1) return;
      p.taskbarSlot = newSlot;
      p.winShortcut = newSlot <= 9 ? `Win + ${newSlot}` : `Slot #${newSlot}`;
      state.profiles.sort((a, b) => a.taskbarSlot - b.taskbarSlot);
      saveState();
      renderAll();
      renderNetflixModal(p.id);
      showToast(`Moved to Taskbar Slot #${newSlot}`);
    };

    $('#btnUploadPhoto').onclick = () => {
      state.uploadTargetProfileId = p.id;
      $('#globalAvatarInput').click();
    };

    const revertBtn = $('#btnRevertPhoto');
    if (revertBtn) {
      revertBtn.onclick = () => {
        p.customAvatar = null;
        saveState();
        renderAll();
        renderNetflixModal(p.id);
        showToast(`Reverted ${p.name} to default avatar`);
      };
    }

    // Timer presets
    $$('.btn-timer-preset', content).forEach(btn => {
      btn.onclick = () => {
        const mins = parseInt(btn.dataset.minutes, 10);
        startTimer(p, mins);
      };
    });

    // Manual Timer
    $('#btnQuickPlus5').onclick = () => {
      const input = $('#manualTimerInput');
      input.value = (parseInt(input.value || '0', 10) + 5);
    };

    $('#btnQuickPlus15').onclick = () => {
      const input = $('#manualTimerInput');
      input.value = (parseInt(input.value || '0', 10) + 15);
    };

    $('#btnStartManualTimer').onclick = () => {
      const mins = parseInt($('#manualTimerInput').value, 10);
      if (isNaN(mins) || mins <= 0) return;
      startTimer(p, mins);
    };

    const clearBtn = $('#btnClearTimer');
    if (clearBtn) {
      clearBtn.onclick = () => {
        p.timerUntil = null;
        p.timerDurationMs = null;
        p.isReset = false;
        saveState();
        renderAll();
        renderNetflixModal(p.id);
        showToast(`Cleared cooldown timer for ${p.name}`);
      };
    }

    const dismissResetBtn = $('#btnDismissReset');
    if (dismissResetBtn) {
      dismissResetBtn.onclick = () => {
        p.isReset = false;
        p.timerUntil = null;
        saveState();
        renderAll();
        renderNetflixModal(p.id);
        showToast(`Acknowledged reset for ${p.name}`);
      };
    }

    // Note adding
    const addNoteBtn = $('#btnModalAddNote');
    const noteInput = $('#modalNoteInput');

    const handleAddNote = () => {
      const text = noteInput.value.trim();
      if (!text) return;
      if (!p.notes) p.notes = [];
      p.notes.push({
        id: uid(),
        text,
        createdAt: now(),
        done: false
      });
      noteInput.value = '';
      saveState();
      renderAll();
      renderNetflixModal(p.id);
      showToast(`Added note to ${p.name}`);
      if (window.soundMgr) window.soundMgr.playClick();
    };

    addNoteBtn.onclick = handleAddNote;
    noteInput.onkeydown = (e) => {
      if (e.key === 'Enter') handleAddNote();
    };

    // Note item actions
    $$('.btn-note-action', content).forEach(btn => {
      btn.onclick = () => {
        const nid = btn.dataset.nid;
        const act = btn.dataset.action;
        const targetNote = (p.notes || []).find(n => n.id === nid);
        if (!targetNote) return;

        if (act === 'toggle-done') {
          targetNote.done = !targetNote.done;
          if (targetNote.done && window.soundMgr) window.soundMgr.playReadyChime();
        } else if (act === 'delete-note') {
          p.notes = p.notes.filter(n => n.id !== nid);
        }

        saveState();
        renderAll();
        renderNetflixModal(p.id);
      };
    });
  }

  function startTimer(profile, minutes) {
    const durationMs = minutes * 60 * 1000;
    profile.timerUntil = now() + durationMs;
    profile.timerDurationMs = durationMs;
    profile.isReset = false;
    saveState();
    renderAll();
    renderNetflixModal(profile.id);
    showToast(`⏳ Cooldown set: ${minutes}m for ${profile.name}`);
    if (window.soundMgr) window.soundMgr.playClick();
  }

  function closeModal() {
    const modal = $('#netflixModal');
    if (modal) modal.style.display = 'none';
    state.modalProfileId = null;
  }

  // Render Messenger View (Left column list + Right column chat pane)
  function renderMessengerView() {
    const chromeList = $('#mChromeList');
    const chatPane = $('#mChatPane');
    if (!chromeList || !chatPane) return;

    const cur = now();
    const query = (state.searchQuery || '').toLowerCase().trim();
    const filter = state.messengerFilter;

    // Filter profiles for messenger sidebar
    const filtered = state.profiles.filter(p => {
      const pendingCount = countPending(p);
      const isTimer = (p.timerUntil && p.timerUntil > cur) || p.isReset;

      if (filter === 'pending' && pendingCount === 0) return false;
      if (filter === 'timers' && !isTimer) return false;

      if (!query) return true;
      const inName = p.name.toLowerCase().includes(query);
      const inEmail = (p.email || '').toLowerCase().includes(query);
      const inNotes = (p.notes || []).some(n => n.text.toLowerCase().includes(query));
      return inName || inEmail || inNotes;
    });

    // Render left profile list
    if (!filtered.length) {
      chromeList.innerHTML = `<div style="padding:20px; color:#777; font-size:13px; text-align:center;">No matching Chromes</div>`;
    } else {
      chromeList.innerHTML = filtered.map(p => {
        const isActive = p.id === state.activeProfileId;
        const pendingCount = countPending(p);
        const isTimer = p.timerUntil && p.timerUntil > cur;
        const isReset = p.isReset;
        const avatarSrc = getAvatarSrc(p);
        const pendingNotes = (p.notes || []).filter(n => !n.done);
        const snippet = pendingNotes.length ? `📌 ${pendingNotes[0].text}` : 'No notes yet';

        return `
          <div class="chrome-item ${isActive ? 'active' : ''}" data-id="${p.id}">
            <div class="chrome-avatar-wrap">
              <img src="${avatarSrc}" class="chrome-avatar" alt="${esc(p.name)}">
              <span class="slot-badge">${esc(p.winShortcut.replace('Win + ', 'W+'))}</span>
            </div>
            <div class="chrome-info">
              <div class="chrome-row-1">
                <span class="chrome-name">${esc(p.name)}</span>
                <span class="chrome-shortcut">${esc(p.winShortcut)}</span>
              </div>
              <div class="chrome-row-2">
                <span class="chrome-snippet ${pendingCount > 0 ? 'pending-glow' : ''}">${esc(snippet)}</span>
                ${pendingCount > 0 ? `<span class="pending-badge">${pendingCount}</span>` : ''}
                ${isTimer ? `<span class="timer-badge">⏳</span>` : ''}
                ${isReset ? `<span class="reset-badge">🟢</span>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Attach click listeners to profile items in sidebar
    $$('.chrome-item', chromeList).forEach(item => {
      item.onclick = () => {
        state.activeProfileId = item.dataset.id;
        renderMessengerView();
      };
    });

    // Render right chat pane for active profile
    const active = getProfile(state.activeProfileId);
    const activeAvatar = getAvatarSrc(active);
    const activePending = countPending(active);
    const isTimer = active.timerUntil && active.timerUntil > cur;
    const isReset = active.isReset;
    const rem = isTimer ? formatRemaining(active.timerUntil - cur) : '';
    const notes = active.notes || [];

    chatPane.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-profile">
          <img src="${activeAvatar}" class="chat-avatar" alt="${esc(active.name)}">
          <div>
            <div class="chat-title">${esc(active.name)}</div>
            <div class="chat-meta">${esc(active.email)} · Taskbar Slot #${active.taskbarSlot}</div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="btn-editor" id="mBtnUploadPhoto">📷 Photo</button>
          <button class="btn-editor" data-action="copy-name" data-id="${active.id}">📋 Copy Name</button>
          <span class="shortcut-pill">${esc(active.winShortcut)}</span>
        </div>
      </div>

      <!-- Quick Timer Bar -->
      <div class="quick-timer-bar">
        <span class="quick-timer-label">Hit AI limit? Start a quick timer:</span>
        <button class="btn-timer-chip" data-min="15">15m</button>
        <button class="btn-timer-chip" data-min="30">30m</button>
        <button class="btn-timer-chip" data-min="45">45m</button>
        <button class="btn-timer-chip" data-min="60">1h</button>
        <button class="btn-timer-chip" data-min="120">2h</button>
        <button class="btn-timer-chip" data-min="180">3h</button>
        <button class="btn-timer-chip" data-min="300">5h</button>
        <button class="btn-timer-chip" id="mBtnMoreTimer">More Options...</button>
      </div>

      ${isTimer ? `
        <div class="active-timer-banner">
          <span>⏳ Cooldown Active: <strong>${rem}</strong> remaining</span>
          <button class="btn-clear-timer" id="mBtnClearTimer">✕ Clear Timer</button>
        </div>
      ` : ''}

      ${isReset ? `
        <div class="active-reset-banner">
          <span>🟢 Limit Reset! Quota ready for work.</span>
          <button class="btn-clear-timer" id="mBtnDismissReset" style="background:#059669; border-color:#059669; color:#fff;">✓ Acknowledge</button>
        </div>
      ` : ''}

      <!-- Notes Stream -->
      <div class="notes-stream" id="mNotesStream">
        ${!notes.length ? `
          <div class="empty-notes">
            <div class="empty-notes-icon">📝</div>
            <h3>No pending notes for ${esc(active.name)}</h3>
            <p>Type a note or pending task below to remember what to do.</p>
          </div>
        ` : notes.map(n => `
          <div class="note-bubble-wrap" data-nid="${n.id}">
            <div class="note-bubble ${n.done ? 'done' : ''}">
              <div class="note-text">${esc(n.text)}</div>
              <div class="note-bubble-actions">
                <button class="bubble-btn" data-action="m-toggle" data-nid="${n.id}">
                  ${n.done ? '↩' : '✓ Done'}
                </button>
                <button class="bubble-btn delete" data-action="m-delete" data-nid="${n.id}">
                  🗑️
                </button>
              </div>
            </div>
            <div class="note-timestamp">${new Date(n.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · ${n.done ? 'Completed' : 'Pending'}</div>
          </div>
        `).join('')}
      </div>

      <!-- Chat Composer Bar -->
      <div class="composer-bar">
        <input type="text" id="mNoteInput" class="composer-input" placeholder="💬 Type a note or pending task for ${esc(active.name)} (Press Enter to add)...">
        <button class="composer-send-btn" id="mBtnSendNote">Add ✓</button>
      </div>
    `;

    // Hook listeners for messenger right pane
    $('#mBtnUploadPhoto').onclick = () => {
      state.uploadTargetProfileId = active.id;
      $('#globalAvatarInput').click();
    };

    $('#mBtnMoreTimer').onclick = () => {
      renderNetflixModal(active.id);
    };

    $$('.btn-timer-chip', chatPane).forEach(chip => {
      if (chip.dataset.min) {
        chip.onclick = () => {
          const mins = parseInt(chip.dataset.min, 10);
          startTimer(active, mins);
          renderMessengerView();
        };
      }
    });

    const mClear = $('#mBtnClearTimer');
    if (mClear) {
      mClear.onclick = () => {
        active.timerUntil = null;
        active.timerDurationMs = null;
        active.isReset = false;
        saveState();
        renderAll();
        showToast(`Cleared cooldown timer for ${active.name}`);
      };
    }

    const mDismiss = $('#mBtnDismissReset');
    if (mDismiss) {
      mDismiss.onclick = () => {
        active.isReset = false;
        active.timerUntil = null;
        saveState();
        renderAll();
        showToast(`Acknowledged reset for ${active.name}`);
      };
    }

    // Add note in messenger
    const mSend = $('#mBtnSendNote');
    const mInput = $('#mNoteInput');
    const handleMSend = () => {
      const text = mInput.value.trim();
      if (!text) return;
      if (!active.notes) active.notes = [];
      active.notes.push({
        id: uid(),
        text,
        createdAt: now(),
        done: false
      });
      mInput.value = '';
      saveState();
      renderAll();
      showToast(`Added note to ${active.name}`);
      if (window.soundMgr) window.soundMgr.playClick();
    };

    mSend.onclick = handleMSend;
    mInput.onkeydown = (e) => {
      if (e.key === 'Enter') handleMSend();
    };

    // Bubble actions
    $$('.bubble-btn', chatPane).forEach(btn => {
      btn.onclick = () => {
        const nid = btn.dataset.nid;
        const act = btn.dataset.action;
        const targetNote = (active.notes || []).find(n => n.id === nid);
        if (!targetNote) return;

        if (act === 'm-toggle') {
          targetNote.done = !targetNote.done;
          if (targetNote.done && window.soundMgr) window.soundMgr.playReadyChime();
        } else if (act === 'm-delete') {
          active.notes = active.notes.filter(n => n.id !== nid);
        }

        saveState();
        renderAll();
      };
    });
  }

  // Update badges on top nav and sidebar tabs
  function updateNavBadges() {
    const pCount = totalPendingCount();
    const tCount = totalTimersCount();

    const pBadge = $('#navPendingBadge');
    if (pBadge) pBadge.textContent = pCount;

    const tBadge = $('#navTimersBadge');
    if (tBadge) tBadge.textContent = tCount;

    const mpBadge = $('#mPendingCount');
    if (mpBadge) mpBadge.textContent = pCount;

    const mtBadge = $('#mTimersCount');
    if (mtBadge) mtBadge.textContent = tCount;

    const mfilterAll = $('#mfilterAll');
    if (mfilterAll) mfilterAll.textContent = `All (${state.profiles.length})`;
  }

  // Master Render Function
  function renderAll() {
    updateNavBadges();

    if (state.currentView === 'netflix') {
      $('#netflixView').style.display = 'block';
      $('#messengerView').style.display = 'none';

      renderHeroBanner();
      renderTop10Row();
      renderTopPicksRow();
      renderCooldownsRow();
      renderAllProfilesRow();
    } else {
      $('#netflixView').style.display = 'none';
      $('#messengerView').style.display = 'block';

      renderMessengerView();
    }

    // If modal is open, re-render its content
    if (state.modalProfileId) {
      renderNetflixModal(state.modalProfileId);
    }
  }

  // Timer Tick Check: runs every second
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
    }

    renderClockBox();

    // Refresh live time strings in UI
    if (state.currentView === 'netflix') {
      renderTop10Row();
      renderCooldownsRow();
      renderAllProfilesRow();
    } else {
      renderMessengerView();
    }

    if (state.modalProfileId) {
      const banner = $('.timer-active-banner strong');
      if (banner) {
        const p = getProfile(state.modalProfileId);
        if (p.timerUntil && p.timerUntil > cur) {
          banner.textContent = formatRemaining(p.timerUntil - cur);
        }
      }
    }
  }

  // Global Event Delegation & Setup
  function initEvents() {
    // Top Nav buttons
    $('#logoBtn').onclick = () => {
      state.currentView = 'netflix';
      state.searchQuery = '';
      $('#netflixSearch').value = '';
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      $('#navHome').classList.add('active');
      renderAll();
    };

    $('#navHome').onclick = () => {
      state.currentView = 'netflix';
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      $('#navHome').classList.add('active');
      renderAll();
    };

    $('#navPending').onclick = () => {
      state.currentView = 'netflix';
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      $('#navPending').classList.add('active');
      renderAll();
      const topPicks = $('#topPicksSection');
      if (topPicks) topPicks.scrollIntoView({ behavior: 'smooth' });
    };

    $('#navTimers').onclick = () => {
      state.currentView = 'netflix';
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      $('#navTimers').classList.add('active');
      renderAll();
      const cdSection = $('#cooldownSection');
      if (cdSection) cdSection.scrollIntoView({ behavior: 'smooth' });
    };

    $('#navMessenger').onclick = () => {
      state.currentView = 'messenger';
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      $('#navMessenger').classList.add('active');
      renderAll();
    };

    // Netflix Search input
    $('#netflixSearch').oninput = (e) => {
      state.searchQuery = e.target.value;
      renderAllProfilesRow();
    };

    // Messenger Search input
    $('#messengerSearch').oninput = (e) => {
      state.searchQuery = e.target.value;
      renderMessengerView();
    };

    // Messenger Filter Tabs
    $('#mfilterAll').onclick = () => {
      state.messengerFilter = 'all';
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      $('#mfilterAll').classList.add('active');
      renderMessengerView();
    };

    $('#mfilterPending').onclick = () => {
      state.messengerFilter = 'pending';
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      $('#mfilterPending').classList.add('active');
      renderMessengerView();
    };

    $('#mfilterTimers').onclick = () => {
      state.messengerFilter = 'timers';
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      $('#mfilterTimers').classList.add('active');
      renderMessengerView();
    };

    // Global click delegate for cards and action buttons
    document.addEventListener('click', (e) => {
      // 1. Copy Name button
      const copyBtn = e.target.closest('[data-action="copy-name"]');
      if (copyBtn) {
        e.stopPropagation();
        const p = getProfile(copyBtn.dataset.id);
        if (p) {
          navigator.clipboard.writeText(p.name).then(() => {
            showToast(`✓ Copied "${p.name}" to clipboard!`);
          }).catch(() => {
            showToast(`Profile: ${p.name}`);
          });
        }
        return;
      }

      // 2. Open Modal button
      const infoBtn = e.target.closest('[data-action="open-modal"]');
      if (infoBtn) {
        e.stopPropagation();
        renderNetflixModal(infoBtn.dataset.id);
        return;
      }

      // 3. Top 10 item clicked
      const top10Item = e.target.closest('.top10-item');
      if (top10Item) {
        renderNetflixModal(top10Item.dataset.id);
        return;
      }

      // 4. Standard Netflix Card clicked
      const nfCard = e.target.closest('.nf-card');
      if (nfCard && !e.target.closest('button')) {
        renderNetflixModal(nfCard.dataset.id);
        return;
      }

      // 5. Click outside modal to close
      const modal = $('#netflixModal');
      if (modal && modal.style.display === 'flex' && e.target === modal) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.modalProfileId) {
        closeModal();
      }
    });

    // File input handler for avatar photo uploads
    $('#globalAvatarInput').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || !state.uploadTargetProfileId) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        const target = getProfile(state.uploadTargetProfileId);
        if (target) {
          target.customAvatar = base64;
          saveState();
          renderAll();
          if (state.modalProfileId === target.id) {
            renderNetflixModal(target.id);
          }
          showToast(`✓ Photo updated for ${target.name}!`);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });
  }

  // Initialization
  function init() {
    loadState();
    initEvents();
    renderAll();
    renderClockBox();

    // Interval for 1-second countdowns & schedule clock
    setInterval(timerTick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
