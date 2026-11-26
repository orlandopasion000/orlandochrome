"""Deterministic v409 True-3D Tier VI Volumetric Upgrade:
1. Pre-bakes Sobel surface-normal directional rim/key-light maps (rimLeft, rimRight) and
   ambient-occlusion depth shadow silhouette (shadowSil) once per Tier VI model at 512x341.
2. Upgrades _renderTier6StripMeshToScratch with asymmetric 3D perspective wing foreshortening
   on bank/yaw, spanwise wingbeat torsion, and multi-plane head/crown vs tail Z-parallax.
3. Upgrades _drawTier6Character with Z-sorted dual counter-tilted 3D gyroscopic rings,
   perspective-scaled 3D orbiting energy spheres (0.62x far behind -> 1.28x near front),
   depth-offset 3D drop shadow, and live normal-mapped directional rim cross-fading, while
   keeping twin shoulder weapons STRICTLY hidden while idle (shown ONLY when firing/casting).
4. Upgrades drawCharacterShowcase (three-quarter presentation view) with 3D shadow depth,
   back/front Z-occluded gyroscopic ring, and animated specular light sheen.
5. Bumps cache tags to arcade409_tier6_true3d / v409_tier6_true3d.
"""
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def replace_once(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    assert cnt == 1, f"Expected 1 match for [{label}], got {cnt}"
    return text.replace(old, new, 1)


# --- 1. Update game.js ---
g_path = os.path.join(ROOT_DIR, "game.js")
g_raw = open(g_path, encoding="utf-8").read()
g_nl = "\r\n" if "\r\n" in g_raw else "\n"
g = g_raw.replace("\r\n", "\n")

g = g.replace("arcade408_tier6_showcase", "arcade409_tier6_true3d")
g = g.replace("v408_tier6_showcase", "v409_tier6_true3d")

old_rig_block = """    _getTier6ArticulatedRig(mKey) {
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
        dynamo: { seamL: 356, seamR: 668, seamBotY: 408, gunPivotL: { x: 372, y: 200 }, gunPivotR: { x: 651, y: 200 }, headY: 225, flapAmp: 24, tailAmp: 15 },
        helix:  { seamL: 426, seamR: 598, seamBotY: 390, gunPivotL: { x: 406, y: 212 }, gunPivotR: { x: 617, y: 212 }, headY: 210, flapAmp: 26, tailAmp: 16 },
        meteor: { seamL: 412, seamR: 612, seamBotY: 395, gunPivotL: { x: 386, y: 154 }, gunPivotR: { x: 637, y: 154 }, headY: 158, flapAmp: 28, tailAmp: 16 }
      };
      const scratch = (cached && cached.bodyScratch) || document.createElement('canvas');
      scratch.width = W; scratch.height = H;
      const rig = {
        full: spr,
        body: spr,
        guns: (gunsOk ? gunsSpr : null),
        hasSplitLayers: Boolean(bodyOk && gunsOk),
        W,
        H,
        cfg: cfgMap[mKey] || cfgMap.dynamo,
        bodyScratch: scratch,
        bodyScratchCtx: scratch.getContext('2d')
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

      bCtx.clearRect(0, 0, W, H);

      // 1. Left Wing Strips (x = 0 .. seamL): C1 zero-displacement at seamL
      let prevDx = sL;
      const numL = Math.ceil(spanL / stepX);
      for (let i = 0; i < numL; i++) {
        const sx1 = Math.max(0, sL - i * stepX);
        const sx0 = Math.max(0, sL - (i + 1) * stepX);
        const sw = sx1 - sx0;
        if (sw <= 0) continue;
        const uOut = Math.min(1.0, (sL - (sx0 + sw * 0.5)) / spanL);
        const wave = Math.sin(flapPhase - uOut * 1.15);
        const dy = -wave * ampPx * Math.pow(uOut, 1.55) - bankAngle * 22 * uOut + (1.0 - easeRev) * 26 * uOut;
        const fore = (1.0 - 0.095 * flapAbs * Math.pow(uOut, 1.25)) * unfurlSpread;
        const nextDx = Math.round(sL - (sL - sx0) * fore);
        const dw = prevDx - nextDx;
        if (dw >= 1) {
          bCtx.drawImage(rig.body, sx0, 0, sw, H, nextDx, dy, dw, H);
          prevDx = nextDx;
        }
      }

      // 2. Right Wing Strips (x = seamR .. W): symmetric C1 zero-displacement at seamR
      prevDx = sR;
      const numR = Math.ceil(spanR / stepX);
      for (let j = 0; j < numR; j++) {
        const rx0 = sR + j * stepX;
        const rx1 = Math.min(W, rx0 + stepX);
        const rw = rx1 - rx0;
        if (rw <= 0) continue;
        const uOutR = Math.min(1.0, ((rx0 + rw * 0.5) - sR) / spanR);
        const waveR = Math.sin(flapPhase - uOutR * 1.15);
        const dyR = -waveR * ampPx * Math.pow(uOutR, 1.55) + bankAngle * 22 * uOutR + (1.0 - easeRev) * 26 * uOutR;
        const foreR = (1.0 - 0.095 * flapAbs * Math.pow(uOutR, 1.25)) * unfurlSpread;
        const nextDxR = Math.round(sR + (rx1 - sR) * foreR);
        const dwR = nextDxR - prevDx;
        if (dwR >= 1) {
          bCtx.drawImage(rig.body, rx0, 0, rw, H, prevDx, dyR, dwR, H);
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
        const tailDx = Math.sin(tailPhase - vOut * 2.1) * cfg.tailAmp * Math.pow(vOut, 1.45) - vxNorm * 22 * Math.pow(vOut, 1.3);
        bCtx.drawImage(rig.body, sL, sy0, centerW, sh, sL + tailDx, prevDy, centerW, sh);
        prevDy += sh;
      }

      // 4. Rigid Central Torso, Head, Crown & Overlapping Braids (x = sL .. sR, y = 0 .. seamBotY)
      bCtx.drawImage(rig.body, sL, 0, centerW, sBotY, sL, 0, centerW, sBotY);
      return true;
    },

    // Character Showcase Render (Three-Quarter Front Presentation View: Face, Crystal Horn/Crown, Wings & Armor)
    drawCharacterShowcase(ctx, mode, cx, cy, maxW, maxH, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const scImg = LayeredT4Assets.coreT6Showcase && LayeredT4Assets.coreT6Showcase[mKey];
      const scOk = !!(LayeredT4Assets.loaded.coreT6Showcase && LayeredT4Assets.loaded.coreT6Showcase[mKey] && scImg && scImg.naturalWidth > 0);
      if (!scOk) {
        this._drawLayeredWingedCore(ctx, mKey, cx, cy, now, 5, 0.23, true, true);
        return false;
      }

      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const levY = Math.sin(now * 0.0028) * 3.2 * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0036) * 0.012 * motionMult;
      const fitScale = Math.min(maxW / scImg.naturalWidth, maxH / scImg.naturalHeight) * breath;
      const dw = scImg.naturalWidth * fitScale;
      const dh = scImg.naturalHeight * fitScale;

      ctx.save();
      ctx.translate(cx, cy + levY);

      // Subtle presentation backlight aura behind the three-quarter Showcase Render
      const glowSpr = this._getGlowSprite(mKey === 'meteor' ? 'amber' : (mKey === 'helix' ? 'helix' : 'violet'));
      if (glowSpr) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.42;
        const gr = Math.min(dw, dh) * 0.78;
        ctx.drawImage(glowSpr, -gr, -gr * 0.85, gr * 2, gr * 1.7);
        ctx.restore();
      }

      ctx.drawImage(scImg, -dw * 0.5, -dh * 0.5, dw, dh);
      ctx.restore();
      return true;
    },

    // Playable Tier VI Seamless Strip-Mesh 3D In-Game Model Renderer (Centered Rear Gameplay View)
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
      const bank = isPortalPreview ? (Math.sin(now * 0.0019) * 0.03) : ((CoreKinematics.bodyBank || 0) * 0.44);
      const pitchCompY = isPortalPreview ? 1.0 : (1.0 - Math.abs(CoreKinematics.pitchAngle || 0) * 0.16);
      const levY = Math.sin(now * 0.0038) * 3.0 * u * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0046) * 0.014 * motionMult;
      const vxNorm = isPortalPreview ? Math.sin(now * 0.0015) * 0.25 : Math.max(-1.0, Math.min(1.0, (CoreKinematics.vx || 0) * 0.048));

      const pRev = (opts && typeof opts.revealProgress === 'number') ? Math.max(0, Math.min(1, opts.revealProgress)) : 1.0;
      const easeRev = 1.0 - Math.pow(1.0 - pRev, 3);
      const isUltActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mKey);

      const flapFreq = (isUltActive ? 0.0095 : 0.0052) * motionMult;
      const flapPhase = now * flapFreq;
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
      ctx.scale(breath, (2.0 - breath * 0.99) * pitchCompY);

      // 1. 3D Spatial Foreshortened Sovereign Halo Ring (Back Arc behind wings & torso)
      const pCol = (mKey === 'meteor') ? '#fb923c' : (mKey === 'helix' ? '#22d3ee' : '#c084fc');
      const aCol = (mKey === 'meteor') ? '#fef08a' : (mKey === 'helix' ? '#f472b6' : '#38bdf8');
      const ultRamp3d = isUltActive ? Math.min(1, (now - SkillSystem.activeNova.startAt) / 220) : 0;
      const ringRx = 96 * u * (1.0 + 0.08 * ultRamp3d);
      const ringRy = 31 * u * (1.0 + 0.08 * ultRamp3d);
      const ringY = 14 * u;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);
      ctx.rotate(Math.sin(now * 0.0014) * 0.08 * motionMult);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.34)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.34)' : 'rgba(196, 181, 253, 0.36)');
      ctx.lineWidth = Math.max(2.0, 4.2 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(254, 240, 138, 0.52)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.50)' : 'rgba(253, 224, 71, 0.54)');
      ctx.lineWidth = Math.max(1.0, 1.5 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Seamless 1:1 Partition Strip-Mesh Body & Wings (Zero polygon shearing!)
      this._renderTier6StripMeshToScratch(rig, flapPhase, tailPhase, vxNorm, bank, easeRev);
      ctx.drawImage(rig.bodyScratch, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);

      if (flapCos > 0.08 || isUltActive) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(0.28, Math.max(0.06, flapCos * 0.18) + (isUltActive ? 0.14 : 0));
        ctx.drawImage(rig.bodyScratch, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.restore();
      }"""

new_rig_block = """    // Pre-bake 3D Sobel Surface-Normal Rim Light Maps + Volumetric Shadow Silhouette ONCE per model (~4ms at 512x341)
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
      }"""

g = replace_once(g, old_rig_block, new_rig_block, "v409 True-3D Rig + StripMesh + Rim Lighting")

# Also upgrade Step 5 foreground ring to render BOTH gyro rings + near-side (z >= 0) 1.28x 3D orbiting spheres!
old_front_ring = """      // 5. 3D Foreground Half of Orbiting Halo Ring (passes OVER lower skirt/tail for true 3D occlusion!)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);
      ctx.rotate(Math.sin(now * 0.0014) * 0.08 * motionMult);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.56)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.56)' : 'rgba(253, 224, 71, 0.58)');
      ctx.lineWidth = Math.max(1.2, 1.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0.08, Math.PI - 0.08);
      ctx.stroke();
      const glintAng = ((now * 0.0028) % (Math.PI * 2));
      if (Math.sin(glintAng) >= 0) {
        const gx = Math.cos(glintAng) * ringRx;
        const gy = Math.sin(glintAng) * ringRy;
        const gSpr = QuantumRenderer._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'helix' : 'cyan'));
        ctx.globalAlpha = 0.72 * Math.sin(glintAng);
        ctx.drawImage(gSpr, gx - 16 * u, gy - 16 * u, 32 * u, 32 * u);
      }
      ctx.restore();"""

new_front_ring = """      // 5. Z-Sorted Front Halves of Dual 3D Gyroscopic Rings + Near-Side (z >= 0) Perspective-Expanded 3D Orbiting Spheres!
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

      ctx.restore();"""

g = replace_once(g, old_front_ring, new_front_ring, "v409 Foreground Dual 3D Gyro Rings & Spheres")

with open(g_path, "w", encoding="utf-8", newline=g_nl) as f:
    f.write(g)

# --- 2. Bump cache tags in index.html, sw.js, app.js, core-geometry-db.json ---
for rel in ("index.html", "sw.js", "app.js", "assets/core-geometry-db.json"):
    p = os.path.join(ROOT_DIR, rel)
    raw = open(p, encoding="utf-8").read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    txt = raw.replace("\r\n", "\n")
    txt = txt.replace("orlandochrome-arcade-v408_tier6_showcase", "orlandochrome-arcade-v409_tier6_true3d")
    txt = txt.replace("arcade408_tier6_showcase", "arcade409_tier6_true3d")
    txt = txt.replace("v408_tier6_showcase", "v409_tier6_true3d")
    with open(p, "w", encoding="utf-8", newline=nl) as f:
        f.write(txt)

print("SUCCESS: Applied v409 True-3D Tier VI Volumetric Upgrade across all files!")
