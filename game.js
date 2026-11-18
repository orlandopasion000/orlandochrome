/**
 * Chrome Synapse: Quantum Arcade Arena (v2.0)
 * ─────────────────────────────────────────────────────────────
 * Designed for Sir Orlando V. Pasion, Jr. — Teacher VI, Mathematics Educator, EdTech Innovator
 * 
 * Games:
 * 1. 🧮 Math Overdrive: Professional Eight-Level Difficulty System (20 Qs/level, 10 Mistakes Max)
 * 2. ⚡ Reflex Blitz: Quantum Realm, Helix & Meteor Catcher with Tier 3 Extra Big Particles (10 Lives)
 * 3. 🧠 Memory Matrix: 16-Box (4x4) Fullscreen Neural Array with Harmonic Synthesizer (1 Mistake Game Over)
 */

(function () {
  'use strict';

  // --- Procedural Web Audio API Synthesizer ---
  class CyberAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playCorrectChime(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 523.25; // C5
      const mult = Math.min(2.0, 1 + (combo - 1) * 0.12);
      this.playTone(baseFreq * mult, 'sine', 0.16, 0.18);
      setTimeout(() => this.playTone(baseFreq * mult * 1.25, 'sine', 0.22, 0.18), 70);
      setTimeout(() => this.playTone(baseFreq * mult * 1.5, 'sine', 0.30, 0.22), 140);
    }

    playMistakeBuzzer() {
      if (this.isMuted) return;
      this.init();
      this.playTone(130.81, 'sawtooth', 0.25, 0.22); // C3
      setTimeout(() => this.playTone(110.00, 'sawtooth', 0.35, 0.25), 100); // A2
    }

    playMorphChime() {
      if (this.isMuted) return;
      this.init();
      // Sci-fi arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.20, 0.16), i * 50);
      });
    }

    playMatrixTone(boxIndex) {
      if (this.isMuted) return;
      this.init();
      // 16 distinct harmonic frequencies across two octaves (C4 to D6)
      const pitches = [
        261.63, 293.66, 329.63, 349.23,
        392.00, 440.00, 493.88, 523.25,
        587.33, 659.25, 698.46, 783.99,
        880.00, 987.77, 1046.50, 1174.66
      ];
      const freq = pitches[boxIndex % pitches.length];
      this.playTone(freq, 'sine', 0.35, 0.25);
    }

    playVictoryFanfare() {
      if (this.isMuted) return;
      this.init();
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.45, 0.20), idx * 80);
      });
    }

    // Recommendation 5: Mode-Specific Multi-Harmonic Audio & Micro-Haptics
    playDynamoCapture(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const freq = 480 * Math.min(2.2, 1 + (combo - 1) * 0.08);
      this.playTone(freq, 'sawtooth', 0.10, 0.22);
      setTimeout(() => this.playTone(freq * 1.5, 'sine', 0.16, 0.20), 35);
      try { if (navigator.vibrate) navigator.vibrate(8); } catch(e){}
    }

    playHelixCapture(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const pitch = pentatonic[(combo - 1) % pentatonic.length];
      this.playTone(pitch, 'sine', 0.16, 0.24);
      setTimeout(() => this.playTone(pitch * 1.25, 'triangle', 0.20, 0.18), 45);
      try { if (navigator.vibrate) navigator.vibrate([10, 15, 10]); } catch(e){}
    }

    playMeteorCapture(combo = 1) {
      if (this.isMuted) return;
      this.init();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startPitch = 88 + Math.min(40, (combo - 1) * 4);
        osc.frequency.setValueAtTime(startPitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(36, this.ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } catch(e) {
        this.playTone(65, 'triangle', 0.25, 0.30);
      }
      try { if (navigator.vibrate) navigator.vibrate(28); } catch(e){}
    }

    playOverdriveFanfare() {
      if (this.isMuted) return;
      this.init();
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.35, 0.25), idx * 55);
      });
      try { if (navigator.vibrate) navigator.vibrate([30, 40, 30, 40, 60]); } catch(e){}
    }

    // Perfect-Center Precision & Chain Audio
    playPerfectCatch(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 783.99; // G5
      const mult = Math.min(2.4, 1 + (combo - 1) * 0.10);
      this.playTone(baseFreq * mult, 'sine', 0.22, 0.25);
      setTimeout(() => this.playTone(baseFreq * mult * 1.5, 'sine', 0.28, 0.28), 50);
      try { if (navigator.vibrate) navigator.vibrate([12, 12, 18]); } catch(e){}
    }

    playGrazeCatch(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 440.00;
      this.playTone(baseFreq, 'sine', 0.10, 0.16);
      try { if (navigator.vibrate) navigator.vibrate(6); } catch(e){}
    }

    playHazardExplosion() {
      if (this.isMuted) return;
      this.init();
      this.playTone(110.00, 'sawtooth', 0.40, 0.35);
      setTimeout(() => this.playTone(73.42, 'sawtooth', 0.45, 0.40), 60);
      try { if (navigator.vibrate) navigator.vibrate([50, 40, 60]); } catch(e){}
    }

    playPulseCharged() {
      if (this.isMuted) return;
      this.init();
      const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.25, 0.22), idx * 45);
      });
      try { if (navigator.vibrate) navigator.vibrate([15, 20, 25]); } catch(e){}
    }

    playFluxPulseUnleashed() {
      if (this.isMuted) return;
      this.init();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.65);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.65);
      } catch(e) {
        this.playTone(120, 'triangle', 0.4, 0.5);
      }
      try { if (navigator.vibrate) navigator.vibrate([40, 30, 40, 30, 80]); } catch(e){}
    }

    playPhaseSwitch() {
      if (this.isMuted) return;
      this.init();
      this.playTone(659.25, 'sine', 0.12, 0.15);
      setTimeout(() => this.playTone(880.00, 'sine', 0.16, 0.15), 40);
      try { if (navigator.vibrate) navigator.vibrate(8); } catch(e){}
    }
  }

  const audio = new CyberAudioEngine();

  // --- Eight-Level Mathematics Engine ---
  const MathEngine = {
    // Generate exactly 20 questions for the selected level
    generateLevelSet(levelNum) {
      const questions = [];
      const usedSignatures = new Set();

      // Operation distributions per level
      let dist;
      switch (levelNum) {
        case 1: dist = { add: 8, sub: 6, mul: 4, div: 2 }; break;
        case 2: dist = { add: 6, sub: 6, mul: 4, div: 4 }; break;
        case 3: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 4: dist = { add: 6, sub: 6, mul: 4, div: 4 }; break;
        case 5: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 6: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 7: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 8:
        default: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
      }

      const opList = [
        ...Array(dist.add).fill('+'),
        ...Array(dist.sub).fill('−'),
        ...Array(dist.mul).fill('×'),
        ...Array(dist.div).fill('÷')
      ];

      // Shuffle operations
      for (let i = opList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opList[i], opList[j]] = [opList[j], opList[i]];
      }

      for (let i = 0; i < opList.length; i++) {
        const op = opList[i];
        let q = null;
        let attempts = 0;

        while (!q && attempts < 100) {
          attempts++;
          const candidate = this.createQuestion(levelNum, op, i);
          const sig = `${candidate.a}|${op}|${candidate.b}`;
          const commSig = (op === '+' || op === '×') ? `${candidate.b}|${op}|${candidate.a}` : sig;

          if (!usedSignatures.has(sig) && !usedSignatures.has(commSig)) {
            usedSignatures.add(sig);
            usedSignatures.add(commSig);
            q = candidate;
          }
        }

        if (!q) {
          // Fallback if space is tight
          q = this.createQuestion(levelNum, op, i, true);
        }
        questions.push(q);
      }

      return questions;
    },

    createQuestion(level, op, qIdx, allowFallback = false) {
      let a = 1, b = 1, ans = 0;

      // Random integer in range [min, max] inclusive
      const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randNonZero = (min, max) => {
        let v = 0;
        while (v === 0) v = randInt(min, max);
        return v;
      };

      if (level === 1) {
        // Level 1: Positive one-digit integers (1 to 9). Sub nonnegative, div whole number
        if (op === '+') {
          a = randInt(1, 9);
          b = randInt(1, 9);
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9);
          b = randInt(1, a); // guarantees a >= b
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9);
          b = randInt(1, 9);
          ans = a * b;
        } else if (op === '÷') {
          b = randInt(1, 9);
          ans = randInt(1, 9);
          a = b * ans;
          if (a > 9 && !allowFallback) {
            // keep 1-digit dividend if possible, or small quotient
            b = randInt(1, 4);
            ans = randInt(1, 2);
            a = b * ans;
          }
        }
      } else if (level === 2) {
        // Level 2: Exactly one negative operand (abs 1 to 9)
        const signA = Math.random() < 0.5 ? -1 : 1;
        const signB = -signA; // exactly one negative

        if (op === '+') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quotMag = randInt(1, 9);
          const divMag = randInt(1, 9);
          b = divMag * signB;
          ans = quotMag * (signA * signB);
          a = b * ans;
          // adjust signs so exactly one of a or b is negative
          if ((a < 0 && b < 0) || (a > 0 && b > 0)) {
            a = -a;
            ans = Math.round(a / b);
          }
        }
      } else if (level === 3) {
        // Level 3: Mixed signs (abs 1 to 9). At least 40% two negative operands
        const requireTwoNeg = (qIdx < 8) || (Math.random() < 0.45);
        let signA, signB;
        if (requireTwoNeg) {
          signA = -1;
          signB = -1;
        } else {
          signA = Math.random() < 0.5 ? 1 : -1;
          signB = Math.random() < 0.5 ? 1 : -1;
        }

        if (op === '+') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const divMag = randInt(1, 9);
          const quotMag = randInt(1, 9);
          b = divMag * signB;
          ans = quotMag * (signA * signB);
          a = b * ans;
          if (signA === -1 && a > 0) a = -a;
          if (signA === 1 && a < 0) a = -a;
          ans = Math.round(a / b);
        }
      } else if (level === 4) {
        // Level 4: Positive two-digit integers (10-99) & positive one-digit (1-5)
        if (op === '+') {
          a = randInt(10, 99);
          b = randInt(1, 5);
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99);
          b = randInt(1, 5);
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19);
          b = randInt(2, 5);
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 19);
          b = randInt(2, 5);
          a = b * quot;
          ans = quot;
        }
      } else if (level === 5) {
        // Level 5: Signed two-digit (abs 10-99) & small one-digit (abs 1-5)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;

        if (op === '+') {
          a = randInt(10, 99) * signA;
          b = randInt(1, 5) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99) * signA;
          b = randInt(1, 5) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19) * signA;
          b = randInt(1, 5) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 19) * signA;
          b = randInt(2, 5) * signB;
          a = b * quot;
          ans = quot;
        }
      } else if (level === 6) {
        // Level 6: Signed two-digit (abs 10-99) & larger one-digit (abs 6-9)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;

        if (op === '+') {
          a = randInt(10, 99) * signA;
          b = randInt(6, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99) * signA;
          b = randInt(6, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19) * signA;
          b = randInt(6, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          b = randInt(6, 9) * signB;
          const maxQuot = Math.floor(99 / Math.abs(b));
          const quotMag = randInt(10, Math.max(10, maxQuot));
          ans = quotMag * (signA * signB);
          a = b * ans;
        }
      } else if (level === 7) {
        // Level 7: Advanced signed integers (abs 10 to 50)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;
        if (op === '+') {
          a = randInt(10, 50) * signA;
          b = randInt(10, 50) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 50) * signA;
          b = randInt(10, 50) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 25) * signA;
          b = randInt(2, 8) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 25) * signA;
          b = randInt(2, 6) * signB;
          a = b * quot;
          ans = quot;
        }
      } else {
        // Level 8: Master fluency across full 10-99 signed range
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;
        if (op === '+') {
          a = randInt(15, 99) * signA;
          b = randInt(15, 99) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(15, 99) * signA;
          b = randInt(15, 99) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(12, 35) * signA;
          b = randInt(3, 12) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(12, 30) * signA;
          b = randInt(3, 9) * signB;
          a = b * quot;
          ans = quot;
        }
      }

      // Format operand with parentheses if negative
      const fmt = (n) => (n < 0 ? `(${n})` : `${n}`);
      const expr = `${fmt(a)} ${op} ${fmt(b)}`;

      // Generate 3 plausible distractors
      const options = [ans];
      const deltas = [-10, 10, -1, 1, -2, 2, -ans, ans * -1];

      // Shuffle deltas
      deltas.sort(() => Math.random() - 0.5);

      for (const d of deltas) {
        if (options.length >= 4) break;
        const cand = (d === -ans || d === ans * -1) ? -ans : ans + d;
        if (!options.includes(cand)) {
          options.push(cand);
        }
      }

      while (options.length < 4) {
        const offset = (Math.random() < 0.5 ? -1 : 1) * randInt(1, 15);
        const cand = ans + offset;
        if (!options.includes(cand)) {
          options.push(cand);
        }
      }

      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      return {
        expr,
        a,
        b,
        op,
        ans,
        options,
        choices: options
      };
    }
  };

  
  // ══════════════════════════════════════════════════════════════
  // PROCEDURAL 3D ASTEROID, VOLUMETRIC SMOKE & PLASMA VFX ENGINE
  // (Pre-rendered zero-allocation sprite caches for 60-120 FPS)
  // ══════════════════════════════════════════════════════════════
  var MeteorVFXEngine = (function() {
    var ASTEROID_COUNT = 6;
    var asteroidSprites = [];
    var smokeSprite = null;
    var plasmaSprite = null;
    var emberSprite = null;
    var electricSparkSprite = null;
    var helixCyanSparkSprite = null;
    var helixMagentaSparkSprite = null;
    var flameWispSprite = null;
    var flamePuffSprite = null;
    var cursorAsteroidSprite = null;
    var initialized = false;

    function init() {
      if (initialized) return;
      try {
        for (var i = 0; i < ASTEROID_COUNT; i++) {
          asteroidSprites.push(generateAsteroidCanvas(i, 96, false));
        }
        cursorAsteroidSprite = generateAsteroidCanvas(0, 144, true);
        smokeSprite = generateSmokeCanvas(64);
        plasmaSprite = generatePlasmaCanvas(64);
        emberSprite = generateEmberCanvas(24);
        electricSparkSprite = generateElectricSparkCanvas(24);
        helixCyanSparkSprite = generateHelixSparkCanvas(24, false);
        helixMagentaSparkSprite = generateHelixSparkCanvas(24, true);
        flameWispSprite = generateFlameWispCanvas(64, 96);
        flamePuffSprite = generateFlamePuffCanvas(64);
        initialized = true;
      } catch (e) {
        console.error("MeteorVFXEngine initialization error:", e);
      }
    }

    function generateAsteroidCanvas(type, size, isCursor) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var baseR = size * (isCursor ? 0.36 : 0.34);

      // 1. Perfect Round Spherical Volcanic Asteroid
      var SAMPLES = 36;
      var dTheta = (Math.PI * 2) / SAMPLES;
      var rPts = [];
      for (var s = 0; s < SAMPLES; s++) {
        rPts.push(baseR);
      }

      // 2. Basalt Mineral Body with 3D Spherical Light Vector (-0.45, -0.55)
      ctx.save();
      ctx.beginPath();
      for (var s = 0; s < SAMPLES; s++) {
        var th = s * dTheta;
        var x = cx + Math.cos(th) * rPts[s];
        var y = cy + Math.sin(th) * rPts[s];
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.clip();

      // 3D Directional Lighting Gradient (Deep Basalt Regolith)
      var lightX = cx - baseR * 0.45;
      var lightY = cy - baseR * 0.55;
      var bodyGrad = ctx.createRadialGradient(lightX, lightY, baseR * 0.12, cx, cy, baseR * 1.30);
      bodyGrad.addColorStop(0.0, "#5c4537"); // Sunlit mineral ridge
      bodyGrad.addColorStop(0.30, "#3d2b20"); // Deep basalt mantle
      bodyGrad.addColorStop(0.62, "#21140e"); // Deep regolith
      bodyGrad.addColorStop(0.88, "#110906"); // Shadowed regolith
      bodyGrad.addColorStop(1.0, "#050302"); // Deep space shadow
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Chiseled Crystalline Facets (Subtle geometric planar depth)
      var facets = [
        [[-0.45, -0.55], [0.10, -0.65], [0.18, -0.25], [-0.22, -0.18]],
        [[0.18, -0.25], [0.65, -0.35], [0.55, 0.12], [0.08, -0.08]],
        [[-0.52, -0.18], [-0.08, -0.08], [-0.18, 0.42], [-0.58, 0.22]],
        [[-0.08, -0.08], [0.48, 0.12], [0.28, 0.58], [-0.08, 0.48]]
      ];
      for (var fc = 0; fc < facets.length; fc++) {
        var fct = facets[fc];
        ctx.beginPath();
        for (var p = 0; p < fct.length; p++) {
          var px = cx + fct[p][0] * baseR;
          var py = cy + fct[p][1] * baseR;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = fc % 2 === 0 ? "rgba(120, 95, 78, 0.30)" : "rgba(35, 20, 14, 0.42)";
        ctx.fill();
        ctx.strokeStyle = "rgba(140, 110, 90, 0.22)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Vesicular 3D Impact Craters with Sunlit Rims and Molten Magma Wells
      var numCraters = isCursor ? 6 : 4;
      for (var c = 0; c < numCraters; c++) {
        var cAng = (c * 1.85 + type * 1.1) % (Math.PI * 2);
        var cDist = baseR * (0.22 + (c * 0.14) % 0.52);
        var crX = cx + Math.cos(cAng) * cDist;
        var crY = cy + Math.sin(cAng) * cDist;
        var crR = baseR * (0.13 + (c * 0.05) % 0.16);

        ctx.beginPath();
        ctx.arc(crX, crY, crR, 0, Math.PI * 2);
        ctx.fillStyle = "#070302"; // Crater hollow
        ctx.fill();

        ctx.beginPath();
        ctx.arc(crX - 0.8, crY - 1.0, crR, Math.PI * 0.7, Math.PI * 1.9);
        ctx.strokeStyle = "rgba(160, 130, 110, 0.65)"; // Sunlit rim highlight
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(crX + 0.8, crY + 1.0, crR, Math.PI * 1.9, Math.PI * 0.7);
        ctx.strokeStyle = "rgba(8, 4, 2, 0.85)"; // Shadowed inner rim
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Molten bubbling magma pool in crater floor
        ctx.beginPath();
        ctx.arc(crX, crY, crR * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(234, 88, 12, 0.72)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(crX, crY, crR * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = "#fef08a";
        ctx.fill();
      }

      // 3. Multi-Branching Curved Molten Magma Fissures (Planck Blackbody Radiation)
      var fissureDefs = [
        [[-0.58, -0.32], [-0.35, -0.22], [-0.15, -0.08], [0.08, 0.05], [0.32, 0.14], [0.58, 0.35]],
        [[0.28, -0.48], [0.18, -0.22], [0.08, 0.05], [-0.12, 0.24], [-0.32, 0.48]],
        [[-0.15, -0.08], [-0.30, 0.08], [-0.52, 0.12]]
      ];

      for (var f = 0; f < fissureDefs.length; f++) {
        var pts = fissureDefs[f];
        // Layer A: Wide crimson thermal heat aura bleeding into adjacent rock
        ctx.beginPath();
        ctx.moveTo(cx + pts[0][0] * baseR, cy + pts[0][1] * baseR);
        for (var j = 1; j < pts.length; j++) {
          var mx = (pts[j - 1][0] + pts[j][0]) * 0.5 * baseR + cx;
          var my = (pts[j - 1][1] + pts[j][1]) * 0.5 * baseR + cy;
          ctx.quadraticCurveTo(cx + pts[j - 1][0] * baseR, cy + pts[j - 1][1] * baseR, mx, my);
        }
        ctx.lineTo(cx + pts[pts.length - 1][0] * baseR, cy + pts[pts.length - 1][1] * baseR);
        ctx.strokeStyle = "rgba(220, 38, 38, 0.65)";
        ctx.lineWidth = 4.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Layer B: Middle radiant magma mantle
        ctx.beginPath();
        ctx.moveTo(cx + pts[0][0] * baseR, cy + pts[0][1] * baseR);
        for (var j = 1; j < pts.length; j++) {
          var mx = (pts[j - 1][0] + pts[j][0]) * 0.5 * baseR + cx;
          var my = (pts[j - 1][1] + pts[j][1]) * 0.5 * baseR + cy;
          ctx.quadraticCurveTo(cx + pts[j - 1][0] * baseR, cy + pts[j - 1][1] * baseR, mx, my);
        }
        ctx.lineTo(cx + pts[pts.length - 1][0] * baseR, cy + pts[pts.length - 1][1] * baseR);
        ctx.strokeStyle = "rgba(249, 115, 22, 0.92)";
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Layer C: Core blackbody incandescent vein (5000K white-gold)
        ctx.beginPath();
        ctx.moveTo(cx + pts[0][0] * baseR, cy + pts[0][1] * baseR);
        for (var j = 1; j < pts.length; j++) {
          var mx = (pts[j - 1][0] + pts[j][0]) * 0.5 * baseR + cx;
          var my = (pts[j - 1][1] + pts[j][1]) * 0.5 * baseR + cy;
          ctx.quadraticCurveTo(cx + pts[j - 1][0] * baseR, cy + pts[j - 1][1] * baseR, mx, my);
        }
        ctx.lineTo(cx + pts[pts.length - 1][0] * baseR, cy + pts[pts.length - 1][1] * baseR);
        ctx.strokeStyle = "rgba(255, 255, 245, 0.98)";
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Molten Caldera Hotspots at fissure convergence
      var calderas = [[0.08, 0.05], [-0.15, -0.08]];
      for (var k = 0; k < calderas.length; k++) {
        var kx = cx + calderas[k][0] * baseR;
        var ky = cy + calderas[k][1] * baseR;
        ctx.beginPath();
        ctx.arc(kx, ky, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.70)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(kx, ky, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(254, 240, 138, 0.95)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(kx, ky, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      ctx.restore();

      // 4. Asteroid Perimeter Incandescent Ablation Rim
      ctx.beginPath();
      for (var s = 0; s < SAMPLES; s++) {
        var th = s * dTheta;
        var x = cx + Math.cos(th) * rPts[s];
        var y = cy + Math.sin(th) * rPts[s];
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(251, 191, 36, 0.95)";
      ctx.lineWidth = isCursor ? 1.8 : 1.4;
      ctx.stroke();

      return canvas;
    }

    function generateSmokeCanvas(size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.46;

      // Organic multi-lobe soft volumetric puff
      var lobes = [
        { x: cx, y: cy, r: r * 0.95, a: 0.38 },
        { x: cx - r * 0.18, y: cy + r * 0.15, r: r * 0.75, a: 0.28 },
        { x: cx + r * 0.20, y: cy - r * 0.12, r: r * 0.70, a: 0.26 }
      ];

      for (var l = 0; l < lobes.length; l++) {
        var lb = lobes[l];
        var g = ctx.createRadialGradient(lb.x, lb.y, lb.r * 0.15, lb.x, lb.y, lb.r);
        g.addColorStop(0.0, "rgba(38, 30, 26, " + lb.a + ")");
        g.addColorStop(0.45, "rgba(30, 24, 21, " + (lb.a * 0.65).toFixed(2) + ")");
        g.addColorStop(0.80, "rgba(22, 18, 16, " + (lb.a * 0.22).toFixed(2) + ")");
        g.addColorStop(1.0, "rgba(16, 12, 10, 0.0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(lb.x, lb.y, lb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas;
    }

    function generatePlasmaCanvas(size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.48;

      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      g.addColorStop(0.22, "rgba(254, 240, 138, 0.92)");
      g.addColorStop(0.50, "rgba(249, 115, 22, 0.60)");
      g.addColorStop(0.80, "rgba(194, 65, 12, 0.20)");
      g.addColorStop(1.0, "rgba(124, 45, 18, 0.0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // Bi-Chromatic Bioluminescent Nucleotide Spark Sprite for Quantum Helix Tail Wake (High-Fidelity 8-Point Diamond Starlight)
    function generateHelixSparkCanvas(size, isMagenta) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.46;

      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      if (isMagenta) {
        g.addColorStop(0.20, "rgba(250, 232, 255, 0.98)");
        g.addColorStop(0.48, "rgba(217, 70, 239, 0.70)");
        g.addColorStop(0.78, "rgba(168, 85, 247, 0.30)");
        g.addColorStop(1.0, "rgba(126, 34, 206, 0.0)");
      } else {
        g.addColorStop(0.20, "rgba(207, 250, 254, 0.98)");
        g.addColorStop(0.48, "rgba(34, 211, 238, 0.70)");
        g.addColorStop(0.78, "rgba(56, 189, 248, 0.30)");
        g.addColorStop(1.0, "rgba(14, 116, 144, 0.0)");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 8-Point Diamond Optical Diffraction Spikes
      ctx.strokeStyle = isMagenta ? "rgba(253, 244, 255, 0.95)" : "rgba(240, 253, 250, 0.95)";
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      // Primary Cardinals
      ctx.moveTo(cx, cy - r * 0.92); ctx.lineTo(cx, cy + r * 0.92);
      ctx.moveTo(cx - r * 0.92, cy); ctx.lineTo(cx + r * 0.92, cy);
      // Secondary Diagonals
      var dR = r * 0.55;
      ctx.moveTo(cx - dR, cy - dR); ctx.lineTo(cx + dR, cy + dR);
      ctx.moveTo(cx - dR, cy + dR); ctx.lineTo(cx + dR, cy - dR);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // High-Voltage Electric Plasma Spark Sprite for Quantum Realm Tail Discharges (Hyper-Ionized Corona & Multi-Spikes)
    function generateElectricSparkCanvas(size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.46;

      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      g.addColorStop(0.18, "rgba(224, 242, 254, 0.98)");
      g.addColorStop(0.45, "rgba(56, 189, 248, 0.72)");
      g.addColorStop(0.75, "rgba(129, 140, 248, 0.32)");
      g.addColorStop(1.0, "rgba(99, 102, 241, 0.0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // High-Frequency 8-Point Starlight Electric Spikes
      ctx.strokeStyle = "rgba(240, 249, 255, 0.96)";
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.94); ctx.lineTo(cx, cy + r * 0.94);
      ctx.moveTo(cx - r * 0.94, cy); ctx.lineTo(cx + r * 0.94, cy);
      var dRe = r * 0.56;
      ctx.moveTo(cx - dRe, cy - dRe); ctx.lineTo(cx + dRe, cy + dRe);
      ctx.moveTo(cx - dRe, cy + dRe); ctx.lineTo(cx + dRe, cy - dRe);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.13, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // High-Intensity Incandescent Burning Ember Spark (Hyper-Realistic Thermal Corona & 8-Point Starlight Flares)
    function generateEmberCanvas(size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.46;

      // 1. Multi-Stage Radiating Thermal Corona (White-Hot -> Molten Gold -> Blazing Amber -> Burnt Crimson)
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      g.addColorStop(0.18, "rgba(254, 240, 138, 0.98)");
      g.addColorStop(0.46, "rgba(251, 146, 60, 0.65)");
      g.addColorStop(0.76, "rgba(220, 38, 38, 0.28)");
      g.addColorStop(1.0, "rgba(153, 27, 27, 0.0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 2. 8-Point Searing Solar Diffraction Spikes
      ctx.strokeStyle = "rgba(255, 255, 240, 0.94)";
      ctx.lineWidth = 0.90;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.90); ctx.lineTo(cx, cy + r * 0.90);
      ctx.moveTo(cx - r * 0.90, cy); ctx.lineTo(cx + r * 0.90, cy);
      var dRm = r * 0.52;
      ctx.moveTo(cx - dRm, cy - dRm); ctx.lineTo(cx + dRm, cy + dRm);
      ctx.moveTo(cx - dRm, cy + dRm); ctx.lineTo(cx + dRm, cy - dRm);
      ctx.stroke();

      // 3. Incandescent white-hot pinpoint nucleus
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // High-Fidelity Organic Curling Flame Wisp Tongue (Fluid Navier-Stokes Wisp)
    function generateFlameWispCanvas(width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = width * 0.5;
      var rootY = height * 0.90;
      var tipY = height * 0.08;
      var tipX = cx + width * 0.15; // Natural fluid curl to one side

      // Outer Crimson Flame Boundary
      ctx.beginPath();
      ctx.moveTo(cx - width * 0.35, rootY);
      ctx.bezierCurveTo(cx - width * 0.42, height * 0.55, cx - width * 0.18, height * 0.25, tipX, tipY);
      ctx.bezierCurveTo(cx + width * 0.10, height * 0.35, cx + width * 0.38, height * 0.60, cx + width * 0.35, rootY);
      ctx.closePath();
      var gradOuter = ctx.createLinearGradient(cx, rootY, tipX, tipY);
      gradOuter.addColorStop(0.0, "rgba(254, 240, 138, 0.98)");
      gradOuter.addColorStop(0.30, "rgba(251, 146, 60, 0.90)");
      gradOuter.addColorStop(0.65, "rgba(234, 88, 12, 0.65)");
      gradOuter.addColorStop(0.88, "rgba(185, 28, 28, 0.35)");
      gradOuter.addColorStop(1.0, "rgba(124, 45, 18, 0.0)");
      ctx.fillStyle = gradOuter;
      ctx.fill();

      // Inner Solar Plasma Core
      ctx.beginPath();
      ctx.moveTo(cx - width * 0.18, rootY);
      ctx.bezierCurveTo(cx - width * 0.20, height * 0.62, cx - width * 0.05, height * 0.38, tipX * 0.95, height * 0.24);
      ctx.bezierCurveTo(cx + width * 0.08, height * 0.42, cx + width * 0.20, height * 0.65, cx + width * 0.18, rootY);
      ctx.closePath();
      var gradInner = ctx.createLinearGradient(cx, rootY, tipX * 0.95, height * 0.24);
      gradInner.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
      gradInner.addColorStop(0.40, "rgba(254, 240, 138, 0.92)");
      gradInner.addColorStop(0.80, "rgba(251, 146, 60, 0.50)");
      gradInner.addColorStop(1.0, "rgba(249, 115, 22, 0.0)");
      ctx.fillStyle = gradInner;
      ctx.fill();

      return canvas;
    }

    // Soft Gaussian Volumetric Combustion Gas Puff (Zero Vector Outlines)
    function generateFlamePuffCanvas(size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      var cx = size * 0.5;
      var cy = size * 0.5;
      var r = size * 0.48;

      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, "rgba(255, 255, 250, 0.95)");
      g.addColorStop(0.18, "rgba(254, 240, 138, 0.88)");
      g.addColorStop(0.45, "rgba(251, 146, 60, 0.60)");
      g.addColorStop(0.72, "rgba(220, 38, 38, 0.28)");
      g.addColorStop(0.90, "rgba(185, 28, 28, 0.10)");
      g.addColorStop(1.0, "rgba(124, 45, 18, 0.0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    return {
      init: init,
      getAsteroid: function(i) {
        if (!initialized) init();
        return asteroidSprites[Math.abs(i | 0) % ASTEROID_COUNT];
      },
      getCursorAsteroid: function() {
        if (!initialized) init();
        return cursorAsteroidSprite;
      },
      getSmoke: function() {
        if (!initialized) init();
        return smokeSprite;
      },
      getPlasma: function() {
        if (!initialized) init();
        return plasmaSprite;
      },
      getEmber: function() {
        if (!initialized) init();
        return emberSprite;
      },
      getElectricSpark: function() {
        if (!initialized) init();
        return electricSparkSprite;
      },
      getHelixSpark: function(isMagenta) {
        if (!initialized) init();
        return isMagenta ? helixMagentaSparkSprite : helixCyanSparkSprite;
      },
      getFlameWisp: function() {
        if (!initialized) init();
        return flameWispSprite;
      },
      getFlamePuff: function() {
        if (!initialized) init();
        return flamePuffSprite;
      }
    };
  })();
  

  // ══════════════════════════════════════════════════════════════
  // MASTER HIGH-FIDELITY PARTICLE RENDERERS (DYNAMO, HELIX, METEOR)
  // (Conforming to 4K HUD Scientific Telemetry Blueprints)
  // ══════════════════════════════════════════════════════════════
  
  // ─────────────────────────────────────────────────────────────
  // INDEPENDENT LAYERED ANIMATION & ARTICULATED KINEMATICS ENGINE (v340)
  // - Separated Clean Transparent Layers (Zero Frozen Duplicates!)
  // - Root-to-Tip Articulated Wing Physics with Reversal Momentum Whip & Settle
  // - Dynamo: 3D Tilted Atomic Rings (Passing Behind & In Front of Nucleus),
  //           Branching Internal Plasma Arcs, Inward Capture Discharge, Glitch Hazard
  // - Helix: Rotating 3D DNA Double Helix + Traveling Rung Light Pulse Inside
  //          Stationary Glass Highlight Shell, Center-to-Tip Capture Wing Ripple,
  //          Shifting 3D Crystal Facets Hazard
  // - Meteor: Weighty Tumbling Basalt Plates & Breathing Magma Fissures with
  //           Downward-Edge Pinned Cyan Bow Shock, Shield Recoil & Upward Cinders,
  //           Counter-Rotating & Spinning Hazard Blades Around Dark Emerald Center
  // - World-Space Detached Speed Streaks (Node Visibly Drops Past Fading Streaks!)
  // ─────────────────────────────────────────────────────────────
  const LayeredT4Assets = {
    halo: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRight: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingLeftCanvas: { dynamo: null, helix: null, meteor: null },
    coreBase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    nodeShell: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    hazard: {
      dynamoCore: new Image(),
      dynamoGlitch: new Image(),
      helixClean: new Image(),
      meteorBlades: new Image(),
      meteorCenter: new Image()
    },
    loaded: {
      halo: { dynamo: false, helix: false, meteor: false },
      wingRight: { dynamo: false, helix: false, meteor: false },
      coreBase: { dynamo: false, helix: false, meteor: false },
      nodeShell: { dynamo: false, helix: false, meteor: false },
      hazard: {
        dynamoCore: false,
        dynamoGlitch: false,
        helixClean: false,
        meteorBlades: false,
        meteorCenter: false
      }
    }
  };

  function buildMirroredWingCanvas(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 652;
    c.height = img.naturalHeight || 468;
    const g = c.getContext('2d');
    if (g) {
      g.translate(c.width, 0);
      g.scale(-1, 1);
      g.drawImage(img, 0, 0);
    }
    return c;
  }

  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    LayeredT4Assets.halo[m].onload = () => { LayeredT4Assets.loaded.halo[m] = true; };
    LayeredT4Assets.halo[m].src = `assets/layer-${m}-halo.png?v=arcade340`;

    LayeredT4Assets.wingRight[m].onload = () => {
      LayeredT4Assets.loaded.wingRight[m] = true;
      LayeredT4Assets.wingLeftCanvas[m] = buildMirroredWingCanvas(LayeredT4Assets.wingRight[m]);
    };
    LayeredT4Assets.wingRight[m].src = `assets/layer-${m}-wing-right.png?v=arcade340`;
  });

  LayeredT4Assets.coreBase.dynamo.onload = () => { LayeredT4Assets.loaded.coreBase.dynamo = true; };
  LayeredT4Assets.coreBase.dynamo.src = 'assets/layer-dynamo-nucleus.png?v=arcade340';

  LayeredT4Assets.coreBase.helix.onload = () => { LayeredT4Assets.loaded.coreBase.helix = true; };
  LayeredT4Assets.coreBase.helix.src = 'assets/layer-helix-shell.png?v=arcade340';

  LayeredT4Assets.coreBase.meteor.onload = () => { LayeredT4Assets.loaded.coreBase.meteor = true; };
  LayeredT4Assets.coreBase.meteor.src = 'assets/layer-meteor-caldera.png?v=arcade340';

  LayeredT4Assets.nodeShell.dynamo.onload = () => { LayeredT4Assets.loaded.nodeShell.dynamo = true; };
  LayeredT4Assets.nodeShell.dynamo.src = 'assets/layer-node-dynamo-shell.png?v=arcade340';

  LayeredT4Assets.nodeShell.helix.onload = () => { LayeredT4Assets.loaded.nodeShell.helix = true; };
  LayeredT4Assets.nodeShell.helix.src = 'assets/layer-node-helix-shell.png?v=arcade340';

  LayeredT4Assets.nodeShell.meteor.onload = () => { LayeredT4Assets.loaded.nodeShell.meteor = true; };
  LayeredT4Assets.nodeShell.meteor.src = 'assets/layer-node-meteor-rock.png?v=arcade340';

  LayeredT4Assets.hazard.dynamoCore.onload = () => { LayeredT4Assets.loaded.hazard.dynamoCore = true; };
  LayeredT4Assets.hazard.dynamoCore.src = 'assets/layer-hazard-dynamo-core.png?v=arcade340';

  LayeredT4Assets.hazard.dynamoGlitch.onload = () => { LayeredT4Assets.loaded.hazard.dynamoGlitch = true; };
  LayeredT4Assets.hazard.dynamoGlitch.src = 'assets/layer-hazard-dynamo-glitch.png?v=arcade340';

  LayeredT4Assets.hazard.helixClean.onload = () => { LayeredT4Assets.loaded.hazard.helixClean = true; };
  LayeredT4Assets.hazard.helixClean.src = 'assets/layer-hazard-helix-clean.png?v=arcade340';

  LayeredT4Assets.hazard.meteorBlades.onload = () => { LayeredT4Assets.loaded.hazard.meteorBlades = true; };
  LayeredT4Assets.hazard.meteorBlades.src = 'assets/layer-hazard-meteor-blades.png?v=arcade340';

  LayeredT4Assets.hazard.meteorCenter.onload = () => { LayeredT4Assets.loaded.hazard.meteorCenter = true; };
  LayeredT4Assets.hazard.meteorCenter.src = 'assets/layer-hazard-meteor-center.png?v=arcade340';

  // ─────────────────────────────────────────────────────────────
  // SECONDARY KINEMATICS & ARTICULATED WING SPRING-DAMPER ENGINE
  // ─────────────────────────────────────────────────────────────
  const CoreKinematics = {
    lastX: null,
    vx: 0,
    prevVx: 0,
    bodyBank: 0,
    bodyBankVel: 0,
    // 3-Stage Articulated Wing Chain: Root -> Mid -> Outer Feather Tips
    rootY: 0, rootVelY: 0,
    midY: 0,  midVelY: 0,
    tipY: 0,  tipVelY: 0,
    tipX: 0,  tipVelX: 0,
    // Mode-specific Capture Reactive States
    wingRipples: [],       // Helix: Center-to-tip traveling wing ripples
    dynamoDischarges: [],  // Dynamo: Inward high-voltage snap discharges from contact point
    meteorShieldRecoil: { y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 }, // Meteor: Shield recoil
    impactCinders: [],     // Meteor: Upward-thrown glowing cinders on deflection
    worldStreaks: [],      // World-space detached speed streaks around falling nodes

    reset() {
      this.lastX = null;
      this.vx = 0;
      this.prevVx = 0;
      this.bodyBank = 0;
      this.bodyBankVel = 0;
      this.rootY = 0; this.rootVelY = 0;
      this.midY = 0;  this.midVelY = 0;
      this.tipY = 0;  this.tipVelY = 0;
      this.tipX = 0;  this.tipVelX = 0;
      this.wingRipples = [];
      this.dynamoDischarges = [];
      this.meteorShieldRecoil = { y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 };
      this.impactCinders = [];
      this.worldStreaks = [];
    },

    update(catcherPixelX, dtScale, now) {
      const dt = Math.max(0.25, Math.min(2.5, dtScale));
      if (this.lastX === null) this.lastX = catcherPixelX;
      const rawVx = (catcherPixelX - this.lastX) / dt;
      this.lastX = catcherPixelX;

      // Smooth velocity slightly to avoid 1-frame pointer quantization jitter while preserving sharp reversals
      this.prevVx = this.vx;
      this.vx = this.vx * 0.45 + rawVx * 0.55;
      const accelX = this.vx - this.prevVx;

      // 1. Body Bank Angle: leans into movement immediately, settles smoothly when stopped
      const targetBank = Math.max(-0.17, Math.min(0.17, this.vx * 0.0052));
      this.bodyBankVel = (this.bodyBankVel + (targetBank - this.bodyBank) * 0.28 * dt) * Math.pow(0.70, dt);
      this.bodyBank += this.bodyBankVel * dt;

      // 2. Wing Root: follows body movement closely (stiff spring)
      const targetRootY = Math.max(-18, Math.min(18, this.vx * 0.42));
      this.rootVelY = (this.rootVelY + (targetRootY - this.rootY) * 0.30 * dt) * Math.pow(0.70, dt);
      this.rootY += this.rootVelY * dt;

      // 3. Wing Mid-Section: follows Wing Root a fraction of a second later
      const targetMidY = this.rootY * 1.35;
      this.midVelY = (this.midVelY + (targetMidY - this.midY) * 0.16 * dt) * Math.pow(0.76, dt);
      this.midY += this.midVelY * dt;

      // 4. Outer Feather Tips: follows Mid-Section last + carries reversal momentum whip!
      // When reversing direction (accelX large), the tips carry previous momentum before flexing back & settling
      const reversalImpulseY = -accelX * 0.48;
      const reversalImpulseX = -accelX * 0.55;
      this.tipVelY += reversalImpulseY;
      this.tipVelX += reversalImpulseX;

      const targetTipY = this.midY * 1.45;
      const targetTipX = Math.max(-28, Math.min(28, -this.vx * 0.55));
      this.tipVelY = (this.tipVelY + (targetTipY - this.tipY) * 0.085 * dt) * Math.pow(0.83, dt);
      this.tipY += this.tipVelY * dt;

      this.tipVelX = (this.tipVelX + (targetTipX - this.tipX) * 0.085 * dt) * Math.pow(0.82, dt);
      this.tipX += this.tipVelX * dt;

      // 5. Update Meteor Shield Recoil Spring
      const sr = this.meteorShieldRecoil;
      sr.vy = (sr.vy - sr.y * 0.24 * dt) * Math.pow(0.74, dt);
      sr.y += sr.vy * dt;
      sr.vTilt = (sr.vTilt - sr.tilt * 0.22 * dt) * Math.pow(0.75, dt);
      sr.tilt += sr.vTilt * dt;
      sr.flash = Math.max(0, sr.flash - 0.05 * dt);

      // 6. Update Meteor Upward Deflection Cinders
      for (let i = this.impactCinders.length - 1; i >= 0; i--) {
        const c = this.impactCinders[i];
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.vy += 0.20 * dt; // Gravity arc after initial upward throw
        c.vx *= Math.pow(0.98, dt);
        c.life += dt;
        if (c.life >= c.maxLife) {
          this.impactCinders.splice(i, 1);
        }
      }

      // 7. Update Helix Wing Ripples
      for (let i = this.wingRipples.length - 1; i >= 0; i--) {
        const rp = this.wingRipples[i];
        rp.progress = (now - rp.startTime) / rp.duration;
        if (rp.progress >= 1.15) {
          this.wingRipples.splice(i, 1);
        }
      }

      // 8. Update Dynamo Inward Snap Discharges
      for (let i = this.dynamoDischarges.length - 1; i >= 0; i--) {
        const d = this.dynamoDischarges[i];
        d.progress = (now - d.startTime) / d.duration;
        if (d.progress >= 1.0) {
          this.dynamoDischarges.splice(i, 1);
        }
      }
    },

    triggerCaptureEffect(mode, catcherX, catcherY, nodeX, nodeY, now) {
      const dxContact = Math.max(-68, Math.min(68, nodeX - catcherX));
      const dyContact = Math.max(-68, Math.min(-24, nodeY - catcherY));

      if (mode === 'dynamo' || mode === 'realm') {
        // Dynamo: Snap a short high-voltage discharge inward from the contact point to the core center!
        const pts = [];
        const steps = 7;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const jitter = (s === 0 || s === steps) ? 0 : (Math.random() - 0.5) * 22 * (1 - t * 0.4);
          const perpX = -dyContact / 60;
          const perpY = dxContact / 60;
          pts.push({
            x: dxContact * (1 - t) + perpX * jitter,
            y: dyContact * (1 - t) + 4 * t + perpY * jitter
          });
        }
        this.dynamoDischarges.push({
          startTime: now,
          duration: 340,
          progress: 0,
          contactX: dxContact,
          contactY: dyContact,
          pts: pts
        });
      } else if (mode === 'helix') {
        // Helix: Send one luminous ripple from the center through both crystal wings!
        this.wingRipples.push({
          startTime: now,
          duration: 560,
          progress: 0,
          contactX: dxContact
        });
      } else if (mode === 'meteor') {
        // Meteor: Make the shield recoil briefly at the impact point and throw cinders upward!
        this.meteorShieldRecoil.y = 9.5;
        this.meteorShieldRecoil.vy = 2.8;
        this.meteorShieldRecoil.tilt = Math.max(-0.22, Math.min(0.22, dxContact * 0.0042));
        this.meteorShieldRecoil.vTilt = this.meteorShieldRecoil.tilt * 0.25;
        this.meteorShieldRecoil.flash = 1.0;

        // Throw 14 glowing cinders & molten sparks upward from the impact point
        const impactWorldX = catcherX + dxContact * 0.65;
        const impactWorldY = catcherY - 46;
        for (let k = 0; k < 14; k++) {
          const spreadAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.35 + (dxContact * 0.005);
          const speed = 3.4 + Math.random() * 4.8;
          this.impactCinders.push({
            x: impactWorldX + (Math.random() - 0.5) * 18,
            y: impactWorldY + (Math.random() - 0.5) * 6,
            vx: Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed - 1.6, // Upward throw!
            size: 2.2 + Math.random() * 2.8,
            isCyanSpark: (k % 4 === 0),
            life: 0,
            maxLife: 22 + Math.random() * 16
          });
        }
      }
    },

    emitNodeWorldStreaks(p, targetR, mode, isHazard, dtScale, now) {
      if (mode === 'meteor' && isHazard) return; // Spiky emerald-violet crystal has no vertical streaks
      if (!p.lastStreakEmit) p.lastStreakEmit = now - Math.random() * 40;
      const emitInterval = isHazard ? 48 : 34;
      if (now - p.lastStreakEmit < emitInterval) return;
      p.lastStreakEmit = now;

      // Alternate left and right flanks so the air directly above the sphere center (|dx| < 0.48 * R) stays 100% open!
      p.streakSide = (p.streakSide === 1) ? -1 : 1;
      const side = p.streakSide;
      const flankFrac = 0.52 + Math.random() * 0.56; // Strictly outside the top-center column!
      const sx = p.x + side * flankFrac * targetR;
      const sy = p.y - (0.25 + Math.random() * 0.55) * targetR;
      const len = (0.58 + Math.random() * 0.48) * targetR;

      this.worldStreaks.push({
        x: sx,
        y: sy,
        vy: p.speed * 0.14, // Moves much slower than the falling node so the node visibly drops past it!
        len: len,
        mode: mode,
        isHazard: isHazard,
        colorVariant: Math.floor(Math.random() * 3),
        life: 0,
        maxLife: 16 + Math.random() * 10
      });
    },

    updateAndDrawWorldStreaks(ctx, dtScale) {
      if (this.worldStreaks.length === 0) return;
      const dt = Math.max(0.25, Math.min(2.5, dtScale));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = this.worldStreaks.length - 1; i >= 0; i--) {
        const st = this.worldStreaks[i];
        st.y += st.vy * dt;
        st.life += dt;
        if (st.life >= st.maxLife) {
          this.worldStreaks.splice(i, 1);
          continue;
        }

        const prog = st.life / st.maxLife;
        const alpha = Math.sin(prog * Math.PI) * 0.82;
        if (alpha <= 0.03) continue;

        const syBot = st.y;
        const syTop = syBot - st.len;
        const grad = ctx.createLinearGradient(st.x, syTop, st.x, syBot);

        if (st.isHazard) {
          grad.addColorStop(0.0, 'rgba(255, 30, 50, 0)');
          grad.addColorStop(0.55, `rgba(255, 80, 70, ${alpha})`);
          grad.addColorStop(0.88, `rgba(255, 210, 180, ${alpha * 0.9})`);
          grad.addColorStop(1.0, 'rgba(255, 40, 60, 0)');
        } else if (st.mode === 'dynamo') {
          // Short, detached cyan streaks for Dynamo
          grad.addColorStop(0.0, 'rgba(0, 240, 255, 0)');
          grad.addColorStop(0.50, `rgba(56, 189, 248, ${alpha})`);
          grad.addColorStop(0.85, `rgba(224, 242, 254, ${alpha * 0.95})`);
          grad.addColorStop(1.0, 'rgba(0, 240, 255, 0)');
        } else if (st.mode === 'helix') {
          // Refracted prismatic glints for Helix
          const cMid = (st.colorVariant === 0)
            ? `rgba(34, 211, 238, ${alpha})`
            : (st.colorVariant === 1 ? `rgba(232, 121, 249, ${alpha})` : `rgba(254, 240, 138, ${alpha})`);
          grad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.48, cMid);
          grad.addColorStop(0.82, `rgba(255, 255, 255, ${alpha * 0.95})`);
          grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
        } else {
          // Fiery ember streaks for Meteor
          grad.addColorStop(0.0, 'rgba(234, 88, 12, 0)');
          grad.addColorStop(0.50, `rgba(249, 115, 22, ${alpha})`);
          grad.addColorStop(0.86, `rgba(254, 240, 138, ${alpha * 0.95})`);
          grad.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.85;
        ctx.beginPath();
        ctx.moveTo(st.x, syTop);
        ctx.lineTo(st.x, syBot);
        ctx.stroke();

        // Mode-specific micro-detail on the streak (refracted diamond glint in Helix, glowing ember head in Meteor)
        if (!st.isHazard && st.mode === 'helix' && alpha > 0.35) {
          const gy = syBot - st.len * 0.32;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(st.x, gy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (!st.isHazard && st.mode === 'meteor' && alpha > 0.30) {
          ctx.fillStyle = `rgba(254, 240, 138, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(st.x, syBot - st.len * 0.22, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PROCEDURAL & LAYERED COMPONENT RENDERERS (DYNAMO, HELIX, METEOR)
  // ─────────────────────────────────────────────────────────────

  // 1. Articulated Continuous Affine-Sheared Wing Mesh Renderer (Root -> Mid -> Longest Outer Feathers)
  // Uses piecewise-linear affine shear (ctx.transform) between strip boundaries s0 and s1
  // so adjacent feather strips connect with ZERO vertical stair-stepping even during sharp reversals!
  function drawArticulatedWings(ctx, mode, u, cySrc, tier, now) {
    if (tier <= 1) return; // Tier I is pure central core without wings
    const wingR = LayeredT4Assets.wingRight[mode];
    const wingL = LayeredT4Assets.wingLeftCanvas[mode];
    if (!wingR || !LayeredT4Assets.loaded.wingRight[mode] || !wingL) return;

    const spanScale = (tier === 2) ? 0.48 : (tier === 3 ? 0.76 : 1.00);
    const numSlices = 20;
    const srcW = 652;
    const srcH = 468;
    const startX = 64; // Wing feathers begin outside central core
    const activeW = srcW - startX;
    const sliceW = activeW / numSlices;
    const breathPhase = now * 0.0032;

    // Evaluate smooth spanwise displacement (dy, dx, rippleGlow) at normalized span s in [0..1]
    const evalWingPoint = (s, dir) => {
      const s2 = s * s;
      const s3 = s2 * s;

      // Coupled Root -> Mid -> Tip kinematic offsets (clamped so feathers flex gracefully)
      const rootTerm = Math.max(-14, Math.min(14, CoreKinematics.rootY)) * (s * (1 - s) * 1.15);
      const midTerm  = Math.max(-22, Math.min(22, CoreKinematics.midY))  * (s2 * (1 - s * 0.35) * 1.05);
      const tipTerm  = Math.max(-34, Math.min(34, CoreKinematics.tipY))  * (s3 * 1.15);

      // Stationary living feather wave from root to tip (longest feathers settle last!)
      const idleWaveY = Math.sin(breathPhase - s * 2.5) * (2.2 * s + 6.8 * s3);
      const idleWaveX = Math.cos(breathPhase - s * 2.1) * (2.8 * s2);

      let dy = (dir * (rootTerm + midTerm + tipTerm) + Math.abs(CoreKinematics.tipY) * 0.18 * s2 + idleWaveY) * u;
      let dx = (Math.max(-24, Math.min(24, CoreKinematics.tipX)) * s2 * 0.65 + dir * idleWaveX) * u;

      let rippleGlow = 0;
      if (mode === 'helix' && CoreKinematics.wingRipples.length > 0) {
        for (let r = 0; r < CoreKinematics.wingRipples.length; r++) {
          const rp = CoreKinematics.wingRipples[r];
          const distFromCrest = s - rp.progress;
          const env = Math.exp(-(distFromCrest * distFromCrest) / 0.024) * Math.max(0, 1 - rp.progress * 0.72);
          const waveOsc = Math.cos(distFromCrest * 16.0);
          dy -= env * waveOsc * 16.0 * u;
          dx += dir * env * 6.5 * u;
          rippleGlow = Math.max(rippleGlow, env);
        }
      }
      return { dx, dy, rippleGlow };
    };

    for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
      const dir = (sideIdx === 0) ? 1 : -1; // +1 = Right Wing, -1 = Left Wing
      const imgSource = (dir === 1) ? wingR : wingL;

      for (let k = 0; k < numSlices; k++) {
        const s0 = k / numSlices;
        const s1 = (k + 1) / numSlices;
        const p0 = evalWingPoint(s0, dir);
        const p1 = evalWingPoint(s1, dir);

        const sx = (dir === 1)
          ? (startX + k * sliceW)
          : (srcW - startX - (k + 1) * sliceW);
        const sw = sliceW + 0.8;

        // World/local x positions of left and right edges of this strip
        const xInner = dir * (startX + k * sliceW * spanScale) * u + p0.dx;
        const xOuter = dir * (startX + (k + 1) * sliceW * spanScale) * u + p1.dx;
        const yInner = p0.dy;
        const yOuter = p1.dy;

        const stripXLeft  = (dir === 1) ? xInner : xOuter;
        const stripXRight = (dir === 1) ? xOuter : xInner;
        const stripYLeft  = (dir === 1) ? yInner : yOuter;
        const stripYRight = (dir === 1) ? yOuter : yInner;

        const destW = Math.max(1.0, (stripXRight - stripXLeft) + 0.7 * u);
        const destH = srcH * u;
        const shearY = (stripYRight - stripYLeft) / destW;

        ctx.save();
        // Affine vertical shear connects stripYLeft at x=0 to stripYRight at x=destW with ZERO stair steps!
        ctx.transform(1, shearY, 0, 1, stripXLeft, stripYLeft - cySrc * u);
        ctx.drawImage(imgSource, sx, 0, sw, srcH, 0, 0, destW, destH);

        const rGlow = Math.max(p0.rippleGlow, p1.rippleGlow);
        if (rGlow > 0.08) {
          ctx.globalCompositeOperation = 'lighter';
          const grad = ctx.createLinearGradient(0, destH * 0.15, 0, destH * 0.85);
          grad.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          grad.addColorStop(0.45, `rgba(34, 211, 238, ${rGlow * 0.55})`);
          grad.addColorStop(0.65, `rgba(240, 171, 252, ${rGlow * 0.65})`);
          grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, destH * (0.28 - s0 * 0.22), destW, destH * 0.52);
        }
        ctx.restore();
      }
    }
  }

  // 2. Chrome Dynamo: 3D Tilted Atomic Rings (Passing Behind z < 0 and In Front z >= 0 of the Nucleus!)
  const DYNAMO_RING_CONFIGS = [
    { baseTilt:  0.44, tiltWobble: 0.18, tiltFreq: 0.0017, spinSpeed:  0.0038, rx: 102, ry: 37, isGold: true  },
    { baseTilt: -0.50, tiltWobble: 0.19, tiltFreq: 0.0014, spinSpeed: -0.0044, rx: 98,  ry: 35, isGold: false },
    { baseTilt:  1.22, tiltWobble: 0.22, tiltFreq: 0.0021, spinSpeed:  0.0031, rx: 90,  ry: 31, isGold: true  }
  ];

  function drawDynamoRingsHalf(ctx, u, now, drawFrontHalf) {
    ctx.save();
    ctx.translate(0, 5 * u);

    const numSegs = 44;
    for (let rIdx = 0; rIdx < DYNAMO_RING_CONFIGS.length; rIdx++) {
      const cfg = DYNAMO_RING_CONFIGS[rIdx];
      // Each ring rotates and precesses around its own tilted 3D axis!
      const tilt = cfg.baseTilt + Math.sin(now * cfg.tiltFreq + rIdx * 2.1) * cfg.tiltWobble;
      const pitchScale = 0.72 + 0.36 * Math.cos(now * (cfg.tiltFreq * 1.3) + rIdx * 1.4);
      const rx = cfg.rx * u;
      const ry = cfg.ry * u * pitchScale;
      const spin = now * cfg.spinSpeed + rIdx * 2.09;

      ctx.save();
      ctx.rotate(tilt);

      // Draw elliptical arc segments belonging to this depth half (z >= 0 for front, z < 0 for back)
      for (let s = 0; s < numSegs; s++) {
        const a0 = (s / numSegs) * Math.PI * 2;
        const a1 = ((s + 1.15) / numSegs) * Math.PI * 2;
        const aMid = (a0 + a1) * 0.5;
        // Depth z = sin(aMid): positive in front half (0..PI), negative in back half (PI..2PI)
        const zDepth = Math.sin(aMid);
        const isFront = (zDepth >= 0);
        if (isFront !== drawFrontHalf) continue;

        const x0 = Math.cos(a0) * rx;
        const y0 = Math.sin(a0) * ry;
        const x1 = Math.cos(a1) * rx;
        const y1 = Math.sin(a1) * ry;

        // Travelling wave brightness along the spinning ring
        const wave = 0.5 + 0.5 * Math.cos(aMid * 2.0 - spin * 2.0);
        const depthAlpha = drawFrontHalf ? (0.82 + 0.18 * zDepth) : (0.38 + 0.25 * (1 + zDepth));
        const width = (drawFrontHalf ? (4.2 + 1.8 * zDepth) : (2.4 + 0.8 * (1 + zDepth))) * u;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineWidth = width;
        ctx.lineCap = 'round';

        if (cfg.isGold) {
          ctx.strokeStyle = (wave > 0.72 && drawFrontHalf)
            ? `rgba(254, 240, 138, ${depthAlpha})`
            : `rgba(245, 158, 11, ${depthAlpha})`;
        } else {
          ctx.strokeStyle = (wave > 0.72 && drawFrontHalf)
            ? `rgba(224, 242, 254, ${depthAlpha})`
            : `rgba(56, 189, 248, ${depthAlpha})`;
        }
        ctx.stroke();

        // Inner specular core filament on front half
        if (drawFrontHalf) {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineWidth = width * 0.38;
          ctx.strokeStyle = cfg.isGold
            ? `rgba(255, 251, 235, ${0.75 * depthAlpha})`
            : `rgba(255, 255, 255, ${0.80 * depthAlpha})`;
          ctx.stroke();
        }
      }

      // Draw 2 orbiting glowing 3D electron nodes along each ring that pass behind (z < 0) and in front (z >= 0) of the nucleus!
      for (let b = 0; b < 2; b++) {
        const eAngle = (spin + b * Math.PI) % (Math.PI * 2);
        const ez = Math.sin(eAngle);
        const eIsFront = (ez >= 0);
        if (eIsFront !== drawFrontHalf) continue;

        const ex = Math.cos(eAngle) * rx;
        const ey = Math.sin(eAngle) * ry;
        const er = (drawFrontHalf ? (5.8 + 2.2 * ez) : 3.6) * u;

        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2.2);
        if (cfg.isGold) {
          g.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
          g.addColorStop(0.35, 'rgba(254, 240, 138, 0.92)');
          g.addColorStop(0.75, 'rgba(245, 158, 11, 0.45)');
          g.addColorStop(1.0, 'rgba(245, 158, 11, 0)');
        } else {
          g.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
          g.addColorStop(0.35, 'rgba(125, 211, 252, 0.95)');
          g.addColorStop(0.75, 'rgba(2, 132, 199, 0.45)');
          g.addColorStop(1.0, 'rgba(2, 132, 199, 0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ex, ey, er * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  // Deterministic pseudo-noise helper for smooth animated branching arcs
  function pseudoSin(seed) {
    return Math.sin(seed * 12.9898 + Math.cos(seed * 4.1414) * 3.1);
  }

  // Draw live forming, branching, and fading electrical arcs inside Dynamo Core or Plasma Orbs
  function drawInternalPlasmaArcs(ctx, cx, cy, maxR, now, phaseOffset, isCore = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    // 1. Undulating Golden-Amber Equatorial Plasma Crescent (matches exact reference look!)
    const swayAngle = Math.sin(now * 0.0042 + phaseOffset) * 0.28;
    const cresPulse = 0.82 + 0.18 * Math.sin(now * 0.007 + phaseOffset * 1.7);
    ctx.save();
    ctx.rotate(swayAngle);
    ctx.beginPath();
    const arcR = maxR * 0.68;
    for (let s = 0; s <= 16; s++) {
      const t = s / 16.0;
      const ang = 0.22 * Math.PI + t * 0.56 * Math.PI;
      const ripple = Math.sin(now * 0.014 + t * 9.0 + phaseOffset) * (maxR * 0.06);
      const px = Math.cos(ang) * (arcR + ripple);
      const py = Math.sin(ang) * (arcR * 0.65 + ripple) + maxR * 0.06;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.88 * cresPulse})`;
    ctx.lineWidth = Math.max(1.8, maxR * 0.095);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.strokeStyle = `rgba(254, 249, 195, ${0.95 * cresPulse})`;
    ctx.lineWidth = Math.max(1.0, maxR * 0.042);
    ctx.stroke();
    ctx.restore();

    // 2. Forming, Branching, and Fading Internal Electrical Filaments
    const numArcs = isCore ? 5 : 4;
    for (let a = 0; a < numArcs; a++) {
      const cycleDuration = 380 + a * 75;
      const localTime = (now + phaseOffset * 420 + a * 190);
      const cycleIdx = Math.floor(localTime / cycleDuration);
      const cycleProg = (localTime % cycleDuration) / cycleDuration; // 0 -> 1

      // Arc forms from center (prog 0..0.3), branches & crackles (0.3..0.7), and fades out (0.7..1.0)
      const reachFrac = Math.min(1.0, cycleProg / 0.35);
      const fadeAlpha = Math.sin(cycleProg * Math.PI);
      if (fadeAlpha <= 0.05) continue;

      const baseAng = (a / numArcs) * Math.PI * 2 + cycleIdx * 1.15 + Math.sin(now * 0.002 + a) * 0.4;
      const segs = 5;
      let prevX = 0;
      let prevY = 0;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      let branchStartX = 0, branchStartY = 0;

      for (let s = 1; s <= segs; s++) {
        const frac = (s / segs) * reachFrac;
        const rDist = frac * maxR * 0.84;
        const jitter = pseudoSin(cycleIdx * 17 + a * 31 + s * 7 + Math.floor(now * 0.025)) * 0.38;
        const sx = Math.cos(baseAng + jitter) * rDist;
        const sy = Math.sin(baseAng + jitter) * rDist;
        ctx.lineTo(sx, sy);
        if (s === 2) {
          branchStartX = sx;
          branchStartY = sy;
        }
        prevX = sx;
        prevY = sy;
      }

      const isCyan = (a % 2 === 0);
      ctx.strokeStyle = isCyan
        ? `rgba(103, 232, 249, ${0.88 * fadeAlpha})`
        : `rgba(232, 121, 249, ${0.86 * fadeAlpha})`;
      ctx.lineWidth = Math.max(1.2, maxR * 0.048);
      ctx.stroke();

      // Secondary Forked Branch
      if (cycleProg > 0.22) {
        const bAng = baseAng + (a % 2 === 0 ? 0.55 : -0.55);
        const bLen = maxR * 0.42 * Math.min(1.0, (cycleProg - 0.22) / 0.35);
        const bMidX = branchStartX + Math.cos(bAng + 0.2) * (bLen * 0.55);
        const bMidY = branchStartY + Math.sin(bAng + 0.2) * (bLen * 0.55);
        const bEndX = branchStartX + Math.cos(bAng - 0.15) * bLen;
        const bEndY = branchStartY + Math.sin(bAng - 0.15) * bLen;

        ctx.beginPath();
        ctx.moveTo(branchStartX, branchStartY);
        ctx.lineTo(bMidX, bMidY);
        ctx.lineTo(bEndX, bEndY);
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.78 * fadeAlpha})`;
        ctx.lineWidth = Math.max(0.9, maxR * 0.032);
        ctx.stroke();
      }
    }

    // Central Singularity Pulse Point
    const corePulse = 0.8 + 0.2 * Math.sin(now * 0.009 + phaseOffset);
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR * 0.38 * corePulse);
    cg.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    cg.addColorStop(0.45, 'rgba(232, 121, 249, 0.65)');
    cg.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, maxR * 0.38 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. Chrome Helix: Live 3D Rotating DNA Double Helix + Traveling Rung Light Pulse Inside Glass Shell
  function drawRotating3DDNAInsideGlass(ctx, cx, cy, radiusX, radiusY, now, phaseOffset, isCore = false) {
    ctx.save();
    ctx.translate(cx, cy);

    // Clip strictly to the inner glass sphere cavity
    const clipR = Math.max(radiusX, radiusY) * 1.04;
    ctx.beginPath();
    ctx.arc(0, 0, clipR, 0, Math.PI * 2);
    ctx.clip();

    const rotPhase = now * (isCore ? 0.0038 : 0.0048) + phaseOffset;
    // Light pulse travels smoothly along the rungs from bottom (+1) to top (-1)
    const pulseNormY = 1.05 - (((now * 0.0014 + phaseOffset * 0.35) % 1.0) * 2.10);

    const numRungs = isCore ? 9 : 7;
    const strandSteps = 28;
    const strandA = [];
    const strandB = [];

    for (let i = 0; i <= strandSteps; i++) {
      const t = i / strandSteps;
      const yNorm = -0.86 + t * 1.72; // -0.86 (top) to +0.86 (bottom)
      const yPx = yNorm * radiusY;
      // Spherical envelope tapers the DNA width slightly near top and bottom poles of the glass sphere
      const env = Math.sqrt(Math.max(0.15, 1.0 - yNorm * yNorm * 0.65));
      const ampX = radiusX * env;

      const theta = yNorm * (isCore ? 3.8 : 3.4) - rotPhase;
      const xA = Math.sin(theta) * ampX;
      const zA = Math.cos(theta); // +1 front, -1 back
      const xB = Math.sin(theta + Math.PI) * ampX;
      const zB = -zA;

      strandA.push({ x: xA, y: yPx, z: zA, yNorm });
      strandB.push({ x: xB, y: yPx, z: zB, yNorm });
    }

    // Pass 1: Back segments (z < 0) of Strand A (Cyan) and Strand B (Magenta)
    const drawStrandPass = (pts, isCyan, frontPass) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const zMid = (p0.z + p1.z) * 0.5;
        if ((zMid >= 0) !== frontPass) continue;

        const pulseBoost = Math.exp(-Math.pow((p0.yNorm - pulseNormY) / 0.22, 2));
        const alpha = frontPass ? (0.85 + 0.15 * zMid) : (0.38 + 0.22 * (1 + zMid));
        const lw = (frontPass ? (3.2 + 1.4 * zMid + pulseBoost * 1.5) : 1.9) * (radiusY / 42.0);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineCap = 'round';
        ctx.lineWidth = lw;

        if (isCyan) {
          ctx.strokeStyle = (pulseBoost > 0.45 && frontPass)
            ? `rgba(224, 242, 254, ${alpha})`
            : `rgba(34, 211, 238, ${alpha})`;
        } else {
          ctx.strokeStyle = (pulseBoost > 0.45 && frontPass)
            ? `rgba(254, 240, 138, ${alpha})`
            : `rgba(232, 121, 249, ${alpha})`;
        }
        ctx.stroke();
      }
    };

    drawStrandPass(strandA, true, false);
    drawStrandPass(strandB, false, false);

    // Pass 2: Base-Pair Rungs + Traveling Light Pulse Along the Rungs!
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let r = 0; r < numRungs; r++) {
      const yNorm = -0.74 + (r / (numRungs - 1)) * 1.48;
      const yPx = yNorm * radiusY;
      const env = Math.sqrt(Math.max(0.15, 1.0 - yNorm * yNorm * 0.65));
      const ampX = radiusX * env;
      const theta = yNorm * (isCore ? 3.8 : 3.4) - rotPhase;
      const xA = Math.sin(theta) * ampX;
      const xB = -xA;

      // Traveling light pulse intensity on this rung
      const pulseIntensity = Math.exp(-Math.pow((yNorm - pulseNormY) / 0.20, 2));
      const baseAlpha = 0.48 + pulseIntensity * 0.52;

      const rg = ctx.createLinearGradient(xA, yPx, xB, yPx);
      rg.addColorStop(0.0, `rgba(34, 211, 238, ${baseAlpha})`);
      rg.addColorStop(0.5, pulseIntensity > 0.35
        ? `rgba(254, 249, 195, ${0.98 * baseAlpha})`
        : `rgba(255, 255, 255, ${0.75 * baseAlpha})`);
      rg.addColorStop(1.0, `rgba(232, 121, 249, ${baseAlpha})`);

      ctx.beginPath();
      ctx.moveTo(xA, yPx);
      ctx.lineTo(xB, yPx);
      ctx.strokeStyle = rg;
      ctx.lineWidth = (1.8 + pulseIntensity * 2.4) * (radiusY / 42.0);
      ctx.stroke();

      // Glowing pulse traveling bead at the center and ends of the illuminated rung
      if (pulseIntensity > 0.22) {
        const pr = (3.4 + pulseIntensity * 3.8) * (radiusY / 42.0);
        const pg = ctx.createRadialGradient(0, yPx, 0, 0, yPx, pr * 2.0);
        pg.addColorStop(0.0, `rgba(255, 255, 255, ${pulseIntensity * 0.95})`);
        pg.addColorStop(0.45, `rgba(254, 240, 138, ${pulseIntensity * 0.78})`);
        pg.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(0, yPx, pr * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Pass 3: Front segments (z >= 0) of Strand A and Strand B
    drawStrandPass(strandA, true, true);
    drawStrandPass(strandB, false, true);

    // Pass 4: Stable Outer Glass Specular Highlight Arc (Stays stationary while DNA rotates inside!)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(0, 0, radiusY * 0.92, -Math.PI * 0.78, -Math.PI * 0.28);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
    ctx.lineWidth = Math.max(1.4, radiusY * 0.045);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // 4. Chrome Meteor: 3D Molten Rings & Breathing Magma Fissures + Tumbling Basalt Plates
  const METEOR_FISSURE_HOTSPOTS = [
    { x:  0.00, y:  0.06, r: 0.34, freq: 0.0052, phase: 0.0, isEye: true  },
    { x: -0.38, y: -0.28, r: 0.24, freq: 0.0068, phase: 1.3, isEye: false },
    { x:  0.36, y: -0.22, r: 0.26, freq: 0.0059, phase: 2.7, isEye: false },
    { x: -0.32, y:  0.34, r: 0.25, freq: 0.0074, phase: 4.1, isEye: false },
    { x:  0.35, y:  0.30, r: 0.25, freq: 0.0063, phase: 5.2, isEye: false },
    { x:  0.02, y: -0.46, r: 0.22, freq: 0.0081, phase: 3.4, isEye: false }
  ];

  function drawMeteorMagmaFissuresAndPlates(ctx, radius, now, phaseOffset, tumbleAngle) {
    ctx.save();
    // Clip to rock sphere
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.96, 0, Math.PI * 2);
    ctx.clip();

    // Rotate frame by tumbleAngle so basalt plates & magma fissures turn together
    ctx.rotate(tumbleAngle);

    // 1. Distinct Dark Basalt Crust Plates that rotate into view
    const numPlates = 5;
    ctx.fillStyle = 'rgba(15, 10, 8, 0.42)';
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.38)';
    ctx.lineWidth = Math.max(1.1, radius * 0.035);
    for (let p = 0; p < numPlates; p++) {
      const pAng = (p / numPlates) * Math.PI * 2 + 0.3;
      const dist = radius * 0.46;
      const px = Math.cos(pAng) * dist;
      const py = Math.sin(pAng) * dist;
      const pr = radius * 0.24;

      ctx.beginPath();
      for (let v = 0; v < 5; v++) {
        const va = pAng + (v / 5) * Math.PI * 2;
        const vr = pr * (0.78 + 0.28 * ((v % 2 === 0) ? 1 : 0.7));
        const vx = px + Math.cos(va) * vr;
        const vy = py + Math.sin(va) * vr;
        if (v === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 2. Asynchronous Brightening & Receding Magma Fissure Hotspots
    ctx.globalCompositeOperation = 'lighter';
    for (let h = 0; h < METEOR_FISSURE_HOTSPOTS.length; h++) {
      const hs = METEOR_FISSURE_HOTSPOTS[h];
      const pulse = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(now * hs.freq + hs.phase + phaseOffset), 1.6);
      const hx = hs.x * radius;
      const hy = hs.y * radius;
      const hr = hs.r * radius * (0.82 + 0.28 * pulse);

      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      if (hs.isEye) {
        g.addColorStop(0.0, `rgba(255, 255, 255, ${0.95 * pulse})`);
        g.addColorStop(0.35, `rgba(254, 240, 138, ${0.88 * pulse})`);
        g.addColorStop(0.70, `rgba(249, 115, 22, ${0.55 * pulse})`);
        g.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
      } else {
        g.addColorStop(0.0, `rgba(254, 240, 138, ${0.82 * pulse})`);
        g.addColorStop(0.45, `rgba(249, 115, 22, ${0.65 * pulse})`);
        g.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw the thin Cyan Bow Shock pinned strictly to the downward-facing edge of a falling Molten Bolide
  function drawDownwardCyanBowShock(ctx, radius, now, phaseOffset) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const shimmer = 0.86 + 0.14 * Math.sin(now * 0.012 + phaseOffset);
    const arcR = radius * 0.96;

    // Outer cyan plasma glow along the bottom rim (angle 0.14*PI to 0.86*PI)
    ctx.beginPath();
    ctx.arc(0, 0, arcR, Math.PI * 0.14, Math.PI * 0.86);
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.68 * shimmer})`;
    ctx.lineWidth = Math.max(3.6, radius * 0.13);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Crisp bright cyan-white bow shock edge
    ctx.beginPath();
    ctx.arc(0, 0, arcR, Math.PI * 0.20, Math.PI * 0.80);
    ctx.strokeStyle = `rgba(165, 243, 252, ${0.95 * shimmer})`;
    ctx.lineWidth = Math.max(1.8, radius * 0.06);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, arcR, Math.PI * 0.32, Math.PI * 0.68);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * shimmer})`;
    ctx.lineWidth = Math.max(1.1, radius * 0.032);
    ctx.stroke();

    ctx.restore();
  }

  // Draw 3D Molten Orbital Rings for Meteor Aegis Caldera Core (behind z < 0 and in front z >= 0)
  function drawMeteorMoltenRingsHalf(ctx, u, now, drawFrontHalf) {
    const configs = [
      { tilt:  0.52 + Math.sin(now * 0.0014) * 0.14, rx: 102 * u, ry: 42 * u, spin:  now * 0.0032 },
      { tilt: -0.52 + Math.cos(now * 0.0016) * 0.14, rx: 102 * u, ry: 42 * u, spin: -now * 0.0035 }
    ];
    const segs = 36;
    ctx.save();
    ctx.translate(0, -6 * u);
    for (let c = 0; c < configs.length; c++) {
      const cfg = configs[c];
      ctx.save();
      ctx.rotate(cfg.tilt);
      for (let s = 0; s < segs; s++) {
        const a0 = (s / segs) * Math.PI * 2;
        const a1 = ((s + 1.15) / segs) * Math.PI * 2;
        const aMid = (a0 + a1) * 0.5;
        const z = Math.sin(aMid);
        if ((z >= 0) !== drawFrontHalf) continue;

        const wave = 0.5 + 0.5 * Math.cos(aMid * 2.0 - cfg.spin * 2.0);
        const alpha = drawFrontHalf ? (0.80 + 0.20 * z) : (0.35 + 0.20 * (1 + z));
        const lw = (drawFrontHalf ? (3.8 + 1.6 * z) : 2.2) * u;

        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * cfg.rx, Math.sin(a0) * cfg.ry);
        ctx.lineTo(Math.cos(a1) * cfg.rx, Math.sin(a1) * cfg.ry);
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.strokeStyle = (wave > 0.65 && drawFrontHalf)
          ? `rgba(254, 240, 138, ${alpha})`
          : `rgba(249, 115, 22, ${alpha})`;
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Top-Rim Contact Burst when a Falling Node touches the top of the Chrome Core
  function drawCoreTopContactBurst(ctx, cx, contactY, mode, intensity = 1.0, now = 0) {
    ctx.save();
    ctx.translate(cx, contactY);
    ctx.globalCompositeOperation = 'lighter';

    if (mode === 'meteor') {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 44 * intensity);
      g.addColorStop(0.0, `rgba(255, 255, 255, ${0.98 * intensity})`);
      g.addColorStop(0.35, `rgba(103, 232, 249, ${0.92 * intensity})`);
      g.addColorStop(0.70, `rgba(6, 182, 212, ${0.45 * intensity})`);
      g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 44 * intensity, 0, Math.PI * 2);
      ctx.fill();

      const rays = 20;
      ctx.beginPath();
      for (let r = 0; r < rays; r++) {
        const ang = -Math.PI + (r / (rays - 1)) * Math.PI + Math.sin(now * 0.02 + r) * 0.04;
        const innerR = 6;
        const outerR = (26 + (r % 3) * 14) * intensity;
        ctx.moveTo(Math.cos(ang) * innerR, Math.sin(ang) * innerR * 0.65);
        ctx.lineTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR * 0.65);
      }
      ctx.strokeStyle = `rgba(165, 243, 252, ${0.85 * intensity})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    } else if (mode === 'helix') {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 42 * intensity);
      g.addColorStop(0.0, `rgba(255, 255, 255, ${0.98 * intensity})`);
      g.addColorStop(0.40, `rgba(254, 240, 138, ${0.88 * intensity})`);
      g.addColorStop(0.75, `rgba(249, 115, 22, ${0.38 * intensity})`);
      g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 42 * intensity, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 42 * intensity);
      g.addColorStop(0.0, `rgba(255, 255, 255, ${0.98 * intensity})`);
      g.addColorStop(0.40, `rgba(254, 240, 138, ${0.90 * intensity})`);
      g.addColorStop(0.75, `rgba(56, 189, 248, ${0.42 * intensity})`);
      g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 42 * intensity, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  const QuantumRenderer = {
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      this.drawDynamoCore(ctx, cx, cy, now, progress);
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4) {
      const tierIdx = Math.min(4, Math.max(1, tier | 0));
      const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
      const isMobile = canvasW < 600;

      // Exact proportions matching the 1376x768 reference artwork
      const drawW = isMobile ? Math.min(canvasW * 0.96, 420) : Math.min(canvasW * 0.86, 1060);
      const u = drawW / 1304.0;
      const cySrc = (mode === 'meteor') ? 318.0 : 334.0;

      ctx.save();
      ctx.translate(cx, cy);

      // LAYER 1: Background Circular Starburst Halo (Tier III & Tier IV)
      if (tierIdx >= 3 && LayeredT4Assets.loaded.halo[mode]) {
        const haloSpr = LayeredT4Assets.halo[mode];
        const haloPulse = 1.0 + Math.sin(now * 0.003) * 0.018;
        ctx.save();
        ctx.globalAlpha = (tierIdx === 3) ? 0.82 : 1.0;
        ctx.scale(haloPulse, haloPulse);
        ctx.drawImage(haloSpr, -320 * u, -cySrc * u, 640 * u, 468 * u);
        ctx.restore();
      }

      // LAYER 2: Articulated 16-Slice Wings (Tier II, III, IV)
      // Root follows body, Mid follows Root, and Longest Outer Feathers settle last & whip on reversal!
      drawArticulatedWings(ctx, mode, u, cySrc, tierIdx, now);

      // LAYER 3: Banking Central Core Body + Independent Continuous Internal Motion!
      ctx.save();
      ctx.rotate(CoreKinematics.bodyBank);

      if (mode === 'dynamo') {
        // 3A. Back halves (z < 0) of the 3 tilted 3D atomic rings pass BEHIND the nucleus
        drawDynamoRingsHalf(ctx, u, now, false);

        // 3B. Clean Violet-Magenta Singularity Nucleus (with baked rings removed!)
        if (LayeredT4Assets.loaded.coreBase.dynamo) {
          ctx.drawImage(LayeredT4Assets.coreBase.dynamo, -170 * u, -140 * u, 340 * u, 280 * u);
        }

        // 3C. Live Forming, Branching & Fading Electrical Arcs Inside the Nucleus
        drawInternalPlasmaArcs(ctx, 0, 5 * u, 50 * u, now, 0.0, true);

        // 3D. Front halves (z >= 0) of the 3 tilted 3D atomic rings pass IN FRONT of the nucleus
        drawDynamoRingsHalf(ctx, u, now, true);

        // 3E. Capture Inward Snap Discharges from contact rim into the nucleus center!
        for (let d = 0; d < CoreKinematics.dynamoDischarges.length; d++) {
          const dis = CoreKinematics.dynamoDischarges[d];
          const alpha = 1.0 - dis.progress;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.beginPath();
          for (let k = 0; k < dis.pts.length; k++) {
            const pt = dis.pts[k];
            const jx = (k === 0 || k === dis.pts.length - 1) ? 0 : (Math.random() - 0.5) * 6;
            const jy = (k === 0 || k === dis.pts.length - 1) ? 0 : (Math.random() - 0.5) * 6;
            if (k === 0) ctx.moveTo(pt.x + jx, pt.y + jy);
            else ctx.lineTo(pt.x + jx, pt.y + jy);
          }
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 4.2;
          ctx.stroke();

          ctx.strokeStyle = `rgba(254, 249, 195, ${alpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();
        }
      } else if (mode === 'helix') {
        // 3A. Clean Outer Glass Shell & Orbital Rings (with baked central DNA removed!)
        if (LayeredT4Assets.loaded.coreBase.helix) {
          ctx.drawImage(LayeredT4Assets.coreBase.helix, -170 * u, -140 * u, 340 * u, 280 * u);
        }

        // 3B. Live 3D Rotating DNA Double Helix + Traveling Rung Light Pulse INSIDE the glass sphere!
        drawRotating3DDNAInsideGlass(ctx, 0, 2 * u, 27 * u, 68 * u, now, 0.0, true);
      } else {
        // METEOR: Aegis Caldera Core
        const sr = CoreKinematics.meteorShieldRecoil;
        ctx.save();
        ctx.translate(0, sr.y * u * 0.65);
        ctx.rotate(sr.tilt * 0.45);

        // 3A. Back halves (z < 0) of 3D Molten Orbital Rings
        drawMeteorMoltenRingsHalf(ctx, u, now, false);

        // 3B. Clean Spherical Volcanic Caldera Core
        if (LayeredT4Assets.loaded.coreBase.meteor) {
          ctx.drawImage(LayeredT4Assets.coreBase.meteor, -170 * u, -140 * u, 340 * u, 280 * u);
        }

        // 3C. Breathing Magma Fissures & Slowly Shifting Basalt Plates on Caldera
        drawMeteorMagmaFissuresAndPlates(ctx, 68 * u, now, 0.0, Math.sin(now * 0.0008) * 0.14);

        // 3D. Front halves (z >= 0) of 3D Molten Orbital Rings
        drawMeteorMoltenRingsHalf(ctx, u, now, true);

        // 3E. Reactive Top Cyan Deflection Shield Arc (Recoils downward at impact point!)
        ctx.save();
        ctx.translate(0, sr.y * u * 0.55);
        ctx.rotate(sr.tilt);
        ctx.globalCompositeOperation = 'lighter';
        const shieldBoost = 0.85 + 0.15 * Math.sin(now * 0.008) + sr.flash * 0.55;
        const sg = ctx.createRadialGradient(0, -64 * u, 2 * u, 0, -64 * u, 42 * u);
        sg.addColorStop(0.0, `rgba(255, 255, 255, ${Math.min(1, 0.92 * shieldBoost)})`);
        sg.addColorStop(0.45, `rgba(103, 232, 249, ${Math.min(1, 0.82 * shieldBoost)})`);
        sg.addColorStop(1.0, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(0, -64 * u, 42 * u, 0, Math.PI * 2);
        ctx.fill();

        // Crisp cyan deflection bow cap
        ctx.beginPath();
        ctx.arc(0, -6 * u, 68 * u, -Math.PI * 0.72, -Math.PI * 0.28);
        ctx.strokeStyle = `rgba(165, 243, 252, ${Math.min(1, 0.90 * shieldBoost)})`;
        ctx.lineWidth = 3.2 * u;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      ctx.restore(); // End central core body bank
      ctx.restore(); // End core translate

      // Render Meteor Upward Thrown Deflection Cinders in world space
      if (mode === 'meteor' && CoreKinematics.impactCinders.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < CoreKinematics.impactCinders.length; i++) {
          const c = CoreKinematics.impactCinders[i];
          const alpha = 1.0 - (c.life / c.maxLife);
          const r = c.size * (0.6 + 0.4 * alpha);
          const cg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 2.2);
          if (c.isCyanSpark) {
            cg.addColorStop(0.0, `rgba(255, 255, 255, ${alpha})`);
            cg.addColorStop(0.5, `rgba(103, 232, 249, ${alpha * 0.85})`);
            cg.addColorStop(1.0, 'rgba(6, 182, 212, 0)');
          } else {
            cg.addColorStop(0.0, `rgba(254, 249, 195, ${alpha})`);
            cg.addColorStop(0.45, `rgba(249, 115, 22, ${alpha * 0.90})`);
            cg.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
          }
          ctx.fillStyle = cg;
          ctx.beginPath();
          ctx.arc(c.x, c.y, r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    },

    drawDynamoCore(ctx, cx, cy, now, progress = 0, tier = 1) {
      this._drawLayeredWingedCore(ctx, 'dynamo', cx, cy, now, tier);
    },

    drawHelixCore(ctx, cx, cy, now, progress = 0, tier = 1) {
      this._drawLayeredWingedCore(ctx, 'helix', cx, cy, now, tier);
    },

    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0, tier = 1) {
      this._drawLayeredWingedCore(ctx, 'meteor', cx, cy, now, tier);
    },

    // Master Multi-Layered Celestial Flux Node & Hazard Renderer
    _drawLayeredNodeOrHazard(ctx, mode, p, now) {
      const isHazard = (p.nodeClass === 'volatile');
      const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
      const isMobile = canvasW < 600;
      const targetR = isMobile ? 27.0 : 38.0;
      const scale = targetR / 48.0;
      const animPhase = p.animPhase || 0.0;

      // Emit world-space detached speed streaks on the flanks (node visibly drops past them as they fade!)
      CoreKinematics.emitNodeWorldStreaks(p, targetR, mode, isHazard, 1.0, now);

      ctx.save();
      ctx.translate(p.x, p.y);

      if (!isHazard) {
        // ─────────────────────────────────────────────────────────
        // COLLECTIBLE CELESTIAL FLUX NODES (DYNAMO, HELIX, METEOR)
        // ─────────────────────────────────────────────────────────
        if (mode === 'dynamo') {
          // 1. Clean Electric-Blue Glass Shell & Deep Violet Cavity (baked static arc removed!)
          if (LayeredT4Assets.loaded.nodeShell.dynamo) {
            ctx.drawImage(LayeredT4Assets.nodeShell.dynamo, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          // 2. Live Forming, Branching & Fading Electrical Arcs Inside the Plasma Orb!
          drawInternalPlasmaArcs(ctx, 0, 0, targetR * 0.86, now, animPhase, false);
        } else if (mode === 'helix') {
          // 1. Clean Outer Glass Pearl Shell & Stable Specular Highlight (baked static DNA removed!)
          if (LayeredT4Assets.loaded.nodeShell.helix) {
            ctx.drawImage(LayeredT4Assets.nodeShell.helix, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          // 2. Live 3D Rotating DNA Helix + Traveling Rung Light Pulse Inside the Glass Pearl!
          drawRotating3DDNAInsideGlass(ctx, 0, 0, targetR * 0.36, targetR * 0.78, now, animPhase, false);
        } else {
          // METEOR: Slow Weighty Tumble + Basalt Plates + Breathing Magma Fissures + Downward Cyan Bow Shock!
          const tumbleDir = p.tumbleDir || 1;
          const rockAngle = now * 0.00145 * tumbleDir + animPhase;

          // 1. Rotate the volcanic rock sphere (which has zero baked streaks and zero baked cyan rim)
          ctx.save();
          ctx.rotate(rockAngle);
          if (LayeredT4Assets.loaded.nodeShell.meteor) {
            ctx.drawImage(LayeredT4Assets.nodeShell.meteor, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          ctx.restore();

          // 2. Tumbling Basalt Plates & Asynchronous Brightening/Receding Magma Fissures
          drawMeteorMagmaFissuresAndPlates(ctx, targetR, now, animPhase, rockAngle);

          // 3. Thin Cyan Bow Shock Pinned to the Downward-Facing Edge as the Rock Turns!
          drawDownwardCyanBowShock(ctx, targetR, now, animPhase);
        }
      } else {
        // ─────────────────────────────────────────────────────────
        // HAZARDS TO AVOID (INDEPENDENT LAYERED MOTION PER MODE)
        // ─────────────────────────────────────────────────────────
        if (mode === 'dynamo') {
          // Dynamo Crimson Hazard: Broken horizontal glitch that shifts independently of its descent!
          const gSpr = LayeredT4Assets.hazard.dynamoGlitch;
          if (gSpr && LayeredT4Assets.loaded.hazard.dynamoGlitch) {
            const numSlices = 7;
            const srcSize = 140;
            const sliceH = srcSize / numSlices;
            const glitchTick = Math.floor(now * 0.022 + animPhase * 3.0);

            for (let s = 0; s < numSlices; s++) {
              // Stepped high-tech horizontal glitch shear on individual slices & containment bars
              const wave = Math.sin(glitchTick * 1.9 + s * 2.4 + animPhase);
              const isGlitchBand = (Math.abs(wave) > 0.42) || (s === 2 || s === 4);
              const dxGlitch = isGlitchBand ? (wave * 8.5 * scale) : 0;

              const sy = s * sliceH;
              const dy = (-70 + s * sliceH) * scale;
              const dw = 140 * scale;
              const dh = (sliceH + 0.6) * scale;

              // Chromatic cyan/red glitch ghost on strongly shifted slices
              if (Math.abs(dxGlitch) > 3.2 * scale) {
                ctx.save();
                ctx.globalAlpha = 0.48;
                ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, -70 * scale - dxGlitch * 0.65, dy, dw, dh);
                ctx.restore();
              }
              ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, -70 * scale + dxGlitch, dy, dw, dh);
            }

            // Live internal crimson electrical arcs inside the glitching orb
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const arcAng = now * 0.012 + animPhase;
            ctx.beginPath();
            ctx.moveTo(-targetR * 0.6, Math.sin(arcAng) * 6);
            ctx.lineTo(0, (Math.random() - 0.5) * 10);
            ctx.lineTo(targetR * 0.6, Math.cos(arcAng) * 6);
            ctx.strokeStyle = 'rgba(255, 180, 190, 0.85)';
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.restore();
          }
        } else if (mode === 'helix') {
          // Helix Red Crystal Hazard: Independently shifting crystal facets!
          if (LayeredT4Assets.loaded.hazard.helixClean) {
            ctx.drawImage(LayeredT4Assets.hazard.helixClean, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          // Render 7 independently tilting & glinting 3D ruby-garnet crystal facets + laser-orange cleavage pulse
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 0.95, 0, Math.PI * 2);
          ctx.clip();

          const numFacets = 7;
          for (let f = 0; f < numFacets; f++) {
            const fPhase = now * 0.0042 + f * 1.35 + animPhase;
            const glint = Math.pow(0.5 + 0.5 * Math.sin(fPhase), 3.0);
            const fAng = (f / numFacets) * Math.PI * 2 + Math.sin(now * 0.002 + f) * 0.18;
            const rMid = targetR * (0.35 + 0.22 * (f % 2));
            const fx = Math.cos(fAng) * rMid;
            const fy = Math.sin(fAng) * rMid;
            const fr = targetR * 0.36;

            ctx.beginPath();
            for (let v = 0; v < 3; v++) {
              const va = fAng + v * (Math.PI * 2 / 3) + Math.sin(fPhase * 0.7 + v) * 0.22;
              const vx = fx + Math.cos(va) * fr;
              const vy = fy + Math.sin(va) * fr;
              if (v === 0) ctx.moveTo(vx, vy);
              else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 120, 100, ${0.12 + glint * 0.48})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(254, 215, 170, ${0.25 + glint * 0.65})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }

          // Shifting diagonal laser-orange cleavage line
          ctx.globalCompositeOperation = 'lighter';
          const slashShift = Math.sin(now * 0.005 + animPhase) * targetR * 0.18;
          ctx.beginPath();
          ctx.moveTo(-targetR * 0.85, targetR * 0.45 + slashShift);
          ctx.lineTo(targetR * 0.85, -targetR * 0.45 - slashShift);
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.90)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();
        } else {
          // Meteor Green-and-Violet Spiked Hazard: Rotate the blades around its dark center!
          const bladeAngle = now * 0.0032 + animPhase;
          const counterAngle = -now * 0.0022 - animPhase * 0.7;

          // 1. Counter-rotating inner ring of violet-emerald crystal teeth
          if (LayeredT4Assets.loaded.hazard.meteorBlades) {
            ctx.save();
            ctx.rotate(counterAngle);
            ctx.scale(0.76, 0.76);
            ctx.globalAlpha = 0.78;
            ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
            ctx.restore();

            // 2. Primary rotating outer green-and-violet spiked blade ring
            ctx.save();
            ctx.rotate(bladeAngle);
            ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
            ctx.restore();
          }

          // 3. Stationary Dark Obsidian & Pulsing Emerald Center!
          if (LayeredT4Assets.loaded.hazard.meteorCenter) {
            ctx.drawImage(LayeredT4Assets.hazard.meteorCenter, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
          }
          const eyePulse = 0.65 + 0.35 * Math.sin(now * 0.007 + animPhase);
          const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * 0.34);
          eg.addColorStop(0.0, `rgba(167, 243, 208, ${0.92 * eyePulse})`);
          eg.addColorStop(0.5, `rgba(16, 185, 129, ${0.55 * eyePulse})`);
          eg.addColorStop(1.0, 'rgba(6, 78, 59, 0)');
          ctx.fillStyle = eg;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 0.34, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },

    drawTier3RealmParticle(targetCtx, p, now) {
      this._drawLayeredNodeOrHazard(targetCtx, 'dynamo', p, now);
    },

    drawTier3DynamoParticle(targetCtx, p, now) {
      this._drawLayeredNodeOrHazard(targetCtx, 'dynamo', p, now);
    },

    drawTier3HelixParticle(targetCtx, p, now) {
      this._drawLayeredNodeOrHazard(targetCtx, 'helix', p, now);
    },

    drawTier3MeteorParticle(targetCtx, p, now) {
      this._drawLayeredNodeOrHazard(targetCtx, 'meteor', p, now);
    },

    drawContactBurst(ctx, cx, contactY, mode, intensity, now) {
      drawCoreTopContactBurst(ctx, cx, contactY, mode, intensity, now);
    }
  };

  // --- Main Application State ---
  const state = {
    currentWave: 1,
    active: false,
    gameType: 'math',
    score: 0,
    combo: 1,
    targetMultiple: 7, // Chosen multiple for Reflex Numbers Blitz (1 to 9)
    isChoosingMultiple: false, // True until player chooses 1-9
    floatingTexts: [],

    // Math Overdrive State
    mathLevel: 1,
    mathQuestions: [],
    mathQIdx: 0,
    mathMistakes: 0,
    mathTimer: null,
    mathTimeLeft: 100,

    // Reflex Blitz State
    reflexLives: 10,
    catcherX: 0.5,
    catcherType: 'realm',
    lastTransmuteTime: 0,
    particles: [],

    // Memory Matrix State
    memoryRound: 1,
    memorySequence: [],
    playerSequence: [],
    isAcceptingInput: false,

    bestScores: {
      math: parseInt(localStorage.getItem('oc_best_math') || '0', 10),
      reflex: parseInt(localStorage.getItem('oc_best_reflex') || '0', 10),
      realm: parseInt(localStorage.getItem('oc_best_realm') || '0', 10),
      helix: parseInt(localStorage.getItem('oc_best_helix') || '0', 10),
      meteor: parseInt(localStorage.getItem('oc_best_meteor') || '0', 10),
      memory: parseInt(localStorage.getItem('oc_best_memory') || '0', 10)
    }
  };

  let animFrameId = null;
  let dom = {};

  // --- DOM Initializer ---
  
  // ─────────────────────────────────────────────────────────────
  // DEVICE CAPABILITIES & LIVE HYBRID INPUT ENGINE (v323)
  // (matchMedia, maxTouchPoints, Coalesced Pointer Events, Lerp)
  // ─────────────────────────────────────────────────────────────
  let deviceInputMode = 'mouse'; // 'mouse' | 'touch'
  let isPointerDown = false;
  let precisionMode = true; // Relative trackpad movement on touch
  let touchGuidePos = { x: -9999, y: -9999, active: false };
  let targetCatcherX = 0.5;
  let currentCatcherX = 0.5;
  let lastTouchClientX = 0;
  let lastTouchClientY = 0;
  let invulnerabilityTimer = 0;

  function detectDeviceCapabilities() {
    const isCoarse = window.matchMedia && (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches
    );
    const hasTouch = (navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
    setDeviceMode(isCoarse || hasTouch ? 'touch' : 'mouse');
  }

  function setDeviceMode(mode) {
    if (deviceInputMode === mode) return;
    deviceInputMode = mode;
    document.body.classList.remove('mode-mouse', 'mode-touch');
    document.body.classList.add(`mode-${mode}`);
    updateTargetText();
  }

  function updateTargetText() {
    const sub = document.getElementById('cgGameSub');
    if (!sub) return;
    const isTouch = deviceInputMode === 'touch';
    const targetHint = isTouch
      ? 'DRAG TO ALIGN CHROME CORE · INTERCEPT CELESTIAL FLUX NODES'
      : 'ALIGN CHROME CORE WITH CURSOR · INTERCEPT CELESTIAL FLUX NODES';
    sub.setAttribute('data-device-hint', targetHint);
  }

  window.addEventListener('resize', detectDeviceCapabilities);
  if (window.matchMedia) {
    const mPointer = window.matchMedia('(pointer: fine)');
    if (mPointer.addEventListener) {
      mPointer.addEventListener('change', detectDeviceCapabilities);
    }
  }

  function initDOM() {
    dom = {
      modal: document.getElementById('chromeGameModal'),
      btnClose: document.getElementById('cgCloseBtn'),
      btnFullscreen: document.getElementById('cgFullscreenBtn'),
      btnMute: document.getElementById('cgMuteBtn'),
      tierVal: document.getElementById('cgTierVal'),
      pulseVal: document.getElementById('cgPulseVal'),
      pulsePill: document.getElementById('cgPulsePill'),
      phaseVal: document.getElementById('cgPhaseVal'),
      phasePill: document.getElementById('cgPhasePill'),
      scoreVal: document.getElementById('cgScoreVal'),
      comboVal: document.getElementById('cgComboVal'),
      bestVal: document.getElementById('cgBestVal'),
      gameTitle: document.getElementById('cgGameTitle'),
      gameSub: document.getElementById('cgGameSub'),

      // Game Views
      viewMath: document.getElementById('cgViewMath'),
      viewReflex: document.getElementById('cgViewReflex'),
      viewMemory: document.getElementById('cgViewMemory'),
      canvasReflex: document.getElementById('cgCanvasReflex'),

      // Math View Elements
      mathLevelTabs: document.querySelectorAll('.math-level-tab'),
      mathProgressLabel: document.getElementById('mathProgressLabel'),
      mathShields: document.getElementById('mathShields'),
      mathEquation: document.getElementById('mathEquation'),
      mathTimeBar: document.getElementById('mathTimeBar'),
      mathOptions: document.querySelectorAll('.math-opt-btn'),

      // Reflex View Elements
      reflexShields: document.getElementById('reflexShields'),
      transmuteIndicator: document.getElementById('transmuteIndicator'),
      reflexMultiplePicker: document.getElementById('reflexMultiplePicker'),
      reflexDigitBtns: document.querySelectorAll('#reflexDigitBtns .digit-pill'),
      reflexStartOverlay: document.getElementById('reflexStartOverlay'),
      reflexStartDigitsGrid: document.getElementById('reflexStartDigitsGrid'),
      btnChangeDivisor: document.getElementById('btnChangeDivisor'),

      // Memory View Elements
      memoryRoundLabel: document.getElementById('memoryRoundLabel'),
      memoryGrid: document.getElementById('memoryGrid'),

      // Overlays
      screenOverlay: document.getElementById('cgScreenOverlay'),
      screenTitle: document.getElementById('cgScreenTitle'),
      screenDesc: document.getElementById('cgScreenDesc'),
      btnStartAction: document.getElementById('cgBtnStartAction')
    };
  }

  // --- Fullscreen Manager ---
  function toggleAppFullscreen() {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }

  // --- Game Modal Launch & Lifecycle for all 6 Games ---
  function openGame(type = 'math') {
    initDOM();
    if (!dom.modal) return;

    state.gameType = type;
    document.body.classList.add('arcade-active');
    dom.modal.classList.add('active');
    dom.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Activate the corresponding view
    if (dom.viewMath) dom.viewMath.style.display = type === 'math' ? 'flex' : 'none';
    if (dom.viewReflex) dom.viewReflex.style.display = (type === 'reflex' || type === 'realm' || type === 'dynamo' || type === 'helix' || type === 'meteor') ? 'flex' : 'none';
    if (dom.viewMemory) dom.viewMemory.style.display = type === 'memory' ? 'flex' : 'none';

    // Toggle Reflex Numbers Picker vs Transmute Indicator
    const picker = document.getElementById('reflexMultiplePicker');
    const badge = document.getElementById('transmuteIndicator');
    if (picker) picker.style.display = type === 'reflex' ? 'flex' : 'none';
    if (badge) badge.style.display = (type === 'realm' || type === 'dynamo' || type === 'helix' || type === 'meteor') ? 'block' : 'none';

    updateHeaderUI();
    startGame(type);
  }

  function closeGame() {
    state.active = false;
    document.body.classList.remove('arcade-active');
    clearInterval(state.mathTimer);
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (dom.modal) {
      dom.modal.classList.remove('active');
      dom.modal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  function updateHeaderUI() {
    if (!dom.gameTitle) return;

    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      dom.gameTitle.textContent = 'CHROME DYNAMO';
      dom.gameSub.textContent = `Faraday Singularity Core · Plasma Orbs · Tesla Wavepacket Hull · Wave ${state.currentWave}`;
    } else if (state.gameType === 'helix') {
      dom.gameTitle.textContent = 'CHROME HELIX';
      dom.gameSub.textContent = `Harmonic Bio-Lattice Core · Nucleotide Pearls · 3D Aurora Ribbon · Wave ${state.currentWave}`;
    } else if (state.gameType === 'meteor') {
      dom.gameTitle.textContent = 'CHROME METEOR';
      dom.gameSub.textContent = `Aegis Caldera Core · Molten Bolides · Supersonic Combustion Trail · Wave ${state.currentWave}`;
    } else if (state.gameType === 'reflex') {
      dom.gameTitle.textContent = 'REFLEX BLITZ';
      dom.gameSub.textContent = state.isChoosingMultiple ? 'Choose a Divisor (1 to 9) to Begin' : `Numbers Multiple Catcher · Catch 2-Digit Multiples of ${state.targetMultiple || 7}`;
    } else if (state.gameType === 'math') {
      dom.gameTitle.textContent = 'MATH OVERDRIVE';
      dom.gameSub.textContent = `Level ${state.mathLevel} · 20 Questions · 10 Mistakes Max`;
    } else if (state.gameType === 'memory') {
      dom.gameTitle.textContent = 'MEMORY MATRIX';
      dom.gameSub.textContent = '16 Radiant Pure Numbers · Sequence Reproduction (1 Mistake = Game Over)';
    }

    if (dom.scoreVal) dom.scoreVal.textContent = state.score.toLocaleString();
    if (dom.comboVal) dom.comboVal.textContent = `${state.combo}x`;
    if (dom.bestVal) dom.bestVal.textContent = (state.bestScores[state.gameType] || 0).toLocaleString();

    // Advanced HUD: Tier, Pulse & Phase
    if (dom.tierVal) {
      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
    }
    if (dom.pulseVal) {
      dom.pulseVal.textContent = state.isPulseReady ? 'READY!' : `${Math.min(100, Math.floor(state.pulseMeter || 0))}%`;
      dom.pulseVal.style.color = state.isPulseReady ? '#fef08a' : '#94a3b8';
    }
    if (dom.pulsePill) {
      dom.pulsePill.classList.toggle('pulse-ready', !!state.isPulseReady);
    }
    if (dom.phaseVal) {
      dom.phaseVal.textContent = state.corePhase === 'alpha' ? 'α' : 'β';
    }
    if (dom.phasePill) {
      dom.phasePill.classList.toggle('phase-alpha', state.corePhase === 'alpha');
      dom.phasePill.classList.toggle('phase-beta', state.corePhase === 'beta');
    }
  }

  function startGame(type) {
    state.active = true;
    state.score = 0;
    state.combo = 1;
    updateHeaderUI();

    if (dom.screenOverlay) dom.screenOverlay.style.display = 'none';

    if (type === 'math') {
      startMathGame();
    } else if (type === 'memory') {
      startMemoryGame();
    } else {
      // type is 'realm', 'helix', 'meteor', or 'reflex'
      startReflexGame();
    }
  }

  function handleGameOver(title, desc) {
    state.active = false;
    clearInterval(state.mathTimer);
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // Save best score
    if (state.score > (state.bestScores[state.gameType] || 0)) {
      state.bestScores[state.gameType] = state.score;
      localStorage.setItem(`oc_best_${state.gameType}`, state.score.toString());
      audio.playVictoryFanfare();
    }

    updateHeaderUI();

    if (dom.screenOverlay) {
      dom.screenTitle.textContent = title;
      dom.screenDesc.textContent = desc;
      dom.screenOverlay.style.display = 'flex';
      dom.btnStartAction.textContent = 'RE-ENGAGE (TRY AGAIN)';
      dom.btnStartAction.onclick = () => startGame(state.gameType);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 1: MATH OVERDRIVE
  // ══════════════════════════════════════════════════════════════════════════
  function startMathGame() {
    state.mathQuestions = MathEngine.generateLevelSet(state.mathLevel);
    state.mathQIdx = 0;
    state.mathMistakes = 0;
    renderMathShields();
    loadMathQuestion();
  }

  function renderMathShields() {
    if (!dom.mathShields) return;
    dom.mathShields.innerHTML = '';
    const remaining = 10 - state.mathMistakes;
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('span');
      cell.className = `shield-cell ${i < remaining ? 'shield-on' : 'shield-lost'}`;
      dom.mathShields.appendChild(cell);
    }
  }

  function loadMathQuestion() {
    if (state.mathQIdx >= state.mathQuestions.length) {
      handleGameOver('SIMULATION COMPLETE!', `Flawless Mastery! Final Score: ${state.score.toLocaleString()} points with ${10 - state.mathMistakes} shields intact.`);
      return;
    }

    const q = state.mathQuestions[state.mathQIdx];
    if (dom.mathProgressLabel) dom.mathProgressLabel.textContent = `QUESTION ${state.mathQIdx + 1} / 20`;
    if (dom.mathEquation) dom.mathEquation.textContent = `${q.a} ${q.op} ${q.b} = ?`;

    // Populate 4 choice buttons
    const choices = q.choices || q.options || [];
    dom.mathOptions.forEach((btn, idx) => {
      const val = choices[idx] !== undefined ? choices[idx] : 0;
      btn.dataset.ans = val;
      const valSpan = btn.querySelector('.opt-val');
      if (valSpan) valSpan.textContent = val;
      btn.className = 'math-opt-btn';
    });

    startMathTimer();
  }

  function startMathTimer() {
    clearInterval(state.mathTimer);
    state.mathTimeLeft = 100;
    if (dom.mathTimeBar) dom.mathTimeBar.style.width = '100%';

    const speedMs = 70; // ~7 seconds per question
    state.mathTimer = setInterval(() => {
      state.mathTimeLeft -= 1.2;
      if (dom.mathTimeBar) dom.mathTimeBar.style.width = `${Math.max(0, state.mathTimeLeft)}%`;

      if (state.mathTimeLeft <= 0) {
        clearInterval(state.mathTimer);
        handleMathMistake(null, true);
      }
    }, speedMs);
  }

  function handleMathChoice(selectedVal, btnElem) {
    if (!state.active || state.gameType !== 'math') return;
    clearInterval(state.mathTimer);

    const q = state.mathQuestions[state.mathQIdx];
    if (parseInt(selectedVal, 10) === q.ans) {
      // Correct!
      state.score += 200 * state.combo;
      state.combo = Math.min(10, state.combo + 1);
      audio.playCorrectChime(state.combo);
      if (btnElem) btnElem.classList.add('correct');
      updateHeaderUI();

      setTimeout(() => {
        state.mathQIdx++;
        loadMathQuestion();
      }, 350);
    } else {
      // Incorrect!
      handleMathMistake(btnElem, false);
    }
  }

  function handleMathMistake(btnElem, isTimeout = false) {
    state.mathMistakes++;
    state.combo = 1;
    audio.playMistakeBuzzer();
    if (btnElem) btnElem.classList.add('wrong');
    renderMathShields();
    updateHeaderUI();

    if (state.mathMistakes >= 10) {
      handleGameOver('NEURAL OVERLOAD (10 STRIKES)', `Shields collapsed on Level ${state.mathLevel}, Q${state.mathQIdx + 1}. Final Score: ${state.score.toLocaleString()}`);
    } else {
      setTimeout(() => {
        state.mathQIdx++;
        loadMathQuestion();
      }, 500);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DEDICATED ARENA ENGINE: CHROME DYNAMO, CHROME HELIX, CHROME METEOR & REFLEX BLITZ
  // ══════════════════════════════════════════════════════════════════════════
  function startReflexGame() {
    state.reflexLives = 10;
    state.catcherX = 0.5;
    state.lastTransmuteTime = performance.now();
    state.particles = [];
    state.floatingTexts = [];
    state.absorptionEffects = [];
    state.ambientField = [];

    // Session Opening Choreography & Advanced Mechanics
    state.gameStartTime = performance.now();
    state.totalNodesSpawned = 0;
    state.lastSpawnTime = 0;
    state.isOverdrive = false;
    state.overdriveEndTime = 0;
    state.prevCatcherPixelX = null;
    state.catcherVelocity = 0;
    state.lastLoopTimestamp = 0;

    // The 5 Advanced Features State
    state.coreTier = 1; // Tier I, II, III
    state.consecutivePerfects = 0;
    state.pulseMeter = 0; // 0 to 100
    state.isPulseReady = false;
    state.corePhase = 'alpha'; // 'alpha' (cyan) or 'beta' (amber/magenta)
    state.resonanceChain = 0;

    state.currentWave = 1;
    CoreKinematics.reset();
    MeteorVFXEngine.init();

    // Set designated catcher type per game mode
    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      state.catcherType = 'dynamo';
    } else if (state.gameType === 'helix') {
      state.catcherType = 'helix';
    } else if (state.gameType === 'meteor') {
      state.catcherType = 'meteor';
    } else {
      state.catcherType = 'dynamo';
    }

    const picker = document.getElementById('reflexMultiplePicker');
    const badge = document.getElementById('transmuteIndicator');
    const startOverlay = document.getElementById('reflexStartOverlay');

    if (state.gameType === 'reflex') {
      if (picker) picker.style.display = 'flex';
      if (badge) badge.style.display = 'none';
      // Prompt player to choose 1, 2, 3, 4, 5, 6, 7, 8, 9 FIRST
      state.isChoosingMultiple = true;
      if (startOverlay) startOverlay.style.display = 'flex';
      updateHeaderUI();
    } else {
      if (picker) picker.style.display = 'none';
      if (badge) badge.style.display = 'block';
      if (startOverlay) startOverlay.style.display = 'none';
      state.isChoosingMultiple = false;
    }

    renderReflexShields();
    updateTransmuteIndicator();
    resizeCanvas();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(reflexGameLoop);
  }

  function renderReflexShields() {
    if (!dom.reflexShields) return;
    dom.reflexShields.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('span');
      cell.className = `shield-cell ${i < state.reflexLives ? 'shield-on' : 'shield-lost'}`;
      dom.reflexShields.appendChild(cell);
    }
  }

  function updateTransmuteIndicator() {
    if (!dom.transmuteIndicator) return;
    const labels = {
      dynamo: '⚡ FARADAY SINGULARITY CORE · Capture Plasma Orbs!',
      realm: '⚡ FARADAY SINGULARITY CORE · Capture Plasma Orbs!',
      helix: '🧬 HARMONIC BIO-LATTICE CORE · Harmonize Nucleotide Pearls!',
      meteor: '☄️ AEGIS CALDERA CORE · Deflect Molten Bolides!'
    };

    if (state.gameType === 'reflex') {
      const reflexMorphLabels = {
        realm: '⚡ CORE TRANSMUTED: CHROME DYNAMO (Catch Synapse Waves!)',
        dynamo: '⚡ CORE TRANSMUTED: CHROME DYNAMO (Catch Synapse Waves!)',
        helix: '⚡ CORE TRANSMUTED: CHROME HELIX (Catch Dual-Strands!)',
        meteor: '⚡ CORE TRANSMUTED: CHROME METEOR (Deflect Molten Asteroids!)'
      };
      dom.transmuteIndicator.textContent = reflexMorphLabels[state.catcherType];
    } else {
      dom.transmuteIndicator.textContent = labels[state.catcherType] || labels.realm;
    }
    dom.transmuteIndicator.className = `transmute-badge transmute-${state.catcherType}`;
  }

  function resizeCanvas() {
    if (!dom.canvasReflex) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = dom.canvasReflex.getBoundingClientRect();
    const w = rect.width > 0 ? rect.width : window.innerWidth;
    const h = rect.height > 0 ? rect.height : (window.innerHeight - 56);
    dom.canvasReflex.width = Math.floor(w * dpr);
    dom.canvasReflex.height = Math.floor(h * dpr);
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || (state.gameType !== 'reflex' && state.gameType !== 'realm' && state.gameType !== 'dynamo' && state.gameType !== 'helix' && state.gameType !== 'meteor')) return;

    const ctx = dom.canvasReflex?.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dom.canvasReflex.width / dpr;
    const h = dom.canvasReflex.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Subtle Grid Background
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Smooth Linear Interpolation (Lerp) with Mode-Specific Kinematics:
    // - Dynamo: Snappy, agile electromagnetic tracking (0.44 touch / 0.28 mouse)
    // - Helix: Fluid harmonic gliding with gyroscopic banking tilt (0.36 touch / 0.22 mouse)
    // - Meteor: Substantial volcanic inertia and high-momentum weight (0.30 touch / 0.18 mouse)
    // Immediate Capture Center Tracking:
    // The capture center tracks pointer/hand input immediately so catches stay razor-sharp,
    // while CoreKinematics drives body banking, wing root lag, and outer feather momentum whip!
    currentCatcherX += (targetCatcherX - currentCatcherX) * 0.86;
    state.catcherX = currentCatcherX;

    let catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
    if (state.prevCatcherPixelX !== null) {
      state.catcherVelocity = catcherPixelX - state.prevCatcherPixelX;
    }
    state.prevCatcherPixelX = catcherPixelX;
    
    // Cellphone & Mobile Safe-Area Inset:
    // On cellphones and touchscreens, lift catcher up to 135px above bottom
    // so the entire 3D core and flare rings are 100% visible and thumb sits comfortably below!
    const isCoarse = (deviceInputMode === 'touch') || window.innerWidth <= 768;
    const bottomSafe = (window.innerHeight > 800) ? 34 : 20;
    // Elevate catcher comfortably: 22% of screen height (or at least 185px) on touch/mobile
    const catcherBottomMargin = isCoarse ? Math.max(185, Math.round(h * 0.22)) : 105;
    const catcherPixelY = h - catcherBottomMargin;

    // ─────────────────────────────────────────────────────────────
    // MODE A: REFLEX BLITZ — NUMBERS MULTIPLE CATCHER
    // ─────────────────────────────────────────────────────────────
    if (state.gameType === 'reflex') {
      const D = state.targetMultiple || 7;

      // If player is still choosing number (1-9), do not spawn numbers yet
      if (state.isChoosingMultiple) {
        // Draw bottom track and waiting paddle
        ctx.save();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, catcherPixelY);
        ctx.lineTo(w - 30, catcherPixelY);
        ctx.stroke();

        ctx.font = '800 13px "Lexend", sans-serif';
        ctx.fillStyle = '#a855f7';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ SELECT A MULTIPLE (1 — 9) TO BEGIN', w / 2, h / 2);
        ctx.restore();

        ctx.restore();
        animFrameId = requestAnimationFrame(reflexGameLoop);
        return;
      }

      // Player has chosen! THEN numbers will fall (2-digit numbers 10 to 99)
      // Spawn falling 2-digit numbers
      if (Math.random() < 0.045) {
        let num;
        // 45% chance: valid 2-digit multiple of D
        if (Math.random() < 0.45) {
          const minK = Math.max(2, Math.ceil(10 / D));
          const maxK = Math.floor(99 / D);
          if (maxK >= minK) {
            const k = Math.floor(Math.random() * (maxK - minK + 1)) + minK;
            num = k * D;
          } else {
            num = D * 2;
          }
        } else {
          // 55% chance: non-multiple 2-digit number (10 to 99)
          let attempts = 0;
          do {
            num = Math.floor(Math.random() * 90) + 10;
            attempts++;
          } while (num % D === 0 && attempts < 25);
          if (num % D === 0) num = num === 99 ? 98 : num + 1;
        }

        const px = Math.random() * (w - 130) + 65;
        const speed = 2.8 + Math.random() * 2.4;
        state.particles.push({
          isNumber: true,
          num: num,
          x: px,
          y: -40,
          speed: speed,
          stardust: []
        });
      }

      // Draw Futuristic Catcher Paddle for Reflex Numbers
      ctx.save();
      // Glowing bottom track
      ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, catcherPixelY);
      ctx.lineTo(w - 30, catcherPixelY);
      ctx.stroke();

      // Catcher Energy Field
      const paddleW = 120;
      const paddleH = 26;
      const paddleX = catcherPixelX - paddleW / 2;
      const paddleY = catcherPixelY - paddleH / 2;

      // Outer Glow
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(paddleX, paddleY, paddleW, paddleH, 13);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
      ctx.fill();

      // Core Glass Paddle
      ctx.beginPath();
      ctx.roundRect(paddleX + 2, paddleY + 2, paddleW - 4, paddleH - 4, 11);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#c084fc';
      ctx.stroke();

      // Target Multiple Indicator on Paddle
      ctx.shadowBlur = 0;
      ctx.font = '800 11px "Lexend", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`CATCH MULTIPLES OF ${D}`, catcherPixelX, catcherPixelY);
      ctx.restore();

      // Update & Render Falling 2-Digit Numbers
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.y += p.speed;

        // Render 2-digit number capsule
        ctx.save();
        ctx.translate(p.x, p.y);

        // Cyber Capsule Outer Glow
        const capsuleW = 58;
        const capsuleH = 38;
        ctx.shadowColor = (p.num % D === 0) ? '#38bdf8' : '#a855f7';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(-capsuleW / 2, -capsuleH / 2, capsuleW, capsuleH, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = (p.num % D === 0) ? '#38bdf8' : 'rgba(192, 132, 252, 0.7)';
        ctx.stroke();

        // 2-Digit Number Text
        ctx.shadowBlur = 0;
        ctx.font = '800 21px "Lexend", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.num.toString(), 0, 1);
        ctx.restore();

        // Collision Check with Catcher
        const hitX = Math.abs(p.x - catcherPixelX) < (paddleW / 2 + 10);
        const hitY = Math.abs(p.y - catcherPixelY) < (paddleH / 2 + 15);

        if (hitX && hitY) {
          const isMultiple = (p.num % D === 0);
          if (isMultiple) {
            // CORRECT CATCH!
            state.score += 150 * state.combo;
            state.combo = Math.min(10, state.combo + 1);
            audio.playCorrectChime(state.combo);
            state.floatingTexts.push({
              text: `+${150 * (state.combo - 1)} [MULTIPLE OF ${D}!]`,
              x: p.x,
              y: catcherPixelY - 35,
              color: '#34d399',
              alpha: 1.0,
              vy: -1.6
            });
          } else {
            // MISTAKE! Caught non-multiple
            state.reflexLives--;
            state.combo = 1;
            audio.playMistakeBuzzer();
            state.floatingTexts.push({
              text: `STRIKE! ${p.num} is NOT a multiple of ${D}!`,
              x: p.x,
              y: catcherPixelY - 35,
              color: '#f87171',
              alpha: 1.0,
              vy: -1.6
            });
            renderReflexShields();

            if (state.reflexLives <= 0) {
              handleGameOver('SHIELDS DEPLETED', `Caught non-multiple numbers. Final Score: ${state.score.toLocaleString()} points.`);
              ctx.restore();
              return;
            }
          }
          state.particles.splice(i, 1);
          updateHeaderUI();
          continue;
        }

        // Screen Exit (Past Bottom)
        if (p.y > h + 50) {
          const wasMultiple = (p.num % D === 0);
          if (wasMultiple) {
            // Player MISSED a valid multiple!
            state.reflexLives--;
            state.combo = 1;
            audio.playMistakeBuzzer();
            state.floatingTexts.push({
              text: `MISSED MULTIPLE: ${p.num}!`,
              x: Math.max(70, Math.min(w - 70, p.x)),
              y: h - 80,
              color: '#f87171',
              alpha: 1.0,
              vy: -1.2
            });
            renderReflexShields();

            if (state.reflexLives <= 0) {
              handleGameOver('SHIELDS DEPLETED', `Missed valid multiples of ${D}. Final Score: ${state.score.toLocaleString()} points.`);
              ctx.restore();
              return;
            }
          }
          // Non-multiples despawn safely with no penalty!
          state.particles.splice(i, 1);
          updateHeaderUI();
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // MODE B: CHROME DYNAMO, CHROME HELIX, CHROME METEOR (5 TOP-TIER SYSTEMS)
    // ─────────────────────────────────────────────────────────────
    else {
      const now = timestamp;
      // FOUNDATION FIX: Delta-Time Normalization across all screens & frame rates
      const dt = state.lastLoopTimestamp ? Math.min(64, now - state.lastLoopTimestamp) : 16.67;
      state.lastLoopTimestamp = now;
      const dtScale = dt / 16.67;

      const elapsedSec = (now - state.gameStartTime) / 1000;
      const normFactor = Math.max(0.70, Math.min(1.20, h / 800));

      // Calculate Core Evolution Tier (Tier I: 1-3x, Tier II: 4-6x, Tier III: 7-9x, Tier IV: 10x+ Sovereign Overdrive)
      if (state.combo >= 10) {
        state.coreTier = 4;
        state.isOverdrive = true;
      } else if (state.combo >= 7) {
        state.coreTier = 3;
        state.isOverdrive = false;
      } else if (state.combo >= 4) {
        state.coreTier = 2;
        state.isOverdrive = false;
      } else {
        state.coreTier = 1;
        state.isOverdrive = false;
      }

      // ─────────────────────────────────────────────────────────────
      // FEATURE 1: FLUX NODE CLASSES SPAWN CHOREOGRAPHY
      // ─────────────────────────────────────────────────────────────
      function pickFairLaneX() {
        const margin = 70;
        const minSeparation = 72;
        let bestX = Math.random() * (w - margin * 2) + margin;
        for (let att = 0; att < 16; att++) {
          const candidateX = Math.random() * (w - margin * 2) + margin;
          const isClear = state.particles.every(pt => {
            if (pt.y < 380) return Math.abs(pt.x - candidateX) >= minSeparation;
            return true;
          });
          if (isClear) return candidateX;
        }
        return bestX;
      }

      function spawnNode(baseSpeed) {
        let pType = (state.gameType === 'realm') ? 'dynamo' : state.gameType;
        const actualSpeed = baseSpeed * normFactor;

        // Pure Node & Hazard Selection (100% faithful to uploaded images: standard nodes + 1 distinct hazard on the right)
        const hasActiveHazard = state.particles.some(pt => pt.nodeClass === 'volatile');
        let nClass = 'standard';
        let px = pickFairLaneX();

        if (!hasActiveHazard && elapsedSec > 2.5 && Math.random() < 0.28) {
          nClass = 'volatile'; // Distinct Hazard to avoid on the right!
          px = w * (0.74 + Math.random() * 0.14);
        } else {
          // Keep standard nodes comfortably spaced across the main playfield
          px = Math.min(w * 0.72, pickFairLaneX());
        }

        // Energy Phase: Alpha (Cyan) or Beta (Amber/Magenta)
        const phase = Math.random() < 0.5 ? 'alpha' : 'beta';

        const p = {
          type: pType,
          nodeClass: nClass,
          phase: phase,
          x: px,
          y: -48,
          vx: 0,
          speed: actualSpeed,
          baseSpeed: baseSpeed,
          headR: nClass === 'prime' ? 29.0 : 26.0,
          hasSplit: false,
          phantomAlpha: 1.0,
          animPhase: Math.random() * Math.PI * 2,
          tumbleDir: Math.random() < 0.5 ? 1 : -1,
          spine: [],
          stardust: []
        };
        for (let j = 0; j < 8; j++) {
          p.spine.push({ x: px, y: -48 - j * 8.5 });
        }
        state.particles.push(p);
        state.totalNodesSpawned++;
        state.lastSpawnTime = now;
      }

      // Immediate spawn at t = 0s:
      if (state.totalNodesSpawned === 0) {
        spawnNode(2.45);
      }

      // Opening 15-Second Choreography Engine:
      let shouldSpawn = false;
      let nextBaseSpeed = 2.45;

      if (elapsedSec < 5.0) {
        const interval = 680;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 3 && state.totalNodesSpawned < 7) {
          shouldSpawn = true;
          nextBaseSpeed = 2.40 + Math.random() * 0.40;
        }
      } else if (elapsedSec < 10.0) {
        const interval = 540;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 4 && state.totalNodesSpawned < 15) {
          shouldSpawn = true;
          nextBaseSpeed = 2.85 + Math.random() * 0.45;
        }
      } else if (elapsedSec < 15.0) {
        const isPairBurst = (state.totalNodesSpawned % 3 !== 0);
        const interval = isPairBurst ? 320 : 850;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 4 && state.totalNodesSpawned < 22) {
          shouldSpawn = true;
          nextBaseSpeed = 3.10 + Math.random() * 0.45;
        }
      } else {
        const calculatedWave = Math.min(10, Math.floor(state.score / 1200) + 1);
        if (calculatedWave > state.currentWave) {
          state.currentWave = calculatedWave;
          audio.playVictoryFanfare();
          // Wave acceleration shown cleanly in header HUD without floating text clutter
          updateHeaderUI();
        }

        const maxConcurrent = Math.min(5, 3 + Math.floor(state.currentWave / 2));
        const waveInterval = Math.max(380, 650 - (state.currentWave - 1) * 45);
        if ((now - state.lastSpawnTime) >= waveInterval && state.particles.length < maxConcurrent) {
          shouldSpawn = true;
          nextBaseSpeed = 2.60 + (state.currentWave - 1) * 0.22 + Math.random() * 0.35;
        }
      }

      if (shouldSpawn) {
        spawnNode(nextBaseSpeed);
      }

      // Check if any non-volatile node is inside the magnetic horizon for Iris Lock-On
      const tierHitBonusPre = (state.coreTier - 1) * 12;
      const gravRadiusPre = 130 + tierHitBonusPre;
      const isCoreLockedOn = state.particles.some(pt => pt.nodeClass !== 'volatile' && Math.hypot(catcherPixelX - pt.x, catcherPixelY - pt.y) < gravRadiusPre);

      // ─────────────────────────────────────────────────────────────
      // OPTIONAL LIVE SHOWCASE RECORDER (?capture=1)
      // Automatically executes the choreographed test (2s still, sweep left,
      // reverse sharply right, capture node + hazard passing nearby) & streams frames
      // ─────────────────────────────────────────────────────────────
      if (window.location.search.includes('capture=1')) {
        state.combo = 10;
        state.coreTier = 4;
        state.isOverdrive = true;
        state.reflexLives = 10;
        const modeName = (state.catcherType === 'realm') ? 'dynamo' : state.catcherType;
        if (!state._capState || state._capState.mode !== modeName) {
          CoreKinematics.reset();
          state._capState = {
            mode: modeName,
            startTime: now,
            frameIdx: 0,
            lastFrameSent: 0,
            done: false,
            offCanvas: document.createElement('canvas')
          };
          state._capState.offCanvas.width = 688;
          state._capState.offCanvas.height = 384;
          updateHeaderUI();

          // Seed deterministic showcase nodes + nearby right-lane hazard
          state.particles = [
            {
              type: modeName, nodeClass: 'standard', phase: 'alpha',
              x: w * 0.18, y: 55, vx: 0, speed: 1.55, baseSpeed: 1.55,
              headR: 26, hasSplit: false, phantomAlpha: 1.0,
              animPhase: 0.2, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              type: modeName, nodeClass: 'standard', phase: 'beta',
              x: w * 0.34, y: 15, vx: 0, speed: 1.60, baseSpeed: 1.60,
              headR: 26, hasSplit: false, phantomAlpha: 1.0,
              animPhase: 2.4, tumbleDir: -1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              // Target capture node at x = 0.64 * w: arrives at catcherPixelY - 78 right at t = 3.45s (Frame 62)!
              type: modeName, nodeClass: 'standard', phase: 'alpha',
              x: w * 0.64, y: (catcherPixelY - 78) - 2.20 * (3.45 * 60), vx: 0, speed: 2.20, baseSpeed: 2.20,
              headR: 26, hasSplit: false, phantomAlpha: 1.0,
              animPhase: 4.5, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              // Nearby right-lane hazard at x = 0.85 * w passing right beside the catcher during t = 3.0s..4.2s
              type: modeName, nodeClass: 'volatile', phase: 'beta',
              x: w * 0.85, y: (catcherPixelY - 20) - 2.10 * (3.65 * 60), vx: 0, speed: 2.10, baseSpeed: 2.10,
              headR: 26, hasSplit: false, phantomAlpha: 1.0,
              animPhase: 1.3, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            }
          ];
          state.lastSpawnTime = now + 12000;
        }

        const cs = state._capState;
        if (!cs.done) {
          const tCap = (now - cs.startTime) / 1000.0;
          if (tCap < 2.0) {
            // 0.0s .. 2.0s: Hold catcher completely still at x = 0.45 for 2 full seconds
            targetCatcherX = 0.45;
            currentCatcherX = 0.45;
          } else if (tCap < 2.65) {
            // 2.0s .. 2.65s: Sweep left (0.45 -> 0.22)
            const pLeft = (tCap - 2.0) / 0.65;
            const ease = 0.5 - 0.5 * Math.cos(pLeft * Math.PI);
            targetCatcherX = 0.45 - 0.23 * ease;
          } else if (tCap < 3.25) {
            // 2.65s .. 3.25s: Reverse sharply to the right (0.22 -> 0.64)
            const pRight = (tCap - 2.65) / 0.60;
            const ease = 1.0 - Math.pow(1.0 - pRight, 2.6);
            targetCatcherX = 0.22 + 0.42 * ease;
          } else {
            // 3.25s .. 4.30s: Hold at x = 0.64 for node capture & impact VFX + nearby hazard pass at x = 0.85
            targetCatcherX = 0.64;
          }
          currentCatcherX += (targetCatcherX - currentCatcherX) * 0.86;
          state.catcherX = currentCatcherX;
          catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
        }
      }

      // ─────────────────────────────────────────────────────────────
      // UPDATE ARTICULATED WING & CORE KINEMATICS + WORLD SPEED STREAKS
      // ─────────────────────────────────────────────────────────────
      CoreKinematics.update(catcherPixelX, dtScale, now);
      CoreKinematics.updateAndDrawWorldStreaks(ctx, dtScale);

      // ─────────────────────────────────────────────────────────────
      // DRAW LAYERED CHROME CORE WITH INDEPENDENT INTERNAL ANIMATION
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      if (state.catcherType === 'helix') {
        QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier, state.corePhase, state.isOverdrive, isCoreLockedOn);
      } else if (state.catcherType === 'dynamo' || state.catcherType === 'realm') {
        QuantumRenderer.drawDynamoCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier, state.corePhase, state.isOverdrive, isCoreLockedOn);
      } else {
        QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier, state.corePhase, state.isOverdrive, isCoreLockedOn);
      }
      ctx.restore();

      // ─────────────────────────────────────────────────────────────
      // FEATURE 4: FLUX PULSE EXPANDING FULL-SCREEN SHOCKWAVE
      // ─────────────────────────────────────────────────────────────
      if (state.activeFluxPulse) {
        const fp = state.activeFluxPulse;
        fp.radius += 18 * dtScale;
        fp.alpha -= 0.035 * dtScale;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = fp.color;
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        if (fp.alpha <= 0 || fp.radius > Math.max(w, h) * 1.2) {
          state.activeFluxPulse = null;
        }
      }

      // ─────────────────────────────────────────────────────────────
      // UPDATE & RENDER CELESTIAL FLUX NODES
      // ─────────────────────────────────────────────────────────────
      // Effective capture hitRadius (scales with Tier: Tier I=54/80, Tier II=+12px, Tier III=+24px)
      const tierHitBonus = (state.coreTier - 1) * 12;
      const hitRadius = ((deviceInputMode === 'touch') ? 80 : 54) + tierHitBonus;
      const innerSweetSpotRadius = hitRadius * 0.40; // Precision Center Catch sweet spot
      const gravRadius = 130 + tierHitBonus;

      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];

        // FEATURE 1: Splitter Node logic (splits at 42% height)
        if (p.nodeClass === 'splitter' && !p.hasSplit && p.y > h * 0.42) {
          p.hasSplit = true;
          // Spawn twin daughter node
          const daughter = {
            type: p.type,
            nodeClass: 'standard',
            phase: p.phase === 'alpha' ? 'beta' : 'alpha',
            x: p.x + 24,
            y: p.y,
            vx: 1.6,
            speed: p.speed,
            baseSpeed: p.baseSpeed,
            headR: 24.0,
            hasSplit: true,
            phantomAlpha: 1.0,
            spine: [],
            stardust: []
          };
          for (let j = 0; j < 8; j++) daughter.spine.push({ x: p.x + 24, y: p.y - j * 8.5 });
          p.vx = -1.6;
          p.x -= 24;
          state.particles.push(daughter);
          audio.playTone(600, 'triangle', 0.15, 0.2);
          // Clean visual mitosis without floating text clutter
        }

        // Apply horizontal splitter velocity
        if (p.vx) {
          p.x += p.vx * dtScale;
          p.vx *= 0.98;
        }

        // FEATURE 4: CHRONOS STASIS (Slows down by 28% inside magnetic tether horizon)
        const dxToCore = catcherPixelX - p.x;
        const dyToCore = catcherPixelY - p.y;
        const distToCore = Math.hypot(dxToCore, dyToCore);

        let speedFactor = 1.0;
        if (distToCore < gravRadius && p.y < catcherPixelY + 20 && p.nodeClass !== 'volatile') {
          // CHRONOS STASIS SLOW: 28% speed reduction so lining up intercept feels earned!
          speedFactor = 0.72;

          // Subtle Gravitational Magnetic Pull
          const gravStrength = (1.0 - (distToCore / gravRadius)) * 0.95;
          p.x += Math.sign(dxToCore) * Math.min(Math.abs(dxToCore) * 0.14, gravStrength * 4.2 * dtScale);

          // Top-Rim Contact Flash as the node makes contact with the Chrome Core (Matches exact reference image!)
          const modeKey = (p.type === 'helix') ? 'helix' : (p.type === 'meteor' ? 'meteor' : 'dynamo');
          QuantumRenderer.drawContactBurst(ctx, (p.x + catcherPixelX) * 0.5, catcherPixelY - 52, modeKey, gravStrength, now);
        }

        // Advance Node using Delta-Time
        p.y += p.speed * dtScale * speedFactor;

        // FEATURE 1: Phantom Flicker Alpha
        if (p.nodeClass === 'phantom') {
          p.phantomAlpha = 0.32 + 0.68 * Math.abs(Math.sin(now * 0.007 + p.x));
        }

        // Update spine IK
        p.spine[0].x = p.x;
        p.spine[0].y = p.y;
        for (let j = 1; j < p.spine.length; j++) {
          p.spine[j].y = p.y - j * 8.5;
          p.spine[j].x = p.x + Math.sin(timestamp * 0.005 + j * 0.6) * (j * 1.1);
        }

        // Render Celestial Flux Node (Bespoke 3D Models handle Prime, Volatile, Splitter & Phantom natively)
        ctx.save();
        if (p.nodeClass === 'phantom') {
          ctx.globalAlpha = p.phantomAlpha;
        }

        if (p.type === 'dynamo' || p.type === 'realm') {
          QuantumRenderer.drawTier3DynamoParticle(ctx, p, timestamp);
        } else if (p.type === 'helix') {
          QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
        } else {
          QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
        }
        ctx.restore();

        // ─────────────────────────────────────────────────────────────
        // COLLISION CHECK, PRECISION CATCH & OFFICIAL MODE CALLOUTS
        // ─────────────────────────────────────────────────────────────
        if (distToCore < hitRadius) {
          // Check if player caught a Volatile Hazard!
          if (p.nodeClass === 'volatile') {
            state.combo = 1;
            state.coreTier = Math.max(1, state.coreTier - 1);
            state.reflexLives--;
            state.consecutivePerfects = 0;
            state.resonanceChain = 0;
            audio.playHazardExplosion();
            renderReflexShields();
            // Clean visual shock & shield update without floating text clutter

            if (state.reflexLives <= 0) {
              const gameNames = { dynamo: 'CHROME DYNAMO', realm: 'CHROME DYNAMO', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
              handleGameOver('SHIELDS DEPLETED', `${gameNames[state.gameType]} session concluded. Final Score: ${state.score.toLocaleString()} points.`);
              ctx.restore();
              return;
            }

            state.particles.splice(i, 1);
            updateHeaderUI();
            continue;
          }

          // Non-Hazard Interception: Precision Catch Evaluation
          const isPerfect = (distToCore <= innerSweetSpotRadius);
          const precisionMultiplier = isPerfect ? 2.0 : 1.0;
          const classMultiplier = (p.nodeClass === 'prime') ? 5.0 : 1.0;

          // FEATURE 5: Phase Resonance Chain
          let chainBonus = 1.0;
          if (p.phase === state.corePhase) {
            state.resonanceChain++;
            chainBonus = 1.0 + Math.min(2.0, state.resonanceChain * 0.2);
          } else {
            state.resonanceChain = 0;
          }

          const basePoints = 300;
          const finalCatchPoints = Math.floor(basePoints * state.combo * precisionMultiplier * classMultiplier * chainBonus);
          state.score += finalCatchPoints;
          const prevCombo = state.combo;
          state.combo = Math.min(10, state.combo + 1);
          if (prevCombo < 10 && state.combo === 10) {
            state.isOverdrive = true;
            state.overdriveEndTime = 0; // Stays active as long as 10x streak is held!
            audio.playOverdriveFanfare();
          }

          // Official Mode-Specific Capture Action Verbs:
          // Dynamo -> CAPTURED, Helix -> HARMONIZED, Meteor -> DEFLECTED
          const modeVerb = (p.type === 'helix') ? 'HARMONIZED' : (p.type === 'meteor' ? 'DEFLECTED' : 'CAPTURED');
          const modeIcon = (p.type === 'helix') ? '🧬' : (p.type === 'meteor' ? '☄️' : '⚡');

          // Perfect Catch Charging Flux Pulse (3 in a row fills meter! Zero floating text lag)
          if (isPerfect) {
            state.consecutivePerfects++;
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 34);
            if (state.pulseMeter >= 100) {
              state.isPulseReady = true;
              audio.playPulseCharged();
            }
            audio.playPerfectCatch(state.combo);
          } else {
            state.consecutivePerfects = 0;
            audio.playGrazeCatch(state.combo);
          }

          // Trigger Mode-Specific Layered Capture Physics (Inward Discharge / Wing Ripple / Shield Recoil + Upward Cinders)
          CoreKinematics.triggerCaptureEffect(p.type, catcherPixelX, catcherPixelY, p.x, p.y, now);

          // Spawn Mode-Signature Kinetic Impact Physics Effect
          state.absorptionEffects.push({
            type: p.type,
            x: catcherPixelX,
            y: catcherPixelY,
            radius: isPerfect ? 18 : 12,
            maxRadius: isPerfect ? 190 : 145,
            isPerfect,
            alpha: 1.0,
            startTime: now
          });

          state.particles.splice(i, 1);
          updateHeaderUI();
          continue;
        }

        // Screen Exit (Past Bottom)
        if (p.y > h + 70) {
          if (p.nodeClass === 'volatile') {
            state.score += 100;
            state.particles.splice(i, 1);
            updateHeaderUI();
            continue;
          }

          state.particles.splice(i, 1);
          state.reflexLives--;
          state.consecutivePerfects = 0;
          state.resonanceChain = 0;

          if (state.coreTier > 1) {
            state.coreTier--;
            const tierFloorCombo = { 1: 1, 2: 4, 3: 7, 4: 10 };
            state.combo = tierFloorCombo[state.coreTier] || 1;
          } else {
            state.combo = 1;
          }
          state.isOverdrive = false;

          audio.playMistakeBuzzer();
          renderReflexShields();

          if (state.reflexLives <= 0) {
            const gameNames = { dynamo: 'CHROME DYNAMO', realm: 'CHROME DYNAMO', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
            handleGameOver('SHIELDS DEPLETED', `${gameNames[state.gameType]} session concluded. Final Score: ${state.score.toLocaleString()} points.`);
            ctx.restore();
            return;
          }
          updateHeaderUI();
        }
      }

      // ─────────────────────────────────────────────────────────────
      // RENDER TOP-RIM CONTACT FLASH ON NODE INTERCEPTION
      // ─────────────────────────────────────────────────────────────
      for (let ab = state.absorptionEffects.length - 1; ab >= 0; ab--) {
        const eff = state.absorptionEffects[ab];
        eff.alpha -= 0.065 * dtScale;
        if (eff.alpha <= 0) {
          state.absorptionEffects.splice(ab, 1);
          continue;
        }
        const modeKey = (eff.type === 'helix') ? 'helix' : (eff.type === 'meteor' ? 'meteor' : 'dynamo');
        QuantumRenderer.drawContactBurst(ctx, catcherPixelX, catcherPixelY - 52, modeKey, eff.alpha * 1.25, now);
      }

      // Stream live showcase frames to local capture server when ?capture=1 is active
      if (state._capState && !state._capState.done && state.coreTier === 4) {
        const cs = state._capState;
        if (!cs.snapshots) cs.snapshots = [];
        if (now - cs.lastFrameSent >= 55 && cs.snapshots.length < 76) {
          cs.lastFrameSent = now;
          const snap = document.createElement('canvas');
          snap.width = 576;
          snap.height = 324;
          const sCtx = snap.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#06080f';
            sCtx.fillRect(0, 0, 576, 324);
            sCtx.drawImage(dom.canvasReflex, 0, 0, 576, 324);
            cs.snapshots.push(snap);
          }
          if (cs.snapshots.length >= 76) {
            cs.done = true;
            const modeToSend = cs.mode;
            const snaps = cs.snapshots;
            (async () => {
              for (let k = 0; k < snaps.length; k++) {
                const dataUrl = snaps[k].toDataURL('image/jpeg', 0.86);
                await fetch('/_save_frame', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ mode: modeToSend, idx: k, dataUrl: dataUrl })
                }).catch(() => {});
              }
            })();
          }
        }
      }
    }

    // Render Floating Texts (Score / Feedback Alerts)
    for (let f = state.floatingTexts.length - 1; f >= 0; f--) {
      const ft = state.floatingTexts[f];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        state.floatingTexts.splice(f, 1);
        continue;
      }
      ctx.save();
      ctx.font = '800 14px "Lexend", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
    animFrameId = requestAnimationFrame(reflexGameLoop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 3: MEMORY MATRIX (16 Boxes 4x4 Array, 1 Mistake Game Over)
  // ══════════════════════════════════════════════════════════════════════════
  const MATRIX_PALETTES = [
    { num: 1, glow: '#38bdf8', to: '#818cf8', freq: 261.63 }, // C4 Cyan
    { num: 2, glow: '#a855f7', to: '#c084fc', freq: 293.66 }, // D4 Violet
    { num: 3, glow: '#f59e0b', to: '#fbbf24', freq: 329.63 }, // E4 Amber
    { num: 4, glow: '#10b981', to: '#34d399', freq: 349.23 }, // F4 Emerald
    { num: 5, glow: '#f43f5e', to: '#fb7185', freq: 392.00 }, // G4 Rose
    { num: 6, glow: '#f97316', to: '#fdba74', freq: 440.00 }, // A4 Molten
    { num: 7, glow: '#6366f1', to: '#a5b4fc', freq: 493.88 }, // B4 Indigo
    { num: 8, glow: '#14b8a6', to: '#2dd4bf', freq: 523.25 }, // C5 Teal
    { num: 9, glow: '#84cc16', to: '#a3e635', freq: 587.33 }, // D5 Lime
    { num: 10, glow: '#d946ef', to: '#f0abfc', freq: 659.25 }, // E5 Fuchsia
    { num: 11, glow: '#eab308', to: '#fde047', freq: 698.46 }, // F5 Gold
    { num: 12, glow: '#0284c7', to: '#38bdf8', freq: 783.99 }, // G5 Sky
    { num: 13, glow: '#e11d48', to: '#fda4af', freq: 880.00 }, // A5 Ruby
    { num: 14, glow: '#9333ea', to: '#c084fc', freq: 987.77 }, // B5 Purple
    { num: 15, glow: '#06b6d4', to: '#67e8f9', freq: 1046.50 }, // C6 Turquoise
    { num: 16, glow: '#ec4899', to: '#f472b6', freq: 1174.66 }  // D6 Pink
  ];

  function startMemoryGame() {
    state.memoryRound = 1;
    state.memorySequence = [];
    state.playerSequence = [];
    state.isAcceptingInput = false;

    renderMemoryGrid();
    advanceMemoryRound();
  }

  function renderMemoryGrid() {
    if (!dom.memoryGrid) return;
    dom.memoryGrid.innerHTML = '';

    for (let i = 0; i < 16; i++) {
      const box = document.createElement('button');
      box.type = 'button';
      box.className = 'matrix-cell';
      box.dataset.idx = i;

      const pal = MATRIX_PALETTES[i];
      box.style.setProperty('--cell-glow', pal.glow);
      box.style.setProperty('--cell-gradient-to', pal.to);

      // Pure radiant number ONLY - no text tags
      box.innerHTML = `<span class="cell-num">${i + 1}</span>`;

      box.onclick = () => handleMemoryInput(i, box);
      dom.memoryGrid.appendChild(box);
    }
  }

  function advanceMemoryRound() {
    state.playerSequence = [];
    state.isAcceptingInput = false;
    if (dom.memoryRoundLabel) dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · WATCH MATRIX PATTERN`;

    // Add 1 random box to sequence (1-16)
    const nextIdx = Math.floor(Math.random() * 16);
    state.memorySequence.push(nextIdx);

    // Playback sequence after short delay
    setTimeout(() => {
      playbackMemorySequence(0);
    }, 600);
  }

  function playbackMemorySequence(step) {
    if (!state.active || state.gameType !== 'memory') return;

    if (step >= state.memorySequence.length) {
      state.isAcceptingInput = true;
      if (dom.memoryRoundLabel) dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · REPRODUCE PATTERN (${state.memorySequence.length} STEPS)`;
      return;
    }

    const boxIdx = state.memorySequence[step];
    const boxElem = dom.memoryGrid?.querySelector(`[data-idx="${boxIdx}"]`);

    if (boxElem) {
      boxElem.classList.add('flash-active');
      audio.playMatrixTone(boxIdx);

      setTimeout(() => {
        boxElem.classList.remove('flash-active');
        setTimeout(() => playbackMemorySequence(step + 1), 180);
      }, 350);
    } else {
      playbackMemorySequence(step + 1);
    }
  }

  function handleMemoryInput(boxIdx, boxElem) {
    if (!state.isAcceptingInput || !state.active || state.gameType !== 'memory') return;

    boxElem.classList.add('flash-player');
    audio.playMatrixTone(boxIdx);
    setTimeout(() => boxElem.classList.remove('flash-player'), 220);

    state.playerSequence.push(boxIdx);
    const currStep = state.playerSequence.length - 1;

    if (state.playerSequence[currStep] !== state.memorySequence[currStep]) {
      // 1 Mistake = Game Over!
      state.isAcceptingInput = false;
      audio.playMistakeBuzzer();
      boxElem.classList.add('flash-wrong');

      handleGameOver('MATRIX DESYNCHRONIZED (1 STRIKE)', `Cognitive breach on Round ${state.memoryRound} at step ${currStep + 1}. Final Score: ${state.score.toLocaleString()} points.`);
    } else {
      // Correct Step!
      state.score += 100 * state.combo;
      updateHeaderUI();

      if (state.playerSequence.length === state.memorySequence.length) {
        // Completed Round!
        state.isAcceptingInput = false;
        state.score += 500 * state.combo;
        state.combo = Math.min(10, state.combo + 1);
        audio.playCorrectChime(state.combo);
        updateHeaderUI();

        state.memoryRound++;
        setTimeout(() => advanceMemoryRound(), 900);
      }
    }
  }

  // --- Global Event Listeners & Binding ---
  function initEvents() {
    initDOM();

    // Close button
    if (dom.btnClose) dom.btnClose.onclick = closeGame;

    // Fullscreen toggle
    if (dom.btnFullscreen) dom.btnFullscreen.onclick = toggleAppFullscreen;

    // FEATURE 4: Unleash Flux Pulse
    function triggerFluxPulse() {
      if (!state.active || !state.isPulseReady) return;
      state.isPulseReady = false;
      state.pulseMeter = 0;
      audio.playFluxPulseUnleashed();

      const pColor = state.catcherType === 'helix' ? '#22d3ee' : (state.catcherType === 'meteor' ? '#f97316' : '#00f0ff');
      state.activeFluxPulse = {
        x: (state.catcherX || 0.5) * (dom.canvasReflex?.width / (window.devicePixelRatio || 1) || 800),
        y: (dom.canvasReflex?.height / (window.devicePixelRatio || 1) || 600) - 100,
        radius: 10,
        alpha: 1.0,
        color: pColor
      };

      // Pull all non-volatile nodes on screen for automatic Perfect catch!
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        if (pt.nodeClass !== 'volatile') {
          state.score += 300 * state.combo;
          state.particles.splice(i, 1);
        }
      }
      // Clean full-screen shockwave without floating text clutter
      updateHeaderUI();
    }

    // FEATURE 5: Cycle Core Phase (Alpha ↔ Beta)
    function cycleCorePhase() {
      if (!state.active) return;
      state.corePhase = (state.corePhase === 'alpha') ? 'beta' : 'alpha';
      audio.playPhaseSwitch();
      updateHeaderUI();
      // Phase pill & Core color shift provide instant feedback without text clutter
    }

    if (dom.pulsePill) dom.pulsePill.onclick = triggerFluxPulse;
    if (dom.phasePill) dom.phasePill.onclick = cycleCorePhase;

    // Cycle Tier (I -> II -> III -> IV) on clicking the TIER pill or pressing 'T'
    function cycleCoreTier() {
      if (!state.active) return;
      const nextTierCombo = { 1: 4, 2: 7, 3: 10, 4: 1 };
      state.combo = nextTierCombo[state.coreTier] || 10;
      state.coreTier = state.combo >= 10 ? 4 : (state.combo >= 7 ? 3 : (state.combo >= 4 ? 2 : 1));
      state.isOverdrive = (state.coreTier === 4);
      if (state.coreTier === 4) audio.playOverdriveFanfare();
      else audio.playPhaseSwitch();
      updateHeaderUI();
    }
    const tierPillEl = document.getElementById('cgTierPill');
    if (tierPillEl) {
      tierPillEl.style.cursor = 'pointer';
      tierPillEl.onclick = cycleCoreTier;
    }

    // Keyboard bindings for Flux Pulse (Space), Phase Switch (P / F), and Tier Cycle (T)
    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'f' || e.key === 'F') {
        cycleCorePhase();
      } else if (e.key === 't' || e.key === 'T') {
        cycleCoreTier();
      }
    });

    // Double-tap on canvas to cycle phase on touchscreen
    let lastCanvasTap = 0;
    dom.canvasReflex?.addEventListener('pointerdown', (e) => {
      const nowTap = performance.now();
      if (nowTap - lastCanvasTap < 300) {
        cycleCorePhase();
      }
      lastCanvasTap = nowTap;
    });

    // Window Resize Handler to guarantee pixel-perfect resolution on all screens
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    // Mute toggle
    if (dom.btnMute) {
      dom.btnMute.onclick = () => {
        audio.isMuted = !audio.isMuted;
        dom.btnMute.style.opacity = audio.isMuted ? '0.4' : '1';
      };
    }

    // Digit Picker Buttons for Reflex Blitz
    const digitBtnsContainer = document.getElementById('reflexDigitBtns');
    if (digitBtnsContainer) {
      digitBtnsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.digit-pill');
        if (!btn) return;
        const digit = parseInt(btn.dataset.digit, 10);
        if (!isNaN(digit) && digit >= 1 && digit <= 9) {
          state.targetMultiple = digit;
          digitBtnsContainer.querySelectorAll('.digit-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          audio.playTone(350 + digit * 60, 'sine', 0.15, 0.2);
          updateHeaderUI();
        }
      });
    }

    // Dedicated Divisor Selection Grid (1 through 9)
    const startDigitsGrid = document.getElementById('reflexStartDigitsGrid');
    if (startDigitsGrid) {
      startDigitsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.start-digit-btn');
        if (!btn) return;
        const choice = parseInt(btn.dataset.choice, 10);
        if (!isNaN(choice) && choice >= 1 && choice <= 9) {
          state.targetMultiple = choice;
          state.isChoosingMultiple = false;
          
          const overlay = document.getElementById('reflexStartOverlay');
          if (overlay) overlay.style.display = 'none';

          // Sync topbar digit pills
          const pills = document.querySelectorAll('#reflexDigitBtns .digit-pill');
          pills.forEach(p => p.classList.toggle('active', parseInt(p.dataset.digit, 10) === choice));

          audio.playTone(523.25, 'sine', 0.25, 0.25);
          updateHeaderUI();

          state.floatingTexts.push({
            text: `TARGET: MULTIPLES OF ${choice} · ENGAGE!`,
            x: (dom.canvasReflex?.width || 800) / (2 * (window.devicePixelRatio || 1)),
            y: (dom.canvasReflex?.height || 600) / (2 * (window.devicePixelRatio || 1)),
            color: '#c084fc',
            alpha: 1.0,
            vy: -1.0
          });
        }
      });
    }

    // Change Divisor Button
    const btnChangeDivisor = document.getElementById('btnChangeDivisor');
    if (btnChangeDivisor) {
      btnChangeDivisor.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isChoosingMultiple = true;
        state.particles = [];
        const overlay = document.getElementById('reflexStartOverlay');
        if (overlay) overlay.style.display = 'flex';
        updateHeaderUI();
      });
    }

    // Math Choice Buttons
    dom.mathOptions?.forEach(btn => {
      btn.onclick = () => {
        handleMathChoice(btn.dataset.ans, btn);
      };
    });

    // Math Level Selector Tabs
    dom.mathLevelTabs?.forEach(tab => {
      tab.onclick = () => {
        const lvl = parseInt(tab.dataset.level, 10);
        state.mathLevel = lvl;
        dom.mathLevelTabs.forEach(t => t.classList.toggle('active', t === tab));
        startMathGame();
      };
    });

    // ─────────────────────────────────────────────────────────────
    // UNIFIED POINTER EVENTS ENGINE (Pointer Events, Coalesced, Safe-Area)
    // ─────────────────────────────────────────────────────────────
    const getCanvasCoords = (clientX, clientY) => {
      if (!dom.canvasReflex) return { x: clientX, y: clientY, normX: clientX / window.innerWidth };
      const rect = dom.canvasReflex.getBoundingClientRect();
      const normX = (rect.width > 0) ? Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width)) : (clientX / window.innerWidth);
      return { x: clientX - rect.left, y: clientY - rect.top, normX };
    };

    const onPointerDown = (e) => {
      if (!state.active) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        setDeviceMode('touch');
      } else if (e.pointerType === 'mouse') {
        setDeviceMode('mouse');
      }

      isPointerDown = true;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      lastTouchClientX = e.clientX;
      lastTouchClientY = e.clientY;

      if (deviceInputMode === 'touch') {
        // Offset atom 64px ABOVE finger touch point so thumb never covers it!
        touchGuidePos = { x: coords.x, y: coords.y, active: true };
        targetCatcherX = coords.normX;
        currentCatcherX = coords.normX; // Jump immediately on first touch!
      } else {
        touchGuidePos.active = false;
        targetCatcherX = coords.normX;
      }

      if (e.cancelable && deviceInputMode === 'touch') e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!state.active) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        setDeviceMode('touch');
      } else if (e.pointerType === 'mouse') {
        setDeviceMode('mouse');
      }

      // Use coalesced events if available for high-DPI buttery smooth tracking
      const events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
      const lastEv = events[events.length - 1] || e;

      if (deviceInputMode === 'touch') {
        if (!isPointerDown) return;
        const coords = getCanvasCoords(lastEv.clientX, lastEv.clientY);
        touchGuidePos = { x: coords.x, y: coords.y, active: true };

        if (precisionMode && dom.canvasReflex) {
          // Relative trackpad movement: small finger motion translates to smooth gliding
          const deltaX = lastEv.clientX - lastTouchClientX;
          const rect = dom.canvasReflex.getBoundingClientRect();
          const sensitivity = 1.15;
          targetCatcherX = Math.max(0.05, Math.min(0.95, targetCatcherX + (deltaX / rect.width) * sensitivity));
        } else {
          targetCatcherX = coords.normX;
        }

        lastTouchClientX = lastEv.clientX;
        lastTouchClientY = lastEv.clientY;
      } else {
        // Mouse / Trackpad: atom follows pointer freely
        const coords = getCanvasCoords(lastEv.clientX, lastEv.clientY);
        touchGuidePos.active = false;
        targetCatcherX = coords.normX;
      }

      if (e.cancelable && deviceInputMode === 'touch') e.preventDefault();
    };

    const onPointerUp = (e) => {
      isPointerDown = false;
      touchGuidePos.active = false;
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        state.catcherX = Math.max(0.05, state.catcherX - 0.05);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        state.catcherX = Math.min(0.95, state.catcherX + 0.05);
      }
    });

    // Designated topbar launch buttons
    const btnRealm = document.getElementById('btnLaunchGame');
    const btnHelix = document.getElementById('btnLaunchHelixGame');
    const btnMeteor = document.getElementById('btnLaunchMeteorGame');
    const btnMath = document.getElementById('btnLaunchMathGame');
    const btnReflex = document.getElementById('btnLaunchReflexGame');
    const btnMemory = document.getElementById('btnLaunchMemoryGame');
    const btnTopFullscreen = document.getElementById('btnTopbarFullscreen');

    if (btnRealm) btnRealm.onclick = (e) => { e.preventDefault(); openGame('dynamo'); };
    if (btnHelix) btnHelix.onclick = (e) => { e.preventDefault(); openGame('helix'); };
    if (btnMeteor) btnMeteor.onclick = (e) => { e.preventDefault(); openGame('meteor'); };
    if (btnMath) btnMath.onclick = (e) => { e.preventDefault(); openGame('math'); };
    if (btnReflex) btnReflex.onclick = (e) => { e.preventDefault(); openGame('reflex'); };
    if (btnMemory) btnMemory.onclick = (e) => { e.preventDefault(); openGame('memory'); };
    if (btnTopFullscreen) btnTopFullscreen.onclick = toggleAppFullscreen;
  }

  // Global Unified API
  window.chromeSynapseGame = {
    open: openGame,
    close: closeGame,
    toggleFullscreen: toggleAppFullscreen,
    setLevel: (lvl) => { state.mathLevel = lvl; },
    getState: () => state,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.05, Math.min(0.95, nx)); },
    setTier: (t) => {
      const nextCombo = { 1: 1, 2: 4, 3: 7, 4: 10 };
      state.combo = nextCombo[t] || 10;
      state.coreTier = t;
      state.isOverdrive = (t === 4);
      updateHeaderUI();
    }
  };
  window.openChromeGame = openGame;

  // QuantumGame bridge for full backward compatibility
  window.quantumGame = {
    launch: (variant) => {
      if (variant === 'helix') openGame('helix');
      else if (variant === 'meteor') openGame('meteor');
      else openGame('realm');
    },
    exit: closeGame,
    restart: () => startGame(state.gameType),
    isActive: () => state.active
  };

  // Antigravity FX dummy stub (ambient particles in workspace are 100% disabled)
  window.antigravityFX = {
    isEnabled: () => false,
    enable: () => {},
    disable: () => {},
    toggle: () => false,
    getParticles: () => []
  };

  // Dedicated Escape Key Listener to exit cleanly from any active game
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (state.active || (dom.modal && dom.modal.classList.contains('active'))) {
        e.preventDefault();
        closeGame();
      }
    }
  }, true);

  // Resilient Global Event Delegation for all 6 Game Launchers
  document.addEventListener('click', function(e) {
    const realm = e.target.closest('#btnLaunchGame, .qgame-btn-dynamo, .qgame-btn-realm');
      if (realm) { e.preventDefault(); openGame('dynamo'); return; }
    const helix = e.target.closest('#btnLaunchHelixGame, .qgame-btn-helix');
    if (helix) { e.preventDefault(); openGame('helix'); return; }
    const meteor = e.target.closest('#btnLaunchMeteorGame, .qgame-btn-meteor');
    if (meteor) { e.preventDefault(); openGame('meteor'); return; }
    const math = e.target.closest('#btnLaunchMathGame, .btn-game-math');
    if (math) { e.preventDefault(); openGame('math'); return; }
    const reflex = e.target.closest('#btnLaunchReflexGame, .btn-game-reflex');
    if (reflex) { e.preventDefault(); openGame('reflex'); return; }
    const matrix = e.target.closest('#btnLaunchMemoryGame, .btn-game-memory');
    if (matrix) { e.preventDefault(); openGame('memory'); return; }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }
})();


/* ── STANDALONE QUANTUM MUSIC PLAYER (orlandochrome/music) ── */
(function initQuantumMusicPlayer() {
  var playlist = [
    'music/enchanted.mp3',
    'music/malibu-nights.mp3',
    'music/palagi.mp3',
    'music/okay.mp3',
    'music/training-season.mp3',
    'music/na-para-bang.mp3',
    'music/the-man-who-cant-be-moved.mp3',
    'music/what-if-i-miss-you.mp3',
    'music/youre-still-the-one.mp3',
    'music/stop-the-wedding.mp3'
  ];
  var currentTrackIdx = 0;
  var audio = new Audio();
  var isPlaying = false;

  audio.addEventListener('ended', function() {
    nextSong();
    if (isPlaying) audio.play().catch(function(){});
  });

  function playSong(trackPath) {
    if (!trackPath) {
      trackPath = playlist[currentTrackIdx];
    }
    audio.src = trackPath;
    audio.play().then(function() {
      isPlaying = true;
      if (typeof window.syncGameMusicBtn === 'function') window.syncGameMusicBtn();
    }).catch(function(err) {
      console.warn('Playback error:', err);
    });
  }

  function stopSong() {
    audio.pause();
    isPlaying = false;
    if (typeof window.syncGameMusicBtn === 'function') window.syncGameMusicBtn();
  }

  function nextSong() {
    currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
    return playlist[currentTrackIdx];
  }

  window.playSong = playSong;
  window.stopSong = stopSong;
  window.nextSong = nextSong;
  window.getIsMusicPlaying = function() { return isPlaying; };
})();
