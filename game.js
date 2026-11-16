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
    // 1. Quantum Realm Atomic Cursor
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      const t = now * 0.0016;
      const exc = progress > 0 ? progress * 0.35 : 0;
      const spinMult = 1.0 + exc * 2.5;

      // Photonic Lens Flares
      const flareLen = 36 + exc * 12;
      const flareW = 2.4;
      const hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(168, 85, 247, 0)");
      hGrad.addColorStop(0.3, "rgba(192, 132, 252, 0.4)");
      hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.4)");
      hGrad.addColorStop(1.0, "rgba(56, 189, 248, 0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Central Quantum Core
      const rCore = 15.0;
      const coreGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, rCore);
      coreGrad.addColorStop(0.0, "#ffffff");
      coreGrad.addColorStop(0.25, "#c084fc");
      coreGrad.addColorStop(0.65, "#6b21a8");
      coreGrad.addColorStop(1.0, "#38bdf8");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Electron Orbital Rings
      const ringAngles = [0.4, -0.65, 1.4];
      const ringColors = ["#a855f7", "#38bdf8", "#ec4899"];

      ringAngles.forEach((baseAngle, idx) => {
        ctx.save();
        ctx.rotate(baseAngle + t * spinMult * (idx % 2 === 0 ? 0.8 : -0.8));
        ctx.strokeStyle = ringColors[idx];
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, rCore * 2.1, rCore * 0.75, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting electron bead
        const eAngle = t * spinMult * 2.8 + idx * 2.1;
        const ex = Math.cos(eAngle) * rCore * 2.1;
        const ey = Math.sin(eAngle) * rCore * 0.75;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = ringColors[idx];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    },

    // 2. Quantum Helix Atomic Cursor
    drawHelixCore(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      const t = now * 0.0016;
      const exc = progress > 0 ? progress * 0.35 : 0;
      const spinMult = 1.0 + exc * 2.5;

      // Specular Bi-Chromatic Flare
      const flareLen = 34 + exc * 8;
      const flareW = 2.2;
      const hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(6, 182, 212, 0)");
      hGrad.addColorStop(0.3, "rgba(34, 211, 238, 0.4)");
      hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.7, "rgba(217, 70, 239, 0.4)");
      hGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Spherical Helix Body
      const rCore = 16.0;
      const sphereGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, rCore);
      sphereGrad.addColorStop(0.0, "#ffffff");
      sphereGrad.addColorStop(0.3, "#38bdf8");
      sphereGrad.addColorStop(0.7, "#a855f7");
      sphereGrad.addColorStop(1.0, "#06b6d4");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();

      // Inscribed DNA Double-Helix
      ctx.save();
      ctx.rotate(-0.45 + Math.sin(t * 0.7) * 0.08);
      const dnaLen = (rCore - 1.5) * 1.8;
      const dnaAmp = rCore * 0.38;
      const dnaPhase = t * spinMult * 2.2;

      // Connecting rungs
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      for (let bi = -3; bi <= 3; bi++) {
        const bNorm = bi / 3.8;
        const bx = bNorm * (dnaLen * 0.46);
        const bEnv = Math.sqrt(Math.max(0, 1 - bNorm * bNorm));
        const by1 = Math.sin(dnaPhase + bNorm * Math.PI * 1.75) * dnaAmp * bEnv;
        ctx.moveTo(bx, by1);
        ctx.lineTo(bx, -by1);
      }
      ctx.stroke();

      // Cyan strand
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const norm = -1 + (2 * i) / 10;
        const ix = norm * (dnaLen * 0.48);
        const env = Math.sqrt(Math.max(0, 1 - norm * norm));
        const iy = Math.sin(dnaPhase + norm * Math.PI * 1.75) * dnaAmp * env;
        if (i === 0) ctx.moveTo(ix, iy); else ctx.lineTo(ix, iy);
      }
      ctx.stroke();

      // Magenta strand
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const norm = -1 + (2 * i) / 10;
        const ix = norm * (dnaLen * 0.48);
        const env = Math.sqrt(Math.max(0, 1 - norm * norm));
        const iy = -Math.sin(dnaPhase + norm * Math.PI * 1.75) * dnaAmp * env;
        if (i === 0) ctx.moveTo(ix, iy); else ctx.lineTo(ix, iy);
      }
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    },

    // 3. Quantum Meteor Asteroid Cursor
    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      const exc = progress > 0 ? progress * 0.35 : 0;
      const t = now * 0.0018;
      const coreR = 15.0;

      // Fiery Solar Prominence Corona
      const coronaR = coreR * 2.2;
      const coronaGrad = ctx.createRadialGradient(0, 0, coreR * 0.4, 0, 0, coronaR);
      coronaGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.95)");
      coronaGrad.addColorStop(0.2, "rgba(254, 240, 138, 0.85)");
      coronaGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.55)");
      coronaGrad.addColorStop(0.85, "rgba(220, 38, 38, 0.2)");
      coronaGrad.addColorStop(1.0, "rgba(185, 28, 28, 0.0)");

      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coronaR, 0, Math.PI * 2);
      ctx.fill();

      // 3D Tumbling Jagged Molten Asteroid Body
      ctx.save();
      ctx.rotate(t * 0.8);

      const rockGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, coreR);
      rockGrad.addColorStop(0.0, "#ffffff");
      rockGrad.addColorStop(0.2, "#fde047");
      rockGrad.addColorStop(0.5, "#ea580c");
      rockGrad.addColorStop(0.85, "#7c2d12");
      rockGrad.addColorStop(1.0, "#290800");

      ctx.fillStyle = rockGrad;
      ctx.beginPath();
      // Procedural faceted jagged asteroid polygon
      const facets = 9;
      for (let fi = 0; fi < facets; fi++) {
        const fa = (fi / facets) * Math.PI * 2;
        const dist = coreR * (0.82 + 0.28 * Math.sin(fi * 2.4 + 1.2));
        const fx = Math.cos(fa) * dist;
        const fy = Math.sin(fa) * dist;
        if (fi === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(254, 215, 170, 0.85)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Orbiting micro molten fragments
      for (let mi = 0; mi < 3; mi++) {
        const ma = t * 2.2 + mi * (Math.PI * 2 / 3);
        const mx = Math.cos(ma) * (coreR * 1.7);
        const my = Math.sin(ma) * (coreR * 1.7);
        ctx.fillStyle = "#fed7aa";
        ctx.beginPath();
        ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    },

    // ── Tier 3 Extra Big Particle Renderers (Falling in Reflex Blitz) ──
    drawTier3RealmParticle(ctx, p, now) {
      ctx.save();
      const headR = 24.0;
      const K = p.spine.length;

      // Inverse Kinematics Body Gradient
      const tailX = p.spine[K - 1].x;
      const tailY = p.spine[K - 1].y;
      const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
      grad.addColorStop(0.0, "rgba(168, 85, 247, 0.0)");
      grad.addColorStop(0.3, "rgba(192, 132, 252, 0.4)");
      grad.addColorStop(0.7, "rgba(56, 189, 248, 0.75)");
      grad.addColorStop(1.0, "rgba(255, 255, 255, 0.95)");

      // Tapered Streamer Spine
      ctx.strokeStyle = grad;
      ctx.lineWidth = headR * 0.75;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p.spine[0].x, p.spine[0].y);
      for (let i = 1; i < K; i++) {
        ctx.lineTo(p.spine[i].x, p.spine[i].y);
      }
      ctx.stroke();

      // Multi-branch crackling lightning arcs along spine
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < K - 1; i++) {
        const seg = p.spine[i];
        const next = p.spine[i + 1];
        const mx = (seg.x + next.x) * 0.5 + (Math.sin(now * 0.04 + i) * 8);
        const my = (seg.y + next.y) * 0.5 + (Math.cos(now * 0.04 + i) * 8);
        if (i === 0) ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(mx, my);
        ctx.lineTo(next.x, next.y);
      }
      ctx.stroke();

      // Luminous Apex Singularity Head
      const hGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, headR);
      hGrad.addColorStop(0.0, "#ffffff");
      hGrad.addColorStop(0.35, "#c084fc");
      hGrad.addColorStop(0.75, "#38bdf8");
      hGrad.addColorStop(1.0, "rgba(56, 189, 248, 0.0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, headR, 0, Math.PI * 2);
      ctx.fill();

      // Double Orbital Planetary Rings
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(now * 0.002);
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, headR * 1.5, headR * 0.65, 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.ellipse(0, 0, headR * 1.5, headR * 0.65, -0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    },

    drawTier3HelixParticle(ctx, p, now) {
      ctx.save();
      const headR = 24.0;
      const K = p.spine.length;
      const t = now * 0.003;

      // Cyan & Magenta Intertwining DNA Ribbons
      const waveAmp = 14;
      ctx.lineWidth = 3.0;

      // Strand 1 (Cyan)
      ctx.strokeStyle = "#06b6d4";
      ctx.beginPath();
      for (let i = 0; i < K; i++) {
        const seg = p.spine[i];
        const offset = Math.sin(t - i * 0.8) * waveAmp;
        const px = seg.x + offset;
        if (i === 0) ctx.moveTo(px, seg.y); else ctx.lineTo(px, seg.y);
      }
      ctx.stroke();

      // Strand 2 (Magenta)
      ctx.strokeStyle = "#ec4899";
      ctx.beginPath();
      for (let i = 0; i < K; i++) {
        const seg = p.spine[i];
        const offset = -Math.sin(t - i * 0.8) * waveAmp;
        const px = seg.x + offset;
        if (i === 0) ctx.moveTo(px, seg.y); else ctx.lineTo(px, seg.y);
      }
      ctx.stroke();

      // Base Pair Connecting Rungs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 1; i < K - 1; i += 2) {
        const seg = p.spine[i];
        const offset = Math.sin(t - i * 0.8) * waveAmp;
        ctx.moveTo(seg.x + offset, seg.y);
        ctx.lineTo(seg.x - offset, seg.y);
      }
      ctx.stroke();

      // Helix Head Core
      const hGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, headR);
      hGrad.addColorStop(0.0, "#ffffff");
      hGrad.addColorStop(0.3, "#22d3ee");
      hGrad.addColorStop(0.7, "#d946ef");
      hGrad.addColorStop(1.0, "rgba(217, 70, 239, 0.0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, headR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    drawTier3MeteorParticle(ctx, p, now) {
      ctx.save();
      const headR = 25.0;
      const K = p.spine.length;

      // Real Fire Combustion Flame Tail
      const tailX = p.spine[K - 1].x;
      const tailY = p.spine[K - 1].y;
      const fGrad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
      fGrad.addColorStop(0.0, "rgba(185, 28, 28, 0.0)");
      fGrad.addColorStop(0.3, "rgba(234, 88, 12, 0.5)");
      fGrad.addColorStop(0.7, "rgba(251, 146, 60, 0.85)");
      fGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.98)");

      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(p.x - headR * 0.8, p.y);
      ctx.lineTo(tailX, tailY);
      ctx.lineTo(p.x + headR * 0.8, p.y);
      ctx.closePath();
      ctx.fill();

      // Tumbling Molten Jagged Rock
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(now * 0.0025);

      const rGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, headR);
      rGrad.addColorStop(0.0, "#ffffff");
      rGrad.addColorStop(0.25, "#fde047");
      rGrad.addColorStop(0.6, "#ea580c");
      rGrad.addColorStop(0.9, "#7c2d12");
      rGrad.addColorStop(1.0, "#1f0700");

      ctx.fillStyle = rGrad;
      ctx.beginPath();
      const facets = 8;
      for (let fi = 0; fi < facets; fi++) {
        const fa = (fi / facets) * Math.PI * 2;
        const dist = headR * (0.8 + 0.3 * Math.sin(fi * 2.6));
        const fx = Math.cos(fa) * dist;
        const fy = Math.sin(fa) * dist;
        if (fi === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#fed7aa";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
      ctx.restore();
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

    // Spawn Tier 3 Extra Big Particles
    if (Math.random() < 0.038) {
      const types = ['realm', 'helix', 'meteor'];
      const pType = types[Math.floor(Math.random() * types.length)];
      const px = Math.random() * (w - 120) + 60;
      const speed = 3.2 + Math.random() * 2.5;

      const p = {
        type: pType,
        x: px,
        y: -40,
        speed: speed,
        spine: []
      };

      for (let j = 0; j < 8; j++) {
        p.spine.push({ x: px, y: -40 - j * 8 });
      }
      state.particles.push(p);
    }

    // Draw Catcher at Bottom
    const catcherPixelX = Math.max(50, Math.min(w - 50, state.catcherX * w));
    const catcherPixelY = h - 75;

    if (state.catcherType === 'realm') {
      QuantumRenderer.drawQuantumAtomic(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else if (state.catcherType === 'helix') {
      QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else {
      QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    }

    // Update and Render Falling Tier 3 Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.y += p.speed;

      // Update spine IK
      p.spine[0].x = p.x;
      p.spine[0].y = p.y;
      for (let j = 1; j < p.spine.length; j++) {
        p.spine[j].y += p.speed;
      }

      // Render Particle
      if (p.type === 'realm') {
        QuantumRenderer.drawTier3RealmParticle(ctx, p, timestamp);
      } else if (p.type === 'helix') {
        QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
      } else {
        QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
      }

      // Collision Detection with Catcher (Radius 42px)
      const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
      if (dist < 46) {
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
      if (p.y > h + 60) {
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
    { name: 'Realm Violet', color: '#a855f7', type: 'realm' },
    { name: 'Helix Cyan', color: '#06b6d4', type: 'helix' },
    { name: 'Meteor Gold', color: '#f59e0b', type: 'meteor' },
    { name: 'Emerald Plasma', color: '#10b981', type: 'realm' },
    { name: 'Rose Laser', color: '#f43f5e', type: 'helix' },
    { name: 'Solar Amber', color: '#ea580c', type: 'meteor' },
    { name: 'Cobalt Spark', color: '#3b82f6', type: 'realm' },
    { name: 'Neon Lime', color: '#84cc16', type: 'helix' },
    { name: 'Crimson Flame', color: '#e11d48', type: 'meteor' },
    { name: 'Aquamarine', color: '#14b8a6', type: 'realm' },
    { name: 'Purple Core', color: '#9333ea', type: 'helix' },
    { name: 'Topaz Nova', color: '#eab308', type: 'meteor' },
    { name: 'Electric Sky', color: '#0ea5e9', type: 'realm' },
    { name: 'Fuchsia Beam', color: '#d946ef', type: 'helix' },
    { name: 'Molten Copper', color: '#c2410c', type: 'meteor' },
    { name: 'Spectral White', color: '#f8fafc', type: 'realm' }
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
      const pal = MATRIX_PALETTES[i];
      const box = document.createElement('div');
      box.className = 'matrix-box';
      box.dataset.index = i;
      box.style.setProperty('--box-color', pal.color);

      // Mini Canvas inside box
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      box.appendChild(canvas);

      const label = document.createElement('span');
      label.className = 'matrix-box-label';
      label.textContent = pal.name;
      box.appendChild(label);

      // Draw initial static preview
      const ctx = canvas.getContext('2d');
      if (pal.type === 'realm') {
        QuantumRenderer.drawQuantumAtomic(ctx, 60, 52, 1000);
      } else if (pal.type === 'helix') {
        QuantumRenderer.drawHelixCore(ctx, 60, 52, 1000);
      } else {
        QuantumRenderer.drawMeteorAsteroid(ctx, 60, 52, 1000);
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
