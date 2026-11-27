import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade413_shield_relics"
NEW_V = "arcade414_sanctuary_aegis"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")

old_layer1 = """      // LAYER 1: Radiant Sanctuary Dome Aura + Soft Interior Jewel Sheen
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.28 * warnPulse;
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'gold');
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.25, -r * 1.25, r * 2.5, r * 2.5);

      const sheen = ctx.createRadialGradient(0, -r * 0.18, r * 0.45, 0, 0, r * 0.94);
      sheen.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
      sheen.addColorStop(0.74, isDyn ? `rgba(56, 189, 248, ${0.07 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.08 * warnPulse})` : `rgba(251, 191, 36, ${0.08 * warnPulse})`));
      sheen.addColorStop(0.95, isDyn ? `rgba(251, 191, 36, ${0.14 * warnPulse})` : (isHel ? `rgba(232, 121, 249, ${0.14 * warnPulse})` : `rgba(251, 146, 60, ${0.15 * warnPulse})`));
      sheen.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.94, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();"""

new_layer1 = """      // LAYER 1: 3D Spherical Fresnel Refractive Force-Dome Lens & Glass Crescent Caustics (v414)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.26 * warnPulse;
      const sprKey = isDyn ? 'cyan' : (isHel ? 'helix' : 'gold');
      ctx.drawImage(QuantumRenderer._getGlowSprite(sprKey), -r * 1.25, -r * 1.25, r * 2.5, r * 2.5);
      ctx.globalAlpha = 1.0;

      // Convex spherical dome interior Fresnel tint + caustic glow
      const sheen = ctx.createRadialGradient(-r * 0.22, -r * 0.26, r * 0.08, 0, 0, r * 0.88);
      sheen.addColorStop(0.0, isDyn ? `rgba(224, 242, 254, ${0.05 * warnPulse})` : (isHel ? `rgba(207, 250, 254, ${0.06 * warnPulse})` : `rgba(254, 249, 195, ${0.05 * warnPulse})`));
      sheen.addColorStop(0.55, isDyn ? `rgba(56, 189, 248, ${0.06 * warnPulse})` : (isHel ? `rgba(192, 132, 252, ${0.07 * warnPulse})` : `rgba(251, 146, 60, ${0.06 * warnPulse})`));
      sheen.addColorStop(0.88, isDyn ? `rgba(251, 191, 36, ${0.16 * warnPulse})` : (isHel ? `rgba(34, 211, 238, ${0.16 * warnPulse})` : `rgba(253, 224, 71, ${0.18 * warnPulse})`));
      sheen.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // Upper-left convex crystal-dome specular crescent reflection + faint lower caustic bounce
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, -Math.PI * 0.82, -Math.PI * 0.36);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * warnPulse})`;
      ctx.lineWidth = 4.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.76, -Math.PI * 0.78, -Math.PI * 0.42);
      ctx.strokeStyle = isDyn ? `rgba(125, 211, 252, ${0.22 * warnPulse})` : (isHel ? `rgba(240, 171, 252, ${0.22 * warnPulse})` : `rgba(254, 240, 138, ${0.24 * warnPulse})`);
      ctx.lineWidth = 8.5;
      ctx.stroke();

      // Subtle breathing geodesic hex-lattice caustics inside the sanctuary dome
      const hexRot = now * 0.00035;
      ctx.strokeStyle = isDyn ? `rgba(56, 189, 248, ${0.09 * warnPulse})` : (isHel ? `rgba(103, 232, 249, ${0.10 * warnPulse})` : `rgba(251, 191, 36, ${0.09 * warnPulse})`);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = hexRot + (h * Math.PI / 3);
        const hx = Math.cos(ha) * r * 0.74;
        const hy = Math.sin(ha) * r * 0.74;
        if (h === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();"""

old_dynamo_arcs = """      if (effMode === 'dynamo') {
        // Fine crackling Faraday arcs skipping around the 8 sapphire cabochon mounts
        const tick = Math.floor(now / 58);
        for (let k = 0; k < 8; k++) {
          if (((tick + k) % 3) !== 0) continue;
          const a0 = k * (Math.PI * 0.25) - 0.10;
          const a1 = k * (Math.PI * 0.25) + 0.10;
          const am = (a0 + a1) * 0.5;
          const jit = Math.sin(tick * 4.3 + k * 2.7) * 6.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0) * r * 0.99, Math.sin(a0) * r * 0.99);
          ctx.lineTo(Math.cos(am) * (r * 1.03 + jit), Math.sin(am) * (r * 1.03 + jit));
          ctx.lineTo(Math.cos(a1) * r * 0.99, Math.sin(a1) * r * 0.99);
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.92 * warnPulse})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }"""

new_dynamo_arcs = """      if (effMode === 'dynamo') {
        // v414: Smooth Tangent Faraday Plasma Arcs + Sapphire Mount Star-Glints (Zero Jagged Corners!)
        for (let k = 0; k < 4; k++) {
          const baseA = now * 0.0012 + k * (Math.PI * 0.5);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.98, baseA - 0.14, baseA + 0.14);
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.78 * warnPulse})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          this._drawStarGlint(ctx, Math.cos(baseA) * r * 0.98, Math.sin(baseA) * r * 0.98, 5.2 * warnPulse, (k % 2 === 0) ? '#fde047' : '#e0f2fe');
        }"""

old_impacts = """          ctx.globalAlpha = fade * 0.95;
          ctx.strokeStyle = '#fef9c3';
          ctx.lineWidth = 3.8 * fade;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1.03 + prog * 0.14), imp.angle - 0.52, imp.angle + 0.52);
          ctx.stroke();

          ctx.strokeStyle = crushCol;
          ctx.lineWidth = 5.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 12 + prog * 42, imp.angle - 1.15, imp.angle + 1.15);
          ctx.stroke();

          for (let ray = -2; ray <= 2; ray++) {
            const ra = imp.angle + ray * 0.28;
            const r0 = 8 + prog * 14;
            const r1 = 24 + prog * 48;
            ctx.beginPath();
            ctx.moveTo(ix + Math.cos(ra) * r0, iy + Math.sin(ra) * r0);
            ctx.lineTo(ix + Math.cos(ra) * r1, iy + Math.sin(ra) * r1);
            ctx.strokeStyle = (ray % 2 === 0) ? '#ffffff' : crushCol;
            ctx.lineWidth = 2.4 * fade;
            ctx.stroke();
          }
          this._drawStarGlint(ctx, ix, iy, 14 * fade, '#ffffff');"""

new_impacts = """          // v414: Concentric Dual-Wave 24K Gold & Jewel Shock-Ripples + Crisp Outward Anvil Sparks
          ctx.globalAlpha = fade * 0.95;
          ctx.strokeStyle = '#fef9c3';
          ctx.lineWidth = 3.6 * fade;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1.02 + prog * 0.12), imp.angle - 0.48, imp.angle + 0.48);
          ctx.stroke();

          ctx.strokeStyle = crushCol;
          ctx.lineWidth = 4.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 10 + prog * 44, imp.angle - 1.25, imp.angle + 1.25);
          ctx.stroke();

          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.2 * fade;
          ctx.beginPath();
          ctx.arc(ix, iy, 6 + prog * 28, imp.angle - 0.95, imp.angle + 0.95);
          ctx.stroke();

          this._drawStarGlint(ctx, ix, iy, 15 * fade, '#ffffff');
          this._drawStarGlint(ctx, ix + Math.cos(imp.angle) * (12 + prog * 24), iy + Math.sin(imp.angle) * (12 + prog * 24), 8 * fade, crushCol);"""

for label, o, n in [("layer1", old_layer1, new_layer1), ("dynamo arcs", old_dynamo_arcs, new_dynamo_arcs), ("impacts", old_impacts, new_impacts)]:
    if game.count(o) != 1:
        raise RuntimeError(f"Missing unique anchor for {label}")
    game = game.replace(o, n, 1)

game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v413_shield_relics", "orlandochrome-arcade-v414_sanctuary_aegis")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V414_OK")
