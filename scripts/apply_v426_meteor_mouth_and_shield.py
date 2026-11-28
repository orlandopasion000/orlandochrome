"""Apply v426: Rebuild hornless Meteor shield + Option B Mouth + Option C Helical Fire for Meteor Dragon T7."""
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
    geom["version"] = "v426_meteor_mouth"
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade425_dynamo_arc" in txt, f"{fname} missing arcade425_dynamo_arc"
        p.write_text(txt.replace("arcade425_dynamo_arc", "arcade426_meteor_mouth"), encoding="utf-8")
        print(f"PATCHED -> {fname}")

    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = replace_once(
        sw_txt,
        "'./assets/vfx-dynamo-origin-burst.png?v=arcade425_dynamo_arc',",
        """'./assets/vfx-dynamo-origin-burst.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-breath-0.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-breath-1.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-breath-2.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-breath-3.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-cheek-vents.png?v=arcade426_meteor_mouth',
  './assets/vfx-meteor-t7-snout-fg.png?v=arcade426_meteor_mouth',""",
        "sw.js add vfx-meteor-*",
    )
    sw_txt = sw_txt.replace("arcade425_dynamo_arc", "arcade426_meteor_mouth")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 1. Preload vfx-meteor-breath-0..3, vfx-meteor-cheek-vents, vfx-meteor-t7-snout-fg
    g = replace_once(
        g,
        """    dynamoArcs: [],
    dynamoTeslaBolt: null,
    dynamoOriginBurst: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false, meteorFireMissile: false, dynamoArcsCount: 0, dynamoArcs: false, dynamoTeslaBolt: false, dynamoOriginBurst: false }""",
        """    dynamoArcs: [],
    dynamoTeslaBolt: null,
    dynamoOriginBurst: null,
    meteorBreathFrames: [],
    meteorCheekVents: null,
    meteorSnoutFg: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false, meteorFireMissile: false, dynamoArcsCount: 0, dynamoArcs: false, dynamoTeslaBolt: false, dynamoOriginBurst: false, meteorBreathCount: 0, meteorBreath: false, meteorCheekVents: false, meteorSnoutFg: false }""",
        "VfxUltraAssets struct",
    )

    g = replace_once(
        g,
        """    const dobImg = new Image();
    VfxUltraAssets.dynamoOriginBurst = dobImg;
    dobImg.onload = () => { VfxUltraAssets.loaded.dynamoOriginBurst = true; };
    dobImg.src = 'assets/vfx-dynamo-origin-burst.png?v=arcade425_dynamo_arc';
  })();""",
        """    const dobImg = new Image();
    VfxUltraAssets.dynamoOriginBurst = dobImg;
    dobImg.onload = () => { VfxUltraAssets.loaded.dynamoOriginBurst = true; };
    dobImg.src = 'assets/vfx-dynamo-origin-burst.png?v=arcade426_meteor_mouth';

    VfxUltraAssets.meteorBreathFrames = [0, 1, 2, 3].map((idx) => {
      const bImg = new Image();
      bImg.onload = () => {
        VfxUltraAssets.loaded.meteorBreathCount += 1;
        if (VfxUltraAssets.loaded.meteorBreathCount >= 4) VfxUltraAssets.loaded.meteorBreath = true;
      };
      bImg.src = `assets/vfx-meteor-breath-${idx}.png?v=arcade426_meteor_mouth`;
      return bImg;
    });

    const mcvImg = new Image();
    VfxUltraAssets.meteorCheekVents = mcvImg;
    mcvImg.onload = () => { VfxUltraAssets.loaded.meteorCheekVents = true; };
    mcvImg.src = 'assets/vfx-meteor-cheek-vents.png?v=arcade426_meteor_mouth';

    const msfImg = new Image();
    VfxUltraAssets.meteorSnoutFg = msfImg;
    msfImg.onload = () => { VfxUltraAssets.loaded.meteorSnoutFg = true; };
    msfImg.src = 'assets/vfx-meteor-t7-snout-fg.png?v=arcade426_meteor_mouth';
  })();""",
        "preload meteor mouth vfx",
    )

    # 2. Upgrade Meteor Dragon Tier VII super-weapon: Option B Foreground Snout & Cheek Vents + Option C Helical Fire
    old_meteor_t7 = """        } else if (mode === 'meteor') {
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
          }"""

    new_meteor_t7 = """        } else if (mode === 'meteor') {
          // METEOR DRAGON v426: Option B Foreground Snout + Cheek Vents & Option C Seamless Helical Inferno Breath!
          const pxScale = Math.max(0.18, (mzs7W.right.x - mzs7W.left.x) / 220);
          const flameTexList = QuantumRenderer._getDragonFlameTextures();
          const mWispsImg = VfxUltraAssets.novaWisps && VfxUltraAssets.novaWisps.meteor;
          const mWispsReady = Boolean(
            VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaWisps && VfxUltraAssets.loaded.novaWisps.meteor &&
            mWispsImg && mWispsImg.naturalWidth > 0
          );
          const bFrames = VfxUltraAssets.meteorBreathFrames || [];
          const bReady = Boolean(VfxUltraAssets.loaded && VfxUltraAssets.loaded.meteorBreath && bFrames.length >= 4);
          if (!this._t7DragonFlames) this._t7DragonFlames = [];
          if (!this._t7DragonEmbers) this._t7DragonEmbers = [];

          for (let sp = 0; sp < 4; sp++) {
            if (this._t7DragonFlames.length < 48) {
              const spread = (Math.random() - 0.5) * 0.54;
              this._t7DragonFlames.push({
                x: cX + (Math.random() - 0.5) * 14 * u,
                y: cY - 12 * u,
                vx: Math.sin(spread) * (4.6 + Math.random() * 4.8),
                vy: -(15.0 + Math.random() * 8.5),
                size: (60 + Math.random() * 42) * u,
                grow: 4.5 * u,
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
              const spread = (Math.random() - 0.5) * 0.76;
              this._t7DragonEmbers.push({
                x: cX + (Math.random() - 0.5) * 18 * u,
                y: cY - 12 * u,
                vx: Math.sin(spread) * (8.8 + Math.random() * 9.0),
                vy: -(18.0 + Math.random() * 11.5),
                len: (14 + Math.random() * 20) * u,
                life: 0,
                maxLife: 18 + Math.random() * 12
              });
            }
          }

          const coneLen = Math.min(590, Math.max(370, h * 0.73));
          // Layer 1 (Option C): Whole-Head & Neck Volcanic Maw Rimlight + Deep Thermal Corridor Wash
          ctx.save();
          ctx.translate(cX, cY - coneLen * 0.45);
          ctx.scale(0.60, 1.0);
          const washR = coneLen * 0.66;
          const washGrad = ctx.createRadialGradient(0, washR * 0.42, 12 * u, 0, 0, washR);
          washGrad.addColorStop(0.0, 'rgba(255, 240, 185, 0.68)');
          washGrad.addColorStop(0.28, 'rgba(251, 146, 60, 0.46)');
          washGrad.addColorStop(0.62, 'rgba(220, 38, 38, 0.24)');
          washGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.arc(0, 0, washR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          const mawRim = ctx.createRadialGradient(cX, cY + 34 * pxScale, 6 * pxScale, cX, cY + 34 * pxScale, 92 * pxScale);
          mawRim.addColorStop(0.0, 'rgba(255, 190, 90, 0.52)');
          mawRim.addColorStop(0.45, 'rgba(234, 88, 12, 0.34)');
          mawRim.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
          ctx.fillStyle = mawRim;
          ctx.beginPath();
          ctx.arc(cX, cY + 34 * pxScale, 92 * pxScale, 0, Math.PI * 2);
          ctx.fill();

          // Layer 2 (Option B): Twin Swept Cheek-Vent Afterburner Exhaust Plumes
          if (VfxUltraAssets.loaded.meteorCheekVents && VfxUltraAssets.meteorCheekVents && VfxUltraAssets.meteorCheekVents.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = 0.88 + 0.12 * Math.sin(now * 0.045);
            const cvW = 256 * pxScale * 0.92;
            const cvH = 160 * pxScale * 0.92;
            ctx.drawImage(VfxUltraAssets.meteorCheekVents, cX - cvW * 0.5, cY + 28 * pxScale - cvH * 0.5, cvW, cvH);
            ctx.restore();
          }

          // Layer 3 (Option C): Continuous Helical Turbulent Inferno Cross-Faded Frames + Wisp Ribbons!
          if (bReady) {
            const bPhase = (now * 0.015) % 4;
            const bI0 = Math.floor(bPhase);
            const bI1 = (bI0 + 1) % 4;
            const bMix = bPhase - bI0;
            const bW = 276 * u + Math.sin(now * 0.018) * 10 * u;
            const bBaseY = cY + 14 * pxScale;
            const bH = coneLen + 30 * u;
            const sway = Math.sin(now * 0.016) * 6 * u;
            ctx.save();
            ctx.globalAlpha = (1.0 - bMix) * 0.94;
            ctx.drawImage(bFrames[bI0], cX - bW * 0.5 + sway, bBaseY - bH, bW, bH);
            ctx.globalAlpha = bMix * 0.94;
            ctx.drawImage(bFrames[bI1], cX - bW * 0.5 - sway * 0.7, bBaseY - bH, bW, bH);
            ctx.restore();
          }

          if (mWispsReady) {
            ctx.save();
            ctx.beginPath();
            const steps = 16;
            for (let si = 0; si <= steps; si++) {
              const f = si / steps;
              const py = cY - f * coneLen;
              const hw = (18 + Math.pow(f, 0.78) * 135) * u + Math.sin(now * 0.022 + f * 7.0) * 14 * u * f;
              if (si === 0) ctx.moveTo(cX - hw, py); else ctx.lineTo(cX - hw, py);
            }
            for (let si = steps; si >= 0; si--) {
              const f = si / steps;
              const py = cY - f * coneLen;
              const hw = (18 + Math.pow(f, 0.78) * 135) * u + Math.cos(now * 0.025 + f * 7.0) * 14 * u * f;
              ctx.lineTo(cX + hw, py);
            }
            ctx.closePath();
            ctx.clip();

            const sheetH = 440 * u;
            const scrB = (now * 0.98) % sheetH;
            for (let yTile = cY - coneLen - sheetH; yTile < cY + 40; yTile += sheetH) {
              const drawYB = yTile - scrB;
              const topProg = Math.max(0, Math.min(1, (cY - (drawYB + sheetH * 0.5)) / coneLen));
              const wSheet = (108 + topProg * 200) * u;
              const swayX = Math.sin(now * 0.015 + yTile * 0.024) * 20 * u;
              ctx.globalAlpha = 0.74 * (1.0 - topProg * 0.35);
              ctx.drawImage(mWispsImg, cX - wSheet * 0.5 + swayX, drawYB, wSheet, sheetH + 16 * u);
            }
            ctx.restore();
          }

          // Tight Hot Throat Core Directly at Open Jaws (Drawn Underneath Foreground Snout!)
          const jawGrad = ctx.createRadialGradient(cX, cY - 2 * pxScale, 1.5 * u, cX, cY - 4 * pxScale, 20 * u);
          jawGrad.addColorStop(0.0, 'rgba(255, 255, 240, 0.96)');
          jawGrad.addColorStop(0.45, 'rgba(253, 224, 71, 0.85)');
          jawGrad.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = jawGrad;
          ctx.beginPath();
          ctx.arc(cX, cY - 4 * pxScale, 20 * u, 0, Math.PI * 2);
          ctx.fill();

          // Billowing Real Photographic Fire-Cloud Puffs + 55 Streaking Incandescent Embers
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
            const fa = Math.sin((1.0 - tF) * Math.PI * 0.5) * 0.72;
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

          // Layer 4 (Option B): Foreground Real Armored Dragon Snout Bridge ON TOP of Flame Root!
          if (VfxUltraAssets.loaded.meteorSnoutFg && VfxUltraAssets.meteorSnoutFg && VfxUltraAssets.meteorSnoutFg.naturalWidth > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
            const snSize = 220 * pxScale;
            ctx.drawImage(VfxUltraAssets.meteorSnoutFg, cX - 110 * pxScale, cY - 34 * pxScale, snSize, snSize);
            ctx.restore();
          }

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
          }"""

    g = replace_once(g, old_meteor_t7, new_meteor_t7, "Meteor Dragon T7 Option B mouth + Option C helical fire")

    g = g.replace("arcade425_dynamo_arc", "arcade426_meteor_mouth")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
