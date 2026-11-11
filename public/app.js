/* Chrome Taskbar Command Center & Live Waitboard Engine
 * Standalone Client with Instant LocalStorage Persistence & User-Friendly Taskbar Switch Notes
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_cc_state_v3';

  // 25 Pre-configured Chrome profiles matching your exact Windows taskbar shortcuts (#1 to #25)
  const DEFAULT_PROFILES = [
    { id: "p1", profileDir: "Profile 1", name: "Orlando (A2 000)", email: "orlandopasion000@gmail.com", taskbarNo: 1, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, purpose: "General AI / Personal", todos: [] },
    { id: "p16", profileDir: "Profile 16", name: "Orlando (A1 001 DepEd)", email: "orlando.pasion001@deped.gov.ph", taskbarNo: 2, color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, purpose: "DepEd School Admin / Teaching", todos: [] },
    { id: "p17", profileDir: "Profile 17", name: "Blanca Eunice (DepEd)", email: "blancaeunice.pasion@deped.gov.ph", taskbarNo: 3, color: "#E8A33D", emoji: "🛠️", status: "ready", readyAt: null, purpose: "DepEd Coordination", todos: [] },
    { id: "p19", profileDir: "Profile 19", name: "Blanca Eunice", email: "btaborda07@gmail.com", taskbarNo: 4, color: "#E86A8A", emoji: "🧮", status: "ready", readyAt: null, purpose: "Personal / Review", todos: [] },
    { id: "p2", profileDir: "Profile 2", name: "Orlando (A3 0817)", email: "orlandopasion0817@gmail.com", taskbarNo: 5, color: "#A78BFA", emoji: "📊", status: "ready", readyAt: null, purpose: "Research / Tools", todos: [] },
    { id: "p20", profileDir: "Profile 20", name: "Nash (Nash Reviewer)", email: "revnash0@gmail.com", taskbarNo: 6, color: "#2DD4BF", emoji: "📝", status: "ready", readyAt: null, purpose: "Ministry & Devotion Review", todos: [] },
    { id: "p22", profileDir: "Profile 22", name: "A", email: "yifyyts7@gmail.com", taskbarNo: 7, color: "#F97316", emoji: "🎯", status: "ready", readyAt: null, purpose: "Media / Tools", todos: [] },
    { id: "p24", profileDir: "Profile 24", name: "Your Chrome (Hero)", email: "heroesmeraldaepicalu@gmail.com", taskbarNo: 8, color: "#84CC16", emoji: "🧠", status: "ready", readyAt: null, purpose: "AI Exploration", todos: [] },
    { id: "p33", profileDir: "Profile 33", name: "Nancalobasaan NHS", email: "300406@deped.gov.ph", taskbarNo: 9, color: "#F472B6", emoji: "📚", status: "ready", readyAt: null, purpose: "School Portal & Records", todos: [] },
    { id: "p39", profileDir: "Profile 39", name: "Orlando (A6 002 Gmail)", email: "orlandopasion002@gmail.com", taskbarNo: 10, color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, purpose: "Academic Writing", todos: [] },
    { id: "p4", profileDir: "Profile 4", name: "Blanca Eunice", email: "bepasion07@gmail.com", taskbarNo: 11, color: "#FACC15", emoji: "💡", status: "ready", readyAt: null, purpose: "Family & Docs", todos: [] },
    { id: "p40", profileDir: "Profile 40", name: "Orlando (A5 003 Gmail)", email: "orlandopasion003@gmail.com", taskbarNo: 12, color: "#94A3B8", emoji: "⚡", status: "ready", readyAt: null, purpose: "Dissertation Ch. 3", todos: [] },
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

  function loadInitialState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }

    if (!saved || !saved.profiles || !saved.profiles.length) {
      saved = {
        settings: { defaultResetH: 3.0, dailyH: 4.0, slotMin: 60, dayStart: '08:00', dayEnd: '18:00', sound: true },
        profiles: DEFAULT_PROFILES,
        prompts: [
          { id: 'pr1', title: 'Draft Grade 8 ST2 Test and Table of Specifications', project: 'Term 2 Tests', priority: 'high', profileId: 'p16', text: 'Create a 40-item multiple-choice test for Grade 8 with 4 cognitive levels and a complete Table of Specifications.', status: 'queued', createdAt: now() },
          { id: 'pr2', title: 'Revise Chapter 3 Instrumentation and Sampling Framework', project: 'Dissertation', priority: 'high', profileId: 'p40', text: 'Revise Section 3.4 of Chapter 3 to address the committee notes regarding stratified random sampling.', status: 'queued', createdAt: now() },
          { id: 'pr3', title: 'Prepare Youth Devotion Slide Deck for Sunday', project: 'Ministry', priority: 'med', profileId: 'p20', text: 'Create an engaging 12-slide youth devotional deck on perseverance with scripture passages and discussion questions.', status: 'queued', createdAt: now() }
        ],
        handoffs: [
          { id: 'h1', title: 'Chapter 3 Methodology Revisions', profileId: 'p40', done: 'Sections 3.1 to 3.3 revised and references updated', next: 'Section 3.4 sampling framework revisions', prompt: 'Continue revising Chapter 3 starting from Section 3.4 (Sampling Framework). Here are the panel comments...', resolved: false, createdAt: now() }
        ],
        deadlines: [
          { id: 'dl1', title: 'Grade 8 ST2 Test & TOS Submission', project: 'Term 2 Tests', due: new Date(now() + 3 * 86400000).toISOString().slice(0, 10), hours: 5, profileId: 'p16', done: false },
          { id: 'dl2', title: 'Dissertation Chapter 3 Committee Draft', project: 'Dissertation', due: new Date(now() + 10 * 86400000).toISOString().slice(0, 10), hours: 14, profileId: 'p40', done: false }
        ],
        files: []
      };
    } else {
      // Ensure all 25 default profiles exist if missing
      DEFAULT_PROFILES.forEach(dp => {
        const found = saved.profiles.find(p => p.profileDir === dp.profileDir || p.id === dp.id);
        if (!found) saved.profiles.push(dp);
      });
    }

    return saved;
  }

  let S = loadInitialState();
  let activeTab = 'board';
  let filterStatus = '';
  let panelId = null;
  let modalEl = null;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // Format durations
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

  // Toast Notifications
  function toast(html, dur = 4000) {
    const wrap = $('#toast');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 't';
    t.innerHTML = html;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      setTimeout(() => t.remove(), 300);
    }, dur);
  }

  async function copyText(text, label = 'Copied') {
    try {
      await navigator.clipboard.writeText(text);
      toast(`📋 ${label}`);
    } catch (e) {
      toast(`⚠️ Could not copy: ${e.message}`);
    }
  }

  // Taskbar Switch Note Action (Simple, User-Friendly, 100% Functional)
  function showSwitchNote(p) {
    const tNo = p.taskbarNo ? `#${p.taskbarNo}` : '';
    const shortcut = p.taskbarNo && p.taskbarNo <= 9 ? `Press Win + ${p.taskbarNo}` : `Click icon ${tNo} on your taskbar`;
    
    // Copy name to clipboard
    try { navigator.clipboard.writeText(p.name); } catch (_) {}

    toast(`
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:24px;">👉</span>
        <div>
          <b style="font-size:14px;color:#fff;">Switch to: ${esc(p.name)}</b> <span class="tb">${tNo}</span><br>
          <span style="color:var(--gold2);font-weight:600;">${shortcut}</span> · <span style="color:var(--ok);">✓ Name copied to clipboard!</span>
        </div>
      </div>
    `, 5000);
  }

  // Pending tasks count
  function pendingCount(p) {
    const todos = (p.todos || []).filter(x => !x.done).length;
    const hand = S.handoffs.filter(h => !h.resolved && (h.profileId === p.id || h.profileId === p.profileDir)).length;
    const prom = S.prompts.filter(x => x.status !== 'done' && (x.profileId === p.id || x.profileId === p.profileDir)).length;
    return todos + hand + prom;
  }

  // Urgency & Scoring
  const PRI = { high: 3, med: 2, low: 1 };
  const PRL = { high: 'High', med: 'Medium', low: 'Low' };

  function deadlineBoost(project, t = now()) {
    if (!project) return 0;
    const matched = S.deadlines.filter(d => !d.done && d.project && d.project.toLowerCase() === project.toLowerCase());
    if (!matched.length) return 0;
    let maxRisk = 0;
    matched.forEach(d => {
      const dueTs = new Date(d.due).getTime();
      const hrsLeft = Math.max(1, (dueTs - t) / 3600000);
      const est = d.hours || 4;
      const ratio = est / hrsLeft;
      if (ratio > maxRisk) maxRisk = ratio;
    });
    return Math.min(maxRisk * 25, 40);
  }

  function advise(t = now()) {
    const ready = S.profiles.filter(p => effStatus(p, t) === 'ready');
    if (ready.length === 0) {
      const waiting = S.profiles.filter(p => p.status === 'waiting' && p.readyAt).sort((a, b) => a.readyAt - b.readyAt);
      if (waiting.length > 0) {
        return { type: 'wait', p: waiting[0], at: waiting[0].readyAt };
      }
      return { type: 'none' };
    }

    const openHandoffs = S.handoffs.filter(h => !h.resolved);
    const queuedPrompts = S.prompts.filter(pr => pr.status === 'queued');

    const candidates = [];
    ready.forEach(p => {
      const hand = openHandoffs.find(h => h.profileId === p.id || h.profileId === p.profileDir);
      if (hand) {
        candidates.push({ p, score: 100, kind: 'handoff', item: hand, title: `Continue Handoff: ${hand.title}`, why: `Has an unresolved handoff card: "${hand.next}"` });
        return;
      }

      const pPrompts = queuedPrompts.filter(pr => pr.profileId === p.id || pr.profileId === p.profileDir);
      pPrompts.forEach(pr => {
        const score = (PRI[pr.priority] || 1) * 20 + deadlineBoost(pr.project, t);
        candidates.push({ p, score, kind: 'prompt', item: pr, title: pr.title, text: pr.text, why: `${PRL[pr.priority]} priority prompt queued${pr.project ? ` for project "${pr.project}"` : ''}` });
      });

      const genericPrompts = queuedPrompts.filter(pr => !pr.profileId);
      genericPrompts.forEach(pr => {
        const score = (PRI[pr.priority] || 1) * 15 + deadlineBoost(pr.project, t);
        candidates.push({ p, score, kind: 'prompt', item: pr, title: pr.title, text: pr.text, why: `Unassigned ${PRL[pr.priority]} priority prompt ready to pick up` });
      });

      const todos = (p.todos || []).filter(x => !x.done);
      if (todos.length > 0) {
        candidates.push({ p, score: 30 + Math.min(todos.length * 5, 20), kind: 'todo', item: todos[0], title: todos[0].text, why: `${todos.length} pending task${todos.length > 1 ? 's' : ''} logged on this profile` });
      }
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      return { type: 'go', p: best.p, title: best.title, text: best.text || '', why: best.why };
    }

    if (ready.length > 0) {
      const pick = ready.sort((a, b) => (a.taskbarNo || 99) - (b.taskbarNo || 99))[0];
      return { type: 'idle', p: pick };
    }

    return { type: 'none' };
  }

  // --- Rendering ---
  const TABS = [
    ['board', 'Taskbar Dock'],
    ['prompts', 'Prompts'],
    ['handoffs', 'Handoff Cards'],
    ['deadlines', 'Deadlines'],
    ['plan', 'Day Plan'],
    ['files', 'Name Checker'],
    ['taskbarMap', 'Taskbar Map'],
    ['sync', 'Backup & Sound']
  ];

  function render() {
    renderHeader();
    renderTabs();
    const v = $('#view');
    if (!v) return;

    if (activeTab === 'board') v.innerHTML = renderBoard();
    else if (activeTab === 'prompts') v.innerHTML = renderPrompts();
    else if (activeTab === 'handoffs') v.innerHTML = renderHandoffs();
    else if (activeTab === 'deadlines') v.innerHTML = renderDeadlines();
    else if (activeTab === 'plan') v.innerHTML = renderPlan();
    else if (activeTab === 'files') {
      v.innerHTML = renderFiles();
      initNameChecker();
    }
    else if (activeTab === 'taskbarMap') v.innerHTML = renderTaskbarMap();
    else if (activeTab === 'sync') v.innerHTML = renderSync();

    updateCountdowns();
  }

  function renderHeader() {
    const t = now();
    const readyCount = S.profiles.filter(p => effStatus(p, t) === 'ready').length;
    const waitCount = S.profiles.filter(p => effStatus(p, t) === 'waiting').length;

    const chip = $('#wsChip');
    if (chip) {
      chip.className = 'chip ok';
      chip.innerHTML = `💾 Auto-Saved · <b>${readyCount} Ready</b> · <b>${waitCount} Waiting</b>`;
    }
    const runChip = $('#runningChip');
    if (runChip) {
      runChip.textContent = `🎯 25 Pinned Taskbar Profiles`;
    }
  }

  function renderTabs() {
    const t = $('#tabs');
    if (!t) return;
    t.innerHTML = TABS.map(([k, label]) => `
      <button class="tab ${k === activeTab ? 'on' : ''}" data-tab="${k}">${label}</button>
    `).join('');
  }

  // --- Main Board (Taskbar Dock + Advisor) ---
  function renderBoard() {
    const t = now();
    const adv = advise(t);

    // Hero Advisor Card
    let heroHtml = '';
    if (adv.type === 'go') {
      heroHtml = `
        <section class="adv ok">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:56px;height:56px;font-size:24px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">OPEN THIS NEXT</small>
              <h2>${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <div style="font-size:15px;color:#fff;margin:2px 0;">${esc(adv.title)}</div>
              <small>${esc(adv.why)}</small>
            </div>
          </div>
          <div class="advr">
            <button class="btn pri" data-act="switchNote" data-id="${adv.p.id}">📌 Switch Note (#${adv.p.taskbarNo || '?'})</button>
            ${adv.text ? `<button class="btn" data-act="copyAdvText">📋 Copy Prompt</button>` : ''}
            <button class="btn" data-act="quickLimit" data-id="${adv.p.id}" data-h="3">⏱️ Start 3h Cooldown</button>
            <button class="btn sm" data-act="openPanel" data-id="${adv.p.id}">⚙️ Manage</button>
          </div>
        </section>
      `;
    } else if (adv.type === 'idle') {
      heroHtml = `
        <section class="adv ok">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:56px;height:56px;font-size:24px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">READY FOR WORK</small>
              <h2>${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <small>This Chrome profile is ready. Click icon #${adv.p.taskbarNo || '?'} on your Windows taskbar.</small>
            </div>
          </div>
          <div class="advr">
            <button class="btn pri" data-act="switchNote" data-id="${adv.p.id}">📌 Switch Note (#${adv.p.taskbarNo || '?'})</button>
            <button class="btn" data-act="quickLimit" data-id="${adv.p.id}" data-h="3">⏱️ Start 3h Cooldown</button>
            <button class="btn sm" data-act="openPanel" data-id="${adv.p.id}">⚙️ Manage Profile</button>
          </div>
        </section>
      `;
    } else if (adv.type === 'wait') {
      heroHtml = `
        <section class="adv wt">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:56px;height:56px;font-size:24px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">ALL PROFILES ON COOLDOWN</small>
              <h2>Next ready: ${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <div class="dws wt" data-cd="${adv.at}" style="font-size:18px;margin:2px 0;">${fmtDur(adv.at - t)}</div>
              <small>Ready at ${fmtAt(adv.at)}. Use this wait to review outputs, check filenames, or add new prompts.</small>
            </div>
          </div>
          <div class="advr">
            <button class="btn pri" data-act="markReady" data-id="${adv.p.id}">✓ Free Up Early</button>
            <button class="btn sm" data-act="openPanel" data-id="${adv.p.id}">⚙️ Manage</button>
          </div>
        </section>
      `;
    }

    // Stats
    const cnt = s => S.profiles.filter(p => effStatus(p, t) === s).length;
    const withP = S.profiles.filter(p => pendingCount(p) > 0).length;
    const nextW = S.profiles.filter(p => p.status === 'waiting' && p.readyAt > t).sort((a, b) => a.readyAt - b.readyAt)[0];

    // Dock list
    let list = S.profiles.filter(p => {
      if (!filterStatus) return true;
      if (filterStatus === 'pending') return pendingCount(p) > 0;
      return effStatus(p, t) === filterStatus;
    });

    const dockItems = list.map(p => {
      const st = effStatus(p, t);
      const isNext = (adv.p && adv.p.id === p.id);
      const pCount = pendingCount(p);

      const ringColor = st === 'ready' ? 'var(--ok)' : st === 'waiting' ? 'var(--warn)' : st === 'running' ? 'var(--info)' : 'var(--p3)';
      const subHtml = st === 'waiting'
        ? `<span class="dws wt" data-cd="${p.readyAt}">${fmtDur(p.readyAt - t)}</span>`
        : `<span class="dws ${st}">${st === 'ready' ? 'Ready' : st === 'running' ? 'Working' : 'Off'}</span>`;

      return `
        <button class="dk ${isNext ? 'next' : ''} ${st === 'running' ? 'running' : ''}" data-act="openPanel" data-id="${p.id}" title="${esc(p.name)} (${p.email}) - Click to manage">
          <div class="dkav" style="border-color:${ringColor};background:${p.color}15;">
            ${esc(p.emoji || '📘')}
            ${p.taskbarNo ? `<span class="tb-num">#${p.taskbarNo}</span>` : ''}
            ${pCount > 0 ? `<span class="pbadge">${pCount}</span>` : ''}
          </div>
          <span class="dkn">${esc(p.name)}</span>
          ${subHtml}
        </button>
      `;
    }).join('');

    return `
      ${heroHtml}
      
      <!-- Stats -->
      <div class="stats">
        <div class="stat ok"><b>${cnt('ready')}</b>Ready</div>
        <div class="stat rn"><b>${cnt('running')}</b>Working</div>
        <div class="stat wt"><b>${cnt('waiting')}</b>In Cooldown</div>
        <div class="stat"><b style="color:#ef5b5b">${withP}</b>With Pending Tasks</div>
        <div class="stat"><b>${nextW ? `<span data-cd="${nextW.readyAt}">${fmtDur(nextW.readyAt - t)}</span>` : '—'}</b>Next Cooldown End</div>
      </div>

      <!-- Dock -->
      <div class="dock-wrap">
        <div class="dock-header">
          <div>
            <b>Taskbar Chrome Dock</b> 
            <small class="mu"> (Numbered #1 to #25 matching your taskbar from left to right)</small>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="chip ${!filterStatus ? 'on' : ''}" data-fstat="">All (25)</button>
            <button class="chip ${filterStatus === 'ready' ? 'on' : ''}" data-fstat="ready">Ready (${cnt('ready')})</button>
            <button class="chip ${filterStatus === 'waiting' ? 'on' : ''}" data-fstat="waiting">Waiting (${cnt('waiting')})</button>
            <button class="chip ${filterStatus === 'pending' ? 'on' : ''}" data-fstat="pending">Pending (${withP})</button>
          </div>
        </div>
        <div class="dock-grid">${dockItems}</div>
      </div>
    `;
  }

  // --- Profile Command Card (Detail Modal) ---
  function drawPanel() {
    const p = S.profiles.find(x => x.id === panelId || x.profileDir === panelId);
    let el = document.getElementById('panelModal');
    if (!p) {
      if (el) el.remove();
      panelId = null;
      return;
    }

    if (!el) {
      el = document.createElement('div');
      el.id = 'panelModal';
      el.className = 'ov';
      document.body.appendChild(el);
      el.addEventListener('mousedown', ev => { if (ev.target === el) closePanel(); });
    }

    const t = now();
    const st = effStatus(p, t);
    const todos = p.todos || [];
    const tNo = p.taskbarNo || '?';
    const winShortcut = p.taskbarNo && p.taskbarNo <= 9 ? `Win + ${p.taskbarNo}` : `Taskbar #${p.taskbarNo}`;

    el.innerHTML = `
      <div class="modal">
        <div class="mh">
          <h3>Taskbar #${tNo} · ${esc(p.name)}</h3>
          <button class="x" data-act="closePanel">✕</button>
        </div>
        <div class="mb">
          <!-- Profile Header -->
          <div style="display:flex;gap:14px;align-items:center;">
            <div class="dkav" style="border-color:${p.color};width:68px;height:68px;font-size:26px;">
              ${esc(p.emoji || '📘')}
              <span class="tb-num">#${tNo}</span>
            </div>
            <div style="flex:1;">
              <h2 style="font-size:20px;margin:0;">${esc(p.name)}</h2>
              <small class="mu">${esc(p.email || p.profileDir)}</small>
              <div style="margin-top:6px;display:flex;align-items:center;gap:8px;">
                Status: <span class="pill ${st === 'ready' ? 'ok' : st === 'waiting' ? 'warn' : 'info'}">${st.toUpperCase()}</span>
                ${st === 'waiting' ? `<span class="dws wt" data-cd="${p.readyAt}">Ready in ${fmtDur(p.readyAt - t)}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- User-Friendly Taskbar Switch Note Box -->
          <div class="note-box">
            <div class="note-box-left">
              <div class="note-title">📌 Switch to this Chrome Profile:</div>
              <div class="note-sub">Click icon <b>#${tNo}</b> on your Windows taskbar, or press <span class="note-kbd">${winShortcut}</span></div>
            </div>
            <button class="btn sm pri" data-act="copyNameOnly" data-name="${esc(p.name)}">📋 Copy Name</button>
          </div>

          <!-- Status Controls (Make ALL buttons functional!) -->
          <div>
            <label style="font-weight:700;color:var(--gold2);">Status Actions:</label>
            <div class="status-btn-group">
              <button class="status-btn ${st === 'ready' ? 'active-ready' : ''}" data-act="markReady" data-id="${p.id}" title="Mark profile ready to work">
                🟢 Mark Ready
              </button>
              <button class="status-btn ${st !== 'ready' ? 'active-waiting' : ''}" data-act="unmarkReady" data-id="${p.id}" title="Unmark ready and set as busy/in-use">
                ✕ Unmark Ready
              </button>
              <button class="status-btn ${st === 'running' ? 'active-running' : ''}" data-act="markWorking" data-id="${p.id}" title="Mark as currently active/working">
                🔵 Mark Working
              </button>
              <button class="status-btn ${st === 'off' ? 'active-waiting' : ''}" data-act="markOff" data-id="${p.id}" title="Mark inactive/off">
                ⚪ Turn Off
              </button>
            </div>
          </div>

          <!-- Quick Cooldown Presets -->
          <div style="background:#0e1833;border:1px solid var(--line);border-radius:10px;padding:12px;">
            <label style="color:var(--gold2);font-weight:700;">⏱️ Set Cooldown / Hit Rate Limit:</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="0.5">30 min</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="1">1 hour</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="2">2 hours</button>
              <button class="btn sm pri" data-act="quickLimit" data-id="${p.id}" data-h="3">3 hours (Standard)</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="5">5 hours (Claude)</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="24">24 hours</button>
            </div>
            
            <!-- Custom Cooldown Input -->
            <div style="display:flex;gap:8px;margin-top:10px;align-items:center;">
              <input type="number" id="customH" step="0.5" min="0.1" value="3.0" style="width:90px;" placeholder="Hours">
              <button class="btn sm" data-act="setCustomLimit" data-id="${p.id}">Start Custom Timer</button>
            </div>
          </div>

          <!-- Pending Tasks List -->
          <div>
            <label style="font-weight:700;color:var(--gold2);">Pending Tasks for this Profile (${todos.length}):</label>
            <div style="margin-top:6px;display:grid;gap:6px;">
              ${todos.map(td => `
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#0e1833;border-radius:8px;border:1px solid var(--line);">
                  <button class="btn sm" data-act="toggleTodo" data-id="${p.id}" data-tid="${td.id}">
                    ${td.done ? '☑ Done' : '☐'}
                  </button>
                  <span style="flex:1;${td.done ? 'text-decoration:line-through;opacity:.6;' : ''}">${esc(td.text)}</span>
                  <button class="x" data-act="delTodo" data-id="${p.id}" data-tid="${td.id}" title="Delete task">✕</button>
                </div>
              `).join('')}

              <div style="display:flex;gap:6px;margin-top:4px;">
                <input id="todoTextIn" placeholder="Type a pending task and click Add (or press Enter)" style="flex:1;">
                <button class="btn pri sm" data-act="addTodo" data-id="${p.id}">Add Task</button>
              </div>
            </div>
          </div>

          <!-- Notes & Purpose -->
          <div>
            <label style="font-weight:700;">Purpose / Project Note:
              <input id="profilePurpose" value="${esc(p.purpose || '')}" placeholder="e.g. Dissertation / DepEd School Admin">
            </label>
          </div>
        </div>
        <div class="mf">
          <button class="btn ghost" data-act="closePanel">Done</button>
        </div>
      </div>
    `;

    // Enter key support for todo input
    const inp = el.querySelector('#todoTextIn');
    if (inp) {
      inp.onkeydown = ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          const txt = inp.value.trim();
          if (txt) {
            p.todos = p.todos || [];
            p.todos.push({ id: uid(), text: txt, done: false, createdAt: now() });
            save();
            render();
            drawPanel();
          }
        }
      };
    }

    // Auto-save purpose
    const purpIn = el.querySelector('#profilePurpose');
    if (purpIn) {
      purpIn.onchange = () => {
        p.purpose = purpIn.value.trim();
        save();
      };
    }
  }

  function closePanel() {
    panelId = null;
    const el = document.getElementById('panelModal');
    if (el) el.remove();
  }

  // --- Prompts View ---
  function renderPrompts() {
    const queued = S.prompts.filter(x => x.status === 'queued');
    const doing = S.prompts.filter(x => x.status === 'doing');
    const done = S.prompts.filter(x => x.status === 'done');

    const promptCard = pr => `
      <div class="card" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="pill ${pr.priority === 'high' ? 'warn' : 'info'}">${PRL[pr.priority]}</span>
            ${pr.project ? `<span class="tb">${esc(pr.project)}</span>` : ''}
            <b style="font-size:15px;margin-left:6px;">${esc(pr.title)}</b>
          </div>
          <small class="mu">${pname(pr.profileId)}</small>
        </div>
        ${pr.text ? `<p style="margin:8px 0;background:#0e1833;padding:10px;border-radius:8px;font-size:13.5px;color:#cbd5e1;white-space:pre-wrap;">${esc(pr.text)}</p>` : ''}
        <div class="btns" style="margin:0;">
          <button class="btn sm pri" data-act="copyPrompt" data-id="${pr.id}">📋 Copy Prompt</button>
          ${pr.status === 'queued' ? `<button class="btn sm" data-act="startPrompt" data-id="${pr.id}">⚡ Mark In Progress</button>` : ''}
          ${pr.status !== 'done' ? `<button class="btn sm" data-act="donePrompt" data-id="${pr.id}">✓ Mark Done</button>` : ''}
          ${pr.status === 'done' ? `<button class="btn sm" data-act="reopenPrompt" data-id="${pr.id}">↩ Reopen</button>` : ''}
          <button class="btn sm danger" data-act="delPrompt" data-id="${pr.id}">✕</button>
        </div>
      </div>
    `;

    return `
      <div class="sec">
        <h2>Prompt Queue</h2>
        <button class="btn pri" data-act="newPrompt">+ Add Prompt</button>
      </div>
      <p class="mu">Line up your questions and tasks ahead of time. The Command Center Advisor automatically pairs ready profiles with matching prompts.</p>
      
      ${doing.length ? `<h3>In Progress (${doing.length})</h3>${doing.map(promptCard).join('')}` : ''}
      <h3 style="margin-top:16px;">Queued (${queued.length})</h3>
      ${queued.length ? queued.map(promptCard).join('') : '<div class="card"><p class="mu">No prompts queued. Click "+ Add Prompt" to queue work.</p></div>'}
      ${done.length ? `<h3 style="margin-top:16px;">Completed (${done.length})</h3>${done.map(promptCard).join('')}` : ''}
    `;
  }

  // --- Handoffs View ---
  function renderHandoffs() {
    const open = S.handoffs.filter(x => !x.resolved);
    const res = S.handoffs.filter(x => x.resolved);

    const hCard = h => `
      <div class="card" style="margin-bottom:10px;${h.resolved ? 'opacity:.6;' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <b>${esc(h.title)}</b>
            <span class="tb">${pname(h.profileId)}</span>
          </div>
          <small class="mu">${fmtAt(h.createdAt)}</small>
        </div>
        <div style="margin:8px 0;display:grid;gap:4px;font-size:13.5px;">
          <div><b style="color:var(--ok)">✓ Done:</b> ${esc(h.done || 'None')}</div>
          <div><b style="color:var(--warn)">👉 Next:</b> ${esc(h.next || 'None')}</div>
          ${h.prompt ? `<div style="background:#0e1833;padding:8px 10px;border-radius:6px;margin-top:4px;color:#cbd5e1;white-space:pre-wrap;">${esc(h.prompt)}</div>` : ''}
        </div>
        <div class="btns" style="margin:0;">
          <button class="btn sm pri" data-act="copyHandoff" data-id="${h.id}">📋 Copy Continuation Prompt</button>
          ${!h.resolved ? `<button class="btn sm" data-act="resolveHandoff" data-id="${h.id}">✓ Mark Resolved</button>` : ''}
          <button class="btn sm danger" data-act="delHandoff" data-id="${h.id}">✕</button>
        </div>
      </div>
    `;

    return `
      <div class="sec">
        <h2>Handoff Cards</h2>
        <button class="btn pri" data-act="newHandoff">+ New Handoff</button>
      </div>
      <p class="mu">Never lose your train of thought when an AI model hits a limit. Save where you stopped, and copy the continuation prompt into the next ready profile in one click.</p>
      
      <h3>Open Handoffs (${open.length})</h3>
      ${open.length ? open.map(hCard).join('') : '<div class="card"><p class="mu">No open handoffs. When a profile hits a limit, record where you stopped here.</p></div>'}
      ${res.length ? `<h3 style="margin-top:16px;">Resolved (${res.length})</h3>${res.map(hCard).join('')}` : ''}
    `;
  }

  // --- Deadlines View ---
  function renderDeadlines() {
    const t = now();
    const list = S.deadlines.slice().sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

    return `
      <div class="sec">
        <h2>Deadline Radar</h2>
        <button class="btn pri" data-act="newDeadline">+ Add Deadline</button>
      </div>
      <p class="mu">Deadlines automatically calculate urgency risk and boost the priority of matching project prompts in your Open This Next Advisor.</p>
      
      <div style="margin-top:12px;">
        ${list.length ? list.map(d => {
          const dueTs = new Date(d.due).getTime();
          const daysLeft = Math.ceil((dueTs - t) / 86400000);
          const risk = daysLeft <= 2 ? 'danger' : daysLeft <= 5 ? 'warn' : 'ok';

          return `
            <div class="card" style="margin-bottom:8px;display:flex;align-items:center;gap:12px;${d.done ? 'opacity:.5;' : ''}">
              <button class="btn sm" data-act="toggleDeadline" data-id="${d.id}">${d.done ? '☑ Done' : '☐'}</button>
              <div style="flex:1;">
                <b style="${d.done ? 'text-decoration:line-through;' : ''}">${esc(d.title)}</b>
                ${d.project ? `<span class="tb">${esc(d.project)}</span>` : ''}
                <div style="font-size:12px;color:var(--tx2);margin-top:2px;">
                  Due: <b>${d.due}</b> (${daysLeft > 0 ? `${daysLeft} days left` : 'Due today/overdue'}) · Est. <b>${d.hours}h</b>
                </div>
              </div>
              <span class="pill ${risk}">${daysLeft <= 0 ? 'URGENT' : `${daysLeft}d left`}</span>
              <button class="x" data-act="delDeadline" data-id="${d.id}">✕</button>
            </div>
          `;
        }).join('') : '<div class="card"><p class="mu">No deadlines tracked. Click "+ Add Deadline" to set one.</p></div>'}
      </div>
    `;
  }

  // --- Day Plan View ---
  function renderPlan() {
    const slotMin = 60;
    const startHour = 8;
    const slotsCount = 8;

    const base = new Date();
    base.setHours(startHour, 0, 0, 0);

    const schedule = [];
    for (let i = 0; i < slotsCount; i++) {
      const from = new Date(base.getTime() + i * slotMin * 60000);
      const to = new Date(from.getTime() + slotMin * 60000);
      const p = S.profiles[i % S.profiles.length];
      schedule.push({ from, to, profile: p });
    }

    const fmtT = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="sec">
        <h2>Auto Day Plan</h2>
        <button class="btn sm" data-act="copyPlan">📋 Copy Plan</button>
      </div>
      <p class="mu">Rotates work across all 25 profiles so cooldown waiting time on one profile is active work time on another.</p>

      <div class="card" style="margin-top:12px;">
        ${schedule.map(s => `
          <div style="display:flex;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);">
            <div style="font-weight:700;color:var(--gold2);min-width:140px;">${fmtT(s.from)} – ${fmtT(s.to)}</div>
            <div style="flex:1;">
              <span class="tb">#${s.profile.taskbarNo || '?'}</span>
              <b>${esc(s.profile.name)}</b>
              <small class="mu">(${esc(s.profile.purpose || s.profile.email)})</small>
            </div>
            <button class="btn sm pri" data-act="switchNote" data-id="${s.profile.id}">Switch Note</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- File Name Checker ---
  function renderFiles() {
    return `
      <div class="sec">
        <h2>DepEd &amp; Institutional File Name Checker</h2>
      </div>
      <div class="card">
        <p class="mu">Enforces standard naming rules: max 39 characters, real words with single spaces (no underscores or hyphens), no banned tags (FINAL, COPY, (1)), lowercase versioning (v2).</p>
        <textarea id="chkInput" style="min-height:100px;width:100%;" placeholder="Paste file or folder names here, one per line (e.g., Grade 8 ST2 Test.docx)"></textarea>
        <div id="chkOutput" style="margin-top:12px;"></div>
      </div>
    `;
  }

  function initNameChecker() {
    const inp = $('#chkInput');
    const out = $('#chkOutput');
    if (!inp || !out) return;

    const bannedWords = ['FINAL', 'FINAL2', 'COPY', 'DRAFT', 'LATEST', 'NEW', 'EDITED'];

    function checkNames() {
      const lines = inp.value.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) {
        out.innerHTML = '<p class="mu">Enter filenames above to test institutional compliance.</p>';
        return;
      }

      out.innerHTML = lines.map(name => {
        const issues = [];
        const base = name.replace(/\.[^/.]+$/, ""); // strip extension

        if (name.length > 39) issues.push(`Too long (${name.length}/39 max chars)`);
        if (/[_-]/.test(base)) issues.push('Contains underscore (_) or hyphen (-); use spaces only');
        if (/\(\d+\)/.test(name)) issues.push('Contains duplicate suffix like (1)');
        
        bannedWords.forEach(w => {
          const reg = new RegExp(`\\b${w}\\b`, 'i');
          if (reg.test(base)) issues.push(`Contains banned word "${w}"`);
        });

        const isOk = issues.length === 0;

        // Auto-fix suggestion
        let fixed = base
          .replace(/[_-]+/g, ' ')
          .replace(/\s*\(\d+\)/g, '')
          .replace(/\b(final\d*|copy|draft|latest|new|edited)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (fixed.length > 35) fixed = fixed.slice(0, 35).trim();
        const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
        const suggested = fixed + ext;

        return `
          <div style="padding:10px;margin-bottom:8px;border-radius:8px;background:#0e1833;border-left:4px solid ${isOk ? 'var(--ok)' : 'var(--warn)'};">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <b>${esc(name)}</b>
              <span class="pill ${isOk ? 'ok' : 'warn'}">${isOk ? '✓ PASS' : '⚠️ REVISE'}</span>
            </div>
            ${!isOk ? `
              <div style="font-size:12.5px;color:var(--warn);margin-top:4px;">
                ${issues.join(' · ')}
              </div>
              <div style="font-size:12.5px;color:var(--gold2);margin-top:4px;">
                Suggested Fix: <code>${esc(suggested)}</code>
              </div>
            ` : '<div style="font-size:12.5px;color:var(--ok);margin-top:2px;">Meets institutional standards.</div>'}
          </div>
        `;
      }).join('');
    }

    inp.addEventListener('input', checkNames);
    checkNames();
  }

  // --- Taskbar Map ---
  function renderTaskbarMap() {
    const t = now();
    const rows = S.profiles.map(p => {
      const st = effStatus(p, t);
      const tNo = p.taskbarNo || '?';
      const shortcut = p.taskbarNo && p.taskbarNo <= 9 ? `Win + ${p.taskbarNo}` : `Icon #${tNo}`;

      return `
        <tr>
          <td><b style="color:var(--gold2);font-size:15px;">#${tNo}</b></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">${esc(p.emoji || '📘')}</span>
              <div>
                <b>${esc(p.name)}</b><br>
                <small class="mu">${esc(p.purpose || p.profileDir)}</small>
              </div>
            </div>
          </td>
          <td><small>${esc(p.email || '—')}</small></td>
          <td>
            <span class="pill ${st === 'ready' ? 'ok' : st === 'waiting' ? 'warn' : 'info'}">${st.toUpperCase()}</span>
            ${st === 'waiting' ? `<span class="dws wt" data-cd="${p.readyAt}">${fmtDur(p.readyAt - t)}</span>` : ''}
          </td>
          <td><code>${shortcut}</code></td>
          <td>
            <button class="btn sm pri" data-act="switchNote" data-id="${p.id}">📌 Switch Note</button>
            <button class="btn sm" data-act="openPanel" data-id="${p.id}">⚙️ Manage</button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="sec">
        <h2>Windows Taskbar Mapping (25 Profiles)</h2>
      </div>
      <p class="mu">Each row represents one Chrome profile pinned to your Windows taskbar, ordered from left to right (#1 to #25).</p>
      
      <div class="card" style="overflow-x:auto;margin-top:10px;">
        <table>
          <thead>
            <tr>
              <th>Taskbar #</th>
              <th>Profile Name</th>
              <th>Google Account</th>
              <th>Live Status</th>
              <th>Shortcut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // --- Sync & Backup ---
  function renderSync() {
    return `
      <div class="sec">
        <h2>Data Backup &amp; Notification Settings</h2>
      </div>
      <div class="card">
        <h3>1. Instant Local Storage</h3>
        <p>All your cooldowns, pending tasks, handoffs, and prompts are saved automatically to your browser's persistent storage. Nothing is lost when you close or refresh the tab.</p>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn pri" data-act="exportBackup">💾 Export JSON Backup</button>
          <button class="btn" data-act="importBackup">📂 Import Backup</button>
          <button class="btn danger" data-act="resetDefaults">🔄 Reset to 25 Default Profiles</button>
        </div>

        <h3 style="margin-top:24px;">2. Sound Chime Notifications</h3>
        <p>When any profile completes its cooldown, a gentle notification chord plays so you immediately know which profile is ready.</p>
        <button class="btn sm pri" id="btnTestChime">🔔 Test Notification Chime</button>
      </div>
    `;
  }

  function pname(id) {
    const p = S.profiles.find(x => x.id === id || x.profileDir === id);
    return p ? p.name : 'Any profile';
  }

  function updateCountdowns() {
    const t = now();
    document.querySelectorAll('[data-cd]').forEach(el => {
      const target = Number(el.dataset.cd);
      el.textContent = fmtDur(target - t);
    });

    // Check if any cooldown finished
    let stateChanged = false;
    S.profiles.forEach(p => {
      if (p.status === 'waiting' && p.readyAt && p.readyAt <= t && p.notifiedFor !== p.readyAt) {
        p.notifiedFor = p.readyAt;
        p.status = 'ready';
        stateChanged = true;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        toast(`🔔 <b>${esc(p.name)}</b> (Taskbar #${p.taskbarNo || '?'}) cooldown finished! Profile is READY.`);
      }
    });

    if (stateChanged) {
      save();
      render();
    }
  }

  function openGenericModal(title, bodyHtml, onSave, saveLabel = 'Save') {
    closeGenericModal();
    modalEl = document.createElement('div');
    modalEl.className = 'ov';
    modalEl.innerHTML = `
      <div class="modal">
        <div class="mh">
          <h3>${title}</h3>
          <button class="x" data-act="closeGenericModal">✕</button>
        </div>
        <form id="genModalForm">
          <div class="mb">${bodyHtml}</div>
          <div class="mf">
            <button type="button" class="btn ghost" data-act="closeGenericModal">Cancel</button>
            <button type="submit" class="btn pri">${saveLabel}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modalEl);
    modalEl.addEventListener('mousedown', ev => { if (ev.target === modalEl) closeGenericModal(); });
    modalEl.querySelector('#genModalForm').addEventListener('submit', ev => {
      ev.preventDefault();
      if (onSave) onSave();
      closeGenericModal();
    });
    return modalEl;
  }

  function closeGenericModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
  }

  // --- Global Event Delegator ---
  document.addEventListener('click', ev => {
    const btn = ev.target.closest('button, [data-act], [data-tab], [data-fstat]');
    if (!btn) return;

    if (btn.dataset.tab) {
      activeTab = btn.dataset.tab;
      render();
      return;
    }

    if (btn.dataset.fstat !== undefined) {
      filterStatus = btn.dataset.fstat;
      render();
      return;
    }

    const act = btn.dataset.act;
    const id = btn.dataset.id;

    if (act === 'switchNote') {
      const p = S.profiles.find(x => x.id === id || x.profileDir === id);
      if (p) showSwitchNote(p);
    } else if (act === 'copyNameOnly') {
      copyText(btn.dataset.name, 'Profile name copied to clipboard');
    } else if (act === 'copyAdvText') {
      const adv = advise(now());
      if (adv && adv.text) copyText(adv.text, 'Prompt copied');
    } else if (act === 'openPanel') {
      panelId = id;
      drawPanel();
    } else if (act === 'closePanel') {
      closePanel();
    } else if (act === 'closeGenericModal') {
      closeGenericModal();
    } 
    // Cooldown Controls
    else if (act === 'quickLimit') {
      const hrs = Number(btn.dataset.h) || 3;
      const p = S.profiles.find(x => x.id === id);
      if (p) {
        p.status = 'waiting';
        p.readyAt = now() + hrs * 3600000;
        p.notifiedFor = null;
        save();
        render();
        if (panelId) drawPanel();
        toast(`⏱️ <b>${esc(p.name)}</b>: ${hrs}h cooldown started (Ready at ${fmtAt(p.readyAt)})`);
      }
    } else if (act === 'setCustomLimit') {
      const p = S.profiles.find(x => x.id === id);
      const customIn = document.getElementById('customH');
      const hrs = customIn ? (Number(customIn.value) || 3) : 3;
      if (p) {
        p.status = 'waiting';
        p.readyAt = now() + hrs * 3600000;
        p.notifiedFor = null;
        save();
        render();
        if (panelId) drawPanel();
        toast(`⏱️ <b>${esc(p.name)}</b>: ${hrs}h custom cooldown started!`);
      }
    }
    // Status Controls
    else if (act === 'markReady') {
      const p = S.profiles.find(x => x.id === id);
      if (p) {
        p.status = 'ready';
        p.readyAt = null;
        p.notifiedFor = null;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        save();
        render();
        if (panelId) drawPanel();
        toast(`✅ <b>${esc(p.name)}</b> is marked READY!`);
      }
    } else if (act === 'unmarkReady') {
      const p = S.profiles.find(x => x.id === id);
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        if (panelId) drawPanel();
        toast(`✕ <b>${esc(p.name)}</b> unmarked ready (Status set to WORKING/BUSY).`);
      }
    } else if (act === 'markWorking') {
      const p = S.profiles.find(x => x.id === id);
      if (p) {
        p.status = 'running';
        p.readyAt = null;
        save();
        render();
        if (panelId) drawPanel();
        toast(`🔵 <b>${esc(p.name)}</b> marked as WORKING.`);
      }
    } else if (act === 'markOff') {
      const p = S.profiles.find(x => x.id === id);
      if (p) {
        p.status = 'off';
        p.readyAt = null;
        save();
        render();
        if (panelId) drawPanel();
        toast(`⚪ <b>${esc(p.name)}</b> turned off.`);
      }
    }
    // Pending Todos
    else if (act === 'addTodo') {
      const p = S.profiles.find(x => x.id === id);
      const inp = document.getElementById('todoTextIn');
      if (p && inp && inp.value.trim()) {
        p.todos = p.todos || [];
        p.todos.push({ id: uid(), text: inp.value.trim(), done: false, createdAt: now() });
        inp.value = '';
        save();
        render();
        if (panelId) drawPanel();
        toast(`📝 Added pending task for <b>${esc(p.name)}</b>`);
      }
    } else if (act === 'toggleTodo') {
      const p = S.profiles.find(x => x.id === id);
      if (p && p.todos) {
        const td = p.todos.find(y => y.id === btn.dataset.tid);
        if (td) {
          td.done = !td.done;
          save();
          render();
          if (panelId) drawPanel();
        }
      }
    } else if (act === 'delTodo') {
      const p = S.profiles.find(x => x.id === id);
      if (p && p.todos) {
        p.todos = p.todos.filter(y => y.id !== btn.dataset.tid);
        save();
        render();
        if (panelId) drawPanel();
        toast('🗑️ Task removed');
      }
    }
    // Prompts
    else if (act === 'copyPrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) copyText(pr.text || '', 'Prompt copied');
    } else if (act === 'startPrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) { pr.status = 'doing'; save(); render(); }
    } else if (act === 'donePrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) { pr.status = 'done'; save(); render(); toast('✓ Prompt marked done'); }
    } else if (act === 'reopenPrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) { pr.status = 'queued'; save(); render(); }
    } else if (act === 'delPrompt') {
      S.prompts = S.prompts.filter(x => x.id !== id);
      save(); render(); toast('🗑️ Prompt deleted');
    } else if (act === 'newPrompt') {
      openGenericModal('New Prompt', `
        <label>Title<input id="npt" required placeholder="e.g. Write Grade 8 ST2 test"></label>
        <div class="row2">
          <label>Assign to Profile
            <select id="npp">
              <option value="">Any available profile</option>
              ${S.profiles.map(p => `<option value="${p.id}">#${p.taskbarNo || '?'} - ${esc(p.name)}</option>`).join('')}
            </select>
          </label>
          <label>Priority
            <select id="npri">
              <option value="high">High</option>
              <option value="med" selected>Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <label>Project Name<input id="nproj" placeholder="e.g. Term 2 Tests"></label>
        <label>Prompt Text<textarea id="nptext" rows="4" placeholder="Paste the prompt or instructions here..."></textarea></label>
      `, () => {
        S.prompts.push({
          id: uid(),
          title: $('#npt').value.trim(),
          profileId: $('#npp').value,
          priority: $('#npri').value,
          project: $('#nproj').value.trim(),
          text: $('#nptext').value.trim(),
          status: 'queued',
          createdAt: now()
        });
        save();
        render();
        toast('✓ Prompt added to queue');
      }, 'Add Prompt');
    }
    // Handoffs
    else if (act === 'copyHandoff') {
      const h = S.handoffs.find(x => x.id === id);
      if (h) copyText(h.prompt || `Continue task: ${h.title}\nDone: ${h.done}\nNext: ${h.next}`, 'Continuation prompt copied');
    } else if (act === 'resolveHandoff') {
      const h = S.handoffs.find(x => x.id === id);
      if (h) { h.resolved = true; save(); render(); toast('✓ Handoff resolved'); }
    } else if (act === 'delHandoff') {
      S.handoffs = S.handoffs.filter(x => x.id !== id);
      save(); render(); toast('🗑️ Handoff removed');
    } else if (act === 'newHandoff') {
      openGenericModal('New Handoff Card', `
        <label>Task Title<input id="hTitle" required placeholder="e.g. Chapter 3 Methodology"></label>
        <label>Profile
          <select id="hProfile">
            ${S.profiles.map(p => `<option value="${p.id}">#${p.taskbarNo || '?'} - ${esc(p.name)}</option>`).join('')}
          </select>
        </label>
        <label>What was completed so far?<textarea id="hDone" rows="2" placeholder="e.g. Sections 3.1 to 3.3 revised"></textarea></label>
        <label>Immediate Next Step<input id="hNext" placeholder="e.g. Sampling framework formula"></label>
        <label>Continuation Prompt (paste ready for next profile)<textarea id="hPrompt" rows="3" placeholder="Continue revising Chapter 3 starting with..."></textarea></label>
      `, () => {
        S.handoffs.push({
          id: uid(),
          title: $('#hTitle').value.trim(),
          profileId: $('#hProfile').value,
          done: $('#hDone').value.trim(),
          next: $('#hNext').value.trim(),
          prompt: $('#hPrompt').value.trim(),
          resolved: false,
          createdAt: now()
        });
        save();
        render();
        toast('✓ Handoff card created');
      }, 'Save Handoff');
    }
    // Deadlines
    else if (act === 'newDeadline') {
      openGenericModal('New Deadline', `
        <label>Deliverable Title<input id="dTitle" required placeholder="e.g. DepEd ST2 Test Submission"></label>
        <div class="row2">
          <label>Due Date<input type="date" id="dDue" required value="${new Date(now() + 7 * 86400000).toISOString().slice(0, 10)}"></label>
          <label>Estimated Hours<input type="number" id="dHours" min="0" step="0.5" value="4.0"></label>
        </div>
        <label>Matching Project Name<input id="dProj" placeholder="e.g. Term 2 Tests"></label>
      `, () => {
        S.deadlines.push({
          id: uid(),
          title: $('#dTitle').value.trim(),
          due: $('#dDue').value,
          hours: Number($('#dHours').value) || 4,
          project: $('#dProj').value.trim(),
          done: false
        });
        save();
        render();
        toast('✓ Deadline tracked');
      }, 'Add Deadline');
    } else if (act === 'toggleDeadline') {
      const d = S.deadlines.find(x => x.id === id);
      if (d) { d.done = !d.done; save(); render(); }
    } else if (act === 'delDeadline') {
      S.deadlines = S.deadlines.filter(x => x.id !== id);
      save(); render(); toast('🗑️ Deadline deleted');
    }
    // Plan
    else if (act === 'copyPlan') {
      const lines = S.profiles.map(p => `#${p.taskbarNo || '?'} ${p.name}: ${p.purpose || 'Active'}`);
      copyText(lines.join('\n'), 'Day plan schedule copied');
    }
    // Backup & Reset
    else if (act === 'exportBackup') {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Chrome_Command_Center_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      toast('💾 Backup downloaded');
    } else if (act === 'importBackup') {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.json';
      inp.onchange = async () => {
        try {
          const file = inp.files[0];
          if (file) {
            const data = JSON.parse(await file.text());
            if (data.profiles && Array.isArray(data.profiles)) {
              S = data;
              save();
              render();
              toast('✓ Backup restored successfully!');
            }
          }
        } catch (err) {
          toast('⚠️ Invalid JSON backup file');
        }
      };
      inp.click();
    } else if (act === 'resetDefaults') {
      if (confirm('Reset all profiles to the 25 default taskbar profiles?')) {
        S.profiles = DEFAULT_PROFILES;
        save();
        render();
        toast('✓ Reset to 25 taskbar profiles');
      }
    }
  });

  // Sound Test & Refresh Header Button
  document.addEventListener('click', ev => {
    if (ev.target && ev.target.id === 'btnTestChime') {
      if (window.soundMgr) window.soundMgr.playReadyChime();
      toast('🔔 Chime played');
    }
    if (ev.target && (ev.target.id === 'btnRefresh' || ev.target.closest('#btnRefresh'))) {
      render();
      toast('🔄 View refreshed · All 25 profiles up to date');
    }
  });

  // Init
  render();
  setInterval(updateCountdowns, 1000);
})();
