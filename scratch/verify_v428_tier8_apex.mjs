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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v428-'));
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

  const realms = [
    { key: 'dynamo', centerKind: 'royal_sapphire_shell', sideKind: 'royal_sapphire_spear' },
    { key: 'helix',  centerKind: 'prism_rail_lance',     sideKind: 'prism_rail_side' },
    { key: 'meteor', centerKind: 'solar_forge_core',     sideKind: 'solar_forge_missile' }
  ];

  // 1. Tier VIII Load, HUD (TIER VIII / 90x), Strict Idle Weapon Hiding, Dry Hold, & Apex Weapon Firing
  for (const r of realms) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=8` });
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
      api.setTier(8, false);
      api.setPointerX(0.5);
      api.setPointerY(0.76);
      st.particles.length = 0;
    })()`);
    await sleep(260);

    const idleSt = await cdp.evalExpr(`(() => {
      const s = window.chromeSynapseGame.getState();
      const pill = (document.getElementById('cgTierPill')?.textContent || '').replace(/\\s+/g, ' ').trim();
      return { tier: s.coreTier, combo: s.combo, gunDeployT: s.gunDeployT || 0, pill };
    })()`);
    console.log(`[CHECK T8 Idle ${r.key}]`, JSON.stringify(idleSt));
    if (idleSt.tier !== 8 || idleSt.combo < 90 || !idleSt.pill.includes('TIER VIII') || idleSt.gunDeployT > 0.02) {
      failures.push(`${r.key} T8 idle/HUD invalid: ${JSON.stringify(idleSt)}`);
    }
    await cdp.screenshot(path.join(ARTIFACT_DIR, `v428_t8_${r.key}_idle.png`));

    // Dry hold with 0 ammo -> ultimate cannons stay hidden
    await cdp.evalExpr(`window.chromeSynapseGame.getState().coreAmmo = 0;`);
    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(200);
    const dryHoldT = await cdp.evalExpr(`window.chromeSynapseGame.getState().gunDeployT || 0`);
    await cdp.key('keyUp', 'KeyA', 'a', 65);
    await sleep(80);
    if (dryHoldT > 0.02) failures.push(`${r.key} T8 dry hold deployed weapon: ${dryHoldT}`);

    // Active fire against front + flanking hazard targets + far safe good node
    const preScore = await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      const kin = api.getKinematics();
      const cx = kin.lastX || 640;
      const cy = kin.lastY || 540;
      st.particles.length = 0;
      st.coreAmmo = 250;
      const baseSc = st.score;
      [cx - 64, cx, cx + 64].forEach((bx, idx) => {
        st.particles.push({
          type: '${r.key}',
          nodeClass: idx === 1 ? 'corruptor_laser' : 'volatile',
          x: bx, y: Math.max(130, cy - 260 + idx * 35),
          vx: 0, speed: 0.05, headR: 28, shotHp: 3, animPhase: idx, spine: [],
          laserState: 'idle', laserSalvosLeft: 0, laserNextReady: performance.now() + 99999
        });
      });
      st.particles.push({
        type: '${r.key}', nodeClass: 'standard', x: cx + 310, y: Math.max(180, cy - 220),
        vx: 0, speed: 0.05, headR: 32, animPhase: 0.5, spine: [], _safeMarker: true
      });
      return baseSc;
    })()`);

    await cdp.key('keyDown', 'KeyA', 'a', 65);
    await sleep(340);
    const fireSt = await cdp.evalExpr(`(() => {
      const s = window.chromeSynapseGame.getState();
      const t8Center = s.playerShots.filter(sh => sh.isTier8 && sh.t8Kind === '${r.centerKind}').length;
      const t8Side = s.playerShots.filter(sh => sh.isTier8Side && sh.t8SideKind === '${r.sideKind}').length;
      const badAlive = s.particles.filter(p => ['volatile','corruptor_laser'].includes(p.nodeClass)).length;
      const safeAlive = s.particles.filter(p => p._safeMarker).length;
      return {
        gunDeployT: s.gunDeployT || 0,
        shots: s.playerShots.length,
        t8Center,
        t8Side,
        badAlive,
        safeAlive,
        scoreDelta: s.score - ${preScore}
      };
    })()`);
    await cdp.screenshot(path.join(ARTIFACT_DIR, `v428_t8_${r.key}_fire.png`));
    await cdp.key('keyUp', 'KeyA', 'a', 65);

    let relT = 1;
    for (let w = 0; w < 20; w++) {
      await sleep(50);
      relT = await cdp.evalExpr(`window.chromeSynapseGame.getState().gunDeployT || 0`);
      if (relT <= 0.02) break;
    }

    console.log(`[CHECK T8 Fire ${r.key}]`, JSON.stringify({ ...fireSt, relT }));
    if (fireSt.gunDeployT < 0.95 || fireSt.t8Center < 1 || fireSt.t8Side < 2 || relT > 0.02 || fireSt.safeAlive !== 1) {
      failures.push(`${r.key} T8 center+side fire failed: ${JSON.stringify(fireSt)} relT=${relT}`);
    }
    if (fireSt.badAlive >= 3 || fireSt.scoreDelta <= 0) {
      failures.push(`${r.key} T8 did not obliterate front hazard nodes: ${JSON.stringify(fireSt)}`);
    }
  }

  // 2. Direct Tier VII -> Tier VIII Evolution Check across all 3 Realms (zero egg revert)
  for (const r of realms) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${r.key}&tier=7` });
    for (let t = 0; t < 50; t++) {
      const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(500);
    await cdp.evalExpr(`(() => {
      const api = window.chromeSynapseGame;
      const st = api.getState();
      st.roundBanner = null;
      st.particles.length = 0;
      st.coreAmmo = 0;
      api.setTier(7, false);
      api.setPointerX(0.5);
      api.setPointerY(0.68);
    })()`);
    await sleep(220);

    await cdp.evalExpr(`window.chromeSynapseGame.setTier(8, true);`);
    await sleep(260);
    const evoMid = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
    if (r.key === 'dynamo') await cdp.screenshot(path.join(ARTIFACT_DIR, 'v428_t8_evo_dynamo.png'));

    console.log(`[CHECK T7->T8 Evo ${r.key}]`, JSON.stringify(evoMid));
    if (!evoMid.hatching || evoMid.targetTier !== 8 || evoMid.hasEggSnapshot !== false) {
      failures.push(`${r.key} T7->T8 evolution invalid: ${JSON.stringify(evoMid)}`);
    }
    await sleep(1300);
    const evoDone = await cdp.evalExpr(`window.chromeSynapseGame.getHatchState()`);
    if (evoDone.hatching || evoDone.tier !== 8) {
      failures.push(`${r.key} T7->T8 evolution failed to settle: ${JSON.stringify(evoDone)}`);
    }
  }

  // 3. Combo Progression Threshold (89 -> 90 -> T8) and HUD Pill Wrap (T8 -> T1)
  const progCheck = await cdp.evalExpr(`(() => {
    const api = window.chromeSynapseGame;
    api.setCombo(89, false);
    const t7 = api.getState().coreTier;
    api.addCombo(1, false);
    const t8 = api.getState().coreTier;
    document.getElementById('cgTierPill')?.click();
    const tWrapped = api.getState().coreTier;
    return { t7, t8, tWrapped };
  })()`);
  console.log('[CHECK T8 Progression & Wrap]', JSON.stringify(progCheck));
  if (progCheck.t7 !== 7 || progCheck.t8 !== 8 || progCheck.tWrapped !== 1) {
    failures.push('Tier VIII progression / wrap failed: ' + JSON.stringify(progCheck));
  }

  // 4. Dynamo Tier VIII Audio Check (ZERO sawtooth, richer harmonic voices than T1)
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=dynamo&tier=1` });
  for (let t = 0; t < 50; t++) {
    const ready = await cdp.evalExpr(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getState().active)`);
    if (ready) break;
    await sleep(120);
  }
  await sleep(450);

  await cdp.evalExpr(`(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    window.__audioLog = { oscs: [], filters: [] };
    if (!AC || AC.prototype.__v428Patched) return;
    AC.prototype.__v428Patched = true;
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

  await cdp.evalExpr(`(() => {
    const mBtn = document.getElementById('cgMusicBtn');
    if (mBtn && !mBtn.classList.contains('muted')) mBtn.click();
    const st = window.chromeSynapseGame.getState();
    st.roundBanner = null;
    st.particles.length = 0;
  })()`);
  await sleep(200);

  const audioByTier = {};
  for (const tier of [1, 8]) {
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
    await sleep(95);
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
        bandpassCount: filTypes.filter((x) => x === 'bandpass').length
      };
    })()`);
    const perShotVoices = res.shotDelta > 0 ? ((res.oscCount + res.bandpassCount) / res.shotDelta) : 0;
    audioByTier[tier] = { ...res, perShotVoices };
    console.log(`[CHECK Dynamo Audio T${tier}]`, JSON.stringify(audioByTier[tier]));
    if (res.shotDelta < 1 || res.sawtoothCount > 0 || res.sineCount < 2 || res.bandpassCount < 1) {
      failures.push(`Dynamo Audio T${tier} failed: ${JSON.stringify(res)}`);
    }
  }
  if (!(audioByTier[8].perShotVoices > audioByTier[1].perShotVoices)) {
    failures.push(`Dynamo T8 audio not richer than T1: ${JSON.stringify(audioByTier)}`);
  }

  if (pageErrors.length) failures.push('Page errors: ' + pageErrors.join(' | '));
  if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

  cdp.close();
  try { chrome.kill(); } catch {}
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log('=== v428 SUMMARY ===');
  console.log('Failures:', failures.length);
  for (const f of failures) console.error('FAIL:', f);
  if (failures.length > 0) process.exit(1);
  console.log('ALL v428 TIER VIII APEX CHECKS PASSED!');
}

run().catch((e) => { console.error(e); process.exit(1); });
