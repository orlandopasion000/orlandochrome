import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade416_relic_trails_coronation"
NEW_V = "arcade417_sculpted_bad_cores"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")

old_seeker = """          // Upgraded 3D Bladed Hunter-Seeker Shuriken Ring (Replaces Flat 2D Red Triangles!)
          if (p.nodeClass === 'seeker') {
            ctx.save();
            const finRot = now * 0.0042 + animPhase;"""

new_seeker = """          // v417: Upgraded 3D Bladed Hunter-Seeker Shuriken Ring + Crimson Laser Scanner Wedge!
          if (p.nodeClass === 'seeker') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const scanRot = now * 0.0036 + animPhase;
            const scanR = targetR * 1.48;
            const scanG = ctx.createRadialGradient(0, 0, targetR * 0.35, 0, 0, scanR);
            scanG.addColorStop(0.0, 'rgba(244, 63, 94, 0.35)');
            scanG.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
            ctx.fillStyle = scanG;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, scanR, scanRot - 0.36, scanRot + 0.36);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            const finRot = now * 0.0042 + animPhase;"""

if game.count(old_seeker) != 1:
    raise RuntimeError("Missing unique seeker anchor")
game = game.replace(old_seeker, new_seeker, 1)
game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v416_relic_trails_coronation", "orlandochrome-arcade-v417_sculpted_bad_cores")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V417_OK")
