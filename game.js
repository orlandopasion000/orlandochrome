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

      // 1. Multi-harmonic organic rocky contour (cratered, chiseled asteroid silhouette)
      var SAMPLES = 36;
      var dTheta = (Math.PI * 2) / SAMPLES;
      var rPts = [];
      for (var s = 0; s < SAMPLES; s++) {
        var th = s * dTheta;
        var rVar = 1.0;
        rVar += Math.sin(th * 2 + type * 1.35) * 0.15;
        rVar += Math.sin(th * 3 - type * 2.1) * 0.09;
        rVar += Math.cos(th * 5 + type * 0.95) * 0.06;
        rVar += Math.sin(th * 7) * 0.04;
        if (type === 1) rVar += Math.cos(th * 2) * 0.12; // Iron-nickel angular facet
        if (type === 4) rVar += Math.sin(th * 2) * 0.18; // Elongated bolide
        rPts.push(baseR * Math.max(0.68, rVar));
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
  // 4K MASTER CELLPHONE & DESKTOP CORE SPRITES
  // (Conforming exactly to uploaded Dynamo, Helix, Meteor cores)
  // ─────────────────────────────────────────────────────────────
  const CoreAssets = {
    dynamo: new Image(),
    helix: new Image(),
    meteor: new Image(),
    loaded: { dynamo: false, helix: false, meteor: false }
  };
  CoreAssets.dynamo.onload = () => { CoreAssets.loaded.dynamo = true; };
  CoreAssets.dynamo.src = 'assets/core-dynamo-hd.jpg';
  CoreAssets.helix.onload = () => { CoreAssets.loaded.helix = true; };
  CoreAssets.helix.src = 'assets/core-helix-hd.jpg';
  CoreAssets.meteor.onload = () => { CoreAssets.loaded.meteor = true; };
  CoreAssets.meteor.src = 'assets/core-meteor-hd.jpg';

  const QuantumRenderer = {
    // 1. Quantum Dynamo / Player Atom Core Catcher
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      this.drawDynamoCore(ctx, cx, cy, now, progress);
    },

    drawDynamoCore(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      var t = now * 0.0016;
      var rotBase = now * 0.0004;
      var exc = (progress > 0) ? (progress * 0.35) : 0;

      // High-Definition Quantum Dynamo Artwork Core
      var img = CoreAssets.dynamo;
      if (img && (img.complete || CoreAssets.loaded.dynamo) && img.naturalWidth > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        var imgSize = 106 + exc * 22;
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.46, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();

        // Dynamic synchronized crackling micro-arcs around the golden orbits
        var eTick = (now * 0.09) | 0;
        for (var a = 0; a < 4; a++) {
          var baseAng = (a / 4) * Math.PI * 2 + eTick * 0.25;
          var rLen = 24 + (Math.sin(eTick * 2.3 + a) * 6);
          var endX = Math.cos(baseAng) * rLen;
          var endY = Math.sin(baseAng) * rLen;
          var midX = (endX * 0.5) + (Math.sin(eTick * 4.1 + a * 1.7) * 4);
          var midY = (endY * 0.5) + (Math.cos(eTick * 3.3 + a * 1.3) * 4);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
          ctx.lineWidth = 1.3;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(endX, endY, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }

        ctx.restore();
        return;
      }

      // 1. Photonic Lens Flares in Electric Cyan & Townsend Violet
      var flareLen = 46 + exc * 14;
      var flareW = 3.0 + exc * 1.2;
      var hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(0, 240, 255, 0)");
      hGrad.addColorStop(0.2, "rgba(56, 189, 248, 0.45)");
      hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.98)");
      hGrad.addColorStop(0.8, "rgba(168, 85, 247, 0.40)");
      hGrad.addColorStop(1.0, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Diagonal cross-flares
      for (var d = 0; d < 2; d++) {
        var dAngle = d === 0 ? (Math.PI / 3) : (-Math.PI / 3);
        ctx.save();
        ctx.rotate(dAngle);
        var dGrad = ctx.createLinearGradient(-flareLen * 0.75, 0, flareLen * 0.75, 0);
        dGrad.addColorStop(0.0, "rgba(0, 240, 255, 0)");
        dGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        dGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.moveTo(-flareLen * 0.75, 0);
        ctx.lineTo(0, -flareW * 0.6);
        ctx.lineTo(flareLen * 0.75, 0);
        ctx.lineTo(0, flareW * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Precessing 3D Bohr Probability Orbitals (Closed Magnetic Flux Loops)
      var ringRadii = [25 + exc * 4, 34 + exc * 6, 44 + exc * 8];
      var ringAngles = [
        rotBase * 1.5 + 0.35,
        -rotBase * 1.2 + 1.25,
        rotBase * 1.8 + 2.35
      ];
      var ringColors = [
        "rgba(0, 240, 255, 0.85)",
        "rgba(56, 189, 248, 0.75)",
        "rgba(168, 85, 247, 0.70)"
      ];

      for (var r = 0; r < 3; r++) {
        ctx.save();
        ctx.rotate(ringAngles[r]);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadii[r], ringRadii[r] * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ringColors[r];
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Cyclotron Gyration Electron Node Spark
        var nodeAngle = t * (2.2 + r * 0.7);
        var nx = Math.cos(nodeAngle) * ringRadii[r];
        var ny = Math.sin(nodeAngle) * (ringRadii[r] * 0.45);
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = ringColors[r];
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 3. Fast Crackling Tesla Arcs inside Catcher Core (5 stochastic lightning branches)
      var eTick = (now * 0.08) | 0;
      for (var a = 0; a < 5; a++) {
        var baseAng = (a / 5) * Math.PI * 2 + eTick * 0.2;
        var rLen = 14 + (Math.sin(eTick * 2.3 + a) * 4);
        var endX = Math.cos(baseAng) * rLen;
        var endY = Math.sin(baseAng) * rLen;
        var midX = (endX * 0.5) + (Math.sin(eTick * 4.1 + a * 1.7) * 4);
        var midY = (endY * 0.5) + (Math.cos(eTick * 3.3 + a * 1.3) * 4);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(midX, midY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // 4. Cathode Singularity Nucleus Core
      var coreR = 11 + exc * 3;
      var coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      coreGrad.addColorStop(0.0, "#ffffff");
      coreGrad.addColorStop(0.35, "#38bdf8");
      coreGrad.addColorStop(0.75, "#0284c7");
      coreGrad.addColorStop(1.0, "rgba(168, 85, 247, 0.25)");
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    },

    // 2. Quantum Helix Catcher Core
    drawHelixCore(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      var t = now * 0.003;
      var exc = progress * 0.4;

      // High-Definition Quantum Helix Artwork Core
      var img = CoreAssets.helix;
      if (img && (img.complete || CoreAssets.loaded.helix) && img.naturalWidth > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        var imgSize = 106 + exc * 22;
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.46, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();

        // Luminous bioluminescent sparkle motes orbiting the crystal orb
        for (var s = 0; s < 4; s++) {
          var sAng = t * 1.8 + (s * Math.PI / 2);
          var sRad = 48 + Math.sin(t * 3 + s) * 6;
          var sx = Math.cos(sAng) * sRad;
          var sy = Math.sin(sAng) * (sRad * 0.45);

          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = (s % 2 === 0) ? "#22d3ee" : "#d946ef";
          ctx.shadowColor = (s % 2 === 0) ? "#00f0ff" : "#f43f5e";
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        ctx.restore();
        return;
      }

      // Soliton waveguide glow
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 32 + exc * 10);
      g.addColorStop(0.0, "rgba(255, 255, 255, 0.95)");
      g.addColorStop(0.35, "rgba(34, 211, 238, 0.75)");
      g.addColorStop(0.70, "rgba(217, 70, 239, 0.40)");
      g.addColorStop(1.0, "transparent");
      ctx.beginPath();
      ctx.arc(0, 0, 32 + exc * 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Intertwined double strand
      ctx.lineWidth = 2.2;
      for (var s = 0; s < 2; s++) {
        var isCyan = s === 0;
        ctx.strokeStyle = isCyan ? "#22d3ee" : "#d946ef";
        ctx.beginPath();
        for (var x = -28; x <= 28; x += 3) {
          var y = Math.sin(x * 0.15 + t * (isCyan ? 1 : -1)) * (10 + exc * 3);
          if (x === -28) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Base-pair rungs with energized pearls
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = "rgba(224, 231, 255, 0.65)";
      for (var rx = -24; rx <= 24; rx += 8) {
        var y1 = Math.sin(rx * 0.15 + t) * (10 + exc * 3);
        var y2 = Math.sin(rx * 0.15 - t) * (10 + exc * 3);
        ctx.beginPath();
        ctx.moveTo(rx, y1);
        ctx.lineTo(rx, y2);
        ctx.stroke();

        // Nucleotide pearl
        ctx.beginPath();
        ctx.arc(rx, (y1 + y2) * 0.5, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      ctx.restore();
    },

    // 3. Quantum Meteor Catcher Asteroid
    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      var exc = progress * 0.45;

      // High-Definition Quantum Meteor Artwork Core
      var img = CoreAssets.meteor;
      if (img && (img.complete || CoreAssets.loaded.meteor) && img.naturalWidth > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        var imgSize = 106 + exc * 22;
        ctx.beginPath();
        ctx.arc(0, 0, imgSize * 0.46, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();

        // Supersonic Detached Bow Shockwave Arc ahead of catcher
        ctx.beginPath();
        ctx.arc(0, -6, 38 + exc * 8, Math.PI * 1.15, Math.PI * 1.85);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 2.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -6, 40 + exc * 8, Math.PI * 1.15, Math.PI * 1.85);
        ctx.strokeStyle = "rgba(254, 240, 138, 0.55)";
        ctx.lineWidth = 5.0;
        ctx.stroke();

        // Floating incandescent cinder embers rising from molten surface
        var eTick = (now * 0.003);
        for (var m = 0; m < 5; m++) {
          var mx = Math.sin(eTick * 2.5 + m * 1.4) * 28;
          var my = -16 - ((now * 0.04 + m * 18) % 36);
          ctx.beginPath();
          ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = (m % 2 === 0) ? "#fef08a" : "#f97316";
          ctx.shadowColor = "#f97316";
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
        return;
      }

      // Supersonic Detached Bow Shockwave Arc ahead of catcher
      ctx.beginPath();
      ctx.arc(0, -6, 32 + exc * 8, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 3.0;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -6, 34 + exc * 8, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "rgba(254, 240, 138, 0.55)";
      ctx.lineWidth = 6.0;
      ctx.stroke();

      // Asteroid Body
      var ast = MeteorVFXEngine.getAsteroid(0);
      if (ast) {
        ctx.drawImage(ast, -26, -26, 52, 52);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#3d2b20";
        ctx.fill();
      }

      // Bubbling Magma Fissures
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(254, 240, 138, 0.9)";
      ctx.shadowColor = "#f97316";
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.restore();
    },

    // ══════════════════════════════════════════════════════════════
    // 4. CHROME DYNAMO: QUANTUM WAVEPACKET WITH INTENSE ELECTRICITY
    // ══════════════════════════════════════════════════════════════
    drawTier3RealmParticle(targetCtx, p, now) {
      this.drawTier3DynamoParticle(targetCtx, p, now);
    },

    drawTier3DynamoParticle(targetCtx, p, now) {
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var spinePts = p.spine;
      var K = spinePts.length;
      var renderAlpha = 0.98;

      // ── A. WAVEPACKET PROBABILITY TAIL & LUMINOUS ENERGY HULL ──
      if (K >= 2) {
        var tailTipX = spinePts[K - 1].x;
        var tailTipY = spinePts[K - 1].y;

        // Outer Quantum Envelope (Tapered Probability Hull)
        var bodyGrad = targetCtx.createLinearGradient(tailTipX, tailTipY, px0, py0);
        bodyGrad.addColorStop(0.0, "rgba(168, 85, 247, 0.0)");
        bodyGrad.addColorStop(0.35, "rgba(168, 85, 247, 0.28)");
        bodyGrad.addColorStop(0.72, "rgba(56, 189, 248, 0.65)");
        bodyGrad.addColorStop(1.0, "rgba(0, 240, 255, 0.95)");
        targetCtx.fillStyle = bodyGrad;

        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x - headR * 0.9, spinePts[0].y);
        for (var sj = 1; sj < K; sj++) {
          var taper = 1.0 - (sj / K) * 0.85;
          targetCtx.lineTo(spinePts[sj].x - headR * 0.9 * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(tailTipX, tailTipY);
        for (var sj = K - 1; sj >= 1; sj--) {
          var taper = 1.0 - (sj / K) * 0.85;
          targetCtx.lineTo(spinePts[sj].x + headR * 0.9 * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(spinePts[0].x + headR * 0.9, spinePts[0].y);
        targetCtx.closePath();
        targetCtx.fill();

        // ── B. HIGH-VOLTAGE DISPLACEMENT CURRENT LIGHTNING SPINE ──
        // (Crackling electric arcs along tail spine with high-speed micro-jitter)
        var eTick = (now * 0.08) | 0;

        // Pass 1: Ionized Plasma Sheath
        targetCtx.lineCap = "round";
        targetCtx.lineJoin = "round";
        targetCtx.strokeStyle = "rgba(0, 240, 255, 0.48)";
        targetCtx.lineWidth = Math.max(3.0, headR * 0.55);
        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
        for (var ej = 1; ej < K; ej++) {
          var jWave = Math.sin(eTick * 2.8 + ej * 3.4) * 8.5;
          targetCtx.lineTo(spinePts[ej].x + jWave, spinePts[ej].y);
        }
        targetCtx.stroke();

        // Pass 2: Razor-Crisp Incandescent Lightning Bolt Core
        targetCtx.strokeStyle = "rgba(255, 255, 255, 0.98)";
        targetCtx.lineWidth = Math.max(1.5, headR * 0.22);
        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
        for (var ej = 1; ej < K; ej++) {
          var jWave = Math.sin(eTick * 2.8 + ej * 3.4) * 8.5;
          targetCtx.lineTo(spinePts[ej].x + jWave, spinePts[ej].y);
        }
        targetCtx.stroke();

        // Pass 3: Secondary Branched Lightning Bolts Splitting Off Tail
        for (var b = 1; b < K - 1; b += 2) {
          var bSide = ((b + eTick) % 2 === 0) ? 1 : -1;
          var bStartX = spinePts[b].x + Math.sin(eTick * 2.8 + b * 3.4) * 8.5;
          var bStartY = spinePts[b].y;
          var bLen = headR * 1.25;
          var bEndX = bStartX + bSide * bLen;
          var bEndY = bStartY - 10 + Math.sin(eTick * 3.5 + b) * 8;

          targetCtx.beginPath();
          targetCtx.moveTo(bStartX, bStartY);
          targetCtx.lineTo((bStartX + bEndX) * 0.5 + (Math.sin(eTick * 5 + b) * 5), (bStartY + bEndY) * 0.5);
          targetCtx.lineTo(bEndX, bEndY);
          targetCtx.strokeStyle = "rgba(0, 240, 255, 0.85)";
          targetCtx.lineWidth = 1.4;
          targetCtx.stroke();
          targetCtx.strokeStyle = "#ffffff";
          targetCtx.lineWidth = 0.8;
          targetCtx.stroke();
        }

        // Pre-rendered Electric Spark Sprites hugging the tail wake
        var eSpark = MeteorVFXEngine.getElectricSpark();
        if (eSpark && K >= 3) {
          for (var sIdx = 1; sIdx < Math.min(K, 6); sIdx += 2) {
            var sLat = Math.sin(now * 0.02 + sIdx * 1.5) * (headR * 0.45);
            targetCtx.drawImage(eSpark, spinePts[sIdx].x + sLat - 12, spinePts[sIdx].y - 12, 24, 24);
          }
        }
      }

      // ── C. CATHODE SINGULARITY HEAD WITH TOO MUCH ELECTRICITY ──
      // 1. Townsend Violet Outer Corona
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR * 1.45, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(168, 85, 247, 0.28)";
      targetCtx.fill();

      // 2. Electric Cyan Plasma Sheath
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(0, 240, 255, 0.95)";
      targetCtx.fill();

      // 3. FAST ANIMATED CRACKLING TESLA ARCS (8 Arcs radiating with micro-jitter)
      var eTickHead = (now * 0.09) | 0;
      for (var arc = 0; arc < 8; arc++) {
        var baseAngle = (arc / 8) * Math.PI * 2 + (eTickHead * 0.15);
        var arcLen = headR * (0.95 + Math.sin(eTickHead * 3.7 + arc * 2.1) * 0.25);
        var targetX = px0 + Math.cos(baseAngle) * arcLen;
        var targetY = py0 + Math.sin(baseAngle) * arcLen;
        var j1X = px0 + Math.cos(baseAngle) * (arcLen * 0.35) + Math.sin(eTickHead * 4.9 + arc) * 4.5;
        var j1Y = py0 + Math.sin(baseAngle) * (arcLen * 0.35) + Math.cos(eTickHead * 4.2 + arc) * 4.5;
        var j2X = px0 + Math.cos(baseAngle) * (arcLen * 0.70) - Math.sin(eTickHead * 3.1 + arc) * 4.5;
        var j2Y = py0 + Math.sin(baseAngle) * (arcLen * 0.70) + Math.cos(eTickHead * 3.8 + arc) * 4.5;

        targetCtx.beginPath();
        targetCtx.moveTo(px0, py0);
        targetCtx.lineTo(j1X, j1Y);
        targetCtx.lineTo(j2X, j2Y);
        targetCtx.lineTo(targetX, targetY);

        targetCtx.strokeStyle = "rgba(0, 240, 255, 0.85)";
        targetCtx.lineWidth = 1.8;
        targetCtx.stroke();

        targetCtx.strokeStyle = "#ffffff";
        targetCtx.lineWidth = 0.9;
        targetCtx.stroke();
      }

      // 4. Pure White Singularity Core
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR * 0.42, 0, Math.PI * 2);
      targetCtx.fillStyle = "#ffffff";
      targetCtx.fill();

      // 5. Precessing Faraday Induction Loops with Cyclotron Node Spark
      var orbR = headR * 2.65;
      var fSpin = now * 0.0035;
      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbR * 1.25, orbR * 0.70, heading + fSpin, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(0, 240, 255, 0.42)";
      targetCtx.lineWidth = 1.35;
      targetCtx.stroke();

      var cycAng = heading + fSpin;
      var cycX = px0 + Math.cos(cycAng) * (orbR * 1.25);
      var cycY = py0 + Math.sin(cycAng) * (orbR * 0.70);
      targetCtx.beginPath();
      targetCtx.arc(cycX, cycY, 2.5, 0, Math.PI * 2);
      targetCtx.fillStyle = "#ffffff";
      targetCtx.fill();

      // ── D. TRAILING ELECTRIC WAKE PARTICLES (p.stardust) ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.75 && p.stardust.length < 16) {
        var emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        p.stardust.push({
          x: spinePts[emSpine].x + (Math.random() - 0.5) * (headR * 1.4),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * (headR * 1.4),
          alpha: 1.0,
          r: 1.0 + Math.random() * 2.2,
          isCyan: Math.random() < 0.7
        });
      }

      // Render Trailing Wake Particles
      for (var pi = p.stardust.length - 1; pi >= 0; pi--) {
        var sp = p.stardust[pi];
        targetCtx.beginPath();
        targetCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        targetCtx.fillStyle = sp.isCyan ? "rgba(0, 240, 255, " + sp.alpha.toFixed(2) + ")" : "rgba(168, 85, 247, " + sp.alpha.toFixed(2) + ")";
        targetCtx.fill();
        sp.y -= 0.6;
        sp.alpha -= 0.035;
        if (sp.alpha <= 0) p.stardust.splice(pi, 1);
      }
    },

    // ══════════════════════════════════════════════════════════════
    // 5. CHROME HELIX: BIOLUMINESCENT DNA HELIX
    // ══════════════════════════════════════════════════════════════
    drawTier3HelixParticle(targetCtx, p, now) {
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var spinePts = p.spine;
      var K = spinePts.length;
      var strandWidth = Math.max(2.2, headR * 0.42);
      var waveAmp = 15;
      var t = now * 0.0032;

      // ── A. CENTRAL HARMONIC PHASE-BEAM (OPTICAL SOLITON CONDUIT) ──
      targetCtx.beginPath();
      targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
      for (var sj = 1; sj < K; sj++) {
        targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      }
      targetCtx.strokeStyle = "rgba(207, 250, 254, 0.95)";
      targetCtx.lineWidth = Math.max(1.4, headR * 0.22);
      targetCtx.stroke();

      // ── B. PRECISION BASE-PAIR RUNGS & ENERGIZED NUCLEOTIDE PEARLS ──
      targetCtx.strokeStyle = "rgba(224, 231, 255, 0.65)";
      targetCtx.lineWidth = 1.35;
      for (var rk = 1; rk < K - 1; rk++) {
        var offset = Math.sin(t - rk * 0.75) * waveAmp;
        var r1X = spinePts[rk].x + offset;
        var r2X = spinePts[rk].x - offset;
        var rY = spinePts[rk].y;

        targetCtx.beginPath();
        targetCtx.moveTo(r1X, rY);
        targetCtx.lineTo(r2X, rY);
        targetCtx.stroke();

        // Energized Nucleotide Pearl at strand contacts
        targetCtx.beginPath();
        targetCtx.arc(r1X, rY, 2.4, 0, Math.PI * 2);
        targetCtx.fillStyle = "#ffffff";
        targetCtx.fill();

        targetCtx.beginPath();
        targetCtx.arc(r2X, rY, 2.4, 0, Math.PI * 2);
        targetCtx.fillStyle = "#ffffff";
        targetCtx.fill();
      }

      // ── C. TWIN SILKY HELIX RIBBONS (CYAN & ROYAL MAGENTA) ──
      // Strand 1: Cyan Ribbon
      targetCtx.lineCap = "round";
      targetCtx.lineJoin = "round";
      targetCtx.strokeStyle = "rgba(34, 211, 238, 0.98)";
      targetCtx.lineWidth = strandWidth;
      targetCtx.beginPath();
      for (var sj = 0; sj < K; sj++) {
        var offset = Math.sin(t - sj * 0.75) * waveAmp;
        var sx = spinePts[sj].x + offset;
        var sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.stroke();

      // Strand 2: Royal Magenta Ribbon
      targetCtx.strokeStyle = "rgba(217, 70, 239, 0.98)";
      targetCtx.lineWidth = strandWidth;
      targetCtx.beginPath();
      for (var sj = 0; sj < K; sj++) {
        var offset = -Math.sin(t - sj * 0.75) * waveAmp;
        var sx = spinePts[sj].x + offset;
        var sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.stroke();

      // Pre-rendered Bi-Chromatic Nucleotide Sparks
      var cyanSpark = MeteorVFXEngine.getHelixSpark(false);
      var magSpark = MeteorVFXEngine.getHelixSpark(true);
      if (cyanSpark && magSpark && K >= 3) {
        for (var hIdx = 1; hIdx < Math.min(K, 6); hIdx += 2) {
          var offH = Math.sin(t - hIdx * 0.75) * waveAmp;
          targetCtx.drawImage(cyanSpark, spinePts[hIdx].x + offH - 12, spinePts[hIdx].y - 12, 24, 24);
          targetCtx.drawImage(magSpark, spinePts[hIdx].x - offH - 12, spinePts[hIdx].y - 12, 24, 24);
        }
      }

      // ── D. LEADING NUCLEUS HEAD ──
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR * 1.35, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(34, 211, 238, 0.32)";
      targetCtx.fill();

      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
      targetCtx.fillStyle = "hsla(188, 98%, 74%, 0.98)";
      targetCtx.fill();

      // Intense White Singularity
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR * 0.44, 0, Math.PI * 2);
      targetCtx.fillStyle = "#ffffff";
      targetCtx.fill();

      // Bi-Chromatic Orbitals
      var orbR = headR * 2.85;
      var worldSpin = heading + now * 0.0032;
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, orbR * 0.85, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      targetCtx.lineWidth = 1.25;
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbR * 1.35, orbR * 0.75, worldSpin, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(217, 70, 239, 0.42)";
      targetCtx.lineWidth = 1.15;
      targetCtx.stroke();

      // ── E. TRAILING DUAL-STRAND WAKE SPORES (p.stardust) ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.75 && p.stardust.length < 16) {
        var emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        var offWake = Math.sin(t - emSpine * 0.75) * waveAmp;
        var isCyanSpore = Math.random() < 0.5;
        p.stardust.push({
          x: spinePts[emSpine].x + (isCyanSpore ? offWake : -offWake),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * 6,
          alpha: 1.0,
          r: 1.0 + Math.random() * 2.2,
          isCyan: isCyanSpore
        });
      }

      for (var pi = p.stardust.length - 1; pi >= 0; pi--) {
        var sp = p.stardust[pi];
        targetCtx.beginPath();
        targetCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        targetCtx.fillStyle = sp.isCyan ? "rgba(34, 211, 238, " + sp.alpha.toFixed(2) + ")" : "rgba(217, 70, 239, " + sp.alpha.toFixed(2) + ")";
        targetCtx.fill();
        sp.y -= 0.6;
        sp.alpha -= 0.035;
        if (sp.alpha <= 0) p.stardust.splice(pi, 1);
      }
    },

    // ══════════════════════════════════════════════════════════════
    // 6. CHROME METEOR: HYPERVELOCITY METEOR WITH REAL FIRE & BOW SHOCK
    // ══════════════════════════════════════════════════════════════
    drawTier3MeteorParticle(targetCtx, p, now) {
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var spinePts = p.spine;
      var K = spinePts.length;

      // ── A. RAYLEIGH-TAYLOR CONVECTIVE SMOKE PLUMES ──
      var smokeSprite = MeteorVFXEngine.getSmoke();
      if (smokeSprite && K >= 3) {
        var puffR = headR * 1.55;
        targetCtx.save();
        targetCtx.globalAlpha = 0.35;
        targetCtx.drawImage(smokeSprite, spinePts[K - 1].x - puffR, spinePts[K - 1].y - puffR, puffR * 2, puffR * 2);
        targetCtx.drawImage(smokeSprite, spinePts[K - 2].x - puffR * 0.8, spinePts[K - 2].y - puffR * 0.8, puffR * 1.6, puffR * 1.6);
        targetCtx.restore();
      }

      // ── B. 4-LAYER CONVECTIVE COMBUSTION FLAME TAIL ──
      var flameEndIdx = Math.min(K - 1, Math.max(2, (K * 0.85) | 0));

      // Layer 1: Outer Deep Thermal Plume
      var l1Grad = targetCtx.createLinearGradient(spinePts[flameEndIdx].x, spinePts[flameEndIdx].y, px0, py0);
      l1Grad.addColorStop(0.0, "rgba(185, 28, 28, 0.0)");
      l1Grad.addColorStop(0.4, "rgba(234, 88, 12, 0.45)");
      l1Grad.addColorStop(1.0, "rgba(251, 146, 60, 0.85)");
      targetCtx.strokeStyle = l1Grad;
      targetCtx.lineWidth = Math.max(4.0, headR * 1.15);
      targetCtx.lineCap = "round";
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (var sj = 1; sj <= flameEndIdx; sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.stroke();

      // Layer 2: Magma Mantle Orange
      var l2Grad = targetCtx.createLinearGradient(spinePts[flameEndIdx].x, spinePts[flameEndIdx].y, px0, py0);
      l2Grad.addColorStop(0.0, "rgba(234, 88, 12, 0.0)");
      l2Grad.addColorStop(0.5, "rgba(249, 115, 22, 0.75)");
      l2Grad.addColorStop(1.0, "rgba(254, 240, 138, 0.95)");
      targetCtx.strokeStyle = l2Grad;
      targetCtx.lineWidth = Math.max(2.5, headR * 0.75);
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (var sj = 1; sj <= flameEndIdx; sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.stroke();

      // Layer 3: Searing Gold Flame Tongue
      var l3Grad = targetCtx.createLinearGradient(spinePts[flameEndIdx - 1].x, spinePts[flameEndIdx - 1].y, px0, py0);
      l3Grad.addColorStop(0.0, "rgba(249, 115, 22, 0.0)");
      l3Grad.addColorStop(0.6, "rgba(254, 240, 138, 0.95)");
      l3Grad.addColorStop(1.0, "#ffffff");
      targetCtx.strokeStyle = l3Grad;
      targetCtx.lineWidth = Math.max(1.5, headR * 0.45);
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (var sj = 1; sj < flameEndIdx; sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.stroke();

      // Layer 4: Incandescent White Core Tongue
      targetCtx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      targetCtx.lineWidth = Math.max(1.0, headR * 0.20);
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (var sj = 1; sj < Math.min(K, 4); sj++) targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      targetCtx.stroke();

      // ── C. DETACHED SUPERSONIC BOW SHOCKWAVE ARC ──
      var rockR = headR * 1.35;
      targetCtx.beginPath();
      targetCtx.arc(px0, py0 + 4, rockR * 1.35, Math.PI * 0.15, Math.PI * 0.85);
      targetCtx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      targetCtx.lineWidth = 3.2;
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.arc(px0, py0 + 4, rockR * 1.45, Math.PI * 0.15, Math.PI * 0.85);
      targetCtx.strokeStyle = "rgba(254, 240, 138, 0.50)";
      targetCtx.lineWidth = 6.5;
      targetCtx.stroke();

      // ── D. 3D MOLTEN BASALT ASTEROID CORE & PLANCK FISSURES ──
      var astCanvas = MeteorVFXEngine.getAsteroid(0);
      if (astCanvas) {
        targetCtx.save();
        targetCtx.translate(px0, py0);
        targetCtx.rotate(heading);
        targetCtx.drawImage(astCanvas, -rockR, -rockR, rockR * 2, rockR * 2);
        targetCtx.restore();
      } else {
        targetCtx.beginPath();
        targetCtx.arc(px0, py0, rockR, 0, Math.PI * 2);
        targetCtx.fillStyle = "#3d2b20";
        targetCtx.fill();
      }

      // Bubbling Magma Core
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, rockR * 0.35, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(254, 240, 138, 0.95)";
      targetCtx.shadowColor = "#f97316";
      targetCtx.shadowBlur = 14;
      targetCtx.fill();
      targetCtx.shadowBlur = 0;

      // ── E. INCANDESCENT EMBER STORM & ORBITAL RINGS ──
      var orbR = rockR * 2.10;
      var spinM = now * 0.0035;
      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbR * 1.25, orbR * 0.70, heading + spinM, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(251, 146, 60, 0.45)";
      targetCtx.lineWidth = 1.35;
      targetCtx.stroke();

      // Pre-rendered Ember Sprite
      var emberSprite = MeteorVFXEngine.getEmber();
      if (emberSprite) {
        var eAng = heading + spinM;
        var ex = px0 + Math.cos(eAng) * (orbR * 1.25);
        var ey = py0 + Math.sin(eAng) * (orbR * 0.70);
        targetCtx.drawImage(emberSprite, ex - 12, ey - 12, 24, 24);
      }

      // ── F. TRAILING CINDER PARTICLES (p.stardust) ──
      if (!p.stardust) p.stardust = [];
      if (Math.random() < 0.75 && p.stardust.length < 16) {
        var emSpine = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
        p.stardust.push({
          x: spinePts[emSpine].x + (Math.random() - 0.5) * (headR * 1.5),
          y: spinePts[emSpine].y + (Math.random() - 0.5) * (headR * 1.5),
          alpha: 1.0,
          r: 1.0 + Math.random() * 2.4,
          isGold: Math.random() < 0.6
        });
      }

      for (var pi = p.stardust.length - 1; pi >= 0; pi--) {
        var sp = p.stardust[pi];
        targetCtx.beginPath();
        targetCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        targetCtx.fillStyle = sp.isGold ? "rgba(254, 240, 138, " + sp.alpha.toFixed(2) + ")" : "rgba(249, 115, 22, " + sp.alpha.toFixed(2) + ")";
        targetCtx.fill();
        sp.y -= 0.6;
        sp.alpha -= 0.035;
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
      ? 'DRAG FINGER TO MOVE · DEFLECT PARTICLES'
      : 'TRACKPAD / MOUSE · DEFLECT PARTICLES';
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
      dom.gameSub.textContent = `Profile Synapse Wave Catcher · Wave ${state.currentWave} · 10 Shield Units`;
    } else if (state.gameType === 'helix') {
      dom.gameTitle.textContent = 'CHROME HELIX';
      dom.gameSub.textContent = `Dual-Thread Task Synchronizer · Wave ${state.currentWave} · 10 Shield Units`;
    } else if (state.gameType === 'meteor') {
      dom.gameTitle.textContent = 'CHROME METEOR';
      dom.gameSub.textContent = `Task Surge Asteroid Deflector · Wave ${state.currentWave} · 10 Shield Units`;
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
      dynamo: '⚡ ACTIVE CORE: CHROME DYNAMO (Catch Synapse Waves!)',
      realm: '⚡ ACTIVE CORE: CHROME DYNAMO (Catch Synapse Waves!)',
      helix: '🧬 ACTIVE CORE: CHROME HELIX (Catch Dual-Strands!)',
      meteor: '☄️ ACTIVE CORE: CHROME METEOR (Deflect Molten Surges!)'
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

    // Smooth Linear Interpolation (Lerp) for Catcher Movement:
    const lerpFactor = (deviceInputMode === 'touch') ? 0.35 : 0.22;
    currentCatcherX += (targetCatcherX - currentCatcherX) * lerpFactor;
    state.catcherX = currentCatcherX;

    const catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
    
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
    // MODE B: CHROME DYNAMO, CHROME HELIX, CHROME METEOR
    // ─────────────────────────────────────────────────────────────
    else {
      // ─────────────────────────────────────────────────────────────
        // ─────────────────────────────────────────────────────────────
        // WAVE ADVANCEMENT & ACCELERATION ARCHITECTURE
        // ─────────────────────────────────────────────────────────────
        // Wave progression: 1 wave every 1000 points.
        const calculatedWave = Math.min(10, Math.floor(state.score / 1000) + 1);
        if (calculatedWave > state.currentWave) {
          state.currentWave = calculatedWave;
          audio.playVictoryFanfare();
          state.floatingTexts.push({
            text: `⚡ WAVE ${state.currentWave}: ACCELERATION!`,
            x: w / 2,
            y: h / 2 - 40,
            color: '#00f0ff',
            alpha: 1.0,
            vy: -1.0
          });
          updateHeaderUI();
        }

        // Particle Density Gating:
        // Wave 1 begins extra calm and relaxing:
        // - From 0 to 350 pts: strictly 1 particle on screen at a time!
        // - From 350 to 1000 pts: max 2 particles.
        // - Wave 2: max 2 particles.
        // - Wave 3: max 3 particles.
        // - Wave 4: max 3 particles.
        // - Wave 5+: max 4 particles.
        const maxParticles = (state.currentWave === 1) 
          ? (state.score < 350 ? 1 : 2) 
          : (state.currentWave === 2 ? 2 : (state.currentWave === 3 ? 3 : 4));
        const baseSpawn = (state.currentWave === 1) ? 0.010 : (0.014 + (state.currentWave - 1) * 0.003);
        const spawnRate = Math.min(0.035, baseSpawn);

        // Responsive Screen Height Normalization & Wave Speed Ramp:
        // normFactor ensures identical travel time across all phone & desktop screens
        const normFactor = Math.max(0.70, Math.min(1.20, h / 800));
        // Gentle +5% velocity increase per wave:
        const speedMult = 1.0 + (state.currentWave - 1) * 0.05;

        if (state.particles.length < maxParticles && Math.random() < spawnRate) {
          let pType = (state.gameType === 'realm') ? 'dynamo' : state.gameType;
          const px = Math.random() * (w - 140) + 70;

          // Gentle, predictable, relaxed starting velocity:
          const baseSpeed = (0.75 + Math.random() * 0.30) * normFactor;
          const actualSpeed = baseSpeed * speedMult;

        const p = {
          type: pType,
          x: px,
          y: -45,
          speed: actualSpeed,
          baseSpeed: baseSpeed,
          headR: 24.0,
          spine: [],
          stardust: []
        };

        for (let j = 0; j < 8; j++) {
          p.spine.push({ x: px, y: -45 - j * 8.5 });
        }
        state.particles.push(p);
      }

      // Draw designated Quantum Core Catcher
      if (state.catcherType === 'dynamo' || state.catcherType === 'realm') {
        QuantumRenderer.drawDynamoCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
      } else if (state.catcherType === 'helix') {
        QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
      } else {
        QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
      }

      // Update & Render Flagship Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.y += p.speed;

        // Update spine IK
        p.spine[0].x = p.x;
        p.spine[0].y = p.y;
        for (let j = 1; j < p.spine.length; j++) {
          p.spine[j].y = p.y - j * 8.5;
          p.spine[j].x = p.x + Math.sin(timestamp * 0.005 + j * 0.6) * (j * 1.1);
        }

        // Render Particle
        if (p.type === 'dynamo' || p.type === 'realm') {
          QuantumRenderer.drawTier3DynamoParticle(ctx, p, timestamp);
        } else if (p.type === 'helix') {
          QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
        } else {
          QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
        }

        // Collision Check with Catcher
        const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
        // Contact radius: generous 80px on touch (54px on mouse) for effortless, forgiving catching
        const hitRadius = (deviceInputMode === 'touch') ? 80 : 54;
        if (dist < hitRadius) {
          state.score += 150 * state.combo;
          state.combo = Math.min(10, state.combo + 1);
          audio.playCorrectChime(state.combo);
          state.particles.splice(i, 1);
          updateHeaderUI();
          continue;
        }

        // Screen Exit (Past Bottom)
        if (p.y > h + 70) {
          state.particles.splice(i, 1);
          state.reflexLives--;
          state.combo = 1;
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
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
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
