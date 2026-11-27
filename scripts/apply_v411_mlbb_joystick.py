"""Apply v411: Bigger MLBB/HoK Floating-Origin Virtual Joystick + Lift Controls + iOS 100dvh Viewport Fix."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def replace_once(text, old, new, label):
    count = text.count(old)
    assert count == 1, f"[{label}] Expected 1 match, found {count}"
    return text.replace(old, new, 1)


def update_tags(text):
    return (
        text.replace("arcade410_luxury_joystick", "arcade411_mlbb_joystick")
            .replace("v410_luxury_joystick", "v411_mlbb_joystick")
    )


def patch_index_html():
    path = os.path.join(ROOT, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Enforce exact 100dvh box-sizing lock on #chromeGameModal so iOS Dynamic Island padding never shoves controls off-screen
    old_body_lock = """    /* === CHANGED (v387): Complete iOS Safari touch/scroll/zoom/callout hardening during active play === */
    body.arcade-active,
    body.arcade-active #chromeGameModal {
      overscroll-behavior: none !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }"""

    new_body_lock = """    /* === CHANGED (v411): Complete iOS Safari 100dvh Viewport Lock + Touch Hardening (Zero Bottom Clipping!) === */
    body.arcade-active,
    body.arcade-active #chromeGameModal {
      overscroll-behavior: none !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    #chromeGameModal.game-modal-overlay {
      height: 100vh !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    #chromeGameModal .game-container-card {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      box-sizing: border-box !important;
    }
    #chromeGameModal .game-arena-stage {
      flex: 1 1 0% !important;
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
    }"""
    html = replace_once(html, old_body_lock, new_body_lock, "index.html dvh viewport lock")

    # 2. Update Virtual Joystick, Mode Pill, Combat Cluster & Desktop HUD CSS
    old_block_start = "    /* === CHANGED (v410): LUXURY COLLECTOR CRYSTAL VIRTUAL JOYSTICK, MODE PILL & ENHANCED COMBAT BUTTONS === */"
    old_block_end = "    /* Translucent Filigree SVG Dial & Custom Artwork Inside Pads */"
    b0 = html.index(old_block_start)
    b1 = html.index(old_block_end, b0)

    new_joy_css = """    /* === CHANGED (v411): BIGGER MLBB / HONOR OF KINGS FLOATING JOYSTICK & RAISED THUMB-ZONE HUD === */
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
      left: max(24px, env(safe-area-inset-left, 24px)) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 216px) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 2px !important;
      padding: 3px !important;
      border-radius: 999px !important;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.90) 0%, rgba(5, 8, 20, 0.95) 100%) !important;
      border: 1.4px solid rgba(253, 224, 71, 0.48) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55), 0 0 14px rgba(56, 189, 248, 0.20), inset 0 1px 1px rgba(255, 255, 255, 0.18) !important;
      pointer-events: auto !important;
      touch-action: none !important;
      z-index: 47 !important;
      transition: bottom 0.22s cubic-bezier(0.22, 1, 0.36, 1), left 0.22s ease, right 0.22s ease !important;
    }
    #ocTouchControlCluster[data-move-mode="onpoint"] #ocTouchModePill {
      bottom: calc(env(safe-area-inset-bottom, 0px) + 42px) !important;
    }
    #ocTouchControlCluster.left-handed #ocTouchModePill {
      left: auto !important;
      right: max(24px, env(safe-area-inset-right, 24px)) !important;
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

    /* --- 2. GENEROUS MLBB / HoK THUMB CATCH ZONE + BIG FLOATING ANALOG JOYSTICK --- */
    #ocVirtualJoystickZone {
      position: absolute !important;
      left: max(6px, env(safe-area-inset-left, 6px)) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 14px) !important;
      width: 216px !important;
      height: 204px !important;
      pointer-events: auto !important;
      touch-action: none !important;
      z-index: 44 !important;
      background: transparent !important;
    }
    #ocTouchControlCluster[data-move-mode="onpoint"] #ocVirtualJoystickZone,
    #ocTouchControlCluster[data-move-mode="onpoint"] #ocVirtualJoystickWrap {
      display: none !important;
    }
    #ocTouchControlCluster.left-handed #ocVirtualJoystickZone {
      left: auto !important;
      right: max(6px, env(safe-area-inset-right, 6px)) !important;
    }
    #ocVirtualJoystickWrap {
      position: absolute !important;
      left: max(24px, env(safe-area-inset-left, 24px)) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 38px) !important;
      width: 168px !important;
      height: 168px !important;
      pointer-events: none !important;
      touch-action: none !important;
      z-index: 45 !important;
    }
    #ocTouchControlCluster.left-handed #ocVirtualJoystickWrap {
      left: auto !important;
      right: max(24px, env(safe-area-inset-right, 24px)) !important;
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
      transform: translate3d(var(--joy-base-x, 0px), var(--joy-base-y, 0px), 0) !important;
      background: radial-gradient(circle at 50% 42%, rgba(56, 189, 248, 0.16) 0%, rgba(12, 18, 42, 0.26) 64%, rgba(6, 10, 26, 0.38) 100%) !important;
      border: 1.8px solid rgba(253, 224, 71, 0.54) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.48), 0 0 24px rgba(56, 189, 248, 0.22), inset 0 2px 14px rgba(254, 240, 138, 0.20), inset 0 -8px 18px rgba(0, 0, 0, 0.42) !important;
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.14s ease, box-shadow 0.14s ease !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoystick {
      background: radial-gradient(circle at 50% 42%, rgba(192, 132, 252, 0.18) 0%, rgba(12, 20, 44, 0.26) 64%, rgba(6, 10, 26, 0.38) 100%) !important;
      border-color: rgba(165, 243, 252, 0.60) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.48), 0 0 24px rgba(34, 211, 238, 0.24), inset 0 2px 14px rgba(224, 242, 254, 0.24), inset 0 -8px 18px rgba(0, 0, 0, 0.40) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocVirtualJoystick {
      background: radial-gradient(circle at 50% 42%, rgba(251, 146, 60, 0.18) 0%, rgba(42, 14, 14, 0.26) 64%, rgba(14, 6, 10, 0.40) 100%) !important;
      border-color: rgba(253, 224, 71, 0.58) !important;
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.50), 0 0 24px rgba(249, 115, 22, 0.26), inset 0 2px 14px rgba(254, 240, 138, 0.22), inset 0 -8px 18px rgba(0, 0, 0, 0.44) !important;
    }
    #ocVirtualJoystick.is-active {
      transition: border-color 0.12s ease, box-shadow 0.12s ease !important;
      border-color: rgba(254, 240, 138, 0.90) !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.56), 0 0 34px rgba(250, 204, 21, 0.38), 0 0 20px rgba(56, 189, 248, 0.34), inset 0 2px 16px rgba(255, 255, 255, 0.26) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoystick.is-active {
      border-color: #a5f3fc !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.56), 0 0 34px rgba(34, 211, 238, 0.44), 0 0 20px rgba(232, 121, 249, 0.34), inset 0 2px 16px rgba(255, 255, 255, 0.30) !important;
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
      opacity: calc(var(--joy-mag, 0) * 0.96) !important;
      transform: rotate(var(--joy-angle, 0deg)) !important;
      background: conic-gradient(from 42deg, rgba(254, 240, 138, 0.94) 0deg, rgba(56, 189, 248, 0.68) 48deg, rgba(254, 240, 138, 0.88) 96deg, transparent 122deg, transparent 360deg) !important;
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)) !important;
      mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)) !important;
      filter: drop-shadow(0 0 8px rgba(253, 224, 71, 0.74)) !important;
    }
    #ocVirtualJoyKnob {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 72px !important;
      height: 72px !important;
      margin: -36px 0 0 -36px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: none !important;
      z-index: 4 !important;
      overflow: hidden !important;
      transform: translate3d(var(--joy-x, 0px), var(--joy-y, 0px), 0) !important;
      transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.14s ease !important;
      background: radial-gradient(circle at 35% 28%, rgba(254, 240, 138, 0.40) 0%, rgba(30, 58, 138, 0.70) 54%, rgba(6, 10, 24, 0.94) 100%) !important;
      border: 2px solid rgba(253, 224, 71, 0.88) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.66), 0 0 18px rgba(253, 224, 71, 0.44), inset 0 2px 6px rgba(255, 255, 255, 0.44) !important;
    }
    #ocTouchControlCluster[data-realm="helix"] #ocVirtualJoyKnob {
      background: radial-gradient(circle at 35% 28%, rgba(224, 242, 254, 0.46) 0%, rgba(126, 34, 206, 0.64) 56%, rgba(8, 12, 30, 0.94) 100%) !important;
      border-color: rgba(165, 243, 252, 0.92) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.66), 0 0 20px rgba(34, 211, 238, 0.48), inset 0 2px 6px rgba(255, 255, 255, 0.46) !important;
    }
    #ocTouchControlCluster[data-realm="meteor"] #ocVirtualJoyKnob {
      background: radial-gradient(circle at 35% 28%, rgba(254, 240, 138, 0.44) 0%, rgba(154, 52, 18, 0.74) 56%, rgba(20, 6, 8, 0.95) 100%) !important;
      border-color: rgba(253, 224, 71, 0.92) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.68), 0 0 20px rgba(249, 115, 22, 0.54), inset 0 2px 6px rgba(255, 255, 255, 0.44) !important;
    }
    #ocVirtualJoystick.is-active #ocVirtualJoyKnob {
      transition: box-shadow 0.12s ease !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.72), 0 0 28px rgba(253, 224, 71, 0.78), inset 0 2px 8px rgba(255, 255, 255, 0.54) !important;
    }
    .oc-joy-knob-img {
      width: 48px !important;
      height: 48px !important;
      object-fit: contain !important;
      pointer-events: none !important;
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.46)) contrast(1.06) !important;
    }

    /* --- 3. RIGHT-HAND COLLECTOR COMBAT ARC (LIFTED INTO NATURAL THUMB COMFORT ZONE) --- */
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
      right: max(20px, env(safe-area-inset-right, 20px)) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 38px) !important;
    }
    .oc-pad-wrap-skill2 {
      right: calc(max(20px, env(safe-area-inset-right, 20px)) + 102px) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 124px) !important;
    }
    .oc-pad-wrap-ult {
      right: calc(max(20px, env(safe-area-inset-right, 20px)) + 18px) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 196px) !important;
    }
    .oc-pad-wrap-pulse {
      right: calc(max(20px, env(safe-area-inset-right, 20px)) + 136px) !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 36px) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-gun {
      right: auto !important;
      left: max(20px, env(safe-area-inset-left, 20px)) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-skill2 {
      right: auto !important;
      left: calc(max(20px, env(safe-area-inset-left, 20px)) + 102px) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-ult {
      right: auto !important;
      left: calc(max(20px, env(safe-area-inset-left, 20px)) + 18px) !important;
    }
    #ocTouchControlCluster.left-handed .oc-pad-wrap-pulse {
      right: auto !important;
      left: calc(max(20px, env(safe-area-inset-left, 20px)) + 136px) !important;
    }

    /* Ornate Winged-Diamond Collector Frame Behind Primary Fire Button */
    .oc-gun-crown-frame {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 130px !important;
      height: 130px !important;
      margin: -65px 0 0 -65px !important;
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

    /* 1. PRIMARY WEAPON PAD (106px Collector Trigger) */
    #ocTouchGunBtn {
      width: 106px !important;
      height: 106px !important;
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

    /* 2. SKILL 2 PAD (74px Jewel Volley Pad) */
    #ocTouchSkill2Btn {
      width: 74px !important;
      height: 74px !important;
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

    /* 3. ULTIMATE PAD (84px Imperial Crown Pad) */
    #ocTouchUltBtn {
      width: 84px !important;
      height: 84px !important;
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

    /* 4. FLUX PULSE BATTLE-SPELL PAD (58px Collector Spell Orb) */
    #ocTouchPulseBtn {
      width: 58px !important;
      height: 58px !important;
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
      opacity: 0.80 !important;
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

    """

    html = html[:b0] + new_joy_css + html[b1:]

    # 3. Replace Responsive Media Queries Block (portrait <= 520px, short landscape <= 450px, desktop HUD bottom)
    old_resp_start = "    /* Compact Phone Responsive Safeguard (iPhone SE 667x375 & 390x844 portrait) */"
    old_resp_end = "    @keyframes ocReadyPulse {"
    r0 = html.index(old_resp_start)
    r1 = html.index(old_resp_end, r0)

    new_resp = """    /* Compact Topbar Icon Sizing on Narrow Phones */
    @media (max-width: 460px) {
      .game-modal-overlay .game-controls-actions {
        gap: 2px !important;
      }
      body .game-modal-overlay .game-controls-actions .game-btn-icon,
      body .game-modal-overlay .game-controls-actions .game-btn-close {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        padding: 0 !important;
        border-radius: 6px !important;
      }
      body .game-modal-overlay .game-controls-actions .game-btn-icon svg,
      body .game-modal-overlay .game-controls-actions .game-btn-close svg {
        width: 12px !important;
        height: 12px !important;
      }
    }

    /* Portrait Phone Comfort Layout (iPhone 375x667 to 430x932): Bigger 156px Joystick + Raised Thumb Cluster */
    @media (max-width: 520px) and (min-height: 500px) {
      #ocVirtualJoystickZone {
        left: max(4px, env(safe-area-inset-left, 4px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 20px) !important;
        width: 184px !important;
        height: 204px !important;
      }
      #ocVirtualJoystickWrap {
        width: 156px !important;
        height: 156px !important;
        left: max(16px, env(safe-area-inset-left, 16px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 48px) !important;
      }
      #ocVirtualJoyKnob {
        width: 66px !important;
        height: 66px !important;
        margin: -33px 0 0 -33px !important;
      }
      .oc-joy-knob-img {
        width: 44px !important;
        height: 44px !important;
      }
      #ocTouchModePill {
        left: max(16px, env(safe-area-inset-left, 16px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 216px) !important;
      }
      #ocTouchControlCluster[data-move-mode="onpoint"] #ocTouchModePill {
        bottom: calc(env(safe-area-inset-bottom, 0px) + 46px) !important;
      }
      #ocTouchControlCluster.left-handed #ocVirtualJoystickZone {
        left: auto !important;
        right: max(4px, env(safe-area-inset-right, 4px)) !important;
      }
      #ocTouchControlCluster.left-handed #ocVirtualJoystickWrap,
      #ocTouchControlCluster.left-handed #ocTouchModePill {
        left: auto !important;
        right: max(16px, env(safe-area-inset-right, 16px)) !important;
      }
      .oc-gun-crown-frame {
        width: 114px !important;
        height: 114px !important;
        margin: -57px 0 0 -57px !important;
      }
      #ocTouchGunBtn {
        width: 94px !important;
        height: 94px !important;
      }
      #ocTouchSkill2Btn {
        width: 66px !important;
        height: 66px !important;
      }
      #ocTouchUltBtn {
        width: 74px !important;
        height: 74px !important;
      }
      #ocTouchPulseBtn {
        width: 52px !important;
        height: 52px !important;
      }
      .oc-pad-wrap-gun {
        right: max(14px, env(safe-area-inset-right, 14px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 46px) !important;
      }
      .oc-pad-wrap-pulse {
        right: calc(max(14px, env(safe-area-inset-right, 14px)) + 114px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 44px) !important;
      }
      .oc-pad-wrap-skill2 {
        right: calc(max(14px, env(safe-area-inset-right, 14px)) + 106px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 136px) !important;
      }
      .oc-pad-wrap-ult {
        right: calc(max(14px, env(safe-area-inset-right, 14px)) + 14px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 194px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-gun {
        left: max(14px, env(safe-area-inset-left, 14px)) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-pulse {
        left: calc(max(14px, env(safe-area-inset-left, 14px)) + 114px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-skill2 {
        left: calc(max(14px, env(safe-area-inset-left, 14px)) + 106px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-ult {
        left: calc(max(14px, env(safe-area-inset-left, 14px)) + 14px) !important;
      }
    }

    /* Landscape Phone Ergonomic Layout (iPhone SE / 14 Pro Max Landscape <= 450px tall) */
    @media (max-width: 940px) and (max-height: 450px) {
      #ocVirtualJoystickZone {
        left: max(8px, env(safe-area-inset-left, 8px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 10px) !important;
        width: 196px !important;
        height: 184px !important;
      }
      #ocVirtualJoystickWrap {
        width: 146px !important;
        height: 146px !important;
        left: max(22px, env(safe-area-inset-left, 22px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 28px) !important;
      }
      #ocVirtualJoyKnob {
        width: 62px !important;
        height: 62px !important;
        margin: -31px 0 0 -31px !important;
      }
      .oc-joy-knob-img {
        width: 42px !important;
        height: 42px !important;
      }
      #ocTouchModePill {
        left: max(22px, env(safe-area-inset-left, 22px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 184px) !important;
      }
      #ocTouchControlCluster[data-move-mode="onpoint"] #ocTouchModePill {
        bottom: calc(env(safe-area-inset-bottom, 0px) + 28px) !important;
      }
      #ocTouchControlCluster.left-handed #ocVirtualJoystickZone {
        left: auto !important;
        right: max(8px, env(safe-area-inset-right, 8px)) !important;
      }
      #ocTouchControlCluster.left-handed #ocVirtualJoystickWrap,
      #ocTouchControlCluster.left-handed #ocTouchModePill {
        left: auto !important;
        right: max(22px, env(safe-area-inset-right, 22px)) !important;
      }
      .oc-gun-crown-frame {
        width: 112px !important;
        height: 112px !important;
        margin: -56px 0 0 -56px !important;
      }
      #ocTouchGunBtn {
        width: 92px !important;
        height: 92px !important;
      }
      #ocTouchSkill2Btn {
        width: 64px !important;
        height: 64px !important;
      }
      #ocTouchUltBtn {
        width: 72px !important;
        height: 72px !important;
      }
      #ocTouchPulseBtn {
        width: 52px !important;
        height: 52px !important;
      }
      .oc-pad-wrap-gun {
        right: max(18px, env(safe-area-inset-right, 18px)) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 28px) !important;
      }
      .oc-pad-wrap-pulse {
        right: calc(max(18px, env(safe-area-inset-right, 18px)) + 120px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 26px) !important;
      }
      .oc-pad-wrap-skill2 {
        right: calc(max(18px, env(safe-area-inset-right, 18px)) + 92px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 106px) !important;
      }
      .oc-pad-wrap-ult {
        right: calc(max(18px, env(safe-area-inset-right, 18px)) + 16px) !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 168px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-gun {
        left: max(18px, env(safe-area-inset-left, 18px)) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-pulse {
        left: calc(max(18px, env(safe-area-inset-left, 18px)) + 120px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-skill2 {
        left: calc(max(18px, env(safe-area-inset-left, 18px)) + 92px) !important;
      }
      #ocTouchControlCluster.left-handed .oc-pad-wrap-ult {
        left: calc(max(18px, env(safe-area-inset-left, 18px)) + 16px) !important;
      }
    }

    """
    html = html[:r0] + new_resp + html[r1:]

    # 4. Lift Desktop #ocDesktopSkillHud slightly from 16px to 26px
    html = replace_once(
        html,
        "    #ocDesktopSkillHud {\n      position: absolute !important;\n      right: 18px !important;\n      bottom: 16px !important;",
        "    #ocDesktopSkillHud {\n      position: absolute !important;\n      right: 18px !important;\n      bottom: 26px !important;",
        "index.html desktop hud bottom"
    )

    html = update_tags(html)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Patched index.html (v411)")


def patch_game_js():
    path = os.path.join(ROOT, "game.js")
    with open(path, "r", encoding="utf-8") as f:
        js = f.read()

    # 1. Update CONFIG.ui joystick parameters for MLBB/HoK effortless feel
    old_ui = """    ui: {
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
    new_ui = """    ui: {
      gunBtnSize: 106,
      skill2BtnSize: 74,
      ultBtnSize: 84,
      pulseBtnSize: 58,
      btnOpacity: 0.92,
      pressedScale: 0.92,
      leftHandedKey: 'oc_left_handed_controls',
      moveModeKey: 'oc_touch_move_mode',
      joyMaxRadius: 44,
      joyFloatingTether: 34,
      joyDeadZone: 4,
      joyMaxSpeedPx: 940
    },"""
    js = replace_once(js, old_ui, new_ui, "CONFIG.ui")

    # 2. Update joyState fields to support Floating Thumb Origin (originX, originY, baseX, baseY)
    old_fields = """    joyState: { active: false, pointerId: null, dx: 0, dy: 0, ux: 0, uy: 0, mag: 0, angleDeg: 0, centerX: 0, centerY: 0 },
    clusterEl: null,
    joyWrapEl: null,
    joyEl: null,"""
    new_fields = """    joyState: { active: false, pointerId: null, dx: 0, dy: 0, ux: 0, uy: 0, mag: 0, angleDeg: 0, homeX: 0, homeY: 0, originX: 0, originY: 0, baseX: 0, baseY: 0 },
    clusterEl: null,
    joyZoneEl: null,
    joyWrapEl: null,
    joyEl: null,"""
    js = replace_once(js, old_fields, new_fields, "joyState fields")

    # 3. Replace _resetJoystickVisual, _updateJoystickVector, and _bindJoystickEvents with MLBB/HoK Floating-Origin mechanics
    old_joy_methods = """    _resetJoystickVisual() {
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
    },"""

    new_joy_methods = """    _resetJoystickVisual() {
      this.joyState.active = false;
      this.joyState.pointerId = null;
      this.joyState.dx = 0;
      this.joyState.dy = 0;
      this.joyState.ux = 0;
      this.joyState.uy = 0;
      this.joyState.mag = 0;
      this.joyState.baseX = 0;
      this.joyState.baseY = 0;
      if (this.joyEl) {
        this.joyEl.classList.remove('is-active');
        this.joyEl.style.setProperty('--joy-base-x', '0px');
        this.joyEl.style.setProperty('--joy-base-y', '0px');
        this.joyEl.style.setProperty('--joy-x', '0px');
        this.joyEl.style.setProperty('--joy-y', '0px');
        this.joyEl.style.setProperty('--joy-mag', '0');
      }
    },

    _beginJoystickAt(clientX, clientY) {
      if (!this.joyWrapEl || !this.joyEl) return;
      const wRect = this.joyWrapEl.getBoundingClientRect();
      const homeX = wRect.left + wRect.width * 0.5;
      const homeY = wRect.top + wRect.height * 0.5;
      const tether = CONFIG.ui.joyFloatingTether || 34;
      const ox = clientX - homeX;
      const oy = clientY - homeY;
      const od = Math.hypot(ox, oy);
      let bx = ox;
      let by = oy;
      if (od > tether && od > 0.001) {
        bx = (ox / od) * tether;
        by = (oy / od) * tether;
      }
      this.joyState.homeX = homeX;
      this.joyState.homeY = homeY;
      this.joyState.baseX = bx;
      this.joyState.baseY = by;
      this.joyState.originX = homeX + bx;
      this.joyState.originY = homeY + by;
      this.joyEl.style.setProperty('--joy-base-x', `${bx.toFixed(1)}px`);
      this.joyEl.style.setProperty('--joy-base-y', `${by.toFixed(1)}px`);
      this._updateJoystickVector(clientX, clientY);
    },

    _updateJoystickVector(clientX, clientY) {
      if (!this.joyEl) return;
      const ox = this.joyState.originX || this.joyState.homeX;
      const oy = this.joyState.originY || this.joyState.homeY;

      const maxR = CONFIG.ui.joyMaxRadius || 44;
      const dead = CONFIG.ui.joyDeadZone || 4;
      const rawDx = clientX - ox;
      const rawDy = clientY - oy;
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

      const angleDeg = (angleRad * 180 / Math.PI);
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

    _bindJoystickEvents(targetEl) {
      if (!targetEl) return;
      ['touchstart', 'touchmove', 'touchend'].forEach((evt) => {
        targetEl.addEventListener(evt, (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      });
      targetEl.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });

      targetEl.addEventListener('pointerdown', (e) => {
        if (!this.isTouch || !state.active || this.moveMode !== 'joystick') return;
        e.preventDefault();
        e.stopPropagation();
        RealmMusicEngine.unlockOnGesture();

        if (this.joyState.active && this.joyState.pointerId !== null && this.joyState.pointerId !== e.pointerId) {
          this.releasePointer(this.joyState.pointerId);
        }
        this.activePointers.set(e.pointerId, { role: 'JOYSTICK', el: targetEl });
        try { targetEl.setPointerCapture(e.pointerId); } catch (_) {}
        if (this.joyEl) this.joyEl.classList.add('is-active');
        this.joyState.active = true;
        this.joyState.pointerId = e.pointerId;
        this._beginJoystickAt(e.clientX, e.clientY);
      }, { passive: false });

      targetEl.addEventListener('pointermove', (e) => {
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
      targetEl.addEventListener('pointerup', onRelease, { passive: true });
      targetEl.addEventListener('pointercancel', onRelease, { passive: true });
      targetEl.addEventListener('lostpointercapture', onRelease, { passive: true });
    },"""
    js = replace_once(js, old_joy_methods, new_joy_methods, "MLBB floating joystick methods")

    # 4. Inject #ocVirtualJoystickZone in ensureTouchCluster and bind both zone & dial
    old_cluster_html = """        '<div id="ocVirtualJoystickWrap">' +"""
    new_cluster_html = """        '<div id="ocVirtualJoystickZone" aria-hidden="true"></div>' +
        '<div id="ocVirtualJoystickWrap">' +"""
    js = replace_once(js, old_cluster_html, new_cluster_html, "ensureTouchCluster joyZone html")

    old_joy_bind = """      this.joyWrapEl = cluster.querySelector('#ocVirtualJoystickWrap');
      this.joyEl = cluster.querySelector('#ocVirtualJoystick');"""
    new_joy_bind = """      this.joyZoneEl = cluster.querySelector('#ocVirtualJoystickZone');
      this.joyWrapEl = cluster.querySelector('#ocVirtualJoystickWrap');
      this.joyEl = cluster.querySelector('#ocVirtualJoystick');"""
    js = replace_once(js, old_joy_bind, new_joy_bind, "ensureTouchCluster joyZone query")

    old_bind_call = """      if (this.joyEl) this._bindJoystickEvents(this.joyEl);"""
    new_bind_call = """      if (this.joyZoneEl) this._bindJoystickEvents(this.joyZoneEl);
      if (this.joyEl) this._bindJoystickEvents(this.joyEl);"""
    js = replace_once(js, old_bind_call, new_bind_call, "bind both joyZone and joyEl")

    old_destroy_joy = """      this.joyWrapEl = null;
      this.joyEl = null;"""
    new_destroy_joy = """      this.joyZoneEl = null;
      this.joyWrapEl = null;
      this.joyEl = null;"""
    js = replace_once(js, old_destroy_joy, new_destroy_joy, "destroyTouchCluster joyZone")

    # 5. Update touch initial vertical spawn from 0.82 -> 0.68 so hero sits clearly above lifted thumb HUD
    old_reset_pos = """    targetCatcherX = 0.5;
    currentCatcherX = 0.5;
    targetCatcherY = 0.82;
    currentCatcherY = 0.82;"""
    new_reset_pos = """    targetCatcherX = 0.5;
    currentCatcherX = 0.5;
    targetCatcherY = (TouchFireControls.isTouch || deviceInputMode === 'touch') ? 0.68 : 0.82;
    currentCatcherY = targetCatcherY;"""
    js = replace_once(js, old_reset_pos, new_reset_pos, "touch spawn height")

    # 6. Update speed curve in reflexGameLoop to snappy Math.pow(j.mag, 0.78)
    old_spd = """      const speedCurve = j.mag * (0.32 + 0.68 * j.mag);
      const maxSpd = isEmpSlowed ? 430 : (CONFIG.ui.joyMaxSpeedPx || 820);"""
    new_spd = """      const speedCurve = Math.pow(j.mag, 0.78);
      const maxSpd = isEmpSlowed ? 480 : (CONFIG.ui.joyMaxSpeedPx || 940);"""
    js = replace_once(js, old_spd, new_spd, "MLBB speedCurve")

    # 7. Wire window.visualViewport resize to resizeCanvas()
    old_ro = """    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);"""
    new_ro = """    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    if (window.visualViewport && window.visualViewport.addEventListener) {
      window.visualViewport.addEventListener('resize', resizeCanvas);
    }"""
    js = replace_once(js, old_ro, new_ro, "visualViewport resize")

    js = update_tags(js)
    with open(path, "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched game.js (v411)")


def patch_app_and_sw():
    for fn in ["app.js", "sw.js"]:
        p = os.path.join(ROOT, fn)
        with open(p, "r", encoding="utf-8") as f:
            txt = f.read()
        nxt = update_tags(txt)
        assert nxt != txt, f"{fn} had no version tags updated!"
        with open(p, "w", encoding="utf-8") as f:
            f.write(nxt)
        print(f"Patched {fn} (v411)")


def main():
    patch_index_html()
    patch_game_js()
    patch_app_and_sw()
    print("SUCCESS: Applied v411 MLBB/HoK Floating Joystick & Raised Thumb-Zone HUD!")


if __name__ == "__main__":
    main()
