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
    gameType: 'math', // 'math' | 'reflex' | 'memory'

    // Math Overdrive State
    mathLevel: 1,
    mathQuestions: [],
    mathQIdx: 0,
    mathMistakes: 0,
    mathTimer: null,
    mathTimeLeft: 100,

    // Reflex Blitz State
    reflexLives: 10,
    catcherType: 'realm', // 'realm' | 'helix' | 'meteor'
    catcherX: 0.5,
    lastTransmuteTime: 0,
    particles: [],

    // Memory Matrix State
    memoryRound: 1,
    memorySequence: [],
    playerSequence: [],
    isAcceptingInput: false,

    // Shared Stats
    score: 0,
    combo: 1,
    bestScores: {
      math: parseInt(localStorage.getItem('oc_best_math') || '0', 10),
      reflex: parseInt(localStorage.getItem('oc_best_reflex') || '0', 10),
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
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // --- Game Modal Launch & Lifecycle ---
  function openGame(type = 'math') {
    initDOM();
    if (!dom.modal) return;

    state.gameType = type;
    dom.modal.classList.add('active');
    dom.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Activate the corresponding view
    if (dom.viewMath) dom.viewMath.style.display = type === 'math' ? 'flex' : 'none';
    if (dom.viewReflex) dom.viewReflex.style.display = type === 'reflex' ? 'block' : 'none';
    if (dom.viewMemory) dom.viewMemory.style.display = type === 'memory' ? 'flex' : 'none';

    updateHeaderUI();
    startGame(type);
  }

  function closeGame() {
    state.active = false;
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

    if (state.gameType === 'math') {
      dom.gameTitle.textContent = 'MATH OVERDRIVE';
      dom.gameSub.textContent = `Level ${state.mathLevel} · 20 Questions · 10 Mistakes Max`;
    } else if (state.gameType === 'reflex') {
      dom.gameTitle.textContent = 'REFLEX BLITZ';
      dom.gameSub.textContent = 'Quantum Realm · Helix · Meteor Catcher (10 Lives)';
    } else if (state.gameType === 'memory') {
      dom.gameTitle.textContent = 'MEMORY MATRIX';
      dom.gameSub.textContent = '16-Box Quantum Array (1 Mistake = Game Over)';
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
    } else if (type === 'reflex') {
      startReflexGame();
    } else if (type === 'memory') {
      startMemoryGame();
    }
  }

  function handleGameOver(title, desc) {
    state.active = false;
    clearInterval(state.mathTimer);
    if (animFrameId) cancelAnimationFrame(animFrameId);

    // Save best score
    if (state.score > (state.bestScores[state.gameType] || 0)) {
      state.bestScores[state.gameType] = state.score;
      localStorage.setItem(`oc_best_${state.gameType}`, state.score.toString());
      desc += `\n🌟 NEW PERSONAL RECORD: ${state.score.toLocaleString()} PTS!`;
    }

    if (dom.screenTitle) dom.screenTitle.textContent = title;
    if (dom.screenDesc) dom.screenDesc.textContent = desc;
    if (dom.btnStartAction) dom.btnStartAction.textContent = 'PLAY AGAIN';
    if (dom.screenOverlay) dom.screenOverlay.style.display = 'flex';
    audio.playMistakeBuzzer();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 1: MATH OVERDRIVE (Eight-Level System)
  // ══════════════════════════════════════════════════════════════════════════
  function startMathGame() {
    state.mathMistakes = 0;
    state.mathQIdx = 0;
    state.mathQuestions = MathEngine.generateLevelSet(state.mathLevel);
    renderMathShields();
    presentMathQuestion();
  }

  function renderMathShields() {
    if (!dom.mathShields) return;
    const remaining = 10 - state.mathMistakes;
    dom.mathShields.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('span');
      cell.className = `shield-cell ${i < remaining ? 'shield-on' : 'shield-lost'}`;
      dom.mathShields.appendChild(cell);
    }
  }

  function presentMathQuestion() {
    if (state.mathQIdx >= 20) {
      // Level Complete!
      audio.playVictoryFanfare();
      state.score += 500 * state.mathLevel;
      if (state.mathLevel < 8) {
        state.mathLevel++;
        handleGameOver(
          `LEVEL ${state.mathLevel - 1} COMPLETED!`,
          `Exceptional fluency! Advancing to Level ${state.mathLevel}. Total Score: ${state.score}`
        );
      } else {
        handleGameOver(
          'MASTER MATHEMATICIAN!',
          `You conquered all 8 difficulty levels with ${10 - state.mathMistakes} shields remaining!`
        );
      }
      return;
    }

    const q = state.mathQuestions[state.mathQIdx];
    if (dom.mathEquation) dom.mathEquation.textContent = `${q.expr} = ?`;
    if (dom.mathProgressLabel) dom.mathProgressLabel.textContent = `QUESTION ${state.mathQIdx + 1} / 20`;

    // Render 4 Options
    dom.mathOptions.forEach((btn, idx) => {
      btn.textContent = q.options[idx];
      btn.className = 'math-opt-btn';
      btn.onclick = () => checkMathAnswer(q.options[idx], q.ans);
    });

    // Reset countdown timer (4.5s)
    clearInterval(state.mathTimer);
    let timeLeft = 100;
    if (dom.mathTimeBar) dom.mathTimeBar.style.width = '100%';

    state.mathTimer = setInterval(() => {
      timeLeft -= 2.2;
      if (dom.mathTimeBar) dom.mathTimeBar.style.width = `${Math.max(0, timeLeft)}%`;

      if (timeLeft <= 0) {
        clearInterval(state.mathTimer);
        // Timeout counts as a mistake
        registerMathMistake();
        state.mathQIdx++;
        presentMathQuestion();
      }
    }, 100);
  }

  function checkMathAnswer(selected, correct) {
    clearInterval(state.mathTimer);

    if (selected === correct) {
      // Correct!
      audio.playCorrectChime(state.combo);
      state.score += 100 * state.combo * state.mathLevel;
      state.combo = Math.min(8, state.combo + 1);
    } else {
      registerMathMistake();
    }

    updateHeaderUI();
    if (state.mathMistakes >= 10) {
      handleGameOver('10 MISTAKES EXCEEDED', `Level ${state.mathLevel} stopped at question ${state.mathQIdx + 1}/20.`);
      return;
    }

    state.mathQIdx++;
    setTimeout(presentMathQuestion, 300);
  }

  function registerMathMistake() {
    state.mathMistakes++;
    state.combo = 1;
    audio.playMistakeBuzzer();
    renderMathShields();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 2: REFLEX BLITZ (Quantum Realm, Helix & Meteor Catcher)
  // ══════════════════════════════════════════════════════════════════════════
  function startReflexGame() {
    state.reflexLives = 10;
    state.catcherType = 'realm';
    state.catcherX = 0.5;
    state.lastTransmuteTime = performance.now();
    state.particles = [];

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
      realm: '⚛️ ACTIVE CORE: QUANTUM REALM (Catch Rainbow Streamers!)',
      helix: '🧬 ACTIVE CORE: QUANTUM HELIX (Catch Cyan/Magenta Strands!)',
      meteor: '☄️ ACTIVE CORE: QUANTUM METEOR (Catch Fiery Asteroids!)'
    };
    dom.transmuteIndicator.textContent = labels[state.catcherType];
    dom.transmuteIndicator.className = `transmute-badge transmute-${state.catcherType}`;
  }

  function resizeCanvas() {
    if (!dom.canvasReflex) return;
    const dpr = window.devicePixelRatio || 1;
    dom.canvasReflex.width = window.innerWidth * dpr;
    dom.canvasReflex.height = window.innerHeight * dpr;
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || state.gameType !== 'reflex') return;

    const ctx = dom.canvasReflex?.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dom.canvasReflex.width / dpr;
    const h = dom.canvasReflex.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Subtle Quantum Grid Background
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Check Core Transmutation (Morphs every 11 seconds)
    if (timestamp - state.lastTransmuteTime > 11000) {
      const types = ['realm', 'helix', 'meteor'].filter(t => t !== state.catcherType);
      state.catcherType = types[Math.floor(Math.random() * types.length)];
      state.lastTransmuteTime = timestamp;
      audio.playMorphChime();
      updateTransmuteIndicator();
    }

    // Spawn Tier 3 Extra Big Flagship Particles
    if (Math.random() < 0.038) {
      const types = ['realm', 'helix', 'meteor'];
      const pType = types[Math.floor(Math.random() * types.length)];
      const px = Math.random() * (w - 140) + 70;
      const speed = 3.2 + Math.random() * 2.4;

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

    // Draw Quantum Core (Player Atom / Singularity Core) Catcher at Bottom
    const catcherPixelX = Math.max(55, Math.min(w - 55, state.catcherX * w));
    const catcherPixelY = h - 75;

    if (state.catcherType === 'realm') {
      QuantumRenderer.drawQuantumAtomic(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else if (state.catcherType === 'helix') {
      QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else {
      QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    }

    // Update and Render Falling Tier 3 Extra Big Particles with Exact Tail FX & World-Space Stardust
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.y += p.speed;

      // Update spine IK with natural fluid sway
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
      } else {
        if (Math.random() < 0.68 && p.stardust.length < 14) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 26,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.6,
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

      // Collision Detection with Quantum Core Catcher
      const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
      if (dist < 48) {
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

      // Screen exit
      if (p.y > h + 70) {
        state.particles.splice(i, 1);
      }
    }

    ctx.restore();
    animFrameId = requestAnimationFrame(reflexGameLoop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 3: MEMORY MATRIX (16 Boxes 4x4 Array, 1 Mistake Game Over)
  // ══════════════════════════════════════════════════════════════════════════
  const MATRIX_PALETTES = [
    { name: 'Realm Core', color: '#a855f7', type: 'core-realm' },
    { name: 'Helix Core', color: '#06b6d4', type: 'core-helix' },
    { name: 'Meteor Core', color: '#f59e0b', type: 'core-meteor' },
    { name: 'Tier 3 Realm', color: '#38bdf8', type: 'tier3-realm' },
    { name: 'Tier 3 Helix', color: '#d946ef', type: 'tier3-helix' },
    { name: 'Tier 3 Meteor', color: '#ea580c', type: 'tier3-meteor' },
    { name: 'Emerald Core', color: '#10b981', type: 'core-realm' },
    { name: 'Rose Helix', color: '#f43f5e', type: 'core-helix' },
    { name: 'Solar Flame', color: '#f97316', type: 'core-meteor' },
    { name: 'Cyan Apex', color: '#0ea5e9', type: 'tier3-realm' },
    { name: 'Violet Wave', color: '#9333ea', type: 'tier3-helix' },
    { name: 'Molten Rock', color: '#dc2626', type: 'tier3-meteor' },
    { name: 'Gold Singularity', color: '#ffd700', type: 'core-realm' },
    { name: 'Orchid Pulse', color: '#c084fc', type: 'core-helix' },
    { name: 'Corona Blaze', color: '#fbbf24', type: 'core-meteor' },
    { name: 'White Nova', color: '#f8fafc', type: 'tier3-realm' }
  ];

  function startMemoryGame() {
    state.memoryRound = 1;
    state.memorySequence = [];
    state.playerSequence = [];
    state.isAcceptingInput = false;

    renderMemoryGrid();
    advanceMemoryRound();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(memoryGameLoop);
  }

  function memoryGameLoop(timestamp) {
    if (!state.active || state.gameType !== 'memory') return;

    if (dom.memoryGrid && dom.memoryGrid.children.length === 16) {
      for (let i = 0; i < 16; i++) {
        const box = dom.memoryGrid.children[i];
        const canvas = box.querySelector('canvas');
        if (!canvas) continue;
        const ctx = canvas.getContext('2d');
        const cx = 60, cy = 52;
        ctx.clearRect(0, 0, 120, 120);

        const pal = MATRIX_PALETTES[i];
        if (pal.type === 'core-realm') {
          QuantumRenderer.drawQuantumAtomic(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'core-helix') {
          QuantumRenderer.drawHelixCore(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'core-meteor') {
          QuantumRenderer.drawMeteorAsteroid(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'tier3-realm') {
          const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3RealmParticle(ctx, fakeP, timestamp + i * 200);
        } else if (pal.type === 'tier3-helix') {
          const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3HelixParticle(ctx, fakeP, timestamp + i * 200);
        } else if (pal.type === 'tier3-meteor') {
          const fakeP = { x: cx, y: cy + 12, headR: 18.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3MeteorParticle(ctx, fakeP, timestamp + i * 200);
        }
      }
    }

    animFrameId = requestAnimationFrame(memoryGameLoop);
  }

  function renderMemoryGrid() {
    if (!dom.memoryGrid) return;
    dom.memoryGrid.innerHTML = '';

    for (let i = 0; i < 16; i++) {
      const pal = MATRIX_PALETTES[i];
      const box = document.createElement('div');
      box.className = 'matrix-box';
      box.dataset.index = i;
      box.style.setProperty('--box-color', pal.color);

      // Mini Canvas inside box for live character rendering
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      box.appendChild(canvas);

      const label = document.createElement('span');
      label.className = 'matrix-box-label';
      label.textContent = pal.name;
      box.appendChild(label);

      // Initial character preview render
      const ctx = canvas.getContext('2d');
      const cx = 60, cy = 52;
      if (pal.type === 'core-realm') {
        QuantumRenderer.drawQuantumAtomic(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'core-helix') {
        QuantumRenderer.drawHelixCore(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'core-meteor') {
        QuantumRenderer.drawMeteorAsteroid(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'tier3-realm') {
        const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3RealmParticle(ctx, fakeP, 1000 + i * 200);
      } else if (pal.type === 'tier3-helix') {
        const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3HelixParticle(ctx, fakeP, 1000 + i * 200);
      } else if (pal.type === 'tier3-meteor') {
        const fakeP = { x: cx, y: cy + 12, headR: 18.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3MeteorParticle(ctx, fakeP, 1000 + i * 200);
      }

      box.onclick = () => handleMemoryBoxClick(i);
      dom.memoryGrid.appendChild(box);
    }
  }

  function advanceMemoryRound() {
    state.playerSequence = [];
    state.isAcceptingInput = false;
    state.memorySequence.push(Math.floor(Math.random() * 16));

    if (dom.memoryRoundLabel) {
      dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · WATCH MATRIX SEQUENCE`;
    }

    // Playback sequence
    let step = 0;
    const interval = setInterval(() => {
      if (step >= state.memorySequence.length) {
        clearInterval(interval);
        state.isAcceptingInput = true;
        if (dom.memoryRoundLabel) {
          dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · YOUR TURN! (1 MISTAKE = GAME OVER)`;
        }
        return;
      }

      flashMemoryBox(state.memorySequence[step]);
      step++;
    }, 700);
  }

  function flashMemoryBox(index) {
    const box = dom.memoryGrid?.children[index];
    if (!box) return;

    box.classList.add('box-flashing');
    audio.playMatrixTone(index);

    setTimeout(() => {
      box.classList.remove('box-flashing');
    }, 400);
  }

  function handleMemoryBoxClick(index) {
    if (!state.active || !state.isAcceptingInput) return;

    flashMemoryBox(index);
    state.playerSequence.push(index);

    const stepIdx = state.playerSequence.length - 1;
    if (state.playerSequence[stepIdx] !== state.memorySequence[stepIdx]) {
      // 1 MISTAKE = GAME OVER!
      handleGameOver(
        'SUDDEN DEATH: MATRIX OVERLOAD',
        `Mistake on step ${stepIdx + 1} of Round ${state.memoryRound}. In Memory Matrix, one mistake ends the simulation!`
      );
      return;
    }

    if (state.playerSequence.length === state.memorySequence.length) {
      // Round Complete!
      state.score += 250 * state.memoryRound;
      state.memoryRound++;
      updateHeaderUI();
      audio.playCorrectChime(state.memoryRound);
      state.isAcceptingInput = false;
      setTimeout(advanceMemoryRound, 900);
    }
  }

  // --- Keyboard & Mouse Steering ---
  function initControls() {
    window.addEventListener('keydown', (e) => {
      if (dom.modal && dom.modal.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeGame();
        } else if (state.active && state.gameType === 'math') {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (dom.mathOptions[idx]) dom.mathOptions[idx].click();
          }
        } else if (state.active && state.gameType === 'reflex') {
          if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            state.catcherX = Math.max(0.06, state.catcherX - 0.06);
          } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            state.catcherX = Math.min(0.94, state.catcherX + 0.06);
          }
        }
      }
    });

    const handlePointerMove = (clientX) => {
      if (state.active && state.gameType === 'reflex') {
        state.catcherX = Math.max(0.05, Math.min(0.95, clientX / window.innerWidth));
      }
    };

    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) handlePointerMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('resize', resizeCanvas);
  }

  // --- Event Bindings ---
  function initEvents() {
    initDOM();
    initControls();

    if (dom.btnClose) dom.btnClose.onclick = closeGame;
    if (dom.btnFullscreen) dom.btnFullscreen.onclick = toggleAppFullscreen;
    if (dom.btnMute) {
      dom.btnMute.onclick = () => {
        audio.isMuted = !audio.isMuted;
        dom.btnMute.innerHTML = audio.isMuted ? '🔇' : '🔊';
      };
    }
    if (dom.btnStartAction) {
      dom.btnStartAction.onclick = () => startGame(state.gameType);
    }

    // Level selector tabs
    dom.mathLevelTabs.forEach(tab => {
      tab.onclick = () => {
        const lvl = parseInt(tab.dataset.level, 10);
        state.mathLevel = lvl;
        dom.mathLevelTabs.forEach(t => t.classList.toggle('active', t === tab));
        startMathGame();
      };
    });

    // Designated topbar launch buttons
    const btnMath = document.getElementById('btnLaunchMathGame');
    const btnReflex = document.getElementById('btnLaunchReflexGame');
    const btnMemory = document.getElementById('btnLaunchMemoryGame');
    const btnTopFullscreen = document.getElementById('btnTopbarFullscreen');

    if (btnMath) btnMath.onclick = () => openGame('math');
    if (btnReflex) btnReflex.onclick = () => openGame('reflex');
    if (btnMemory) btnMemory.onclick = () => openGame('memory');
    if (btnTopFullscreen) btnTopFullscreen.onclick = toggleAppFullscreen;
  }

  // Global API
  window.chromeSynapseGame = {
    open: openGame,
    close: closeGame,
    toggleFullscreen: toggleAppFullscreen,
    setLevel: (lvl) => { state.mathLevel = lvl; }
  };
  window.openChromeGame = openGame;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }
})();


/* ══════════════════════════════════════════════════════════════
   ORLANDOCHROME · QUANTUM UNIVERSE GAME SUITE (STANDALONE)
   Three Exact Games:
     1. Quantum Realm (Classic Streamlined Wavepackets & Electric Lightning Arcs)
     2. Quantum Helix (Bi-Chromatic Cyan & Violet Intertwined Double-Helix)
     3. Quantum Meteor (High-Fidelity 3D Molten Asteroid & Solar Prominence Rings)
   
   Completely isolated and independent from OrlandoRecharge.
   ══════════════════════════════════════════════════════════════ */


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

(function initAntigravityEngine() {
  var backCanvas = document.getElementById("antigravityCanvas");
  var frontCanvas = document.getElementById("antigravityFrontCanvas");
  if (!backCanvas) return;
  var backCtx = backCanvas.getContext("2d");
  var frontCtx = frontCanvas ? frontCanvas.getContext("2d") : null;
  if (!backCtx) return;

  var enabled = true;
  try {
    var savedPref = localStorage.getItem("dra-antigravity-fx");
    if (savedPref === "0") enabled = false;
  } catch(e){}

  var fxLabel = document.getElementById("antigravityFxLabel");
  var fxBtn = document.getElementById("antigravityFxBtn");

  function updateBtnUI() {
    if (fxLabel) fxLabel.textContent = enabled ? "Antigravity On" : "Antigravity Off";
    if (fxBtn) fxBtn.style.borderColor = enabled ? "rgba(56, 189, 248, 0.45)" : "";
  }
  updateBtnUI();

  if (!enabled) {
    backCanvas.style.display = "none";
    if (frontCanvas) frontCanvas.style.display = "none";
  }

  var width = window.innerWidth;
  var height = window.innerHeight;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    backCanvas.width = Math.round(width * dpr);
    backCanvas.height = Math.round(height * dpr);
    backCanvas.style.width = width + "px";
    backCanvas.style.height = height + "px";
    backCtx.scale(dpr, dpr);

    if (frontCanvas && frontCtx) {
      frontCanvas.width = Math.round(width * dpr);
      frontCanvas.height = Math.round(height * dpr);
      frontCanvas.style.width = width + "px";
      frontCanvas.style.height = height + "px";
      frontCtx.scale(dpr, dpr);
    }
  }
  resize();

  window.addEventListener("resize", function() {
    backCtx.setTransform(1, 0, 0, 1, 0, 0);
    if (frontCtx) frontCtx.setTransform(1, 0, 0, 1, 0, 0);
    resize();
  }, { passive: true });

  /* ── 1. CIRCADIAN CHROMATIC HARMONIZATION PALETTES ── */
  var CIRCADIAN_PALETTES = {
    dawn: [
      { h: 36, s: 95, l: 64 },
      { h: 22, s: 92, l: 62 },
      { h: 345, s: 88, l: 66 },
      { h: 48, s: 96, l: 68 }
    ],
    solar: [
      { h: 198, s: 95, l: 58 },
      { h: 184, s: 92, l: 54 },
      { h: 215, s: 90, l: 64 },
      { h: 168, s: 88, l: 56 }
    ],
    golden: [
      { h: 38, s: 96, l: 62 },
      { h: 24, s: 94, l: 60 },
      { h: 12, s: 90, l: 58 },
      { h: 285, s: 82, l: 65 }
    ],
    twilight: [
      { h: 265, s: 88, l: 66 },
      { h: 282, s: 85, l: 62 },
      { h: 228, s: 92, l: 64 },
      { h: 310, s: 80, l: 60 }
    ],
    deepnight: [
      { h: 224, s: 92, l: 62 },
      { h: 200, s: 90, l: 56 },
      { h: 245, s: 86, l: 65 },
      { h: 188, s: 92, l: 52 }
    ]
  };

  function getActiveCircadianPalette() {
    var hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return CIRCADIAN_PALETTES.dawn;
    if (hour >= 8 && hour < 16) return CIRCADIAN_PALETTES.solar;
    if (hour >= 16 && hour < 19) return CIRCADIAN_PALETTES.golden;
    if (hour >= 19 && hour < 22) return CIRCADIAN_PALETTES.twilight;
    return CIRCADIAN_PALETTES.deepnight;
  }

  /* ══════════════════════════════════════════════════════════════
     FUTURISTIC PROCEDURAL 3D ASTEROID & VOLUMETRIC PLASMA ENGINE
     (MeteorVFXEngine - Developed by 10 IT & Graphics Specialists)
     - 6 High-Fidelity 3D Asteroid Rock Sprites with Normal Shading
     - Fractal Molten Magma Fissures with Planck Blackbody Radiation
     - Soft Volumetric Gaussian Smoke Plumes with Multi-Lobe Dispersion
     - Blackbody Radiant Plasma Core Sprites (3200K Ionization)
     - Zero Heap Allocations during Real-Time Animation Loop (60-120 FPS)
     ══════════════════════════════════════════════════════════════ */
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
  window.MeteorVFXEngine = MeteorVFXEngine;

  /* ── 2. PARTICLE DYNAMICS SETUP ── */
  var SHIELD_RADIUS = 76;
  var INFLUENCE_RADIUS = 168;

  var isGameMode = false;
  var gameParticleStyle = "helix"; // "classic" | "helix" | "meteor"
  var gameGlowProgress = 0.0;
  var isVictoryDancing = false;
  var victoryDanceStartTime = 0;

  var mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    lastActiveTime: 0
  };

  var lastCursorX = -9999;
  var lastCursorY = -9999;
  var cursorSpeed = 0;

  var shockwaves = [];
  var sonicHalos = [];
  var lastDownbeatTime = 0;
  var idleBreathPhase = 0;

  function triggerHyperspaceShockwave(originX, originY, baseHue) {
    var pal = getActiveCircadianPalette();
    var hue = (baseHue !== undefined) ? baseHue : pal[Math.floor(Math.random() * pal.length)].h;
    shockwaves.push({
      x: (originX !== undefined) ? originX : width / 2,
      y: (originY !== undefined) ? originY : height / 2,
      radius: 8,
      maxRadius: Math.max(width, height) * 0.75,
      speed: 13.0,
      alpha: 1.0,
      hue: hue
    });
  }

  // ── Smart Reading Horizon & Card Graviton Perimeter Tracking ──
  var hoveredCardRect = null;
  var gravitonRects = [];
  var lastGravitonScan = 0;

  function updateGravitonRects() {
    var nowMs = Date.now();
    if (nowMs - lastGravitonScan < 1800) return;
    lastGravitonScan = nowMs;
    gravitonRects = [];
    var clockEl = document.getElementById("clock");
    if (clockEl) {
      var cr = clockEl.getBoundingClientRect();
      if (cr.width > 0) gravitonRects.push({ x1: cr.left, y1: cr.top, x2: cr.right, y2: cr.bottom, cx: (cr.left + cr.right) / 2, cy: (cr.top + cr.bottom) / 2 });
    }
    var cards = document.querySelectorAll(".alarm-item");
    for (var ci = 0; ci < Math.min(cards.length, 6); ci++) {
      var ar = cards[ci].getBoundingClientRect();
      if (ar.top < height && ar.bottom > 0) {
        gravitonRects.push({ x1: ar.left, y1: ar.top, x2: ar.right, y2: ar.bottom, cx: (ar.left + ar.right) / 2, cy: (ar.top + ar.bottom) / 2 });
      }
    }
  }

  document.addEventListener("pointerover", function(e) {
    var item = e.target && e.target.closest(".alarm-item, #clock, .stat-badge, .console-mini-pill");
    if (item) {
      var rect = item.getBoundingClientRect();
      hoveredCardRect = { x1: rect.left, y1: rect.top, x2: rect.right, y2: rect.bottom, cx: (rect.left + rect.right) / 2, cy: (rect.top + rect.bottom) / 2 };
    } else {
      hoveredCardRect = null;
    }
  }, { passive: true });

  // Dual-Layer Population: Device-scaled ambient swarm + Dedicated 3D Weaver Dancers (Tuned for silky 60-120fps)
  var AMBIENT_COUNT = width < 600 ? 38 : (width < 900 ? 55 : (width < 1200 ? 85 : 115));
  var WEAVER_COUNT = width < 600 ? 8 : (width < 768 ? 10 : 14); // Evenly distributed in depth: exactly ~5-7 are in front at any moment!

  function createParticle(isWeaver, phaseOffset) {
    var minSpawnX = 40, maxSpawnX = width - 40;
    var minSpawnY = 40, maxSpawnY = height - 40;
    var x = minSpawnX + Math.random() * (maxSpawnX - minSpawnX);
    var y = minSpawnY + Math.random() * (maxSpawnY - minSpawnY);

    var pal = getActiveCircadianPalette();
    var colorDef = pal[Math.floor(Math.random() * pal.length)];
    var driftAngle = Math.random() * Math.PI * 2;
    var driftSpeed = isWeaver ? (0.42 + Math.random() * 0.50) : (0.30 + Math.random() * 0.45);

    var depthPhase = (phaseOffset !== undefined) ? phaseOffset : (Math.random() * Math.PI * 2);
    var depthSpeed = 0.0022 + Math.random() * 0.0016; // Smooth 4-6 second orbital weave cycle
    var initialZ = isWeaver ? Math.sin(depthPhase) : -0.5;
    var isFront = isWeaver ? (initialZ > 0.05) : false;

    // All weavers are radiant; ambient particles have ~26% radiant nodes
    var isRadiant = isWeaver ? true : (Math.random() < 0.26);
    var hue2 = (colorDef.h + 24 + Math.floor(Math.random() * 18)) % 360;

    return {
      x: x,
      y: y,
      vx: Math.cos(driftAngle) * driftSpeed,
      vy: Math.sin(driftAngle) * driftSpeed,
      baseVx: Math.cos(driftAngle) * driftSpeed,
      baseVy: Math.sin(driftAngle) * driftSpeed,
      baseSpeed: driftSpeed,
      isWeaver: !!isWeaver,
      depthPhase: depthPhase,
      depthSpeed: depthSpeed,
      z: initialZ,
      isFront: isFront,
      baseSize: isWeaver ? (2.4 + Math.random() * 0.5) : (isRadiant ? (2.0 + Math.random() * 0.4) : (1.5 + Math.random() * 0.35)),
      size: 2.0,
      baseLength: isWeaver ? (9.5 + Math.random() * 4.5) : (isRadiant ? (7.0 + Math.random() * 3.5) : (5.0 + Math.random() * 2.5)),
      length: 8.0,
      isRadiant: isRadiant,
      glowBlur: isWeaver ? (18 + Math.random() * 8) : (isRadiant ? (9 + Math.random() * 7) : 0),
      hue: colorDef.h,
      hue2: hue2,
      targetHue: colorDef.h,
      sat: colorDef.s,
      lit: colorDef.l,
      alpha: isWeaver ? (0.85 + Math.random() * 0.15) : (isRadiant ? (0.65 + Math.random() * 0.25) : (0.38 + Math.random() * 0.35)),
      pulsePhase: Math.random() * Math.PI * 2,
      dancePhase: Math.random() * Math.PI * 2,
      turnFlex: 0, // Subtle momentary flex strictly during turns/reversals; 0 = perfectly straight
      prevAngle: driftAngle,
      heading: driftAngle,
      fadeMode: "normal", // "normal", "fading", "emerging"
      fadeProgress: 1.0,
      fadeSpeed: 0.08,
      emergeBloom: 0.0,
      growthMultiplier: 1.0,
      lumiTier: 0, // 0 = baseline, 1 = grow 2x + brighter, 2 = grow 3x + most bright
      numJoints: isFront ? 8 : 7,
      segmentSpacing: 3.0,
      wavePhase: Math.random() * Math.PI * 2,
      spine: (function() {
        var sp = [];
        var num = isFront ? 8 : 7;
        for (var si = 0; si < num; si++) {
          sp.push({
            x: x - Math.cos(driftAngle) * si * 3.0,
            y: y - Math.sin(driftAngle) * si * 3.0
          });
        }
        return sp;
      })(),
      stardust: [],
      trail: []
    };
  }

  var particles = [];
  // 1. Create 3D Weaver Dancers (distributed uniformly in depth phase around 2*PI circle)
  for (var w = 0; w < WEAVER_COUNT; w++) {
    var phase = (w / WEAVER_COUNT) * Math.PI * 2;
    particles.push(createParticle(true, phase));
  }
  // 2. Create Ambient Swarm
  for (var b = 0; b < AMBIENT_COUNT; b++) {
    particles.push(createParticle(false));
  }

  // 3. Exact Deterministic Three-Tier Particle System Across All Screens (Tier 0 Eliminated)
  // Requirement: Exactly 6 Extra Big (Tier 3), exactly 8 Big (Tier 2), and ALL remaining are Medium (Tier 1). No Small particles.
  for (var pi = 0; pi < particles.length; pi++) {
    if (pi < 6) {
      // Tier 3: Exactly 6 Extra Big Apex Quantum Singularities (Noticeably larger, magnificent flagship centerpieces)
      particles[pi].growthMultiplier = 3.65;
      particles[pi].lumiTier = 3;
      particles[pi].isApexSingularity = true;
      particles[pi].isTitan = true;
      particles[pi].numJoints = 8;
      particles[pi].segmentSpacing = 3.0;
      particles[pi].spine = [];
      for (var sj = 0; sj < 8; sj++) {
        particles[pi].spine.push({
          x: particles[pi].x - Math.cos(particles[pi].heading) * sj * 3.0,
          y: particles[pi].y - Math.sin(particles[pi].heading) * sj * 3.0
        });
      }
    } else if (pi < 14) {
      // Tier 2: Exactly 8 Big Quantum Comets (Substantial, majestic centerpieces)
      particles[pi].growthMultiplier = 2.50;
      particles[pi].lumiTier = 2;
      particles[pi].isTitan = true;
      particles[pi].numJoints = 8;
      particles[pi].segmentSpacing = 3.0;
      particles[pi].spine = [];
      for (var sj = 0; sj < 8; sj++) {
        particles[pi].spine.push({
          x: particles[pi].x - Math.cos(particles[pi].heading) * sj * 3.0,
          y: particles[pi].y - Math.sin(particles[pi].heading) * sj * 3.0
        });
      }
    } else {
      // Tier 1: All remaining particles upgraded to Medium (No Small particles remain in the universe)
      particles[pi].growthMultiplier = 1.60;
      particles[pi].lumiTier = 1;
      particles[pi].isTitan = false;
      particles[pi].numJoints = 7;
      particles[pi].segmentSpacing = 3.0;
      particles[pi].spine = [];
      for (var sj = 0; sj < 7; sj++) {
        particles[pi].spine.push({
          x: particles[pi].x - Math.cos(particles[pi].heading) * sj * 3.0,
          y: particles[pi].y - Math.sin(particles[pi].heading) * sj * 3.0
        });
      }
    }
  }

  var afterRenderHook = null;

  function onPointerMove(e) {
    var cx = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    var cy = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
    if (typeof cx === "number" && typeof cy === "number") {
      mouse.targetX = cx;
      mouse.targetY = cy;
      if (isGameMode) {
        mouse.x = cx;
        mouse.y = cy;
      }
      mouse.active = true;
      mouse.lastActiveTime = Date.now();
    }
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchstart", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", function() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
    hoveredCardRect = null;
  });

  window.addEventListener("alarm-fire", function(e) {
    var hue = e && e.detail && e.detail.hue;
    var x = width * 0.5;
    var y = height * 0.35;
    triggerHyperspaceShockwave(x, y, hue);
  });

  var animId = null;
  var isTabActive = true;
  var prevBassEnergy = 0;
  var beatKickImpulse = 0;

  // Pre-allocated typed buffers for zero-GC 60fps wavepacket spine & ribbon contour rendering
  var _ptsX = new Float32Array(24);
  var _ptsY = new Float32Array(24);
  var _leftX = new Float32Array(24);
  var _leftY = new Float32Array(24);
  var _rightX = new Float32Array(24);
  var _rightY = new Float32Array(24);
  var _ribbon1X = new Float32Array(24);
  var _ribbon1Y = new Float32Array(24);
  var _ribbon2X = new Float32Array(24);
  var _ribbon2Y = new Float32Array(24);
  var _ribbon1Z = new Float32Array(24);
  var _ribbon2Z = new Float32Array(24);

  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      isTabActive = false;
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else {
      isTabActive = true;
      if (enabled && !animId) loop();
    }
  });

  function loop() {
    if (!enabled || !isTabActive) return;
    animId = requestAnimationFrame(loop);

    // Clear both background and foreground canvases
    backCtx.clearRect(0, 0, width, height);
    if (frontCtx) frontCtx.clearRect(0, 0, width, height);

    var now = Date.now();
    if (!isGameMode) updateGravitonRects();

    // Smooth ~1.35s universe illumination transition curve matching surroundings S-curve
    var targetGameGlow = isGameMode ? 1.0 : 0.0;
    gameGlowProgress += (targetGameGlow - gameGlowProgress) * 0.028;

    // ── Kinetic Jet Cursor Velocity Calculation ──
    if (mouse.active) {
      if (lastCursorX > -1000) {
        var cvx = mouse.targetX - lastCursorX;
        var cvy = mouse.targetY - lastCursorY;
        cursorSpeed = Math.hypot(cvx, cvy);
      }
      lastCursorX = mouse.targetX;
      lastCursorY = mouse.targetY;
    } else {
      cursorSpeed = 0;
    }

    if (mouse.active && (now - mouse.lastActiveTime > 3000)) {
      mouse.active = false;
    }

    if (mouse.active) {
      if (mouse.x < -1000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else if (isGameMode) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        var mLerp = 0.35;
        mouse.x += (mouse.targetX - mouse.x) * mLerp;
        mouse.y += (mouse.targetY - mouse.y) * mLerp;
      }
    }

    var mx = mouse.x;
    var my = mouse.y;
    var mActive = mouse.active;
    var isHighSpeedCursor = cursorSpeed > 8.5;

    // ── 100% Real-Time FFT Beat & Engraved Song Telemetry ──
    var audioData = (typeof getAudioBeatTelemetry === "function") ? getAudioBeatTelemetry() : { active: false, bass: 0, subBass: 0, strum: 0, piano: 0, mid: 0, treble: 0, energy: 0 };
    var liveBass = audioData.bass;
    var liveSub = audioData.subBass;
    var liveStrum = audioData.strum;
    var livePiano = audioData.piano;
    var liveMid = audioData.mid;
    var liveTreble = audioData.treble;
    var liveEnergy = audioData.energy;
    var isAudioHot = audioData.active && (liveEnergy > 0.02 || liveBass > 0.04);

    var curChoreo = audioData.choreo;

    var transientThreshold = (curChoreo && curChoreo.style === "pop-bounce") ? 0.18 : 0.25;
    if (liveBass > prevBassEnergy + 0.06 && liveBass > transientThreshold) {
      beatKickImpulse = Math.min(1.0, beatKickImpulse + liveBass * 0.90);
    }
    prevBassEnergy = liveBass;
    beatKickImpulse *= 0.84;

    // ── FEATURE 4: DOWNBEAT SONIC HALO (Micro Sonic Boom on Measure Drop) ──
    var isDownbeat = isAudioHot && (liveBass > 0.30) && (liveBass - prevBassEnergy > 0.10) && (now - lastDownbeatTime > 1150);
    if (isDownbeat) {
      lastDownbeatTime = now;
      for (var fHi = 0; fHi < particles.length; fHi++) {
        if (particles[fHi].isFront && Math.random() < 0.40) {
          sonicHalos.push({
            x: particles[fHi].x,
            y: particles[fHi].y,
            radius: 3,
            maxRadius: 18,
            speed: 1.6,
            alpha: 0.82,
            hue: particles[fHi].hue
          });
          break;
        }
      }
    }

    // ── FEATURE 3: IDLE NEBULA BREATH (Resting Pulse when Paused / Idle) ──
    var isIdle = !isAudioHot && (!mouse.active || (now - mouse.lastActiveTime > 4000));
    var idleBreathFactor = 0;
    if (isIdle) {
      idleBreathPhase += 0.016; // ~4.5 second smooth meditative breath
      idleBreathFactor = Math.sin(idleBreathPhase);
    } else {
      idleBreathPhase = 0;
    }

    // ── Update & Render Hyperspace Shockwaves (On Background Canvas) ──
    for (var sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
      var sw = shockwaves[sIdx];
      sw.radius += sw.speed;
      sw.speed *= 0.982;
      sw.alpha *= 0.962;

      backCtx.beginPath();
      backCtx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      backCtx.strokeStyle = "hsla(" + sw.hue + ", 95%, 72%, " + (sw.alpha * 0.55).toFixed(2) + ")";
      backCtx.lineWidth = 1.8;
      backCtx.stroke();

      if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
        shockwaves.splice(sIdx, 1);
      }
    }

    // ── Render Downbeat Sonic Halos ──
    for (var shIdx = sonicHalos.length - 1; shIdx >= 0; shIdx--) {
      var sh = sonicHalos[shIdx];
      sh.radius += sh.speed;
      sh.alpha *= 0.87;
      if (sh.alpha > 0.04 && sh.radius < sh.maxRadius) {
        var sTargetCtx = frontCtx || backCtx;
        sTargetCtx.beginPath();
        sTargetCtx.arc(sh.x, sh.y, sh.radius, 0, Math.PI * 2);
        sTargetCtx.strokeStyle = "hsla(" + Math.round(sh.hue) + ", 96%, 74%, " + sh.alpha.toFixed(2) + ")";
        sTargetCtx.lineWidth = 1.2;
        sTargetCtx.stroke();
      } else {
        sonicHalos.splice(shIdx, 1);
      }
    }

    var activePal = (isAudioHot && curChoreo && curChoreo.palette) ? curChoreo.palette : getActiveCircadianPalette();

    var radiantBackNodes = [];

    // Line-of-sight bounds: particles are kept 100% inside visible screen!
    // Solution 4: In Game Mode, MIN_Y sits below the top HUD bar (78px) so particles never hide behind Play Music / Exit buttons
    var MARGIN_X = Math.max(18, Math.min(48, width * 0.03));
    var MARGIN_Y = Math.max(18, Math.min(45, height * 0.03));
    var MIN_X = MARGIN_X, MAX_X = width - MARGIN_X;
    var MIN_Y = isGameMode ? Math.max(78, MARGIN_Y) : MARGIN_Y;
    var MAX_Y = height - MARGIN_Y;

    // ── SPONTANEOUS QUANTUM FLASH-FADE & IMMEDIATE EMERGENCE CONTROLLER ──
    var activeFadingCount = 0;
    for (var fCount = 0; fCount < particles.length; fCount++) {
      if (particles[fCount].fadeMode !== "normal") activeFadingCount++;
    }

    var triggerFlash = (Math.random() < 0.038) || (beatKickImpulse > 0.42 && Math.random() < 0.22);
    if (triggerFlash && activeFadingCount < 4) {
      // 1. Pick 1 random normal particle to immediately fade out
      var fIdx = Math.floor(Math.random() * particles.length);
      var pFade = particles[fIdx];
      if (pFade && pFade.fadeMode === "normal") {
        pFade.fadeMode = "fading";
        pFade.fadeSpeed = 0.075 + Math.random() * 0.045; // Fades out in ~10-14 frames (~170ms)
      }

      // 2. Concurrently pick another particle to immediately emerge at a fresh spontaneous location!
      var eIdx = Math.floor(Math.random() * particles.length);
      var pEmerge = particles[eIdx];
      if (pEmerge && pEmerge.fadeMode === "normal" && eIdx !== fIdx) {
        pEmerge.x = MIN_X + 25 + Math.random() * (MAX_X - MIN_X - 50);
        pEmerge.y = MIN_Y + 25 + Math.random() * (MAX_Y - MIN_Y - 50);
        var freshAngle = Math.random() * Math.PI * 2;
        var freshSpeed = pEmerge.baseSpeed || (0.35 + Math.random() * 0.50);
        pEmerge.vx = Math.cos(freshAngle) * freshSpeed;
        pEmerge.vy = Math.sin(freshAngle) * freshSpeed;
        pEmerge.fadeMode = "emerging";
        pEmerge.fadeProgress = 0.06;
        pEmerge.emergeBloom = 1.0; // Instant luminous emergence flash
        pEmerge.fadeSpeed = 0.080 + Math.random() * 0.040; // Emerges in ~10-12 frames
      }
    }

    // ── Main Particle Simulation Loop ──
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (p.exploded) continue;
      p.pulsePhase += 0.025;
      p.dancePhase += 0.035;

      // ── 3D Z-DEPTH WEAVING DYNAMICS (Inside, Outside, Above and Behind Cards) ──
      if (p.isWeaver) {
        p.depthPhase += p.depthSpeed;
        if (isAudioHot) {
          // Beat transients accelerate the weave dance
          p.depthPhase += (liveBass * 0.0035 + beatKickImpulse * 0.0045);
        }
        p.z = Math.sin(p.depthPhase);
        // z > 0.05 rises into Foreground Canvas (z-index: 3, floating in front of cards & clock)
        // z <= 0.05 dives into Background Canvas (z-index: 1, dancing behind cards & clock)
        p.isFront = (p.z > 0.05);
      }

      // ── Immediate Fade & Emergence Transitions ──
      if (p.fadeMode === "fading") {
        p.fadeProgress -= p.fadeSpeed;
        if (p.fadeProgress <= 0) {
          p.fadeProgress = 0;
          p.x = MIN_X + 25 + Math.random() * (MAX_X - MIN_X - 50);
          p.y = MIN_Y + 25 + Math.random() * (MAX_Y - MIN_Y - 50);
          var reAngle = Math.random() * Math.PI * 2;
          var reSpeed = p.baseSpeed || (0.35 + Math.random() * 0.50);
          p.vx = Math.cos(reAngle) * reSpeed;
          p.vy = Math.sin(reAngle) * reSpeed;
          p.fadeMode = "emerging";
          p.fadeProgress = 0.06;
          p.emergeBloom = 1.0;
        }
      } else if (p.fadeMode === "emerging") {
        p.fadeProgress += p.fadeSpeed;
        p.emergeBloom *= 0.85;
        if (p.fadeProgress >= 1.0) {
          p.fadeProgress = 1.0;
          p.fadeMode = "normal";
          p.emergeBloom = 0.0;
        }
      }

      // Dynamic size and glow based on 3D depth + game mode illumination
      // User Requirement: "some particles must grow twice, some grows thrice"
      // User Requirement: "When the game ends, they go back smoothly to the original state"
      var depthScale = p.isWeaver ? (0.86 + Math.max(0, p.z) * 0.44) : 1.0;
      var mult = p.growthMultiplier || 1.25;
      var curGrowth = 1.0 + (mult - 1.0) * gameGlowProgress;
      var isHelix = (gameParticleStyle === "helix");
      var sizeMultiplier = isHelix ? 2.00 : 2.00; // 2.00x across Quantum Helix, Quantum Realm, and Quantum Meteor
      var curSize = (p.baseSize * depthScale) * curGrowth * sizeMultiplier;
      var lenGrowth = 1.0 + (mult - 1.0) * gameGlowProgress * 0.85;
      var baseLength = (p.baseLength * (p.isWeaver ? (0.90 + Math.max(0, p.z) * 0.38) : 1.0)) * lenGrowth;

      // Select target canvas based on layer (all particles elevate to foreground in game mode)
      var renderAsBrightest = p.isFront || (gameGlowProgress > 0.04);
      var targetCtx = (renderAsBrightest && frontCtx) ? frontCtx : backCtx;

      // Circadian & Song Hue Interpolation
      if (Math.random() < 0.02) {
        var palColor = activePal[Math.floor(Math.random() * activePal.length)];
        p.targetHue = palColor.h;
      }
      p.hue += (p.targetHue - p.hue) * 0.03;

      // Antigravity Mouse Repulsion & Dynamic Evasion
      // In normal mode: Hard clearance shield keeps particles away from reading areas & cursor
      // In game mode: Pure fluid evasion physics in open space, while allowing players to herd & corner particles!
      var isChasedInGame = false;
      var precisionPin = 0;
      if (mActive) {
        var dx = p.x - mx;
        var dy = p.y - my;
        var dist = Math.hypot(dx, dy);

        if (isGameMode) {
          var gameInfluenceRadius = 205;
          if (dist < gameInfluenceRadius) {
            isChasedInGame = true;
            var norm = Math.max(0, 1 - dist / gameInfluenceRadius);

            // Precision Knife-Edge Corner Physics (95px corner zone):
            // Outside a tight ±7° diagonal bullseye cone (pow(diagAlign, 22)), tangential slip exceeds radial push
            // (tanW > radW) and steers toward the open wall so casual cornering always slips out!
            // ONLY holding a razor-sharp ±7° diagonal alignment drops tanW < radW to pin the particle in the corner!
            var distWallX = Math.min(p.x - MIN_X, MAX_X - p.x);
            var distWallY = Math.min(p.y - MIN_Y, MAX_Y - p.y);
            var nearWallX = Math.max(0, Math.min(1, 1 - distWallX / 95));
            var nearWallY = Math.max(0, Math.min(1, 1 - distWallY / 95));
            var inCornerPocket = nearWallX * nearWallY;

            var angle = Math.atan2(dy, dx);
            var radX = Math.cos(angle);
            var radY = Math.sin(angle);
            if (inCornerPocket > 0.01) {
              var cornerDirX = (p.x < width * 0.5) ? -0.7071 : 0.7071;
              var cornerDirY = (p.y < height * 0.5) ? -0.7071 : 0.7071;
              var diagAlign = Math.max(0, radX * cornerDirX + radY * cornerDirY);
              precisionPin = inCornerPocket * Math.pow(diagAlign, 22);
            }

            var isMouseStationary = !p.isLocked && (precisionPin < 0.75) && (now - mouse.lastActiveTime > 170);
            var evadeMultiplier = isMouseStationary ? 2.4 : 1.0;
            var evadeForce = Math.pow(norm, 1.2) * 4.65 * evadeMultiplier * (1 - precisionPin * 0.18);

            // In corners, tanW (1.88) > radW (1.50) by default so particles slip out along the wall unless precisionPin > 0.65!
            var radW = 1.92 - inCornerPocket * 0.42;
            var tanW = 1.42 + inCornerPocket * 0.46 - precisionPin * 0.68;
            var tanX = -radY;
            var tanY = radX;

            // When in a corner WITHOUT bullseye diagonal precision (precisionPin < 0.68), steer tangent toward open center!
            if (inCornerPocket > 0.15 && precisionPin < 0.68) {
              var toCenterX = (width * 0.5) - p.x;
              var toCenterY = (height * 0.5) - p.y;
              if ((tanX * toCenterX + tanY * toCenterY) < 0) {
                tanX = -tanX;
                tanY = -tanY;
              }
            }

            p.vx += (radX * radW + tanX * tanW) * evadeForce * 0.45;
            p.vy += (radY * radW + tanY * tanW) * evadeForce * 0.45;

            // Subtle quantum squirm inside the corner so player must actively micro-track
            if (inCornerPocket > 0.25) {
              var squirm = Math.sin(now * 0.022 + i * 1.7) * 0.28;
              p.vx += -radY * squirm;
              p.vy += radX * squirm;
            }

            p.turnFlex = Math.sign(tanY || 1) * 0.65;
            if (isHighSpeedCursor && p.isRadiant) {
              p.trail.push({ x: p.x, y: p.y, alpha: p.isFront ? 0.85 : 0.65 });
              if (p.trail.length > 3) p.trail.shift();
            }
          }
        } else {
          if (dist < SHIELD_RADIUS) {
            var angle = Math.atan2(dy, dx);
            p.x = mx + Math.cos(angle) * SHIELD_RADIUS;
            p.y = my + Math.sin(angle) * SHIELD_RADIUS;

            var tanX = -Math.sin(angle);
            var tanY = Math.cos(angle);
            var spinMag = p.isFront ? 3.8 : 3.2;
            p.vx = p.vx * 0.5 + tanX * spinMag;
            p.vy = p.vy * 0.5 + tanY * spinMag;

            // Subtle momentary flex specifically when banking around mouse shield
            p.turnFlex = Math.sign(tanY || 1) * 0.75;

            if (isHighSpeedCursor && p.isRadiant) {
              p.trail.push({ x: p.x, y: p.y, alpha: p.isFront ? 0.85 : 0.65 });
              if (p.trail.length > 3) p.trail.shift();
            }

          } else if (dist < INFLUENCE_RADIUS) {
            var norm = (dist - SHIELD_RADIUS) / (INFLUENCE_RADIUS - SHIELD_RADIUS);
            var force = Math.pow(1 - norm, 1.8) * 3.8;
            var angle = Math.atan2(dy, dx);
            var tanX = -Math.sin(angle);
            var tanY = Math.cos(angle);

            p.vx += (Math.cos(angle) * 1.6 + tanX * 1.3) * force * 0.38;
            p.vy += (Math.sin(angle) * 1.6 + tanY * 1.3) * force * 0.38;
          }
        }
      }

      // ── FEATURE 2: CARD-EDGE GRAVITATIONAL SLINGSHOT (Glass Skimming) ──
      if (!p.isFront && !isGameMode) {
        for (var gi = 0; gi < gravitonRects.length; gi++) {
          var gr = gravitonRects[gi];
          if (p.x >= gr.x1 - 20 && p.x <= gr.x2 + 20 && p.y >= gr.y1 - 20 && p.y <= gr.y2 + 20) {
            var nLeft = Math.abs(p.x - gr.x1) < 20;
            var nRight = Math.abs(p.x - gr.x2) < 20;
            var nTop = Math.abs(p.y - gr.y1) < 20;
            var nBottom = Math.abs(p.y - gr.y2) < 20;
            if (nLeft || nRight || nTop || nBottom) {
              if (nLeft || nRight) p.vy += (p.vy >= 0 ? 0.14 : -0.14);
              if (nTop || nBottom) p.vx += (p.vx >= 0 ? 0.14 : -0.14);
              break;
            }
          }
        }
      }

      // ── FEATURE 5: SMART READING HORIZON (Focus Clearance on Hover) ──
      var readingClearance = 1.0;
      if (hoveredCardRect && !isGameMode) {
        if (p.x >= hoveredCardRect.x1 - 16 && p.x <= hoveredCardRect.x2 + 16 &&
            p.y >= hoveredCardRect.y1 - 16 && p.y <= hoveredCardRect.y2 + 16) {
          var hdx = p.x - hoveredCardRect.cx;
          var hdy = p.y - hoveredCardRect.cy;
          var hdist = Math.hypot(hdx, hdy) || 1;
          p.vx += (hdx / hdist) * 0.28;
          p.vy += (hdy / hdist) * 0.28;
          if (p.isFront) readingClearance = 0.32; // Dip opacity so text is crystal clear
        }
      }

      // Shockwave Particle Displacement
      for (var swi = 0; swi < shockwaves.length; swi++) {
        var csw = shockwaves[swi];
        var swdx = p.x - csw.x;
        var swdy = p.y - csw.y;
        var swdist = Math.hypot(swdx, swdy);
        if (Math.abs(swdist - csw.radius) < 38) {
          var swAngle = Math.atan2(swdy, swdx);
          var swForce = csw.alpha * (p.isFront ? 5.4 : 4.2);
          p.vx += Math.cos(swAngle) * swForce;
          p.vy += Math.sin(swAngle) * swForce;
          p.alpha = Math.min(1, p.alpha + 0.30);
          p.turnFlex = (Math.random() > 0.5 ? 0.6 : -0.6);
        }
      }

      // ── Engraved Song Choreography Physics + CELEBRATION DANCE ──
      if (isVictoryDancing) {
        var elapsed = (now - victoryDanceStartTime) * 0.001;
        var danceFreq = 5.2; // Fast, lively celebratory waltz tempo (increased from 2.4)
        var danceDist = 18.0; // Dynamic lively trajectory excursion (increased from 6.5)
        var phaseOffset = i * 0.42;

        var desiredX, desiredY;

        // Swirling Celebration Dance: Particles within ~360px swirl energetically around the cursor
        if (mActive && mouse.x > 0 && mouse.y > 0) {
          var cdx = (p.victoryAnchorX || p.x) - mouse.x;
          var cdy = (p.victoryAnchorY || p.y) - mouse.y;
          var cDist = Math.hypot(cdx, cdy) || 1;
          if (cDist < 380) {
            var swirlOrbitR = Math.max(48, Math.min(260, cDist * 0.75 + Math.sin(elapsed * 3.5 + phaseOffset) * 16));
            var baseAng = Math.atan2(cdy, cdx);
            var swirlAng = baseAng + elapsed * (cDist < 140 ? 5.8 : 4.2) + (i % 3) * 0.25;
            desiredX = mouse.x + Math.cos(swirlAng) * swirlOrbitR;
            desiredY = mouse.y + Math.sin(swirlAng) * swirlOrbitR;
          } else {
            desiredX = (p.victoryAnchorX || p.x) + Math.sin(elapsed * danceFreq + phaseOffset) * danceDist;
            desiredY = (p.victoryAnchorY || p.y) + Math.cos(elapsed * (danceFreq * 1.35) + phaseOffset) * (danceDist * 0.85);
          }
        } else {
          desiredX = (p.victoryAnchorX || p.x) + Math.sin(elapsed * danceFreq + phaseOffset) * danceDist;
          desiredY = (p.victoryAnchorY || p.y) + Math.cos(elapsed * (danceFreq * 1.35) + phaseOffset) * (danceDist * 0.85);
        }

        // Fast responsive critically-damped spring force into velocity (100% smooth, zero jitter or overshoot)
        p.vx += (desiredX - p.x) * 0.16 - p.vx * 0.20;
        p.vy += (desiredY - p.y) * 0.16 - p.vy * 0.20;

        // Synchronized celebratory pulsation with harmonic color cycling
        p.alpha = Math.min(1.0, 0.78 + Math.sin(elapsed * (danceFreq * 1.5) + phaseOffset) * 0.22);
        var targetHue = (i % 3 === 0) ? 48 : ((i % 3 === 1) ? 198 : 285); // 24K Gold, Cyber Cyan & Royal Violet
        p.hue += (targetHue - p.hue) * 0.08;
      } else if (isAudioHot) {
        var mType = curChoreo ? curChoreo.motionType : "generic";
        var dForce = curChoreo ? curChoreo.danceForce : 0.65;
        if (p.isFront) dForce *= 1.35;

        var happyVerticalHop = Math.sin(now * 0.0055 + i * 0.6) * (liveBass * 2.2 + liveMid * 1.2);
        p.vy += happyVerticalHop * 0.18;

        if (beatKickImpulse > 0.18) {
          p.vy -= beatKickImpulse * (p.isFront ? 1.8 : 1.2);
        }

        if (mType === "waltz-undulate") {
          var waltzAngle = p.pulsePhase + Math.sin(now * 0.0024 + i * 0.15) * 1.2;
          var waltzPush = (liveStrum * 0.75 + liveMid * 0.45 + liveBass * 0.30) * dForce;
          p.vx += Math.cos(waltzAngle) * (waltzPush * 0.24);
          p.vy += Math.sin(waltzAngle) * (waltzPush * 0.24);

        } else if (mType === "acoustic-sway") {
          var strumAngle = Math.sin(now * 0.0020 + p.pulsePhase) * 1.5;
          var strumPush = (liveStrum * 0.90 + liveBass * 0.35) * dForce;
          p.vx += Math.sin(strumAngle) * (strumPush * 0.28);
          p.vy += (Math.cos(now * 0.0035 + i * 0.2) * 0.15) * strumPush;

        } else if (mType === "pop-bounce") {
          var bounceHop = Math.sin(now * 0.008 + i * 0.4) * (liveBass * 1.6 + liveMid * 0.6) * dForce;
          p.vy += bounceHop * 0.26;
          var popLateral = Math.cos(now * 0.004 + p.dancePhase) * (liveMid * 0.9 + liveBass * 0.5) * dForce;
          p.vx += popLateral * 0.22;

        } else if (mType === "ambient-drift") {
          var ambAngle = p.pulsePhase + Math.sin(now * 0.0015) * 0.8;
          var ambEnergy = (liveTreble * 0.85 + liveMid * 0.45) * dForce;
          p.vx += Math.cos(ambAngle) * (ambEnergy * 0.16);
          p.vy += Math.sin(ambAngle) * (ambEnergy * 0.16);

        } else {
          var harmAngle = p.pulsePhase;
          var harmForce = (liveBass * 0.70 + liveMid * 0.40) * dForce;
          p.vx += Math.cos(harmAngle) * (harmForce * 0.20);
          p.vy += Math.sin(harmAngle) * (harmForce * 0.20);
        }
      }

      // Natural damping & restoration (less drag in game mode so evading particles sustain higher speed)
      var dampRate = isGameMode ? 0.974 : (isIdle ? 0.978 : 0.965);
      p.vx *= dampRate;
      p.vy *= dampRate;
      p.vx += (p.baseVx - p.vx) * (isIdle ? 0.012 : 0.022);
      p.vy += (p.baseVy - p.vy) * (isIdle ? 0.012 : 0.022);

      p.x += p.vx;
      p.y += p.vy;

      // ── LINE-OF-SIGHT SCREEN CONTAINMENT (Aerodynamic / Hydrodynamic Curving Perimeter - Zero Hard Bounces) ──
      // Full perimeter cushion along walls; yields only slightly (28% max) under razor-sharp diagonal corner pin
      var turnScale = isChasedInGame ? (1.0 - precisionPin * 0.28) : 1.0;
      var TURN_BUFFER = 75;
      if (p.x < MIN_X + TURN_BUFFER) {
        var f = ((MIN_X + TURN_BUFFER - p.x) / TURN_BUFFER) * turnScale;
        p.vx += f * f * 0.35;
        p.vy += (p.vy >= 0 ? 0.16 : -0.16) * f;
      } else if (p.x > MAX_X - TURN_BUFFER) {
        var f = ((p.x - (MAX_X - TURN_BUFFER)) / TURN_BUFFER) * turnScale;
        p.vx -= f * f * 0.35;
        p.vy += (p.vy >= 0 ? 0.16 : -0.16) * f;
      }
      if (p.y < MIN_Y + TURN_BUFFER) {
        var f = ((MIN_Y + TURN_BUFFER - p.y) / TURN_BUFFER) * turnScale;
        p.vy += f * f * 0.35;
        p.vx += (p.vx >= 0 ? 0.16 : -0.16) * f;
      } else if (p.y > MAX_Y - TURN_BUFFER) {
        var f = ((p.y - (MAX_Y - TURN_BUFFER)) / TURN_BUFFER) * turnScale;
        p.vy -= f * f * 0.35;
        p.vx += (p.vx >= 0 ? 0.16 : -0.16) * f;
      }

      // Soft perimeter containment (lively 0.40 rebound; slight 6% max glide damping under precision corner pin)
      var wallBounce = isChasedInGame ? (0.40 - precisionPin * 0.10) : 0.45;
      var wallGlide = isChasedInGame ? (1.0 - precisionPin * 0.06) : 1.0;
      if (p.x < MIN_X) {
        p.x = MIN_X;
        if (p.vx < 0) p.vx = -p.vx * wallBounce;
        if (isChasedInGame) p.vy *= wallGlide;
      } else if (p.x > MAX_X) {
        p.x = MAX_X;
        if (p.vx > 0) p.vx = -p.vx * wallBounce;
        if (isChasedInGame) p.vy *= wallGlide;
      }
      if (p.y < MIN_Y) {
        p.y = MIN_Y;
        if (p.vy < 0) p.vy = -p.vy * wallBounce;
        if (isChasedInGame) p.vx *= wallGlide;
      } else if (p.y > MAX_Y) {
        p.y = MAX_Y;
        if (p.vy > 0) p.vy = -p.vy * wallBounce;
        if (isChasedInGame) p.vx *= wallGlide;
      }

      if (!p.isFront && p.isRadiant) radiantBackNodes.push(p);

      // ── Render Kinetic Jet Trails ──
      if (p.trail.length > 0) {
        for (var tIdx = p.trail.length - 1; tIdx >= 0; tIdx--) {
          var tr = p.trail[tIdx];
          tr.alpha *= 0.74;
          if (tr.alpha > 0.05) {
            targetCtx.beginPath();
            targetCtx.arc(tr.x, tr.y, p.isFront ? 1.6 : 1.2, 0, Math.PI * 2);
            targetCtx.fillStyle = "hsla(" + Math.round(p.hue) + ", 95%, 72%, " + (tr.alpha * p.fadeProgress).toFixed(2) + ")";
            targetCtx.fill();
          } else {
            p.trail.splice(tIdx, 1);
          }
        }
      }

      // ── LIVING QUANTUM PARTICLE KINEMATICS (Snake-like Head-Leading Turns, Straight-Ahead Inertia) ──
      var currentSpeed = Math.hypot(p.vx, p.vy);
      var targetAngle = (currentSpeed > 0.05) ? Math.atan2(p.vy, p.vx) : (p.heading || 0);

      if (p.heading === undefined) p.heading = targetAngle;

      var angleDiff = targetAngle - p.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Smooth banking turn: head leads the turn dynamically (max ~9.2 deg/frame)
      var maxTurnRate = 0.16;
      var turnStep = Math.max(-maxTurnRate, Math.min(maxTurnRate, angleDiff * 0.22));
      p.heading += turnStep;
      while (p.heading > Math.PI) p.heading -= Math.PI * 2;
      while (p.heading < -Math.PI) p.heading += Math.PI * 2;

      // ── 1. Inverse Kinematics Spine Tracking: Head curves first, tail follows curve, goes straight immediately ──
      var isHelix = (gameParticleStyle === "helix");
      var isMeteor = (gameParticleStyle === "meteor");
      // Proportional spine joint count across Tier 3 (Extra Big), Tier 2 (Big), and Tier 1 (Medium)
      var targetSpineK = isGameMode ? ((p.lumiTier >= 2) ? (p.isFront ? 8 : 7) : (p.isFront ? 7 : 6)) : (p.isFront ? 6 : 5);
      if (!p.spine || p.spine.length !== targetSpineK) {
        var spc = p.segmentSpacing || 3.0;
        p.spine = [];
        for (var sj = 0; sj < targetSpineK; sj++) {
          p.spine.push({ x: p.x - Math.cos(p.heading) * sj * spc, y: p.y - Math.sin(p.heading) * sj * spc });
        }
      }
      p.spine[0].x = p.x;
      p.spine[0].y = p.y;

      // Speed-dependent wave oscillation: faster motion makes the intertwined ribbons undulate more dynamically
      var speedRatio = Math.max(0, (currentSpeed - p.baseSpeed) / (p.baseSpeed * 2.2));
      p.wavePhase = (p.wavePhase || 0) + (0.16 + speedRatio * 0.22);

      // Controlled tail length & reduced high-speed stretch across Quantum Realm, Quantum Helix, and Quantum Meteor
      var tailGrowth = 1.0 + (mult - 1.0) * gameGlowProgress * 0.50;
      var speedStretch = isGameMode ? Math.min(0.35, speedRatio * 0.25) : 0;
      var curSpacing = (p.segmentSpacing || 3.0) * (isGameMode ? 1.18 : 1.0) * tailGrowth * (1.0 + speedStretch);
      var K = p.spine.length;
      var cosH = Math.cos(p.heading);
      var sinH = Math.sin(p.heading);
      for (var sj = 1; sj < K; sj++) {
        var leader = p.spine[sj - 1];
        var follower = p.spine[sj];
        var sdx = follower.x - leader.x;
        var sdy = follower.y - leader.y;
        var sDist = Math.hypot(sdx, sdy);
        if (sDist > 0.001) {
          var invD = curSpacing / sDist;
          follower.x = leader.x + sdx * invD;
          follower.y = leader.y + sdy * invD;
        } else {
          follower.x = leader.x - cosH * curSpacing;
          follower.y = leader.y - sinH * curSpacing;
        }
      }

      // Compute display points & dual interwoven ribbon coordinates into pre-allocated typed arrays (zero per-frame heap allocations)
      _ptsX[0] = p.spine[0].x;
      _ptsY[0] = p.spine[0].y;
      _ribbon1X[0] = p.spine[0].x;
      _ribbon1Y[0] = p.spine[0].y;
      _ribbon2X[0] = p.spine[0].x;
      _ribbon2Y[0] = p.spine[0].y;

      var invK = 1 / K;
      if (isHelix) {
        // Silky-Smooth Continuous Quantum Helix Double-Strand Ribbon (Iconic & Ultra-Fast)
        var waveAmp = curSize * 0.32;
        var twistRate = 1.75;

        for (var sj = 1; sj < K; sj++) {
          var pPrev = p.spine[sj - 1];
          var pCurr = p.spine[sj];
          var segDx = pPrev.x - pCurr.x;
          var segDy = pPrev.y - pCurr.y;
          var segLen = Math.hypot(segDx, segDy) || 1;
          var perpX = -segDy / segLen;
          var perpY = segDx / segLen;

          var env = Math.sin((sj * invK) * Math.PI); // Smooth envelope: 0 at head, peaks at mid-body, 0 at tail
          var wave1 = Math.sin(p.wavePhase - sj * twistRate) * waveAmp * env;
          var wave2 = -wave1; // Smooth counter-phase strand

          _ptsX[sj] = pCurr.x;
          _ptsY[sj] = pCurr.y;

          _ribbon1X[sj] = pCurr.x + perpX * wave1;
          _ribbon1Y[sj] = pCurr.y + perpY * wave1;

          _ribbon2X[sj] = pCurr.x + perpX * wave2;
          _ribbon2Y[sj] = pCurr.y + perpY * wave2;
        }
      } else {
        // Classic streamlined single-contour quantum wavepacket (Pure, sleek wave)
        var waveAmp = curSize * 0.20;
        for (var sj = 1; sj < K; sj++) {
          var pPrev = p.spine[sj - 1];
          var pCurr = p.spine[sj];
          var segDx = pPrev.x - pCurr.x;
          var segDy = pPrev.y - pCurr.y;
          var segLen = Math.hypot(segDx, segDy) || 1;
          var wave = Math.sin(p.wavePhase - sj * 0.65) * waveAmp * (sj * invK);
          _ptsX[sj] = pCurr.x - (segDy / segLen) * wave;
          _ptsY[sj] = pCurr.y + (segDx / segLen) * wave;
        }
      }

      var headR = curSize * 0.54;
      p.curSize = curSize;
      p.currentAngle = p.heading;

      // ── FEATURE 1: RELATIVISTIC SPEED-DILATION (Micro Doppler Shift on Acceleration) ──
      var dopplerBoost = Math.min(1.0, speedRatio * 0.65 + beatKickImpulse * 0.45);

      var currentAlpha = Math.min(0.98, p.alpha * (0.82 + Math.sin(p.pulsePhase) * 0.18)) * p.fadeProgress * readingClearance;
      if (isAudioHot) {
        currentAlpha = Math.min(1.0, currentAlpha + liveBass * 0.25);
      }

      var tier = p.lumiTier || 1;
      var isTargetLocked = !!p.isLocked;
      var gameLitBoost = (tier === 3) ? (gameGlowProgress * 8) : ((tier === 2) ? (gameGlowProgress * 5) : (gameGlowProgress * 3));
      var gameAlphaBoost = (tier === 3) ? (gameGlowProgress * 0.40) : ((tier === 2) ? (gameGlowProgress * 0.30) : (gameGlowProgress * 0.20));
      var fLitBoost = isAudioHot ? (liveBass * 14 + beatKickImpulse * 8) : 0;
      var fHeadLit = Math.min(92, (tier === 3 ? 84 : (tier === 2 ? 78 : 74)) + fLitBoost + dopplerBoost * 8 + gameLitBoost + (isTargetLocked ? 10 : 0));
      var fTailLit = Math.min(78, Math.max(52, p.lit + fLitBoost * 0.4 - dopplerBoost * 4 + (tier === 3 ? 6 : (tier === 2 ? 3 : 0)) + (isTargetLocked ? 8 : 0)));
      var fHeadHue = (dopplerBoost > 0.12) ? Math.round(p.hue2 * (1 - dopplerBoost * 0.5) + 198 * (dopplerBoost * 0.5)) : (p.hue2 | 0);
      var fTailHue = (dopplerBoost > 0.12) ? Math.round(p.hue * (1 - dopplerBoost * 0.4) + 22 * (dopplerBoost * 0.4)) : (p.hue | 0);
      var midHue = (fTailHue + fHeadHue) >> 1;

      // When Target is physically locked & synchronizing: particle head radiates high-energy resonant gold & cyan
      if (isTargetLocked) {
        var lockRatio = (typeof contactDuration === "number") ? Math.min(1.0, contactDuration / 2.0) : 0.5;
        fHeadHue = Math.round(48 * lockRatio + fHeadHue * (1 - lockRatio));
        midHue = Math.round(195 * lockRatio + midHue * (1 - lockRatio));
      }
      var renderAlpha = Math.min(0.95, currentAlpha * (1.0 + gameAlphaBoost) + (gameGlowProgress * 0.16));

      // ── 2. Render Seamless Smooth Tapered Quantum Wavepacket Body & Intertwined Ribbons ──
      if (K >= 2) {
        var invKm1 = 1 / (K - 1);
        if (!isHelix) {
          for (var sj = 0; sj < K; sj++) {
            var tNorm = 1 - sj * invKm1; // 1.0 at head (sj=0), 0.0 at tail tip (sj=K-1)
            var taper = tNorm * (0.15 + 0.85 * tNorm);
            var rj = Math.max(0.35, headR * (0.10 + 0.90 * taper));
            var dxT, dyT;
            if (sj === 0) {
              dxT = _ptsX[0] - _ptsX[1];
              dyT = _ptsY[0] - _ptsY[1];
            } else if (sj === K - 1) {
              dxT = _ptsX[K - 2] - _ptsX[K - 1];
              dyT = _ptsY[K - 2] - _ptsY[K - 1];
            } else {
              dxT = _ptsX[sj - 1] - _ptsX[sj + 1];
              dyT = _ptsY[sj - 1] - _ptsY[sj + 1];
            }
            var dLen = Math.hypot(dxT, dyT) || 1;
            var nx = (-dyT / dLen) * rj;
            var ny = (dxT / dLen) * rj;
            _leftX[sj] = _ptsX[sj] + nx;
            _leftY[sj] = _ptsY[sj] + ny;
            _rightX[sj] = _ptsX[sj] - nx;
            _rightY[sj] = _ptsY[sj] - ny;
          }
        }

        var tailTipX = _ptsX[K - 1];
        var tailTipY = _ptsY[K - 1];
        var headPtX = _ptsX[0];
        var headPtY = _ptsY[0];

        if (isMeteor) {
          // ── METEOR MODE: SOLAR PROMINENCE IONIZATION (Tier 3 Extra Big, Tier 2 Big, Tier 1 Medium) ──
          // A. Distal Atmospheric Smoke Plume (Tail Tip Dissipation)
          var smokeSprite = MeteorVFXEngine.getSmoke();
          if (smokeSprite && K >= 4) {
            var puffR = headR * (tier === 3 ? 1.55 : (tier === 2 ? 1.30 : 1.10));
            var smokeAlpha = renderAlpha * (tier === 3 ? 0.28 : (tier === 2 ? 0.20 : 0.14));
            targetCtx.save();
            targetCtx.globalAlpha = smokeAlpha;
            targetCtx.drawImage(smokeSprite, _ptsX[K - 1] - puffR, _ptsY[K - 1] - puffR, puffR * 2, puffR * 2);
            targetCtx.restore();
          }

          // B. Quantum Realm Silky-Smooth Aerodynamic Taper Envelope with Real Fire Combustion Gradient
          var meteorBodyGrad = targetCtx.createLinearGradient(tailTipX, tailTipY, headPtX, headPtY);
          meteorBodyGrad.addColorStop(0.0, "rgba(185, 28, 28, 0.0)");
          meteorBodyGrad.addColorStop(0.25, "rgba(220, 38, 38, " + (renderAlpha * 0.42).toFixed(2) + ")");
          meteorBodyGrad.addColorStop(0.55, "rgba(234, 88, 12, " + (renderAlpha * 0.78).toFixed(2) + ")");
          meteorBodyGrad.addColorStop(0.80, "rgba(251, 146, 60, " + (renderAlpha * 0.92).toFixed(2) + ")");
          meteorBodyGrad.addColorStop(0.94, "rgba(254, 240, 138, " + (renderAlpha * 0.96).toFixed(2) + ")");
          meteorBodyGrad.addColorStop(1.0, "rgba(255, 255, 255, " + (renderAlpha * 0.98).toFixed(2) + ")");
          targetCtx.fillStyle = meteorBodyGrad;

          targetCtx.beginPath();
          targetCtx.moveTo(_leftX[0], _leftY[0]);
          for (var sj = 0; sj < K - 1; sj++) {
            var mxL = (_leftX[sj] + _leftX[sj + 1]) * 0.5;
            var myL = (_leftY[sj] + _leftY[sj + 1]) * 0.5;
            targetCtx.quadraticCurveTo(_leftX[sj], _leftY[sj], mxL, myL);
          }
          targetCtx.lineTo(tailTipX, tailTipY);
          targetCtx.lineTo(_rightX[K - 1], _rightY[K - 1]);
          for (var sj = K - 1; sj > 0; sj--) {
            var mxR = (_rightX[sj] + _rightX[sj - 1]) * 0.5;
            var myR = (_rightY[sj] + _rightY[sj - 1]) * 0.5;
            targetCtx.quadraticCurveTo(_rightX[sj], _rightY[sj], mxR, myR);
          }
          targetCtx.lineTo(_rightX[0], _rightY[0]);
          targetCtx.closePath();
          targetCtx.fill();

          // C. Real Fire Inner Core Tongue (Continuous Curve, Tier 3 Dual Convective Flames)
          var flameEndIdx = Math.min(K - 1, Math.max(2, (K * (tier === 3 ? 0.75 : 0.65)) | 0));
          if (flameEndIdx >= 2) {
            var innerFlameGrad = targetCtx.createLinearGradient(_ptsX[flameEndIdx], _ptsY[flameEndIdx], headPtX, headPtY);
            innerFlameGrad.addColorStop(0.0, "rgba(234, 88, 12, 0.0)");
            innerFlameGrad.addColorStop(0.35, "rgba(249, 115, 22, " + (renderAlpha * 0.68).toFixed(2) + ")");
            innerFlameGrad.addColorStop(0.70, "rgba(254, 240, 138, " + (renderAlpha * 0.94).toFixed(2) + ")");
            innerFlameGrad.addColorStop(1.0, "rgba(255, 255, 255, " + (renderAlpha * 0.98).toFixed(2) + ")");

            targetCtx.strokeStyle = innerFlameGrad;
            targetCtx.lineWidth = Math.max(1.4, headR * (tier === 3 ? 0.62 : (tier === 2 ? 0.52 : 0.44)));
            targetCtx.lineCap = "round";
            targetCtx.lineJoin = "round";
            targetCtx.beginPath();
            targetCtx.moveTo(_ptsX[0], _ptsY[0]);
            for (var sj = 0; sj < flameEndIdx - 1; sj++) {
              var mxc = (_ptsX[sj] + _ptsX[sj + 1]) * 0.5;
              var myc = (_ptsY[sj] + _ptsY[sj + 1]) * 0.5;
              targetCtx.quadraticCurveTo(_ptsX[sj], _ptsY[sj], mxc, myc);
            }
            targetCtx.lineTo(_ptsX[flameEndIdx], _ptsY[flameEndIdx]);
            targetCtx.stroke();
          }

          // D. Volumetric Combustion Gas Billows along slipstream
          var flamePuffSprite = MeteorVFXEngine.getFlamePuff();
          if (flamePuffSprite && K >= 3) {
            var puffPosIdx = Math.min(K - 1, 1);
            var pfR = headR * (tier === 3 ? 1.35 : (tier === 2 ? 1.15 : 0.95));
            targetCtx.save();
            targetCtx.globalAlpha = renderAlpha * (tier === 3 ? 0.52 : (tier === 2 ? 0.40 : 0.28));
            targetCtx.drawImage(flamePuffSprite, _ptsX[puffPosIdx] - pfR, _ptsY[puffPosIdx] - pfR, pfR * 2, pfR * 2);
            targetCtx.restore();
          }

          // E. Incandescent Burning Ember Wake Sprites (8-Point Starlight Flares)
          var emberCanvas = MeteorVFXEngine.getEmber();
          if (emberCanvas) {
            var emIdx1 = Math.min(K - 1, 2);
            var emLat1 = Math.sin(now * 0.019 + (p.pulsePhase || 0) * 2.5) * (headR * 0.48);
            var emR = Math.max(2.4, headR * (tier === 3 ? 0.48 : (tier === 2 ? 0.40 : 0.34)));
            targetCtx.save();
            targetCtx.globalAlpha = renderAlpha * 0.94;
            targetCtx.drawImage(emberCanvas, _ptsX[emIdx1] + (-sinH) * emLat1 - emR * 0.5, _ptsY[emIdx1] + cosH * emLat1 - emR * 0.5, emR, emR);
            if (tier >= 2 && K >= 5) {
              var emIdx2 = Math.min(K - 1, 4);
              var emLat2 = Math.cos(now * 0.023 + (p.pulsePhase || 0) * 3.1) * (headR * 0.48);
              targetCtx.drawImage(emberCanvas, _ptsX[emIdx2] + (-sinH) * emLat2 - emR * 0.5, _ptsY[emIdx2] + cosH * emLat2 - emR * 0.5, emR, emR);
            }
            targetCtx.restore();
          }

        } else if (isHelix) {
          // ── QUANTUM HELIX: ICONIC, CRYSTAL-CLEAR, SILKY-SMOOTH DOUBLE-STRAND RIBBONS (120 FPS ZERO-LAG) ──
          var strandWidth = Math.max(1.8, headR * (tier === 3 ? 0.44 : (tier === 2 ? 0.36 : 0.28)));
          var rungStep = (tier === 1) ? 2 : 1;

          // 1. Crisp Batched DNA Base-Pair Cross Rungs (Single Batched Draw Call - Zero Gradient Overhead)
          targetCtx.strokeStyle = "rgba(224, 231, 255, " + (renderAlpha * (tier >= 2 ? 0.52 : 0.42)).toFixed(2) + ")";
          targetCtx.lineWidth = tier === 3 ? 1.25 : 1.0;
          targetCtx.beginPath();
          for (var rk = 1; rk < K - 1; rk += rungStep) {
            targetCtx.moveTo(_ribbon1X[rk], _ribbon1Y[rk]);
            targetCtx.lineTo(_ribbon2X[rk], _ribbon2Y[rk]);
          }
          targetCtx.stroke();

          // 2. Continuous Silky Strand A: Luminous Electric Cyan Ribbon (Seamless Quadratic Bezier)
          targetCtx.lineCap = "round";
          targetCtx.lineJoin = "round";
          targetCtx.strokeStyle = "rgba(34, 211, 238, " + (renderAlpha * 0.96).toFixed(2) + ")";
          targetCtx.lineWidth = strandWidth;
          targetCtx.beginPath();
          targetCtx.moveTo(_ribbon1X[0], _ribbon1Y[0]);
          for (var sj = 0; sj < K - 1; sj++) {
            var mx1 = (_ribbon1X[sj] + _ribbon1X[sj + 1]) * 0.5;
            var my1 = (_ribbon1Y[sj] + _ribbon1Y[sj + 1]) * 0.5;
            targetCtx.quadraticCurveTo(_ribbon1X[sj], _ribbon1Y[sj], mx1, my1);
          }
          targetCtx.lineTo(tailTipX, tailTipY);
          targetCtx.stroke();

          // 3. Continuous Silky Strand B: Luminous Royal Magenta Ribbon (Seamless Counter-Phase Bezier)
          targetCtx.strokeStyle = "rgba(217, 70, 239, " + (renderAlpha * 0.96).toFixed(2) + ")";
          targetCtx.lineWidth = strandWidth;
          targetCtx.beginPath();
          targetCtx.moveTo(_ribbon2X[0], _ribbon2Y[0]);
          for (var sj = 0; sj < K - 1; sj++) {
            var mx2 = (_ribbon2X[sj] + _ribbon2X[sj + 1]) * 0.5;
            var my2 = (_ribbon2Y[sj] + _ribbon2Y[sj + 1]) * 0.5;
            targetCtx.quadraticCurveTo(_ribbon2X[sj], _ribbon2Y[sj], mx2, my2);
          }
          targetCtx.lineTo(tailTipX, tailTipY);
          targetCtx.stroke();

          // 4. Sleek Central Harmonic Phase-Beam (Coherent Optical Conduit)
          if (K >= 3) {
            var hPulse = 0.65 + 0.35 * Math.abs(Math.sin(now * 0.016 + (p.pulsePhase || 0) * 3.2));
            var hBeamAlpha = renderAlpha * (tier === 3 ? 0.88 : (tier === 2 ? 0.72 : 0.55)) * hPulse;

            targetCtx.strokeStyle = "rgba(207, 250, 254, " + (hBeamAlpha * 0.70).toFixed(2) + ")";
            targetCtx.lineWidth = Math.max(1.0, headR * (tier === 3 ? 0.18 : 0.14));
            targetCtx.beginPath();
            targetCtx.moveTo(_ptsX[0], _ptsY[0]);
            for (var hj = 1; hj < K; hj++) {
              targetCtx.lineTo(_ptsX[hj], _ptsY[hj]);
            }
            targetCtx.stroke();

            // Pre-rendered Bi-Chromatic Bioluminescent Nucleotide Sparks (Tier 2 & 3 only)
            if (tier >= 2) {
              var hCyanSpark = MeteorVFXEngine.getHelixSpark(false);
              var hMagSpark = MeteorVFXEngine.getHelixSpark(true);
              if (hCyanSpark && hMagSpark) {
                var hsIdx1 = Math.min(K - 1, 2);
                var hsR = Math.max(2.8, headR * (tier === 3 ? 0.50 : 0.40));
                targetCtx.drawImage(hCyanSpark, _ribbon1X[hsIdx1] - hsR * 0.5, _ribbon1Y[hsIdx1] - hsR * 0.5, hsR, hsR);
                if (K >= 5) {
                  var hsIdx2 = Math.min(K - 1, 4);
                  targetCtx.drawImage(hMagSpark, _ribbon2X[hsIdx2] - hsR * 0.5, _ribbon2Y[hsIdx2] - hsR * 0.5, hsR, hsR);
                }
              }
            }
          }

        } else {
          // ── QUANTUM REALM: STREAMLINED WAVEPACKET & HIGH-VOLTAGE ELECTRIC ARCS ──
          var bodyGrad = targetCtx.createLinearGradient(tailTipX, tailTipY, headPtX, headPtY);
          bodyGrad.addColorStop(0.0, "hsla(" + fTailHue + ", " + p.sat + "%, " + fTailLit.toFixed(1) + "%, " + (renderAlpha * 0.10).toFixed(2) + ")");
          bodyGrad.addColorStop(0.48, "hsla(" + midHue + ", " + p.sat + "%, " + ((fTailLit + fHeadLit) * 0.5).toFixed(1) + "%, " + (renderAlpha * 0.60).toFixed(2) + ")");
          bodyGrad.addColorStop(1.0, "hsla(" + fHeadHue + ", 100%, " + fHeadLit.toFixed(1) + "%, " + (renderAlpha * 0.95).toFixed(2) + ")");
          targetCtx.fillStyle = bodyGrad;

          targetCtx.beginPath();
          targetCtx.moveTo(_leftX[0], _leftY[0]);
          for (var sj = 0; sj < K - 1; sj++) {
            var mxL = (_leftX[sj] + _leftX[sj + 1]) * 0.5;
            var myL = (_leftY[sj] + _leftY[sj + 1]) * 0.5;
            targetCtx.quadraticCurveTo(_leftX[sj], _leftY[sj], mxL, myL);
          }
          targetCtx.lineTo(tailTipX, tailTipY);
          targetCtx.lineTo(_rightX[K - 1], _rightY[K - 1]);
          for (var sj = K - 1; sj > 0; sj--) {
            var mxR = (_rightX[sj] + _rightX[sj - 1]) * 0.5;
            var myR = (_rightY[sj] + _rightY[sj - 1]) * 0.5;
            targetCtx.quadraticCurveTo(_rightX[sj], _rightY[sj], mxR, myR);
          }
          targetCtx.lineTo(_rightX[0], _rightY[0]);
          targetCtx.closePath();
          targetCtx.fill();

          // Crackling Electric Arcs Along Tail Spine (Tier 3 Multi-Branch, Tier 2 Single Fork, Tier 1 Continuous Arc)
          if (K >= 3) {
            var eTick = ((now * 0.036 + i * 0.41) | 0);
            var eSurge = 0.60 + 0.40 * Math.abs(Math.sin(now * 0.015 + (p.pulsePhase || 0) * 3.7));
            var eAlpha = renderAlpha * (tier === 3 ? 0.96 : (tier === 2 ? 0.88 : 0.72)) * eSurge;
            var eHue = Math.round(196 * 0.68 + fHeadHue * 0.32);
            var arcAmp = Math.max(2.0, headR * (tier === 3 ? 1.25 : (tier === 2 ? 1.00 : 0.75)));
            var forkPtX = _ptsX[1], forkPtY = _ptsY[1];
            var forkDirX = -sinH, forkDirY = cosH;

            // Pass 1: Ionized Plasma Glow Sheath
            targetCtx.lineCap = "round";
            targetCtx.lineJoin = "round";
            targetCtx.strokeStyle = "hsla(" + eHue + ", 100%, 68%, " + (eAlpha * 0.40).toFixed(2) + ")";
            targetCtx.lineWidth = Math.max(2.0, headR * (tier === 3 ? 0.58 : (tier === 2 ? 0.46 : 0.36)));
            targetCtx.beginPath();
            targetCtx.moveTo(_ptsX[0], _ptsY[0]);
            for (var ej = 1; ej < K; ej++) {
              var ax = _ptsX[ej];
              var ay = _ptsY[ej];
              if (ej < K - 1) {
                var edx = _ptsX[ej - 1] - _ptsX[ej + 1];
                var edy = _ptsY[ej - 1] - _ptsY[ej + 1];
                var edLen = Math.hypot(edx, edy) || 1;
                var enx = -edy / edLen;
                var eny = edx / edLen;
                var eEnv = Math.sin((ej * invKm1) * Math.PI);
                var jWave = Math.sin(eTick * 3.71 + ej * 4.93 + i * 2.17) * Math.cos(eTick * 1.43 + ej * 2.61);
                var eOff = jWave * arcAmp * eEnv;
                ax += enx * eOff;
                ay += eny * eOff;
                if (ej === 2) { forkPtX = ax; forkPtY = ay; forkDirX = enx; forkDirY = eny; }
              }
              targetCtx.lineTo(ax, ay);
            }
            targetCtx.stroke();

            // Pass 2: Razor-Crisp Incandescent Lightning Bolt Core
            targetCtx.strokeStyle = "rgba(232, 248, 255, " + (eAlpha * 0.95).toFixed(2) + ")";
            targetCtx.lineWidth = Math.max(0.9, headR * (tier === 3 ? 0.24 : 0.18));
            targetCtx.stroke();

            // Secondary Branched Lightning Bolt (Tier 3 & Tier 2)
            if (tier >= 2 || dopplerBoost > 0.18) {
              var branchSide = ((eTick + i) & 1) ? 1 : -1;
              var branchLen = headR * (tier === 3 ? 1.70 : 1.30);
              var bx1 = forkPtX + (forkDirX * branchSide - cosH * 0.65) * (branchLen * 0.55);
              var by1 = forkPtY + (forkDirY * branchSide - sinH * 0.65) * (branchLen * 0.55);
              var bx2 = bx1 + (forkDirX * branchSide * 0.7 - cosH * 0.85) * (branchLen * 0.55);
              var by2 = by1 + (forkDirY * branchSide * 0.7 - sinH * 0.85) * (branchLen * 0.55);
              targetCtx.beginPath();
              targetCtx.moveTo(forkPtX, forkPtY);
              targetCtx.lineTo(bx1, by1);
              targetCtx.lineTo(bx2, by2);
              targetCtx.strokeStyle = "hsla(" + eHue + ", 100%, 74%, " + (eAlpha * 0.38).toFixed(2) + ")";
              targetCtx.lineWidth = Math.max(1.3, headR * 0.34);
              targetCtx.stroke();
              targetCtx.strokeStyle = "rgba(240, 249, 255, " + (eAlpha * 0.88).toFixed(2) + ")";
              targetCtx.lineWidth = 0.85;
              targetCtx.stroke();
            }

            // Pre-rendered Electric Spark Sprites hugging the tail wake
            var eSparkCanvas = MeteorVFXEngine.getElectricSpark();
            if (eSparkCanvas) {
              var esIdx1 = Math.min(K - 1, 2);
              var esLat1 = Math.sin(now * 0.021 + (p.pulsePhase || 0) * 2.8) * (headR * 0.52);
              var esR = Math.max(2.6, headR * (tier === 3 ? 0.52 : (tier === 2 ? 0.42 : 0.35)));
              targetCtx.save();
              targetCtx.globalAlpha = renderAlpha * 0.94;
              targetCtx.drawImage(eSparkCanvas, _ptsX[esIdx1] + (-sinH) * esLat1 - esR * 0.5, _ptsY[esIdx1] + cosH * esLat1 - esR * 0.5, esR, esR);
              if (tier >= 2 && K >= 5) {
                var esIdx2 = Math.min(K - 1, 4);
                var esLat2 = Math.cos(now * 0.026 + (p.pulsePhase || 0) * 3.3) * (headR * 0.52);
                targetCtx.drawImage(eSparkCanvas, _ptsX[esIdx2] + (-sinH) * esLat2 - esR * 0.5, _ptsY[esIdx2] + cosH * esLat2 - esR * 0.5, esR, esR);
              }
              targetCtx.restore();
            }
          }
        }
      }

      // ── 3. Render Radiant Leading Quantum Head ──
      var px0 = _ptsX[0];
      var py0 = _ptsY[0];

      if (isMeteor) {
        // ── METEOR HEAD: 3D Asteroid Rock, Molten Magma Fissures & Fire Aura ──
        var rockR = headR * (tier === 3 ? 1.85 : (tier === 2 ? 1.50 : 1.25));
        var astIndex = Math.abs(((p.pulsePhase || 0) * 100) | 0) % 6;
        var astCanvas = MeteorVFXEngine.getAsteroid(astIndex);
        var plasmaCanvas = MeteorVFXEngine.getPlasma();
        var flamePuffCanvas = MeteorVFXEngine.getFlamePuff();

        // 1. Incandescent Molten Magma Corona / Plasma Aura
        if (plasmaCanvas) {
          targetCtx.save();
          targetCtx.globalAlpha = renderAlpha * (tier === 3 ? 0.85 : (tier === 2 ? 0.70 : 0.55));
          var coronaR = rockR * 1.60;
          targetCtx.drawImage(plasmaCanvas, px0 - coronaR, py0 - coronaR, coronaR * 2, coronaR * 2);
          targetCtx.restore();
        }

        // 2. Soft Volumetric Real Fire Combustion Glow
        if (flamePuffCanvas) {
          targetCtx.save();
          targetCtx.globalAlpha = renderAlpha * (tier === 3 ? 0.65 : (tier === 2 ? 0.50 : 0.38));
          var pfHeadR = rockR * 1.30;
          targetCtx.drawImage(flamePuffCanvas, px0 - pfHeadR, py0 - pfHeadR, pfHeadR * 2, pfHeadR * 2);
          targetCtx.restore();
        }

        // 3. 3D Procedural Basalt Asteroid Rock Sprite (Spherical Normal Shaded with Planck Fissures)
        if (astCanvas) {
          targetCtx.save();
          targetCtx.translate(px0, py0);
          targetCtx.rotate(p.heading);
          targetCtx.globalAlpha = renderAlpha;
          targetCtx.drawImage(astCanvas, -rockR, -rockR, rockR * 2, rockR * 2);
          targetCtx.restore();
        }

        // 4. Precessing Fiery Molten Ember Orbits
        if (renderAsBrightest) {
          var morphEaseM = p.isFront ? Math.max(0.35, gameGlowProgress) : gameGlowProgress;
          var orbBaseRM = rockR * (tier === 3 ? 2.10 : (tier === 2 ? 1.85 : 1.60)) * (0.8 + 0.2 * morphEaseM);
          var spinM = now * 0.0035 + p.pulsePhase;
          var mAlpha = renderAlpha * morphEaseM;

          targetCtx.beginPath();
          targetCtx.ellipse(px0, py0, orbBaseRM * 1.2, orbBaseRM * 0.7, p.heading + spinM, 0, Math.PI * 2);
          targetCtx.strokeStyle = "rgba(251, 146, 60, " + (mAlpha * 0.44).toFixed(2) + ")";
          targetCtx.lineWidth = tier === 3 ? 1.35 : 1.0;
          targetCtx.stroke();

          // Orbiting blazing ember spark
          var eAng = p.heading + spinM;
          var eNodeX = px0 + Math.cos(eAng) * (orbBaseRM * 1.2);
          var eNodeY = py0 + Math.sin(eAng) * (orbBaseRM * 0.7);
          targetCtx.beginPath();
          targetCtx.arc(eNodeX, eNodeY, tier === 3 ? 2.2 : 1.6, 0, Math.PI * 2);
          targetCtx.fillStyle = "rgba(255, 240, 138, " + (mAlpha * 0.98).toFixed(2) + ")";
          targetCtx.fill();

          // Target Synchronized Aura: Resonant molten plasma shock rings
          if (isTargetLocked) {
            var syncRatioM = (typeof contactDuration === "number") ? Math.min(1.0, contactDuration / 2.0) : 0.6;
            targetCtx.beginPath();
            targetCtx.arc(px0, py0, orbBaseRM * (1.3 + syncRatioM * 0.4), 0, Math.PI * 2);
            targetCtx.strokeStyle = "rgba(255, 140, 0, " + (syncRatioM * 0.85).toFixed(2) + ")";
            targetCtx.lineWidth = 1.6;
            targetCtx.stroke();
          }
        }

        // Fiery Incandescent Cinder Sparks into p.stardust (Matching Image 1 Ember Storm)
        var emberSpawnRate = tier === 3 ? 0.68 : (tier === 2 ? 0.48 : 0.32);
        var emberMaxStardust = tier === 3 ? 14 : (tier === 2 ? 10 : 6);
        if (Math.random() < emberSpawnRate) {
          if (!p.stardust) p.stardust = [];
          if (p.stardust.length < emberMaxStardust) {
            var emSpineIdx = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
            p.stardust.push({
              x: _ptsX[emSpineIdx] + (Math.random() - 0.5) * (headR * 1.6),
              y: _ptsY[emSpineIdx] + (Math.random() - 0.5) * (headR * 1.6),
              alpha: 0.98,
              r: 0.70 + Math.random() * (tier === 3 ? 1.50 : 1.15),
              hue: 22 + Math.random() * 26 // 22 (crimson orange) to 48 (golden amber)
            });
          }
        }

      } else {
        // ── CLASSIC QUANTUM REALM & QUANTUM HELIX HEAD RENDERING ──
        if (isHelix) {
          // ── ICONIC QUANTUM HELIX GLOWING HEAD (Recognizable, Clean, Glowing Cyan Droplet) ──
          targetCtx.beginPath();
          targetCtx.arc(px0, py0, headR * (tier >= 2 ? 1.35 : 1.25), 0, Math.PI * 2);
          targetCtx.fillStyle = "rgba(34, 211, 238, " + (renderAlpha * (tier === 3 ? 0.32 : 0.24)).toFixed(2) + ")";
          targetCtx.fill();

          targetCtx.beginPath();
          targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
          targetCtx.fillStyle = "hsla(188, 98%, 74%, " + renderAlpha.toFixed(2) + ")";
          targetCtx.fill();

          // Searing White-Hot Nucleus
          targetCtx.beginPath();
          targetCtx.arc(px0 + cosH * (headR * 0.22), py0 + sinH * (headR * 0.22), headR * 0.44, 0, Math.PI * 2);
          targetCtx.fillStyle = "rgba(255, 255, 255, " + (renderAlpha * 0.98).toFixed(2) + ")";
          targetCtx.fill();

        } else {
          targetCtx.beginPath();
          targetCtx.arc(px0, py0, headR, 0, Math.PI * 2);
          targetCtx.fillStyle = "hsla(" + fHeadHue + ", 98%, " + fHeadLit.toFixed(1) + "%, " + renderAlpha.toFixed(2) + ")";
          targetCtx.fill();

          // Pure white quantum singularity center
          targetCtx.beginPath();
          targetCtx.arc(px0 + cosH * (headR * 0.25), py0 + sinH * (headR * 0.25), headR * 0.45, 0, Math.PI * 2);
          targetCtx.fillStyle = "rgba(255, 255, 255, " + (renderAlpha * 0.96).toFixed(2) + ")";
          targetCtx.fill();
        }

        // Miniature Bohr probability orbital rings / 3D Toroidal Chromatin Loops
        if (renderAsBrightest) {
          var morphEase = p.isFront ? Math.max(0.35, gameGlowProgress) : gameGlowProgress;
          var orbBaseR = headR * (tier === 3 ? 2.85 : (tier === 2 ? 2.30 : 1.80)) * (0.75 + 0.25 * morphEase);
          var spinAngle = now * 0.0032 + p.pulsePhase;
          var ringAlpha = renderAlpha * morphEase;

          if (isHelix) {
            // Quantum Helix: Elegant Bi-Chromatic Cyan & Magenta Orbitals (Clean, Minimal, Tier 2 & 3 only)
            if (tier >= 2) {
              targetCtx.beginPath();
              targetCtx.arc(px0, py0, orbBaseR * 0.85, 0, Math.PI * 2);
              targetCtx.strokeStyle = "rgba(34, 211, 238, " + (ringAlpha * 0.40).toFixed(2) + ")";
              targetCtx.lineWidth = tier === 3 ? 1.25 : 0.95;
              targetCtx.stroke();

              var worldSpin2 = p.heading + spinAngle;
              targetCtx.beginPath();
              targetCtx.ellipse(px0, py0, orbBaseR * 1.35, orbBaseR * 0.75, worldSpin2, 0, Math.PI * 2);
              targetCtx.strokeStyle = "rgba(217, 70, 239, " + (ringAlpha * 0.38).toFixed(2) + ")";
              targetCtx.lineWidth = tier === 3 ? 1.15 : 0.90;
              targetCtx.stroke();

              // Single Glowing Nucleotide Node
              var qNodeX = px0 + Math.cos(worldSpin2) * (orbBaseR * 1.35);
              var qNodeY = py0 + Math.sin(worldSpin2) * (orbBaseR * 1.35);
              targetCtx.beginPath();
              targetCtx.arc(qNodeX, qNodeY, tier === 3 ? 1.8 : 1.3, 0, Math.PI * 2);
              targetCtx.fillStyle = "rgba(165, 243, 252, " + (ringAlpha * 0.96).toFixed(2) + ")";
              targetCtx.fill();
            }

            // Target Synchronized Resonance
            if (isTargetLocked) {
              var syncRatioH = (typeof contactDuration === "number") ? Math.min(1.0, contactDuration / 2.0) : 0.6;
              targetCtx.beginPath();
              targetCtx.arc(px0, py0, orbBaseR * (1.3 + syncRatioH * 0.4), 0, Math.PI * 2);
              targetCtx.strokeStyle = "rgba(255, 215, 0, " + (syncRatioH * 0.75).toFixed(2) + ")";
              targetCtx.lineWidth = 1.4;
              targetCtx.stroke();
            }

          } else {
            // Classic Quantum Realm: Concentric Quantum Orbitals with Counter-Rotating Phase Node
            targetCtx.beginPath();
            targetCtx.arc(px0, py0, orbBaseR * 0.85, 0, Math.PI * 2);
            targetCtx.strokeStyle = "hsla(" + fHeadHue + ", 92%, 72%, " + (ringAlpha * 0.38).toFixed(2) + ")";
            targetCtx.lineWidth = tier === 3 ? 1.35 : 1.0;
            targetCtx.stroke();

            var worldSpin2 = p.heading + spinAngle;
            targetCtx.beginPath();
            targetCtx.ellipse(px0, py0, orbBaseR * 1.35, orbBaseR * 0.75, worldSpin2, 0, Math.PI * 2);
            targetCtx.strokeStyle = "hsla(" + fHeadHue + ", 98%, 78%, " + (ringAlpha * 0.32).toFixed(2) + ")";
            targetCtx.lineWidth = tier === 3 ? 1.20 : 0.95;
            targetCtx.stroke();

            var qNodeX = px0 + Math.cos(worldSpin2) * orbBaseR * 1.35;
            var qNodeY = py0 + Math.sin(worldSpin2) * orbBaseR * 1.35;
            targetCtx.beginPath();
            targetCtx.arc(qNodeX, qNodeY, tier === 3 ? 2.0 : 1.4, 0, Math.PI * 2);
            targetCtx.fillStyle = "rgba(255, 255, 255, " + (ringAlpha * 0.96).toFixed(2) + ")";
            targetCtx.fill();
          }

          // Target Synchronized Aura: Extra resonant dual-harmonic orbital rings around locked particle
          if (isTargetLocked) {
            var syncRatio = (typeof contactDuration === "number") ? Math.min(1.0, contactDuration / 2.0) : 0.6;
            targetCtx.beginPath();
            targetCtx.arc(px0, py0, orbBaseR * (1.3 + syncRatio * 0.4), 0, Math.PI * 2);
            targetCtx.strokeStyle = "rgba(255, 215, 0, " + (syncRatio * 0.75).toFixed(2) + ")";
            targetCtx.lineWidth = 1.4;
            targetCtx.stroke();
          }
        }

        // Additive Electric Wake Sparks along Quantum Realm tail (parallel to Meteor Ember Storm)
        var realmSpawnRate = tier === 3 ? 0.68 : (tier === 2 ? 0.48 : 0.32);
        var realmMaxStardust = tier === 3 ? 14 : (tier === 2 ? 10 : 6);
        if (!isHelix && K >= 3 && Math.random() < realmSpawnRate) {
          if (!p.stardust) p.stardust = [];
          if (p.stardust.length < realmMaxStardust) {
            var eSpineIdx = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
            p.stardust.push({
              x: _ptsX[eSpineIdx] + (Math.random() - 0.5) * (headR * 1.95),
              y: _ptsY[eSpineIdx] + (Math.random() - 0.5) * (headR * 1.95),
              alpha: 0.98,
              r: 0.80 + Math.random() * (tier === 3 ? 1.50 : 1.15),
              hue: Math.random() < 0.76 ? (190 + Math.random() * 24) : (258 + Math.random() * 22),
              electric: true
            });
          }
        }

        // Additive Bi-Chromatic Nucleotide Spores along Quantum Helix DNA Strands (Cyan & Royal Magenta)
        var helixSpawnRate = tier === 3 ? 0.45 : (tier === 2 ? 0.30 : 0.18);
        var helixMaxStardust = tier === 3 ? 8 : (tier === 2 ? 5 : 3);
        if (isHelix && K >= 3 && Math.random() < helixSpawnRate) {
          if (!p.stardust) p.stardust = [];
          if (p.stardust.length < helixMaxStardust) {
            var hSpineIdx = Math.min(K - 1, 1 + ((Math.random() * (K - 1)) | 0));
            var useStrandB = Math.random() < 0.5;
            var baseX = useStrandB ? _ribbon2X[hSpineIdx] : _ribbon1X[hSpineIdx];
            var baseY = useStrandB ? _ribbon2Y[hSpineIdx] : _ribbon1Y[hSpineIdx];
            p.stardust.push({
              x: baseX + (Math.random() - 0.5) * (headR * 1.45),
              y: baseY + (Math.random() - 0.5) * (headR * 1.45),
              alpha: 0.98,
              r: 0.80 + Math.random() * (tier === 3 ? 1.50 : 1.15),
              hue: useStrandB ? (294 + Math.random() * 30) : (186 + Math.random() * 16),
              helix: true
            });
          }
        }
      }

      // Render Micro-Stardust Quantum Sparks, Electric Wake Lights & Helix Nucleotide Spores in World Coordinates
      if (p.stardust && p.stardust.length > 0) {
        for (var si = p.stardust.length - 1; si >= 0; si--) {
          var spk = p.stardust[si];
          var isWakeOrb = !!(spk.electric || spk.helix);
          spk.alpha *= isWakeOrb ? 0.90 : (isMeteor ? 0.88 : 0.80);
          if (spk.alpha > 0.05) {
            if ((spk.electric && !isMeteor && !isHelix) || (spk.helix && isHelix)) {
              targetCtx.beginPath();
              targetCtx.arc(spk.x, spk.y, spk.r * 2.30, 0, Math.PI * 2);
              targetCtx.fillStyle = "hsla(" + Math.round(spk.hue) + ", 100%, 66%, " + (spk.alpha * 0.28).toFixed(2) + ")";
              targetCtx.fill();
            }
            targetCtx.beginPath();
            targetCtx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
            targetCtx.fillStyle = isMeteor
              ? ("rgba(255, " + Math.round(135 + (spk.hue || 24) * 2.2) + ", 60, " + spk.alpha.toFixed(2) + ")")
              : (isWakeOrb
                ? ("hsla(" + Math.round(spk.hue) + ", 100%, 76%, " + spk.alpha.toFixed(2) + ")")
                : ("hsla(" + Math.round(spk.hue) + ", 100%, 82%, " + spk.alpha.toFixed(2) + ")"));
            targetCtx.fill();
            if ((isMeteor || isWakeOrb) && spk.alpha > 0.35 && spk.r > 0.80) {
              targetCtx.beginPath();
              targetCtx.arc(spk.x, spk.y, spk.r * 0.46, 0, Math.PI * 2);
              targetCtx.fillStyle = "rgba(255, 255, 255, " + spk.alpha.toFixed(2) + ")";
              targetCtx.fill();
            }
          } else {
            p.stardust.splice(si, 1);
          }
        }
      }
    }
    // ── 4. MICRO-CONSTELLATION FILAMENTS (On Background Canvas - Batched High Speed) ──
    if (radiantBackNodes.length > 1) {
      backCtx.beginPath();
      var filamentsDrawn = 0;
      var rLimit = Math.min(radiantBackNodes.length, isVictoryDancing ? 24 : 16);
      var maxFila = isVictoryDancing ? 36 : 20;
      var distThresh = isVictoryDancing ? 5625 : 3364; // Longer harmonic resonance filaments during victory dance (75px vs 58px)
      for (var r1 = 0; r1 < rLimit && filamentsDrawn < maxFila; r1++) {
        var pA = radiantBackNodes[r1];
        for (var r2 = r1 + 1; r2 < rLimit && filamentsDrawn < maxFila; r2++) {
          var pB = radiantBackNodes[r2];
          var fdx = pA.x - pB.x;
          var fdy = pA.y - pB.y;
          if (fdx * fdx + fdy * fdy < distThresh) {
            backCtx.moveTo(pA.x, pA.y);
            backCtx.lineTo(pB.x, pB.y);
            filamentsDrawn++;
          }
        }
      }
      if (filamentsDrawn > 0) {
        backCtx.strokeStyle = isVictoryDancing
          ? (isMeteor ? "rgba(249, 115, 22, 0.32)" : "rgba(255, 215, 0, 0.28)")
          : "rgba(56, 189, 248, 0.16)";
        backCtx.lineWidth = isVictoryDancing ? 1.0 : 0.75;
        backCtx.stroke();
      }
    }

    // Solution 2: Master Animation Frame Tick - executes game overlay on unified clock
    if (typeof afterRenderHook === "function") {
      try {
        afterRenderHook(now);
      } catch (errHook) {}
    }
  }

  if (enabled) {
    loop();
  }

  // Hook toggle button
  if (fxBtn) {
    fxBtn.onclick = function() {
      if (enabled) {
        window.antigravityFX.disable();
        if (typeof showToast === "function") showToast("Antigravity Particle FX Muted", "✦");
      } else {
        window.antigravityFX.enable();
        if (typeof showToast === "function") showToast("Antigravity Particle FX Active", "✦");
      }
    };
  }

  // Hook Hero Clock click for interactive tactile micro-shockwave
  var clockEl = document.getElementById("clock");
  if (clockEl) {
    clockEl.addEventListener("click", function(e) {
      triggerHyperspaceShockwave(e.clientX, e.clientY, 48);
    }, { passive: true });
  }

  // Global controller object
  window.antigravityFX = {
    enable: function() {
      enabled = true;
      backCanvas.style.display = "block";
      if (frontCanvas) frontCanvas.style.display = "block";
      updateBtnUI();
      try { localStorage.setItem("dra-antigravity-fx", "1"); } catch(e){}
      if (!animId) loop();
    },
    disable: function() {
      enabled = false;
      backCanvas.style.display = "none";
      if (frontCanvas) frontCanvas.style.display = "none";
      updateBtnUI();
      try { localStorage.setItem("dra-antigravity-fx", "0"); } catch(e){}
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    },
    toggle: function() {
      if (enabled) this.disable();
      else this.enable();
      return enabled;
    },
    triggerShockwave: function(x, y, hue) {
      triggerHyperspaceShockwave(x, y, hue);
    },
    isEnabled: function() {
      return enabled;
    },
    getParticles: function() {
      return particles;
    },
    getGameGlowProgress: function() {
      return gameGlowProgress;
    },
    setGameGlowProgress: function(v) {
      gameGlowProgress = Math.max(0, Math.min(1, v));
    },
    setGameMode: function(active, style) {
      isGameMode = !!active;
      if (style) {
        gameParticleStyle = (style === "helix") ? "helix" : ((style === "meteor") ? "meteor" : "classic");
      }
    },
    isGameMode: function() {
      return isGameMode;
    },
    setGameParticleStyle: function(style) {
      gameParticleStyle = (style === "helix") ? "helix" : ((style === "meteor") ? "meteor" : "classic");
    },
    getGameParticleStyle: function() {
      return gameParticleStyle;
    },
    startVictoryDance: function(targetParticle, hitX, hitY) {
      isVictoryDancing = true;
      victoryDanceStartTime = Date.now();
      var centerX = (typeof hitX === "number" && hitX > 0) ? hitX : (width * 0.5);
      var centerY = (typeof hitY === "number" && hitY > 0) ? hitY : (height * 0.5);
      if (mouse.x <= 0) {
        mouse.x = centerX;
        mouse.y = centerY;
        mouse.targetX = centerX;
        mouse.targetY = centerY;
        mouse.active = true;
      }
      for (var vi = 0; vi < particles.length; vi++) {
        var pt = particles[vi];
        pt.victoryAnchorX = pt.x;
        pt.victoryAnchorY = pt.y;
        if (pt === targetParticle) {
          pt.exploded = true;
        }
      }
    },
    stopVictoryDance: function() {
      isVictoryDancing = false;
      for (var vi = 0; vi < particles.length; vi++) {
        var pt = particles[vi];
        if (pt.exploded) {
          pt.exploded = false;
          pt.fadeMode = "emerging";
          pt.fadeProgress = 0.1;
          pt.emergeBloom = 1.0;
        }
      }
    },
    setAfterRenderHook: function(fn) {
      afterRenderHook = fn;
    }
  };
})();


(function() {
  function initQuantumUniverseGame() {
  var overlay = document.getElementById("quantumGameOverlay");
  var canvas = document.getElementById("quantumGameCanvas");
  var btnLaunch = document.getElementById("btnLaunchGame");
  var btnLaunchHelix = document.getElementById("btnLaunchHelixGame");
  var btnLaunchMeteor = document.getElementById("btnLaunchMeteorGame");
  var btnExit = document.getElementById("btnExitGame");
  var btnPlayAgain = document.getElementById("btnGamePlayAgain");
  var btnReturn = document.getElementById("btnGameReturn");
  var btnGamePlayMusic = document.getElementById("btnGamePlayMusic");
  var qGameMusicGlyph = document.getElementById("qGameMusicGlyph");
  var qGameMusicText = document.getElementById("qGameMusicText");
  var digitsEl = document.getElementById("qGameDigits");
  var fillEl = document.getElementById("qGameTimerFill");
  var missionText = document.getElementById("qGameMissionText");
  var victoryModal = document.getElementById("qGameVictoryModal");

  var currentGameVariant = "classic"; // "classic" | "helix" | "meteor"

  // Dynamic Result Elements (Shared Zero-Shift Card for Victory & Game Over)
  var resultCard = document.getElementById("qGameResultCard");
  var resultAurora = document.getElementById("qGameResultAurora");
  var resultIcon = document.getElementById("qGameResultIcon");
  var resultTitle = document.getElementById("qGameResultTitle");
  var resultSubtitle = document.getElementById("qGameResultSubtitle");
  var statLabel1 = document.getElementById("qGameStatLabel1");
  var preservedTimeEl = document.getElementById("qGamePreservedTime");
  var statLabel2 = document.getElementById("qGameStatLabel2");
  var statLock = document.getElementById("qGameLockDuration");
  var statLabel3 = document.getElementById("qGameStatLabel3");
  var statStatus = document.getElementById("qGameSystemStatus");
  var actionIcon = document.getElementById("qGameActionIcon");
  var actionLabel = document.getElementById("qGameActionLabel");

  if (!overlay || !canvas) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initQuantumUniverseGame);
    } else {
      setTimeout(initQuantumUniverseGame, 100);
    }
    return;
  }

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var isActive = false;
  var isWon = false;
  var isGameOver = false;
  var animId = null;
  var width = 0, height = 0, dpr = 1;

  var TOTAL_TIME = 60.0;
  var remainingTime = TOTAL_TIME;
  var preservedTimeStr = "60.00";
  var lastFrameTime = 0;
  var gameStartTime = 0;
  var lastDisplayedDigits = "";
  var lastFillTime = 0;
  var WARMUP_MS = 1400; // 1.4s smooth entrance grace period matching 1.35s fade: prevents false locks or instant wins on start
  var hasDeliberateMove = false;

  var deviceInputMode = "mouse"; // "mouse" | "touch"
  var isTouchDown = false;

  var cursor = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    vx: 0,
    vy: 0,
    speed: 0,
    heading: -Math.PI * 0.25 // Default celestial atmospheric entry angle
  };
  var cursorTrail = [];
  var lastPointerTime = 0;
  var lockedParticle = null;
  var contactDuration = 0.0;
  var lastTouchContactTime = 0;
  var REQUIRED_CONTACT = 2.0; // 2 seconds continuous
  var STRICT_HIT_RADIUS = 13.0; // Base cursor central nucleus radius (desktop: 13.0px, tablet: 14.5px, mobile: 16.5px)

  // Device Capability Detection using matchMedia & pointer capabilities
  function detectDeviceCapabilities() {
    var isFineHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    var isCoarseOrNoHover = window.matchMedia("(pointer: coarse), (hover: none)").matches;
    var touchPoints = (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || ('ontouchstart' in window);

    if (!isFineHover && (touchPoints || isCoarseOrNoHover)) {
      setDeviceMode("touch");
    } else {
      setDeviceMode("mouse");
    }
  }

  function setDeviceMode(mode) {
    if (deviceInputMode === mode) return;
    deviceInputMode = mode;
    updateInputModeUI();
  }

  function updateInputModeUI() {
    if (deviceInputMode === "mouse") {
      document.body.classList.add("mode-mouse");
      document.body.classList.remove("mode-touch");
    } else {
      document.body.classList.add("mode-touch");
      document.body.classList.remove("mode-mouse");
    }
    updateTargetText();
  }

  function getTargetInstructionText() {
    if (deviceInputMode === "touch") {
      if (currentGameVariant === "helix") {
        return "TOUCH ANY HELIX PARTICLE · HOLD 2.0s";
      } else if (currentGameVariant === "meteor") {
        return "TOUCH ANY METEOR · HOLD 2.0s";
      } else {
        return "TOUCH ANY PARTICLE · HOLD 2.0s";
      }
    } else {
      if (currentGameVariant === "helix") {
        return "TARGET: TOUCH ANY HELIX PARTICLE · MAINTAIN CONTACT FOR 2.0s";
      } else if (currentGameVariant === "meteor") {
        return "TARGET: TOUCH ANY METEOR · MAINTAIN CONTACT FOR 2.0s";
      } else {
        return "TARGET: TOUCH ANY PARTICLE · MAINTAIN CONTACT FOR 2.0s";
      }
    }
  }

  function updateTargetText() {
    if (missionText && !lockedParticle && missionText.textContent.indexOf("INITIALIZING") === -1 && !isWon && !isGameOver) {
      missionText.textContent = getTargetInstructionText();
    }
  }

  // Solution 1: Head-Core-Only Hit Detection (measures strictly to the particle's glowing head nucleus, never the tail!)
  function getParticleTouchDistance(cx, cy, p) {
    if (!p) return 999999;
    return Math.hypot(cx - p.x, cy - p.y);
  }

  // Solution 2: True Visual Circle-to-Circle Overlap (1.5x larger on touch devices for comfortable mobile play)
  function getParticleExactTouchRadius(p) {
    var particleHeadR = ((p && p.curSize) ? p.curSize : 3.0) * 0.54;
    var hitR = (deviceInputMode === "touch") ? (STRICT_HIT_RADIUS * 1.5) : STRICT_HIT_RADIUS;
    return hitR + particleHeadR;
  }

  var audioCtx = null;
  var lockOsc = null;
  var lockGain = null;
  var activeExplosion = null;
  var lastLockAudioFreq = 0;

  function syncGameMusicBtn() {
    if (!btnGamePlayMusic) return;
    var isPlaying = (typeof window.getIsMusicPlaying === "function") ? window.getIsMusicPlaying() : (typeof current !== "undefined" && current !== null);
    btnGamePlayMusic.classList.toggle("is-playing", isPlaying);
    if (qGameMusicGlyph) qGameMusicGlyph.textContent = isPlaying ? "❚❚" : "▶";
    if (qGameMusicText) qGameMusicText.textContent = isPlaying ? "Pause Music" : "Play Music";
    btnGamePlayMusic.title = isPlaying ? "Music Playing · Click to Pause" : "Play Curated Alarm Music & Antigravity Beats";
  }
  window.syncGameMusicBtn = syncGameMusicBtn;

  function initAudioCtx() {
    if (typeof ac !== "undefined" && ac && ac.state !== "closed") {
      audioCtx = ac;
    } else if (!audioCtx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC({ latencyHint: "interactive" });
      } catch(e){}
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(function(){});
    }
  }

  function startLockAudio() {
    initAudioCtx();
    if (!audioCtx || lockOsc) return;
    try {
      lockOsc = audioCtx.createOscillator();
      lockGain = audioCtx.createGain();
      lockOsc.type = "sine";
      lastLockAudioFreq = 290;
      lockOsc.frequency.setValueAtTime(290, audioCtx.currentTime);
      lockGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      lockGain.gain.linearRampToValueAtTime(0.09, audioCtx.currentTime + 0.06);
      lockOsc.connect(lockGain);
      lockGain.connect(audioCtx.destination);
      lockOsc.start();
    } catch(e){
      lockOsc = null;
      lockGain = null;
    }
  }

  function updateLockAudio(progress) {
    if (!lockOsc || !audioCtx) return;
    try {
      var freq = 290 + Math.pow(Math.max(0, Math.min(1, progress)), 1.35) * 440;
      if (Math.abs(freq - lastLockAudioFreq) >= 2.0) {
        lastLockAudioFreq = freq;
        lockOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      }
    } catch(e){}
  }

  function stopLockAudio() {
    lastLockAudioFreq = 0;
    if (!lockGain || !audioCtx) {
      if (lockOsc) { try { lockOsc.stop(); lockOsc.disconnect(); } catch(e){} lockOsc = null; }
      return;
    }
    try {
      lockGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      var oldOsc = lockOsc;
      var oldGain = lockGain;
      lockOsc = null;
      lockGain = null;
      setTimeout(function() {
        try { oldOsc.stop(); oldOsc.disconnect(); oldGain.disconnect(); } catch(e){}
      }, 50);
    } catch(e){
      lockOsc = null;
      lockGain = null;
    }
  }

  function playDefeatSoundtrack() {
    initAudioCtx();
    if (!audioCtx) return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var filter = audioCtx.createBiquadFilter();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(175, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.70);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.70);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.78);
    } catch(e){}
  }

  function playVictorySoundtrack() {
    initAudioCtx();
    if (audioCtx) {
      // 1. Deep Sub-bass Shockwave Impact Boom
      try {
        var boom = audioCtx.createOscillator();
        var boomG = audioCtx.createGain();
        boom.type = "sine";
        boom.frequency.setValueAtTime(150, audioCtx.currentTime);
        boom.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.65);
        boomG.gain.setValueAtTime(0.35, audioCtx.currentTime);
        boomG.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.75);
        boom.connect(boomG);
        boomG.connect(audioCtx.destination);
        boom.start(audioCtx.currentTime);
        boom.stop(audioCtx.currentTime + 0.80);
      } catch(e){}

      // 2. High-Tech Shimmer Fanfare Chord (C Major 9th Celestial Triumph)
      var notes = [
        { f: 523.25, t: 0.00, d: 0.70 },
        { f: 659.25, t: 0.08, d: 0.75 },
        { f: 783.99, t: 0.16, d: 0.80 },
        { f: 987.77, t: 0.24, d: 0.90 },
        { f: 1174.66, t: 0.32, d: 1.05 },
        { f: 1567.98, t: 0.40, d: 1.50 }
      ];
      notes.forEach(function(n) {
        try {
          var osc = audioCtx.createOscillator();
          var g = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(n.f, audioCtx.currentTime + n.t);
          g.gain.setValueAtTime(0.001, audioCtx.currentTime + n.t);
          g.gain.linearRampToValueAtTime(0.20, audioCtx.currentTime + n.t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + n.t + n.d);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + n.t);
          osc.stop(audioCtx.currentTime + n.t + n.d + 0.05);
        } catch(e){}
      });
    }

    // 3. Play Synchronized Celebratory Song
    try {
      if (typeof playSong === "function" && typeof SONGS !== "undefined" && SONGS.length > 3) {
        playSong(SONGS[3]); // "OKAY!" by Forrest Frank
      }
    } catch(e){}
    syncGameMusicBtn();
  }

  function showResultScreen(mode) {
    if (!resultCard) return;
    if (mode === "defeat") {
      resultCard.classList.add("is-defeat");
      if (resultTitle) resultTitle.textContent = "GAME OVER";
      if (resultSubtitle) resultSubtitle.textContent = "TEMPORAL MATRIX DEPLETED · RESONANCE FAILED";
      if (resultIcon) {
        resultIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="qgame-victory-svg"><path d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z" stroke="#ef4444" stroke-width="1.6" fill="rgba(239, 68, 68, 0.15)" stroke-linejoin="round"/><circle cx="12" cy="12" r="4.2" stroke="#f87171" stroke-width="1.4" fill="rgba(220, 38, 38, 0.35)"/><path d="M12 8.5V12.5M12 15.5V16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>';
      }
      if (statLabel1) statLabel1.textContent = "FINAL TIME";
      if (preservedTimeEl) {
        preservedTimeEl.textContent = "00.00s";
        preservedTimeEl.className = "qgame-stat-val highlight";
      }
      if (statLabel2) statLabel2.textContent = "LOCK DURATION";
      if (statLock) statLock.textContent = (contactDuration > 0 ? (contactDuration.toFixed(1) + "s / 2.0s") : "UNRESOLVED");
      if (statLabel3) statLabel3.textContent = "SYSTEM STATUS";
      if (statStatus) {
        statStatus.textContent = "QUANTUM COLLAPSE";
        statStatus.className = "qgame-stat-val danger";
      }
      if (actionIcon) actionIcon.textContent = "↻";
      if (actionLabel) actionLabel.textContent = "Try Again";
    } else {
      resultCard.classList.remove("is-defeat");
      if (currentGameVariant === "helix") {
        if (resultTitle) resultTitle.textContent = "QUANTUM HELIX COMPLETE";
        if (resultSubtitle) resultSubtitle.textContent = "HELIX SYNCHRONIZED · HARMONIC DANCE ACTIVE";
        if (resultIcon) {
          resultIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="qgame-victory-svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#vicHelixGrad)" stroke="#ffffff" stroke-width="1.2"/><defs><linearGradient id="vicHelixGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#c084fc"/><stop offset="50%" stop-color="#ffd700"/><stop offset="100%" stop-color="#f43f5e"/></linearGradient></defs></svg>';
        }
      } else if (currentGameVariant === "meteor") {
        if (resultTitle) resultTitle.textContent = "QUANTUM METEOR COMPLETE";
        if (resultSubtitle) resultSubtitle.textContent = "METEOR SYNCHRONIZED · HARMONIC DANCE ACTIVE";
        if (resultIcon) {
          resultIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="qgame-victory-svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#vicMeteorGrad)" stroke="#ffffff" stroke-width="1.2"/><defs><linearGradient id="vicMeteorGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fef08a"/><stop offset="45%" stop-color="#f97316"/><stop offset="100%" stop-color="#b91c1c"/></linearGradient></defs></svg>';
        }
      } else {
        if (resultTitle) resultTitle.textContent = "QUANTUM RESONANCE COMPLETE";
        if (resultSubtitle) resultSubtitle.textContent = "TARGET SYNCHRONIZED · HARMONIC DANCE ACTIVE";
        if (resultIcon) {
          resultIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="qgame-victory-svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#vicGoldGrad)" stroke="#ffffff" stroke-width="1.2"/><defs><linearGradient id="vicGoldGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffd700"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs></svg>';
        }
      }
      if (statLabel1) statLabel1.textContent = "FINAL TIME PRESERVED";
      if (preservedTimeEl) {
        preservedTimeEl.textContent = preservedTimeStr + "s";
        preservedTimeEl.className = "qgame-stat-val highlight";
      }
      if (statLabel2) statLabel2.textContent = "LOCK DURATION";
      if (statLock) statLock.textContent = "2.00s CONTINUOUS";
      if (statLabel3) statLabel3.textContent = "SYSTEM STATUS";
      if (statStatus) {
        statStatus.textContent = "CELEBRATION DANCE";
        statStatus.className = "qgame-stat-val success";
      }
      if (actionIcon) actionIcon.textContent = "⚡";
      if (actionLabel) actionLabel.textContent = "Play Again";
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    STRICT_HIT_RADIUS = (width < 600) ? 16.5 : ((width < 1024) ? 14.5 : 13.0);
  }

  // Cross-device capability check (e.g. iOS Safari does not support DOM Fullscreen API)
  try {
    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
      document.documentElement.classList.add("no-fullscreen-support");
    }
  } catch(e) {}

  resize();
  window.addEventListener("resize", function() {
    resize();
  });

  var lastCursorMoveTime = 0;
  var lastSampleCursorX = -9999;
  var lastSampleCursorY = -9999;

  // Unified Pointer Events: 100% True-Value, Direct Alignment (Touch point IS the atom itself)
  function handlePointerDown(e) {
    if (!isActive) return;
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      setDeviceMode("touch");
    } else if (e.pointerType === "mouse") {
      setDeviceMode("mouse");
    }

    isTouchDown = (deviceInputMode === "touch");
    cursor.active = true;
    hasDeliberateMove = true;
    lastCursorMoveTime = performance.now();

    // Exact location, true value: where the user touches IS where the atom is!
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.targetX = e.clientX;
    cursor.targetY = e.clientY;
    lastSampleCursorX = e.clientX;
    lastSampleCursorY = e.clientY;

    if (e.cancelable && deviceInputMode === "touch") e.preventDefault();
  }

  function handlePointerMove(e) {
    if (!isActive) return;
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      setDeviceMode("touch");
    } else if (e.pointerType === "mouse") {
      setDeviceMode("mouse");
    }

    if (deviceInputMode === "touch" && !isTouchDown) return;

    var nowMs = performance.now();
    var dtPointer = (lastPointerTime > 0) ? Math.max(0.008, (nowMs - lastPointerTime) * 0.001) : 0.016;
    lastPointerTime = nowMs;

    var events = (typeof e.getCoalescedEvents === "function") ? e.getCoalescedEvents() : [e];
    var lastEv = events[events.length - 1] || e;

    // Exact 1:1 tracking for both mouse & touch: 0ms latency, responds immediately at full hardware speed
    cursor.x = lastEv.clientX;
    cursor.y = lastEv.clientY;
    cursor.targetX = lastEv.clientX;
    cursor.targetY = lastEv.clientY;

    cursor.active = true;
    hasDeliberateMove = true;
    lastCursorMoveTime = nowMs;

    var dx = cursor.targetX - lastSampleCursorX;
    var dy = cursor.targetY - lastSampleCursorY;
    lastSampleCursorX = cursor.targetX;
    lastSampleCursorY = cursor.targetY;

    var instVx = dx / dtPointer;
    var instVy = dy / dtPointer;
    cursor.vx = cursor.vx * 0.55 + instVx * 0.45;
    cursor.vy = cursor.vy * 0.55 + instVy * 0.45;
    cursor.speed = Math.hypot(cursor.vx, cursor.vy);
    if (cursor.speed > 25) {
      cursor.heading = Math.atan2(cursor.vy, cursor.vx);
    }

    if (e.cancelable && deviceInputMode === "touch") e.preventDefault();
  }

  function handlePointerUp(e) {
    if (!isActive) return;
    if (e.pointerType === "touch" || e.pointerType === "pen" || deviceInputMode === "touch") {
      isTouchDown = false;
      if (lockedParticle) {
        lockedParticle.isLocked = false;
        lockedParticle = null;
      }
      contactDuration = 0.0;
      stopLockAudio();
      updateTargetText();
    }
  }

  function handlePointerLeave(e) {
    if (deviceInputMode === "touch") {
      handlePointerUp(e);
    }
  }

  window.addEventListener("pointerdown", handlePointerDown, { passive: false });
  window.addEventListener("pointermove", handlePointerMove, { passive: false });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
  window.addEventListener("pointercancel", handlePointerUp, { passive: true });
  window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  // Capability watchers: adapt live when device mode or orientation changes
  window.addEventListener("resize", detectDeviceCapabilities);
  try {
    window.matchMedia("(pointer: fine) and (hover: hover)").addEventListener("change", detectDeviceCapabilities);
    window.matchMedia("(pointer: coarse), (hover: none)").addEventListener("change", detectDeviceCapabilities);
  } catch(e){}
  detectDeviceCapabilities();

  function restartGame() {
    if (typeof stopSong === "function") stopSong();
    stopLockAudio();
    isWon = false;
    isGameOver = false;
    remainingTime = TOTAL_TIME;
    preservedTimeStr = TOTAL_TIME.toFixed(2);
    gameStartTime = performance.now();
    lastFrameTime = performance.now();
    contactDuration = 0.0;
    if (lockedParticle) lockedParticle.isLocked = false;
    lockedParticle = null;
    activeExplosion = null;
    lastDisplayedDigits = "";
    lastFillTime = 0;
    cursor.x = -9999;
    cursor.y = -9999;
    cursor.targetX = -9999;
    cursor.targetY = -9999;
    cursor.active = false;
    isTouchDown = false;
    hasDeliberateMove = false;
    lastCursorMoveTime = 0;
    lastSampleCursorX = -9999;
    lastSampleCursorY = -9999;

    victoryModal.style.display = "none";
    if (resultCard) resultCard.classList.remove("is-defeat");
    digitsEl.textContent = TOTAL_TIME.toFixed(2);
    digitsEl.classList.remove("victory-frozen", "defeat-frozen");
    fillEl.style.width = "100%";
    missionText.textContent = (currentGameVariant === "helix")
      ? "INITIALIZING QUANTUM HELIX · PREPARE RETICLE"
      : ((currentGameVariant === "meteor")
        ? "INITIALIZING QUANTUM METEOR · PREPARE RETICLE"
        : "INITIALIZING QUANTUM REALM · PREPARE RETICLE");
    syncGameMusicBtn();

    if (window.antigravityFX) {
      if (typeof window.antigravityFX.setGameMode === "function") {
        window.antigravityFX.setGameMode(true, currentGameVariant);
      }
      if (typeof window.antigravityFX.stopVictoryDance === "function") {
        window.antigravityFX.stopVictoryDance();
      }
    }
  }

  function launchGame(variant) {
    if (isActive) {
      if (variant && variant !== currentGameVariant) {
        exitGame();
      } else {
        return;
      }
    }
    if (variant) {
      currentGameVariant = (variant === "helix") ? "helix" : ((variant === "meteor") ? "meteor" : "classic");
    }
    isActive = true;
    isWon = false;
    isGameOver = false;
    remainingTime = TOTAL_TIME;
    preservedTimeStr = TOTAL_TIME.toFixed(2);
    gameStartTime = performance.now();
    lastFrameTime = performance.now();
    contactDuration = 0.0;
    if (lockedParticle) lockedParticle.isLocked = false;
    lockedParticle = null;
    activeExplosion = null;
    lastDisplayedDigits = "";
    lastFillTime = 0;

    // Reset cursor state: prevent inheriting launch button location
    cursor.x = -9999;
    cursor.y = -9999;
    cursor.targetX = -9999;
    cursor.targetY = -9999;
    cursor.active = false;
    isTouchDown = false;
    hasDeliberateMove = false;
    lastCursorMoveTime = 0;
    lastSampleCursorX = -9999;
    lastSampleCursorY = -9999;

    resize();
    initAudioCtx();

    // 1. Instant Universe Transition (1.35s cinematic ease-in-out S-curve fade of surroundings)
    var onb = document.getElementById("onboardingModal");
    if (onb) {
      onb.classList.remove("open");
      onb.style.display = "none";
    }
    document.body.classList.add("universe-game-active");
    detectDeviceCapabilities();
    updateInputModeUI();
    overlay.setAttribute("aria-hidden", "false");
    victoryModal.style.display = "none";
    if (resultCard) resultCard.classList.remove("is-defeat");
    missionText.textContent = (currentGameVariant === "helix")
      ? "INITIALIZING QUANTUM HELIX · PREPARE RETICLE"
      : ((currentGameVariant === "meteor")
        ? "INITIALIZING QUANTUM METEOR · PREPARE RETICLE"
        : "INITIALIZING QUANTUM REALM · PREPARE RETICLE");
    digitsEl.textContent = TOTAL_TIME.toFixed(2);
    digitsEl.classList.remove("victory-frozen", "defeat-frozen");
    fillEl.style.width = "100%";
    syncGameMusicBtn();

    // 2. Prepare Game Mode (particles retain their full avoidance behavior!)
    if (window.antigravityFX && typeof window.antigravityFX.setGameMode === "function") {
      window.antigravityFX.setGameMode(true, currentGameVariant);
      window.antigravityFX.stopVictoryDance();
    }

    if (!animId) {
      animId = requestAnimationFrame(gameLoop);
    }
  }

  function exitGame() {
    if (!isActive) return;
    isActive = false;
    isWon = false;
    isGameOver = false;
    stopLockAudio();

    // Automatically stop celebratory or game music when exiting to horizon
    if (typeof stopSong === "function") stopSong();
    syncGameMusicBtn();

    cursor.x = -9999;
    cursor.y = -9999;
    cursor.targetX = -9999;
    cursor.targetY = -9999;
    cursor.active = false;
    isTouchDown = false;
    hasDeliberateMove = false;
    if (lockedParticle) lockedParticle.isLocked = false;
    lockedParticle = null;
    contactDuration = 0.0;

    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    // 8. Seamless Return Experience (1.35s cinematic ease-in-out S-curve emergence)
    var onb = document.getElementById("onboardingModal");
    if (onb) onb.style.display = "";
    document.body.classList.remove("universe-game-active", "mode-mouse", "mode-touch");
    overlay.setAttribute("aria-hidden", "true");
    victoryModal.style.display = "none";
    if (resultCard) resultCard.classList.remove("is-defeat");
    digitsEl.classList.remove("victory-frozen", "defeat-frozen");

    // Restore particle physics to normal cruise
    if (window.antigravityFX) {
      if (typeof window.antigravityFX.setGameMode === "function") {
        window.antigravityFX.setGameMode(false);
      }
      if (typeof window.antigravityFX.stopVictoryDance === "function") {
        window.antigravityFX.stopVictoryDance();
      }
    }
  }

  function triggerGameOver() {
    if (isGameOver || isWon) return;
    isGameOver = true;
    stopLockAudio();

    digitsEl.textContent = "00.00";
    digitsEl.classList.remove("victory-frozen");
    digitsEl.classList.add("defeat-frozen");
    fillEl.style.width = "0%";
    missionText.textContent = "QUANTUM TIME EXPIRED · MATRIX DESTABILIZED";

    // Play subtle high-tech defeat sound
    playDefeatSoundtrack();

    // Show result screen in defeat mode
    showResultScreen("defeat");

    setTimeout(function() {
      if (isActive && isGameOver) {
        victoryModal.style.display = "flex";
      }
    }, 450);
  }

  function triggerVictory(targetParticle) {
    if (isWon || isGameOver) return;
    isWon = true;
    stopLockAudio();

    // 1. Freeze timer immediately and preserve final time!
    preservedTimeStr = Math.max(0, remainingTime).toFixed(2);
    digitsEl.textContent = preservedTimeStr;
    digitsEl.classList.remove("defeat-frozen");
    digitsEl.classList.add("victory-frozen");
    if (preservedTimeEl) preservedTimeEl.textContent = preservedTimeStr + "s";

    var expX = targetParticle ? targetParticle.x : (width * 0.5);
    var expY = targetParticle ? targetParticle.y : (height * 0.5);
    var isMeteorMode = (currentGameVariant === "meteor");
    var expHue = isMeteorMode ? (28 + Math.random() * 20) : ((targetParticle && targetParticle.hue !== undefined) ? targetParticle.hue : 45);

    // 2. Make touched particle explode
    activeExplosion = {
      x: expX,
      y: expY,
      hue: expHue,
      startTime: performance.now(),
      duration: 2200,
      shockwaves: isMeteorMode ? [
        { r: 0, maxR: Math.max(width, height) * 0.45, speed: 18, alpha: 1.0, color: "#ffffff", lw: 3.5 },
        { r: 0, maxR: Math.max(width, height) * 0.55, speed: 13, alpha: 0.9, color: "#f97316", lw: 2.5 },
        { r: 0, maxR: Math.max(width, height) * 0.65, speed: 9,  alpha: 0.8, color: "#fef08a", lw: 2.0 }
      ] : [
        { r: 0, maxR: Math.max(width, height) * 0.45, speed: 18, alpha: 1.0, color: "#ffffff", lw: 3.5 },
        { r: 0, maxR: Math.max(width, height) * 0.55, speed: 13, alpha: 0.9, color: "#38bdf8", lw: 2.5 },
        { r: 0, maxR: Math.max(width, height) * 0.65, speed: 9,  alpha: 0.8, color: "#ffd700", lw: 2.0 }
      ],
      sparks: []
    };

    for (var s = 0; s < 76; s++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = 3.5 + Math.random() * 11.0;
      activeExplosion.sparks.push({
        x: expX,
        y: expY,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 2.0 + Math.random() * 3.2,
        alpha: 1.0,
        hue: isMeteorMode ? (22 + Math.random() * 24) : ((Math.random() < 0.5 ? 45 : 195) + (Math.random() * 30 - 15)),
        decay: 0.012 + Math.random() * 0.016,
        tail: []
      });
    }

    // 3. Make all remaining particles dance (faster energetic swirl around cursor, harmonic constellation filaments!)
    if (window.antigravityFX && typeof window.antigravityFX.startVictoryDance === "function") {
      window.antigravityFX.startVictoryDance(targetParticle, expX, expY);
    }

    // 4. Play celebratory music and fanfare immediately
    playVictorySoundtrack();

    // 5. Setup Victory Hologram Readouts
    showResultScreen("victory");
    missionText.textContent = (currentGameVariant === "helix")
      ? "☍ QUANTUM HELIX ACHIEVED · CELEBRATION DANCE ACTIVE ☍"
      : ((currentGameVariant === "meteor")
        ? "☄ METEOR RESONANCE ACHIEVED · CELEBRATION DANCE ACTIVE ☄"
        : "◈ QUANTUM RESONANCE ACHIEVED · CELEBRATION DANCE ACTIVE ◈");

    // 6. Reveal Victory Hologram Card
    setTimeout(function() {
      if (isActive && isWon) {
        victoryModal.style.display = "flex";
      }
    }, 650);
  }

  function gameLoop(now) {
    if (!isActive) return;
    animId = requestAnimationFrame(gameLoop);

    var dt = (now - lastFrameTime) * 0.001;
    lastFrameTime = now;
    if (dt > 0.1) dt = 0.1;

    ctx.clearRect(0, 0, width, height);

    // Direct 1:1 true value for both mouse and touch (zero lag, matches fast hardware DPI)
    if (cursor.active && hasDeliberateMove && typeof cursor.targetX === "number" && cursor.targetX > -1000) {
      cursor.x = cursor.targetX;
      cursor.y = cursor.targetY;
    }

    // Damp cursor velocity when idle
    cursor.vx *= 0.92;
    cursor.vy *= 0.92;
    cursor.speed = Math.hypot(cursor.vx, cursor.vy);

    // Update cursor trail history (for cursor meteor flame and smoke rendering)
    if (cursor.active && hasDeliberateMove) {
      cursorTrail.unshift({ x: cursor.x, y: cursor.y, time: now });
      if (cursorTrail.length > 14) cursorTrail.pop();
    } else {
      if (cursorTrail.length > 0) cursorTrail.pop();
    }

    var isWarmingUp = (now - gameStartTime < WARMUP_MS);

    // ── Update Countdown Timer & Mission Telemetry ──
    if (!isWon && !isGameOver) {
      if (isWarmingUp) {
        lastFrameTime = now;
        if (lastDisplayedDigits !== "60.00") {
          digitsEl.textContent = TOTAL_TIME.toFixed(2);
          lastDisplayedDigits = "60.00";
        }
        fillEl.style.width = "100%";
      } else {
        if (missionText.textContent.indexOf("INITIALIZING") !== -1) {
          missionText.textContent = getTargetInstructionText();
        }
        remainingTime -= dt;
        if (remainingTime <= 0) {
          remainingTime = 0;
          if (lastDisplayedDigits !== "00.00") {
            digitsEl.textContent = "00.00";
            lastDisplayedDigits = "00.00";
          }
          fillEl.style.width = "0%";
          triggerGameOver();
        } else {
          var curDigits = remainingTime.toFixed(2);
          if (curDigits !== lastDisplayedDigits) {
            digitsEl.textContent = curDigits;
            lastDisplayedDigits = curDigits;
          }
          if (now - lastFillTime > 32) {
            var pct = (remainingTime / TOTAL_TIME) * 100;
            fillEl.style.width = pct.toFixed(1) + "%";
            lastFillTime = now;
          }
        }
      }
    }

    // ── Particle Interaction & 2-Second Active Contact Detection ──
    var particles = (window.antigravityFX && typeof window.antigravityFX.getParticles === "function") ? window.antigravityFX.getParticles() : [];

    // Active pursuit for lock ACQUISITION: requires recent cursor movement (respecting 78px top HUD safe-zone margin)
    var cursorNearCorner = (cursor.x < 68 || cursor.x > width - 68) && (cursor.y < 112 || cursor.y > height - 68);
    var canAcquireNewLock = hasDeliberateMove && ((now - lastCursorMoveTime < 240) || (cursorNearCorner && (now - lastCursorMoveTime < 360)));
    var isPhysicallyTouching = false;

    if (!isWon && !isGameOver && !isWarmingUp && remainingTime > 0 && cursor.active && hasDeliberateMove) {
      if (lockedParticle) {
        if (lockedParticle.exploded || lockedParticle.fadeProgress < 0.2) {
          lockedParticle.isLocked = false;
          lockedParticle = null;
          contactDuration = 0;
          stopLockAudio();
        } else {
          var dist = getParticleTouchDistance(cursor.x, cursor.y, lockedParticle);
          var exactTouchR = getParticleExactTouchRadius(lockedParticle);

          // Solutions 1, 2, 3 & 5: Timer and lock ring ONLY activate when particle head physically touches cursor core!
          if (dist <= exactTouchR) {
            isPhysicallyTouching = true;
            lastTouchContactTime = now;
            contactDuration += dt;
            var progress = Math.min(1.0, contactDuration / REQUIRED_CONTACT);
            startLockAudio();
            updateLockAudio(progress);

            if (currentGameVariant === "meteor") {
              drawMeteorLockReticle(lockedParticle.x, lockedParticle.y, progress);
            } else {
              drawLockReticle(lockedParticle.x, lockedParticle.y, progress);
            }

            var glyph = (currentGameVariant === "helix") ? "☍" : ((currentGameVariant === "meteor") ? "☄" : "◈");
            var lockLabel = (currentGameVariant === "meteor") ? "METEOR" : "QUANTUM";
            var contactActionText = (deviceInputMode === "touch") ? "HOLD CONTACT" : "MAINTAIN CONTACT";
            missionText.textContent = glyph + " " + lockLabel + " LOCK ACTIVE: " + (progress * 100).toFixed(0) + "% · " + contactActionText + " " + glyph;

            if (contactDuration >= REQUIRED_CONTACT) {
              lockedParticle.isLocked = false;
              triggerVictory(lockedParticle);
            }
          } else {
            // Solution 3 & 5: Separated from physical touch -> immediately stop counting & hide remote lock ring!
            if (now - lastTouchContactTime > 95) {
              lockedParticle.isLocked = false;
              contactDuration = 0.0;
              lockedParticle = null;
              stopLockAudio();
              missionText.textContent = getTargetInstructionText();
            } else {
              contactDuration = Math.max(0, contactDuration - dt * 0.85);
            }
          }
        }
      }

      // To initiate a lock onto a new candidate particle, the cursor core must physically touch the particle's head!
      if (!lockedParticle && canAcquireNewLock) {
        var closestDist = 999999;
        var candidate = null;
        for (var pi = 0; pi < particles.length; pi++) {
          var p = particles[pi];
          if (p.exploded || p.fadeProgress < 0.3) continue;
          var pDist = getParticleTouchDistance(cursor.x, cursor.y, p);
          var pTouchR = getParticleExactTouchRadius(p);
          if (pDist <= pTouchR && pDist < closestDist) {
            closestDist = pDist;
            candidate = p;
          }
        }
        if (candidate) {
          lockedParticle = candidate;
          lockedParticle.isLocked = true;
          isPhysicallyTouching = true;
          lastTouchContactTime = now;
          contactDuration = 0.0;
          startLockAudio();
        }
      }
    } else {
      if (isWarmingUp || !hasDeliberateMove || isGameOver) {
        if (lockedParticle) lockedParticle.isLocked = false;
        lockedParticle = null;
        contactDuration = 0.0;
        stopLockAudio();
      }
    }

    // ── Render Alive Cursor (Atomic for Realm, Double-Helix for Helix, Fiery Meteor for Meteor Mode) ──
    if (!isWon && !isGameOver && cursor.active && hasDeliberateMove) {
      var lockProgress = (lockedParticle && isPhysicallyTouching && contactDuration > 0) ? (contactDuration / REQUIRED_CONTACT) : 0;
      if (currentGameVariant === "meteor") {
        drawMeteorCursor(cursor.x, cursor.y, now, lockProgress);
      } else if (currentGameVariant === "helix") {
        drawHelixCursor(cursor.x, cursor.y, now, lockProgress);
      } else {
        drawQuantumAtomicCursor(cursor.x, cursor.y, now, lockProgress);
      }
    }

    // ── Render Active Explosion & Spark Fragments ──
    if (activeExplosion) {
      renderExplosion(now);
    }
  }

  function drawQuantumAtomicCursor(cx, cy, now, progress) {
    ctx.save();
    ctx.translate(cx, cy);

    var t = now * 0.0016;
    var rotBase = now * 0.0004;
    var colorShift = (now * 0.04) % 360;

    // Contact resonance: when locking onto a particle, cursor pulses with excitation
    var exc = (progress > 0) ? (progress * 0.35) : 0;
    var spinMult = 1.0 + exc * 2.5;

    // ── 1. Diffracted Horizontal & Diagonal Photonic Lens Flares ──
    var flareLen = 44 + exc * 12;
    var flareW = 2.8 + exc * 1.0;

    // Horizontal primary flare beam (cyan to purple to violet)
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

    // Diagonal flares (golden amber along 60 deg and 120 deg axes)
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

    // ── 2. Central Quantum Nucleus (Sphere with deep iridescent shading) ──
    var rCore = 14.5 + exc * 2.0;

    // Outer ambient core halo (controlled, crisp, not too much glow!)
    var haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.7, 0, 0, rCore * 1.55);
    haloGrad.addColorStop(0.0, "rgba(168, 85, 247, 0.40)");
    haloGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.20)");
    haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
    ctx.fill();

    // 3D Spherical plasma body
    var sphereGrad = ctx.createRadialGradient(-2, -3, 1, 0, 0, rCore);
    sphereGrad.addColorStop(0.0, "rgba(233, 213, 255, 0.98)");
    sphereGrad.addColorStop(0.25, "rgba(168, 85, 247, 0.95)");
    sphereGrad.addColorStop(0.55, "rgba(67, 20, 103, 0.95)");
    var hueRim1 = (colorShift + 30) % 360;
    var hueRim2 = (colorShift + 180) % 360;
    sphereGrad.addColorStop(0.80, "hsla(" + hueRim1 + ", 90%, 55%, 0.85)");
    sphereGrad.addColorStop(0.95, "hsla(" + hueRim2 + ", 95%, 65%, 0.92)");
    sphereGrad.addColorStop(1.0, progress > 0.8 ? "rgba(255, 215, 0, 0.98)" : "rgba(254, 240, 138, 0.95)");

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rCore, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // ── 3. Three 3D Precessing Orbital Rings with Radiant Shifting Colors ──
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
      var curAngle = ring.baseAngle + wobble + rotBase * spinMult;
      ctx.rotate(curAngle);

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

      // Circulating electron quantum wavepacket spark (fast dual-circle glow without GPU shadowBlur stalls)
      var eSpeed = 0.0032 * spinMult;
      var u = (now * eSpeed + ring.phaseOffset) % (Math.PI * 2);
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

      // Apex flares at ring tips
      ctx.beginPath();
      ctx.arc(majorA, 0, 1.4, 0, Math.PI * 2);
      ctx.arc(-majorA, 0, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
      ctx.fill();

      ctx.restore();
    }

    // ── 4. Precision Micro-Singularity Center Reticle ──
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // ── 5. Target Synchronization Radiance: Harmonic Resonance Wavefront ──
    if (progress > 0) {
      var syncPulse = Math.sin(now * 0.012) * 0.5 + 0.5;
      var syncR = rCore * (1.1 + progress * 0.55 + syncPulse * 0.15);
      ctx.beginPath();
      ctx.arc(0, 0, syncR, 0, Math.PI * 2);
      ctx.strokeStyle = progress > 0.85 ? "rgba(255, 215, 0, 0.65)" : "rgba(56, 189, 248, 0.55)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  // ── Render Dedicated Quantum Helix Flagship Cursor: Luminous Quantum Sphere with Inscribed DNA Helix & 3D Orbital Resonance ──
  function drawHelixCursor(cx, cy, now, progress) {
    ctx.save();
    ctx.translate(cx, cy);

    var exc = (progress > 0) ? (progress * 0.35) : 0;
    var t = now * 0.0016;
    var rotBase = now * 0.0006;
    var spinMult = 1.0 + exc * 2.5;

    // ── 1. Compact Specular Bi-Chromatic Lens Flare Glint (Preserves Sphere Dominance) ──
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

    // ── 2. Prominent 3D Quantum Helix Sphere (Rich Volumetric Specular Body) ──
    var rCore = 16.0 + exc * 2.5;

    // Ambient Luminous Halo
    var haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.65, 0, 0, rCore * 1.55);
    haloGrad.addColorStop(0.0, "rgba(34, 211, 238, 0.38)");
    haloGrad.addColorStop(0.5, "rgba(217, 70, 239, 0.22)");
    haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
    ctx.fill();

    // Solid 3D Spherical Core Shading
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

    // ── 3. DNA Double-Helix Emblem Inscribed Analytically Inside the Sphere (Zero ctx.clip() GPU Stall & Batched Single-Stroke Rungs) ──
    ctx.save();
    var dnaAngle = -0.45 + Math.sin(t * 0.7) * 0.08;
    ctx.rotate(dnaAngle);

    var dnaLen = (rCore - 1.8) * 1.92;
    var dnaAmp = rCore * 0.36;
    var dnaSteps = 12;
    var dnaPhase = t * spinMult * 2.2;

    // Batched single-stroke base-pair connecting rungs across the DNA helix (1 stroke instead of 9)
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

    // Strand 1: Electric Cyan DNA Helix Strand
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (var i = 0; i <= dnaSteps; i++) {
      var sNorm = -1 + (2 * i) / dnaSteps;
      var ix = sNorm * (dnaLen * 0.48);
      var sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
      var iPhase = dnaPhase + sNorm * Math.PI * 1.75;
      var iy1 = Math.sin(iPhase) * dnaAmp * sEnv;
      if (i === 0) ctx.moveTo(ix, iy1);
      else ctx.lineTo(ix, iy1);
    }
    ctx.stroke();

    // Strand 2: Royal Magenta DNA Helix Strand
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (var i = 0; i <= dnaSteps; i++) {
      var sNorm = -1 + (2 * i) / dnaSteps;
      var ix = sNorm * (dnaLen * 0.48);
      var sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
      var iPhase = dnaPhase + sNorm * Math.PI * 1.75;
      var iy2 = -Math.sin(iPhase) * dnaAmp * sEnv;
      if (i === 0) ctx.moveTo(ix, iy2);
      else ctx.lineTo(ix, iy2);
    }
    ctx.stroke();
    ctx.restore();

    // ── 4. Three 3D Precessing Orbital Resonance Rings (Spherical Gyroscope Symmetry) ──
    var majorA = 27 + exc * 4;
    var minorB = 10.2 + exc * 1.5;

    // Ring 1: Electric Cyan (+45 deg)
    ctx.save();
    var curAngle1 = (Math.PI / 4) + rotBase * spinMult;
    ctx.rotate(curAngle1);
    ctx.beginPath();
    ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(34, 211, 238, 0.75)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    var nodeAngle1 = t * 2.0 * spinMult;
    var nodeX1 = Math.cos(nodeAngle1) * majorA;
    var nodeY1 = Math.sin(nodeAngle1) * minorB;
    ctx.beginPath();
    ctx.arc(nodeX1, nodeY1, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#67e8f9";
    ctx.fill();
    ctx.restore();

    // Ring 2: Royal Magenta (-45 deg)
    ctx.save();
    var curAngle2 = (-Math.PI / 4) - rotBase * spinMult;
    ctx.rotate(curAngle2);
    ctx.beginPath();
    ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(217, 70, 239, 0.75)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    var nodeAngle2 = -t * 2.0 * spinMult;
    var nodeX2 = Math.cos(nodeAngle2) * majorA;
    var nodeY2 = Math.sin(nodeAngle2) * minorB;
    ctx.beginPath();
    ctx.arc(nodeX2, nodeY2, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#f472b6";
    ctx.fill();
    ctx.restore();

    // Ring 3: Equatorial Iridescent Violet (0 deg)
    ctx.save();
    var curAngle3 = rotBase * spinMult * 0.5;
    ctx.rotate(curAngle3);
    ctx.beginPath();
    ctx.ellipse(0, 0, majorA * 1.08, minorB * 0.85, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(192, 132, 252, 0.55)";
    ctx.lineWidth = 0.95;
    ctx.stroke();
    ctx.restore();

    // ── 5. Precision Singularity Center Reticle ──
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // ── 6. Target Synchronization Radiance: Bi-Chromatic Resonance Wavefront ──
    if (progress > 0) {
      var syncPulse = Math.sin(now * 0.012) * 0.5 + 0.5;
      var syncR = rCore * (1.15 + progress * 0.55 + syncPulse * 0.15);
      ctx.beginPath();
      ctx.arc(0, 0, syncR, 0, Math.PI * 2);
      ctx.strokeStyle = progress > 0.85 ? "rgba(255, 215, 0, 0.75)" : "rgba(34, 211, 238, 0.65)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, syncR * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.55)";
      ctx.lineWidth = 1.0;
      ctx.setLineDash([2, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  // ── Render Spectacular Quantum Meteor Flagship Cursor: All-Burning Solar Prominence Meteor (Ultra-Smooth & Compact) ──
  function drawMeteorCursor(cx, cy, now, progress) {
    ctx.save();

    var exc = (progress > 0) ? (progress * 0.35) : 0;
    var t = now * 0.0018;
    var rotBase = now * 0.0006;
    var spinMult = 1.0 + exc * 2.5;

    // Continuous majestic 3D tumbling rotation & pitch precession (ALWAYS alive, even when idle!)
    var tumble = now * 0.0012 + (cursor.speed > 5 ? cursor.speed * 0.0025 : 0);
    var pitch = Math.sin(now * 0.0015) * 0.25;

    // Smooth heading damping for directional travel
    if (cursor.speed > 10) {
      var targetAngle = Math.atan2(cursor.vy, cursor.vx);
      if (typeof cursor.smoothAngle !== "number") cursor.smoothAngle = targetAngle;
      var diff = targetAngle - cursor.smoothAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      cursor.smoothAngle += diff * 0.25;
    }
    var renderHeading = (typeof cursor.smoothAngle === "number") ? cursor.smoothAngle : cursor.heading;

    var trailAngle = renderHeading + Math.PI;
    var cosT = Math.cos(trailAngle);
    var sinT = Math.sin(trailAngle);
    var perpX = -sinT;
    var perpY = cosT;

    var coreR = 15.0 + exc * 3.0;

    // ── 1. SOLAR CORONA & VOLUMETRIC ATMOSPHERIC PLASMA HALO ──
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

    // ── 2. ANAMORPHIC SOLAR PROMINENCE FLARE BEAMS ──
    var flareLen = coreR * 2.6 + exc * 12;
    var flareW = coreR * 0.18 + exc * 1.2;
    ctx.save();
    ctx.translate(cx, cy);
    var hFlare = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
    hFlare.addColorStop(0.0, "rgba(220, 38, 38, 0)");
    hFlare.addColorStop(0.25, "rgba(249, 115, 22, 0.45)");
    hFlare.addColorStop(0.45, "rgba(254, 240, 138, 0.85)");
    hFlare.addColorStop(0.50, "rgba(255, 255, 255, 1.0)");
    hFlare.addColorStop(0.55, "rgba(254, 240, 138, 0.85)");
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

    // ── 3. LIVING FLAME WISPS & CONVECTION VORTICES (Continuous Dancing Fire) ──
    var flameBaseLen = coreR * 1.45 + (cursor.speed > 20 ? Math.min(6.0, cursor.speed * 0.012) : 0);
    for (var f = 0; f < 4; f++) {
      var fAng = trailAngle + (f - 1.5) * 0.38 + Math.sin(t * 6.0 + f * 1.8) * 0.14;
      var fLen = flameBaseLen * (0.85 + 0.30 * Math.sin(t * 7.5 + f * 2.2));
      var fEndX = cx + Math.cos(fAng) * fLen;
      var fEndY = cy + Math.sin(fAng) * fLen;
      var fMidX = (cx + fEndX) * 0.5 + Math.sin(t * 8.0 + f) * (coreR * 0.22);
      var fMidY = (cy + fEndY) * 0.5 + Math.cos(t * 8.0 + f) * (coreR * 0.22);

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(fAng + 0.25) * (coreR * 0.55), cy + Math.sin(fAng + 0.25) * (coreR * 0.55));
      ctx.quadraticCurveTo(fMidX, fMidY, fEndX, fEndY);
      ctx.quadraticCurveTo(fMidX - Math.sin(fAng) * 4, fMidY + Math.cos(fAng) * 4, cx + Math.cos(fAng - 0.25) * (coreR * 0.55), cy + Math.sin(fAng - 0.25) * (coreR * 0.55));
      ctx.closePath();
      var flGrad = ctx.createLinearGradient(cx, cy, fEndX, fEndY);
      flGrad.addColorStop(0.0, "rgba(254, 240, 138, 0.88)");
      flGrad.addColorStop(0.40, "rgba(249, 115, 22, 0.68)");
      flGrad.addColorStop(0.80, "rgba(220, 38, 38, 0.35)");
      flGrad.addColorStop(1.0, "rgba(185, 28, 28, 0.0)");
      ctx.fillStyle = flGrad;
      ctx.fill();
    }

    // Floating Convection Cinder Sparks around the asteroid core
    for (var sp = 0; sp < 6; sp++) {
      var sAng = t * 3.2 + sp * 1.05;
      var sDist = coreR * (1.15 + 0.35 * Math.sin(t * 4.0 + sp * 2.1));
      var sx = cx + Math.cos(sAng) * sDist;
      var sy = cy + Math.sin(sAng) * sDist;
      var sAlpha = 0.40 + 0.50 * Math.sin(t * 6.0 + sp * 1.7);
      ctx.beginPath();
      ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(254, 240, 138, " + sAlpha.toFixed(2) + ")";
      ctx.fill();
    }

    // ── 4. THREE 3D PRECESSED BLAZING SOLAR MAGNETIC DYNAMO RINGS ──
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
      var curAngle = ring.baseAngle + wobble + rotBase * spinMult;
      ctx.rotate(curAngle);

      var curB = minorB * (1.0 + 0.12 * Math.cos(t * 1.6 * spinMult + ring.phaseOffset));

      // Fiery Braided Magnetic Flux Arc
      var rGrad = ctx.createLinearGradient(-majorA, 0, majorA, 0);
      rGrad.addColorStop(0.0, "rgba(220, 38, 38, 0.3)");
      rGrad.addColorStop(0.25, ring.color);
      rGrad.addColorStop(0.50, "rgba(255, 255, 255, 0.98)");
      rGrad.addColorStop(0.75, ring.color);
      rGrad.addColorStop(1.0, "rgba(220, 38, 38, 0.3)");

      ctx.strokeStyle = rGrad;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA, curB, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Miniature Solar Plasmoid Node (Blazing Miniature Sun with Halo & Core)
      var eSpeed = 0.0035 * spinMult;
      var u = (now * eSpeed + ring.phaseOffset) % (Math.PI * 2);
      var ex = majorA * Math.cos(u);
      var ey = curB * Math.sin(u);

      // Outer Solar Flare Halo
      ctx.beginPath();
      ctx.arc(ex, ey, 4.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249, 115, 22, 0.38)";
      ctx.fill();

      // Middle Incandescent Gold
      ctx.beginPath();
      ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(254, 240, 138, 0.92)";
      ctx.fill();

      // Inner White Specular Nucleus
      ctx.beginPath();
      ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Apex flares at major axis tips
      ctx.beginPath();
      ctx.arc(majorA, 0, 1.5, 0, Math.PI * 2);
      ctx.arc(-majorA, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 245, 0.95)";
      ctx.fill();

      ctx.restore();
    }

    // ── 5. HYPER-REALISTIC PROCEDURAL 3D MOLTEN ASTEROID ROCK CORE (TUMBLING IN 3D) ──
    var rockR = coreR * 1.05;

    // Multi-harmonic organic rocky contour (craggy, non-convex, chiseled asteroid silhouette)
    var SAMPLES = 32;
    var dTheta = (Math.PI * 2) / SAMPLES;
    var contourPts = [];
    for (var s = 0; s < SAMPLES; s++) {
      var th = s * dTheta;
      var rVar = 1.0;
      rVar += Math.sin(th * 2 + tumble * 0.7) * 0.14;
      rVar += Math.cos(th * 3 - pitch * 1.5) * 0.09;
      rVar += Math.sin(th * 5 + tumble * 1.2) * 0.06;
      rVar += Math.cos(th * 7) * 0.04;
      var rad = rockR * Math.max(0.70, rVar);
      contourPts.push({ x: cx + Math.cos(th) * rad, y: cy + Math.sin(th) * rad });
    }

    // Draw Asteroid Body (Clipped to organic rocky contour)
    ctx.save();
    ctx.beginPath();
    for (var s = 0; s < SAMPLES; s++) {
      if (s === 0) ctx.moveTo(contourPts[s].x, contourPts[s].y);
      else ctx.lineTo(contourPts[s].x, contourPts[s].y);
    }
    ctx.closePath();
    ctx.clip();

    // 3D Directional Lighting (Sunlit Crest to Deep Space Shadow)
    var sunX = cx - rockR * 0.45;
    var sunY = cy - rockR * 0.55;
    var bodyGrad = ctx.createRadialGradient(sunX, sunY, rockR * 0.12, cx, cy, rockR * 1.30);
    bodyGrad.addColorStop(0.0, "#5c4537"); // Sunlit basalt crest
    bodyGrad.addColorStop(0.30, "#3d2b20"); // Iron-rich silicate mantle
    bodyGrad.addColorStop(0.62, "#21140e"); // Deep basalt regolith
    bodyGrad.addColorStop(0.88, "#110906"); // Shadowed regolith
    bodyGrad.addColorStop(1.0, "#050302"); // Limb occlusion
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
        var px = cx + fct[p][0] * rockR;
        var py = cy + fct[p][1] * rockR;
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

    // 3D Impact Craters with Sunlit Rims and Molten Magma Wells
    var craterDefs = [
      { x: -0.32, y: -0.38, r: 0.22, heatPhase: 0 },
      { x: 0.38, y: -0.25, r: 0.26, heatPhase: 1.8 },
      { x: -0.25, y: 0.35, r: 0.28, heatPhase: 3.5 },
      { x: 0.32, y: 0.38, r: 0.20, heatPhase: 5.1 }
    ];
    for (var c = 0; c < craterDefs.length; c++) {
      var cr = craterDefs[c];
      var crAng = Math.atan2(cr.y, cr.x) + tumble * 0.4;
      var crDist = Math.hypot(cr.x, cr.y) * rockR;
      var crX = cx + Math.cos(crAng) * crDist;
      var crY = cy + Math.sin(crAng) * crDist;
      var crRad = rockR * cr.r;

      ctx.beginPath();
      ctx.arc(crX, crY, crRad, 0, Math.PI * 2);
      ctx.fillStyle = "#070302";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(crX - 0.7, crY - 0.9, crRad, Math.PI * 0.7, Math.PI * 1.9);
      ctx.strokeStyle = "rgba(160, 130, 110, 0.65)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(crX + 0.7, crY + 0.9, crRad, Math.PI * 1.9, Math.PI * 0.7);
      ctx.strokeStyle = "rgba(8, 4, 2, 0.85)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      var crHeat = 0.5 + 0.5 * Math.sin(t * 4.2 + cr.heatPhase);
      ctx.beginPath();
      ctx.arc(crX, crY, crRad * 0.58, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 88, 12, " + (0.60 + crHeat * 0.35).toFixed(2) + ")";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(crX, crY, crRad * 0.26, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(254, 240, 138, " + (0.75 + crHeat * 0.25).toFixed(2) + ")";
      ctx.fill();
    }

    // LIVING BRANCHING MAGMA FISSURE NETWORK (Animated Flow & Planck Radiation)
    var magmaPulse = 0.5 + 0.5 * Math.sin(t * 3.6);
    var fissureChains = [
      [[-0.60, -0.35], [-0.38, -0.28], [-0.18, -0.10], [0.05, 0.04], [0.28, 0.12], [0.48, 0.28], [0.68, 0.38]],
      [[0.32, -0.52], [0.22, -0.28], [0.05, 0.04], [-0.12, 0.25], [-0.28, 0.45], [-0.48, 0.60]],
      [[-0.18, -0.10], [-0.32, 0.05], [-0.55, 0.08]],
      [[0.28, 0.12], [0.45, -0.05], [0.62, -0.18]]
    ];

    for (var fc = 0; fc < fissureChains.length; fc++) {
      var chain = fissureChains[fc];
      var pts = [];
      for (var j = 0; j < chain.length; j++) {
        var wobbleX = Math.sin(t * 4.5 + fc * 2.3 + j * 1.2) * 1.1;
        var wobbleY = Math.cos(t * 4.0 + fc * 1.7 + j * 1.4) * 1.1;
        pts.push({ x: cx + chain[j][0] * rockR + wobbleX, y: cy + chain[j][1] * rockR + wobbleY });
      }

      // Layer 1: Wide crimson thermal heat soak
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length; j++) {
        var midX = (pts[j - 1].x + pts[j].x) * 0.5;
        var midY = (pts[j - 1].y + pts[j].y) * 0.5;
        ctx.quadraticCurveTo(pts[j - 1].x, pts[j - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = "rgba(220, 38, 38, " + (0.52 + magmaPulse * 0.35).toFixed(2) + ")";
      ctx.lineWidth = Math.max(2.4, rockR * 0.26);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Layer 2: Radiant molten solar orange-gold lava stream
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length; j++) {
        var midX = (pts[j - 1].x + pts[j].x) * 0.5;
        var midY = (pts[j - 1].y + pts[j].y) * 0.5;
        ctx.quadraticCurveTo(pts[j - 1].x, pts[j - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = "rgba(249, 115, 22, " + (0.85 + magmaPulse * 0.15).toFixed(2) + ")";
      ctx.lineWidth = Math.max(1.4, rockR * 0.14);
      ctx.stroke();

      // Layer 3: Blinding 5000K incandescent white-gold core vein
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length; j++) {
        var midX = (pts[j - 1].x + pts[j].x) * 0.5;
        var midY = (pts[j - 1].y + pts[j].y) * 0.5;
        ctx.quadraticCurveTo(pts[j - 1].x, pts[j - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = "rgba(255, 255, 245, " + (0.92 + magmaPulse * 0.08).toFixed(2) + ")";
      ctx.lineWidth = Math.max(0.8, rockR * 0.06);
      ctx.stroke();
    }

    // Molten Caldera Hotspots at fissure intersections
    var calderas = [{ x: 0.05, y: 0.04 }, { x: 0.28, y: 0.12 }, { x: -0.18, y: -0.10 }];
    for (var k = 0; k < calderas.length; k++) {
      var cX = cx + calderas[k].x * rockR;
      var cY = cy + calderas[k].y * rockR;
      var cPulse = 0.5 + 0.5 * Math.sin(t * 6.0 + k * 2.3);

      ctx.beginPath();
      ctx.arc(cX, cY, 3.2 + cPulse * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249, 115, 22, 0.70)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cX, cY, 1.8 + cPulse * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(254, 240, 138, 0.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cX, cY, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // Mineral micro-facets & regolith crystalline flecks
    for (var fl = 0; fl < 14; fl++) {
      var fAng = fl * 2.39 + tumble * 0.3;
      var fDist = rockR * (0.18 + (fl * 0.14) % 0.65);
      var fx = cx + Math.cos(fAng) * fDist;
      var fy = cy + Math.sin(fAng) * fDist;
      ctx.beginPath();
      ctx.arc(fx, fy, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = fl % 2 === 0 ? "rgba(180, 145, 120, 0.40)" : "rgba(15, 8, 5, 0.55)";
      ctx.fill();
    }

    ctx.restore(); // end clip

    // ── 6. INCANDESCENT ABLATION PERIMETER RIM & SOLAR PROMINENCE LOOPS ──
    ctx.beginPath();
    for (var s = 0; s < SAMPLES; s++) {
      if (s === 0) ctx.moveTo(contourPts[s].x, contourPts[s].y);
      else ctx.lineTo(contourPts[s].x, contourPts[s].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.95)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Erupting Coronal Solar Prominence Loops (Plasma Arches leaping beyond the rim)
    for (var a = 0; a < 3; a++) {
      var aAng1 = t * 1.4 + a * (Math.PI * 2 / 3);
      var aAng2 = aAng1 + 0.52;
      var p1x = cx + Math.cos(aAng1) * rockR;
      var p1y = cy + Math.sin(aAng1) * rockR;
      var p2x = cx + Math.cos(aAng2) * rockR;
      var p2y = cy + Math.sin(aAng2) * rockR;
      var archDist = rockR * (1.26 + 0.14 * Math.sin(t * 4.5 + a * 1.7));
      var midAng = (aAng1 + aAng2) * 0.5;
      var apexX = cx + Math.cos(midAng) * archDist;
      var apexY = cy + Math.sin(midAng) * archDist;

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(apexX, apexY, p2x, p2y);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.45)";
      ctx.lineWidth = 2.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(apexX, apexY, p2x, p2y);
      ctx.strokeStyle = "rgba(254, 240, 138, 0.90)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // ── 7. BURNING MICRO-SINGULARITY SOLAR RETICLE CORE ──
    ctx.beginPath();
    ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // ── 8. TARGET SYNCHRONIZATION RESONANCE WAVEFRONT (Supercritical Overdrive) ──
    if (progress > 0) {
      var syncPulse = Math.sin(now * 0.014) * 0.5 + 0.5;
      var syncR = coreR * (1.25 + progress * 0.65 + syncPulse * 0.2);
      ctx.beginPath();
      ctx.arc(cx, cy, syncR, 0, Math.PI * 2);
      ctx.strokeStyle = progress > 0.85 ? "rgba(255, 255, 240, 0.95)" : "rgba(249, 115, 22, 0.80)";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx, cy, syncR * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.60)";
      ctx.lineWidth = 1.1;
      ctx.setLineDash([2, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

    // ── Render Quantum Meteor Lock Reticle (Fiery Magma Corner Brackets & Molten Radial Progress) ──
  function drawMeteorLockReticle(px, py, progress) {
    ctx.save();
    var r = 15;
    var nowMs = performance.now();
    var rot = nowMs * 0.0035;

    // Direct-Touch Contact Spark at intersection point
    var touchX = (cursor.x + px) * 0.5;
    var touchY = (cursor.y + py) * 0.5;
    ctx.beginPath();
    ctx.arc(touchX, touchY, 3.5 + progress * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = progress > 0.85 ? "rgba(255, 240, 138, 0.75)" : "rgba(249, 115, 22, 0.65)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(touchX, touchY, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Concentric Magma Resonance Rings
    if (progress > 0.15) {
      var syncRings = 2;
      var ringPulse = (nowMs * 0.008) % 1;
      for (var srg = 0; srg < syncRings; srg++) {
        var waveR = r * (0.8 + (ringPulse + srg * 0.5) % 1 * 1.1) * (0.85 + progress * 0.35);
        ctx.beginPath();
        ctx.arc(px, py, waveR, 0, Math.PI * 2);
        var ringAlpha = (1 - ((ringPulse + srg * 0.5) % 1)) * (progress * 0.55);
        ctx.strokeStyle = progress > 0.85 ? ("rgba(254, 240, 138, " + ringAlpha.toFixed(2) + ")") : ("rgba(249, 115, 22, " + ringAlpha.toFixed(2) + ")");
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }

    // 4 Corner Fiery Brackets
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.strokeStyle = progress > 0.85 ? "#fef08a" : "#f97316";
    ctx.lineWidth = 1.8;

    var bSize = 5;
    var bOffset = r + 3;
    ctx.beginPath(); ctx.moveTo(-bOffset, -bOffset + bSize); ctx.lineTo(-bOffset, -bOffset); ctx.lineTo(-bOffset + bSize, -bOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bOffset - bSize, -bOffset); ctx.lineTo(bOffset, -bOffset); ctx.lineTo(bOffset, -bOffset + bSize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bOffset, bOffset - bSize); ctx.lineTo(bOffset, bOffset); ctx.lineTo(bOffset - bSize, bOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-bOffset + bSize, bOffset); ctx.lineTo(-bOffset, bOffset); ctx.lineTo(-bOffset, bOffset - bSize); ctx.stroke();

    // 360-Degree Radial Magma Progress Ring
    ctx.rotate(-rot);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.strokeStyle = progress > 0.85 ? "#fef08a" : "#f97316";
      ctx.lineWidth = 3.0;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Digital Progress Readout
    ctx.font = "700 10px 'Chakra Petch', monospace";
    ctx.fillStyle = progress > 0.85 ? "#fef08a" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((progress * 2.0).toFixed(1) + "s / 2.0s", 0, r + 15);

    ctx.restore();
  }

  function drawLockReticle(px, py, progress) {
    ctx.save();
    var r = 14;
    var nowMs = performance.now();
    var rot = nowMs * 0.0035;

    // Solution 3 & 5: No remote dashed tether! Instead, render a crisp Direct-Touch Contact Spark at the intersection point
    var touchX = (cursor.x + px) * 0.5;
    var touchY = (cursor.y + py) * 0.5;
    ctx.beginPath();
    ctx.arc(touchX, touchY, 3.2 + progress * 2.0, 0, Math.PI * 2);
    ctx.fillStyle = progress > 0.85 ? "rgba(255, 215, 0, 0.45)" : "rgba(56, 189, 248, 0.45)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(touchX, touchY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Target Synchronization Visual: Quantum Entanglement Concentric Rings & Energy Bridges
    if (progress > 0.15) {
      var syncRings = 2;
      var ringPulse = (nowMs * 0.008) % 1;
      for (var srg = 0; srg < syncRings; srg++) {
        var waveR = r * (0.8 + (ringPulse + srg * 0.5) % 1 * 1.1) * (0.85 + progress * 0.35);
        ctx.beginPath();
        ctx.arc(px, py, waveR, 0, Math.PI * 2);
        var ringAlpha = (1 - ((ringPulse + srg * 0.5) % 1)) * (progress * 0.45);
        ctx.strokeStyle = progress > 0.85 ? ("rgba(255, 215, 0, " + ringAlpha.toFixed(2) + ")") : ("rgba(56, 189, 248, " + ringAlpha.toFixed(2) + ")");
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    }

    // 4 Corner Precision Brackets hugging the physically touched particle head
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.strokeStyle = progress > 0.85 ? "#ffd700" : "#38bdf8";
    ctx.lineWidth = 1.8;

    var bSize = 5;
    var bOffset = r + 3;
    ctx.beginPath(); ctx.moveTo(-bOffset, -bOffset + bSize); ctx.lineTo(-bOffset, -bOffset); ctx.lineTo(-bOffset + bSize, -bOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bOffset - bSize, -bOffset); ctx.lineTo(bOffset, -bOffset); ctx.lineTo(bOffset, -bOffset + bSize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bOffset, bOffset - bSize); ctx.lineTo(bOffset, bOffset); ctx.lineTo(bOffset - bSize, bOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-bOffset + bSize, bOffset); ctx.lineTo(-bOffset, bOffset); ctx.lineTo(-bOffset, bOffset - bSize); ctx.stroke();

    // 360-Degree Radial Progress Ring (Fills 0% to 100% over 2.0s)
    ctx.rotate(-rot);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.strokeStyle = progress > 0.85 ? "#ffd700" : "#38bdf8";
      ctx.lineWidth = 3.0;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Digital Progress Readout
    ctx.font = "700 10px 'Chakra Petch', monospace";
    ctx.fillStyle = progress > 0.85 ? "#ffd700" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((progress * 2.0).toFixed(1) + "s / 2.0s", 0, r + 15);

    ctx.restore();
  }

  function renderExplosion(now) {
    if (!activeExplosion) return;
    var exp = activeExplosion;
    var elapsed = now - exp.startTime;
    var tNorm = elapsed / exp.duration;
    if (tNorm >= 1.0) {
      activeExplosion = null;
      return;
    }

    ctx.save();

    // 1. Core Radiant Singularity Flare
    if (elapsed < 450) {
      var flareNorm = elapsed / 450;
      var flareR = 15 + flareNorm * 75;
      var flareAlpha = (1 - flareNorm) * 0.9;
      var grad = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, flareR);
      grad.addColorStop(0, "rgba(255, 255, 255, " + flareAlpha + ")");
      grad.addColorStop(0.3, "rgba(255, 215, 0, " + (flareAlpha * 0.8) + ")");
      grad.addColorStop(0.7, "rgba(56, 189, 248, " + (flareAlpha * 0.5) + ")");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, flareR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Expanding Hyperspace Shockwave Rings
    for (var w = 0; w < exp.shockwaves.length; w++) {
      var sw = exp.shockwaves[w];
      sw.r += sw.speed;
      sw.alpha *= 0.96;
      if (sw.alpha > 0.02 && sw.r < sw.maxR) {
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lw;
        ctx.globalAlpha = sw.alpha;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 16;
        ctx.stroke();
      }
    }

    // 3. 76 Glowing Spark Fragments
    ctx.shadowBlur = 10;
    for (var s = 0; s < exp.sparks.length; s++) {
      var sp = exp.sparks[s];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.965;
      sp.vy *= 0.965;
      sp.alpha -= sp.decay;
      if (sp.alpha > 0.03) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + Math.round(sp.hue) + ", 95%, 70%, " + sp.alpha.toFixed(2) + ")";
        ctx.shadowColor = "hsla(" + Math.round(sp.hue) + ", 100%, 65%, 0.8)";
        ctx.globalAlpha = sp.alpha;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Hook UI Click Handlers
  if (btnLaunch) {
    btnLaunch.onclick = function() {
      launchGame("classic");
    };
  }
  if (btnLaunchHelix) {
    btnLaunchHelix.onclick = function() {
      launchGame("helix");
    };
  }
  if (btnLaunchMeteor) {
    btnLaunchMeteor.onclick = function() {
      launchGame("meteor");
    };
  }
  btnExit.onclick = exitGame;
  if (btnReturn) btnReturn.onclick = exitGame;
  if (btnPlayAgain) {
    btnPlayAgain.onclick = restartGame;
  }
  if (btnGamePlayMusic) {
    btnGamePlayMusic.onclick = function(e) {
      if (e) e.stopPropagation();
      var isPlaying = (typeof window.getIsMusicPlaying === "function") ? window.getIsMusicPlaying() : (typeof current !== "undefined" && current !== null);
      if (isPlaying) {
        if (typeof window.stopSong === "function") window.stopSong();
        else if (typeof stopSong === "function") stopSong();
      } else {
        if (typeof window.playSong === "function") window.playSong();
        else if (typeof playSong === "function") {
          var s = (typeof queued !== "undefined" && queued) ? queued : ((typeof nextSong === "function") ? nextSong() : null);
          if (typeof queued !== "undefined" && typeof nextSong === "function") queued = nextSong();
          if (s) playSong(s, null, "test");
        }
      }
      syncGameMusicBtn();
    };
  }

  // Global Controller
  window.quantumGame = {
    launch: launchGame,
    exit: exitGame,
    restart: restartGame,
    triggerGameOver: triggerGameOver,
    triggerVictory: triggerVictory,
    getCurrentVariant: function() { return currentGameVariant; },
    isActive: function() { return isActive; },
    isWon: function() { return isWon; },
    isGameOver: function() { return isGameOver; },
    getContactDuration: function() { return contactDuration; },
    isLocked: function() { return !!lockedParticle; },
    isCursorActivelyMoving: function() { return hasDeliberateMove && (performance.now() - lastCursorMoveTime < 1000); }
  };
  }

  // Resilient Global Event Delegation for all Quantum Universe Buttons
  document.addEventListener('click', function(e) {
    var realm = e.target.closest('#btnLaunchGame, .qgame-btn-realm');
    if (realm) {
      e.preventDefault();
      if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
        window.quantumGame.launch('classic');
      } else {
        initQuantumUniverseGame();
        if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
          window.quantumGame.launch('classic');
        }
      }
      return;
    }
    var helix = e.target.closest('#btnLaunchHelixGame, .qgame-btn-helix');
    if (helix) {
      e.preventDefault();
      if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
        window.quantumGame.launch('helix');
      } else {
        initQuantumUniverseGame();
        if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
          window.quantumGame.launch('helix');
        }
      }
      return;
    }
    var meteor = e.target.closest('#btnLaunchMeteorGame, .qgame-btn-meteor');
    if (meteor) {
      e.preventDefault();
      if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
        window.quantumGame.launch('meteor');
      } else {
        initQuantumUniverseGame();
        if (window.quantumGame && typeof window.quantumGame.launch === 'function') {
          window.quantumGame.launch('meteor');
        }
      }
      return;
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuantumUniverseGame);
  } else {
    initQuantumUniverseGame();
  }
})();