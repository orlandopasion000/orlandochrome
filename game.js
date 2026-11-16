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
        options
      };
    }
  };

  // --- Particle Systems & Quantum Renderers (Realm, Helix, Meteor) ---
  const QuantumRenderer = {
    // 1. Quantum Realm Quantum Core (Player Atom / Singularity Core)
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      var t = now * 0.0016;
      var rotBase = now * 0.0004;
      var colorShift = (now * 0.04) % 360;
      var exc = (progress > 0) ? (progress * 0.35) : 0;
      var spinMult = 1.0 + exc * 2.5;

      // 1. Horizontal & Diagonal Photonic Lens Flares
      var flareLen = 44 + exc * 12;
      var flareW = 2.8 + exc * 1.0;
      var hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(168, 85, 247, 0)");
      hGrad.addColorStop(0.2, "rgba(192, 132, 252, 0.40)");
      hGrad.addColorStop(0.38, "rgba(56, 189, 248, 0.75)");
      hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.62, "rgba(56, 189, 248, 0.75)");
      hGrad.addColorStop(0.8, "rgba(192, 132, 252, 0.40)");
      hGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Diagonal flares (golden amber along 60 deg and -60 deg axes)
      for (var d = 0; d < 2; d++) {
        var dAngle = d === 0 ? (Math.PI / 3) : (-Math.PI / 3);
        ctx.save();
        ctx.rotate(dAngle);
        var dGrad = ctx.createLinearGradient(-flareLen * 0.75, 0, flareLen * 0.75, 0);
        dGrad.addColorStop(0.0, "rgba(245, 158, 11, 0)");
        dGrad.addColorStop(0.3, "rgba(251, 191, 36, 0.40)");
        dGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        dGrad.addColorStop(0.7, "rgba(251, 191, 36, 0.40)");
        dGrad.addColorStop(1.0, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.moveTo(-flareLen * 0.75, 0);
        ctx.lineTo(0, -1.8);
        ctx.lineTo(flareLen * 0.75, 0);
        ctx.lineTo(0, 1.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Central Quantum Nucleus Sphere
      var rCore = 14.5 + exc * 2.0;
      var haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.7, 0, 0, rCore * 1.55);
      haloGrad.addColorStop(0.0, "rgba(168, 85, 247, 0.40)");
      haloGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.20)");
      haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
      ctx.fill();

      var sphereGrad = ctx.createRadialGradient(-2, -3, 1, 0, 0, rCore);
      sphereGrad.addColorStop(0.0, "rgba(233, 213, 255, 0.98)");
      sphereGrad.addColorStop(0.25, "rgba(168, 85, 247, 0.95)");
      sphereGrad.addColorStop(0.55, "rgba(67, 20, 103, 0.95)");
      sphereGrad.addColorStop(0.80, "hsla(" + ((colorShift + 30) % 360) + ", 90%, 55%, 0.85)");
      sphereGrad.addColorStop(0.95, "hsla(" + ((colorShift + 180) % 360) + ", 95%, 65%, 0.92)");
      sphereGrad.addColorStop(1.0, progress > 0.8 ? "rgba(255, 215, 0, 0.98)" : "rgba(254, 240, 138, 0.95)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // 3. Three 3D Precessing Orbital Rings
      var majorA = 26 + exc * 4;
      var minorB = 9.8 + exc * 1.5;
      var rings = [
        { baseAngle: 0, phaseOffset: 0, hueBase: colorShift },
        { baseAngle: Math.PI / 3, phaseOffset: 2.094, hueBase: (colorShift + 120) % 360 },
        { baseAngle: 2 * Math.PI / 3, phaseOffset: 4.188, hueBase: (colorShift + 240) % 360 }
      ];

      for (var ri = 0; ri < 3; ri++) {
        var ring = rings[ri];
        ctx.save();
        var wobble = Math.sin(t * 1.4 * spinMult + ring.phaseOffset) * 0.08;
        ctx.rotate(ring.baseAngle + wobble + rotBase * spinMult);
        var curB = minorB * (1.0 + 0.12 * Math.cos(t * 1.6 * spinMult + ring.phaseOffset));

        var rGrad = ctx.createLinearGradient(-majorA, 0, majorA, 0);
        var h1 = Math.round(ring.hueBase);
        var h2 = Math.round((ring.hueBase + 60) % 360);
        rGrad.addColorStop(0.0, "hsla(" + h1 + ", 95%, 68%, 0.95)");
        rGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.95)");
        rGrad.addColorStop(0.5, "hsla(" + h2 + ", 100%, 72%, 0.90)");
        rGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.95)");
        rGrad.addColorStop(1.0, "hsla(" + h1 + ", 95%, 68%, 0.95)");
        ctx.strokeStyle = rGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, majorA, curB, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Circulating Electron Spark
        var u = (now * (0.0032 * spinMult) + ring.phaseOffset) % (Math.PI * 2);
        var ex = majorA * Math.cos(u);
        var ey = curB * Math.sin(u);
        ctx.beginPath();
        ctx.arc(ex, ey, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + h1 + ", 100%, 70%, 0.28)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      }

      // 4. Center Singularity Reticle
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    },

    // 2. Quantum Helix Quantum Core (Player Atom / Singularity Core)
    drawHelixCore(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      var exc = (progress > 0) ? (progress * 0.35) : 0;
      var t = now * 0.0016;
      var rotBase = now * 0.0006;
      var spinMult = 1.0 + exc * 2.5;

      // 1. Bi-Chromatic Lens Flare Glint
      var flareLen = 28 + exc * 8;
      var flareW = 2.0 + exc * 0.5;
      var hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(6, 182, 212, 0)");
      hGrad.addColorStop(0.30, "rgba(34, 211, 238, 0.40)");
      hGrad.addColorStop(0.50, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.70, "rgba(217, 70, 239, 0.40)");
      hGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // 2. 3D Quantum Helix Sphere
      var rCore = 16.0 + exc * 2.5;
      var haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.65, 0, 0, rCore * 1.55);
      haloGrad.addColorStop(0.0, "rgba(34, 211, 238, 0.38)");
      haloGrad.addColorStop(0.5, "rgba(217, 70, 239, 0.22)");
      haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
      ctx.fill();

      var sphereGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, rCore);
      sphereGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
      sphereGrad.addColorStop(0.28, "rgba(56, 189, 248, 0.95)");
      sphereGrad.addColorStop(0.62, "rgba(147, 51, 234, 0.92)");
      sphereGrad.addColorStop(0.88, "rgba(59, 7, 100, 0.95)");
      sphereGrad.addColorStop(1.0, progress > 0.8 ? "rgba(255, 215, 0, 0.98)" : "rgba(34, 211, 238, 0.95)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // 3. DNA Double-Helix Emblem Inscribed Inside the Sphere
      ctx.save();
      ctx.rotate(-0.45 + Math.sin(t * 0.7) * 0.08);
      var dnaLen = (rCore - 1.8) * 1.92;
      var dnaAmp = rCore * 0.36;
      var dnaSteps = 12;
      var dnaPhase = t * spinMult * 2.2;

      // Connecting Base-Pair Rungs
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.80)";
      ctx.beginPath();
      for (var bi = -3; bi <= 3; bi++) {
        var bNorm = bi / 3.8;
        var bx = bNorm * (dnaLen * 0.46);
        var bEnv = Math.sqrt(Math.max(0, 1 - bNorm * bNorm));
        var bPhase = dnaPhase + bNorm * Math.PI * 1.75;
        var by1 = Math.sin(bPhase) * dnaAmp * bEnv;
        ctx.moveTo(bx, by1);
        ctx.lineTo(bx, -by1);
      }
      ctx.stroke();

      // Strand 1: Electric Cyan DNA Strand
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (var i = 0; i <= dnaSteps; i++) {
        var sNorm = -1 + (2 * i) / dnaSteps;
        var ix = sNorm * (dnaLen * 0.48);
        var sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
        var iy1 = Math.sin(dnaPhase + sNorm * Math.PI * 1.75) * dnaAmp * sEnv;
        if (i === 0) ctx.moveTo(ix, iy1); else ctx.lineTo(ix, iy1);
      }
      ctx.stroke();

      // Strand 2: Royal Magenta DNA Strand
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (var i = 0; i <= dnaSteps; i++) {
        var sNorm = -1 + (2 * i) / dnaSteps;
        var ix = sNorm * (dnaLen * 0.48);
        var sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
        var iy2 = -Math.sin(dnaPhase + sNorm * Math.PI * 1.75) * dnaAmp * sEnv;
        if (i === 0) ctx.moveTo(ix, iy2); else ctx.lineTo(ix, iy2);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Three 3D Precessing Gyroscope Rings (+45 deg, -45 deg, 0 deg)
      var majorA = 27 + exc * 4;
      var minorB = 10.2 + exc * 1.5;

      // Ring 1 (+45 deg Cyan)
      ctx.save();
      ctx.rotate((Math.PI / 4) + rotBase * spinMult);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.75)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      var nAngle1 = t * 2.0 * spinMult;
      ctx.beginPath();
      ctx.arc(Math.cos(nAngle1) * majorA, Math.sin(nAngle1) * minorB, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#67e8f9";
      ctx.fill();
      ctx.restore();

      // Ring 2 (-45 deg Magenta)
      ctx.save();
      ctx.rotate((-Math.PI / 4) - rotBase * spinMult);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.75)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      var nAngle2 = -t * 2.0 * spinMult;
      ctx.beginPath();
      ctx.arc(Math.cos(nAngle2) * majorA, Math.sin(nAngle2) * minorB, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#f472b6";
      ctx.fill();
      ctx.restore();

      // Ring 3 (0 deg Violet)
      ctx.save();
      ctx.rotate(rotBase * spinMult * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA * 1.08, minorB * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.55)";
      ctx.lineWidth = 0.95;
      ctx.stroke();
      ctx.restore();

      // Center Reticle
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    },

    // 3. Quantum Meteor Quantum Core (Player Atom / Singularity Core)
    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0) {
      ctx.save();

      var exc = (progress > 0) ? (progress * 0.35) : 0;
      var t = now * 0.0018;
      var rotBase = now * 0.0006;
      var spinMult = 1.0 + exc * 2.5;
      var tumble = now * 0.0012;
      var pitch = Math.sin(now * 0.0015) * 0.25;
      var coreR = 15.0 + exc * 3.0;

      // 1. Solar Corona & Volumetric Atmospheric Plasma Halo
      var coronaR = coreR * 2.3;
      var coronaGrad = ctx.createRadialGradient(cx, cy, coreR * 0.35, cx, cy, coronaR);
      coronaGrad.addColorStop(0.0, "rgba(255, 255, 250, " + (0.92 + exc * 0.08).toFixed(2) + ")");
      coronaGrad.addColorStop(0.20, "rgba(254, 240, 138, " + (0.75 + exc * 0.15).toFixed(2) + ")");
      coronaGrad.addColorStop(0.48, "rgba(249, 115, 22, " + (0.42 + exc * 0.20).toFixed(2) + ")");
      coronaGrad.addColorStop(0.80, "rgba(220, 38, 38, " + (0.16 + exc * 0.12).toFixed(2) + ")");
      coronaGrad.addColorStop(1.0, "rgba(185, 28, 28, 0.0)");
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Anamorphic Solar Prominence Flare Beams
      var flareLen = coreR * 2.6 + exc * 12;
      var flareW = coreR * 0.18 + exc * 1.2;
      ctx.save();
      ctx.translate(cx, cy);
      var hFlare = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hFlare.addColorStop(0.0, "rgba(220, 38, 38, 0)");
      hFlare.addColorStop(0.25, "rgba(249, 115, 22, 0.45)");
      hFlare.addColorStop(0.50, "rgba(255, 255, 255, 1.0)");
      hFlare.addColorStop(0.75, "rgba(249, 115, 22, 0.45)");
      hFlare.addColorStop(1.0, "rgba(220, 38, 38, 0)");
      ctx.fillStyle = hFlare;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Diagonal flares (at 60 deg and -60 deg)
      for (var d = 0; d < 2; d++) {
        ctx.save();
        ctx.rotate(d === 0 ? (Math.PI / 3) : (-Math.PI / 3));
        var dFlare = ctx.createLinearGradient(-flareLen * 0.72, 0, flareLen * 0.72, 0);
        dFlare.addColorStop(0.0, "rgba(234, 88, 12, 0)");
        dFlare.addColorStop(0.35, "rgba(251, 191, 36, 0.45)");
        dFlare.addColorStop(0.50, "rgba(255, 255, 255, 0.90)");
        dFlare.addColorStop(0.65, "rgba(251, 191, 36, 0.45)");
        dFlare.addColorStop(1.0, "rgba(234, 88, 12, 0)");
        ctx.fillStyle = dFlare;
        ctx.beginPath();
        ctx.moveTo(-flareLen * 0.72, 0);
        ctx.lineTo(0, -flareW * 0.72);
        ctx.lineTo(flareLen * 0.72, 0);
        ctx.lineTo(0, flareW * 0.72);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 3. Three 3D Precessed Blazing Magnetic Dynamo Rings with Orbiting Plasmoids
      var majorA = 26 + exc * 4;
      var minorB = 9.8 + exc * 1.5;
      var rings = [
        { baseAngle: 0, phaseOffset: 0, color: "rgba(251, 191, 36, 0.95)" },
        { baseAngle: Math.PI / 3, phaseOffset: 2.094, color: "rgba(244, 63, 94, 0.90)" },
        { baseAngle: 2 * Math.PI / 3, phaseOffset: 4.188, color: "rgba(254, 240, 138, 0.95)" }
      ];

      for (var ri = 0; ri < 3; ri++) {
        var ring = rings[ri];
        ctx.save();
        ctx.translate(cx, cy);
        var wobble = Math.sin(t * 1.4 * spinMult + ring.phaseOffset) * 0.08;
        ctx.rotate(ring.baseAngle + wobble + rotBase * spinMult);
        var curB = minorB * (1.0 + 0.12 * Math.cos(t * 1.6 * spinMult + ring.phaseOffset));

        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, majorA, curB, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Circulating Miniature Sun Plasmoid
        var u = (now * (0.0035 * spinMult) + ring.phaseOffset) % (Math.PI * 2);
        var ex = majorA * Math.cos(u);
        var ey = curB * Math.sin(u);
        ctx.beginPath();
        ctx.arc(ex, ey, 4.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.38)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(254, 240, 138, 0.92)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      }

      // 4. Hyper-Realistic Procedural 3D Molten Asteroid Body
      var rockR = coreR * 1.05;
      var SAMPLES = 32;
      var dTheta = (Math.PI * 2) / SAMPLES;
      var contourPts = [];
      for (var s = 0; s < SAMPLES; s++) {
        var th = s * dTheta;
        var rVar = 1.0 + Math.sin(th * 2 + tumble * 0.7) * 0.14 + Math.cos(th * 3 - pitch * 1.5) * 0.09;
        contourPts.push({ x: cx + Math.cos(th) * (rockR * Math.max(0.70, rVar)), y: cy + Math.sin(th) * (rockR * Math.max(0.70, rVar)) });
      }

      ctx.save();
      ctx.beginPath();
      for (var s = 0; s < SAMPLES; s++) {
        if (s === 0) ctx.moveTo(contourPts[s].x, contourPts[s].y); else ctx.lineTo(contourPts[s].x, contourPts[s].y);
      }
      ctx.closePath();
      ctx.clip();

      // 3D Directional Lighting
      var bodyGrad = ctx.createRadialGradient(cx - rockR * 0.45, cy - rockR * 0.55, rockR * 0.12, cx, cy, rockR * 1.30);
      bodyGrad.addColorStop(0.0, "#5c4537");
      bodyGrad.addColorStop(0.30, "#3d2b20");
      bodyGrad.addColorStop(0.62, "#21140e");
      bodyGrad.addColorStop(1.0, "#050302");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Craters with Glowing Magma Wells
      var craters = [{ x: -0.32, y: -0.38, r: 0.22 }, { x: 0.38, y: -0.25, r: 0.26 }, { x: -0.25, y: 0.35, r: 0.28 }];
      for (var c = 0; c < craters.length; c++) {
        var cr = craters[c];
        var crX = cx + cr.x * rockR;
        var crY = cy + cr.y * rockR;
        var crRad = rockR * cr.r;
        ctx.beginPath();
        ctx.arc(crX, crY, crRad, 0, Math.PI * 2);
        ctx.fillStyle = "#070302";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(crX, crY, crRad * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(254, 240, 138, 0.90)";
        ctx.fill();
      }

      // Branching 5000K White-Hot Magma Fissures
      var magmaPulse = 0.5 + 0.5 * Math.sin(t * 3.6);
      var fissures = [
        [[-0.60, -0.35], [-0.18, -0.10], [0.05, 0.04], [0.48, 0.28], [0.68, 0.38]],
        [[0.32, -0.52], [0.05, 0.04], [-0.28, 0.45], [-0.48, 0.60]]
      ];
      for (var fc = 0; fc < fissures.length; fc++) {
        var chain = fissures[fc];
        ctx.beginPath();
        for (var j = 0; j < chain.length; j++) {
          var fx = cx + chain[j][0] * rockR;
          var fy = cy + chain[j][1] * rockR;
          if (j === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
        }
        ctx.strokeStyle = "rgba(249, 115, 22, " + (0.85 + magmaPulse * 0.15).toFixed(2) + ")";
        ctx.lineWidth = Math.max(1.4, rockR * 0.14);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 245, 0.95)";
        ctx.lineWidth = Math.max(0.8, rockR * 0.06);
        ctx.stroke();
      }

      ctx.restore(); // end clip
      ctx.restore();
    },

    // 4. Quantum Realm Extra Big (Tier 3) Particle
    drawTier3RealmParticle(targetCtx, p, now) {
      var tier = 3;
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var pulsePhase = p.pulsePhase || 0;
      var renderAlpha = 0.95;
      var fHeadHue = 210;
      var fHeadLit = 84;
      var spinePts = p.spine;
      var K = spinePts.length;

      // Tail Streamer Body & Crackling Electric Arcs
      if (K >= 2) {
        var tailTipX = spinePts[K - 1].x;
        var tailTipY = spinePts[K - 1].y;
        var bodyGrad = targetCtx.createLinearGradient(tailTipX, tailTipY, px0, py0);
        bodyGrad.addColorStop(0.0, "hsla(260, 95%, 60%, 0.10)");
        bodyGrad.addColorStop(0.48, "hsla(230, 95%, 70%, 0.60)");
        bodyGrad.addColorStop(1.0, "hsla(" + fHeadHue + ", 100%, " + fHeadLit.toFixed(1) + "%, " + (renderAlpha * 0.95).toFixed(2) + ")");
        targetCtx.fillStyle = bodyGrad;

        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x - headR * 0.85, spinePts[0].y);
        for (var sj = 1; sj < K; sj++) {
          var taper = 1.0 - sj / K;
          targetCtx.lineTo(spinePts[sj].x - headR * 0.85 * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(tailTipX, tailTipY);
        for (var sj = K - 1; sj >= 1; sj--) {
          var taper = 1.0 - sj / K;
          targetCtx.lineTo(spinePts[sj].x + headR * 0.85 * taper, spinePts[sj].y);
        }
        targetCtx.lineTo(spinePts[0].x + headR * 0.85, spinePts[0].y);
        targetCtx.closePath();
        targetCtx.fill();

        // Crackling Electric Arcs Along Tail Spine
        targetCtx.lineCap = "round";
        targetCtx.lineJoin = "round";
        targetCtx.strokeStyle = "hsla(196, 100%, 68%, 0.40)";
        targetCtx.lineWidth = Math.max(2.0, headR * 0.58);
        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
        for (var ej = 1; ej < K; ej++) {
          var wave = Math.sin(now * 0.04 + ej * 1.5) * 6;
          targetCtx.lineTo(spinePts[ej].x + wave, spinePts[ej].y);
        }
        targetCtx.stroke();

        targetCtx.strokeStyle = "rgba(232, 248, 255, 0.95)";
        targetCtx.lineWidth = Math.max(0.9, headR * 0.24);
        targetCtx.stroke();
      }

      // Luminous Quantum Glow Head
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
      targetCtx.fillStyle = "hsla(" + fHeadHue + ", 98%, " + fHeadLit.toFixed(1) + "%, " + renderAlpha.toFixed(2) + ")";
      targetCtx.fill();

      // Searing White-Hot Center Singularity
      var cosH = Math.cos(heading);
      var sinH = Math.sin(heading);
      targetCtx.beginPath();
      targetCtx.arc(px0 + cosH * (headR * 0.25), py0 + sinH * (headR * 0.25), headR * 0.45, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(255, 255, 255, " + (renderAlpha * 0.96).toFixed(2) + ")";
      targetCtx.fill();

      // 3D Bohr Probability Orbital Rings
      var orbBaseR = headR * 2.85; // Scaled specifically for Tier 3
      var spinAngle = now * 0.0032 + pulsePhase;
      var ringAlpha = renderAlpha * 0.85;

      // Inner Concentric Orbital
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, orbBaseR * 0.85, 0, Math.PI * 2);
      targetCtx.strokeStyle = "hsla(" + fHeadHue + ", 92%, 72%, " + (ringAlpha * 0.38).toFixed(2) + ")";
      targetCtx.lineWidth = 1.35;
      targetCtx.stroke();

      // Outer Precessing Elliptical Orbital
      var worldSpin = heading + spinAngle;
      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbBaseR * 1.35, orbBaseR * 0.75, worldSpin, 0, Math.PI * 2);
      targetCtx.strokeStyle = "hsla(" + fHeadHue + ", 98%, 78%, " + (ringAlpha * 0.32).toFixed(2) + ")";
      targetCtx.lineWidth = 1.20;
      targetCtx.stroke();

      // Orbiting Quantum Node Spark
      var qNodeX = px0 + Math.cos(worldSpin) * orbBaseR * 1.35;
      var qNodeY = py0 + Math.sin(worldSpin) * orbBaseR * 1.35;
      targetCtx.beginPath();
      targetCtx.arc(qNodeX, qNodeY, 2.0, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(255, 255, 255, " + (ringAlpha * 0.96).toFixed(2) + ")";
      targetCtx.fill();
    },

    // 5. Quantum Helix Extra Big (Tier 3) Particle
    drawTier3HelixParticle(targetCtx, p, now) {
      var tier = 3;
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var pulsePhase = p.pulsePhase || 0;
      var renderAlpha = 0.95;
      var spinePts = p.spine;
      var K = spinePts.length;

      // A. Double-Helix DNA Strands (Strand 1: Cyan, Strand 2: Magenta)
      var strandWidth = Math.max(1.8, headR * 0.44);
      var waveAmp = 14;
      var t = now * 0.003;

      // Central Harmonic Phase Beam
      targetCtx.beginPath();
      targetCtx.moveTo(spinePts[0].x, spinePts[0].y);
      for (var sj = 1; sj < K; sj++) {
        targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      }
      targetCtx.strokeStyle = "rgba(165, 243, 252, " + (renderAlpha * 0.88).toFixed(2) + ")";
      targetCtx.lineWidth = Math.max(1.0, headR * 0.18);
      targetCtx.stroke();

      // Base-Pair Rungs
      targetCtx.strokeStyle = "rgba(224, 231, 255, 0.52)";
      targetCtx.lineWidth = 1.25;
      for (var rk = 1; rk < K - 1; rk++) {
        var offset = Math.sin(t - rk * 0.75) * waveAmp;
        targetCtx.beginPath();
        targetCtx.moveTo(spinePts[rk].x + offset, spinePts[rk].y);
        targetCtx.lineTo(spinePts[rk].x - offset, spinePts[rk].y);
        targetCtx.stroke();
      }

      // Strand 1: Cyan Ribbon
      targetCtx.lineCap = "round";
      targetCtx.lineJoin = "round";
      targetCtx.strokeStyle = "rgba(34, 211, 238, " + (renderAlpha * 0.96).toFixed(2) + ")";
      targetCtx.lineWidth = strandWidth;
      targetCtx.beginPath();
      for (var sj = 0; sj < K; sj++) {
        var offset = Math.sin(t - sj * 0.75) * waveAmp;
        var sx = spinePts[sj].x + offset;
        var sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.stroke();

      // Strand 2: Magenta Ribbon
      targetCtx.strokeStyle = "rgba(217, 70, 239, " + (renderAlpha * 0.96).toFixed(2) + ")";
      targetCtx.lineWidth = strandWidth;
      targetCtx.beginPath();
      for (var sj = 0; sj < K; sj++) {
        var offset = -Math.sin(t - sj * 0.75) * waveAmp;
        var sx = spinePts[sj].x + offset;
        var sy = spinePts[sj].y;
        if (sj === 0) targetCtx.moveTo(sx, sy); else targetCtx.lineTo(sx, sy);
      }
      targetCtx.stroke();

      // B. Glowing Cyan Droplet Head
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR * 1.35, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(34, 211, 238, " + (renderAlpha * 0.32).toFixed(2) + ")";
      targetCtx.fill();

      targetCtx.beginPath();
      targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
      targetCtx.fillStyle = "hsla(188, 98%, 74%, " + renderAlpha.toFixed(2) + ")";
      targetCtx.fill();

      // Searing White Nucleus
      var cosH = Math.cos(heading);
      var sinH = Math.sin(heading);
      targetCtx.beginPath();
      targetCtx.arc(px0 + cosH * (headR * 0.22), py0 + sinH * (headR * 0.22), headR * 0.44, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(255, 255, 255, " + (renderAlpha * 0.98).toFixed(2) + ")";
      targetCtx.fill();

      // C. Bi-Chromatic Cyan & Magenta 3D Orbitals
      var orbBaseR = headR * 2.85;
      var spinAngle = now * 0.0032 + pulsePhase;
      var ringAlpha = renderAlpha * 0.85;

      // Cyan Ring
      targetCtx.beginPath();
      targetCtx.arc(px0, py0, orbBaseR * 0.85, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(34, 211, 238, " + (ringAlpha * 0.40).toFixed(2) + ")";
      targetCtx.lineWidth = 1.25;
      targetCtx.stroke();

      // Magenta Precessing Ellipse
      var worldSpin = heading + spinAngle;
      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbBaseR * 1.35, orbBaseR * 0.75, worldSpin, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(217, 70, 239, " + (ringAlpha * 0.38).toFixed(2) + ")";
      targetCtx.lineWidth = 1.15;
      targetCtx.stroke();

      // Orbiting Nucleotide Spark Node
      var qNodeX = px0 + Math.cos(worldSpin) * (orbBaseR * 1.35);
      var qNodeY = py0 + Math.sin(worldSpin) * (orbBaseR * 1.35);
      targetCtx.beginPath();
      targetCtx.arc(qNodeX, qNodeY, 1.8, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(165, 243, 252, " + (ringAlpha * 0.96).toFixed(2) + ")";
      targetCtx.fill();
    },

    // 6. Quantum Meteor Extra Big (Tier 3) Particle
    drawTier3MeteorParticle(targetCtx, p, now) {
      var tier = 3;
      var headR = p.headR || 24.0;
      var px0 = p.x;
      var py0 = p.y;
      var heading = p.heading || Math.PI / 2;
      var pulsePhase = p.pulsePhase || 0;
      var renderAlpha = 0.95;
      var spinePts = p.spine;
      var K = spinePts.length;

      // A. Solar Prominence Ionization Smoke Puff
      var puffR = headR * 1.55;
      var smokeAlpha = renderAlpha * 0.28;
      var smokeGrad = targetCtx.createRadialGradient(spinePts[K - 1].x, spinePts[K - 1].y, puffR * 0.2, spinePts[K - 1].x, spinePts[K - 1].y, puffR);
      smokeGrad.addColorStop(0.0, "rgba(80, 50, 40, " + smokeAlpha.toFixed(2) + ")");
      smokeGrad.addColorStop(0.5, "rgba(50, 30, 25, " + (smokeAlpha * 0.5).toFixed(2) + ")");
      smokeGrad.addColorStop(1.0, "rgba(30, 20, 20, 0.0)");
      targetCtx.fillStyle = smokeGrad;
      targetCtx.beginPath();
      targetCtx.arc(spinePts[K - 1].x, spinePts[K - 1].y, puffR, 0, Math.PI * 2);
      targetCtx.fill();

      // B. Real Fire Inner Core Convective Flame Tongue
      var flameEndIdx = Math.min(K - 1, Math.max(2, (K * 0.75) | 0));
      var innerFlameGrad = targetCtx.createLinearGradient(spinePts[flameEndIdx].x, spinePts[flameEndIdx].y, px0, py0);
      innerFlameGrad.addColorStop(0.0, "rgba(220, 38, 38, 0.0)");
      innerFlameGrad.addColorStop(0.35, "rgba(249, 115, 22, 0.75)");
      innerFlameGrad.addColorStop(0.70, "rgba(254, 240, 138, 0.95)");
      innerFlameGrad.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");
      targetCtx.strokeStyle = innerFlameGrad;
      targetCtx.lineWidth = Math.max(1.4, headR * 0.62);
      targetCtx.lineCap = "round";
      targetCtx.beginPath();
      targetCtx.moveTo(px0, py0);
      for (var sj = 1; sj <= flameEndIdx; sj++) {
        targetCtx.lineTo(spinePts[sj].x, spinePts[sj].y);
      }
      targetCtx.stroke();

      // C. Molten Asteroid Rock Body (32-point procedural craggy contour)
      var rockR = headR * 1.25;
      var SAMPLES = 32;
      var dTheta = (Math.PI * 2) / SAMPLES;
      targetCtx.save();
      targetCtx.beginPath();
      for (var s = 0; s < SAMPLES; s++) {
        var th = s * dTheta;
        var rVar = 1.0 + Math.sin(th * 2 + now * 0.002) * 0.14 + Math.cos(th * 3) * 0.09;
        var rx = px0 + Math.cos(th) * (rockR * rVar);
        var ry = py0 + Math.sin(th) * (rockR * rVar);
        if (s === 0) targetCtx.moveTo(rx, ry); else targetCtx.lineTo(rx, ry);
      }
      targetCtx.closePath();
      targetCtx.clip();

      // 3D Directional Molten Basalt Lighting
      var bodyGrad = targetCtx.createRadialGradient(px0 - rockR * 0.4, py0 - rockR * 0.5, rockR * 0.1, px0, py0, rockR * 1.3);
      bodyGrad.addColorStop(0.0, "#5c4537");
      bodyGrad.addColorStop(0.35, "#3d2b20");
      bodyGrad.addColorStop(0.70, "#21140e");
      bodyGrad.addColorStop(1.0, "#050302");
      targetCtx.fillStyle = bodyGrad;
      targetCtx.fill();

      // Magma Fissures with Glowing Core
      targetCtx.strokeStyle = "rgba(254, 240, 138, 0.95)";
      targetCtx.lineWidth = 1.2;
      targetCtx.stroke();
      targetCtx.restore(); // end clip

      // D. Orbiting Molten Ember Plasma Ring
      var orbBaseRM = rockR * 2.10;
      var spinM = now * 0.0035 + pulsePhase;
      targetCtx.beginPath();
      targetCtx.ellipse(px0, py0, orbBaseRM * 1.2, orbBaseRM * 0.7, heading + spinM, 0, Math.PI * 2);
      targetCtx.strokeStyle = "rgba(251, 146, 60, " + (renderAlpha * 0.44).toFixed(2) + ")";
      targetCtx.lineWidth = 1.35;
      targetCtx.stroke();

      // Orbiting Ember Spark
      var eAng = heading + spinM;
      targetCtx.beginPath();
      targetCtx.arc(px0 + Math.cos(eAng) * (orbBaseRM * 1.2), py0 + Math.sin(eAng) * (orbBaseRM * 0.7), 2.2, 0, Math.PI * 2);
      targetCtx.fillStyle = "rgba(255, 240, 138, " + (renderAlpha * 0.98).toFixed(2) + ")";
      targetCtx.fill();
    }
  };


  // --- Main Application State ---
  const state = {
    active: false,
    gameType: 'math',
    score: 0,
    combo: 1,
    targetMultiple: 7, // Default multiple for Reflex Numbers Blitz
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
    if (dom.viewReflex) dom.viewReflex.style.display = (type === 'reflex' || type === 'realm' || type === 'helix' || type === 'meteor') ? 'flex' : 'none';
    if (dom.viewMemory) dom.viewMemory.style.display = type === 'memory' ? 'flex' : 'none';

    // Toggle Reflex Numbers Picker vs Transmute Indicator
    const picker = document.getElementById('reflexMultiplePicker');
    const badge = document.getElementById('transmuteIndicator');
    if (picker) picker.style.display = type === 'reflex' ? 'flex' : 'none';
    if (badge) badge.style.display = (type === 'realm' || type === 'helix' || type === 'meteor') ? 'block' : 'none';

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

    if (state.gameType === 'realm') {
      dom.gameTitle.textContent = 'CHROME REALM';
      dom.gameSub.textContent = 'Profile Synapse Wave Catcher · 10 Shield Units';
    } else if (state.gameType === 'helix') {
      dom.gameTitle.textContent = 'CHROME HELIX';
      dom.gameSub.textContent = 'Dual-Thread Task Synchronizer · 10 Shield Units';
    } else if (state.gameType === 'meteor') {
      dom.gameTitle.textContent = 'CHROME METEOR';
      dom.gameSub.textContent = 'Task Surge Asteroid Deflector · 10 Shield Units';
    } else if (state.gameType === 'reflex') {
      dom.gameTitle.textContent = 'REFLEX BLITZ';
      dom.gameSub.textContent = `Numbers Multiple Catcher · Catch 2-Digit Multiples of ${state.targetMultiple || 7}`;
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
    dom.mathOptions.forEach((btn, idx) => {
      const val = q.choices[idx];
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
  // DEDICATED ARENA ENGINE: CHROME REALM, CHROME HELIX, CHROME METEOR & REFLEX BLITZ
  // ══════════════════════════════════════════════════════════════════════════
  function startReflexGame() {
    state.reflexLives = 10;
    state.catcherX = 0.5;
    state.lastTransmuteTime = performance.now();
    state.particles = [];
    state.floatingTexts = [];

    // Set designated catcher type per game mode
    if (state.gameType === 'realm') {
      state.catcherType = 'realm';
    } else if (state.gameType === 'helix') {
      state.catcherType = 'helix';
    } else if (state.gameType === 'meteor') {
      state.catcherType = 'meteor';
    } else {
      state.catcherType = 'realm'; // Reflex blitz starts in realm
    }

    const picker = document.getElementById('reflexMultiplePicker');
    const badge = document.getElementById('transmuteIndicator');
    if (picker) picker.style.display = state.gameType === 'reflex' ? 'flex' : 'none';
    if (badge) badge.style.display = (state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor') ? 'block' : 'none';

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
      realm: '⚛️ ACTIVE CORE: CHROME REALM (Catch Synapse Waves!)',
      helix: '🧬 ACTIVE CORE: CHROME HELIX (Catch Dual-Strands!)',
      meteor: '☄️ ACTIVE CORE: CHROME METEOR (Deflect Molten Surges!)'
    };

    if (state.gameType === 'reflex') {
      const reflexMorphLabels = {
        realm: '⚡ CORE TRANSMUTED: CHROME REALM (Catch Synapse Waves!)',
        helix: '⚡ CORE TRANSMUTED: CHROME HELIX (Catch Dual-Strands!)',
        meteor: '⚡ CORE TRANSMUTED: CHROME METEOR (Deflect Molten Asteroids!)'
      };
      dom.transmuteIndicator.textContent = reflexMorphLabels[state.catcherType];
    } else {
      dom.transmuteIndicator.textContent = labels[state.catcherType] || labels.realm;
    }
    dom.transmuteIndicator.className = `transmute-badge transmute-${state.catcherType}`;
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || (state.gameType !== 'reflex' && state.gameType !== 'realm' && state.gameType !== 'helix' && state.gameType !== 'meteor')) return;

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

    const catcherPixelX = Math.max(55, Math.min(w - 55, state.catcherX * w));
    const catcherPixelY = h - 60;

    // ─────────────────────────────────────────────────────────────
    // MODE A: REFLEX BLITZ — NUMBERS MULTIPLE CATCHER
    // ─────────────────────────────────────────────────────────────
    if (state.gameType === 'reflex') {
      const D = state.targetMultiple || 7;

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
    // MODE B: CHROME REALM, CHROME HELIX, CHROME METEOR
    // ─────────────────────────────────────────────────────────────
    else {
      // Spawn Flagship Particles
      const spawnRate = (state.gameType === 'meteor') ? 0.045 : 0.038;
      if (Math.random() < spawnRate) {
        let pType = state.gameType;
        const px = Math.random() * (w - 140) + 70;
        const speed = (pType === 'meteor') ? (4.2 + Math.random() * 2.6) : (3.2 + Math.random() * 2.2);

        const p = {
          type: pType,
          x: px,
          y: -45,
          speed: speed,
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
      if (state.catcherType === 'realm') {
        QuantumRenderer.drawQuantumAtomic(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
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
        if (p.type === 'realm') {
          QuantumRenderer.drawTier3RealmParticle(ctx, p, timestamp);
        } else if (p.type === 'helix') {
          QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
        } else {
          QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
        }

        // Collision Check with Catcher
        const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
        if (dist < 52) {
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
            const gameNames = { realm: 'CHROME REALM', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
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
      realm: '⚛️ ACTIVE CORE: CHROME REALM (Catch Synapse Waves!)',
      helix: '🧬 ACTIVE CORE: CHROME HELIX (Catch Dual-Strands!)',
      meteor: '☄️ ACTIVE CORE: CHROME METEOR (Deflect Molten Surges!)'
    };

    if (state.gameType === 'reflex') {
      const reflexMorphLabels = {
        realm: '⚡ CORE TRANSMUTED: CHROME REALM (Catch Synapse Waves!)',
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
    if (!state.active || (state.gameType !== 'reflex' && state.gameType !== 'realm' && state.gameType !== 'helix' && state.gameType !== 'meteor')) return;

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

    // Check Core Transmutation (ONLY morphs in Reflex Blitz mode)
    if (state.gameType === 'reflex') {
      if (timestamp - state.lastTransmuteTime > 11000) {
        const types = ['realm', 'helix', 'meteor'].filter(t => t !== state.catcherType);
        state.catcherType = types[Math.floor(Math.random() * types.length)];
        state.lastTransmuteTime = timestamp;
        audio.playMorphChime();
        updateTransmuteIndicator();
      }
    }

    // Spawn Tier 3 Extra Big Flagship Particles
    const spawnRate = (state.gameType === 'meteor') ? 0.045 : 0.038;
    if (Math.random() < spawnRate) {
      let pType;
      if (state.gameType === 'realm') pType = 'realm';
      else if (state.gameType === 'helix') pType = 'helix';
      else if (state.gameType === 'meteor') pType = 'meteor';
      else {
        const types = ['realm', 'helix', 'meteor'];
        pType = types[Math.floor(Math.random() * types.length)];
      }

      const px = Math.random() * (w - 140) + 70;
      const speed = (pType === 'meteor') ? (4.2 + Math.random() * 2.6) : (3.2 + Math.random() * 2.2);

      const p = {
        type: pType,
        x: px,
        y: -45,
        speed: speed,
        headR: 24.0,
        spine: [],
        stardust: []
      };

      for (let j = 0; j < 8; j++) {
        p.spine.push({ x: px, y: -45 - j * 8.5 });
      }
      state.particles.push(p);
    }

    // Draw Quantum Core Catcher at Bottom
    const catcherPixelX = Math.max(55, Math.min(w - 55, state.catcherX * w));
    const catcherPixelY = h - 75;

    if (state.catcherType === 'realm') {
      QuantumRenderer.drawQuantumAtomic(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else if (state.catcherType === 'helix') {
      QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else {
      QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    }

    // Update and Render Falling Particles
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
      if (p.type === 'realm') {
        QuantumRenderer.drawTier3RealmParticle(ctx, p, timestamp);
      } else if (p.type === 'helix') {
        QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
      } else {
        QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
      }

      // Trailing Stardust Sparks in World Space
      p.stardust = p.stardust || [];
      if (p.type === 'realm') {
        if (Math.random() < 0.65 && p.stardust.length < 14) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 28,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.6,
            alpha: 0.98,
            hue: Math.random() < 0.76 ? (190 + Math.random() * 24) : (258 + Math.random() * 22),
            electric: true
          });
        }
      } else if (p.type === 'helix') {
        if (Math.random() < 0.45 && p.stardust.length < 10) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          const isCyan = Math.random() < 0.5;
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 24,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.5,
            alpha: 0.98,
            hue: isCyan ? (186 + Math.random() * 16) : (294 + Math.random() * 30),
            helix: true
          });
        }
      } else if (p.type === 'meteor') {
        if (Math.random() < 0.70 && p.stardust.length < 16) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 26,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 20,
            r: 1.0 + Math.random() * 2.2,
            alpha: 0.98,
            hue: 22 + Math.random() * 26,
            meteor: true
          });
        }
      }

      // Draw and advance stardust
      for (let s = p.stardust.length - 1; s >= 0; s--) {
        const spk = p.stardust[s];
        spk.alpha *= spk.meteor ? 0.90 : 0.88;
        spk.y -= 0.6;
        if (spk.alpha > 0.05) {
          ctx.beginPath();
          ctx.arc(spk.x, spk.y, spk.r * 2.2, 0, Math.PI * 2);
          if (spk.meteor) {
            ctx.fillStyle = 'rgba(255, ' + Math.round(135 + spk.hue * 2.2) + ', 60, ' + (spk.alpha * 0.35).toFixed(2) + ')';
          } else {
            ctx.fillStyle = 'hsla(' + Math.round(spk.hue) + ', 100%, 68%, ' + (spk.alpha * 0.30).toFixed(2) + ')';
          }
          ctx.fill();

          ctx.beginPath();
          ctx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
          if (spk.meteor) {
            ctx.fillStyle = 'rgba(255, ' + Math.round(180 + spk.hue * 1.5) + ', 120, ' + spk.alpha.toFixed(2) + ')';
          } else {
            ctx.fillStyle = 'hsla(' + Math.round(spk.hue) + ', 100%, 78%, ' + spk.alpha.toFixed(2) + ')';
          }
          ctx.fill();

          if (spk.alpha > 0.4 && spk.r > 1.0) {
            ctx.beginPath();
            ctx.arc(spk.x, spk.y, spk.r * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
        } else {
          p.stardust.splice(s, 1);
        }
      }

      // Collision Detection with Catcher
      const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
      if (dist < 52) {
        if (p.type === state.catcherType) {
          // Correct Catch!
          state.score += 150 * state.combo;
          state.combo = Math.min(10, state.combo + 1);
          audio.playCorrectChime(state.combo);
        } else {
          // Mismatched Catch: Lose 1 Life!
          state.reflexLives--;
          state.combo = 1;
          audio.playMistakeBuzzer();
          renderReflexShields();

          if (state.reflexLives <= 0) {
            handleGameOver('OUT OF SHIELDS', `Surpassed ${state.score.toLocaleString()} points dodging anomalies.`);
            ctx.restore();
            return;
          }
        }
        state.particles.splice(i, 1);
        updateHeaderUI();
        continue;
      }

      // Screen exit (falling past bottom)
      if (p.y > h + 70) {
        state.particles.splice(i, 1);

        // For dedicated Realm, Helix, and Meteor: missing a wavepacket/strand/meteor costs 1 shield!
        if (state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor') {
          state.reflexLives--;
          state.combo = 1;
          audio.playMistakeBuzzer();
          renderReflexShields();

          if (state.reflexLives <= 0) {
            const gameNames = { realm: 'CHROME REALM', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
            handleGameOver('SHIELDS DEPLETED', `${gameNames[state.gameType]} session concluded. Final Score: ${state.score.toLocaleString()} points.`);
            ctx.restore();
            return;
          }
          updateHeaderUI();
        }
      }
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

    // Canvas Pointer / Touch Movement for Catcher with accurate rect calculation
    const handlePointerMove = (clientX) => {
      if (!state.active) return;
      if (dom.canvasReflex) {
        const rect = dom.canvasReflex.getBoundingClientRect();
        if (rect.width > 0) {
          state.catcherX = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
          return;
        }
      }
      state.catcherX = Math.max(0.05, Math.min(0.95, clientX / window.innerWidth));
    };

    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) handlePointerMove(e.touches[0].clientX);
    }, { passive: true });

    // Keyboard Arrow navigation for Catcher
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

    if (btnRealm) btnRealm.onclick = (e) => { e.preventDefault(); openGame('realm'); };
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
      if (state.active) {
        e.preventDefault();
        closeGame();
      }
    }
  });

  // Resilient Global Event Delegation for all 6 Game Launchers
  document.addEventListener('click', function(e) {
    const realm = e.target.closest('#btnLaunchGame, .qgame-btn-realm');
    if (realm) { e.preventDefault(); openGame('realm'); return; }
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
