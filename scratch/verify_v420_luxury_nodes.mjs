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
    if (!filePath.startsWith(ROOT_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
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
    if (res.exceptionDetails) throw new Error(`JS Exception: ${JSON.stringify(res.exceptionDetails)}`);
    return res.result ? res.result.value : undefined;
  }
  close() { try { this.ws.close(); } catch {} }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const { server, port, httpErrors } = await startStaticServer();
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v420-'));
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
      if (page?.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
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

  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 2, mobile: false });

  const shieldResults = [];
  const realms = [
    { key: 'realm', label: 'dynamo', buffName: 'FARADAY AEGIS', out: 'v420_shield_dynamo.png' },
    { key: 'helix', label: 'helix', buffName: 'PRISM AEGIS', out: 'v420_shield_helix.png' },
    { key: 'meteor', label: 'meteor', buffName: 'CALDERA BULWARK', out: 'v420_shield_meteor.png' }
  ];

  for (const r of realms) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=6` });
    for (let t = 0; t < 40; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(150);
    }
    await sleep(650);

    const check = await cdp.evalExpr(`(async () => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      const kin = api.getKinematics();
      st.roundBanner = null;
      st.coreAmmo = 0;
      api.setPointerX(0.5);
      api.setPointerY(0.66);
      await new Promise((res) => setTimeout(res, 120));

      const cv = document.getElementById('cgCanvasReflex');
      const dpr = window.devicePixelRatio || 1;
      const w = cv ? cv.width / dpr : window.innerWidth;
      const h = cv ? cv.height / dpr : window.innerHeight;
      const cx = (kin.lastX !== null && kin.lastX !== undefined) ? kin.lastX : (w * 0.5);
      const cy = (kin.lastY !== null && kin.lastY !== undefined) ? kin.lastY : (h * 0.78);
      const rMode = (st.catcherType === 'helix') ? 'helix' : (st.catcherType === 'meteor' ? 'meteor' : 'dynamo');

      st.particles.length = 0;
      st.applyBuff('shield', '${r.buffName}', '#fbbf24', '🛡️', 9000, performance.now());

      // Falling Luxury Heraldic Shield Power-Up Relic cleanly left of the barrier in open space
      st.particles.push({
        type: rMode, nodeClass: 'shield',
        x: cx - 255, y: cy - 75, vx: 0, speed: 0.05, headR: 42, animPhase: 0.3, spine: []
      });

      // Outer wall enemy-crush test (right on the upper-right armor perimeter, well outside 68*u!)
      const preScore = st.score;
      const preLives = st.reflexLives;
      st.particles.push({
        type: rMode, nodeClass: 'volatile',
        x: cx + 78, y: cy - 82, vx: 0, speed: 2.0, headR: 28, animPhase: 0.8, spine: []
      });

      await new Promise((res) => setTimeout(res, 200));
      const postScore = st.score;
      const postLives = st.reflexLives;
      kin.triggerShieldDeflect(cx + 125, cy - 125, performance.now(), rMode, -0.78);

      return {
        label: '${r.label}',
        buffName: st.getBuff('shield', performance.now())?.name || null,
        shieldActive: Boolean(st.hasBuff('shield', performance.now())),
        crushedOnWall: (postScore >= preScore + 300) && (postLives === preLives),
        scoreDelta: postScore - preScore,
        livesIntact: postLives === 3,
        impactCount: (kin.shieldImpacts || []).length,
        gunDeployT: Math.round((kin.gunDeployT || 0) * 1000) / 1000
      };
    })()`);
    shieldResults.push(check);
    await sleep(100);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, r.out), Buffer.from(data, 'base64'));
  }

  // Capture Gallery 1: All 9 Powered-Up Good Relics (3 Realm Shields + Missiles + Cluster + Supercharge + Chronos + Singularity + Catalyst)
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=realm&tier=6` });
  for (let t = 0; t < 40; t++) {
    const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
    if (ready) break;
    await sleep(150);
  }
  await sleep(600);
  await cdp.evalExpr(`(() => {
    const st = window.chromeSynapseGame.getState();
    st.roundBanner = null;
    st.coreAmmo = 0;
    window.chromeSynapseGame.setPointerX(0.5);
    window.chromeSynapseGame.setPointerY(0.84);
    st.particles.length = 0;
    const items = [
      ['dynamo', 'shield', 220, 210],
      ['helix', 'shield', 440, 210],
      ['meteor', 'shield', 660, 210],
      ['dynamo', 'missiles', 880, 210],
      ['helix', 'cluster', 1080, 210],
      ['meteor', 'supercharge', 250, 415],
      ['dynamo', 'chronos', 500, 415],
      ['helix', 'singularity', 760, 415],
      ['meteor', 'catalyst', 1020, 415]
    ];
    for (const [m, cls, x, y] of items) {
      st.particles.push({ type: m, nodeClass: cls, x, y, vx: 0, speed: 0, headR: 40, animPhase: 0.4, spine: [] });
    }
    return true;
  })()`);
  await sleep(180);
  {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v420_good_powerups_gallery.png'), Buffer.from(data, 'base64'));
  }

  // Capture Gallery 2: Powered-Up Bad Nodes + Classic 3D Bad Nodes & Seeker Ring over #000000
  const badDiag = await cdp.evalExpr(`(async () => {
    const st = window.chromeSynapseGame.getState();
    st.roundBanner = null;
    st.particles.length = 0;
    const now = performance.now();
    const bads = [
      ['dynamo', 'hyper_comet', 190, 200, { cometPhase: 'charging', cometChargeEnd: now + 9000, showThreatBadge: true }],
      ['helix', 'corruptor_laser', 410, 200, { laserState: 'idle', laserSalvosLeft: 0, laserCharge: 0.55, showThreatBadge: true }],
      ['meteor', 'gravity_well', 640, 200, { showThreatBadge: true }],
      ['dynamo', 'emp_detonator', 870, 200, { empCharge: 0.55, empNextPulse: now + 9000, showThreatBadge: true }],
      ['helix', 'phase_stalker', 1090, 200, { blinkState: 'idle', blinksLeft: 0, blinkProgress: 0.35, showThreatBadge: true }],
      ['dynamo', 'seeker', 240, 410, {}],
      ['helix', 'seeker', 490, 410, {}],
      ['meteor', 'seeker', 760, 410, {}],
      ['meteor', 'volatile', 1030, 410, {}]
    ];
    for (const [m, cls, x, y, extra] of bads) {
      st.particles.push(Object.assign({ type: m, nodeClass: cls, x, y, vx: 0, speed: 0, headR: 38, animPhase: 0.5, spine: [] }, extra));
    }
    await new Promise((res) => setTimeout(res, 180));
    return st.particles.map((p) => ({ cls: p.nodeClass, x: Math.round(p.x), y: Math.round(p.y) }));
  })()`);
  {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v420_bad_nodes_gallery.png'), Buffer.from(data, 'base64'));
  }

  console.log(JSON.stringify({ shieldResults, badDiag, pageErrors, httpErrors }, null, 2));
  try { cdp.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { server.close(); } catch {}
  await sleep(200);
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  const failed = shieldResults.filter((x) => !x.shieldActive || !x.crushedOnWall || !x.livesIntact || x.gunDeployT > 0.05);
  if (failed.length || pageErrors.length || httpErrors.length) process.exitCode = 1;
}

run().catch((e) => { console.error(e); process.exit(1); });
