"""Apply v423 upgrades deterministically with strict unique-match assertions."""
import json
import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    n = text.count(old)
    assert n == 1, f"{label}: expected 1 occurrence, found {n}"
    return text.replace(old, new, 1)


def main():
    # 1. core-geometry-db.json
    geom_path = ROOT / "assets" / "core-geometry-db.json"
    geom = json.loads(geom_path.read_text(encoding="utf-8"))
    geom["version"] = "v423_aaa_relics"
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    # 2. index.html & app.js
    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade422_tier7_ultra" in txt, f"Missing v422 tag in {fname}"
        txt = txt.replace("arcade422_tier7_ultra", "arcade423_aaa_relics")
        p.write_text(txt, encoding="utf-8")
        print(f"PATCHED -> {fname}")

    # 3. sw.js
    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    realm_good_entries = "\n".join(
        f"  './assets/powerup-{m}-{pk}.png?v=arcade423_aaa_relics',"
        for m in ("dynamo", "helix", "meteor")
        for pk in ("missiles", "cluster", "supercharge", "chronos", "singularity")
    )
    sw_txt = replace_once(
        sw_txt,
        "  './assets/powerup-catalyst-3d.png?v=arcade422_tier7_ultra',",
        f"  './assets/powerup-catalyst-3d.png?v=arcade423_aaa_relics',\n{realm_good_entries}",
        "sw.js add 15 realm good relics",
    )
    sw_txt = sw_txt.replace("arcade422_tier7_ultra", "arcade423_aaa_relics")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    # 4. game.js
    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 4a. Add powerupRelicsByRealm to LayeredT4Assets & preload all 15 realm-specific Good Relics
    g = replace_once(
        g,
        """    powerupRelics: {
      missiles: new Image(),
      cluster: new Image(),
      supercharge: new Image(),
      chronos: new Image(),
      singularity: new Image(),
      catalyst: new Image()
    },""",
        """    powerupRelics: {
      missiles: new Image(),
      cluster: new Image(),
      supercharge: new Image(),
      chronos: new Image(),
      singularity: new Image(),
      catalyst: new Image()
    },
    powerupRelicsByRealm: { dynamo: {}, helix: {}, meteor: {} },""",
        "LayeredT4Assets.powerupRelicsByRealm",
    )

    g = replace_once(
        g,
        """      powerupRelics: {
        missiles: false, cluster: false, supercharge: false,
        chronos: false, singularity: false, catalyst: false
      },""",
        """      powerupRelics: {
        missiles: false, cluster: false, supercharge: false,
        chronos: false, singularity: false, catalyst: false
      },
      powerupRelicsByRealm: { dynamo: {}, helix: {}, meteor: {} },""",
        "LayeredT4Assets.loaded.powerupRelicsByRealm",
    )

    g = replace_once(
        g,
        """  ['missiles', 'cluster', 'supercharge', 'chronos', 'singularity', 'catalyst'].forEach((pk) => {
    LayeredT4Assets.powerupRelics[pk].onload = () => { LayeredT4Assets.loaded.powerupRelics[pk] = true; };
    LayeredT4Assets.powerupRelics[pk].src = `assets/powerup-${pk}-3d.png?v=arcade422_tier7_ultra`;
  });""",
        """  ['missiles', 'cluster', 'supercharge', 'chronos', 'singularity', 'catalyst'].forEach((pk) => {
    LayeredT4Assets.powerupRelics[pk].onload = () => { LayeredT4Assets.loaded.powerupRelics[pk] = true; };
    LayeredT4Assets.powerupRelics[pk].src = `assets/powerup-${pk}-3d.png?v=arcade423_aaa_relics`;
  });
  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    ['missiles', 'cluster', 'supercharge', 'chronos', 'singularity'].forEach((pk) => {
      const rImg = new Image();
      LayeredT4Assets.powerupRelicsByRealm[m][pk] = rImg;
      LayeredT4Assets.loaded.powerupRelicsByRealm[m][pk] = false;
      rImg.onload = () => { LayeredT4Assets.loaded.powerupRelicsByRealm[m][pk] = true; };
      rImg.src = `assets/powerup-${m}-${pk}.png?v=arcade423_aaa_relics`;
    });
  });""",
        "Preload powerupRelicsByRealm",
    )

    # 4b. Use per-realm AAA Good Relic sprite in _drawLayeredNodeOrHazard
    g = replace_once(
        g,
        """      const isGoodLuxuryRelic = (!isHazard && p.nodeClass !== 'standard');
      const sModeKey = (mode === 'helix') ? 'helix' : ((mode === 'meteor') ? 'meteor' : 'dynamo');
      const relicImg = isGoodLuxuryRelic
        ? ((p.nodeClass === 'shield') ? LayeredT4Assets.powerupShield[sModeKey] : LayeredT4Assets.powerupRelics[p.nodeClass])
        : null;
      const relicLoaded = isGoodLuxuryRelic && relicImg && relicImg.naturalWidth > 0 && (
        (p.nodeClass === 'shield') ? LayeredT4Assets.loaded.powerupShield[sModeKey] : LayeredT4Assets.loaded.powerupRelics[p.nodeClass]
      );""",
        """      const isGoodLuxuryRelic = (!isHazard && p.nodeClass !== 'standard');
      const sModeKey = (mode === 'helix') ? 'helix' : ((mode === 'meteor') ? 'meteor' : 'dynamo');
      const realmRelicSpr = LayeredT4Assets.powerupRelicsByRealm[sModeKey] && LayeredT4Assets.powerupRelicsByRealm[sModeKey][p.nodeClass];
      const realmRelicOk = !!(LayeredT4Assets.loaded.powerupRelicsByRealm[sModeKey] && LayeredT4Assets.loaded.powerupRelicsByRealm[sModeKey][p.nodeClass] && realmRelicSpr && realmRelicSpr.naturalWidth > 0);
      const relicImg = isGoodLuxuryRelic
        ? ((p.nodeClass === 'shield')
            ? LayeredT4Assets.powerupShield[sModeKey]
            : (realmRelicOk ? realmRelicSpr : LayeredT4Assets.powerupRelics[p.nodeClass]))
        : null;
      const relicLoaded = isGoodLuxuryRelic && relicImg && relicImg.naturalWidth > 0 && (
        (p.nodeClass === 'shield')
          ? LayeredT4Assets.loaded.powerupShield[sModeKey]
          : (realmRelicOk || LayeredT4Assets.loaded.powerupRelics[p.nodeClass])
      );""",
        "Resolve realm-specific good relic sprite",
    )

    # 4c. High-visibility Gravity Well Perimeter Field + Spiral Flow Lines (zero shadowBlur!)
    g = replace_once(
        g,
        """          // 1. Soft Volumetric Tidal Gravity Distortion Aura + 3D Relativistic Photon Lensing Ring (v418)
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.save();
          ctx.rotate((modeKey === 'dynamo') ? -0.30 : (modeKey === 'meteor' ? -0.18 : 0.14));
          ctx.scale(1.0, 0.38);
          ctx.strokeStyle = (modeKey === 'meteor') ? 'rgba(168, 85, 247, 0.72)' : 'rgba(244, 63, 94, 0.72)';
          ctx.lineWidth = 3.2 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 1.56, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          const tidalR = targetR * (2.05 + 0.16 * Math.sin(now * 0.006));
          const tidalGrad = ctx.createRadialGradient(0, 0, targetR * 0.55, 0, 0, tidalR);
          tidalGrad.addColorStop(0.0, `${mPal.primary}0.32)`);
          tidalGrad.addColorStop(0.50, `${mPal.secondary}0.22)`);
          tidalGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = tidalGrad;
          ctx.beginPath();
          ctx.arc(0, 0, tidalR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();""",
        """          // 1. v423 High-Visibility Gravity Capture Field Perimeter + Inward Spiraling Pull Currents
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const pullFieldR = Math.max(targetR * 2.55, 138 * scale);
          const fieldPulse = 0.68 + 0.32 * Math.sin(now * 0.0065 + animPhase);
          ctx.strokeStyle = `${mPal.primary}${0.34 * fieldPulse})`;
          ctx.lineWidth = Math.max(1.4, 2.0 * scale);
          ctx.setLineDash([12 * scale, 10 * scale]);
          ctx.lineDashOffset = -now * 0.045;
          ctx.beginPath();
          ctx.arc(0, 0, pullFieldR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          for (let sp = 0; sp < 8; sp++) {
            const sa = swirlRot * 1.45 + sp * (Math.PI * 0.25);
            const sxOuter = Math.cos(sa) * pullFieldR;
            const syOuter = Math.sin(sa) * pullFieldR;
            const smx = Math.cos(sa + 0.42) * (pullFieldR * 0.56);
            const smy = Math.sin(sa + 0.42) * (pullFieldR * 0.56);
            const sxIn = Math.cos(sa + 0.72) * (targetR * 0.85);
            const syIn = Math.sin(sa + 0.72) * (targetR * 0.85);
            const fg = ctx.createLinearGradient(sxOuter, syOuter, sxIn, syIn);
            fg.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
            fg.addColorStop(0.5, `${(sp % 2 === 0) ? mPal.primary : mPal.secondary}${0.45 * fieldPulse})`);
            fg.addColorStop(1.0, 'rgba(255, 255, 255, 0.72)');
            ctx.strokeStyle = fg;
            ctx.lineWidth = Math.max(1.2, 1.8 * scale);
            ctx.beginPath();
            ctx.moveTo(sxOuter, syOuter);
            ctx.quadraticCurveTo(smx, smy, sxIn, syIn);
            ctx.stroke();
          }

          ctx.save();
          ctx.rotate((modeKey === 'dynamo') ? -0.30 : (modeKey === 'meteor' ? -0.18 : 0.14));
          ctx.scale(1.0, 0.38);
          ctx.strokeStyle = (modeKey === 'meteor') ? 'rgba(168, 85, 247, 0.72)' : 'rgba(244, 63, 94, 0.72)';
          ctx.lineWidth = 3.2 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 1.56, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          const tidalR = targetR * (2.15 + 0.18 * Math.sin(now * 0.006));
          const tidalGrad = ctx.createRadialGradient(0, 0, targetR * 0.55, 0, 0, tidalR);
          tidalGrad.addColorStop(0.0, `${mPal.primary}0.36)`);
          tidalGrad.addColorStop(0.55, `${mPal.secondary}0.24)`);
          tidalGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = tidalGrad;
          ctx.beginPath();
          ctx.arc(0, 0, tidalR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();""",
        "Vortex high-visibility perimeter & spiral currents",
    )

    # 4d. High-Visibility EMP Blast-Zone Countdown Ring + Converging Trigger Ring
    g = replace_once(
        g,
        """          // 3. Central Pressurized Reactor Surge Flash when approaching 100% charge
          if (empCharge > 0.15) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const coreR = targetR * (0.48 + empCharge * 0.36);""",
        """          // 3. v423 High-Visibility 220px Blast-Zone Countdown Danger Ring + Converging Shock Timer!
          if (empCharge > 0.02) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const dangerR = 220;
            const convergeR = dangerR - (dangerR - targetR * 1.05) * empCharge;
            ctx.strokeStyle = `rgba(244, 63, 94, ${0.42 + 0.48 * empCharge})`;
            ctx.lineWidth = Math.max(1.8, 2.5 * scale);
            ctx.setLineDash([12, 8]);
            ctx.lineDashOffset = -now * 0.06;
            ctx.beginPath();
            ctx.arc(0, 0, dangerR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.strokeStyle = `rgba(255, 228, 230, ${0.55 + 0.45 * empCharge})`;
            ctx.lineWidth = Math.max(2.0, 2.8 * scale);
            ctx.beginPath();
            ctx.arc(0, 0, convergeR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
          // 4. Central Pressurized Reactor Surge Flash when approaching 100% charge
          if (empCharge > 0.15) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const coreR = targetR * (0.48 + empCharge * 0.36);""",
        "EMP high-visibility 220px countdown danger ring",
    )

    # 4e. Faster Corruptor Laser Spawn Parameters (lines ~14876 and ~17470)
    g = replace_once(
        g,
        """        laserSalvosLeft: 2,
        laserNextReady: now + 750,
        empCharge: 0,
        empNextPulse: now + 1500,""",
        """        laserSalvosLeft: 3,
        laserNextReady: now + 260,
        empCharge: 0,
        empNextPulse: now + 1100,""",
        "Boss-spawned Laser & EMP speedups",
    )
    g = replace_once(
        g,
        """          laserSalvosLeft: 2,
          laserNextReady: now + 650,
          // Feature #4: EMP Detonator Shockwave Timer
          empCharge: 0,
          empNextPulse: now + 1550,""",
        """          laserSalvosLeft: 3,
          laserNextReady: now + 240,
          // Feature #4: EMP Detonator Shockwave Timer
          empCharge: 0,
          empNextPulse: now + 1100,""",
        "Wave-spawned Laser & EMP speedups",
    )

    # 4f. EMP Shockwave Dome: 8 Jagged High-Voltage Lightning Arcs + 1350ms Slowdown Duration
    g = replace_once(
        g,
        """              state.pulseMeter = Math.max(0, (state.pulseMeter || 0) - 30);
              if (state.pulseMeter < 100) state.isPulseReady = false;
              state.empSlowUntil = now + 650;
              updateHeaderUI();""",
        """              state.pulseMeter = Math.max(0, (state.pulseMeter || 0) - 35);
              if (state.pulseMeter < 100) state.isPulseReady = false;
              state.empSlowUntil = now + 1350;
              updateHeaderUI();""",
        "EMP hit disruption duration",
    )
    g = replace_once(
        g,
        """          sw.r += 4.4 * dtScale;
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
                pt.x += (dxs / ds) * 2.8 * dtScale;""",
        """          sw.r += 5.4 * dtScale;
          const prog = Math.min(1.0, sw.r / sw.maxR);
          sw.alpha = Math.max(0, 1.0 - Math.pow(prog, 1.4));

          // Kinetic push on nearby good nodes
          for (let k = 0; k < state.particles.length; k++) {
            const pt = state.particles[k];
            if (!isHazardNode(pt.nodeClass)) {
              const dxs = pt.x - sw.x;
              const dys = pt.y - sw.y;
              const ds = Math.hypot(dxs, dys);
              if (ds > 1 && Math.abs(ds - sw.r) < 34) {
                pt.x += (dxs / ds) * 4.6 * dtScale;""",
        "EMP faster shockwave + stronger push",
    )
    g = replace_once(
        g,
        """          // Crawling Mode-Matched Plasma Crest Filaments riding the shockwave perimeter!
          ctx.lineCap = 'round';
          const crestR = sw.r * 0.85;
          for (let ca = 0; ca < 4; ca++) {
            const a0 = now * 0.004 + ca * (Math.PI * 0.5) + sw.r * 0.02;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.58 * sw.alpha})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, crestR, a0, a0 + 0.48);
            ctx.stroke();
          }""",
        """          // 8 High-Voltage Crackling EMP Perimeter Arcs (unmistakable electric shockwave!)
          ctx.lineCap = 'round';
          const crestR = sw.r * 0.90;
          const empTickSw = Math.floor(now / 52);
          for (let ca = 0; ca < 8; ca++) {
            const a0 = now * 0.005 + ca * (Math.PI * 0.25) + sw.r * 0.02;
            const am = a0 + 0.22;
            const a1 = a0 + 0.44;
            const jit = Math.sin(empTickSw * 3.7 + ca * 2.1) * 11.0;
            ctx.strokeStyle = ca % 2 === 0 ? `rgba(255, 255, 255, ${0.78 * sw.alpha})` : `rgba(244, 63, 94, ${0.85 * sw.alpha})`;
            ctx.lineWidth = ca % 2 === 0 ? 2.4 : 2.0;
            ctx.beginPath();
            ctx.moveTo(sw.x + Math.cos(a0) * crestR, sw.y + Math.sin(a0) * crestR);
            ctx.lineTo(sw.x + Math.cos(am) * (crestR + jit), sw.y + Math.sin(am) * (crestR + jit));
            ctx.lineTo(sw.x + Math.cos(a1) * crestR, sw.y + Math.sin(a1) * crestR);
            ctx.stroke();
          }""",
        "EMP 8 crackling perimeter lightning arcs",
    )

    # 4g. Faster Corruptor Laser AI + Visible Vortex Tractor Streams + Visible Player Gravity Tether + Stronger/Clearer EMP
    g = replace_once(
        g,
        """        // ═══ FEATURE #2: CORRUPTOR OVERLORD (Lasers Several Good Nodes -> Instant Bad Nodes!) ═══
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
              p.laserCharge = Math.min(1.0, (now - p.laserChargeStart) / 550);""",
        """        // ═══ FEATURE #2: CORRUPTOR OVERLORD (Fast Lock-On & Rapid Good-to-Bad Corruption!) ═══
        if (p.nodeClass === 'corruptor_laser') {
          if (p.laserState === 'idle' && (p.laserSalvosLeft || 0) > 0 && now >= (p.laserNextReady || 0) && p.y > 40 && p.y < h * 0.72) {
            // Scan for up to 3 nearby good nodes above the danger floor (never corrupts life catalyst/shield/missiles)
            const candidates = [];
            for (let k = 0; k < state.particles.length; k++) {
              const other = state.particles[k];
              if (other !== p && !isHazardNode(other.nodeClass) && !other.hasDetonated &&
                  other.nodeClass !== 'catalyst' && other.nodeClass !== 'shield' && other.nodeClass !== 'missiles' &&
                  other.y > 30 && other.y < catcherPixelY - 95) {
                const distL = Math.hypot(other.x - p.x, other.y - p.y);
                if (distL < 520) {
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
              // 260ms fast charge (more than 2x faster corruption!)
              p.laserCharge = Math.min(1.0, (now - p.laserChargeStart) / 260);""",
        "Corruptor Laser 260ms fast charge + wider scan",
    )

    g = replace_once(
        g,
        """                p.laserSalvosLeft = Math.max(0, (p.laserSalvosLeft || 1) - 1);
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
        }""",
        """                p.laserSalvosLeft = Math.max(0, (p.laserSalvosLeft || 1) - 1);
                p.laserState = 'firing';
                p.laserFireEnd = now + 240;
                p.laserNextReady = now + 850;
                p.laserTargets = [];
              }
            }
          } else if (p.laserState === 'firing' && now >= (p.laserFireEnd || 0)) {
            p.laserState = 'idle';
            p.laserCharge = 0;
          }
        }

        // ═══ FEATURE #3: EVENT-HORIZON SINGULARITY (High-Visibility Gravity Pull Field & Visible Tractor Streams) ═══
        if (p.nodeClass === 'gravity_well' || p.nodeClass === 'vortex') {
          const vPal = _getHazVfxPal(p.type || state.catcherType);
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          for (let k = 0; k < state.particles.length; k++) {
            const other = state.particles[k];
            if (other !== p && !isHazardNode(other.nodeClass)) {
              const dxV = p.x - other.x;
              const dyV = p.y - other.y;
              const distV = Math.hypot(dxV, dyV);
              if (distV < 265 && distV > 30) {
                const pullFactor = (1.0 - distV / 265);
                const nx = dxV / distV;
                const ny = dyV / distV;
                const swirlX = -ny * pullFactor * 2.8 * dtScale;
                const pullX = nx * pullFactor * 3.1 * dtScale;
                other.x = Math.max(30, Math.min(w - 30, other.x + pullX + swirlX));
                other.gravityTuggedUntil = now + 1500;

                // Visible Curved Gravitational Tractor Stream from Pulled Node -> Vortex!
                const mx = (other.x + p.x) * 0.5 - ny * 22 * pullFactor;
                const my = (other.y + p.y) * 0.5 + nx * 22 * pullFactor;
                const tsGrad = ctx.createLinearGradient(other.x, other.y, p.x, p.y);
                tsGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.25)');
                tsGrad.addColorStop(0.55, `${vPal.p}${0.45 + 0.45 * pullFactor})`);
                tsGrad.addColorStop(1.0, `${vPal.s}0.90)`);
                ctx.strokeStyle = tsGrad;
                ctx.lineWidth = Math.max(1.5, 3.0 * pullFactor);
                ctx.beginPath();
                ctx.moveTo(other.x, other.y);
                ctx.quadraticCurveTo(mx, my, p.x, p.y);
                ctx.stroke();
              }
            }
          }
          // Strong Visible Tidal Gravitational Pull Tether on Unshielded Player Core
          const distCoreG = Math.hypot(catcherPixelX - p.x, catcherPixelY - p.y);
          if (distCoreG < 275 && distCoreG > 52 && !state.hasBuff('shield', now)) {
            const corePull = (1.0 - distCoreG / 275);
            const tidalStr = corePull * 0.0085 * dtScale;
            targetCatcherX = Math.max(0.05, Math.min(0.95, targetCatcherX + Math.sign(p.x - catcherPixelX) * tidalStr));

            ctx.strokeStyle = `${vPal.p}${0.55 + 0.35 * corePull})`;
            ctx.lineWidth = 2.6;
            ctx.setLineDash([8, 7]);
            ctx.lineDashOffset = now * 0.05;
            ctx.beginPath();
            ctx.moveTo(catcherPixelX, catcherPixelY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();
        }

        // ═══ FEATURE #4: OVERLOAD EMP SHOCK-MINE (High-Visibility 680ms Countdown + 220px Plasma EMP Dome) ═══
        if (p.nodeClass === 'emp_detonator' || p.nodeClass === 'emp_glitch' || p.nodeClass === 'pulsar_mine') {
          if (!p.empNextPulse) p.empNextPulse = now + 1100;
          const timeToPulse = p.empNextPulse - now;
          if (timeToPulse <= 680 && timeToPulse > 0) {
            p.empCharge = Math.min(1.0, 1.0 - (timeToPulse / 680));
          } else if (timeToPulse <= 0 && p.y > 55 && p.y < h - 60) {
            p.empCharge = 0;
            p.empNextPulse = now + 2000;
            audio.playEmpShockwave();
            state.empShockwaves.push({
              x: p.x, y: p.y,
              r: 28,
              maxR: 220,
              alpha: 1.0,
              hitPlayer: false,
              mode: p.type
            });
          } else {
            p.empCharge = 0;
          }
        }""",
        "Laser cooldown + Vortex tractor streams + EMP 220px wave",
    )

    # 4h. High-Visibility Crackling Static Arcs & Warning Badge when Player is Hit by EMP
    g = replace_once(
        g,
        """      // EMP Thruster Static Halo on Player Core when momentarily dampened by EMP Shockwave
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
      }""",
        """      // v423 High-Visibility EMP Thruster Static Halo + Crackling Arcs + Clear Badge on Disrupted Player Core
      if (state.empSlowUntil && state.empSlowUntil > now && !state.hasBuff('shield', now)) {
        const empFrac = Math.min(1.0, (state.empSlowUntil - now) / 1350);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const sR = 82 * u;
        const empG = ctx.createRadialGradient(catcherPixelX, catcherPixelY, sR * 0.45, catcherPixelX, catcherPixelY, sR * 1.35);
        empG.addColorStop(0.0, 'rgba(56, 189, 248, 0)');
        empG.addColorStop(0.55, `rgba(56, 189, 248, ${0.46 * empFrac})`);
        empG.addColorStop(0.82, `rgba(244, 63, 94, ${0.42 * empFrac})`);
        empG.addColorStop(1.0, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = empG;
        ctx.beginPath();
        ctx.arc(catcherPixelX, catcherPixelY, sR * 1.35, 0, Math.PI * 2);
        ctx.fill();

        const eTick = Math.floor(now / 50);
        ctx.lineCap = 'round';
        for (let ea = 0; ea < 6; ea++) {
          const a0 = ea * (Math.PI / 3) + now * 0.008;
          const am = a0 + 0.35;
          const a1 = a0 + 0.68;
          const rJ = sR * (0.94 + 0.14 * Math.sin(eTick * 3.1 + ea));
          ctx.strokeStyle = ea % 2 === 0 ? `rgba(56, 189, 248, ${0.88 * empFrac})` : `rgba(244, 63, 94, ${0.88 * empFrac})`;
          ctx.lineWidth = Math.max(1.8, 2.5 * u);
          ctx.beginPath();
          ctx.moveTo(catcherPixelX + Math.cos(a0) * sR * 0.85, catcherPixelY + Math.sin(a0) * sR * 0.85);
          ctx.lineTo(catcherPixelX + Math.cos(am) * rJ, catcherPixelY + Math.sin(am) * rJ);
          ctx.lineTo(catcherPixelX + Math.cos(a1) * sR * 0.85, catcherPixelY + Math.sin(a1) * sR * 0.85);
          ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = Math.min(1.0, empFrac * 1.4);
        ctx.font = `800 ${Math.round(12 * u)}px "Orbitron", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fda4af';
        ctx.fillText('⚡ EMP SLOWDOWN', catcherPixelX, catcherPixelY - 86 * u);
        ctx.restore();
      }""",
        "EMP high-visibility player disruption arcs & badge",
    )

    # 4i. Bump cache tag in game.js
    g = g.replace("arcade422_tier7_ultra", "arcade423_aaa_relics")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
