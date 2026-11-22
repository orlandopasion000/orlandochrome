import os

output_html = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chrome Arcade · Tier VI–X Living Articulated Motion Studio v4</title>
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
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #94a3b8;
      padding: 5px 12px;
      border-radius: 14px;
      font-size: 10.5px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
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
    .toggle-pill.active-gold {
      background: rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      border-color: #f59e0b;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
    }
    .toggle-pill.active-green {
      background: rgba(34, 197, 94, 0.35);
      color: #4ade80;
      border-color: #22c55e;
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
    }

    /* Interactive Bottom Control Bar */
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
    .seq-play-btn.btn-action-green {
      background: linear-gradient(135deg, #15803d, #166534);
      border-color: #4ade80;
    }
    .seq-play-btn.btn-action-red {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      border-color: #f87171;
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
        <div class="brand-title">CHROME ARCADE · TIER VI–X LIVING ARTICULATED MOTION STUDIO v4</div>
        <div class="brand-sub">Directional Heads · Eye & Mouth Tracking · Multi-Wing Flight · Decisive Course</div>
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
      <div>Head Direction & Pose: <span class="val" id="tel-head-pose">R34 (FORWARD-RIGHT)</span></div>
      <div>Eye Tracking & Gaze: <span class="val" id="tel-eyes">ATTENTIVE (OPEN)</span></div>
      <div>Mouth & Expression: <span class="val" id="tel-mouth">RESTING CLOSED</span></div>
      <div>Multi-Wing Stroke (All Wings): <span class="val" id="tel-wings">UPPER/MID/LOWER INDEPENDENT</span></div>
      <div>Catch Point (X, Y): <span class="val" id="tel-pos">960, 780</span></div>
      <div>Velocity & Accel: <span class="val" id="tel-vel">Vx 0.0, Ax 0.0</span></div>
      <div>Bank & Head Tilt: <span class="val" id="tel-bank">0.0° / 0.0°</span></div>
      <div>Weapon State & Recoil: <span class="val" id="tel-weapon">AIM LOCKED (0°)</span></div>
      <div>Living Gait & Limbs: <span class="val" id="tel-gait">ROYAL BALANCE</span></div>
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

    <!-- Canonical 7-Stage Benchmark & Interactive Sequencer Bar -->
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
      
      // Collectibles Intercept Course State
      courseRunning: false,
      courseTime: 0,
      collectibles: [
        { id: 1, x: 520, y: 260, caught: false, pulse: 0, type: 'node' },
        { id: 2, x: 1400, y: 260, caught: false, pulse: 0, type: 'node' }
      ],
      hazard: { x: 960, y: 210, grazed: false },
      
      // Flux Pulse Event State
      pulseRunning: false,
      pulseTime: 0,
      pulseWaveRadius: 0,
      
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
        headAngle: 0,             // Head leads turn
        shoulderBank: 0,          // Shoulder line tilt
        pitchAngle: 0,            // Vertical climb/descend pitch
        
        // Eye Tracking & Blinking System
        eyeDx: 0,
        eyeDy: 0,
        gazeHoldTimer: 0,
        blinkTimer: 0,
        blinkDuration: 0.16,
        blinkClosed: 0.0,         // 0: Open, 1: Fully Closed
        isWinking: false,
        
        // Mouth & Expression System
        mouthState: 'rest',       // 'rest', 'smile', 'focus', 'roar'
        mouthOpen: 0.0,           // 0: closed, 1: wide open
        expressionTimer: 0,
        
        // Multi-Wing Independent Aerodynamic Engine
        wingCycle: 0,             // Master flapping phase (1.1 Hz)
        wingFlapUpper: 0,         // Upper wing stroke (-18° to +30°)
        wingFlapMid: 0,           // Middle wing stroke (-14° to +22°, 0.15s lag)
        wingFlapLower: 0,         // Lower/hip wing stroke (-10° to +16°, 0.28s lag)
        wingTipFlex: 0,
        brakeFlare: 0,
        breathPhase: 0,
        
        // Character Specific Mechanics
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
        neckBend: 0,
        tailPhase: 0,
        
        // Meteor Dragon
        dragonStroke: 0,          // 0: Downstroke, 1: Recovery, 2: Glide
        clawsTucked: 0.0,         // 0: Spread/Hover, 1: Tucked/Speed
        neckJoints: [0, 0, 0],    // 3-joint articulate neck
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
        assetManifest[`${k}_head_r34`] = `assets/characters/rigs/${k}_head_r34.png`;
        assetManifest[`${k}_head_front`] = `assets/characters/rigs/${k}_head_front.png`;
        assetManifest[`${k}_head_l34`] = `assets/characters/rigs/${k}_head_l34.png`;
        assetManifest[`${k}_head_left`] = `assets/characters/rigs/${k}_head_left.png`;
        
        // Multi-wing independent layers
        assetManifest[`${k}_wing_upper_l`] = `assets/characters/rigs/${k}_wing_upper_l.png`;
        assetManifest[`${k}_wing_upper_r`] = `assets/characters/rigs/${k}_wing_upper_r.png`;
        assetManifest[`${k}_wing_mid_l`] = `assets/characters/rigs/${k}_wing_mid_l.png`;
        assetManifest[`${k}_wing_mid_r`] = `assets/characters/rigs/${k}_wing_mid_r.png`;
        assetManifest[`${k}_wing_lower_l`] = `assets/characters/rigs/${k}_wing_lower_l.png`;
        assetManifest[`${k}_wing_lower_r`] = `assets/characters/rigs/${k}_wing_lower_r.png`;

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
      setTel('tel-cam', state.isCloseUpMode ? '2.5x CLOSE-UP' : '1.0x GAMEPLAY');
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

    document.getElementById('btn-run-course').addEventListener('click', function() {
      startCollectiblesCourse();
    });

    document.getElementById('btn-trigger-pulse').addEventListener('click', function() {
      triggerFluxPulse();
    });

    document.getElementById('btn-run-benchmark').addEventListener('click', function() {
      if (state.benchmarkRunning) {
        stopBenchmark();
      } else {
        startBenchmark();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        state.isPausedTurnMidpoint = !state.isPausedTurnMidpoint;
        document.getElementById('toggle-pause-turn').classList.toggle('active', state.isPausedTurnMidpoint);
        if (state.isPausedTurnMidpoint) {
          setTel('tel-state', 'PAUSED TURN MIDPOINT (3/4 DEPTH)');
        }
      } else if (e.code === 'KeyP') {
        triggerFluxPulse();
      } else if (e.code === 'KeyC') {
        startCollectiblesCourse();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.keys.left = true;
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

    // ─── DECISIVE COLLECTIBLES INTERCEPT SEQUENCE ───
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
        // Stage 1: Stationary hover, eyes scan collectibles
        p.targetX = 960; p.targetY = 780;
        setTel('tel-state', 'COURSE 1/6: ACQUIRING COLLECTIBLE 1 (LEFT)');
      } else if (ct < 4.0) {
        // Stage 2: Steer left toward Collectible 1 (520, 260)
        p.targetX = 520; p.targetY = 300;
        setTel('tel-state', 'COURSE 2/6: STEERING LEFT TO INTERCEPT');
        if (Math.abs(p.x - 520) < 60 && Math.abs(p.y - 300) < 60 && !state.collectibles[0].caught) {
          state.collectibles[0].caught = true;
          state.collectibles[0].pulse = 1.0;
          triggerCatchEvent();
        }
      } else if (ct < 7.5) {
        // Stage 3: Sharp reversal toward Collectible 2 (1400, 260), passing hazard (960, 210)
        p.targetX = 1400; p.targetY = 300;
        if (Math.abs(p.x - 960) < 140 && !state.hazard.grazed) {
          state.hazard.grazed = true;
          triggerGrazeEvent();
          setTel('tel-state', 'COURSE 3/6: HAZARD GRAZE (EYE GLANCE OF CAUTION)');
        } else {
          setTel('tel-state', 'COURSE 4/6: REVERSING RIGHT TO INTERCEPT 2');
        }
        if (Math.abs(p.x - 1400) < 60 && Math.abs(p.y - 300) < 60 && !state.collectibles[1].caught) {
          state.collectibles[1].caught = true;
          state.collectibles[1].pulse = 1.0;
          triggerCatchEvent();
        }
      } else if (ct < 10.5) {
        // Stage 4: Release controls, deceleration, return to hover
        p.targetX = 960; p.targetY = 780;
        setTel('tel-state', 'COURSE 5/6: BRAKING FLARE & RETURNING TO HOVER');
      } else {
        state.courseRunning = false;
        document.getElementById('btn-run-course').classList.remove('active');
        setTel('tel-state', 'COURSE COMPLETE · PERFECT HOVER RESTORED');
      }
    }

    function triggerCatchEvent() {
      p.mouthState = 'smile';
      p.mouthOpen = 0.85;
      p.expressionTimer = 0;
      if (state.realm === 'dynamo' && (state.tier === 'VI' || state.tier === 'VII')) {
        p.isWinking = true;
      }
    }

    function triggerGrazeEvent() {
      p.mouthState = 'focus';
      p.mouthOpen = 0.35;
      p.expressionTimer = 0;
    }

    // ─── FLUX PULSE EVENT TRIGGER ───
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

      if (pt < 0.8) {
        setTel('tel-state', 'FLUX PULSE: GATHERING COSMIC ENERGY');
      } else if (pt < 2.0) {
        setTel('tel-state', 'FLUX PULSE: MAXIMUM DISCHARGE BLAST!');
      } else if (pt < 3.0) {
        setTel('tel-state', 'FLUX PULSE: RECOVERY & SETTLING');
      } else {
        state.pulseRunning = false;
        document.getElementById('btn-trigger-pulse').classList.remove('active');
      }
    }

    // ─── CANONICAL 7-STAGE BENCHMARK SEQUENCER (23s) ───
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

    // ─── KINEMATICS, ACTIVE MULTI-WINGBEAT & DIRECTIONAL RIG ENGINE ───
    function updatePhysics(dt) {
      const p = state.player;

      // Camera Zoom Smoothing
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

      // Smooth damped spring-damper following (Chest core stays locked to catch point!)
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      
      const prevVx = p.vx;
      p.vx = (p.vx + dx * 13.5 * dt) * Math.pow(0.74, dt * 60);
      p.vy = (p.vy + dy * 13.5 * dt) * Math.pow(0.74, dt * 60);
      p.ax = (p.vx - prevVx) / Math.max(0.001, dt);
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Normalized Steering Values
      const normVx = Math.max(-1.0, Math.min(1.0, p.vx / 14.0));
      const normVy = Math.max(-1.0, Math.min(1.0, p.vy / 12.0));
      const normAx = Math.max(-1.0, Math.min(1.0, p.ax / 80.0));

      // 1. Steering Intent with Dead Zone & Volumetric Facing (Problem 1)
      // Dead zone: small nudges don't twitch; sustained left input produces a visible left-facing pose!
      if (Math.abs(normVx) > 0.12) {
        const targetYaw = normVx > 0 ? 1.0 : -1.0;
        p.yaw += (targetYaw - p.yaw) * 7.5 * dt;
        p.gazeHoldTimer = 0.45;
      } else {
        // On release: hold last gaze briefly and ease back to relaxed hover
        p.gazeHoldTimer -= dt;
        if (p.gazeHoldTimer <= 0) {
          const hoverYaw = p.yaw > 0 ? 0.35 : -0.35;
          p.yaw += (hoverYaw - p.yaw) * 4.5 * dt;
        }
      }

      // 2. Separate Controls: Eyes Find Direction First, Head Follows, Shoulders Settle (Problem 1 & 2)
      // Find nearest target to glance at (Collectible during course, or steering direction)
      let targetGazeX = normVx * 10.0;
      let targetGazeY = normVy * 8.0;
      if (state.courseRunning) {
        const targetColl = !state.collectibles[0].caught ? state.collectibles[0] : !state.collectibles[1].caught ? state.collectibles[1] : null;
        if (targetColl) {
          const cdx = targetColl.x - p.x;
          const cdy = targetColl.y - p.y;
          targetGazeX = Math.max(-14, Math.min(14, cdx * 0.025));
          targetGazeY = Math.max(-10, Math.min(10, cdy * 0.020));
        }
      }
      p.eyeDx += (targetGazeX - p.eyeDx) * 22.0 * dt; // Eyes acquire first!
      p.eyeDy += (targetGazeY - p.eyeDy) * 20.0 * dt;

      // Natural Eyelid Blinking (140ms closure, irregular 3.5s - 5.5s interval)
      p.blinkTimer += dt;
      if (p.blinkTimer > 4.5) {
        if (p.blinkTimer > 4.5 + 0.16) {
          p.blinkTimer = Math.random() * 0.8; // jitter next blink
          p.blinkClosed = 0.0;
          p.isWinking = false;
        } else {
          p.blinkClosed = Math.sin(((p.blinkTimer - 4.5) / 0.16) * Math.PI);
        }
      } else {
        p.blinkClosed = 0.0;
      }

      // Head & Neck Turn Follows Eyes
      const targetHead = normVx * 0.38 + normAx * 0.20 + (p.eyeDx * 0.015);
      p.headAngle += (targetHead - p.headAngle) * 14.0 * dt;

      // Shoulder Line & Body Banking Follows Head
      const targetBank = normVx * 0.20 + normAx * 0.26;
      p.bodyBank += (targetBank - p.bodyBank) * 9.0 * dt;
      p.shoulderBank = p.bodyBank * 0.88;

      // Vertical Pitch & Aerodynamic Braking Flare
      const targetPitch = normVy * 0.22;
      p.pitchAngle += (targetPitch - p.pitchAngle) * 9.0 * dt;
      const targetBrake = Math.max(0, normVy * 0.26) + (Math.abs(p.vx) < 1.2 && Math.abs(dx) > 10 ? 0.24 : 0.0);
      p.brakeFlare += (targetBrake - p.brakeFlare) * 8.5 * dt;

      // 3. Local Breathing Rhythm (Problem 4 - 0.4 Hz through ribs, shoulders, throat)
      p.breathPhase += dt * 2.6;
      const breath = Math.sin(p.breathPhase) * 0.038;

      // 4. Multi-Wing Independent Aerodynamic Wingbeat Engine (Crucial Requirement!)
      // Wings NEVER freeze! Upper, middle, and lower wings beat with independent phase offsets!
      const flapFreq = 6.6 + Math.abs(normVx) * 3.4;
      p.wingCycle += dt * flapFreq;
      
      const strokePhase = p.wingCycle % (Math.PI * 2);
      const isDownstroke = strokePhase < Math.PI * 0.85;

      // Upper wings (Primary lift & lead sweep)
      p.wingFlapUpper = (isDownstroke ? (Math.cos((strokePhase / (Math.PI * 0.85)) * Math.PI) * 0.36 + 0.08) : (-Math.cos(((strokePhase - Math.PI * 0.85) / (Math.PI * 1.15)) * Math.PI) * 0.36 + 0.08));
      
      // Middle wings (0.15s / 0.8 rad phase lag, flutter flexibility)
      const midPhase = (strokePhase + 0.8) % (Math.PI * 2);
      p.wingFlapMid = Math.sin(midPhase) * 0.28 + breath * 0.5;

      // Lower / Hip wings (0.28s / 1.5 rad phase lag, smaller stabilizing stroke)
      const lowPhase = (strokePhase + 1.5) % (Math.PI * 2);
      p.wingFlapLower = Math.sin(lowPhase) * 0.20 - breath * 0.3;

      p.wingTipFlex = isDownstroke ? 0.22 : -0.18;

      // 5. Mouth & Expression Timing (Problem 3)
      if (p.mouthState !== 'rest') {
        p.expressionTimer += dt;
        if (p.expressionTimer > 2.2) {
          p.mouthOpen *= Math.pow(0.80, dt * 60);
          if (p.mouthOpen < 0.05) {
            p.mouthState = 'rest';
            p.mouthOpen = 0.0;
          }
        }
      }

      // ─── CHARACTER-SPECIFIC MECHANICS ───

      // Dynamo Princess: Recoil, Cannon Aim, Knees & Fabric Settle
      if (state.realm === 'dynamo') {
        const isYoung = (state.tier === 'VI' || state.tier === 'VII');
        const targetAim = normVx * 0.22;
        p.cannonAim += (targetAim - p.cannonAim) * (isYoung ? 14.0 : 6.0) * dt;

        p.kneeFlex = Math.sin(p.breathPhase * 1.2) * (isYoung ? 6.5 : 4.0);
        p.bootDrift = Math.cos(p.breathPhase * 0.9) * 4.5 + (p.brakeFlare * 8.0);

        p.recoilTimer += dt;
        if (p.recoilTimer > 2.6) {
          p.recoilTimer = 0;
          p.recoilKick = 1.0;
        }
        p.recoilKick *= Math.pow(isYoung ? 0.76 : 0.85, dt * 60);
      }

      // Helix Unicorn: 4-Leg Aerial Canter & Flying Lead Change (Problem 5)
      else if (state.realm === 'helix') {
        const isHover = Math.abs(normVx) < 0.12 && Math.abs(normVy) < 0.12;
        const gaitSpeed = isHover ? 2.4 : (5.8 + Math.abs(normVx) * 4.5);
        p.canterPhase += dt * gaitSpeed;
        const cPhase = (p.canterPhase % (Math.PI * 2)) / (Math.PI * 2);

        // Lead change during suspension phase
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
          // Equestrian 4-Phase Sequence
          if (cPhase < 0.25) p.canterGaitBeat = 1;      // Trailing Hind
          else if (cPhase < 0.55) p.canterGaitBeat = 2; // Diagonal
          else if (cPhase < 0.80) p.canterGaitBeat = 3; // Leading Fore
          else p.canterGaitBeat = 4;                    // Suspension

          const lead = p.canterLead;
          p.legFlap[0] = Math.sin(p.canterPhase + (lead > 0 ? 0.0 : 1.2)) * 0.38;
          p.legFlap[1] = Math.sin(p.canterPhase + (lead > 0 ? 1.2 : 0.0)) * 0.38;
          p.legFlap[2] = Math.sin(p.canterPhase + 2.4) * 0.40;
          p.legFlap[3] = Math.sin(p.canterPhase + 3.6) * 0.40;
          p.neckBob = Math.sin(p.canterPhase) * 0.12;
        }
        p.tailPhase += dt * (isHover ? 3.0 : 6.5);
      }

      // Meteor Dragon: 3-Segment Articulated Neck, Claws & 5-Joint Tail
      else {
        p.clawsTucked += ((Math.abs(normVx) > 0.45 ? 1.0 : 0.0) - p.clawsTucked) * 6.5 * dt;

        // 3-Segment Neck Bend
        let prevNeck = p.headAngle;
        for (let j = 0; j < 3; j++) {
          p.neckJoints[j] += (prevNeck - p.neckJoints[j]) * (14.0 - j * 3.0) * dt;
          prevNeck = p.neckJoints[j];
        }

        // 5-Joint Spine & Heavy Tail Mace
        let prevTail = p.bodyBank;
        for (let t = 0; t < 5; t++) {
          p.tailChain[t] += (prevTail - p.tailChain[t]) * (11.0 - t * 1.6) * dt;
          prevTail = p.tailChain[t];
        }

        updateContinuousFlameSystem(p, dt);
      }

      // Update Telemetry Panel Readouts Safely
      const faceDirStr = p.yaw > 0.35 ? 'FORWARD-RIGHT' : p.yaw < -0.35 ? 'FORWARD-LEFT' : '3/4 DEPTH TURN';
      const volWidth = (0.94 + 0.06 * Math.abs(p.yaw)) * 100;
      setTel('tel-facing', `${faceDirStr} (${volWidth.toFixed(0)}% VOL)`);
      
      const headPoseKey = p.yaw > 0.35 ? 'R34 (RIGHT 3/4)' : p.yaw < -0.35 ? 'L34 (LEFT 3/4)' : 'FRONT (SYMMETRIC)';
      setTel('tel-head-pose', headPoseKey);
      
      const eyeStatus = p.isWinking ? 'PLAYFUL WINK' : p.blinkClosed > 0.5 ? 'ATTENTIVE (BLINK)' : `TARGET ACQUIRED (${p.eyeDx > 0 ? 'R' : 'L'})`;
      setTel('tel-eyes', eyeStatus);

      const mouthDesc = p.mouthState === 'roar' ? 'ROAR / MAGMA PULSE' : p.mouthState === 'smile' ? 'JOYFUL SMILE' : p.mouthState === 'focus' ? 'FOCUSED AIM' : 'RESTING HOVER';
      setTel('tel-mouth', `${mouthDesc} (${(p.mouthOpen * 100).toFixed(0)}%)`);

      setTel('tel-wings', `UPPER ${(p.wingFlapUpper * 180 / Math.PI).toFixed(0)}° / MID ${(p.wingFlapMid * 180 / Math.PI).toFixed(0)}° / LOW ${(p.wingFlapLower * 180 / Math.PI).toFixed(0)}°`);
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

    // Continuous Moving Fire System for Meteor Dragon
    function updateContinuousFlameSystem(p, dt) {
      if (state.silhouetteMode) return;
      if (Math.random() < 0.85) {
        p.flameParticles.push({
          x: p.x + (Math.random() - 0.5) * 80,
          y: p.y - 20 + (Math.random() - 0.5) * 40,
          vx: -p.vx * 0.45 + (Math.random() - 0.5) * 35,
          vy: -60 - Math.random() * 80,
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
        // High-contrast illuminated studio lightbox backdrop for 100% silhouette readability!
        const studioGrad = ctx.createRadialGradient(960, 540, 60, 960, 540, 980);
        studioGrad.addColorStop(0, '#f8fafc');
        studioGrad.addColorStop(0.55, '#cbd5e1');
        studioGrad.addColorStop(1, '#64748b');
        ctx.fillStyle = studioGrad;
        ctx.fillRect(0, 0, 1920, 1080);

        // Technical Studio Motion Alignment Grid
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

      // Draw Collectibles Intercept Course Nodes & Hazards
      drawCourseItems(game);
    }

    function drawCourseItems(game) {
      const nodeImg = images[`node_${game}`];
      const hazImg = images[`hazard_${game}`];

      // Collectible 1 (Left: 520, 260)
      if (!state.collectibles[0].caught && nodeImg) {
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.drawImage(nodeImg, 520 - 55, 260 - 70, 110, 140);
        ctx.restore();
      }

      // Collectible 2 (Right: 1400, 260)
      if (!state.collectibles[1].caught && nodeImg) {
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.drawImage(nodeImg, 1400 - 55, 260 - 70, 110, 140);
        ctx.restore();
      }

      // Approaching Hazard (Center: 960, 210)
      if (hazImg) {
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = state.hazard.grazed ? 28 : 12;
        ctx.drawImage(hazImg, 960 - 55, 210 - 70, 110, 140);
        ctx.restore();
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
      const imgDirLeft = images[`${baseKey}_dir_left`];
      const imgDirRight = images[`${baseKey}_dir_right`];
      const imgDirTurn = images[`${baseKey}_dir_turn`];

      // Directional Heads (Problem 1)
      const imgHeadR34 = images[`${baseKey}_head_r34`] || images[`${baseKey}_head`];
      const imgHeadFront = images[`${baseKey}_head_front`] || imgHeadR34;
      const imgHeadL34 = images[`${baseKey}_head_l34`] || images[`${baseKey}_head_left`];

      // Multi-Wing Independent Layers (Crucial Requirement)
      const imgWingUpL = images[`${baseKey}_wing_upper_l`] || images[`${baseKey}_wing_l`];
      const imgWingUpR = images[`${baseKey}_wing_upper_r`] || images[`${baseKey}_wing_r`];
      const imgWingMidL = images[`${baseKey}_wing_mid_l`] || images[`${baseKey}_wing_l`];
      const imgWingMidR = images[`${baseKey}_wing_mid_r`] || images[`${baseKey}_wing_r`];
      const imgWingLowL = images[`${baseKey}_wing_lower_l`] || images[`${baseKey}_wing_l`];
      const imgWingLowR = images[`${baseKey}_wing_lower_r`] || images[`${baseKey}_wing_r`];

      ctx.save();
      ctx.translate(px, py);

      if (state.silhouetteMode) {
        ctx.filter = 'brightness(0) contrast(200%)';
      } else if (isGhost) {
        ctx.globalAlpha = 0.32;
        ctx.filter = 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.6)) contrast(1.2)';
      }

      // Anatomical Anchor Offsets
      const shoulderX_L = -targetW * 0.15;
      const shoulderX_R = +targetW * 0.15;
      const shoulderY = -targetH * 0.10;
      const neckY = -targetH * 0.22;

      const isFacingRight = p.yaw >= 0;
      const isMidpointTurn = Math.abs(p.yaw) < 0.28 || state.isPausedTurnMidpoint;

      // ─── 1. INDEPENDENT FAR WINGS (BEHIND TORSO) ───
      // Articulate Upper, Middle, and Lower wings with independent phase offsets!
      ctx.save();
      const farShoulderX = isFacingRight ? shoulderX_L : shoulderX_R;
      const farSign = isFacingRight ? 1 : -1;
      ctx.translate(farShoulderX, shoulderY);

      if (!state.silhouetteMode) ctx.filter = 'brightness(0.72) saturate(0.85)';

      // Far Lower Wing
      ctx.save();
      ctx.rotate((p.wingFlapLower * farSign) * 0.75 + p.bodyBank * 0.15);
      const farLowImg = isFacingRight ? imgWingLowL : imgWingLowR;
      if (farLowImg) ctx.drawImage(farLowImg, (isFacingRight ? -targetW * 0.35 : -targetW * 0.65), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      // Far Middle Wing
      ctx.save();
      ctx.rotate((p.wingFlapMid * farSign) * 0.85 + p.bodyBank * 0.18);
      const farMidImg = isFacingRight ? imgWingMidL : imgWingMidR;
      if (farMidImg) ctx.drawImage(farMidImg, (isFacingRight ? -targetW * 0.35 : -targetW * 0.65), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      // Far Upper Wing
      ctx.save();
      ctx.rotate((p.wingFlapUpper * farSign) * 0.95 + p.bodyBank * 0.22);
      const farUpImg = isFacingRight ? imgWingUpL : imgWingUpR;
      if (farUpImg) ctx.drawImage(farUpImg, (isFacingRight ? -targetW * 0.35 : -targetW * 0.65), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      ctx.restore();

      // ─── 2. TORSO & 28PX CATCH POINT CORE (ROCK-STEADY, VOLUME PRESERVED) ───
      ctx.save();
      ctx.rotate(p.bodyBank * 0.35);
      
      // Preserve full 94% to 100% rib cage volume (NEVER flattens or cardboard flips!)
      const torsoScaleX = 0.94 + 0.06 * Math.abs(p.yaw);
      ctx.scale(torsoScaleX, 1.0);

      // Underneath, the head and wings are 100% masked out, guaranteeing ZERO ghosting!
      if (isMidpointTurn && imgDirTurn) {
        ctx.drawImage(imgDirTurn, -targetW / 2, -targetH / 2, targetW, targetH);
      } else {
        const poseImg = isFacingRight ? (imgDirRight || imgBody) : (imgDirLeft || imgBody);
        if (poseImg) ctx.drawImage(poseImg, -targetW / 2, -targetH / 2, targetW, targetH);
      }
      ctx.restore();

      // ─── 3. ARTICULATED DIRECTIONAL HEAD, EYES & MOUTH (Problems 1, 2, 3) ───
      ctx.save();
      ctx.translate(0, neckY);
      
      // Gaze and eyes lead turn laterally
      const headDx = Math.sin(p.headAngle) * 22.0 + p.eyeDx * 0.5;
      ctx.translate(headDx, p.eyeDy * 0.4);
      ctx.rotate(p.headAngle * 0.68);

      // Choose authored directional head based on yaw angle:
      // Facing right (>0.35) -> R34; Facing front (-0.35 to +0.35) -> Front; Facing left (<-0.35) -> L34!
      let activeHead = imgHeadR34;
      if (p.yaw > 0.35) {
        activeHead = imgHeadR34;
      } else if (p.yaw < -0.35) {
        activeHead = imgHeadL34;
      } else {
        activeHead = imgHeadFront;
      }

      if (activeHead) {
        ctx.drawImage(activeHead, -targetW / 2, -targetH / 2 - neckY, targetW, targetH);
      }

      // Natural Eyelid Blinking & Eye Expressions (Problem 2)
      if (!state.silhouetteMode) {
        drawArticulatedEyes(game, p);
        drawArticulatedMouth(game, p);
      }

      ctx.restore();

      // ─── 4. INDEPENDENT NEAR WINGS (IN FRONT OF TORSO, RIM-LIT) ───
      ctx.save();
      const nearShoulderX = isFacingRight ? shoulderX_R : shoulderX_L;
      const nearSign = isFacingRight ? 1 : -1;
      ctx.translate(nearShoulderX, shoulderY);

      if (!state.silhouetteMode) ctx.filter = 'brightness(1.16)';

      // Near Lower Wing
      ctx.save();
      ctx.rotate((p.wingFlapLower * nearSign) * 0.80 + p.bodyBank * 0.20);
      const nearLowImg = isFacingRight ? imgWingLowR : imgWingLowL;
      if (nearLowImg) ctx.drawImage(nearLowImg, (isFacingRight ? -targetW * 0.65 : -targetW * 0.35), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      // Near Middle Wing
      ctx.save();
      ctx.rotate((p.wingFlapMid * nearSign) * 0.90 + p.bodyBank * 0.25);
      const nearMidImg = isFacingRight ? imgWingMidR : imgWingMidL;
      if (nearMidImg) ctx.drawImage(nearMidImg, (isFacingRight ? -targetW * 0.65 : -targetW * 0.35), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      // Near Upper Wing (Leads airflow downstroke)
      ctx.save();
      ctx.rotate((p.wingFlapUpper * nearSign) * 1.05 + p.bodyBank * 0.30);
      const nearUpImg = isFacingRight ? imgWingUpR : imgWingUpL;
      if (nearUpImg) ctx.drawImage(nearUpImg, (isFacingRight ? -targetW * 0.65 : -targetW * 0.35), -targetH * 0.40, targetW, targetH);
      ctx.restore();

      ctx.restore();

      // ─── 5. CHARACTER-SPECIFIC WEAPONS, LIMBS & GAIT ───
      if (!state.silhouetteMode) {
        if (game === 'dynamo') {
          drawDynamicDynamoCannon(targetW, targetH, tier, p);
        } else if (game === 'helix') {
          drawHelixLivingGait(targetW, targetH, p);
        } else if (game === 'meteor') {
          drawMeteorDragonVFX(targetW, targetH, p);
        }
      }

      // ─── 6. FLUX PULSE EXPANDING DESTROYER WAVE ───
      if (state.pulseRunning) {
        drawFluxPulseWave(game);
      }

      // Skeletal Debug Rig Overlay (if enabled)
      if (state.showSkeletalMesh && !isGhost) {
        drawEnhancedSkeletalRig(targetW, targetH, p);
      }

      ctx.restore();
    }

    // ─── ARTICULATED EYES & BLINKING (Problem 2) ───
    function drawArticulatedEyes(game, p) {
      ctx.save();
      const eyeL_x = -18 + (p.yaw * 10) + p.eyeDx * 0.2;
      const eyeR_x = +18 + (p.yaw * 10) + p.eyeDx * 0.2;
      const eye_y = -8 + p.eyeDy * 0.2;

      // Iris highlight tracking
      const irisCol = game === 'dynamo' ? '#c084fc' : game === 'helix' ? '#38bdf8' : '#fb923c';

      // Left Eye
      if (!p.isWinking && p.blinkClosed < 0.85) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeL_x + (p.eyeDx * 0.15), eye_y + (p.eyeDy * 0.15) - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Right Eye
      if (p.blinkClosed < 0.85) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeR_x + (p.eyeDx * 0.15), eye_y + (p.eyeDy * 0.15) - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Eyelid Blinking: Graceful curved lash line & soft skin tint
      if (p.blinkClosed > 0.08 || p.isWinking) {
        const lashCol = game === 'dynamo' ? '#3b0764' : game === 'helix' ? '#083344' : '#1c1917';
        const skinCol = game === 'dynamo' ? 'rgba(254, 240, 230, 0.92)' : game === 'helix' ? 'rgba(238, 242, 255, 0.92)' : 'rgba(40, 20, 10, 0.92)';
        
        ctx.fillStyle = skinCol;
        ctx.strokeStyle = lashCol;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';

        // Left Lid
        ctx.beginPath();
        ctx.ellipse(eyeL_x, eye_y, 8, 4.5 * p.blinkClosed, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeL_x, eye_y + 1, 8, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();

        // Right Lid (or playful wink on catch!)
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

    // ─── ARTICULATED MOUTH & JAW (Problem 3) ───
    function drawArticulatedMouth(game, p) {
      if (p.mouthOpen <= 0.05) return; // Resting closed in hover!

      ctx.save();
      const mouthX = p.yaw * 6.0;
      const mouthY = 16.0;

      if (game === 'meteor') {
        // Dragon Lower Jaw drops down, revealing internal magma cavity!
        const jawDrop = p.mouthOpen * 16.0;
        ctx.save();
        ctx.fillStyle = '#7f1d1d'; // deep throat
        ctx.beginPath();
        ctx.ellipse(mouthX, mouthY + jawDrop * 0.5, 14, jawDrop * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Magma throat glow
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(mouthX, mouthY + jawDrop * 0.5, 6 * p.mouthOpen, 0, Math.PI * 2);
        ctx.fill();

        // Sharp fangs
        ctx.fillStyle = '#ffffff';
        [-8, 0, 8].forEach(fx => {
          ctx.beginPath();
          ctx.moveTo(mouthX + fx - 2, mouthY);
          ctx.lineTo(mouthX + fx, mouthY + 5);
          ctx.lineTo(mouthX + fx + 2, mouthY);
          ctx.fill();
        });
        ctx.restore();
      } else if (game === 'dynamo') {
        // Princess smile / focused cry
        const smileW = 8.0 + p.mouthOpen * 6.0;
        const smileH = p.mouthOpen * 7.0;
        ctx.fillStyle = '#be185d';
        ctx.beginPath();
        ctx.ellipse(mouthX, mouthY, smileW, smileH, 0, 0, Math.PI);
        ctx.fill();
      } else {
        // Unicorn soft muzzle parting
        const muzzleH = p.mouthOpen * 4.0;
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, 7, 0.2 * Math.PI, 0.8 * Math.PI, false);
        ctx.stroke();
      }

      ctx.restore();
    }

    // ─── DYNAMO PRINCESS CANNON RIG ───
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

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = beamWidth;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(beamLen * dirMult, -25);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = beamWidth * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((beamLen + 20) * dirMult, -18);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 8 + p.recoilKick * 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    // ─── HELIX UNICORN DNA LIVING GAIT ───
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

    // ─── METEOR DRAGON CONTINUOUS MOVING FIRE & ARTICULATED CLAWS ───
    function drawMeteorDragonVFX(tw, th, p) {
      ctx.save();

      // Articulated Basalt Claws: Spread in hover/braking, tightly tucked back during aerodynamic glide!
      if (!state.silhouetteMode) {
        ctx.save();
        const tuckY = p.clawsTucked * 20.0;
        const clawW = 10.0 - p.clawsTucked * 4.0;
        const clawH = 16.0 - p.clawsTucked * 8.0;
        const clawY = th * 0.18 - tuckY;

        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 8;

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

    // ─── FLUX PULSE EXPANDING DESTROYER WAVE ───
    function drawFluxPulseWave(game) {
      ctx.save();
      const waveCol = game === 'dynamo' ? '#c084fc' : game === 'helix' ? '#22d3ee' : '#f97316';
      ctx.strokeStyle = waveCol;
      ctx.lineWidth = 8;
      ctx.shadowColor = waveCol;
      ctx.shadowBlur = 32;

      ctx.beginPath();
      ctx.arc(0, 0, state.pulseWaveRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, state.pulseWaveRadius * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // ─── SKELETAL RIG PIVOTS OVERLAY ───
    function drawEnhancedSkeletalRig(tw, th, p) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -th * 0.28);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, th * 0.24);
      ctx.moveTo(-tw * 0.16, -th * 0.12);
      ctx.lineTo(0, -th * 0.08);
      ctx.lineTo(tw * 0.16, -th * 0.12);
      ctx.stroke();

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

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, targetW * 0.32, targetH * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ─── MASTER ANIMATION FRAME LOOP ───
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

      // Camera Matrix: Center on Catch Point Core with Smooth Zoom
      ctx.translate(960, 540);
      ctx.scale(state.camZoom, state.camZoom);
      ctx.translate(-state.player.x, -state.player.y);

      // 1. Starfield Background & Celestial Elements
      drawRealmStarfield(state.realm);

      // 2. Tier V Scale Reference Ghost (if enabled)
      if (state.showT5Ghost && !state.silhouetteMode) {
        drawTier5ReferenceGhost(state.realm, state.player.x, state.player.y);
      }

      // 3. Master Rigged Living Character
      drawRiggedCharacter(state.realm, state.tier, state.player.x, state.player.y);

      // 4. Collision Catch Reticle & 28px Radius (Rock-Steady!)
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

    // Boot Studio
    updateTitles();
    requestAnimationFrame(renderLoop);
  </script>
</body>
</html>
"""

with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Successfully generated {output_html} ({len(html_code)} bytes)")
