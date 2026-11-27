import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")

def replace_exact(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"[{label}] Expected 1 occurrence, found {count}")
    return text.replace(old, new, 1)

# 1. Patch game.js
game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")

# A. Add getRealmShieldMeta alongside isHazardNode
old_hazard_fn = """  // Helper: Identifies any hazard trap or anomaly archetype
  function isHazardNode(nodeClass) {
    return nodeClass === 'volatile' || nodeClass === 'seeker' || nodeClass === 'phantom' || nodeClass === 'fragmentation' || nodeClass === 'vortex' || nodeClass === 'gravity_well' || nodeClass === 'pulsar_mine' || nodeClass === 'emp_glitch' || nodeClass === 'emp_detonator' || nodeClass === 'tachyon_fracture' || nodeClass === 'phase_stalker' || nodeClass === 'plasma_flare' || nodeClass === 'hyper_comet' || nodeClass === 'corruptor_laser' || nodeClass === 'broken_arc';
  }"""

new_hazard_fn = """  // Helper: Identifies any hazard trap or anomaly archetype
  function isHazardNode(nodeClass) {
    return nodeClass === 'volatile' || nodeClass === 'seeker' || nodeClass === 'phantom' || nodeClass === 'fragmentation' || nodeClass === 'vortex' || nodeClass === 'gravity_well' || nodeClass === 'pulsar_mine' || nodeClass === 'emp_glitch' || nodeClass === 'emp_detonator' || nodeClass === 'tachyon_fracture' || nodeClass === 'phase_stalker' || nodeClass === 'plasma_flare' || nodeClass === 'hyper_comet' || nodeClass === 'corruptor_laser' || nodeClass === 'broken_arc';
  }

  function getRealmShieldMeta(mode) {
    if (mode === 'helix') {
      return { name: 'PRISM AEGIS', badge: '🛡️ PRISM SHIELD', color: '#22d3ee', icon: '🛡️' };
    }
    if (mode === 'meteor') {
      return { name: 'CALDERA BULWARK', badge: '🛡️ BULWARK', color: '#fb923c', icon: '🛡️' };
    }
    return { name: 'FARADAY AEGIS', badge: '🛡️ AEGIS SHIELD', color: '#38bdf8', icon: '🛡️' };
  }"""
game = replace_exact(game, old_hazard_fn, new_hazard_fn, "getRealmShieldMeta")

# B. Add shieldImpacts state + reset + update cleanup
old_shield_state = """    grazeSparks: [],
    shieldDeflectFlash: 0,"""
new_shield_state = """    grazeSparks: [],
    shieldDeflectFlash: 0,
    shieldImpacts: [],"""
game = replace_exact(game, old_shield_state, new_shield_state, "shieldImpacts state")

old_shield_reset = """      this.grazeSparks = [];
      this.shieldDeflectFlash = 0;"""
new_shield_reset = """      this.grazeSparks = [];
      this.shieldDeflectFlash = 0;
      this.shieldImpacts = [];"""
game = replace_exact(game, old_shield_reset, new_shield_reset, "shieldImpacts reset")

old_spark_update = """      this.shieldDeflectFlash = Math.max(0, this.shieldDeflectFlash - 0.05 * dt);
    },"""
new_spark_update = """      this.shieldDeflectFlash = Math.max(0, this.shieldDeflectFlash - 0.05 * dt);
      for (let i = this.shieldImpacts.length - 1; i >= 0; i--) {
        if ((now - this.shieldImpacts[i].startTime) >= this.shieldImpacts[i].duration) {
          this.shieldImpacts.splice(i, 1);
        }
      }
    },"""
game = replace_exact(game, old_spark_update, new_spark_update, "shieldImpacts cleanup")

# C. Upgrade triggerShieldDeflect + add getShieldOuterRadius
old_deflect = """    triggerShieldDeflect(x, y, now) {
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
    },"""

new_deflect = """    getShieldOuterRadius(u, tier = 1) {
      const tierBoost = (tier >= 6) ? 1.15 : 1.0;
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
    },"""
game = replace_exact(game, old_deflect, new_deflect, "triggerShieldDeflect + getShieldOuterRadius")

# D. Rebuild drawAegisForcefield (zero shadowBlur, 3 unmistakable realm-unique armored shields + battering prow + timer gauge + crush shockwaves)
old_forcefield = """    drawAegisForcefield(ctx, cx, cy, u, now, timeLeft = 5000, mode = 'dynamo') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = 'lighter';

      const baseRadius = Math.max(92, 142 * u);
      const pulse = 1.0 + 0.03 * Math.sin(now * 0.008);
      const r = baseRadius * pulse;
      const isExpiring = timeLeft < 1200;
      const warnPulse = isExpiring ? (0.5 + 0.5 * Math.sin(now * 0.025)) : 1.0;

      const isDyn = (mode === 'dynamo' || mode === 'realm');
      const isHel = (mode === 'helix');
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'amber');
      const ringCol = isDyn ? `rgba(56, 189, 248, ${0.88 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.88 * warnPulse})` : `rgba(251, 191, 36, ${0.90 * warnPulse})`);
      const innerCol = isDyn ? `rgba(192, 132, 252, ${0.58 * warnPulse})` : (isHel ? `rgba(110, 231, 183, ${0.58 * warnPulse})` : `rgba(249, 115, 22, ${0.65 * warnPulse})`);

      // 1. Pre-baked GPU halo blit (zero per-frame gradient allocation!)
      ctx.globalAlpha = 0.35 * warnPulse;
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.1, -r * 1.1, r * 2.2, r * 2.2);
      ctx.globalAlpha = 1.0;

      // 2. Crisp solid outer containment ring
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = ringCol;
      ctx.lineWidth = 3.0;
      ctx.stroke();

      // 3. Counter-rotating dashed inner energy ring
      ctx.save();
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -now * 0.03;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.strokeStyle = innerCol;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 4. Shield Deflection Shockwave Flash (Shared Across Modes)
      if (this.shieldDeflectFlash > 0.02) {
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.1 + (1.0 - this.shieldDeflectFlash) * 0.4), 0, Math.PI * 2);
        const flashColor = isDyn ? '#38bdf8' : (isHel ? '#22d3ee' : '#fbbf24');
        ctx.strokeStyle = flashColor;
        ctx.globalAlpha = this.shieldDeflectFlash * 0.95;
        ctx.lineWidth = 4.5;
        ctx.stroke();
      }

      ctx.restore();
    },"""

new_forcefield = """    _drawApexShieldCrest(ctx, r, mode, warnPulse, now) {
      ctx.save();
      ctx.translate(0, -r * 1.02);
      const cw = Math.max(15, r * 0.165);
      const ch = Math.max(19, r * 0.215);

      ctx.globalCompositeOperation = 'source-over';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (mode === 'helix') {
        // Winged Crystal Heater Shield Crest + Forward Lance Prow
        for (let side = -1; side <= 1; side += 2) {
          ctx.beginPath();
          ctx.moveTo(side * cw * 0.9, -ch * 0.35);
          ctx.lineTo(side * cw * 2.25, -ch * 0.82);
          ctx.lineTo(side * cw * 1.65, ch * 0.18);
          ctx.closePath();
          ctx.fillStyle = side < 0 ? `rgba(8, 145, 178, ${0.88 * warnPulse})` : `rgba(134, 25, 143, ${0.88 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(224, 242, 254, ${0.9 * warnPulse})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, -ch * 1.08);
        ctx.lineTo(cw, -ch * 0.55);
        ctx.lineTo(cw * 0.78, ch * 0.38);
        ctx.lineTo(0, ch * 0.88);
        ctx.lineTo(-cw * 0.78, ch * 0.38);
        ctx.lineTo(-cw, -ch * 0.55);
        ctx.closePath();
        ctx.fillStyle = `rgba(12, 24, 48, ${0.92 * warnPulse})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.98 * warnPulse})`;
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Split prism facet
        ctx.beginPath();
        ctx.moveTo(0, -ch * 0.86);
        ctx.lineTo(0, ch * 0.72);
        ctx.strokeStyle = `rgba(232, 121, 249, ${0.92 * warnPulse})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();
      } else if (mode === 'meteor') {
        // Forged Dragon-Horned Caldera Bulwark Shield Crest
        for (let side = -1; side <= 1; side += 2) {
          ctx.beginPath();
          ctx.moveTo(side * cw * 0.72, -ch * 0.45);
          ctx.lineTo(side * cw * 2.15, -ch * 1.15);
          ctx.lineTo(side * cw * 1.45, ch * 0.12);
          ctx.closePath();
          ctx.fillStyle = `rgba(41, 18, 8, ${0.94 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.95 * warnPulse})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, -ch * 1.05);
        ctx.lineTo(cw * 1.12, -ch * 0.55);
        ctx.lineTo(cw * 0.88, ch * 0.35);
        ctx.lineTo(0, ch * 0.92);
        ctx.lineTo(-cw * 0.88, ch * 0.35);
        ctx.lineTo(-cw * 1.12, -ch * 0.55);
        ctx.closePath();
        ctx.fillStyle = `rgba(28, 16, 12, ${0.96 * warnPulse})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(253, 224, 71, ${0.98 * warnPulse})`;
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // Glowing Magma Chevron Rune
        ctx.beginPath();
        ctx.moveTo(-cw * 0.52, -ch * 0.25);
        ctx.lineTo(0, -ch * 0.65);
        ctx.lineTo(cw * 0.52, -ch * 0.25);
        ctx.moveTo(-cw * 0.40, ch * 0.14);
        ctx.lineTo(0, -ch * 0.24);
        ctx.lineTo(cw * 0.40, ch * 0.14);
        ctx.strokeStyle = `rgba(251, 146, 60, ${0.98 * warnPulse})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      } else {
        // Dynamo Royal Faraday Bastion Kite Shield Crest
        for (let side = -1; side <= 1; side += 2) {
          ctx.beginPath();
          ctx.moveTo(side * cw * 0.88, -ch * 0.42);
          ctx.lineTo(side * cw * 2.15, -ch * 0.68);
          ctx.lineTo(side * cw * 1.65, ch * 0.20);
          ctx.closePath();
          ctx.fillStyle = `rgba(12, 74, 110, ${0.90 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.92 * warnPulse})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, -ch * 1.05);
        ctx.lineTo(cw * 1.04, -ch * 0.58);
        ctx.lineTo(cw * 0.78, ch * 0.36);
        ctx.lineTo(0, ch * 0.90);
        ctx.lineTo(-cw * 0.78, ch * 0.36);
        ctx.lineTo(-cw * 1.04, -ch * 0.58);
        ctx.closePath();
        ctx.fillStyle = `rgba(15, 23, 42, ${0.94 * warnPulse})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.98 * warnPulse})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Electric Bolt Emblem inside Shield Crest
        ctx.beginPath();
        ctx.moveTo(cw * 0.14, -ch * 0.60);
        ctx.lineTo(-cw * 0.24, -ch * 0.04);
        ctx.lineTo(cw * 0.12, -ch * 0.04);
        ctx.lineTo(-cw * 0.18, ch * 0.52);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.98 * warnPulse})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
      ctx.restore();
    },

    drawAegisForcefield(ctx, cx, cy, u, now, timeLeft = 5000, mode = 'dynamo') {
      ctx.save();
      ctx.translate(cx, cy);

      const curTier = (typeof state !== 'undefined' && state.coreTier) ? state.coreTier : 1;
      const baseRadius = this.getShieldOuterRadius(u, curTier);
      const pulse = 1.0 + 0.018 * Math.sin(now * 0.008);
      const r = baseRadius * pulse;
      const isExpiring = timeLeft < 1200;
      const warnPulse = isExpiring ? (0.45 + 0.55 * Math.sin(now * 0.028)) : 1.0;

      const isDyn = (mode === 'dynamo' || mode === 'realm');
      const isHel = (mode === 'helix');
      const effMode = isDyn ? 'dynamo' : (isHel ? 'helix' : 'meteor');
      const rot = now * (effMode === 'meteor' ? -0.00055 : 0.00065);
      const maxDur = (typeof state !== 'undefined' && state.getBuff) ? (state.getBuff('shield', now)?.maxDur || 5000) : 5000;
      const pctLeft = Math.max(0.02, Math.min(1, timeLeft / Math.max(5000, maxDur)));

      // 0. Soft Backdrop Halo (lightweighted pre-baked sprite blit)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.26 * warnPulse;
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'gold');
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.15, -r * 1.15, r * 2.3, r * 2.3);
      ctx.restore();

      if (effMode === 'dynamo') {
        // ════════════════════════════════════════════════════════════════
        // DYNAMO: FARADAY BASTION AEGIS (8 Armored Capacitor Plates + V-Prow + Lightning Links)
        // ════════════════════════════════════════════════════════════════
        const segs = 8;
        const step = (Math.PI * 2) / segs;

        // Pass 1: Solid Steel-Sapphire Armor Plates (`source-over` so it looks armored & strong!)
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        for (let s = 0; s < segs; s++) {
          const a0 = rot + s * step + 0.075;
          const a1 = rot + (s + 1) * step - 0.075;
          const am = (a0 + a1) * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.01, a0, a1);
          ctx.arc(0, 0, r * 0.87, a1, a0, true);
          ctx.closePath();
          ctx.fillStyle = `rgba(12, 34, 68, ${0.62 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.92 * warnPulse})`;
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Chamfered Gold Capacitor Clamp at center of each armor plate
          const bx = Math.cos(am) * (r * 0.95);
          const by = Math.sin(am) * (r * 0.95);
          ctx.fillStyle = `rgba(251, 191, 36, ${0.95 * warnPulse})`;
          ctx.beginPath();
          ctx.arc(bx, by, 3.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Pass 2: Crackling Faraday Lightning Linking Armor Nodes + Inner Bastion Ring
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const tick = Math.floor(now / 52);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let s = 0; s < segs; s++) {
          const aStart = rot + s * step - 0.06;
          const aEnd = rot + s * step + 0.06;
          const sx = Math.cos(aStart) * (r * 0.98);
          const sy = Math.sin(aStart) * (r * 0.98);
          const ex = Math.cos(aEnd) * (r * 0.98);
          const ey = Math.sin(aEnd) * (r * 0.98);
          const mx = (sx + ex) * 0.5 + Math.cos(s * 2.1 + tick * 3.7) * 7.5;
          const my = (sy + ey) * 0.5 + Math.sin(s * 2.9 + tick * 4.3) * 7.5;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(mx, my);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.95 * warnPulse})`;
          ctx.lineWidth = 2.6;
          ctx.stroke();
        }

        // Remaining Duration Royal Gold Arc
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.82, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pctLeft);
        ctx.strokeStyle = isExpiring ? `rgba(254, 240, 138, ${warnPulse})` : 'rgba(251, 191, 36, 0.85)';
        ctx.lineWidth = 3.2;
        ctx.stroke();
        ctx.restore();

      } else if (effMode === 'helix') {
        // ════════════════════════════════════════════════════════════════
        // HELIX: PRISMATIC GEODESIC CRYSTAL AEGIS (Stained-Glass Prism Facets + Braided DNA Wall)
        // ════════════════════════════════════════════════════════════════
        const segs = 12;
        const step = (Math.PI * 2) / segs;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        for (let s = 0; s < segs; s++) {
          const a0 = rot + s * step;
          const a1 = rot + (s + 1) * step;
          const am = (a0 + a1) * 0.5;
          const rOuter = r * 1.03;
          const rInner = r * 0.88;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0) * r * 0.96, Math.sin(a0) * r * 0.96);
          ctx.lineTo(Math.cos(am) * rOuter, Math.sin(am) * rOuter);
          ctx.lineTo(Math.cos(a1) * r * 0.96, Math.sin(a1) * r * 0.96);
          ctx.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
          ctx.lineTo(Math.cos(a0) * rInner, Math.sin(a0) * rInner);
          ctx.closePath();

          ctx.fillStyle = (s % 2 === 0)
            ? `rgba(8, 145, 178, ${0.42 * warnPulse})`
            : `rgba(162, 28, 175, ${0.38 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = (s % 2 === 0)
            ? `rgba(103, 232, 249, ${0.95 * warnPulse})`
            : `rgba(240, 171, 252, ${0.92 * warnPulse})`;
          ctx.lineWidth = 2.1;
          ctx.stroke();
        }
        ctx.restore();

        // Pass 2: Twin Braided Cyan & Magenta Helix Energy Strands around perimeter
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const strandPts = 48;
        for (let strand = -1; strand <= 1; strand += 2) {
          ctx.beginPath();
          for (let p = 0; p <= strandPts; p++) {
            const ang = (p / strandPts) * Math.PI * 2;
            const wave = Math.sin(ang * 6 - now * 0.005 * strand) * (r * 0.042) * strand;
            const rr = r * 0.94 + wave;
            const px = Math.cos(ang) * rr;
            const py = Math.sin(ang) * rr;
            if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = strand > 0
            ? `rgba(34, 211, 238, ${0.88 * warnPulse})`
            : `rgba(232, 121, 249, ${0.85 * warnPulse})`;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }

        // Remaining Duration Crystal Gauge
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.83, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pctLeft);
        ctx.strokeStyle = isExpiring ? `rgba(255, 255, 255, ${warnPulse})` : 'rgba(103, 232, 249, 0.90)';
        ctx.lineWidth = 3.0;
        ctx.stroke();
        ctx.restore();

      } else {
        // ════════════════════════════════════════════════════════════════
        // METEOR: MOLTEN OBSIDIAN-GOLD DRAGON BULWARK (Spiked Forged Bastion Plates + Magma Seams)
        // ════════════════════════════════════════════════════════════════
        const segs = 8;
        const step = (Math.PI * 2) / segs;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        for (let s = 0; s < segs; s++) {
          const a0 = rot + s * step + 0.05;
          const a1 = rot + (s + 1) * step - 0.05;
          const am = (a0 + a1) * 0.5;
          // Outward serrated battering spike per bastion plate!
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0) * r * 0.88, Math.sin(a0) * r * 0.88);
          ctx.lineTo(Math.cos(a0 + 0.14) * r * 1.00, Math.sin(a0 + 0.14) * r * 1.00);
          ctx.lineTo(Math.cos(am) * r * 1.09, Math.sin(am) * r * 1.09);
          ctx.lineTo(Math.cos(a1 - 0.14) * r * 1.00, Math.sin(a1 - 0.14) * r * 1.00);
          ctx.lineTo(Math.cos(a1) * r * 0.88, Math.sin(a1) * r * 0.88);
          ctx.closePath();
          ctx.fillStyle = `rgba(38, 17, 9, ${0.78 * warnPulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.96 * warnPulse})`;
          ctx.lineWidth = 2.6;
          ctx.stroke();

          // Forged Gold Inner Edge Highlight on Spike
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0 + 0.16) * r * 0.96, Math.sin(a0 + 0.16) * r * 0.96);
          ctx.lineTo(Math.cos(am) * r * 1.05, Math.sin(am) * r * 1.05);
          ctx.lineTo(Math.cos(a1 - 0.16) * r * 0.96, Math.sin(a1 - 0.16) * r * 0.96);
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.94 * warnPulse})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
        ctx.restore();

        // Pass 2: Molten Magma Armor Ring & Remaining Time Gauge
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.87, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.70 * warnPulse})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 0.81, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pctLeft);
        ctx.strokeStyle = isExpiring ? `rgba(255, 255, 255, ${warnPulse})` : 'rgba(253, 224, 71, 0.92)';
        ctx.lineWidth = 3.4;
        ctx.stroke();
        ctx.restore();
      }

      // Forward Heraldic Shield Crest Emblem (Mounted at Upper Ram Apex for Instant Shield Identity!)
      this._drawApexShieldCrest(ctx, r, effMode, warnPulse, now);

      // Directional Enemy-Crushing Impact Shockwaves right on the Shield Outer Wall!
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
          const crushCol = (effMode === 'helix') ? '#22d3ee' : ((effMode === 'meteor') ? '#fbbf24' : '#38bdf8');

          // Armor-wall crush crescent shockwave
          ctx.globalAlpha = fade * 0.95;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.6 * fade;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1.02 + prog * 0.14), imp.angle - 0.55, imp.angle + 0.55);
          ctx.stroke();

          ctx.strokeStyle = crushCol;
          ctx.lineWidth = 5.5 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 12 + prog * 42, imp.angle - 1.15, imp.angle + 1.15);
          ctx.stroke();

          // Outward shatter lances
          for (let ray = -2; ray <= 2; ray++) {
            const ra = imp.angle + ray * 0.28;
            const r0 = 8 + prog * 14;
            const r1 = 24 + prog * 48;
            ctx.beginPath();
            ctx.moveTo(ix + Math.cos(ra) * r0, iy + Math.sin(ra) * r0);
            ctx.lineTo(ix + Math.cos(ra) * r1, iy + Math.sin(ra) * r1);
            ctx.strokeStyle = (ray % 2 === 0) ? '#ffffff' : crushCol;
            ctx.lineWidth = 2.4 * fade;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Full-dome Deflection Shockwave Flash on Activation or Heavy Impact
      if (this.shieldDeflectFlash > 0.04) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.06 + (1.0 - this.shieldDeflectFlash) * 0.26), 0, Math.PI * 2);
        const flashColor = isDyn ? '#38bdf8' : (isHel ? '#22d3ee' : '#fbbf24');
        ctx.strokeStyle = flashColor;
        ctx.globalAlpha = this.shieldDeflectFlash * 0.82;
        ctx.lineWidth = 4.0;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    },"""
game = replace_exact(game, old_forcefield, new_forcefield, "drawAegisForcefield")

# E. Upgrade Falling Shield Power-Up Pickup Rendering (p.nodeClass === 'shield') + Realm-Unique Badges
old_pickup_shield = """        } else if (p.nodeClass === 'shield') {
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
          ctx.globalAlpha = 0.92;
          ctx.drawImage(this._getGlowSprite('gold'), -pCoreR, -pCoreR, pCoreR * 2, pCoreR * 2);
          ctx.globalAlpha = 1.0;
          ctx.restore();"""

new_pickup_shield = """        } else if (p.nodeClass === 'shield') {
          // UNMISTAKABLE 3D REALM-BESPOKE HERALDIC SHIELD POWER-UP PICKUP
          const sMode = (mode === 'helix') ? 'helix' : ((mode === 'meteor') ? 'meteor' : 'dynamo');
          const rotS = now * 0.003 + animPhase;

          // 1. Rotating Armored Bastion Guard Brackets around the Power-Up
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const guardR = targetR * 1.32;
          const arcCol = (sMode === 'helix') ? '#22d3ee' : ((sMode === 'meteor') ? '#fb923c' : '#fde047');
          const secCol = (sMode === 'helix') ? '#e879f9' : ((sMode === 'meteor') ? '#fde047' : '#38bdf8');
          for (let g = 0; g < 4; g++) {
            const ga = rotS + g * (Math.PI * 0.5);
            ctx.beginPath();
            ctx.arc(0, 0, guardR, ga - 0.34, ga + 0.34);
            ctx.strokeStyle = (g % 2 === 0) ? arcCol : secCol;
            ctx.lineWidth = 2.8 * scale;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
          ctx.restore();

          // 2. Sculpted 3D Heraldic Shield Emblem (Opaque Dark Metal/Crystal Bevel + Gleaming Trim)
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          const sw = targetR * 0.72;
          const sh = targetR * 0.88;

          if (sMode === 'helix') {
            // Side translucent crystal wing-guards
            for (let side = -1; side <= 1; side += 2) {
              ctx.beginPath();
              ctx.moveTo(side * sw * 0.88, -sh * 0.34);
              ctx.lineTo(side * sw * 1.52, -sh * 0.65);
              ctx.lineTo(side * sw * 1.18, sh * 0.14);
              ctx.closePath();
              ctx.fillStyle = side < 0 ? 'rgba(6, 182, 212, 0.85)' : 'rgba(192, 38, 211, 0.85)';
              ctx.fill();
              ctx.strokeStyle = '#f0f9ff';
              ctx.lineWidth = 1.6 * scale;
              ctx.stroke();
            }
            // Faceted Diamond-Cut Crystal Kite Shield Body
            ctx.beginPath();
            ctx.moveTo(0, -sh);
            ctx.lineTo(sw, -sh * 0.52);
            ctx.lineTo(sw * 0.76, sh * 0.32);
            ctx.lineTo(0, sh);
            ctx.lineTo(-sw * 0.76, sh * 0.32);
            ctx.lineTo(-sw, -sh * 0.52);
            ctx.closePath();
            ctx.fillStyle = '#082f49';
            ctx.fill();
            // Right stained-glass amethyst half-facet
            ctx.beginPath();
            ctx.moveTo(0, -sh);
            ctx.lineTo(sw, -sh * 0.52);
            ctx.lineTo(sw * 0.76, sh * 0.32);
            ctx.lineTo(0, sh);
            ctx.closePath();
            ctx.fillStyle = 'rgba(162, 28, 175, 0.68)';
            ctx.fill();
            // Platinum-Cyan Outer Bevel Rim & Helix Rune
            ctx.beginPath();
            ctx.moveTo(0, -sh);
            ctx.lineTo(sw, -sh * 0.52);
            ctx.lineTo(sw * 0.76, sh * 0.32);
            ctx.lineTo(0, sh);
            ctx.lineTo(-sw * 0.76, sh * 0.32);
            ctx.lineTo(-sw, -sh * 0.52);
            ctx.closePath();
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 3.0 * scale;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -sh * 0.68);
            ctx.lineTo(0, sh * 0.68);
            ctx.moveTo(-sw * 0.42, -sh * 0.10);
            ctx.lineTo(sw * 0.42, -sh * 0.10);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.0 * scale;
            ctx.stroke();

          } else if (sMode === 'meteor') {
            // Spiked Obsidian & Molten-Gold Dragon Bulwark Shield
            ctx.beginPath();
            ctx.moveTo(0, -sh * 1.06);
            ctx.lineTo(sw * 0.56, -sh * 0.72);
            ctx.lineTo(sw * 1.18, -sh * 0.88);
            ctx.lineTo(sw * 0.96, -sh * 0.10);
            ctx.lineTo(sw * 0.72, sh * 0.44);
            ctx.lineTo(0, sh * 1.04);
            ctx.lineTo(-sw * 0.72, sh * 0.44);
            ctx.lineTo(-sw * 0.96, -sh * 0.10);
            ctx.lineTo(-sw * 1.18, -sh * 0.88);
            ctx.lineTo(-sw * 0.56, -sh * 0.72);
            ctx.closePath();
            ctx.fillStyle = '#1c0f08';
            ctx.fill();
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 3.2 * scale;
            ctx.stroke();

            // Glowing Molten Chevron Crest inside Bulwark
            ctx.beginPath();
            ctx.moveTo(-sw * 0.52, -sh * 0.22);
            ctx.lineTo(0, -sh * 0.66);
            ctx.lineTo(sw * 0.52, -sh * 0.22);
            ctx.moveTo(-sw * 0.40, sh * 0.20);
            ctx.lineTo(0, -sh * 0.22);
            ctx.lineTo(sw * 0.40, sh * 0.20);
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();

          } else {
            // Royal Sapphire-Gold Faraday Kite Shield
            ctx.beginPath();
            ctx.moveTo(0, -sh * 1.02);
            ctx.lineTo(sw * 1.02, -sh * 0.56);
            ctx.lineTo(sw * 0.78, sh * 0.34);
            ctx.lineTo(0, sh * 1.02);
            ctx.lineTo(-sw * 0.78, sh * 0.34);
            ctx.lineTo(-sw * 1.02, -sh * 0.56);
            ctx.closePath();
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            // Right specular royal blue facet
            ctx.beginPath();
            ctx.moveTo(0, -sh * 1.02);
            ctx.lineTo(sw * 1.02, -sh * 0.56);
            ctx.lineTo(sw * 0.78, sh * 0.34);
            ctx.lineTo(0, sh * 1.02);
            ctx.closePath();
            ctx.fillStyle = 'rgba(30, 64, 175, 0.78)';
            ctx.fill();
            // 24K Gold Bevel Trim
            ctx.beginPath();
            ctx.moveTo(0, -sh * 1.02);
            ctx.lineTo(sw * 1.02, -sh * 0.56);
            ctx.lineTo(sw * 0.78, sh * 0.34);
            ctx.lineTo(0, sh * 1.02);
            ctx.lineTo(-sw * 0.78, sh * 0.34);
            ctx.lineTo(-sw * 1.02, -sh * 0.56);
            ctx.closePath();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.2 * scale;
            ctx.stroke();

            // Cyan Faraday Lightning Bolt inside Shield
            ctx.beginPath();
            ctx.moveTo(sw * 0.16, -sh * 0.58);
            ctx.lineTo(-sw * 0.28, -sh * 0.02);
            ctx.lineTo(sw * 0.14, -sh * 0.02);
            ctx.lineTo(-sw * 0.20, sh * 0.56);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();
          }
          ctx.restore();"""
game = replace_exact(game, old_pickup_shield, new_pickup_shield, "pickup shield emblem")

old_shield_badge = """          shield: { text: '🛡️ SHIELD', color: '#f59e0b', bg: 'rgba(10, 14, 28, 0.88)', border: '#fbbf24' },"""
new_shield_badge = """          shield: {
            text: getRealmShieldMeta(mode).badge,
            color: getRealmShieldMeta(mode).color,
            bg: 'rgba(10, 14, 28, 0.90)',
            border: (mode === 'helix') ? '#22d3ee' : ((mode === 'meteor') ? '#fb923c' : '#fbbf24')
          },"""
game = replace_exact(game, old_shield_badge, new_shield_badge, "shield badge metadata")

# F. Update Voidbloom + Boss + Main Hazard Collision Perimeters & Directional Shield Crush Effects
old_vb_hit = """      // Respect Aegis Forcefield Shield Buff & Invulnerability (e.g. Caldera Nova 1.5s invuln)
      if (state.hasBuff('shield', now) || (state.playerInvulnUntil && now < state.playerInvulnUntil)) {
        state.score += 200;
        CoreKinematics.triggerShieldDeflect(cx, cy, now);
        audio.playPerfectCatch(state.combo);
        return;
      }"""

new_vb_hit = """      // Respect Aegis Forcefield Shield Buff & Invulnerability (e.g. Caldera Nova 1.5s invuln)
      if (state.hasBuff('shield', now) || (state.playerInvulnUntil && now < state.playerInvulnUntil)) {
        state.score += 200;
        const cAng = Math.atan2(vb.y - cy, vb.x - cx);
        CoreKinematics.triggerShieldDeflect(vb.x, vb.y, now, state.catcherType || 'dynamo', cAng);
        audio.playPerfectCatch(state.combo);
        return;
      }"""
game = replace_exact(game, old_vb_hit, new_vb_hit, "voidbloom shield deflect")

old_vb_dist = """        // Ship Collision Check
        if (Math.hypot(vb.x - cx, vb.y - cy) < vb.radius * 0.86 + shipHitR) {"""
new_vb_dist = """        // Ship / Outer Armored Shield Perimeter Collision Check
        const vbShieldDefR = state.hasBuff('shield', now)
          ? Math.max(shipHitR, CoreKinematics.getShieldOuterRadius(u, state.coreTier) * 0.96)
          : shipHitR;
        if (Math.hypot(vb.x - cx, vb.y - cy) < vb.radius * 0.86 + vbShieldDefR) {"""
game = replace_exact(game, old_vb_dist, new_vb_dist, "voidbloom outer shield radius")

old_boss_bullet = """          // Player Collision Check
          const dist = Math.hypot(cx - b.x, cy - b.y);
          if (dist < coreHitR * 0.75 + r) {
            state.bossBullets.splice(i, 1);
            this._onPlayerHitByBoss(cx, cy, now);
          }"""
new_boss_bullet = """          // Player / Outer Armored Shield Perimeter Collision Check
          const dist = Math.hypot(cx - b.x, cy - b.y);
          const hasBossShield = state.hasBuff('shield', now);
          const bDefR = hasBossShield ? CoreKinematics.getShieldOuterRadius(u, state.coreTier) : (coreHitR * 0.75);
          if (dist < bDefR + r) {
            state.bossBullets.splice(i, 1);
            const bAng = Math.atan2(b.y - cy, b.x - cx);
            this._onPlayerHitByBoss(b.x, b.y, now, bAng);
          }"""
game = replace_exact(game, old_boss_bullet, new_boss_bullet, "boss bullet outer shield radius")

old_boss_hit = """    _onPlayerHitByBoss(cx, cy, now) {
      if (state.hasBuff('shield', now)) {
        state.score += 150;
        CoreKinematics.triggerShieldDeflect(cx, cy, now);
        audio.playPerfectCatch(state.combo);
        return;
      }"""
new_boss_hit = """    _onPlayerHitByBoss(ix, iy, now, contactAng = null) {
      if (state.hasBuff('shield', now)) {
        state.score += 150;
        CoreKinematics.triggerShieldDeflect(ix, iy, now, state.catcherType || 'dynamo', contactAng);
        audio.playPerfectCatch(state.combo);
        return;
      }"""
game = replace_exact(game, old_boss_hit, new_boss_hit, "boss shield deflect")

old_main_hazard_col = """        const coreSphereRadius = 68.0 * u;
        const nodeSphereRadius = p.headR ? (p.headR * (isMobile ? 0.72 : 1.0)) : (isMobile ? 26.0 : 36.0);
        const hazardContactRadius = coreSphereRadius + nodeSphereRadius;
        const effectiveHitRadius = isHazard ? hazardContactRadius : hitRadius;"""

new_main_hazard_col = """        const hasActiveShield = state.hasBuff('shield', now);
        const coreSphereRadius = (isHazard && hasActiveShield)
          ? CoreKinematics.getShieldOuterRadius(u, state.coreTier)
          : (68.0 * u);
        const nodeSphereRadius = p.headR ? (p.headR * (isMobile ? 0.72 : 1.0)) : (isMobile ? 26.0 : 36.0);
        const hazardContactRadius = coreSphereRadius + nodeSphereRadius * (hasActiveShield ? 0.88 : 1.0);
        const effectiveHitRadius = isHazard ? hazardContactRadius : hitRadius;"""
game = replace_exact(game, old_main_hazard_col, new_main_hazard_col, "main hazard outer shield radius")

old_main_shield_crush = """            // Check if 5-Second Aegis Shield is active (independent of any simultaneous power-ups!)
            if (state.hasBuff('shield', now)) {
              const wasChargingCorruptor = (p.nodeClass === 'corruptor_laser' && p.laserState === 'charging');
              const defPts = wasChargingCorruptor ? 450 : 300;
              state.score += defPts;
              if (wasChargingCorruptor) {
                state.pulseMeter = Math.min(100, (state.pulseMeter || 0) + 15);
                if (state.pulseMeter >= 100) state.isPulseReady = true;
              }
              CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY, now);
              audio.playPerfectCatch(state.combo);
              state.particles.splice(i, 1);
              updateHeaderUI();
              continue;
            }"""

new_main_shield_crush = """            // Check if 5-Second Aegis Shield is active (independent of any simultaneous power-ups!)
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
            }"""
game = replace_exact(game, old_main_shield_crush, new_main_shield_crush, "main hazard outer shield crush")

# G. Realm-Specific Shield Buff Titles & Colors (in both missile catch & ship catch)
old_missile_buff = """              } else if (pt.nodeClass === 'shield') {
                state.applyBuff('shield', 'AEGIS SHIELD', '#f59e0b', '🛡️', 5000, now);
              } else if (pt.nodeClass === 'missiles') {"""
new_missile_buff = """              } else if (pt.nodeClass === 'shield') {
                const sMeta = getRealmShieldMeta(mMode);
                state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
                CoreKinematics.triggerShieldDeflect(m.x, m.y, now, mMode);
              } else if (pt.nodeClass === 'missiles') {"""
game = replace_exact(game, old_missile_buff, new_missile_buff, "missile shield buff meta")

old_catch_buff = """          } else if (p.nodeClass === 'shield') {
            state.applyBuff('shield', 'AEGIS SHIELD', '#f59e0b', '🛡️', 5000, now);
            CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY, now);
            audio.playPulseCharged();
            classMultiplier = 3.0;"""
new_catch_buff = """          } else if (p.nodeClass === 'shield') {
            const sMeta = getRealmShieldMeta(state.catcherType || 'dynamo');
            state.applyBuff('shield', sMeta.name, sMeta.color, sMeta.icon, 5000, now);
            CoreKinematics.triggerShieldDeflect(catcherPixelX, catcherPixelY - 80, now, state.catcherType || 'dynamo', -Math.PI * 0.5);
            audio.playPulseCharged();
            classMultiplier = 3.0;"""
game = replace_exact(game, old_catch_buff, new_catch_buff, "catch shield buff meta")

# H. Expose getKinematics on window.chromeSynapseGame + test helper getShieldOuterRadius
old_api = """    getTouchControls: () => TouchFireControls,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },"""
new_api = """    getTouchControls: () => TouchFireControls,
    getKinematics: () => CoreKinematics,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },"""
game = replace_exact(game, old_api, new_api, "expose getKinematics")

# I. Bump version tags across all 4 files
OLD_V = "arcade411_mlbb_joystick"
NEW_V = "arcade412_armored_shields"

game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fpath = ROOT / fname
    txt = fpath.read_text(encoding="utf-8")
    if OLD_V not in txt:
        raise RuntimeError(f"Expected {OLD_V} in {fname}")
    fpath.write_text(txt.replace(OLD_V, NEW_V), encoding="utf-8")

print("Successfully applied v412_armored_shields across game.js, index.html, app.js, sw.js!")
