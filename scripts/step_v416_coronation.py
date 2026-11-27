import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade415_brilliant_good_relics"
NEW_V = "arcade416_relic_trails_coronation"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")


def replace_exact(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    if cnt != 1:
        raise RuntimeError(f"[{label}] Expected 1 occurrence, found {cnt}")
    return text.replace(old, new, 1)


# 1. Add coronationBursts state, reset & cleanup
game = replace_exact(
    game,
    "    shieldImpacts: [],",
    "    shieldImpacts: [],\n    coronationBursts: [],",
    "coronation state",
)
game = replace_exact(
    game,
    "      this.shieldImpacts = [];",
    "      this.shieldImpacts = [];\n      this.coronationBursts = [];",
    "coronation reset",
)
game = replace_exact(
    game,
    """      for (let i = this.shieldImpacts.length - 1; i >= 0; i--) {
        if ((now - this.shieldImpacts[i].startTime) >= this.shieldImpacts[i].duration) {
          this.shieldImpacts.splice(i, 1);
        }
      }""",
    """      for (let i = this.shieldImpacts.length - 1; i >= 0; i--) {
        if ((now - this.shieldImpacts[i].startTime) >= this.shieldImpacts[i].duration) {
          this.shieldImpacts.splice(i, 1);
        }
      }
      for (let i = this.coronationBursts.length - 1; i >= 0; i--) {
        if ((now - this.coronationBursts[i].startTime) >= this.coronationBursts[i].duration) {
          this.coronationBursts.splice(i, 1);
        }
      }""",
    "coronation cleanup",
)

# 2. Add triggerPowerupCoronation helper + render inside drawGrazeSparks
game = replace_exact(
    game,
    """    getShieldOuterRadius(u, tier = 1) {""",
    """    triggerPowerupCoronation(x, y, now, accentColor = '#fbbf24') {
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

    getShieldOuterRadius(u, tier = 1) {""",
    "triggerPowerupCoronation",
)

game = replace_exact(
    game,
    """    drawGrazeSparks(ctx, u) {
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
    },""",
    """    drawGrazeSparks(ctx, u) {
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
    },""",
    "render coronationBursts",
)

# 3. Silky 24K Gold & Jewel Stardust Ribbon Wake for Powered-Up Good Relics
game = replace_exact(
    game,
    """      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      if (!isHazard) {""",
    """      ctx.save();
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
        }""",
    "luxury wake ribbon",
)

# 4. Trigger coronation starburst on all 7 Powered-Up Good Node catches (direct + missile)
game = replace_exact(
    game,
    """              if (pt.nodeClass === 'cluster') {
                state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
              } else if (pt.nodeClass === 'supercharge') {
                state.applyBuff('hyper', 'HYPER SURGE', '#fbbf24', '⚡', 5000, now);
              } else if (pt.nodeClass === 'chronos') {
                state.applyBuff('chronos', 'CHRONOS STASIS', '#22d3ee', '⏳', 4500, now);
              } else if (pt.nodeClass === 'singularity') {
                state.applyBuff('singularity', 'GRAVITON VACUUM', '#38bdf8', '🧲', 3500, now);
              } else if (pt.nodeClass === 'catalyst') {""",
    """              if (pt.nodeClass === 'cluster') {
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
              } else if (pt.nodeClass === 'catalyst') {""",
    "missile coronation triggers",
)

game = replace_exact(
    game,
    """                state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
                if (state.coreTier === 5) audio.playTier5Ascension();
                else audio.playOverdriveFanfare();
              } else if (pt.nodeClass === 'shield') {
                const sMeta = getRealmShieldMeta(mMode);
                state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
                CoreKinematics.triggerShieldDeflect(m.x, m.y, now, mMode);
              } else if (pt.nodeClass === 'missiles') {
                state.applyBuff('missiles', 'ALLIED MISSILES', '#38bdf8', '🚀', 4000, now);
                this.fireMissiles(m.x, m.y, now, state.particles, mMode);
              }""",
    """                state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
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
              }""",
    "missile shield/catalyst/missiles coronation",
)

game = replace_exact(
    game,
    """            state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
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
            if (state.coreTier === 5) audio.playTier5Ascension();
            else audio.playOverdriveFanfare();

          } else if (p.nodeClass === 'shield') {
            const sMeta = getRealmShieldMeta(state.catcherType || 'dynamo');
            state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
            CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY - 80, now, state.catcherType || 'dynamo', -Math.PI * 0.5);
            audio.playPulseCharged();
            classMultiplier = 3.0;

          } else if (p.nodeClass === 'missiles') {
            const mColor = (state.catcherType === 'meteor') ? '#f97316' : ((state.catcherType === 'helix') ? '#22d3ee' : '#38bdf8');
            state.applyBuff('missiles', 'ALLIED MISSILES', mColor, '🚀', 4000, now);
            CoreKinematics.fireMissiles(catcherPixelX, catcherPixelY, now, state.particles, state.catcherType || 'dynamo');""",
    """            state.applyBuff('cluster', '2X CLUSTER', '#38bdf8', '✨', 5000, now);
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
            CoreKinematics.fireMissiles(catcherPixelX, catcherPixelY, now, state.particles, state.catcherType || 'dynamo');""",
    "direct catch coronation triggers",
)

game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v415_brilliant_good_relics", "orlandochrome-arcade-v416_relic_trails_coronation")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V416_OK")
