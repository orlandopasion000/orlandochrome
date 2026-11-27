import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { spawn } from 'node:child_process';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ARTIFACT_DIR = 'C:\\Users\\Orlando\\.gemini\\antigravity\\brain\\15adc93a-4633-48b3-91ab-72d7cbd3f039';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
    srv.on('error', reject);
  });
}

function startStaticServer() {
  const httpErrors = [];
  const server = http.createServer((req, res) => {
    const cleanUrl = (req.url || '/').split('?')[0];
    const rel = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT_DIR, rel);
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404); res.end('Not found');
        if (!cleanUrl.includes('favicon') && !cleanUrl.startsWith('/avatars/')) httpErrors.push(`404 ${req.url}`);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port, httpErrors }));
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }
  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method && this.listeners.has(msg.method)) {
        for (const fn of this.listeners.get(msg.method)) fn(msg.params);
      }
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evalExpr(expr) {
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(`JS Exception: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }
  close() { try { this.ws.close(); } catch {} }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const { server, port, httpErrors } = await startStaticServer();
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v412-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
    } catch {}
    await sleep(150);
  }
  if (!wsUrl) throw new Error('Chrome CDP did not start');

  const cdp = new CDPClient(wsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const pageErrors = [];
  cdp.on('Runtime.exceptionThrown', (p) => pageErrors.push(p.exceptionDetails?.text || 'exception'));

  const results = [];
  const realms = [
    { key: 'realm', label: 'dynamo', buffName: 'FARADAY AEGIS', tier: 6, w: 1280, h: 720, out: 'v412_shield_dynamo.png' },
    { key: 'helix', label: 'helix', buffName: 'PRISM AEGIS', tier: 6, w: 1280, h: 720, out: 'v412_shield_helix.png' },
    { key: 'meteor', label: 'meteor', buffName: 'CALDERA BULWARK', tier: 6, w: 1280, h: 720, out: 'v412_shield_meteor.png' },
    { key: 'meteor', label: 'meteor_mobile', buffName: 'CALDERA BULWARK', tier: 4, w: 390, h: 844, out: 'v412_shield_mobile_portrait.png' }
  ];

  for (const r of realms) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: r.w, height: r.h, deviceScaleFactor: 2, mobile: r.w < 500
    });
    const url = `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=${r.tier}`;
    await cdp.send('Page.navigate', { url });
    for (let t = 0; t < 40; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(150);
    }
    await sleep(600);

    const check = await cdp.evalExpr(`(async () => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      const kin = api.getKinematics();
      const cv = document.getElementById('chromeGameCanvas');
      const dpr = window.devicePixelRatio || 1;
      const w = cv ? cv.width / dpr : window.innerWidth;
      const h = cv ? cv.height / dpr : window.innerHeight;
      api.setPointerX(0.5);
      api.setPointerY(0.68);
      st.coreAmmo = 0;
      const now = performance.now();

      // 1. Activate realm-specific armored shield buff + measure outer shield radius
      st.applyBuff('shield', '${r.buffName}', '#38bdf8', '🛡️', 8000, now);
      const cx = (st.catcherX || 0.5) * w;
      const cy = (st.catcherY || 0.68) * h;

      // 2. Spawn falling Heraldic Shield Power-Up Pickup cleanly above the barrier (visible in screenshot!)
      const rMode = (st.catcherType === 'helix') ? 'helix' : (st.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      st.particles.push({
        type: rMode,
        nodeClass: 'shield',
        x: cx - Math.min(130, w * 0.24),
        y: cy - Math.min(205, h * 0.27),
        vx: 0,
        speed: 0.15,
        headR: 40,
        animPhase: 0.4,
        spine: []
      });

      // 3. Test outer shield wall enemy crushing! Place a volatile hazard just inside the outer armor perimeter (dist ~ 115px > 68*u!)
      const preScore = st.score;
      const preLives = st.reflexLives;
      st.particles.push({
        type: rMode,
        nodeClass: 'volatile',
        x: cx + 78,
        y: cy - 82,
        vx: 0,
        speed: 3.5,
        headR: 28,
        animPhase: 0.8,
        spine: []
      });

      await new Promise((res) => setTimeout(res, 180));
      const postScore = st.score;
      const postLives = st.reflexLives;
      const crushedOnWall = (postScore >= preScore + 300) && (postLives === preLives);
      const impactCount = (kin.shieldImpacts || []).length;

      // Refresh an active shield impact right on upper-right prow for crisp screenshot inspection
      kin.triggerShieldDeflect(cx + 85, cy - 95, performance.now(), rMode, -0.78);

      return {
        label: '${r.label}',
        buffName: st.getBuff('shield', performance.now())?.name || null,
        shieldActive: Boolean(st.hasBuff('shield', performance.now())),
        crushedOnWall,
        scoreDelta: postScore - preScore,
        livesIntact: postLives === 3,
        impactCount,
        gunDeployT: Math.round((kin.gunDeployT || 0) * 1000) / 1000
      };
    })()`);
    results.push(check);

    await sleep(80);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, r.out), Buffer.from(data, 'base64'));
  }

  console.log(JSON.stringify({ results, pageErrors, httpErrors }, null, 2));
  try { cdp.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { server.close(); } catch {}
  await sleep(200);
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  const failed = results.filter((x) => !x.shieldActive || !x.crushedOnWall || !x.livesIntact || x.gunDeployT > 0.05);
  if (failed.length || pageErrors.length || httpErrors.length) {
    process.exitCode = 1;
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
