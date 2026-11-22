import os

output_html = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

# Write out the complete, polished v5 studio HTML
html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chrome Arcade · Tier VI–X Living Articulated Motion Studio v5</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #020408;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }

    /* Top Command Center Bar */
    #topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 18px;
      background: rgba(10, 15, 28, 0.96);
      border-bottom: 1px solid rgba(56, 189, 248, 0.25);
      z-index: 50;
      gap: 12px;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-title {
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.8px;
      color: #fff;
    }
    .brand-sub {
      font-size: 10px;
      color: #38bdf8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .controls-group {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.8);
      padding: 3px 6px;
      border-radius: 20px;
      border: 1px solid rgba(56, 189, 248, 0.15);
    }
    .btn-pill {
      background: transparent;
      border: 1px solid transparent;
      color: #94a3b8;
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .btn-pill:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
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
      min-width: 440px;
      max-width: 500px;
      white-space: nowrap;
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

    /* Overlay Toggles Panel (Top-Right) */
    #overlay-toggles {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 40;
    }
    .toggle-pill {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(56, 189, 248, 0.40);
      color: #f8fafc;
      padding: 5px 12px;
      border-radius: 14px;
      font-size: 10.5px;
      font-weight: 700;
      cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .toggle-pill:hover {
      color: #fff;
      background: rgba(30, 41, 59, 0.95);
      border-color: #38bdf8;
    }
    .toggle-pill.active {
      background: rgba(14, 165, 233, 0.25);
      color: #38bdf8;
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
    }
    .toggle-pill.active-pulse {
      background: rgba(239, 68, 68, 0.35);
      color: #f87171;
      border-color: #ef4444;
      box-shadow: 0 0 16px rgba(239, 68, 68, 0.5);
    }
    .toggle-pill.active-green {
      background: rgba(34, 197, 94, 0.35);
      color: #4ade80;
      border-color: #22c55e;
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
    }

    /* Bottom Sequencer Bar */
    #sequence-bar {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 15, 28, 0.94);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 16px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 40;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      max-width: 95vw;
      overflow-x: auto;
    }
    .seq-step-pill {
      font-size: 10px;
      font-family: monospace;
      padding: 4px 8px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #64748b;
      white-space: nowrap;
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
  </style>
</head>
<body>
  <div id="topbar">
    <div class="brand">
      <div>
        <div class="brand-title">CHROME ARCADE · TIER VI–X LIVING MOTION STUDIO v5</div>
        <div class="brand-sub">Unified Aerodynamic Wings · Authored Directional Poses · Weight-Shift Turn</div>
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
      <div>Kinetic Weight Shift: <span class="val" id="tel-facing">CENTER EQUILIBRIUM</span></div>
      <div>Head Direction & Pose: <span class="val" id="tel-head-pose">R34 (RIGHT 3/4)</span></div>
      <div>Gaze Lead & Blinking: <span class="val" id="tel-eyes">ATTENTIVE (OPEN)</span></div>
      <div>Mouth & Expression: <span class="val" id="tel-mouth">RESTING HOVER (0%)</span></div>
      <div>Aerodynamic Wing Banking: <span class="val" id="tel-wings">UNIFIED HARMONIC BEAT</span></div>
      <div>Catch Point (X, Y): <span class="val" id="tel-pos">960, 780</span></div>
      <div>Velocity & Accel: <span class="val" id="tel-vel">Vx 0.0, Ax 0.0</span></div>
      <div>Bank & Head Tilt: <span class="val" id="tel-bank">0.0° / 0.0°</span></div>
      <div>Weapon State & Aim: <span class="val" id="tel-weapon">AIM LOCKED (0°)</span></div>
      <div>Gait & Limbs: <span class="val" id="tel-gait">ROYAL SUSPENSION</span></div>
      <div>Collision Catch Radius: <span class="val" id="tel-catch" style="color:#22c55e;">28px ROCK-STEADY</span></div>
    </div>

    <!-- Overlay Toggles -->
    <div id="overlay-toggles">
      <button class="toggle-pill" id="toggle-closeup">🔍 2.5x Close-Up Inspection Mode</button>
      <button class="toggle-pill active" id="toggle-t5-ghost">👻 Show Tier V Reference Ghost</button>
      <button class="toggle-pill active" id="toggle-catch-point">🎯 Show Catch Point & 28px Radius</button>
      <button class="toggle-pill" id="toggle-skeletal-mesh">📐 Show Skeletal Rig Pivots</button>
      <button class="toggle-pill" id="toggle-silhouette">🖤 Silhouette Only Lightbox</button>
      <button class="toggle-pill active-green" id="btn-run-course">🎯 Run Collectibles Intercept Sequence</button>
      <button class="toggle-pill active-pulse" id="btn-trigger-pulse">💥 Trigger Flux Pulse</button>
      <button class="toggle-pill" id="toggle-pause-turn">⏸️ Pause Turn Midpoint (Space)</button>
    </div>

    <!-- Canonical 7-Stage Benchmark Sequencer Bar -->
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
      
      // Course State
      courseRunning: false,
      courseTime: 0,
      collectibles: [
        { id: 1, x: 520, y: 260, caught: false },
        { id: 2, x: 1400, y: 260, caught: false }
      ],
      hazard: { x: 960, y: 210, grazed: false },
      
      // Pulse Event
      pulseRunning: false,
      pulseTime: 0,
      pulseWaveRadius: 0,

      // Benchmark State
      benchmarkRunning: false,
      benchmarkTime: 0,
      
      // Kinematic Character Model
      player: {
        x: 960,
        y: 780,
        targetX: 960,
        targetY: 780,
        vx: 0,
        vy: 0,
        prevVx: 0,
        ax: 0,
        
        // Directional Facing & 3D Turning (Problem 1 & 2)
        yaw: 0.35,                // -1.0 (Left 3/4) to +1.0 (Right 3/4)
        bodyBank: 0,              // Dynamic aerodynamic banking
        headAngle: 0,             // Head turn leading the turn
        shoulderBank: 0,          // Shoulder pitch and roll
        weightShiftX: 0,          // Kinetic weight transfer across hips
        
        // Gaze, Eyes & Blinking (Problem 2)
        eyeDx: 0,
        eyeDy: 0,
        gazeHoldTimer: 0,
        blinkTimer: 0,
        blinkClosed: 0.0,
        isWinking: false,
        
        // Mouth & Expression System (Problem 3)
        mouthState: 'rest',       // 'rest', 'smile', 'focus', 'roar'
        mouthOpen: 0.0,
        expressionTimer: 0,
        
        // Unified Harmonic Aerodynamic Wing Engine (Problem 4 - Tier II-IV Benchmark)
        wingCycle: 0,             // Majestic, unified flap frequency (0.8 Hz)
        leadWingLift: 0,          // Leading wing elevates into airflow
        trailWingSweep: 0,        // Trailing wing sweeps down/back
        wingFlapAngle: 0,         // Master wing stroke angle
        brakeFlare: 0,            // Braking forward air-cushion flare
        breathPhase: 0,
        
        // Secondary Elements Single Settling Lag
        secondaryLag: 0,          // Hair, twintails, cape, tail mace lag
        secondaryVel: 0,
        
        // Character-Specific Flight Mechanics (Problem 3 & 5)
        cannonAim: 0,
        recoilTimer: 0,
        recoilKick: 0,
        kneeFlex: 0,
        bootDrift: 0,
        
        canterPhase: 0,
        canterLead: 1.0,          // +1.0 Right lead, -1.0 Left lead
        canterGaitBeat: 0,
        legFlap: [0, 0, 0, 0],
        neckBob: 0,
        
        dragonStroke: 0,
        clawsTucked: 0.0,
        tailChain: [0, 0, 0, 0, 0],
        flameParticles: []
      },

      keys: { left: false, right: false, up: false, down: false }
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
        assetManifest[`${k}_head_r34`] = `assets/characters/rigs/${k}_head_r34.png`;
        assetManifest[`${k}_head_front`] = `assets/characters/rigs/${k}_head_front.png`;
        assetManifest[`${k}_head_l34`] = `assets/characters/rigs/${k}_head_l34.png`;
        assetManifest[`${k}_wing_l`] = `assets/characters/rigs/${k}_wing_l.png`;
        assetManifest[`${k}_wing_r`] = `assets/characters/rigs/${k}_wing_r.png`;
      });
    });

    let loadedCount = 0;
    for (const [key, url] of Object.entries(assetManifest)) {
      const img = new Image();
      img.onload = () => loadedCount++;
      img.src = url;
      images[key] = img;
    }

    const canvas = document.getElementById('viewCanvas');
    const ctx = canvas.getContext('2d');

    // UI Controls
    document.getElementById('realm-group').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-pill');
      if (!btn) return;
      document.querySelectorAll('#realm-group .btn-pill').forEach(b => {
        b.classList.remove('active', 'active-dynamo', 'active-helix', 'active-meteor');
      });
      state.realm = btn.dataset.realm;
      btn.classList.add('active', `active-${state.realm}`);
      updateTitles();
    });

    document.getElementById('tier-group').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-pill');
      if (!btn) return;
      document.querySelectorAll('#tier-group .btn-pill').forEach(b => b.classList.remove('active'));
      state.tier = btn.dataset.tier;
      btn.classList.add('active');
      updateTitles();
    });

    document.getElementById('toggle-closeup').addEventListener('click', function() {
      state.isCloseUpMode = !state.isCloseUpMode;
      this.classList.toggle('active', state.isCloseUpMode);
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
      state.isPausedTurnMidpoint = !state.isPausedTurnMidpoint;
      this.classList.toggle('active', state.isPausedTurnMidpoint);
      if (state.isPausedTurnMidpoint) {
        setTel('tel-state', 'PAUSED TURN MIDPOINT (3/4 DEPTH)');
      }
    });

    document.getElementById('btn-run-course').addEventListener('click', startCollectiblesCourse);
    document.getElementById('btn-trigger-pulse').addEventListener('click', triggerFluxPulse);
    document.getElementById('btn-run-benchmark').addEventListener('click', () => {
      if (state.benchmarkRunning) stopBenchmark();
      else startBenchmark();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        state.isPausedTurnMidpoint = !state.isPausedTurnMidpoint;
        document.getElementById('toggle-pause-turn').classList.toggle('active', state.isPausedTurnMidpoint);
        if (state.isPausedTurnMidpoint) setTel('tel-state', 'PAUSED TURN MIDPOINT (3/4 DEPTH)');
      } else if (e.code === 'KeyP') triggerFluxPulse();
      else if (e.code === 'KeyC') startCollectiblesCourse();
      else if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.keys.left = true;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = true;
      else if (e.code === 'ArrowUp' || e.code === 'KeyW') state.keys.up = true;
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') state.keys.down = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.keys.left = false;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = false;
      else if (e.code === 'ArrowUp' || e.code === 'KeyW') state.keys.up = false;
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') state.keys.down = false;
    });

    function updateTitles() {
      const realmNames = { dynamo: 'DYNAMO PRINCESS', helix: 'HELIX UNICORN', meteor: 'METEOR DRAGON' };
      setTel('tel-title', `${realmNames[state.realm]} · TIER ${state.tier}`);
    }

    function setTel(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    // ─── DECISIVE COLLECTIBLES COURSE ───
    function startCollectiblesCourse() {
      state.courseRunning = true;
      state.courseTime = 0;
      state.benchmarkRunning = false;
      state.collectibles[0].caught = false;
      state.collectibles[1].caught = false;
      state.hazard.grazed = false;
      document.getElementById('btn-run-course').classList.add('active');
    }

    function updateCollectiblesCourse(dt) {
      if (!state.courseRunning) return;
      state.courseTime += dt;
      const ct = state.courseTime;
      const p = state.player;

      if (ct < 1.0) {
        p.targetX = 960; p.targetY = 780;
        setTel('tel-state', 'COURSE 1/6: ACQUIRING COLLECTIBLE 1 (LEFT)');
      } else if (ct < 4.0) {
        p.targetX = 520; p.targetY = 300;
        setTel('tel-state', 'COURSE 2/6: STEERING LEFT TO INTERCEPT');
        if (Math.abs(p.x - 520) < 60 && Math.abs(p.y - 300) < 60 && !state.collectibles[0].caught) {
          state.collectibles[0].caught = true;
          triggerCatchEvent();
        }
      } else if (ct < 7.5) {
        p.targetX = 1400; p.targetY = 300;
        if (Math.abs(p.x - 960) < 140 && !state.hazard.grazed) {
          state.hazard.grazed = true;
          triggerGrazeEvent();
          setTel('tel-state', 'COURSE 3/6: HAZARD GRAZE (CAUTIOUS GLANCE)');
        } else {
          setTel('tel-state', 'COURSE 4/6: REVERSING RIGHT TO INTERCEPT 2');
        }
        if (Math.abs(p.x - 1400) < 60 && Math.abs(p.y - 300) < 60 && !state.collectibles[1].caught) {
          state.collectibles[1].caught = true;
          triggerCatchEvent();
        }
      } else if (ct < 10.5) {
        p.targetX = 960; p.targetY = 780;
        setTel('tel-state', 'COURSE 5/6: BRAKING FLARE & RETURNING TO HOVER');
      } else {
        state.courseRunning = false;
        document.getElementById('btn-run-course').classList.remove('active');
        setTel('tel-state', 'COURSE COMPLETE · PERFECT HOVER RESTORED');
      }
    }

    function triggerCatchEvent() {
      const p = state.player;
      p.mouthState = 'smile';
      p.mouthOpen = 0.85;
      p.expressionTimer = 0;
      if (state.realm === 'dynamo' && (state.tier === 'VI' || state.tier === 'VII')) {
        p.isWinking = true;
      }
    }

    function triggerGrazeEvent() {
      const p = state.player;
      p.mouthState = 'focus';
      p.mouthOpen = 0.35;
      p.expressionTimer = 0;
    }

    // ─── FLUX PULSE DESTROYER WAVE ───
    function triggerFluxPulse() {
      state.pulseRunning = true;
      state.pulseTime = 0;
      state.pulseWaveRadius = 0;
      state.player.recoilKick = 1.8;
      state.player.mouthState = 'roar';
      state.player.mouthOpen = 1.0;
      state.player.expressionTimer = 0;
      document.getElementById('btn-trigger-pulse').classList.add('active');
    }

    function updateFluxPulse(dt) {
      if (!state.pulseRunning) return;
      state.pulseTime += dt;
      const pt = state.pulseTime;
      state.pulseWaveRadius += 950 * dt;

      if (pt < 0.8) setTel('tel-state', 'FLUX PULSE: GATHERING COSMIC ENERGY');
      else if (pt < 2.0) setTel('tel-state', 'FLUX PULSE: MAXIMUM DISCHARGE BLAST!');
      else if (pt < 3.0) setTel('tel-state', 'FLUX PULSE: RECOVERY & SETTLING');
      else {
        state.pulseRunning = false;
        document.getElementById('btn-trigger-pulse').classList.remove('active');
      }
    }

    // ─── CANONICAL 7-STAGE BENCHMARK ───
    function startBenchmark() {
      state.benchmarkRunning = true;
      state.benchmarkTime = 0;
      state.courseRunning = false;
      document.getElementById('btn-run-benchmark').textContent = '⏹ Stop Benchmark';
      document.getElementById('btn-run-benchmark').classList.add('active-dynamo');
    }

    function stopBenchmark() {
      state.benchmarkRunning = false;
      state.benchmarkTime = 0;
      document.getElementById('btn-run-benchmark').textContent = '▶ Play Canonical Benchmark (23s)';
      document.getElementById('btn-run-benchmark').classList.remove('active-dynamo');
      document.querySelectorAll('.seq-step-pill').forEach(p => p.classList.remove('current'));
      setTel('tel-state', 'MANUAL STEER');
    }

    function updateBenchmark(dt) {
      if (!state.benchmarkRunning) return;
      state.benchmarkTime += dt;
      const t = state.benchmarkTime;
      const p = state.player;

      const steps = [
        { id: 'seq-step-hover', max: 3.0, name: '1. STATIONARY HOVER (BREATHING & EQUILIBRIUM)' },
        { id: 'seq-step-left-start', max: 5.5, name: '2. LEFTWARD START (HEAD LEADS, WINGS BANK LEFT)' },
        { id: 'seq-step-left-sustained', max: 10.5, name: '3. SUSTAINED LEFT PASS (5s STRIDE & MUZZLE LEFT)' },
        { id: 'seq-step-reversal-right', max: 13.5, name: '4. SHARP REVERSAL RIGHT (DEPTH TURN & LEAD CHANGE)' },
        { id: 'seq-step-climb', max: 16.0, name: '5. CLIMB (AERODYNAMIC COMPRESSION)' },
        { id: 'seq-step-descend-brake', max: 18.5, name: '6. BRAKING DESCENT (BRAKE FLARE & CLAWS/BOOTS DRIFT)' },
        { id: 'seq-step-hover-hold', max: 23.0, name: '7. RETURN TO HOVER (HELD 2 WINGBEATS)' }
      ];

      document.querySelectorAll('.seq-step-pill').forEach(el => el.classList.remove('current'));
      let currentStep = steps[0];
      for (let s of steps) {
        if (t < s.max) {
          currentStep = s;
          break;
        }
      }
      const activePill = document.getElementById(currentStep.id);
      if (activePill) activePill.classList.add('current');
      setTel('tel-state', currentStep.name);

      if (t < 3.0) { p.targetX = 960; p.targetY = 780; }
      else if (t < 5.5) { p.targetX = 680; p.targetY = 780; }
      else if (t < 10.5) { p.targetX = 380; p.targetY = 780; }
      else if (t < 13.5) { p.targetX = 1540; p.targetY = 780; }
      else if (t < 16.0) { p.targetX = 1100; p.targetY = 520; }
      else if (t < 18.5) { p.targetX = 960; p.targetY = 860; }
      else if (t < 23.0) { p.targetX = 960; p.targetY = 780; }
      else stopBenchmark();
    }

    // ─── REBUILT KINEMATICS, WEIGHT SHIFT & UNIFIED WING ENGINE ───
    function updatePhysics(dt) {
      const p = state.player;

      // Camera Matrix Smoothing
      const targetCam = state.isCloseUpMode ? 2.5 : 1.0;
      state.camZoom += (targetCam - state.camZoom) * 8.0 * dt;

      if (state.isPausedTurnMidpoint) return;

      if (!state.benchmarkRunning && !state.courseRunning) {
        const speed = 15.0;
        if (state.keys.left) p.targetX -= speed * 48 * dt;
        if (state.keys.right) p.targetX += speed * 48 * dt;
        if (state.keys.up) p.targetY -= speed * 38 * dt;
        if (state.keys.down) p.targetY += speed * 38 * dt;
        p.targetX = Math.max(280, Math.min(1640, p.targetX));
        p.targetY = Math.max(460, Math.min(940, p.targetY));
      }

      // Spring-damper position tracking (Chest core stays locked to catch point)
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      
      const prevVx = p.vx;
      p.vx = (p.vx + dx * 13.5 * dt) * Math.pow(0.74, dt * 60);
      p.vy = (p.vy + dy * 13.5 * dt) * Math.pow(0.74, dt * 60);
      p.ax = (p.vx - prevVx) / Math.max(0.001, dt);
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const normVx = Math.max(-1.0, Math.min(1.0, p.vx / 14.0));
      const normVy = Math.max(-1.0, Math.min(1.0, p.vy / 12.0));
      const normAx = Math.max(-1.0, Math.min(1.0, p.ax / 80.0));

      // 1. Gaze Notice & Head Direction Lead (Problem 1 & 2)
      // Eyes acquire direction first, head smoothly leads into turn
      if (Math.abs(normVx) > 0.10) {
        const targetYaw = normVx > 0 ? 1.0 : -1.0;
        p.yaw += (targetYaw - p.yaw) * 6.5 * dt;
        p.gazeHoldTimer = 0.50;
      } else {
        p.gazeHoldTimer -= dt;
        if (p.gazeHoldTimer <= 0) {
          const hoverYaw = p.yaw > 0 ? 0.35 : -0.35;
          p.yaw += (hoverYaw - p.yaw) * 4.0 * dt;
        }
      }

      // Eye Tracking
      let targetEyeX = normVx * 12.0;
      let targetEyeY = normVy * 8.0;
      if (state.courseRunning) {
        const targetColl = !state.collectibles[0].caught ? state.collectibles[0] : !state.collectibles[1].caught ? state.collectibles[1] : null;
        if (targetColl) {
          targetEyeX = Math.max(-14, Math.min(14, (targetColl.x - p.x) * 0.025));
          targetEyeY = Math.max(-10, Math.min(10, (targetColl.y - p.y) * 0.020));
        }
      }
      p.eyeDx += (targetEyeX - p.eyeDx) * 22.0 * dt;
      p.eyeDy += (targetEyeY - p.eyeDy) * 18.0 * dt;

      // Natural Eyelid Blinking (Every 4.2s, 150ms closure)
      p.blinkTimer += dt;
      if (p.blinkTimer > 4.2) {
        if (p.blinkTimer > 4.2 + 0.15) {
          p.blinkTimer = Math.random() * 0.8;
          p.blinkClosed = 0.0;
          p.isWinking = false;
        } else {
          p.blinkClosed = Math.sin(((p.blinkTimer - 4.2) / 0.15) * Math.PI);
        }
      } else {
        p.blinkClosed = 0.0;
      }

      // Head angle smoothly leads turn on neck pivot
      const targetHead = normVx * 0.32 + normAx * 0.18;
      p.headAngle += (targetHead - p.headAngle) * 12.0 * dt;

      // 2. Kinetic Weight Shift & Aerodynamic Bank (Problem 1 & 4)
      // When reversing, body banks into the turn; weight shifts across hips
      const targetBank = normVx * 0.22 + normAx * 0.24;
      p.bodyBank += (targetBank - p.bodyBank) * 8.5 * dt;
      p.shoulderBank = p.bodyBank * 0.90;
      p.weightShiftX = normVx * 8.0;

      // Aerodynamic Braking Flare
      const targetBrake = Math.max(0, normVy * 0.25) + (Math.abs(p.vx) < 1.2 && Math.abs(dx) > 10 ? 0.25 : 0.0);
      p.brakeFlare += (targetBrake - p.brakeFlare) * 8.0 * dt;

      // 3. Unified Harmonic Wing Engine (Tier II–IV Benchmark)
      // Single clear action! Wings beat in calm, majestic unison (0.8 Hz hover, 1.2 Hz speed)
      const isHover = Math.abs(normVx) < 0.12 && Math.abs(normVy) < 0.12;
      const flapFreq = isHover ? 4.8 : (5.6 + Math.abs(normVx) * 2.8);
      p.wingCycle += dt * flapFreq;
      
      const strokePhase = p.wingCycle % (Math.PI * 2);
      const isDownstroke = strokePhase < Math.PI * 0.85;
      p.wingFlapAngle = isDownstroke ? (Math.cos((strokePhase / (Math.PI * 0.85)) * Math.PI) * 0.32 + 0.06) : (-Math.cos(((strokePhase - Math.PI * 0.85) / (Math.PI * 1.15)) * Math.PI) * 0.32 + 0.06);

      // Leading wing lifts high into airflow; trailing wing sweeps back
      p.leadWingLift = Math.abs(normVx) * 0.22;
      p.trailWingSweep = Math.abs(normVx) * 0.16;

      // 4. Single Settling Lag for Secondary Elements (Problem 4)
      // Secondary elements (hair, cape, tail) follow with a short delay and settle ONCE!
      const targetLag = -normVx * 0.28;
      const lagForce = (targetLag - p.secondaryLag) * 28.0;
      p.secondaryVel = (p.secondaryVel + lagForce * dt) * Math.pow(0.82, dt * 60); // Critically damped!
      p.secondaryLag += p.secondaryVel * dt;

      // 5. Quiet Breathing Rhythm (0.32 Hz)
      p.breathPhase += dt * 2.0;
      const breath = Math.sin(p.breathPhase) * 0.030;

      // 6. Character-Specific Performance
      if (state.realm === 'dynamo') {
        const isYoung = (state.tier === 'VI' || state.tier === 'VII');
        const targetAim = normVx * 0.20;
        p.cannonAim += (targetAim - p.cannonAim) * (isYoung ? 14.0 : 6.0) * dt;
        p.kneeFlex = Math.sin(p.breathPhase) * (isYoung ? 5.5 : 3.5);
        p.bootDrift = Math.cos(p.breathPhase) * 4.0 + (p.brakeFlare * 9.0);

        p.recoilTimer += dt;
        if (p.recoilTimer > 2.8) {
          p.recoilTimer = 0;
          p.recoilKick = 1.0;
        }
        p.recoilKick *= Math.pow(isYoung ? 0.78 : 0.86, dt * 60);
      } else if (state.realm === 'helix') {
        const gaitSpeed = isHover ? 2.2 : (5.2 + Math.abs(normVx) * 4.0);
        p.canterPhase += dt * gaitSpeed;
        const cPhase = (p.canterPhase % (Math.PI * 2)) / (Math.PI * 2);

        // Flying lead change during suspension phase
        if (cPhase > 0.78 && cPhase < 0.98) {
          p.canterLead = p.yaw >= 0 ? 1.0 : -1.0;
        }

        if (isHover) {
          p.canterGaitBeat = 0;
          const hFloat = Math.sin(p.canterPhase);
          p.legFlap[0] = hFloat * 0.08;
          p.legFlap[1] = -hFloat * 0.06;
          p.legFlap[2] = hFloat * 0.10;
          p.legFlap[3] = -hFloat * 0.08;
          p.neckBob = Math.sin(p.canterPhase * 0.5) * 0.04;
        } else {
          if (cPhase < 0.25) p.canterGaitBeat = 1;
          else if (cPhase < 0.55) p.canterGaitBeat = 2;
          else if (cPhase < 0.80) p.canterGaitBeat = 3;
          else p.canterGaitBeat = 4; // Suspension

          const lead = p.canterLead;
          p.legFlap[0] = Math.sin(p.canterPhase + (lead > 0 ? 0.0 : 1.2)) * 0.35;
          p.legFlap[1] = Math.sin(p.canterPhase + (lead > 0 ? 1.2 : 0.0)) * 0.35;
          p.legFlap[2] = Math.sin(p.canterPhase + 2.4) * 0.38;
          p.legFlap[3] = Math.sin(p.canterPhase + 3.6) * 0.38;
          p.neckBob = Math.sin(p.canterPhase) * 0.10;
        }
      } else {
        // Meteor Dragon
        p.clawsTucked += ((Math.abs(normVx) > 0.40 ? 1.0 : 0.0) - p.clawsTucked) * 6.5 * dt;

        let prevTail = p.bodyBank;
        for (let t = 0; t < 5; t++) {
          p.tailChain[t] += (prevTail - p.tailChain[t]) * (10.0 - t * 1.5) * dt;
          prevTail = p.tailChain[t];
        }

        updateContinuousFlameSystem(p, dt);
      }

      // Telemetry Updates
      const weightDesc = Math.abs(p.weightShiftX) < 1.5 ? 'CENTER EQUILIBRIUM' : p.weightShiftX > 0 ? `BANK-RIGHT (+${p.weightShiftX.toFixed(1)}px)` : `BANK-LEFT (${p.weightShiftX.toFixed(1)}px)`;
      setTel('tel-facing', weightDesc);
      
      const headPoseKey = p.yaw > 0.35 ? 'R34 (RIGHT 3/4)' : p.yaw < -0.35 ? 'L34 (LEFT 3/4)' : 'FRONT (CENTERED)';
      setTel('tel-head-pose', headPoseKey);
      
      const eyeStatus = p.isWinking ? 'PLAYFUL WINK' : p.blinkClosed > 0.5 ? 'ATTENTIVE (BLINK)' : `TARGET ACQUIRED (${p.eyeDx > 0 ? 'R' : 'L'})`;
      setTel('tel-eyes', eyeStatus);

      const mouthDesc = p.mouthState === 'roar' ? 'ROAR / MAGMA PULSE' : p.mouthState === 'smile' ? 'JOYFUL SMILE' : p.mouthState === 'focus' ? 'FOCUSED AIM' : 'RESTING HOVER';
      setTel('tel-mouth', `${mouthDesc} (${(p.mouthOpen * 100).toFixed(0)}%)`);

      const strokeStr = isDownstroke ? 'DOWNSTROKE (POWER)' : 'UPSTROKE (RECOVERY)';
      setTel('tel-wings', `${strokeStr} (${(p.wingFlapAngle * 180 / Math.PI).toFixed(1)}°)`);
      setTel('tel-pos', `${Math.round(p.x)}, ${Math.round(p.y)}`);
      setTel('tel-vel', `Vx ${p.vx.toFixed(1)}, Ax ${p.ax.toFixed(1)}`);
      setTel('tel-bank', `${(p.bodyBank * 180 / Math.PI).toFixed(1)}° / ${(p.headAngle * 180 / Math.PI).toFixed(1)}°`);

      if (state.realm === 'dynamo') {
        const stateStr = p.recoilKick > 0.2 ? 'RECOIL RECOVERY' : 'AIM LOCKED';
        setTel('tel-weapon', `${stateStr} (${(p.cannonAim * 180 / Math.PI).toFixed(1)}°)`);
        setTel('tel-gait', `AIRBORNE BALANCE (KNEE ${p.kneeFlex.toFixed(1)}px)`);
      } else if (state.realm === 'helix') {
        const leadStr = p.canterLead > 0 ? 'RIGHT LEAD' : 'LEFT LEAD';
        const beatStr = p.canterGaitBeat === 0 ? 'HOVER ADJUST' : p.canterGaitBeat === 4 ? 'AIR SUSPENSION' : `CANTER BEAT ${p.canterGaitBeat}`;
        setTel('tel-weapon', `STARDUST HORN (${leadStr})`);
        setTel('tel-gait', `${beatStr} · ${leadStr}`);
      } else {
        const clawStr = p.clawsTucked > 0.5 ? 'CLAWS TUCKED (GLIDE)' : 'CLAWS SPREAD (HOVER)';
        setTel('tel-weapon', `CALDERA CORE (${clawStr})`);
        setTel('tel-gait', `5-JOINT SPINE TAIL LAG`);
      }
    }

    // Flame System
    function updateContinuousFlameSystem(p, dt) {
      if (state.silhouetteMode) return;
      if (Math.random() < 0.65) {
        p.flameParticles.push({
          x: p.x + (Math.random() - 0.5) * 60,
          y: p.y - 20 + (Math.random() - 0.5) * 30,
          vx: -p.vx * 0.35 + (Math.random() - 0.5) * 25,
          vy: -50 - Math.random() * 60,
          size: 4 + Math.random() * 5,
          life: 1.0,
          decay: 0.85 + Math.random() * 0.65,
          hue: Math.random() < 0.3 ? '#fbbf24' : Math.random() < 0.7 ? '#f97316' : '#ef4444'
        });
      }
      for (let i = p.flameParticles.length - 1; i >= 0; i--) {
        const pt = p.flameParticles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= pt.decay * dt;
        pt.size *= 0.97;
        if (pt.life <= 0) p.flameParticles.splice(i, 1);
      }
    }

    // ─── STARFIELD & LIGHTBOX ───
    function drawRealmStarfield(game) {
      if (state.silhouetteMode) {
        const studioGrad = ctx.createRadialGradient(960, 540, 60, 960, 540, 980);
        studioGrad.addColorStop(0, '#f8fafc');
        studioGrad.addColorStop(0.55, '#cbd5e1');
        studioGrad.addColorStop(1, '#64748b');
        ctx.fillStyle = studioGrad;
        ctx.fillRect(0, 0, 1920, 1080);

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.10)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 1920; x += 120) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke();
        }
        for (let y = 0; y <= 1080; y += 120) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke();
        }
        return;
      }

      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      if (game === 'dynamo') {
        grad.addColorStop(0, '#06020e'); grad.addColorStop(0.5, '#0d061c'); grad.addColorStop(1, '#030107');
      } else if (game === 'helix') {
        grad.addColorStop(0, '#020814'); grad.addColorStop(0.5, '#041328'); grad.addColorStop(1, '#01040a');
      } else {
        grad.addColorStop(0, '#120402'); grad.addColorStop(0.5, '#200803'); grad.addColorStop(1, '#080201');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 1080);

      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 65; s++) {
        const sx = (s * 137.5) % 1920;
        const sy = (s * 293.7 + state.player.breathPhase * 15) % 1080;
        const sz = (s % 3) * 0.5 + 0.8;
        ctx.globalAlpha = 0.35 + (s % 5) * 0.12;
        ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.globalAlpha = 1.0;

      // Collectibles Nodes
      drawCourseItems(game);
    }

    function drawCourseItems(game) {
      const nodeImg = images[`node_${game}`];
      const hazImg = images[`hazard_${game}`];

      if (!state.collectibles[0].caught && nodeImg) {
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.drawImage(nodeImg, 520 - 55, 260 - 70, 110, 140);
        ctx.restore();
      }

      if (!state.collectibles[1].caught && nodeImg) {
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.drawImage(nodeImg, 1400 - 55, 260 - 70, 110, 140);
        ctx.restore();
      }

      if (hazImg) {
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = state.hazard.grazed ? 28 : 12;
        ctx.drawImage(hazImg, 960 - 55, 210 - 70, 110, 140);
        ctx.restore();
      }
    }

    // ─── MASTER LIVING ARTICULATED CHARACTER RENDERER ───
    function drawRiggedCharacter(game, tier, px, py, isGhost=false) {
      const p = state.player;
      const tierRank = tier === 'VI' ? 1 : tier === 'VII' ? 2 : tier === 'VIII' ? 3 : tier === 'IX' ? 4 : 5;
      const targetW = 860 * (1.0 + (tierRank - 1) * 0.05);
      const aspect = 576 / 1024;
      const targetH = targetW * aspect;

      const baseKey = `${game}_${tier.toLowerCase()}`;
      const imgBody = images[`${baseKey}_body`];
      const imgHeadR34 = images[`${baseKey}_head_r34`];
      const imgHeadFront = images[`${baseKey}_head_front`];
      const imgHeadL34 = images[`${baseKey}_head_l34`];
      const imgWingL = images[`${baseKey}_wing_l`];
      const imgWingR = images[`${baseKey}_wing_r`];

      ctx.save();
      ctx.translate(px, py);

      if (state.silhouetteMode) {
        ctx.filter = 'brightness(0) contrast(1000%)';
      } else if (isGhost) {
        ctx.globalAlpha = 0.32;
        ctx.filter = 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.6)) contrast(1.2)';
      }

      // Anatomical Shoulder & Neck Pivots
      const shoulderX_L = -targetW * 0.15;
      const shoulderX_R = +targetW * 0.15;
      const shoulderY = -targetH * 0.10;
      const neckY = -targetH * 0.22;

      const isFacingRight = p.yaw >= 0;

      // ─── 1. FAR WING (BEHIND TORSO) ───
      ctx.save();
      const farShoulderX = isFacingRight ? shoulderX_L : shoulderX_R;
      const farSign = isFacingRight ? 1 : -1;
      ctx.translate(farShoulderX, shoulderY);

      // Trailing wing sweeps down/back during a bank
      const farFlap = p.wingFlapAngle - (p.trailWingSweep * farSign);
      // Guarantee wing clearance: clamped so feathers never obscure the face!
      const clampedFarAngle = Math.max(-0.45, Math.min(0.55, farFlap + p.bodyBank * 0.15));
      ctx.rotate(clampedFarAngle);

      if (!state.silhouetteMode) ctx.filter = 'brightness(0.75) saturate(0.85)';
      const farWingImg = isFacingRight ? imgWingL : imgWingR;
      if (farWingImg) {
        ctx.drawImage(farWingImg, (isFacingRight ? -targetW * 0.35 : -targetW * 0.65), -targetH * 0.40, targetW, targetH);
      }
      ctx.restore();

      // ─── 2. TORSO & 28PX CATCH POINT (ROCK-STEADY CATCH POINT) ───
      ctx.save();
      // Kinetic weight shift carries through body bank
      ctx.translate(p.weightShiftX, 0);
      ctx.rotate(p.bodyBank * 0.32);

      // Torso layer: Head and wings are 100% masked out, giving zero ghosting!
      if (imgBody) {
        ctx.drawImage(imgBody, -targetW / 2, -targetH / 2, targetW, targetH);
      }
      ctx.restore();

      // ─── 3. ARTICULATED DIRECTIONAL HEAD & GAZE (Problem 1, 2, 3) ───
      ctx.save();
      ctx.translate(p.weightShiftX, neckY);
      
      // Gaze and eyes lead the turn laterally
      const headDx = Math.sin(p.headAngle) * 20.0 + p.eyeDx * 0.4;
      ctx.translate(headDx, p.eyeDy * 0.3);
      ctx.rotate(p.headAngle * 0.65);

      // Seamless Directional Head Transition (No Blurs! No Ghosting!)
      // Right (>0.35) -> R34; Front (-0.35 to +0.35) -> Front; Left (<-0.35) -> L34
      let activeHead = imgHeadR34;
      if (p.yaw > 0.35) activeHead = imgHeadR34;
      else if (p.yaw < -0.35) activeHead = imgHeadL34;
      else activeHead = imgHeadFront;

      if (activeHead) {
        ctx.drawImage(activeHead, -targetW / 2, -targetH / 2 - neckY, targetW, targetH);
      }

      // Natural Eye & Mouth Controls (Clean & Restrained in Hover)
      if (!state.silhouetteMode) {
        drawArticulatedEyes(game, p);
        drawArticulatedMouth(game, p);
      }

      ctx.restore();

      // ─── 4. NEAR WING (IN FRONT OF TORSO, LEADING AIRFLOW) ───
      ctx.save();
      const nearShoulderX = isFacingRight ? shoulderX_R : shoulderX_L;
      const nearSign = isFacingRight ? 1 : -1;
      ctx.translate(nearShoulderX, shoulderY);

      // Leading wing lifts high into airflow
      const nearFlap = p.wingFlapAngle + (p.leadWingLift * nearSign);
      // Guarantee wing clearance: clamped so feathers never obscure the face!
      const clampedNearAngle = Math.max(-0.45, Math.min(0.60, nearFlap + p.bodyBank * 0.25));
      ctx.rotate(clampedNearAngle);

      if (!state.silhouetteMode) ctx.filter = 'brightness(1.15)';
      const nearWingImg = isFacingRight ? imgWingR : imgWingL;
      if (nearWingImg) {
        ctx.drawImage(nearWingImg, (isFacingRight ? -targetW * 0.65 : -targetW * 0.35), -targetH * 0.40, targetW, targetH);
      }
      ctx.restore();

      // ─── 5. CHARACTER-SPECIFIC WEAPONS & LIMBS ───
      if (!state.silhouetteMode) {
        if (game === 'dynamo') drawDynamoPrincessWeapon(targetW, targetH, tier, p);
        else if (game === 'helix') drawHelixUnicornGait(targetW, targetH, p);
        else if (game === 'meteor') drawMeteorDragonVFX(targetW, targetH, p);
      }

      // Shockwave Pulse
      if (state.pulseRunning) drawFluxPulseWave(game);

      // Skeletal Mesh
      if (state.showSkeletalMesh && !isGhost) drawEnhancedSkeletalRig(targetW, targetH, p);

      ctx.restore();
    }

    // Eyes & Blinking
    function drawArticulatedEyes(game, p) {
      ctx.save();
      const eyeL_x = -18 + (p.yaw * 10) + p.eyeDx * 0.2;
      const eyeR_x = +18 + (p.yaw * 10) + p.eyeDx * 0.2;
      const eye_y = -8 + p.eyeDy * 0.2;

      // Iris highlight tracking
      if (!p.isWinking && p.blinkClosed < 0.85) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeL_x + (p.eyeDx * 0.15), eye_y + (p.eyeDy * 0.15) - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.blinkClosed < 0.85) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeR_x + (p.eyeDx * 0.15), eye_y + (p.eyeDy * 0.15) - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Eyelids
      if (p.blinkClosed > 0.08 || p.isWinking) {
        const lashCol = game === 'dynamo' ? '#3b0764' : game === 'helix' ? '#083344' : '#1c1917';
        const skinCol = game === 'dynamo' ? 'rgba(254, 240, 230, 0.92)' : game === 'helix' ? 'rgba(238, 242, 255, 0.92)' : 'rgba(40, 20, 10, 0.92)';
        
        ctx.fillStyle = skinCol;
        ctx.strokeStyle = lashCol;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.ellipse(eyeL_x, eye_y, 8, 4.5 * p.blinkClosed, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeL_x, eye_y + 1, 8, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();

        const rClose = p.isWinking ? 1.0 : p.blinkClosed;
        ctx.beginPath();
        ctx.ellipse(eyeR_x, eye_y, 8, 4.5 * rClose, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeR_x, eye_y + 1, 8, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Mouth
    function drawArticulatedMouth(game, p) {
      if (p.mouthOpen <= 0.05) return;
      ctx.save();
      const mouthX = p.yaw * 6.0;
      const mouthY = 16.0;

      if (game === 'meteor') {
        const jawDrop = p.mouthOpen * 16.0;
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.ellipse(mouthX, mouthY + jawDrop * 0.5, 14, jawDrop * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(mouthX, mouthY + jawDrop * 0.5, 6 * p.mouthOpen, 0, Math.PI * 2);
        ctx.fill();
      } else if (game === 'dynamo') {
        const smileW = 8.0 + p.mouthOpen * 6.0;
        const smileH = p.mouthOpen * 7.0;
        ctx.fillStyle = '#be185d';
        ctx.beginPath();
        ctx.ellipse(mouthX, mouthY, smileW, smileH, 0, 0, Math.PI);
        ctx.fill();
      } else {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, 7, 0.2 * Math.PI, 0.8 * Math.PI, false);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Dynamo Princess Weapon
    function drawDynamoPrincessWeapon(tw, th, tier, p) {
      ctx.save();
      const dirMult = p.yaw >= 0 ? 1.0 : -1.0;
      const isFloating = (tier === 'IX' || tier === 'X');
      const gapOffset = isFloating ? 28.0 * dirMult : 0.0;
      const muzzleX = (tw * 0.28 * dirMult) + gapOffset;
      const muzzleY = -th * 0.12 - p.recoilKick * 14.0;

      ctx.translate(muzzleX, muzzleY);
      ctx.rotate(p.cannonAim * dirMult);

      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 24;

      const beamLen = tier === 'X' ? 240 : 160;
      const beamWidth = tier === 'X' ? 12 : 7;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = beamWidth;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(beamLen * dirMult, -22);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = beamWidth * 2.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((beamLen + 18) * dirMult, -16);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 7 + p.recoilKick * 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    // Helix Unicorn Gait
    function drawHelixUnicornGait(tw, th, p) {
      ctx.save();
      const dirMult = p.yaw >= 0 ? 1.0 : -1.0;
      const tailAnchorX = -tw * 0.22 * dirMult;
      const tailAnchorY = th * 0.15;
      ctx.translate(tailAnchorX, tailAnchorY);

      // Single settling follow-through wave
      const numPoints = 18;
      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath();
        ctx.strokeStyle = strand === 0 ? 'rgba(56, 189, 248, 0.75)' : 'rgba(236, 72, 153, 0.75)';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = strand === 0 ? '#38bdf8' : '#ec4899';
        ctx.shadowBlur = 10;

        for (let i = 0; i < numPoints; i++) {
          const t = i / numPoints;
          const x = -t * 130 * dirMult;
          const phaseOffset = strand * Math.PI;
          const y = Math.sin(p.secondaryLag * 3.0 + t * 5.0 + phaseOffset) * (16 * (1.0 - t * 0.4));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Meteor Dragon VFX
    function drawMeteorDragonVFX(tw, th, p) {
      ctx.save();

      // Articulated Basalt Claws: Spread in hover/braking, tuck back in glide
      if (!state.silhouetteMode) {
        ctx.save();
        const tuckY = p.clawsTucked * 18.0;
        const clawW = 10.0 - p.clawsTucked * 4.0;
        const clawH = 15.0 - p.clawsTucked * 7.0;
        const clawY = th * 0.18 - tuckY;

        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;

        [-tw * 0.11, tw * 0.11].forEach(cx => {
          ctx.beginPath();
          ctx.ellipse(cx, clawY, clawW, clawH, p.clawsTucked * 0.35 * (cx > 0 ? 1 : -1), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
        ctx.restore();
      }

      for (let i = 0; i < p.flameParticles.length; i++) {
        const pt = p.flameParticles[i];
        const relX = pt.x - p.x;
        const relY = pt.y - p.y;
        ctx.fillStyle = pt.hue;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.beginPath();
        ctx.arc(relX, relY, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }

    // Shockwave
    function drawFluxPulseWave(game) {
      ctx.save();
      const waveCol = game === 'dynamo' ? '#c084fc' : game === 'helix' ? '#22d3ee' : '#f97316';
      ctx.strokeStyle = waveCol;
      ctx.lineWidth = 7;
      ctx.shadowColor = waveCol;
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(0, 0, state.pulseWaveRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Skeletal Rig Overlay
    function drawEnhancedSkeletalRig(tw, th, p) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -th * 0.28); ctx.lineTo(0, 0); ctx.lineTo(0, th * 0.24);
      ctx.moveTo(-tw * 0.16, -th * 0.12); ctx.lineTo(0, -th * 0.08); ctx.lineTo(tw * 0.16, -th * 0.12);
      ctx.stroke();

      const joints = [
        [0, 0, 7, '#22c55e'],
        [0, -th * 0.28, 6, '#38bdf8'],
        [-tw * 0.16, -th * 0.12, 5, '#38bdf8'],
        [tw * 0.16, -th * 0.12, 5, '#38bdf8'],
        [0, th * 0.24, 5, '#38bdf8']
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

    // Tier V Scale Ghost
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

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, targetW * 0.32, targetH * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Master Render Loop
    let lastTime = performance.now();
    function renderLoop(currentTime) {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      updateBenchmark(dt);
      updateCollectiblesCourse(dt);
      updateFluxPulse(dt);
      updatePhysics(dt);

      ctx.save();
      ctx.clearRect(0, 0, 1920, 1080);

      ctx.translate(960, 540);
      ctx.scale(state.camZoom, state.camZoom);
      ctx.translate(-state.player.x, -state.player.y);

      drawRealmStarfield(state.realm);

      if (state.showT5Ghost && !state.silhouetteMode) {
        drawTier5ReferenceGhost(state.realm, state.player.x, state.player.y);
      }

      drawRiggedCharacter(state.realm, state.tier, state.player.x, state.player.y);

      // Collision Catch Reticle & 28px Radius
      if (state.showCatchPoint && !state.silhouetteMode) {
        ctx.save();
        ctx.translate(state.player.x, state.player.y);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-38, 0); ctx.lineTo(38, 0);
        ctx.moveTo(0, -38); ctx.lineTo(0, 38);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      requestAnimationFrame(renderLoop);
    }

    updateTitles();
    requestAnimationFrame(renderLoop);
  </script>
</body>
</html>
"""

with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Successfully generated {output_html} ({len(html_code)} bytes)")
