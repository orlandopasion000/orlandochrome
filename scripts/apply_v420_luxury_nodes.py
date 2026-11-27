import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade412_armored_shields"
NEW_V = "arcade420_luxury_nodes"


def replace_exact(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    if cnt != 1:
        raise RuntimeError(f"[{label}] Expected 1 occurrence, found {cnt}")
    return text.replace(old, new, 1)


def main():
    game_path = ROOT / "game.js"
    game = game_path.read_text(encoding="utf-8")

    # 1. Expand LayeredT4Assets & Preload v420 Luxury Shield/Powerup/Hazard Assets
    old_assets_obj = """    poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
    bosses: {},"""
    new_assets_obj = """    poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
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
    bosses: {},"""
    game = replace_exact(game, old_assets_obj, new_assets_obj, "LayeredT4Assets fields")

    old_assets_loaded = """      poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
      bosses: {}"""
    new_assets_loaded = """      poweredHazard: { dynamo: {}, helix: {}, meteor: {} },
      shieldBarrier: { dynamo: false, helix: false, meteor: false },
      powerupShield: { dynamo: false, helix: false, meteor: false },
      powerupRelics: {
        missiles: false, cluster: false, supercharge: false,
        chronos: false, singularity: false, catalyst: false
      },
      hazardCore3D: { dynamo: false, helix: false, meteor: false },
      hazardSeekerRing: false,
      bosses: {}"""
    game = replace_exact(game, old_assets_loaded, new_assets_loaded, "LayeredT4Assets.loaded fields")

    old_powered_preload = """  // Preload all 15 Bespoke Luxury Raytraced Powered Bad Chrome Core Sprites (3 Games x 5 Powered Hazards)
  const POWERED_HAZARD_KEYS = ['hyper_comet', 'corruptor_laser', 'gravity_well', 'emp_detonator', 'phase_stalker'];
  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    POWERED_HAZARD_KEYS.forEach((hk) => {
      const img = new Image();
      LayeredT4Assets.poweredHazard[m][hk] = img;
      LayeredT4Assets.loaded.poweredHazard[m][hk] = false;
      img.onload = () => { LayeredT4Assets.loaded.poweredHazard[m][hk] = true; };
      img.src = `assets/hazard-powered-${m}-${hk}.png?v=arcade378`;
    });
  });"""

    new_powered_preload = """  // Preload all 15 De-Fringed Luxury Raytraced Powered Bad Chrome Core Sprites (3 Games x 5 Powered Hazards)
  const POWERED_HAZARD_KEYS = ['hyper_comet', 'corruptor_laser', 'gravity_well', 'emp_detonator', 'phase_stalker'];
  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    POWERED_HAZARD_KEYS.forEach((hk) => {
      const img = new Image();
      LayeredT4Assets.poweredHazard[m][hk] = img;
      LayeredT4Assets.loaded.poweredHazard[m][hk] = false;
      img.onload = () => { LayeredT4Assets.loaded.poweredHazard[m][hk] = true; };
      img.src = `assets/hazard-powered-${m}-${hk}.png?v=arcade420_luxury_nodes`;
    });

    // v420 Luxury 3D Active Shield Barrier Rings, Heraldic Shield Relics & Upgraded 3D Hazard Cores
    LayeredT4Assets.shieldBarrier[m].onload = () => { LayeredT4Assets.loaded.shieldBarrier[m] = true; };
    LayeredT4Assets.shieldBarrier[m].src = `assets/shield-barrier-${m}.png?v=arcade420_luxury_nodes`;

    LayeredT4Assets.powerupShield[m].onload = () => { LayeredT4Assets.loaded.powerupShield[m] = true; };
    LayeredT4Assets.powerupShield[m].src = `assets/powerup-shield-${m}.png?v=arcade420_luxury_nodes`;

    LayeredT4Assets.hazardCore3D[m].onload = () => { LayeredT4Assets.loaded.hazardCore3D[m] = true; };
    LayeredT4Assets.hazardCore3D[m].src = `assets/hazard-core-${m}-3d.png?v=arcade420_luxury_nodes`;
  });

  ['missiles', 'cluster', 'supercharge', 'chronos', 'singularity', 'catalyst'].forEach((pk) => {
    LayeredT4Assets.powerupRelics[pk].onload = () => { LayeredT4Assets.loaded.powerupRelics[pk] = true; };
    LayeredT4Assets.powerupRelics[pk].src = `assets/powerup-${pk}-3d.png?v=arcade420_luxury_nodes`;
  });

  LayeredT4Assets.hazardSeekerRing.onload = () => { LayeredT4Assets.loaded.hazardSeekerRing = true; };
  LayeredT4Assets.hazardSeekerRing.src = 'assets/hazard-seeker-ring-3d.png?v=arcade420_luxury_nodes';"""
    game = replace_exact(game, old_powered_preload, new_powered_preload, "v420 preload")

    # Update Helix Shield badge label slightly to match PRISM AEGIS consistency
    old_meta = """    if (mode === 'helix') {
      return { name: 'PRISM AEGIS', badge: '🛡️ PRISM SHIELD', color: '#22d3ee', icon: '🛡️' };
    }"""
    new_meta = """    if (mode === 'helix') {
      return { name: 'PRISM AEGIS', badge: '🛡️ PRISM AEGIS', color: '#22d3ee', icon: '🛡️' };
    }"""
    game = replace_exact(game, old_meta, new_meta, "helix shield meta")

    # 2. Rebuild CoreKinematics.drawAegisForcefield (replace _drawApexShieldCrest + drawAegisForcefield completely)
    start_marker = "    _drawApexShieldCrest(ctx, r, mode, warnPulse, now) {"
    end_marker = "    drawCursorReticle(ctx, cx, cy, u, now) {"
    s_idx = game.index(start_marker)
    e_idx = game.index(end_marker)

    new_aegis_block = """    _drawStarGlint(ctx, x, y, r, color = '#ffffff') {
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

      // LAYER 1: Radiant Sanctuary Dome Aura + Soft Interior Jewel Sheen
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.28 * warnPulse;
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'gold');
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.25, -r * 1.25, r * 2.5, r * 2.5);

      const sheen = ctx.createRadialGradient(0, -r * 0.18, r * 0.45, 0, 0, r * 0.94);
      sheen.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
      sheen.addColorStop(0.74, isDyn ? `rgba(56, 189, 248, ${0.07 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.08 * warnPulse})` : `rgba(251, 191, 36, ${0.08 * warnPulse})`));
      sheen.addColorStop(0.95, isDyn ? `rgba(251, 191, 36, ${0.14 * warnPulse})` : (isHel ? `rgba(232, 121, 249, ${0.14 * warnPulse})` : `rgba(251, 146, 60, ${0.15 * warnPulse})`));
      sheen.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.94, 0, Math.PI * 2);
      ctx.fill();
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
        // Fine crackling Faraday arcs skipping around the 8 sapphire cabochon mounts
        const tick = Math.floor(now / 58);
        for (let k = 0; k < 8; k++) {
          if (((tick + k) % 3) !== 0) continue;
          const a0 = k * (Math.PI * 0.25) - 0.10;
          const a1 = k * (Math.PI * 0.25) + 0.10;
          const am = (a0 + a1) * 0.5;
          const jit = Math.sin(tick * 4.3 + k * 2.7) * 6.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0) * r * 0.99, Math.sin(a0) * r * 0.99);
          ctx.lineTo(Math.cos(am) * (r * 1.03 + jit), Math.sin(am) * (r * 1.03 + jit));
          ctx.lineTo(Math.cos(a1) * r * 0.99, Math.sin(a1) * r * 0.99);
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.92 * warnPulse})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
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

          ctx.globalAlpha = fade * 0.95;
          ctx.strokeStyle = '#fef9c3';
          ctx.lineWidth = 3.8 * fade;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1.03 + prog * 0.14), imp.angle - 0.52, imp.angle + 0.52);
          ctx.stroke();

          ctx.strokeStyle = crushCol;
          ctx.lineWidth = 5.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 12 + prog * 42, imp.angle - 1.15, imp.angle + 1.15);
          ctx.stroke();

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
          this._drawStarGlint(ctx, ix, iy, 14 * fade, '#ffffff');
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

"""
    game = game[:s_idx] + new_aegis_block + game[e_idx:]

    # 3. Replace Powered-Up Good Nodes Rendering + Standard Orb Isolation + Luxury Beveled Pill Helper + Upgraded Classic/Powered Bad Nodes
    # Locate start inside _drawLayeredNodeOrHazard: `      if (!isHazard) {` up to `      ctx.restore();\n    },\n\n    drawTier3RealmParticle`
    node_start = """      if (!isHazard) {
        if (mode === 'dynamo' || mode === 'realm') {"""
    node_end = """      ctx.restore();
    },

    drawTier3RealmParticle(targetCtx, p, now) {"""
    ns_idx = game.index(node_start)
    ne_idx = game.index(node_end)

    old_node_block = game[ns_idx:ne_idx]

    # Inside old_node_block, extract the existing Powered Bad Nodes block verbatim (from `        if (isHyperComet) {` up to `        } else {\n          // ═══ CLASSIC MODE-SPECIFIC HAZARDS`) so all 5 bespoke Powered Bad renders remain intact + enhanced!
    powered_bad_start = "        if (isHyperComet) {"
    classic_bad_start = "        } else {\n          // ═══ CLASSIC MODE-SPECIFIC HAZARDS"
    pbs_idx = old_node_block.index(powered_bad_start)
    cbs_idx = old_node_block.index(classic_bad_start)
    powered_bad_body = old_node_block[pbs_idx:cbs_idx]

    new_node_block = """      const isGoodLuxuryRelic = (!isHazard && p.nodeClass !== 'standard');
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

""" + powered_bad_body + """        } else {
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

"""
    game = game[:ns_idx] + new_node_block + game[ne_idx:]

    # 4. Bump version tag in game.js, index.html, app.js
    game = game.replace(OLD_V, NEW_V)
    game_path.write_text(game, encoding="utf-8")

    for fname in ("index.html", "app.js"):
        fp = ROOT / fname
        txt = fp.read_text(encoding="utf-8")
        if OLD_V not in txt:
            raise RuntimeError(f"Expected {OLD_V} in {fname}")
        fp.write_text(txt.replace(OLD_V, NEW_V), encoding="utf-8")

    # 5. Update sw.js with v420 CACHE_NAME + all 16 new PNGs + updated poweredHazard version tags
    sw_path = ROOT / "sw.js"
    sw = sw_path.read_text(encoding="utf-8")
    sw = replace_exact(sw, "const CACHE_NAME = 'orlandochrome-arcade-v411_mlbb_joystick';", f"const CACHE_NAME = 'orlandochrome-arcade-v420_luxury_nodes';", "sw CACHE_NAME")
    sw = sw.replace(OLD_V, NEW_V)

    new_sw_entries = "\n".join([
        f"  './assets/shield-barrier-{m}.png?v={NEW_V}'," for m in ("dynamo", "helix", "meteor")
    ] + [
        f"  './assets/powerup-shield-{m}.png?v={NEW_V}'," for m in ("dynamo", "helix", "meteor")
    ] + [
        f"  './assets/hazard-core-{m}-3d.png?v={NEW_V}'," for m in ("dynamo", "helix", "meteor")
    ] + [
        f"  './assets/powerup-{k}-3d.png?v={NEW_V}'," for k in ("missiles", "cluster", "supercharge", "chronos", "singularity", "catalyst")
    ] + [
        f"  './assets/hazard-seeker-ring-3d.png?v={NEW_V}',"
    ] + [
        f"  './assets/hazard-powered-{m}-{hk}.png?v={NEW_V}',"
        for m in ("dynamo", "helix", "meteor")
        for hk in ("hyper_comet", "corruptor_laser", "gravity_well", "emp_detonator", "phase_stalker")
    ])

    sw = replace_exact(
        sw,
        "  './assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra',",
        "  './assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra',\n" + new_sw_entries,
        "sw new entries",
    )
    sw_path.write_text(sw, encoding="utf-8")
    print("Successfully applied v420_luxury_nodes across game.js, index.html, app.js, and sw.js!")


if __name__ == "__main__":
    main()
