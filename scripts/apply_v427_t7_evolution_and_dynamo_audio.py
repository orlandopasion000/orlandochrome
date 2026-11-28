"""Apply v427: True Tier VI -> Tier VII Direct Celestial Evolution (Zero Egg Revert) + Brand-New Dynamo Princess Weapon Audio."""
import json
import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    n = text.count(old)
    assert n == 1, f"{label}: expected 1 occurrence, found {n}"
    return text.replace(old, new, 1)


def main():
    geom_path = ROOT / "assets" / "core-geometry-db.json"
    geom = json.loads(geom_path.read_text(encoding="utf-8"))
    geom["version"] = "v427_t7_evolution_audio"
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    for fname in ("index.html", "app.js", "sw.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade426_meteor_mouth" in txt, f"{fname} missing arcade426_meteor_mouth"
        p.write_text(txt.replace("arcade426_meteor_mouth", "arcade427_t7_evolution_audio"), encoding="utf-8")
        print(f"PATCHED -> {fname}")

    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 1. Replace Dynamo Princess weapon sound (Tiers I-VII) with Astral-Tesla Crystalline Plasma Synth (zero harsh sawtooth)
    old_dynamo_audio = """        } else {
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
        }"""

    new_dynamo_audio = """        } else {
          // ASTRAL-TESLA CRYSTALLINE PLASMA (Dynamo v427, Tiers I-VII): FM crystalline snap + royal fifth/octave harmonic + Tier sub-punch + 2-tap Lichtenberg crackle
          const tClamp = Math.max(1, Math.min(7, Number(tier) || 1));
          const tNorm = (tClamp - 1) / 6;

          // Layer 1: FM Crystalline Astral Snap (Sine carrier + decaying 2.5x harmonic FM modulator)
          const fmCarrier = ctx.createOscillator();
          const fmMod = ctx.createOscillator();
          const fmModGain = ctx.createGain();
          const fmOutGain = ctx.createGain();
          const fStart = 760 + tClamp * 38;
          const fEnd = 330 + tClamp * 18;
          const fmDur = 0.068 + tNorm * 0.032;

          fmCarrier.type = 'sine';
          fmCarrier.frequency.setValueAtTime(fStart, t0);
          fmCarrier.frequency.exponentialRampToValueAtTime(fEnd, t0 + fmDur);

          fmMod.type = 'sine';
          fmMod.frequency.setValueAtTime(fStart * 2.5, t0);
          fmMod.frequency.exponentialRampToValueAtTime(fEnd * 2.5, t0 + fmDur);

          fmModGain.gain.setValueAtTime(280 + tClamp * 55, t0);
          fmModGain.gain.exponentialRampToValueAtTime(1.0, t0 + 0.024);

          fmOutGain.gain.setValueAtTime(0.001, t0);
          fmOutGain.gain.linearRampToValueAtTime(0.058 + tNorm * 0.016, t0 + 0.003);
          fmOutGain.gain.exponentialRampToValueAtTime(0.0001, t0 + fmDur);

          fmMod.connect(fmModGain);
          fmModGain.connect(fmCarrier.frequency);
          fmCarrier.connect(fmOutGain);
          fmOutGain.connect(ctx.destination);
          fmMod.start(t0);
          fmCarrier.start(t0);
          fmMod.stop(t0 + fmDur + 0.008);
          fmCarrier.stop(t0 + fmDur + 0.008);

          // Layer 2: Harmonic Royal Fifth + Tier VI-VII Octave Astral Shimmer (Lowpass-tamed triangle/sine)
          const fRoot = 392 * (1 + tNorm * 0.16);
          const bodyDur = 0.075 + tNorm * 0.042;
          const bodyLp = ctx.createBiquadFilter();
          bodyLp.type = 'lowpass';
          bodyLp.frequency.setValueAtTime(3400, t0);
          bodyLp.frequency.exponentialRampToValueAtTime(1050, t0 + bodyDur);
          bodyLp.connect(ctx.destination);

          const harmonics = [
            { freq: fRoot, type: 'triangle', vol: 0.044 },
            { freq: fRoot * 1.498, type: 'sine', vol: 0.032 }
          ];
          if (tClamp >= 6) {
            harmonics.push({ freq: fRoot * 2.004, type: 'sine', vol: 0.024 });
          }
          harmonics.forEach((h) => {
            const ho = ctx.createOscillator();
            const hg = ctx.createGain();
            ho.type = h.type;
            ho.frequency.setValueAtTime(h.freq, t0);
            ho.frequency.exponentialRampToValueAtTime(h.freq * 0.62, t0 + bodyDur);
            hg.gain.setValueAtTime(h.vol, t0);
            hg.gain.exponentialRampToValueAtTime(0.0001, t0 + bodyDur);
            ho.connect(hg);
            hg.connect(bodyLp);
            ho.start(t0);
            ho.stop(t0 + bodyDur + 0.008);
          });

          // Layer 3: Tier III-VII Kinetic Sub-Plasma Punch
          if (tClamp >= 3) {
            const sub = ctx.createOscillator();
            const sg = ctx.createGain();
            const subStart = (tClamp >= 7) ? 162 : 195;
            const subEnd = (tClamp >= 7) ? 56 : 78;
            const subDur = 0.075 + ((tClamp >= 7) ? 0.035 : 0);
            const subVol = (tClamp >= 7) ? 0.095 : ((tClamp >= 6) ? 0.072 : 0.055);
            sub.type = 'sine';
            sub.frequency.setValueAtTime(subStart, t0);
            sub.frequency.exponentialRampToValueAtTime(subEnd, t0 + subDur);
            sg.gain.setValueAtTime(subVol, t0);
            sg.gain.exponentialRampToValueAtTime(0.0001, t0 + subDur);
            sub.connect(sg);
            sg.connect(ctx.destination);
            sub.start(t0);
            sub.stop(t0 + subDur + 0.008);
          }

          // Layer 4: High-Voltage Resonant Bandpass Lichtenberg Crackle (2-Tap Ionized Spark)
          if (nBuf) {
            const src1 = ctx.createBufferSource();
            src1.buffer = nBuf;
            const bp1 = ctx.createBiquadFilter();
            bp1.type = 'bandpass';
            bp1.Q.setValueAtTime(3.6, t0);
            bp1.frequency.setValueAtTime(4600, t0);
            bp1.frequency.exponentialRampToValueAtTime(2100, t0 + 0.020);
            const ng1 = ctx.createGain();
            ng1.gain.setValueAtTime(0.042 + tNorm * 0.022, t0);
            ng1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.022);
            src1.connect(bp1);
            bp1.connect(ng1);
            ng1.connect(ctx.destination);
            src1.start(t0, Math.random() * 0.8);
            src1.stop(t0 + 0.026);

            if (tClamp >= 5) {
              const tTap = t0 + 0.016;
              const src2 = ctx.createBufferSource();
              src2.buffer = nBuf;
              const bp2 = ctx.createBiquadFilter();
              bp2.type = 'bandpass';
              bp2.Q.setValueAtTime(4.2, tTap);
              bp2.frequency.setValueAtTime(3600, tTap);
              const ng2 = ctx.createGain();
              ng2.gain.setValueAtTime(0.028 + ((tClamp >= 7) ? 0.016 : 0), tTap);
              ng2.gain.exponentialRampToValueAtTime(0.0001, tTap + 0.024);
              src2.connect(bp2);
              bp2.connect(ng2);
              ng2.connect(ctx.destination);
              src2.start(tTap, Math.random() * 0.8);
              src2.stop(tTap + 0.028);
            }
          }
        }"""

    g = replace_once(g, old_dynamo_audio, new_dynamo_audio, "Dynamo Princess weapon audio v427")

    # 2. Tier VI -> Tier VII Direct Celestial Apotheosis Evolution (Zero Egg Snapshot / Zero Egg Fracture!)
    old_hatch_start = """    start(mode, now, targetTier = 6) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const tgt = (targetTier >= 7) ? 7 : 6;
      this.targetTier = tgt;
      this._initFractures();
      this._captureEggSnapshot(mKey, now, tgt >= 7 ? 6 : 5);
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, tgt >= 7 ? 14 : 11);
      if (tgt >= 7 && typeof audio !== 'undefined' && audio.playTier7Ascension) {
        audio.playTier7Ascension(mKey);
      } else if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },"""

    new_hatch_start = """    start(mode, now, targetTier = 6) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const tgt = (targetTier >= 7) ? 7 : 6;
      this.targetTier = tgt;
      if (tgt >= 7) {
        // Direct Tier VI -> Tier VII Celestial Evolution: NEVER revert to or capture an egg!
        this.eggCanvas = null;
        this.wedges = [];
      } else {
        this._initFractures();
        this._captureEggSnapshot(mKey, now, 5);
      }
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, tgt >= 7 ? 14 : 11);
      if (tgt >= 7 && typeof audio !== 'undefined' && audio.playTier7Ascension) {
        audio.playTier7Ascension(mKey);
      } else if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },"""

    g = replace_once(g, old_hatch_start, new_hatch_start, "Tier6HatchSystem.start direct T7 skip egg")

    old_render_head = """    render(ctx, mode, cx, cy, u, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const elapsed = Math.max(0, now - this.startTime);

      ctx.save();
      ctx.translate(cx, cy);"""

    new_render_head = """    _renderTier7Evolution(ctx, mKey, u, now, elapsed) {
      // DIRECT TIER VI -> TIER VII CELESTIAL APOTHEOSIS (ZERO EGGS / ZERO SHELL FRAGMENTS)
      const gColor = (mKey === 'meteor') ? 'amber' : (mKey === 'helix' ? 'pink' : 'cyan');
      const glowSprite = QuantumRenderer._getGlowSprite(gColor);
      const lTick = Math.floor(now / 42);

      if (elapsed < 420) {
        // PHASE 1 (0-420ms): ASCENSION CHARGE ON LIVE TIER VI CHARACTER
        const p1 = Math.max(0, Math.min(1, elapsed / 420));
        const liftY = -12 * u * this._easeOutCubic(p1);
        const pulseScale = 1.0 + 0.045 * Math.sin(p1 * Math.PI * 3);

        ctx.save();
        ctx.translate(0, liftY);
        ctx.scale(pulseScale, pulseScale);
        QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        if (mKey === 'dynamo') {
          const rOuter = (118 - 42 * p1) * u;
          const rInner = (92 - 28 * p1) * u;
          [
            { r: rOuter, col: `rgba(56, 189, 248, ${0.85 * p1})`, rot: now * 0.006 },
            { r: rInner, col: `rgba(192, 132, 252, ${0.82 * p1})`, rot: -now * 0.008 }
          ].forEach((ring) => {
            ctx.save();
            ctx.rotate(ring.rot);
            ctx.strokeStyle = ring.col;
            ctx.lineWidth = Math.max(1.8, 2.6 * u);
            ctx.beginPath();
            ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
            ctx.stroke();
            for (let k = 0; k < 4; k++) {
              const a = (k / 4) * Math.PI * 2;
              CoreKinematics._drawStarGlint(ctx, Math.cos(a) * ring.r, Math.sin(a) * ring.r, 7 * u, '#67e8f9');
            }
            ctx.restore();
          });
          for (let a = 0; a < 4; a++) {
            const ang = (a / 4) * Math.PI * 2 + p1 * 1.4;
            const rSrc = rOuter;
            CoreKinematics._drawLightningSprite(
              ctx,
              Math.cos(ang) * rSrc,
              Math.sin(ang) * rSrc,
              Math.cos(ang) * 18 * u,
              Math.sin(ang) * 18 * u,
              26 * u,
              lTick + a,
              0.88 * p1
            );
          }
        } else if (mKey === 'helix') {
          for (let st = 0; st < 2; st++) {
            ctx.beginPath();
            const baseA = st * Math.PI + now * 0.009;
            for (let s = 0; s <= 24; s++) {
              const f = s / 24;
              const r = (128 - 88 * p1 * (1 - f * 0.3)) * u * (1 - f * 0.72);
              const ang = baseA + f * Math.PI * 3.2;
              const px = Math.cos(ang) * r;
              const py = Math.sin(ang) * r * 0.85;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = st === 0 ? `rgba(103, 232, 249, ${0.88 * p1})` : `rgba(244, 114, 182, ${0.88 * p1})`;
            ctx.lineWidth = Math.max(2.0, 2.8 * u);
            ctx.stroke();
          }
          for (let m = 0; m < 12; m++) {
            const a = (m / 12) * Math.PI * 2 + p1 * 2.2;
            const rr = (122 - 90 * p1) * u;
            CoreKinematics._drawStarGlint(ctx, Math.cos(a) * rr, Math.sin(a) * rr, 8 * u, m % 2 === 0 ? '#67e8f9' : '#f472b6');
          }
        } else {
          const rRing = (114 - 40 * p1) * u;
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.90 * p1})`;
          ctx.lineWidth = Math.max(2.2, 3.2 * u);
          ctx.beginPath();
          ctx.arc(0, 0, rRing, 0, Math.PI * 2);
          ctx.stroke();
          for (let em = 0; em < 14; em++) {
            const ang = (em / 14) * Math.PI * 2 + p1 * 3.1;
            const rOut = (128 - 94 * p1) * u;
            const rIn = rOut + 18 * u;
            ctx.strokeStyle = em % 2 === 0 ? `rgba(253, 224, 71, ${0.92 * p1})` : `rgba(249, 115, 22, ${0.86 * p1})`;
            ctx.lineWidth = Math.max(1.8, 2.5 * u);
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * rIn, Math.sin(ang) * rIn);
            ctx.lineTo(Math.cos(ang + 0.14) * rOut, Math.sin(ang + 0.14) * rOut);
            ctx.stroke();
          }
        }

        const coreGlowR = (75 + 90 * p1) * u;
        ctx.globalAlpha = p1 * p1 * 0.72;
        ctx.drawImage(glowSprite, -coreGlowR, -coreGlowR, coreGlowR * 2, coreGlowR * 2);
        ctx.restore();
        ctx.restore();
      } else if (elapsed < 880) {
        // PHASE 2 (420-880ms): DIRECT METAMORPHOSIS TIER VI -> TIER VII + CELESTIAL SHOCKWAVE
        const p2 = Math.max(0, Math.min(1, (elapsed - 420) / 460));
        const liftY = -12 * u;

        ctx.save();
        ctx.translate(0, liftY);

        // Outgoing Tier VI fades seamlessly as Tier VII materializes
        if (p2 < 0.45) {
          const outT = p2 / 0.45;
          const outScale = 1.0 + 0.15 * outT;
          ctx.save();
          ctx.scale(outScale, outScale);
          ctx.globalAlpha = Math.max(0, 1.0 - outT);
          QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);
          ctx.restore();
        }

        // Incoming Tier VII Sovereign materializes in-place with back-ease unfurl
        if (p2 >= 0.12) {
          const pIn = Math.max(0, Math.min(1, (p2 - 0.12) / 0.70));
          const inScale = 0.86 + 0.14 * this._easeOutBack(pIn);
          ctx.save();
          ctx.scale(inScale, inScale);
          ctx.globalAlpha = Math.min(1, pIn * 1.65);
          QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pIn, settleProgress: 0.5 });
          ctx.restore();
        }

        // Twin Expanding Celestial Shockwave Rings + Mode Apotheosis Burst
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const r1 = (24 + 175 * this._easeOutCubic(p2)) * u;
        const r2 = (14 + 125 * this._easeOutCubic(p2)) * u;
        const aRing = Math.max(0, 1.0 - p2 * 0.92);
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(253, 224, 71, ${0.95 * aRing})` : (mKey === 'helix' ? `rgba(103, 232, 249, ${0.95 * aRing})` : `rgba(125, 211, 252, ${0.95 * aRing})`);
        ctx.lineWidth = Math.max(2.2, 4.5 * (1 - p2 * 0.6) * u);
        ctx.beginPath();
        ctx.arc(0, 0, r1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(249, 115, 22, ${0.85 * aRing})` : (mKey === 'helix' ? `rgba(244, 114, 182, ${0.85 * aRing})` : `rgba(192, 132, 252, ${0.85 * aRing})`);
        ctx.lineWidth = Math.max(1.6, 3.0 * (1 - p2 * 0.5) * u);
        ctx.beginPath();
        ctx.arc(0, 0, r2, 0, Math.PI * 2);
        ctx.stroke();

        if (mKey === 'dynamo') {
          const dob = VfxUltraAssets.dynamoOriginBurst;
          if (VfxUltraAssets.loaded && VfxUltraAssets.loaded.dynamoOriginBurst && dob && dob.naturalWidth > 0) {
            const bs = (150 + 135 * p2) * u;
            ctx.globalAlpha = Math.max(0, 1 - p2 * 0.78);
            ctx.drawImage(dob, -bs * 0.5, -bs * 0.5, bs, bs);
          }
          for (let b = 0; b < 6; b++) {
            const ang = (b / 6) * Math.PI * 2 + 0.25;
            CoreKinematics._drawLightningSprite(ctx, 0, 0, Math.cos(ang) * r1 * 0.92, Math.sin(ang) * r1 * 0.92, 34 * u, lTick + b * 2, aRing * 0.92);
          }
        } else if (mKey === 'helix') {
          for (let k = 0; k < 16; k++) {
            const ang = (k / 16) * Math.PI * 2 + p2 * 0.8;
            const rad = (28 + 145 * this._easeOutCubic(p2)) * u;
            CoreKinematics._drawStarGlint(ctx, Math.cos(ang) * rad, Math.sin(ang) * rad, (11 - 4 * p2) * u, k % 2 === 0 ? '#67e8f9' : '#f472b6');
          }
        } else {
          const mCor = VfxUltraAssets.novaCorona && VfxUltraAssets.novaCorona.meteor;
          if (VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaCorona && VfxUltraAssets.loaded.novaCorona.meteor && mCor && mCor.naturalWidth > 0) {
            const cs = (165 + 140 * p2) * u;
            ctx.globalAlpha = Math.max(0, 1 - p2 * 0.75);
            ctx.drawImage(mCor, -cs * 0.5, -cs * 0.5, cs, cs);
          }
          for (let eb = 0; eb < 24; eb++) {
            const ang = (eb / 24) * Math.PI * 2;
            const d0 = (26 + 115 * p2) * u;
            const d1 = d0 + 28 * u;
            ctx.strokeStyle = eb % 2 === 0 ? `rgba(253, 224, 71, ${aRing})` : `rgba(251, 146, 60, ${aRing * 0.9})`;
            ctx.lineWidth = Math.max(1.8, 2.8 * u);
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * d0, Math.sin(ang) * d0);
            ctx.lineTo(Math.cos(ang) * d1, Math.sin(ang) * d1);
            ctx.stroke();
          }
        }

        // Peak Radiance Halo Bloom around metamorphosis apex (p2 ~ 0.35)
        const peakAlpha = Math.sin(Math.min(1, p2 * 1.4) * Math.PI) * 0.78;
        const peakR = (110 + 75 * p2) * u;
        ctx.globalAlpha = Math.max(0, peakAlpha);
        ctx.drawImage(glowSprite, -peakR, -peakR, peakR * 2, peakR * 2);
        ctx.restore();
        ctx.restore();
      } else {
        // PHASE 3 (880-1400ms): SOVEREIGN UNFURL & ROYAL SETTLE
        const p3 = Math.max(0, Math.min(1, (elapsed - 880) / 520));
        const liftY = -12 * u * (1.0 - this._easeOutCubic(p3));
        const settleScale = 1.0 + 0.04 * (1.0 - this._easeOutCubic(p3));
        const haloFade = Math.max(0, 1.0 - p3);

        ctx.save();
        ctx.translate(0, liftY);
        ctx.scale(settleScale, settleScale);
        if (haloFade > 0.02) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.45 * haloFade;
          const hr = (145 + 25 * p3) * u;
          ctx.drawImage(glowSprite, -hr, -hr, hr * 2, hr * 2);
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.65 * haloFade})`;
          ctx.lineWidth = Math.max(1.8, 2.5 * u);
          ctx.beginPath();
          ctx.arc(0, 0, (125 + 45 * p3) * u, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: 1, settleProgress: p3 });
        ctx.restore();
      }
    },

    render(ctx, mode, cx, cy, u, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const elapsed = Math.max(0, now - this.startTime);

      ctx.save();
      ctx.translate(cx, cy);

      if (this.targetTier >= 7) {
        this._renderTier7Evolution(ctx, mKey, u, now, elapsed);
        ctx.restore();
        return;
      }"""

    g = replace_once(g, old_render_head, new_render_head, "Tier6HatchSystem.render branch direct T7 evolution")

    # 3. Expose targetTier and hasEggSnapshot in getHatchState for verification
    old_hatch_state = """    getHatchState: () => ({
      tier: state.coreTier,
      combo: state.combo,
      prevEvaluatedCombo: state.prevEvaluatedCombo,
      lock: state.tier6HatchLock,
      hatching: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.isActive() : false,
      hatchMode: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.mode : null
    })"""

    new_hatch_state = """    getHatchState: () => ({
      tier: state.coreTier,
      combo: state.combo,
      prevEvaluatedCombo: state.prevEvaluatedCombo,
      lock: state.tier6HatchLock,
      hatching: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.isActive() : false,
      hatchMode: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.mode : null,
      targetTier: (typeof Tier6HatchSystem !== 'undefined') ? Tier6HatchSystem.targetTier : null,
      hasEggSnapshot: (typeof Tier6HatchSystem !== 'undefined') ? Boolean(Tier6HatchSystem.eggCanvas) : false
    })"""

    g = replace_once(g, old_hatch_state, new_hatch_state, "getHatchState diagnostics")

    g = g.replace("arcade426_meteor_mouth", "arcade427_t7_evolution_audio")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
