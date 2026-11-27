import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade417_sculpted_bad_cores"
NEW_V = "arcade418_apex_bad_vfx"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")


def replace_exact(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    if cnt != 1:
        raise RuntimeError(f"[{label}] Expected 1 occurrence, found {cnt}")
    return text.replace(old, new, 1)


# 1. Hyper-Comet: Supersonic V-Curved Plasma Bow-Shock Arc at Leading Nose
game = replace_exact(
    game,
    """          // Subtle Re-Entry Heat Sheen hugging leading bottom edge
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const leadGlow = ctx.createRadialGradient(0, targetR * 0.45, 0, 0, targetR * 0.35, targetR * 1.25);""",
    """          // v418: Supersonic Plasma Bow-Shock Arc + Re-Entry Heat Sheen hugging leading edge
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(0, targetR * 0.24, targetR * 1.16, 0.20 * Math.PI, 0.80 * Math.PI);
          ctx.strokeStyle = `rgba(254, 240, 138, ${0.85 * flicker})`;
          ctx.lineWidth = 3.2 * scale;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, targetR * 0.28, targetR * 1.24, 0.24 * Math.PI, 0.76 * Math.PI);
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.58 * flicker})`;
          ctx.lineWidth = 5.4 * scale;
          ctx.stroke();

          const leadGlow = ctx.createRadialGradient(0, targetR * 0.45, 0, 0, targetR * 0.35, targetR * 1.25);""",
    "hyper_comet bow-shock",
)

# 2. Corruptor Overlord: Counter-Rotating Precision Crimson-Gold Target Lock Brackets
game = replace_exact(
    game,
    """          // 3. Blinding Live Optical Emitter Pulse & Anamorphic Lens Flare on Charge / Laser Fire
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';""",
    """          // 3. v418 Counter-Rotating Dreadnought Optical Target Lock Reticle + Lens Flare
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          const lockRot = -now * 0.0018 + animPhase;
          const lockR = targetR * (1.26 + charge * 0.14);
          for (let q = 0; q < 4; q++) {
            const qa = lockRot + q * (Math.PI * 0.5);
            ctx.beginPath();
            ctx.arc(0, 0, lockR, qa - 0.24, qa + 0.24);
            ctx.strokeStyle = (q % 2 === 0) ? `${mPal.primary}${0.72 + charge * 0.25})` : `rgba(253, 224, 71, ${0.65 + charge * 0.30})`;
            ctx.lineWidth = 2.4 * scale;
            ctx.stroke();
          }""",
    "corruptor lock reticle",
)

# 3. Gravity Well: Tilted 3D Relativistic Black-Hole Accretion Photon Lensing Ring
game = replace_exact(
    game,
    """          // 1. Soft Volumetric Tidal Gravity Distortion Aura
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';""",
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
          ctx.restore();""",
    "gravity_well photon ring back",
)
game = replace_exact(
    game,
    """          // 3. Tilted Relativistic Accretion Streaks Spiraling Inward Into Event Horizon
          ctx.save();""",
    """          // 3. Tilted Relativistic Front Photon Ring + Accretion Streaks Spiraling Inward
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.save();
          ctx.rotate((modeKey === 'dynamo') ? -0.30 : (modeKey === 'meteor' ? -0.18 : 0.14));
          ctx.scale(1.0, 0.38);
          ctx.strokeStyle = (modeKey === 'meteor') ? 'rgba(52, 211, 153, 0.85)' : 'rgba(253, 224, 71, 0.82)';
          ctx.lineWidth = 2.8 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, targetR * 1.56, 0, Math.PI);
          ctx.stroke();
          ctx.restore();""",
    "gravity_well photon ring front",
)

# 4. EMP Shock-Mine: 4 Live Crackling Perimeter Coil Arcs
game = replace_exact(
    game,
    """          // 3. Central Pressurized Reactor Surge Flash when approaching 100% charge""",
    """          // 2b. v418 Live Crackling Perimeter Coil Overload Arcs
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          const empTick = Math.floor(now / 56);
          const coilR = targetR * 1.24;
          for (let c = 0; c < 4; c++) {
            const ca0 = mineRot + c * (Math.PI * 0.5) + 0.18;
            const ca1 = ca0 + 0.42;
            const cam = (ca0 + ca1) * 0.5;
            const jit = Math.sin(empTick * 4.1 + c * 2.9) * 5.5 * scale;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ca0) * coilR, Math.sin(ca0) * coilR);
            ctx.lineTo(Math.cos(cam) * (coilR + jit), Math.sin(cam) * (coilR + jit));
            ctx.lineTo(Math.cos(ca1) * coilR, Math.sin(ca1) * coilR);
            ctx.strokeStyle = `${empOuterCol}${0.72 + empCharge * 0.25})`;
            ctx.lineWidth = 2.0 * scale;
            ctx.stroke();
          }
          ctx.restore();

          // 3. Central Pressurized Reactor Surge Flash when approaching 100% charge""",
    "emp coil arcs",
)

# 5. Phase Stalker: Twin Horizontal Quantum Phase Ghost Echoes
game = replace_exact(
    game,
    """          // 2. Game-Matched Luxury Raytraced Split Rift Core Sprite with Quantum Phase Breathing!
          const phSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].phase_stalker;
          const phLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].phase_stalker;
          if (phSpr && phLoaded) {
            const basePhSize = (modeKey === 'helix' || modeKey === 'meteor') ? 178 : 166;
            const sprSize = basePhSize * scale * (1.0 + Math.sin(now * 0.008 + animPhase) * 0.035);
            const swayAng = Math.sin(now * 0.0025 + animPhase) * 0.14;
            ctx.save();
            // Subtle phase-flicker while keeping luxury split-core silhouette sharp & legible!
            if (isTelegraphing) {
              ctx.globalAlpha = Math.max(0.74, 1.0 - blinkProg * 0.22 + Math.sin(now * 0.045) * 0.08);
            }
            ctx.rotate(swayAng);
            ctx.drawImage(phSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }""",
    """          // 2. Game-Matched Luxury Raytraced Split Rift Core Sprite + Twin Quantum Phase Ghost Echoes (v418)!
          const phSpr = LayeredT4Assets.poweredHazard[modeKey] && LayeredT4Assets.poweredHazard[modeKey].phase_stalker;
          const phLoaded = LayeredT4Assets.loaded.poweredHazard[modeKey] && LayeredT4Assets.loaded.poweredHazard[modeKey].phase_stalker;
          if (phSpr && phLoaded) {
            const basePhSize = (modeKey === 'helix' || modeKey === 'meteor') ? 178 : 166;
            const sprSize = basePhSize * scale * (1.0 + Math.sin(now * 0.008 + animPhase) * 0.035);
            const swayAng = Math.sin(now * 0.0025 + animPhase) * 0.14;
            const echoShift = (6.0 + 4.5 * Math.sin(now * 0.018 + animPhase) + blinkProg * 12) * scale;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.22 + blinkProg * 0.16;
            ctx.drawImage(phSpr, -sprSize * 0.5 - echoShift, -sprSize * 0.5, sprSize, sprSize);
            ctx.drawImage(phSpr, -sprSize * 0.5 + echoShift, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();

            ctx.save();
            if (isTelegraphing) {
              ctx.globalAlpha = Math.max(0.74, 1.0 - blinkProg * 0.22 + Math.sin(now * 0.045) * 0.08);
            }
            ctx.rotate(swayAng);
            ctx.drawImage(phSpr, -sprSize * 0.5, -sprSize * 0.5, sprSize, sprSize);
            ctx.restore();
          }""",
    "phase_stalker ghost echoes",
)

game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v417_sculpted_bad_cores", "orlandochrome-arcade-v418_apex_bad_vfx")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V418_OK")
