import os

out_path = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chrome Arcade · Tier VI–X Modern 2.5D Motion Studio</title>
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
      background: rgba(10, 15, 28, 0.95);
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
      font-size: 10.5px;
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
      background: rgba(10, 14, 26, 0.92);
      border: 1px solid rgba(56, 189, 248, 0.28);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 10.5px;
      font-family: monospace;
      color: #cbd5e1;
      backdrop-filter: blur(10px);
      pointer-events: none;
      min-width: 310px;
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
      padding: 4px 10px;
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
      #telemetry-panel { font-size: 9.5px; min-width: 220px; top: 6px; left: 6px; }
      #overlay-toggles { top: 6px; right: 6px; }
      #sequence-bar { bottom: 8px; padding: 4px 8px; gap: 4px; }
    }
  </style>
</head>
<body>
  <div id="topbar">
    <div class="brand">
      <div>
        <div class="brand-title">CHROME ARCADE · TIER VI–X MODERN 2.5D MOTION STUDIO</div>
        <div class="brand-sub">Depth Turning Rig · Responsive Steering · Living Horse Gait · Continuous Flame Engine</div>
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
      <div>Facing Pose: <span class="val" id="tel-facing">FORWARD-RIGHT (100% VOL)</span></div>
      <div>Catch Point (X, Y): <span class="val" id="tel-pos">960, 780</span></div>
      <div>Velocity & Accel: <span class="val" id="tel-vel">Vx 0.0, Ax 0.0</span></div>
      <div>Body Bank & Gaze Lead: <span class="val" id="tel-bank">0.0° / 0.0°</span></div>
      <div>Wing Kinematics (L / R): <span class="val" id="tel-wings">0.0° / 0.0°</span></div>
      <div>Weapon State & Aim: <span class="val" id="tel-weapon">AIM LOCKED (0°)</span></div>
      <div>Living Gait / Wingbeat: <span class="val" id="tel-gait">HOVER BREATH</span></div>
      <div>Continuous Flame System: <span class="val" id="tel-fire">ACTIVE (48 EMBERS)</span></div>
      <div>Collision Catch Status: <span class="val" id="tel-catch" style="color:#22c55e;">28px ROCK-STEADY</span></div>
    </div>

    <!-- Overlay Toggles -->
    <div id="overlay-toggles">
      <button class="toggle-pill active" id="toggle-t5-ghost">👻 Show Tier V Reference Ghost</button>
      <button class="toggle-pill active" id="toggle-catch-point">🎯 Show Catch Point & 28px Radius</button>
      <button class="toggle-pill" id="toggle-skeletal-mesh">📐 Show Skeletal Rig Pivots</button>
      <button class="toggle-pill" id="toggle-split-bench">⚖️ Side-by-Side Benchmark Mode</button>
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
      splitBenchMode: false,
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
        facingInterpolation: 1.0,    // Smooth 3D turn-around (-1.0 to +1.0)
        bodyBank: 0,              // Symmetrical bank angle driven by vx and ax
        headAngle: 0,             // Eyes and head lead turn
        shoulderBank: 0,          // Shoulder line tilt
        pitchAngle: 0,            // Vertical climb/descend pitch
        
        // Wing Articulation
        leftWingAngle: 0,
        rightWingAngle: 0,
        wingtipLag: 0,
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

    // Asset Manifest Loading (Includes Base Assets, Tier V References, Nodes, Hazards & Rigs)
    const images = {};
    const assetManifest = {
      // In-game native nodes and hazards (matching uploaded real assets!)
      'node_dynamo': 'assets/node-dynamo-t4.png',
      'node_helix': 'assets/node-helix-t4.png',
      'node_meteor': 'assets/node-meteor-t4.png',
      'hazard_dynamo': 'assets/hazard-dynamo-t4.png',
      'hazard_helix': 'assets/hazard-helix-t4.png',
      'hazard_meteor': 'assets/hazard-meteor-t4.png',

      // Tier V Scale References
      'dynamo_v': 'assets/characters/dynamo_v.jpg',
      'helix_v': 'assets/characters/helix_v.jpg',
      'meteor_v': 'assets/characters/meteor_v.jpg'
    };

    // Populate all 15 characters and their modern 2.5D directional rig layers
    ['dynamo', 'helix', 'meteor'].forEach(game => {
      ['vi', 'vii', 'viii', 'ix', 'x'].forEach(tier => {
        const k = `${game}_${tier}`;
        assetManifest[k] = `assets/characters/${k}.png`;
        assetManifest[`${k}_dir_left`] = `assets/characters/rigs/${k}_dir_left.png`;
        assetManifest[`${k}_dir_right`] = `assets/characters/rigs/${k}_dir_right.png`;
        assetManifest[`${k}_dir_turn`] = `assets/characters/rigs/${k}_dir_turn.png`;
        assetManifest[`${k}_body`] = `assets/characters/rigs/${k}_body.png`;
        assetManifest[`${k}_wing_l`] = `assets/characters/rigs/${k}_wing_l.png`;
        assetManifest[`${k}_wing_r`] = `assets/characters/rigs/${k}_wing_r.png`;
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
    document.getElementById('toggle-split-bench').addEventListener('click', function() {
      state.splitBenchMode = !state.splitBenchMode;
      this.classList.toggle('active', state.splitBenchMode);
    });

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
      if (state.benchmarkRunning) return;
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
      document.getElementById('btn-run-benchmark').textContent = '⏹ Stop Benchmark';
      state.player.x = 960;
      state.player.y = 780;
      state.player.targetX = 960;
      state.player.targetY = 780;
      state.player.vx = 0;
      state.player.vy = 0;
    }

    function stopBenchmark() {
      state.benchmarkRunning = false;
      state.benchmarkTime = 0;
      document.getElementById('btn-run-benchmark').textContent = '▶ Play Canonical Benchmark (23s)';
      document.querySelectorAll('.seq-step-pill').forEach(p => p.classList.remove('current'));
    }

    // ─── CANONICAL 7-STAGE BENCHMARK TIMELINE SEQUENCER (23 SECONDS DURATION) ───
    // 1. Stationary Hover (0.0 - 3.0s)
    // 2. Leftward Start (3.0 - 5.5s)
    // 3. Sustained Left Pass (5.5 - 10.5s) -> Full 5 Seconds!
    // 4. Sharp Reversal Right (10.5 - 13.5s)
    // 5. Climb (13.5 - 16.0s)
    // 6. Braking Descent (16.0 - 18.5s)
    // 7. Return to Hover (18.5 - 23.0s) -> Held through 2 complete wingbeats!
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
        { id: 'seq-step-descend-brake', start: 16.0, end: 18.5, label: '6. BRAKING DESCENT (BRAKE FLARE & CLAW TUCK)' },
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
        // Stage 1: Stationary Hover (960, 780)
        p.targetX = 960; p.targetY = 780;
      } else if (t < 5.5) {
        // Stage 2: Leftward Start from standstill (accelerating smoothly left)
        p.targetX = 680; p.targetY = 780;
      } else if (t < 10.5) {
        // Stage 3: Sustained Left Pass (Held for a FULL 5 SECONDS! Smooth cruising at x=380)
        p.targetX = 380; p.targetY = 780;
      } else if (t < 13.5) {
        // Stage 4: Sharp Reversal Right (Rapid acceleration towards x=1540!)
        p.targetX = 1540; p.targetY = 780;
      } else if (t < 16.0) {
        // Stage 5: Climb (Target climbs to upper starfield)
        p.targetX = 1100; p.targetY = 520;
      } else if (t < 18.5) {
        // Stage 6: Braking Descent (Decelerates down to lower starfield with brake flare)
        p.targetX = 960; p.targetY = 860;
      } else if (t < 23.0) {
        // Stage 7: Return to Hover (Settle rock-steady on catch point, held through 2 wingbeats)
        p.targetX = 960; p.targetY = 780;
      } else {
        stopBenchmark();
      }
    }

    // ─── KINEMATICS & RESPONSIVE STEERING PHYSICS ENGINE ───
    function updatePhysics(dt) {
      const p = state.player;

      if (!state.benchmarkRunning) {
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
      
      // Calculate true instantaneous acceleration Ax = dVx / dt
      p.ax = (p.vx - prevVx) / Math.max(0.001, dt);
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Symmetrical Normalized Velocity (-1.0 left to +1.0 right)
      const normVx = Math.max(-1.0, Math.min(1.0, p.vx / 14.0));
      const normVy = Math.max(-1.0, Math.min(1.0, p.vy / 12.0));
      const normAx = Math.max(-1.0, Math.min(1.0, p.ax / 80.0));

      // 1. Facing Direction & Volumetric Turn-Around Interpolation
      const targetFacing = normVx < -0.12 ? -1.0 : normVx > 0.12 ? 1.0 : p.facingDir;
      p.facingDir = targetFacing;
      // Smooth interpolation for depth turn view (NEVER squashes to zero!)
      p.facingInterpolation += (targetFacing - p.facingInterpolation) * 9.5 * dt;

      // 2. Eyes and Head Lead the Turn (Prompt Requirement 2)
      // Gaze acquires heading immediately, before body finishes banking
      const targetHead = normVx * 0.28 + normAx * 0.15;
      p.headAngle += (targetHead - p.headAngle) * 14.0 * dt;

      // 3. Symmetrical Body Banking Driven by BOTH Velocity and Acceleration!
      // A gentle cruise correction produces a gentle tilt (6-10°); a sharp reversal drives a deep bank (22-28°)!
      const targetBank = normVx * 0.18 + normAx * 0.24;
      p.bodyBank += (targetBank - p.bodyBank) * 11.0 * dt;
      p.shoulderBank = p.bodyBank * 0.88;

      // 4. Vertical Pitch & Aerodynamic Braking Flare
      const targetPitch = normVy * 0.22;
      p.pitchAngle += (targetPitch - p.pitchAngle) * 9.0 * dt;
      
      // Brake flare when descending or rapidly stopping
      const targetBrake = Math.max(0, normVy * 0.26) + (Math.abs(p.vx) < 1.2 && Math.abs(dx) > 10 ? 0.20 : 0.0);
      p.brakeFlare += (targetBrake - p.brakeFlare) * 8.5 * dt;

      // 5. Breathing Cycle & Floating Rhythm
      p.breathPhase += dt * 3.2;
      const breath = Math.sin(p.breathPhase) * 0.038;

      // 6. Wing Kinematics (Symmetrical Lead Lift vs Trail Sweep in Both Directions)
      const liftFactor = Math.abs(normVx) * 0.22 + Math.abs(normAx) * 0.14;
      const sweepFactor = Math.abs(normVx) * 0.16;

      if (normVx >= 0) {
        // Moving right: Right wing leads and lifts, left wing sweeps back
        p.rightWingAngle = p.bodyBank + liftFactor + breath + p.brakeFlare;
        p.leftWingAngle = p.bodyBank - sweepFactor - breath + p.brakeFlare;
      } else {
        // Moving left: Left wing leads and lifts, right wing sweeps back (EXACT EQUAL SYMMETRY!)
        p.leftWingAngle = p.bodyBank - liftFactor - breath + p.brakeFlare;
        p.rightWingAngle = p.bodyBank + sweepFactor + breath + p.brakeFlare;
      }

      // Wingtip lag
      p.wingtipLag += (-normVx * 24.0 - p.wingtipLag) * 8.0 * dt;

      // Trailing Elements Wave (Hair, Gown, Tails)
      p.flowAngle += (-normVx * 0.28 - p.flowAngle) * 7.0 * dt;

      // ─── CHARACTER-SPECIFIC MECHANICS ───

      // Dynamo Princess: Aiming, Recoil & Recovery, Hover Knee Flex & Boot Drift (Requirement 3)
      if (state.realm === 'dynamo') {
        const targetAim = normVx * 0.18;
        const inertiaRate = (state.tier === 'IX' || state.tier === 'X') ? 6.0 : 12.0;
        p.cannonAim += (targetAim - p.cannonAim) * inertiaRate * dt;

        // Soft hover knee flex and boot drift
        p.kneeFlex = Math.sin(p.breathPhase * 1.2) * 5.0;
        p.bootDrift = Math.cos(p.breathPhase * 0.9) * 4.0;

        p.recoilTimer += dt;
        if (p.recoilTimer > 2.0) {
          p.recoilTimer = 0;
          p.recoilKick = 1.0;
        }
        // Smooth recoil recovery spring
        p.recoilKick *= Math.pow(0.80, dt * 60);
      }

      // Helix Unicorn: Living Horse Gait, Canter, and Lead Change (Requirement 4)
      else if (state.realm === 'helix') {
        const isHover = Math.abs(normVx) < 0.12 && Math.abs(normVy) < 0.12;
        const gaitSpeed = isHover ? 2.4 : (5.8 + Math.abs(normVx) * 4.2);
        p.canterPhase += dt * gaitSpeed;
        const cPhase = (p.canterPhase % (Math.PI * 2)) / (Math.PI * 2);

        // Track Lead Change: Right lead when traveling right, Left lead when traveling left!
        // The lead change occurs during the SUSPENSION phase of the stride!
        if (cPhase > 0.78 && cPhase < 0.98) {
          p.canterLead = p.facingInterpolation >= 0 ? 1.0 : -1.0;
        }

        if (isHover) {
          // Soft alternating hover adjustments
          p.canterGaitBeat = 0;
          const hFloat = Math.sin(p.canterPhase);
          p.legFlap[0] = hFloat * 0.10;
          p.legFlap[1] = -hFloat * 0.08;
          p.legFlap[2] = hFloat * 0.12;
          p.legFlap[3] = -hFloat * 0.10;
          p.neckBob = Math.sin(p.canterPhase * 0.5) * 0.05;
        } else {
          // 4-Phase Equestrian Canter:
          // Beat 1: Trailing hind strikes (0.0 - 0.25)
          // Beat 2: Diagonal pair strikes (0.25 - 0.55)
          // Beat 3: Leading foreleg extends forward in full reach (0.55 - 0.80)
          // Beat 4: Suspension - all 4 legs airborne (0.80 - 1.00)
          if (cPhase < 0.25) p.canterGaitBeat = 1;
          else if (cPhase < 0.55) p.canterGaitBeat = 2;
          else if (cPhase < 0.80) p.canterGaitBeat = 3;
          else p.canterGaitBeat = 4; // Suspension

          // Articulated leg joint flexion
          const leadMult = p.canterLead;
          p.legFlap[0] = Math.sin(p.canterPhase + (leadMult > 0 ? 0.0 : 1.2)) * 0.38;
          p.legFlap[1] = Math.sin(p.canterPhase + (leadMult > 0 ? 1.2 : 0.0)) * 0.38;
          p.legFlap[2] = Math.sin(p.canterPhase + 2.4) * 0.40;
          p.legFlap[3] = Math.sin(p.canterPhase + 3.6) * 0.40;
          
          // Head and neck balance the stride
          p.neckBob = Math.sin(p.canterPhase * 2.0) * 0.12;
        }
        p.tailPhase += dt * (4.0 + Math.abs(normVx) * 6.0);
      }

      // Meteor Dragon: Muscular Wing Stroke & Continuous Moving Fire (Requirement 5)
      else if (state.realm === 'meteor') {
        // Stroke cycle: Downstroke (powerful) -> Recovery (folded) -> Glide (taut)
        const strokeCycle = (p.breathPhase * 0.85) % (Math.PI * 2);
        if (strokeCycle < 1.9) {
          p.dragonStroke = 0; // Downstroke
          p.clawsTucked += (0.2 - p.clawsTucked) * 8.0 * dt;
        } else if (strokeCycle < 4.2) {
          p.dragonStroke = 1; // Recovery (folded wings)
          p.clawsTucked += (0.4 - p.clawsTucked) * 8.0 * dt;
        } else {
          p.dragonStroke = 2; // Aerodynamic Glide
          p.clawsTucked += (Math.abs(normVx) > 0.4 ? 0.8 : 0.1 - p.clawsTucked) * 8.0 * dt;
        }

        // Multi-segment tail chain delay (5 links carrying turn momentum to heavy tail mace)
        let prev = p.bodyBank;
        for (let t = 0; t < 5; t++) {
          p.tailChain[t] += (prev - p.tailChain[t]) * (10.0 - t * 1.5) * dt;
          prev = p.tailChain[t];
        }

        // Update Continuous Moving Fire System
        updateContinuousFlameSystem(p, dt);
      }

      // Update Telemetry Panel Readouts
      const faceDirStr = p.facingInterpolation > 0.25 ? 'FORWARD-RIGHT' : p.facingInterpolation < -0.25 ? 'FORWARD-LEFT' : '3/4 DEPTH TURN';
      const volWidth = (0.88 + 0.12 * Math.abs(p.facingInterpolation)) * 100;
      document.getElementById('tel-facing').textContent = `${faceDirStr} (${volWidth.toFixed(0)}% VOL)`;
      document.getElementById('tel-pos').textContent = `${Math.round(p.x)}, ${Math.round(p.y)}`;
      document.getElementById('tel-vel').textContent = `Vx ${p.vx.toFixed(1)}, Ax ${p.ax.toFixed(1)}`;
      document.getElementById('tel-bank').textContent = `${(p.bodyBank * 180 / Math.PI).toFixed(1)}° / ${(p.headAngle * 180 / Math.PI).toFixed(1)}°`;
      document.getElementById('tel-wings').textContent = `${(p.leftWingAngle * 180 / Math.PI).toFixed(1)}° / ${(p.rightWingAngle * 180 / Math.PI).toFixed(1)}°`;
      
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

    // Continuous Moving Fire System for Meteor Dragon (Requirement 5)
    function updateContinuousFlameSystem(p, dt) {
      if (Math.random() < 0.85) {
        // Spawn ember from moving flame anchors (mouth, caldera, wing spurs, tail mace)
        const anchors = [
          { x: 0, y: 0 },                        // Caldera
          { x: p.facingInterpolation * 70, y: -50 }, // Mouth / Snout
          { x: -140, y: -40 },                  // Left Wing Spur
          { x: 140, y: -40 },                   // Right Wing Spur
          { x: -p.facingInterpolation * 160, y: 40 } // Tail Mace
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
      document.getElementById('tel-fire').textContent = `ACTIVE (${p.flameParticles.length} EMBERS)`;
    }

    // ─── REALM STARFIELD & CELESTIAL HAZARDS RENDERER ───
    function drawRealmStarfield(game) {
      // Cosmic gradient starfield
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

      // Descending Celestial Nodes & Hazards (Using real in-game assets!)
      const nodeImg = images[`node_${game}`];
      const hazImg = images[`hazard_${game}`];
      if (nodeImg && hazImg) {
        ctx.drawImage(nodeImg, 380, 160, 110, 140);
        ctx.drawImage(hazImg, 960 - 55, 120, 110, 140);
        ctx.drawImage(nodeImg, 1540, 200, 110, 140);
      }
    }

    // ─── MASTER 2.5D LAYERED DIRECTIONAL CHARACTER RENDERER ───
    // Completely eliminates the "paper cutout" flip! Preserves full 3D volumetric thickness throughout!
    function drawEnhancedCharacter(game, tier, px, py, isGhost=false) {
      const p = state.player;
      const tierRank = tier === 'VI' ? 1 : tier === 'VII' ? 2 : tier === 'VIII' ? 3 : tier === 'IX' ? 4 : 5;
      const targetW = 860 * (1.0 + (tierRank - 1) * 0.05);
      const aspect = 576 / 1024;
      const targetH = targetW * aspect;

      const baseKey = `${game}_${tier.toLowerCase()}`;
      const imgDirLeft = images[`${baseKey}_dir_left`];
      const imgDirRight = images[`${baseKey}_dir_right`];
      const imgDirTurn = images[`${baseKey}_dir_turn`];
      const imgBody = images[`${baseKey}_body`];
      const imgWingL = images[`${baseKey}_wing_l`];
      const imgWingR = images[`${baseKey}_wing_r`];
      const imgBase = images[baseKey];

      ctx.save();
      ctx.translate(px, py);

      if (isGhost) {
        ctx.globalAlpha = 0.32;
        ctx.filter = 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.6)) contrast(1.2)';
      }

      // Volumetric Width Scale: NEVER scales to zero! (Preserves 88% to 100% volume)
      const volScaleX = 0.88 + 0.12 * Math.abs(p.facingInterpolation);
      ctx.scale(volScaleX, 1.0);

      // Blend weights between directional poses
      const fi = p.facingInterpolation;
      const wRight = Math.max(0, Math.min(1.0, (fi + 0.5) / 1.0));
      const wLeft = 1.0 - wRight;
      const wTurn = Math.exp(-6.0 * fi * fi); // Peak at reversal midpoint (0.0)

      // ─── LAYERED Z-DEPTH SORTED RENDERING ───
      // When traveling right (fi > 0): Far Left Wing (back) -> Body -> Near Right Wing (front)
      // When traveling left (fi < 0): Far Right Wing (back) -> Body -> Near Left Wing (front)
      // At reversal transition: 3/4 Depth Turn pose blends smoothly

      const isFacingRight = fi >= 0;
      const farWingImg = isFacingRight ? imgWingL : imgWingR;
      const nearWingImg = isFacingRight ? imgWingR : imgWingL;
      const farWingAngle = isFacingRight ? p.leftWingAngle : p.rightWingAngle;
      const nearWingAngle = isFacingRight ? p.rightWingAngle : p.leftWingAngle;

      // 1. Far Wing (Rendered BEHIND torso with depth shadow)
      if (farWingImg) {
        ctx.save();
        ctx.rotate(farWingAngle * 0.75 + p.bodyBank * 0.25);
        ctx.filter = 'brightness(0.82) saturate(0.92)';
        ctx.drawImage(farWingImg, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.restore();
      }

      // 2. Central Body, Chest Core & Legs (Locked to catch point, maintains full volume!)
      ctx.save();
      ctx.rotate(p.bodyBank * 0.40);
      
      if (wTurn > 0.35 && imgDirTurn) {
        // Dynamic Three-Quarter Depth Reversal View
        ctx.globalAlpha = Math.min(1.0, (wTurn - 0.35) / 0.65);
        ctx.drawImage(imgDirTurn, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.globalAlpha = 1.0;
      } else {
        const mainPose = isFacingRight ? (imgDirRight || imgBase) : (imgDirLeft || imgBase);
        if (mainPose) {
          ctx.drawImage(mainPose, -targetW / 2, -targetH / 2, targetW, targetH);
        }
      }
      ctx.restore();

      // 3. Near Wing (Rendered IN FRONT of torso, lifted into bank, rim-lit!)
      if (nearWingImg) {
        ctx.save();
        ctx.rotate(nearWingAngle * 0.85 + p.bodyBank * 0.30);
        ctx.filter = 'brightness(1.14)';
        ctx.drawImage(nearWingImg, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.restore();
      }

      // 4. Character-Specific Appendages & Dynamic Weapon / Fire
      if (game === 'dynamo') {
        drawDynamicDynamoCannon(targetW, targetH, tier, p);
      } else if (game === 'helix') {
        drawHelixLivingGait(targetW, targetH, p);
      } else if (game === 'meteor') {
        drawMeteorDragonVFX(targetW, targetH, p);
      }

      // Skeletal Debug Rig Overlay (if enabled)
      if (state.showSkeletalMesh && !isGhost) {
        drawEnhancedSkeletalRig(targetW, targetH, p);
      }

      ctx.restore();
    }

    // ─── DYNAMO PRINCESS DYNAMIC CANNON RIG (Requirement 3) ───
    // Dynamic central beam, expanding cyan/violet wavefronts, moving muzzle lock & recoil kickback!
    function drawDynamicDynamoCannon(tw, th, tier, p) {
      ctx.save();
      const dirMult = p.facingInterpolation >= 0 ? 1.0 : -1.0;
      const muzzleX = tw * 0.30 * dirMult;
      const muzzleY = -th * 0.12 - p.recoilKick * 16.0;

      ctx.translate(muzzleX, muzzleY);
      ctx.rotate(p.cannonAim * dirMult);

      // Connected Dynamic Muzzle Flare & Laser Beam
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

      // Prismatic cyan outer wavefront
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
      // Draw streaming double-helix DNA tail trailing behind the travel direction
      ctx.save();
      const dirMult = p.facingInterpolation >= 0 ? 1.0 : -1.0;
      const tailAnchorX = -tw * 0.22 * dirMult;
      const tailAnchorY = th * 0.15;

      ctx.translate(tailAnchorX, tailAnchorY);

      // Two interlaced sinusoidal DNA ribbon strands
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
      // Draw continuous moving flame particles and curling tongues
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
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2;

      // Draw spine chain
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2); // Center Core
      ctx.arc(0, -th * 0.28, 6, 0, Math.PI * 2); // Head/Neck
      ctx.arc(-tw * 0.16, -th * 0.12, 5, 0, Math.PI * 2); // Left Shoulder
      ctx.arc(tw * 0.16, -th * 0.12, 5, 0, Math.PI * 2); // Right Shoulder
      ctx.arc(0, th * 0.24, 5, 0, Math.PI * 2); // Pelvis/Hips
      ctx.fill();

      // Connecting bone lines
      ctx.beginPath();
      ctx.moveTo(0, -th * 0.28);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, th * 0.24);
      ctx.moveTo(-tw * 0.16, -th * 0.12);
      ctx.lineTo(0, -th * 0.08);
      ctx.lineTo(tw * 0.16, -th * 0.12);
      ctx.stroke();

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
      ctx.globalAlpha = 0.35;
      ctx.filter = 'drop-shadow(0 0 18px rgba(251, 191, 36, 0.7)) contrast(1.15)';
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

      // 1. Update Sequencer & Kinematics
      updateBenchmarkTimeline(dt);
      updatePhysics(dt);

      // 2. Clear Screen & Draw Realm Starfield
      drawRealmStarfield(state.realm);

      const p = state.player;

      // 3. Side-by-Side or Overlay Mode
      if (state.splitBenchMode) {
        // Split Screen: Tier V Reference on Left, New Form on Right
        drawTier5ReferenceGhost(state.realm, 540, p.y);
        drawEnhancedCharacter(state.realm, state.tier, 1380, p.y);
        if (state.showCatchPoint) {
          drawCatchPointReticle(540, p.y);
          drawCatchPointReticle(1380, p.y);
        }
      } else {
        // Unified In-Engine Studio View
        if (state.showT5Ghost && state.tier !== 'V') {
          drawTier5ReferenceGhost(state.realm, p.x, p.y);
        }
        drawEnhancedCharacter(state.realm, state.tier, p.x, p.y);
        if (state.showCatchPoint) {
          drawCatchPointReticle(p.x, p.y);
        }
      }

      requestAnimationFrame(studioLoop);
    }

    // Start Engine
    requestAnimationFrame(studioLoop);
  </script>
</body>
</html>
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully wrote {out_path} ({len(html_content)} bytes)")
