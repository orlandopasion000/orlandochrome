"""Deterministic v421 patch for game.js with strict single-match assertions."""
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME_PATH = os.path.join(ROOT_DIR, "game.js")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    assert cnt == 1, f"Expected 1 match for [{label}], got {cnt}"
    return text.replace(old, new, 1)


def replace_n(text: str, old: str, new: str, expected: int, label: str) -> str:
    cnt = text.count(old)
    assert cnt == expected, f"Expected {expected} matches for [{label}], got {cnt}"
    return text.replace(old, new)


def main():
    raw = open(GAME_PATH, encoding="utf-8").read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    g = raw.replace("\r\n", "\n")

    # 1. Global cache version bump
    g = g.replace("arcade420_luxury_masterpiece", "arcade421_tier7_celestial")

    # 2. Tier VII Royal Ascension Soundscape + pitchBoost up to Tier 7
    g = replace_once(
        g,
        """      this._vibrate([25, 35, 70, 25, 45, 25, 80]);
    }

    playPhaseSwitch() {""",
        """      this._vibrate([25, 35, 70, 25, 45, 25, 80]);
    }

    // === ADDED (v421): Grand 7-Note Imperial Celestial Ascension Fanfare (Tier VI -> Tier VII) ===
    playTier7Ascension(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      try {
        const ac = this.ctx;
        const t0 = ac.currentTime;
        const root = (mode === 'meteor') ? 220.00 : (mode === 'helix' ? 261.63 : 246.94);
        const ratios = [1.0, 1.25, 1.5, 1.875, 2.0, 2.5, 3.0];
        ratios.forEach((r, idx) => {
          const nt = t0 + 0.08 + idx * 0.082;
          const o = ac.createOscillator();
          const g = ac.createGain();
          o.type = (idx % 2 === 0) ? 'triangle' : 'sine';
          o.frequency.setValueAtTime(root * r, nt);
          g.gain.setValueAtTime(0.001, nt);
          g.gain.linearRampToValueAtTime(0.15, nt + 0.035);
          g.gain.exponentialRampToValueAtTime(0.0008, nt + 0.62);
          o.connect(g);
          g.connect(ac.destination);
          o.start(nt);
          o.stop(nt + 0.65);
        });
      } catch (e) {}
      this._vibrate([30, 25, 65, 25, 95]);
    }

    playPhaseSwitch() {""",
        "playTier7Ascension",
    )

    g = replace_once(
        g,
        "const pitchBoost = 1 + (Math.min(5, tier) - 1) * 0.045;",
        "const pitchBoost = 1 + (Math.min(7, tier) - 1) * 0.045;",
        "pitchBoost",
    )

    # 3. CORE_GEOMETRY_DB, TIER7_SPECS, getTier7DrawLayout, getTier7Muzzles
    g = replace_once(
        g,
        """    tipXRef: { 1: 168, 2: 256, 3: 336, 4: 416, 5: 496, 6: 516 },
    halfTopRef: { 1: 215, 2: 215, 3: 215, 4: 245, 5: 270, 6: 315 },
    halfBotRef: { 1: 215, 2: 215, 3: 215, 4: 235, 5: 260, 6: 435 }
  };

  // Verified pixel anchors & shoulder-cannon muzzles measured on 1024x682 Tier VI PNGs
  const TIER6_SPECS = {
    meteor: {
      name: 'METEOR DRAGON',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 265,
      muzzleL: { x: 385, y: 95 },
      muzzleR: { x: 636, y: 95 },
      scaleMult: 1.06
    },
    helix: {
      name: 'HELIX UNICORN',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      muzzleL: { x: 406, y: 148 },
      muzzleR: { x: 617, y: 148 },
      scaleMult: 1.08
    },
    dynamo: {
      name: 'DYNAMO PRINCESS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 278,
      muzzleL: { x: 373, y: 19 },
      muzzleR: { x: 650, y: 19 },
      scaleMult: 1.12
    }
  };

  const CoreGeometryDB = {
    data: null,
    TIER6_SPECS,
    load() {
      if (typeof fetch !== 'function') return;
      fetch('assets/core-geometry-db.json?v=arcade421_tier7_celestial')
        .then((r) => (r && r.ok ? r.json() : null))
        .then((json) => {
          if (!json || !json.tierMaxTipXRef) return;
          this.data = json;
          if (typeof json.hingeXRef === 'number') CORE_GEOMETRY_DB.hingeXRef = json.hingeXRef;
          if (typeof json.sphereRadiusRef === 'number') CORE_GEOMETRY_DB.sphereRadiusRef = json.sphereRadiusRef;
          for (let t = 1; t <= 6; t++) {
            const key = String(t);
            if (typeof json.tierMaxTipXRef[key] === 'number') {
              CORE_GEOMETRY_DB.tipXRef[t] = json.tierMaxTipXRef[key];
            }
            if (json.models) {
              let maxTop = CORE_GEOMETRY_DB.halfTopRef[t];
              let maxBot = CORE_GEOMETRY_DB.halfBotRef[t];
              ['dynamo', 'helix', 'meteor'].forEach((m) => {
                const entry = json.models[m] && json.models[m][key];
                if (entry) {
                  if (typeof entry.halfTopY === 'number') maxTop = Math.max(maxTop, entry.halfTopY);
                  if (typeof entry.halfBotY === 'number') maxBot = Math.max(maxBot, entry.halfBotY);
                }
              });
              CORE_GEOMETRY_DB.halfTopRef[t] = maxTop;
              CORE_GEOMETRY_DB.halfBotRef[t] = maxBot;
            }
          }
          if (json.tier6Specs) {
            ['meteor', 'helix', 'dynamo'].forEach((m) => {
              const s = json.tier6Specs[m];
              if (s && TIER6_SPECS[m]) {
                if (typeof s.anchorX === 'number') TIER6_SPECS[m].anchorX = s.anchorX;
                if (typeof s.anchorY === 'number') TIER6_SPECS[m].anchorY = s.anchorY;
                if (s.muzzleL) TIER6_SPECS[m].muzzleL = s.muzzleL;
                if (s.muzzleR) TIER6_SPECS[m].muzzleR = s.muzzleR;
                if (typeof s.scaleMult === 'number') TIER6_SPECS[m].scaleMult = s.scaleMult;
              }
            });
          }
        })
        .catch(() => {});
    },
    _interpMetric(map, tierVal) {
      const c = Math.max(1, Math.min(6, Number.isFinite(tierVal) ? tierVal : 1));
      const lo = Math.floor(c);
      const hi = Math.min(6, lo + 1);
      const frac = c - lo;
      return map[lo] + (map[hi] - map[lo]) * frac;
    },
    computeCoreMetrics(canvasW, canvasH, tier, isTouchMode, customScale = null) {
      const w = Math.max(240, canvasW || 1280);
      const h = Math.max(240, canvasH || 720);
      const isMobile = isTouchMode || w < 600;
      const baseDrawW = isMobile ? Math.min(w * 0.80, 340) : Math.min(w * 0.64, 780);
      let u = customScale || (baseDrawW / 1376.0);
      const tCur = Math.max(1, Math.min(6, Number.isFinite(tier) ? tier : 1));
      const tipX = this._interpMetric(CORE_GEOMETRY_DB.tipXRef, tCur);
      const halfTopRef = this._interpMetric(CORE_GEOMETRY_DB.halfTopRef, tCur);
      const halfBotRef = this._interpMetric(CORE_GEOMETRY_DB.halfBotRef, tCur);

      const hEnv = 1.12;
      const vEnv = 1.10;
      let coreImgScale = (68.0 / 150.0) * u;
      if (!customScale) {
        const maxAllowedW = w * 0.68;
        const maxAllowedH = h * (tCur >= 5.2 ? 0.38 : 0.34);
        const curSpanW = tipX * 2 * hEnv * coreImgScale;
        const curSpanH = (halfTopRef + halfBotRef) * vEnv * coreImgScale;
        let capFactor = 1.0;
        if (curSpanW > maxAllowedW && curSpanW > 0) capFactor = Math.min(capFactor, maxAllowedW / curSpanW);
        if (curSpanH > maxAllowedH && curSpanH > 0) capFactor = Math.min(capFactor, maxAllowedH / curSpanH);
        if (capFactor < 1.0) {
          u *= capFactor;
          coreImgScale = (68.0 / 150.0) * u;
        }
      }

      const halfSpanPx = tipX * hEnv * coreImgScale;
      const halfTopPx = halfTopRef * vEnv * coreImgScale;
      const halfBotPx = halfBotRef * vEnv * coreImgScale;
      return {
        u,
        coreImgScale,
        halfSpanPx,
        halfTopPx,
        halfBotPx,
        safePadX: Math.ceil(halfSpanPx + 10),
        safePadTop: Math.ceil(halfTopPx + 54),
        safePadBottom: Math.ceil(halfBotPx + 12)
      };
    },
    getTier6DrawLayout(mode, u) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const spec = TIER6_SPECS[mKey] || TIER6_SPECS.dynamo;
      const scale = (68.0 / 150.0) * u * (spec.scaleMult || 1.08);
      return {
        spec,
        scale,
        drawW: spec.width * scale,
        drawH: spec.height * scale,
        anchorOffX: spec.anchorX * scale,
        anchorOffY: spec.anchorY * scale
      };
    },
    getTier6Muzzles(mode, u, cx, cy, bankAngle = 0) {
      const lay = this.getTier6DrawLayout(mode, u);
      const rot = bankAngle || 0;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const toWorld = (m) => {
        const lx = (m.x - lay.spec.anchorX) * lay.scale;
        const ly = (m.y - lay.spec.anchorY) * lay.scale;
        return {
          x: cx + lx * cosR - ly * sinR,
          y: cy + lx * sinR + ly * cosR
        };
      };
      return { left: toWorld(lay.spec.muzzleL), right: toWorld(lay.spec.muzzleR), layout: lay };
    },""",
        """    tipXRef: { 1: 168, 2: 256, 3: 336, 4: 416, 5: 496, 6: 516, 7: 524 },
    halfTopRef: { 1: 215, 2: 215, 3: 215, 4: 245, 5: 270, 6: 315, 7: 328 },
    halfBotRef: { 1: 215, 2: 215, 3: 215, 4: 235, 5: 260, 6: 435, 7: 445 }
  };

  // Verified pixel anchors & shoulder-cannon muzzles measured on 1024x682 Tier VI PNGs
  const TIER6_SPECS = {
    meteor: {
      name: 'METEOR DRAGON',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 265,
      muzzleL: { x: 385, y: 95 },
      muzzleR: { x: 636, y: 95 },
      scaleMult: 1.06
    },
    helix: {
      name: 'HELIX UNICORN',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      muzzleL: { x: 406, y: 148 },
      muzzleR: { x: 617, y: 148 },
      scaleMult: 1.08
    },
    dynamo: {
      name: 'DYNAMO PRINCESS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 278,
      muzzleL: { x: 373, y: 19 },
      muzzleR: { x: 650, y: 19 },
      scaleMult: 1.12
    }
  };

  // Verified pixel anchors & central super-weapon + shoulder-tower muzzles measured on 1024x682 Tier VII PNGs
  const TIER7_SPECS = {
    meteor: {
      name: 'METEOR DRAGON',
      title: 'SOLAR WYRM SOVEREIGN',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 256,
      centerMuzzle: { x: 512, y: 34 },
      muzzleL: { x: 402, y: 16 },
      muzzleR: { x: 622, y: 16 },
      scaleMult: 1.14
    },
    helix: {
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
    },
    dynamo: {
      name: 'DYNAMO PRINCESS',
      title: 'CELESTIAL CANNON EMPRESS',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 286,
      centerMuzzle: { x: 512, y: 108 },
      muzzleL: { x: 334, y: 18 },
      muzzleR: { x: 690, y: 18 },
      scaleMult: 1.18
    }
  };

  const CoreGeometryDB = {
    data: null,
    TIER6_SPECS,
    TIER7_SPECS,
    load() {
      if (typeof fetch !== 'function') return;
      fetch('assets/core-geometry-db.json?v=arcade421_tier7_celestial')
        .then((r) => (r && r.ok ? r.json() : null))
        .then((json) => {
          if (!json || !json.tierMaxTipXRef) return;
          this.data = json;
          if (typeof json.hingeXRef === 'number') CORE_GEOMETRY_DB.hingeXRef = json.hingeXRef;
          if (typeof json.sphereRadiusRef === 'number') CORE_GEOMETRY_DB.sphereRadiusRef = json.sphereRadiusRef;
          for (let t = 1; t <= 7; t++) {
            const key = String(t);
            if (typeof json.tierMaxTipXRef[key] === 'number') {
              CORE_GEOMETRY_DB.tipXRef[t] = json.tierMaxTipXRef[key];
            }
            if (json.models) {
              let maxTop = CORE_GEOMETRY_DB.halfTopRef[t];
              let maxBot = CORE_GEOMETRY_DB.halfBotRef[t];
              ['dynamo', 'helix', 'meteor'].forEach((m) => {
                const entry = json.models[m] && json.models[m][key];
                if (entry) {
                  if (typeof entry.halfTopY === 'number') maxTop = Math.max(maxTop, entry.halfTopY);
                  if (typeof entry.halfBotY === 'number') maxBot = Math.max(maxBot, entry.halfBotY);
                }
              });
              CORE_GEOMETRY_DB.halfTopRef[t] = maxTop;
              CORE_GEOMETRY_DB.halfBotRef[t] = maxBot;
            }
          }
          if (json.tier6Specs) {
            ['meteor', 'helix', 'dynamo'].forEach((m) => {
              const s = json.tier6Specs[m];
              if (s && TIER6_SPECS[m]) {
                if (typeof s.anchorX === 'number') TIER6_SPECS[m].anchorX = s.anchorX;
                if (typeof s.anchorY === 'number') TIER6_SPECS[m].anchorY = s.anchorY;
                if (s.muzzleL) TIER6_SPECS[m].muzzleL = s.muzzleL;
                if (s.muzzleR) TIER6_SPECS[m].muzzleR = s.muzzleR;
                if (typeof s.scaleMult === 'number') TIER6_SPECS[m].scaleMult = s.scaleMult;
              }
            });
          }
          if (json.tier7Specs) {
            ['meteor', 'helix', 'dynamo'].forEach((m) => {
              const s = json.tier7Specs[m];
              if (s && TIER7_SPECS[m]) {
                if (typeof s.anchorX === 'number') TIER7_SPECS[m].anchorX = s.anchorX;
                if (typeof s.anchorY === 'number') TIER7_SPECS[m].anchorY = s.anchorY;
                if (s.centerMuzzle) TIER7_SPECS[m].centerMuzzle = s.centerMuzzle;
                if (s.muzzleL) TIER7_SPECS[m].muzzleL = s.muzzleL;
                if (s.muzzleR) TIER7_SPECS[m].muzzleR = s.muzzleR;
                if (typeof s.scaleMult === 'number') TIER7_SPECS[m].scaleMult = s.scaleMult;
              }
            });
          }
        })
        .catch(() => {});
    },
    _interpMetric(map, tierVal) {
      const c = Math.max(1, Math.min(7, Number.isFinite(tierVal) ? tierVal : 1));
      const lo = Math.floor(c);
      const hi = Math.min(7, lo + 1);
      const frac = c - lo;
      return map[lo] + (map[hi] - map[lo]) * frac;
    },
    computeCoreMetrics(canvasW, canvasH, tier, isTouchMode, customScale = null) {
      const w = Math.max(240, canvasW || 1280);
      const h = Math.max(240, canvasH || 720);
      const isMobile = isTouchMode || w < 600;
      const baseDrawW = isMobile ? Math.min(w * 0.80, 340) : Math.min(w * 0.64, 780);
      let u = customScale || (baseDrawW / 1376.0);
      const tCur = Math.max(1, Math.min(7, Number.isFinite(tier) ? tier : 1));
      const tipX = this._interpMetric(CORE_GEOMETRY_DB.tipXRef, tCur);
      const halfTopRef = this._interpMetric(CORE_GEOMETRY_DB.halfTopRef, tCur);
      const halfBotRef = this._interpMetric(CORE_GEOMETRY_DB.halfBotRef, tCur);

      const hEnv = 1.12;
      const vEnv = 1.10;
      let coreImgScale = (68.0 / 150.0) * u;
      if (!customScale) {
        const maxAllowedW = w * 0.68;
        const maxAllowedH = h * (tCur >= 5.2 ? 0.38 : 0.34);
        const curSpanW = tipX * 2 * hEnv * coreImgScale;
        const curSpanH = (halfTopRef + halfBotRef) * vEnv * coreImgScale;
        let capFactor = 1.0;
        if (curSpanW > maxAllowedW && curSpanW > 0) capFactor = Math.min(capFactor, maxAllowedW / curSpanW);
        if (curSpanH > maxAllowedH && curSpanH > 0) capFactor = Math.min(capFactor, maxAllowedH / curSpanH);
        if (capFactor < 1.0) {
          u *= capFactor;
          coreImgScale = (68.0 / 150.0) * u;
        }
      }

      const halfSpanPx = tipX * hEnv * coreImgScale;
      const halfTopPx = halfTopRef * vEnv * coreImgScale;
      const halfBotPx = halfBotRef * vEnv * coreImgScale;
      return {
        u,
        coreImgScale,
        halfSpanPx,
        halfTopPx,
        halfBotPx,
        safePadX: Math.ceil(halfSpanPx + 10),
        safePadTop: Math.ceil(halfTopPx + 54),
        safePadBottom: Math.ceil(halfBotPx + 12)
      };
    },
    getTier6DrawLayout(mode, u) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const spec = TIER6_SPECS[mKey] || TIER6_SPECS.dynamo;
      const scale = (68.0 / 150.0) * u * (spec.scaleMult || 1.08);
      return {
        spec,
        scale,
        drawW: spec.width * scale,
        drawH: spec.height * scale,
        anchorOffX: spec.anchorX * scale,
        anchorOffY: spec.anchorY * scale
      };
    },
    getTier6Muzzles(mode, u, cx, cy, bankAngle = 0) {
      const lay = this.getTier6DrawLayout(mode, u);
      const rot = bankAngle || 0;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const toWorld = (m) => {
        const lx = (m.x - lay.spec.anchorX) * lay.scale;
        const ly = (m.y - lay.spec.anchorY) * lay.scale;
        return {
          x: cx + lx * cosR - ly * sinR,
          y: cy + lx * sinR + ly * cosR
        };
      };
      return { left: toWorld(lay.spec.muzzleL), right: toWorld(lay.spec.muzzleR), layout: lay };
    },
    getTier7DrawLayout(mode, u) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const spec = TIER7_SPECS[mKey] || TIER7_SPECS.dynamo;
      const scale = (68.0 / 150.0) * u * (spec.scaleMult || 1.15);
      return {
        spec,
        scale,
        drawW: spec.width * scale,
        drawH: spec.height * scale,
        anchorOffX: spec.anchorX * scale,
        anchorOffY: spec.anchorY * scale
      };
    },
    getTier7Muzzles(mode, u, cx, cy, bankAngle = 0) {
      const lay = this.getTier7DrawLayout(mode, u);
      const rot = bankAngle || 0;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const toWorld = (m) => {
        const lx = (m.x - lay.spec.anchorX) * lay.scale;
        const ly = (m.y - lay.spec.anchorY) * lay.scale;
        return {
          x: cx + lx * cosR - ly * sinR,
          y: cy + lx * sinR + ly * cosR
        };
      };
      return {
        center: toWorld(lay.spec.centerMuzzle),
        left: toWorld(lay.spec.muzzleL),
        right: toWorld(lay.spec.muzzleR),
        layout: lay
      };
    },""",
        "CORE_GEOMETRY_DB_TIER7_SPECS",
    )

    # 4. LayeredT4Assets Tier VII preloading
    g = replace_once(
        g,
        """    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
        """    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
        "LayeredT4Assets.coreT7",
    )
    g = replace_once(
        g,
        """      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },
      coreT6Showcase: { dynamo: false, helix: false, meteor: false },""",
        """      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },
      coreT6Showcase: { dynamo: false, helix: false, meteor: false },
      coreT7Body: { dynamo: false, helix: false, meteor: false },
      coreT7Guns: { dynamo: false, helix: false, meteor: false },
      coreT7Showcase: { dynamo: false, helix: false, meteor: false },""",
        "LayeredT4Assets.loaded.coreT7",
    )
    g = replace_once(
        g,
        """    LayeredT4Assets.coreT6Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT6Showcase[m] = true; };
    LayeredT4Assets.coreT6Showcase[m].src = `assets/core-${m}-t6-showcase.png?v=arcade421_tier7_celestial`;

    for (let t = 1; t <= 6; t++) {""",
        """    LayeredT4Assets.coreT6Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT6Showcase[m] = true; };
    LayeredT4Assets.coreT6Showcase[m].src = `assets/core-${m}-t6-showcase.png?v=arcade421_tier7_celestial`;

    LayeredT4Assets.coreT7Body[m].onload = () => { LayeredT4Assets.loaded.coreT7Body[m] = true; };
    LayeredT4Assets.coreT7Body[m].src = `assets/core-${m}-t7-body.png?v=arcade421_tier7_celestial`;

    LayeredT4Assets.coreT7Guns[m].onload = () => { LayeredT4Assets.loaded.coreT7Guns[m] = true; };
    LayeredT4Assets.coreT7Guns[m].src = `assets/core-${m}-t7-guns.png?v=arcade421_tier7_celestial`;

    LayeredT4Assets.coreT7Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT7Showcase[m] = true; };
    LayeredT4Assets.coreT7Showcase[m].src = `assets/core-${m}-t7-showcase.png?v=arcade421_tier7_celestial`;

    for (let t = 1; t <= 7; t++) {""",
        "LayeredT4Assets.src.coreT7",
    )

    # 5. Shield outer radius & catalyst fallback map
    g = replace_once(
        g,
        """    getShieldOuterRadius(u, tier = 1) {
      const tierBoost = (tier >= 6) ? 1.26 : 1.0;
      return Math.max(94, 144 * u) * tierBoost;
    },""",
        """    getShieldOuterRadius(u, tier = 1) {
      const tierBoost = (tier >= 7) ? 1.32 : ((tier >= 6) ? 1.26 : 1.0);
      return Math.max(94, 144 * u) * tierBoost;
    },""",
        "getShieldOuterRadius",
    )
    g = replace_once(
        g,
        "const targetTierCombo = { 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };",
        "const targetTierCombo = { 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };",
        "missiles.catalyst.targetTierCombo",
    )

    # 6. Tier6HatchSystem upgrade for Tier VI & Tier VII
    g = replace_once(
        g,
        """  const Tier6HatchSystem = {
    DURATION_MS: 1400,
    BANNER_END_MS: 1580,
    active: false,
    mode: 'dynamo',
    startTime: 0,""",
        """  const Tier6HatchSystem = {
    DURATION_MS: 1400,
    BANNER_END_MS: 1580,
    active: false,
    mode: 'dynamo',
    targetTier: 6,
    startTime: 0,""",
        "Tier6HatchSystem.targetTier",
    )
    g = replace_once(
        g,
        """    _captureEggSnapshot(mode, now) {
      const cw = 420;
      const ch = 260;
      if (!this.eggCanvas) {
        this.eggCanvas = document.createElement('canvas');
        this.eggCanvas.width = cw;
        this.eggCanvas.height = ch;
      }
      const eCtx = this.eggCanvas.getContext('2d');
      if (!eCtx) return;
      eCtx.clearRect(0, 0, cw, ch);
      // Draw real Tier V core + wings scaled neatly into the offscreen shell canvas
      const snapU = 0.72;
      this.eggSnapshotU = snapU;
      QuantumRenderer._drawLayeredWingedCore(eCtx, mode, cw * 0.5, ch * 0.5, now, 5, snapU, true, true);
    },""",
        """    _captureEggSnapshot(mode, now, snapTier = 5) {
      const cw = 420;
      const ch = 260;
      if (!this.eggCanvas) {
        this.eggCanvas = document.createElement('canvas');
        this.eggCanvas.width = cw;
        this.eggCanvas.height = ch;
      }
      const eCtx = this.eggCanvas.getContext('2d');
      if (!eCtx) return;
      eCtx.clearRect(0, 0, cw, ch);
      const snapU = (snapTier >= 6) ? 0.56 : 0.72;
      this.eggSnapshotU = snapU;
      QuantumRenderer._drawLayeredWingedCore(eCtx, mode, cw * 0.5, ch * 0.5, now, snapTier, snapU, snapTier < 6, true);
    },""",
        "Tier6HatchSystem._captureEggSnapshot",
    )
    g = replace_once(
        g,
        """    start(mode, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      this._initFractures();
      this._captureEggSnapshot(mKey, now);
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, 11);
      if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },""",
        """    start(mode, now, targetTier = 6) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const tgt = (targetTier >= 7) ? 7 : 6;
      this.targetTier = tgt;
      this._initFractures();
      this._captureEggSnapshot(mKey, now, tgt >= 7 ? 6 : 5);
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, tgt >= 7 ? 14 : 11);
      if (tgt >= 7 && typeof audio !== 'undefined' && audio.playTier7Ascension) {
        audio.playTier7Ascension(mKey);
      } else if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },""",
        "Tier6HatchSystem.start",
    )
    g = replace_once(
        g,
        """          const lay = CoreGeometryDB.getTier6DrawLayout(mKey, u);
          const halfClipW = (75 * u) + Math.max(0, (pRev - 0.18) / 0.82) * (lay.drawW * 0.56);
          const halfClipH = (elapsed >= 1060)
            ? lay.drawH * 0.90
            : ((95 * u) + Math.min(1, pRev / 0.65) * (lay.drawH * 0.72));

          ctx.save();
          ctx.translate(0, emergeY);
          ctx.scale(wingSpreadX, revealScaleY);
          ctx.globalAlpha = revealAlpha;
          ctx.beginPath();
          ctx.rect(-halfClipW, -halfClipH, halfClipW * 2, halfClipH * 2);
          ctx.clip();
          QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pRev, settleProgress: pSettle });
          ctx.restore();""",
        """          const lay = (this.targetTier >= 7)
            ? CoreGeometryDB.getTier7DrawLayout(mKey, u)
            : CoreGeometryDB.getTier6DrawLayout(mKey, u);
          const halfClipW = (75 * u) + Math.max(0, (pRev - 0.18) / 0.82) * (lay.drawW * 0.56);
          const halfClipH = (elapsed >= 1060)
            ? lay.drawH * 0.90
            : ((95 * u) + Math.min(1, pRev / 0.65) * (lay.drawH * 0.72));

          ctx.save();
          ctx.translate(0, emergeY);
          ctx.scale(wingSpreadX, revealScaleY);
          ctx.globalAlpha = revealAlpha;
          ctx.beginPath();
          ctx.rect(-halfClipW, -halfClipH, halfClipW * 2, halfClipH * 2);
          ctx.clip();
          if (this.targetTier >= 7) {
            QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pRev, settleProgress: pSettle });
          } else {
            QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pRev, settleProgress: pSettle });
          }
          ctx.restore();""",
        "Tier6HatchSystem.reveal",
    )
    g = replace_once(
        g,
        """      const riseY = -98 * u - bProg * 20 * u;
      const spec = TIER6_SPECS[this.mode] || TIER6_SPECS.dynamo;
      const col = (this.mode === 'meteor') ? '#fbbf24' : (this.mode === 'helix' ? '#67e8f9' : '#e879f9');

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fSize = Math.max(15, Math.round(22 * Math.max(0.75, u)));
      ctx.font = `900 ${fSize}px "Lexend", sans-serif`;
      ctx.lineWidth = Math.max(3, 4.5 * u);
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.strokeText(`TIER VI · ${spec.name}`, cx, cy + riseY);
      ctx.fillStyle = col;
      ctx.fillText(`TIER VI · ${spec.name}`, cx, cy + riseY);
      ctx.restore();""",
        """      const riseY = -98 * u - bProg * 20 * u;
      const isT7Banner = (this.targetTier >= 7);
      const spec = (isT7Banner ? TIER7_SPECS[this.mode] : TIER6_SPECS[this.mode]) || TIER6_SPECS.dynamo;
      const bannerLabel = isT7Banner ? `TIER VII · ${spec.title || spec.name}` : `TIER VI · ${spec.name}`;
      const col = isT7Banner ? '#fde047' : ((this.mode === 'meteor') ? '#fbbf24' : (this.mode === 'helix' ? '#67e8f9' : '#e879f9'));

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fSize = Math.max(15, Math.round((isT7Banner ? 24 : 22) * Math.max(0.75, u)));
      ctx.font = `900 ${fSize}px "Lexend", sans-serif`;
      ctx.lineWidth = Math.max(3, 4.5 * u);
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.strokeText(bannerLabel, cx, cy + riseY);
      ctx.fillStyle = col;
      ctx.fillText(bannerLabel, cx, cy + riseY);
      ctx.restore();""",
        "Tier6HatchSystem.renderBanner",
    )

    # 7. QuantumRenderer Tier VII 3D Rig & Renderer
    g = replace_once(
        g,
        """    // Seamless 1:1 Partition Strip-Mesh 3D Tier VI Rig Cache (Zero polygon-cutout braid/claw shearing!)
    _tier6RigCache: {},""",
        """    // Seamless 1:1 Partition Strip-Mesh 3D Tier VI & Tier VII Rig Caches
    _tier6RigCache: {},
    _tier7RigCache: {},""",
        "_tier7RigCache",
    )

    t7_renderer_code = """      ctx.restore();
    },

    _getTier7ArticulatedRig(mKey) {
      const bodySpr = LayeredT4Assets.coreT7Body && LayeredT4Assets.coreT7Body[mKey];
      const bodyOk = !!(LayeredT4Assets.loaded.coreT7Body && LayeredT4Assets.loaded.coreT7Body[mKey] && bodySpr && bodySpr.naturalWidth > 0);
      const gunsSpr = LayeredT4Assets.coreT7Guns && LayeredT4Assets.coreT7Guns[mKey];
      const gunsOk = !!(LayeredT4Assets.loaded.coreT7Guns && LayeredT4Assets.loaded.coreT7Guns[mKey] && gunsSpr && gunsSpr.naturalWidth > 0);
      const cached = this._tier7RigCache[mKey];
      if (cached && cached.hasSplitLayers === (bodyOk && gunsOk)) return cached;

      if (!bodyOk || !bodySpr) return null;
      const spr = bodySpr;
      const W = 1024, H = 682;
      const cfgMap = {
        dynamo: { seamL: 382, seamR: 642, seamBotY: 410, gunPivotL: { x: 336, y: 188 }, gunPivotR: { x: 688, y: 188 }, headY: 180, flapAmp: 30, tailAmp: 18 },
        helix:  { seamL: 446, seamR: 578, seamBotY: 392, gunPivotL: { x: 380, y: 186 }, gunPivotR: { x: 644, y: 186 }, headY: 165, flapAmp: 32, tailAmp: 19 },
        meteor: { seamL: 438, seamR: 586, seamBotY: 398, gunPivotL: { x: 402, y: 168 }, gunPivotR: { x: 622, y: 168 }, headY: 120, flapAmp: 34, tailAmp: 19 }
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
      this._tier7RigCache[mKey] = rig;
      return rig;
    },

    // Playable Tier VII True-3D Volumetric In-Game Model Renderer
    _drawTier7Character(ctx, mode, cx, cy, u, now, isPortalPreview = false, opts = null) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const rig = this._getTier7ArticulatedRig(mKey);
      if (!rig || !rig.body) {
        this._drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview, opts);
        return;
      }

      const lay = CoreGeometryDB.getTier7DrawLayout(mKey, u);
      const scale = lay.scale;
      const ancX = lay.spec.anchorX;
      const ancY = lay.spec.anchorY;
      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const bank = isPortalPreview ? (Math.sin(now * 0.0019) * 0.03) : ((CoreKinematics.bodyBank || 0) * 0.44);
      const pitchCompY = isPortalPreview ? 1.0 : (1.0 - Math.abs(CoreKinematics.pitchAngle || 0) * 0.16);
      const levY = Math.sin(now * 0.0038) * 3.4 * u * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0046) * 0.016 * motionMult;
      const vxNorm = isPortalPreview ? Math.sin(now * 0.0015) * 0.25 : Math.max(-1.0, Math.min(1.0, (CoreKinematics.vx || 0) * 0.052));
      const bankCompressX = Math.max(0.88, 1.0 - Math.abs(bank) * 0.24);

      const pRev = (opts && typeof opts.revealProgress === 'number') ? Math.max(0, Math.min(1, opts.revealProgress)) : 1.0;
      const easeRev = 1.0 - Math.pow(1.0 - pRev, 3);
      const isUltActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mKey);

      const flapFreq = (isUltActive ? 0.010 : 0.0054) * motionMult;
      const flapPhase = now * flapFreq;
      const flapSin = Math.sin(flapPhase);
      const flapCos = Math.cos(flapPhase);
      const tailPhase = now * 0.0056 * motionMult;

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

      // 1. Z-Sorted Back Halves of Triple 3D Celestial Gyroscopic Astrolabe Rings + Far-Side 3D Orbiting Spheres
      const ultRamp3d = isUltActive ? Math.min(1, (now - SkillSystem.activeNova.startAt) / 220) : 0;
      const ringRx = 112 * u * (1.0 + 0.08 * ultRamp3d);
      const ringRy = 35 * u * (1.0 + 0.08 * ultRamp3d);
      const ringY = 12 * u;
      const gyroTiltA = 0.18 + Math.sin(now * 0.0015) * 0.06 * motionMult;
      const gyroTiltB = -0.17 + Math.cos(now * 0.0013) * 0.05 * motionMult;
      const gyroTiltC = 0.05 * Math.sin(now * 0.0021) * motionMult;
      const orbSpr = this._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'helix' : 'cyan'));

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.42)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.42)' : 'rgba(196, 181, 253, 0.44)');
      ctx.lineWidth = Math.max(2.2, 4.4 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.62)';
      ctx.lineWidth = Math.max(1.1, 1.7 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      for (let sIdx = 0; sIdx < 3; sIdx++) {
        const th = (now * 0.0031 + sIdx * ((Math.PI * 2) / 3)) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT < 0 && orbSpr) {
          const zSc = 0.58 + 0.34 * (1.0 + sinT);
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 15 * u * zSc;
          ctx.globalAlpha = 0.52 * zSc;
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
        }
      }
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(59, 130, 246, 0.32)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.34)' : 'rgba(56, 189, 248, 0.36)');
      ctx.lineWidth = Math.max(1.1, 1.6 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.88, ringRy * 0.88, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltC);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.30)';
      ctx.setLineDash([10 * u, 8 * u]);
      ctx.lineDashOffset = -now * 0.03;
      ctx.lineWidth = Math.max(1.0, 1.4 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.12, ringRy * 1.10, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.restore();

      // 1B. Volumetric Z-Depth Drop Shadow Silhouette
      if (rig.layers3d && rig.layers3d.shadowSil) {
        ctx.save();
        const shX = (-vxNorm * 13 + 8) * u;
        const shY = (15 + flapSin * 3.8) * u;
        ctx.globalAlpha = 0.48;
        ctx.drawImage(rig.layers3d.shadowSil, -ancX * scale + shX, -ancY * scale + shY, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 2. Seamless 1:1 Partition 3D Perspective Strip-Mesh Body & Wings
      this._renderTier6StripMeshToScratch(rig, flapPhase, tailPhase, vxNorm, bank, easeRev);
      ctx.drawImage(rig.bodyScratch, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);

      // 2B. Dynamic Sobel Normal-Mapped 3D Rim & Key Light Cross-Fade
      if (rig.layers3d) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const baseSpec = Math.max(0.12, flapCos * 0.18) + (isUltActive ? 0.20 : 0.08);
        const leftWeight = Math.min(0.84, Math.max(0.10, baseSpec + Math.max(0, -vxNorm) * 0.44 + Math.max(0, -flapSin) * 0.14));
        const rightWeight = Math.min(0.84, Math.max(0.10, baseSpec + Math.max(0, vxNorm) * 0.44 + Math.max(0, flapSin) * 0.14));
        ctx.globalAlpha = leftWeight;
        ctx.drawImage(rig.layers3d.rimLeft, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.globalAlpha = rightWeight;
        ctx.drawImage(rig.layers3d.rimRight, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 3. Live Tier VII Dorsal Sovereign Luminescence
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (mKey === 'meteor') {
        for (let sp = 0; sp < 7; sp++) {
          const spProg = ((now * 0.0024 + sp / 7) % 1.0);
          const spy = (145 - spProg * 265) * scale;
          const spR = (8.0 - spProg * 3.0) * scale;
          const spG = ctx.createRadialGradient(0, spy, 0, 0, spy, spR * 2.2);
          spG.addColorStop(0.0, '#ffffff');
          spG.addColorStop(0.45, sp % 2 === 0 ? '#60a5fa' : '#fde047');
          spG.addColorStop(1.0, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = spG;
          ctx.beginPath();
          ctx.arc(0, spy, spR * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (mKey === 'helix') {
        const hornPulseY = -(120 + ((now * 0.09) % 130)) * scale;
        const hornG = ctx.createRadialGradient(0, hornPulseY, 0, 0, hornPulseY, 18 * scale);
        hornG.addColorStop(0.0, '#ffffff');
        hornG.addColorStop(0.45, '#67e8f9');
        hornG.addColorStop(0.75, '#f0abfc');
        hornG.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = hornG;
        ctx.beginPath();
        ctx.arc(0, hornPulseY, 18 * scale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const palmPulse = 0.65 + 0.35 * Math.sin(now * 0.01);
        for (const side of [-1, 1]) {
          const px = side * 90 * scale;
          const py = (158 - ancY) * scale;
          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, 18 * scale);
          pGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.82 * palmPulse})`);
          pGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.55 * palmPulse})`);
          pGrad.addColorStop(1.0, 'rgba(192, 132, 252, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(px, py, 18 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 4. Twin Shoulder Siege Towers: Strictly hidden while idle; emerge & gimbal ONLY while firing/casting!
      const s2Deploy = Boolean(!isPortalPreview && state.tier6Skill2CastUntil && now < state.tier6Skill2CastUntil);
      const isT7UltCast = Boolean(isUltActive && SkillSystem.activeNova && SkillSystem.activeNova.isTier6);
      const gunDeployAlpha = isPortalPreview ? 0 : Math.max(state.gunDeployT || 0, (s2Deploy || isT7UltCast) ? 1.0 : 0);
      if (gunDeployAlpha > 0.02 && rig.guns) {
        const emergeDrop = (1.0 - gunDeployAlpha) * 20.0;
        const gAlpha = Math.min(1.0, gunDeployAlpha * 1.35);
        const pivL = rig.cfg.gunPivotL;
        const pivR = rig.cfg.gunPivotR;
        const halfW = rig.W * 0.5;
        ctx.save();
        ctx.globalAlpha *= gAlpha;
        ctx.translate((pivL.x - ancX) * scale, (pivL.y - ancY + recL + emergeDrop) * scale);
        ctx.rotate(aimYaw);
        ctx.drawImage(rig.guns, 0, 0, halfW, rig.H, -pivL.x * scale, -pivL.y * scale, halfW * scale, rig.H * scale);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha *= gAlpha;
        ctx.translate((pivR.x - ancX) * scale, (pivR.y - ancY + recR + emergeDrop) * scale);
        ctx.rotate(aimYaw);
        ctx.drawImage(rig.guns, halfW, 0, halfW, rig.H, (halfW - pivR.x) * scale, -pivR.y * scale, halfW * scale, rig.H * scale);
        ctx.restore();
      }

      // 5. Z-Sorted Front Halves of Triple 3D Gyroscopic Rings + Near-Side 3D Orbiting Spheres
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      ctx.save();
      ctx.rotate(gyroTiltC);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.50)';
      ctx.setLineDash([10 * u, 8 * u]);
      ctx.lineDashOffset = -now * 0.03;
      ctx.lineWidth = Math.max(1.1, 1.6 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.12, ringRy * 1.10, 0, 0.06, Math.PI - 0.06);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(96, 165, 250, 0.46)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.48)' : 'rgba(56, 189, 248, 0.50)');
      ctx.lineWidth = Math.max(1.2, 1.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.88, ringRy * 0.88, 0, 0.08, Math.PI - 0.08);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.72)';
      ctx.lineWidth = Math.max(1.4, 2.2 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0.06, Math.PI - 0.06);
      ctx.stroke();

      for (let sIdx = 0; sIdx < 3; sIdx++) {
        const th = (now * 0.0031 + sIdx * ((Math.PI * 2) / 3)) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT >= 0 && orbSpr) {
          const zSc = 0.96 + 0.40 * sinT;
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 17 * u * zSc;
          ctx.globalAlpha = 0.90 * (0.38 + 0.62 * sinT);
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.95 * sinT;
          ctx.beginPath();
          ctx.arc(ox, oy, Math.max(1.8, 2.8 * u * zSc), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      ctx.restore();

      ctx.restore();
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor — Tiers I through VII)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null, isPortalPreview = false, skipHatchOverride = false) {
      const tierIdx = Math.min(7, Math.max(1, tier | 0));"""

    g = replace_once(
        g,
        """      ctx.restore();
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor — Tiers I through VI)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null, isPortalPreview = false, skipHatchOverride = false) {
      const tierIdx = Math.min(6, Math.max(1, tier | 0));""",
        t7_renderer_code,
        "_drawTier7Character",
    )

    g = replace_once(
        g,
        """          Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          return;
        }
        if (tierIdx >= 6) {
          this._drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview);""",
        """          Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          return;
        }
        if (tierIdx >= 7) {
          this._drawTier7Character(ctx, mode, cx, cy, u, now, isPortalPreview);
          if (!isPortalPreview) {
            const activeShield7 = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
            if (activeShield7 && activeShield7.expiresAt > now) {
              CoreKinematics.drawAegisForcefield(ctx, cx, cy, u, now, activeShield7.expiresAt - now, mode);
            }
            Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          }
          return;
        }
        if (tierIdx >= 6) {
          this._drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview);""",
        "_drawLayeredWingedCore.t7branch",
    )

    # 8. Friendly Good Nodes & Badges across Dynamo, Helix, and Meteor
    g = replace_once(
        g,
        """          const relicMeta = {
            shield: { glow: (sModeKey === 'helix' ? 'helix' : (sModeKey === 'meteor' ? 'gold' : 'cyan')), starA: '#fde047', starB: (sModeKey === 'helix' ? '#f0abfc' : '#67e8f9'), ring: '#f59e0b', spin: false },
            missiles: { glow: 'cyan', starA: '#38bdf8', starB: '#fde047', ring: '#38bdf8', spin: true },
            cluster: { glow: 'helix', starA: '#22d3ee', starB: '#e879f9', ring: '#fde047', spin: false },
            supercharge: { glow: 'gold', starA: '#fef08a', starB: '#fb923c', ring: '#fbbf24', spin: true },
            chronos: { glow: 'cyan', starA: '#67e8f9', starB: '#e0f2fe', ring: '#67e8f9', spin: false },
            singularity: { glow: 'cyan', starA: '#fde047', starB: '#7dd3fc', ring: '#fbbf24', spin: true },
            catalyst: { glow: 'emPt', starA: '#34d399', starB: '#fef08a', ring: '#34d399', spin: false }
          }[p.nodeClass] || { glow: 'gold', starA: '#fde047', starB: '#ffffff', ring: '#fbbf24', spin: false };""",
        """          const relicMeta = {
            shield: { glow: (sModeKey === 'helix' ? 'helix' : (sModeKey === 'meteor' ? 'gold' : 'cyan')), starA: '#fde047', starB: (sModeKey === 'helix' ? '#f0abfc' : '#67e8f9'), ring: '#fde047', spin: false },
            missiles: { glow: 'cyan', starA: '#7dd3fc', starB: '#fef08a', ring: '#7dd3fc', spin: false },
            cluster: { glow: 'helix', starA: '#22d3ee', starB: '#f0abfc', ring: '#fde047', spin: false },
            supercharge: { glow: 'gold', starA: '#fef08a', starB: '#ffffff', ring: '#fde047', spin: false },
            chronos: { glow: 'cyan', starA: '#67e8f9', starB: '#e0f2fe', ring: '#67e8f9', spin: false },
            singularity: { glow: 'cyan', starA: '#fde047', starB: '#7dd3fc', ring: '#fbbf24', spin: false },
            catalyst: { glow: 'emPt', starA: '#6ee7b7', starB: '#fef08a', ring: '#6ee7b7', spin: false }
          }[p.nodeClass] || { glow: 'gold', starA: '#fde047', starB: '#ffffff', ring: '#fbbf24', spin: false };""",
        "relicMeta.friendly",
    )

    g = replace_once(
        g,
        """          // v413 Enhancement: Dual Counter-Rotating Platinum Astrolabe Ring & Diagonal Specular Light Sweep on Shield Relics!
          if (p.nodeClass === 'shield') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const outerAstR = ringRx * 1.15;
            ctx.rotate(-ringTilt * 0.85);
            ctx.save();
            ctx.scale(0.36, 1.0);
            ctx.strokeStyle = (sModeKey === 'helix') ? 'rgba(240, 171, 252, 0.58)' : 'rgba(224, 242, 254, 0.58)';
            ctx.lineWidth = 1.6 * scale;
            ctx.setLineDash([8 * scale, 6 * scale]);
            ctx.lineDashOffset = -now * 0.03;
            ctx.beginPath();
            ctx.arc(0, 0, outerAstR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // 2 additional orthogonal diamond starlight glints orbiting the platinum filigree axis
            const astSpin = -now * 0.0034 + animPhase;
            for (let g2 = 0; g2 < 2; g2++) {
              const ga = astSpin + g2 * Math.PI;
              CoreKinematics._drawStarGlint(
                ctx,
                Math.cos(ga) * outerAstR * 0.36,
                Math.sin(ga) * outerAstR,
                6.8 * scale,
                (g2 === 0) ? '#ffffff' : relicMeta.starB
              );
            }

            // Diagonal Specular Luxury Light-Sheen Sweep across the 3D Shield Relic every ~1.8s
            const sweepPhase = ((now * 0.00055 + animPhase) % 1.0);
            if (sweepPhase < 0.55) {
              const tSw = sweepPhase / 0.55;
              const swPos = (tSw * 2.0 - 1.0) * targetR * 1.05;
              ctx.save();
              ctx.beginPath();
              ctx.arc(0, 0, targetR * 1.18, 0, Math.PI * 2);
              ctx.clip();
              ctx.rotate(-0.68);
              const swGrad = ctx.createLinearGradient(swPos - 18 * scale, 0, swPos + 18 * scale, 0);
              swGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
              swGrad.addColorStop(0.5, `rgba(254, 249, 195, ${0.42 * Math.sin(tSw * Math.PI)})`);
              swGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = swGrad;
              ctx.fillRect(swPos - 20 * scale, -targetR * 1.4, 40 * scale, targetR * 2.8);
              ctx.restore();
            }
            ctx.restore();
          }

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
        };""",
        """          // v421 Friendly Sanctuary Halo Ring & Universal Benevolent Light-Sheen Sweep across ALL Good Relics
          {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const outerAstR = ringRx * 1.15;
            const realmTint = (sModeKey === 'helix')
              ? 'rgba(240, 171, 252, 0.56)'
              : ((sModeKey === 'meteor') ? 'rgba(254, 240, 138, 0.58)' : 'rgba(224, 242, 254, 0.56)');

            ctx.strokeStyle = 'rgba(254, 249, 195, 0.36)';
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 1.24, 0, Math.PI * 2);
            ctx.stroke();

            if (p.nodeClass === 'shield') {
              ctx.rotate(-ringTilt * 0.85);
              ctx.save();
              ctx.scale(0.36, 1.0);
              ctx.strokeStyle = realmTint;
              ctx.lineWidth = 1.6 * scale;
              ctx.setLineDash([8 * scale, 6 * scale]);
              ctx.lineDashOffset = -now * 0.03;
              ctx.beginPath();
              ctx.arc(0, 0, outerAstR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.restore();

              const astSpin = -now * 0.0034 + animPhase;
              for (let g2 = 0; g2 < 2; g2++) {
                const ga = astSpin + g2 * Math.PI;
                CoreKinematics._drawStarGlint(
                  ctx,
                  Math.cos(ga) * outerAstR * 0.36,
                  Math.sin(ga) * outerAstR,
                  6.8 * scale,
                  (g2 === 0) ? '#ffffff' : relicMeta.starB
                );
              }
            }

            const sweepPhase = ((now * 0.00055 + animPhase) % 1.0);
            if (sweepPhase < 0.55) {
              const tSw = sweepPhase / 0.55;
              const swPos = (tSw * 2.0 - 1.0) * targetR * 1.05;
              ctx.save();
              ctx.beginPath();
              ctx.arc(0, 0, targetR * 1.18, 0, Math.PI * 2);
              ctx.clip();
              ctx.rotate(-0.68);
              const swGrad = ctx.createLinearGradient(swPos - 18 * scale, 0, swPos + 18 * scale, 0);
              swGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
              swGrad.addColorStop(0.5, `rgba(254, 249, 195, ${0.42 * Math.sin(tSw * Math.PI)})`);
              swGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = swGrad;
              ctx.fillRect(swPos - 20 * scale, -targetR * 1.4, 40 * scale, targetR * 2.8);
              ctx.restore();
            }
            ctx.restore();
          }

        } else {
          // Standard Mode Collectible Orb across Dynamo, Helix, and Meteor (Luminous & Friendly)
          if (mode === 'dynamo' || mode === 'realm') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.62;
            ctx.drawImage(this._getGlowSprite('helix'), -targetR * 1.18, -targetR * 1.18, targetR * 2.36, targetR * 2.36);
            ctx.restore();

            if (LayeredT4Assets.loaded.nodeShell.dynamo) {
              ctx.drawImage(LayeredT4Assets.nodeShell.dynamo, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
            }
            const pOrb = ctx.createRadialGradient(-targetR * 0.22, -targetR * 0.25, targetR * 0.04, 0, 0, targetR);
            pOrb.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
            pOrb.addColorStop(0.28, 'rgba(125, 211, 252, 0.92)');
            pOrb.addColorStop(0.60, 'rgba(168, 85, 247, 0.80)');
            pOrb.addColorStop(0.88, 'rgba(14, 116, 144, 0.85)');
            pOrb.addColorStop(1.0, 'rgba(103, 232, 249, 0.94)');
            ctx.fillStyle = pOrb;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.94, 0, Math.PI * 2);
            ctx.fill();
            drawInternalPlasmaArcs(ctx, 0, 0, targetR * 0.88, now, animPhase, false, 4);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.72, -Math.PI * 0.82, -Math.PI * 0.36);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.56)';
            ctx.lineWidth = 2.6 * scale;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.96, Math.PI * 0.55, Math.PI * 1.48);
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.90)';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 0.96, -Math.PI * 0.45, Math.PI * 0.48);
            ctx.strokeStyle = 'rgba(103, 232, 249, 0.94)';
            ctx.lineWidth = 2.8 * scale;
            ctx.stroke();
            ctx.restore();

            const ringR = targetR * 1.16;
            ctx.beginPath();
            ctx.arc(0, 0, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.52)';
            ctx.lineWidth = 1.4 * scale;
            ctx.stroke();
            const moteAngle = now * 0.0035 + animPhase;
            const mx1 = Math.cos(moteAngle) * ringR;
            const my1 = Math.sin(moteAngle) * ringR * 0.55;
            ctx.beginPath(); ctx.arc(mx1, my1, 4.2 * scale, 0, Math.PI * 2); ctx.fillStyle = '#67e8f9'; ctx.fill();
            ctx.beginPath(); ctx.arc(-mx1, -my1, 4.2 * scale, 0, Math.PI * 2); ctx.fillStyle = '#f0abfc'; ctx.fill();
          } else if (mode === 'helix') {
            if (LayeredT4Assets.loaded.nodeShell.helix) {
              ctx.drawImage(LayeredT4Assets.nodeShell.helix, -60 * scale, -60 * scale, 120 * scale, 120 * scale);
            }
            drawRotating3DDNAInsideGlass(ctx, 0, 0, targetR * 0.36, targetR * 0.78, now, animPhase, false, 4);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.60;
            ctx.drawImage(this._getGlowSprite('helix'), -targetR * 1.08, -targetR * 1.08, targetR * 2.16, targetR * 2.16);
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = 'rgba(165, 243, 252, 0.46)';
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 1.12, 0, Math.PI * 2);
            ctx.stroke();
            const hmAng = now * 0.0033 + animPhase;
            ctx.fillStyle = '#67e8f9';
            ctx.beginPath(); ctx.arc(Math.cos(hmAng) * targetR * 1.12, Math.sin(hmAng) * targetR * 0.6, 3.6 * scale, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f5d0fe';
            ctx.beginPath(); ctx.arc(-Math.cos(hmAng) * targetR * 1.12, -Math.sin(hmAng) * targetR * 0.6, 3.6 * scale, 0, Math.PI * 2); ctx.fill();
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
            ctx.globalAlpha = 0.66;
            ctx.drawImage(this._getGlowSprite('gold'), -targetR * 1.22, targetR * 0.16 - targetR * 1.22, targetR * 2.44, targetR * 2.44);
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.52)';
            ctx.lineWidth = 1.6 * scale;
            ctx.beginPath();
            ctx.arc(0, 0, targetR * 1.14, 0, Math.PI * 2);
            ctx.stroke();
            const mmAng = now * 0.0032 + animPhase;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(Math.cos(mmAng) * targetR * 1.14, Math.sin(mmAng) * targetR * 0.56, 3.8 * scale, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(-Math.cos(mmAng) * targetR * 1.14, -Math.sin(mmAng) * targetR * 0.56, 3.4 * scale, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }

        // Friendly Frosted-Jewel Sanctuary Badges for All 7 Powered-Up Good Nodes (Zero Dark Fills!)
        const badges = {
          shield: {
            text: getRealmShieldMeta(mode).badge,
            color: '#fefce8',
            bg: (sModeKey === 'meteor') ? 'rgba(124, 62, 10, 0.92)' : ((sModeKey === 'helix') ? 'rgba(18, 78, 124, 0.92)' : 'rgba(14, 68, 118, 0.92)'),
            border: '#fde047'
          },
          missiles: { text: '✨ MISSILES', color: '#f0f9ff', bg: 'rgba(12, 82, 132, 0.92)', border: '#7dd3fc' },
          cluster: { text: '✨ 2X DUP', color: '#fdf4ff', bg: 'rgba(98, 28, 128, 0.92)', border: '#f0abfc' },
          supercharge: { text: '☀️ HYPER', color: '#fefce8', bg: 'rgba(138, 72, 10, 0.92)', border: '#fde047' },
          chronos: { text: '⏳ STASIS', color: '#ecfeff', bg: 'rgba(12, 88, 108, 0.92)', border: '#67e8f9' },
          singularity: { text: '🧲 VACUUM', color: '#f0f9ff', bg: 'rgba(20, 68, 128, 0.92)', border: '#fde047' },
          catalyst: { text: '💚 +1 LIFE', color: '#ecfdf5', bg: 'rgba(8, 96, 68, 0.92)', border: '#6ee7b7' }
        };""",
        "friendly_good_nodes_and_badges",
    )

    # 9. TouchFireControls Tier VII icons
    g = replace_once(
        g,
        """      if (role === 'ult' || role === 'joyknob') {
        const cls = role === 'joyknob' ? 'oc-joy-knob-img' : 'oc-ult-mini-core';
        const src = curTier >= 6
          ? `assets/core-${m}-t6-showcase.png?v=arcade421_tier7_celestial`
          : `assets/core-${m}-t5.png?v=arcade421_tier7_celestial`;
        return `<img class="${cls}" src="${src}" alt="" draggable="false" />`;
      }""",
        """      if (role === 'ult' || role === 'joyknob') {
        const cls = role === 'joyknob' ? 'oc-joy-knob-img' : 'oc-ult-mini-core';
        const src = curTier >= 7
          ? `assets/core-${m}-t7-showcase.png?v=arcade421_tier7_celestial`
          : (curTier >= 6
            ? `assets/core-${m}-t6-showcase.png?v=arcade421_tier7_celestial`
            : `assets/core-${m}-t5.png?v=arcade421_tier7_celestial`);
        return `<img class="${cls}" src="${src}" alt="" draggable="false" />`;
      }""",
        "TouchFireControls._buildTouchPadArtwork",
    )
    g = replace_once(
        g,
        """      const knobSrc = curTier >= 6
        ? `assets/core-${curMode}-t6-showcase.png?v=arcade421_tier7_celestial`
        : `assets/core-${curMode}-t5.png?v=arcade421_tier7_celestial`;""",
        """      const knobSrc = curTier >= 7
        ? `assets/core-${curMode}-t7-showcase.png?v=arcade421_tier7_celestial`
        : (curTier >= 6
          ? `assets/core-${curMode}-t6-showcase.png?v=arcade421_tier7_celestial`
          : `assets/core-${curMode}-t5.png?v=arcade421_tier7_celestial`);""",
        "TouchFireControls.knobSrc",
    )
    g = replace_once(
        g,
        """      const isT6 = ((typeof state !== 'undefined' && state.coreTier) || 1) >= 6;
      const visualKey = `${curMode}:${isT6 ? 't6' : 't5'}`;
      if (this._cachedRealmMode === curMode && this._cachedVisualTier === visualKey) return;
      this._cachedRealmMode = curMode;
      this._cachedVisualTier = visualKey;
      const ars = getRealmArsenal(curMode);
      const tierNum = isT6 ? 6 : 5;

      if (this.clusterEl) {
        this.clusterEl.setAttribute('data-realm', curMode);
        const dialSvg = this.clusterEl.querySelector('.oc-joy-dial-svg');
        if (dialSvg && this.joyEl) {
          dialSvg.outerHTML = this._buildJoyDialSvg(curMode);
        }
        const crownEl = this.clusterEl.querySelector('.oc-gun-crown-frame');
        if (crownEl) crownEl.outerHTML = this._buildGunCrownFrameSvg(curMode);
      }
      if (this.joyKnobImgEl) {
        this.joyKnobImgEl.src = isT6
          ? `assets/core-${curMode}-t6-showcase.png?v=arcade421_tier7_celestial`
          : `assets/core-${curMode}-t5.png?v=arcade421_tier7_celestial`;
      }""",
        """      const curT = ((typeof state !== 'undefined' && state.coreTier) || 1);
      const tierBucket = curT >= 7 ? 7 : (curT >= 6 ? 6 : 5);
      const visualKey = `${curMode}:t${tierBucket}`;
      if (this._cachedRealmMode === curMode && this._cachedVisualTier === visualKey) return;
      this._cachedRealmMode = curMode;
      this._cachedVisualTier = visualKey;
      const ars = getRealmArsenal(curMode);
      const tierNum = tierBucket;

      if (this.clusterEl) {
        this.clusterEl.setAttribute('data-realm', curMode);
        const dialSvg = this.clusterEl.querySelector('.oc-joy-dial-svg');
        if (dialSvg && this.joyEl) {
          dialSvg.outerHTML = this._buildJoyDialSvg(curMode);
        }
        const crownEl = this.clusterEl.querySelector('.oc-gun-crown-frame');
        if (crownEl) crownEl.outerHTML = this._buildGunCrownFrameSvg(curMode);
      }
      if (this.joyKnobImgEl) {
        this.joyKnobImgEl.src = curT >= 7
          ? `assets/core-${curMode}-t7-showcase.png?v=arcade421_tier7_celestial`
          : (curT >= 6
            ? `assets/core-${curMode}-t6-showcase.png?v=arcade421_tier7_celestial`
            : `assets/core-${curMode}-t5.png?v=arcade421_tier7_celestial`);
      }""",
        "TouchFireControls._syncRealmLabels",
    )

    # 10. SkillSystem._launchVolley & _drawTier6UltFront
    g = replace_once(
        g,
        """      const isT6Launch = ((state.coreTier || 1) >= 6);
      let t6Muzzles = null;
      if (isT6Launch && typeof CoreGeometryDB !== 'undefined') {
        const w = Math.max(320, cachedCanvasRect.width || window.innerWidth || 800);
        const h = Math.max(240, cachedCanvasRect.height || window.innerHeight || 600);
        const uNow = CoreGeometryDB.computeCoreMetrics(w, h, 6, w < 600, null).u;
        const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
        t6Muzzles = CoreGeometryDB.getTier6Muzzles(vMode, uNow, cx, cy, bank);
      }""",
        """      const curTierNow = (state.coreTier || 1);
      const isT6Launch = (curTierNow >= 6);
      let t6Muzzles = null;
      if (isT6Launch && typeof CoreGeometryDB !== 'undefined') {
        const w = Math.max(320, cachedCanvasRect.width || window.innerWidth || 800);
        const h = Math.max(240, cachedCanvasRect.height || window.innerHeight || 600);
        const mTier = curTierNow >= 7 ? 7 : 6;
        const uNow = CoreGeometryDB.computeCoreMetrics(w, h, mTier, w < 600, null).u;
        const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
        t6Muzzles = (mTier >= 7)
          ? CoreGeometryDB.getTier7Muzzles(vMode, uNow, cx, cy, bank)
          : CoreGeometryDB.getTier6Muzzles(vMode, uNow, cx, cy, bank);
      }""",
        "SkillSystem._launchVolley",
    )
    g = replace_once(
        g,
        """      const mKey = nv.mode || 'dynamo';
      const isMob = w < 600;
      const u = CoreGeometryDB.computeCoreMetrics(w, h, 6, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank);""",
        """      const mKey = nv.mode || 'dynamo';
      const isMob = w < 600;
      const ultTier = (state.coreTier || 1) >= 7 ? 7 : 6;
      const u = CoreGeometryDB.computeCoreMetrics(w, h, ultTier, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = (ultTier >= 7)
        ? CoreGeometryDB.getTier7Muzzles(mKey, u, nv.x, nv.y, bank)
        : CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank);""",
        "SkillSystem._drawTier6UltFront",
    )

    # 11. RoundBossEngine.reset + Tier VII Central Super-Weapon Engine
    g = replace_once(
        g,
        """      state.gunDeployT = 0;
      state.tier6Skill2CastUntil = 0;""",
        """      state.gunDeployT = 0;
      state.tier6Skill2CastUntil = 0;
      this._t7DragonFlames = [];""",
        "RoundBossEngine.reset._t7DragonFlames",
    )

    g = replace_once(
        g,
        """      const fireInterval = (isTouchMode || isKeyAHeld)
        ? FIRE_DELAY
        : ((tier >= 6) ? 82 : ((tier >= 5) ? 88 : (tier === 4 ? 98 : (tier >= 2 ? 108 : 122))));

      // Top bezel clearance radius per mode: Dynamo's jeweled crown reaches -85*u; Helix/Meteor spheres reach -68*u
      const coreCrownY = (mode === 'dynamo') ? (-86 * u) : (-69 * u);
      const wingMuzzleX = (tier === 2) ? (76 * u) : (tier === 3 ? (92 * u) : (tier === 4 ? (112 * u) : (126 * u)));
      const wingMuzzleY = -58 * u;

      if (wantsFire && (now - (state.lastShotTime || 0)) >= fireInterval) {
        state.lastShotTime = now;
        state.coreAmmo = Math.max(0, (Number.isFinite(state.coreAmmo) ? Math.floor(state.coreAmmo) : 0) - CONFIG.gun.ammoPerShot);
        state.shotCounter = (state.shotCounter || 0) + 1;
        state.muzzleFlashUntil = now + 65;
        audio.playCoreCannonShot(mode, tier);

        const muzzleY = cy + coreCrownY - 12 * u;
        const speed = (mode === 'dynamo') ? 21.5 : (mode === 'helix' ? 19.2 : 17.8);
        const pushShot = (ox, oy, vx, dmg, heavy, phaseOff = 0) => {
          if (state.playerShots.length >= 64) state.playerShots.shift();
          state.playerShots.push({
            x: cx + ox,
            y: cy + oy,
            vx: vx,
            vy: -speed,
            dmg: dmg,
            mode: mode,
            heavy: heavy,
            bornAt: now,
            phase: phaseOff + state.shotCounter * 0.7,
            isFifth: (state.shotCounter % 5 === 0)
          });
        };

        const centerTipOy = coreCrownY - 14 * u;
        const flankTipOy = wingMuzzleY - 12 * u;

        if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {""",
        """      const fireInterval = (tier >= 7)
        ? 72
        : ((isTouchMode || isKeyAHeld)
          ? FIRE_DELAY
          : ((tier >= 6) ? 82 : ((tier >= 5) ? 88 : (tier === 4 ? 98 : (tier >= 2 ? 108 : 122)))));

      // Top bezel clearance radius per mode: Dynamo's jeweled crown reaches -85*u; Helix/Meteor spheres reach -68*u
      const coreCrownY = (mode === 'dynamo') ? (-86 * u) : (-69 * u);
      const wingMuzzleX = (tier === 2) ? (76 * u) : (tier === 3 ? (92 * u) : (tier === 4 ? (112 * u) : (126 * u)));
      const wingMuzzleY = -58 * u;

      const t7Bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs7W = (tier >= 7 && typeof CoreGeometryDB !== 'undefined')
        ? CoreGeometryDB.getTier7Muzzles(mode, u, cx, cy, t7Bank)
        : null;

      if (wantsFire && (now - (state.lastShotTime || 0)) >= fireInterval) {
        state.lastShotTime = now;
        state.coreAmmo = Math.max(0, (Number.isFinite(state.coreAmmo) ? Math.floor(state.coreAmmo) : 0) - CONFIG.gun.ammoPerShot);
        state.shotCounter = (state.shotCounter || 0) + 1;
        state.muzzleFlashUntil = now + 65;
        audio.playCoreCannonShot(mode, tier);

        const muzzleY = cy + coreCrownY - 12 * u;
        const speed = (mode === 'dynamo') ? 21.5 : (mode === 'helix' ? 19.2 : 17.8);
        const pushShot = (ox, oy, vx, dmg, heavy, phaseOff = 0, extra = null) => {
          if (state.playerShots.length >= 64) state.playerShots.shift();
          const base = {
            x: cx + ox,
            y: cy + oy,
            vx: vx,
            vy: (extra && typeof extra.vy === 'number') ? extra.vy : -speed,
            dmg: dmg,
            mode: mode,
            heavy: heavy,
            bornAt: now,
            phase: phaseOff + state.shotCounter * 0.7,
            isFifth: (state.shotCounter % 5 === 0)
          };
          if (extra) Object.assign(base, extra);
          state.playerShots.push(base);
        };

        const centerTipOy = coreCrownY - 14 * u;
        const flankTipOy = wingMuzzleY - 12 * u;

        if (tier >= 7 && mzs7W) {
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
        } else if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {""",
        "updateAndDrawPlayerWeapon.fireTier7",
    )

    g = replace_once(
        g,
        """        // Mount Configuration Adaptable to Tiers I through VI:
        // - Tier VI: Built-in Twin Shoulder Weapons remain completely unobstructed; brief localized muzzle flash at exact cannon tips!
        if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {""",
        """        // Mount Configuration Adaptable to Tiers I through VII:
        if (tier >= 7 && typeof CoreGeometryDB !== 'undefined') {
          if (mfActive) {
            const mzs7L = CoreGeometryDB.getTier7Muzzles(mode, u, 0, 0, 0);
            const flashCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fde047' : (mode === 'helix' ? '#f0abfc' : '#e0f2fe'));
            [mzs7L.left, mzs7L.right].forEach((mTip) => {
              ctx.save();
              ctx.translate(mTip.x, mTip.y);
              ctx.fillStyle = flashCol;
              ctx.globalAlpha = 0.88 * mfT;
              ctx.beginPath();
              ctx.arc(0, 0, 8 * u, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            });
          }
        } else if (tier >= 6 && typeof CoreGeometryDB !== 'undefined') {""",
        "updateAndDrawPlayerWeapon.turretsTier7",
    )

    t7_superweapon_vfx = """        ctx.restore();
      }

      // ─── TIER VII CENTRAL SUPER-WEAPONS (Unicorn Horn Laser · Dragon Front-Wipe Fire · Princess Hands Mega-Cannon) ───
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

          const coneLen = Math.min(500, Math.max(300, h * 0.64));
          const coneHalf = 36 + coneLen * 0.34;
          const fConeGrad = ctx.createLinearGradient(cX, cY, cX, cY - coneLen);
          fConeGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
          fConeGrad.addColorStop(0.16, 'rgba(254, 240, 138, 0.78)');
          fConeGrad.addColorStop(0.48, 'rgba(249, 115, 22, 0.48)');
          fConeGrad.addColorStop(0.82, 'rgba(220, 38, 38, 0.22)');
          fConeGrad.addColorStop(1.0, 'rgba(153, 27, 27, 0)');
          ctx.fillStyle = fConeGrad;
          ctx.beginPath();
          ctx.moveTo(cX - 18 * u, cY);
          ctx.lineTo(cX + 18 * u, cY);
          ctx.lineTo(cX + coneHalf, cY - coneLen);
          ctx.lineTo(cX - coneHalf, cY - coneLen);
          ctx.closePath();
          ctx.fill();

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

          const railWBottom = 26 * u;
          const railWTop = 20 * u;
          const cannonLen = 90 * u;
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = Math.max(3.0, 5.2 * u);
          ctx.beginPath();
          ctx.moveTo(-railWBottom, 8 * u);
          ctx.lineTo(-railWTop, -cannonLen);
          ctx.moveTo(railWBottom, 8 * u);
          ctx.lineTo(railWTop, -cannonLen);
          ctx.stroke();

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = Math.max(1.6, 2.6 * u);
          ctx.beginPath();
          ctx.moveTo(-railWBottom * 0.72, 6 * u);
          ctx.lineTo(-railWTop * 0.72, -cannonLen + 4 * u);
          ctx.moveTo(railWBottom * 0.72, 6 * u);
          ctx.lineTo(railWTop * 0.72, -cannonLen + 4 * u);
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
      }

      // Update & Render All Player Accumulated-Node Bolts"""

    g = replace_once(
        g,
        """        ctx.restore();
      }

      // Update & Render All Player Accumulated-Node Bolts""",
        t7_superweapon_vfx,
        "t7_superweapon_vfx",
    )

    g = replace_once(
        g,
        """        // 1. Check Hit on Boss Shield Pylons First (generous radius matching bigger 3D plasma shells!)
        if (boss && boss.phase === 'fighting' && boss.pylons && boss.pylons.length > 0) {
          for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
            const pyl = boss.pylons[pIdx];
            if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < 34) {
              this.damagePylon(pyl, s.dmg, now, s.x, s.y);
              consumed = true;
              break;
            }
          }
        }

        // 2. Check Hit on Active Boss Body
        if (!consumed && boss && boss.phase === 'fighting') {
          const dx = s.x - boss.x;
          const dy = s.y - boss.y;
          // Elliptical hitbox matching wide winged bosses cleanly
          const rx = boss.hitR * 1.22;
          const ry = boss.hitR * 0.86;
          if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
            this.damageBoss(s.dmg, now, false, s.x, s.y);
            // Meteor Mass-Driver splash nudges nearby Pylon if close
            if (s.mode === 'meteor' && boss.pylons) {
              for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
                const pyl = boss.pylons[pIdx];
                if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < 75) {
                  this.damagePylon(pyl, 0.35, now, pyl.x, pyl.y);
                }
              }
            }
            consumed = true;
          }
        }

        // 2.5. === CHANGED (v387): Check Hit on Hostile Voidbloom Nodes ===
        if (!consumed && VoidbloomEngine.hitByShot(s.x, s.y, s.dmg, now, 'shot')) {
          consumed = true;
        }

        // 3. Tactical Defense: Bolts Shatter Falling Bad Nodes (NEVER Harm Good Nodes!)
        if (!consumed && state.particles.length > 0) {
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!isHazardNode(pt.nodeClass)) continue;
            const hr = (pt.headR || 28) + 16;
            if (Math.hypot(s.x - pt.x, s.y - pt.y) < hr) {
              if (pt.shotHp === undefined) {
                pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              }
              pt.shotHp -= s.dmg;
              this._spawnHitSparks(s.x, s.y, '#fbbf24', 5);
              consumed = true;
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#fbbf24', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              } else {
                audio.playBossHit(false);
              }
              break;
            }
          }
        }

        if (consumed) {
          // === CHANGED (v392): Per-Realm 5th-Shot Overcharged Super-Round Impact Signatures ===
          if (s.isFifth) {""",
        """        const hitR = s.hitRadius || 34;

        // 1. Check Hit on Boss Shield Pylons First (generous radius matching bigger 3D plasma shells!)
        if (boss && boss.phase === 'fighting' && boss.pylons && boss.pylons.length > 0) {
          for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
            const pyl = boss.pylons[pIdx];
            if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < hitR) {
              this.damagePylon(pyl, s.dmg, now, s.x, s.y);
              consumed = true;
              break;
            }
          }
        }

        // 2. Check Hit on Active Boss Body
        if (!consumed && boss && boss.phase === 'fighting') {
          const dx = s.x - boss.x;
          const dy = s.y - boss.y;
          const rx = boss.hitR * 1.22 + (s.isTier7 ? 20 : 0);
          const ry = boss.hitR * 0.86 + (s.isTier7 ? 16 : 0);
          if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
            this.damageBoss(s.dmg, now, false, s.x, s.y);
            if ((s.mode === 'meteor' || s.t7Kind === 'princess_cannon') && boss.pylons) {
              for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
                const pyl = boss.pylons[pIdx];
                if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < (s.splashR || 75)) {
                  this.damagePylon(pyl, s.t7Kind === 'princess_cannon' ? 1.2 : 0.35, now, pyl.x, pyl.y);
                }
              }
            }
            consumed = true;
          }
        }

        // 2.5. === CHANGED (v387): Check Hit on Hostile Voidbloom Nodes ===
        if (!consumed && VoidbloomEngine.hitByShot(s.x, s.y, s.dmg, now, 'shot')) {
          consumed = true;
        }

        // 3. Tactical Defense: Bolts Shatter Falling Bad Nodes (NEVER Harm Good Nodes!)
        if (!consumed && state.particles.length > 0) {
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!isHazardNode(pt.nodeClass)) continue;
            if (s._hitSet && s._hitSet.has(pt)) continue;
            const hr = (pt.headR || 28) + (s.hitRadius || 16);
            if (Math.hypot(s.x - pt.x, s.y - pt.y) < hr) {
              if (pt.shotHp === undefined) {
                pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              }
              pt.shotHp -= s.dmg;
              if (s.pierce && s.pierce > 0) {
                if (!s._hitSet) s._hitSet = new Set();
                s._hitSet.add(pt);
              }
              this._spawnHitSparks(s.x, s.y, s.t7Kind === 'princess_cannon' ? '#38bdf8' : '#fbbf24', s.isTier7 ? 8 : 5);
              if (pt.shotHp <= 0) {
                state.score += 250;
                this._spawnHitSparks(pt.x, pt.y, '#fbbf24', 10);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              } else {
                audio.playBossHit(false);
              }

              if (s.splashR) {
                if (state.bossShockRings && state.bossShockRings.length < 22) {
                  state.bossShockRings.push({ x: s.x, y: s.y, r: 14, maxR: s.splashR, alpha: 0.92, speed: 7.2, color: '#38bdf8', harmless: true });
                }
                for (let spIdx = state.particles.length - 1; spIdx >= 0; spIdx--) {
                  const opt = state.particles[spIdx];
                  if (!opt || !isHazardNode(opt.nodeClass)) continue;
                  if (Math.hypot(opt.x - s.x, opt.y - s.y) < s.splashR) {
                    if (opt.shotHp === undefined) opt.shotHp = (opt.nodeClass === 'volatile') ? 3 : 5;
                    opt.shotHp -= 2.6;
                    if (opt.shotHp <= 0) {
                      state.score += 250;
                      this._spawnHitSparks(opt.x, opt.y, '#fde047', 8);
                      state.particles.splice(spIdx, 1);
                      SkillSystem.onEnemyDestroyed();
                    }
                  }
                }
              }

              if (s.pierce && s.pierce > 1) {
                s.pierce--;
              } else {
                consumed = true;
                break;
              }
            }
          }
        }

        if (consumed) {
          if (s.isFifth || s.isTier7) {""",
        "updateAndDrawPlayerWeapon.hitLogic",
    )

    g = replace_once(
        g,
        """        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(bAng);

        if (bMode === 'helix') {""",
        """        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(bAng);

        if (s.isTier7) {
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
        }

        if (bMode === 'helix') {""",
        "updateAndDrawPlayerWeapon.t7Projectiles",
    )

    # 12. Tier 7 State Locks, Combo Evaluator, Header UI, GameOver, ReflexStart, and API/URL
    g = replace_once(
        g,
        """    combo: 1,
    prevEvaluatedCombo: 1,
    tier6HatchLock: false,""",
        """    combo: 1,
    prevEvaluatedCombo: 1,
    tier6HatchLock: false,
    tier7HatchLock: false,""",
        "state.tier7HatchLock",
    )

    g = replace_once(
        g,
        """  // Centralized Combo -> Core Tier Progression Evaluator with One-Shot 50x Tier VI Hatching Lock
  function evaluateCoreTierFromCombo(now = performance.now(), allowHatch = true) {
    const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
    const c = Number.isFinite(state.combo) ? state.combo : 0;
    const prevC = Number.isFinite(state.prevEvaluatedCombo) ? state.prevEvaluatedCombo : 0;

    if (!isCoreArcade) {
      if (c >= 28) { state.coreTier = 5; state.isOverdrive = true; }
      else if (c >= 21) { state.coreTier = 4; state.isOverdrive = true; }
      else if (c >= 14) { state.coreTier = 3; state.isOverdrive = false; }
      else if (c >= 7) { state.coreTier = 2; state.isOverdrive = false; }
      else { state.coreTier = 1; state.isOverdrive = false; }
      state.prevEvaluatedCombo = c;
      return;
    }

    const nextTier = (c >= 35) ? 6 : (c >= 28 ? 5 : (c >= 21 ? 4 : (c >= 14 ? 3 : (c >= 7 ? 2 : 1))));
    if (nextTier === 6) {
      const crossedThreshold = (prevC < 35 && c >= 35);
      if (allowHatch && !state.tier6HatchLock && (crossedThreshold || (state.coreTier || 1) < 6)) {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
        const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
        if (typeof Tier6HatchSystem !== 'undefined') {
          Tier6HatchSystem.start(mMode, now);
        }
      } else {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (!allowHatch && typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
      }
    } else {
      if (state.coreTier >= 6 || c < 35) {
        if (c < 35) state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined' && c < 35) Tier6HatchSystem.cancel();
      }
      state.coreTier = nextTier;
      state.isOverdrive = (nextTier >= 4);
    }
    state.maxTierReached = Math.max(state.maxTierReached || 1, state.coreTier || 1);
    state.prevEvaluatedCombo = c;
  }""",
        """  // Centralized Combo -> Core Tier Progression Evaluator with One-Shot Tier VI (35x) & Tier VII (65x) Ascension Locks
  function evaluateCoreTierFromCombo(now = performance.now(), allowHatch = true) {
    const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
    const c = Number.isFinite(state.combo) ? state.combo : 0;
    const prevC = Number.isFinite(state.prevEvaluatedCombo) ? state.prevEvaluatedCombo : 0;

    if (!isCoreArcade) {
      if (c >= 28) { state.coreTier = 5; state.isOverdrive = true; }
      else if (c >= 21) { state.coreTier = 4; state.isOverdrive = true; }
      else if (c >= 14) { state.coreTier = 3; state.isOverdrive = false; }
      else if (c >= 7) { state.coreTier = 2; state.isOverdrive = false; }
      else { state.coreTier = 1; state.isOverdrive = false; }
      state.prevEvaluatedCombo = c;
      return;
    }

    const nextTier = (c >= 65) ? 7 : ((c >= 35) ? 6 : (c >= 28 ? 5 : (c >= 21 ? 4 : (c >= 14 ? 3 : (c >= 7 ? 2 : 1)))));
    if (nextTier === 7) {
      const crossedT7 = (prevC < 65 && c >= 65);
      state.tier6HatchLock = true;
      if (allowHatch && !state.tier7HatchLock && (crossedT7 || (state.coreTier || 1) < 7)) {
        state.tier7HatchLock = true;
        state.coreTier = 7;
        state.isOverdrive = true;
        if (typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 7;
        const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
        if (typeof Tier6HatchSystem !== 'undefined') {
          Tier6HatchSystem.start(mMode, now, 7);
        }
      } else {
        state.tier7HatchLock = true;
        state.coreTier = 7;
        state.isOverdrive = true;
        if (!allowHatch && typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 7;
      }
    } else if (nextTier === 6) {
      if (c < 65) state.tier7HatchLock = false;
      const crossedThreshold = (prevC < 35 && c >= 35);
      if (allowHatch && !state.tier6HatchLock && (crossedThreshold || (state.coreTier || 1) < 6)) {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
        const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
        if (typeof Tier6HatchSystem !== 'undefined') {
          Tier6HatchSystem.start(mMode, now, 6);
        }
      } else {
        state.tier6HatchLock = true;
        state.coreTier = 6;
        state.isOverdrive = true;
        if (!allowHatch && typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 6;
      }
    } else {
      if (c < 65) state.tier7HatchLock = false;
      if (state.coreTier >= 6 || c < 35) {
        if (c < 35) state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined' && c < 35) Tier6HatchSystem.cancel();
      }
      state.coreTier = nextTier;
      state.isOverdrive = (nextTier >= 4);
    }
    state.maxTierReached = Math.max(state.maxTierReached || 1, state.coreTier || 1);
    state.prevEvaluatedCombo = c;
  }""",
        "evaluateCoreTierFromCombo",
    )

    g = replace_once(
        g,
        """    let nextTitle = '';
    let nextSub = '';
    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      nextTitle = state.coreTier >= 6 ? 'CHROME DYNAMO · DYNAMO PRINCESS' : (state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Crystal Twin-Cannon Maiden · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Faraday Rail-Arc Core · Round ${state.currentRound || 1}`
          : `Faraday Singularity Core · Plasma Orbs · Offense Cannon [F] · Round ${state.currentRound || 1}`);
    } else if (state.gameType === 'helix') {
      nextTitle = state.coreTier >= 6 ? 'CHROME HELIX · HELIX UNICORN' : (state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Pearlescent Spiral Pegasus · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Twin-Helix Photonic Lance · Round ${state.currentRound || 1}`
          : `Harmonic Bio-Lattice Core · Nucleotide Pearls · Offense Cannon [F] · Round ${state.currentRound || 1}`);
    } else if (state.gameType === 'meteor') {
      nextTitle = state.coreTier >= 6 ? 'CHROME METEOR · METEOR DRAGON' : (state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR');
      nextSub = state.coreTier >= 6
        ? `👑 Tier VI Mythic Ascension · Hornless Caldera Wyrm · Round ${state.currentRound || 1}`
        : (state.coreTier === 5
          ? `⭐ Tier V Supreme Ascendant · Solar Mass-Driver Core · Round ${state.currentRound || 1}`
          : `Aegis Caldera Core · Molten Bolides · Offense Cannon [F] · Round ${state.currentRound || 1}`);""",
        """    let nextTitle = '';
    let nextSub = '';
    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME DYNAMO · CELESTIAL EMPRESS'
        : (state.coreTier >= 6 ? 'CHROME DYNAMO · DYNAMO PRINCESS' : (state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Sovereign Hand Mega-Cannon Empress · Round ${state.currentRound || 1}`
        : (state.coreTier >= 6
          ? `👑 Tier VI Mythic Ascension · Crystal Twin-Cannon Maiden · Round ${state.currentRound || 1}`
          : (state.coreTier === 5
            ? `⭐ Tier V Supreme Ascendant · Faraday Rail-Arc Core · Round ${state.currentRound || 1}`
            : `Faraday Singularity Core · Plasma Orbs · Offense Cannon [F] · Round ${state.currentRound || 1}`));
    } else if (state.gameType === 'helix') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME HELIX · SERAPHIC PEGASUS'
        : (state.coreTier >= 6 ? 'CHROME HELIX · HELIX UNICORN' : (state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Prismatic Horn-Laser Unicorn · Round ${state.currentRound || 1}`
        : (state.coreTier >= 6
          ? `👑 Tier VI Mythic Ascension · Pearlescent Spiral Pegasus · Round ${state.currentRound || 1}`
          : (state.coreTier === 5
            ? `⭐ Tier V Supreme Ascendant · Twin-Helix Photonic Lance · Round ${state.currentRound || 1}`
            : `Harmonic Bio-Lattice Core · Nucleotide Pearls · Offense Cannon [F] · Round ${state.currentRound || 1}`));
    } else if (state.gameType === 'meteor') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME METEOR · SOLAR WYRM SOVEREIGN'
        : (state.coreTier >= 6 ? 'CHROME METEOR · METEOR DRAGON' : (state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Inferno Breath Caldera Dragon · Round ${state.currentRound || 1}`
        : (state.coreTier >= 6
          ? `👑 Tier VI Mythic Ascension · Hornless Caldera Wyrm · Round ${state.currentRound || 1}`
          : (state.coreTier === 5
            ? `⭐ Tier V Supreme Ascendant · Solar Mass-Driver Core · Round ${state.currentRound || 1}`
            : `Aegis Caldera Core · Molten Bolides · Offense Cannon [F] · Round ${state.currentRound || 1}`));""",
        "updateHeaderUI.titles",
    )

    g = replace_once(
        g,
        """    // Advanced HUD: Tier, Pulse & Phase
    if (dom.tierVal && c.tierRaw !== state.coreTier) {
      c.tierRaw = state.coreTier;
      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e', 6: '#f472b6' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      if (!c.tierTitleSet) {
        c.tierTitleSet = true;
        const tierPillEl = document.getElementById('cgTierPill');
        if (tierPillEl) {
          tierPillEl.style.cursor = 'pointer';
          tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x Sovereign Overdrive), Tier V (28-34x Supreme Seraphic Ascendant), Tier VI (35x+ Mythic Cosmic Hatch — Click to Cycle Tier I→VI!)`;
          if (!tierPillEl._tierClickBound) {
            tierPillEl._tierClickBound = true;
            tierPillEl.addEventListener('click', (ev) => {
              ev.stopPropagation();
              const nextT = ((state.coreTier || 1) >= 6) ? 1 : ((state.coreTier || 1) + 1);
              const comboForTier = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 35 };
              state.combo = comboForTier[nextT] || 0;
              if (nextT < 6) state.tier6HatchLock = false;
              evaluateCoreTierFromCombo(performance.now(), true);
              updateHeaderUI();
            });
          }
        }
      }
    }""",
        """    // Advanced HUD: Tier, Pulse & Phase
    if (dom.tierVal && c.tierRaw !== state.coreTier) {
      c.tierRaw = state.coreTier;
      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e', 6: '#f472b6', 7: '#fde047' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      if (!c.tierTitleSet) {
        c.tierTitleSet = true;
        const tierPillEl = document.getElementById('cgTierPill');
        if (tierPillEl) {
          tierPillEl.style.cursor = 'pointer';
          tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x Sovereign Overdrive), Tier V (28-34x Supreme Seraphic Ascendant), Tier VI (35-64x Mythic Hatch), Tier VII (65x+ Celestial Apotheosis — Click to Cycle Tier I→VII!)`;
          if (!tierPillEl._tierClickBound) {
            tierPillEl._tierClickBound = true;
            tierPillEl.addEventListener('click', (ev) => {
              ev.stopPropagation();
              const nextT = ((state.coreTier || 1) >= 7) ? 1 : ((state.coreTier || 1) + 1);
              const comboForTier = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 35, 7: 65 };
              state.combo = comboForTier[nextT] || 0;
              if (nextT < 7) state.tier7HatchLock = false;
              if (nextT < 6) state.tier6HatchLock = false;
              evaluateCoreTierFromCombo(performance.now(), true);
              updateHeaderUI();
            });
          }
        }
      }
    }""",
        "updateHeaderUI.tierPill",
    )

    # All 3 tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 }; sites
    g = replace_n(
        g,
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 6) {""",
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 7) state.tier7HatchLock = false;
        if (state.coreTier < 6) {""",
        2,
        "damageByVoidbloom_and_damagePlayerCore_tierFloorCombo",
    )
    g = replace_n(
        g,
        """        state.coreTier = 1;
        state.combo = 0;
        state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();""",
        """        state.coreTier = 1;
        state.combo = 0;
        state.tier6HatchLock = false;
        state.tier7HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();""",
        2,
        "damageByVoidbloom_and_damagePlayerCore_reset",
    )

    g = replace_once(
        g,
        """    state.prevEvaluatedCombo = 1;
    state.tier6HatchLock = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();""",
        """    state.prevEvaluatedCombo = 1;
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();""",
        "startGame.tier7HatchLock",
    )
    g = replace_once(
        g,
        """    state.active = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    state.tier6HatchLock = false;""",
        """    state.active = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;""",
        "handleGameOver.tier7HatchLock",
    )
    g = replace_once(
        g,
        """      const cfg = REALM_DEBRIEF[rKey];
      const rnd = state.currentRound || 1;
      const peakTier = Math.max(state.maxTierReached || 1, state.coreTier || 1);
      const peakCombo = Math.max(state.maxComboReached || 1, state.combo || 1);
      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI' }[peakTier] || 'TIER I';""",
        """      const cfg = REALM_DEBRIEF[rKey];
      const rnd = state.currentRound || 1;
      const peakTier = Math.max(state.maxTierReached || 1, state.coreTier || 1);
      const peakCombo = Math.max(state.maxComboReached || 1, state.combo || 1);
      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI', 7: 'TIER VII' }[peakTier] || 'TIER I';
      const emblemSrc = (peakTier >= 7)
        ? `assets/core-${rKey}-t7-showcase.png?v=arcade421_tier7_celestial`
        : cfg.emblem;""",
        "handleGameOver.tierRoman",
    )
    g = replace_once(
        g,
        "if (realmEmbImg) realmEmbImg.src = cfg.emblem;",
        "if (realmEmbImg) realmEmbImg.src = emblemSrc;",
        "handleGameOver.emblemSrc",
    )
    g = replace_once(
        g,
        """    // The 5+1 Advanced Features State (Tiers I - VI)
    state.coreTier = 1; // Tier I, II, III, IV, V, VI
    state.tier6HatchLock = false;""",
        """    // The 5+2 Advanced Features State (Tiers I - VII)
    state.coreTier = 1; // Tier I, II, III, IV, V, VI, VII
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;""",
        "startReflexGame.tier7HatchLock",
    )

    g = replace_once(
        g,
        """            if (state.coreTier > 1) {
              state.coreTier--;
              const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28 };
              state.combo = tierFloorCombo[state.coreTier] || 0;
            } else {
              state.coreTier = 1;
              state.combo = 0;
            }""",
        """            if (state.coreTier > 1) {
              state.coreTier--;
              const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
              state.combo = tierFloorCombo[state.coreTier] || 0;
              if (state.coreTier < 7) state.tier7HatchLock = false;
              if (state.coreTier < 6) {
                state.tier6HatchLock = false;
                if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
              }
            } else {
              state.coreTier = 1;
              state.combo = 0;
              state.tier6HatchLock = false;
              state.tier7HatchLock = false;
            }""",
        "particleHazardHit.tierFloorCombo",
    )
    g = replace_once(
        g,
        """          if (state.coreTier > 1) {
            state.coreTier--;
            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
            state.combo = tierFloorCombo[state.coreTier] || 0;
            if (state.coreTier < 6) {
              state.tier6HatchLock = false;
              if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
            }
          } else {
            state.combo = 0;
            state.tier6HatchLock = false;
            if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
          }""",
        """          if (state.coreTier > 1) {
            state.coreTier--;
            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
            state.combo = tierFloorCombo[state.coreTier] || 0;
            if (state.coreTier < 7) state.tier7HatchLock = false;
            if (state.coreTier < 6) {
              state.tier6HatchLock = false;
              if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
            }
          } else {
            state.combo = 0;
            state.tier6HatchLock = false;
            state.tier7HatchLock = false;
            if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
          }""",
        "particleExitMiss.tierFloorCombo",
    )

    g = replace_once(
        g,
        """    setTier: (t, allowHatch = true) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 50;
      evaluateCoreTierFromCombo(performance.now(), allowHatch);""",
        """    setTier: (t, allowHatch = true) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 65;
      if ((Number(t) || 1) < 7) state.tier7HatchLock = false;
      if ((Number(t) || 1) < 6) state.tier6HatchLock = false;
      evaluateCoreTierFromCombo(performance.now(), allowHatch);""",
        "chromeSynapseGame.setTier",
    )
    g = replace_once(
        g,
        """          if (cParam >= 1 || (t >= 1 && t <= 6)) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50 };
              const targetC = (cParam >= 1) ? cParam : ((nextCombo[t] !== undefined) ? nextCombo[t] : 50);""",
        """          if (cParam >= 1 || (t >= 1 && t <= 7)) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
              const targetC = (cParam >= 1) ? cParam : ((nextCombo[t] !== undefined) ? nextCombo[t] : 65);""",
        "checkUrlAutoLaunch",
    )

    assert "arcade420_luxury_masterpiece" not in g, "Stale v420 tag remained!"
    open(GAME_PATH, "w", encoding="utf-8", newline="\n").write(g.replace("\n", nl))
    print("APPLIED_V421_TO_GAME_JS_OK")


if __name__ == "__main__":
    main()
