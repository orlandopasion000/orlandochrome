import pathlib

ROOT = pathlib.Path(r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center")
OLD_V = "arcade418_apex_bad_vfx"
NEW_V = "arcade419_good_vs_bad_clarity"

game_path = ROOT / "game.js"
game = game_path.read_text(encoding="utf-8")


def replace_exact(text: str, old: str, new: str, label: str) -> str:
    cnt = text.count(old)
    if cnt != 1:
        raise RuntimeError(f"[{label}] Expected 1 occurrence, found {cnt}")
    return text.replace(old, new, 1)


# 1. Good Power-Up Badge: Viewport-Clamped + Crowned Luxury Capsule with Top Golden Star Crest
old_good_badge = """        if (badges[p.nodeClass]) {
          const b = badges[p.nodeClass];
          const bScale = Math.max(0.68, scale);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, -targetR * 1.62 - 3);
          const bFont = `bold ${Math.round(11 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, b.text);
          const padX = 8.5 * bScale;
          const padY = 4.5 * bScale;
          const bw = textW + padX * 2;
          const bh = 17.5 * bScale;
          const bx = -bw * 0.5;
          const by = -bh * 0.5;

          ctx.fillStyle = b.bg;
          ctx.strokeStyle = b.border;
          ctx.lineWidth = 1.6 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 8 * bScale);
          ctx.fill();
          ctx.stroke();

          // Inner champagne-gold luxury filigree hairline & top specular sheen
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
          ctx.lineWidth = 0.8 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx + 1.5 * bScale, by + 1.5 * bScale, bw - 3 * bScale, bh - 3 * bScale, 6.5 * bScale);
          ctx.stroke();

          ctx.fillStyle = b.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.text, 0, 0.5 * bScale);
          ctx.restore();
        }"""

new_good_badge = """        if (badges[p.nodeClass]) {
          const b = badges[p.nodeClass];
          const bScale = Math.max(0.68, scale);
          const flipBelow = (p.y - targetR * 1.62) < 52;
          const yOff = flipBelow ? (targetR * 1.58 + 8) : (-targetR * 1.62 - 3);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, yOff);
          const bFont = `bold ${Math.round(11 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, b.text);
          const padX = 9.0 * bScale;
          const bw = textW + padX * 2;
          const bh = 18.0 * bScale;
          const bx = -bw * 0.5;
          const by = -bh * 0.5;

          ctx.fillStyle = b.bg;
          ctx.strokeStyle = b.border;
          ctx.lineWidth = 1.6 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 8.5 * bScale);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = 'rgba(253, 224, 71, 0.42)';
          ctx.lineWidth = 0.8 * bScale;
          ctx.beginPath();
          ctx.roundRect(bx + 1.5 * bScale, by + 1.5 * bScale, bw - 3 * bScale, bh - 3 * bScale, 7 * bScale);
          ctx.stroke();

          ctx.fillStyle = b.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.text, 0, 0.5 * bScale);

          // Royal 4-point champagne-gold crown star docked cleanly on Good Relics!
          CoreKinematics._drawStarGlint(ctx, 0, flipBelow ? (bh * 0.5 + 3.5 * bScale) : (-bh * 0.5 - 3.5 * bScale), 4.6 * bScale, '#fde047');
          ctx.restore();
        }"""

# 2. Bad Threat Badge: Viewport-Clamped + Chamfered Octagonal Danger Tag Silhouette
old_bad_badge = """        if (showBadPill) {
          const bScale = Math.max(0.66, scale);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, -targetR * 1.62 - 3);
          const bFont = `bold ${Math.round(10.5 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, badLabel);
          const padX = 7.5 * bScale;
          const bw = textW + padX * 2;
          const bh = 16.5 * bScale;
          ctx.fillStyle = 'rgba(28, 6, 14, 0.92)';
          ctx.strokeStyle = (modeKey === 'meteor') ? '#a855f7' : '#f43f5e';
          ctx.lineWidth = 1.5 * bScale;
          ctx.beginPath();
          ctx.roundRect(-bw * 0.5, -bh * 0.5, bw, bh, 7.5 * bScale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fecdd3';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badLabel, 0, 0.5 * bScale);
          ctx.restore();
        }"""

new_bad_badge = """        if (showBadPill) {
          const bScale = Math.max(0.68, scale);
          const flipBelow = (p.y - targetR * 1.62) < 52;
          const yOff = flipBelow ? (targetR * 1.58 + 8) : (-targetR * 1.62 - 3);
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.translate(0, yOff);
          const bFont = `bold ${Math.round(10.5 * bScale)}px system-ui, -apple-system, sans-serif`;
          const textW = this._getBadgeWidth(ctx, bFont, badLabel);
          const padX = 9.0 * bScale;
          const bw = textW + padX * 2;
          const bh = 17.5 * bScale;
          const hx = bw * 0.5;
          const hy = bh * 0.5;
          const cut = 5.5 * bScale;

          // Chamfered octagonal danger tag silhouette (instantly distinct from rounded Good Relic pills!)
          ctx.fillStyle = 'rgba(30, 6, 14, 0.94)';
          ctx.strokeStyle = (modeKey === 'meteor') ? '#c084fc' : '#f43f5e';
          ctx.lineWidth = 1.7 * bScale;
          ctx.beginPath();
          ctx.moveTo(-hx + cut, -hy);
          ctx.lineTo(hx - cut, -hy);
          ctx.lineTo(hx, -hy + cut);
          ctx.lineTo(hx, hy - cut);
          ctx.lineTo(hx - cut, hy);
          ctx.lineTo(-hx + cut, hy);
          ctx.lineTo(-hx, hy - cut);
          ctx.lineTo(-hx, -hy + cut);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fecdd3';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badLabel, 0, 0.5 * bScale);
          ctx.restore();
        }"""

game = replace_exact(game, old_good_badge, new_good_badge, "good badge clarity")
game = replace_exact(game, old_bad_badge, new_bad_badge, "bad badge clarity")

game = game.replace(OLD_V, NEW_V)
game_path.write_text(game, encoding="utf-8")

for fname in ("index.html", "app.js", "sw.js"):
    fp = ROOT / fname
    fp.write_text(fp.read_text(encoding="utf-8").replace(OLD_V, NEW_V), encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
sw = sw.replace("orlandochrome-arcade-v418_apex_bad_vfx", "orlandochrome-arcade-v419_good_vs_bad_clarity")
(ROOT / "sw.js").write_text(sw, encoding="utf-8")
print("APPLIED_V419_OK")
