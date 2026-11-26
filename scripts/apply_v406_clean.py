"""Deterministic single-pass updater for v406 features on top of commit 37b3163 game.js."""
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME_PATH = os.path.join(ROOT_DIR, "game.js")

with open(GAME_PATH, "r", encoding="utf-8") as f:
    src = f.read()

newline = "\r\n" if "\r\n" in src else "\n"
src = src.replace("\r\n", "\n")
src = src.replace("arcade406_tier6_3d_articulated", "arcade406_tier6_grand_3d")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    assert cnt == 1, f"Expected 1 occurrence for [{label}], found {cnt}"
    return text.replace(old, new, 1)


# 1. Version bump inside game.js (lines ~2411)
src = replace_once(src, "    version: 'v405_smooth_zero_lag',", "    version: 'v406_tier6_grand_3d',", "CoreGeometryDB version")

# 2. Register coreT6Body and coreT6Guns in LayeredT4Assets
src = replace_once(
    src,
    """    coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
    wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },""",
    """    coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },""",
    "LayeredT4Assets fields",
)
src = replace_once(
    src,
    """      coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
      wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },""",
    """      coreTierSprites: { dynamo: {}, helix: {}, meteor: {} },
      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },
      wingRightTiers: { dynamo: {}, helix: {}, meteor: {} },""",
    "LayeredT4Assets loaded flags",
)
src = replace_once(
    src,
    """  LayeredT4Assets.helixGlassShell.onload = () => { LayeredT4Assets.loaded.helixGlassShell = true; };
  LayeredT4Assets.helixGlassShell.src = 'assets/core-helix-glass-shell.png?v=arcade406_tier6_grand_3d';

  LayeredT4Assets.bezelT5.dynamo.onload = () => { LayeredT4Assets.loaded.bezelT5.dynamo = true; };
  LayeredT4Assets.bezelT5.dynamo.src = 'assets/core-dynamo-bezel-t5.png?v=arcade406_tier6_grand_3d';
  LayeredT4Assets.bezelT5.helix.onload = () => { LayeredT4Assets.loaded.bezelT5.helix = true; };
  LayeredT4Assets.bezelT5.helix.src = 'assets/core-helix-bezel-t5.png?v=arcade406_tier6_grand_3d';

  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    LayeredT4Assets.halo[m].onload = () => { LayeredT4Assets.loaded.halo[m] = true; };
    LayeredT4Assets.halo[m].src = `assets/layer-${m}-halo.png?v=arcade374`;

    LayeredT4Assets.wingRight[m].onload = () => {
      LayeredT4Assets.loaded.wingRight[m] = true;
    };
    LayeredT4Assets.wingRight[m].src = `assets/layer-${m}-wing-right.png?v=arcade374`;

    LayeredT4Assets.wingRightT5[m].onload = () => {
      LayeredT4Assets.loaded.wingRightT5[m] = true;
    };
    LayeredT4Assets.wingRightT5[m].src = `assets/layer-${m}-wing-t5.png?v=arcade374`;

    LayeredT4Assets.coreBaseT5[m].onload = () => {
      LayeredT4Assets.loaded.coreBaseT5[m] = true;
    };
    LayeredT4Assets.coreBaseT5[m].src = `assets/core-${m}-t5.png?v=arcade406_tier6_grand_3d`;

    for (let t = 1; t <= 6; t++) {
      const cImg = new Image();
      LayeredT4Assets.coreTierSprites[m][t] = cImg;
      LayeredT4Assets.loaded.coreTierSprites[m][t] = false;
      cImg.onload = () => { LayeredT4Assets.loaded.coreTierSprites[m][t] = true; };
      cImg.src = `assets/core-${m}-t${t}.png?v=arcade406_tier6_grand_3d`;

      if (t >= 2 && t <= 5) {
        const wImg = new Image();
        LayeredT4Assets.wingRightTiers[m][t] = wImg;
        LayeredT4Assets.loaded.wingRightTiers[m][t] = false;
        wImg.onload = () => { LayeredT4Assets.loaded.wingRightTiers[m][t] = true; };
        wImg.src = `assets/core-${m}-wing-r-t${t}.png?v=arcade406_tier6_grand_3d`;
      }
    }""",
    """  LayeredT4Assets.helixGlassShell.onload = () => { LayeredT4Assets.loaded.helixGlassShell = true; };
  LayeredT4Assets.helixGlassShell.src = 'assets/core-helix-glass-shell.png?v=arcade406_tier6_grand_3d';

  LayeredT4Assets.bezelT5.dynamo.onload = () => { LayeredT4Assets.loaded.bezelT5.dynamo = true; };
  LayeredT4Assets.bezelT5.dynamo.src = 'assets/core-dynamo-bezel-t5.png?v=arcade406_tier6_grand_3d';
  LayeredT4Assets.bezelT5.helix.onload = () => { LayeredT4Assets.loaded.bezelT5.helix = true; };
  LayeredT4Assets.bezelT5.helix.src = 'assets/core-helix-bezel-t5.png?v=arcade406_tier6_grand_3d';

  ['dynamo', 'helix', 'meteor'].forEach((m) => {
    LayeredT4Assets.halo[m].onload = () => { LayeredT4Assets.loaded.halo[m] = true; };
    LayeredT4Assets.halo[m].src = `assets/layer-${m}-halo.png?v=arcade374`;

    LayeredT4Assets.wingRight[m].onload = () => {
      LayeredT4Assets.loaded.wingRight[m] = true;
    };
    LayeredT4Assets.wingRight[m].src = `assets/layer-${m}-wing-right.png?v=arcade374`;

    LayeredT4Assets.wingRightT5[m].onload = () => {
      LayeredT4Assets.loaded.wingRightT5[m] = true;
    };
    LayeredT4Assets.wingRightT5[m].src = `assets/layer-${m}-wing-t5.png?v=arcade374`;

    LayeredT4Assets.coreBaseT5[m].onload = () => {
      LayeredT4Assets.loaded.coreBaseT5[m] = true;
    };
    LayeredT4Assets.coreBaseT5[m].src = `assets/core-${m}-t5.png?v=arcade406_tier6_grand_3d`;

    LayeredT4Assets.coreT6Body[m].onload = () => { LayeredT4Assets.loaded.coreT6Body[m] = true; };
    LayeredT4Assets.coreT6Body[m].src = `assets/core-${m}-t6-body.png?v=arcade406_tier6_grand_3d`;

    LayeredT4Assets.coreT6Guns[m].onload = () => { LayeredT4Assets.loaded.coreT6Guns[m] = true; };
    LayeredT4Assets.coreT6Guns[m].src = `assets/core-${m}-t6-guns.png?v=arcade406_tier6_grand_3d`;

    for (let t = 1; t <= 6; t++) {
      const cImg = new Image();
      LayeredT4Assets.coreTierSprites[m][t] = cImg;
      LayeredT4Assets.loaded.coreTierSprites[m][t] = false;
      cImg.onload = () => { LayeredT4Assets.loaded.coreTierSprites[m][t] = true; };
      cImg.src = `assets/core-${m}-t${t}.png?v=arcade406_tier6_grand_3d`;

      if (t >= 2 && t <= 5) {
        const wImg = new Image();
        LayeredT4Assets.wingRightTiers[m][t] = wImg;
        LayeredT4Assets.loaded.wingRightTiers[m][t] = false;
        wImg.onload = () => { LayeredT4Assets.loaded.wingRightTiers[m][t] = true; };
        wImg.src = `assets/core-${m}-wing-r-t${t}.png?v=arcade406_tier6_grand_3d`;
      }
    }""",
    "LayeredT4Assets URLs",
)

# 3. Remove unused _drawAegisHudBadge
src = replace_once(
    src,
    """    _drawAegisHudBadge(ctx, r, u, badgeText, timeLeft, isExpiring, mainColor, borderColor, bgColor) {
      ctx.save();
      const hudY = -r - 20;
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const bWidth = ctx.measureText(badgeText).width;

      ctx.fillStyle = isExpiring ? 'rgba(239, 68, 68, 0.45)' : bgColor;
      ctx.strokeStyle = isExpiring ? '#f87171' : borderColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-bWidth / 2 - 10, hudY - 10, bWidth + 20, 20, 10);
      else ctx.rect(-bWidth / 2 - 10, hudY - 10, bWidth + 20, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, hudY);

      // Remaining Time Radial Gauge
      const timeFrac = Math.max(0, Math.min(1.0, timeLeft / 5000));
      ctx.beginPath();
      ctx.arc(-bWidth / 2 - 18, hudY, 6, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * timeFrac);
      ctx.strokeStyle = isExpiring ? '#ef4444' : mainColor;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();
    },

""",
    "",
    "Delete _drawAegisHudBadge",
)

# 4. Articulated Tier VI Rig uses separated -t6-body.png & -t6-guns.png cleanly,
#    hides cannons when idle, and adds 3D Spatial Astrolabe Ring occlusion!
src = replace_once(
    src,
    """    _getTier6ArticulatedRig(mKey) {
      if (this._tier6RigCache[mKey]) return this._tier6RigCache[mKey];
      const spr = LayeredT4Assets.coreTierSprites[mKey] && LayeredT4Assets.coreTierSprites[mKey][6];
      const sprLoaded = LayeredT4Assets.loaded.coreTierSprites[mKey] && LayeredT4Assets.loaded.coreTierSprites[mKey][6];
      if (!spr || !sprLoaded) return null;

      const W = 1024, H = 682;
      const extractSoftRegion = (polyPts, featherPx) => {
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const g = c.getContext('2d');
        if (!g) return c;
        g.save();
        if (featherPx > 0 && typeof g.filter === 'string') {
          g.filter = `blur(${featherPx}px)`;
        }
        g.fillStyle = '#ffffff';
        g.beginPath();
        for (let i = 0; i < polyPts.length; i++) {
          if (i === 0) g.moveTo(polyPts[i][0], polyPts[i][1]);
          else g.lineTo(polyPts[i][0], polyPts[i][1]);
        }
        g.closePath();
        g.fill();
        g.restore();
        g.globalCompositeOperation = 'source-in';
        g.drawImage(spr, 0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
        return c;
      };

      const rig = { full: spr, W, H };""",
    """    _getTier6ArticulatedRig(mKey) {
      const bodySpr = LayeredT4Assets.coreT6Body && LayeredT4Assets.coreT6Body[mKey];
      const bodyOk = !!(LayeredT4Assets.loaded.coreT6Body && LayeredT4Assets.loaded.coreT6Body[mKey] && bodySpr && bodySpr.naturalWidth > 0);
      const gunsSpr = LayeredT4Assets.coreT6Guns && LayeredT4Assets.coreT6Guns[mKey];
      const gunsOk = !!(LayeredT4Assets.loaded.coreT6Guns && LayeredT4Assets.loaded.coreT6Guns[mKey] && gunsSpr && gunsSpr.naturalWidth > 0);
      const cached = this._tier6RigCache[mKey];
      if (cached && cached.hasSplitLayers === (bodyOk && gunsOk)) return cached;

      const spr = bodyOk ? bodySpr : (LayeredT4Assets.coreTierSprites[mKey] && LayeredT4Assets.coreTierSprites[mKey][6]);
      const sprLoaded = bodyOk || (LayeredT4Assets.loaded.coreTierSprites[mKey] && LayeredT4Assets.loaded.coreTierSprites[mKey][6]);
      if (!spr || !sprLoaded) return null;

      const W = 1024, H = 682;
      const extractSoftRegion = (polyPts, featherPx, sourceImg = spr) => {
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const g = c.getContext('2d');
        if (!g) return c;
        g.save();
        if (featherPx > 0 && typeof g.filter === 'string') {
          g.filter = `blur(${featherPx}px)`;
        }
        g.fillStyle = '#ffffff';
        g.beginPath();
        for (let i = 0; i < polyPts.length; i++) {
          if (i === 0) g.moveTo(polyPts[i][0], polyPts[i][1]);
          else g.lineTo(polyPts[i][0], polyPts[i][1]);
        }
        g.closePath();
        g.fill();
        g.restore();
        g.globalCompositeOperation = 'source-in';
        g.drawImage(sourceImg, 0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
        return c;
      };

      const gunSrc = gunsOk ? gunsSpr : spr;
      const rig = { full: spr, gunSrc, hasSplitLayers: (bodyOk && gunsOk), W, H };""",
    "_getTier6ArticulatedRig split layers",
)

src = replace_once(
    src,
    """        rig.cannonL = extractSoftRegion([[308, 10], [422, 10], [412, 222], [318, 222]], 6);
        rig.cannonR = extractSoftRegion([[602, 10], [716, 10], [706, 222], [612, 222]], 6);""",
    """        rig.cannonL = extractSoftRegion([[308, 4], [422, 4], [412, 232], [318, 232]], 4, gunSrc);
        rig.cannonR = extractSoftRegion([[602, 4], [716, 4], [706, 232], [612, 232]], 4, gunSrc);""",
    "dynamo cannon split source",
)
src = replace_once(
    src,
    """        rig.cannonL = extractSoftRegion([[355, 140], [446, 140], [446, 238], [358, 238]], 6);
        rig.cannonR = extractSoftRegion([[578, 140], [669, 140], [666, 238], [578, 238]], 6);""",
    """        rig.cannonL = extractSoftRegion([[355, 134], [452, 134], [452, 238], [358, 238]], 4, gunSrc);
        rig.cannonR = extractSoftRegion([[572, 134], [669, 134], [666, 238], [572, 238]], 4, gunSrc);""",
    "helix cannon split source",
)
src = replace_once(
    src,
    """        rig.cannonL = extractSoftRegion([[338, 82], [425, 82], [422, 198], [342, 198]], 6);
        rig.cannonR = extractSoftRegion([[599, 82], [686, 82], [682, 198], [602, 198]], 6);""",
    """        rig.cannonL = extractSoftRegion([[338, 74], [430, 74], [425, 198], [342, 198]], 4, gunSrc);
        rig.cannonR = extractSoftRegion([[594, 74], [686, 74], [682, 198], [599, 198]], 4, gunSrc);""",
    "meteor cannon split source",
)

src = replace_once(
    src,
    """      // 1. Subtle 3D Sovereign Resonance Halo Beneath Character
      const pCol = (mKey === 'meteor') ? '#fb923c' : (mKey === 'helix' ? '#22d3ee' : '#c084fc');
      const aCol = (mKey === 'meteor') ? '#fef08a' : (mKey === 'helix' ? '#f472b6' : '#38bdf8');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const haloR = 88 * u * (0.96 + 0.04 * Math.sin(now * 0.0045));
      const hGrad = ctx.createRadialGradient(0, 0, haloR * 0.15, 0, 0, haloR);
      hGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.18)');
      hGrad.addColorStop(0.45, mKey === 'meteor' ? 'rgba(249, 115, 22, 0.24)' : (mKey === 'helix' ? 'rgba(34, 211, 238, 0.22)' : 'rgba(192, 132, 252, 0.24)'));
      hGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(0, 0, haloR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();""",
    """      // 1. 3D Spatial Foreshortened Sovereign Halo Ring (Back Arc behind wings & torso + subtle resonance)
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
      ctx.restore();""",
    "3D Halo Back Arc",
)

src = replace_once(
    src,
    """      // 7. Independently Gimbaled Twin Shoulder Weapons with Hydraulic Firing Recoil
      drawPart(rig.cannonL, rig.pivots.cannonL, aimYaw, 1.0, 1.0, 0, recL, 1.0);
      drawPart(rig.cannonR, rig.pivots.cannonR, aimYaw, 1.0, 1.0, 0, recR, 1.0);

      ctx.restore();
    },""",
    """      // 7. Twin Shoulder Weapons: Strictly hidden while idle; emerge & gimbal ONLY while pressing/using!
      const s2Deploy = Boolean(!isPortalPreview && state.tier6Skill2CastUntil && now < state.tier6Skill2CastUntil);
      const isT6UltCast = Boolean(isUltActive && SkillSystem.activeNova && SkillSystem.activeNova.isTier6);
      const gunDeployAlpha = isPortalPreview ? 0 : Math.max(state.gunDeployT || 0, (s2Deploy || isT6UltCast) ? 1.0 : 0);
      if (gunDeployAlpha > 0.02) {
        const emergeDrop = (1.0 - gunDeployAlpha) * 20.0;
        const gAlpha = Math.min(1.0, gunDeployAlpha * 1.35);
        drawPart(rig.cannonL, rig.pivots.cannonL, aimYaw, 1.0, 1.0, 0, recL + emergeDrop, gAlpha);
        drawPart(rig.cannonR, rig.pivots.cannonR, aimYaw, 1.0, 1.0, 0, recR + emergeDrop, gAlpha);
      }

      // 8. 3D Foreground Half of Orbiting Halo Ring (passes OVER lower skirt/tail for true 3D occlusion!)
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
      ctx.restore();

      ctx.restore();
    },""",
    "Tier VI Gun Gating + 3D Front Ring",
)

# 5. TouchFireControls: KeyF hold-to-fire alongside KeyA; remove offenseMode check from HUD chip
src = replace_once(
    src,
    """    isDesktopKeyGunHeld() {
      return !this.isTouch && this.heldKeys.has('KeyA');
    },""",
    """    isDesktopKeyGunHeld() {
      return !this.isTouch && (this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF'));
    },""",
    "isDesktopKeyGunHeld KeyF",
)
src = replace_once(
    src,
    """    clearHeldKeys() {
      const hadA = this.heldKeys.has('KeyA');
      this.heldKeys.clear();
      if (hadA && typeof updateHeaderUI === 'function') updateHeaderUI();
    },""",
    """    clearHeldKeys() {
      const hadGunKey = this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF');
      this.heldKeys.clear();
      if (hadGunKey && typeof updateHeaderUI === 'function') updateHeaderUI();
    },""",
    "clearHeldKeys KeyF",
)
src = replace_once(
    src,
    """        if (this.deskGunChip) {
          const activeGun = (this.isDesktopKeyGunHeld() || !!state.offenseMode || !!state.pointerFiring) && (state.coreAmmo || 0) > 0;""",
    """        if (this.deskGunChip) {
          const activeGun = (this.isDesktopKeyGunHeld() || !!state.pointerFiring) && (state.coreAmmo || 0) > 0;""",
    "syncUI activeGun",
)

# 6. SkillSystem: Skill 2 shoulder gun flash + Tier VI Ultimate isTier6 + duration + Back/Front 3D Renderers
src = replace_once(
    src,
    """      const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const ars = getRealmArsenal(mMode);
      this.skill2CdMs = CONFIG.skill2.cooldownMs;""",
    """      const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const ars = getRealmArsenal(mMode);
      this.skill2CdMs = CONFIG.skill2.cooldownMs;
      if ((state.coreTier || 1) >= 6) {
        state.tier6Skill2CastUntil = now + 560;
      }""",
    "castSeekerComets shoulder timer",
)
src = replace_once(
    src,
    """      const novaMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const novaEmbers = [];
      for (let eIdx = 0; eIdx < 68; eIdx++) {
        novaEmbers.push({
          ox: (Math.random() - 0.5) * 210,
          oy: -Math.random() * Math.max(480, cy),
          vx: (Math.random() - 0.5) * 1.4,
          vy: -(9.5 + Math.random() * 14.5),
          len: 8 + Math.random() * 18,
          w: 1.4 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          bright: Math.random() > 0.35
        });
      }
      this.activeNova = {
        x: cx,
        y: cy,
        mode: novaMode,
        startAt: now,
        durationMs: CONFIG.ult.durationMs,
        maxRadius: Math.hypot(w, h) * 1.15,
        embers: novaEmbers
      };""",
    """      const novaMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
      const isTier6Ult = (state.coreTier || 1) >= 6;
      const novaEmbers = [];
      const emberCount = isTier6Ult ? 76 : 68;
      for (let eIdx = 0; eIdx < emberCount; eIdx++) {
        novaEmbers.push({
          ox: (Math.random() - 0.5) * 210,
          oy: -Math.random() * Math.max(480, cy),
          vx: (Math.random() - 0.5) * 1.4,
          vy: -(9.5 + Math.random() * 14.5),
          len: 8 + Math.random() * 18,
          w: 1.4 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          bright: Math.random() > 0.35
        });
      }
      this.activeNova = {
        x: cx,
        y: cy,
        mode: novaMode,
        isTier6: isTier6Ult,
        startAt: now,
        durationMs: isTier6Ult ? (CONFIG.ult.durationMs + 300) : CONFIG.ult.durationMs,
        maxRadius: Math.hypot(w, h) * 1.15,
        embers: novaEmbers
      };""",
    "castCalderaNova isTier6",
)
src = replace_once(
    src,
    """            // LAYER 5B: Bespoke Per-Realm Climax Signature FX (Dynamo Lightning Storm / Helix Giant DNA Beam / Meteor Solar Prominence & Lava)
            this._drawNovaRealmFX(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, dtScale, basePillarW, isMob);""",
    """            // LAYER 5B: Bespoke Per-Realm Climax Signature FX (Dynamo Lightning Storm / Helix Giant DNA Beam / Meteor Solar Prominence & Lava)
            this._drawNovaRealmFX(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, dtScale, basePillarW, isMob);
            if (nv.isTier6) {
              this._drawTier6UltBack(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, isMob);
            }""",
    "drawNovaBackdrop Tier6 back",
)
src = replace_once(
    src,
    """        // LAYER 8: Dynamo — Multi-Hued Crackling Electric Arcs Wrapping Over the Core Surface
        if (nv.mode === 'dynamo' && nv._coreArcs) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let i = 0; i < nv._coreArcs.length; i++) {
            const arc = nv._coreArcs[i];
            const pts = arc.pts || arc;
            const st = arc.style || 0;
            const c0 = st === 2 ? 'rgba(245, 158, 11, ' : (st === 1 ? 'rgba(139, 92, 246, ' : 'rgba(59, 130, 246, ');
            const c1 = st === 2 ? 'rgba(253, 224, 71, ' : (st === 1 ? 'rgba(192, 132, 252, ' : 'rgba(125, 211, 252, ');
            this._strokeBoltPasses(ctx, pts, alphaEnv * 0.94, 0.56, c0, c1);
          }
        }
      } catch (_) {}
      ctx.restore();
    }""",
    """        // LAYER 8: Dynamo — Multi-Hued Crackling Electric Arcs Wrapping Over the Core Surface
        if (nv.mode === 'dynamo' && nv._coreArcs) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let i = 0; i < nv._coreArcs.length; i++) {
            const arc = nv._coreArcs[i];
            const pts = arc.pts || arc;
            const st = arc.style || 0;
            const c0 = st === 2 ? 'rgba(245, 158, 11, ' : (st === 1 ? 'rgba(139, 92, 246, ' : 'rgba(59, 130, 246, ');
            const c1 = st === 2 ? 'rgba(253, 224, 71, ' : (st === 1 ? 'rgba(192, 132, 252, ' : 'rgba(125, 211, 252, ');
            this._strokeBoltPasses(ctx, pts, alphaEnv * 0.94, 0.56, c0, c1);
          }
        }

        // LAYER 9: Tier VI Grand 3D Volumetric Ultimate Foreground Occlusion & Shoulder Tri-Beams
        if (nv.isTier6) {
          this._drawTier6UltFront(ctx, nv, now, w, h);
        }
      } catch (_) {}
      ctx.restore();
    },

    // === GRAND 3D TIER VI ULTIMATE RENDERERS (True Z-Depth Occlusion Behind & In Front of Dragon / Unicorn / Princess, Zero shadowBlur) ===
    _drawTier6UltBack(ctx, nv, elapsed, p, alphaEnv, rampIn, w, h, isMob) {
      const a = alphaEnv;
      if (a <= 0.01) return;
      const mKey = nv.mode || 'dynamo';
      const u = CoreGeometryDB.computeCoreMetrics(w, h, 6, isMob, null).u;
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const rot = elapsed * 0.0018;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Foreshortened 3D Sacred-Geometry Cathedral Floor Circle
      ctx.save();
      ctx.translate(nv.x, nv.y + 22 * u);
      ctx.scale(1.0, 0.34);
      const outerR = (isMob ? 150 : 215) * rampIn;
      const ringCol = mKey === 'meteor' ? `rgba(251, 146, 60, ${0.46 * a})` : (mKey === 'helix' ? `rgba(103, 232, 249, ${0.44 * a})` : `rgba(196, 181, 253, ${0.48 * a})`);
      const goldCol = `rgba(253, 224, 71, ${0.52 * a})`;
      ctx.strokeStyle = ringCol;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      for (let k = 0; k < 12; k++) {
        const ang = rot + (k / 12) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * outerR * 0.80, Math.sin(ang) * outerR * 0.80);
        ctx.lineTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Z-Sorted Back-Half (sin(ang) < 0) of Ascending 3D Coils / Chiral Triple-Helix
      const steps = 26;
      const colSpanY = nv.y + 24;
      const strandCount = (mKey === 'helix') ? 3 : 2;
      for (let s = 0; s < strandCount; s++) {
        const strandCol = mKey === 'meteor'
          ? (s === 0 ? `rgba(251, 146, 60, ${0.65 * a})` : `rgba(253, 224, 71, ${0.58 * a})`)
          : (mKey === 'helix'
            ? (s === 0 ? `rgba(34, 211, 238, ${0.66 * a})` : (s === 1 ? `rgba(244, 114, 182, ${0.62 * a})` : `rgba(192, 132, 252, ${0.56 * a})`))
            : (s === 0 ? `rgba(96, 165, 250, ${0.66 * a})` : `rgba(253, 224, 71, ${0.60 * a})`));
        ctx.strokeStyle = strandCol;
        ctx.lineWidth = isMob ? 3.2 : 4.4;
        let drawing = false;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const f = i / steps;
          const yy = nv.y + 18 * u - f * colSpanY;
          const ang = f * Math.PI * 5.0 - elapsed * 0.008 + s * ((Math.PI * 2) / strandCount);
          const radiusF = (0.85 - f * 0.35) * (isMob ? 72 : 102) * rampIn;
          if (Math.sin(ang) < 0) {
            const xx = nv.x + Math.cos(ang) * radiusF;
            const y3d = yy + Math.sin(ang) * 14 * u;
            if (!drawing) { ctx.moveTo(xx, y3d); drawing = true; }
            else ctx.lineTo(xx, y3d);
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 3. Ascending 3D Perspective Shock-Rings (back arcs behind character)
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const ringFrac = ((p * 2.4 + rIdx * 0.33) % 1.0);
        const ringY = nv.y - ringFrac * Math.min(h * 0.72, 460);
        const rrX = rx * (0.72 + ringFrac * 0.42);
        const rrY = ry * (0.65 + ringFrac * 0.32);
        const rAlpha = (1.0 - ringFrac) * a * 0.65;
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(251, 146, 60, ${rAlpha})` : (mKey === 'helix' ? `rgba(103, 232, 249, ${rAlpha})` : `rgba(167, 139, 250, ${rAlpha})`);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(nv.x, ringY, rrX, rrY, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Dynamo Princess Only: Back-Half Orbiting 3D Crystal Lance Sigils (sin(ang) < 0)
      if (mKey === 'dynamo') {
        for (let k = 0; k < 4; k++) {
          const ang = elapsed * 0.0036 + k * (Math.PI * 0.5);
          if (Math.sin(ang) >= 0) continue;
          const sx = nv.x + Math.cos(ang) * rx * 0.92;
          const sy = nv.y - 10 * u + Math.sin(ang) * ry * 0.85;
          const sc = 0.76 + 0.14 * (Math.sin(ang) + 1);
          ctx.fillStyle = `rgba(196, 181, 253, ${0.72 * a})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy - 20 * u * sc);
          ctx.lineTo(sx + 7 * u * sc, sy);
          ctx.lineTo(sx, sy + 14 * u * sc);
          ctx.lineTo(sx - 7 * u * sc, sy);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    },

    _drawTier6UltFront(ctx, nv, now, w, h) {
      const elapsed = Math.max(0, now - nv.startAt);
      const p = Math.min(1.0, elapsed / nv.durationMs);
      const a = nv._alphaEnv || 0;
      if (a <= 0.01) return;
      const mKey = nv.mode || 'dynamo';
      const isMob = w < 600;
      const u = CoreGeometryDB.computeCoreMetrics(w, h, 6, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank);

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Twin Shoulder Weapons Ignition Convergence Beams + Central Apex Conduit
      const apexY = Math.max(-20, nv.y - h * 0.78);
      const centerX = nv.x;
      const centerY = mKey === 'helix' ? (nv.y - 122 * u) : (nv.y - 72 * u);
      const beamCol = mKey === 'meteor' ? `rgba(251, 146, 60, ${0.78 * a})` : (mKey === 'helix' ? `rgba(34, 211, 238, ${0.78 * a})` : `rgba(167, 139, 250, ${0.78 * a})`);
      const coreSpr = QuantumRenderer._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'cyan' : 'violet'));

      [mzs.left, mzs.right].forEach((mz) => {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = beamCol;
        ctx.lineWidth = Math.max(5.5, 9.0 * u);
        ctx.beginPath();
        ctx.moveTo(mz.x, mz.y);
        ctx.lineTo(mz.x * 0.35 + centerX * 0.65, apexY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * a})`;
        ctx.lineWidth = Math.max(2.0, 3.0 * u);
        ctx.stroke();

        ctx.globalAlpha = 0.85 * a;
        ctx.drawImage(coreSpr, mz.x - 26 * u, mz.y - 26 * u, 52 * u, 52 * u);
      });

      if (mKey === 'helix') {
        ctx.globalAlpha = a;
        const hornGlow = QuantumRenderer._getGlowSprite('cyan');
        ctx.drawImage(hornGlow, centerX - 38 * u, centerY - 38 * u, 76 * u, 76 * u);
        ctx.fillStyle = `rgba(224, 242, 254, ${0.96 * a})`;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 28 * u);
        ctx.lineTo(centerX + 8 * u, centerY);
        ctx.lineTo(centerX, centerY + 14 * u);
        ctx.lineTo(centerX - 8 * u, centerY);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.globalAlpha = 0.78 * a;
        ctx.drawImage(coreSpr, centerX - 34 * u, centerY - 34 * u, 68 * u, 68 * u);
      }
      ctx.globalAlpha = 1.0;

      // 2. Z-Sorted Front-Half (sin(ang) >= 0) of Ascending 3D Coils / Chiral Triple-Helix
      const steps = 26;
      const colSpanY = nv.y + 24;
      const strandCount = (mKey === 'helix') ? 3 : 2;
      for (let s = 0; s < strandCount; s++) {
        const strandCol = mKey === 'meteor'
          ? (s === 0 ? `rgba(253, 224, 71, ${0.92 * a})` : `rgba(251, 146, 60, ${0.88 * a})`)
          : (mKey === 'helix'
            ? (s === 0 ? `rgba(103, 232, 249, ${0.92 * a})` : (s === 1 ? `rgba(244, 114, 182, ${0.90 * a})` : `rgba(255, 255, 255, ${0.85 * a})`))
            : (s === 0 ? `rgba(253, 224, 71, ${0.92 * a})` : `rgba(125, 211, 252, ${0.90 * a})`));
        ctx.strokeStyle = strandCol;
        ctx.lineWidth = isMob ? 3.8 : 5.2;
        let drawing = false;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const f = i / steps;
          const yy = nv.y + 18 * u - f * colSpanY;
          const ang = f * Math.PI * 5.0 - elapsed * 0.008 + s * ((Math.PI * 2) / strandCount);
          if (Math.sin(ang) >= 0) {
            const radiusF = (0.85 - f * 0.35) * (isMob ? 72 : 102) * rampIn;
            const xx = nv.x + Math.cos(ang) * radiusF;
            const y3d = yy + Math.sin(ang) * 14 * u;
            if (!drawing) { ctx.moveTo(xx, y3d); drawing = true; }
            else ctx.lineTo(xx, y3d);
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 3. Ascending 3D Perspective Shock-Rings (front arcs passing OVER character)
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const ringFrac = ((p * 2.4 + rIdx * 0.33) % 1.0);
        const ringY = nv.y - ringFrac * Math.min(h * 0.72, 460);
        const rrX = rx * (0.72 + ringFrac * 0.42);
        const rrY = ry * (0.65 + ringFrac * 0.32);
        const rAlpha = (1.0 - ringFrac) * a * 0.90;
        ctx.strokeStyle = mKey === 'meteor' ? `rgba(254, 240, 138, ${rAlpha})` : (mKey === 'helix' ? `rgba(244, 114, 182, ${rAlpha})` : `rgba(253, 224, 71, ${rAlpha})`);
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.ellipse(nv.x, ringY, rrX, rrY, 0, 0, Math.PI);
        ctx.stroke();
      }

      // 4. Dynamo Princess Only: Front-Half Orbiting 3D Crystal Lance Sigils (sin(ang) >= 0)
      if (mKey === 'dynamo') {
        for (let k = 0; k < 4; k++) {
          const ang = elapsed * 0.0036 + k * (Math.PI * 0.5);
          if (Math.sin(ang) < 0) continue;
          const sx = nv.x + Math.cos(ang) * rx * 0.92;
          const sy = nv.y - 10 * u + Math.sin(ang) * ry * 0.85;
          const sc = 0.88 + 0.24 * Math.sin(ang);
          ctx.fillStyle = `rgba(224, 242, 254, ${0.95 * a})`;
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.92 * a})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sx, sy - 24 * u * sc);
          ctx.lineTo(sx + 8 * u * sc, sy);
          ctx.lineTo(sx, sy + 16 * u * sc);
          ctx.lineTo(sx - 8 * u * sc, sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      ctx.restore();
    }""",
    "drawNovaForeground Tier6 front + 3D Ult helpers",
)

# 7. Remove all 7 unnecessary core-arcade floatingTexts.push calls + AMMO EMPTY canvas text
src = replace_once(
    src,
    """      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playVoidbloomDrain();
      renderReflexShields();

      state.floatingTexts.push({
        x: cx,
        y: cy - 42,
        text: '-1 SHIELD',
        color: '#a3e635',
        alpha: 1.0,
        startTime: now
      });
      updateHeaderUI();""",
    """      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playVoidbloomDrain();
      renderReflexShields();
      updateHeaderUI();""",
    "Remove Voidbloom -1 SHIELD text",
)
src = replace_once(
    src,
    """      state.offenseMode = false;
      state.pointerFiring = false;
      state.touchFireHeld = false;""",
    """      state.offenseMode = false;
      state.pointerFiring = false;
      state.touchFireHeld = false;
      state.gunDeployT = 0;
      state.tier6Skill2CastUntil = 0;""",
    "resetRoundState gunDeployT",
)
src = replace_once(
    src,
    """    toggleOffense(now) {
      if (!state.active || state.gameType === 'reflex' || state.gameType === 'math' || state.gameType === 'memory') return;
      // === CHANGED (v385): On touch devices, firing is MANUAL ONLY via the FIRE button (no auto-fire toggle) ===
      if (TouchFireControls.isTouch) return;
      state.offenseMode = !state.offenseMode;
      audio.playPhaseSwitch();
      updateHeaderUI();
    },""",
    """    toggleOffense(now) {
      // Guns are strictly manual hold-to-fire across desktop & touch; sticky auto-toggle disabled.
      state.offenseMode = false;
      updateHeaderUI();
    },""",
    "Disable toggleOffense sticky state",
)
src = replace_once(
    src,
    """        this._spawnHitSparks(pyl.x, pyl.y, '#fbbf24', 14);
        audio.playArmorBreak();
        state.floatingTexts.push({
          x: pyl.x, y: pyl.y - 10,
          text: 'ARMOR BREAK 1.5X',
          color: '#fbbf24',
          alpha: 1.0,
          startTime: now
        });
        updateHeaderUI();""",
    """        this._spawnHitSparks(pyl.x, pyl.y, '#fbbf24', 14);
        audio.playArmorBreak();
        updateHeaderUI();""",
    "Remove ARMOR BREAK floating text",
)
src = replace_once(
    src,
    """      if (!boss.enraged && hpRatio <= 0.50 && boss.hp > 0) {
        boss.enraged = true;
        boss.hitFlashUntil = now + 220;
        audio.playHyperCometRoar();
        state.floatingTexts.push({
          x: boss.x, y: boss.y + boss.hitR * 0.55,
          text: 'PHASE 2 ENRAGE',
          color: '#f43f5e',
          alpha: 1.0,
          startTime: now
        });
        if ((boss.bossId === 4 || boss.bossId === 5) && !boss.pylonsSpawnedP2) {
          boss.pylonsSpawnedP2 = true;
          this._spawnPylons(boss, boss.bossId === 5 ? 3 : 2, 14 + (boss.round - 4) * 3);
        }
      }
      if (boss.bossId === 5 && !boss.finalEclipse && hpRatio <= 0.33 && boss.hp > 0) {
        boss.finalEclipse = true;
        audio.playTier5Ascension();
        state.floatingTexts.push({
          x: boss.x, y: boss.y + boss.hitR * 0.72,
          text: 'PHASE 3 ECLIPSE',
          color: '#fbbf24',
          alpha: 1.0,
          startTime: now
        });
      }""",
    """      if (!boss.enraged && hpRatio <= 0.50 && boss.hp > 0) {
        boss.enraged = true;
        boss.hitFlashUntil = now + 220;
        audio.playHyperCometRoar();
        if ((boss.bossId === 4 || boss.bossId === 5) && !boss.pylonsSpawnedP2) {
          boss.pylonsSpawnedP2 = true;
          this._spawnPylons(boss, boss.bossId === 5 ? 3 : 2, 14 + (boss.round - 4) * 3);
        }
      }
      if (boss.bossId === 5 && !boss.finalEclipse && hpRatio <= 0.33 && boss.hp > 0) {
        boss.finalEclipse = true;
        audio.playTier5Ascension();
      }""",
    "Remove PHASE 2/3 boss floating texts",
)

# 8. updateAndDrawPlayerWeapon: gunDeployT + active-only turrets & lower ammo arc
src = replace_once(
    src,
    """      // === CHANGED (v387): Multi-touch GUN role + Desktop [A] hold (FIRE_DELAY=120ms) + untouched click/[F] ===
      const isTouchMode = TouchFireControls.isTouch;
      const isGunTouchHeld = isTouchMode && TouchFireControls.isGunHeld();
      const isKeyAHeld = TouchFireControls.isDesktopKeyGunHeld();
      const isFiringActive = isTouchMode
        ? isGunTouchHeld
        : !!(state.offenseMode || state.pointerFiring || isKeyAHeld);""",
    """      // === CHANGED (v406): Guns STRICTLY active ONLY when pressing [A]/[F]/mouse/touch ===
      const isTouchMode = TouchFireControls.isTouch;
      const isGunTouchHeld = isTouchMode && TouchFireControls.isGunHeld();
      const isKeyAHeld = TouchFireControls.isDesktopKeyGunHeld();
      const isFiringActive = isTouchMode
        ? isGunTouchHeld
        : !!(state.pointerFiring || isKeyAHeld);

      if (isFiringActive) {
        state.gunDeployT = 1.0;
      } else {
        const retractStep = 0.35 * Math.max(0.5, Math.min(2.5, dtScale || 1));
        state.gunDeployT = Math.max(0, (state.gunDeployT || 0) - retractStep);
      }""",
    "updateAndDrawPlayerWeapon input & gunDeployT",
)
src = replace_once(
    src,
    """      const hasAmmo = (state.coreAmmo || 0) > 0;
      const showTurrets = isFiringActive;
      if (showTurrets) {
        const arcR = ((mode === 'dynamo') ? 76 : 70) * u;
        const ammoFrac = Math.min(1, (state.coreAmmo || 0) / 150);
        const lowAmmo = (state.coreAmmo || 0) < 6;
        const gaugeCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fb923c' : (mode === 'helix' ? '#22d3ee' : '#38bdf8'));
        const isHot = isFiringActive || (state.muzzleFlashUntil && now < state.muzzleFlashUntil + 140);
        const mfActive = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT = mfActive ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0;
        const recoilY = mfActive ? (mfT * 4.5 * u) : 0;

        ctx.save();
        ctx.translate(cx, cy);
        const bankAngle = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.45) : 0;
        ctx.rotate(bankAngle);

        // Lower Hemisphere Crisp Unblurred Ammo Track (only when firing or low ammo or boss active)
        if (isFiringActive || (state.boss && state.boss.phase !== 'defeated')) {""",
    """      const hasAmmo = (state.coreAmmo || 0) > 0;
      const gunT = state.gunDeployT || 0;
      const showTurrets = (tier >= 6) ? isFiringActive : (gunT > 0.02);
      if (showTurrets) {
        const arcR = ((mode === 'dynamo') ? 76 : 70) * u;
        const ammoFrac = Math.min(1, (state.coreAmmo || 0) / 150);
        const lowAmmo = (state.coreAmmo || 0) < 6;
        const gaugeCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fb923c' : (mode === 'helix' ? '#22d3ee' : '#38bdf8'));
        const isHot = isFiringActive || (state.muzzleFlashUntil && now < state.muzzleFlashUntil + 140);
        const mfActive = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT = mfActive ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0;
        const recoilY = (mfActive ? (mfT * 4.5 * u) : 0) + ((tier < 6) ? (1.0 - gunT) * 9 * u : 0);

        ctx.save();
        ctx.translate(cx, cy);
        if (tier < 6) ctx.globalAlpha = Math.min(1, gunT * 1.25);
        const bankAngle = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.45) : 0;
        ctx.rotate(bankAngle);

        // Lower Hemisphere Crisp Unblurred Ammo Track (STRICTLY only while pressing/using gun!)
        if (isFiringActive || (tier < 6 && gunT > 0.05)) {""",
    "showTurrets & lower ammo arc gating",
)

src = replace_once(
    src,
    """      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playHazardExplosion();
      renderReflexShields();
      state.floatingTexts.push({
        x: cx, y: cy - 36,
        text: '-1 SHIELD',
        color: '#f43f5e',
        alpha: 1.0,
        startTime: now
      });
      updateHeaderUI();""",
    """      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playHazardExplosion();
      renderReflexShields();
      updateHeaderUI();""",
    "Remove hazard -1 SHIELD floating text",
)
src = replace_once(
    src,
    """        // Phase 2 Enrage Notch (50%) & Phase 3 Notch (33% for R5)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(bx + bw * 0.50, barY + 1, 2, bh - 2);
        if (boss.bossId === 5) ctx.fillRect(bx + bw * 0.33, barY + 1, 2, bh - 2);

        // Only alert when ammo runs out (keeps Boss arena clean)
        if ((state.coreAmmo || 0) <= 0) {
          ctx.font = '700 10px "Lexend", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('AMMO EMPTY · CATCH NODES', w * 0.5, barY + bh + 5, Math.max(200, w - 24));
        }
      }""",
    """        // Phase 2 Enrage Notch (50%) & Phase 3 Notch (33% for R5)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(bx + bw * 0.50, barY + 1, 2, bh - 2);
        if (boss.bossId === 5) ctx.fillRect(bx + bw * 0.33, barY + 1, 2, bh - 2);
      }""",
    "Remove AMMO EMPTY canvas text",
)

src = replace_once(
    src,
    """    offenseMode: false,
    pointerFiring: false,
    touchFireHeld: false, // === CHANGED (v385): Touch-only manual fire hold state ===
    lastShotTime: 0,""",
    """    offenseMode: false,
    pointerFiring: false,
    touchFireHeld: false, // === CHANGED (v385): Touch-only manual fire hold state ===
    gunDeployT: 0,
    lastShotTime: 0,""",
    "state.gunDeployT init",
)
src = replace_once(
    src,
    """      const isActive = TouchFireControls.isTouch
        ? TouchFireControls.isGunHeld()
        : !!(state.offenseMode || state.pointerFiring || TouchFireControls.isDesktopKeyGunHeld());""",
    """      const isActive = TouchFireControls.isTouch
        ? TouchFireControls.isGunHeld()
        : !!(state.pointerFiring || TouchFireControls.isDesktopKeyGunHeld());""",
    "updateHeaderUI isActive",
)
src = replace_once(
    src,
    """          state.coreAmmo = mAmmo ? Math.max(0, parseInt(mAmmo[1], 10)) : 72;
          state.offenseMode = !TouchFireControls.isTouch;""",
    """          state.coreAmmo = mAmmo ? Math.max(0, parseInt(mAmmo[1], 10)) : 72;
          state.offenseMode = false;""",
    "test_boss disable offenseMode",
)
src = replace_once(
    src,
    """            if (!state.hasBuff('shield', now)) {
              state.pulseMeter = Math.max(0, (state.pulseMeter || 0) - 30);
              if (state.pulseMeter < 100) state.isPulseReady = false;
              state.empSlowUntil = now + 650;
              state.floatingTexts.push({
                x: catcherPixelX,
                y: catcherPixelY - 64,
                text: '⚡ EMP SHOCK! -30% PULSE',
                color: swPal.empHex,
                alpha: 1.0,
                startTime: now
              });
              updateHeaderUI();
            }""",
    """            if (!state.hasBuff('shield', now)) {
              state.pulseMeter = Math.max(0, (state.pulseMeter || 0) - 30);
              if (state.pulseMeter < 100) state.isPulseReady = false;
              state.empSlowUntil = now + 650;
              updateHeaderUI();
            }""",
    "Remove EMP SHOCK floating text",
)
src = replace_once(
    src,
    """            state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
            if (state.coreTier === 5) audio.playTier5Ascension();
            else audio.playOverdriveFanfare();
            if (state.reflexLives > prevLives) {
              state.floatingTexts.push({
                x: p.x,
                y: p.y - 20,
                text: '+1 LIFE',
                color: '#34d399',
                alpha: 1.0,
                startTime: now
              });
            }

          } else if (p.nodeClass === 'shield') {""",
    """            state.applyBuff('catalyst', 'ASCENSION CATALYST', '#10b981', '💚', 6000, now);
            if (state.coreTier === 5) audio.playTier5Ascension();
            else audio.playOverdriveFanfare();

          } else if (p.nodeClass === 'shield') {""",
    "Remove +1 LIFE floating text",
)
src = replace_once(
    src,
    """      // Render Floating Texts (Strictly capped to 3 simultaneous items for crisp playfield)
      if (state.floatingTexts.length > 3) {
        state.floatingTexts.splice(0, state.floatingTexts.length - 3);
      }
      if (state.floatingTexts.length > 0) {""",
    """      // Render Floating Texts (Strictly for Reflex Numbers Blitz; zero playfield text in core arcade modes)
      if (state.gameType !== 'reflex' && state.floatingTexts.length > 0) {
        state.floatingTexts.length = 0;
      }
      if (state.floatingTexts.length > 3) {
        state.floatingTexts.splice(0, state.floatingTexts.length - 3);
      }
      if (state.gameType === 'reflex' && state.floatingTexts.length > 0) {""",
    "Guard floatingTexts render to reflex only",
)
src = replace_once(
    src,
    """    if (dom.pulsePill) dom.pulsePill.onclick = () => triggerFluxPulse(false);
    if (dom.offensePill) dom.offensePill.onclick = (e) => {
      e.stopPropagation();
      // === CHANGED (v385): Touch devices fire manually via #ocTouchFireBtn only (no HUD auto-fire toggle) ===
      if (TouchFireControls.isTouch) return;
      RoundBossEngine.toggleOffense(performance.now());
    };""",
    """    if (dom.pulsePill) dom.pulsePill.onclick = () => triggerFluxPulse(false);
    if (dom.offensePill) dom.offensePill.onclick = (e) => {
      e.stopPropagation();
      state.offenseMode = false;
    };""",
    "Disable offensePill click toggle",
)
src = replace_once(
    src,
    """      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        RoundBossEngine.toggleOffense(performance.now());
      } else if (e.key === 't' || e.key === 'T') {
        cycleCoreTier();
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A')) {
        // [A] = EMBER CANNON: steady continuous hold fire (manual only, stops immediately on keyup)
        e.preventDefault();
        if (!TouchFireControls.heldKeys.has('KeyA')) {
          TouchFireControls.heldKeys.add('KeyA');
          if ((state.coreAmmo || 0) <= 0) TouchFireControls.flashEmpty();
          updateHeaderUI();
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
        // [S] = SEEKER COMETS (tap only; ignore e.repeat so holding S never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyS');
          SkillSystem.castSeekerComets(performance.now());
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyD' || e.key === 'd' || e.key === 'D')) {
        // [D] = CALDERA NOVA (tap only; ignore e.repeat so holding D never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyD');
          SkillSystem.castCalderaNova(performance.now());
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA' || e.key === 'a' || e.key === 'A') {
        if (TouchFireControls.heldKeys.delete('KeyA')) {
          updateHeaderUI();
        }
      } else if (e.code === 'KeyS' || e.key === 's' || e.key === 'S') {""",
    """      if (e.code === 'Space') {
        e.preventDefault();
        triggerFluxPulse();
      } else if (e.key === 't' || e.key === 'T') {
        cycleCoreTier();
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
        // [A] or [F] = EMBER CANNON: steady continuous hold fire (manual only, stops immediately on keyup)
        e.preventDefault();
        const gunCode = (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') ? 'KeyF' : 'KeyA';
        if (!TouchFireControls.heldKeys.has(gunCode)) {
          TouchFireControls.heldKeys.add(gunCode);
          if ((state.coreAmmo || 0) <= 0) TouchFireControls.flashEmpty();
          updateHeaderUI();
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
        // [S] = SEEKER COMETS (tap only; ignore e.repeat so holding S never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyS');
          SkillSystem.castSeekerComets(performance.now());
        }
      } else if (!TouchFireControls.isTouch && (e.code === 'KeyD' || e.key === 'd' || e.key === 'D')) {
        // [D] = CALDERA NOVA (tap only; ignore e.repeat so holding D never spams)
        e.preventDefault();
        if (!e.repeat) {
          TouchFireControls.heldKeys.add('KeyD');
          SkillSystem.castCalderaNova(performance.now());
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        const gunCode = (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') ? 'KeyF' : 'KeyA';
        if (TouchFireControls.heldKeys.delete(gunCode)) {
          updateHeaderUI();
        }
      } else if (e.code === 'KeyS' || e.key === 's' || e.key === 'S') {""",
    "KeyA & KeyF hold-to-fire keyboard binding",
)
src = replace_once(
    src,
    """        // Desktop Left-Click Hold = Instant Fire; Right-Click on Arena = Toggle Continuous Offense Mode!
        if (dom.canvasReflex && e.target === dom.canvasReflex) {
          if (e.button === 2) {
            RoundBossEngine.toggleOffense(performance.now());
          } else if (e.button === 0) {
            state.pointerFiring = true;
            updateHeaderUI();
          }
        }""",
    """        // Desktop Left-Click Hold = Instant Fire
        if (dom.canvasReflex && e.target === dom.canvasReflex) {
          if (e.button === 0) {
            state.pointerFiring = true;
            updateHeaderUI();
          }
        }""",
    "Disable right-click toggleOffense",
)

with open(GAME_PATH, "w", encoding="utf-8", newline=newline) as f:
    f.write(src)

print("SUCCESS: Applied all v406 updates cleanly on top of 37b3163 game.js!")
