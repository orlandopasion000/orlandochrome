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
      httpErrors.push(`403 ${req.url}`);
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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v408-'));
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

    // 1. Verify Topbar Hover Presentation Cards use Character Showcase Render
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await sleep(1200);
    const btnMap = { dynamo: '#btnLaunchGame', helix: '#btnLaunchHelixGame', meteor: '#btnLaunchMeteorGame' };
    for (const [mode, sel] of Object.entries(btnMap)) {
      const portalInfo = await cdp.eval(`(() => {
        const btn = document.querySelector('${sel}');
        btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        const card = document.getElementById('ocRealmPortalCard');
        const title = document.getElementById('ocPortalTitle')?.textContent || '';
        const tag = document.getElementById('ocPortalTierTag')?.textContent || '';
        const c = document.getElementById('ocPortalCanvas');
        return { visible: card?.classList.contains('visible'), title, tag, cw: c?.width || 0, ch: c?.height || 0 };
      })()`);
      await sleep(220);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v408_portal_${mode}.png`));
      console.log(`[CHECK Portal ${mode}]`, JSON.stringify(portalInfo));
      if (!portalInfo.visible || !portalInfo.tag.includes('SHOWCASE')) {
        failures.push(`Portal ${mode} did not display Tier VI Showcase card`);
      }
      await cdp.eval(`document.querySelector('${sel}')?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))`);
    }

    async function waitForGunState(expectActive) {
      const deadline = Date.now() + 1200;
      let last = null;
      while (Date.now() < deadline) {
        last = await cdp.eval(`(() => {
          const s = window.chromeSynapseGame.getState();
          return { gunDeployT: s.gunDeployT || 0, shots: s.playerShots.length, ammo: s.coreAmmo };
        })()`);
        if (expectActive ? (last.gunDeployT >= 0.95 && last.shots > 0) : (last.gunDeployT <= 0.02)) {
          return last;
        }
        await sleep(50);
      }
      return last;
    }

    // 2. Verify In-Game Model vs Strict Idle Weapon Hiding (Idle, 0-Ammo Hold, Active Firing, Skill Cast) + Debrief Presentation Stage
    for (const mode of ['meteor', 'helix', 'dynamo']) {
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html?arcade=${mode}&tier=6&test_ammo=250` });
      await sleep(1200);
      await cdp.eval(`(() => {
        window.chromeSynapseGame.setTier(6, false);
        window.chromeSynapseGame.setPointerX(0.5);
        window.chromeSynapseGame.setPointerY(0.66);
      })()`);
      await sleep(250);

      const idleSt = await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        return { tier: s.coreTier, maxTier: s.maxTierReached, gunDeployT: s.gunDeployT || 0 };
      })()`);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v408_${mode}_ingame_idle.png`));
      await sleep(80);
      if (idleSt.tier !== 6 || idleSt.gunDeployT > 0.02) failures.push(`${mode} In-Game idle invalid: ${JSON.stringify(idleSt)}`);

      // Test dry hold with 0 ammo -> must keep weapon strictly hidden (gunDeployT === 0)!
      await cdp.eval(`window.chromeSynapseGame.getState().coreAmmo = 0;`);
      await cdp.key('keyDown', 'KeyA', 'a', 65);
      await sleep(250);
      const dryHoldT = await cdp.eval(`window.chromeSynapseGame.getState().gunDeployT || 0`);
      await cdp.key('keyUp', 'KeyA', 'a', 65);
      await sleep(120);
      if (dryHoldT > 0.02) failures.push(`${mode} dry-hold at 0 ammo deployed weapon (${dryHoldT})`);

      // Restore ammo & test active firing -> weapon deploys (gunDeployT === 1), then retracts to 0 on release!
      await cdp.eval(`window.chromeSynapseGame.getState().coreAmmo = 250;`);
      await cdp.key('keyDown', 'KeyA', 'a', 65);
      const fireSt = await waitForGunState(true);
      await cdp.screenshot(path.join(SCRATCH_DIR, `v408_${mode}_ingame_fire.png`));
      await cdp.key('keyUp', 'KeyA', 'a', 65);
      const relSt = await waitForGunState(false);
      console.log(`[CHECK In-Game ${mode}] idle=${idleSt.gunDeployT} dryHold=${dryHoldT} fire=${fireSt.gunDeployT} rel=${relSt.gunDeployT}`);
      if (fireSt.gunDeployT < 0.95 || fireSt.shots <= 0) failures.push(`${mode} active fire failed`);
      if (relSt.gunDeployT > 0.02) failures.push(`${mode} release retract failed`);

      // Trigger Post-Sortie Presentation Overlay (deplete lives cleanly via hazard/last-life simulation) to verify Showcase Stage & TIER VI
      await cdp.eval(`(() => {
        const s = window.chromeSynapseGame.getState();
        s.score = 64000;
        s.reflexLives = 1;
        s.particles.push({ x: 640, y: 475, vx: 0, vy: 2, radius: 28, nodeClass: 'corruptor_laser', type: '${mode}' });
      })()`);
      await sleep(450);
      const debriefInfo = await cdp.eval(`(() => {
        const ov = document.getElementById('cgScreenOverlay');
        const img = document.getElementById('cgRealmEmblemImg');
        const tierTxt = document.getElementById('cgGoTier')?.textContent || '';
        const wrap = document.getElementById('cgRealmEmblemWrap');
        return {
          shown: ov?.style.display === 'flex',
          src: img?.getAttribute('src') || '',
          hasStageClass: wrap?.classList.contains('oc-showcase-stage') || false,
          tierTxt
        };
      })()`);
      console.log(`[CHECK Debrief Showcase ${mode}]`, JSON.stringify(debriefInfo));
      await cdp.screenshot(path.join(SCRATCH_DIR, `v408_debrief_${mode}.png`));
      if (!debriefInfo.shown || !debriefInfo.src.includes(`core-${mode}-t6-showcase.png`) || debriefInfo.tierTxt !== 'TIER VI') {
        failures.push(`Debrief Showcase ${mode} check failed: ${JSON.stringify(debriefInfo)}`);
      }
    }

    if (consoleErrors.length) failures.push('Console/Runtime errors: ' + consoleErrors.join(' | '));
    if (httpErrors.length) failures.push('HTTP errors: ' + httpErrors.join(' | '));

    console.log('=== SUMMARY ===');
    console.log('Failures:', failures.length);
    for (const f of failures) console.error('FAIL:', f);
    if (failures.length > 0) process.exitCode = 1;
    else console.log('ALL v408 SHOWCASE & IN-GAME CHECKS PASSED!');
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
