const fs = require('fs');
const path = require('path');
const { scanProfiles } = require('./profileScanner');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

function defaultState() {
  return {
    version: 1,
    updatedAt: Date.now(),
    settings: {
      defaultResetH: 3.0,
      dailyH: 4.0,
      slotMin: 60,
      dayStart: '08:00',
      dayEnd: '18:00',
      sound: true,
      autoOpenNext: false,
      ntfyOn: false,
      ntfyTopic: ''
    },
    profiles: [],
    prompts: [],
    handoffs: [],
    deadlines: [],
    files: [],
    connectedClients: {} // profileDir -> { lastSeen, url, title, isFocused }
  };
}

class StateStore {
  constructor() {
    this.state = defaultState();
    this.saveTimeout = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STATE_FILE)) {
      try {
        const raw = fs.readFileSync(STATE_FILE, 'utf8');
        const loaded = JSON.parse(raw);
        this.state = Object.assign(defaultState(), loaded);
      } catch (e) {
        console.warn('[stateStore] Could not read existing state.json, initializing fresh:', e.message);
      }
    }

    // Auto-discover and merge profiles
    this.refreshProfiles(false);
  }

  refreshProfiles(saveNow = true) {
    const scanned = scanProfiles();
    const existingMap = {};
    for (const p of this.state.profiles) {
      existingMap[p.profileDir] = p;
    }

    const merged = [];
    for (const s of scanned) {
      const ex = existingMap[s.profileDir];
      if (ex) {
        // Keep existing taskbar number, name, and user data if preserved
        merged.push({
          ...s,
          ...ex,
          isPinned: s.isPinned,
          shortcutPath: s.shortcutPath || ex.shortcutPath,
          taskbarNo: s.taskbarNo !== null ? s.taskbarNo : ex.taskbarNo,
          email: s.email || ex.email,
          chromeName: s.chromeName || ex.chromeName,
          name: ex.name || s.name
        });
      } else {
        merged.push(s);
      }
    }

    // Sort pinned first
    merged.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (a.taskbarNo || 999) - (b.taskbarNo || 999);
    });

    this.state.profiles = merged;
    if (saveNow) this.save();
  }

  save() {
    this.state.updatedAt = Date.now();
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2), 'utf8');
      } catch (e) {
        console.error('[stateStore] Failed to write state.json:', e);
      }
    }, 150);
  }

  getSnapshot() {
    return this.state;
  }

  findProfile(idOrDir) {
    return this.state.profiles.find(p => p.id === idOrDir || p.profileDir === idOrDir);
  }

  hitLimit(id, waitMs, taskText = '') {
    const p = this.findProfile(id);
    if (!p) return null;

    const readyAt = Date.now() + waitMs;
    p.status = 'waiting';
    p.readyAt = readyAt;
    p.notifiedFor = null;

    if (taskText && taskText.trim()) {
      p.todos = p.todos || [];
      p.todos.push({
        id: Math.random().toString(36).slice(2, 9),
        text: taskText.trim(),
        done: false,
        createdAt: Date.now()
      });
      p.task = taskText.trim();
    }

    this.save();
    return p;
  }

  markReady(id) {
    const p = this.findProfile(id);
    if (!p) return null;

    p.status = 'ready';
    p.readyAt = null;
    p.notifiedFor = null;
    this.save();
    return p;
  }

  setRunning(id, task = '') {
    const p = this.findProfile(id);
    if (!p) return null;

    p.status = 'running';
    p.readyAt = null;
    if (task) p.task = task;
    this.save();
    return p;
  }

  updateProfile(id, updates) {
    const p = this.findProfile(id);
    if (!p) return null;

    Object.assign(p, updates);
    this.save();
    return p;
  }

  addTodo(id, text) {
    const p = this.findProfile(id);
    if (!p) return null;

    p.todos = p.todos || [];
    const todo = {
      id: Math.random().toString(36).slice(2, 9),
      text: text.trim(),
      done: false,
      createdAt: Date.now()
    };
    p.todos.push(todo);
    this.save();
    return todo;
  }

  toggleTodo(id, todoId) {
    const p = this.findProfile(id);
    if (!p || !p.todos) return null;

    const todo = p.todos.find(t => t.id === todoId);
    if (todo) {
      todo.done = !todo.done;
      this.save();
    }
    return todo;
  }

  deleteTodo(id, todoId) {
    const p = this.findProfile(id);
    if (!p || !p.todos) return null;

    p.todos = p.todos.filter(t => t.id !== todoId);
    this.save();
    return true;
  }

  // Extension heartbeats
  recordExtensionActivity(profileDir, tabInfo) {
    this.state.connectedClients = this.state.connectedClients || {};
    this.state.connectedClients[profileDir] = {
      lastSeen: Date.now(),
      url: tabInfo.url || '',
      title: tabInfo.title || '',
      isFocused: !!tabInfo.isFocused
    };

    const p = this.findProfile(profileDir);
    if (p) {
      p.lastSeen = Date.now();
      if (tabInfo.isFocused && p.status === 'ready') {
        p.status = 'running';
      }
    }
    this.save();
  }
}

module.exports = new StateStore();
