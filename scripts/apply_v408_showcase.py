"""Deterministic updater for v408:
1. Preloads Tier VI Character Showcase Renders (core-{dynamo,helix,meteor}-t6-showcase.png).
2. Uses Character Showcase Render for all presentation views (#ocRealmPortalCard hover portal,
   isPortalPreview=true, and #cgScreenOverlay presentation stage).
3. Enforces 100% strict In-Game Model weapon hiding while idle (requiring split bodyOk and
   gating gunDeployT on wantsFire so even 0-ammo holds never deploy weapons; shows ONLY while
   actively firing or casting Skill 2 / Ultimate).
4. Bumps SW/app/HTML/DB cache tags to arcade408_tier6_showcase / v408_tier6_showcase.
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

g = g.replace("arcade407_strip_mesh", "arcade408_tier6_showcase")
g = g.replace("arcade406_tier6_grand_3d", "arcade408_tier6_showcase")
g = g.replace("v406_tier6_grand_3d", "v408_tier6_showcase")

# Register coreT6Showcase in LayeredT4Assets
g = replace_once(
    g,
    """    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
    """    coreT6Body: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Guns: { dynamo: new Image(), helix: new Image(), meteor: new Image() },
    coreT6Showcase: { dynamo: new Image(), helix: new Image(), meteor: new Image() },""",
    "LayeredT4Assets coreT6Showcase",
)
g = replace_once(
    g,
    """      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },""",
    """      coreT6Body: { dynamo: false, helix: false, meteor: false },
      coreT6Guns: { dynamo: false, helix: false, meteor: false },
      coreT6Showcase: { dynamo: false, helix: false, meteor: false },""",
    "LayeredT4Assets loaded.coreT6Showcase",
)
g = replace_once(
    g,
    """    LayeredT4Assets.coreT6Guns[m].onload = () => { LayeredT4Assets.loaded.coreT6Guns[m] = true; };
    LayeredT4Assets.coreT6Guns[m].src = `assets/core-${m}-t6-guns.png?v=arcade408_tier6_showcase`;""",
    """    LayeredT4Assets.coreT6Guns[m].onload = () => { LayeredT4Assets.loaded.coreT6Guns[m] = true; };
    LayeredT4Assets.coreT6Guns[m].src = `assets/core-${m}-t6-guns.png?v=arcade408_tier6_showcase`;

    LayeredT4Assets.coreT6Showcase[m].onload = () => { LayeredT4Assets.loaded.coreT6Showcase[m] = true; };
    LayeredT4Assets.coreT6Showcase[m].src = `assets/core-${m}-t6-showcase.png?v=arcade408_tier6_showcase`;""",
    "LayeredT4Assets coreT6Showcase src",
)

# Strict bodyOk requirement in _getTier6ArticulatedRig so In-Game Model NEVER flashes baked-gun sprite while idle
g = replace_once(
    g,
    """      const spr = bodyOk ? bodySpr : (LayeredT4Assets.coreTierSprites[mKey] && LayeredT4Assets.coreTierSprites[mKey][6]);
      const sprLoaded = bodyOk || (LayeredT4Assets.loaded.coreTierSprites[mKey] && LayeredT4Assets.loaded.coreTierSprites[mKey][6]);
      if (!spr || !sprLoaded) return null;""",
    """      // Strictly require weaponless coreT6Body so idle In-Game Model never renders shoulder weapons
      if (!bodyOk || !bodySpr) return null;
      const spr = bodySpr;""",
    "Strict weaponless bodyOk in _getTier6ArticulatedRig",
)

# Add drawCharacterShowcase & wire isPortalPreview in _drawTier6Character
g = replace_once(
    g,
    """    // Playable Tier VI Seamless Strip-Mesh 3D Model Renderer (Meteor Dragon · Helix Unicorn · Dynamo Princess)
    _drawTier6Character(ctx, mode, cx, cy, u, now, isPortalPreview = false, opts = null) {
      const mKey = (mode === 'realm') ? 'dynamo' : (mode || 'dynamo');
      const rig = this._getTier6ArticulatedRig(mKey);""",
    """    // Character Showcase Render (Three-Quarter Front Presentation View: Face, Crystal Horn/Crown, Wings & Armor)
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
      const rig = this._getTier6ArticulatedRig(mKey);""",
    "drawCharacterShowcase + isPortalPreview delegation",
)

# Gate gunDeployT strictly on wantsFire (only when actively firing with ammo > 0!)
g = replace_once(
    g,
    """      if (isFiringActive) {
        state.gunDeployT = 1.0;
      } else {
        const retractStep = 0.35 * Math.max(0.5, Math.min(2.5, dtScale || 1));
        state.gunDeployT = Math.max(0, (state.gunDeployT || 0) - retractStep);
      }

      // Flash red when holding gun at 0 ammo WITHOUT dropping the held touch pointer!
      if ((isGunTouchHeld || isKeyAHeld) && (state.coreAmmo || 0) <= 0) {
        TouchFireControls.flashEmpty();
      }

      const wantsFire = isFiringActive && (state.coreAmmo || 0) > 0 && state.roundPhase !== 'cleared';""",
    """      // Flash red when holding gun at 0 ammo WITHOUT dropping the held touch pointer!
      if ((isGunTouchHeld || isKeyAHeld) && (state.coreAmmo || 0) <= 0) {
        TouchFireControls.flashEmpty();
      }

      const wantsFire = isFiringActive && (state.coreAmmo || 0) > 0 && state.roundPhase !== 'cleared';
      // Strictly hide weapons while idle (including 0-ammo dry holds); show ONLY while firing or casting!
      if (wantsFire) {
        state.gunDeployT = 1.0;
      } else {
        const retractStep = 0.35 * Math.max(0.5, Math.min(2.5, dtScale || 1));
        state.gunDeployT = Math.max(0, (state.gunDeployT || 0) - retractStep);
      }""",
    "Strict wantsFire gunDeployT gating",
)

# Record maxTierReached in evaluateCoreTierFromCombo
g = replace_once(
    g,
    """    state.prevEvaluatedCombo = c;
  }""",
    """    state.maxTierReached = Math.max(state.maxTierReached || 1, state.coreTier || 1);
    state.prevEvaluatedCombo = c;
  }""",
    "maxTierReached in evaluateCoreTierFromCombo",
)

# Use Character Showcase Render in #cgScreenOverlay presentation debrief & support TIER VI
g = replace_once(
    g,
    """          emblem: 'assets/btn-obj-dynamo-4k.png?v=arcade384',""",
    """          emblem: 'assets/core-dynamo-t6-showcase.png?v=arcade408_tier6_showcase',""",
    "Debrief dynamo showcase emblem",
)
g = replace_once(
    g,
    """          emblem: 'assets/btn-obj-helix-4k.png?v=arcade384',""",
    """          emblem: 'assets/core-helix-t6-showcase.png?v=arcade408_tier6_showcase',""",
    "Debrief helix showcase emblem",
)
g = replace_once(
    g,
    """          emblem: 'assets/btn-obj-meteor-4k.png?v=arcade384',""",
    """          emblem: 'assets/core-meteor-t6-showcase.png?v=arcade408_tier6_showcase',""",
    "Debrief meteor showcase emblem",
)
g = replace_once(
    g,
    """      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V' }[peakTier] || 'TIER I';""",
    """      const tierRoman = { 1: 'TIER I', 2: 'TIER II', 3: 'TIER III', 4: 'TIER IV', 5: 'TIER V', 6: 'TIER VI' }[peakTier] || 'TIER I';""",
    "Debrief tierRoman TIER VI",
)
g = replace_once(
    g,
    """      if (rnd >= 5 || state.score >= 50000 || bossesSlain >= 4) { grade = 'S+'; gradeCls = 'oc-go-grade-splus'; }""",
    """      if (rnd >= 5 || state.score >= 50000 || bossesSlain >= 4 || peakTier >= 6) { grade = 'S+'; gradeCls = 'oc-go-grade-splus'; }""",
    "Debrief S+ rank for Tier VI",
)
g = replace_once(
    g,
    """      if (realmEmbWrap) realmEmbWrap.style.display = 'flex';
      if (realmEmbImg) realmEmbImg.src = cfg.emblem;""",
    """      if (realmEmbWrap) {
        realmEmbWrap.style.display = 'flex';
        realmEmbWrap.classList.add('oc-showcase-stage');
      }
      if (realmEmbImg) realmEmbImg.src = cfg.emblem;""",
    "Debrief oc-showcase-stage class",
)

# Upgrade Topbar Hover Presentation Card (#ocRealmPortalCard) to Character Showcase Render
g = replace_once(
    g,
    """  const REALM_META = {
    dynamo: {
      title: 'CHROME DYNAMO · SERAPHIC ARCHON',
      tierTag: '⚡ TIER V SUPREME ASCENDANT',
      science: 'Faraday–Maxwell Plasma Physics · Branching Lichtenberg Lightning & Chain Induction',
      bestKey: 'oc_best_realm',
      portalScale: 0.245,
      portalCy: 0.54,
      moteColors: ['#38bdf8', '#c084fc', '#fde68a']
    },
    helix: {
      title: 'CHROME HELIX · PRISM ARCHON',
      tierTag: '🧬 TIER V SUPREME ASCENDANT',
      science: 'Quantum Molecular Biogenesis · 3D Photonic DNA Double-Helix & Base-Pair Resonance',
      bestKey: 'oc_best_helix',
      portalScale: 0.245,
      portalCy: 0.54,
      moteColors: ['#22d3ee', '#e879f9', '#f0f9ff']
    },
    meteor: {
      title: 'CHROME METEOR · MAGNETAR SERAPH',
      tierTag: '☄️ TIER V SUPREME ASCENDANT',
      science: 'Hypervelocity Chondritic Ablation · Solar Bow-Shock Fire & Kinetic Slingshot Deflection',
      bestKey: 'oc_best_meteor',
      portalScale: 0.245,
      portalCy: 0.54,
      moteColors: ['#fde047', '#fb923c', '#f97316']
    }
  };""",
    """  const REALM_META = {
    dynamo: {
      title: 'CHROME DYNAMO · DYNAMO PRINCESS',
      tierTag: '⚡ TIER VI SHOWCASE',
      science: 'Faraday–Maxwell Plasma Physics · Crystal Wings, Twin Tesla Cannons & Storm Astrolabe',
      bestKey: 'oc_best_realm',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#38bdf8', '#c084fc', '#fde68a']
    },
    helix: {
      title: 'CHROME HELIX · HELIX UNICORN',
      tierTag: '🧬 TIER VI SHOWCASE',
      science: 'Quantum Molecular Biogenesis · Cyan Crystal Horn, Iridescent Wings & Chiral Prism',
      bestKey: 'oc_best_helix',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#22d3ee', '#e879f9', '#f0f9ff']
    },
    meteor: {
      title: 'CHROME METEOR · METEOR DRAGON',
      tierTag: '☄️ TIER VI SHOWCASE',
      science: 'Hypervelocity Chondritic Ablation · Volcanic Armor, Magma Wings & Caldera Breath',
      bestKey: 'oc_best_meteor',
      portalScale: 0.245,
      portalCy: 0.53,
      moteColors: ['#fde047', '#fb923c', '#f97316']
    }
  };""",
    "REALM_META Tier VI Showcase metadata",
)
g = replace_once(
    g,
    """    const PORTAL_W = 266;
    const PORTAL_H = 140;""",
    """    const PORTAL_W = 266;
    const PORTAL_H = 176;""",
    "PORTAL_H = 176",
)
g = replace_once(
    g,
    """      // Render the REAL Seamless Tier V Hexa-Wing Supreme Ascendant Archon (ZERO vertical seam!)
      if (window.QuantumRenderer && typeof window.QuantumRenderer._drawLayeredWingedCore === 'function') {
        const levY = Math.sin(now * 0.0028) * 2.4;
        window.QuantumRenderer._drawLayeredWingedCore(
          pCtx,
          activeHoverRealm,
          w * 0.5,
          h * (meta.portalCy || 0.60) + levY,
          now,
          5,
          meta.portalScale,
          true
        );
      }""",
    """      // Presentation View: Render full-body three-quarter Tier VI Character Showcase Render!
      if (window.QuantumRenderer && typeof window.QuantumRenderer.drawCharacterShowcase === 'function') {
        window.QuantumRenderer.drawCharacterShowcase(
          pCtx,
          activeHoverRealm,
          w * 0.5,
          h * (meta.portalCy || 0.53),
          w * 0.94,
          h * 0.88,
          now
        );
      }""",
    "renderPortalFrame drawCharacterShowcase",
)

with open(g_path, "w", encoding="utf-8", newline=g_nl) as f:
    f.write(g)

# --- 2. Update index.html ---
h_path = os.path.join(ROOT_DIR, "index.html")
h_raw = open(h_path, encoding="utf-8").read()
h_nl = "\r\n" if "\r\n" in h_raw else "\n"
h = h_raw.replace("\r\n", "\n")

h = h.replace("arcade407_strip_mesh", "arcade408_tier6_showcase")
h = h.replace("arcade406_tier6_grand_3d", "arcade408_tier6_showcase")

h = replace_once(
    h,
    """    .oc-portal-stage {
      position: relative !important;
      height: 140px !important;""",
    """    .oc-portal-stage {
      position: relative !important;
      height: 176px !important;""",
    "index.html .oc-portal-stage height 176px",
)
h = replace_once(
    h,
    """    .oc-go-emblem-img {
      width: 106% !important;
      height: 106% !important;
      max-width: none !important;
      object-fit: cover !important;
      filter: saturate(1.12) contrast(1.06) !important;
    }""",
    """    .oc-go-emblem-img {
      width: 106% !important;
      height: 106% !important;
      max-width: none !important;
      object-fit: cover !important;
      filter: saturate(1.12) contrast(1.06) !important;
    }
    @keyframes ocShowcaseFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    .oc-go-emblem-wrap.oc-showcase-stage {
      width: 232px !important;
      height: 154px !important;
      margin: 0 auto 8px !important;
    }
    .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-ring,
    .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-ring-inner {
      display: none !important;
    }
    .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-clip {
      width: 100% !important;
      height: 100% !important;
      border-radius: 14px !important;
      overflow: visible !important;
      background: radial-gradient(ellipse at 50% 54%, rgba(139, 92, 246, 0.22) 0%, rgba(0, 0, 0, 0) 70%) !important;
      box-shadow: none !important;
    }
    #cgScreenOverlay.oc-realm-overlay[data-realm="helix"] .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-clip {
      background: radial-gradient(ellipse at 50% 54%, rgba(34, 211, 238, 0.22) 0%, rgba(0, 0, 0, 0) 70%) !important;
    }
    #cgScreenOverlay.oc-realm-overlay[data-realm="meteor"] .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-clip {
      background: radial-gradient(ellipse at 50% 54%, rgba(249, 115, 22, 0.25) 0%, rgba(0, 0, 0, 0) 70%) !important;
    }
    .oc-go-emblem-wrap.oc-showcase-stage .oc-go-emblem-img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      animation: ocShowcaseFloat 3.4s ease-in-out infinite !important;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.65)) saturate(1.06) !important;
    }""",
    "index.html .oc-showcase-stage styles",
)
h = replace_once(
    h,
    """<img id="cgRealmEmblemImg" class="oc-go-emblem-img" src="assets/core-dynamo-t5.png?v=arcade408_tier6_showcase" alt="" />""",
    """<img id="cgRealmEmblemImg" class="oc-go-emblem-img" src="assets/core-dynamo-t6-showcase.png?v=arcade408_tier6_showcase" alt="" />""",
    "index.html default cgRealmEmblemImg",
)

with open(h_path, "w", encoding="utf-8", newline=h_nl) as f:
    f.write(h)

# --- 3. Update sw.js ---
sw_path = os.path.join(ROOT_DIR, "sw.js")
sw_raw = open(sw_path, encoding="utf-8").read()
sw_nl = "\r\n" if "\r\n" in sw_raw else "\n"
sw = sw_raw.replace("\r\n", "\n")

sw = sw.replace("orlandochrome-arcade-v406_tier6_grand_3d", "orlandochrome-arcade-v408_tier6_showcase")
sw = sw.replace("orlandochrome-arcade-v407_strip_mesh", "orlandochrome-arcade-v408_tier6_showcase")
sw = sw.replace("arcade407_strip_mesh", "arcade408_tier6_showcase")
sw = sw.replace("arcade406_tier6_grand_3d", "arcade408_tier6_showcase")

if "core-dynamo-t6-showcase.png" not in sw:
    sw = replace_once(
        sw,
        "  './assets/core-dynamo-t6-guns.png?v=arcade408_tier6_showcase',",
        "  './assets/core-dynamo-t6-guns.png?v=arcade408_tier6_showcase',\n  './assets/core-dynamo-t6-showcase.png?v=arcade408_tier6_showcase',",
        "sw dynamo showcase",
    )
    sw = replace_once(
        sw,
        "  './assets/core-helix-t6-guns.png?v=arcade408_tier6_showcase',",
        "  './assets/core-helix-t6-guns.png?v=arcade408_tier6_showcase',\n  './assets/core-helix-t6-showcase.png?v=arcade408_tier6_showcase',",
        "sw helix showcase",
    )
    sw = replace_once(
        sw,
        "  './assets/core-meteor-t6-guns.png?v=arcade408_tier6_showcase',",
        "  './assets/core-meteor-t6-guns.png?v=arcade408_tier6_showcase',\n  './assets/core-meteor-t6-showcase.png?v=arcade408_tier6_showcase',",
        "sw meteor showcase",
    )

with open(sw_path, "w", encoding="utf-8", newline=sw_nl) as f:
    f.write(sw)

# --- 4. Update app.js & core-geometry-db.json ---
for rel in ("app.js", "assets/core-geometry-db.json"):
    p = os.path.join(ROOT_DIR, rel)
    raw = open(p, encoding="utf-8").read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    txt = raw.replace("\r\n", "\n")
    txt = txt.replace("arcade407_strip_mesh", "arcade408_tier6_showcase")
    txt = txt.replace("arcade406_tier6_grand_3d", "arcade408_tier6_showcase")
    txt = txt.replace("v407_strip_mesh", "v408_tier6_showcase")
    txt = txt.replace("v406_tier6_grand_3d", "v408_tier6_showcase")
    with open(p, "w", encoding="utf-8", newline=nl) as f:
        f.write(txt)

print("SUCCESS: Applied all v408 Showcase Presentation & Strict Idle Weapon Hiding updates!")
