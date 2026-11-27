import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade420_luxury_nodes"
NEW_V = "arcade413_shield_relics"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")

old_relic_tail = """          for (let st = 0; st < 2; st++) {
            const sa = gyroSpin + st * Math.PI;
            const sx = Math.cos(sa) * ringRx;
            const sy = Math.sin(sa) * ringRx * 0.36;
            if (Math.sin(sa) >= -0.15) {
              CoreKinematics._drawStarGlint(ctx, sx, sy, 8.5 * scale, st === 0 ? relicMeta.starA : relicMeta.starB);
            }
          }
          ctx.restore();"""

new_relic_tail = """          for (let st = 0; st < 2; st++) {
            const sa = gyroSpin + st * Math.PI;
            const sx = Math.cos(sa) * ringRx;
            const sy = Math.sin(sa) * ringRx * 0.36;
            if (Math.sin(sa) >= -0.15) {
              CoreKinematics._drawStarGlint(ctx, sx, sy, 8.5 * scale, st === 0 ? relicMeta.starA : relicMeta.starB);
            }
          }
          ctx.restore();

          // v413 Enhancement: Dual Counter-Rotating Platinum Astrolabe Ring & Diagonal Specular Light Sweep on Shield Relics!
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
          }"""

if game.count(old_relic_tail) != 1:
    raise RuntimeError("Could not find unique old_relic_tail anchor")
game = game.replace(old_relic_tail, new_relic_tail, 1)
game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")

sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v420_luxury_nodes", "orlandochrome-arcade-v413_shield_relics")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V413_OK")
