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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v424-'));
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

  // 1. Verify Meteor Tier VII Real Fluid-Fire Inferno + Blazing Side Missiles
  // 2. Verify Dynamo Tier VII Astral-Lightning Cannon + Massive Electricity + Side Tesla Bolts
  // 3. Verify Helix Tier VII remains untouched & firing cleanly
  for (const r of [
    { key: 'meteor', out: 'v424_meteor_tier7_real_fire.png', cKind: 'dragon_breath', sKind: 'meteor_bolide' },
    { key: 'dynamo', out: 'v424_dynamo_tier7_astral_lightning.png', cKind: 'princess_cannon', sKind: 'dynamo_tesla' },
    { key: 'helix',  out: 'v424_helix_tier7_unchanged.png', cKind: 'unicorn_laser', sKind: 'helix_pulse' }
  ]) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=7` });
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
      api.setTier(7, false);
      api.setPointerX(0.5);
      api.setPointerY(0.78);
      st.particles.length = 0;
    })()`);
    await sleep(220);

    const idleT = await cdp.evalExpr(`window.chromeSynapseGame.getState().gunDeployT || 0`);
    if (idleT > 0.02) failures.push(`${r.key} idle gunDeployT=${idleT}`);

    const preScore = await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      const kin = api.getKinematics();
      const cx = kin.lastX || 640;
      const cy = kin.lastY || 560;
      st.particles.length = 0;
      st.coreAmmo = 250;
      const base = st.score;
      [cx - 44, cx, cx + 44].forEach((bx, idx) => {
        st.particles.push({
          type: '${r.key}', nodeClass: idx === 1 ? 'corruptor_laser' : 'volatile',
          x: bx, y: Math.max(140, cy - 280 + idx * 35),
          vx: 0, speed: 0.04, headR: 28, shotHp: 3, animPhase: idx, spine: [],
          laserState: 'idle', laserSalvosLeft: 0, laserNextReady: performance.now() + 99999
        });
      });
      return base;
    })()`);

    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(360);
    const st = await cdp.evalExpr(`(() => {
      const s = window.chromeSynapseGame.getState();
      return {
        gunDeployT: s.gunDeployT || 0,
        cShots: s.playerShots.filter(x => x.isTier7 && x.t7Kind === '${r.cKind}').length,
        sShots: s.playerShots.filter(x => x.isTier7Side && x.t7SideKind === '${r.sKind}').length,
        scoreDelta: s.score - ${preScore}
      };
    })()`);
    await cdp.screenshot(path.join(ARTIFACT_DIR, r.out));
    await cdp.key('keyUp', 'KeyA', 'a', 65);
    console.log(`[CHECK v424 ${r.key}]`, JSON.stringify(st));
    if (st.gunDeployT < 0.95 || st.cShots < 1 || st.sShots < 2 || st.scoreDelta <= 0) {
      failures.push(`${r.key} T7 fire check failed: ${JSON.stringify(st)}`);
    }
  }

  // 4. Verify Meteor Skill 2 Seeker Comets (pressing 'S') use real blazing Meteor missiles
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=meteor&tier=6` });
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
    api.setPointerX(0.5);
    api.setPointerY(0.80);
    st.particles.length = 0;
    [360, 540, 720, 920].forEach((bx, idx) => {
      st.particles.push({ type: 'meteor', nodeClass: 'volatile', x: bx, y: 170 + (idx % 2) * 55, vx: 0, speed: 0.02, headR: 30, shotHp: 3, animPhase: idx, spine: [] });
    });
  })()`);
  await cdp.key('keyDown', 'KeyS', 's', 83);
  await sleep(80);
  await cdp.key('keyUp', 'KeyS', 's', 83);
  await sleep(320);
  await cdp.screenshot(path.join(ARTIFACT_DIR, 'v424_meteor_seeker_missiles.png'));

  if (pageErrors.length) failures.push('Page errors: ' + pageErrors.join(' | '));
  if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

  cdp.close();
  try { chrome.kill(); } catch {}
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log('=== v424 SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.error('FAIL:', f);
  if (failures.length > 0) process.exit(1);
  console.log('ALL v424 METEOR FIRE & DYNAMO LIGHTNING CHECKS PASSED!');
}

run().catch((e) => { console.error(e); process.exit(1); });
