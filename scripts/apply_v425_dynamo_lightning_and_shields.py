"""Apply v425: Photorealistic Lichtenberg Dynamo Tier VII lightning + hornless Meteor shields."""
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
    geom["version"] = "v425_dynamo_arc"
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade424_fire_lightning" in txt, f"{fname} missing arcade424_fire_lightning"
        p.write_text(txt.replace("arcade424_fire_lightning", "arcade425_dynamo_arc"), encoding="utf-8")
        print(f"PATCHED -> {fname}")

    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = replace_once(
        sw_txt,
        "'./assets/vfx-meteor-fire-missile.png?v=arcade424_fire_lightning',",
        """'./assets/vfx-meteor-fire-missile.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-arc-0.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-arc-1.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-arc-2.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-arc-3.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-tesla-bolt.png?v=arcade425_dynamo_arc',
  './assets/vfx-dynamo-origin-burst.png?v=arcade425_dynamo_arc',""",
        "sw.js add vfx-dynamo-*",
    )
    sw_txt = sw_txt.replace("arcade424_fire_lightning", "arcade425_dynamo_arc")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 1. Preload vfx-dynamo-arc-0..3, vfx-dynamo-tesla-bolt, vfx-dynamo-origin-burst
    g = replace_once(
        g,
        """    seekerMissile: null,
    t7DynamoCannon: null,
    meteorFireMissile: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false, meteorFireMissile: false }""",
        """    seekerMissile: null,
    t7DynamoCannon: null,
    meteorFireMissile: null,
    dynamoArcs: [],
    dynamoTeslaBolt: null,
    dynamoOriginBurst: null,
    loaded: { novaFlame: {}, novaWisps: {}, novaCorona: {}, gunBolt: {}, seekerMissile: false, t7DynamoCannon: false, meteorFireMissile: false, dynamoArcsCount: 0, dynamoArcs: false, dynamoTeslaBolt: false, dynamoOriginBurst: false }""",
        "VfxUltraAssets struct",
    )

    g = replace_once(
        g,
        """    const mfImg = new Image();
    VfxUltraAssets.meteorFireMissile = mfImg;
    mfImg.onload = () => { VfxUltraAssets.loaded.meteorFireMissile = true; };
    mfImg.src = 'assets/vfx-meteor-fire-missile.png?v=arcade424_fire_lightning';
  })();""",
        """    const mfImg = new Image();
    VfxUltraAssets.meteorFireMissile = mfImg;
    mfImg.onload = () => { VfxUltraAssets.loaded.meteorFireMissile = true; };
    mfImg.src = 'assets/vfx-meteor-fire-missile.png?v=arcade425_dynamo_arc';

    VfxUltraAssets.dynamoArcs = [0, 1, 2, 3].map((idx) => {
      const aImg = new Image();
      aImg.onload = () => {
        VfxUltraAssets.loaded.dynamoArcsCount += 1;
        if (VfxUltraAssets.loaded.dynamoArcsCount >= 4) VfxUltraAssets.loaded.dynamoArcs = true;
      };
      aImg.src = `assets/vfx-dynamo-arc-${idx}.png?v=arcade425_dynamo_arc`;
      return aImg;
    });

    const dtImg = new Image();
    VfxUltraAssets.dynamoTeslaBolt = dtImg;
    dtImg.onload = () => { VfxUltraAssets.loaded.dynamoTeslaBolt = true; };
    dtImg.src = 'assets/vfx-dynamo-tesla-bolt.png?v=arcade425_dynamo_arc';

    const dobImg = new Image();
    VfxUltraAssets.dynamoOriginBurst = dobImg;
    dobImg.onload = () => { VfxUltraAssets.loaded.dynamoOriginBurst = true; };
    dobImg.src = 'assets/vfx-dynamo-origin-burst.png?v=arcade425_dynamo_arc';
  })();""",
        "preload dynamo vfx",
    )

    # 2. Add CoreKinematics._drawLightningSprite right after CoreKinematics._drawStarGlint
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

    _drawLightningSprite(ctx, x1, y1, x2, y2, widthPx, frameIdx, alpha = 0.95) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) return;
      const idxRaw = Math.abs(Math.floor(frameIdx));
      const arcs = VfxUltraAssets.dynamoArcs || [];
      const tex = arcs[idxRaw % Math.max(1, arcs.length)];
      const flip = ((idxRaw >> 2) & 1) === 1 ? -1 : 1;
      const ang = Math.atan2(dy, dx) - Math.PI * 0.5;
      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(ang);
      ctx.scale(flip, 1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      if (tex && tex.complete && tex.naturalWidth > 0) {
        const w = Math.max(12, widthPx);
        ctx.drawImage(tex, -w * 0.5, 0, w, dist);
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, dist);
        g.addColorStop(0.0, 'rgba(224, 242, 254, 0.95)');
        g.addColorStop(0.5, 'rgba(56, 189, 248, 0.72)');
        g.addColorStop(1.0, 'rgba(168, 85, 247, 0.25)');
        ctx.fillStyle = g;
        ctx.fillRect(-widthPx * 0.12, 0, widthPx * 0.24, dist);
      }
      ctx.restore();
    },""",
        "CoreKinematics._drawLightningSprite",
    )

    # 3. Replace Dynamo Princess Tier VII super-weapon block (zero stick lines / diagonal lines / plain ellipses / flat polygon star)
    old_dynamo_t7 = """        } else {
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
            CoreKinematics._drawTeslaBolt(ctx, sMuz.x, sMuz.y, handX, handY, 15 * u, 5, 'rgba(56, 189, 248, 0.85)', '#ffffff', 2.4 * u, now * 0.04 + sIdx * 3.7, true);
            CoreKinematics._drawTeslaBolt(ctx, sMuz.x, sMuz.y, originX, originY, 18 * u, 6, 'rgba(168, 85, 247, 0.78)', 'rgba(224, 242, 254, 0.96)', 2.0 * u, now * 0.05 + sIdx * 9.1, true);
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
            CoreKinematics._drawTeslaBolt(ctx, originX + xOff * 0.35, originY, originX + topOff, beamTop + 20, 26 * u, 9, colOuter, '#ffffff', 2.4 * u, lTick + lb * 4.3, true);
          }
          // Radial Sideway Snap Lightning Arcs from Cannon Origin
          for (let sa = 0; sa < 4; sa++) {
            const ang = (sa < 2 ? -Math.PI * 0.82 : -Math.PI * 0.18) + Math.sin(lTick * 2.3 + sa) * 0.25;
            const reach = (82 + 45 * Math.abs(Math.cos(lTick * 1.9 + sa))) * u;
            CoreKinematics._drawTeslaBolt(ctx, originX, originY - 12 * u, originX + Math.cos(ang) * reach, originY - 12 * u + Math.sin(ang) * reach, 16 * u, 5, 'rgba(56, 189, 248, 0.88)', '#ffffff', 2.0 * u, lTick * 1.3 + sa * 7.1, true);
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
              CoreKinematics._drawTeslaBolt(ctx, originX, Math.max(20, pt.y + 36), pt.x, pt.y, 12 * u, 4, 'rgba(56, 189, 248, 0.90)', '#ffffff', 2.0 * u, lTick + pIdx * 2.1, false);
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

    new_dynamo_t7 = """        } else {
          // DYNAMO PRINCESS v425: Photorealistic Fractal Lichtenberg Astral-Lightning Torrent (Zero Stick Lines!)
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
          const halfBeam = (44 + Math.sin(now * 0.036) * 5) * u;
          const lTick = Math.floor(now / 40);

          // 1. Real Fractal Lichtenberg Faraday Conduits from Shoulder Towers -> Her Raised Hands & Cannon Core
          [mzs7W.left, mzs7W.right].forEach((sMuz, sIdx) => {
            const handX = cX + (sIdx === 0 ? -18 : 18) * u;
            const handY = cY + 4 * u;
            CoreKinematics._drawLightningSprite(ctx, sMuz.x, sMuz.y, handX, handY, 34 * u, lTick + sIdx * 3, 0.94);
            CoreKinematics._drawLightningSprite(ctx, sMuz.x, sMuz.y, originX, originY, 30 * u, lTick + sIdx * 5 + 1, 0.88);
          });

          // 2. Soft Ionized Astral Plasma Aura Behind Main Discharge Core
          const originGlow = QuantumRenderer._getGlowSprite('cyan');
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.72;
          ctx.drawImage(originGlow, originX - 88 * u, originY - 88 * u, 176 * u, 176 * u);
          ctx.restore();

          // 3. Fluid Volumetric Plasma Torrent Beam (Counter-Scrolling Plasma & Wisp Sheets, ZERO Stick Lines or Plain Ellipses!)
          ctx.save();
          const bGrad = ctx.createLinearGradient(originX - halfBeam * 1.15, 0, originX + halfBeam * 1.15, 0);
          bGrad.addColorStop(0.0, 'rgba(99, 102, 241, 0)');
          bGrad.addColorStop(0.18, 'rgba(56, 189, 248, 0.42)');
          bGrad.addColorStop(0.34, 'rgba(168, 85, 247, 0.76)');
          bGrad.addColorStop(0.47, 'rgba(224, 242, 254, 0.94)');
          bGrad.addColorStop(0.50, '#ffffff');
          bGrad.addColorStop(0.53, 'rgba(224, 242, 254, 0.94)');
          bGrad.addColorStop(0.66, 'rgba(232, 121, 249, 0.74)');
          bGrad.addColorStop(0.82, 'rgba(56, 189, 248, 0.42)');
          bGrad.addColorStop(1.0, 'rgba(99, 102, 241, 0)');
          ctx.fillStyle = bGrad;
          ctx.fillRect(originX - halfBeam * 1.15, beamTop, halfBeam * 2.3, beamLen);

          if (dPlasmaReady) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(originX - halfBeam * 1.05, beamTop, halfBeam * 2.1, beamLen);
            ctx.clip();
            const dSheetH = 420 * u;
            const dScr1 = (now * 0.95) % dSheetH;
            const dScr2 = (now * 1.32) % dSheetH;
            for (let yT = beamTop - dSheetH; yT < originY + dSheetH; yT += dSheetH) {
              ctx.globalAlpha = 0.65;
              ctx.drawImage(dFlameImg, originX - halfBeam * 0.98, yT - dScr1, halfBeam * 1.96, dSheetH + 16 * u);
              ctx.globalAlpha = 0.74;
              ctx.drawImage(dWispsImg, originX - halfBeam * 0.92, yT - dScr2, halfBeam * 1.84, dSheetH + 16 * u);
            }
            ctx.restore();
          }
          ctx.restore();

          // 4. Layered Flickering Fractal Lichtenberg Lightning Sprites Surging Upward + Outward Radial Ion Arcs!
          const lLayers = [
            { xOff: 0, w: 120 * u, frame: lTick, alpha: 0.98 },
            { xOff: -12 * u, w: 96 * u, frame: lTick + 1, alpha: 0.88 },
            { xOff: 12 * u, w: 96 * u, frame: lTick + 2, alpha: 0.88 },
            { xOff: Math.sin(now * 0.03) * 16 * u, w: 84 * u, frame: lTick + 7, alpha: 0.80 }
          ];
          for (const lay of lLayers) {
            CoreKinematics._drawLightningSprite(
              ctx,
              originX + lay.xOff * 0.4,
              originY,
              originX + lay.xOff * 1.25,
              beamTop + 12,
              lay.w,
              lay.frame,
              lay.alpha
            );
          }

          // Outward fractal dielectric discharge tendrils from origin
          for (let sa = 0; sa < 4; sa++) {
            const ang = (sa < 2 ? -Math.PI * 0.80 : -Math.PI * 0.20) + Math.sin(lTick * 2.1 + sa * 1.7) * 0.24;
            const reach = (96 + 38 * Math.abs(Math.cos(lTick * 1.8 + sa))) * u;
            CoreKinematics._drawLightningSprite(
              ctx,
              originX,
              originY - 10 * u,
              originX + Math.cos(ang) * reach,
              originY - 10 * u + Math.sin(ang) * reach,
              46 * u,
              lTick + sa * 3,
              0.86
            );
          }

          // 5. Layla-Style Photorealistic Astral Discharge Origin Burst (Zero Flat Polygons!)
          if (VfxUltraAssets.loaded.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst.naturalWidth > 0) {
            ctx.save();
            ctx.translate(originX, originY - 6 * u);
            ctx.rotate(Math.sin(now * 0.014) * 0.16);
            ctx.globalCompositeOperation = 'lighter';
            const bSize = (138 + 14 * mfT7) * u;
            ctx.drawImage(VfxUltraAssets.dynamoOriginBurst, -bSize * 0.5, -bSize * 0.5, bSize, bSize);
            ctx.restore();
          }

          // 6. Continuous Corridor Electro-Damage + Real Fractal Chain-Lightning Arcs to Hazard Nodes!
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dxAbs = Math.abs(pt.x - originX);
            const hr = (pt.headR || 28) + 44;
            if (pt.y <= originY + 24 && dxAbs < hr) {
              CoreKinematics._drawLightningSprite(ctx, originX, Math.max(20, pt.y + 42), pt.x, pt.y, 44 * u, lTick + pIdx * 2, 0.94);
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

    g = replace_once(g, old_dynamo_t7, new_dynamo_t7, "Dynamo T7 Lichtenberg super-weapon")

    # 4. Replace Dynamo Tier VII center projectile (princess_cannon) & side projectile (dynamo_tesla) — zero stick lines, zero ellipses, zero yellow stars!
    old_princess_proj = """          if (s.t7Kind === 'princess_cannon') {
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

            CoreKinematics._drawTeslaBolt(ctx, 0, 12, Math.sin(now * 0.06 + s.phase) * 8, 64, 14, 5, 'rgba(56, 189, 248, 0.92)', '#ffffff', 2.4, now * 0.05 + s.phase, true);
          }"""

    new_princess_proj = """          if (s.t7Kind === 'princess_cannon') {
            // Photorealistic Electric Spearhead + Discharge Burst + Fractal Lichtenberg Tail (Zero Stick Lines!)
            const pGlow = QuantumRenderer._getGlowSprite('cyan');
            ctx.drawImage(pGlow, -48, -48, 96, 96);
            if (VfxUltraAssets.loaded.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst.naturalWidth > 0) {
              ctx.save();
              ctx.rotate(now * 0.012 + s.phase);
              ctx.globalAlpha = 0.85;
              ctx.drawImage(VfxUltraAssets.dynamoOriginBurst, -42, -42, 84, 84);
              ctx.restore();
            }
            if (VfxUltraAssets.loaded.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.dynamoTeslaBolt, -28, -56, 56, 104);
            }
            CoreKinematics._drawLightningSprite(ctx, 0, 8, Math.sin(now * 0.05 + s.phase) * 8, 72, 34, Math.floor(now / 38) + Math.floor(s.phase * 10), 0.92);
          }"""

    g = replace_once(g, old_princess_proj, new_princess_proj, "Dynamo princess_cannon projectile")

    old_dynamo_side = """          } else {
            // Jagged High-Voltage Forked Tesla Bolt from Shoulder Towers
            CoreKinematics._drawTeslaBolt(ctx, 0, -28, 0, 28, 10, 5, 'rgba(56, 189, 248, 0.92)', '#ffffff', 2.2, now * 0.08 + s.phase, true);
            CoreKinematics._drawStarGlint(ctx, 0, -24, 11, '#fde047');
          }"""

    new_dynamo_side = """          } else {
            // Photorealistic Electric Plasma Spear Side-Bolt (Zero Stick Zig-Zags or Yellow Stars!)
            if (VfxUltraAssets.loaded.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.dynamoTeslaBolt, -20, -40, 40, 80);
            } else {
              const sGlow = QuantumRenderer._getGlowSprite('cyan');
              ctx.drawImage(sGlow, -22, -28, 44, 56);
            }
            CoreKinematics._drawLightningSprite(ctx, 0, -14, 0, 32, 22, Math.floor(now / 36) + Math.floor(s.phase * 7), 0.72);
          }"""

    g = replace_once(g, old_dynamo_side, new_dynamo_side, "Dynamo side bolt projectile")

    g = g.replace("arcade424_fire_lightning", "arcade425_dynamo_arc")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
