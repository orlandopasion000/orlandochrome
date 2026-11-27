"""Apply v410: Luxury Bottom-Left Virtual Joystick + Mode Switch (STICK / ON-POINT) + Enhanced Buttons."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def replace_once(text, old, new, label):
    count = text.count(old)
    assert count == 1, f"[{label}] Expected 1 match, found {count}"
    return text.replace(old, new, 1)


def update_version_tags(text):
    return (
        text.replace("arcade409_tier6_true3d", "arcade410_luxury_joystick")
            .replace("v409_tier6_true3d", "v410_luxury_joystick")
    )


def patch_index_html():
    path = os.path.join(ROOT, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    old_css_start = "    /* === CHANGED (v395): LUXURY TRANSLUCENT CRYSTAL TOUCH CONTROLS WITH BESPOKE REALM EMBLEMS === */"
    old_css_end = "    .game-btn-icon.oc-btn-active {\n      border-color: rgba(250, 204, 21, 0.72) !important;\n      box-shadow: 0 0 10px rgba(250, 204, 21, 0.35) !important;\n    }"
    i0 = html.index(old_css_start)
    i1 = html.index(old_css_end) + len(old_css_end)

    new_css = """    /* === CHANGED (v410): LUXURY COLLECTOR CRYSTAL VIRTUAL JOYSTICK, MODE PILL & ENHANCED COMBAT BUTTONS === */
    #ocTouchControlCluster {
      position: absolute !important;
      inset: 0 !important;
      pointer-events: none !important;
      z-index: 44 !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    #ocTouchControlCluster.oc-touch-hidden {
      display: none !important;
    }

    /* --- 1. TOUCH STEERING MODE SWITCHER (STICK | ON-POINT) --- */
    #ocTouchModePill {
      position: absolute !important;
      left: max(18px, env(safe-area-inset-left, 18px)) !important;
      bottom: calc(max(18px, env(safe-area-inset-bottom, 18px)) + 158px) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 2px !important;
      padding: 3px !important;
      border-radius: 999px !important;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(5, 8, 20, 0.94) 100%) !important;
      border: 1.4px solid rgba(253, 224, 71, 0.45) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55), 0 0 14px rgba(56, 189, 248, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.18) !important;
      pointer-events: auto !important;
      touch-action: none !important;
      z-index: 46 !important;
      transition: bottom 0.22s cubic-bezier(0.22, 1, 0.36, 1), left 0.22s ease, right 0.22s ease !important;
    }
    #ocTouchControlCluster[data-move-mode="onpoint"] #ocTouchModePill {
      bottom: max(16px, env(safe-area-inset-bottom, 16px)) !important;
    }
    #ocTouchControlCluster.left-handed #ocTouchModePill {
      left: auto !important;
      right: max(18px, env(safe-area-inset-right, 18px)) !important;
    }
    .oc-mode-seg {
      border: 1px solid transparent !important;
      background: transparent !important;
      color: rgba(203, 213, 225, 0.78) !important;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif !important;
      font-size: 8.5px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      padding: 4px 9px !important;
      border-radius: 999px !important;
      cursor: pointer !important;
      touch-action: none !important;
      transition: all 0.16s ease !important;
    }
    .oc-mode-seg.is-active {
      color: #0b1020 !important;
      background: linear-gradient(135deg, #fef08a 0%, #f59e0b 65%, #d97706 100%) !important;
      border-color: rgba(255, 255, 255, 0.65) !important;
      box-shadow: 0 0 12px rgba(250, 204, 21, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.75) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] .oc-mode-seg.is-active {
      background: linear-gradient(135deg, #ecfeff 0%, #67e8f9 55%, #c084fc 100%) !important;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.8) !important;
    }

    /* --- 2. LUXURY BOTTOM-LEFT FLOATING ANALOG VIRTUAL JOYSTICK --- */
    #ocVirtualJoystickWrap {
      position: absolute !important;
      left: max(18px, env(safe-area-inset-left, 18px)) !important;
      bottom: max(18px, env(safe-area-inset-bottom, 18px)) !important;
      width: 148px !important;
      height: 148px !important;
      pointer-events: none !important;
      touch-action: none !important;
      z-index: 45 !important;
    }
    #ocTouchControlCluster[data-move-mode="onpoint"] #ocVirtualJoystickWrap {
      display: none !important;
    }
    #ocTouchControlCluster.left-handed #ocVirtualJoystickWrap {
      left: auto !important;
      right: max(18px, env(safe-area-inset-right, 18px)) !important;
    }
    #ocVirtualJoystick {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
      pointer-events: auto !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      background: radial-gradient(circle at 50% 42%, rgba(56, 189, 248, 0.14) 0%, rgba(12, 18, 42, 0.24) 64%, rgba(6, 10, 26, 0.36) 100%) !important;
      border: 1.8px solid rgba(253, 224, 71, 0.52) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.48), 0 0 22px rgba(56, 189, 248, 0.20), inset 0 2px 14px rgba(254, 240, 138, 0.18), inset 0 -8px 18px rgba(0, 0, 0, 0.42) !important;
      transition: border-color 0.16s ease, box-shadow 0.16s ease !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoystick {
      background: radial-gradient(circle at 50% 42%, rgba(192, 132, 252, 0.16) 0%, rgba(12, 20, 44, 0.24) 64%, rgba(6, 10, 26, 0.36) 100%) !important;
      border-color: rgba(165, 243, 252, 0.58) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.48), 0 0 22px rgba(34, 211, 238, 0.22), inset 0 2px 14px rgba(224, 242, 254, 0.22), inset 0 -8px 18px rgba(0, 0, 0, 0.40) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocVirtualJoystick {
      background: radial-gradient(circle at 50% 42%, rgba(251, 146, 60, 0.17) 0%, rgba(42, 14, 14, 0.24) 64%, rgba(14, 6, 10, 0.38) 100%) !important;
      border-color: rgba(253, 224, 71, 0.56) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.50), 0 0 22px rgba(249, 115, 22, 0.24), inset 0 2px 14px rgba(254, 240, 138, 0.20), inset 0 -8px 18px rgba(0, 0, 0, 0.44) !important;
    }
    #ocVirtualJoystick.is-active {
      border-color: rgba(254, 240, 138, 0.88) !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.56), 0 0 32px rgba(250, 204, 21, 0.36), 0 0 18px rgba(56, 189, 248, 0.32), inset 0 2px 16px rgba(255, 255, 255, 0.24) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoystick.is-active {
      border-color: #a5f3fc !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.56), 0 0 32px rgba(34, 211, 238, 0.42), 0 0 18px rgba(232, 121, 249, 0.32), inset 0 2px 16px rgba(255, 255, 255, 0.28) !important;
    }
    .oc-joy-dial-svg {
      position: absolute !important;
      inset: 3px !important;
      width: calc(100% - 6px) !important;
      height: calc(100% - 6px) !important;
      pointer-events: none !important;
      z-index: 1 !important;
    }
    #ocJoyDirArc {
      position: absolute !important;
      inset: -3px !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      z-index: 2 !important;
      opacity: calc(var(--joy-mag, 0) * 0.95) !important;
      transform: rotate(var(--joy-angle, 0deg)) !important;
      background: conic-gradient(from 42deg, rgba(254, 240, 138, 0.92) 0deg, rgba(56, 189, 248, 0.65) 48deg, rgba(254, 240, 138, 0.85) 96deg, transparent 122deg, transparent 360deg) !important;
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)) !important;
      mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)) !important;
      filter: drop-shadow(0 0 8px rgba(253, 224, 71, 0.72)) !important;
    }
    #ocVirtualJoyKnob {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 64px !important;
      height: 64px !important;
      margin: -32px 0 0 -32px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: none !important;
      z-index: 4 !important;
      overflow: hidden !important;
      transform: translate3d(var(--joy-x, 0px), var(--joy-y, 0px), 0) !important;
      transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.14s ease !important;
      background: radial-gradient(circle at 35% 28%, rgba(254, 240, 138, 0.38) 0%, rgba(30, 58, 138, 0.68) 54%, rgba(6, 10, 24, 0.92) 100%) !important;
      border: 2px solid rgba(253, 224, 71, 0.86) !important;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.65), 0 0 16px rgba(253, 224, 71, 0.42), inset 0 2px 6px rgba(255, 255, 255, 0.42) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoyKnob {
      background: radial-gradient(circle at 35% 28%, rgba(224, 242, 254, 0.44) 0%, rgba(126, 34, 206, 0.62) 56%, rgba(8, 12, 30, 0.92) 100%) !important;
      border-color: rgba(165, 243, 252, 0.90) !important;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.65), 0 0 18px rgba(34, 211, 238, 0.46), inset 0 2px 6px rgba(255, 255, 255, 0.45) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocVirtualJoyKnob {
      background: radial-gradient(circle at 35% 28%, rgba(254, 240, 138, 0.42) 0%, rgba(154, 52, 18, 0.72) 56%, rgba(20, 6, 8, 0.94) 100%) !important;
      border-color: rgba(253, 224, 71, 0.90) !important;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.68), 0 0 18px rgba(249, 115, 22, 0.52), inset 0 2px 6px rgba(255, 255, 255, 0.42) !important;
    }
    #ocVirtualJoystick.is-active #ocVirtualJoyKnob {
      transition: box-shadow 0.12s ease !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.72), 0 0 26px rgba(253, 224, 71, 0.76), inset 0 2px 8px rgba(255, 255, 255, 0.52) !important;
    }
    .oc-joy-knob-img {
      width: 44px !important;
      height: 44px !important;
      object-fit: contain !important;
      pointer-events: none !important;
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.45)) contrast(1.06) !important;
    }

    /* --- 3. RIGHT-HAND COLLECTOR COMBAT ARC (GUN + SKILL2 + ULT + PULSE) --- */
    .oc-touch-pad-wrap {
      position: absolute !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 4px !important;
      pointer-events: none !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    .oc-pad-wrap-gun {
      right: max(14px, env(safe-area-inset-right, 14px)) !important;
      bottom: max(16px, env(safe-area-inset-bottom, 16px)) !important;
    }
    .oc-pad-wrap-skill2 {
      right: calc(max(14px, env(safe-area-inset-right, 14px)) + 98px) !important;
      bottom: calc(max(16px, env(safe-area-inset-bottom, 16px)) + 94px) !important;
    }
    .oc-pad-wrap-ult {
      right: calc(max(14px, env(safe-area-inset-right, 14px)) + 16px) !important;
      bottom: calc(max(16px, env(safe-area-inset-bottom, 16px)) + 172px) !important;
    }
    .oc-pad-wrap-pulse {
      right: calc(max(14px, env(safe-area-inset-right, 14px)) + 132px) !important;
      bottom: max(14px, env(safe-area-inset-bottom, 14px)) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-gun {
      right: auto !important;
      left: max(14px, env(safe-area-inset-left, 14px)) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-skill2 {
      right: auto !important;
      left: calc(max(14px, env(safe-area-inset-left, 14px)) + 98px) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-ult {
      right: auto !important;
      left: calc(max(14px, env(safe-area-inset-left, 14px)) + 16px) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-pulse {
      right: auto !important;
      left: calc(max(14px, env(safe-area-inset-left, 14px)) + 132px) !important;
    }

    /* Ornate Winged-Diamond Collector Frame Behind Primary Fire Button */
    .oc-gun-crown-frame {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 128px !important;
      height: 128px !important;
      margin: -64px 0 0 -64px !important;
      pointer-events: none !important;
      z-index: 0 !important;
      filter: drop-shadow(0 0 10px rgba(253, 224, 71, 0.35)) !important;
      transition: transform 0.14s ease, filter 0.14s ease !important;
    }
    .oc-pad-wrap-gun:has(#ocTouchGunBtn.is-held) .oc-gun-crown-frame {
      transform: scale(0.95) !important;
      filter: drop-shadow(0 0 18px rgba(253, 224, 71, 0.78)) !important;
    }

    .oc-touch-pad {
      position: relative !important;
      border-radius: 50% !important;
      pointer-events: auto !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      opacity: 0.96 !important;
      color: #f8fafc !important;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
      -webkit-user-drag: none !important;
      z-index: 1 !important;
      transition: transform 0.09s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.14s ease, border-color 0.14s ease, opacity 0.14s ease, background 0.18s ease !important;
    }
    .oc-touch-pad::before {
      content: '' !important;
      position: absolute !important;
      top: 3% !important;
      left: 11% !important;
      right: 11% !important;
      height: 38% !important;
      border-radius: 50% !important;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.06) 52%, transparent 100%) !important;
      pointer-events: none !important;
      z-index: 3 !important;
    }
    .oc-touch-pad::after {
      content: '' !important;
      position: absolute !important;
      inset: 3px !important;
      border-radius: 50% !important;
      border: 1px solid rgba(255, 255, 255, 0.28) !important;
      box-shadow: inset 0 1px 4px rgba(255, 255, 255, 0.24), inset 0 -2px 7px rgba(0, 0, 0, 0.40) !important;
      pointer-events: none !important;
      z-index: 3 !important;
    }

    /* 1. PRIMARY WEAPON PAD (104px Collector Trigger) */
    #ocTouchGunBtn {
      width: 104px !important;
      height: 104px !important;
      background: radial-gradient(circle at 35% 28%, rgba(251, 146, 60, 0.28) 0%, rgba(124, 45, 18, 0.22) 55%, rgba(10, 14, 32, 0.34) 100%) !important;
      border: 2px solid rgba(253, 224, 71, 0.78) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.48), 0 0 18px rgba(249, 115, 22, 0.28), inset 0 2px 12px rgba(254, 240, 138, 0.26), inset 0 -6px 14px rgba(0, 0, 0, 0.36) !important;
    }
    #ocTouchControlCluster[data-realm="dynamo"] #ocTouchGunBtn {
      background: radial-gradient(circle at 35% 28%, rgba(56, 189, 248, 0.26) 0%, rgba(88, 28, 135, 0.22) 56%, rgba(8, 12, 30, 0.32) 100%) !important;
      border-color: rgba(253, 224, 71, 0.78) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.48), 0 0 20px rgba(56, 189, 248, 0.30), 0 0 12px rgba(250, 204, 21, 0.24), inset 0 2px 12px rgba(186, 230, 253, 0.28), inset 0 -6px 14px rgba(0, 0, 0, 0.38) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocTouchGunBtn {
      background: radial-gradient(circle at 35% 28%, rgba(34, 211, 238, 0.26) 0%, rgba(192, 38, 211, 0.20) 56%, rgba(8, 14, 34, 0.32) 100%) !important;
      border-color: rgba(165, 243, 252, 0.80) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.48), 0 0 20px rgba(34, 211, 238, 0.30), 0 0 14px rgba(232, 121, 249, 0.26), inset 0 2px 12px rgba(224, 242, 254, 0.30), inset 0 -6px 14px rgba(0, 0, 0, 0.36) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocTouchGunBtn {
      background: radial-gradient(circle at 35% 28%, rgba(251, 146, 60, 0.28) 0%, rgba(154, 52, 18, 0.24) 56%, rgba(18, 8, 12, 0.34) 100%) !important;
      border-color: rgba(253, 224, 71, 0.80) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.50), 0 0 20px rgba(249, 115, 22, 0.32), inset 0 2px 12px rgba(254, 240, 138, 0.28), inset 0 -6px 14px rgba(0, 0, 0, 0.40) !important;
    }
    #ocTouchGunBtn.is-held {
      transform: scale(0.92) !important;
      opacity: 1 !important;
      border-color: #fef08a !important;
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.58), 0 0 36px rgba(253, 224, 71, 0.75), 0 0 20px rgba(56, 189, 248, 0.52), inset 0 0 18px rgba(254, 240, 138, 0.42) !important;
    }
    #ocTouchGunBtn.is-empty {
      border-color: rgba(148, 163, 184, 0.42) !important;
      opacity: 0.66 !important;
    }
    #ocTouchGunBtn.oc-fire-empty-flash {
      transform: scale(0.92) !important;
      opacity: 0.96 !important;
      border-color: #f87171 !important;
      background: radial-gradient(circle, rgba(220, 38, 38, 0.44) 0%, rgba(127, 29, 29, 0.38) 72%, rgba(30, 6, 12, 0.48) 100%) !important;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.78), inset 0 0 14px rgba(254, 202, 202, 0.38) !important;
    }

    /* 2. SKILL 2 PAD (72px Jewel Volley Pad) */
    #ocTouchSkill2Btn {
      width: 72px !important;
      height: 72px !important;
      background: radial-gradient(circle at 35% 28%, rgba(34, 211, 238, 0.26) 0%, rgba(15, 34, 72, 0.24) 62%, rgba(6, 10, 26, 0.34) 100%) !important;
      border: 2px solid rgba(250, 204, 21, 0.72) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.46), 0 0 16px rgba(34, 211, 238, 0.28), inset 0 2px 9px rgba(186, 230, 253, 0.28), inset 0 -5px 11px rgba(0, 0, 0, 0.38) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocTouchSkill2Btn {
      background: radial-gradient(circle at 35% 28%, rgba(56, 189, 248, 0.26) 0%, rgba(147, 51, 234, 0.22) 62%, rgba(6, 12, 28, 0.32) 100%) !important;
      border-color: rgba(165, 243, 252, 0.74) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocTouchSkill2Btn {
      background: radial-gradient(circle at 35% 28%, rgba(251, 146, 60, 0.28) 0%, rgba(124, 45, 18, 0.24) 62%, rgba(18, 8, 12, 0.34) 100%) !important;
      border-color: rgba(251, 191, 36, 0.74) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.48), 0 0 16px rgba(249, 115, 22, 0.30), inset 0 2px 9px rgba(254, 240, 138, 0.26), inset 0 -5px 11px rgba(0, 0, 0, 0.40) !important;
    }
    #ocTouchSkill2Btn.is-held {
      transform: scale(0.92) !important;
      opacity: 1 !important;
      border-color: #67e8f9 !important;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.58), 0 0 28px rgba(34, 211, 238, 0.78), inset 0 0 14px rgba(165, 243, 252, 0.42) !important;
    }

    /* 3. ULTIMATE PAD (82px Imperial Crown Pad) */
    #ocTouchUltBtn {
      width: 82px !important;
      height: 82px !important;
      background: radial-gradient(circle at 35% 28%, rgba(192, 132, 252, 0.28) 0%, rgba(88, 28, 135, 0.24) 56%, rgba(16, 8, 30, 0.34) 100%) !important;
      border: 2px solid rgba(253, 224, 71, 0.80) !important;
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.48), 0 0 20px rgba(232, 121, 249, 0.32), 0 0 12px rgba(250, 204, 21, 0.26), inset 0 2px 10px rgba(254, 249, 195, 0.30), inset 0 -5px 12px rgba(0, 0, 0, 0.38) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocTouchUltBtn {
      background: radial-gradient(circle at 35% 28%, rgba(34, 211, 238, 0.26) 0%, rgba(168, 85, 247, 0.24) 56%, rgba(10, 12, 32, 0.32) 100%) !important;
      border-color: rgba(224, 242, 254, 0.82) !important;
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.48), 0 0 20px rgba(34, 211, 238, 0.32), 0 0 14px rgba(232, 121, 249, 0.28), inset 0 2px 10px rgba(224, 242, 254, 0.32), inset 0 -5px 12px rgba(0, 0, 0, 0.38) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocTouchUltBtn {
      background: radial-gradient(circle at 35% 28%, rgba(251, 146, 60, 0.30) 0%, rgba(153, 27, 27, 0.24) 56%, rgba(22, 8, 10, 0.34) 100%) !important;
      border-color: rgba(253, 224, 71, 0.82) !important;
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.50), 0 0 20px rgba(249, 115, 22, 0.34), 0 0 12px rgba(250, 204, 21, 0.28), inset 0 2px 10px rgba(254, 240, 138, 0.30), inset 0 -5px 12px rgba(0, 0, 0, 0.40) !important;
    }
    #ocTouchUltBtn.is-held {
      transform: scale(0.92) !important;
      opacity: 1 !important;
      border-color: #fef08a !important;
      box-shadow: 0 4px 22px rgba(0, 0, 0, 0.68), 0 0 38px rgba(250, 204, 21, 0.86), 0 0 24px rgba(232, 121, 249, 0.68), inset 0 0 18px rgba(254, 249, 195, 0.48) !important;
    }

    /* 4. FLUX PULSE BATTLE-SPELL PAD (56px Collector Spell Orb) */
    #ocTouchPulseBtn {
      width: 56px !important;
      height: 56px !important;
      background: radial-gradient(circle at 35% 28%, rgba(16, 185, 129, 0.26) 0%, rgba(14, 116, 144, 0.24) 58%, rgba(6, 12, 26, 0.36) 100%) !important;
      border: 1.8px solid rgba(103, 232, 249, 0.56) !important;
      box-shadow: 0 5px 16px rgba(0, 0, 0, 0.46), 0 0 12px rgba(34, 211, 238, 0.22), inset 0 2px 8px rgba(207, 250, 254, 0.24) !important;
    }
    #ocTouchPulseBtn.is-ready {
      border-color: #fde047 !important;
      box-shadow: 0 5px 18px rgba(0, 0, 0, 0.54), 0 0 24px rgba(250, 204, 21, 0.72), 0 0 14px rgba(34, 211, 238, 0.52), inset 0 0 14px rgba(254, 240, 138, 0.42) !important;
      animation: ocReadyPulse 1.6s ease-in-out infinite !important;
    }
    #ocTouchPulseBtn.is-charging {
      opacity: 0.78 !important;
    }
    .oc-pulse-sweep {
      position: absolute !important;
      inset: 0 !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      z-index: 4 !important;
      background: conic-gradient(rgba(34, 211, 238, 0.28) var(--pulse-deg, 0deg), rgba(4, 8, 22, 0.58) var(--pulse-deg, 0deg)) !important;
    }
    #ocTouchPulseBtn.is-ready .oc-pulse-sweep {
      background: none !important;
    }
    .oc-pulse-pct {
      font-size: 9px !important;
      font-weight: 900 !important;
      color: #a5f3fc !important;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95) !important;
      z-index: 5 !important;
      line-height: 1 !important;
      margin-top: 1px !important;
    }
    #ocTouchPulseBtn.is-ready .oc-pulse-pct {
      color: #fef08a !important;
    }

    /* Translucent Filigree SVG Dial & Custom Artwork Inside Pads */
    .oc-pad-filigree {
      position: absolute !important;
      inset: 4px !important;
      width: calc(100% - 8px) !important;
      height: calc(100% - 8px) !important;
      pointer-events: none !important;
      z-index: 1 !important;
      opacity: 0.78 !important;
      transition: transform 0.35s ease, opacity 0.2s ease !important;
    }
    .oc-touch-pad.is-held .oc-pad-filigree {
      opacity: 1 !important;
      transform: rotate(22deg) scale(1.03) !important;
    }
    .oc-touch-pad .oc-pad-icon {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 40px !important;
      height: 40px !important;
      line-height: 1 !important;
      pointer-events: none !important;
      z-index: 2 !important;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.78)) !important;
    }
    #ocTouchUltBtn .oc-pad-icon {
      width: 52px !important;
      height: 50px !important;
      margin-top: -2px !important;
    }
    #ocTouchSkill2Btn .oc-pad-icon {
      width: 38px !important;
      height: 38px !important;
      margin-top: -1px !important;
    }
    #ocTouchPulseBtn .oc-pad-icon {
      width: 24px !important;
      height: 24px !important;
      z-index: 5 !important;
    }
    .oc-pad-emblem-svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      overflow: visible !important;
    }
    .oc-ult-mini-core {
      width: 50px !important;
      height: 50px !important;
      object-fit: contain !important;
      display: block !important;
      filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.48)) contrast(1.08) saturate(1.12) !important;
    }
    .oc-gun-crest {
      width: 28px !important;
      height: 20px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-bottom: 1px !important;
      pointer-events: none !important;
      z-index: 2 !important;
      filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.78)) !important;
    }
    .oc-gun-crest svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }

    .oc-touch-pad.on-cooldown {
      opacity: 0.74 !important;
      filter: saturate(0.70) !important;
    }
    .oc-touch-pad .oc-cd-sweep {
      position: absolute !important;
      inset: 0 !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      z-index: 4 !important;
      background: conic-gradient(rgba(4, 8, 22, 0.66) var(--cd-deg, 0deg), transparent var(--cd-deg, 0deg)) !important;
    }
    .oc-touch-pad .oc-cd-text {
      position: absolute !important;
      inset: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 21px !important;
      font-weight: 900 !important;
      color: #ffffff !important;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.90) !important;
      pointer-events: none !important;
      z-index: 5 !important;
    }
    .oc-touch-pad .oc-fire-label {
      font-size: 10.5px !important;
      font-weight: 900 !important;
      letter-spacing: 0.12em !important;
      line-height: 1 !important;
      color: #ffffff !important;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.92), 0 0 8px rgba(253, 224, 71, 0.40) !important;
      pointer-events: none !important;
      z-index: 2 !important;
    }
    .oc-touch-pad .oc-fire-ammo {
      font-size: 17px !important;
      font-weight: 900 !important;
      font-variant-numeric: tabular-nums !important;
      line-height: 1.06 !important;
      max-width: 86px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-align: center !important;
      color: #fef08a !important;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(250, 204, 21, 0.46) !important;
      pointer-events: none !important;
      z-index: 2 !important;
    }
    #ocTouchControlCluster[data-realm="helix"] .oc-touch-pad .oc-fire-ammo {
      color: #a5f3fc !important;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(34, 211, 238, 0.50) !important;
    }
    #ocTouchGunBtn.is-empty .oc-fire-ammo,
    #ocTouchGunBtn.oc-fire-empty-flash .oc-fire-ammo { color: #fca5a5 !important; }
    .oc-touch-pad .oc-fire-sub {
      font-size: 7.5px !important;
      font-weight: 800 !important;
      letter-spacing: 0.12em !important;
      color: rgba(254, 249, 195, 0.95) !important;
      background: rgba(6, 10, 26, 0.52) !important;
      border: 1px solid rgba(255, 255, 255, 0.22) !important;
      border-radius: 999px !important;
      padding: 1.5px 6px !important;
      margin-top: 1px !important;
      line-height: 1 !important;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95) !important;
      pointer-events: none !important;
      z-index: 2 !important;
    }
    .oc-pad-caption {
      font-family: 'Lexend', system-ui, -apple-system, sans-serif !important;
      font-size: 8px !important;
      font-weight: 800 !important;
      letter-spacing: 0.09em !important;
      text-transform: uppercase !important;
      color: rgba(248, 250, 252, 0.96) !important;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(4, 8, 20, 0.94) 100%) !important;
      border: 1px solid rgba(253, 224, 71, 0.38) !important;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.48), inset 0 1px 1px rgba(255, 255, 255, 0.18) !important;
      border-radius: 999px !important;
      padding: 2px 7px !important;
      white-space: nowrap !important;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95) !important;
      pointer-events: none !important;
    }
    #ocTouchControlCluster[data-realm="helix"] .oc-pad-caption {
      border-color: rgba(103, 232, 249, 0.42) !important;
    }

    /* Compact Phone Responsive Safeguard (iPhone SE 667x375 & 390x844 portrait) */
    @media (max-width: 720px) and (max-height: 440px), (max-width: 460px) {
      #ocVirtualJoystickWrap {
        width: 124px !important;
        height: 124px !important;
        left: max(12px, env(safe-area-inset-left, 12px)) !important;
        bottom: max(12px, env(safe-area-inset-bottom, 12px)) !important;
      }
      #ocVirtualJoyKnob {
        width: 54px !important;
        height: 54px !important;
        margin: -27px 0 0 -27px !important;
      }
      .oc-joy-knob-img {
        width: 36px !important;
        height: 36px !important;
      }
      #ocTouchModePill {
        left: max(12px, env(safe-area-inset-left, 12px)) !important;
        bottom: calc(max(12px, env(safe-area-inset-bottom, 12px)) + 132px) !important;
      }
      #ocTouchControlCluster.left-handed #ocVirtualJoystickWrap,
      #ocTouchControlCluster.left-handed #ocTouchModePill {
        left: auto !important;
        right: max(12px, env(safe-area-inset-right, 12px)) !important;
      }
      .oc-gun-crown-frame {
        width: 108px !important;
        height: 108px !important;
        margin: -54px 0 0 -54px !important;
      }
      #ocTouchGunBtn {
        width: 88px !important;
        height: 88px !important;
      }
      #ocTouchSkill2Btn {
        width: 62px !important;
        height: 62px !important;
      }
      #ocTouchUltBtn {
        width: 70px !important;
        height: 70px !important;
      }
      #ocTouchPulseBtn {
        width: 50px !important;
        height: 50px !important;
      }
      .oc-pad-wrap-gun {
        right: max(10px, env(safe-area-inset-right, 10px)) !important;
        bottom: max(12px, env(safe-area-inset-bottom, 12px)) !important;
      }
      .oc-pad-wrap-skill2 {
        right: calc(max(10px, env(safe-area-inset-right, 10px)) + 84px) !important;
        bottom: calc(max(12px, env(safe-area-inset-bottom, 12px)) + 80px) !important;
      }
      .oc-pad-wrap-ult {
        right: calc(max(10px, env(safe-area-inset-right, 10px)) + 12px) !important;
        bottom: calc(max(12px, env(safe-area-inset-bottom, 12px)) + 144px) !important;
      }
      .oc-pad-wrap-pulse {
        right: calc(max(10px, env(safe-area-inset-right, 10px)) + 114px) !important;
        bottom: max(10px, env(safe-area-inset-bottom, 10px)) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-gun {
        left: max(10px, env(safe-area-inset-left, 10px)) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-skill2 {
        left: calc(max(10px, env(safe-area-inset-left, 10px)) + 84px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-ult {
        left: calc(max(10px, env(safe-area-inset-left, 10px)) + 12px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-pulse {
        left: calc(max(10px, env(safe-area-inset-left, 10px)) + 114px) !important;
      }
    }

    @keyframes ocReadyPulse {
      0% { transform: scale(1); filter: brightness(1.0); }
      45% { transform: scale(1.10); filter: brightness(1.38); }
      100% { transform: scale(1); filter: brightness(1.0); }
    }
    @keyframes ocCooldownShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      45% { transform: translateX(4px); }
      70% { transform: translateX(-3px); }
    }
    .oc-ready-pulse { animation: ocReadyPulse 0.42s ease-out !important; }
    .oc-cd-shake { animation: ocCooldownShake 0.26s ease-in-out !important; }

    /* === CHANGED (v410): ENHANCED LUXURY DESKTOP SKILL CARDS (Interactive + Keycaps + Emblems) === */
    #ocDesktopSkillHud {
      position: absolute !important;
      right: 18px !important;
      bottom: 16px !important;
      z-index: 40 !important;
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
      pointer-events: auto !important;
      user-select: none !important;
    }
    #ocDesktopSkillHud.oc-desk-hidden {
      display: none !important;
    }
    .oc-desk-chip {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 7px 12px 8px 9px !important;
      border-radius: 12px !important;
      cursor: pointer !important;
      background: linear-gradient(165deg, rgba(18, 28, 54, 0.90) 0%, rgba(6, 10, 24, 0.94) 100%) !important;
      border: 1.5px solid rgba(253, 224, 71, 0.36) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.48), inset 0 1px 1px rgba(255, 255, 255, 0.16) !important;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif !important;
      overflow: hidden !important;
      transition: transform 0.12s ease, border-color 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease !important;
    }
    .oc-desk-chip:hover {
      transform: translateY(-2px) !important;
      border-color: rgba(253, 224, 71, 0.72) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.56), 0 0 16px rgba(56, 189, 248, 0.24) !important;
    }
    .oc-desk-chip[data-skill="gun"] { border-color: rgba(251, 146, 60, 0.58) !important; }
    .oc-desk-chip[data-skill="skill2"] { border-color: rgba(34, 211, 238, 0.58) !important; }
    .oc-desk-chip[data-skill="ult"] { border-color: rgba(250, 204, 21, 0.62) !important; }
    .oc-desk-chip.is-active {
      transform: scale(0.96) !important;
      border-color: #fde047 !important;
      box-shadow: 0 0 22px rgba(251, 146, 60, 0.62), inset 0 0 12px rgba(253, 224, 71, 0.20) !important;
    }
    .oc-desk-chip.on-cooldown {
      opacity: 0.64 !important;
    }
    .oc-desk-chip .oc-desk-cdbar {
      position: absolute !important;
      left: 0 !important;
      bottom: 0 !important;
      height: 3px !important;
      width: var(--cd-pct, 0%) !important;
      background: linear-gradient(90deg, #38bdf8, #c084fc) !important;
      pointer-events: none !important;
    }
    .oc-desk-chip[data-skill="ult"] .oc-desk-cdbar {
      background: linear-gradient(90deg, #facc15, #f97316) !important;
    }
    .oc-desk-emblem {
      width: 24px !important;
      height: 24px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 7px !important;
      background: rgba(15, 23, 42, 0.86) !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      padding: 2px !important;
      flex-shrink: 0 !important;
    }
    .oc-desk-emblem svg,
    .oc-desk-emblem img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
    }
    .oc-desk-keycap {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 22px !important;
      height: 22px !important;
      padding: 0 5px !important;
      border-radius: 6px !important;
      background: linear-gradient(180deg, rgba(51, 65, 85, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%) !important;
      border: 1px solid rgba(253, 224, 71, 0.44) !important;
      color: #fef08a !important;
      font-size: 11px !important;
      font-weight: 900 !important;
      box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.55), 0 0 6px rgba(250, 204, 21, 0.16) !important;
    }
    .oc-desk-meta {
      display: flex !important;
      flex-direction: column !important;
      line-height: 1.12 !important;
    }
    .oc-desk-name {
      font-size: 9px !important;
      font-weight: 800 !important;
      letter-spacing: 0.06em !important;
      color: #cbd5e1 !important;
    }
    .oc-desk-status {
      font-size: 11px !important;
      font-weight: 900 !important;
      color: #f8fafc !important;
      white-space: nowrap !important;
    }

    /* Enhanced Topbar Icon & Close Jewel Buttons */
    body .game-controls-actions .game-btn-icon,
    body .game-controls-actions .game-btn-close {
      background: linear-gradient(165deg, rgba(30, 41, 59, 0.88) 0%, rgba(8, 12, 26, 0.94) 100%) !important;
      border: 1px solid rgba(253, 224, 71, 0.30) !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.42), inset 0 1px 1px rgba(255, 255, 255, 0.18) !important;
      border-radius: 9px !important;
      transition: transform 0.12s ease, border-color 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease !important;
    }
    body .game-controls-actions .game-btn-icon:hover,
    body .game-controls-actions .game-btn-close:hover {
      transform: translateY(-1px) !important;
      border-color: rgba(253, 224, 71, 0.72) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.52), 0 0 12px rgba(56, 189, 248, 0.34) !important;
    }
    .game-btn-icon.oc-btn-off { opacity: 0.42 !important; }
    .game-btn-icon.oc-btn-active {
      border-color: rgba(250, 204, 21, 0.78) !important;
      box-shadow: 0 0 12px rgba(250, 204, 21, 0.42), inset 0 1px 2px rgba(254, 240, 138, 0.3) !important;
    }"""

    html = html[:i0] + new_css + html[i1:]

    # Add #cgMoveModeBtn right before #cgLeftHandBtn
    old_left_btn = """          <!-- === CHANGED (v387): Left-Handed Touch Mirror Toggle (visible on touch only) & Futuristic Music Toggle === -->
          <button type="button" class="game-btn-icon" id="cgLeftHandBtn" style="display:none;" title="Toggle Left-Handed / Right-Handed Touch Layout">"""
    new_left_btn = """          <!-- === CHANGED (v410): Touch Steering Mode Toggle (Joystick / On-Point), Left-Handed Mirror & Music === -->
          <button type="button" class="game-btn-icon" id="cgMoveModeBtn" style="display:none;" title="Touch Steering: Virtual Joystick (Tap for On-Point)">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <circle cx="12" cy="12" r="8.5" stroke="#fde047" stroke-width="1.7" stroke-dasharray="3 2.2"/>
              <circle cx="12" cy="12" r="3.4" fill="#38bdf8" stroke="#fef08a" stroke-width="1.2"/>
            </svg>
          </button>
          <button type="button" class="game-btn-icon" id="cgLeftHandBtn" style="display:none;" title="Toggle Left-Handed / Right-Handed Touch Layout">"""
    html = replace_once(html, old_left_btn, new_left_btn, "index.html moveModeBtn")
    html = update_version_tags(html)

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Patched index.html")


def patch_game_js():
    path = os.path.join(ROOT, "game.js")
    with open(path, "r", encoding="utf-8") as f:
        js = f.read()

    # 1. CONFIG.ui updates
    old_ui_cfg = """    ui: {
      gunBtnSize: 96,
      skill2BtnSize: 68,
      ultBtnSize: 76,
      btnOpacity: 0.85,
      pressedScale: 0.92,
      leftHandedKey: 'oc_left_handed_controls'
    },"""
    new_ui_cfg = """    ui: {
      gunBtnSize: 104,
      skill2BtnSize: 72,
      ultBtnSize: 82,
      pulseBtnSize: 56,
      btnOpacity: 0.90,
      pressedScale: 0.92,
      leftHandedKey: 'oc_left_handed_controls',
      moveModeKey: 'oc_touch_move_mode',
      joyMaxRadius: 50,
      joyDeadZone: 6,
      joyMaxSpeedPx: 820
    },"""
    js = replace_once(js, old_ui_cfg, new_ui_cfg, "CONFIG.ui")

    # 2. detectTouchPrimary() coarse improvement
    old_detect = """  function detectTouchPrimary() {
    try {
      // Explicit QA preview flag (?touch_preview=1) for automated visual verification only; never set in normal play
      if (window.location.search.includes('touch_preview=1')) return true;
    } catch (_) {}
    if (typeof window.matchMedia === 'function') {
      const mqCoarse = window.matchMedia('(pointer: coarse)');
      const mqHoverNone = window.matchMedia('(hover: none)');
      const mqFine = window.matchMedia('(pointer: fine)');
      if (mqCoarse.matches && mqHoverNone.matches) return true;
      if (mqFine.matches || mqCoarse.matches) return false;
    }
    return (navigator.maxTouchPoints > 0) && ('ontouchstart' in window);
  }"""
    new_detect = """  function detectTouchPrimary() {
    try {
      if (window.location.search.includes('touch_preview=1')) return true;
    } catch (_) {}
    if (typeof window.matchMedia === 'function') {
      const mqCoarse = window.matchMedia('(pointer: coarse)');
      const mqHoverNone = window.matchMedia('(hover: none)');
      const mqFine = window.matchMedia('(pointer: fine)');
      if (mqCoarse.matches && !mqFine.matches) return true;
      if (mqCoarse.matches && mqHoverNone.matches) return true;
      if (mqFine.matches) return false;
    }
    return (navigator.maxTouchPoints > 0) && ('ontouchstart' in window);
  }"""
    js = replace_once(js, old_detect, new_detect, "detectTouchPrimary")

    # 3. Replace TouchFireControls block up to syncUI closing brace
    tf_start_anchor = "  const TouchFireControls = {"
    tf_end_anchor = "\n  };\n\n  // ══════════════════════════════════════════════════════════════════════════\n  // === CHANGED (v387): STEP 4 — ACTIVE SKILLS ENGINE"
    t0 = js.index(tf_start_anchor)
    t1 = js.index(tf_end_anchor, t0)

    new_tf_block = """  const TouchFireControls = {
    isTouch: false,
    leftHanded: (() => {
      try { return localStorage.getItem(CONFIG.ui.leftHandedKey) === '1'; } catch (_) { return false; }
    })(),
    moveMode: (() => {
      try {
        const saved = localStorage.getItem(CONFIG.ui.moveModeKey);
        return (saved === 'onpoint' || saved === 'joystick') ? saved : 'joystick';
      } catch (_) { return 'joystick'; }
    })(),
    activePointers: new Map(), // pointerId -> { role: 'JOYSTICK'|'MOVE'|'GUN'|'SKILL2'|'ULT'|'PULSE', el }
    heldKeys: new Set(),       // Desktop held keyboard codes ('KeyA', 'KeyF', etc.)
    joyState: { active: false, pointerId: null, dx: 0, dy: 0, ux: 0, uy: 0, mag: 0, angleDeg: 0, centerX: 0, centerY: 0 },
    clusterEl: null,
    joyWrapEl: null,
    joyEl: null,
    joyDirArcEl: null,
    joyKnobEl: null,
    joyKnobImgEl: null,
    modePillEl: null,
    modeBtnStick: null,
    modeBtnOnPoint: null,
    gunBtn: null,
    skill2Btn: null,
    ultBtn: null,
    pulseBtn: null,
    pulseSweepEl: null,
    pulsePctEl: null,
    ammoEl: null,
    skill2SweepEl: null,
    skill2CdTextEl: null,
    ultSweepEl: null,
    ultCdTextEl: null,
    ultIconEl: null,
    ultCapEl: null,
    skill2IconEl: null,
    skill2SubEl: null,
    skill2CapEl: null,
    gunCapEl: null,
    gunCrestEl: null,
    deskHudEl: null,
    deskGunChip: null,
    deskGunName: null,
    deskGunStatus: null,
    deskSkill2Chip: null,
    deskSkill2Name: null,
    deskSkill2Status: null,
    deskUltChip: null,
    deskUltName: null,
    deskUltStatus: null,
    _emptyFlashTimer: null,
    _lastEmptyFlashAt: 0,
    _initialized: false,
    _cachedAmmoStr: null,
    _cachedHidden: null,
    _cachedDeskHidden: null,
    _cachedRealmMode: null,
    _cachedVisualTier: null,

    init() {
      if (this._initialized) return;
      this._initialized = true;

      this.isTouch = detectTouchPrimary();

      if (typeof window.matchMedia === 'function') {
        const mqCoarse = window.matchMedia('(pointer: coarse)');
        const mqHoverNone = window.matchMedia('(hover: none)');
        const onMediaChange = () => this.refreshMode();
        if (mqCoarse.addEventListener) {
          mqCoarse.addEventListener('change', onMediaChange);
          mqHoverNone.addEventListener('change', onMediaChange);
        } else if (mqCoarse.addListener) {
          mqCoarse.addListener(onMediaChange);
          mqHoverNone.addListener(onMediaChange);
        }
      }

      const preventIosGesture = (e) => {
        if (this.isTouch && state.active && e.cancelable) e.preventDefault();
      };
      document.addEventListener('gesturestart', preventIosGesture, { passive: false });
      document.addEventListener('gesturechange', preventIosGesture, { passive: false });
      document.addEventListener('gestureend', preventIosGesture, { passive: false });
      document.addEventListener('selectstart', (e) => {
        if (state.active && document.body.classList.contains('arcade-active')) e.preventDefault();
      });

      const clearAllInputs = () => {
        this.releaseAllPointers();
        this.clearHeldKeys();
      };
      window.addEventListener('blur', clearAllInputs);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearAllInputs();
          RealmMusicEngine.stop();
        } else if (state.active) {
          RealmMusicEngine.unlockOnGesture();
        }
      });

      const moveModeBtn = document.getElementById('cgMoveModeBtn');
      if (moveModeBtn) {
        moveModeBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggleMoveMode();
        };
      }

      const leftBtn = document.getElementById('cgLeftHandBtn');
      if (leftBtn) {
        leftBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggleLeftHanded();
        };
      }

      this.syncUI();
    },

    promoteToTouchOnRealTouch() {
      if (this.isTouch) return;
      this.isTouch = true;
      this.releaseAllPointers();
      this.clearHeldKeys();
      this.destroyDesktopHud();
      state.offenseMode = false;
      state.pointerFiring = false;
      this.syncUI();
      if (typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    hasRole(role) {
      for (const entry of this.activePointers.values()) {
        if (entry.role === role) return true;
      }
      return false;
    },

    isGunHeld() {
      return this.hasRole('GUN');
    },

    isDesktopKeyGunHeld() {
      return !this.isTouch && (this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF'));
    },

    getMovePointerId() {
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'MOVE') return pid;
      }
      return null;
    },

    setMoveMode(nextMode) {
      const m = (nextMode === 'onpoint') ? 'onpoint' : 'joystick';
      if (this.moveMode === m) {
        this._syncMoveModeUI();
        return;
      }
      this.moveMode = m;
      try { localStorage.setItem(CONFIG.ui.moveModeKey, m); } catch (_) {}
      // Cleanly reset any active steering pointer when switching mode
      const steerIds = [];
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'MOVE' || entry.role === 'JOYSTICK') steerIds.push(pid);
      }
      steerIds.forEach((pid) => this.releasePointer(pid));
      this._resetJoystickVisual();
      this._syncMoveModeUI();
      if (typeof updateTargetText === 'function') updateTargetText();
    },

    toggleMoveMode() {
      this.setMoveMode(this.moveMode === 'joystick' ? 'onpoint' : 'joystick');
    },

    _syncMoveModeUI() {
      const isStick = (this.moveMode === 'joystick');
      if (this.clusterEl) {
        this.clusterEl.setAttribute('data-move-mode', this.moveMode);
      }
      if (this.modeBtnStick) this.modeBtnStick.classList.toggle('is-active', isStick);
      if (this.modeBtnOnPoint) this.modeBtnOnPoint.classList.toggle('is-active', !isStick);
      const topBtn = document.getElementById('cgMoveModeBtn');
      if (topBtn) {
        const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
        topBtn.style.display = (this.isTouch && isCoreArcade) ? '' : 'none';
        topBtn.classList.toggle('oc-btn-active', isStick);
        topBtn.title = isStick
          ? 'Touch Steering: Virtual Joystick ON (Tap to switch to On-Point Touch)'
          : 'Touch Steering: On-Point Touch ON (Tap to switch to Virtual Joystick)';
      }
    },

    toggleLeftHanded() {
      this.leftHanded = !this.leftHanded;
      try { localStorage.setItem(CONFIG.ui.leftHandedKey, this.leftHanded ? '1' : '0'); } catch (_) {}
      if (this.clusterEl) {
        this.clusterEl.classList.toggle('left-handed', this.leftHanded);
      }
      this._syncLeftHandBtn();
    },

    _syncLeftHandBtn() {
      const leftBtn = document.getElementById('cgLeftHandBtn');
      if (!leftBtn) return;
      const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      leftBtn.style.display = (this.isTouch && isCoreArcade) ? '' : 'none';
      leftBtn.classList.toggle('oc-btn-active', this.leftHanded);
      leftBtn.title = this.leftHanded ? 'Left-Handed Layout ON (Tap for Right-Handed)' : 'Right-Handed Layout (Tap for Left-Handed)';
    },

    refreshMode() {
      const nextIsTouch = detectTouchPrimary();
      if (nextIsTouch === this.isTouch) {
        this.syncUI();
        return;
      }
      this.isTouch = nextIsTouch;
      this.releaseAllPointers();
      this.clearHeldKeys();
      if (!this.isTouch) {
        this.destroyTouchCluster();
      } else {
        this.destroyDesktopHud();
        state.offenseMode = false;
        state.pointerFiring = false;
      }
      this.syncUI();
      if (typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    _resetJoystickVisual() {
      this.joyState.active = false;
      this.joyState.pointerId = null;
      this.joyState.dx = 0;
      this.joyState.dy = 0;
      this.joyState.ux = 0;
      this.joyState.uy = 0;
      this.joyState.mag = 0;
      if (this.joyEl) {
        this.joyEl.classList.remove('is-active');
        this.joyEl.style.setProperty('--joy-x', '0px');
        this.joyEl.style.setProperty('--joy-y', '0px');
        this.joyEl.style.setProperty('--joy-mag', '0');
      }
    },

    _updateJoystickVector(clientX, clientY) {
      if (!this.joyEl) return;
      const rect = this.joyEl.getBoundingClientRect();
      const cx = rect.width > 10 ? (rect.left + rect.width * 0.5) : this.joyState.centerX;
      const cy = rect.height > 10 ? (rect.top + rect.height * 0.5) : this.joyState.centerY;
      this.joyState.centerX = cx;
      this.joyState.centerY = cy;

      const maxR = Math.min(CONFIG.ui.joyMaxRadius || 50, Math.max(32, (rect.width || 148) * 0.34));
      const dead = CONFIG.ui.joyDeadZone || 6;
      const rawDx = clientX - cx;
      const rawDy = clientY - cy;
      const dist = Math.hypot(rawDx, rawDy);
      const angleRad = Math.atan2(rawDy, rawDx);
      const clampedR = Math.min(maxR, dist);
      const visX = dist > 0.001 ? Math.cos(angleRad) * clampedR : 0;
      const visY = dist > 0.001 ? Math.sin(angleRad) * clampedR : 0;

      let ux = 0;
      let uy = 0;
      let mag = 0;
      if (dist > dead) {
        mag = Math.min(1, (dist - dead) / Math.max(8, maxR - dead));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
      }

      // Rotate directional highlight arc so conic wedge centers on pointer angle
      const angleDeg = (angleRad * 180 / Math.PI) + 90 - 90;
      this.joyState.dx = visX;
      this.joyState.dy = visY;
      this.joyState.ux = ux;
      this.joyState.uy = uy;
      this.joyState.mag = mag;
      this.joyState.angleDeg = angleDeg;

      this.joyEl.style.setProperty('--joy-x', `${visX.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-y', `${visY.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-angle', `${angleDeg.toFixed(1)}deg`);
      this.joyEl.style.setProperty('--joy-mag', mag.toFixed(3));
    },

    _bindJoystickEvents(joyEl) {
      ['touchstart', 'touchmove', 'touchend'].forEach((evt) => {
        joyEl.addEventListener(evt, (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      });
      joyEl.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });

      joyEl.addEventListener('pointerdown', (e) => {
        if (!this.isTouch || !state.active || this.moveMode !== 'joystick') return;
        e.preventDefault();
        e.stopPropagation();
        RealmMusicEngine.unlockOnGesture();

        if (this.joyState.active && this.joyState.pointerId !== null && this.joyState.pointerId !== e.pointerId) {
          this.releasePointer(this.joyState.pointerId);
        }
        this.activePointers.set(e.pointerId, { role: 'JOYSTICK', el: joyEl });
        try { joyEl.setPointerCapture(e.pointerId); } catch (_) {}
        joyEl.classList.add('is-active');
        this.joyState.active = true;
        this.joyState.pointerId = e.pointerId;
        this._updateJoystickVector(e.clientX, e.clientY);
      }, { passive: false });

      joyEl.addEventListener('pointermove', (e) => {
        if (!this.isTouch || !state.active || this.moveMode !== 'joystick') return;
        if (this.joyState.pointerId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        const events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
        const lastEv = events[events.length - 1] || e;
        this._updateJoystickVector(lastEv.clientX, lastEv.clientY);
      }, { passive: false });

      const onRelease = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (e && e.pointerId !== undefined) this.releasePointer(e.pointerId);
      };
      joyEl.addEventListener('pointerup', onRelease, { passive: true });
      joyEl.addEventListener('pointercancel', onRelease, { passive: true });
      joyEl.addEventListener('lostpointercapture', onRelease, { passive: true });
    },

    _bindPadPointerEvents(el, role, onDownAction) {
      el.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });
      el.addEventListener('dragstart', (e) => { e.preventDefault(); e.stopPropagation(); });

      el.addEventListener('pointerdown', (e) => {
        if (!this.isTouch || !state.active) return;
        e.preventDefault();
        e.stopPropagation();
        RealmMusicEngine.unlockOnGesture();

        this.activePointers.set(e.pointerId, { role, el });
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        el.classList.add('is-held');

        if (typeof onDownAction === 'function') onDownAction(e);
        if (role === 'GUN') {
          state.touchFireHeld = true;
          if ((state.coreAmmo || 0) <= 0) this.flashEmpty();
          if (typeof updateHeaderUI === 'function') updateHeaderUI();
        }
      }, { passive: false });

      const releaseThisPointer = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (e && e.pointerId !== undefined) {
          this.releasePointer(e.pointerId);
        }
      };

      el.addEventListener('pointerup', releaseThisPointer, { passive: true });
      el.addEventListener('pointercancel', releaseThisPointer, { passive: true });
      el.addEventListener('lostpointercapture', releaseThisPointer, { passive: true });
    },

    _buildLuxuryFiligreeSvg(kind) {
      const strokeCol = kind === 'ult'
        ? 'rgba(253,224,71,0.62)'
        : (kind === 'skill2' ? 'rgba(103,232,249,0.56)' : (kind === 'pulse' ? 'rgba(110,231,183,0.56)' : 'rgba(253,224,71,0.54)'));
      return (
        '<svg class="oc-pad-filigree" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle cx="50" cy="50" r="45" fill="none" stroke="' + strokeCol + '" stroke-width="1.1" stroke-dasharray="14 4 3 4"/>' +
          '<circle cx="50" cy="50" r="39" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.7"/>' +
          '<path d="M50 2 L53 8 L50 12 L47 8 Z M50 98 L53 92 L50 88 L47 92 Z M2 50 L8 53 L12 50 L8 47 Z M98 50 L92 53 L88 50 L92 47 Z" fill="' + strokeCol + '"/>' +
        '</svg>'
      );
    },

    _buildGunCrownFrameSvg(mode) {
      const accent = mode === 'helix' ? '#67e8f9' : (mode === 'meteor' ? '#fb923c' : '#38bdf8');
      return (
        '<svg class="oc-gun-crown-frame" viewBox="0 0 128 128" aria-hidden="true">' +
          '<defs>' +
            '<linearGradient id="ocGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="#fef08a"/>' +
              '<stop offset="50%" stop-color="#f59e0b"/>' +
              '<stop offset="100%" stop-color="#fde047"/>' +
            '</linearGradient>' +
          '</defs>' +
          '<path d="M22 106 L10 92 L18 84 L30 98 Z M106 22 L118 36 L110 44 L98 30 Z M16 26 L28 14 L38 20 L24 34 Z" fill="url(#ocGoldRim)" opacity="0.82"/>' +
          '<path d="M18 64 A46 46 0 0 1 64 18 M110 64 A46 46 0 0 1 64 110" fill="none" stroke="' + accent + '" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>' +
          '<polygon points="64,3 69,11 64,15 59,11" fill="#fef08a"/>' +
          '<polygon points="3,64 11,59 15,64 11,69" fill="#fef08a"/>' +
        '</svg>'
      );
    },

    _buildJoyDialSvg(mode) {
      const tint = mode === 'helix' ? 'rgba(103,232,249,0.48)' : (mode === 'meteor' ? 'rgba(251,146,60,0.48)' : 'rgba(56,189,248,0.48)');
      return (
        '<svg class="oc-joy-dial-svg" viewBox="0 0 140 140" aria-hidden="true">' +
          '<circle cx="70" cy="70" r="64" fill="none" stroke="rgba(253,224,71,0.34)" stroke-width="1" stroke-dasharray="10 6"/>' +
          '<circle cx="70" cy="70" r="48" fill="none" stroke="' + tint + '" stroke-width="0.9" stroke-dasharray="2 5"/>' +
          '<path d="M70 8 L74 16 L66 16 Z M70 132 L74 124 L66 124 Z M8 70 L16 66 L16 74 Z M132 70 L124 66 L124 74 Z" fill="rgba(254,240,138,0.68)"/>' +
        '</svg>'
      );
    },

    _buildTouchPadArtwork(mode, role, tierOverride) {
      const m = (mode === 'helix') ? 'helix' : (mode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = tierOverride || ((typeof state !== 'undefined' && state.coreTier) || 1);
      if (role === 'ult' || role === 'joyknob') {
        const cls = role === 'joyknob' ? 'oc-joy-knob-img' : 'oc-ult-mini-core';
        const src = curTier >= 6
          ? `assets/core-${m}-t6-showcase.png?v=arcade410_luxury_joystick`
          : `assets/core-${m}-t5.png?v=arcade410_luxury_joystick`;
        return `<img class="${cls}" src="${src}" alt="" draggable="false" />`;
      }
      if (role === 'pulse') {
        return (
          '<svg class="oc-pad-emblem-svg" viewBox="0 0 48 48" aria-hidden="true">' +
            '<defs><linearGradient id="ocPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>' +
            '<polygon points="26,4 11,26 23,26 19,44 37,20 25,20" fill="url(#ocPulseGrad)" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>' +
          '</svg>'
        );
      }
      if (role === 'skill2') {
        if (m === 'helix') {
          return (
            '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
              '<defs>' +
                '<linearGradient id="ocHxS2C" x1="0%" y1="0%" x2="100%" y2="100%">' +
                  '<stop offset="0%" stop-color="#ecfeff"/>' +
                  '<stop offset="45%" stop-color="#22d3ee"/>' +
                  '<stop offset="100%" stop-color="#a855f7"/>' +
                '</linearGradient>' +
                '<linearGradient id="ocHxS2M" x1="100%" y1="0%" x2="0%" y2="100%">' +
                  '<stop offset="0%" stop-color="#f5d0fe"/>' +
                  '<stop offset="50%" stop-color="#e879f9"/>' +
                  '<stop offset="100%" stop-color="#0284c7"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<polygon points="32,5 44,22 32,46 20,22" fill="url(#ocHxS2C)" stroke="#ffffff" stroke-width="1.2"/>' +
              '<polygon points="32,5 44,22 32,27" fill="rgba(255,255,255,0.45)"/>' +
              '<polygon points="15,20 24,33 15,50 7,33" fill="url(#ocHxS2M)" stroke="#f0abfc" stroke-width="1"/>' +
              '<polygon points="49,20 57,33 49,50 40,33" fill="url(#ocHxS2M)" stroke="#67e8f9" stroke-width="1"/>' +
              '<circle cx="32" cy="22" r="3" fill="#ffffff"/>' +
            '</svg>'
          );
        }
        if (m === 'meteor') {
          return (
            '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
              '<defs>' +
                '<radialGradient id="ocMtS2Core" cx="38%" cy="35%" r="65%">' +
                  '<stop offset="0%" stop-color="#fef08a"/>' +
                  '<stop offset="45%" stop-color="#f97316"/>' +
                  '<stop offset="85%" stop-color="#991b1b"/>' +
                  '<stop offset="100%" stop-color="#450a0a"/>' +
                '</radialGradient>' +
                '<linearGradient id="ocMtS2Tail" x1="20%" y1="20%" x2="95%" y2="95%">' +
                  '<stop offset="0%" stop-color="#fde047"/>' +
                  '<stop offset="50%" stop-color="#f97316" stop-opacity="0.85"/>' +
                  '<stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<path d="M18 18 C34 20, 52 34, 58 56 C40 48, 24 36, 18 18 Z" fill="url(#ocMtS2Tail)"/>' +
              '<path d="M12 28 C28 10, 44 26, 28 44 Z" fill="none" stroke="#fde047" stroke-width="1.6" stroke-opacity="0.8"/>' +
              '<circle cx="24" cy="24" r="13" fill="url(#ocMtS2Core)" stroke="#fde047" stroke-width="1.3"/>' +
              '<path d="M16 21 Q24 25 31 19 M19 30 Q25 26 32 31" stroke="#fef9c3" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
            '</svg>'
          );
        }
        return (
          '<svg class="oc-pad-emblem-svg" viewBox="0 0 64 64" aria-hidden="true">' +
            '<defs>' +
              '<linearGradient id="ocDyS2G" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#ffffff"/>' +
                '<stop offset="38%" stop-color="#67e8f9"/>' +
                '<stop offset="100%" stop-color="#a855f7"/>' +
              '</linearGradient>' +
              '<linearGradient id="ocDyS2Gold" x1="0%" y1="0%" x2="0%" y2="100%">' +
                '<stop offset="0%" stop-color="#fef08a"/>' +
                '<stop offset="100%" stop-color="#d97706"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<circle cx="32" cy="32" r="22" fill="none" stroke="url(#ocDyS2Gold)" stroke-width="1.5" stroke-dasharray="7 4"/>' +
            '<polygon points="35,6 16,34 30,34 25,58 48,28 34,28" fill="url(#ocDyS2G)" stroke="#fef08a" stroke-width="1.2" stroke-linejoin="round"/>' +
          '</svg>'
        );
      }
      // role === 'gun' ornate realm weapon crest
      if (m === 'helix') {
        return (
          '<svg viewBox="0 0 40 26" aria-hidden="true">' +
            '<path d="M7 21 L14 4 L20 14 L26 4 L33 21 L20 16 Z" fill="rgba(103,232,249,0.34)" stroke="#a5f3fc" stroke-width="1.6" stroke-linejoin="round"/>' +
            '<circle cx="20" cy="11" r="3.2" fill="#f0abfc" stroke="#ffffff" stroke-width="0.9"/>' +
          '</svg>'
        );
      }
      if (m === 'meteor') {
        return (
          '<svg viewBox="0 0 40 26" aria-hidden="true">' +
            '<path d="M6 21 L14 4 L20 13 L26 4 L34 21 L20 15 Z" fill="rgba(251,146,60,0.48)" stroke="#fde047" stroke-width="1.7" stroke-linejoin="round"/>' +
            '<circle cx="20" cy="11" r="3.4" fill="#fef08a"/>' +
          '</svg>'
        );
      }
      return (
        '<svg viewBox="0 0 40 26" aria-hidden="true">' +
          '<path d="M6 21 L14 4 L20 13 L26 4 L34 21 L20 15 Z" fill="rgba(56,189,248,0.44)" stroke="#fde047" stroke-width="1.7" stroke-linejoin="round"/>' +
          '<circle cx="20" cy="11" r="3.2" fill="#e0f2fe"/>' +
        '</svg>'
      );
    },

    ensureTouchCluster() {
      if (!this.isTouch) return null;
      if (this.clusterEl && this.clusterEl.isConnected) return this.clusterEl;

      const host = dom.viewReflex || document.getElementById('cgViewReflex');
      if (!host) return null;

      const rawMode = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (rawMode === 'helix') ? 'helix' : (rawMode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = (typeof state !== 'undefined' && state.coreTier) || 1;
      const ars = getRealmArsenal(curMode);

      const cluster = document.createElement('div');
      cluster.id = 'ocTouchControlCluster';
      cluster.className = 'oc-touch-hidden' + (this.leftHanded ? ' left-handed' : '');
      cluster.setAttribute('data-realm', curMode);
      cluster.setAttribute('data-move-mode', this.moveMode);
      cluster.setAttribute('aria-label', 'Touch Combat & Virtual Joystick Controls');

      const knobSrc = curTier >= 6
        ? `assets/core-${curMode}-t6-showcase.png?v=arcade410_luxury_joystick`
        : `assets/core-${curMode}-t5.png?v=arcade410_luxury_joystick`;

      cluster.innerHTML =
        '<div id="ocTouchModePill" role="group" aria-label="Touch Movement Mode">' +
          '<button type="button" class="oc-mode-seg' + (this.moveMode === 'joystick' ? ' is-active' : '') + '" id="ocModeSegStick" data-mode="joystick">STICK</button>' +
          '<button type="button" class="oc-mode-seg' + (this.moveMode === 'onpoint' ? ' is-active' : '') + '" id="ocModeSegOnPoint" data-mode="onpoint">ON-POINT</button>' +
        '</div>' +
        '<div id="ocVirtualJoystickWrap">' +
          '<div id="ocVirtualJoystick" role="slider" aria-label="Virtual Flight Joystick" aria-valuemin="0" aria-valuemax="100">' +
            this._buildJoyDialSvg(curMode) +
            '<div id="ocJoyDirArc"></div>' +
            '<div id="ocVirtualJoyKnob">' +
              '<img class="oc-joy-knob-img" id="ocJoyKnobImg" src="' + knobSrc + '" alt="" draggable="false" />' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-pulse">' +
          '<div role="button" tabindex="-1" id="ocTouchPulseBtn" class="oc-touch-pad is-charging" aria-label="Flux Pulse">' +
            this._buildLuxuryFiligreeSvg('pulse') +
            '<div class="oc-pulse-sweep" id="ocTouchPulseSweep"></div>' +
            '<span class="oc-pad-icon">' + this._buildTouchPadArtwork(curMode, 'pulse', curTier) + '</span>' +
            '<span class="oc-pulse-pct" id="ocTouchPulsePct">0%</span>' +
          '</div>' +
          '<span class="oc-pad-caption">PULSE</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-ult">' +
          '<div role="button" tabindex="-1" id="ocTouchUltBtn" class="oc-touch-pad" aria-label="' + ars.ult + '">' +
            this._buildLuxuryFiligreeSvg('ult') +
            '<span class="oc-pad-icon" id="ocTouchUltIcon">' + this._buildTouchPadArtwork(curMode, 'ult', curTier) + '</span>' +
            '<span class="oc-fire-sub">ULT</span>' +
            '<div class="oc-cd-sweep" id="ocTouchUltSweep"></div>' +
            '<div class="oc-cd-text" id="ocTouchUltCdText"></div>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchUltCap">' + ars.ult + '</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-skill2">' +
          '<div role="button" tabindex="-1" id="ocTouchSkill2Btn" class="oc-touch-pad" aria-label="' + ars.skill2 + '">' +
            this._buildLuxuryFiligreeSvg('skill2') +
            '<span class="oc-pad-icon" id="ocTouchSkill2Icon">' + this._buildTouchPadArtwork(curMode, 'skill2', curTier) + '</span>' +
            '<span class="oc-fire-sub" id="ocTouchSkill2Sub">' + ars.s2Count + '×</span>' +
            '<div class="oc-cd-sweep" id="ocTouchSkill2Sweep"></div>' +
            '<div class="oc-cd-text" id="ocTouchSkill2CdText"></div>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchSkill2Cap">' + ars.skill2 + '</span>' +
        '</div>' +
        '<div class="oc-touch-pad-wrap oc-pad-wrap-gun">' +
          this._buildGunCrownFrameSvg(curMode) +
          '<div role="button" tabindex="-1" id="ocTouchGunBtn" class="oc-touch-pad" aria-label="' + ars.gun + '">' +
            this._buildLuxuryFiligreeSvg('gun') +
            '<span class="oc-gun-crest" id="ocTouchGunCrest">' + this._buildTouchPadArtwork(curMode, 'gun', curTier) + '</span>' +
            '<span class="oc-fire-label">FIRE</span>' +
            '<span class="oc-fire-ammo" id="ocTouchFireAmmo">0</span>' +
            '<span class="oc-fire-sub">HOLD</span>' +
          '</div>' +
          '<span class="oc-pad-caption" id="ocTouchGunCap">' + ars.gun + '</span>' +
        '</div>';

      host.appendChild(cluster);
      this.clusterEl = cluster;
      this.joyWrapEl = cluster.querySelector('#ocVirtualJoystickWrap');
      this.joyEl = cluster.querySelector('#ocVirtualJoystick');
      this.joyDirArcEl = cluster.querySelector('#ocJoyDirArc');
      this.joyKnobEl = cluster.querySelector('#ocVirtualJoyKnob');
      this.joyKnobImgEl = cluster.querySelector('#ocJoyKnobImg');
      this.modePillEl = cluster.querySelector('#ocTouchModePill');
      this.modeBtnStick = cluster.querySelector('#ocModeSegStick');
      this.modeBtnOnPoint = cluster.querySelector('#ocModeSegOnPoint');
      this.pulseBtn = cluster.querySelector('#ocTouchPulseBtn');
      this.pulseSweepEl = cluster.querySelector('#ocTouchPulseSweep');
      this.pulsePctEl = cluster.querySelector('#ocTouchPulsePct');
      this.gunBtn = cluster.querySelector('#ocTouchGunBtn');
      this.skill2Btn = cluster.querySelector('#ocTouchSkill2Btn');
      this.ultBtn = cluster.querySelector('#ocTouchUltBtn');
      this.ammoEl = cluster.querySelector('#ocTouchFireAmmo');
      this.skill2SweepEl = cluster.querySelector('#ocTouchSkill2Sweep');
      this.skill2CdTextEl = cluster.querySelector('#ocTouchSkill2CdText');
      this.ultSweepEl = cluster.querySelector('#ocTouchUltSweep');
      this.ultCdTextEl = cluster.querySelector('#ocTouchUltCdText');
      this.ultIconEl = cluster.querySelector('#ocTouchUltIcon');
      this.ultCapEl = cluster.querySelector('#ocTouchUltCap');
      this.skill2IconEl = cluster.querySelector('#ocTouchSkill2Icon');
      this.skill2SubEl = cluster.querySelector('#ocTouchSkill2Sub');
      this.skill2CapEl = cluster.querySelector('#ocTouchSkill2Cap');
      this.gunCapEl = cluster.querySelector('#ocTouchGunCap');
      this.gunCrestEl = cluster.querySelector('#ocTouchGunCrest');

      if (this.joyEl) this._bindJoystickEvents(this.joyEl);

      if (this.modePillEl) {
        this.modePillEl.addEventListener('touchstart', (e) => { e.stopPropagation(); }, { passive: true });
        this.modePillEl.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
      }
      if (this.modeBtnStick) this.modeBtnStick.onclick = (e) => { e.stopPropagation(); this.setMoveMode('joystick'); };
      if (this.modeBtnOnPoint) this.modeBtnOnPoint.onclick = (e) => { e.stopPropagation(); this.setMoveMode('onpoint'); };

      this._bindPadPointerEvents(this.gunBtn, 'GUN');
      this._bindPadPointerEvents(this.skill2Btn, 'SKILL2', () => {
        SkillSystem.castSeekerComets(performance.now());
      });
      this._bindPadPointerEvents(this.ultBtn, 'ULT', () => {
        SkillSystem.castCalderaNova(performance.now());
      });
      this._bindPadPointerEvents(this.pulseBtn, 'PULSE', () => {
        if (typeof window.triggerFluxPulse === 'function') window.triggerFluxPulse(false);
      });

      this._syncMoveModeUI();
      this._cachedAmmoStr = null;
      this._cachedHidden = true;
      this._cachedRealmMode = null;
      this._cachedVisualTier = curTier;
      return cluster;
    },

    ensureDesktopHud() {
      if (this.isTouch) return null;
      if (this.deskHudEl && this.deskHudEl.isConnected) return this.deskHudEl;

      const host = dom.viewReflex || document.getElementById('cgViewReflex');
      if (!host) return null;

      const rawMode = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (rawMode === 'helix') ? 'helix' : (rawMode === 'meteor' ? 'meteor' : 'dynamo');
      const curTier = (typeof state !== 'undefined' && state.coreTier) || 1;
      const ars = getRealmArsenal(curMode);

      const hud = document.createElement('div');
      hud.id = 'ocDesktopSkillHud';
      hud.className = 'oc-desk-hidden';
      hud.innerHTML =
        '<div class="oc-desk-chip" data-skill="gun" id="ocDeskGunChip">' +
          '<span class="oc-desk-keycap">A</span>' +
          '<span class="oc-desk-emblem" id="ocDeskGunEmb">' + this._buildTouchPadArtwork(curMode, 'gun', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskGunName">' + ars.gun + '</span>' +
            '<span class="oc-desk-status" id="ocDeskGunStatus">HOLD</span>' +
          '</div>' +
        '</div>' +
        '<div class="oc-desk-chip" data-skill="skill2" id="ocDeskSkill2Chip">' +
          '<span class="oc-desk-keycap">S</span>' +
          '<span class="oc-desk-emblem" id="ocDeskSkill2Emb">' + this._buildTouchPadArtwork(curMode, 'skill2', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskSkill2Name">' + ars.skill2 + '</span>' +
            '<span class="oc-desk-status" id="ocDeskSkill2Status">READY</span>' +
          '</div>' +
          '<div class="oc-desk-cdbar" id="ocDeskSkill2Bar"></div>' +
        '</div>' +
        '<div class="oc-desk-chip" data-skill="ult" id="ocDeskUltChip">' +
          '<span class="oc-desk-keycap">D</span>' +
          '<span class="oc-desk-emblem" id="ocDeskUltEmb">' + this._buildTouchPadArtwork(curMode, 'ult', curTier) + '</span>' +
          '<div class="oc-desk-meta">' +
            '<span class="oc-desk-name" id="ocDeskUltName">' + ars.ult + '</span>' +
            '<span class="oc-desk-status" id="ocDeskUltStatus">READY</span>' +
          '</div>' +
          '<div class="oc-desk-cdbar" id="ocDeskUltBar"></div>' +
        '</div>';

      host.appendChild(hud);
      this.deskHudEl = hud;
      this.deskGunChip = hud.querySelector('#ocDeskGunChip');
      this.deskGunEmb = hud.querySelector('#ocDeskGunEmb');
      this.deskGunName = hud.querySelector('#ocDeskGunName');
      this.deskGunStatus = hud.querySelector('#ocDeskGunStatus');
      this.deskSkill2Chip = hud.querySelector('#ocDeskSkill2Chip');
      this.deskSkill2Emb = hud.querySelector('#ocDeskSkill2Emb');
      this.deskSkill2Name = hud.querySelector('#ocDeskSkill2Name');
      this.deskSkill2Status = hud.querySelector('#ocDeskSkill2Status');
      this.deskSkill2Bar = hud.querySelector('#ocDeskSkill2Bar');
      this.deskUltChip = hud.querySelector('#ocDeskUltChip');
      this.deskUltEmb = hud.querySelector('#ocDeskUltEmb');
      this.deskUltName = hud.querySelector('#ocDeskUltName');
      this.deskUltStatus = hud.querySelector('#ocDeskUltStatus');
      this.deskUltBar = hud.querySelector('#ocDeskUltBar');

      // Interactive mouse click/hold on enhanced desktop skill cards
      if (this.deskGunChip) {
        this.deskGunChip.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 || !state.active) return;
          e.stopPropagation();
          state.pointerFiring = true;
          if ((state.coreAmmo || 0) <= 0) this.flashEmpty();
          updateHeaderUI();
        });
        const stopDeskGun = () => {
          if (state.pointerFiring) {
            state.pointerFiring = false;
            updateHeaderUI();
          }
        };
        this.deskGunChip.addEventListener('pointerup', stopDeskGun);
        this.deskGunChip.addEventListener('pointerleave', stopDeskGun);
      }
      if (this.deskSkill2Chip) {
        this.deskSkill2Chip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.active) SkillSystem.castSeekerComets(performance.now());
        });
      }
      if (this.deskUltChip) {
        this.deskUltChip.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.active) SkillSystem.castCalderaNova(performance.now());
        });
      }

      this._cachedDeskHidden = true;
      this._cachedRealmMode = null;
      this._cachedVisualTier = curTier;
      return hud;
    },

    destroyTouchCluster() {
      if (this._emptyFlashTimer) {
        clearTimeout(this._emptyFlashTimer);
        this._emptyFlashTimer = null;
      }
      if (this.clusterEl && this.clusterEl.parentNode) {
        this.clusterEl.parentNode.removeChild(this.clusterEl);
      }
      this.clusterEl = null;
      this.joyWrapEl = null;
      this.joyEl = null;
      this.joyDirArcEl = null;
      this.joyKnobEl = null;
      this.joyKnobImgEl = null;
      this.modePillEl = null;
      this.modeBtnStick = null;
      this.modeBtnOnPoint = null;
      this.pulseBtn = null;
      this.pulseSweepEl = null;
      this.pulsePctEl = null;
      this.gunBtn = null;
      this.skill2Btn = null;
      this.ultBtn = null;
      this.ammoEl = null;
      this.skill2SweepEl = null;
      this.skill2CdTextEl = null;
      this.ultSweepEl = null;
      this.ultCdTextEl = null;
      this.ultIconEl = null;
      this.ultCapEl = null;
      this.skill2IconEl = null;
      this.skill2SubEl = null;
      this.skill2CapEl = null;
      this.gunCapEl = null;
      this.gunCrestEl = null;
      this._cachedAmmoStr = null;
      this._cachedHidden = null;
      this._cachedRealmMode = null;
      this._cachedVisualTier = null;
      this._cdCache = {};
      this._resetJoystickVisual();
    },

    destroyDesktopHud() {
      if (this.deskHudEl && this.deskHudEl.parentNode) {
        this.deskHudEl.parentNode.removeChild(this.deskHudEl);
      }
      this.deskHudEl = null;
      this.deskGunChip = null;
      this.deskGunEmb = null;
      this.deskGunName = null;
      this.deskGunStatus = null;
      this.deskSkill2Chip = null;
      this.deskSkill2Emb = null;
      this.deskSkill2Name = null;
      this.deskSkill2Status = null;
      this.deskSkill2Bar = null;
      this.deskUltChip = null;
      this.deskUltEmb = null;
      this.deskUltName = null;
      this.deskUltStatus = null;
      this.deskUltBar = null;
      this._cachedDeskHidden = null;
      this._cachedRealmMode = null;
      this._cachedVisualTier = null;
      this._cdCache = {};
    },

    releasePointer(pointerId) {
      const entry = this.activePointers.get(pointerId);
      if (!entry) return;
      this.activePointers.delete(pointerId);
      if (entry.el) {
        try {
          if (entry.el.hasPointerCapture && entry.el.hasPointerCapture(pointerId)) {
            entry.el.releasePointerCapture(pointerId);
          }
        } catch (_) {}
        if (!this.hasRole(entry.role)) {
          entry.el.classList.remove('is-held');
        }
      }
      if (entry.role === 'GUN') {
        const stillHeld = this.hasRole('GUN');
        state.touchFireHeld = stillHeld;
        if (!stillHeld && typeof updateHeaderUI === 'function') updateHeaderUI();
      } else if (entry.role === 'MOVE') {
        if (!this.hasRole('MOVE')) {
          isPointerDown = false;
          touchGuidePos.active = false;
        }
      } else if (entry.role === 'JOYSTICK') {
        if (!this.hasRole('JOYSTICK')) {
          this._resetJoystickVisual();
        }
      }
    },

    releaseAllPointers() {
      const pids = Array.from(this.activePointers.keys());
      for (let i = 0; i < pids.length; i++) {
        this.releasePointer(pids[i]);
      }
      this.activePointers.clear();
      this._resetJoystickVisual();
      state.touchFireHeld = false;
      isPointerDown = false;
      touchGuidePos.active = false;
      if (this.gunBtn) this.gunBtn.classList.remove('is-held');
      if (this.skill2Btn) this.skill2Btn.classList.remove('is-held');
      if (this.ultBtn) this.ultBtn.classList.remove('is-held');
      if (this.pulseBtn) this.pulseBtn.classList.remove('is-held');
    },

    releaseFire() {
      const gunPids = [];
      for (const [pid, entry] of this.activePointers.entries()) {
        if (entry.role === 'GUN') gunPids.push(pid);
      }
      for (let i = 0; i < gunPids.length; i++) {
        this.releasePointer(gunPids[i]);
      }
      state.touchFireHeld = false;
      if (this.gunBtn) this.gunBtn.classList.remove('is-held');
    },

    clearHeldKeys() {
      const hadGunKey = this.heldKeys.has('KeyA') || this.heldKeys.has('KeyF');
      this.heldKeys.clear();
      if (hadGunKey && typeof updateHeaderUI === 'function') updateHeaderUI();
    },

    flashEmpty() {
      const now = performance.now();
      if (now - this._lastEmptyFlashAt < 260) return;
      this._lastEmptyFlashAt = now;
      if (this.gunBtn) {
        this.gunBtn.classList.add('oc-fire-empty-flash');
        if (this._emptyFlashTimer) clearTimeout(this._emptyFlashTimer);
        this._emptyFlashTimer = setTimeout(() => {
          if (this.gunBtn) this.gunBtn.classList.remove('oc-fire-empty-flash');
          this._emptyFlashTimer = null;
        }, CONFIG.gun.emptyFlashMs);
      }
      if (this.deskGunChip) {
        this.deskGunChip.classList.add('oc-cd-shake');
        setTimeout(() => { if (this.deskGunChip) this.deskGunChip.classList.remove('oc-cd-shake'); }, 260);
      }
      audio.playCooldownReject();
    },

    triggerSkillFeedback(skillKey, kind) {
      const el = this.isTouch
        ? (skillKey === 'ult' ? this.ultBtn : this.skill2Btn)
        : (skillKey === 'ult' ? this.deskUltChip : this.deskSkill2Chip);
      if (!el) return;
      const cls = kind === 'ready' ? 'oc-ready-pulse' : 'oc-cd-shake';
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => { if (el) el.classList.remove(cls); }, kind === 'ready' ? 440 : 280);
    },

    _syncRealmLabels() {
      const raw = (typeof state !== 'undefined' && (state.catcherType || state.gameType)) || 'dynamo';
      const curMode = (raw === 'helix') ? 'helix' : (raw === 'meteor' ? 'meteor' : 'dynamo');
      const isT6 = ((typeof state !== 'undefined' && state.coreTier) || 1) >= 6;
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
          ? `assets/core-${curMode}-t6-showcase.png?v=arcade410_luxury_joystick`
          : `assets/core-${curMode}-t5.png?v=arcade410_luxury_joystick`;
      }
      if (this.ultIconEl) this.ultIconEl.innerHTML = this._buildTouchPadArtwork(curMode, 'ult', tierNum);
      if (this.ultCapEl) this.ultCapEl.textContent = ars.ult;
      if (this.ultBtn) this.ultBtn.setAttribute('aria-label', ars.ult);
      if (this.skill2IconEl) this.skill2IconEl.innerHTML = this._buildTouchPadArtwork(curMode, 'skill2', tierNum);
      if (this.skill2SubEl) this.skill2SubEl.textContent = `${ars.s2Count}×`;
      if (this.skill2CapEl) this.skill2CapEl.textContent = ars.skill2;
      if (this.skill2Btn) this.skill2Btn.setAttribute('aria-label', ars.skill2);
      if (this.gunCrestEl) this.gunCrestEl.innerHTML = this._buildTouchPadArtwork(curMode, 'gun', tierNum);
      if (this.gunCapEl) this.gunCapEl.textContent = ars.gun;
      if (this.gunBtn) this.gunBtn.setAttribute('aria-label', ars.gun);
      if (this.deskGunName) this.deskGunName.textContent = ars.gun;
      if (this.deskSkill2Name) this.deskSkill2Name.textContent = ars.skill2;
      if (this.deskUltName) this.deskUltName.textContent = ars.ult;
      if (this.deskGunEmb) this.deskGunEmb.innerHTML = this._buildTouchPadArtwork(curMode, 'gun', tierNum);
      if (this.deskSkill2Emb) this.deskSkill2Emb.innerHTML = this._buildTouchPadArtwork(curMode, 'skill2', tierNum);
      if (this.deskUltEmb) this.deskUltEmb.innerHTML = this._buildTouchPadArtwork(curMode, 'ult', tierNum);
    },

    syncSkillCooldownUI() {
      this._syncRealmLabels();
      const cache = this._cdCache || (this._cdCache = {});
      const s2Rem = Math.max(0, SkillSystem.skill2CdMs || 0);
      const s2Max = CONFIG.skill2.cooldownMs;
      const uRem = Math.max(0, SkillSystem.ultCdMs || 0);
      const uMax = CONFIG.ult.cooldownMs;

      if (this.isTouch) {
        if (this.skill2Btn) {
          const onCd = s2Rem > 0;
          if (cache.tS2OnCd !== onCd) {
            cache.tS2OnCd = onCd;
            this.skill2Btn.classList.toggle('on-cooldown', onCd);
          }
          if (this.skill2SweepEl) {
            const deg = onCd ? Math.round((s2Rem / s2Max) * 360) : 0;
            if (cache.tS2Deg !== deg) {
              cache.tS2Deg = deg;
              this.skill2SweepEl.style.setProperty('--cd-deg', `${deg}deg`);
            }
          }
          if (this.skill2CdTextEl) {
            const txt = onCd ? String(Math.ceil(s2Rem / 1000)) : '';
            if (cache.tS2Txt !== txt) {
              cache.tS2Txt = txt;
              this.skill2CdTextEl.textContent = txt;
            }
          }
        }
        if (this.ultBtn) {
          const onCd = uRem > 0;
          if (cache.tUltOnCd !== onCd) {
            cache.tUltOnCd = onCd;
            this.ultBtn.classList.toggle('on-cooldown', onCd);
          }
          if (this.ultSweepEl) {
            const deg = onCd ? Math.round((uRem / uMax) * 360) : 0;
            if (cache.tUltDeg !== deg) {
              cache.tUltDeg = deg;
              this.ultSweepEl.style.setProperty('--cd-deg', `${deg}deg`);
            }
          }
          if (this.ultCdTextEl) {
            const txt = onCd ? String(Math.ceil(uRem / 1000)) : '';
            if (cache.tUltTxt !== txt) {
              cache.tUltTxt = txt;
              this.ultCdTextEl.textContent = txt;
            }
          }
        }
        if (this.pulseBtn) {
          const pPct = state.isPulseReady ? 100 : Math.min(99, Math.round(((state.pulseMeter || 0) / 3) * 100));
          const pReady = !!state.isPulseReady;
          if (cache.tPulseReady !== pReady) {
            cache.tPulseReady = pReady;
            this.pulseBtn.classList.toggle('is-ready', pReady);
            this.pulseBtn.classList.toggle('is-charging', !pReady);
          }
          if (this.pulseSweepEl) {
            const pDeg = Math.round((pPct / 100) * 360);
            if (cache.tPulseDeg !== pDeg) {
              cache.tPulseDeg = pDeg;
              this.pulseSweepEl.style.setProperty('--pulse-deg', `${pDeg}deg`);
            }
          }
          if (this.pulsePctEl) {
            const pTxt = pReady ? 'READY' : `${pPct}%`;
            if (cache.tPulseTxt !== pTxt) {
              cache.tPulseTxt = pTxt;
              this.pulsePctEl.textContent = pTxt;
            }
          }
        }
      } else if (this.deskHudEl) {
        if (this.deskGunChip) {
          const activeGun = (this.isDesktopKeyGunHeld() || !!state.pointerFiring) && (state.coreAmmo || 0) > 0;
          if (cache.dGunActive !== activeGun) {
            cache.dGunActive = activeGun;
            this.deskGunChip.classList.toggle('is-active', activeGun);
          }
          if (this.deskGunStatus) {
            const gTxt = (state.coreAmmo || 0) <= 0 ? 'EMPTY' : formatAmmoCount(state.coreAmmo);
            if (cache.dGunTxt !== gTxt) {
              cache.dGunTxt = gTxt;
              this.deskGunStatus.textContent = gTxt;
            }
          }
        }
        if (this.deskSkill2Chip) {
          const onCd = s2Rem > 0;
          if (cache.dS2OnCd !== onCd) {
            cache.dS2OnCd = onCd;
            this.deskSkill2Chip.classList.toggle('on-cooldown', onCd);
          }
          const txt = onCd ? `${Math.ceil(s2Rem / 1000)}s` : 'READY';
          if (this.deskSkill2Status && cache.dS2Txt !== txt) {
            cache.dS2Txt = txt;
            this.deskSkill2Status.textContent = txt;
          }
          if (this.deskSkill2Bar) {
            const pct = onCd ? Math.round((s2Rem / s2Max) * 100) : 0;
            if (cache.dS2Pct !== pct) {
              cache.dS2Pct = pct;
              this.deskSkill2Bar.style.setProperty('--cd-pct', `${pct}%`);
            }
          }
        }
        if (this.deskUltChip) {
          const onCd = uRem > 0;
          if (cache.dUltOnCd !== onCd) {
            cache.dUltOnCd = onCd;
            this.deskUltChip.classList.toggle('on-cooldown', onCd);
          }
          const txt = onCd ? `${Math.ceil(uRem / 1000)}s` : 'READY';
          if (this.deskUltStatus && cache.dUltTxt !== txt) {
            cache.dUltTxt = txt;
            this.deskUltStatus.textContent = txt;
          }
          if (this.deskUltBar) {
            const pct = onCd ? Math.round((uRem / uMax) * 100) : 0;
            if (cache.dUltPct !== pct) {
              cache.dUltPct = pct;
              this.deskUltBar.style.setProperty('--cd-pct', `${pct}%`);
            }
          }
        }
      }
    },

    syncUI() {
      const isCoreArcade = (state.gameType === 'dynamo' || state.gameType === 'realm' || state.gameType === 'helix' || state.gameType === 'meteor');
      const overlayVisible = !!(dom.screenOverlay && dom.screenOverlay.style.display === 'flex');
      const shouldShow = !!(state.active && isCoreArcade && !overlayVisible);
      this._syncLeftHandBtn();
      this._syncMoveModeUI();

      if (!this.isTouch) {
        if (this.clusterEl) this.destroyTouchCluster();
        if (!shouldShow) {
          if (this.deskHudEl && !this._cachedDeskHidden) {
            this._cachedDeskHidden = true;
            this.deskHudEl.classList.add('oc-desk-hidden');
          }
          return;
        }
        const dh = this.ensureDesktopHud();
        if (dh && this._cachedDeskHidden !== false) {
          this._cachedDeskHidden = false;
          dh.classList.remove('oc-desk-hidden');
        }
        this.syncSkillCooldownUI();
        return;
      }

      if (this.deskHudEl) this.destroyDesktopHud();

      if (!shouldShow) {
        if (this.activePointers.size > 0) this.releaseAllPointers();
        if (this.clusterEl && !this._cachedHidden) {
          this._cachedHidden = true;
          this.clusterEl.classList.add('oc-touch-hidden');
        }
        return;
      }

      const cluster = this.ensureTouchCluster();
      if (!cluster) return;

      if (this._cachedHidden !== false) {
        this._cachedHidden = false;
        cluster.classList.remove('oc-touch-hidden');
      }

      const ammoCnt = Number.isFinite(state.coreAmmo) ? Math.max(0, Math.floor(state.coreAmmo)) : 0;
      const ammoStr = formatAmmoCount(ammoCnt);
      if (this._cachedAmmoStr !== ammoStr) {
        this._cachedAmmoStr = ammoStr;
        if (this.ammoEl) this.ammoEl.textContent = ammoStr;
        if (this.gunBtn) this.gunBtn.classList.toggle('is-empty', ammoCnt <= 0);
      }
      if (this.gunBtn) {
        this.gunBtn.classList.toggle('is-held', this.isGunHeld() && ammoCnt > 0);
      }
      this.syncSkillCooldownUI();
    }"""

    js = js[:t0] + new_tf_block + js[t1:]

    # 4. Update updateTargetText() hint to reflect STICK vs ON-POINT mode
    old_hint = """    const targetHint = isTouch
      ? 'DRAG TO ALIGN CHROME CORE · INTERCEPT CELESTIAL FLUX NODES'
      : 'ALIGN CHROME CORE WITH CURSOR · INTERCEPT CELESTIAL FLUX NODES';"""
    new_hint = """    const targetHint = isTouch
      ? (TouchFireControls.moveMode === 'joystick'
          ? 'STEER VIA VIRTUAL JOYSTICK · SWITCH TO ON-POINT ANYTIME'
          : 'TOUCH & GLIDE ON-POINT · SWITCH TO JOYSTICK ANYTIME')
      : 'ALIGN CHROME CORE WITH CURSOR · INTERCEPT CELESTIAL FLUX NODES';"""
    js = replace_once(js, old_hint, new_hint, "updateTargetText")

    # 5. Update reflexGameLoop steering to drive proportional analog joystick velocity
    old_loop_move = """    const isEmpSlowed = (state.empSlowUntil && state.empSlowUntil > timestamp && !state.hasBuff('shield', timestamp));
    if (deviceInputMode === 'touch') {
      if (isEmpSlowed) {
        currentCatcherX += (targetCatcherX - currentCatcherX) * 0.34;
        currentCatcherY += (targetCatcherY - currentCatcherY) * 0.34;
      } else {
        currentCatcherX = targetCatcherX;
        currentCatcherY = targetCatcherY;
      }
    } else {"""
    new_loop_move = """    const isEmpSlowed = (state.empSlowUntil && state.empSlowUntil > timestamp && !state.hasBuff('shield', timestamp));
    const joyDt = Math.min(0.05, Math.max(0.004, (timestamp - (state._lastJoyTs || timestamp - 16)) / 1000));
    state._lastJoyTs = timestamp;
    if (TouchFireControls.isTouch && TouchFireControls.moveMode === 'joystick' && TouchFireControls.joyState.active && TouchFireControls.joyState.mag > 0) {
      const j = TouchFireControls.joyState;
      const speedCurve = j.mag * (0.32 + 0.68 * j.mag);
      const maxSpd = isEmpSlowed ? 430 : (CONFIG.ui.joyMaxSpeedPx || 820);
      const spdPx = maxSpd * speedCurve * joyDt;
      targetCatcherX = Math.max(0.04, Math.min(0.96, targetCatcherX + (j.ux * spdPx) / Math.max(320, w)));
      targetCatcherY = Math.max(0.06, Math.min(0.94, targetCatcherY + (j.uy * spdPx) / Math.max(320, h)));
      currentCatcherX = targetCatcherX;
      currentCatcherY = targetCatcherY;
    } else if (deviceInputMode === 'touch') {
      if (isEmpSlowed) {
        currentCatcherX += (targetCatcherX - currentCatcherX) * 0.34;
        currentCatcherY += (targetCatcherY - currentCatcherY) * 0.34;
      } else {
        currentCatcherX = targetCatcherX;
        currentCatcherY = targetCatcherY;
      }
    } else {"""
    js = replace_once(js, old_loop_move, new_loop_move, "reflexGameLoop joystick drive")

    # 6. Update onPointerDown touch routing (respect joystick vs onpoint + auto-promote real touch)
    old_down = """      if (TouchFireControls.isTouch) {
        // Ignore touches on the Kimmy 3-button arc (handled directly by each pad's setPointerCapture)
        if (e.target && e.target.closest && e.target.closest('#ocTouchControlCluster')) {
          return;
        }
        // Ignore topbar controls & game-over overlay buttons
        if (e.target && e.target.closest && e.target.closest('.game-topbar, .game-screen-overlay, .reflex-start-overlay')) {
          return;
        }
        // Ignore if this pointerId already owns a button role
        if (TouchFireControls.activePointers.has(e.pointerId)) {
          return;
        }
        setDeviceMode('touch');

        // Assign MOVE role if no active MOVE finger exists yet (extra fingers outside buttons never cancel GUN or MOVE!)
        if (!TouchFireControls.hasRole('MOVE')) {
          TouchFireControls.activePointers.set(e.pointerId, { role: 'MOVE', el: null });
          isPointerDown = true;
          const coords = getCanvasCoords(e.clientX, e.clientY);
          lastTouchClientX = e.clientX;
          lastTouchClientY = e.clientY;
          touchGuidePos = { x: coords.x, y: coords.y, active: true };
          targetCatcherX = coords.normX;
          currentCatcherX = coords.normX;
          targetCatcherY = coords.normY;
          currentCatcherY = coords.normY;
        }
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Existing non-touch desktop/laptop path (UNTOUCHED)
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        setDeviceMode('touch');
      } else if (e.pointerType === 'mouse') {"""

    new_down = """      if (e.pointerType === 'touch' && !TouchFireControls.isTouch) {
        setDeviceMode('touch');
        TouchFireControls.promoteToTouchOnRealTouch();
      }
      if (TouchFireControls.isTouch) {
        if (e.target && e.target.closest && e.target.closest('#ocTouchControlCluster')) {
          return;
        }
        if (e.target && e.target.closest && e.target.closest('.game-topbar, .game-screen-overlay, .reflex-start-overlay')) {
          return;
        }
        if (TouchFireControls.activePointers.has(e.pointerId)) {
          return;
        }
        setDeviceMode('touch');

        // Only move on-point across the playfield when player has selected ON-POINT mode!
        if (TouchFireControls.moveMode === 'onpoint' && !TouchFireControls.hasRole('MOVE')) {
          TouchFireControls.activePointers.set(e.pointerId, { role: 'MOVE', el: null });
          isPointerDown = true;
          const coords = getCanvasCoords(e.clientX, e.clientY);
          lastTouchClientX = e.clientX;
          lastTouchClientY = e.clientY;
          touchGuidePos = { x: coords.x, y: coords.y, active: true };
          targetCatcherX = coords.normX;
          currentCatcherX = coords.normX;
          targetCatcherY = coords.normY;
          currentCatcherY = coords.normY;
        }
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Existing non-touch desktop/laptop path (UNTOUCHED)
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        setDeviceMode('touch');
      } else if (e.pointerType === 'mouse') {"""
    js = replace_once(js, old_down, new_down, "onPointerDown touch routing")

    # 7. Expose getTouchControls on chromeSynapseGame
    old_api = """    getState: () => state,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },"""
    new_api = """    getState: () => state,
    getTouchControls: () => TouchFireControls,
    setPointerX: (nx) => { targetCatcherX = Math.max(0.04, Math.min(0.96, nx)); },"""
    js = replace_once(js, old_api, new_api, "chromeSynapseGame getTouchControls")

    js = update_version_tags(js)
    with open(path, "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched game.js")


def patch_app_and_sw():
    for fn in ["app.js", "sw.js"]:
        p = os.path.join(ROOT, fn)
        with open(p, "r", encoding="utf-8") as f:
            txt = f.read()
        nxt = update_version_tags(txt)
        assert nxt != txt, f"{fn} had no version tags updated!"
        with open(p, "w", encoding="utf-8") as f:
            f.write(nxt)
        print(f"Patched {fn}")


def main():
    patch_index_html()
    patch_game_js()
    patch_app_and_sw()
    print("SUCCESS: Applied v410 Luxury Virtual Joystick & Enhanced Buttons!")


if __name__ == "__main__":
    main()
