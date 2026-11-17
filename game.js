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
  // PRE-RENDERED HD STARBURST & GLOW SPRITE CACHE (ZERO SHADOWBLUR LAG!)
  // ─────────────────────────────────────────────────────────────
  const StarburstCache = {
    sprites: {},
    pearls: {},
    getStarburst(colorKey, coreColor, glowColor) {
      if (this.sprites[colorKey]) return this.sprites[colorKey];
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      const cx = size * 0.5;
      const cy = size * 0.5;
      const r = size * 0.46;

      // Soft radial bloom (replaces slow ctx.shadowBlur!)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0.0, '#ffffff');
      g.addColorStop(0.18, coreColor);
      g.addColorStop(0.45, glowColor);
      g.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 4-Point Diamond Optical Diffraction Spikes
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(i * Math.PI * 0.5);
        const lg = ctx.createLinearGradient(-r, 0, r, 0);
        lg.addColorStop(0.0, 'rgba(255,255,255,0)');
        lg.addColorStop(0.5, '#ffffff');
        lg.addColorStop(1.0, 'rgba(255,255,255,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(0, -r * 0.13);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r * 0.13);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      this.sprites[colorKey] = c;
      return c;
    },
    getPearl(colorHex) {
      if (this.pearls[colorHex]) return this.pearls[colorHex];
      const size = 24;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      const cx = 12, cy = 12;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 11);
      g.addColorStop(0.0, '#ffffff');
      g.addColorStop(0.32, '#ffffff');
      g.addColorStop(0.58, colorHex);
      g.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fill();
      this.pearls[colorHex] = c;
      return c;
    }
  };

  function drawDiamondStarburst(ctx, cx, cy, radius, coreColor, glowColor) {
    const spr = StarburstCache.getStarburst(glowColor, coreColor, glowColor);
    if (spr) {
      const d = radius * 2.4;
      ctx.drawImage(spr, cx - d * 0.5, cy - d * 0.5, d, d);
    }
  }

  function drawMicroStarburst(ctx, cx, cy, radius, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const spr = StarburstCache.getStarburst(color, '#ffffff', color);
    if (spr) {
      const d = radius * 2.6;
      ctx.drawImage(spr, cx - d * 0.5, cy - d * 0.5, d, d);
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // 4K MASTER CELLPHONE & DESKTOP CORE SPRITES (PRE-FEATHERED FOR ZERO BLEND LAG)
  // ─────────────────────────────────────────────────────────────
  function prepareFeatheredCoreSprite(img, targetSize) {
    try {
      const c = document.createElement('canvas');
      c.width = targetSize;
      c.height = targetSize;
      const cctx = c.getContext('2d');
      if (!cctx) return null;
      cctx.drawImage(img, 0, 0, targetSize, targetSize);
      const imgData = cctx.getImageData(0, 0, targetSize, targetSize);
      const d = imgData.data;
      const half = targetSize * 0.5;
      const maxR = half * 0.92;
      for (let y = 0; y < targetSize; y++) {
        for (let x = 0; x < targetSize; x++) {
          const idx = (y * targetSize + x) * 4;
          const dist = Math.hypot(x - half, y - half);
          if (dist > maxR) {
            d[idx + 3] = 0;
          } else {
            const r = d[idx], g = d[idx + 1], b = d[idx + 2];
            const lum = Math.max(r, g, b);
            // Smooth radial & luminance alpha so dark background disappears without 'screen' blend mode
            const edgeFade = dist > maxR * 0.78 ? Math.max(0, 1 - (dist - maxR * 0.78) / (maxR * 0.22)) : 1.0;
            const lumAlpha = lum < 28 ? (lum / 28) : 1.0;
            d[idx + 3] = Math.round(255 * edgeFade * lumAlpha);
          }
        }
      }
      cctx.putImageData(imgData, 0, 0);
      return c;
    } catch (e) {
      return null;
    }
  }

  const CoreAssets = {
    dynamo: new Image(),
    helix: new Image(),
    meteor: new Image(),
    loaded: { dynamo: false, helix: false, meteor: false },
    sprites: { dynamo: null, helix: null, meteor: null }
  };
  CoreAssets.dynamo.onload = () => {
    CoreAssets.loaded.dynamo = true;
    CoreAssets.sprites.dynamo = prepareFeatheredCoreSprite(CoreAssets.dynamo, 256);
  };
  CoreAssets.dynamo.src = 'assets/core-dynamo-hd.jpg';

  CoreAssets.helix.onload = () => {
    CoreAssets.loaded.helix = true;
    CoreAssets.sprites.helix = prepareFeatheredCoreSprite(CoreAssets.helix, 256);
  };
  CoreAssets.helix.src = 'assets/core-helix-hd.jpg';

  CoreAssets.meteor.onload = () => {
    CoreAssets.loaded.meteor = true;
    CoreAssets.sprites.meteor = prepareFeatheredCoreSprite(CoreAssets.meteor, 256);
  };
  CoreAssets.meteor.src = 'assets/core-meteor-hd.jpg';

  // ─────────────────────────────────────────────────────────────
  // 4K MASTER FALLING PARTICLE SPHERE HEADS & LUXURY CHROMATIC SHADERS
  // (Pre-renders Standard, Beta, Prime & Luxury 4K Hazard Spheres once at load!)
  // ─────────────────────────────────────────────────────────────
  function cropSphereToCanvas(img, sx, sy, sRadius, targetSize) {
    try {
      const c = document.createElement('canvas');
      c.width = targetSize;
      c.height = targetSize;
      const cctx = c.getContext('2d');
      if (!cctx) return null;
      cctx.save();
      cctx.beginPath();
      cctx.arc(targetSize * 0.5, targetSize * 0.5, targetSize * 0.48, 0, Math.PI * 2);
      cctx.clip();
      cctx.drawImage(img, sx - sRadius, sy - sRadius, sRadius * 2, sRadius * 2, 0, 0, targetSize, targetSize);
      cctx.restore();
      return c;
    } catch (e) {
      return null;
    }
  }

  // Pixel-level 4K Chromatic Shader: Transforms the 4K sphere into a Luxury Hazard or Prime variant
  // while preserving 100% of the photorealistic 4K cracks, glass reflections, and plasma filaments!
  function createChromaticVariantSphere(sourceCanvas, variantType) {
    if (!sourceCanvas) return null;
    try {
      const size = sourceCanvas.width;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      ctx.drawImage(sourceCanvas, 0, 0);
      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const lum = (r * 0.299 + g * 0.587 + b * 0.114);

        if (variantType === 'prime') {
          // Supernova Solar-Gold & Diamond White 4K Remap
          d[i]     = Math.min(255, Math.round(maxC * 1.08 + 25));
          d[i + 1] = Math.min(255, Math.round(lum * 0.92 + 15));
          d[i + 2] = Math.min(255, Math.round(minC * 0.55 + (lum > 200 ? (lum - 200) * 2 : 0)));
        } else if (variantType === 'hazard-meteor') {
          // Abyssal Cryo-Emerald & Cyber-Sapphire 4K Volcanic Magma Remap:
          // Hot red/orange magma fissures (r) become blinding Bioluminescent Emerald (g) & Ice-Cyan (b)!
          d[i]     = Math.min(255, Math.round(b * 0.35 + (r > 220 ? (r - 220) * 1.8 : 0)));
          d[i + 1] = Math.min(255, Math.round(r * 1.05 + g * 0.25));
          d[i + 2] = Math.min(255, Math.round(g * 1.15 + r * 0.35));
        } else if (variantType === 'hazard-dynamo') {
          // Blood-Moon Supernova Ruby-Crimson 4K Plasma Orb Remap:
          // Violet/cyan plasma filaments become Blazing Crimson-Scarlet & Obsidian-Ruby!
          d[i]     = Math.min(255, Math.round(maxC * 1.12 + 18));
          d[i + 1] = Math.min(255, Math.round(minC * 0.28 + (maxC > 215 ? (maxC - 215) * 2.2 : 0)));
          d[i + 2] = Math.min(255, Math.round(r * 0.42 + b * 0.18));
        } else if (variantType === 'hazard-helix') {
          // Solar-Eclipse Blood-Crystal & Molten-Ruby 4K Pearl Remap:
          // Cyan/magenta crystal glass becomes Smoky Obsidian-Ruby with Blazing Scarlet-Gold refraction!
          d[i]     = Math.min(255, Math.round(maxC * 1.15 + 12));
          d[i + 1] = Math.min(255, Math.round(g * 0.32 + (maxC > 210 ? (maxC - 210) * 2.0 : 0)));
          d[i + 2] = Math.min(255, Math.round(b * 0.22));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return c;
    } catch (e) {
      return sourceCanvas;
    }
  }

  const ParticleAssets = {
    dynamo: new Image(),
    helix: new Image(),
    meteor: new Image(),
    loaded: { dynamo: false, helix: false, meteor: false },
    sphereSprites: { dynamo: null, helix: null, meteor: null },
    primeSprites: { dynamo: null, helix: null, meteor: null },
    hazardSprites: { dynamo: null, helix: null, meteor: null }
  };

  ParticleAssets.dynamo.onload = () => {
    ParticleAssets.loaded.dynamo = true;
    const base = cropSphereToCanvas(ParticleAssets.dynamo, 730, 320, 155, 256);
    ParticleAssets.sphereSprites.dynamo = base;
    ParticleAssets.primeSprites.dynamo = createChromaticVariantSphere(base, 'prime');
    ParticleAssets.hazardSprites.dynamo = createChromaticVariantSphere(base, 'hazard-dynamo');
  };
  ParticleAssets.dynamo.src = 'assets/particle-dynamo-hd.jpg';

  ParticleAssets.helix.onload = () => {
    ParticleAssets.loaded.helix = true;
    const base = cropSphereToCanvas(ParticleAssets.helix, 285, 205, 140, 256);
    ParticleAssets.sphereSprites.helix = base;
    ParticleAssets.primeSprites.helix = createChromaticVariantSphere(base, 'prime');
    ParticleAssets.hazardSprites.helix = createChromaticVariantSphere(base, 'hazard-helix');
  };
  ParticleAssets.helix.src = 'assets/particle-helix-hd.jpg';

  ParticleAssets.meteor.onload = () => {
    ParticleAssets.loaded.meteor = true;
    const base = cropSphereToCanvas(ParticleAssets.meteor, 470, 360, 205, 256);
    ParticleAssets.sphereSprites.meteor = base;
    ParticleAssets.primeSprites.meteor = createChromaticVariantSphere(base, 'prime');
    ParticleAssets.hazardSprites.meteor = createChromaticVariantSphere(base, 'hazard-meteor');
  };
  ParticleAssets.meteor.src = 'assets/particle-meteor-hd.jpg';

  // ─────────────────────────────────────────────────────────────
  // FUTURISTIC HOLOGRAPHIC IRIS APERTURE & FAST 3D GIMBAL HELPERS
  // (Zero shadowBlur, batched paths for locked 120 FPS performance)
  // ─────────────────────────────────────────────────────────────
  function drawHolographicApertureReticle(ctx, now, radius, primaryColor, secondaryColor, isLockedOn = false) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const spin = now * (isLockedOn ? 0.0042 : 0.0022);
    const pulse = 1.0 + Math.sin(now * 0.008) * 0.06;
    const r = radius * (isLockedOn ? 0.88 : 1.0) * pulse;

    // 1. Six Articulated Curved Plasma Iris Blades
    const blades = 6;
    for (let b = 0; b < blades; b++) {
      const baseAng = spin + (b / blades) * Math.PI * 2;
      const sweep = 0.58;
      ctx.save();
      ctx.rotate(baseAng);

      ctx.beginPath();
      ctx.arc(0, 0, r, -sweep * 0.5, sweep * 0.5);
      ctx.arc(0, 0, r * 0.78, sweep * 0.42, -sweep * 0.42, true);
      ctx.closePath();
      ctx.fillStyle = (b % 2 === 0) ? primaryColor : secondaryColor;
      ctx.globalAlpha = isLockedOn ? 0.88 : 0.68;
      ctx.fill();

      const tipX = Math.cos(sweep * 0.5) * (r * 0.89);
      const tipY = Math.sin(sweep * 0.5) * (r * 0.89);
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Pinpoint Singularity Bullseye Pearl (using cached sprite, zero shadowBlur)
    const pearl = StarburstCache.getPearl(primaryColor);
    if (pearl) {
      ctx.drawImage(pearl, -8, -8, 16, 16);
    }
    ctx.restore();
  }

  // Ultra-Fast 2-Pass 3D Gimbal Orbit (Replaces 28-segment loop with 2 smooth hardware ellipses!)
  function draw3DGimbalOrbit(ctx, rx, ry, tiltAngle, phaseAngle, colorFront, colorBack, drawSatellite = true) {
    ctx.save();
    ctx.rotate(tiltAngle);

    // Back half of 3D orbit (dimmer, thinner)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = colorBack;
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.38;
    ctx.stroke();

    // Front half of 3D orbit (wider, luminous)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
    ctx.strokeStyle = colorFront;
    ctx.lineWidth = 2.8;
    ctx.globalAlpha = 0.88;
    ctx.stroke();

    // Specular white highlight on front crest
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 0.2, Math.PI * 0.8);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.1;
    ctx.globalAlpha = 0.85;
    ctx.stroke();

    if (drawSatellite) {
      const satX = Math.cos(phaseAngle) * rx;
      const satY = Math.sin(phaseAngle) * ry;
      drawDiamondStarburst(ctx, satX, satY, 7.0, '#ffffff', colorFront);
    }
    ctx.restore();
  }

  // Prime Class 8-Point Sacred Starlight Crown & Orbiting Micro-Satellites
  function drawPrimeApexCrown(ctx, px, py, headR, now) {
    ctx.save();
    ctx.translate(px, py);
    ctx.globalCompositeOperation = 'lighter';
    const spin = now * 0.0028;

    // Pre-rendered Golden Starburst Crown (2 counter-rotating HD starbursts = 8 points, zero gradient allocation!)
    const goldStar = StarburstCache.getStarburst('#fbbf24', '#ffffff', '#fbbf24');
    if (goldStar) {
      const sz = headR * 3.2;
      ctx.save();
      ctx.rotate(spin);
      ctx.drawImage(goldStar, -sz * 0.5, -sz * 0.5, sz, sz);
      ctx.rotate(Math.PI * 0.25 - spin * 2.2);
      ctx.drawImage(goldStar, -sz * 0.44, -sz * 0.44, sz * 0.88, sz * 0.88);
      ctx.restore();
    }

    // 2 Orbiting Golden 3D Gimbal Rings
    draw3DGimbalOrbit(ctx, headR * 1.32, headR * 0.46, spin * 0.8, spin * 2.5, '#fef08a', '#f59e0b', true);
    ctx.restore();
  }

  // 10x Consecutive Combo (Tier III Overdrive) Supernova Corona Glow & 8-Ray Starburst
  function drawOverdriveSupernovaCorona(ctx, now, imgSize, primaryCol, secondaryCol) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const pulse = Math.sin(now * 0.014) * 10;
    const rad = imgSize * 0.84 + pulse;

    const coronaGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, rad);
    coronaGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
    coronaGrad.addColorStop(0.32, primaryCol + '99');
    coronaGrad.addColorStop(0.68, secondaryCol + '55');
    coronaGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fill();

    // 8 Rotating Supernova Starburst Rays
    const t = now * 0.0018;
    for (let ray = 0; ray < 8; ray++) {
      ctx.save();
      ctx.rotate(t * 0.55 + (ray * Math.PI) / 4);
      const rLen = imgSize * (ray % 2 === 0 ? 0.82 : 0.60) + pulse * 0.5;
      const rGrad = ctx.createLinearGradient(-rLen, 0, rLen, 0);
      rGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
      rGrad.addColorStop(0.35, primaryCol);
      rGrad.addColorStop(0.5, '#ffffff');
      rGrad.addColorStop(0.65, primaryCol);
      rGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = rGrad;
      ctx.beginPath();
      ctx.moveTo(-rLen, 0);
      ctx.lineTo(0, -3.2);
      ctx.lineTo(rLen, 0);
      ctx.lineTo(0, 3.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  const QuantumRenderer = {
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      this.drawDynamoCore(ctx, cx, cy, now, progress);
    },

    // 1. Faraday Singularity Core (Quantum Dynamo Core)
    drawDynamoCore(ctx, cx, cy, now, progress = 0, tier = 1, phase = 'alpha', isOverdrive = false, isLockedOn = false) {
      ctx.save();
      ctx.translate(cx, cy);

      const t = now * 0.0018;
      const exc = (progress > 0) ? (progress * 0.35) : 0;
      const tierBonus = (tier - 1) * 12;
      const isBeta = (phase === 'beta');
      const primaryCol = isBeta ? '#fbbf24' : '#00f0ff';
      const secondaryCol = isBeta ? '#f59e0b' : '#a855f7';
      const imgSize = 138 + exc * 26 + tierBonus;

      // 10x Consecutive Combo (Tier III / Overdrive) Supernova Corona Glow
      if (tier >= 3 || isOverdrive) {
        drawOverdriveSupernovaCorona(ctx, now, imgSize, primaryCol, secondaryCol);
      }

      // High-Definition Pre-Feathered Faraday Singularity Core Sprite
      const spr = CoreAssets.sprites.dynamo;
      if (spr) {
        ctx.drawImage(spr, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
      } else if (CoreAssets.dynamo && CoreAssets.loaded.dynamo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.44, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(CoreAssets.dynamo, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
        ctx.restore();
      }

      // 3D Precessing Lorentz Gimbal Coils
      const numGimbals = tier >= 3 ? 5 : (tier === 2 ? 4 : 3);
      for (let g = 0; g < numGimbals; g++) {
        const gTilt = (g / numGimbals) * Math.PI + t * (g % 2 === 0 ? 0.65 : -0.55);
        const gRx = imgSize * (0.45 + g * 0.04);
        const gRy = imgSize * (0.17 + (g % 2) * 0.04);
        draw3DGimbalOrbit(ctx, gRx, gRy, gTilt, t * (2.4 + g * 0.5), g % 2 === 0 ? primaryCol : '#fef08a', secondaryCol, true);
      }

      // Multi-Branched Lichtenberg Plasma Arcs
      const eTick = (now * 0.11) | 0;
      const numArcs = (tier >= 3 || isOverdrive) ? 8 : 6;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      for (let a = 0; a < numArcs; a++) {
        const baseAng = (a / numArcs) * Math.PI * 2 + eTick * 0.25;
        const rLen = 34 + tierBonus * 0.5 + (Math.sin(eTick * 2.3 + a) * 7);
        const endX = Math.cos(baseAng) * rLen;
        const endY = Math.sin(baseAng) * rLen;
        const midX = (endX * 0.5) + (Math.sin(eTick * 4.1 + a * 1.7) * 6);
        const midY = (endY * 0.5) + (Math.cos(eTick * 3.3 + a * 1.3) * 6);
        ctx.moveTo(0, 0);
        ctx.lineTo(midX, midY);
        ctx.lineTo(endX, endY);
      }
      ctx.strokeStyle = primaryCol;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();

      drawHolographicApertureReticle(ctx, now, 22, primaryCol, secondaryCol, isLockedOn);
      ctx.restore();
    },

    // 2. Harmonic Bio-Lattice Core (Photonic Helix Core)
    drawHelixCore(ctx, cx, cy, now, progress = 0, tier = 1, phase = 'alpha', isOverdrive = false, isLockedOn = false) {
      ctx.save();
      ctx.translate(cx, cy);

      const t = now * 0.003;
      const exc = progress * 0.4;
      const tierBonus = (tier - 1) * 12;
      const isBeta = (phase === 'beta');
      const primaryCol = isBeta ? '#d946ef' : '#22d3ee';
      const secondaryCol = isBeta ? '#fbbf24' : '#d946ef';
      const imgSize = 116 + exc * 22 + tierBonus;

      // 10x Consecutive Combo (Tier III / Overdrive) Supernova Corona Glow
      if (tier >= 3 || isOverdrive) {
        drawOverdriveSupernovaCorona(ctx, now, imgSize, primaryCol, secondaryCol);
      }

      // TIER II & III: Articulated Bioluminescent Crystalline Seraph-Wings
      if (tier >= 2) {
        const wingFeathers = (tier >= 3 || isOverdrive) ? 4 : 3;
        const flap = Math.sin(t * 1.5) * 0.12;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let side = -1; side <= 1; side += 2) {
          for (let wf = 0; wf < wingFeathers; wf++) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.rotate(-0.32 + wf * 0.22 + flap);
            const wLen = imgSize * (0.60 + (wingFeathers - wf) * 0.07);
            const wWidth = 8.0 - wf * 1.1;
            ctx.fillStyle = (wf % 2 === 0) ? primaryCol : secondaryCol;
            ctx.globalAlpha = 0.55 - wf * 0.08;
            ctx.beginPath();
            ctx.moveTo(22, 0);
            ctx.quadraticCurveTo(wLen * 0.55, -wWidth, wLen, 0);
            ctx.quadraticCurveTo(wLen * 0.55, wWidth * 0.65, 22, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();
      }

      // High-Definition Pre-Feathered Harmonic Bio-Lattice Core Sprite
      const spr = CoreAssets.sprites.helix;
      if (spr) {
        ctx.drawImage(spr, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
      } else if (CoreAssets.helix && CoreAssets.loaded.helix) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.46, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(CoreAssets.helix, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
        ctx.restore();
      }

      // 3D Equatorial Double-Helix Gimbal Rings
      draw3DGimbalOrbit(ctx, imgSize * 0.52, imgSize * 0.20, 0.28, t * 1.4, primaryCol, secondaryCol, true);
      draw3DGimbalOrbit(ctx, imgSize * 0.52, imgSize * 0.20, -0.28, -t * 1.4, secondaryCol, primaryCol, true);

      drawHolographicApertureReticle(ctx, now, 22, primaryCol, secondaryCol, isLockedOn);
      ctx.restore();
    },

    // 3. Aegis Caldera Core (Volcanic Aegis Core)
    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0, tier = 1, phase = 'alpha', isOverdrive = false, isLockedOn = false) {
      ctx.save();
      ctx.translate(cx, cy);

      const exc = progress * 0.45;
      const tierBonus = (tier - 1) * 12;
      const isBeta = (phase === 'beta');
      const primaryCol = isBeta ? '#fef08a' : '#f97316';
      const imgSize = 116 + exc * 22 + tierBonus;

      // 10x Consecutive Combo (Tier III / Overdrive) Supernova Corona Glow
      if (tier >= 3 || isOverdrive) {
        drawOverdriveSupernovaCorona(ctx, now, imgSize, '#fef08a', primaryCol);
      }

      // TIER II & III: Twin Solar-Prominence Magnetic Plasma Loops
      if (tier >= 2) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const promPulse = Math.sin(now * 0.005) * 7;
        for (let side = -1; side <= 1; side += 2) {
          ctx.save();
          ctx.scale(side, 1);
          ctx.beginPath();
          ctx.moveTo(26, -18);
          ctx.bezierCurveTo(imgSize * 0.68, -42 - promPulse, imgSize * 0.72, 22 + promPulse, 28, 18);
          ctx.bezierCurveTo(imgSize * 0.54, 12, imgSize * 0.52, -24, 26, -18);
          ctx.closePath();
          ctx.fillStyle = primaryCol;
          ctx.globalAlpha = 0.72;
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // High-Definition Pre-Feathered Aegis Caldera Core Sprite
      const spr = CoreAssets.sprites.meteor;
      if (spr) {
        ctx.drawImage(spr, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
      } else if (CoreAssets.meteor && CoreAssets.loaded.meteor) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.46, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(CoreAssets.meteor, -imgSize * 0.5, -imgSize * 0.5, imgSize, imgSize);
        ctx.restore();
      }

      // Dynamic Supersonic Combustion Fire Crown (Batched by tone for zero gradient overhead!)
      const fTick = now * 0.035;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const numFlames = 14;
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (let f = pass; f < numFlames; f += 2) {
          const fAng = Math.PI * 1.08 + (f / numFlames) * Math.PI * 0.84;
          const tipAng = fAng + Math.sin(fTick * 2.8 + f * 2.2) * 0.12;
          const fLen = (36 + exc * 10 + tierBonus * 0.3) + Math.sin(fTick * 3.4 + f * 2.0) * 9.0;
          const bAng1 = fAng - 0.09, bAng2 = fAng + 0.09;
          const bx1 = Math.cos(bAng1) * 28, by1 = Math.sin(bAng1) * 28 - 6;
          const bx2 = Math.cos(bAng2) * 28, by2 = Math.sin(bAng2) * 28 - 6;
          const tipX = Math.cos(tipAng) * fLen, tipY = Math.sin(tipAng) * fLen - 6;
          const c1x = Math.cos(bAng1 + 0.03) * (fLen * 0.55), c1y = Math.sin(bAng1 + 0.03) * (fLen * 0.55) - 6;
          const c2x = Math.cos(bAng2 - 0.03) * (fLen * 0.55), c2y = Math.sin(bAng2 - 0.03) * (fLen * 0.55) - 6;
          ctx.moveTo(bx1, by1);
          ctx.quadraticCurveTo(c1x, c1y, tipX, tipY);
          ctx.quadraticCurveTo(c2x, c2y, bx2, by2);
          ctx.closePath();
        }
        ctx.fillStyle = pass === 0 ? 'rgba(249, 115, 22, 0.78)' : 'rgba(254, 240, 138, 0.88)';
        ctx.fill();
      }
      ctx.restore();

      drawHolographicApertureReticle(ctx, now, 22, '#fef08a', primaryCol, isLockedOn);
      ctx.restore();
    },

    drawTier3RealmParticle(targetCtx, p, now) {
      this.drawTier3DynamoParticle(targetCtx, p, now);
    },

    // ══════════════════════════════════════════════════════════════
    // 1. CHROME DYNAMO: PLASMA ORBS & LUXURY 4K BLOOD-MOON HAZARD ORB
    // ══════════════════════════════════════════════════════════════
    drawTier3DynamoParticle(targetCtx, p, now) {
      const headR = 26.0;
      const px0 = p.x;
      const py0 = p.y;
      const spinePts = p.spine;
      const K = spinePts.length;
      const nClass = p.nodeClass || 'standard';
      const isVolatile = (nClass === 'volatile');
      const isPrime = (nClass === 'prime');
      const isSplitter = (nClass === 'splitter');
      const isPhantom = (nClass === 'phantom');
      const isBeta = (p.phase === 'beta');

      // Luxury Palette:
      // Volatile ("Must-Be-Avoided") -> Blazing Blood-Moon Ruby-Crimson (#ff1744 / #fda4af)
      // Prime -> Supernova Solar-Gold (#fef08a / #fbbf24)
      // Standard -> Electric Cyan (#00f0ff) or Amber (#fbbf24)
      const coreCol = isVolatile ? '#ff1744' : (isPrime ? '#fef08a' : (isBeta ? '#fbbf24' : '#00f0ff'));
      const subCol  = isVolatile ? '#fda4af' : (isPrime ? '#f59e0b' : '#a855f7');

      // ── A. TESLA WAVEPACKET HULL & FRACTAL LIGHTNING SPINE ──
      if (K >= 2) {
        const tailTipX = spinePts[K - 1].x;
        const tailTipY = spinePts[K - 1].y;

        targetCtx.save();
        const bodyGrad = targetCtx.createLinearGradient(tailTipX, tailTipY, px0, py0);
        bodyGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
        bodyGrad.addColorStop(0.35, isVolatile ? 'rgba(159, 18, 57, 0.48)' : (isPrime ? 'rgba(245, 158, 11, 0.45)' : 'rgba(124, 58, 237, 0.38)'));
        bodyGrad.addColorStop(0.75, isVolatile ? 'rgba(255, 23, 68, 0.78)' : (isPrime ? 'rgba(251, 191, 36, 0.75)' : (isBeta ? 'rgba(245, 158, 11, 0.68)' : 'rgba(56, 189, 248, 0.68)')));
        bodyGrad.addColorStop(1.0, isVolatile ? 'rgba(255, 228, 230, 0.96)' : 'rgba(255, 255, 255, 0.96)');
        targetCtx.fillStyle = bodyGrad;

        const hullScale = (isPrime || isVolatile) ? 1.08 : 0.88;
        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x - headR * hullScale, spinePts[0].y);
        for (let sj = 1; sj < K; sj++) {
          const taper = 1.0 - (sj / K) * 0.88;
          targetCtx.lineTo(spinePts[sj].x - headR * hullScale * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(tailTipX, tailTipY);
        for (let sj = K - 1; sj >= 1; sj--) {
          const taper = 1.0 - (sj / K) * 0.88;
          targetCtx.lineTo(spinePts[sj].x + headR * hullScale * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(spinePts[0].x + headR * hullScale, spinePts[0].y);
        targetCtx.closePath();
        targetCtx.fill();

        // Fractal Lightning Spine (Batched 2-Pass Glow)
        const eTick = (now * 0.13) | 0;
        targetCtx.globalCompositeOperation = 'lighter';
        targetCtx.lineCap = 'round';
        targetCtx.lineJoin = 'round';

        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
        for (let ej = 1; ej < K; ej++) {
          const jWave = Math.sin(eTick * 2.9 + ej * 3.7) * 9.0;
          const bx = spinePts[ej].x + jWave;
          const by = spinePts[ej].y;
          targetCtx.lineTo(bx, by);
        }
        targetCtx.strokeStyle = coreCol;
        targetCtx.lineWidth = headR * 0.36;
        targetCtx.globalAlpha = 0.65;
        targetCtx.stroke();

        targetCtx.strokeStyle = '#ffffff';
        targetCtx.lineWidth = headR * 0.12;
        targetCtx.globalAlpha = 0.98;
        targetCtx.stroke();

        // Lateral Branched Lightning Bolts (Batched into single path!)
        targetCtx.beginPath();
        for (let b = 1; b < K - 1; b += 2) {
          const bSide = ((b + eTick) % 2 === 0) ? 1 : -1;
          const bStartX = spinePts[b].x + Math.sin(eTick * 2.9 + b * 3.7) * 9.0;
          const bStartY = spinePts[b].y;
          const bEndX = bStartX + bSide * (headR * 1.42);
          const bEndY = bStartY - 10 + Math.sin(eTick * 3.5 + b) * 8;
          targetCtx.moveTo(bStartX, bStartY);
          targetCtx.lineTo((bStartX + bEndX) * 0.5 + Math.sin(eTick * 5 + b) * 5, (bStartY + bEndY) * 0.5);
          targetCtx.lineTo(bEndX, bEndY);
        }
        targetCtx.strokeStyle = coreCol;
        targetCtx.lineWidth = 1.8;
        targetCtx.globalAlpha = 0.85;
        targetCtx.stroke();
        targetCtx.restore();
      }

      // ── B. 4K PHOTOREALISTIC SPHERE HEAD (STANDARD, PRIME, SPLITTER, PHANTOM, VOLATILE) ──
      targetCtx.save();

      if (isPhantom) {
        const rgbShift = 6.5 + Math.sin(now * 0.02) * 3.5;
        targetCtx.save();
        targetCtx.globalCompositeOperation = 'lighter';
        targetCtx.globalAlpha = 0.42;
        const baseSpr = ParticleAssets.sphereSprites.dynamo;
        if (baseSpr) {
          targetCtx.drawImage(baseSpr, px0 - headR - rgbShift, py0 - headR, headR * 2, headR * 2);
          targetCtx.drawImage(baseSpr, px0 - headR + rgbShift, py0 - headR, headR * 2, headR * 2);
        }
        targetCtx.restore();
      }

      if (isSplitter && !p.hasSplit) {
        const sep = 8.0 + Math.sin(now * 0.025) * 3.0;
        const baseSpr = ParticleAssets.sphereSprites.dynamo;
        if (baseSpr) {
          const subR = headR * 0.78;
          targetCtx.drawImage(baseSpr, px0 - sep - subR, py0 - subR, subR * 2, subR * 2);
          targetCtx.drawImage(baseSpr, px0 + sep - subR, py0 - subR, subR * 2, subR * 2);
        }
      }

      if (isPrime) {
        drawPrimeApexCrown(targetCtx, px0, py0, headR, now);
      }

      // Select Pre-Rendered 4K Sphere Sprite (Zero per-frame 'color' blend lag!)
      const sprD = isVolatile
        ? ParticleAssets.hazardSprites.dynamo
        : (isPrime ? ParticleAssets.primeSprites.dynamo : ParticleAssets.sphereSprites.dynamo);

      if (sprD) {
        targetCtx.drawImage(sprD, px0 - headR, py0 - headR, headR * 2, headR * 2);
      } else {
        targetCtx.beginPath();
        targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
        targetCtx.fillStyle = coreCol;
        targetCtx.fill();
      }

      // LUXURY VOLATILE HAZARD CONTAINMENT: Twin Precessing 3D Ruby-Crimson Atomic Gimbals
      if (isVolatile) {
        targetCtx.save();
        targetCtx.translate(px0, py0);
        targetCtx.globalCompositeOperation = 'lighter';
        const hSpin = now * 0.0038;
        draw3DGimbalOrbit(targetCtx, headR * 1.36, headR * 0.44, hSpin, hSpin * 2.2, '#ff1744', '#9f1239', true);
        draw3DGimbalOrbit(targetCtx, headR * 1.36, headR * 0.44, -hSpin + Math.PI * 0.5, -hSpin * 2.2, '#fda4af', '#e11d48', true);
        targetCtx.restore();
      }

      // Fast Swirling Internal Faraday Plasma Filaments & Crackling Perimeter
      const inTick = now * 0.018;
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'lighter';
      targetCtx.beginPath();
      for (let v = 0; v < 4; v++) {
        const vAng = inTick * (2.5 + v * 0.8) + (v * Math.PI / 2);
        const vRad = headR * 0.45;
        const vx = px0 + Math.cos(vAng) * vRad;
        const vy = py0 + Math.sin(vAng) * vRad;
        targetCtx.moveTo(px0, py0);
        targetCtx.quadraticCurveTo(
          (px0 + vx) * 0.5 + Math.sin(now * 0.06 + v) * 5,
          (py0 + vy) * 0.5 + Math.cos(now * 0.06 + v) * 5,
          vx,
          vy
        );
      }
      targetCtx.strokeStyle = coreCol;
      targetCtx.lineWidth = 2.0;
      targetCtx.stroke();

      // High-Frequency Crackling Electric Perimeter
      const pTick = (now * 0.15) | 0;
      targetCtx.beginPath();
      for (let a = 0; a <= 14; a++) {
        const aAng = (a / 14) * Math.PI * 2;
        const aJitter = Math.sin(pTick * 3.9 + a * 2.5) * 2.4;
        const ax = px0 + Math.cos(aAng) * (headR + aJitter);
        const ay = py0 + Math.sin(aAng) * (headR + aJitter);
        if (a === 0) targetCtx.moveTo(ax, ay); else targetCtx.lineTo(ax, ay);
      }
      targetCtx.closePath();
      targetCtx.strokeStyle = coreCol;
      targetCtx.lineWidth = 2.4;
      targetCtx.stroke();
      targetCtx.strokeStyle = '#ffffff';
      targetCtx.lineWidth = 0.9;
      targetCtx.stroke();
      targetCtx.restore();

      drawDiamondStarburst(targetCtx, px0 + headR * 0.60, py0 - headR * 0.60, (isPrime || isVolatile) ? 10.5 : 8.5, '#ffffff', coreCol);
      targetCtx.restore();

      // ── C. TRAILING STARDUST (ZERO SHADOWBLUR!) ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.65 && p.stardust.length < 12) {
        const emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        p.stardust.push({
          x: spinePts[emSpine].x + (Math.random() - 0.5) * (headR * 1.5),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * (headR * 1.5),
          alpha: 1.0,
          r: 1.2 + Math.random() * 2.0,
          isStar: Math.random() < 0.45,
          color: coreCol
        });
      }
      for (let pi = p.stardust.length - 1; pi >= 0; pi--) {
        const sp = p.stardust[pi];
        if (sp.isStar) {
          drawMicroStarburst(targetCtx, sp.x, sp.y, sp.r * 2.4, sp.color, sp.alpha);
        } else {
          targetCtx.beginPath();
          targetCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
          targetCtx.fillStyle = sp.color;
          targetCtx.globalAlpha = sp.alpha;
          targetCtx.fill();
          targetCtx.globalAlpha = 1.0;
        }
        sp.y -= 0.7;
        sp.alpha -= 0.04;
        if (sp.alpha <= 0) p.stardust.splice(pi, 1);
      }
    },

    // ══════════════════════════════════════════════════════════════
    // 2. CHROME HELIX: NUCLEOTIDE PEARLS & LUXURY 4K SOLAR-ECLIPSE RUBY PEARL
    //    (100% Batched Paths & Cached Pearl Sprites -> ZERO LAG!)
    // ══════════════════════════════════════════════════════════════
    drawTier3HelixParticle(targetCtx, p, now) {
      const headR = 26.0;
      const px0 = p.x;
      const py0 = p.y;
      const spinePts = p.spine;
      const K = spinePts.length;
      const nClass = p.nodeClass || 'standard';
      const isVolatile = (nClass === 'volatile');
      const isPrime = (nClass === 'prime');
      const isSplitter = (nClass === 'splitter');
      const isPhantom = (nClass === 'phantom');
      const isBeta = (p.phase === 'beta');

      // Luxury Palette:
      // Volatile ("Must-Be-Avoided") -> Blazing Crimson-Ruby (#ff1744) & Molten Blood-Gold (#f97316)
      // Prime -> Supernova Solar-Gold (#fef08a) & Amber (#f59e0b)
      // Standard -> Cyan (#22d3ee) & Royal Magenta (#d946ef)
      const strandACol = isVolatile ? '#ff1744' : (isPrime ? '#fef08a' : (isBeta ? '#fbbf24' : '#22d3ee'));
      const strandBCol = isVolatile ? '#f97316' : (isPrime ? '#f59e0b' : '#d946ef');
      const waveAmp = (isPrime || isVolatile) ? 18 : 16;
      const t = now * 0.0042;

      // ── A. BATCHED 3D DOUBLE-HELIX AURORA RIBBON & PHOTON RUNGS (ZERO PER-SEGMENT LAG!) ──
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'lighter';
      targetCtx.lineCap = 'round';
      targetCtx.lineJoin = 'round';

      // 1. Central Harmonic Soliton Beam
      targetCtx.beginPath();
      targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
      for (let sj = 1; sj < K; sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.strokeStyle = '#ffffff';
      targetCtx.globalAlpha = 0.85;
      targetCtx.lineWidth = 3.0;
      targetCtx.stroke();

      // 2. Batched Hydrogen-Bond Rungs
      targetCtx.beginPath();
      for (let rk = 1; rk < K - 1; rk++) {
        const off = Math.sin(t - rk * 0.78) * waveAmp;
        targetCtx.moveTo(spinePts[rk].x + off, spinePts[rk].y);
        targetCtx.lineTo(spinePts[rk].x - off, spinePts[rk].y);
      }
      targetCtx.strokeStyle = isVolatile ? 'rgba(254, 202, 202, 0.75)' : 'rgba(224, 231, 255, 0.70)';
      targetCtx.lineWidth = 1.5;
      targetCtx.stroke();

      // 3. Strand A Continuous Ribbon (Outer Glow + Inner White Core)
      targetCtx.beginPath();
      for (let sj = 0; sj < K; sj++) {
        const sx = spinePts[sj].x + Math.sin(t - sj * 0.78) * waveAmp;
        const sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.strokeStyle = strandACol;
      targetCtx.globalAlpha = 0.90;
      targetCtx.lineWidth = 8.0;
      targetCtx.stroke();
      targetCtx.strokeStyle = '#ffffff';
      targetCtx.lineWidth = 2.2;
      targetCtx.stroke();

      // 4. Strand B Continuous Ribbon (Outer Glow + Inner White Core)
      targetCtx.beginPath();
      for (let sj = 0; sj < K; sj++) {
        const sx = spinePts[sj].x - Math.sin(t - sj * 0.78) * waveAmp;
        const sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.strokeStyle = strandBCol;
      targetCtx.globalAlpha = 0.90;
      targetCtx.lineWidth = 8.0;
      targetCtx.stroke();
      targetCtx.strokeStyle = '#ffffff';
      targetCtx.lineWidth = 2.2;
      targetCtx.stroke();
      targetCtx.restore();

      // ── B. 4K PHOTOREALISTIC CRYSTAL-GLASS SPHERE HEAD ──
      targetCtx.save();

      if (isPhantom) {
        const hShift = 6.5 + Math.sin(now * 0.02) * 3.5;
        targetCtx.save();
        targetCtx.globalCompositeOperation = 'lighter';
        targetCtx.globalAlpha = 0.42;
        const baseSpr = ParticleAssets.sphereSprites.helix;
        if (baseSpr) {
          targetCtx.drawImage(baseSpr, px0 - headR - hShift, py0 - headR, headR * 2, headR * 2);
          targetCtx.drawImage(baseSpr, px0 - headR + hShift, py0 - headR, headR * 2, headR * 2);
        }
        targetCtx.restore();
      }

      if (isSplitter && !p.hasSplit) {
        const hSep = 8.0 + Math.sin(now * 0.025) * 3.0;
        const baseSpr = ParticleAssets.sphereSprites.helix;
        if (baseSpr) {
          const subR = headR * 0.78;
          targetCtx.drawImage(baseSpr, px0 - hSep - subR, py0 - subR, subR * 2, subR * 2);
          targetCtx.drawImage(baseSpr, px0 + hSep - subR, py0 - subR, subR * 2, subR * 2);
        }
      }

      if (isPrime) {
        drawPrimeApexCrown(targetCtx, px0, py0, headR, now);
      }

      // Select Pre-Rendered 4K Sphere Sprite (Zero per-frame 'color' blend mode lag!)
      const sprH = isVolatile
        ? ParticleAssets.hazardSprites.helix
        : (isPrime ? ParticleAssets.primeSprites.helix : ParticleAssets.sphereSprites.helix);

      if (sprH) {
        targetCtx.drawImage(sprH, px0 - headR, py0 - headR, headR * 2, headR * 2);
      }

      // LUXURY VOLATILE HAZARD CONTAINMENT: Twin Precessing 3D Solar-Eclipse Crimson Gimbals
      if (isVolatile) {
        targetCtx.save();
        targetCtx.translate(px0, py0);
        targetCtx.globalCompositeOperation = 'lighter';
        const hSpin = now * 0.0038;
        draw3DGimbalOrbit(targetCtx, headR * 1.36, headR * 0.44, hSpin, hSpin * 2.2, '#ff1744', '#9f1239', true);
        draw3DGimbalOrbit(targetCtx, headR * 1.36, headR * 0.44, -hSpin + Math.PI * 0.5, -hSpin * 2.2, '#fbbf24', '#ea580c', true);
        targetCtx.restore();
      }

      // Internal 3D Spinning Double-Helix & Aurora Perimeter Wave
      const inHelixTick = now * 0.016;
      const hPerimTick = now * 0.012;
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < 2; s++) {
        const col = (s === 0) ? strandACol : strandBCol;
        targetCtx.strokeStyle = col;
        targetCtx.lineWidth = 2.0;
        targetCtx.beginPath();
        for (let step = -headR * 0.62; step <= headR * 0.62; step += 4.0) {
          const w = Math.sin(step * 0.24 + inHelixTick * (s === 0 ? 1 : -1)) * (headR * 0.35);
          if (step === -headR * 0.62) targetCtx.moveTo(px0 + step, py0 + w);
          else targetCtx.lineTo(px0 + step, py0 + w);
        }
        targetCtx.stroke();

        // Intertwined 3D Aurora Perimeter Wave
        targetCtx.beginPath();
        for (let ha = 0; ha <= 20; ha++) {
          const ang = (ha / 20) * Math.PI * 2;
          const wave = Math.sin(ang * 4 + hPerimTick * (s === 0 ? 2.6 : -2.6)) * 2.8;
          const hx = px0 + Math.cos(ang) * (headR + wave);
          const hy = py0 + Math.sin(ang) * (headR + wave);
          if (ha === 0) targetCtx.moveTo(hx, hy); else targetCtx.lineTo(hx, hy);
        }
        targetCtx.closePath();
        targetCtx.stroke();
      }
      targetCtx.restore();

      drawDiamondStarburst(targetCtx, px0 - headR * 0.62, py0 - headR * 0.62, (isPrime || isVolatile) ? 10.5 : 8.5, '#ffffff', strandACol);
      targetCtx.restore();

      // ── C. TRAILING STARLIGHT STARDUST & CACHED PEARLS (ZERO SHADOWBLUR!) ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.65 && p.stardust.length < 12) {
        const emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        const offWake = Math.sin(t - emSpine * 0.78) * waveAmp;
        const isA = Math.random() < 0.5;
        p.stardust.push({
          x: spinePts[emSpine].x + (isA ? offWake : -offWake),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * 6,
          alpha: 1.0,
          r: 1.3 + Math.random() * 2.0,
          isPearl: Math.random() < 0.5,
          color: isA ? strandACol : strandBCol
        });
      }
      for (let pi = p.stardust.length - 1; pi >= 0; pi--) {
        const sp = p.stardust[pi];
        if (sp.isPearl) {
          const pearlSpr = StarburstCache.getPearl(sp.color);
          if (pearlSpr) {
            targetCtx.globalAlpha = sp.alpha;
            const d = sp.r * 5.2;
            targetCtx.drawImage(pearlSpr, sp.x - d * 0.5, sp.y - d * 0.5, d, d);
            targetCtx.globalAlpha = 1.0;
          }
        } else {
          drawMicroStarburst(targetCtx, sp.x, sp.y, sp.r * 2.3, sp.color, sp.alpha);
        }
        sp.y -= 0.7;
        sp.alpha -= 0.04;
        if (sp.alpha <= 0) p.stardust.splice(pi, 1);
      }
    },

    // ══════════════════════════════════════════════════════════════
    // 3. CHROME METEOR: MOLTEN BOLIDES & LUXURY 4K CRYO-EMERALD SOUL-FIRE BOLIDE
    //    (Zero flat triangles! Uses 4K Emerald-Sapphire Magma Sphere + 14 Organic Soul-Fire Petals!)
    // ══════════════════════════════════════════════════════════════
    drawTier3MeteorParticle(targetCtx, p, now) {
      const headR = 26.0;
      const px0 = p.x;
      const py0 = p.y;
      const spinePts = p.spine;
      const K = spinePts.length;
      const nClass = p.nodeClass || 'standard';
      const isVolatile = (nClass === 'volatile');
      const isPrime = (nClass === 'prime');
      const isSplitter = (nClass === 'splitter');
      const isPhantom = (nClass === 'phantom');

      // Luxury Palette:
      // Volatile ("Must-Be-Avoided") -> Bioluminescent Cyber-Emerald (#00ffaa) & Ice-Cyan (#00f0ff) Soul-Fire!
      // Prime -> Supernova White-Gold (#ffffff / #fef08a)
      // Standard -> Solar Magma Orange (#f97316 / #fef08a)
      const fireOuterCol = isVolatile ? 'rgba(2, 132, 199, 0.55)' : (isPrime ? 'rgba(245, 158, 11, 0.55)' : 'rgba(234, 88, 12, 0.50)');
      const fireMidCol   = isVolatile ? 'rgba(16, 185, 129, 0.90)' : (isPrime ? 'rgba(254, 240, 138, 0.95)' : 'rgba(251, 146, 60, 0.88)');
      const fireCoreCol  = isVolatile ? 'rgba(167, 243, 208, 0.98)' : 'rgba(254, 240, 138, 0.98)';
      const petalColA    = isVolatile ? 'rgba(16, 185, 129, 0.82)' : 'rgba(249, 115, 22, 0.80)';
      const petalColB    = isVolatile ? 'rgba(110, 231, 183, 0.92)' : 'rgba(254, 240, 138, 0.90)';
      const accentStarCol = isVolatile ? '#00ffaa' : '#fef08a';

      // ── A. SUPERSONIC COMBUSTION TRAIL & MACH SHOCK-DIAMONDS ──
      const smokeSprite = MeteorVFXEngine.getSmoke();
      if (smokeSprite && K >= 3) {
        const puffR = headR * 1.45;
        targetCtx.save();
        targetCtx.globalAlpha = 0.28;
        targetCtx.drawImage(smokeSprite, spinePts[K - 1].x - puffR, spinePts[K - 1].y - puffR, puffR * 2, puffR * 2);
        targetCtx.restore();
      }

      const flameEndIdx = Math.min(K - 1, Math.max(2, (K * 0.88) | 0));
      const l1Grad = targetCtx.createLinearGradient(spinePts[flameEndIdx].x, spinePts[flameEndIdx].y, px0, py0);
      l1Grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
      l1Grad.addColorStop(0.4, fireOuterCol);
      l1Grad.addColorStop(1.0, fireMidCol);
      targetCtx.strokeStyle = l1Grad;
      targetCtx.lineWidth = headR * ((isPrime || isVolatile) ? 1.28 : 1.15);
      targetCtx.lineCap = 'round';
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (let sj = 1; sj <= flameEndIdx; sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.stroke();

      targetCtx.strokeStyle = fireCoreCol;
      targetCtx.lineWidth = headR * 0.58;
      targetCtx.stroke();

      // Supersonic Mach Shock-Diamonds Inside the Plume
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'lighter';
      targetCtx.beginPath();
      for (let md = 1; md < Math.min(K - 1, 5); md++) {
        const mdPt = spinePts[md];
        const mdScale = 1.0 - (md / 6) * 0.65;
        const mdW = headR * 0.46 * mdScale;
        const mdH = 8.5 * mdScale;
        targetCtx.moveTo(mdPt.x, mdPt.y - mdH);
        targetCtx.lineTo(mdPt.x + mdW, mdPt.y);
        targetCtx.lineTo(mdPt.x, mdPt.y + mdH);
        targetCtx.lineTo(mdPt.x - mdW, mdPt.y);
        targetCtx.closePath();
      }
      targetCtx.fillStyle = isVolatile ? 'rgba(167, 243, 208, 0.78)' : 'rgba(255, 255, 255, 0.75)';
      targetCtx.fill();
      targetCtx.restore();

      // ── B. 4K PHOTOREALISTIC VOLCANIC SPHERE HEAD (STANDARD, PRIME, SPLITTER, PHANTOM, VOLATILE) ──
      targetCtx.save();

      if (isPhantom) {
        const mShift = 6.5 + Math.sin(now * 0.02) * 3.5;
        targetCtx.save();
        targetCtx.globalCompositeOperation = 'lighter';
        targetCtx.globalAlpha = 0.42;
        const baseSpr = ParticleAssets.sphereSprites.meteor;
        if (baseSpr) {
          targetCtx.drawImage(baseSpr, px0 - headR - mShift, py0 - headR, headR * 2, headR * 2);
          targetCtx.drawImage(baseSpr, px0 - headR + mShift, py0 - headR, headR * 2, headR * 2);
        }
        targetCtx.restore();
      }

      if (isSplitter && !p.hasSplit) {
        const mSep = 8.0 + Math.sin(now * 0.025) * 3.0;
        const baseSpr = ParticleAssets.sphereSprites.meteor;
        if (baseSpr) {
          const subR = headR * 0.78;
          targetCtx.drawImage(baseSpr, px0 - mSep - subR, py0 - subR, subR * 2, subR * 2);
          targetCtx.drawImage(baseSpr, px0 + mSep - subR, py0 - subR, subR * 2, subR * 2);
        }
      }

      if (isPrime) {
        drawPrimeApexCrown(targetCtx, px0, py0, headR, now);
      }

      // Select Pre-Rendered 4K Volcanic Sphere (Volatile uses the 4K Cryo-Emerald & Sapphire Magma Sphere!)
      const sprM = isVolatile
        ? ParticleAssets.hazardSprites.meteor
        : (isPrime ? ParticleAssets.primeSprites.meteor : ParticleAssets.sphereSprites.meteor);

      if (sprM) {
        targetCtx.drawImage(sprM, px0 - headR, py0 - headR, headR * 2, headR * 2);
      }

      // 14 Fluid Organic Navier-Stokes Flame Petals Licking Around the 4K Sphere
      // (Batched into 2 passes for zero gradient overhead; burns in Cold Cyber-Emerald for Volatile!)
      const fFireTick = now * 0.036;
      const numTongues = 14;
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'lighter';
      for (let pass = 0; pass < 2; pass++) {
        targetCtx.beginPath();
        for (let fi = pass; fi < numTongues; fi += 2) {
          const fiAng = (fi / numTongues) * Math.PI * 2;
          const tipAng = fiAng + Math.sin(fFireTick * 2.5 + fi * 2.1) * 0.18;
          const fiLen = headR * (0.28 + Math.abs(Math.sin(fFireTick * 3.2 + fi * 1.9)) * 0.42);
          const baseAng1 = fiAng - 0.14, baseAng2 = fiAng + 0.14;
          const bx1 = px0 + Math.cos(baseAng1) * (headR * 0.94);
          const by1 = py0 + Math.sin(baseAng1) * (headR * 0.94);
          const bx2 = px0 + Math.cos(baseAng2) * (headR * 0.94);
          const by2 = py0 + Math.sin(baseAng2) * (headR * 0.94);
          const tipX = px0 + Math.cos(tipAng) * (headR + fiLen);
          const tipY = py0 + Math.sin(tipAng) * (headR + fiLen);
          const c1x = px0 + Math.cos(baseAng1 + 0.05) * (headR + fiLen * 0.45);
          const c1y = py0 + Math.sin(baseAng1 + 0.05) * (headR + fiLen * 0.45);
          const c2x = px0 + Math.cos(baseAng2 - 0.05) * (headR + fiLen * 0.45);
          const c2y = py0 + Math.sin(baseAng2 - 0.05) * (headR + fiLen * 0.45);
          targetCtx.moveTo(bx1, by1);
          targetCtx.quadraticCurveTo(c1x, c1y, tipX, tipY);
          targetCtx.quadraticCurveTo(c2x, c2y, bx2, by2);
          targetCtx.closePath();
        }
        targetCtx.fillStyle = pass === 0 ? petalColA : petalColB;
        targetCtx.fill();
      }
      targetCtx.restore();

      // LUXURY VOLATILE HAZARD CONTAINMENT: Twin Precessing 3D Cyber-Emerald & Sapphire Gyroscopic Gimbals
      if (isVolatile) {
        targetCtx.save();
        targetCtx.translate(px0, py0);
        targetCtx.globalCompositeOperation = 'lighter';
        const hSpin = now * 0.0038;
        draw3DGimbalOrbit(targetCtx, headR * 1.38, headR * 0.44, hSpin, hSpin * 2.2, '#00ffaa', '#059669', true);
        draw3DGimbalOrbit(targetCtx, headR * 1.38, headR * 0.44, -hSpin + Math.PI * 0.5, -hSpin * 2.2, '#00f0ff', '#0284c7', true);
        targetCtx.restore();
      } else {
        // Standard 3D Cinder Halo Front Starbursts
        const spinM = now * 0.0042;
        for (let fhb = 0; fhb < 4; fhb++) {
          const fhAng = spinM * 2.0 + (fhb * Math.PI / 2);
          if (Math.sin(fhAng) >= 0) {
            const fhDist = headR * 1.38;
            drawDiamondStarburst(targetCtx, px0 + Math.cos(fhAng) * fhDist, py0 + Math.sin(fhAng) * (fhDist * 0.42), 5.0, '#ffffff', accentStarCol);
          }
        }
      }

      drawDiamondStarburst(targetCtx, px0, py0, (isPrime || isVolatile) ? 10.0 : 7.5, '#ffffff', accentStarCol);
      targetCtx.restore();

      // ── C. TRAILING CINDER HALO EMBERS ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.65 && p.stardust.length < 12) {
        const emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        p.stardust.push({
          x: spinePts[emSpine].x + (Math.random() - 0.5) * (headR * 1.5),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * (headR * 1.5),
          alpha: 1.0,
          r: 1.1 + Math.random() * 2.2,
          color: isVolatile ? '#34d399' : (Math.random() < 0.68 ? '#fef08a' : '#f97316')
        });
      }
      for (let pi = p.stardust.length - 1; pi >= 0; pi--) {
        const sp = p.stardust[pi];
        targetCtx.beginPath();
        targetCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        targetCtx.fillStyle = sp.color;
        targetCtx.globalAlpha = sp.alpha;
        targetCtx.fill();
        targetCtx.globalAlpha = 1.0;
        sp.y -= 0.7;
        sp.alpha -= 0.04;
        if (sp.alpha <= 0) p.stardust.splice(pi, 1);
      }
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
      const tierRoman = state.coreTier === 3 ? 'III' : (state.coreTier === 2 ? 'II' : 'I');
      dom.tierVal.textContent = tierRoman;
      dom.tierVal.style.color = state.coreTier === 3 ? '#fef08a' : (state.coreTier === 2 ? '#38bdf8' : '#00f0ff');
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
    let lerpFactor = (deviceInputMode === 'touch') ? 0.36 : 0.22;
    if (state.catcherType === 'dynamo' || state.catcherType === 'realm') {
      lerpFactor = (deviceInputMode === 'touch') ? 0.44 : 0.28;
    } else if (state.catcherType === 'meteor') {
      lerpFactor = (deviceInputMode === 'touch') ? 0.30 : 0.18;
    }
    currentCatcherX += (targetCatcherX - currentCatcherX) * lerpFactor;
    state.catcherX = currentCatcherX;

    const catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
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

      // Calculate Core Evolution Tier (Tier I: 1-4x, Tier II: 5-9x, Tier III: 10x Overdrive)
      if (state.combo >= 10) {
        state.coreTier = 3;
        state.isOverdrive = true;
      } else if (state.combo >= 5) {
        state.coreTier = 2;
        state.isOverdrive = false;
      } else {
        state.coreTier = 1;
        state.isOverdrive = false;
      }

      // Check Overdrive status
      if (state.isOverdrive && state.overdriveEndTime && now > state.overdriveEndTime) {
        state.isOverdrive = false;
      }

      // ─────────────────────────────────────────────────────────────
      // RECOMMENDATION 4: ATMOSPHERIC DEPTH & ENVIRONMENTAL FIELD
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      if (state.catcherType === 'dynamo' || state.catcherType === 'realm') {
        const sweepY = (now * 0.08) % h;
        const sweepGrad = ctx.createLinearGradient(0, sweepY, 0, sweepY + 36);
        sweepGrad.addColorStop(0.0, "rgba(0, 240, 255, 0.0)");
        sweepGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.045)");
        sweepGrad.addColorStop(1.0, "rgba(0, 240, 255, 0.0)");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, sweepY, w, 36);
        for (let g = 0; g < 4; g++) {
          const gx = ((now * 0.03 + g * 110) % w);
          const gy = ((g * 190 + now * 0.015) % h);
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 240, 255, 0.45)";
          ctx.fill();
        }
      } else if (state.catcherType === 'helix') {
        const nebGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.7);
        nebGrad.addColorStop(0.0, "rgba(217, 70, 239, 0.035)");
        nebGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.025)");
        nebGrad.addColorStop(1.0, "transparent");
        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, w, h);
        for (let s = 0; s < 6; s++) {
          const sx = ((s * 75 + Math.sin(now * 0.001 + s) * 30 + w) % w);
          const sy = ((h - (now * 0.02 + s * 120) % h));
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = (s % 2 === 0) ? "rgba(34, 211, 238, 0.55)" : "rgba(217, 70, 239, 0.55)";
          ctx.fill();
        }
      } else {
        const horizGrad = ctx.createLinearGradient(0, h, 0, h - 220);
        horizGrad.addColorStop(0.0, "rgba(249, 115, 22, 0.12)");
        horizGrad.addColorStop(0.4, "rgba(234, 88, 12, 0.05)");
        horizGrad.addColorStop(1.0, "transparent");
        ctx.fillStyle = horizGrad;
        ctx.fillRect(0, h - 220, w, 220);
        for (let m = 0; m < 6; m++) {
          const mx = ((m * 85 + Math.sin(now * 0.002 + m) * 25 + w) % w);
          const my = ((h - ((now * 0.035 + m * 90) % 260)));
          ctx.beginPath();
          ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = (m % 2 === 0) ? "rgba(254, 240, 138, 0.65)" : "rgba(249, 115, 22, 0.55)";
          ctx.fill();
        }
      }
      ctx.restore();

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
        const px = pickFairLaneX();
        const actualSpeed = baseSpeed * normFactor;

        // Class Selection: Standard, Prime (10%), Volatile Hazard (12%), Splitter (12%), Phantom (12%)
        let nClass = 'standard';
        const randClass = Math.random();
        if (elapsedSec > 5.0 && randClass < 0.10) {
          nClass = 'prime';
        } else if (elapsedSec > 10.0 && randClass >= 0.10 && randClass < 0.22) {
          nClass = 'volatile'; // Hazard!
        } else if (elapsedSec > 7.0 && randClass >= 0.22 && randClass < 0.34) {
          nClass = 'splitter';
        } else if (elapsedSec > 6.0 && randClass >= 0.34 && randClass < 0.46) {
          nClass = 'phantom';
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
      // DRAW CHROME CORE WITH 3D GIMBALS & HOLOGRAPHIC IRIS SWEET SPOT
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      if (state.catcherType === 'helix') {
        const tilt = Math.max(-0.25, Math.min(0.25, state.catcherVelocity * 0.008));
        ctx.translate(catcherPixelX, catcherPixelY);
        ctx.rotate(tilt);
        QuantumRenderer.drawHelixCore(ctx, 0, 0, timestamp, 0.5, state.coreTier, state.corePhase, state.isOverdrive, isCoreLockedOn);
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

          // Braided Dual-Helix Tractor Tether with Streaming Energy Packets (Zero Plain Lines)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const tetherColA = (p.type === 'helix') ? '#22d3ee' : (p.type === 'meteor' ? '#fef08a' : '#00f0ff');
          const tetherColB = (p.type === 'helix') ? '#d946ef' : (p.type === 'meteor' ? '#f97316' : '#a855f7');
          const segs = 12;
          const perpX = -dyToCore / (distToCore || 1);
          const perpY = dxToCore / (distToCore || 1);

          for (let strand = 0; strand < 2; strand++) {
            ctx.beginPath();
            for (let s = 0; s <= segs; s++) {
              const u = s / segs;
              const env = Math.sin(u * Math.PI);
              const wave = Math.sin(u * Math.PI * 3 - now * 0.015 + strand * Math.PI) * 9.0 * env;
              const tx = p.x + dxToCore * u + perpX * wave;
              const ty = p.y + dyToCore * u + perpY * wave;
              if (s === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
            }
            ctx.strokeStyle = strand === 0 ? tetherColA : tetherColB;
            ctx.globalAlpha = 0.65 * gravStrength;
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }

          // 3 Streaming Photon Packets Traveling Along Tether Into Core
          for (let pk = 0; pk < 3; pk++) {
            const pu = ((now * 0.0035 + pk / 3) % 1.0);
            const pxk = p.x + dxToCore * pu;
            const pyk = p.y + dyToCore * pu;
            ctx.beginPath();
            ctx.arc(pxk, pyk, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.90 * gravStrength;
            ctx.fill();
          }
          ctx.restore();
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
            state.combo = state.coreTier === 2 ? 5 : 1;
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
      // RENDER MODE-SIGNATURE KINETIC IMPACT CHOREOGRAPHY (ZERO PLAIN RINGS)
      // ─────────────────────────────────────────────────────────────
      for (let ab = state.absorptionEffects.length - 1; ab >= 0; ab--) {
        const eff = state.absorptionEffects[ab];
        eff.radius += 7.8 * dtScale;
        eff.alpha -= 0.042 * dtScale;
        if (eff.alpha <= 0 || eff.radius >= eff.maxRadius) {
          state.absorptionEffects.splice(ab, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        if (eff.type === 'helix') {
          // Prismatic DNA Pearl Ring-Wave (12 Spiraling Cyan & Magenta Nucleotide Pearls)
          const pearls = 12;
          for (let pIdx = 0; pIdx < pearls; pIdx++) {
            const ang = (pIdx / pearls) * Math.PI * 2 + eff.radius * 0.025;
            const waveR = eff.radius + Math.sin(ang * 4 + now * 0.01) * 8;
            const px = eff.x + Math.cos(ang) * waveR;
            const py = eff.y + Math.sin(ang) * (waveR * 0.65);
            ctx.beginPath();
            ctx.arc(px, py, 3.2 * eff.alpha, 0, Math.PI * 2);
            ctx.fillStyle = (pIdx % 2 === 0) ? '#22d3ee' : '#d946ef';
            ctx.globalAlpha = eff.alpha;
            ctx.fill();
          }
        } else if (eff.type === 'meteor') {
          // Directional Volcanic Shock-Cone & Ricocheting Magma Cinders
          ctx.beginPath();
          ctx.arc(eff.x, eff.y, eff.radius, Math.PI * 1.12, Math.PI * 1.88);
          ctx.strokeStyle = `rgba(254, 240, 138, ${eff.alpha * 0.95})`;
          ctx.lineWidth = 4.5 * eff.alpha;
          ctx.stroke();

          for (let cIdx = 0; cIdx < 8; cIdx++) {
            const cAng = Math.PI * 1.15 + (cIdx / 7) * Math.PI * 0.70;
            const cx = eff.x + Math.cos(cAng) * (eff.radius * 0.92);
            const cy = eff.y + Math.sin(cAng) * (eff.radius * 0.92);
            ctx.beginPath();
            ctx.arc(cx, cy, 2.8 * eff.alpha, 0, Math.PI * 2);
            ctx.fillStyle = (cIdx % 2 === 0) ? '#fef08a' : '#f97316';
            ctx.globalAlpha = eff.alpha;
            ctx.fill();
          }
        } else {
          // Electromagnetic Singularity Implosion (Jagged Lightning Tendrils Snapping Inward)
          const tendrils = 8;
          for (let a = 0; a < tendrils; a++) {
            const arcAng = (a / tendrils) * Math.PI * 2 + now * 0.012;
            const outerR = eff.maxRadius - eff.radius * 0.75;
            const ax = eff.x + Math.cos(arcAng) * outerR;
            const ay = eff.y + Math.sin(arcAng) * outerR;
            const mx = (eff.x + ax) * 0.5 + Math.sin(now * 0.08 + a) * 10;
            const my = (eff.y + ay) * 0.5 + Math.cos(now * 0.08 + a) * 10;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(mx, my);
            ctx.lineTo(eff.x, eff.y);
            ctx.strokeStyle = (a % 2 === 0) ? `rgba(0, 240, 255, ${eff.alpha})` : `rgba(168, 85, 247, ${eff.alpha})`;
            ctx.lineWidth = 2.0;
            ctx.stroke();
          }
        }
        ctx.restore();
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

    // Keyboard bindings for Flux Pulse (Space) and Phase Switch (P / F / Shift)
    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'f' || e.key === 'F') {
        cycleCorePhase();
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
    setLevel: (lvl) => { state.mathLevel = lvl; }
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
