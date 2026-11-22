import os
import re

html_path = r"C:\Users\Orlando\.gemini\antigravity\scratch\chrome-taskbar-command-center\tier6_10_motion_preview.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Telemetry Panel CSS: min-width 430px, max-width 490px, white-space: nowrap
html = re.sub(
    r'(#telemetry-panel\s*\{[^}]*?min-width:\s*)320px;(\s*max-width:\s*)380px;',
    r'\g<1>430px;\g<2>500px;\n      white-space: nowrap;',
    html
)

# 2. Update Asset Manifest to load head_left for all characters
old_manifest_loop = """        assetManifest[`${k}_dir_left`] = `assets/characters/rigs/${k}_dir_left.png`;
        assetManifest[`${k}_dir_right`] = `assets/characters/rigs/${k}_dir_right.png`;
        assetManifest[`${k}_dir_turn`] = `assets/characters/rigs/${k}_dir_turn.png`;"""

new_manifest_loop = """        assetManifest[`${k}_head_left`] = `assets/characters/rigs/${k}_head_left.png`;
        assetManifest[`${k}_dir_left`] = `assets/characters/rigs/${k}_dir_left.png`;
        assetManifest[`${k}_dir_right`] = `assets/characters/rigs/${k}_dir_right.png`;
        assetManifest[`${k}_dir_turn`] = `assets/characters/rigs/${k}_dir_turn.png`;"""

html = html.replace(old_manifest_loop, new_manifest_loop)

# 3. High-Contrast Studio Backdrop for Silhouette Only Mode
old_sil_bg = """      if (state.silhouetteMode) {
        // High-contrast clean neutral backdrop for silhouette inspection
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1920, 1080);
        return;
      }"""

new_sil_bg = """      if (state.silhouetteMode) {
        // High-contrast illuminated lightbox studio backdrop for 100% silhouette readability!
        const studioGrad = ctx.createRadialGradient(960, 540, 60, 960, 540, 980);
        studioGrad.addColorStop(0, '#f8fafc');   // Pure illuminated lightbox center
        studioGrad.addColorStop(0.55, '#cbd5e1'); // Light silver-slate
        studioGrad.addColorStop(1, '#64748b');   // Studio neutral rim
        ctx.fillStyle = studioGrad;
        ctx.fillRect(0, 0, 1920, 1080);

        // Technical Studio Motion Alignment Grid
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.10)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 1920; x += 120) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1080);
          ctx.stroke();
        }
        for (let y = 0; y <= 1080; y += 120) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1920, y);
          ctx.stroke();
        }
        return;
      }"""

html = html.replace(old_sil_bg, new_sil_bg)

# 4. Update Head Rendering in drawRiggedCharacter to use directional head (head_right vs head_left)
# and clean natural eyelash blinking
old_head_render = """      if (imgHead) {
        ctx.drawImage(imgHead, -targetW / 2, -targetH / 2 - neckY, targetW, targetH);
      }

      // Natural Eyelid Blinking Overlay
      if (p.blinkClosed > 0.05 && !state.silhouetteMode) {
        ctx.save();
        ctx.fillStyle = game === 'dynamo' ? '#c084fc' : game === 'helix' ? '#67e8f9' : '#ea580c';
        // Eye positions relative to head center
        const eyeL_x = -16 + (p.yaw * 8);
        const eyeR_x = +16 + (p.yaw * 8);
        const eye_y = -8;
        const blinkH = 7 * p.blinkClosed;

        // Eyelid curves
        ctx.beginPath();
        ctx.ellipse(eyeL_x, eye_y, 7, blinkH, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeR_x, eye_y, 7, blinkH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }"""

new_head_render = """      // Directional Head: Facing right uses canonical head, facing left uses left-aligned head!
      // Underneath, the torso layer has the head completely masked out, guaranteeing 0 ghosting!
      const activeHead = isFacingRight ? (images[`${baseKey}_head`] || imgHead) : (images[`${baseKey}_head_left`] || imgHead);
      if (activeHead) {
        ctx.drawImage(activeHead, -targetW / 2, -targetH / 2 - neckY, targetW, targetH);
      }

      // Natural Anatomical Eyelid Blinking (Graceful lash curve & soft lid, no dark brow discs!)
      if (p.blinkClosed > 0.08 && !state.silhouetteMode) {
        ctx.save();
        const eyeL_x = -18 + (p.yaw * 8);
        const eyeR_x = +18 + (p.yaw * 8);
        const eye_y = -8 + p.blinkClosed * 3.5;

        // Soft skin/eyelid tint
        ctx.fillStyle = game === 'dynamo' ? 'rgba(254, 240, 230, 0.90)' : game === 'helix' ? 'rgba(238, 242, 255, 0.90)' : 'rgba(40, 20, 10, 0.90)';
        ctx.beginPath();
        ctx.ellipse(eyeL_x, eye_y - 2, 8, 4 * p.blinkClosed, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeR_x, eye_y - 2, 8, 4 * p.blinkClosed, 0, 0, Math.PI * 2);
        ctx.fill();

        // Elegant curved eyelash line
        ctx.strokeStyle = game === 'dynamo' ? '#3b0764' : game === 'helix' ? '#083344' : '#1c1917';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(eyeL_x, eye_y, 8, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyeR_x, eye_y, 8, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();
        ctx.restore();
      }"""

html = html.replace(old_head_render, new_head_render)

# 5. Articulated Claw Tucking in Meteor Dragon VFX
old_meteor_vfx = """    // ─── METEOR DRAGON CONTINUOUS MOVING FIRE (Requirement 5) ───
    function drawMeteorDragonVFX(tw, th, p) {
      ctx.save();
      for (let i = 0; i < p.flameParticles.length; i++) {"""

new_meteor_vfx = """    // ─── METEOR DRAGON CONTINUOUS MOVING FIRE & ARTICULATED CLAWS (Requirement 5) ───
    function drawMeteorDragonVFX(tw, th, p) {
      ctx.save();

      // Articulated Basalt Claws: Spread in hover/braking, tightly tucked back during aerodynamic glide!
      if (!state.silhouetteMode) {
        ctx.save();
        const tuckY = p.clawsTucked * 20.0;
        const clawW = 10.0 - p.clawsTucked * 4.0;
        const clawH = 16.0 - p.clawsTucked * 8.0;
        const clawY = th * 0.18 - tuckY;

        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 8;

        [-tw * 0.11, tw * 0.11].forEach(cx => {
          ctx.beginPath();
          ctx.ellipse(cx, clawY, clawW, clawH, p.clawsTucked * 0.35 * (cx > 0 ? 1 : -1), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
        ctx.restore();
      }

      for (let i = 0; i < p.flameParticles.length; i++) {"""

html = html.replace(old_meteor_vfx, new_meteor_vfx)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Successfully applied motion studio visual fixes to tier6_10_motion_preview.html!")
