import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { spawn } from 'node:child_process';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SCRATCH_DIR = path.join(ROOT_DIR, 'scratch');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
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
      res.writeHead(403);
      res.end('Forbidden');
      httpErrors.push(`403 ${req.url}`);
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        if (!cleanUrl.includes('favicon')) httpErrors.push(`404 ${req.url}`);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port, httpErrors });
    });
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
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
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) {
      throw new Error('Eval error: ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }
  async key(type, code, key, keyCode) {
    await this.send('Input.dispatchKeyEvent', { type, code, key, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
  }
  async screenshot(outPath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  }
  close() {
    try { this.ws.close(); } catch (_) {}
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  const { server, port, httpErrors } = await startStaticServer();
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v406-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1280,720',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--no-first-run',
    '--no-default-browser-check',
    '--mute-audio',
    'about:blank'
  ], { stdio: 'ignore' });

  let cdp = null;
  const failures = [];
  const consoleErrors = [];

  try {
    let targetWsUrl = null;
    for (let i = 0; i < 40; i++) {
      try {
        const list = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
        const page = list.find((t) => t.type === 'page') || list[0];
        if (page && page.webSocketDebuggerUrl) {
          targetWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch (_) {}
      await sleep(150);
    }
    if (!targetWsUrl) throw new Error('Timed out waiting for Chrome DevTools');

    cdp = new CDPClient(targetWsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });

    cdp.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push('Exception: ' + JSON.stringify(msg.params));
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push('ConsoleError: ' + JSON.stringify(msg.params.args));
      }
    });

    async function loadMode(mode, tier) {
      const url = `http://127.0.0.1:${port}/index.html?arcade=${mode}&tier=${tier}&test_ammo=250`;
      await cdp.send('Page.navigate', { url });
      await sleep(1100);
      await cdp.eval(`(() => {
        if (!window._v406Hooked) {
          window._v406Hooked = true;
          window._v406CanvasTexts = [];
          const origFillText = CanvasRenderingContext2D.prototype.fillText;
          CanvasRenderingContext2D.prototype.fillText = function(txt, ...rest) {
            if (this.canvas && this.canvas.id === 'reflexCanvas') {
              window._v406CanvasTexts.push(String(txt));
            }
            return origFillText.call(this, txt, ...rest);
          };
          window._v406FrameSamples = [];
          window._v406MeasureActive = false;
          const origRAF = window.requestAnimationFrame.bind(window);
          window.requestAnimationFrame = function(cb) {
            return origRAF((ts) => {
              const t0 = performance.now();
              cb(ts);
              const dt = performance.now() - t0;
              if (window._v406MeasureActive) window._v406FrameSamples.push(dt);
            });
          };
        }
        window._v406CanvasTexts = [];
        return true;
      })()`);
      // Move pointer to upper-center safe position so ship sits cleanly mid-frame
      await cdp.eval(`(() => { window.chromeSynapseGame.setPointerX(0.5); window.chromeSynapseGame.setPointerY(0.66); })()`);
      await sleep(300);
    }

    // 1. Meteor T2 & T3 Clean Sphere Verification
    for (const tier of [2, 3]) {
      await loadMode('meteor', tier);
      const st = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { active: s.active, tier: s.coreTier, gunDeployT: s.gunDeployT || 0, offenseMode: s.offenseMode, texts: window._v406CanvasTexts.slice() };
      })()`);
      console.log(`[CHECK Meteor T${tier}]`, JSON.stringify(st));
      if (!st.active || st.tier !== tier) failures.push(`Meteor T${tier} did not activate cleanly`);
      if (st.gunDeployT > 0.02) failures.push(`Meteor T${tier} gunDeployT=${st.gunDeployT} while idle`);
      if (st.texts.length > 0) failures.push(`Meteor T${tier} drew unexpected canvas texts: ${st.texts.join(', ')}`);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v406_meteor_t${tier}.png`));

      // Verify [A] shows guns, release hides guns
      await cdp.key('keyDown', 'KeyA', 'a', 65);
      await sleep(320);
      const firingSt = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { gunDeployT: s.gunDeployT, shots: s.playerShots.length };
      })()`);
      if (tier === 3) await cdp.screenshot(path.join(SCRATCH_DIR, 'v406_meteor_t3_fireA.png'));
      await cdp.key('keyUp', 'KeyA', 'a', 65);
      await sleep(420);
      const releaseSt = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { gunDeployT: s.gunDeployT, offenseMode: s.offenseMode };
      })()`);
      console.log(`[CHECK Meteor T${tier} Gun A] fire=${JSON.stringify(firingSt)} release=${JSON.stringify(releaseSt)}`);
      if (firingSt.gunDeployT < 0.85 || firingSt.shots <= 0) failures.push(`Meteor T${tier} KeyA did not deploy/fire`);
      if (releaseSt.gunDeployT > 0.02) failures.push(`Meteor T${tier} gun failed to retract on release (${releaseSt.gunDeployT})`);
    }

    // 2. Verify sticky toggle disabled ([E], right click, #cgOffensePill) and [F] works as HOLD
    await loadMode('dynamo', 4);
    await cdp.key('keyDown', 'KeyE', 'e', 69);
    await sleep(60);
    await cdp.key('keyUp', 'KeyE', 'e', 69);
    await cdp.eval(`document.getElementById('cgOffensePill')?.click();`);
    await sleep(120);
    const stickyCheck = await cdp.eval(`window.chromeSynapseGame.getState().offenseMode`);
    if (stickyCheck !== false) failures.push('offenseMode should remain false after [E] and pill click');

    await cdp.key('keyDown', 'KeyF', 'f', 70);
    await sleep(320);
    const holdF = await cdp.eval(`(() => { const s = window.chromeSynapseGame.getState(); return { g: s.gunDeployT, sh: s.playerShots.length }; })()`);
    await cdp.key('keyUp', 'KeyF', 'f', 70);
    await sleep(420);
    const relF = await cdp.eval(`(() => { const s = window.chromeSynapseGame.getState(); return { g: s.gunDeployT, om: s.offenseMode }; })()`);
    console.log(`[CHECK KeyF Hold] hold=${JSON.stringify(holdF)} release=${JSON.stringify(relF)}`);
    if (holdF.g < 0.85 || holdF.sh <= 0) failures.push('KeyF did not hold-fire');
    if (relF.g > 0.02 || relF.om !== false) failures.push('KeyF stuck active after keyUp');

    // 3. Tier VI All 3 Modes: Idle vs Firing [A] vs Grand 3D Ultimate [D] + CPU Timing
    for (const mode of ['meteor', 'helix', 'dynamo']) {
      await loadMode(mode, 5);
      await cdp.eval(`window.chromeSynapseGame.setTier(6, false); window.chromeSynapseGame.setPointerY(0.68);`);
      await sleep(300);

      // Clear any leftover text, inspect idle state
      await cdp.eval(`window._v406CanvasTexts = [];`);
      await sleep(200);
      const t6Idle = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { tier: s.coreTier, gunDeployT: s.gunDeployT || 0, texts: window._v406CanvasTexts.slice() };
      })()`);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v406_${mode}_t6_idle.png`));
      if (t6Idle.tier !== 6) failures.push(`${mode} failed to set Tier 6`);
      if (t6Idle.gunDeployT > 0.02) failures.push(`${mode} T6 idle gunDeployT=${t6Idle.gunDeployT}`);
      if (t6Idle.texts.length > 0) failures.push(`${mode} T6 idle drew canvas texts: ${t6Idle.texts.join(', ')}`);

      // Hold [A] to deploy twin Tier VI shoulder guns
      await cdp.key('keyDown', 'KeyA', 'a', 65);
      await sleep(320);
      const t6Fire = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { gunDeployT: s.gunDeployT, shots: s.playerShots.length };
      })()`);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v406_${mode}_t6_fireA.png`));
      await cdp.key('keyUp', 'KeyA', 'a', 65);
      await sleep(420);
      if (t6Fire.gunDeployT < 0.85 || t6Fire.shots <= 0) failures.push(`${mode} T6 [A] failed to deploy/fire`);

      // Cast [D] Grand 3D Tier VI Ultimate + Benchmark CPU time
      await cdp.eval(`window._v406FrameSamples = []; window._v406MeasureActive = true; window._v406CanvasTexts = [];`);
      await cdp.key('keyDown', 'KeyD', 'd', 68);
      await sleep(60);
      await cdp.key('keyUp', 'KeyD', 'd', 68);
      await sleep(420);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v406_${mode}_t6_ult.png`));
      await sleep(1050);

      const ultStats = await cdp.eval(`(() => {
        window._v406MeasureActive = false;
        const arr = window._v406FrameSamples.slice().sort((a, b) => a - b);
        const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : -1;
        const p95 = arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.95))] : -1;
        return { count: arr.length, avg: Number(avg.toFixed(2)), p95: Number(p95.toFixed(2)), texts: window._v406CanvasTexts.slice() };
      })()`);
      console.log(`[CHECK ${mode.toUpperCase()} T6 Ult]`, JSON.stringify(ultStats));
      if (ultStats.avg < 0 || ultStats.avg >= 8.0 || ultStats.p95 >= 14.0) {
        failures.push(`${mode} T6 Ult CPU budget exceeded: avg=${ultStats.avg}ms p95=${ultStats.p95}ms`);
      }
      if (ultStats.texts.length > 0) failures.push(`${mode} T6 Ult drew canvas texts: ${ultStats.texts.join(', ')}`);
    }

    if (consoleErrors.length) failures.push('Console/Runtime errors: ' + consoleErrors.join(' | '));
    if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

    console.log('=== SUMMARY ===');
    console.log('Failures:', failures.length);
    for (const f of failures) console.error('FAIL:', f);
    if (failures.length > 0) process.exitCode = 1;
    else console.log('ALL LOCAL QA CHECKS PASSED!');
  } finally {
    if (cdp) cdp.close();
    try { chromeProc.kill(); } catch (_) {}
    server.close();
    await sleep(300);
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
