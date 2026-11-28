"""Apply v422 upgrades deterministically with strict unique-match assertions."""
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
    geom["version"] = "v422_tier7_ultra"
    geom["tier7Specs"]["helix"]["muzzleL"] = {"x": 404, "y": 20}
    geom["tier7Specs"]["helix"]["muzzleR"] = {"x": 620, "y": 20}
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    # 2. index.html & app.js
    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade421_tier7_celestial" in txt, f"Missing v421 tag in {fname}"
        txt = txt.replace("arcade421_tier7_celestial", "arcade422_tier7_ultra")
        p.write_text(txt, encoding="utf-8")
        print(f"PATCHED -> {fname}")

    # 3. sw.js
    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = replace_once(
        sw_txt,
        "'./assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra',",
        "'./assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra',\n  './assets/vfx-t7-dynamo-cannon-3d.png?v=arcade422_tier7_ultra',",
        "sw.js add vfx-t7-dynamo-cannon-3d.png",
    )
    sw_txt = sw_txt.replace("arcade421_tier7_celestial", "arcade422_tier7_ultra")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    # 4. game.js
    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 4a. Update TIER7_SPECS.helix muzzles for eye-free straight silver pulse cannons
    g = replace_once(
        g,
        """    helix: {
      name: 'HELIX UNICORN',
      title: 'SERAPHIC PRISM PEGASUS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      centerMuzzle: { x: 512, y: 10 },
      muzzleL: { x: 378, y: 18 },
      muzzleR: { x: 646, y: 18 },
      scaleMult: 1.15
    },""",
        """    helix: {
      name: 'HELIX UNICORN',
      title: 'SERAPHIC PRISM PEGASUS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      centerMuzzle: { x: 512, y: 10 },
      muzzleL: { x: 404, y: 20 },
      muzzleR: { x: 620, y: 20 },
      scaleMult: 1.15
    },""",
        "TIER7_SPECS.helix",
    )

    # 4b. Preload VfxUltraAssets.t7DynamoCannon
    g = replace_once(
        g,
        """  const VfxUltraAssets = {
    novaFlame: {},
    novaWisps: {},
    novaCorona: {},
    gunBolt: {},
    seekerMissile: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false }
  };""",
        """  const VfxUltraAssets = {
    novaFlame: {},
    novaWisps: {},
    novaCorona: {},
    gunBolt: {},
    seekerMissile: null,
    t7DynamoCannon: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false }
  };""",
        "VfxUltraAssets struct",
    )
    g = replace_once(
        g,
        """  (function preloadSeekerMissile() {
    const mImg = new Image();
    VfxUltraAssets.seekerMissile = mImg;
    mImg.onload = () => { VfxUltraAssets.loaded.seekerMissile = true; };
    mImg.src = 'assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra';
  })();""",
        """  (function preloadSeekerMissile() {
    const mImg = new Image();
    VfxUltraAssets.seekerMissile = mImg;
    mImg.onload = () => { VfxUltraAssets.loaded.seekerMissile = true; };
    mImg.src = 'assets/vfx-seeker-missile-3d.png?v=arcade390_vfx_ultra';

    const dcImg = new Image();
    VfxUltraAssets.t7DynamoCannon = dcImg;
    dcImg.onload = () => { VfxUltraAssets.loaded.t7DynamoCannon = true; };
    dcImg.src = 'assets/vfx-t7-dynamo-cannon-3d.png?v=arcade422_tier7_ultra';
  })();""",
        "preloadSeekerMissile + t7DynamoCannon",
    )

    # 4c. Update _getTier7ArticulatedRig helix pivots
    g = replace_once(
        g,
        "helix:  { seamL: 446, seamR: 578, seamBotY: 392, gunPivotL: { x: 380, y: 186 }, gunPivotR: { x: 644, y: 186 }, headY: 165, flapAmp: 32, tailAmp: 19 },",
        "helix:  { seamL: 446, seamR: 578, seamBotY: 392, gunPivotL: { x: 404, y: 188 }, gunPivotR: { x: 620, y: 188 }, headY: 165, flapAmp: 32, tailAmp: 19 },",
        "_getTier7ArticulatedRig helix",
    )

    # 4d. Tone down over-bright Good Relics & Standard Good Nodes + add _getDragonFlameTextures helper
    g = replace_once(
        g,
        """          // 1. Soft Luminous Luxury Jewel Corona
          const isBrightRelic = (p.nodeClass === 'missiles' || p.nodeClass === 'supercharge' || p.nodeClass === 'catalyst');
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const coronaR = targetR * (1.46 + 0.08 * Math.sin(now * 0.007 + animPhase));
          ctx.globalAlpha = isBrightRelic ? 0.30 : 0.48;
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

          // 3. Standalone Photorealistic 3D Raytraced Luxury Relic + Balanced Specular Luster Pass
          const relicSize = ((p.nodeClass === 'shield') ? 168 : 156) * scale * (1.0 + 0.028 * Math.sin(now * 0.006 + animPhase));
          const relicRot = relicMeta.spin
            ? ((p.nodeClass === 'missiles' ? 0.0011 : 0.0015) * now + animPhase * 0.25)
            : (Math.sin(now * 0.0032 + animPhase) * 0.085);
          ctx.save();
          ctx.rotate(relicRot);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = (isBrightRelic ? 0.05 : 0.20) + (isBrightRelic ? 0.03 : 0.10) * Math.sin(now * 0.0085 + animPhase);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.restore();

          // 4. Front Half of Tilted 24K-Gold Gyro Ring + Twin 4-Point Diamond Starlight Flares
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.rotate(ringTilt);
          ctx.save();
          ctx.scale(1.0, 0.36);
          ctx.strokeStyle = '#fef9c3';
          ctx.globalAlpha = 0.72;""",
        """          // 1. Balanced Rich Jewel Corona (v422: Toned down so colors stay deep & sculpted, never white-washed!)
          const isBrightRelic = (p.nodeClass === 'missiles' || p.nodeClass === 'supercharge' || p.nodeClass === 'catalyst' || p.nodeClass === 'cluster' || p.nodeClass === 'chronos' || p.nodeClass === 'singularity');
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const coronaR = targetR * (1.36 + 0.06 * Math.sin(now * 0.007 + animPhase));
          ctx.globalAlpha = isBrightRelic ? 0.14 : 0.24;
          ctx.drawImage(this._getGlowSprite(relicMeta.glow), -coronaR, -coronaR, coronaR * 2, coronaR * 2);
          ctx.restore();

          // 2. Back Half of Tilted 24K-Gold Celestial Gyro Ring
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.rotate(ringTilt);
          ctx.scale(1.0, 0.36);
          ctx.strokeStyle = relicMeta.ring;
          ctx.globalAlpha = 0.30;
          ctx.lineWidth = 2.4 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, ringRx, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 3. Standalone Photorealistic 3D Raytraced Luxury Relic + Subtle Specular Luster Pass
          const relicSize = ((p.nodeClass === 'shield') ? 168 : 156) * scale * (1.0 + 0.025 * Math.sin(now * 0.006 + animPhase));
          const relicRot = relicMeta.spin
            ? ((p.nodeClass === 'missiles' ? 0.0011 : 0.0015) * now + animPhase * 0.25)
            : (Math.sin(now * 0.0032 + animPhase) * 0.085);
          ctx.save();
          ctx.rotate(relicRot);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = (isBrightRelic ? 0.02 : 0.06) + 0.015 * Math.sin(now * 0.0085 + animPhase);
          ctx.drawImage(relicImg, -relicSize * 0.5, -relicSize * 0.5, relicSize, relicSize);
          ctx.restore();

          // 4. Front Half of Tilted 24K-Gold Gyro Ring + Twin 4-Point Diamond Starlight Flares
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.rotate(ringTilt);
          ctx.save();
          ctx.scale(1.0, 0.36);
          ctx.strokeStyle = '#fde68a';
          ctx.globalAlpha = 0.52;""",
        "Tone down powered-up good relic glow",
    )

    g = replace_once(
        g,
        """            ctx.strokeStyle = 'rgba(254, 249, 195, 0.36)';""",
        """            ctx.strokeStyle = 'rgba(254, 249, 195, 0.22)';""",
        "Tone down sanctuary outer halo ring",
    )
    g = replace_once(
        g,
        """              swGrad.addColorStop(0.5, `rgba(254, 249, 195, ${0.42 * Math.sin(tSw * Math.PI)})`);""",
        """              swGrad.addColorStop(0.5, `rgba(254, 249, 195, ${0.24 * Math.sin(tSw * Math.PI)})`);""",
        "Tone down sanctuary light-sheen sweep",
    )

    # 4e. Add procedural fractal ragged flame-cloud textures builder to QuantumRenderer (right before _getTier7ArticulatedRig)
    g = replace_once(
        g,
        "    _getTier7ArticulatedRig(mKey) {",
        """    _dragonFlameTextures: null,
    _getDragonFlameTextures() {
      if (this._dragonFlameTextures) return this._dragonFlameTextures;
      const list = [];
      for (let v = 0; v < 4; v++) {
        const cv = document.createElement('canvas');
        cv.width = 128; cv.height = 128;
        const g = cv.getContext('2d');
        const cx = 64, cy = 72;
        const pts = 44;
        // Multi-lobe ragged irregular flame tongue polygon + internal turbulent flame wisps
        for (let pass = 0; pass < 3; pass++) {
          const rScale = pass === 0 ? 1.0 : (pass === 1 ? 0.68 : 0.40);
          g.beginPath();
          for (let i = 0; i <= pts; i++) {
            const a = (i / pts) * Math.PI * 2;
            const lobe = 0.72
              + 0.28 * Math.sin(a * 3 + v * 1.7 + pass * 1.1)
              + 0.16 * Math.cos(a * 7 - v * 2.3)
              + 0.10 * Math.sin(a * 11 + v * 3.1);
            const upPull = (Math.sin(a) < 0) ? (1.0 + Math.abs(Math.sin(a)) * 0.42) : 0.82;
            const rr = 42 * rScale * lobe * upPull;
            const px = cx + Math.cos(a) * rr * 0.84;
            const py = cy + Math.sin(a) * rr - pass * 4;
            if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
          }
          g.closePath();
          const rg = g.createRadialGradient(cx, cy + 4, 2, cx, cy - 8, 56 * rScale);
          if (pass === 0) {
            rg.addColorStop(0.0, 'rgba(255, 237, 160, 0.92)');
            rg.addColorStop(0.45, 'rgba(249, 115, 22, 0.72)');
            rg.addColorStop(0.82, 'rgba(185, 28, 28, 0.34)');
            rg.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          } else if (pass === 1) {
            rg.addColorStop(0.0, 'rgba(255, 255, 240, 0.96)');
            rg.addColorStop(0.50, 'rgba(251, 191, 36, 0.80)');
            rg.addColorStop(1.0, 'rgba(234, 88, 12, 0)');
          } else {
            rg.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
            rg.addColorStop(0.65, 'rgba(254, 240, 138, 0.75)');
            rg.addColorStop(1.0, 'rgba(251, 146, 60, 0)');
          }
          g.fillStyle = rg;
          g.fill();
        }
        list.push(cv);
      }
      this._dragonFlameTextures = list;
      return list;
    },

    _getTier7ArticulatedRig(mKey) {""",
        "Add _getDragonFlameTextures",
    )

    # 4f. Activate Tier VII Side Weapons alongside Middle Super-Weapons in updateAndDrawPlayerWeapon!
    g = replace_once(
        g,
        """        if (tier >= 7 && mzs7W) {
          const cmx = mzs7W.center.x - cx;
          const cmy = mzs7W.center.y - cy;
          if (mode === 'helix') {
            pushShot(cmx, cmy - 10 * u, 0, 3.4, true, 0, {
              vy: -28.0, isTier7: true, t7Kind: 'unicorn_laser', pierce: 4, hitRadius: 44
            });
          } else if (mode === 'meteor') {
            pushShot(cmx, cmy - 8 * u, 0, 2.4, true, 0, {
              vy: -18.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 78
            });
            pushShot(cmx - 14 * u, cmy - 4 * u, -2.8, 1.5, true, 1.2, {
              vy: -17.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 62
            });
            pushShot(cmx + 14 * u, cmy - 4 * u, 2.8, 1.5, true, 2.4, {
              vy: -17.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 62
            });
          } else {
            pushShot(cmx, cmy - 18 * u, 0, 4.2, true, 0, {
              vy: -22.5, isTier7: true, t7Kind: 'princess_cannon', pierce: 2, hitRadius: 52, splashR: 138
            });
          }
        }""",
        """        if (tier >= 7 && mzs7W) {
          const cmx = mzs7W.center.x - cx;
          const cmy = mzs7W.center.y - cy;
          const lx7 = mzs7W.left.x - cx;
          const ly7 = mzs7W.left.y - cy - 4 * u;
          const rx7 = mzs7W.right.x - cx;
          const ry7 = mzs7W.right.y - cy - 4 * u;

          if (mode === 'helix') {
            // Central Horn Prismatic Laser Pulse + Twin Straight Silver Pulse Cannon Bolts
            pushShot(cmx, cmy - 10 * u, 0, 3.4, true, 0, {
              vy: -28.0, isTier7: true, t7Kind: 'unicorn_laser', pierce: 4, hitRadius: 44
            });
            pushShot(lx7, ly7, 0, 1.35, true, 0, {
              vy: -24.5, isTier7Side: true, t7SideKind: 'helix_pulse', pierce: 2, hitRadius: 22
            });
            pushShot(rx7, ry7, 0, 1.35, true, Math.PI, {
              vy: -24.5, isTier7Side: true, t7SideKind: 'helix_pulse', pierce: 2, hitRadius: 22
            });
          } else if (mode === 'meteor') {
            // Central Roaring Dragonfire Sweep + Twin Shoulder Furnace Molten Bolide Shells
            pushShot(cmx, cmy - 8 * u, 0, 2.4, true, 0, {
              vy: -18.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 78
            });
            pushShot(cmx - 14 * u, cmy - 4 * u, -2.8, 1.5, true, 1.2, {
              vy: -17.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 62
            });
            pushShot(cmx + 14 * u, cmy - 4 * u, 2.8, 1.5, true, 2.4, {
              vy: -17.5, isTier7: true, t7Kind: 'dragon_breath', pierce: 99, hitRadius: 62
            });
            pushShot(lx7, ly7, -0.95, 1.45, true, 0.6, {
              vy: -21.5, isTier7Side: true, t7SideKind: 'meteor_bolide', pierce: 2, hitRadius: 26, splashR: 54
            });
            pushShot(rx7, ry7, 0.95, 1.45, true, 2.5, {
              vy: -21.5, isTier7Side: true, t7SideKind: 'meteor_bolide', pierce: 2, hitRadius: 26, splashR: 54
            });
          } else {
            // Central Summoned 3D Siege Mega-Cannon Shell + Twin Royal Shoulder Faraday Rail-Spears
            pushShot(cmx, cmy - 28 * u, 0, 4.2, true, 0, {
              vy: -22.5, isTier7: true, t7Kind: 'princess_cannon', pierce: 2, hitRadius: 52, splashR: 138
            });
            pushShot(lx7, ly7, -0.55, 1.50, true, 0, {
              vy: -24.0, isTier7Side: true, t7SideKind: 'dynamo_tesla', pierce: 2, hitRadius: 24
            });
            pushShot(rx7, ry7, 0.55, 1.50, true, Math.PI, {
              vy: -24.0, isTier7Side: true, t7SideKind: 'dynamo_tesla', pierce: 2, hitRadius: 24
            });
          }
        }""",
        "Tier VII active side weapon + center weapon firing",
    )

    # 4g. Upgrade ALL 3 Tier VII Central Super-Weapons 10x More Realistic + Render Active Side-Cannon Muzzle Bursts
    old_t7_super = """      // ─── TIER VII CENTRAL SUPER-WEAPONS (Unicorn Horn Laser · Dragon Front-Wipe Fire · Princess Hands Mega-Cannon) ───
      if (tier >= 7 && mzs7W && wantsFire && hasAmmo) {
        const mfActive7 = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT7 = mfActive7 ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0.4;
        const cX = mzs7W.center.x;
        const cY = mzs7W.center.y;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (mode === 'helix') {
          // HELIX UNICORN: Uniform-Colored Continuous Prismatic Horn Laser + Continuous Corridor Damage
          const beamTop = -24;
          const beamLen = Math.max(120, cY - beamTop);
          const beamHalfW = (24 + Math.sin(now * 0.03) * 3) * u;

          const gradH = ctx.createLinearGradient(cX - beamHalfW, 0, cX + beamHalfW, 0);
          gradH.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          gradH.addColorStop(0.22, 'rgba(192, 132, 252, 0.52)');
          gradH.addColorStop(0.38, 'rgba(244, 114, 182, 0.72)');
          gradH.addColorStop(0.50, 'rgba(255, 255, 255, 0.96)');
          gradH.addColorStop(0.62, 'rgba(103, 232, 249, 0.78)');
          gradH.addColorStop(0.78, 'rgba(253, 230, 138, 0.48)');
          gradH.addColorStop(1.0, 'rgba(244, 114, 182, 0)');
          ctx.fillStyle = gradH;
          ctx.fillRect(cX - beamHalfW, beamTop, beamHalfW * 2, beamLen);

          for (let strand = 0; strand < 2; strand++) {
            const sOff = strand * Math.PI;
            ctx.strokeStyle = strand === 0 ? 'rgba(103, 232, 249, 0.94)' : 'rgba(244, 114, 182, 0.94)';
            ctx.lineWidth = Math.max(2.2, 3.4 * u);
            ctx.beginPath();
            for (let sIdx = 0; sIdx <= 24; sIdx++) {
              const f = sIdx / 24;
              const yy = cY - f * beamLen;
              const xx = cX + Math.sin(f * Math.PI * 6.0 - now * 0.018 + sOff) * (beamHalfW * 0.72);
              if (sIdx === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
            }
            ctx.stroke();
          }

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
          ctx.lineWidth = Math.max(6.0, 11.0 * u);
          ctx.beginPath();
          ctx.moveTo(cX, cY);
          ctx.lineTo(cX, beamTop);
          ctx.stroke();

          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 26 * u * (0.9 + 0.15 * mfT7), '#67e8f9');
          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 16 * u, '#ffffff');

          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const hr = (pt.headR || 28) + 26;
            if (pt.y <= cY + 12 && Math.abs(pt.x - cX) < hr) {
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= 0.28 * Math.max(0.5, dtScale || 1);
              if (Math.random() < 0.35) this._spawnHitSparks(pt.x, pt.y, '#f0abfc', 2);
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#67e8f9', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              }
            }
          }

        } else if (mode === 'meteor') {
          // METEOR DRAGON: Colossal Expanding Cone of Fiery Dragon Breath (Wipes Out All Hazards & Bullets in Front!)
          if (!this._t7DragonFlames) this._t7DragonFlames = [];
          for (let sp = 0; sp < 2; sp++) {
            if (this._t7DragonFlames.length < 42) {
              const spread = (Math.random() - 0.5) * 0.62;
              this._t7DragonFlames.push({
                x: cX + (Math.random() - 0.5) * 14 * u,
                y: cY - 6 * u,
                vx: Math.sin(spread) * (7.5 + Math.random() * 5.0),
                vy: -(13.5 + Math.random() * 7.5),
                r: (14 + Math.random() * 14) * u,
                grow: 2.2 * u,
                life: 0,
                maxLife: 24 + Math.random() * 10
              });
            }
          }

          // Deep Feathered Organic Dragonfire Cone Wash + Sinuous Fire Streams (Zero Hard Polygon Edges!)
          const coneLen = Math.min(500, Math.max(300, h * 0.64));
          ctx.save();
          ctx.translate(cX, cY - coneLen * 0.44);
          ctx.scale(0.54, 1.0);
          const washR = coneLen * 0.64;
          const washGrad = ctx.createRadialGradient(0, washR * 0.38, 12 * u, 0, 0, washR);
          washGrad.addColorStop(0.0, 'rgba(255, 248, 220, 0.86)');
          washGrad.addColorStop(0.28, 'rgba(253, 224, 71, 0.56)');
          washGrad.addColorStop(0.62, 'rgba(249, 115, 22, 0.28)');
          washGrad.addColorStop(0.88, 'rgba(220, 38, 38, 0.08)');
          washGrad.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.arc(0, 0, washR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 3 Roaring Sinuous Organic Fire Jets billowing outward across the cone
          for (let jIdx = -1; jIdx <= 1; jIdx++) {
            ctx.beginPath();
            for (let seg = 0; seg <= 14; seg++) {
              const f = seg / 14;
              const py = cY - f * coneLen;
              const px = cX + jIdx * f * (118 * u) + Math.sin(now * 0.025 + f * 6.0 + jIdx * 1.9) * (16 + f * 24) * u;
              if (seg === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = jIdx === 0 ? 'rgba(254, 240, 138, 0.72)' : 'rgba(249, 115, 22, 0.58)';
            ctx.lineWidth = (jIdx === 0 ? 22 : 16) * u;
            ctx.stroke();
          }

          for (let fIdx = this._t7DragonFlames.length - 1; fIdx >= 0; fIdx--) {
            const fl = this._t7DragonFlames[fIdx];
            fl.x += fl.vx * Math.max(0.5, dtScale || 1);
            fl.y += fl.vy * Math.max(0.5, dtScale || 1);
            fl.r += fl.grow * Math.max(0.5, dtScale || 1);
            fl.life += Math.max(0.5, dtScale || 1);
            if (fl.life >= fl.maxLife) {
              this._t7DragonFlames.splice(fIdx, 1);
              continue;
            }
            const tF = fl.life / fl.maxLife;
            const fa = Math.sin((1.0 - tF) * Math.PI * 0.5);
            const gF = ctx.createRadialGradient(fl.x, fl.y, fl.r * 0.12, fl.x, fl.y, fl.r);
            gF.addColorStop(0.0, `rgba(255, 251, 235, ${0.86 * fa})`);
            gF.addColorStop(0.38, `rgba(251, 146, 60, ${0.64 * fa})`);
            gF.addColorStop(0.76, `rgba(220, 38, 38, ${0.28 * fa})`);
            gF.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
            ctx.fillStyle = gF;
            ctx.beginPath();
            ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
            ctx.fill();
          }

          const jawGrad = ctx.createRadialGradient(cX, cY, 2 * u, cX, cY - 8 * u, 36 * u);
          jawGrad.addColorStop(0.0, '#ffffff');
          jawGrad.addColorStop(0.35, 'rgba(96, 165, 250, 0.85)');
          jawGrad.addColorStop(0.68, 'rgba(253, 224, 71, 0.65)');
          jawGrad.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = jawGrad;
          ctx.beginPath();
          ctx.arc(cX, cY - 8 * u, 36 * u, 0, Math.PI * 2);
          ctx.fill();

          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dyFront = cY - pt.y;
            if (dyFront >= -20 && dyFront <= coneLen) {
              const maxSpan = 36 + Math.max(0, dyFront) * 0.36;
              if (Math.abs(pt.x - cX) <= maxSpan + (pt.headR || 26)) {
                if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
                pt.shotHp -= 0.60 * Math.max(0.5, dtScale || 1);
                if (Math.random() < 0.45) this._spawnHitSparks(pt.x, pt.y, '#fbbf24', 2);
                if (pt.shotHp <= 0) {
                  state.score += 250;
                  this._spawnHitSparks(pt.x, pt.y, '#fb923c', 12);
                  audio.playMissileHit();
                  state.particles.splice(pIdx, 1);
                  SkillSystem.onEnemyDestroyed();
                  updateHeaderUI();
                }
              }
            }
          }
          if (state.bossBullets && state.bossBullets.length > 0) {
            for (let bIdx = state.bossBullets.length - 1; bIdx >= 0; bIdx--) {
              const bb = state.bossBullets[bIdx];
              const dyB = cY - bb.y;
              if (dyB >= -10 && dyB <= coneLen && Math.abs(bb.x - cX) <= 36 + Math.max(0, dyB) * 0.36) {
                this._spawnHitSparks(bb.x, bb.y, '#fde047', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }

        } else {
          // DYNAMO PRINCESS: Raised Hands Huge 24K-Gold & Sapphire Siege Mega-Cannon Fed by Twin Shoulder Towers
          [mzs7W.left, mzs7W.right].forEach((sMuz, sIdx) => {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.88)';
            ctx.lineWidth = Math.max(2.2, 3.4 * u);
            ctx.beginPath();
            ctx.moveTo(sMuz.x, sMuz.y);
            for (let seg = 1; seg <= 4; seg++) {
              const f = seg / 5;
              const jx = Math.sin(now * 0.08 + seg * 2.1 + sIdx * 3.1) * 7 * u;
              const jy = Math.cos(now * 0.07 + seg * 1.9 + sIdx * 2.7) * 7 * u;
              ctx.lineTo(sMuz.x + (cX - sMuz.x) * f + jx, sMuz.y + (cY - sMuz.y) * f + jy);
            }
            ctx.lineTo(cX, cY);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.lineWidth = Math.max(1.0, 1.5 * u);
            ctx.stroke();
          });

          ctx.save();
          ctx.translate(cX, cY);
          ctx.rotate(t7Bank * 0.35);

          // Sculpted Translucent Royal Sapphire & Violet Siege Cannon Chassis Body
          const railWBottom = 28 * u;
          const railWTop = 21 * u;
          const cannonLen = 96 * u;
          const chassisGrad = ctx.createLinearGradient(0, 10 * u, 0, -cannonLen);
          chassisGrad.addColorStop(0.0, 'rgba(126, 34, 206, 0.78)');
          chassisGrad.addColorStop(0.45, 'rgba(29, 78, 216, 0.74)');
          chassisGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.68)');
          chassisGrad.addColorStop(1.0, 'rgba(254, 240, 138, 0.84)');
          ctx.fillStyle = chassisGrad;
          ctx.beginPath();
          ctx.moveTo(-railWBottom, 10 * u);
          ctx.lineTo(-railWTop, -cannonLen);
          ctx.lineTo(railWTop, -cannonLen);
          ctx.lineTo(railWBottom, 10 * u);
          ctx.closePath();
          ctx.fill();

          // Blazing Central Plasma Barrel Core Beam Inside the Siege Cannon
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.lineWidth = Math.max(6.0, 10.5 * u);
          ctx.beginPath();
          ctx.moveTo(0, 2 * u);
          ctx.lineTo(0, -cannonLen + 4 * u);
          ctx.stroke();

          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = Math.max(3.2, 5.4 * u);
          ctx.beginPath();
          ctx.moveTo(-railWBottom, 10 * u);
          ctx.lineTo(-railWTop, -cannonLen);
          ctx.moveTo(railWBottom, 10 * u);
          ctx.lineTo(railWTop, -cannonLen);
          ctx.stroke();

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = Math.max(1.8, 2.8 * u);
          ctx.beginPath();
          ctx.moveTo(-railWBottom * 0.70, 6 * u);
          ctx.lineTo(-railWTop * 0.70, -cannonLen + 4 * u);
          ctx.moveTo(railWBottom * 0.70, 6 * u);
          ctx.lineTo(railWTop * 0.70, -cannonLen + 4 * u);
          ctx.stroke();

          [
            { y: -18 * u, rx: 30 * u, col: 'rgba(192, 132, 252, 0.88)' },
            { y: -50 * u, rx: 26 * u, col: 'rgba(56, 189, 248, 0.92)' },
            { y: -82 * u, rx: 23 * u, col: 'rgba(253, 224, 71, 0.95)' }
          ].forEach((ring, rIdx) => {
            ctx.strokeStyle = ring.col;
            ctx.lineWidth = Math.max(2.0, 3.0 * u);
            ctx.beginPath();
            ctx.ellipse(0, ring.y, ring.rx, ring.rx * 0.34, Math.sin(now * 0.008 + rIdx) * 0.08, 0, Math.PI * 2);
            ctx.stroke();
          });

          const cCoreGrad = ctx.createRadialGradient(0, -14 * u, 2 * u, 0, -14 * u, 32 * u);
          cCoreGrad.addColorStop(0.0, '#ffffff');
          cCoreGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.92)');
          cCoreGrad.addColorStop(0.70, 'rgba(168, 85, 247, 0.64)');
          cCoreGrad.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = cCoreGrad;
          ctx.beginPath();
          ctx.arc(0, -14 * u, 32 * u, 0, Math.PI * 2);
          ctx.fill();

          if (mfActive7) {
            ctx.strokeStyle = `rgba(224, 242, 254, ${0.95 * mfT7})`;
            ctx.lineWidth = Math.max(2.2, 3.4 * u);
            ctx.beginPath();
            ctx.ellipse(0, -cannonLen - 4 * u, 34 * u * (1.25 - mfT7 * 0.25), 11 * u, 0, 0, Math.PI * 2);
            ctx.stroke();
            CoreKinematics._drawStarGlint(ctx, 0, -cannonLen - 6 * u, 26 * u * mfT7, '#fde047');
          }
          ctx.restore();
        }
        ctx.restore();
      } else if (this._t7DragonFlames && this._t7DragonFlames.length > 0) {
        this._t7DragonFlames.length = 0;
      }"""

    new_t7_super = """      // ─── TIER VII 10x ULTRA MIDDLE SUPER-WEAPONS + ACTIVE SIDE-CANNON MUZZLE BURSTS ───
      if (tier >= 7 && mzs7W && wantsFire && hasAmmo) {
        const mfActive7 = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT7 = mfActive7 ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0.45;
        const cX = mzs7W.center.x;
        const cY = mzs7W.center.y;
        const sideColA = mode === 'meteor' ? '#fb923c' : (mode === 'helix' ? '#67e8f9' : '#38bdf8');
        const sideColB = mode === 'meteor' ? '#fde047' : (mode === 'helix' ? '#f472b6' : '#fde047');

        // Active Side-Cannon Muzzle Shock-Rings & Recoil Flares (Strictly while actively firing!)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        [mzs7W.left, mzs7W.right].forEach((sm, sIdx) => {
          const flR = (16 + 10 * mfT7) * u;
          const sg = ctx.createRadialGradient(sm.x, sm.y, 1.5 * u, sm.x, sm.y, flR);
          sg.addColorStop(0.0, 'rgba(255, 255, 255, 0.96)');
          sg.addColorStop(0.42, mode === 'meteor' ? 'rgba(251, 146, 60, 0.80)' : 'rgba(103, 232, 249, 0.80)');
          sg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, flR, 0, Math.PI * 2);
          ctx.fill();
          if (mfActive7) {
            ctx.strokeStyle = sideColB;
            ctx.lineWidth = Math.max(1.5, 2.2 * u);
            ctx.beginPath();
            ctx.ellipse(sm.x, sm.y - 6 * u, (13 + 7 * mfT7) * u, 4.5 * u, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          CoreKinematics._drawStarGlint(ctx, sm.x, sm.y - 2 * u, (12 + 6 * mfT7) * u, sIdx === 0 ? sideColA : sideColB);
        });
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (mode === 'helix') {
          // HELIX UNICORN: Horn-Drawn Prismatic Energy Convergence + Hyper-Real Uniform-Colored Mach-Diamond Laser
          // 1. Prismatic Energy Ribbons Drawn from Wings/Mane -> Horn Spiral -> Crystal Focus Lens
          const hornBaseY = cY + 52 * u;
          for (let rb = 0; rb < 6; rb++) {
            const side = (rb % 2 === 0) ? -1 : 1;
            const ringIdx = Math.floor(rb / 2);
            const sx = cX + side * (58 + ringIdx * 34) * u;
            const sy = hornBaseY + (16 + ringIdx * 18) * u;
            ctx.beginPath();
            for (let s = 0; s <= 12; s++) {
              const f = s / 12;
              const px = sx * (1 - f) + cX * f + Math.sin(f * Math.PI * 2.5 - now * 0.02 + rb) * 10 * u * (1 - f);
              const py = sy * (1 - f) + cY * f;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = rb % 3 === 0 ? 'rgba(103, 232, 249, 0.72)' : (rb % 3 === 1 ? 'rgba(244, 114, 182, 0.68)' : 'rgba(192, 132, 252, 0.72)');
            ctx.lineWidth = Math.max(1.6, 2.5 * u);
            ctx.stroke();
          }
          for (let mt = 0; mt < 14; mt++) {
            const prog = ((now * 0.0022 + mt / 14) % 1.0);
            const side = (mt % 2 === 0) ? -1 : 1;
            const mx = cX + side * (1.0 - prog) * (92 + (mt % 3) * 28) * u;
            const my = cY + (1.0 - prog) * 74 * u;
            ctx.fillStyle = mt % 2 === 0 ? '#67e8f9' : '#f472b6';
            ctx.beginPath();
            ctx.arc(mx, my, (2.8 - prog * 1.2) * u, 0, Math.PI * 2);
            ctx.fill();
          }

          // Rotating 3D Faceted Crystal Prism Focus Lens at Horn Tip
          ctx.save();
          ctx.translate(cX, cY);
          const hexRot = now * 0.0055;
          for (let layer = 0; layer < 2; layer++) {
            const lr = (layer === 0 ? 22 : 14) * u;
            ctx.strokeStyle = layer === 0 ? 'rgba(103, 232, 249, 0.92)' : 'rgba(244, 114, 182, 0.94)';
            ctx.lineWidth = Math.max(1.8, 2.6 * u);
            ctx.beginPath();
            for (let hp = 0; hp <= 6; hp++) {
              const ha = hexRot * (layer === 0 ? 1 : -1.4) + (hp / 6) * Math.PI * 2;
              const hx = Math.cos(ha) * lr;
              const hy = Math.sin(ha) * lr * 0.56;
              if (hp === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
            }
            ctx.stroke();
          }
          ctx.restore();

          // 2. Hyper-Real Uniform-Colored Directed Prismatic Laser + Mach Shock Diamonds + Wave Rings
          const beamTop = -28;
          const beamLen = Math.max(140, cY - beamTop);
          const beamHalfW = (30 + Math.sin(now * 0.032) * 3.5) * u;

          const gradOuter = ctx.createLinearGradient(cX - beamHalfW * 1.6, 0, cX + beamHalfW * 1.6, 0);
          gradOuter.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          gradOuter.addColorStop(0.24, 'rgba(56, 189, 248, 0.28)');
          gradOuter.addColorStop(0.50, 'rgba(244, 114, 182, 0.42)');
          gradOuter.addColorStop(0.76, 'rgba(192, 132, 252, 0.28)');
          gradOuter.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
          ctx.fillStyle = gradOuter;
          ctx.fillRect(cX - beamHalfW * 1.6, beamTop, beamHalfW * 3.2, beamLen);

          const gradH = ctx.createLinearGradient(cX - beamHalfW, 0, cX + beamHalfW, 0);
          gradH.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          gradH.addColorStop(0.18, 'rgba(99, 102, 241, 0.58)');
          gradH.addColorStop(0.32, 'rgba(244, 114, 182, 0.82)');
          gradH.addColorStop(0.45, 'rgba(103, 232, 249, 0.94)');
          gradH.addColorStop(0.50, 'rgba(255, 255, 255, 0.99)');
          gradH.addColorStop(0.55, 'rgba(103, 232, 249, 0.94)');
          gradH.addColorStop(0.68, 'rgba(244, 114, 182, 0.82)');
          gradH.addColorStop(0.82, 'rgba(192, 132, 252, 0.58)');
          gradH.addColorStop(1.0, 'rgba(244, 114, 182, 0)');
          ctx.fillStyle = gradH;
          ctx.fillRect(cX - beamHalfW, beamTop, beamHalfW * 2, beamLen);

          // 8 Streaming Mach Shock-Diamonds up the laser column
          const phaseM = (now * 0.0085) % 1.0;
          for (let md = 0; md < 8; md++) {
            const frac = ((md / 8) + phaseM * 0.125) % 1.0;
            const my = cY - frac * beamLen;
            const mdW = (18 + Math.sin(now * 0.02 + md) * 3) * u;
            const mdH = 26 * u;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.42 * (1 - frac * 0.3)})`;
            ctx.beginPath();
            ctx.moveTo(cX, my - mdH);
            ctx.lineTo(cX + mdW, my);
            ctx.lineTo(cX, my + mdH);
            ctx.lineTo(cX - mdW, my);
            ctx.closePath();
            ctx.fill();

            if (md % 2 === 0) {
              ctx.strokeStyle = 'rgba(103, 232, 249, 0.78)';
              ctx.lineWidth = Math.max(1.5, 2.2 * u);
              ctx.beginPath();
              ctx.ellipse(cX, my, beamHalfW * 1.12, 7.5 * u, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // 3D Braided Triple-Helix Crystal Strands
          const strandCols = ['rgba(103, 232, 249, 0.95)', 'rgba(244, 114, 182, 0.95)', 'rgba(253, 230, 138, 0.88)'];
          for (let strand = 0; strand < 3; strand++) {
            const sOff = (strand * Math.PI * 2) / 3;
            ctx.strokeStyle = strandCols[strand];
            ctx.lineWidth = Math.max(2.2, 3.4 * u);
            ctx.beginPath();
            for (let sIdx = 0; sIdx <= 28; sIdx++) {
              const f = sIdx / 28;
              const yy = cY - f * beamLen;
              const xx = cX + Math.sin(f * Math.PI * 7.5 - now * 0.024 + sOff) * (beamHalfW * 0.82);
              if (sIdx === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
            }
            ctx.stroke();
          }

          // Incandescent White-Hot Inner Filament + Dispersion Flare
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.lineWidth = Math.max(7.5, 13.0 * u);
          ctx.beginPath();
          ctx.moveTo(cX, cY);
          ctx.lineTo(cX, beamTop);
          ctx.stroke();

          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 30 * u * (0.9 + 0.18 * mfT7), '#67e8f9');
          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 18 * u, '#ffffff');
          CoreKinematics._drawStarGlint(ctx, cX, 18, 28 * u, '#f472b6');

          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const hr = (pt.headR || 28) + 28;
            if (pt.y <= cY + 12 && Math.abs(pt.x - cX) < hr) {
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= 0.30 * Math.max(0.5, dtScale || 1);
              if (Math.random() < 0.35) this._spawnHitSparks(pt.x, pt.y, '#f0abfc', 2);
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#67e8f9', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              }
            }
          }

        } else if (mode === 'meteor') {
          // METEOR DRAGON: Fractal Ragged Turbulent Dragonfire Inferno + Incandescent Embers + Thermal Shock Arcs
          const flameTexList = this._getDragonFlameTextures();
          if (!this._t7DragonFlames) this._t7DragonFlames = [];
          if (!this._t7DragonEmbers) this._t7DragonEmbers = [];

          for (let sp = 0; sp < 4; sp++) {
            if (this._t7DragonFlames.length < 65) {
              const spread = (Math.random() - 0.5) * 0.68;
              this._t7DragonFlames.push({
                x: cX + (Math.random() - 0.5) * 16 * u,
                y: cY - 4 * u,
                vx: Math.sin(spread) * (6.8 + Math.random() * 5.8),
                vy: -(12.5 + Math.random() * 8.5),
                size: (44 + Math.random() * 34) * u,
                grow: 4.4 * u,
                rot: (Math.random() - 0.5) * 0.9,
                vRot: (Math.random() - 0.5) * 0.07,
                texIdx: Math.floor(Math.random() * flameTexList.length),
                turbPhase: Math.random() * Math.PI * 2,
                life: 0,
                maxLife: 22 + Math.random() * 12
              });
            }
          }
          for (let ep = 0; ep < 3; ep++) {
            if (this._t7DragonEmbers.length < 40) {
              const spread = (Math.random() - 0.5) * 0.78;
              this._t7DragonEmbers.push({
                x: cX + (Math.random() - 0.5) * 20 * u,
                y: cY - 8 * u,
                vx: Math.sin(spread) * (9.0 + Math.random() * 8.0),
                vy: -(16.0 + Math.random() * 11.0),
                len: (12 + Math.random() * 18) * u,
                life: 0,
                maxLife: 18 + Math.random() * 12
              });
            }
          }

          const coneLen = Math.min(520, Math.max(320, h * 0.66));
          // Deep Crimson-Amber Heat Plume Backing
          ctx.save();
          ctx.translate(cX, cY - coneLen * 0.44);
          ctx.scale(0.56, 1.0);
          const washR = coneLen * 0.64;
          const washGrad = ctx.createRadialGradient(0, washR * 0.42, 10 * u, 0, 0, washR);
          washGrad.addColorStop(0.0, 'rgba(255, 245, 205, 0.72)');
          washGrad.addColorStop(0.32, 'rgba(251, 191, 36, 0.44)');
          washGrad.addColorStop(0.66, 'rgba(234, 88, 12, 0.24)');
          washGrad.addColorStop(0.90, 'rgba(153, 27, 27, 0.08)');
          washGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.arc(0, 0, washR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Render Procedural Ragged Fractal Flame Tongues (Zero Blurry Circles!)
          for (let fIdx = this._t7DragonFlames.length - 1; fIdx >= 0; fIdx--) {
            const fl = this._t7DragonFlames[fIdx];
            const dS = Math.max(0.5, dtScale || 1);
            fl.x += (fl.vx + Math.sin(now * 0.02 + fl.turbPhase) * 1.4) * dS;
            fl.y += fl.vy * dS;
            fl.size += fl.grow * dS;
            fl.rot += fl.vRot * dS;
            fl.life += dS;
            if (fl.life >= fl.maxLife) {
              this._t7DragonFlames.splice(fIdx, 1);
              continue;
            }
            const tF = fl.life / fl.maxLife;
            const fa = Math.sin((1.0 - tF) * Math.PI * 0.5) * 0.82;
            ctx.save();
            ctx.translate(fl.x, fl.y);
            ctx.rotate(fl.rot);
            ctx.globalAlpha = fa;
            ctx.drawImage(flameTexList[fl.texIdx], -fl.size * 0.5, -fl.size * 0.5, fl.size, fl.size);
            ctx.restore();
          }

          // 4 Thermal Mach Shock Arcs Racing Forward
          const arcPhase = (now * 0.0045) % 1.0;
          for (let sa = 0; sa < 4; sa++) {
            const ap = ((sa / 4) + arcPhase) % 1.0;
            const ay = cY - 26 * u - ap * coneLen * 0.85;
            const aw = (22 + ap * 116) * u;
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.58 * (1.0 - ap)})`;
            ctx.lineWidth = Math.max(2.0, (4.5 - ap * 2.5) * u);
            ctx.beginPath();
            ctx.arc(cX, ay + aw * 0.35, aw, Math.PI * 1.24, Math.PI * 1.76);
            ctx.stroke();
          }

          // 40 Streaking Incandescent Embers
          ctx.lineCap = 'round';
          for (let eIdx = this._t7DragonEmbers.length - 1; eIdx >= 0; eIdx--) {
            const em = this._t7DragonEmbers[eIdx];
            const dS = Math.max(0.5, dtScale || 1);
            em.x += em.vx * dS;
            em.y += em.vy * dS;
            em.life += dS;
            if (em.life >= em.maxLife) {
              this._t7DragonEmbers.splice(eIdx, 1);
              continue;
            }
            const ea = 1.0 - (em.life / em.maxLife);
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.92 * ea})`;
            ctx.lineWidth = Math.max(1.4, 2.2 * u);
            ctx.beginPath();
            ctx.moveTo(em.x, em.y);
            ctx.lineTo(em.x - em.vx * 0.55, em.y - em.vy * 0.55);
            ctx.stroke();
          }

          // Blue-White Plasma Dragon Throat Ignition
          const jawGrad = ctx.createRadialGradient(cX, cY, 2 * u, cX, cY - 10 * u, 38 * u);
          jawGrad.addColorStop(0.0, '#ffffff');
          jawGrad.addColorStop(0.32, 'rgba(96, 165, 250, 0.90)');
          jawGrad.addColorStop(0.65, 'rgba(253, 224, 71, 0.72)');
          jawGrad.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = jawGrad;
          ctx.beginPath();
          ctx.arc(cX, cY - 10 * u, 38 * u, 0, Math.PI * 2);
          ctx.fill();

          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dyFront = cY - pt.y;
            if (dyFront >= -20 && dyFront <= coneLen) {
              const maxSpan = 36 + Math.max(0, dyFront) * 0.36;
              if (Math.abs(pt.x - cX) <= maxSpan + (pt.headR || 26)) {
                if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
                pt.shotHp -= 0.62 * Math.max(0.5, dtScale || 1);
                if (Math.random() < 0.45) this._spawnHitSparks(pt.x, pt.y, '#fbbf24', 2);
                if (pt.shotHp <= 0) {
                  state.score += 250;
                  this._spawnHitSparks(pt.x, pt.y, '#fb923c', 12);
                  audio.playMissileHit();
                  state.particles.splice(pIdx, 1);
                  SkillSystem.onEnemyDestroyed();
                  updateHeaderUI();
                }
              }
            }
          }
          if (state.bossBullets && state.bossBullets.length > 0) {
            for (let bIdx = state.bossBullets.length - 1; bIdx >= 0; bIdx--) {
              const bb = state.bossBullets[bIdx];
              const dyB = cY - bb.y;
              if (dyB >= -10 && dyB <= coneLen && Math.abs(bb.x - cX) <= 36 + Math.max(0, dyB) * 0.36) {
                this._spawnHitSparks(bb.x, bb.y, '#fde047', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }

        } else {
          // DYNAMO PRINCESS: Summoned Real 3D PBR Royal Siege Mega-Cannon + Arcane Palm Circle + Shoulder Lightning Conduits
          const cannonSpr = VfxUltraAssets.t7DynamoCannon;
          const cannonReady = VfxUltraAssets.loaded.t7DynamoCannon && cannonSpr && cannonSpr.naturalWidth > 0;
          const recoilKick = mfActive7 ? (mfT7 * 11 * u) : 0;
          const cannonCx = cX;
          const cannonCy = cY - 34 * u + recoilKick;
          const cannonSize = 138 * u;

          // Layer 1: Spinning Arcane Palm Summoning Circle + Energy Tendrils from Both Hands -> Cannon Breech
          ctx.save();
          ctx.translate(cX, cY + 12 * u);
          ctx.rotate(now * 0.003);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
          ctx.lineWidth = Math.max(1.6, 2.2 * u);
          ctx.beginPath();
          ctx.ellipse(0, 0, 42 * u, 14 * u, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 28 * u, 9.5 * u, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Live Twin Shoulder Faraday Lightning Conduits -> Cannon Side Capacitors
          [mzs7W.left, mzs7W.right].forEach((sMuz, sIdx) => {
            const targetX = cannonCx + (sIdx === 0 ? -24 : 24) * u;
            const targetY = cannonCy + 14 * u;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.90)';
            ctx.lineWidth = Math.max(2.2, 3.2 * u);
            ctx.beginPath();
            ctx.moveTo(sMuz.x, sMuz.y);
            for (let seg = 1; seg <= 4; seg++) {
              const f = seg / 5;
              const jx = Math.sin(now * 0.085 + seg * 2.3 + sIdx * 3.1) * 7.5 * u;
              const jy = Math.cos(now * 0.075 + seg * 2.0 + sIdx * 2.7) * 6.5 * u;
              ctx.lineTo(sMuz.x + (targetX - sMuz.x) * f + jx, sMuz.y + (targetY - sMuz.y) * f + jy);
            }
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.94)';
            ctx.lineWidth = Math.max(1.0, 1.5 * u);
            ctx.stroke();
          });

          // Layer 2 (Source-Over Solid 3D Metal): Real 3D PBR Sculpted Royal Siege Cannon Hardware
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(cannonCx, cannonCy);
          ctx.rotate(t7Bank * 0.35);
          if (cannonReady) {
            ctx.drawImage(cannonSpr, -cannonSize * 0.5, -cannonSize * 0.5, cannonSize, cannonSize);
          }
          ctx.restore();

          // Layer 3 (Additive): Internal Bore Plasma Discharge + Twin Angled Muzzle Shock Cones + Breech Luster
          ctx.save();
          ctx.translate(cannonCx, cannonCy);
          ctx.rotate(t7Bank * 0.35);

          const cCoreGrad = ctx.createRadialGradient(0, 18 * u, 2 * u, 0, 18 * u, 28 * u);
          cCoreGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
          cCoreGrad.addColorStop(0.38, 'rgba(56, 189, 248, 0.72)');
          cCoreGrad.addColorStop(0.75, 'rgba(168, 85, 247, 0.38)');
          cCoreGrad.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = cCoreGrad;
          ctx.beginPath();
          ctx.arc(0, 18 * u, 28 * u, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(224, 242, 254, 0.92)';
          ctx.lineWidth = Math.max(4.5, 7.5 * u);
          ctx.beginPath();
          ctx.moveTo(0, 8 * u);
          ctx.lineTo(0, -cannonSize * 0.42);
          ctx.stroke();

          if (mfActive7) {
            const mTop = -cannonSize * 0.44;
            ctx.strokeStyle = `rgba(125, 211, 252, ${0.95 * mfT7})`;
            ctx.lineWidth = Math.max(2.2, 3.2 * u);
            for (let mc = 0; mc < 2; mc++) {
              const rx = (28 + mc * 14) * u * (1.2 - mfT7 * 0.2);
              const my = mTop - mc * 12 * u;
              ctx.beginPath();
              ctx.ellipse(0, my, rx, 9 * u, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
            CoreKinematics._drawStarGlint(ctx, 0, mTop - 4 * u, 28 * u * mfT7, '#fde047');
            CoreKinematics._drawStarGlint(ctx, 0, mTop - 4 * u, 16 * u * mfT7, '#ffffff');
          }
          ctx.restore();
        }
        ctx.restore();
      } else {
        if (this._t7DragonFlames && this._t7DragonFlames.length > 0) this._t7DragonFlames.length = 0;
        if (this._t7DragonEmbers && this._t7DragonEmbers.length > 0) this._t7DragonEmbers.length = 0;
      }"""

    g = replace_once(g, old_t7_super, new_t7_super, "Tier VII 10x middle super-weapons + active side muzzle flashes")

    # 4h. Upgrade Tier VII Central Projectile Visuals + Add Tier VII Side Projectile Renderer
    old_proj_t7 = """        if (s.isTier7) {
          if (s.t7Kind === 'princess_cannon') {
            const cR = 24;
            const sg = ctx.createRadialGradient(0, 0, 3, 0, 0, cR * 1.9);
            sg.addColorStop(0.0, '#ffffff');
            sg.addColorStop(0.32, 'rgba(56, 189, 248, 0.94)');
            sg.addColorStop(0.65, 'rgba(168, 85, 247, 0.62)');
            sg.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.arc(0, 0, cR * 1.9, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.ellipse(0, 0, cR * 1.35, cR * 0.52, now * 0.015 + s.phase, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.t7Kind === 'dragon_breath') {
            const wR = 32;
            const fg = ctx.createRadialGradient(0, 0, 4, 0, 4, wR * 1.3);
            fg.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
            fg.addColorStop(0.38, 'rgba(254, 240, 138, 0.78)');
            fg.addColorStop(0.72, 'rgba(249, 115, 22, 0.45)');
            fg.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(0, 0, wR * 1.3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const pl = ctx.createLinearGradient(0, -34, 0, 34);
            pl.addColorStop(0.0, '#ffffff');
            pl.addColorStop(0.35, '#67e8f9');
            pl.addColorStop(0.70, '#f472b6');
            pl.addColorStop(1.0, 'rgba(192, 132, 252, 0)');
            ctx.fillStyle = pl;
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 34, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
          continue;
        }"""

    new_proj_t7 = """        if (s.isTier7) {
          if (s.t7Kind === 'princess_cannon') {
            const cR = 26;
            const sg = ctx.createRadialGradient(0, 0, 3, 0, 0, cR * 2.1);
            sg.addColorStop(0.0, '#ffffff');
            sg.addColorStop(0.28, 'rgba(56, 189, 248, 0.96)');
            sg.addColorStop(0.62, 'rgba(168, 85, 247, 0.68)');
            sg.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.arc(0, 0, cR * 2.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.ellipse(0, 0, cR * 1.45, cR * 0.50, now * 0.018 + s.phase, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.ellipse(0, 0, cR * 1.32, cR * 0.44, -now * 0.022 + s.phase, 0, Math.PI * 2);
            ctx.stroke();

            // Lightning wake tail
            ctx.strokeStyle = 'rgba(125, 211, 252, 0.90)';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(0, 8);
            ctx.lineTo(Math.sin(now * 0.08 + s.phase) * 9, 26);
            ctx.lineTo(Math.cos(now * 0.09 + s.phase) * 7, 46);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.t7Kind === 'dragon_breath') {
            const ftList = QuantumRenderer._getDragonFlameTextures();
            const fImg = ftList[Math.floor((s.phase * 10 + now * 0.01) % ftList.length)];
            ctx.globalAlpha = 0.84;
            ctx.drawImage(fImg, -36, -36, 72, 72);
          } else {
            const pl = ctx.createLinearGradient(0, -38, 0, 38);
            pl.addColorStop(0.0, '#ffffff');
            pl.addColorStop(0.32, '#67e8f9');
            pl.addColorStop(0.68, '#f472b6');
            pl.addColorStop(1.0, 'rgba(192, 132, 252, 0)');
            ctx.fillStyle = pl;
            ctx.beginPath();
            ctx.moveTo(0, -40);
            ctx.lineTo(12, 0);
            ctx.lineTo(0, 34);
            ctx.lineTo(-12, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
          continue;
        }

        if (s.isTier7Side) {
          if (s.t7SideKind === 'helix_pulse') {
            const hg = ctx.createLinearGradient(0, -24, 0, 24);
            hg.addColorStop(0.0, '#ffffff');
            hg.addColorStop(0.4, '#67e8f9');
            hg.addColorStop(0.8, '#f472b6');
            hg.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.moveTo(0, -24);
            ctx.lineTo(6.5, -2);
            ctx.lineTo(0, 22);
            ctx.lineTo(-6.5, -2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, -4, 2.4, 11, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.t7SideKind === 'meteor_bolide') {
            const mg = ctx.createRadialGradient(0, -4, 2, 0, 2, 18);
            mg.addColorStop(0.0, '#ffffff');
            mg.addColorStop(0.35, '#fde047');
            mg.addColorStop(0.75, 'rgba(249, 115, 22, 0.82)');
            mg.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = mg;
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(0, 4);
            ctx.lineTo(0, 24);
            ctx.stroke();
          } else {
            const dg = ctx.createLinearGradient(0, -26, 0, 22);
            dg.addColorStop(0.0, '#ffffff');
            dg.addColorStop(0.35, '#38bdf8');
            dg.addColorStop(0.78, '#fbbf24');
            dg.addColorStop(1.0, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = dg;
            ctx.beginPath();
            ctx.moveTo(0, -26);
            ctx.lineTo(7, 0);
            ctx.lineTo(0, 22);
            ctx.lineTo(-7, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
          continue;
        }"""

    g = replace_once(g, old_proj_t7, new_proj_t7, "Tier VII center + side projectiles")

    # 4i. Bump cache tag in game.js
    g = g.replace("arcade421_tier7_celestial", "arcade422_tier7_ultra")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
