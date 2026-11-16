/* ============================================================================
   CHROME SYNAPSE: QUANTUM ARCADE ARENA (Reflex, Math Overdrive & Memory Matrix)
   Engineered for Sir Orlando V. Pasion, Jr. — Mathematics Educator & EdTech Innovator
   ============================================================================ */

(function() {
  'use strict';

  // --- Web Audio Procedural Sound Engine ---
  let audioCtx = null;
  let isMuted = false;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.12) {
    if (isMuted) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  function playSuccessChord() {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 0.25, 0.14), idx * 55);
    });
  }

  function playFailTone() {
    if (isMuted) return;
    playTone(130, 'sawtooth', 0.35, 0.18);
  }

  function playCollectBeep() {
    if (isMuted) return;
    playTone(880, 'triangle', 0.1, 0.12);
  }

  function playLevelUpFanfare() {
    if (isMuted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.2, 0.15), idx * 70);
    });
  }

  // --- Game State ---
  const state = {
    mode: 'math', // 'math' | 'reflex' | 'memory'
    active: false,
    score: 0,
    combo: 1,
    streak: 0,
    bestScores: {
      math: parseInt(localStorage.getItem('oc_game_best_math') || '0', 10),
      reflex: parseInt(localStorage.getItem('oc_game_best_reflex') || '0', 10),
      memory: parseInt(localStorage.getItem('oc_game_best_memory') || '0', 10)
    },
    // Math mode
    mathCurrentAnswer: null,
    mathTimer: null,
    mathTimeLeft: 100, // percentage
    mathLevel: 1,
    // Reflex mode
    playerX: 0.5, // 0 to 1
    playerY: 0.85,
    lives: 3,
    objects: [],
    spawnTimer: 0,
    // Memory mode
    memorySequence: [],
    playerSequence: [],
    memoryAcceptingInput: false,
    memoryPads: [
      { id: 0, name: 'DepEd', color: '#ef4444', freq: 261.63 },
      { id: 1, name: 'NASH', color: '#f59e0b', freq: 293.66 },
      { id: 2, name: 'Wispr', color: '#38bdf8', freq: 329.63 },
      { id: 3, name: 'Math', color: '#10b981', freq: 392.00 },
      { id: 4, name: 'Hero', color: '#a855f7', freq: 440.00 },
      { id: 5, name: 'Vault', color: '#ec4899', freq: 523.25 }
    ]
  };

  // --- DOM Elements Cache ---
  let els = {};

  function initDOMElements() {
    els = {
      modal: document.getElementById('chromeGameModal'),
      btnTopbarLaunch: document.getElementById('btnTopbarGameLaunch'),
      btnSystemLaunch: document.getElementById('btnSystemGame'),
      btnMute: document.getElementById('btnGameMute'),
      btnClose: document.getElementById('btnGameClose'),
      btnStart: document.getElementById('btnGameStart'),
      score: document.getElementById('gScoreDisplay'),
      combo: document.getElementById('gComboDisplay'),
      best: document.getElementById('gBestDisplay'),
      modeBtns: document.querySelectorAll('.g-mode-btn'),
      canvas: document.getElementById('synapseCanvas'),
      mathHud: document.getElementById('mathHudOverlay'),
      mathBar: document.getElementById('mathTimerBar'),
      mathEquation: document.getElementById('mathEquationText'),
      mathGrid: document.getElementById('mathOptionsGrid'),
      memoryHud: document.getElementById('memoryHudOverlay'),
      memoryIndicator: document.getElementById('memoryRoundIndicator'),
      memoryPadsContainer: document.getElementById('memoryGridPads'),
      screenOverlay: document.getElementById('gameScreenOverlay'),
      screenIcon: document.getElementById('screenIcon'),
      screenTitle: document.getElementById('screenTitle'),
      screenDesc: document.getElementById('screenDesc'),
      screenHint: document.getElementById('screenHint')
    };
  }

  // --- Canvas Renderer & Background FX ---
  let ctx = null;
  let animFrameId = null;
  let particles = [];

  function initCanvas() {
    if (!els.canvas) return;
    ctx = els.canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!els.canvas) return;
    const rect = els.canvas.parentElement.getBoundingClientRect();
    els.canvas.width = rect.width * (window.devicePixelRatio || 1);
    els.canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  function spawnParticles(x, y, color = '#38bdf8', count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: color,
        life: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  function renderLoop() {
    if (!els.canvas || !ctx) return;
    const w = els.canvas.width / (window.devicePixelRatio || 1);
    const h = els.canvas.height / (window.devicePixelRatio || 1);

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, w, h);

    // Draw Cybernetic Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1;
    const time = Date.now() * 0.001;
    const gridOffset = (time * 30) % 40;

    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = gridOffset; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Render Reflex Mode Objects if active
    if (state.active && state.mode === 'reflex') {
      renderReflexMode(w, h);
    }

    // Update and draw particle sparks
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (state.active || els.modal.style.display === 'flex') {
      animFrameId = requestAnimationFrame(renderLoop);
    }
  }

  // --- Reflex Mode Game Logic ---
  function renderReflexMode(w, h) {
    // 1. Draw Player Quantum Runner
    const px = state.playerX * w;
    const py = state.playerY * h;

    // Glowing Runner Core
    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.fill();

    // Inner Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wings / Pulse
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px - 22, py + 12);
    ctx.lineTo(px, py - 18);
    ctx.lineTo(px + 22, py + 12);
    ctx.stroke();
    ctx.restore();

    // 2. Spawn and Update Falling Orbs & Anomalies
    state.spawnTimer++;
    if (state.spawnTimer % 28 === 0) {
      const isBad = Math.random() < 0.38;
      state.objects.push({
        x: Math.random() * (w - 60) + 30,
        y: -20,
        speed: Math.random() * 2.5 + 3.2 + (state.score / 2000),
        type: isBad ? 'anomaly' : (Math.random() < 0.25 ? 'gold' : 'data'),
        radius: isBad ? 16 : 12,
        val: isBad ? 0 : (Math.random() < 0.25 ? 250 : 100)
      });
    }

    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];
      obj.y += obj.speed;

      // Draw object
      ctx.save();
      if (obj.type === 'anomaly') {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();

        // Cross glitch
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obj.x - 7, obj.y - 7);
        ctx.lineTo(obj.x + 7, obj.y + 7);
        ctx.moveTo(obj.x + 7, obj.y - 7);
        ctx.lineTo(obj.x - 7, obj.y + 7);
        ctx.stroke();
      } else if (obj.type === 'gold') {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', obj.x, obj.y);
      } else {
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Collision detection with player
      const dist = Math.hypot(px - obj.x, py - obj.y);
      if (dist < 14 + obj.radius) {
        if (obj.type === 'anomaly') {
          playFailTone();
          spawnParticles(obj.x, obj.y, '#ef4444', 25);
          state.lives--;
          state.combo = 1;
          updateStatsUI();

          if (state.lives <= 0) {
            triggerGameOver('CRITICAL MEMORY OVERFLOW!', 'You dodged valiantly, but the anomalies overloaded your taskbar shuttle.');
            return;
          }
        } else {
          playCollectBeep();
          spawnParticles(obj.x, obj.y, obj.type === 'gold' ? '#f59e0b' : '#10b981', 16);
          state.score += obj.val * state.combo;
          state.streak++;
          if (state.streak % 5 === 0) {
            state.combo = Math.min(8, state.combo + 1);
            playSuccessChord();
          }
          updateStatsUI();
        }
        state.objects.splice(i, 1);
        continue;
      }

      // Remove offscreen
      if (obj.y > h + 30) {
        state.objects.splice(i, 1);
      }
    }

    // Draw Lives on top left of canvas
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SHIELDS: ' + '❤️'.repeat(state.lives), 20, 30);
  }

  // --- Mode 1: Math Mind Overdrive (Procedural Mathematics Challenge) ---
  function generateMathProblem() {
    let eq = '';
    let ans = 0;
    const lvl = state.mathLevel;

    if (lvl <= 2) {
      // Basic Rapid Multiplication / Addition
      const a = Math.floor(Math.random() * 12) + 2;
      const b = Math.floor(Math.random() * 12) + 2;
      const isMult = Math.random() < 0.6;
      if (isMult) {
        eq = `${a} × ${b} = ?`;
        ans = a * b;
      } else {
        eq = `${a * 5} + ${b * 7} = ?`;
        ans = a * 5 + b * 7;
      }
    } else if (lvl <= 5) {
      // Linear algebra, order of operations, and square roots
      const r = Math.random();
      if (r < 0.35) {
        const rootBases = [11, 12, 13, 14, 15, 16, 20];
        const base = rootBases[Math.floor(Math.random() * rootBases.length)];
        eq = `√${base * base} = ?`;
        ans = base;
      } else if (r < 0.7) {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 9) + 4;
        const c = Math.floor(Math.random() * 20) + 10;
        eq = `${a} × ${b} - ${c} = ?`;
        ans = a * b - c;
      } else {
        const x = Math.floor(Math.random() * 15) + 3;
        const m = Math.floor(Math.random() * 5) + 2;
        const k = Math.floor(Math.random() * 10) + 1;
        eq = `Solve for x: ${m}x + ${k} = ${m * x + k}`;
        ans = x;
      }
    } else {
      // High-School Math Master / Powers
      const r = Math.random();
      if (r < 0.5) {
        const base = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
        const exp = base === 2 ? Math.floor(Math.random() * 5) + 3 : (base === 3 ? 3 : 2); // 2^3..7, 3^3, 4^2
        const add = Math.floor(Math.random() * 25) + 5;
        eq = `${base}ⁿ + ${add} (where n=${exp}) = ?`;
        ans = Math.pow(base, exp) + add;
      } else {
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 15) + 10;
        eq = `(${a} + ${b}) × 2 = ?`;
        ans = (a + b) * 2;
      }
    }

    state.mathCurrentAnswer = ans;

    // Generate 3 unique wrong answers close to correct answer
    const choices = new Set([ans]);
    while (choices.size < 4) {
      const offset = (Math.floor(Math.random() * 9) + 1) * (Math.random() < 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (wrong !== ans && wrong >= 0) choices.add(wrong);
    }

    const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);

    // Update UI
    els.mathEquation.textContent = eq;
    els.mathGrid.innerHTML = '';

    shuffled.forEach((val, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'math-opt-card';
      btn.setAttribute('data-ans', val);
      btn.innerHTML = `
        <span class="math-opt-key">${idx + 1}</span>
        <span class="math-opt-val">${val}</span>
      `;
      btn.onclick = () => handleMathChoice(val, btn);
      els.mathGrid.appendChild(btn);
    });

    startMathTimer();
  }

  function startMathTimer() {
    if (state.mathTimer) clearInterval(state.mathTimer);
    state.mathTimeLeft = 100;
    const durationMs = Math.max(2600, 5000 - state.mathLevel * 220);
    const intervalMs = 50;
    const step = 100 / (durationMs / intervalMs);

    state.mathTimer = setInterval(() => {
      state.mathTimeLeft -= step;
      if (els.mathBar) {
        els.mathBar.style.width = Math.max(0, state.mathTimeLeft) + '%';
        if (state.mathTimeLeft < 30) {
          els.mathBar.style.background = '#ef4444';
        } else {
          els.mathBar.style.background = '#38bdf8';
        }
      }

      if (state.mathTimeLeft <= 0) {
        clearInterval(state.mathTimer);
        playFailTone();
        triggerGameOver('TIME HORIZON EXPIRED!', `The equation was not solved in time. Correct answer: ${state.mathCurrentAnswer}`);
      }
    }, intervalMs);
  }

  function handleMathChoice(choice, btnEl) {
    if (!state.active || state.mode !== 'math') return;
    clearInterval(state.mathTimer);

    if (choice === state.mathCurrentAnswer) {
      playSuccessChord();
      if (btnEl) btnEl.classList.add('correct-flash');
      state.score += 250 * state.combo;
      state.streak++;
      if (state.streak % 3 === 0) {
        state.combo = Math.min(8, state.combo + 1);
        state.mathLevel++;
      }
      updateStatsUI();

      const rect = btnEl ? btnEl.getBoundingClientRect() : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      spawnParticles(rect.x + 40, rect.y + 20, '#10b981', 30);

      setTimeout(() => {
        if (state.active) generateMathProblem();
      }, 450);
    } else {
      playFailTone();
      if (btnEl) btnEl.classList.add('wrong-flash');
      triggerGameOver('MATHEMATICAL ANOMALY!', `Incorrect answer: ${choice}. The correct solution was ${state.mathCurrentAnswer}.`);
    }
  }

  // --- Mode 3: Memory Matrix (Simon-Says Recall) ---
  function initMemoryPads() {
    if (!els.memoryPadsContainer) return;
    els.memoryPadsContainer.innerHTML = '';
    state.memoryPads.forEach(pad => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memory-pad-btn';
      btn.setAttribute('data-id', pad.id);
      btn.style.setProperty('--pad-color', pad.color);
      btn.innerHTML = `
        <span class="m-pad-icon" style="color:${pad.color}">◉</span>
        <span class="m-pad-name">${pad.name}</span>
      `;
      btn.onclick = () => handleMemoryPadClick(pad.id);
      els.memoryPadsContainer.appendChild(btn);
    });
  }

  function startMemoryRound() {
    state.playerSequence = [];
    state.memoryAcceptingInput = false;
    const nextId = Math.floor(Math.random() * state.memoryPads.length);
    state.memorySequence.push(nextId);

    if (els.memoryIndicator) {
      els.memoryIndicator.textContent = `ROUND ${state.memorySequence.length} · WATCH SEQUENCE`;
      els.memoryIndicator.style.color = '#38bdf8';
    }

    // Playback sequence
    let delay = 600;
    state.memorySequence.forEach((padId, idx) => {
      setTimeout(() => {
        flashMemoryPad(padId);
      }, delay);
      delay += 550;
    });

    setTimeout(() => {
      state.memoryAcceptingInput = true;
      if (els.memoryIndicator) {
        els.memoryIndicator.textContent = `YOUR TURN · REPEAT SEQUENCE`;
        els.memoryIndicator.style.color = '#10b981';
      }
    }, delay + 100);
  }

  function flashMemoryPad(id) {
    const pad = state.memoryPads[id];
    if (!pad) return;
    playTone(pad.freq, 'sine', 0.25, 0.18);
    const btn = els.memoryPadsContainer.querySelector(`[data-id="${id}"]`);
    if (btn) {
      btn.classList.add('pad-active-flash');
      setTimeout(() => btn.classList.remove('pad-active-flash'), 350);
    }
  }

  function handleMemoryPadClick(id) {
    if (!state.active || state.mode !== 'memory' || !state.memoryAcceptingInput) return;
    flashMemoryPad(id);
    state.playerSequence.push(id);

    const step = state.playerSequence.length - 1;
    if (state.playerSequence[step] !== state.memorySequence[step]) {
      playFailTone();
      triggerGameOver('SEQUENCE DESYNCHRONIZED!', `Memory matrix failed on step ${step + 1}. Highest round achieved: ${state.memorySequence.length}.`);
      return;
    }

    if (state.playerSequence.length === state.memorySequence.length) {
      state.memoryAcceptingInput = false;
      playLevelUpFanfare();
      state.score += 500 * state.memorySequence.length;
      state.combo++;
      updateStatsUI();

      if (els.memoryIndicator) {
        els.memoryIndicator.textContent = `PERFECT RECALL! +${500 * state.memorySequence.length} PTS`;
        els.memoryIndicator.style.color = '#f59e0b';
      }

      setTimeout(startMemoryRound, 1200);
    }
  }

  // --- Scoreboard & UI Helpers ---
  function updateStatsUI() {
    if (els.score) els.score.textContent = state.score.toLocaleString();
    if (els.combo) els.combo.textContent = state.combo + 'x';
    const best = Math.max(state.score, state.bestScores[state.mode] || 0);
    if (els.best) els.best.textContent = best.toLocaleString();
  }

  function triggerGameOver(title, desc) {
    state.active = false;
    clearInterval(state.mathTimer);

    // Update best score
    if (state.score > (state.bestScores[state.mode] || 0)) {
      state.bestScores[state.mode] = state.score;
      localStorage.setItem(`oc_game_best_${state.mode}`, state.score.toString());
      desc += `\n🎉 NEW PERSONAL BEST: ${state.score.toLocaleString()} points!`;
    }

    els.screenIcon.textContent = '🏆';
    els.screenTitle.textContent = title;
    els.screenDesc.textContent = desc;
    els.btnStart.textContent = 'PLAY AGAIN';
    els.screenOverlay.style.display = 'flex';

    if (els.mathHud) els.mathHud.style.display = 'none';
    if (els.memoryHud) els.memoryHud.style.display = 'none';
  }

  function startGame() {
    state.active = true;
    state.score = 0;
    state.combo = 1;
    state.streak = 0;
    state.lives = 3;
    state.objects = [];
    state.mathLevel = 1;
    state.memorySequence = [];
    state.playerSequence = [];

    updateStatsUI();
    els.screenOverlay.style.display = 'none';

    if (state.mode === 'math') {
      els.mathHud.style.display = 'flex';
      els.memoryHud.style.display = 'none';
      generateMathProblem();
    } else if (state.mode === 'memory') {
      els.mathHud.style.display = 'none';
      els.memoryHud.style.display = 'flex';
      initMemoryPads();
      startMemoryRound();
    } else {
      els.mathHud.style.display = 'none';
      els.memoryHud.style.display = 'none';
    }

    if (!animFrameId) {
      animFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function openGameModal(mode = 'math') {
    initDOMElements();
    if (!els.modal) return;
    setMode(mode);
    els.modal.style.display = 'flex';
    resizeCanvas();
    els.screenOverlay.style.display = 'flex';
    els.btnStart.textContent = 'ENGAGE SYNAPSE';
    els.screenTitle.textContent = 'READY TO ENGAGE?';
    els.screenDesc.textContent = `Selected: ${mode.toUpperCase()} MODE. Test your speed and cognitive mastery!`;
    updateStatsUI();
  }

  function closeGameModal() {
    state.active = false;
    clearInterval(state.mathTimer);
    if (els.modal) els.modal.style.display = 'none';
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function setMode(mode) {
    state.mode = mode;
    els.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    if (els.best) {
      els.best.textContent = (state.bestScores[mode] || 0).toLocaleString();
    }
  }

  // --- Keyboard & Mouse Controls ---
  function initControls() {
    window.addEventListener('keydown', (e) => {
      if (els.modal && els.modal.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeGameModal();
        } else if (state.active && state.mode === 'math') {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            const buttons = els.mathGrid.querySelectorAll('.math-opt-card');
            if (buttons[idx]) buttons[idx].click();
          }
        } else if (state.active && state.mode === 'reflex') {
          if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            state.playerX = Math.max(0.08, state.playerX - 0.08);
          } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            state.playerX = Math.min(0.92, state.playerX + 0.08);
          }
        }
      } else {
        // Global Alt+G shortcut launches game
        if (e.altKey && e.key.toLowerCase() === 'g') {
          e.preventDefault();
          openGameModal();
        }
      }
    });

    // Touch / Mouse dragging for Reflex runner
    const handleMove = (clientX) => {
      if (!state.active || state.mode !== 'reflex' || !els.canvas) return;
      const rect = els.canvas.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;
      state.playerX = Math.max(0.08, Math.min(0.92, relX));
    };

    window.addEventListener('mousemove', (e) => {
      if (els.modal && els.modal.style.display === 'flex') {
        handleMove(e.clientX);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (els.modal && els.modal.style.display === 'flex' && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });
  }

  // --- Event Bindings ---
  function initEvents() {
    initDOMElements();
    initCanvas();
    initControls();

    if (els.btnTopbarLaunch) {
      els.btnTopbarLaunch.onclick = () => openGameModal('math');
    }
    if (els.btnSystemLaunch) {
      els.btnSystemLaunch.onclick = () => openGameModal('math');
    }
    if (els.btnClose) {
      els.btnClose.onclick = closeGameModal;
    }
    if (els.btnStart) {
      els.btnStart.onclick = startGame;
    }
    if (els.btnMute) {
      els.btnMute.onclick = () => {
        isMuted = !isMuted;
        els.btnMute.textContent = isMuted ? '🔇' : '🔊';
      };
    }

    els.modeBtns.forEach(btn => {
      btn.onclick = () => {
        const mode = btn.getAttribute('data-mode');
        setMode(mode);
        if (state.active) startGame();
      };
    });
  }

  // Expose global controller
  window.chromeSynapseGame = {
    open: openGameModal,
    close: closeGameModal,
    setMode: setMode,
    start: startGame
  };
  window.openChromeGame = openGameModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }
})();
