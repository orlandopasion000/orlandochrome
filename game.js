/**
 * Chrome Synapse: Quantum Arcade Arena (v2.0)
 * ─────────────────────────────────────────────────────────────
 * Designed for Sir Orlando V. Pasion, Jr. — Teacher VI, Mathematics Educator, EdTech Innovator
 * 
 * Games:
 * 1. 🧮 Math Overdrive: Professional Eight-Level Difficulty System (20 Qs/level, 10 Mistakes Max)
 * 2. ⚡ Reflex Blitz: Quantum Realm, Helix & Meteor Catcher with Tier 3 Extra Big Particles (Strict 3 Lives)
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

    _vibrate(pattern) {
      try {
        if (navigator.vibrate && (!('userActivation' in navigator) || navigator.userActivation?.hasBeenActive)) {
          navigator.vibrate(pattern);
        }
      } catch(e) {}
    }

    // Recommendation 5: Mode-Specific Multi-Harmonic Audio & Micro-Haptics
    playDynamoCapture(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const freq = 480 * Math.min(2.2, 1 + (combo - 1) * 0.08);
      this.playTone(freq, 'sawtooth', 0.10, 0.22);
      setTimeout(() => this.playTone(freq * 1.5, 'sine', 0.16, 0.20), 35);
      this._vibrate(8);
    }

    playHelixCapture(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const pitch = pentatonic[(combo - 1) % pentatonic.length];
      this.playTone(pitch, 'sine', 0.16, 0.24);
      setTimeout(() => this.playTone(pitch * 1.25, 'triangle', 0.20, 0.18), 45);
      this._vibrate([10, 15, 10]);
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
      this._vibrate(28);
    }

    playOverdriveFanfare() {
      if (this.isMuted) return;
      this.init();
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.35, 0.25), idx * 55);
      });
      this._vibrate([30, 40, 30, 40, 60]);
    }

    // Perfect-Center Precision & Chain Audio
    playPerfectCatch(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 783.99; // G5
      const mult = Math.min(2.4, 1 + (combo - 1) * 0.10);
      this.playTone(baseFreq * mult, 'sine', 0.22, 0.25);
      setTimeout(() => this.playTone(baseFreq * mult * 1.5, 'sine', 0.28, 0.28), 50);
      this._vibrate([12, 12, 18]);
    }

    playGrazeCatch(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 440.00;
      this.playTone(baseFreq, 'sine', 0.10, 0.16);
      this._vibrate(6);
    }

    playHazardExplosion() {
      if (this.isMuted) return;
      this.init();
      this.playTone(110.00, 'sawtooth', 0.40, 0.35);
      setTimeout(() => this.playTone(73.42, 'sawtooth', 0.45, 0.40), 60);
      this._vibrate([50, 40, 60]);
    }

    playMissileHit() {
      if (this.isMuted) return;
      this.init();
      // Positive tactical strike tone: bright rising crystalline major triad (D5 -> F#5 -> A5 -> D6)
      const chord = [587.33, 739.99, 880.00, 1174.66];
      chord.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.22, 0.14), idx * 22);
      });
      this._vibrate(14);
    }

    playPulseCharged() {
      if (this.isMuted) return;
      this.init();
      const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.25, 0.22), idx * 45);
      });
      this._vibrate([15, 20, 25]);
    }

    playFluxPulseUnleashed(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        if (mode === 'helix') {
          // Cytogenetic Bio-Lattice Shatter: Resonant crystal bell triad with harmonic sweep
          const freqs = [528, 880, 1320];
          freqs.forEach((freq, fIdx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t0 + fIdx * 0.04);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t0 + 0.85);
            gain.gain.setValueAtTime(0.35, t0 + fIdx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t0 + fIdx * 0.04);
            osc.stop(t0 + 0.95);
          });
        } else if (mode === 'meteor') {
          // Solar Hypernova Shock: Heavy seismic basalt rumble + furnace roar
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, t0);
          osc.frequency.exponentialRampToValueAtTime(24, t0 + 0.90);
          gain.gain.setValueAtTime(0.65, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.90);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.90);
        } else {
          // Tachyon Resonance Singularity: Sub-bass 35Hz drop with high-voltage lightning crack
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(360, t0);
          osc.frequency.exponentialRampToValueAtTime(32, t0 + 0.85);
          gain.gain.setValueAtTime(0.60, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.85);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.85);
        }
      } catch(e) {
        this.playTone(120, 'triangle', 0.4, 0.5);
      }
      this._vibrate([50, 40, 50, 40, 90]);
    }

    playTier5Ascension() {
      if (this.isMuted) return;
      this.init();
      try {
        const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C-E-G-C-E ascending divine triad
        chords.forEach((note, idx) => {
          setTimeout(() => this.playTone(note, 'sine', 0.28, 0.25), idx * 45);
        });
      } catch (e) {}
      this._vibrate([30, 20, 30, 20, 60]);
    }

    playPhaseSwitch() {
      if (this.isMuted) return;
      this.init();
      this.playTone(659.25, 'sine', 0.12, 0.15);
      setTimeout(() => this.playTone(880.00, 'sine', 0.16, 0.15), 40);
      this._vibrate(8);
    }

    playHyperCometRoar() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t0);
        osc.frequency.exponentialRampToValueAtTime(48, t0 + 0.42);
        gain.gain.setValueAtTime(0.28, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.44);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.45);
      } catch (e) {}
      this._vibrate([20, 15, 35]);
    }

    playCorruptionLaser() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        [680, 340].forEach((startFreq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = idx === 0 ? 'sawtooth' : 'square';
          osc.frequency.setValueAtTime(startFreq, t0);
          osc.frequency.exponentialRampToValueAtTime(startFreq * 0.28, t0 + 0.34);
          gain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.14, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.36);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.38);
        });
      } catch (e) {}
      this._vibrate([25, 20, 40]);
    }

    playEmpShockwave() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, t0);
        osc.frequency.exponentialRampToValueAtTime(34, t0 + 0.45);
        gain.gain.setValueAtTime(0.32, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.50);
      } catch (e) {}
      this._vibrate([30, 20, 20]);
    }

    playQuantumBlink() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t0);
        osc.frequency.exponentialRampToValueAtTime(1180, t0 + 0.14);
        osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.24);
        gain.gain.setValueAtTime(0.20, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.28);
      } catch (e) {}
      this._vibrate(14);
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
  // INDEPENDENT LAYERED ANIMATION & 5 VISUAL EVOLUTION UPGRADES (v342)
  // 1. Real-Time Morphing "Ascension Unfurl" Transitions (Tier I <-> II <-> III <-> IV)
  // 2. Dual-Tiered Counter-Articulating Pinions & Feather-Tip Splaying (Tier IV)
  // 3. Traveling Wing-Vein Energy Conduits, Wingtip Spark Emitters & Wing-Root Gyros
  // 4. Progressive Internal Core Complexity Across Tiers I -> II -> III -> IV
  // 5. Pre-Impact "Magnetic Lock-On" Core Anticipation & Tier IV Harmonic Resonance Flash
  // ─────────────────────────────────────────────────────────────
  const LayeredT4Assets = {
    halo: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRight: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRightT5: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingLeftCanvas: { dynamo: null, helix: null, meteor: null },
    coreBase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreBaseT5: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    nodeShell: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    hazard: {
      dynamoCore: new Image(),
      dynamoGlitch: new Image(),
      helixClean: new Image(),
      meteorBlades: new Image(),
      meteorCenter: new Image()
    },
    poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
    loaded: {
      halo: { dynamo: false, helix: false, meteor: false },
      wingRight: { dynamo: false, helix: false, meteor: false },
      wingRightT5: { dynamo: false, helix: false, meteor: false },
      coreBase: { dynamo: false, helix: false, meteor: false },
      coreBaseT5: { dynamo: false, helix: false, meteor: false },
      nodeShell: { dynamo: false, helix: false, meteor: false },
      hazard: {
        dynamoCore: false,
        dynamoGlitch: false,
        helixClean: false,
        meteorBlades: false,
        meteorCenter: false
      },
      poweredHazard: { dynamo: {}, helix: {}, meteor: {} }
    }
  };

  function buildMirroredWingCanvas(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 688;
    c.height = img.naturalHeight || 768;
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
    LayeredT4Assets.halo[m].src = `assets/layer-${m}-halo.png?v=arcade374`;

    LayeredT4Assets.wingRight[m].onload = () => {
      LayeredT4Assets.loaded.wingRight[m] = true;
    };
    LayeredT4Assets.wingRight[m].src = `assets/layer-${m}-wing-right.png?v=arcade374`;

    LayeredT4Assets.wingRightT5[m].onload = () => {
      LayeredT4Assets.loaded.wingRightT5[m] = true;
    };
    LayeredT4Assets.wingRightT5[m].src = `assets/layer-${m}-wing-t5.png?v=arcade374`;

    LayeredT4Assets.coreBaseT5[m].onload = () => {
      LayeredT4Assets.loaded.coreBaseT5[m] = true;
    };
    LayeredT4Assets.coreBaseT5[m].src = `assets/core-${m}-t5.png?v=arcade374`;
  });

  LayeredT4Assets.coreBase.dynamo.onload = () => { LayeredT4Assets.loaded.coreBase.dynamo = true; };
  LayeredT4Assets.coreBase.dynamo.src = 'assets/layer-dynamo-nucleus.png?v=arcade374';

  LayeredT4Assets.coreBase.helix.onload = () => { LayeredT4Assets.loaded.coreBase.helix = true; };
  LayeredT4Assets.coreBase.helix.src = 'assets/layer-helix-shell.png?v=arcade374';

  LayeredT4Assets.coreBase.meteor.onload = () => { LayeredT4Assets.loaded.coreBase.meteor = true; };
  LayeredT4Assets.coreBase.meteor.src = 'assets/layer-meteor-caldera.png?v=arcade374';

  LayeredT4Assets.nodeShell.dynamo.onload = () => { LayeredT4Assets.loaded.nodeShell.dynamo = true; };
  LayeredT4Assets.nodeShell.dynamo.src = 'assets/layer-node-dynamo-shell.png?v=arcade374';

  LayeredT4Assets.nodeShell.helix.onload = () => { LayeredT4Assets.loaded.nodeShell.helix = true; };
  LayeredT4Assets.nodeShell.helix.src = 'assets/layer-node-helix-shell.png?v=arcade374';

  LayeredT4Assets.nodeShell.meteor.onload = () => { LayeredT4Assets.loaded.nodeShell.meteor = true; };
  LayeredT4Assets.nodeShell.meteor.src = 'assets/layer-node-meteor-rock.png?v=arcade374';

  LayeredT4Assets.hazard.dynamoCore.onload = () => { LayeredT4Assets.loaded.hazard.dynamoCore = true; };
  LayeredT4Assets.hazard.dynamoCore.src = 'assets/layer-hazard-dynamo-core.png?v=arcade374';

  LayeredT4Assets.hazard.dynamoGlitch.onload = () => { LayeredT4Assets.loaded.hazard.dynamoGlitch = true; };
  LayeredT4Assets.hazard.dynamoGlitch.src = 'assets/layer-hazard-dynamo-glitch.png?v=arcade374';

  LayeredT4Assets.hazard.helixClean.onload = () => { LayeredT4Assets.loaded.hazard.helixClean = true; };
  LayeredT4Assets.hazard.helixClean.src = 'assets/layer-hazard-helix-clean.png?v=arcade374';

  LayeredT4Assets.hazard.meteorBlades.onload = () => { LayeredT4Assets.loaded.hazard.meteorBlades = true; };
  LayeredT4Assets.hazard.meteorBlades.src = 'assets/layer-hazard-meteor-blades.png?v=arcade374';

  LayeredT4Assets.hazard.meteorCenter.onload = () => { LayeredT4Assets.loaded.hazard.meteorCenter = true; };
  LayeredT4Assets.hazard.meteorCenter.src = 'assets/layer-hazard-meteor-center.png?v=arcade374';

  // Preload all 15 Bespoke Luxury Raytraced Powered Bad Chrome Core Sprites (3 Games x 5 Powered Hazards)
  const POWERED_HAZARD_KEYS = ['hyper_comet', 'corruptor_laser', 'gravity_well', 'emp_detonator', 'phase_stalker'];
  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    POWERED_HAZARD_KEYS.forEach((hk) => {
      const img = new Image();
      LayeredT4Assets.poweredHazard[m][hk] = img;
      LayeredT4Assets.loaded.poweredHazard[m][hk] = false;
      img.onload = () => { LayeredT4Assets.loaded.poweredHazard[m][hk] = true; };
      img.src = `assets/hazard-powered-${m}-${hk}.png?v=arcade378`;
    });
  });

  // Helper: Identifies any hazard trap or anomaly archetype
  function isHazardNode(nodeClass) {
    return nodeClass === 'volatile' || nodeClass === 'seeker' || nodeClass === 'phantom' || nodeClass === 'fragmentation' || nodeClass === 'vortex' || nodeClass === 'gravity_well' || nodeClass === 'pulsar_mine' || nodeClass === 'emp_glitch' || nodeClass === 'emp_detonator' || nodeClass === 'tachyon_fracture' || nodeClass === 'phase_stalker' || nodeClass === 'plasma_flare' || nodeClass === 'hyper_comet' || nodeClass === 'corruptor_laser' || nodeClass === 'broken_arc';
  }

  // ─────────────────────────────────────────────────────────────
  // SECONDARY KINEMATICS, ASCENSION MORPHING & LOCK-ON ENGINE
  // ─────────────────────────────────────────────────────────────
  // OMNIDIRECTIONAL 6-DOF CORE KINEMATICS & TACTICAL ORDNANCE (v353)
  // ─────────────────────────────────────────────────────────────
  const CoreKinematics = {
    lastX: null,
    lastY: null,
    vx: 0,
    vy: 0,
    prevVx: 0,
    prevVy: 0,
    bodyBank: 0,
    bodyBankVel: 0,
    pitchAngle: 0,
    pitchAngleVel: 0,
    rootY: 0, rootVelY: 0,
    midY: 0,  midVelY: 0,
    tipY: 0,  tipVelY: 0,
    tipX: 0,  tipVelX: 0,

    // Upgrade 1: Real-Time Morphing "Ascension Unfurl" State (1.0 -> 4.0)
    lastTargetTier: 1,
    continuousTier: 1.0,
    continuousTierVel: 0.0,
    ascensionRings: [],     // Expanding shock-rings on Tier Up!

    // Upgrade 2 & 3: Feather-Tip Splay & Wingtip Particle Emitters
    featherSplay: 0,
    wingtipSparks: [],
    lastWingSparkTime: 0,

    // Upgrade 5: Pre-Impact Magnetic Lock-On & Tier IV Harmonic Resonance Flash
    lockOnDX: 0,
    lockOnProximity: 0,     // 0.0 (none) -> 1.0 (imminent contact)
    overdriveFlash: 0,      // Synchronized Core-to-Wing harmonic flash in Tier IV

    // Reactive Ion Thrusters & Tactical Ordnance Systems
    thrusterPlumes: [],
    missiles: [],
    missileSalvoQueue: 0,
    salvoOrigin: null,
    launchFlashes: [],
    grazeSparks: [],
    shieldDeflectFlash: 0,

    // Mode-Specific Capture States
    wingRipples: [],
    dynamoDischarges: [],
    meteorShieldRecoil: { y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 },
    impactCinders: [],
    worldStreaks: [],

    reset() {
      this.lastX = null;
      this.lastY = null;
      this.vx = 0;
      this.vy = 0;
      this.prevVx = 0;
      this.prevVy = 0;
      this.bodyBank = 0;
      this.bodyBankVel = 0;
      this.pitchAngle = 0;
      this.pitchAngleVel = 0;
      this.rootY = 0; this.rootVelY = 0;
      this.midY = 0;  this.midVelY = 0;
      this.tipY = 0;  this.tipVelY = 0;
      this.tipX = 0;  this.tipVelX = 0;
      this.lastTargetTier = 1;
      this.continuousTier = 1.0;
      this.continuousTierVel = 0.0;
      this.ascensionRings = [];
      this.featherSplay = 0;
      this.wingtipSparks = [];
      this.lastWingSparkTime = 0;
      this.lockOnDX = 0;
      this.lockOnProximity = 0;
      this.overdriveFlash = 0;
      this.thrusterPlumes = [];
      this.missiles = [];
      this.missileSalvoQueue = 0;
      this.salvoOrigin = null;
      this.launchFlashes = [];
      this.grazeSparks = [];
      this.shieldDeflectFlash = 0;
      this.wingRipples = [];
      this.dynamoDischarges = [];
      this.meteorShieldRecoil = { y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 };
      this.impactCinders = [];
      this.worldStreaks = [];
    },

    update(catcherPixelX, catcherPixelY, dtScale, now, targetTier = 1, mode = 'dynamo', particles = []) {
      const dt = Math.max(0.25, Math.min(2.5, dtScale));
      if (this.lastX === null) this.lastX = catcherPixelX;
      if (this.lastY === null) this.lastY = catcherPixelY;
      const rawVx = (catcherPixelX - this.lastX) / dt;
      const rawVy = (catcherPixelY - this.lastY) / dt;
      this.lastX = catcherPixelX;
      this.lastY = catcherPixelY;

      this.prevVx = this.vx;
      this.prevVy = this.vy;
      this.vx = this.vx * 0.45 + rawVx * 0.55;
      this.vy = this.vy * 0.45 + rawVy * 0.55;
      const accelX = this.vx - this.prevVx;

      // 3D Pitch Kinematics: Vertical velocity induces aerodynamic dive/climb tilt
      const targetPitch = Math.max(-0.25, Math.min(0.25, this.vy * 0.012));
      this.pitchAngleVel = (this.pitchAngleVel + (targetPitch - this.pitchAngle) * 0.25 * dt) * Math.pow(0.72, dt);
      this.pitchAngle += this.pitchAngleVel * dt;

      // UPGRADE 1: Real-Time Morphing "Ascension Unfurl" Spring (Tier I <-> II <-> III <-> IV <-> V)
      if (targetTier > this.lastTargetTier) {
        // Trigger Ascension Unfurl Burst Ring!
        this.ascensionRings.push({
          tierReached: targetTier,
          radius: 36,
          maxRadius: targetTier === 4 ? 250 : (targetTier === 5 ? 320 : 185),
          alpha: 1.0,
          mode: mode
        });
        if (targetTier >= 4) {
          this.overdriveFlash = 1.0;
        }
      }
      this.lastTargetTier = targetTier;

      // Smooth Monotonic Tier Progression (Guarantees zero spring-overshoot across tier thresholds)
      const prevCTier = this.continuousTier;
      const tierDiff = targetTier - this.continuousTier;
      const easeRate = 1.0 - Math.pow(0.85, dt);
      this.continuousTier += tierDiff * easeRate;
      // Strict monotonic clamp: never overshoot target tier
      if (prevCTier <= targetTier && this.continuousTier > targetTier) {
        this.continuousTier = targetTier;
      } else if (prevCTier >= targetTier && this.continuousTier < targetTier) {
        this.continuousTier = targetTier;
      }
      this.continuousTier = Math.max(1.0, Math.min(5.0, this.continuousTier));

      for (let i = this.ascensionRings.length - 1; i >= 0; i--) {
        const ar = this.ascensionRings[i];
        ar.radius += (ar.maxRadius - ar.radius) * 0.14 * dt;
        ar.alpha -= 0.038 * dt;
        if (ar.alpha <= 0) this.ascensionRings.splice(i, 1);
      }

      // UPGRADE 5: Pre-Impact Magnetic Lock-On Detection
      let bestDist = 195;
      let bestDX = 0;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        if (isHazardNode(pt.nodeClass) || pt.isNumber) continue;
        const dy = catcherPixelY - pt.y;
        if (dy > -20 && dy < 195) {
          const dx = pt.x - catcherPixelX;
          const d = Math.hypot(dx, dy);
          if (d < bestDist) {
            bestDist = d;
            bestDX = dx;
          }
        }
      }
      const targetProx = bestDist < 195 ? Math.pow(1.0 - bestDist / 195.0, 1.3) : 0.0;
      this.lockOnProximity += (targetProx - this.lockOnProximity) * 0.25 * dt;
      this.lockOnDX += ((bestDist < 195 ? bestDX : 0) - this.lockOnDX) * 0.25 * dt;
      this.overdriveFlash = Math.max(0, this.overdriveFlash - 0.045 * dt);

      // 1. Body Bank Angle
      const targetBank = Math.max(-0.16, Math.min(0.16, this.vx * 0.0050));
      this.bodyBankVel = (this.bodyBankVel + (targetBank - this.bodyBank) * 0.28 * dt) * Math.pow(0.70, dt);
      this.bodyBank += this.bodyBankVel * dt;

      // 2. Wing Root: follows body movement closely
      const targetRootY = Math.max(-16, Math.min(16, this.vx * 0.40));
      this.rootVelY = (this.rootVelY + (targetRootY - this.rootY) * 0.30 * dt) * Math.pow(0.70, dt);
      this.rootY += this.rootVelY * dt;

      // 3. Wing Mid-Section: follows Wing Root a fraction of a second later
      const targetMidY = this.rootY * 1.35;
      this.midVelY = (this.midVelY + (targetMidY - this.midY) * 0.16 * dt) * Math.pow(0.76, dt);
      this.midY += this.midVelY * dt;

      // 4. Outer Feather Tips: follows Mid-Section last + carries reversal momentum whip!
      const reversalImpulseY = -accelX * 0.46;
      const reversalImpulseX = -accelX * 0.52;
      this.tipVelY += reversalImpulseY;
      this.tipVelX += reversalImpulseX;

      const targetTipY = this.midY * 1.45;
      const targetTipX = Math.max(-26, Math.min(26, -this.vx * 0.52));
      this.tipVelY = (this.tipVelY + (targetTipY - this.tipY) * 0.085 * dt) * Math.pow(0.83, dt);
      this.tipY += this.tipVelY * dt;

      this.tipVelX = (this.tipVelX + (targetTipX - this.tipX) * 0.085 * dt) * Math.pow(0.82, dt);
      this.tipX += this.tipVelX * dt;

      // UPGRADE 2: Feather-Tip Splay during sharp reversals & Tier Ascension
      const targetSplay = Math.min(1.0, (Math.abs(this.tipVelY) + Math.abs(this.tipVelX)) * 0.065 + this.overdriveFlash * 0.65);
      this.featherSplay += (targetSplay - this.featherSplay) * 0.22 * dt;

      // UPGRADE 3: Update Wingtip Particle Emitters (Tier III & IV)
      for (let i = this.wingtipSparks.length - 1; i >= 0; i--) {
        const sp = this.wingtipSparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.life += dt;
        if (sp.life >= sp.maxLife) {
          this.wingtipSparks.splice(i, 1);
        }
      }

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
        c.vy += 0.20 * dt;
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

      // 9. Emit & Update Reactive Omnidirectional Ion Thrusters & Twin Wingtip Vortex Trails
      const speed2D = Math.hypot(this.vx, this.vy);
      const isMoving = speed2D > 0.35;
      const thrusterColors = {
        dynamo: ['#00f0ff', '#38bdf8', '#e0f2fe', '#ffffff'],
        helix: ['#22d3ee', '#34d399', '#fef08a', '#ffffff'],
        meteor: ['#fbbf24', '#f97316', '#ea580c', '#ffffff']
      };
      const pal = thrusterColors[mode] || thrusterColors.dynamo;

      // 9. Ultra-Smooth Micro-Ion Trail (Lightweight, Tiny, Zero-Lag Architecture)
      if (isMoving && speed2D > 0.8) {
        if (!this.lastPlumeEmitTime || (now - this.lastPlumeEmitTime) > 34) {
          this.lastPlumeEmitTime = now;
          const normVx = this.vx / speed2D;
          const normVy = this.vy / speed2D;
          const exhaustAngle = Math.atan2(-normVy, -normVx) + (Math.random() - 0.5) * 0.35;
          const pSpd = Math.min(2.8, 1.2 + speed2D * 0.20);
          
          this.thrusterPlumes.push({
            x: catcherPixelX - normVx * 26 + (Math.random() - 0.5) * 4,
            y: catcherPixelY - normVy * 26 + (Math.random() - 0.5) * 4,
            vx: Math.cos(exhaustAngle) * pSpd,
            vy: Math.sin(exhaustAngle) * pSpd,
            color: pal[Math.floor(Math.random() * pal.length)],
            size: 0.9 + Math.random() * 0.5, // Ultra-tiny subtle micro-mote
            life: 0,
            maxLife: 8 + Math.random() * 4 // Snappy ~150ms fade
          });

          // Delicate single wingtip stardust glint on high-velocity turns
          if (this.continuousTier >= 2.0 && speed2D > 3.2 && Math.random() < 0.45) {
            const spanDist = (0.24 + Math.min(0.20, (this.continuousTier - 2.0) * 0.10)) * 320;
            const wingYOff = this.tipY * 0.32;
            const isLeft = (Math.random() < 0.5);
            this.thrusterPlumes.push({
              x: catcherPixelX + (isLeft ? -spanDist : spanDist) + (Math.random() - 0.5) * 3,
              y: catcherPixelY + wingYOff + (Math.random() - 0.5) * 3,
              vx: -this.vx * 0.12,
              vy: -this.vy * 0.12,
              color: pal[0],
              isWingtip: true,
              size: 0.85,
              life: 0,
              maxLife: 8
            });
          }
        }
      }

      // Hard-cap plume array to max 10 tiny particles for absolute zero CPU/GPU overhead
      if (this.thrusterPlumes.length > 10) {
        this.thrusterPlumes.splice(0, this.thrusterPlumes.length - 10);
      }

      for (let i = this.thrusterPlumes.length - 1; i >= 0; i--) {
        const tp = this.thrusterPlumes[i];
        tp.x += tp.vx * dt;
        tp.y += tp.vy * dt;
        tp.size = Math.max(0.2, tp.size * 0.92);
        tp.life += dt;
        if (tp.life >= tp.maxLife) this.thrusterPlumes.splice(i, 1);
      }

      // 10. Update Graze & Shield Deflection Sparks
      for (let i = this.grazeSparks.length - 1; i >= 0; i--) {
        const gs = this.grazeSparks[i];
        gs.x += gs.vx * dt;
        gs.y += gs.vy * dt;
        gs.life += dt;
        if (gs.life >= gs.maxLife) this.grazeSparks.splice(i, 1);
      }
      this.shieldDeflectFlash = Math.max(0, this.shieldDeflectFlash - 0.05 * dt);
    },

    triggerGraze(x, y, now) {
      for (let k = 0; k < 12; k++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2.4 + Math.random() * 4.6;
        this.grazeSparks.push({
          x: x,
          y: y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: '#38bdf8',
          life: 0,
          maxLife: 18 + Math.random() * 10
        });
      }
    },

    triggerShieldDeflect(x, y, now) {
      this.shieldDeflectFlash = 1.0;
      for (let k = 0; k < 22; k++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 3.6 + Math.random() * 6.4;
        this.grazeSparks.push({
          x: x,
          y: y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: '#fbbf24',
          life: 0,
          maxLife: 24 + Math.random() * 14
        });
      }
    },

    fireMissiles(cx, cy, now, particles, mode = 'dynamo') {
      this.missileSalvoQueue = 14;
      this.salvoOrigin = { x: cx, y: cy };
      this.salvoMode = mode;
      this.salvoTimer = 0;
      this._launchMissilePair(cx, cy, now, mode);
      this.missileSalvoQueue -= 2;
    },

    _launchMissilePair(cx, cy, now, mode = 'dynamo') {
      const pylonOffsets = [-24, 24];
      const baseAngles = [-1.88, -1.26]; // Fanned upward-left and upward-right (~-108 deg and ~-72 deg)
      for (let p = 0; p < 2; p++) {
        const lx = cx + pylonOffsets[p];
        const ly = cy - 6;
        const angle = baseAngles[p] + (Math.random() - 0.5) * 0.15;
        const initSpeed = 7.5 + Math.random() * 2.0;
        this.missiles.push({
          x: lx,
          y: ly,
          vx: Math.cos(angle) * initSpeed,
          vy: Math.sin(angle) * initSpeed,
          angle: angle,
          speed: initSpeed,
          mode: mode || 'dynamo',
          stage: 1, // Stage 1: Cold ejection coast; Stage 2: Solid rocket booster ignition
          smoke: [],
          target: null,
          life: 0,
          maxLife: 150
        });

        // Launch Muzzle Flash & Cold-Gas Launch Exhaust Puff
        const flashColor = (mode === 'meteor') ? '#f97316' : (mode === 'helix' ? '#22d3ee' : '#38bdf8');
        this.launchFlashes.push({
          x: lx,
          y: ly,
          r: 6,
          maxR: 20,
          alpha: 1.0,
          color: flashColor
        });
        for (let sp = 0; sp < 4; sp++) {
          const sAng = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
          const sSpd = 1.2 + Math.random() * 2.4;
          this.grazeSparks.push({
            x: lx,
            y: ly,
            vx: Math.cos(sAng) * sSpd,
            vy: Math.sin(sAng) * sSpd,
            color: (mode === 'meteor') ? 'rgba(254, 240, 138, 0.9)' : ((mode === 'helix') ? 'rgba(167, 243, 208, 0.85)' : 'rgba(224, 242, 254, 0.85)'),
            life: 0,
            maxLife: 14 + Math.random() * 8
          });
        }
      }
    },

    updateAndDrawMissiles(ctx, dtScale, now, state) {
      const dt = Math.max(0.25, Math.min(2.5, dtScale));

      // 1. Process Missile Salvo Queue (Rapid Ripple Launch from Core Pylons)
      if (this.missileSalvoQueue > 0 && this.salvoOrigin) {
        this.salvoTimer = (this.salvoTimer || 0) + dt;
        if (this.salvoTimer >= 2.4) {
          this.salvoTimer = 0;
          this._launchMissilePair(this.salvoOrigin.x, this.salvoOrigin.y, now, this.salvoMode || state.catcherType || 'dynamo');
          this.missileSalvoQueue -= 2;
        }
      }

      // 2. Render & Update Launch Muzzle Flashes
      for (let fIdx = this.launchFlashes.length - 1; fIdx >= 0; fIdx--) {
        const lf = this.launchFlashes[fIdx];
        lf.r += (lf.maxR - lf.r) * 0.35 * dt;
        lf.alpha -= 0.14 * dt;
        if (lf.alpha <= 0) {
          this.launchFlashes.splice(fIdx, 1);
          continue;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const lfR = Math.max(2, lf.r);
        const lfCol = lf.color || '#38bdf8';
        const lfRgb = (lfCol === '#f97316') ? '249, 115, 22'
          : (lfCol === '#22d3ee') ? '34, 211, 238'
          : (lfCol === '#fbbf24') ? '251, 191, 36'
          : '56, 189, 248';
        const lfGrad = ctx.createRadialGradient(lf.x, lf.y, lfR * 0.15, lf.x, lf.y, lfR);
        lfGrad.addColorStop(0.0, `rgba(255, 255, 255, ${lf.alpha * 0.32})`);
        lfGrad.addColorStop(0.45, `rgba(${lfRgb}, ${lf.alpha * 0.55})`);
        lfGrad.addColorStop(0.76, `rgba(255, 255, 255, ${lf.alpha * 0.78})`);
        lfGrad.addColorStop(0.90, `rgba(${lfRgb}, ${lf.alpha * 0.35})`);
        lfGrad.addColorStop(1.0, `rgba(${lfRgb}, 0)`);
        ctx.fillStyle = lfGrad;
        ctx.beginPath();
        ctx.arc(lf.x, lf.y, lfR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (this.missiles.length === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let mIdx = this.missiles.length - 1; mIdx >= 0; mIdx--) {
        const m = this.missiles[mIdx];
        const mMode = m.mode || 'dynamo';
        m.life += dt;

        // Stage 2: Main Solid Rocket Booster Ignition after 7 frames (~0.12s)
        if (m.stage === 1 && m.life >= 7) {
          m.stage = 2;
          this.launchFlashes.push({
            x: m.x,
            y: m.y,
            r: 5,
            maxR: 16,
            alpha: 0.95,
            color: (mMode === 'meteor') ? '#f97316' : ((mMode === 'helix') ? '#22d3ee' : '#fbbf24')
          });
        }

        // Target Acquisition & Proportional Navigation (Prioritize Hazards to Protect Core!)
        let bestDist = 9999;
        let bestTarget = null;
        for (let p of state.particles) {
          if (p.hasDetonated) continue;
          const d = Math.hypot(p.x - m.x, p.y - m.y);
          const isApexHazard = (p.nodeClass === 'corruptor_laser' || p.nodeClass === 'hyper_comet');
          const weight = isApexHazard ? 0.35 : (isHazardNode(p.nodeClass) ? 0.50 : 1.0);
          if (d * weight < bestDist) {
            bestDist = d * weight;
            bestTarget = p;
          }
        }

        if (bestTarget && m.stage === 2) {
          const desiredAngle = Math.atan2(bestTarget.y - m.y, bestTarget.x - m.x);
          let diff = desiredAngle - m.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const maxTurn = 0.28 * dt;
          m.angle += Math.max(-maxTurn, Math.min(maxTurn, diff));
        }

        // High-Thrust Rocket Propulsion (Accelerates up to 26px/frame)
        if (m.stage === 2) {
          m.speed = Math.min(26.0, m.speed + 1.20 * dt);
        } else {
          m.speed = Math.max(5.5, m.speed - 0.20 * dt);
        }
        m.vx = Math.cos(m.angle) * m.speed;
        m.vy = Math.sin(m.angle) * m.speed;
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // Expanding Mode-Specific Smoke & Contrail Puffs
        let smokeColor = 'rgba(240, 249, 255, 0.85)';
        if (m.stage === 2) {
          if (mMode === 'meteor') {
            smokeColor = (Math.random() < 0.35) ? 'rgba(249, 115, 22, 0.85)' : 'rgba(120, 113, 108, 0.75)';
          } else if (mMode === 'helix') {
            smokeColor = (Math.random() < 0.35) ? 'rgba(34, 211, 238, 0.80)' : 'rgba(244, 114, 182, 0.70)';
          } else {
            smokeColor = (Math.random() < 0.35) ? 'rgba(56, 189, 248, 0.85)' : 'rgba(192, 132, 252, 0.70)';
          }
        }

        m.smoke.push({
          x: m.x - Math.cos(m.angle) * 11,
          y: m.y - Math.sin(m.angle) * 11,
          size: 2.8,
          alpha: 0.85,
          color: smokeColor
        });

        for (let s = m.smoke.length - 1; s >= 0; s--) {
          const sm = m.smoke[s];
          sm.size += 0.38 * dt;
          sm.alpha -= 0.055 * dt;
          if (sm.alpha <= 0) {
            m.smoke.splice(s, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
          ctx.fillStyle = sm.color;
          ctx.globalAlpha = sm.alpha * 0.70;
          ctx.fill();
        }

        // Draw Mode-Specific Seeking Missile (Matching Chrome Core Variant!)
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);
        ctx.globalAlpha = 1.0;

        // Rocket Motor Flame & Mach Shock Diamonds
        if (m.stage === 2) {
          ctx.beginPath();
          ctx.moveTo(-7, -2.2);
          ctx.lineTo(-17 - Math.random() * 5, 0);
          ctx.lineTo(-7, 2.2);
          ctx.closePath();
          if (mMode === 'meteor') {
            ctx.fillStyle = '#f97316';
          } else if (mMode === 'helix') {
            ctx.fillStyle = (Math.random() < 0.5) ? '#22d3ee' : '#ec4899';
          } else {
            ctx.fillStyle = '#38bdf8';
          }
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-7, -1.2);
          ctx.lineTo(-12, 0);
          ctx.lineTo(-7, 1.2);
          ctx.closePath();
          ctx.fillStyle = (mMode === 'meteor') ? '#fef08a' : '#ffffff';
          ctx.fill();
        }

        if (mMode === 'meteor') {
          // METEOR MISSILE: Dark Obsidian Volcanic Basalt with Molten Magma Seams
          ctx.fillStyle = '#292524';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(-7, -2.8, 14, 5.6, 1.5); else ctx.rect(-7, -2.8, 14, 5.6);
          ctx.fill();

          // Magma fissure line along fuselage spine
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Molten Gold Tungsten Penetrator Nosecone
          ctx.beginPath();
          ctx.moveTo(7, -2.8);
          ctx.lineTo(14, 0);
          ctx.lineTo(7, 2.8);
          ctx.closePath();
          ctx.fillStyle = '#fbbf24';
          ctx.fill();

          // Chiseled Volcanic Basalt Fins with Magma Edging
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(-5, -2.8); ctx.lineTo(-10, -7.0); ctx.lineTo(-7, -2.8);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-5, 2.8); ctx.lineTo(-10, 7.0); ctx.lineTo(-7, 2.8);
          ctx.closePath(); ctx.fill();

          // Forward Canards
          ctx.beginPath();
          ctx.moveTo(3, -2.8); ctx.lineTo(1, -5.5); ctx.lineTo(5, -2.8);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(3, 2.8); ctx.lineTo(1, 5.5); ctx.lineTo(5, 2.8);
          ctx.closePath(); ctx.fill();

        } else if (mMode === 'helix') {
          // HELIX MISSILE: Pearlescent Teal Bio-Resonance Body with Iridescent Helical Stripe
          ctx.fillStyle = '#0f766e';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(-7, -2.6, 14, 5.2, 1.5); else ctx.rect(-7, -2.6, 14, 5.2);
          ctx.fill();

          // Helical spiral wave
          ctx.beginPath();
          ctx.moveTo(-6, -1.5);
          ctx.quadraticCurveTo(0, 2.0, 6, -1.5);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Luminous Aquamarine Crystal Radome Nosecone
          ctx.beginPath();
          ctx.moveTo(7, -2.6);
          ctx.lineTo(13.5, 0);
          ctx.lineTo(7, 2.6);
          ctx.closePath();
          ctx.fillStyle = '#67e8f9';
          ctx.fill();

          // Iridescent Magenta Bio-Crystal Fins
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.moveTo(-5, -2.6); ctx.lineTo(-9, -6.5); ctx.lineTo(-7, -2.6);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-5, 2.6); ctx.lineTo(-9, 6.5); ctx.lineTo(-7, 2.6);
          ctx.closePath(); ctx.fill();

          // Forward Aquamarine Canards
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.moveTo(3, -2.6); ctx.lineTo(1, -5.2); ctx.lineTo(5, -2.6);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(3, 2.6); ctx.lineTo(1, 5.2); ctx.lineTo(5, 2.6);
          ctx.closePath(); ctx.fill();

        } else {
          // DYNAMO MISSILE: Deep Cobalt & Amethyst Quantum Arc Dart
          ctx.fillStyle = '#312e81';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(-7, -2.6, 14, 5.2, 1.5); else ctx.rect(-7, -2.6, 14, 5.2);
          ctx.fill();

          // Cyan quantum circuit line along spine
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // High-Tech Forward Ogive Radome Nosecone (Electric Cyan & White)
          ctx.beginPath();
          ctx.moveTo(7, -2.6);
          ctx.lineTo(13, 0);
          ctx.lineTo(7, 2.6);
          ctx.closePath();
          ctx.fillStyle = '#e0f2fe';
          ctx.fill();

          // Swept Delta Quantum Stabilizer Fins at Aft
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(-5, -2.6); ctx.lineTo(-9, -6.5); ctx.lineTo(-7, -2.6);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-5, 2.6); ctx.lineTo(-9, 6.5); ctx.lineTo(-7, 2.6);
          ctx.closePath(); ctx.fill();

          // 2 Forward Amethyst Canard Fins
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.moveTo(3, -2.6); ctx.lineTo(1, -5.2); ctx.lineTo(5, -2.6);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(3, 2.6); ctx.lineTo(1, 5.2); ctx.lineTo(5, 2.6);
          ctx.closePath(); ctx.fill();
        }

        ctx.restore();

        // Check Impact with Falling Targets (Neutralize Hazards & Auto-Claim Collectibles)
        let hit = false;
        for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
          const pt = state.particles[pIdx];
          if (pt.hasDetonated) continue;
          const hitDist = Math.hypot(pt.x - m.x, pt.y - m.y);
          if (hitDist < 32) {
            hit = true;
            pt.hasDetonated = true;

            // Supersonic Kinetic Blast Ring
            const blastColor = (mMode === 'meteor') ? '#f97316' : ((mMode === 'helix') ? '#22d3ee' : '#38bdf8');
            this.launchFlashes.push({
              x: pt.x,
              y: pt.y,
              r: 10,
              maxR: 44,
              alpha: 1.0,
              color: isHazardNode(pt.nodeClass) ? blastColor : '#fbbf24'
            });

            if (isHazardNode(pt.nodeClass)) {
              // Bad node vaporized by tactical missile: disappears cleanly with zero harm to player core!
              const wasChargingCorruptor = (pt.nodeClass === 'corruptor_laser' && pt.laserState === 'charging');
              const isApex = (pt.nodeClass === 'corruptor_laser' || pt.nodeClass === 'hyper_comet');
              const bonusPts = wasChargingCorruptor ? 450 : (isApex ? 300 : 200);
              state.score += bonusPts;
              if (wasChargingCorruptor) {
                state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 15);
                if (state.pulseMeter >= 100) state.isPulseReady = true;
              }
              this.triggerGraze(pt.x, pt.y, now);
              state.floatingTexts.push({
                x: pt.x, y: pt.y,
                text: wasChargingCorruptor ? '+450 SALVO INTERRUPTED!' : (isApex ? `+${bonusPts} THREAT VAPORIZED` : '+200 NEUTRALIZED'),
                color: wasChargingCorruptor ? '#fbbf24' : blastColor,
                alpha: 1.0,
                startTime: now
              });
              audio.playMissileHit();
              updateHeaderUI();
            } else {
              // Good node intercepted by missile: immediately counts as an authentic combo addition!
              const pts = 300 * state.combo;
              state.score += pts;
              const prevCombo = state.combo;
              state.combo = Math.min(50, state.combo + 1);

              // Recalculate Core Evolution Tier immediately based on updated combo
              if (state.combo >= 28) {
                state.coreTier = 5;
                state.isOverdrive = true;
              } else if (state.combo >= 21) {
                state.coreTier = 4;
                state.isOverdrive = true;
              } else if (state.combo >= 14) {
                state.coreTier = 3;
                state.isOverdrive = false;
              } else if (state.combo >= 7) {
                state.coreTier = 2;
                state.isOverdrive = false;
              } else {
                state.coreTier = 1;
                state.isOverdrive = false;
              }
              CoreKinematics.continuousTier = state.coreTier;

              // Sound cue for combo/tier advance
              if (prevCombo < 21 && state.combo >= 21) {
                audio.playOverdriveFanfare();
              } else if (prevCombo < 28 && state.combo >= 28) {
                audio.playTier5Ascension();
              } else {
                audio.playCorrectChime(state.combo);
              }

              state.floatingTexts.push({
                x: pt.x, y: pt.y,
                text: `COMBO ${state.combo}x (+${pts})`,
                color: blastColor,
                alpha: 1.0,
                startTime: now
              });

              if (pt.nodeClass === 'cluster') {
                state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
              } else if (pt.nodeClass === 'supercharge') {
                state.applyBuff('hyper', 'HYPER SURGE', '#fbbf24', '⚡', 5000, now);
              } else if (pt.nodeClass === 'chronos') {
                state.applyBuff('chronos', 'CHRONOS STASIS', '#22d3ee', '⏳', 4500, now);
              } else if (pt.nodeClass === 'singularity') {
                state.applyBuff('singularity', 'GRAVITON VACUUM', '#38bdf8', '🧲', 3500, now);
              } else if (pt.nodeClass === 'catalyst') {
                const targetTierCombo = { 2: 7, 3: 14, 4: 21, 5: 28 };
                state.coreTier = Math.min(5, state.coreTier + 1);
                state.combo = Math.max(state.combo, targetTierCombo[state.coreTier] || state.combo);
                state.isOverdrive = (state.coreTier >= 4);
                state.reflexLives = Math.min(3, state.reflexLives + 1);
                renderReflexShields();
                state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
                if (state.coreTier === 5) audio.playTier5Ascension();
                else audio.playOverdriveFanfare();
              } else if (pt.nodeClass === 'shield') {
                state.applyBuff('shield', 'AEGIS SHIELD', '#f59e0b', '🛡️', 5000, now);
              } else if (pt.nodeClass === 'missiles') {
                state.applyBuff('missiles', 'ALLIED MISSILES', '#38bdf8', '🚀', 4000, now);
                this.fireMissiles(m.x, m.y, now, state.particles, mMode);
              }

              updateHeaderUI();
            }

            state.particles.splice(pIdx, 1);
            break;
          }
        }

        if (hit || m.life >= m.maxLife || m.x < -70 || m.x > ctx.canvas.width + 70 || m.y < -70 || m.y > ctx.canvas.height + 70) {
          this.missiles.splice(mIdx, 1);
        }
      }
      ctx.restore();
    },

    drawAegisForcefield(ctx, cx, cy, u, now, timeLeft = 5000, mode = 'dynamo') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = 'lighter';

      // 1. High-Visibility Enveloping Spherical Dome
      const baseRadius = Math.max(92, 142 * u);
      const pulse = 1.0 + 0.045 * Math.sin(now * 0.008);
      const r = baseRadius * pulse;
      const rot = now * 0.0028;

      // Warning pulse when < 1.2s remaining
      const isExpiring = timeLeft < 1200;
      const warnPulse = isExpiring ? (0.5 + 0.5 * Math.sin(now * 0.025)) : 1.0;
      const secondsLeft = Math.max(0, (timeLeft / 1000)).toFixed(1);

      if (mode === 'dynamo' || mode === 'realm') {
        // ─── CHROME DYNAMO: QUANTUM FARADAY CAGE AEGIS ───
        // High-frequency electromagnetic containment grid & perimeter lightning
        const grad = ctx.createRadialGradient(0, 0, r * 0.40, 0, 0, r * 1.08);
        grad.addColorStop(0.0, 'rgba(0, 240, 255, 0.03)');
        grad.addColorStop(0.60, `rgba(56, 189, 248, ${0.16 * warnPulse})`);
        grad.addColorStop(0.85, `rgba(14, 165, 233, ${0.30 * warnPulse})`);
        grad.addColorStop(0.96, `rgba(224, 242, 254, ${0.60 * warnPulse})`);
        grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
        ctx.fill();

        // 4 Rotating Electromagnetic Faraday Latitudinal Rings
        for (let l = -2; l <= 2; l++) {
          const yOff = (l / 2.5) * (r * 0.72);
          const latR = Math.sqrt(Math.max(0, r * r - yOff * yOff));
          ctx.save();
          ctx.translate(0, yOff);
          ctx.beginPath();
          ctx.ellipse(0, 0, latR, latR * 0.36, rot * (l % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(103, 232, 249, ${(0.55 + 0.35 * Math.abs(l / 2.5)) * warnPulse})`;
          ctx.lineWidth = 1.8 * Math.max(0.7, u);
          ctx.stroke();

          // Induction Polar Vertices
          for (let v = 0; v < 4; v++) {
            const va = rot * (l % 2 === 0 ? 1 : -1) + v * (Math.PI / 2);
            const vx = Math.cos(va) * latR;
            const vy = Math.sin(va) * latR * 0.36;
            ctx.beginPath();
            ctx.arc(vx, vy, 2.2 * Math.max(0.7, u), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
          ctx.restore();
        }

        // Surface-Crawling Faraday Electrical Arcs
        const numArcs = 5;
        for (let a = 0; a < numArcs; a++) {
          const arcBase = now * 0.0055 + a * (Math.PI * 2 / numArcs);
          const arcSpan = 0.75 + 0.25 * Math.sin(now * 0.009 + a);
          ctx.beginPath();
          for (let s = 0; s <= 10; s++) {
            const t = s / 10;
            const ang = arcBase + t * arcSpan;
            const jitter = (Math.sin(now * 0.035 + s * 2.3 + a) - 0.5) * 6.0;
            const rad = r + jitter;
            const ax = Math.cos(ang) * rad;
            const ay = Math.sin(ang) * rad;
            if (s === 0) ctx.moveTo(ax, ay); else ctx.lineTo(ax, ay);
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.90 * warnPulse})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }

        // Heavy Cyan/White Barrier Rim
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.92 * warnPulse})`;
        ctx.lineWidth = 3.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 242, 254, ${0.65 * warnPulse})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        this._drawAegisHudBadge(ctx, r, u, `🛡️ FARADAY AEGIS · ${secondsLeft}s`, timeLeft, isExpiring, '#00f0ff', '#38bdf8', 'rgba(14, 165, 233, 0.40)');

      } else if (mode === 'helix') {
        // ─── CHROME HELIX: HARMONIC BIO-LATTICE BARRIER ───
        // Interlocking crystalline aquamarine and rose-quartz helical boundary ribbons
        const grad = ctx.createRadialGradient(0, 0, r * 0.40, 0, 0, r * 1.08);
        grad.addColorStop(0.0, 'rgba(34, 211, 238, 0.03)');
        grad.addColorStop(0.60, `rgba(110, 231, 183, ${0.16 * warnPulse})`);
        grad.addColorStop(0.85, `rgba(34, 211, 238, ${0.30 * warnPulse})`);
        grad.addColorStop(0.96, `rgba(254, 240, 138, ${0.55 * warnPulse})`);
        grad.addColorStop(1.0, 'rgba(34, 211, 238, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
        ctx.fill();

        // Hexagonal Prismatic Crystal Lattice Ribs
        for (let l = -2; l <= 2; l++) {
          const yOff = (l / 2.6) * (r * 0.74);
          const latR = Math.sqrt(Math.max(0, r * r - yOff * yOff));
          ctx.save();
          ctx.translate(0, yOff);
          ctx.rotate(rot * (l % 2 === 0 ? 1 : -1));
          ctx.beginPath();
          for (let h = 0; h < 6; h++) {
            const ha = h * Math.PI / 3;
            const hx = Math.cos(ha) * latR;
            const hy = Math.sin(ha) * latR * 0.38;
            if (h === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(110, 231, 183, ${(0.55 + 0.35 * Math.abs(l / 2.6)) * warnPulse})`;
          ctx.lineWidth = 1.9 * Math.max(0.7, u);
          ctx.stroke();

          // Diamond Node Vertices
          for (let h = 0; h < 6; h++) {
            const ha = h * Math.PI / 3;
            const hx = Math.cos(ha) * latR;
            const hy = Math.sin(ha) * latR * 0.38;
            ctx.beginPath();
            ctx.arc(hx, hy, 2.5 * Math.max(0.7, u), 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a';
            ctx.fill();
          }
          ctx.restore();
        }

        // Twin Counter-Rotating Helical Perimeter Boundary Ribbons
        const ribbonRot = now * 0.0035;
        for (let strand = 0; strand < 2; strand++) {
          const sOff = strand * Math.PI;
          ctx.beginPath();
          for (let k = 0; k <= 32; k++) {
            const t = k / 32;
            const ang = ribbonRot + t * Math.PI * 2;
            const zMod = Math.sin(ang * 3 + sOff) * 12 * u;
            const rad = r + zMod;
            const kx = Math.cos(ang) * rad;
            const ky = Math.sin(ang) * rad * 0.75;
            if (k === 0) ctx.moveTo(kx, ky); else ctx.lineTo(kx, ky);
          }
          ctx.closePath();
          ctx.strokeStyle = strand === 0 ? `rgba(34, 211, 238, ${0.80 * warnPulse})` : `rgba(254, 240, 138, ${0.75 * warnPulse})`;
          ctx.lineWidth = 2.0 * Math.max(0.7, u);
          ctx.stroke();
        }

        // Outer Bio-Lattice Barrier Rim
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.90 * warnPulse})`;
        ctx.lineWidth = 3.2;
        ctx.stroke();

        this._drawAegisHudBadge(ctx, r, u, `🛡️ HARMONIC AEGIS · ${secondsLeft}s`, timeLeft, isExpiring, '#22d3ee', '#6ee7b7', 'rgba(13, 148, 136, 0.40)');

      } else {
        // ─── CHROME METEOR: CALDERA THERMAL MAGMA AEGIS ───
        // Volcanic basalt tectonic shield plates floating over molten magma envelope
        const grad = ctx.createRadialGradient(0, 0, r * 0.38, 0, 0, r * 1.08);
        grad.addColorStop(0.0, 'rgba(254, 240, 138, 0.05)');
        grad.addColorStop(0.55, `rgba(249, 115, 22, ${0.22 * warnPulse})`);
        grad.addColorStop(0.85, `rgba(234, 88, 12, ${0.38 * warnPulse})`);
        grad.addColorStop(0.96, `rgba(254, 240, 138, ${0.68 * warnPulse})`);
        grad.addColorStop(1.0, 'rgba(234, 88, 12, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
        ctx.fill();

        // 8 Interlocking Basalt Tectonic Plates around the Perimeter
        const numPlates = 8;
        const plateRot = now * 0.002;
        ctx.save();
        ctx.rotate(plateRot);
        for (let p = 0; p < numPlates; p++) {
          const pAng1 = p * (Math.PI * 2 / numPlates) + 0.04;
          const pAng2 = (p + 1) * (Math.PI * 2 / numPlates) - 0.04;
          const rPlateIn = r * 0.82;
          const rPlateOut = r * 1.02;

          ctx.beginPath();
          ctx.arc(0, 0, rPlateOut, pAng1, pAng2);
          ctx.arc(0, 0, rPlateIn, pAng2, pAng1, true);
          ctx.closePath();
          ctx.fillStyle = 'rgba(28, 25, 23, 0.65)';
          ctx.fill();
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.85 * warnPulse})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Incandescent Magma Fissure in the Center of each Plate
          const midAng = (pAng1 + pAng2) * 0.5;
          const fX1 = Math.cos(midAng) * rPlateIn;
          const fY1 = Math.sin(midAng) * rPlateIn;
          const fX2 = Math.cos(midAng) * rPlateOut;
          const fY2 = Math.sin(midAng) * rPlateOut;
          ctx.beginPath();
          ctx.moveTo(fX1, fY1);
          ctx.lineTo(fX2, fY2);
          ctx.strokeStyle = `rgba(254, 240, 138, ${0.92 * warnPulse})`;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }
        ctx.restore();

        // Molten Solar Gold Perimeter Ring
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.95 * warnPulse})`;
        ctx.lineWidth = 3.6;
        ctx.stroke();

        this._drawAegisHudBadge(ctx, r, u, `🛡️ CALDERA AEGIS · ${secondsLeft}s`, timeLeft, isExpiring, '#fbbf24', '#f97316', 'rgba(194, 65, 12, 0.40)');
      }

      // Shield Deflection Shockwave Flash (Shared Across Modes)
      if (this.shieldDeflectFlash > 0.02) {
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.1 + (1.0 - this.shieldDeflectFlash) * 0.4), 0, Math.PI * 2);
        const flashColor = (mode === 'dynamo' || mode === 'realm') ? '#38bdf8' : (mode === 'helix' ? '#22d3ee' : '#fbbf24');
        ctx.strokeStyle = flashColor;
        ctx.globalAlpha = this.shieldDeflectFlash * 0.95;
        ctx.lineWidth = 5.0;
        ctx.stroke();
      }

      ctx.restore();
    },

    _drawAegisHudBadge(ctx, r, u, badgeText, timeLeft, isExpiring, mainColor, borderColor, bgColor) {
      ctx.save();
      const hudY = -r - 20;
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const bWidth = ctx.measureText(badgeText).width;

      ctx.fillStyle = isExpiring ? 'rgba(239, 68, 68, 0.45)' : bgColor;
      ctx.strokeStyle = isExpiring ? '#f87171' : borderColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-bWidth / 2 - 10, hudY - 10, bWidth + 20, 20, 10);
      else ctx.rect(-bWidth / 2 - 10, hudY - 10, bWidth + 20, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, hudY);

      // Remaining Time Radial Gauge
      const timeFrac = Math.max(0, Math.min(1.0, timeLeft / 5000));
      ctx.beginPath();
      ctx.arc(-bWidth / 2 - 18, hudY, 6, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * timeFrac);
      ctx.strokeStyle = isExpiring ? '#ef4444' : mainColor;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();
    },

    drawCursorReticle(ctx, cx, cy, u, now) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = 'lighter';

      const retR = 48 * u;
      const rot = now * 0.0018;

      for (let b = 0; b < 4; b++) {
        const ba = rot + (b * Math.PI / 2);
        const bx = Math.cos(ba) * retR;
        const by = Math.sin(ba) * retR;
        const armLen = 8 * u;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(ba);
        ctx.beginPath();
        ctx.moveTo(-armLen, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, -armLen);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.lineWidth = 1.4 * u;
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, 1.8 * u, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
      ctx.fill();

      ctx.restore();
    },

    drawThrusterPlumes(ctx, u) {
      if (this.thrusterPlumes.length === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.thrusterPlumes.length; i++) {
        const tp = this.thrusterPlumes[i];
        const alpha = Math.max(0, 1.0 - tp.life / tp.maxLife);
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
        ctx.fillStyle = tp.color;
        ctx.globalAlpha = alpha * 0.70;
        ctx.fill();
      }
      ctx.restore();
    },

    drawGrazeSparks(ctx, u) {
      if (this.grazeSparks.length === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let gs of this.grazeSparks) {
        const alpha = Math.max(0, 1.0 - gs.life / gs.maxLife);
        ctx.beginPath();
        ctx.arc(gs.x, gs.y, 2.2 * u, 0, Math.PI * 2);
        ctx.fillStyle = gs.color || '#38bdf8';
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.restore();
    },

    triggerCaptureEffect(mode, catcherX, catcherY, nodeX, nodeY, now) {
      const dxContact = Math.max(-68, Math.min(68, nodeX - catcherX));
      const dyContact = Math.max(-68, Math.min(-24, nodeY - catcherY));

      // UPGRADE 5: Tier IV Overdrive Harmonic Resonance Flash on every catch in Tier IV!
      if (this.continuousTier >= 3.6) {
        this.overdriveFlash = 0.95;
        this.ascensionRings.push({
          tierReached: 4,
          radius: 42,
          maxRadius: 220,
          alpha: 0.85,
          mode: (mode === 'realm') ? 'dynamo' : mode
        });
      }

      if (mode === 'dynamo' || mode === 'realm') {
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
        this.wingRipples.push({
          startTime: now,
          duration: 560,
          progress: 0,
          contactX: dxContact
        });
      } else if (mode === 'meteor') {
        this.meteorShieldRecoil.y = 9.5;
        this.meteorShieldRecoil.vy = 2.8;
        this.meteorShieldRecoil.tilt = Math.max(-0.22, Math.min(0.22, dxContact * 0.0042));
        this.meteorShieldRecoil.vTilt = this.meteorShieldRecoil.tilt * 0.25;
        this.meteorShieldRecoil.flash = 1.0;

        const impactWorldX = catcherX + dxContact * 0.65;
        const impactWorldY = catcherY - 46;
        for (let k = 0; k < 14; k++) {
          const spreadAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.35 + (dxContact * 0.005);
          const speed = 3.4 + Math.random() * 4.8;
          this.impactCinders.push({
            x: impactWorldX + (Math.random() - 0.5) * 18,
            y: impactWorldY + (Math.random() - 0.5) * 6,
            vx: Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed - 1.6,
            size: 2.2 + Math.random() * 2.8,
            isCyanSpark: (k % 4 === 0),
            life: 0,
            maxLife: 22 + Math.random() * 16
          });
        }
      }
    },

    emitNodeWorldStreaks(p, targetR, mode, isHazard, dtScale, now) {
      if (!p.lastStreakEmit) p.lastStreakEmit = now - Math.random() * 100;

      if (!isHazard) {
        // ─── GOOD COLLECTIBLE NODES: SUBTLE EMBER DRIFT (ULTRA-LEAN & LAG-FREE) ───
        // Particles linger where released and fade snappily (~160ms). Wide emission intervals
        // (260ms) guarantee crisp readability of falling nodes, badges, and zero particle clutter.
        const emitInterval = 260;
        if (now - p.lastStreakEmit < emitInterval) return;
        p.lastStreakEmit = now;

        if (mode === 'dynamo' || mode === 'realm') {
          // Chrome Dynamo: Vertical Warp Speedlines trailing above falling node (matches user reference image!)
          p.streakSide = (p.streakSide === 1) ? -1 : 1;
          const side = p.streakSide;
          const flankFrac = 0.35 + Math.random() * 0.45;
          const sx = p.x + side * flankFrac * targetR;
          const sy = p.y - (0.35 + Math.random() * 0.35) * targetR;
          const len = (0.65 + Math.random() * 0.45) * targetR;

          this.worldStreaks.push({
            type: 'speedline',
            kind: 'dynamoSpeedline',
            x: sx,
            y: sy,
            vy: p.speed * 0.12,
            len: len,
            life: 0,
            maxLife: 14 + Math.random() * 6
          });
        } else if (mode === 'helix') {
          // Chrome Helix: Micro cyan/lilac fleck turning above the glass DNA orb
          const spawnX = p.x + (Math.random() - 0.5) * targetR * 0.45;
          const spawnY = p.y - targetR * (0.80 + Math.random() * 0.15);
          this.worldStreaks.push({
            type: 'ember',
            kind: 'helixFleck',
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -0.12 - Math.random() * 0.12,
            size: 0.85 + Math.random() * 0.35,
            life: 0,
            maxLife: 10 + Math.random() * 4
          });
        } else {
          // Chrome Meteor: Micro orange cinder from glowing fissures cooling to dark red
          const crackAng = Math.random() * Math.PI * 2;
          const crackDist = targetR * (0.45 + Math.random() * 0.35);
          const spawnX = p.x + Math.cos(crackAng) * crackDist;
          const spawnY = p.y + Math.sin(crackAng) * crackDist;
          this.worldStreaks.push({
            type: 'ember',
            kind: 'meteorCinder',
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -0.10 - Math.random() * 0.12,
            size: 0.85 + Math.random() * 0.35,
            life: 0,
            maxLife: 10 + Math.random() * 4
          });
        }

      } else {
        // ─── BAD HAZARD NODES: ULTRA-LEAN ATMOSPHERIC SIGNATURES (ZERO BLURRY CLUTTER) ───
        const emitInterval = 280;
        if (now - p.lastStreakEmit < emitInterval) return;
        p.lastStreakEmit = now;

        if (mode === 'dynamo' || mode === 'realm') {
          // Broken Arc: Short, clean magenta micro-discharge flickering along recent path
          this.worldStreaks.push({
            type: 'hazard',
            kind: 'brokenArcSpark',
            x: p.x + (Math.random() - 0.5) * targetR * 0.35,
            y: p.y - targetR * (0.85 + Math.random() * 0.45),
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.18 - Math.random() * 0.15,
            len: 4 + Math.random() * 4,
            angle: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5,
            life: 0,
            maxLife: 10 + Math.random() * 4
          });
        } else if (mode === 'helix') {
          // Facet Dust: Single micro ruby grain behind the crystal
          this.worldStreaks.push({
            type: 'hazard',
            kind: 'facetDust',
            x: p.x + (Math.random() - 0.5) * targetR * 0.45,
            y: p.y - targetR * (0.4 + Math.random() * 0.4),
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.15 - Math.random() * 0.15,
            size: 0.85 + Math.random() * 0.35,
            life: 0,
            maxLife: 10 + Math.random() * 4
          });
        } else {
          // Ash Flakes: Single micro charcoal flake from rotating basalt spikes
          const flakeAng = Math.random() * Math.PI * 2;
          const flakeDist = targetR * (0.7 + Math.random() * 0.25);
          this.worldStreaks.push({
            type: 'hazard',
            kind: 'ashFlake',
            x: p.x + Math.cos(flakeAng) * flakeDist,
            y: p.y + Math.sin(flakeAng) * flakeDist,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.15 - Math.random() * 0.15,
            size: 1.2 + Math.random() * 0.6,
            life: 0,
            maxLife: 10 + Math.random() * 4
          });
        }
      }
    },

    updateAndDrawWorldStreaks(ctx, dtScale) {
      if (this.worldStreaks.length === 0) return;
      // High-refresh performance guard: hard-cap total world streaks to 18 particles max
      if (this.worldStreaks.length > 18) {
        this.worldStreaks.splice(0, this.worldStreaks.length - 18);
      }
      const dt = Math.max(0.25, Math.min(2.5, dtScale));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = this.worldStreaks.length - 1; i >= 0; i--) {
        const st = this.worldStreaks[i];
        st.x += (st.vx || 0) * dt;
        st.y += (st.vy || 0) * dt;
        st.life += dt;
        if (st.life >= st.maxLife) {
          this.worldStreaks.splice(i, 1);
          continue;
        }

        const prog = st.life / st.maxLife;
        const alpha = Math.sin(prog * Math.PI); // smooth bell fade
        if (alpha <= 0.03) continue;

        if (st.type === 'speedline' || st.kind === 'dynamoSpeedline') {
          // Soft vertical cyan motion speedline (matches user reference image!)
          const syBot = st.y;
          const syTop = syBot - st.len;
          const grad = ctx.createLinearGradient(st.x, syTop, st.x, syBot);
          grad.addColorStop(0.0, 'rgba(0, 240, 255, 0)');
          grad.addColorStop(0.45, `rgba(56, 189, 248, ${alpha * 0.72})`);
          grad.addColorStop(0.85, `rgba(224, 242, 254, ${alpha * 0.90})`);
          grad.addColorStop(1.0, 'rgba(0, 240, 255, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(st.x, syTop);
          ctx.lineTo(st.x, syBot);
          ctx.stroke();

        } else if (st.type === 'ember') {
          // ─── EMBER DRIFT PARTICLES (DIRECT ZERO-ALLOC RENDERING) ───
          if (st.kind === 'dynamoSpark') {
            // Ultra-delicate violet-white micro-spark
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size * (1.0 - prog * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.88})`;
            ctx.fill();

          } else if (st.kind === 'helixFleck') {
            // Micro cyan / lilac fleck
            const isLilac = (Math.floor(st.x) % 2 === 0);
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size * (1.0 - prog * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = isLilac ? `rgba(216, 180, 254, ${alpha * 0.80})` : `rgba(56, 189, 248, ${alpha * 0.78})`;
            ctx.fill();

          } else if (st.kind === 'meteorCinder') {
            // Micro orange cinder
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size * (1.0 - prog * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.82})`;
            ctx.fill();
          }

        } else if (st.type === 'hazard') {
          // ─── HAZARD PARTICLES (LIGHTWEIGHT VECTOR RENDER) ───
          if (st.kind === 'brokenArcSpark') {
            // Short clean magenta micro-arc segment
            ctx.beginPath();
            ctx.moveTo(st.x, st.y);
            ctx.lineTo(st.x + Math.sin(st.angle || 0) * (st.len * 0.5), st.y + Math.cos(st.angle || 0) * (st.len * 0.5));
            ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 0.82})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

          } else if (st.kind === 'facetDust') {
            // Micro ruby dust grain
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(225, 29, 72, ${alpha * 0.78})`;
            ctx.fill();

          } else if (st.kind === 'ashFlake') {
            // Micro charcoal ash flake
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size * 0.75, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(71, 85, 105, ${alpha * 0.78})`;
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PROCEDURAL & LAYERED COMPONENT RENDERERS (DYNAMO, HELIX, METEOR)
  // ─────────────────────────────────────────────────────────────

  // UPGRADES 1, 2, 3 & 5:
  // ─────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────
  // ARTICULATED KINEMATIC WINGS ENGINE (v352 TOP-TIER FLIGHT & PROPORTIONS)
  // - Recommendation 1: Wing Flap Damping & Convergence Limiter (strictly prevents tips touching/converging)
  // - Recommendation 2: Asymmetric Directional Kinematics (identifies strafe direction; leading wing lifts & glints, trailing drags & tucks)
  // - Recommendation 3: Proportional Sleek Wingspan (reduced max span to 0.46 for majestic, balanced aerospace silhouette)
  // - Intact 4K feathers, real-3D perspective foreshortening, and zero-slice seams
  // ─────────────────────────────────────────────────────────────
  function drawArticulatedWings(ctx, mode, u, cySrc, tier, now) {
    const cTier = CoreKinematics.continuousTier;
    if (cTier <= 1.03) return; // Tier I has no wings until morphing toward Tier II begins!

    const wingR = LayeredT4Assets.wingRight[mode];
    if (!wingR || !LayeredT4Assets.loaded.wingRight[mode]) return;

    // Continuous Morphing Proportional Span & Scale across Tiers
    // Recommendation 3: Sleek, majestic, aerodynamic visual balance
    let spanScale = 0.0;
    let heightScale = 0.0;
    let wingAlpha = 1.0;

    if (cTier < 2.0) {
      const t12 = Math.max(0, cTier - 1.0);
      const ease12 = 1.0 - Math.pow(1.0 - t12, 2.2);
      spanScale = 0.25 * ease12;
      heightScale = 0.27 * (0.45 + 0.55 * ease12);
      wingAlpha = Math.min(1.0, t12 * 1.6);
    } else if (cTier < 3.0) {
      const t23 = cTier - 2.0;
      spanScale = 0.25 + (0.35 - 0.25) * t23;
      heightScale = 0.27 + (0.37 - 0.27) * t23;
    } else if (cTier < 4.0) {
      const t34 = cTier - 3.0;
      spanScale = 0.35 + (0.46 - 0.35) * t34;
      heightScale = 0.37 + (0.48 - 0.37) * t34;
    } else {
      // Tier V Supreme Ascendant Seraphic Wing Expansion (Proportionate step up from Tier IV)
      const t45 = Math.min(1.0, cTier - 4.0);
      spanScale = 0.46 + (0.50 - 0.46) * t45;
      heightScale = 0.48 + (0.52 - 0.48) * t45;
    }

    const srcW = 688;
    const srcH = 768;
    const rootSocketX = (mode === 'helix') ? 12.0 : (mode === 'dynamo' ? 10.0 : 12.0);
    const breathPhase = now * 0.0032;

    // Horizontal Strafe Velocity & Ram-Air Aerodynamic Stabilization
    const vx = CoreKinematics.vx || 0;
    const ramAirFactor = 1.0 / (1.0 + 0.12 * Math.abs(vx));

    // Recommendation 1: Damped Base Flap with Angular Convergence Limiter
    // Strict clamp ensures wingtips never touch or converge inward above the sphere
    const tipInertia = (CoreKinematics.tipY * 0.0045 - CoreKinematics.bodyBank * 0.10) * ramAirFactor;
    const breathOsc = Math.sin(breathPhase) * 0.008;
    const lockLiftAngle = -CoreKinematics.lockOnProximity * 0.035;

    // Flap angle strictly clamped: max inward rotation 0.045 rad (~2.5 deg), max outward 0.12 rad (~6.8 deg)
    // Vertical Pitch Dynamics: Moving UP compresses wings aerodynamically; moving DOWN flares them
    const pitchAngle = CoreKinematics.pitchAngle || 0;
    const pitchFlapMod = -pitchAngle * 0.35;
    const rawFlap = tipInertia + breathOsc + lockLiftAngle + pitchFlapMod;
    const clampedFlap = Math.max(-0.045, Math.min(0.12, rawFlap));

    // Body Bank Angle into turn
    const bankAngle = CoreKinematics.bodyBank * 0.32;
    const normVx = Math.max(-1.0, Math.min(1.0, vx / 14.0));

    for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
      const dir = (sideIdx === 0) ? 1 : -1;
      const imgSource = wingR; // Symmetrically flipped via ctx.scale(dir, 1)

      // Recommendation 2: ASYMMETRIC DIRECTIONAL KINEMATICS (Left vs Right)
      // dirLead > 0: Wing is LEADING into the strafe vector (meets oncoming airflow)
      // dirLead < 0: Wing is TRAILING behind (dragged in slipstream wake)
      const dirLead = dir * normVx;

      // Leading wing lifts up with aerodynamic ground effect / slipstream lift
      // Trailing wing sweeps back and drags slightly downward
      const leadLift = Math.max(0, dirLead) * 0.065;
      const trailSweep = Math.min(0, dirLead) * 0.050;
      const asymmetricTilt = leadLift + trailSweep;

      const totalRotation = bankAngle + dir * clampedFlap + asymmetricTilt + dir * pitchAngle * 0.15;

      // ─── TIER V SERAPHIC ASCENDANT: HEXA-WING ARCHON (6 WINGS TOTAL) ───
      // When cTier >= 4.05, smoothly unfurl 3 pairs of articulated wings per side:
      // 1. Upper Grand Wing (Ascendant Divine Wing - lifted +12 deg at +0.21 rad)
      // 2. Mid Primary Archon Wing (Full span aerodynamic anchor)
      // 3. Lower Stabilizer Seraph Wing (Downswept -14 deg at -0.24 rad)
      const seraphMorph = Math.min(1.0, Math.max(0.0, (cTier - 4.0) * 1.5));
      const wingSubLayers = (cTier < 4.05) ? [
        { dyOff: 0, pitchMod: 0, sSpan: 1.0, sH: 1.0, aMult: 1.0 }
      ] : [
        { dyOff: -10.0 * u, pitchMod: 0.21, sSpan: 0.92, sH: 0.94, aMult: seraphMorph },
        { dyOff: 0, pitchMod: 0, sSpan: 1.0, sH: 1.0, aMult: 1.0 },
        { dyOff: 8.0 * u, pitchMod: -0.24, sSpan: 0.78, sH: 0.82, aMult: seraphMorph }
      ];

      for (let wLayerIdx = 0; wLayerIdx < wingSubLayers.length; wLayerIdx++) {
        const sub = wingSubLayers[wLayerIdx];
        ctx.save();
        const sockX = dir * rootSocketX * u;
        const sockY = ((mode === 'meteor' ? 2 : 4) * u) + sub.dyOff;
        ctx.translate(sockX, sockY);

        const subTotalRotation = totalRotation + dir * sub.pitchMod;
        ctx.rotate(subTotalRotation);

        // 3D Perspective Foreshortening & Asymmetric Span Modulation
        const spanModifier = 1.0 + dirLead * 0.07;
        const foreshortenX = (1.0 - dir * Math.sin(bankAngle) * 0.15) * Math.max(0.85, Math.min(1.10, spanModifier));
        const pitch3D = Math.max(0.78, Math.cos(subTotalRotation * 0.48));
        const breathScale = 1.0 + Math.sin(breathPhase + sideIdx * 0.4 + wLayerIdx * 0.3) * 0.012;

        ctx.scale(dir * spanScale * breathScale * u * foreshortenX * sub.sSpan, heightScale * breathScale * u * pitch3D * sub.sH);

        // Z-Depth Lighting & Ambient Slipstream Shadow:
        const slipstreamAlpha = (dirLead < 0) ? (1.0 + dirLead * 0.10) : 1.0;
        ctx.globalAlpha = wingAlpha * slipstreamAlpha * sub.aMult;

        // Draw the pristine, intact 4K wing sprite
        ctx.drawImage(imgSource, 0, -cySrc, srcW, srcH);

        // Real-3D Lighting: Windward Leading-Edge Specular Glint
        const lightDot = Math.cos(subTotalRotation * 1.3 - dir * 0.20 + dirLead * 0.35);
        const specMultiplier = 1.0 + Math.max(0, dirLead) * 0.85;
        const spec3D = Math.pow(Math.max(0, lightDot), 2.2) * specMultiplier;
        if (spec3D > 0.05) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(0.65, spec3D * 0.48 * wingAlpha * sub.aMult);
          ctx.drawImage(imgSource, 0, -cySrc, srcW, srcH);
          ctx.restore();
        }

        // In Tier IV & V (cTier >= 2.6): Render Sovereign / Seraphic Starlight Vein Shimmer
        if (cTier >= 2.6) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const shimmerWave = 0.5 + 0.5 * Math.sin(now * 0.006 - sideIdx * 1.2 + wLayerIdx * 0.8);
          ctx.globalAlpha = Math.min(0.75, (cTier - 2.5) * 0.50 * shimmerWave * sub.aMult);
          ctx.drawImage(imgSource, 0, -cySrc, srcW, srcH);
          ctx.restore();
        }

        ctx.restore();
      }
    }
  }

  // UPGRADE 4 (Dynamo): Progressive 3D Tilted Atomic Rings Across Tiers I -> IV
  // Tier I: 1 ring (Gold), Tier II: 2 rings (Gold + Cyan), Tier III & IV: 3 rings + faster precession!
  const DYNAMO_RING_CONFIGS = [
    { baseTilt:  0.44, tiltWobble: 0.18, tiltFreq: 0.0017, spinSpeed:  0.0038, rx: 100, ry: 36, isGold: true  },
    { baseTilt: -0.50, tiltWobble: 0.19, tiltFreq: 0.0014, spinSpeed: -0.0044, rx: 96,  ry: 34, isGold: false },
    { baseTilt:  1.22, tiltWobble: 0.22, tiltFreq: 0.0021, spinSpeed:  0.0031, rx: 88,  ry: 30, isGold: true  }
  ];

  function drawDynamoRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4) {
    ctx.save();
    ctx.translate(0, 5 * u);

    const activeRings = (tierIdx === 1) ? 1 : (tierIdx === 2 ? 2 : 3);
    const speedMult = (tierIdx === 4) ? 1.35 : (tierIdx === 3 ? 1.15 : 1.0);
    const numSegs = 44;

    for (let rIdx = 0; rIdx < activeRings; rIdx++) {
      const cfg = DYNAMO_RING_CONFIGS[rIdx];
      const tilt = cfg.baseTilt + Math.sin(now * cfg.tiltFreq * speedMult + rIdx * 2.1) * cfg.tiltWobble;
      const pitchScale = 0.72 + 0.36 * Math.cos(now * (cfg.tiltFreq * 1.3 * speedMult) + rIdx * 1.4);
      const rx = cfg.rx * u;
      const ry = cfg.ry * u * pitchScale;
      const spin = now * cfg.spinSpeed * speedMult + rIdx * 2.09;

      ctx.save();
      ctx.rotate(tilt);

      // Continuous Anti-Aliased Elliptical Ring (Zero bumpy beads or pixelated knots)
      const ringSteps = 72;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= ringSteps; s++) {
        const a = (s / ringSteps) * Math.PI * 2;
        const zDepth = Math.sin(a);
        const isFront = (zDepth >= 0);
        if (isFront === drawFrontHalf) {
          const x = Math.cos(a) * rx;
          const y = Math.sin(a) * ry;
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        } else {
          started = false;
        }
      }
      const ringAlpha = drawFrontHalf ? 0.94 : 0.42;
      const baseWidth = (drawFrontHalf ? 3.8 : 2.2) * u;
      ctx.lineWidth = baseWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = cfg.isGold
        ? (drawFrontHalf ? `rgba(254, 240, 138, ${ringAlpha})` : `rgba(245, 158, 11, ${ringAlpha})`)
        : (drawFrontHalf ? `rgba(224, 242, 254, ${ringAlpha})` : `rgba(56, 189, 248, ${ringAlpha})`);
      ctx.stroke();

      if (drawFrontHalf) {
        ctx.lineWidth = baseWidth * 0.42;
        ctx.strokeStyle = cfg.isGold ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.96)';
        ctx.stroke();
      }

      for (let b = 0; b < 2; b++) {
        const eAngle = (spin + b * Math.PI) % (Math.PI * 2);
        const ez = Math.sin(eAngle);
        const eIsFront = (ez >= 0);
        if (eIsFront !== drawFrontHalf) continue;

        const ex = Math.cos(eAngle) * rx;
        const ey = Math.sin(eAngle) * ry;
        const er = (drawFrontHalf ? (6.0 + 2.2 * ez) : 3.8) * u;

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

  function pseudoSin(seed) {
    return Math.sin(seed * 12.9898 + Math.cos(seed * 4.1414) * 3.1);
  }

  function drawInternalPlasmaArcs(ctx, cx, cy, maxR, now, phaseOffset, isCore = false, tierIdx = 4) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    // UPGRADE 5: Magnetic Lock-On Focal Shift inside the Core
    const lockShiftX = isCore ? Math.max(-maxR * 0.22, Math.min(maxR * 0.22, CoreKinematics.lockOnDX * 0.08)) : 0;
    const lockShiftY = isCore ? -CoreKinematics.lockOnProximity * maxR * 0.14 : 0;

    // 1. Undulating Golden-Amber Equatorial Plasma Crescent
    const swayAngle = Math.sin(now * 0.0042 + phaseOffset) * 0.28;
    const cresPulse = 0.82 + 0.18 * Math.sin(now * 0.007 + phaseOffset * 1.7);
    ctx.save();
    ctx.translate(lockShiftX * 0.5, lockShiftY * 0.5);
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

    // 2. Forming, Branching, and Fading Internal Electrical Filaments (Scales with Tier!)
    const numArcs = isCore ? (tierIdx + 2) : 4;
    for (let a = 0; a < numArcs; a++) {
      const cycleDuration = 360 + a * 65;
      const localTime = (now + phaseOffset * 420 + a * 190);
      const cycleIdx = Math.floor(localTime / cycleDuration);
      const cycleProg = (localTime % cycleDuration) / cycleDuration;

      const reachFrac = Math.min(1.0, cycleProg / 0.35);
      const fadeAlpha = Math.sin(cycleProg * Math.PI);
      if (fadeAlpha <= 0.05) continue;

      const baseAng = (a / numArcs) * Math.PI * 2 + cycleIdx * 1.15 + Math.sin(now * 0.002 + a) * 0.4;
      const segs = 5;
      let branchStartX = lockShiftX, branchStartY = lockShiftY;

      ctx.beginPath();
      ctx.moveTo(lockShiftX, lockShiftY);
      for (let s = 1; s <= segs; s++) {
        const frac = (s / segs) * reachFrac;
        const rDist = frac * maxR * 0.86;
        const jitter = pseudoSin(cycleIdx * 17 + a * 31 + s * 7 + Math.floor(now * 0.025)) * 0.38;
        const sx = lockShiftX * (1 - frac) + Math.cos(baseAng + jitter) * rDist;
        const sy = lockShiftY * (1 - frac) + Math.sin(baseAng + jitter) * rDist;
        ctx.lineTo(sx, sy);
        if (s === 2) {
          branchStartX = sx;
          branchStartY = sy;
        }
      }

      const isCyan = (a % 2 === 0);
      ctx.strokeStyle = (!isCore)
        ? (isCyan ? `rgba(103, 232, 249, ${0.92 * fadeAlpha})` : `rgba(232, 121, 249, ${0.90 * fadeAlpha})`)
        : (isCyan ? `rgba(103, 232, 249, ${0.90 * fadeAlpha})` : `rgba(147, 197, 253, ${0.88 * fadeAlpha})`);
      ctx.lineWidth = Math.max(1.2, maxR * 0.050);
      ctx.stroke();

      if (cycleProg > 0.22) {
        const bAng = baseAng + (a % 2 === 0 ? 0.55 : -0.55);
        const bLen = maxR * 0.44 * Math.min(1.0, (cycleProg - 0.22) / 0.35);
        const bMidX = branchStartX + Math.cos(bAng + 0.2) * (bLen * 0.55);
        const bMidY = branchStartY + Math.sin(bAng + 0.2) * (bLen * 0.55);
        const bEndX = branchStartX + Math.cos(bAng - 0.15) * bLen;
        const bEndY = branchStartY + Math.sin(bAng - 0.15) * bLen;

        ctx.beginPath();
        ctx.moveTo(branchStartX, branchStartY);
        ctx.lineTo(bMidX, bMidY);
        ctx.lineTo(bEndX, bEndY);
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.82 * fadeAlpha})`;
        ctx.lineWidth = Math.max(0.9, maxR * 0.034);
        ctx.stroke();
      }
    }

    // UPGRADE 4 (Dynamo Tier IV): Spinning Inner White-Gold Singularity Torus inside the violet sphere!
    if (isCore && tierIdx >= 4) {
      ctx.save();
      ctx.translate(lockShiftX, lockShiftY);
      ctx.rotate(now * 0.0055);
      ctx.beginPath();
      ctx.ellipse(0, 0, maxR * 0.42, maxR * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.lineWidth = Math.max(1.6, maxR * 0.045);
      ctx.stroke();

      ctx.rotate(-now * 0.0095);
      ctx.beginPath();
      ctx.ellipse(0, 0, maxR * 0.28, maxR * 0.28, 0, 0, Math.PI * 1.35);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.90)';
      ctx.lineWidth = Math.max(1.4, maxR * 0.038);
      ctx.stroke();
      ctx.restore();
    }

    // Central Singularity Pulse Point
    const corePulse = 0.8 + 0.2 * Math.sin(now * 0.009 + phaseOffset);
    const cg = ctx.createRadialGradient(lockShiftX, lockShiftY, 0, lockShiftX, lockShiftY, maxR * 0.42 * corePulse);
    cg.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    cg.addColorStop(0.45, 'rgba(232, 121, 249, 0.65)');
    cg.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(lockShiftX, lockShiftY, maxR * 0.42 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // UPGRADE 4 (Helix): Progressive 3D Photonic Orbital Rings Across Tiers I -> IV
  // Tier I: 0 external rings (pure glass sphere), Tier II: 1 cyan ring, Tier III & IV: 2 intersecting rings + faster photon beads!
  function drawHelixOrbitalRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4) {
    if (tierIdx <= 1) return;
    const configs = [
      { tilt:  0.22 + Math.sin(now * 0.0015) * 0.10, rx: 108 * u, ry: 28 * u, spin:  now * 0.0034, isCyan: true  },
      { tilt: -0.24 + Math.cos(now * 0.0013) * 0.10, rx: 104 * u, ry: 26 * u, spin: -now * 0.0038, isCyan: false }
    ];
    const activeCount = (tierIdx === 2) ? 1 : 2;
    const segs = 40;
    ctx.save();
    ctx.translate(0, 12 * u);
    for (let c = 0; c < activeCount; c++) {
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
        const alpha = drawFrontHalf ? (0.82 + 0.18 * z) : (0.35 + 0.20 * (1 + z));
        const lw = (drawFrontHalf ? (3.2 + 1.4 * z) : 1.9) * u;

        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * cfg.rx, Math.sin(a0) * cfg.ry);
        ctx.lineTo(Math.cos(a1) * cfg.rx, Math.sin(a1) * cfg.ry);
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        if (cfg.isCyan) {
          ctx.strokeStyle = (wave > 0.68 && drawFrontHalf)
            ? `rgba(224, 242, 254, ${alpha})`
            : `rgba(34, 211, 238, ${alpha})`;
        } else {
          ctx.strokeStyle = (wave > 0.68 && drawFrontHalf)
            ? `rgba(254, 240, 138, ${alpha})`
            : `rgba(232, 121, 249, ${alpha})`;
        }
        ctx.stroke();
      }

      const bAngle = cfg.spin % (Math.PI * 2);
      const bz = Math.sin(bAngle);
      if ((bz >= 0) === drawFrontHalf) {
        const bx = Math.cos(bAngle) * cfg.rx;
        const by = Math.sin(bAngle) * cfg.ry;
        const br = (drawFrontHalf ? 5.2 : 3.2) * u;
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br * 2.2);
        bg.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
        bg.addColorStop(0.45, cfg.isCyan ? 'rgba(34, 211, 238, 0.88)' : 'rgba(232, 121, 249, 0.88)');
        bg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(bx, by, br * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawRotating3DDNAInsideGlass(ctx, cx, cy, radiusX, radiusY, now, phaseOffset, isCore = false, tierIdx = 4) {
    ctx.save();
    ctx.translate(cx, cy);

    const clipR = Math.max(radiusX, radiusY) * 1.06;
    ctx.beginPath();
    ctx.arc(0, 0, clipR, 0, Math.PI * 2);
    ctx.clip();

    const speedMult = isCore ? (0.85 + tierIdx * 0.10) : 1.0;
    const rotPhase = now * (isCore ? 0.0038 : 0.0048) * speedMult + phaseOffset;
    const pulseNormY = 1.05 - (((now * 0.0014 * speedMult + phaseOffset * 0.35) % 1.0) * 2.10);

    const numRungs = isCore ? 9 : 7;
    const strandSteps = 28;
    const strandA = [];
    const strandB = [];

    for (let i = 0; i <= strandSteps; i++) {
      const t = i / strandSteps;
      const yNorm = -0.86 + t * 1.72;
      const yPx = yNorm * radiusY;
      const env = Math.sqrt(Math.max(0.15, 1.0 - yNorm * yNorm * 0.65));
      const ampX = radiusX * env;

      const theta = yNorm * (isCore ? 3.8 : 3.4) - rotPhase;
      const xA = Math.sin(theta) * ampX;
      const zA = Math.cos(theta);
      const xB = Math.sin(theta + Math.PI) * ampX;
      const zB = -zA;

      strandA.push({ x: xA, y: yPx, z: zA, yNorm });
      strandB.push({ x: xB, y: yPx, z: zB, yNorm });
    }

    const drawStrandPass = (pts, isCyan, frontPass) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const zMid = (p0.z + p1.z) * 0.5;
        if ((zMid >= 0) !== frontPass) continue;

        const pulseBoost = (tierIdx >= 2 || !isCore) ? Math.exp(-Math.pow((p0.yNorm - pulseNormY) / 0.22, 2)) : 0;
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

      const pulseIntensity = (tierIdx >= 2 || !isCore) ? Math.exp(-Math.pow((yNorm - pulseNormY) / 0.20, 2)) : 0.15;
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

    // UPGRADE 4 (Helix Tier IV): Soft Volumetric Polar Aurora Crowns
    if (isCore && tierIdx >= 4) {
      const lockLeanX = Math.max(-14, Math.min(14, CoreKinematics.lockOnDX * 0.06));
      for (let pole = -1; pole <= 1; pole += 2) {
        const py = pole * radiusY * 0.86;
        const px = (pole === -1) ? lockLeanX * 0.5 : 0;
        ctx.save();
        ctx.translate(px, py);
        const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX * 0.85);
        pg.addColorStop(0.0, (pole === -1) ? 'rgba(34, 211, 238, 0.70)' : 'rgba(232, 121, 249, 0.70)');
        pg.addColorStop(0.6, (pole === -1) ? 'rgba(56, 189, 248, 0.35)' : 'rgba(168, 85, 247, 0.35)');
        pg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX * 0.85, radiusX * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();

    drawStrandPass(strandA, true, true);
    drawStrandPass(strandB, false, true);

    // Smooth Volumetric 3D Spherical Crystal Glass Highlight (Zero Harsh Wire Arcs)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const specG = ctx.createRadialGradient(-radiusY * 0.30, -radiusY * 0.45, 0, -radiusY * 0.30, -radiusY * 0.45, radiusY * 0.65);
    specG.addColorStop(0.0, 'rgba(255, 255, 255, 0.75)');
    specG.addColorStop(0.35, 'rgba(224, 242, 254, 0.40)');
    specG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = specG;
    ctx.beginPath();
    ctx.arc(0, 0, radiusY * 0.96, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // UPGRADE 4 (Meteor): Organic Branching Lava Fissures & Tier-Progressive Magma Intensity
  const METEOR_FISSURE_HOTSPOTS = [
    { x:  0.00, y:  0.05, r: 0.36, freq: 0.0052, phase: 0.0, isEye: true  },
    { x: -0.38, y: -0.28, r: 0.25, freq: 0.0068, phase: 1.3, isEye: false },
    { x:  0.36, y: -0.22, r: 0.26, freq: 0.0059, phase: 2.7, isEye: false },
    { x: -0.32, y:  0.34, r: 0.25, freq: 0.0074, phase: 4.1, isEye: false },
    { x:  0.35, y:  0.30, r: 0.25, freq: 0.0063, phase: 5.2, isEye: false },
    { x:  0.02, y: -0.46, r: 0.22, freq: 0.0081, phase: 3.4, isEye: false }
  ];

  const METEOR_CRACK_PATHS = [
    [ {x: 0.0, y: 0.05}, {x: -0.18, y: -0.10}, {x: -0.38, y: -0.28}, {x: -0.58, y: -0.42}, {x: -0.76, y: -0.38} ],
    [ {x: 0.0, y: 0.05}, {x:  0.20, y: -0.06}, {x:  0.36, y: -0.22}, {x:  0.56, y: -0.18}, {x:  0.74, y: -0.32} ],
    [ {x: 0.0, y: 0.05}, {x: -0.16, y:  0.22}, {x: -0.32, y:  0.34}, {x: -0.52, y:  0.54}, {x: -0.44, y:  0.76} ],
    [ {x: 0.0, y: 0.05}, {x:  0.18, y:  0.18}, {x:  0.35, y:  0.30}, {x:  0.58, y:  0.46}, {x:  0.72, y:  0.34} ],
    [ {x: -0.18, y: -0.10}, {x: -0.04, y: -0.28}, {x: 0.02, y: -0.46}, {x: 0.16, y: -0.68} ]
  ];

  function drawMeteorMagmaFissuresAndPlates(ctx, radius, now, phaseOffset, tumbleAngle, tierIdx = 4) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.96, 0, Math.PI * 2);
    ctx.clip();

    ctx.rotate(tumbleAngle);
    ctx.globalCompositeOperation = 'lighter';

    const tierHeat = 0.65 + (tierIdx / 4.0) * 0.45;

    for (let c = 0; c < METEOR_CRACK_PATHS.length; c++) {
      const path = METEOR_CRACK_PATHS[c];
      const veinPulse = (0.30 + 0.70 * Math.pow(0.5 + 0.5 * Math.sin(now * 0.0058 + c * 1.45 + phaseOffset), 1.8)) * tierHeat;

      ctx.beginPath();
      for (let k = 0; k < path.length; k++) {
        const px = path[k].x * radius;
        const py = path[k].y * radius;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(249, 115, 22, ${Math.min(1, 0.55 * veinPulse)})`;
      ctx.lineWidth = Math.max(1.6, radius * 0.065);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.strokeStyle = `rgba(254, 240, 138, ${Math.min(1, 0.78 * veinPulse)})`;
      ctx.lineWidth = Math.max(0.8, radius * 0.026);
      ctx.stroke();
    }

    for (let h = 0; h < METEOR_FISSURE_HOTSPOTS.length; h++) {
      const hs = METEOR_FISSURE_HOTSPOTS[h];
      const pulse = (0.28 + 0.72 * Math.pow(0.5 + 0.5 * Math.sin(now * hs.freq + hs.phase + phaseOffset), 1.6)) * tierHeat;
      const hx = hs.x * radius;
      const hy = hs.y * radius;
      const hr = hs.r * radius * (0.82 + 0.26 * pulse);

      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      if (hs.isEye) {
        g.addColorStop(0.0, `rgba(255, 255, 255, ${Math.min(1, 0.95 * pulse)})`);
        g.addColorStop(0.35, `rgba(254, 240, 138, ${Math.min(1, 0.88 * pulse)})`);
        g.addColorStop(0.70, `rgba(249, 115, 22, ${Math.min(1, 0.55 * pulse)})`);
        g.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
      } else {
        g.addColorStop(0.0, `rgba(254, 240, 138, ${Math.min(1, 0.80 * pulse)})`);
        g.addColorStop(0.45, `rgba(249, 115, 22, ${Math.min(1, 0.62 * pulse)})`);
        g.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDownwardCyanBowShock(ctx, radius, now, phaseOffset) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const shimmer = 0.86 + 0.14 * Math.sin(now * 0.012 + phaseOffset);
    const arcR = radius * 0.96;

    ctx.beginPath();
    ctx.arc(0, 0, arcR, Math.PI * 0.14, Math.PI * 0.86);
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.68 * shimmer})`;
    ctx.lineWidth = Math.max(3.6, radius * 0.13);
    ctx.lineCap = 'round';
    ctx.stroke();

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

  // UPGRADE 4 (Meteor): Progressive 3D Solar-Fire Orbital Rings Across Tiers I -> IV
  // Tier I: 0 external rings, Tier II: 1 ring, Tier III & IV: 2 intersecting multi-layered solar-fire rings!
  function drawMeteorMoltenRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4) {
    if (tierIdx <= 1) return;
    const configs = [
      { tilt:  0.52 + Math.sin(now * 0.0014) * 0.14, rx: 98 * u, ry: 40 * u, spin:  now * 0.0034 },
      { tilt: -0.52 + Math.cos(now * 0.0016) * 0.14, rx: 98 * u, ry: 40 * u, spin: -now * 0.0038 }
    ];
    const activeCount = (tierIdx === 2) ? 1 : 2;
    const segs = 40;
    ctx.save();
    ctx.translate(0, -6 * u);
    ctx.globalCompositeOperation = 'lighter';

    for (let c = 0; c < activeCount; c++) {
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
        const alpha = drawFrontHalf ? (0.78 + 0.22 * z) : (0.34 + 0.20 * (1 + z));
        const lw = (drawFrontHalf ? (4.4 + 1.8 * z) : 2.4) * u;

        const x0 = Math.cos(a0) * cfg.rx;
        const y0 = Math.sin(a0) * cfg.ry;
        const x1 = Math.cos(a1) * cfg.rx;
        const y1 = Math.sin(a1) * cfg.ry;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.strokeStyle = `rgba(234, 88, 12, ${alpha * 0.85})`;
        ctx.stroke();

        if (drawFrontHalf) {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineWidth = lw * 0.42;
          ctx.strokeStyle = (wave > 0.60)
            ? `rgba(255, 255, 255, ${alpha * 0.92})`
            : `rgba(254, 240, 138, ${alpha * 0.85})`;
          ctx.stroke();
        }
      }

      const fAngle = cfg.spin % (Math.PI * 2);
      const fz = Math.sin(fAngle);
      if ((fz >= 0) === drawFrontHalf) {
        const fx = Math.cos(fAngle) * cfg.rx;
        const fy = Math.sin(fAngle) * cfg.ry;
        const fr = (drawFrontHalf ? 5.8 : 3.5) * u;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr * 2.3);
        fg.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
        fg.addColorStop(0.40, 'rgba(254, 240, 138, 0.92)');
        fg.addColorStop(0.75, 'rgba(249, 115, 22, 0.55)');
        fg.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, fr * 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

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

  // ─────────────────────────────────────────────────────────────
  // ULTRA-FUTURISTIC PHOTONIC RESONANCE AURA ENGINE (v345)
  // - High-intensity starlight core corona with Gaussian falloff
  // - Mode-specific chromatic dispersion aura (Cyan/Magenta, Cobalt/Violet, Solar Amber)
  // - 16 rotating crystalline starlight diffraction needle rays
  // - Concentric Ascension event-horizon shock rings
  // ─────────────────────────────────────────────────────────────
  function drawFuturisticResonanceAura(ctx, mode, u, now, cTier) {
    if (cTier <= 1.05) return;
    const auraMorph = Math.min(1.0, (cTier - 1.0) / 2.2);
    const breathe = 1.0 + Math.sin(now * 0.0035) * 0.035 + CoreKinematics.overdriveFlash * 0.12;
    const baseR = 145 * u * (0.65 + 0.55 * auraMorph) * breathe;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Hyper-Intense Photonic Starlight Core Corona (Volumetric Radial Bloom)
    const gCore = ctx.createRadialGradient(0, 0, baseR * 0.10, 0, 0, baseR * 1.05);
    gCore.addColorStop(0.0, `rgba(255, 255, 255, ${0.98 * auraMorph})`);
    if (mode === 'dynamo') {
      gCore.addColorStop(0.28, `rgba(186, 230, 253, ${0.90 * auraMorph})`);
      gCore.addColorStop(0.55, `rgba(56, 189, 248, ${0.60 * auraMorph})`);
      gCore.addColorStop(0.80, `rgba(168, 85, 247, ${0.28 * auraMorph})`);
    } else if (mode === 'helix') {
      gCore.addColorStop(0.28, `rgba(245, 208, 254, ${0.90 * auraMorph})`);
      gCore.addColorStop(0.55, `rgba(34, 211, 238, ${0.60 * auraMorph})`);
      gCore.addColorStop(0.80, `rgba(232, 121, 249, ${0.28 * auraMorph})`);
    } else {
      gCore.addColorStop(0.28, `rgba(254, 249, 195, ${0.95 * auraMorph})`);
      gCore.addColorStop(0.55, `rgba(251, 146, 60, ${0.65 * auraMorph})`);
      gCore.addColorStop(0.80, `rgba(239, 68, 68, ${0.25 * auraMorph})`);
    }
    gCore.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gCore;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // 2. Anamorphic Cinematic Starlight Flare Streak (Horizontal Ethereal Cinema Bloom)
    if (cTier >= 2.0) {
      const flareAlpha = Math.min(0.85, (cTier - 1.8) * 0.55);
      const flareLen = baseR * 2.2;
      const flareH = 14 * u * (0.8 + 0.2 * Math.sin(now * 0.005));
      const gFlare = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      gFlare.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
      if (mode === 'dynamo') {
        gFlare.addColorStop(0.35, `rgba(56, 189, 248, ${0.40 * flareAlpha})`);
        gFlare.addColorStop(0.50, `rgba(255, 255, 255, ${0.95 * flareAlpha})`);
        gFlare.addColorStop(0.65, `rgba(168, 85, 247, ${0.40 * flareAlpha})`);
      } else if (mode === 'helix') {
        gFlare.addColorStop(0.35, `rgba(232, 121, 249, ${0.40 * flareAlpha})`);
        gFlare.addColorStop(0.50, `rgba(255, 255, 255, ${0.95 * flareAlpha})`);
        gFlare.addColorStop(0.65, `rgba(34, 211, 238, ${0.40 * flareAlpha})`);
      } else {
        gFlare.addColorStop(0.35, `rgba(249, 115, 22, ${0.40 * flareAlpha})`);
        gFlare.addColorStop(0.50, `rgba(255, 255, 255, ${0.95 * flareAlpha})`);
        gFlare.addColorStop(0.65, `rgba(254, 240, 138, ${0.40 * flareAlpha})`);
      }
      gFlare.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gFlare;
      ctx.beginPath();
      ctx.ellipse(0, 0, flareLen, flareH, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Volumetric Crystalline Starlight Diamond Flares (Zero Wire Lines, 100% Smooth Tapered Light)
    if (cTier >= 2.2) {
      const rayAlpha = Math.min(0.85, (cTier - 2.0) * 0.55);
      const raySpin = now * 0.0006;
      ctx.save();
      ctx.rotate(raySpin);
      const rays = 8;
      for (let r = 0; r < rays; r++) {
        const ang = (r / rays) * Math.PI * 2;
        const isCardinal = (r % 2 === 0);
        const rayLen = baseR * (isCardinal ? 1.65 : 1.25) * (1.0 + Math.sin(now * 0.004 + r) * 0.05);
        const rayW = (isCardinal ? 9.5 : 5.5) * u;
        
        ctx.save();
        ctx.rotate(ang);
        const gRay = ctx.createLinearGradient(baseR * 0.55, 0, rayLen, 0);
        if (mode === 'dynamo') {
          gRay.addColorStop(0.0, `rgba(255, 255, 255, ${0.90 * rayAlpha})`);
          gRay.addColorStop(0.35, `rgba(186, 230, 253, ${0.75 * rayAlpha})`);
          gRay.addColorStop(0.75, `rgba(56, 189, 248, ${0.35 * rayAlpha})`);
        } else if (mode === 'helix') {
          gRay.addColorStop(0.0, `rgba(255, 255, 255, ${0.90 * rayAlpha})`);
          gRay.addColorStop(0.35, `rgba(245, 208, 254, ${0.75 * rayAlpha})`);
          gRay.addColorStop(0.75, `rgba(232, 121, 249, ${0.35 * rayAlpha})`);
        } else {
          gRay.addColorStop(0.0, `rgba(255, 255, 255, ${0.95 * rayAlpha})`);
          gRay.addColorStop(0.35, `rgba(254, 240, 138, ${0.80 * rayAlpha})`);
          gRay.addColorStop(0.75, `rgba(249, 115, 22, ${0.40 * rayAlpha})`);
        }
        gRay.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gRay;
        ctx.beginPath();
        ctx.moveTo(baseR * 0.55, 0);
        ctx.lineTo(baseR * 0.90, -rayW * 0.5);
        ctx.lineTo(rayLen, 0);
        ctx.lineTo(baseR * 0.90, rayW * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // 4. Soft Concentric Ascension Resonance Ripples in Tier IV
    if (cTier >= 3.2) {
      const t4Alpha = Math.min(0.70, (cTier - 3.0) * 0.70);
      for (let ring = 0; ring < 2; ring++) {
        const ringR = baseR * (0.95 + ring * 0.35 + Math.sin(now * 0.002 + ring) * 0.04);
        const ringGrad = ctx.createRadialGradient(0, 0, ringR - 8 * u, 0, 0, ringR + 8 * u);
        ringGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
        if (mode === 'dynamo') {
          ringGrad.addColorStop(0.5, `rgba(56, 189, 248, ${t4Alpha * (0.6 - ring * 0.2)})`);
        } else if (mode === 'helix') {
          ringGrad.addColorStop(0.5, `rgba(232, 121, 249, ${t4Alpha * (0.6 - ring * 0.2)})`);
        } else {
          ringGrad.addColorStop(0.5, `rgba(254, 240, 138, ${t4Alpha * (0.6 - ring * 0.2)})`);
        }
        ringGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(0, 0, ringR + 8 * u, 0, Math.PI * 2);
        ctx.arc(0, 0, Math.max(0, ringR - 8 * u), Math.PI * 2, 0, true);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  const QuantumRenderer = {
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      this.drawDynamoCore(ctx, cx, cy, now, progress);
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null) {
      const tierIdx = Math.min(5, Math.max(1, tier | 0));
      const cTier = (CoreKinematics && CoreKinematics.continuousTier !== undefined && Math.abs(CoreKinematics.continuousTier - tierIdx) < 1.2) ? CoreKinematics.continuousTier : tierIdx;
      const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
      const isMobile = canvasW < 600;

      const drawW = customScale ? (customScale * 1376.0) : (isMobile ? Math.min(canvasW * 0.96, 420) : Math.min(canvasW * 0.86, 1060));
      const u = customScale || (drawW / 1376.0);
      const cySrc = (mode === 'meteor') ? 586.0 : (mode === 'helix' ? 568.0 : 590.0);

      ctx.save();
      ctx.translate(cx, cy);

      // Render Procedural Ultra-Futuristic Photonic Resonance Aura
      drawFuturisticResonanceAura(ctx, mode, u, now, cTier);

      // UPGRADE 1: Smoothly Morphing Background Starburst Halo (Blooms as continuousTier crosses 2.1 -> 4.0 -> 5.0)
      if (cTier > 2.05 && LayeredT4Assets.loaded.halo[mode]) {
        const haloSpr = LayeredT4Assets.halo[mode];
        const haloMorph = Math.min(1.0, Math.max(0.0, (cTier - 2.0) / 1.8));
        const t45Halo = Math.max(0.0, Math.min(1.0, cTier - 4.0));
        const haloScale = (0.42 + 0.24 * haloMorph + 0.05 * t45Halo) * (1.0 + Math.sin(now * 0.003) * 0.02 + CoreKinematics.overdriveFlash * 0.08);
        ctx.save();
        ctx.globalAlpha = Math.min(1.0, (cTier - 2.0) * 0.85 + CoreKinematics.overdriveFlash * 0.25);
        ctx.globalCompositeOperation = 'lighter';
        ctx.scale(haloScale, haloScale);
        ctx.drawImage(haloSpr, -344 * u, -344 * u, 688 * u, 688 * u);
        ctx.restore();
      }

      // UPGRADE 1 & 5: Render Expanding Ascension Shock-Rings & Tier IV/V Harmonic Resonance Rings!
      if (CoreKinematics.ascensionRings.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < CoreKinematics.ascensionRings.length; i++) {
          const ar = CoreKinematics.ascensionRings[i];
          ctx.beginPath();
          ctx.arc(0, 0, ar.radius * u * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = (ar.mode === 'meteor')
            ? `rgba(254, 240, 138, ${ar.alpha * 0.85})`
            : (ar.mode === 'helix' ? `rgba(240, 171, 252, ${ar.alpha * 0.85})` : `rgba(56, 189, 248, ${ar.alpha * 0.85})`);
          ctx.lineWidth = (3.5 + (ar.tierReached >= 4 ? 2.5 : 0)) * u;
          ctx.stroke();
        }
        ctx.restore();
      }

      // LAYER 2 & 3: Banking Central Core Body + Directly-Connected Proportional Wings!
      ctx.save();
      ctx.rotate(CoreKinematics.bodyBank * 0.55);

      // Draw Proportional Articulated Wings FIRST (anchored inside the core sphere at rootSocketX so zero gap exists!)
      drawArticulatedWings(ctx, mode, u, cySrc, tierIdx, now);

      ctx.rotate(CoreKinematics.bodyBank * 0.45);

      if (mode === 'dynamo') {
        drawDynamoRingsHalf(ctx, u, now, false, tierIdx);

        if (LayeredT4Assets.loaded.coreBase.dynamo) {
          // Unified Core Sphere Radius: exactly 68.0 * u (raw radius 56.0 * 1.2143 = 68.0)
          const dScale = 1.2143;
          const t5Prog = Math.max(0.0, Math.min(1.0, cTier - 4.0));
          const t5Ease = t5Prog * t5Prog * (3 - 2 * t5Prog);
          const t5Scale = 0.6923; // Proportionate Tier V: radius 104 * 0.6923 = 72.0 * u (+6% over Tier IV)
          const t5Size = 340 * u * t5Scale;
          if (t5Prog <= 0.001 || !LayeredT4Assets.loaded.coreBaseT5 || !LayeredT4Assets.loaded.coreBaseT5.dynamo) {
            ctx.drawImage(LayeredT4Assets.coreBase.dynamo, -170 * u * dScale, -140 * u * dScale, 340 * u * dScale, 280 * u * dScale);
          } else if (t5Prog >= 0.999) {
            ctx.drawImage(LayeredT4Assets.coreBaseT5.dynamo, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
          } else {
            ctx.save();
            ctx.globalAlpha = 1.0 - t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBase.dynamo, -170 * u * dScale, -140 * u * dScale, 340 * u * dScale, 280 * u * dScale);
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBaseT5.dynamo, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
            ctx.restore();
          }
        }

        drawInternalPlasmaArcs(ctx, 0, 0, 59 * u, now, 0.0, true, tierIdx);
        drawDynamoRingsHalf(ctx, u, now, true, tierIdx);

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

        // ─── TIER V SERAPHIC EVOLUTION: Chronometer Gear Rings & Tachyon Satellites ───
        if (cTier > 4.0) {
          const t5Alpha = Math.min(1.0, (cTier - 4.0) * 1.0);
          ctx.save();
          ctx.globalAlpha = t5Alpha;
          ctx.globalCompositeOperation = 'lighter';

          // 1. Concentric Chronometer Gear Rings (Proportionately scaled around 72.0 * u core)
          const gearRadii = [72 * u, 84 * u];
          const gearDirs = [1, -1];
          for (let g = 0; g < 2; g++) {
            const gr = gearRadii[g];
            const gDir = gearDirs[g];
            const gRot = now * 0.0018 * gDir;
            ctx.save();
            ctx.rotate(gRot);
            ctx.beginPath();
            ctx.arc(0, 0, gr, 0, Math.PI * 2);
            ctx.strokeStyle = (g === 0) ? 'rgba(56, 189, 248, 0.45)' : 'rgba(254, 240, 138, 0.40)';
            ctx.lineWidth = 1.4 * u;
            ctx.stroke();

            // 24 Gear Teeth
            for (let tooth = 0; tooth < 24; tooth++) {
              const ta = (tooth * Math.PI * 2) / 24;
              ctx.beginPath();
              ctx.moveTo(Math.cos(ta) * gr, Math.sin(ta) * gr);
              ctx.lineTo(Math.cos(ta) * (gr + 3.0 * u), Math.sin(ta) * (gr + 3.0 * u));
              ctx.strokeStyle = (g === 0) ? 'rgba(56, 189, 248, 0.70)' : 'rgba(254, 240, 138, 0.70)';
              ctx.lineWidth = 1.2 * u;
              ctx.stroke();
            }
            ctx.restore();
          }

          // 2. 4 Orbiting Tachyon Satellites (Proportionately orbiting at 92 * u)
          const satOrbR = 92 * u;
          const satBaseRot = now * 0.0028;
          for (let s = 0; s < 4; s++) {
            const sa = satBaseRot + (s * Math.PI * 0.5);
            const sx = Math.cos(sa) * satOrbR;
            const sy = Math.sin(sa) * satOrbR * 0.48; // 3D perspective tilt
            // Micro-satellite core
            const satG = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5.5 * u);
            satG.addColorStop(0.0, '#ffffff');
            satG.addColorStop(0.35, '#38bdf8');
            satG.addColorStop(0.80, '#f43f5e');
            satG.addColorStop(1.0, 'rgba(0, 240, 255, 0)');
            ctx.fillStyle = satG;
            ctx.beginPath();
            ctx.arc(sx, sy, 5.5 * u, 0, Math.PI * 2);
            ctx.fill();

            // Satellite micro-spark
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8 * u, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      } else if (mode === 'helix') {
        drawHelixOrbitalRingsHalf(ctx, u, now, false, tierIdx);

        // Unified Core Sphere Radius: exactly 68.0 * u (raw radius 88.0 * 0.7727 = 68.0)
        const hScale = 0.7727;
        const t5Prog = Math.max(0.0, Math.min(1.0, cTier - 4.0));
        const t5Ease = t5Prog * t5Prog * (3 - 2 * t5Prog);
        const t5Scale = 0.6923; // Proportionate Tier V: radius 104 * 0.6923 = 72.0 * u (+6% over Tier IV)
        const t5Size = 340 * u * t5Scale;
        if (LayeredT4Assets.loaded.coreBase.helix) {
          if (t5Prog <= 0.001 || !LayeredT4Assets.loaded.coreBaseT5 || !LayeredT4Assets.loaded.coreBaseT5.helix) {
            ctx.drawImage(LayeredT4Assets.coreBase.helix, -170 * u * hScale, -144 * u * hScale, 340 * u * hScale, 280 * u * hScale);
          } else if (t5Prog >= 0.999) {
            ctx.drawImage(LayeredT4Assets.coreBaseT5.helix, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
          } else {
            ctx.save();
            ctx.globalAlpha = 1.0 - t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBase.helix, -170 * u * hScale, -144 * u * hScale, 340 * u * hScale, 280 * u * hScale);
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBaseT5.helix, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
            ctx.restore();
          }
        }

        // Complete 3D Spherical Crystal Enclosure (Prismatic Bio-Lattice Horizon)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const rimGrad = ctx.createRadialGradient(0, 0, 58 * u, 0, 0, 68 * u);
        rimGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
        rimGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.45)');
        rimGrad.addColorStop(1.0, 'rgba(232, 121, 249, 0.25)');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 68 * u, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Internal 3D Double Helix
        drawRotating3DDNAInsideGlass(ctx, 0, 0, 24 * u, 60 * u, now, 0.0, true, tierIdx);

        // Sovereign Crown Pearl (Design 2 Feature: Top Floating Bio-Lattice Pearl with Starlight Bridge)
        if (cTier >= 2.4) {
          const topPearlAlpha = Math.min(1.0, (cTier - 2.2) * 1.5);
          ctx.save();
          ctx.globalAlpha = topPearlAlpha;
          // Starlight bridge between main sphere and top pearl
          const bridgeG = ctx.createRadialGradient(0, -42 * u, 0, 0, -42 * u, 20 * u);
          bridgeG.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
          bridgeG.addColorStop(0.4, 'rgba(254, 240, 138, 0.85)');
          bridgeG.addColorStop(0.7, 'rgba(232, 121, 249, 0.45)');
          bridgeG.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
          ctx.fillStyle = bridgeG;
          ctx.beginPath();
          ctx.arc(0, -42 * u, 20 * u, 0, Math.PI * 2);
          ctx.fill();

          // Top Pearl sphere & mini-helix
          drawRotating3DDNAInsideGlass(ctx, 0, -60 * u, 12 * u, 24 * u, now, 1.2, false, tierIdx);
          ctx.restore();
        }

        // ─── TIER V SERAPHIC EVOLUTION: Twin Starlight Crown & Prismatic Refraction Rays ───
        if (cTier > 4.0) {
          const t5Alpha = Math.min(1.0, (cTier - 4.0) * 1.0);
          ctx.save();
          ctx.globalAlpha = t5Alpha;
          ctx.globalCompositeOperation = 'lighter';

          // 1. Secondary Upper Starlight Crown Pearl & Dual Starlight Bridges (Proportionate to 72.0 * u core)
          const upperPearlY = -72 * u;
          const bridge2 = ctx.createLinearGradient(0, -56 * u, 0, upperPearlY);
          bridge2.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
          bridge2.addColorStop(0.5, 'rgba(34, 211, 238, 0.85)');
          bridge2.addColorStop(1.0, 'rgba(244, 63, 94, 0.95)');
          ctx.strokeStyle = bridge2;
          ctx.lineWidth = 1.8 * u;
          ctx.beginPath();
          ctx.moveTo(0, -56 * u);
          ctx.lineTo(0, upperPearlY);
          ctx.stroke();

          // Upper Crown Pearl Sphere
          const pGrad2 = ctx.createRadialGradient(0, upperPearlY, 0, 0, upperPearlY, 7.5 * u);
          pGrad2.addColorStop(0.0, '#ffffff');
          pGrad2.addColorStop(0.4, 'rgba(34, 211, 238, 0.90)');
          pGrad2.addColorStop(0.8, 'rgba(244, 63, 94, 0.75)');
          pGrad2.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = pGrad2;
          ctx.beginPath();
          ctx.arc(0, upperPearlY, 7.5 * u, 0, Math.PI * 2);
          ctx.fill();

          // 2. 8 Prismatic Optical Flare Rays (Scaled to 86 * u)
          const rayRot = now * 0.0015;
          for (let r = 0; r < 8; r++) {
            const ra = rayRot + (r * Math.PI * 0.25);
            const rLen = 86 * u;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ra) * rLen, Math.sin(ra) * rLen);
            ctx.strokeStyle = (r % 2 === 0) ? 'rgba(34, 211, 238, 0.45)' : 'rgba(244, 63, 94, 0.40)';
            ctx.lineWidth = 1.3 * u;
            ctx.stroke();
          }
          ctx.restore();
        }

        drawHelixOrbitalRingsHalf(ctx, u, now, true, tierIdx);
      } else {
        const sr = CoreKinematics.meteorShieldRecoil;
        ctx.save();
        ctx.translate(0, sr.y * u * 0.65);
        ctx.rotate(sr.tilt * 0.45);

        drawMeteorMoltenRingsHalf(ctx, u, now, false, tierIdx);

        // Unified Core Sphere Radius: exactly 68.0 * u (raw radius 71.0 * 0.9577 = 68.0)
        const mScale = 0.9577;
        const t5Prog = Math.max(0.0, Math.min(1.0, cTier - 4.0));
        const t5Ease = t5Prog * t5Prog * (3 - 2 * t5Prog);
        const t5Scale = 0.6923; // Proportionate Tier V: radius 104 * 0.6923 = 72.0 * u (+6% over Tier IV)
        const t5Size = 340 * u * t5Scale;
        if (LayeredT4Assets.loaded.coreBase.meteor) {
          if (t5Prog <= 0.001 || !LayeredT4Assets.loaded.coreBaseT5 || !LayeredT4Assets.loaded.coreBaseT5.meteor) {
            ctx.drawImage(LayeredT4Assets.coreBase.meteor, -170 * u * mScale, -140 * u * mScale, 340 * u * mScale, 280 * u * mScale);
          } else if (t5Prog >= 0.999) {
            ctx.drawImage(LayeredT4Assets.coreBaseT5.meteor, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
          } else {
            ctx.save();
            ctx.globalAlpha = 1.0 - t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBase.meteor, -170 * u * mScale, -140 * u * mScale, 340 * u * mScale, 280 * u * mScale);
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = t5Ease;
            ctx.drawImage(LayeredT4Assets.coreBaseT5.meteor, -t5Size * 0.5, -t5Size * 0.5, t5Size, t5Size);
            ctx.restore();
          }
        }

        drawMeteorMagmaFissuresAndPlates(ctx, 68 * u, now, 0.0, Math.sin(now * 0.0008) * 0.14, tierIdx);
        drawMeteorMoltenRingsHalf(ctx, u, now, true, tierIdx);

        // ─── TIER V SERAPHIC EVOLUTION: Equatorial Asteroid Belt & Solar Coronal Flares ───
        if (cTier > 4.0) {
          const t5Alpha = Math.min(1.0, (cTier - 4.0) * 1.0);
          ctx.save();
          ctx.globalAlpha = t5Alpha;
          ctx.globalCompositeOperation = 'lighter';

          // 1. Equatorial 3D Asteroid Belt with orbiting molten micro-asteroids (Proportionate to 72.0 * u core)
          const beltRx = 92 * u;
          const beltRy = 30 * u;
          const beltAngle = 0.48; // 28 deg tilt
          ctx.save();
          ctx.rotate(beltAngle);

          // Orbit guide ring
          ctx.beginPath();
          ctx.ellipse(0, 0, beltRx, beltRy, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
          ctx.lineWidth = 1.2 * u;
          ctx.stroke();

          // 16 Orbiting Molten Micro-Asteroids
          const astBase = now * 0.0022;
          for (let a = 0; a < 16; a++) {
            const theta = astBase + (a * Math.PI * 2) / 16;
            const ax = Math.cos(theta) * beltRx;
            const ay = Math.sin(theta) * beltRy;
            const aZ = Math.sin(theta); // Front vs back
            const aSize = (2.0 + (a % 3) * 0.8) * (0.8 + 0.4 * aZ) * u;

            const astGrad = ctx.createRadialGradient(ax, ay, 0, ax, ay, aSize * 1.8);
            astGrad.addColorStop(0.0, '#ffffff');
            astGrad.addColorStop(0.35, '#fde047');
            astGrad.addColorStop(0.70, '#ea580c');
            astGrad.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
            ctx.fillStyle = astGrad;
            ctx.beginPath();
            ctx.arc(ax, ay, aSize * 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 2. Coronal Solar Prominence Loops
          for (let p = 0; p < 6; p++) {
            const pa = now * 0.0012 + (p * Math.PI / 3);
            const pr = 68 * u;
            const px1 = Math.cos(pa - 0.22) * pr;
            const py1 = Math.sin(pa - 0.22) * pr;
            const px2 = Math.cos(pa + 0.22) * pr;
            const py2 = Math.sin(pa + 0.22) * pr;
            const cpx = Math.cos(pa) * (pr + 16 * u);
            const cpy = Math.sin(pa) * (pr + 16 * u);
            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.quadraticCurveTo(cpx, cpy, px2, py2);
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.55 + 0.35 * Math.sin(now * 0.004 + p)})`;
            ctx.lineWidth = 1.8 * u;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
          ctx.restore();
        }

        ctx.restore();
      }

      // UPGRADE 5: Magnetic Lock-On Anticipation Rim Arc when a node enters the horizon
      if (CoreKinematics.lockOnProximity > 0.15) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const aimAngle = -Math.PI * 0.5 + Math.max(-0.45, Math.min(0.45, CoreKinematics.lockOnDX * 0.0045));
        const rimR = (mode === 'helix' ? 82 : 72) * u;
        ctx.beginPath();
        ctx.arc(0, 0, rimR, aimAngle - 0.32, aimAngle + 0.32);
        ctx.strokeStyle = `rgba(255, 255, 255, ${CoreKinematics.lockOnProximity * 0.65})`;
        ctx.lineWidth = 2.2 * u;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // End shared core/wing bank

      // 1:1 Tactical Crosshair Reticle around Core Cursor
      CoreKinematics.drawCursorReticle(ctx, 0, 0, u, now);

      // Mode-Specific 5-Second Aegis Spherical Geodesic Forcefield (Simultaneous with all active power-ups!)
      const activeShield = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
      if (activeShield && activeShield.expiresAt > now) {
        CoreKinematics.drawAegisForcefield(ctx, 0, 0, u, now, activeShield.expiresAt - now, mode);
      }

      ctx.restore(); // End core translate

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

    drawDynamoCore(ctx, cx, cy, now, progress = 0, tier = 1, customScale = null) {
      this._drawLayeredWingedCore(ctx, 'dynamo', cx, cy, now, tier, customScale);
    },

    drawHelixCore(ctx, cx, cy, now, progress = 0, tier = 1, customScale = null) {
      this._drawLayeredWingedCore(ctx, 'helix', cx, cy, now, tier, customScale);
    },

    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0, tier = 1, customScale = null) {
      this._drawLayeredWingedCore(ctx, 'meteor', cx, cy, now, tier, customScale);
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SCIENTIFIC REALM WAKE ENGINE (Aligned to Origin, Story & 6 Concept References)
    // Dynamo: Faraday Lichtenberg Dielectric Lightning (Good) / Short-Circuit Crimson Static (Bad)
    // Helix:  3D Rotating Cyan-Magenta DNA Double Helix (Good) / Severed Unraveled Prion Strand (Bad)
    // Meteor: Turbulent Solar-Gold Atmospheric Ablation Fire (Good) / Abyssal-Emerald Isotope Vapor (Bad)
    // ─────────────────────────────────────────────────────────────────────────
    _drawScientificNodeWake(ctx, mode, p, targetR, scale, now, isHazard, isPowered) {
      const animPhase = p.animPhase || 0.0;
      const modeKey = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
      const powerBoost = isPowered ? 1.24 : 1.0;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      if (!isHazard) {
        if (modeKey === 'dynamo') {
          // ═══ DYNAMO GOOD WAKE: Ionized Cobalt-Violet Mist + Forked Lichtenberg Dielectric Lightning (Images #3 & #4!) ═══
          const wakeLen = targetR * 3.55 * powerBoost;
          // 1. Rich ionized cobalt-violet plasma sheath (scaled circle -> pure alpha=0 inside bounds!)
          ctx.save();
          ctx.translate(0, -wakeLen * 0.44);
          ctx.scale(0.46, 1.0);
          const hazeGrad = ctx.createRadialGradient(0, wakeLen * 0.24, targetR * 0.14, 0, 0, wakeLen * 0.74);
          hazeGrad.addColorStop(0.0, isPowered ? 'rgba(125, 211, 252, 0.44)' : 'rgba(99, 102, 241, 0.40)');
          hazeGrad.addColorStop(0.42, 'rgba(79, 70, 229, 0.24)');
          hazeGrad.addColorStop(0.75, 'rgba(67, 56, 202, 0.08)');
          hazeGrad.addColorStop(1.0, 'rgba(49, 46, 129, 0)');
          ctx.fillStyle = hazeGrad;
          ctx.beginPath();
          ctx.arc(0, 0, wakeLen * 0.74, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Crisp branching high-voltage Lichtenberg lightning anchored at orb's ionized plasma stem!
          //    (Non-2*PI irrational step frequencies ensure genuine sharp jagged dielectric zig-zags — ZERO parallel waves!)
          const tick = Math.floor(now / 45) + Math.floor(animPhase * 17);
          const boltCount = isPowered ? 3 : 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let b = 0; b < boltCount; b++) {
            const pts = [];
            const segs = 9;
            const fanDir = (boltCount === 2) ? (b === 0 ? -0.55 : 0.55) : (b - 1) * 0.72;
            for (let s = 0; s <= segs; s++) {
              const frac = s / segs;
              // Irrational frequencies (2.17, 3.83) produce authentic sharp alternating lightning kinks
              const jag = Math.sin(tick * 2.71 + b * 4.19 + s * 2.17 + animPhase * 3.1) * 0.62
                        + Math.cos(tick * 4.33 + b * 2.87 + s * 3.83) * 0.38;
              const amp = targetR * (0.34 + frac * 0.30) * (s === 0 ? 0.0 : Math.min(1.0, frac * 2.2));
              const px = fanDir * targetR * (0.14 + frac * 0.55) + jag * amp;
              const py = -targetR * 0.72 - frac * wakeLen;
              pts.push({ x: px, y: py });
            }

            // Outer electric-blue / violet plasma glow
            const bGrad = ctx.createLinearGradient(0, -targetR * 0.6, 0, -targetR * 0.7 - wakeLen);
            bGrad.addColorStop(0.0, isPowered ? 'rgba(250, 204, 21, 0.88)' : 'rgba(56, 189, 248, 0.92)');
            bGrad.addColorStop(0.40, 'rgba(99, 102, 241, 0.75)');
            bGrad.addColorStop(1.0, 'rgba(139, 92, 246, 0)');
            ctx.strokeStyle = bGrad;
            ctx.lineWidth = (isPowered ? 4.6 : 3.8) * scale;
            ctx.beginPath();
            for (let s = 0; s < pts.length; s++) {
              if (s === 0) ctx.moveTo(pts[s].x, pts[s].y);
              else ctx.lineTo(pts[s].x, pts[s].y);
            }
            ctx.stroke();

            // Blinding ice-white high-voltage filament core
            const cGrad = ctx.createLinearGradient(0, -targetR * 0.6, 0, -targetR * 0.7 - wakeLen);
            cGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
            cGrad.addColorStop(0.55, isPowered ? 'rgba(254, 240, 138, 0.80)' : 'rgba(186, 230, 253, 0.80)');
            cGrad.addColorStop(1.0, 'rgba(165, 180, 252, 0)');
            ctx.strokeStyle = cGrad;
            ctx.lineWidth = 1.45 * scale;
            ctx.stroke();

            // Twin Lichtenberg crackling side-forks fanning off segments 2 and 5
            const forkIdxs = [2, 5];
            for (let fi = 0; fi < forkIdxs.length; fi++) {
              const fRoot = pts[forkIdxs[fi]];
              const forkDir = (((tick + b + fi) % 2 === 0) ? 1 : -1);
              const fmX = fRoot.x + forkDir * targetR * (0.28 + fi * 0.08);
              const fmY = fRoot.y - targetR * 0.36;
              const feX = fmX + forkDir * targetR * 0.24 + Math.sin(tick * 3.1 + fi) * targetR * 0.14;
              const feY = fmY - targetR * 0.34;
              ctx.strokeStyle = isPowered ? 'rgba(253, 224, 71, 0.60)' : 'rgba(125, 211, 252, 0.65)';
              ctx.lineWidth = 1.45 * scale;
              ctx.beginPath();
              ctx.moveTo(fRoot.x, fRoot.y);
              ctx.lineTo(fmX, fmY);
              ctx.lineTo(feX, feY);
              ctx.stroke();
            }
          }

        } else if (modeKey === 'helix') {
          // ═══ HELIX GOOD WAKE: 3D Rotating Cyan-Magenta Double-Helix DNA Ribbon + Base-Pair Rungs! ═══
          const wakeLen = targetR * 3.85 * powerBoost;
          const twistBase = now * 0.0052 + animPhase;
          const samples = 22;

          // 1. Ethereal bioluminescent cyan-magenta mist enveloping the trailing helix
          ctx.save();
          ctx.translate(0, -wakeLen * 0.48);
          ctx.scale(0.38, 1.0);
          const mGrad = ctx.createRadialGradient(0, wakeLen * 0.20, targetR * 0.12, 0, 0, wakeLen * 0.70);
          mGrad.addColorStop(0.0, 'rgba(34, 211, 238, 0.26)');
          mGrad.addColorStop(0.45, 'rgba(232, 121, 249, 0.16)');
          mGrad.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = mGrad;
          ctx.beginPath();
          ctx.arc(0, 0, wakeLen * 0.70, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Compute 3D sinusoidal double-strand coordinates tapering cleanly toward tail tip
          const strandA = [];
          const strandB = [];
          for (let s = 0; s <= samples; s++) {
            const frac = s / samples;
            const y = -targetR * 0.62 - frac * wakeLen;
            const env = (1.0 - frac * 0.72) * (0.78 + 0.22 * Math.sin(frac * Math.PI));
            const amp = targetR * (isPowered ? 0.54 : 0.46) * env;
            const ang = twistBase + frac * Math.PI * 3.4;
            const xA = Math.sin(ang) * amp;
            const zA = Math.cos(ang);
            strandA.push({ x: xA, y, z: zA, frac });
            strandB.push({ x: -xA, y, z: -zA, frac });
          }

          // 2. Hydrogen-Bonded Base-Pair Rungs (A-T / C-G) connecting twin strands
          ctx.lineCap = 'round';
          for (let s = 1; s < samples; s += 2) {
            const pA = strandA[s];
            const pB = strandB[s];
            const fade = Math.pow(1.0 - pA.frac, 1.15);
            const rGrad = ctx.createLinearGradient(pA.x, pA.y, pB.x, pB.y);
            rGrad.addColorStop(0.0, `rgba(34, 211, 238, ${0.72 * fade})`);
            rGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.65 * fade})`);
            rGrad.addColorStop(1.0, `rgba(232, 121, 249, ${0.72 * fade})`);
            ctx.strokeStyle = rGrad;
            ctx.lineWidth = Math.max(0.8, 1.35 * scale * (1.0 - pA.frac * 0.4));
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }

          // 3. Twin Luminous Sugar-Phosphate Backbones (Cyan Strand + Magenta Strand with Specular Core)
          const drawHelixStrand = (pts, outerCol, innerCol) => {
            for (let s = 0; s < pts.length - 1; s++) {
              const a = pts[s];
              const b = pts[s + 1];
              const fade = Math.pow(1.0 - a.frac, 1.05);
              const depthBoost = 0.72 + 0.28 * ((a.z + 1) * 0.5);
              const wBase = (isPowered ? 4.2 : 3.5) * scale * (1.0 - a.frac * 0.55) * depthBoost;

              ctx.strokeStyle = `${outerCol}${0.72 * fade * depthBoost})`;
              ctx.lineWidth = wBase;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();

              ctx.strokeStyle = `${innerCol}${0.90 * fade * depthBoost})`;
              ctx.lineWidth = Math.max(0.7, wBase * 0.36);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          };
          drawHelixStrand(strandA, 'rgba(34, 211, 238, ', 'rgba(224, 242, 254, ');
          drawHelixStrand(strandB, isPowered ? 'rgba(251, 191, 36, ' : 'rgba(232, 121, 249, ', 'rgba(253, 242, 248, ');

        } else {
          // ═══ METEOR GOOD WAKE: Cohesive Turbulent Atmospheric Re-Entry Fire & Spallation Embers (Images #2 & #5!) ═══
          const wakeLen = targetR * 3.15 * powerBoost;

          // 1. Soft atmospheric ablation heat glow (scaled circle -> pure alpha=0 inside bounds, ZERO oval edge!)
          ctx.save();
          ctx.translate(0, -wakeLen * 0.36);
          ctx.scale(0.56, 1.0);
          const hRad = wakeLen * 0.78;
          const mHaze = ctx.createRadialGradient(0, hRad * 0.26, targetR * 0.18, 0, 0, hRad);
          mHaze.addColorStop(0.0, isPowered ? 'rgba(254, 240, 138, 0.44)' : 'rgba(251, 191, 36, 0.38)');
          mHaze.addColorStop(0.38, 'rgba(249, 115, 22, 0.24)');
          mHaze.addColorStop(0.74, 'rgba(194, 65, 12, 0.08)');
          mHaze.addColorStop(1.0, 'rgba(154, 52, 18, 0)');
          ctx.fillStyle = mHaze;
          ctx.beginPath();
          ctx.arc(0, 0, hRad, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Cohesive unified sinuous atmospheric fire plume hugging the bolide (NO separated crown spikes!)
          const plumes = [
            { ox: 0.00, w: 1.02, h: 1.00, spd: 0.020, ph: 0.0, curl: 0.28 },
            { ox: -0.28, w: 0.72, h: 0.74, spd: 0.026, ph: 1.6, curl: -0.32 },
            { ox: 0.28, w: 0.72, h: 0.74, spd: 0.024, ph: 3.1, curl: 0.32 }
          ];
          for (let pl = 0; pl < plumes.length; pl++) {
            const pg = plumes[pl];
            const w1 = Math.sin(now * pg.spd + pg.ph + animPhase);
            const w2 = Math.cos(now * pg.spd * 1.4 + pg.ph + animPhase);
            const tipSway = (w1 * 0.26 + pg.curl * 0.20) * targetR;
            const midSway = (-w1 * 0.16 + pg.curl * 0.14) * targetR;
            const tipY = -targetR * 0.55 - wakeLen * pg.h * (0.86 + 0.14 * w2);
            const baseW = targetR * pg.w;
            const baseX = targetR * pg.ox;

            const pGrad = ctx.createLinearGradient(baseX, targetR * 0.28, baseX + tipSway, tipY);
            pGrad.addColorStop(0.0, 'rgba(255, 251, 214, 0.68)');
            pGrad.addColorStop(0.32, isPowered ? 'rgba(250, 204, 21, 0.64)' : 'rgba(251, 146, 60, 0.60)');
            pGrad.addColorStop(0.68, 'rgba(234, 88, 12, 0.28)');
            pGrad.addColorStop(1.0, 'rgba(180, 40, 12, 0)');
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.moveTo(baseX - baseW * 0.88, targetR * 0.08);
            ctx.bezierCurveTo(baseX - baseW * 0.96 + midSway, tipY * 0.30, baseX + tipSway - baseW * 0.36, tipY * 0.72, baseX + tipSway, tipY);
            ctx.bezierCurveTo(baseX + tipSway + baseW * 0.36, tipY * 0.72, baseX + baseW * 0.96 + midSway, tipY * 0.30, baseX + baseW * 0.88, targetR * 0.08);
            ctx.quadraticCurveTo(baseX, targetR * 0.66, baseX - baseW * 0.88, targetR * 0.08);
            ctx.closePath();
            ctx.fill();
          }

          // 2b. Rolling Turbulent Atmospheric Fire Billows Rising Continuously From the Crust!
          for (let fb = 0; fb < 5; fb++) {
            const fp = ((now * 0.0026 + fb * 0.20 + animPhase) % 1.0);
            const fx = Math.sin(now * 0.009 + fb * 2.4 + animPhase) * targetR * (0.46 - fp * 0.26);
            const fy = -targetR * 0.10 - fp * wakeLen * 0.88;
            const fr = targetR * (0.58 * (1.0 - fp * 0.56));
            const fa = Math.sin(fp * Math.PI) * 0.56;
            const fbg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
            fbg.addColorStop(0.0, `rgba(255, 248, 210, ${fa})`);
            fbg.addColorStop(0.45, `rgba(251, 146, 60, ${fa * 0.82})`);
            fbg.addColorStop(0.80, `rgba(220, 38, 38, ${fa * 0.30})`);
            fbg.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
            ctx.fillStyle = fbg;
            ctx.beginPath();
            ctx.arc(fx, fy, fr, 0, Math.PI * 2);
            ctx.fill();
          }

          // 3. Incandescent spallation ember sparks flaking off into the re-entry wake
          for (let em = 0; em < 6; em++) {
            const eProg = ((now * 0.0024 + em * 0.167 + animPhase) % 1.0);
            const ex = Math.sin(now * 0.007 + em * 2.5 + animPhase) * targetR * (0.62 - eProg * 0.22);
            const ey = -targetR * 0.35 - eProg * wakeLen * 1.05;
            const er = Math.max(0.8, (2.6 - eProg * 1.5) * scale);
            const ea = Math.sin(eProg * Math.PI) * 0.92;
            const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2.4);
            eg.addColorStop(0.0, `rgba(255, 255, 230, ${ea})`);
            eg.addColorStop(0.45, `rgba(251, 146, 60, ${ea * 0.82})`);
            eg.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(ex, ey, er * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (!isPowered) {
        // ═══ REGULAR BAD NODE SCIENTIFIC CORRUPTION WAKES (Antimatter Inversion of Each Realm!) ═══
        if (modeKey === 'dynamo') {
          // Inverted Blood-Crimson / Dark-Magenta Short-Circuit Fractured Lightning Wake (Irrational zig-zag freq — ZERO straight sticks!)
          const wakeLen = targetR * 2.65;
          ctx.save();
          ctx.translate(0, -wakeLen * 0.42);
          ctx.scale(0.45, 1.0);
          const chGrad = ctx.createRadialGradient(0, wakeLen * 0.22, targetR * 0.12, 0, 0, wakeLen * 0.72);
          chGrad.addColorStop(0.0, 'rgba(244, 63, 94, 0.36)');
          chGrad.addColorStop(0.50, 'rgba(159, 18, 57, 0.16)');
          chGrad.addColorStop(1.0, 'rgba(136, 19, 55, 0)');
          ctx.fillStyle = chGrad;
          ctx.beginPath();
          ctx.arc(0, 0, wakeLen * 0.72, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          const tick = Math.floor(now / 52) + Math.floor(animPhase * 13);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let b = 0; b < 2; b++) {
            const fan = (b === 0 ? -0.45 : 0.45);
            const pts = [];
            for (let s = 0; s <= 7; s++) {
              const f = s / 7;
              // Irrational frequencies (2.37, 3.91) guarantee sharp erratic short-circuit zig-zags!
              const j = (Math.sin(tick * 3.13 + b * 4.71 + s * 2.37 + animPhase) * 0.65
                       + Math.cos(tick * 5.21 + b * 2.19 + s * 3.91) * 0.35) * targetR * (0.42 + f * 0.22);
              pts.push({
                x: fan * targetR * (0.12 + f * 0.55) + j * (s === 0 ? 0.0 : 1.0),
                y: -targetR * 0.55 - f * wakeLen
              });
            }
            const cGrad = ctx.createLinearGradient(0, -targetR * 0.45, 0, -targetR * 0.55 - wakeLen);
            cGrad.addColorStop(0.0, 'rgba(244, 63, 94, 0.88)');
            cGrad.addColorStop(0.55, 'rgba(190, 18, 60, 0.48)');
            cGrad.addColorStop(1.0, 'rgba(136, 19, 55, 0)');
            ctx.strokeStyle = cGrad;
            ctx.lineWidth = 3.4 * scale;
            ctx.beginPath();
            for (let s = 0; s < pts.length; s++) {
              if (s === 0) ctx.moveTo(pts[s].x, pts[s].y);
              else ctx.lineTo(pts[s].x, pts[s].y);
            }
            ctx.stroke();

            ctx.strokeStyle = 'rgba(254, 205, 211, 0.78)';
            ctx.lineWidth = 1.15 * scale;
            ctx.stroke();

            // Short crackling red static side-arc
            const sr = pts[3];
            const sDir = (b === 0 ? -1 : 1);
            ctx.strokeStyle = 'rgba(251, 113, 133, 0.62)';
            ctx.lineWidth = 1.3 * scale;
            ctx.beginPath();
            ctx.moveTo(sr.x, sr.y);
            ctx.lineTo(sr.x + sDir * targetR * 0.34, sr.y - targetR * 0.28);
            ctx.stroke();
          }

        } else if (modeKey === 'helix') {
          // Severed, Frayed, Unraveling Dark-Crimson & Shadow-Violet Mutated Prion DNA Wake!
          const wakeLen = targetR * 2.95;
          ctx.save();
          ctx.translate(0, -wakeLen * 0.45);
          ctx.scale(0.42, 1.0);
          const pmGrad = ctx.createRadialGradient(0, wakeLen * 0.22, targetR * 0.12, 0, 0, wakeLen * 0.72);
          pmGrad.addColorStop(0.0, 'rgba(225, 29, 72, 0.34)');
          pmGrad.addColorStop(0.52, 'rgba(147, 51, 234, 0.16)');
          pmGrad.addColorStop(1.0, 'rgba(88, 28, 135, 0)');
          ctx.fillStyle = pmGrad;
          ctx.beginPath();
          ctx.arc(0, 0, wakeLen * 0.72, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          const twist = now * 0.0044 + animPhase;
          ctx.lineCap = 'round';
          for (let strand = -1; strand <= 1; strand += 2) {
            ctx.beginPath();
            const segs = 12;
            for (let s = 0; s <= segs; s++) {
              const f = s / segs;
              const fray = (1.0 + f * 0.70);
              const jag = Math.sin(s * 2.41 + animPhase * 5.0) * targetR * 0.14 * f;
              const sx = Math.sin(twist + f * Math.PI * 2.3) * targetR * 0.38 * strand * fray + jag;
              const sy = -targetR * 0.55 - f * wakeLen;
              if (s === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            const uGrad = ctx.createLinearGradient(0, -targetR * 0.5, 0, -targetR * 0.55 - wakeLen);
            uGrad.addColorStop(0.0, strand < 0 ? 'rgba(244, 63, 94, 0.88)' : 'rgba(192, 132, 252, 0.78)');
            uGrad.addColorStop(0.60, 'rgba(190, 18, 60, 0.42)');
            uGrad.addColorStop(1.0, 'rgba(88, 28, 135, 0)');
            ctx.strokeStyle = uGrad;
            ctx.lineWidth = 3.0 * scale;
            ctx.stroke();
          }
          // Snapped half-rungs jutting brokenly inward
          for (let r = 1; r <= 5; r++) {
            const f = r / 6.0;
            const sy = -targetR * 0.62 - f * wakeLen;
            const sx = Math.sin(twist + f * Math.PI * 2.3) * targetR * 0.40;
            ctx.strokeStyle = `rgba(253, 164, 175, ${0.72 * (1.0 - f)})`;
            ctx.lineWidth = 1.4 * scale;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx * 0.22, sy - 3.5 * scale);
            ctx.stroke();
          }

        } else {
          // Blighted Cryo-Obsidian Radioactive Abyssal-Emerald & Amethyst Vapor Wake!
          const wakeLen = targetR * 2.65;
          ctx.save();
          ctx.translate(0, -wakeLen * 0.42);
          ctx.scale(0.48, 1.0);
          const vRad = wakeLen * 0.74;
          const vGrad = ctx.createRadialGradient(0, vRad * 0.22, targetR * 0.15, 0, 0, vRad);
          vGrad.addColorStop(0.0, 'rgba(16, 185, 129, 0.36)');
          vGrad.addColorStop(0.45, 'rgba(147, 51, 234, 0.22)');
          vGrad.addColorStop(1.0, 'rgba(88, 28, 135, 0)');
          ctx.fillStyle = vGrad;
          ctx.beginPath();
          ctx.arc(0, 0, vRad, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Floating radioactive emerald-amethyst crystal decay motes
          for (let m = 0; m < 4; m++) {
            const mp = ((now * 0.0022 + m * 0.25 + animPhase) % 1.0);
            const mx = Math.sin(now * 0.005 + m * 2.1 + animPhase) * targetR * 0.48;
            const my = -targetR * 0.45 - mp * wakeLen * 0.90;
            const ma = Math.sin(mp * Math.PI) * 0.85;
            const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 4.5 * scale);
            mg.addColorStop(0.0, `rgba(255, 255, 255, ${ma})`);
            mg.addColorStop(0.45, m % 2 === 0 ? `rgba(16, 185, 129, ${ma * 0.85})` : `rgba(192, 132, 252, ${ma * 0.85})`);
            mg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = mg;
            ctx.beginPath();
            ctx.arc(mx, my, 4.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    },

    _drawLayeredNodeOrHazard(ctx, mode, p, now, customR = null) {
      const isHazard = isHazardNode(p.nodeClass);
      const isPoweredGood = (!isHazard && p.nodeClass !== 'standard');
      const isPoweredBad = (isHazard && (
        p.nodeClass === 'hyper_comet' || p.nodeClass === 'plasma_flare' ||
        p.nodeClass === 'corruptor_laser' || p.nodeClass === 'gravity_well' || p.nodeClass === 'vortex' ||
        p.nodeClass === 'emp_detonator' || p.nodeClass === 'emp_glitch' || p.nodeClass === 'pulsar_mine' ||
        p.nodeClass === 'phase_stalker' || p.nodeClass === 'tachyon_fracture'
      ));
      const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
      const isMobile = canvasW < 600;
      const baseR = customR || (isMobile ? 26.0 : 36.0);
      const targetR = customR || (p.headR ? (p.headR * (isMobile ? 0.72 : 1.0)) : baseR);
      const scale = targetR / 48.0;
      const animPhase = p.animPhase || 0.0;

      CoreKinematics.emitNodeWorldStreaks(p, targetR, mode, isHazard, 1.0, now);

      ctx.save();
      ctx.translate(p.x, p.y);

      // Phantom Hazard cloaking opacity
      if (p.nodeClass === 'phantom') {
        ctx.globalAlpha = (p.phantomAlpha !== undefined) ? p.phantomAlpha : 1.0;
      }

      // Render Scientific Game-Aligned Trailing Wake behind every Good, Powered-Good, and Regular-Bad node!
      this._drawScientificNodeWake(ctx, mode, p, targetR, scale, now, isHazard, isHazard ? isPoweredBad : isPoweredGood);

      if (!isHazard) {
        if (mode === 'dynamo' || mode === 'realm') {
          // Iconic Quantum Plasma Purple Glass Orb (enhanced with Dual-Polarity Anode-Gold / Cathode-Cyan Rim!)
          if (LayeredT4Assets.loaded.nodeShell.dynamo) {
            ctx.drawImage(LayeredT4Assets.nodeShell.dynamo, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          } else {
            // High-fidelity procedural fallback: deep cosmic purple glass plasma sphere
            const pOrb = ctx.createRadialGradient(-targetR * 0.28, -targetR * 0.32, targetR * 0.05, 0, 0, targetR);
            pOrb.addColorStop(0.0, 'rgba(216, 180, 254, 0.95)');
            pOrb.addColorStop(0.28, 'rgba(147, 51, 234, 0.92)');
            pOrb.addColorStop(0.68, 'rgba(88, 28, 135, 0.95)');
            pOrb.addColorStop(0.95, 'rgba(59, 7, 100, 1.0)');
            pOrb.addColorStop(1.0, 'rgba(30, 4, 55, 0.85)');
            ctx.fillStyle = pOrb;
            ctx.beginPath();
            ctx.arc(0, 0, targetR, 0, Math.PI * 2);
            ctx.fill();
          }
          drawInternalPlasmaArcs(ctx, 0, 0, targetR * 0.86, now, animPhase, false, 4);

          // Dual-Polarity Fresnel Rim Polarization (Matches uploaded Dynamo concept images #3 & #4!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          // Left-bottom Warm Gold Anode Rim
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 0.96, Math.PI * 0.62, Math.PI * 1.48);
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.58)';
          ctx.lineWidth = 2.4 * scale;
          ctx.stroke();
          // Right-top Cool Electric-Cyan Cathode Rim
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 0.96, -Math.PI * 0.38, Math.PI * 0.45);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.62)';
          ctx.lineWidth = 2.4 * scale;
          ctx.stroke();
          ctx.restore();

          // Outer Resonance Ring & Twin Satellite Motes
          const ringR = targetR * 1.16;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
          ctx.lineWidth = 1.4 * scale;
          ctx.stroke();

          const moteAngle = now * 0.0035 + animPhase;
          const mx1 = Math.cos(moteAngle) * ringR;
          const my1 = Math.sin(moteAngle) * ringR * 0.55;
          ctx.beginPath();
          ctx.arc(mx1, my1, 4.2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#00f0ff';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(mx1, my1, 1.8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          const mx2 = -mx1;
          const my2 = -my1;
          ctx.beginPath();
          ctx.arc(mx2, my2, 4.2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#c084fc';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(mx2, my2, 1.8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else if (mode === 'helix') {
          if (LayeredT4Assets.loaded.nodeShell.helix) {
            ctx.drawImage(LayeredT4Assets.nodeShell.helix, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          drawRotating3DDNAInsideGlass(ctx, 0, 0, targetR * 0.36, targetR * 0.78, now, animPhase, false, 4);

          // Bioluminescent Quartz Glass Rim & Swirling Core Highlight (Matches uploaded Helix images #1 & #6!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const hRim = ctx.createRadialGradient(-targetR * 0.25, -targetR * 0.30, targetR * 0.08, 0, 0, targetR * 1.04);
          hRim.addColorStop(0.0, 'rgba(255, 255, 255, 0.28)');
          hRim.addColorStop(0.55, 'rgba(232, 121, 249, 0.14)');
          hRim.addColorStop(0.88, 'rgba(34, 211, 238, 0.34)');
          hRim.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
          ctx.fillStyle = hRim;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 1.04, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          const tumbleDir = p.tumbleDir || 1;
          const rockAngle = now * 0.00145 * tumbleDir + animPhase;

          ctx.save();
          ctx.rotate(rockAngle);
          if (LayeredT4Assets.loaded.nodeShell.meteor) {
            ctx.drawImage(LayeredT4Assets.nodeShell.meteor, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
          }
          ctx.restore();

          drawMeteorMagmaFissuresAndPlates(ctx, targetR, now, animPhase, rockAngle, 4);

          // Incandescent Atmospheric Bow-Shock Plasma Rim hugging leading lower edge (Matches uploaded Meteor images #2 & #5!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const bowGlow = ctx.createRadialGradient(0, targetR * 0.35, targetR * 0.12, 0, targetR * 0.25, targetR * 1.18);
          bowGlow.addColorStop(0.0, 'rgba(254, 249, 195, 0.42)');
          bowGlow.addColorStop(0.45, 'rgba(251, 146, 60, 0.28)');
          bowGlow.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = bowGlow;
          ctx.beginPath();
          ctx.arc(0, targetR * 0.25, targetR * 1.18, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // BESPOKE 3D RENDERING FOR COLLECTIBLE ARCHETYPES (Enhanced with Scientific Visual Metaphors):
        if (p.nodeClass === 'cluster') {
          // BIFURCATION FLUX NODE (CLUSTER DOUBLER / 2X DUP — Mitotic/Quantum Split Satellites!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const pulseR = targetR * (1.18 + 0.06 * Math.sin(now * 0.006 + animPhase));
          ctx.beginPath();
          ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.44)';
          ctx.lineWidth = 1.4 * scale;
          ctx.stroke();

          // Twin phase-locked bifurcation twin orbs orbiting 180° apart
          const bAng = now * 0.0042 + animPhase;
          for (let bSide = -1; bSide <= 1; bSide += 2) {
            const bx = Math.cos(bAng) * pulseR * bSide;
            const by = Math.sin(bAng) * pulseR * 0.62 * bSide;
            const bGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 7.5 * scale);
            bGlow.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
            bGlow.addColorStop(0.45, bSide > 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(232, 121, 249, 0.85)');
            bGlow.addColorStop(1.0, 'rgba(192, 132, 252, 0)');
            ctx.fillStyle = bGlow;
            ctx.beginPath();
            ctx.arc(bx, by, 7.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

        } else if (p.nodeClass === 'supercharge') {
          // DELUXE SOLAR HYPER-SURGE CORE: Warm golden solar plasma & elegant prominence loops (No harsh white washout, zero rigid spikes!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          // 1. Soft atmospheric solar plasma corona
          const coronaR = targetR * (1.18 + 0.12 * Math.sin(now * 0.007 + animPhase));
          const gradCorona = ctx.createRadialGradient(0, 0, targetR * 0.25, 0, 0, coronaR);
          gradCorona.addColorStop(0.0, 'rgba(254, 240, 138, 0.45)');
          gradCorona.addColorStop(0.4, 'rgba(245, 158, 11, 0.38)');
          gradCorona.addColorStop(0.8, 'rgba(217, 119, 6, 0.18)');
          gradCorona.addColorStop(1.0, 'rgba(180, 83, 9, 0)');
          ctx.fillStyle = gradCorona;
          ctx.beginPath();
          ctx.arc(0, 0, coronaR, 0, Math.PI * 2);
          ctx.fill();

          // 2. Three Organic Curving Solar Prominence Arches (Magnetic loops)
          const promAngle = now * 0.0022 + animPhase;
          for (let pIdx = 0; pIdx < 3; pIdx++) {
            const pa = promAngle + (pIdx * Math.PI * 2 / 3);
            const rInner = targetR * 0.85;
            const rOuter = targetR * (1.25 + 0.10 * Math.sin(now * 0.005 + pIdx * 1.8));
            const p1x = Math.cos(pa - 0.32) * rInner;
            const p1y = Math.sin(pa - 0.32) * rInner;
            const p2x = Math.cos(pa + 0.32) * rInner;
            const p2y = Math.sin(pa + 0.32) * rInner;
            const cpx = Math.cos(pa) * rOuter;
            const cpy = Math.sin(pa) * rOuter;
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.quadraticCurveTo(cpx, cpy, p2x, p2y);
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.60 + 0.25 * Math.sin(now * 0.004 + pIdx)})`;
            ctx.lineWidth = 2.2 * scale;
            ctx.lineCap = 'round';
            ctx.stroke();
          }

          // 3. Gentle rotating solar flare filaments
          const flareR = targetR * 0.95;
          ctx.beginPath();
          ctx.arc(0, 0, flareR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
          ctx.lineWidth = 1.4 * scale;
          ctx.stroke();
          ctx.restore();

        } else if (p.nodeClass === 'chronos') {
          // CHRONOS STASIS PEARL: Frosted Relativistic Time-Dilation Ripple + Crystalline Chronometer Reticle
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const dilPhase = (now * 0.0022 + animPhase) % 1.0;
          const dilR = targetR * (1.05 + dilPhase * 0.50);
          const dilG = ctx.createRadialGradient(0, 0, dilR * 0.65, 0, 0, dilR);
          dilG.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          dilG.addColorStop(0.75, `rgba(103, 232, 249, ${(1.0 - dilPhase) * 0.36})`);
          dilG.addColorStop(1.0, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = dilG;
          ctx.beginPath();
          ctx.arc(0, 0, dilR, 0, Math.PI * 2);
          ctx.fill();

          const reticleR = targetR * 1.28;
          ctx.beginPath();
          ctx.arc(0, 0, reticleR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // 12 Chronometer Ticks
          const tickRot = now * 0.002;
          for (let t = 0; t < 12; t++) {
            const ta = tickRot + (t * Math.PI / 6);
            const isMajor = (t % 3 === 0);
            const tLen = isMajor ? 5 * scale : 2.5 * scale;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ta) * reticleR, Math.sin(ta) * reticleR);
            ctx.lineTo(Math.cos(ta) * (reticleR - tLen), Math.sin(ta) * (reticleR - tLen));
            ctx.strokeStyle = isMajor ? '#38bdf8' : 'rgba(147, 197, 253, 0.6)';
            ctx.lineWidth = isMajor ? 2.0 : 1.2;
            ctx.stroke();
          }
          ctx.restore();

        } else if (p.nodeClass === 'singularity') {
          // GRAVITON SINGULARITY NODE: Celestial Gold & Starlight Cyan Accretion Discs + Inward Geodesic Motes
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const vortexAngle = -now * 0.008;
          for (let v = 0; v < 3; v++) {
            const va = vortexAngle + (v * Math.PI * 2 / 3);
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (1.15 + v * 0.15), va, va + 1.2);
            ctx.strokeStyle = (v % 2 === 0) ? `rgba(56, 189, 248, ${0.85 - v * 0.20})` : `rgba(254, 240, 138, ${0.85 - v * 0.20})`;
            ctx.lineWidth = 2.4;
            ctx.stroke();
          }
          for (let gm = 0; gm < 4; gm++) {
            const gp = ((now * 0.0020 + gm * 0.25 + animPhase) % 1.0);
            const ga = vortexAngle * 1.4 + gm * (Math.PI / 2) + gp * 1.8;
            const gr = targetR * (1.65 * (1.0 - gp * 0.65));
            const gx = Math.cos(ga) * gr;
            const gy = Math.sin(ga) * gr;
            ctx.fillStyle = gm % 2 === 0 ? `rgba(125, 211, 252, ${Math.sin(gp * Math.PI) * 0.9})` : `rgba(254, 240, 138, ${Math.sin(gp * Math.PI) * 0.9})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 2.2 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

        } else if (p.nodeClass === 'catalyst') {
          // SUPREME VITALITY LIFE RECOVERY NODE (+1 LIFE RESTORATION)
          // 1. Refined Contained Heartbeat Pulse (Soft & Non-Distracting - ZERO Full-Screen Vertical Line!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const heartPhase = (now * 0.005) % 1.0;
          const rRing = targetR * (1.02 + heartPhase * 0.30);
          const aRing = (1.0 - heartPhase) * 0.35;
          ctx.beginPath();
          ctx.arc(0, 0, rRing, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${aRing})`;
          ctx.lineWidth = 1.2 * scale;
          ctx.stroke();

          // 2. Faceted Octahedral Emerald & Diamond Star Core
          const gemRot = now * 0.0028 + animPhase;
          const gemR = targetR * 0.95;
          ctx.save();
          ctx.rotate(gemRot);

          // Outer Vitality Star
          const numPts = 8;
          ctx.beginPath();
          for (let pt = 0; pt < numPts; pt++) {
            const a = (pt * Math.PI * 2) / numPts;
            const r = (pt % 2 === 0) ? gemR : gemR * 0.58;
            const gx = Math.cos(a) * r;
            const gy = Math.sin(a) * r;
            if (pt === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(240, 253, 244, 0.95)';
          ctx.lineWidth = 2.0 * scale;
          ctx.stroke();

          // Internal Brilliant Facets (Emerald Green & Diamond White)
          for (let f = 0; f < numPts; f++) {
            const fa = (f * Math.PI * 2) / numPts;
            const r = (f % 2 === 0) ? gemR : gemR * 0.58;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(fa) * r, Math.sin(fa) * r);
            ctx.strokeStyle = (f % 2 === 0) ? 'rgba(52, 211, 153, 0.90)' : 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 1.4 * scale;
            ctx.stroke();
          }

          // Central Radiant Vitality Heart-Light Core
          const heartGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, gemR * 0.65);
          heartGlow.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
          heartGlow.addColorStop(0.40, 'rgba(52, 211, 153, 0.75)');
          heartGlow.addColorStop(0.75, 'rgba(16, 185, 129, 0.35)');
          heartGlow.addColorStop(1.0, 'rgba(5, 150, 105, 0.0)');
          ctx.fillStyle = heartGlow;
          ctx.beginPath();
          ctx.arc(0, 0, gemR * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 3. Floating Vitality Badge ("💚 +1 LIFE") — render in source-over so pill pops cleanly over bright flames!
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          const badgeText = '💚 +1 LIFE';
          ctx.font = `bold ${Math.round(11 * scale)}px system-ui, -apple-system, sans-serif`;
          const textW = ctx.measureText(badgeText).width;
          const padX = 7 * scale;
          const padY = 3.5 * scale;
          ctx.translate(0, -targetR * 1.35);
          ctx.fillStyle = 'rgba(4, 34, 26, 0.90)';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.2 * scale;
          ctx.beginPath();
          ctx.roundRect(-textW / 2 - padX, -padY - 7 * scale, textW + padX * 2, 16 * scale, 7 * scale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#6ee7b7';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badgeText, 0, 0);
          ctx.restore();

          // 4. Subtle Ambient Motes (Crisp & Non-Distracting)
          for (let s = 0; s < 3; s++) {
            const sAngle = -now * 0.0035 + (s * Math.PI * 2 / 3);
            const sDist = targetR * 1.18;
            const sx = Math.cos(sAngle) * sDist;
            const sy = Math.sin(sAngle) * sDist * 0.70;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.0 * scale, 0, Math.PI * 2);
            ctx.fillStyle = (s % 2 === 0) ? '#34d399' : '#ffffff';
            ctx.fill();
          }
          ctx.restore();

        } else if (p.nodeClass === 'shield') {
          // 5-SECOND AEGIS FORCEFIELD CRYSTAL: Rotating 3D Golden Hexagonal Shield
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const hexAngle = now * 0.0035 + animPhase;
          const hxR = targetR * 1.25;
          ctx.beginPath();
          for (let hx = 0; hx < 6; hx++) {
            const ha = hexAngle + (hx * Math.PI / 3);
            const px = Math.cos(ha) * hxR;
            const py = Math.sin(ha) * hxR;
            if (hx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.4 * scale;
          ctx.stroke();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
          ctx.fill();

          const pCoreR = targetR * (0.45 + 0.15 * Math.sin(now * 0.009));
          const shGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pCoreR);
          shGrad.addColorStop(0.0, '#ffffff');
          shGrad.addColorStop(0.5, '#fef08a');
          shGrad.addColorStop(1.0, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = shGrad;
          ctx.beginPath();
          ctx.arc(0, 0, pCoreR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else if (p.nodeClass === 'missiles') {
          // ALLIED TACTICAL ORDNANCE POD (Electric Cyan & Burnished Aerospace Titanium - Absolutely NO Red!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const podAngle = now * 0.0028 + animPhase;

          // 1. Sleek Hexagonal Titanium Launch Canister
          const podR = targetR * 0.95;
          ctx.beginPath();
          for (let hx = 0; hx < 6; hx++) {
            const ha = podAngle + (hx * Math.PI / 3);
            const px = Math.cos(ha) * podR;
            const py = Math.sin(ha) * podR;
            if (hx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.0 * scale;
          ctx.stroke();

          // 2. 4 Precision Missile Silo Ports with Glowing Cyan/Gold Telemetry LEDs
          const siloDist = podR * 0.52;
          for (let s = 0; s < 4; s++) {
            const sa = podAngle + (s * Math.PI / 2) + Math.PI / 4;
            const sx = Math.cos(sa) * siloDist;
            const sy = Math.sin(sa) * siloDist;

            // Silo launch port
            ctx.beginPath();
            ctx.arc(sx, sy, 4.2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(2, 132, 199, 0.85)';
            ctx.fill();
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 1.0 * scale;
            ctx.stroke();

            // Active guidance rocket warhead tip
            ctx.beginPath();
            ctx.arc(sx, sy, 2.0 * scale, 0, Math.PI * 2);
            ctx.fillStyle = (s % 2 === 0) ? '#38bdf8' : '#fbbf24';
            ctx.fill();
          }

          // 3. Friendly Tactical Radar Alignment Brackets in Electric Cyan (Friendly, NON-HAZARD!)
          const bracketR = targetR * 1.30;
          const radarRot = -now * 0.002;
          for (let b = 0; b < 4; b++) {
            const ba = radarRot + (b * Math.PI / 2);
            ctx.save();
            ctx.translate(Math.cos(ba) * bracketR, Math.sin(ba) * bracketR);
            ctx.rotate(ba);
            ctx.beginPath();
            ctx.moveTo(-5 * scale, 0);
            ctx.lineTo(0, 0);
            ctx.lineTo(0, -5 * scale);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
            ctx.lineWidth = 1.5 * scale;
            ctx.stroke();
            ctx.restore();
          }

          // 4. Pulsing Friendly Telemetry Halo
          const telR = targetR * (1.10 + 0.08 * Math.sin(now * 0.006));
          ctx.beginPath();
          ctx.arc(0, 0, telR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 1.2 * scale;
          ctx.stroke();
          ctx.restore();
        }

        // Floating Holographic Badges for Power-Ups (High-Contrast Dark Obsidian Pill Backdrop so Text Pops Over Bright Flames/Lightning!)
        const badges = {
          shield: { text: '🛡️ SHIELD', color: '#f59e0b', bg: 'rgba(10, 14, 28, 0.88)', border: '#fbbf24' },
          missiles: { text: '🚀 MISSILES', color: '#38bdf8', bg: 'rgba(10, 14, 28, 0.88)', border: '#38bdf8' },
          cluster: { text: '✨ 2X DUP', color: '#ffffff', bg: 'rgba(10, 14, 28, 0.88)', border: '#c084fc' },
          supercharge: { text: '⚡ HYPER', color: '#fbbf24', bg: 'rgba(10, 14, 28, 0.88)', border: '#fef08a' },
          chronos: { text: '⏳ STASIS', color: '#22d3ee', bg: 'rgba(10, 14, 28, 0.88)', border: '#67e8f9' },
          singularity: { text: '🧲 VACUUM', color: '#38bdf8', bg: 'rgba(10, 14, 28, 0.88)', border: '#7dd3fc' },
          catalyst: { text: '💎 CATALYST', color: '#38bdf8', bg: 'rgba(10, 14, 28, 0.88)', border: '#7dd3fc' }
        };

        if (badges[p.nodeClass] && p.nodeClass !== 'catalyst') {
          const b = badges[p.nodeClass];
          ctx.save();
          ctx.translate(0, -targetR * 1.38);
          ctx.font = `bold ${Math.round(11 * scale)}px system-ui, -apple-system, sans-serif`;
          const textW = ctx.measureText(b.text).width;
          const padX = 8 * scale;
          const padY = 4 * scale;

          ctx.fillStyle = b.bg;
          ctx.strokeStyle = b.border;
          ctx.lineWidth = 1.3 * scale;
          ctx.beginPath();
          ctx.roundRect(-textW / 2 - padX, -padY - 7 * scale, textW + padX * 2, 16 * scale, 7 * scale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.text, 0, 0);
          ctx.restore();
        }

      } else {
        // ─────────────────────────────────────────────────────────────
        // RENDER HAZARD TRAPS & 15 BESPOKE LUXURY RAYTRACED BAD CHROME CORES
        // (3 Games x 5 Powered Feature Hazards — ZERO thin wireframe lines!)
        // ─────────────────────────────────────────────────────────────
        const hClass = p.nodeClass;
        const modeKey = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
        const isHyperComet = (hClass === 'hyper_comet' || hClass === 'plasma_flare');
        const isCorruptor = (hClass === 'corruptor_laser');
        const isGravityWell = (hClass === 'gravity_well' || hClass === 'vortex');
        const isEmpDetonator = (hClass === 'emp_detonator' || hClass === 'emp_glitch' || hClass === 'pulsar_mine');
        const isPhaseStalker = (hClass === 'phase_stalker' || hClass === 'tachyon_fracture');

        // Mode-Specific Luxury VFX Color Palettes matching each game's Chrome Core aesthetic
        const mPal = (modeKey === 'meteor')
          ? { primary: 'rgba(16, 185, 129, ', secondary: 'rgba(168, 85, 247, ', accent: 'rgba(249, 115, 22, ', hex: '#10b981' }
          : (modeKey === 'helix'
              ? { primary: 'rgba(225, 29, 72, ', secondary: 'rgba(251, 191, 36, ', accent: 'rgba(232, 121, 249, ', hex: '#f43f5e' }
              : { primary: 'rgba(244, 63, 94, ', secondary: 'rgba(192, 132, 252, ', accent: 'rgba(56, 189, 248, ', hex: '#f43f5e' });

        if (isHyperComet) {
          // ═══ FEATURE BAD NODE #1: INFERNO HYPER-COMET (Game-Matched Luxury Raytraced Core + Live Roaring Flames!) ═══
          const isCharging = (p.cometPhase === 'charging');
          const flicker = 0.86 + 0.14 * Math.sin(now * 0.045 + animPhase * 7);
          const diveIntensity = isCharging ? 0.60 : 1.0;

          // 1. Pre-Dive Telegraph Volumetric Lane Heat-Shimmer (fair 0.85s dodge telegraph!)
          if (isCharging) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const chargePulse = 0.55 + 0.45 * Math.sin(now * 0.025);
            const laneGrad = ctx.createLinearGradient(0, targetR * 0.2, 0, targetR * 11.5);
            laneGrad.addColorStop(0.0, `rgba(254, 215, 170, ${0.42 * chargePulse})`);
            laneGrad.addColorStop(0.18, `rgba(249, 115, 22, ${0.26 * chargePulse})`);
            laneGrad.addColorStop(0.55, `rgba(220, 38, 38, ${0.12 * chargePulse})`);
            laneGrad.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
            ctx.fillStyle = laneGrad;
            ctx.beginPath();
            ctx.moveTo(-targetR * 0.65, targetR * 0.2);
            ctx.lineTo(targetR * 0.65, targetR * 0.2);
            ctx.lineTo(targetR * 1.15, targetR * 11.5);
            ctx.lineTo(-targetR * 1.15, targetR * 11.5);
            ctx.closePath();
            ctx.fill();

            const ignGrad = ctx.createRadialGradient(0, 0, targetR * 0.3, 0, 0, targetR * (2.2 + 0.35 * chargePulse));
            ignGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.80)');
            ignGrad.addColorStop(0.35, 'rgba(251, 146, 60, 0.52)');
            ignGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.20)');
            ignGrad.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
            ctx.fillStyle = ignGrad;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (2.2 + 0.35 * chargePulse), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // 2. Realistic Multi-Layered Turbulent Plasma Fire Plume Hugging the Hyper-Comet Core
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const tailStretch = isCharging ? 1.35 : 3.65;

          // 2a. Deep Atmospheric Heat Wash (scaled circle so radial gradient hits pure alpha=0 well inside bounds — ZERO oval outline!)
          ctx.save();
          const heatLen = targetR * (1.80 + tailStretch * 0.65);
          ctx.translate(0, -heatLen * 0.32);
          ctx.scale(0.58, 1.0);
          const heatGrad = ctx.createRadialGradient(0, heatLen * 0.22, targetR * 0.25, 0, 0, heatLen);
          heatGrad.addColorStop(0.0, `rgba(255, 224, 165, ${0.42 * diveIntensity})`);
          heatGrad.addColorStop(0.32, `rgba(249, 115, 22, ${0.26 * diveIntensity})`);
          heatGrad.addColorStop(0.66, `rgba(185, 28, 28, ${0.09 * diveIntensity})`);
          heatGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          ctx.fillStyle = heatGrad;
          ctx.beginPath();
          ctx.arc(0, 0, heatLen, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2b. Organic Sinuous S-Curve Flame Billows (wrapping smoothly around the sphere — zero rigid triangles!)
          const flameLicks = [
            { ox: 0.00, w: 1.02, h: 1.04, spd: 0.022, ph: 0.0, curl: 0.38 },
            { ox: -0.46, w: 0.64, h: 0.84, spd: 0.028, ph: 1.3, curl: -0.46 },
            { ox: 0.46, w: 0.64, h: 0.84, spd: 0.026, ph: 2.6, curl: 0.46 },
            { ox: -0.82, w: 0.44, h: 0.60, spd: 0.034, ph: 4.0, curl: -0.42 },
            { ox: 0.82, w: 0.44, h: 0.60, spd: 0.032, ph: 5.2, curl: 0.42 }
          ];
          for (let tIdx = 0; tIdx < flameLicks.length; tIdx++) {
            const tg = flameLicks[tIdx];
            const wave1 = Math.sin(now * tg.spd + tg.ph + animPhase);
            const wave2 = Math.cos(now * tg.spd * 1.45 + tg.ph * 1.7 + animPhase);
            const tipSway = (wave1 * 0.28 + wave2 * 0.14 + tg.curl * 0.25) * targetR;
            const midSway = (-wave1 * 0.18 + tg.curl * 0.16) * targetR;
            const tipY = -targetR * (1.05 + tailStretch * tg.h * (0.86 + 0.16 * wave2));
            const baseW = targetR * tg.w;
            const baseX = targetR * tg.ox;

            const fGrad = ctx.createLinearGradient(baseX, targetR * 0.45, baseX + tipSway, tipY);
            fGrad.addColorStop(0.0, `rgba(255, 245, 214, ${0.72 * diveIntensity})`);
            fGrad.addColorStop(0.28, `rgba(251, 146, 60, ${0.68 * diveIntensity})`);
            fGrad.addColorStop(0.62, `rgba(220, 38, 38, ${0.42 * diveIntensity})`);
            fGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');

            ctx.fillStyle = fGrad;
            ctx.beginPath();
            ctx.moveTo(baseX - baseW * 0.92, targetR * 0.12);
            ctx.bezierCurveTo(
              baseX - baseW * 1.06 + midSway, tipY * 0.28,
              baseX + tipSway - baseW * 0.42, tipY * 0.72,
              baseX + tipSway, tipY
            );
            ctx.bezierCurveTo(
              baseX + tipSway + baseW * 0.42, tipY * 0.72,
              baseX + baseW * 1.06 + midSway, tipY * 0.28,
              baseX + baseW * 0.92, targetR * 0.12
            );
            ctx.quadraticCurveTo(baseX, targetR * 0.78, baseX - baseW * 0.92, targetR * 0.12);
            ctx.closePath();
            ctx.fill();
          }

          // 2c. Rolling Volumetric Fire Billows Rising Off the Leading Rim (gives organic plasma turbulence)
          for (let bIdx = 0; bIdx < 5; bIdx++) {
            const bPhase = ((now * 0.0028 + bIdx * 0.2 + animPhase) % 1.0);
            const bAngle = Math.sin(now * 0.008 + bIdx * 2.3 + animPhase) * 0.65;
            const bx = Math.sin(bAngle) * targetR * (0.55 - bPhase * 0.32);
            const by = targetR * 0.15 - bPhase * targetR * (1.35 + tailStretch * 0.68);
            const bRad = targetR * (0.52 * (1.0 - bPhase * 0.58));
            const bAlpha = Math.sin(bPhase * Math.PI) * 0.62 * diveIntensity;
            const bg = ctx.createRadialGradient(bx, by, 0, bx, by, bRad);
            bg.addColorStop(0.0, `rgba(255, 250, 225, ${bAlpha})`);
            bg.addColorStop(0.42, `rgba(251, 146, 60, ${bAlpha * 0.85})`);
            bg.addColorStop(0.78, `rgba(220, 38, 38, ${bAlpha * 0.38})`);
            bg.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.arc(bx, by, bRad, 0, Math.PI * 2);
            ctx.fill();
          }

          // 2d. Inner Incandescent White-Gold Core Slipstream
          for (let k = -1; k <= 1; k++) {
            const kSway = Math.sin(now * 0.038 + k * 2.1 + animPhase) * targetR * 0.18;
            const kTipY = -targetR * (0.78 + tailStretch * (k === 0 ? 0.46 : 0.30));
            const kW = targetR * (k === 0 ? 0.68 : 0.40);
            const kX = k * targetR * 0.32;
            const inGrad = ctx.createLinearGradient(kX, targetR * 0.35, kX + kSway, kTipY);
            inGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.82)');
            inGrad.addColorStop(0.36, 'rgba(254, 240, 138, 0.72)');
            inGrad.addColorStop(0.75, 'rgba(249, 115, 22, 0.28)');
            inGrad.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
            ctx.fillStyle = inGrad;
            ctx.beginPath();
            ctx.moveTo(kX - kW, targetR * 0.18);
            ctx.quadraticCurveTo(kX - kW * 0.72 + kSway * 0.4, kTipY * 0.55, kX + kSway, kTipY);
            ctx.quadraticCurveTo(kX + kW * 0.72 + kSway * 0.4, kTipY * 0.55, kX + kW, targetR * 0.18);
            ctx.quadraticCurveTo(kX, targetR * 0.65, kX - kW, targetR * 0.18);
            ctx.closePath();
            ctx.fill();
          }

          // Live Trailing Molten Embers
          if (p.flameEmbers && p.flameEmbers.length > 0) {
            for (let eIdx = 0; eIdx < p.flameEmbers.length; eIdx++) {
              const em = p.flameEmbers[eIdx];
              const relX = em.x - p.x;
              const relY = em.y - p.y;
              const eAlpha = Math.max(0, 1.0 - em.life / em.maxLife);
              const eRad = em.size * eAlpha * scale;
              if (eRad > 0.3) {
                const emGrad = ctx.createRadialGradient(relX, relY, 0, relX, relY, eRad * 2.2);
                emGrad.addColorStop(0.0, `rgba(255, 255, 255, ${eAlpha})`);
                emGrad.addColorStop(0.45, `rgba(251, 191, 36, ${eAlpha * 0.85})`);
                emGrad.addColorStop(1.0, 'rgba(239, 68, 68, 0)');
                ctx.fillStyle = emGrad;
                ctx.beginPath();
                ctx.arc(relX, relY, eRad * 2.2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          ctx.restore();

          // 3. Game-Matched Luxury Raytraced Hyper-Comet Bad Chrome Core Sprite!
          const cometSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].hyper_comet;
          const cometLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].hyper_comet;
          if (cometSpr && cometLoaded) {
            const sprSize = 158 * scale;
            const microVibX = isCharging ? (Math.sin(now * 0.08) * 1.4 * scale) : 0;
            const microTilt = (modeKey === 'meteor') ? (now * 0.0025 + animPhase) : Math.sin(now * 0.006 + animPhase) * 0.07;
            ctx.save();
            ctx.translate(microVibX, 0);
            ctx.rotate(microTilt);
            ctx.drawImage(cometSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }

          // Subtle Re-Entry Heat Sheen hugging leading bottom edge
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const leadGlow = ctx.createRadialGradient(0, targetR * 0.45, 0, 0, targetR * 0.35, targetR * 1.25);
          leadGlow.addColorStop(0.0, `rgba(255, 245, 210, ${0.42 * flicker})`);
          leadGlow.addColorStop(0.48, `rgba(249, 115, 22, ${0.26 * flicker})`);
          leadGlow.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
          ctx.fillStyle = leadGlow;
          ctx.beginPath();
          ctx.arc(0, targetR * 0.35, targetR * 1.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else if (isCorruptor) {
          // ═══ FEATURE BAD NODE #2: CORRUPTOR OVERLORD (Game-Matched Luxury Raytraced Dreadnought + Live Optical Flare) ═══
          const charge = Math.max(0, Math.min(1, p.laserCharge || 0));
          const isFiring = (p.laserState === 'firing');
          const rotOuter = now * (modeKey === 'meteor' ? 0.0014 : 0.00085) + animPhase;
          const swell = 1.0 + charge * 0.14 + (isFiring ? 0.08 : 0);

          // 1. Mode-Matched Volumetric Singularity Energy Halo
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const auraR = targetR * (1.72 + charge * 0.62 + (isFiring ? 0.38 : 0));
          const auraG = ctx.createRadialGradient(0, 0, targetR * 0.35, 0, 0, auraR);
          auraG.addColorStop(0.0, `${mPal.primary}${0.42 + charge * 0.45})`);
          auraG.addColorStop(0.50, `${mPal.secondary}${0.24 + charge * 0.32})`);
          auraG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = auraG;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Game-Matched Luxury Raytraced Corruptor Overlord Sprite!
          const corSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].corruptor_laser;
          const corLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].corruptor_laser;
          if (corSpr && corLoaded) {
            const baseCorSize = (modeKey === 'meteor') ? 186 : (modeKey === 'helix' ? 178 : 166);
            const sprSize = baseCorSize * scale * swell;
            ctx.save();
            ctx.rotate(rotOuter);
            ctx.drawImage(corSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }

          // 3. Blinding Live Optical Emitter Pulse & Anamorphic Lens Flare on Charge / Laser Fire
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const eyePulse = 0.78 + 0.22 * Math.sin(now * 0.014 + animPhase);
          const eyeR = targetR * (0.36 + charge * 0.38 + (isFiring ? 0.26 : 0));
          const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR);
          eyeGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.65 + charge * 0.35})`);
          eyeGrad.addColorStop(0.45, `${mPal.primary}${0.68 * eyePulse + charge * 0.25})`);
          eyeGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = eyeGrad;
          ctx.beginPath();
          ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
          ctx.fill();

          if (charge > 0.12 || isFiring) {
            const flareLen = targetR * (1.35 + charge * 1.55 + (isFiring ? 0.90 : 0));
            const flGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
            flGrad.addColorStop(0.0, `${mPal.primary}0)`);
            flGrad.addColorStop(0.38, `${mPal.primary}0.60)`);
            flGrad.addColorStop(0.50, 'rgba(255, 255, 255, 0.96)');
            flGrad.addColorStop(0.62, `${mPal.primary}0.60)`);
            flGrad.addColorStop(1.0, `${mPal.primary}0)`);
            ctx.fillStyle = flGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, flareLen, targetR * 0.13, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

        } else if (isGravityWell) {
          // ═══ FEATURE BAD NODE #3: EVENT-HORIZON SINGULARITY (Game-Matched Luxury Raytraced Black Hole + Tidal Swirl) ═══
          const swirlRot = now * 0.0022 + animPhase;

          // 1. Soft Volumetric Tidal Gravity Distortion Aura
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const tidalR = targetR * (2.05 + 0.16 * Math.sin(now * 0.006));
          const tidalGrad = ctx.createRadialGradient(0, 0, targetR * 0.55, 0, 0, tidalR);
          tidalGrad.addColorStop(0.0, `${mPal.primary}0.32)`);
          tidalGrad.addColorStop(0.50, `${mPal.secondary}0.22)`);
          tidalGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = tidalGrad;
          ctx.beginPath();
          ctx.arc(0, 0, tidalR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Game-Matched Luxury Raytraced Black Hole / Singularity Sprite!
          const gravSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].gravity_well;
          const gravLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].gravity_well;
          if (gravSpr && gravLoaded) {
            const sprSize = 172 * scale;
            const spinAng = (modeKey === 'helix') ? (-now * 0.0028 + animPhase) : (Math.sin(now * 0.0018 + animPhase) * 0.22);
            ctx.save();
            ctx.rotate(spinAng);
            ctx.drawImage(gravSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }

          // 3. Tilted Relativistic Accretion Streaks Spiraling Inward Into Event Horizon
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const tiltAngle = (modeKey === 'dynamo') ? -0.30 : (modeKey === 'meteor' ? -0.18 : 0);
          ctx.rotate(tiltAngle);
          for (let knot = 0; knot < 6; knot++) {
            const kProg = ((now * 0.00095 + knot * 0.167 + animPhase) % 1.0);
            const ka = swirlRot * 2.2 + knot * (Math.PI / 3) + kProg * 2.4;
            const kr = targetR * (1.72 * (1.0 - kProg * 0.62));
            const flatY = (modeKey === 'helix') ? 0.92 : 0.56;
            const kx = Math.cos(ka) * kr;
            const ky = Math.sin(ka) * kr * flatY;
            const kPrevA = ka - 0.34;
            const kpx = Math.cos(kPrevA) * (kr * 1.06);
            const kpy = Math.sin(kPrevA) * (kr * 1.06) * flatY;
            const kAlpha = Math.sin(kProg * Math.PI) * 0.85;

            const sGrad = ctx.createLinearGradient(kpx, kpy, kx, ky);
            sGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
            sGrad.addColorStop(0.65, `${(knot % 2 === 0) ? mPal.primary : mPal.secondary}${kAlpha * 0.78})`);
            sGrad.addColorStop(1.0, `rgba(255, 255, 255, ${kAlpha})`);
            ctx.strokeStyle = sGrad;
            ctx.lineWidth = Math.max(1.5, targetR * 0.11 * (1.0 - kProg * 0.35));
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(kpx, kpy);
            ctx.lineTo(kx, ky);
            ctx.stroke();
          }
          ctx.restore();

        } else if (isEmpDetonator) {
          // ═══ FEATURE BAD NODE #4: OVERLOAD EMP SHOCK-MINE (Game-Matched Luxury Raytraced Mine + Reactor Surge) ═══
          const empCharge = Math.max(0, Math.min(1, p.empCharge || 0));
          const mineRot = now * 0.0011 + animPhase;

          // 1. Surging Electromagnetic Field Corona right before EMP Dome Detonation
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const fRad = targetR * (1.48 + empCharge * 0.88);
          const fGrad = ctx.createRadialGradient(0, 0, targetR * 0.45, 0, 0, fRad);
          const empOuterCol = (modeKey === 'meteor') ? mPal.secondary : mPal.accent;
          fGrad.addColorStop(0.0, `${mPal.primary}${0.30 + empCharge * 0.55})`);
          fGrad.addColorStop(0.55, `${empOuterCol}${0.18 + empCharge * 0.46})`);
          fGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.arc(0, 0, fRad, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Game-Matched Luxury Raytraced EMP Shock-Mine Sprite!
          const empSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].emp_detonator;
          const empLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].emp_detonator;
          if (empSpr && empLoaded) {
            const sprSize = 160 * scale * (1.0 + empCharge * 0.10);
            ctx.save();
            ctx.rotate(mineRot);
            ctx.drawImage(empSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }

          // 3. Central Pressurized Reactor Surge Flash when approaching 100% charge
          if (empCharge > 0.15) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const coreR = targetR * (0.48 + empCharge * 0.36);
            const rGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
            rGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.88 * empCharge})`);
            rGrad.addColorStop(0.45, `${mPal.accent}${0.75 * empCharge})`);
            rGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = rGrad;
            ctx.beginPath();
            ctx.arc(0, 0, coreR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

        } else if (isPhaseStalker) {
          // ═══ FEATURE BAD NODE #5: QUANTUM BLINK STALKER (Game-Matched Luxury Split-Core Rift Sprite + Phase Shimmer) ═══
          const isTelegraphing = (p.blinkState === 'telegraphing');
          const blinkProg = isTelegraphing ? Math.max(0, Math.min(1, p.blinkProgress || 0)) : 0;
          const orbPulse = 0.85 + 0.15 * Math.sin(now * 0.011 + animPhase);

          // 1. Subtle Volumetric Dimensional Phase Corona (preserves full razor-sharp split-core artwork!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const phaseR = targetR * (1.58 + blinkProg * 0.42);
          const phaseGrad = ctx.createRadialGradient(0, 0, targetR * 0.50, 0, 0, phaseR);
          phaseGrad.addColorStop(0.0, `${mPal.secondary}${0.22 + blinkProg * 0.25})`);
          phaseGrad.addColorStop(0.55, `${mPal.primary}${0.18 + blinkProg * 0.20})`);
          phaseGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = phaseGrad;
          ctx.beginPath();
          ctx.arc(0, 0, phaseR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 2. Game-Matched Luxury Raytraced Split Rift Core Sprite with Quantum Phase Breathing!
          const phSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].phase_stalker;
          const phLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].phase_stalker;
          if (phSpr && phLoaded) {
            const basePhSize = (modeKey === 'helix' || modeKey === 'meteor') ? 178 : 166;
            const sprSize = basePhSize * scale * (1.0 + Math.sin(now * 0.008 + animPhase) * 0.035);
            const swayAng = Math.sin(now * 0.0025 + animPhase) * 0.14;
            ctx.save();
            // Subtle phase-flicker while keeping luxury split-core silhouette sharp & legible!
            if (isTelegraphing) {
              ctx.globalAlpha = Math.max(0.74, 1.0 - blinkProg * 0.22 + Math.sin(now * 0.045) * 0.08);
            }
            ctx.rotate(swayAng);
            ctx.drawImage(phSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }

          // 3. Precision Dimensional Rift Core Glint (delicate so it enhances instead of washing out the split shell!)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const hG = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * (0.28 + blinkProg * 0.18));
          hG.addColorStop(0.0, `rgba(255, 255, 255, ${(0.36 + blinkProg * 0.28) * orbPulse})`);
          hG.addColorStop(0.48, `${mPal.secondary}${(0.28 + blinkProg * 0.26) * orbPulse})`);
          hG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = hG;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * (0.28 + blinkProg * 0.18), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else {
          // ═══ CLASSIC MODE-SPECIFIC HAZARDS (volatile, seeker, fragmentation, phantom) ═══
          const proxHeat = Math.max(0, Math.min(1, p._proxHeat || 0));
          if (mode === 'dynamo' || mode === 'realm') {
            const gSpr = LayeredT4Assets.hazard.dynamoGlitch;
            if (gSpr && LayeredT4Assets.loaded.hazard.dynamoGlitch) {
              const numSlices = 7;
              const srcSize = 140;
              const sliceH = srcSize / numSlices;
              const glitchTick = Math.floor(now * (0.022 + proxHeat * 0.014) + animPhase * 3.0);

              for (let s = 0; s < numSlices; s++) {
                const wave = Math.sin(glitchTick * 1.9 + s * 2.4 + animPhase);
                const isGlitchBand = (Math.abs(wave) > (0.42 - proxHeat * 0.14)) || (s === 2 || s === 4);
                const dxGlitch = isGlitchBand ? (wave * (8.5 + proxHeat * 4.5) * scale) : 0;

                const sy = s * sliceH;
                const dy = (-70 + s * sliceH) * scale;
                const dw = 140 * scale;
                const dh = (sliceH + 0.6) * scale;

                if (Math.abs(dxGlitch) > 3.2 * scale) {
                  ctx.save();
                  ctx.globalAlpha = 0.48 + proxHeat * 0.20;
                  ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, -70 * scale - dxGlitch * 0.65, dy, dw, dh);
                  ctx.restore();
                }
                ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, -70 * scale + dxGlitch, dy, dw, dh);
              }
            } else {
              const hazGrad = ctx.createRadialGradient(-targetR * 0.25, -targetR * 0.25, targetR * 0.1, 0, 0, targetR);
              hazGrad.addColorStop(0.0, 'rgba(239, 68, 68, 0.95)');
              hazGrad.addColorStop(0.45, 'rgba(185, 28, 28, 0.95)');
              hazGrad.addColorStop(0.85, 'rgba(127, 29, 29, 0.98)');
              hazGrad.addColorStop(1.0, 'rgba(69, 10, 10, 1.0)');
              ctx.fillStyle = hazGrad;
              ctx.beginPath();
              ctx.arc(0, 0, targetR, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (mode === 'helix') {
            if (LayeredT4Assets.loaded.hazard.helixClean) {
              ctx.drawImage(LayeredT4Assets.hazard.helixClean, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
            }
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.95, 0, Math.PI * 2);
            ctx.clip();
            const numFacets = 6;
            for (let f = 0; f < numFacets; f++) {
              const fPhase = now * (0.0042 + proxHeat * 0.004) + f * 1.35 + animPhase;
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
              ctx.fillStyle = `rgba(255, 100, 110, ${0.14 + glint * (0.48 + proxHeat * 0.28)})`;
              ctx.fill();
            }
            ctx.restore();
          } else {
            const bladeSpinBoost = 1.0 + proxHeat * 0.55;
            const bladeAngle = now * 0.0032 * bladeSpinBoost + animPhase;
            const counterAngle = -now * 0.0022 * bladeSpinBoost - animPhase * 0.7;
            if (LayeredT4Assets.loaded.hazard.meteorBlades) {
              ctx.save();
              ctx.rotate(counterAngle);
              ctx.scale(0.76, 0.76);
              ctx.globalAlpha = 0.78;
              ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
              ctx.restore();

              ctx.save();
              ctx.rotate(bladeAngle);
              ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
              ctx.restore();
            }
            if (LayeredT4Assets.loaded.hazard.meteorCenter) {
              ctx.drawImage(LayeredT4Assets.hazard.meteorCenter, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
            }
            const eyePulse = 0.65 + 0.35 * Math.sin(now * 0.007 + animPhase) + proxHeat * 0.22;
            const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * (0.34 + proxHeat * 0.12));
            eg.addColorStop(0.0, `rgba(254, 202, 202, ${Math.min(1, 0.92 * eyePulse)})`);
            eg.addColorStop(0.5, `rgba(239, 68, 68, ${Math.min(1, 0.58 * eyePulse)})`);
            eg.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (0.34 + proxHeat * 0.12), 0, Math.PI * 2);
            ctx.fill();
          }

          // Upgraded Volumetric Overlays for Classic Archetypes (ZERO Thin Wireframes!)
          if (p.nodeClass === 'seeker') {
            // SEEKER HARBINGER: Solid Shaded Metallic Hunter Fins + Soft Volumetric Forward Scanner Cone
            ctx.save();
            const finRot = now * 0.0032 + animPhase;
            for (let f = 0; f < 4; f++) {
              const fa = finRot + f * (Math.PI / 2);
              ctx.save();
              ctx.rotate(fa);
              const fGrad = ctx.createLinearGradient(targetR * 0.75, -targetR * 0.18, targetR * 1.32, targetR * 0.18);
              fGrad.addColorStop(0.0, '#991b1b');
              fGrad.addColorStop(0.5, '#ef4444');
              fGrad.addColorStop(1.0, '#fecaca');
              ctx.fillStyle = fGrad;
              ctx.beginPath();
              ctx.moveTo(targetR * 0.76, -targetR * 0.18);
              ctx.lineTo(targetR * 1.34, 0);
              ctx.lineTo(targetR * 0.76, targetR * 0.18);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
            // Volumetric Glowing Crimson Targeting Eye
            ctx.globalCompositeOperation = 'lighter';
            const sEye = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * 0.55);
            sEye.addColorStop(0.0, '#ffffff');
            sEye.addColorStop(0.38, 'rgba(248, 113, 113, 0.90)');
            sEye.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = sEye;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.55, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

          } else if (p.nodeClass === 'fragmentation') {
            // FRAGMENTATION BOLIDE: Swelling Superheated Volcanic Pressure Bloom
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const fragPulse = 0.65 + 0.35 * Math.sin(now * 0.022 + animPhase);
            const pGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * (1.18 + 0.18 * fragPulse));
            pGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.85 * fragPulse})`);
            pGrad.addColorStop(0.35, `rgba(251, 191, 36, ${0.72 * fragPulse})`);
            pGrad.addColorStop(0.70, `rgba(234, 88, 12, ${0.38 * fragPulse})`);
            pGrad.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (1.18 + 0.18 * fragPulse), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Freshly Corrupted Node Flare (when a Good Node is instantly converted by Corruptor Laser!)
          if (p.justCorruptedUntil && p.justCorruptedUntil > now) {
            const cFrac = Math.min(1.0, (p.justCorruptedUntil - now) / 900);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const cGrad = ctx.createRadialGradient(0, 0, targetR * 0.2, 0, 0, targetR * (1.45 + 0.45 * cFrac));
            cGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.90 * cFrac})`);
            cGrad.addColorStop(0.38, `rgba(244, 63, 94, ${0.85 * cFrac})`);
            cGrad.addColorStop(0.75, `rgba(217, 70, 239, ${0.45 * cFrac})`);
            cGrad.addColorStop(1.0, 'rgba(136, 19, 55, 0)');
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (1.45 + 0.45 * cFrac), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
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
    hazardLasers: [],
    empShockwaves: [],
    blinkGhosts: [],
    corruptionBursts: [],
    scienceArcs: [],
    scienceRipples: [],
    empSlowUntil: 0,
    activeBuffs: {}, // Simultaneous active buffs: { [type]: { type, name, color, icon, expiresAt } }
    activeBuff: null,

    applyBuff(type, name, color, icon, durationMs, now) {
      if (!this.activeBuffs) this.activeBuffs = {};
      const current = this.activeBuffs[type];
      let expiresAt = now + durationMs;
      if (current && current.expiresAt > now) {
        // If buff already active: extend it! For shield: stack duration up to 15s max!
        expiresAt = Math.min(now + 15000, current.expiresAt + durationMs);
      }
      this.activeBuffs[type] = { type, name, color, icon, expiresAt, duration: durationMs };
      this.activeBuff = this.activeBuffs[type];
    },

    hasBuff(type, now) {
      if (!this.activeBuffs) return false;
      const b = this.activeBuffs[type];
      return !!(b && b.expiresAt > now);
    },

    getBuff(type, now) {
      if (!this.activeBuffs) return null;
      const b = this.activeBuffs[type];
      return (b && b.expiresAt > now) ? b : null;
    },

    getAllActiveBuffs(now) {
      if (!this.activeBuffs) return [];
      const list = [];
      for (const k in this.activeBuffs) {
        if (this.activeBuffs[k] && this.activeBuffs[k].expiresAt > now) {
          list.push(this.activeBuffs[k]);
        }
      }
      return list.sort((a, b) => b.expiresAt - a.expiresAt);
    },

    // Math Overdrive State
    mathLevel: 1,
    mathQuestions: [],
    mathQIdx: 0,
    mathMistakes: 0,
    mathTimer: null,
    mathTimeLeft: 100,

    // Reflex Blitz State (Strict 3 Lives)
    reflexLives: 3,
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
  let precisionMode = false; // Direct 1:1 physical touch tracking (finger is exact core center)
  let touchGuidePos = { x: -9999, y: -9999, active: false };
  let targetCatcherX = 0.5;
  let currentCatcherX = 0.5;
  let targetCatcherY = 0.82;
  let currentCatcherY = 0.82;
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
      buffVal: document.getElementById('cgBuffVal') || document.getElementById('cgPhaseVal'),
      buffPill: document.getElementById('cgBuffPill') || document.getElementById('cgPhasePill'),
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
      dom.gameTitle.textContent = state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO';
      dom.gameSub.textContent = state.coreTier === 5
        ? `⭐ Tier V Supreme Ascendant · Faraday Singularity Core · Tachyon Satellites · Wave ${state.currentWave}`
        : `Faraday Singularity Core · Plasma Orbs · Tesla Wavepacket Hull · Wave ${state.currentWave}`;
    } else if (state.gameType === 'helix') {
      dom.gameTitle.textContent = state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX';
      dom.gameSub.textContent = state.coreTier === 5
        ? `⭐ Tier V Supreme Ascendant · Harmonic Bio-Lattice Core · Prismatic Refraction Rays · Wave ${state.currentWave}`
        : `Harmonic Bio-Lattice Core · Nucleotide Pearls · 3D Aurora Ribbon · Wave ${state.currentWave}`;
    } else if (state.gameType === 'meteor') {
      dom.gameTitle.textContent = state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR';
      dom.gameSub.textContent = state.coreTier === 5
        ? `⭐ Tier V Supreme Ascendant · Aegis Caldera Core · Coronal Solar Flares · Wave ${state.currentWave}`
        : `Aegis Caldera Core · Molten Bolides · Supersonic Combustion Trail · Wave ${state.currentWave}`;
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
      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      const tierPillEl = document.getElementById('cgTierPill');
      if (tierPillEl) {
        tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x Sovereign Overdrive), Tier V (28x+ Supreme Seraphic Ascendant)`;
      }
    }
    if (dom.pulseVal) {
      dom.pulseVal.textContent = state.isPulseReady ? 'READY!' : `${Math.min(100, Math.floor(state.pulseMeter || 0))}%`;
      dom.pulseVal.style.color = state.isPulseReady ? '#fef08a' : '#94a3b8';
    }
    if (dom.pulsePill) {
      dom.pulsePill.classList.toggle('pulse-ready', !!state.isPulseReady);
    }
    const activeBuffEl = dom.buffVal;
    const activeBuffPillEl = dom.buffPill;
    if (activeBuffEl) {
      const curNow = performance.now();
      const activeBuffs = state.getAllActiveBuffs ? state.getAllActiveBuffs(curNow) : [];
      if (activeBuffs.length > 0) {
        // Compressed, non-distracting formatting for active surges
        if (activeBuffs.length === 1) {
          const b = activeBuffs[0];
          const rem = Math.max(0, (b.expiresAt - curNow) / 1000).toFixed(1);
          activeBuffEl.textContent = `${b.icon || ''}${rem}s`;
        } else if (activeBuffs.length === 2) {
          const b1 = activeBuffs[0];
          const b2 = activeBuffs[1];
          const rem1 = Math.max(0, Math.ceil((b1.expiresAt - curNow) / 1000));
          const rem2 = Math.max(0, Math.ceil((b2.expiresAt - curNow) / 1000));
          activeBuffEl.textContent = `${b1.icon || ''}${rem1}s ${b2.icon || ''}${rem2}s`;
        } else {
          const b1 = activeBuffs[0];
          const rem1 = Math.max(0, Math.ceil((b1.expiresAt - curNow) / 1000));
          activeBuffEl.textContent = `${b1.icon || ''}${rem1}s +${activeBuffs.length - 1}`;
        }
        if (activeBuffPillEl) {
          activeBuffPillEl.title = 'Active Surges:\n' + activeBuffs.map(b => `${b.icon || ''} ${b.name}: ${Math.max(0, (b.expiresAt - curNow) / 1000).toFixed(1)}s`).join('\n');
        }
        const primary = activeBuffs[0];
        activeBuffEl.style.color = primary.color || '#38bdf8';
        if (activeBuffPillEl) {
          activeBuffPillEl.className = `game-stat-pill buff-pill buff-active buff-${primary.type}`;
        }
      } else {
        state.activeBuff = null;
        if (activeBuffPillEl) {
          activeBuffPillEl.title = 'Active Celestial Surge / Node Buff';
        }
        if (state.isOverdrive) {
          activeBuffEl.textContent = '10X';
          activeBuffEl.style.color = '#fef08a';
          if (activeBuffPillEl) {
            activeBuffPillEl.className = 'game-stat-pill buff-pill buff-active buff-hyper';
          }
        } else {
          activeBuffEl.textContent = 'READY';
          activeBuffEl.style.color = '#64748b';
          if (activeBuffPillEl) {
            activeBuffPillEl.className = 'game-stat-pill buff-pill';
          }
        }
      }
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
    state.reflexLives = 3;
    state.catcherX = 0.5;
    state.catcherY = 0.82;
    targetCatcherX = 0.5;
    currentCatcherX = 0.5;
    targetCatcherY = 0.82;
    currentCatcherY = 0.82;
    state.lastTransmuteTime = performance.now();
    state.particles = [];
    state.floatingTexts = [];
    state.absorptionEffects = [];
    state.ambientField = [];
    state.hazardLasers = [];
    state.empShockwaves = [];
    state.blinkGhosts = [];
    state.corruptionBursts = [];
    state.scienceArcs = [];
    state.scienceRipples = [];
    state.empSlowUntil = 0;

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
    state.coreTier = 1; // Tier I, II, III, IV
    state.consecutivePerfects = 0;
    state.pulseMeter = 0; // 0 to 100
    state.isPulseReady = false;
    state.activeBuffs = {};
    state.activeBuff = null; // Active Celestial Surge / Power Buff
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
      if (picker) picker.style.display = 'none'; // Hidden while choosing multiple on start overlay
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
    const maxShields = 3;
    for (let i = 0; i < maxShields; i++) {
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

  
  // ─────────────────────────────────────────────────────────────
  // LUXURY OLED COSMIC SPACE ATMOSPHERE (v343)
  // Pure OLED True-Black Space, Zero Gridlines, Soft Organic Nebulas
  // ─────────────────────────────────────────────────────────────
  const COSMIC_STARS = Array.from({ length: 48 }, (_, i) => ({
    x: ((i * 73 + 19) % 1000) / 1000,
    y: ((i * 97 + 37) % 1000) / 1000,
    baseR: 0.6 + (i % 3) * 0.45,
    freq: 0.0018 + (i % 5) * 0.0009,
    phase: i * 1.37
  }));

  function renderLuxuryCosmicBackground(ctx, w, h, mode, now) {
    // 1. Organic drifting celestial nebular bloom (Zero geometry, zero gridlines)
    const driftX = Math.sin(now * 0.0004) * 45;
    const driftY = Math.cos(now * 0.0003) * 35;
    const nebR = Math.max(w, h) * 0.65;
    
    ctx.save();
    const g1 = ctx.createRadialGradient(w * 0.5 + driftX, h * 0.35 + driftY, 20, w * 0.5 + driftX, h * 0.35 + driftY, nebR);
    if (mode === 'helix') {
      g1.addColorStop(0.0, 'rgba(34, 211, 238, 0.038)');
      g1.addColorStop(0.45, 'rgba(232, 121, 249, 0.022)');
      g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
    } else if (mode === 'dynamo') {
      g1.addColorStop(0.0, 'rgba(56, 189, 248, 0.038)');
      g1.addColorStop(0.45, 'rgba(168, 85, 247, 0.022)');
      g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
    } else {
      g1.addColorStop(0.0, 'rgba(249, 115, 22, 0.038)');
      g1.addColorStop(0.45, 'rgba(234, 88, 12, 0.022)');
      g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
    }
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    // 2. Anti-aliased micro-stars & diamond stardust (Subtle, silky twinkle)
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < COSMIC_STARS.length; i++) {
      const s = COSMIC_STARS[i];
      const sx = s.x * w;
      const sy = s.y * h;
      const tw = Math.pow(0.5 + 0.5 * Math.sin(now * s.freq + s.phase), 2.0);
      const alpha = 0.15 + 0.55 * tw;
      const r = s.baseR * (0.85 + 0.35 * tw);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || (state.gameType !== 'reflex' && state.gameType !== 'realm' && state.gameType !== 'dynamo' && state.gameType !== 'helix' && state.gameType !== 'meteor')) return;

    const ctx = dom.canvasReflex?.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    if (dom.canvasReflex) {
      const rect = dom.canvasReflex.getBoundingClientRect();
      const targetW = Math.max(320, Math.round(rect.width * dpr));
      const targetH = Math.max(240, Math.round(rect.height * dpr));
      if (dom.canvasReflex.width !== targetW || dom.canvasReflex.height !== targetH) {
        dom.canvasReflex.width = targetW;
        dom.canvasReflex.height = targetH;
      }
    }

    const w = dom.canvasReflex.width / dpr;
    const h = dom.canvasReflex.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, w, h);

    // ZERO GRIDLINES: Pure OLED True-Black Space with Silky Organic Ambient Nebulas
    renderLuxuryCosmicBackground(ctx, w, h, state.catcherType, timestamp);

    // Smooth Linear Interpolation (Lerp) with Mode-Specific Kinematics:
    // - Dynamo: Snappy, agile electromagnetic tracking (0.44 touch / 0.28 mouse)
    // - Helix: Fluid harmonic gliding with gyroscopic banking tilt (0.36 touch / 0.22 mouse)
    // - Meteor: Substantial volcanic inertia and high-momentum weight (0.30 touch / 0.18 mouse)
    // Immediate Capture Center Tracking (1:1 Omnidirectional Freedom):
    // The capture center tracks pointer/hand input across all 2D axes (X & Y) with critically-damped spring follow for mouse,
    // and instantaneous zero-lag direct physical tracking for touchscreen & mobile devices!
    const isEmpSlowed = (state.empSlowUntil && state.empSlowUntil > timestamp && !state.hasBuff('shield', timestamp));
    if (deviceInputMode === 'touch') {
      if (isEmpSlowed) {
        currentCatcherX += (targetCatcherX - currentCatcherX) * 0.34;
        currentCatcherY += (targetCatcherY - currentCatcherY) * 0.34;
      } else {
        currentCatcherX = targetCatcherX;
        currentCatcherY = targetCatcherY;
      }
    } else {
      const followRate = isEmpSlowed ? 0.28 : 0.92;
      currentCatcherX += (targetCatcherX - currentCatcherX) * followRate;
      currentCatcherY += (targetCatcherY - currentCatcherY) * followRate;
    }
    state.catcherX = currentCatcherX;
    state.catcherY = currentCatcherY;

    let catcherPixelX = (deviceInputMode === 'touch')
      ? Math.max(20, Math.min(w - 20, currentCatcherX * w))
      : Math.max(55, Math.min(w - 55, currentCatcherX * w));
    if (state.prevCatcherPixelX !== null) {
      state.catcherVelocity = catcherPixelX - state.prevCatcherPixelX;
    }
    state.prevCatcherPixelX = catcherPixelX;
    
    // Cellphone & Mobile Safe-Area Inset:
    const isCoarse = (deviceInputMode === 'touch') || window.innerWidth <= 768;
    const catcherBottomMargin = isCoarse ? Math.max(185, Math.round(h * 0.24)) : Math.max(160, Math.round(h * 0.26));
    const catcherPixelY = (state.gameType === 'reflex')
      ? (h - catcherBottomMargin)
      : (deviceInputMode === 'touch'
          ? Math.max(20, Math.min(h - 20, currentCatcherY * h))
          : Math.max(70, Math.min(h - 75, currentCatcherY * h)));

    // Dynamic Cursor State: In arcade mode, the Chrome Core IS the cursor itself (1:1 ratio)
    if (dom.canvasReflex) {
      if (state.active && state.gameType !== 'reflex') {
        if (dom.canvasReflex.style.cursor !== 'none') dom.canvasReflex.style.cursor = 'none';
      } else {
        if (dom.canvasReflex.style.cursor !== 'default') dom.canvasReflex.style.cursor = 'default';
      }
    }

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
            state.combo = Math.min(50, state.combo + 1);
            if (state.combo >= 21) state.isOverdrive = true;
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

      // Calculate Core Evolution Tier (New Rule: Tier II @ 7, Tier III @ 14, Tier IV @ 21, Tier V @ 28)
      if (state.combo >= 28) {
        state.coreTier = 5;
        state.isOverdrive = true;
      } else if (state.combo >= 21) {
        state.coreTier = 4;
        state.isOverdrive = true;
      } else if (state.combo >= 14) {
        state.coreTier = 3;
        state.isOverdrive = false;
      } else if (state.combo >= 7) {
        state.coreTier = 2;
        state.isOverdrive = false;
      } else {
        state.coreTier = 1;
        state.isOverdrive = false;
      }

      // ─────────────────────────────────────────────────────────────
      // FEATURE 1: FLUX NODE CLASSES SPAWN CHOREOGRAPHY
      // ─────────────────────────────────────────────────────────────
      function pickFairLaneX(isHazard = false) {
        const margin = 70;
        const minSeparationSame = 85;      // 85px safe lateral clearance between same-type items
        const minSeparationOpposite = 125;  // 125px guaranteed clearance between hazards & collectibles
        let bestX = Math.random() * (w - margin * 2) + margin;
        let maxScore = -99999;

        for (let att = 0; att < 32; att++) {
          const candidateX = Math.random() * (w - margin * 2) + margin;
          let isClear = true;
          let minOppDist = 9999;
          let minSameDist = 9999;

          for (let pt of state.particles) {
            if (pt.y < 520) {
              const ptIsHazard = isHazardNode(pt.nodeClass);
              const dx = Math.abs(pt.x - candidateX);
              const requiredSep = (isHazard !== ptIsHazard) ? minSeparationOpposite : minSeparationSame;
              if (dx < requiredSep) {
                isClear = false;
              }
              if (isHazard !== ptIsHazard) {
                if (dx < minOppDist) minOppDist = dx;
              } else {
                if (dx < minSameDist) minSameDist = dx;
              }
            }
          }
          if (isClear) return candidateX;
          const score = minOppDist * 1.6 + minSameDist;
          if (score > maxScore) {
            maxScore = score;
            bestX = candidateX;
          }
        }
        return bestX;
      }

      function spawnNode(baseSpeed) {
        let pType = (state.gameType === 'realm') ? 'dynamo' : state.gameType;

        // Tuned Dynamic Speed Escalation: Capped gently at +25% max (preventing excessive difficulty)
        const speedComboBonus = 1.0 + Math.min(0.25, (state.combo - 1) * 0.020 + (state.currentWave - 1) * 0.016);
        const actualSpeed = baseSpeed * normFactor * speedComboBonus;

        // Balanced Hazard Spawning: Max 2 hazards from Wave 2+ (or combo >= 5) so Corruptor & Combos interact richly
        const maxHazards = (state.currentWave >= 2 || state.combo >= 5) ? 2 : 1;
        const currentHazards = state.particles.filter(pt => isHazardNode(pt.nodeClass)).length;

        // Dynamic hazard chance tuned to a fair 15% - 22%
        const hazardChance = Math.min(0.22, 0.15 + (state.currentWave - 1) * 0.015);
        const canSpawnHazard = (currentHazards < maxHazards && elapsedSec > 2.2 && Math.random() < hazardChance);

        let nClass = 'standard';

        if (canSpawnHazard) {
          // Balanced Hazard Ratio: 60% Regular Bad Nodes ('volatile') vs 40% Powered Feature Bad Nodes
          const rHaz = Math.random();
          if (rHaz < 0.60) {
            nClass = 'volatile'; // Classic Normal Bad Node (60% — clearly outnumbers powered hazards)
          } else if (rHaz < 0.68) {
            nClass = 'hyper_comet'; // Feature #1: Inferno Hyper-Comet (8% — Ultra-Fast Flaming Dive!)
          } else if (rHaz < 0.76) {
            nClass = 'corruptor_laser'; // Feature #2: Corruptor Overlord (8% — Lasers Good Nodes -> Bad Nodes!)
          } else if (rHaz < 0.83) {
            nClass = 'gravity_well'; // Feature #3: Event-Horizon Singularity (7% — Black Hole Orbital Pull)
          } else if (rHaz < 0.90) {
            nClass = 'emp_detonator'; // Feature #4: Overload EMP Shock-Mine (7% — Expanding Volumetric EMP Dome)
          } else if (rHaz < 0.96) {
            nClass = 'phase_stalker'; // Feature #5: Quantum Blink Stalker (6% — Telegraphed Wormhole Teleport)
          } else if (rHaz < 0.98) {
            nClass = 'seeker'; // Orbital Homing Harbinger (2% — tracks player)
          } else {
            nClass = 'fragmentation'; // Fragmentation Bolide (2% — splits into 3 molten shards)
          }
          if (!state._hazardStats) state._hazardStats = { regular: 0, powered: 0, byClass: {} };
          if (nClass === 'volatile') state._hazardStats.regular++;
          else state._hazardStats.powered++;
          state._hazardStats.byClass[nClass] = (state._hazardStats.byClass[nClass] || 0) + 1;
          window.__CHROME_ARCADE_HAZARD_STATS__ = state._hazardStats;
        } else {
          // Balanced Falling Node Archetypes (84% Standard Nodes, 16% Power-Ups)
          const rNode = Math.random();
          const isCriticalLife = (state.reflexLives <= 1);
          if (isCriticalLife && rNode < 0.10) {
            nClass = 'catalyst'; // Critical Pity: Emergency Life Recovery Node (10% when on last life)
          } else if (rNode < 0.025) {
            nClass = 'shield'; // 5-Second Aegis Forcefield Shield (2.5%)
          } else if (rNode < 0.050) {
            nClass = 'missiles'; // Live Seeking Micro-Missiles (2.5%)
          } else if (rNode < 0.075) {
            nClass = 'cluster'; // Bifurcation Flux Node ("Cluster Doubler") (2.5%)
          } else if (rNode < 0.100) {
            nClass = 'supercharge'; // Supercharged Hyper-Node (Supernova) (2.5%)
          } else if (rNode < 0.120) {
            nClass = 'chronos'; // Chronos Stasis Pearl (Bullet-Time) (2.0%)
          } else if (rNode < 0.140) {
            nClass = 'singularity'; // Graviton Singularity Node (Magnetic Vacuum) (2.0%)
          } else if (rNode < 0.160) {
            nClass = (state.reflexLives >= 3) ? 'standard' : 'catalyst'; // Ascension Catalyst Star (+1 Life) (2.0% - only if lives < 3)
          } else {
            nClass = 'standard'; // Dominant Standard Multiple Target Nodes (84.0%)
          }
        }

        // Guaranteed fair lane selection based on final node archetype
        const px = pickFairLaneX(canSpawnHazard);

        const headRadiusMap = {
          standard: 26.0,
          shield: 29.0,
          missiles: 30.0,
          cluster: 28.0,
          supercharge: 30.0,
          chronos: 25.0,
          singularity: 27.0,
          catalyst: 32.0, // Clean, proportional silhouette
          volatile: 28.0,
          seeker: 30.0,
          phantom: 26.0,
          fragmentation: 32.0,
          vortex: 33.0,
          gravity_well: 33.0,
          pulsar_mine: 30.0,
          emp_glitch: 30.0,
          emp_detonator: 31.0,
          tachyon_fracture: 30.0,
          phase_stalker: 30.0,
          plasma_flare: 30.0,
          hyper_comet: 29.0,
          corruptor_laser: 32.0
        };

        const speedMult = (nClass === 'supercharge') ? 1.25
          : (nClass === 'chronos') ? 0.88
          : (nClass === 'corruptor_laser') ? 0.72
          : (nClass === 'gravity_well') ? 0.78
          : (nClass === 'emp_detonator') ? 0.84
          : 1.0;

        const p = {
          type: pType,
          nodeClass: nClass,
          x: px,
          y: (nClass === 'hyper_comet') ? 42 : -48,
          vx: 0,
          speed: actualSpeed * speedMult,
          baseSpeed: baseSpeed,
          headR: headRadiusMap[nClass] || 26.0,
          hasSplit: false,
          hasDetonated: false,
          hasGrazed: false,
          phantomAlpha: 1.0,
          animPhase: Math.random() * Math.PI * 2,
          tumbleDir: Math.random() < 0.5 ? 1 : -1,
          // Feature #1: Hyper-Comet Ignition & Live Flame Embers
          cometPhase: (nClass === 'hyper_comet') ? 'charging' : null,
          cometChargeEnd: (nClass === 'hyper_comet') ? (now + 850) : 0,
          cometDiveSpeed: actualSpeed * 3.65,
          flameEmbers: [],
          // Feature #2: Corruptor Overlord Multi-Target Laser State
          laserState: 'idle',
          laserCharge: 0,
          laserChargeStart: 0,
          laserTargets: [],
          laserSalvosLeft: 2,
          laserNextReady: now + 650,
          // Feature #4: EMP Detonator Shockwave Timer
          empCharge: 0,
          empNextPulse: now + 1550,
          // Feature #5: Quantum Blink Stalker Wormhole Teleport State
          blinkState: 'idle',
          blinkProgress: 0,
          blinkStartTime: 0,
          blinkTargetX: px,
          blinkTargetY: 160,
          blinksLeft: (state.currentWave >= 3) ? 2 : 1,
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
        spawnNode(1.95);
      }

      // Opening 15-Second Choreography Engine:
      let shouldSpawn = false;
      let nextBaseSpeed = 1.95;

      if (elapsedSec < 5.0) {
        const interval = 720;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 3 && state.totalNodesSpawned < 7) {
          shouldSpawn = true;
          nextBaseSpeed = 1.90 + Math.random() * 0.30;
        }
      } else if (elapsedSec < 10.0) {
        const interval = 580;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 4 && state.totalNodesSpawned < 15) {
          shouldSpawn = true;
          nextBaseSpeed = 2.20 + Math.random() * 0.35;
        }
      } else if (elapsedSec < 15.0) {
        const isPairBurst = (state.totalNodesSpawned % 3 !== 0);
        const interval = isPairBurst ? 360 : 880;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 4 && state.totalNodesSpawned < 22) {
          shouldSpawn = true;
          nextBaseSpeed = 2.40 + Math.random() * 0.35;
        }
      } else {
        const calculatedWave = Math.min(10, Math.floor(state.score / 1200) + 1);
        if (calculatedWave > state.currentWave) {
          state.currentWave = calculatedWave;
          audio.playVictoryFanfare();
          updateHeaderUI();
        }

        const maxConcurrent = Math.min(5, 3 + Math.floor(state.currentWave / 3));
        const waveInterval = Math.max(380, 650 - (state.currentWave - 1) * 35);
        if ((now - state.lastSpawnTime) >= waveInterval && state.particles.length < maxConcurrent) {
          shouldSpawn = true;
          nextBaseSpeed = 2.10 + (state.currentWave - 1) * 0.15 + Math.random() * 0.30;
        }
      }

      if (shouldSpawn) {
        spawnNode(nextBaseSpeed);
      }

      // Check if any non-volatile node is inside the magnetic horizon for Iris Lock-On
      const tierHitBonusPre = (state.coreTier - 1) * 12;
      const gravRadiusPre = 130 + tierHitBonusPre;
      const isCoreLockedOn = state.particles.some(pt => !isHazardNode(pt.nodeClass) && Math.hypot(catcherPixelX - pt.x, catcherPixelY - pt.y) < gravRadiusPre);

      // ─────────────────────────────────────────────────────────────
      // TEST HARNESS: LIVE 5 FEATURE BAD NODES, CORRUPTOR LASER & MISSILE SHOWCASE
      // ─────────────────────────────────────────────────────────────
      if (window.location.search.includes('test_nodes=1')) {
        if (!state._testedNodes) {
          state._testedNodes = true;
          const pMode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
          state.particles = [
            { type: pMode, nodeClass: 'standard', x: w * 0.10, y: h * 0.46, vx: 0, speed: 0, headR: 26, spine: [], stardust: [], animPhase: 0.2, tumbleDir: 1 },
            { type: pMode, nodeClass: 'shield', x: w * 0.23, y: h * 0.46, vx: 0, speed: 0, headR: 29, spine: [], stardust: [], animPhase: 0.9, tumbleDir: -1 },
            { type: pMode, nodeClass: 'missiles', x: w * 0.36, y: h * 0.46, vx: 0, speed: 0, headR: 30, spine: [], stardust: [], animPhase: 1.6, tumbleDir: 1 },
            { type: pMode, nodeClass: 'supercharge', x: w * 0.49, y: h * 0.46, vx: 0, speed: 0, headR: 30, spine: [], stardust: [], animPhase: 2.3, tumbleDir: -1 },
            { type: pMode, nodeClass: 'catalyst', x: w * 0.62, y: h * 0.46, vx: 0, speed: 0, headR: 32, spine: [], stardust: [], animPhase: 3.0, tumbleDir: 1 },
            { type: pMode, nodeClass: 'volatile', x: w * 0.76, y: h * 0.46, vx: 0, speed: 0, headR: 28, spine: [], stardust: [], animPhase: 3.7, tumbleDir: -1 },
            { type: pMode, nodeClass: 'corruptor_laser', x: w * 0.90, y: h * 0.46, vx: 0, speed: 0, headR: 32, laserState: 'idle', laserCharge: 0, laserSalvosLeft: 0, laserTargets: [], spine: [], stardust: [], animPhase: 4.4, tumbleDir: 1 }
          ];
          state.lastSpawnTime = now + 999999;
        }
      }

      if (window.location.search.includes('test_hazards=1')) {
        if (!state._testedHazards) {
          state._testedHazards = true;
          const pMode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
          state.particles = [
            { type: pMode, nodeClass: 'volatile', x: w * 0.09, y: h * 0.44, vx: 0, speed: 0, headR: 28, spine: [{x: w * 0.09, y: h * 0.44}, {x: w * 0.09, y: h * 0.44 - 30}, {x: w * 0.09, y: h * 0.44 - 55}], stardust: [], animPhase: 0.1 },
            { type: pMode, nodeClass: 'hyper_comet', x: w * 0.25, y: h * 0.44, vx: 0, speed: 0, headR: 29, cometPhase: 'diving', flameEmbers: [], spine: [], stardust: [], animPhase: 0.4 },
            { type: pMode, nodeClass: 'corruptor_laser', x: w * 0.41, y: h * 0.44, vx: 0, speed: 0, headR: 32, laserState: 'charging', laserCharge: 0.82, laserSalvosLeft: 0, laserTargets: [], spine: [], stardust: [], animPhase: 1.1 },
            { type: pMode, nodeClass: 'gravity_well', x: w * 0.58, y: h * 0.44, vx: 0, speed: 0, headR: 33, spine: [], stardust: [], animPhase: 2.0 },
            { type: pMode, nodeClass: 'emp_detonator', x: w * 0.74, y: h * 0.44, vx: 0, speed: 0, headR: 31, empCharge: 0.85, empNextPulse: now + 600, spine: [], stardust: [], animPhase: 3.1 },
            { type: pMode, nodeClass: 'phase_stalker', x: w * 0.90, y: h * 0.44, vx: 0, speed: 0, headR: 30, blinkState: 'telegraphing', blinkProgress: 0.75, blinkStartTime: now - 300, blinkTargetX: w * 0.90, blinkTargetY: h * 0.21, blinksLeft: 0, spine: [], stardust: [], animPhase: 4.2 }
          ];
          state.empShockwaves.push({ x: w * 0.74, y: h * 0.44, r: 44, maxR: 138, alpha: 0.88, hitPlayer: true, mode: pMode });
          state.lastSpawnTime = now + 999999;
        }
      }

      if (window.location.search.includes('test_corruptor=1')) {
        if (!state._testedCorruptor) {
          state._testedCorruptor = true;
          const pMode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
          state.particles = [
            { type: pMode, nodeClass: 'corruptor_laser', x: w * 0.50, y: h * 0.24, vx: 0, speed: 0.35, headR: 32, laserState: 'idle', laserCharge: 0, laserChargeStart: 0, laserTargets: [], laserSalvosLeft: 1, laserNextReady: now + 100, spine: [], stardust: [], animPhase: 0.5 },
            { type: pMode, nodeClass: 'standard', x: w * 0.30, y: h * 0.44, vx: 0, speed: 0.25, headR: 26, spine: [], stardust: [], animPhase: 1.0 },
            { type: pMode, nodeClass: 'standard', x: w * 0.50, y: h * 0.48, vx: 0, speed: 0.25, headR: 26, spine: [], stardust: [], animPhase: 2.0 },
            { type: pMode, nodeClass: 'standard', x: w * 0.70, y: h * 0.44, vx: 0, speed: 0.25, headR: 26, spine: [], stardust: [], animPhase: 3.0 },
            { type: pMode, nodeClass: 'hyper_comet', x: w * 0.14, y: 42, vx: 0, speed: 1.0, headR: 29, cometPhase: 'charging', cometChargeEnd: now + 750, cometDiveSpeed: 9.8, flameEmbers: [], spine: [], stardust: [], animPhase: 0.2 }
          ];
          state.lastSpawnTime = now + 999999;
        }
      }

      if (window.location.search.includes('test_missiles=1')) {
        if (!state._testedMissiles) {
          state._testedMissiles = true;
          const pMode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
          state.particles = [
            { type: pMode, nodeClass: 'standard', x: w * 0.50, y: h * 0.40, vx: 0, speed: 0, headR: 26, spine: [], stardust: [] },
            { type: pMode, nodeClass: 'corruptor_laser', x: w * 0.28, y: h * 0.38, vx: 0, speed: 0, headR: 32, laserState: 'idle', laserSalvosLeft: 0, spine: [], stardust: [] }
          ];
          setTimeout(() => {
            CoreKinematics.fireMissiles(catcherPixelX, catcherPixelY, performance.now(), state.particles, pMode);
          }, 400);
          state.lastSpawnTime = now + 999999;
        }
      }

      // ─────────────────────────────────────────────────────────────
      // OPTIONAL LIVE SHOWCASE RECORDER (?capture=1)
      // Automatically executes the choreographed test (2s still, sweep left,
      // reverse sharply right, capture node + hazard passing nearby) & streams frames
      // ─────────────────────────────────────────────────────────────
      if (window.location.search.includes('capture=1')) {
        state.combo = 10;
        state.coreTier = 4;
        state.isOverdrive = true;
        state.reflexLives = 3;
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

          // Seed deterministic showcase nodes + nearby hazard
          state.particles = [
            {
              type: modeName, nodeClass: 'cluster',
              x: w * 0.18, y: 55, vx: 0, speed: 1.55, baseSpeed: 1.55,
              headR: 28, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0,
              animPhase: 0.2, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              type: modeName, nodeClass: 'supercharge',
              x: w * 0.34, y: 15, vx: 0, speed: 1.60, baseSpeed: 1.60,
              headR: 30, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0,
              animPhase: 2.4, tumbleDir: -1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              // Target capture node at x = 0.64 * w
              type: modeName, nodeClass: 'standard',
              x: w * 0.64, y: (catcherPixelY - 78) - 2.20 * (3.45 * 60), vx: 0, speed: 2.20, baseSpeed: 2.20,
              headR: 26, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0,
              animPhase: 4.5, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            },
            {
              // Nearby hazard at x = 0.85 * w
              type: modeName, nodeClass: 'seeker',
              x: w * 0.85, y: (catcherPixelY - 20) - 2.10 * (3.65 * 60), vx: 0, speed: 2.10, baseSpeed: 2.10,
              headR: 30, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0,
              animPhase: 1.3, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: []
            }
          ];
          state.lastSpawnTime = now + 12000;
        }

        const cs = state._capState;
        if (!cs.done) {
          const tCap = (now - cs.startTime) / 1000.0;
          if (tCap < 2.0) {
            targetCatcherX = 0.45;
            currentCatcherX = 0.45;
          } else if (tCap < 2.65) {
            const pLeft = (tCap - 2.0) / 0.65;
            const ease = 0.5 - 0.5 * Math.cos(pLeft * Math.PI);
            targetCatcherX = 0.45 - 0.23 * ease;
          } else if (tCap < 3.25) {
            const pRight = (tCap - 2.65) / 0.60;
            const ease = 1.0 - Math.pow(1.0 - pRight, 2.6);
            targetCatcherX = 0.22 + 0.42 * ease;
          } else {
            targetCatcherX = 0.64;
          }
          currentCatcherX += (targetCatcherX - currentCatcherX) * 0.86;
          state.catcherX = currentCatcherX;
          catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
        } else {
          targetCatcherX = 0.50;
          currentCatcherX += (targetCatcherX - currentCatcherX) * 0.22;
          state.catcherX = currentCatcherX;
          catcherPixelX = Math.max(55, Math.min(w - 55, currentCatcherX * w));
          if (!cs.reseededForShot) {
            cs.reseededForShot = true;
            state.particles = [
              { type: modeName, nodeClass: 'cluster', x: w * 0.22, y: 120, vx: 0, speed: 1.5, baseSpeed: 1.5, headR: 28, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0, animPhase: 0.4, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: [] },
              { type: modeName, nodeClass: 'supercharge', x: w * 0.40, y: 40,  vx: 0, speed: 1.5, baseSpeed: 1.5, headR: 30, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0, animPhase: 2.1, tumbleDir: -1, spine: [{x:0,y:0},{x:0,y:0}], stardust: [] },
              { type: modeName, nodeClass: 'standard', x: w * 0.62, y: 85,  vx: 0, speed: 1.5, baseSpeed: 1.5, headR: 26, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0, animPhase: 3.9, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: [] },
              { type: modeName, nodeClass: 'seeker',  x: w * 0.82, y: 110, vx: 0, speed: 1.5, baseSpeed: 1.5, headR: 30, hasSplit: false, hasDetonated: false, phantomAlpha: 1.0, animPhase: 1.2, tumbleDir: 1, spine: [{x:0,y:0},{x:0,y:0}], stardust: [] }
            ];
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // UPDATE ARTICULATED WING & CORE KINEMATICS + WORLD SPEED STREAKS
      // ─────────────────────────────────────────────────────────────
      CoreKinematics.update(catcherPixelX, catcherPixelY, dtScale, now, state.coreTier, (state.catcherType === 'realm' ? 'dynamo' : state.catcherType), state.particles);
      CoreKinematics.updateAndDrawWorldStreaks(ctx, dtScale);

      // Render Reactive Ion Thruster Exhaust & Graze Sparks in World Coordinates
      const canvasW = ctx.canvas.width / (window.devicePixelRatio || 1);
      const isMobile = canvasW < 600;
      const drawW = isMobile ? Math.min(canvasW * 0.96, 420) : Math.min(canvasW * 0.86, 1060);
      const u = drawW / 1376.0;
      CoreKinematics.drawThrusterPlumes(ctx, u);
      CoreKinematics.drawGrazeSparks(ctx, u);

      // Update & Render Live Seeking Micro-Missiles
      CoreKinematics.updateAndDrawMissiles(ctx, dtScale, now, state);

      // ─────────────────────────────────────────────────────────────
      // DRAW LAYERED CHROME CORE WITH INDEPENDENT INTERNAL ANIMATION
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      if (state.catcherType === 'helix') {
        QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier);
      } else if (state.catcherType === 'dynamo' || state.catcherType === 'realm') {
        QuantumRenderer.drawDynamoCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier);
      } else {
        QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5, state.coreTier);
      }
      ctx.restore();

      // ─────────────────────────────────────────────────────────────
      // ─────────────────────────────────────────────────────────────
      // FEATURE 4: FLUX PULSE EXPANDING FULL-SCREEN SHOCKWAVE (UNIVERSE / PLANET DESTROYER)
      // ─────────────────────────────────────────────────────────────
      if (state.activeFluxPulse) {
        const fp = state.activeFluxPulse;
        // Physical expansion at 1350px/sec
        fp.radius += (fp.speed * dtScale) / 60;
        fp.alpha -= 0.016 * dtScale;
        fp.flashAlpha = Math.max(0, (fp.flashAlpha || 0.85) - 0.045 * dtScale);
        fp.screenShake = (fp.screenShake || 18) * 0.93;

        // Apply screen shake to entire world render
        if (fp.screenShake > 0.2) {
          const shakeX = (Math.random() - 0.5) * fp.screenShake;
          const shakeY = (Math.random() - 0.5) * fp.screenShake;
          ctx.translate(shakeX, shakeY);
        }

        // Full-screen Cataclysm Detonation Flash
        if (fp.flashAlpha > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const flashGrad = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, Math.max(w, h));
          if (fp.mode === 'helix') {
            flashGrad.addColorStop(0.0, `rgba(255, 255, 255, ${fp.flashAlpha * 0.75})`);
            flashGrad.addColorStop(0.4, `rgba(34, 211, 238, ${fp.flashAlpha * 0.50})`);
            flashGrad.addColorStop(1.0, `rgba(244, 63, 94, 0)`);
          } else if (fp.mode === 'meteor') {
            flashGrad.addColorStop(0.0, `rgba(255, 255, 255, ${fp.flashAlpha * 0.80})`);
            flashGrad.addColorStop(0.4, `rgba(251, 146, 60, ${fp.flashAlpha * 0.55})`);
            flashGrad.addColorStop(1.0, `rgba(220, 38, 38, 0)`);
          } else {
            flashGrad.addColorStop(0.0, `rgba(255, 255, 255, ${fp.flashAlpha * 0.80})`);
            flashGrad.addColorStop(0.4, `rgba(0, 240, 255, ${fp.flashAlpha * 0.55})`);
            flashGrad.addColorStop(1.0, `rgba(168, 85, 247, 0)`);
          }
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }

        // ─── UNIVERSE / PLANET DESTROYER HIT DETECTION & VAPORIZATION ───
        // Wavefront physically destroys all nodes (good & bad) without collecting power-ups!
        for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
          const pt = state.particles[pIdx];
          const distToWave = Math.hypot(pt.x - fp.x, pt.y - fp.y);
          if (distToWave <= fp.radius + 35) {
            const isHaz = isHazardNode(pt.nodeClass);
            // Award destruction score
            const killScore = isHaz ? 200 : 150;
            state.score += killScore;
            state.floatingTexts.push({
              x: pt.x,
              y: pt.y - 12,
              text: isHaz ? `+${killScore} VAPORIZED` : `+${killScore} ANNIHILATED`,
              color: isHaz ? '#f43f5e' : (fp.color || '#38bdf8'),
              alpha: 1.0,
              vy: -1.4,
              life: 0,
              maxLife: 45
            });

            // Shatter into 12 radiant kinetic debris shards
            if (!state.vaporizedShards) state.vaporizedShards = [];
            for (let sh = 0; sh < 12; sh++) {
              const sAngle = Math.atan2(pt.y - fp.y, pt.x - fp.x) + (Math.random() - 0.5) * 1.4;
              const sSpeed = Math.random() * 8.5 + 4.5;
              state.vaporizedShards.push({
                x: pt.x,
                y: pt.y,
                vx: Math.cos(sAngle) * sSpeed,
                vy: Math.sin(sAngle) * sSpeed,
                size: Math.random() * 4.2 + 2.2,
                color: isHaz ? '#f43f5e' : (fp.mode === 'helix' ? '#22d3ee' : (fp.mode === 'meteor' ? '#fb923c' : '#38bdf8')),
                life: 0,
                maxLife: Math.floor(Math.random() * 20 + 25)
              });
            }

            // Remove node completely - does NOT grant power-ups/buffs!
            state.particles.splice(pIdx, 1);
          }
        }

        // ─── CATACLYSMIC WAVEFRONT RENDER ───
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 1. Concentric Wavefront Rings
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = fp.color;
        ctx.lineWidth = 7;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fp.x, fp.y, Math.max(0, fp.radius * 0.90), 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fp.x, fp.y, Math.max(0, fp.radius * 0.78), 0, Math.PI * 2);
        ctx.strokeStyle = (fp.mode === 'meteor' ? '#fde047' : (fp.mode === 'helix' ? '#f43f5e' : '#a855f7'));
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 2. Mode-Specific Destroyer Graphics
        if (fp.mode === 'helix') {
          // Cytogenetic Prismatic Interference Shards
          const numFacets = 12;
          for (let f = 0; f < numFacets; f++) {
            const fa = (f * Math.PI * 2) / numFacets + now * 0.003;
            const fx = fp.x + Math.cos(fa) * fp.radius;
            const fy = fp.y + Math.sin(fa) * fp.radius;
            ctx.beginPath();
            ctx.arc(fx, fy, 6, 0, Math.PI * 2);
            ctx.fillStyle = (f % 2 === 0) ? '#22d3ee' : '#f43f5e';
            ctx.fill();
          }
        } else if (fp.mode === 'meteor') {
          // Solar Hypernova Prominences
          const numProm = 14;
          for (let pr = 0; pr < numProm; pr++) {
            const pa = (pr * Math.PI * 2) / numProm + now * 0.002;
            const px = fp.x + Math.cos(pa) * fp.radius;
            const py = fp.y + Math.sin(pa) * fp.radius;
            const pLen = 28 * Math.sin(now * 0.01 + pr);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(pa) * pLen, py + Math.sin(pa) * pLen);
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 3.5;
            ctx.stroke();
          }
        } else {
          // Dynamo Tachyon Lightning Bolts crackling from core to shockwave
          const numBolts = 16;
          for (let b = 0; b < numBolts; b++) {
            const ba = (b * Math.PI * 2) / numBolts + (Math.sin(b * 31) * 0.2);
            const rInner = Math.max(10, fp.radius * 0.55);
            let curBx = fp.x + Math.cos(ba) * rInner;
            let curBy = fp.y + Math.sin(ba) * rInner;
            ctx.beginPath();
            ctx.moveTo(curBx, curBy);
            const boltSteps = 5;
            for (let st = 1; st <= boltSteps; st++) {
              const rCur = rInner + (fp.radius - rInner) * (st / boltSteps);
              const jitterAngle = (Math.sin(now * 0.03 + b * 13 + st * 7) * 0.25);
              const nxtBx = fp.x + Math.cos(ba + jitterAngle) * rCur;
              const nxtBy = fp.y + Math.sin(ba + jitterAngle) * rCur;
              ctx.lineTo(nxtBx, nxtBy);
              curBx = nxtBx;
              curBy = nxtBy;
            }
            ctx.strokeStyle = (b % 2 === 0) ? 'rgba(0, 240, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }
        }
        ctx.restore();

        if (fp.alpha <= 0 || fp.radius > Math.max(w, h) * 1.35) {
          state.activeFluxPulse = null;
        }
      }

      // ─── RENDER & UPDATE VAPORIZED KINETIC SHARDS ───
      if (state.vaporizedShards && state.vaporizedShards.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let shIdx = state.vaporizedShards.length - 1; shIdx >= 0; shIdx--) {
          const s = state.vaporizedShards[shIdx];
          s.x += s.vx * dtScale;
          s.y += s.vy * dtScale;
          s.vy += 0.12 * dtScale; // slight gravity pull
          s.life += dtScale;
          const sAlpha = Math.max(0, 1.0 - (s.life / s.maxLife));
          const sRad = s.size * (0.5 + 0.5 * sAlpha);

          ctx.beginPath();
          ctx.arc(s.x, s.y, sRad, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = sAlpha;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(s.x, s.y, sRad * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          if (s.life >= s.maxLife) {
            state.vaporizedShards.splice(shIdx, 1);
          }
        }
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // UPDATE & RENDER WORLD-SPACE FEATURE HAZARD VFX (MODE-MATCHED EMP DOMES, BLINK GHOSTS, CORRUPTION BURSTS)
      // ─────────────────────────────────────────────────────────────
      const _getHazVfxPal = (m) => {
        if (m === 'meteor') {
          return {
            p: 'rgba(16, 185, 129, ',   // Abyssal emerald
            s: 'rgba(168, 85, 247, ',   // Void amethyst
            a: 'rgba(249, 115, 22, ',   // Magma flare
            mid: 'rgba(52, 211, 153, ', // Luminous emerald filament
            hex: '#10b981',
            empHex: '#34d399'
          };
        }
        if (m === 'helix') {
          return {
            p: 'rgba(225, 29, 72, ',    // Blood ruby
            s: 'rgba(251, 191, 36, ',   // Molten rose-gold
            a: 'rgba(232, 121, 249, ',  // Bio-magenta
            mid: 'rgba(253, 164, 175, ', // Ruby-gold filament
            hex: '#fb7185',
            empHex: '#e879f9'
          };
        }
        return {
          p: 'rgba(244, 63, 94, ',      // Dynamo crimson
          s: 'rgba(192, 132, 252, ',    // Plasma violet
          a: 'rgba(56, 189, 248, ',     // High-voltage cyan
          mid: 'rgba(251, 113, 133, ',  // Crimson-rose filament
          hex: '#f43f5e',
          empHex: '#38bdf8'
        };
      };

      if (state.empShockwaves && state.empShockwaves.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let swIdx = state.empShockwaves.length - 1; swIdx >= 0; swIdx--) {
          const sw = state.empShockwaves[swIdx];
          const swPal = _getHazVfxPal(sw.mode || state.catcherType);
          sw.r += 4.4 * dtScale;
          const prog = Math.min(1.0, sw.r / sw.maxR);
          sw.alpha = Math.max(0, 1.0 - Math.pow(prog, 1.4));

          // Kinetic push on nearby good nodes
          for (let k = 0; k < state.particles.length; k++) {
            const pt = state.particles[k];
            if (!isHazardNode(pt.nodeClass)) {
              const dxs = pt.x - sw.x;
              const dys = pt.y - sw.y;
              const ds = Math.hypot(dxs, dys);
              if (ds > 1 && Math.abs(ds - sw.r) < 28) {
                pt.x += (dxs / ds) * 2.8 * dtScale;
                pt.x = Math.max(30, Math.min(w - 30, pt.x));
              }
            }
          }

          // Check EMP Shock Dome wash over Player Core (non-lethal Pulse Drain + brief Thruster Static!)
          const distSwCore = Math.hypot(catcherPixelX - sw.x, catcherPixelY - sw.y);
          if (!sw.hitPlayer && Math.abs(distSwCore - sw.r) < 34) {
            sw.hitPlayer = true;
            if (!state.hasBuff('shield', now)) {
              state.pulseMeter = Math.max(0, (state.pulseMeter || 0) - 30);
              if (state.pulseMeter < 100) state.isPulseReady = false;
              state.empSlowUntil = now + 650;
              state.floatingTexts.push({
                x: catcherPixelX,
                y: catcherPixelY - 64,
                text: '⚡ EMP SHOCK! -30% PULSE',
                color: swPal.empHex,
                alpha: 1.0,
                startTime: now
              });
              updateHeaderUI();
            }
          }

          // Render Thick 3D Volumetric Feathered Mode-Matched EMP Plasma Dome (smooth outer falloff — zero hard edge!)
          const domeGrad = ctx.createRadialGradient(sw.x, sw.y, Math.max(0, sw.r * 0.48), sw.x, sw.y, sw.r);
          domeGrad.addColorStop(0.0, `${swPal.a}0)`);
          domeGrad.addColorStop(0.55, `${swPal.p}${0.18 * sw.alpha})`);
          domeGrad.addColorStop(0.78, `${swPal.a}${0.54 * sw.alpha})`);
          domeGrad.addColorStop(0.86, `rgba(255, 255, 255, ${0.68 * sw.alpha})`);
          domeGrad.addColorStop(0.93, `${swPal.a}${0.26 * sw.alpha})`);
          domeGrad.addColorStop(1.0, `${swPal.s}0)`);
          ctx.fillStyle = domeGrad;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
          ctx.fill();

          // Crawling Mode-Matched Plasma Crest Filaments riding the shockwave perimeter!
          ctx.lineCap = 'round';
          const crestR = sw.r * 0.85;
          for (let ca = 0; ca < 4; ca++) {
            const a0 = now * 0.004 + ca * (Math.PI * 0.5) + sw.r * 0.02;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.58 * sw.alpha})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, crestR, a0, a0 + 0.48);
            ctx.stroke();
          }

          if (sw.r >= sw.maxR || sw.alpha <= 0.01) {
            state.empShockwaves.splice(swIdx, 1);
          }
        }
        ctx.restore();
      }

      // Render Scientific Passive Resonance Effects (Dynamo Faraday Induction Arcs & Helix Base-Pair Ripples)
      if (state.scienceArcs && state.scienceArcs.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        for (let aIdx = state.scienceArcs.length - 1; aIdx >= 0; aIdx--) {
          const arc = state.scienceArcs[aIdx];
          arc.life += dtScale;
          const al = Math.max(0, 1.0 - arc.life / arc.maxLife);
          if (al <= 0.01) {
            state.scienceArcs.splice(aIdx, 1);
            continue;
          }
          const dx = arc.x2 - arc.x1;
          const dy = arc.y2 - arc.y1;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const segs = 6;
          ctx.beginPath();
          for (let s = 0; s <= segs; s++) {
            const f = s / segs;
            const jag = (s === 0 || s === segs) ? 0 : Math.sin(now * 0.05 + s * 4.3 + aIdx * 7) * 12;
            const px = arc.x1 + dx * f + nx * jag;
            const py = arc.y1 + dy * f + ny * jag;
            if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.82 * al})`;
          ctx.lineWidth = 4.2;
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * al})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      if (state.scienceRipples && state.scienceRipples.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let rIdx = state.scienceRipples.length - 1; rIdx >= 0; rIdx--) {
          const rp = state.scienceRipples[rIdx];
          rp.r += 5.2 * dtScale;
          const al = Math.max(0, 1.0 - rp.r / rp.maxR);
          if (al <= 0.01) {
            state.scienceRipples.splice(rIdx, 1);
            continue;
          }
          const rg = ctx.createRadialGradient(rp.x, rp.y, rp.r * 0.65, rp.x, rp.y, rp.r);
          rg.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          rg.addColorStop(0.75, `rgba(34, 211, 238, ${0.32 * al})`);
          rg.addColorStop(0.90, `rgba(232, 121, 249, ${0.42 * al})`);
          rg.addColorStop(1.0, 'rgba(232, 121, 249, 0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (state.blinkGhosts && state.blinkGhosts.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let gIdx = state.blinkGhosts.length - 1; gIdx >= 0; gIdx--) {
          const g = state.blinkGhosts[gIdx];
          const gPal = _getHazVfxPal(g.mode || state.catcherType);
          g.life += dtScale;
          const ga = Math.max(0, 1.0 - g.life / g.maxLife) * g.initAlpha;
          if (ga <= 0.01) {
            state.blinkGhosts.splice(gIdx, 1);
            continue;
          }
          const gg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
          gg.addColorStop(0.0, `rgba(255, 255, 255, ${ga * 0.85})`);
          gg.addColorStop(0.45, `${gPal.s}${ga * 0.72})`);
          gg.addColorStop(0.80, `${gPal.p}${ga * 0.35})`);
          gg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gg;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (state.corruptionBursts && state.corruptionBursts.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let cbIdx = state.corruptionBursts.length - 1; cbIdx >= 0; cbIdx--) {
          const cb = state.corruptionBursts[cbIdx];
          const cbPal = _getHazVfxPal(cb.mode || state.catcherType);
          cb.r += 3.8 * dtScale;
          cb.alpha -= 0.048 * dtScale;
          if (cb.alpha <= 0.01) {
            state.corruptionBursts.splice(cbIdx, 1);
            continue;
          }
          const cbg = ctx.createRadialGradient(cb.x, cb.y, cb.r * 0.35, cb.x, cb.y, cb.r);
          cbg.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
          cbg.addColorStop(0.50, `${cbPal.p}${cb.alpha * 0.72})`);
          cbg.addColorStop(0.68, `rgba(255, 255, 255, ${cb.alpha * 0.85})`);
          cbg.addColorStop(0.84, `${cbPal.s}${cb.alpha * 0.34})`);
          cbg.addColorStop(1.0, `${cbPal.s}0)`);
          ctx.fillStyle = cbg;
          ctx.beginPath();
          ctx.arc(cb.x, cb.y, cb.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
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
        const isHazard = isHazardNode(p.nodeClass);

        // ═══ FEATURE #1: INFERNO HYPER-COMET (Telegraphed Ultra-Fast Flaming Plunge!) ═══
        const isComet = (p.nodeClass === 'hyper_comet' || p.nodeClass === 'plasma_flare');
        if (isComet) {
          if (!p.flameEmbers) p.flameEmbers = [];
          // Update existing live flame embers
          for (let emIdx = p.flameEmbers.length - 1; emIdx >= 0; emIdx--) {
            const em = p.flameEmbers[emIdx];
            em.x += em.vx * dtScale;
            em.y += em.vy * dtScale;
            em.life += dtScale;
            if (em.life >= em.maxLife) p.flameEmbers.splice(emIdx, 1);
          }

          if (p.cometPhase === 'charging') {
            p.y = 42; // Pin at top ignition corridor while telegraphing lane
            if (Math.random() < 0.75) {
              p.flameEmbers.push({
                x: p.x + (Math.random() - 0.5) * 30,
                y: p.y + (Math.random() - 0.5) * 16,
                vx: (Math.random() - 0.5) * 1.4,
                vy: -1.6 - Math.random() * 2.2,
                size: 2.5 + Math.random() * 2.5,
                life: 0,
                maxLife: 16 + Math.random() * 10
              });
            }
            if (now >= (p.cometChargeEnd || 0)) {
              p.cometPhase = 'diving';
              p.speed = p.cometDiveSpeed || Math.max(8.5, p.speed * 3.6);
              audio.playHyperCometRoar();
              state.floatingTexts.push({
                x: p.x, y: p.y + 34,
                text: '🔥 INFERNO DIVE!',
                color: '#fb923c',
                alpha: 1.0,
                startTime: now
              });
            }
          } else {
            // Active Supersonic Dive: Stream continuous incandescent molten embers!
            for (let sE = 0; sE < 2; sE++) {
              p.flameEmbers.push({
                x: p.x + (Math.random() - 0.5) * 28,
                y: p.y - 8 - Math.random() * 14,
                vx: (Math.random() - 0.5) * 2.2,
                vy: -2.5 - Math.random() * 3.5,
                size: 2.8 + Math.random() * 3.0,
                life: 0,
                maxLife: 18 + Math.random() * 14
              });
            }
          }
        }

        // ═══ FEATURE #2: CORRUPTOR OVERLORD (Lasers Several Good Nodes -> Instant Bad Nodes!) ═══
        if (p.nodeClass === 'corruptor_laser') {
          if (p.laserState === 'idle' && (p.laserSalvosLeft || 0) > 0 && now >= (p.laserNextReady || 0) && p.y > 70 && p.y < h * 0.60) {
            // Scan for up to 3 nearby good nodes above the danger floor (never corrupts life catalyst/shield/missiles or nodes right on player)
            const candidates = [];
            for (let k = 0; k < state.particles.length; k++) {
              const other = state.particles[k];
              if (other !== p && !isHazardNode(other.nodeClass) && !other.hasDetonated &&
                  other.nodeClass !== 'catalyst' && other.nodeClass !== 'shield' && other.nodeClass !== 'missiles' &&
                  other.y > 40 && other.y < catcherPixelY - 115) {
                const distL = Math.hypot(other.x - p.x, other.y - p.y);
                if (distL < 430) {
                  candidates.push({ node: other, dist: distL });
                }
              }
            }
            candidates.sort((a, b) => a.dist - b.dist);
            if (candidates.length > 0) {
              p.laserTargets = candidates.slice(0, 3).map(c => c.node);
              p.laserState = 'charging';
              p.laserChargeStart = now;
              p.laserCharge = 0;
            }
          } else if (p.laserState === 'charging') {
            // Keep only targets still alive & still good
            p.laserTargets = (p.laserTargets || []).filter(t => state.particles.includes(t) && !isHazardNode(t.nodeClass) && !t.hasDetonated);
            if (p.laserTargets.length === 0) {
              p.laserState = 'idle';
              p.laserCharge = 0;
            } else {
              p.laserCharge = Math.min(1.0, (now - p.laserChargeStart) / 550);

              // Render Mode-Matched Volumetric Lock-On Focus Cones & Target Corruption Halos during Charge!
              const cPal = _getHazVfxPal(p.type || state.catcherType);
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              for (let tIdx = 0; tIdx < p.laserTargets.length; tIdx++) {
                const tn = p.laserTargets[tIdx];
                const dxT = tn.x - p.x;
                const dyT = tn.y - p.y;
                const distT = Math.hypot(dxT, dyT) || 1;
                const nx = -dyT / distT;
                const ny = dxT / distT;
                const coneW = (2.5 + p.laserCharge * 5.0);

                const focusGrad = ctx.createLinearGradient(p.x, p.y, tn.x, tn.y);
                focusGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.45 + p.laserCharge * 0.50})`);
                focusGrad.addColorStop(0.45, `${cPal.p}${0.38 + p.laserCharge * 0.45})`);
                focusGrad.addColorStop(1.0, `${cPal.s}${0.42 + p.laserCharge * 0.45})`);
                ctx.fillStyle = focusGrad;
                ctx.beginPath();
                ctx.moveTo(p.x + nx * coneW * 0.6, p.y + ny * coneW * 0.6);
                ctx.lineTo(tn.x + nx * coneW * 1.4, tn.y + ny * coneW * 1.4);
                ctx.lineTo(tn.x - nx * coneW * 1.4, tn.y - ny * coneW * 1.4);
                ctx.lineTo(p.x - nx * coneW * 0.6, p.y - ny * coneW * 0.6);
                ctx.closePath();
                ctx.fill();

                // Swirling mode-matched corruption lock halo around targeted good node
                const tHaloR = (tn.headR || 26) * (1.35 + 0.35 * p.laserCharge);
                const thg = ctx.createRadialGradient(tn.x, tn.y, tHaloR * 0.3, tn.x, tn.y, tHaloR);
                thg.addColorStop(0.0, `${cPal.p}0)`);
                thg.addColorStop(0.65, `${cPal.p}${0.50 * p.laserCharge})`);
                thg.addColorStop(1.0, `${cPal.s}0)`);
                ctx.fillStyle = thg;
                ctx.beginPath();
                ctx.arc(tn.x, tn.y, tHaloR, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();

              // UNLEASH VOLUMETRIC CORRUPTION LASERS & INSTANTLY CONVERT GOOD NODES -> NORMAL BAD NODES!
              if (p.laserCharge >= 1.0) {
                audio.playCorruptionLaser();
                for (let tIdx = 0; tIdx < p.laserTargets.length; tIdx++) {
                  const tn = p.laserTargets[tIdx];
                  state.hazardLasers.push({
                    x1: p.x, y1: p.y,
                    x2: tn.x, y2: tn.y,
                    life: 0,
                    maxLife: 28,
                    mode: p.type
                  });
                  // Instant Conversion to Normal Bad Node ('volatile')!
                  tn.nodeClass = 'volatile';
                  tn.headR = 28.0;
                  tn.justCorruptedUntil = now + 900;
                  tn.hasGrazed = false;
                  state.corruptionBursts.push({ x: tn.x, y: tn.y, r: 16, alpha: 1.0, mode: p.type });
                  state.floatingTexts.push({
                    x: tn.x, y: tn.y - 24,
                    text: '⚡ CORRUPTED!',
                    color: cPal.hex,
                    alpha: 1.0,
                    startTime: now
                  });
                }
                p.laserSalvosLeft = Math.max(0, (p.laserSalvosLeft || 1) - 1);
                p.laserState = 'firing';
                p.laserFireEnd = now + 380;
                p.laserNextReady = now + 1850;
                p.laserTargets = [];
              }
            }
          } else if (p.laserState === 'firing' && now >= (p.laserFireEnd || 0)) {
            p.laserState = 'idle';
            p.laserCharge = 0;
          }
        }

        // ═══ FEATURE #3: EVENT-HORIZON SINGULARITY (Black Hole Orbital Slingshot & Core Tidal Pull) ═══
        if (p.nodeClass === 'gravity_well' || p.nodeClass === 'vortex') {
          for (let k = 0; k < state.particles.length; k++) {
            const other = state.particles[k];
            if (other !== p && !isHazardNode(other.nodeClass)) {
              const dxV = p.x - other.x;
              const dyV = p.y - other.y;
              const distV = Math.hypot(dxV, dyV);
              if (distV < 215 && distV > 32) {
                const pullFactor = (1.0 - distV / 215);
                // Inward orbital capture + tangential swirl curve around event horizon
                const nx = dxV / distV;
                const ny = dyV / distV;
                const swirlX = -ny * pullFactor * 2.1 * dtScale;
                const pullX = nx * pullFactor * 1.85 * dtScale;
                other.x = Math.max(30, Math.min(w - 30, other.x + pullX + swirlX));
                other.gravityTuggedUntil = now + 1500;
              }
            }
          }
          // Subtle Tidal Gravitational Pull on Player Core (when within 230px & unshielded)
          const distCoreG = Math.hypot(catcherPixelX - p.x, catcherPixelY - p.y);
          if (distCoreG < 230 && distCoreG > 55 && !state.hasBuff('shield', now)) {
            const tidalStr = (1.0 - distCoreG / 230) * 0.0042 * dtScale;
            targetCatcherX = Math.max(0.05, Math.min(0.95, targetCatcherX + Math.sign(p.x - catcherPixelX) * tidalStr));
          }
        }

        // ═══ FEATURE #4: OVERLOAD EMP SHOCK-MINE (Timed Expanding Volumetric Plasma EMP Dome) ═══
        if (p.nodeClass === 'emp_detonator' || p.nodeClass === 'emp_glitch' || p.nodeClass === 'pulsar_mine') {
          if (!p.empNextPulse) p.empNextPulse = now + 1500;
          const timeToPulse = p.empNextPulse - now;
          if (timeToPulse <= 550 && timeToPulse > 0) {
            p.empCharge = Math.min(1.0, 1.0 - (timeToPulse / 550));
          } else if (timeToPulse <= 0 && p.y > 55 && p.y < h - 60) {
            p.empCharge = 0;
            p.empNextPulse = now + 2100;
            audio.playEmpShockwave();
            state.empShockwaves.push({
              x: p.x, y: p.y,
              r: 26,
              maxR: 148,
              alpha: 1.0,
              hitPlayer: false,
              mode: p.type
            });
          } else {
            p.empCharge = 0;
          }
        }

        // ═══ FEATURE #5: QUANTUM BLINK STALKER (Telegraphed Exit Wormhole Teleportation!) ═══
        if (p.nodeClass === 'phase_stalker' || p.nodeClass === 'tachyon_fracture') {
          if (p.blinkState === 'idle' && (p.blinksLeft || 0) > 0 && p.y > h * 0.22 && p.y < h * 0.56) {
            // Choose a fair exit lane guaranteed >= 125px laterally away from Player Core
            let exitX = (p.x < w * 0.5) ? Math.min(w - 75, p.x + 175) : Math.max(75, p.x - 175);
            if (Math.abs(exitX - catcherPixelX) < 125) {
              exitX = (catcherPixelX < w * 0.5) ? Math.min(w - 75, catcherPixelX + 155) : Math.max(75, catcherPixelX - 155);
            }
            p.blinkTargetX = exitX;
            p.blinkTargetY = Math.min(h * 0.62, p.y + 52);
            p.blinkState = 'telegraphing';
            p.blinkStartTime = now;
            p.blinkProgress = 0;
          } else if (p.blinkState === 'telegraphing') {
            p.blinkProgress = Math.min(1.0, (now - (p.blinkStartTime || now)) / 650);

            // Render Sculpted Mode-Matched 3D Event-Horizon Exit Wormhole Portal + Quantum Entanglement Tether!
            const wPal = _getHazVfxPal(p.type || state.catcherType);
            const pAlpha = 0.45 + 0.55 * p.blinkProgress;

            // 0. Shimmering Quantum-Entanglement Vector Tether connecting Stalker -> Exit Portal (clear telegraph!)
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const tGrad = ctx.createLinearGradient(p.x, p.y, p.blinkTargetX, p.blinkTargetY);
            tGrad.addColorStop(0.0, `${wPal.p}${0.22 * pAlpha})`);
            tGrad.addColorStop(0.5, `${wPal.s}${0.52 * pAlpha})`);
            tGrad.addColorStop(1.0, `rgba(255, 255, 255, ${0.65 * pAlpha})`);
            const dtx = p.blinkTargetX - p.x;
            const dty = p.blinkTargetY - p.y;
            const dlen = Math.hypot(dtx, dty) || 1;
            const tnx = -dty / dlen;
            const tny = dtx / dlen;
            ctx.strokeStyle = tGrad;
            ctx.lineWidth = 2.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (let ts = 0; ts <= 8; ts++) {
              const tf = ts / 8;
              const wave = (ts === 0 || ts === 8) ? 0 : Math.sin(now * 0.025 + tf * Math.PI * 3.0) * 6.5;
              const qx = p.x + dtx * tf + tnx * wave;
              const qy = p.y + dty * tf + tny * wave;
              if (ts === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
            }
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.translate(p.blinkTargetX, p.blinkTargetY);
            const portalR = (20 + 20 * p.blinkProgress);
            const pRot = now * 0.0065;

            // 1. Outer Dimensional Halo Bloom
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const pGlow = ctx.createRadialGradient(0, 0, portalR * 0.45, 0, 0, portalR * 1.55);
            pGlow.addColorStop(0.0, `${wPal.s}${0.48 * pAlpha})`);
            pGlow.addColorStop(0.45, `${wPal.p}${0.38 * pAlpha})`);
            pGlow.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = pGlow;
            ctx.beginPath();
            ctx.arc(0, 0, portalR * 1.55, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 2. Pitch-Black Obsidian Dimensional Void Center
            const voidGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, portalR * 0.78);
            voidGrad.addColorStop(0.0, 'rgba(3, 2, 8, 0.98)');
            voidGrad.addColorStop(0.68, 'rgba(10, 4, 22, 0.92)');
            voidGrad.addColorStop(1.0, 'rgba(10, 4, 22, 0)');
            ctx.fillStyle = voidGrad;
            ctx.beginPath();
            ctx.arc(0, 0, portalR * 0.78, 0, Math.PI * 2);
            ctx.fill();

            // 3. Sculpted Sweeping Vortex Plasma Crescent Arcs Wrapping the Event Rim
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';
            for (let wl = 0; wl < 3; wl++) {
              const startA = pRot + wl * (Math.PI * 2 / 3);
              const endA = startA + 1.38;
              ctx.strokeStyle = (wl % 2 === 0) ? `${wPal.s}${0.82 * pAlpha})` : `${wPal.p}${0.78 * pAlpha})`;
              ctx.lineWidth = 4.2;
              ctx.beginPath();
              ctx.arc(0, 0, portalR * 0.78, startA, endA);
              ctx.stroke();

              ctx.strokeStyle = `rgba(255, 255, 255, ${0.88 * pAlpha})`;
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.arc(0, 0, portalR * 0.78, startA + 0.25, endA - 0.15);
              ctx.stroke();
            }
            ctx.restore();
            ctx.restore();

            if (p.blinkProgress >= 1.0 && (p.blinksLeft || 0) > 0) {
              // Execute Instantaneous Quantum Warp-Jump + Spawn 4 Volumetric Ghost Afterimages!
              for (let gStep = 0; gStep < 4; gStep++) {
                const frac = gStep / 3.5;
                state.blinkGhosts.push({
                  x: p.x + (p.blinkTargetX - p.x) * frac,
                  y: p.y + (p.blinkTargetY - p.y) * frac,
                  r: 28 * (0.75 + 0.35 * frac),
                  initAlpha: 0.45 + 0.40 * frac,
                  life: 0,
                  maxLife: 18 + gStep * 3,
                  mode: p.type
                });
              }
              audio.playQuantumBlink();
              p.x = p.blinkTargetX;
              p.y = p.blinkTargetY;
              p.spine = [];
              p.blinksLeft = Math.max(0, (p.blinksLeft || 1) - 1);
              p.blinkState = 'idle';
              p.blinkProgress = 0;
            }
          }
        }

        // Classic Hazard Kinematics (Seeker, Fragmentation, Phantom)
        if (p.nodeClass === 'seeker') {
          // Tracking Seeker Mine: Horizontally glides towards the core
          const dxSeek = catcherPixelX - p.x;
          const steerSpeed = Math.min(2.4, Math.abs(dxSeek) * 0.038) * Math.sign(dxSeek);
          p.x += steerSpeed * dtScale;
          p.x = Math.max(30, Math.min(w - 30, p.x));
        }

        if (p.nodeClass === 'fragmentation' && !p.hasDetonated && p.y > h * 0.38) {
          // Fragmentation Bolide: Detonates mid-air into 3 angled shrapnel shards!
          p.hasDetonated = true;
          audio.playHazardExplosion();
          const shardAngles = [-0.55, 0, 0.55];
          for (let sIdx = 0; sIdx < 3; sIdx++) {
            const ang = shardAngles[sIdx];
            const sh = {
              type: p.type,
              nodeClass: 'volatile',
              x: p.x + (sIdx - 1) * 16,
              y: p.y,
              vx: Math.sin(ang) * 3.2,
              speed: p.speed * 1.15,
              baseSpeed: p.baseSpeed,
              headR: 18.0,
              isShard: true,
              animPhase: Math.random() * Math.PI * 2,
              spine: []
            };
            for (let j = 0; j < 6; j++) sh.spine.push({ x: sh.x, y: sh.y - j * 7 });
            state.particles.push(sh);
          }
          state.particles.splice(i, 1);
          continue;
        }

        if (p.nodeClass === 'phantom') {
          // Stealth Phase-Glitch Trap: Dynamic decloaking within 220px of player
          const distToPlayer = Math.hypot(catcherPixelX - p.x, catcherPixelY - p.y);
          if (distToPlayer < 220) {
            p.phantomAlpha = 0.55 + 0.45 * Math.sin(now * 0.02);
          } else {
            p.phantomAlpha = 0.08 + 0.14 * (0.5 + 0.5 * Math.sin(now * 0.005 + p.animPhase));
          }
        }

        // ─────────────────────────────────────────────────────────────
        // UNIVERSAL DYNAMIC ANTI-COLLISION & ANTI-OVERLAP ENGINE
        // (Skip Hyper-Comet lane push so its telegraphed dive trajectory stays 100% straight & honest!)
        // ─────────────────────────────────────────────────────────────
        if (!isComet) {
          for (let j = 0; j < state.particles.length; j++) {
            if (i === j) continue;
            const other = state.particles[j];
            const otherIsHazard = isHazardNode(other.nodeClass);
            const isOpposite = (isHazard !== otherIsHazard);

            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.hypot(dx, dy);
            const targetGap = isOpposite ? 115 : 82;

            if (dist < targetGap && Math.abs(dy) < (isOpposite ? 130 : 95) && dist > 0.1) {
              const dir = (dx !== 0) ? Math.sign(dx) : (i > j ? 1 : -1);
              if (isOpposite) {
                if (isHazard) {
                  const pushFactor = Math.pow(1.0 - (dist / targetGap), 1.3) * 4.2 * dtScale;
                  p.x += dir * pushFactor;
                  p.vx = (p.vx || 0) * 0.85 + dir * pushFactor * 0.50;
                  p.x = Math.max(48, Math.min(w - 48, p.x));
                }
              } else {
                const pushFactor = Math.pow(1.0 - (dist / targetGap), 1.2) * 2.0 * dtScale;
                p.x += dir * pushFactor * 0.5;
                p.x = Math.max(40, Math.min(w - 40, p.x));
              }
            }
          }
        }

        // Apply horizontal velocity
        if (p.vx) {
          p.x += p.vx * dtScale;
          p.vx *= 0.98;
        }

        // Active Buffs: Bullet-Time (Chronos) & Graviton Vacuum (Singularity)
        let globalSpeedMultiplier = 1.0;
        if (state.hasBuff('chronos', now) || state.hasBuff('stasis', now)) {
          globalSpeedMultiplier = 0.40; // 60% slow motion bullet-time!
        }
        if (state.hasBuff('singularity', now)) {
          if (!isHazardNode(p.nodeClass)) {
            const dxSing = catcherPixelX - p.x;
            const dySing = catcherPixelY - p.y;
            const distSing = Math.hypot(dxSing, dySing);
            if (distSing > 10) {
              p.x += (dxSing / distSing) * 6.5 * dtScale;
              p.y += (dySing / distSing) * 3.5 * dtScale;
            }
          }
        }

        // Near-Core Proximity Slowdown & Tether Attraction
        const dxToCore = catcherPixelX - p.x;
        const dyToCore = catcherPixelY - p.y;
        const distToCore = Math.hypot(dxToCore, dyToCore);

        // Emergency Life Recovery Magnetic Assist (Clutch Save)
        if (p.nodeClass === 'catalyst' && state.reflexLives < 3 && distToCore < 190 && p.y < catcherPixelY + 30) {
          const lifeMagnet = (1.0 - (distToCore / 190)) * 1.6;
          p.x += Math.sign(dxToCore) * Math.min(Math.abs(dxToCore) * 0.20, lifeMagnet * 4.8 * dtScale);
        }

        // Regular Hazard Proximity Escalation (Dynamic Telegraph when approaching Core within 230px!)
        if (isHazard) {
          p._proxHeat = (distToCore < 230) ? Math.max(0, Math.min(1, 1.0 - distToCore / 230)) : 0;
        }

        let speedFactor = 1.0;
        if (!isHazard && p.helixStabilizedUntil && now < p.helixStabilizedUntil) {
          speedFactor *= 0.82; // Helix Chiral Base-Pair Stabilization (-18% gentle fall speed!)
        }
        if (distToCore < gravRadius && p.y < catcherPixelY + 20 && !isHazardNode(p.nodeClass)) {
          speedFactor *= 0.72; // Proximity tether dampening
          const gravStrength = (1.0 - (distToCore / gravRadius)) * 0.95;
          p.x += Math.sign(dxToCore) * Math.min(Math.abs(dxToCore) * 0.14, gravStrength * 4.2 * dtScale);

          const modeKey = (p.type === 'helix') ? 'helix' : (p.type === 'meteor' ? 'meteor' : 'dynamo');
          QuantumRenderer.drawContactBurst(ctx, (p.x + catcherPixelX) * 0.5, catcherPixelY - 52, modeKey, gravStrength, now);
        }

        // Advance Node using Delta-Time (Charging Hyper-Comet stays pinned at y = 42 until ignition!)
        if (!(isComet && p.cometPhase === 'charging')) {
          p.y += p.speed * dtScale * speedFactor * globalSpeedMultiplier;
        }

        if (!p.spine) p.spine = [];
        p.spine.unshift({ x: p.x, y: p.y });
        if (p.spine.length > 14) p.spine.pop();

        // Render Celestial Flux Node / Hazard
        ctx.save();
        if (p.type === 'dynamo' || p.type === 'realm') {
          QuantumRenderer.drawTier3DynamoParticle(ctx, p, timestamp);
        } else if (p.type === 'helix') {
          QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
        } else {
          QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
        }
        ctx.restore();

        // ─────────────────────────────────────────────────────────────
        // COLLISION CHECK, PRECISION CATCH & SPECIAL ARCHETYPE POWERS
        // ─────────────────────────────────────────────────────────────
        const coreSphereRadius = 68.0 * u;
        const nodeSphereRadius = p.headR ? (p.headR * (isMobile ? 0.72 : 1.0)) : (isMobile ? 26.0 : 36.0);
        const hazardContactRadius = coreSphereRadius + nodeSphereRadius;
        const effectiveHitRadius = isHazard ? hazardContactRadius : hitRadius;

        // Evasion Graze Mechanic for Hazards (Tiered Bonus for Apex Feature Hazards!)
        if (isHazard && !p.hasGrazed && distToCore >= hazardContactRadius && distToCore < hazardContactRadius + 32.0) {
          p.hasGrazed = true;
          const grazeBonus = isComet ? 400
            : ((p.nodeClass === 'corruptor_laser' || p.nodeClass === 'gravity_well' || p.nodeClass === 'phase_stalker') ? 350 : 250);
          const grazeLabel = isComet ? '🔥 THERMAL GRAZE +400 (+15% PULSE)'
            : (grazeBonus === 350 ? '⚡ APEX GRAZE +350' : 'GRAZE +250');
          state.score += grazeBonus;
          if (isComet) {
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 15);
            if (state.pulseMeter >= 100) { state.isPulseReady = true; audio.playPulseCharged(); }
          }
          CoreKinematics.triggerGraze(p.x, p.y, now);
          state.floatingTexts.push({
            x: p.x,
            y: p.y,
            text: grazeLabel,
            color: isComet ? '#fb923c' : '#38bdf8',
            alpha: 1.0,
            startTime: now
          });
          audio.playGrazeCatch(state.combo);
        }

        if (distToCore < effectiveHitRadius) {
          // Check if player caught a Hazard Trap!
          if (isHazard) {
            // Check if 5-Second Aegis Shield is active (independent of any simultaneous power-ups!)
            if (state.hasBuff('shield', now)) {
              const wasChargingCorruptor = (p.nodeClass === 'corruptor_laser' && p.laserState === 'charging');
              const defPts = wasChargingCorruptor ? 450 : 300;
              state.score += defPts;
              if (wasChargingCorruptor) {
                state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 15);
                if (state.pulseMeter >= 100) state.isPulseReady = true;
              }
              CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY, now);
              state.floatingTexts.push({
                x: p.x,
                y: p.y,
                text: wasChargingCorruptor ? '🛡️ SALVO INTERRUPTED +450!' : 'SHIELD DEFLECT +300',
                color: '#fbbf24',
                alpha: 1.0,
                startTime: now
              });
              audio.playPerfectCatch(state.combo);
              state.particles.splice(i, 1);
              updateHeaderUI();
              continue;
            }

            if (p.nodeClass === 'emp_detonator' || p.nodeClass === 'emp_glitch' || p.nodeClass === 'pulsar_mine') {
              state.pulseMeter = 0;
              state.isPulseReady = false;
            }

            if (state.coreTier > 1) {
              state.coreTier--;
              const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
              state.combo = tierFloorCombo[state.coreTier] || 0;
            } else {
              state.coreTier = 1;
              state.combo = 0;
            }
            state.reflexLives--;
            state.consecutivePerfects = 0;
            state.resonanceChain = 0;
            audio.playHazardExplosion();
            renderReflexShields();

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

          // Recommendation 4: Archetype Multipliers & Active Buff Powers
          let classMultiplier = 1.0;
          let clusterBonus = state.hasBuff('cluster', now) ? 2.0 : 1.0;

          if (p.nodeClass === 'cluster') {
            // DUPLICATE ALL NON-HAZARD NODES ON SCREEN!
            const toAdd = [];
            for (let pt of state.particles) {
              if (!isHazardNode(pt.nodeClass) && pt !== p && !pt.isDuplicate) {
                // Ensure duplicate spawns in a distinct, non-overlapping lane with at least 95px lateral offset
                const side = (pt.x > w * 0.5) ? -1 : 1;
                const dupX = Math.max(50, Math.min(w - 50, pt.x + side * 95));
                const dupY = Math.max(-20, pt.y - 55);
                toAdd.push({
                  ...pt,
                  x: dupX,
                  y: dupY,
                  isDuplicate: true,
                  spine: []
                });
              }
            }
            for (let n of toAdd) {
              for (let j = 0; j < 8; j++) n.spine.push({ x: n.x, y: n.y - j * 8.5 });
              state.particles.push(n);
            }
            state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
            audio.playOverdriveFanfare();
            classMultiplier = 2.0;

          } else if (p.nodeClass === 'supercharge') {
            classMultiplier = 8.0;
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 50);
            if (state.pulseMeter >= 100) { state.isPulseReady = true; audio.playPulseCharged(); }
            state.applyBuff('hyper', 'HYPER SURGE', '#fbbf24', '⚡', 5000, now);
            audio.playOverdriveFanfare();

          } else if (p.nodeClass === 'chronos') {
            state.applyBuff('chronos', 'CHRONOS STASIS', '#22d3ee', '⏳', 4500, now);
            audio.playPhaseSwitch();

          } else if (p.nodeClass === 'singularity') {
            state.applyBuff('singularity', 'GRAVITON VACUUM', '#38bdf8', '🧲', 3500, now);
            audio.playPulseCharged();

          } else if (p.nodeClass === 'catalyst') {
            const targetTierCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
            state.coreTier = Math.min(5, state.coreTier + 1);
            state.combo = Math.max(state.combo, targetTierCombo[state.coreTier] || state.combo);
            state.isOverdrive = (state.coreTier >= 4);
            const prevLives = state.reflexLives;
            state.reflexLives = Math.min(3, state.reflexLives + 1);
            renderReflexShields();
            state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
            if (state.coreTier === 5) audio.playTier5Ascension();
            else audio.playOverdriveFanfare();
            state.floatingTexts.push({
              x: p.x,
              y: p.y - 20,
              text: state.reflexLives > prevLives ? '💚 +1 LIFE RESTORED! (TIER +1)' : '💎 ASCENSION TIER +1 (OVERDRIVE)',
              color: '#34d399',
              alpha: 1.0,
              startTime: now
            });

          } else if (p.nodeClass === 'shield') {
            state.applyBuff('shield', 'AEGIS SHIELD', '#f59e0b', '🛡️', 5000, now);
            CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY, now);
            audio.playPulseCharged();
            classMultiplier = 3.0;

          } else if (p.nodeClass === 'missiles') {
            const mColor = (state.catcherType === 'meteor') ? '#f97316' : ((state.catcherType === 'helix') ? '#22d3ee' : '#38bdf8');
            state.applyBuff('missiles', 'ALLIED MISSILES', mColor, '🚀', 4000, now);
            CoreKinematics.fireMissiles(catcherPixelX, catcherPixelY, now, state.particles, state.catcherType || 'dynamo');
            audio.playOverdriveFanfare();
            classMultiplier = 4.0;
          }

          const basePoints = 300;
          const finalCatchPoints = Math.floor(basePoints * state.combo * precisionMultiplier * classMultiplier * clusterBonus);
          state.score += finalCatchPoints;
          const prevCombo = state.combo;
          state.combo = Math.min(50, state.combo + 1);
          if (prevCombo < 21 && state.combo >= 21) {
            state.isOverdrive = true;
            state.overdriveEndTime = 0; // Stays active as long as 21x streak is held!
            audio.playOverdriveFanfare();
          } else if (prevCombo < 28 && state.combo >= 28) {
            audio.playTier5Ascension();
          }

          // Perfect Catch Charging Flux Pulse (3 in a row fills meter!)
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

          // ─── SCIENTIFIC REALM-SPECIFIC GOOD-NODE PASSIVE RESONANCES & SLINGSHOT RESCUES ───
          const catchMode = (p.type === 'helix') ? 'helix' : (p.type === 'meteor' ? 'meteor' : 'dynamo');
          if (p.gravityTuggedUntil && now < p.gravityTuggedUntil) {
            state.score += 200;
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 10);
            if (state.pulseMeter >= 100) state.isPulseReady = true;
            state.floatingTexts.push({
              x: p.x, y: p.y - 34,
              text: '🌌 GRAVITY SLINGSHOT +200!',
              color: '#38bdf8',
              alpha: 1.0,
              startTime: now
            });
          } else if (catchMode === 'dynamo') {
            // DYNAMO SCIENCE: Faraday Chain Induction — arc jumps to nearest good orb within 220px & pulls it toward player!
            let nearestGood = null;
            let bestArcDist = 220;
            for (let k = 0; k < state.particles.length; k++) {
              const other = state.particles[k];
              if (other !== p && !isHazardNode(other.nodeClass)) {
                const dArc = Math.hypot(other.x - p.x, other.y - p.y);
                if (dArc < bestArcDist) {
                  bestArcDist = dArc;
                  nearestGood = other;
                }
              }
            }
            if (nearestGood) {
              nearestGood.x += Math.sign(catcherPixelX - nearestGood.x) * Math.min(24, Math.abs(catcherPixelX - nearestGood.x) * 0.25);
              state.score += 50;
              state.scienceArcs.push({ x1: p.x, y1: p.y, x2: nearestGood.x, y2: nearestGood.y, life: 0, maxLife: 14 });
            }
          } else if (catchMode === 'helix' && isPerfect) {
            // HELIX SCIENCE: Chiral Base-Pair Stabilization — precision catch slows other falling good pearls by 18% for 1.4s!
            state.scienceRipples.push({ x: catcherPixelX, y: catcherPixelY, r: 24, maxR: 260 });
            for (let k = 0; k < state.particles.length; k++) {
              const other = state.particles[k];
              if (other !== p && !isHazardNode(other.nodeClass)) {
                other.helixStabilizedUntil = now + 1400;
              }
            }
          } else if (catchMode === 'meteor' && Math.abs(state.catcherVelocity || 0) > 3.2) {
            // METEOR SCIENCE: Kinetic Ablation Slingshot — banking swiftly into a molten bolide yields +120 & +6% Pulse!
            state.score += 120;
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 6);
            if (state.pulseMeter >= 100) state.isPulseReady = true;
            state.floatingTexts.push({
              x: p.x, y: p.y - 30,
              text: '☄️ KINETIC DEFLECT +120',
              color: '#fbbf24',
              alpha: 1.0,
              startTime: now
            });
          }

          // Trigger Mode-Specific Layered Capture Physics
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
          if (isHazardNode(p.nodeClass)) {
            state.score += 150; // Dodging reward for successfully avoiding hazards!
            state.particles.splice(i, 1);
            updateHeaderUI();
            continue;
          }

          // Bonus Power-Ups and Cluster Duplicate Nodes do NOT penalize player if missed
          if (p.isDuplicate || p.nodeClass !== 'standard') {
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
            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
            state.combo = tierFloorCombo[state.coreTier] || 0;
          } else {
            state.combo = 0;
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
      // RENDER VOLUMETRIC CORRUPTION LASER BEAMS & EMP CORE STATIC
      // ─────────────────────────────────────────────────────────────
      if (state.hazardLasers && state.hazardLasers.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let lIdx = state.hazardLasers.length - 1; lIdx >= 0; lIdx--) {
          const lb = state.hazardLasers[lIdx];
          lb.life += dtScale;
          const frac = Math.min(1.0, lb.life / lb.maxLife);
          const alpha = Math.max(0, 1.0 - Math.pow(frac, 1.5));
          if (alpha <= 0.01) {
            state.hazardLasers.splice(lIdx, 1);
            continue;
          }

          const dxL = lb.x2 - lb.x1;
          const dyL = lb.y2 - lb.y1;
          const lenL = Math.hypot(dxL, dyL) || 1;
          const nxL = -dyL / lenL;
          const nyL = dxL / lenL;
          const widthScale = 1.0 - frac * 0.45;

          const lbPal = _getHazVfxPal(lb.mode || state.catcherType);
          // Layer 1: Wide Volumetric Outer Plasma Bloom Sheath (22px tapering gradient)
          const outerW = 13.0 * widthScale;
          const outerGrad = ctx.createLinearGradient(lb.x1, lb.y1, lb.x2, lb.y2);
          outerGrad.addColorStop(0.0, `${lbPal.p}${0.74 * alpha})`);
          outerGrad.addColorStop(0.5, `${lbPal.s}${0.60 * alpha})`);
          outerGrad.addColorStop(1.0, `${lbPal.p}${0.80 * alpha})`);
          ctx.fillStyle = outerGrad;
          ctx.beginPath();
          ctx.moveTo(lb.x1 + nxL * outerW, lb.y1 + nyL * outerW);
          ctx.lineTo(lb.x2 + nxL * outerW * 1.15, lb.y2 + nyL * outerW * 1.15);
          ctx.lineTo(lb.x2 - nxL * outerW * 1.15, lb.y2 - nyL * outerW * 1.15);
          ctx.lineTo(lb.x1 - nxL * outerW, lb.y1 - nyL * outerW);
          ctx.closePath();
          ctx.fill();

          // Layer 2: High-Energy Mid Mode-Matched Beam Core (9px)
          const midW = 5.5 * widthScale;
          ctx.fillStyle = `${lbPal.mid}${0.92 * alpha})`;
          ctx.beginPath();
          ctx.moveTo(lb.x1 + nxL * midW, lb.y1 + nyL * midW);
          ctx.lineTo(lb.x2 + nxL * midW, lb.y2 + nyL * midW);
          ctx.lineTo(lb.x2 - nxL * midW, lb.y2 - nyL * midW);
          ctx.lineTo(lb.x1 - nxL * midW, lb.y1 - nyL * midW);
          ctx.closePath();
          ctx.fill();

          // Layer 3: Blinding White-Hot Laser Filament Core (3.2px)
          const coreW = 2.0 * widthScale;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * alpha})`;
          ctx.beginPath();
          ctx.moveTo(lb.x1 + nxL * coreW, lb.y1 + nyL * coreW);
          ctx.lineTo(lb.x2 + nxL * coreW, lb.y2 + nyL * coreW);
          ctx.lineTo(lb.x2 - nxL * coreW, lb.y2 - nyL * coreW);
          ctx.lineTo(lb.x1 - nxL * coreW, lb.y1 - nyL * coreW);
          ctx.closePath();
          ctx.fill();

          // Layer 4: Mode-Aligned Scientific Beam Signature (Dynamo Lightning / Helix Double-Strand / Meteor Isotope Pulses!)
          const lbMode = (lb.mode === 'helix') ? 'helix' : (lb.mode === 'meteor' ? 'meteor' : 'dynamo');
          if (lbMode === 'helix') {
            // Corrupted Helix Beam: Twin twisting ruby-gold double-helix strands coiling down the laser!
            ctx.lineCap = 'round';
            for (let hs = -1; hs <= 1; hs += 2) {
              ctx.beginPath();
              for (let s = 0; s <= 14; s++) {
                const f = s / 14;
                const off = Math.sin(f * Math.PI * 4.5 - frac * 10.0) * 11.0 * widthScale * hs;
                const hx = lb.x1 + dxL * f + nxL * off;
                const hy = lb.y1 + dyL * f + nyL * off;
                if (s === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
              }
              ctx.strokeStyle = hs > 0 ? `rgba(251, 191, 36, ${0.82 * alpha})` : `rgba(244, 63, 94, ${0.82 * alpha})`;
              ctx.lineWidth = 2.4 * widthScale;
              ctx.stroke();
            }
          } else if (lbMode === 'dynamo') {
            // Corrupted Dynamo Beam: Forked crackling crimson-violet dielectric arc wrapping the laser!
            ctx.beginPath();
            for (let s = 0; s <= 10; s++) {
              const f = s / 10;
              const jag = (s === 0 || s === 10) ? 0 : Math.sin(now * 0.06 + s * 5.7 + lIdx * 3) * 14.0 * widthScale;
              const lx = lb.x1 + dxL * f + nxL * jag;
              const ly = lb.y1 + dyL * f + nyL * jag;
              if (s === 0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
            }
            ctx.strokeStyle = `rgba(192, 132, 252, ${0.85 * alpha})`;
            ctx.lineWidth = 2.6 * widthScale;
            ctx.stroke();
          }

          // Traveling Plasma / Isotope Energy Pulses along Beam
          for (let pStep = 0; pStep < 3; pStep++) {
            const tPos = ((frac * 2.2 + pStep * 0.33) % 1.0);
            const pxB = lb.x1 + dxL * tPos;
            const pyB = lb.y1 + dyL * tPos;
            const pulseG = ctx.createRadialGradient(pxB, pyB, 0, pxB, pyB, 14 * widthScale);
            pulseG.addColorStop(0.0, `rgba(255, 255, 255, ${0.90 * alpha})`);
            pulseG.addColorStop(0.45, `${lbPal.p}${0.68 * alpha})`);
            pulseG.addColorStop(1.0, `${lbPal.s}0)`);
            ctx.fillStyle = pulseG;
            ctx.beginPath();
            ctx.arc(pxB, pyB, 14 * widthScale, 0, Math.PI * 2);
            ctx.fill();
          }

          // Layer 5: Muzzle Flare at Corruptor Eye & Impact Corona at Corrupted Node
          const endPts = [{ x: lb.x1, y: lb.y1, r: 28 }, { x: lb.x2, y: lb.y2, r: 38 }];
          for (let eI = 0; eI < endPts.length; eI++) {
            const ep = endPts[eI];
            const eg = ctx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, ep.r * widthScale);
            eg.addColorStop(0.0, `rgba(255, 255, 255, ${0.95 * alpha})`);
            eg.addColorStop(0.35, `${lbPal.p}${0.82 * alpha})`);
            eg.addColorStop(0.75, `${lbPal.s}${0.38 * alpha})`);
            eg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(ep.x, ep.y, ep.r * widthScale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // EMP Thruster Static Halo on Player Core when momentarily dampened by EMP Shockwave
      if (state.empSlowUntil && state.empSlowUntil > now && !state.hasBuff('shield', now)) {
        const empFrac = Math.min(1.0, (state.empSlowUntil - now) / 650);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const sR = 76 * u;
        const empG = ctx.createRadialGradient(catcherPixelX, catcherPixelY, sR * 0.5, catcherPixelX, catcherPixelY, sR * 1.3);
        empG.addColorStop(0.0, 'rgba(56, 189, 248, 0)');
        empG.addColorStop(0.55, `rgba(56, 189, 248, ${0.35 * empFrac})`);
        empG.addColorStop(0.82, `rgba(244, 63, 94, ${0.30 * empFrac})`);
        empG.addColorStop(1.0, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = empG;
        ctx.beginPath();
        ctx.arc(catcherPixelX, catcherPixelY, sR * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

    // FEATURE 4: Unleash Supreme Destructive Flux Pulse (Planet / Universe Destroyer)
    function triggerFluxPulse(force = false) {
      if (!state.active || (!state.isPulseReady && !force && !window.location.search.includes('pulse=1'))) return;
      state.isPulseReady = false;
      state.pulseMeter = 0;
      const mode = state.catcherType || 'dynamo';
      audio.playFluxPulseUnleashed(mode);

      const pColor = mode === 'helix' ? '#22d3ee' : (mode === 'meteor' ? '#f97316' : '#00f0ff');
      const canvasW = dom.canvasReflex ? (dom.canvasReflex.width / (window.devicePixelRatio || 1)) : 800;
      const canvasH = dom.canvasReflex ? (dom.canvasReflex.height / (window.devicePixelRatio || 1)) : 600;
      const coreX = (state.catcherX !== undefined ? state.catcherX : 0.5) * canvasW;
      const coreY = (state.catcherY !== undefined ? state.catcherY : 0.82) * canvasH;
      
      state.activeFluxPulse = {
        x: coreX,
        y: coreY,
        radius: 12,
        speed: 1350,
        alpha: 1.0,
        flashAlpha: 0.85,
        color: pColor,
        mode: mode,
        screenShake: (mode === 'meteor' ? 22 : (mode === 'helix' ? 14 : 18)),
        shatteredSet: new Set()
      };

      // Floating Cataclysm Banner Text
      const pulseTitles = {
        dynamo: '⚡ TACHYON SINGULARITY WAVE UNLEASHED!',
        helix: '🧬 CYTOGENETIC SHATTER WAVE UNLEASHED!',
        meteor: '🔥 SOLAR HYPERNOVA CATACLYSM UNLEASHED!'
      };
      state.floatingTexts.push({
        x: coreX,
        y: coreY - 60,
        text: pulseTitles[mode] || pulseTitles.dynamo,
        color: pColor,
        alpha: 1.0,
        vy: -1.2,
        life: 0,
        maxLife: 60
      });

      updateHeaderUI();
    }

    if (dom.pulsePill) dom.pulsePill.onclick = () => triggerFluxPulse(false);
    window.triggerFluxPulse = (force = false) => triggerFluxPulse(force);
    if (window.ReflexArcade) window.ReflexArcade.triggerPulse = (force = false) => triggerFluxPulse(force);

    // Cycle Tier (I -> II -> III -> IV -> V) on clicking the TIER pill or pressing 'T'
    function cycleCoreTier() {
      if (!state.active) return;
      const nextTierCombo = { 1: 7, 2: 14, 3: 21, 4: 28, 5: 0 };
      state.combo = (nextTierCombo[state.coreTier] !== undefined) ? nextTierCombo[state.coreTier] : 0;
      state.coreTier = state.combo >= 28 ? 5 : (state.combo >= 21 ? 4 : (state.combo >= 14 ? 3 : (state.combo >= 7 ? 2 : 1)));
      state.isOverdrive = (state.coreTier >= 4);
      CoreKinematics.continuousTier = state.coreTier;
      if (state.coreTier === 5) audio.playTier5Ascension();
      else if (state.coreTier === 4) audio.playOverdriveFanfare();
      else audio.playPhaseSwitch();
      updateHeaderUI();
    }
    const tierPillEl = document.getElementById('cgTierPill');
    if (tierPillEl) {
      tierPillEl.style.cursor = 'pointer';
      tierPillEl.onclick = cycleCoreTier;
    }

    // Keyboard bindings for Flux Pulse (Space) and Tier Cycle (T)
    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 't' || e.key === 'T') {
        cycleCoreTier();
      }
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
          const picker = document.getElementById('reflexMultiplePicker');
          if (picker) picker.style.display = 'flex';

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
        const picker = document.getElementById('reflexMultiplePicker');
        if (picker) picker.style.display = 'none';
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
      if (!dom.canvasReflex) return { x: clientX, y: clientY, normX: clientX / window.innerWidth, normY: clientY / window.innerHeight };
      const rect = dom.canvasReflex.getBoundingClientRect();
      const normX = (rect.width > 0) ? Math.max(0.01, Math.min(0.99, (clientX - rect.left) / rect.width)) : (clientX / window.innerWidth);
      const normY = (rect.height > 0) ? Math.max(0.01, Math.min(0.99, (clientY - rect.top) / rect.height)) : (clientY / window.innerHeight);
      return { x: clientX - rect.left, y: clientY - rect.top, normX, normY };
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
        touchGuidePos = { x: coords.x, y: coords.y, active: true };
        targetCatcherX = coords.normX;
        currentCatcherX = coords.normX;
        targetCatcherY = coords.normY;
        currentCatcherY = coords.normY;
      } else {
        touchGuidePos.active = false;
        targetCatcherX = coords.normX;
        targetCatcherY = coords.normY;
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

      const events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
      const lastEv = events[events.length - 1] || e;

      if (deviceInputMode === 'touch') {
        if (!isPointerDown) return;
        const coords = getCanvasCoords(lastEv.clientX, lastEv.clientY);
        touchGuidePos = { x: coords.x, y: coords.y, active: true };
        targetCatcherX = coords.normX;
        targetCatcherY = coords.normY;
        currentCatcherX = coords.normX;
        currentCatcherY = coords.normY;
        lastTouchClientX = lastEv.clientX;
        lastTouchClientY = lastEv.clientY;
      } else {
        // Mouse / Trackpad: 1:1 instantaneous omnidirectional tracking across X and Y
        const coords = getCanvasCoords(lastEv.clientX, lastEv.clientY);
        touchGuidePos.active = false;
        targetCatcherX = coords.normX;
        targetCatcherY = coords.normY;
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

    // Direct 1:1 Mobile / iPhone Touch Tracking (Zero Gesture Latency & Prevents Native Drag Swallows)
    const onTouchDirectHandler = (e) => {
      if (!state.active) return;
      setDeviceMode('touch');
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        const coords = getCanvasCoords(t.clientX, t.clientY);
        touchGuidePos = { x: coords.x, y: coords.y, active: true };
        targetCatcherX = coords.normX;
        targetCatcherY = coords.normY;
        currentCatcherX = coords.normX;
        currentCatcherY = coords.normY;
        isPointerDown = true;
      }
      if (e.cancelable) e.preventDefault();
    };

    if (dom.canvasReflex) {
      dom.canvasReflex.addEventListener('touchstart', onTouchDirectHandler, { passive: false });
      dom.canvasReflex.addEventListener('touchmove', onTouchDirectHandler, { passive: false });
      dom.canvasReflex.addEventListener('touchend', (e) => {
        isPointerDown = false;
        touchGuidePos.active = false;
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
      dom.canvasReflex.addEventListener('touchcancel', (e) => {
        isPointerDown = false;
        touchGuidePos.active = false;
      }, { passive: true });
    }

    // 2D Full Omnidirectional Flight Keyboard Controls (WASD & Arrow Keys)
    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      const step = 0.045;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetCatcherX = Math.max(0.04, targetCatcherX - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetCatcherX = Math.min(0.96, targetCatcherX + step);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        targetCatcherY = Math.max(0.06, targetCatcherY - step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        targetCatcherY = Math.min(0.94, targetCatcherY + step);
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
    checkUrlAutoLaunch();
  }

  // Global Unified API
  window.chromeSynapseGame = {
    open: openGame,
    close: closeGame,
    toggleFullscreen: toggleAppFullscreen,
    setLevel: (lvl) => { state.mathLevel = lvl; },
    getState: () => state,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },
    setPointerY: (ny) => { targetCatcherY = Math.max(0.06, Math.min(0.94, ny)); },
    setTier: (t) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 28;
      state.coreTier = t;
      CoreKinematics.continuousTier = t;
      state.isOverdrive = (t >= 4);
      if (t === 5) audio.playTier5Ascension();
      updateHeaderUI();
    }
  };
  window.openChromeGame = openGame;

  // ReflexArcade programmatic API & URL auto-launch
  window.ReflexArcade = {
    open: openGame,
    close: closeGame,
    setTier: function(t) {
      if (!state.active) return;
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 28;
      state.coreTier = t;
      CoreKinematics.continuousTier = t;
      state.isOverdrive = (t >= 4);
      if (t === 5) audio.playTier5Ascension();
      updateHeaderUI();
    },
    getState: function() { return state; }
  };

  function checkUrlAutoLaunch() {
    try {
      const p = new URLSearchParams(window.location.search);
      const arc = p.get('arcade');
      if (arc) {
        setTimeout(() => {
          openGame(arc);
          const t = parseInt(p.get('tier') || '0', 10);
          if (t >= 1 && t <= 5) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
              state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 28;
              state.coreTier = t;
              CoreKinematics.continuousTier = t;
              state.isOverdrive = (t >= 4);
              if (t === 5) audio.playTier5Ascension();
              updateHeaderUI();
            }, 300);
          }
        }, 500);
      }
    } catch (e) {}
  }

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

  // Expose Core Engines for Native 4K UHD Ultra-Fidelity Rendering & Verification
  window.QuantumRenderer = QuantumRenderer;
  window.LayeredT4Assets = LayeredT4Assets;
  window.CoreKinematics = CoreKinematics;
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
