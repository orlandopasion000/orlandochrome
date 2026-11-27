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

    // === CHANGED (v404): Grand 1.4s Tier V -> Tier VI Hatching Soundscape (Mode-Tailored, Rich Low-End & Warm Harmony) ===
    playTier6Hatch(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      try {
        const ac = this.ctx;
        const t0 = ac.currentTime;
        // Stage 1 (0 - 350ms): Inward sub-bass tension charge swell
        const chargeOsc = ac.createOscillator();
        const chargeGain = ac.createGain();
        chargeOsc.type = 'triangle';
        chargeOsc.frequency.setValueAtTime(68, t0);
        chargeOsc.frequency.exponentialRampToValueAtTime(148, t0 + 0.34);
        chargeGain.gain.setValueAtTime(0.01, t0);
        chargeGain.gain.linearRampToValueAtTime(0.24, t0 + 0.28);
        chargeGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.37);
        chargeOsc.connect(chargeGain);
        chargeGain.connect(ac.destination);
        chargeOsc.start(t0);
        chargeOsc.stop(t0 + 0.38);

        // Stage 2 (350ms): Shell crack/shatter burst (filtered noise + warm impact punch)
        const crackAt = t0 + 0.35;
        const dur = 0.26;
        const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
        }
        const noise = ac.createBufferSource();
        noise.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(mode === 'meteor' ? 420 : (mode === 'helix' ? 1150 : 880), crackAt);
        filter.Q.value = mode === 'meteor' ? 1.4 : 2.2;
        const nGain = ac.createGain();
        nGain.gain.setValueAtTime(0.26, crackAt);
        nGain.gain.exponentialRampToValueAtTime(0.001, crackAt + dur);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(ac.destination);
        noise.start(crackAt);

        const impactOsc = ac.createOscillator();
        const impactGain = ac.createGain();
        impactOsc.type = 'sine';
        impactOsc.frequency.setValueAtTime(mode === 'meteor' ? 140 : 190, crackAt);
        impactOsc.frequency.exponentialRampToValueAtTime(48, crackAt + 0.32);
        impactGain.gain.setValueAtTime(0.32, crackAt);
        impactGain.gain.exponentialRampToValueAtTime(0.001, crackAt + 0.34);
        impactOsc.connect(impactGain);
        impactGain.connect(ac.destination);
        impactOsc.start(crackAt);
        impactOsc.stop(crackAt + 0.35);

        // Stage 3 & 4 (620ms - 1250ms): Heroic ascending Tier VI reveal fanfare
        const root = (mode === 'meteor') ? 196.00 : (mode === 'helix' ? 246.94 : 220.00);
        const ratios = [1.0, 1.25, 1.5, 2.0, 2.25];
        ratios.forEach((r, idx) => {
          const nt = t0 + 0.62 + idx * 0.085;
          const o = ac.createOscillator();
          const g = ac.createGain();
          o.type = (idx < 2) ? 'triangle' : 'sine';
          o.frequency.setValueAtTime(root * r, nt);
          g.gain.setValueAtTime(0.001, nt);
          g.gain.linearRampToValueAtTime(0.14, nt + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0008, nt + 0.52);
          o.connect(g);
          g.connect(ac.destination);
          o.start(nt);
          o.stop(nt + 0.54);
        });
      } catch (e) {}
      this._vibrate([25, 35, 70, 25, 45, 25, 80]);
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

    _ensureSfxNoise() {
      if (!this.ctx) return null;
      if (this._sfxNoise && this._sfxNoiseCtx === this.ctx) return this._sfxNoise;
      const sr = this.ctx.sampleRate;
      const len = Math.floor(sr * 1.5);
      const buf = this.ctx.createBuffer(1, len, sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this._sfxNoise = buf;
      this._sfxNoiseCtx = this.ctx;
      return buf;
    }

    // === CHANGED (v392): Distinct Primary Gun Audio per Chrome Core ===
    playCoreCannonShot(mode = 'dynamo', tier = 1) {
      if (this.isMuted) return;
      this.init();
      try {
        const ctx = this.ctx;
        const t0 = ctx.currentTime;
        const pitchBoost = 1 + (Math.min(5, tier) - 1) * 0.045;
        const nBuf = this._ensureSfxNoise();

        if (mode === 'helix') {
          // HELIX CASTER: Warm harmonic-fifth bio-prism pulse + soft sub body (zero shrillness)
          [392 * pitchBoost, 587.33 * pitchBoost].forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t0);
            osc.frequency.exponentialRampToValueAtTime(f * 0.56, t0 + 0.075);
            gain.gain.setValueAtTime(idx === 0 ? 0.062 : 0.042, t0);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.082);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.088);
          });
          const sub = ctx.createOscillator();
          const sg = ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(150, t0);
          sub.frequency.exponentialRampToValueAtTime(64, t0 + 0.075);
          sg.gain.setValueAtTime(0.068, t0);
          sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.082);
          sub.connect(sg);
          sg.connect(ctx.destination);
          sub.start(t0);
          sub.stop(t0 + 0.088);
        } else if (mode === 'meteor') {
          // EMBER CANNON: Heavy volcanic slug thump + warm lowpass fire puff
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(215 * pitchBoost, t0);
          osc.frequency.exponentialRampToValueAtTime(54, t0 + 0.09);
          gain.gain.setValueAtTime(0.13, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.096);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.102);

          if (nBuf) {
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.setValueAtTime(950, t0);
            const ng = ctx.createGain();
            ng.gain.setValueAtTime(0.06, t0);
            ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);
            src.connect(lp);
            lp.connect(ng);
            ng.connect(ctx.destination);
            src.start(t0, Math.random() * 0.8);
            src.stop(t0 + 0.05);
          }
        } else {
          // TESLA RAILGUN (Dynamo): Crisp electromagnetic rail-snap + lowpass sawtooth punch
          const osc = ctx.createOscillator();
          const lp = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(2400, t0);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(520 * pitchBoost, t0);
          osc.frequency.exponentialRampToValueAtTime(130, t0 + 0.072);
          gain.gain.setValueAtTime(0.095, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.076);
          osc.connect(lp);
          lp.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.082);

          if (nBuf) {
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.setValueAtTime(1800, t0);
            const ng = ctx.createGain();
            ng.gain.setValueAtTime(0.08, t0);
            ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.014);
            src.connect(hp);
            hp.connect(ng);
            ng.connect(ctx.destination);
            src.start(t0, Math.random() * 0.8);
            src.stop(t0 + 0.018);
          }
        }
      } catch (e) {}
    }

    playBossHit(isCrit = false) {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isCrit ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(isCrit ? 1280 : 620, t0);
        osc.frequency.exponentialRampToValueAtTime(isCrit ? 520 : 210, t0 + 0.055);
        gain.gain.setValueAtTime(isCrit ? 0.11 : 0.065, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.065);
      } catch (e) {}
    }

    playBossWarningSiren() {
      if (this.isMuted) return;
      this.init();
      try {
        for (let k = 0; k < 3; k++) {
          setTimeout(() => {
            if (!this.ctx || this.isMuted) return;
            const t0 = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(520, t0);
            osc.frequency.exponentialRampToValueAtTime(290, t0 + 0.34);
            gain.gain.setValueAtTime(0.16, t0);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.40);
          }, k * 460);
        }
      } catch (e) {}
      this._vibrate([45, 70, 45, 70, 65]);
    }

    playArmorBreak() {
      if (this.isMuted) return;
      this.init();
      const notes = [880, 1174.66, 1567.98];
      notes.forEach((f, idx) => setTimeout(() => this.playTone(f, 'triangle', 0.24, 0.20), idx * 35));
      this._vibrate([30, 20, 45]);
    }

    playBossDefeated() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const sub = this.ctx.createOscillator();
        const sg = this.ctx.createGain();
        sub.type = 'sawtooth';
        sub.frequency.setValueAtTime(160, t0);
        sub.frequency.exponentialRampToValueAtTime(28, t0 + 0.95);
        sg.gain.setValueAtTime(0.45, t0);
        sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.98);
        sub.connect(sg);
        sg.connect(this.ctx.destination);
        sub.start(t0);
        sub.stop(t0 + 1.0);
        const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        fanfare.forEach((f, idx) => setTimeout(() => this.playTone(f, 'sine', 0.32, 0.22), 180 + idx * 65));
      } catch (e) {}
      this._vibrate([60, 40, 80, 40, 120]);
    }

    // === CHANGED (v392): Distinct 2nd-Skill Missile Lock-On & Launch SFX ===
    playSeekerLockOn(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      if (mode === 'helix') {
        this.playTone(587.33, 'sine', 0.07, 0.12);
        setTimeout(() => this.playTone(880.0, 'sine', 0.08, 0.11), 50);
      } else if (mode === 'meteor') {
        this.playTone(440, 'triangle', 0.065, 0.14);
        setTimeout(() => this.playTone(660, 'triangle', 0.08, 0.14), 55);
      } else {
        this.playTone(880, 'triangle', 0.045, 0.13);
        setTimeout(() => this.playTone(1320, 'triangle', 0.055, 0.12), 45);
      }
      this._vibrate(10);
    }

    playSeekerLaunch(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      try {
        const ctx = this.ctx;
        const nBuf = this._ensureSfxNoise();
        const tBase = ctx.currentTime;
        if (mode === 'helix') {
          // PRISM SWARM: 6-note warm mid-register harmonic crystal cascade + soft launch whoosh
          const notes = [293.66, 369.99, 440.0, 554.37, 659.25, 739.99];
          notes.forEach((f, idx) => {
            const ts = tBase + idx * 0.022;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, ts);
            g.gain.setValueAtTime(0.0001, ts);
            g.gain.exponentialRampToValueAtTime(0.085, ts + 0.006);
            g.gain.exponentialRampToValueAtTime(0.0001, ts + 0.14);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(ts);
            osc.stop(ts + 0.15);
          });
          const sw = ctx.createOscillator();
          const swG = ctx.createGain();
          sw.type = 'sine';
          sw.frequency.setValueAtTime(110, tBase);
          sw.frequency.exponentialRampToValueAtTime(48, tBase + 0.18);
          swG.gain.setValueAtTime(0.14, tBase);
          swG.gain.exponentialRampToValueAtTime(0.0001, tBase + 0.20);
          sw.connect(swG);
          swG.connect(ctx.destination);
          sw.start(tBase);
          sw.stop(tBase + 0.22);
        } else if (mode === 'meteor') {
          // SEEKER COMETS: Deep volcanic mortar ignition + roaring comet fire whoosh
          const sub = ctx.createOscillator();
          const sg = ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(155, tBase);
          sub.frequency.exponentialRampToValueAtTime(44, tBase + 0.22);
          sg.gain.setValueAtTime(0.24, tBase);
          sg.gain.exponentialRampToValueAtTime(0.0001, tBase + 0.25);
          sub.connect(sg);
          sg.connect(ctx.destination);
          sub.start(tBase);
          sub.stop(tBase + 0.27);
          if (nBuf) {
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.setValueAtTime(920, tBase);
            lp.frequency.exponentialRampToValueAtTime(280, tBase + 0.34);
            const ng = ctx.createGain();
            ng.gain.setValueAtTime(0.22, tBase);
            ng.gain.exponentialRampToValueAtTime(0.0001, tBase + 0.36);
            src.connect(lp);
            lp.connect(ng);
            ng.connect(ctx.destination);
            src.start(tBase, Math.random() * 0.4);
            src.stop(tBase + 0.38);
          }
          [0, 1, 2, 3].forEach((idx) => {
            const ts = tBase + idx * 0.032;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(260 - idx * 14, ts);
            o.frequency.exponentialRampToValueAtTime(110, ts + 0.11);
            g.gain.setValueAtTime(0.11, ts);
            g.gain.exponentialRampToValueAtTime(0.0001, ts + 0.12);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(ts);
            o.stop(ts + 0.13);
          });
        } else {
          // ARC SEEKERS (Dynamo): 4 rapid high-voltage capacitor cracks + punchy railgun thumps
          [0, 1, 2, 3].forEach((idx) => {
            const ts = tBase + idx * 0.024;
            const o = ctx.createOscillator();
            const lp = ctx.createBiquadFilter();
            const g = ctx.createGain();
            lp.type = 'lowpass';
            lp.frequency.value = 2100;
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(340 + idx * 35, ts);
            o.frequency.exponentialRampToValueAtTime(95, ts + 0.09);
            g.gain.setValueAtTime(0.10, ts);
            g.gain.exponentialRampToValueAtTime(0.0001, ts + 0.095);
            o.connect(lp);
            lp.connect(g);
            g.connect(ctx.destination);
            o.start(ts);
            o.stop(ts + 0.10);
            if (nBuf) {
              const src = ctx.createBufferSource();
              src.buffer = nBuf;
              const bp = ctx.createBiquadFilter();
              bp.type = 'bandpass';
              bp.frequency.value = 1600;
              bp.Q.value = 0.8;
              const ng = ctx.createGain();
              ng.gain.setValueAtTime(0.13, ts);
              ng.gain.exponentialRampToValueAtTime(0.0001, ts + 0.022);
              src.connect(bp);
              bp.connect(ng);
              ng.connect(ctx.destination);
              src.start(ts, Math.random() * 0.6);
              src.stop(ts + 0.026);
            }
          });
        }
      } catch (e) {}
      this._vibrate([12, 16, 12]);
    }

    // ══════════════════════════════════════════════════════════════════════
    // === CHANGED (v391): CINEMATIC PER-REALM ULTIMATE SOUND DESIGN ENGINE ===
    // Dedicated FX bus (procedural convolution reverb + glue compressor) and
    // three bespoke fully-synthesized ultimate scores (zero audio files):
    //  • METEOR  → "SOLAR ERUPTION"   : riser → sub impact → roaring fire + crackles + brass power chord + bells
    //  • DYNAMO  → "THUNDERSTORM"     : charge whine → thunderclap → arc-zaps + tesla hum + laser sweeps
    //  • HELIX   → "QUANTUM GENESIS"  : whoosh → impact → ethereal stereo choir + spiralling crystal FM arpeggio
    // ══════════════════════════════════════════════════════════════════════
    _ensureUltBus() {
      if (!this.ctx) return null;
      if (this._ultBus && this._ultBus.ctx === this.ctx) return this._ultBus;
      const ctx = this.ctx;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 12;
      comp.ratio.value = 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.28;
      const out = ctx.createGain();
      out.gain.value = 0.92;
      comp.connect(out);
      out.connect(ctx.destination);

      const dry = ctx.createGain();
      dry.gain.value = 1.0;
      dry.connect(comp);

      // Procedural stereo hall impulse response (2.4 s exponential tail)
      const sr = ctx.sampleRate;
      const irLen = Math.floor(sr * 2.4);
      const ir = ctx.createBuffer(2, irLen, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < irLen; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.8);
        }
      }
      const conv = ctx.createConvolver();
      conv.buffer = ir;
      const wet = ctx.createGain();
      wet.gain.value = 0.38;
      conv.connect(wet);
      wet.connect(comp);

      const input = ctx.createGain();
      input.gain.value = 1.0;
      input.connect(dry);
      input.connect(conv);

      // Shared 2 s white-noise buffer
      const nLen = Math.floor(sr * 2.0);
      const noise = ctx.createBuffer(1, nLen, sr);
      const nd = noise.getChannelData(0);
      for (let i = 0; i < nLen; i++) nd[i] = Math.random() * 2 - 1;

      this._ultBus = { ctx, input, noise };
      return this._ultBus;
    }

    _ultPan(dest, pan) {
      if (!this.ctx.createStereoPanner) return dest;
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      p.connect(dest);
      return p;
    }

    _ultOsc(type, f0, f1, t0, dur, peak, attack, dest, detune = 0) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.detune.value = detune;
      o.frequency.setValueAtTime(Math.max(1, f0), t0);
      if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + Math.max(0.004, attack));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(dest);
      o.start(t0);
      o.stop(t0 + dur + 0.05);
      return o;
    }

    _ultNoise(t0, dur, peak, fType, fStart, fEnd, q, attack, dest) {
      const ctx = this.ctx;
      const bus = this._ultBus;
      const src = ctx.createBufferSource();
      src.buffer = bus.noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = fType;
      f.Q.value = q;
      f.frequency.setValueAtTime(Math.max(20, fStart), t0);
      if (fEnd && fEnd !== fStart) f.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), t0 + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + Math.max(0.004, attack));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f);
      f.connect(g);
      g.connect(dest);
      src.start(t0, Math.random() * 1.5);
      src.stop(t0 + dur + 0.05);
      return g;
    }

    _ultShaperCurve(drive) {
      if (!this._ultCurves) this._ultCurves = {};
      if (this._ultCurves[drive]) return this._ultCurves[drive];
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(x * drive);
      }
      this._ultCurves[drive] = curve;
      return curve;
    }

    _ultClippedNoise(t0, dur, peak, drive, fType, fStart, fEnd, q, attack, dest) {
      const ctx = this.ctx;
      const bus = this._ultBus;
      const src = ctx.createBufferSource();
      src.buffer = bus.noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = fType;
      f.Q.value = q;
      f.frequency.setValueAtTime(Math.max(20, fStart), t0);
      if (fEnd && fEnd !== fStart) f.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), t0 + dur);
      const sh = ctx.createWaveShaper();
      sh.curve = this._ultShaperCurve(drive || 4.0);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + Math.max(0.002, attack));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f);
      f.connect(sh);
      sh.connect(g);
      g.connect(dest);
      src.start(t0, Math.random() * 1.4);
      src.stop(t0 + dur + 0.05);
      return g;
    }

    _ultKick(t0, f0, f1, dur, peak, dest) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const sh = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(x * 2.6);
      }
      sh.curve = curve;
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.exponentialRampToValueAtTime(f1, t0 + dur * 0.55);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(sh);
      sh.connect(g);
      g.connect(dest);
      o.start(t0);
      o.stop(t0 + dur + 0.05);
    }

    _ultFmBell(t0, freq, dur, peak, dest) {
      const ctx = this.ctx;
      const car = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const modG = ctx.createGain();
      const g = ctx.createGain();
      car.type = 'sine';
      mod.type = 'sine';
      car.frequency.value = freq;
      mod.frequency.value = freq * 3.5;
      modG.gain.setValueAtTime(freq * 2.2, t0);
      modG.gain.exponentialRampToValueAtTime(Math.max(1, freq * 0.05), t0 + dur);
      mod.connect(modG);
      modG.connect(car.frequency);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      car.connect(g);
      g.connect(dest);
      car.start(t0);
      mod.start(t0);
      car.stop(t0 + dur + 0.05);
      mod.stop(t0 + dur + 0.05);
    }

    playCalderaNova(mode = 'meteor') {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const bus = this._ensureUltBus();
        if (!bus) return;
        const ctx = this.ctx;
        const T = ctx.currentTime + 0.01;
        const dest = bus.input;

        if (mode === 'dynamo') {
          // ⚡ STORM NOVA (REALISTIC THUNDERCLAP + HIGH-VOLTAGE POWER-ARC — ZERO BIRD CHIRPS!)
          // Pre-strike magnetic transformer swell (deep 55 -> 115 Hz, lowpass 420 Hz)
          const magF = ctx.createBiquadFilter();
          magF.type = 'lowpass';
          magF.frequency.value = 420;
          magF.connect(dest);
          this._ultOsc('sawtooth', 55, 115, T, 0.11, 0.22, 0.02, magF);

          const hit = T + 0.08;
          // 1. 4-Stroke Real Lightning Return Cracks (hard-clipped broadband noise transients across stereo)
          [
            { off: 0.0,   pan: 0.0,   dur: 0.088, pk: 0.85 },
            { off: 0.026, pan: -0.45, dur: 0.068, pk: 0.72 },
            { off: 0.064, pan: 0.50,  dur: 0.075, pk: 0.78 },
            { off: 0.125, pan: -0.25, dur: 0.048, pk: 0.56 }
          ].forEach((st) => {
            const pDest = this._ultPan(dest, st.pan);
            this._ultClippedNoise(hit + st.off, st.dur, st.pk, 8.5, 'bandpass', 1050, 1050, 0.55, 0.002, pDest);
            this._ultClippedNoise(hit + st.off, 0.028, st.pk * 0.52, 6.0, 'highpass', 1500, 1500, 0.5, 0.001, pDest);
          });

          // 2. Colossal Sub-Bass Thunder Detonation
          this._ultKick(hit, 96, 23, 1.35, 1.0, dest);
          this._ultKick(hit + 0.064, 78, 25, 0.95, 0.72, dest);
          const subT = ctx.createBiquadFilter();
          subT.type = 'lowpass';
          subT.frequency.value = 170;
          subT.connect(dest);
          this._ultOsc('sawtooth', 48, 24, hit, 1.45, 0.36, 0.008, subT);

          // 3. Rolling Stereo Thunderhead Sky-Rumble (1.90s clipped brown rumble modulated by 5.8 Hz AM roll)
          const rollL = this._ultClippedNoise(hit + 0.02, 1.88, 0.68, 3.2, 'lowpass', 820, 95, 0.75, 0.015, this._ultPan(dest, -0.65));
          const rollR = this._ultClippedNoise(hit + 0.05, 1.88, 0.66, 3.2, 'lowpass', 780, 90, 0.75, 0.02, this._ultPan(dest, 0.65));
          const rollModL = ctx.createGain();
          const rollModR = ctx.createGain();
          rollModL.gain.value = 0.85;
          rollModR.gain.value = 0.85;
          rollL.disconnect();
          rollR.disconnect();
          rollL.connect(rollModL);
          rollR.connect(rollModR);
          rollModL.connect(this._ultPan(dest, -0.65));
          rollModR.connect(this._ultPan(dest, 0.65));
          const rollLfo = ctx.createOscillator();
          const rollLfoG = ctx.createGain();
          rollLfo.frequency.value = 5.8;
          rollLfoG.gain.value = 0.14;
          rollLfo.connect(rollLfoG);
          rollLfoG.connect(rollModL.gain);
          rollLfoG.connect(rollModR.gain);
          rollLfo.start(hit);
          rollLfo.stop(hit + 1.92);

          // 4. Raw 60/120/180 Hz High-Voltage Transformer / Jacob's-Ladder Arc Tear (overdriven sawtooths)
          const arcSh = ctx.createWaveShaper();
          arcSh.curve = this._ultShaperCurve(4.5);
          const arcF = ctx.createBiquadFilter();
          arcF.type = 'lowpass';
          arcF.frequency.value = 580;
          arcSh.connect(arcF);
          arcF.connect(dest);
          this._ultOsc('sawtooth', 60, 60, hit, 1.55, 0.16, 0.03, arcSh);
          this._ultOsc('sawtooth', 120, 120, hit, 1.55, 0.11, 0.03, arcSh, 5);
          this._ultOsc('sawtooth', 180, 180, hit, 1.55, 0.07, 0.03, arcSh, -6);

          // 16 Unpitched Broadband Static Arc Snaps (strictly short bandpass noise — ZERO oscillators!)
          for (let k = 0; k < 16; k++) {
            const tz = hit + 0.06 + Math.random() * 1.45;
            const cf = 1400 + Math.random() * 800;
            this._ultClippedNoise(tz, 0.008 + Math.random() * 0.008, 0.28, 7.0, 'bandpass', cf, cf, 0.75, 0.001, this._ultPan(dest, Math.random() * 1.5 - 0.75));
          }

          // 5. Heavy Low-Register Storm Brass Undertow (D2 / A2 / D3 power fifth)
          const stormF = ctx.createBiquadFilter();
          stormF.type = 'lowpass';
          stormF.Q.value = 0.9;
          stormF.frequency.setValueAtTime(950, hit);
          stormF.frequency.exponentialRampToValueAtTime(320, hit + 1.2);
          stormF.connect(dest);
          [73.42, 110.0, 146.83].forEach((f, i) => {
            this._ultOsc('sawtooth', f, f, hit + 0.02, 1.25, 0.075, 0.03, stormF, i * 6 - 6);
          });
          this._vibrate([50, 20, 75, 20, 35, 20, 100]);

        } else if (mode === 'helix') {
          // 🧬 GENESIS NOVA (HEAVY GRAVITATIONAL SUB-DROP + 12-VOICE WARM SYNTH-BRASS — ZERO WHISTLE!)
          // Warm low vacuum inward swell
          this._ultNoise(T, 0.18, 0.28, 'lowpass', 180, 780, 0.7, 0.12, dest);

          const hit = T + 0.11;
          // 1. Heavy Quantum Gravitational Sub-Drop + Chest Impact Punch
          this._ultKick(hit, 118, 26, 1.30, 0.98, dest);
          this._ultClippedNoise(hit, 0.16, 0.46, 3.5, 'lowpass', 680, 140, 0.7, 0.003, dest);
          const d1 = ctx.createBiquadFilter();
          d1.type = 'lowpass';
          d1.frequency.value = 140;
          d1.connect(dest);
          this._ultOsc('sine', 36.71, 36.71, hit, 1.65, 0.34, 0.012, d1);

          // 2. Commanding 12-Voice Warm Cinema Synth-Brass Wall (D2..F#4 through non-whistling Q=0.80 LPF)
          const brassLP = ctx.createBiquadFilter();
          brassLP.type = 'lowpass';
          brassLP.Q.value = 0.80;
          brassLP.frequency.setValueAtTime(220, hit);
          brassLP.frequency.exponentialRampToValueAtTime(1280, hit + 0.38);
          brassLP.frequency.exponentialRampToValueAtTime(460, hit + 1.75);
          brassLP.connect(dest);
          [73.42, 110.0, 146.83, 220.0, 293.66, 369.99].forEach((f, i) => {
            const pDest = this._ultPan(brassLP, i % 2 === 0 ? -0.6 : 0.6);
            this._ultOsc('sawtooth', f, f, hit, 1.80, 0.068, 0.045, pDest, -10);
            this._ultOsc('triangle', f, f, hit, 1.80, 0.068, 0.045, pDest, 10);
          });

          // 3. Biotic Double-Helix Sub-Thrum (10.5 Hz AM pulse through warm lowpass 520 Hz)
          const thrumF = ctx.createBiquadFilter();
          thrumF.type = 'lowpass';
          thrumF.frequency.value = 520;
          thrumF.connect(dest);
          const thrumG = ctx.createGain();
          thrumG.gain.value = 0.85;
          thrumG.connect(thrumF);
          this._ultOsc('triangle', 73.42, 73.42, hit, 1.65, 0.14, 0.03, thrumG);
          this._ultOsc('triangle', 146.83, 146.83, hit, 1.65, 0.11, 0.03, thrumG, 4);
          const bioLfo = ctx.createOscillator();
          const bioLfoG = ctx.createGain();
          bioLfo.frequency.value = 10.5;
          bioLfoG.gain.value = 0.32;
          bioLfo.connect(bioLfoG);
          bioLfoG.connect(thrumG.gain);
          bioLfo.start(hit);
          bioLfo.stop(hit + 1.68);

          // 4. Warm Mid-Register Harmonic Plucks (strictly <= 740 Hz — crystalline warmth, zero whistle!)
          const plkF = ctx.createBiquadFilter();
          plkF.type = 'lowpass';
          plkF.frequency.value = 1400;
          plkF.connect(dest);
          [220.0, 293.66, 369.99, 440.0, 587.33, 739.99].forEach((f, i) => {
            const tp = hit + 0.03 + i * 0.055;
            const pp = this._ultPan(plkF, Math.sin(i * 1.1) * 0.72);
            this._ultOsc('triangle', f, f, tp, 0.42, 0.075, 0.008, pp);
            this._ultOsc('sine', f * 0.5, f * 0.5, tp, 0.45, 0.055, 0.008, pp);
          });
          this._vibrate([45, 25, 65, 25, 95]);

        } else {
          // 🌋 CALDERA NOVA (Meteor) — Seismic tectonic sub-crack + roaring volcano fire + crackles + C2/C3 brass + bells
          this._ultNoise(T, 0.22, 0.28, 'bandpass', 240, 2200, 1.1, 0.16, dest);
          const hit = T + 0.16;
          this._ultKick(hit, 140, 26, 1.10, 1.0, dest);
          this._ultKick(hit + 0.04, 64, 22, 1.35, 0.85, dest);
          const subF = ctx.createBiquadFilter();
          subF.type = 'lowpass';
          subF.frequency.value = 240;
          subF.connect(dest);
          this._ultOsc('sawtooth', 72, 28, hit, 1.15, 0.34, 0.01, subF);
          this._ultClippedNoise(hit + 0.01, 1.45, 0.38, 2.8, 'lowpass', 240, 95, 0.7, 0.02, dest); // seismic magma rumble bed
          this._ultNoise(hit, 0.7, 0.48, 'highpass', 900, 600, 0.7, 0.003, dest);
          // Roaring fire body with crackling tremolo
          const fireMod = ctx.createGain();
          fireMod.gain.value = 0.88;
          fireMod.connect(dest);
          this._ultNoise(hit + 0.02, 1.65, 0.46, 'lowpass', 1100, 420, 0.9, 0.08, fireMod);
          const trem = ctx.createOscillator();
          const tremG = ctx.createGain();
          trem.frequency.value = 11;
          tremG.gain.value = 0.11;
          trem.connect(tremG);
          tremG.connect(fireMod.gain);
          trem.start(hit);
          trem.stop(hit + 1.7);
          // 16 random fire crackle pops across stereo field
          for (let k = 0; k < 16; k++) {
            const tc = hit + 0.05 + Math.random() * 1.4;
            const cf = 1800 + Math.random() * 3500;
            this._ultNoise(tc, 0.03, 0.30, 'bandpass', cf, cf, 3.2, 0.001, this._ultPan(dest, Math.random() * 1.6 - 0.8));
          }
          // Triumphant brass power chord with deep C2 contrabass foundation
          const brassF = ctx.createBiquadFilter();
          brassF.type = 'lowpass';
          brassF.Q.value = 1.6;
          brassF.frequency.setValueAtTime(340, hit);
          brassF.frequency.exponentialRampToValueAtTime(3100, hit + 0.40);
          brassF.frequency.exponentialRampToValueAtTime(820, hit + 1.45);
          brassF.connect(dest);
          this._ultOsc('sawtooth', 65.41, 65.41, hit + 0.01, 1.50, 0.085, 0.06, brassF, -6);
          this._ultOsc('sawtooth', 65.41, 65.41, hit + 0.01, 1.50, 0.085, 0.06, brassF, 6);
          [130.81, 196.0, 261.63, 329.63, 392.0].forEach((f, i) => {
            this._ultOsc('sawtooth', f, f, hit + 0.02, 1.45, 0.06, 0.07, brassF, -7);
            this._ultOsc('sawtooth', f, f, hit + 0.02, 1.45, 0.05, 0.07, brassF, 7 + i);
          });
          // Golden shimmer bells
          [1046.5, 1318.51, 1567.98, 2093.0].forEach((f, i) => {
            this._ultFmBell(hit + 0.24 + i * 0.075, f, 0.6, 0.065, this._ultPan(dest, i % 2 ? 0.5 : -0.5));
          });
          this._vibrate([65, 30, 95, 30, 145]);
        }
      } catch (e) {}
    }

    playSkillReady() {
      if (this.isMuted) return;
      this.init();
      this.playTone(880, 'sine', 0.11, 0.13);
      setTimeout(() => this.playTone(1318.51, 'triangle', 0.18, 0.14), 65);
    }

    playCooldownReject() {
      if (this.isMuted) return;
      this.init();
      this.playTone(165, 'triangle', 0.08, 0.12);
    }

    playVoidbloomWarning() {
      if (this.isMuted) return;
      this.init();
      try {
        for (let k = 0; k < 2; k++) {
          setTimeout(() => {
            if (!this.ctx || this.isMuted) return;
            const t0 = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(310, t0);
            osc.frequency.exponentialRampToValueAtTime(145, t0 + 0.28);
            g.gain.setValueAtTime(0.14, t0);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.30);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.32);
          }, k * 340);
        }
      } catch (e) {}
    }

    playVoidbloomDestroy(scale = 1) {
      if (this.isMuted) return;
      this.init();
      const huge = scale >= 3.2;
      const chord = huge ? [261.63, 392.0, 523.25, 783.99, 1046.5] : [329.63, 493.88, 659.25];
      chord.forEach((f, idx) => setTimeout(() => this.playTone(f, 'triangle', huge ? 0.36 : 0.22, huge ? 0.20 : 0.16), idx * 35));
      this._vibrate(huge ? [40, 25, 65] : [18, 15, 24]);
    }

    playVoidbloomDrain() {
      if (this.isMuted) return;
      this.init();
      try {
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, t0);
        osc.frequency.exponentialRampToValueAtTime(52, t0 + 0.45);
        g.gain.setValueAtTime(0.32, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.50);
      } catch (e) {}
      this._vibrate([55, 35, 75]);
    }
  }

  const audio = new CyberAudioEngine();

  // ══════════════════════════════════════════════════════════════════════════
  // === CHANGED (v387): FUTURISTIC PROCEDURAL REALM MUSIC ENGINE ===
  // Distinct Sci-Fi Themes: Dynamo (Faraday Pulse), Helix (Quantum Biome),
  // Meteor (Solar Caldera) — Zero external assets, iOS-safe Web Audio synth!
  // ══════════════════════════════════════════════════════════════════════════
  const RealmMusicEngine = {
    enabled: (() => {
      try { return localStorage.getItem('oc_bgm_enabled') !== '0'; } catch (_) { return true; }
    })(),
    currentRealm: null,
    isPlaying: false,
    stepIdx: 0,
    timerId: null,
    nextNoteTime: 0,
    masterGain: null,
    filterNode: null,
    noiseBuffer: null,

    // Note frequency table (Hz)
    N: {
      E1: 41.20, F1: 43.65, G1: 49.00, Gs1: 51.91, A1: 55.00, Bb1: 58.27, B1: 61.74,
      C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, Gs2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, B5: 987.77, C6: 1046.50
    },

    _ensureBus() {
      audio.init();
      if (!audio.ctx) return false;
      if (!this.masterGain) {
        this.filterNode = audio.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 3400;
        this.filterNode.Q.value = 0.8;

        this.masterGain = audio.ctx.createGain();
        this.masterGain.gain.value = (this.enabled && !audio.isMuted) ? 0.14 : 0.0001;
        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(audio.ctx.destination);

        // Pre-bake 80ms crisp hi-hat / snare noise buffer once (zero per-step alloc)
        const sr = audio.ctx.sampleRate || 44100;
        const len = Math.floor(sr * 0.08);
        this.noiseBuffer = audio.ctx.createBuffer(1, len, sr);
        const ch = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      return true;
    },

    _syncGain() {
      if (!this.masterGain || !audio.ctx) return;
      const target = (this.enabled && !audio.isMuted && this.isPlaying) ? 0.14 : 0.0001;
      try {
        this.masterGain.gain.cancelScheduledValues(audio.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(target, audio.ctx.currentTime, 0.06);
      } catch (_) {}
    },

    setEnabled(val) {
      this.enabled = !!val;
      try { localStorage.setItem('oc_bgm_enabled', this.enabled ? '1' : '0'); } catch (_) {}
      this._syncGain();
      if (this.enabled && !audio.isMuted && state.active && this.currentRealm && !this.isPlaying) {
        this.start(this.currentRealm);
      }
      this.syncBtnUI();
    },

    toggle() {
      this.setEnabled(!this.enabled);
    },

    syncBtnUI() {
      const btn = document.getElementById('cgMusicBtn');
      if (!btn) return;
      const active = this.enabled && !audio.isMuted;
      btn.classList.toggle('oc-btn-off', !active);
      btn.classList.toggle('oc-btn-active', active && this.isPlaying);
      const tMap = { dynamo: 'FARADAY PULSE', helix: 'QUANTUM BIOME', meteor: 'SOLAR CALDERA' };
      const tName = tMap[this.currentRealm] || 'REALM SYNTH';
      btn.title = active ? `Music ON (${tName}) — Click to Mute BGM` : 'Music OFF — Click to Enable Futuristic BGM';
    },

    start(realm) {
      const rKey = (realm === 'helix') ? 'helix' : (realm === 'meteor' ? 'meteor' : 'dynamo');
      this.currentRealm = rKey;
      if (!this.enabled || audio.isMuted) {
        this.syncBtnUI();
        return;
      }
      if (!this._ensureBus()) return;
      if (audio.ctx.state === 'suspended') {
        audio.ctx.resume().catch(() => {});
      }
      if (this.isPlaying) {
        this._syncGain();
        this.syncBtnUI();
        return;
      }
      this.isPlaying = true;
      this.stepIdx = 0;
      this.nextNoteTime = audio.ctx.currentTime + 0.05;
      this._syncGain();
      this.syncBtnUI();
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => this._scheduler(), 32);
    },

    stop() {
      this.isPlaying = false;
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this._syncGain();
      this.syncBtnUI();
    },

    unlockOnGesture() {
      if (!state.active) return;
      const isCore = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      if (!isCore) return;
      const rKey = (state.gameType === 'helix') ? 'helix' : (state.gameType === 'meteor' ? 'meteor' : 'dynamo');
      if (this.enabled && !audio.isMuted) {
        if (!this.isPlaying || this.currentRealm !== rKey) {
          this.start(rKey);
        } else if (audio.ctx && audio.ctx.state === 'suspended') {
          audio.ctx.resume().catch(() => {});
        }
      }
    },

    _playNote(freq, time, dur, type, vol, detune = 0) {
      if (!freq || !audio.ctx || !this.filterNode) return;
      try {
        const osc = audio.ctx.createOscillator();
        const g = audio.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        if (detune) osc.detune.setValueAtTime(detune, time);
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(vol, time + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
        osc.connect(g);
        g.connect(this.filterNode);
        osc.start(time);
        osc.stop(time + dur + 0.02);
      } catch (_) {}
    },

    _playKick(time, startHz, endHz, vol) {
      if (!audio.ctx || !this.masterGain) return;
      try {
        const osc = audio.ctx.createOscillator();
        const g = audio.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startHz, time);
        osc.frequency.exponentialRampToValueAtTime(endHz, time + 0.13);
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.18);
      } catch (_) {}
    },

    _playHat(time, vol, hpHz = 6800) {
      if (!audio.ctx || !this.noiseBuffer || !this.masterGain) return;
      try {
        const src = audio.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const hp = audio.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = hpHz;
        const g = audio.ctx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
        src.connect(hp);
        hp.connect(g);
        g.connect(this.masterGain);
        src.start(time);
        src.stop(time + 0.07);
      } catch (_) {}
    },

    _scheduler() {
      if (!this.isPlaying || !audio.ctx || !this.enabled || audio.isMuted || document.hidden) return;
      if (audio.ctx.state !== 'running') return;
      const isBoss = (state.roundPhase === 'boss' || state.roundPhase === 'warning');
      const bpmMap = { dynamo: 128, helix: 116, meteor: 134 };
      const bpm = (bpmMap[this.currentRealm] || 128) + (isBoss ? 8 : 0);
      const stepDur = 60 / bpm / 4; // 16th note
      const horizon = audio.ctx.currentTime + 0.12;

      if (this.nextNoteTime < audio.ctx.currentTime - 0.15) {
        this.nextNoteTime = audio.ctx.currentTime + 0.03;
      }

      while (this.nextNoteTime < horizon) {
        this._scheduleStep(this.stepIdx, this.nextNoteTime, stepDur, isBoss);
        this.nextNoteTime += stepDur;
        this.stepIdx = (this.stepIdx + 1) % 32;
      }
    },

    _scheduleStep(step, t, sd, isBoss) {
      const N = this.N;
      const r = this.currentRealm;
      const bar = Math.floor(step / 16);
      const s = step % 16;

      if (r === 'dynamo') {
        // CHROME DYNAMO: "FARADAY PULSE" — High-Voltage Cyber-Electro Synthwave (D Minor)
        const bassSeq = [
          N.D2, 0, N.D2, N.D2, N.F2, 0, N.D2, 0, N.A1, 0, N.C2, 0, N.D2, 0, N.G2, N.F2,
          N.Bb1, 0, N.Bb1, N.Bb1, N.C2, 0, N.C2, 0, N.A1, 0, N.A1, N.C2, N.D2, 0, N.F2, N.E2
        ];
        const arpSeq = [
          N.D4, N.A4, N.F4, N.A4, N.C5, N.A4, N.F4, N.E4, N.D4, N.F4, N.A4, N.D5, N.E5, N.D5, N.A4, N.F4,
          N.Bb4, N.F4, N.D4, N.F4, N.C5, N.G4, N.E4, N.G4, N.A4, N.E4, N.C5, N.A4, N.D5, N.A4, N.F4, N.E4
        ];
        if (bassSeq[step]) this._playNote(bassSeq[step], t, sd * 1.4, 'sawtooth', 0.34);
        if (arpSeq[step] && (s % 2 === 0 || isBoss)) {
          this._playNote(arpSeq[step], t, sd * 1.15, 'square', isBoss ? 0.14 : 0.11, 5);
        }
        if (s === 0 || s === 8) this._playKick(t, 138, 38, 0.42);
        if (s === 4 || s === 12) this._playHat(t, 0.20, 4200);
        if (s % 2 === 1) this._playHat(t, isBoss ? 0.10 : 0.06, 7800);
        if (step === 0 || step === 16) {
          this._playNote(bar === 0 ? N.D3 : N.Bb2, t, sd * 14, 'triangle', 0.13);
          this._playNote(bar === 0 ? N.A3 : N.F3, t, sd * 14, 'sine', 0.11);
        }
      } else if (r === 'helix') {
        // CHROME HELIX: "QUANTUM BIOME" — Ethereal Twin-Strand Sci-Fi Trance (A Minor / C Lydian)
        const strandA = [
          N.A4, 0, N.C5, 0, N.E5, 0, N.G5, 0, N.E5, 0, N.C5, 0, N.B4, 0, N.G4, 0,
          N.F4, 0, N.A4, 0, N.C5, 0, N.Fs5, 0, N.E5, 0, N.C5, 0, N.B4, 0, N.E5, 0
        ];
        const strandB = [
          0, N.E4, 0, N.G4, 0, N.B4, 0, N.D5, 0, N.C5, 0, N.A4, 0, N.G4, 0, N.E4,
          0, N.C4, 0, N.E4, 0, N.A4, 0, N.C5, 0, N.B4, 0, N.G4, 0, N.E4, 0, N.B4
        ];
        if (strandA[step]) this._playNote(strandA[step], t, sd * 2.4, 'sine', 0.18);
        if (strandB[step]) this._playNote(strandB[step], t, sd * 2.1, 'triangle', 0.13, -4);
        if (s === 0 || s === 6 || s === 12) {
          const bRoot = bar === 0 ? (s === 12 ? N.G2 : N.A2) : (s === 12 ? N.G2 : N.F2);
          this._playNote(bRoot, t, sd * 3.5, 'sine', 0.36);
        }
        if (s === 0 || (isBoss && s === 8)) this._playKick(t, 108, 42, 0.30);
        if (s === 4 || s === 12) this._playHat(t, 0.08, 8600);
        if (step === 0 || step === 16) {
          this._playNote(bar === 0 ? N.A3 : N.F3, t, sd * 15, 'sine', 0.15);
          this._playNote(bar === 0 ? N.E4 : N.C4, t, sd * 15, 'sine', 0.11, 6);
        }
      } else {
        // CHROME METEOR: "SOLAR CALDERA" — Epic Dark-Synth Industrial Space-Metal (E Phrygian Dominant)
        const magmaBass = [
          N.E1, N.E1, 0, N.E1, N.F1, 0, N.E1, N.G1, N.E1, 0, N.Gs1, 0, N.B1, 0, N.Gs1, N.F1,
          N.E1, N.E1, 0, N.E1, N.C2, 0, N.B1, 0, N.Gs1, 0, N.F1, N.E1, N.G1, 0, N.F1, N.E1
        ];
        const solarLead = [
          N.E4, 0, N.F4, 0, N.Gs4, 0, N.B4, N.Gs4, N.E4, 0, N.B4, 0, N.C5, 0, N.B4, N.Gs4,
          N.E5, 0, N.C5, 0, N.B4, 0, N.Gs4, N.F4, N.E4, 0, N.Gs4, 0, N.B4, 0, N.E5, 0
        ];
        if (magmaBass[step]) {
          this._playNote(magmaBass[step], t, sd * 1.35, 'sawtooth', 0.44);
          this._playNote(magmaBass[step] * 2, t, sd * 0.9, 'sawtooth', 0.18, -7);
        }
        if (solarLead[step]) {
          this._playNote(solarLead[step], t, sd * 1.5, 'sawtooth', isBoss ? 0.16 : 0.12, 7);
        }
        if (s === 0 || s === 6 || s === 10 || (isBoss && s === 14)) this._playKick(t, 152, 32, 0.50);
        if (s === 4 || s === 12) this._playHat(t, 0.24, 3400);
        if (s % 2 === 1) this._playHat(t, isBoss ? 0.11 : 0.07, 7200);
        if (step === 0 || step === 16) {
          this._playNote(bar === 0 ? N.E3 : N.F3, t, sd * 14, 'sawtooth', 0.10, -5);
          this._playNote(bar === 0 ? N.B3 : N.C4, t, sd * 14, 'triangle', 0.12);
        }
      }
    }
  };
  window.RealmMusicEngine = RealmMusicEngine;

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
  // ─────────────────────────────────────────────────────────────
  // CHROME CORE GEOMETRY DATABASE & COMPLETE-WINGS GUARD (v402)
  // Ensures zero wing clipping at sprite/viewport edges and unified size scaling across all realms & tiers
  // ─────────────────────────────────────────────────────────────
  const CORE_GEOMETRY_DB = {
    version: 'v411_mlbb_joystick',
    refCanvasW: 1024,
    refCanvasH: 576,
    wingCanvasW: 512,
    wingCanvasH: 576,
    sphereRadiusRef: 168,
    hingeXRef: 148,
    tipXRef: { 1: 168, 2: 256, 3: 336, 4: 416, 5: 496, 6: 516 },
    halfTopRef: { 1: 215, 2: 215, 3: 215, 4: 245, 5: 270, 6: 315 },
    halfBotRef: { 1: 215, 2: 215, 3: 215, 4: 235, 5: 260, 6: 435 }
  };

  // Verified pixel anchors & shoulder-cannon muzzles measured on 1024x682 Tier VI PNGs
  const TIER6_SPECS = {
    meteor: {
      name: 'METEOR DRAGON',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 265,
      muzzleL: { x: 385, y: 95 },
      muzzleR: { x: 636, y: 95 },
      scaleMult: 1.06
    },
    helix: {
      name: 'HELIX UNICORN',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      muzzleL: { x: 406, y: 148 },
      muzzleR: { x: 617, y: 148 },
      scaleMult: 1.08
    },
    dynamo: {
      name: 'DYNAMO PRINCESS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 278,
      muzzleL: { x: 373, y: 19 },
      muzzleR: { x: 650, y: 19 },
      scaleMult: 1.12
    }
  };

  const CoreGeometryDB = {
    data: null,
    TIER6_SPECS,
    load() {
      if (typeof fetch !== 'function') return;
      fetch('assets/core-geometry-db.json?v=arcade416_relic_trails_coronation')
        .then((r) => (r && r.ok ? r.json() : null))
        .then((json) => {
          if (!json || !json.tierMaxTipXRef) return;
          this.data = json;
          if (typeof json.hingeXRef === 'number') CORE_GEOMETRY_DB.hingeXRef = json.hingeXRef;
          if (typeof json.sphereRadiusRef === 'number') CORE_GEOMETRY_DB.sphereRadiusRef = json.sphereRadiusRef;
          for (let t = 1; t <= 6; t++) {
            const key = String(t);
            if (typeof json.tierMaxTipXRef[key] === 'number') {
              CORE_GEOMETRY_DB.tipXRef[t] = json.tierMaxTipXRef[key];
            }
            if (json.models) {
              let maxTop = CORE_GEOMETRY_DB.halfTopRef[t];
              let maxBot = CORE_GEOMETRY_DB.halfBotRef[t];
              ['dynamo', 'helix', 'meteor'].forEach((m) => {
                const entry = json.models[m] && json.models[m][key];
                if (entry) {
                  if (typeof entry.halfTopY === 'number') maxTop = Math.max(maxTop, entry.halfTopY);
                  if (typeof entry.halfBotY === 'number') maxBot = Math.max(maxBot, entry.halfBotY);
                }
              });
              CORE_GEOMETRY_DB.halfTopRef[t] = maxTop;
              CORE_GEOMETRY_DB.halfBotRef[t] = maxBot;
            }
          }
          if (json.tier6Specs) {
            ['meteor', 'helix', 'dynamo'].forEach((m) => {
              const s = json.tier6Specs[m];
              if (s && TIER6_SPECS[m]) {
                if (typeof s.anchorX === 'number') TIER6_SPECS[m].anchorX = s.anchorX;
                if (typeof s.anchorY === 'number') TIER6_SPECS[m].anchorY = s.anchorY;
                if (s.muzzleL) TIER6_SPECS[m].muzzleL = s.muzzleL;
                if (s.muzzleR) TIER6_SPECS[m].muzzleR = s.muzzleR;
                if (typeof s.scaleMult === 'number') TIER6_SPECS[m].scaleMult = s.scaleMult;
              }
            });
          }
        })
        .catch(() => {});
    },
    _interpMetric(map, tierVal) {
      const c = Math.max(1, Math.min(6, Number.isFinite(tierVal) ? tierVal : 1));
      const lo = Math.floor(c);
      const hi = Math.min(6, lo + 1);
      const frac = c - lo;
      return map[lo] + (map[hi] - map[lo]) * frac;
    },
    computeCoreMetrics(canvasW, canvasH, tier, isTouchMode, customScale = null) {
      const w = Math.max(240, canvasW || 1280);
      const h = Math.max(240, canvasH || 720);
      const isMobile = isTouchMode || w < 600;
      const baseDrawW = isMobile ? Math.min(w * 0.80, 340) : Math.min(w * 0.64, 780);
      let u = customScale || (baseDrawW / 1376.0);
      const tCur = Math.max(1, Math.min(6, Number.isFinite(tier) ? tier : 1));
      const tipX = this._interpMetric(CORE_GEOMETRY_DB.tipXRef, tCur);
      const halfTopRef = this._interpMetric(CORE_GEOMETRY_DB.halfTopRef, tCur);
      const halfBotRef = this._interpMetric(CORE_GEOMETRY_DB.halfBotRef, tCur);

      const hEnv = 1.12;
      const vEnv = 1.10;
      let coreImgScale = (68.0 / 150.0) * u;
      if (!customScale) {
        const maxAllowedW = w * 0.68;
        const maxAllowedH = h * (tCur >= 5.2 ? 0.38 : 0.34);
        const curSpanW = tipX * 2 * hEnv * coreImgScale;
        const curSpanH = (halfTopRef + halfBotRef) * vEnv * coreImgScale;
        let capFactor = 1.0;
        if (curSpanW > maxAllowedW && curSpanW > 0) capFactor = Math.min(capFactor, maxAllowedW / curSpanW);
        if (curSpanH > maxAllowedH && curSpanH > 0) capFactor = Math.min(capFactor, maxAllowedH / curSpanH);
        if (capFactor < 1.0) {
          u *= capFactor;
          coreImgScale = (68.0 / 150.0) * u;
        }
      }

      const halfSpanPx = tipX * hEnv * coreImgScale;
      const halfTopPx = halfTopRef * vEnv * coreImgScale;
      const halfBotPx = halfBotRef * vEnv * coreImgScale;
      return {
        u,
        coreImgScale,
        halfSpanPx,
        halfTopPx,
        halfBotPx,
        safePadX: Math.ceil(halfSpanPx + 10),
        safePadTop: Math.ceil(halfTopPx + 54),
        safePadBottom: Math.ceil(halfBotPx + 12)
      };
    },
    getTier6DrawLayout(mode, u) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const spec = TIER6_SPECS[mKey] || TIER6_SPECS.dynamo;
      const scale = (68.0 / 150.0) * u * (spec.scaleMult || 1.08);
      return {
        spec,
        scale,
        drawW: spec.width * scale,
        drawH: spec.height * scale,
        anchorOffX: spec.anchorX * scale,
        anchorOffY: spec.anchorY * scale
      };
    },
    getTier6Muzzles(mode, u, cx, cy, bankAngle = 0) {
      const lay = this.getTier6DrawLayout(mode, u);
      const rot = bankAngle || 0;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const toWorld = (m) => {
        const lx = (m.x - lay.spec.anchorX) * lay.scale;
        const ly = (m.y - lay.spec.anchorY) * lay.scale;
        return {
          x: cx + lx * cosR - ly * sinR,
          y: cy + lx * sinR + ly * cosR
        };
      };
      return { left: toWorld(lay.spec.muzzleL), right: toWorld(lay.spec.muzzleR), layout: lay };
    },
    clampCatcherPosition(rawX, rawY, canvasW, canvasH, tier, isTouchMode, isReflexMode, reflexBottomMargin) {
      const m = this.computeCoreMetrics(canvasW, canvasH, tier, isTouchMode, null);
      const minX = m.safePadX;
      const maxX = Math.max(minX, canvasW - m.safePadX);
      const clampedX = (minX >= canvasW * 0.5)
        ? canvasW * 0.5
        : Math.max(minX, Math.min(maxX, rawX));

      let clampedY;
      if (isReflexMode) {
        clampedY = canvasH - reflexBottomMargin;
      } else {
        const minY = m.safePadTop;
        const maxY = Math.max(minY, canvasH - m.safePadBottom);
        clampedY = (minY >= maxY) ? canvasH * 0.72 : Math.max(minY, Math.min(maxY, rawY));
      }
      return { x: clampedX, y: clampedY, metrics: m };
    }
  };
  CoreGeometryDB.load();

  const LayeredT4Assets = {
    halo: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRight: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRightT5: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingLeftCanvas: { dynamo: null, helix: null, meteor: null },
    coreBase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreBaseT5: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    // === CHANGED (v393): 15 Chrome Core Tier-Specific PNGs & Layered Wing/Shell Registry ===
    coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },
    bezelT5: { dynamo: new Image(), helix: new Image() },
    helixGlassShell: new Image(),
    nodeShell: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    hazard: {
      dynamoCore: new Image(),
      dynamoGlitch: new Image(),
      helixClean: new Image(),
      meteorBlades: new Image(),
      meteorCenter: new Image()
    },
    poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
    shieldBarrier: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    powerupShield: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    powerupRelics: {
      missiles: new Image(),
      cluster: new Image(),
      supercharge: new Image(),
      chronos: new Image(),
      singularity: new Image(),
      catalyst: new Image()
    },
    hazardCore3D: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    hazardSeekerRing: new Image(),
    bosses: {},
    loaded: {
      halo: { dynamo: false, helix: false, meteor: false },
      wingRight: { dynamo: false, helix: false, meteor: false },
      wingRightT5: { dynamo: false, helix: false, meteor: false },
      coreBase: { dynamo: false, helix: false, meteor: false },
      coreBaseT5: { dynamo: false, helix: false, meteor: false },
      coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },
      coreT6Showcase: { dynamo: false, helix: false, meteor: false },
      wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },
      bezelT5: { dynamo: false, helix: false },
      helixGlassShell: false,
      nodeShell: { dynamo: false, helix: false, meteor: false },
      hazard: {
        dynamoCore: false,
        dynamoGlitch: false,
        helixClean: false,
        meteorBlades: false,
        meteorCenter: false
      },
      poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
      shieldBarrier: { dynamo: false, helix: false, meteor: false },
      powerupShield: { dynamo: false, helix: false, meteor: false },
      powerupRelics: {
        missiles: false, cluster: false, supercharge: false,
        chronos: false, singularity: false, catalyst: false
      },
      hazardCore3D: { dynamo: false, helix: false, meteor: false },
      hazardSeekerRing: false,
      bosses: {}
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

  LayeredT4Assets.helixGlassShell.onload = () => { LayeredT4Assets.loaded.helixGlassShell = true; };
  LayeredT4Assets.helixGlassShell.src = 'assets/core-helix-glass-shell.png?v=arcade416_relic_trails_coronation';

  LayeredT4Assets.bezelT5.dynamo.onload = () => { LayeredT4Assets.loaded.bezelT5.dynamo = true; };
  LayeredT4Assets.bezelT5.dynamo.src = 'assets/core-dynamo-bezel-t5.png?v=arcade416_relic_trails_coronation';
  LayeredT4Assets.bezelT5.helix.onload = () => { LayeredT4Assets.loaded.bezelT5.helix = true; };
  LayeredT4Assets.bezelT5.helix.src = 'assets/core-helix-bezel-t5.png?v=arcade416_relic_trails_coronation';

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
    LayeredT4Assets.coreBaseT5[m].src = `assets/core-${m}-t5.png?v=arcade416_relic_trails_coronation`;

    LayeredT4Assets.coreT6Body[m].onload = () => { LayeredT4Assets.loaded.coreT6Body[m] = true; };
    LayeredT4Assets.coreT6Body[m].src = `assets/core-${m}-t6-body.png?v=arcade416_relic_trails_coronation`;

    LayeredT4Assets.coreT6Guns[m].onload = () => { LayeredT4Assets.loaded.coreT6Guns[m] = true; };
    LayeredT4Assets.coreT6Guns[m].src = `assets/core-${m}-t6-guns.png?v=arcade416_relic_trails_coronation`;

    LayeredT4Assets.coreT6Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT6Showcase[m] = true; };
    LayeredT4Assets.coreT6Showcase[m].src = `assets/core-${m}-t6-showcase.png?v=arcade416_relic_trails_coronation`;

    for (let t = 1; t <= 6; t++) {
      const cImg = new Image();
      LayeredT4Assets.coreTierSprites[m][t] = cImg;
      LayeredT4Assets.loaded.coreTierSprites[m][t] = false;
      cImg.onload = () => { LayeredT4Assets.loaded.coreTierSprites[m][t] = true; };
      cImg.src = `assets/core-${m}-t${t}.png?v=arcade416_relic_trails_coronation`;

      if (t >= 2 && t <= 5) {
        const wImg = new Image();
        LayeredT4Assets.wingRightTiers[m][t] = wImg;
        LayeredT4Assets.loaded.wingRightTiers[m][t] = false;
        wImg.onload = () => { LayeredT4Assets.loaded.wingRightTiers[m][t] = true; };
        wImg.src = `assets/core-${m}-wing-r-t${t}.png?v=arcade416_relic_trails_coronation`;
      }
    }
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

  // Preload all 15 De-Fringed Luxury Raytraced Powered Bad Chrome Core Sprites (3 Games x 5 Powered Hazards)
  const POWERED_HAZARD_KEYS = ['hyper_comet', 'corruptor_laser', 'gravity_well', 'emp_detonator', 'phase_stalker'];
  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    POWERED_HAZARD_KEYS.forEach((hk) => {
      const img = new Image();
      LayeredT4Assets.poweredHazard[m][hk] = img;
      LayeredT4Assets.loaded.poweredHazard[m][hk] = false;
      img.onload = () => { LayeredT4Assets.loaded.poweredHazard[m][hk] = true; };
      img.src = `assets/hazard-powered-${m}-${hk}.png?v=arcade416_relic_trails_coronation`;
    });

    // v420 Luxury 3D Active Shield Barrier Rings, Heraldic Shield Relics & Upgraded 3D Hazard Cores
    LayeredT4Assets.shieldBarrier[m].onload = () => { LayeredT4Assets.loaded.shieldBarrier[m] = true; };
    LayeredT4Assets.shieldBarrier[m].src = `assets/shield-barrier-${m}.png?v=arcade416_relic_trails_coronation`;

    LayeredT4Assets.powerupShield[m].onload = () => { LayeredT4Assets.loaded.powerupShield[m] = true; };
    LayeredT4Assets.powerupShield[m].src = `assets/powerup-shield-${m}.png?v=arcade416_relic_trails_coronation`;

    LayeredT4Assets.hazardCore3D[m].onload = () => { LayeredT4Assets.loaded.hazardCore3D[m] = true; };
    LayeredT4Assets.hazardCore3D[m].src = `assets/hazard-core-${m}-3d.png?v=arcade416_relic_trails_coronation`;
  });

  ['missiles', 'cluster', 'supercharge', 'chronos', 'singularity', 'catalyst'].forEach((pk) => {
    LayeredT4Assets.powerupRelics[pk].onload = () => { LayeredT4Assets.loaded.powerupRelics[pk] = true; };
    LayeredT4Assets.powerupRelics[pk].src = `assets/powerup-${pk}-3d.png?v=arcade416_relic_trails_coronation`;
  });

  LayeredT4Assets.hazardSeekerRing.onload = () => { LayeredT4Assets.loaded.hazardSeekerRing = true; };
  LayeredT4Assets.hazardSeekerRing.src = 'assets/hazard-seeker-ring-3d.png?v=arcade416_relic_trails_coronation';

  // Preload all 5 Bespoke 3D Sculpted Sovereign Round Boss Sprites (Rounds 1 -> 5+)
  const BOSS_SPRITE_FILES = {
    1: 'assets/boss-r1-sentinel.png?v=arcade389_boss_nova',
    2: 'assets/boss-r2-corruptor.png?v=arcade389_boss_nova',
    3: 'assets/boss-r3-singularity.png?v=arcade389_boss_nova',
    4: 'assets/boss-r4-tempest.png?v=arcade389_boss_nova',
    5: 'assets/boss-r5-omega.png?v=arcade389_boss_nova'
  };
  Object.keys(BOSS_SPRITE_FILES).forEach((bKey) => {
    const img = new Image();
    LayeredT4Assets.bosses[bKey] = img;
    LayeredT4Assets.loaded.bosses[bKey] = false;
    img.onload = () => { LayeredT4Assets.loaded.bosses[bKey] = true; };
    img.src = BOSS_SPRITE_FILES[bKey];
  });

  // === CHANGED (v390): PRELOAD ULTRA-HD 3D WEAPON, MISSILE & FLUID-FIRE NOVA VFX ASSETS ===
  const VfxUltraAssets = {
    novaFlame: {},
    novaWisps: {},
    novaCorona: {},
    gunBolt: {},
    seekerMissile: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false }
  };
  (['meteor', 'dynamo', 'helix']).forEach((rm) => {
    const fImg = new Image();
    VfxUltraAssets.novaFlame[rm] = fImg;
    VfxUltraAssets.loaded.novaFlame[rm] = false;
    fImg.onload = () => { VfxUltraAssets.loaded.novaFlame[rm] = true; };
    fImg.src = `assets/vfx-nova-flame-${rm}.png?v=arcade390_vfx_ultra`;

    const wImg = new Image();
    VfxUltraAssets.novaWisps[rm] = wImg;
    VfxUltraAssets.loaded.novaWisps[rm] = false;
    wImg.onload = () => { VfxUltraAssets.loaded.novaWisps[rm] = true; };
    wImg.src = `assets/vfx-nova-wisps-${rm}.png?v=arcade390_vfx_ultra`;

    const cImg = new Image();
    VfxUltraAssets.novaCorona[rm] = cImg;
    VfxUltraAssets.loaded.novaCorona[rm] = false;
    cImg.onload = () => { VfxUltraAssets.loaded.novaCorona[rm] = true; };
    cImg.src = `assets/vfx-nova-corona-${rm}.png?v=arcade390_vfx_ultra`;

    const gImg = new Image();
    VfxUltraAssets.gunBolt[rm] = gImg;
    VfxUltraAssets.loaded.gunBolt[rm] = false;
    gImg.onload = () => { VfxUltraAssets.loaded.gunBolt[rm] = true; };
    gImg.src = `assets/vfx-gun-bolt-${rm}.png?v=arcade390_vfx_ultra`;
  });
  (function preloadSeekerMissile() {
    const mImg = new Image();
    VfxUltraAssets.seekerMissile = mImg;
    mImg.onload = () => { VfxUltraAssets.loaded.seekerMissile = true; };
    mImg.src = 'assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra';
  })();

  // Helper: Identifies any hazard trap or anomaly archetype
  function isHazardNode(nodeClass) {
    return nodeClass === 'volatile' || nodeClass === 'seeker' || nodeClass === 'phantom' || nodeClass === 'fragmentation' || nodeClass === 'vortex' || nodeClass === 'gravity_well' || nodeClass === 'pulsar_mine' || nodeClass === 'emp_glitch' || nodeClass === 'emp_detonator' || nodeClass === 'tachyon_fracture' || nodeClass === 'phase_stalker' || nodeClass === 'plasma_flare' || nodeClass === 'hyper_comet' || nodeClass === 'corruptor_laser' || nodeClass === 'broken_arc';
  }

  function getRealmShieldMeta(mode) {
    if (mode === 'helix') {
      return { name: 'PRISM AEGIS', badge: '🛡️ PRISM AEGIS', color: '#22d3ee', icon: '🛡️' };
    }
    if (mode === 'meteor') {
      return { name: 'CALDERA BULWARK', badge: '🛡️ BULWARK', color: '#fb923c', icon: '🛡️' };
    }
    return { name: 'FARADAY AEGIS', badge: '🛡️ AEGIS SHIELD', color: '#38bdf8', icon: '🛡️' };
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
    shieldImpacts: [],
    coronationBursts: [],

    // Mode-Specific Capture States
    wingRipples: [],
    dynamoDischarges: [],
    meteorShieldRecoil: { x: 0, vx: 0, y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 },
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
      this.shieldImpacts = [];
      this.coronationBursts = [];
      this.wingRipples = [];
      this.dynamoDischarges = [];
      this.meteorShieldRecoil = { x: 0, vx: 0, y: 0, vy: 0, tilt: 0, vTilt: 0, flash: 0 };
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

      // UPGRADE 1: Real-Time Morphing "Ascension Unfurl" Spring (Tier I <-> II <-> III <-> IV <-> V <-> VI)
      if (targetTier > this.lastTargetTier && targetTier <= 5) {
        // Trigger Ascension Unfurl Burst Ring (Tier VI uses dedicated Tier6HatchSystem)!
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
      this.continuousTier = Math.max(1.0, Math.min(6.0, this.continuousTier));

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

      // 5. Update Meteor Shield Recoil Spring (2D Directional Contact Recoil)
      const sr = this.meteorShieldRecoil;
      sr.vx = ((sr.vx || 0) - (sr.x || 0) * 0.24 * dt) * Math.pow(0.74, dt);
      sr.x = (sr.x || 0) + sr.vx * dt;
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
      for (let i = this.shieldImpacts.length - 1; i >= 0; i--) {
        if ((now - this.shieldImpacts[i].startTime) >= this.shieldImpacts[i].duration) {
          this.shieldImpacts.splice(i, 1);
        }
      }
      for (let i = this.coronationBursts.length - 1; i >= 0; i--) {
        if ((now - this.coronationBursts[i].startTime) >= this.coronationBursts[i].duration) {
          this.coronationBursts.splice(i, 1);
        }
      }
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

    triggerPowerupCoronation(x, y, now, accentColor = '#fbbf24') {
      this.coronationBursts.push({ x, y, startTime: now, duration: 540, color: accentColor });
      if (this.coronationBursts.length > 4) this.coronationBursts.shift();
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        const spd = 2.6 + (k % 3) * 1.4;
        this.grazeSparks.push({
          x, y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: (k % 2 === 0) ? '#fef08a' : accentColor,
          life: 0,
          maxLife: 24 + (k % 4) * 4
        });
      }
    },

    getShieldOuterRadius(u, tier = 1) {
      const tierBoost = (tier >= 6) ? 1.26 : 1.0;
      return Math.max(94, 144 * u) * tierBoost;
    },

    triggerShieldDeflect(x, y, now, mode = null, contactAng = null) {
      this.shieldDeflectFlash = 1.0;
      const effMode = mode || ((state.catcherType === 'helix' || state.gameType === 'helix')
        ? 'helix'
        : ((state.catcherType === 'meteor' || state.gameType === 'meteor') ? 'meteor' : 'dynamo'));
      const ang = Number.isFinite(contactAng) ? contactAng : (-Math.PI * 0.5);

      this.shieldImpacts.push({
        angle: ang,
        startTime: now,
        duration: 420,
        mode: effMode
      });
      if (this.shieldImpacts.length > 8) {
        this.shieldImpacts.shift();
      }

      const pal = (effMode === 'helix')
        ? ['#22d3ee', '#e879f9', '#f0f9ff', '#34d399']
        : ((effMode === 'meteor')
            ? ['#fde047', '#fb923c', '#f97316', '#ffffff']
            : ['#38bdf8', '#fde047', '#c084fc', '#e0f2fe']);
      const directional = Number.isFinite(contactAng);
      for (let k = 0; k < 22; k++) {
        const a = directional ? (ang + (Math.random() - 0.5) * 1.45) : (Math.random() * Math.PI * 2);
        const spd = (directional ? 4.4 : 3.6) + Math.random() * 6.8;
        this.grazeSparks.push({
          x: x,
          y: y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: pal[k % pal.length],
          life: 0,
          maxLife: 22 + Math.random() * 12
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

        // Target Acquisition & Proportional Navigation (Prioritize Active Boss Pylons/Boss & Hazards!)
        let bestDist = 9999;
        let bestTarget = null;
        if (state.boss && state.boss.phase === 'fighting') {
          const bossRef = state.boss;
          if (bossRef.pylons && bossRef.pylons.length > 0) {
            for (let pyIdx = 0; pyIdx < bossRef.pylons.length; pyIdx++) {
              const pyl = bossRef.pylons[pyIdx];
              if (pyl.hp > 0) {
                const dP = Math.hypot(pyl.x - m.x, pyl.y - m.y) * 0.25;
                if (dP < bestDist) { bestDist = dP; bestTarget = pyl; }
              }
            }
          }
          const dB = Math.hypot(bossRef.x - m.x, bossRef.y - m.y) * 0.30;
          if (dB < bestDist) { bestDist = dB; bestTarget = bossRef; }
        }
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
          x: m.x - Math.cos(m.angle) * 18,
          y: m.y - Math.sin(m.angle) * 18,
          size: 5.2,
          alpha: 0.90,
          color: smokeColor
        });

        for (let s = m.smoke.length - 1; s >= 0; s--) {
          const sm = m.smoke[s];
          sm.size += 0.55 * dt;
          sm.alpha -= 0.052 * dt;
          if (sm.alpha <= 0) {
            m.smoke.splice(s, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
          ctx.fillStyle = sm.color;
          ctx.globalAlpha = sm.alpha * 0.72;
          ctx.fill();
        }

        // === CHANGED (v396): Mode-Unique Micro-Missile Rendering (Blue Dynamo Torpedo vs Fiery Meteor Caldera Bolide vs Crystal Helix) ===
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.globalAlpha = 1.0;
        if (mMode === 'dynamo' && VfxUltraAssets.loaded.seekerMissile && VfxUltraAssets.seekerMissile && VfxUltraAssets.seekerMissile.naturalWidth > 0) {
          ctx.rotate(m.angle + Math.PI * 0.5);
          const mw = 46;
          const mh = 70;
          const mGlow = QuantumRenderer._getGlowSprite('cyan');
          ctx.globalAlpha = 0.70;
          ctx.drawImage(mGlow, -28, -28, 56, 56);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(VfxUltraAssets.seekerMissile, -mw * 0.5, -mh * 0.44, mw, mh);
          // Golden magnetic induction ring & nose arc
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.90)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.ellipse(0, -6, 8, 3, Math.sin(now * 0.02) * 0.25, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else {
        const mGlow = QuantumRenderer._getGlowSprite(mMode === 'meteor' ? 'amber' : (mMode === 'helix' ? 'helix' : 'cyan'));
        ctx.globalAlpha = 0.78;
        ctx.drawImage(mGlow, -28, -28, 56, 56);
        ctx.globalAlpha = 1.0;
        ctx.rotate(m.angle);
        ctx.scale(2.15, 2.15);

        // Rocket Motor Flame & Supersonic Mach Shock Diamonds
        if (m.stage === 2) {
          ctx.beginPath();
          ctx.moveTo(-7, -2.6);
          ctx.lineTo(-19 - Math.random() * 6, 0);
          ctx.lineTo(-7, 2.6);
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
          ctx.moveTo(-7, -1.4);
          ctx.lineTo(-13.5, 0);
          ctx.lineTo(-7, 1.4);
          ctx.closePath();
          ctx.fillStyle = (mMode === 'meteor') ? '#fef08a' : '#ffffff';
          ctx.fill();

          // 2 Discrete Supersonic Mach Shock Diamonds behind the nozzle
          for (let md = 1; md <= 2; md++) {
            const dxM = -8.5 - md * 3.8;
            const rwM = 1.9 - md * 0.45;
            ctx.fillStyle = (mMode === 'meteor') ? 'rgba(254, 249, 195, 0.92)' : 'rgba(224, 242, 254, 0.92)';
            ctx.beginPath();
            ctx.moveTo(dxM + 1.5, 0);
            ctx.lineTo(dxM, -rwM);
            ctx.lineTo(dxM - 1.5, 0);
            ctx.lineTo(dxM, rwM);
            ctx.closePath();
            ctx.fill();
          }
        }

        if (mMode === 'meteor') {
          // METEOR CALDERA BOLIDE MICRO-MISSILE: Sculpted Volcanic Basalt-Lava Warhead + Swept Golden Solar Wings + Bow-Shock Hood
          // Swept golden-magma solar wings
          ctx.fillStyle = '#ea580c';
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(1, -2.5); ctx.lineTo(-9, -8.5); ctx.lineTo(-6, -2.0); ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(1, 2.5); ctx.lineTo(-9, 8.5); ctx.lineTo(-6, 2.0); ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Volcanic dark basalt armored body with glowing lava core
          ctx.fillStyle = '#1c0d06';
          ctx.beginPath();
          ctx.ellipse(0, 0, 7.5, 4.2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Glowing branching magma fissures across the basalt shell
          ctx.strokeStyle = '#fb923c';
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(-5.5, -1.2); ctx.lineTo(0, 0.9); ctx.lineTo(5.5, -1.0);
          ctx.moveTo(-1.5, -3.4); ctx.lineTo(1.2, 3.4);
          ctx.stroke();

          // White-hot solar magma furnace heart + forged golden penetrator nose
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(1.2, 0, 2.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(6.2, -2.4); ctx.lineTo(13.2, 0); ctx.lineTo(6.2, 2.4); ctx.closePath();
          ctx.fill();

          // Parabolic white-gold atmospheric compression bow-shock crescent ahead of nosecone
          ctx.strokeStyle = 'rgba(254, 249, 195, 0.92)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(8.5, -5.5);
          ctx.quadraticCurveTo(16.5, 0, 8.5, 5.5);
          ctx.stroke();

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
        }

        // Check Impact with Active Round Boss / Shield Pylons first (3 damage per missile!)
        let hit = false;
        if (state.boss && state.boss.phase === 'fighting' && typeof RoundBossEngine !== 'undefined') {
          const bossRef = state.boss;
          if (bossRef.pylons) {
            for (let pyIdx = 0; pyIdx < bossRef.pylons.length; pyIdx++) {
              const pyl = bossRef.pylons[pyIdx];
              if (pyl.hp > 0 && Math.hypot(pyl.x - m.x, pyl.y - m.y) < 32) {
                hit = true;
                RoundBossEngine.damagePylon(pyl, 3, now, m.x, m.y);
                this.launchFlashes.push({ x: m.x, y: m.y, r: 10, maxR: 46, alpha: 1.0, color: '#fbbf24' });
                audio.playMissileHit();
                break;
              }
            }
          }
          if (!hit && Math.hypot(bossRef.x - m.x, bossRef.y - m.y) < (bossRef.hitR || 72)) {
            hit = true;
            RoundBossEngine.damageBoss(3, now, true, m.x, m.y);
            this.launchFlashes.push({ x: m.x, y: m.y, r: 12, maxR: 52, alpha: 1.0, color: '#fbbf24' });
            audio.playMissileHit();
          }
        }

        // Check Impact with Falling Targets (Neutralize Hazards & Auto-Claim Collectibles)
        for (let pIdx = state.particles.length - 1; !hit && pIdx >= 0; pIdx--) {
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
              audio.playMissileHit();
              updateHeaderUI();
            } else {
              // Good node intercepted by missile: immediately counts as an authentic combo addition + reloads Core Cannon!
              const pts = 300 * state.combo;
              state.score += pts;
              if (typeof RoundBossEngine !== 'undefined') {
                RoundBossEngine.onGoodNodeCaught(pt.nodeClass, false, now, (cachedCanvasRect.width || 800));
              }
              const prevCombo = state.combo;
              state.combo = Math.min(999, state.combo + 1);
              if (typeof evaluateCoreTierFromCombo === 'function') {
                evaluateCoreTierFromCombo(now, true);
              } else {
                state.coreTier = state.combo >= 50 ? 6 : (state.combo >= 28 ? 5 : (state.combo >= 21 ? 4 : (state.combo >= 14 ? 3 : (state.combo >= 7 ? 2 : 1))));
                state.isOverdrive = (state.coreTier >= 4);
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

              if (pt.nodeClass === 'cluster') {
                state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#e879f9');
              } else if (pt.nodeClass === 'supercharge') {
                state.applyBuff('hyper', 'HYPER SURGE', '#fbbf24', '⚡', 5000, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#fbbf24');
              } else if (pt.nodeClass === 'chronos') {
                state.applyBuff('chronos', 'CHRONOS STASIS', '#22d3ee', '⏳', 4500, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#22d3ee');
              } else if (pt.nodeClass === 'singularity') {
                state.applyBuff('singularity', 'GRAVITON VACUUM', '#38bdf8', '🧲', 3500, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#38bdf8');
              } else if (pt.nodeClass === 'catalyst') {
                const targetTierCombo = { 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
                if (state.coreTier < 5) {
                  state.coreTier = Math.min(5, state.coreTier + 1);
                  state.combo = Math.max(state.combo, targetTierCombo[state.coreTier] || state.combo);
                }
                state.isOverdrive = (state.coreTier >= 4);
                state.reflexLives = Math.min(3, state.reflexLives + 1);
                renderReflexShields();
                state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#34d399');
                if (state.coreTier === 5) audio.playTier5Ascension();
                else audio.playOverdriveFanfare();
              } else if (pt.nodeClass === 'shield') {
                const sMeta = getRealmShieldMeta(mMode);
                state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
                CoreKinematics.triggerShieldDeflect(m.x, m.y, now, mMode);
                this.triggerPowerupCoronation(pt.x, pt.y, now, sMeta.color);
              } else if (pt.nodeClass === 'missiles') {
                state.applyBuff('missiles', 'ALLIED MISSILES', '#38bdf8', '🚀', 4000, now);
                this.triggerPowerupCoronation(pt.x, pt.y, now, '#38bdf8');
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

    _drawStarGlint(ctx, x, y, r, color = '#ffffff') {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0);
      ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r);
      ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0);
      ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },

    drawAegisForcefield(ctx, cx, cy, u, now, timeLeft = 5000, mode = 'dynamo') {
      ctx.save();
      ctx.translate(cx, cy);

      const curTier = (typeof state !== 'undefined' && state.coreTier) ? state.coreTier : 1;
      const baseRadius = this.getShieldOuterRadius(u, curTier);
      const pulse = 1.0 + 0.016 * Math.sin(now * 0.0075);
      const r = baseRadius * pulse;
      const isExpiring = timeLeft < 1200;
      const warnPulse = isExpiring ? (0.48 + 0.52 * Math.sin(now * 0.028)) : 1.0;

      const isDyn = (mode === 'dynamo' || mode === 'realm');
      const isHel = (mode === 'helix');
      const effMode = isDyn ? 'dynamo' : (isHel ? 'helix' : 'meteor');
      const maxDur = (typeof state !== 'undefined' && state.getBuff) ? (state.getBuff('shield', now)?.maxDur || 5000) : 5000;
      const pctLeft = Math.max(0.02, Math.min(1, timeLeft / Math.max(5000, maxDur)));

      // LAYER 1: 3D Spherical Fresnel Refractive Force-Dome Lens & Glass Crescent Caustics (v414)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.26 * warnPulse;
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'gold');
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.25, -r * 1.25, r * 2.5, r * 2.5);
      ctx.globalAlpha = 1.0;

      // Convex spherical dome interior Fresnel tint + caustic glow
      const sheen = ctx.createRadialGradient(-r * 0.22, -r * 0.26, r * 0.08, 0, 0, r * 0.88);
      sheen.addColorStop(0.0, isDyn ? `rgba(224, 242, 254, ${0.05 * warnPulse})` : (isHel ? `rgba(207, 250, 254, ${0.06 * warnPulse})` : `rgba(254, 249, 195, ${0.05 * warnPulse})`));
      sheen.addColorStop(0.55, isDyn ? `rgba(56, 189, 248, ${0.06 * warnPulse})` : (isHel ? `rgba(192, 132, 252, ${0.07 * warnPulse})` : `rgba(251, 146, 60, ${0.06 * warnPulse})`));
      sheen.addColorStop(0.88, isDyn ? `rgba(251, 191, 36, ${0.16 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.16 * warnPulse})` : `rgba(253, 224, 71, ${0.18 * warnPulse})`));
      sheen.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // Upper-left convex crystal-dome specular crescent reflection + faint lower caustic bounce
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, -Math.PI * 0.82, -Math.PI * 0.36);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * warnPulse})`;
      ctx.lineWidth = 4.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.76, -Math.PI * 0.78, -Math.PI * 0.42);
      ctx.strokeStyle = isDyn ? `rgba(125, 211, 252, ${0.22 * warnPulse})` : (isHel ? `rgba(240, 171, 252, ${0.22 * warnPulse})` : `rgba(254, 240, 138, ${0.24 * warnPulse})`);
      ctx.lineWidth = 8.5;
      ctx.stroke();

      // Subtle breathing geodesic hex-lattice caustics inside the sanctuary dome
      const hexRot = now * 0.00035;
      ctx.strokeStyle = isDyn ? `rgba(56, 189, 248, ${0.09 * warnPulse})` : (isHel ? `rgba(103, 232, 249, ${0.10 * warnPulse})` : `rgba(251, 191, 36, ${0.09 * warnPulse})`);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = hexRot + (h * Math.PI / 3);
        const hx = Math.cos(ha) * r * 0.74;
        const hy = Math.sin(ha) * r * 0.74;
        if (h === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // LAYER 2: Counter-Rotating 24K Champagne-Gold Filigree Inner Gyro Ring + Diamond Glints
      const gyroRot = -now * 0.00075;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const innerR = r * 0.72;
      ctx.strokeStyle = isExpiring ? `rgba(254, 240, 138, ${0.85 * warnPulse})` : 'rgba(253, 224, 71, 0.42)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([14, 9]);
      ctx.lineDashOffset = now * 0.025;
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let d = 0; d < 4; d++) {
        const da = gyroRot + d * (Math.PI * 0.5);
        this._drawStarGlint(ctx, Math.cos(da) * innerR, Math.sin(da) * innerR, 5.2, (d % 2 === 0) ? '#fef08a' : '#e0f2fe');
      }
      ctx.restore();

      // LAYER 3: Photorealistic 3D Raytraced Luxury Shield Barrier Frame Ring (Zero Dull Polygon Lines!)
      const bSpr = LayeredT4Assets.shieldBarrier && LayeredT4Assets.shieldBarrier[effMode];
      const bLoaded = LayeredT4Assets.loaded.shieldBarrier && LayeredT4Assets.loaded.shieldBarrier[effMode] && bSpr && bSpr.naturalWidth > 0;
      if (bLoaded) {
        const sway = Math.sin(now * 0.0024) * 0.042;
        const drawD = r * 2.48;
        ctx.save();
        ctx.rotate(sway);
        ctx.globalAlpha = warnPulse;
        ctx.drawImage(bSpr, -drawD * 0.5, -drawD * 0.5, drawD, drawD);

        // Specular 24K Gold & Gemstone Luster Pass (makes metals gleam luxuriously!)
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = (0.28 + 0.12 * Math.sin(now * 0.0085)) * warnPulse;
        ctx.drawImage(bSpr, -drawD * 0.5, -drawD * 0.5, drawD, drawD);
        ctx.restore();
      } else {
        // Lightweight fallback only before PNG completes initial decode
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = isDyn ? `rgba(56, 189, 248, ${0.88 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.88 * warnPulse})` : `rgba(251, 191, 36, ${0.90 * warnPulse})`);
        ctx.lineWidth = 4.0;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // LAYER 4: Realm-Signature Live Micro-Energy Accents on Outer Crest
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      if (effMode === 'dynamo') {
        // v414: Smooth Tangent Faraday Plasma Arcs + Sapphire Mount Star-Glints (Zero Jagged Corners!)
        for (let k = 0; k < 4; k++) {
          const baseA = now * 0.0012 + k * (Math.PI * 0.5);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.98, baseA - 0.14, baseA + 0.14);
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.78 * warnPulse})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          this._drawStarGlint(ctx, Math.cos(baseA) * r * 0.98, Math.sin(baseA) * r * 0.98, 5.2 * warnPulse, (k % 2 === 0) ? '#fde047' : '#e0f2fe');
        }
      } else if (effMode === 'helix') {
        // Orbiting iridescent cyan & amethyst diamond star-glints
        for (let k = 0; k < 6; k++) {
          const ka = now * 0.0014 + k * (Math.PI / 3);
          const sc = 4.5 + 2.5 * Math.sin(now * 0.011 + k * 1.7);
          this._drawStarGlint(ctx, Math.cos(ka) * r * 0.98, Math.sin(ka) * r * 0.98, sc * warnPulse, (k % 2 === 0) ? '#67e8f9' : '#f0abfc');
        }
      } else {
        // Orbiting blazing solar-gold cinders along the Dragon Bulwark
        for (let k = 0; k < 6; k++) {
          const ka = -now * 0.0016 + k * (Math.PI / 3);
          const sc = 4.8 + 2.2 * Math.sin(now * 0.012 + k * 2.1);
          this._drawStarGlint(ctx, Math.cos(ka) * r * 0.99, Math.sin(ka) * r * 0.99, sc * warnPulse, (k % 2 === 0) ? '#fde047' : '#fb923c');
        }
      }
      ctx.restore();

      // LAYER 5: Double-Pass Luminous 24K Gold / Jewel Remaining-Duration Gauge Arc
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      const gaugeR = r * 0.70;
      const gStart = -Math.PI * 0.5;
      const gEnd = gStart + Math.PI * 2 * pctLeft;
      ctx.beginPath();
      ctx.arc(0, 0, gaugeR, gStart, gEnd);
      ctx.strokeStyle = isExpiring ? `rgba(251, 146, 60, ${0.85 * warnPulse})` : (isDyn ? 'rgba(56, 189, 248, 0.55)' : (isHel ? 'rgba(34, 211, 238, 0.55)' : 'rgba(251, 191, 36, 0.65)'));
      ctx.lineWidth = 4.5;
      ctx.stroke();
      ctx.strokeStyle = isExpiring ? `rgba(255, 255, 255, ${warnPulse})` : 'rgba(254, 249, 195, 0.92)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      // LAYER 6: Directional 24K Gold & Jewel Enemy-Crushing Impact Shockwave Crowns
      if (this.shieldImpacts && this.shieldImpacts.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        for (let i = 0; i < this.shieldImpacts.length; i++) {
          const imp = this.shieldImpacts[i];
          const prog = (now - imp.startTime) / imp.duration;
          if (prog < 0 || prog >= 1) continue;
          const fade = 1.0 - prog;
          const ix = Math.cos(imp.angle) * r;
          const iy = Math.sin(imp.angle) * r;
          const crushCol = (effMode === 'helix') ? '#67e8f9' : ((effMode === 'meteor') ? '#fbbf24' : '#38bdf8');

          // v414: Concentric Dual-Wave 24K Gold & Jewel Shock-Ripples + Crisp Outward Anvil Sparks
          ctx.globalAlpha = fade * 0.95;
          ctx.strokeStyle = '#fef9c3';
          ctx.lineWidth = 3.6 * fade;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1.02 + prog * 0.12), imp.angle - 0.48, imp.angle + 0.48);
          ctx.stroke();

          ctx.strokeStyle = crushCol;
          ctx.lineWidth = 4.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 10 + prog * 44, imp.angle - 1.25, imp.angle + 1.25);
          ctx.stroke();

          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 6 + prog * 28, imp.angle - 0.95, imp.angle + 0.95);
          ctx.stroke();

          this._drawStarGlint(ctx, ix, iy, 15 * fade, '#ffffff');
          this._drawStarGlint(ctx, ix + Math.cos(imp.angle) * (12 + prog * 24), iy + Math.sin(imp.angle) * (12 + prog * 24), 8 * fade, crushCol);
        }
        ctx.restore();
      }

      if (this.shieldDeflectFlash > 0.04) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.06 + (1.0 - this.shieldDeflectFlash) * 0.24), 0, Math.PI * 2);
        const flashColor = isDyn ? '#38bdf8' : (isHel ? '#67e8f9' : '#fde047');
        ctx.strokeStyle = flashColor;
        ctx.globalAlpha = this.shieldDeflectFlash * 0.80;
        ctx.lineWidth = 3.6;
        ctx.stroke();
        ctx.restore();
      }

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
      if (this.grazeSparks.length === 0 && this.coronationBursts.length === 0) return;
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
      if (this.coronationBursts.length > 0) {
        const now = performance.now();
        for (let i = 0; i < this.coronationBursts.length; i++) {
          const cb = this.coronationBursts[i];
          const prog = (now - cb.startTime) / cb.duration;
          if (prog < 0 || prog >= 1) continue;
          const fade = 1.0 - prog;
          const rad = (24 + prog * 112) * Math.max(0.75, u);
          ctx.globalAlpha = fade * 0.92;
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3.2 * fade;
          ctx.beginPath();
          ctx.arc(cb.x, cb.y, rad, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = cb.color;
          ctx.lineWidth = 2.0 * fade;
          ctx.beginPath();
          ctx.arc(cb.x, cb.y, rad * 0.72, 0, Math.PI * 2);
          ctx.stroke();

          for (let s = 0; s < 8; s++) {
            const sa = prog * 1.4 + (s * Math.PI / 4);
            this._drawStarGlint(
              ctx,
              cb.x + Math.cos(sa) * rad * 0.95,
              cb.y + Math.sin(sa) * rad * 0.95,
              (10.5 * fade) * Math.max(0.75, u),
              (s % 2 === 0) ? '#ffffff' : cb.color
            );
          }
        }
      }
      ctx.restore();
    },

    triggerCaptureEffect(mode, catcherX, catcherY, nodeX, nodeY, now, u = 0.5) {
      const rawDx = nodeX - catcherX;
      const rawDy = nodeY - catcherY;
      const contactAng = (Math.abs(rawDx) < 0.01 && Math.abs(rawDy) < 0.01) ? -Math.PI * 0.5 : Math.atan2(rawDy, rawDx);
      const coreR = 68.0 * u;
      const dxContact = Math.cos(contactAng) * coreR;
      const dyContact = Math.sin(contactAng) * coreR;

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
          const jitter = (s === 0 || s === steps) ? 0 : (Math.random() - 0.5) * 18 * (1 - t * 0.4);
          const perpX = -Math.sin(contactAng);
          const perpY = Math.cos(contactAng);
          pts.push({
            x: dxContact * (1 - t) + perpX * jitter,
            y: dyContact * (1 - t) + perpY * jitter
          });
        }
        this.dynamoDischarges.push({
          startTime: now,
          duration: 340,
          progress: 0,
          contactX: dxContact,
          contactY: dyContact,
          contactAngle: contactAng,
          pts: pts
        });
      } else if (mode === 'helix') {
        this.wingRipples.push({
          startTime: now,
          duration: 560,
          progress: 0,
          contactX: dxContact,
          contactY: dyContact,
          contactAngle: contactAng
        });
      } else if (mode === 'meteor') {
        // Recoil strictly opposite the exact contact normal!
        this.meteorShieldRecoil.x = -Math.cos(contactAng) * 8.5;
        this.meteorShieldRecoil.vx = -Math.cos(contactAng) * 2.5;
        this.meteorShieldRecoil.y = -Math.sin(contactAng) * 8.5;
        this.meteorShieldRecoil.vy = -Math.sin(contactAng) * 2.5;
        this.meteorShieldRecoil.tilt = Math.max(-0.22, Math.min(0.22, Math.cos(contactAng) * 0.16));
        this.meteorShieldRecoil.vTilt = this.meteorShieldRecoil.tilt * 0.25;
        this.meteorShieldRecoil.flash = 1.0;

        const impactWorldX = catcherX + dxContact;
        const impactWorldY = catcherY + dyContact;
        const tangX = -Math.sin(contactAng);
        const tangY = Math.cos(contactAng);
        for (let k = 0; k < 14; k++) {
          if (this.impactCinders.length >= 16) this.impactCinders.shift();
          const spreadAngle = contactAng + (Math.random() - 0.5) * 1.35;
          const speed = 3.2 + Math.random() * 4.4;
          const tJitter = (Math.random() - 0.5) * 14;
          this.impactCinders.push({
            x: impactWorldX + tangX * tJitter,
            y: impactWorldY + tangY * tJitter,
            vx: Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed,
            size: 2.0 + Math.random() * 2.4,
            isCyanSpark: (k % 4 === 0),
            life: 0,
            maxLife: 20 + Math.random() * 14
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
          // Zero redundant vertical ticks — compact Lichtenberg micro-crown handles Dynamo's wake smoothly!
          return;
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
          const syBot = st.y;
          const syTop = syBot - st.len;
          ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.72})`;
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
  // ─────────────────────────────────────────────────────────────
  // LAYERED 15 CHROME CORE RENDERING & MOTION ENGINE (v393)
  // - Strict Material-Bounded Lighting: zero outer bloom, zero glow halos, zero radial rays, zero background lighting
  // - Tier-Specific Extracted Wing Layers (Tiers II -> V) with hinged flex, inner/outer feather lag, and material speculars
  // - Arc-Length Sampled Orbits in Local Space with Front/Rear Occlusion & Continuous Phase Across Tiers
  // - Single-Transform Upright Double Helix for Helix I-V (zero double images even during crossfades)
  // - Circular Silhouette Mask for Meteor I-V with rotating surface texture, fluctuating lava channels & occasional detaching embers
  // ─────────────────────────────────────────────────────────────

  // Arc-length lookup tables for uniform visual speed along elliptical orbits (rx, ry)
  const _orbitArcTables = {};
  function sampleUniformEllipseAngle(rx, ry, normPhase) {
    const p = ((normPhase % 1.0) + 1.0) % 1.0;
    const ratioKey = Math.round((ry / Math.max(1, rx)) * 1000);
    let table = _orbitArcTables[ratioKey];
    if (!table) {
      const N = 128;
      const cum = new Float32Array(N + 1);
      cum[0] = 0;
      const aspect = ry / Math.max(1, rx);
      let prevX = 1.0, prevY = 0.0;
      for (let i = 1; i <= N; i++) {
        const theta = (i / N) * Math.PI * 2;
        const curX = Math.cos(theta);
        const curY = Math.sin(theta) * aspect;
        cum[i] = cum[i - 1] + Math.hypot(curX - prevX, curY - prevY);
        prevX = curX;
        prevY = curY;
      }
      const total = cum[N] || 1;
      for (let i = 1; i <= N; i++) cum[i] /= total;
      table = cum;
      _orbitArcTables[ratioKey] = table;
    }
    const N = 128;
    let lo = 0, hi = N;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (table[mid] <= p) lo = mid;
      else hi = mid;
    }
    const segSpan = Math.max(1e-6, table[hi] - table[lo]);
    const frac = (p - table[lo]) / segSpan;
    return ((lo + frac) / N) * Math.PI * 2;
  }

  // Reduced-motion media query cache
  const _prefersReducedMotion = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Persistent Meteor Tier II+ free detaching embers (confined to local space, cools and fades cleanly)
  const _meteorDetachedEmbers = [];
  let _lastMeteorEmberSpawn = 0;

  // Offscreen Wing Shimmer Buffer (Guarantees source-atop metallic sheen stays strictly on wing feathers with zero bleed!)
  let _wingShimmerCanvas = null;
  let _wingShimmerCtx = null;

  // ─────────────────────────────────────────────────────────────
  // ARTICULATED KINEMATIC WINGS ENGINE (v352 TOP-TIER FLIGHT & PROPORTIONS RESTORED ONTO THE 15 CHROME CORES)
  // - Recommendation 1: Wing Flap Damping & Convergence Limiter (ramAirFactor, tipInertia, pitchFlapMod, lockLiftAngle)
  // - Recommendation 2: Asymmetric Directional Kinematics (identifies strafe direction; leading wing lifts & glints, trailing drags & tucks)
  // - Recommendation 3: Real-3D Perspective Foreshortening (foreshortenX, pitch3D, breathScale), Windward Specular Glint (spec3D), and Starlight Vein Shimmer
  // - Intact 4K tier-specific feathers (zero-slice seams!) + Brilliant Ultimate Wing Climax Effects
  // ─────────────────────────────────────────────────────────────
  // Pre-baked Inner-Eroded Wing Specular & Dark-Metallic AO Shadow Cache (Guarantees ZERO white edge multiplication!)
  const _wingProcessedCache = {};
  function _getProcessedWingMaps(mode, tIdx, wSpr) {
    const key = `${mode}_${tIdx}`;
    if (_wingProcessedCache[key]) return _wingProcessedCache[key];
    const sw = wSpr.naturalWidth || 512;
    const sh = wSpr.naturalHeight || 576;
    if (sw < 16 || sh < 16) return null;

    // 1. Build Inner-Eroded Specular Sprite (3px inward alpha erosion so additive 'lighter' glints NEVER touch outer edge pixels!)
    const specCanvas = document.createElement('canvas');
    specCanvas.width = sw;
    specCanvas.height = sh;
    const sCtx = specCanvas.getContext('2d');
    if (sCtx) {
      // Intersect 4 diagonal 2.2px-shifted copies using destination-in to erode the alpha silhouette inward by ~2.5px
      sCtx.drawImage(wSpr, 0, 0);
      sCtx.globalCompositeOperation = 'destination-in';
      sCtx.drawImage(wSpr, -2.2, -1.8);
      sCtx.drawImage(wSpr,  2.2, -1.8);
      sCtx.drawImage(wSpr, -2.2,  1.8);
      sCtx.drawImage(wSpr,  2.2,  1.8);
      // Re-draw original RGB colors strictly inside the eroded interior alpha mask
      sCtx.globalCompositeOperation = 'source-in';
      sCtx.drawImage(wSpr, 0, 0);
    }

    // 2. Build Sub-Feather Dark Metallic Ambient Occlusion (AO) Underlap Silhouette
    const aoCanvas = document.createElement('canvas');
    aoCanvas.width = sw;
    aoCanvas.height = sh;
    const aCtx = aoCanvas.getContext('2d');
    if (aCtx) {
      aCtx.drawImage(wSpr, 0, 0);
      aCtx.globalCompositeOperation = 'source-in';
      aCtx.fillStyle = (mode === 'meteor')
        ? 'rgba(18, 7, 2, 0.72)'
        : (mode === 'helix' ? 'rgba(10, 15, 38, 0.70)' : 'rgba(14, 10, 34, 0.72)');
      aCtx.fillRect(0, 0, sw, sh);
    }

    const entry = { specCanvas, aoCanvas };
    _wingProcessedCache[key] = entry;
    return entry;
  }

  function drawArticulatedWings(ctx, mode, u, cySrc, tier, now, isPortalPreview = false) {
    const isUltActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mode);
    const ultNv = isUltActive ? SkillSystem.activeNova : null;
    const ultAlpha = ultNv ? Math.max(0, Math.min(1, ultNv._alphaEnv || 0.92)) : 0;

    // During Ultimate, even Tier I unfurls radiant spectral Archon wings so every Ultimate cast exhibits brilliant wing effects!
    const rawCTier = isPortalPreview ? tier : CoreKinematics.continuousTier;
    const cTier = (isUltActive && rawCTier < 2.0) ? Math.max(rawCTier, 1.0 + 4.0 * ultAlpha) : rawCTier;
    if (cTier <= 1.02 && !isUltActive) return; // Tier I idle has no wings

    // Core visual scale: 1024x576 reference mapped so the central sphere radius (~150px in 1024x576) equals 68 * u
    const coreImgScale = (68.0 / 150.0) * u; // 0.45333 * u
    const wingW = 512 * coreImgScale;
    const wingH = 576 * coreImgScale;
    const pivotY = 288 * coreImgScale;

    // Determine lower and upper wing tiers for coherent upgrade crossfade
    const lowTier = Math.max(2, Math.min(5, Math.floor(cTier)));
    const highTier = Math.max(2, Math.min(5, Math.ceil(cTier)));
    const blendT = (highTier > lowTier) ? Math.max(0, Math.min(1, cTier - lowTier)) : 0;
    const t12Fade = (cTier < 2.0) ? Math.max(0, Math.min(1, Math.pow((cTier - 1.0) / 0.98, 0.75))) : 1.0;

    const motionScale = _prefersReducedMotion ? 0.25 : 1.0;
    const breathPhase = now * 0.0032;

    // Horizontal Strafe Velocity & Ram-Air Aerodynamic Stabilization (v352 Engineering!)
    const vx = isPortalPreview ? 0 : (CoreKinematics.vx || 0);
    const ramAirFactor = 1.0 / (1.0 + 0.12 * Math.abs(vx));

    const tipInertia = isPortalPreview ? 0 : ((CoreKinematics.tipY * 0.0045 - CoreKinematics.bodyBank * 0.10) * ramAirFactor * motionScale);
    const breathOsc = isPortalPreview ? (Math.sin(now * 0.0038) * 0.045) : (Math.sin(breathPhase) * 0.010 * motionScale);
    const lockLiftAngle = isPortalPreview ? 0 : (-CoreKinematics.lockOnProximity * 0.035 * motionScale);
    const ultLiftAngle = isUltActive ? (-0.065 * ultAlpha + Math.sin(now * 0.018) * 0.018 * ultAlpha) : 0;

    const pitchAngle = isPortalPreview ? (Math.sin(now * 0.0022) * 0.025) : ((CoreKinematics.pitchAngle || 0) * motionScale);
    const pitchFlapMod = -pitchAngle * 0.35;
    const rawFlap = tipInertia + breathOsc + lockLiftAngle + pitchFlapMod + ultLiftAngle;
    const clampedFlap = Math.max(-0.085, Math.min(0.12, rawFlap));

    const bankAngle = isPortalPreview ? (Math.sin(now * 0.0019) * 0.030) : (CoreKinematics.bodyBank * 0.32 * motionScale);
    const normVx = Math.max(-1.0, Math.min(1.0, vx / 14.0));

    // Smooth ascension unfurl scale when morphing from Tier I -> Tier II
    const unfurlSpan = (cTier < 2.0) ? (0.68 + 0.32 * (1.0 - Math.pow(1.0 - Math.max(0, cTier - 1.0), 2.0))) : 1.0;
    const unfurlHeight = (cTier < 2.0) ? (0.76 + 0.24 * (1.0 - Math.pow(1.0 - Math.max(0, cTier - 1.0), 2.0))) : 1.0;

    const drawSingleTierWingPair = (tIdx, alphaVal) => {
      if (alphaVal <= 0.01) return;
      const wSpr = (LayeredT4Assets.wingRightTiers[mode] && LayeredT4Assets.wingRightTiers[mode][tIdx]) || LayeredT4Assets.wingRight[mode];
      const wLoaded = (LayeredT4Assets.loaded.wingRightTiers[mode] && LayeredT4Assets.loaded.wingRightTiers[mode][tIdx]) || LayeredT4Assets.loaded.wingRight[mode];
      if (!wSpr || !wLoaded) return;

      const pMaps = _getProcessedWingMaps(mode, tIdx, wSpr);
      const specSpr = (pMaps && pMaps.specCanvas) ? pMaps.specCanvas : wSpr;
      const aoSpr = (pMaps && pMaps.aoCanvas) ? pMaps.aoCanvas : null;

      const tierLux = (tIdx === 2) ? 0.38 : (tIdx === 3 ? 0.62 : (tIdx === 4 ? 0.88 : 1.16));

      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const dir = (sideIdx === 0) ? 1 : -1; // +1 Right wing, -1 Left wing
        // === CHANGED (v402): Hinge-locked wing pivot strictly inside sphere rim so wings NEVER detach under flap/foreshortening ===
        const hingeX = CORE_GEOMETRY_DB.hingeXRef * coreImgScale;
        const rootInsetX = 0;

        // ASYMMETRIC DIRECTIONAL KINEMATICS (Left vs Right)
        const dirLead = dir * normVx;
        const leadLift = Math.max(0, dirLead) * 0.065;
        const trailSweep = Math.min(0, dirLead) * 0.050;
        const asymmetricTilt = leadLift + trailSweep;

        const totalRotation = dir * clampedFlap + asymmetricTilt + dir * pitchAngle * 0.15;

        // 3D Perspective Foreshortening & Asymmetric Span Modulation (v352 Real-3D Flight Physics!)
        const spanModifier = 1.0 + dirLead * 0.07 + (isUltActive ? 0.045 * ultAlpha : 0);
        const foreshortenX = (1.0 - dir * Math.sin(bankAngle) * 0.15) * Math.max(0.85, Math.min(1.12, spanModifier)) * unfurlSpan;
        const pitch3D = Math.max(0.78, Math.cos(totalRotation * 0.48)) * unfurlHeight;
        const breathScale = 1.0 + Math.sin(breathPhase + sideIdx * 0.4) * 0.012;

        // Z-Depth Lighting & Ambient Slipstream Shadow:
        const slipstreamAlpha = (dirLead < 0) ? (1.0 + dirLead * 0.10) : 1.0;
        const finalWingAlpha = Math.max(0, Math.min(1, alphaVal * slipstreamAlpha));

        ctx.save();
        ctx.translate(dir * hingeX, 0);
        ctx.rotate(totalRotation);
        ctx.scale(dir * breathScale * foreshortenX, breathScale * pitch3D);
        ctx.translate(-hingeX, 0);

        // ENHANCEMENT #3: Sub-Feather Depth Layering & Ambient Occlusion (AO) Shadow Underlap
        if (aoSpr && tIdx >= 3) {
          ctx.save();
          ctx.globalAlpha = finalWingAlpha * (0.48 + tierLux * 0.22);
          ctx.drawImage(aoSpr, rootInsetX + 1.8 * u, -pivotY + 2.8 * u, wingW * 0.99, wingH * 1.01);
          ctx.restore();
        }

        // ENHANCEMENT #1: Draw the Chromatically Defringed 4K Tier-Specific Wing Sprite
        ctx.globalAlpha = finalWingAlpha;
        ctx.drawImage(wSpr, rootInsetX, -pivotY, wingW, wingH);

        // ENHANCEMENT #2 (v401 Glow Reduced): Subtle 3D Windward Specular Glint (keeps feather detail razor-sharp!)
        const lightDot = Math.cos(totalRotation * 1.3 - dir * 0.20 + dirLead * 0.35);
        const specMultiplier = 1.0 + Math.max(0, dirLead) * 0.50 + (isUltActive ? 0.65 * ultAlpha : 0);
        const spec3D = Math.pow(Math.max(0, lightDot), 2.4) * specMultiplier;
        if (spec3D > 0.14) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(isUltActive ? 0.36 : 0.16, spec3D * (isUltActive ? 0.26 : 0.12) * finalWingAlpha);
          ctx.drawImage(specSpr, rootInsetX, -pivotY, wingW, wingH);
          ctx.restore();
        }

        // Subtle Sovereign Shimmer ONLY during active Ultimate
        if (isUltActive) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const shimmerWave = 0.5 + 0.5 * Math.sin(now * 0.014 - sideIdx * 1.2);
          ctx.globalAlpha = Math.min(0.28, 0.28 * ultAlpha * shimmerWave * finalWingAlpha);
          ctx.drawImage(specSpr, rootInsetX, -pivotY, wingW, wingH);
          ctx.restore();
        }

        // === CHANGED (v402): Unified exact wingspan bounds matching core-geometry-db.json (256 / 336 / 416 / 496) ===
        const maxSpanX = (tIdx === 2 ? 256 : (tIdx === 3 ? 336 : (tIdx === 4 ? 416 : 496))) * coreImgScale;

        // ENHANCEMENT #5 (v401 Glow Removed in Normal Flight): Only during active Ultimate at mild alpha
        if (isUltActive && ultAlpha > 0.04) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const rimReachX = 210 * coreImgScale;
          const rimPulse = 0.78 + 0.22 * Math.sin(now * 0.016 + sideIdx);
          const rimAlpha = Math.min(0.28, 0.26 * ultAlpha * rimPulse * finalWingAlpha);
          const rimG = ctx.createRadialGradient(164 * coreImgScale, 0, 8 * coreImgScale, 168 * coreImgScale, -4 * coreImgScale, rimReachX);
          if (mode === 'dynamo') {
            rimG.addColorStop(0.0, `rgba(253, 224, 71, ${rimAlpha})`);
            rimG.addColorStop(0.45, `rgba(56, 189, 248, ${rimAlpha * 0.65})`);
            rimG.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
          } else if (mode === 'helix') {
            rimG.addColorStop(0.0, `rgba(103, 232, 249, ${rimAlpha})`);
            rimG.addColorStop(0.48, `rgba(236, 72, 153, ${rimAlpha * 0.65})`);
            rimG.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
          } else {
            rimG.addColorStop(0.0, `rgba(254, 240, 138, ${rimAlpha})`);
            rimG.addColorStop(0.45, `rgba(249, 115, 22, ${rimAlpha * 0.78})`);
            rimG.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
          }
          ctx.fillStyle = rimG;
          ctx.beginPath();
          ctx.ellipse(168 * coreImgScale, -4 * coreImgScale, rimReachX, rimReachX * 0.56, -0.18, -Math.PI * 0.42, Math.PI * 0.42);
          ctx.fill();
          ctx.restore();
        }

        // 4. Subtle Diamond Specular Micro-Glints (toned down in v401)
        const numSparkles = isUltActive ? 6 : ((tIdx === 2) ? 1 : (tIdx === 3 ? 2 : (tIdx === 4 ? 3 : 4)));
        for (let sp = 0; sp < numSparkles; sp++) {
          const spFrac = (sp + 0.5) / numSparkles;
          const spPulse = Math.pow(Math.max(0, Math.sin(now * (isUltActive ? 0.0085 : 0.0042) + sp * 1.95 + sideIdx * 1.3)), 3.2);
          if (spPulse > 0.16) {
            const sx = 166 * coreImgScale + spFrac * Math.max(20 * coreImgScale, maxSpanX - 166 * coreImgScale);
            const sy = (-10 - Math.sin(spFrac * Math.PI) * (tIdx >= 4 ? 42 : 24) + (sp % 2 === 0 ? -8 : 10)) * coreImgScale;
            const sr = (1.1 + tierLux * 0.95) * u * spPulse * (isUltActive ? 1.45 : 1.0);
            const sAlpha = Math.min(isUltActive ? 0.72 : 0.36, spPulse * (0.24 + tierLux * 0.22) * finalWingAlpha);

            ctx.fillStyle = (mode === 'meteor')
              ? `rgba(254, 240, 138, ${sAlpha})`
              : (mode === 'helix'
                ? (sp % 2 === 0 ? `rgba(165, 243, 252, ${sAlpha})` : `rgba(245, 208, 254, ${sAlpha})`)
                : (sp % 2 === 0 ? `rgba(224, 242, 254, ${sAlpha})` : `rgba(254, 240, 138, ${sAlpha})`));
            ctx.beginPath();
            ctx.moveTo(sx, sy - sr * 2.15);
            ctx.lineTo(sx + sr * 0.65, sy);
            ctx.lineTo(sx, sy + sr * 2.15);
            ctx.lineTo(sx - sr * 0.65, sy);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(sx - sr * 2.15, sy);
            ctx.lineTo(sx, sy - sr * 0.55);
            ctx.lineTo(sx + sr * 2.15, sy);
            ctx.lineTo(sx, sy + sr * 0.55);
            ctx.closePath();
            ctx.fill();
          }
        }

        // 5. Mode-Specific Live Feather Conduits (v402 Unified Span + Reduced Glare)
        ctx.lineCap = 'round';
        const unifiedConduitSpan = (tIdx === 2 ? 96 : (tIdx === 3 ? 176 : (tIdx === 4 ? 256 : 336))) * coreImgScale;
        const conduitStartX = 162 * coreImgScale;
        if (mode === 'dynamo') {
          if (tIdx >= 3 || isUltActive) {
            const numCurrents = isUltActive ? 4 : ((tIdx === 3) ? 1 : (tIdx === 4 ? 2 : 3));
            for (let cI = 0; cI < numCurrents; cI++) {
              const curPhase = ((now * (isUltActive ? 0.0032 : 0.0013) + sideIdx * 0.15 + cI * 0.25) % 1.0);
              const curX = conduitStartX + curPhase * unifiedConduitSpan;
              const curY = (-10 - curPhase * (28 + cI * 11) + (cI - 1) * 13) * coreImgScale;
              const curAlpha = Math.sin(curPhase * Math.PI) * (isUltActive ? 0.85 : (0.28 + tierLux * 0.18)) * finalWingAlpha;
              if (curAlpha > 0.02) {
                ctx.strokeStyle = (cI % 2 === 1 && (tIdx === 5 || isUltActive))
                  ? `rgba(253, 224, 71, ${curAlpha})`
                  : (isUltActive ? `rgba(224, 242, 254, ${curAlpha})` : `rgba(125, 211, 252, ${curAlpha})`);
                ctx.lineWidth = (isUltActive ? 2.2 : 1.35) * u;
                ctx.beginPath();
                ctx.moveTo(curX - 18 * coreImgScale, curY + 5 * coreImgScale);
                ctx.lineTo(curX - 6 * coreImgScale, curY - 4 * coreImgScale);
                ctx.lineTo(curX + 6 * coreImgScale, curY + 3 * coreImgScale);
                ctx.lineTo(curX + 20 * coreImgScale, curY - 6 * coreImgScale);
                ctx.stroke();
              }
            }
          }
        } else if (mode === 'helix') {
          const numRibbons = isUltActive ? 4 : ((tIdx === 2) ? 1 : (tIdx <= 4 ? 2 : 3));
          for (let rI = 0; rI < numRibbons; rI++) {
            const glintProg = ((now * (isUltActive ? 0.0028 : 0.0011) + sideIdx * 0.22 + rI * (1 / numRibbons)) % 1.0);
            const gx = conduitStartX + glintProg * unifiedConduitSpan;
            const gy = (-8 - glintProg * (24 + rI * 10) + (rI - 0.5) * 14) * coreImgScale;
            const ga = Math.sin(glintProg * Math.PI) * (isUltActive ? 0.85 : (0.26 + tierLux * 0.18)) * finalWingAlpha;
            if (ga > 0.02) {
              ctx.strokeStyle = (rI % 2 === 0) ? `rgba(103, 232, 249, ${ga})` : `rgba(244, 114, 182, ${ga})`;
              ctx.lineWidth = (isUltActive ? 2.1 : 1.35) * u;
              ctx.beginPath();
              ctx.moveTo(gx - 17 * coreImgScale, gy + 5 * coreImgScale);
              ctx.quadraticCurveTo(gx, gy - 3 * coreImgScale, gx + 17 * coreImgScale, gy - 6 * coreImgScale);
              ctx.stroke();
            }
          }
        } else if (mode === 'meteor') {
          const numThermal = isUltActive ? 5 : ((tIdx === 2) ? 1 : (tIdx === 3 ? 2 : (tIdx === 4 ? 3 : 4)));
          for (let th = 0; th < numThermal; th++) {
            const thProg = ((now * (isUltActive ? 0.0026 : 0.0010) + sideIdx * 0.18 + th * (1 / numThermal)) % 1.0);
            const tx = conduitStartX + thProg * unifiedConduitSpan;
            const ty = (-6 - thProg * (26 + th * 8) + (th - 1) * 13) * coreImgScale;
            const ta = Math.sin(thProg * Math.PI) * (isUltActive ? 0.85 : (0.26 + tierLux * 0.18)) * finalWingAlpha;
            if (ta > 0.02) {
              ctx.strokeStyle = (th % 2 === 0) ? `rgba(254, 240, 138, ${ta})` : `rgba(251, 146, 60, ${ta})`;
              ctx.lineWidth = (isUltActive ? 2.2 : 1.35) * u;
              ctx.beginPath();
              ctx.moveTo(tx - 18 * coreImgScale, ty + 4 * coreImgScale);
              ctx.quadraticCurveTo(tx, ty - 3 * coreImgScale, tx + 18 * coreImgScale, ty - 7 * coreImgScale);
              ctx.stroke();
            }
          }
        }

        // 6. BRILLIANT ULTIMATE WING CLIMAX EFFECTS (Active when pressing [D] / Ultimate button!)
        if (isUltActive && ultAlpha > 0.02) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const uA = ultAlpha * finalWingAlpha;

          if (mode === 'dynamo') {
            // ⚡ DYNAMO STORM NOVA WING OVERCHARGE: Branching Tesla lightning arcs across primary feathers + corona tips
            for (let aI = 0; aI < 3; aI++) {
              const segs = 7;
              const startX = 68 * coreImgScale;
              const startY = (-4 + (aI - 1) * 14) * coreImgScale;
              const endX = maxSpanX * (0.78 + aI * 0.11);
              const endY = (-36 - aI * 22) * coreImgScale;

              ctx.beginPath();
              ctx.moveTo(startX, startY);
              for (let s = 1; s <= segs; s++) {
                const f = s / segs;
                const jit = (s === segs) ? 0 : Math.sin(now * 0.065 + s * 3.7 + aI * 2.3 + sideIdx * 4.1) * (10 + f * 8) * coreImgScale;
                const px = startX + (endX - startX) * f;
                const py = startY + (endY - startY) * f - Math.sin(f * Math.PI) * 18 * coreImgScale + jit;
                ctx.lineTo(px, py);
              }
              ctx.strokeStyle = (aI === 1) ? `rgba(250, 204, 21, ${0.85 * uA})` : `rgba(56, 189, 248, ${0.88 * uA})`;
              ctx.lineWidth = 3.4 * u;
              ctx.stroke();

              ctx.strokeStyle = `rgba(255, 255, 255, ${0.96 * uA})`;
              ctx.lineWidth = 1.35 * u;
              ctx.stroke();

              const tipPulse = 0.6 + 0.4 * Math.sin(now * 0.04 + aI * 2.1 + sideIdx);
              const tipR = (3.8 + aI * 0.8) * u * tipPulse;
              ctx.fillStyle = (aI === 1) ? `rgba(254, 240, 138, ${0.95 * uA})` : `rgba(224, 242, 254, ${0.95 * uA})`;
              ctx.beginPath();
              ctx.arc(endX, endY, tipR, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (mode === 'helix') {
            // 🧬 HELIX GENESIS NOVA WING OVERCHARGE: Double-helix light ribbons + ascending diamond shards
            const steps = 16;
            const startX = 68 * coreImgScale;
            const endX = maxSpanX * 0.98;
            for (let strand = 0; strand < 2; strand++) {
              const sSign = (strand === 0) ? 1 : -1;
              ctx.beginPath();
              for (let s = 0; s <= steps; s++) {
                const f = s / steps;
                const px = startX + (endX - startX) * f;
                const baseArcY = (-12 - Math.sin(f * Math.PI * 0.85) * 44) * coreImgScale;
                const waveY = Math.sin(f * Math.PI * 3.5 - now * 0.018 + sideIdx) * 14 * coreImgScale * sSign;
                const py = baseArcY + waveY;
                if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
              }
              ctx.strokeStyle = (strand === 0) ? `rgba(34, 211, 238, ${0.90 * uA})` : `rgba(236, 72, 153, ${0.90 * uA})`;
              ctx.lineWidth = 2.8 * u;
              ctx.stroke();

              ctx.strokeStyle = `rgba(255, 255, 255, ${0.88 * uA})`;
              ctx.lineWidth = 1.1 * u;
              ctx.stroke();
            }

            for (let pf = 0; pf < 5; pf++) {
              const pfProg = ((now * 0.0032 + pf * 0.20 + sideIdx * 0.15) % 1.0);
              const fFrac = 0.25 + (pf / 4) * 0.72;
              const fx = startX + (endX - startX) * fFrac + pfProg * 14 * coreImgScale;
              const fy = (-22 - Math.sin(fFrac * Math.PI) * 38 - pfProg * 52) * coreImgScale;
              const fa = Math.sin(pfProg * Math.PI) * 0.95 * uA;
              const fr = (3.4 + (1.0 - pfProg) * 2.6) * u;
              ctx.fillStyle = (pf % 2 === 0) ? `rgba(165, 243, 252, ${fa})` : `rgba(245, 208, 254, ${fa})`;
              ctx.beginPath();
              ctx.moveTo(fx, fy - fr * 1.9);
              ctx.lineTo(fx + fr * 0.75, fy);
              ctx.lineTo(fx, fy + fr * 1.9);
              ctx.lineTo(fx - fr * 0.75, fy);
              ctx.closePath();
              ctx.fill();
            }
          } else {
            // 🌋 METEOR CALDERA NOVA WING OVERCHARGE: Solar magma veins + licking solar prominence flame tongues
            const startX = 68 * coreImgScale;
            const endX = maxSpanX * 0.98;
            for (let vI = 0; vI < 4; vI++) {
              const vFrac = (vI + 0.3) / 4;
              const vx1 = startX + (endX - startX) * (0.55 + vFrac * 0.45);
              const vy0 = (-4 + (vI - 1.5) * 11) * coreImgScale;
              const vyPeak = vy0 - (24 + vI * 11) * coreImgScale;
              const vy1 = vyPeak + (4 + vI * 5) * coreImgScale;

              ctx.strokeStyle = `rgba(249, 115, 22, ${0.88 * uA})`;
              ctx.lineWidth = 3.8 * u;
              ctx.beginPath();
              ctx.moveTo(startX, vy0);
              ctx.quadraticCurveTo((startX + vx1) * 0.5, vyPeak, vx1, vy1);
              ctx.stroke();

              ctx.strokeStyle = `rgba(254, 249, 195, ${0.96 * uA})`;
              ctx.lineWidth = 1.5 * u;
              ctx.stroke();
            }

            for (let fl = 0; fl < 5; fl++) {
              const flProg = ((now * 0.0036 + fl * 0.20 + sideIdx * 0.13) % 1.0);
              const fFrac = 0.22 + (fl / 4) * 0.74;
              const fx0 = startX + (endX - startX) * fFrac;
              const fy0 = (-18 - Math.sin(fFrac * Math.PI) * 34) * coreImgScale;
              const sway = Math.sin(now * 0.024 + fl * 1.7 + sideIdx) * 12 * coreImgScale;
              const fx1 = fx0 + sway;
              const fy1 = fy0 - (22 + flProg * 54) * coreImgScale;
              const fa = Math.sin(flProg * Math.PI) * 0.92 * uA;

              ctx.strokeStyle = (fl % 2 === 0) ? `rgba(254, 240, 138, ${fa})` : `rgba(251, 146, 60, ${fa})`;
              ctx.lineWidth = (2.8 * (1.0 - flProg * 0.55)) * u;
              ctx.beginPath();
              ctx.moveTo(fx0, fy0);
              ctx.quadraticCurveTo(fx0 - sway * 0.5, (fy0 + fy1) * 0.5, fx1, fy1);
              ctx.stroke();

              ctx.fillStyle = `rgba(255, 251, 235, ${fa})`;
              ctx.beginPath();
              ctx.arc(fx1, fy1, Math.max(1.2, 2.2 * (1.0 - flProg * 0.4) * u), 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.restore();
        }

        ctx.restore();
      }
    };

    if (cTier < 2.0) {
      drawSingleTierWingPair(2, t12Fade);
    } else if (highTier === lowTier || blendT <= 0.01) {
      drawSingleTierWingPair(lowTier, 1.0);
    } else {
      drawSingleTierWingPair(lowTier, 1.0 - blendT);
      drawSingleTierWingPair(highTier, blendT);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DYNAMO ORBITS (Tiers III, IV, V — Sharp, dim, unblurred lines & discrete charge particles with ZERO glow!)
  // Tier I & II: NO orbit
  // Tier III: 1 cyan orbital track + 1 small charge moving along the fixed track
  // Tier IV & V: 2 fixed, tilted tracks (1 cyan + 1 gold), each carrying a charge on its own smooth phase with front/back occlusion
  // ─────────────────────────────────────────────────────────────
  const DYNAMO_ORBIT_TRACKS = [
    { tilt: -0.38, rx: 94, ry: 32, speed:  0.00052, phase0: 0.15, isGold: false }, // Track 1: Cyan (Tiers III, IV, V)
    { tilt:  0.42, rx: 98, ry: 34, speed: -0.00046, phase0: 0.62, isGold: true  }  // Track 2: Gold (Tiers IV, V)
  ];

  function drawDynamoRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4, cTier = null) {
    const effTier = cTier !== null ? cTier : tierIdx;
    if (effTier <= 2.02) return; // Tiers I & II have no orbit!

    ctx.save();
    const numTracks = (effTier < 3.05) ? 1 : 2;

    for (let rIdx = 0; rIdx < numTracks; rIdx++) {
      const cfg = DYNAMO_ORBIT_TRACKS[rIdx];
      let trackAlpha = 1.0;
      if (rIdx === 0 && effTier < 3.0) trackAlpha = Math.max(0, Math.min(1, effTier - 2.0));
      if (rIdx === 1 && effTier < 4.0) trackAlpha = Math.max(0, Math.min(1, effTier - 3.0));
      if (trackAlpha <= 0.01) continue;

      const rx = cfg.rx * u;
      const ry = cfg.ry * u;

      ctx.save();
      ctx.rotate(cfg.tilt);

      // Sharp, dim, unblurred orbital track line split at the sphere horizon (sin(a) >= 0 is Front, sin(a) < 0 is Rear)
      const startA = drawFrontHalf ? 0 : Math.PI;
      const endA = drawFrontHalf ? Math.PI : Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, startA, endA);
      const lineAlpha = (drawFrontHalf ? 0.52 : 0.24) * trackAlpha;
      ctx.lineWidth = Math.max(1.0, 1.35 * u);
      ctx.strokeStyle = cfg.isGold
        ? `rgba(234, 179, 8, ${lineAlpha})`
        : `rgba(34, 211, 238, ${lineAlpha})`;
      ctx.stroke();

      // Discrete charge carrier moving with uniform arc-length visual speed (continuous phase from render clock)
      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const rawPhase = now * cfg.speed * motionMult + cfg.phase0;
      const eAngle = sampleUniformEllipseAngle(rx, ry, rawPhase);
      const ez = Math.sin(eAngle);
      const eIsFront = (ez >= 0);

      if (eIsFront === drawFrontHalf) {
        const ex = Math.cos(eAngle) * rx;
        const ey = Math.sin(eAngle) * ry;
        const chargeR = Math.max(1.6, (drawFrontHalf ? 2.6 : 2.0) * u);

        // Short crisp wake along recent track path (strictly unblurred line segments)
        const dirSign = cfg.speed >= 0 ? -1 : 1;
        ctx.beginPath();
        for (let w = 0; w <= 5; w++) {
          const wa = eAngle + dirSign * (w * 0.055);
          const wx = Math.cos(wa) * rx;
          const wy = Math.sin(wa) * ry;
          if (w === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.strokeStyle = cfg.isGold
          ? `rgba(253, 224, 71, ${0.55 * trackAlpha})`
          : `rgba(125, 211, 252, ${0.55 * trackAlpha})`;
        ctx.lineWidth = Math.max(1.0, 1.3 * u);
        ctx.stroke();

        // Crisp discrete charge particle (outer rim + solid bright center, ZERO radial gradient halo!)
        ctx.fillStyle = cfg.isGold
          ? `rgba(245, 158, 11, ${0.95 * trackAlpha})`
          : `rgba(56, 189, 248, ${0.95 * trackAlpha})`;
        ctx.beginPath();
        ctx.arc(ex, ey, chargeR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * trackAlpha})`;
        ctx.beginPath();
        ctx.arc(ex, ey, chargeR * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  function pseudoSin(seed) {
    return Math.sin(seed * 12.9898 + Math.cos(seed * 4.1414) * 3.1);
  }

  // ─────────────────────────────────────────────────────────────
  // DYNAMO INTERNAL DISCHARGE FILAMENTS (Strictly confined inside the glass sphere boundary!)
  // - Tier I: Few fine blue-white discharge filaments that grow, fork, and decay in brief irregular bursts
  // - Tier II: Increased violet branching
  // - Tier III & IV: Deeper violet plasma & branching filaments
  // - Tier V: Bright violet-white center point surrounded by fine branching plasma (+ stronger internal arcs during ultimate)
  // - Stable surface reflection relative to light
  // ─────────────────────────────────────────────────────────────
  function drawInternalPlasmaArcs(ctx, cx, cy, maxR, now, phaseOffset, isCore = false, tierIdx = 4) {
    ctx.save();
    ctx.translate(cx, cy);

    // Strictly clip all internal plasma light inside the smoky violet glass sphere boundary!
    ctx.beginPath();
    ctx.arc(0, 0, maxR * 0.96, 0, Math.PI * 2);
    ctx.clip();

    const isUltActive = Boolean(isCore && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === 'dynamo');
    const motionMult = _prefersReducedMotion ? 0.25 : 1.0;

    // Tier-progressive filament count
    const numArcs = isCore
      ? (tierIdx === 1 ? 4 : (tierIdx === 2 ? 6 : (tierIdx === 3 ? 7 : (tierIdx === 4 ? 8 : 10)))) + (isUltActive ? 4 : 0)
      : 3;

    ctx.globalCompositeOperation = 'lighter';

    // Volumetric shifting plasma nebula clouds swirling inside the smoky violet glass globe (pre-baked GPU blits!)
    const nebAng = now * 0.0009 * motionMult + phaseOffset;
    const nebIntensity = Math.min(0.45, (0.18 + (tierIdx - 1) * 0.05) * (isUltActive ? 1.5 : 1.0));
    for (let n = 0; n < (isCore ? 2 : 1); n++) {
      const na = nebAng * (n === 0 ? 1 : -1.3) + n * Math.PI;
      const nx = Math.cos(na) * maxR * 0.24;
      const ny = Math.sin(na) * maxR * 0.24;
      const nr = maxR * (0.72 + 0.10 * Math.sin(now * 0.004 + n));
      ctx.globalAlpha = nebIntensity;
      ctx.drawImage(QuantumRenderer._getGlowSprite(n === 0 ? 'indigo' : 'cyan'), nx - nr, ny - nr, nr * 2, nr * 2);
    }
    ctx.globalAlpha = 1.0;

    const segs = isCore ? 6 : 4;
    for (let a = 0; a < numArcs; a++) {
      const cycleDuration = (isUltActive ? 220 : 340) + (a * 73) % 190;
      const localTime = (now * motionMult + phaseOffset * 420 + a * 211);
      const cycleIdx = Math.floor(localTime / cycleDuration);
      const cycleProg = (localTime % cycleDuration) / cycleDuration;

      // Brief irregular burst envelope: rapid growth (0..0.28), fork (0.18..0.75), and decay (0.75..1.0)
      const burstSeed = Math.abs(pseudoSin(cycleIdx * 13 + a * 29));
      if (tierIdx === 1 && burstSeed < 0.25) continue;

      const reachFrac = Math.min(1.0, cycleProg / 0.28);
      const fadeAlpha = Math.sin(cycleProg * Math.PI);
      if (fadeAlpha <= 0.04) continue;

      const baseAng = (a / numArcs) * Math.PI * 2 + pseudoSin(cycleIdx * 7 + a * 19) * 0.55;
      let forkX = 0, forkY = 0;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let s = 1; s <= segs; s++) {
        const frac = (s / segs) * reachFrac;
        const rDist = frac * maxR * 0.90;
        const jitter = pseudoSin(cycleIdx * 17 + a * 31 + s * 11) * (0.28 * (1 - frac * 0.3));
        const sx = Math.cos(baseAng + jitter) * rDist;
        const sy = Math.sin(baseAng + jitter) * rDist;
        ctx.lineTo(sx, sy);
        if (isCore && s === 3) {
          forkX = sx;
          forkY = sy;
        }
      }

      // Tier I features fine blue-white discharge filaments; Tiers II-V increase violet & icy-blue branching
      const isBlueWhite = (tierIdx === 1) ? (a % 2 === 0) : (a % 3 === 0);
      ctx.strokeStyle = isBlueWhite
        ? `rgba(224, 242, 254, ${(isUltActive ? 0.95 : 0.85) * fadeAlpha})`
        : `rgba(216, 180, 254, ${(isUltActive ? 0.92 : 0.80) * fadeAlpha})`;
      ctx.lineWidth = Math.max(0.85, maxR * (isUltActive ? 0.032 : 0.024));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Forking secondary sub-branches (core only for fast falling nodes!)
      if (isCore && cycleProg > 0.18 && reachFrac > 0.55) {
        const bAng = baseAng + (a % 2 === 0 ? 0.48 : -0.48);
        const bLen = maxR * (tierIdx >= 2 ? 0.42 : 0.30) * Math.min(1.0, (cycleProg - 0.18) / 0.35);
        const bMidX = forkX + Math.cos(bAng + 0.18) * (bLen * 0.52);
        const bMidY = forkY + Math.sin(bAng + 0.18) * (bLen * 0.52);
        const bEndX = forkX + Math.cos(bAng - 0.14) * bLen;
        const bEndY = forkY + Math.sin(bAng - 0.14) * bLen;

        ctx.beginPath();
        ctx.moveTo(forkX, forkY);
        ctx.lineTo(bMidX, bMidY);
        ctx.lineTo(bEndX, bEndY);
        ctx.strokeStyle = isBlueWhite
          ? `rgba(186, 230, 253, ${0.82 * fadeAlpha})`
          : `rgba(192, 132, 252, ${0.82 * fadeAlpha})`;
        ctx.lineWidth = Math.max(0.75, maxR * 0.018);
        ctx.stroke();

        // Sparking electrode contact node where the plasma branch touches the inner glass wall
        if (reachFrac > 0.85) {
          const tipX = Math.cos(baseAng) * maxR * 0.88;
          const tipY = Math.sin(baseAng) * maxR * 0.88;
          ctx.fillStyle = isBlueWhite ? `rgba(224, 242, 254, ${0.9 * fadeAlpha})` : `rgba(240, 171, 252, ${0.9 * fadeAlpha})`;
          ctx.beginPath();
          ctx.arc(tipX, tipY, Math.max(1.2, maxR * 0.032), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Pulsating high-voltage central singularity core inside the glass (GPU blit!)
    const corePulse = 0.82 + 0.18 * Math.sin(now * 0.014);
    const haloR = maxR * (0.26 + (tierIdx - 1) * 0.035) * corePulse * (isUltActive ? 1.3 : 1.0);
    ctx.globalAlpha = 0.92;
    ctx.drawImage(QuantumRenderer._getGlowSprite('magPt'), -haloR, -haloR, haloR * 2, haloR * 2);
    ctx.globalAlpha = 1.0;

    const ptR = Math.max(2.0, maxR * (tierIdx === 5 ? 0.095 : 0.068) * corePulse);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, ptR, 0, Math.PI * 2);
    ctx.fill();

    // Stable surface reflection relative to the top-left studio light source
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = Math.max(1.1, maxR * 0.032);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, maxR * 0.84, -Math.PI * 0.82, -Math.PI * 0.58);
    ctx.stroke();

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // HELIX ORBIT & PEARL (Tiers III, IV, V — Sharp, thin, steady cyan orbit & single occluded pearl!)
  // - Tier I & II: NO orbit
  // - Tier III: 1 thin, steady cyan orbit (no pearl yet)
  // - Tier IV & V: 1 thin, steady cyan orbit + 1 pearl moving along the fixed cyan orbit, partly occluded behind the core
  // ─────────────────────────────────────────────────────────────
  const HELIX_SINGLE_ORBIT = {
    tilt: -0.32,
    rx: 92,
    ry: 30,
    speed: 0.00044,
    phase0: 0.25
  };

  function drawHelixOrbitalRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4, cTier = null) {
    const effTier = cTier !== null ? cTier : tierIdx;
    if (effTier <= 2.02) return; // Tiers I & II have no orbit!

    const trackAlpha = (effTier < 3.0) ? Math.max(0, Math.min(1, effTier - 2.0)) : 1.0;
    if (trackAlpha <= 0.01) return;

    const rx = HELIX_SINGLE_ORBIT.rx * u;
    const ry = HELIX_SINGLE_ORBIT.ry * u;

    ctx.save();
    ctx.rotate(HELIX_SINGLE_ORBIT.tilt);

    // 1. One thin, steady cyan orbital track split into Rear (sin < 0) and Front (sin >= 0) passes
    const startA = drawFrontHalf ? 0 : Math.PI;
    const endA = drawFrontHalf ? Math.PI : Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, startA, endA);
    const lineAlpha = (drawFrontHalf ? 0.54 : 0.24) * trackAlpha;
    ctx.strokeStyle = `rgba(34, 211, 238, ${lineAlpha})`;
    ctx.lineWidth = Math.max(1.0, 1.3 * u);
    ctx.stroke();

    // 2. In Tiers IV & V: One pearl moving smoothly along the fixed cyan orbit (with arc-length uniform speed & core occlusion)
    if (effTier > 3.02) {
      const pearlAlpha = (effTier < 4.0) ? Math.max(0, Math.min(1, effTier - 3.0)) : 1.0;
      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const rawPhase = now * HELIX_SINGLE_ORBIT.speed * motionMult + HELIX_SINGLE_ORBIT.phase0;
      const pAngle = sampleUniformEllipseAngle(rx, ry, rawPhase);
      const pz = Math.sin(pAngle);
      const pIsFront = (pz >= 0);

      if (pIsFront === drawFrontHalf) {
        const px = Math.cos(pAngle) * rx;
        const py = Math.sin(pAngle) * ry;
        const pearlR = Math.max(2.2, (drawFrontHalf ? 3.6 : 2.8) * u);

        // Subtle crisp trail arc along the orbit behind the pearl
        ctx.beginPath();
        for (let w = 0; w <= 5; w++) {
          const wa = pAngle - w * 0.05;
          const wx = Math.cos(wa) * rx;
          const wy = Math.sin(wa) * ry;
          if (w === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.48 * pearlAlpha})`;
        ctx.lineWidth = Math.max(0.9, 1.15 * u);
        ctx.stroke();

        // Crisp shaded pearl body (no external glow halo!)
        ctx.fillStyle = `rgba(14, 116, 144, ${0.95 * pearlAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pearlR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(165, 243, 252, ${0.96 * pearlAlpha})`;
        ctx.beginPath();
        ctx.arc(px - pearlR * 0.18, py - pearlR * 0.18, pearlR * 0.72, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * pearlAlpha})`;
        ctx.beginPath();
        ctx.arc(px - pearlR * 0.30, py - pearlR * 0.30, pearlR * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // HELIX SINGLE UPRIGHT DOUBLE HELIX (One shared transform across all tiers & crossfades!)
  // - Upright cyan-magenta double helix rotating slowly together with its rungs around one vertical axis
  // - Glass highlights shift independently
  // - Zero second double helix, zero outer glow halo
  // ─────────────────────────────────────────────────────────────
  function drawRotating3DDNAInsideGlass(ctx, cx, cy, radiusX, radiusY, now, phaseOffset, isCore = false, tierIdx = 4) {
    ctx.save();
    ctx.translate(cx, cy);

    const clipR = Math.max(radiusX, radiusY) * 0.98;
    if (isCore) {
      ctx.beginPath();
      ctx.arc(0, 0, clipR, 0, Math.PI * 2);
      ctx.clip();
    }

    const isUltActive = Boolean(isCore && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === 'helix');
    const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
    // Both strands and their rungs rotate together slowly around one vertical axis
    const rotPhase = now * (isCore ? 0.0018 : 0.0028) * motionMult + phaseOffset;

    const numRungs = isCore ? 8 : 5;
    const strandSteps = isCore ? 26 : 12;
    const twistFactor = 3.25; // Matches the upright 1.5-turn double helix in the reference PNGs
    const strandA = [];
    const strandB = [];

    for (let i = 0; i <= strandSteps; i++) {
      const t = i / strandSteps;
      const yNorm = -0.84 + t * 1.68;
      const yPx = yNorm * radiusY;
      const env = Math.sqrt(Math.max(0.18, 1.0 - yNorm * yNorm * 0.72));
      const ampX = radiusX * env;

      const theta = yNorm * twistFactor - rotPhase;
      const xA = Math.sin(theta) * ampX;
      const zA = Math.cos(theta);
      const xB = Math.sin(theta + Math.PI) * ampX;
      const zB = -zA;

      strandA.push({ x: xA, y: yPx, z: zA, yNorm });
      strandB.push({ x: xB, y: yPx, z: zB, yNorm });
    }

    const scaleK = radiusY / 48.0;
    const drawStrandPass = (pts, isCyan, frontPass) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const zMid = (p0.z + p1.z) * 0.5;
        if ((zMid >= 0) !== frontPass) continue;

        const alpha = frontPass ? (0.88 + 0.12 * zMid) : (0.42 + 0.22 * (1 + zMid));
        const lw = (frontPass ? (3.2 + 1.1 * zMid) : 2.1) * scaleK;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineCap = 'round';
        ctx.lineWidth = lw;
        ctx.strokeStyle = isCyan
          ? `rgba(6, 182, 212, ${alpha})`
          : `rgba(217, 70, 239, ${alpha})`;
        ctx.stroke();

        if (frontPass) {
          ctx.lineWidth = lw * 0.42;
          ctx.strokeStyle = isCyan
            ? `rgba(165, 243, 252, ${alpha * 0.95})`
            : `rgba(245, 208, 254, ${alpha * 0.95})`;
          ctx.stroke();
        }
      }
    };

    // 1. Rear strand segments
    drawStrandPass(strandA, true, false);
    drawStrandPass(strandB, false, false);

    // 2. Horizontal base-pair rungs rotating together with the strands
    for (let r = 0; r < numRungs; r++) {
      const yNorm = -0.70 + (r / (numRungs - 1)) * 1.40;
      const yPx = yNorm * radiusY;
      const env = Math.sqrt(Math.max(0.18, 1.0 - yNorm * yNorm * 0.72));
      const ampX = radiusX * env;
      const theta = yNorm * twistFactor - rotPhase;
      const xA = Math.sin(theta) * ampX;
      const xB = -xA;

      ctx.beginPath();
      ctx.moveTo(xA, yPx);
      ctx.lineTo(xB, yPx);
      ctx.strokeStyle = (r % 2 === 0) ? 'rgba(165, 243, 252, 0.88)' : 'rgba(245, 208, 254, 0.88)';
      ctx.lineWidth = Math.max(1.2, 2.0 * scaleK);
      ctx.lineCap = 'round';
      ctx.stroke();

      if (isCore) {
        // Traveling photonic energy pulse across each base-pair rung + glowing nucleotide junction nodes
        const rungPulse = 0.5 + 0.5 * Math.sin(now * 0.006 * motionMult + r * 0.85);
        const pxPulse = xA + (xB - xA) * rungPulse;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath();
        ctx.arc(pxPulse, yPx, Math.max(1.1, 1.8 * scaleK), 0, Math.PI * 2);
        ctx.fill();
      }

      // Nucleotide junction beads where the rung meets Strand A and Strand B
      const zA = Math.cos(theta);
      if (zA >= -0.2) {
        ctx.fillStyle = 'rgba(165, 243, 252, 0.95)';
        ctx.beginPath();
        ctx.arc(xA, yPx, Math.max(1.3, 2.2 * scaleK), 0, Math.PI * 2);
        ctx.fill();
      }
      if (-zA >= -0.2) {
        ctx.fillStyle = 'rgba(245, 208, 254, 0.95)';
        ctx.beginPath();
        ctx.arc(xB, yPx, Math.max(1.3, 2.2 * scaleK), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Front strand segments
    drawStrandPass(strandA, true, true);
    drawStrandPass(strandB, false, true);

    // 4. Independently shifting glass highlights & restrained cyan/lavender edge caustics (intensified during ultimate)
    const specShift = Math.sin(now * 0.0011 * motionMult + phaseOffset) * 0.14;
    ctx.strokeStyle = `rgba(255, 255, 255, ${isUltActive ? 0.72 : 0.52})`;
    ctx.lineWidth = Math.max(1.8, 3.0 * scaleK);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, clipR * 0.86, -Math.PI * 0.80 + specShift, -Math.PI * 0.58 + specShift);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${isUltActive ? 0.58 : 0.38})`;
    ctx.lineWidth = Math.max(1.5, 2.4 * scaleK);
    ctx.beginPath();
    ctx.arc(0, 0, clipR * 0.84, -Math.PI * 0.18 - specShift * 0.7, -Math.PI * 0.04 - specShift * 0.7);
    ctx.stroke();

    if (tierIdx >= 3 || isUltActive) {
      const causticShift = Math.cos(now * 0.0016 * motionMult) * 0.22;
      const cAlpha = isUltActive ? 0.65 : (tierIdx === 5 ? 0.44 : 0.28);
      ctx.strokeStyle = `rgba(34, 211, 238, ${cAlpha})`;
      ctx.lineWidth = Math.max(1.2, 2.0 * scaleK);
      ctx.beginPath();
      ctx.arc(0, 0, clipR * 0.91, Math.PI * 0.65 + causticShift, Math.PI * 0.92 + causticShift);
      ctx.stroke();

      ctx.strokeStyle = `rgba(216, 180, 254, ${cAlpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, clipR * 0.91, Math.PI * 0.08 - causticShift, Math.PI * 0.34 - causticShift);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // METEOR INTERNAL LAVA CHANNELS & CRATER RELIEF (Strictly clipped to circular sphere silhouette!)
  // - Confines crater and lava relief to texture and shading so it NEVER deforms the circular silhouette
  // - Slowly turns surface texture and varies heat in individual cracks
  // - During ultimate, increases flow and contrast within lava channels and accelerates surface heat pulse
  // ─────────────────────────────────────────────────────────────
  const METEOR_FISSURE_HOTSPOTS = [
    { x:  0.00, y:  0.05, r: 0.26, freq: 0.0052, phase: 0.0, isPool: false },
    { x:  0.24, y: -0.26, r: 0.24, freq: 0.0046, phase: 1.3, isPool: true  },
    { x: -0.28, y:  0.22, r: 0.22, freq: 0.0059, phase: 2.7, isPool: true  },
    { x: -0.34, y: -0.24, r: 0.18, freq: 0.0068, phase: 4.1, isPool: false },
    { x:  0.32, y:  0.28, r: 0.20, freq: 0.0063, phase: 5.2, isPool: false }
  ];

  const METEOR_CRACK_PATHS = [
    [ {x: -0.06, y: -0.82}, {x: -0.08, y: -0.35}, {x: 0.0, y: 0.02}, {x: -0.18, y: 0.42}, {x: -0.22, y: 0.82} ],
    [ {x: -0.58, y: -0.38}, {x: -0.26, y: -0.14}, {x: 0.0, y: 0.02}, {x:  0.28, y: 0.18}, {x:  0.62, y: 0.44} ],
    [ {x:  0.0,  y:  0.02}, {x:  0.16, y: -0.16}, {x: 0.24, y: -0.26}, {x: 0.52, y: -0.46} ],
    [ {x: -0.26, y: -0.14}, {x: -0.32, y:  0.08}, {x: -0.28, y: 0.22}, {x: -0.56, y: 0.36} ]
  ];

  function drawMeteorMagmaFissuresAndPlates(ctx, radius, now, phaseOffset, tumbleAngle, tierIdx = 4, isCore = true) {
    ctx.save();
    if (isCore) {
      // Strict circular silhouette mask so craters and lava relief never deform the core sphere!
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.97, 0, Math.PI * 2);
      ctx.clip();
    }

    ctx.rotate(tumbleAngle);

    const isUltActive = Boolean(isCore && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === 'meteor');
    const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
    const freqMult = (isUltActive ? 2.4 : 1.15) * motionMult;
    const tierHeat = (tierIdx === 1 ? 0.72 : (tierIdx === 2 ? 0.88 : (tierIdx === 3 ? 1.02 : (tierIdx === 4 ? 1.16 : 1.32)))) * (isUltActive ? 1.45 : 1.0);

    ctx.globalCompositeOperation = 'lighter';

    // 1. Subsurface Molten Mantle Convection Swirls (Core only, GPU sprite blit!)
    if (isCore) {
      const swirlAng = -tumbleAngle * 1.8 + now * 0.00085 * freqMult;
      const ambSpr = QuantumRenderer._getGlowSprite('amber');
      ctx.globalAlpha = Math.min(0.45, 0.22 * tierHeat);
      for (let s = 0; s < 3; s++) {
        const sa = swirlAng + s * ((Math.PI * 2) / 3);
        const sx = Math.cos(sa) * radius * 0.28;
        const sy = Math.sin(sa) * radius * 0.28;
        const sr = radius * (0.48 + 0.10 * Math.sin(now * 0.004 * freqMult + s * 2.1));
        ctx.drawImage(ambSpr, sx - sr, sy - sr, sr * 2, sr * 2);
      }
      ctx.globalAlpha = 1.0;
    }

    // 2. Branching Lava Channels + Live Flowing White-Hot Magma Surge Packets (Core only)
    const maxCracks = isCore ? METEOR_CRACK_PATHS.length : 3;
    for (let c = 0; c < maxCracks; c++) {
      const path = METEOR_CRACK_PATHS[c];
      const veinPulse = (0.50 + 0.50 * Math.pow(0.5 + 0.5 * Math.sin(now * 0.0052 * freqMult + c * 1.55 + phaseOffset), 1.4)) * tierHeat;

      ctx.beginPath();
      for (let k = 0; k < path.length; k++) {
        const px = path[k].x * radius;
        const py = path[k].y * radius;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const chWidth = Math.max(1.4, radius * (tierIdx === 1 ? 0.045 : (tierIdx >= 4 ? 0.075 : 0.060)));
      ctx.strokeStyle = `rgba(234, 88, 12, ${Math.min(0.92, 0.54 * veinPulse)})`;
      ctx.lineWidth = chWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      if (isCore) {
        ctx.strokeStyle = `rgba(254, 240, 138, ${Math.min(0.98, 0.72 * veinPulse)})`;
        ctx.lineWidth = chWidth * 0.45;
        ctx.stroke();

        // Animated Magma Flow Packets visibly streaming along each fissure segment!
        const numPackets = (tierIdx >= 4) ? 3 : 2;
        const segCount = path.length - 1;
        for (let pIdx = 0; pIdx < numPackets; pIdx++) {
          const flowT = ((now * 0.00058 * freqMult + c * 0.27 + pIdx / numPackets) % 1.0);
          const segFloat = flowT * segCount;
          const segI = Math.min(segCount - 1, Math.floor(segFloat));
          const segFrac = segFloat - segI;
          const p0 = path[segI];
          const p1 = path[segI + 1];
          const fx = (p0.x + (p1.x - p0.x) * segFrac) * radius;
          const fy = (p0.y + (p1.y - p0.y) * segFrac) * radius;
          const tailFrac = Math.max(0, segFrac - 0.35);
          const tx = (p0.x + (p1.x - p0.x) * tailFrac) * radius;
          const ty = (p0.y + (p1.y - p0.y) * tailFrac) * radius;
          const flowAlpha = Math.sin(flowT * Math.PI) * Math.min(1.0, 0.85 * tierHeat);

          ctx.strokeStyle = `rgba(255, 251, 235, ${flowAlpha})`;
          ctx.lineWidth = chWidth * 0.62;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(fx, fy);
          ctx.stroke();

          // Incandescent magma droplet head
          const dr = chWidth * 0.75;
          ctx.fillStyle = `rgba(254, 240, 138, ${flowAlpha})`;
          ctx.beginPath();
          ctx.arc(fx, fy, dr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Churning & Bubbling Molten Crater Magma Pools (GPU sprite blits!)
    const maxHotspots = isCore ? METEOR_FISSURE_HOTSPOTS.length : 2;
    const emberPtSpr = QuantumRenderer._getGlowSprite('emberPt');
    for (let h = 0; h < maxHotspots; h++) {
      const hs = METEOR_FISSURE_HOTSPOTS[h];
      if (isCore && tierIdx === 1 && !hs.isPool) continue;
      const pulse = (0.45 + 0.55 * Math.pow(0.5 + 0.5 * Math.sin(now * hs.freq * freqMult + hs.phase + phaseOffset), 1.3)) * tierHeat;
      const hx = hs.x * radius;
      const hy = hs.y * radius;
      const hr = hs.r * radius * (0.78 + 0.24 * pulse);

      ctx.globalAlpha = Math.min(0.95, 0.68 * pulse);
      ctx.drawImage(emberPtSpr, hx - hr, hy - hr, hr * 2, hr * 2);

      // Bubbling solar flare ring inside active crater pools (Core only!)
      if (isCore && hs.isPool && tierIdx >= 2) {
        ctx.globalAlpha = 1.0;
        const bubProg = ((now * 0.0014 * freqMult + h * 0.43) % 1.0);
        const bubR = hr * (0.18 + bubProg * 0.65);
        const bubA = (1.0 - bubProg) * Math.min(0.85, 0.55 * tierHeat);
        ctx.strokeStyle = `rgba(254, 249, 195, ${bubA})`;
        ctx.lineWidth = Math.max(1.0, radius * 0.022);
        ctx.beginPath();
        ctx.arc(hx, hy, bubR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1.0;

    // 4. Internal Rising Micro-Fire tongues inside the lower/equatorial fissures
    const numFireTongues = (tierIdx >= 4) ? 5 : 3;
    for (let f = 0; f < numFireTongues; f++) {
      const fProg = ((now * 0.0018 * freqMult + f * (1 / numFireTongues)) % 1.0);
      const fSeed = (f * 1.37) - 1.2;
      const fx0 = Math.sin(fSeed * 2.1) * radius * 0.48;
      const fy0 = Math.cos(fSeed * 1.7) * radius * 0.48;
      const fx1 = fx0 + Math.sin(now * 0.008 + f) * radius * 0.10;
      const fy1 = fy0 - fProg * radius * 0.28;
      const fa = Math.sin(fProg * Math.PI) * Math.min(0.90, 0.58 * tierHeat);
      ctx.strokeStyle = (f % 2 === 0) ? `rgba(254, 240, 138, ${fa})` : `rgba(249, 115, 22, ${fa})`;
      ctx.lineWidth = Math.max(1.2, radius * 0.032 * (1 - fProg * 0.5));
      ctx.beginPath();
      ctx.moveTo(fx0, fy0);
      ctx.quadraticCurveTo(fx1, (fy0 + fy1) * 0.5, fx0 + (fx1 - fx0) * 0.6, fy1);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDownwardCyanBowShock(ctx, radius, now, phaseOffset) {
    // Removed bright outer outline to keep all light strictly inside material boundaries
  }

  // ─────────────────────────────────────────────────────────────
  // METEOR SINGLE TILTED EMBER ORBIT (Tiers III, IV, V — One tilted ember orbit throughout!)
  // - Tier I: No orbit
  // - Tier II: No orbit, but emits an occasional ember that detaches, cools and fades
  // - Tiers III, IV, V: Exactly ONE tilted ember orbit; each orbiting ember sheds a short fading wake along its movement
  // ─────────────────────────────────────────────────────────────
  const METEOR_SINGLE_ORBIT = {
    tilt: -0.44,
    rx: 94,
    ry: 32,
    speed: 0.00048,
    numEmbers: 3
  };

  function drawMeteorMoltenRingsHalf(ctx, u, now, drawFrontHalf, tierIdx = 4, cTier = null) {
    const effTier = cTier !== null ? cTier : tierIdx;

    // Tier II+: Emit an occasional free ember that detaches, cools, and fades (drawn in front pass)
    if (drawFrontHalf && effTier >= 1.85 && !_prefersReducedMotion) {
      if (now - _lastMeteorEmberSpawn > 420 && _meteorDetachedEmbers.length < 6) {
        _lastMeteorEmberSpawn = now;
        const spawnAng = Math.random() * Math.PI * 2;
        const spawnR = (42 + Math.random() * 18) * u;
        _meteorDetachedEmbers.push({
          x: Math.cos(spawnAng) * spawnR,
          y: Math.sin(spawnAng) * spawnR,
          vx: (Math.random() - 0.5) * 0.45 * u,
          vy: (-0.35 - Math.random() * 0.45) * u,
          bornAt: now,
          dur: 680 + Math.random() * 320
        });
      }
      for (let i = _meteorDetachedEmbers.length - 1; i >= 0; i--) {
        const em = _meteorDetachedEmbers[i];
        const age = now - em.bornAt;
        if (age < 0 || age >= em.dur) {
          _meteorDetachedEmbers.splice(i, 1);
          continue;
        }
        const prog = Math.max(0, Math.min(1, age / em.dur));
        em.x += em.vx;
        em.y += em.vy;
        const alpha = (1.0 - prog);
        const er = Math.max(1.0, (2.2 - prog * 1.1) * u);
        // Cools from bright orange-yellow to dark ember red before fading
        ctx.fillStyle = prog < 0.35
          ? `rgba(253, 224, 71, ${alpha * 0.92})`
          : (prog < 0.70 ? `rgba(249, 115, 22, ${alpha * 0.85})` : `rgba(185, 28, 28, ${alpha * 0.75})`);
        ctx.beginPath();
        ctx.arc(em.x, em.y, er, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (effTier <= 2.02) return; // Tiers I & II have no orbital track!

    const trackAlpha = (effTier < 3.0) ? Math.max(0, Math.min(1, effTier - 2.0)) : 1.0;
    if (trackAlpha <= 0.01) return;

    const rx = METEOR_SINGLE_ORBIT.rx * u;
    const ry = METEOR_SINGLE_ORBIT.ry * u;

    ctx.save();
    ctx.rotate(METEOR_SINGLE_ORBIT.tilt);

    // 1. Sharp, dim, unblurred tilted orbital track split into Rear (sin < 0) and Front (sin >= 0) passes
    const startA = drawFrontHalf ? 0 : Math.PI;
    const endA = drawFrontHalf ? Math.PI : Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, startA, endA);
    const lineAlpha = (drawFrontHalf ? 0.44 : 0.20) * trackAlpha;
    ctx.strokeStyle = `rgba(234, 88, 12, ${lineAlpha})`;
    ctx.lineWidth = Math.max(1.0, 1.25 * u);
    ctx.stroke();

    // 2. Discrete orbiting embers along the single tilted track, each shedding a short fading wake
    const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
    const count = METEOR_SINGLE_ORBIT.numEmbers;
    for (let eIdx = 0; eIdx < count; eIdx++) {
      const rawPhase = now * METEOR_SINGLE_ORBIT.speed * motionMult + (eIdx / count);
      const eAngle = sampleUniformEllipseAngle(rx, ry, rawPhase);
      const ez = Math.sin(eAngle);
      const eIsFront = (ez >= 0);
      if (eIsFront !== drawFrontHalf) continue;

      // Short fading wake along recent orbital movement (4 crisp cooling segments, zero glow halo!)
      for (let w = 4; w >= 1; w--) {
        const wa0 = eAngle - w * 0.048;
        const wa1 = eAngle - (w - 1) * 0.048;
        const wFrac = 1.0 - w / 5.0;
        ctx.beginPath();
        ctx.moveTo(Math.cos(wa0) * rx, Math.sin(wa0) * ry);
        ctx.lineTo(Math.cos(wa1) * rx, Math.sin(wa1) * ry);
        ctx.strokeStyle = (w <= 2)
          ? `rgba(249, 115, 22, ${0.65 * wFrac * trackAlpha})`
          : `rgba(185, 28, 28, ${0.48 * wFrac * trackAlpha})`;
        ctx.lineWidth = Math.max(0.9, (1.1 + wFrac * 0.9) * u);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Crisp discrete ember cinder
      const ex = Math.cos(eAngle) * rx;
      const ey = Math.sin(eAngle) * ry;
      const emberR = Math.max(1.8, (drawFrontHalf ? 2.8 : 2.1) * u);

      ctx.fillStyle = `rgba(234, 88, 12, ${0.96 * trackAlpha})`;
      ctx.beginPath();
      ctx.arc(ex, ey, emberR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(254, 240, 138, ${0.98 * trackAlpha})`;
      ctx.beginPath();
      ctx.arc(ex, ey, emberR * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // DIRECTIONAL CONTACT CATCH EFFECT (Precisely anchored where the node touches the core!)
  // ─────────────────────────────────────────────────────────────
  function drawCoreTopContactBurst(ctx, cx, contactY, mode, intensity = 1.0, now = 0, contactAngle = -Math.PI * 0.5) {
    ctx.save();
    ctx.translate(cx, contactY);
    ctx.rotate(contactAngle + Math.PI * 0.5); // Align tangential arc & sparks with the exact contact normal!

    // Crisp localized surface contact arc & discrete sparks (zero giant bloom disc!)
    const arcSpan = 16 * (0.7 + 0.3 * intensity);
    ctx.lineCap = 'round';

    if (mode === 'meteor') {
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.88 * intensity})`;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 8, 14, -Math.PI * 0.78, -Math.PI * 0.22);
      ctx.stroke();

      ctx.strokeStyle = `rgba(254, 240, 138, ${0.96 * intensity})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(0, 8, 14, -Math.PI * 0.70, -Math.PI * 0.30);
      ctx.stroke();

      for (let r = 0; r < 5; r++) {
        const ang = -Math.PI * 0.82 + (r / 4) * (Math.PI * 0.64);
        const rIn = 4;
        const rOut = (11 + (r % 2) * 5) * intensity;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * rIn, Math.sin(ang) * rIn);
        ctx.lineTo(Math.cos(ang) * rOut, Math.sin(ang) * rOut);
        ctx.strokeStyle = (r % 2 === 0) ? `rgba(254, 240, 138, ${0.90 * intensity})` : `rgba(249, 115, 22, ${0.85 * intensity})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    } else if (mode === 'helix') {
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.88 * intensity})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-arcSpan, 2);
      ctx.quadraticCurveTo(0, -4, arcSpan, 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(232, 121, 249, ${0.85 * intensity})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-arcSpan * 0.7, 0);
      ctx.quadraticCurveTo(0, -5, arcSpan * 0.7, 0);
      ctx.stroke();
    } else {
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.88 * intensity})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-arcSpan, 2);
      ctx.quadraticCurveTo(0, -4, arcSpan, 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(254, 240, 138, ${0.92 * intensity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-arcSpan * 0.65, 0);
      ctx.quadraticCurveTo(0, -4, arcSpan * 0.65, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────
  // SUBTLE AMBIENT CORE RIM AURA (v401: Blinding white starburst/laser flare removed!)
  // ─────────────────────────────────────────────────────────────
  function drawFuturisticResonanceAura(ctx, mode, u, now, cTier) {
    const isUltActive = Boolean(typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mode);
    const effCTier = isUltActive ? Math.max(cTier, 4.2) : cTier;
    if (effCTier <= 1.05 && !isUltActive) return;
    const auraMorph = Math.min(1.0, (effCTier - 1.0) / 3.0);
    const breathe = 1.0 + Math.sin(now * 0.0032) * 0.025 + (CoreKinematics.overdriveFlash || 0) * 0.06;
    const baseR = 96 * u * (0.86 + 0.14 * auraMorph) * breathe;
    const peakA = isUltActive ? 0.24 : (0.06 + 0.06 * auraMorph);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gCore = ctx.createRadialGradient(0, 0, baseR * 0.55, 0, 0, baseR * 1.15);
    gCore.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    if (mode === 'dynamo') {
      gCore.addColorStop(0.45, `rgba(56, 189, 248, ${peakA * 0.85})`);
      gCore.addColorStop(0.75, `rgba(168, 85, 247, ${peakA * 0.55})`);
    } else if (mode === 'helix') {
      gCore.addColorStop(0.45, `rgba(34, 211, 238, ${peakA * 0.85})`);
      gCore.addColorStop(0.75, `rgba(232, 121, 249, ${peakA * 0.55})`);
    } else {
      gCore.addColorStop(0.45, `rgba(251, 146, 60, ${peakA * 0.85})`);
      gCore.addColorStop(0.75, `rgba(239, 68, 68, ${peakA * 0.50})`);
    }
    gCore.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gCore;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 1.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TIER V -> TIER VI GRAND HATCHING CHOREOGRAPHY ENGINE (v404)
  // 4-Phase 1.4s Morph attached dynamically to the moving player:
  //   1. Charge (0 - 350ms): Tier V egg contracts; branching fissures ignite inside cracks
  //   2. Break Open (350 - 650ms): 6 clipped Tier V shell wedges blast/spin apart + mode bursts
  //   3. Reveal (650 - 1100ms): Torso-anchored Tier VI character emerges with clean masked reveal
  //   4. Settle (1100 - 1400ms): Fragments clear cleanly; brief "TIER VI" label fades out
  // ══════════════════════════════════════════════════════════════════════════
  const Tier6HatchSystem = {
    DURATION_MS: 1400,
    BANNER_END_MS: 1580,
    active: false,
    mode: 'dynamo',
    startTime: 0,
    eggCanvas: null,
    eggSnapshotU: 0.36,
    wedges: [],
    sparks: [],

    _initFractures() {
      const baseAngles = [-2.62, -1.62, -0.58, 0.52, 1.54, 2.58];
      this.wedges = baseAngles.map((a0, i) => {
        const a1 = (i < baseAngles.length - 1) ? baseAngles[i + 1] : (baseAngles[0] + Math.PI * 2);
        const mid = (a0 + a1) * 0.5;
        // Jagged crack spine shared by Phase 1 crack lines & Phase 2 wedge polygons
        const buildEdge = (ang) => [
          { r: 0.0, a: ang },
          { r: 0.32, a: ang + (i % 2 === 0 ? 0.09 : -0.09) },
          { r: 0.66, a: ang + (i % 2 === 0 ? -0.08 : 0.08) },
          { r: 1.18, a: ang + (i % 2 === 0 ? 0.04 : -0.04) }
        ];
        return {
          idx: i,
          a0,
          a1,
          mid,
          edgeA: buildEdge(a0),
          edgeB: buildEdge(a1),
          speed: 0.78 + ((i * 37) % 10) * 0.055,
          spin: ((i % 2 === 0) ? 1 : -1) * (1.1 + ((i * 29) % 7) * 0.28),
          liftBias: (Math.sin(mid) - 0.15) * 0.25
        };
      });
    },

    _captureEggSnapshot(mode, now) {
      const cw = 420;
      const ch = 260;
      if (!this.eggCanvas) {
        this.eggCanvas = document.createElement('canvas');
        this.eggCanvas.width = cw;
        this.eggCanvas.height = ch;
      }
      const eCtx = this.eggCanvas.getContext('2d');
      if (!eCtx) return;
      eCtx.clearRect(0, 0, cw, ch);
      // Draw real Tier V core + wings scaled neatly into the offscreen shell canvas
      const snapU = 0.72;
      this.eggSnapshotU = snapU;
      QuantumRenderer._drawLayeredWingedCore(eCtx, mode, cw * 0.5, ch * 0.5, now, 5, snapU, true, true);
    },

    _seedParticles(mode) {
      this.sparks = [];
      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * Math.PI * 2 + (i % 3) * 0.17;
        this.sparks.push({
          ang,
          speed: 0.65 + (i % 5) * 0.26,
          size: 2.2 + (i % 4) * 1.15,
          rot: i * 0.9,
          rotSpd: ((i % 2 === 0) ? 1 : -1) * (3.2 + (i % 3) * 1.4),
          delay: (i % 4) * 0.035,
          kind: i % 3
        });
      }
    },

    start(mode, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      this._initFractures();
      this._captureEggSnapshot(mKey, now);
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, 11);
      if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },

    cancel() {
      this.active = false;
      this.bannerUntil = 0;
    },

    reset() {
      this.active = false;
      this.bannerUntil = 0;
      this.sparks = [];
    },

    isActive(mode = null, now = performance.now()) {
      if (!this.active) return false;
      if (mode && this.mode !== (mode === 'realm' ? 'dynamo' : mode)) return false;
      const elapsed = now - this.startTime;
      if (elapsed >= this.DURATION_MS) {
        this.active = false;
        return false;
      }
      return true;
    },

    _easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); },
    _easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    _easeOutBack(t) {
      const c1 = 1.45;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    _drawFissures(ctx, mode, prog, radius, alpha) {
      if (alpha <= 0.02 || prog <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const mainCol = (mode === 'meteor')
        ? `rgba(249, 115, 22, ${0.95 * alpha})`
        : (mode === 'helix' ? `rgba(34, 211, 238, ${0.92 * alpha})` : `rgba(192, 132, 252, ${0.92 * alpha})`);
      const coreCol = (mode === 'meteor')
        ? `rgba(254, 240, 138, ${alpha})`
        : (mode === 'helix' ? `rgba(244, 114, 182, ${alpha})` : `rgba(224, 242, 254, ${alpha})`);

      for (let i = 0; i < this.wedges.length; i++) {
        const pts = this.wedges[i].edgeA;
        const maxSeg = prog * (pts.length - 1);
        const rxScale = (ang) => {
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          return radius * (0.68 + 0.34 * ca * ca - 0.14 * sa * sa);
        };
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let k = 1; k < pts.length; k++) {
          const prev = pts[k - 1];
          const cur = pts[k];
          const segFrac = Math.max(0, Math.min(1, maxSeg - (k - 1)));
          if (segFrac <= 0) break;
          const aCur = prev.a + (cur.a - prev.a) * segFrac;
          const rCur = (prev.r + (cur.r - prev.r) * segFrac) * rxScale(aCur) * 0.72;
          ctx.lineTo(Math.cos(aCur) * rCur, Math.sin(aCur) * rCur);
        }
        ctx.strokeStyle = mainCol;
        ctx.lineWidth = 3.8;
        ctx.stroke();
        ctx.strokeStyle = coreCol;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fine secondary branching crack strictly inside the egg silhouette
        if (prog > 0.35) {
          const bFrac = Math.min(1, (prog - 0.35) / 0.65);
          const pMid = pts[1];
          const rMid = pMid.r * rxScale(pMid.a) * 0.72;
          const bx0 = Math.cos(pMid.a) * rMid;
          const by0 = Math.sin(pMid.a) * rMid;
          const bAng = pMid.a + ((i % 2 === 0) ? 0.52 : -0.52);
          const bx1 = bx0 + Math.cos(bAng) * radius * 0.24 * bFrac;
          const by1 = by0 + Math.sin(bAng) * radius * 0.20 * bFrac;
          ctx.beginPath();
          ctx.moveTo(bx0, by0);
          ctx.lineTo(bx1, by1);
          ctx.strokeStyle = mainCol;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
      }
      ctx.restore();
    },

    _drawShellFragments(ctx, mode, u, fracProg, fragAlpha) {
      if (!this.eggCanvas || fragAlpha <= 0.02) return;
      const cw = this.eggCanvas.width;
      const ch = this.eggCanvas.height;
      const drawScale = u / (this.eggSnapshotU || 0.72);
      const dw = cw * drawScale;
      const dh = ch * drawScale;
      const polyR = Math.max(dw, dh) * 0.62;
      const spreadDist = 115 * u * this._easeOutCubic(fracProg);

      ctx.save();
      for (let i = 0; i < this.wedges.length; i++) {
        const w = this.wedges[i];
        const dx = Math.cos(w.mid) * spreadDist * w.speed;
        const dy = Math.sin(w.mid) * spreadDist * w.speed + fracProg * fracProg * 38 * u * w.liftBias;
        const rot = w.spin * fracProg;

        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(rot);
        ctx.globalAlpha = fragAlpha;

        // Clip wedge polygon generously so no wingtip of eggCanvas is clipped
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let k = 1; k < w.edgeA.length; k++) {
          const pt = w.edgeA[k];
          const rr = (k === w.edgeA.length - 1) ? polyR : pt.r * polyR * 0.68;
          ctx.lineTo(Math.cos(pt.a) * rr, Math.sin(pt.a) * rr);
        }
        ctx.arc(0, 0, polyR, w.edgeA[w.edgeA.length - 1].a, w.edgeB[w.edgeB.length - 1].a, false);
        for (let k = w.edgeB.length - 1; k >= 1; k--) {
          const pt = w.edgeB[k];
          const rr = (k === w.edgeB.length - 1) ? polyR : pt.r * polyR * 0.68;
          ctx.lineTo(Math.cos(pt.a) * rr, Math.sin(pt.a) * rr);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.eggCanvas, -dw * 0.5, -dh * 0.5, dw, dh);
        ctx.restore();

        // Crisp illuminated inner fracture seam ONLY along the broken shell split (never outer empty arc)
        const seamR = 54 * u;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = (mode === 'meteor')
          ? `rgba(251, 146, 60, ${0.88 * fragAlpha})`
          : (mode === 'helix' ? `rgba(103, 232, 249, ${0.82 * fragAlpha})` : `rgba(165, 243, 252, ${0.88 * fragAlpha})`);
        ctx.lineWidth = Math.max(1.4, 2.2 * u);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let k = 1; k < w.edgeA.length; k++) {
          const pt = w.edgeA[k];
          const rr = Math.min(seamR, pt.r * seamR * 0.85);
          ctx.lineTo(Math.cos(pt.a) * rr, Math.sin(pt.a) * rr);
        }
        ctx.moveTo(0, 0);
        for (let k = 1; k < w.edgeB.length; k++) {
          const pt = w.edgeB[k];
          const rr = Math.min(seamR, pt.r * seamR * 0.85);
          ctx.lineTo(Math.cos(pt.a) * rr, Math.sin(pt.a) * rr);
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    },

    _drawModeBreakEffects(ctx, mode, u, elapsedMs, pBreak) {
      // 1. Outward shards / ember trails / sparks
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.sparks.length; i++) {
        const s = this.sparks[i];
        const tLoc = Math.max(0, Math.min(1, (pBreak - s.delay) / Math.max(0.25, 1.0 - s.delay)));
        if (tLoc <= 0 || tLoc >= 1) continue;
        const dist = (24 + 135 * this._easeOutCubic(tLoc) * s.speed) * u;
        const sx = Math.cos(s.ang) * dist;
        const sy = Math.sin(s.ang) * dist + (mode === 'meteor' ? tLoc * tLoc * 24 * u : 0);
        const sa = Math.sin(tLoc * Math.PI) * 0.92;
        const sr = s.size * u * (1.1 - tLoc * 0.45);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(s.rot + s.rotSpd * tLoc);
        if (mode === 'meteor') {
          // Short ember trail behind basalt chunk
          ctx.fillStyle = `rgba(254, 240, 138, ${sa})`;
          ctx.fillRect(-sr * 0.8, -sr * 0.5, sr * 1.6, sr);
          ctx.strokeStyle = `rgba(249, 115, 22, ${sa * 0.85})`;
          ctx.lineWidth = Math.max(1.2, 1.8 * u);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-Math.cos(s.ang) * 16 * u, -Math.sin(s.ang) * 16 * u);
          ctx.stroke();
        } else if (mode === 'helix') {
          ctx.fillStyle = (s.kind % 2 === 0) ? `rgba(103, 232, 249, ${sa})` : `rgba(244, 114, 182, ${sa})`;
          ctx.beginPath();
          ctx.moveTo(0, -sr * 1.7);
          ctx.lineTo(sr * 0.75, 0);
          ctx.lineTo(0, sr * 1.7);
          ctx.lineTo(-sr * 0.75, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.strokeStyle = (s.kind % 2 === 0) ? `rgba(224, 242, 254, ${sa})` : `rgba(192, 132, 252, ${sa})`;
          ctx.lineWidth = Math.max(1.4, 2.0 * u);
          ctx.beginPath();
          ctx.moveTo(-sr * 1.6, 0);
          ctx.lineTo(sr * 1.6, 0);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Mode-Signature Structural Break Accent:
      if (mode === 'helix' && pBreak < 0.88) {
        // Helix: One crisp paired cyan & magenta spiral briefly unwinds from the crystal shell
        const spAlpha = Math.sin(Math.min(1, pBreak / 0.88) * Math.PI) * 0.90;
        const maxR = (38 + pBreak * 95) * u;
        for (let strand = 0; strand < 2; strand++) {
          const offsetA = strand * Math.PI + pBreak * 4.4;
          ctx.beginPath();
          for (let st = 0; st <= 22; st++) {
            const f = st / 22;
            const r = f * maxR;
            const a = offsetA + f * Math.PI * 2.2;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r * 0.78;
            if (st === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = (strand === 0) ? `rgba(34, 211, 238, ${spAlpha})` : `rgba(244, 114, 182, ${spAlpha})`;
          ctx.lineWidth = Math.max(1.8, 2.8 * u);
          ctx.stroke();
        }
      } else if (mode === 'dynamo' && pBreak < 0.82) {
        // Dynamo: Short blue-white electric arcs leaping across separating panels
        const arcAlpha = Math.sin(Math.min(1, pBreak / 0.82) * Math.PI) * 0.95;
        const spread = (32 + pBreak * 92) * u;
        for (let i = 0; i < this.wedges.length; i++) {
          const w1 = this.wedges[i];
          const w2 = this.wedges[(i + 1) % this.wedges.length];
          const p1x = Math.cos(w1.mid) * spread * w1.speed * 0.75;
          const p1y = Math.sin(w1.mid) * spread * w1.speed * 0.75;
          const p2x = Math.cos(w2.mid) * spread * w2.speed * 0.75;
          const p2y = Math.sin(w2.mid) * spread * w2.speed * 0.75;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          for (let k = 1; k <= 3; k++) {
            const fk = k / 4;
            const jx = Math.sin(elapsedMs * 0.08 + i * 3.1 + k * 2.3) * 8 * u;
            const jy = Math.cos(elapsedMs * 0.07 + i * 2.7 + k * 1.9) * 8 * u;
            ctx.lineTo(p1x + (p2x - p1x) * fk + jx, p1y + (p2y - p1y) * fk + jy);
          }
          ctx.lineTo(p2x, p2y);
          ctx.strokeStyle = `rgba(125, 211, 252, ${arcAlpha})`;
          ctx.lineWidth = Math.max(1.6, 2.4 * u);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * 0.9})`;
          ctx.lineWidth = Math.max(0.9, 1.1 * u);
          ctx.stroke();
        }
      }
      ctx.restore();
    },

    render(ctx, mode, cx, cy, u, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const elapsed = Math.max(0, now - this.startTime);

      ctx.save();
      ctx.translate(cx, cy);

      if (elapsed < 350) {
        // PHASE 1: CHARGE (0 - 350ms)
        const p1 = elapsed / 350;
        const contract = 1.0 - 0.08 * this._easeInOutQuad(p1);
        const jitterX = Math.sin(elapsed * 0.095) * (1.2 + p1 * 2.6) * u;
        const jitterY = Math.cos(elapsed * 0.11) * (1.0 + p1 * 2.0) * u;
        ctx.save();
        ctx.translate(jitterX, jitterY);
        ctx.scale(contract, contract);
        if (this.eggCanvas) {
          const drawScale = u / (this.eggSnapshotU || 0.72);
          const dw = this.eggCanvas.width * drawScale;
          const dh = this.eggCanvas.height * drawScale;
          ctx.drawImage(this.eggCanvas, -dw * 0.5, -dh * 0.5, dw, dh);
        } else {
          QuantumRenderer._drawLayeredWingedCore(ctx, mKey, 0, 0, now, 5, u, false, true);
        }
        this._drawFissures(ctx, mKey, p1, 135 * u, Math.min(1, p1 * 1.35));
        ctx.restore();
      } else {
        // PHASES 2 -> 4 (350 - 1400ms)
        const pBreak = Math.min(1, (elapsed - 350) / 850);
        const fragAlpha = (elapsed < 650)
          ? 1.0
          : Math.max(0, 1.0 - (elapsed - 650) / 600);

        // Background fragment dispersion pass
        if (fragAlpha > 0.02) {
          this._drawShellFragments(ctx, mKey, u, pBreak, fragAlpha);
        }

        // Character Reveal Pass (starts opening at 540ms, full wings spread by 1100ms, settled by 1400ms)
        if (elapsed >= 520) {
          const pRev = Math.max(0, Math.min(1, (elapsed - 520) / 580));
          const pSettle = (elapsed >= 1100) ? Math.min(1, (elapsed - 1100) / 300) : 1;
          // Short forward emergence lift then settle back cleanly into hover
          const emergeY = (1.0 - this._easeOutBack(pRev)) * 22 * u - Math.sin(pRev * Math.PI) * 10 * u;
          const revealAlpha = Math.min(1, pRev * 1.85);
          // Restrained body-first scale easing
          const wingSpreadX = (mKey === 'meteor')
            ? (0.82 + 0.21 * this._easeOutCubic(Math.min(1, pRev / 0.85)) - 0.03 * Math.max(0, (pRev - 0.85) / 0.15))
            : (mKey === 'dynamo' ? (0.86 + 0.14 * this._easeOutCubic(pRev)) : (0.90 + 0.10 * this._easeOutCubic(pRev)));
          const revealScaleY = (mKey === 'helix')
            ? (0.92 + 0.08 * this._easeOutBack(pRev))
            : (0.90 + 0.10 * this._easeOutCubic(pRev));

          const lay = CoreGeometryDB.getTier6DrawLayout(mKey, u);
          const halfClipW = (75 * u) + Math.max(0, (pRev - 0.18) / 0.82) * (lay.drawW * 0.56);
          const halfClipH = (elapsed >= 1060)
            ? lay.drawH * 0.90
            : ((95 * u) + Math.min(1, pRev / 0.65) * (lay.drawH * 0.72));

          ctx.save();
          ctx.translate(0, emergeY);
          ctx.scale(wingSpreadX, revealScaleY);
          ctx.globalAlpha = revealAlpha;
          ctx.beginPath();
          ctx.rect(-halfClipW, -halfClipH, halfClipW * 2, halfClipH * 2);
          ctx.clip();
          QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pRev, settleProgress: pSettle });
          ctx.restore();
        }

        // Foreground localized shatter & mode effects pass
        if (elapsed < 1080) {
          this._drawModeBreakEffects(ctx, mKey, u, elapsed, Math.min(1, (elapsed - 350) / 700));
        }
      }

      ctx.restore();
    },

    renderBanner(ctx, cx, cy, u, now) {
      if (!this.bannerUntil || now > this.bannerUntil) return;
      const elapsed = now - this.startTime;
      if (elapsed < 860) return;
      const bElapsed = elapsed - 860;
      const bDur = this.BANNER_END_MS - 860;
      const bProg = Math.max(0, Math.min(1, bElapsed / bDur));
      const bAlpha = (bProg < 0.20)
        ? (bProg / 0.20)
        : (bProg > 0.72 ? Math.max(0, (1 - bProg) / 0.28) : 1.0);
      if (bAlpha <= 0.01) return;

      const riseY = -98 * u - bProg * 20 * u;
      const spec = TIER6_SPECS[this.mode] || TIER6_SPECS.dynamo;
      const col = (this.mode === 'meteor') ? '#fbbf24' : (this.mode === 'helix' ? '#67e8f9' : '#e879f9');

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fSize = Math.max(15, Math.round(22 * Math.max(0.75, u)));
      ctx.font = `900 ${fSize}px "Lexend", sans-serif`;
      ctx.lineWidth = Math.max(3, 4.5 * u);
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.strokeText(`TIER VI · ${spec.name}`, cx, cy + riseY);
      ctx.fillStyle = col;
      ctx.fillText(`TIER VI · ${spec.name}`, cx, cy + riseY);
      ctx.restore();
    }
  };

  const QuantumRenderer = {
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      this.drawDynamoCore(ctx, cx, cy, now, progress);
    },

    // Seamless 1:1 Partition Strip-Mesh 3D Tier VI Rig Cache (Zero polygon-cutout braid/claw shearing!)
    _tier6RigCache: {},

    // Pre-bake 3D Sobel Surface-Normal Rim Light Maps + Volumetric Shadow Silhouette ONCE per model (~4ms at 512x341)
    _buildTier63DLayers(spr, mKey) {
      const LW = 512, LH = 341;
      const srcC = document.createElement('canvas');
      srcC.width = LW; srcC.height = LH;
      const sCtx = srcC.getContext('2d');
      if (!sCtx) return null;
      sCtx.drawImage(spr, 0, 0, LW, LH);
      let imgData;
      try { imgData = sCtx.getImageData(0, 0, LW, LH); } catch (_) { return null; }
      const d = imgData.data;

      // Build combined luminance + silhouette height field H[x, y]
      const hMap = new Float32Array(LW * LH);
      for (let i = 0, p = 0; i < LW * LH; i++, p += 4) {
        const a = d[p + 3] / 255;
        if (a < 0.04) { hMap[i] = 0; continue; }
        const lum = (d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114) / 255;
        hMap[i] = a * (0.35 + 0.65 * lum);
      }

      const rimLC = document.createElement('canvas');
      rimLC.width = LW; rimLC.height = LH;
      const rimRC = document.createElement('canvas');
      rimRC.width = LW; rimRC.height = LH;
      const shadC = document.createElement('canvas');
      shadC.width = LW; shadC.height = LH;

      const lCtx = rimLC.getContext('2d');
      const rCtx = rimRC.getContext('2d');
      const shCtx = shadC.getContext('2d');
      const lOut = lCtx.createImageData(LW, LH);
      const rOut = rCtx.createImageData(LW, LH);
      const ld = lOut.data, rd = rOut.data;

      // Realm-tuned 3D specular rim key colors
      const colL = mKey === 'meteor' ? [255, 224, 130] : (mKey === 'helix' ? [125, 249, 255] : [186, 230, 255]);
      const colR = mKey === 'meteor' ? [251, 146, 60]  : (mKey === 'helix' ? [244, 168, 255] : [233, 213, 255]);

      for (let y = 1; y < LH - 1; y++) {
        const row = y * LW;
        for (let x = 1; x < LW - 1; x++) {
          const idx = row + x;
          const p = idx * 4;
          const a = d[p + 3];
          if (a < 18) continue;
          // Sobel X and Y surface-normal gradients
          const gx = (
            -hMap[idx - LW - 1] + hMap[idx - LW + 1]
            - 2 * hMap[idx - 1] + 2 * hMap[idx + 1]
            - hMap[idx + LW - 1] + hMap[idx + LW + 1]
          );
          const gy = (
            -hMap[idx - LW - 1] - 2 * hMap[idx - LW] - hMap[idx - LW + 1]
            + hMap[idx + LW - 1] + 2 * hMap[idx + LW] + hMap[idx + LW + 1]
          );
          const nl = Math.max(0, Math.min(1, (-gx * 0.95 - gy * 0.45) * 1.45));
          const nr = Math.max(0, Math.min(1, (gx * 0.95 - gy * 0.45) * 1.45));
          if (nl > 0.05) {
            ld[p] = colL[0]; ld[p + 1] = colL[1]; ld[p + 2] = colL[2];
            ld[p + 3] = Math.min(255, Math.round(nl * nl * a * 1.15));
          }
          if (nr > 0.05) {
            rd[p] = colR[0]; rd[p + 1] = colR[1]; rd[p + 2] = colR[2];
            rd[p + 3] = Math.min(255, Math.round(nr * nr * a * 1.15));
          }
        }
      }
      lCtx.putImageData(lOut, 0, 0);
      rCtx.putImageData(rOut, 0, 0);

      // Soft darkened ambient-occlusion drop shadow silhouette
      shCtx.drawImage(spr, 0, 0, LW, LH);
      shCtx.globalCompositeOperation = 'source-in';
      shCtx.fillStyle = mKey === 'meteor' ? 'rgba(18, 6, 2, 0.56)' : (mKey === 'helix' ? 'rgba(6, 12, 28, 0.52)' : 'rgba(10, 6, 26, 0.54)');
      shCtx.fillRect(0, 0, LW, LH);
      shCtx.globalCompositeOperation = 'source-over';

      return { rimLeft: rimLC, rimRight: rimRC, shadowSil: shadC };
    },

    _getTier6ArticulatedRig(mKey) {
      const bodySpr = LayeredT4Assets.coreT6Body && LayeredT4Assets.coreT6Body[mKey];
      const bodyOk = !!(LayeredT4Assets.loaded.coreT6Body && LayeredT4Assets.loaded.coreT6Body[mKey] && bodySpr && bodySpr.naturalWidth > 0);
      const gunsSpr = LayeredT4Assets.coreT6Guns && LayeredT4Assets.coreT6Guns[mKey];
      const gunsOk = !!(LayeredT4Assets.loaded.coreT6Guns && LayeredT4Assets.loaded.coreT6Guns[mKey] && gunsSpr && gunsSpr.naturalWidth > 0);
      const cached = this._tier6RigCache[mKey];
      if (cached && cached.hasSplitLayers === (bodyOk && gunsOk)) return cached;

      // Strictly require weaponless coreT6Body so idle In-Game Model never renders shoulder weapons
      if (!bodyOk || !bodySpr) return null;
      const spr = bodySpr;

      const W = 1024, H = 682;
      const cfgMap = {
        dynamo: { seamL: 356, seamR: 668, seamBotY: 408, gunPivotL: { x: 372, y: 200 }, gunPivotR: { x: 651, y: 200 }, headY: 225, flapAmp: 27, tailAmp: 16 },
        helix:  { seamL: 426, seamR: 598, seamBotY: 390, gunPivotL: { x: 406, y: 212 }, gunPivotR: { x: 617, y: 212 }, headY: 210, flapAmp: 29, tailAmp: 17 },
        meteor: { seamL: 412, seamR: 612, seamBotY: 395, gunPivotL: { x: 386, y: 154 }, gunPivotR: { x: 637, y: 154 }, headY: 158, flapAmp: 31, tailAmp: 17 }
      };
      const scratch = (cached && cached.bodyScratch) || document.createElement('canvas');
      scratch.width = W; scratch.height = H;
      const layers3d = (cached && cached.layers3d) || this._buildTier63DLayers(spr, mKey);
      const rig = {
        full: spr,
        body: spr,
        guns: (gunsOk ? gunsSpr : null),
        hasSplitLayers: Boolean(bodyOk && gunsOk),
        W,
        H,
        cfg: cfgMap[mKey] || cfgMap.dynamo,
        bodyScratch: scratch,
        bodyScratchCtx: scratch.getContext('2d'),
        layers3d
      };
      this._tier6RigCache[mKey] = rig;
      return rig;
    },

    _renderTier6StripMeshToScratch(rig, flapPhase, tailPhase, vxNorm, bankAngle, easeRev) {
      const bCtx = rig.bodyScratchCtx;
      if (!bCtx || !rig.body) return false;
      const W = rig.W, H = rig.H;
      const cfg = rig.cfg;
      const sL = cfg.seamL, sR = cfg.seamR, sBotY = cfg.seamBotY;
      const spanL = sL, spanR = W - sR, spanTail = H - sBotY;
      const flapSin = Math.sin(flapPhase);
      const flapAbs = Math.abs(flapSin);
      const ampPx = cfg.flapAmp * (0.45 + 0.55 * easeRev);
      const unfurlSpread = 0.52 + 0.48 * easeRev + Math.sin(easeRev * Math.PI) * 0.08;
      const stepX = 14;

      // Asymmetric 3D Yaw Foreshortening: dipping/into-turn wing compresses in perspective while rising wing opens!
      const yawPerspL = Math.max(0.76, Math.min(1.14, 1.0 + bankAngle * 0.52));
      const yawPerspR = Math.max(0.76, Math.min(1.14, 1.0 - bankAngle * 0.52));

      bCtx.clearRect(0, 0, W, H);

      // 1. Left Wing Strips (x = 0 .. seamL): C1 zero-displacement at seamL + 3D dihedral & spanwise torsion
      let prevDx = sL;
      const numL = Math.ceil(spanL / stepX);
      for (let i = 0; i < numL; i++) {
        const sx1 = Math.max(0, sL - i * stepX);
        const sx0 = Math.max(0, sL - (i + 1) * stepX);
        const sw = sx1 - sx0;
        if (sw <= 0) continue;
        const uOut = Math.min(1.0, (sL - (sx0 + sw * 0.5)) / spanL);
        const wave = Math.sin(flapPhase - uOut * 1.22);
        const dy = -wave * ampPx * Math.pow(uOut, 1.52) - bankAngle * 28 * uOut + (1.0 - easeRev) * 26 * uOut;
        const torsionH = H * (1.0 - 0.055 * wave * uOut);
        const torsionY = dy + (H - torsionH) * 0.36;
        const fore = (1.0 - 0.115 * flapAbs * Math.pow(uOut, 1.25)) * unfurlSpread * (1.0 + (yawPerspL - 1.0) * Math.pow(uOut, 0.85));
        const nextDx = Math.round(sL - (sL - sx0) * fore);
        const dw = prevDx - nextDx;
        if (dw >= 1) {
          bCtx.drawImage(rig.body, sx0, 0, sw, H, nextDx, torsionY, dw, torsionH);
          prevDx = nextDx;
        }
      }

      // 2. Right Wing Strips (x = seamR .. W): C1 zero-displacement at seamR + asymmetric 3D perspective
      prevDx = sR;
      const numR = Math.ceil(spanR / stepX);
      for (let j = 0; j < numR; j++) {
        const rx0 = sR + j * stepX;
        const rx1 = Math.min(W, rx0 + stepX);
        const rw = rx1 - rx0;
        if (rw <= 0) continue;
        const uOutR = Math.min(1.0, ((rx0 + rw * 0.5) - sR) / spanR);
        const waveR = Math.sin(flapPhase - uOutR * 1.22);
        const dyR = -waveR * ampPx * Math.pow(uOutR, 1.52) + bankAngle * 28 * uOutR + (1.0 - easeRev) * 26 * uOutR;
        const torsionHR = H * (1.0 - 0.055 * waveR * uOutR);
        const torsionYR = dyR + (H - torsionHR) * 0.36;
        const foreR = (1.0 - 0.115 * flapAbs * Math.pow(uOutR, 1.25)) * unfurlSpread * (1.0 + (yawPerspR - 1.0) * Math.pow(uOutR, 0.85));
        const nextDxR = Math.round(sR + (rx1 - sR) * foreR);
        const dwR = nextDxR - prevDx;
        if (dwR >= 1) {
          bCtx.drawImage(rig.body, rx0, 0, rw, H, prevDx, torsionYR, dwR, torsionHR);
          prevDx = nextDxR;
        }
      }

      // 3. Lower Tail / Royal Gown Horizontal Strips (y = seamBotY .. H) with C1 zero-sway at seamBotY
      const centerW = sR - sL;
      const stepY = 14;
      let prevDy = sBotY;
      const numT = Math.ceil(spanTail / stepY);
      for (let k = 0; k < numT; k++) {
        const sy0 = sBotY + k * stepY;
        const sy1 = Math.min(H, sy0 + stepY);
        const sh = sy1 - sy0;
        if (sh <= 0) continue;
        const vOut = Math.min(1.0, ((sy0 + sh * 0.5) - sBotY) / spanTail);
        const tailDx = Math.sin(tailPhase - vOut * 2.1) * cfg.tailAmp * Math.pow(vOut, 1.45) - vxNorm * 24 * Math.pow(vOut, 1.3);
        bCtx.drawImage(rig.body, sL, sy0, centerW, sh, sL + tailDx, prevDy, centerW, sh);
        prevDy += sh;
      }

      // 4. Multi-Plane Z-Parallax Upper Torso, Head & Crown Strips (y = 0 .. seamBotY)
      //    Crown/horn/head closer to camera shifts slightly into turn (+vxNorm) with C1 zero-seam at seamBotY!
      const numU = Math.ceil(sBotY / stepY);
      for (let uIdx = 0; uIdx < numU; uIdx++) {
        const uy0 = uIdx * stepY;
        const uy1 = Math.min(sBotY, uy0 + stepY);
        const uh = uy1 - uy0;
        if (uh <= 0) continue;
        const zCrown = Math.pow(Math.max(0, 1.0 - (uy0 + uh * 0.5) / sBotY), 1.6);
        const crownParallaxX = vxNorm * 6.5 * zCrown;
        bCtx.drawImage(rig.body, sL, uy0, centerW, uh, sL + crownParallaxX, uy0, centerW, uh);
      }
      return true;
    },

    // Character Showcase Render (Three-Quarter Front Presentation View with 3D Depth, Gyro Ring & Specular Sweep)
    drawCharacterShowcase(ctx, mode, cx, cy, maxW, maxH, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const scImg = LayeredT4Assets.coreT6Showcase && LayeredT4Assets.coreT6Showcase[mKey];
      const scOk = !!(LayeredT4Assets.loaded.coreT6Showcase && LayeredT4Assets.loaded.coreT6Showcase[mKey] && scImg && scImg.naturalWidth > 0);
      if (!scOk) {
        this._drawLayeredWingedCore(ctx, mKey, cx, cy, now, 5, 0.23, true, true);
        return false;
      }

      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const levY = Math.sin(now * 0.0028) * 3.4 * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0036) * 0.014 * motionMult;
      const yawTiltX = 1.0 - Math.abs(Math.sin(now * 0.0019)) * 0.025 * motionMult;
      const fitScale = Math.min(maxW / scImg.naturalWidth, maxH / scImg.naturalHeight) * breath;
      const dw = scImg.naturalWidth * fitScale;
      const dh = scImg.naturalHeight * fitScale;
      const rx = dw * 0.42;
      const ry = dh * 0.16;

      ctx.save();
      ctx.translate(cx, cy + levY);

      // 1. Backlight volumetric aura + Back-half of 3D presentation pedestal ring
      const glowSpr = this._getGlowSprite(mKey === 'meteor' ? 'amber' : (mKey === 'helix' ? 'helix' : 'violet'));
      if (glowSpr) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.45;
        const gr = Math.min(dw, dh) * 0.80;
        ctx.drawImage(glowSpr, -gr, -gr * 0.85, gr * 2, gr * 1.7);
        ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.42)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.42)' : 'rgba(196, 181, 253, 0.44)');
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, dh * 0.22, rx, ry, -0.06, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Three-quarter Character Showcase Portrait with subtle 3D Y-axis breathing perspective
      ctx.save();
      ctx.scale(yawTiltX, 1.0);
      ctx.drawImage(scImg, -dw * 0.5, -dh * 0.5, dw, dh);
      ctx.restore();

      // 3. Front-half of 3D presentation ring + orbiting 3D star mote passing in front of character!
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.62)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.58)' : 'rgba(253, 224, 71, 0.62)');
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, dh * 0.22, rx, ry, -0.06, 0.06, Math.PI - 0.06);
      ctx.stroke();
      const mAng = (now * 0.0026) % (Math.PI * 2);
      if (Math.sin(mAng) >= 0 && glowSpr) {
        const mx = Math.cos(mAng) * rx;
        const my = dh * 0.22 + Math.sin(mAng) * ry;
        ctx.globalAlpha = 0.80 * Math.sin(mAng);
        ctx.drawImage(glowSpr, mx - 12, my - 12, 24, 24);
      }
      ctx.restore();

      ctx.restore();
      return true;
    },

    // Playable Tier VI True-3D Volumetric In-Game Model Renderer (Centered Rear Gameplay View)
    _drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview = false, opts = null) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      if (isPortalPreview) {
        this.drawCharacterShowcase(ctx, mKey, cx, cy, 250 * u, 168 * u, now);
        return;
      }
      const rig = this._getTier6ArticulatedRig(mKey);
      if (!rig || !rig.body) {
        this._drawLayeredWingedCore(ctx, mKey, cx, cy, now, 5, null, isPortalPreview, true);
        return;
      }

      const lay = CoreGeometryDB.getTier6DrawLayout(mKey, u);
      const scale = lay.scale;
      const ancX = lay.spec.anchorX;
      const ancY = lay.spec.anchorY;
      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const bank = isPortalPreview ? (Math.sin(now * 0.0019) * 0.03) : ((CoreKinematics.bodyBank || 0) * 0.46);
      const pitchCompY = isPortalPreview ? 1.0 : (1.0 - Math.abs(CoreKinematics.pitchAngle || 0) * 0.16);
      const levY = Math.sin(now * 0.0038) * 3.2 * u * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0046) * 0.015 * motionMult;
      const vxNorm = isPortalPreview ? Math.sin(now * 0.0015) * 0.25 : Math.max(-1.0, Math.min(1.0, (CoreKinematics.vx || 0) * 0.052));
      const bankCompressX = Math.max(0.88, 1.0 - Math.abs(bank) * 0.24);

      const pRev = (opts && typeof opts.revealProgress === 'number') ? Math.max(0, Math.min(1, opts.revealProgress)) : 1.0;
      const easeRev = 1.0 - Math.pow(1.0 - pRev, 3);
      const isUltActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mKey);

      const flapFreq = (isUltActive ? 0.0095 : 0.0052) * motionMult;
      const flapPhase = now * flapFreq;
      const flapSin = Math.sin(flapPhase);
      const flapCos = Math.cos(flapPhase);
      const tailPhase = now * 0.0054 * motionMult;

      const gunRecoil = (!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.gunRecoil) ? SkillSystem.gunRecoil : 0;
      const aimYaw = (!isPortalPreview && CoreKinematics.lockOnProximity > 0.1)
        ? Math.max(-0.22, Math.min(0.22, (CoreKinematics.lockOnDX || 0) * 0.0018))
        : (vxNorm * 0.06);
      const recL = gunRecoil * 16.0 * (0.85 + 0.3 * Math.sin(now * 0.055));
      const recR = gunRecoil * 16.0 * (0.85 + 0.3 * Math.cos(now * 0.055));

      ctx.save();
      ctx.translate(cx, cy + levY);
      ctx.rotate(bank);
      ctx.scale(breath * bankCompressX, (2.0 - breath * 0.99) * pitchCompY);

      // 1. Z-Sorted Back Halves of Dual Counter-Tilted 3D Gyroscopic Rings + Far-Side (z < 0) 3D Orbiting Spheres
      const pCol = (mKey === 'meteor') ? '#fb923c' : (mKey === 'helix' ? '#22d3ee' : '#c084fc');
      const aCol = (mKey === 'meteor') ? '#fef08a' : (mKey === 'helix' ? '#f472b6' : '#38bdf8');
      const ultRamp3d = isUltActive ? Math.min(1, (now - SkillSystem.activeNova.startAt) / 220) : 0;
      const ringRx = 98 * u * (1.0 + 0.08 * ultRamp3d);
      const ringRy = 31 * u * (1.0 + 0.08 * ultRamp3d);
      const ringY = 14 * u;
      const gyroTiltA = 0.16 + Math.sin(now * 0.0015) * 0.06 * motionMult;
      const gyroTiltB = -0.15 + Math.cos(now * 0.0013) * 0.05 * motionMult;
      const orbSpr = this._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'helix' : 'cyan'));

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      // Back half of Primary Gyro Ring A
      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.36)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.36)' : 'rgba(196, 181, 253, 0.38)');
      ctx.lineWidth = Math.max(2.0, 4.0 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(254, 240, 138, 0.54)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.52)' : 'rgba(253, 224, 71, 0.56)');
      ctx.lineWidth = Math.max(1.0, 1.5 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      // Far-side (z < 0) perspective-shrunk 3D orbiting energy spheres behind wings
      for (let sIdx = 0; sIdx < 2; sIdx++) {
        const th = (now * 0.0029 + sIdx * Math.PI) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT < 0 && orbSpr) {
          const zSc = 0.62 + 0.32 * (1.0 + sinT);
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 14 * u * zSc;
          ctx.globalAlpha = 0.48 * zSc;
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
        }
      }
      ctx.restore();

      // Back half of Counter-Tilted Secondary Gyro Ring B
      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.28)' : (mKey === 'helix' ? 'rgba(192, 132, 252, 0.28)' : 'rgba(56, 189, 248, 0.30)');
      ctx.lineWidth = Math.max(1.0, 1.4 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.84, ringRy * 0.84, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // 1B. Volumetric Z-Depth Drop Shadow Silhouette (separates character cleanly from rings & arena floor!)
      if (rig.layers3d && rig.layers3d.shadowSil) {
        ctx.save();
        const shX = (-vxNorm * 12 + 7) * u;
        const shY = (14 + flapSin * 3.5) * u;
        ctx.globalAlpha = 0.46;
        ctx.drawImage(rig.layers3d.shadowSil, -ancX * scale + shX, -ancY * scale + shY, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 2. Seamless 1:1 Partition 3D Perspective Strip-Mesh Body & Wings
      this._renderTier6StripMeshToScratch(rig, flapPhase, tailPhase, vxNorm, bank, easeRev);
      ctx.drawImage(rig.bodyScratch, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);

      // 2B. Dynamic Sobel Normal-Mapped 3D Rim & Key Light Cross-Fade (light rolls across 3D curvature on bank & flap!)
      if (rig.layers3d) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const baseSpec = Math.max(0.10, flapCos * 0.16) + (isUltActive ? 0.18 : 0.06);
        const leftWeight = Math.min(0.78, Math.max(0.08, baseSpec + Math.max(0, -vxNorm) * 0.42 + Math.max(0, -flapSin) * 0.14));
        const rightWeight = Math.min(0.78, Math.max(0.08, baseSpec + Math.max(0, vxNorm) * 0.42 + Math.max(0, flapSin) * 0.14));
        ctx.globalAlpha = leftWeight;
        ctx.drawImage(rig.layers3d.rimLeft, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.globalAlpha = rightWeight;
        ctx.drawImage(rig.layers3d.rimRight, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 3. Live Dorsal Material Energy & Expressive Reactive Optics / Crown / Horn
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (mKey === 'meteor') {
        for (let sp = 0; sp < 6; sp++) {
          const spProg = ((now * 0.0022 + sp / 6) % 1.0);
          const spy = (145 - spProg * 235) * scale;
          const spR = (7.5 - spProg * 3.0) * scale;
          const spG = ctx.createRadialGradient(0, spy, 0, 0, spy, spR * 2.2);
          spG.addColorStop(0.0, '#ffffff');
          spG.addColorStop(0.45, aCol);
          spG.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = spG;
          ctx.beginPath();
          ctx.arc(0, spy, spR * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const eyeInt = Math.min(1.0, 0.70 + 0.30 * Math.sin(now * 0.012));
        for (let es = -1; es <= 1; es += 2) {
          ctx.fillStyle = `rgba(254, 240, 138, ${eyeInt})`;
          ctx.beginPath();
          ctx.arc(es * 24 * scale, (rig.cfg.headY - ancY - 72) * scale, 4.2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (mKey === 'helix') {
        const gemGY = -4 * scale;
        const gemGR = (20 + Math.sin(now * 0.009) * 4) * scale;
        const gemGG = ctx.createRadialGradient(0, gemGY, 0, 0, gemGY, gemGR);
        gemGG.addColorStop(0.0, '#ffffff');
        gemGG.addColorStop(0.45, pCol);
        gemGG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gemGG;
        ctx.beginPath();
        ctx.arc(0, gemGY, gemGR, 0, Math.PI * 2);
        ctx.fill();

        const hornPulseY = -(110 + ((now * 0.08) % 90)) * scale;
        const hornG = ctx.createRadialGradient(0, hornPulseY, 0, 0, hornPulseY, 16 * scale);
        hornG.addColorStop(0.0, '#ffffff');
        hornG.addColorStop(0.5, '#22d3ee');
        hornG.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = hornG;
        ctx.beginPath();
        ctx.arc(0, hornPulseY, 16 * scale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const gemY = 12 * scale;
        const gemR = (20 + Math.sin(now * 0.009) * 4) * scale;
        const gemG = ctx.createRadialGradient(0, gemY, 0, 0, gemY, gemR);
        gemG.addColorStop(0.0, '#ffffff');
        gemG.addColorStop(0.45, pCol);
        gemG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gemG;
        ctx.beginPath();
        ctx.arc(0, gemY, gemR, 0, Math.PI * 2);
        ctx.fill();

        const crownG = ctx.createRadialGradient(0, -48 * scale, 0, 0, -48 * scale, 15 * scale);
        crownG.addColorStop(0.0, '#ffffff');
        crownG.addColorStop(0.5, aCol);
        crownG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = crownG;
        ctx.beginPath();
        ctx.arc(0, -48 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Twin Shoulder Weapons: Strictly hidden while idle; emerge & gimbal ONLY while pressing/using!
      const s2Deploy = Boolean(!isPortalPreview && state.tier6Skill2CastUntil && now < state.tier6Skill2CastUntil);
      const isT6UltCast = Boolean(isUltActive && SkillSystem.activeNova && SkillSystem.activeNova.isTier6);
      const gunDeployAlpha = isPortalPreview ? 0 : Math.max(state.gunDeployT || 0, (s2Deploy || isT6UltCast) ? 1.0 : 0);
      if (gunDeployAlpha > 0.02 && rig.guns) {
        const emergeDrop = (1.0 - gunDeployAlpha) * 20.0;
        const gAlpha = Math.min(1.0, gunDeployAlpha * 1.35);
        const pivL = rig.cfg.gunPivotL;
        const pivR = rig.cfg.gunPivotR;
        const halfW = rig.W * 0.5;
        ctx.save();
        ctx.globalAlpha *= gAlpha;
        ctx.translate((pivL.x - ancX) * scale, (pivL.y - ancY + recL + emergeDrop) * scale);
        ctx.rotate(aimYaw);
        ctx.drawImage(rig.guns, 0, 0, halfW, rig.H, -pivL.x * scale, -pivL.y * scale, halfW * scale, rig.H * scale);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha *= gAlpha;
        ctx.translate((pivR.x - ancX) * scale, (pivR.y - ancY + recR + emergeDrop) * scale);
        ctx.rotate(aimYaw);
        ctx.drawImage(rig.guns, halfW, 0, halfW, rig.H, (halfW - pivR.x) * scale, -pivR.y * scale, halfW * scale, rig.H * scale);
        ctx.restore();
      }

      // 5. Z-Sorted Front Halves of Dual 3D Gyroscopic Rings + Near-Side (z >= 0) Perspective-Expanded 3D Orbiting Spheres!
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.42)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.42)' : 'rgba(56, 189, 248, 0.44)');
      ctx.lineWidth = Math.max(1.1, 1.6 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.84, ringRy * 0.84, 0, 0.08, Math.PI - 0.08);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.64)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.64)' : 'rgba(253, 224, 71, 0.66)');
      ctx.lineWidth = Math.max(1.3, 2.0 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0.06, Math.PI - 0.06);
      ctx.stroke();

      for (let sIdx = 0; sIdx < 2; sIdx++) {
        const th = (now * 0.0029 + sIdx * Math.PI) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT >= 0 && orbSpr) {
          const zSc = 0.94 + 0.36 * sinT;
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 16 * u * zSc;
          ctx.globalAlpha = 0.86 * (0.35 + 0.65 * sinT);
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.92 * sinT;
          ctx.beginPath();
          ctx.arc(ox, oy, Math.max(1.6, 2.6 * u * zSc), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      ctx.restore();

      ctx.restore();
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor — Tiers I through VI)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null, isPortalPreview = false, skipHatchOverride = false) {
      const tierIdx = Math.min(6, Math.max(1, tier | 0));
      const cTier = isPortalPreview
        ? tierIdx
        : ((CoreKinematics && CoreKinematics.continuousTier !== undefined && Math.abs(CoreKinematics.continuousTier - tierIdx) < 1.2) ? CoreKinematics.continuousTier : tierIdx);
      const effDpr = (ctx.canvas && ctx.canvas._renderDpr) ? ctx.canvas._renderDpr : Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
      const canvasW = ctx.canvas.width / effDpr;
      const canvasH = ctx.canvas.height / effDpr;
      const isMobile = canvasW < 600;

      const coreMetrics = CoreGeometryDB.computeCoreMetrics(canvasW, canvasH, cTier, isMobile, customScale);
      const u = coreMetrics.u;
      const cySrc = (mode === 'meteor') ? 586.0 : (mode === 'helix' ? 568.0 : 590.0);

      // Delegate to Grand Hatching Choreography OR Playable Tier VI Character when active/unlocked!
      if (!skipHatchOverride) {
        if (!isPortalPreview && Tier6HatchSystem.isActive(mode, now)) {
          Tier6HatchSystem.render(ctx, mode, cx, cy, u, now);
          const activeShieldH = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
          if (activeShieldH && activeShieldH.expiresAt > now) {
            CoreKinematics.drawAegisForcefield(ctx, cx, cy, u, now, activeShieldH.expiresAt - now, mode);
          }
          Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          return;
        }
        if (tierIdx >= 6) {
          this._drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview);
          if (!isPortalPreview) {
            const activeShield6 = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
            if (activeShield6 && activeShield6.expiresAt > now) {
              CoreKinematics.drawAegisForcefield(ctx, cx, cy, u, now, activeShield6.expiresAt - now, mode);
            }
            Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          }
          return;
        }
      }

      // Core 1024x576 reference scale so the central sphere radius (150px in 1024x576) equals 68 * u
      const coreImgScale = coreMetrics.coreImgScale;
      const fullRefW = 1024 * coreImgScale;
      const fullRefH = 576 * coreImgScale;

      ctx.save();
      ctx.translate(cx, cy);

      // Render Subtle Ambient Core Rim Aura
      drawFuturisticResonanceAura(ctx, mode, u, now, cTier);

      // Background starburst halo disabled in normal flight (v401 glow reduction); subtle 0.18 during active Ult only
      const isUltHaloActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mode);
      if (isUltHaloActive && LayeredT4Assets.loaded.halo[mode]) {
        const haloSpr = LayeredT4Assets.halo[mode];
        const haloScale = 0.62 * (1.0 + Math.sin(now * 0.004) * 0.03);
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.globalCompositeOperation = 'lighter';
        ctx.scale(haloScale, haloScale);
        ctx.drawImage(haloSpr, -344 * u, -344 * u, 688 * u, 688 * u);
        ctx.restore();
      }

      // Render Expanding Ascension Shock-Rings & Tier IV/V Harmonic Resonance Rings!
      if (!isPortalPreview && CoreKinematics.ascensionRings.length > 0) {
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

      // LAYER 2 & 3: Banking Central Core Body + Directly-Connected Proportional Wings (v352 Split Bank Engineering!)
      const previewBank = isPortalPreview ? (Math.sin(now * 0.0019) * 0.04) : CoreKinematics.bodyBank;
      ctx.save();
      ctx.rotate(previewBank * 0.55);

      // PASS 1: Rear Orbit Depth Pass (behind wings and core sphere)
      if (mode === 'dynamo') {
        drawDynamoRingsHalf(ctx, u, now, false, tierIdx, cTier);
      } else if (mode === 'helix') {
        drawHelixOrbitalRingsHalf(ctx, u, now, false, tierIdx, cTier);
      } else if (mode === 'meteor') {
        drawMeteorMoltenRingsHalf(ctx, u, now, false, tierIdx, cTier);
      }

      // PASS 2: Articulated Tier-Specific Wings (Tiers II -> V, anchored at sphere center with zero gap)
      drawArticulatedWings(ctx, mode, u, cySrc, tierIdx, now, isPortalPreview);

      // Differential Core-vs-Wing Bank Rotation (v352 signature: core banks an additional 0.45 * previewBank relative to the wing plane!)
      ctx.rotate(previewBank * 0.45);

      // PASS 3: Central Core Sphere, Bezel, and Internal Energy / Helix / Lava (Unified 152*u Diameter Across All 3 Realms!)
      if (mode === 'dynamo') {
        // Draw smoky violet glass sphere in its gold bezel (normalized to 336px diameter = 152.3*u)
        const d1Spr = LayeredT4Assets.coreTierSprites.dynamo && LayeredT4Assets.coreTierSprites.dynamo[1];
        const d1Loaded = LayeredT4Assets.loaded.coreTierSprites.dynamo && LayeredT4Assets.loaded.coreTierSprites.dynamo[1];
        if (d1Spr && d1Loaded) {
          ctx.drawImage(d1Spr, -fullRefW * 0.5, -fullRefH * 0.5, fullRefW, fullRefH);
        } else if (LayeredT4Assets.loaded.coreBase.dynamo) {
          const dScale = 1.05;
          ctx.drawImage(LayeredT4Assets.coreBase.dynamo, -170 * u * dScale, -140 * u * dScale, 340 * u * dScale, 280 * u * dScale);
        }

        // Internal branching electrical filaments & stable light reflection strictly inside the glass boundary
        drawInternalPlasmaArcs(ctx, 0, 0, 56 * u, now, 0.0, true, tierIdx);

        // Inward capture discharge snap inside the glass sphere
        for (let d = 0; d < CoreKinematics.dynamoDischarges.length; d++) {
          const dis = CoreKinematics.dynamoDischarges[d];
          const alpha = 1.0 - dis.progress;
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, 62 * u, 0, Math.PI * 2);
          ctx.clip();
          ctx.beginPath();
          for (let k = 0; k < dis.pts.length; k++) {
            const pt = dis.pts[k];
            const jx = (k === 0 || k === dis.pts.length - 1) ? 0 : (Math.random() - 0.5) * 4;
            const jy = (k === 0 || k === dis.pts.length - 1) ? 0 : (Math.random() - 0.5) * 4;
            if (k === 0) ctx.moveTo(pt.x + jx, pt.y + jy);
            else ctx.lineTo(pt.x + jx, pt.y + jy);
          }
          ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.9})`;
          ctx.lineWidth = 2.4 * u;
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.1 * u;
          ctx.stroke();
          ctx.restore();
        }

        // Tier V Royal Crown Bezel Upgrade (Crossfades cleanly on Tier IV -> Tier V ascension!)
        if (cTier > 4.02 && LayeredT4Assets.loaded.bezelT5.dynamo && LayeredT4Assets.bezelT5.dynamo) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, cTier - 4.0));
          ctx.drawImage(LayeredT4Assets.bezelT5.dynamo, -fullRefW * 0.5, -fullRefH * 0.5, fullRefW, fullRefH);
          ctx.restore();
        }

      } else if (mode === 'helix') {
        // Draw the clean quartz/navy glass shell + stepped chrome bezel (335px diameter = 151.9*u)
        const shellSize = 400 * coreImgScale;
        if (LayeredT4Assets.loaded.helixGlassShell && LayeredT4Assets.helixGlassShell) {
          ctx.drawImage(LayeredT4Assets.helixGlassShell, -shellSize * 0.5, -shellSize * 0.5, shellSize, shellSize);
        } else if (LayeredT4Assets.loaded.coreBase.helix) {
          const hScale = 0.7727;
          ctx.drawImage(LayeredT4Assets.coreBase.helix, -170 * u * hScale, -144 * u * hScale, 340 * u * hScale, 280 * u * hScale);
        }

        // Single upright cyan-magenta double helix rendered in one pass with one shared transform (never double images!)
        drawRotating3DDNAInsideGlass(ctx, 0, 0, 26 * u, 54 * u, now, 0.0, true, tierIdx);

        // Tier V Ornate Iridescent Chrome Crown Bezel Upgrade
        if (cTier > 4.02 && LayeredT4Assets.loaded.bezelT5.helix && LayeredT4Assets.bezelT5.helix) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, cTier - 4.0));
          ctx.drawImage(LayeredT4Assets.bezelT5.helix, -fullRefW * 0.5, -fullRefH * 0.5, fullRefW, fullRefH);
          ctx.restore();
        }

      } else {
        // METEOR: Perfectly spherical iron-basalt core normalized to unified 76.0*u radius (152.0*u diameter!)
        const sr = CoreKinematics.meteorShieldRecoil;
        ctx.save();
        ctx.translate((sr.x || 0) * u * 0.55, (sr.y || 0) * u * 0.55);
        ctx.rotate(sr.tilt * 0.35);

        const sphereR = 76.0 * u;
        const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
        const surfaceTurnAngle = now * 0.00035 * motionMult;

        ctx.save();
        // Enforce circular silhouette mask so crater relief and rotating texture never deform the circular silhouette!
        ctx.beginPath();
        ctx.arc(0, 0, sphereR, 0, Math.PI * 2);
        ctx.clip();

        ctx.save();
        ctx.rotate(surfaceTurnAngle);
        const m1Spr = LayeredT4Assets.coreTierSprites.meteor && LayeredT4Assets.coreTierSprites.meteor[1];
        const m1Loaded = LayeredT4Assets.loaded.coreTierSprites.meteor && LayeredT4Assets.loaded.coreTierSprites.meteor[1];
        if (m1Spr && m1Loaded) {
          // 1.16x overscan inside the circular clip mask so rotating the texture fills 100% of the circular silhouette with zero edge gaps
          ctx.drawImage(m1Spr, -fullRefW * 0.58, -fullRefH * 0.58, fullRefW * 1.16, fullRefH * 1.16);
        } else if (LayeredT4Assets.loaded.coreBase.meteor) {
          const mScale = 0.9577;
          ctx.drawImage(LayeredT4Assets.coreBase.meteor, -170 * u * mScale, -140 * u * mScale, 340 * u * mScale, 280 * u * mScale);
        }
        ctx.restore();

        // Moving heat variation inside the branching lava channels & molten crater pools
        drawMeteorMagmaFissuresAndPlates(ctx, sphereR, now, 0.0, surfaceTurnAngle, tierIdx);

        // Directional surface shading (keeps 3D lighting anchored to top-left while the rock texture turns underneath)
        const shadeG = ctx.createRadialGradient(-sphereR * 0.32, -sphereR * 0.32, sphereR * 0.15, 0, 0, sphereR);
        shadeG.addColorStop(0.0, 'rgba(255, 245, 220, 0.06)');
        shadeG.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
        shadeG.addColorStop(1.0, 'rgba(0, 0, 0, 0.36)');
        ctx.fillStyle = shadeG;
        ctx.beginPath();
        ctx.arc(0, 0, sphereR, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // End circular silhouette clip
        ctx.restore(); // End recoil transform
      }

      // PASS 4: Front Orbit Depth Pass (occludes the front of the core sphere!)
      if (mode === 'dynamo') {
        drawDynamoRingsHalf(ctx, u, now, true, tierIdx, cTier);
      } else if (mode === 'helix') {
        drawHelixOrbitalRingsHalf(ctx, u, now, true, tierIdx, cTier);
      } else if (mode === 'meteor') {
        drawMeteorMoltenRingsHalf(ctx, u, now, true, tierIdx, cTier);
      }

      // UPGRADE 5: Magnetic Lock-On Anticipation Rim Arc when a node enters the horizon
      if (!isPortalPreview && CoreKinematics.lockOnProximity > 0.15) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const aimAngle = -Math.PI * 0.5 + Math.max(-0.45, Math.min(0.45, CoreKinematics.lockOnDX * 0.0045));
        const rimR = 80 * u;
        ctx.beginPath();
        ctx.arc(0, 0, rimR, aimAngle - 0.32, aimAngle + 0.32);
        ctx.strokeStyle = `rgba(255, 255, 255, ${CoreKinematics.lockOnProximity * 0.65})`;
        ctx.lineWidth = 2.2 * u;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // End shared core/wing bank

      if (!isPortalPreview) {
        // Mode-Specific 5-Second Aegis Spherical Geodesic Forcefield (only when Shield power-up is active)
        const activeShield = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
        if (activeShield && activeShield.expiresAt > now) {
          CoreKinematics.drawAegisForcefield(ctx, 0, 0, u, now, activeShield.expiresAt - now, mode);
        }
      }

      ctx.restore(); // End core translate

      // Render discrete directional Meteor impact cinders at the exact contact point (no glow halo!)
      if (!isPortalPreview && mode === 'meteor' && CoreKinematics.impactCinders.length > 0) {
        ctx.save();
        for (let i = 0; i < CoreKinematics.impactCinders.length; i++) {
          const c = CoreKinematics.impactCinders[i];
          const prog = c.life / c.maxLife;
          const alpha = Math.max(0, 1.0 - prog);
          const r = Math.max(1.0, c.size * (0.65 + 0.35 * alpha));
          ctx.fillStyle = prog < 0.35
            ? `rgba(254, 240, 138, ${alpha})`
            : (prog < 0.72 ? `rgba(249, 115, 22, ${alpha * 0.92})` : `rgba(185, 28, 28, ${alpha * 0.80})`);
          ctx.beginPath();
          ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
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
    // PRE-BAKED GPU GLOW SPRITE CACHE (Role #6 & #7: ZERO per-frame gradient allocations!)
    // ─────────────────────────────────────────────────────────────────────────
    _glowSprites: null,
    _getGlowSprite(key) {
      if (!this._glowSprites) {
        const makeGlow = (stops) => {
          const c = document.createElement('canvas');
          c.width = 64; c.height = 64;
          const gctx = c.getContext('2d');
          const g = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          for (let i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
          gctx.fillStyle = g;
          gctx.fillRect(0, 0, 64, 64);
          return c;
        };
        this._glowSprites = {
          indigo:  makeGlow([[0, 'rgba(99,102,241,0.58)'], [0.45, 'rgba(79,70,229,0.24)'], [1, 'rgba(49,46,129,0)']]),
          cyan:    makeGlow([[0, 'rgba(125,211,252,0.62)'], [0.45, 'rgba(34,211,238,0.26)'], [1, 'rgba(14,165,233,0)']]),
          helix:   makeGlow([[0, 'rgba(34,211,238,0.48)'], [0.48, 'rgba(232,121,249,0.24)'], [1, 'rgba(168,85,247,0)']]),
          amber:   makeGlow([[0, 'rgba(255,250,210,0.92)'], [0.38, 'rgba(251,146,60,0.65)'], [0.75, 'rgba(220,38,38,0.20)'], [1, 'rgba(153,27,27,0)']]),
          gold:    makeGlow([[0, 'rgba(255,253,225,0.95)'], [0.40, 'rgba(250,204,21,0.65)'], [0.78, 'rgba(234,88,12,0.22)'], [1, 'rgba(154,52,18,0)']]),
          crimson: makeGlow([[0, 'rgba(244,63,94,0.54)'], [0.50, 'rgba(159,18,57,0.22)'], [1, 'rgba(136,19,55,0)']]),
          violet:  makeGlow([[0, 'rgba(245,208,254,0.75)'], [0.42, 'rgba(192,132,252,0.42)'], [0.78, 'rgba(126,34,206,0.18)'], [1, 'rgba(88,28,135,0)']]),
          emerald: makeGlow([[0, 'rgba(16,185,129,0.52)'], [0.48, 'rgba(147,51,234,0.24)'], [1, 'rgba(88,28,135,0)']]),
          emberPt: makeGlow([[0, 'rgba(255,255,235,0.98)'], [0.42, 'rgba(251,146,60,0.78)'], [1, 'rgba(220,38,38,0)']]),
          cyanPt:  makeGlow([[0, 'rgba(240,253,255,0.98)'], [0.42, 'rgba(56,189,248,0.82)'], [1, 'rgba(59,130,246,0)']]),
          magPt:   makeGlow([[0, 'rgba(255,245,255,0.96)'], [0.42, 'rgba(232,121,249,0.80)'], [1, 'rgba(168,85,247,0)']]),
          crimPt:  makeGlow([[0, 'rgba(255,228,230,0.96)'], [0.45, 'rgba(244,63,94,0.82)'], [1, 'rgba(159,18,57,0)']]),
          emPt:    makeGlow([[0, 'rgba(240,255,248,0.95)'], [0.45, 'rgba(16,185,129,0.78)'], [1, 'rgba(88,28,135,0)']])
        };
      }
      return this._glowSprites[key] || this._glowSprites.cyan;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // COMPACT, ZERO-LAG REALM MICRO-AURA WAKE ENGINE (Roles #3 & #6)
    // Natural, hugging upper-hemisphere atmospheric/plasma/bioluminescent slipstreams
    // Uses pure pre-baked GPU GlowSprites & soft rim micro-arcs — ZERO antennae, ZERO lag!
    // ─────────────────────────────────────────────────────────────────────────
    _drawScientificNodeWake(ctx, mode, p, targetR, scale, now, isHazard, isPowered) {
      const animPhase = p.animPhase || 0.0;
      const modeKey = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
      const powerMult = isPowered ? 1.16 : 1.0;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      if (!isHazard) {
        if (isPowered) {
          // v416: Luxury 24K Champagne-Gold & Jewel Silk Ribbon Wake for Powered-Up Good Relics
          const rSw = Math.sin(now * 0.009 + animPhase) * targetR * 0.16;
          const rLen = targetR * 2.15;
          const ribG = ctx.createLinearGradient(0, -targetR * 0.3, rSw, -targetR * 0.3 - rLen);
          ribG.addColorStop(0.0, 'rgba(254, 240, 138, 0.42)');
          ribG.addColorStop(0.45, modeKey === 'helix' ? 'rgba(103, 232, 249, 0.24)' : 'rgba(251, 191, 36, 0.26)');
          ribG.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = ribG;
          ctx.beginPath();
          ctx.moveTo(-targetR * 0.46, -targetR * 0.2);
          ctx.quadraticCurveTo(rSw * 0.4, -targetR * 0.4 - rLen * 0.65, rSw, -targetR * 0.3 - rLen);
          ctx.quadraticCurveTo(rSw * 0.4 + targetR * 0.25, -targetR * 0.4 - rLen * 0.65, targetR * 0.46, -targetR * 0.2);
          ctx.closePath();
          ctx.fill();

          for (let rs = 0; rs < 3; rs++) {
            const rp = ((now * 0.0022 + rs * 0.333 + animPhase) % 1.0);
            const rx = Math.sin(now * 0.008 + rs * 2.1 + animPhase) * targetR * 0.44 * (1 - rp * 0.5);
            const ry = -targetR * 0.68 - rp * rLen * 0.92;
            CoreKinematics._drawStarGlint(ctx, rx, ry, (5.5 * (1 - rp * 0.45)) * scale, rs % 2 === 0 ? '#fef9c3' : '#ffffff');
          }
        }
        if (modeKey === 'dynamo') {
          // ═══ DYNAMO GOOD: Hugging Ionized Plasma Slipstream + Tangential Tesla Rim Micro-Arcs + Ion Sparks ═══
          const wakeLen = targetR * 1.05 * powerMult;
          const spr = this._getGlowSprite(isPowered ? 'cyan' : 'indigo');
          const sway = Math.sin(now * 0.012 + animPhase) * targetR * 0.08;
          ctx.globalAlpha = isPowered ? 0.72 : 0.62;
          ctx.drawImage(spr, -targetR * 1.06 + sway * 0.3, -targetR * 1.12 - wakeLen * 0.45, targetR * 2.12, targetR * 1.75 + wakeLen * 0.55);
          ctx.globalAlpha = 0.46;
          ctx.drawImage(this._getGlowSprite('cyan'), -targetR * 0.65 + sway, -targetR * 1.05 - wakeLen * 0.78, targetR * 1.30, wakeLen * 1.05);

          // Tangential Tesla-globe surface corona arcs hugging the left/right shoulders (NEVER poking above pill!)
          const tick = Math.floor(now / 65) + Math.floor(animPhase * 17);
          ctx.globalAlpha = 1.0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const arcSides = isPowered ? 2 : 1;
          for (let a = 0; a < arcSides; a++) {
            const sideDir = (arcSides === 1) ? ((tick % 2 === 0) ? 1 : -1) : (a === 0 ? -1 : 1);
            const baseAng = -Math.PI * 0.5 + sideDir * (0.48 + (Math.sin(tick * 1.9 + a) * 0.14));
            const arcSpan = 0.46;
            const segs = 4;
            ctx.beginPath();
            for (let s = 0; s <= segs; s++) {
              const frac = s / segs;
              const ang = baseAng + sideDir * (frac - 0.5) * arcSpan;
              const jitter = (s === 0 || s === segs) ? 0 : Math.sin(tick * 3.7 + s * 2.9 + a * 4.1) * targetR * 0.11;
              const r = targetR * 1.06 + jitter;
              const px = Math.cos(ang) * r;
              const py = Math.sin(ang) * r;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = isPowered ? 'rgba(250, 204, 21, 0.72)' : 'rgba(56, 189, 248, 0.76)';
            ctx.lineWidth = 2.0 * scale;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(240, 249, 255, 0.85)';
            ctx.lineWidth = 0.85 * scale;
            ctx.stroke();
          }

          // 3 Delicate GPU-blitted electric ion sparks drifting softly upward in slipstream
          const ptSpr = this._getGlowSprite(isPowered ? 'emberPt' : 'cyanPt');
          for (let em = 0; em < 3; em++) {
            const ep = ((now * 0.0024 + em * 0.333 + animPhase) % 1.0);
            const ex = Math.sin(now * 0.009 + em * 2.7 + animPhase) * targetR * (0.58 - ep * 0.22);
            const ey = -targetR * 0.60 - ep * wakeLen * 1.05;
            const es = (4.8 - ep * 2.4) * scale;
            ctx.globalAlpha = Math.sin(ep * Math.PI) * 0.88;
            ctx.drawImage(ptSpr, ex - es, ey - es, es * 2, es * 2);
          }
          ctx.globalAlpha = 1.0;

        } else if (modeKey === 'helix') {
          // ═══ HELIX GOOD: Silky Bioluminescent Photonic Slipstream + Spiraling Cyan/Magenta Nucleotide Stardust ═══
          const wakeLen = targetR * 1.08 * powerMult;
          const spr = this._getGlowSprite('helix');
          const sway = Math.sin(now * 0.010 + animPhase) * targetR * 0.08;
          ctx.globalAlpha = isPowered ? 0.72 : 0.58;
          ctx.drawImage(spr, -targetR * 1.05 + sway * 0.3, -targetR * 1.10 - wakeLen * 0.45, targetR * 2.10, targetR * 1.72 + wakeLen * 0.58);
          ctx.globalAlpha = 0.42;
          ctx.drawImage(this._getGlowSprite('cyan'), -targetR * 0.62 - sway * 0.5, -targetR * 1.02 - wakeLen * 0.78, targetR * 1.24, wakeLen * 1.00);

          // 4 Delicate GPU-blitted nucleotide stardust motes orbiting in a soft twin-helix slipstream (ZERO rigid bow/antennae!)
          const cSpr = this._getGlowSprite('cyanPt');
          const mSpr = this._getGlowSprite(isPowered ? 'emberPt' : 'magPt');
          const twist = now * 0.0048 + animPhase;
          for (let em = 0; em < 4; em++) {
            const ep = ((now * 0.0021 + em * 0.25 + animPhase) % 1.0);
            const strandSign = (em % 2 === 0) ? 1 : -1;
            const ex = Math.sin(twist + ep * Math.PI * 2.2) * targetR * (0.56 - ep * 0.26) * strandSign;
            const ey = -targetR * 0.55 - ep * wakeLen * 1.08;
            const es = (4.6 - ep * 2.2) * scale;
            ctx.globalAlpha = Math.sin(ep * Math.PI) * 0.90;
            ctx.drawImage(strandSign > 0 ? cSpr : mSpr, ex - es, ey - es, es * 2, es * 2);
          }
          ctx.globalAlpha = 1.0;

        } else {
          // ═══ METEOR GOOD: Intimate Hugging Ablation Flame Collar + 3 GPU-Blitted Molten Embers (~1.12x R) ═══
          const wakeLen = targetR * 1.12 * powerMult;
          const spr = this._getGlowSprite(isPowered ? 'gold' : 'amber');
          const sway = Math.sin(now * 0.018 + animPhase) * targetR * 0.12;
          // 1. Hugging re-entry fire crown wrapping smoothly off upper basalt crust (pure GPU blit!)
          ctx.globalAlpha = isPowered ? 0.78 : 0.68;
          ctx.drawImage(spr, -targetR * 1.05 + sway * 0.4, -targetR * 1.18 - wakeLen * 0.55, targetR * 2.10, targetR * 1.75 + wakeLen * 0.75);
          ctx.globalAlpha = 0.52;
          ctx.drawImage(spr, -targetR * 0.62 + sway, -targetR * 1.10 - wakeLen * 0.92, targetR * 1.24, wakeLen * 1.15);

          // 2. Three delicate rising incandescent spallation embers (pure GPU blit — ZERO gradients!)
          const eSpr = this._getGlowSprite('emberPt');
          for (let em = 0; em < 3; em++) {
            const ep = ((now * 0.0026 + em * 0.333 + animPhase) % 1.0);
            const ex = Math.sin(now * 0.008 + em * 2.4 + animPhase) * targetR * (0.52 - ep * 0.18);
            const ey = -targetR * 0.65 - ep * wakeLen * 1.18;
            const es = (5.5 - ep * 2.8) * scale;
            ctx.globalAlpha = Math.sin(ep * Math.PI) * 0.90;
            ctx.drawImage(eSpr, ex - es, ey - es, es * 2, es * 2);
          }
          ctx.globalAlpha = 1.0;
        }
      } else if (!isPowered) {
        // ═══ REGULAR BAD NODES: Compact Hugging Antimatter Slipstreams (Pure GPU Blit — ZERO Antennae!) ═══
        const wakeLen = targetR * 0.85;
        if (modeKey === 'dynamo') {
          const spr = this._getGlowSprite('crimson');
          ctx.globalAlpha = 0.58;
          ctx.drawImage(spr, -targetR * 1.00, -targetR * 1.15 - wakeLen * 0.35, targetR * 2.00, targetR * 1.70);
          const cpSpr = this._getGlowSprite('crimPt');
          for (let em = 0; em < 2; em++) {
            const ep = ((now * 0.0025 + em * 0.5 + animPhase) % 1.0);
            const ex = Math.sin(now * 0.011 + em * 3.1 + animPhase) * targetR * 0.48;
            const ey = -targetR * 0.58 - ep * wakeLen * 0.98;
            const es = (4.2 - ep * 2.0) * scale;
            ctx.globalAlpha = Math.sin(ep * Math.PI) * 0.85;
            ctx.drawImage(cpSpr, ex - es, ey - es, es * 2, es * 2);
          }
          ctx.globalAlpha = 1.0;

        } else if (modeKey === 'helix') {
          const spr = this._getGlowSprite('crimson');
          ctx.globalAlpha = 0.52;
          ctx.drawImage(spr, -targetR * 0.98, -targetR * 1.12 - wakeLen * 0.35, targetR * 1.96, targetR * 1.66);
          const cpSpr = this._getGlowSprite('crimPt');
          const mpSpr = this._getGlowSprite('magPt');
          for (let em = 0; em < 3; em++) {
            const ep = ((now * 0.0022 + em * 0.333 + animPhase) % 1.0);
            const ex = Math.sin(now * 0.006 + em * 2.5 + animPhase) * targetR * 0.46;
            const ey = -targetR * 0.56 - ep * wakeLen * 0.96;
            const es = (4.0 - ep * 1.9) * scale;
            ctx.globalAlpha = Math.sin(ep * Math.PI) * 0.82;
            ctx.drawImage(em % 2 === 0 ? cpSpr : mpSpr, ex - es, ey - es, es * 2, es * 2);
          }
          ctx.globalAlpha = 1.0;

        } else {
          // Meteor Regular Bad: Compact Abyssal-Emerald & Amethyst Isotope Whisper + 2 GPU-blitted motes
          const spr = this._getGlowSprite('emerald');
          ctx.globalAlpha = 0.56;
          ctx.drawImage(spr, -targetR * 1.05, -targetR * 1.25 - wakeLen * 0.40, targetR * 2.10, targetR * 1.85);
          const mpSpr = this._getGlowSprite('emPt');
          for (let m = 0; m < 2; m++) {
            const mp = ((now * 0.0024 + m * 0.5 + animPhase) % 1.0);
            const mx = Math.sin(now * 0.006 + m * 2.5 + animPhase) * targetR * 0.42;
            const my = -targetR * 0.65 - mp * wakeLen * 1.1;
            const ms = 4.6 * scale;
            ctx.globalAlpha = Math.sin(mp * Math.PI) * 0.85;
            ctx.drawImage(mpSpr, mx - ms, my - ms, ms * 2, ms * 2);
          }
          ctx.globalAlpha = 1.0;
        }
      }
      ctx.restore();
    },

    _badgeWidthCache: new Map(),
    _getBadgeWidth(ctx, font, text) {
      const key = font + '|' + text;
      let w = this._badgeWidthCache.get(key);
      if (w === undefined) {
        ctx.font = font;
        w = ctx.measureText(text).width;
        this._badgeWidthCache.set(key, w);
      } else {
        ctx.font = font;
      }
      return w;
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

      const isGoodLuxuryRelic = (!isHazard && p.nodeClass !== 'standard');
      const sModeKey = (mode === 'helix') ? 'helix' : ((mode === 'meteor') ? 'meteor' : 'dynamo');
      const relicImg = isGoodLuxuryRelic
        ? ((p.nodeClass === 'shield') ? LayeredT4Assets.powerupShield[sModeKey] : LayeredT4Assets.powerupRelics[p.nodeClass])
        : null;
      const relicLoaded = isGoodLuxuryRelic && relicImg && relicImg.naturalWidth > 0 && (
        (p.nodeClass === 'shield') ? LayeredT4Assets.loaded.powerupShield[sModeKey] : LayeredT4Assets.loaded.powerupRelics[p.nodeClass]
      );

      if (!isHazard) {
        if (isGoodLuxuryRelic && relicLoaded) {
          // ════════════════════════════════════════════════════════════════════════
          // STANDALONE 3D LUXURY POWERED-UP GOOD RELICS (NO REGULAR ORB CLUTTER!)
          // ════════════════════════════════════════════════════════════════════════
          const relicMeta = {
            shield: { glow: (sModeKey === 'helix' ? 'helix' : (sModeKey === 'meteor' ? 'gold' : 'cyan')), starA: '#fde047', starB: (sModeKey === 'helix' ? '#f0abfc' : '#67e8f9'), ring: '#f59e0b', spin: false },
            missiles: { glow: 'cyan', starA: '#38bdf8', starB: '#fde047', ring: '#38bdf8', spin: true },
            cluster: { glow: 'helix', starA: '#22d3ee', starB: '#e879f9', ring: '#fde047', spin: false },
            supercharge: { glow: 'gold', starA: '#fef08a', starB: '#fb923c', ring: '#fbbf24', spin: true },
            chronos: { glow: 'cyan', starA: '#67e8f9', starB: '#e0f2fe', ring: '#67e8f9', spin: false },
            singularity: { glow: 'cyan', starA: '#fde047', starB: '#7dd3fc', ring: '#fbbf24', spin: true },
            catalyst: { glow: 'emPt', starA: '#34d399', starB: '#fef08a', ring: '#34d399', spin: false }
          }[p.nodeClass] || { glow: 'gold', starA: '#fde047', starB: '#ffffff', ring: '#fbbf24', spin: false };

          const gyroSpin = now * 0.0028 + animPhase;
          const ringRx = targetR * 1.32;
          const ringTilt = 0.24 * Math.sin(now * 0.0018 + animPhase);

          // 1. Soft Luminous Luxury Jewel Corona
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const coronaR = targetR * (1.52 + 0.10 * Math.sin(now * 0.007 + animPhase));
          ctx.globalAlpha = 0.56;
          ctx.drawImage(this._getGlowSprite(relicMeta.glow), -coronaR, -coronaR, coronaR * 2, coronaR * 2);
          ctx.restore();

          // 2. Back Half of Tilted 24K-Gold Celestial Gyro Ring
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.rotate(ringTilt);
          ctx.scale(1.0, 0.36);
          ctx.strokeStyle = relicMeta.ring;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 2.6 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, ringRx, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 3. Standalone Photorealistic 3D Raytraced Luxury Relic + Specular Luster Pass
          const relicSize = ((p.nodeClass === 'shield') ? 168 : 156) * scale * (1.0 + 0.028 * Math.sin(now * 0.006 + animPhase));
          const relicRot = relicMeta.spin
            ? ((p.nodeClass === 'missiles' ? 0.0011 : 0.0015) * now + animPhase * 0.25)
            : (Math.sin(now * 0.0032 + animPhase) * 0.085);
          ctx.save();
          ctx.rotate(relicRot);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.26 + 0.12 * Math.sin(now * 0.0085 + animPhase);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.restore();

          // 4. Front Half of Tilted 24K-Gold Gyro Ring + Twin 4-Point Diamond Starlight Flares
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.rotate(ringTilt);
          ctx.save();
          ctx.scale(1.0, 0.36);
          ctx.strokeStyle = '#fef9c3';
          ctx.globalAlpha = 0.72;
          ctx.lineWidth = 2.2 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, ringRx, 0, Math.PI);
          ctx.stroke();
          ctx.restore();

          for (let st = 0; st < 2; st++) {
            const sa = gyroSpin + st * Math.PI;
            const sx = Math.cos(sa) * ringRx;
            const sy = Math.sin(sa) * ringRx * 0.36;
            if (Math.sin(sa) >= -0.15) {
              CoreKinematics._drawStarGlint(ctx, sx, sy, 8.5 * scale, st === 0 ? relicMeta.starA : relicMeta.starB);
            }
          }
          ctx.restore();

          // v413 Enhancement: Dual Counter-Rotating Platinum Astrolabe Ring & Diagonal Specular Light Sweep on Shield Relics!
          if (p.nodeClass === 'shield') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const outerAstR = ringRx * 1.15;
            ctx.rotate(-ringTilt * 0.85);
            ctx.save();
            ctx.scale(0.36, 1.0);
            ctx.strokeStyle = (sModeKey === 'helix') ? 'rgba(240, 171, 252, 0.58)' : 'rgba(224, 242, 254, 0.58)';
            ctx.lineWidth = 1.6 * scale;
            ctx.setLineDash([8 * scale, 6 * scale]);
            ctx.lineDashOffset = -now * 0.03;
            ctx.beginPath();
            ctx.arc(0, 0, outerAstR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // 2 additional orthogonal diamond starlight glints orbiting the platinum filigree axis
            const astSpin = -now * 0.0034 + animPhase;
            for (let g2 = 0; g2 < 2; g2++) {
              const ga = astSpin + g2 * Math.PI;
              CoreKinematics._drawStarGlint(
                ctx,
                Math.cos(ga) * outerAstR * 0.36,
                Math.sin(ga) * outerAstR,
                6.8 * scale,
                (g2 === 0) ? '#ffffff' : relicMeta.starB
              );
            }

            // Diagonal Specular Luxury Light-Sheen Sweep across the 3D Shield Relic every ~1.8s
            const sweepPhase = ((now * 0.00055 + animPhase) % 1.0);
            if (sweepPhase < 0.55) {
              const tSw = sweepPhase / 0.55;
              const swPos = (tSw * 2.0 - 1.0) * targetR * 1.05;
              ctx.save();
              ctx.beginPath();
              ctx.arc(0, 0, targetR * 1.18, 0, Math.PI * 2);
              ctx.clip();
              ctx.rotate(-0.68);
              const swGrad = ctx.createLinearGradient(swPos - 18 * scale, 0, swPos + 18 * scale, 0);
              swGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
              swGrad.addColorStop(0.5, `rgba(254, 249, 195, ${0.42 * Math.sin(tSw * Math.PI)})`);
              swGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = swGrad;
              ctx.fillRect(swPos - 20 * scale, -targetR * 1.4, 40 * scale, targetR * 2.8);
              ctx.restore();
            }
            ctx.restore();
          }

        } else {
          // Standard Mode Collectible Orb (and fallback only if 3D relic PNG hasn't decoded yet)
          if (mode === 'dynamo' || mode === 'realm') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.55;
            ctx.drawImage(this._getGlowSprite('helix'), -targetR * 1.16, -targetR * 1.16, targetR * 2.32, targetR * 2.32);
            ctx.restore();

            if (LayeredT4Assets.loaded.nodeShell.dynamo) {
              ctx.drawImage(LayeredT4Assets.nodeShell.dynamo, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
            }
            const pOrb = ctx.createRadialGradient(-targetR * 0.22, -targetR * 0.25, targetR * 0.04, 0, 0, targetR);
            pOrb.addColorStop(0.0, 'rgba(255, 255, 255, 0.96)');
            pOrb.addColorStop(0.24, 'rgba(125, 211, 252, 0.88)');
            pOrb.addColorStop(0.55, 'rgba(147, 51, 234, 0.78)');
            pOrb.addColorStop(0.88, 'rgba(30, 58, 138, 0.82)');
            pOrb.addColorStop(1.0, 'rgba(56, 189, 248, 0.90)');
            ctx.fillStyle = pOrb;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.94, 0, Math.PI * 2);
            ctx.fill();
            drawInternalPlasmaArcs(ctx, 0, 0, targetR * 0.88, now, animPhase, false, 4);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.96, Math.PI * 0.55, Math.PI * 1.48);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.88)';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.96, -Math.PI * 0.45, Math.PI * 0.48);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.92)';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();
            ctx.restore();

            const ringR = targetR * 1.16;
            ctx.beginPath();
            ctx.arc(0, 0, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
            ctx.lineWidth = 1.4 * scale;
            ctx.stroke();
            const moteAngle = now * 0.0035 + animPhase;
            const mx1 = Math.cos(moteAngle) * ringR;
            const my1 = Math.sin(moteAngle) * ringR * 0.55;
            ctx.beginPath(); ctx.arc(mx1, my1, 4.2 * scale, 0, Math.PI * 2); ctx.fillStyle = '#00f0ff'; ctx.fill();
            ctx.beginPath(); ctx.arc(-mx1, -my1, 4.2 * scale, 0, Math.PI * 2); ctx.fillStyle = '#c084fc'; ctx.fill();
          } else if (mode === 'helix') {
            if (LayeredT4Assets.loaded.nodeShell.helix) {
              ctx.drawImage(LayeredT4Assets.nodeShell.helix, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
            }
            drawRotating3DDNAInsideGlass(ctx, 0, 0, targetR * 0.36, targetR * 0.78, now, animPhase, false, 4);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.52;
            ctx.drawImage(this._getGlowSprite('helix'), -targetR * 1.04, -targetR * 1.04, targetR * 2.08, targetR * 2.08);
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
            drawMeteorMagmaFissuresAndPlates(ctx, targetR, now, animPhase, rockAngle, 4, false);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.56;
            ctx.drawImage(this._getGlowSprite('gold'), -targetR * 1.18, targetR * 0.25 - targetR * 1.18, targetR * 2.36, targetR * 2.36);
            ctx.restore();
          }
        }

        // Gilded Luxury Double-Bevel Obsidian-Glass Badges for All 7 Powered-Up Good Nodes!
        const badges = {
          shield: {
            text: getRealmShieldMeta(mode).badge,
            color: '#fef9c3',
            bg: 'rgba(10, 14, 28, 0.93)',
            border: (sModeKey === 'helix') ? '#67e8f9' : ((sModeKey === 'meteor') ? '#fde047' : '#fbbf24')
          },
          missiles: { text: '🚀 MISSILES', color: '#e0f2fe', bg: 'rgba(8, 16, 34, 0.93)', border: '#38bdf8' },
          cluster: { text: '✨ 2X DUP', color: '#fae8ff', bg: 'rgba(18, 10, 32, 0.93)', border: '#e879f9' },
          supercharge: { text: '⚡ HYPER', color: '#fef9c3', bg: 'rgba(24, 15, 6, 0.93)', border: '#fbbf24' },
          chronos: { text: '⏳ STASIS', color: '#cffafe', bg: 'rgba(8, 22, 34, 0.93)', border: '#22d3ee' },
          singularity: { text: '🧲 VACUUM', color: '#e0f2fe', bg: 'rgba(10, 14, 30, 0.93)', border: '#fbbf24' },
          catalyst: { text: '💚 +1 LIFE', color: '#d1fae5', bg: 'rgba(4, 28, 22, 0.93)', border: '#34d399' }
        };

        if (badges[p.nodeClass]) {
          const b = badges[p.nodeClass];
          const bScale = Math.max(0.68, scale);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, -targetR * 1.62 - 3);
          const bFont = `bold ${Math.round(11 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, b.text);
          const padX = 8.5 * bScale;
          const padY = 4.5 * bScale;
          const bw = textW + padX * 2;
          const bh = 17.5 * bScale;
          const bx = -bw * 0.5;
          const by = -bh * 0.5;

          ctx.fillStyle = b.bg;
          ctx.strokeStyle = b.border;
          ctx.lineWidth = 1.6 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 8 * bScale);
          ctx.fill();
          ctx.stroke();

          // Inner champagne-gold luxury filigree hairline & top specular sheen
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
          ctx.lineWidth = 0.8 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx + 1.5 * bScale, by + 1.5 * bScale, bw - 3 * bScale, bh - 3 * bScale, 6.5 * bScale);
          ctx.stroke();

          ctx.fillStyle = b.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.text, 0, 0.5 * bScale);
          ctx.restore();
        }

      } else {
        // ─────────────────────────────────────────────────────────────
        // RENDER HAZARD TRAPS & 15 BESPOKE LUXURY RAYTRACED BAD CHROME CORES
        // ─────────────────────────────────────────────────────────────
        const hClass = p.nodeClass;
        const modeKey = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
        const isHyperComet = (hClass === 'hyper_comet' || hClass === 'plasma_flare');
        const isCorruptor = (hClass === 'corruptor_laser');
        const isGravityWell = (hClass === 'gravity_well' || hClass === 'vortex');
        const isEmpDetonator = (hClass === 'emp_detonator' || hClass === 'emp_glitch' || hClass === 'pulsar_mine');
        const isPhaseStalker = (hClass === 'phase_stalker' || hClass === 'tachyon_fracture');

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
          // ═══ UPGRADED v420 CLASSIC 3D BAD CORES & HOLLOW SEEKER SHURIKEN RING ═══
          const proxHeat = Math.max(0, Math.min(1, p._proxHeat || 0));
          if (mode === 'dynamo' || mode === 'realm') {
            const gSpr = LayeredT4Assets.loaded.hazardCore3D.dynamo ? LayeredT4Assets.hazardCore3D.dynamo : LayeredT4Assets.hazard.dynamoGlitch;
            const gReady = LayeredT4Assets.loaded.hazardCore3D.dynamo || LayeredT4Assets.loaded.hazard.dynamoGlitch;
            if (gSpr && gReady) {
              const numSlices = 7;
              const srcSize = gSpr.naturalWidth || 256;
              const sliceH = srcSize / numSlices;
              const glitchTick = Math.floor(now * (0.022 + proxHeat * 0.014) + animPhase * 3.0);
              const drawBox = LayeredT4Assets.loaded.hazardCore3D.dynamo ? 136 : 140;
              const outSliceH = (drawBox / numSlices) + 0.6;

              for (let s = 0; s < numSlices; s++) {
                const wave = Math.sin(glitchTick * 1.9 + s * 2.4 + animPhase);
                const isGlitchBand = (Math.abs(wave) > (0.42 - proxHeat * 0.14)) || (s === 2 || s === 4);
                const dxGlitch = isGlitchBand ? (wave * (7.5 + proxHeat * 4.5) * scale) : 0;

                const sy = s * sliceH;
                const dy = (-drawBox * 0.5 + s * (drawBox / numSlices)) * scale;
                const dw = drawBox * scale;
                const dh = outSliceH * scale;

                if (Math.abs(dxGlitch) > 3.2 * scale) {
                  ctx.save();
                  ctx.globalAlpha = 0.45 + proxHeat * 0.20;
                  ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, (-drawBox * 0.5) * scale - dxGlitch * 0.65, dy, dw, dh);
                  ctx.restore();
                }
                ctx.drawImage(gSpr, 0, sy, srcSize, sliceH, (-drawBox * 0.5) * scale + dxGlitch, dy, dw, dh);
              }
            }
          } else if (mode === 'helix') {
            const hSpr = LayeredT4Assets.loaded.hazardCore3D.helix ? LayeredT4Assets.hazardCore3D.helix : LayeredT4Assets.hazard.helixClean;
            const hReady = LayeredT4Assets.loaded.hazardCore3D.helix || LayeredT4Assets.loaded.hazard.helixClean;
            if (hSpr && hReady) {
              const hBox = (LayeredT4Assets.loaded.hazardCore3D.helix ? 136 : 120) * scale;
              ctx.save();
              ctx.rotate(now * 0.0012 + animPhase);
              ctx.drawImage(hSpr, -hBox * 0.5, -hBox * 0.5, hBox, hBox);
              ctx.restore();
            }
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
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
              const fr = targetR * 0.34;
              ctx.beginPath();
              for (let v = 0; v < 3; v++) {
                const va = fAng + v * (Math.PI * 2 / 3) + Math.sin(fPhase * 0.7 + v) * 0.22;
                const vx = fx + Math.cos(va) * fr;
                const vy = fy + Math.sin(va) * fr;
                if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
              }
              ctx.closePath();
              ctx.fillStyle = `rgba(255, 90, 115, ${0.10 + glint * (0.38 + proxHeat * 0.28)})`;
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
              ctx.scale(0.84, 0.84);
              ctx.globalAlpha = 0.78;
              ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
              ctx.restore();

              ctx.save();
              ctx.rotate(bladeAngle);
              ctx.scale(1.06, 1.06);
              ctx.drawImage(LayeredT4Assets.hazard.meteorBlades, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
              ctx.restore();
            }
            if (LayeredT4Assets.loaded.hazardCore3D.meteor) {
              ctx.save();
              ctx.rotate(now * 0.0014 + animPhase);
              ctx.drawImage(LayeredT4Assets.hazardCore3D.meteor, -64 * scale, -64 * scale, 128 * scale, 128 * scale);
              ctx.restore();
            } else if (LayeredT4Assets.loaded.hazard.meteorCenter) {
              ctx.drawImage(LayeredT4Assets.hazard.meteorCenter, -80 * scale, -80 * scale, 160 * scale, 160 * scale);
            }
            const eyePulse = 0.65 + 0.35 * Math.sin(now * 0.007 + animPhase) + proxHeat * 0.22;
            const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * (0.34 + proxHeat * 0.12));
            eg.addColorStop(0.0, `rgba(167, 243, 208, ${Math.min(1, 0.85 * eyePulse)})`);
            eg.addColorStop(0.5, `rgba(16, 185, 129, ${Math.min(1, 0.52 * eyePulse)})`);
            eg.addColorStop(1.0, 'rgba(6, 78, 59, 0)');
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (0.34 + proxHeat * 0.12), 0, Math.PI * 2);
            ctx.fill();
          }

          // Upgraded 3D Bladed Hunter-Seeker Shuriken Ring (Replaces Flat 2D Red Triangles!)
          if (p.nodeClass === 'seeker') {
            ctx.save();
            const finRot = now * 0.0042 + animPhase;
            if (LayeredT4Assets.loaded.hazardSeekerRing && LayeredT4Assets.hazardSeekerRing.naturalWidth > 0) {
              const srSize = 170 * scale;
              ctx.rotate(finRot);
              ctx.drawImage(LayeredT4Assets.hazardSeekerRing, -srSize * 0.5, -srSize * 0.5, srSize, srSize);
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = 0.36;
              ctx.drawImage(LayeredT4Assets.hazardSeekerRing, -srSize * 0.5, -srSize * 0.5, srSize, srSize);
            } else {
              for (let f = 0; f < 4; f++) {
                ctx.save();
                ctx.rotate(finRot + f * (Math.PI / 2));
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(targetR * 0.76, -targetR * 0.16);
                ctx.lineTo(targetR * 1.32, 0);
                ctx.lineTo(targetR * 0.76, targetR * 0.16);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }
            }
            ctx.globalCompositeOperation = 'lighter';
            const sEye = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * 0.48);
            sEye.addColorStop(0.0, '#ffffff');
            sEye.addColorStop(0.38, 'rgba(244, 63, 94, 0.85)');
            sEye.addColorStop(1.0, 'rgba(190, 18, 60, 0)');
            ctx.fillStyle = sEye;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.48, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

          } else if (p.nodeClass === 'fragmentation') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const fragPulse = 0.65 + 0.35 * Math.sin(now * 0.022 + animPhase);
            const pGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, targetR * (1.18 + 0.18 * fragPulse));
            if (modeKey === 'meteor') {
              pGrad.addColorStop(0.0, `rgba(240, 255, 248, ${0.85 * fragPulse})`);
              pGrad.addColorStop(0.35, `rgba(16, 185, 129, ${0.72 * fragPulse})`);
              pGrad.addColorStop(0.70, `rgba(168, 85, 247, ${0.42 * fragPulse})`);
              pGrad.addColorStop(1.0, 'rgba(88, 28, 135, 0)');
            } else {
              pGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.85 * fragPulse})`);
              pGrad.addColorStop(0.35, `rgba(244, 63, 94, ${0.72 * fragPulse})`);
              pGrad.addColorStop(0.70, `rgba(234, 88, 12, ${0.38 * fragPulse})`);
              pGrad.addColorStop(1.0, 'rgba(185, 28, 28, 0)');
            }
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * (1.18 + 0.18 * fragPulse), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

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

        // Crisp Crimson-Obsidian Threat Callout Pills for Powered Bad Nodes (Instant Contrast vs Gold Good Relics!)
        const badLabel = isHyperComet ? '☄️ COMET'
          : (isCorruptor ? '⚠️ LASER'
          : (isGravityWell ? '🕳️ VORTEX'
          : (isEmpDetonator ? '💥 EMP'
          : (isPhaseStalker ? '⚡ BLINK' : null))));
        const showBadPill = badLabel && (
          p.showThreatBadge ||
          (p._proxHeat || 0) > 0.12 ||
          p.cometPhase === 'charging' ||
          p.laserState === 'charging' ||
          (p.empCharge || 0) > 0.15 ||
          p.blinkState === 'telegraphing'
        );
        if (showBadPill) {
          const bScale = Math.max(0.66, scale);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, -targetR * 1.62 - 3);
          const bFont = `bold ${Math.round(10.5 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, badLabel);
          const padX = 7.5 * bScale;
          const bw = textW + padX * 2;
          const bh = 16.5 * bScale;
          ctx.fillStyle = 'rgba(28, 6, 14, 0.92)';
          ctx.strokeStyle = (modeKey === 'meteor') ? '#a855f7' : '#f43f5e';
          ctx.lineWidth = 1.5 * bScale;
          ctx.beginPath();
          ctx.roundRect(-bw * 0.5, -bh * 0.5, bw, bh, 7.5 * bScale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fecdd3';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badLabel, 0, 0.5 * bScale);
          ctx.restore();
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

    drawContactBurst(ctx, cx, contactY, mode, intensity, now, contactAngle = -Math.PI * 0.5) {
      drawCoreTopContactBurst(ctx, cx, contactY, mode, intensity, now, contactAngle);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // === CHANGED (v387): AUTHORITATIVE COMBAT, SKILLS, VOIDBLOOM & UI CONFIG ===
  // All names, cooldowns, sizes, damage multipliers, and Voidbloom stats live here.
  // ══════════════════════════════════════════════════════════════════════════
  const CONFIG = {
    names: {
      gun: 'EMBER CANNON',
      skill2: 'SEEKER COMETS',
      ult: 'CALDERA NOVA',
      voidbloom: 'VOIDBLOOM NODE'
    },
    // === CHANGED (v392): Per-Realm Weapon, 2nd-Skill Missile & Ultimate Signatures ===
    realmArsenal: {
      dynamo: { gun: 'TESLA RAILGUN', skill2: 'ARC SEEKERS',   ult: 'STORM NOVA',   s2Icon: '⚡', ultIcon: '🌩️', s2Count: 4, s2Dmg: 3.0 },
      helix:  { gun: 'HELIX CASTER',  skill2: 'PRISM SWARM',   ult: 'GENESIS NOVA', s2Icon: '💠', ultIcon: '🧬', s2Count: 6, s2Dmg: 2.0 },
      meteor: { gun: 'EMBER CANNON',  skill2: 'SEEKER COMETS', ult: 'CALDERA NOVA', s2Icon: '☄️', ultIcon: '🌋', s2Count: 4, s2Dmg: 3.0 }
    },
    ui: {
      gunBtnSize: 106,
      skill2BtnSize: 74,
      ultBtnSize: 84,
      pulseBtnSize: 58,
      btnOpacity: 0.92,
      pressedScale: 0.92,
      leftHandedKey: 'oc_left_handed_controls',
      moveModeKey: 'oc_touch_move_mode',
      joyMaxRadius: 44,
      joyFloatingTether: 34,
      joyDeadZone: 4,
      joyMaxSpeedPx: 940
    },
    gun: {
      fireDelayMs: 120,      // FIRE_DELAY = 120 ms (requestAnimationFrame gated, never setInterval)
      ammoPerShot: 1,
      emptyFlashMs: 320
    },
    skill2: {
      cooldownMs: 8000,      // SKILL2_CD = 8 s
      missileCount: 4,       // Default volley size (overridden per-realm via getRealmArsenal().s2Count)
      lockOnMs: 300,         // ~0.3 s target lock-on reticles before launch
      damageMultiplier: 3.0, // Default per-missile multiplier (12x total volley burst across realms)
      speed: 14.5,
      turnRate: 0.24,
      poolSize: 24
    },
    ult: {
      cooldownMs: 20000,     // === CHANGED (v392): Reduced ULT_CD from 35s to 20s ===
      bossMaxHpPct: 0.15,    // Deals EXACT certain 15% of boss max HP (no crit / armor-break inflation)
      bossPylonDmg: 6,       // Certain fixed damage to active shield pylons (no instant wipe)
      invulnMs: 2050,        // 2.05 s invulnerability on cast
      killChargeMs: 1200,    // Bonus cooldown charge per destroyed hazard/Voidbloom
      durationMs: 1750,      // Cinematic per-realm ultimate (fire / lightning storm / DNA genesis) duration
      screenShake: 34
    },
    voidbloom: {
      firstSpawnSec: 12,
      spawnIntervalMs: 18000,
      maxAlive: 2,
      telegraphMs: 1000,     // ~1 s spawn warning + sound cue before appearing
      minScale: 1.0,
      maxScale: 6.0,         // Grows from 1x to 6x over growDurationSec
      growDurationSec: 15,
      baseRadius: 18,
      maxViewportFrac: 0.20, // Capped so it never covers the whole screen or blocks HUD/boss bar
      baseHp: 4,
      maxHp: 28,
      baseSpeed: 1.55,
      minSpeedMult: 0.28,    // Slows dramatically as it grows huge
      ammoDrainPct: 0.25,    // Drains 25% of current ammo on contact (never below 0)
      smallRewardScore: 450,
      smallRewardAmmo: 14,
      hugeRewardScore: 3600,
      hugeRewardAmmo: 95,
      particlePoolSize: 96
    }
  };

  function getRealmArsenal(modeOverride) {
    const raw = modeOverride || (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
    const key = (raw === 'helix') ? 'helix' : (raw === 'meteor' ? 'meteor' : 'dynamo');
    return CONFIG.realmArsenal[key] || CONFIG.realmArsenal.dynamo;
  }

  const FIRE_DELAY = CONFIG.gun.fireDelayMs;

  // === CHANGED (v387): STEP 5 — UNLIMITED AMMO SAFE FORMATTER ===
  // Exact comma-formatted integer up to 9,999; compact 12.4K / 1.2M / 1.2B above; never NaN or scientific notation.
  function formatAmmoCount(rawVal) {
    if (!Number.isFinite(rawVal) || rawVal <= 0) return '0';
    const n = Math.floor(rawVal);
    if (n <= 9999) return n.toLocaleString('en-US');
    const units = [
      { v: 1e12, s: 'T' },
      { v: 1e9,  s: 'B' },
      { v: 1e6,  s: 'M' },
      { v: 1e3,  s: 'K' }
    ];
    for (let i = 0; i < units.length; i++) {
      if (n >= units[i].v) {
        const scaled = n / units[i].v;
        const txt = scaled >= 100 ? Math.floor(scaled).toString() : scaled.toFixed(1).replace(/\.0$/, '');
        return `${txt}${units[i].s}`;
      }
    }
    return String(n);
  }

  // === CHANGED (v387): STEP 2 — TOUCH-PRIMARY DEVICE DETECTION ===
  function detectTouchPrimary() {
    try {
      if (window.location.search.includes('touch_preview=1')) return true;
    } catch (_) {}
    if (typeof window.matchMedia === 'function') {
      const mqCoarse = window.matchMedia('(pointer: coarse)');
      const mqHoverNone = window.matchMedia('(hover: none)');
      const mqFine = window.matchMedia('(pointer: fine)');
      if (mqCoarse.matches && !mqFine.matches) return true;
      if (mqCoarse.matches && mqHoverNone.matches) return true;
      if (mqFine.matches) return false;
    }
    return (navigator.maxTouchPoints > 0) && ('ontouchstart' in window);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // === CHANGED (v387): STEP 3 & STEP 4 — TRUE MULTI-TOUCH ENGINE & KIMMY ARC ===
  // Tracks every active pointer by pointerId in a Map (MOVE | GUN | SKILL2 | ULT).
  // Supports 5+ simultaneous touches, iOS long-press hardening (30s+ steady hold),
  // left-handed mirror toggle, and desktop [A]/[S]/[D] key tracking & HUD strip.
  // ══════════════════════════════════════════════════════════════════════════
  const TouchFireControls = {
    isTouch: false,
    leftHanded: (() => {
      try { return localStorage.getItem(CONFIG.ui.leftHandedKey) === '1'; } catch (_) { return false; }
    })(),
    moveMode: (() => {
      try {
        const saved = localStorage.getItem(CONFIG.ui.moveModeKey);
        return (saved === 'onpoint' || saved === 'joystick') ? saved : 'joystick';
      } catch (_) { return 'joystick'; }
    })(),
    activePointers: new Map(), // pointerId -> { role: 'JOYSTICK'|'MOVE'|'GUN'|'SKILL2'|'ULT'|'PULSE', el }
    heldKeys: new Set(),       // Desktop held keyboard codes ('KeyA', 'KeyF', etc.)
    joyState: { active: false, pointerId: null, dx: 0, dy: 0, ux: 0, uy: 0, mag: 0, angleDeg: 0, homeX: 0, homeY: 0, originX: 0, originY: 0, baseX: 0, baseY: 0 },
    clusterEl: null,
    joyZoneEl: null,
    joyWrapEl: null,
    joyEl: null,
    joyDirArcEl: null,
    joyKnobEl: null,
    joyKnobImgEl: null,
    modePillEl: null,
    modeBtnStick: null,
    modeBtnOnPoint: null,
    gunBtn: null,
    skill2Btn: null,
    ultBtn: null,
    pulseBtn: null,
    pulseSweepEl: null,
    pulsePctEl: null,
    ammoEl: null,
    skill2SweepEl: null,
    skill2CdTextEl: null,
    ultSweepEl: null,
    ultCdTextEl: null,
    ultIconEl: null,
    ultCapEl: null,
    skill2IconEl: null,
    skill2SubEl: null,
    skill2CapEl: null,
    gunCapEl: null,
    gunCrestEl: null,
    deskHudEl: null,
    deskGunChip: null,
    deskGunName: null,
    deskGunStatus: null,
    deskSkill2Chip: null,
    deskSkill2Name: null,
    deskSkill2Status: null,
    deskUltChip: null,
    deskUltName: null,
    deskUltStatus: null,
    _emptyFlashTimer: null,
    _lastEmptyFlashAt: 0,
    _initialized: false,
    _cachedAmmoStr: null,
    _cachedHidden: null,
    _cachedDeskHidden: null,
    _cachedRealmMode: null,
    _cachedVisualTier: null,

    init() {
      if (this._initialized) return;
      this._initialized = true;

      this.isTouch = detectTouchPrimary();

      if (typeof window.matchMedia === 'function') {
        const mqCoarse = window.matchMedia('(pointer: coarse)');
        const mqHoverNone = window.matchMedia('(hover: none)');
        const onMediaChange = () => this.refreshMode();
        if (mqCoarse.addEventListener) {
          mqCoarse.addEventListener('change', onMediaChange);
          mqHoverNone.addEventListener('change', onMediaChange);
        } else if (mqCoarse.addListener) {
          mqCoarse.addListener(onMediaChange);
          mqHoverNone.addListener(onMediaChange);
        }
      }

      const preventIosGesture = (e) => {
        if (this.isTouch && state.active && e.cancelable) e.preventDefault();
      };
      document.addEventListener('gesturestart', preventIosGesture, { passive: false });
      document.addEventListener('gesturechange', preventIosGesture, { passive: false });
      document.addEventListener('gestureend', preventIosGesture, { passive: false });
      document.addEventListener('selectstart', (e) => {
        if (state.active && document.body.classList.contains('arcade-active')) e.preventDefault();
      });

      const clearAllInputs = () => {
        this.releaseAllPointers();
        this.clearHeldKeys();
      };
      window.addEventListener('blur', clearAllInputs);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearAllInputs();
          RealmMusicEngine.stop();
        } else if (state.active) {
          RealmMusicEngine.unlockOnGesture();
        }
      });

      const moveModeBtn = document.getElementById('cgMoveModeBtn');
      if (moveModeBtn) {
        moveModeBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggleMoveMode();
        };
      }

      const leftBtn = document.getElementById('cgLeftHandBtn');
      if (leftBtn) {
        leftBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggleLeftHanded();
        };
      }

      this.syncUI();
    },

    promoteToTouchOnRealTouch() {
      if (this.isTouch) return;
      this.isTouch = true;
      this.releaseAllPointers();
      this.clearHeldKeys();
      this.destroyDesktopHud();
      state.offenseMode = false;
      state.pointerFiring = false;
      this.syncUI();
      if (typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    hasRole(role) {
      for (const entry of this.activePointers.values()) {
        if (entry.role === role) return true;
      }
      return false;
    },

    isGunHeld() {
      return this.hasRole('GUN');
    },

    isDesktopKeyGunHeld() {
      return !this.isTouch && (this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF'));
    },

    getMovePointerId() {
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'MOVE') return pid;
      }
      return null;
    },

    setMoveMode(nextMode) {
      const m = (nextMode === 'onpoint') ? 'onpoint' : 'joystick';
      if (this.moveMode === m) {
        this._syncMoveModeUI();
        return;
      }
      this.moveMode = m;
      try { localStorage.setItem(CONFIG.ui.moveModeKey, m); } catch (_) {}
      // Cleanly reset any active steering pointer when switching mode
      const steerIds = [];
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'MOVE' || entry.role === 'JOYSTICK') steerIds.push(pid);
      }
      steerIds.forEach((pid) => this.releasePointer(pid));
      this._resetJoystickVisual();
      this._syncMoveModeUI();
      if (typeof updateTargetText === 'function') updateTargetText();
    },

    toggleMoveMode() {
      this.setMoveMode(this.moveMode === 'joystick' ? 'onpoint' : 'joystick');
    },

    _syncMoveModeUI() {
      const isStick = (this.moveMode === 'joystick');
      if (this.clusterEl) {
        this.clusterEl.setAttribute('data-move-mode', this.moveMode);
      }
      if (this.modeBtnStick) this.modeBtnStick.classList.toggle('is-active', isStick);
      if (this.modeBtnOnPoint) this.modeBtnOnPoint.classList.toggle('is-active', !isStick);
      const topBtn = document.getElementById('cgMoveModeBtn');
      if (topBtn) {
        const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
        topBtn.style.display = (this.isTouch && isCoreArcade) ? '' : 'none';
        topBtn.classList.toggle('oc-btn-active', isStick);
        topBtn.title = isStick
          ? 'Touch Steering: Virtual Joystick ON (Tap to switch to On-Point Touch)'
          : 'Touch Steering: On-Point Touch ON (Tap to switch to Virtual Joystick)';
      }
    },

    toggleLeftHanded() {
      this.leftHanded = !this.leftHanded;
      try { localStorage.setItem(CONFIG.ui.leftHandedKey, this.leftHanded ? '1' : '0'); } catch (_) {}
      if (this.clusterEl) {
        this.clusterEl.classList.toggle('left-handed', this.leftHanded);
      }
      this._syncLeftHandBtn();
    },

    _syncLeftHandBtn() {
      const leftBtn = document.getElementById('cgLeftHandBtn');
      if (!leftBtn) return;
      const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      leftBtn.style.display = (this.isTouch && isCoreArcade) ? '' : 'none';
      leftBtn.classList.toggle('oc-btn-active', this.leftHanded);
      leftBtn.title = this.leftHanded ? 'Left-Handed Layout ON (Tap for Right-Handed)' : 'Right-Handed Layout (Tap for Left-Handed)';
    },

    refreshMode() {
      const nextIsTouch = detectTouchPrimary();
      if (nextIsTouch === this.isTouch) {
        this.syncUI();
        return;
      }
      this.isTouch = nextIsTouch;
      this.releaseAllPointers();
      this.clearHeldKeys();
      if (!this.isTouch) {
        this.destroyTouchCluster();
      } else {
        this.destroyDesktopHud();
        state.offenseMode = false;
        state.pointerFiring = false;
      }
      this.syncUI();
      if (typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    _resetJoystickVisual() {
      this.joyState.active = false;
      this.joyState.pointerId = null;
      this.joyState.dx = 0;
      this.joyState.dy = 0;
      this.joyState.ux = 0;
      this.joyState.uy = 0;
      this.joyState.mag = 0;
      this.joyState.baseX = 0;
      this.joyState.baseY = 0;
      if (this.joyEl) {
        this.joyEl.classList.remove('is-active');
        this.joyEl.style.setProperty('--joy-base-x', '0px');
        this.joyEl.style.setProperty('--joy-base-y', '0px');
        this.joyEl.style.setProperty('--joy-x', '0px');
        this.joyEl.style.setProperty('--joy-y', '0px');
        this.joyEl.style.setProperty('--joy-mag', '0');
      }
    },

    _beginJoystickAt(clientX, clientY) {
      if (!this.joyWrapEl || !this.joyEl) return;
      const wRect = this.joyWrapEl.getBoundingClientRect();
      const homeX = wRect.left + wRect.width * 0.5;
      const homeY = wRect.top + wRect.height * 0.5;
      const tether = CONFIG.ui.joyFloatingTether || 34;
      const ox = clientX - homeX;
      const oy = clientY - homeY;
      const od = Math.hypot(ox, oy);
      let bx = ox;
      let by = oy;
      if (od > tether && od > 0.001) {
        bx = (ox / od) * tether;
        by = (oy / od) * tether;
      }
      this.joyState.homeX = homeX;
      this.joyState.homeY = homeY;
      this.joyState.baseX = bx;
      this.joyState.baseY = by;
      this.joyState.originX = homeX + bx;
      this.joyState.originY = homeY + by;
      this.joyEl.style.setProperty('--joy-base-x', `${bx.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-base-y', `${by.toFixed(1)}px`);
      this._updateJoystickVector(clientX, clientY);
    },

    _updateJoystickVector(clientX, clientY) {
      if (!this.joyEl) return;
      const ox = this.joyState.originX || this.joyState.homeX;
      const oy = this.joyState.originY || this.joyState.homeY;

      const maxR = CONFIG.ui.joyMaxRadius || 44;
      const dead = CONFIG.ui.joyDeadZone || 4;
      const rawDx = clientX - ox;
      const rawDy = clientY - oy;
      const dist = Math.hypot(rawDx, rawDy);
      const angleRad = Math.atan2(rawDy, rawDx);
      const clampedR = Math.min(maxR, dist);
      const visX = dist > 0.001 ? Math.cos(angleRad) * clampedR : 0;
      const visY = dist > 0.001 ? Math.sin(angleRad) * clampedR : 0;

      let ux = 0;
      let uy = 0;
      let mag = 0;
      if (dist > dead) {
        mag = Math.min(1, (dist - dead) / Math.max(8, maxR - dead));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
      }

      const angleDeg = (angleRad * 180 / Math.PI);
      this.joyState.dx = visX;
      this.joyState.dy = visY;
      this.joyState.ux = ux;
      this.joyState.uy = uy;
      this.joyState.mag = mag;
      this.joyState.angleDeg = angleDeg;

      this.joyEl.style.setProperty('--joy-x', `${visX.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-y', `${visY.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-angle', `${angleDeg.toFixed(1)}deg`);
      this.joyEl.style.setProperty('--joy-mag', mag.toFixed(3));
    },

    _bindJoystickEvents(targetEl) {
      if (!targetEl) return;
      ['touchstart', 'touchmove', 'touchend'].forEach((evt) => {
        targetEl.addEventListener(evt, (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      });
      targetEl.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });

      targetEl.addEventListener('pointerdown', (e) => {
        if (!this.isTouch || !state.active || this.moveMode !== 'joystick') return;
        e.preventDefault();
        e.stopPropagation();
        RealmMusicEngine.unlockOnGesture();

        if (this.joyState.active && this.joyState.pointerId !== null && this.joyState.pointerId !== e.pointerId) {
          this.releasePointer(this.joyState.pointerId);
        }
        this.activePointers.set(e.pointerId, { role: 'JOYSTICK', el: targetEl });
        try { targetEl.setPointerCapture(e.pointerId); } catch (_) {}
        if (this.joyEl) this.joyEl.classList.add('is-active');
        this.joyState.active = true;
        this.joyState.pointerId = e.pointerId;
        this._beginJoystickAt(e.clientX, e.clientY);
      }, { passive: false });

      targetEl.addEventListener('pointermove', (e) => {
        if (!this.isTouch || !state.active || this.moveMode !== 'joystick') return;
        if (this.joyState.pointerId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        const events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
        const lastEv = events[events.length - 1] || e;
        this._updateJoystickVector(lastEv.clientX, lastEv.clientY);
      }, { passive: false });

      const onRelease = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (e && e.pointerId !== undefined) this.releasePointer(e.pointerId);
      };
      targetEl.addEventListener('pointerup', onRelease, { passive: true });
      targetEl.addEventListener('pointercancel', onRelease, { passive: true });
      targetEl.addEventListener('lostpointercapture', onRelease, { passive: true });
    },

    _bindPadPointerEvents(el, role, onDownAction) {
      el.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });
      el.addEventListener('dragstart', (e) => { e.preventDefault(); e.stopPropagation(); });

      el.addEventListener('pointerdown', (e) => {
        if (!this.isTouch || !state.active) return;
        e.preventDefault();
        e.stopPropagation();
        RealmMusicEngine.unlockOnGesture();

        this.activePointers.set(e.pointerId, { role, el });
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        el.classList.add('is-held');

        if (typeof onDownAction === 'function') onDownAction(e);
        if (role === 'GUN') {
          state.touchFireHeld = true;
          if ((state.coreAmmo || 0) <= 0) this.flashEmpty();
          if (typeof updateHeaderUI === 'function') updateHeaderUI();
        }
      }, { passive: false });

      const releaseThisPointer = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (e && e.pointerId !== undefined) {
          this.releasePointer(e.pointerId);
        }
      };

      el.addEventListener('pointerup', releaseThisPointer, { passive: true });
      el.addEventListener('pointercancel', releaseThisPointer, { passive: true });
      el.addEventListener('lostpointercapture', releaseThisPointer, { passive: true });
    },

    _buildLuxuryFiligreeSvg(kind) {
      const strokeCol = kind === 'ult'
        ? 'rgba(253,224,71,0.62)'
        : (kind === 'skill2' ? 'rgba(103,232,249,0.56)' : (kind === 'pulse' ? 'rgba(110,231,183,0.56)' : 'rgba(253,224,71,0.54)'));
      return (
        '<svg class="oc-pad-filigree" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle cx="50" cy="50" r="45" fill="none" stroke="' + strokeCol + '" stroke-width="1.1" stroke-dasharray="14 4 3 4"/>' +
          '<circle cx="50" cy="50" r="39" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.7"/>' +
          '<path d="M50 2 L53 8 L50 12 L47 8 Z M50 98 L53 92 L50 88 L47 92 Z M2 50 L8 53 L12 50 L8 47 Z M98 50 L92 53 L88 50 L92 47 Z" fill="' + strokeCol + '"/>' +
        '</svg>'
      );
    },

    _buildGunCrownFrameSvg(mode) {
      const accent = mode === 'helix' ? '#67e8f9' : (mode === 'meteor' ? '#fb923c' : '#38bdf8');
      return (
        '<svg class="oc-gun-crown-frame" viewBox="0 0 128 128" aria-hidden="true">' +
          '<defs>' +
            '<linearGradient id="ocGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="#fef08a"/>' +
              '<stop offset="50%" stop-color="#f59e0b"/>' +
              '<stop offset="100%" stop-color="#fde047"/>' +
            '</linearGradient>' +
          '</defs>' +
          '<path d="M22 106 L10 92 L18 84 L30 98 Z M106 22 L118 36 L110 44 L98 30 Z M16 26 L28 14 L38 20 L24 34 Z" fill="url(#ocGoldRim)" opacity="0.82"/>' +
          '<path d="M18 64 A46 46 0 0 1 64 18 M110 64 A46 46 0 0 1 64 110" fill="none" stroke="' + accent + '" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>' +
          '<polygon points="64,3 69,11 64,15 59,11" fill="#fef08a"/>' +
          '<polygon points="3,64 11,59 15,64 11,69" fill="#fef08a"/>' +
        '</svg>'
      );
    },

    _buildJoyDialSvg(mode) {
      const tint = mode === 'helix' ? 'rgba(103,232,249,0.48)' : (mode === 'meteor' ? 'rgba(251,146,60,0.48)' : 'rgba(56,189,248,0.48)');
      return (
        '<svg class="oc-joy-dial-svg" viewBox="0 0 140 140" aria-hidden="true">' +
          '<circle cx="70" cy="70" r="64" fill="none" stroke="rgba(253,224,71,0.34)" stroke-width="1" stroke-dasharray="10 6"/>' +
          '<circle cx="70" cy="70" r="48" fill="none" stroke="' + tint + '" stroke-width="0.9" stroke-dasharray="2 5"/>' +
          '<path d="M70 8 L74 16 L66 16 Z M70 132 L74 124 L66 124 Z M8 70 L16 66 L16 74 Z M132 70 L124 66 L124 74 Z" fill="rgba(254,240,138,0.68)"/>' +
        '</svg>'
      );
    },

    _buildTouchPadArtwork(mode, role, tierOverride) {
      const m = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = tierOverride || ((typeof state !== 'undefined' && state.coreTier) || 1);
      if (role === 'ult' || role === 'joyknob') {
        const cls = role === 'joyknob' ? 'oc-joy-knob-img' : 'oc-ult-mini-core';
        const src = curTier >= 6
          ? `assets/core-${m}-t6-showcase.png?v=arcade416_relic_trails_coronation`
          : `assets/core-${m}-t5.png?v=arcade416_relic_trails_coronation`;
        return `<img class="${cls}" src="${src}" alt="" draggable="false" />`;
      }
      if (role === 'pulse') {
        return (
          '<svg class="oc-pad-emblem-svg" viewBox="0 0 48 48" aria-hidden="true">' +
            '<defs><linearGradient id="ocPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>' +
            '<polygon points="26,4 11,26 23,26 19,44 37,20 25,20" fill="url(#ocPulseGrad)" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>' +
          '</svg>'
        );
      }
      if (role === 'skill2') {
        if (m === 'helix') {
          return (
            '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
              '<defs>' +
                '<linearGradient id="ocHxS2C" x1="0%" y1="0%" x2="100%" y2="100%">' +
                  '<stop offset="0%" stop-color="#ecfeff"/>' +
                  '<stop offset="45%" stop-color="#22d3ee"/>' +
                  '<stop offset="100%" stop-color="#a855f7"/>' +
                '</linearGradient>' +
                '<linearGradient id="ocHxS2M" x1="100%" y1="0%" x2="0%" y2="100%">' +
                  '<stop offset="0%" stop-color="#f5d0fe"/>' +
                  '<stop offset="50%" stop-color="#e879f9"/>' +
                  '<stop offset="100%" stop-color="#0284c7"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<polygon points="32,5 44,22 32,46 20,22" fill="url(#ocHxS2C)" stroke="#ffffff" stroke-width="1.2"/>' +
              '<polygon points="32,5 44,22 32,27" fill="rgba(255,255,255,0.45)"/>' +
              '<polygon points="15,20 24,33 15,50 7,33" fill="url(#ocHxS2M)" stroke="#f0abfc" stroke-width="1"/>' +
              '<polygon points="49,20 57,33 49,50 40,33" fill="url(#ocHxS2M)" stroke="#67e8f9" stroke-width="1"/>' +
              '<circle cx="32" cy="22" r="3" fill="#ffffff"/>' +
            '</svg>'
          );
        }
        if (m === 'meteor') {
          return (
            '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
              '<defs>' +
                '<radialGradient id="ocMtS2Core" cx="38%" cy="35%" r="65%">' +
                  '<stop offset="0%" stop-color="#fef08a"/>' +
                  '<stop offset="45%" stop-color="#f97316"/>' +
                  '<stop offset="85%" stop-color="#991b1b"/>' +
                  '<stop offset="100%" stop-color="#450a0a"/>' +
                '</radialGradient>' +
                '<linearGradient id="ocMtS2Tail" x1="20%" y1="20%" x2="95%" y2="95%">' +
                  '<stop offset="0%" stop-color="#fde047"/>' +
                  '<stop offset="50%" stop-color="#f97316" stop-opacity="0.85"/>' +
                  '<stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<path d="M18 18 C34 20, 52 34, 58 56 C40 48, 24 36, 18 18 Z" fill="url(#ocMtS2Tail)"/>' +
              '<path d="M12 28 C28 10, 44 26, 28 44 Z" fill="none" stroke="#fde047" stroke-width="1.6" stroke-opacity="0.8"/>' +
              '<circle cx="24" cy="24" r="13" fill="url(#ocMtS2Core)" stroke="#fde047" stroke-width="1.3"/>' +
              '<path d="M16 21 Q24 25 31 19 M19 30 Q25 26 32 31" stroke="#fef9c3" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
            '</svg>'
          );
        }
        return (
          '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
            '<defs>' +
              '<linearGradient id="ocDyS2G" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#ffffff"/>' +
                '<stop offset="38%" stop-color="#67e8f9"/>' +
                '<stop offset="100%" stop-color="#a855f7"/>' +
              '</linearGradient>' +
              '<linearGradient id="ocDyS2Gold" x1="0%" y1="0%" x2="0%" y2="100%">' +
                '<stop offset="0%" stop-color="#fef08a"/>' +
                '<stop offset="100%" stop-color="#d97706"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<circle cx="32" cy="32" r="22" fill="none" stroke="url(#ocDyS2Gold)" stroke-width="1.5" stroke-dasharray="7 4"/>' +
            '<polygon points="35,6 16,34 30,34 25,58 48,28 34,28" fill="url(#ocDyS2G)" stroke="#fef08a" stroke-width="1.2" stroke-linejoin="round"/>' +
          '</svg>'
        );
      }
      // role === 'gun' ornate realm weapon crest
      if (m === 'helix') {
        return (
          '<svg viewBox="0 0 40 26" aria-hidden="true">' +
            '<path d="M7 21 L14 4 L20 14 L26 4 L33 21 L20 16 Z" fill="rgba(103,232,249,0.34)" stroke="#a5f3fc" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<circle cx="20" cy="11" r="3.2" fill="#f0abfc" stroke="#ffffff" stroke-width="0.9"/>' +
          '</svg>'
        );
      }
      if (m === 'meteor') {
        return (
          '<svg viewBox="0 0 40 26" aria-hidden="true">' +
            '<path d="M6 21 L14 4 L20 13 L26 4 L34 21 L20 15 Z" fill="rgba(251,146,60,0.48)" stroke="#fde047" stroke-width="1.7" stroke-linejoin="round"/>' +
            '<circle cx="20" cy="11" r="3.4" fill="#fef08a"/>' +
          '</svg>'
        );
      }
      return (
        '<svg viewBox="0 0 40 26" aria-hidden="true">' +
          '<path d="M6 21 L14 4 L20 13 L26 4 L34 21 L20 15 Z" fill="rgba(56,189,248,0.44)" stroke="#fde047" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<circle cx="20" cy="11" r="3.2" fill="#e0f2fe"/>' +
        '</svg>'
      );
    },

    ensureTouchCluster() {
      if (!this.isTouch) return null;
      if (this.clusterEl && this.clusterEl.isConnected) return this.clusterEl;

      const host = dom.viewReflex || document.getElementById('cgViewReflex');
      if (!host) return null;

      const rawMode = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (rawMode === 'helix') ? 'helix' : (rawMode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = (typeof state !== 'undefined' && state.coreTier) || 1;
      const ars = getRealmArsenal(curMode);

      const cluster = document.createElement('div');
      cluster.id = 'ocTouchControlCluster';
      cluster.className = 'oc-touch-hidden' + (this.leftHanded ? ' left-handed' : '');
      cluster.setAttribute('data-realm', curMode);
      cluster.setAttribute('data-move-mode', this.moveMode);
      cluster.setAttribute('aria-label', 'Touch Combat & Virtual Joystick Controls');

      const knobSrc = curTier >= 6
        ? `assets/core-${curMode}-t6-showcase.png?v=arcade416_relic_trails_coronation`
        : `assets/core-${curMode}-t5.png?v=arcade416_relic_trails_coronation`;

      cluster.innerHTML =
        '<div id="ocTouchModePill" role="group" aria-label="Touch Movement Mode">' +
          '<button type="button" class="oc-mode-seg' + (this.moveMode === 'joystick' ? ' is-active' : '') + '" id="ocModeSegStick" data-mode="joystick">STICK</button>' +
          '<button type="button" class="oc-mode-seg' + (this.moveMode === 'onpoint' ? ' is-active' : '') + '" id="ocModeSegOnPoint" data-mode="onpoint">ON-POINT</button>' +
        '</div>' +
        '<div id="ocVirtualJoystickZone" aria-hidden="true"></div>' +
        '<div id="ocVirtualJoystickWrap">' +
          '<div id="ocVirtualJoystick" role="slider" aria-label="Virtual Flight Joystick" aria-valuemin="0" aria-valuemax="100">' +
            this._buildJoyDialSvg(curMode) +
            '<div id="ocJoyDirArc"></div>' +
            '<div id="ocVirtualJoyKnob">' +
              '<img class="oc-joy-knob-img" id="ocJoyKnobImg" src="' + knobSrc + '" alt="" draggable="false" />' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-pulse">' +
          '<div role="button" tabindex="-1" id="ocTouchPulseBtn" class="oc-touch-pad is-charging" aria-label="Flux Pulse">' +
            this._buildLuxuryFiligreeSvg('pulse') +
            '<div class="oc-pulse-sweep" id="ocTouchPulseSweep"></div>' +
            '<span class="oc-pad-icon">' + this._buildTouchPadArtwork(curMode, 'pulse', curTier) + '</span>' +
            '<span class="oc-pulse-pct" id="ocTouchPulsePct">0%</span>' +
          '</div>' +
          '<span class="oc-pad-caption">PULSE</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-ult">' +
          '<div role="button" tabindex="-1" id="ocTouchUltBtn" class="oc-touch-pad" aria-label="' + ars.ult + '">' +
            this._buildLuxuryFiligreeSvg('ult') +
            '<span class="oc-pad-icon" id="ocTouchUltIcon">' + this._buildTouchPadArtwork(curMode, 'ult', curTier) + '</span>' +
            '<span class="oc-fire-sub">ULT</span>' +
            '<div class="oc-cd-sweep" id="ocTouchUltSweep"></div>' +
            '<div class="oc-cd-text" id="ocTouchUltCdText"></div>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchUltCap">' + ars.ult + '</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-skill2">' +
          '<div role="button" tabindex="-1" id="ocTouchSkill2Btn" class="oc-touch-pad" aria-label="' + ars.skill2 + '">' +
            this._buildLuxuryFiligreeSvg('skill2') +
            '<span class="oc-pad-icon" id="ocTouchSkill2Icon">' + this._buildTouchPadArtwork(curMode, 'skill2', curTier) + '</span>' +
            '<span class="oc-fire-sub" id="ocTouchSkill2Sub">' + ars.s2Count + '×</span>' +
            '<div class="oc-cd-sweep" id="ocTouchSkill2Sweep"></div>' +
            '<div class="oc-cd-text" id="ocTouchSkill2CdText"></div>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchSkill2Cap">' + ars.skill2 + '</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-gun">' +
          this._buildGunCrownFrameSvg(curMode) +
          '<div role="button" tabindex="-1" id="ocTouchGunBtn" class="oc-touch-pad" aria-label="' + ars.gun + '">' +
            this._buildLuxuryFiligreeSvg('gun') +
            '<span class="oc-gun-crest" id="ocTouchGunCrest">' + this._buildTouchPadArtwork(curMode, 'gun', curTier) + '</span>' +
            '<span class="oc-fire-label">FIRE</span>' +
            '<span class="oc-fire-ammo" id="ocTouchFireAmmo">0</span>' +
            '<span class="oc-fire-sub">HOLD</span>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchGunCap">' + ars.gun + '</span>' +
        '</div>';

      host.appendChild(cluster);
      this.clusterEl = cluster;
      this.joyZoneEl = cluster.querySelector('#ocVirtualJoystickZone');
      this.joyWrapEl = cluster.querySelector('#ocVirtualJoystickWrap');
      this.joyEl = cluster.querySelector('#ocVirtualJoystick');
      this.joyDirArcEl = cluster.querySelector('#ocJoyDirArc');
      this.joyKnobEl = cluster.querySelector('#ocVirtualJoyKnob');
      this.joyKnobImgEl = cluster.querySelector('#ocJoyKnobImg');
      this.modePillEl = cluster.querySelector('#ocTouchModePill');
      this.modeBtnStick = cluster.querySelector('#ocModeSegStick');
      this.modeBtnOnPoint = cluster.querySelector('#ocModeSegOnPoint');
      this.pulseBtn = cluster.querySelector('#ocTouchPulseBtn');
      this.pulseSweepEl = cluster.querySelector('#ocTouchPulseSweep');
      this.pulsePctEl = cluster.querySelector('#ocTouchPulsePct');
      this.gunBtn = cluster.querySelector('#ocTouchGunBtn');
      this.skill2Btn = cluster.querySelector('#ocTouchSkill2Btn');
      this.ultBtn = cluster.querySelector('#ocTouchUltBtn');
      this.ammoEl = cluster.querySelector('#ocTouchFireAmmo');
      this.skill2SweepEl = cluster.querySelector('#ocTouchSkill2Sweep');
      this.skill2CdTextEl = cluster.querySelector('#ocTouchSkill2CdText');
      this.ultSweepEl = cluster.querySelector('#ocTouchUltSweep');
      this.ultCdTextEl = cluster.querySelector('#ocTouchUltCdText');
      this.ultIconEl = cluster.querySelector('#ocTouchUltIcon');
      this.ultCapEl = cluster.querySelector('#ocTouchUltCap');
      this.skill2IconEl = cluster.querySelector('#ocTouchSkill2Icon');
      this.skill2SubEl = cluster.querySelector('#ocTouchSkill2Sub');
      this.skill2CapEl = cluster.querySelector('#ocTouchSkill2Cap');
      this.gunCapEl = cluster.querySelector('#ocTouchGunCap');
      this.gunCrestEl = cluster.querySelector('#ocTouchGunCrest');

      if (this.joyZoneEl) this._bindJoystickEvents(this.joyZoneEl);
      if (this.joyEl) this._bindJoystickEvents(this.joyEl);

      if (this.modePillEl) {
        this.modePillEl.addEventListener('touchstart', (e) => { e.stopPropagation(); }, { passive: true });
        this.modePillEl.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
      }
      if (this.modeBtnStick) this.modeBtnStick.onclick = (e) => { e.stopPropagation(); this.setMoveMode('joystick'); };
      if (this.modeBtnOnPoint) this.modeBtnOnPoint.onclick = (e) => { e.stopPropagation(); this.setMoveMode('onpoint'); };

      this._bindPadPointerEvents(this.gunBtn, 'GUN');
      this._bindPadPointerEvents(this.skill2Btn, 'SKILL2', () => {
        SkillSystem.castSeekerComets(performance.now());
      });
      this._bindPadPointerEvents(this.ultBtn, 'ULT', () => {
        SkillSystem.castCalderaNova(performance.now());
      });
      this._bindPadPointerEvents(this.pulseBtn, 'PULSE', () => {
        if (typeof window.triggerFluxPulse === 'function') window.triggerFluxPulse(false);
      });

      this._syncMoveModeUI();
      this._cachedAmmoStr = null;
      this._cachedHidden = true;
      this._cachedRealmMode = null;
      this._cachedVisualTier = curTier;
      return cluster;
    },

    ensureDesktopHud() {
      if (this.isTouch) return null;
      if (this.deskHudEl && this.deskHudEl.isConnected) return this.deskHudEl;

      const host = dom.viewReflex || document.getElementById('cgViewReflex');
      if (!host) return null;

      const rawMode = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (rawMode === 'helix') ? 'helix' : (rawMode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = (typeof state !== 'undefined' && state.coreTier) || 1;
      const ars = getRealmArsenal(curMode);

      const hud = document.createElement('div');
      hud.id = 'ocDesktopSkillHud';
      hud.className = 'oc-desk-hidden';
      hud.innerHTML =
        '<div class="oc-desk-chip" data-skill="gun" id="ocDeskGunChip">' +
          '<span class="oc-desk-keycap">A</span>' +
          '<span class="oc-desk-emblem" id="ocDeskGunEmb">' + this._buildTouchPadArtwork(curMode, 'gun', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskGunName">' + ars.gun + '</span>' +
            '<span class="oc-desk-status" id="ocDeskGunStatus">HOLD</span>' +
          '</div>' +
        '</div>' +
        '<div class="oc-desk-chip" data-skill="skill2" id="ocDeskSkill2Chip">' +
          '<span class="oc-desk-keycap">S</span>' +
          '<span class="oc-desk-emblem" id="ocDeskSkill2Emb">' + this._buildTouchPadArtwork(curMode, 'skill2', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskSkill2Name">' + ars.skill2 + '</span>' +
            '<span class="oc-desk-status" id="ocDeskSkill2Status">READY</span>' +
          '</div>' +
          '<div class="oc-desk-cdbar" id="ocDeskSkill2Bar"></div>' +
        '</div>' +
        '<div class="oc-desk-chip" data-skill="ult" id="ocDeskUltChip">' +
          '<span class="oc-desk-keycap">D</span>' +
          '<span class="oc-desk-emblem" id="ocDeskUltEmb">' + this._buildTouchPadArtwork(curMode, 'ult', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskUltName">' + ars.ult + '</span>' +
            '<span class="oc-desk-status" id="ocDeskUltStatus">READY</span>' +
          '</div>' +
          '<div class="oc-desk-cdbar" id="ocDeskUltBar"></div>' +
        '</div>';

      host.appendChild(hud);
      this.deskHudEl = hud;
      this.deskGunChip = hud.querySelector('#ocDeskGunChip');
      this.deskGunEmb = hud.querySelector('#ocDeskGunEmb');
      this.deskGunName = hud.querySelector('#ocDeskGunName');
      this.deskGunStatus = hud.querySelector('#ocDeskGunStatus');
      this.deskSkill2Chip = hud.querySelector('#ocDeskSkill2Chip');
      this.deskSkill2Emb = hud.querySelector('#ocDeskSkill2Emb');
      this.deskSkill2Name = hud.querySelector('#ocDeskSkill2Name');
      this.deskSkill2Status = hud.querySelector('#ocDeskSkill2Status');
      this.deskSkill2Bar = hud.querySelector('#ocDeskSkill2Bar');
      this.deskUltChip = hud.querySelector('#ocDeskUltChip');
      this.deskUltEmb = hud.querySelector('#ocDeskUltEmb');
      this.deskUltName = hud.querySelector('#ocDeskUltName');
      this.deskUltStatus = hud.querySelector('#ocDeskUltStatus');
      this.deskUltBar = hud.querySelector('#ocDeskUltBar');

      // Interactive mouse click/hold on enhanced desktop skill cards
      if (this.deskGunChip) {
        this.deskGunChip.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 || !state.active) return;
          e.stopPropagation();
          state.pointerFiring = true;
          if ((state.coreAmmo || 0) <= 0) this.flashEmpty();
          updateHeaderUI();
        });
        const stopDeskGun = () => {
          if (state.pointerFiring) {
            state.pointerFiring = false;
            updateHeaderUI();
          }
        };
        this.deskGunChip.addEventListener('pointerup', stopDeskGun);
        this.deskGunChip.addEventListener('pointerleave', stopDeskGun);
      }
      if (this.deskSkill2Chip) {
        this.deskSkill2Chip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.active) SkillSystem.castSeekerComets(performance.now());
        });
      }
      if (this.deskUltChip) {
        this.deskUltChip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.active) SkillSystem.castCalderaNova(performance.now());
        });
      }

      this._cachedDeskHidden = true;
      this._cachedRealmMode = null;
      this._cachedVisualTier = curTier;
      return hud;
    },

    destroyTouchCluster() {
      if (this._emptyFlashTimer) {
        clearTimeout(this._emptyFlashTimer);
        this._emptyFlashTimer = null;
      }
      if (this.clusterEl && this.clusterEl.parentNode) {
        this.clusterEl.parentNode.removeChild(this.clusterEl);
      }
      this.clusterEl = null;
      this.joyZoneEl = null;
      this.joyWrapEl = null;
      this.joyEl = null;
      this.joyDirArcEl = null;
      this.joyKnobEl = null;
      this.joyKnobImgEl = null;
      this.modePillEl = null;
      this.modeBtnStick = null;
      this.modeBtnOnPoint = null;
      this.pulseBtn = null;
      this.pulseSweepEl = null;
      this.pulsePctEl = null;
      this.gunBtn = null;
      this.skill2Btn = null;
      this.ultBtn = null;
      this.ammoEl = null;
      this.skill2SweepEl = null;
      this.skill2CdTextEl = null;
      this.ultSweepEl = null;
      this.ultCdTextEl = null;
      this.ultIconEl = null;
      this.ultCapEl = null;
      this.skill2IconEl = null;
      this.skill2SubEl = null;
      this.skill2CapEl = null;
      this.gunCapEl = null;
      this.gunCrestEl = null;
      this._cachedAmmoStr = null;
      this._cachedHidden = null;
      this._cachedRealmMode = null;
      this._cachedVisualTier = null;
      this._cdCache = {};
      this._resetJoystickVisual();
    },

    destroyDesktopHud() {
      if (this.deskHudEl && this.deskHudEl.parentNode) {
        this.deskHudEl.parentNode.removeChild(this.deskHudEl);
      }
      this.deskHudEl = null;
      this.deskGunChip = null;
      this.deskGunEmb = null;
      this.deskGunName = null;
      this.deskGunStatus = null;
      this.deskSkill2Chip = null;
      this.deskSkill2Emb = null;
      this.deskSkill2Name = null;
      this.deskSkill2Status = null;
      this.deskSkill2Bar = null;
      this.deskUltChip = null;
      this.deskUltEmb = null;
      this.deskUltName = null;
      this.deskUltStatus = null;
      this.deskUltBar = null;
      this._cachedDeskHidden = null;
      this._cachedRealmMode = null;
      this._cachedVisualTier = null;
      this._cdCache = {};
    },

    releasePointer(pointerId) {
      const entry = this.activePointers.get(pointerId);
      if (!entry) return;
      this.activePointers.delete(pointerId);
      if (entry.el) {
        try {
          if (entry.el.hasPointerCapture && entry.el.hasPointerCapture(pointerId)) {
            entry.el.releasePointerCapture(pointerId);
          }
        } catch (_) {}
        if (!this.hasRole(entry.role)) {
          entry.el.classList.remove('is-held');
        }
      }
      if (entry.role === 'GUN') {
        const stillHeld = this.hasRole('GUN');
        state.touchFireHeld = stillHeld;
        if (!stillHeld && typeof updateHeaderUI === 'function') updateHeaderUI();
      } else if (entry.role === 'MOVE') {
        if (!this.hasRole('MOVE')) {
          isPointerDown = false;
          touchGuidePos.active = false;
        }
      } else if (entry.role === 'JOYSTICK') {
        if (!this.hasRole('JOYSTICK')) {
          this._resetJoystickVisual();
        }
      }
    },

    releaseAllPointers() {
      const pids = Array.from(this.activePointers.keys());
      for (let i = 0; i < pids.length; i++) {
        this.releasePointer(pids[i]);
      }
      this.activePointers.clear();
      this._resetJoystickVisual();
      state.touchFireHeld = false;
      isPointerDown = false;
      touchGuidePos.active = false;
      if (this.gunBtn) this.gunBtn.classList.remove('is-held');
      if (this.skill2Btn) this.skill2Btn.classList.remove('is-held');
      if (this.ultBtn) this.ultBtn.classList.remove('is-held');
      if (this.pulseBtn) this.pulseBtn.classList.remove('is-held');
    },

    releaseFire() {
      const gunPids = [];
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'GUN') gunPids.push(pid);
      }
      for (let i = 0; i < gunPids.length; i++) {
        this.releasePointer(gunPids[i]);
      }
      state.touchFireHeld = false;
      if (this.gunBtn) this.gunBtn.classList.remove('is-held');
    },

    clearHeldKeys() {
      const hadGunKey = this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF');
      this.heldKeys.clear();
      if (hadGunKey && typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    flashEmpty() {
      const now = performance.now();
      if (now - this._lastEmptyFlashAt < 260) return;
      this._lastEmptyFlashAt = now;
      if (this.gunBtn) {
        this.gunBtn.classList.add('oc-fire-empty-flash');
        if (this._emptyFlashTimer) clearTimeout(this._emptyFlashTimer);
        this._emptyFlashTimer = setTimeout(() => {
          if (this.gunBtn) this.gunBtn.classList.remove('oc-fire-empty-flash');
          this._emptyFlashTimer = null;
        }, CONFIG.gun.emptyFlashMs);
      }
      if (this.deskGunChip) {
        this.deskGunChip.classList.add('oc-cd-shake');
        setTimeout(() => { if (this.deskGunChip) this.deskGunChip.classList.remove('oc-cd-shake'); }, 260);
      }
      audio.playCooldownReject();
    },

    triggerSkillFeedback(skillKey, kind) {
      const el = this.isTouch
        ? (skillKey === 'ult' ? this.ultBtn : this.skill2Btn)
        : (skillKey === 'ult' ? this.deskUltChip : this.deskSkill2Chip);
      if (!el) return;
      const cls = kind === 'ready' ? 'oc-ready-pulse' : 'oc-cd-shake';
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => { if (el) el.classList.remove(cls); }, kind === 'ready' ? 440 : 280);
    },

    _syncRealmLabels() {
      const raw = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (raw === 'helix') ? 'helix' : (raw === 'meteor' ? 'meteor' : 'dynamo');
      const isT6 = ((typeof state !== 'undefined' && state.coreTier) || 1) >= 6;
      const visualKey = `${curMode}:${isT6 ? 't6' : 't5'}`;
      if (this._cachedRealmMode === curMode && this._cachedVisualTier === visualKey) return;
      this._cachedRealmMode = curMode;
      this._cachedVisualTier = visualKey;
      const ars = getRealmArsenal(curMode);
      const tierNum = isT6 ? 6 : 5;

      if (this.clusterEl) {
        this.clusterEl.setAttribute('data-realm', curMode);
        const dialSvg = this.clusterEl.querySelector('.oc-joy-dial-svg');
        if (dialSvg && this.joyEl) {
          dialSvg.outerHTML = this._buildJoyDialSvg(curMode);
        }
        const crownEl = this.clusterEl.querySelector('.oc-gun-crown-frame');
        if (crownEl) crownEl.outerHTML = this._buildGunCrownFrameSvg(curMode);
      }
      if (this.joyKnobImgEl) {
        this.joyKnobImgEl.src = isT6
          ? `assets/core-${curMode}-t6-showcase.png?v=arcade416_relic_trails_coronation`
          : `assets/core-${curMode}-t5.png?v=arcade416_relic_trails_coronation`;
      }
      if (this.ultIconEl) this.ultIconEl.innerHTML = this._buildTouchPadArtwork(curMode, 'ult', tierNum);
      if (this.ultCapEl) this.ultCapEl.textContent = ars.ult;
      if (this.ultBtn) this.ultBtn.setAttribute('aria-label', ars.ult);
      if (this.skill2IconEl) this.skill2IconEl.innerHTML = this._buildTouchPadArtwork(curMode, 'skill2', tierNum);
      if (this.skill2SubEl) this.skill2SubEl.textContent = `${ars.s2Count}×`;
      if (this.skill2CapEl) this.skill2CapEl.textContent = ars.skill2;
      if (this.skill2Btn) this.skill2Btn.setAttribute('aria-label', ars.skill2);
      if (this.gunCrestEl) this.gunCrestEl.innerHTML = this._buildTouchPadArtwork(curMode, 'gun', tierNum);
      if (this.gunCapEl) this.gunCapEl.textContent = ars.gun;
      if (this.gunBtn) this.gunBtn.setAttribute('aria-label', ars.gun);
      if (this.deskGunName) this.deskGunName.textContent = ars.gun;
      if (this.deskSkill2Name) this.deskSkill2Name.textContent = ars.skill2;
      if (this.deskUltName) this.deskUltName.textContent = ars.ult;
      if (this.deskGunEmb) this.deskGunEmb.innerHTML = this._buildTouchPadArtwork(curMode, 'gun', tierNum);
      if (this.deskSkill2Emb) this.deskSkill2Emb.innerHTML = this._buildTouchPadArtwork(curMode, 'skill2', tierNum);
      if (this.deskUltEmb) this.deskUltEmb.innerHTML = this._buildTouchPadArtwork(curMode, 'ult', tierNum);
    },

    syncSkillCooldownUI() {
      this._syncRealmLabels();
      const cache = this._cdCache || (this._cdCache = {});
      const s2Rem = Math.max(0, SkillSystem.skill2CdMs || 0);
      const s2Max = CONFIG.skill2.cooldownMs;
      const uRem = Math.max(0, SkillSystem.ultCdMs || 0);
      const uMax = CONFIG.ult.cooldownMs;

      if (this.isTouch) {
        if (this.skill2Btn) {
          const onCd = s2Rem > 0;
          if (cache.tS2OnCd !== onCd) {
            cache.tS2OnCd = onCd;
            this.skill2Btn.classList.toggle('on-cooldown', onCd);
          }
          if (this.skill2SweepEl) {
            const deg = onCd ? Math.round((s2Rem / s2Max) * 360) : 0;
            if (cache.tS2Deg !== deg) {
              cache.tS2Deg = deg;
              this.skill2SweepEl.style.setProperty('--cd-deg', `${deg}deg`);
            }
          }
          if (this.skill2CdTextEl) {
            const txt = onCd ? String(Math.ceil(s2Rem / 1000)) : '';
            if (cache.tS2Txt !== txt) {
              cache.tS2Txt = txt;
              this.skill2CdTextEl.textContent = txt;
            }
          }
        }
        if (this.ultBtn) {
          const onCd = uRem > 0;
          if (cache.tUltOnCd !== onCd) {
            cache.tUltOnCd = onCd;
            this.ultBtn.classList.toggle('on-cooldown', onCd);
          }
          if (this.ultSweepEl) {
            const deg = onCd ? Math.round((uRem / uMax) * 360) : 0;
            if (cache.tUltDeg !== deg) {
              cache.tUltDeg = deg;
              this.ultSweepEl.style.setProperty('--cd-deg', `${deg}deg`);
            }
          }
          if (this.ultCdTextEl) {
            const txt = onCd ? String(Math.ceil(uRem / 1000)) : '';
            if (cache.tUltTxt !== txt) {
              cache.tUltTxt = txt;
              this.ultCdTextEl.textContent = txt;
            }
          }
        }
        if (this.pulseBtn) {
          const pPct = state.isPulseReady ? 100 : Math.min(99, Math.round(((state.pulseMeter || 0) / 3) * 100));
          const pReady = !!state.isPulseReady;
          if (cache.tPulseReady !== pReady) {
            cache.tPulseReady = pReady;
            this.pulseBtn.classList.toggle('is-ready', pReady);
            this.pulseBtn.classList.toggle('is-charging', !pReady);
          }
          if (this.pulseSweepEl) {
            const pDeg = Math.round((pPct / 100) * 360);
            if (cache.tPulseDeg !== pDeg) {
              cache.tPulseDeg = pDeg;
              this.pulseSweepEl.style.setProperty('--pulse-deg', `${pDeg}deg`);
            }
          }
          if (this.pulsePctEl) {
            const pTxt = pReady ? 'READY' : `${pPct}%`;
            if (cache.tPulseTxt !== pTxt) {
              cache.tPulseTxt = pTxt;
              this.pulsePctEl.textContent = pTxt;
            }
          }
        }
      } else if (this.deskHudEl) {
        if (this.deskGunChip) {
          const activeGun = (this.isDesktopKeyGunHeld() || !!state.pointerFiring) && (state.coreAmmo || 0) > 0;
          if (cache.dGunActive !== activeGun) {
            cache.dGunActive = activeGun;
            this.deskGunChip.classList.toggle('is-active', activeGun);
          }
          if (this.deskGunStatus) {
            const gTxt = (state.coreAmmo || 0) <= 0 ? 'EMPTY' : formatAmmoCount(state.coreAmmo);
            if (cache.dGunTxt !== gTxt) {
              cache.dGunTxt = gTxt;
              this.deskGunStatus.textContent = gTxt;
            }
          }
        }
        if (this.deskSkill2Chip) {
          const onCd = s2Rem > 0;
          if (cache.dS2OnCd !== onCd) {
            cache.dS2OnCd = onCd;
            this.deskSkill2Chip.classList.toggle('on-cooldown', onCd);
          }
          const txt = onCd ? `${Math.ceil(s2Rem / 1000)}s` : 'READY';
          if (this.deskSkill2Status && cache.dS2Txt !== txt) {
            cache.dS2Txt = txt;
            this.deskSkill2Status.textContent = txt;
          }
          if (this.deskSkill2Bar) {
            const pct = onCd ? Math.round((s2Rem / s2Max) * 100) : 0;
            if (cache.dS2Pct !== pct) {
              cache.dS2Pct = pct;
              this.deskSkill2Bar.style.setProperty('--cd-pct', `${pct}%`);
            }
          }
        }
        if (this.deskUltChip) {
          const onCd = uRem > 0;
          if (cache.dUltOnCd !== onCd) {
            cache.dUltOnCd = onCd;
            this.deskUltChip.classList.toggle('on-cooldown', onCd);
          }
          const txt = onCd ? `${Math.ceil(uRem / 1000)}s` : 'READY';
          if (this.deskUltStatus && cache.dUltTxt !== txt) {
            cache.dUltTxt = txt;
            this.deskUltStatus.textContent = txt;
          }
          if (this.deskUltBar) {
            const pct = onCd ? Math.round((uRem / uMax) * 100) : 0;
            if (cache.dUltPct !== pct) {
              cache.dUltPct = pct;
              this.deskUltBar.style.setProperty('--cd-pct', `${pct}%`);
            }
          }
        }
      }
    },

    syncUI() {
      const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      const overlayVisible = !!(dom.screenOverlay && dom.screenOverlay.style.display === 'flex');
      const shouldShow = !!(state.active && isCoreArcade && !overlayVisible);
      this._syncLeftHandBtn();
      this._syncMoveModeUI();

      if (!this.isTouch) {
        if (this.clusterEl) this.destroyTouchCluster();
        if (!shouldShow) {
          if (this.deskHudEl && !this._cachedDeskHidden) {
            this._cachedDeskHidden = true;
            this.deskHudEl.classList.add('oc-desk-hidden');
          }
          return;
        }
        const dh = this.ensureDesktopHud();
        if (dh && this._cachedDeskHidden !== false) {
          this._cachedDeskHidden = false;
          dh.classList.remove('oc-desk-hidden');
        }
        this.syncSkillCooldownUI();
        return;
      }

      if (this.deskHudEl) this.destroyDesktopHud();

      if (!shouldShow) {
        if (this.activePointers.size > 0) this.releaseAllPointers();
        if (this.clusterEl && !this._cachedHidden) {
          this._cachedHidden = true;
          this.clusterEl.classList.add('oc-touch-hidden');
        }
        return;
      }

      const cluster = this.ensureTouchCluster();
      if (!cluster) return;

      if (this._cachedHidden !== false) {
        this._cachedHidden = false;
        cluster.classList.remove('oc-touch-hidden');
      }

      const ammoCnt = Number.isFinite(state.coreAmmo) ? Math.max(0, Math.floor(state.coreAmmo)) : 0;
      const ammoStr = formatAmmoCount(ammoCnt);
      if (this._cachedAmmoStr !== ammoStr) {
        this._cachedAmmoStr = ammoStr;
        if (this.ammoEl) this.ammoEl.textContent = ammoStr;
        if (this.gunBtn) this.gunBtn.classList.toggle('is-empty', ammoCnt <= 0);
      }
      if (this.gunBtn) {
        this.gunBtn.classList.toggle('is-held', this.isGunHeld() && ammoCnt > 0);
      }
      this.syncSkillCooldownUI();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // === CHANGED (v387): STEP 4 — ACTIVE SKILLS ENGINE (POOLED 60 FPS) ===
  // 2nd Skill: SEEKER COMETS (4 homing missiles + 0.3s lock-on reticles, 8s CD)
  // Ultimate:  CALDERA NOVA (piercing beam + shockwave + 15% Boss HP + 1.5s invuln, 35s CD)
  // ══════════════════════════════════════════════════════════════════════════
  const SkillSystem = {
    skill2CdMs: 0,
    ultCdMs: 0,
    pendingVolleys: [],   // Active 0.3s lock-on reticle telegraphs before missile launch
    impactBursts: [],     // === CHANGED (v392): Short radial lightning bursts on Dynamo ARC SEEKER hit ===
    activeNova: null,     // Active Caldera Nova beam + expanding shockwave
    missilePool: Array.from({ length: CONFIG.skill2.poolSize }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, dmg: 3.0,
      mode: 'dynamo', seed: 0,
      targetKind: null, targetRef: null, ageMs: 0, maxAgeMs: 2800,
      trail: []
    })),

    reset() {
      this.skill2CdMs = 0;
      this.ultCdMs = 0;
      this.pendingVolleys = [];
      this.impactBursts = [];
      this.activeNova = null;
      for (let i = 0; i < this.missilePool.length; i++) {
        this.missilePool[i].active = false;
        this.missilePool[i].targetRef = null;
        this.missilePool[i].trail.length = 0;
      }
      TouchFireControls.syncSkillCooldownUI();
    },

    onEnemyDestroyed() {
      // Optional ultimate charge from kills (base cooldown always works independently)
      if (this.ultCdMs > 0) {
        const prev = this.ultCdMs;
        this.ultCdMs = Math.max(0, this.ultCdMs - CONFIG.ult.killChargeMs);
        if (prev > 0 && this.ultCdMs === 0) {
          audio.playSkillReady();
          TouchFireControls.triggerSkillFeedback('ult', 'ready');
        }
      }
    },

    _acquireTargets(cx, cy, count) {
      const targets = [];
      // Priority 1: Nearest hostile falling bolides / hazard nodes
      const hazards = [];
      for (let i = 0; i < state.particles.length; i++) {
        const pt = state.particles[i];
        if (isHazardNode(pt.nodeClass) && pt.y > -40) {
          hazards.push({ kind: 'hazard', ref: pt, dist: Math.hypot(pt.x - cx, pt.y - cy) });
        }
      }
      hazards.sort((a, b) => a.dist - b.dist);
      for (let i = 0; i < hazards.length && targets.length < count; i++) {
        targets.push({ kind: 'hazard', ref: hazards[i].ref });
      }

      // Priority 2: Active Voidbloom Nodes
      if (targets.length < count && VoidbloomEngine.nodes.length > 0) {
        const vbs = VoidbloomEngine.nodes
          .filter(v => v.active)
          .map(v => ({ kind: 'voidbloom', ref: v, dist: Math.hypot(v.x - cx, v.y - cy) }))
          .sort((a, b) => a.dist - b.dist);
        for (let i = 0; i < vbs.length && targets.length < count; i++) {
          targets.push({ kind: 'voidbloom', ref: vbs[i].ref });
        }
      }

      // Priority 3: Active Boss Pylons or Boss Body
      if (targets.length < count && state.boss && state.boss.phase === 'fighting') {
        if (state.boss.pylons) {
          for (let i = 0; i < state.boss.pylons.length && targets.length < count; i++) {
            if (state.boss.pylons[i].hp > 0) {
              targets.push({ kind: 'pylon', ref: state.boss.pylons[i] });
            }
          }
        }
        while (targets.length < count) {
          targets.push({ kind: 'boss', ref: state.boss });
        }
      }

      // If fewer than 4 distinct targets exist (e.g. 1 Voidbloom or 2 hazards), cycle acquired targets so all 4 missiles lock cleanly!
      if (targets.length > 0) {
        let idx = 0;
        while (targets.length < count) {
          targets.push({ kind: targets[idx % targets.length].kind, ref: targets[idx % targets.length].ref });
          idx++;
        }
      } else {
        // Empty sky fallback: forward-fan free-flight interceptors
        for (let i = 0; i < count; i++) {
          targets.push({ kind: 'none', ref: null });
        }
      }
      return targets;
    },

    castSeekerComets(now) {
      if (!state.active) return false;
      const isCore = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      if (!isCore) return false;
      if (this.skill2CdMs > 0) {
        audio.playCooldownReject();
        TouchFireControls.triggerSkillFeedback('skill2', 'shake');
        return false;
      }

      const w = Math.max(320, cachedCanvasRect.width || window.innerWidth || 800);
      const h = Math.max(240, cachedCanvasRect.height || window.innerHeight || 600);
      const rawCx = (Number.isFinite(state.catcherX) ? state.catcherX : 0.5) * w;
      const rawCy = (Number.isFinite(state.catcherY) ? state.catcherY : 0.82) * h;
      const cx = Math.max(20, Math.min(w - 20, rawCx));
      const cy = Math.max(20, Math.min(h - 20, rawCy));

      const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const ars = getRealmArsenal(mMode);
      this.skill2CdMs = CONFIG.skill2.cooldownMs;
      if ((state.coreTier || 1) >= 6) {
        state.tier6Skill2CastUntil = now + 560;
      }
      const targets = this._acquireTargets(cx, cy, ars.s2Count || CONFIG.skill2.missileCount);
      this.pendingVolleys.push({
        startAt: now,
        launchAt: now + CONFIG.skill2.lockOnMs,
        mode: mMode,
        targets
      });
      audio.playSeekerLockOn(mMode);
      TouchFireControls.syncSkillCooldownUI();
      return true;
    },

    _launchVolley(volley, cx, cy, now) {
      const vMode = volley.mode || 'dynamo';
      const ars = getRealmArsenal(vMode);
      const n = volley.targets.length;
      const baseDmg = ars.s2Dmg || CONFIG.skill2.damageMultiplier;
      const spreadStep = (n > 4) ? 0.30 : 0.42;
      const isT6Launch = ((state.coreTier || 1) >= 6);
      let t6Muzzles = null;
      if (isT6Launch && typeof CoreGeometryDB !== 'undefined') {
        const w = Math.max(320, cachedCanvasRect.width || window.innerWidth || 800);
        const h = Math.max(240, cachedCanvasRect.height || window.innerHeight || 600);
        const uNow = CoreGeometryDB.computeCoreMetrics(w, h, 6, w < 600, null).u;
        const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
        t6Muzzles = CoreGeometryDB.getTier6Muzzles(vMode, uNow, cx, cy, bank);
      }
      for (let i = 0; i < n; i++) {
        // Grab free slot from pre-allocated pool
        let slot = null;
        for (let k = 0; k < this.missilePool.length; k++) {
          if (!this.missilePool[k].active) { slot = this.missilePool[k]; break; }
        }
        if (!slot) slot = this.missilePool[i % this.missilePool.length];
        const fanAngle = -Math.PI * 0.5 + (i - (n - 1) * 0.5) * spreadStep;
        slot.active = true;
        slot.mode = vMode;
        slot.seed = i;
        if (t6Muzzles) {
          const muz = (i % 2 === 0) ? t6Muzzles.left : t6Muzzles.right;
          slot.x = muz.x + (Math.floor(i / 2) - 0.5) * 6;
          slot.y = muz.y;
        } else {
          slot.x = cx + (i - (n - 1) * 0.5) * (n > 4 ? 12 : 16);
          slot.y = cy - 26;
        }
        slot.vx = Math.cos(fanAngle) * (CONFIG.skill2.speed * 0.68);
        slot.vy = Math.sin(fanAngle) * (CONFIG.skill2.speed * 0.68);
        slot.dmg = baseDmg;
        slot.targetKind = volley.targets[i].kind;
        slot.targetRef = volley.targets[i].ref;
        slot.ageMs = 0;
        slot.maxAgeMs = 3000;
        slot.trail.length = 0;
      }
      audio.playSeekerLaunch(vMode);
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, 7);
    },

    castCalderaNova(now) {
      if (!state.active) return false;
      const isCore = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      if (!isCore) return false;
      if (this.ultCdMs > 0) {
        audio.playCooldownReject();
        TouchFireControls.triggerSkillFeedback('ult', 'shake');
        return false;
      }

      const w = Math.max(320, cachedCanvasRect.width || window.innerWidth || 800);
      const h = Math.max(240, cachedCanvasRect.height || window.innerHeight || 600);
      const rawCx = (Number.isFinite(state.catcherX) ? state.catcherX : 0.5) * w;
      const rawCy = (Number.isFinite(state.catcherY) ? state.catcherY : 0.82) * h;
      const cx = Math.max(20, Math.min(w - 20, rawCx));
      const cy = Math.max(20, Math.min(h - 20, rawCy));

      this.ultCdMs = CONFIG.ult.cooldownMs;
      // Grant invulnerability & intense cataclysm recoil
      state.playerInvulnUntil = Math.max(state.playerInvulnUntil || 0, now + CONFIG.ult.invulnMs);
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, CONFIG.ult.screenShake);

      const novaMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const isTier6Ult = (state.coreTier || 1) >= 6;
      const novaEmbers = [];
      const emberCount = isTier6Ult ? 76 : 68;
      for (let eIdx = 0; eIdx < emberCount; eIdx++) {
        novaEmbers.push({
          ox: (Math.random() - 0.5) * 210,
          oy: -Math.random() * Math.max(480, cy),
          vx: (Math.random() - 0.5) * 1.4,
          vy: -(9.5 + Math.random() * 14.5),
          len: 8 + Math.random() * 18,
          w: 1.4 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          bright: Math.random() > 0.35
        });
      }
      this.activeNova = {
        x: cx,
        y: cy,
        mode: novaMode,
        isTier6: isTier6Ult,
        startAt: now,
        durationMs: isTier6Ult ? (CONFIG.ult.durationMs + 300) : CONFIG.ult.durationMs,
        maxRadius: Math.hypot(w, h) * 1.15,
        embers: novaEmbers
      };

      // 1 & 2. TOTAL PURGE of ALL bad nodes, powered hazards, shrapnel, Voidbloom nodes & telegraphs,
      // hostile boss bullets/beams/shock rings, hazard lasers & EMP shockwaves (never destroys good nodes!)
      const purge = this._purgeAllBadEntities(now, true);

      // 3. Deal CERTAIN / CAPPED Boss Damage ONLY (exact 15% of boss max HP — zero armor-break/crit inflation!)
      //    and fixed certain damage (6 dmg) to active Shield Pylons instead of instant-wiping them.
      let bossDmgDealt = 0;
      if (state.boss && state.boss.phase === 'fighting') {
        if (state.boss.pylons) {
          const pylonDmg = CONFIG.ult.bossPylonDmg || 6;
          for (let i = 0; i < state.boss.pylons.length; i++) {
            if (state.boss.pylons[i].hp > 0) {
              RoundBossEngine.damagePylon(state.boss.pylons[i], pylonDmg, now, state.boss.pylons[i].x, state.boss.pylons[i].y);
            }
          }
        }
        bossDmgDealt = Math.max(8, Math.round(state.boss.maxHp * CONFIG.ult.bossMaxHpPct));
        RoundBossEngine.damageBoss(bossDmgDealt, now, true, state.boss.x, state.boss.y, true);
      }

      audio.playCalderaNova(novaMode);
      updateHeaderUI();
      TouchFireControls.syncSkillCooldownUI();
      return true;
    },

    // === CHANGED (v389): Guaranteed 100% Bad-Node & Hostile Projectile Purge (called on cast & continuously during Nova!) ===
    _purgeAllBadEntities(now, isInitialCast = false) {
      let clearedHazards = 0;
      if (!state.vaporizedShards) state.vaporizedShards = [];
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        if (!pt) continue;
        if (isHazardNode(pt.nodeClass) || pt.isShard) {
          RoundBossEngine._spawnHitSparks(pt.x, pt.y, '#fbbf24', 10);
          // Burst radiant golden-crimson debris shards so the player sees every bad node disintegrate!
          for (let sh = 0; sh < 8; sh++) {
            if (state.vaporizedShards.length >= 48) break;
            const sAng = Math.random() * Math.PI * 2;
            const sSpd = 3.5 + Math.random() * 6.5;
            state.vaporizedShards.push({
              x: pt.x,
              y: pt.y,
              vx: Math.cos(sAng) * sSpd,
              vy: Math.sin(sAng) * sSpd,
              size: 2.6 + Math.random() * 3.2,
              color: (sh % 2 === 0) ? '#fde047' : '#f43f5e',
              life: 0,
              maxLife: 22 + Math.floor(Math.random() * 14)
            });
          }
          state.score += 300;
          clearedHazards++;
          state.particles.splice(i, 1);
          this.onEnemyDestroyed();
        }
      }

      // Clear ALL hostile projectiles, beams, lasers, EMP shockwaves & hostile Boss shock rings
      if (state.bossBullets && state.bossBullets.length) state.bossBullets = [];
      if (state.bossBeams && state.bossBeams.length) state.bossBeams = [];
      if (state.hazardLasers && state.hazardLasers.length) state.hazardLasers = [];
      if (state.empShockwaves && state.empShockwaves.length) state.empShockwaves = [];
      if (state.bossShockRings && state.bossShockRings.length) {
        state.bossShockRings = state.bossShockRings.filter(r => r && r.harmless === true);
      }

      // Destroy EVERY live Voidbloom Node AND collapse EVERY incoming Voidbloom Rift Telegraph!
      const vbRes = VoidbloomEngine.destroyAllByNova(now);
      const vbDestroyed = (typeof vbRes === 'object' && vbRes) ? (vbRes.nodes || 0) : (vbRes || 0);
      const riftsCollapsed = (typeof vbRes === 'object' && vbRes) ? (vbRes.rifts || 0) : 0;

      if (!isInitialCast && (clearedHazards > 0 || vbDestroyed > 0 || riftsCollapsed > 0)) {
        updateHeaderUI();
      }
      return { clearedHazards, vbDestroyed, riftsCollapsed };
    },

    _getLiveTargetPos(m) {
      if (m.targetKind === 'hazard' && m.targetRef && state.particles.includes(m.targetRef)) {
        return { x: m.targetRef.x, y: m.targetRef.y };
      }
      if (m.targetKind === 'voidbloom' && m.targetRef && m.targetRef.active) {
        return { x: m.targetRef.x, y: m.targetRef.y };
      }
      if (m.targetKind === 'pylon' && m.targetRef && m.targetRef.hp > 0 && state.boss && state.boss.phase === 'fighting') {
        return { x: m.targetRef.x, y: m.targetRef.y };
      }
      if (m.targetKind === 'boss' && state.boss && state.boss.phase === 'fighting') {
        return { x: state.boss.x, y: state.boss.y };
      }
      // Target was already destroyed: auto-reacquire next highest priority live target!
      const re = this._acquireTargets(m.x, m.y, 1)[0];
      if (re && re.kind !== 'none') {
        m.targetKind = re.kind;
        m.targetRef = re.ref;
        if (re.kind === 'hazard') return { x: re.ref.x, y: re.ref.y };
        if (re.kind === 'voidbloom') return { x: re.ref.x, y: re.ref.y };
        if (re.kind === 'pylon') return { x: re.ref.x, y: re.ref.y };
        if (re.kind === 'boss') return { x: re.ref.x, y: re.ref.y };
      }
      return null;
    },

    tick(dt, ctx, cx, cy, u, dtScale, now, w, h) {
      // 1. Tick Cooldowns cleanly using clamped frame dt (auto-pauses on tab hide / pause!)
      if (this.skill2CdMs > 0) {
        this.skill2CdMs = Math.max(0, this.skill2CdMs - dt);
        if (this.skill2CdMs === 0) {
          audio.playSkillReady();
          TouchFireControls.triggerSkillFeedback('skill2', 'ready');
        }
      }
      if (this.ultCdMs > 0) {
        this.ultCdMs = Math.max(0, this.ultCdMs - dt);
        if (this.ultCdMs === 0) {
          audio.playSkillReady();
          TouchFireControls.triggerSkillFeedback('ult', 'ready');
        }
      }
      TouchFireControls.syncSkillCooldownUI();

      // 2. Render & Launch 0.3s Realm-Unique Lock-On Reticles
      for (let i = this.pendingVolleys.length - 1; i >= 0; i--) {
        const v = this.pendingVolleys[i];
        if (now >= v.launchAt) {
          this._launchVolley(v, cx, cy, now);
          this.pendingVolleys.splice(i, 1);
          continue;
        }
        const prog = Math.min(1, (now - v.startAt) / CONFIG.skill2.lockOnMs);
        const vMode = v.mode || 'dynamo';
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let t = 0; t < v.targets.length; t++) {
          const trg = v.targets[t];
          if (!trg.ref) continue;
          const tx = trg.ref.x;
          const ty = trg.ref.y;
          if (!Number.isFinite(tx) || !Number.isFinite(ty)) continue;
          const r = 38 - prog * 14;
          const rot = prog * Math.PI * 0.85;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(rot);
          if (vMode === 'helix') {
            // PRISM SWARM: Counter-rotating sacred hexagonal double-glyph (cyan hexagon + magenta triangle)
            ctx.strokeStyle = prog > 0.7 ? '#f0abfc' : '#22d3ee';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            for (let hp = 0; hp <= 6; hp++) {
              const ha = (hp / 6) * Math.PI * 2;
              if (hp === 0) ctx.moveTo(Math.cos(ha) * r, Math.sin(ha) * r);
              else ctx.lineTo(Math.cos(ha) * r, Math.sin(ha) * r);
            }
            ctx.stroke();
            ctx.rotate(-rot * 2.0);
            ctx.strokeStyle = '#ec4899';
            ctx.beginPath();
            for (let tp = 0; tp <= 3; tp++) {
              const ta = (tp / 3) * Math.PI * 2;
              if (tp === 0) ctx.moveTo(Math.cos(ta) * r * 0.72, Math.sin(ta) * r * 0.72);
              else ctx.lineTo(Math.cos(ta) * r * 0.72, Math.sin(ta) * r * 0.72);
            }
            ctx.stroke();
          } else if (vMode === 'meteor') {
            // SEEKER COMETS: Blazing solar ring + 4 inward-slamming molten chevrons
            ctx.strokeStyle = prog > 0.7 ? '#fef08a' : '#f97316';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
            for (let b = 0; b < 4; b++) {
              const a = (b * Math.PI) / 2;
              ctx.save();
              ctx.rotate(a);
              ctx.beginPath();
              ctx.moveTo(-6, -r - 8);
              ctx.lineTo(0, -r + 5);
              ctx.lineTo(6, -r - 8);
              ctx.stroke();
              ctx.restore();
            }
          } else {
            // ARC SEEKERS (Dynamo): Rotating electric diamond + crackling corner ticks
            ctx.strokeStyle = prog > 0.7 ? '#fde047' : '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.lineTo(r, 0);
            ctx.lineTo(0, r);
            ctx.lineTo(-r, 0);
            ctx.closePath();
            ctx.stroke();
            for (let b = 0; b < 4; b++) {
              const a = (b * Math.PI) / 2;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * (r + 8), Math.sin(a) * (r + 8));
              ctx.lineTo(Math.cos(a) * (r - 5), Math.sin(a) * (r - 5));
              ctx.stroke();
            }
          }
          ctx.restore();
        }
        ctx.restore();
      }

      // 2B. Render Active Dynamo Radial Lightning Detonation Bursts
      if (this.impactBursts && this.impactBursts.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let bi = this.impactBursts.length - 1; bi >= 0; bi--) {
          const ib = this.impactBursts[bi];
          const age = now - ib.bornAt;
          if (age >= ib.dur) {
            this.impactBursts.splice(bi, 1);
            continue;
          }
          const ba = 1 - age / ib.dur;
          for (let b = 0; b < 6; b++) {
            const ang = (b / 6) * Math.PI * 2 + (ib.seed || 0) * 0.7;
            const bx1 = ib.x + Math.cos(ang) * 46 * (1 - ba * 0.35);
            const by1 = ib.y + Math.sin(ang) * 46 * (1 - ba * 0.35);
            const midA = ang + (b % 2 === 0 ? 0.25 : -0.25);
            const bmx = ib.x + Math.cos(midA) * 22;
            const bmy = ib.y + Math.sin(midA) * 22;
            ctx.strokeStyle = (b % 2 === 0) ? `rgba(56, 189, 248, ${ba * 0.9})` : `rgba(167, 139, 250, ${ba * 0.9})`;
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(ib.x, ib.y);
            ctx.lineTo(bmx, bmy);
            ctx.lineTo(bx1, by1);
            ctx.stroke();
            ctx.strokeStyle = `rgba(255, 255, 255, ${ba * 0.95})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 3. Update & Draw Pooled Homing 2nd-Skill Missiles (Theme-Unique Kinematics, 3D Bodies & Wakes)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.missilePool.length; i++) {
        const m = this.missilePool[i];
        if (!m.active) continue;
        m.ageMs += dt;
        if (m.ageMs >= m.maxAgeMs || m.y < -80 || m.y > h + 80 || m.x < -80 || m.x > w + 80) {
          m.active = false;
          continue;
        }

        const mMode = m.mode || 'dynamo';
        const mSpd = (mMode === 'dynamo')
          ? CONFIG.skill2.speed * 1.06
          : (mMode === 'meteor' ? CONFIG.skill2.speed * (0.88 + Math.min(0.28, m.ageMs / 900)) : CONFIG.skill2.speed);
        const turnMult = (mMode === 'dynamo') ? 1.15 : (mMode === 'helix' ? 1.05 : 1.0);

        const tPos = this._getLiveTargetPos(m);
        if (tPos) {
          const distToTarget = Math.hypot(tPos.x - m.x, tPos.y - m.y);
          const desiredAngle = Math.atan2(tPos.y - m.y, tPos.x - m.x);
          const curAngle = Math.atan2(m.vy, m.vx);
          let diff = desiredAngle - curAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          let weave = 0;
          if (mMode === 'dynamo' && distToTarget > 90) {
            weave = Math.sin(m.ageMs * 0.045 + (m.seed || 0) * 1.9) * 0.065;
          } else if (mMode === 'helix' && distToTarget > 80) {
            weave = Math.sin(m.ageMs * 0.022 + (m.seed || 0) * 1.05) * 0.09;
          }
          const nextAngle = curAngle + diff * Math.min(1, CONFIG.skill2.turnRate * turnMult * dtScale) + weave;
          m.vx = Math.cos(nextAngle) * mSpd;
          m.vy = Math.sin(nextAngle) * mSpd;
        } else {
          // Fly straight upward if sky is clear
          m.vy = Math.min(m.vy - 0.5 * dtScale, -mSpd);
        }

        m.x += m.vx * dtScale;
        m.y += m.vy * dtScale;
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > 15) m.trail.shift();

        // Check Hit Detection (Hazards, Voidbloom, Boss Pylons, Boss)
        let hit = false;
        // A. Voidbloom Nodes
        if (VoidbloomEngine.hitByShot(m.x, m.y, m.dmg, now, 'seeker')) {
          hit = true;
        }
        // B. Falling Hazard Nodes
        if (!hit) {
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!isHazardNode(pt.nodeClass)) continue;
            if (Math.hypot(m.x - pt.x, m.y - pt.y) < (pt.headR || 28) + 26) {
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= m.dmg;
              RoundBossEngine._spawnHitSparks(m.x, m.y, mMode === 'meteor' ? '#fb923c' : (mMode === 'helix' ? '#ec4899' : '#22d3ee'), 10);
              if (pt.shotHp <= 0) {
                state.score += 320;
                RoundBossEngine._spawnHitSparks(pt.x, pt.y, '#fde047', 16);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                this.onEnemyDestroyed();
                updateHeaderUI();
              } else {
                audio.playBossHit(false);
              }
              hit = true;
              break;
            }
          }
        }
        // C. Boss Pylons & Boss Body
        if (!hit && state.boss && state.boss.phase === 'fighting') {
          if (state.boss.pylons) {
            for (let pIdx = 0; pIdx < state.boss.pylons.length; pIdx++) {
              const pyl = state.boss.pylons[pIdx];
              if (pyl.hp > 0 && Math.hypot(m.x - pyl.x, m.y - pyl.y) < 40) {
                RoundBossEngine.damagePylon(pyl, m.dmg, now, m.x, m.y);
                hit = true;
                break;
              }
            }
          }
          if (!hit) {
            const dx = m.x - state.boss.x;
            const dy = m.y - state.boss.y;
            const rx = state.boss.hitR * 1.26;
            const ry = state.boss.hitR * 0.92;
            if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
              RoundBossEngine.damageBoss(m.dmg, now, true, m.x, m.y);
              hit = true;
            }
          }
        }

        if (hit) {
          // === CHANGED (v396): Realm-Unique Explosive Detonation Signatures + Meteor Caldera Shrapnel Splash! ===
          if (mMode === 'helix') {
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#ec4899', 12);
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#22d3ee', 12);
            if (state.bossShockRings && state.bossShockRings.length < 18) {
              state.bossShockRings.push({ x: m.x, y: m.y, r: 8, maxR: 68, alpha: 0.94, speed: 5.0, color: '#ec4899', harmless: true });
              state.bossShockRings.push({ x: m.x, y: m.y, r: 4, maxR: 50, alpha: 0.90, speed: 4.4, color: '#22d3ee', harmless: true });
            }
          } else if (mMode === 'meteor') {
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#f97316', 20);
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#fde047', 14);
            if (state.bossShockRings && state.bossShockRings.length < 18) {
              state.bossShockRings.push({ x: m.x, y: m.y, r: 10, maxR: 92, alpha: 0.96, speed: 5.4, color: '#f97316', harmless: true });
              state.bossShockRings.push({ x: m.x, y: m.y, r: 5, maxR: 58, alpha: 0.92, speed: 4.6, color: '#fde047', harmless: true });
            }
            // Meteor Caldera Shrapnel Cluster Splash: radial molten cinders + 78px thermal blast wave on nearby hazards!
            if (!state.vaporizedShards) state.vaporizedShards = [];
            for (let cIdx = 0; cIdx < 8; cIdx++) {
              if (state.vaporizedShards.length >= 160) break;
              const cAng = (cIdx / 8) * Math.PI * 2 + (m.seed || 0) * 0.4;
              const cSpd = 4.2 + (cIdx % 3) * 1.8;
              state.vaporizedShards.push({
                x: m.x,
                y: m.y,
                vx: Math.cos(cAng) * cSpd,
                vy: Math.sin(cAng) * cSpd,
                size: 3.2 + (cIdx % 2) * 1.4,
                color: (cIdx % 2 === 0) ? '#fde047' : '#f97316',
                life: 0,
                maxLife: 20 + (cIdx % 4) * 3
              });
            }
            for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
              const pt = state.particles[pIdx];
              if (!pt || !isHazardNode(pt.nodeClass)) continue;
              if (Math.hypot(pt.x - m.x, pt.y - m.y) <= 78) {
                if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
                pt.shotHp -= m.dmg * 0.42;
                if (pt.shotHp <= 0) {
                  state.score += 180;
                  RoundBossEngine._spawnHitSparks(pt.x, pt.y, '#fb923c', 10);
                  state.particles.splice(pIdx, 1);
                  this.onEnemyDestroyed();
                }
              }
            }
          } else {
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#a78bfa', 12);
            RoundBossEngine._spawnHitSparks(m.x, m.y, '#38bdf8', 12);
            if (state.bossShockRings && state.bossShockRings.length < 18) {
              state.bossShockRings.push({ x: m.x, y: m.y, r: 8, maxR: 72, alpha: 0.92, speed: 5.0, color: '#a855f7', harmless: true });
            }
            if (this.impactBursts.length < 16) {
              this.impactBursts.push({ x: m.x, y: m.y, bornAt: now, dur: 165, seed: m.seed || i });
            }
          }
          m.active = false;
          continue;
        }

        // === CHANGED (v392): DISTINCT PER-GAME 2ND-SKILL MISSILE WAKES & 3D WARHEADS ===
        const tLen = m.trail.length;
        const mAngle = Math.atan2(m.vy, m.vx) + Math.PI * 0.5;
        const pulseM = 1.0 + 0.08 * Math.sin(now * 0.04 + i);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (mMode === 'helix') {
          // PRISM SWARM: Woven Bi-Chromatic Magenta + Cyan Twin-Ribbon Wake + 3D Faceted Crystal-Prism Bio-Needle
          if (tLen > 1) {
            for (let ti = 1; ti < tLen; ti++) {
              const frac = ti / tLen;
              const p0 = m.trail[ti - 1];
              const p1 = m.trail[ti];
              const dxT = p1.x - p0.x;
              const dyT = p1.y - p0.y;
              const segL = Math.hypot(dxT, dyT) || 1;
              const nx = -dyT / segL;
              const ny = dxT / segL;
              const off0 = Math.sin((ti - 1) * 0.78 + now * 0.022 + i) * 7.5 * ((ti - 1) / tLen);
              const off1 = Math.sin(ti * 0.78 + now * 0.022 + i) * 7.5 * frac;

              ctx.strokeStyle = `rgba(236, 72, 153, ${frac * 0.85})`;
              ctx.lineWidth = 1.5 + frac * 4.2;
              ctx.beginPath();
              ctx.moveTo(p0.x + nx * off0, p0.y + ny * off0);
              ctx.lineTo(p1.x + nx * off1, p1.y + ny * off1);
              ctx.stroke();

              ctx.strokeStyle = `rgba(34, 211, 238, ${frac * 0.85})`;
              ctx.lineWidth = 1.5 + frac * 4.2;
              ctx.beginPath();
              ctx.moveTo(p0.x - nx * off0, p0.y - ny * off0);
              ctx.lineTo(p1.x - nx * off1, p1.y - ny * off1);
              ctx.stroke();
            }
          }
          const hGlow = QuantumRenderer._getGlowSprite('helix');
          ctx.drawImage(hGlow, m.x - 36, m.y - 36, 72, 72);

          // Custom Sculpted 3D Faceted Iridescent Crystal-Prism Bio-Needle (ZERO grey rocket!)
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(mAngle);
          ctx.scale(pulseM, pulseM);
          // Translucent crystal wing-shards
          ctx.fillStyle = 'rgba(236, 72, 153, 0.88)';
          ctx.beginPath();
          ctx.moveTo(-6, 6); ctx.lineTo(-22, 24); ctx.lineTo(-9, 18); ctx.closePath(); ctx.fill();
          ctx.fillStyle = 'rgba(34, 211, 238, 0.88)';
          ctx.beginPath();
          ctx.moveTo(6, 6); ctx.lineTo(22, 24); ctx.lineTo(9, 18); ctx.closePath(); ctx.fill();
          // Main 6-facet diamond crystal lance body
          ctx.fillStyle = '#0891b2';
          ctx.beginPath();
          ctx.moveTo(0, -34); ctx.lineTo(10, -4); ctx.lineTo(7, 22); ctx.lineTo(0, 28); ctx.lineTo(-7, 22); ctx.lineTo(-10, -4); ctx.closePath(); ctx.fill();
          // Left specular aquamarine facet & right magenta iridescent facet
          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.moveTo(0, -34); ctx.lineTo(0, 28); ctx.lineTo(-10, -4); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.moveTo(0, -34); ctx.lineTo(10, -4); ctx.lineTo(4, 22); ctx.lineTo(0, 28); ctx.closePath(); ctx.fill();
          // Bright diamond spine + glowing bio-pearl core
          ctx.fillStyle = '#ecfeff';
          ctx.beginPath();
          ctx.moveTo(0, -34); ctx.lineTo(3.5, -4); ctx.lineTo(0, 24); ctx.lineTo(-3.5, -4); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -4, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else if (mMode === 'meteor') {
          // === CHANGED (v396): SEEKER COMETS — 3D Cracked Obsidian-Magma Meteor Bolide + Mach Shock Diamonds + Orbiting Cinder Rings ===
          if (tLen > 1) {
            for (let ti = 1; ti < tLen; ti++) {
              const frac = ti / tLen;
              const p0 = m.trail[ti - 1];
              const p1 = m.trail[ti];
              // Outer deep crimson-volcanic plasma plume
              ctx.strokeStyle = `rgba(225, 29, 72, ${frac * 0.48})`;
              ctx.lineWidth = 4.5 + frac * 24.0;
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.stroke();

              // Mid solar-orange magma wake
              ctx.strokeStyle = `rgba(249, 115, 22, ${frac * 0.84})`;
              ctx.lineWidth = 2.8 + frac * 15.0;
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.stroke();

              // Inner white-gold incandescent core stream
              ctx.strokeStyle = `rgba(254, 240, 138, ${frac * 0.96})`;
              ctx.lineWidth = 1.4 + frac * 7.2;
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.stroke();

              // Supersonic Mach Shock Diamonds & Detaching Cooling Lava Cinders along the wake
              if (ti % 2 === 0) {
                const segAng = Math.atan2(p1.y - p0.y, p1.x - p0.x) + Math.PI * 0.5;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(segAng);
                ctx.fillStyle = `rgba(255, 251, 235, ${frac * 0.88})`;
                const dmW = 5.5 * frac;
                const dmH = 3.2 * frac;
                ctx.beginPath();
                ctx.moveTo(0, -dmH);
                ctx.lineTo(dmW, 0);
                ctx.lineTo(0, dmH);
                ctx.lineTo(-dmW, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                const cinderOff = Math.sin(ti * 2.4 + now * 0.032 + i) * 12;
                ctx.fillStyle = (ti % 4 === 0) ? `rgba(253, 224, 71, ${frac * 0.92})` : `rgba(251, 146, 60, ${frac * 0.85})`;
                ctx.beginPath();
                ctx.arc(p0.x + cinderOff, p0.y, 2.5 * frac, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          const mGlow = QuantumRenderer._getGlowSprite('amber');
          ctx.drawImage(mGlow, m.x - 50, m.y - 50, 100, 100);

          // Custom Sculpted 3D Blazing Molten-Lava Meteor Bolide with Golden Armored Wings & Orbiting Cinders
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(mAngle);
          ctx.scale(pulseM, pulseM);

          // 1. Twin Swept Forged-Gold & Magma Solar Wings
          ctx.fillStyle = 'rgba(234, 88, 12, 0.94)';
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-8, -6); ctx.quadraticCurveTo(-28, 6, -20, 32); ctx.lineTo(-6, 17); ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(8, -6); ctx.quadraticCurveTo(28, 6, 20, 32); ctx.lineTo(6, 17); ctx.closePath();
          ctx.fill(); ctx.stroke();

          // 2. Volcanic Molten-Basalt 3D Sphere Boulder with Tumbling Lava Fissures & Bubbling Caldera Pockets
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          const mr = 17.5;
          const bodyGrad = ctx.createRadialGradient(-mr * 0.25, -mr * 0.3, mr * 0.1, 0, 0, mr);
          bodyGrad.addColorStop(0.0, '#431407');
          bodyGrad.addColorStop(0.7, '#1c0a04');
          bodyGrad.addColorStop(1.0, '#0c0402');
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.arc(0, 0, mr, 0, Math.PI * 2);
          ctx.fill();

          ctx.rotate(now * 0.009 + (m.seed || 0) * 1.7);
          // Deep orange-red outer magma channels
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 4.2;
          ctx.beginPath();
          ctx.moveTo(-mr * 0.88, -mr * 0.28); ctx.lineTo(0, mr * 0.18); ctx.lineTo(mr * 0.88, -mr * 0.32);
          ctx.moveTo(0, -mr * 0.90); ctx.lineTo(-mr * 0.18, mr * 0.90);
          ctx.moveTo(-mr * 0.62, mr * 0.58); ctx.lineTo(mr * 0.65, mr * 0.45);
          ctx.stroke();

          // White-gold superheated inner fissure veins
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.9;
          ctx.stroke();

          // Bubbling molten crater pools
          ctx.fillStyle = '#fb923c';
          ctx.beginPath();
          ctx.arc(-mr * 0.38, -mr * 0.32, 3.4, 0, Math.PI * 2);
          ctx.arc(mr * 0.42, mr * 0.28, 3.0, 0, Math.PI * 2);
          ctx.fill();

          // White-hot incandescent heart + forged golden warhead crown
          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.arc(0, 0, mr * 0.42, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 3. Tilted Orbiting Molten Cinder Ring around the Bolide
          const orbA = now * 0.016 + (m.seed || 0) * 2.1;
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.78)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 23, 7.5, 0.28, 0, Math.PI * 2);
          ctx.stroke();
          const cxOrb = Math.cos(orbA) * 23;
          const cyOrb = Math.sin(orbA) * 7.5;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(cxOrb, cyOrb, 2.8, 0, Math.PI * 2);
          ctx.fill();

          // 4. Double Parabolic White-Gold Re-Entry Bow-Shock Hood ahead of the nose
          ctx.strokeStyle = 'rgba(255, 251, 235, 0.96)';
          ctx.lineWidth = 3.6;
          ctx.beginPath();
          ctx.moveTo(-20, -2);
          ctx.quadraticCurveTo(0, -36, 20, -2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(251, 146, 60, 0.82)';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(-25, 4);
          ctx.quadraticCurveTo(0, -43, 25, 4);
          ctx.stroke();
          ctx.restore();

        } else {
          // ARC SEEKERS (Dynamo): Jagged Electric Lightning Bolt Trail + High-Voltage Spear-Torpedo with Gold Coils
          if (tLen > 1) {
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.48)';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(m.trail[0].x, m.trail[0].y);
            for (let ti = 1; ti < tLen; ti++) {
              const jx = (ti < tLen - 1) ? Math.sin(now * 0.09 + ti * 3.1 + i) * 7 : 0;
              ctx.lineTo(m.trail[ti].x + jx, m.trail[ti].y);
            }
            ctx.stroke();

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.90)';
            ctx.lineWidth = 5.0;
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
          const dGlow = QuantumRenderer._getGlowSprite('violet');
          ctx.drawImage(dGlow, m.x - 42, m.y - 42, 84, 84);
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(mAngle);
          if (VfxUltraAssets.loaded.seekerMissile && VfxUltraAssets.seekerMissile && VfxUltraAssets.seekerMissile.naturalWidth > 0) {
            const mw = 74 * pulseM;
            const mh = 112 * pulseM;
            ctx.drawImage(VfxUltraAssets.seekerMissile, -mw * 0.5, -mh * 0.40, mw, mh);
          } else {
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.ellipse(0, 0, 9, 24, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          // 2 Glowing golden-volt electromagnetic induction coils + Tesla lightning nose lance
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.92)';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.ellipse(0, -10, 12, 4.5, Math.sin(now * 0.015) * 0.25, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, 8, 14, 5.2, -Math.sin(now * 0.015) * 0.25, 0, Math.PI * 2);
          ctx.stroke();
          // Crackling forward Tesla nose arc
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(0, -34);
          ctx.lineTo(Math.sin(now * 0.08 + i) * 5, -45);
          ctx.lineTo(0, -56);
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();

      // 4. === GLORIOUS CLIMAX REALM ULTIMATE (BACK PLANE — THE MOST WONDERFUL WEAPON IN THE UNIVERSE!) ===
      // Matches the 3 reference climax screenshots:
      // - Dynamo (STORM NOVA): Blinding violet-white core laser beam + massive V-canopy fractal lightning storm + violet-cyan plasma rays + expanding crimson-rose shock dome
      // - Meteor (CALDERA NOVA): Blazing white-gold solar core column + roaring fluid-fire pillar & curling flame tendrils + solar prominence loops + ballistic lava ejecta + crimson-amber shock dome
      // - Helix (GENESIS NOVA): Radiant cyan-white photonic genesis beam + giant 3D intertwining cyan & magenta DNA double helix with base-pair rungs climbing the beam + flying crystal prism shards + starburst rays
      if (this.activeNova) {
        const nv = this.activeNova;
        const elapsed = Math.max(0, now - (nv.startAt || now));
        if (!Number.isFinite(elapsed) || elapsed >= (nv.durationMs || 1750)) {
          this.activeNova = null;
        } else {
          try {
            // Continuously vaporize ANY bad node, Voidbloom, rift telegraph, or boss projectile during the entire Nova wave!
            this._purgeAllBadEntities(now, false);

            // Smoothly tether the erupting solar pillar directly to the live Chrome Core position (clamped to valid arena bounds)!
            const safeCx = Number.isFinite(cx) ? Math.max(20, Math.min(w - 20, cx)) : w * 0.5;
            const safeCy = Number.isFinite(cy) ? Math.max(20, Math.min(h - 20, cy)) : h * 0.82;
            nv.x = Number.isFinite(nv.x) ? (nv.x + (safeCx - nv.x) * Math.min(1, 0.36 * dtScale)) : safeCx;
            nv.y = Number.isFinite(nv.y) ? (nv.y + (safeCy - nv.y) * Math.min(1, 0.36 * dtScale)) : safeCy;
            nv.x = Math.max(20, Math.min(w - 20, nv.x));
            nv.y = Math.max(20, Math.min(h - 20, nv.y));

            const p = Math.max(0, Math.min(1, elapsed / (nv.durationMs || 1750)));
            // Punchy fast ignition ramp (0..0.08) -> sustained roaring furnace (0.08..0.72) -> dramatic fade (0.72..1.0)
            const rampIn = Math.min(1, p / 0.08);
            const fadeOut = (p < 0.65) ? 1.0 : Math.pow(Math.max(0, 1 - (p - 0.65) / 0.35), 1.15);
            const alphaEnv = Math.max(0, Math.min(1, rampIn * fadeOut));
            const mKey = nv.mode || 'meteor';
            const isMob = w < 640;
            const scaleK = isMob ? 0.80 : 1.0;

            const palMap = {
              meteor: {
                domeOuter: 'rgba(218, 62, 76, ',
                domeGlow: 'rgba(249, 115, 22, ',
                ringCore: 'rgba(255, 240, 185, ',
                ringGlow: 'rgba(251, 146, 60, ',
                spineEdge: 'rgba(249, 115, 22, ',
                spineMid: 'rgba(253, 224, 71, ',
                emberHot: '#fef08a',
                emberWarm: '#fb923c'
              },
              dynamo: {
                domeOuter: 'rgba(225, 75, 100, ',
                domeGlow: 'rgba(139, 92, 246, ',
                ringCore: 'rgba(254, 240, 138, ',
                ringGlow: 'rgba(56, 189, 248, ',
                spineEdge: 'rgba(124, 58, 237, ',
                spineMid: 'rgba(167, 139, 250, ',
                emberHot: '#e0f2fe',
                emberWarm: '#c084fc'
              },
              helix: {
                domeOuter: 'rgba(217, 70, 239, ',
                domeGlow: 'rgba(34, 211, 238, ',
                ringCore: 'rgba(240, 253, 250, ',
                ringGlow: 'rgba(232, 121, 249, ',
                spineEdge: 'rgba(192, 38, 211, ',
                spineMid: 'rgba(34, 211, 238, ',
                emberHot: '#cffafe',
                emberWarm: '#f0abfc'
              }
            };
            const pal = palMap[mKey] || palMap.meteor;
            const maxR = Math.max(300, Number.isFinite(nv.maxRadius) ? nv.maxRadius : Math.hypot(w, h) * 1.15);
            const domeR = Math.max(24, maxR * (0.24 + Math.pow(p, 0.58) * 0.62));
            const ellipseRx = Math.max(40, (isMob ? 175 : 275) * (0.72 + Math.pow(p, 0.35) * 0.42));
            const ellipseRy = Math.max(14, ellipseRx * 0.36);
            nv._ellipseRx = ellipseRx;
            nv._ellipseRy = ellipseRy;
            nv._alphaEnv = alphaEnv;
            nv._pal = pal;

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // LAYER 1A: Warm Atmospheric Furnace Ignition Flash
            if (p < 0.34) {
              const fAlpha = Math.max(0, Math.min(0.85, (1 - p / 0.34) * 0.36));
              const flashGrad = ctx.createRadialGradient(nv.x, nv.y, 16, nv.x, nv.y, Math.max(32, maxR * 0.78));
              flashGrad.addColorStop(0.0, `rgba(255, 255, 245, ${Math.min(1, fAlpha * 1.15)})`);
              flashGrad.addColorStop(0.32, `${pal.spineMid}${fAlpha * 0.78})`);
              flashGrad.addColorStop(0.70, `${pal.domeGlow}${fAlpha * 0.36})`);
              flashGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = flashGrad;
              ctx.fillRect(0, 0, w, h);
            }

            // LAYER 1B: Outer Spherical Cataclysm Shockwave Dome (Crisp Crimson-Amber Arena Ring!)
            const domeFade = Math.pow(Math.max(0, 1 - p), 0.72);
            ctx.save();
            ctx.strokeStyle = `${pal.domeGlow}${domeFade * 0.34})`;
            ctx.lineWidth = Math.max(8, 24 * domeFade);
            ctx.beginPath();
            ctx.arc(nv.x, nv.y, domeR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = `${pal.domeOuter}${domeFade * 0.94})`;
            ctx.lineWidth = Math.max(3, 10 * domeFade);
            ctx.beginPath();
            ctx.arc(nv.x, nv.y, domeR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // LAYER 2: Filled 3D Perspective Energy Vortex Disk + Seamless Back Orbital Ring
            ctx.save();
            ctx.translate(nv.x, nv.y);
            ctx.save();
            ctx.scale(1, 0.36);
            const diskGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, ellipseRx);
            diskGrad.addColorStop(0.0, `rgba(255, 255, 255, ${alphaEnv * 0.92})`);
            diskGrad.addColorStop(0.22, `${pal.spineMid}${alphaEnv * 0.68})`);
            diskGrad.addColorStop(0.58, `${pal.domeGlow}${alphaEnv * 0.34})`);
            diskGrad.addColorStop(0.88, `${pal.domeOuter}${alphaEnv * 0.18})`);
            diskGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = diskGrad;
            ctx.beginPath();
            ctx.arc(0, 0, ellipseRx, 0, Math.PI * 2);
            ctx.fill();

            // 36 rotating 3D perspective radial energy spokes inside the disk
            ctx.save();
            ctx.rotate(elapsed * 0.0007);
            ctx.lineCap = 'round';
            for (let sp = 0; sp < 36; sp++) {
              const sa = (sp / 36) * Math.PI * 2;
              const srOut = ellipseRx * (0.62 + 0.34 * Math.abs(Math.sin(sp * 2.3)));
              ctx.strokeStyle = (sp % 2 === 0) ? `${pal.ringCore}${alphaEnv * 0.34})` : `${pal.spineMid}${alphaEnv * 0.28})`;
              ctx.lineWidth = (sp % 3 === 0) ? 3.0 : 1.6;
              ctx.beginPath();
              ctx.moveTo(Math.cos(sa) * 24, Math.sin(sa) * 24);
              ctx.lineTo(Math.cos(sa) * srOut, Math.sin(sa) * srOut);
              ctx.stroke();
            }
            // 2 counter-rotating swirling vortex arcs
            ctx.strokeStyle = `${pal.ringCore}${alphaEnv * 0.42})`;
            ctx.lineWidth = 2.6;
            for (let va = 0; va < 2; va++) {
              const vr = ellipseRx * (va === 0 ? 0.42 : 0.70);
              const vStart = elapsed * (va === 0 ? 0.0018 : -0.0012) + va * 2.1;
              ctx.beginPath();
              ctx.arc(0, 0, vr, vStart, vStart + Math.PI * 1.15);
              ctx.stroke();
            }
            ctx.restore();
            ctx.restore();

            // 2B: Seamless Back Half of the 3D Orbital Ring
            ctx.lineCap = 'round';
            ctx.strokeStyle = `${pal.ringGlow}${alphaEnv * 0.52})`;
            ctx.lineWidth = 11;
            ctx.beginPath();
            ctx.ellipse(0, 0, ellipseRx, ellipseRy, 0, Math.PI - 0.06, Math.PI * 2 + 0.06);
            ctx.stroke();
            ctx.strokeStyle = `${pal.ringCore}${alphaEnv * 0.96})`;
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.ellipse(0, 0, ellipseRx, ellipseRy, 0, Math.PI - 0.06, Math.PI * 2 + 0.06);
            ctx.stroke();
            ctx.restore();

            // LAYER 3: Soft-Feathered Offscreen Eruption Column Buffer
            const pillarH = Math.max(240, nv.y + 4);
            const basePillarW = Math.max(120, (isMob ? 215 : 315) * (0.94 + 0.08 * Math.sin(elapsed * 0.024)) * scaleK);
            const flameImg = VfxUltraAssets.novaFlame[mKey];
            const wispsImg = VfxUltraAssets.novaWisps[mKey];
            const flameReady = VfxUltraAssets.loaded.novaFlame[mKey] && flameImg && flameImg.naturalWidth > 0;
            const wispsReady = VfxUltraAssets.loaded.novaWisps[mKey] && wispsImg && wispsImg.naturalWidth > 0;
            const isHelixMode = (mKey === 'helix');
            const isDynamoMode = (mKey === 'dynamo');

            // Soft royal-violet storm sheath behind Dynamo lightning
            if (isDynamoMode) {
              ctx.save();
              ctx.globalCompositeOperation = 'source-over';
              const shCy = Math.max(80, nv.y * 0.52);
              const shRy = Math.max(220, nv.y * 0.56);
              ctx.translate(nv.x, shCy);
              ctx.scale(0.58, 1.0);
              const shG = ctx.createRadialGradient(0, 0, 20, 0, 0, shRy);
              shG.addColorStop(0.0, `rgba(76, 29, 149, ${alphaEnv * 0.46})`);
              shG.addColorStop(0.55, `rgba(49, 46, 129, ${alphaEnv * 0.24})`);
              shG.addColorStop(1.0, 'rgba(30, 27, 75, 0)');
              ctx.fillStyle = shG;
              ctx.beginPath();
              ctx.arc(0, 0, shRy, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            const offW = Math.max(260, Math.min(1024, Math.ceil(basePillarW * 1.45)));
            const offH = Math.max(280, Math.min(2048, Math.ceil(pillarH + 36)));
            if (!this._novaPillarCanvas) {
              this._novaPillarCanvas = document.createElement('canvas');
              this._novaPillarCtx = this._novaPillarCanvas.getContext('2d');
            }
            if (this._novaPillarCanvas.width < offW || this._novaPillarCanvas.height < offH) {
              this._novaPillarCanvas.width = Math.max(this._novaPillarCanvas.width || 0, offW);
              this._novaPillarCanvas.height = Math.max(this._novaPillarCanvas.height || 0, offH);
            }
            const pCtx = this._novaPillarCtx;
            const midX = offW * 0.5;
            pCtx.clearRect(0, 0, offW, offH);
            pCtx.save();
            pCtx.globalCompositeOperation = 'lighter';

            // Pass 3A: Atmospheric Outer Column Aura
            const outerW = Math.max(20, basePillarW * (isHelixMode ? 0.36 : (isDynamoMode ? 0.60 : 0.68)));
            const outerG = pCtx.createLinearGradient(midX - outerW, 0, midX + outerW, 0);
            outerG.addColorStop(0.0, 'rgba(0,0,0,0)');
            outerG.addColorStop(0.28, `${pal.spineEdge}${alphaEnv * (isHelixMode ? 0.28 : 0.38)})`);
            outerG.addColorStop(0.50, `${pal.spineMid}${alphaEnv * (isHelixMode ? 0.48 : 0.62)})`);
            outerG.addColorStop(0.72, `${pal.spineEdge}${alphaEnv * (isHelixMode ? 0.28 : 0.38)})`);
            outerG.addColorStop(1.0, 'rgba(0,0,0,0)');
            pCtx.fillStyle = outerG;
            pCtx.fillRect(midX - outerW, 0, outerW * 2, offH);

            // Pass 3B: Primary Upward-Rushing Seamless Domain-Warped Turbulent Column
            if (flameReady) {
              const tileW = Math.max(48, basePillarW * (isHelixMode ? 0.42 : (isDynamoMode ? 0.72 : 1.0)));
              const tileH = Math.max(96, tileW * 2.0);
              const stepY = Math.max(32, tileH - 1);
              const scroll1 = (elapsed * 1.05) % tileH;
              pCtx.globalAlpha = alphaEnv * (isHelixMode ? 0.45 : (isDynamoMode ? 0.72 : 0.98));
              let guard = 0;
              for (let ty = nv.y + 18 + tileH - scroll1; ty > -tileH && guard < 24; ty -= stepY, guard++) {
                pCtx.drawImage(flameImg, midX - tileW * 0.5, ty - tileH, tileW, tileH);
              }
              if (!isHelixMode) {
                const scroll1b = (elapsed * 1.52) % tileH;
                pCtx.save();
                pCtx.translate(midX, 0);
                pCtx.scale(-1.08, 1);
                pCtx.globalAlpha = alphaEnv * (isDynamoMode ? 0.32 : 0.65);
                let guardB = 0;
                for (let ty = nv.y + 18 + tileH - scroll1b; ty > -tileH && guardB < 24; ty -= stepY, guardB++) {
                  pCtx.drawImage(flameImg, -tileW * 0.5, ty - tileH, tileW, tileH);
                }
                pCtx.restore();
              }
            }

            // Pass 3C: Curling Licking Flame / Plasma Tendril Ribbons Twisting Up Both Flanks
            if (wispsReady && !isHelixMode) {
              const wTileW = Math.max(48, basePillarW * (isDynamoMode ? 1.00 : 1.12));
              const wTileH = Math.max(96, wTileW * 2.0);
              const wStepY = Math.max(32, wTileH - 1);
              const scroll2 = (elapsed * 1.38) % wTileH;
              pCtx.globalAlpha = alphaEnv * (isDynamoMode ? 0.46 : 0.92);
              let guardW = 0;
              for (let ty = nv.y + 18 + wTileH - scroll2; ty > -wTileH && guardW < 24; ty -= wStepY, guardW++) {
                pCtx.drawImage(wispsImg, midX - wTileW * 0.5, ty - wTileH, wTileW, wTileH);
              }
            }

            // Pass 3D: Blinding White-Hot Central Laser / Solar / Photonic Core Spine
            pCtx.globalAlpha = 1.0;
            const spineW = Math.max(10, (isMob ? (isHelixMode ? 22 : (isDynamoMode ? 32 : 42)) : (isHelixMode ? 28 : (isDynamoMode ? 42 : 56))) * (0.92 + 0.12 * Math.sin(elapsed * 0.035)));
            const spineG = pCtx.createLinearGradient(midX - spineW, 0, midX + spineW, 0);
            spineG.addColorStop(0.0, 'rgba(255,255,255,0)');
            spineG.addColorStop(0.22, `${pal.spineMid}${alphaEnv * (isHelixMode ? 0.68 : 0.82)})`);
            spineG.addColorStop(0.40, `rgba(255, 255, 245, ${alphaEnv * 0.96})`);
            spineG.addColorStop(0.50, `rgba(255, 255, 255, ${alphaEnv * 1.0})`);
            spineG.addColorStop(0.60, `rgba(255, 255, 245, ${alphaEnv * 0.96})`);
            spineG.addColorStop(0.78, `${pal.spineMid}${alphaEnv * (isHelixMode ? 0.68 : 0.82)})`);
            spineG.addColorStop(1.0, 'rgba(255,255,255,0)');
            pCtx.fillStyle = spineG;
            pCtx.fillRect(midX - spineW, 0, spineW * 2, offH);

            // Pass 3E: Feathered Conical Base Alpha Mask
            pCtx.globalCompositeOperation = 'destination-out';
            const botY0 = Math.max(0, Math.min(offH - 12, nv.y - 42));
            const botFade = pCtx.createLinearGradient(0, botY0, 0, offH);
            botFade.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
            botFade.addColorStop(0.55, 'rgba(0, 0, 0, 0.72)');
            botFade.addColorStop(0.85, 'rgba(0, 0, 0, 1.0)');
            botFade.addColorStop(1.0, 'rgba(0, 0, 0, 1.0)');
            pCtx.fillStyle = botFade;
            pCtx.fillRect(0, botY0, offW, Math.max(1, offH - botY0));

            const flankY = nv.y + 4;
            const flankR = Math.max(32, offW * 0.46);
            [0, offW].forEach((cxF) => {
              const fg = pCtx.createRadialGradient(cxF, flankY, offW * 0.14, cxF, flankY, flankR);
              fg.addColorStop(0.0, 'rgba(0, 0, 0, 1.0)');
              fg.addColorStop(0.55, 'rgba(0, 0, 0, 0.55)');
              fg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
              pCtx.fillStyle = fg;
              pCtx.fillRect(0, Math.max(0, flankY - flankR), offW, flankR + 36);
            });
            pCtx.restore();

            ctx.globalAlpha = 1.0;
            ctx.drawImage(this._novaPillarCanvas, 0, 0, offW, offH, nv.x - midX, 0, offW, offH);

            // LAYER 4: 360° Base Sunburst + Counter-Rotating Fiery/Plasma Coronas Behind the Wings & Core
            const baseGlowKey = isDynamoMode ? 'violet' : (isHelixMode ? 'helix' : 'amber');
            const baseGlowSpr = QuantumRenderer._getGlowSprite(baseGlowKey);
            const hotBaseSpr = QuantumRenderer._getGlowSprite(isDynamoMode ? 'cyan' : (isHelixMode ? 'helix' : 'gold'));
            ctx.globalAlpha = alphaEnv * 0.92;
            ctx.drawImage(baseGlowSpr, nv.x - 165 * scaleK, nv.y - 105 * scaleK, 330 * scaleK, 190 * scaleK);
            ctx.globalAlpha = alphaEnv * 0.98;
            ctx.drawImage(hotBaseSpr, nv.x - 95 * scaleK, nv.y - 80 * scaleK, 190 * scaleK, 145 * scaleK);
            ctx.globalAlpha = 1.0;
            const corImg = VfxUltraAssets.novaCorona[mKey];
            const corReady = VfxUltraAssets.loaded.novaCorona[mKey] && corImg && corImg.naturalWidth > 0;
            if (corReady) {
              const corBase = (isMob ? 260 : 395) * (0.88 + 0.14 * Math.sin(elapsed * 0.018)) * rampIn;
              ctx.save();
              ctx.translate(nv.x, nv.y);
              ctx.scale(1.34, 0.88);
              ctx.rotate(elapsed * 0.00055);
              ctx.globalAlpha = alphaEnv * 0.96;
              ctx.drawImage(corImg, -corBase * 0.5, -corBase * 0.5, corBase, corBase);
              ctx.restore();
              ctx.save();
              ctx.translate(nv.x, nv.y);
              ctx.scale(1.06, 0.96);
              ctx.rotate(-elapsed * 0.00095 + 0.9);
              ctx.globalAlpha = alphaEnv * 0.78;
              const corIn = corBase * 0.78;
              ctx.drawImage(corImg, -corIn * 0.5, -corIn * 0.5, corIn, corIn);
              ctx.restore();
            }

            // LAYER 5: Mode-Authentic Rising Particles Constrained Inside the Conical Eruption Funnel
            if (nv.embers && nv.embers.length) {
              ctx.lineCap = 'round';
              for (let eIdx = 0; eIdx < nv.embers.length; eIdx++) {
                const em = nv.embers[eIdx];
                em.oy += em.vy * dtScale;
                em.ox += (em.vx + Math.sin(elapsed * 0.012 + em.phase) * 1.35) * dtScale;
                if (nv.y + em.oy < -24) {
                  em.oy = -8 - Math.random() * 55;
                  em.ox = (Math.random() - 0.5) * basePillarW * 0.72;
                }
                const ey = nv.y + em.oy;
                if (ey > nv.y + 8) continue;
                const hFrac = Math.min(1.0, Math.max(0.18, (nv.y - ey) / 190));
                const ex = nv.x + em.ox * hFrac;

                if (isDynamoMode) {
                  ctx.strokeStyle = (eIdx % 5 === 0) ? '#fde047' : (em.bright ? '#7dd3fc' : '#c4b5fd');
                  ctx.globalAlpha = alphaEnv * (em.bright ? 0.94 : 0.74);
                  ctx.lineWidth = Math.max(1.2, em.w * 0.85);
                  const zig1 = Math.sin(elapsed * 0.08 + em.phase) * 6;
                  const zig2 = Math.cos(elapsed * 0.09 + eIdx) * 5;
                  ctx.beginPath();
                  ctx.moveTo(ex, ey);
                  ctx.lineTo(ex + zig1, ey + em.len * 0.36);
                  ctx.lineTo(ex - zig2, ey + em.len * 0.72);
                  ctx.lineTo(ex - em.vx * 1.2, ey + em.len);
                  ctx.stroke();
                } else if (isHelixMode) {
                  const dr = em.w * 1.65;
                  ctx.fillStyle = em.bright ? '#a5f3fc' : '#f5d0fe';
                  ctx.globalAlpha = alphaEnv * (em.bright ? 0.90 : 0.72);
                  ctx.beginPath();
                  ctx.moveTo(ex, ey - dr * 1.8);
                  ctx.lineTo(ex + dr * 0.75, ey);
                  ctx.lineTo(ex, ey + dr * 1.8);
                  ctx.lineTo(ex - dr * 0.75, ey);
                  ctx.closePath();
                  ctx.fill();
                } else {
                  const curveX = ex + Math.sin(elapsed * 0.02 + em.phase) * 4.5;
                  ctx.strokeStyle = em.bright ? pal.emberHot : pal.emberWarm;
                  ctx.globalAlpha = alphaEnv * (em.bright ? 0.94 : 0.75);
                  ctx.lineWidth = em.w;
                  ctx.beginPath();
                  ctx.moveTo(ex, ey);
                  ctx.quadraticCurveTo(curveX, ey + em.len * 0.5, ex - em.vx * 1.6, ey + em.len);
                  ctx.stroke();
                }
              }
            }

            // LAYER 5B: Bespoke Per-Realm Climax Signature FX (Dynamo Lightning Storm / Helix Giant DNA Beam / Meteor Solar Prominence & Lava)
            this._drawNovaRealmFX(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, dtScale, basePillarW, isMob);
            if (nv.isTier6) {
              this._drawTier6UltBack(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, isMob);
            }

            ctx.restore();
          } catch (novaErr) {
            try { ctx.restore(); } catch (_) {}
            this.activeNova = null;
          }
        }
      }
    },

    // === Midpoint-displacement fractal lightning bolt generator ===
    _novaBolt(x0, y0, x1, y1, rough, levels) {
      let pts = [{ x: x0, y: y0 }, { x: x1, y: y1 }];
      let disp = rough;
      for (let lv = 0; lv < levels; lv++) {
        const next = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const off = (Math.random() * 2 - 1) * disp;
          next.push({ x: (a.x + b.x) * 0.5 + (-dy / len) * off, y: (a.y + b.y) * 0.5 + (dx / len) * off });
          next.push(b);
        }
        pts = next;
        disp *= 0.52;
      }
      return pts;
    },

    _strokeBoltPasses(ctx, pts, a, scale, glowCol, midCol) {
      if (!pts || pts.length < 2) return;
      const trace = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      };
      ctx.strokeStyle = `${glowCol}${0.26 * a})`;
      ctx.lineWidth = 11 * scale;
      trace();
      ctx.strokeStyle = `${midCol}${0.74 * a})`;
      ctx.lineWidth = 4.2 * scale;
      trace();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.96 * a})`;
      ctx.lineWidth = 1.6 * scale;
      trace();
    },

    _drawNovaRealmFX(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, dtScale, pillarW, isMob) {
      const mKey = nv.mode || 'meteor';
      const a = alphaEnv;
      if (a <= 0.01) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (mKey === 'dynamo') {
        // ⚡ MASSIVE MULTI-HUED V-CANOPY LIGHTNING STORM + RADIAL VIOLET-BLUE PLASMA RAYS (Matches Image 1!)
        const rx = nv._ellipseRx || 240;
        const ry = nv._ellipseRy || 86;

        // Radiant violet/cyan starburst rays fanning behind the Dynamo wings
        ctx.save();
        ctx.translate(nv.x, nv.y);
        ctx.scale(1.0, 0.58);
        ctx.rotate(elapsed * 0.0003);
        for (let rI = 0; rI < 28; rI++) {
          const ang = (rI / 28) * Math.PI * 2;
          const len = (isMob ? 175 : 265) * (0.58 + 0.42 * Math.abs(Math.sin(rI * 2.71))) * rampIn;
          ctx.strokeStyle = (rI % 2 === 0) ? `rgba(167, 139, 250, ${0.42 * a})` : `rgba(56, 189, 248, ${0.38 * a})`;
          ctx.lineWidth = (rI % 3 === 0) ? 2.4 : 1.4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 44, Math.sin(ang) * 44);
          ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
          ctx.stroke();
        }
        ctx.restore();

        if (!nv._boltAt || elapsed - nv._boltAt > 56) {
          nv._prevBolts = nv._bolts || null;
          nv._boltAt = elapsed;
          const trunks = [];
          const branches = [];
          const ground = [];
          const rimArcs = [];
          const topY = -24;
          const trunkCount = isMob ? 4 : 6;

          for (let t = 0; t < trunkCount; t++) {
            const norm = (t / (trunkCount - 1)) - 0.5;
            const xCore = nv.x + (t - (trunkCount - 1) * 0.5) * 7;
            const yCore = nv.y - 8;
            const xTop = nv.x + norm * pillarW * 2.5 + (Math.random() - 0.5) * 60;
            trunks.push({
              pts: this._novaBolt(xTop, topY, xCore, yCore, 66, 4),
              style: t % 3
            });
          }

          const branchCount = isMob ? 12 : 18;
          for (let b = 0; b < branchCount; b++) {
            let sx, sy, side, len, ang;
            if (b < Math.floor(branchCount * 0.5)) {
              const frac = b / Math.max(1, Math.floor(branchCount * 0.5) - 1);
              side = (b % 2 === 0) ? -1 : 1;
              sx = nv.x + side * (12 + Math.random() * 26);
              sy = nv.y - 18 - frac * 72;
              len = (isMob ? 130 : 190) + Math.random() * (isMob ? 180 : 280);
              ang = -Math.PI * 0.5 + side * (0.48 + Math.random() * 0.85);
            } else {
              const tr = trunks[b % trunks.length].pts;
              const si = Math.min(tr.length - 1, 2 + Math.floor(Math.random() * Math.max(2, tr.length - 4)));
              const s = tr[si];
              sx = s.x;
              sy = s.y;
              side = (sx < nv.x) ? -1 : ((sx > nv.x) ? 1 : (b % 2 === 0 ? -1 : 1));
              len = (isMob ? 110 : 160) + Math.random() * (isMob ? 160 : 240);
              ang = -Math.PI * 0.5 + side * (0.50 + Math.random() * 0.78);
            }
            const ex = sx + Math.cos(ang) * len * 1.25;
            const ey = sy + Math.sin(ang) * len * 0.62;
            const style = (b % 5 === 0) ? 2 : (b % 2);
            const br = this._novaBolt(sx, sy, ex, ey, 34, 3);
            branches.push({ pts: br, style });
            if (Math.random() < 0.55 && br.length > 4) {
              const tw = br[Math.floor(br.length * (0.35 + Math.random() * 0.35))];
              branches.push({
                pts: this._novaBolt(tw.x, tw.y, tw.x + side * (48 + Math.random() * 105), tw.y + (Math.random() - 0.55) * 90, 18, 2),
                style: style
              });
            }
          }

          for (let g = 0; g < 10; g++) {
            const ga = (g / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
            const reach = 0.58 + Math.random() * 0.44;
            ground.push({
              pts: this._novaBolt(nv.x, nv.y, nv.x + Math.cos(ga) * rx * reach, nv.y + Math.sin(ga) * ry * reach, 22, 3),
              style: g % 4 === 0 ? 2 : (g % 2)
            });
          }
          for (let ra = 0; ra < 4; ra++) {
            const a0 = Math.random() * Math.PI * 2;
            const a1 = a0 + 0.45 + Math.random() * 0.55;
            rimArcs.push({
              pts: this._novaBolt(nv.x + Math.cos(a0) * rx, nv.y + Math.sin(a0) * ry, nv.x + Math.cos(a1) * rx, nv.y + Math.sin(a1) * ry, 14, 2),
              style: 2
            });
          }

          const arcs = [];
          for (let c = 0; c < 6; c++) {
            const a0 = Math.random() * Math.PI * 2;
            const a1 = a0 + 0.8 + Math.random() * 1.5;
            const r0 = 46 + Math.random() * 18;
            arcs.push({
              pts: this._novaBolt(nv.x + Math.cos(a0) * r0, nv.y + Math.sin(a0) * r0, nv.x + Math.cos(a1) * r0, nv.y + Math.sin(a1) * r0, 14, 2),
              style: c % 3
            });
          }
          nv._bolts = { trunks, branches, ground, rimArcs };
          nv._coreArcs = arcs;
          nv._strobe = Math.random() < 0.20;
        }

        const boltPalette = (st) => {
          if (st === 2) return ['rgba(245, 158, 11, ', 'rgba(253, 224, 71, '];
          if (st === 1) return ['rgba(124, 58, 237, ', 'rgba(192, 132, 252, '];
          return ['rgba(99, 102, 241, ', 'rgba(56, 189, 248, '];
        };

        if (nv._strobe && p < 0.82) {
          ctx.fillStyle = `rgba(196, 181, 253, ${0.055 * a})`;
          ctx.fillRect(0, 0, w, h);
        }

        if (nv._prevBolts) {
          const prev = nv._prevBolts;
          for (let i = 0; i < prev.trunks.length; i++) {
            this._strokeBoltPasses(ctx, prev.trunks[i].pts, a * 0.34, 0.82, 'rgba(109, 40, 217, ', 'rgba(167, 139, 250, ');
          }
          for (let i = 0; i < prev.branches.length; i++) {
            this._strokeBoltPasses(ctx, prev.branches[i].pts, a * 0.30, 0.50, 'rgba(109, 40, 217, ', 'rgba(167, 139, 250, ');
          }
        }

        const bl = nv._bolts;
        for (let i = 0; i < bl.branches.length; i++) {
          const cols = boltPalette(bl.branches[i].style);
          this._strokeBoltPasses(ctx, bl.branches[i].pts, a * 0.90, 0.66, cols[0], cols[1]);
        }
        for (let i = 0; i < bl.ground.length; i++) {
          const cols = boltPalette(bl.ground[i].style);
          this._strokeBoltPasses(ctx, bl.ground[i].pts, a * 0.84, 0.56, cols[0], cols[1]);
        }
        for (let i = 0; i < bl.rimArcs.length; i++) {
          this._strokeBoltPasses(ctx, bl.rimArcs[i].pts, a * 0.92, 0.62, 'rgba(245, 158, 11, ', 'rgba(253, 224, 71, ');
        }
        for (let i = 0; i < bl.trunks.length; i++) {
          const cols = boltPalette(bl.trunks[i].style);
          this._strokeBoltPasses(ctx, bl.trunks[i].pts, a, 1.08, cols[0], cols[1]);
        }
        const tipSprC = QuantumRenderer._getGlowSprite('cyan');
        const tipSprV = QuantumRenderer._getGlowSprite('violet');
        ctx.globalAlpha = a * 0.72;
        for (let i = 0; i < bl.branches.length; i++) {
          const pts = bl.branches[i].pts;
          const tip = pts[pts.length - 1];
          ctx.drawImage(bl.branches[i].style === 1 ? tipSprV : tipSprC, tip.x - 13, tip.y - 13, 26, 26);
        }
        ctx.globalAlpha = 1.0;

      } else if (mKey === 'helix') {
        // 🧬 SPIRALLING GIANT DNA DOUBLE HELIX + 3 RISING 3D HARMONIC RINGS + CRYSTAL SHARDS + STARBURST RAYS (Matches Image 3!)
        const amp = pillarW * 0.30;
        const step = isMob ? 7 : 6;
        const k = 0.021;
        const scroll = elapsed * 0.62;
        const baseY = nv.y - 22;
        const frontA = [], backA = [], frontB = [], backB = [], ghostA = [], ghostB = [];
        const rungs = [];
        let prev = null;
        for (let y = baseY; y > -20; y -= step) {
          const rise = Math.min(1, (baseY - y) / 90);
          const ph = (y + scroll) * k;
          const s = Math.sin(ph);
          const c = Math.cos(ph);
          const gs = Math.sin(ph + Math.PI * 0.5);
          const A = amp * (0.35 + 0.65 * rise);
          const cur = { y, xa: nv.x + s * A, xb: nv.x - s * A, gxa: nv.x + gs * A * 1.32, gxb: nv.x - gs * A * 1.32, za: c, ph };
          if (prev) {
            (cur.za >= 0 ? frontA : backA).push([prev.xa, prev.y, cur.xa, cur.y]);
            (cur.za < 0 ? frontB : backB).push([prev.xb, prev.y, cur.xb, cur.y]);
            ghostA.push([prev.gxa, prev.y, cur.gxa, cur.y]);
            ghostB.push([prev.gxb, prev.y, cur.gxb, cur.y]);
          }
          if (Math.floor(ph / 0.55) !== Math.floor((prev ? prev.ph : ph - 1) / 0.55)) {
            rungs.push(cur);
          }
          prev = cur;
        }
        const strokeSegs = (segs, col, width) => {
          if (!segs.length) return;
          ctx.strokeStyle = col;
          ctx.lineWidth = width;
          ctx.beginPath();
          for (let i = 0; i < segs.length; i++) {
            ctx.moveTo(segs[i][0], segs[i][1]);
            ctx.lineTo(segs[i][2], segs[i][3]);
          }
          ctx.stroke();
        };
        strokeSegs(ghostA, `rgba(103, 232, 249, ${0.28 * a})`, 1.6);
        strokeSegs(ghostB, `rgba(240, 171, 252, ${0.28 * a})`, 1.6);
        strokeSegs(backA, `rgba(232, 121, 249, ${0.48 * a})`, 3.6);
        strokeSegs(backB, `rgba(34, 211, 238, ${0.48 * a})`, 3.6);
        ctx.strokeStyle = `rgba(207, 250, 254, ${0.65 * a})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let i = 0; i < rungs.length; i++) {
          ctx.moveTo(rungs[i].xa, rungs[i].y);
          ctx.lineTo(rungs[i].xb, rungs[i].y);
        }
        ctx.stroke();
        strokeSegs(frontA, `rgba(240, 171, 252, ${0.42 * a})`, 14);
        strokeSegs(frontB, `rgba(103, 232, 249, ${0.42 * a})`, 14);
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        strokeSegs(frontA, `rgba(236, 72, 153, ${0.96 * a})`, 5.4);
        strokeSegs(frontB, `rgba(6, 182, 212, ${0.96 * a})`, 5.4);
        strokeSegs(frontA, `rgba(253, 224, 247, ${0.88 * a})`, 1.8);
        strokeSegs(frontB, `rgba(207, 250, 254, ${0.88 * a})`, 1.8);
        ctx.restore();

        // 3 Rising 3D Perspective Harmonic Pulse Rings climbing the DNA column
        for (let hr = 0; hr < 3; hr++) {
          const ph = ((elapsed * 0.0014) + hr / 3) % 1;
          const hy = nv.y - 24 - ph * (nv.y + 12);
          const hrx = pillarW * (0.24 + ph * 0.34);
          const hry = hrx * 0.34;
          const hAlpha = a * (1 - ph) * 0.82;
          ctx.strokeStyle = (hr % 2 === 0) ? `rgba(34, 211, 238, ${hAlpha})` : `rgba(236, 72, 153, ${hAlpha})`;
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.ellipse(nv.x, hy, hrx, hry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Nucleotide glow beads at front rung ends
        const beadM = QuantumRenderer._getGlowSprite('magPt');
        const beadC = QuantumRenderer._getGlowSprite('cyanPt');
        ctx.globalAlpha = a * 0.9;
        for (let i = 0; i < rungs.length; i++) {
          const r = rungs[i];
          ctx.drawImage(r.za >= 0 ? beadM : beadC, (r.za >= 0 ? r.xa : r.xb) - 7, r.y - 7, 14, 14);
        }
        ctx.globalAlpha = 1.0;

        // Ripple of concentric bio-lattice ground rings
        const rx = nv._ellipseRx || 240;
        const ry = nv._ellipseRy || 86;
        for (let rI = 0; rI < 3; rI++) {
          const ph = ((elapsed * 0.0011) + rI / 3) % 1;
          const sc = 0.55 + ph * 1.15;
          ctx.strokeStyle = (rI % 2 === 0) ? `rgba(34, 211, 238, ${a * (1 - ph) * 0.85})` : `rgba(232, 121, 249, ${a * (1 - ph) * 0.85})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.ellipse(nv.x, nv.y, rx * sc, ry * sc, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Flying prismatic crystal shards bursting outward from the beam
        if (!nv._shards) {
          nv._shards = [];
          for (let sI = 0; sI < (isMob ? 26 : 40); sI++) {
            nv._shards.push({ ox: 0, oy: -Math.random() * nv.y, vx: 0, vy: 0, rot: 0, vr: 0, sz: 0, col: 0, init: false });
          }
        }
        for (let sI = 0; sI < nv._shards.length; sI++) {
          const sh = nv._shards[sI];
          if (!sh.init || nv.y + sh.oy < -30 || Math.abs(sh.ox) > w * 0.6) {
            const side = Math.random() < 0.5 ? -1 : 1;
            sh.ox = side * pillarW * (0.12 + Math.random() * 0.18);
            sh.oy = -20 - Math.random() * Math.max(120, nv.y - 40);
            sh.vx = side * (1.6 + Math.random() * 3.2);
            sh.vy = -(1.2 + Math.random() * 3.0);
            sh.rot = Math.random() * Math.PI;
            sh.vr = (Math.random() - 0.5) * 0.18;
            sh.sz = 6 + Math.random() * 9;
            sh.col = Math.floor(Math.random() * 3);
            sh.init = true;
          }
          sh.ox += sh.vx * dtScale;
          sh.oy += sh.vy * dtScale;
          sh.rot += sh.vr * dtScale;
          const sx = nv.x + sh.ox;
          const sy = nv.y + sh.oy;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.atan2(sh.vy, sh.vx) + Math.PI * 0.5 + sh.rot * 0.2);
          ctx.fillStyle = sh.col === 0 ? `rgba(165, 243, 252, ${0.85 * a})` : (sh.col === 1 ? `rgba(240, 171, 252, ${0.85 * a})` : `rgba(255, 255, 255, ${0.9 * a})`);
          ctx.beginPath();
          ctx.moveTo(0, -sh.sz);
          ctx.lineTo(sh.sz * 0.32, 0);
          ctx.lineTo(0, sh.sz * 0.7);
          ctx.lineTo(-sh.sz * 0.32, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Razor-thin radiant starburst rays fanning from the core
        ctx.save();
        ctx.translate(nv.x, nv.y);
        ctx.scale(1.0, 0.42);
        ctx.rotate(elapsed * 0.0004);
        for (let rI = 0; rI < 28; rI++) {
          const ang = (rI / 28) * Math.PI * 2;
          const len = (isMob ? 150 : 230) * (0.6 + 0.4 * Math.abs(Math.sin(rI * 2.71))) * rampIn;
          ctx.strokeStyle = (rI % 2) ? `rgba(165, 243, 252, ${0.42 * a})` : `rgba(240, 171, 252, ${0.38 * a})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 40, Math.sin(ang) * 40);
          ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
          ctx.stroke();
        }
        ctx.restore();

      } else {
        // 🌋 CALDERA NOVA (Meteor) — 8 Solar Prominence Flame Loops + 3 Rising Molten Shock-Halos + Lava Ejecta (Matches Image 2!)
        const grow = Math.min(1, elapsed / 420);
        for (let lI = 0; lI < 8; lI++) {
          const side = (lI % 2 === 0) ? -1 : 1;
          const tier = Math.floor(lI / 2);
          const sway = Math.sin(elapsed * 0.015 + lI * 1.35) * (12 + tier * 5);
          const baseX = nv.x + side * (18 + tier * 9);
          const loopH = (isMob ? 105 : 155) * (0.68 + tier * 0.36) * grow;
          const endX = nv.x + side * (28 + tier * 22) + sway * 0.65;
          const endY = nv.y - loopH * 1.45;
          const cp1X = baseX + side * (42 + tier * 18);
          const cp1Y = nv.y - loopH * 0.42;
          const cp2X = nv.x + side * (pillarW * (0.14 + tier * 0.06)) - sway * 0.45;
          const cp2Y = nv.y - loopH * 1.02;
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.28 * a})`;
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(baseX, nv.y - 10);
          ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
          ctx.stroke();
          ctx.strokeStyle = `rgba(253, 186, 116, ${0.65 * a})`;
          ctx.lineWidth = 3.2;
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 251, 235, ${0.58 * a})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        // 3 Rising 3D Perspective Molten Shock-Halos softly blending into the fire column
        for (let sr = 0; sr < 3; sr++) {
          const ph = ((elapsed * 0.0014) + sr / 3) % 1;
          const sy = nv.y - 20 - ph * (nv.y + 10);
          const srx = pillarW * (0.26 + ph * 0.38);
          const sry = srx * 0.34;
          const sAlpha = a * Math.sin(ph * Math.PI) * 0.58;
          ctx.strokeStyle = `rgba(249, 115, 22, ${sAlpha * 0.48})`;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.ellipse(nv.x, sy, srx, sry, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = `rgba(254, 240, 138, ${sAlpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        // Ballistic molten lava ejecta
        if (!nv._lava) {
          nv._lava = [];
          for (let jI = 0; jI < (isMob ? 18 : 28); jI++) {
            const ang = -Math.PI * 0.5 + (Math.random() - 0.5) * 2.4;
            const spd = 6 + Math.random() * 9;
            nv._lava.push({ x: nv.x, y: nv.y - 10, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, r: 3 + Math.random() * 4.5, px: nv.x, py: nv.y });
          }
        }
        const lavaSpr = QuantumRenderer._getGlowSprite('emberPt');
        for (let jI = 0; jI < nv._lava.length; jI++) {
          const lv = nv._lava[jI];
          lv.px = lv.x;
          lv.py = lv.y;
          lv.vy += 0.32 * dtScale;
          lv.x += lv.vx * dtScale;
          lv.y += lv.vy * dtScale;
          if (lv.y > h + 30 || lv.x < -30 || lv.x > w + 30) continue;
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.72 * a})`;
          ctx.lineWidth = lv.r * 0.9;
          ctx.beginPath();
          ctx.moveTo(lv.px - lv.vx * 1.6, lv.py - lv.vy * 1.6);
          ctx.lineTo(lv.x, lv.y);
          ctx.stroke();
          ctx.globalAlpha = a;
          ctx.drawImage(lavaSpr, lv.x - lv.r * 3, lv.y - lv.r * 3, lv.r * 6, lv.r * 6);
          ctx.globalAlpha = 1.0;
        }
      }
    },

    // === NOVA 3D FOREGROUND PASS (SEAMLESS FRONT RING + CORE IGNITION CROWN + LIGHTNING ARCS) ===
    drawNovaForeground(ctx, cx, cy, now, w, h) {
      if (!this.activeNova) return;
      const nv = this.activeNova;
      const alphaEnv = nv._alphaEnv || 0;
      if (alphaEnv <= 0.01) return;
      const pal = nv._pal;
      const rx = Math.max(40, nv._ellipseRx || 220);
      const ry = Math.max(14, nv._ellipseRy || 80);
      if (!pal || !Number.isFinite(nv.x) || !Number.isFinite(nv.y)) return;

      ctx.save();
      try {
        ctx.globalCompositeOperation = 'lighter';

        // LAYER 6: Front Half (0..PI) of the 3D Orbital Ellipse with round cap & slight overlap
        ctx.save();
        ctx.translate(nv.x, nv.y);
        ctx.lineCap = 'round';
        ctx.strokeStyle = `${pal.ringGlow}${alphaEnv * 0.58})`;
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, -0.05, Math.PI + 0.05);
        ctx.stroke();

        ctx.strokeStyle = `${pal.ringCore}${alphaEnv * 0.98})`;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, -0.05, Math.PI + 0.05);
        ctx.stroke();

        // Equatorial horizon node glints + moving front rim glint
        const gSpr = QuantumRenderer._getGlowSprite('gold');
        ctx.globalAlpha = alphaEnv * 0.55;
        ctx.drawImage(gSpr, -rx - 18, -14, 36, 28);
        ctx.drawImage(gSpr, rx - 18, -14, 36, 28);
        const glintX = Math.cos(now * 0.005) * rx * 0.72;
        const glintY = Math.sqrt(Math.max(0, 1 - (glintX * glintX) / (rx * rx))) * ry;
        ctx.globalAlpha = alphaEnv * 0.85;
        ctx.drawImage(gSpr, glintX - 24, glintY - 14, 48, 28);
        ctx.restore();

        // LAYER 7: Core-Hugging Ignition Crown Flare where the Pillar Erupts out of the Top of the Core
        const topGlow = QuantumRenderer._getGlowSprite(nv.mode === 'meteor' ? 'gold' : (nv.mode === 'helix' ? 'helix' : 'cyan'));
        ctx.globalAlpha = alphaEnv * 0.78;
        ctx.drawImage(topGlow, nv.x - 66, nv.y - 78, 132, 104);
        ctx.globalAlpha = 1.0;

        // LAYER 7B: Twin Wing-to-Pillar Synchro-Energy Conduit Arcs (Bridges Both Wingtips into the Rising Ultimate Beam!)
        const wingSpanX = Math.min(w * 0.36, 152);
        const wingArchY = nv.y - 42;
        const beamConvergeY = Math.max(24, nv.y - 165);
        ctx.lineCap = 'round';
        for (let side = -1; side <= 1; side += 2) {
          const wx0 = nv.x + side * 52;
          const wy0 = nv.y - 12;
          const wxTip = nv.x + side * wingSpanX;
          const wyTip = wingArchY + Math.sin(now * 0.016 + side) * 6;
          const wxBeam = nv.x + side * 26;

          if (nv.mode === 'dynamo') {
            // Crackling high-voltage wingtip-to-pillar lightning bridge
            const bridgePts = this._novaBolt(wxTip, wyTip, wxBeam, beamConvergeY, 16, 3);
            this._strokeBoltPasses(ctx, bridgePts, alphaEnv * 0.90, 0.58, 'rgba(56, 189, 248, ', 'rgba(253, 224, 71, ');
          } else if (nv.mode === 'helix') {
            // Prismatic cyan-magenta harmonic ribbon arching from each wingtip into the DNA pillar
            ctx.strokeStyle = (side < 0) ? `rgba(34, 211, 238, ${alphaEnv * 0.72})` : `rgba(236, 72, 153, ${alphaEnv * 0.72})`;
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo(wx0, wy0);
            ctx.quadraticCurveTo(wxTip, wyTip - 24, wxBeam, beamConvergeY);
            ctx.stroke();

            ctx.strokeStyle = `rgba(255, 255, 255, ${alphaEnv * 0.88})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            // Blazing solar prominence fire-arch rising from each golden wingtip into the Caldera column
            ctx.strokeStyle = `rgba(249, 115, 22, ${alphaEnv * 0.76})`;
            ctx.lineWidth = 5.0;
            ctx.beginPath();
            ctx.moveTo(wx0, wy0);
            ctx.quadraticCurveTo(wxTip, wyTip - 28, wxBeam, beamConvergeY);
            ctx.stroke();

            ctx.strokeStyle = `rgba(254, 249, 195, ${alphaEnv * 0.92})`;
            ctx.lineWidth = 1.7;
            ctx.stroke();
          }
        }

        // LAYER 8: Dynamo — Multi-Hued Crackling Electric Arcs Wrapping Over the Core Surface
        if (nv.mode === 'dynamo' && nv._coreArcs) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let i = 0; i < nv._coreArcs.length; i++) {
            const arc = nv._coreArcs[i];
            const pts = arc.pts || arc;
            const st = arc.style || 0;
            const c0 = st === 2 ? 'rgba(245, 158, 11, ' : (st === 1 ? 'rgba(139, 92, 246, ' : 'rgba(59, 130, 246, ');
            const c1 = st === 2 ? 'rgba(253, 224, 71, ' : (st === 1 ? 'rgba(192, 132, 252, ' : 'rgba(125, 211, 252, ');
            this._strokeBoltPasses(ctx, pts, alphaEnv * 0.94, 0.56, c0, c1);
          }
        }

        // LAYER 9: Tier VI Grand 3D Volumetric Ultimate Foreground Occlusion & Shoulder Tri-Beams
        if (nv.isTier6) {
          this._drawTier6UltFront(ctx, nv, now, w, h);
        }
      } catch (_) {}
      ctx.restore();
    },

    // === GRAND 3D TIER VI ULTIMATE RENDERERS (True Z-Depth Occlusion Behind & In Front of Dragon / Unicorn / Princess, Zero shadowBlur) ===
    _drawTier6UltBack(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, isMob) {
      const a = alphaEnv;
      if (a <= 0.01) return;
      const mKey = nv.mode || 'dynamo';
      const u = CoreGeometryDB.computeCoreMetrics(w, h, 6, isMob, null).u;
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const rot = elapsed * 0.0018;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Foreshortened 3D Sacred-Geometry Cathedral Floor Circle
      ctx.save();
      ctx.translate(nv.x, nv.y + 22 * u);
      ctx.scale(1.0, 0.34);
      const outerR = (isMob ? 150 : 215) * rampIn;
      const ringCol = mKey === 'meteor' ? `rgba(251, 146, 60, ${0.46 * a})` : (mKey === 'helix' ? `rgba(103, 232, 249, ${0.44 * a})` : `rgba(196, 181, 253, ${0.48 * a})`);
      const goldCol = `rgba(253, 224, 71, ${0.52 * a})`;
      ctx.strokeStyle = ringCol;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      for (let k = 0; k < 12; k++) {
        const ang = rot + (k / 12) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * outerR * 0.80, Math.sin(ang) * outerR * 0.80);
        ctx.lineTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Z-Sorted Back-Half (sin(ang) < 0) of Ascending 3D Coils / Chiral Triple-Helix
      const steps = 26;
      const colSpanY = nv.y + 24;
      const strandCount = (mKey === 'helix') ? 3 : 2;
      for (let s = 0; s < strandCount; s++) {
        const strandCol = mKey === 'meteor'
          ? (s === 0 ? `rgba(251, 146, 60, ${0.65 * a})` : `rgba(253, 224, 71, ${0.58 * a})`)
          : (mKey === 'helix'
            ? (s === 0 ? `rgba(34, 211, 238, ${0.66 * a})` : (s === 1 ? `rgba(244, 114, 182, ${0.62 * a})` : `rgba(192, 132, 252, ${0.56 * a})`))
            : (s === 0 ? `rgba(96, 165, 250, ${0.66 * a})` : `rgba(253, 224, 71, ${0.60 * a})`));
        ctx.strokeStyle = strandCol;
        ctx.lineWidth = isMob ? 3.2 : 4.4;
        let drawing = false;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const f = i / steps;
          const yy = nv.y + 18 * u - f * colSpanY;
          const ang = f * Math.PI * 5.0 - elapsed * 0.008 + s * ((Math.PI * 2) / strandCount);
          const radiusF = (0.85 - f * 0.35) * (isMob ? 72 : 102) * rampIn;
          if (Math.sin(ang) < 0) {
            const xx = nv.x + Math.cos(ang) * radiusF;
            const y3d = yy + Math.sin(ang) * 14 * u;
            if (!drawing) { ctx.moveTo(xx, y3d); drawing = true; }
            else ctx.lineTo(xx, y3d);
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 3. Ascending 3D Perspective Shock-Rings (back arcs behind character)
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const ringFrac = ((p * 2.4 + rIdx * 0.33) % 1.0);
        const ringY = nv.y - ringFrac * Math.min(h * 0.72, 460);
        const rrX = rx * (0.72 + ringFrac * 0.42);
        const rrY = ry * (0.65 + ringFrac * 0.32);
        const rAlpha = (1.0 - ringFrac) * a * 0.65;
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(251, 146, 60, ${rAlpha})` : (mKey === 'helix' ? `rgba(103, 232, 249, ${rAlpha})` : `rgba(167, 139, 250, ${rAlpha})`);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(nv.x, ringY, rrX, rrY, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Dynamo Princess Only: Back-Half Orbiting 3D Crystal Lance Sigils (sin(ang) < 0)
      if (mKey === 'dynamo') {
        for (let k = 0; k < 4; k++) {
          const ang = elapsed * 0.0036 + k * (Math.PI * 0.5);
          if (Math.sin(ang) >= 0) continue;
          const sx = nv.x + Math.cos(ang) * rx * 0.92;
          const sy = nv.y - 10 * u + Math.sin(ang) * ry * 0.85;
          const sc = 0.76 + 0.14 * (Math.sin(ang) + 1);
          ctx.fillStyle = `rgba(196, 181, 253, ${0.72 * a})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy - 20 * u * sc);
          ctx.lineTo(sx + 7 * u * sc, sy);
          ctx.lineTo(sx, sy + 14 * u * sc);
          ctx.lineTo(sx - 7 * u * sc, sy);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    },

    _drawTier6UltFront(ctx, nv, now, w, h) {
      const elapsed = Math.max(0, now - nv.startAt);
      const p = Math.min(1.0, elapsed / nv.durationMs);
      const a = nv._alphaEnv || 0;
      if (a <= 0.01) return;
      const mKey = nv.mode || 'dynamo';
      const isMob = w < 600;
      const u = CoreGeometryDB.computeCoreMetrics(w, h, 6, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank);

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Twin Shoulder Weapons Ignition Convergence Beams + Central Apex Conduit
      const apexY = Math.max(-20, nv.y - h * 0.78);
      const centerX = nv.x;
      const centerY = mKey === 'helix' ? (nv.y - 122 * u) : (nv.y - 72 * u);
      const beamCol = mKey === 'meteor' ? `rgba(251, 146, 60, ${0.78 * a})` : (mKey === 'helix' ? `rgba(34, 211, 238, ${0.78 * a})` : `rgba(167, 139, 250, ${0.78 * a})`);
      const coreSpr = QuantumRenderer._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'cyan' : 'violet'));

      [mzs.left, mzs.right].forEach((mz) => {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = beamCol;
        ctx.lineWidth = Math.max(5.5, 9.0 * u);
        ctx.beginPath();
        ctx.moveTo(mz.x, mz.y);
        ctx.lineTo(mz.x * 0.35 + centerX * 0.65, apexY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * a})`;
        ctx.lineWidth = Math.max(2.0, 3.0 * u);
        ctx.stroke();

        ctx.globalAlpha = 0.85 * a;
        ctx.drawImage(coreSpr, mz.x - 26 * u, mz.y - 26 * u, 52 * u, 52 * u);
      });

      if (mKey === 'helix') {
        ctx.globalAlpha = a;
        const hornGlow = QuantumRenderer._getGlowSprite('cyan');
        ctx.drawImage(hornGlow, centerX - 38 * u, centerY - 38 * u, 76 * u, 76 * u);
        ctx.fillStyle = `rgba(224, 242, 254, ${0.96 * a})`;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 28 * u);
        ctx.lineTo(centerX + 8 * u, centerY);
        ctx.lineTo(centerX, centerY + 14 * u);
        ctx.lineTo(centerX - 8 * u, centerY);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.globalAlpha = 0.78 * a;
        ctx.drawImage(coreSpr, centerX - 34 * u, centerY - 34 * u, 68 * u, 68 * u);
      }
      ctx.globalAlpha = 1.0;

      // 2. Z-Sorted Front-Half (sin(ang) >= 0) of Ascending 3D Coils / Chiral Triple-Helix
      const steps = 26;
      const colSpanY = nv.y + 24;
      const strandCount = (mKey === 'helix') ? 3 : 2;
      for (let s = 0; s < strandCount; s++) {
        const strandCol = mKey === 'meteor'
          ? (s === 0 ? `rgba(253, 224, 71, ${0.92 * a})` : `rgba(251, 146, 60, ${0.88 * a})`)
          : (mKey === 'helix'
            ? (s === 0 ? `rgba(103, 232, 249, ${0.92 * a})` : (s === 1 ? `rgba(244, 114, 182, ${0.90 * a})` : `rgba(255, 255, 255, ${0.85 * a})`))
            : (s === 0 ? `rgba(253, 224, 71, ${0.92 * a})` : `rgba(125, 211, 252, ${0.90 * a})`));
        ctx.strokeStyle = strandCol;
        ctx.lineWidth = isMob ? 3.8 : 5.2;
        let drawing = false;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const f = i / steps;
          const yy = nv.y + 18 * u - f * colSpanY;
          const ang = f * Math.PI * 5.0 - elapsed * 0.008 + s * ((Math.PI * 2) / strandCount);
          if (Math.sin(ang) >= 0) {
            const radiusF = (0.85 - f * 0.35) * (isMob ? 72 : 102) * rampIn;
            const xx = nv.x + Math.cos(ang) * radiusF;
            const y3d = yy + Math.sin(ang) * 14 * u;
            if (!drawing) { ctx.moveTo(xx, y3d); drawing = true; }
            else ctx.lineTo(xx, y3d);
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 3. Ascending 3D Perspective Shock-Rings (front arcs passing OVER character)
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const ringFrac = ((p * 2.4 + rIdx * 0.33) % 1.0);
        const ringY = nv.y - ringFrac * Math.min(h * 0.72, 460);
        const rrX = rx * (0.72 + ringFrac * 0.42);
        const rrY = ry * (0.65 + ringFrac * 0.32);
        const rAlpha = (1.0 - ringFrac) * a * 0.90;
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(254, 240, 138, ${rAlpha})` : (mKey === 'helix' ? `rgba(244, 114, 182, ${rAlpha})` : `rgba(253, 224, 71, ${rAlpha})`);
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.ellipse(nv.x, ringY, rrX, rrY, 0, 0, Math.PI);
        ctx.stroke();
      }

      // 4. Dynamo Princess Only: Front-Half Orbiting 3D Crystal Lance Sigils (sin(ang) >= 0)
      if (mKey === 'dynamo') {
        for (let k = 0; k < 4; k++) {
          const ang = elapsed * 0.0036 + k * (Math.PI * 0.5);
          if (Math.sin(ang) < 0) continue;
          const sx = nv.x + Math.cos(ang) * rx * 0.92;
          const sy = nv.y - 10 * u + Math.sin(ang) * ry * 0.85;
          const sc = 0.88 + 0.24 * Math.sin(ang);
          ctx.fillStyle = `rgba(224, 242, 254, ${0.95 * a})`;
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.92 * a})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sx, sy - 24 * u * sc);
          ctx.lineTo(sx + 8 * u * sc, sy);
          ctx.lineTo(sx, sy + 16 * u * sc);
          ctx.lineTo(sx - 8 * u * sc, sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // === CHANGED (v388): STEP 6 — PHOTOREALISTIC 3D VOIDBLOOM NODE HAZARD ===
  // Sculpted 3D obsidian-violet claw orb (assets/voidbloom-3d.png) + back/front
  // 3D perspective tilted orbital rings + live volumetric toxic-emerald plasma!
  // Telegraphed 1s spawn, grows 1x -> 6x over 15s, slows down as it grows,
  // drains 1 shield + 25% ammo on ship contact, scaling rewards on destruction!
  // ══════════════════════════════════════════════════════════════════════════
  const _voidbloom3DSprite = new Image();
  let _voidbloom3DLoaded = false;
  _voidbloom3DSprite.onload = () => { _voidbloom3DLoaded = true; };
  _voidbloom3DSprite.src = 'assets/voidbloom-3d.png?v=arcade388_voidbloom3d';

  const VoidbloomEngine = {
    nodes: [],
    telegraphs: [],
    nextSpawnInMs: CONFIG.voidbloom.firstSpawnSec * 1000,
    _auraSprite: null,
    particlePool: Array.from({ length: CONFIG.voidbloom.particlePoolSize }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, r: 3, color: '#a3e635', life: 0, maxLife: 24
    })),

    _getAuraSprite() {
      if (this._auraSprite) return this._auraSprite;
      const sz = 128;
      const c = document.createElement('canvas');
      c.width = sz;
      c.height = sz;
      const gctx = c.getContext('2d');
      if (gctx) {
        const half = sz * 0.5;
        const g = gctx.createRadialGradient(half, half, 4, half, half, half);
        g.addColorStop(0.0, 'rgba(147, 51, 234, 0.78)');
        g.addColorStop(0.38, 'rgba(132, 204, 22, 0.54)');
        g.addColorStop(0.70, 'rgba(163, 230, 53, 0.18)');
        g.addColorStop(1.0, 'rgba(16, 185, 129, 0)');
        gctx.fillStyle = g;
        gctx.fillRect(0, 0, sz, sz);
      }
      this._auraSprite = c;
      return c;
    },

    reset() {
      this.nodes = [];
      this.telegraphs = [];
      this.nextSpawnInMs = CONFIG.voidbloom.firstSpawnSec * 1000;
      for (let i = 0; i < this.particlePool.length; i++) {
        this.particlePool[i].active = false;
      }
    },

    _emitParticles(x, y, color, count, spdMax = 5.5) {
      let emitted = 0;
      for (let i = 0; i < this.particlePool.length && emitted < count; i++) {
        const pt = this.particlePool[i];
        if (!pt.active) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 1.0 + Math.random() * spdMax;
          pt.active = true;
          pt.x = x;
          pt.y = y;
          pt.vx = Math.cos(ang) * spd;
          pt.vy = Math.sin(ang) * spd;
          pt.r = 2.2 + Math.random() * 3.4;
          pt.color = color;
          pt.life = 0;
          pt.maxLife = 18 + Math.floor(Math.random() * 18);
          emitted++;
        }
      }
    },

    _pickSafeX(w, shipX) {
      const pad = Math.max(70, w * 0.14);
      let bestX = w * 0.5;
      let bestDist = -1;
      for (let att = 0; att < 14; att++) {
        const cand = pad + Math.random() * Math.max(40, w - pad * 2);
        const dist = Math.abs(cand - shipX);
        if (dist >= 145) return cand;
        if (dist > bestDist) { bestDist = dist; bestX = cand; }
      }
      return bestX;
    },

    scheduleTelegraph(w, h, shipX, now, forcedX = null) {
      const tx = forcedX !== null ? forcedX : this._pickSafeX(w, shipX);
      const spawnY = Math.max(142, Math.min(176, h * 0.20));
      this.telegraphs.push({
        x: tx,
        y: spawnY,
        startAt: now,
        spawnAt: now + CONFIG.voidbloom.telegraphMs
      });
      audio.playVoidbloomWarning();
    },

    spawnDirect(x, y, initialScale = 1.0, w = 800, h = 600) {
      const cfg = CONFIG.voidbloom;
      const sc = Math.max(cfg.minScale, Math.min(cfg.maxScale, initialScale));
      const growT = (sc - cfg.minScale) / Math.max(0.01, cfg.maxScale - cfg.minScale);
      const maxR = Math.min(w, h) * cfg.maxViewportFrac;
      const r = Math.min(maxR, cfg.baseRadius * sc);
      const hp = Math.round(cfg.baseHp + (cfg.maxHp - cfg.baseHp) * growT);
      const node = {
        active: true,
        x, y,
        scale: sc,
        radius: r,
        hp,
        maxHp: hp,
        ageSec: growT * cfg.growDurationSec,
        rot: Math.random() * Math.PI * 2,
        hitFlashUntil: 0,
        sporeAccum: 0
      };
      this.nodes.push(node);
      this._emitParticles(x, y, '#a3e635', 10, 3.8);
      return node;
    },

    destroyNode(vb, now, source = 'shot') {
      if (!vb || !vb.active) return;
      vb.active = false;
      const cfg = CONFIG.voidbloom;
      const sizeT = Math.max(0, Math.min(1, (vb.scale - cfg.minScale) / Math.max(0.01, cfg.maxScale - cfg.minScale)));
      const scoreGain = Math.round(cfg.smallRewardScore + (cfg.hugeRewardScore - cfg.smallRewardScore) * sizeT);
      const ammoGain = Math.round(cfg.smallRewardAmmo + (cfg.hugeRewardAmmo - cfg.smallRewardAmmo) * sizeT);

      state.score += scoreGain;
      RoundBossEngine.addAmmo(ammoGain);
      if (sizeT >= 0.5) {
        state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 18);
        if (state.pulseMeter >= 100) state.isPulseReady = true;
      }
      SkillSystem.onEnemyDestroyed();
      audio.playVoidbloomDestroy(vb.scale);
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, sizeT >= 0.5 ? 14 : 6);

      this._emitParticles(vb.x, vb.y, '#a3e635', 14, 6.5);
      this._emitParticles(vb.x, vb.y, '#a855f7', 10, 5.5);
      this._emitParticles(vb.x, vb.y, '#fde047', sizeT >= 0.5 ? 10 : 5, 7.2);
      updateHeaderUI();
    },

    // === CHANGED (v389): Caldera Nova destroys EVERY live Voidbloom Node AND collapses ALL incoming Voidbloom Rifts! ===
    destroyAllByNova(now) {
      let count = 0;
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        if (this.nodes[i].active) {
          this.destroyNode(this.nodes[i], now, 'nova');
          count++;
        }
      }
      this.nodes = this.nodes.filter(n => n.active);

      let riftCount = 0;
      for (let t = this.telegraphs.length - 1; t >= 0; t--) {
        const tg = this.telegraphs[t];
        this._emitParticles(tg.x, tg.y, '#a3e635', 12, 5.8);
        this._emitParticles(tg.x, tg.y, '#fde047', 8, 6.4);
        state.score += 250;
        RoundBossEngine.addAmmo(6);
        SkillSystem.onEnemyDestroyed();
        riftCount++;
      }
      this.telegraphs = [];
      return { nodes: count, rifts: riftCount };
    },

    hitByShot(sx, sy, dmg, now, source = 'shot') {
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const vb = this.nodes[i];
        if (!vb.active) continue;
        if (Math.hypot(sx - vb.x, sy - vb.y) <= vb.radius + 12) {
          vb.hp -= dmg;
          vb.hitFlashUntil = now + 75;
          this._emitParticles(sx, sy, '#a3e635', 4, 3.6);
          if (vb.hp <= 0) {
            this.destroyNode(vb, now, source);
            this.nodes.splice(i, 1);
          } else {
            audio.playBossHit(false);
          }
          return true;
        }
      }
      return false;
    },

    _onShipContact(vb, cx, cy, now) {
      vb.active = false;
      this._emitParticles(vb.x, vb.y, '#9333ea', 18, 6.2);
      this._emitParticles(vb.x, vb.y, '#84cc16', 14, 5.4);

      // Respect Aegis Forcefield Shield Buff & Invulnerability (e.g. Caldera Nova 1.5s invuln)
      if (state.hasBuff('shield', now) || (state.playerInvulnUntil && now < state.playerInvulnUntil)) {
        state.score += 200;
        const cAng = Math.atan2(vb.y - cy, vb.x - cx);
        CoreKinematics.triggerShieldDeflect(vb.x, vb.y, now, state.catcherType || 'dynamo', cAng);
        audio.playPerfectCatch(state.combo);
        return;
      }

      state.playerInvulnUntil = now + 1350;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, 18);

      // Deduct 1 Shield + drain configurable % of current ammo (never below 0!)
      const curAmmo = Number.isFinite(state.coreAmmo) ? Math.max(0, Math.floor(state.coreAmmo)) : 0;
      const drained = Math.floor(curAmmo * CONFIG.voidbloom.ammoDrainPct);
      state.coreAmmo = Math.max(0, curAmmo - drained);

      if (state.coreTier > 1) {
        state.coreTier--;
        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 6) {
          state.tier6HatchLock = false;
          if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
        }
      } else {
        state.coreTier = 1;
        state.combo = 0;
        state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playVoidbloomDrain();
      renderReflexShields();
      updateHeaderUI();

      if (state.reflexLives <= 0) {
        const gameNames = { dynamo: 'CHROME DYNAMO', realm: 'CHROME DYNAMO', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
        handleGameOver('SHIELDS DEPLETED', `${gameNames[state.gameType]} was consumed by a ${CONFIG.names.voidbloom} in Round ${state.currentRound}. Final Score: ${state.score.toLocaleString()} points.`);
      }
    },

    tick(dt, ctx, cx, cy, u, dtScale, now, w, h) {
      const cfg = CONFIG.voidbloom;

      // 1. Periodic Telegraphed Spawner (respects maxAlive, pauses while Caldera Nova is erupting)
      if ((state.roundPhase === 'gauntlet' || state.roundPhase === 'boss') && !SkillSystem.activeNova) {
        const totalAlive = this.nodes.length + this.telegraphs.length;
        if (totalAlive < cfg.maxAlive) {
          this.nextSpawnInMs -= dt;
          if (this.nextSpawnInMs <= 0) {
            this.nextSpawnInMs = cfg.spawnIntervalMs;
            this.scheduleTelegraph(w, h, cx, now);
          }
        }
      }

      // 2. Render & Promote 1.0s Spawn Telegraphs
      for (let i = this.telegraphs.length - 1; i >= 0; i--) {
        const tg = this.telegraphs[i];
        if (now >= tg.spawnAt) {
          this.spawnDirect(tg.x, tg.y, cfg.minScale, w, h);
          this.telegraphs.splice(i, 1);
          continue;
        }
        const prog = Math.min(1, (now - tg.startAt) / cfg.telegraphMs);
        const pulse = 0.58 + 0.42 * Math.sin(now * 0.025);
        const auraSpr = this._getAuraSprite();

        // === CHANGED (v388): 3D Holographic Vortex Portal Spawn Telegraph ===
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        // Volumetric toxic-violet vertical tether beam
        const beamG = ctx.createLinearGradient(tg.x, tg.y - 36, tg.x, Math.min(h - 90, tg.y + 165));
        beamG.addColorStop(0.0, `rgba(163, 230, 53, ${0.42 * pulse})`);
        beamG.addColorStop(0.5, `rgba(147, 51, 234, ${0.26 * pulse})`);
        beamG.addColorStop(1.0, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = beamG;
        ctx.fillRect(tg.x - 4, tg.y - 36, 8, Math.min(200, h - tg.y));

        // Central glowing portal orb
        const pGlowR = 44 * (0.65 + prog * 0.55);
        ctx.globalAlpha = 0.72 * pulse;
        ctx.drawImage(auraSpr, tg.x - pGlowR, tg.y - pGlowR, pGlowR * 2, pGlowR * 2);

        // Foreshortened spinning 3D perspective portal ring
        ctx.save();
        ctx.translate(tg.x, tg.y);
        ctx.rotate(Math.sin(now * 0.004) * 0.28);
        ctx.scale(1, 0.36);
        const r = 40 - prog * 14;
        ctx.globalAlpha = 0.92 * pulse;
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.68, now * 0.01, now * 0.01 + Math.PI * 1.4);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      }

      // 3. Update & Draw Active 3D Voidbloom Nodes (Continuous 1x -> 6x Growth, Slowing Drift, Scaling HP & Radius!)
      const maxR = Math.min(w, h) * cfg.maxViewportFrac;
      const shipHitR = 40 * u;
      const auraSpr = this._getAuraSprite();

      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const vb = this.nodes[i];
        if (!vb.active) { this.nodes.splice(i, 1); continue; }

        const prevMaxHp = vb.maxHp;
        vb.ageSec += dt / 1000;
        const growT = Math.min(1, vb.ageSec / cfg.growDurationSec);
        vb.scale = cfg.minScale + (cfg.maxScale - cfg.minScale) * growT;
        vb.radius = Math.min(maxR, cfg.baseRadius * vb.scale);

        // Scale HP smoothly with growth (preserves damage already dealt!)
        const nextMaxHp = Math.round(cfg.baseHp + (cfg.maxHp - cfg.baseHp) * growT);
        if (nextMaxHp > prevMaxHp) {
          vb.hp += (nextMaxHp - prevMaxHp);
          vb.maxHp = nextMaxHp;
        }

        // Slow downward drift as it grows huge
        const speedMult = 1.0 - (1.0 - cfg.minSpeedMult) * growT;
        vb.y += cfg.baseSpeed * speedMult * dtScale;
        vb.rot += (0.014 + 0.010 * (1 - growT)) * dtScale;

        // Ambient pooled toxic spore emission
        vb.sporeAccum += dt;
        if (vb.sporeAccum >= (growT > 0.5 ? 105 : 200)) {
          vb.sporeAccum = 0;
          const a = Math.random() * Math.PI * 2;
          this._emitParticles(vb.x + Math.cos(a) * vb.radius * 0.92, vb.y + Math.sin(a) * vb.radius * 0.92, Math.random() < 0.55 ? '#84cc16' : '#a855f7', 1, 1.5);
        }

        // Despawn safely past bottom
        if (vb.y - vb.radius > h + 40) {
          vb.active = false;
          this.nodes.splice(i, 1);
          continue;
        }

        // Ship / Outer Armored Shield Perimeter Collision Check
        const vbShieldDefR = state.hasBuff('shield', now)
          ? Math.max(shipHitR, CoreKinematics.getShieldOuterRadius(u, state.coreTier) * 0.96)
          : shipHitR;
        if (Math.hypot(vb.x - cx, vb.y - cy) < vb.radius * 0.86 + vbShieldDefR) {
          this._onShipContact(vb, cx, cy, now);
          this.nodes.splice(i, 1);
          continue;
        }

        // === CHANGED (v388): TRUE 6-LAYER VOLUMETRIC 3D VOIDBLOOM RENDERING (ZERO 2D FLAT LOOK!) ===
        const r = vb.radius;
        const pulse = 0.82 + 0.18 * Math.sin(now * 0.009 + i * 1.7);
        const breathe = 1.0 + 0.028 * Math.sin(now * 0.0065 + i);
        const isFlashing = vb.hitFlashUntil && now < vb.hitFlashUntil;
        const ringTilt = -0.36 + Math.sin(now * 0.0014 + i) * 0.14;
        const orbitR = r * 1.26;
        const orbitAngle = now * 0.0028 + i * 2.1;

        ctx.save();
        ctx.translate(vb.x, vb.y);

        // LAYER 1: Pre-baked Volumetric Toxic-Emerald & Ultraviolet Subsurface Halo
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const auraR = r * (1.58 + growT * 0.28) * breathe;
        ctx.globalAlpha = Math.min(0.95, (0.52 + growT * 0.34) * pulse);
        ctx.drawImage(auraSpr, -auraR, -auraR, auraR * 2, auraR * 2);
        ctx.restore();

        // LAYER 2: Back Half of 3D Perspective Orbital Containment Ring (passes BEHIND the 3D sphere!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(ringTilt);
        ctx.scale(1, 0.34);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.42 + growT * 0.24})`;
        ctx.lineWidth = Math.max(2.2, r * 0.075);
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // LAYER 3: Sculpted Photorealistic 3D Voidbloom Core Sprite (assets/voidbloom-3d.png)
        const drawR = r * 1.18 * breathe;
        ctx.save();
        ctx.rotate(vb.rot);
        if (_voidbloom3DLoaded) {
          ctx.drawImage(_voidbloom3DSprite, -drawR, -drawR, drawR * 2, drawR * 2);
        } else {
          // Graceful 3D shaded fallback only while PNG is still loading on frame 1
          const fg = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.08, 0, 0, r);
          fg.addColorStop(0.0, '#7e22ce');
          fg.addColorStop(0.55, '#1e0936');
          fg.addColorStop(1.0, '#07020f');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // Crisp impact flash when struck by Ember Cannon or Seeker Comets
        if (isFlashing) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.55;
          ctx.drawImage(auraSpr, -drawR * 0.9, -drawR * 0.9, drawR * 1.8, drawR * 1.8);
        }
        ctx.restore();

        // LAYER 4: Live Counter-Rotating Abyssal Singularity Eye Shimmer (gives the 3D center live depth!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(-vb.rot * 1.6);
        const eyeR = r * 0.30 * pulse;
        ctx.strokeStyle = `rgba(192, 132, 252, ${0.45 * pulse})`;
        ctx.lineWidth = Math.max(1.2, r * 0.032);
        ctx.beginPath();
        ctx.arc(0, 0, eyeR, 0, Math.PI * 1.25);
        ctx.stroke();
        ctx.strokeStyle = `rgba(163, 230, 53, ${0.38 * pulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, eyeR * 0.62, Math.PI, Math.PI * 2.15);
        ctx.stroke();
        ctx.restore();

        // LAYER 5: Front Half of 3D Perspective Orbital Ring + Glowing Plasma Satellites (passes IN FRONT of sphere!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(ringTilt);
        ctx.save();
        ctx.scale(1, 0.34);
        ctx.strokeStyle = `rgba(163, 230, 53, ${0.58 + growT * 0.28})`;
        ctx.lineWidth = Math.max(2.4, r * 0.08);
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, 0, Math.PI);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(236, 252, 203, 0.65)';
        ctx.lineWidth = Math.max(1.0, r * 0.028);
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, 0.15, Math.PI - 0.15);
        ctx.stroke();
        ctx.restore();

        // Two glowing 3D orbiting emerald/violet plasma moons on the tilted plane
        for (let k = 0; k < 2; k++) {
          const a = orbitAngle + k * Math.PI;
          const ox = Math.cos(a) * orbitR;
          const oy = Math.sin(a) * orbitR * 0.34;
          const inFront = Math.sin(a) >= 0;
          if (inFront) {
            const mR = Math.max(3.2, r * 0.095);
            ctx.fillStyle = k === 0 ? '#bef264' : '#d8b4fe';
            ctx.beginPath();
            ctx.arc(ox, oy, mR, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ox, oy, mR * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        // LAYER 6: Sleek Floating 3D Glassmorphic HP Arc (shown when damaged or >= 1.8x size; zero ugly flat triangle!)
        if (vb.hp < vb.maxHp || vb.scale >= 1.8) {
          const hpFrac = Math.max(0, Math.min(1, vb.hp / Math.max(1, vb.maxHp)));
          const ringR = r * 1.16 + 6;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(6, 10, 22, 0.72)';
          ctx.lineWidth = 4.2;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, -Math.PI * 0.75, -Math.PI * 0.25);
          ctx.stroke();
          ctx.strokeStyle = hpFrac > 0.45 ? '#a3e635' : '#f43f5e';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, -Math.PI * 0.75, -Math.PI * 0.75 + (Math.PI * 0.5) * hpFrac);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 4. Update & Draw Pooled Voidbloom Spores / Destruction Shards
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.particlePool.length; i++) {
        const pt = this.particlePool[i];
        if (!pt.active) continue;
        pt.life += dtScale;
        if (pt.life >= pt.maxLife) { pt.active = false; continue; }
        pt.x += pt.vx * dtScale;
        pt.y += pt.vy * dtScale;
        pt.vx *= 0.96;
        pt.vy *= 0.96;
        ctx.globalAlpha = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ROUND PROGRESSION, 5 SOVEREIGN BOSSES & CHROME CORE OFFENSE ENGINE (v386)
  // Extended 3-Act Wave Gauntlets · Dual-Gated Boss Arrival · Multi-Phase Boss AI
  // ══════════════════════════════════════════════════════════════════════════
  const ROUND_BOSS_SPECS = {
    1: {
      bossId: 1,
      quota: 48,
      minDurationSec: 45,
      baseHp: 50,
      drawW: 266,
      hitR: 74,
      pylonCount: 0,
      subtitle: 'AEGIS ORBITAL SENTINEL · ROUND 1 BOSS',
      names: { dynamo: 'VOLTAIC WARDEN', helix: 'RIBOSOME GUARDIAN', meteor: 'OBSIDIAN BASALT TITAN' },
      accent: '#f43f5e'
    },
    2: {
      bossId: 2,
      quota: 60,
      minDurationSec: 55,
      baseHp: 85,
      drawW: 248,
      hitR: 76,
      pylonCount: 0,
      subtitle: 'CORRUPTOR PRISM SOVEREIGN · ROUND 2 BOSS',
      names: { dynamo: 'TESLA ANNIHILATOR', helix: 'MUTAGEN HYDRA', meteor: 'MAGMA RAIL-CARRIER' },
      accent: '#e879f9'
    },
    3: {
      bossId: 3,
      quota: 72,
      minDurationSec: 65,
      baseHp: 125,
      drawW: 242,
      hitR: 80,
      pylonCount: 2,
      subtitle: 'SINGULARITY LEVIATHAN · ROUND 3 BOSS',
      names: { dynamo: 'MAGNETAR VORTEX', helix: 'CHIRAL ABYSSAL COIL', meteor: 'ACCRETION DEVOURER' },
      accent: '#fb923c'
    },
    4: {
      bossId: 4,
      quota: 84,
      minDurationSec: 75,
      baseHp: 175,
      drawW: 274,
      hitR: 78,
      pylonCount: 2,
      subtitle: 'TEMPEST ARCH-HYDRA · ROUND 4 BOSS',
      names: { dynamo: 'ARCVOLT EMPEROR', helix: 'PRION SERAPH', meteor: 'HYPERNOVA COLOSSUS' },
      accent: '#f97316'
    },
    5: {
      bossId: 5,
      quota: 96,
      minDurationSec: 85,
      baseHp: 240,
      drawW: 316,
      hitR: 86,
      pylonCount: 3,
      subtitle: 'OMEGA ANTICORE · FALLEN CHROME ARCHON',
      names: { dynamo: 'ANTIMATTER SERAPH · OMEGA', helix: 'ENTROPY ARCHON · OMEGA', meteor: 'ECLIPSE MAGNETAR · OMEGA' },
      accent: '#fbbf24'
    }
  };

  const RoundBossEngine = {
    getSpec(roundNum, mode) {
      const r = Math.max(1, roundNum | 0);
      const base = ROUND_BOSS_SPECS[Math.min(5, r)] || ROUND_BOSS_SPECS[5];
      const extraRounds = Math.max(0, r - 5);
      const mKey = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
      return {
        round: r,
        bossId: base.bossId,
        quota: base.quota + extraRounds * 12,
        minDurationSec: base.minDurationSec + Math.min(35, extraRounds * 8),
        maxHp: base.baseHp + extraRounds * 70,
        drawW: base.drawW,
        hitR: base.hitR,
        pylonCount: base.pylonCount,
        name: extraRounds > 0 ? `${base.names[mKey]} MK.${extraRounds + 1}` : base.names[mKey],
        subtitle: extraRounds > 0 ? `ENDLESS APEX SOVEREIGN · ROUND ${r} BOSS` : base.subtitle,
        accent: base.accent
      };
    },

    reset(now) {
      state.currentRound = 1;
      state.roundPhase = 'gauntlet'; // 'gauntlet' | 'warning' | 'boss' | 'cleared'
      state.roundNodesCaught = 0;
      const spec = this.getSpec(1, state.catcherType);
      state.roundQuota = spec.quota;
      state.roundGauntletMs = 0;
      state.roundMinDurationMs = spec.minDurationSec * 1000;
      state.roundSubWave = 1; // 1 = Vanguard (0-33%), 2 = Surge (33-66%), 3 = Apex Assault (66-100%)
      state.roundOverchargeBonusCount = 0;
      state.coreAmmo = 12; // Starter tactical reserve
      // === CHANGED (v387): STEP 5 — Unlimited ammo collection (no 150 cap!) ===
      state.maxCoreAmmo = Infinity;
      state.globalScreenShake = 0;
      state.maxComboReached = 1;
      state.maxTierReached = 1;
      state.bossesDefeated = 0;
      state.nodesCaughtTotal = 0;
      state.offenseMode = false;
      state.pointerFiring = false;
      state.touchFireHeld = false;
      state.gunDeployT = 0;
      state.tier6Skill2CastUntil = 0;
      TouchFireControls.releaseAllPointers();
      TouchFireControls.clearHeldKeys();
      SkillSystem.reset();
      VoidbloomEngine.reset();
      state.lastShotTime = 0;
      state.shotCounter = 0;
      state.muzzleFlashUntil = 0;
      state.playerInvulnUntil = 0;
      state.boss = null;
      state.bossBullets = [];
      state.bossBeams = [];
      state.bossShockRings = [];
      state.playerShots = [];
      state.bossHitSparks = [];
      state.roundBanner = {
        title: 'ROUND 1 · WAVE 1/3',
        sub: `${spec.quota} Nodes to Boss (${spec.maxHp} HP)`,
        color: '#38bdf8',
        startTime: now || performance.now(),
        duration: 1500
      };
    },

    toggleOffense(now) {
      // Guns are strictly manual hold-to-fire across desktop & touch; sticky auto-toggle disabled.
      state.offenseMode = false;
      updateHeaderUI();
    },

    // === CHANGED (v387): STEP 5 — Unlimited ammo accumulation (no 150 cap, safe integer handling) ===
    addAmmo(amount) {
      const add = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
      const cur = Number.isFinite(state.coreAmmo) ? Math.max(0, Math.floor(state.coreAmmo)) : 0;
      state.coreAmmo = Math.min(Number.MAX_SAFE_INTEGER, cur + add);
    },

    onGoodNodeCaught(nodeClass, isPerfect, now, w) {
      const isPowered = (nodeClass && nodeClass !== 'standard');
      const gain = isPowered ? 6 : (isPerfect ? 4 : 3);
      this.addAmmo(gain);
      state.nodesCaughtTotal = (state.nodesCaughtTotal || 0) + 1;
      state.maxComboReached = Math.max(state.maxComboReached || 1, state.combo || 1);
      state.maxTierReached = Math.max(state.maxTierReached || 1, state.coreTier || 1);

      if (state.roundPhase === 'gauntlet') {
        const wasQuotaMet = (state.roundNodesCaught || 0) >= (state.roundQuota || 48);
        state.roundNodesCaught = (state.roundNodesCaught || 0) + 1;

        // If player cleared node quota ahead of the Boss approach timer, reward OVERCHARGE bonus quietly (no stacking text!)
        if (wasQuotaMet && (state.roundGauntletMs || 0) < (state.roundMinDurationMs || 45000)) {
          state.roundOverchargeBonusCount = (state.roundOverchargeBonusCount || 0) + 1;
          state.score += 250;
          this.addAmmo(2);
          state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 5);
          if (state.pulseMeter >= 100) state.isPulseReady = true;
        }

        // Check sub-wave milestone & dual-gated Boss unlock
        this.tickGauntletPacing(0, now, w);
      }
    },

    tickGauntletPacing(dtMs, now, w) {
      if (state.roundPhase !== 'gauntlet') return;
      if (dtMs > 0) {
        state.roundGauntletMs = (state.roundGauntletMs || 0) + dtMs;
      }
      const quota = Math.max(1, state.roundQuota || 48);
      const minDur = Math.max(1, state.roundMinDurationMs || 45000);
      const quotaPct = Math.min(1, (state.roundNodesCaught || 0) / quota);
      const timePct = Math.min(1, (state.roundGauntletMs || 0) / minDur);
      const effectivePct = Math.min(quotaPct, timePct);
      const rnd = state.currentRound || 1;

      // 3-Act Sub-Wave Escalation (Wave 1 Vanguard -> Wave 2 Surge -> Wave 3 Apex Assault)
      if ((state.roundSubWave || 1) === 1 && effectivePct >= 0.333) {
        state.roundSubWave = 2;
        const wBonus = 500 * rnd;
        state.score += wBonus;
        this.addAmmo(6);
        audio.playPhaseSwitch();
        state.roundBanner = {
          title: `ROUND ${rnd} · WAVE 2/3 · SURGE`,
          sub: `+${wBonus.toLocaleString()} · +6 AMMO`,
          color: '#c084fc',
          startTime: now || performance.now(),
          duration: 1450
        };
        updateHeaderUI();
      } else if ((state.roundSubWave || 1) === 2 && effectivePct >= 0.667) {
        state.roundSubWave = 3;
        const wBonus = 800 * rnd;
        state.score += wBonus;
        this.addAmmo(8);
        audio.playPhaseSwitch();
        state.roundBanner = {
          title: `ROUND ${rnd} · WAVE 3/3 · APEX`,
          sub: `+${wBonus.toLocaleString()} · +8 AMMO`,
          color: '#fb923c',
          startTime: now || performance.now(),
          duration: 1450
        };
        updateHeaderUI();
      }

      // Dual-Gated Boss Arrival: Requires BOTH Good-Node Quota AND Minimum Gauntlet Time!
      if ((state.roundNodesCaught || 0) >= quota && (state.roundGauntletMs || 0) >= minDur) {
        this.startBossWarning(now, w);
      }
    },

    startBossWarning(now, w) {
      const spec = this.getSpec(state.currentRound, state.catcherType);
      state.roundPhase = 'warning';
      state.bossWarningUntil = now + 1800;
      state.roundBanner = {
        title: `ROUND ${spec.round} BOSS INCOMING`,
        sub: `${spec.name} · ${spec.maxHp} HP`,
        color: '#f43f5e',
        startTime: now,
        duration: 1700
      };
      audio.playBossWarningSiren();
      updateHeaderUI();
    },

    spawnBoss(roundNum, now, w, h, skipIntro = false) {
      const mode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
      const spec = this.getSpec(roundNum, mode);
      const isMob = w < 600;
      const scaleM = isMob ? 0.72 : 1.0;
      const targetY = Math.max(122, Math.min(195, h * 0.21));

      const boss = {
        round: spec.round,
        bossId: spec.bossId,
        name: spec.name,
        subtitle: spec.subtitle,
        accent: spec.accent,
        mode: mode,
        x: w * 0.5,
        prevX: w * 0.5,
        y: skipIntro ? targetY : -140,
        targetY: targetY,
        vx: 0,
        bankAngle: 0,
        drawW: spec.drawW * scaleM,
        hitR: spec.hitR * scaleM,
        hp: spec.maxHp,
        maxHp: spec.maxHp,
        phase: skipIntro ? 'fighting' : 'entering', // 'entering' | 'fighting' | 'defeated'
        enraged: false,
        finalEclipse: false,
        enterStart: now,
        hitFlashUntil: 0,
        armorBreakUntil: 0,
        recoilY: 0,
        movePhase: 0,
        nextAttackAt: now + (skipIntro ? 900 : 1900),
        nextSupplyAt: now + 2800,
        // === CHANGED (v389): Boss active Powered Bad Node production timer & wing-emitter flare ===
        nextHazardAt: now + (skipIntro ? 1800 : 3200),
        emitterFlashUntil: 0,
        emitterFlashX: 0,
        emitterSide: 1,
        bossHazardsDeployed: 0,
        spiralAngle: 0,
        attackStep: 0,
        dashState: null,
        pylons: [],
        pylonsSpawnedP2: false
      };

      // Round 3 starts with 2 Orbiting Shield Pylons immediately!
      if (spec.bossId === 3 && spec.pylonCount > 0) {
        this._spawnPylons(boss, spec.pylonCount, 12 + (spec.round - 3) * 3);
      }

      state.boss = boss;
      state.roundPhase = 'boss';
      state.bossBullets = [];
      state.bossBeams = [];
      state.bossShockRings = [];
      updateHeaderUI();
    },

    _spawnPylons(boss, count, hpEach) {
      boss.pylons = [];
      const orbitR = boss.hitR * 1.66;
      for (let i = 0; i < count; i++) {
        boss.pylons.push({
          angle: (i * Math.PI * 2) / count,
          orbitR: orbitR,
          x: boss.x + Math.cos((i * Math.PI * 2) / count) * orbitR,
          y: boss.y + Math.sin((i * Math.PI * 2) / count) * (orbitR * 0.65),
          hp: hpEach,
          maxHp: hpEach,
          hitFlashUntil: 0
        });
      }
    },

    _spawnHitSparks(x, y, color, count = 5) {
      if (!state.bossHitSparks) state.bossHitSparks = [];
      for (let i = 0; i < count; i++) {
        if (state.bossHitSparks.length >= 90) break;
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.2 + Math.random() * 5.2;
        state.bossHitSparks.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 2.5 + Math.random() * 3.0,
          color: color,
          life: 0,
          maxLife: 16 + Math.floor(Math.random() * 12)
        });
      }
    },

    damagePylon(pyl, dmg, now, hx, hy) {
      if (!pyl || pyl.hp <= 0) return;
      pyl.hp -= dmg;
      pyl.hitFlashUntil = now + 70;
      this._spawnHitSparks(hx || pyl.x, hy || pyl.y, '#38bdf8', 5);
      audio.playBossHit(false);
      if (pyl.hp <= 0) {
        pyl.hp = 0;
        state.score += 800;
        this.addAmmo(8);
        if (state.boss) {
          state.boss.armorBreakUntil = now + 2600;
        }
        this._spawnHitSparks(pyl.x, pyl.y, '#fbbf24', 14);
        audio.playArmorBreak();
        updateHeaderUI();
      }
    },

    damageBoss(rawDmg, now, isSpecial = false, hx = null, hy = null, exactDamage = false) {
      const boss = state.boss;
      if (!boss || boss.phase !== 'fighting') return;

      const isArmorBroken = (boss.armorBreakUntil && now < boss.armorBreakUntil);
      const tierCritChance = (state.coreTier >= 5) ? 0.30 : (state.coreTier === 4 ? 0.20 : 0.06);
      const isCrit = exactDamage ? false : (isSpecial || isArmorBroken || (Math.random() < tierCritChance));
      // === CHANGED (v389): Caldera Nova (exactDamage = true) deals exact certain capped damage (no crit/armor-break inflation!) ===
      const finalDmg = exactDamage
        ? rawDmg
        : rawDmg * (isArmorBroken ? 1.5 : (isCrit && !isSpecial ? 1.5 : 1.0));
      boss.hp = Math.max(0, boss.hp - finalDmg);
      boss.hitFlashUntil = now + (exactDamage ? 180 : 68);
      boss.recoilY = Math.max(-12, boss.recoilY - (exactDamage ? 7.5 : 3.8));

      const hitX = hx !== null ? hx : boss.x;
      const hitY = hy !== null ? hy : boss.y;
      this._spawnHitSparks(hitX, hitY, (exactDamage || isCrit) ? '#fde047' : '#38bdf8', exactDamage ? 12 : (isCrit ? 5 : 3));
      audio.playBossHit(exactDamage || isCrit);

      // Award crisp score tick per hit
      state.score += Math.round(finalDmg * 45);

      // Check Phase 2 Enrage (<50% HP) & Phase 3 Final Eclipse (<33% HP on Round 5+)
      const hpRatio = boss.hp / boss.maxHp;
      if (!boss.enraged && hpRatio <= 0.50 && boss.hp > 0) {
        boss.enraged = true;
        boss.hitFlashUntil = now + 220;
        audio.playHyperCometRoar();
        if ((boss.bossId === 4 || boss.bossId === 5) && !boss.pylonsSpawnedP2) {
          boss.pylonsSpawnedP2 = true;
          this._spawnPylons(boss, boss.bossId === 5 ? 3 : 2, 14 + (boss.round - 4) * 3);
        }
      }
      if (boss.bossId === 5 && !boss.finalEclipse && hpRatio <= 0.33 && boss.hp > 0) {
        boss.finalEclipse = true;
        audio.playTier5Ascension();
      }

      // Check Boss Defeat!
      if (boss.hp <= 0) {
        this.defeatBoss(now);
      }
    },

    defeatBoss(now) {
      const boss = state.boss;
      if (!boss || boss.phase === 'defeated') return;
      boss.phase = 'defeated';
      boss.defeatedAt = now;
      state.bossBullets = [];
      state.bossBeams = [];
      state.bossShockRings = [];

      const roundBonus = 5000 * boss.round;
      state.score += roundBonus;
      state.bossesDefeated = (state.bossesDefeated || 0) + 1;
      const prevLives = state.reflexLives;
      state.reflexLives = Math.min(3, state.reflexLives + 1);
      renderReflexShields();
      state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 25);
      if (state.pulseMeter >= 100) state.isPulseReady = true;
      this.addAmmo(15);

      // Massive Supernova Shatter Burst (36 Shards)
      if (!state.vaporizedShards) state.vaporizedShards = [];
      for (let i = 0; i < 36; i++) {
        const ang = (i / 36) * Math.PI * 2 + Math.random() * 0.2;
        const spd = 4.5 + Math.random() * 10.5;
        state.vaporizedShards.push({
          x: boss.x, y: boss.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 3.5 + Math.random() * 4.5,
          color: (i % 3 === 0) ? '#fde047' : (i % 3 === 1 ? '#f43f5e' : '#38bdf8'),
          life: 0,
          maxLife: 34 + Math.floor(Math.random() * 20)
        });
      }
      state.bossShockRings.push({ x: boss.x, y: boss.y, r: 16, maxR: 340, alpha: 1.0, color: '#fde047', harmless: true });
      state.bossShockRings.push({ x: boss.x, y: boss.y, r: 8, maxR: 250, alpha: 0.9, color: '#38bdf8', harmless: true });

      audio.playBossDefeated();
      state.roundPhase = 'cleared';
      state.nextRoundAt = now + 2700;
      const lifeTxt = state.reflexLives > prevLives ? ' · +1 SHIELD' : '';
      state.roundBanner = {
        title: `⭐ ROUND ${boss.round} CLEARED!`,
        sub: `+${roundBonus.toLocaleString()} BONUS${lifeTxt} · +15 AMMO → ADVANCING TO ROUND ${boss.round + 1}`,
        color: '#34d399',
        startTime: now,
        duration: 2700
      };
      updateHeaderUI();
    },

    // ─── CHROME CORE OFFENSE WEAPON: ADAPTABLE TIER I–V ARTILLERY CANNON ───
    updateAndDrawPlayerWeapon(ctx, cx, cy, u, dtScale, now, w, h) {
      const mode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
      // === CHANGED (v406): Guns STRICTLY active ONLY when pressing [A]/[F]/mouse/touch ===
      const isTouchMode = TouchFireControls.isTouch;
      const isGunTouchHeld = isTouchMode && TouchFireControls.isGunHeld();
      const isKeyAHeld = TouchFireControls.isDesktopKeyGunHeld();
      const isFiringActive = isTouchMode
        ? isGunTouchHeld
        : !!(state.pointerFiring || isKeyAHeld);

      // Flash red when holding gun at 0 ammo WITHOUT dropping the held touch pointer!
      if ((isGunTouchHeld || isKeyAHeld) && (state.coreAmmo || 0) <= 0) {
        TouchFireControls.flashEmpty();
      }

      const wantsFire = isFiringActive && (state.coreAmmo || 0) > 0 && state.roundPhase !== 'cleared';
      // Strictly hide weapons while idle (including 0-ammo dry holds); show ONLY while firing or casting!
      if (wantsFire) {
        state.gunDeployT = 1.0;
      } else {
        const retractStep = 0.35 * Math.max(0.5, Math.min(2.5, dtScale || 1));
        state.gunDeployT = Math.max(0, (state.gunDeployT || 0) - retractStep);
      }
      const tier = state.coreTier || 1;
      const cTier = (CoreKinematics && CoreKinematics.continuousTier !== undefined) ? CoreKinematics.continuousTier : tier;
      const fireInterval = (isTouchMode || isKeyAHeld)
        ? FIRE_DELAY
        : ((tier >= 6) ? 82 : ((tier >= 5) ? 88 : (tier === 4 ? 98 : (tier >= 2 ? 108 : 122))));

      // Top bezel clearance radius per mode: Dynamo's jeweled crown reaches -85*u; Helix/Meteor spheres reach -68*u
      const coreCrownY = (mode === 'dynamo') ? (-86 * u) : (-69 * u);
      const wingMuzzleX = (tier === 2) ? (76 * u) : (tier === 3 ? (92 * u) : (tier === 4 ? (112 * u) : (126 * u)));
      const wingMuzzleY = -58 * u;

      if (wantsFire && (now - (state.lastShotTime || 0)) >= fireInterval) {
        state.lastShotTime = now;
        state.coreAmmo = Math.max(0, (Number.isFinite(state.coreAmmo) ? Math.floor(state.coreAmmo) : 0) - CONFIG.gun.ammoPerShot);
        state.shotCounter = (state.shotCounter || 0) + 1;
        state.muzzleFlashUntil = now + 65;
        audio.playCoreCannonShot(mode, tier);

        const muzzleY = cy + coreCrownY - 12 * u;
        const speed = (mode === 'dynamo') ? 21.5 : (mode === 'helix' ? 19.2 : 17.8);
        const pushShot = (ox, oy, vx, dmg, heavy, phaseOff = 0) => {
          if (state.playerShots.length >= 64) state.playerShots.shift();
          state.playerShots.push({
            x: cx + ox,
            y: cy + oy,
            vx: vx,
            vy: -speed,
            dmg: dmg,
            mode: mode,
            heavy: heavy,
            bornAt: now,
            phase: phaseOff + state.shotCounter * 0.7,
            isFifth: (state.shotCounter % 5 === 0)
          });
        };

        const centerTipOy = coreCrownY - 14 * u;
        const flankTipOy = wingMuzzleY - 12 * u;

        if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {
          const t6Bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
          const mzs = CoreGeometryDB.getTier6Muzzles(mode, u, cx, cy, t6Bank);
          const lx = mzs.left.x - cx;
          const ly = mzs.left.y - cy - 4 * u;
          const rx = mzs.right.x - cx;
          const ry = mzs.right.y - cy - 4 * u;
          pushShot(lx, ly, 0, 0.72, true, 0);
          pushShot(rx, ry, 0, 0.72, true, Math.PI);
          pushShot(lx - 10 * u, ly + 8 * u, -1.35, 0.34, false, 1.1);
          pushShot(rx + 10 * u, ry + 8 * u, 1.35, 0.34, false, 2.2);
        } else if (tier <= 1) {
          pushShot(0, centerTipOy, 0, 1.0, true, 0);
        } else if (tier <= 3) {
          pushShot(-wingMuzzleX, flankTipOy, 0, 0.58, true, 0);
          pushShot(wingMuzzleX, flankTipOy, 0, 0.58, true, Math.PI);
        } else if (tier === 4) {
          pushShot(0, centerTipOy, 0, 0.75, true, 0);
          pushShot(-wingMuzzleX, flankTipOy, -1.15, 0.32, false, 1.0);
          pushShot(wingMuzzleX, flankTipOy, 1.15, 0.32, false, 2.0);
        } else {
          pushShot(-16 * u, centerTipOy, 0, 0.56, true, 0);
          pushShot(16 * u, centerTipOy, 0, 0.56, true, Math.PI);
          pushShot(-wingMuzzleX, flankTipOy, -1.55, 0.26, false, 1.2);
          pushShot(wingMuzzleX, flankTipOy, 1.55, 0.26, false, 2.4);
        }
        // === CHANGED (v387): At 0 ammo, stop shots and flash button red (keep pointer tracked if still physically held!) ===
        if ((isTouchMode || isKeyAHeld) && state.coreAmmo <= 0) {
          TouchFireControls.flashEmpty();
        }
        updateHeaderUI();
      }

      // ─────────────────────────────────────────────────────────────────────────
      // ADAPTABLE TIER I–V CHROME CORE ARTILLERY TURRETS (Rendered IN FRONT of Core & Wings!)
      // STRICT USER RULE: The guns ONLY show when actively pressing the "A" or gun button (isFiringActive)!
      // They do NOT show when not firing.
      // ─────────────────────────────────────────────────────────────────────────
      const hasAmmo = (state.coreAmmo || 0) > 0;
      const gunT = state.gunDeployT || 0;
      const showTurrets = (tier >= 6) ? isFiringActive : (gunT > 0.02);
      if (showTurrets) {
        const arcR = ((mode === 'dynamo') ? 76 : 70) * u;
        const ammoFrac = Math.min(1, (state.coreAmmo || 0) / 150);
        const lowAmmo = (state.coreAmmo || 0) < 6;
        const gaugeCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fb923c' : (mode === 'helix' ? '#22d3ee' : '#38bdf8'));
        const isHot = isFiringActive || (state.muzzleFlashUntil && now < state.muzzleFlashUntil + 140);
        const mfActive = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT = mfActive ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0;
        const recoilY = (mfActive ? (mfT * 4.5 * u) : 0) + ((tier < 6) ? (1.0 - gunT) * 9 * u : 0);

        ctx.save();
        ctx.translate(cx, cy);
        if (tier < 6) ctx.globalAlpha = Math.min(1, gunT * 1.25);
        const bankAngle = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.45) : 0;
        ctx.rotate(bankAngle);

        // Lower Hemisphere Crisp Unblurred Ammo Track (STRICTLY only while pressing/using gun!)
        if (isFiringActive || (tier < 6 && gunT > 0.05)) {
          const startA = Math.PI * 0.24;
          const endA = Math.PI * 0.76;
          ctx.beginPath();
          ctx.arc(0, 0, arcR, startA, endA);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.24)';
          ctx.lineWidth = Math.max(1.8, 2.8 * u);
          ctx.lineCap = 'round';
          ctx.stroke();

          if (ammoFrac > 0.005) {
            ctx.beginPath();
            ctx.arc(0, 0, arcR, startA, startA + (endA - startA) * ammoFrac);
            ctx.strokeStyle = gaugeCol;
            ctx.lineWidth = Math.max(2.0, 3.2 * u);
            ctx.stroke();
          }
        }

        // Helper to draw a single material-authentic artillery barrel at (bx, by) with scale bScale
        const drawMaterialTurret = (bx, by, bScale, isCenterMount) => {
          ctx.save();
          ctx.translate(bx, by + recoilY);
          ctx.scale(bScale, bScale);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          if (mode === 'dynamo') {
            // DYNAMO TESLA RAILGUN: Brushed Gold Bezel Mount + Twin Converging Faraday Rails + Sapphire/Cyan Capacitor Core
            // 1. Dark bronze-gold armored housing base
            ctx.fillStyle = '#451a03';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = Math.max(1.2, 1.8 * u);
            ctx.beginPath();
            ctx.moveTo(-13 * u, 4 * u);
            ctx.lineTo(-9 * u, -10 * u);
            ctx.lineTo(9 * u, -10 * u);
            ctx.lineTo(13 * u, 4 * u);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 2. Twin converging high-voltage rail prongs
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = Math.max(2.6, 4.2 * u);
            ctx.beginPath();
            ctx.moveTo(-10 * u, -6 * u);
            ctx.lineTo(-7.5 * u, -28 * u);
            ctx.moveTo(10 * u, -6 * u);
            ctx.lineTo(7.5 * u, -28 * u);
            ctx.stroke();

            // Metallic gold specular ridge along each rail
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = Math.max(1.3, 2.0 * u);
            ctx.beginPath();
            ctx.moveTo(-10 * u, -6 * u);
            ctx.lineTo(-7.5 * u, -28 * u);
            ctx.moveTo(10 * u, -6 * u);
            ctx.lineTo(7.5 * u, -28 * u);
            ctx.stroke();

            // Inner cyan plasma conductor channel along rails
            ctx.strokeStyle = lowAmmo ? '#f43f5e' : '#38bdf8';
            ctx.lineWidth = Math.max(1.1, 1.5 * u);
            ctx.beginPath();
            ctx.moveTo(-7.2 * u, -8 * u);
            ctx.lineTo(-5.5 * u, -26 * u);
            ctx.moveTo(7.2 * u, -8 * u);
            ctx.lineTo(5.5 * u, -26 * u);
            ctx.stroke();

            // Capacitor tips
            ctx.fillStyle = lowAmmo ? '#f43f5e' : '#e0f2fe';
            ctx.beginPath();
            ctx.arc(-7.5 * u, -28 * u, 2.4 * u, 0, Math.PI * 2);
            ctx.arc(7.5 * u, -28 * u, 2.4 * u, 0, Math.PI * 2);
            ctx.fill();

            // Crisp live zig-zag arc between rail tips when active/loaded
            if (isHot || hasAmmo) {
              ctx.strokeStyle = lowAmmo ? 'rgba(244, 63, 94, 0.9)' : (isHot ? '#ffffff' : 'rgba(125, 211, 252, 0.85)');
              ctx.lineWidth = Math.max(1.1, (isHot ? 1.8 : 1.2) * u);
              ctx.beginPath();
              ctx.moveTo(-7.5 * u, -26 * u);
              for (let seg = 1; seg <= 3; seg++) {
                const frac = seg / 4;
                const ax = (-7.5 + 15 * frac) * u;
                const ay = -26 * u + Math.sin(now * 0.075 + seg * 2.7 + bx) * 3.5 * u;
                ctx.lineTo(ax, ay);
              }
              ctx.lineTo(7.5 * u, -26 * u);
              ctx.stroke();
            }

            // Sharp unblurred diamond shock-flash on shot
            if (mfActive) {
              const dr = 16 * u * (1.15 - mfT * 0.25);
              ctx.strokeStyle = `rgba(224, 242, 254, ${0.92 * mfT})`;
              ctx.lineWidth = Math.max(1.4, 2.0 * u);
              ctx.beginPath();
              ctx.moveTo(0, -28 * u - dr * 0.75);
              ctx.lineTo(dr, -28 * u);
              ctx.lineTo(0, -28 * u + dr * 0.75);
              ctx.lineTo(-dr, -28 * u);
              ctx.closePath();
              ctx.stroke();
            }

          } else if (mode === 'helix') {
            // HELIX CASTER: Stepped Silver-Chrome Prismatic Barrel + Rotating Hexagonal Crystal Emitter
            // 1. Stepped chrome collar mount
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = Math.max(1.2, 1.8 * u);
            ctx.beginPath();
            ctx.moveTo(-12 * u, 4 * u);
            ctx.lineTo(-8 * u, -12 * u);
            ctx.lineTo(8 * u, -12 * u);
            ctx.lineTo(12 * u, 4 * u);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 2. Twin silver-chrome prism guide fins
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = Math.max(2.0, 3.0 * u);
            ctx.beginPath();
            ctx.moveTo(-9 * u, -6 * u);
            ctx.lineTo(-6.5 * u, -25 * u);
            ctx.moveTo(9 * u, -6 * u);
            ctx.lineTo(6.5 * u, -25 * u);
            ctx.stroke();

            // Cyan & magenta chiral inner refractive edges
            ctx.strokeStyle = lowAmmo ? '#f43f5e' : '#22d3ee';
            ctx.lineWidth = Math.max(1.1, 1.5 * u);
            ctx.beginPath();
            ctx.moveTo(-6.8 * u, -8 * u);
            ctx.lineTo(-4.8 * u, -24 * u);
            ctx.stroke();

            ctx.strokeStyle = lowAmmo ? '#f43f5e' : '#ec4899';
            ctx.beginPath();
            ctx.moveTo(6.8 * u, -8 * u);
            ctx.lineTo(4.8 * u, -24 * u);
            ctx.stroke();

            // Central faceted hexagonal prism crystal at muzzle (-20*u)
            const hRot = now * (isHot ? 0.006 : 0.0025);
            const hexR = (isCenterMount ? 9.5 : 7.5) * u;
            ctx.save();
            ctx.translate(0, -21 * u);
            ctx.rotate(hRot);
            ctx.strokeStyle = lowAmmo ? 'rgba(244, 63, 94, 0.85)' : 'rgba(34, 211, 238, 0.94)';
            ctx.lineWidth = Math.max(1.3, 1.8 * u);
            ctx.beginPath();
            for (let hp = 0; hp <= 6; hp++) {
              const ha = (hp / 6) * Math.PI * 2;
              const hx = Math.cos(ha) * hexR;
              const hy = Math.sin(ha) * hexR * 0.65;
              if (hp === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
            }
            ctx.stroke();
            ctx.restore();

            // Crisp unblurred dual elliptical refraction ring on shot
            if (mfActive) {
              ctx.strokeStyle = `rgba(34, 211, 238, ${0.90 * mfT})`;
              ctx.lineWidth = Math.max(1.3, 1.9 * u);
              ctx.beginPath();
              ctx.ellipse(0, -26 * u, 16 * u * (1.2 - mfT * 0.25), 5.5 * u, 0, 0, Math.PI * 2);
              ctx.stroke();
            }

          } else {
            // === CHANGED (v396): METEOR EMBER CANNON — Forged Bronze-Gold Caldera Maw + Vented Cooling Ribs + Pressurized Magma Breach ===
            // 1. Dark basalt-bronze armored breach block with glowing thermal vent slits
            ctx.fillStyle = '#271206';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = Math.max(1.4, 2.0 * u);
            ctx.beginPath();
            ctx.moveTo(-14.5 * u, 5 * u);
            ctx.lineTo(-10.5 * u, -11 * u);
            ctx.lineTo(10.5 * u, -11 * u);
            ctx.lineTo(14.5 * u, 5 * u);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glowing lateral thermal cooling vents inside breach housing
            ctx.strokeStyle = lowAmmo ? '#f43f5e' : '#fb923c';
            ctx.lineWidth = Math.max(1.1, 1.5 * u);
            for (let vIdx = 0; vIdx < 2; vIdx++) {
              const vy = (-2 - vIdx * 3.8) * u;
              ctx.beginPath();
              ctx.moveTo(-10.5 * u, vy); ctx.lineTo(-5.5 * u, vy - 1.2 * u);
              ctx.moveTo(10.5 * u, vy);  ctx.lineTo(5.5 * u, vy - 1.2 * u);
              ctx.stroke();
            }

            // 2. Twin curved bronze-gold volcanic artillery tusks with inner magma conduits
            [-1, 1].forEach((side) => {
              ctx.strokeStyle = '#78350f';
              ctx.lineWidth = Math.max(3.0, 4.8 * u);
              ctx.beginPath();
              ctx.moveTo(side * 11.5 * u, -4 * u);
              ctx.quadraticCurveTo(side * 14 * u, -18 * u, side * 7.2 * u, -28 * u);
              ctx.stroke();

              ctx.strokeStyle = lowAmmo ? '#f43f5e' : '#fde047';
              ctx.lineWidth = Math.max(1.5, 2.3 * u);
              ctx.beginPath();
              ctx.moveTo(side * 11.5 * u, -4 * u);
              ctx.quadraticCurveTo(side * 14 * u, -18 * u, side * 7.2 * u, -28 * u);
              ctx.stroke();

              // Inner glowing magma acceleration rail
              ctx.strokeStyle = lowAmmo ? '#fda4af' : '#fb923c';
              ctx.lineWidth = Math.max(1.0, 1.4 * u);
              ctx.beginPath();
              ctx.moveTo(side * 8.5 * u, -7 * u);
              ctx.quadraticCurveTo(side * 10.2 * u, -17 * u, side * 5.2 * u, -26 * u);
              ctx.stroke();
            });

            // 3. Pressurized incandescent molten chamber core & plasma arc across the caldera jaws
            const pulseR = (5.4 + 0.7 * Math.sin(now * 0.025)) * u;
            ctx.fillStyle = lowAmmo ? '#f43f5e' : '#ea580c';
            ctx.beginPath();
            ctx.arc(0, -14.5 * u, pulseR, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = lowAmmo ? '#fecdd3' : '#fef08a';
            ctx.beginPath();
            ctx.arc(0, -14.5 * u, pulseR * 0.56, 0, Math.PI * 2);
            ctx.fill();

            if (isHot || hasAmmo) {
              ctx.strokeStyle = lowAmmo ? 'rgba(244, 63, 94, 0.9)' : 'rgba(254, 240, 138, 0.92)';
              ctx.lineWidth = Math.max(1.2, 1.7 * u);
              ctx.beginPath();
              ctx.moveTo(-6.8 * u, -26.5 * u);
              ctx.quadraticCurveTo(0, (-30.5 + Math.sin(now * 0.06) * 2.2) * u, 6.8 * u, -26.5 * u);
              ctx.stroke();
            }

            // 4. Crisp volcanic solar flare & compression ring on shot
            if (mfActive) {
              ctx.strokeStyle = `rgba(254, 240, 138, ${0.95 * mfT})`;
              ctx.lineWidth = Math.max(1.5, 2.3 * u);
              ctx.beginPath();
              ctx.ellipse(0, -28 * u, 17.5 * u * (1.22 - mfT * 0.25), 6.5 * u, 0, 0, Math.PI * 2);
              ctx.stroke();

              // Twin lateral volcanic vent flame jets
              ctx.fillStyle = `rgba(251, 146, 60, ${0.88 * mfT})`;
              [-1, 1].forEach((side) => {
                ctx.beginPath();
                ctx.moveTo(side * 9 * u, -24 * u);
                ctx.lineTo(side * (21 + mfT * 6) * u, -30 * u);
                ctx.lineTo(side * 7 * u, -28 * u);
                ctx.closePath();
                ctx.fill();
              });
            }
          }

          ctx.restore();
        };

        // Mount Configuration Adaptable to Tiers I through VI:
        // - Tier VI: Built-in Twin Shoulder Weapons remain completely unobstructed; brief localized muzzle flash at exact cannon tips!
        if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {
          if (mfActive) {
            const mzs = CoreGeometryDB.getTier6Muzzles(mode, u, 0, 0, 0);
            const flashCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fde047' : (mode === 'helix' ? '#67e8f9' : '#e0f2fe'));
            const ringCol = mode === 'meteor' ? `rgba(251, 146, 60, ${0.9 * mfT})` : (mode === 'helix' ? `rgba(244, 114, 182, ${0.9 * mfT})` : `rgba(56, 189, 248, ${0.9 * mfT})`);
            [mzs.left, mzs.right].forEach((mTip) => {
              ctx.save();
              ctx.translate(mTip.x, mTip.y);
              ctx.strokeStyle = ringCol;
              ctx.lineWidth = Math.max(1.5, 2.2 * u);
              ctx.beginPath();
              ctx.ellipse(0, -4 * u, 13 * u * (1.2 - mfT * 0.25), 5 * u, 0, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = flashCol;
              ctx.beginPath();
              ctx.moveTo(0, -16 * u);
              ctx.lineTo(4.5 * u, -2 * u);
              ctx.lineTo(0, 3 * u);
              ctx.lineTo(-4.5 * u, -2 * u);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            });
          }
        } else if (tier <= 1) {
          drawMaterialTurret(0, coreCrownY, 1.0, true);
        } else if (tier <= 3) {
          drawMaterialTurret(0, coreCrownY, 0.92, true);
          drawMaterialTurret(-wingMuzzleX, wingMuzzleY, 0.86, false);
          drawMaterialTurret(wingMuzzleX, wingMuzzleY, 0.86, false);
        } else if (tier === 4) {
          drawMaterialTurret(0, coreCrownY, 1.05, true);
          drawMaterialTurret(-wingMuzzleX, wingMuzzleY, 0.94, false);
          drawMaterialTurret(wingMuzzleX, wingMuzzleY, 0.94, false);
        } else {
          drawMaterialTurret(-15 * u, coreCrownY + 2 * u, 0.92, true);
          drawMaterialTurret(15 * u, coreCrownY + 2 * u, 0.92, true);
          drawMaterialTurret(-wingMuzzleX, wingMuzzleY, 0.98, false);
          drawMaterialTurret(wingMuzzleX, wingMuzzleY, 0.98, false);
        }

        ctx.restore();
      }

      // Update & Render All Player Accumulated-Node Bolts (Zero shadowBlur, Pure GPU Blits!)
      if (!state.playerShots || state.playerShots.length === 0) return;
      const boss = state.boss;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = state.playerShots.length - 1; i >= 0; i--) {
        const s = state.playerShots[i];
        s.x += s.vx * dtScale;
        s.y += s.vy * dtScale;

        if (s.y < -60 || s.x < -60 || s.x > w + 60) {
          state.playerShots.splice(i, 1);
          continue;
        }

        let consumed = false;

        // 1. Check Hit on Boss Shield Pylons First (generous radius matching bigger 3D plasma shells!)
        if (boss && boss.phase === 'fighting' && boss.pylons && boss.pylons.length > 0) {
          for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
            const pyl = boss.pylons[pIdx];
            if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < 34) {
              this.damagePylon(pyl, s.dmg, now, s.x, s.y);
              consumed = true;
              break;
            }
          }
        }

        // 2. Check Hit on Active Boss Body
        if (!consumed && boss && boss.phase === 'fighting') {
          const dx = s.x - boss.x;
          const dy = s.y - boss.y;
          // Elliptical hitbox matching wide winged bosses cleanly
          const rx = boss.hitR * 1.22;
          const ry = boss.hitR * 0.86;
          if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
            this.damageBoss(s.dmg, now, false, s.x, s.y);
            // Meteor Mass-Driver splash nudges nearby Pylon if close
            if (s.mode === 'meteor' && boss.pylons) {
              for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
                const pyl = boss.pylons[pIdx];
                if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < 75) {
                  this.damagePylon(pyl, 0.35, now, pyl.x, pyl.y);
                }
              }
            }
            consumed = true;
          }
        }

        // 2.5. === CHANGED (v387): Check Hit on Hostile Voidbloom Nodes ===
        if (!consumed && VoidbloomEngine.hitByShot(s.x, s.y, s.dmg, now, 'shot')) {
          consumed = true;
        }

        // 3. Tactical Defense: Bolts Shatter Falling Bad Nodes (NEVER Harm Good Nodes!)
        if (!consumed && state.particles.length > 0) {
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!isHazardNode(pt.nodeClass)) continue;
            const hr = (pt.headR || 28) + 16;
            if (Math.hypot(s.x - pt.x, s.y - pt.y) < hr) {
              if (pt.shotHp === undefined) {
                pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              }
              pt.shotHp -= s.dmg;
              this._spawnHitSparks(s.x, s.y, '#fbbf24', 5);
              consumed = true;
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#fbbf24', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              } else {
                audio.playBossHit(false);
              }
              break;
            }
          }
        }

        if (consumed) {
          // === CHANGED (v392): Per-Realm 5th-Shot Overcharged Super-Round Impact Signatures ===
          if (s.isFifth) {
            if (s.mode === 'helix') {
              this._spawnHitSparks(s.x, s.y, '#ec4899', 6);
              this._spawnHitSparks(s.x, s.y, '#22d3ee', 6);
              if (state.bossShockRings && state.bossShockRings.length < 18) {
                state.bossShockRings.push({ x: s.x, y: s.y, r: 6, maxR: 46, alpha: 0.88, speed: 4.5, color: '#e879f9', harmless: true });
              }
            } else if (s.mode === 'meteor') {
              this._spawnHitSparks(s.x, s.y, '#fde047', 8);
              this._spawnHitSparks(s.x, s.y, '#f97316', 6);
              if (state.bossShockRings && state.bossShockRings.length < 18) {
                state.bossShockRings.push({ x: s.x, y: s.y, r: 8, maxR: 54, alpha: 0.90, speed: 4.8, color: '#f97316', harmless: true });
              }
            } else {
              this._spawnHitSparks(s.x, s.y, '#a78bfa', 10);
              if (state.bossShockRings && state.bossShockRings.length < 18) {
                state.bossShockRings.push({ x: s.x, y: s.y, r: 6, maxR: 48, alpha: 0.88, speed: 5.2, color: '#38bdf8', harmless: true });
              }
            }
          }
          state.playerShots.splice(i, 1);
          continue;
        }

        // === CHANGED (v392): BESPOKE PRIMARY GUN PROJECTILES PER CHROME CORE ===
        const bMode = (s.mode === 'helix') ? 'helix' : (s.mode === 'meteor' ? 'meteor' : 'dynamo');
        const bImg = VfxUltraAssets.gunBolt[bMode];
        const bReady = VfxUltraAssets.loaded.gunBolt[bMode] && bImg && bImg.naturalWidth > 0;
        const bAng = Math.atan2(s.vy, s.vx) + Math.PI * 0.5;
        const isSuper = Boolean(s.isFifth);
        const bw = isSuper ? 62 : (s.heavy ? 52 : 42);
        const bh = isSuper ? 98 : (s.heavy ? 82 : 66);

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(bAng);

        if (bMode === 'helix') {
          // HELIX CASTER: Intertwining Live Double-Helix Wave Projectile + Spinning 3D Faceted Diamond Warhead (Zero outer glow halo!)
          const waveAmp = isSuper ? 11.5 : (s.heavy ? 9.0 : 7.0);
          const segs = 7;
          const yBot = bh * 0.44;
          const yTop = -bh * 0.30;
          const ptsA = [];
          const ptsB = [];
          for (let seg = 0; seg <= segs; seg++) {
            const frac = seg / segs;
            const py = yBot + (yTop - yBot) * frac;
            const osc = Math.sin(now * 0.028 + s.phase + seg * 0.85) * waveAmp * (1.0 - frac * 0.25);
            ptsA.push({ x: osc, y: py });
            ptsB.push({ x: -osc, y: py });
          }

          // 3 glowing base-pair rungs connecting the two waves
          ctx.strokeStyle = 'rgba(240, 253, 250, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          [1, 3, 5].forEach((idx) => {
            ctx.moveTo(ptsA[idx].x, ptsA[idx].y);
            ctx.lineTo(ptsB[idx].x, ptsB[idx].y);
          });
          ctx.stroke();

          // Strand A (Neon Magenta) & Strand B (Aqua Cyan)
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.96)';
          ctx.lineWidth = isSuper ? 3.8 : 2.8;
          ctx.beginPath();
          ctx.moveTo(ptsA[0].x, ptsA[0].y);
          for (let k = 1; k < ptsA.length; k++) ctx.lineTo(ptsA[k].x, ptsA[k].y);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(34, 211, 238, 0.96)';
          ctx.beginPath();
          ctx.moveTo(ptsB[0].x, ptsB[0].y);
          for (let k = 1; k < ptsB.length; k++) ctx.lineTo(ptsB[k].x, ptsB[k].y);
          ctx.stroke();

          // Crown: Spinning 3D faceted diamond crystal warhead
          const wy = yTop - 4;
          const wr = isSuper ? 12 : 9;
          ctx.save();
          ctx.translate(0, wy);
          ctx.scale(0.85 + 0.25 * Math.cos(now * 0.02 + s.phase), 1);
          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.moveTo(0, -wr * 1.5);
          ctx.lineTo(wr * 0.85, 0);
          ctx.lineTo(0, wr * 0.9);
          ctx.lineTo(-wr * 0.85, 0);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -wr * 1.1);
          ctx.lineTo(wr * 0.38, -wr * 0.1);
          ctx.lineTo(0, wr * 0.45);
          ctx.lineTo(-wr * 0.38, -wr * 0.1);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

        } else if (bMode === 'meteor') {
          // === CHANGED (v396): EMBER CANNON — 3D Cracked Molten-Lava Fireball + Twin Spiraling Ember Ribbons + Double Bow-Shock ===
          if (bReady) {
            ctx.globalAlpha = 0.96;
            ctx.drawImage(bImg, -bw * 0.54, -bh * 0.34, bw * 1.08, bh * 1.12);
          }

          // Twin counter-spiraling molten ember ribbons & Mach shock chevrons trailing behind the fireball
          const fbY = -bh * 0.18;
          const fbR = isSuper ? 14.0 : (s.heavy ? 11.2 : 9.2);
          const tailBot = bh * 0.44;
          ctx.lineCap = 'round';
          for (let strand = 0; strand < 2; strand++) {
            const sSign = strand === 0 ? 1 : -1;
            ctx.strokeStyle = strand === 0 ? 'rgba(251, 146, 60, 0.90)' : 'rgba(253, 224, 71, 0.88)';
            ctx.lineWidth = isSuper ? 2.6 : 1.9;
            ctx.beginPath();
            for (let seg = 0; seg <= 6; seg++) {
              const frac = seg / 6;
              const py = fbY + (tailBot - fbY) * frac;
              const px = sSign * Math.sin(now * 0.032 + s.phase + frac * 4.2) * (fbR * (0.85 - frac * 0.45));
              if (seg === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // Tumbling 3D cracked basalt-lava fireball core at warhead nose
          ctx.save();
          ctx.translate(0, fbY);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#240f05';
          ctx.beginPath();
          ctx.arc(0, 0, fbR, 0, Math.PI * 2);
          ctx.fill();
          // Glowing magma fissures rotating across sphere
          ctx.rotate(now * 0.014 + s.phase);
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.moveTo(-fbR * 0.86, -fbR * 0.25);
          ctx.lineTo(-fbR * 0.1, fbR * 0.22);
          ctx.lineTo(fbR * 0.84, -fbR * 0.3);
          ctx.moveTo(0, -fbR * 0.88);
          ctx.lineTo(fbR * 0.15, fbR * 0.86);
          ctx.stroke();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.arc(0, 0, fbR * 0.44, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Double blazing parabolic bow-shock crescent ahead of the fireball nose
          ctx.strokeStyle = 'rgba(255, 251, 235, 0.95)';
          ctx.lineWidth = isSuper ? 3.4 : 2.5;
          ctx.beginPath();
          ctx.moveTo(-fbR * 1.32, fbY - fbR * 0.22);
          ctx.quadraticCurveTo(0, fbY - fbR * 2.05, fbR * 1.32, fbY - fbR * 0.22);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(251, 146, 60, 0.82)';
          ctx.lineWidth = isSuper ? 2.2 : 1.5;
          ctx.beginPath();
          ctx.moveTo(-fbR * 1.58, fbY + fbR * 0.05);
          ctx.quadraticCurveTo(0, fbY - fbR * 2.45, fbR * 1.58, fbY + fbR * 0.05);
          ctx.stroke();

          if (isSuper) {
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.94)';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.ellipse(0, fbY, fbR * 1.75, fbR * 0.58, 0.24, 0, Math.PI * 2);
            ctx.stroke();
          }

        } else {
          // TESLA RAILGUN (Dynamo): High-Velocity Rail Spear + Live 5-Segment Crackling Lightning Jacket (Zero outer glow halo!)
          if (bReady) {
            ctx.globalAlpha = 0.96;
            ctx.drawImage(bImg, -bw * 0.5, -bh * 0.36, bw, bh);
          } else {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5.5, 20, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Live 5-segment crackling zig-zag lightning jacket wrapped from tail to spearhead
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = 'rgba(125, 211, 252, 0.96)';
          ctx.lineWidth = isSuper ? 3.0 : 2.2;
          ctx.beginPath();
          const zBot = bh * 0.42;
          const zTop = -bh * 0.46;
          ctx.moveTo(0, zBot);
          for (let seg = 1; seg <= 4; seg++) {
            const frac = seg / 5;
            const py = zBot + (zTop - zBot) * frac;
            const px = Math.sin(now * 0.09 + s.phase + seg * 2.4) * (isSuper ? 12 : 8.5);
            ctx.lineTo(px, py);
          }
          ctx.lineTo(0, zTop);
          ctx.stroke();

          if (isSuper) {
            // Secondary golden-volt overcharge arc on every 5th Super-Round!
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.95)';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(0, zBot);
            for (let seg = 1; seg <= 4; seg++) {
              const frac = seg / 5;
              const py = zBot + (zTop - zBot) * frac;
              const px = -Math.sin(now * 0.11 + s.phase + seg * 3.1) * 13;
              ctx.lineTo(px, py);
            }
            ctx.lineTo(0, zTop);
            ctx.stroke();
          }

          // Sharp white-cyan plasma spearhead tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, zTop - 4);
          ctx.lineTo(4.5, zTop + 12);
          ctx.lineTo(0, zTop + 8);
          ctx.lineTo(-4.5, zTop + 12);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
      ctx.restore();
    },

    // === CHANGED (v389): BOSS ACTIVE POWERED BAD-NODE DEPLOYMENT ENGINE ===
    // While fighting, each Sovereign Boss manufactures and launches Round-tailored
    // Powered Bad Nodes (Hyper-Comet, Corruptor Laser, Gravity Well, EMP Detonator,
    // Phase Stalker + Round 5+ occasional 3D Voidbloom Rift) directly from its wing emitters!
    _spawnBossPoweredHazard(boss, now, w, h) {
      if (!boss || boss.phase !== 'fighting' || SkillSystem.activeNova) return false;

      const maxBossHazards = Math.min(4, 2 + (boss.round >= 3 ? 1 : 0) + (boss.enraged ? 1 : 0));
      const activeHazards = state.particles.filter(pt => isHazardNode(pt.nodeClass)).length;
      if (activeHazards >= maxBossHazards) return false;

      // Alternate left / right Boss wing emitter pods
      boss.emitterSide = -(boss.emitterSide || 1);
      const emitterOffsetX = boss.emitterSide * boss.drawW * 0.30;
      const launchX = Math.max(54, Math.min(w - 54, boss.x + emitterOffsetX));
      const launchY = Math.max(88, boss.y + boss.hitR * 0.44);

      boss.emitterFlashUntil = now + 560;
      boss.emitterFlashX = emitterOffsetX;
      boss.bossHazardsDeployed = (boss.bossHazardsDeployed || 0) + 1;

      // Round 5+ Apex Boss: 22% chance to tear open a 3D Voidbloom Rift directly from its wing emitter!
      if (boss.bossId >= 5 && Math.random() < 0.22 && (VoidbloomEngine.nodes.length + VoidbloomEngine.telegraphs.length) < CONFIG.voidbloom.maxAlive) {
        VoidbloomEngine.scheduleTelegraph(w, h, boss.x, now, launchX);
        this._spawnHitSparks(launchX, launchY, '#a3e635', 10);
        return true;
      }

      // Select Round-tailored Powered Bad Node class
      const pools = {
        1: ['hyper_comet', 'corruptor_laser'],
        2: ['corruptor_laser', 'hyper_comet', 'gravity_well'],
        3: ['gravity_well', 'emp_detonator', 'hyper_comet'],
        4: ['phase_stalker', 'hyper_comet', 'emp_detonator', 'corruptor_laser'],
        5: ['hyper_comet', 'corruptor_laser', 'gravity_well', 'emp_detonator', 'phase_stalker']
      };
      const pool = pools[boss.bossId] || pools[5];
      const nClass = pool[Math.floor(Math.random() * pool.length)];

      const headRadiusMap = {
        hyper_comet: 29.0,
        corruptor_laser: 32.0,
        gravity_well: 33.0,
        emp_detonator: 31.0,
        phase_stalker: 30.0
      };
      const speedMultMap = {
        hyper_comet: 1.0,
        corruptor_laser: 0.72,
        gravity_well: 0.78,
        emp_detonator: 0.84,
        phase_stalker: 0.96
      };
      const labelMap = {
        hyper_comet: 'HYPER-COMET',
        corruptor_laser: 'CORRUPTOR LASER',
        gravity_well: 'GRAVITY WELL',
        emp_detonator: 'EMP DETONATOR',
        phase_stalker: 'PHASE STALKER'
      };

      const pType = (state.gameType === 'realm') ? 'dynamo' : (state.gameType || 'meteor');
      const normFactor = Math.max(0.75, Math.min(1.45, h / 720));
      const baseSpeed = 2.05 + (boss.round - 1) * 0.14 + (boss.enraged ? 0.25 : 0);
      const actualSpeed = baseSpeed * normFactor;

      const p = {
        type: pType,
        nodeClass: nClass,
        bossSpawned: true,
        x: launchX,
        y: launchY,
        vx: boss.emitterSide * 0.55,
        speed: actualSpeed * (speedMultMap[nClass] || 0.9),
        baseSpeed: baseSpeed,
        headR: headRadiusMap[nClass] || 30.0,
        hasSplit: false,
        hasDetonated: false,
        hasGrazed: false,
        phantomAlpha: 1.0,
        animPhase: Math.random() * Math.PI * 2,
        tumbleDir: Math.random() < 0.5 ? 1 : -1,
        cometPhase: (nClass === 'hyper_comet') ? 'charging' : null,
        cometChargeEnd: (nClass === 'hyper_comet') ? (now + 900) : 0,
        cometDiveSpeed: actualSpeed * 3.45,
        flameEmbers: [],
        laserState: 'idle',
        laserCharge: 0,
        laserChargeStart: 0,
        laserTargets: [],
        laserSalvosLeft: 2,
        laserNextReady: now + 750,
        empCharge: 0,
        empNextPulse: now + 1500,
        blinkState: 'idle',
        blinkProgress: 0,
        blinkStartTime: 0,
        blinkTargetX: launchX,
        blinkTargetY: Math.min(h * 0.45, launchY + 120),
        blinksLeft: boss.enraged ? 2 : 1,
        spine: [],
        stardust: []
      };
      for (let j = 0; j < 8; j++) {
        p.spine.push({ x: launchX, y: launchY - j * 8.0 });
      }
      state.particles.push(p);

      // Visual & Audio Boss Deployment Telegraph
      this._spawnHitSparks(launchX, launchY, boss.accent || '#f43f5e', 10);
      if (nClass === 'hyper_comet') {
        audio.playHyperCometRoar();
      } else {
        audio.playPhaseSwitch();
      }
      return true;
    },

    // ─── BOSS AI, ATTACK PATTERNS, BULLETS, BEAMS & RENDERING ───
    updateAndDrawBossSystem(ctx, cx, cy, u, dtScale, now, w, h, spawnSupplyNodeFn) {
      // 1. Check Transitions (Warning -> Spawn Boss; Cleared -> Advance Round!)
      if (state.roundPhase === 'warning' && now >= (state.bossWarningUntil || 0)) {
        this.spawnBoss(state.currentRound, now, w, h, false);
      } else if (state.roundPhase === 'cleared' && now >= (state.nextRoundAt || 0)) {
        state.currentRound++;
        state.currentWave = Math.min(10, state.currentRound);
        const nextSpec = this.getSpec(state.currentRound, state.catcherType);
        state.roundPhase = 'gauntlet';
        state.roundNodesCaught = 0;
        state.roundQuota = nextSpec.quota;
        state.roundGauntletMs = 0;
        state.roundMinDurationMs = nextSpec.minDurationSec * 1000;
        state.roundSubWave = 1;
        state.roundOverchargeBonusCount = 0;
        state.boss = null;
        state.roundBanner = {
          title: `ROUND ${nextSpec.round} · WAVE 1/3 · ${nextSpec.name} SECTOR`,
          sub: `3 Escalating Waves (${nextSpec.minDurationSec}s) & ${nextSpec.quota} Nodes to Challenge Boss (${nextSpec.maxHp} HP)`,
          color: '#c084fc',
          startTime: now,
          duration: 2700
        };
        audio.playPhaseSwitch();
        updateHeaderUI();
      }

      const boss = state.boss;
      const coreHitR = 46 * u;

      if (boss && boss.phase !== 'defeated') {
        // Boss Movement & Entrance
        boss.recoilY *= 0.84;
        if (boss.phase === 'entering') {
          const p = Math.min(1, (now - boss.enterStart) / 1450);
          const ease = 1 - Math.pow(1 - p, 3);
          boss.y = -140 + (boss.targetY + 140) * ease;
          if (p >= 1) {
            boss.phase = 'fighting';
            boss.nextAttackAt = now + 750;
          }
        } else if (boss.phase === 'fighting') {
          const speedMult = (boss.enraged ? 1.32 : 1.0) * (1 + (boss.round - 1) * 0.08);
          boss.movePhase += 0.015 * dtScale * speedMult;

          const prevBossX = boss.x;
          // Boss 4 Tempest Dash-Strafe Logic
          if (boss.dashState) {
            const ds = boss.dashState;
            if (now < ds.telegraphEnd) {
              // Brief pause telegraphing dash target
            } else {
              const dp = Math.min(1, (now - ds.telegraphEnd) / 360);
              boss.x = ds.startX + (ds.endX - ds.startX) * (1 - Math.pow(1 - dp, 2));
              if (dp >= 1) boss.dashState = null;
            }
          } else {
            const margin = Math.max(boss.drawW * 0.52, w * 0.16);
            const span = Math.max(40, (w - margin * 2) * 0.5);
            boss.x = w * 0.5 + Math.sin(boss.movePhase) * span;
            boss.y = boss.targetY + Math.sin(boss.movePhase * 1.9) * 14 + boss.recoilY;
          }
          // Smooth 3D Velocity-Driven Banking Tilt
          boss.vx = boss.x - prevBossX;
          boss.prevX = boss.x;
          const targetBank = Math.max(-0.15, Math.min(0.15, boss.vx * 0.024));
          boss.bankAngle = (boss.bankAngle || 0) + (targetBank - (boss.bankAngle || 0)) * Math.min(1, 0.14 * dtScale);

          // Update Orbiting Shield Pylons
          if (boss.pylons && boss.pylons.length > 0) {
            const pSpin = (boss.enraged ? 0.026 : 0.018) * dtScale;
            for (let i = 0; i < boss.pylons.length; i++) {
              const pyl = boss.pylons[i];
              if (pyl.hp <= 0) continue;
              pyl.angle += pSpin;
              pyl.x = boss.x + Math.cos(pyl.angle) * pyl.orbitR;
              pyl.y = boss.y + Math.sin(pyl.angle) * (pyl.orbitR * 0.58);
            }
          }

          // Periodic Boss-Phase Good-Node Ammo Supply Drops (Keeps Catch-to-Reload Loop Alive!)
          if (now >= boss.nextSupplyAt && typeof spawnSupplyNodeFn === 'function') {
            boss.nextSupplyAt = now + (state.coreAmmo < 18 ? 1900 : 3200);
            spawnSupplyNodeFn(boss.x);
          }

          // === CHANGED (v389): Boss Actively Produces Powered Bad Nodes During Boss Combat! ===
          if (now >= (boss.nextHazardAt || 0) && !SkillSystem.activeNova) {
            this._spawnBossPoweredHazard(boss, now, w, h);
            const hazInterval = boss.enraged
              ? Math.max(2900, 4300 - boss.round * 220)
              : Math.max(3900, 5600 - boss.round * 240);
            boss.nextHazardAt = now + hazInterval;
          }

          // Execute Round-Specific Boss Attack Choreography (pauses cleanly during Caldera Nova eruption)
          if (now >= boss.nextAttackAt && !SkillSystem.activeNova) {
            this._executeBossAttack(boss, cx, cy, now, w, h);
          }
        }

        // ─── RENDER 6-LAYER VOLUMETRIC 3D SOVEREIGN BOSS & LIVE SHADER FX (v389) ───
        const bSpr = LayeredT4Assets.bosses[boss.bossId];
        const bLoaded = LayeredT4Assets.loaded.bosses[boss.bossId];
        const bossPalettes = {
          1: { ring: 'rgba(244, 63, 94, 0.72)', ring2: 'rgba(56, 189, 248, 0.58)', core: 'crimson', thrust: '#38bdf8' },
          2: { ring: 'rgba(232, 121, 249, 0.78)', ring2: 'rgba(250, 204, 21, 0.55)', core: 'violet', thrust: '#e879f9' },
          3: { ring: 'rgba(251, 146, 60, 0.80)', ring2: 'rgba(253, 224, 71, 0.62)', core: 'amber', thrust: '#fb923c' },
          4: { ring: 'rgba(249, 115, 22, 0.82)', ring2: 'rgba(254, 240, 138, 0.65)', core: 'amber', thrust: '#f97316' },
          5: { ring: 'rgba(251, 191, 36, 0.88)', ring2: 'rgba(255, 255, 255, 0.72)', core: 'gold', thrust: '#fde047' }
        };
        const pal = bossPalettes[boss.bossId] || bossPalettes[1];
        const breath = 1.0 + Math.sin(now * 0.0042) * 0.024;
        const aspect = (bSpr && bLoaded && bSpr.naturalWidth > 0) ? (bSpr.naturalHeight / bSpr.naturalWidth) : 1.0;
        const dw = boss.drawW * breath;
        const dh = dw * aspect;
        const bank = (boss.bankAngle || 0) + Math.sin(boss.movePhase) * 0.032;
        const foreshortenX = 1.0 - Math.abs(bank) * 0.18;
        const ringSpin = now * (boss.enraged ? 0.0032 : 0.0017);
        const haloR = boss.drawW * (boss.enraged ? 0.58 : 0.52);

        ctx.save();
        ctx.translate(boss.x, boss.y);

        // LAYER 1: Ambient Volumetric Boss Aura Glow (Pre-baked GPU Sprite!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const auraSpr = QuantumRenderer._getGlowSprite(boss.enraged ? 'crimson' : pal.core);
        const aR = boss.drawW * (boss.enraged ? 0.76 : 0.64);
        ctx.globalAlpha = boss.enraged ? (0.62 + 0.16 * Math.sin(now * 0.012)) : 0.46;
        ctx.drawImage(auraSpr, -aR, -aR * 0.80, aR * 2, aR * 1.60);
        ctx.restore();

        // LAYER 2: Back-Plane Tilted 3D Perspective Sovereign Halo Ring (behind hull!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(bank * 0.55);
        ctx.scale(1.0, 0.34);
        ctx.strokeStyle = pal.ring;
        ctx.lineWidth = boss.enraged ? 4.2 : 2.8;
        ctx.setLineDash([28, 14]);
        ctx.beginPath();
        ctx.arc(0, 0, haloR, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = pal.ring2;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, haloR * 0.84, Math.PI + ringSpin * 0.4, Math.PI * 2 + ringSpin * 0.4);
        ctx.stroke();
        ctx.restore();

        // LAYER 3: Twin Live Volumetric Rear Ion Thruster Exhaust Plumes (calibrated per Boss nozzle!)
        ctx.save();
        ctx.rotate(bank);
        ctx.scale(foreshortenX, 1.0);
        ctx.globalCompositeOperation = 'lighter';
        const thrustFlicker = 0.86 + 0.14 * Math.sin(now * 0.038) + Math.min(0.24, Math.abs(boss.vx || 0) * 0.035);
        const plumeLen = (boss.enraged ? 38 : 26) * thrustFlicker;
        const nozzleCfg = {
          1: { ox: 0.145, oy: -0.42 },
          2: { ox: 0.130, oy: -0.31 },
          3: { ox: 0.088, oy: -0.42 },
          4: { ox: 0.065, oy: -0.26 },
          5: { ox: 0.135, oy: -0.24 }
        }[boss.bossId] || { ox: 0.14, oy: -0.34 };
        const plumeOffX = dw * nozzleCfg.ox;
        const plumeY = dh * nozzleCfg.oy;
        const jetGlow = QuantumRenderer._getGlowSprite(boss.enraged ? 'crimson' : pal.core);
        for (let side = -1; side <= 1; side += 2) {
          const px = side * plumeOffX;
          ctx.save();
          ctx.translate(px, plumeY - plumeLen * 0.35);
          ctx.scale(0.42, 1.15);
          ctx.globalAlpha = 0.65 * thrustFlicker;
          ctx.drawImage(jetGlow, -plumeLen * 0.55, -plumeLen * 0.55, plumeLen * 1.1, plumeLen * 1.1);
          ctx.restore();
        }
        ctx.restore();

        // Armor Break Stagger Ring
        if (boss.armorBreakUntil && now < boss.armorBreakUntil) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 8]);
          ctx.beginPath();
          ctx.arc(0, 0, boss.hitR * 1.15, now * 0.006, now * 0.006 + Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Boss 4 Ghost Dash Telegraph Marker
        if (boss.dashState && now < boss.dashState.telegraphEnd) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.75)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(boss.dashState.endX - boss.x, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(boss.dashState.endX - boss.x, 0, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // LAYER 4: Photorealistic 3D Sculpted Sovereign Boss Model Sprite
        ctx.save();
        ctx.rotate(bank);
        ctx.scale(foreshortenX, 1.0);
        if (bSpr && bLoaded && bSpr.naturalWidth > 0) {
          ctx.drawImage(bSpr, -dw * 0.5, -dh * 0.5, dw, dh);

          // Crisp Zero-Lag Hit-Flash Overlay (Additive second pass on hit!)
          if (now < boss.hitFlashUntil) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.78;
            ctx.drawImage(bSpr, -dw * 0.5, -dh * 0.5, dw, dh);
            ctx.restore();
          }
        } else {
          ctx.fillStyle = '#991b1b';
          ctx.beginPath();
          ctx.arc(0, 0, boss.hitR * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // LAYER 5: Live Pulsing 3D Reactor Core Bloom (syncs with Boss Heart & Enrage!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const corePulse = 0.52 + 0.34 * Math.sin(now * (boss.enraged ? 0.014 : 0.007));
        const coreGlow = QuantumRenderer._getGlowSprite(boss.enraged ? 'crimson' : pal.core);
        const coreR = dw * (boss.bossId === 3 ? 0.24 : 0.18) * (0.92 + 0.14 * corePulse);
        ctx.globalAlpha = corePulse * (boss.enraged ? 0.78 : 0.55);
        ctx.drawImage(coreGlow, -coreR, -coreR, coreR * 2, coreR * 2);
        ctx.restore();

        // LAYER 6A: Wing-Emitter Charge & Deployment Flare when Boss Spawns a Powered Bad Node!
        if (boss.emitterFlashUntil && now < boss.emitterFlashUntil) {
          const efT = Math.max(0, (boss.emitterFlashUntil - now) / 560);
          const ex = boss.emitterFlashX || 0;
          const ey = boss.hitR * 0.42;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const emGlow = QuantumRenderer._getGlowSprite('gold');
          const er = 48 * (1.35 - efT * 0.5);
          ctx.globalAlpha = efT * 0.95;
          ctx.drawImage(emGlow, ex - er, ey - er, er * 2, er * 2);
          ctx.strokeStyle = `rgba(254, 240, 138, ${efT * 0.95})`;
          ctx.lineWidth = 3.2 * efT;
          ctx.beginPath();
          ctx.arc(ex, ey, 14 + (1 - efT) * 34, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // LAYER 6B: Front-Plane Tilted 3D Perspective Orbital Halo Arc (in FRONT of hull for real 3D depth!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(bank * 0.55);
        ctx.scale(1.0, 0.34);
        ctx.strokeStyle = pal.ring;
        ctx.lineWidth = boss.enraged ? 4.4 : 3.0;
        ctx.setLineDash([28, 14]);
        ctx.beginPath();
        ctx.arc(0, 0, haloR, 0, Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        // Orbiting bright energy node bead sweeping across the front perspective plane
        const beadAng = ringSpin % (Math.PI * 2);
        if (beadAng >= 0 && beadAng <= Math.PI) {
          const bx = Math.cos(beadAng) * haloR;
          const by = Math.sin(beadAng) * haloR;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        ctx.restore();

        // Render Orbiting Destructible Shield Pylons
        if (boss.pylons && boss.pylons.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < boss.pylons.length; i++) {
            const pyl = boss.pylons[i];
            if (pyl.hp <= 0) continue;
            // Energy tether to Boss
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(boss.x, boss.y);
            ctx.lineTo(pyl.x, pyl.y);
            ctx.stroke();

            // Hexagonal Shield Pylon Node
            const pGlow = QuantumRenderer._getGlowSprite(now < pyl.hitFlashUntil ? 'gold' : 'cyan');
            ctx.drawImage(pGlow, pyl.x - 24, pyl.y - 24, 48, 48);
            ctx.fillStyle = now < pyl.hitFlashUntil ? '#ffffff' : '#0f172a';
            ctx.strokeStyle = now < pyl.hitFlashUntil ? '#fde047' : '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            for (let k = 0; k < 6; k++) {
              const a = (k * Math.PI) / 3 + now * 0.003;
              const px = pyl.x + Math.cos(a) * 15;
              const py = pyl.y + Math.sin(a) * 15;
              if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Tiny Pylon HP Bar
            const frac = Math.max(0, pyl.hp / pyl.maxHp);
            ctx.fillStyle = 'rgba(15,23,42,0.85)';
            ctx.fillRect(pyl.x - 14, pyl.y - 24, 28, 3.5);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(pyl.x - 14, pyl.y - 24, 28 * frac, 3.5);
          }
          ctx.restore();
        }
      }

      // 2. Update & Render Telegraphed Boss Laser Beams
      if (state.bossBeams && state.bossBeams.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = state.bossBeams.length - 1; i >= 0; i--) {
          const bm = state.bossBeams[i];
          if (now >= bm.endAt) {
            state.bossBeams.splice(i, 1);
            continue;
          }
          if (boss && bm.followBoss) {
            bm.x = boss.x + (bm.offsetX || 0);
            bm.y = boss.y + 22;
          }
          const isFiring = now >= bm.fireAt;
          const x2 = bm.x + Math.sin(bm.angle || 0) * (h + 100);
          const y2 = bm.y + Math.cos(bm.angle || 0) * (h + 100);

          if (!isFiring) {
            // Clear 1.0s Dashed Warning Telegraph Sightline (Zero Cheap Hits!)
            const prog = Math.min(1, (now - bm.startAt) / Math.max(1, bm.fireAt - bm.startAt));
            ctx.strokeStyle = `rgba(244, 63, 94, ${0.32 + 0.52 * prog})`;
            ctx.lineWidth = 1.6 + prog * 1.4;
            ctx.setLineDash([10, 8]);
            ctx.beginPath();
            ctx.moveTo(bm.x, bm.y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            // Blazing Active Beam Lance!
            const halfW = bm.width || 16;
            ctx.strokeStyle = bm.color || 'rgba(244, 63, 94, 0.82)';
            ctx.lineWidth = halfW * 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(bm.x, bm.y);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = halfW * 0.65;
            ctx.stroke();

            // Distance from Player Core to Beam Line Segment
            const ldx = x2 - bm.x;
            const ldy = y2 - bm.y;
            const lenSq = ldx * ldx + ldy * ldy || 1;
            const tProj = Math.max(0, Math.min(1, ((cx - bm.x) * ldx + (cy - bm.y) * ldy) / lenSq));
            const closestX = bm.x + tProj * ldx;
            const closestY = bm.y + tProj * ldy;
            const distBeam = Math.hypot(cx - closestX, cy - closestY);
            if (distBeam < coreHitR * 0.72 + halfW) {
              this._onPlayerHitByBoss(cx, cy, now);
            }
          }
        }
        ctx.restore();
      }

      // 3. Update & Render Boss Projectiles (Pure GPU Blit — Zero Lag!)
      if (state.bossBullets && state.bossBullets.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = state.bossBullets.length - 1; i >= 0; i--) {
          const b = state.bossBullets[i];
          b.x += b.vx * dtScale;
          b.y += b.vy * dtScale;
          if (b.y > h + 40 || b.y < -60 || b.x < -50 || b.x > w + 50) {
            state.bossBullets.splice(i, 1);
            continue;
          }

          const spr = QuantumRenderer._getGlowSprite(b.glowKey || 'crimson');
          const r = b.r || 9;
          ctx.drawImage(spr, b.x - r * 2.1, b.y - r * 2.1, r * 4.2, r * 4.2);
          ctx.fillStyle = b.coreColor || '#ffe4e6';
          ctx.beginPath();
          ctx.arc(b.x, b.y, r * 0.58, 0, Math.PI * 2);
          ctx.fill();

          // Player / Outer Armored Shield Perimeter Collision Check
          const dist = Math.hypot(cx - b.x, cy - b.y);
          const hasBossShield = state.hasBuff('shield', now);
          const bDefR = hasBossShield ? CoreKinematics.getShieldOuterRadius(u, state.coreTier) : (coreHitR * 0.75);
          if (dist < bDefR + r) {
            state.bossBullets.splice(i, 1);
            const bAng = Math.atan2(b.y - cy, b.x - cx);
            this._onPlayerHitByBoss(b.x, b.y, now, bAng);
          }
        }
        ctx.restore();
      }

      // 4. Update & Render Boss Shock-Rings (Victory Supernova & EMP Rings)
      if (state.bossShockRings && state.bossShockRings.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = state.bossShockRings.length - 1; i >= 0; i--) {
          const sr = state.bossShockRings[i];
          sr.r += (sr.speed || 7.5) * dtScale;
          sr.alpha = Math.max(0, 1 - sr.r / sr.maxR);
          if (sr.alpha <= 0.02) {
            state.bossShockRings.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = sr.color || '#f43f5e';
          ctx.globalAlpha = sr.alpha * 0.85;
          ctx.lineWidth = sr.harmless ? 5 : 3;
          ctx.beginPath();
          ctx.arc(sr.x, sr.y, sr.r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Update & Render Crisp GPU Hit Sparks
      if (state.bossHitSparks && state.bossHitSparks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = state.bossHitSparks.length - 1; i >= 0; i--) {
          const sp = state.bossHitSparks[i];
          sp.x += sp.vx * dtScale;
          sp.y += sp.vy * dtScale;
          sp.vx *= 0.94;
          sp.vy *= 0.94;
          sp.life += dtScale;
          if (sp.life >= sp.maxLife) {
            state.bossHitSparks.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = 1 - sp.life / sp.maxLife;
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * (1 - sp.life / sp.maxLife * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 6. Render On-Canvas Telemetry HUD (Round Progress Bar / Boss HP Bar / Banners)
      this._drawArenaOverlays(ctx, w, h, now);
    },

    _executeBossAttack(boss, cx, cy, now, w, h) {
      boss.attackStep++;
      const enr = boss.enraged;
      const spdScale = 1 + (boss.round - 1) * 0.08 + (enr ? 0.14 : 0);
      const aimAng = Math.atan2(cy - boss.y, cx - boss.x);
      const pushBullet = (x, y, ang, spd, r, glowKey, coreColor) => {
        if (state.bossBullets.length >= 90) return;
        state.bossBullets.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: r || 8.5,
          glowKey: glowKey || 'crimson',
          coreColor: coreColor || '#ffe4e6'
        });
      };

      if (boss.bossId === 1) {
        // ROUND 1: AEGIS SENTINEL — Aimed 3-way (P1) -> 5-way (P2) + telegraphed center beam!
        const count = enr ? 5 : 3;
        const spread = enr ? 0.22 : 0.26;
        for (let k = 0; k < count; k++) {
          const a = aimAng + (k - (count - 1) / 2) * spread;
          pushBullet(boss.x, boss.y + 28, a, 5.2 * spdScale, 9, 'crimson', '#fecdd3');
        }
        if (enr && boss.attackStep % 2 === 0) {
          state.bossBeams.push({
            x: boss.x, y: boss.y + 24, offsetX: 0, angle: 0, width: 15, followBoss: true,
            color: 'rgba(244, 63, 94, 0.78)', startAt: now, fireAt: now + 950, endAt: now + 1550
          });
        }
        boss.nextAttackAt = now + (enr ? 1450 : 1850);

      } else if (boss.bossId === 2) {
        // ROUND 2: CORRUPTOR PRISM SOVEREIGN — Twin/Triple Telegraphed Crimson Beam Lances + Flank Darts!
        if (boss.attackStep % 2 === 1) {
          const offsets = enr ? [-64, 0, 64] : [-52, 52];
          offsets.forEach((ox) => {
            state.bossBeams.push({
              x: boss.x + ox, y: boss.y + 28, offsetX: ox, angle: 0, width: 14, followBoss: true,
              color: 'rgba(232, 121, 249, 0.80)', startAt: now, fireAt: now + 1000, endAt: now + 1650
            });
          });
        } else {
          for (let side = -1; side <= 1; side += 2) {
            const ox = boss.x + side * 56;
            const ang = Math.atan2(cy - boss.y, cx - ox);
            pushBullet(ox, boss.y + 22, ang - 0.14, 5.8 * spdScale, 8.5, 'crimson', '#f5d0fe');
            pushBullet(ox, boss.y + 22, ang + 0.14, 5.8 * spdScale, 8.5, 'crimson', '#f5d0fe');
          }
        }
        boss.nextAttackAt = now + (enr ? 1450 : 1750);

      } else if (boss.bossId === 3) {
        // ROUND 3: SINGULARITY LEVIATHAN — Rotating Spiral Curtain + Gravity Ring Pulse!
        const spokes = enr ? 10 : 8;
        boss.spiralAngle += 0.38;
        for (let s = 0; s < spokes; s++) {
          const a = boss.spiralAngle + (s * Math.PI * 2) / spokes;
          pushBullet(boss.x, boss.y, a, 4.4 * spdScale, 8.5, (s % 2 === 0) ? 'amber' : 'crimson', '#fef08a');
        }
        if (boss.attackStep % 3 === 0) {
          state.bossShockRings.push({ x: boss.x, y: boss.y, r: 22, maxR: 260, alpha: 0.9, speed: 5.5, color: '#a855f7', harmless: true });
        }
        boss.nextAttackAt = now + (enr ? 1150 : 1450);

      } else if (boss.bossId === 4) {
        // ROUND 4: TEMPEST ARCH-HYDRA — Telegraphed Ghost-Dash Strafe + Tri-Turbine Volleys!
        if (boss.attackStep % 3 === 0 && !boss.dashState) {
          const targetX = (boss.x < w * 0.5) ? (w * 0.76) : (w * 0.24);
          boss.dashState = { startX: boss.x, endX: targetX, telegraphEnd: now + 520 };
        }
        const guns = [-68, 0, 68];
        guns.forEach((gx) => {
          const sx = boss.x + gx;
          const a = Math.atan2(cy - boss.y, cx - sx);
          pushBullet(sx, boss.y + 20, a, 6.2 * spdScale, 8.5, 'amber', '#fef08a');
          if (enr) {
            pushBullet(sx, boss.y + 20, a + 0.24, 5.4 * spdScale, 8, 'crimson', '#fed7aa');
            pushBullet(sx, boss.y + 20, a - 0.24, 5.4 * spdScale, 8, 'crimson', '#fed7aa');
          }
        });
        boss.nextAttackAt = now + (enr ? 1200 : 1500);

      } else {
        // ROUND 5+: OMEGA ANTICORE · FALLEN CHROME ARCHON — 3-Phase Grand Finale!
        const pat = boss.attackStep % 3;
        if (pat === 0) {
          const count = boss.finalEclipse ? 7 : 5;
          for (let k = 0; k < count; k++) {
            const a = aimAng + (k - (count - 1) / 2) * 0.21;
            pushBullet(boss.x, boss.y + 26, a, 5.6 * spdScale, 9, 'amber', '#fef08a');
          }
        } else if (pat === 1) {
          const offs = boss.finalEclipse ? [-92, 0, 92] : [-72, 72];
          offs.forEach((ox) => {
            state.bossBeams.push({
              x: boss.x + ox, y: boss.y + 26, offsetX: ox, angle: 0, width: 15, followBoss: true,
              color: 'rgba(249, 115, 22, 0.82)', startAt: now, fireAt: now + 950, endAt: now + 1580
            });
          });
        } else {
          const spokes = boss.finalEclipse ? 12 : 8;
          boss.spiralAngle += 0.42;
          for (let s = 0; s < spokes; s++) {
            const a = boss.spiralAngle + (s * Math.PI * 2) / spokes;
            pushBullet(boss.x, boss.y, a, 4.7 * spdScale, 8.5, (s % 2 === 0) ? 'amber' : 'crimson', '#fde047');
          }
        }
        boss.nextAttackAt = now + (boss.finalEclipse ? 1050 : (enr ? 1220 : 1480));
      }
    },

    _onPlayerHitByBoss(ix, iy, now, contactAng = null) {
      if (state.hasBuff('shield', now)) {
        state.score += 150;
        CoreKinematics.triggerShieldDeflect(ix, iy, now, state.catcherType || 'dynamo', contactAng);
        audio.playPerfectCatch(state.combo);
        return;
      }
      if (state.playerInvulnUntil && now < state.playerInvulnUntil) return;
      state.playerInvulnUntil = now + 1350;

      if (state.coreTier > 1) {
        state.coreTier--;
        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 6) {
          state.tier6HatchLock = false;
          if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
        }
      } else {
        state.coreTier = 1;
        state.combo = 0;
        state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playHazardExplosion();
      renderReflexShields();
      updateHeaderUI();

      if (state.reflexLives <= 0) {
        const gameNames = { dynamo: 'CHROME DYNAMO', realm: 'CHROME DYNAMO', helix: 'CHROME HELIX', meteor: 'CHROME METEOR' };
        handleGameOver('SHIELDS DEPLETED', `${gameNames[state.gameType]} fell in Round ${state.currentRound}. Final Score: ${state.score.toLocaleString()} points.`);
      }
    },

    _drawArenaOverlays(ctx, w, h, now) {
      const boss = state.boss;
      ctx.save();

      // A. GAUNTLET PHASE: AAA 3-Segment Wave Progress Bar + Live Boss Approach Countdown
      if (state.roundPhase === 'gauntlet' && state.roundQuota > 0) {
        const bw = (w < 640) ? Math.min(344, w - 24) : Math.min(368, w * 0.42);
        const bx = (w - bw) * 0.5;
        const by = (w < 640) ? 64 : ((w < 1220) ? 48 : 14);
        const bh = 24;
        const quota = Math.max(1, state.roundQuota || 48);
        const minDur = Math.max(1, state.roundMinDurationMs || 45000);
        const caught = state.roundNodesCaught || 0;
        const quotaPct = Math.min(1, caught / quota);
        const timePct = Math.min(1, (state.roundGauntletMs || 0) / minDur);
        const effPct = Math.min(quotaPct, timePct);
        const subWave = state.roundSubWave || 1;
        const remSec = Math.max(0, Math.ceil((minDur - (state.roundGauntletMs || 0)) / 1000));
        const isOvercharge = (caught >= quota && remSec > 0);

        const waveAccent = isOvercharge
          ? '#fde047'
          : (subWave === 3 ? '#fb923c' : (subWave === 2 ? '#c084fc' : '#38bdf8'));
        const waveFill = isOvercharge
          ? 'rgba(250, 204, 21, 0.52)'
          : (subWave === 3 ? 'rgba(251, 146, 60, 0.50)' : (subWave === 2 ? 'rgba(192, 132, 252, 0.48)' : 'rgba(56, 189, 248, 0.46)'));

        ctx.fillStyle = 'rgba(8, 12, 26, 0.82)';
        ctx.strokeStyle = isOvercharge ? 'rgba(253, 224, 71, 0.85)' : (subWave === 3 ? 'rgba(251, 146, 60, 0.65)' : 'rgba(139, 92, 246, 0.48)');
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 12); else ctx.rect(bx, by, bw, bh);
        ctx.fill();
        ctx.stroke();

        // Subtle Ghost Lead Bar when player's caught-node pace leads the minimum countdown
        if (quotaPct > effPct + 0.01) {
          const ghostW = Math.max(0, (bw - 6) * quotaPct);
          if (ghostW > 2) {
            ctx.fillStyle = 'rgba(125, 211, 252, 0.16)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(bx + 3, by + 3, ghostW, bh - 6, 9); else ctx.rect(bx + 3, by + 3, ghostW, bh - 6);
            ctx.fill();
          }
        }

        // Active Effective Progress Fill
        const fillW = Math.max(0, (bw - 6) * effPct);
        if (fillW > 2) {
          ctx.fillStyle = waveFill;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx + 3, by + 3, fillW, bh - 6, 9); else ctx.rect(bx + 3, by + 3, fillW, bh - 6);
          ctx.fill();
        }

        // Crisp 3-Act Wave Precision Ticks (33.3% & 66.7%) — subtle center hairline + sharp top/bottom notches so text stays 100% legible
        const tick1X = bx + bw * 0.333;
        const tick2X = bx + bw * 0.667;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.fillRect(tick1X, by + 3, 1.2, bh - 6);
        ctx.fillRect(tick2X, by + 3, 1.2, bh - 6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
        ctx.fillRect(tick1X - 0.5, by + 1, 2, 4);
        ctx.fillRect(tick1X - 0.5, by + bh - 5, 2, 4);
        ctx.fillRect(tick2X - 0.5, by + 1, 2, 4);
        ctx.fillRect(tick2X - 0.5, by + bh - 5, 2, 4);

        // Live Dual-Gate Telemetry Text (with crisp OLED legibility stroke)
        ctx.font = '800 10.5px "Lexend", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const timeStr = `${Math.floor(remSec / 60)}:${String(remSec % 60).padStart(2, '0')}`;
        const labelTxt = isOvercharge
          ? `⚡ R${state.currentRound} OVERCHARGE · BOSS IN ${remSec}s!`
          : (remSec > 0
            ? `R${state.currentRound} · WAVE ${subWave}/3 · ${caught}/${quota} · ${timeStr}`
            : `R${state.currentRound} · WAVE 3/3 · ${caught}/${quota} TO BOSS`);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(4, 6, 16, 0.85)';
        ctx.strokeText(labelTxt, w * 0.5, by + bh * 0.5 + 0.5);
        ctx.fillStyle = isOvercharge ? '#fef08a' : '#f1f5f9';
        ctx.fillText(labelTxt, w * 0.5, by + bh * 0.5 + 0.5);
      }

      // B. BOSS FIGHT PHASE: Luxury Segmented Boss Health Bar + Phase Markers (Zero HUD Collision on All Viewports!)
      if (boss && boss.phase !== 'defeated') {
        const bw = (w < 640) ? Math.min(344, w - 24) : Math.min(390, w * 0.44);
        const bx = (w - bw) * 0.5;
        const by = (w < 640) ? 62 : ((w < 1220) ? 46 : 12);
        const bh = 16;
        const hpFrac = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
        const isBroken = boss.armorBreakUntil && now < boss.armorBreakUntil;

        // Title + Live Shot Counter Row (auto-fitted so title & HP never overlap on 390px iPhones)
        ctx.font = `800 ${w < 640 ? 10 : 11}px "Lexend", sans-serif`;
        ctx.fillStyle = isBroken ? '#fde047' : '#f8fafc';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`ROUND ${boss.round} BOSS · ${boss.name}${boss.enraged ? ' [ENRAGED]' : ''}`, bx, by + 11, Math.max(120, bw - 84));

        ctx.textAlign = 'right';
        ctx.fillStyle = '#fda4af';
        ctx.fillText(`${Math.ceil(boss.hp)} / ${boss.maxHp} HP`, bx + bw, by + 11, 78);

        // Bar Track
        const barY = by + 15;
        ctx.fillStyle = 'rgba(10, 12, 24, 0.88)';
        ctx.strokeStyle = isBroken ? '#fde047' : 'rgba(244, 63, 94, 0.72)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, barY, bw, bh, 8); else ctx.rect(bx, barY, bw, bh);
        ctx.fill();
        ctx.stroke();

        // HP Fill
        const fillW = Math.max(0, (bw - 4) * hpFrac);
        if (fillW > 2) {
          ctx.fillStyle = isBroken ? '#facc15' : (boss.enraged ? '#ef4444' : '#f43f5e');
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx + 2, barY + 2, fillW, bh - 4, 6); else ctx.rect(bx + 2, barY + 2, fillW, bh - 4);
          ctx.fill();
          // Gloss highlight strip
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(bx + 4, barY + 3, Math.max(0, fillW - 4), 4);
        }

        // Phase 2 Enrage Notch (50%) & Phase 3 Notch (33% for R5)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(bx + bw * 0.50, barY + 1, 2, bh - 2);
        if (boss.bossId === 5) ctx.fillRect(bx + bw * 0.33, barY + 1, 2, bh - 2);
      }

      // C. DRAMATIC ROUND / WARNING / VICTORY TELEMETRY BANNER
      if (state.roundBanner) {
        const bn = state.roundBanner;
        const elapsed = now - bn.startTime;
        if (elapsed >= bn.duration) {
          state.roundBanner = null;
        } else {
          const fadeIn = Math.min(1, elapsed / 260);
          const fadeOut = Math.min(1, (bn.duration - elapsed) / 360);
          const alpha = fadeIn * fadeOut;
          const bannerY = h * 0.36;
          const isNarrow = w < 520;
          const bw = Math.min(540, w * (isNarrow ? 0.92 : 0.86));
          const bx = (w - bw) * 0.5;
          const maxTxtW = Math.max(120, bw - 26);

          ctx.globalAlpha = alpha;
          ctx.fillStyle = 'rgba(6, 10, 24, 0.88)';
          ctx.strokeStyle = bn.color || '#38bdf8';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx, bannerY - 34, bw, 68, 14); else ctx.rect(bx, bannerY - 34, bw, 68);
          ctx.fill();
          ctx.stroke();

          ctx.font = `900 ${isNarrow ? 15 : 19}px "Lexend", sans-serif`;
          ctx.fillStyle = bn.color || '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bn.title, w * 0.5, bannerY - 9, maxTxtW);

          ctx.font = `600 ${isNarrow ? 10.5 : 11.5}px "Lexend", sans-serif`;
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(bn.sub, w * 0.5, bannerY + 15, maxTxtW);
        }
      }
      ctx.restore();
    }
  };

  // --- Main Application State ---
  const state = {
    currentWave: 1,
    currentRound: 1,
    roundPhase: 'gauntlet',
    roundNodesCaught: 0,
    roundQuota: 48,
    roundGauntletMs: 0,
    roundMinDurationMs: 45000,
    roundSubWave: 1,
    roundOverchargeBonusCount: 0,
    coreAmmo: 12,
    maxCoreAmmo: Infinity, // === CHANGED (v387): STEP 5 — Unlimited ammo collection ===
    globalScreenShake: 0,
    offenseMode: false,
    pointerFiring: false,
    touchFireHeld: false, // === CHANGED (v385): Touch-only manual fire hold state ===
    gunDeployT: 0,
    lastShotTime: 0,
    shotCounter: 0,
    muzzleFlashUntil: 0,
    playerInvulnUntil: 0,
    boss: null,
    bossBullets: [],
    bossBeams: [],
    bossShockRings: [],
    playerShots: [],
    bossHitSparks: [],
    roundBanner: null,
    active: false,
    gameType: 'math',
    score: 0,
    combo: 1,
    prevEvaluatedCombo: 1,
    tier6HatchLock: false,
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
      ? (TouchFireControls.moveMode === 'joystick'
          ? 'STEER VIA VIRTUAL JOYSTICK · SWITCH TO ON-POINT ANYTIME'
          : 'TOUCH & GLIDE ON-POINT · SWITCH TO JOYSTICK ANYTIME')
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
      roundPill: document.getElementById('cgRoundPill'),
      roundVal: document.getElementById('cgRoundVal'),
      offensePill: document.getElementById('cgOffensePill'),
      offenseVal: document.getElementById('cgOffenseVal'),
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
    if (badge) badge.style.display = 'none';

    updateHeaderUI();
    startGame(type);
  }

  function closeGame() {
    state.active = false;
    // === CHANGED (v387): Stop music, release all pointers & held keys, hide controls ===
    RealmMusicEngine.stop();
    TouchFireControls.releaseAllPointers();
    TouchFireControls.clearHeldKeys();
    TouchFireControls.syncUI();
    if (typeof OverlayRealmFX !== 'undefined') OverlayRealmFX.stop();
    document.body.classList.remove('arcade-active');
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
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

  // Centralized Combo -> Core Tier Progression Evaluator with One-Shot 50x Tier VI Hatching Lock
  function evaluateCoreTierFromCombo(now = performance.now(), allowHatch = true) {
    const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
    const c = Number.isFinite(state.combo) ? state.combo : 0;
    const prevC = Number.isFinite(state.prevEvaluatedCombo) ? state.prevEvaluatedCombo : 0;

    if (!isCoreArcade) {
      if (c >= 28) { state.coreTier = 5; state.isOverdrive = true; }
      else if (c >= 21) { state.coreTier = 4; state.isOverdrive = true; }
      else if (c >= 14) { state.coreTier = 3; state.isOverdrive = false; }
      else if (c >= 7) { state.coreTier = 2; state.isOverdrive = false; }
      else { state.coreTier = 1; state.isOverdrive = false; }
      state.prevEvaluatedCombo = c;
      return;
    }

    const nextTier = (c >= 35) ? 6 : (c >= 28 ? 5 : (c >= 21 ? 4 : (c >= 14 ? 3 : (c >= 7 ? 2 : 1))));
    if (nextTier === 6) {
      const crossedThreshold = (prevC < 35 && c >= 35);
      if (allowHatch && !state.tier6HatchLock && (crossedThreshold || (state.coreTier || 1) < 6)) {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
        const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
        if (typeof Tier6HatchSystem !== 'undefined') {
          Tier6HatchSystem.start(mMode, now);
        }
      } else {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (!allowHatch && typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
      }
    } else {
      if (state.coreTier >= 6 || c < 35) {
        if (c < 35) state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined' && c < 35) Tier6HatchSystem.cancel();
      }
      state.coreTier = nextTier;
      state.isOverdrive = (nextTier >= 4);
    }
    state.maxTierReached = Math.max(state.maxTierReached || 1, state.coreTier || 1);
    state.prevEvaluatedCombo = c;
  }

  function updateHeaderUI() {
    if (!dom.gameTitle) return;
    if (!state._uiCache) state._uiCache = {};
    const c = state._uiCache;
    const setText = (key, el, val) => {
      if (el && c[key] !== val) { c[key] = val; el.textContent = val; }
    };
    const setColor = (key, el, val) => {
      if (el && c[key] !== val) { c[key] = val; el.style.color = val; }
    };

    let nextTitle = '';
    let nextSub = '';
    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      nextTitle = state.coreTier >= 6 ? 'CHROME DYNAMO · DYNAMO PRINCESS' : (state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Crystal Twin-Cannon Maiden · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Faraday Rail-Arc Core · Round ${state.currentRound || 1}`
          : `Faraday Singularity Core · Plasma Orbs · Offense Cannon [F] · Round ${state.currentRound || 1}`);
    } else if (state.gameType === 'helix') {
      nextTitle = state.coreTier >= 6 ? 'CHROME HELIX · HELIX UNICORN' : (state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Pearlescent Spiral Pegasus · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Twin-Helix Photonic Lance · Round ${state.currentRound || 1}`
          : `Harmonic Bio-Lattice Core · Nucleotide Pearls · Offense Cannon [F] · Round ${state.currentRound || 1}`);
    } else if (state.gameType === 'meteor') {
      nextTitle = state.coreTier >= 6 ? 'CHROME METEOR · METEOR DRAGON' : (state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Hornless Caldera Wyrm · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Solar Mass-Driver Core · Round ${state.currentRound || 1}`
          : `Aegis Caldera Core · Molten Bolides · Offense Cannon [F] · Round ${state.currentRound || 1}`);
    } else if (state.gameType === 'reflex') {
      nextTitle = 'REFLEX BLITZ';
      nextSub = state.isChoosingMultiple ? 'Choose a Divisor (1 to 9) to Begin' : `Numbers Multiple Catcher · Catch 2-Digit Multiples of ${state.targetMultiple || 7}`;
    } else if (state.gameType === 'math') {
      nextTitle = 'MATH OVERDRIVE';
      nextSub = `Level ${state.mathLevel} · 20 Questions · 10 Mistakes Max`;
    } else if (state.gameType === 'memory') {
      nextTitle = 'MEMORY MATRIX';
      nextSub = '16 Radiant Pure Numbers · Sequence Reproduction (1 Mistake = Game Over)';
    }

    if (nextTitle) setText('title', dom.gameTitle, nextTitle);
    if (nextSub) setText('sub', dom.gameSub, nextSub);

    if (dom.scoreVal && c.scoreRaw !== state.score) {
      c.scoreRaw = state.score;
      dom.scoreVal.textContent = state.score.toLocaleString();
    }
    if (dom.comboVal && c.comboRaw !== state.combo) {
      c.comboRaw = state.combo;
      dom.comboVal.textContent = `${state.combo}x`;
    }
    const bestRaw = state.bestScores[state.gameType] || 0;
    if (dom.bestVal && c.bestRaw !== bestRaw) {
      c.bestRaw = bestRaw;
      dom.bestVal.textContent = bestRaw.toLocaleString();
    }

    // Round Progression & Chrome Core Offense Cannon Pills (Memoized — Zero DOM Churn!)
    const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
    if (dom.roundPill) {
      const showR = isCoreArcade ? '' : 'none';
      if (c.roundDisp !== showR) { c.roundDisp = showR; dom.roundPill.style.display = showR; }
      const isBossAlert = (state.roundPhase === 'warning' || state.roundPhase === 'boss');
      if (c.roundAlert !== isBossAlert) {
        c.roundAlert = isBossAlert;
        dom.roundPill.classList.toggle('boss-alert', isBossAlert);
      }
      const rTxt = isBossAlert ? `R${state.currentRound || 1} BOSS` : `R${state.currentRound || 1} · W${state.roundSubWave || 1}`;
      setText('roundTxt', dom.roundVal, rTxt);
      setColor('roundCol', dom.roundVal, isBossAlert ? '#fda4af' : ((state.roundSubWave === 3) ? '#fb923c' : '#c084fc'));
    }
    if (dom.offensePill) {
      const showO = isCoreArcade ? '' : 'none';
      if (c.offDisp !== showO) { c.offDisp = showO; dom.offensePill.style.display = showO; }
      // === CHANGED (v387): Reflect touch GUN role & desktop [A]/click/[F], format unlimited ammo safely ===
      const isActive = TouchFireControls.isTouch
        ? TouchFireControls.isGunHeld()
        : !!(state.pointerFiring || TouchFireControls.isDesktopKeyGunHeld());
      if (c.offAct !== isActive) {
        c.offAct = isActive;
        dom.offensePill.classList.toggle('offense-active', isActive);
      }
      const ammoCnt = Number.isFinite(state.coreAmmo) ? Math.max(0, Math.floor(state.coreAmmo)) : 0;
      const ammoStr = formatAmmoCount(ammoCnt);
      const oTxt = isActive ? `🔥 ${ammoStr}` : ammoStr;
      setText('offTxt', dom.offenseVal, oTxt);
      setColor('offCol', dom.offenseVal, isActive ? '#fde047' : (ammoCnt > 0 ? '#38bdf8' : '#64748b'));
    }
    // === CHANGED (v387): Keep touch Kimmy arc & desktop A/S/D skill HUD synced ===
    TouchFireControls.syncUI();

    // Advanced HUD: Tier, Pulse & Phase
    if (dom.tierVal && c.tierRaw !== state.coreTier) {
      c.tierRaw = state.coreTier;
      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e', 6: '#f472b6' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      if (!c.tierTitleSet) {
        c.tierTitleSet = true;
        const tierPillEl = document.getElementById('cgTierPill');
        if (tierPillEl) {
          tierPillEl.style.cursor = 'pointer';
          tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x Sovereign Overdrive), Tier V (28-34x Supreme Seraphic Ascendant), Tier VI (35x+ Mythic Cosmic Hatch — Click to Cycle Tier I→VI!)`;
          if (!tierPillEl._tierClickBound) {
            tierPillEl._tierClickBound = true;
            tierPillEl.addEventListener('click', (ev) => {
              ev.stopPropagation();
              const nextT = ((state.coreTier || 1) >= 6) ? 1 : ((state.coreTier || 1) + 1);
              const comboForTier = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 35 };
              state.combo = comboForTier[nextT] || 0;
              if (nextT < 6) state.tier6HatchLock = false;
              evaluateCoreTierFromCombo(performance.now(), true);
              updateHeaderUI();
            });
          }
        }
      }
    }
    if (dom.pulseVal) {
      const pulseStr = state.isPulseReady ? 'READY!' : `${Math.min(100, Math.floor(state.pulseMeter || 0))}%`;
      setText('pulseStr', dom.pulseVal, pulseStr);
      setColor('pulseColor', dom.pulseVal, state.isPulseReady ? '#fef08a' : '#94a3b8');
    }
    if (dom.pulsePill && c.pulseReady !== !!state.isPulseReady) {
      c.pulseReady = !!state.isPulseReady;
      dom.pulsePill.classList.toggle('pulse-ready', c.pulseReady);
    }
    const activeBuffEl = dom.buffVal;
    const activeBuffPillEl = dom.buffPill;
    if (activeBuffEl) {
      const curNow = performance.now();
      const activeBuffs = state.getAllActiveBuffs ? state.getAllActiveBuffs(curNow) : [];
      if (activeBuffs.length > 0) {
        let buffText = '';
        if (activeBuffs.length === 1) {
          const b = activeBuffs[0];
          const rem = Math.max(0, (b.expiresAt - curNow) / 1000).toFixed(1);
          buffText = `${b.icon || ''}${rem}s`;
        } else if (activeBuffs.length === 2) {
          const b1 = activeBuffs[0];
          const b2 = activeBuffs[1];
          const rem1 = Math.max(0, Math.ceil((b1.expiresAt - curNow) / 1000));
          const rem2 = Math.max(0, Math.ceil((b2.expiresAt - curNow) / 1000));
          buffText = `${b1.icon || ''}${rem1}s ${b2.icon || ''}${rem2}s`;
        } else {
          const b1 = activeBuffs[0];
          const rem1 = Math.max(0, Math.ceil((b1.expiresAt - curNow) / 1000));
          buffText = `${b1.icon || ''}${rem1}s +${activeBuffs.length - 1}`;
        }
        setText('buffText', activeBuffEl, buffText);
        if (activeBuffPillEl && (!c.buffTitleTs || curNow - c.buffTitleTs > 250)) {
          c.buffTitleTs = curNow;
          const nextBuffTitle = 'Active Surges:\n' + activeBuffs.map(b => `${b.icon || ''} ${b.name}: ${Math.max(0, (b.expiresAt - curNow) / 1000).toFixed(1)}s`).join('\n');
          if (c.buffTitle !== nextBuffTitle) { c.buffTitle = nextBuffTitle; activeBuffPillEl.title = nextBuffTitle; }
        }
        const primary = activeBuffs[0];
        setColor('buffColor', activeBuffEl, primary.color || '#38bdf8');
        const nextCls = `game-stat-pill buff-pill buff-active buff-${primary.type}`;
        if (activeBuffPillEl && c.buffCls !== nextCls) {
          c.buffCls = nextCls;
          activeBuffPillEl.className = nextCls;
        }
      } else {
        state.activeBuff = null;
        if (activeBuffPillEl && c.buffTitle !== 'Active Celestial Surge / Node Buff') {
          c.buffTitle = 'Active Celestial Surge / Node Buff';
          activeBuffPillEl.title = c.buffTitle;
        }
        if (state.isOverdrive) {
          setText('buffText', activeBuffEl, '10X');
          setColor('buffColor', activeBuffEl, '#fef08a');
          if (activeBuffPillEl && c.buffCls !== 'game-stat-pill buff-pill buff-active buff-hyper') {
            c.buffCls = 'game-stat-pill buff-pill buff-active buff-hyper';
            activeBuffPillEl.className = c.buffCls;
          }
        } else {
          setText('buffText', activeBuffEl, 'READY');
          setColor('buffColor', activeBuffEl, '#64748b');
          if (activeBuffPillEl && c.buffCls !== 'game-stat-pill buff-pill') {
            c.buffCls = 'game-stat-pill buff-pill';
            activeBuffPillEl.className = c.buffCls;
          }
        }
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // v383 PERSONALIZED REALM GAME-OVER FX ENGINE (Runs ONLY when overlay open!)
  // Translucent Holographic Glass Card Ambient Micro-Physics (0% CPU in-game!)
  // ─────────────────────────────────────────────────────────────────────────
  const OverlayRealmFX = {
    rafId: null,
    realm: null,
    motes: Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 53 + 17) % 100) / 100,
      y: ((i * 71 + 29) % 100) / 100,
      r: 1.0 + (i % 3) * 0.7,
      spd: 0.0025 + (i % 4) * 0.0014,
      phase: i * 1.43
    })),

    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.realm = null;
    },

    start(realm) {
      this.stop();
      const canvas = document.getElementById('cgOverlayFxCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      this.realm = realm;

      const tick = (now) => {
        if (!this.realm) return;
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(200, Math.round(rect.width || 460));
        const h = Math.max(200, Math.round(rect.height || 440));
        const dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
        const tw = Math.round(w * dpr);
        const th = Math.round(h * dpr);
        if (canvas.width !== tw || canvas.height !== th) {
          canvas.width = tw;
          canvas.height = th;
        }

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        if (this.realm === 'dynamo') {
          // Subtle Faraday Lichtenberg arcs along top/bottom perimeter + electric cyan/violet sparks
          const stepTick = Math.floor(now / 95);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let rail = 0; rail < 2; rail++) {
            const baseY = rail === 0 ? 18 : (h - 18);
            const segs = 12;
            ctx.beginPath();
            for (let s = 0; s <= segs; s++) {
              const f = s / segs;
              const px = 28 + (w - 56) * f;
              const jag = (s === 0 || s === segs) ? 0 : (Math.sin(stepTick * 2.9 + rail * 5.1 + s * 2.13) * 6.5);
              const py = baseY + jag;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = rail === 0 ? 'rgba(56, 189, 248, 0.34)' : 'rgba(168, 85, 247, 0.28)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(224, 242, 254, 0.30)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
          for (let i = 0; i < this.motes.length; i++) {
            const m = this.motes[i];
            const mx = ((m.x + Math.sin(now * 0.0007 + m.phase) * 0.04) * w + w) % w;
            const my = (((m.y - now * 0.00004 * (1 + i % 3)) % 1) + 1) % 1 * h;
            ctx.globalAlpha = 0.22 + 0.35 * (0.5 + 0.5 * Math.sin(now * 0.005 + m.phase));
            ctx.fillStyle = (i % 3 === 0) ? '#fde047' : (i % 2 === 0 ? '#38bdf8' : '#c084fc');
            ctx.beginPath();
            ctx.arc(mx, my, m.r, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (this.realm === 'helix') {
          // Live Translucent 3D Cyan & Magenta DNA Double-Helix Wave Undulating Across Card Backdrop
          const steps = 28;
          const speed = now * 0.0024;
          const cy = h * 0.30;
          const amp = 22;
          ctx.lineCap = 'round';
          // Subtle base-pair rungs
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 2; s < steps; s += 3) {
            const f = s / steps;
            const x = 16 + (w - 32) * f;
            const yOff = Math.sin(speed + f * Math.PI * 3.6) * amp;
            ctx.moveTo(x, cy + yOff);
            ctx.lineTo(x, cy - yOff);
          }
          ctx.stroke();
          for (let strand = -1; strand <= 1; strand += 2) {
            ctx.beginPath();
            for (let s = 0; s <= steps; s++) {
              const f = s / steps;
              const x = 16 + (w - 32) * f;
              const y = cy + Math.sin(speed + f * Math.PI * 3.6) * amp * strand;
              if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = strand > 0 ? 'rgba(34, 211, 238, 0.32)' : 'rgba(232, 121, 249, 0.32)';
            ctx.lineWidth = 2.0;
            ctx.stroke();
          }
          for (let i = 0; i < this.motes.length; i++) {
            const m = this.motes[i];
            const mx = ((m.x + Math.cos(now * 0.0006 + m.phase) * 0.05) * w + w) % w;
            const my = (((m.y - now * 0.00003 * (1 + i % 3)) % 1) + 1) % 1 * h;
            ctx.globalAlpha = 0.24 + 0.32 * (0.5 + 0.5 * Math.sin(now * 0.004 + m.phase));
            ctx.fillStyle = (i % 2 === 0) ? '#22d3ee' : '#e879f9';
            ctx.beginPath();
            ctx.arc(mx, my, m.r, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (this.realm === 'meteor') {
          // Rising Incandescent Molten Solar Embers + Subtle Bottom Thermal Glow
          const g = ctx.createLinearGradient(0, h, 0, h * 0.55);
          g.addColorStop(0.0, 'rgba(234, 88, 12, 0.26)');
          g.addColorStop(0.5, 'rgba(249, 115, 22, 0.10)');
          g.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, h * 0.55, w, h * 0.45);

          for (let i = 0; i < this.motes.length; i++) {
            const m = this.motes[i];
            const progress = (((m.y - now * 0.00008 * (1 + (i % 4) * 0.45)) % 1) + 1) % 1;
            const mx = (m.x * w) + Math.sin(now * 0.0025 + m.phase) * 14;
            const my = progress * h;
            const fade = Math.sin(progress * Math.PI);
            ctx.globalAlpha = fade * 0.45;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(mx, my, m.r * 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = fade * 0.85;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(mx, my, m.r * 0.95, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }
  };

  function startGame(type) {
    OverlayRealmFX.stop();
    TouchFireControls.releaseAllPointers();
    TouchFireControls.clearHeldKeys();
    state.active = true;
    state.score = 0;
    state.combo = 1;
    state.prevEvaluatedCombo = 1;
    state.tier6HatchLock = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    updateHeaderUI();

    // === CHANGED (v387): Start realm-specific futuristic music theme for Dynamo / Helix / Meteor ===
    if (type === 'dynamo' || type === 'realm' || type === 'helix' || type === 'meteor') {
      RealmMusicEngine.start(type === 'helix' ? 'helix' : (type === 'meteor' ? 'meteor' : 'dynamo'));
    } else {
      RealmMusicEngine.stop();
    }

    if (dom.screenOverlay) {
      dom.screenOverlay.style.display = 'none';
      dom.screenOverlay.classList.remove('oc-realm-overlay');
      dom.screenOverlay.removeAttribute('data-realm');
    }

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
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    state.tier6HatchLock = false;
    // === CHANGED (v387): Stop music, release all pointers & held keys, hide controls on Game Over ===
    RealmMusicEngine.stop();
    TouchFireControls.releaseAllPointers();
    TouchFireControls.clearHeldKeys();
    TouchFireControls.syncUI();
    clearInterval(state.mathTimer);
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // Track whether player beat their Personal Best before overwriting!
    const prevBest = state.bestScores[state.gameType] || 0;
    const isNewRecord = (state.score > prevBest && state.score > 0);
    if (isNewRecord) {
      state.bestScores[state.gameType] = state.score;
      localStorage.setItem(`oc_best_${state.gameType}`, state.score.toString());
      audio.playVictoryFanfare();
    }

    updateHeaderUI();

    if (!dom.screenOverlay) return;

    const isCoreRealm = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
    const statusChip = document.getElementById('cgGoStatusChip');
    const statusText = document.getElementById('cgGoStatusText');
    const defGlyph = document.getElementById('cgDefaultGlyph');
    const realmEmbWrap = document.getElementById('cgRealmEmblemWrap');
    const realmEmbImg = document.getElementById('cgRealmEmblemImg');
    const recBadge = document.getElementById('cgGoRecordBadge');
    const telemetry = document.getElementById('cgGoTelemetry');
    const tipEl = document.getElementById('cgGoTip');
    const quickRow = document.getElementById('cgGoQuickRow');
    const kbdHint = document.getElementById('cgGoKbdHint');

    if (isCoreRealm) {
      const rKey = (state.gameType === 'helix') ? 'helix' : (state.gameType === 'meteor' ? 'meteor' : 'dynamo');
      const REALM_DEBRIEF = {
        dynamo: {
          status: 'FARADAY CONTAINMENT BREACH · SHIELDS DEPLETED',
          title: 'FARADAY SHIELDS DEPLETED',
          emblem: 'assets/core-dynamo-t6-showcase.png?v=arcade416_relic_trails_coronation',
          ctaMain: 'RE-IGNITE CHROME DYNAMO',
          ctaSub: 'FARADAY RAIL-ARC CORE',
          btnPng: 'assets/btn-dynamo-4k.png?v=arcade384',
          btnGif: 'assets/btn-dynamo-anim.gif?v=arcade384',
          btnObj: 'assets/btn-obj-dynamo-4k.png?v=arcade384',
          scienceTip: 'Chain catches trigger Faraday Induction arcs that pull nearby Plasma Orbs closer — hold Click or press [F] to fire your Rail-Arc Cannon!'
        },
        helix: {
          status: 'BIO-LATTICE DESYNC · SHIELDS DEPLETED',
          title: 'HELIX SHIELDS DEPLETED',
          emblem: 'assets/core-helix-t6-showcase.png?v=arcade416_relic_trails_coronation',
          ctaMain: 'RE-SEQUENCE CHROME HELIX',
          ctaSub: 'PHOTONIC DNA LATTICE',
          btnPng: 'assets/btn-helix-4k.png?v=arcade384',
          btnGif: 'assets/btn-helix-anim.gif?v=arcade384',
          btnObj: 'assets/btn-obj-helix-4k.png?v=arcade384',
          scienceTip: 'Consecutive clean Nucleotide catches stabilize Base-Pair Resonance — unload your Twin-Helix Photonic Lance [F] during Boss telegraph gaps!'
        },
        meteor: {
          status: 'AEGIS CALDERA CRITICAL · SHIELDS DEPLETED',
          title: 'CALDERA SHIELDS DEPLETED',
          emblem: 'assets/core-meteor-t6-showcase.png?v=arcade416_relic_trails_coronation',
          ctaMain: 'RE-LAUNCH CHROME METEOR',
          ctaSub: 'AEGIS SOLAR CALDERA',
          btnPng: 'assets/btn-meteor-4k.png?v=arcade384',
          btnGif: 'assets/btn-meteor-anim.gif?v=arcade384',
          btnObj: 'assets/btn-obj-meteor-4k.png?v=arcade384',
          scienceTip: 'Solar Mass-Driver shots splash adjacent Boss Shield Pylons — graze incoming hazards to charge Flux Pulse [Space] for 15-dmg Boss burst!'
        }
      };
      const cfg = REALM_DEBRIEF[rKey];
      const rnd = state.currentRound || 1;
      const peakTier = Math.max(state.maxTierReached || 1, state.coreTier || 1);
      const peakCombo = Math.max(state.maxComboReached || 1, state.combo || 1);
      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI' }[peakTier] || 'TIER I';
      const nodesCaught = state.nodesCaughtTotal || 0;
      const bossesSlain = state.bossesDefeated || 0;

      // Calculate Combat Sortie Rank (S+ / S / A / B / C)
      let grade = 'C', gradeCls = 'oc-go-grade-c';
      if (rnd >= 5 || state.score >= 50000 || bossesSlain >= 4 || peakTier >= 6) { grade = 'S+'; gradeCls = 'oc-go-grade-splus'; }
      else if (rnd >= 3 || state.score >= 22000 || peakTier >= 5 || bossesSlain >= 2) { grade = 'S'; gradeCls = 'oc-go-grade-s'; }
      else if (rnd >= 2 || state.score >= 9000 || peakTier >= 4 || bossesSlain >= 1) { grade = 'A'; gradeCls = 'oc-go-grade-a'; }
      else if (state.score >= 3000 || peakTier >= 2 || nodesCaught >= 10) { grade = 'B'; gradeCls = 'oc-go-grade-b'; }

      // Contextual Boss Near-Miss / Tactical Debrief Message
      let debriefSub = desc;
      let bossSubTxt = bossesSlain > 0 ? `${bossesSlain} BOSS${bossesSlain > 1 ? 'ES' : ''} SLAIN` : `W${state.roundSubWave || 1}/3 · ${state.roundNodesCaught || 0}/${state.roundQuota || 48}`;
      let tacticalTipHtml = `<strong>TACTICAL DEBRIEF:</strong> ${cfg.scienceTip}`;

      if (state.boss && state.boss.phase !== 'defeated') {
        const remHp = Math.ceil(state.boss.hp);
        const maxHp = state.boss.maxHp;
        debriefSub = `Overwhelmed by Round ${rnd} Boss ${state.boss.name} with ${remHp} / ${maxHp} HP remaining.`;
        bossSubTxt = `BOSS ${remHp}/${maxHp} HP`;
        if (remHp <= Math.ceil(maxHp * 0.30)) {
          tacticalTipHtml = `<strong>SO CLOSE!</strong> Only <strong>${remHp} HP</strong> left on ${state.boss.name} — save Flux Pulse <strong>[SPACE]</strong> to clear bullets &amp; deal 15 burst damage!`;
        } else if ((state.coreAmmo || 0) >= 12) {
          const arsTip = getRealmArsenal(state.catcherType);
          tacticalTipHtml = `<strong>UNUSED ARSENAL:</strong> You fell with <strong>${formatAmmoCount(state.coreAmmo)} shots</strong> loaded — fire <strong>${arsTip.gun}</strong> and unleash <strong>${arsTip.skill2}</strong> / <strong>${arsTip.ult}</strong>!`;
        } else if (state.boss.pylons && state.boss.pylons.some(p => p.hp > 0)) {
          tacticalTipHtml = `<strong>ARMOR BREAK TIP:</strong> Destroy ${state.boss.name}'s orbiting hexagonal Shield Pylons first for <strong>1.5× Crit</strong> + <strong>+8 Bonus Ammo</strong>!`;
        }
      } else {
        debriefSub = `Containment lost during Round ${rnd} Wave ${state.roundSubWave || 1}/3 (${state.roundNodesCaught || 0}/${state.roundQuota || 48} nodes to Boss).`;
      }

      dom.screenOverlay.classList.add('oc-realm-overlay');
      dom.screenOverlay.setAttribute('data-realm', rKey);
      if (statusChip) statusChip.style.display = 'inline-flex';
      if (statusText) statusText.textContent = cfg.status;
      if (defGlyph) defGlyph.style.display = 'none';
      if (realmEmbWrap) {
        realmEmbWrap.style.display = 'flex';
        realmEmbWrap.classList.add('oc-showcase-stage');
      }
      if (realmEmbImg) realmEmbImg.src = cfg.emblem;
      if (recBadge) recBadge.classList.toggle('show', isNewRecord);
      if (telemetry) telemetry.style.display = 'grid';
      if (tipEl) { tipEl.style.display = 'block'; tipEl.innerHTML = tacticalTipHtml; }
      if (quickRow) {
        quickRow.style.display = 'flex';
        quickRow.querySelectorAll('[data-switch-realm]').forEach((btn) => {
          const targetR = btn.getAttribute('data-switch-realm');
          btn.classList.toggle('oc-go-hidden', targetR === rKey);
          btn.onclick = () => openGame(targetR);
        });
        const exitBtn = document.getElementById('cgGoExitBtn');
        if (exitBtn) exitBtn.onclick = closeGame;
      }
      if (kbdHint) kbdHint.style.display = 'block';

      const setEl = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
      setEl('cgGoScore', state.score.toLocaleString());
      setEl('cgGoBestSub', `BEST ${(state.bestScores[state.gameType] || 0).toLocaleString()}`);
      setEl('cgGoRound', `R${rnd}`);
      setEl('cgGoBossSub', bossSubTxt);
      setEl('cgGoTier', tierRoman);
      setEl('cgGoComboSub', `MAX ${peakCombo}x`);
      const gradeEl = document.getElementById('cgGoGrade');
      if (gradeEl) {
        gradeEl.textContent = grade;
        gradeEl.className = `oc-go-stat-val ${gradeCls}`;
      }
      setEl('cgGoNodesSub', `${nodesCaught} NODES`);

      dom.screenTitle.textContent = cfg.title;
      dom.screenDesc.textContent = debriefSub;
      dom.btnStartAction.classList.add('oc-go-cta-4k');
      dom.btnStartAction.innerHTML = `
        <img class="oc-go-btn-art-png" src="${cfg.btnPng}" alt="" aria-hidden="true" />
        <img class="oc-go-btn-art-gif" src="${cfg.btnGif}" alt="" aria-hidden="true" />
        <span class="oc-go-btn-scrim" aria-hidden="true"></span>
        <span class="oc-go-btn-obj-wrap" aria-hidden="true">
          <span class="oc-go-btn-obj-ring"></span>
          <img class="oc-go-btn-obj" src="${cfg.btnObj}" alt="" />
        </span>
        <span class="oc-go-btn-text-wrap">
          <span class="oc-go-btn-main-txt">${cfg.ctaMain}</span>
          <span class="oc-go-btn-sub-txt">${cfg.ctaSub}</span>
        </span>
        <span class="oc-go-btn-chevron" aria-hidden="true">»</span>
      `;
      dom.btnStartAction.onclick = () => startGame(state.gameType);
      dom.screenOverlay.style.display = 'flex';
      OverlayRealmFX.start(rKey);
    } else {
      // Standard clean overlay for Math Overdrive, Reflex Blitz, and Memory Matrix
      OverlayRealmFX.stop();
      dom.screenOverlay.classList.remove('oc-realm-overlay');
      dom.screenOverlay.removeAttribute('data-realm');
      dom.btnStartAction.classList.remove('oc-go-cta-4k');
      if (statusChip) statusChip.style.display = 'none';
      if (defGlyph) defGlyph.style.display = 'block';
      if (realmEmbWrap) realmEmbWrap.style.display = 'none';
      if (recBadge) recBadge.classList.remove('show');
      if (telemetry) telemetry.style.display = 'none';
      if (tipEl) tipEl.style.display = 'none';
      if (quickRow) quickRow.style.display = 'none';
      if (kbdHint) kbdHint.style.display = 'none';

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
    targetCatcherY = (TouchFireControls.isTouch || deviceInputMode === 'touch') ? 0.68 : 0.82;
    currentCatcherY = targetCatcherY;
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

    // The 5+1 Advanced Features State (Tiers I - VI)
    state.coreTier = 1; // Tier I, II, III, IV, V, VI
    state.tier6HatchLock = false;
    state.prevEvaluatedCombo = state.combo || 1;
    state.consecutivePerfects = 0;
    state.pulseMeter = 0; // 0 to 100
    state.isPulseReady = false;
    state.activeBuffs = {};
    state.activeBuff = null; // Active Celestial Surge / Power Buff
    state.resonanceChain = 0;

    state.currentWave = 1;
    CoreKinematics.reset();
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
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
    RoundBossEngine.reset(performance.now());
    TouchFireControls.syncUI();
    state._testedBoss = false;
    state._testedWave = false;
    state._testedAmmoStandalone = false;
    state._testedVoidbloom = false;
    state._testedGameOver = false;

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
      if (badge) badge.style.display = 'none';
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
    if (state.gameType !== 'reflex') {
      dom.transmuteIndicator.style.display = 'none';
      return;
    }
    const reflexMorphLabels = {
      realm: '⚡ CORE TRANSMUTED: CHROME DYNAMO (Catch Synapse Waves!)',
      dynamo: '⚡ CORE TRANSMUTED: CHROME DYNAMO (Catch Synapse Waves!)',
      helix: '⚡ CORE TRANSMUTED: CHROME HELIX (Catch Dual-Strands!)',
      meteor: '⚡ CORE TRANSMUTED: CHROME METEOR (Deflect Molten Asteroids!)'
    };
    dom.transmuteIndicator.textContent = reflexMorphLabels[state.catcherType] || 'ACTIVE CORE';
    dom.transmuteIndicator.className = `transmute-badge transmute-${state.catcherType}`;
  }

  let cachedCanvasRect = { left: 0, top: 0, width: 0, height: 0 };
  let cachedCanvasDpr = 1;
  function getRenderDpr() {
    return Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
  }

  function resizeCanvas() {
    if (!dom.canvasReflex) return;
    const dpr = getRenderDpr();
    cachedCanvasDpr = dpr;
    dom.canvasReflex._renderDpr = dpr;
    const rect = dom.canvasReflex.getBoundingClientRect();
    const w = rect.width > 10 ? rect.width : window.innerWidth;
    const h = rect.height > 10 ? rect.height : (window.innerHeight - 56);
    cachedCanvasRect = { left: rect.left, top: rect.top, width: w, height: h };
    const targetW = Math.max(320, Math.round(w * dpr));
    const targetH = Math.max(240, Math.round(h * dpr));
    if (dom.canvasReflex.width !== targetW || dom.canvasReflex.height !== targetH) {
      dom.canvasReflex.width = targetW;
      dom.canvasReflex.height = targetH;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LUXURY OLED COSMIC SPACE ATMOSPHERE (v381 ZERO-LAG GPU CACHE)
  // Pre-baked 256×256 Offscreen Nebula Blit + Zero-Alloc Starfield
  // ─────────────────────────────────────────────────────────────
  const COSMIC_STARS = Array.from({ length: 28 }, (_, i) => ({
    x: ((i * 73 + 19) % 1000) / 1000,
    y: ((i * 97 + 37) % 1000) / 1000,
    baseR: 0.6 + (i % 3) * 0.45,
    freq: 0.0018 + (i % 5) * 0.0009,
    phase: i * 1.37
  }));

  const CosmicNebulaCache = {};
  function _getCosmicNebulaSprite(mode) {
    const key = mode === 'helix' ? 'helix' : (mode === 'dynamo' ? 'dynamo' : 'meteor');
    if (CosmicNebulaCache[key]) return CosmicNebulaCache[key];
    const sz = 256;
    const c = document.createElement('canvas');
    c.width = sz;
    c.height = sz;
    const gctx = c.getContext('2d');
    if (gctx) {
      const half = sz * 0.5;
      const g1 = gctx.createRadialGradient(half, half, 4, half, half, half);
      if (key === 'helix') {
        g1.addColorStop(0.0, 'rgba(34, 211, 238, 0.042)');
        g1.addColorStop(0.45, 'rgba(232, 121, 249, 0.024)');
        g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
      } else if (key === 'dynamo') {
        g1.addColorStop(0.0, 'rgba(56, 189, 248, 0.042)');
        g1.addColorStop(0.45, 'rgba(168, 85, 247, 0.024)');
        g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
      } else {
        g1.addColorStop(0.0, 'rgba(249, 115, 22, 0.042)');
        g1.addColorStop(0.45, 'rgba(234, 88, 12, 0.024)');
        g1.addColorStop(1.0, 'rgba(3, 3, 8, 0)');
      }
      gctx.fillStyle = g1;
      gctx.fillRect(0, 0, sz, sz);
    }
    CosmicNebulaCache[key] = c;
    return c;
  }

  function renderLuxuryCosmicBackground(ctx, w, h, mode, now) {
    // 1. Pre-baked GPU Nebula Blit (Zero per-frame radial gradient allocation!)
    const driftX = Math.sin(now * 0.0004) * 45;
    const driftY = Math.cos(now * 0.0003) * 35;
    const nebR = Math.max(w, h) * 0.65;
    const nebSpr = _getCosmicNebulaSprite(mode);

    ctx.save();
    ctx.drawImage(nebSpr, (w * 0.5 + driftX) - nebR, (h * 0.35 + driftY) - nebR, nebR * 2, nebR * 2);

    // 2. Anti-aliased micro-stars & diamond stardust (Zero string allocations!)
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < COSMIC_STARS.length; i++) {
      const s = COSMIC_STARS[i];
      const sx = s.x * w;
      const sy = s.y * h;
      const sinV = 0.5 + 0.5 * Math.sin(now * s.freq + s.phase);
      const tw = sinV * sinV;
      ctx.globalAlpha = 0.15 + 0.55 * tw;
      const r = s.baseR * (0.85 + 0.35 * tw);
      ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || (state.gameType !== 'reflex' && state.gameType !== 'realm' && state.gameType !== 'dynamo' && state.gameType !== 'helix' && state.gameType !== 'meteor')) return;

    const ctx = dom.canvasReflex?.getContext('2d');
    if (!ctx) return;

    if (cachedCanvasRect.width < 10 || dom.canvasReflex.width < 10) {
      resizeCanvas();
    }
    const dpr = cachedCanvasDpr || getRenderDpr();
    const w = dom.canvasReflex.width / dpr;
    const h = dom.canvasReflex.height / dpr;

    try {
      ctx.save();
      ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
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
    const joyDt = Math.min(0.05, Math.max(0.004, (timestamp - (state._lastJoyTs || timestamp - 16)) / 1000));
    state._lastJoyTs = timestamp;
    if (TouchFireControls.isTouch && TouchFireControls.moveMode === 'joystick' && TouchFireControls.joyState.active && TouchFireControls.joyState.mag > 0) {
      const j = TouchFireControls.joyState;
      const speedCurve = Math.pow(j.mag, 0.78);
      const maxSpd = isEmpSlowed ? 480 : (CONFIG.ui.joyMaxSpeedPx || 940);
      const spdPx = maxSpd * speedCurve * joyDt;
      targetCatcherX = Math.max(0.04, Math.min(0.96, targetCatcherX + (j.ux * spdPx) / Math.max(320, w)));
      targetCatcherY = Math.max(0.06, Math.min(0.94, targetCatcherY + (j.uy * spdPx) / Math.max(320, h)));
      currentCatcherX = targetCatcherX;
      currentCatcherY = targetCatcherY;
    } else if (deviceInputMode === 'touch') {
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

    // Cellphone & Mobile Safe-Area Inset + Complete-Wings Viewport Clamping (v402):
    const isTouchEnv = (deviceInputMode === 'touch');
    const isCoarse = isTouchEnv || window.innerWidth <= 768;
    const catcherBottomMargin = isCoarse ? Math.max(185, Math.round(h * 0.24)) : Math.max(160, Math.round(h * 0.26));
    const clampTier = Math.max(state.coreTier || 1, (CoreKinematics && CoreKinematics.continuousTier) ? CoreKinematics.continuousTier : 1);
    const clampedPos = CoreGeometryDB.clampCatcherPosition(
      currentCatcherX * w,
      currentCatcherY * h,
      w,
      h,
      clampTier,
      isTouchEnv,
      state.gameType === 'reflex',
      catcherBottomMargin
    );
    let catcherPixelX = clampedPos.x;
    if (state.prevCatcherPixelX !== null) {
      state.catcherVelocity = catcherPixelX - state.prevCatcherPixelX;
    }
    state.prevCatcherPixelX = catcherPixelX;
    const catcherPixelY = clampedPos.y;

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

      // Outer Glow (Zero-Lag Double-Stroke — Zero shadowBlur!)
      ctx.beginPath();
      ctx.roundRect(paddleX - 3, paddleY - 3, paddleW + 6, paddleH + 6, 16);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(paddleX, paddleY, paddleW, paddleH, 13);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.30)';
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

        // Cyber Capsule Outer Glow (Zero-Lag Halo — Zero shadowBlur!)
        const capsuleW = 58;
        const capsuleH = 38;
        const isValidMult = (p.num % D === 0);
        ctx.beginPath();
        ctx.roundRect(-capsuleW / 2 - 3, -capsuleH / 2 - 3, capsuleW + 6, capsuleH + 6, 15);
        ctx.fillStyle = isValidMult ? 'rgba(56, 189, 248, 0.22)' : 'rgba(168, 85, 247, 0.18)';
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(-capsuleW / 2, -capsuleH / 2, capsuleW, capsuleH, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = isValidMult ? '#38bdf8' : 'rgba(192, 132, 252, 0.7)';
        ctx.stroke();

        // 2-Digit Number Text
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

      // Calculate Core Evolution Tier (Tiers I-V @ 0/7/14/21/28, Tier VI Hatch @ 50x)
      evaluateCoreTierFromCombo(now, true);

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

        // Multi-Axis Round & 3-Act Sub-Wave Escalation: Smoothly intensifies speed & hazard depth every Wave & Round!
        const rnd = state.currentRound || 1;
        const subWave = state.roundSubWave || 1;
        const waveSpeedMult = (subWave === 3) ? 1.15 : (subWave === 2 ? 1.08 : 1.0);
        const speedComboBonus = (1.0 + Math.min(0.45, (state.combo - 1) * 0.016 + (rnd - 1) * 0.10)) * waveSpeedMult;
        const actualSpeed = baseSpeed * normFactor * speedComboBonus;

        // Balanced Hazard Spawning: Scales smoothly across Round & Sub-Wave (Wave 3 adds peak pre-boss pressure!)
        const baseMaxHazards = (rnd >= 4) ? 3 : ((rnd >= 2 || state.combo >= 5) ? 2 : 1);
        const maxHazards = Math.min(4, baseMaxHazards + (subWave === 3 ? 1 : 0));
        const currentHazards = state.particles.filter(pt => isHazardNode(pt.nodeClass)).length;

        // Dynamic hazard chance scales across Round & Sub-Wave (15% R1 W1 -> 30% R5+ W3); paused during active Caldera Nova
        const waveHazBonus = (subWave === 3) ? 0.06 : (subWave === 2 ? 0.03 : 0.0);
        const hazardChance = Math.min(0.30, 0.15 + (rnd - 1) * 0.025 + waveHazBonus);
        const canSpawnHazard = (!SkillSystem.activeNova && currentHazards < maxHazards && elapsedSec > 2.6 && Math.random() < hazardChance);

        let nClass = 'standard';

        if (canSpawnHazard) {
          // Balanced Hazard Ratio: 60% Regular Bad Nodes ('volatile') vs 40% Powered Feature Bad Nodes (Progressive Unlock Per Round!)
          const rHaz = Math.random();
          if (rHaz < 0.60) {
            nClass = 'volatile'; // Classic Normal Bad Node (60% — clearly outnumbers powered hazards)
          } else if (rnd === 1) {
            // Round 1 introduces Hyper-Comet & Corruptor Laser cleanly (plus Gravity Well in Wave 3 Apex!)
            nClass = (subWave === 3 && rHaz >= 0.88) ? 'gravity_well' : ((rHaz < 0.80) ? 'hyper_comet' : 'corruptor_laser');
          } else if (rnd === 2) {
            // Round 2 unlocks Gravity Well alongside Hyper-Comet & Corruptor!
            nClass = (rHaz < 0.74) ? 'hyper_comet' : (rHaz < 0.88 ? 'corruptor_laser' : 'gravity_well');
          } else if (rHaz < 0.68) {
            nClass = 'hyper_comet'; // Feature #1: Inferno Hyper-Comet
          } else if (rHaz < 0.76) {
            nClass = 'corruptor_laser'; // Feature #2: Corruptor Overlord
          } else if (rHaz < 0.83) {
            nClass = 'gravity_well'; // Feature #3: Event-Horizon Singularity
          } else if (rHaz < 0.90) {
            nClass = 'emp_detonator'; // Feature #4: Overload EMP Shock-Mine
          } else if (rHaz < 0.96) {
            nClass = 'phase_stalker'; // Feature #5: Quantum Blink Stalker
          } else if (rHaz < 0.98) {
            nClass = 'seeker';
          } else {
            nClass = 'fragmentation';
          }
          if (!state._hazardStats) state._hazardStats = { regular: 0, powered: 0, byClass: {} };
          if (nClass === 'volatile') state._hazardStats.regular++;
          else state._hazardStats.powered++;
          state._hazardStats.byClass[nClass] = (state._hazardStats.byClass[nClass] || 0) + 1;
          window.__CHROME_ARCADE_HAZARD_STATS__ = state._hazardStats;
        } else {
          // Balanced Falling Node Archetypes (Standard Nodes + Tactical Power-Ups, boosted slightly in Wave 3 Apex!)
          const rNode = Math.random();
          const isCriticalLife = (state.reflexLives <= 1);
          const pBoost = (subWave === 3) ? 1.25 : 1.0;
          if (isCriticalLife && rNode < 0.10) {
            nClass = 'catalyst'; // Critical Pity: Emergency Life Recovery Node (10% when on last life)
          } else if (rNode < 0.025 * pBoost) {
            nClass = 'shield'; // 5-Second Aegis Forcefield Shield
          } else if (rNode < 0.050 * pBoost) {
            nClass = 'missiles'; // Live Seeking Micro-Missiles
          } else if (rNode < 0.075 * pBoost) {
            nClass = 'cluster'; // Bifurcation Flux Node ("Cluster Doubler")
          } else if (rNode < 0.100 * pBoost) {
            nClass = 'supercharge'; // Supercharged Hyper-Node (Supernova)
          } else if (rNode < 0.120 * pBoost) {
            nClass = 'chronos'; // Chronos Stasis Pearl (Bullet-Time)
          } else if (rNode < 0.140 * pBoost) {
            nClass = 'singularity'; // Graviton Singularity Node (Magnetic Vacuum)
          } else if (rNode < 0.160 * pBoost) {
            nClass = (state.reflexLives >= 3) ? 'standard' : 'catalyst'; // Ascension Catalyst Star (+1 Life)
          } else {
            nClass = 'standard'; // Dominant Standard Target Nodes
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

      // Advance Deterministic Dual-Gated 3-Act Wave Gauntlet Timer (tab-switch proof via clamped dt!)
      if (state.roundPhase === 'gauntlet') {
        RoundBossEngine.tickGauntletPacing(dt, now, w);
      }

      // Immediate spawn at t = 0s:
      if (state.totalNodesSpawned === 0) {
        spawnNode(1.95);
      }

      // 3-Act Wave-Aware Spawn Cadence Engine (Vanguard -> Surge -> Apex Assault):
      let shouldSpawn = false;
      let nextBaseSpeed = 2.00;
      const rndNow = state.currentRound || 1;
      const subWaveNow = state.roundSubWave || 1;
      const roundElapsedSec = (state.roundGauntletMs || 0) / 1000;

      // Sync internal intensity wave cleanly for Blink Stalkers & score milestones
      const calculatedWave = Math.min(10, (rndNow - 1) * 2 + subWaveNow);
      if (calculatedWave > state.currentWave) {
        state.currentWave = calculatedWave;
      }

      if (rndNow === 1 && roundElapsedSec < 5.0) {
        // Gentle Round 1 opening warm-up (5 seconds)
        const interval = 740;
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < 3) {
          shouldSpawn = true;
          nextBaseSpeed = 1.92 + Math.random() * 0.28;
        }
      } else if (subWaveNow === 1) {
        // ACT 1 · WAVE 1/3 — VANGUARD (Rhythmic build-up, combo & cannon charging)
        const interval = Math.max(460, 640 - (rndNow - 1) * 30);
        const maxConcurrent = Math.min(5, 4 + Math.floor((rndNow - 1) / 2));
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < maxConcurrent) {
          shouldSpawn = true;
          nextBaseSpeed = 2.05 + (rndNow - 1) * 0.12 + Math.random() * 0.30;
        }
      } else if (subWaveNow === 2) {
        // ACT 2 · WAVE 2/3 — SURGE (Tighter tempo, escalating hazards)
        const interval = Math.max(400, 530 - (rndNow - 1) * 28);
        const maxConcurrent = Math.min(6, 5 + Math.floor((rndNow - 1) / 3));
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < maxConcurrent) {
          shouldSpawn = true;
          nextBaseSpeed = 2.20 + (rndNow - 1) * 0.14 + Math.random() * 0.32;
        }
      } else {
        // ACT 3 · WAVE 3/3 — APEX ASSAULT (High-energy pre-boss crescendo!)
        const isBurstBeat = (state.totalNodesSpawned % 4 === 2);
        const baseInt = Math.max(360, 450 - (rndNow - 1) * 24);
        const interval = isBurstBeat ? Math.max(290, baseInt - 90) : baseInt;
        const maxConcurrent = Math.min(6, 5 + Math.floor(rndNow / 2));
        if ((now - state.lastSpawnTime) >= interval && state.particles.length < maxConcurrent) {
          shouldSpawn = true;
          nextBaseSpeed = 2.34 + (rndNow - 1) * 0.15 + Math.random() * 0.35;
        }
      }

      // Boss-Phase Flank Ammo Supply Dropper (Guarantees Player Can Always Catch Good Nodes to Reload!)
      function spawnBossSupplyNode(bossX) {
        const pType = (state.gameType === 'realm') ? 'dynamo' : state.gameType;
        const leftSpace = bossX > w * 0.5;
        const laneX = leftSpace
          ? (w * 0.14 + Math.random() * (w * 0.24))
          : (w * 0.62 + Math.random() * (w * 0.24));
        const rPow = Math.random();
        let supClass = 'standard';
        if (state.reflexLives <= 1 && rPow < 0.14) supClass = 'catalyst';
        else if (rPow < 0.08) supClass = 'shield';
        else if (rPow < 0.15) supClass = 'missiles';
        else if (rPow < 0.21) supClass = 'supercharge';
        const headR = supClass === 'standard' ? 26 : 30;
        const sp = [];
        for (let j = 0; j < 6; j++) sp.push({ x: laneX, y: -30 - j * 8 });
        state.particles.push({
          type: pType,
          nodeClass: supClass,
          x: laneX,
          y: -30,
          vx: 0,
          speed: 2.35 * normFactor,
          headR: headR,
          spine: sp,
          stardust: [],
          animPhase: Math.random() * Math.PI * 2,
          tumbleDir: Math.random() < 0.5 ? 1 : -1
        });
      }

      if (shouldSpawn && state.roundPhase === 'gauntlet') {
        spawnNode(nextBaseSpeed);
      }

      // TEST HARNESS: WAVE / OVERCHARGE PACING VERIFICATION (?test_wave=2|3 or ?test_overcharge=1)
      if (window.location.search.includes('test_wave=') || window.location.search.includes('test_overcharge=1')) {
        if (!state._testedWave) {
          state._testedWave = true;
          if (window.location.search.includes('test_overcharge=1')) {
            // Quota already met with 3 seconds remaining on Boss approach timer -> verifies Overcharge countdown -> Boss Warning -> Boss Spawn!
            state.roundNodesCaught = state.roundQuota;
            state.roundGauntletMs = Math.max(0, state.roundMinDurationMs - 3000);
            state.roundSubWave = 3;
            state.coreAmmo = 64;
            updateHeaderUI();
          } else {
            const mW = window.location.search.match(/test_wave=(\d+)/);
            const targetW = mW ? parseInt(mW[1], 10) : 2;
            if (targetW === 2) {
              state.roundNodesCaught = Math.ceil(state.roundQuota * 0.34);
              state.roundGauntletMs = Math.ceil(state.roundMinDurationMs * 0.34);
              RoundBossEngine.tickGauntletPacing(0, now, w);
            } else if (targetW === 3) {
              state.roundSubWave = 2;
              state.roundNodesCaught = Math.ceil(state.roundQuota * 0.68);
              state.roundGauntletMs = Math.ceil(state.roundMinDurationMs * 0.68);
              RoundBossEngine.tickGauntletPacing(0, now, w);
            }
          }
        }
      }

      // TEST HARNESS: DIRECT BOSS SHOWDOWN (?test_boss=1 .. ?test_boss=5) + UNLIMITED AMMO (?test_ammo=N)
      if (window.location.search.includes('test_boss=')) {
        if (!state._testedBoss) {
          state._testedBoss = true;
          const mBoss = window.location.search.match(/test_boss=(\d+)/);
          const bRound = mBoss ? Math.max(1, Math.min(5, parseInt(mBoss[1], 10) || 1)) : 1;
          const mAmmo = window.location.search.match(/test_ammo=(\d+)/);
          state.currentRound = bRound;
          // === CHANGED (v387): No 150 cap on ammo even in QA harness (supports >1,000 and >100,000 tests!) ===
          state.coreAmmo = mAmmo ? Math.max(0, parseInt(mAmmo[1], 10)) : 72;
          state.offenseMode = false;
          state.roundBanner = null;
          RoundBossEngine.spawnBoss(bRound, now, w, h, true);
          spawnBossSupplyNode(w * 0.5);
          updateHeaderUI();
        }
      } else if (window.location.search.includes('test_ammo=')) {
        if (!state._testedAmmoStandalone) {
          state._testedAmmoStandalone = true;
          const mAmmo = window.location.search.match(/test_ammo=(\d+)/);
          if (mAmmo) {
            state.coreAmmo = Math.max(0, parseInt(mAmmo[1], 10));
            updateHeaderUI();
          }
        }
      }

      // TEST HARNESS: VOIDBLOOM NODE SHOWCASE (?test_voidbloom=1) + MULTI-HAZARD NOVA QA (?test_hazards=1)
      if (window.location.search.includes('test_voidbloom=1')) {
        if (!state._testedVoidbloom) {
          state._testedVoidbloom = true;
          VoidbloomEngine.scheduleTelegraph(w, h, catcherPixelX, now, w * 0.28);
          VoidbloomEngine.spawnDirect(w * 0.68, h * 0.34, 3.4, w, h);
        }
      }
      if (window.location.search.includes('test_hazards=1')) {
        if (!state._testedHazards) {
          state._testedHazards = true;
          const pMode = (state.gameType === 'realm') ? 'dynamo' : (state.gameType || 'meteor');
          const specs = [
            { cls: 'volatile', x: w * 0.20, y: h * 0.42, r: 28 },
            { cls: 'hyper_comet', x: w * 0.38, y: h * 0.36, r: 29 },
            { cls: 'corruptor_laser', x: w * 0.62, y: h * 0.38, r: 32 },
            { cls: 'gravity_well', x: w * 0.80, y: h * 0.44, r: 33 }
          ];
          specs.forEach((sp) => {
            const spine = [];
            for (let j = 0; j < 8; j++) spine.push({ x: sp.x, y: sp.y - j * 8 });
            state.particles.push({
              type: pMode, nodeClass: sp.cls, x: sp.x, y: sp.y, vx: 0, speed: 0.75, baseSpeed: 1.5,
              headR: sp.r, hasSplit: false, hasDetonated: false, hasGrazed: false, phantomAlpha: 1.0,
              animPhase: 0, tumbleDir: 1, cometPhase: sp.cls === 'hyper_comet' ? 'charging' : null,
              cometChargeEnd: now + 3500, cometDiveSpeed: 4.5, flameEmbers: [],
              laserState: 'idle', laserCharge: 0, laserChargeStart: 0, laserTargets: [], laserSalvosLeft: 2, laserNextReady: now + 2200,
              empCharge: 0, empNextPulse: now + 3000, blinkState: 'idle', blinkProgress: 0, blinkStartTime: 0,
              blinkTargetX: sp.x, blinkTargetY: sp.y, blinksLeft: 1, spine, stardust: []
            });
          });
        }
      }

      // TEST HARNESS: PERSONALIZED TRANSLUCENT GAME OVER MODAL (?test_gameover=1)
      if (window.location.search.includes('test_gameover=1')) {
        if (!state._testedGameOver) {
          state._testedGameOver = true;
          state.score = 18450;
          state.maxComboReached = 24;
          state.maxTierReached = 4;
          state.nodesCaughtTotal = 39;
          state.bossesDefeated = (state.currentRound || 1) > 1 ? ((state.currentRound || 1) - 1) : 1;
          setTimeout(() => {
            if (state.active) {
              if (state.boss) state.boss.hp = Math.max(12, Math.round(state.boss.maxHp * 0.18));
              handleGameOver('SHIELDS DEPLETED', 'Simulated containment breach for visual QA.');
            }
          }, 950);
        }
      }

      // Check if any non-volatile node is inside the magnetic horizon for Iris Lock-On
      const tierHitBonusPre = (state.coreTier - 1) * 12;
      const gravRadiusPre = 130 + tierHitBonusPre;
      const isCoreLockedOn = state.particles.some(pt => !isHazardNode(pt.nodeClass) && Math.hypot(catcherPixelX - pt.x, catcherPixelY - pt.y) < gravRadiusPre);

      // ─────────────────────────────────────────────────────────────
      // TEST HARNESS: LIVE 5 FEATURE BAD NODES, CORRUPTOR LASER & MISSILE SHOWCASE
      // ─────────────────────────────────────────────────────────────
      if (window.location.search.includes('test_powerups=1')) {
        if (!state._testedPowerups) {
          state._testedPowerups = true;
          const pMode = (state.catcherType === 'realm') ? 'dynamo' : (state.catcherType || 'dynamo');
          state.particles = [
            { type: pMode, nodeClass: 'shield', x: w * 0.08, y: h * 0.46, vx: 0, speed: 0, headR: 29, spine: [], stardust: [], animPhase: 0.2, tumbleDir: 1 },
            { type: pMode, nodeClass: 'missiles', x: w * 0.19, y: h * 0.46, vx: 0, speed: 0, headR: 30, spine: [], stardust: [], animPhase: 0.8, tumbleDir: -1 },
            { type: pMode, nodeClass: 'cluster', x: w * 0.30, y: h * 0.46, vx: 0, speed: 0, headR: 28, spine: [], stardust: [], animPhase: 1.4, tumbleDir: 1 },
            { type: pMode, nodeClass: 'supercharge', x: w * 0.41, y: h * 0.46, vx: 0, speed: 0, headR: 30, spine: [], stardust: [], animPhase: 2.0, tumbleDir: -1 },
            { type: pMode, nodeClass: 'chronos', x: w * 0.52, y: h * 0.46, vx: 0, speed: 0, headR: 25, spine: [], stardust: [], animPhase: 2.6, tumbleDir: 1 },
            { type: pMode, nodeClass: 'singularity', x: w * 0.63, y: h * 0.46, vx: 0, speed: 0, headR: 27, spine: [], stardust: [], animPhase: 3.2, tumbleDir: -1 },
            { type: pMode, nodeClass: 'catalyst', x: w * 0.74, y: h * 0.46, vx: 0, speed: 0, headR: 32, spine: [], stardust: [], animPhase: 3.8, tumbleDir: 1 },
            { type: pMode, nodeClass: 'seeker', x: w * 0.85, y: h * 0.46, vx: 0, speed: 0, headR: 30, spine: [], stardust: [], animPhase: 4.4, tumbleDir: -1 },
            { type: pMode, nodeClass: 'fragmentation', x: w * 0.94, y: h * 0.46, vx: 0, speed: 0, headR: 32, hasDetonated: true, spine: [], stardust: [], animPhase: 5.0, tumbleDir: 1 }
          ];
          state.lastSpawnTime = now + 999999;
        }
      }

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
          catcherPixelX = CoreGeometryDB.clampCatcherPosition(currentCatcherX * w, catcherPixelY, w, h, clampTier, isTouchEnv, false, catcherBottomMargin).x;
        } else {
          targetCatcherX = 0.50;
          currentCatcherX += (targetCatcherX - currentCatcherX) * 0.22;
          state.catcherX = currentCatcherX;
          catcherPixelX = CoreGeometryDB.clampCatcherPosition(currentCatcherX * w, catcherPixelY, w, h, clampTier, isTouchEnv, false, catcherBottomMargin).x;
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
      const effDprLoop = cachedCanvasDpr || getRenderDpr();
      const canvasW = ctx.canvas.width / effDprLoop;
      const canvasH = ctx.canvas.height / effDprLoop;
      const isMobile = canvasW < 600;
      const u = CoreGeometryDB.computeCoreMetrics(canvasW, canvasH, CoreKinematics.continuousTier || state.coreTier, isMobile, null).u;
      CoreKinematics.drawThrusterPlumes(ctx, u);
      CoreKinematics.drawGrazeSparks(ctx, u);

      // === CHANGED (v387): Global Screen Shake (Caldera Nova, Voidbloom destruction/breach, Seeker launch) ===
      if (state.globalScreenShake && state.globalScreenShake > 0.25) {
        const sx = (Math.random() - 0.5) * state.globalScreenShake;
        const sy = (Math.random() - 0.5) * state.globalScreenShake;
        ctx.translate(sx, sy);
        state.globalScreenShake *= Math.pow(0.88, dtScale);
        if (state.globalScreenShake <= 0.25) state.globalScreenShake = 0;
      }

      // Update & Render Live Seeking Micro-Missiles
      CoreKinematics.updateAndDrawMissiles(ctx, dtScale, now, state);

      // === CHANGED (v387): Voidbloom Growing Hazard (renders BEFORE Boss Bar / Top HUD so it never blocks them!) ===
      VoidbloomEngine.tick(dt, ctx, catcherPixelX, catcherPixelY, u, dtScale, now, w, h);

      // Update & Render Round Progression, Sovereign Bosses & Active Skills!
      SkillSystem.tick(dt, ctx, catcherPixelX, catcherPixelY, u, dtScale, now, w, h);
      RoundBossEngine.updateAndDrawBossSystem(ctx, catcherPixelX, catcherPixelY, u, dtScale, now, w, h, spawnBossSupplyNode);

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

      // Render Adaptable Tier I–V Chrome Core Artillery Weapon IN FRONT OF the Core & Wings!
      RoundBossEngine.updateAndDrawPlayerWeapon(ctx, catcherPixelX, catcherPixelY, u, dtScale, now, w, h);

      // === CHANGED (v390): Caldera Nova Foreground 3D Orbital Shockwave Arc & Ignition Glint (IN FRONT OF Core!) ===
      SkillSystem.drawNovaForeground(ctx, catcherPixelX, catcherPixelY, now, w, h);

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

            // Shatter into radiant kinetic debris shards (strictly capped for zero lag)
            if (!state.vaporizedShards) state.vaporizedShards = [];
            for (let sh = 0; sh < 8; sh++) {
              if (state.vaporizedShards.length >= 32) break;
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

        // Smart-Bomb Synergy: Flux Pulse vaporizes Boss Bullets AND slams Active Boss for 15 Damage!
        if (state.bossBullets && state.bossBullets.length > 0) {
          for (let bIdx = state.bossBullets.length - 1; bIdx >= 0; bIdx--) {
            const bb = state.bossBullets[bIdx];
            if (Math.hypot(bb.x - fp.x, bb.y - fp.y) <= fp.radius + 24) {
              state.bossBullets.splice(bIdx, 1);
            }
          }
        }
        if (state.boss && state.boss.phase === 'fighting' && !fp.hitBoss) {
          const distBoss = Math.hypot(state.boss.x - fp.x, state.boss.y - fp.y);
          if (distBoss <= fp.radius + (state.boss.hitR || 72)) {
            fp.hitBoss = true;
            RoundBossEngine.damageBoss(15, now, true, state.boss.x, state.boss.y);
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
        if (state.vaporizedShards.length > 32) {
          state.vaporizedShards.splice(0, state.vaporizedShards.length - 32);
        }
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
      // Effective capture hitRadius (scaled cleanly to reduced v402 Chrome Core proportions; capped cleanly at Tier V radius for fair Tier VI hazards)
      const tierHitBonus = Math.min(4, Math.max(0, (state.coreTier || 1) - 1)) * 10;
      const hitRadius = ((deviceInputMode === 'touch') ? 68 : 46) + tierHitBonus;
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
          const proxAng = Math.atan2(p.y - catcherPixelY, p.x - catcherPixelX);
          const proxR = 68.0 * u;
          QuantumRenderer.drawContactBurst(ctx, catcherPixelX + Math.cos(proxAng) * proxR, catcherPixelY + Math.sin(proxAng) * proxR, modeKey, gravStrength * 0.65, now, proxAng);
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
        const hasActiveShield = state.hasBuff('shield', now);
        const coreSphereRadius = (isHazard && hasActiveShield)
          ? CoreKinematics.getShieldOuterRadius(u, state.coreTier)
          : (68.0 * u);
        const nodeSphereRadius = p.headR ? (p.headR * (isMobile ? 0.72 : 1.0)) : (isMobile ? 26.0 : 36.0);
        const hazardContactRadius = coreSphereRadius + nodeSphereRadius * (hasActiveShield ? 0.88 : 1.0);
        const effectiveHitRadius = isHazard ? hazardContactRadius : hitRadius;

        // Evasion Graze Mechanic for Hazards (Tiered Bonus for Apex Feature Hazards!)
        if (isHazard && !p.hasGrazed && distToCore >= hazardContactRadius && distToCore < hazardContactRadius + 32.0) {
          p.hasGrazed = true;
          const grazeBonus = isComet ? 400
            : ((p.nodeClass === 'corruptor_laser' || p.nodeClass === 'gravity_well' || p.nodeClass === 'phase_stalker') ? 350 : 250);
          state.score += grazeBonus;
          if (isComet) {
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 15);
            if (state.pulseMeter >= 100) { state.isPulseReady = true; audio.playPulseCharged(); }
          }
          CoreKinematics.triggerGraze(p.x, p.y, now);
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
              const contactAng = Math.atan2(p.y - catcherPixelY, p.x - catcherPixelX);
              const shieldR = CoreKinematics.getShieldOuterRadius(u, state.coreTier);
              const impactX = catcherPixelX + Math.cos(contactAng) * shieldR;
              const impactY = catcherPixelY + Math.sin(contactAng) * shieldR;
              const shieldMode = (p.type === 'helix') ? 'helix' : ((p.type === 'meteor') ? 'meteor' : 'dynamo');
              CoreKinematics.triggerShieldDeflect(impactX, impactY, now, shieldMode, contactAng);
              QuantumRenderer.drawContactBurst(ctx, impactX, impactY, shieldMode, 1.0, now, contactAng);
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
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, '#e879f9');
            audio.playOverdriveFanfare();
            classMultiplier = 2.0;

          } else if (p.nodeClass === 'supercharge') {
            classMultiplier = 8.0;
            state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 50);
            if (state.pulseMeter >= 100) { state.isPulseReady = true; audio.playPulseCharged(); }
            state.applyBuff('hyper', 'HYPER SURGE', '#fbbf24', '⚡', 5000, now);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, '#fbbf24');
            audio.playOverdriveFanfare();

          } else if (p.nodeClass === 'chronos') {
            state.applyBuff('chronos', 'CHRONOS STASIS', '#22d3ee', '⏳', 4500, now);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, '#22d3ee');
            audio.playPhaseSwitch();

          } else if (p.nodeClass === 'singularity') {
            state.applyBuff('singularity', 'GRAVITON VACUUM', '#38bdf8', '🧲', 3500, now);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, '#38bdf8');
            audio.playPulseCharged();

          } else if (p.nodeClass === 'catalyst') {
            const targetTierCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
            if (state.coreTier < 5) {
              state.coreTier = Math.min(5, state.coreTier + 1);
              state.combo = Math.max(state.combo, targetTierCombo[state.coreTier] || state.combo);
            }
            state.isOverdrive = (state.coreTier >= 4);
            const prevLives = state.reflexLives;
            state.reflexLives = Math.min(3, state.reflexLives + 1);
            renderReflexShields();
            state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, '#34d399');
            if (state.coreTier === 5) audio.playTier5Ascension();
            else audio.playOverdriveFanfare();

          } else if (p.nodeClass === 'shield') {
            const sMeta = getRealmShieldMeta(state.catcherType || 'dynamo');
            state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
            CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY - 80, now, state.catcherType || 'dynamo', -Math.PI * 0.5);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, sMeta.color);
            audio.playPulseCharged();
            classMultiplier = 3.0;

          } else if (p.nodeClass === 'missiles') {
            const mColor = (state.catcherType === 'meteor') ? '#f97316' : ((state.catcherType === 'helix') ? '#22d3ee' : '#38bdf8');
            state.applyBuff('missiles', 'ALLIED MISSILES', mColor, '🚀', 4000, now);
            CoreKinematics.triggerPowerupCoronation(p.x, p.y, now, mColor);
            CoreKinematics.fireMissiles(catcherPixelX, catcherPixelY, now, state.particles, state.catcherType || 'dynamo');
            audio.playOverdriveFanfare();
            classMultiplier = 4.0;
          }

          const basePoints = 300;
          const finalCatchPoints = Math.floor(basePoints * state.combo * precisionMultiplier * classMultiplier * clusterBonus);
          state.score += finalCatchPoints;
          // Load Accumulated Good-Node Ammo into Chrome Core Offense Cannon & Advance Round Quota!
          RoundBossEngine.onGoodNodeCaught(p.nodeClass, isPerfect, now, w);
          const prevCombo = state.combo;
          state.combo = Math.min(999, state.combo + 1);
          evaluateCoreTierFromCombo(now, true);
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
          }

          // Trigger Mode-Specific Layered Capture Physics at exact directional contact point
          const catchAngle = Math.atan2(p.y - catcherPixelY, p.x - catcherPixelX);
          const catchCoreR = 68.0 * u;
          CoreKinematics.triggerCaptureEffect(p.type, catcherPixelX, catcherPixelY, p.x, p.y, now, u);

          // Spawn Mode-Signature Kinetic Impact Physics Effect anchored at exact contact point on sphere perimeter
          state.absorptionEffects.push({
            type: p.type,
            x: catcherPixelX,
            y: catcherPixelY,
            offsetX: Math.cos(catchAngle) * catchCoreR,
            offsetY: Math.sin(catchAngle) * catchCoreR,
            contactAngle: catchAngle,
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
            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
            state.combo = tierFloorCombo[state.coreTier] || 0;
            if (state.coreTier < 6) {
              state.tier6HatchLock = false;
              if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
            }
          } else {
            state.combo = 0;
            state.tier6HatchLock = false;
            if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
          }
          state.prevEvaluatedCombo = state.combo;
          state.isOverdrive = (state.coreTier >= 4);

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
      // RENDER DIRECTIONAL PERIMETER CONTACT FLASH ON NODE INTERCEPTION
      // ─────────────────────────────────────────────────────────────
      if (state.absorptionEffects.length > 6) {
        state.absorptionEffects.splice(0, state.absorptionEffects.length - 6);
      }
      for (let ab = state.absorptionEffects.length - 1; ab >= 0; ab--) {
        const eff = state.absorptionEffects[ab];
        eff.alpha -= 0.065 * dtScale;
        if (eff.alpha <= 0) {
          state.absorptionEffects.splice(ab, 1);
          continue;
        }
        const modeKey = (eff.type === 'helix') ? 'helix' : (eff.type === 'meteor' ? 'meteor' : 'dynamo');
        const cAng = (eff.contactAngle !== undefined) ? eff.contactAngle : -Math.PI * 0.5;
        const offX = (eff.offsetX !== undefined) ? eff.offsetX : Math.cos(cAng) * 68.0 * u;
        const offY = (eff.offsetY !== undefined) ? eff.offsetY : Math.sin(cAng) * 68.0 * u;
        QuantumRenderer.drawContactBurst(ctx, catcherPixelX + offX, catcherPixelY + offY, modeKey, eff.alpha * 1.25, now, cAng);
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

      // Render Floating Texts (Strictly for Reflex Numbers Blitz; zero playfield text in core arcade modes)
      if (state.gameType !== 'reflex' && state.floatingTexts.length > 0) {
        state.floatingTexts.length = 0;
      }
      if (state.floatingTexts.length > 3) {
        state.floatingTexts.splice(0, state.floatingTexts.length - 3);
      }
      if (state.gameType === 'reflex' && state.floatingTexts.length > 0) {
        const ftStep = Math.max(0.5, Math.min(2.2, dtScale || 1));
        ctx.save();
        ctx.font = '800 13px "Lexend", sans-serif';
        ctx.textAlign = 'center';
        for (let f = state.floatingTexts.length - 1; f >= 0; f--) {
          const ft = state.floatingTexts[f];
          if (!ft) { state.floatingTexts.splice(f, 1); continue; }
          ft.y = (Number.isFinite(ft.y) ? ft.y : h * 0.5) + (Number.isFinite(ft.vy) ? ft.vy : -1.2) * ftStep;
          ft.alpha = (Number.isFinite(ft.alpha) ? ft.alpha : 1.0) - 0.025 * ftStep;
          if (ft.alpha <= 0) {
            state.floatingTexts.splice(f, 1);
            continue;
          }
          ctx.fillStyle = ft.color || '#fde047';
          ctx.globalAlpha = Math.max(0, Math.min(1, ft.alpha));
          ctx.fillText(String(ft.text || ''), Number.isFinite(ft.x) ? ft.x : w * 0.5, ft.y);
        }
        ctx.restore();
      }

      ctx.restore();
    } catch (loopErr) {
      try { ctx.setTransform(1, 0, 0, 1, 0, 0); } catch (_) {}
      console.warn('[OrlandoChrome] Recovered frame error:', loopErr);
    }
    if (state.active) {
      animFrameId = requestAnimationFrame(reflexGameLoop);
    }
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
    // === CHANGED (v385): Initialize STEP 1 touch-primary detector & matchMedia change listeners ===
    TouchFireControls.init();

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
      const effDpr = cachedCanvasDpr || getRenderDpr();
      const canvasW = dom.canvasReflex ? (dom.canvasReflex.width / effDpr) : 800;
      const canvasH = dom.canvasReflex ? (dom.canvasReflex.height / effDpr) : 600;
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

      updateHeaderUI();
    }

    if (dom.pulsePill) dom.pulsePill.onclick = () => triggerFluxPulse(false);
    if (dom.offensePill) dom.offensePill.onclick = (e) => {
      e.stopPropagation();
      state.offenseMode = false;
    };
    window.triggerFluxPulse = (force = false) => triggerFluxPulse(force);
    if (window.ReflexArcade) window.ReflexArcade.triggerPulse = (force = false) => triggerFluxPulse(force);

    // Cycle Tier (I -> II -> III -> IV -> V -> VI) on clicking the TIER pill or pressing 'T'
    function cycleCoreTier() {
      if (!state.active) return;
      const nextTierCombo = { 1: 7, 2: 14, 3: 21, 4: 28, 5: 50, 6: 0 };
      state.combo = (nextTierCombo[state.coreTier] !== undefined) ? nextTierCombo[state.coreTier] : 0;
      evaluateCoreTierFromCombo(performance.now(), true);
      if (state.coreTier < 6) {
        CoreKinematics.continuousTier = state.coreTier;
        if (state.coreTier === 5) audio.playTier5Ascension();
        else if (state.coreTier === 4) audio.playOverdriveFanfare();
        else audio.playPhaseSwitch();
      }
      updateHeaderUI();
    }
    const tierPillEl = document.getElementById('cgTierPill');
    if (tierPillEl) {
      tierPillEl.style.cursor = 'pointer';
      tierPillEl.onclick = cycleCoreTier;
    }

    // === CHANGED (v387): Keyboard bindings — keeps existing Space / [F] / [E] / [T] untouched, ADDS [A] Ember Cannon hold, [S] Seeker Comets, [D] Caldera Nova ===
    window.addEventListener('keydown', (e) => {
      if (!state.active) {
        if (dom.screenOverlay && dom.screenOverlay.style.display === 'flex' && dom.modal && dom.modal.classList.contains('active')) {
          if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            startGame(state.gameType);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeGame();
          }
        }
        return;
      }
      RealmMusicEngine.unlockOnGesture();

      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 't' || e.key === 'T') {
        cycleCoreTier();
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
        // [A] or [F] = EMBER CANNON: steady continuous hold fire (manual only, stops immediately on keyup)
        e.preventDefault();
        const gunCode = (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') ? 'KeyF' : 'KeyA';
        if (!TouchFireControls.heldKeys.has(gunCode)) {
          TouchFireControls.heldKeys.add(gunCode);
          if ((state.coreAmmo || 0) <= 0) TouchFireControls.flashEmpty();
          updateHeaderUI();
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
        // [S] = SEEKER COMETS (tap only; ignore e.repeat so holding S never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyS');
          SkillSystem.castSeekerComets(performance.now());
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyD' || e.key === 'd' || e.key === 'D')) {
        // [D] = CALDERA NOVA (tap only; ignore e.repeat so holding D never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyD');
          SkillSystem.castCalderaNova(performance.now());
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        const gunCode = (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') ? 'KeyF' : 'KeyA';
        if (TouchFireControls.heldKeys.delete(gunCode)) {
          updateHeaderUI();
        }
      } else if (e.code === 'KeyS' || e.key === 's' || e.key === 'S') {
        TouchFireControls.heldKeys.delete('KeyS');
      } else if (e.code === 'KeyD' || e.key === 'd' || e.key === 'D') {
        TouchFireControls.heldKeys.delete('KeyD');
      }
    });

    // Window Resize & ResizeObserver Handler to guarantee pixel-perfect resolution with ZERO per-frame reflow!
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    if (window.visualViewport && window.visualViewport.addEventListener) {
      window.visualViewport.addEventListener('resize', resizeCanvas);
    }
    if (typeof ResizeObserver !== 'undefined' && dom.canvasReflex) {
      try {
        const ro = new ResizeObserver(() => resizeCanvas());
        ro.observe(dom.canvasReflex);
      } catch (_) {}
    }

    // Mute toggle (syncs BOTH SFX and Futuristic Realm Music Engine)
    if (dom.btnMute) {
      dom.btnMute.onclick = () => {
        audio.isMuted = !audio.isMuted;
        dom.btnMute.style.opacity = audio.isMuted ? '0.4' : '1';
        RealmMusicEngine._syncGain();
        if (!audio.isMuted && state.active) RealmMusicEngine.unlockOnGesture();
        RealmMusicEngine.syncBtnUI();
      };
    }

    // === CHANGED (v387): Dedicated Futuristic Music Theme Toggle ===
    const btnMusic = document.getElementById('cgMusicBtn');
    if (btnMusic) {
      btnMusic.onclick = (e) => {
        e.stopPropagation();
        RealmMusicEngine.toggle();
      };
      RealmMusicEngine.syncBtnUI();
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

          const effDpr = cachedCanvasDpr || getRenderDpr();
          state.floatingTexts.push({
            text: `TARGET: MULTIPLES OF ${choice} · ENGAGE!`,
            x: (dom.canvasReflex?.width || 800) / (2 * effDpr),
            y: (dom.canvasReflex?.height || 600) / (2 * effDpr),
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
      let rect = cachedCanvasRect;
      if (!rect || rect.width < 10) {
        resizeCanvas();
        rect = cachedCanvasRect;
      }
      const normX = (rect.width > 0) ? Math.max(0.01, Math.min(0.99, (clientX - rect.left) / rect.width)) : (clientX / window.innerWidth);
      const normY = (rect.height > 0) ? Math.max(0.01, Math.min(0.99, (clientY - rect.top) / rect.height)) : (clientY / window.innerHeight);
      return { x: clientX - rect.left, y: clientY - rect.top, normX, normY };
    };

    // === CHANGED (v387): STEP 3 — TRUE 5+ FINGER MULTI-TOUCH POINTER MAP ENGINE ===
    // Every active touch pointerId is mapped to ONE role ('MOVE' | 'GUN' | 'SKILL2' | 'ULT').
    // No competing legacy touchstart/touchend state overwrites; laptop mouse path untouched!
    const onPointerDown = (e) => {
      if (!state.active) return;
      RealmMusicEngine.unlockOnGesture();

      if (e.pointerType === 'touch' && !TouchFireControls.isTouch) {
        setDeviceMode('touch');
        TouchFireControls.promoteToTouchOnRealTouch();
      }
      if (TouchFireControls.isTouch) {
        if (e.target && e.target.closest && e.target.closest('#ocTouchControlCluster')) {
          return;
        }
        if (e.target && e.target.closest && e.target.closest('.game-topbar, .game-screen-overlay, .reflex-start-overlay')) {
          return;
        }
        if (TouchFireControls.activePointers.has(e.pointerId)) {
          return;
        }
        setDeviceMode('touch');

        // Only move on-point across the playfield when player has selected ON-POINT mode!
        if (TouchFireControls.moveMode === 'onpoint' && !TouchFireControls.hasRole('MOVE')) {
          TouchFireControls.activePointers.set(e.pointerId, { role: 'MOVE', el: null });
          isPointerDown = true;
          const coords = getCanvasCoords(e.clientX, e.clientY);
          lastTouchClientX = e.clientX;
          lastTouchClientY = e.clientY;
          touchGuidePos = { x: coords.x, y: coords.y, active: true };
          targetCatcherX = coords.normX;
          currentCatcherX = coords.normX;
          targetCatcherY = coords.normY;
          currentCatcherY = coords.normY;
        }
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Existing non-touch desktop/laptop path (UNTOUCHED)
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
        // Desktop Left-Click Hold = Instant Fire
        if (dom.canvasReflex && e.target === dom.canvasReflex) {
          if (e.button === 0) {
            state.pointerFiring = true;
            updateHeaderUI();
          }
        }
      }

      if (e.cancelable && deviceInputMode === 'touch') e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!state.active) return;

      // === CHANGED (v387): Only the pointerId assigned role === 'MOVE' steers the ship on touch ===
      if (TouchFireControls.isTouch) {
        const entry = TouchFireControls.activePointers.get(e.pointerId);
        if (!entry || entry.role !== 'MOVE') return;
        const events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
        const lastEv = events[events.length - 1] || e;
        const coords = getCanvasCoords(lastEv.clientX, lastEv.clientY);
        touchGuidePos = { x: coords.x, y: coords.y, active: true };
        targetCatcherX = coords.normX;
        targetCatcherY = coords.normY;
        currentCatcherX = coords.normX;
        currentCatcherY = coords.normY;
        lastTouchClientX = lastEv.clientX;
        lastTouchClientY = lastEv.clientY;
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Existing non-touch desktop/laptop path (UNTOUCHED)
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
      // === CHANGED (v387): Release ONLY this pointerId's role — never disrupts any other active finger! ===
      if (TouchFireControls.isTouch) {
        TouchFireControls.releasePointer(e.pointerId);
        return;
      }

      // Existing non-touch desktop/laptop path (UNTOUCHED)
      isPointerDown = false;
      touchGuidePos.active = false;
      if (state.pointerFiring) {
        state.pointerFiring = false;
        updateHeaderUI();
      }
    };

    if (dom.canvasReflex) {
      dom.canvasReflex.addEventListener('contextmenu', (e) => {
        if (state.active) e.preventDefault();
      });
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // === CHANGED (v387): iOS Safari scroll/zoom/callout blocker (passive:false touchmove/touchstart) WITHOUT competing with Pointer Events Map ===
    const blockIosCanvasTouchScroll = (e) => {
      if (!state.active) return;
      if (e.cancelable) e.preventDefault();
    };
    if (dom.canvasReflex) {
      dom.canvasReflex.addEventListener('touchstart', blockIosCanvasTouchScroll, { passive: false });
      dom.canvasReflex.addEventListener('touchmove', blockIosCanvasTouchScroll, { passive: false });
      dom.canvasReflex.addEventListener('touchend', blockIosCanvasTouchScroll, { passive: false });
    }
    if (dom.viewReflex) {
      dom.viewReflex.addEventListener('touchmove', (e) => {
        if (state.active && TouchFireControls.isTouch && e.cancelable) e.preventDefault();
      }, { passive: false });
      dom.viewReflex.addEventListener('contextmenu', (e) => {
        if (state.active) e.preventDefault();
      });
    }

    // === CHANGED (v387): Arrow-Key Flight Controls (A/S/D reserved exclusively for Ember Cannon / Seeker Comets / Caldera Nova!) ===
    window.addEventListener('keydown', (e) => {
      if (!state.active) return;
      const step = 0.045;
      if (e.key === 'ArrowLeft') {
        targetCatcherX = Math.max(0.04, targetCatcherX - step);
      } else if (e.key === 'ArrowRight') {
        targetCatcherX = Math.min(0.96, targetCatcherX + step);
      } else if (e.key === 'ArrowUp') {
        targetCatcherY = Math.max(0.06, targetCatcherY - step);
      } else if (e.key === 'ArrowDown') {
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
    getTouchControls: () => TouchFireControls,
    getKinematics: () => CoreKinematics,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },
    setPointerY: (ny) => { targetCatcherY = Math.max(0.06, Math.min(0.94, ny)); },
    setTier: (t, allowHatch = true) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 50;
      evaluateCoreTierFromCombo(performance.now(), allowHatch);
      if (state.coreTier < 6) {
        CoreKinematics.continuousTier = state.coreTier;
        if (state.coreTier === 5) audio.playTier5Ascension();
      }
      updateHeaderUI();
    },
    setCombo: (n, allowHatch = true) => {
      state.combo = Math.max(0, Math.min(999, Math.floor(Number(n) || 0)));
      evaluateCoreTierFromCombo(performance.now(), allowHatch);
      updateHeaderUI();
    },
    addCombo: (delta = 1, allowHatch = true) => {
      state.combo = Math.max(0, Math.min(999, (state.combo || 0) + (Number(delta) || 0)));
      evaluateCoreTierFromCombo(performance.now(), allowHatch);
      updateHeaderUI();
    },
    getHatchState: () => ({
      tier: state.coreTier,
      combo: state.combo,
      prevEvaluatedCombo: state.prevEvaluatedCombo,
      lock: state.tier6HatchLock,
      hatching: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.isActive() : false,
      hatchMode: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.mode : null
    })
  };
  window.openChromeGame = openGame;

  // ReflexArcade programmatic API & URL auto-launch
  window.ReflexArcade = {
    open: openGame,
    close: closeGame,
    setTier: function(t, allowHatch = true) {
      if (!state.active) return;
      window.chromeSynapseGame.setTier(t, allowHatch);
    },
    setCombo: function(n, allowHatch = true) {
      if (!state.active) return;
      window.chromeSynapseGame.setCombo(n, allowHatch);
    },
    addCombo: function(delta = 1, allowHatch = true) {
      if (!state.active) return;
      window.chromeSynapseGame.addCombo(delta, allowHatch);
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
          const cParam = parseInt(p.get('combo') || '0', 10);
          if (cParam >= 1 || (t >= 1 && t <= 6)) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
              const targetC = (cParam >= 1) ? cParam : ((nextCombo[t] !== undefined) ? nextCombo[t] : 50);
              state.combo = targetC;
              state.prevEvaluatedCombo = targetC;
              evaluateCoreTierFromCombo(performance.now(), false);
              CoreKinematics.continuousTier = state.coreTier;
              if (state.coreTier === 5) audio.playTier5Ascension();
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
  window.RoundBossEngine = RoundBossEngine;
  window.SkillSystem = SkillSystem;
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

/* ══════════════════════════════════════════════════════════════════════════
   LUXURY REALM LAUNCHER ENGINE v381 (DYNAMO · HELIX · METEOR)
   10-Role Studio Upgrade: Live 60FPS QuantumRenderer Tier V Hexa-Wing Portal
   + Zero-Reflow Cached Topbar Button Micro-Physics (0% CPU when idle/in-game)
   ══════════════════════════════════════════════════════════════════════════ */
(function initLuxuryRealmLauncherButtons() {
  const REALM_META = {
    dynamo: {
      title: 'CHROME DYNAMO · DYNAMO PRINCESS',
      tierTag: '⚡ TIER VI SHOWCASE',
      science: 'Faraday–Maxwell Plasma Physics · Crystal Wings, Twin Tesla Cannons & Storm Astrolabe',
      bestKey: 'oc_best_realm',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#38bdf8', '#c084fc', '#fde68a']
    },
    helix: {
      title: 'CHROME HELIX · HELIX UNICORN',
      tierTag: '🧬 TIER VI SHOWCASE',
      science: 'Quantum Molecular Biogenesis · Cyan Crystal Horn, Iridescent Wings & Chiral Prism',
      bestKey: 'oc_best_helix',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#22d3ee', '#e879f9', '#f0f9ff']
    },
    meteor: {
      title: 'CHROME METEOR · METEOR DRAGON',
      tierTag: '☄️ TIER VI SHOWCASE',
      science: 'Hypervelocity Chondritic Ablation · Volcanic Armor, Magma Wings & Caldera Breath',
      bestKey: 'oc_best_meteor',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#fde047', '#fb923c', '#f97316']
    }
  };

  // Pre-seeded ambient micro-particles for the live Tier V Portal Viewport (Zero runtime allocations)
  const PORTAL_MOTES = Array.from({ length: 20 }, (_, i) => ({
    x: ((i * 67 + 23) % 100) / 100,
    y: ((i * 43 + 17) % 100) / 100,
    r: 0.8 + (i % 3) * 0.55,
    spdY: 0.012 + (i % 4) * 0.006,
    phase: i * 1.19,
    ci: i % 3
  }));

  function setup() {
    const buttons = Array.from(document.querySelectorAll('.oc-realm-btn[data-realm]'));
    if (!buttons.length) return;

    // 1. Create Reusable Floating Holographic Tier V Portal Card directly on document.body (ZERO topbar clipping!)
    let portal = document.getElementById('ocRealmPortalCard');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'ocRealmPortalCard';
      portal.setAttribute('aria-hidden', 'true');
      portal.innerHTML = `
        <div class="oc-portal-stage">
          <span class="oc-portal-tier-tag" id="ocPortalTierTag"></span>
          <canvas id="ocPortalCanvas" class="oc-portal-canvas" aria-hidden="true"></canvas>
        </div>
        <div class="oc-portal-title" id="ocPortalTitle"></div>
        <div class="oc-portal-science" id="ocPortalScience"></div>
        <div class="oc-portal-footer">
          <span class="oc-portal-best">BEST SCORE<strong id="ocPortalBest">0</strong></span>
          <span class="oc-portal-cta">ENTER ARENA →</span>
        </div>
      `;
      document.body.appendChild(portal);
    }

    const pTag = document.getElementById('ocPortalTierTag');
    const pCanvas = document.getElementById('ocPortalCanvas');
    const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
    const pTitle = document.getElementById('ocPortalTitle');
    const pSci = document.getElementById('ocPortalScience');
    const pBest = document.getElementById('ocPortalBest');

    const PORTAL_W = 266;
    const PORTAL_H = 176;
    let portalDpr = 1;
    function syncPortalCanvasSize() {
      if (!pCanvas) return;
      portalDpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const tw = Math.round(PORTAL_W * portalDpr);
      const th = Math.round(PORTAL_H * portalDpr);
      if (pCanvas.width !== tw || pCanvas.height !== th) {
        pCanvas.width = tw;
        pCanvas.height = th;
      }
      pCanvas._renderDpr = portalDpr;
    }
    syncPortalCanvasSize();

    let activeHoverRealm = null;
    const fxControllers = [];

    function renderPortalFrame(now) {
      if (!activeHoverRealm || !pCtx || !pCanvas) return;
      const meta = REALM_META[activeHoverRealm];
      if (!meta) return;

      const dpr = portalDpr || 1;
      const w = PORTAL_W;
      const h = PORTAL_H;

      pCtx.save();
      pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pCtx.clearRect(0, 0, w, h);
      pCtx.imageSmoothingEnabled = true;
      pCtx.imageSmoothingEnabled = true;

      // Subtle animated cosmic starlight / realm motes behind the Tier V Archon
      pCtx.save();
      pCtx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < PORTAL_MOTES.length; i++) {
        const m = PORTAL_MOTES[i];
        const drift = (now * 0.001 * m.spdY);
        const mx = ((m.x + Math.sin(now * 0.0009 + m.phase) * 0.04) * w + w) % w;
        const my = ((m.y - drift) % 1 + 1) % 1 * h;
        const tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(now * 0.004 + m.phase));
        pCtx.globalAlpha = tw * 0.65;
        pCtx.fillStyle = meta.moteColors[m.ci];
        pCtx.beginPath();
        pCtx.arc(mx, my, m.r, 0, Math.PI * 2);
        pCtx.fill();
      }
      pCtx.restore();

      // Presentation View: Render full-body three-quarter Tier VI Character Showcase Render!
      if (window.QuantumRenderer && typeof window.QuantumRenderer.drawCharacterShowcase === 'function') {
        window.QuantumRenderer.drawCharacterShowcase(
          pCtx,
          activeHoverRealm,
          w * 0.5,
          h * (meta.portalCy || 0.53),
          w * 0.94,
          h * 0.88,
          now
        );
      }
      pCtx.restore();
    }

    function showPortalFor(btn, realm) {
      const meta = REALM_META[realm];
      if (!meta) return;
      activeHoverRealm = realm;
      portal.setAttribute('data-realm', realm);
      if (pTag) pTag.textContent = meta.tierTag;
      if (pTitle) pTitle.textContent = meta.title;
      if (pSci) pSci.textContent = meta.science;
      const bestVal = parseInt(localStorage.getItem(meta.bestKey) || '0', 10) || 0;
      if (pBest) pBest.textContent = bestVal.toLocaleString();

      const rect = btn.getBoundingClientRect();
      const cardW = 294;
      const desiredLeft = rect.left + rect.width * 0.5 - cardW * 0.5;
      const clampedLeft = Math.max(10, Math.min(window.innerWidth - cardW - 10, desiredLeft));
      portal.style.left = `${Math.round(clampedLeft)}px`;
      portal.style.top = `${Math.round(rect.bottom + 8)}px`;
      syncPortalCanvasSize();
      renderPortalFrame(performance.now());
      portal.classList.add('visible');
    }

    function hidePortal() {
      activeHoverRealm = null;
      portal.classList.remove('visible');
    }

    // 2. Wire Per-Button Live Micro-Physics Canvas + Cached Dimensions (Zero per-frame reflow!)
    function syncButtonSizes() {
      const dpr = Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
      for (let i = 0; i < fxControllers.length; i++) {
        const c = fxControllers[i];
        const rect = c.btn.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) continue;
        c.w = rect.width;
        c.h = rect.height;
        c.dpr = dpr;
        const tw = Math.round(rect.width * dpr);
        const th = Math.round(rect.height * dpr);
        if (c.canvas.width !== tw || c.canvas.height !== th) {
          c.canvas.width = tw;
          c.canvas.height = th;
        }
      }
    }

    buttons.forEach((btn) => {
      const realm = btn.getAttribute('data-realm');
      const canvas = btn.querySelector('.oc-realm-btn-fx');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const embers = [];
      for (let i = 0; i < 8; i++) {
        embers.push({
          x: Math.random(),
          y: Math.random(),
          spd: 0.008 + Math.random() * 0.013,
          size: 0.9 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2
        });
      }

      const ctrl = { btn, realm, canvas, ctx, embers, hovered: false, w: 0, h: 0, dpr: 1 };
      fxControllers.push(ctrl);

      btn.addEventListener('mouseenter', () => {
        ctrl.hovered = true;
        showPortalFor(btn, realm);
      });
      btn.addEventListener('mouseleave', () => {
        ctrl.hovered = false;
        hidePortal();
      });
      btn.addEventListener('focus', () => {
        ctrl.hovered = true;
        showPortalFor(btn, realm);
      });
      btn.addEventListener('blur', () => {
        ctrl.hovered = false;
        hidePortal();
      });
      btn.addEventListener('click', () => {
        ctrl.hovered = false;
        hidePortal();
      });
    });

    syncButtonSizes();
    window.addEventListener('resize', () => {
      syncButtonSizes();
      syncPortalCanvasSize();
    });

    // 3. Lightweight Adaptive Loop (Auto-Pauses when Arcade Modal is Open or Tab Hidden; 30FPS idle / 60FPS hovered!)
    const modalEl = document.getElementById('chromeGameModal');
    function isArcadeOpen() {
      if (!modalEl) return false;
      return modalEl.classList.contains('active') || modalEl.classList.contains('open') || modalEl.style.display === 'flex' || modalEl.style.display === 'block';
    }

    let lastBtnDraw = 0;
    function renderLoop(now) {
      requestAnimationFrame(renderLoop);
      if (document.hidden || isArcadeOpen()) return;

      // Render Live Tier V Portal Viewport at full 60FPS ONLY while hovered!
      if (activeHoverRealm) {
        renderPortalFrame(now);
      }

      // Throttle idle topbar micro-physics to ~30FPS (full 60FPS when hovering any realm button)
      const minInterval = activeHoverRealm ? 15 : 33;
      if (now - lastBtnDraw < minInterval) return;
      lastBtnDraw = now;

      for (let i = 0; i < fxControllers.length; i++) {
        const c = fxControllers[i];
        if (c.w < 10 || c.h < 10) {
          syncButtonSizes();
          if (c.w < 10 || c.h < 10) continue;
        }
        const ctx = c.ctx;
        const w = c.w;
        const h = c.h;
        const dpr = c.dpr || 1;
        const boost = c.hovered ? 1.65 : 1.0;

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        if (c.realm === 'dynamo') {
          const tick = Math.floor(now / (c.hovered ? 48 : 82));
          const bolts = c.hovered ? 2 : 1;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const startX = w > 50 ? 24 : 6;
          const endX = w - 6;
          for (let b = 0; b < bolts; b++) {
            const segs = 6;
            ctx.beginPath();
            for (let s = 0; s <= segs; s++) {
              const f = s / segs;
              const px = startX + (endX - startX) * f;
              const jag = (s === 0) ? 0 : (Math.sin(tick * 3.17 + b * 4.3 + s * 2.29) * 4.8 + Math.cos(tick * 5.1 + s * 3.71) * 2.1);
              const py = h * 0.5 + jag * (c.hovered ? 1.1 : 0.8);
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.9, 0.48 * boost)})`;
            ctx.lineWidth = c.hovered ? 2.2 : 1.6;
            ctx.stroke();

            ctx.strokeStyle = `rgba(224, 242, 254, ${Math.min(0.95, 0.42 * boost)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

        } else if (c.realm === 'helix') {
          const startX = w > 50 ? 22 : 4;
          const endX = w - 4;
          const speed = now * (c.hovered ? 0.0052 : 0.0030);
          const steps = 14;
          ctx.lineCap = 'round';

          ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * boost})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          for (let s = 2; s < steps; s += 3) {
            const f = s / steps;
            const x = startX + (endX - startX) * f;
            const yOff = Math.sin(speed + f * Math.PI * 3.2) * (h * 0.28);
            ctx.moveTo(x, h * 0.5 + yOff);
            ctx.lineTo(x, h * 0.5 - yOff);
          }
          ctx.stroke();

          for (let strand = -1; strand <= 1; strand += 2) {
            ctx.beginPath();
            for (let s = 0; s <= steps; s++) {
              const f = s / steps;
              const x = startX + (endX - startX) * f;
              const y = h * 0.5 + Math.sin(speed + f * Math.PI * 3.2) * (h * 0.28) * strand;
              if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = strand > 0
              ? `rgba(34, 211, 238, ${Math.min(0.9, 0.46 * boost)})`
              : `rgba(232, 121, 249, ${Math.min(0.9, 0.46 * boost)})`;
            ctx.lineWidth = c.hovered ? 2.0 : 1.45;
            ctx.stroke();
          }

        } else if (c.realm === 'meteor') {
          ctx.fillStyle = `rgba(249, 115, 22, ${0.14 * boost})`;
          ctx.fillRect(0, 0, w, h);

          for (let e = 0; e < c.embers.length; e++) {
            const em = c.embers[e];
            em.x += em.spd * (c.hovered ? 1.8 : 1.0);
            em.y -= em.spd * 0.32;
            if (em.x > 1.05 || em.y < -0.1) {
              em.x = 0.16 + Math.random() * 0.14;
              em.y = 0.25 + Math.random() * 0.65;
            }
            const ex = em.x * w;
            const ey = em.y * h + Math.sin(now * 0.008 + em.phase) * 2.0;
            const ea = Math.min(1, Math.sin(Math.min(1, em.x) * Math.PI) * 0.85 * boost);
            ctx.globalAlpha = ea * 0.55;
            ctx.fillStyle = '#fb923c';
            ctx.beginPath();
            ctx.arc(ex, ey, em.size * 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = ea;
            ctx.fillStyle = '#fef9c3';
            ctx.beginPath();
            ctx.arc(ex, ey, em.size * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }
    }
    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
