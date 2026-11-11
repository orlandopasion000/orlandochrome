/* Chrome Taskbar Notes - Messenger Style
 * Direct, simple, compressed note-taking for your 21 taskbar Chrome profiles
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();

  const STORAGE_KEY = 'chrome_taskbar_messenger_notes_v1';

  // The 21 Chrome Profiles in order from Windows Taskband
  const DEFAULT_PROFILES = [
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", emoji: "🌐", timerUntil: null, notes: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", emoji: "🎓", timerUntil: null, notes: [
      { id: "n_init_1", text: "Draft Grade 8 ST2 Test & Table of Specifications", done: false, createdAt: now() }
    ]},
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", emoji: "📘", timerUntil: null, notes: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", emoji: "📊", timerUntil: null, notes: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "Hero", email: "heroesmeraldaepicalu@gmail.com", emoji: "🧠", timerUntil: null, notes: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 A Yify", email: "yifyyts7@gmail.com", emoji: "🎯", timerUntil: null, notes: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 B NASH", email: "revnash0@gmail.com", emoji: "📝", timerUntil: null, notes: [
      { id: "n_init_2", text: "Prepare Youth Devotion Slide Deck for Sunday", done: false, createdAt: now() }
    ]},
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Slot #10", name: "A4 C Gwapo", email: "gwapocpogi@gmail.com", emoji: "📊", timerUntil: null, notes: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Slot #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", emoji: "📘", timerUntil: null, notes: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Slot #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", emoji: "🏫", timerUntil: null, notes: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Slot #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", emoji: "⚡", timerUntil: null, notes: [
      { id: "n_init_3", text: "Revise Chapter 3 Instrumentation & Sampling Framework", done: false, createdAt: now() }
    ]},
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Slot #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", emoji: "📘", timerUntil: null, notes: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Slot #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", emoji: "🎯", timerUntil: null, notes: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Slot #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", emoji: "🧠", timerUntil: null, notes: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Slot #17", name: "A6 scite003 Gold Cloud", email: "goldcloudblack@gmail.com", emoji: "📝", timerUntil: null, notes: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Slot #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", emoji: "🛠️", timerUntil: null, notes: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Slot #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", emoji: "🧮", timerUntil: null, notes: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Slot #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", emoji: "🎓", timerUntil: null, notes: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Slot #21", name: "pogiorlandopasion", email: "pogiorlandopasion@gmail.com", emoji: "📚", timerUntil: null, notes: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Slot #22", name: "watchonlineapple", email: "watchonlineapple@gmail.com", emoji: "🏫", timerUntil: null, notes: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Slot #23", name: "grammarly", email: "grammarlyquillbot001@gmail.com", emoji: "💡", timerUntil: null, notes: [] }
  ];

  function loadState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}

    // Migration of any existing tasks from previous keys
    const notesByDir = {};
    ['chrome_real_taskbar_tracker_v5', 'chrome_taskbar_tracker_v4', 'chrome_taskbar_cc_state_v3'].forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const old = JSON.parse(raw);
          (old.profiles || []).forEach(p => {
            const list = p.todos || p.notes || [];
            if (p.profileDir && list.length && !notesByDir[p.profileDir]) {
              notesByDir[p.profileDir] = list;
            }
          });
        }
      } catch (_) {}
    });

    if (!saved || !saved.profiles || !saved.profiles.length) {
      saved = { profiles: DEFAULT_PROFILES };
      saved.profiles.forEach(p => {
        if (notesByDir[p.profileDir]) {
          p.notes = notesByDir[p.profileDir];
        }
      });
    } else {
      const existingMap = {};
      saved.profiles.forEach(p => { existingMap[p.profileDir] = p; });
      saved.profiles = DEFAULT_PROFILES.map(dp => {
        const ex = existingMap[dp.profileDir];
        if (ex) {
          return Object.assign({}, dp, {
            notes: (ex.notes && ex.notes.length) ? ex.notes : (notesByDir[dp.profileDir] || dp.notes),
            timerUntil: ex.timerUntil || null
          });
        }
        return dp;
      });
    }

    return saved;
  }

  let S = loadState();
  let selectedId = "p_tb_4"; // Default to DepEd (Chrome #2) or first with pending notes
  let currentFilter = 'all'; // 'all', 'pending'
  let searchQuery = '';

  // Select first profile with pending note if any
  const firstWithNotes = S.profiles.find(p => p.notes && p.notes.some(n => !n.done));
  if (firstWithNotes) selectedId = firstWithNotes.id;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('Save error:', e);
    }
  }

  function getPendingNotes(p) {
    return (p.notes || []).filter(n => !n.done);
  }

  function fmtTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function fmtDur(ms) {
    if (ms <= 0) return 'Timer Done';
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return `${m}m ${sec}s`;
  }

  function toast(html, dur = 3200) {
    const wrap = $('#toast');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerHTML = html;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(6px)';
      setTimeout(() => t.remove(), 250);
    }, dur);
  }

  // --- Rendering ---

  function render() {
    renderHeaderStats();
    renderSidebarList();
    renderChatPane();
  }

  function renderHeaderStats() {
    const pendingProfiles = S.profiles.filter(p => getPendingNotes(p).length > 0);
    const totalPendingNotes = S.profiles.reduce((sum, p) => sum + getPendingNotes(p).length, 0);

    const el = $('#headerStats');
    if (!el) return;

    if (totalPendingNotes > 0) {
      el.innerHTML = `
        <div class="header-pill pending">
          <span>🔴</span>
          <span><b>${pendingProfiles.length}</b> Chromes have pending notes (${totalPendingNotes} total)</span>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="header-pill clean">
          <span>✓</span>
          <span>All notes completed!</span>
        </div>
      `;
    }

    const countLabel = $('#pendingCountLabel');
    if (countLabel) countLabel.textContent = pendingProfiles.length;
  }

  function renderSidebarList() {
    const listEl = $('#chromeList');
    if (!listEl) return;

    const q = searchQuery.toLowerCase().trim();

    let list = S.profiles.filter(p => {
      const pending = getPendingNotes(p);
      if (currentFilter === 'pending' && pending.length === 0) return false;

      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesEmail = (p.email || '').toLowerCase().includes(q);
        const matchesSlot = String(p.taskbarSlot).includes(q);
        const matchesShortcut = p.winShortcut.toLowerCase().includes(q);
        const matchesNote = (p.notes || []).some(n => n.text.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesSlot && !matchesShortcut && !matchesNote) return false;
      }

      return true;
    });

    if (!list.length) {
      listEl.innerHTML = `
        <div style="padding:24px 16px;text-align:center;color:var(--tx-muted);font-size:12.5px;">
          No Chrome profiles match your search.
        </div>
      `;
      return;
    }

    listEl.innerHTML = list.map(p => {
      const pending = getPendingNotes(p);
      const isSelected = (p.id === selectedId);
      const lastNote = pending.length ? pending[pending.length - 1] : (p.notes && p.notes.length ? p.notes[p.notes.length - 1] : null);

      let snippetText = 'No notes yet';
      let isHighlight = false;
      if (pending.length) {
        snippetText = `📌 ${lastNote.text}`;
        isHighlight = true;
      } else if (lastNote) {
        snippetText = `✓ ${lastNote.text}`;
      }

      const tag = p.taskbarSlot <= 9 ? `W+${p.taskbarSlot}` : `#${p.taskbarSlot}`;

      return `
        <div class="chrome-item ${isSelected ? 'active' : ''} ${pending.length ? 'has-pending-tasks' : ''}" data-select-id="${p.id}">
          <div class="item-avatar-wrap">
            <div class="item-avatar">${esc(p.emoji || '🌐')}</div>
            <div class="item-slot-tag">${tag}</div>
          </div>
          <div class="item-content">
            <div class="item-row1">
              <span class="item-name">${esc(p.name)}</span>
              <span class="item-shortcut">${esc(p.winShortcut)}</span>
            </div>
            <div class="item-snippet ${isHighlight ? 'highlight' : ''}">${esc(snippetText)}</div>
          </div>
          ${pending.length ? `<span class="item-badge">${pending.length}</span>` : ''}
        </div>
      `;
    }).join('');
  }

  function renderChatPane() {
    const pane = $('#chatPane');
    if (!pane) return;

    const p = S.profiles.find(x => x.id === selectedId);
    if (!p) {
      pane.innerHTML = `<div class="empty-notes-view"><span class="empty-icon">💬</span><p>Select a Chrome profile on the left</p></div>`;
      return;
    }

    const notes = p.notes || [];
    const pending = getPendingNotes(p);
    const t = now();
    const hasTimer = (p.timerUntil && p.timerUntil > t);

    // Header HTML
    const headerHtml = `
      <div class="chat-header">
        <div class="chat-header-left">
          <div class="chat-avatar">${esc(p.emoji || '🌐')}</div>
          <div class="chat-title-group">
            <h2>Chrome #${p.chromeNo}: ${esc(p.name)}</h2>
            <p>${esc(p.email || p.profileDir)} · Taskbar Slot #${p.taskbarSlot}</p>
          </div>
        </div>
        <div class="chat-header-right">
          <div class="shortcut-pill" title="Press this shortcut on your keyboard to switch to this Chrome">
            <span>Shortcut:</span>
            <kbd>${esc(p.winShortcut)}</kbd>
          </div>
          <button class="btn-util" data-act="copyName" data-name="${esc(p.name)}">📋 Copy Name</button>
        </div>
      </div>
    `;

    // Optional Cooldown Bar
    let timerBarHtml = '';
    if (hasTimer) {
      timerBarHtml = `
        <div class="cooldown-bar">
          <div class="cooldown-info">
            <span>⏳ Cooldown Active:</span>
            <b data-cd="${p.timerUntil}">${fmtDur(p.timerUntil - t)} remaining</b>
          </div>
          <button class="btn-timer" data-act="clearTimer" data-pid="${p.id}">✕ Clear Timer</button>
        </div>
      `;
    } else {
      timerBarHtml = `
        <div class="cooldown-bar" style="background:rgba(255,255,255,0.02);border-color:var(--border);">
          <span style="font-size:11.5px;color:var(--tx-sub);">Hit AI limit? Start a quick timer:</span>
          <div class="cooldown-presets">
            <button class="btn-timer" data-act="setTimer" data-pid="${p.id}" data-h="0.5">30m</button>
            <button class="btn-timer" data-act="setTimer" data-pid="${p.id}" data-h="1">1h</button>
            <button class="btn-timer" data-act="setTimer" data-pid="${p.id}" data-h="2">2h</button>
            <button class="btn-timer" data-act="setTimer" data-pid="${p.id}" data-h="3">3h</button>
            <button class="btn-timer" data-act="setTimer" data-pid="${p.id}" data-h="5">5h</button>
          </div>
        </div>
      `;
    }

    // Notes list HTML
    let streamHtml = '';
    if (!notes.length) {
      streamHtml = `
        <div class="empty-notes-view">
          <span class="empty-icon">📝</span>
          <b style="color:var(--tx);">No notes for Chrome #${p.chromeNo} (${esc(p.name)})</b>
          <p style="font-size:12.5px;">Type a note or pending task in the box below to remember what to do.</p>
        </div>
      `;
    } else {
      streamHtml = notes.map(n => {
        const isDone = !!n.done;
        return `
          <div class="note-bubble-row">
            <div class="note-bubble ${isDone ? 'done-bubble' : 'pending-bubble'}">
              <span class="note-text">${esc(n.text)}</span>
              <div class="note-actions">
                <button class="btn-note-action done-btn" data-act="toggleNote" data-pid="${p.id}" data-nid="${n.id}" title="${isDone ? 'Reopen' : 'Mark finished'}">
                  ${isDone ? '↩ Reopen' : '✓ Done'}
                </button>
                <button class="btn-note-action del-btn" data-act="delNote" data-pid="${p.id}" data-nid="${n.id}" title="Delete note">🗑️</button>
              </div>
            </div>
            <span class="note-meta">${fmtTime(n.createdAt)} ${isDone ? '· Completed' : '· Pending'}</span>
          </div>
        `;
      }).join('');
    }

    // Composer HTML (Messenger Style Input at bottom)
    const composerHtml = `
      <form class="chat-composer" id="composerForm" data-pid="${p.id}">
        <input type="text" class="composer-input" id="noteInput" placeholder="💬 Type a note or pending task for ${esc(p.name)} (Press Enter to add)..." autofocus autocomplete="off">
        <button type="submit" class="btn-send">Add ✈️</button>
      </form>
    `;

    pane.innerHTML = `
      ${headerHtml}
      <div class="notes-stream" id="notesStream">
        ${timerBarHtml}
        ${streamHtml}
      </div>
      ${composerHtml}
    `;

    // Scroll stream to bottom
    const streamEl = document.getElementById('notesStream');
    if (streamEl) {
      streamEl.scrollTop = streamEl.scrollHeight;
    }

    // Hook up composer form submit
    const form = document.getElementById('composerForm');
    if (form) {
      form.onsubmit = ev => {
        ev.preventDefault();
        const inp = document.getElementById('noteInput');
        if (inp && inp.value.trim()) {
          p.notes = p.notes || [];
          p.notes.push({
            id: uid(),
            text: inp.value.trim(),
            done: false,
            createdAt: now()
          });
          inp.value = '';
          save();
          render();
          toast(`📝 Note saved for <b>${esc(p.name)}</b>`);
        }
      };
    }
  }

  function updateTimers() {
    const t = now();
    document.querySelectorAll('[data-cd]').forEach(el => {
      const target = Number(el.dataset.cd);
      el.textContent = `${fmtDur(target - t)} remaining`;
    });

    let changed = false;
    S.profiles.forEach(p => {
      if (p.timerUntil && p.timerUntil <= t) {
        p.timerUntil = null;
        changed = true;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        toast(`🔔 <b>Chrome #${p.chromeNo} (${esc(p.name)})</b> cooldown timer finished!`);
      }
    });

    if (changed) {
      save();
      render();
    }
  }

  // --- Event Listeners ---

  document.addEventListener('click', ev => {
    // Select Chrome profile from sidebar
    const item = ev.target.closest('[data-select-id]');
    if (item) {
      selectedId = item.dataset.selectId;
      render();
      const inp = document.getElementById('noteInput');
      if (inp) inp.focus();
      return;
    }

    // Filter tabs
    const filterBtn = ev.target.closest('[data-filter]');
    if (filterBtn) {
      currentFilter = filterBtn.dataset.filter;
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');
      renderSidebarList();
      return;
    }

    // Action buttons
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;

    const act = btn.dataset.act;
    const pid = btn.dataset.pid;
    const nid = btn.dataset.nid;
    const p = S.profiles.find(x => x.id === pid);

    if (act === 'copyName') {
      const name = btn.dataset.name;
      try {
        navigator.clipboard.writeText(name);
        toast(`📋 Copied "${name}" to clipboard`);
      } catch (_) {}
    } else if (act === 'toggleNote') {
      if (p && p.notes) {
        const n = p.notes.find(x => x.id === nid);
        if (n) {
          n.done = !n.done;
          save();
          render();
          toast(n.done ? `✓ Note marked finished` : `↩ Note reopened`);
        }
      }
    } else if (act === 'delNote') {
      if (p && p.notes) {
        p.notes = p.notes.filter(x => x.id !== nid);
        save();
        render();
        toast(`🗑️ Note deleted`);
      }
    } else if (act === 'setTimer') {
      const h = Number(btn.dataset.h) || 3;
      if (p) {
        p.timerUntil = now() + h * 3600000;
        save();
        render();
        toast(`⏱️ Timer set for ${h}h on ${esc(p.name)}`);
      }
    } else if (act === 'clearTimer') {
      if (p) {
        p.timerUntil = null;
        save();
        render();
        toast(`Timer cleared`);
      }
    }
  });

  // Search input live filtering
  const sInp = $('#searchInput');
  if (sInp) {
    sInp.addEventListener('input', ev => {
      searchQuery = ev.target.value;
      renderSidebarList();
    });
  }

  // Initial render & 1-second interval
  render();
  setInterval(updateTimers, 1000);
})();
