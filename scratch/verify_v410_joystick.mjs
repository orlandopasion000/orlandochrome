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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v411-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=393,852',
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

    async function waitForReady() {
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        const ok = await cdp.eval(`Boolean(window.chromeSynapseGame && window.chromeSynapseGame.getTouchControls && window.chromeSynapseGame.getState().active && document.getElementById('cgCanvasReflex'))`);
        if (ok) return;
        await sleep(100);
      }
      throw new Error('Timed out waiting for chromeSynapseGame');
    }

    async function measureTouchLayout() {
      return await cdp.eval(`(() => {
        const ids = ['ocVirtualJoystick', 'ocTouchModePill', 'ocTouchGunBtn', 'ocTouchSkill2Btn', 'ocTouchUltBtn', 'ocTouchPulseBtn'];
        const rects = {};
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) return { error: 'Missing ' + id };
          const r = el.getBoundingClientRect();
          rects[id] = { x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), ow: el.offsetWidth };
        }
        const wrapIds = ['ocVirtualJoystick', 'ocTouchModePill', 'ocTouchGunBtn', 'ocTouchSkill2Btn', 'ocTouchUltBtn', 'ocTouchPulseBtn'];
        const overlaps = [];
        for (let i = 0; i < wrapIds.length; i++) {
          for (let j = i + 1; j < wrapIds.length; j++) {
            const A = rects[wrapIds[i]], B = rects[wrapIds[j]];
            if (A.x < B.r - 2 && A.r > B.x + 2 && A.y < B.b - 2 && A.b > B.y + 2) {
              overlaps.push(wrapIds[i] + '<->' + wrapIds[j]);
            }
          }
        }
        // Check zone doesn't overlap right-hand buttons either
        const zone = document.getElementById('ocVirtualJoystickZone')?.getBoundingClientRect();
        if (zone) {
          for (const rb of ['ocTouchGunBtn', 'ocTouchSkill2Btn', 'ocTouchUltBtn', 'ocTouchPulseBtn']) {
            const B = rects[rb];
            if (zone.left < B.r - 2 && zone.right > B.x + 2 && zone.top < B.b - 2 && zone.bottom > B.y + 2) {
              overlaps.push('Zone<->' + rb);
            }
          }
        }
        const gunWrap = document.querySelector('.oc-pad-wrap-gun')?.getBoundingClientRect();
        const pulseWrap = document.querySelector('.oc-pad-wrap-pulse')?.getBoundingClientRect();
        const vh = window.innerHeight;
        const minBottomClearance = Math.round(Math.min(
          vh - rects.ocVirtualJoystick.b,
          gunWrap ? (vh - gunWrap.bottom) : (vh - rects.ocTouchGunBtn.b),
          pulseWrap ? (vh - pulseWrap.bottom) : (vh - rects.ocTouchPulseBtn.b)
        ));
        const tc = window.chromeSynapseGame.getTouchControls();
        const s = window.chromeSynapseGame.getState();
        return { rects, overlaps, minBottomClearance, vh, vw: window.innerWidth, moveMode: tc.moveMode, gunDeployT: s.gunDeployT || 0 };
      })()`);
    }

    // 1. iPhone Portrait (393x852) matching user screenshots for Meteor, Helix, Dynamo
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 3, mobile: true });
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
      })()`);
      await sleep(560);

      const layout = await measureTouchLayout();
      console.log(`[iPhone Portrait 393x852 ${mode}]`, JSON.stringify({ overlaps: layout.overlaps, vw: layout.vw, vh: layout.vh, joyW: layout.rects?.ocVirtualJoystick?.w, joyOW: layout.rects?.ocVirtualJoystick?.ow, minBottomClearance: layout.minBottomClearance }));
      if (layout.error || layout.overlaps.length) failures.push(`${mode} portrait overlaps: ${JSON.stringify(layout)}`);
      if ((layout.rects?.ocVirtualJoystick?.ow || 0) < 152) failures.push(`${mode} portrait joystick too small: ${layout.rects?.ocVirtualJoystick?.ow}`);
      if (layout.minBottomClearance < 26) failures.push(`${mode} portrait buttons too close to bottom: ${layout.minBottomClearance}px`);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v411_${mode}_iphone_portrait.png`));
    }

    // 2. Test Floating-Anchor Catch Zone + Snappy Velocity Curve + Multi-Touch Fire on iPhone Landscape (932x430)
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 932, height: 430, deviceScaleFactor: 2, mobile: true });
    await sleep(250);
    const landLayout = await measureTouchLayout();
    console.log('[iPhone Landscape 932x430]', JSON.stringify({ overlaps: landLayout.overlaps, joyW: landLayout.rects?.ocVirtualJoystick?.w, minBottomClearance: landLayout.minBottomClearance }));
    if (landLayout.overlaps.length || (landLayout.rects?.ocVirtualJoystick?.w || 0) < 142 || landLayout.minBottomClearance < 16) {
      failures.push('Landscape layout failed: ' + JSON.stringify(landLayout));
    }
    await cdp.screenshot(path.join(SCRATCH_DIR, `v411_dynamo_iphone_landscape.png`));

    // Floating-Origin Catch Zone Test: touch 18px up-right inside #ocVirtualJoystickZone (start at mag === 0!), then drag 20px vs 42px
    await cdp.eval(`window.chromeSynapseGame.setPointerX(0.50); window.chromeSynapseGame.setPointerY(0.62);`);
    await sleep(80);
    const zInfo = await cdp.eval(`(() => {
      const zr = document.getElementById('ocVirtualJoystickZone').getBoundingClientRect();
      const jr = document.getElementById('ocVirtualJoystick').getBoundingClientRect();
      const jcx = jr.left + jr.width * 0.5;
      const jcy = jr.top + jr.height * 0.5;
      const zone = document.getElementById('ocVirtualJoystickZone');
      // Land thumb at (jcx + 18, jcy - 12) -> floating anchor snaps here, mag MUST be 0 at touchdown!
      zone.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 201, pointerType: 'touch', clientX: jcx + 18, clientY: jcy - 12 }));
      const tc = window.chromeSynapseGame.getTouchControls();
      return { jcx, jcy, initMag: tc.joyState.mag, baseX: +tc.joyState.baseX.toFixed(1), baseY: +tc.joyState.baseY.toFixed(1) };
    })()`);
    if (zInfo.initMag !== 0 || Math.abs(zInfo.baseX - 18) > 1) {
      failures.push('Floating-origin touchdown should start at mag=0 with base shifted: ' + JSON.stringify(zInfo));
    }

    const startX = await cdp.eval(`window.chromeSynapseGame.getState().catcherX`);
    // Drag 20px right from floating origin
    await cdp.eval(`(() => {
      const zone = document.getElementById('ocVirtualJoystickZone');
      zone.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 201, pointerType: 'touch', clientX: ${zInfo.jcx + 18 + 20}, clientY: ${zInfo.jcy - 12} }));
    })()`);
    await sleep(220);
    const halfSt = await cdp.eval(`(() => {
      const s = window.chromeSynapseGame.getState();
      const tc = window.chromeSynapseGame.getTouchControls();
      return { dx: +(s.catcherX - ${startX}).toFixed(4), mag: tc.joyState.mag, gunDeployT: s.gunDeployT || 0 };
    })()`);

    // Drag full 44px left-up + simultaneous touch FIRE button!
    const gBox = landLayout.rects.ocTouchGunBtn;
    await cdp.eval(`(() => {
      const zone = document.getElementById('ocVirtualJoystickZone');
      const g = document.getElementById('ocTouchGunBtn');
      zone.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 201, pointerType: 'touch', clientX: ${zInfo.jcx + 18 - 32}, clientY: ${zInfo.jcy - 12 - 28} }));
      g.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 202, pointerType: 'touch', clientX: ${gBox.x + gBox.w * 0.5}, clientY: ${gBox.y + gBox.h * 0.5} }));
    })()`);
    await sleep(220);
    const fireSt = await cdp.eval(`(() => {
      const s = window.chromeSynapseGame.getState();
      const tc = window.chromeSynapseGame.getTouchControls();
      return { joyActive: tc.joyState.active, gunHeld: tc.isGunHeld(), gunDeployT: s.gunDeployT || 0, ammo: s.coreAmmo, shots: s.playerShots.length };
    })()`);
    await cdp.screenshot(path.join(SCRATCH_DIR, `v411_dynamo_iphone_joy_fire.png`));

    await cdp.eval(`(() => {
      const zone = document.getElementById('ocVirtualJoystickZone');
      const g = document.getElementById('ocTouchGunBtn');
      g.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 202, pointerType: 'touch' }));
      zone.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 201, pointerType: 'touch' }));
    })()`);
    await sleep(340);
    const relSt = await cdp.eval(`(() => {
      const s = window.chromeSynapseGame.getState();
      const tc = window.chromeSynapseGame.getTouchControls();
      return { joyActive: tc.joyState.active, baseX: tc.joyState.baseX, gunDeployT: s.gunDeployT || 0 };
    })()`);
    console.log('[FLOATING MLBB JOYSTICK]', JSON.stringify({ zInfo, halfSt, fireSt, relSt }));
    if (halfSt.dx <= 0.02 || halfSt.gunDeployT > 0.02) failures.push('Floating half-drag failed');
    if (!fireSt.joyActive || !fireSt.gunHeld || fireSt.gunDeployT < 0.9 || (fireSt.shots <= 0 && fireSt.ammo === 250)) failures.push('Multi-touch joy+fire failed');
    if (relSt.joyActive || relSt.baseX !== 0 || relSt.gunDeployT > 0.02) failures.push('Release reset failed');

    // 3. Test ON-POINT toggle + Compact Phones (iPhone SE Portrait 375x667 & SE Landscape 667x375)
    await cdp.eval(`document.getElementById('ocModeSegOnPoint').click();`);
    await sleep(160);
    const onPtCheck = await cdp.eval(`(() => {
      const tc = window.chromeSynapseGame.getTouchControls();
      const joyRect = document.getElementById('ocVirtualJoystickWrap').getBoundingClientRect();
      return { mode: tc.moveMode, joyW: joyRect.width };
    })()`);
    if (onPtCheck.mode !== 'onpoint' || onPtCheck.joyW !== 0) failures.push('ON-POINT toggle failed');
    await cdp.eval(`document.getElementById('ocModeSegStick').click();`);
    await sleep(140);

    for (const [w, h, lbl] of [[375, 667, 'iPhoneSE_Port'], [667, 375, 'iPhoneSE_Land']]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
      await sleep(220);
      const lay = await measureTouchLayout();
      console.log(`[COMPACT ${lbl}]`, JSON.stringify({ overlaps: lay.overlaps, joyW: lay.rects?.ocVirtualJoystick?.w, minBottomClearance: lay.minBottomClearance }));
      if (lay.overlaps.length || lay.minBottomClearance < 16) failures.push(`${lbl} compact check failed: ${JSON.stringify(lay)}`);
    }

    // 4. Desktop Check (1280x720, mobile: false)
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
    if (deskCheck.hasJoy || !deskCheck.deskVisible) failures.push('Desktop HUD check failed');

    if (consoleErrors.length) failures.push('Console errors: ' + consoleErrors.join(' | '));
    if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

    console.log('=== v411 SUMMARY ===');
    console.log('Failures:', failures.length);
    for (const f of failures) console.error('FAIL:', f);
    if (failures.length > 0) process.exitCode = 1;
    else console.log('ALL v411 MLBB/HoK VIRTUAL JOYSTICK CHECKS PASSED!');
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
