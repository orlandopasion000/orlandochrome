/* Chrome Taskbar Command Center & Live Waitboard Engine */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  let S = {
    settings: { defaultResetH: 3.0, dailyH: 4.0, slotMin: 60, dayStart: '08:00', dayEnd: '18:00', sound: true },
    profiles: [],
    prompts: [],
    handoffs: [],
    deadlines: [],
    files: [],
    runningProfiles: {},
    connectedClients: {}
  };

  let activeTab = 'board';
  let filterStatus = '';
  let panelId = null;
  let modalEl = null;
  let ws = null;
  let lastReadyCount = -1;

  // Format durations
  function fmtDur(ms) {
    if (ms <= 0) return 'Ready';
    let s = Math.ceil(ms / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    if (d) return `${d}d ${h}h ${m}m`;
    if (h) return `${h}h ${m}m ${String(s).padStart(2, '0')}s`;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  }

  function fmtAt(ts) {
    const d = new Date(ts);
    const same = d.toDateString() === new Date().toDateString();
    const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return same ? `today ${t}` : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${t}`;
  }

  function effStatus(p, t) {
    if (p.status === 'waiting' && p.readyAt && p.readyAt <= t) return 'ready';
    return p.status || 'ready';
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.innerHTML = msg;
    $('#toast').appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('📋 Copied to clipboard');
    } catch (e) {
      toast('⚠️ Could not copy: ' + e.message);
    }
  }

  // --- WebSocket Connection ---
  function connectWS() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      $('#wsChip').className = 'chip ok';
      $('#wsChip').innerHTML = '🟢 Live Synced';
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'initial_state' || msg.type === 'state_updated') {
          S = Object.assign(S, msg.state);
          render();
        } else if (msg.type === 'profile_ready_alert') {
          if (window.soundMgr) window.soundMgr.playReadyChime();
          toast(`🔔 <b>${esc(msg.profile.name)}</b> (Taskbar #${msg.profile.taskbarNo || '?'}) is ready to work!`);
          render();
        } else if (msg.type === 'extension_connected') {
          toast(`⚡ Companion connected from profile <b>${esc(msg.profileDir)}</b>`);
        }
      } catch (e) {
        console.warn('WS message error:', e);
      }
    };

    ws.onclose = () => {
      $('#wsChip').className = 'chip warn';
      $('#wsChip').innerHTML = '🟡 Reconnecting...';
      setTimeout(connectWS, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  function sendAction(action, data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'action', action, data }));
    } else {
      fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      }).then(r => r.json()).then(res => {
        fetchState();
      });
    }
  }

  // Discovered profiles fallback if local server is not running
  const FALLBACK_PROFILES = [
    { id: "p_profile_1", profileDir: "Profile 1", name: "Orlando (A2 000)", email: "orlandopasion000@gmail.com", taskbarNo: 1, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_16", profileDir: "Profile 16", name: "Orlando (A1 001 DepEd)", email: "orlando.pasion001@deped.gov.ph", taskbarNo: 2, color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_17", profileDir: "Profile 17", name: "Blanca Eunice (DepEd)", email: "blancaeunice.pasion@deped.gov.ph", taskbarNo: 3, color: "#E8A33D", emoji: "🛠️", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_19", profileDir: "Profile 19", name: "Blanca Eunice", email: "btaborda07@gmail.com", taskbarNo: 4, color: "#E86A8A", emoji: "🧮", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_2", profileDir: "Profile 2", name: "Orlando (A3 0817)", email: "orlandopasion0817@gmail.com", taskbarNo: 5, color: "#A78BFA", emoji: "📊", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_20", profileDir: "Profile 20", name: "Nash (Nash Reviewer)", email: "revnash0@gmail.com", taskbarNo: 6, color: "#2DD4BF", emoji: "📝", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_22", profileDir: "Profile 22", name: "A", email: "yifyyts7@gmail.com", taskbarNo: 7, color: "#F97316", emoji: "🎯", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_24", profileDir: "Profile 24", name: "Your Chrome (Hero)", email: "heroesmeraldaepicalu@gmail.com", taskbarNo: 8, color: "#84CC16", emoji: "🧠", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_33", profileDir: "Profile 33", name: "Nancalobasaan NHS", email: "300406@deped.gov.ph", taskbarNo: 9, color: "#F472B6", emoji: "📚", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_39", profileDir: "Profile 39", name: "Orlando (A6 002 Gmail)", email: "orlandopasion002@gmail.com", taskbarNo: 10, color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_4", profileDir: "Profile 4", name: "Blanca Eunice", email: "bepasion07@gmail.com", taskbarNo: 11, color: "#FACC15", emoji: "💡", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_40", profileDir: "Profile 40", name: "Orlando (A5 003 Gmail)", email: "orlandopasion003@gmail.com", taskbarNo: 12, color: "#94A3B8", emoji: "⚡", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_41", profileDir: "Profile 41", name: "Orlando (A5 004 Gmail)", email: "orlandopasion004@gmail.com", taskbarNo: 13, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_44", profileDir: "Profile 44", name: "SCITE 3", email: "scite.orlandopasion003@gmail.com", taskbarNo: 14, color: "#4DA3FF", emoji: "🎓", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_45", profileDir: "Profile 45", name: "Your Chrome (scite001)", email: "scite.orlandopasion001@gmail.com", taskbarNo: 15, color: "#E8A33D", emoji: "🛠️", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_46", profileDir: "Profile 46", name: "Orlando (A6 scite002)", email: "scite.orlandopasion002@gmail.com", taskbarNo: 16, color: "#E86A8A", emoji: "🧮", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_48", profileDir: "Profile 48", name: "Gwapo", email: "gwapocpogi@gmail.com", taskbarNo: 17, color: "#A78BFA", emoji: "📊", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_49", profileDir: "Profile 49", name: "Gold Cloud", email: "goldcloudblack@gmail.com", taskbarNo: 18, color: "#2DD4BF", emoji: "📝", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_52", profileDir: "Profile 52", name: "Orlando (005 Gmail)", email: "orlandopasion005@gmail.com", taskbarNo: 19, color: "#F97316", emoji: "🎯", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_53", profileDir: "Profile 53", name: "Orlando (006 Gmail)", email: "orlandopasion006@gmail.com", taskbarNo: 20, color: "#84CC16", emoji: "🧠", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_56", profileDir: "Profile 56", name: "Orlando (pogiorlando)", email: "pogiorlandopasion@gmail.com", taskbarNo: 21, color: "#F472B6", emoji: "📚", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_57", profileDir: "Profile 57", name: "Watch", email: "watchonlineapple@gmail.com", taskbarNo: 22, color: "#60A5FA", emoji: "🏫", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_58", profileDir: "Profile 58", name: "Orlando (grammarly)", email: "grammarlyquillbot001@gmail.com", taskbarNo: 23, color: "#FACC15", emoji: "💡", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_59", profileDir: "Profile 59", name: "Orlando (netflix)", email: "netflixpasion1994@gmail.com", taskbarNo: 24, color: "#94A3B8", emoji: "⚡", status: "ready", readyAt: null, todos: [] },
    { id: "p_profile_9", profileDir: "Profile 9", name: "Orlando (A5 001 Gmail)", email: "orlandopasion001@gmail.com", taskbarNo: 25, color: "#3DDC97", emoji: "📘", status: "ready", readyAt: null, todos: [] }
  ];

  function fetchState() {
    fetch('/api/state')
      .then(r => r.json())
      .then(data => {
        S = Object.assign(S, data);
        render();
      })
      .catch(err => {
        console.warn('Fetch state error, using discovered taskbar profiles fallback:', err);
        if (!S.profiles.length) {
          S.profiles = FALLBACK_PROFILES;
          render();
        }
      });
  }

  async function launchOrFocus(profileDir, url = '') {
    toast(`🚀 Launching / Focusing <b>${esc(profileDir)}</b>...`);
    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileDir, url })
      });
      const data = await res.json();
      if (data.ok) {
        toast(`✅ Profile active on screen!`);
      }
    } catch (e) {
      toast(`⚠️ Launch error: ${e.message}`);
    }
  }

  // --- Urgency & Advisor Logic ---
  const PRI = { high: 3, med: 2, low: 1 };
  const PRL = { high: 'High', med: 'Medium', low: 'Low' };

  function daysLeft(d, t) {
    return (new Date(d.due + 'T23:59:59').getTime() - t) / 86400000;
  }

  function riskOf(d, t, dailyH) {
    if (d.done) return { key: 'done', label: 'Done', dl: 0 };
    const dl = daysLeft(d, t);
    if (dl < 0) return { key: 'over', label: 'Overdue', dl };
    const need = Number(d.hours) || 0;
    let key;
    if (need > 0) {
      const r = need / (Math.max(dl, 0.05) * (dailyH || 4));
      key = r > 1 ? 'crit' : r > 0.6 ? 'risk' : 'ok';
    } else {
      key = dl <= 1 ? 'crit' : dl <= 3 ? 'risk' : 'ok';
    }
    return { key, label: { crit: 'Critical', risk: 'At risk', ok: 'On track' }[key], dl };
  }

  function urgencyFor(project, t, dailyH) {
    const pr = String(project || '').trim().toLowerCase();
    if (!pr) return 0;
    let u = 0;
    S.deadlines.filter(d => !d.done && String(d.project || '').trim().toLowerCase() === pr).forEach(d => {
      const r = riskOf(d, t, dailyH);
      u = Math.max(u, { over: 20, crit: 18, risk: 10, ok: r.dl <= 7 ? 4 : 0 }[r.key] || 0);
    });
    return u;
  }

  function scorePrompt(x, t, dailyH) {
    return (PRI[x.priority] || 2) * 10 + urgencyFor(x.project, t, dailyH);
  }

  function advise(t) {
    const live = S.profiles.filter(p => p.status !== 'off');
    const ready = live.filter(p => effStatus(p, t) === 'ready');
    const queued = S.prompts.filter(x => x.status === 'queued');

    let best = null;
    ready.forEach(p => {
      // Check handoffs
      S.handoffs.filter(h => !h.resolved && (h.profileId === p.id || h.profileId === p.profileDir)).forEach(h => {
        const sc = 30;
        if (!best || sc > best.score) {
          best = {
            score: sc,
            p,
            kind: 'resume',
            title: 'Resume: ' + h.title,
            why: 'Unfinished work is waiting with a saved handoff prompt.',
            text: h.prompt || `Continue this task.\nDone so far: ${h.done || '-'}\nNext: ${h.next || '-'}`
          };
        }
      });

      // Check prompts
      queued.forEach(x => {
        let sc = scorePrompt(x, t, S.settings.dailyH);
        if (x.profileId === p.id || x.profileId === p.profileDir) sc += 8;
        if (!best || sc > best.score) {
          const u = urgencyFor(x.project, t, S.settings.dailyH);
          const why = [`${PRL[x.priority]} priority`];
          if (u >= 10) why.push(`deadline pressure on ${x.project}`);
          if (x.profileId === p.id) why.push('assigned to this profile');
          best = {
            score: sc,
            p,
            kind: 'prompt',
            title: x.title,
            why: why.join(' · ') + '.',
            text: x.text
          };
        }
      });
    });

    if (best) return Object.assign({ type: 'go' }, best);
    if (ready.length) return { type: 'idle', p: ready[0] };
    const w = live.filter(p => p.status === 'waiting' && p.readyAt).sort((a, b) => a.readyAt - b.readyAt)[0];
    if (w) return { type: 'wait', p: w, at: w.readyAt };
    return { type: 'none' };
  }

  function pendingCount(p) {
    const todos = (p.todos || []).filter(x => !x.done).length;
    const hand = S.handoffs.filter(h => !h.resolved && (h.profileId === p.id || h.profileId === p.profileDir)).length;
    const prom = S.prompts.filter(x => x.status !== 'done' && (x.profileId === p.id || x.profileId === p.profileDir)).length;
    return todos + hand + prom;
  }

  // --- Rendering Modules ---
  const TABS = [
    ['board', 'Taskbar Dock'],
    ['prompts', 'Prompts'],
    ['handoffs', 'Handoffs'],
    ['deadlines', 'Deadlines'],
    ['plan', 'Day Plan'],
    ['files', 'Name Checker'],
    ['taskbarMap', 'Taskbar Map'],
    ['sync', 'Live Sync']
  ];

  function render() {
    renderHeader();
    renderTabs();

    const views = {
      board: renderBoard,
      prompts: renderPrompts,
      handoffs: renderHandoffs,
      deadlines: renderDeadlines,
      plan: renderPlan,
      files: renderFiles,
      taskbarMap: renderTaskbarMap,
      sync: renderSync
    };

    const fn = views[activeTab] || renderBoard;
    $('#view').innerHTML = fn();
    updateCountdowns();

    if (panelId) drawPanel();
  }

  function renderHeader() {
    const runningCount = Object.keys(S.runningProfiles || {}).length;
    $('#runningChip').textContent = `🔍 ${runningCount} Chrome Profile${runningCount === 1 ? '' : 's'} Running`;
  }

  function renderTabs() {
    const t = now();
    const readyCount = S.profiles.filter(p => effStatus(p, t) === 'ready').length;
    const promptCount = S.prompts.filter(x => x.status === 'queued').length;
    const handoffCount = S.handoffs.filter(h => !h.resolved).length;
    const counts = { board: readyCount, prompts: promptCount, handoffs: handoffCount };

    $('#tabs').innerHTML = TABS.map(([k, l]) => `
      <button class="${k === activeTab ? 'on' : ''}" data-tab="${k}">
        ${l} ${counts[k] ? `<span class="cnt">${counts[k]}</span>` : ''}
      </button>
    `).join('');
  }

  function renderBoard() {
    const t = now();
    const adv = advise(t);

    // Hero Advisor Banner
    let heroHtml = '';
    if (adv.type === 'go') {
      heroHtml = `
        <section class="adv">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:70px;height:70px;font-size:26px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">OPEN THIS PROFILE NEXT</small>
              <h2>${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <div style="font-size:15px;color:#fff;margin:2px 0;">${esc(adv.title)}</div>
              <small>${esc(adv.why)}</small>
            </div>
          </div>
          <div class="advr">
            <button class="btn pri" data-act="launchAdv" data-dir="${esc(adv.p.profileDir)}">🚀 Launch / Focus</button>
            <button class="btn" data-act="copyAdvText">📋 Copy Prompt</button>
            <button class="btn ghost" data-act="hitLimitNow" data-id="${adv.p.id}">⏱️ Hit Limit</button>
          </div>
        </section>
      `;
    } else if (adv.type === 'idle') {
      heroHtml = `
        <section class="adv">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:68px;height:68px;font-size:26px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">READY FOR WORK</small>
              <h2>${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <small>This Chrome profile is free with no active cooldown.</small>
            </div>
          </div>
          <div class="advr">
            <button class="btn pri" data-act="launchAdv" data-dir="${esc(adv.p.profileDir)}">🚀 Open Profile</button>
            <button class="btn" data-act="openPanel" data-id="${adv.p.id}">📝 Add Task</button>
          </div>
        </section>
      `;
    } else if (adv.type === 'wait') {
      heroHtml = `
        <section class="adv">
          <div class="advl">
            <div class="dkav" style="border-color:${adv.p.color};width:68px;height:68px;font-size:26px;">
              ${esc(adv.p.emoji || '📘')}
              <span class="tb-num">#${adv.p.taskbarNo || '?'}</span>
            </div>
            <div>
              <small class="k">ALL PROFILES ON COOLDOWN</small>
              <h2>Next ready: ${esc(adv.p.name)} <span class="tb">Taskbar #${adv.p.taskbarNo || '?'}</span></h2>
              <div class="dws wt" data-cd="${adv.at}" style="font-size:18px;margin:2px 0;">${fmtDur(adv.at - t)}</div>
              <small>Ready at ${fmtAt(adv.at)}. Perfect time to review outputs, check file names, or plan prompts.</small>
            </div>
          </div>
        </section>
      `;
    }

    // Status counts
    const cnt = s => S.profiles.filter(p => effStatus(p, t) === s).length;
    const withP = S.profiles.filter(p => pendingCount(p) > 0).length;
    const nextW = S.profiles.filter(p => p.status === 'waiting' && p.readyAt > t).sort((a, b) => a.readyAt - b.readyAt)[0];

    // Filter profiles
    let list = S.profiles.filter(p => {
      if (!filterStatus) return true;
      if (filterStatus === 'pending') return pendingCount(p) > 0;
      return effStatus(p, t) === filterStatus;
    });

    const dockItems = list.map(p => {
      const st = effStatus(p, t);
      const isRunning = !!(S.runningProfiles && S.runningProfiles[p.profileDir]);
      const extInfo = S.connectedClients && S.connectedClients[p.profileDir];
      const hasExt = !!extInfo && (t - extInfo.lastSeen < 60000);
      const isNext = (adv.p && adv.p.id === p.id);
      const pCount = pendingCount(p);

      const ringColor = { ready: '#3DDC97', waiting: '#FFB020', running: '#5AA9FF', off: '#4A5568' }[st] || '#888';
      const subHtml = st === 'waiting'
        ? `<span class="dws wt" data-cd="${p.readyAt}">${fmtDur(p.readyAt - t)}</span>`
        : `<span class="dws ${st}">${st === 'ready' ? 'Ready' : st === 'running' ? 'Working' : 'Off'}</span>`;

      return `
        <button class="dk ${isNext ? 'next' : ''} ${isRunning ? 'running' : ''}" data-act="openPanel" data-id="${p.id}" title="${esc(p.name)} (${p.email})">
          <div class="dkav" style="border-color:${ringColor};background:${p.color}15;">
            ${esc(p.emoji || '📘')}
            ${p.taskbarNo ? `<span class="tb-num">#${p.taskbarNo}</span>` : ''}
            ${pCount > 0 ? `<span class="pbadge">${pCount}</span>` : ''}
            ${hasExt ? `<span class="ext-dot" title="Live Companion Extension Active"></span>` : ''}
          </div>
          <span class="dkn">${esc(p.name)}</span>
          ${subHtml}
        </button>
      `;
    }).join('');

    return `
      ${heroHtml}
      
      <!-- Stats Row -->
      <div class="stats">
        <div class="stat ok"><b>${cnt('ready')}</b>Ready</div>
        <div class="stat rn"><b>${cnt('running')}</b>Working</div>
        <div class="stat wt"><b>${cnt('waiting')}</b>In Cooldown</div>
        <div class="stat"><b style="color:#ef5b5b">${withP}</b>With Pending Work</div>
        <div class="stat"><b>${nextW ? `<span data-cd="${nextW.readyAt}">${fmtDur(nextW.readyAt - t)}</span>` : '—'}</b>Next Cooldown End</div>
      </div>

      <!-- Dock Controls & Filters -->
      <div class="dock-wrap">
        <div class="dock-header">
          <div>
            <b>Taskbar Chrome Dock</b> 
            <small class="mu"> (${S.profiles.length} total profiles · ${S.profiles.filter(p => p.isPinned).length} pinned to Windows taskbar)</small>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="chip ${!filterStatus ? 'on' : ''}" data-fstat="">All (${S.profiles.length})</button>
            <button class="chip ${filterStatus === 'ready' ? 'on' : ''}" data-fstat="ready">Ready (${cnt('ready')})</button>
            <button class="chip ${filterStatus === 'waiting' ? 'on' : ''}" data-fstat="waiting">Waiting (${cnt('waiting')})</button>
            <button class="chip ${filterStatus === 'pending' ? 'on' : ''}" data-fstat="pending">Pending (${withP})</button>
          </div>
        </div>
        <div class="dock">${dockItems}</div>
      </div>
    `;
  }

  // --- Prompts View ---
  function renderPrompts() {
    const t = now();
    const queued = S.prompts.filter(x => x.status === 'queued');
    const doing = S.prompts.filter(x => x.status === 'doing');
    const done = S.prompts.filter(x => x.status === 'done');

    const promptCard = x => `
      <div class="row">
        <div class="row-bar ${x.priority}"></div>
        <div class="grow">
          <div style="display:flex;gap:8px;align-items:center;">
            <b>${esc(x.title)}</b>
            ${x.project ? `<span class="pill info">${esc(x.project)}</span>` : ''}
            <span class="pill ${x.priority === 'high' ? 'bad' : x.priority === 'med' ? 'warn' : 'ok'}">${PRL[x.priority]}</span>
            ${x.profileId ? `<span class="pill">${esc(pname(x.profileId))}</span>` : ''}
          </div>
          <div class="prev" style="margin-top:6px;color:#cfd8ee;">${esc((x.text || '').slice(0, 240))}${(x.text || '').length > 240 ? '…' : ''}</div>
        </div>
        <div class="btns" style="margin:0;">
          <button class="btn sm pri" data-act="copyPrompt" data-id="${x.id}">📋 Copy</button>
          ${x.status === 'queued' ? `<button class="btn sm" data-act="startPrompt" data-id="${x.id}">▶️ Start</button>` : ''}
          ${x.status !== 'done' ? `<button class="btn sm" data-act="donePrompt" data-id="${x.id}">✓ Done</button>` : `<button class="btn sm ghost" data-act="reopenPrompt" data-id="${x.id}">Reopen</button>`}
          <button class="btn sm danger" data-act="delPrompt" data-id="${x.id}">✕</button>
        </div>
      </div>
    `;

    return `
      <div class="sec">
        <h2>Prompt Queue</h2>
        <button class="btn pri" data-act="newPrompt">+ Add Prompt</button>
      </div>
      <p class="mu">Line up your tasks and prompts ahead of time. The Command Center Advisor automatically matches prompts with free profiles.</p>
      
      ${doing.length ? `<h3>In Progress (${doing.length})</h3>${doing.map(promptCard).join('')}` : ''}
      <h3 style="margin-top:16px;">Queued (${queued.length})</h3>
      ${queued.length ? queued.map(promptCard).join('') : '<div class="card"><p class="mu">No prompts queued. Add prompts to keep ready profiles working.</p></div>'}
      ${done.length ? `<h3 style="margin-top:16px;">Completed (${done.length})</h3>${done.map(promptCard).join('')}` : ''}
    `;
  }

  // --- Handoffs View ---
  function renderHandoffs() {
    const open = S.handoffs.filter(h => !h.resolved);
    const res = S.handoffs.filter(h => h.resolved);

    const hCard = h => `
      <div class="row">
        <div class="grow">
          <div style="display:flex;gap:8px;align-items:center;">
            <b>${esc(h.title)}</b>
            <span class="pill info">${esc(pname(h.profileId))}</span>
          </div>
          <div style="margin-top:6px;font-size:13px;display:grid;gap:4px;">
            <div><b>Done so far:</b> ${esc(h.done || '—')}</div>
            <div><b>Next step:</b> ${esc(h.next || '—')}</div>
            ${h.prompt ? `<div style="background:#0e1833;padding:8px 10px;border-radius:6px;margin-top:4px;">“${esc(h.prompt)}”</div>` : ''}
          </div>
        </div>
        <div class="btns" style="margin:0;">
          <button class="btn sm pri" data-act="copyHandoff" data-id="${h.id}">📋 Copy Prompt</button>
          ${!h.resolved ? `<button class="btn sm" data-act="resolveHandoff" data-id="${h.id}">✓ Resolved</button>` : ''}
          <button class="btn sm danger" data-act="delHandoff" data-id="${h.id}">✕</button>
        </div>
      </div>
    `;

    return `
      <div class="sec">
        <h2>Handoff Cards</h2>
        <button class="btn pri" data-act="newHandoff">+ New Handoff</button>
      </div>
      <p class="mu">Never lose your train of thought when hitting an AI message limit. Save where you stopped, and copy the continuation prompt into the next ready profile in one click.</p>
      
      <h3>Open Handoffs (${open.length})</h3>
      ${open.length ? open.map(hCard).join('') : '<div class="card"><p class="mu">No open handoffs. When a profile hits a limit, write a quick handoff card here.</p></div>'}
      ${res.length ? `<h3 style="margin-top:16px;">Resolved (${res.length})</h3>${res.map(hCard).join('')}` : ''}
    `;
  }

  // --- Deadlines View ---
  function renderDeadlines() {
    const t = now();
    const dh = S.settings.dailyH || 4;
    const list = S.deadlines.slice().sort((a, b) => (a.done - b.done) || a.due.localeCompare(b.due));
    const cls = { over: 'bad', crit: 'bad', risk: 'warn', ok: 'ok', done: 'info' };

    return `
      <div class="sec">
        <h2>Deadline Radar</h2>
        <button class="btn pri" data-act="newDeadline">+ Add Deadline</button>
      </div>
      <p class="mu">Projects linked to upcoming deadlines automatically boost the priority of matching prompts in the "Open This Next" Advisor.</p>
      
      <div style="margin-top:12px;">
        ${list.length ? list.map(d => {
          const r = riskOf(d, t, dh);
          const dl = Math.ceil(r.dl);
          return `
            <div class="row">
              <div class="grow">
                <b>${esc(d.title)}</b> ${d.project ? `<span class="pill info">${esc(d.project)}</span>` : ''}
                <div style="margin-top:6px;">
                  <span class="pill ${cls[r.key]}">${r.label}</span>
                  <span class="pill">Due ${esc(d.due)}</span>
                  ${!d.done ? `<span class="pill">${r.key === 'over' ? Math.abs(dl) + ' days overdue' : dl + ' days left'}</span>` : ''}
                  ${d.hours ? `<span class="pill">~${d.hours}h work needed</span>` : ''}
                </div>
              </div>
              <div class="btns" style="margin:0;">
                <button class="btn sm" data-act="toggleDeadline" data-id="${d.id}">${d.done ? 'Reopen' : '✓ Done'}</button>
                <button class="btn sm danger" data-act="delDeadline" data-id="${d.id}">✕</button>
              </div>
            </div>
          `;
        }).join('') : '<div class="card"><p class="mu">No deadlines recorded yet.</p></div>'}
      </div>
    `;
  }

  // --- Day Plan View ---
  function renderPlan() {
    const [sh, sm] = (S.settings.dayStart || '08:00').split(':').map(Number);
    const [eh, em] = (S.settings.dayEnd || '18:00').split(':').map(Number);
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sh, sm).getTime();
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), eh, em).getTime();
    const slotMs = (S.settings.slotMin || 60) * 60000;

    const readyList = S.profiles.filter(p => p.status !== 'off');
    const schedule = [];
    let cur = start;
    let pIdx = 0;

    while (cur < end && readyList.length) {
      const p = readyList[pIdx % readyList.length];
      schedule.push({
        from: cur,
        to: Math.min(cur + slotMs, end),
        profile: p
      });
      cur += slotMs;
      pIdx++;
    }

    const fmtT = ts => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return `
      <div class="sec">
        <h2>Auto Day Plan</h2>
        <button class="btn sm" data-act="copyPlan">📋 Copy Schedule</button>
      </div>
      <p class="mu">Maximizes work rotation across all ${S.profiles.length} profiles so waiting time on one profile becomes active work time on another.</p>

      <div class="card" style="margin-top:12px;">
        ${schedule.map(s => `
          <div style="display:flex;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);">
            <div style="font-weight:700;color:var(--gold2);min-width:140px;">${fmtT(s.from)} – ${fmtT(s.to)}</div>
            <div>
              <span class="tb">#${s.profile.taskbarNo || '?'}</span>
              <b>${esc(s.profile.name)}</b>
              <small class="mu">(${esc(s.profile.purpose || s.profile.email)})</small>
            </div>
            <button class="btn sm pri" style="margin-left:auto;" data-act="launchAdv" data-dir="${esc(s.profile.profileDir)}">Open</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- DepEd Institutional Name Checker View ---
  function renderFiles() {
    return `
      <div class="sec">
        <h2>DepEd &amp; Institutional File Name Checker</h2>
      </div>
      <div class="card">
        <p class="mu">Validate output file names before submission. Rules: max 39 characters, spaces only (no underscores or hyphens), no forbidden words like FINAL or COPY, version suffix in lowercase (v2).</p>
        <textarea id="chkInput" style="min-height:90px;" placeholder="Paste file or folder names here, one per line (e.g., Grade 8 ST2 Test.docx)"></textarea>
        <div id="chkOutput" style="margin-top:12px;"></div>
      </div>
    `;
  }

  // --- Taskbar Map View ---
  function renderTaskbarMap() {
    const rows = S.profiles.map(p => {
      const isRunning = !!(S.runningProfiles && S.runningProfiles[p.profileDir]);
      const extInfo = S.connectedClients && S.connectedClients[p.profileDir];
      return `
        <tr>
          <td><b style="color:var(--gold2)">#${p.taskbarNo || '—'}</b></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">${esc(p.emoji || '📘')}</span>
              <b>${esc(p.name)}</b>
            </div>
          </td>
          <td><code>${esc(p.profileDir)}</code></td>
          <td><small>${esc(p.email || '—')}</small></td>
          <td>
            <span class="pill ${p.status === 'ready' ? 'ok' : p.status === 'waiting' ? 'warn' : 'info'}">${p.status}</span>
            ${isRunning ? '<span class="pill ok">Running</span>' : ''}
            ${extInfo ? '<span class="pill ok">Extension Live</span>' : ''}
          </td>
          <td>
            <button class="btn sm pri" data-act="launchAdv" data-dir="${esc(p.profileDir)}">🚀 Launch</button>
            <button class="btn sm" data-act="openPanel" data-id="${p.id}">⚙️ Manage</button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="sec">
        <h2>Windows Taskbar Profile Map (${S.profiles.length} Profiles)</h2>
        <button class="btn sm" id="btnRefreshMap">🔄 Re-scan Taskbar Pins</button>
      </div>
      <p class="mu">Each row represents one Chrome profile pinned to your Windows taskbar, automatically detected from Chrome's User Data and Windows ImplicitAppShortcuts.</p>
      
      <div class="card" style="overflow-x:auto;margin-top:10px;">
        <table>
          <thead>
            <tr>
              <th>Taskbar #</th>
              <th>Profile Name</th>
              <th>Profile Dir</th>
              <th>Google Account</th>
              <th>Live Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // --- Sync View ---
  function renderSync() {
    return `
      <div class="sec">
        <h2>Live Sync &amp; Chrome Extension Bridge</h2>
      </div>
      <div class="card">
        <h3>1. Real-Time System Bridge</h3>
        <p>The local service is active on <code>http://127.0.0.1:48100</code> and <code>ws://127.0.0.1:48100/ws</code>. It continuously tracks running Chrome processes and updates your taskbar status live.</p>
        
        <h3 style="margin-top:18px;">2. Chrome Companion Extension</h3>
        <p>Install the included companion extension in your Chrome profiles to enable automatic AI rate-limit detection and one-click cooldown sync directly from Claude, ChatGPT, and Gemini tabs.</p>
        <ol style="padding-left:20px;line-height:1.8;">
          <li>Open <code>chrome://extensions</code> in any of your Chrome profiles.</li>
          <li>Turn on <b>Developer mode</b> (top right toggle).</li>
          <li>Click <b>Load unpacked</b> and select the <code>extension</code> folder in this project repository.</li>
          <li>The extension will connect automatically to the Command Center and show a live green dot on that taskbar profile icon!</li>
        </ol>

        <h3 style="margin-top:18px;">3. Audio Alert Chime</h3>
        <p>When a cooldown finishes, a gentle chime sounds so you know immediately when to switch.</p>
        <button class="btn sm pri" id="btnTestSound">🔔 Test Notification Chime</button>
      </div>
    `;
  }

  // --- Profile Detail Panel Modal ---
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
    const isRunning = !!(S.runningProfiles && S.runningProfiles[p.profileDir]);
    const todos = p.todos || [];

    el.innerHTML = `
      <div class="modal">
        <div class="mh">
          <h3>Profile Details · Taskbar #${p.taskbarNo || '?'}</h3>
          <button class="x" data-act="closePanel">✕</button>
        </div>
        <div class="mb">
          <div style="display:flex;gap:14px;align-items:center;">
            <div class="dkav" style="border-color:${p.color};width:70px;height:70px;font-size:26px;">
              ${esc(p.emoji || '📘')}
              <span class="tb-num">#${p.taskbarNo || '?'}</span>
            </div>
            <div>
              <h2 style="font-size:20px;">${esc(p.name)}</h2>
              <small class="mu">${esc(p.email || p.profileDir)} · Status: <b>${st.toUpperCase()}</b> ${isRunning ? '(Open on Desktop)' : ''}</small>
              ${st === 'waiting' ? `<div class="dws wt" data-cd="${p.readyAt}" style="font-size:16px;margin-top:4px;">Ready in ${fmtDur(p.readyAt - t)}</div>` : ''}
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;">
            <button class="btn pri" data-act="launchAdv" data-dir="${esc(p.profileDir)}">🚀 Launch / Focus Chrome</button>
            <button class="btn" data-act="openHitLimit" data-id="${p.id}">⏱️ Hit Limit</button>
            <button class="btn" data-act="markReady" data-id="${p.id}">✓ Mark Ready</button>
          </div>

          <!-- Quick Limit Preset Chips -->
          <div>
            <label>Quick Cooldown Presets:</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="0.5">30 min</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="1">1 hour</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="2">2 hours</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="3">3 hours (Standard)</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="5">5 hours (Claude)</button>
              <button class="btn sm" data-act="quickLimit" data-id="${p.id}" data-h="24">24 hours</button>
            </div>
          </div>

          <!-- Profile Info Fields -->
          <div class="row2">
            <label>Purpose / Project
              <input id="pPurpose" value="${esc(p.purpose || '')}" placeholder="e.g. Dissertation / Teaching">
            </label>
            <label>Plan / Tier
              <input id="pPlan" value="${esc(p.plan || '')}" placeholder="e.g. ChatGPT Plus / Free">
            </label>
          </div>

          <!-- Pending Tasks -->
          <div>
            <label>Pending Work for this Profile (${todos.length})</label>
            <div style="margin-top:4px;display:grid;gap:6px;">
              ${todos.map(td => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#0e1833;border-radius:8px;border:1px solid var(--line);">
                  <button class="btn sm" data-act="toggleTodo" data-id="${p.id}" data-tid="${td.id}">${td.done ? '☑' : '☐'}</button>
                  <span style="flex:1;${td.done ? 'text-decoration:line-through;opacity:.6;' : ''}">${esc(td.text)}</span>
                  <button class="x" data-act="delTodo" data-id="${p.id}" data-tid="${td.id}">✕</button>
                </div>
              `).join('')}
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input id="newTodoIn" placeholder="Add a pending task, press Enter">
                <button class="btn sm pri" data-act="addTodo" data-id="${p.id}">Add</button>
              </div>
            </div>
          </div>
        </div>
        <div class="mf">
          <button class="btn ghost" data-act="closePanel">Close</button>
        </div>
      </div>
    `;
  }

  function closePanel() {
    panelId = null;
    const el = document.getElementById('panelModal');
    if (el) el.remove();
  }

  // --- Limit Dialog Modal ---
  function openLimitDialog(pid) {
    const p = S.profiles.find(x => x.id === pid || x.profileDir === pid);
    if (!p) return;

    const f = openGenericModal('Hit Limit · ' + p.name, `
      <div class="row2">
        <label>Limit hit at
          <input type="datetime-local" id="hitTime" value="${toLocalInput(now())}">
        </label>
        <label>Wait Duration (hours)
          <input type="number" id="waitHours" min="0.1" step="0.5" value="3.0">
        </label>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:4px 0;">
        ${[['30m', 0.5], ['1h', 1], ['2h', 2], ['3h', 3], ['5h', 5], ['24h', 24]].map(c => `
          <button type="button" class="btn sm" data-set-h="${c[1]}">${c[0]}</button>
        `).join('')}
      </div>
      <div class="calc-box" id="calcBox"></div>
      <label>What are you waiting on / pending task? (optional)
        <input id="limitTask" placeholder="e.g. Chapter 3 citations check">
      </label>
    `, () => {
      const hrs = Number($('#waitHours').value) || 3;
      const task = $('#limitTask').value;
      sendAction('hitLimit', { id: p.id, hours: hrs, task });
      toast(`⏱️ Cooldown set for <b>${esc(p.name)}</b> (${hrs}h)`);
    }, 'Start Cooldown');

    const updateCalc = () => {
      const hit = new Date($('#hitTime').value).getTime() || now();
      const hrs = Number($('#waitHours').value) || 0;
      const readyAt = hit + hrs * 3600000;
      $('#calcBox').textContent = `Ready at ${fmtAt(readyAt)} · in ${fmtDur(readyAt - now())}`;
    };

    $('#hitTime').addEventListener('input', updateCalc);
    $('#waitHours').addEventListener('input', updateCalc);
    f.querySelectorAll('[data-set-h]').forEach(b => {
      b.addEventListener('click', () => {
        $('#waitHours').value = b.dataset.setH;
        updateCalc();
      });
    });
    updateCalc();
  }

  function openGenericModal(title, bodyHtml, onSave, saveLabel = 'Save') {
    closeGenericModal();
    const m = document.createElement('div');
    m.className = 'ov';
    m.innerHTML = `
      <form class="modal">
        <div class="mh">
          <h3>${esc(title)}</h3>
          <button type="button" class="x" data-act="closeGenericModal">✕</button>
        </div>
        <div class="mb">${bodyHtml}</div>
        <div class="mf">
          <button type="button" class="btn ghost" data-act="closeGenericModal">Cancel</button>
          <button class="btn pri">${esc(saveLabel)}</button>
        </div>
      </form>
    `;
    document.body.appendChild(m);
    modalEl = m;
    const f = m.querySelector('form');
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      onSave();
      closeGenericModal();
    });
    return f;
  }

  function closeGenericModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
  }

  function toLocalInput(ts) {
    const d = new Date(ts);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function pname(id) {
    const p = S.profiles.find(x => x.id === id || x.profileDir === id);
    return p ? p.name : 'Any profile';
  }

  function updateCountdowns() {
    document.querySelectorAll('[data-cd]').forEach(el => {
      const target = Number(el.dataset.cd);
      el.textContent = fmtDur(target - now());
    });
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
    const dir = btn.dataset.dir;

    if (act === 'launchAdv') {
      launchOrFocus(dir);
    } else if (act === 'copyAdvText') {
      const adv = advise(now());
      if (adv && adv.text) copyText(adv.text);
    } else if (act === 'openPanel') {
      panelId = id;
      drawPanel();
    } else if (act === 'closePanel') {
      closePanel();
    } else if (act === 'closeGenericModal') {
      closeGenericModal();
    } else if (act === 'openHitLimit') {
      openLimitDialog(id);
    } else if (act === 'quickLimit') {
      const hrs = Number(btn.dataset.h) || 3;
      sendAction('hitLimit', { id, hours: hrs, task: '' });
      toast(`⏱️ Cooldown set (${hrs}h)`);
    } else if (act === 'markReady') {
      sendAction('markReady', { id });
      toast(`✅ Marked ready!`);
    } else if (act === 'addTodo') {
      const inp = $('#newTodoIn');
      if (inp && inp.value.trim()) {
        sendAction('addTodo', { id, text: inp.value.trim() });
        inp.value = '';
      }
    } else if (act === 'toggleTodo') {
      sendAction('toggleTodo', { id, todoId: btn.dataset.tid });
    } else if (act === 'delTodo') {
      sendAction('delTodo', { id, todoId: btn.dataset.tid });
    } else if (act === 'copyPrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) copyText(pr.text || '');
    } else if (act === 'startPrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) { pr.status = 'doing'; sendAction('saveFullState', { state: S }); render(); }
    } else if (act === 'donePrompt') {
      const pr = S.prompts.find(x => x.id === id);
      if (pr) { pr.status = 'done'; sendAction('saveFullState', { state: S }); render(); }
    } else if (act === 'delPrompt') {
      S.prompts = S.prompts.filter(x => x.id !== id);
      sendAction('saveFullState', { state: S });
      render();
    } else if (act === 'copyHandoff') {
      const h = S.handoffs.find(x => x.id === id);
      if (h) copyText(h.prompt || `Continue task: ${h.title}\nDone: ${h.done}\nNext: ${h.next}`);
    } else if (act === 'resolveHandoff') {
      const h = S.handoffs.find(x => x.id === id);
      if (h) { h.resolved = true; sendAction('saveFullState', { state: S }); render(); }
    } else if (act === 'delHandoff') {
      S.handoffs = S.handoffs.filter(x => x.id !== id);
      sendAction('saveFullState', { state: S });
      render();
    } else if (act === 'toggleDeadline') {
      const d = S.deadlines.find(x => x.id === id);
      if (d) { d.done = !d.done; sendAction('saveFullState', { state: S }); render(); }
    } else if (act === 'delDeadline') {
      S.deadlines = S.deadlines.filter(x => x.id !== id);
      sendAction('saveFullState', { state: S });
      render();
    } else if (act === 'newPrompt') {
      openGenericModal('New Prompt', `
        <label>Title<input id="npt" required placeholder="e.g. Write Grade 8 ST2 test"></label>
        <div class="row2">
          <label>Project<input id="npp" placeholder="e.g. Term 2 Tests"></label>
          <label>Priority
            <select id="npri">
              <option value="high">High</option>
              <option value="med" selected>Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <label>Best Profile
          <select id="npprof">
            <option value="">Any Profile</option>
            ${S.profiles.map(p => `<option value="${p.id}">#${p.taskbarNo || '?'} ${esc(p.name)}</option>`).join('')}
          </select>
        </label>
        <label>Prompt Text
          <textarea id="nptext" style="min-height:120px;" placeholder="Full paste-ready prompt..."></textarea>
        </label>
      `, () => {
        S.prompts.push({
          id: uid(),
          title: $('#npt').value.trim(),
          project: $('#npp').value.trim(),
          priority: $('#npri').value,
          profileId: $('#npprof').value,
          text: $('#nptext').value,
          status: 'queued',
          createdAt: now()
        });
        sendAction('saveFullState', { state: S });
        render();
      }, 'Add Prompt');
    } else if (act === 'newHandoff') {
      openGenericModal('New Handoff Card', `
        <label>Task Title<input id="hTitle" required placeholder="e.g. Chapter 3 Methodology"></label>
        <label>Profile
          <select id="hProf">
            ${S.profiles.map(p => `<option value="${p.id}">#${p.taskbarNo || '?'} ${esc(p.name)}</option>`).join('')}
          </select>
        </label>
        <label>Done So Far<textarea id="hDone" placeholder="Sections 3.1 and 3.2 drafted..."></textarea></label>
        <label>Next Step<textarea id="hNext" placeholder="Refine 3.3 sampling framework..."></textarea></label>
        <label>Paste-ready Continuation Prompt<textarea id="hPrompt" style="min-height:100px;" placeholder="Resume from Section 3.3..."></textarea></label>
      `, () => {
        S.handoffs.push({
          id: uid(),
          title: $('#hTitle').value.trim(),
          profileId: $('#hProf').value,
          done: $('#hDone').value,
          next: $('#hNext').value,
          prompt: $('#hPrompt').value,
          resolved: false,
          createdAt: now()
        });
        sendAction('saveFullState', { state: S });
        render();
      }, 'Save Handoff');
    } else if (act === 'newDeadline') {
      openGenericModal('New Deadline', `
        <label>Deliverable Title<input id="dTitle" required placeholder="e.g. Submission to DepEd"></label>
        <div class="row2">
          <label>Due Date<input type="date" id="dDue" required></label>
          <label>Estimated Hours<input type="number" id="dHours" min="0" step="0.5" value="4.0"></label>
        </div>
        <label>Matching Project Name<input id="dProj" placeholder="e.g. Term 2 Tests"></label>
      `, () => {
        S.deadlines.push({
          id: uid(),
          title: $('#dTitle').value.trim(),
          due: $('#dDue').value,
          hours: Number($('#dHours').value) || 0,
          project: $('#dProj').value.trim(),
          done: false
        });
        sendAction('saveFullState', { state: S });
        render();
      }, 'Add Deadline');
    }
  });

  // Re-scan Taskbar Button
  $('#btnRefresh').addEventListener('click', () => {
    toast('🔄 Re-scanning taskbar shortcuts...');
    sendAction('refreshProfiles', {});
  });

  // Init
  connectWS();
  fetchState();
  setInterval(updateCountdowns, 1000);
})();
