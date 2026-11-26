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
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        if (!cleanUrl.includes('favicon') && !cleanUrl.startsWith('/avatars/')) httpErrors.push(`404 ${req.url}`);
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
  close() {
    try { this.ws.close(); } catch (_) {}
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const { server, port, httpErrors } = await startStaticServer();
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v409-gif-'));
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
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 2, mobile: false });
    await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
    await cdp.send('Page.bringToFront');

    cdp.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push('Exception: ' + JSON.stringify(msg.params));
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push('ConsoleError: ' + JSON.stringify(msg.params.args));
      }
    });

    const TOTAL_FRAMES = 44;

    for (const mode of ['meteor', 'helix', 'dynamo']) {
      const outDir = path.join(SCRATCH_DIR, 'gif_frames', mode);
      fs.rmSync(outDir, { recursive: true, force: true });
      fs.mkdirSync(outDir, { recursive: true });

      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${mode}&tier=6&test_ammo=500` });
      await sleep(1300);

      // Prepare clean studio stage + CPU timing hook
      await cdp.eval(`(() => {
        window._cpuSamples = [];
        const origRAF = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = function(cb) {
          return origRAF((ts) => {
            const t0 = performance.now();
            cb(ts);
            window._cpuSamples.push(performance.now() - t0);
          });
        };
        const s = window.chromeSynapseGame.getState();
        window.chromeSynapseGame.setTier(6, false);
        s.roundBanner = null;
        s.particles.length = 0;
        window.chromeSynapseGame.setPointerX(0.50);
        window.chromeSynapseGame.setPointerY(0.62);
        return true;
      })()`);
      await sleep(300);

      // Verify idle has 0 gunDeployT
      const idleG = await cdp.eval(`window.chromeSynapseGame.getState().gunDeployT || 0`);
      if (idleG > 0.02) failures.push(`${mode} idle gunDeployT=${idleG}`);

      let keyDownSent = false;
      for (let f = 0; f < TOTAL_FRAMES; f++) {
        // Choreographed 3D flight banking S-curve (frames 0..25 weaponless idle, 26..34 active fire, 35..43 retract & settle)
        const u = f / TOTAL_FRAMES;
        const targetX = (f < 26)
          ? (0.50 + Math.sin((f / 26) * Math.PI * 2) * 0.082)
          : 0.50;
        const targetY = 0.63 - Math.sin(u * Math.PI * 2) * 0.022;

        if (f === 26 && !keyDownSent) {
          await cdp.key('keyDown', 'KeyA', 'a', 65);
          keyDownSent = true;
        } else if (f === 35 && keyDownSent) {
          await cdp.key('keyUp', 'KeyA', 'a', 65);
          keyDownSent = false;
        }

        await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          s.roundBanner = null;
          s.particles.length = 0;
          window.chromeSynapseGame.setPointerX(${targetX.toFixed(4)});
          window.chromeSynapseGame.setPointerY(${targetY.toFixed(4)});
        })()`);

        await sleep(45);

        // Extract crisp 2x Retina close-up (760x570 physical -> 560x420 studio frame) centered on Tier VI hero
        const dataUrl = await cdp.eval(`(() => {
          const src = document.querySelector('#chromeGameModal canvas') || document.getElementById('cgCanvas');
          if (!src) throw new Error('Arcade canvas not found');
          if (!window._cropCanvas) {
            window._cropCanvas = document.createElement('canvas');
            window._cropCanvas.width = 560;
            window._cropCanvas.height = 420;
          }
          const cc = window._cropCanvas;
          const g = cc.getContext('2d');
          g.imageSmoothingEnabled = true;
          g.imageSmoothingQuality = 'high';
          g.fillStyle = '#05070f';
          g.fillRect(0, 0, 560, 420);
          const cropW = Math.round(380 * (window.devicePixelRatio || 1));
          const cropH = Math.round(285 * (window.devicePixelRatio || 1));
          const sx = Math.max(0, Math.min(src.width - cropW, Math.round(src.width * 0.50 - cropW * 0.5)));
          const sy = Math.max(0, Math.min(src.height - cropH, Math.round(src.height * 0.625 - cropH * 0.54)));
          g.drawImage(src, sx, sy, cropW, cropH, 0, 0, 560, 420);
          return cc.toDataURL('image/png');
        })()`);

        const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(path.join(outDir, `frame_${String(f).padStart(2, '0')}.png`), Buffer.from(b64, 'base64'));
      }

      if (keyDownSent) await cdp.key('keyUp', 'KeyA', 'a', 65);
      await sleep(200);

      const perf = await cdp.eval(`(() => {
        const arr = (window._cpuSamples || []).slice().sort((a, b) => a - b);
        const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : -1;
        const p95 = arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.95))] : -1;
        const gunEnd = window.chromeSynapseGame.getState().gunDeployT || 0;
        return { samples: arr.length, avg: Number(avg.toFixed(2)), p95: Number(p95.toFixed(2)), gunEnd };
      })()`);
      console.log(`[CAPTURED ${mode.toUpperCase()} 3D GIF FRAMES]`, JSON.stringify(perf));
      if (perf.avg < 0 || perf.avg >= 8.0 || perf.p95 >= 14.0) {
        failures.push(`${mode} 3D CPU budget exceeded: ${JSON.stringify(perf)}`);
      }
      if (perf.gunEnd > 0.02) {
        failures.push(`${mode} gun failed to retract after GIF sequence (${perf.gunEnd})`);
      }
    }

    if (consoleErrors.length) failures.push('Console/Runtime errors: ' + consoleErrors.join(' | '));
    if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

    if (failures.length) {
      for (const f of failures) console.error('FAIL:', f);
      process.exitCode = 1;
    } else {
      console.log('ALL 3 TIER VI 3D FRAME SEQUENCES CAPTURED & VERIFIED!');
    }
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
