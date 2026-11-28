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
  async key(type, code, key, keyCode) {
    await this.send('Input.dispatchKeyEvent', { type, code, key, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v422-'));
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

  // 1. Balanced Good Nodes Gallery (Helix realm)
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=helix&tier=7` });
  for (let t = 0; t < 50; t++) {
    const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
    if (ready) break;
    await sleep(120);
  }
  await sleep(650);

  await cdp.evalExpr(`(() => {
    const api = window.chromeSynapseGame;
    const st = api.getState();
    st.roundBanner = null;
    st.coreAmmo = 0;
    api.setTier(7, false);
    api.setPointerX(0.5);
    api.setPointerY(0.82);
    st.particles.length = 0;
    const items = [
      { cls: 'missiles',    x: 200, y: 185, r: 40 },
      { cls: 'supercharge', x: 420, y: 185, r: 40 },
      { cls: 'shield',      x: 640, y: 185, r: 42 },
      { cls: 'cluster',     x: 860, y: 185, r: 40 },
      { cls: 'catalyst',    x: 1080, y: 185, r: 40 },
      { cls: 'chronos',     x: 340, y: 375, r: 38 },
      { cls: 'singularity', x: 640, y: 375, r: 38 },
      { cls: 'standard',    x: 940, y: 375, r: 34 }
    ];
    items.forEach((it, idx) => {
      st.particles.push({
        type: 'helix', nodeClass: it.cls,
        x: it.x, y: it.y, vx: 0, speed: 0.04, headR: it.r, animPhase: idx * 0.4, spine: []
      });
    });
  })()`);
  await sleep(240);
  await cdp.screenshot(path.join(ARTIFACT_DIR, 'v422_good_nodes_balanced.png'));

  // 2. Tier VII Strict Idle + 0-Ammo Dry Hold + Active Center & Side Weapons across Dynamo, Helix, Meteor
  const realms = [
    { key: 'dynamo', fireOut: 'v422_tier7_dynamo_cannon.png', centerKind: 'princess_cannon', sideKind: 'dynamo_tesla' },
    { key: 'helix',  idleOut: 'v422_tier7_helix_idle.png', fireOut: 'v422_tier7_helix_laser.png', centerKind: 'unicorn_laser', sideKind: 'helix_pulse' },
    { key: 'meteor', fireOut: 'v422_tier7_meteor_fire.png',  centerKind: 'dragon_breath',   sideKind: 'meteor_bolide' }
  ];

  for (const r of realms) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=7` });
    for (let t = 0; t < 50; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(600);

    await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      st.roundBanner = null;
      api.setTier(7, false);
      api.setPointerX(0.5);
      api.setPointerY(0.76);
      st.particles.length = 0;
    })()`);
    await sleep(250);

    const idleSt = await cdp.evalExpr(`(() => {
      const s = window.chromeSynapseGame.getState();
      return { tier: s.coreTier, gunDeployT: s.gunDeployT || 0 };
    })()`);
    if (idleSt.tier !== 7 || idleSt.gunDeployT > 0.02) failures.push(`${r.key} T7 idle invalid: ${JSON.stringify(idleSt)}`);
    if (r.idleOut) {
      await cdp.screenshot(path.join(ARTIFACT_DIR, r.idleOut));
    }

    // Dry hold with 0 ammo -> ALL weapons remain hidden
    await cdp.evalExpr(`window.chromeSynapseGame.getState().coreAmmo = 0;`);
    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(200);
    const dryHoldT = await cdp.evalExpr(`window.chromeSynapseGame.getState().gunDeployT || 0`);
    await cdp.key('keyUp', 'KeyA', 'a', 65);
    await sleep(80);
    if (dryHoldT > 0.02) failures.push(`${r.key} T7 dry hold deployed weapon: ${dryHoldT}`);

    // Fire at front enemies -> verify BOTH central super-weapon AND active side weapons fire!
    const preScore = await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      const kin = api.getKinematics();
      const cx = kin.lastX || 640;
      const cy = kin.lastY || 540;
      st.particles.length = 0;
      st.coreAmmo = 250;
      const baseSc = st.score;
      [cx - 48, cx, cx + 48].forEach((bx, idx) => {
        st.particles.push({
          type: '${r.key}',
          nodeClass: idx === 1 ? 'corruptor_laser' : 'volatile',
          x: bx, y: Math.max(130, cy - 260 + idx * 35),
          vx: 0, speed: 0.05, headR: 28, shotHp: 3, animPhase: idx, spine: [],
          laserState: 'idle', laserSalvosLeft: 0, laserNextReady: performance.now() + 99999
        });
      });
      st.particles.push({
        type: '${r.key}', nodeClass: 'standard', x: cx + 280, y: Math.max(180, cy - 220),
        vx: 0, speed: 0.05, headR: 32, animPhase: 0.5, spine: [], _safeMarker: true
      });
      return baseSc;
    })()`);

    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(340);
    const fireSt = await cdp.evalExpr(`(() => {
      const s = window.chromeSynapseGame.getState();
      const t7Center = s.playerShots.filter(sh => sh.isTier7 && sh.t7Kind === '${r.centerKind}').length;
      const t7Side = s.playerShots.filter(sh => sh.isTier7Side && sh.t7SideKind === '${r.sideKind}').length;
      const badAlive = s.particles.filter(p => ['volatile','corruptor_laser'].includes(p.nodeClass)).length;
      const safeAlive = s.particles.filter(p => p._safeMarker).length;
      return {
        gunDeployT: s.gunDeployT || 0,
        shots: s.playerShots.length,
        t7Center,
        t7Side,
        badAlive,
        safeAlive,
        scoreDelta: s.score - ${preScore}
      };
    })()`);
    await cdp.screenshot(path.join(ARTIFACT_DIR, r.fireOut));
    await cdp.key('keyUp', 'KeyA', 'a', 65);

    let relT = 1;
    for (let w = 0; w < 20; w++) {
      await sleep(50);
      relT = await cdp.evalExpr(`window.chromeSynapseGame.getState().gunDeployT || 0`);
      if (relT <= 0.02) break;
    }

    console.log(`[CHECK v422 T7 ${r.key}]`, JSON.stringify({ ...fireSt, relT }));
    if (fireSt.gunDeployT < 0.95 || fireSt.t7Center < 1 || fireSt.t7Side < 2 || relT > 0.02 || fireSt.safeAlive !== 1) {
      failures.push(`${r.key} v422 T7 center+side weapon check failed: ${JSON.stringify(fireSt)} relT=${relT}`);
    }
    if (fireSt.badAlive >= 3 && fireSt.scoreDelta <= 0) {
      failures.push(`${r.key} v422 T7 weapons did not damage front bad nodes`);
    }
  }

  // 3. Progression I -> VII -> I
  const progCheck = await cdp.evalExpr(`(async () => {
    const api = window.chromeSynapseGame;
    api.setCombo(64, false);
    const tBefore = api.getState().coreTier;
    api.addCombo(1, true);
    const tAfter = api.getState().coreTier;
    document.getElementById('cgTierPill')?.click();
    const tWrapped = api.getState().coreTier;
    return { tBefore, tAfter, tWrapped };
  })()`);
  console.log('[CHECK Progression]', JSON.stringify(progCheck));
  if (progCheck.tBefore !== 6 || progCheck.tAfter !== 7 || progCheck.tWrapped !== 1) {
    failures.push('Tier progression / wrap failed: ' + JSON.stringify(progCheck));
  }

  if (pageErrors.length) failures.push('Page errors: ' + pageErrors.join(' | '));
  if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

  cdp.close();
  try { chrome.kill(); } catch {}
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log('=== v422 SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.error('FAIL:', f);
  if (failures.length > 0) process.exit(1);
  console.log('ALL v422 CHECKS PASSED!');
}

run().catch((e) => { console.error(e); process.exit(1); });
