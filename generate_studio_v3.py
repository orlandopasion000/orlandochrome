import os

studio_path = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

html_code = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chrome Arcade · Tier VI–X Living Skeletal Motion Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020408;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Consolas", monospace;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100vh;
      user-select: none;
    }

    /* Top Studio Header */
    #topbar {
      min-height: 56px;
      background: rgba(10, 15, 28, 0.96);
      border-bottom: 1px solid rgba(56, 189, 248, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 18px;
      z-index: 100;
      backdrop-filter: blur(12px);
      flex-wrap: wrap;
      gap: 10px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #fff;
    }
    .brand-sub {
      font-size: 10px;
      color: #38bdf8;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Controls */
    .controls-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .btn-pill {
      background: rgba(30, 41, 59, 0.75);
      border: 1px solid rgba(100, 116, 139, 0.4);
      color: #94a3b8;
      padding: 5px 11px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-pill:hover {
      background: rgba(51, 65, 85, 0.9);
      color: #fff;
      border-color: rgba(56, 189, 248, 0.5);
    }
    .btn-pill.active {
      background: rgba(14, 165, 233, 0.25);
      color: #38bdf8;
      border-color: #38bdf8;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
    }
    .btn-pill.active-dynamo {
      background: rgba(168, 85, 247, 0.25);
      color: #c084fc;
      border-color: #c084fc;
      box-shadow: 0 0 12px rgba(192, 132, 252, 0.3);
    }
    .btn-pill.active-helix {
      background: rgba(6, 182, 212, 0.25);
      color: #22d3ee;
      border-color: #22d3ee;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.3);
    }
    .btn-pill.active-meteor {
      background: rgba(249, 115, 22, 0.25);
      color: #fb923c;
      border-color: #fb923c;
      box-shadow: 0 0 12px rgba(251, 146, 60, 0.3);
    }

    /* Main Viewport */
    #viewport-container {
      flex: 1;
      position: relative;
      background: #010204;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* Floating Telemetry HUD */
    #telemetry-panel {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(10, 14, 26, 0.94);
      border: 1px solid rgba(56, 189, 248, 0.28);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 10px;
      font-family: monospace;
      color: #cbd5e1;
      backdrop-filter: blur(10px);
      pointer-events: none;
      min-width: 320px;
      max-width: 380px;
      line-height: 1.6;
      box-shadow: 0 8px 32px rgba(0,0,0,0.55);
      z-index: 40;
    }
    #telemetry-panel .val {
      color: #38bdf8;
      font-weight: 700;
      float: right;
    }
    #telemetry-panel .title {
      font-weight: 700;
      color: #fff;
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(56, 189, 248, 0.25);
      padding-bottom: 3px;
      font-size: 11.5px;
      letter-spacing: 0.5px;
    }

    /* Overlay Toggles */
    #overlay-toggles {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 50;
    }
    .toggle-pill {
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(100, 116, 139, 0.4);
      color: #cbd5e1;
      padding: 5px 11px;
      border-radius: 6px;
      font-size: 10.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .toggle-pill.active {
      border-color: #38bdf8;
      background: rgba(14, 165, 233, 0.25);
      color: #fff;
    }
    .toggle-pill.active-gold {
      border-color: #fbbf24;
      background: rgba(251, 191, 36, 0.25);
      color: #fbbf24;
    }

    /* Benchmark Sequencer Bar */
    #sequence-bar {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 14, 26, 0.94);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 14px;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(14px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.65);
      z-index: 50;
      max-width: 96vw;
      overflow-x: auto;
    }
    .seq-step-pill {
      font-size: 10px;
      font-family: monospace;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(30, 41, 59, 0.6);
      color: #94a3b8;
      border: 1px solid transparent;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .seq-step-pill.current {
      background: rgba(56, 189, 248, 0.25);
      color: #38bdf8;
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
      font-weight: 700;
    }
    .seq-play-btn {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border: 1px solid #38bdf8;
      color: #fff;
      font-weight: 700;
      font-size: 11px;
      padding: 5px 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .seq-play-btn:hover {
      background: linear-gradient(135deg, #0369a1, #075985);
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.5);
    }

    /* Responsive */
    @media (max-width: 1000px) {
      .brand { display: none; }
      #telemetry-panel { font-size: 9px; min-width: 220px; top: 6px; left: 6px; }
      #overlay-toggles { top: 6px; right: 6px; }
      #sequence-bar { bottom: 8px; padding: 4px 8px; gap: 4px; }
    }
  </style>
</head>
<body>
  <div id="topbar">
    <div class="brand">
      <div>
        <div class="brand-title">CHROME ARCADE · TIER VI–X LIVING SKELETAL MOTION STUDIO</div>
        <div class="brand-sub">Active Wingbeat Engine · Organic Blinking · 2.5x Close-Up Inspection</div>
      </div>
    </div>

    <!-- Realm Selector -->
    <div class="controls-group" id="realm-group">
      <button class="btn-pill active active-dynamo" data-realm="dynamo">⚡ Dynamo Princess</button>
      <button class="btn-pill" data-realm="helix">🧬 Helix Unicorn</button>
      <button class="btn-pill" data-realm="meteor">🔥 Meteor Dragon</button>
    </div>

    <!-- Tier Selector -->
    <div class="controls-group" id="tier-group">
      <button class="btn-pill" data-tier="V">Tier V (Ref)</button>
      <button class="btn-pill active" data-tier="VI">Tier VI</button>
      <button class="btn-pill" data-tier="VII">Tier VII</button>
      <button class="btn-pill" data-tier="VIII">Tier VIII</button>
      <button class="btn-pill" data-tier="IX">Tier IX</button>
      <button class="btn-pill" data-tier="X">Tier X</button>
    </div>
  </div>

  <div id="viewport-container">
    <canvas id="viewCanvas" width="1920" height="1080"></canvas>

    <!-- Telemetry Panel -->
    <div id="telemetry-panel">
      <div class="title" id="tel-title">DYNAMO PRINCESS · TIER VI</div>
      <div>Steering State: <span class="val" id="tel-state">HOVER IDLE</span></div>
      <div>Facing & Volume: <span class="val" id="tel-facing">RIGHT 3/4 (100% VOL)</span></div>
      <div>Catch Point (X, Y): <span class="val" id="tel-pos">960, 780</span></div>
      <div>Velocity & Accel: <span class="val" id="tel-vel">Vx 0.0, Ax 0.0</span></div>
      <div>Gaze Lead & Blinking: <span class="val" id="tel-eyes">ATTENTIVE (OPEN)</span></div>
      <div>Active Wing Stroke: <span class="val" id="tel-wings">DOWNSTROKE (+18.4°)</span></div>
      <div>Weapon State & Aim: <span class="val" id="tel-weapon">AIM LOCKED (0°)</span></div>
      <div>Living Gait / Wingbeat: <span class="val" id="tel-gait">HOVER BREATH</span></div>
      <div>Camera Viewport Scale: <span class="val" id="tel-cam">1.0x GAMEPLAY</span></div>
      <div>Collision Catch Status: <span class="val" id="tel-catch" style="color:#22c55e;">28px ROCK-STEADY</span></div>
    </div>

    <!-- Overlay Toggles -->
    <div id="overlay-toggles">
      <button class="toggle-pill" id="toggle-closeup">🔍 2.5x Close-Up Inspection Mode</button>
      <button class="toggle-pill active" id="toggle-t5-ghost">👻 Show Tier V Reference Ghost</button>
      <button class="toggle-pill active" id="toggle-catch-point">🎯 Show Catch Point & 28px Radius</button>
      <button class="toggle-pill" id="toggle-skeletal-mesh">📐 Show Skeletal Rig Pivots</button>
      <button class="toggle-pill" id="toggle-silhouette">🖤 Silhouette Only Mode</button>
      <button class="toggle-pill" id="toggle-hatch-cinematic">✨ Play Grand Hatching (Tier V → VI)</button>
      <button class="toggle-pill" id="toggle-pause-turn">⏸️ Pause Turn Midpoint (Space)</button>
    </div>

    <!-- Canonical 7-Stage Benchmark Sequencer Bar (23s Duration) -->
    <div id="sequence-bar">
      <button class="seq-play-btn" id="btn-run-benchmark">▶ Play Canonical Benchmark (23s)</button>
      <div class="seq-step-pill" id="seq-step-hover">1. Stationary Hover (3s)</div>
      <div class="seq-step-pill" id="seq-step-left-start">2. Leftward Start (2.5s)</div>
      <div class="seq-step-pill" id="seq-step-left-sustained">3. Sustained Left Pass (5s)</div>
      <div class="seq-step-pill" id="seq-step-reversal-right">4. Sharp Reversal Right (3s)</div>
      <div class="seq-step-pill" id="seq-step-climb">5. Climb (2.5s)</div>
      <div class="seq-step-pill" id="seq-step-descend-brake">6. Braking Descent (2.5s)</div>
      <div class="seq-step-pill" id="seq-step-hover-hold">7. Return to Hover (4.5s)</div>
    </div>
  </div>

  <script>
    // Studio State
    const state = {
      realm: 'dynamo',
      tier: 'VI',
      showT5Ghost: true,
      showCatchPoint: true,
      showSkeletalMesh: false,
      silhouetteMode: false,
      isPausedTurnMidpoint: false,
      isCloseUpMode: false,
      camZoom: 1.0,
      
      // Hatching Cinematic State
      hatchRunning: false,
      hatchTime: 0,

      // Benchmark Sequencer State
      benchmarkRunning: false,
      benchmarkTime: 0,
      
      // Kinematic Player Model
      player: {
        x: 960,
        y: 780,
        targetX: 960,
        targetY: 780,
        vx: 0,
        vy: 0,
        prevVx: 0,
        ax: 0,
        
        // Rigging Variables
        facingDir: 1.0,           // +1 for right, -1 for left
        yaw: 0.0,                 // True 3D Yaw Angle (-1.0 to +1.0)
        bodyBank: 0,              // Symmetrical bank angle
        headAngle: 0,             // Eyes and head lead turn
        shoulderBank: 0,          // Shoulder line tilt
        pitchAngle: 0,            // Vertical climb/descend pitch
        
        // Eye Tracking & Blinking System
        eyeDx: 0,
        eyeDy: 0,
        blinkTimer: 0,
        blinkDuration: 0.18,
        blinkClosed: 0.0,         // 0: Open, 1: Fully Closed
        
        // Active Wingbeat Engine (Continuous living stroke!)
        wingCycle: 0,             // Continuous wingbeat stroke phase (1.1 Hz)
        wingFlapAngle: 0,         // Dynamic stroke displacement (-20° to +32°)
        wingTipFlex: 0,           // Aerodynamic tip feather trail flex
        leftWingAngle: 0,
        rightWingAngle: 0,
        brakeFlare: 0,
        breathPhase: 0,
        
        // Character Specific
        // Dynamo Princess
        cannonAim: 0,
        recoilTimer: 0,
        recoilKick: 0,
        kneeFlex: 0,
        bootDrift: 0,
        flowAngle: 0,
        
        // Helix Unicorn
        canterPhase: 0,
        canterLead: 1.0,          // +1.0 for Right Lead, -1.0 for Left Lead
        canterGaitBeat: 0,        // 0: Hover, 1: Trailing Hind, 2: Diagonal, 3: Leading Fore, 4: Suspension
        legFlap: [0, 0, 0, 0],    // [LF, RF, LH, RH]
        neckBob: 0,
        tailPhase: 0,
        
        // Meteor Dragon
        dragonStroke: 0,          // 0: Downstroke, 1: Recovery, 2: Glide
        clawsTucked: 0.0,         // 0: Spread/Hover, 1: Tucked/Speed
        tailChain: [0, 0, 0, 0, 0], // 5-joint spine and tail chain
        flameParticles: []
      },

      keys: { left: false, right: false, up: false, down: false, fire: false }
    };

    // Asset Manifest Loading
    const images = {};
    const assetManifest = {
      'node_dynamo': 'assets/node-dynamo-t4.png',
      'node_helix': 'assets/node-helix-t4.png',
      'node_meteor': 'assets/node-meteor-t4.png',
      'hazard_dynamo': 'assets/hazard-dynamo-t4.png',
      'hazard_helix': 'assets/hazard-helix-t4.png',
      'hazard_meteor': 'assets/hazard-meteor-t4.png',

      'dynamo_v': 'assets/characters/dynamo_v.jpg',
      'helix_v': 'assets/characters/helix_v.jpg',
      'meteor_v': 'assets/characters/meteor_v.jpg'
    };

    ['dynamo', 'helix', 'meteor'].forEach(game => {
      ['vi', 'vii', 'viii', 'ix', 'x'].forEach(tier => {
        const k = `${game}_${tier}`;
        assetManifest[k] = `assets/characters/${k}.png`;
        assetManifest[`${k}_body`] = `assets/characters/rigs/${k}_body.png`;
        assetManifest[`${k}_head`] = `assets/characters/rigs/${k}_head.png`;
        assetManifest[`${k}_wing_l`] = `assets/characters/rigs/${k}_wing_l.png`;
        assetManifest[`${k}_wing_r`] = `assets/characters/rigs/${k}_wing_r.png`;
        assetManifest[`${k}_dir_left`] = `assets/characters/rigs/${k}_dir_left.png`;
        assetManifest[`${k}_dir_right`] = `assets/characters/rigs/${k}_dir_right.png`;
        assetManifest[`${k}_dir_turn`] = `assets/characters/rigs/${k}_dir_turn.png`;
      });
    });

    let loadedCount = 0;
    const totalAssets = Object.keys(assetManifest).length;
    for (const [key, url] of Object.entries(assetManifest)) {
      const img = new Image();
      img.onload = () => loadedCount++;
      img.src = url;
      images[key] = img;
    }

    const canvas = document.getElementById('viewCanvas');
    const ctx = canvas.getContext('2d');

    // UI Event Handlers
    document.getElementById('realm-group').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-pill');
      if (!btn) return;
      document.querySelectorAll('#realm-group .btn-pill').forEach(b => b.className = 'btn-pill');
      state.realm = btn.dataset.realm;
      btn.classList.add('active', `active-${state.realm}`);
      updateTelemetryTitle();
    });

    document.getElementById('tier-group').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-pill');
      if (!btn) return;
      document.querySelectorAll('#tier-group .btn-pill').forEach(b => b.classList.remove('active'));
      state.tier = btn.dataset.tier;
      btn.classList.add('active');
      updateTelemetryTitle();
    });

    document.getElementById('toggle-closeup').addEventListener('click', function() {
      state.isCloseUpMode = !state.isCloseUpMode;
      this.classList.toggle('active', state.isCloseUpMode);
      document.getElementById('tel-cam').textContent = state.isCloseUpMode ? '2.5x CLOSE-UP' : '1.0x GAMEPLAY';
    });
    document.getElementById('toggle-t5-ghost').addEventListener('click', function() {
      state.showT5Ghost = !state.showT5Ghost;
      this.classList.toggle('active', state.showT5Ghost);
    });
    document.getElementById('toggle-catch-point').addEventListener('click', function() {
      state.showCatchPoint = !state.showCatchPoint;
      this.classList.toggle('active', state.showCatchPoint);
    });
    document.getElementById('toggle-skeletal-mesh').addEventListener('click', function() {
      state.showSkeletalMesh = !state.showSkeletalMesh;
      this.classList.toggle('active', state.showSkeletalMesh);
    });
    document.getElementById('toggle-silhouette').addEventListener('click', function() {
      state.silhouetteMode = !state.silhouetteMode;
      this.classList.toggle('active', state.silhouetteMode);
    });
    document.getElementById('toggle-pause-turn').addEventListener('click', function() {
      togglePauseTurn();
    });
    document.getElementById('toggle-hatch-cinematic').addEventListener('click', function() {
      startHatchingCinematic();
    });

    function togglePauseTurn() {
      state.isPausedTurnMidpoint = !state.isPausedTurnMidpoint;
      const btn = document.getElementById('toggle-pause-turn');
      btn.classList.toggle('active', state.isPausedTurnMidpoint);
      if (state.isPausedTurnMidpoint) {
        state.player.yaw = 0.0; // Force exact midpoint 3/4 depth pose!
        state.player.bodyBank = 0.22;
        state.player.headAngle = -0.32; // Head looking left!
        document.getElementById('tel-state').textContent = 'PAUSED TURN MIDPOINT (3/4 DEPTH)';
      }
    }

    function startHatchingCinematic() {
      state.hatchRunning = true;
      state.hatchTime = 0;
      state.benchmarkRunning = false;
      document.getElementById('toggle-hatch-cinematic').classList.add('active-gold');
      document.getElementById('tel-state').textContent = 'HATCHING: TIER V → TIER VI';
    }

    // Keyboard & Mouse Controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.keys.down = true;
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
        state.keys.fire = true;
        state.player.recoilKick = 1.0;
      }
      if (e.key === 'p' || e.key === 'P') togglePauseTurn();
      if (e.key === 'c' || e.key === 'C') {
        state.isCloseUpMode = !state.isCloseUpMode;
        document.getElementById('toggle-closeup').classList.toggle('active', state.isCloseUpMode);
        document.getElementById('tel-cam').textContent = state.isCloseUpMode ? '2.5x CLOSE-UP' : '1.0x GAMEPLAY';
      }
      if (e.key === 'h' || e.key === 'H') startHatchingCinematic();
      if (e.key === 'b' || e.key === 'B') {
        if (state.benchmarkRunning) stopBenchmark();
        else startBenchmarkSequence();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.keys.down = false;
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') state.keys.fire = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (state.benchmarkRunning || state.isPausedTurnMidpoint || state.hatchRunning) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      state.player.targetX = (e.clientX - rect.left) * scaleX;
      state.player.targetY = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', () => {
      state.player.recoilKick = 1.0;
    });

    document.getElementById('btn-run-benchmark').addEventListener('click', () => {
      if (state.benchmarkRunning) stopBenchmark();
      else startBenchmarkSequence();
    });

    function updateTelemetryTitle() {
      const realmNames = { dynamo: 'DYNAMO PRINCESS', helix: 'HELIX UNICORN', meteor: 'METEOR DRAGON' };
      document.getElementById('tel-title').textContent = `${realmNames[state.realm]} · TIER ${state.tier}`;
    }

    // Benchmark Controls
    function startBenchmarkSequence() {
      state.benchmarkRunning = true;
      state.benchmarkTime = 0;
      state.hatchRunning = false;
      state.isPausedTurnMidpoint = false;
      document.getElementById('btn-run-benchmark').textContent = '⏹ Stop Benchmark';
      state.player.x = 960;
      state.player.y = 780;
      state.player.targetX = 960;
      state.player.targetY = 780;
      state.player.vx = 0;
      state.player.vy = 0;
      state.player.yaw = 0.5;
    }

    function stopBenchmark() {
      state.benchmarkRunning = false;
      state.benchmarkTime = 0;
      document.getElementById('btn-run-benchmark').textContent = '▶ Play Canonical Benchmark (23s)';
      document.querySelectorAll('.seq-step-pill').forEach(p => p.classList.remove('current'));
    }

    // ─── CANONICAL 7-STAGE BENCHMARK TIMELINE SEQUENCER (23s) ───
    function updateBenchmarkTimeline(dt) {
      if (!state.benchmarkRunning) return;

      state.benchmarkTime += dt;
      const t = state.benchmarkTime;
      const p = state.player;

      const steps = [
        { id: 'seq-step-hover', start: 0.0, end: 3.0, label: '1. STATIONARY HOVER (BREATHING & POISE)' },
        { id: 'seq-step-left-start', start: 3.0, end: 5.5, label: '2. LEFTWARD START (HEAD LEADS, WINGS BANK)' },
        { id: 'seq-step-left-sustained', start: 5.5, end: 10.5, label: '3. SUSTAINED LEFT PASS (5s! FACING LEFT)' },
        { id: 'seq-step-reversal-right', start: 10.5, end: 13.5, label: '4. SHARP REVERSAL RIGHT (DEPTH TURN & LEAD CHANGE)' },
        { id: 'seq-step-climb', start: 13.5, end: 16.0, label: '5. CLIMB (AERODYNAMIC COMPRESSION)' },
        { id: 'seq-step-descend-brake', start: 16.0, end: 18.5, label: '6. BRAKING DESCENT (BRAKE FLARE & CLAWS/BOOTS DRIFT)' },
        { id: 'seq-step-hover-hold', start: 18.5, end: 23.0, label: '7. RETURN TO HOVER (HELD 2 WINGBEATS)' }
      ];

      steps.forEach(s => {
        const el = document.getElementById(s.id);
        if (t >= s.start && t < s.end) {
          el.classList.add('current');
          document.getElementById('tel-state').textContent = s.label;
        } else {
          el.classList.remove('current');
        }
      });

      if (t < 3.0) {
        p.targetX = 960; p.targetY = 780;
      } else if (t < 5.5) {
        p.targetX = 680; p.targetY = 780;
      } else if (t < 10.5) {
        p.targetX = 380; p.targetY = 780;
      } else if (t < 13.5) {
        p.targetX = 1540; p.targetY = 780;
      } else if (t < 16.0) {
        p.targetX = 1100; p.targetY = 520;
      } else if (t < 18.5) {
        p.targetX = 960; p.targetY = 860;
      } else if (t < 23.0) {
        p.targetX = 960; p.targetY = 780;
      } else {
        stopBenchmark();
      }
    }

    // ─── TIER V → TIER VI HATCHING CINEMATIC SEQUENCER ───
    function updateHatchingCinematic(dt) {
      if (!state.hatchRunning) return;
      state.hatchTime += dt;
      const ht = state.hatchTime;
      const p = state.player;
      p.targetX = 960;
      p.targetY = 780;

      if (ht < 2.0) {
        document.getElementById('tel-state').textContent = 'HATCHING 1/4: TIER V EGG GATHERING ENERGY';
      } else if (ht < 4.0) {
        document.getElementById('tel-state').textContent = 'HATCHING 2/4: WINGS FOLD AROUND EGG SHELL';
      } else if (ht < 6.0) {
        document.getElementById('tel-state').textContent = 'HATCHING 3/4: SHELL CRACKS & REVEALS TIER VI';
      } else if (ht < 8.0) {
        document.getElementById('tel-state').textContent = 'HATCHING 4/4: TIER VI SPREADS WINGS & RECOVERY';
      } else {
        state.hatchRunning = false;
        document.getElementById('toggle-hatch-cinematic').classList.remove('active-gold');
        document.getElementById('tel-state').textContent = 'TIER VI GRAND ENTRANCE COMPLETE';
      }
    }

    // ─── KINEMATICS, ACTIVE WINGBEAT & BLINKING ENGINE ───
    function updatePhysics(dt) {
      const p = state.player;

      // Camera Zoom Smoothing
      const targetCam = state.isCloseUpMode ? 2.5 : 1.0;
      state.camZoom += (targetCam - state.camZoom) * 8.0 * dt;

      if (state.isPausedTurnMidpoint) return;

      if (!state.benchmarkRunning && !state.hatchRunning) {
        const speed = 15.0;
        if (state.keys.left) p.targetX -= speed * 48 * dt;
        if (state.keys.right) p.targetX += speed * 48 * dt;
        if (state.keys.up) p.targetY -= speed * 38 * dt;
        if (state.keys.down) p.targetY += speed * 38 * dt;
        p.targetX = Math.max(280, Math.min(1640, p.targetX));
        p.targetY = Math.max(460, Math.min(940, p.targetY));
        document.getElementById('tel-state').textContent = 'MANUAL STEER';
      }

      // Smooth damped spring-damper following (Chest core stays locked to catch point!)
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      
      const prevVx = p.vx;
      p.vx = (p.vx + dx * 13.5 * dt) * Math.pow(0.74, dt * 60);
      p.vy = (p.vy + dy * 13.5 * dt) * Math.pow(0.74, dt * 60);
      
      p.ax = (p.vx - prevVx) / Math.max(0.001, dt);
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Symmetrical Normalized Velocity & Acceleration
      const normVx = Math.max(-1.0, Math.min(1.0, p.vx / 14.0));
      const normVy = Math.max(-1.0, Math.min(1.0, p.vy / 12.0));
      const normAx = Math.max(-1.0, Math.min(1.0, p.ax / 80.0));

      // 1. True 3D Yaw Angle (-1.0 Left to +1.0 Right)
      const targetYaw = normVx < -0.15 ? -1.0 : normVx > 0.15 ? 1.0 : p.yaw > 0 ? 0.3 : -0.3;
      p.yaw += (targetYaw - p.yaw) * 8.5 * dt;

      // 2. Eyes Lead the Turn + Organic Blinking System (New Improvement!)
      // Eyes acquire target before head finishes turning!
      const targetEyeX = Math.max(-8, Math.min(8, p.vx * 0.45));
      const targetEyeY = Math.max(-6, Math.min(6, p.vy * 0.40));
      p.eyeDx += (targetEyeX - p.eyeDx) * 16.0 * dt;
      p.eyeDy += (targetEyeY - p.eyeDy) * 16.0 * dt;

      // Natural Blinking Cycle (Every 3.5 - 5s, closes for 160ms)
      p.blinkTimer += dt;
      if (p.blinkTimer > 4.2) {
        if (p.blinkTimer > 4.2 + 0.16) {
          p.blinkTimer = 0;
          p.blinkClosed = 0.0;
        } else {
          // Halfway through blink: smoothly closed
          p.blinkClosed = Math.sin(((p.blinkTimer - 4.2) / 0.16) * Math.PI);
        }
      } else {
        p.blinkClosed = 0.0;
      }
      document.getElementById('tel-eyes').textContent = p.blinkClosed > 0.5 ? 'ATTENTIVE (BLINK)' : `TARGET ACQUIRED (${p.eyeDx > 0 ? 'R' : 'L'})`;

      // 3. Head & Gaze Lead Turn
      const targetHead = normVx * 0.32 + normAx * 0.18;
      p.headAngle += (targetHead - p.headAngle) * 14.0 * dt;

      // 4. Symmetrical Body Banking Driven by BOTH Velocity and Acceleration!
      const targetBank = normVx * 0.18 + normAx * 0.24;
      p.bodyBank += (targetBank - p.bodyBank) * 11.0 * dt;
      p.shoulderBank = p.bodyBank * 0.88;

      // 5. Vertical Pitch & Aerodynamic Braking Flare
      const targetPitch = normVy * 0.22;
      p.pitchAngle += (targetPitch - p.pitchAngle) * 9.0 * dt;
      
      const targetBrake = Math.max(0, normVy * 0.26) + (Math.abs(p.vx) < 1.2 && Math.abs(dx) > 10 ? 0.22 : 0.0);
      p.brakeFlare += (targetBrake - p.brakeFlare) * 8.5 * dt;

      // 6. Breathing Cycle & Floating Rhythm (0.4 Hz)
      p.breathPhase += dt * 2.8;
      const breath = Math.sin(p.breathPhase) * 0.035;

      // 7. ACTIVE AERODYNAMIC WINGBEAT ENGINE (Continuous Real-Life Motion!)
      // Wings NEVER stay in the same position! Even at stationary hover, they execute
      // continuous aerodynamic downstroke and upstroke cycles!
      const flapFrequency = 6.8 + Math.abs(normVx) * 3.2; // ~1.1 Hz to 1.6 Hz
      p.wingCycle += dt * flapFrequency;
      
      // Asymmetric Aerodynamic Stroke:
      // Fast downstroke (pushing air down, +26° to -14°), slower folded recovery (sweeping back up)
      const strokePhase = p.wingCycle % (Math.PI * 2);
      const isDownstroke = strokePhase < Math.PI * 0.85;
      
      let baseStrokeAngle = 0;
      if (isDownstroke) {
        // Power Downstroke: Wing pushes down forcefully
        const tDown = strokePhase / (Math.PI * 0.85);
        baseStrokeAngle = Math.cos(tDown * Math.PI) * 0.38 + 0.08; // +26° to -18°
      } else {
        // Recovery Upstroke: Wing folds and slices up with drag
        const tUp = (strokePhase - Math.PI * 0.85) / (Math.PI * 1.15);
        baseStrokeAngle = -Math.cos(tUp * Math.PI) * 0.38 + 0.08;
      }
      p.wingFlapAngle = baseStrokeAngle;

      // Outer Feather Tip Drag Flex (flexes opposite to stroke direction!)
      p.wingTipFlex = isDownstroke ? 0.22 : -0.18;

      // Leading vs Trailing Wing Banking Displacement
      const bankLift = Math.abs(normVx) * 0.25 + Math.abs(normAx) * 0.16;
      const bankSweep = Math.abs(normVx) * 0.18;

      if (normVx >= 0) {
        // Moving right: Right wing leads and lifts into airflow
        p.rightWingAngle = p.bodyBank + bankLift + p.wingFlapAngle + breath + p.brakeFlare;
        p.leftWingAngle = p.bodyBank - bankSweep - (p.wingFlapAngle * 0.85) - breath + p.brakeFlare;
      } else {
        // Moving left: Left wing leads and lifts into airflow (EXACT EQUAL SYMMETRY!)
        p.leftWingAngle = p.bodyBank - bankLift - p.wingFlapAngle - breath + p.brakeFlare;
        p.rightWingAngle = p.bodyBank + bankSweep + (p.wingFlapAngle * 0.85) + breath + p.brakeFlare;
      }

      // Update Active Wing Stroke Readout
      const strokeTypeStr = isDownstroke ? 'DOWNSTROKE (POWER)' : 'UPSTROKE (RECOVERY)';
      document.getElementById('tel-wings').textContent = `${strokeTypeStr} (${(p.wingFlapAngle * 180 / Math.PI).toFixed(1)}°)`;

      // 8. Trailing Hair, Gown, and Ribbon Flow
      p.flowAngle += (-normVx * 0.28 - p.flowAngle) * 7.0 * dt;

      // ─── CHARACTER-SPECIFIC MECHANICS ───

      // Dynamo Princess: Handheld vs Floating Cannon Aim, Recoil & Hover Poise (Requirement 3)
      if (state.realm === 'dynamo') {
        const targetAim = normVx * 0.20;
        // Young Tier VI Princess has a fast, lighter recovery; Tier X has a stately, composed one
        const isYoungTier = (state.tier === 'VI' || state.tier === 'VII');
        const inertiaRate = isYoungTier ? 12.0 : 5.0;
        p.cannonAim += (targetAim - p.cannonAim) * inertiaRate * dt;

        p.kneeFlex = Math.sin(p.breathPhase * 1.2) * (isYoungTier ? 6.5 : 4.0);
        p.bootDrift = Math.cos(p.breathPhase * 0.9) * 4.5;

        p.recoilTimer += dt;
        if (p.recoilTimer > 2.2) {
          p.recoilTimer = 0;
          p.recoilKick = 1.0;
        }
        // Recoil recovery spring (quicker for Tier VI, deliberate for Tier X)
        const recoilRecovery = isYoungTier ? 0.75 : 0.84;
        p.recoilKick *= Math.pow(recoilRecovery, dt * 60);
      }

      // Helix Unicorn: Living Horse Gait, Canter, and Lead Change (Requirement 4)
      else if (state.realm === 'helix') {
        const isHover = Math.abs(normVx) < 0.12 && Math.abs(normVy) < 0.12;
        const gaitSpeed = isHover ? 2.4 : (5.8 + Math.abs(normVx) * 4.2);
        p.canterPhase += dt * gaitSpeed;
        const cPhase = (p.canterPhase % (Math.PI * 2)) / (Math.PI * 2);

        // Track Lead Change: Right lead when traveling right, Left lead when traveling left!
        if (cPhase > 0.78 && cPhase < 0.98) {
          p.canterLead = p.yaw >= 0 ? 1.0 : -1.0;
        }

        if (isHover) {
          p.canterGaitBeat = 0;
          const hFloat = Math.sin(p.canterPhase);
          p.legFlap[0] = hFloat * 0.10;
          p.legFlap[1] = -hFloat * 0.08;
          p.legFlap[2] = hFloat * 0.12;
          p.legFlap[3] = -hFloat * 0.10;
          p.neckBob = Math.sin(p.canterPhase * 0.5) * 0.05;
        } else {
          // 4-Phase Equestrian Canter with lead change
          if (cPhase < 0.25) p.canterGaitBeat = 1;
          else if (cPhase < 0.55) p.canterGaitBeat = 2;
          else if (cPhase < 0.80) p.canterGaitBeat = 3;
          else p.canterGaitBeat = 4; // Suspension

          const leadMult = p.canterLead;
          p.legFlap[0] = Math.sin(p.canterPhase + (leadMult > 0 ? 0.0 : 1.2)) * 0.38;
          p.legFlap[1] = Math.sin(p.canterPhase + (leadMult > 0 ? 1.2 : 0.0)) * 0.38;
          p.legFlap[2] = Math.sin(p.canterPhase + 2.4) * 0.40;
          p.legFlap[3] = Math.sin(p.canterPhase + 3.6) * 0.40;
          
          p.neckBob = Math.sin(p.canterPhase * 2.0) * 0.12;
        }
        p.tailPhase += dt * (4.0 + Math.abs(normVx) * 6.0);
      }

      // Meteor Dragon: Muscular Wing Stroke & Continuous Moving Fire (Requirement 5)
      else if (state.realm === 'meteor') {
        const strokeCycle = (p.breathPhase * 0.85) % (Math.PI * 2);
        if (strokeCycle < 1.9) {
          p.dragonStroke = 0; // Downstroke (powerful, taut)
          p.clawsTucked += (0.2 - p.clawsTucked) * 8.0 * dt;
        } else if (strokeCycle < 4.2) {
          p.dragonStroke = 1; // Recovery (folded wings)
          p.clawsTucked += (0.4 - p.clawsTucked) * 8.0 * dt;
        } else {
          p.dragonStroke = 2; // Aerodynamic Glide (outstretched)
          p.clawsTucked += (Math.abs(normVx) > 0.4 ? 0.8 : 0.1 - p.clawsTucked) * 8.0 * dt;
        }

        let prev = p.bodyBank;
        for (let t = 0; t < 5; t++) {
          p.tailChain[t] += (prev - p.tailChain[t]) * (10.0 - t * 1.5) * dt;
          prev = p.tailChain[t];
        }

        updateContinuousFlameSystem(p, dt);
      }

      // Update Telemetry Panel Readouts
      const faceDirStr = p.yaw > 0.25 ? 'FORWARD-RIGHT' : p.yaw < -0.25 ? 'FORWARD-LEFT' : '3/4 DEPTH TURN';
      const volWidth = (0.92 + 0.08 * Math.abs(p.yaw)) * 100;
      document.getElementById('tel-facing').textContent = `${faceDirStr} (${volWidth.toFixed(0)}% VOL)`;
      document.getElementById('tel-pos').textContent = `${Math.round(p.x)}, ${Math.round(p.y)}`;
      document.getElementById('tel-vel').textContent = `Vx ${p.vx.toFixed(1)}, Ax ${p.ax.toFixed(1)}`;
      document.getElementById('tel-bank').textContent = `${(p.bodyBank * 180 / Math.PI).toFixed(1)}° / ${(p.headAngle * 180 / Math.PI).toFixed(1)}°`;
      
      if (state.realm === 'dynamo') {
        const stateStr = p.recoilKick > 0.2 ? 'RECOIL RECOVERY' : 'AIM LOCKED';
        document.getElementById('tel-weapon').textContent = `${stateStr} (${(p.cannonAim * 180 / Math.PI).toFixed(1)}°)`;
        document.getElementById('tel-gait').textContent = `ROYAL SUSPENSION (KNEE ${p.kneeFlex.toFixed(1)}px)`;
      } else if (state.realm === 'helix') {
        const leadStr = p.canterLead > 0 ? 'RIGHT LEAD' : 'LEFT LEAD';
        const beatStr = p.canterGaitBeat === 0 ? 'HOVER ADJUST' : p.canterGaitBeat === 4 ? 'AIR SUSPENSION' : `CANTER BEAT ${p.canterGaitBeat}`;
        document.getElementById('tel-weapon').textContent = `STARDUST HORN (${leadStr})`;
        document.getElementById('tel-gait').textContent = `${beatStr} · ${leadStr}`;
      } else {
        const strokeStr = p.dragonStroke === 0 ? 'DOWNSTROKE (TAUT)' : p.dragonStroke === 1 ? 'RECOVERY (FOLD)' : 'AERODYNAMIC GLIDE';
        const clawStr = p.clawsTucked > 0.5 ? 'CLAWS TUCKED' : 'CLAWS SPREAD';
        document.getElementById('tel-weapon').textContent = `CALDERA CORE (${clawStr})`;
        document.getElementById('tel-gait').textContent = strokeStr;
      }
    }

    // Continuous Moving Fire System for Meteor Dragon
    function updateContinuousFlameSystem(p, dt) {
      if (state.silhouetteMode) return;

      if (Math.random() < 0.85) {
        const anchors = [
          { x: 0, y: 0 },
          { x: p.yaw * 70, y: -50 },
          { x: -140, y: -40 },
          { x: 140, y: -40 },
          { x: -p.yaw * 160, y: 40 }
        ];
        const a = anchors[Math.floor(Math.random() * anchors.length)];

        p.flameParticles.push({
          x: p.x + a.x + (Math.random() - 0.5) * 20,
          y: p.y + a.y + (Math.random() - 0.5) * 20,
          vx: -p.vx * 0.45 + (Math.random() - 0.5) * 35,
          vy: -p.vy * 0.45 - 25 - Math.random() * 50,
          size: 4 + Math.random() * 7,
          life: 1.0,
          decay: 0.75 + Math.random() * 0.75,
          hue: Math.random() < 0.25 ? '#ffffff' : Math.random() < 0.6 ? '#fbbf24' : Math.random() < 0.85 ? '#f97316' : '#ef4444'
        });
      }

      for (let i = p.flameParticles.length - 1; i >= 0; i--) {
        const pt = p.flameParticles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= pt.decay * dt;
        pt.size *= 0.965;
        if (pt.life <= 0) p.flameParticles.splice(i, 1);
      }
    }

    // ─── REALM STARFIELD RENDERER ───
    function drawRealmStarfield(game) {
      if (state.silhouetteMode) {
        // High-contrast clean neutral backdrop for silhouette inspection
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1920, 1080);
        return;
      }

      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      if (game === 'dynamo') {
        grad.addColorStop(0, '#06020e');
        grad.addColorStop(0.5, '#0d061c');
        grad.addColorStop(1, '#030107');
      } else if (game === 'helix') {
        grad.addColorStop(0, '#020814');
        grad.addColorStop(0.5, '#041328');
        grad.addColorStop(1, '#01040a');
      } else {
        grad.addColorStop(0, '#120402');
        grad.addColorStop(0.5, '#200803');
        grad.addColorStop(1, '#080201');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Starfield dots
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 75; s++) {
        const sx = (s * 137.5) % 1920;
        const sy = (s * 293.7 + state.player.breathPhase * 15) % 1080;
        const sz = (s % 3) * 0.6 + 0.8;
        ctx.globalAlpha = 0.35 + (s % 5) * 0.12;
        ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.globalAlpha = 1.0;

      // Descending Celestial Nodes & Hazards
      const nodeImg = images[`node_${game}`];
      const hazImg = images[`hazard_${game}`];
      if (nodeImg && hazImg && !state.isCloseUpMode) {
        ctx.drawImage(nodeImg, 380, 160, 110, 140);
        ctx.drawImage(hazImg, 960 - 55, 120, 110, 140);
        ctx.drawImage(nodeImg, 1540, 200, 110, 140);
      }
    }

    // ─── MASTER 2.5D RIGGED LIVING CHARACTER RENDERER ───
    function drawRiggedCharacter(game, tier, px, py, isGhost=false) {
      const p = state.player;
      const tierRank = tier === 'VI' ? 1 : tier === 'VII' ? 2 : tier === 'VIII' ? 3 : tier === 'IX' ? 4 : 5;
      const targetW = 860 * (1.0 + (tierRank - 1) * 0.05);
      const aspect = 576 / 1024;
      const targetH = targetW * aspect;

      const baseKey = `${game}_${tier.toLowerCase()}`;
      const imgBody = images[`${baseKey}_body`];
      const imgHead = images[`${baseKey}_head`];
      const imgWingL = images[`${baseKey}_wing_l`];
      const imgWingR = images[`${baseKey}_wing_r`];
      const imgDirLeft = images[`${baseKey}_dir_left`];
      const imgDirRight = images[`${baseKey}_dir_right`];
      const imgDirTurn = images[`${baseKey}_dir_turn`];

      ctx.save();
      ctx.translate(px, py);

      if (state.silhouetteMode) {
        ctx.filter = 'brightness(0) contrast(200%)';
      } else if (isGhost) {
        ctx.globalAlpha = 0.32;
        ctx.filter = 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.6)) contrast(1.2)';
      }

      // Anatomical Anchor Offsets (at gameplay scale)
      const shoulderX_L = -targetW * 0.15;
      const shoulderX_R = +targetW * 0.15;
      const shoulderY = -targetH * 0.10;
      const neckY = -targetH * 0.22;

      const isFacingRight = p.yaw >= 0;
      const isMidpointTurn = Math.abs(p.yaw) < 0.28 || state.isPausedTurnMidpoint;

      // ─── 1. FAR WING (BEHIND TORSO, PIVOTING AT SHOULDER JOINT!) ───
      ctx.save();
      if (isFacingRight) {
        // Left Wing is Far Wing
        ctx.translate(shoulderX_L, shoulderY);
        // Active aerodynamic wingbeat stroke + tip flex
        ctx.rotate(p.leftWingAngle * 0.85 + p.bodyBank * 0.20);
        if (!state.silhouetteMode) ctx.filter = 'brightness(0.72) saturate(0.85)';
        if (imgWingL) ctx.drawImage(imgWingL, -targetW * 0.35, -targetH * 0.40, targetW, targetH);
      } else {
        // Right Wing is Far Wing
        ctx.translate(shoulderX_R, shoulderY);
        ctx.rotate(p.rightWingAngle * 0.85 + p.bodyBank * 0.20);
        if (!state.silhouetteMode) ctx.filter = 'brightness(0.72) saturate(0.85)';
        if (imgWingR) ctx.drawImage(imgWingR, -targetW * 0.65, -targetH * 0.40, targetW, targetH);
      }
      ctx.restore();

      // ─── 2. TORSO & 28PX CATCH POINT CORE (ROCK-STEADY, VOLUME PRESERVED) ───
      ctx.save();
      ctx.rotate(p.bodyBank * 0.35);
      
      // Preserve full 94% to 100% rib cage volume (NEVER flattens to zero!)
      const torsoScaleX = 0.94 + 0.06 * Math.abs(p.yaw);
      ctx.scale(torsoScaleX, 1.0);

      if (isMidpointTurn && imgDirTurn) {
        // Believable intermediate 3/4 depth pose!
        ctx.drawImage(imgDirTurn, -targetW / 2, -targetH / 2, targetW, targetH);
      } else {
        const poseImg = isFacingRight ? (imgDirRight || imgBody) : (imgDirLeft || imgBody);
        if (poseImg) ctx.drawImage(poseImg, -targetW / 2, -targetH / 2, targetW, targetH);
      }
      ctx.restore();

      // ─── 3. HEAD & NECK (LEADS TURN ON TRUE NECK PIVOT + ORGANIC BLINKING!) ───
      ctx.save();
      ctx.translate(0, neckY);
      
      // Gaze and eyes lead the turn laterally
      const headDx = Math.sin(p.headAngle) * 24.0 + p.eyeDx;
      ctx.translate(headDx, p.eyeDy);
      ctx.rotate(p.headAngle * 0.70);

      if (imgHead) {
        ctx.drawImage(imgHead, -targetW / 2, -targetH / 2 - neckY, targetW, targetH);
      }

      // Natural Eyelid Blinking Overlay
      if (p.blinkClosed > 0.05 && !state.silhouetteMode) {
        ctx.save();
        ctx.fillStyle = game === 'dynamo' ? '#c084fc' : game === 'helix' ? '#67e8f9' : '#ea580c';
        // Eye positions relative to head center
        const eyeL_x = -16 + (p.yaw * 8);
        const eyeR_x = +16 + (p.yaw * 8);
        const eye_y = -8;
        const blinkH = 7 * p.blinkClosed;

        // Eyelid curves
        ctx.beginPath();
        ctx.ellipse(eyeL_x, eye_y, 7, blinkH, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeR_x, eye_y, 7, blinkH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // ─── 4. NEAR WING & SHOULDER (IN FRONT OF TORSO, RIM-LIT, ACTIVE STROKE!) ───
      ctx.save();
      if (isFacingRight) {
        // Right Wing is Near Wing
        ctx.translate(shoulderX_R, shoulderY);
        // Active downstroke / upstroke flapping cycle!
        ctx.rotate(p.rightWingAngle * 0.95 + p.bodyBank * 0.30);
        if (!state.silhouetteMode) ctx.filter = 'brightness(1.15)';
        if (imgWingR) ctx.drawImage(imgWingR, -targetW * 0.65, -targetH * 0.40, targetW, targetH);
      } else {
        // Left Wing is Near Wing
        ctx.translate(shoulderX_L, shoulderY);
        ctx.rotate(p.leftWingAngle * 0.95 + p.bodyBank * 0.30);
        if (!state.silhouetteMode) ctx.filter = 'brightness(1.15)';
        if (imgWingL) ctx.drawImage(imgWingL, -targetW * 0.35, -targetH * 0.40, targetW, targetH);
      }
      ctx.restore();

      // ─── 5. CHARACTER APPENDAGES & DYNAMIC EFFECTS ───
      if (!state.silhouetteMode) {
        if (game === 'dynamo') {
          drawDynamicDynamoCannon(targetW, targetH, tier, p);
        } else if (game === 'helix') {
          drawHelixLivingGait(targetW, targetH, p);
        } else if (game === 'meteor') {
          drawMeteorDragonVFX(targetW, targetH, p);
        }
      }

      // Skeletal Debug Rig Overlay (if enabled)
      if (state.showSkeletalMesh && !isGhost) {
        drawEnhancedSkeletalRig(targetW, targetH, p);
      }

      ctx.restore();
    }

    // ─── DYNAMO PRINCESS CANNON RIG (Requirement 3) ───
    function drawDynamicDynamoCannon(tw, th, tier, p) {
      ctx.save();
      const dirMult = p.yaw >= 0 ? 1.0 : -1.0;
      const muzzleX = tw * 0.28 * dirMult;
      const muzzleY = -th * 0.12 - p.recoilKick * 16.0;

      ctx.translate(muzzleX, muzzleY);
      ctx.rotate(p.cannonAim * dirMult);

      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 28;

      const beamLen = tier === 'X' ? 240 : 160;
      const beamWidth = tier === 'X' ? 12 : 7;

      // Central white-hot core beam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = beamWidth;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(beamLen * dirMult, -25);
      ctx.stroke();

      // Prismatic cyan wavefront
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = beamWidth * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((beamLen + 40) * dirMult, -35);
      ctx.stroke();

      // Prismatic violet wavefront
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      ctx.lineWidth = beamWidth * 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((beamLen + 20) * dirMult, -18);
      ctx.stroke();

      // Muzzle spark star
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 8 + p.recoilKick * 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    // ─── HELIX UNICORN LIVING HORSE GAIT VFX (Requirement 4) ───
    function drawHelixLivingGait(tw, th, p) {
      ctx.save();
      const dirMult = p.yaw >= 0 ? 1.0 : -1.0;
      const tailAnchorX = -tw * 0.22 * dirMult;
      const tailAnchorY = th * 0.15;

      ctx.translate(tailAnchorX, tailAnchorY);

      const numPoints = 20;
      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath();
        ctx.strokeStyle = strand === 0 ? 'rgba(56, 189, 248, 0.75)' : 'rgba(236, 72, 153, 0.75)';
        ctx.lineWidth = 4;
        ctx.shadowColor = strand === 0 ? '#38bdf8' : '#ec4899';
        ctx.shadowBlur = 12;

        for (let i = 0; i < numPoints; i++) {
          const t = i / numPoints;
          const x = -t * 140 * dirMult;
          const phaseOffset = strand * Math.PI;
          const y = Math.sin(p.tailPhase + t * 6.0 + phaseOffset) * (18 * (1.0 - t * 0.4));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // ─── METEOR DRAGON CONTINUOUS MOVING FIRE (Requirement 5) ───
    function drawMeteorDragonVFX(tw, th, p) {
      ctx.save();
      for (let i = 0; i < p.flameParticles.length; i++) {
        const pt = p.flameParticles[i];
        const relX = pt.x - p.x;
        const relY = pt.y - p.y;

        ctx.fillStyle = pt.hue;
        ctx.shadowColor = pt.hue;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = Math.max(0, pt.life);

        ctx.beginPath();
        ctx.arc(relX, relY, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }

    // ─── SKELETAL RIG PIVOTS OVERLAY ───
    function drawEnhancedSkeletalRig(tw, th, p) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;

      // Connecting bone lines
      ctx.beginPath();
      ctx.moveTo(0, -th * 0.28);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, th * 0.24);
      ctx.moveTo(-tw * 0.16, -th * 0.12);
      ctx.lineTo(0, -th * 0.08);
      ctx.lineTo(tw * 0.16, -th * 0.12);
      ctx.stroke();

      // Individual Joint Pivots
      const joints = [
        [0, 0, 7, '#22c55e'],                   // Center Core (Green)
        [0, -th * 0.28, 6, '#38bdf8'],          // Head / Neck
        [-tw * 0.16, -th * 0.12, 5, '#38bdf8'], // Left Shoulder
        [tw * 0.16, -th * 0.12, 5, '#38bdf8'],  // Right Shoulder
        [0, th * 0.24, 5, '#38bdf8']            // Pelvis / Hips
      ];
      joints.forEach(([jx, jy, jr, col]) => {
        ctx.beginPath();
        ctx.arc(jx, jy, jr, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.restore();
    }

    // ─── TIER V SCALE REFERENCE GHOST ───
    function drawTier5ReferenceGhost(game, px, py) {
      const t5Img = images[`${game}_v`];
      if (!t5Img) return;

      const targetW = 860;
      const aspect = 576 / 1024;
      const targetH = targetW * aspect;

      ctx.save();
      ctx.translate(px, py);
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.55;
      ctx.filter = 'drop-shadow(0 0 18px rgba(251, 191, 36, 0.8)) contrast(1.25)';
      ctx.drawImage(t5Img, -targetW / 2, -targetH / 2, targetW, targetH);

      // Gold scale reference ring
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.ellipse(0, 0, targetW * 0.35, targetH * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 13px monospace';
      ctx.fillText('TIER V BENCHMARK SCALE', -85, targetH * 0.45);

      ctx.restore();
    }

    // ─── CATCH POINT RETICLE (28PX COLLISION RADIUS) ───
    function drawCatchPointReticle(px, py) {
      ctx.save();
      ctx.translate(px, py);

      // 28px exact collision radius circle
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-36, 0); ctx.lineTo(36, 0);
      ctx.moveTo(0, -36); ctx.lineTo(0, 36);
      ctx.stroke();

      // Center point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22c55e';
      ctx.font = '700 11.5px monospace';
      ctx.fillText('28px CATCH POINT', 38, 4);

      ctx.restore();
    }

    // ─── MAIN ENGINE ANIMATION LOOP (60 FPS) ───
    let lastTime = performance.now();
    function studioLoop(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000.0);
      lastTime = now;

      // 1. Update Sequencers & Kinematics
      updateHatchingCinematic(dt);
      updateBenchmarkTimeline(dt);
      updatePhysics(dt);

      // 2. Clear Screen & Draw Realm Starfield
      drawRealmStarfield(state.realm);

      const p = state.player;

      // 3. Camera Viewport Zooming (Supports 2.5x Close-Up Inspection Mode!)
      ctx.save();
      if (state.camZoom > 1.01) {
        // Zoom centered on character's chest core and head
        ctx.translate(960, 540);
        ctx.scale(state.camZoom, state.camZoom);
        ctx.translate(-p.x, -p.y + 60);
      }

      // 4. Render In-Engine Preview
      if (state.hatchRunning) {
        const ht = state.hatchTime;
        if (ht < 4.0) {
          drawTier5ReferenceGhost(state.realm, p.x, p.y);
        } else {
          drawRiggedCharacter(state.realm, 'VI', p.x, p.y);
          if (ht < 6.0) {
            ctx.save();
            ctx.fillStyle = state.realm === 'dynamo' ? 'rgba(192, 132, 252, 0.4)' : state.realm === 'helix' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(251, 146, 60, 0.4)';
            ctx.fillRect(0, 0, 1920, 1080);
            ctx.restore();
          }
        }
      } else {
        if (state.showT5Ghost && state.tier !== 'V' && !state.silhouetteMode) {
          drawTier5ReferenceGhost(state.realm, p.x, p.y);
        }
        drawRiggedCharacter(state.realm, state.tier, p.x, p.y);
        if (state.showCatchPoint && !state.silhouetteMode) {
          drawCatchPointReticle(p.x, p.y);
        }
      }

      ctx.restore();

      requestAnimationFrame(studioLoop);
    }

    // Start Engine
    requestAnimationFrame(studioLoop);
  </script>
</body>
</html>
'''

with open(studio_path, "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Successfully generated {studio_path} ({len(html_code)} bytes)")
