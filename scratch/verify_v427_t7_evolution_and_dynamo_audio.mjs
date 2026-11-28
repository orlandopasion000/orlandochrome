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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v427-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
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

  // 1. Direct Tier VI -> Tier VII Evolution Checks across all 3 Realms (zero egg revert)
  const realms = [
    { key: 'dynamo', capP1: 'v427_evo_dynamo_p1.png', capP2: 'v427_evo_dynamo_p2.png' },
    { key: 'meteor', capP2: 'v427_evo_meteor_p2.png' },
    { key: 'helix',  capP2: 'v427_evo_helix_p2.png' }
  ];

  for (const r of realms) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=6` });
    for (let t = 0; t < 50; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(600);

    // Ensure settled cleanly at Tier VI before triggering Tier VII evolution
    await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      st.roundBanner = null;
      st.particles.length = 0;
      st.coreAmmo = 0;
      api.setTier(6, false);
      api.setPointerX(0.5);
      api.setPointerY(0.65);
    })()`);
    await sleep(250);

    // Trigger Tier VI -> Tier VII evolution
    await cdp.evalExpr(`window.chromeSynapseGame.setTier(7, true);`);
    await sleep(200);
    const p1State = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
    if (r.capP1) await cdp.screenshot(path.join(ARTIFACT_DIR, r.capP1));

    await sleep(380); // ~580ms elapsed -> Phase 2 direct metamorphosis & burst
    const p2State = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
    if (r.capP2) await cdp.screenshot(path.join(ARTIFACT_DIR, r.capP2));

    console.log(`[CHECK T6->T7 Evo ${r.key}]`, JSON.stringify({ p1State, p2State }));
    if (!p1State.hatching || p1State.targetTier !== 7 || p1State.hasEggSnapshot !== false) {
      failures.push(`${r.key} T6->T7 p1 invalid: ${JSON.stringify(p1State)}`);
    }
    if (!p2State.hatching || p2State.targetTier !== 7 || p2State.hasEggSnapshot !== false) {
      failures.push(`${r.key} T6->T7 p2 invalid: ${JSON.stringify(p2State)}`);
    }

    await sleep(1100);
    const settled = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
    if (settled.hatching || settled.tier !== 7) {
      failures.push(`${r.key} T7 evolution failed to settle: ${JSON.stringify(settled)}`);
    }
  }

  // 2. Regression Check: Tier V -> Tier VI Hatch STILL uses EggSnapshot cleanly!
  await cdp.evalExpr(`(() => {
    const api = window.chromeSynapseGame;
    api.setTier(5, false);
  })()`);
  await sleep(120);
  await cdp.evalExpr(`window.chromeSynapseGame.setTier(6, true);`);
  await sleep(180);
  const t6HatchState = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
  console.log('[CHECK T5->T6 Regression]', JSON.stringify(t6HatchState));
  if (!t6HatchState.hatching || t6HatchState.targetTier !== 6 || t6HatchState.hasEggSnapshot !== true) {
    failures.push(`T5->T6 regression invalid: ${JSON.stringify(t6HatchState)}`);
  }
  await sleep(1450);

  // 3. Dynamo Princess Weapon Audio Verification (Tiers 1-7): ZERO sawtooth, FM/harmonics + bandpass spark scaling
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=dynamo&tier=1` });
  for (let t = 0; t < 50; t++) {
    const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
    if (ready) break;
    await sleep(120);
  }
  await sleep(500);

  // Monkey-patch AudioContext prototype BEFORE triggering shots
  await cdp.evalExpr(`(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    window.__audioLog = { oscs: [], filters: [] };
    if (!AC || AC.prototype.__v427Patched) return;
    AC.prototype.__v427Patched = true;
    const origOsc = AC.prototype.createOscillator;
    const origFil = AC.prototype.createBiquadFilter;
    AC.prototype.createOscillator = function() {
      const node = origOsc.apply(this, arguments);
      window.__audioLog.oscs.push(node);
      return node;
    };
    AC.prototype.createBiquadFilter = function() {
      const node = origFil.apply(this, arguments);
      window.__audioLog.filters.push(node);
      return node;
    };
  })()`);

  // Silence background music button (#cgMusicBtn) & freeze wave spawns so audio spy measures ONLY weapon cannon shots!
  await cdp.evalExpr(`(() => {
    const mBtn = document.getElementById('cgMusicBtn');
    if (mBtn && !mBtn.classList.contains('muted')) mBtn.click();
    const st = window.chromeSynapseGame.getState();
    st.roundBanner = null;
    st.particles.length = 0;
  })()`);
  await sleep(250);

  const tierVoiceMap = {};
  for (let tier = 1; tier <= 7; tier++) {
    const preShots = await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      st.roundBanner = null;
      st.particles.length = 0;
      api.setTier(${tier}, false);
      st.coreAmmo = 250;
      st.lastShotTime = 0;
      window.__audioLog = { oscs: [], filters: [] };
      return st.shotCounter || 0;
    })()`);

    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(90);
    await cdp.key('keyUp', 'KeyA', 'a', 65);
    await sleep(50);

    const res = await cdp.evalExpr(`(() => {
      const st = window.chromeSynapseGame.getState();
      const postShots = st.shotCounter || 0;
      const oscTypes = window.__audioLog.oscs.map((o) => o.type);
      const filTypes = window.__audioLog.filters.map((f) => f.type);
      return {
        shotDelta: postShots - ${preShots},
        oscCount: oscTypes.length,
        sawtoothCount: oscTypes.filter((x) => x === 'sawtooth').length,
        sineCount: oscTypes.filter((x) => x === 'sine').length,
        triangleCount: oscTypes.filter((x) => x === 'triangle').length,
        bandpassCount: filTypes.filter((x) => x === 'bandpass').length,
        lowpassCount: filTypes.filter((x) => x === 'lowpass').length
      };
    })()`);

    const perShotOsc = res.shotDelta > 0 ? (res.oscCount / res.shotDelta) : 0;
    const perShotVoices = res.shotDelta > 0 ? ((res.oscCount + res.bandpassCount) / res.shotDelta) : 0;
    tierVoiceMap[tier] = { ...res, perShotOsc, perShotVoices };
    console.log(`[CHECK Dynamo Audio T${tier}]`, JSON.stringify(tierVoiceMap[tier]));

    if (res.shotDelta < 1) failures.push(`Dynamo Audio T${tier} did not trigger a shot`);
    if (res.sawtoothCount > 0) failures.push(`Dynamo Audio T${tier} still uses harsh sawtooth!`);
    if (res.sineCount < 2 || res.bandpassCount < 1) failures.push(`Dynamo Audio T${tier} missing FM/bandpass layers: ${JSON.stringify(res)}`);
  }

  if (!(tierVoiceMap[7].perShotVoices > tierVoiceMap[3].perShotVoices && tierVoiceMap[3].perShotVoices > tierVoiceMap[1].perShotVoices)) {
    failures.push(`Dynamo Audio voice richness did not scale across T1->T3->T7: T1=${tierVoiceMap[1].perShotVoices}, T3=${tierVoiceMap[3].perShotVoices}, T7=${tierVoiceMap[7].perShotVoices}`);
  }

  // Verify Helix & Meteor T7 audio fire cleanly without errors
  for (const rKey of ['helix', 'meteor']) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${rKey}&tier=7` });
    for (let t = 0; t < 50; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(300);
    await cdp.evalExpr(`window.chromeSynapseGame.getState().coreAmmo = 50; window.chromeSynapseGame.getState().lastShotTime = 0;`);
    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(110);
    await cdp.key('keyUp', 'KeyA', 'a', 65);
  }

  if (pageErrors.length) failures.push('Page errors: ' + pageErrors.join(' | '));
  if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

  cdp.close();
  try { chrome.kill(); } catch {}
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log('=== v427 SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.error('FAIL:', f);
  if (failures.length > 0) process.exit(1);
  console.log('ALL v427 EVOLUTION & DYNAMO AUDIO CHECKS PASSED!');
}

run().catch((e) => { console.error(e); process.exit(1); });
