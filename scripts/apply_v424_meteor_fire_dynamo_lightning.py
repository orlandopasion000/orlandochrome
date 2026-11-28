"""Apply v424 upgrades: real fluid-fire & blazing Meteor missiles + massive Layla-inspired electric Dynamo T7."""
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
    geom["version"] = "v424_fire_lightning"
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade423_aaa_relics" in txt
        p.write_text(txt.replace("arcade423_aaa_relics", "arcade424_fire_lightning"), encoding="utf-8")
        print(f"PATCHED -> {fname}")

    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = replace_once(
        sw_txt,
        "'./assets/vfx-t7-dynamo-cannon-3d.png?v=arcade423_aaa_relics',",
        "'./assets/vfx-t7-dynamo-cannon-3d.png?v=arcade424_fire_lightning',\n  './assets/vfx-meteor-fire-missile.png?v=arcade424_fire_lightning',",
        "sw.js add meteorFireMissile",
    )
    sw_txt = sw_txt.replace("arcade423_aaa_relics", "arcade424_fire_lightning")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 1. Preload VfxUltraAssets.meteorFireMissile
    g = replace_once(
        g,
        """    seekerMissile: null,
    t7DynamoCannon: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false }""",
        """    seekerMissile: null,
    t7DynamoCannon: null,
    meteorFireMissile: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false, meteorFireMissile: false }""",
        "VfxUltraAssets struct",
    )
    g = replace_once(
        g,
        """    dcImg.src = 'assets/vfx-t7-dynamo-cannon-3d.png?v=arcade423_aaa_relics';
  })();""",
        """    dcImg.src = 'assets/vfx-t7-dynamo-cannon-3d.png?v=arcade424_fire_lightning';

    const mfImg = new Image();
    VfxUltraAssets.meteorFireMissile = mfImg;
    mfImg.onload = () => { VfxUltraAssets.loaded.meteorFireMissile = true; };
    mfImg.src = 'assets/vfx-meteor-fire-missile.png?v=arcade424_fire_lightning';
  })();""",
        "preload meteorFireMissile",
    )

    # 2. Meteor Power-Up Micro-Missiles -> photorealistic meteorFireMissile sprite!
    g = replace_once(
        g,
        """        if (mMode === 'dynamo' && VfxUltraAssets.loaded.seekerMissile && VfxUltraAssets.seekerMissile && VfxUltraAssets.seekerMissile.naturalWidth > 0) {
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
        } else {""",
        """        if (mMode === 'meteor' && VfxUltraAssets.loaded.meteorFireMissile && VfxUltraAssets.meteorFireMissile && VfxUltraAssets.meteorFireMissile.naturalWidth > 0) {
          ctx.rotate(m.angle + Math.PI * 0.5);
          const mGlow = QuantumRenderer._getGlowSprite('amber');
          ctx.globalAlpha = 0.72;
          ctx.drawImage(mGlow, -30, -30, 60, 60);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(VfxUltraAssets.meteorFireMissile, -24, -22, 48, 72);
          ctx.restore();
        } else if (mMode === 'dynamo' && VfxUltraAssets.loaded.seekerMissile && VfxUltraAssets.seekerMissile && VfxUltraAssets.seekerMissile.naturalWidth > 0) {
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
        } else {""",
        "Power-Up Meteor micro-missiles",
    )

    # 3. Add CoreKinematics._drawTeslaBolt helper right after _drawStarGlint
    g = replace_once(
        g,
        """    _drawStarGlint(ctx, x, y, r, color = '#ffffff') {
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
    },""",
        """    _drawStarGlint(ctx, x, y, r, color = '#ffffff') {
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

    _drawTeslaBolt(ctx, x1, y1, x2, y2, disp, segs, outerCol, coreCol, lw = 2.8, seed = 1.0, withBranch = true) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;
      const pts = [{ x: x1, y: y1 }];
      for (let s = 1; s < segs; s++) {
        const f = s / segs;
        const j = Math.sin(seed * 7.3 + s * 4.17) * 0.65 + Math.cos(seed * 13.1 - s * 2.91) * 0.35;
        const env = Math.sin(f * Math.PI);
        pts.push({
          x: x1 + dx * f + nx * j * disp * env,
          y: y1 + dy * f + ny * j * disp * env
        });
      }
      pts.push({ x: x2, y: y2 });

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = outerCol;
      ctx.lineWidth = lw * 2.4;
      ctx.stroke();

      ctx.strokeStyle = coreCol;
      ctx.lineWidth = lw * 0.9;
      ctx.stroke();

      if (withBranch && segs >= 4) {
        const bi = Math.max(1, Math.min(segs - 2, Math.floor(segs * (0.35 + 0.3 * Math.abs(Math.sin(seed * 2.9))))));
        const bp = pts[bi];
        const bAng = Math.atan2(dy, dx) + ((Math.sin(seed * 5.1) >= 0) ? 0.55 : -0.55);
        const bLen = dist * 0.28;
        const bx2 = bp.x + Math.cos(bAng) * bLen;
        const by2 = bp.y + Math.sin(bAng) * bLen;
        const bmx = (bp.x + bx2) * 0.5 + nx * Math.sin(seed * 9.7) * disp * 0.45;
        const bmy = (bp.y + by2) * 0.5 + ny * Math.sin(seed * 9.7) * disp * 0.45;
        ctx.beginPath();
        ctx.moveTo(bp.x, bp.y);
        ctx.lineTo(bmx, bmy);
        ctx.lineTo(bx2, by2);
        ctx.strokeStyle = outerCol;
        ctx.lineWidth = lw * 1.45;
        ctx.stroke();
        ctx.strokeStyle = coreCol;
        ctx.lineWidth = Math.max(0.9, lw * 0.55);
        ctx.stroke();
      }
      ctx.restore();
    },""",
        "Add CoreKinematics._drawTeslaBolt",
    )

    # 4. Replace _getDragonFlameTextures to slice real fluid-fire sprites (no star petals!)
    g = replace_once(
        g,
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
    },""",
        """    _dragonFlameTextures: null,
    _dragonFlameRealReady: false,
    _getDragonFlameTextures() {
      const fSrc = (typeof VfxUltraAssets !== 'undefined' && VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaFlame && VfxUltraAssets.loaded.novaFlame.meteor) ? VfxUltraAssets.novaFlame.meteor : null;
      const wSrc = (typeof VfxUltraAssets !== 'undefined' && VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaWisps && VfxUltraAssets.loaded.novaWisps.meteor) ? VfxUltraAssets.novaWisps.meteor : null;
      const realReady = Boolean(fSrc && fSrc.naturalWidth > 0 && wSrc && wSrc.naturalWidth > 0);
      if (this._dragonFlameTextures && (this._dragonFlameRealReady || !realReady)) return this._dragonFlameTextures;

      const list = [];
      for (let v = 0; v < 4; v++) {
        const cv = document.createElement('canvas');
        cv.width = 128; cv.height = 128;
        const g = cv.getContext('2d');
        if (realReady) {
          // Sample genuine turbulent photographic fire texture cropped & vertically feathered
          const src = (v % 2 === 0) ? wSrc : fSrc;
          const sw = src.naturalWidth;
          const sh = src.naturalHeight;
          const cropW = Math.min(sw, 180);
          const cropH = Math.min(sh, 180);
          const sx = Math.max(0, Math.floor((sw - cropW) * (0.28 + 0.44 * (v % 2))));
          const sy = Math.max(0, Math.floor(((sh - cropH) / 4) * v));
          g.drawImage(src, sx, sy, cropW, cropH, 0, 0, 128, 128);
          g.globalCompositeOperation = 'destination-in';
          const mask = g.createRadialGradient(64, 68, 8, 64, 64, 62);
          mask.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
          mask.addColorStop(0.55, 'rgba(255, 255, 255, 0.85)');
          mask.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
          g.fillStyle = mask;
          g.fillRect(0, 0, 128, 128);
        } else {
          // Soft multi-layer organic cloud fallback while async PNGs finish loading
          const rg = g.createRadialGradient(64, 64, 4, 64, 64, 60);
          rg.addColorStop(0.0, 'rgba(255, 248, 220, 0.92)');
          rg.addColorStop(0.38, 'rgba(251, 146, 60, 0.68)');
          rg.addColorStop(0.76, 'rgba(220, 38, 38, 0.30)');
          rg.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          g.fillStyle = rg;
          g.fillRect(0, 0, 128, 128);
        }
        list.push(cv);
      }
      this._dragonFlameTextures = list;
      this._dragonFlameRealReady = realReady;
      return list;
    },""",
        "Real fluid-fire texture slicer",
    )

    # 5. Skill 2 Meteor Seeker Comets -> photorealistic meteorFireMissile (Zero cartoon triangles!)
    g = replace_once(
        g,
        """          // Custom Sculpted 3D Blazing Molten-Lava Meteor Bolide with Golden Armored Wings & Orbiting Cinders
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
          ctx.restore();""",
        """          // v424 Photorealistic Blazing Molten Meteor Fire-Missile (Zero Cartoon Triangles!)
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(mAngle);
          ctx.scale(pulseM, pulseM);
          if (VfxUltraAssets.loaded.meteorFireMissile && VfxUltraAssets.meteorFireMissile && VfxUltraAssets.meteorFireMissile.naturalWidth > 0) {
            ctx.drawImage(VfxUltraAssets.meteorFireMissile, -34, -36, 68, 102);
          } else {
            const fbG = QuantumRenderer._getGlowSprite('amber');
            ctx.drawImage(fbG, -36, -36, 72, 72);
          }
          // Subtle incandescent magnetic heat-shock crescent ahead of volcanic warhead
          ctx.strokeStyle = 'rgba(255, 248, 220, 0.88)';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(-19, -4);
          ctx.quadraticCurveTo(0, -34, 19, -4);
          ctx.stroke();
          ctx.restore();""",
        "Skill 2 Seeker Comets -> photorealistic meteorFireMissile",
    )

    # 6. Upgrade Meteor Tier VII Real Fluid-Fire + Dynamo Tier VII Astral-Lightning Cannon (Keeping Helix 100% intact!)
    old_meteor_dynamo = """        } else if (mode === 'meteor') {
          // METEOR DRAGON: Fractal Ragged Turbulent Dragonfire Inferno + Incandescent Embers + Thermal Shock Arcs
          const flameTexList = QuantumRenderer._getDragonFlameTextures();
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
        }"""

    new_meteor_dynamo = """        } else if (mode === 'meteor') {
          // METEOR DRAGON v424: Continuous Photorealistic Roaring Volumetric Fluid-Fire Inferno + Hot Embers!
          const flameTexList = QuantumRenderer._getDragonFlameTextures();
          const mFlameImg = VfxUltraAssets.novaFlame && VfxUltraAssets.novaFlame.meteor;
          const mWispsImg = VfxUltraAssets.novaWisps && VfxUltraAssets.novaWisps.meteor;
          const mRealReady = Boolean(
            VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaFlame && VfxUltraAssets.loaded.novaFlame.meteor &&
            mFlameImg && mFlameImg.naturalWidth > 0 && mWispsImg && mWispsImg.naturalWidth > 0
          );
          if (!this._t7DragonFlames) this._t7DragonFlames = [];
          if (!this._t7DragonEmbers) this._t7DragonEmbers = [];

          for (let sp = 0; sp < 4; sp++) {
            if (this._t7DragonFlames.length < 48) {
              const spread = (Math.random() - 0.5) * 0.62;
              this._t7DragonFlames.push({
                x: cX + (Math.random() - 0.5) * 16 * u,
                y: cY - 8 * u,
                vx: Math.sin(spread) * (5.2 + Math.random() * 5.2),
                vy: -(14.5 + Math.random() * 8.5),
                size: (68 + Math.random() * 44) * u,
                grow: 4.8 * u,
                rot: (Math.random() - 0.5) * 0.7,
                vRot: (Math.random() - 0.5) * 0.05,
                texIdx: Math.floor(Math.random() * flameTexList.length),
                turbPhase: Math.random() * Math.PI * 2,
                life: 0,
                maxLife: 20 + Math.random() * 10
              });
            }
          }
          for (let ep = 0; ep < 4; ep++) {
            if (this._t7DragonEmbers.length < 55) {
              const spread = (Math.random() - 0.5) * 0.80;
              this._t7DragonEmbers.push({
                x: cX + (Math.random() - 0.5) * 24 * u,
                y: cY - 10 * u,
                vx: Math.sin(spread) * (9.5 + Math.random() * 9.0),
                vy: -(17.5 + Math.random() * 12.0),
                len: (14 + Math.random() * 20) * u,
                life: 0,
                maxLife: 18 + Math.random() * 12
              });
            }
          }

          const coneLen = Math.min(580, Math.max(360, h * 0.72));
          // Layer 1: Wide Deep-Crimson Thermal Glow Wash Under Entire Fire Corridor
          ctx.save();
          ctx.translate(cX, cY - coneLen * 0.46);
          ctx.scale(0.62, 1.0);
          const washR = coneLen * 0.68;
          const washGrad = ctx.createRadialGradient(0, washR * 0.40, 14 * u, 0, 0, washR);
          washGrad.addColorStop(0.0, 'rgba(255, 245, 200, 0.78)');
          washGrad.addColorStop(0.28, 'rgba(251, 146, 60, 0.52)');
          washGrad.addColorStop(0.62, 'rgba(220, 38, 38, 0.28)');
          washGrad.addColorStop(0.90, 'rgba(153, 27, 27, 0.10)');
          washGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.arc(0, 0, washR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Layer 2: Dual-Layer Upward-Scrolling Real Photographic Fluid-Fire Sheets Clipped Inside Roaring Flame Envelope!
          if (mRealReady) {
            ctx.save();
            ctx.beginPath();
            const steps = 16;
            for (let si = 0; si <= steps; si++) {
              const f = si / steps;
              const py = cY - f * coneLen;
              const hw = (26 + Math.pow(f, 0.78) * 145) * u + Math.sin(now * 0.022 + f * 7.0) * 14 * u * f;
              if (si === 0) ctx.moveTo(cX - hw, py); else ctx.lineTo(cX - hw, py);
            }
            for (let si = steps; si >= 0; si--) {
              const f = si / steps;
              const py = cY - f * coneLen;
              const hw = (26 + Math.pow(f, 0.78) * 145) * u + Math.cos(now * 0.025 + f * 7.0) * 14 * u * f;
              ctx.lineTo(cX + hw, py);
            }
            ctx.closePath();
            ctx.clip();

            const sheetH = 440 * u;
            const scrA = (now * 0.68) % sheetH;
            const scrB = (now * 0.94) % sheetH;
            for (let yTile = cY - coneLen - sheetH; yTile < cY + 40; yTile += sheetH) {
              const drawY = yTile - scrA;
              const topProg = Math.max(0, Math.min(1, (cY - (drawY + sheetH * 0.5)) / coneLen));
              const wSheet = (120 + topProg * 210) * u;
              ctx.globalAlpha = 0.88 * (1.0 - topProg * 0.42);
              ctx.drawImage(mFlameImg, cX - wSheet * 0.5, drawY, wSheet, sheetH + 16 * u);

              const drawYB = yTile - scrB;
              const swayX = Math.sin(now * 0.012 + yTile * 0.02) * 18 * u;
              ctx.globalAlpha = 0.76 * (1.0 - topProg * 0.35);
              ctx.drawImage(mWispsImg, cX - wSheet * 0.45 + swayX, drawYB, wSheet * 0.9, sheetH + 16 * u);
            }
            ctx.restore();
          }

          // Layer 3: Billowing Real Photographic Fire-Cloud Puffs + 55 Streaking Incandescent Embers
          for (let fIdx = this._t7DragonFlames.length - 1; fIdx >= 0; fIdx--) {
            const fl = this._t7DragonFlames[fIdx];
            const dS = Math.max(0.5, dtScale || 1);
            fl.x += (fl.vx + Math.sin(now * 0.022 + fl.turbPhase) * 1.6) * dS;
            fl.y += fl.vy * dS;
            fl.size += fl.grow * dS;
            fl.rot += fl.vRot * dS;
            fl.life += dS;
            if (fl.life >= fl.maxLife) {
              this._t7DragonFlames.splice(fIdx, 1);
              continue;
            }
            const tF = fl.life / fl.maxLife;
            const fa = Math.sin((1.0 - tF) * Math.PI * 0.5) * 0.78;
            ctx.save();
            ctx.translate(fl.x, fl.y);
            ctx.rotate(fl.rot);
            ctx.globalAlpha = fa;
            ctx.drawImage(flameTexList[fl.texIdx], -fl.size * 0.5, -fl.size * 0.5, fl.size, fl.size);
            ctx.restore();
          }

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
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.95 * ea})`;
            ctx.lineWidth = Math.max(1.5, 2.4 * u);
            ctx.beginPath();
            ctx.moveTo(em.x, em.y);
            ctx.lineTo(em.x - em.vx * 0.65, em.y - em.vy * 0.65);
            ctx.stroke();
          }

          // Layer 4: Incandescent Blue-White Plasma Dragon Jaw Ignition Core
          const jawGrad = ctx.createRadialGradient(cX, cY, 2 * u, cX, cY - 10 * u, 44 * u);
          jawGrad.addColorStop(0.0, '#ffffff');
          jawGrad.addColorStop(0.30, 'rgba(96, 165, 250, 0.92)');
          jawGrad.addColorStop(0.62, 'rgba(253, 224, 71, 0.78)');
          jawGrad.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = jawGrad;
          ctx.beginPath();
          ctx.arc(cX, cY - 10 * u, 44 * u, 0, Math.PI * 2);
          ctx.fill();

          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dyFront = cY - pt.y;
            if (dyFront >= -20 && dyFront <= coneLen) {
              const maxSpan = 42 + Math.max(0, dyFront) * 0.38;
              if (Math.abs(pt.x - cX) <= maxSpan + (pt.headR || 26)) {
                if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
                pt.shotHp -= 0.72 * Math.max(0.5, dtScale || 1);
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
              if (dyB >= -10 && dyB <= coneLen && Math.abs(bb.x - cX) <= 42 + Math.max(0, dyB) * 0.38) {
                this._spawnHitSparks(bb.x, bb.y, '#fde047', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }

        } else {
          // DYNAMO PRINCESS v424: Pure High-Voltage Astral-Lightning Mega-Cannon (Inspired by Uploaded Layla References!)
          const dFlameImg = VfxUltraAssets.novaFlame && VfxUltraAssets.novaFlame.dynamo;
          const dWispsImg = VfxUltraAssets.novaWisps && VfxUltraAssets.novaWisps.dynamo;
          const dPlasmaReady = Boolean(
            VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaFlame && VfxUltraAssets.loaded.novaFlame.dynamo &&
            dFlameImg && dFlameImg.naturalWidth > 0 && dWispsImg && dWispsImg.naturalWidth > 0
          );
          const originX = cX;
          const originY = cY - 26 * u;
          const beamTop = -32;
          const beamLen = Math.max(150, originY - beamTop);
          const halfBeam = (38 + Math.sin(now * 0.036) * 5) * u;

          // 1. Twin High-Voltage Multi-Branch Faraday Conduits from Shoulder Towers -> Her Raised Hands
          [mzs7W.left, mzs7W.right].forEach((sMuz, sIdx) => {
            const handX = cX + (sIdx === 0 ? -18 : 18) * u;
            const handY = cY + 4 * u;
            this._drawTeslaBolt(ctx, sMuz.x, sMuz.y, handX, handY, 15 * u, 5, 'rgba(56, 189, 248, 0.85)', '#ffffff', 2.4 * u, now * 0.04 + sIdx * 3.7, true);
            this._drawTeslaBolt(ctx, sMuz.x, sMuz.y, originX, originY, 18 * u, 6, 'rgba(168, 85, 247, 0.78)', 'rgba(224, 242, 254, 0.96)', 2.0 * u, now * 0.05 + sIdx * 9.1, true);
          });

          // 2. Signature Dark-Indigo Starburst Contrast Silhouette Behind Discharge Origin (Sharp Anime-Sci-Fi Impact!)
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(originX, originY);
          ctx.fillStyle = 'rgba(8, 6, 26, 0.86)';
          ctx.beginPath();
          const dSpikes = 10;
          for (let sp = 0; sp < dSpikes * 2; sp++) {
            const a = (sp / (dSpikes * 2)) * Math.PI * 2 + Math.sin(now * 0.015) * 0.08;
            const rad = (sp % 2 === 0) ? (56 + 18 * Math.sin(now * 0.04 + sp)) * u : 16 * u;
            if (sp === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
            else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // 3. Colossal Electric Rail-Cannon Torrent Beam (Scrolling Plasma Sheets + Holographic Rail Sight Lines!)
          ctx.save();
          const bGrad = ctx.createLinearGradient(originX - halfBeam, 0, originX + halfBeam, 0);
          bGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0)');
          bGrad.addColorStop(0.16, 'rgba(56, 189, 248, 0.62)');
          bGrad.addColorStop(0.30, 'rgba(168, 85, 247, 0.82)');
          bGrad.addColorStop(0.46, 'rgba(224, 242, 254, 0.95)');
          bGrad.addColorStop(0.50, '#ffffff');
          bGrad.addColorStop(0.54, 'rgba(224, 242, 254, 0.95)');
          bGrad.addColorStop(0.70, 'rgba(232, 121, 249, 0.78)');
          bGrad.addColorStop(0.84, 'rgba(56, 189, 248, 0.62)');
          bGrad.addColorStop(1.0, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = bGrad;
          ctx.fillRect(originX - halfBeam, beamTop, halfBeam * 2, beamLen);

          if (dPlasmaReady) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(originX - halfBeam * 0.92, beamTop, halfBeam * 1.84, beamLen);
            ctx.clip();
            const dSheetH = 420 * u;
            const dScr = (now * 0.85) % dSheetH;
            for (let yT = beamTop - dSheetH; yT < originY + 30; yT += dSheetH) {
              ctx.globalAlpha = 0.62;
              ctx.drawImage(dWispsImg, originX - halfBeam * 0.88, yT - dScr, halfBeam * 1.76, dSheetH + 14 * u);
            }
            ctx.restore();
          }

          // Twin Sleek Holographic Rail-Sight Corridor Lines + Rising Electric Shock-Rings
          for (const side of [-1, 1]) {
            ctx.strokeStyle = side === -1 ? 'rgba(56, 189, 248, 0.96)' : 'rgba(240, 171, 252, 0.94)';
            ctx.lineWidth = Math.max(2.0, 3.0 * u);
            ctx.beginPath();
            ctx.moveTo(originX + side * 26 * u, cY);
            ctx.lineTo(originX + side * (halfBeam * 0.82), beamTop);
            ctx.stroke();
          }
          const ePhase = (now * 0.007) % 1.0;
          for (let er = 0; er < 5; er++) {
            const ef = ((er / 5) + ePhase) % 1.0;
            const ey = originY - ef * beamLen;
            ctx.strokeStyle = er % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(240, 171, 252, 0.85)';
            ctx.lineWidth = Math.max(1.8, 2.6 * u);
            ctx.beginPath();
            ctx.ellipse(originX, ey, halfBeam * 0.92, 9 * u, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          // 4. MASSIVE RECURSIVE FORKED TESLA LIGHTNING SURGING UP THE BEAM & CRACKLING OUTWARD!
          const lTick = Math.floor(now / 42);
          for (let lb = 0; lb < 6; lb++) {
            const xOff = Math.sin(lTick * 3.1 + lb * 1.9) * halfBeam * 0.65;
            const topOff = Math.cos(lTick * 2.7 + lb * 2.3) * halfBeam * 0.85;
            const colOuter = (lb % 3 === 0) ? 'rgba(56, 189, 248, 0.92)' : ((lb % 3 === 1) ? 'rgba(168, 85, 247, 0.90)' : 'rgba(244, 114, 182, 0.88)');
            this._drawTeslaBolt(ctx, originX + xOff * 0.35, originY, originX + topOff, beamTop + 20, 26 * u, 9, colOuter, '#ffffff', 2.4 * u, lTick + lb * 4.3, true);
          }
          // Radial Sideway Snap Lightning Arcs from Cannon Origin
          for (let sa = 0; sa < 4; sa++) {
            const ang = (sa < 2 ? -Math.PI * 0.82 : -Math.PI * 0.18) + Math.sin(lTick * 2.3 + sa) * 0.25;
            const reach = (82 + 45 * Math.abs(Math.cos(lTick * 1.9 + sa))) * u;
            this._drawTeslaBolt(ctx, originX, originY - 12 * u, originX + Math.cos(ang) * reach, originY - 12 * u + Math.sin(ang) * reach, 16 * u, 5, 'rgba(56, 189, 248, 0.88)', '#ffffff', 2.0 * u, lTick * 1.3 + sa * 7.1, true);
          }

          // 5. Holographic Swept Crystal-Cannon Wing Fins + Blinding Origin Flare
          ctx.save();
          ctx.translate(originX, originY);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
          ctx.beginPath();
          ctx.arc(0, 0, 16 * u, 0, Math.PI * 2);
          ctx.fill();
          CoreKinematics._drawStarGlint(ctx, 0, 0, 42 * u * (0.9 + 0.18 * mfT7), '#38bdf8');
          CoreKinematics._drawStarGlint(ctx, 0, 0, 24 * u, '#f0abfc');
          ctx.restore();

          // 6. Continuous Corridor Electro-Damage + Live Chain-Lightning Snap Arcs to Nearby Bad Nodes!
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dxAbs = Math.abs(pt.x - originX);
            const hr = (pt.headR || 28) + 42;
            if (pt.y <= originY + 24 && dxAbs < hr) {
              this._drawTeslaBolt(ctx, originX, Math.max(20, pt.y + 36), pt.x, pt.y, 12 * u, 4, 'rgba(56, 189, 248, 0.90)', '#ffffff', 2.0 * u, lTick + pIdx * 2.1, false);
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= 0.42 * Math.max(0.5, dtScale || 1);
              if (Math.random() < 0.45) this._spawnHitSparks(pt.x, pt.y, '#38bdf8', 2);
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#a855f7', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              }
            }
          }
        }"""

    g = replace_once(g, old_meteor_dynamo, new_meteor_dynamo, "Meteor Real Fire + Dynamo Astral Lightning T7")

    # 7. Upgrade Tier VII Side & Center Projectiles for Meteor (real blaze missile) & Dynamo (Astral Spearhead + Tesla Forked Side Bolt)
    old_t7_proj = """        if (s.isTier7) {
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

    new_t7_proj = """        if (s.isTier7) {
          if (s.t7Kind === 'princess_cannon') {
            // Blazing Layla-Inspired Astral-Lightning Spearhead + Dual Energy Rings + Forked Lightning Tail
            const lg = ctx.createRadialGradient(0, 0, 4, 0, 0, 52);
            lg.addColorStop(0.0, '#ffffff');
            lg.addColorStop(0.28, 'rgba(56, 189, 248, 0.94)');
            lg.addColorStop(0.62, 'rgba(168, 85, 247, 0.62)');
            lg.addColorStop(1.0, 'rgba(168, 85, 247, 0)');
            ctx.fillStyle = lg;
            ctx.beginPath();
            ctx.arc(0, 0, 52, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.moveTo(0, -48);
            ctx.lineTo(13, -6);
            ctx.lineTo(0, 32);
            ctx.lineTo(-13, -6);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -38);
            ctx.lineTo(6, -6);
            ctx.lineTo(0, 20);
            ctx.lineTo(-6, -6);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.ellipse(0, 0, 34, 12, now * 0.018 + s.phase, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = '#f0abfc';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(0, 0, 30, 10, -now * 0.022 + s.phase, 0, Math.PI * 2);
            ctx.stroke();

            this._drawTeslaBolt(ctx, 0, 12, Math.sin(now * 0.06 + s.phase) * 8, 64, 14, 5, 'rgba(56, 189, 248, 0.92)', '#ffffff', 2.4, now * 0.05 + s.phase, true);
          } else if (s.t7Kind === 'dragon_breath') {
            const ftList = QuantumRenderer._getDragonFlameTextures();
            const fImg = ftList[Math.floor((s.phase * 10 + now * 0.01) % ftList.length)];
            ctx.globalAlpha = 0.86;
            ctx.drawImage(fImg, -44, -44, 88, 88);
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
            // Photorealistic Blazing Molten Meteor Missile Sprite
            if (VfxUltraAssets.loaded.meteorFireMissile && VfxUltraAssets.meteorFireMissile && VfxUltraAssets.meteorFireMissile.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.meteorFireMissile, -24, -22, 48, 72);
            } else {
              const fg = QuantumRenderer._getGlowSprite('amber');
              ctx.drawImage(fg, -26, -26, 52, 52);
            }
          } else {
            // Jagged High-Voltage Forked Tesla Bolt from Shoulder Towers
            this._drawTeslaBolt(ctx, 0, -28, 0, 28, 10, 5, 'rgba(56, 189, 248, 0.92)', '#ffffff', 2.2, now * 0.08 + s.phase, true);
            CoreKinematics._drawStarGlint(ctx, 0, -24, 11, '#fde047');
          }
          ctx.restore();
          continue;
        }"""

    g = replace_once(g, old_t7_proj, new_t7_proj, "Tier VII projectiles v424")

    # 8. Cache tag bump
    g = g.replace("arcade423_aaa_relics", "arcade424_fire_lightning")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
