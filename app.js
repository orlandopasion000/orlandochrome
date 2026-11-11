/* Chrome Taskbar Tracker - Dedicated Pending Tasks & Cooldown Manager */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_tracker_v4';
  const OLD_STORAGE_KEY = 'chrome_taskbar_cc_state_v3';

  // 25 Pre-configured Chrome profiles matching your exact Windows taskbar shortcuts (#1 to #25)
  const DEFAULT_PROFILES = [
    { id: "p1", profileDir: "Profile 1", name: "Orlando (A2 000)", email: "orlandopasion000@gmail.com", taskbarNo: 1, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, purpose: "General AI / Personal", todos: [] },
    { id: "p16", profileDir: "Profile 16", name: "Orlando (A1 001 DepEd)", email: "orlando.pasion001@deped.gov.ph", taskbarNo: 2, color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, purpose: "DepEd School Admin / Teaching", todos: [
      { id: "td_init_1", text: "Draft Grade 8 ST2 Test & Table of Specifications", done: false, createdAt: now() }
    ]},
    { id: "p17", profileDir: "Profile 17", name: "Blanca Eunice (DepEd)", email: "blancaeunice.pasion@deped.gov.ph", taskbarNo: 3, color: "#E8A33D", emoji: "🛠️", status: "ready", readyAt: null, purpose: "DepEd Coordination", todos: [] },
    { id: "p19", profileDir: "Profile 19", name: "Blanca Eunice", email: "btaborda07@gmail.com", taskbarNo: 4, color: "#E86A8A", emoji: "🧮", status: "ready", readyAt: null, purpose: "Personal / Review", todos: [] },
    { id: "p2", profileDir: "Profile 2", name: "Orlando (A3 0817)", email: "orlandopasion0817@gmail.com", taskbarNo: 5, color: "#A78BFA", emoji: "📊", status: "ready", readyAt: null, purpose: "Research / Tools", todos: [] },
    { id: "p20", profileDir: "Profile 20", name: "Nash (Nash Reviewer)", email: "revnash0@gmail.com", taskbarNo: 6, color: "#2DD4BF", emoji: "📝", status: "ready", readyAt: null, purpose: "Ministry & Devotion Review", todos: [
      { id: "td_init_2", text: "Prepare Youth Devotion Slide Deck for Sunday", done: false, createdAt: now() }
    ]},
    { id: "p22", profileDir: "Profile 22", name: "A", email: "yifyyts7@gmail.com", taskbarNo: 7, color: "#F97316", emoji: "🎯", status: "ready", readyAt: null, purpose: "Media / Tools", todos: [] },
    { id: "p24", profileDir: "Profile 24", name: "Your Chrome (Hero)", email: "heroesmeraldaepicalu@gmail.com", taskbarNo: 8, color: "#84CC16", emoji: "🧠", status: "ready", readyAt: null, purpose: "AI Exploration", todos: [] },
    { id: "p33", profileDir: "Profile 33", name: "Nancalobasaan NHS", email: "300406@deped.gov.ph", taskbarNo: 9, color: "#F472B6", emoji: "📚", status: "ready", readyAt: null, purpose: "School Portal & Records", todos: [] },
    { id: "p39", profileDir: "Profile 39", name: "Orlando (A6 002 Gmail)", email: "orlandopasion002@gmail.com", taskbarNo: 10, color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, purpose: "Academic Writing", todos: [] },
    { id: "p4", profileDir: "Profile 4", name: "Blanca Eunice", email: "bepasion07@gmail.com", taskbarNo: 11, color: "#FACC15", emoji: "💡", status: "ready", readyAt: null, purpose: "Family & Docs", todos: [] },
    { id: "p40", profileDir: "Profile 40", name: "Orlando (A5 003 Gmail)", email: "orlandopasion003@gmail.com", taskbarNo: 12, color: "#94A3B8", emoji: "⚡", status: "ready", readyAt: null, purpose: "Dissertation Ch. 3", todos: [
      { id: "td_init_3", text: "Revise Chapter 3 Instrumentation & Sampling Framework", done: false, createdAt: now() }
    ]},
    { id: "p41", profileDir: "Profile 41", name: "Orlando (A5 004 Gmail)", email: "orlandopasion004@gmail.com", taskbarNo: 13, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, purpose: "Lesson Plans / Tests", todos: [] },
    { id: "p44", profileDir: "Profile 44", name: "SCITE 3", email: "scite.orlandopasion003@gmail.com", taskbarNo: 14, color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, purpose: "Academic Citations", todos: [] },
    { id: "p45", profileDir: "Profile 45", name: "Your Chrome (scite001)", email: "scite.orlandopasion001@gmail.com", taskbarNo: 15, color: "#E8A33D", emoji: "🛠️", status: "ready", readyAt: null, purpose: "Literature Search", todos: [] },
    { id: "p46", profileDir: "Profile 46", name: "Orlando (A6 scite002)", email: "scite.orlandopasion002@gmail.com", taskbarNo: 16, color: "#E86A8A", emoji: "🧮", status: "ready", readyAt: null, purpose: "Research Synthesis", todos: [] },
    { id: "p48", profileDir: "Profile 48", name: "Gwapo", email: "gwapocpogi@gmail.com", taskbarNo: 17, color: "#A78BFA", emoji: "📊", status: "ready", readyAt: null, purpose: "Grade Analysis", todos: [] },
    { id: "p49", profileDir: "Profile 49", name: "Gold Cloud", email: "goldcloudblack@gmail.com", taskbarNo: 18, color: "#2DD4BF", emoji: "📝", status: "ready", readyAt: null, purpose: "Notes & Summaries", todos: [] },
    { id: "p52", profileDir: "Profile 52", name: "Orlando (005 Gmail)", email: "orlandopasion005@gmail.com", taskbarNo: 19, color: "#F97316", emoji: "🎯", status: "ready", readyAt: null, purpose: "Test Creation ST2", todos: [] },
    { id: "p53", profileDir: "Profile 53", name: "Orlando (006 Gmail)", email: "orlandopasion006@gmail.com", taskbarNo: 20, color: "#84CC16", emoji: "🧠", status: "ready", readyAt: null, purpose: "Curriculum Work", todos: [] },
    { id: "p56", profileDir: "Profile 56", name: "Orlando (pogiorlando)", email: "pogiorlandopasion@gmail.com", taskbarNo: 21, color: "#F472B6", emoji: "📚", status: "ready", readyAt: null, purpose: "Ministry Presentations", todos: [] },
    { id: "p57", profileDir: "Profile 57", name: "Watch", email: "watchonlineapple@gmail.com", taskbarNo: 22, color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, purpose: "Online Media / Video", todos: [] },
    { id: "p58", profileDir: "Profile 58", name: "Orlando (grammarly)", email: "grammarlyquillbot001@gmail.com", taskbarNo: 23, color: "#FACC15", emoji: "💡", status: "ready", readyAt: null, purpose: "Grammar & Proofreading", todos: [] },
    { id: "p59", profileDir: "Profile 59", name: "Orlando (netflix)", email: "netflixpasion1994@gmail.com", taskbarNo: 24, color: "#94A3B8", emoji: "⚡", status: "ready", readyAt: null, purpose: "Personal Media", todos: [] },
    { id: "p9", profileDir: "Profile 9", name: "Orlando (A5 001 Gmail)", email: "orlandopasion001@gmail.com", taskbarNo: 25, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, purpose: "Primary Account", todos: [] }
  ];

  function loadState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    // Migration from old storage if new storage is empty
    if (!saved) {
      try {
        const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
        if (oldRaw) {
          const old = JSON.parse(oldRaw);
          if (old && old.profiles && old.profiles.length) {
            saved = { profiles: old.profiles };
          }
        }
      } catch (_) {}
    }

    if (!saved || !saved.profiles || !saved.profiles.length) {
      saved = { profiles: DEFAULT_PROFILES };
    } else {
      // Ensure all 25 profiles exist
      DEFAULT_PROFILES.forEach(dp => {
        const found = saved.profiles.find(p => p.profileDir === dp.profileDir || p.id === dp.id);
        if (!found) saved.profiles.push(dp);
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
    const tNo = p.taskbarNo ? `#${p.taskbarNo}` : '';
    const shortcut = p.taskbarNo && p.taskbarNo <= 9 ? `Press Win + ${p.taskbarNo}` : `Click icon ${tNo} on your taskbar`;
    
    try { navigator.clipboard.writeText(p.name); } catch (_) {}

    toast(`
      <span style="font-size:22px;">👉</span>
      <div>
        <b>Switch to: ${esc(p.name)}</b> <span style="background:var(--card);border:1px solid var(--gold);padding:1px 5px;border-radius:4px;color:var(--gold2);">${tNo}</span><br>
        <span style="color:var(--gold2);font-weight:700;">${shortcut}</span> · <span style="color:#6ee7b7;">✓ Name copied to clipboard!</span>
      </div>
    `, 4500);
  }

  // --- Rendering Functions ---

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

    stripEl.innerHTML = S.profiles.map(p => {
      const st = effStatus(p, t);
      const pending = getPendingTasks(p);
      const pCount = pending.length;
      const isCooldown = (st === 'waiting');
      const isReady = (st === 'ready' && pCount === 0);

      let classes = 'tb-item';
      if (pCount > 0) classes += ' has-pending';
      else if (isCooldown) classes += ' is-cooldown';
      else if (isReady) classes += ' is-ready';

      return `
        <div class="${classes}" data-scroll-to="card-${p.id}" title="Taskbar #${p.taskbarNo}: ${esc(p.name)} (${pCount} pending tasks)">
          <span class="tb-num-tag">#${p.taskbarNo || '?'}</span>
          <span class="tb-icon">${esc(p.emoji || '📘')}</span>
          ${pCount > 0 ? `<span class="tb-badge-count">${pCount}</span>` : ''}
        </div>
      `;
    }).join('');
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
        Show All 25 Chromes
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
          <span>🚨 CURRENT PENDING TASKS (${items.length} waiting across your Chromes):</span>
          <small style="color:var(--tx2);font-weight:normal;">Click any task to mark done, or click "Switch" to open that profile</small>
        </div>
        <div class="urgent-list">
          ${items.map(it => `
            <div class="urgent-item">
              <div class="urgent-item-left">
                <span class="urgent-profile-tag">
                  <span style="background:#090e1a;border:1px solid var(--gold);padding:0 5px;border-radius:4px;color:var(--gold2);">#${it.p.taskbarNo || '?'}</span>
                  ${esc(it.p.name)}
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

      // Status filters
      if (currentFilter === 'pending' && pending.length === 0) return false;
      if (currentFilter === 'cooldown' && st !== 'waiting') return false;
      if (currentFilter === 'ready' && st !== 'ready') return false;

      // Search query
      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesEmail = (p.email || '').toLowerCase().includes(q);
        const matchesPurpose = (p.purpose || '').toLowerCase().includes(q);
        const matchesNum = String(p.taskbarNo || '').includes(q);
        const matchesTask = (p.todos || []).some(td => td.text.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesPurpose && !matchesNum && !matchesTask) return false;
      }

      return true;
    });

    if (!filtered.length) {
      listEl.innerHTML = `
        <div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:32px;text-align:center;">
          <h3 style="color:var(--tx2);">No Chrome profiles match your filter.</h3>
          <p class="mu" style="margin-top:6px;">Try selecting "Show All 25 Chromes" or clearing your search.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(p => {
      const st = effStatus(p, t);
      const todos = p.todos || [];
      const pending = getPendingTasks(p);
      const tNo = p.taskbarNo || '?';
      const winShortcut = (p.taskbarNo && p.taskbarNo <= 9) ? `Win + ${p.taskbarNo}` : `Icon #${tNo}`;

      let cardClass = 'profile-card';
      if (pending.length > 0) cardClass += ' has-pending';
      else if (st === 'waiting') cardClass += ' is-cooldown';
      else if (st === 'ready') cardClass += ' is-ready';

      // Status badge HTML
      let statusBadgeHtml = '';
      if (pending.length > 0) {
        statusBadgeHtml = `<span class="status-badge pending">🔴 ${pending.length} PENDING TASK${pending.length > 1 ? 'S' : ''}</span>`;
      }
      if (st === 'waiting') {
        statusBadgeHtml += `<span class="status-badge cooldown" data-cd="${p.readyAt}">⏳ ${fmtDur(p.readyAt - t)}</span>`;
      } else if (st === 'ready' && pending.length === 0) {
        statusBadgeHtml += `<span class="status-badge ready">🟢 READY</span>`;
      } else if (st === 'running') {
        statusBadgeHtml += `<span class="status-badge working">🔵 WORKING / BUSY</span>`;
      }

      return `
        <div class="${cardClass}" id="card-${p.id}">
          <!-- Card Header -->
          <div class="card-header">
            <div class="card-header-left">
              <div class="taskbar-num-badge">#${tNo}</div>
              <div class="profile-avatar" style="border-color:${p.color};">${esc(p.emoji || '📘')}</div>
              <div class="profile-info">
                <div class="profile-name-row">
                  <span class="profile-name">${esc(p.name)}</span>
                  <button class="btn sm" data-act="copyName" data-name="${esc(p.name)}" title="Copy profile name">📋 Copy</button>
                </div>
                <span class="profile-sub">${esc(p.email || p.profileDir)} · <i>${esc(p.purpose || 'General AI')}</i></span>
              </div>
            </div>

            <div class="card-header-right">
              ${statusBadgeHtml}
              <div class="taskbar-switch-note">
                <span>Taskbar:</span>
                <kbd>${winShortcut}</kbd>
                <button class="btn sm primary" data-act="switchNote" data-pid="${p.id}">👉 Note</button>
              </div>
            </div>
          </div>

          <!-- Card Body: PENDING TASKS DIRECTLY VISIBLE -->
          <div class="card-body">
            <div class="tasks-box ${pending.length > 0 ? 'highlight' : ''}">
              <div class="tasks-title-row">
                <span class="tasks-title">
                  📌 Pending Tasks for Chrome #${tNo} (${pending.length} waiting):
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
                <input class="task-add-input" id="todoIn-${p.id}" placeholder="Type a task waiting on Chrome #${tNo} and press Enter..." data-pid="${p.id}">
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
              toast(`📝 Task added to Taskbar #${p.taskbarNo} (${esc(p.name)})`);
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
        toast(`🔔 <b>Taskbar #${p.taskbarNo} · ${esc(p.name)}</b> cooldown finished! Profile is READY.`);
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
        toast(`📝 Task added to Taskbar #${p.taskbarNo} (${esc(p.name)})`);
      }
    } else if (act === 'toggleTodo') {
      if (p && p.todos) {
        const td = p.todos.find(y => y.id === tid);
        if (td) {
          td.done = !td.done;
          save();
          render();
          toast(td.done ? `✓ Task completed on Taskbar #${p.taskbarNo}` : `↩ Task reopened on Taskbar #${p.taskbarNo}`);
        }
      }
    } else if (act === 'delTodo') {
      if (p && p.todos) {
        p.todos = p.todos.filter(y => y.id !== tid);
        save();
        render();
        toast(`🗑️ Task removed from Taskbar #${p.taskbarNo}`);
      }
    } else if (act === 'quickLimit') {
      const hrs = Number(btn.dataset.h) || 3;
      if (p) {
        p.status = 'waiting';
        p.readyAt = now() + hrs * 3600000;
        p.notifiedFor = null;
        save();
        render();
        toast(`⏱️ Taskbar #${p.taskbarNo} (${esc(p.name)}): Cooldown set for ${hrs}h (Ready at ${fmtAt(p.readyAt)})`);
      }
    } else if (act === 'markReady') {
      if (p) {
        p.status = 'ready';
        p.readyAt = null;
        p.notifiedFor = null;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        save();
        render();
        toast(`🟢 Taskbar #${p.taskbarNo} (${esc(p.name)}) marked READY!`);
      }
    } else if (act === 'unmarkReady') {
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        toast(`✕ Taskbar #${p.taskbarNo} (${esc(p.name)}) unmarked ready (Set to BUSY/WORKING).`);
      }
    } else if (act === 'markWorking') {
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        toast(`🔵 Taskbar #${p.taskbarNo} (${esc(p.name)}) set to WORKING.`);
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
