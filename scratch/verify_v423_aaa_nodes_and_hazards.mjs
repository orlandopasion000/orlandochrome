import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
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
    if (!filePath.startsWith(ROOT_DIR)) { res.writeHead(403); res.end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404); res.end();
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
    await new Promise((res, rej) => {
      this.ws.addEventListener('open', res, { once: true });
      this.ws.addEventListener('error', rej, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method && this.listeners.has(msg.method)) {
        this.listeners.get(msg.method)(msg.params);
      }
    });
  }
  on(method, fn) { this.listeners.set(method, fn); }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evalExpr(expression) {
    const res = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) throw new Error('Eval error: ' + JSON.stringify(res.exceptionDetails));
    return res.result ? res.result.value : undefined;
  }
  async screenshot(outPath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  }
  close() { try { this.ws.close(); } catch {} }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const { server, port, httpErrors } = await startStaticServer();
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v423-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--mute-audio',
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
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 2, mobile: false });
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });

  const pageErrors = [];
  const failures = [];
  cdp.on('Runtime.exceptionThrown', (p) => pageErrors.push(p.exceptionDetails?.text || 'exception'));

  // 1. Capture All 3 Realms Showing Realm-Specific Good + Bad AAA Nodes
  for (const [realm, outName] of [
    ['dynamo', 'v423_dynamo_good_and_bad.png'],
    ['helix',  'v423_helix_good_and_bad.png'],
    ['meteor', 'v423_meteor_good_and_bad.png']
  ]) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${realm}&tier=7` });
    for (let t = 0; t < 50; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(750);

    await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      st.roundBanner = null;
      st.coreAmmo = 0;
      api.setTier(6, false);
      api.setPointerX(0.5);
      api.setPointerY(0.84);
      st.particles.length = 0;

      // Top row: 6 Powered Good Relics
      const goods = [
        { cls: 'missiles',    x: 160,  y: 165, r: 40 },
        { cls: 'supercharge', x: 350,  y: 165, r: 40 },
        { cls: 'shield',      x: 540,  y: 165, r: 42 },
        { cls: 'cluster',     x: 730,  y: 165, r: 40 },
        { cls: 'chronos',     x: 920,  y: 165, r: 40 },
        { cls: 'singularity', x: 1110, y: 165, r: 40 }
      ];
      goods.forEach((it, idx) => {
        st.particles.push({ type: '${realm}', nodeClass: it.cls, x: it.x, y: it.y, vx: 0, speed: 0.01, headR: it.r, animPhase: idx * 0.4, spine: [] });
      });

      // Second row: 5 Powered Bad Hazards (freezing AI timers so screenshot shows crystal clear art!)
      const now = performance.now();
      [
        { cls: 'hyper_comet',     x: 190,  y: 385, r: 34, extra: { cometPhase: 'charging', cometChargeEnd: now + 99999 } },
        { cls: 'corruptor_laser', x: 415,  y: 385, r: 34, extra: { laserState: 'idle', laserSalvosLeft: 0, laserNextReady: now + 99999 } },
        { cls: 'gravity_well',    x: 640,  y: 385, r: 36, extra: {} },
        { cls: 'emp_detonator',   x: 865,  y: 385, r: 34, extra: { empCharge: 0.55, empNextPulse: now + 99999 } },
        { cls: 'phase_stalker',   x: 1090, y: 385, r: 34, extra: { blinkState: 'idle', blinksLeft: 0 } }
      ].forEach((it, idx) => {
        st.particles.push(Object.assign({ type: '${realm}', nodeClass: it.cls, x: it.x, y: it.y, vx: 0, speed: 0.01, headR: it.r, animPhase: idx * 0.5, spine: [] }, it.extra));
      });
    })()`);
    await sleep(260);
    await cdp.screenshot(path.join(ARTIFACT_DIR, outName));
    console.log(`[CHECK Showcase ${realm}] captured ${outName}`);
  }

  // 2. Functional Test: Faster Corruptor Laser + High-Visibility Vortex Pull + EMP 220px Shockwave & Slowdown
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=dynamo&tier=6` });
  for (let t = 0; t < 50; t++) {
    const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
    if (ready) break;
    await sleep(120);
  }
  await sleep(600);

  // Set up live interaction scene: Laser corrupting a good node quickly + Vortex pulling good node + EMP detonating near player
  const t0State = await cdp.evalExpr(`(() => {
    const api = window.chromeSynapseGame;
    const st = api.getState();
    const now = performance.now();
    st.roundBanner = null;
    st.buffs = {};
    api.setPointerX(0.70);
    api.setPointerY(0.75);
    st.particles.length = 0;
    st.hazardLasers.length = 0;
    st.empShockwaves.length = 0;

    // A) Fast Corruptor Laser + target standard good node 120px away
    st.particles.push({
      type: 'dynamo', nodeClass: 'corruptor_laser', x: 240, y: 200, vx: 0, speed: 0.01, headR: 34,
      laserState: 'idle', laserCharge: 0, laserChargeStart: 0, laserTargets: [], laserSalvosLeft: 3, laserNextReady: now + 20, spine: []
    });
    st.particles.push({
      type: 'dynamo', nodeClass: 'standard', x: 350, y: 220, vx: 0, speed: 0.01, headR: 28, animPhase: 0.2, spine: [], _laserTargetMark: true
    });

    // B) High-Visibility Vortex + good node at dist 180
    st.particles.push({
      type: 'dynamo', nodeClass: 'gravity_well', x: 640, y: 310, vx: 0, speed: 0.01, headR: 35, animPhase: 0.8, spine: []
    });
    st.particles.push({
      type: 'dynamo', nodeClass: 'standard', x: 810, y: 320, vx: 0, speed: 0.01, headR: 28, animPhase: 0.4, spine: [], _vortexVictimMark: true
    });

    // C) High-Visibility EMP at dist ~150px above/left of player, about to pulse in 320ms
    st.particles.push({
      type: 'dynamo', nodeClass: 'emp_detonator', x: 896, y: 400, vx: 0, speed: 0.01, headR: 34,
      empCharge: 0.5, empNextPulse: now + 320, animPhase: 1.2, spine: []
    });
    return { initialVictimX: 810 };
  })()`);

  // Wait 340ms: Laser should have corrupted or fired fast (<400ms!), EMP should be mid-countdown/detonating, Vortex should be pulling victim inward!
  await sleep(340);
  await cdp.screenshot(path.join(ARTIFACT_DIR, 'v423_vortex_emp_laser_action.png'));

  // Wait another 420ms so EMP 220px shockwave washes over unshielded player & Laser conversion finishes
  await sleep(420);
  const resChecks = await cdp.evalExpr(`(() => {
    const st = window.chromeSynapseGame.getState();
    const laserTarget = st.particles.find(p => p._laserTargetMark);
    const vortexVictim = st.particles.find(p => p._vortexVictimMark);
    return {
      laserCorruptedToVolatile: laserTarget ? (laserTarget.nodeClass === 'volatile') : false,
      vortexPulledInwardPx: vortexVictim ? (810 - vortexVictim.x) : 0,
      empSlowTriggered: Boolean(st.empSlowUntil && st.empSlowUntil > performance.now() - 300),
      particleCount: st.particles.length
    };
  })()`);

  console.log('[CHECK v423 Mechanics]', JSON.stringify(resChecks));
  if (!resChecks.laserCorruptedToVolatile) failures.push('Corruptor Laser did not corrupt target within fast window: ' + JSON.stringify(resChecks));
  if (resChecks.vortexPulledInwardPx < 18) failures.push('Vortex did not pull good node noticeably inward: ' + JSON.stringify(resChecks));
  if (!resChecks.empSlowTriggered) failures.push('EMP 220px shockwave did not trigger empSlowUntil on unshielded player: ' + JSON.stringify(resChecks));
  if (pageErrors.length) failures.push('Page errors: ' + pageErrors.join(' | '));
  if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

  cdp.close();
  try { chrome.kill(); } catch {}
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log('=== v423 SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.error('FAIL:', f);
  if (failures.length > 0) process.exit(1);
  console.log('ALL v423 AAA NODES & LASER/VORTEX/EMP CHECKS PASSED!');
}

run().catch((e) => { console.error(e); process.exit(1); });
