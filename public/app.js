/* Chrome Taskbar Tracker - 100% Real Windows Taskbar Sync
 * Mapped directly from Windows Registry HKCU Taskband FavoritesResolve
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_real_taskbar_tracker_v5';

  // Exact 21 Chrome Profiles in order from Windows Taskband FavoritesResolve
  // Slot 1 = File Explorer (Win + 1)
  // Slot 2 = Microsoft Edge (Win + 2)
  // Slot 3 = Chrome #1: A0 1994 (Win + 3)
  // ...
  const REAL_PINNED_PROFILES = [
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", color: "#3DDC97", emoji: "🌐", status: "ready", readyAt: null, purpose: "Primary / Default Chrome", todos: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, purpose: "DepEd School Admin / Teaching", todos: [
      { id: "t_deped_1", text: "Draft Grade 8 ST2 Test & Table of Specifications", done: false, createdAt: now() }
    ]},
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", color: "#E8A33D", emoji: "📘", status: "ready", readyAt: null, purpose: "General AI / Personal", todos: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", color: "#E86A8A", emoji: "📊", status: "ready", readyAt: null, purpose: "Research / Tools", todos: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "Hero", email: "heroesmeraldaepicalu@gmail.com", color: "#A78BFA", emoji: "🧠", status: "ready", readyAt: null, purpose: "AI Exploration", todos: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 A Yify", email: "yifyyts7@gmail.com", color: "#2DD4BF", emoji: "🎯", status: "ready", readyAt: null, purpose: "Media / Tools", todos: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 B NASH", email: "revnash0@gmail.com", color: "#F97316", emoji: "📝", status: "ready", readyAt: null, purpose: "Ministry & Devotion Review", todos: [
      { id: "t_nash_1", text: "Prepare Youth Devotion Slide Deck for Sunday", done: false, createdAt: now() }
    ]},
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Icon #10", name: "A4 C Gwapo", email: "gwapocpogi@gmail.com", color: "#84CC16", emoji: "📊", status: "ready", readyAt: null, purpose: "Grade Analysis", todos: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Icon #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", color: "#F472B6", emoji: "📘", status: "ready", readyAt: null, purpose: "Primary Account", todos: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Icon #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, purpose: "Academic Writing", todos: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Icon #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", color: "#FACC15", emoji: "⚡", status: "ready", readyAt: null, purpose: "Dissertation Ch. 3", todos: [
      { id: "t_diss_1", text: "Revise Chapter 3 Instrumentation & Sampling Framework", done: false, createdAt: now() }
    ]},
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Icon #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", color: "#94A3B8", emoji: "📘", status: "ready", readyAt: null, purpose: "Lesson Plans / Tests", todos: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Icon #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", color: "#3DDC97", emoji: "🎯", status: "ready", readyAt: null, purpose: "Test Creation ST2", todos: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Icon #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", color: "#4DA3FF", emoji: "🧠", status: "ready", readyAt: null, purpose: "Curriculum Work", todos: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Icon #17", name: "A6 scite003 Gold Cloud", email: "goldcloudblack@gmail.com", color: "#E8A33D", emoji: "📝", status: "ready", readyAt: null, purpose: "Notes & Summaries", todos: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Icon #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", color: "#E86A8A", emoji: "🛠️", status: "ready", readyAt: null, purpose: "Literature Search", todos: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Icon #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", color: "#A78BFA", emoji: "🧮", status: "ready", readyAt: null, purpose: "Research Synthesis", todos: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Icon #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", color: "#2DD4BF", emoji: "🎓", status: "ready", readyAt: null, purpose: "Academic Citations", todos: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Icon #21", name: "pogiorlandopasion", email: "pogiorlandopasion@gmail.com", color: "#F97316", emoji: "📚", status: "ready", readyAt: null, purpose: "Ministry Presentations", todos: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Icon #22", name: "watchonlineapple", email: "watchonlineapple@gmail.com", color: "#84CC16", emoji: "🏫", status: "ready", readyAt: null, purpose: "Online Media / Video", todos: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Icon #23", name: "grammarly", email: "grammarlyquillbot001@gmail.com", color: "#F472B6", emoji: "💡", status: "ready", readyAt: null, purpose: "Grammar & Proofreading", todos: [] }
  ];

  function loadState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    // Migration of any custom user todos from previous storage keys by profileDir
    const previousTodosByDir = {};
    ['chrome_taskbar_tracker_v4', 'chrome_taskbar_cc_state_v3'].forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const old = JSON.parse(raw);
          (old.profiles || []).forEach(p => {
            if (p.profileDir && p.todos && p.todos.length) {
              previousTodosByDir[p.profileDir] = p.todos;
            }
          });
        }
      } catch (_) {}
    });

    if (!saved || !saved.profiles || !saved.profiles.length) {
      saved = { profiles: REAL_PINNED_PROFILES };
      // Copy over any user-created todos if present
      saved.profiles.forEach(p => {
        if (previousTodosByDir[p.profileDir]) {
          p.todos = previousTodosByDir[p.profileDir];
        }
      });
    } else {
      // Ensure exact real mapping order is maintained
      const map = {};
      saved.profiles.forEach(p => { map[p.profileDir] = p; });
      saved.profiles = REAL_PINNED_PROFILES.map(rp => {
        const existing = map[rp.profileDir];
        if (existing) {
          return Object.assign({}, rp, {
            status: existing.status || rp.status,
            readyAt: existing.readyAt || null,
            todos: (existing.todos && existing.todos.length) ? existing.todos : rp.todos
          });
        }
        return rp;
      });
    }

    return saved;
  }

  let S = loadState();
  let currentFilter = 'all'; // 'all', 'pending', 'cooldown', 'ready'
  let searchQuery = '';

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('Save error:', e);
    }
  }

  function fmtDur(ms) {
    if (ms <= 0) return 'Ready';
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
    return `${m}m ${String(sec).padStart(2, '0')}s`;
  }

  function fmtAt(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function effStatus(p, t = now()) {
    if (p.status === 'waiting' && p.readyAt && p.readyAt <= t) return 'ready';
    return p.status || 'ready';
  }

  function getPendingTasks(p) {
    return (p.todos || []).filter(t => !t.done);
  }

  function toast(html, dur = 3500) {
    const wrap = $('#toast');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerHTML = html;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      setTimeout(() => t.remove(), 250);
    }, dur);
  }

  function showSwitchNote(p) {
    const shortcut = p.taskbarSlot <= 9 ? `Press Win + ${p.taskbarSlot}` : `Click Taskbar Icon #${p.taskbarSlot}`;
    
    try { navigator.clipboard.writeText(p.name); } catch (_) {}

    toast(`
      <span style="font-size:24px;">👉</span>
      <div>
        <b style="font-size:14px;color:#fff;">Switch to: ${esc(p.name)}</b> (Chrome #${p.chromeNo})<br>
        <span style="color:var(--gold2);font-weight:700;">Taskbar Slot #${p.taskbarSlot} · ${shortcut}</span> · <span style="color:#6ee7b7;">✓ Name copied!</span>
      </div>
    `, 5000);
  }

  // --- Rendering ---

  function render() {
    renderTopStats();
    renderTaskbarStrip();
    renderFilterButtons();
    renderUrgentPendingSection();
    renderProfilesList();
  }

  function renderTopStats() {
    const t = now();
    const profilesWithPending = S.profiles.filter(p => getPendingTasks(p).length > 0);
    const waitingProfiles = S.profiles.filter(p => effStatus(p, t) === 'waiting');
    const readyProfiles = S.profiles.filter(p => effStatus(p, t) === 'ready');

    const totalPendingTasks = S.profiles.reduce((sum, p) => sum + getPendingTasks(p).length, 0);

    const statsEl = $('#topStats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="stat-pill pending">
        <span>🔴</span>
        <span><b>${profilesWithPending.length}</b> Chromes with Pending Tasks (${totalPendingTasks} total)</span>
      </div>
      <div class="stat-pill cooldown">
        <span>⏳</span>
        <span><b>${waitingProfiles.length}</b> on Cooldown</span>
      </div>
      <div class="stat-pill ready">
        <span>🟢</span>
        <span><b>${readyProfiles.length}</b> Ready</span>
      </div>
    `;
  }

  function renderTaskbarStrip() {
    const t = now();
    const stripEl = $('#taskbarStrip');
    if (!stripEl) return;

    // Build the 1:1 replica of Windows Taskbar:
    // Slot 1: File Explorer (Win + 1)
    // Slot 2: Microsoft Edge (Win + 2)
    // Slot 3..23: The 21 Chrome Profiles
    // Slot 24: ChatGPT
    // Slot 25: Antigravity

    const systemItemsPrefix = `
      <div class="tb-item system-item" title="Windows Taskbar Slot #1: File Explorer (Win + 1)" style="opacity:0.75;">
        <span class="tb-num-tag">#1</span>
        <span class="tb-icon">📁</span>
      </div>
      <div class="tb-item system-item" title="Windows Taskbar Slot #2: Microsoft Edge (Win + 2)" style="opacity:0.75;">
        <span class="tb-num-tag">#2</span>
        <span class="tb-icon">🌊</span>
      </div>
    `;

    const chromesHtml = S.profiles.map(p => {
      const st = effStatus(p, t);
      const pending = getPendingTasks(p);
      const pCount = pending.length;
      const isCooldown = (st === 'waiting');
      const isReady = (st === 'ready' && pCount === 0);

      let classes = 'tb-item';
      if (pCount > 0) classes += ' has-pending';
      else if (isCooldown) classes += ' is-cooldown';
      else if (isReady) classes += ' is-ready';

      const tag = p.taskbarSlot <= 9 ? `W+${p.taskbarSlot}` : `#${p.taskbarSlot}`;

      return `
        <div class="${classes}" data-scroll-to="card-${p.id}" title="Taskbar Slot #${p.taskbarSlot} (${p.winShortcut}): Chrome #${p.chromeNo} ${esc(p.name)} (${pCount} pending tasks)">
          <span class="tb-num-tag">${tag}</span>
          <span class="tb-icon">${esc(p.emoji || '🌐')}</span>
          ${pCount > 0 ? `<span class="tb-badge-count">${pCount}</span>` : ''}
        </div>
      `;
    }).join('');

    const systemItemsSuffix = `
      <div class="tb-item system-item" title="Windows Taskbar Slot #24: ChatGPT" style="opacity:0.75;">
        <span class="tb-num-tag">#24</span>
        <span class="tb-icon">🤖</span>
      </div>
      <div class="tb-item system-item" title="Windows Taskbar Slot #25: Antigravity" style="opacity:0.75;">
        <span class="tb-num-tag">#25</span>
        <span class="tb-icon">🚀</span>
      </div>
    `;

    stripEl.innerHTML = systemItemsPrefix + chromesHtml + systemItemsSuffix;
  }

  function renderFilterButtons() {
    const t = now();
    const withPendingCount = S.profiles.filter(p => getPendingTasks(p).length > 0).length;
    const cooldownCount = S.profiles.filter(p => effStatus(p, t) === 'waiting').length;
    const readyCount = S.profiles.filter(p => effStatus(p, t) === 'ready').length;

    const btnsEl = $('#filterBtns');
    if (!btnsEl) return;

    btnsEl.innerHTML = `
      <button class="filter-btn ${currentFilter === 'pending' ? 'active pending' : ''}" data-filter="pending">
        🔴 Pending Tasks Only (${withPendingCount})
      </button>
      <button class="filter-btn ${currentFilter === 'cooldown' ? 'active' : ''}" data-filter="cooldown">
        ⏳ In Cooldown (${cooldownCount})
      </button>
      <button class="filter-btn ${currentFilter === 'ready' ? 'active' : ''}" data-filter="ready">
        🟢 Ready for Work (${readyCount})
      </button>
      <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
        Show All 21 Chromes
      </button>
    `;
  }

  function renderUrgentPendingSection() {
    const section = $('#urgentPendingSection');
    if (!section) return;

    const items = [];
    S.profiles.forEach(p => {
      const pending = getPendingTasks(p);
      pending.forEach(todo => {
        items.push({ p, todo });
      });
    });

    if (!items.length) {
      section.innerHTML = '';
      return;
    }

    section.innerHTML = `
      <div class="urgent-section">
        <div class="urgent-header">
          <span>🚨 PENDING TASKS WAITING RIGHT NOW (${items.length} total across your Chromes):</span>
          <small style="color:var(--tx2);font-weight:normal;">Check off when done, or click "Switch" to see shortcut</small>
        </div>
        <div class="urgent-list">
          ${items.map(it => `
            <div class="urgent-item">
              <div class="urgent-item-left">
                <span class="urgent-profile-tag">
                  <span style="background:#090e1a;border:1px solid var(--gold);padding:0 5px;border-radius:4px;color:var(--gold2);">Slot #${it.p.taskbarSlot} · ${it.p.winShortcut}</span>
                  <b>Chrome #${it.p.chromeNo}: ${esc(it.p.name)}</b>
                </span>
                <span class="urgent-task-text">${esc(it.todo.text)}</span>
              </div>
              <div class="urgent-item-right">
                <button class="btn sm success" data-act="toggleTodo" data-pid="${it.p.id}" data-tid="${it.todo.id}">✓ Done</button>
                <button class="btn sm primary" data-act="switchNote" data-pid="${it.p.id}">👉 Switch</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderProfilesList() {
    const listEl = $('#profilesList');
    if (!listEl) return;

    const t = now();
    const q = searchQuery.toLowerCase().trim();

    let filtered = S.profiles.filter(p => {
      const st = effStatus(p, t);
      const pending = getPendingTasks(p);

      if (currentFilter === 'pending' && pending.length === 0) return false;
      if (currentFilter === 'cooldown' && st !== 'waiting') return false;
      if (currentFilter === 'ready' && st !== 'ready') return false;

      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesEmail = (p.email || '').toLowerCase().includes(q);
        const matchesPurpose = (p.purpose || '').toLowerCase().includes(q);
        const matchesSlot = String(p.taskbarSlot).includes(q);
        const matchesChromeNo = String(p.chromeNo).includes(q);
        const matchesTask = (p.todos || []).some(td => td.text.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesPurpose && !matchesSlot && !matchesChromeNo && !matchesTask) return false;
      }

      return true;
    });

    if (!filtered.length) {
      listEl.innerHTML = `
        <div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:32px;text-align:center;">
          <h3 style="color:var(--tx2);">No Chrome profiles match your filter.</h3>
          <p class="mu" style="margin-top:6px;">Select "Show All 21 Chromes" or clear search.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(p => {
      const st = effStatus(p, t);
      const todos = p.todos || [];
      const pending = getPendingTasks(p);

      let cardClass = 'profile-card';
      if (pending.length > 0) cardClass += ' has-pending';
      else if (st === 'waiting') cardClass += ' is-cooldown';
      else if (st === 'ready') cardClass += ' is-ready';

      let statusBadgeHtml = '';
      if (pending.length > 0) {
        statusBadgeHtml = `<span class="status-badge pending">🔴 ${pending.length} PENDING TASK${pending.length > 1 ? 'S' : ''}</span>`;
      }
      if (st === 'waiting') {
        statusBadgeHtml += `<span class="status-badge cooldown" data-cd="${p.readyAt}">⏳ ${fmtDur(p.readyAt - t)}</span>`;
      } else if (st === 'ready' && pending.length === 0) {
        statusBadgeHtml += `<span class="status-badge ready">🟢 READY</span>`;
      } else if (st === 'running') {
        statusBadgeHtml += `<span class="status-badge working">🔵 WORKING</span>`;
      }

      return `
        <div class="${cardClass}" id="card-${p.id}">
          <!-- Card Header with EXACT Taskbar Slot & Real Win Key -->
          <div class="card-header">
            <div class="card-header-left">
              <div class="taskbar-num-badge" title="Windows Taskbar Slot #${p.taskbarSlot} (Position on your screen)">
                <div style="font-size:10px;color:var(--tx2);line-height:1;">SLOT</div>
                <div>#${p.taskbarSlot}</div>
              </div>
              <div class="profile-avatar" style="border-color:${p.color};">${esc(p.emoji || '🌐')}</div>
              <div class="profile-info">
                <div class="profile-name-row">
                  <span class="profile-name">Chrome #${p.chromeNo}: <b>${esc(p.name)}</b></span>
                  <button class="btn sm" data-act="copyName" data-name="${esc(p.name)}" title="Copy profile name">📋 Copy</button>
                </div>
                <span class="profile-sub">${esc(p.email || p.profileDir)} · <i>${esc(p.purpose || 'Active Profile')}</i></span>
              </div>
            </div>

            <div class="card-header-right">
              ${statusBadgeHtml}
              <div class="taskbar-switch-note">
                <span>Taskbar Shortcut:</span>
                <kbd>${p.winShortcut}</kbd>
                <button class="btn sm primary" data-act="switchNote" data-pid="${p.id}">👉 Note</button>
              </div>
            </div>
          </div>

          <!-- Card Body: Pending Tasks Directly Visible -->
          <div class="card-body">
            <div class="tasks-box ${pending.length > 0 ? 'highlight' : ''}">
              <div class="tasks-title-row">
                <span class="tasks-title">
                  📌 Pending Tasks for Chrome #${p.chromeNo} · Slot #${p.taskbarSlot} (${pending.length} waiting):
                </span>
                <small style="color:var(--tx2);">Check off when finished</small>
              </div>

              <!-- List of tasks -->
              <div class="task-list">
                ${todos.length ? todos.map(td => `
                  <div class="task-item ${td.done ? 'done' : ''}">
                    <button class="task-checkbox-btn ${td.done ? 'checked' : ''}" data-act="toggleTodo" data-pid="${p.id}" data-tid="${td.id}" title="${td.done ? 'Mark pending' : 'Mark done'}">
                      ${td.done ? '✓' : ''}
                    </button>
                    <span class="task-text">${esc(td.text)}</span>
                    <button class="task-del-btn" data-act="delTodo" data-pid="${p.id}" data-tid="${td.id}" title="Delete task">✕</button>
                  </div>
                `).join('') : '<div style="font-size:13px;color:var(--tx-muted);padding:4px 0;">No pending tasks on this Chrome profile yet.</div>'}
              </div>

              <!-- Add Task Input Form directly on the card -->
              <div class="task-add-row">
                <input class="task-add-input" id="todoIn-${p.id}" placeholder="Type a task waiting on Chrome #${p.chromeNo} and press Enter..." data-pid="${p.id}">
                <button class="btn primary" data-act="addTodo" data-pid="${p.id}">+ Add Task</button>
              </div>
            </div>
          </div>

          <!-- Card Actions: 1-Click Cooldown & Status Buttons -->
          <div class="card-actions">
            <!-- Cooldown Presets -->
            <div class="action-group">
              <span class="action-label">⏱️ Hit Cooldown:</span>
              <button class="btn sm warn" data-act="quickLimit" data-pid="${p.id}" data-h="0.5">30m</button>
              <button class="btn sm warn" data-act="quickLimit" data-pid="${p.id}" data-h="1">1h</button>
              <button class="btn sm warn" data-act="quickLimit" data-pid="${p.id}" data-h="2">2h</button>
              <button class="btn sm warn" data-act="quickLimit" data-pid="${p.id}" data-h="3">3h</button>
              <button class="btn sm warn" data-act="quickLimit" data-pid="${p.id}" data-h="5">5h</button>
            </div>

            <!-- Ready / Unmark Ready Controls -->
            <div class="action-group">
              <span class="action-label">Status:</span>
              <button class="btn sm success" data-act="markReady" data-pid="${p.id}">🟢 Mark Ready</button>
              <button class="btn sm danger" data-act="unmarkReady" data-pid="${p.id}">✕ Unmark Ready</button>
              <button class="btn sm" data-act="markWorking" data-pid="${p.id}">🔵 Working</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Enter key listener to all inline task inputs
    filtered.forEach(p => {
      const inp = document.getElementById(`todoIn-${p.id}`);
      if (inp) {
        inp.onkeydown = ev => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            const text = inp.value.trim();
            if (text) {
              p.todos = p.todos || [];
              p.todos.push({ id: uid(), text, done: false, createdAt: now() });
              save();
              render();
              toast(`📝 Task added to Chrome #${p.chromeNo} (${esc(p.name)})`);
            }
          }
        };
      }
    });
  }

  function updateCountdowns() {
    const t = now();
    document.querySelectorAll('[data-cd]').forEach(el => {
      const target = Number(el.dataset.cd);
      el.textContent = `⏳ ${fmtDur(target - t)}`;
    });

    // Check if cooldown completed
    let changed = false;
    S.profiles.forEach(p => {
      if (p.status === 'waiting' && p.readyAt && p.readyAt <= t && p.notifiedFor !== p.readyAt) {
        p.notifiedFor = p.readyAt;
        p.status = 'ready';
        changed = true;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        toast(`🔔 <b>Chrome #${p.chromeNo} · ${esc(p.name)}</b> cooldown finished! Profile is READY.`);
      }
    });

    if (changed) {
      save();
      render();
    }
  }

  // --- Global Click Event Delegator ---
  document.addEventListener('click', ev => {
    // Scroll from Taskbar Strip
    const stripItem = ev.target.closest('[data-scroll-to]');
    if (stripItem) {
      const targetId = stripItem.dataset.scrollTo;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.8)';
        setTimeout(() => { targetEl.style.boxShadow = ''; }, 1200);
      }
      return;
    }

    // Filter Buttons
    const filterBtn = ev.target.closest('[data-filter]');
    if (filterBtn) {
      currentFilter = filterBtn.dataset.filter;
      render();
      return;
    }

    // Action Buttons
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;

    const act = btn.dataset.act;
    const pid = btn.dataset.pid;
    const tid = btn.dataset.tid;
    const p = S.profiles.find(x => x.id === pid);

    if (act === 'switchNote') {
      if (p) showSwitchNote(p);
    } else if (act === 'copyName') {
      const name = btn.dataset.name;
      try {
        navigator.clipboard.writeText(name);
        toast(`📋 Copied "${name}" to clipboard`);
      } catch (_) {}
    } else if (act === 'addTodo') {
      const inp = document.getElementById(`todoIn-${pid}`);
      if (p && inp && inp.value.trim()) {
        p.todos = p.todos || [];
        p.todos.push({ id: uid(), text: inp.value.trim(), done: false, createdAt: now() });
        inp.value = '';
        save();
        render();
        toast(`📝 Task added to Chrome #${p.chromeNo} (${esc(p.name)})`);
      }
    } else if (act === 'toggleTodo') {
      if (p && p.todos) {
        const td = p.todos.find(y => y.id === tid);
        if (td) {
          td.done = !td.done;
          save();
          render();
          toast(td.done ? `✓ Task completed on Chrome #${p.chromeNo}` : `↩ Task reopened on Chrome #${p.chromeNo}`);
        }
      }
    } else if (act === 'delTodo') {
      if (p && p.todos) {
        p.todos = p.todos.filter(y => y.id !== tid);
        save();
        render();
        toast(`🗑️ Task removed from Chrome #${p.chromeNo}`);
      }
    } else if (act === 'quickLimit') {
      const hrs = Number(btn.dataset.h) || 3;
      if (p) {
        p.status = 'waiting';
        p.readyAt = now() + hrs * 3600000;
        p.notifiedFor = null;
        save();
        render();
        toast(`⏱️ Chrome #${p.chromeNo} (${esc(p.name)}): Cooldown set for ${hrs}h (Ready at ${fmtAt(p.readyAt)})`);
      }
    } else if (act === 'markReady') {
      if (p) {
        p.status = 'ready';
        p.readyAt = null;
        p.notifiedFor = null;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        save();
        render();
        toast(`🟢 Chrome #${p.chromeNo} (${esc(p.name)}) marked READY!`);
      }
    } else if (act === 'unmarkReady') {
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        toast(`✕ Chrome #${p.chromeNo} (${esc(p.name)}) unmarked ready (Set to BUSY/WORKING).`);
      }
    } else if (act === 'markWorking') {
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        toast(`🔵 Chrome #${p.chromeNo} (${esc(p.name)}) set to WORKING.`);
      }
    }
  });

  // Search input live filtering
  const sInp = $('#searchInput');
  if (sInp) {
    sInp.addEventListener('input', ev => {
      searchQuery = ev.target.value;
      renderProfilesList();
    });
  }

  // Initial render & interval
  render();
  setInterval(updateCountdowns, 1000);
})();
