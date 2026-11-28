"""Apply v428: Tier VIII Apex Singularity (All 3 Realms — Solar Forge, Prism Rail, Royal Sapphire Cannons)."""
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
    geom["version"] = "v428_tier8_sovereign"
    geom["tierMaxTipXRef"]["8"] = 532
    geom["tier8Specs"] = {
        "meteor": {
            "name": "METEOR DRAGON",
            "title": "SOLAR FORGE EMPEROR",
            "width": 1024,
            "height": 682,
            "anchorX": 512,
            "anchorY": 268,
            "centerMuzzle": {"x": 512, "y": 12},
            "muzzleL": {"x": 404, "y": 26},
            "muzzleR": {"x": 620, "y": 26},
            "auxMuzzles": [{"x": 452, "y": 88}, {"x": 572, "y": 88}],
            "scaleMult": 1.24,
        },
        "helix": {
            "name": "HELIX UNICORN",
            "title": "PRISM RAIL SERAPH",
            "width": 1024,
            "height": 682,
            "anchorX": 512,
            "anchorY": 296,
            "centerMuzzle": {"x": 512, "y": 20},
            "muzzleL": {"x": 382, "y": 94},
            "muzzleR": {"x": 642, "y": 94},
            "auxMuzzles": [{"x": 446, "y": 148}, {"x": 578, "y": 148}],
            "scaleMult": 1.24,
        },
        "dynamo": {
            "name": "DYNAMO PRINCESS",
            "title": "ROYAL SAPPHIRE SOVEREIGN",
            "width": 1024,
            "height": 682,
            "anchorX": 512,
            "anchorY": 276,
            "centerMuzzle": {"x": 512, "y": 5},
            "muzzleL": {"x": 342, "y": 8},
            "muzzleR": {"x": 682, "y": 8},
            "auxMuzzles": [
                {"x": 258, "y": 60},
                {"x": 224, "y": 102},
                {"x": 248, "y": 148},
                {"x": 766, "y": 60},
                {"x": 800, "y": 102},
                {"x": 776, "y": 148},
            ],
            "scaleMult": 1.25,
        },
    }
    geom_path.write_text(json.dumps(geom, indent=2), encoding="utf-8")
    print("PATCHED -> assets/core-geometry-db.json")

    # 2. index.html, app.js, sw.js
    for fname in ("index.html", "app.js"):
        p = ROOT / fname
        txt = p.read_text(encoding="utf-8")
        assert "arcade427_t7_evolution_audio" in txt, f"{fname} missing arcade427_t7_evolution_audio"
        p.write_text(txt.replace("arcade427_t7_evolution_audio", "arcade428_tier8_sovereign"), encoding="utf-8")
        print(f"PATCHED -> {fname}")

    sw_path = ROOT / "sw.js"
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = replace_once(
        sw_txt,
        "'./assets/vfx-meteor-t7-snout-fg.png?v=arcade427_t7_evolution_audio',",
        """'./assets/vfx-meteor-t7-snout-fg.png?v=arcade428_tier8_sovereign',
  './assets/core-dynamo-t8.png?v=arcade428_tier8_sovereign',
  './assets/core-dynamo-t8-body.png?v=arcade428_tier8_sovereign',
  './assets/core-dynamo-t8-guns.png?v=arcade428_tier8_sovereign',
  './assets/core-dynamo-t8-showcase.png?v=arcade428_tier8_sovereign',
  './assets/core-helix-t8.png?v=arcade428_tier8_sovereign',
  './assets/core-helix-t8-body.png?v=arcade428_tier8_sovereign',
  './assets/core-helix-t8-guns.png?v=arcade428_tier8_sovereign',
  './assets/core-helix-t8-showcase.png?v=arcade428_tier8_sovereign',
  './assets/core-meteor-t8.png?v=arcade428_tier8_sovereign',
  './assets/core-meteor-t8-body.png?v=arcade428_tier8_sovereign',
  './assets/core-meteor-t8-guns.png?v=arcade428_tier8_sovereign',
  './assets/core-meteor-t8-showcase.png?v=arcade428_tier8_sovereign',""",
        "sw.js add Tier VIII assets",
    )
    sw_txt = sw_txt.replace("arcade427_t7_evolution_audio", "arcade428_tier8_sovereign")
    sw_path.write_text(sw_txt, encoding="utf-8")
    print("PATCHED -> sw.js")

    g_path = ROOT / "game.js"
    g = g_path.read_text(encoding="utf-8")

    # 3. Audio: playTier8Ascension + Tier VIII primary weapon boost (zero sawtooth for Dynamo)
    g = replace_once(
        g,
        """      this._vibrate([30, 25, 65, 25, 95]);
    }

    playPhaseSwitch() {""",
        """      this._vibrate([30, 25, 65, 25, 95]);
    }

    // === ADDED (v428): Grand 9-Note Imperial Sovereign Ascension Fanfare (Tier VII -> Tier VIII) ===
    playTier8Ascension(mode = 'dynamo') {
      if (this.isMuted) return;
      this.init();
      try {
        const ac = this.ctx;
        const t0 = ac.currentTime;
        const root = (mode === 'meteor') ? 220.00 : (mode === 'helix' ? 261.63 : 246.94);
        const ratios = [1.0, 1.25, 1.5, 1.875, 2.0, 2.5, 3.0, 3.75, 4.0];
        ratios.forEach((r, idx) => {
          const nt = t0 + 0.06 + idx * 0.068;
          const o = ac.createOscillator();
          const g = ac.createGain();
          o.type = (idx % 2 === 0) ? 'triangle' : 'sine';
          o.frequency.setValueAtTime(root * r, nt);
          g.gain.setValueAtTime(0.001, nt);
          g.gain.linearRampToValueAtTime(0.16, nt + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0008, nt + 0.72);
          o.connect(g);
          g.connect(ac.destination);
          o.start(nt);
          o.stop(nt + 0.75);
        });
      } catch (e) {}
      this._vibrate([35, 20, 70, 20, 110]);
    }

    playPhaseSwitch() {""",
        "playTier8Ascension",
    )

    g = replace_once(
        g,
        "const pitchBoost = 1 + (Math.min(7, tier) - 1) * 0.045;",
        "const pitchBoost = 1 + (Math.min(8, tier) - 1) * 0.045;",
        "playCoreCannonShot pitchBoost",
    )

    g = replace_once(
        g,
        """          // ASTRAL-TESLA CRYSTALLINE PLASMA (Dynamo v427, Tiers I-VII): FM crystalline snap + royal fifth/octave harmonic + Tier sub-punch + 2-tap Lichtenberg crackle
          const tClamp = Math.max(1, Math.min(7, Number(tier) || 1));
          const tNorm = (tClamp - 1) / 6;""",
        """          // ASTRAL-TESLA CRYSTALLINE PLASMA (Dynamo v428, Tiers I-VIII): FM crystalline snap + royal fifth/octave/overtone harmonic + Tier sub-punch + 2-tap Lichtenberg crackle
          const tClamp = Math.max(1, Math.min(8, Number(tier) || 1));
          const tNorm = (tClamp - 1) / 7;""",
        "Dynamo audio clamp to T8",
    )

    g = replace_once(
        g,
        """          if (tClamp >= 6) {
            harmonics.push({ freq: fRoot * 2.004, type: 'sine', vol: 0.024 });
          }""",
        """          if (tClamp >= 6) {
            harmonics.push({ freq: fRoot * 2.004, type: 'sine', vol: 0.024 });
          }
          if (tClamp >= 8) {
            harmonics.push({ freq: fRoot * 2.502, type: 'sine', vol: 0.020 });
          }""",
        "Dynamo T8 crystal overtone",
    )

    g = replace_once(
        g,
        """            const subStart = (tClamp >= 7) ? 162 : 195;
            const subEnd = (tClamp >= 7) ? 56 : 78;
            const subDur = 0.075 + ((tClamp >= 7) ? 0.035 : 0);
            const subVol = (tClamp >= 7) ? 0.095 : ((tClamp >= 6) ? 0.072 : 0.055);""",
        """            const subStart = (tClamp >= 8) ? 140 : ((tClamp >= 7) ? 162 : 195);
            const subEnd = (tClamp >= 8) ? 48 : ((tClamp >= 7) ? 56 : 78);
            const subDur = 0.075 + ((tClamp >= 8) ? 0.048 : ((tClamp >= 7) ? 0.035 : 0));
            const subVol = (tClamp >= 8) ? 0.112 : ((tClamp >= 7) ? 0.095 : ((tClamp >= 6) ? 0.072 : 0.055));""",
        "Dynamo T8 sub-punch",
    )

    # 4. Geometry DB & TIER8_SPECS
    g = replace_once(
        g,
        """    tipXRef: { 1: 168, 2: 256, 3: 336, 4: 416, 5: 496, 6: 516, 7: 524 },
    halfTopRef: { 1: 215, 2: 215, 3: 215, 4: 245, 5: 270, 6: 315, 7: 328 },
    halfBotRef: { 1: 215, 2: 215, 3: 215, 4: 235, 5: 260, 6: 435, 7: 445 }""",
        """    tipXRef: { 1: 168, 2: 256, 3: 336, 4: 416, 5: 496, 6: 516, 7: 524, 8: 532 },
    halfTopRef: { 1: 215, 2: 215, 3: 215, 4: 245, 5: 270, 6: 315, 7: 328, 8: 355 },
    halfBotRef: { 1: 215, 2: 215, 3: 215, 4: 235, 5: 260, 6: 435, 7: 445, 8: 460 }""",
        "CORE_GEOMETRY_DB T8 refs",
    )

    g = replace_once(
        g,
        """  const CoreGeometryDB = {
    data: null,
    TIER6_SPECS,
    TIER7_SPECS,""",
        """  // Verified pixel anchors, primary/shoulder muzzles & auxiliary accelerator pods on 1024x682 Tier VIII PNGs
  const TIER8_SPECS = {
    meteor: {
      name: 'METEOR DRAGON',
      title: 'SOLAR FORGE EMPEROR',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 268,
      centerMuzzle: { x: 512, y: 12 },
      muzzleL: { x: 404, y: 26 },
      muzzleR: { x: 620, y: 26 },
      auxMuzzles: [{ x: 452, y: 88 }, { x: 572, y: 88 }],
      scaleMult: 1.24
    },
    helix: {
      name: 'HELIX UNICORN',
      title: 'PRISM RAIL SERAPH',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 296,
      centerMuzzle: { x: 512, y: 20 },
      muzzleL: { x: 382, y: 94 },
      muzzleR: { x: 642, "y": 94 },
      auxMuzzles: [{ x: 446, y: 148 }, { x: 578, y: 148 }],
      scaleMult: 1.24
    },
    dynamo: {
      name: 'DYNAMO PRINCESS',
      title: 'ROYAL SAPPHIRE SOVEREIGN',
      width: 1024,
      height: 682,
      anchorX: 512,
      anchorY: 276,
      centerMuzzle: { x: 512, y: 5 },
      muzzleL: { x: 342, y: 8 },
      muzzleR: { x: 682, y: 8 },
      auxMuzzles: [
        { x: 258, y: 60 },
        { x: 224, y: 102 },
        { x: 248, y: 148 },
        { x: 766, y: 60 },
        { x: 800, y: 102 },
        { x: 776, y: 148 }
      ],
      scaleMult: 1.25
    }
  };

  const CoreGeometryDB = {
    data: null,
    TIER6_SPECS,
    TIER7_SPECS,
    TIER8_SPECS,""".replace('muzzleR: { x: 642, "y": 94 },', 'muzzleR: { x: 642, y: 94 },'),
        "TIER8_SPECS definition",
    )

    g = replace_once(
        g,
        """          for (let t = 1; t <= 7; t++) {""",
        """          for (let t = 1; t <= 8; t++) {""",
        "CoreGeometryDB.load loop T8",
    )

    g = replace_once(
        g,
        """          if (json.tier7Specs) {
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
      const tCur = Math.max(1, Math.min(7, Number.isFinite(tier) ? tier : 1));""",
        """          if (json.tier7Specs) {
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
          if (json.tier8Specs) {
            ['meteor', 'helix', 'dynamo'].forEach((m) => {
              const s = json.tier8Specs[m];
              if (s && TIER8_SPECS[m]) {
                if (typeof s.anchorX === 'number') TIER8_SPECS[m].anchorX = s.anchorX;
                if (typeof s.anchorY === 'number') TIER8_SPECS[m].anchorY = s.anchorY;
                if (s.centerMuzzle) TIER8_SPECS[m].centerMuzzle = s.centerMuzzle;
                if (s.muzzleL) TIER8_SPECS[m].muzzleL = s.muzzleL;
                if (s.muzzleR) TIER8_SPECS[m].muzzleR = s.muzzleR;
                if (Array.isArray(s.auxMuzzles)) TIER8_SPECS[m].auxMuzzles = s.auxMuzzles;
                if (typeof s.scaleMult === 'number') TIER8_SPECS[m].scaleMult = s.scaleMult;
              }
            });
          }
        })
        .catch(() => {});
    },
    _interpMetric(map, tierVal) {
      const c = Math.max(1, Math.min(8, Number.isFinite(tierVal) ? tierVal : 1));
      const lo = Math.floor(c);
      const hi = Math.min(8, lo + 1);
      const frac = c - lo;
      return map[lo] + (map[hi] - map[lo]) * frac;
    },
    computeCoreMetrics(canvasW, canvasH, tier, isTouchMode, customScale = null) {
      const w = Math.max(240, canvasW || 1280);
      const h = Math.max(240, canvasH || 720);
      const isMobile = isTouchMode || w < 600;
      const baseDrawW = isMobile ? Math.min(w * 0.80, 340) : Math.min(w * 0.64, 780);
      let u = customScale || (baseDrawW / 1376.0);
      const tCur = Math.max(1, Math.min(8, Number.isFinite(tier) ? tier : 1));""",
        "CoreGeometryDB tier8Specs & clamps",
    )

    g = replace_once(
        g,
        """      return {
        center: toWorld(lay.spec.centerMuzzle),
        left: toWorld(lay.spec.muzzleL),
        right: toWorld(lay.spec.muzzleR),
        layout: lay
      };
    },
    clampCatcherPosition(""",
        """      return {
        center: toWorld(lay.spec.centerMuzzle),
        left: toWorld(lay.spec.muzzleL),
        right: toWorld(lay.spec.muzzleR),
        layout: lay
      };
    },
    getTier8DrawLayout(mode, u) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const spec = TIER8_SPECS[mKey] || TIER8_SPECS.dynamo;
      const scale = (68.0 / 150.0) * u * (spec.scaleMult || 1.24);
      return {
        spec,
        scale,
        drawW: spec.width * scale,
        drawH: spec.height * scale,
        anchorOffX: spec.anchorX * scale,
        anchorOffY: spec.anchorY * scale
      };
    },
    getTier8Muzzles(mode, u, cx, cy, bankAngle = 0) {
      const lay = this.getTier8DrawLayout(mode, u);
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
        aux: (lay.spec.auxMuzzles || []).map(toWorld),
        layout: lay
      };
    },
    clampCatcherPosition(""",
        "CoreGeometryDB getTier8DrawLayout & getTier8Muzzles",
    )

    # 5. LayeredT4Assets preloads T8
    g = replace_once(
        g,
        """    coreT7Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
        """    coreT7Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT7Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT8Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT8Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT8Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
        "LayeredT4Assets T8 dicts",
    )

    g = replace_once(
        g,
        """      coreT7Body: { dynamo: false, helix: false, meteor: false },
      coreT7Guns: { dynamo: false, helix: false, meteor: false },
      coreT7Showcase: { dynamo: false, helix: false, meteor: false },""",
        """      coreT7Body: { dynamo: false, helix: false, meteor: false },
      coreT7Guns: { dynamo: false, helix: false, meteor: false },
      coreT7Showcase: { dynamo: false, helix: false, meteor: false },
      coreT8Body: { dynamo: false, helix: false, meteor: false },
      coreT8Guns: { dynamo: false, helix: false, meteor: false },
      coreT8Showcase: { dynamo: false, helix: false, meteor: false },""",
        "LayeredT4Assets.loaded T8",
    )

    g = replace_once(
        g,
        """    LayeredT4Assets.coreT7Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT7Showcase[m] = true; };
    LayeredT4Assets.coreT7Showcase[m].src = `assets/core-${m}-t7-showcase.png?v=arcade427_t7_evolution_audio`;

    for (let t = 1; t <= 7; t++) {""",
        """    LayeredT4Assets.coreT7Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT7Showcase[m] = true; };
    LayeredT4Assets.coreT7Showcase[m].src = `assets/core-${m}-t7-showcase.png?v=arcade428_tier8_sovereign`;

    LayeredT4Assets.coreT8Body[m].onload = () => { LayeredT4Assets.loaded.coreT8Body[m] = true; };
    LayeredT4Assets.coreT8Body[m].src = `assets/core-${m}-t8-body.png?v=arcade428_tier8_sovereign`;

    LayeredT4Assets.coreT8Guns[m].onload = () => { LayeredT4Assets.loaded.coreT8Guns[m] = true; };
    LayeredT4Assets.coreT8Guns[m].src = `assets/core-${m}-t8-guns.png?v=arcade428_tier8_sovereign`;

    LayeredT4Assets.coreT8Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT8Showcase[m] = true; };
    LayeredT4Assets.coreT8Showcase[m].src = `assets/core-${m}-t8-showcase.png?v=arcade428_tier8_sovereign`;

    for (let t = 1; t <= 8; t++) {""",
        "LayeredT4Assets T8 preload loop",
    )

    # 6. Shield tierBoost for T8
    g = replace_once(
        g,
        "const tierBoost = (tier >= 7) ? 1.32 : ((tier >= 6) ? 1.26 : 1.0);",
        "const tierBoost = (tier >= 8) ? 1.44 : ((tier >= 7) ? 1.32 : ((tier >= 6) ? 1.26 : 1.0));",
        "Shield tierBoost T8",
    )

    # 7. Tier6HatchSystem: support Direct Tier VII -> Tier VIII Evolution & Banner
    g = replace_once(
        g,
        """    start(mode, now, targetTier = 6) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const tgt = (targetTier >= 7) ? 7 : 6;
      this.targetTier = tgt;
      if (tgt >= 7) {
        // Direct Tier VI -> Tier VII Celestial Evolution: NEVER revert to or capture an egg!
        this.eggCanvas = null;
        this.wedges = [];
      } else {
        this._initFractures();
        this._captureEggSnapshot(mKey, now, 5);
      }
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
        """    start(mode, now, targetTier = 6) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const tgt = (targetTier >= 8) ? 8 : ((targetTier >= 7) ? 7 : 6);
      this.targetTier = tgt;
      if (tgt >= 7) {
        // Direct Tier VI -> VII -> VIII Celestial Evolution: NEVER revert to or capture an egg!
        this.eggCanvas = null;
        this.wedges = [];
      } else {
        this._initFractures();
        this._captureEggSnapshot(mKey, now, 5);
      }
      this._seedParticles(mKey);
      this.active = true;
      this.mode = mKey;
      this.startTime = now;
      this.bannerUntil = now + this.BANNER_END_MS;
      state.globalScreenShake = Math.max(state.globalScreenShake || 0, tgt >= 8 ? 18 : (tgt >= 7 ? 14 : 11));
      if (tgt >= 8 && typeof audio !== 'undefined' && audio.playTier8Ascension) {
        audio.playTier8Ascension(mKey);
      } else if (tgt >= 7 && typeof audio !== 'undefined' && audio.playTier7Ascension) {
        audio.playTier7Ascension(mKey);
      } else if (typeof audio !== 'undefined' && audio.playTier6Hatch) {
        audio.playTier6Hatch(mKey);
      }
    },""",
        "Tier6HatchSystem.start support T8",
    )

    g = replace_once(
        g,
        "    _renderTier7Evolution(ctx, mKey, u, now, elapsed) {",
        "    _renderTier7Evolution(ctx, mKey, u, now, elapsed, tgtTier = 7) {\n      const isT8 = tgtTier >= 8;",
        "_renderTier7Evolution signature T8",
    )
    g = replace_once(
        g,
        """        QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';""",
        """        if (isT8) QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false);
        else QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';""",
        "_renderTier7Evolution Phase 1 outgoing T7->T8",
    )
    g = replace_once(
        g,
        """          QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);
          ctx.restore();
        }

        // Incoming Tier VII Sovereign materializes in-place with back-ease unfurl
        if (p2 >= 0.12) {
          const pIn = Math.max(0, Math.min(1, (p2 - 0.12) / 0.70));
          const inScale = 0.86 + 0.14 * this._easeOutBack(pIn);
          ctx.save();
          ctx.scale(inScale, inScale);
          ctx.globalAlpha = Math.min(1, pIn * 1.65);
          QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pIn, settleProgress: 0.5 });
          ctx.restore();
        }""",
        """          if (isT8) QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false);
          else QuantumRenderer._drawTier6Character(ctx, mKey, 0, 0, u, now, false);
          ctx.restore();
        }

        // Incoming Sovereign (Tier VII or Tier VIII) materializes in-place with back-ease unfurl
        if (p2 >= 0.12) {
          const pIn = Math.max(0, Math.min(1, (p2 - 0.12) / 0.70));
          const inScale = 0.86 + 0.14 * this._easeOutBack(pIn);
          ctx.save();
          ctx.scale(inScale, inScale);
          ctx.globalAlpha = Math.min(1, pIn * 1.65);
          if (isT8) {
            QuantumRenderer._drawTier8Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pIn, settleProgress: 0.5 });
          } else {
            QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: pIn, settleProgress: 0.5 });
          }
          ctx.restore();
        }""",
        "_renderTier7Evolution Phase 2 morph T7->T8",
    )
    g = replace_once(
        g,
        """        QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: 1, settleProgress: p3 });
        ctx.restore();
      }
    },

    render(ctx, mode, cx, cy, u, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const elapsed = Math.max(0, now - this.startTime);

      ctx.save();
      ctx.translate(cx, cy);

      if (this.targetTier >= 7) {
        this._renderTier7Evolution(ctx, mKey, u, now, elapsed);
        ctx.restore();
        return;
      }""",
        """        if (isT8) {
          QuantumRenderer._drawTier8Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: 1, settleProgress: p3 });
        } else {
          QuantumRenderer._drawTier7Character(ctx, mKey, 0, 0, u, now, false, { revealProgress: 1, settleProgress: p3 });
        }
        ctx.restore();
      }
    },

    render(ctx, mode, cx, cy, u, now) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const elapsed = Math.max(0, now - this.startTime);

      ctx.save();
      ctx.translate(cx, cy);

      if (this.targetTier >= 7) {
        this._renderTier7Evolution(ctx, mKey, u, now, elapsed, this.targetTier);
        ctx.restore();
        return;
      }""",
        "_renderTier7Evolution Phase 3 & dispatch T8",
    )

    g = replace_once(
        g,
        """      const riseY = -98 * u - bProg * 20 * u;
      const isT7Banner = (this.targetTier >= 7);
      const spec = (isT7Banner ? TIER7_SPECS[this.mode] : TIER6_SPECS[this.mode]) || TIER6_SPECS.dynamo;
      const bannerLabel = isT7Banner ? `TIER VII · ${spec.title || spec.name}` : `TIER VI · ${spec.name}`;
      const col = isT7Banner ? '#fde047' : ((this.mode === 'meteor') ? '#fbbf24' : (this.mode === 'helix' ? '#67e8f9' : '#e879f9'));

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fSize = Math.max(15, Math.round((isT7Banner ? 24 : 22) * Math.max(0.75, u)));""",
        """      const riseY = -98 * u - bProg * 20 * u;
      const isT8Banner = (this.targetTier >= 8);
      const isT7Banner = (this.targetTier === 7);
      const spec = (isT8Banner ? TIER8_SPECS[this.mode] : (isT7Banner ? TIER7_SPECS[this.mode] : TIER6_SPECS[this.mode])) || TIER6_SPECS.dynamo;
      const bannerLabel = isT8Banner
        ? `TIER VIII · ${spec.title || spec.name}`
        : (isT7Banner ? `TIER VII · ${spec.title || spec.name}` : `TIER VI · ${spec.name}`);
      const col = isT8Banner ? '#a5f3fc' : (isT7Banner ? '#fde047' : ((this.mode === 'meteor') ? '#fbbf24' : (this.mode === 'helix' ? '#67e8f9' : '#e879f9')));

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fSize = Math.max(15, Math.round((isT8Banner ? 26 : (isT7Banner ? 24 : 22)) * Math.max(0.75, u)));""",
        "Tier6HatchSystem.renderBanner T8",
    )

    # 8. QuantumRenderer: _tier8RigCache, _getTier8ArticulatedRig, _drawTier8Character, and routing
    g = replace_once(
        g,
        "    _tier7RigCache: {},",
        "    _tier7RigCache: {},\n    _tier8RigCache: {},",
        "QuantumRenderer._tier8RigCache",
    )

    g = replace_once(
        g,
        """    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor — Tiers I through VII)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null, isPortalPreview = false, skipHatchOverride = false) {
      const tierIdx = Math.min(7, Math.max(1, tier | 0));""",
        """    _getTier8ArticulatedRig(mKey) {
      const bodySpr = LayeredT4Assets.coreT8Body && LayeredT4Assets.coreT8Body[mKey];
      const bodyOk = !!(LayeredT4Assets.loaded.coreT8Body && LayeredT4Assets.loaded.coreT8Body[mKey] && bodySpr && bodySpr.naturalWidth > 0);
      const gunsSpr = LayeredT4Assets.coreT8Guns && LayeredT4Assets.coreT8Guns[mKey];
      const gunsOk = !!(LayeredT4Assets.loaded.coreT8Guns && LayeredT4Assets.loaded.coreT8Guns[mKey] && gunsSpr && gunsSpr.naturalWidth > 0);
      const cached = this._tier8RigCache[mKey];
      if (cached && cached.hasSplitLayers === (bodyOk && gunsOk)) return cached;

      if (!bodyOk || !bodySpr) return null;
      const spr = bodySpr;
      const W = 1024, H = 682;
      const cfgMap = {
        dynamo: { seamL: 368, seamR: 656, seamBotY: 420, gunPivot: { x: 512, y: 185 }, headY: 180, flapAmp: 34, tailAmp: 20 },
        helix:  { seamL: 444, seamR: 580, seamBotY: 410, gunPivot: { x: 512, y: 196 }, headY: 175, flapAmp: 36, tailAmp: 21 },
        meteor: { seamL: 434, seamR: 590, seamBotY: 412, gunPivot: { x: 512, y: 178 }, headY: 120, flapAmp: 38, tailAmp: 21 }
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
      this._tier8RigCache[mKey] = rig;
      return rig;
    },

    // Playable Tier VIII Apex Singularity 3D Volumetric In-Game Model Renderer
    _drawTier8Character(ctx, mode, cx, cy, u, now, isPortalPreview = false, opts = null) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const rig = this._getTier8ArticulatedRig(mKey);
      if (!rig || !rig.body) {
        this._drawTier7Character(ctx, mode, cx, cy, u, now, isPortalPreview, opts);
        return;
      }

      const lay = CoreGeometryDB.getTier8DrawLayout(mKey, u);
      const scale = lay.scale;
      const ancX = lay.spec.anchorX;
      const ancY = lay.spec.anchorY;
      const motionMult = _prefersReducedMotion ? 0.25 : 1.0;
      const bank = isPortalPreview ? (Math.sin(now * 0.0019) * 0.03) : ((CoreKinematics.bodyBank || 0) * 0.42);
      const pitchCompY = isPortalPreview ? 1.0 : (1.0 - Math.abs(CoreKinematics.pitchAngle || 0) * 0.16);
      const levY = Math.sin(now * 0.0038) * 3.6 * u * motionMult;
      const breath = 1.0 + Math.sin(now * 0.0046) * 0.016 * motionMult;
      const vxNorm = isPortalPreview ? Math.sin(now * 0.0015) * 0.25 : Math.max(-1.0, Math.min(1.0, (CoreKinematics.vx || 0) * 0.052));
      const bankCompressX = Math.max(0.88, 1.0 - Math.abs(bank) * 0.24);

      const pRev = (opts && typeof opts.revealProgress === 'number') ? Math.max(0, Math.min(1, opts.revealProgress)) : 1.0;
      const easeRev = 1.0 - Math.pow(1.0 - pRev, 3);
      const isUltActive = Boolean(!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.activeNova && SkillSystem.activeNova.mode === mKey);

      const flapFreq = (isUltActive ? 0.011 : 0.0056) * motionMult;
      const flapPhase = now * flapFreq;
      const flapSin = Math.sin(flapPhase);
      const flapCos = Math.cos(flapPhase);
      const tailPhase = now * 0.0058 * motionMult;

      const gunRecoil = (!isPortalPreview && typeof SkillSystem !== 'undefined' && SkillSystem.gunRecoil) ? SkillSystem.gunRecoil : 0;
      const aimYaw = (!isPortalPreview && CoreKinematics.lockOnProximity > 0.1)
        ? Math.max(-0.18, Math.min(0.18, (CoreKinematics.lockOnDX || 0) * 0.0016))
        : (vxNorm * 0.05);
      const recGun = gunRecoil * 14.0 * (0.9 + 0.2 * Math.sin(now * 0.06));

      ctx.save();
      ctx.translate(cx, cy + levY);
      ctx.rotate(bank);
      ctx.scale(breath * bankCompressX, (2.0 - breath * 0.99) * pitchCompY);

      // 1. Z-Sorted Back Halves of Quadruple 3D Apex Gyroscopic Astrolabe Rings + 4 Far-Side Spheres
      const ultRamp3d = isUltActive ? Math.min(1, (now - SkillSystem.activeNova.startAt) / 220) : 0;
      const ringRx = 124 * u * (1.0 + 0.08 * ultRamp3d);
      const ringRy = 38 * u * (1.0 + 0.08 * ultRamp3d);
      const ringY = 12 * u;
      const gyroTiltA = 0.20 + Math.sin(now * 0.0015) * 0.06 * motionMult;
      const gyroTiltB = -0.19 + Math.cos(now * 0.0013) * 0.05 * motionMult;
      const gyroTiltC = 0.07 * Math.sin(now * 0.0022) * motionMult;
      const gyroTiltD = -0.08 * Math.cos(now * 0.0025) * motionMult;
      const orbSpr = this._getGlowSprite(mKey === 'meteor' ? 'gold' : (mKey === 'helix' ? 'helix' : 'cyan'));

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      // Ring A (back)
      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.46)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.46)' : 'rgba(165, 243, 252, 0.48)');
      ctx.lineWidth = Math.max(2.4, 4.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.68)';
      ctx.lineWidth = Math.max(1.2, 1.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      for (let sIdx = 0; sIdx < 4; sIdx++) {
        const th = (now * 0.0034 + sIdx * (Math.PI * 0.5)) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT < 0 && orbSpr) {
          const zSc = 0.58 + 0.36 * (1.0 + sinT);
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 16 * u * zSc;
          ctx.globalAlpha = 0.58 * zSc;
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
        }
      }
      ctx.restore();

      // Ring B (back)
      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(239, 68, 68, 0.38)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.38)' : 'rgba(59, 130, 246, 0.42)');
      ctx.lineWidth = Math.max(1.2, 1.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.90, ringRy * 0.90, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring C (back dashed orbit)
      ctx.save();
      ctx.rotate(gyroTiltC);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.34)';
      ctx.setLineDash([12 * u, 7 * u]);
      ctx.lineDashOffset = -now * 0.036;
      ctx.lineWidth = Math.max(1.1, 1.5 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.12, ringRy * 1.10, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ring D (outer sovereign horizon ring)
      ctx.save();
      ctx.rotate(gyroTiltD);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.28)' : 'rgba(165, 243, 252, 0.32)';
      ctx.lineWidth = Math.max(1.0, 1.4 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.22, ringRy * 1.18, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // 1B. Volumetric Z-Depth Drop Shadow Silhouette
      if (rig.layers3d && rig.layers3d.shadowSil) {
        ctx.save();
        const shX = (-vxNorm * 14 + 8) * u;
        const shY = (16 + flapSin * 4.0) * u;
        ctx.globalAlpha = 0.50;
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
        const baseSpec = Math.max(0.14, flapCos * 0.18) + (isUltActive ? 0.22 : 0.10);
        const leftWeight = Math.min(0.88, Math.max(0.12, baseSpec + Math.max(0, -vxNorm) * 0.44 + Math.max(0, -flapSin) * 0.14));
        const rightWeight = Math.min(0.88, Math.max(0.12, baseSpec + Math.max(0, vxNorm) * 0.44 + Math.max(0, flapSin) * 0.14));
        ctx.globalAlpha = leftWeight;
        ctx.drawImage(rig.layers3d.rimLeft, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.globalAlpha = rightWeight;
        ctx.drawImage(rig.layers3d.rimRight, -ancX * scale, -ancY * scale, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 3. Deployed Unified Ultimate Hardware Layer (Strictly Hidden When Idle!)
      const s2Deploy = Boolean(!isPortalPreview && state.tier6Skill2CastUntil && now < state.tier6Skill2CastUntil);
      const isT8UltCast = Boolean(isUltActive && SkillSystem.activeNova && SkillSystem.activeNova.isTier6);
      const gunDeployAlpha = isPortalPreview ? 0 : Math.max(state.gunDeployT || 0, (s2Deploy || isT8UltCast) ? 1.0 : 0);
      if (gunDeployAlpha > 0.02 && rig.guns) {
        const emergeDrop = (1.0 - gunDeployAlpha) * 22.0;
        const gAlpha = Math.min(1.0, gunDeployAlpha * 1.40);
        const piv = rig.cfg.gunPivot || { x: 512, y: 185 };
        ctx.save();
        ctx.globalAlpha *= gAlpha;
        ctx.translate((piv.x - ancX) * scale, (piv.y - ancY + recGun + emergeDrop) * scale);
        ctx.rotate(aimYaw * 0.45);
        ctx.drawImage(rig.guns, -piv.x * scale, -piv.y * scale, rig.W * scale, rig.H * scale);
        ctx.restore();
      }

      // 4. Z-Sorted Front Halves of Quadruple 3D Gyroscopic Rings + 4 Near-Side Orbiting Spheres
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, ringY);

      ctx.save();
      ctx.rotate(gyroTiltA);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.70)' : (mKey === 'helix' ? 'rgba(103, 232, 249, 0.70)' : 'rgba(165, 243, 252, 0.74)');
      ctx.lineWidth = Math.max(2.0, 3.8 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI);
      ctx.stroke();
      for (let sIdx = 0; sIdx < 4; sIdx++) {
        const th = (now * 0.0034 + sIdx * (Math.PI * 0.5)) % (Math.PI * 2);
        const sinT = Math.sin(th);
        if (sinT >= 0 && orbSpr) {
          const zSc = 0.90 + 0.30 * sinT;
          const ox = Math.cos(th) * ringRx;
          const oy = sinT * ringRy;
          const sr = 16 * u * zSc;
          ctx.globalAlpha = 0.88;
          ctx.drawImage(orbSpr, ox - sr, oy - sr, sr * 2, sr * 2);
        }
      }
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltB);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(251, 146, 60, 0.56)' : (mKey === 'helix' ? 'rgba(244, 114, 182, 0.56)' : 'rgba(59, 130, 246, 0.62)');
      ctx.lineWidth = Math.max(1.4, 2.2 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.90, ringRy * 0.90, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltC);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.44)';
      ctx.setLineDash([12 * u, 7 * u]);
      ctx.lineDashOffset = -now * 0.036;
      ctx.lineWidth = Math.max(1.1, 1.5 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.12, ringRy * 1.10, 0, 0, Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.save();
      ctx.rotate(gyroTiltD);
      ctx.strokeStyle = mKey === 'meteor' ? 'rgba(253, 224, 71, 0.40)' : 'rgba(165, 243, 252, 0.44)';
      ctx.lineWidth = Math.max(1.1, 1.6 * u);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 1.22, ringRy * 1.18, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      ctx.restore();
    },

    // Master Multi-Layered Chrome Core Renderer (Dynamo, Helix, Meteor — Tiers I through VIII)
    _drawLayeredWingedCore(ctx, mode, cx, cy, now, tier = 4, customScale = null, isPortalPreview = false, skipHatchOverride = false) {
      const tierIdx = Math.min(8, Math.max(1, tier | 0));""",
        "QuantumRenderer._drawTier8Character & routing",
    )

    g = replace_once(
        g,
        """        if (tierIdx >= 7) {
          this._drawTier7Character(ctx, mode, cx, cy, u, now, isPortalPreview);""",
        """        if (tierIdx >= 8) {
          this._drawTier8Character(ctx, mode, cx, cy, u, now, isPortalPreview);
          if (!isPortalPreview) {
            const activeShield8 = state.getBuff ? state.getBuff('shield', now) : (state.activeBuff?.type === 'shield' ? state.activeBuff : null);
            if (activeShield8 && activeShield8.expiresAt > now) {
              CoreKinematics.drawAegisForcefield(ctx, cx, cy, u, now, activeShield8.expiresAt - now, mode);
            }
            Tier6HatchSystem.renderBanner(ctx, cx, cy, u, now);
          }
          return;
        }
        if (tierIdx >= 7) {
          this._drawTier7Character(ctx, mode, cx, cy, u, now, isPortalPreview);""",
        "_drawLayeredWingedCore tierIdx >= 8 branch",
    )

    # 9. Touch & Joystick Showcases, Skill 2/3 muzzles, Debrief Showcase -> T8
    g = replace_once(
        g,
        """        const src = curTier >= 7
          ? `assets/core-${m}-t7-showcase.png?v=arcade427_t7_evolution_audio`""",
        """        const src = curTier >= 8
          ? `assets/core-${m}-t8-showcase.png?v=arcade428_tier8_sovereign`
          : (curTier >= 7
          ? `assets/core-${m}-t7-showcase.png?v=arcade428_tier8_sovereign`""",
        "_buildTouchPadArtwork T8",
    )
    g = replace_once(
        g,
        """          : (curTier >= 6
            ? `assets/core-${m}-t6-showcase.png?v=arcade427_t7_evolution_audio`
            : `assets/core-${m}-t5.png?v=arcade427_t7_evolution_audio`);""",
        """          : (curTier >= 6
            ? `assets/core-${m}-t6-showcase.png?v=arcade428_tier8_sovereign`
            : `assets/core-${m}-t5.png?v=arcade428_tier8_sovereign`));""",
        "_buildTouchPadArtwork T8 closing paren",
    )

    g = replace_once(
        g,
        """      const knobSrc = curTier >= 7
        ? `assets/core-${curMode}-t7-showcase.png?v=arcade427_t7_evolution_audio`
        : (curTier >= 6
          ? `assets/core-${curMode}-t6-showcase.png?v=arcade427_t7_evolution_audio`
          : `assets/core-${curMode}-t5.png?v=arcade427_t7_evolution_audio`);""",
        """      const knobSrc = curTier >= 8
        ? `assets/core-${curMode}-t8-showcase.png?v=arcade428_tier8_sovereign`
        : (curTier >= 7
          ? `assets/core-${curMode}-t7-showcase.png?v=arcade428_tier8_sovereign`
          : (curTier >= 6
            ? `assets/core-${curMode}-t6-showcase.png?v=arcade428_tier8_sovereign`
            : `assets/core-${curMode}-t5.png?v=arcade428_tier8_sovereign`));""",
        "ensureTouchCluster knobSrc T8",
    )

    g = replace_once(
        g,
        """      const curT = ((typeof state !== 'undefined' && state.coreTier) || 1);
      const tierBucket = curT >= 7 ? 7 : (curT >= 6 ? 6 : 5);""",
        """      const curT = ((typeof state !== 'undefined' && state.coreTier) || 1);
      const tierBucket = curT >= 8 ? 8 : (curT >= 7 ? 7 : (curT >= 6 ? 6 : 5));""",
        "_syncRealmLabels tierBucket T8",
    )
    g = replace_once(
        g,
        """      if (this.joyKnobImgEl) {
        this.joyKnobImgEl.src = curT >= 7
          ? `assets/core-${curMode}-t7-showcase.png?v=arcade427_t7_evolution_audio`
          : (curT >= 6
            ? `assets/core-${curMode}-t6-showcase.png?v=arcade427_t7_evolution_audio`
            : `assets/core-${curMode}-t5.png?v=arcade427_t7_evolution_audio`);
      }""",
        """      if (this.joyKnobImgEl) {
        this.joyKnobImgEl.src = curT >= 8
          ? `assets/core-${curMode}-t8-showcase.png?v=arcade428_tier8_sovereign`
          : (curT >= 7
            ? `assets/core-${curMode}-t7-showcase.png?v=arcade428_tier8_sovereign`
            : (curT >= 6
              ? `assets/core-${curMode}-t6-showcase.png?v=arcade428_tier8_sovereign`
              : `assets/core-${curMode}-t5.png?v=arcade428_tier8_sovereign`));
      }""",
        "_syncRealmLabels joyKnobImgEl T8",
    )

    g = replace_once(
        g,
        """        const mTier = curTierNow >= 7 ? 7 : 6;
        const uNow = CoreGeometryDB.computeCoreMetrics(w, h, mTier, w < 600, null).u;
        const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
        t6Muzzles = (mTier >= 7)
          ? CoreGeometryDB.getTier7Muzzles(vMode, uNow, cx, cy, bank)
          : CoreGeometryDB.getTier6Muzzles(vMode, uNow, cx, cy, bank);""",
        """        const mTier = curTierNow >= 8 ? 8 : (curTierNow >= 7 ? 7 : 6);
        const uNow = CoreGeometryDB.computeCoreMetrics(w, h, mTier, w < 600, null).u;
        const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.42) : 0;
        t6Muzzles = (mTier >= 8)
          ? CoreGeometryDB.getTier8Muzzles(vMode, uNow, cx, cy, bank)
          : ((mTier >= 7)
            ? CoreGeometryDB.getTier7Muzzles(vMode, uNow, cx, cy, bank)
            : CoreGeometryDB.getTier6Muzzles(vMode, uNow, cx, cy, bank));""",
        "Skill2 muzzles T8",
    )

    g = replace_once(
        g,
        """      const ultTier = (state.coreTier || 1) >= 7 ? 7 : 6;
      const u = CoreGeometryDB.computeCoreMetrics(w, h, ultTier, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = (ultTier >= 7)
        ? CoreGeometryDB.getTier7Muzzles(mKey, u, nv.x, nv.y, bank)
        : CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank);""",
        """      const ultTier = (state.coreTier || 1) >= 8 ? 8 : ((state.coreTier || 1) >= 7 ? 7 : 6);
      const u = CoreGeometryDB.computeCoreMetrics(w, h, ultTier, isMob, null).u;
      const rampIn = Math.min(1.0, elapsed / 170);
      const rx = (isMob ? 132 : 178) * rampIn;
      const ry = rx * 0.33;
      const bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs = (ultTier >= 8)
        ? CoreGeometryDB.getTier8Muzzles(mKey, u, nv.x, nv.y, bank)
        : ((ultTier >= 7)
          ? CoreGeometryDB.getTier7Muzzles(mKey, u, nv.x, nv.y, bank)
          : CoreGeometryDB.getTier6Muzzles(mKey, u, nv.x, nv.y, bank));""",
        "Skill3 ult muzzles T8",
    )

    g = replace_once(
        g,
        """      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI', 7: 'TIER VII' }[peakTier] || 'TIER I';
      const emblemSrc = (peakTier >= 7)
        ? `assets/core-${rKey}-t7-showcase.png?v=arcade427_t7_evolution_audio`
        : cfg.emblem;""",
        """      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI', 7: 'TIER VII', 8: 'TIER VIII' }[peakTier] || 'TIER I';
      const emblemSrc = (peakTier >= 8)
        ? `assets/core-${rKey}-t8-showcase.png?v=arcade428_tier8_sovereign`
        : ((peakTier >= 7)
          ? `assets/core-${rKey}-t7-showcase.png?v=arcade428_tier8_sovereign`
          : cfg.emblem);""",
        "Debrief showcase T8",
    )

    # 10. Weapon Cadence, Tier VIII Apex Muzzles, Salvos, Super-Beams & Projectiles!
    g = replace_once(
        g,
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
        : null;""",
        """      const fireInterval = (tier >= 8)
        ? 56
        : ((tier >= 7)
          ? 72
          : ((isTouchMode || isKeyAHeld)
            ? FIRE_DELAY
            : ((tier >= 6) ? 82 : ((tier >= 5) ? 88 : (tier === 4 ? 98 : (tier >= 2 ? 108 : 122))))));

      // Top bezel clearance radius per mode: Dynamo's jeweled crown reaches -85*u; Helix/Meteor spheres reach -68*u
      const coreCrownY = (mode === 'dynamo') ? (-86 * u) : (-69 * u);
      const wingMuzzleX = (tier === 2) ? (76 * u) : (tier === 3 ? (92 * u) : (tier === 4 ? (112 * u) : (126 * u)));
      const wingMuzzleY = -58 * u;

      const t7Bank = (CoreKinematics && CoreKinematics.bodyBank) ? (CoreKinematics.bodyBank * 0.44) : 0;
      const mzs8W = (tier >= 8 && typeof CoreGeometryDB !== 'undefined')
        ? CoreGeometryDB.getTier8Muzzles(mode, u, cx, cy, t7Bank)
        : null;
      const mzs7W = (tier === 7 && typeof CoreGeometryDB !== 'undefined')
        ? CoreGeometryDB.getTier7Muzzles(mode, u, cx, cy, t7Bank)
        : null;""",
        "fireInterval & mzs8W resolution",
    )

    g = replace_once(
        g,
        """        if (tier >= 7 && mzs7W) {""",
        """        if (tier >= 8 && mzs8W) {
          const cmx = mzs8W.center.x - cx;
          const cmy = mzs8W.center.y - cy;
          const lx8 = mzs8W.left.x - cx;
          const ly8 = mzs8W.left.y - cy - 4 * u;
          const rx8 = mzs8W.right.x - cx;
          const ry8 = mzs8W.right.y - cy - 4 * u;

          if (mode === 'helix') {
            // PRISM RAIL CANNON: Hyper-Prism Central Lance + Twin Squared-Cannon Rail Bolts
            pushShot(cmx, cmy - 12 * u, 0, 5.5, true, 0, {
              vy: -31.0, isTier8: true, t8Kind: 'prism_rail_lance', pierce: 8, hitRadius: 62
            });
            pushShot(lx8, ly8, 0, 2.4, true, 0, {
              vy: -28.0, isTier8Side: true, t8SideKind: 'prism_rail_side', pierce: 4, hitRadius: 28
            });
            pushShot(rx8, ry8, 0, 2.4, true, Math.PI, {
              vy: -28.0, isTier8Side: true, t8SideKind: 'prism_rail_side', pierce: 4, hitRadius: 28
            });
          } else if (mode === 'meteor') {
            // SOLAR FORGE CANNON: 5-Way Hexagonal Magma Core Salvo + Converging Jets + Thermal Bolide Missiles
            pushShot(cmx, cmy - 10 * u, 0, 4.5, true, 0, {
              vy: -20.5, isTier8: true, t8Kind: 'solar_forge_core', pierce: 99, hitRadius: 96, splashR: 150
            });
            pushShot(cmx - 18 * u, cmy - 4 * u, -2.6, 2.6, true, 1.2, {
              vy: -19.5, isTier8: true, t8Kind: 'solar_forge_core', pierce: 99, hitRadius: 72
            });
            pushShot(cmx + 18 * u, cmy - 4 * u, 2.6, 2.6, true, 2.4, {
              vy: -19.5, isTier8: true, t8Kind: 'solar_forge_core', pierce: 99, hitRadius: 72
            });
            pushShot(lx8, ly8, -0.85, 2.2, true, 0.5, {
              vy: -24.0, isTier8Side: true, t8SideKind: 'solar_forge_missile', pierce: 3, hitRadius: 34, splashR: 92
            });
            pushShot(rx8, ry8, 0.85, 2.2, true, 2.5, {
              vy: -24.0, isTier8Side: true, t8SideKind: 'solar_forge_missile', pierce: 3, hitRadius: 34, splashR: 92
            });
          } else {
            // ROYAL SAPPHIRE CANNON: Diamond Emitter Annihilation Shell + Twin Accelerator Spears + Outer Aux Arcs
            pushShot(cmx, cmy - 18 * u, 0, 6.8, true, 0, {
              vy: -26.0, isTier8: true, t8Kind: 'royal_sapphire_shell', pierce: 4, hitRadius: 68, splashR: 185
            });
            pushShot(lx8, ly8, -0.45, 2.5, true, 0, {
              vy: -27.0, isTier8Side: true, t8SideKind: 'royal_sapphire_spear', pierce: 3, hitRadius: 30
            });
            pushShot(rx8, ry8, 0.45, 2.5, true, Math.PI, {
              vy: -27.0, isTier8Side: true, t8SideKind: 'royal_sapphire_spear', pierce: 3, hitRadius: 30
            });
            if (mzs8W.aux && mzs8W.aux.length >= 6) {
              const aL = mzs8W.aux[1];
              const aR = mzs8W.aux[4];
              pushShot(aL.x - cx, aL.y - cy, -1.1, 1.8, true, 0.8, {
                vy: -25.5, isTier8Side: true, t8SideKind: 'royal_sapphire_spear', pierce: 2, hitRadius: 24
              });
              pushShot(aR.x - cx, aR.y - cy, 1.1, 1.8, true, 2.3, {
                vy: -25.5, isTier8Side: true, t8SideKind: 'royal_sapphire_spear', pierce: 2, hitRadius: 24
              });
            }
          }
        } else if (tier >= 7 && mzs7W) {""",
        "Tier VIII 5-way projectile salvo emitter",
    )

    g = replace_once(
        g,
        """        // Mount Configuration Adaptable to Tiers I through VII:
        if (tier >= 7 && typeof CoreGeometryDB !== 'undefined') {""",
        """        // Mount Configuration Adaptable to Tiers I through VIII:
        if (tier >= 8 && typeof CoreGeometryDB !== 'undefined') {
          if (mfActive) {
            const mzs8L = CoreGeometryDB.getTier8Muzzles(mode, u, 0, 0, 0);
            const flashCol = lowAmmo ? '#f43f5e' : (mode === 'meteor' ? '#fde047' : (mode === 'helix' ? '#a5f3fc' : '#67e8f9'));
            [mzs8L.center, mzs8L.left, mzs8L.right].forEach((mTip) => {
              ctx.save();
              ctx.translate(mTip.x, mTip.y);
              ctx.fillStyle = flashCol;
              ctx.globalAlpha = 0.92 * mfT;
              ctx.beginPath();
              ctx.arc(0, 0, 10 * u, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            });
          }
        } else if (tier >= 7 && typeof CoreGeometryDB !== 'undefined') {""",
        "Tier VIII muzzle flash mount guard",
    )

    g = replace_once(
        g,
        """      // ─── TIER VII 10x ULTRA MIDDLE SUPER-WEAPONS + ACTIVE SIDE-CANNON MUZZLE BURSTS ───
      if (tier >= 7 && mzs7W && wantsFire && hasAmmo) {""",
        """      // ─── TIER VIII APEX SINGULARITY ULTIMATE WEAPON SUPER-BEAMS ───
      if (tier >= 8 && mzs8W && wantsFire && hasAmmo) {
        const mfActive8 = Boolean(state.muzzleFlashUntil && now < state.muzzleFlashUntil);
        const mfT8 = mfActive8 ? Math.max(0, (state.muzzleFlashUntil - now) / 65) : 0.55;
        const cX = mzs8W.center.x;
        const cY = mzs8W.center.y;
        const sideColA = mode === 'meteor' ? '#fb923c' : (mode === 'helix' ? '#67e8f9' : '#38bdf8');
        const sideColB = mode === 'meteor' ? '#fde047' : (mode === 'helix' ? '#f472b6' : '#a5f3fc');

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        [mzs8W.left, mzs8W.right].forEach((sm, sIdx) => {
          const flR = (22 + 12 * mfT8) * u;
          const sg = ctx.createRadialGradient(sm.x, sm.y, 2 * u, sm.x, sm.y, flR);
          sg.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
          sg.addColorStop(0.42, mode === 'meteor' ? 'rgba(251, 146, 60, 0.85)' : 'rgba(103, 232, 249, 0.85)');
          sg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, flR, 0, Math.PI * 2);
          ctx.fill();
          CoreKinematics._drawStarGlint(ctx, sm.x, sm.y - 3 * u, (16 + 7 * mfT8) * u, sIdx === 0 ? sideColA : sideColB);
        });

        if (mode === 'helix') {
          // PRISM RAIL CANNON: Central Tri-Prism Convergence + 1.65x Wide Hyper-Prism Beam + Twin Continuous Side Laser Rails!
          const beamTop = -34;
          const beamLen = Math.max(160, cY - beamTop);
          const beamHalfW = (50 + Math.sin(now * 0.036) * 5) * u;

          // Side cannons feeding crystalline energy streams into central triangular prism accelerator
          [mzs8W.left, mzs8W.right].forEach((sm, sIdx) => {
            ctx.strokeStyle = sIdx === 0 ? 'rgba(103, 232, 249, 0.82)' : 'rgba(244, 114, 182, 0.82)';
            ctx.lineWidth = Math.max(2.0, 3.2 * u);
            ctx.beginPath();
            ctx.moveTo(sm.x, sm.y + 8 * u);
            ctx.lineTo(cX, cY + 26 * u);
            ctx.stroke();

            // Twin continuous cyan-silver side laser rails shooting straight upward!
            const sideHW = 11 * u;
            const sGrad = ctx.createLinearGradient(sm.x - sideHW, 0, sm.x + sideHW, 0);
            sGrad.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
            sGrad.addColorStop(0.32, 'rgba(103, 232, 249, 0.78)');
            sGrad.addColorStop(0.50, 'rgba(255, 255, 255, 0.98)');
            sGrad.addColorStop(0.68, 'rgba(244, 114, 182, 0.74)');
            sGrad.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
            ctx.fillStyle = sGrad;
            ctx.fillRect(sm.x - sideHW, beamTop, sideHW * 2, Math.max(120, sm.y - beamTop));
          });

          const gradOuter = ctx.createLinearGradient(cX - beamHalfW * 1.65, 0, cX + beamHalfW * 1.65, 0);
          gradOuter.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          gradOuter.addColorStop(0.24, 'rgba(56, 189, 248, 0.36)');
          gradOuter.addColorStop(0.50, 'rgba(244, 114, 182, 0.50)');
          gradOuter.addColorStop(0.76, 'rgba(192, 132, 252, 0.36)');
          gradOuter.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
          ctx.fillStyle = gradOuter;
          ctx.fillRect(cX - beamHalfW * 1.65, beamTop, beamHalfW * 3.3, beamLen);

          const gradH = ctx.createLinearGradient(cX - beamHalfW, 0, cX + beamHalfW, 0);
          gradH.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
          gradH.addColorStop(0.16, 'rgba(99, 102, 241, 0.66)');
          gradH.addColorStop(0.32, 'rgba(244, 114, 182, 0.88)');
          gradH.addColorStop(0.45, 'rgba(103, 232, 249, 0.98)');
          gradH.addColorStop(0.50, 'rgba(255, 255, 255, 1.0)');
          gradH.addColorStop(0.55, 'rgba(103, 232, 249, 0.98)');
          gradH.addColorStop(0.68, 'rgba(244, 114, 182, 0.88)');
          gradH.addColorStop(0.84, 'rgba(192, 132, 252, 0.66)');
          gradH.addColorStop(1.0, 'rgba(244, 114, 182, 0)');
          ctx.fillStyle = gradH;
          ctx.fillRect(cX - beamHalfW, beamTop, beamHalfW * 2, beamLen);

          // 12 Racing Mach Shock-Diamonds + Tri-Strand Braided Harmonic Waves
          const machPhase = (now * 0.008) % 1.0;
          for (let md = 0; md < 12; md++) {
            const mf = ((md / 12) + machPhase) % 1.0;
            const my = cY - mf * beamLen;
            const mRad = (24 + (1 - mf) * 10) * u;
            ctx.fillStyle = md % 2 === 0 ? 'rgba(255, 255, 255, 0.96)' : 'rgba(240, 171, 252, 0.86)';
            ctx.beginPath();
            ctx.moveTo(cX, my - mRad * 1.45);
            ctx.lineTo(cX + mRad * 0.56, my);
            ctx.lineTo(cX, my + mRad * 1.15);
            ctx.lineTo(cX - mRad * 0.56, my);
            ctx.closePath();
            ctx.fill();
          }

          for (let strand = 0; strand < 3; strand++) {
            const sOff = strand * ((Math.PI * 2) / 3);
            ctx.strokeStyle = strand === 0 ? 'rgba(103, 232, 249, 0.90)' : (strand === 1 ? 'rgba(244, 114, 182, 0.90)' : 'rgba(192, 132, 252, 0.86)');
            ctx.lineWidth = Math.max(2.2, 3.6 * u);
            ctx.beginPath();
            for (let sIdx = 0; sIdx <= 30; sIdx++) {
              const f = sIdx / 30;
              const yy = cY - f * beamLen;
              const xx = cX + Math.sin(f * Math.PI * 8.5 - now * 0.028 + sOff) * (beamHalfW * 0.86);
              if (sIdx === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
            }
            ctx.stroke();
          }

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.99)';
          ctx.lineWidth = Math.max(10.0, 17.5 * u);
          ctx.beginPath();
          ctx.moveTo(cX, cY);
          ctx.lineTo(cX, beamTop);
          ctx.stroke();
          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 38 * u * (0.9 + 0.2 * mfT8), '#a5f3fc');
          CoreKinematics._drawStarGlint(ctx, cX, cY - 2 * u, 22 * u, '#ffffff');

          // Wide Central Prism Rail + Twin Side-Rail Laser Corridor Damage + Boss Bullet Vaporization!
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const hr = (pt.headR || 28);
            const hitCenter = (pt.y <= cY + 14 && Math.abs(pt.x - cX) < hr + 58);
            const hitSide = (!hitCenter && pt.y <= mzs8W.left.y + 12 && (Math.abs(pt.x - mzs8W.left.x) < hr + 28 || Math.abs(pt.x - mzs8W.right.x) < hr + 28));
            if (hitCenter || hitSide) {
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= (hitCenter ? 0.78 : 0.45) * Math.max(0.5, dtScale || 1);
              if (Math.random() < 0.5) this._spawnHitSparks(pt.x, pt.y, '#67e8f9', 3);
              if (pt.shotHp <= 0) {
                state.score += 320;
                this._spawnHitSparks(pt.x, pt.y, '#f472b6', 14);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              }
            }
          }
          if (state.bossBullets && state.bossBullets.length > 0) {
            for (let bIdx = state.bossBullets.length - 1; bIdx >= 0; bIdx--) {
              const bb = state.bossBullets[bIdx];
              if (bb.y <= cY && (Math.abs(bb.x - cX) <= 68 || Math.abs(bb.x - mzs8W.left.x) <= 24 || Math.abs(bb.x - mzs8W.right.x) <= 24)) {
                this._spawnHitSparks(bb.x, bb.y, '#a5f3fc', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }
        } else if (mode === 'meteor') {
          // SOLAR FORGE CANNON: Hexagonal Overcharged Magma Chamber + 1.65x Sweeping Hellfire Inferno Column!
          const pxScale = Math.max(0.20, (mzs8W.right.x - mzs8W.left.x) / 216);
          const flameTexList = QuantumRenderer._getDragonFlameTextures();
          const mWispsImg = VfxUltraAssets.novaWisps && VfxUltraAssets.novaWisps.meteor;
          const mWispsReady = Boolean(VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaWisps && VfxUltraAssets.loaded.novaWisps.meteor && mWispsImg && mWispsImg.naturalWidth > 0);
          const bFrames = VfxUltraAssets.meteorBreathFrames || [];
          const bReady = Boolean(VfxUltraAssets.loaded && VfxUltraAssets.loaded.meteorBreath && bFrames.length >= 4);
          if (!this._t7DragonFlames) this._t7DragonFlames = [];
          if (!this._t7DragonEmbers) this._t7DragonEmbers = [];

          for (let sp = 0; sp < 5; sp++) {
            if (this._t7DragonFlames.length < 60) {
              const spread = (Math.random() - 0.5) * 0.62;
              this._t7DragonFlames.push({
                x: cX + (Math.random() - 0.5) * 24 * u,
                y: cY,
                vx: Math.sin(spread) * (5.8 + Math.random() * 5.6),
                vy: -(16.5 + Math.random() * 9.0),
                size: (82 + Math.random() * 52) * u,
                grow: 5.4 * u,
                rot: (Math.random() - 0.5) * 0.7,
                vRot: (Math.random() - 0.5) * 0.05,
                texIdx: Math.floor(Math.random() * flameTexList.length),
                turbPhase: Math.random() * Math.PI * 2,
                life: 0,
                maxLife: 22 + Math.random() * 10
              });
            }
          }
          for (let ep = 0; ep < 5; ep++) {
            if (this._t7DragonEmbers.length < 75) {
              const spread = (Math.random() - 0.5) * 0.85;
              this._t7DragonEmbers.push({
                x: cX + (Math.random() - 0.5) * 28 * u,
                y: cY,
                vx: Math.sin(spread) * (10.5 + Math.random() * 10.5),
                vy: -(19.0 + Math.random() * 13.0),
                len: (16 + Math.random() * 24) * u,
                life: 0,
                maxLife: 20 + Math.random() * 12
              });
            }
          }

          const coneLen = Math.min(640, Math.max(400, h * 0.78));
          ctx.save();
          ctx.translate(cX, cY - coneLen * 0.45);
          ctx.scale(0.84, 1.0);
          const washR = coneLen * 0.74;
          const washGrad = ctx.createRadialGradient(0, washR * 0.42, 14 * u, 0, 0, washR);
          washGrad.addColorStop(0.0, 'rgba(255, 245, 200, 0.80)');
          washGrad.addColorStop(0.28, 'rgba(251, 146, 60, 0.58)');
          washGrad.addColorStop(0.62, 'rgba(220, 38, 38, 0.34)');
          washGrad.addColorStop(1.0, 'rgba(127, 29, 29, 0)');
          ctx.fillStyle = washGrad;
          ctx.beginPath();
          ctx.arc(0, 0, washR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Hexagonal Magma Chamber Bore Corona + Pulsing Thermal Hex Shock-Rings
          const boreY = cY + 26 * pxScale;
          const mCor = VfxUltraAssets.novaCorona && VfxUltraAssets.novaCorona.meteor;
          if (VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaCorona && VfxUltraAssets.loaded.novaCorona.meteor && mCor && mCor.naturalWidth > 0) {
            ctx.save();
            ctx.translate(cX, boreY);
            ctx.rotate(now * 0.008);
            const cs = (155 + 16 * mfT8) * u;
            ctx.globalAlpha = 0.88;
            ctx.drawImage(mCor, -cs * 0.5, -cs * 0.5, cs, cs);
            ctx.restore();
          }
          const hexPhase = (now * 0.006) % 1.0;
          for (let hx = 0; hx < 4; hx++) {
            const hf = ((hx / 4) + hexPhase) % 1.0;
            const hy = cY - hf * (coneLen * 0.65);
            const hr = (34 + hf * 66) * u;
            ctx.strokeStyle = `rgba(253, 224, 71, ${(1 - hf) * 0.78})`;
            ctx.lineWidth = Math.max(1.8, 2.8 * u);
            ctx.beginPath();
            for (let v = 0; v <= 6; v++) {
              const a = (v / 6) * Math.PI * 2;
              const px = cX + Math.cos(a) * hr;
              const py = hy + Math.sin(a) * hr * 0.38;
              if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          if (bReady) {
            const bPhase = (now * 0.017) % 4;
            const bI0 = Math.floor(bPhase);
            const bI1 = (bI0 + 1) % 4;
            const bMix = bPhase - bI0;
            const bW = 420 * u + Math.sin(now * 0.02) * 14 * u;
            const bBaseY = cY + 28 * pxScale;
            const bH = coneLen + 40 * u;
            const sway = Math.sin(now * 0.016) * 8 * u;
            ctx.save();
            ctx.globalAlpha = (1.0 - bMix) * 0.96;
            ctx.drawImage(bFrames[bI0], cX - bW * 0.5 + sway, bBaseY - bH, bW, bH);
            ctx.globalAlpha = bMix * 0.96;
            ctx.drawImage(bFrames[bI1], cX - bW * 0.5 - sway * 0.7, bBaseY - bH, bW, bH);
            ctx.restore();
          }

          if (mWispsReady) {
            ctx.save();
            const sheetH = 440 * u;
            const scrB = (now * 1.12) % sheetH;
            for (let yTile = cY - coneLen - sheetH; yTile < cY + 40; yTile += sheetH) {
              const drawYB = yTile - scrB;
              const topProg = Math.max(0, Math.min(1, (cY - (drawYB + sheetH * 0.5)) / coneLen));
              const wSheet = (170 + topProg * 280) * u;
              const swayX = Math.sin(now * 0.016 + yTile * 0.024) * 26 * u;
              ctx.globalAlpha = 0.78 * (1.0 - topProg * 0.35);
              ctx.drawImage(mWispsImg, cX - wSheet * 0.5 + swayX, drawYB, wSheet, sheetH + 16 * u);
            }
            ctx.restore();
          }

          for (let fIdx = this._t7DragonFlames.length - 1; fIdx >= 0; fIdx--) {
            const fl = this._t7DragonFlames[fIdx];
            const dS = Math.max(0.5, dtScale || 1);
            fl.x += (fl.vx + Math.sin(now * 0.022 + fl.turbPhase) * 1.8) * dS;
            fl.y += fl.vy * dS;
            fl.size += fl.grow * dS;
            fl.rot += fl.vRot * dS;
            fl.life += dS;
            if (fl.life >= fl.maxLife) { this._t7DragonFlames.splice(fIdx, 1); continue; }
            const tF = fl.life / fl.maxLife;
            ctx.save();
            ctx.translate(fl.x, fl.y);
            ctx.rotate(fl.rot);
            ctx.globalAlpha = Math.sin((1.0 - tF) * Math.PI * 0.5) * 0.78;
            ctx.drawImage(flameTexList[fl.texIdx], -fl.size * 0.5, -fl.size * 0.5, fl.size, fl.size);
            ctx.restore();
          }

          for (let eIdx = this._t7DragonEmbers.length - 1; eIdx >= 0; eIdx--) {
            const em = this._t7DragonEmbers[eIdx];
            const dS = Math.max(0.5, dtScale || 1);
            em.x += em.vx * dS;
            em.y += em.vy * dS;
            em.life += dS;
            if (em.life >= em.maxLife) { this._t7DragonEmbers.splice(eIdx, 1); continue; }
            const ea = 1.0 - (em.life / em.maxLife);
            ctx.strokeStyle = `rgba(254, 240, 138, ${0.98 * ea})`;
            ctx.lineWidth = Math.max(1.8, 2.8 * u);
            ctx.beginPath();
            ctx.moveTo(em.x, em.y);
            ctx.lineTo(em.x - em.vx * 0.72, em.y - em.vy * 0.72);
            ctx.stroke();
          }

          // Devastating Wide Solar Forge Corridor Damage + Explosive Chain Splash on Kills!
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dyFront = cY - pt.y;
            if (dyFront >= -30 && dyFront <= coneLen) {
              const maxSpan = 72 + Math.max(0, dyFront) * 0.48;
              if (Math.abs(pt.x - cX) <= maxSpan + (pt.headR || 26)) {
                if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
                pt.shotHp -= 1.45 * Math.max(0.5, dtScale || 1);
                if (Math.random() < 0.55) this._spawnHitSparks(pt.x, pt.y, '#fde047', 3);
                if (pt.shotHp <= 0) {
                  state.score += 340;
                  this._spawnHitSparks(pt.x, pt.y, '#fb923c', 16);
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
              if (dyB >= -10 && dyB <= coneLen && Math.abs(bb.x - cX) <= 72 + Math.max(0, dyB) * 0.48) {
                this._spawnHitSparks(bb.x, bb.y, '#fde047', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }
        } else {
          // ROYAL SAPPHIRE CANNON (Dynamo Tier VIII): 6 Sapphire Accelerator Feeds -> Giant Diamond Emitter -> 1.6x Plasma Storm + 220px Chain-Lightning AoE!
          const dFlameImg = VfxUltraAssets.novaFlame && VfxUltraAssets.novaFlame.dynamo;
          const dWispsImg = VfxUltraAssets.novaWisps && VfxUltraAssets.novaWisps.dynamo;
          const dPlasmaReady = Boolean(VfxUltraAssets.loaded && VfxUltraAssets.loaded.novaFlame && VfxUltraAssets.loaded.novaFlame.dynamo && dFlameImg && dFlameImg.naturalWidth > 0 && dWispsImg && dWispsImg.naturalWidth > 0);
          const originX = cX;
          const originY = cY + 14 * u;
          const beamTop = -36;
          const beamLen = Math.max(170, originY - beamTop);
          const halfBeam = (68 + Math.sin(now * 0.04) * 7) * u;
          const lTick = Math.floor(now / 36);

          // 1. All 6 Outer Sapphire Accelerator Blocks + Shoulder Cannons Arc Fractal Lightning into Diamond Emitter!
          const feedList = (mzs8W.aux && mzs8W.aux.length) ? mzs8W.aux.concat([mzs8W.left, mzs8W.right]) : [mzs8W.left, mzs8W.right];
          feedList.forEach((fPt, fIdx) => {
            CoreKinematics._drawLightningSprite(ctx, fPt.x, fPt.y, originX, originY + 12 * u, 32 * u, lTick + fIdx * 2, 0.92);
          });

          const originGlow = QuantumRenderer._getGlowSprite('cyan');
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.drawImage(originGlow, originX - 118 * u, originY - 118 * u, 236 * u, 236 * u);
          ctx.restore();

          // 2. 1.6x Wider Royal Sapphire-Cyan-Violet Volumetric Torrent
          ctx.save();
          const bGrad = ctx.createLinearGradient(originX - halfBeam * 1.15, 0, originX + halfBeam * 1.15, 0);
          bGrad.addColorStop(0.0, 'rgba(37, 99, 235, 0)');
          bGrad.addColorStop(0.16, 'rgba(56, 189, 248, 0.50)');
          bGrad.addColorStop(0.32, 'rgba(139, 92, 246, 0.82)');
          bGrad.addColorStop(0.46, 'rgba(224, 242, 254, 0.98)');
          bGrad.addColorStop(0.50, '#ffffff');
          bGrad.addColorStop(0.54, 'rgba(224, 242, 254, 0.98)');
          bGrad.addColorStop(0.68, 'rgba(139, 92, 246, 0.82)');
          bGrad.addColorStop(0.84, 'rgba(56, 189, 248, 0.50)');
          bGrad.addColorStop(1.0, 'rgba(37, 99, 235, 0)');
          ctx.fillStyle = bGrad;
          ctx.fillRect(originX - halfBeam * 1.15, beamTop, halfBeam * 2.3, beamLen);

          if (dPlasmaReady) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(originX - halfBeam * 1.05, beamTop, halfBeam * 2.1, beamLen);
            ctx.clip();
            const dSheetH = 420 * u;
            const dScr1 = (now * 1.12) % dSheetH;
            const dScr2 = (now * 1.48) % dSheetH;
            for (let yT = beamTop - dSheetH; yT < originY + dSheetH; yT += dSheetH) {
              ctx.globalAlpha = 0.70;
              ctx.drawImage(dFlameImg, originX - halfBeam * 0.98, yT - dScr1, halfBeam * 1.96, dSheetH + 16 * u);
              ctx.globalAlpha = 0.80;
              ctx.drawImage(dWispsImg, originX - halfBeam * 0.92, yT - dScr2, halfBeam * 1.84, dSheetH + 16 * u);
            }
            ctx.restore();
          }
          ctx.restore();

          // 3. 6 Simultaneous Flickering Fractal Lichtenberg Lightning Sprites Surging Upward!
          for (let li = 0; li < 6; li++) {
            const xOff = Math.sin(li * 1.7 + now * 0.025) * halfBeam * 0.52;
            const bw = (li < 2 ? 155 : 108) * u;
            CoreKinematics._drawLightningSprite(ctx, originX + xOff * 0.35, originY, originX + xOff * 1.2, beamTop + 8, bw, lTick + li * 3, 0.96);
          }

          if (VfxUltraAssets.loaded.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst.naturalWidth > 0) {
            ctx.save();
            ctx.translate(originX, originY - 6 * u);
            ctx.rotate(Math.sin(now * 0.018) * 0.20);
            const bSize = (182 + 20 * mfT8) * u;
            ctx.drawImage(VfxUltraAssets.dynamoOriginBurst, -bSize * 0.5, -bSize * 0.5, bSize, bSize);
            ctx.restore();
          }

          // 4. Devastating Main Corridor + 220px Automatic Chain-Lightning AoE Across Nearby Hazards + Bullet Clear!
          for (let pIdx = state.particles.length - 1; pIdx >= 0; pIdx--) {
            const pt = state.particles[pIdx];
            if (!pt || !isHazardNode(pt.nodeClass)) continue;
            const dxAbs = Math.abs(pt.x - originX);
            const hr = (pt.headR || 28);
            const inMain = (pt.y <= originY + 26 && dxAbs < hr + 82);
            const inChain = (!inMain && pt.y <= originY + 40 && dxAbs < hr + 220);
            if (inMain || inChain) {
              CoreKinematics._drawLightningSprite(ctx, originX, Math.max(20, pt.y + 42), pt.x, pt.y, (inMain ? 48 : 34) * u, lTick + pIdx * 2, 0.95);
              if (pt.shotHp === undefined) pt.shotHp = (pt.nodeClass === 'volatile') ? 3 : 5;
              pt.shotHp -= (inMain ? 0.92 : 0.42) * Math.max(0.5, dtScale || 1);
              if (Math.random() < 0.5) this._spawnHitSparks(pt.x, pt.y, '#67e8f9', 3);
              if (pt.shotHp <= 0) {
                state.score += 340;
                this._spawnHitSparks(pt.x, pt.y, '#a855f7', 14);
                audio.playMissileHit();
                state.particles.splice(pIdx, 1);
                SkillSystem.onEnemyDestroyed();
                updateHeaderUI();
              }
            }
          }
          if (state.bossBullets && state.bossBullets.length > 0) {
            for (let bIdx = state.bossBullets.length - 1; bIdx >= 0; bIdx--) {
              const bb = state.bossBullets[bIdx];
              if (bb.y <= originY && Math.abs(bb.x - originX) <= 95) {
                this._spawnHitSparks(bb.x, bb.y, '#a5f3fc', 3);
                state.bossBullets.splice(bIdx, 1);
              }
            }
          }
        }
        ctx.restore();
      } else if (tier === 7 && mzs7W && wantsFire && hasAmmo) {""",
        "Tier VIII apex super-weapon beams & AoE",
    )

    g = replace_once(
        g,
        """          const rx = boss.hitR * 1.22 + (s.isTier7 ? 20 : 0);
          const ry = boss.hitR * 0.86 + (s.isTier7 ? 16 : 0);
          if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
            this.damageBoss(s.dmg, now, false, s.x, s.y);
            if ((s.mode === 'meteor' || s.t7Kind === 'princess_cannon') && boss.pylons) {
              for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
                const pyl = boss.pylons[pIdx];
                if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < (s.splashR || 75)) {
                  this.damagePylon(pyl, s.t7Kind === 'princess_cannon' ? 1.2 : 0.35, now, pyl.x, pyl.y);""",
        """          const rx = boss.hitR * 1.22 + (s.isTier8 ? 30 : (s.isTier7 ? 20 : 0));
          const ry = boss.hitR * 0.86 + (s.isTier8 ? 24 : (s.isTier7 ? 16 : 0));
          if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0) {
            this.damageBoss(s.dmg, now, false, s.x, s.y);
            if ((s.mode === 'meteor' || s.t7Kind === 'princess_cannon' || s.t8Kind === 'royal_sapphire_shell' || s.t8Kind === 'solar_forge_core') && boss.pylons) {
              for (let pIdx = 0; pIdx < boss.pylons.length; pIdx++) {
                const pyl = boss.pylons[pIdx];
                if (pyl.hp > 0 && Math.hypot(s.x - pyl.x, s.y - pyl.y) < (s.splashR || 75)) {
                  this.damagePylon(pyl, s.isTier8 ? 1.8 : (s.t7Kind === 'princess_cannon' ? 1.2 : 0.35), now, pyl.x, pyl.y);""",
        "Tier VIII boss & pylon splash damage",
    )

    g = replace_once(
        g,
        """              this._spawnHitSparks(s.x, s.y, s.t7Kind === 'princess_cannon' ? '#38bdf8' : '#fbbf24', s.isTier7 ? 8 : 5);""",
        """              this._spawnHitSparks(s.x, s.y, (s.t7Kind === 'princess_cannon' || s.t8Kind === 'royal_sapphire_shell') ? '#38bdf8' : '#fbbf24', s.isTier8 ? 12 : (s.isTier7 ? 8 : 5));""",
        "Tier VIII hit sparks",
    )

    g = replace_once(
        g,
        """        if (consumed) {
          if (s.isFifth || s.isTier7) {""",
        """        if (consumed) {
          if (s.isFifth || s.isTier7 || s.isTier8) {""",
        "Tier VIII consumed shock ring",
    )

    g = replace_once(
        g,
        """        if (s.isTier7) {""",
        """        if (s.isTier8) {
          if (s.t8Kind === 'royal_sapphire_shell') {
            const pGlow = QuantumRenderer._getGlowSprite('cyan');
            ctx.drawImage(pGlow, -62, -62, 124, 124);
            if (VfxUltraAssets.loaded.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst && VfxUltraAssets.dynamoOriginBurst.naturalWidth > 0) {
              ctx.save();
              ctx.rotate(now * 0.015 + s.phase);
              ctx.drawImage(VfxUltraAssets.dynamoOriginBurst, -54, -54, 108, 108);
              ctx.restore();
            }
            if (VfxUltraAssets.loaded.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.dynamoTeslaBolt, -34, -68, 68, 128);
            }
            CoreKinematics._drawLightningSprite(ctx, 0, 10, Math.sin(now * 0.05 + s.phase) * 10, 88, 44, Math.floor(now / 36) + Math.floor(s.phase * 10), 0.96);
          } else if (s.t8Kind === 'solar_forge_core') {
            const ftList = QuantumRenderer._getDragonFlameTextures();
            const fImg = ftList[Math.floor((s.phase * 10 + now * 0.012) % ftList.length)];
            ctx.globalAlpha = 0.92;
            ctx.drawImage(fImg, -56, -56, 112, 112);
          } else {
            const pl = ctx.createLinearGradient(0, -52, 0, 48);
            pl.addColorStop(0.0, '#ffffff');
            pl.addColorStop(0.32, '#a5f3fc');
            pl.addColorStop(0.68, '#f472b6');
            pl.addColorStop(1.0, 'rgba(192, 132, 252, 0)');
            ctx.fillStyle = pl;
            ctx.beginPath();
            ctx.moveTo(0, -54);
            ctx.lineTo(16, 0);
            ctx.lineTo(0, 46);
            ctx.lineTo(-16, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
          continue;
        }

        if (s.isTier8Side) {
          if (s.t8SideKind === 'prism_rail_side') {
            const hg = ctx.createLinearGradient(0, -32, 0, 32);
            hg.addColorStop(0.0, '#ffffff');
            hg.addColorStop(0.4, '#67e8f9');
            hg.addColorStop(0.8, '#f472b6');
            hg.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.moveTo(0, -32);
            ctx.lineTo(8.5, -2);
            ctx.lineTo(0, 28);
            ctx.lineTo(-8.5, -2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, -4, 3.0, 14, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (s.t8SideKind === 'solar_forge_missile') {
            if (VfxUltraAssets.loaded.meteorFireMissile && VfxUltraAssets.meteorFireMissile && VfxUltraAssets.meteorFireMissile.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.meteorFireMissile, -28, -26, 56, 84);
            } else {
              const fg = QuantumRenderer._getGlowSprite('amber');
              ctx.drawImage(fg, -30, -30, 60, 60);
            }
          } else {
            if (VfxUltraAssets.loaded.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt && VfxUltraAssets.dynamoTeslaBolt.naturalWidth > 0) {
              ctx.drawImage(VfxUltraAssets.dynamoTeslaBolt, -24, -48, 48, 96);
            }
            CoreKinematics._drawLightningSprite(ctx, 0, -16, 0, 38, 26, Math.floor(now / 36) + Math.floor(s.phase * 7), 0.80);
          }
          ctx.restore();
          continue;
        }

        if (s.isTier7) {""",
        "Tier VIII projectile renderers",
    )

    # 11. Combo thresholds, state.tier8HatchLock, damage downgrades, HUD, cycle, setTier, checkUrlAutoLaunch
    g = replace_once(
        g,
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
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
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playVoidbloomDrain();""",
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 8) state.tier8HatchLock = false;
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
        state.tier8HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playVoidbloomDrain();""",
        "Voidbloom downgrade T8",
    )

    g = replace_once(
        g,
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
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
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playHazardExplosion();""",
        """        const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
        state.combo = tierFloorCombo[state.coreTier] || 0;
        if (state.coreTier < 8) state.tier8HatchLock = false;
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
        state.tier8HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
      }
      state.prevEvaluatedCombo = state.combo;
      state.reflexLives--;
      state.consecutivePerfects = 0;
      audio.playHazardExplosion();""",
        "Boss hit downgrade T8",
    )

    g = replace_once(
        g,
        "    tier6HatchLock: false,\n    tier7HatchLock: false,",
        "    tier6HatchLock: false,\n    tier7HatchLock: false,\n    tier8HatchLock: false,",
        "state.tier8HatchLock decl",
    )

    g = replace_once(
        g,
        """    const nextTier = (c >= 65) ? 7 : ((c >= 35) ? 6 : (c >= 28 ? 5 : (c >= 21 ? 4 : (c >= 14 ? 3 : (c >= 7 ? 2 : 1)))));
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
    }""",
        """    const nextTier = (c >= 90) ? 8 : ((c >= 65) ? 7 : ((c >= 35) ? 6 : (c >= 28 ? 5 : (c >= 21 ? 4 : (c >= 14 ? 3 : (c >= 7 ? 2 : 1))))));
    if (nextTier === 8) {
      const crossedT8 = (prevC < 90 && c >= 90);
      state.tier6HatchLock = true;
      state.tier7HatchLock = true;
      if (allowHatch && !state.tier8HatchLock && (crossedT8 || (state.coreTier || 1) < 8)) {
        state.tier8HatchLock = true;
        state.coreTier = 8;
        state.isOverdrive = true;
        if (typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 8;
        const mMode = (state.catcherType === 'helix') ? 'helix' : (state.catcherType === 'meteor' ? 'meteor' : 'dynamo');
        if (typeof Tier6HatchSystem !== 'undefined') {
          Tier6HatchSystem.start(mMode, now, 8);
        }
      } else {
        state.tier8HatchLock = true;
        state.coreTier = 8;
        state.isOverdrive = true;
        if (!allowHatch && typeof CoreKinematics !== 'undefined') CoreKinematics.continuousTier = 8;
      }
    } else if (nextTier === 7) {
      if (c < 90) state.tier8HatchLock = false;
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
      if (c < 90) state.tier8HatchLock = false;
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
      if (c < 90) state.tier8HatchLock = false;
      if (c < 65) state.tier7HatchLock = false;
      if (state.coreTier >= 6 || c < 35) {
        if (c < 35) state.tier6HatchLock = false;
        if (typeof Tier6HatchSystem !== 'undefined' && c < 35) Tier6HatchSystem.cancel();
      }
      state.coreTier = nextTier;
      state.isOverdrive = (nextTier >= 4);
    }""",
        "evaluateCoreTierFromCombo T8",
    )

    g = replace_once(
        g,
        """    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME DYNAMO · CELESTIAL EMPRESS'
        : (state.coreTier >= 6 ? 'CHROME DYNAMO · DYNAMO PRINCESS' : (state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Sovereign Hand Mega-Cannon Empress · Round ${state.currentRound || 1}`""",
        """    if (state.gameType === 'dynamo' || state.gameType === 'realm') {
      nextTitle = state.coreTier >= 8
        ? 'CHROME DYNAMO · ROYAL SAPPHIRE SOVEREIGN'
        : (state.coreTier >= 7
        ? 'CHROME DYNAMO · CELESTIAL EMPRESS'
        : (state.coreTier >= 6 ? 'CHROME DYNAMO · DYNAMO PRINCESS' : (state.coreTier === 5 ? 'CHROME DYNAMO · SERAPHIC ARCHON' : 'CHROME DYNAMO')));
      nextSub = state.coreTier >= 8
        ? `💎 Tier VIII Apex Singularity · Royal Sapphire 6-Pod Cannon Sovereign · Round ${state.currentRound || 1}`
        : (state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Sovereign Hand Mega-Cannon Empress · Round ${state.currentRound || 1}`""",
        "updateHeaderUI dynamo T8 title",
    )
    g = replace_once(
        g,
        """            ? `⭐ Tier V Supreme Ascendant · Faraday Rail-Arc Core · Round ${state.currentRound || 1}`
            : `Faraday Singularity Core · Plasma Orbs · Offense Cannon [F] · Round ${state.currentRound || 1}`));""",
        """            ? `⭐ Tier V Supreme Ascendant · Faraday Rail-Arc Core · Round ${state.currentRound || 1}`
            : `Faraday Singularity Core · Plasma Orbs · Offense Cannon [F] · Round ${state.currentRound || 1}`)));""",
        "updateHeaderUI dynamo T8 close paren",
    )

    g = replace_once(
        g,
        """    } else if (state.gameType === 'helix') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME HELIX · SERAPHIC PEGASUS'
        : (state.coreTier >= 6 ? 'CHROME HELIX · HELIX UNICORN' : (state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Prismatic Horn-Laser Unicorn · Round ${state.currentRound || 1}`""",
        """    } else if (state.gameType === 'helix') {
      nextTitle = state.coreTier >= 8
        ? 'CHROME HELIX · PRISM RAIL SERAPH'
        : (state.coreTier >= 7
        ? 'CHROME HELIX · SERAPHIC PEGASUS'
        : (state.coreTier >= 6 ? 'CHROME HELIX · HELIX UNICORN' : (state.coreTier === 5 ? 'CHROME HELIX · PRISM ARCHON' : 'CHROME HELIX')));
      nextSub = state.coreTier >= 8
        ? `💎 Tier VIII Apex Singularity · Prism Rail Accelerator Seraph · Round ${state.currentRound || 1}`
        : (state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Prismatic Horn-Laser Unicorn · Round ${state.currentRound || 1}`""",
        "updateHeaderUI helix T8 title",
    )
    g = replace_once(
        g,
        """            ? `⭐ Tier V Supreme Ascendant · Twin-Helix Photonic Lance · Round ${state.currentRound || 1}`
            : `Harmonic Bio-Lattice Core · Nucleotide Pearls · Offense Cannon [F] · Round ${state.currentRound || 1}`));""",
        """            ? `⭐ Tier V Supreme Ascendant · Twin-Helix Photonic Lance · Round ${state.currentRound || 1}`
            : `Harmonic Bio-Lattice Core · Nucleotide Pearls · Offense Cannon [F] · Round ${state.currentRound || 1}`)));""",
        "updateHeaderUI helix T8 close paren",
    )

    g = replace_once(
        g,
        """    } else if (state.gameType === 'meteor') {
      nextTitle = state.coreTier >= 7
        ? 'CHROME METEOR · SOLAR WYRM SOVEREIGN'
        : (state.coreTier >= 6 ? 'CHROME METEOR · METEOR DRAGON' : (state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR'));
      nextSub = state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Inferno Breath Caldera Dragon · Round ${state.currentRound || 1}`""",
        """    } else if (state.gameType === 'meteor') {
      nextTitle = state.coreTier >= 8
        ? 'CHROME METEOR · SOLAR FORGE EMPEROR'
        : (state.coreTier >= 7
        ? 'CHROME METEOR · SOLAR WYRM SOVEREIGN'
        : (state.coreTier >= 6 ? 'CHROME METEOR · METEOR DRAGON' : (state.coreTier === 5 ? 'CHROME METEOR · MAGNETAR SERAPH' : 'CHROME METEOR')));
      nextSub = state.coreTier >= 8
        ? `🔥 Tier VIII Apex Singularity · Hexagonal Solar Forge Emperor · Round ${state.currentRound || 1}`
        : (state.coreTier >= 7
        ? `👑 Tier VII Celestial Apotheosis · Inferno Breath Caldera Dragon · Round ${state.currentRound || 1}`""",
        "updateHeaderUI meteor T8 title",
    )
    g = replace_once(
        g,
        """            ? `⭐ Tier V Supreme Ascendant · Solar Mass-Driver Core · Round ${state.currentRound || 1}`
            : `Aegis Caldera Core · Molten Bolides · Offense Cannon [F] · Round ${state.currentRound || 1}`));""",
        """            ? `⭐ Tier V Supreme Ascendant · Solar Mass-Driver Core · Round ${state.currentRound || 1}`
            : `Aegis Caldera Core · Molten Bolides · Offense Cannon [F] · Round ${state.currentRound || 1}`)));""",
        "updateHeaderUI meteor T8 close paren",
    )

    g = replace_once(
        g,
        """      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e', 6: '#f472b6', 7: '#fde047' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      if (!c.tierTitleSet) {
        c.tierTitleSet = true;
        const tierPillEl = document.getElementById('cgTierPill');
        if (tierPillEl) {
          tierPillEl.style.cursor = 'pointer';
          tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x Sovereign Overdrive), Tier V (28-34x Supreme Seraphic Ascendant), Tier VI (35-64x Mythic Hatch), Tier VII (65x+ Celestial Apotheosis — Click to Cycle Tier I→VII!)`;
        }
      }""",
        """      const tierMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII' };
      const colorMap = { 1: '#00f0ff', 2: '#38bdf8', 3: '#c084fc', 4: '#fef08a', 5: '#f43f5e', 6: '#f472b6', 7: '#fde047', 8: '#a5f3fc' };
      dom.tierVal.textContent = tierMap[state.coreTier] || 'I';
      dom.tierVal.style.color = colorMap[state.coreTier] || '#00f0ff';
      if (!c.tierTitleSet) {
        c.tierTitleSet = true;
        const tierPillEl = document.getElementById('cgTierPill');
        if (tierPillEl) {
          tierPillEl.style.cursor = 'pointer';
          tierPillEl.title = `Core Evolution Tier: Tier I (0-6x), Tier II (7-13x), Tier III (14-20x), Tier IV (21-27x), Tier V (28-34x), Tier VI (35-64x), Tier VII (65-89x), Tier VIII (90x+ Apex Singularity — Click to Cycle Tier I→VIII!)`;
        }
      }""",
        "tierMap & cgTierPill title T8",
    )

    g = replace_once(
        g,
        """    state.tier6HatchLock = false;
    state.tier7HatchLock = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();""",
        """    state.tier6HatchLock = false;
    state.tier7HatchLock = false;
    state.tier8HatchLock = false;
    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();""",
        "startGame tier8HatchLock reset",
    )

    g = replace_once(
        g,
        """    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;""",
        """    if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.reset();
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;
    state.tier8HatchLock = false;""",
        "handleGameOver tier8HatchLock reset",
    )

    g = replace_once(
        g,
        """    state.coreTier = 1; // Tier I, II, III, IV, V, VI, VII
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;""",
        """    state.coreTier = 1; // Tier I - VIII
    state.tier6HatchLock = false;
    state.tier7HatchLock = false;
    state.tier8HatchLock = false;""",
        "startReflexGame tier8HatchLock reset",
    )

    g = replace_once(
        g,
        """              const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
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
            }
            state.reflexLives--;
            state.consecutivePerfects = 0;
            state.resonanceChain = 0;
            audio.playHazardExplosion();""",
        """              const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
              state.combo = tierFloorCombo[state.coreTier] || 0;
              if (state.coreTier < 8) state.tier8HatchLock = false;
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
              state.tier8HatchLock = false;
            }
            state.reflexLives--;
            state.consecutivePerfects = 0;
            state.resonanceChain = 0;
            audio.playHazardExplosion();""",
        "hazard downgrade T8",
    )

    g = replace_once(
        g,
        """            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
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
        """            const tierFloorCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
            state.combo = tierFloorCombo[state.coreTier] || 0;
            if (state.coreTier < 8) state.tier8HatchLock = false;
            if (state.coreTier < 7) state.tier7HatchLock = false;
            if (state.coreTier < 6) {
              state.tier6HatchLock = false;
              if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
            }
          } else {
            state.combo = 0;
            state.tier6HatchLock = false;
            state.tier7HatchLock = false;
            state.tier8HatchLock = false;
            if (typeof Tier6HatchSystem !== 'undefined') Tier6HatchSystem.cancel();
          }""",
        "missed node downgrade T8",
    )

    g = replace_once(
        g,
        """    // Cycle Tier (I -> II -> III -> IV -> V -> VI -> VII -> I) on clicking the TIER pill or pressing 'T'
    function cycleCoreTier() {
      if (!state.active) return;
      const curT = state.coreTier || 1;
      const nextTierCombo = { 1: 7, 2: 14, 3: 21, 4: 28, 5: 35, 6: 65, 7: 0 };
      const nextT = (curT >= 7) ? 1 : (curT + 1);
      state.combo = (nextTierCombo[curT] !== undefined) ? nextTierCombo[curT] : 0;
      if (nextT < 7) state.tier7HatchLock = false;""",
        """    // Cycle Tier (I -> II -> III -> IV -> V -> VI -> VII -> VIII -> I) on clicking the TIER pill or pressing 'T'
    function cycleCoreTier() {
      if (!state.active) return;
      const curT = state.coreTier || 1;
      const nextTierCombo = { 1: 7, 2: 14, 3: 21, 4: 28, 5: 35, 6: 65, 7: 90, 8: 0 };
      const nextT = (curT >= 8) ? 1 : (curT + 1);
      state.combo = (nextTierCombo[curT] !== undefined) ? nextTierCombo[curT] : 0;
      if (nextT < 8) state.tier8HatchLock = false;
      if (nextT < 7) state.tier7HatchLock = false;""",
        "cycleCoreTier T8",
    )

    g = replace_once(
        g,
        """    setTier: (t, allowHatch = true) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 65;
      if ((Number(t) || 1) < 7) state.tier7HatchLock = false;""",
        """    setTier: (t, allowHatch = true) => {
      const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
      state.combo = (nextCombo[t] !== undefined) ? nextCombo[t] : 90;
      if ((Number(t) || 1) < 8) state.tier8HatchLock = false;
      if ((Number(t) || 1) < 7) state.tier7HatchLock = false;""",
        "window.chromeSynapseGame.setTier T8",
    )

    g = replace_once(
        g,
        """          if (cParam >= 1 || (t >= 1 && t <= 7)) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65 };
              const targetC = (cParam >= 1) ? cParam : ((nextCombo[t] !== undefined) ? nextCombo[t] : 65);""",
        """          if (cParam >= 1 || (t >= 1 && t <= 8)) {
            setTimeout(() => {
              const nextCombo = { 1: 0, 2: 7, 3: 14, 4: 21, 5: 28, 6: 50, 7: 65, 8: 90 };
              const targetC = (cParam >= 1) ? cParam : ((nextCombo[t] !== undefined) ? nextCombo[t] : 90);""",
        "checkUrlAutoLaunch T8",
    )

    g = g.replace("arcade427_t7_evolution_audio", "arcade428_tier8_sovereign")
    g_path.write_text(g, encoding="utf-8")
    print("PATCHED -> game.js")


if __name__ == "__main__":
    main()
