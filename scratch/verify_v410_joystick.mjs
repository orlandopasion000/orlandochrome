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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v410-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=932,430',
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
    await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

    cdp.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push('Exception: ' + JSON.stringify(msg.params));
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push('ConsoleError: ' + JSON.stringify(msg.params.args));
      }
    });

    // Wait helper so DOM + chromeSynapseGame are ready after Page.navigate
    async function waitForReady() {
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        const ok = await cdp.eval(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getTouchControls && document.getElementById('cgCanvasReflex'))`);
        if (ok) return;
        await sleep(100);
      }
      throw new Error('Timed out waiting for chromeSynapseGame');
    }

    // Test all 3 realms on iPhone 14 Pro Max Landscape (932x430)
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 932, height: 430, deviceScaleFactor: 2, mobile: true });
    for (const mode of ['meteor', 'helix', 'dynamo']) {
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${mode}&tier=6&test_ammo=250&touch_preview=1` });
      await sleep(500);
      await waitForReady();
      await cdp.eval(`(() => {
        localStorage.removeItem('oc_touch_move_mode');
        localStorage.removeItem('oc_left_handed_controls');
        const tc = window.chromeSynapseGame.getTouchControls();
        tc.setMoveMode('joystick');
        if (tc.leftHanded) tc.toggleLeftHanded();
        window.chromeSynapseGame.setTier(6, false);
        window.chromeSynapseGame.getState().roundBanner = null;
        window.chromeSynapseGame.getState().pulseMeter = 3;
        window.chromeSynapseGame.getState().isPulseReady = true;
        tc.syncSkillCooldownUI();
      })()`);
      await sleep(250);

      // 1. Geometry & Non-overlap Check
      const layout = await cdp.eval(`(() => {
        const ids = ['ocVirtualJoystick', 'ocTouchModePill', 'ocTouchGunBtn', 'ocTouchSkill2Btn', 'ocTouchUltBtn', 'ocTouchPulseBtn'];
        const rects = {};
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) return { error: 'Missing ' + id };
          const r = el.getBoundingClientRect();
          rects[id] = { x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) };
        }
        const overlaps = [];
        const keys = Object.keys(rects);
        for (let i = 0; i < keys.length; i++) {
          for (let j = i + 1; j < keys.length; j++) {
            const A = rects[keys[i]], B = rects[keys[j]];
            if (A.x < B.r - 2 && A.r > B.x + 2 && A.y < B.b - 2 && A.b > B.y + 2) {
              overlaps.push(keys[i] + '<->' + keys[j]);
            }
          }
        }
        const tc = window.chromeSynapseGame.getTouchControls();
        const s = window.chromeSynapseGame.getState();
        return { rects, overlaps, moveMode: tc.moveMode, gunDeployT: s.gunDeployT || 0, vw: window.innerWidth, vh: window.innerHeight };
      })()`);
      console.log(`[iPhone Landscape ${mode}]`, JSON.stringify({ overlaps: layout.overlaps, moveMode: layout.moveMode, gunDeployT: layout.gunDeployT, joy: layout.rects?.ocVirtualJoystick, gun: layout.rects?.ocTouchGunBtn, pulse: layout.rects?.ocTouchPulseBtn }));
      if (layout.error || (layout.overlaps && layout.overlaps.length)) failures.push(`${mode} layout invalid: ${JSON.stringify(layout)}`);
      if (layout.moveMode !== 'joystick' || layout.gunDeployT > 0.02) failures.push(`${mode} initial stick/gun state invalid`);

      await cdp.screenshot(path.join(SCRATCH_DIR, `v410_${mode}_iphone_joy_idle.png`));

      if (mode === 'meteor') {
        // 2. Test Proportional Joystick Drag (Half Right vs Full Left-Up) + Simultaneous Multi-Touch Fire!
        await cdp.eval(`window.chromeSynapseGame.setPointerX(0.50); window.chromeSynapseGame.setPointerY(0.60);`);
        await sleep(80);
        const startPos = await cdp.eval(`(() => { const s = window.chromeSynapseGame.getState(); return { x: s.catcherX, y: s.catcherY }; })()`);

        const jBox = layout.rects.ocVirtualJoystick;
        const jcx = jBox.x + jBox.w * 0.5;
        const jcy = jBox.y + jBox.h * 0.5;

        // Dispatch synthetic PointerEvent drag half-right (22px)
        await cdp.eval(`(() => {
          const j = document.getElementById('ocVirtualJoystick');
          j.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 101, pointerType: 'touch', clientX: ${jcx + 22}, clientY: ${jcy} }));
        })()`);
        await sleep(320);
        const halfMove = await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          const tc = window.chromeSynapseGame.getTouchControls();
          return { dx: +(s.catcherX - ${startPos.x}).toFixed(4), mag: tc.joyState.mag, gunDeployT: s.gunDeployT || 0 };
        })()`);

        // Full right drag (48px)
        await cdp.eval(`(() => {
          const j = document.getElementById('ocVirtualJoystick');
          j.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 101, pointerType: 'touch', clientX: ${jcx + 48}, clientY: ${jcy} }));
        })()`);
        await sleep(320);
        const fullMove = await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          const tc = window.chromeSynapseGame.getTouchControls();
          return { x: s.catcherX, mag: tc.joyState.mag, gunDeployT: s.gunDeployT || 0 };
        })()`);

        // Multi-touch: while joystick pointer 101 holds diagonal left-up, hold GUN button with pointer 102!
        const gBox = layout.rects.ocTouchGunBtn;
        await cdp.eval(`(() => {
          const j = document.getElementById('ocVirtualJoystick');
          const g = document.getElementById('ocTouchGunBtn');
          j.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 101, pointerType: 'touch', clientX: ${jcx - 34}, clientY: ${jcy - 30} }));
          g.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 102, pointerType: 'touch', clientX: ${gBox.x + gBox.w * 0.5}, clientY: ${gBox.y + gBox.h * 0.5} }));
        })()`);
        await sleep(220);
        const multiTouchSt = await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          const tc = window.chromeSynapseGame.getTouchControls();
          return { joyActive: tc.joyState.active, gunHeld: tc.isGunHeld(), gunDeployT: s.gunDeployT || 0, shots: s.playerShots.length, ammo: s.coreAmmo };
        })()`);
        await cdp.screenshot(path.join(SCRATCH_DIR, `v410_meteor_iphone_joy_fire.png`));

        // Release both pointers -> knob centers & gun retracts cleanly
        await cdp.eval(`(() => {
          const j = document.getElementById('ocVirtualJoystick');
          const g = document.getElementById('ocTouchGunBtn');
          g.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 102, pointerType: 'touch' }));
          j.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 101, pointerType: 'touch' }));
        })()`);
        await sleep(360);
        const relSt = await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          const tc = window.chromeSynapseGame.getTouchControls();
          return { joyActive: tc.joyState.active, mag: tc.joyState.mag, gunDeployT: s.gunDeployT || 0 };
        })()`);

        console.log('[JOYSTICK PHYSICS + MULTITOUCH]', JSON.stringify({ halfMove, fullMove, multiTouchSt, relSt }));
        if (halfMove.dx <= 0.02 || halfMove.gunDeployT > 0.02) failures.push('Half-drag movement or weapon hide failed: ' + JSON.stringify(halfMove));
        if (fullMove.mag <= halfMove.mag + 0.25) failures.push('Proportional magnitude curve failed');
        if (!multiTouchSt.joyActive || !multiTouchSt.gunHeld || multiTouchSt.gunDeployT < 0.9 || (multiTouchSt.shots <= 0 && multiTouchSt.ammo >= 250)) failures.push('Multi-touch joy+fire failed: ' + JSON.stringify(multiTouchSt));
        if (relSt.joyActive || relSt.mag !== 0 || relSt.gunDeployT > 0.02) failures.push('Release reset failed: ' + JSON.stringify(relSt));

        // 3. Test Mode Switcher -> ON-POINT mode
        await cdp.eval(`document.getElementById('ocModeSegOnPoint').click();`);
        await sleep(160);
        await cdp.eval(`(() => {
          const canvas = document.getElementById('cgCanvasReflex');
          const cr = canvas.getBoundingClientRect();
          canvas.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 105, pointerType: 'touch', clientX: cr.left + cr.width * 0.28, clientY: cr.top + cr.height * 0.55 }));
        })()`);
        await sleep(140);
        const onPtCheck = await cdp.eval(`(() => {
          const canvas = document.getElementById('cgCanvasReflex');
          canvas.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 105, pointerType: 'touch' }));
          const tc = window.chromeSynapseGame.getTouchControls();
          const joyRect = document.getElementById('ocVirtualJoystickWrap').getBoundingClientRect();
          return { mode: tc.moveMode, joyW: joyRect.width, catcherX: +window.chromeSynapseGame.getState().catcherX.toFixed(3) };
        })()`);
        console.log('[ON-POINT MODE SWITCH]', JSON.stringify(onPtCheck));
        await cdp.screenshot(path.join(SCRATCH_DIR, `v410_meteor_iphone_onpoint.png`));
        if (onPtCheck.mode !== 'onpoint' || onPtCheck.joyW !== 0 || Math.abs(onPtCheck.catcherX - 0.28) > 0.06) {
          failures.push('On-Point mode switch failed: ' + JSON.stringify(onPtCheck));
        }
        await cdp.eval(`document.getElementById('ocModeSegStick').click();`);
        await sleep(140);

        // 4. Test Compact iPhone SE Landscape (667x375) & Portrait (390x844) Zero Overlap!
        for (const [w, h, lbl] of [[667, 375, 'iPhoneSE_Land'], [390, 844, 'iPhone_Port']]) {
          await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
          await sleep(220);
          const ov = await cdp.eval(`(() => {
            const ids = ['ocVirtualJoystick', 'ocTouchModePill', 'ocTouchGunBtn', 'ocTouchSkill2Btn', 'ocTouchUltBtn', 'ocTouchPulseBtn'];
            const rs = ids.map((id) => ({ id, r: document.getElementById(id).getBoundingClientRect() }));
            const hits = [];
            for (let i = 0; i < rs.length; i++) {
              for (let j = i + 1; j < rs.length; j++) {
                const A = rs[i].r, B = rs[j].r;
                if (A.left < B.right - 2 && A.right > B.left + 2 && A.top < B.bottom - 2 && A.bottom > B.top + 2) {
                  hits.push(rs[i].id + '<->' + rs[j].id);
                }
              }
            }
            return { hits };
          })()`);
          console.log(`[COMPACT ${lbl}]`, JSON.stringify(ov));
          if (ov.hits.length) failures.push(`${lbl} overlap: ${JSON.stringify(ov)}`);
          if (lbl === 'iPhone_Port') await cdp.screenshot(path.join(SCRATCH_DIR, `v410_meteor_iphone_portrait.png`));
        }
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 932, height: 430, deviceScaleFactor: 2, mobile: true });
      }
    }

    // 5. Desktop HUD Check (1280x720, mobile: false, no touch_preview) -> verify luxury #ocDesktopSkillHud & ZERO touch cluster
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=dynamo&tier=6&test_ammo=250` });
    await sleep(500);
    await waitForReady();
    await cdp.eval(`window.chromeSynapseGame.setTier(6, false); window.chromeSynapseGame.getState().roundBanner = null;`);
    await sleep(200);
    const deskCheck = await cdp.eval(`(() => {
      const hasJoy = !!document.getElementById('ocVirtualJoystick');
      const dh = document.getElementById('ocDesktopSkillHud');
      return { hasJoy, deskVisible: !!(dh && !dh.classList.contains('oc-desk-hidden')) };
    })()`);
    console.log('[DESKTOP HUD CHECK]', JSON.stringify(deskCheck));
    await cdp.screenshot(path.join(SCRATCH_DIR, `v410_dynamo_desktop_hud.png`));
    if (deskCheck.hasJoy || !deskCheck.deskVisible) failures.push('Desktop HUD check failed: ' + JSON.stringify(deskCheck));

    if (consoleErrors.length) failures.push('Console errors: ' + consoleErrors.join(' | '));
    if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

    console.log('=== v410 SUMMARY ===');
    console.log('Failures:', failures.length);
    for (const f of failures) console.error('FAIL:', f);
    if (failures.length > 0) process.exitCode = 1;
    else console.log('ALL v410 VIRTUAL JOYSTICK & BUTTON CHECKS PASSED!');
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
