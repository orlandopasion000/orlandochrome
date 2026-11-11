const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { WebSocketServer } = require('ws');

const stateStore = require('./stateStore');
const { launchProfile, getRunningProfiles, focusProfile } = require('./windowManager');

const PORT = process.env.PORT || 48100;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// MIME types for static assets
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- API Routes ---
  if (pathname === '/api/state' && req.method === 'GET') {
    getRunningProfiles().then(runningMap => {
      const state = stateStore.getSnapshot();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ...state, runningProfiles: runningMap }));
    });
    return;
  }

  if (pathname === '/api/launch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const pdir = data.profileDir;
        const targetUrl = data.url || '';
        const profile = stateStore.findProfile(pdir);
        
        if (!pdir) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Missing profileDir' }));
        }

        const targetProfile = profile || stateStore.findProfile(data.id);
        const result = await focusProfile(pdir, targetProfile);
        broadcast({ type: 'profile_launched', profileDir: pdir });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { action, data } = payload;
        handleAction(action, data, res);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (pathname === '/api/extension/event' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const evt = JSON.parse(body || '{}');
        if (evt.profileDir) {
          stateStore.recordExtensionActivity(evt.profileDir, evt);
          broadcast({ type: 'extension_event', event: evt });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- Static Files ---
  let safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Setup WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === 1) { // OPEN
      client.send(msg);
    }
  }
}

wss.on('connection', (ws, req) => {
  console.log(`[ws] Client connected from ${req.socket.remoteAddress}`);

  // Send full state immediately on connect
  getRunningProfiles().then(runningMap => {
    ws.send(JSON.stringify({
      type: 'initial_state',
      state: { ...stateStore.getSnapshot(), runningProfiles: runningMap }
    }));
  });

  ws.on('message', raw => {
    try {
      const msg = JSON.parse(raw.toString());
      
      // Extension heartbeat or message
      if (msg.type === 'extension_hello') {
        stateStore.recordExtensionActivity(msg.profileDir, msg);
        broadcast({ type: 'extension_connected', profileDir: msg.profileDir });
      } else if (msg.type === 'limit_hit') {
        const p = stateStore.hitLimit(msg.profileDir, msg.waitMs || 3 * 3600000, msg.task || '');
        broadcast({ type: 'state_updated', state: stateStore.getSnapshot() });
      } else if (msg.type === 'action') {
        handleAction(msg.action, msg.data);
      }
    } catch (e) {
      console.warn('[ws] Malformed message:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('[ws] Client disconnected');
  });
});

function handleAction(action, data, res) {
  let result = { ok: true };

  switch (action) {
    case 'hitLimit': {
      const waitMs = (Number(data.hours) || 3) * 3600000;
      result.profile = stateStore.hitLimit(data.id, waitMs, data.task);
      break;
    }
    case 'markReady': {
      result.profile = stateStore.markReady(data.id);
      break;
    }
    case 'startWork': {
      result.profile = stateStore.setRunning(data.id, data.task);
      break;
    }
    case 'saveProfile': {
      result.profile = stateStore.updateProfile(data.id, data.updates);
      break;
    }
    case 'addTodo': {
      result.todo = stateStore.addTodo(data.id, data.text);
      break;
    }
    case 'toggleTodo': {
      result.todo = stateStore.toggleTodo(data.id, data.todoId);
      break;
    }
    case 'delTodo': {
      result.ok = stateStore.deleteTodo(data.id, data.todoId);
      break;
    }
    case 'refreshProfiles': {
      stateStore.refreshProfiles(true);
      result.profiles = stateStore.getSnapshot().profiles;
      break;
    }
    case 'saveSettings': {
      stateStore.state.settings = Object.assign(stateStore.state.settings, data.settings);
      stateStore.save();
      break;
    }
    case 'saveFullState': {
      stateStore.state = Object.assign(stateStore.state, data.state);
      stateStore.save();
      break;
    }
    default:
      console.warn('[server] Unknown action:', action);
  }

  broadcast({ type: 'state_updated', state: stateStore.getSnapshot() });

  if (res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }
}

// Background ticker for cooldown checking & process monitoring
setInterval(async () => {
  const state = stateStore.getSnapshot();
  const now = Date.now();
  let hasReadyChange = false;

  for (const p of state.profiles) {
    if (p.status === 'waiting' && p.readyAt && p.readyAt <= now && p.notifiedFor !== p.readyAt) {
      p.notifiedFor = p.readyAt;
      p.status = 'ready';
      hasReadyChange = true;
      
      broadcast({
        type: 'profile_ready_alert',
        profile: p,
        message: `${p.name} (Taskbar #${p.taskbarNo || '?'}) is ready!`
      });
    }
  }

  if (hasReadyChange) {
    stateStore.save();
    const running = await getRunningProfiles();
    broadcast({ type: 'state_updated', state: { ...stateStore.getSnapshot(), runningProfiles: running } });
  }
}, 3000);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Chrome Taskbar Command Center & Live Waitboard`);
  console.log(`📡 Local Server: http://127.0.0.1:${PORT}`);
  console.log(`⚡ WebSocket Hub: ws://127.0.0.1:${PORT}/ws`);
  console.log(`======================================================\n`);
});

module.exports = server;
