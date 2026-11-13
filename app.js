/* OrlandoChrome · Chrome Taskbar Notes & Command Center
 * OLED Pure Black (#000000) Theme · Small Green & White / Red & White Radiant Gradient Pins & Reset States
 * 7 High-Impact Enhancements + Wispr Flow Pro Dictation + App Distribution & Command Suite (PWA & Blank Edition)
 */
(function() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const now = () => Date.now();
  const playSoundClick = () => {
    try {
      if (window.soundMgr) {
        if (typeof window.soundMgr.playClickSoft === "function") window.soundMgr.playClickSoft();
        else if (typeof window.soundMgr.playClick === "function") window.soundMgr.playClick();
      }
    } catch (e) {}
  };

  // Check if running in Clean Blank Edition mode (?edition=blank) for any external laptop
  const URL_PARAMS = new URLSearchParams(window.location.search);
  const IS_BLANK_EDITION = URL_PARAMS.get('edition') === 'blank';

  const STORAGE_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_edition_profiles_v1'
    : 'chrome_taskbar_messenger_notes_v5';
  const OLD_STORAGE_KEYS = IS_BLANK_EDITION
    ? []
    : ['chrome_taskbar_messenger_notes_v4', 'chrome_taskbar_netflix_v1', 'chrome_taskbar_messenger_notes_v3'];
  const WISPR_PREFS_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_wispr_v1'
    : 'orlandochrome_wispr_flow_pro_v1';
  const TEMPLATES_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_templates_v2'
    : 'orlandochrome_quick_templates_v2';
  const LAST_MOD_KEY = IS_BLANK_EDITION
    ? 'orlandochrome_blank_last_mod_v1'
    : 'orlandochrome_personal_last_mod_v1';

  // Unique Client Tab ID & Real-Time Cross-Device Cloud Sync Topic (Windows · iOS · Android)
  const CLIENT_ID = uid();
  const CLOUD_SYNC_TOPIC = IS_BLANK_EDITION
    ? (URL_PARAMS.get('room') || localStorage.getItem('orlandochrome_blank_room_v1') || 'orlandochrome_blank_sync_v1')
    : 'orlandochrome_live_sync_pasion1994_v2';

  const LIVE_APP_URL = 'https://orlandopasion000.github.io/orlandochrome/';
  const BLANK_APP_URL = 'https://orlandopasion000.github.io/orlandochrome/?edition=blank';

  // ============================================================================
  // FUTURISTIC CYBER SVG ICON SYSTEM (Next-Gen UI Glyphs)
  // ============================================================================
const Icons = {
    urgent: (size = 14) => `
      <span class="oc-icon oc-icon-urgent" style="width:${size}px;height:${size}px;" title="Urgent (Fire)">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gFireCyber" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ff1a53"/>
              <stop offset="45%" stop-color="#ff6b00"/>
              <stop offset="100%" stop-color="#ffcc00"/>
            </linearGradient>
            <filter id="fFireCyber" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#ff3300" flood-opacity="0.85"/>
            </filter>
          </defs>
          <path d="M12 2c.8 2.8 2.4 4.4 4.2 5.8 2.2 1.8 3.6 4.2 3.6 7.4 0 4.3-3.5 7.8-7.8 7.8S4.2 19.5 4.2 15.2c0-3.2 1.4-5.6 3.6-7.4 1.2-1 2.2-2.2 2.2-3.8 1 1.4 1.8 2.6 1.8 3.8 0-2.4 1.2-4.2 2.2-5.8z" fill="url(#gFireCyber)" filter="url(#fFireCyber)"/>
          <path d="M12 11c1.2 1.4 2 2.6 2 4.2 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-1.8 1-3 2-4 .5 1.2 1.2 2 2 2 .4-1.2 1.2-1.8 2-2.2z" fill="#ffffff" opacity="0.95"/>
        </svg>
      </span>`,

    waiting: (size = 14) => `
      <span class="oc-icon oc-icon-waiting" style="width:${size}px;height:${size}px;" title="Waiting (White Light Clock)">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <filter id="fClockWhite" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#ffffff" flood-opacity="0.9"/>
            </filter>
          </defs>
          <circle cx="12" cy="12" r="9" stroke="#ffffff" stroke-width="1.8" filter="url(#fClockWhite)"/>
          <circle cx="12" cy="12" r="4.5" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1" stroke-dasharray="2 2"/>
          <path d="M12 7.2v4.8l3.2 2" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="1.5" fill="#ffffff"/>
          <line x1="12" y1="1.5" x2="12" y2="3.2" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="12" y1="20.8" x2="12" y2="22.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="1.5" y1="12" x2="3.2" y2="12" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="20.8" y1="12" x2="22.5" y2="12" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>`,

    important: (size = 14) => `
      <span class="oc-icon oc-icon-important" style="width:${size}px;height:${size}px;" title="Important (Neon Green Star)">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gStarNeon" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#a7f3d0"/>
              <stop offset="50%" stop-color="#10b981"/>
              <stop offset="100%" stop-color="#059669"/>
            </linearGradient>
            <filter id="fStarNeon" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#10b981" flood-opacity="0.95"/>
            </filter>
          </defs>
          <polygon points="12 1.5 15.2 8.2 22.5 9.2 17.2 14.3 18.5 21.5 12 18.1 5.5 21.5 6.8 14.3 1.5 9.2 8.8 8.2" fill="rgba(16,185,129,0.22)" stroke="url(#gStarNeon)" stroke-width="1.8" stroke-linejoin="round" filter="url(#fStarNeon)"/>
          <circle cx="12" cy="12" r="2.2" fill="#ffffff"/>
        </svg>
      </span>`,

    verified: (size = 15) => `
      <span class="oc-icon oc-icon-verified" style="width:${size}px;height:${size}px;" title="Verified / Done">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gHexCyber" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00ffa3"/>
              <stop offset="50%" stop-color="#00d4ff"/>
              <stop offset="100%" stop-color="#00ffa3"/>
            </linearGradient>
            <filter id="fHexCyber" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#00ffa3" flood-opacity="0.8"/>
            </filter>
          </defs>
          <polygon points="12 1.5 21 6.5 21 17.5 12 22.5 3 17.5 3 6.5" fill="rgba(0,255,163,0.14)" stroke="url(#gHexCyber)" stroke-width="1.8" stroke-linejoin="round" filter="url(#fHexCyber)"/>
          <path d="M7.5 12l3 3.2L16.5 8.5" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>`,

    check: (size = 13) => `
      <span class="oc-icon oc-icon-check" style="width:${size}px;height:${size}px;" title="Done">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gCheckCyber" x1="4" y1="12" x2="20" y2="12">
              <stop offset="0%" stop-color="#00ffa3"/>
              <stop offset="100%" stop-color="#00d4ff"/>
            </linearGradient>
          </defs>
          <path d="M4 12.5l5.5 5.5L20 6" stroke="url(#gCheckCyber)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="20" cy="6" r="1.5" fill="#00d4ff"/>
        </svg>
      </span>`,

    copy: (size = 13) => `
      <span class="oc-icon oc-icon-copy" style="width:${size}px;height:${size}px;" title="Copy to Clipboard">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gCopyCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="100%" stop-color="#4facfe"/>
            </linearGradient>
          </defs>
          <polygon points="7 6 17 6 20 9 20 20 7 20" stroke="url(#gCopyCyber)" stroke-width="1.8" fill="rgba(0,242,254,0.1)" stroke-linejoin="round"/>
          <polygon points="4 9 4 4 14 4" stroke="#64748b" stroke-width="1.6" fill="none" stroke-linejoin="round"/>
          <line x1="10" y1="12" x2="16" y2="12" stroke="#00f2fe" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="10" y1="15" x2="14" y2="15" stroke="#00f2fe" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>`,

    checklist: (size = 13) => `
      <span class="oc-icon oc-icon-checklist" style="width:${size}px;height:${size}px;" title="Add Sub-item">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gChecklistCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#ec4899"/>
            </linearGradient>
          </defs>
          <polygon points="3 4 8 4 10 6 10 11 3 11" stroke="url(#gChecklistCyber)" stroke-width="1.6" fill="rgba(168,85,247,0.18)" stroke-linejoin="round"/>
          <polyline points="4.5 7.5 6 9 8.5 6.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="13" y1="7" x2="21" y2="7" stroke="url(#gChecklistCyber)" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="3.5" cy="16" r="1.5" fill="#ec4899"/>
          <line x1="8" y1="16" x2="21" y2="16" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="3.5" cy="20" r="1.5" fill="#a855f7"/>
          <line x1="8" y1="20" x2="17" y2="20" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>`,

    edit: (size = 13) => `
      <span class="oc-icon oc-icon-edit" style="width:${size}px;height:${size}px;" title="Edit">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gEditCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="100%" stop-color="#0284c7"/>
            </linearGradient>
          </defs>
          <path d="M16 2.5l5.5 5.5-12 12H4v-5.5L16 2.5z" stroke="url(#gEditCyber)" stroke-width="1.8" stroke-linejoin="round" fill="rgba(0,242,254,0.12)"/>
          <line x1="13.5" y1="5" x2="19" y2="10.5" stroke="#00f2fe" stroke-width="1.5"/>
          <circle cx="4" cy="20" r="1.5" fill="#00f2fe"/>
        </svg>
      </span>`,

    delete: (size = 13) => `
      <span class="oc-icon oc-icon-delete" style="width:${size}px;height:${size}px;" title="Delete">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gDelCyber" x1="12" y1="2" x2="12" y2="22">
              <stop offset="0%" stop-color="#ff0055"/>
              <stop offset="100%" stop-color="#ff4400"/>
            </linearGradient>
          </defs>
          <path d="M3 6h18M8 6V3.5h8V6" stroke="url(#gDelCyber)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <polygon points="5 6 6.5 21 17.5 21 19 6" stroke="url(#gDelCyber)" stroke-width="1.8" stroke-linejoin="round" fill="rgba(255,0,85,0.1)"/>
          <line x1="10" y1="10" x2="10" y2="17" stroke="#ff4d58" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="14" y1="10" x2="14" y2="17" stroke="#ff4d58" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>`,

    forward: (size = 13) => `
      <span class="oc-icon oc-icon-forward" style="width:${size}px;height:${size}px;" title="Forward">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gFwdCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
            <filter id="fFwdCyber" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#38bdf8" flood-opacity="0.65"/>
            </filter>
          </defs>
          <path d="M4 12h11M11 6l6 6-6 6M17 7l4 5-4 5" stroke="url(#gFwdCyber)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#fFwdCyber)"/>
        </svg>
      </span>`,

    note: (size = 13) => `
      <span class="oc-icon oc-icon-note" style="width:${size}px;height:${size}px;" title="Neural Note">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gNoteCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="50%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#ff007f"/>
            </linearGradient>
          </defs>
          <polygon points="12 2 20 6.5 20 15.5 12 20 4 15.5 4 6.5" stroke="url(#gNoteCyber)" stroke-width="1.8" stroke-linejoin="round" fill="rgba(168,85,247,0.12)"/>
          <circle cx="12" cy="11" r="2.5" fill="url(#gNoteCyber)"/>
          <line x1="12" y1="2" x2="12" y2="8.5" stroke="#00f2fe" stroke-width="1.5"/>
          <line x1="12" y1="13.5" x2="12" y2="20" stroke="#ff007f" stroke-width="1.5"/>
        </svg>
      </span>`,

    undo: (size = 13) => `
      <span class="oc-icon oc-icon-undo" style="width:${size}px;height:${size}px;" title="Undo">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 9h11a5.5 5.5 0 0 1 5.5 5.5v.5a5.5 5.5 0 0 1-5.5 5.5H8" stroke="#ff4d58" stroke-width="2" stroke-linecap="round"/>
          <polygon points="8 4 3 9 8 14" fill="#ff4d58"/>
        </svg>
      </span>`,

    redo: (size = 13) => `
      <span class="oc-icon oc-icon-redo" style="width:${size}px;height:${size}px;" title="Redo">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 9H9a5.5 5.5 0 0 0-5.5 5.5v.5a5.5 5.5 0 0 0 5.5 5.5h7" stroke="#ff4d58" stroke-width="2" stroke-linecap="round"/>
          <polygon points="16 4 21 9 16 14" fill="#ff4d58"/>
        </svg>
      </span>`,

    trashVault: (size = 14) => `
      <span class="oc-icon oc-icon-vault" style="width:${size}px;height:${size}px;" title="Recently Deleted Vault">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gVaultCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#ff0055"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <rect x="3" y="4" width="18" height="17" rx="3" stroke="url(#gVaultCyber)" stroke-width="1.8" fill="rgba(255,0,85,0.1)"/>
          <circle cx="12" cy="12.5" r="4" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 1.5"/>
          <circle cx="12" cy="12.5" r="1.5" fill="#ffffff"/>
          <line x1="12" y1="4" x2="12" y2="7" stroke="url(#gVaultCyber)" stroke-width="1.8"/>
          <line x1="7" y1="2" x2="17" y2="2" stroke="url(#gVaultCyber)" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>`,

    restore: (size = 13) => `
      <span class="oc-icon oc-icon-restore" style="width:${size}px;height:${size}px;" title="Restore">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5" stroke="#00ffa3" stroke-width="2" stroke-linecap="round"/>
          <polygon points="4 5 4 10 9 10" fill="#00ffa3"/>
          <polygon points="20 19 20 14 15 14" fill="#00ffa3"/>
          <circle cx="12" cy="12" r="2" fill="#00ffa3"/>
        </svg>
      </span>`,

    shake: (size = 32) => `
      <span class="oc-icon oc-icon-shake" style="width:${size}px;height:${size}px;">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="#00f2fe" stroke-width="1.8" fill="rgba(0, 242, 254, 0.12)"/>
          <circle cx="12" cy="17.5" r="1.2" fill="#00f2fe"/>
          <path d="M2.5 8.5c-.8 1.1-.8 2.9 0 4M21.5 8.5c.8 1.1.8 2.9 0 4M1 6c-1 2-1 5 0 7M23 6c1 2 1 5 0 7" stroke="#ff0055" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>`,

    camera: (size = 14) => `
      <span class="oc-icon oc-icon-camera" style="width:${size}px;height:${size}px;" title="Optic Capture">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="4 7 8 7 10 4 14 4 16 7 20 7 21 9 21 19 3 19 3 9" stroke="#00f2fe" stroke-width="1.8" stroke-linejoin="round" fill="rgba(0,242,254,0.12)"/>
          <circle cx="12" cy="13" r="4" stroke="#00f2fe" stroke-width="1.8"/>
          <circle cx="12" cy="13" r="1.8" fill="#ffffff"/>
          <circle cx="17.5" cy="10" r="1" fill="#ff0055"/>
        </svg>
      </span>`,

    mic: (size = 14) => `
      <span class="oc-icon oc-icon-mic" style="width:${size}px;height:${size}px;" title="Voice Core">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="#00f2fe" stroke-width="1.8" fill="rgba(0,242,254,0.15)"/>
          <path d="M5 10a7 7 0 0 0 14 0" stroke="#00f2fe" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="12" y1="17" x2="12" y2="22" stroke="#00f2fe" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="22" x2="16" y2="22" stroke="#00f2fe" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="8" r="1.2" fill="#ffffff"/>
        </svg>
      </span>`,

    stop: (size = 14) => `
      <span class="oc-icon oc-icon-stop" style="width:${size}px;height:${size}px;" title="Halt">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="8 3 16 3 21 8 21 16 16 21 8 21 3 16 3 8" stroke="#ff0055" stroke-width="1.8" stroke-linejoin="round" fill="rgba(255,0,85,0.2)"/>
          <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="#ff0055"/>
        </svg>
      </span>`,

    spark: (size = 14) => `
      <span class="oc-icon oc-icon-spark" style="width:${size}px;height:${size}px;" title="Quantum Core">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gSparkCyber" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="50%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#ff007f"/>
            </linearGradient>
          </defs>
          <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" stroke="url(#gSparkCyber)" stroke-width="1.8" stroke-linejoin="round" fill="rgba(168,85,247,0.2)"/>
          <circle cx="12" cy="12" r="2" fill="#ffffff"/>
        </svg>
      </span>`,

    send: (size = 14) => `
      <span class="oc-icon oc-icon-send" style="width:${size}px;height:${size}px;" title="Execute">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="2 12 22 2 15 22 11 13" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" fill="rgba(255,255,255,0.2)"/>
          <polyline points="22 2 11 13" stroke="#ffffff" stroke-width="2"/>
        </svg>
      </span>`,

    search: (size = 14) => `
      <span class="oc-icon oc-icon-search" style="width:${size}px;height:${size}px;" title="Search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#38bdf8" stroke-width="1.8"/>
          <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="11" cy="11" r="2" fill="rgba(56,189,248,0.5)"/>
          <line x1="11" y1="6" x2="11" y2="8" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="11" y1="14" x2="11" y2="16" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="6" y1="11" x2="8" y2="11" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="14" y1="11" x2="16" y2="11" stroke="#38bdf8" stroke-width="1.5"/>
        </svg>
      </span>`,

    unread: (size = 12) => `
      <span class="oc-icon oc-icon-unread" style="width:${size}px;height:${size}px;" title="Unread Sensor">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#ff0055" stroke-width="1.8" stroke-dasharray="3 2"/>
          <circle cx="12" cy="12" r="5" fill="#ff0055"/>
          <circle cx="12" cy="12" r="2" fill="#ffffff"/>
        </svg>
      </span>`,

    portal: (size = 14) => `
      <span class="oc-icon oc-icon-portal" style="width:${size}px;height:${size}px;" title="Main Web App">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" stroke="rgba(255,100,110,0.9)" stroke-width="1.8" fill="rgba(229,9,20,0.18)" stroke-linejoin="round"/>
          <polyline points="7 12 12 7 17 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="12" y1="7" x2="12" y2="17" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>`,

    matrix: (size = 14) => `
      <span class="oc-icon oc-icon-matrix" style="width:${size}px;height:${size}px;" title="App Suite">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5" stroke="#38bdf8" stroke-width="1.8" fill="rgba(56,189,248,0.15)" stroke-linejoin="round"/>
          <line x1="12" y1="22" x2="12" y2="12" stroke="#38bdf8" stroke-width="1.6"/>
          <line x1="22" y1="7.5" x2="12" y2="12" stroke="#38bdf8" stroke-width="1.6"/>
          <line x1="2" y1="7.5" x2="12" y2="12" stroke="#38bdf8" stroke-width="1.6"/>
          <circle cx="12" cy="12" r="2" fill="#ffffff"/>
        </svg>
      </span>`,

    accelerator: (size = 14) => `
      <span class="oc-icon oc-icon-accelerator" style="width:${size}px;height:${size}px;" title="Next Ready">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(245,158,11,0.2)"/>
          <circle cx="12" cy="12" r="1.5" fill="#ffffff"/>
        </svg>
      </span>`,

    clock: (size = 14) => `
      <span class="oc-icon oc-icon-clock" style="width:${size}px;height:${size}px;" title="HUD Chrono">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#38bdf8" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="3" fill="rgba(56,189,248,0.2)"/>
          <polyline points="12 6 12 12 16 14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="1.5" fill="#38bdf8"/>
        </svg>
      </span>`,

    timer: (size = 12) => `
      <span class="oc-icon oc-icon-timer" style="width:${size}px;height:${size}px;" title="Timer">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="13" r="8" stroke="#38bdf8" stroke-width="1.8" fill="rgba(56,189,248,0.12)"/>
          <line x1="12" y1="2" x2="12" y2="5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
          <line x1="10" y1="2" x2="14" y2="2" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
          <polyline points="12 8 12 13 15 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>`
  };

  // Priority & Color Reactions (Messenger / Discord Style)
  const REACTIONS_LIST = [
    { key: 'urgent',    icon: Icons.urgent(15),    label: 'Urgent',    cls: 'react-urgent' },
    { key: 'waiting',   icon: Icons.waiting(15),   label: 'Waiting',   cls: 'react-waiting' },
    { key: 'important', icon: Icons.important(15), label: 'Important', cls: 'react-important' },
    { key: 'verified',  icon: Icons.verified(15),  label: 'Verified',  cls: 'react-verified' }
  ];
  const REACTIONS_MAP = Object.fromEntries(REACTIONS_LIST.map(r => [r.key, r]));

  // Default 1-Click Quick-Task Templates (Enhancement #1)
  const DEFAULT_TEMPLATES = IS_BLANK_EDITION
    ? [
        'Print',
        'Test',
        'Module',
        'ST',
        'Exam',
        'Video',
        'Check AI Quota'
      ]
    : [
        'Print',
        'Lesson Plan',
        'Check BOW',
        'Test',
        'Module',
        'ST',
        'Exam',
        'Video',
        'Check AI Quota'
      ];

  // Schedule from Daily Recharge Alarm (Sir Orlando V. Pasion, Jr.)
  const RECHARGE_SCHEDULE = [
    [7, 0, "work", "Arrive — read, learn, develop"],
    [8, 0, "rest", "Short recharge — 10 min"],
    [8, 10, "work", "Work and print"],
    [8, 20, "rest", "Recharge before class — 10 min"],
    [8, 30, "class", "Class: Math 8"],
    [9, 30, "rest", "Long recharge — 40 min"],
    [10, 11, "work", "Work and print"],
    [10, 30, "rest", "Recharge before class — 15 min"],
    [10, 45, "class", "Class: Math 10"],
    [11, 45, "err", "Principal’s office — log out/in"],
    [12, 0, "rest", "Lunch and recharge — 45 min"],
    [12, 45, "err", "Personal hygiene"],
    [12, 50, "rest", "Recharge before class — 10 min"],
    [13, 0, "class", "Class: Math 8"],
    [14, 0, "rest", "Longest recharge — 60 min"],
    [15, 0, "work", "Work and print"],
    [15, 10, "rest", "Quick recharge — 5 min"],
    [15, 15, "class", "Class: Gen Math 11"],
    [16, 16, "err", "Organize files"],
    [16, 21, "rest", "Recharge, then go home"],
    [20, 0, "night", "Shutdown — write tomorrow’s top 3"],
    [20, 30, "night", "Wind-down — no screens"],
    [21, 30, "night", "Bedtime"]
  ];

  // The 22 Real Chrome Profiles in exact physical order from Windows Taskband & Local State
  const DEFAULT_PROFILES = [
    { id: "p_tb_3", profileDir: "Default", chromeNo: 1, taskbarSlot: 3, winShortcut: "Win + 3", name: "A0 1994", email: "orlandopasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_4", profileDir: "Profile 16", chromeNo: 2, taskbarSlot: 4, winShortcut: "Win + 4", name: "A1 001 DepEd", email: "orlando.pasion001@deped.gov.ph", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_5", profileDir: "Profile 1", chromeNo: 3, taskbarSlot: 5, winShortcut: "Win + 5", name: "A2 000", email: "orlandopasion000@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_6", profileDir: "Profile 2", chromeNo: 4, taskbarSlot: 6, winShortcut: "Win + 6", name: "A3 0817", email: "orlandopasion0817@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_7", profileDir: "Profile 24", chromeNo: 5, taskbarSlot: 7, winShortcut: "Win + 7", name: "A4 A Hero", email: "heroesmeraldaepicalu@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_8", profileDir: "Profile 22", chromeNo: 6, taskbarSlot: 8, winShortcut: "Win + 8", name: "A4 B Yify", email: "yifyyts7@gmail.com", gaia: "Yify Yify", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_9", profileDir: "Profile 20", chromeNo: 7, taskbarSlot: 9, winShortcut: "Win + 9", name: "A4 C NASH", email: "revnash0@gmail.com", gaia: "Nash Rev", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_10", profileDir: "Profile 48", chromeNo: 8, taskbarSlot: 10, winShortcut: "Slot #10", name: "A4 D Gwapo", email: "gwapocpogi@gmail.com", gaia: "Gwapo Pogi", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_11", profileDir: "Profile 9", chromeNo: 9, taskbarSlot: 11, winShortcut: "Slot #11", name: "A5 001 Gmail", email: "orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_12", profileDir: "Profile 39", chromeNo: 10, taskbarSlot: 12, winShortcut: "Slot #12", name: "A5 002 Gmail", email: "orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_13", profileDir: "Profile 40", chromeNo: 11, taskbarSlot: 13, winShortcut: "Slot #13", name: "A5 003 Gmail", email: "orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_14", profileDir: "Profile 41", chromeNo: 12, taskbarSlot: 14, winShortcut: "Slot #14", name: "A5 004 Gmail", email: "orlandopasion004@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_15", profileDir: "Profile 52", chromeNo: 13, taskbarSlot: 15, winShortcut: "Slot #15", name: "A5 005 Gmail", email: "orlandopasion005@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_16", profileDir: "Profile 53", chromeNo: 14, taskbarSlot: 16, winShortcut: "Slot #16", name: "A5 006 Gmail", email: "orlandopasion006@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_17", profileDir: "Profile 49", chromeNo: 15, taskbarSlot: 17, winShortcut: "Slot #17", name: "A6 Gold Cloud Black", email: "goldcloudblack@gmail.com", gaia: "Gold Cloud Black", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_18", profileDir: "Profile 45", chromeNo: 16, taskbarSlot: 18, winShortcut: "Slot #18", name: "A6 scite001 Gmail", email: "scite.orlandopasion001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_19", profileDir: "Profile 46", chromeNo: 17, taskbarSlot: 19, winShortcut: "Slot #19", name: "A6 scite002 Gmail", email: "scite.orlandopasion002@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_20", profileDir: "Profile 44", chromeNo: 18, taskbarSlot: 20, winShortcut: "Slot #20", name: "A6 scite003 Gmail", email: "scite.orlandopasion003@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_21", profileDir: "Profile 56", chromeNo: 19, taskbarSlot: 21, winShortcut: "Slot #21", name: "A7 A pogiorlandopasion@gmail.com", email: "pogiorlandopasion@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_22", profileDir: "Profile 57", chromeNo: 20, taskbarSlot: 22, winShortcut: "Slot #22", name: "A7 B watchonlineapple", email: "watchonlineapple@gmail.com", gaia: "Watch Online", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_23", profileDir: "Profile 58", chromeNo: 21, taskbarSlot: 23, winShortcut: "Slot #23", name: "A7 C grammarlyquillbot001@gmail.com", email: "grammarlyquillbot001@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "p_tb_24", profileDir: "Profile 59", chromeNo: 22, taskbarSlot: 24, winShortcut: "Slot #24", name: "A7 D netflixpasion", email: "netflixpasion1994@gmail.com", gaia: "Orlando Pasion", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] }
  ];

  // Clean Blank Edition starter profiles (zero personal data — ready to auto-scan installed laptop's taskbar)
  const BLANK_STARTER_PROFILES = [
    { id: "b_slot_1", profileDir: "", chromeNo: 1, taskbarSlot: 1, winShortcut: "Win + 1", name: "Chrome Profile #1", email: "Click 'Scan Laptop Taskbar' to auto-detect", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "b_slot_2", profileDir: "", chromeNo: 2, taskbarSlot: 2, winShortcut: "Win + 2", name: "Chrome Profile #2", email: "Taskbar Slot #2", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] },
    { id: "b_slot_3", profileDir: "", chromeNo: 3, taskbarSlot: 3, winShortcut: "Win + 3", name: "Chrome Profile #3", email: "Taskbar Slot #3", gaia: "", timerUntil: null, timerDurationMs: null, isReset: false, isPinned: false, pinnedAt: null, isUnread: false, stickyNote: "", customAvatar: null, statusNote: null, notes: [] }
  ];

  // Old sample text to purge
  const SAMPLES_TO_PURGE = [
    "draft grade 8 st2 test",
    "revise chapter 3",
    "prepare youth devotion",
    "table of specifications",
    "sampling framework"
  ];

  // Default Personal Dictionary for Wispr Flow Pro
  const DEFAULT_WISPR_DICT = IS_BLANK_EDITION
    ? [
        { from: "ai", to: "AI" },
        { from: "chatgpt", to: "ChatGPT" }
      ]
    : [
        { from: "deped", to: "DepEd" },
        { from: "bow", to: "BOW" },
        { from: "st2", to: "ST2" },
        { from: "scite", to: "Scite" },
        { from: "quillbot", to: "QuillBot" },
        { from: "grammarly", to: "Grammarly" },
        { from: "math 8", to: "Math 8" },
        { from: "math 10", to: "Math 10" },
        { from: "gen math 11", to: "Gen Math 11" },
        { from: "orlando", to: "Orlando" }
      ];

  // Deferred PWA Install Prompt Event
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (typeof updateLaunchButtonState === 'function') {
      updateLaunchButtonState();
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (typeof updateLaunchButtonState === 'function') {
      updateLaunchButtonState();
    }
    if (typeof showToast === 'function') {
      showToast('🎉 OrlandoChrome (Main Version) installed as PWA!');
    }
  });

  // Register Service Worker for Offline PWA & iOS Home Screen Support
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=pure85').catch(() => {});
    });
  }

  // Application State
  const state = {
    profiles: [],
    trash: [], // Recently Deleted Notes Vault (30-day soft-delete)

    activeProfileId: IS_BLANK_EDITION ? "b_slot_1" : "p_tb_4",
    currentFilter: "all",      // "all" | "pending" | "timers"
    searchQuery: "",
    uploadTargetId: null,
    editingNoteId: null,       // Currently inline-editing note ID
    pendingAttachment: null,   // Base64 compressed image awaiting send
    pendingVoiceClip: null,    // Base64 audio clip from Wispr Flow Voice Memo
    pendingReactionTag: null,  // Reaction queued by voice command
    quickTemplates: [...DEFAULT_TEMPLATES],
    lastModified: 0,           // Timestamp of last state change for Cross-Device Cloud Sync
    cloudStatus: "connecting", // "synced" | "syncing" | "connecting" | "offline"
    lastCloudSyncAt: null,
    qrTheme: "crimson",        // "crimson" | "gold" | "emerald" | "contrast"
    wispr: {
      isListening: false,
      panelOpen: false,
      style: "polish",         // "polish" | "academic" | "action" | "raw"
      commandMode: true,
      autoSend: false,
      recordAudioClip: false,
      sessionWords: 0,
      sessionStartMs: null,
      interimText: "",
      lastCommandExecuted: "",
      dictionary: [...DEFAULT_WISPR_DICT]
    }
  };

  // Load & Save Quick Templates
  function loadTemplates() {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          // Ensure removed templates ("DepEd LIS/Form", "Scite Search") never reappear
          state.quickTemplates = parsed.filter(t => !/deped\s*lis|scite\s*search/i.test(t));
        }
      }
    } catch (e) {}
  }

  function saveTemplates() {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(state.quickTemplates));
    } catch (e) {}
  }

  // Load & Save Wispr Flow Pro preferences
  function loadWisprPrefs() {
    try {
      const raw = localStorage.getItem(WISPR_PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.style) state.wispr.style = parsed.style;
      if (typeof parsed.commandMode === 'boolean') state.wispr.commandMode = parsed.commandMode;
      if (typeof parsed.autoSend === 'boolean') state.wispr.autoSend = parsed.autoSend;
      if (typeof parsed.recordAudioClip === 'boolean') state.wispr.recordAudioClip = parsed.recordAudioClip;
      if (typeof parsed.panelOpen === 'boolean') state.wispr.panelOpen = parsed.panelOpen;
      if (Array.isArray(parsed.dictionary) && parsed.dictionary.length) {
        state.wispr.dictionary = parsed.dictionary;
      }
    } catch (e) {
      console.warn('Failed to load Wispr prefs:', e);
    }
  }

  function saveWisprPrefs() {
    try {
      localStorage.setItem(WISPR_PREFS_KEY, JSON.stringify({
        style: state.wispr.style,
        commandMode: state.wispr.commandMode,
        autoSend: state.wispr.autoSend,
        recordAudioClip: state.wispr.recordAudioClip,
        panelOpen: state.wispr.panelOpen,
        dictionary: state.wispr.dictionary
      }));
    } catch (e) {
      console.warn('Failed to save Wispr prefs:', e);
    }
  }

  // Helper to get avatar source
  function getAvatarSrc(profile) {
    if (profile.customAvatar) return profile.customAvatar;
    if (!IS_BLANK_EDITION && profile.profileDir) return `avatars/${encodeURIComponent(profile.profileDir)}.png`;
    const initial = esc(profile.name ? profile.name[0].toUpperCase() : 'C');
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><radialGradient id='g' cx='30%' cy='25%' r='75%'><stop offset='0%' stop-color='%23ff4d58'/><stop offset='50%' stop-color='%23b8000a'/><stop offset='100%' stop-color='%231a0002'/></radialGradient></defs><rect width='100' height='100' rx='50' fill='url(%23g)'/><text x='50' y='66' font-size='46' font-weight='800' text-anchor='middle' fill='%23ffffff' font-family='sans-serif'>${initial}</text></svg>`;
  }


  // Suggestion #4: Recently Deleted / Trash Vault
  function addToTrash(note, profile) {
    if (!state.trash) state.trash = [];
    state.trash.unshift({
      id: uid(),
      profileId: profile.id,
      profileName: profile.name,
      note: JSON.parse(JSON.stringify(note)),
      deletedAt: now(),
      expiresAt: now() + 30 * 24 * 60 * 60 * 1000 // 30-day safety vault
    });
    // Prune beyond 100 items or older than 30 days
    const cur = now();
    state.trash = state.trash.filter(item => item.expiresAt > cur).slice(0, 100);
    saveState();
    updateTrashBadge();
  }

  function restoreFromTrash(trashId) {
    if (!state.trash) return;
    const idx = state.trash.findIndex(t => t.id === trashId);
    if (idx === -1) return;
    const item = state.trash.splice(idx, 1)[0];
    const p = getProfile(item.profileId) || getProfile(state.activeProfileId);
    if (p) {
      if (!p.notes) p.notes = [];
      p.notes.push(item.note);
      saveState();
      renderSidebar();
      renderMainChat();
      showToast(`↺ Restored note to ${p.name}`);
      setTimeout(() => {
        const card = $(`#noteCard_${item.note.id}`);
        if (card) {
          card.classList.add('note-restored-highlight');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 80);
    }
    updateTrashBadge();
  }

  function purgeFromTrash(trashId) {
    if (!state.trash) return;
    state.trash = state.trash.filter(t => t.id !== trashId);
    saveState();
    updateTrashBadge();
  }

  function clearAllTrash() {
    state.trash = [];
    saveState();
    updateTrashBadge();
    showToast('🗑️ Cleared Trash Vault');
  }

  function updateTrashBadge() {
    const badge = $('#headerTrashCount');
    const count = (state.trash || []).length;
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  function openTrashVaultModal() {
    const existing = $('#trashVaultBackdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.id = 'trashVaultBackdrop';
    backdrop.style.zIndex = '9999';

    const renderVault = () => {
      const items = state.trash || [];
      backdrop.innerHTML = `
        <div class="trash-vault-modal">
          <div class="trash-vault-header">
            <div class="trash-vault-title-wrap">
              ${Icons.trashVault(22)}
              <div>
                <h3 class="trash-vault-title">Recently Deleted Vault</h3>
                <div class="trash-vault-subtitle">30-day soft-delete safety vault · Restore messages anytime with 1 click</div>
              </div>
            </div>
            <button type="button" class="btn-banner-clear" id="btnCloseTrashVault" style="font-size:1.2rem; cursor:pointer;">✕</button>
          </div>

          <div class="trash-vault-list">
            ${items.length === 0 ? `
              <div class="trash-vault-empty">
                ${Icons.trashVault(46)}
                <h4>Trash Vault is Empty</h4>
                <p style="font-size:0.8rem; margin:4px 0 0;">Accidentally deleted notes will be safely archived here for 30 days.</p>
              </div>
            ` : items.map(item => {
              const diffMin = Math.max(1, Math.round((now() - item.deletedAt) / 60000));
              const timeLabel = diffMin < 60 ? `${diffMin}m ago` : `${Math.round(diffMin/60)}h ago`;
              return `
                <div class="trash-item-card" data-tid="${item.id}">
                  <div class="trash-item-left">
                    <span class="trash-item-profile-badge">${esc(item.profileName)}</span>
                    <div class="trash-item-text">${esc(item.note.text || (item.note.image ? '[Attached Screenshot]' : '[Voice Note]'))}</div>
                    <div class="trash-item-meta">Deleted ${timeLabel} · Originally ${formatNoteDateTime(item.note.createdAt)}</div>
                  </div>
                  <div class="trash-item-actions">
                    <button type="button" class="btn-trash-restore" data-restore-tid="${item.id}" title="Restore note back to profile">
                      ${Icons.restore(13)} <span>Restore</span>
                    </button>
                    <button type="button" class="btn-trash-purge" data-purge-tid="${item.id}" title="Delete forever">
                      ✕
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="trash-vault-footer">
            <span style="font-size:0.75rem; color:#64748b;">${items.length} item${items.length === 1 ? '' : 's'} archived</span>
            ${items.length > 0 ? `
              <button type="button" class="btn-trash-purge" id="btnClearAllTrash" style="color:#ff4d58; border-color:rgba(255,77,88,0.3);">
                Clear All Trash
              </button>
            ` : ''}
          </div>
        </div>
      `;

      const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
      $('#btnCloseTrashVault', backdrop).onclick = close;
      const clearBtn = $('#btnClearAllTrash', backdrop);
      if (clearBtn) {
        clearBtn.onclick = () => {
          if (confirm('Permanently delete all items in the Trash Vault?')) {
            clearAllTrash();
            renderVault();
          }
        };
      }

      $$('.btn-trash-restore', backdrop).forEach(btn => {
        btn.onclick = () => {
          const tid = btn.dataset.restoreTid;
          restoreFromTrash(tid);
          renderVault();
        };
      });

      $$('.btn-trash-purge', backdrop).forEach(btn => {
        btn.onclick = () => {
          const tid = btn.dataset.purgeTid;
          purgeFromTrash(tid);
          renderVault();
        };
      });
    };

    document.body.appendChild(backdrop);
    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      }
    };
    renderVault();
  }

  // Suggestion #5: Native iOS Accelerometer Shake to Undo
  function initShakeToUndo() {
    let lastX = null, lastY = null, lastZ = null;
    let lastShakeTime = 0;

    window.addEventListener('devicemotion', (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      const cur = now();
      if (cur - lastShakeTime < 2200) return; // Debounce 2.2s

      const { x, y, z } = acc;
      if (lastX !== null && x !== null) {
        const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
        if (delta > 25) { // Sensitivity threshold
          lastShakeTime = cur;
          if (historyMgr && historyMgr.canUndo()) {
            showShakeUndoModal();
          }
        }
      }
      lastX = x; lastY = y; lastZ = z;
    }, { passive: true });
  }

  function showShakeUndoModal() {
    const existing = $('#shakeUndoModalBackdrop');
    if (existing) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.id = 'shakeUndoModalBackdrop';
    backdrop.style.zIndex = '9999';
    backdrop.innerHTML = `
      <div class="rename-dialog shake-undo-dialog" style="max-width:320px; text-align:center;">
        <div style="margin-bottom:10px;">${Icons.shake(36)}</div>
        <h3 style="margin:0 0 6px;">Shake Detected</h3>
        <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 16px;">Undo last message action?</p>
        <div class="rename-actions" style="justify-content:center; gap:10px;">
          <button type="button" class="btn-banner-clear" id="btnCancelShake">Cancel</button>
          <button type="button" class="btn-composer-send" id="btnConfirmShake" style="padding:8px 20px;">
            ${Icons.undo(14)} <span>Undo</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    $('#btnCancelShake', backdrop).onclick = close;
    $('#btnConfirmShake', backdrop).onclick = () => {
      close();
      if (historyMgr) historyMgr.undo();
    };
  }

  // Recommendation 1: Haptic Touch Feedback (iOS Web Vibration API / navigator.vibrate)
  function triggerHaptic(type = 'light') {
    try {
      if (!('vibrate' in navigator)) return;
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(22);
      else if (type === 'heavy') navigator.vibrate([18, 40, 18]);
      else if (type === 'success') navigator.vibrate([12, 50, 24]);
    } catch (e) {}
  }

  // Toast notification (Interactive action toast + regular toast)
  function showToast(msg) {
    const el = $('#toast');
    if (!el) return;
    clearTimeout(el._timer);
    clearInterval(el._interval);
    el.classList.remove('has-action');
    el.textContent = msg;
    el.classList.add('show');
    el._timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function showActionToast({ message, actionText = '↺ Undo', onAction, duration = 2000 }) {
    const el = $('#toast');
    if (!el) return;
    clearTimeout(el._timer);
    clearInterval(el._interval);

    el.innerHTML = `
      <span class="toast-msg">${esc(message)}</span>
      <button type="button" class="toast-action-btn" id="toastActionBtn">${esc(actionText)}</button>
    `;
    el.classList.add('show', 'has-action');

    const btn = $('#toastActionBtn', el);
    if (btn) {
      const handleUndo = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.cancelable) e.preventDefault();
        }
        clearTimeout(el._timer);
        el.classList.remove('show', 'has-action');
        if (typeof onAction === 'function') onAction();
      };
      btn.onclick = handleUndo;
      btn.addEventListener('touchend', handleUndo, { passive: false });
    }

    el._timer = setTimeout(() => {
      el.classList.remove('show', 'has-action');
    }, duration);
  }

  // Multi-Action Reversible Command History Stack (Undo & Redo Engine)
  const historyMgr = {
    undoStack: [],
    redoStack: [],
    maxDepth: 50,

    record(action) {
      if (!action || !action.type) return;
      this.undoStack.push(action);
      if (this.undoStack.length > this.maxDepth) this.undoStack.shift();
      this.redoStack = []; // New user actions invalidate the redo branch
      this.updateUI();
    },

    canUndo() {
      return this.undoStack.length > 0;
    },

    canRedo() {
      return this.redoStack.length > 0;
    },

    undo() {
      if (!this.canUndo()) {
        showToast('Nothing to undo');
        return false;
      }
      const action = this.undoStack.pop();
      this.apply(action, true);
      this.redoStack.push(action);
      if (window.soundMgr) {
        if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
        else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
      }
      this.updateUI();
      return true;
    },

    redo() {
      if (!this.canRedo()) {
        showToast('Nothing to redo');
        return false;
      }
      const action = this.redoStack.pop();
      this.apply(action, false);
      this.undoStack.push(action);
      if (window.soundMgr) {
        if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
        else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
      }
      this.updateUI();
      return true;
    },

    apply(action, isUndo) {
      const p = getProfile(action.profileId);
      if (!p) return;

      // Auto-switch active profile to where the action occurred
      if (state.activeProfileId !== action.profileId) {
        state.activeProfileId = action.profileId;
      }

      switch (action.type) {
        case 'DELETE_NOTE': {
          if (isUndo) {
            if (!p.notes) p.notes = [];
            const insertIdx = (typeof action.index === 'number' && action.index >= 0 && action.index <= p.notes.length)
              ? action.index
              : p.notes.length;
            p.notes.splice(insertIdx, 0, JSON.parse(JSON.stringify(action.note)));
            showToast(`↺ Restored note: "${(action.note.text || 'Message').slice(0, 24)}"`);
            setTimeout(() => {
              const card = $(`#noteCard_${action.note.id}`);
              if (card) {
                card.classList.add('note-restored-highlight');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }, 80);
          } else {
            p.notes = (p.notes || []).filter(n => n.id !== action.note.id);
            showToast('↻ Redid delete');
          }
          break;
        }

        case 'ADD_NOTE': {
          if (isUndo) {
            p.notes = (p.notes || []).filter(n => n.id !== action.note.id);
            showToast('↺ Undid new note');
          } else {
            if (!p.notes) p.notes = [];
            p.notes.push(JSON.parse(JSON.stringify(action.note)));
            showToast('↻ Redid note creation');
            setTimeout(() => {
              const card = $(`#noteCard_${action.note.id}`);
              if (card) {
                card.classList.add('note-restored-highlight');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }, 80);
          }
          break;
        }

        case 'EDIT_NOTE': {
          const note = (p.notes || []).find(n => n.id === action.noteId);
          if (note) {
            if (isUndo) {
              note.text = action.oldText;
              note.editedAt = action.oldEditedAt;
              showToast('↺ Reverted note edit');
            } else {
              note.text = action.newText;
              note.editedAt = action.newEditedAt;
              showToast('↻ Redid note edit');
            }
          }
          break;
        }

        case 'STATUS_NOTE': {
          if (isUndo) {
            p.statusNote = action.oldNote ? Object.assign(JSON.parse(JSON.stringify(action.oldNote)), { updatedAt: now() }) : makeClearedStatusNote();
            showToast(getActiveStatusNote(p) ? '↺ Restored status note' : '↺ Reverted status note');
          } else {
            p.statusNote = action.newNote ? Object.assign(JSON.parse(JSON.stringify(action.newNote)), { updatedAt: now() }) : makeClearedStatusNote();
            showToast(getActiveStatusNote(p) ? '↻ Redid status note' : '↻ Redid clear status note');
          }
          break;
        }

        case 'STICKY_NOTE': {
          if (isUndo) {
            p.stickyNote = action.oldSticky || '';
            showToast(p.stickyNote ? '↺ Restored sticky note' : '↺ Reverted sticky note');
          } else {
            p.stickyNote = action.newSticky || '';
            showToast(p.stickyNote ? '↻ Redid sticky note' : '↻ Redid clear sticky note');
          }
          break;
        }
      }

      if (countPending(p) === 0) {
        p.isPinned = false;
        p.pinnedAt = null;
      }
      if (!hasMessages(p)) {
        p.isUnread = false;
      }

      saveState();
      renderSidebar();
      renderMainChat();
    },

    updateUI() {
      const uBtn = $('#btnUndoNote');
      const rBtn = $('#btnRedoNote');
      const canU = this.canUndo();
      const canR = this.canRedo();
      if (uBtn) {
        uBtn.disabled = !canU;
        uBtn.classList.toggle('disabled', !canU);
        if (canU) {
          const last = this.undoStack[this.undoStack.length - 1];
          uBtn.title = `Undo: ${last.type.toLowerCase().replace('_', ' ')} (Ctrl+Z)`;
        } else {
          uBtn.title = 'Nothing to undo (Ctrl+Z)';
        }
      }
      if (rBtn) {
        rBtn.disabled = !canR;
        rBtn.classList.toggle('disabled', !canR);
        if (canR) {
          const next = this.redoStack[this.redoStack.length - 1];
          rBtn.title = `Redo: ${next.type.toLowerCase().replace('_', ' ')} (Ctrl+Y)`;
        } else {
          rBtn.title = 'Nothing to redo (Ctrl+Y)';
        }
      }
    }
  };
  window.historyMgr = historyMgr;
  window.Icons = Icons;

  // Enhancement #3: Auto-Linkify URLs inside message text & sticky notes
  function linkifyText(raw) {
    const safe = esc(raw);
    return safe.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="note-auto-link" onclick="event.stopPropagation()">🔗 ${url}</a>`;
    });
  }

    // Live Cross-Tab & Cross-Device Bridge to Main Website (orlandopasion000.github.io)
  let liveBridgeChannel = null;
  function initLiveBridge() {
    try {
      if (typeof BroadcastChannel !== 'undefined' && !liveBridgeChannel) {
        liveBridgeChannel = new BroadcastChannel('orlandochrome_live_bridge');
        liveBridgeChannel.onmessage = (e) => {
          if (e.data && (e.data.type === 'REQUEST_STATUS' || e.data.type === 'PING')) {
            broadcastLiveBridgeStatus();
          }
        };
      }
    } catch (e) {}
  }

  function broadcastLiveBridgeStatus() {
    try {
      const pending = totalPendingCount();
      const resets = state.profiles ? state.profiles.filter(p => p.isReset).length : 0;
      const totalAlerts = pending + resets;

      // 1. Sync to localStorage for same-origin tabs (0ms latency)
      localStorage.setItem('orlandochrome_live_pending_count', String(pending));
      localStorage.setItem('orlandochrome_live_total_alerts', String(totalAlerts));
      localStorage.setItem('orlandochrome_live_total_alerts', String(totalAlerts));
      localStorage.setItem('orlandochrome_last_update_ts', String(now()));

      // 2. Broadcast via BroadcastChannel (0ms latency cross-tab)
      if (liveBridgeChannel) {
        liveBridgeChannel.postMessage({
          type: 'ORLANDOCHROME_PENDING_UPDATE',
          pending: pending,
          totalAlerts: totalAlerts,
          timestamp: now()
        });
      }
    } catch (e) {}
  }

  // Enhancement #5: Update Browser Tab Title with Live Pending / Reset Count
  function updateDocumentTitle() {
    const pending = totalPendingCount();
    const resets = state.profiles ? state.profiles.filter(p => p.isReset).length : 0;
    const totalAlerts = pending + resets;
    const baseName = IS_BLANK_EDITION ? 'OrlandoChrome (Blank Canvas)' : 'OrlandoChrome (Main Version)';
    document.title = totalAlerts > 0 ? `(${totalAlerts}) ${baseName}` : baseName;
    broadcastLiveBridgeStatus();
  }

  // Enhancement #5: Fire Desktop Browser Notification on Timer Reset
  function triggerDesktopNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: 'oc-logo.svg' });
      } catch (e) {}
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          try { new Notification(title, { body, icon: 'oc-logo.svg' }); } catch (e) {}
        }
      }).catch(() => {});
    }
  }

  // Compress Image (for Ctrl+V Paste, Drag & Drop, or File Upload)
  function compressImage(fileOrBlob, maxWidth = 960, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }

  // UTF-8 Safe Base64URL Helpers for QR Code & Cloud Sync
  function toBase64Url(str) {
    try {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  }

  function fromBase64Url(b64url) {
    try {
      let b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch (e) {
      return '';
    }
  }

  // Check if profiles array has any active pending/completed notes, timers, pins, or sticky notes
  function hasAnyUserActivity(profList) {
    if (!Array.isArray(profList)) return false;
    const curTime = now();
    return profList.some(p =>
      (Array.isArray(p.notes) && p.notes.length > 0) ||
      Boolean(p.timerUntil) ||
      Boolean(p.isReset) ||
      Boolean(p.isPinned) ||
      Boolean(p.isUnread) ||
      Boolean(p.stickyNote && p.stickyNote.trim()) ||
      Boolean(p.statusNote && p.statusNote.text && (!p.statusNote.expiresAt || p.statusNote.expiresAt > curTime))
    );
  }

  // Build Compact Cross-Device Sync Packet (for Cloud Sync & QR URL)
  function createSyncPacket(forQrCode = false) {
    const activeProfs = [];
    const curTime = now();
    for (const p of state.profiles) {
      const hasNotes = Array.isArray(p.notes) && p.notes.length > 0;
      const hasTimer = Boolean(p.timerUntil) || Boolean(p.isReset);
      const curSn = getActiveStatusNote(p);
      const snRecord = p.statusNote; // active note OR cleared tombstone (still within 24h)
      const hasMeta = Boolean(p.isPinned) || Boolean(p.isUnread) || Boolean(p.stickyNote) || Boolean(snRecord);
      const def = !IS_BLANK_EDITION ? DEFAULT_PROFILES.find(d => d.id === p.id) : null;
      const hasCustomName = def ? (p.name !== def.name) : true;

      if (hasNotes || hasTimer || hasMeta || hasCustomName || IS_BLANK_EDITION) {
        if (forQrCode && !hasNotes && !hasTimer && !hasMeta && !IS_BLANK_EDITION) continue;
        const entry = { i: p.chromeNo };
        if (IS_BLANK_EDITION || hasCustomName) entry.nm = p.name;
        if (IS_BLANK_EDITION && p.email) entry.em = p.email;
        if (p.timerUntil) entry.tu = p.timerUntil;
        if (p.timerDurationMs) entry.td = p.timerDurationMs;
        if (p.isReset) entry.rs = 1;
        if (p.isPinned) {
          entry.pn = 1;
          if (p.pinnedAt) entry.pa = p.pinnedAt;
        }
        if (p.isUnread) entry.un = 1;
        if (p.stickyNote) entry.st = p.stickyNote;
        if (snRecord && !forQrCode) {
          entry.sn = {
            t: curSn ? curSn.text : '',
            c: snRecord.createdAt || curTime,
            u: statusNoteStamp(snRecord) || curTime,
            x: snRecord.expiresAt || (curTime + 86400000)
          };
        } else if (curSn && curSn.text) {
          entry.sn = {
            t: curSn.text,
            c: curSn.createdAt || curTime,
            x: curSn.expiresAt || (curTime + 86400000)
          };
        }
        if (hasNotes) {
          entry.nt = p.notes.map(n => {
            const item = {
              id: n.id,
              t: n.text || '',
              c: n.createdAt || now()
            };
            if (n.done) item.d = 1;
            if (n.editedAt) item.e = n.editedAt;
            if (n.forwardedFrom) item.fw = n.forwardedFrom;
            if (Array.isArray(n.reactions) && n.reactions.length) item.rk = n.reactions;
            if (Array.isArray(n.subItems) && n.subItems.length) {
              item.sb = n.subItems.map(s => ({ id: s.id, t: s.text, d: s.done ? 1 : 0 }));
            }
            if (!forQrCode && n.image && n.image.length < 38000) {
              item.im = n.image;
            }
            return item;
          });
        }
        activeProfs.push(entry);
      }
    }

    let draSync = undefined;
    if (!forQrCode) {
      try {
        draSync = {
          ct: localStorage.getItem('dra-clock-theme') || 'platinum',
          off: JSON.parse(localStorage.getItem('dra-off') || '[]'),
          days: JSON.parse(localStorage.getItem('dra-days') || '[0,1,2,3,4,5,6]'),
          sched: JSON.parse(localStorage.getItem('dra-schedule') || 'null')
        };
      } catch (e) {}
    }

    return {
      v: 2,
      cid: CLIENT_ID,
      ts: state.lastModified || now(),
      ed: IS_BLANK_EDITION ? 'b' : 'p',
      tpl: forQrCode ? undefined : state.quickTemplates,
      dra: draSync,
      pendingCount: totalPendingCount(),
      totalAlerts: totalPendingCount() + (state.profiles ? state.profiles.filter(p => p.isReset).length : 0),
      p: activeProfs
    };
  }

  // Apply Sync Packet from QR Code URL (?sync=...) or Real-Time Cloud Sync
  function applySyncPacket(packet, sourceLabel = 'Cloud Sync') {
    if (!packet || !Array.isArray(packet.p)) return false;

    if (packet.dra) {
      try {
        if (packet.dra.ct) localStorage.setItem('dra-clock-theme', packet.dra.ct);
        if (Array.isArray(packet.dra.off)) localStorage.setItem('dra-off', JSON.stringify(packet.dra.off));
        if (Array.isArray(packet.dra.days)) localStorage.setItem('dra-days', JSON.stringify(packet.dra.days));
        if (Array.isArray(packet.dra.sched) && packet.dra.sched.length > 0) {
          localStorage.setItem('dra-schedule', JSON.stringify(packet.dra.sched));
        }
      } catch (e) {}
    }

    const mapByChromeNo = new Map();
    packet.p.forEach(item => {
      if (item && item.i != null) mapByChromeNo.set(Number(item.i), item);
    });

    if (IS_BLANK_EDITION && packet.p.length > 0) {
      state.profiles = packet.p.map((item, idx) => {
        const slot = idx + 1;
        const existing = state.profiles.find(ep => ep.chromeNo === item.i) || {};
        const restoredNotes = (item.nt || []).map(n => {
          const oldNote = (existing.notes || []).find(en => en.id === n.id) || {};
          return {
            id: n.id || uid(),
            text: n.t || '',
            done: Boolean(n.d),
            createdAt: n.c || now(),
            editedAt: n.e || null,
            forwardedFrom: n.fw || null,
            reactions: Array.isArray(n.rk) ? n.rk : [],
            subItems: Array.isArray(n.sb) ? n.sb.map(s => ({ id: s.id || uid(), text: s.t, done: Boolean(s.d) })) : [],
            image: n.im || oldNote.image || null,
            voiceClip: oldNote.voiceClip || null
          };
        });
        const restoredStatusNote = mergeStatusNotes(existing.statusNote, parseRemoteStatusNote(item && item.sn));
        return {
          id: existing.id || `b_slot_${slot}`,
          profileDir: existing.profileDir || `Profile ${slot}`,
          chromeNo: item.i || slot,
          taskbarSlot: existing.taskbarSlot || slot,
          winShortcut: existing.winShortcut || (slot <= 9 ? `Win + ${slot}` : `Slot #${slot}`),
          name: item.nm || existing.name || `Chrome Profile #${slot}`,
          email: item.em || existing.email || `Taskbar Slot #${slot}`,
          gaia: existing.gaia || '',
          timerUntil: item.tu || null,
          timerDurationMs: item.td || null,
          isReset: Boolean(item.rs),
          isPinned: Boolean(item.pn),
          pinnedAt: item.pa || null,
          isUnread: Boolean(item.un && restoredNotes.length > 0),
          stickyNote: item.st || '',
          statusNote: restoredStatusNote,
          customAvatar: existing.customAvatar || null,
          notes: restoredNotes
        };
      });
    } else {
      state.profiles = DEFAULT_PROFILES.map(def => {
        const existing = state.profiles.find(ep => ep.id === def.id) || {};
        const item = mapByChromeNo.get(def.chromeNo);
        if (!item) {
          return {
            ...def,
            customAvatar: existing.customAvatar || null,
            timerUntil: null,
            timerDurationMs: null,
            isReset: false,
            isPinned: false,
            pinnedAt: null,
            isUnread: false,
            stickyNote: '',
            statusNote: mergeStatusNotes(existing.statusNote, null),
            notes: []
          };
        }
        const restoredNotes = (item.nt || []).map(n => {
          const oldNote = (existing.notes || []).find(en => en.id === n.id) || {};
          return {
            id: n.id || uid(),
            text: n.t || '',
            done: Boolean(n.d),
            createdAt: n.c || now(),
            editedAt: n.e || null,
            forwardedFrom: n.fw || null,
            reactions: Array.isArray(n.rk) ? n.rk : [],
            subItems: Array.isArray(n.sb) ? n.sb.map(s => ({ id: s.id || uid(), text: s.t, done: Boolean(s.d) })) : [],
            image: n.im || oldNote.image || null,
            voiceClip: oldNote.voiceClip || null
          };
        });
        const restoredStatusNote = mergeStatusNotes(existing.statusNote, parseRemoteStatusNote(item.sn));
        return {
          ...def,
          name: item.nm || def.name,
          timerUntil: item.tu || null,
          timerDurationMs: item.td || null,
          isReset: Boolean(item.rs),
          isPinned: Boolean(item.pn),
          pinnedAt: item.pa || null,
          isUnread: Boolean(item.un && restoredNotes.length > 0),
          stickyNote: item.st || '',
          statusNote: restoredStatusNote,
          customAvatar: existing.customAvatar || null,
          notes: restoredNotes
        };
      });
    }

    if (Array.isArray(packet.tpl) && packet.tpl.length > 0) {
      state.quickTemplates = packet.tpl.filter(t => !/deped\s*lis|scite\s*search/i.test(t));
      saveTemplates();
    }

    state.lastModified = packet.ts || now();
    state.lastCloudSyncAt = now();
    try {
      localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
    } catch (e) {}

    persistLocalOnly();
    renderSidebar();
    renderMainChat();
    updateTopbarSyncBadge('synced');
    return true;
  }

  // Ultra-compact micro-sync string (< 115 chars) so the QR code ALWAYS has giant, easy-to-scan blocks
  // while still hydrating active timers & pending notes at 0ms before Cloud Sync finishes!
  function createMicroSyncString() {
    const cur = now();
    const parts = [];
    for (const p of state.profiles) {
      const pending = (p.notes || []).filter(n => !n.done);
      const hasTimer = p.timerUntil && p.timerUntil > cur;
      if (!pending.length && !hasTimer && !p.isReset) continue;
      const remMin = hasTimer ? Math.max(1, Math.round((p.timerUntil - cur) / 60000)) : (p.isReset ? -1 : 0);
      const pinFlag = (p.isPinned && pending.length > 0) ? 1 : 0;
      const firstTxt = pending.length > 0 ? (pending[0].text || 'Task').replace(/[~|_]/g, ' ').slice(0, 26) : '';
      parts.push(`${p.chromeNo}~${remMin}~${pinFlag}~${firstTxt}`);
    }
    if (!parts.length) return '';
    return toBase64Url(parts.join('|'));
  }

  function applyMicroSyncString(b64Str) {
    if (!b64Str) return false;
    try {
      const raw = fromBase64Url(b64Str);
      if (!raw) return false;
      const entries = raw.split('|').filter(Boolean);
      if (!entries.length) return false;
      const cur = now();
      const mapByNo = new Map();
      for (const e of entries) {
        const [noStr, remStr, pinStr, ...txtParts] = e.split('~');
        const no = parseInt(noStr, 10);
        if (!isNaN(no)) {
          mapByNo.set(no, {
            remMin: parseInt(remStr, 10) || 0,
            pinned: pinStr === '1',
            text: (txtParts.join('~') || '').trim()
          });
        }
      }
      state.profiles.forEach(p => {
        const item = mapByNo.get(p.chromeNo);
        if (!item) return;
        if (item.remMin > 0) {
          p.timerUntil = cur + item.remMin * 60000;
          p.timerDurationMs = item.remMin * 60000;
          p.isReset = false;
        } else if (item.remMin === -1) {
          p.timerUntil = null;
          p.isReset = true;
        }
        if (item.pinned) {
          p.isPinned = true;
          p.pinnedAt = p.pinnedAt || cur;
        }
        if (item.text) {
          const exists = (p.notes || []).some(n => !n.done && (n.text || '').startsWith(item.text));
          if (!exists) {
            p.notes = p.notes || [];
            p.notes.push({
              id: uid(),
              text: item.text,
              done: false,
              createdAt: cur,
              reactions: [],
              subItems: []
            });
          }
        }
      });
      persistLocalOnly();
      renderSidebar();
      renderMainChat();
      return true;
    } catch (e) {
      return false;
    }
  }

  // Generate Live Sync URL with Embedded Pending Notes & Active Timers (?sync=...) for Copy Link / Native Share
  function buildLiveSyncUrl(isBlankTarget = false) {
    if (isBlankTarget) return BLANK_APP_URL;
    const base = LIVE_APP_URL;
    const pkt = createSyncPacket(true);
    if (!pkt.p || pkt.p.length === 0) return `${base}?s=1`;
    const encoded = toBase64Url(JSON.stringify(pkt));
    if (!encoded || encoded.length > 1800) return `${base}?s=1`;
    return `${base}?s=1&sync=${encoded}`;
  }

  // Generate Ultra-Scannable Short URL for QR Code (Giant QR Blocks + Instant 0ms Micro-Sync + Live Cloud Sync)
  function buildFastQrUrl(isBlankTarget = false, embedFullData = false) {
    if (isBlankTarget) return BLANK_APP_URL;
    const base = LIVE_APP_URL;
    if (embedFullData) {
      return buildLiveSyncUrl(false);
    }
    const micro = createMicroSyncString();
    // Keep QR URL under 145 characters total so QR code stays low-density with huge, instant-scan squares!
    if (micro && micro.length <= 105) {
      return `${base}?s=1&m=${micro}`;
    }
    return `${base}?s=1`;
  }

  // Update Topbar Cloud Sync Status Pill inside #btnOpenAppSuite
  function updateTopbarSyncBadge(status) {
    state.cloudStatus = status;
    const dot = $('#topbarSyncDot');
    const lbl = $('#topbarSyncLabel');
    if (!dot || !lbl) return;
    dot.className = 'sync-status-dot ' + status;
    if (status === 'syncing') {
      lbl.textContent = 'Syncing...';
    } else if (status === 'synced') {
      lbl.textContent = 'Synced';
    } else if (status === 'offline') {
      lbl.textContent = 'Local';
    } else {
      lbl.textContent = 'Ready';
    }
  }

  let cloudPushTimer = null;
  let cloudEventSource = null;

  function scheduleCloudPush(immediate = false) {
    updateTopbarSyncBadge('syncing');
    clearTimeout(cloudPushTimer);
    if (immediate) {
      pushToCloudNow(false);
    } else {
      cloudPushTimer = setTimeout(() => {
        pushToCloudNow(false);
      }, 60);
    }
  }

  let pendingOfflinePush = false;

  async function pushToCloudNow(showFeedback = false) {
    try {
      updateTopbarSyncBadge('syncing');
      if (!state.lastModified) {
        state.lastModified = now();
        localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      }
      const pkt = createSyncPacket(false);
      const res = await fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(pkt)
      });
      if (res.ok) {
        pendingOfflinePush = false;
        state.lastCloudSyncAt = now();
        updateTopbarSyncBadge('synced');
        if (showFeedback) {
          showToast('☁️ Synced all pending notes & timers across Laptop & iPhone!');
        }
        return true;
      } else {
        pendingOfflinePush = true;
        updateTopbarSyncBadge('offline');
      }
    } catch (e) {
      pendingOfflinePush = true;
      updateTopbarSyncBadge('offline');
    }
    return false;
  }

  async function pullFromCloud(isInitialBootstrap = false, showFeedback = false) {
    try {
      const res = await fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/json?poll=1&since=all`, {
        cache: 'no-store'
      });
      if (!res.ok) {
        updateTopbarSyncBadge('offline');
        return false;
      }
      const text = await res.text();
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      let latestPacket = null;

      for (const line of lines) {
        try {
          const env = JSON.parse(line);
          if (env && env.event === 'message' && env.message) {
            const pkt = JSON.parse(env.message);
            if (pkt && pkt.v === 2 && Array.isArray(pkt.p)) {
              if (!latestPacket || (pkt.ts || 0) >= (latestPacket.ts || 0)) {
                latestPacket = pkt;
              }
            }
          }
        } catch (err) {}
      }

      const localHasActivity = hasAnyUserActivity(state.profiles);

      // If Cloud is empty OR older than our local state, push our local state to Cloud so iPhone/other devices get it!
      if (!latestPacket) {
        if (localHasActivity) {
          await pushToCloudNow(false);
        } else {
          updateTopbarSyncBadge('synced');
        }
        return false;
      }

      const cloudTs = latestPacket.ts || 0;
      const localTs = state.lastModified || 0;
      const cloudHasActivity = latestPacket.p && latestPacket.p.length > 0;
      const forceFromQr = Boolean(state.forceCloudPullOnBoot);

      if (showFeedback || forceFromQr || cloudTs > localTs || (!localHasActivity && cloudHasActivity)) {
        state.forceCloudPullOnBoot = false;
        if (latestPacket.cid !== CLIENT_ID || showFeedback || forceFromQr || !localHasActivity) {
          applySyncPacket(latestPacket, 'Cloud Sync');
          if (showFeedback || forceFromQr) {
            showToast('📲 Synced all Pending Notes & Active Timers from Cloud!');
          }
        }
        updateTopbarSyncBadge('synced');
        return true;
      } else if (localTs > cloudTs && localHasActivity) {
        // Never wipe 24h notes created on another device: merge them in before pushing our state
        mergeCloudStatusNotesIntoLocal(latestPacket);
        persistLocalOnly();
        renderSidebar();
        renderMainChat();
        await pushToCloudNow(false);
        return true;
      }

      updateTopbarSyncBadge('synced');
    } catch (e) {
      updateTopbarSyncBadge('offline');
    }
    return false;
  }

  function initCloudSync() {
    // 1. Pull latest state or push local state on startup
    pullFromCloud(true, false);

    // 2. Open Real-Time Server-Sent Events (SSE) stream so Laptop <-> iPhone updates in < 0.2s
    let sseReconnectTimer = null;
    const connectSSE = () => {
      try {
        if (cloudEventSource) {
          try { cloudEventSource.close(); } catch (e) {}
        }
        cloudEventSource = new EventSource(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/sse`);
        cloudEventSource.onmessage = (ev) => {
          try {
            const env = JSON.parse(ev.data);
            if (env && env.event === 'message' && env.message) {
              const pkt = JSON.parse(env.message);
              if (pkt && pkt.v === 2 && pkt.cid !== CLIENT_ID) {
                if ((pkt.ts || 0) >= (state.lastModified || 0)) {
                  applySyncPacket(pkt, 'Live Sync');
                } else {
                  // Older packet overall, but it may still carry a newer 24h note / clear
                  mergeCloudStatusNotesIntoLocal(pkt);
                  persistLocalOnly();
                  renderSidebar();
                  renderMainChat();
                }
              }
            }
          } catch (err) {}
        };
        cloudEventSource.onopen = () => {
          clearTimeout(sseReconnectTimer);
          updateTopbarSyncBadge('synced');
        };
        cloudEventSource.onerror = () => {
          updateTopbarSyncBadge('offline');
          try { cloudEventSource.close(); } catch (e) {}
          clearTimeout(sseReconnectTimer);
          sseReconnectTimer = setTimeout(connectSSE, 2500);
        };
      } catch (e) {
        clearTimeout(sseReconnectTimer);
        sseReconnectTimer = setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();

    // 3. Re-sync immediately when unlocking iPhone / switching back to browser tab
    window.addEventListener('focus', () => {
      connectSSE();
      pullFromCloud(false, false);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        connectSSE();
        pullFromCloud(false, false);
      }
    });

    // 4. Online/offline window events for aggressive reconnect & offline queue flush
    window.addEventListener('online', () => {
      connectSSE();
      if (pendingOfflinePush) {
        pushToCloudNow(false);
      }
      pullFromCloud(false, false);
      showToast('🌐 Reconnected · Synced with cloud');
    });
    window.addEventListener('offline', () => {
      updateTopbarSyncBadge('offline');
    });

    // 5. Periodic heartbeat check every 10 seconds
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        pullFromCloud(false, false);
      }
    }, 10000);
  }

  // Check if URL has ?sync=... or ?m=... or ?s=1 from scanning the Live QR Code
  function checkUrlSyncPacket() {
    const hasScanFlag = URL_PARAMS.get('s') === '1';
    const microB64 = URL_PARAMS.get('m');
    const syncB64 = URL_PARAMS.get('sync');

    if (hasScanFlag || microB64 || syncB64) {
      state.forceCloudPullOnBoot = true;
      window.history.replaceState({}, document.title, window.location.pathname + (IS_BLANK_EDITION ? '?edition=blank' : ''));
    }

    if (syncB64) {
      try {
        const jsonStr = fromBase64Url(syncB64);
        const pkt = JSON.parse(jsonStr);
        if (pkt && pkt.v === 2 && Array.isArray(pkt.p)) {
          return { type: 'full', pkt };
        }
      } catch (e) {
        console.warn('Failed to parse URL sync packet:', e);
      }
    }

    if (microB64) {
      return { type: 'micro', microB64 };
    }

    return null;
  }

  // Check if URL has ?import_b64=... from the Laptop Taskbar Auto-Scanner script
  function checkUrlImportedProfiles() {
    const b64 = URL_PARAMS.get('import_b64');
    if (!b64) return null;
    try {
      const jsonStr = atob(b64);
      const arr = JSON.parse(jsonStr);
      if (Array.isArray(arr) && arr.length > 0) {
        window.history.replaceState({}, document.title, window.location.pathname + (IS_BLANK_EDITION ? '?edition=blank' : ''));
        return arr;
      }
    } catch (e) {
      console.warn('Failed to parse URL imported profiles:', e);
    }
    return null;
  }

  // Load state and clean sample notes
  function loadState() {
    loadWisprPrefs();
    loadTemplates();

    const savedLastMod = parseInt(localStorage.getItem(LAST_MOD_KEY), 10);
    state.lastModified = !isNaN(savedLastMod) ? savedLastMod : 0;

    const badge = $('#brandEditionBadge');
    if (badge && IS_BLANK_EDITION) {
      badge.textContent = 'BLANK EDITION';
    }

    const urlImported = checkUrlImportedProfiles();
    if (urlImported && urlImported.length > 0) {
      if (IS_BLANK_EDITION) {
        state.profiles = urlImported.map((p, idx) => ({
          id: p.id || `b_slot_${idx + 1}`,
          profileDir: p.profileDir || `Profile ${idx + 1}`,
          chromeNo: idx + 1,
          taskbarSlot: p.taskbarSlot || (idx + 1),
          winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
          name: p.name || `Chrome #${idx + 1}`,
          email: p.email || '',
          gaia: p.gaia || '',
          timerUntil: null,
          timerDurationMs: null,
          isReset: false,
          isPinned: false,
          pinnedAt: null,
          isUnread: false,
          stickyNote: '',
          customAvatar: p.customAvatar || null,
          notes: []
        }));
      } else {
        // Merge names & emails into personal profiles without losing notes, timers, or avatars!
        let updatedCount = 0;
        state.profiles = DEFAULT_PROFILES.map(def => {
          const matched = urlImported.find(u => (u.profileDir && u.profileDir === def.profileDir) || (u.chromeNo && u.chromeNo === def.chromeNo));
          const nameToUse = (matched && matched.name) ? matched.name : def.name;
          const emailToUse = (matched && matched.email) ? matched.email : def.email;
          if (matched && (nameToUse !== def.name || emailToUse !== def.email)) updatedCount++;
          return {
            ...def,
            name: nameToUse,
            email: emailToUse
          };
        });
      }
      state.activeProfileId = state.profiles[0].id;
      saveState();
      setTimeout(() => showToast(`✅ Auto-synced Chrome profiles & taskbar names from this laptop!`), 300);
      return;
    }

    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const k of OLD_STORAGE_KEYS) {
        raw = localStorage.getItem(k);
        if (raw) break;
      }
    }

    try {
      const savedTrash = localStorage.getItem('orlandochrome_trash');
      if (savedTrash) state.trash = JSON.parse(savedTrash);
    } catch (e) {}
    let loaded = null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) loaded = parsed;
        else if (parsed && Array.isArray(parsed.profiles)) loaded = parsed.profiles;
      } catch (e) {
        console.warn('Failed to parse saved state:', e);
      }
    }

    if (IS_BLANK_EDITION) {
      if (!loaded || !loaded.length) {
        state.profiles = JSON.parse(JSON.stringify(BLANK_STARTER_PROFILES));
      } else {
        state.profiles = loaded.map((p, idx) => ({
          ...p,
          id: p.id || `b_slot_${idx + 1}`,
          chromeNo: p.chromeNo || (idx + 1),
          taskbarSlot: p.taskbarSlot || (idx + 1),
          winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
          stickyNote: p.stickyNote || '',
          statusNote: p.statusNote || null,
          isUnread: !!(p.isUnread && Array.isArray(p.notes) && p.notes.length > 0),
          notes: (p.notes || []).map(n => ({
            ...n,
            reactions: Array.isArray(n.reactions) ? n.reactions : [],
            subItems: Array.isArray(n.subItems) ? n.subItems : []
          }))
        }));
      }
      state.activeProfileId = state.profiles[0] ? state.profiles[0].id : 'b_slot_1';
      persistLocalOnly();
      return;
    }

    if (!loaded || !loaded.length) {
      state.profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    } else {
      // Reconcile with ground-truth laptop definitions
      state.profiles = DEFAULT_PROFILES.map(def => {
        const found = loaded.find(p => p.id === def.id || (p.chromeNo === def.chromeNo && p.profileDir === def.profileDir) || (p.profileDir === def.profileDir));
        if (!found) return { ...def };

        const cleanedNotes = (found.notes || []).filter(n => {
          const txt = (n.text || '').toLowerCase();
          return !SAMPLES_TO_PURGE.some(s => txt.includes(s));
        }).map(n => ({
          ...n,
          reactions: Array.isArray(n.reactions) ? n.reactions : [],
          subItems: Array.isArray(n.subItems) ? n.subItems : [],
          image: n.image || null,
          voiceClip: n.voiceClip || null,
          editedAt: n.editedAt || null,
          forwardedFrom: n.forwardedFrom || null
        }));

        let resolvedName = (found.name && found.name.trim()) ? found.name : def.name;
        if (def.taskbarSlot === 17) {
          resolvedName = 'A6 Gold Cloud Black';
        }

        return {
          ...def,
          // Respect user-renamed profile name & email while defaulting to ground truth
          name: resolvedName,
          email: (found.email && found.email.trim()) ? found.email : def.email,
          taskbarSlot: def.taskbarSlot,
          winShortcut: def.winShortcut,
          timerUntil: found.timerUntil || null,
          timerDurationMs: found.timerDurationMs || null,
          isReset: !!found.isReset,
          isPinned: !!found.isPinned,
          pinnedAt: found.pinnedAt || null,
          isUnread: !!(found.isUnread && cleanedNotes.length > 0),
          stickyNote: found.stickyNote || '',
          customAvatar: found.customAvatar || null,
          statusNote: found.statusNote || null,
          notes: cleanedNotes
        };
      });
    }

    state.profiles.sort((a, b) => a.taskbarSlot - b.taskbarSlot);

    // If this device already has pending notes or timers from before Cloud Sync existed, stamp lastModified so it uploads on boot!
    if (!state.lastModified && hasAnyUserActivity(state.profiles)) {
      state.lastModified = now();
      try {
        localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      } catch (e) {}
    }

    // If opened via QR Code with embedded ?sync=... or ?m=... state, apply it immediately!
    const urlSyncObj = checkUrlSyncPacket();
    if (urlSyncObj) {
      if (urlSyncObj.type === 'full') {
        applySyncPacket(urlSyncObj.pkt, 'QR Scan');
      } else if (urlSyncObj.type === 'micro') {
        applyMicroSyncString(urlSyncObj.microB64);
      }
      setTimeout(() => showToast('📲 Synced Pending Notes & Active Timers from QR Code!'), 300);
      return;
    }

    persistLocalOnly();
  }

  function persistLocalOnly() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
      localStorage.setItem('orlandochrome_trash', JSON.stringify(state.trash || []));
      updateDocumentTitle();
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  function saveState(skipCloud = false) {
    try {
      state.lastModified = now();
      localStorage.setItem(LAST_MOD_KEY, String(state.lastModified));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profiles));
      updateDocumentTitle();
      if (!skipCloud) {
        scheduleCloudPush();
      }
    } catch (e) {
      console.error('Failed to save state:', e);
      showToast('⚠️ Storage nearly full — consider deleting old large screenshots.');
    }
  }

  function getProfile(id) {
    return state.profiles.find(p => p.id === id) || state.profiles[0];
  }

  function hasMessages(profile) {
    return Array.isArray(profile.notes) && profile.notes.length > 0;
  }

  function countPending(profile) {
    return (profile.notes || []).filter(n => !n.done).length;
  }

  function totalPendingCount() {
    return state.profiles.reduce((sum, p) => sum + countPending(p), 0);
  }

  function totalTimersCount() {
    const cur = now();
    return state.profiles.filter(p => (p.timerUntil && p.timerUntil > cur) || p.isReset).length;
  }

  // Format complete date and time: mm/dd/yyyy hh:mm AM/PM
  function formatNoteDateTime(ts) {
    const d = new Date(ts || now());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${mm}/${dd}/${yyyy} ${timeStr}`;
  }

  // Format countdown string
  function formatRemaining(ms) {
    if (ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (days > 0) {
      return `${days}d ${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }

  // Compact timer label for pills
  function formatRemainingShort(ms) {
    if (ms <= 0) return '0m';
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (days > 0) return hrs > 0 ? `${days}d ${hrs}h` : `${days}d`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  // =========================================================================
  // ⌚ ORLANDORECHARGE CLOCK & SCHEDULE ENGINE (Exact Alignment with daily-recharge-alarm.html)
  // =========================================================================
  const DRA_CLOCK_THEMES = [
    'platinum', 'gold', 'royal-sapphire', 'crimson-laser', 'obsidian-noir',
    'solis-gold', 'rainbow', 'chrome-3d', 'cyber-emerald', 'ice-titanium',
    'amethyst', 'sunset-rose', 'minimal-white', 'chronometer-din', 'sunset-amber',
    'midnight-gold', 'green-nature'
  ];

  const DRA_THEME_NAMES = {
    'platinum': 'Platinum Mirror',
    'gold': 'Champagne Gold',
    'royal-sapphire': 'Royal Sapphire',
    'crimson-laser': 'Crimson Laser',
    'obsidian-noir': 'Obsidian Noir',
    'solis-gold': 'Solis Gold',
    'rainbow': 'Prism Spectrum',
    'chrome-3d': 'Liquid Chrome 3D',
    'cyber-emerald': 'Cyber Emerald',
    'ice-titanium': 'Ice Titanium',
    'amethyst': 'Royal Amethyst',
    'sunset-rose': 'Sunset Rose',
    'minimal-white': 'Pure White',
    'chronometer-din': 'Chronometer Silver',
    'sunset-amber': 'Sunset Amber',
    'midnight-gold': 'Midnight Gold Outline',
    'green-nature': 'Botanical Emerald'
  };

  function getActiveDraClockTheme() {
    try {
      const saved = localStorage.getItem('dra-clock-theme');
      if (saved && DRA_CLOCK_THEMES.includes(saved)) return saved;
    } catch (e) {}
    return 'platinum';
  }

  function p2(n) {
    return String(n).padStart(2, '0');
  }

  function chromeDigitsHTML(str) {
    return [...str].map(c => c === ':' ? '<span class="c">:</span>' : `<span>${c}</span>`).join('');
  }

  // Daily Recharge Alarm Schedule Calculator — Aligned 100% with daily-recharge-alarm.html
  // Reads user's live dra-schedule, dra-off, and dra-days from shared origin localStorage!
  function getNextAlarmInfo() {
    const n = new Date();
    let sched = RECHARGE_SCHEDULE;
    let offKeys = new Set();
    let activeDays = new Set([0, 1, 2, 3, 4, 5, 6]);

    try {
      const rawSched = localStorage.getItem('dra-schedule');
      if (rawSched) {
        const parsed = JSON.parse(rawSched);
        if (Array.isArray(parsed) && parsed.length > 0) sched = parsed;
      }
      const rawOff = localStorage.getItem('dra-off');
      if (rawOff) {
        const parsedOff = JSON.parse(rawOff);
        if (Array.isArray(parsedOff)) offKeys = new Set(parsedOff);
      }
      const rawDays = localStorage.getItem('dra-days');
      if (rawDays) {
        const parsedDays = JSON.parse(rawDays);
        if (Array.isArray(parsedDays) && parsedDays.length > 0) activeDays = new Set(parsedDays);
      }
    } catch (e) {}

    let found = null;
    for (let dayOffset = 0; dayOffset <= 7 && !found; dayOffset++) {
      const d = new Date(n);
      d.setDate(n.getDate() + dayOffset);
      if (!activeDays.has(d.getDay())) continue;

      for (const item of sched) {
        const h = Number(item[0]);
        const m = Number(item[1]);
        const key = `${p2(h)}:${p2(m)}`;
        if (offKeys.has(key)) continue;

        const at = new Date(d);
        at.setHours(h, m, 0, 0);
        if (at > n) {
          found = {
            at,
            type: item[2] || 'break',
            title: item[3] || 'Scheduled Recharge'
          };
          break;
        }
      }
    }

    if (!found) {
      const fallback = sched[0] || [7, 0, 'start', 'Breakfast & morning prep — ease into the day'];
      const at = new Date(n);
      at.setDate(n.getDate() + 1);
      at.setHours(Number(fallback[0]), Number(fallback[1]), 0, 0);
      found = {
        at,
        type: fallback[2] || 'start',
        title: fallback[3] || 'Breakfast & morning prep — ease into the day'
      };
    }

    // Exact formula from daily-recharge-alarm.html: Math.round((found.at - n) / 1000)
    const diffSec = Math.max(0, Math.round((found.at - n) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const diffText = (h ? `${h}h ` : '') + `${p2(m)}m`;

    return {
      diffSec,
      diffText,
      title: found.title,
      type: found.type
    };
  }

  // Render Top Nav Clock Box (OrlandoRecharge Font Style, 17 Colorways, & Official OR Logo)
  function renderClockBox() {
    const box = $('#navClockBox');
    if (!box) return;
    const n = new Date();
    const h12 = n.getHours() % 12 || 12;
    const digitsStr = `${p2(h12)}:${p2(n.getMinutes())}:${p2(n.getSeconds())}`;
    const ampmStr = n.getHours() >= 12 ? 'PM' : 'AM';
    const clockTheme = getActiveDraClockTheme();
    const themeLabel = DRA_THEME_NAMES[clockTheme] || 'Platinum Mirror';

    if (IS_BLANK_EDITION) {
      box.innerHTML = `
        <div class="nf-clock-digital" id="topClockWidget" data-clock-theme="${esc(clockTheme)}" title="Click to cycle OrlandoRecharge Clock Style (${esc(themeLabel)})">
          <span class="chrome">${chromeDigitsHTML(digitsStr)}</span>
          <span class="nf-clock-ampm">${ampmStr}</span>
        </div>
      `;
    } else {
      const alarm = getNextAlarmInfo();
      const activeTimersCount = totalTimersCount();
      box.innerHTML = `
        <div class="nf-clock-digital" id="topClockWidget" data-clock-theme="${esc(clockTheme)}" title="Click to cycle OrlandoRecharge Clock Style (${esc(themeLabel)})">
          <span class="chrome">${chromeDigitsHTML(digitsStr)}</span>
          <span class="nf-clock-ampm">${ampmStr}</span>
        </div>
        ${activeTimersCount > 0 ? `
          <button type="button" class="mobile-timers-summary-pill" id="mobileTimersSummaryPill" title="${activeTimersCount} active cooldown timer${activeTimersCount > 1 ? 's' : ''}">
            <span class="pill-hourglass">⏳</span>
            <span class="pill-num">${activeTimersCount}</span>
          </button>
        ` : ''}
        <a href="https://orlandopasion000.github.io/orlandorecharge" target="_blank" rel="noopener noreferrer" class="nf-alarm-pill" id="topAlarmPill" title="Open OrlandoRecharge (Main Version) — Synced Live Schedule">
          <span class="alarm-pill-icon-svg" style="display:inline-flex;align-items:center;margin-right:4px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff2a3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 6px rgba(255,42,60,0.85));"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3L2 6"></path><path d="M19 3l3 3"></path></svg></span>
          <span class="alarm-pill-text"><strong class="alarm-pill-countdown">${alarm.diffText}</strong> — ${esc(alarm.title)}</span>
        </a>
      `;
    }

    const timerSummaryPill = $('#mobileTimersSummaryPill', box);
    if (timerSummaryPill) {
      const handleTimerPill = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.cancelable) e.preventDefault();
        }
        triggerHaptic('light');
        if (typeof closeMobileChatWithSlide === 'function') closeMobileChatWithSlide();
        const tabTimers = $('#tabTimers');
        if (tabTimers) tabTimers.click();
      };
      timerSummaryPill.onclick = handleTimerPill;
      timerSummaryPill.addEventListener('touchend', handleTimerPill, { passive: false });
    }

    const clockEl = $('#topClockWidget', box);
    if (clockEl) {
      clockEl.onclick = () => {
        const curTheme = getActiveDraClockTheme();
        const nextIdx = (DRA_CLOCK_THEMES.indexOf(curTheme) + 1) % DRA_CLOCK_THEMES.length;
        const nextTheme = DRA_CLOCK_THEMES[nextIdx];
        try {
          localStorage.setItem('dra-clock-theme', nextTheme);
        } catch (e) {}
        renderClockBox();
        scheduleCloudPush();
        // clock style toggled silently
      };
    }
  }

  // Small Green & White Radiant Gradient Orb (Replaces flat 🟢 emoji on Limit Reset)
  function renderGreenWhiteOrb() {
    return `<span class="radiant-green-white-orb" aria-hidden="true"></span>`;
  }

  // Render Interactive Pushpin Button:
  // - Unpinned: Small Red & White / Bloody Red Radiant Gradient SVG Pin
  // - Pinned:   Small Green & White Radiant Gradient SVG Pin
  function renderPinButton(profile) {
    const isPinned = !!(profile.isPinned && countPending(profile) > 0);
    if (!isPinned) {
      const rgid = `redPinGrad_${profile.id}`;
      const rnid = `redNeedleGrad_${profile.id}`;
      return `
        <button type="button" class="pin-btn unpinned" data-pin-id="${profile.id}" title="Click to pin ${esc(profile.name)} &amp; message to top">
          <svg class="pin-svg-radiant" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <defs>
              <linearGradient id="${rgid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="28%" stop-color="#FFD1D6"/>
                <stop offset="62%" stop-color="#FF1E27"/>
                <stop offset="86%" stop-color="#B8000A"/>
                <stop offset="100%" stop-color="#590004"/>
              </linearGradient>
              <linearGradient id="${rnid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#FF9EA8"/>
              </linearGradient>
            </defs>
            <g transform="rotate(45 12 12)">
              <!-- Needle -->
              <path d="M11 14 L13 14 L12.4 22.2 L12 23.2 L11.6 22.2 Z" fill="url(#${rnid})"/>
              <!-- Lower Flange / Collar -->
              <rect x="6" y="11" width="12" height="3.4" rx="1.7" fill="url(#${rgid})"/>
              <!-- Middle Cylinder Body -->
              <path d="M8.5 5.2 L15.5 5.2 L14.5 11.2 L9.5 11.2 Z" fill="url(#${rgid})"/>
              <!-- Top Cap with White & Crimson Radiant Highlight -->
              <rect x="7" y="2.2" width="10" height="3.3" rx="1.65" fill="#FFFFFF"/>
              <rect x="7.5" y="2.6" width="9" height="2.5" rx="1.25" fill="url(#${rgid})"/>
            </g>
          </svg>
        </button>
      `;
    }

    const gid = `pinGrad_${profile.id}`;
    const nid = `needleGrad_${profile.id}`;
    return `
      <button type="button" class="pin-btn pinned" data-pin-id="${profile.id}" title="Pinned to top — Click to return ${esc(profile.name)} to original location (${esc(profile.winShortcut)})">
        <svg class="pin-svg-radiant" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <defs>
            <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="32%" stop-color="#D1FAE5"/>
              <stop offset="68%" stop-color="#34D399"/>
              <stop offset="100%" stop-color="#10B981"/>
            </linearGradient>
            <linearGradient id="${nid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#A7F3D0"/>
            </linearGradient>
          </defs>
          <g transform="rotate(45 12 12)">
            <!-- Needle -->
            <path d="M11 14 L13 14 L12.4 22.2 L12 23.2 L11.6 22.2 Z" fill="url(#${nid})"/>
            <!-- Lower Flange / Collar -->
            <rect x="6" y="11" width="12" height="3.4" rx="1.7" fill="url(#${gid})"/>
            <!-- Middle Cylinder Body -->
            <path d="M8.5 5.2 L15.5 5.2 L14.5 11.2 L9.5 11.2 Z" fill="url(#${gid})"/>
            <!-- Top Cap with White Radiant Highlight -->
            <rect x="7" y="2.2" width="10" height="3.3" rx="1.65" fill="#FFFFFF"/>
            <rect x="7.5" y="2.6" width="9" height="2.5" rx="1.25" fill="url(#${gid})"/>
          </g>
        </svg>
      </button>
    `;
  }

  // Collect unique active reactions across a profile's pending notes for sidebar display
  function getSidebarReactionBadgesHtml(pendingNotes) {
    const seen = new Set();
    for (const n of pendingNotes) {
      if (Array.isArray(n.reactions)) {
        n.reactions.forEach(r => seen.add(r));
      }
    }
    if (!seen.size) return '';
    return `<span class="sidebar-reaction-badges">` +
      Array.from(seen).map(key => {
        const r = REACTIONS_MAP[key];
        if (!r) return '';
        return `<span class="sidebar-react-chip ${r.cls}" title="${esc(r.label)}">${r.icon}</span>`;
      }).join('') +
      `</span>`;
  }

  // Return profiles sorted in canonical order (Pinned with pending messages first, then Taskbar Slot order)
  function getSortedProfiles(listToSort = state.profiles) {
    return [...listToSort].sort((a, b) => {
      const aPin = !!(a.isPinned && countPending(a) > 0);
      const bPin = !!(b.isPinned && countPending(b) > 0);
      if (aPin !== bPin) return aPin ? -1 : 1;
      if (aPin && bPin) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
      return a.taskbarSlot - b.taskbarSlot;
    });
  }

  // Select Profile with Messenger-Style Full-Width View Switcher on Mobile (<= 768px)
  function openMobileChatWithSlide(profileId) {
    if (profileId) {
      state.activeProfileId = profileId;
    }
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-chat-open');
      try { localStorage.setItem('orlandochrome_mobile_view', 'chat'); } catch (e) {}
    }
    if (window.soundMgr) {
      if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
      else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
    }
    renderSidebar();
    renderMainChat();
    setTimeout(() => {
      const stream = $('#notesStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);
  }

  function closeMobileChatWithSlide() {
    document.body.classList.remove('mobile-chat-open');
    try { localStorage.setItem('orlandochrome_mobile_view', 'inbox'); } catch (e) {}
    if (window.soundMgr) {
      if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
      else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
    }
    renderSidebar();
    renderMainChat();
  }

  // Step to Previous (-1) or Next (+1) Chrome Profile (Paging Gesture / Header Tap)
  function stepProfile(delta) {
    const sorted = getSortedProfiles();
    if (!sorted.length) return;
    const curIdx = sorted.findIndex(p => p.id === state.activeProfileId);
    const nextIdx = (curIdx + delta + sorted.length) % sorted.length;
    const nextProf = sorted[nextIdx];
    state.activeProfileId = nextProf.id;
    renderSidebar();
    renderMainChat();
    const activeRow = $(`#profileList .profile-item[data-id="${nextProf.id}"]`);
    if (activeRow) {
      try {
        activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } catch (e) {}
    }
    const chatMain = $('#chatMain');
    if (chatMain) {
      chatMain.classList.remove('paging-slide-left', 'paging-slide-right');
      void chatMain.offsetWidth;
      chatMain.classList.add(delta > 0 ? 'paging-slide-left' : 'paging-slide-right');
      setTimeout(() => {
        chatMain.classList.remove('paging-slide-left', 'paging-slide-right');
      }, 260);
    }
    if (window.soundMgr) window.soundMgr.playClick();
    showToast(`${delta > 0 ? '▶' : '◀'} Chrome #${nextProf.chromeNo}: ${nextProf.name}`);
  }

  // Render Sidebar Profiles List
  function renderSidebar() {
    // Guard: defer re-render while note modal is open to prevent iOS phantom dismissal
    if (document.body.dataset.noteModalOpen === '1') {
      if (!renderSidebar._deferred) {
        renderSidebar._deferred = true;
        const waitForClose = () => {
          if (document.body.dataset.noteModalOpen !== '1') {
            renderSidebar._deferred = false;
            renderSidebar();
          } else {
            setTimeout(waitForClose, 200);
          }
        };
        setTimeout(waitForClose, 200);
      }
      return;
    }
    const list = $('#profileList');
    if (!list) return;

    const cur = now();
    const query = (state.searchQuery || '').toLowerCase().trim();
    const filter = state.currentFilter;

    // Filter profiles
    const filtered = state.profiles.filter(p => {
      const pendingCount = countPending(p);
      const isTimer = (p.timerUntil && p.timerUntil > cur) || p.isReset;

      if (filter === 'pending' && pendingCount === 0 && !p.isUnread) return false;
      if (filter === 'timers' && !isTimer) return false;

      if (!query) return true;
      const inName = p.name.toLowerCase().includes(query);
      const inEmail = (p.email || '').toLowerCase().includes(query);
      const inSlot = String(p.taskbarSlot).includes(query) || (p.winShortcut || '').toLowerCase().includes(query);
      const inNotes = (p.notes || []).some(n => (n.text || '').toLowerCase().includes(query));
      return inName || inEmail || inSlot || inNotes;
    });

    // Sort: Pinned profiles with pending messages go to the top; unpinned stay in exact original taskbarSlot order
    filtered.sort((a, b) => {
      const aPin = !!(a.isPinned && countPending(a) > 0);
      const bPin = !!(b.isPinned && countPending(b) > 0);
      if (aPin !== bPin) return aPin ? -1 : 1;
      if (aPin && bPin) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
      return a.taskbarSlot - b.taskbarSlot;
    });

    // Update filter badge counts
    $('#countAll').textContent = state.profiles.length;
    $('#countPending').textContent = totalPendingCount();
    $('#countTimers').textContent = totalTimersCount();
    updateDocumentTitle();

    if (!filtered.length) {
      list.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: var(--nf-text-muted); font-size: 13px;">
          No profiles found matching "${esc(query)}"
        </div>
      `;
      return;
    }

    const activeProf = getProfile(state.activeProfileId);

    list.innerHTML = filtered.map(p => {
      const isActive = p.id === state.activeProfileId;
      const pendingCount = countPending(p);
      const canUnread = hasMessages(p);
      const isPinned = !!(p.isPinned && pendingCount > 0);
      const isTimer = p.timerUntil && p.timerUntil > cur;
      const isReset = p.isReset;
      const isUnread = !!(p.isUnread && canUnread);
      const avatarSrc = getAvatarSrc(p);
      const statusNote = getActiveStatusNote(p);

      const allNotes = p.notes || [];
      const pendingNotes = allNotes.filter(n => !n.done);
      let snippetHtml = '';
      let snippetClass = '';

      if (pendingNotes.length > 0) {
        const firstNote = pendingNotes[0];
        const mediaPrefix = firstNote.image ? '📸 ' : (firstNote.voiceClip ? '🎙️ ' : '');
        const subCount = (firstNote.subItems || []).length;
        const displayMsg = firstNote.text ? `${mediaPrefix}${firstNote.text}` : (firstNote.image ? '📸 Screenshot attached' : (subCount > 0 ? `☑ Checklist (${subCount} items)` : '🎙️ Voice note'));
        const reactBadges = getSidebarReactionBadgesHtml(pendingNotes);
        snippetHtml = `${renderPinButton(p)}<span class="snippet-msg-text">${esc(displayMsg)}</span>${reactBadges}`;
        snippetClass = isPinned ? 'pinned-glow' : 'pending-glow';
      } else if (isReset) {
        // Small Green & White Radiant Gradient for Limit Reset!
        snippetHtml = `${renderGreenWhiteOrb()}<span class="reset-msg-text">Limit Reset · Ready for work</span>`;
        snippetClass = 'reset-glow';
      } else if (isTimer) {
        snippetHtml = `⏳ Timer: ${formatRemainingShort(p.timerUntil - cur)} left`;
        snippetClass = 'timer-glow';
      } else if (isUnread) {
        snippetHtml = '● Marked as Unread — Check window next';
        snippetClass = 'unread-glow';
      } else if (statusNote) {
        snippetHtml = `<span class="snippet-msg-text snippet-msg-note" title="24h Note: ${esc(statusNote.text)}">${Icons.note(11)} "${esc(statusNote.text)}" <span style="opacity:0.6; font-size:11px;">· ${formatRemainingNoteTime(statusNote.expiresAt - cur)}</span></span>`;
        snippetClass = 'note-row';
      } else if (allNotes.length > 0) {
        // Messenger Standard: After reading/completing task, show latest note in transparent/dim style like email
        const lastNote = allNotes[allNotes.length - 1];
        const mediaPrefix = lastNote.image ? '📸 ' : (lastNote.voiceClip ? '🎙️ ' : '');
        const subCount = (lastNote.subItems || []).length;
        const lastMsg = lastNote.text ? `${mediaPrefix}${lastNote.text}` : (lastNote.image ? '📸 Photo' : (subCount > 0 ? `☑ Checklist (${subCount} items)` : '🎙️ Voice note'));
        snippetHtml = `<span class="snippet-msg-text snippet-msg-read" title="Completed note">${esc(lastMsg)}</span>`;
        snippetClass = 'read-row';
      } else {
        snippetHtml = `<span class="snippet-msg-text snippet-msg-idle">${esc(p.email || 'Ready · Tap to add notes')}</span>`;
        snippetClass = 'idle-row';
      }

      // Short slot tag e.g. W+3, W+4, #10
      const slotTag = p.winShortcut.startsWith('Win + ')
        ? `W+${p.winShortcut.replace('Win + ', '')}`
        : `#${p.taskbarSlot}`;

      return `
        <div class="profile-item ${isActive ? 'active' : ''} ${isPinned ? 'is-pinned' : ''} ${isUnread ? 'is-unread' : ''}" data-id="${p.id}" style="flex-shrink:0;" ${canUnread ? 'title="Right-click to toggle Unread dot"' : ''}>
          <!-- Bigger Picture Avatar (56px) with Messenger Note Thought Cloud on Top Left -->
          <div class="profile-avatar-wrap" data-pid="${p.id}" title="${statusNote ? `💭 24h Note: &quot;${esc(statusNote.text)}&quot; (${formatRemainingNoteTime(statusNote.expiresAt - cur)}) · Tap to view or edit` : 'Tap to share a 24h Messenger Note'}">
            ${statusNote ? `
              <div class="avatar-note-bubble" title="24h Note: ${esc(statusNote.text)}">
                <span>${esc(statusNote.text)}</span>
              </div>
            ` : `
              <div class="avatar-note-add-prompt desktop-only-note-prompt" title="Share a Note">
                <span>${Icons.note(12)}</span>
              </div>
            `}
            <img src="${avatarSrc}" class="profile-avatar-img" alt="${esc(p.name)}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23111\\'/><text x=\\'50\\' y=\\'65\\' font-size=\\'40\\' text-anchor=\\'middle\\' fill=\\'%23fff\\'>${esc(p.name ? p.name[0] : 'C')}</text></svg>'">
            <span class="profile-slot-badge">${esc(slotTag)}</span>
            ${isUnread ? `<span class="avatar-unread-dot" title="Unread Bookmark"></span>` : ''}
          </div>

          <!-- Profile Details (Messenger Standard · Full Generous Height) -->
          <div class="profile-text-content">
            <div class="profile-row-header">
              <span class="profile-name">${esc(p.name)}</span>
              ${canUnread ? `
                <div class="profile-header-right">
                  <button type="button" class="unread-toggle-btn ${isUnread ? 'active' : ''}" data-unread-id="${p.id}" title="${isUnread ? 'Mark as Read' : 'Mark as Unread (Bookmark)'}">●</button>
                </div>
              ` : ''}
            </div>
            <div class="profile-row-sub">
              <div class="profile-snippet ${snippetClass}">${snippetHtml}</div>
              ${pendingCount > 0 ? `<button type="button" class="badge-pending-count" data-pending-id="${p.id}" title="${pendingCount} pending task${pendingCount > 1 ? 's' : ''} · Click to review & check off">${pendingCount}</button>` : ''}
              ${isTimer ? `<span class="badge-timer-pill">${Icons.waiting(11)} ${formatRemainingShort(p.timerUntil - cur)}</span>` : ''}
              ${isReset ? `<button type="button" class="badge-reset-pill btn-ack-reset" data-reset-id="${p.id}" title="AI Limit Reset ready · Tap to acknowledge">${renderGreenWhiteOrb()}<span class="reset-pill-text">Reset</span></button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach profile avatar & note bubble click to open Messenger Note (Works on Laptop & iPhone)
    $$('.profile-avatar-wrap', list).forEach(wrap => {
      wrap.onclick = (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        const pid = wrap.dataset.pid;
        const prof = getProfile(pid);
        if (prof) promptMessengerNote(prof);
      };
      // iOS: intercept touchend at the avatar level so parent .profile-item touchend never fires openMobileChatWithSlide
      wrap.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }, { passive: false });
    });

    // Attach pending count badge click to open Mini Task Popover
    $$('.badge-pending-count', list).forEach(badge => {
      badge.onclick = (e) => {
        if (window.innerWidth <= 768) {
          // On mobile: 1 tap anywhere opens that profile's chat view!
          const pid = badge.dataset.pendingId;
          openMobileChatWithSlide(pid);
          return;
        }
        e.stopPropagation();
        const pid = badge.dataset.pendingId;
        const prof = getProfile(pid);
        if (prof) showPendingTasksPopover(prof, badge);
      };
    });

    // Attach interactive Pin click handlers
    $$('.pin-btn', list).forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const pid = btn.dataset.pinId;
        const prof = getProfile(pid);
        if (!prof) return;

        if (prof.isPinned) {
          prof.isPinned = false;
          prof.pinnedAt = null;
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          renderMainChat();
          showToast(`Returned ${prof.name} to ${prof.winShortcut}`);
        } else {
          prof.isPinned = true;
          prof.pinnedAt = now();
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          renderMainChat();
          list.scrollTo({ top: 0, behavior: 'smooth' });
          showToast(`Pinned ${prof.name} to top`);
        }
      };
    });

    // Attach Unread Dot toggle button click handlers
    $$('.unread-toggle-btn', list).forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const pid = btn.dataset.unreadId;
        const prof = getProfile(pid);
        if (!prof || !hasMessages(prof)) return;
        prof.isUnread = !prof.isUnread;
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(prof.isUnread ? `● Marked ${prof.name} as Unread` : `Cleared Unread mark on ${prof.name}`);
      };
    });

    // Attach Reset badge 1-tap acknowledge click handlers
    $$('.btn-ack-reset', list).forEach(btn => {
      const ackReset = (e) => {
        if (e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (e.cancelable) e.preventDefault();
        }
        const pid = btn.dataset.resetId;
        const prof = getProfile(pid);
        if (!prof) return;
        prof.isReset = false;
        prof.timerUntil = null;
        saveState();
        if (window.soundMgr) {
          if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
          else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
        }
        renderSidebar();
        renderMainChat();
        showToast(`✓ Acknowledged reset for ${prof.name}`);
      };
      btn.onclick = ackReset;
      btn.addEventListener('touchend', ackReset, { passive: false });
    });

    // Attach item click & fast touch (1-tap on iOS) handlers
    $$('.profile-item', list).forEach(item => {
      const handleSelect = (e) => {
        // Guard: never switch views if a note modal is open
        if (document.body.dataset.noteModalOpen === '1') return;
        if (item.dataset.justSwiped === '1') {
          item.dataset.justSwiped = '0';
          return;
        }
        if (e && e.target && (e.target.closest('.unread-toggle-btn') || e.target.closest('.profile-avatar-wrap') || e.target.closest('.badge-pending-count') || e.target.closest('.pin-btn') || e.target.closest('.badge-reset-pill'))) return;
        openMobileChatWithSlide(item.dataset.id);
      };

      item.onclick = handleSelect;

      // Fast iOS touch-release detection (bypasses 300ms delay & iOS hover double-tap)
      let tStartX = 0;
      let tStartY = 0;
      let tStartTime = 0;

      item.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          tStartX = e.touches[0].clientX;
          tStartY = e.touches[0].clientY;
          tStartTime = Date.now();
        }
      }, { passive: true });

      item.addEventListener('touchend', (e) => {
        // Guard: never switch views if a note modal is open (avatar was tapped)
        if (document.body.dataset.noteModalOpen === '1') return;
        if (e.changedTouches.length === 1 && tStartX > 0) {
          const dx = Math.abs(e.changedTouches[0].clientX - tStartX);
          const dy = Math.abs(e.changedTouches[0].clientY - tStartY);
          const dt = Date.now() - tStartTime;
          tStartX = 0;
          tStartY = 0;
          if (dx < 12 && dy < 12 && dt < 450) {
            if (window.innerWidth <= 768) {
              if (e.target && (e.target.closest('.unread-toggle-btn') || e.target.closest('.profile-avatar-wrap') || e.target.closest('.badge-pending-count') || e.target.closest('.pin-btn') || e.target.closest('.badge-reset-pill'))) return;
              openMobileChatWithSlide(item.dataset.id);
            }
          }
        }
      }, { passive: true });
      item.oncontextmenu = (e) => {
        const prof = getProfile(item.dataset.id);
        if (!prof || !hasMessages(prof)) return;
        e.preventDefault();
        prof.isUnread = !prof.isUnread;
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(prof.isUnread ? `● Marked ${prof.name} as Unread` : `Cleared Unread mark on ${prof.name}`);
      };
    });
  }

  // Render Right Main Chat & Notes Pane
  // Smart Date Grouping Helper (Today, Yesterday, Earlier)
  function getDateGroupKey(timestamp) {
    if (!timestamp) return 'Earlier';
    const noteDate = new Date(timestamp);
    const now = new Date();
    const noteDay = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate()).getTime();
    const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const diffDays = Math.round((todayDay - noteDay) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[noteDate.getDay()];
    }
    return noteDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: noteDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  }

  function renderMainChat() {
    // Guard: defer re-render while note modal is open to prevent iOS phantom dismissal
    if (document.body.dataset.noteModalOpen === '1') {
      if (!renderMainChat._deferred) {
        renderMainChat._deferred = true;
        const waitForClose = () => {
          if (document.body.dataset.noteModalOpen !== '1') {
            renderMainChat._deferred = false;
            renderMainChat();
          } else {
            setTimeout(waitForClose, 200);
          }
        };
        setTimeout(waitForClose, 200);
      }
      return;
    }
    const main = $('#chatMain');
    if (!main) return;

    // Preserve mobile profile dock scroll position before re-render
    const prevDockScroll = $('#mobileProfileDockScroll', main);
    if (prevDockScroll) {
      state.mobileDockScrollLeft = prevDockScroll.scrollLeft;
    }

    let p = getProfile(state.activeProfileId);
    if (!p) {
      p = state.profiles[0];
      if (p) state.activeProfileId = p.id;
    }
    if (!p) {
      main.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;">Select a profile to view messages</div>';
      return;
    }
    const cur = now();
    const isTimer = p.timerUntil && p.timerUntil > cur;
    const isReset = p.isReset;
    const rem = isTimer ? formatRemaining(p.timerUntil - cur) : '';
    const avatarSrc = getAvatarSrc(p);
    const statusNote = getActiveStatusNote(p);
    const notes = p.notes || [];
    const canUnread = hasMessages(p);
    const isUnread = !!(p.isUnread && canUnread);
    const w = state.wispr;

    main.innerHTML = `
      <!-- Header with Back to Profiles (Mobile), Enlarged Profile Picture, Profile Stepper & Actions -->
      <header class="chat-header" id="chatHeaderBar">
        <button type="button" class="btn-mobile-back" id="btnMobileBackToList" title="Back to All Profiles">
          <span class="back-chevron">‹</span>
          <span class="back-text">Profiles</span>
          ${(state.profiles.reduce((sum, pr) => sum + countPending(pr), 0)) > 0 ? `<span class="back-pending-badge">${state.profiles.reduce((sum, pr) => sum + countPending(pr), 0)}</span>` : ''}
        </button>

        <div class="chat-header-profile">
          <div class="chat-header-avatar-wrap" id="headerAvatarWrap" role="button" tabindex="0" title="${statusNote ? `💭 Active 24h Note: &quot;${esc(statusNote.text)}&quot; · Click to view or edit` : 'Click to share a 24h Note or upload photo'}">
            <img src="${avatarSrc}" class="chat-header-avatar" id="headerAvatarImg" alt="Profile Picture">
            ${statusNote ? `
              <div class="chat-header-note-bubble" id="headerNoteBubble" title="24h Note: ${esc(statusNote.text)} · Tap to edit or clear">
                <span>${esc(statusNote.text)}</span>
              </div>
            ` : `
              <div class="chat-header-note-prompt" id="headerNotePrompt" title="Tap to share a 24h Note">
                <span>💭+</span>
              </div>
            `}
            ${isUnread ? `<span class="header-avatar-unread-dot" title="Unread Dot"></span>` : ''}
            <div class="header-avatar-upload-badge" title="Click to upload new profile photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          <!-- Quick Prev / Next Profile Stepper Buttons -->
          <div class="header-profile-stepper" title="Tap to switch profiles (‹ previous / › next)">
            <button type="button" class="btn-step-profile" id="btnPrevProfile" title="Previous Chrome Profile">‹</button>
            <button type="button" class="btn-step-profile" id="btnNextProfile" title="Next Chrome Profile">›</button>
          </div>
          <div class="chat-header-mobile-title">
            <span class="mobile-header-name">${esc(p.name)}</span>
            <span class="mobile-header-slot">${esc(p.winShortcut || ('W+' + p.taskbarSlot))}</span>
          </div>
        </div>

        <div class="chat-header-actions-col">
          <div class="chat-header-actions">
            <button type="button" class="btn-header-action btn-header-undo ${historyMgr.canUndo() ? '' : 'disabled'}" id="btnUndoNote" title="Undo last message action (Ctrl+Z)" ${historyMgr.canUndo() ? '' : 'disabled'}>
              ${Icons.undo(13)} <span>Undo</span>
            </button>
            <button type="button" class="btn-header-action btn-header-redo ${historyMgr.canRedo() ? '' : 'disabled'}" id="btnRedoNote" title="Redo last message action (Ctrl+Y)" ${historyMgr.canRedo() ? '' : 'disabled'}>
              ${Icons.redo(13)} <span>Redo</span>
            </button>
            <button type="button" class="btn-header-action btn-header-trash" id="btnOpenTrashVault" title="Recently Deleted Vault (30-day restore)">
              ${Icons.trashVault(14)} <span>Trash</span>
              <span class="trash-badge-count" id="headerTrashCount" style="${(state.trash || []).length > 0 ? '' : 'display:none;'}">${(state.trash || []).length}</span>
            </button>
            ${IS_BLANK_EDITION ? `
              <button class="btn-header-action" id="btnAddSlotBlank" title="Add another taskbar Chrome profile slot">
                ➕ Add Profile
              </button>
            ` : ''}
            <button class="btn-header-action ${p.stickyNote ? 'sticky-active' : ''}" id="btnStickyNote" title="Set a permanent sticky header note for ${esc(p.name)}">
              ${Icons.important(13)} <span>${p.stickyNote ? 'Sticky' : 'Sticky Note'}</span>
            </button>
            ${canUnread ? `
              <button class="btn-header-action ${isUnread ? 'unread-active' : ''}" id="btnToggleUnreadHeader" title="Bookmark this profile as Unread (or right-click in sidebar)">
                ${Icons.unread(12)} <span>${isUnread ? 'Unread' : 'Mark Unread'}</span>
              </button>
            ` : ''}
            <button class="btn-header-action" id="btnRenameProfile">
              ${Icons.edit(13)} <span>Rename</span>
            </button>
          </div>

          <!-- 24-Hour Thought Note Banner (Placed DIRECTLY below the Trash, Sticky Note etc buttons on the right side!) -->
          ${statusNote ? `
            <div class="profile-status-note-banner header-status-note-sub" id="profileStatusNoteBanner" role="button" tabindex="0" title="Active 24h Note: &quot;${esc(statusNote.text)}&quot; · Click to view, edit or clear">
              <span class="status-note-remaining">${Icons.waiting(11)} ${formatRemainingNoteTime(statusNote.expiresAt - cur)}</span>
            </div>
          ` : ''}
        </div>
      </header>

      <!-- Clean Blank Edition Laptop Taskbar Auto-Discovery Banner -->
      ${IS_BLANK_EDITION ? `
        <div class="blank-scanner-banner">
          <div class="blank-scanner-info">
            <strong>💻 Clean Blank Edition · Laptop Taskbar Sync:</strong>
            <span>Auto-detect and load the Chrome profiles of this laptop in 1 click.</span>
          </div>
          <div class="blank-scanner-actions">
            <button type="button" class="btn-scanner-action primary" id="btnSelectLocalState" title="Select %LOCALAPPDATA%\Google\Chrome\User Data\Local State to import all Chrome profiles">
              📂 Load Chrome "Local State" (Zero Warnings)
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Enhancement #2: Permanent Sticky Header Note Banner (When Set) -->
      ${p.stickyNote ? `
        <div class="profile-sticky-banner" id="profileStickyBanner">
          <div class="sticky-banner-left">
            <span class="sticky-pin-tag">
              ${Icons.important(13)}
              <span>STICKY</span>
            </span>
            <span class="sticky-banner-text">${linkifyText(p.stickyNote)}</span>
          </div>
          <div class="sticky-banner-actions">
            <button type="button" class="btn-sticky-mini" id="btnEditStickyInline" title="Edit sticky note">
              ${Icons.edit(12)} <span>Edit</span>
            </button>
            <button type="button" class="btn-sticky-mini btn-sticky-clear" id="btnClearStickyInline" title="Remove sticky note">✕</button>
          </div>
        </div>
      ` : ''}

      <!-- Quick AI Limit Cooldown Bar (Minimized & Responsive, 1d and 2d removed) -->
      <div class="quick-timer-bar">
        <span class="timer-bar-label">Start a quick timer:</span>
        <button class="timer-chip" data-min="15" data-label="15m">15m</button>
        <button class="timer-chip" data-min="30" data-label="30m">30m</button>
        <button class="timer-chip" data-min="45" data-label="45m">45m</button>
        <button class="timer-chip" data-min="60" data-label="1h">1h</button>
        <button class="timer-chip" data-min="120" data-label="2h">2h</button>
        <button class="timer-chip" data-min="180" data-label="3h">3h</button>
        <button class="timer-chip" data-min="300" data-label="5h">5h</button>
        <button class="timer-chip" data-min="720" data-label="12h">12h</button>

        <div class="timer-custom-wrap">
          <input type="number" id="customMinInput" class="timer-custom-input" placeholder="min" min="1" max="10000" inputmode="numeric" pattern="[0-9]*" value="">
          <button class="btn-start-custom" id="btnStartCustomTimer">Start <span style="display:inline-flex; vertical-align:middle; margin-left:3px;">${Icons.timer(12)}</span></button>
        </div>
      </div>

      <!-- Active Timer Countdown Banner -->
      ${isTimer ? `
        <div class="timer-active-banner">
          <span><span style="display:inline-flex; vertical-align:middle; margin-right:4px;">${Icons.waiting(13)}</span> Cooldown Active: <strong>${rem}</strong> remaining</span>
          <button class="btn-banner-clear" id="btnClearTimer">✕ Clear Timer</button>
        </div>
      ` : ''}

      <!-- Reset Limit Banner (Small Green & White Radiant Gradient) -->
      ${isReset ? `
        <div class="timer-reset-banner">
          <span class="reset-banner-row">${renderGreenWhiteOrb()}<span class="reset-banner-text">AI Limit Reset! Your credits &amp; quota are ready for work.</span></span>
          <button class="btn-banner-reset" id="btnDismissReset">✓ Acknowledge</button>
        </div>
      ` : ''}

      <!-- Notes Stream (Pure OLED Black Blank Space When Empty) -->
      <div class="notes-stream" id="notesStream">
        ${!notes.length ? '' : notes.map((n, nIdx) => {
          const isEditing = state.editingNoteId === n.id;
          const prevNote = nIdx > 0 ? notes[nIdx - 1] : null;
          const prevDateKey = prevNote ? getDateGroupKey(prevNote.createdAt) : null;
          const currentDateKey = getDateGroupKey(n.createdAt);
          const showDivider = currentDateKey !== prevDateKey;
          const reactions = Array.isArray(n.reactions) ? n.reactions : [];
          const subItems = Array.isArray(n.subItems) ? n.subItems : [];

          return `
          ${showDivider ? `
            <div class="chat-date-divider" data-date="${esc(currentDateKey)}">
              <span class="chat-date-pill">${esc(currentDateKey)}</span>
            </div>
          ` : ''}
          <div class="note-item-wrap" data-nid="${n.id}" id="noteCard_${n.id}">
            <div class="note-swipe-indicator left-ind"><span>${n.done ? '↩ Reopen' : '✓ Done'}</span></div>
            <div class="note-swipe-indicator right-ind"><span>🗑️ Delete</span></div>
            <div class="note-bubble ${n.done ? 'done' : ''} ${isEditing ? 'editing' : ''}">
              <div class="note-body-col">
                ${n.forwardedFrom ? `
                  <div class="note-forwarded-tag">↪ Forwarded from <strong>${esc(n.forwardedFrom)}</strong></div>
                ` : ''}

                ${n.image ? `
                  <div class="note-media-wrap">
                    <img src="${n.image}" class="note-media-img" data-action="open-lightbox" data-nid="${n.id}" alt="Attached screenshot" title="Click to view full screen">
                  </div>
                ` : ''}

                ${n.voiceClip ? `
                  <div class="note-voice-wrap">
                    <span class="voice-badge">🎙️ Voice Note</span>
                    <audio controls src="${n.voiceClip}" class="note-audio-player"></audio>
                  </div>
                ` : ''}

                ${isEditing ? `
                  <div class="note-inline-editor">
                    <input type="text" class="note-inline-edit-input" id="inlineEditInput_${n.id}" value="${esc(n.text)}">
                    <button type="button" class="btn-inline-save" data-action="save-edit" data-nid="${n.id}">Save ✓</button>
                    <button type="button" class="btn-inline-cancel" data-action="cancel-edit" data-nid="${n.id}">Cancel</button>
                  </div>
                ` : (n.text ? `
                  <div class="note-text" data-action="dblclick-edit" data-nid="${n.id}" title="Double-click to edit inline">${linkifyText(n.text)}</div>
                ` : '')}

                <!-- Interactive Sub-Checklists Inside Message Bubble -->
                ${subItems.length > 0 ? `
                  <div class="note-subchecklist">
                    ${subItems.map(sub => `
                      <label class="subcheck-row ${sub.done ? 'sub-done' : ''}" data-action="toggle-subitem" data-nid="${n.id}" data-subid="${sub.id}">
                        <input type="checkbox" ${sub.done ? 'checked' : ''} tabindex="-1">
                        <span class="subcheck-text">${linkifyText(sub.text)}</span>
                        <button type="button" class="btn-subcheck-del" data-action="del-subitem" data-nid="${n.id}" data-subid="${sub.id}" title="Remove item">✕</button>
                      </label>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- All 10 Actions & Status Reactions in Exactly Three Rows on Far Right -->
              <div class="note-bubble-actions" title="Actions &amp; Priority">
                <!-- Row 1: Priority Status Reactions (4 items) -->
                <div class="note-actions-row note-actions-row-status" title="Priority status tags">
                  ${REACTIONS_LIST.map(r => `
                    <button type="button" class="react-inline-btn ${reactions.includes(r.key) ? 'active' : ''}" data-action="toggle-reaction" data-nid="${n.id}" data-rkey="${r.key}" title="Toggle ${esc(r.label)}">
                      ${r.icon}
                    </button>
                  `).join('')}
                </div>

                <!-- Row 2: Primary Task Operations (3 items) -->
                <div class="note-actions-row note-actions-row-primary">
                  ${n.done ? `
                    <button type="button" class="btn-note-micro btn-note-reopen" data-action="toggle-done" data-nid="${n.id}" title="Reopen task">${Icons.undo(12)}</button>
                  ` : `
                    <button type="button" class="btn-note-micro btn-note-done" data-action="toggle-done" data-nid="${n.id}" title="Mark Done">${Icons.check(12)}</button>
                  `}
                  <button type="button" class="btn-note-micro" data-action="copy-note" data-nid="${n.id}" title="Copy note text">${Icons.copy(12)}</button>
                  <button type="button" class="btn-note-micro" data-action="add-subitem" data-nid="${n.id}" title="Add checkable sub-item">${Icons.checklist(12)}</button>
                </div>

                <!-- Row 3: Management & Utility Actions (3 items) -->
                <div class="note-actions-row note-actions-row-util">
                  <button type="button" class="btn-note-micro" data-action="start-edit" data-nid="${n.id}" title="Edit message inline">${Icons.edit(12)}</button>
                  <button type="button" class="btn-note-micro btn-note-forward" data-action="forward-note" data-nid="${n.id}" title="Forward task to another profile">${Icons.forward(12)}</button>
                  <button type="button" class="btn-note-micro btn-note-delete" data-action="delete-note" data-nid="${n.id}" title="Delete note">${Icons.delete(12)}</button>
                </div>
              </div>
            </div>
            <div class="note-timestamp">
              ${formatNoteDateTime(n.createdAt)} · ${n.done ? 'Completed' : 'Pending'}
              ${n.editedAt ? ` · <span class="note-edited-label">(edited ${formatNoteDateTime(n.editedAt)})</span>` : ''}
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <!-- Pending Screenshot / Voice Clip Attachment Preview Strip -->
      ${(state.pendingAttachment || state.pendingVoiceClip) ? `
        <div class="attachment-preview-bar" id="attachmentPreviewBar">
          ${state.pendingAttachment ? `
            <div class="attach-thumb-box">
              <img src="${state.pendingAttachment}" class="attach-thumb-img" alt="Preview">
              <span class="attach-thumb-label">📸 Screenshot ready to send</span>
              <button type="button" class="btn-remove-attach" id="btnRemoveScreenshot" title="Remove screenshot">✕</button>
            </div>
          ` : ''}
          ${state.pendingVoiceClip ? `
            <div class="attach-thumb-box">
              <span class="attach-thumb-label">🎙️ Voice Memo clip attached</span>
              <audio controls src="${state.pendingVoiceClip}" class="attach-mini-audio"></audio>
              <button type="button" class="btn-remove-attach" id="btnRemoveVoiceClip" title="Remove voice clip">✕</button>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 🎙️ WISPR FLOW PRO Studio & Command Bar -->
      ${(w.panelOpen || w.isListening) ? `
        <div class="wispr-flow-bar ${w.isListening ? 'listening' : ''}" id="wisprFlowBar">
          <div class="wispr-top-row">
            <div class="wispr-brand-cluster">
              <span class="wispr-pro-badge">🎙️ WISPR FLOW PRO</span>
              <span class="wispr-status-pill" id="wisprStatusPill">
                ${w.isListening ? '🔴 LIVE DICTATION · UNLIMITED WORDS' : '⚡ READY · ALT+SPACE OR CLICK MIC'}
              </span>
            </div>

            <!-- Live Soundwave Frequency Bars -->
            <div class="wispr-waveform" id="wisprWaveform">
              ${Array.from({ length: 14 }).map((_, i) => `<span class="wispr-bar" style="height:${w.isListening ? (6 + (i % 4) * 4) : 4}px"></span>`).join('')}
            </div>

            <div class="wispr-metrics" id="wisprMetrics">
              <span><strong>${w.sessionWords}</strong> words</span>
              <span>·</span>
              <span id="wisprDurationLabel">Unlimited Flow</span>
            </div>
          </div>

          <div class="wispr-controls-row">
            <!-- Personalized Writing Style Selector -->
            <div class="wispr-control-group">
              <span class="wispr-ctrl-label">Style:</span>
              <button type="button" class="wispr-style-chip ${w.style === 'polish' ? 'active' : ''}" data-wstyle="polish" title="Removes filler words (um, uh) and auto-punctuates">✨ Auto-Polish</button>
              <button type="button" class="wispr-style-chip ${w.style === 'academic' ? 'active' : ''}" data-wstyle="academic" title="Formal DepEd &amp; scholarly capitalization">🎓 Academic / DepEd</button>
              <button type="button" class="wispr-style-chip ${w.style === 'action' ? 'active' : ''}" data-wstyle="action" title="Crisp imperative action-task formatting">⚡ Action Task</button>
              <button type="button" class="wispr-style-chip ${w.style === 'raw' ? 'active' : ''}" data-wstyle="raw" title="Exact verbatim speech">💬 Raw</button>
            </div>

            <!-- Command Mode, Auto-Send, Voice Memo & Personal Dictionary -->
            <div class="wispr-toggles-group">
              <button type="button" class="wispr-toggle-pill ${w.commandMode ? 'on' : ''}" id="btnWisprCommandMode" title="Say 'send note', 'pin profile', 'mark urgent', 'start timer 30 minutes', 'scratch that'">
                🗣️ Command Mode: ${w.commandMode ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-toggle-pill ${w.autoSend ? 'on' : ''}" id="btnWisprAutoSend" title="Automatically add note when you stop speaking">
                ⚡ Auto-Add: ${w.autoSend ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-toggle-pill ${w.recordAudioClip ? 'on' : ''}" id="btnWisprRecordClip" title="Also attach a playable audio recording to the note">
                🔊 Voice Memo: ${w.recordAudioClip ? 'ON' : 'OFF'}
              </button>
              <button type="button" class="wispr-dict-btn" id="btnWisprDict" title="Personal Writing Style Dictionary (${w.dictionary.length} custom terms)">
                📚 + Teach Word (${w.dictionary.length})
              </button>
            </div>
          </div>

          <div class="wispr-live-preview" id="wisprLivePreview">
            ${w.interimText
              ? `<span class="wispr-interim-stream">🗣️ "${esc(w.interimText)}"</span>`
              : `<span class="wispr-cmd-hint">💡 Voice Commands: Say <em>"send note"</em>, <em>"mark urgent"</em>, <em>"pin profile"</em>, <em>"start timer 30 minutes"</em>, <em>"forward task"</em>, or <em>"scratch that"</em>.</span>`}
          </div>
        </div>
      ` : ''}

      <!-- Mobile Thumb-Zone Quick Action Bar (iPhone 1-Hand Reachability) -->
      <div class="mobile-thumb-actions" id="mobileThumbActions">
        <button type="button" class="btn-thumb-action ${historyMgr.canUndo() ? '' : 'disabled'}" id="btnThumbUndo" title="Undo last action" ${historyMgr.canUndo() ? '' : 'disabled'}>
          ${Icons.undo(12)} <span>Undo</span>
        </button>
        <button type="button" class="btn-thumb-action" id="btnThumbTrash" title="Recently Deleted Vault (30-day restore)">
          ${Icons.trashVault(13)} <span>Trash</span>
          ${(state.trash || []).length > 0 ? `<span class="thumb-badge">${(state.trash || []).length}</span>` : ''}
        </button>
        <button type="button" class="btn-thumb-action ${p.stickyNote ? 'active' : ''}" id="btnThumbSticky" title="Sticky note for ${esc(p.name)}">
          ${Icons.important(12)} <span>${p.stickyNote ? 'Sticky' : '+ Sticky'}</span>
        </button>
        <button type="button" class="btn-thumb-action" id="btnThumbShareNote" title="24-Hour Note for ${esc(p.name)}">
          ${Icons.note(12)} <span>24h Note</span>
        </button>
      </div>

      <!-- Enhancement #1: 1-Click Quick-Task Templates Bar -->
      <div class="quick-templates-bar">
        <span class="templates-label">Quick task:</span>
        <div class="templates-chips-scroll">
          ${state.quickTemplates.map((tpl, idx) => `
            <button type="button" class="template-chip" data-tpl="${esc(tpl)}" data-tidx="${idx}" title="Click to add immediately · Shift+Click to insert in input · Right-click to remove">
              ${esc(tpl)}
            </button>
          `).join('')}
        </div>
        <button type="button" class="btn-add-template" id="btnManageTemplates" title="Add a custom 1-click quick task template">+ Template</button>
      </div>

      <!-- Composer Bar (Bottom) -->
      <div class="composer-bar">
        <button type="button" class="btn-composer-tool" id="btnAttachImage" title="Upload or attach screenshot (or press Ctrl+V)">
          📷
        </button>

        <div class="composer-input-wrap">
          <span class="composer-icon">💬</span>
          <input type="text" id="composerInput" class="composer-input" placeholder="Type, paste screenshot (Ctrl+V), or dictate for ${esc(p.name)}...">
        </div>

        <button type="button" class="btn-wispr-mic ${w.isListening ? 'listening' : ''}" id="btnWisprMic" title="Start/Stop Wispr Flow Pro Voice Dictation (Alt + Space)">
          <span class="mic-icon">${w.isListening ? '⏹️' : '🎙️'}</span>
          <span class="mic-label">${w.isListening ? 'Listening...' : 'Dictate'}</span>
        </button>

        <button type="button" class="btn-wispr-studio ${w.panelOpen ? 'active' : ''}" id="btnToggleFlowBar" title="Toggle Wispr Flow Pro Studio &amp; Voice Commands">
          ✨ Flow Pro
        </button>

        <button class="btn-composer-send" id="btnSendNote">Add ✓</button>
      </div>
    `;

    // Focus inline edit input if active
    if (state.editingNoteId) {
      const editInp = $(`#inlineEditInput_${state.editingNoteId}`, main);
      if (editInp) {
        editInp.focus();
        editInp.select();
        editInp.onkeydown = (e) => {
          if (e.key === 'Enter') saveInlineEdit(p, state.editingNoteId, editInp.value);
          if (e.key === 'Escape') {
            state.editingNoteId = null;
            renderMainChat();
          }
        };
      }
    }

    // Hook up interactive handlers
    // 0. Mobile Back to Profiles List button & Always-Visible Quick-Tap Profile Dock
    const btnMobileBack = $('#btnMobileBackToList');
    if (btnMobileBack) {
      btnMobileBack.onclick = () => closeMobileChatWithSlide();
    }
    const btnDockList = $('#btnDockAllList', main);
    if (btnDockList) {
      btnDockList.onclick = () => closeMobileChatWithSlide();
    }
    const dockScroll = $('#mobileProfileDockScroll', main);
    if (dockScroll) {
      if (typeof state.mobileDockScrollLeft === 'number') {
        dockScroll.scrollLeft = state.mobileDockScrollLeft;
      }
      const activeDockBtn = $(`.mobile-dock-item[data-dock-pid="${p.id}"]`, dockScroll);
      if (activeDockBtn) {
        requestAnimationFrame(() => {
          try {
            activeDockBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
          } catch (e) {}
        });
      }
      $$('.mobile-dock-item', dockScroll).forEach(btn => {
        btn.onclick = () => {
          const targetId = btn.dataset.dockPid;
          if (!targetId) return;
          state.mobileDockScrollLeft = dockScroll.scrollLeft;
          openMobileChatWithSlide(targetId);
          if (window.soundMgr) window.soundMgr.playClick();
        };
      });
    }

    // 0b. Header Prev / Next Profile Paging Buttons
    const btnPrevProf = $('#btnPrevProfile', main);
    if (btnPrevProf) btnPrevProf.onclick = () => stepProfile(-1);
    const btnNextProf = $('#btnNextProfile', main);
    if (btnNextProf) btnNextProf.onclick = () => stepProfile(1);

    // 1. Right Header Avatar: Click to change profile picture manually via file picker
    const headerAvatarWrap = $('#headerAvatarWrap');
    if (headerAvatarWrap) {
      headerAvatarWrap.onclick = (e) => {
        if (e && e.target && (e.target.closest('#headerNoteBubble') || e.target.closest('#headerNotePrompt'))) return;
        e.stopPropagation();
        if (window.soundMgr) {
          if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
          else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
        }
        state.uploadTargetId = p.id;
        const photoInput = $('#globalPhotoInput');
        if (photoInput) {
          photoInput.value = ''; // Reset so same file can be re-selected if desired
          photoInput.click();
        }
      };
      headerAvatarWrap.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          headerAvatarWrap.click();
        }
      };
    }
    const btnShareNote = $('#btnShareNoteHeader');
    if (btnShareNote) btnShareNote.onclick = () => promptMessengerNote(p);
    const btnMessengerNote = $('#btnMessengerNote');
    if (btnMessengerNote) btnMessengerNote.onclick = () => promptMessengerNote(p);

    const headerNoteBubble = $('#headerNoteBubble');
    if (headerNoteBubble) headerNoteBubble.onclick = (e) => { e.stopPropagation(); promptMessengerNote(p); };

    const headerNotePrompt = $('#headerNotePrompt');
    if (headerNotePrompt) headerNotePrompt.onclick = (e) => { e.stopPropagation(); promptMessengerNote(p); };

    const btnEditStatusNote = $('#btnEditStatusNoteInline');
    if (btnEditStatusNote) btnEditStatusNote.onclick = () => promptMessengerNote(p);

    const profileStatusNoteBanner = $('#profileStatusNoteBanner');
    if (profileStatusNoteBanner) profileStatusNoteBanner.onclick = () => promptMessengerNote(p);

    // 1b. Toggle Unread from header
    const unreadHeaderBtn = $('#btnToggleUnreadHeader');
    if (unreadHeaderBtn) {
      unreadHeaderBtn.onclick = () => {
        if (!hasMessages(p)) return;
        p.isUnread = !p.isUnread;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(p.isUnread ? `● Marked ${p.name} as Unread` : `Cleared Unread mark on ${p.name}`);
      };
    }

    // 1c. Sticky Note Header Button & Banner Controls
    const btnSticky = $('#btnStickyNote');
    if (btnSticky) btnSticky.onclick = () => promptStickyNote(p);
    const btnEditSticky = $('#btnEditStickyInline');
    if (btnEditSticky) btnEditSticky.onclick = () => promptStickyNote(p);
    const btnClearSticky = $('#btnClearStickyInline');
    if (btnClearSticky) {
      btnClearSticky.onclick = () => {
        p.stickyNote = '';
        saveState();
        renderMainChat();
        showToast(`Cleared sticky note on ${p.name}`);
      };
    }

    // 1d. Blank Edition controls
    const btnAddSlotBlank = $('#btnAddSlotBlank');
    if (btnAddSlotBlank) {
      btnAddSlotBlank.onclick = () => {
        const nextNum = state.profiles.length + 1;
        const newProf = {
          id: `b_slot_${uid()}`,
          profileDir: `Profile ${nextNum}`,
          chromeNo: nextNum,
          taskbarSlot: nextNum,
          winShortcut: nextNum <= 9 ? `Win + ${nextNum}` : `Slot #${nextNum}`,
          name: `Chrome Profile #${nextNum}`,
          email: `Taskbar Slot #${nextNum}`,
          gaia: '',
          timerUntil: null,
          timerDurationMs: null,
          isReset: false,
          isPinned: false,
          pinnedAt: null,
          isUnread: false,
          stickyNote: '',
          customAvatar: null,
          notes: []
        };
        state.profiles.push(newProf);
        state.activeProfileId = newProf.id;
        saveState();
        renderSidebar();
        renderMainChat();
        promptRename(newProf);
      };
    }
    const btnSelectLocalState = $('#btnSelectLocalState');
    if (btnSelectLocalState) {
      btnSelectLocalState.onclick = () => $('#localStateFileInput').click();
    }
    const btnDownloadScanner = $('#btnDownloadTaskbarScanner');
    if (btnDownloadScanner) {
      btnDownloadScanner.onclick = () => downloadLaptopTaskbarScannerCmd();
    }

    // 1e. Undo & Redo Header Controls
    const btnUndo = $('#btnUndoNote');
    if (btnUndo) {
      btnUndo.onclick = () => {
        historyMgr.undo();
      };
    }
    const btnRedo = $('#btnRedoNote');
    if (btnRedo) {
      btnRedo.onclick = () => {
        historyMgr.redo();
      };
    }

    // 2. Rename profile
    const btnTrashVault = $('#btnOpenTrashVault');
    if (btnTrashVault) btnTrashVault.onclick = () => openTrashVaultModal();

    const renameBtn = $('#btnRenameProfile');
    if (renameBtn) {
      renameBtn.onclick = () => promptRename(p);
    }

    // 3. Quick Timer Chips
    $$('.timer-chip', main).forEach(chip => {
      chip.onclick = () => {
        const mins = parseInt(chip.dataset.min, 10);
        startCooldown(p, mins, chip.dataset.label || `${mins}m`);
      };
    });

    // 4. Custom Timer
    const customStart = $('#btnStartCustomTimer');
    const customInput = $('#customMinInput');
    const triggerCustomTimer = (e) => {
      if (e) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
      }
      const rawVal = customInput ? customInput.value.trim() : '';
      const mins = parseInt(rawVal, 10);
      if (isNaN(mins) || mins <= 0) {
        showToast('⏱️ Enter a positive number of minutes (e.g. 1)');
        if (customInput) customInput.focus();
        return;
      }
      startCooldown(p, mins, `${mins}m`);
    };
    if (customStart) {
      customStart.onclick = triggerCustomTimer;
      customStart.addEventListener('touchend', (e) => {
        triggerCustomTimer(e);
      }, { passive: false });
    }
    if (customInput) {
      customInput.onkeydown = (e) => {
        if (e.key === 'Enter') triggerCustomTimer(e);
      };
    }

    // 5. Clear timer
    const clearBtn = $('#btnClearTimer');
    if (clearBtn) {
      clearBtn.onclick = () => {
        p.timerUntil = null;
        p.timerDurationMs = null;
        p.isReset = false;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Cleared cooldown timer for ${p.name}`);
      };
    }

    // 6. Dismiss / Acknowledge reset
    const resetBtn = $('#btnDismissReset');
    if (resetBtn) {
      const handleAck = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.cancelable) e.preventDefault();
        }
        p.isReset = false;
        p.timerUntil = null;
        saveState();
        if (window.soundMgr) {
          if (typeof window.soundMgr.playClickSoft === 'function') window.soundMgr.playClickSoft();
          else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
        }
        renderSidebar();
        renderMainChat();
        showToast(`✓ Acknowledged reset for ${p.name}`);
      };
      resetBtn.onclick = handleAck;
      resetBtn.addEventListener('touchend', handleAck, { passive: false });
    }

    // 7. Note actions (Done, Copy, Checklist, Edit, Forward, Reactions, Lightbox, Delete)
    $$('.notes-stream [data-action]', main).forEach(el => {
      const act = el.dataset.action;
      const nid = el.dataset.nid;

      if (act === 'dblclick-edit') {
        el.ondblclick = () => {
          state.editingNoteId = nid;
          renderMainChat();
        };
        return;
      }

      const executeAction = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.cancelable) e.preventDefault();
        }
        const note = (p.notes || []).find(n => n.id === nid);
        if (!note) return;

        if (act === 'toggle-done') {
          note.done = !note.done;
          triggerHaptic('success');
          if (note.done && window.soundMgr) window.soundMgr.playReadyChime();
          if (countPending(p) === 0) {
            p.isPinned = false;
            p.pinnedAt = null;
          }
          saveState();
          renderSidebar();
          renderMainChat();
        } else if (act === 'copy-note') {
          triggerHaptic('light');
          navigator.clipboard.writeText(note.text || '').then(() => {
            showToast('📋 Copied message to clipboard!');
          }).catch(() => {});
        } else if (act === 'add-subitem') {
          triggerHaptic('light');
          promptAddChecklistItem(p, note);
        } else if (act === 'toggle-subitem') {
          triggerHaptic('light');
          const subid = el.dataset.subid;
          const sub = (note.subItems || []).find(s => s.id === subid);
          if (sub) {
            sub.done = !sub.done;
            saveState();
            renderMainChat();
          }
        } else if (act === 'del-subitem') {
          triggerHaptic('medium');
          const subid = el.dataset.subid;
          note.subItems = (note.subItems || []).filter(s => s.id !== subid);
          saveState();
          renderMainChat();
        } else if (act === 'delete-note') {
          triggerHaptic('medium');
          const noteIdx = (p.notes || []).findIndex(n => n.id === nid);
          if (noteIdx !== -1) {
            const deletedNote = JSON.parse(JSON.stringify(p.notes[noteIdx]));
            addToTrash(deletedNote, p);
            historyMgr.record({
              type: 'DELETE_NOTE',
              profileId: p.id,
              note: deletedNote,
              index: noteIdx
            });
            p.notes.splice(noteIdx, 1);
            if (countPending(p) === 0) {
              p.isPinned = false;
              p.pinnedAt = null;
            }
            if (!hasMessages(p)) {
              p.isUnread = false;
            }
            saveState();
            renderSidebar();

            // Suggestion #5: Inline Ghost Card morph instead of abrupt vanishing
            const cardEl = $(`#noteCard_${nid}`);
            if (cardEl) {
              cardEl.classList.add('note-ghost-mode');
              cardEl.innerHTML = `
                <div class="ghost-card-content">
                  <div class="ghost-info">
                    ${Icons.delete(13)}
                    <span>Note deleted <em>("${esc((deletedNote.text || 'Message').slice(0, 32))}")</em></span>
                  </div>
                  <button type="button" class="btn-ghost-undo" data-nid="${nid}">
                    ${Icons.undo(12)} <span>Tap to Undo</span>
                  </button>
                </div>
              `;
              const btnGhostUndo = cardEl.querySelector('.btn-ghost-undo');
              if (btnGhostUndo) {
                btnGhostUndo.onclick = (ev) => {
                  ev.stopPropagation();
                  historyMgr.undo();
                };
              }
              setTimeout(() => {
                if (cardEl && cardEl.classList.contains('note-ghost-mode')) {
                  cardEl.classList.add('ghost-collapsing');
                  setTimeout(() => {
                    if (cardEl.parentNode) cardEl.parentNode.removeChild(cardEl);
                  }, 200);
                }
              }, 2000);
            } else {
              renderMainChat();
            }

            showActionToast({
              message: '🗑️ Deleted note',
              actionText: '↺ Undo',
              duration: 2000,
              onAction: () => {
                historyMgr.undo();
              }
            });
          }
        } else if (act === 'start-edit') {
          state.editingNoteId = nid;
          renderMainChat();
        } else if (act === 'save-edit') {
          const inp = $(`#inlineEditInput_${nid}`, main);
          if (inp) saveInlineEdit(p, nid, inp.value);
        } else if (act === 'cancel-edit') {
          state.editingNoteId = null;
          renderMainChat();
        } else if (act === 'toggle-reaction') {
          const rkey = el.dataset.rkey;
          if (!Array.isArray(note.reactions)) note.reactions = [];
          if (note.reactions.includes(rkey)) {
            note.reactions = note.reactions.filter(k => k !== rkey);
          } else {
            note.reactions.push(rkey);
          }
          saveState();
          if (window.soundMgr) window.soundMgr.playClick();
          renderSidebar();
          renderMainChat();
        } else if (act === 'forward-note') {
          openForwardModal(p, note);
        } else if (act === 'open-lightbox') {
          openLightboxModal(note.image, note.text || p.name);
        }
      };

      // Fast, responsive 1-tap on touchscreens (avoids iOS 300ms delay & double-tap hover)
      let touched = false;
      el.addEventListener('touchend', (e) => {
        touched = true;
        executeAction(e);
        setTimeout(() => { touched = false; }, 400);
      }, { passive: false });

      el.onclick = (e) => {
        if (touched) return;
        executeAction(e);
      };
    });

    // 7b. Quick-Task Template Chips
    $$('.template-chip', main).forEach(chip => {
      chip.onclick = (e) => {
        const tplText = chip.dataset.tpl;
        if (!tplText) return;
        const inp = $('#composerInput');
        if (e.shiftKey && inp) {
          inp.value = inp.value ? `${inp.value.trim()} ${tplText}` : tplText;
          inp.focus();
          return;
        }
        if (!p.notes) p.notes = [];
        p.notes.push({
          id: uid(),
          text: tplText,
          image: null,
          voiceClip: null,
          reactions: [],
          subItems: [],
          createdAt: now(),
          editedAt: null,
          forwardedFrom: null,
          done: false
        });
        saveState();
        if (window.soundMgr) window.soundMgr.playClick();
        renderSidebar();
        renderMainChat();
        showToast(`⚡ Added "${tplText}" to ${p.name}`);
      };
      chip.oncontextmenu = (e) => {
        e.preventDefault();
        const idx = parseInt(chip.dataset.tidx, 10);
        if (!isNaN(idx)) {
          const removed = state.quickTemplates.splice(idx, 1);
          saveTemplates();
          renderMainChat();
          showToast(`Removed template "${removed[0]}"`);
        }
      };
    });

    const btnManageTpl = $('#btnManageTemplates');
    if (btnManageTpl) {
      btnManageTpl.onclick = () => promptAddTemplate();
    }

    // 8. Screenshot attachment button & preview removal
    const btnAttach = $('#btnAttachImage');
    if (btnAttach) {
      btnAttach.onclick = () => $('#noteImageInput').click();
    }
    const btnRemImg = $('#btnRemoveScreenshot');
    if (btnRemImg) {
      btnRemImg.onclick = () => {
        state.pendingAttachment = null;
        renderMainChat();
      };
    }
    const btnRemVoice = $('#btnRemoveVoiceClip');
    if (btnRemVoice) {
      btnRemVoice.onclick = () => {
        state.pendingVoiceClip = null;
        renderMainChat();
      };
    }

    // Drag and drop screenshots onto notesStream
    const streamEl = $('#notesStream');
    if (streamEl) {
      streamEl.ondragover = (e) => {
        e.preventDefault();
        streamEl.classList.add('drag-over');
      };
      streamEl.ondragleave = () => streamEl.classList.remove('drag-over');
      streamEl.ondrop = async (e) => {
        e.preventDefault();
        streamEl.classList.remove('drag-over');
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
          if (imgFile) {
            const dataUrl = await compressImage(imgFile);
            state.pendingAttachment = dataUrl;
            renderMainChat();
            showToast('📸 Screenshot attached — press Enter or Add ✓ to post!');
          }
        }
      };
    }

    // 9. Wispr Flow Pro controls
    const btnMic = $('#btnWisprMic');
    if (btnMic) {
      btnMic.onclick = () => toggleWisprDictation();
    }
    const btnFlowBar = $('#btnToggleFlowBar');
    if (btnFlowBar) {
      btnFlowBar.onclick = () => {
        state.wispr.panelOpen = !state.wispr.panelOpen;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    $$('.wispr-style-chip', main).forEach(chip => {
      chip.onclick = () => {
        state.wispr.style = chip.dataset.wstyle;
        saveWisprPrefs();
        renderMainChat();
        showToast(`✨ Wispr Writing Style: ${chip.textContent.trim()}`);
      };
    });
    const btnCmdMode = $('#btnWisprCommandMode');
    if (btnCmdMode) {
      btnCmdMode.onclick = () => {
        state.wispr.commandMode = !state.wispr.commandMode;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnAutoSend = $('#btnWisprAutoSend');
    if (btnAutoSend) {
      btnAutoSend.onclick = () => {
        state.wispr.autoSend = !state.wispr.autoSend;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnRecClip = $('#btnWisprRecordClip');
    if (btnRecClip) {
      btnRecClip.onclick = () => {
        state.wispr.recordAudioClip = !state.wispr.recordAudioClip;
        saveWisprPrefs();
        renderMainChat();
      };
    }
    const btnDict = $('#btnWisprDict');
    if (btnDict) {
      btnDict.onclick = () => openWisprDictionaryModal();
    }

    // 10. Add note
    const input = $('#composerInput');
    const sendBtn = $('#btnSendNote');
    const handleAdd = () => {
      const text = input ? input.value.trim() : '';
      if (!text && !state.pendingAttachment && !state.pendingVoiceClip) return;
      if (!p.notes) p.notes = [];

      const initialReactions = [];
      if (state.pendingReactionTag) {
        initialReactions.push(state.pendingReactionTag);
        state.pendingReactionTag = null;
      }

      const newCreatedNote = {
        id: uid(),
        text,
        image: state.pendingAttachment || null,
        voiceClip: state.pendingVoiceClip || null,
        reactions: initialReactions,
        subItems: [],
        createdAt: now(),
        editedAt: null,
        forwardedFrom: null,
        done: false
      };
      p.notes.push(newCreatedNote);
      historyMgr.record({
        type: 'ADD_NOTE',
        profileId: p.id,
        note: JSON.parse(JSON.stringify(newCreatedNote))
      });

      if (input) input.value = '';
      state.pendingAttachment = null;
      state.pendingVoiceClip = null;
      saveState();
      renderSidebar();
      renderMainChat();
      showToast(`Added note to ${p.name}`);
      if (window.soundMgr) window.soundMgr.playClick();

      // Scroll to bottom
      const stream = $('#notesStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    };

    if (sendBtn) sendBtn.onclick = handleAdd;
    if (input) {
      input.onkeydown = (e) => {
        if (e.key === 'Enter') handleAdd();
      };
      input.onfocus = () => {
        if (window.innerWidth <= 768) {
          document.body.classList.add('mobile-typing-mode');
          setTimeout(() => {
            const stream = $('#notesStream');
            if (stream) stream.scrollTop = stream.scrollHeight;
          }, 80);
        }
      };
      input.onblur = () => {
        setTimeout(() => {
          if (!document.activeElement || document.activeElement.id !== 'composerInput') {
            document.body.classList.remove('mobile-typing-mode');
          }
        }, 150);
      };
    }
  }

  // Save inline edited message
  function saveInlineEdit(profile, noteId, newText) {
    const trimmed = (newText || '').trim();
    const note = (profile.notes || []).find(n => n.id === noteId);
    if (note && (trimmed || note.image || note.voiceClip)) {
      if (note.text !== trimmed) {
        historyMgr.record({
          type: 'EDIT_NOTE',
          profileId: profile.id,
          noteId,
          oldText: note.text,
          newText: trimmed,
          oldEditedAt: note.editedAt,
          newEditedAt: now()
        });
      }
      note.text = trimmed;
      note.editedAt = now();
      saveState();
      showToast('✏️ Updated message');
    }
    state.editingNoteId = null;
    renderSidebar();
    renderMainChat();
  }

  // Enhancement #1 Modal: Add Quick-Task Template
  function promptAddTemplate() {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.style.zIndex = '9999';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>⚡ Add 1-Click Quick-Task Template</h3>
        <input type="text" id="newTplInput" class="rename-input" placeholder="e.g. 📄 Print Grade 10 Exam">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Tip: Right-click any template chip above the composer to delete it.
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelTpl">Cancel</button>
          <button class="btn-composer-send" id="btnSaveTpl" style="padding:8px 18px;">Add Chip ✓</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#newTplInput', backdrop);
    inp.focus();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      const val = inp.value.trim();
      if (val) {
        state.quickTemplates.push(val);
        saveTemplates();
        renderMainChat();
        showToast(`⚡ Added template "${val}"`);
      }
      close();
    };
    $('#btnCancelTpl', backdrop).onclick = close;
    $('#btnSaveTpl', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }


  // Messenger 24-Hour Notes Helpers
  // A cleared note is kept as a "tombstone" ({ text: '', cleared: true, updatedAt }) for 24h so the
  // deletion syncs to other devices instead of being resurrected by a stale device.
  function getActiveStatusNote(profile) {
    if (!profile || !profile.statusNote) return null;
    const cur = now();
    if (profile.statusNote.expiresAt && cur >= profile.statusNote.expiresAt) {
      profile.statusNote = null;
      return null;
    }
    if (profile.statusNote.cleared || !profile.statusNote.text) return null;
    return profile.statusNote;
  }

  function makeClearedStatusNote() {
    const t = now();
    return { text: '', cleared: true, createdAt: t, updatedAt: t, expiresAt: t + 86400000 };
  }

  function statusNoteStamp(sn) {
    return sn ? (sn.updatedAt || sn.createdAt || 0) : 0;
  }

  // Newest change wins (set OR clear). Missing remote = keep local (old clients don't send notes).
  function mergeStatusNotes(localSn, remoteSn) {
    const cur = now();
    const alive = sn => sn && (!sn.expiresAt || sn.expiresAt > cur) ? sn : null;
    const l = alive(localSn), r = alive(remoteSn);
    if (!r) return l;
    if (!l) return r;
    return statusNoteStamp(r) > statusNoteStamp(l) ? r : l;
  }

  function parseRemoteStatusNote(sn) {
    if (!sn) return null;
    const t = now();
    const text = sn.t || '';
    return {
      text,
      cleared: !text,
      createdAt: sn.c || t,
      updatedAt: sn.u || sn.c || t,
      expiresAt: sn.x || (t + 86400000)
    };
  }

  // Pull newer per-profile notes from a cloud packet into local state (used before pushing local state)
  function mergeCloudStatusNotesIntoLocal(packet) {
    if (!packet || !Array.isArray(packet.p)) return;
    const byNo = new Map();
    packet.p.forEach(item => { if (item && item.i != null) byNo.set(Number(item.i), item); });
    for (const p of state.profiles) {
      const item = byNo.get(Number(p.chromeNo));
      if (item && item.sn) p.statusNote = mergeStatusNotes(p.statusNote, parseRemoteStatusNote(item.sn));
    }
  }

  function formatRemainingNoteTime(ms) {
    if (ms <= 0) return 'Expired';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${Math.max(1, mins)}m left`;
  }

  // Messenger Standard 24-Hour Note Modal (Tap avatar or note bubble)
  // Messenger Standard 24-Hour Note Modal (Solid Black, Radiant Gradient, Advanced Task Statuses)
  function promptMessengerNote(profile) {
    const cur = now();
    const currentNote = getActiveStatusNote(profile);
    const avatarSrc = getAvatarSrc(profile);

    const TASK_PRESETS = [
      { icon: '📝', label: 'Grading', status: '📝 Grading Exams' },
      { icon: '🖨️', label: 'Printing', status: '🖨️ Printing Files' },
      { icon: '📐', label: 'Math Class', status: '📐 Math Class' },
      { icon: '🧠', label: 'Deep Focus', status: '🧠 Deep Focus' },
      { icon: '🔬', label: 'Research', status: '🔬 AI Research' },
      { icon: '📊', label: 'Reports', status: '📊 DepEd Reports' },
      { icon: '📚', label: 'Lesson Plan', status: '📚 Lesson Plan' },
      { icon: '📋', label: 'DepEd Forms', status: '📋 DepEd Forms (SF)' },
      { icon: '💻', label: 'Online Class', status: '💻 Online Class' },
      { icon: '🧪', label: 'Lab Activity', status: '🧪 Lab Activity' },
      { icon: '🎯', label: 'Review', status: '🎯 Review Session' },
      { icon: '⏳', label: 'Cooldown', status: '⏳ Cooldown' },
      { icon: '⚡', label: 'Ready', status: '⚡ Ready for Work' },
      { icon: '🚀', label: 'Rush Priority', status: '🚀 Rush Priority' },
      { icon: '☕', label: 'Coffee Break', status: '☕ Coffee Break' },
      { icon: '✨', label: 'Clean Slate', status: '✨ Clean Slate' }
    ];

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog messenger-note-dialog">
        <div class="messenger-note-header-simple">
          <div class="note-modal-profile-info">
            <img src="${avatarSrc}" class="note-avatar-mini" alt="${esc(profile.name)}">
            <div>
              <div class="note-modal-title">💭 Share a Note</div>
              <div class="note-modal-subtitle">${esc(profile.name)} · ${esc(profile.winShortcut)} ${currentNote ? `· ⏳ ${formatRemainingNoteTime(currentNote.expiresAt - cur)}` : ''}</div>
            </div>
          </div>
          <button type="button" class="btn-close-note-modal" id="btnCloseNoteModal" title="Close (Esc)">✕</button>
        </div>

        <div class="note-input-container">
          <div class="note-input-row">
            <input type="text" id="messengerNoteInput" class="rename-input note-composer-input" maxlength="60" value="${esc(currentNote ? currentNote.text : '')}" placeholder="What's on your mind? (e.g. 📝 Grading Exams)">
            <span class="note-char-counter"><span id="noteCharCount">${currentNote ? currentNote.text.length : 0}</span>/60</span>
          </div>
        </div>

        <!-- Advanced Task Presets (Solo Icons Removed) -->
        <div class="note-presets-section">
          <div class="note-preset-label">
            <span>⚡ TASK STATUS PRESETS:</span>
            <span class="note-preset-hint">Tap to pick · Press Enter to share</span>
          </div>
          <div class="note-preset-chips">
            ${TASK_PRESETS.map(tp => `
              <button type="button" class="btn-task-chip" data-status="${esc(tp.status)}" title="Click to insert • Double-click or Enter to Share">
                <span class="task-chip-icon">${tp.icon}</span>
                <span class="task-chip-text">${esc(tp.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="note-dialog-actions-simple">
          ${currentNote ? `
            <button type="button" class="btn-delete-note-simple" id="btnDeleteNote" title="Delete current note">
              🗑️ Delete
            </button>
          ` : ''}
          <div style="flex:1;"></div>
          <button type="button" class="btn-banner-clear" id="btnCancelNote">Cancel</button>
          <button type="button" class="btn-composer-send btn-save-note-radiant" id="btnSaveNote">
            ${currentNote ? 'Update Note 💭' : 'Share Note 💭'}
          </button>
        </div>
      </div>
    `;

    // Mark that a note modal is open (prevents renderSidebar/renderMainChat from nuking it)
    document.body.dataset.noteModalOpen = '1';
    document.body.appendChild(backdrop);
    const inp = $('#messengerNoteInput', backdrop);
    const charCount = $('#noteCharCount', backdrop);

    // iOS fix: delay focus so the keyboard opening doesn't trigger phantom click/resize events
    // that would immediately close the modal
    setTimeout(() => {
      if (backdrop.parentNode) {
        inp.focus();
        inp.select();
      }
    }, 350);

    const updatePreview = () => {
      charCount.textContent = inp.value.length;
    };

    inp.oninput = updatePreview;

    const close = () => {
      delete document.body.dataset.noteModalOpen;
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    };
    // Guard: ignore backdrop clicks for 400ms after opening to prevent iOS phantom touch events
    let canDismiss = false;
    setTimeout(() => { canDismiss = true; }, 400);
    backdrop.onclick = (e) => { if (canDismiss && e.target === backdrop) close(); };

    const saveNote = () => {
      const trimmed = inp.value.trim().slice(0, 60);
      if (!trimmed) {
        if (getActiveStatusNote(profile)) {
          profile.statusNote = makeClearedStatusNote();
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`🗑️ Note cleared for ${profile.name}`);
        }
        close();
        return;
      }
      const postTime = now();
      profile.statusNote = {
        text: trimmed,
        createdAt: postTime,
        expiresAt: postTime + (24 * 60 * 60 * 1000)
      };
      saveState();
      if (window.soundMgr) {
        if (typeof window.soundMgr.playClickSoft === "function") window.soundMgr.playClickSoft();
        else if (typeof window.soundMgr.playClick === "function") window.soundMgr.playClick();
      }
      renderSidebar();
      renderMainChat();
      showToast(`💭 Note shared on ${profile.name} (lasts 24 hours)`);
      close();
    };

    // Keyboard support: Enter key automatically means go (Share a Note)
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveNote();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };

    // Task Preset Chips click: replaces input value; double-click immediately submits
    $$('.btn-task-chip', backdrop).forEach(btn => {
      btn.onclick = () => {
        inp.value = btn.dataset.status.slice(0, 60);
        updatePreview();
        inp.focus();
      };
      btn.ondblclick = () => {
        inp.value = btn.dataset.status.slice(0, 60);
        updatePreview();
        saveNote();
      };
    });

    $('#btnSaveNote', backdrop).onclick = saveNote;
    $('#btnCancelNote', backdrop).onclick = close;
    $('#btnCloseNoteModal', backdrop).onclick = close;

    const delBtn = $('#btnDeleteNote', backdrop);
    if (delBtn) {
      delBtn.onclick = () => {
        const oldStatus = getActiveStatusNote(profile) ? JSON.parse(JSON.stringify(profile.statusNote)) : null;
        if (oldStatus) {
          historyMgr.record({
            type: 'STATUS_NOTE',
            profileId: profile.id,
            oldNote: oldStatus,
            newNote: null
          });
        }
        profile.statusNote = makeClearedStatusNote();
        saveState();
        if (window.soundMgr) {
          if (typeof window.soundMgr.playClickSoft === "function") window.soundMgr.playClickSoft();
          else if (typeof window.soundMgr.playClick === "function") window.soundMgr.playClick();
        }
        renderSidebar();
        renderMainChat();
        close();
        showActionToast({
          message: `🗑️ Note deleted for ${profile.name}`,
          actionText: '↺ Undo',
          duration: 2000,
          onAction: () => historyMgr.undo()
        });
      };
    }
  }

  // Mini Pending Tasks Popover: Futuristic Frosted HUD, 1-Tap Checkbox & Collision Detection
  function showPendingTasksPopover(profile, anchorElement) {
    const existing = $('#pendingTasksPopoverBackdrop');
    if (existing) existing.remove();

    if (window.soundMgr) {
      if (typeof window.soundMgr.playClickSoft === "function") window.soundMgr.playClickSoft();
      else if (typeof window.soundMgr.playClick === "function") window.soundMgr.playClick();
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'pendingTasksPopoverBackdrop';
    backdrop.className = 'pending-tasks-popover-backdrop';

    const popoverEl = document.createElement('div');
    popoverEl.className = 'pending-tasks-popover';

    const close = () => {
      document.removeEventListener('keydown', handleKey);
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);

    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };

    const isMobile = window.innerWidth <= 768;

    const renderContent = () => {
      const pendingNotes = (profile.notes || []).filter(n => !n.done);
      if (pendingNotes.length === 0) {
        popoverEl.innerHTML = `
          ${isMobile ? '<div class="ios-sheet-grabber" title="Swipe down to close"></div>' : ''}
          <div style="text-align:center; padding:20px 10px;">
            <div style="font-size:28px; margin-bottom:8px;">✓</div>
            <div style="font-size:14px; font-weight:800; color:#34d399; letter-spacing:0.3px;">All Tasks Completed!</div>
            <div style="font-size:11.5px; color:#94a3b8; margin-top:4px;">No pending items on ${esc(profile.name)}</div>
          </div>
        `;
        setTimeout(() => close(), 750);
        return;
      }

      popoverEl.innerHTML = `
        ${isMobile ? '<div class="ios-sheet-grabber" title="Swipe down to close"></div>' : ''}
        <div class="popover-header">
          <div class="popover-title-wrap">
            <span class="popover-badge-pill">${pendingNotes.length}</span>
            <div>
              <div class="popover-profile-name">${esc(profile.name)}</div>
              <div class="popover-sub-count">${pendingNotes.length} Pending Task${pendingNotes.length > 1 ? 's' : ''}</div>
            </div>
          </div>
          <button type="button" class="btn-close-popover" id="btnClosePopover" title="Close (Esc)">✕</button>
        </div>

        <div class="popover-tasks-list">
          ${pendingNotes.map(n => `
            <div class="popover-task-item" data-task-id="${n.id}">
              <button type="button" class="btn-popover-checkbox" data-act="done" data-id="${n.id}" title="1-Tap Mark Done">
                <span class="checkbox-box">${Icons.check(11)}</span>
              </button>
              <div class="popover-task-body" data-act="view" data-id="${n.id}" title="Click to open and view in chat">
                <div class="popover-task-text">${esc(n.text)}</div>
                <div class="popover-task-meta">
                  <span class="popover-task-time">${Icons.waiting(10)} ${formatNoteDateTime(n.createdAt)}</span>
                  <span class="popover-jump-hint">View in chat →</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${pendingNotes.length > 1 ? `
          <button type="button" class="btn-popover-all-done" id="btnPopoverAllDone">
            ${Icons.check(13)} <span>Mark All ${pendingNotes.length} Done</span>
          </button>
        ` : ''}
      `;

      // 1. 1-Tap Checkbox Mark Done with card-exit animation
      $$('.btn-popover-checkbox', popoverEl).forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const noteId = btn.dataset.id;
          const note = (profile.notes || []).find(x => x.id === noteId);
          if (note) {
            const itemEl = popoverEl.querySelector(`.popover-task-item[data-task-id="${noteId}"]`);
            if (itemEl) itemEl.classList.add('task-completing');
            if (window.soundMgr) {
              if (typeof window.soundMgr.playReadyChime === 'function') window.soundMgr.playReadyChime();
              else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
            }
            triggerHaptic('success');
            note.done = true;
            note.doneAt = now();
            if (countPending(profile) === 0) {
              profile.isPinned = false;
              profile.pinnedAt = null;
            }
            saveState();
            renderSidebar();
            renderMainChat();
            showToast(`✓ Completed: "${note.text.slice(0, 25)}"`);
            setTimeout(() => renderContent(), 200);
          }
        };
      });

      // 2. Click task body to jump directly to note in main chat
      $$('.popover-task-body', popoverEl).forEach(body => {
        body.onclick = (e) => {
          e.stopPropagation();
          const noteId = body.dataset.id;
          state.activeProfileId = profile.id;
          renderSidebar();
          renderMainChat();
          close();
          setTimeout(() => {
            const card = document.querySelector(`.note-item-wrap[data-nid="${noteId}"]`);
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.classList.add('note-card-highlight-pulse');
              setTimeout(() => card.classList.remove('note-card-highlight-pulse'), 2500);
            }
          }, 120);
        };
      });

      // 3. Mark All Done
      const btnAllDone = $('#btnPopoverAllDone', popoverEl);
      if (btnAllDone) {
        btnAllDone.onclick = (e) => {
          e.stopPropagation();
          (profile.notes || []).forEach(n => { n.done = true; n.doneAt = now(); });
          if (window.soundMgr) {
            if (typeof window.soundMgr.playReadyChime === 'function') window.soundMgr.playReadyChime();
            else if (typeof window.soundMgr.playClick === 'function') window.soundMgr.playClick();
          }
          profile.isPinned = false;
          profile.pinnedAt = null;
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`✓ Completed all tasks on ${profile.name}`);
          renderContent();
        };
      }

      const btnClose = $('#btnClosePopover', popoverEl);
      if (btnClose) btnClose.onclick = close;
    };

    // Calculate position with Viewport Collision Detection (Desktop) or Sheet (Mobile)
    if (!isMobile && anchorElement && anchorElement.getBoundingClientRect) {
      const rect = anchorElement.getBoundingClientRect();
      const popoverWidth = 330;
      let left = rect.right + 12;

      if (left + popoverWidth > window.innerWidth - 12) {
        left = Math.max(12, rect.left - popoverWidth - 12);
      }

      const taskCount = (profile.notes || []).filter(n => !n.done).length;
      const estimatedHeight = Math.min(380, 115 + Math.min(taskCount * 52, 240));

      let top = rect.top - 10;
      // Collision detection: never cut off at bottom screen edge!
      if (top + estimatedHeight > window.innerHeight - 15) {
        top = Math.max(12, window.innerHeight - estimatedHeight - 15);
      }
      if (top < 12) top = 12;

      popoverEl.style.left = `${left}px`;
      popoverEl.style.top = `${top}px`;
    }

    backdrop.appendChild(popoverEl);
    document.body.appendChild(backdrop);
    renderContent();
  }

  function promptStickyNote(profile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>📌 Sticky Header Note for ${esc(profile.name)}</h3>
        <input type="text" id="stickyValInput" class="rename-input" value="${esc(profile.stickyNote || '')}" placeholder="e.g. Dedicated to Scite Research · https://scite.ai">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Stays pinned at the top of ${esc(profile.name)}'s chat window even when daily notes are cleared. URLs become clickable automatically!
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelSticky">Cancel</button>
          <button class="btn-composer-send" id="btnSaveSticky" style="padding:8px 18px;">Save Sticky 📌</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#stickyValInput', backdrop);
    inp.focus();
    inp.select();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      profile.stickyNote = inp.value.trim();
      saveState();
      renderMainChat();
      showToast(profile.stickyNote ? `📌 Sticky note pinned for ${profile.name}` : `Cleared sticky note`);
      close();
    };
    $('#btnCancelSticky', backdrop).onclick = close;
    $('#btnSaveSticky', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // Enhancement #4 Modal: Add Sub-Checklist Item(s) Inside a Message Bubble
  function promptAddChecklistItem(profile, note) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>☑️ Add Sub-Checklist Items</h3>
        <input type="text" id="subItemValInput" class="rename-input" placeholder="Type item (or separate multiple with commas)...">
        <div style="font-size:11.5px; color:var(--nf-text-muted);">
          Tip: Separate multiple items with commas (e.g. <em>Print Math 8, Print Math 10, Sign logbook</em>) to add them all at once!
        </div>
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelSub">Cancel</button>
          <button class="btn-composer-send" id="btnSaveSub" style="padding:8px 18px;">Add Checklist  ☑️</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const inp = $('#subItemValInput', backdrop);
    inp.focus();
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    const save = () => {
      const raw = inp.value.trim();
      if (raw) {
        if (!Array.isArray(note.subItems)) note.subItems = [];
        const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
        parts.forEach(part => {
          note.subItems.push({ id: uid(), text: part, done: false });
        });
        saveState();
        renderMainChat();
        showToast(`☑️ Added ${parts.length} checklist item(s)`);
      }
      close();
    };
    $('#btnCancelSub', backdrop).onclick = close;
    $('#btnSaveSub', backdrop).onclick = save;
    inp.onkeydown = (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') close();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  }

  // Helper: check if a profile is ready or actionable (Pending Notes, Active Timer [Red], or Expired/Reset Timer [Green])
  function isActionableProfile(p, cur = now()) {
    const hasPending = countPending(p) > 0;
    const hasActiveTimer = Boolean(p.timerUntil && p.timerUntil > cur);
    const hasExpiredOrReset = Boolean(p.isReset || (p.timerUntil && p.timerUntil <= cur));
    const isUnread = Boolean(p.isUnread);
    return hasPending || hasActiveTimer || hasExpiredOrReset || isUnread;
  }

  // Enhancement #6: Jump to Next Profile with Pending Note or Timer (Active Countdown or Expired/Reset)
  function jumpToNextReadyProfile() {
    const cur = now();
    const actionable = state.profiles.filter(p => isActionableProfile(p, cur));
    if (!actionable.length) {
      showToast('✨ All 22 profiles are clear — no pending notes or active timers!');
      return;
    }

    // Find next actionable profile in cyclic order starting from active profile
    const curFullIdx = state.profiles.findIndex(p => p.id === state.activeProfileId);
    let nextProf = null;
    if (curFullIdx !== -1) {
      for (let i = 1; i <= state.profiles.length; i++) {
        const candidate = state.profiles[(curFullIdx + i) % state.profiles.length];
        if (isActionableProfile(candidate, cur)) {
          nextProf = candidate;
          break;
        }
      }
    }
    if (!nextProf) {
      nextProf = actionable[0];
    }

    const wasSameProfile = (nextProf.id === state.activeProfileId);
    state.activeProfileId = nextProf.id;
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-chat-open');
      try { localStorage.setItem('orlandochrome_mobile_view', 'chat'); } catch (e) {}
    }

    // Ensure nextProf is visible if currently filtered out by filter tabs
    const curTab = state.currentFilter;
    const curMatchesFilter = (curTab === 'all') ||
      (curTab === 'pending' && (countPending(nextProf) > 0 || nextProf.isUnread)) ||
      (curTab === 'timers' && ((nextProf.timerUntil && nextProf.timerUntil > cur) || nextProf.isReset));

    if (!curMatchesFilter) {
      state.currentFilter = 'all';
      const allTabs = $$('.filter-tab');
      if (allTabs && allTabs.length) allTabs.forEach(t => t.classList.remove('active'));
      const tabAll = $('#tabAll');
      if (tabAll) tabAll.classList.add('active');
    }

    renderSidebar();
    renderMainChat();

    const activeEl = $(`#profileList .profile-item[data-id="${nextProf.id}"]`);
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // Informative toast explaining what's on this profile
    const pCount = countPending(nextProf);
    const hasActiveTimer = Boolean(nextProf.timerUntil && nextProf.timerUntil > cur);
    const hasExpiredOrReset = Boolean(nextProf.isReset || (nextProf.timerUntil && nextProf.timerUntil <= cur));
    const details = [];
    if (pCount > 0) details.push(`📌 ${pCount} Pending`);
    if (hasActiveTimer) details.push(`⏳ ${formatRemainingShort(nextProf.timerUntil - cur)} left`);
    else if (hasExpiredOrReset) details.push(`🟢 Reset Ready`);
    if (nextProf.isUnread) details.push(`📬 Unread`);

    const detailText = details.length ? ` • ${details.join(' · ')}` : '';
    if (actionable.length === 1 && wasSameProfile) {
      showToast(`⚡ Only 1 active profile: ${nextProf.name} (${nextProf.winShortcut})${detailText}`);
    } else {
      showToast(`⚡ Jumped to ${nextProf.name} (${nextProf.winShortcut})${detailText}`);
    }
  }

  // Native iOS Swipe-Down-to-Dismiss for Full-Screen Photos, Sheets & Modals (Finger-Tracking + Mid-Swipe Cancel)
  function attachSwipeDownToDismiss(backdrop, sheetEl, onClose) {
    if (!backdrop || !sheetEl) return;
    let startY = 0;
    let startX = 0;
    let currentDy = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityY = 0;
    let dragging = false;

    sheetEl.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const scrollEl = e.target.closest('.forward-profiles-list, .qr-studio-body');
      if (scrollEl && scrollEl.scrollTop > 2) return;
      if (sheetEl.scrollTop > 2) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      lastY = startY;
      lastTime = performance.now();
      currentDy = 0;
      velocityY = 0;
      dragging = false;
    }, { passive: true });

    sheetEl.addEventListener('touchmove', (e) => {
      if (!startY || e.touches.length !== 1) return;
      const y = e.touches[0].clientY;
      const x = e.touches[0].clientX;
      const dy = y - startY;
      const dx = x - startX;

      if (!dragging) {
        if (dy > 10 && Math.abs(dy) > Math.abs(dx) * 1.25) {
          dragging = true;
          sheetEl.style.transition = 'none';
        } else if (Math.abs(dx) > 12 || dy < -8) {
          startY = 0;
          return;
        } else {
          return;
        }
      }

      if (e.cancelable) e.preventDefault();
      const nowT = performance.now();
      const dt = Math.max(1, nowT - lastTime);
      velocityY = (y - lastY) / dt;
      lastY = y;
      lastTime = nowT;

      currentDy = Math.max(0, dy);
      const scale = Math.max(0.92, 1 - currentDy * 0.00028);
      sheetEl.style.transform = `translate3d(0, ${currentDy}px, 0) scale(${scale})`;
      const alpha = Math.max(0.2, 0.85 - (currentDy / 380) * 0.65);
      backdrop.style.background = `rgba(0, 0, 0, ${alpha})`;
    }, { passive: false });

    const finishDrag = () => {
      if (!dragging) {
        startY = 0;
        return;
      }
      dragging = false;
      startY = 0;
      const shouldDismiss = (currentDy > 90 || (currentDy > 35 && velocityY > 0.45)) && velocityY >= -0.15;
      sheetEl.style.transition = 'transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease';
      if (shouldDismiss) {
        sheetEl.style.transform = `translate3d(0, ${window.innerHeight}px, 0) scale(0.92)`;
        sheetEl.style.opacity = '0';
        setTimeout(() => {
          if (typeof onClose === 'function') onClose();
        }, 220);
      } else {
        // Stop midway -> cancel and spring smoothly back into place!
        sheetEl.style.transform = '';
        backdrop.style.background = '';
      }
    };

    sheetEl.addEventListener('touchend', finishDrag, { passive: true });
    sheetEl.addEventListener('touchcancel', finishDrag, { passive: true });
  }

  // Full-Screen Lightbox Modal for Pasted/Dropped Screenshots (With iOS Swipe-Down-to-Dismiss)
  function openLightboxModal(imgSrc, caption) {
    if (!imgSrc) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="lightbox-modal" id="lightboxSheet">
        <div class="ios-sheet-grabber" title="Swipe down to dismiss"></div>
        <img src="${imgSrc}" class="lightbox-img" alt="Full screen screenshot">
        <div class="lightbox-footer">
          <span class="lightbox-caption">${esc(caption || 'Screenshot · Swipe down to close')}</span>
          <button type="button" class="btn-composer-send" id="btnCloseLightbox" style="padding:7px 18px;">Close ✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    $('#btnCloseLightbox', backdrop).onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    attachSwipeDownToDismiss(backdrop, $('#lightboxSheet', backdrop), close);
  }

  // 🔄 Forward / Move Task to Another Chrome Profile Modal
  function openForwardModal(sourceProfile, note) {
    const cur = now();
    const others = state.profiles.filter(p => p.id !== sourceProfile.id);

    // Find next available profile without an active cooldown timer
    const sortedAfter = [
      ...others.filter(p => p.taskbarSlot > sourceProfile.taskbarSlot),
      ...others.filter(p => p.taskbarSlot < sourceProfile.taskbarSlot)
    ];
    const nextAvailable = sortedAfter.find(p => !(p.timerUntil && p.timerUntil > cur)) || others[0];

    const executeTransfer = (targetProfile, removeSource) => {
      if (!targetProfile.notes) targetProfile.notes = [];
      targetProfile.notes.push({
        id: uid(),
        text: note.text,
        image: note.image || null,
        voiceClip: note.voiceClip || null,
        reactions: Array.isArray(note.reactions) ? [...note.reactions] : [],
        subItems: Array.isArray(note.subItems) ? JSON.parse(JSON.stringify(note.subItems)) : [],
        createdAt: now(),
        editedAt: null,
        forwardedFrom: sourceProfile.name,
        done: false
      });

      if (removeSource) {
        sourceProfile.notes = (sourceProfile.notes || []).filter(n => n.id !== note.id);
        if (countPending(sourceProfile) === 0) {
          sourceProfile.isPinned = false;
          sourceProfile.pinnedAt = null;
        }
        if (!hasMessages(sourceProfile)) {
          sourceProfile.isUnread = false;
        }
      }

      state.activeProfileId = targetProfile.id;
      saveState();
      if (window.soundMgr) window.soundMgr.playReadyChime();
      renderSidebar();
      renderMainChat();
      showToast(`${removeSource ? '↪ Moved' : '📋 Copied'} task to ${targetProfile.name} (${targetProfile.winShortcut})`);
    };

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="forward-modal">
        <div class="forward-modal-header">
          <h3>↪ Forward or Move Task</h3>
          <button type="button" class="btn-banner-clear" id="btnCloseForward">✕</button>
        </div>

        <div class="forward-task-preview">
          "${esc(note.text || (note.image ? '[Screenshot]' : '[Voice Note]'))}"
        </div>

        ${nextAvailable ? `
          <button type="button" class="btn-forward-QuickNext" id="btnQuickMoveNext">
            <span>⚡ 1-Click Move to Next Available: <strong>${esc(nextAvailable.name)}</strong> (${esc(nextAvailable.winShortcut)})</span>
            <span>↪ Move Now</span>
          </button>
        ` : ''}

        <input type="text" id="forwardSearchInput" class="rename-input" placeholder="Search target Chrome profile...">

        <div class="forward-profiles-list" id="forwardProfilesList">
          ${others.map(prof => {
            const isCooling = prof.timerUntil && prof.timerUntil > cur;
            const statusLabel = isCooling
              ? `⏳ ${formatRemainingShort(prof.timerUntil - cur)} left`
              : `🟢 Available`;
            return `
              <div class="forward-profile-row" data-fname="${esc(prof.name.toLowerCase())} ${esc(prof.winShortcut.toLowerCase())}">
                <div class="forward-prof-info">
                  <img src="${getAvatarSrc(prof)}" class="forward-prof-avatar" alt="${esc(prof.name)}">
                  <div>
                    <div class="forward-prof-name">${esc(prof.name)} <span class="forward-prof-slot">${esc(prof.winShortcut)}</span></div>
                    <div class="forward-prof-status ${isCooling ? 'cooling' : 'ready'}">${statusLabel}</div>
                  </div>
                </div>
                <div class="forward-prof-btns">
                  <button type="button" class="btn-fwd-move" data-target-id="${prof.id}" data-mode="move" title="Move task here &amp; remove from ${esc(sourceProfile.name)}">↪ Move</button>
                  <button type="button" class="btn-fwd-copy" data-target-id="${prof.id}" data-mode="copy" title="Copy task here">📋 Copy</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    $('#btnCloseForward', backdrop).onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    attachSwipeDownToDismiss(backdrop, $('.forward-modal', backdrop), close);

    const quickBtn = $('#btnQuickMoveNext', backdrop);
    if (quickBtn && nextAvailable) {
      quickBtn.onclick = () => {
        close();
        executeTransfer(nextAvailable, true);
      };
    }

    const searchInp = $('#forwardSearchInput', backdrop);
    if (searchInp) {
      searchInp.focus();
      searchInp.oninput = () => {
        const q = searchInp.value.toLowerCase().trim();
        $$('.forward-profile-row', backdrop).forEach(row => {
          row.style.display = (!q || row.dataset.fname.includes(q)) ? 'flex' : 'none';
        });
      };
    }

    $$('[data-target-id]', backdrop).forEach(btn => {
      btn.onclick = () => {
        const target = getProfile(btn.dataset.targetId);
        const isMove = btn.dataset.mode === 'move';
        close();
        if (target) executeTransfer(target, isMove);
      };
    });
  }

  // =========================================================================
  // 📲 APP DISTRIBUTION & COMMAND SUITE (PWA Install, Mobile QR, iOS Guide, Backup, Blank Edition)
  // =========================================================================
  // Open Interactive Installation Guide Modal (OrlandoRecharge Standard)
  function openInstallGuideModal() {
    const modal = $('#installGuideModal');
    if (!modal) return;
    modal.classList.add('open');

    const close = () => modal.classList.remove('open');
    const btnClose = $('#closeInstallGuide');
    if (btnClose) btnClose.onclick = close;
    const btnDismiss = $('#dismissInstallGuide');
    if (btnDismiss) btnDismiss.onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
  }

  function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // Download 100% Smart App Control-safe Windows Web App (.vbs / .url launcher)
  function downloadWindowsDesktopLauncherCmd(isBlank = false) {
    const targetUrl = isBlank ? BLANK_APP_URL : LIVE_APP_URL;
    const shortcutName = isBlank ? 'OrlandoChrome-Blank.url' : 'OrlandoChrome.url';
    const content = [
      '[InternetShortcut]',
      'URL=' + targetUrl,
      'IconFile=https://orlandopasion000.github.io/orlandochrome/favicon.ico',
      'IconIndex=0',
      'HotKey=0',
      '[{000214A0-0000-0000-C000-000000000046}]',
      'Prop3=19,11'
    ].join('\r\n');
    downloadTextFile(shortcutName, content, 'application/internet-shortcut');
    showToast('🚀 Saved Windows App Shortcut (.url) — Zero Smart App Control warnings!');
  }

  // Download 1-Click Laptop Taskbar Auto-Scanner (.cmd) that reads the installed laptop's Chrome profiles & syncs names instantly!
  function downloadLaptopTaskbarScannerCmd(isBlank = false) {
    const targetUrl = isBlank ? BLANK_APP_URL : LIVE_APP_URL;
    const cmdContent = [
      '@echo off',
      'title OrlandoChrome - Laptop Taskbar Chrome Profile Auto-Scanner',
      'echo ====================================================================',
      'echo   Scanning this laptop\'s Chrome profiles and taskbar shortcuts...',
      'echo ====================================================================',
      'powershell -NoProfile -ExecutionPolicy Bypass -Command ^',
      '  "$lsPath = Join-Path $env:LOCALAPPDATA \'Google\\Chrome\\User Data\\Local State\'; ^',
      '   if (-not (Test-Path $lsPath)) { Write-Host \'Chrome Local State not found.\'; exit }; ^',
      '   $json = Get-Content $lsPath -Raw -Encoding UTF8 | ConvertFrom-Json; ^',
      '   $cache = $json.profile.info_cache; ^',
      '   $list = @(); $idx = 1; ^',
      '   foreach ($prop in $cache.PSObject.Properties) { ^',
      '     $v = $prop.Value; ^',
      '     $slot = $idx + 2; ^',
      '     $sc = if ($slot -le 9) { \'Win + \' + $slot } else { \'Slot #\' + $slot }; ^',
      '     $list += @{ id=(\'b_tb_\'+$slot); profileDir=$prop.Name; chromeNo=$idx; taskbarSlot=$slot; winShortcut=$sc; name=($v.name); email=($v.user_name); gaia=($v.gaia_name) }; ^',
      '     $idx++; ^',
      '   }; ^',
      '   $outJson = ($list | ConvertTo-Json -Compress); ^',
      '   $outFile = Join-Path $env:USERPROFILE \'Desktop\\my-laptop-chrome-profiles.json\'; ^',
      '   Set-Content -Path $outFile -Value $outJson -Encoding UTF8; ^',
      '   $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($outJson)); ^',
      '   $url = \'' + targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'import_b64=\' + $b64; ^',
      '   Start-Process \'chrome.exe\' -ArgumentList (\'--app=\'+$url)"',
      'exit'
    ].join('\r\n');
    downloadTextFile('OrlandoChrome-Taskbar-AutoScanner.cmd', cmdContent);
    showToast('⚡ Downloaded Laptop Taskbar Auto-Scanner (.cmd)!');
  }

  // Export Full JSON Backup (Enhancement #7)
  function exportFullBackupJson() {
    const payload = {
      app: 'OrlandoChrome',
      version: '5.0',
      edition: IS_BLANK_EDITION ? 'blank' : 'personal',
      exportedAt: new Date().toISOString(),
      profiles: state.profiles,
      quickTemplates: state.quickTemplates,
      wispr: {
        style: state.wispr.style,
        commandMode: state.wispr.commandMode,
        autoSend: state.wispr.autoSend,
        recordAudioClip: state.wispr.recordAudioClip,
        dictionary: state.wispr.dictionary
      }
    };
    const dateTag = new Date().toISOString().slice(0, 10);
    downloadTextFile(`orlandochrome-backup-${dateTag}.json`, JSON.stringify(payload, null, 2), 'application/json');
    showToast('💾 Backup exported (.json)!');
  }

  // Download Standalone Offline Single-File HTML
  async function downloadStandaloneHtml(isBlank = false) {
    try {
      const [cssRes, jsRes] = await Promise.all([
        fetch('styles.css').then(r => r.text()).catch(() => ''),
        fetch('app.js').then(r => r.text()).catch(() => '')
      ]);
      const standaloneHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OrlandoChrome · Standalone Offline Edition</title>
<style>${cssRes}</style>
</head>
<body class="netflix-messenger-theme">
${document.body.innerHTML}
<script>
${isBlank ? "history.replaceState({}, '', '?edition=blank');" : ""}
${jsRes}
</script>
</body>
</html>`;
      downloadTextFile(isBlank ? 'OrlandoChrome-Blank-Standalone.html' : 'OrlandoChrome-Standalone.html', standaloneHtml, 'text/html');
      showToast('💾 Downloaded Standalone (.html) App!');
    } catch (e) {
      showToast('⚠️ Failed to bundle standalone HTML.');
    }
  }

  // High-Contrast Instant-Scan QR Theme Palette Definitions (All Dark-on-Light for 0.05s Camera Lock!)
  const QR_THEMES = {
    cyan:     { label: '⚡ Cyber Cyan',   fg: '001524', bg: 'ffffff', accent: '#00f2fe', glow: 'rgba(0, 242, 254, 0.55)', ratio: '20.8:1' },
    crimson:  { label: '🔴 Crimson Core',  fg: '3b0003', bg: 'ffffff', accent: '#ff2e38', glow: 'rgba(229, 9, 20, 0.65)', ratio: '19.8:1' },
    emerald:  { label: '🟢 Emerald Core',  fg: '011a13', bg: 'ffffff', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.55)', ratio: '19.5:1' },
    gold:     { label: '✨ Royal Gold',    fg: '140e02', bg: 'ffffff', accent: '#e5c97b', glow: 'rgba(226, 200, 125, 0.5)', ratio: '20.2:1' },
    titanium: { label: '🌌 Titanium Noir', fg: '0f172a', bg: 'ffffff', accent: '#94a3b8', glow: 'rgba(148, 163, 184, 0.5)', ratio: '18.9:1' }
  };

  // Pure Client-Side Zero-Dependency Vector QR Generator (0ms Offline + Instant Render)
  function generateQrMarkup(text, fgHex = '#000000', bgHex = '#ffffff') {
    if (typeof window.qrcode === 'function') {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        const count = qr.getModuleCount();
        const margin = 4; // ISO/IEC 18004 Standard 4-module quiet zone
        const total = count + margin * 2;
        let d = '';
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              d += `M${c + margin},${r + margin}h1v1h-1z `;
            }
          }
        }
        const cleanBg = bgHex.startsWith('#') ? bgHex : ('#' + bgHex);
        const cleanFg = fgHex.startsWith('#') ? fgHex : ('#' + fgHex);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" class="qr-code-svg-holo" style="width:100%;height:100%;display:block;"><rect width="100%" height="100%" fill="${cleanBg}"/><path fill="${cleanFg}" d="${d}"/></svg>`;
        return { svg, count, qrInstance: qr };
      } catch (e) {
        console.warn('Local QR engine error, falling back to API:', e);
      }
    }
    return { svg: null, count: 33, qrInstance: null };
  }

  // App Distribution & Live Sync Command Suite (Removed per user request)
  
  // Helper: Copy text to clipboard with robust textarea fallback
  function copyToClipboard(text, successMsg = '📋 App link copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => fallbackCopyText(text, successMsg));
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        showToast(successMsg);
        return;
      }
    } catch (err) {}
    prompt('Copy link to clipboard:', text);
  }

  function openInstallGuideModal() {
    const modal = $('#installGuideModal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
  }

  function closeInstallGuideModal() {
    const modal = $('#installGuideModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  // Direct Desktop App Launcher (Standalone window with no browser tabs / URL bar)
  function launchDesktopApp() {
    playSoundClick();
    showToast('🚀 Launching OrlandoChrome (Main Version)...');
    const appUrl = 'https://orlandopasion000.github.io/orlandochrome/';
    const winFeatures = 'popup=yes,menubar=no,toolbar=no,location=no,status=no,personalbar=no,directories=no,resizable=yes,scrollbars=yes,width=1380,height=880,left=100,top=60';
    const appWin = window.open(appUrl, '_blank', winFeatures);
    if (appWin) {
      try { appWin.focus(); } catch (e) {}
    }
  }

  function openAppDistributionSuiteModal() {
    playSoundClick();
    const shareUrl = IS_BLANK_EDITION ? BLANK_APP_URL : LIVE_APP_URL;
    // Pure black (#000000) modules on pure white (#ffffff) background for 100% instant camera detection!
    const qrRes = generateQrMarkup(shareUrl, '#000000', '#ffffff');
    const qrSvg = qrRes.svg || `<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(shareUrl)}" alt="QR Code" style="width:100%;height:100%;display:block;border-radius:10px;">`;

    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="qr-studio-modal" style="max-width:380px; width:100%; text-align:center; padding:20px; background:#0c0c10; border:1px solid rgba(255, 77, 88, 0.45); border-radius:18px; box-shadow:0 16px 48px rgba(0,0,0,0.9), 0 0 35px rgba(229,9,20,0.3); animation:modalPopIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="oc-logo.svg" alt="OC" style="width:26px; height:26px; border-radius:6px; box-shadow:0 0 10px rgba(229,9,20,0.5);">
            <span style="font-size:0.98rem; font-weight:800; color:#fff;">Holographic QR Scanner</span>
          </div>
          <button type="button" class="btn-banner-clear" id="btnCloseQrModal" style="color:#aaa; font-size:1.2rem; cursor:pointer; background:none; border:none; padding:4px 8px;">✕</button>
        </div>
        <p style="font-size:0.78rem; color:#94a3b8; margin:0 0 14px; line-height:1.4;">Point your iPhone or Android camera to open and live-sync OrlandoChrome instantly.</p>
        
        <!-- High-Tech HUD Viewfinder with glowing red brackets -->
        <div class="qr-hud-box" id="qrViewfinderBox" style="position:relative; width:236px; height:236px; margin:0 auto 12px; padding:12px; background:rgba(20, 10, 14, 0.6); border:1px solid rgba(255,77,88,0.25); border-radius:16px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(229,9,20,0.2); cursor:pointer;" title="Click to open app or copy link">
          <div class="qr-hud-corner tl" style="position:absolute; top:6px; left:6px; width:14px; height:14px; border-top:2.5px solid #ff4d58; border-left:2.5px solid #ff4d58; border-top-left-radius:4px;"></div>
          <div class="qr-hud-corner tr" style="position:absolute; top:6px; right:6px; width:14px; height:14px; border-top:2.5px solid #ff4d58; border-right:2.5px solid #ff4d58; border-top-right-radius:4px;"></div>
          <div class="qr-hud-corner bl" style="position:absolute; bottom:6px; left:6px; width:14px; height:14px; border-bottom:2.5px solid #ff4d58; border-left:2.5px solid #ff4d58; border-bottom-left-radius:4px;"></div>
          <div class="qr-hud-corner br" style="position:absolute; bottom:6px; right:6px; width:14px; height:14px; border-bottom:2.5px solid #ff4d58; border-right:2.5px solid #ff4d58; border-bottom-right-radius:4px;"></div>
          <div class="qr-hud-laser"></div>
          
          <!-- Pure White Card with pitch-black modules for 100% instant scanner lock -->
          <div style="width:204px; height:204px; background:#ffffff; border-radius:12px; padding:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,0.6);">
            ${qrSvg}
          </div>
        </div>

        <div style="font-size:0.72rem; color:#cbd5e1; margin-bottom:8px; font-weight:700; letter-spacing:0.04em;">
          <span style="color:#5de8a0;">●</span> INSTANT CAMERA DETECTION · ZERO WARNINGS
        </div>

        <div style="font-size:0.72rem; color:#94a3b8; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:5px 8px; margin-bottom:14px; font-family:monospace; word-break:break-all;">
          ${esc(shareUrl)}
        </div>

        <div style="display:flex; gap:8px;">
          <button type="button" class="primary dist-btn dist-btn-install" id="btnCopyQrLinkModal" style="flex:1; padding:7px 10px; font-size:0.78rem; font-weight:800;">↗ Copy App Link</button>
          <button type="button" class="ghost dist-btn" id="btnDismissQrModal" style="flex:1; padding:7px 10px; font-size:0.78rem;">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
    const btnClose = $('#btnCloseQrModal', backdrop);
    if (btnClose) btnClose.onclick = close;
    const qrViewfinder = $('#qrViewfinderBox', backdrop);
    if (qrViewfinder) {
      qrViewfinder.onclick = () => {
        playSoundClick();
        copyToClipboard(shareUrl, '📋 App link copied to clipboard!');
        window.open(shareUrl, '_blank', 'noopener');
      };
    }
    const btnDismiss = $('#btnDismissQrModal', backdrop);
    if (btnDismiss) btnDismiss.onclick = close;
    const btnCopy = $('#btnCopyQrLinkModal', backdrop);
    if (btnCopy) {
      btnCopy.onclick = () => {
        copyToClipboard(shareUrl, '📋 App link copied to clipboard!');
        btnCopy.innerHTML = '✓ Copied to Clipboard!';
        btnCopy.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => close(), 1200);
      };
    }
  }

  const openMobileQrModal = openAppDistributionSuiteModal;

  // =========================================================================
  // 🎙️ WISPR FLOW PRO ENGINE (Unlimited Dictation, Style Learning, Command Mode, Audio Waveform)
  // =========================================================================
  let recognition = null;
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let waveAnimId = null;

  function formatWithWisprStyle(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    for (const entry of state.wispr.dictionary) {
      if (!entry.from || !entry.to) continue;
      const escaped = entry.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'gi');
      text = text.replace(re, entry.to);
    }

    text = text
      .replace(/\bperiod\b/gi, '.')
      .replace(/\bcomma\b/gi, ',')
      .replace(/\bquestion mark\b/gi, '?')
      .replace(/\bexclamation mark\b/gi, '!')
      .replace(/\bcolon\b/gi, ':')
      .replace(/\bnew line\b/gi, ' — ');

    const style = state.wispr.style;
    if (style === 'raw') {
      return text;
    }

    text = text
      .replace(/\b(um+|uh+|erm+|er+|hmm+)\b[,\s]*/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!text) return '';

    text = text.charAt(0).toUpperCase() + text.slice(1);

    if (style === 'academic') {
      text = text
        .replace(/\bdon't\b/gi, 'do not')
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bi'm\b/gi, 'I am')
        .replace(/\blet's\b/gi, 'let us')
        .replace(/\bchapter (\d+)\b/gi, 'Chapter $1')
        .replace(/\bgrade (\d+)\b/gi, 'Grade $1');
      if (!/[.!?]$/.test(text)) text += '.';
    } else if (style === 'action') {
      text = text.replace(/^(please |i need to |we need to |remember to |don't forget to )/i, '');
      if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
      text = text.replace(/\.$/, '');
    }

    return text;
  }

  function checkAndExecuteVoiceCommand(transcriptChunk) {
    if (!state.wispr.commandMode) return { consumed: false, text: transcriptChunk };
    const lower = transcriptChunk.trim().toLowerCase().replace(/[.!?]+$/, '');
    const activeProf = getProfile(state.activeProfileId);

    if (lower === 'scratch that' || lower === 'clear text' || lower === 'delete all') {
      const inp = $('#composerInput');
      if (inp) inp.value = '';
      showToast('🗣️ Flow Command: Cleared text');
      return { consumed: true, text: '' };
    }

    if (lower.includes('pin profile') || lower.includes('pin to top')) {
      activeProf.isPinned = true;
      activeProf.pinnedAt = now();
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Pinned ${activeProf.name} to top`);
      return { consumed: true, text: '' };
    }

    if (lower.includes('unpin profile')) {
      activeProf.isPinned = false;
      activeProf.pinnedAt = null;
      saveState();
      renderSidebar();
      showToast(`🗣️ Flow Command: Unpinned ${activeProf.name}`);
      return { consumed: true, text: '' };
    }

    if (lower === 'mark unread' || lower === 'mark as unread') {
      if (hasMessages(activeProf)) {
        activeProf.isUnread = true;
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`🗣️ Flow Command: Marked ${activeProf.name} as Unread`);
      } else {
        showToast(`⚠️ Add a message first before marking ${activeProf.name} Unread`);
      }
      return { consumed: true, text: '' };
    }

    for (const r of REACTIONS_LIST) {
      if (lower === `mark ${r.key}` || lower === `tag ${r.key}`) {
        const pending = (activeProf.notes || []).filter(n => !n.done);
        if (pending.length > 0) {
          const latest = pending[pending.length - 1];
          if (!Array.isArray(latest.reactions)) latest.reactions = [];
          if (!latest.reactions.includes(r.key)) latest.reactions.push(r.key);
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`🗣️ Flow Command: Tagged ${r.icon} ${r.label}`);
        } else {
          state.pendingReactionTag = r.key;
          showToast(`🗣️ Flow Command: Queued ${r.icon} ${r.label} for your note`);
        }
        return { consumed: true, text: '' };
      }
    }

    const timerMatch = lower.match(/start timer (\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|day|days)/);
    if (timerMatch) {
      const val = parseInt(timerMatch[1], 10);
      const unit = timerMatch[2];
      const mins = unit.startsWith('d') ? val * 1440 : (unit.startsWith('h') ? val * 60 : val);
      if (mins > 0) {
        startCooldown(activeProf, mins);
        showToast(`🗣️ Flow Command: Started ${mins}m timer`);
        return { consumed: true, text: '' };
      }
    }

    if (lower === 'forward task' || lower === 'move to next profile') {
      const pending = (activeProf.notes || []).filter(n => !n.done);
      if (pending.length > 0) {
        openForwardModal(activeProf, pending[pending.length - 1]);
        showToast('🗣️ Flow Command: Opened Forward Task modal');
        return { consumed: true, text: '' };
      }
    }

    const sendSuffixMatch = transcriptChunk.match(/^(.*?)\b(send note|submit note|add task)\s*[.!?]*$/i);
    if (sendSuffixMatch) {
      const prefixText = sendSuffixMatch[1].trim();
      const inp = $('#composerInput');
      if (inp && prefixText) {
        const formatted = formatWithWisprStyle(prefixText);
        inp.value = inp.value ? `${inp.value.trim()} ${formatted}` : formatted;
      }
      setTimeout(() => {
        const sendBtn = $('#btnSendNote');
        if (sendBtn) sendBtn.click();
      }, 60);
      showToast('🗣️ Flow Command: Sent note!');
      return { consumed: true, text: '' };
    }

    return { consumed: false, text: transcriptChunk };
  }

  async function startAudioVisualizerAndRecorder() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animateBars = () => {
        if (!state.wispr.isListening || !analyser) return;
        analyser.getByteFrequencyData(dataArray);
        const bars = $$('#wisprWaveform .wispr-bar');
        bars.forEach((bar, i) => {
          const val = dataArray[i % dataArray.length] || 0;
          const h = Math.max(4, Math.min(26, Math.round((val / 255) * 26)));
          bar.style.height = `${h}px`;
        });
        waveAnimId = requestAnimationFrame(animateBars);
      };
      waveAnimId = requestAnimationFrame(animateBars);

      if (state.wispr.recordAudioClip && window.MediaRecorder) {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(micStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          if (!recordedChunks.length) return;
          const blob = new Blob(recordedChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onload = (ev) => {
            state.pendingVoiceClip = ev.target.result;
            renderMainChat();
          };
          reader.readAsDataURL(blob);
        };
        mediaRecorder.start();
      }
    } catch (e) {
      console.warn('Microphone visualizer stream error:', e);
    }
  }

  function stopAudioVisualizerAndRecorder() {
    if (waveAnimId) cancelAnimationFrame(waveAnimId);
    waveAnimId = null;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (e) {}
    }
    mediaRecorder = null;
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
    }
    analyser = null;
  }

  function toggleWisprDictation() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('⚠️ Speech Recognition is supported in Chrome / Edge.');
      return;
    }

    if (state.wispr.isListening) {
      state.wispr.isListening = false;
      state.wispr.interimText = '';
      if (recognition) {
        try { recognition.onend = null; recognition.stop(); } catch (e) {}
        recognition = null;
      }
      stopAudioVisualizerAndRecorder();

      const inp = $('#composerInput');
      const currentVal = inp ? inp.value.trim() : '';
      if (state.wispr.autoSend && currentVal) {
        const sendBtn = $('#btnSendNote');
        if (sendBtn) sendBtn.click();
      } else {
        renderMainChat();
        if (inp) {
          const freshInp = $('#composerInput');
          if (freshInp) {
            freshInp.value = currentVal;
            freshInp.focus();
          }
        }
      }
      showToast('⏹️ Wispr Flow Pro stopped');
      return;
    }

    state.wispr.isListening = true;
    state.wispr.panelOpen = true;
    state.wispr.sessionStartMs = now();
    state.wispr.interimText = '';
    saveWisprPrefs();

    const prevInputVal = ($('#composerInput') && $('#composerInput').value) || '';
    renderMainChat();
    const restoredInput = $('#composerInput');
    if (restoredInput) {
      restoredInput.value = prevInputVal;
      restoredInput.focus();
    }

    startAudioVisualizerAndRecorder();

    const startRecognitionInstance = () => {
      if (!state.wispr.isListening) return;
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        state.wispr.interimText = interim;
        const previewEl = $('#wisprLivePreview');
        if (previewEl) {
          previewEl.innerHTML = interim
            ? `<span class="wispr-interim-stream">🗣️ "${esc(interim)}"</span>`
            : `<span class="wispr-cmd-hint">💡 Listening continuously (Unlimited Words)...</span>`;
        }

        if (finalChunk.trim()) {
          const cmdCheck = checkAndExecuteVoiceCommand(finalChunk.trim());
          if (!cmdCheck.consumed && cmdCheck.text) {
            const polished = formatWithWisprStyle(cmdCheck.text);
            if (polished) {
              const wordsCount = polished.split(/\s+/).filter(Boolean).length;
              state.wispr.sessionWords += wordsCount;
              const inp = $('#composerInput');
              if (inp) {
                inp.value = inp.value ? `${inp.value.trim()} ${polished}` : polished;
              }
              const metricsEl = $('#wisprMetrics');
              if (metricsEl) {
                metricsEl.innerHTML = `<span><strong>${state.wispr.sessionWords}</strong> words</span><span>·</span><span>Unlimited Flow</span>`;
              }
            }
          }
        }
      };

      recognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          state.wispr.isListening = false;
          stopAudioVisualizerAndRecorder();
          renderMainChat();
          showToast('⚠️ Microphone permission denied.');
        }
      };

      recognition.onend = () => {
        if (state.wispr.isListening) {
          try {
            recognition.start();
          } catch (e) {
            setTimeout(startRecognitionInstance, 150);
          }
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    };

    startRecognitionInstance();
    if (window.soundMgr) window.soundMgr.playClick();
    showToast('🎙️ Wispr Flow Pro Active — Speak freely!');
  }

  function openWisprDictionaryModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';

    const renderDictModalContent = () => {
      backdrop.innerHTML = `
        <div class="forward-modal">
          <div class="forward-modal-header">
            <h3>📚 Wispr Flow Pro · Personal Dictionary</h3>
            <button type="button" class="btn-banner-clear" id="btnCloseWisprDict">✕</button>
          </div>
          <div style="font-size:12.5px; color:var(--nf-text-muted);">
            Teach Wispr Flow Pro your custom names, acronyms, and automatic phrase replacements:
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="dictSpokenInput" class="rename-input" placeholder="Spoken word (e.g. deped)">
            <input type="text" id="dictReplaceInput" class="rename-input" placeholder="Formatted (e.g. DepEd)">
            <button type="button" class="btn-composer-send" id="btnAddDictEntry" style="padding:8px 16px;">+ Add</button>
          </div>
          <div class="forward-profiles-list" style="max-height:240px;">
            ${state.wispr.dictionary.map((d, idx) => `
              <div class="forward-profile-row">
                <div style="font-size:13px; color:#fff;">
                  <span style="color:#ff858d;">"${esc(d.from)}"</span> → <strong style="color:#6ee7b7;">"${esc(d.to)}"</strong>
                </div>
                <button type="button" class="btn-note-delete" data-del-dict="${idx}" title="Remove word">🗑️</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const close = () => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
      $('#btnCloseWisprDict', backdrop).onclick = close;
      backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

      $('#btnAddDictEntry', backdrop).onclick = () => {
        const fromVal = $('#dictSpokenInput', backdrop).value.trim();
        const toVal = $('#dictReplaceInput', backdrop).value.trim();
        if (!fromVal || !toVal) return;
        state.wispr.dictionary.unshift({ from: fromVal, to: toVal });
        saveWisprPrefs();
        renderDictModalContent();
        renderMainChat();
        showToast(`📚 Taught Wispr Flow: "${fromVal}" → "${toVal}"`);
      };

      $$('[data-del-dict]', backdrop).forEach(btn => {
        btn.onclick = () => {
          const i = parseInt(btn.dataset.delDict, 10);
          state.wispr.dictionary.splice(i, 1);
          saveWisprPrefs();
          renderDictModalContent();
          renderMainChat();
        };
      });
    };

    renderDictModalContent();
    document.body.appendChild(backdrop);
  }

  // Cooldown timer starter
  function startCooldown(profile, minutes, displayLabel) {
    const durationMs = minutes * 60 * 1000;
    profile.timerUntil = now() + durationMs;
    profile.timerDurationMs = durationMs;
    profile.isReset = false;
    saveState();
    renderSidebar();
    renderMainChat();
    const labelStr = displayLabel || `${minutes}m`;
    showToast(`⏳ Cooldown set: ${labelStr} for ${profile.name}`);
    if (window.soundMgr) window.soundMgr.playClick();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  // Rename Profile Modal
  function promptRename(profile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rename-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="rename-dialog">
        <h3>✏️ Edit Chrome Profile Details</h3>
        <input type="text" id="renameVal" class="rename-input" value="${esc(profile.name)}" placeholder="Profile name">
        <input type="text" id="renameEmailVal" class="rename-input" value="${esc(profile.email || '')}" placeholder="Email or subtitle (optional)">
        <div class="rename-actions">
          <button class="btn-banner-clear" id="btnCancelRename">Cancel</button>
          <button class="btn-composer-send" id="btnConfirmRename" style="padding:8px 18px;">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const valInput = $('#renameVal', backdrop);
    const emailInput = $('#renameEmailVal', backdrop);
    valInput.focus();
    valInput.select();

    const closeDialog = () => {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    };

    const confirmRename = () => {
      const newName = valInput.value.trim();
      if (newName) {
        profile.name = newName;
        if (emailInput) profile.email = emailInput.value.trim();
        saveState();
        renderSidebar();
        renderMainChat();
        showToast(`Saved profile "${newName}"`);
      }
      closeDialog();
    };

    $('#btnCancelRename', backdrop).onclick = closeDialog;
    $('#btnConfirmRename', backdrop).onclick = confirmRename;
    valInput.onkeydown = (e) => {
      if (e.key === 'Enter') confirmRename();
      if (e.key === 'Escape') closeDialog();
    };
    if (emailInput) {
      emailInput.onkeydown = (e) => {
        if (e.key === 'Enter') confirmRename();
        if (e.key === 'Escape') closeDialog();
      };
    }
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeDialog();
    };
  }

  // 1-Second Timer Tick
  function timerTick() {
    const cur = now();
    let stateChanged = false;

    state.profiles.forEach(p => {
      if (p.timerUntil && p.timerUntil <= cur) {
        p.timerUntil = null;
        p.isReset = true;
        stateChanged = true;
        if (window.soundMgr) window.soundMgr.playReadyChime();
        showToast(`✨ Cooldown finished for ${p.name}! Limit Reset.`);
        triggerDesktopNotification(`🟢 Limit Reset: ${p.name}`, `${p.name} (${p.winShortcut}) is ready for work!`);
      }
    });

    if (stateChanged) {
      saveState();
      renderSidebar();
      renderMainChat();
    } else {
      const banner = $('.timer-active-banner strong');
      if (banner) {
        const active = getProfile(state.activeProfileId);
        if (active.timerUntil && active.timerUntil > cur) {
          banner.textContent = formatRemaining(active.timerUntil - cur);
        }
      }
    }

    renderClockBox();
  }

  // Event Listeners Setup
  function initEvents() {
    // Search input
    $('#profileSearch').oninput = (e) => {
      state.searchQuery = e.target.value;
      renderSidebar();
    };

    // Filter tabs
    const setFilter = (tab, filterName) => {
      state.currentFilter = filterName;
      $$('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSidebar();
    };

    $('#tabAll').onclick = () => setFilter($('#tabAll'), 'all');
    $('#tabPending').onclick = () => setFilter($('#tabPending'), 'pending');
    $('#tabTimers').onclick = () => setFilter($('#tabTimers'), 'timers');

    // Logo click resets filters
    $('#logoBtn').onclick = () => {
      state.searchQuery = '';
      $('#profileSearch').value = '';
      setFilter($('#tabAll'), 'all');
    };

    function isStandaloneMode() {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.navigator.standalone === true ||
        window.name === 'OrlandoChromeStandaloneWindow' ||
        window.location.search.includes('standalone=true')
      );
    }

    function updateLaunchButtonState() {
      const btn = $('#btnTopbarLaunchApp');
      if (!btn) return;
      const label = $('#topbarLaunchLabel') || btn.querySelector('.desktop-btn-label');
      const icon = $('#topbarLaunchIcon') || btn.querySelector('.desktop-btn-icon');
      if (!label) return;

      if (isStandaloneMode()) {
        btn.classList.add('btn-app-active');
        btn.title = 'OrlandoChrome (Main Web App) is Active';
        label.textContent = 'App Active';
        if (icon) {
          icon.innerHTML = '<svg class="modern-icon modern-icon-emerald" viewBox="0 0 24 24" style="width:13px;height:13px;stroke:#5de8a0"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        btn.classList.remove('btn-app-active');
        btn.title = 'Open OrlandoChrome (Main Web App)';
        label.textContent = 'Open Main Web App';
        if (icon) {
          icon.innerHTML = '<svg class="modern-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
        }
      }
    }

    async function handleLaunchStandaloneApp() {
      playSoundClick();

      if (isStandaloneMode()) {
        showToast('✨ OrlandoChrome is already running as Main Web App!');
        return;
      }

      // If PWA installation prompt is ready, offer native PWA installation
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        try {
          const choice = await deferredInstallPrompt.userChoice;
          if (choice && choice.outcome === 'accepted') {
            deferredInstallPrompt = null;
            updateLaunchButtonState();
            showToast('🎉 OrlandoChrome PWA Installed! Launching...');
            return;
          }
        } catch (err) {}
      }

      // Launch in dedicated Standalone Chromium App Window (No address bar, no tabs)
      const targetUrl = 'https://orlandopasion000.github.io/orlandochrome/?standalone=true';
      const windowFeatures = 'popup=yes,menubar=no,toolbar=no,location=no,status=no,personalbar=no,scrollbars=yes,resizable=yes,width=1180,height=820,left=120,top=80';
      const appWin = window.open(targetUrl, 'OrlandoChromeStandaloneWindow', windowFeatures);

      if (appWin) {
        showToast('🚀 Opening OrlandoChrome (Main Web App)...');
        try { appWin.focus(); } catch (err) {}
      } else {
        window.location.href = targetUrl;
      }
    }

    // Topbar App Suite, Next Ready, and Launch Desktop App Buttons
    const btnNextReady = $('#btnNextReady');
    if (btnNextReady) btnNextReady.onclick = () => jumpToNextReadyProfile();

    const btnLaunchDesktop = $('#btnTopbarLaunchApp');
    if (btnLaunchDesktop) {
      btnLaunchDesktop.onclick = (e) => {
        if (e) e.preventDefault();
        handleLaunchStandaloneApp();
      };
    }
    updateLaunchButtonState();

    const btnOpenSuite = $('#btnOpenAppSuite');
    if (btnOpenSuite) btnOpenSuite.onclick = () => openAppDistributionSuiteModal();

    // 4-Card Dock & App Distribution controls (Open Main Web App · No installation needed)
    const mainAppBtn = $('#openMainAppBtn') || $('#installAppBtn');
    if (mainAppBtn) {
      mainAppBtn.onclick = (e) => {
        if (e) e.preventDefault();
        handleLaunchStandaloneApp();
      };
    }

    const openQrBtn = $('#openQrBtn');
    if (openQrBtn) {
      openQrBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        openAppDistributionSuiteModal();
      };
    }

    const cardHoloQr = $('#cardHoloQr') || $('.dist-card-holo');
    if (cardHoloQr) {
      cardHoloQr.style.cursor = 'pointer';
      cardHoloQr.onclick = (e) => {
        if (e && e.target && e.target.closest('#shareAppBtn')) return;
        openAppDistributionSuiteModal();
      };
    }

    const shareAppBtn = $('#shareAppBtn');
    if (shareAppBtn) {
      shareAppBtn.onclick = () => {
        playSoundClick();
        const shareUrl = IS_BLANK_EDITION ? BLANK_APP_URL : LIVE_APP_URL;
        copyToClipboard(shareUrl, '📋 App link copied to clipboard!');
        const origText = shareAppBtn.innerHTML;
        shareAppBtn.innerHTML = `
          <svg class="modern-icon modern-icon-emerald" viewBox="0 0 24 24" style="width:13px;height:13px"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span style="color:#5de8a0;">✓ Link Copied!</span>
        `;
        shareAppBtn.style.borderColor = 'rgba(93, 232, 160, 0.6)';
        setTimeout(() => {
          shareAppBtn.innerHTML = origText;
          shareAppBtn.style.borderColor = '';
        }, 2200);
      };
    }

    const exportBtn = $('#exportBackupBtn');
    if (exportBtn) exportBtn.onclick = () => exportFullBackupJson();

    const importBtn = $('#importBackupBtn');
    const importFileInput = $('#importBackupFile');
    if (importBtn && importFileInput) {
      importBtn.onclick = () => importFileInput.click();
      importFileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const data = JSON.parse(re.target.result);
            if (Array.isArray(data.profiles)) {
              state.profiles = data.profiles;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`✓ Restored ${data.profiles.length} profiles from backup!`);
            } else {
              showToast('⚠️ Invalid backup JSON format.');
            }
          } catch (err) {
            showToast('⚠️ Failed to parse backup JSON.');
          }
        };
        reader.readAsText(file);
      };
    }

    const distSection = $('#appDistSection');
    const distHead = $('#distHead');
    const distMinBtn = $('#distMinimizeBtn');
    const distMinIcon = $('#distMinIcon');
    const distMinText = $('#distMinText');
    const DIST_MIN_KEY = 'orlandochrome_dist_minimized_v2';
    if (distSection && distMinBtn) {
      const applyMinState = (isMin) => {
        if (isMin) {
          distSection.classList.add('minimized');
          if (distMinIcon) distMinIcon.textContent = '▸';
          if (distMinText) distMinText.textContent = 'Expand';
          distMinBtn.setAttribute('aria-expanded', 'false');
          distSection.setAttribute('title', 'Click anywhere on this bar to expand App Distribution Suite');
        } else {
          distSection.classList.remove('minimized');
          if (distMinIcon) distMinIcon.textContent = '▾';
          if (distMinText) distMinText.textContent = 'Minimize';
          distMinBtn.setAttribute('aria-expanded', 'true');
          distSection.removeAttribute('title');
        }
      };

      // By default, it is MINIMIZED (true) unless user explicitly chose to expand ('0')
      const savedMin = localStorage.getItem(DIST_MIN_KEY);
      const isDefaultMin = savedMin === null ? true : savedMin === '1';
      applyMinState(isDefaultMin);

      const toggleMin = (e) => {
        if (e) e.stopPropagation();
        playSoundClick();
        const willMin = !distSection.classList.contains('minimized');
        applyMinState(willMin);
        try {
          localStorage.setItem(DIST_MIN_KEY, willMin ? '1' : '0');
        } catch (err) {}
      };

      // 1. Explicit minimize/expand button
      distMinBtn.onclick = toggleMin;

      // 2. Omni-Click Header: Clicking anywhere on the header bar toggles minimize/expand
      if (distHead) {
        distHead.onclick = (e) => {
          if (e.target.closest('#distMinimizeBtn')) return;
          toggleMin(e);
        };
      }

      // 3. When minimized, clicking ANYWHERE on the entire dock bar expands it
      distSection.onclick = (e) => {
        if (distSection.classList.contains('minimized')) {
          toggleMin(e);
        }
      };
    }

    // Adjustable Width Resizer Line Between Profiles (Sidebar) and Messages (Chat Main)
    const resizer = $('#workspaceResizer');
    const sidebar = $('#appSidebar');
    const SIDEBAR_WIDTH_KEY = 'orlandochrome_sidebar_width_v1';

    if (sidebar) {
      const applyClampedSavedWidth = () => {
        const savedWidth = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
        if (!isNaN(savedWidth) && savedWidth >= 115 && savedWidth <= 900) {
          const maxAllowed = Math.floor(window.innerWidth * (window.innerWidth <= 600 ? 0.44 : 0.56));
          const clamped = Math.max(window.innerWidth <= 600 ? 115 : 155, Math.min(savedWidth, maxAllowed));
          document.documentElement.style.setProperty('--sidebar-width', `${clamped}px`);
        }
      };
      applyClampedSavedWidth();
      window.addEventListener('resize', applyClampedSavedWidth);
    }

    if (resizer && sidebar) {
      let isDragging = false;

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const minW = window.innerWidth <= 600 ? 115 : 155;
        const maxW = Math.min(860, Math.floor(window.innerWidth * 0.64));
        const newWidth = Math.max(minW, Math.min(maxW, clientX));
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        resizer.classList.remove('dragging');
        document.body.classList.remove('is-resizing-pane');
        const currentW = sidebar.getBoundingClientRect().width;
        if (currentW >= 115) {
          try {
            localStorage.setItem(SIDEBAR_WIDTH_KEY, String(Math.round(currentW)));
          } catch (err) {}
        }
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      };

      const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;
        resizer.classList.add('dragging');
        document.body.classList.add('is-resizing-pane');
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
      };

      resizer.addEventListener('mousedown', startDrag);
      resizer.addEventListener('touchstart', startDrag, { passive: false });

      // Double-click resizer line to reset to default width
      resizer.addEventListener('dblclick', () => {
        document.documentElement.style.removeProperty('--sidebar-width');
        try {
          localStorage.removeItem(SIDEBAR_WIDTH_KEY);
        } catch (err) {}
        showToast('↔️ Reset profile list width to default');
      });
    }

    // Global Photo file uploader (Profile Avatar)
    $('#globalPhotoInput').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || !state.uploadTargetId) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        const target = getProfile(state.uploadTargetId);
        if (target) {
          target.customAvatar = base64;
          saveState();
          renderSidebar();
          renderMainChat();
          showToast(`✓ Photo updated for ${target.name}!`);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    });

    // Note Screenshot / Image file uploader
    const noteImgInput = $('#noteImageInput');
    if (noteImgInput) {
      noteImgInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const dataUrl = await compressImage(file);
        state.pendingAttachment = dataUrl;
        renderMainChat();
        showToast('📸 Screenshot ready — press Enter or Add ✓ to send!');
        e.target.value = '';
      });
    }

    // JSON Backup Restore Uploader (Enhancement #7)
    const backupInput = $('#backupJsonInput');
    if (backupInput) {
      backupInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            const profList = Array.isArray(parsed) ? parsed : parsed.profiles;
            if (Array.isArray(profList) && profList.length > 0) {
              state.profiles = profList;
              state.activeProfileId = state.profiles[0].id;
              if (Array.isArray(parsed.quickTemplates)) {
                state.quickTemplates = parsed.quickTemplates;
                saveTemplates();
              }
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`✅ Restored ${state.profiles.length} profiles from backup!`);
            } else {
              showToast('⚠️ Invalid backup JSON file.');
            }
          } catch (err) {
            showToast('⚠️ Could not parse JSON file.');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    // Blank Edition: Direct Chrome "Local State" File Parser (Detects Installed Laptop's Chrome Profiles in Browser!)
    const localStateInput = $('#localStateFileInput');
    if (localStateInput) {
      localStateInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            // Can be either Chrome's "Local State" file OR the JSON generated by our Taskbar Scanner script
            if (Array.isArray(data) && data.length > 0) {
              state.profiles = data.map((p, idx) => ({
                id: p.id || `b_slot_${idx + 1}`,
                profileDir: p.profileDir || `Profile ${idx + 1}`,
                chromeNo: idx + 1,
                taskbarSlot: p.taskbarSlot || (idx + 1),
                winShortcut: p.winShortcut || ((idx + 1) <= 9 ? `Win + ${idx + 1}` : `Slot #${idx + 1}`),
                name: p.name || `Chrome #${idx + 1}`,
                email: p.email || '',
                gaia: p.gaia || '',
                timerUntil: null,
                timerDurationMs: null,
                isReset: false,
                isPinned: false,
                pinnedAt: null,
                isUnread: false,
                stickyNote: '',
                customAvatar: null,
                notes: []
              }));
            } else if (data && data.profile && data.profile.info_cache) {
              const cache = data.profile.info_cache;
              let updatedCount = 0;
              // If in Personal Edition (22 real profiles), merge names and emails by matching profileDir!
              if (!IS_BLANK_EDITION && state.profiles.length > 0) {
                state.profiles.forEach(p => {
                  if (p.profileDir && cache[p.profileDir]) {
                    const info = cache[p.profileDir];
                    if (info.name && info.name !== p.name) {
                      p.name = info.name;
                      updatedCount++;
                    }
                    if (info.user_name) p.email = info.user_name;
                    if (info.gaia_name) p.gaia = info.gaia_name;
                  }
                });
                saveState();
                renderSidebar();
                renderMainChat();
                showToast(`✅ Synced ${updatedCount} profile name(s) from Chrome Local State!`);
                return;
              }

              // Otherwise in Blank Edition, build profile list from scratch
              const entries = Object.entries(cache);
              state.profiles = entries.map(([dir, info], idx) => {
                const slot = idx + 3;
                return {
                  id: `b_tb_${slot}`,
                  profileDir: dir,
                  chromeNo: idx + 1,
                  taskbarSlot: slot,
                  winShortcut: slot <= 9 ? `Win + ${slot}` : `Slot #${slot}`,
                  name: info.name || info.shortcut_name || dir,
                  email: info.user_name || info.gaia_name || dir,
                  gaia: info.gaia_name || '',
                  timerUntil: null,
                  timerDurationMs: null,
                  isReset: false,
                  isPinned: false,
                  pinnedAt: null,
                  isUnread: false,
                  stickyNote: '',
                  customAvatar: null,
                  notes: []
                };
              });
            } else {
              showToast('⚠️ Select Chrome "Local State" or a scanned taskbar JSON file.');
              return;
            }
            if (state.profiles.length > 0) {
              state.activeProfileId = state.profiles[0].id;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`🎉 Auto-detected ${state.profiles.length} Chrome profiles from this laptop!`);
            }
          } catch (err) {
            showToast('⚠️ Failed to parse Chrome Local State file.');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    // Global Ctrl+V Paste Screenshot Handler
    document.addEventListener('paste', async (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            const dataUrl = await compressImage(blob);
            state.pendingAttachment = dataUrl;
            const prevText = ($('#composerInput') && $('#composerInput').value) || '';
            renderMainChat();
            const inp = $('#composerInput');
            if (inp) {
              inp.value = prevText;
              inp.focus();
            }
            showToast('📸 Screenshot pasted from clipboard! Press Enter to add.');
          }
          break;
        }
      }
    });

    // Enhancement #6: Global Keyboard Shortcuts (Alt+Space Dictation, Alt+↑/↓ Profile Nav, Alt+N Next Ready)
    document.addEventListener('keydown', (e) => {
      // Undo & Redo Shortcuts: Ctrl+Z / Cmd+Z and Ctrl+Y / Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          historyMgr.undo();
          return;
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          historyMgr.redo();
          return;
        }
      }
      if ((e.altKey && e.code === 'Space') || (e.ctrlKey && e.shiftKey && e.code === 'Space')) {
        e.preventDefault();
        toggleWisprDictation();
      } else if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const items = $$('#profileList .profile-item');
        if (!items.length) return;
        const curIdx = items.findIndex(el => el.dataset.id === state.activeProfileId);
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const nextIdx = (curIdx + delta + items.length) % items.length;
        const nextId = items[nextIdx].dataset.id;
        state.activeProfileId = nextId;
        renderSidebar();
        renderMainChat();
        const activeEl = $(`#profileList .profile-item[data-id="${nextId}"]`);
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        jumpToNextReadyProfile();
      }
    });

    // Live Cross-Tab Storage Sync for OrlandoRecharge (dra-schedule, dra-off, dra-days, dra-clock-theme)
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('dra-')) {
        renderClockBox();
      }
    });

    // Browser Back Button (popstate) support for Mobile Chat -> Profile List
    window.addEventListener('popstate', () => {
      if (window.innerWidth <= 768 && document.body.classList.contains('mobile-chat-open')) {
        closeMobileChatWithSlide();
      }
    });
  }

  // =========================================================================
  // 📱 NATIVE iOS MESSENGER / FACEBOOK GESTURE NAVIGATION ENGINE
  // - Interactive Edge Swipe-Back (Finger-Tracking + Parallax + Mid-Swipe Cancel)
  // - Right-Edge Swipe-In (Pull Active Chat Back from Profile List)
  // - Swipe-to-Reply / Quick Action on Message Bubbles
  // - Swipe-to-Reveal Actions on Sidebar Profile Rows
  // - Horizontal Paging on Chat Header (Prev/Next Profile) & Filter Tabs
  // =========================================================================
  function initGestureNavigation() {
    const workspace = $('#appWorkspace');
    const edgeIndicator = $('#iosEdgeSwipeIndicator');
    if (!workspace) return;

    let mode = null; // 'edge-pop' | 'edge-push' | 'note-swipe' | 'profile-swipe' | 'header-page' | 'filter-page'
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocityX = 0;
    let currentDx = 0;
    let activeEl = null;
    let activeContainer = null;

    workspace.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = startX;
      lastTime = performance.now();
      velocityX = 0;
      currentDx = 0;
      mode = null;
      activeEl = null;
      activeContainer = null;

      const isMobile = window.innerWidth <= 768;
      const isChatOpen = document.body.classList.contains('mobile-chat-open');
      const target = e.target;

      // Ignore touches inside horizontal scroll strips, resizer, or text inputs/sliders
      if (target.closest('#workspaceResizer, .templates-chips-scroll, input, textarea, audio')) {
        startX = 0;
        return;
      }

      // 1. Message Bubble Swipe Candidate (Messenger Swipe-to-Reply / Quick Action)
      const noteWrap = target.closest('.note-item-wrap');
      if (noteWrap && !target.closest('.note-inline-editor, .note-reaction-picker')) {
        mode = 'note-candidate';
        activeContainer = noteWrap;
        activeEl = $('.note-bubble', noteWrap);
        return;
      }

      // 2. Sidebar Profile Row Swipe Candidate (Messenger Chat List Swipe Actions)
      const profSwipeWrap = target.closest('.profile-item-swipe-container');
      if (profSwipeWrap) {
        mode = 'profile-candidate';
        activeContainer = profSwipeWrap;
        activeEl = $('.profile-item', profSwipeWrap);
        return;
      }

      // 3. Chat Header or Chat Area Horizontal Paging (Swipe Left/Right to Switch Profiles with Finger-Tracking & Cancel)
      if (target.closest('#chatHeaderBar') || target.closest('#chatMain')) {
        mode = 'header-candidate';
        return;
      }

      // 4. Sidebar Header Filter Paging (All <-> Pending <-> Timers)
      if (target.closest('.sidebar-header')) {
        mode = 'filter-candidate';
        return;
      }
    }, { passive: true });

    workspace.addEventListener('touchmove', (e) => {
      if (!startX || !mode || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      const dx = x - startX;
      const dy = y - startY;

      const nowT = performance.now();
      const dt = Math.max(1, nowT - lastTime);
      velocityX = (x - lastX) / dt;
      lastX = x;
      lastTime = nowT;

      const chatMain = $('#chatMain');

      // Promote candidate to active gesture once horizontal intent is clear
      if (mode.endsWith('-candidate')) {
        if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {
          startX = 0;
          mode = null;
          return;
        }
        if (Math.abs(dx) < 10) return;

        if (mode === 'note-candidate' && Math.abs(dx) > Math.abs(dy) * 1.35) {
          mode = 'note-swipe';
        } else if (mode === 'profile-candidate' && Math.abs(dx) > Math.abs(dy) * 1.35) {
          mode = 'profile-swipe';
        } else if (mode === 'header-candidate' && Math.abs(dx) > Math.abs(dy) * 1.4) {
          mode = 'header-page';
        } else if (mode === 'filter-candidate' && Math.abs(dx) > Math.abs(dy) * 1.35) {
          mode = 'filter-page';
        } else {
          return;
        }
      }

      currentDx = dx;

      // Handle Active Gesture Modes
      if (mode === 'header-page' && chatMain) {
        if (e.cancelable) e.preventDefault();
        const damped = Math.sign(dx) * Math.min(72, Math.pow(Math.abs(dx), 0.82) * 1.15);
        chatMain.style.transition = 'none';
        chatMain.style.transform = `translate3d(${damped}px, 0, 0)`;
        if (edgeIndicator) {
          const absDx = Math.abs(dx);
          edgeIndicator.style.opacity = String(Math.min(1, absDx / 56));
          edgeIndicator.style.transform = `translate3d(12px, -50%, 0) scale(${0.85 + Math.min(0.22, absDx / 220)})`;
          const chev = $('.ios-edge-chevron', edgeIndicator);
          if (chev) chev.textContent = dx > 0 ? '‹' : '›';
          edgeIndicator.classList.toggle('ready', absDx >= 52);
        }
      } else if (mode === 'note-swipe' && activeEl && activeContainer) {
        if (e.cancelable) e.preventDefault();
        const damped = Math.sign(dx) * Math.min(130, Math.pow(Math.abs(dx), 0.86) * 1.45);
        activeEl.style.transition = 'none';
        activeEl.style.transform = `translate3d(${damped}px, 0, 0)`;

        const leftInd = $('.note-swipe-indicator.left-ind', activeContainer);
        const rightInd = $('.note-swipe-indicator.right-ind', activeContainer);
        const nid = activeContainer.dataset.nid;
        const prof = getProfile(state.activeProfileId);
        const note = (prof.notes || []).find(n => n.id === nid);

        if (dx > 0 && leftInd) {
          leftInd.style.opacity = String(Math.min(1, dx / 58));
          leftInd.style.transform = `translateY(-50%) scale(${Math.min(1.08, 0.8 + dx / 180)})`;
          const span = $('span', leftInd);
          if (span) {
            span.textContent = dx > 108 ? '↪ Forward' : (note && note.done ? '↩ Reopen' : '✓ Done');
          }
          leftInd.classList.toggle('triggered', dx >= 58);
          if (rightInd) rightInd.style.opacity = '0';
        } else if (dx < 0 && rightInd) {
          const absDx = Math.abs(dx);
          rightInd.style.opacity = String(Math.min(1, absDx / 58));
          rightInd.style.transform = `translateY(-50%) scale(${Math.min(1.08, 0.8 + absDx / 180)})`;
          const span = $('span', rightInd);
          if (span) {
            span.textContent = absDx > 108 ? '🗑️ Delete' : '↪ Forward';
          }
          rightInd.classList.toggle('triggered', absDx >= 58);
          if (leftInd) leftInd.style.opacity = '0';
        }
      } else if (mode === 'profile-swipe' && activeEl && activeContainer) {
        if (e.cancelable) e.preventDefault();
        const damped = Math.sign(dx) * Math.min(115, Math.pow(Math.abs(dx), 0.86) * 1.35);
        activeEl.style.transition = 'none';
        activeEl.style.transform = `translate3d(${damped}px, 0, 0)`;
        const leftTray = $('.profile-swipe-tray.left-tray', activeContainer);
        const rightTray = $('.profile-swipe-tray.right-tray', activeContainer);
        if (dx > 0 && leftTray) {
          leftTray.style.opacity = String(Math.min(1, dx / 60));
          leftTray.classList.toggle('triggered', dx >= 64);
          if (rightTray) rightTray.style.opacity = '0';
        } else if (dx < 0 && rightTray) {
          const absDx = Math.abs(dx);
          rightTray.style.opacity = String(Math.min(1, absDx / 60));
          rightTray.classList.toggle('triggered', absDx >= 64);
          if (leftTray) leftTray.style.opacity = '0';
        }
      }
    }, { passive: false });

    const finishGesture = () => {
      if (!mode) {
        startX = 0;
        return;
      }

      const chatMain = $('#chatMain');

      if (edgeIndicator) {
        edgeIndicator.style.opacity = '0';
        edgeIndicator.style.transform = 'translate3d(-24px, -50%, 0) scale(0.8)';
        edgeIndicator.classList.remove('ready');
      }

      if (mode === 'header-page' && chatMain) {
        chatMain.style.transition = 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)';
        chatMain.style.transform = '';
        if (window.innerWidth <= 768 && document.body.classList.contains('mobile-chat-open')) {
          // In iOS/Mobile inside a message: swiping left OR swiping right goes back to all profiles!
          if (Math.abs(currentDx) >= 38 || Math.abs(velocityX) >= 0.25) {
            closeMobileChatWithSlide();
            return;
          }
        }
        if ((currentDx <= -52 || (currentDx <= -28 && velocityX < -0.42)) && velocityX <= 0.1) {
          stepProfile(1);
        } else if ((currentDx >= 52 || (currentDx >= 28 && velocityX > 0.42)) && velocityX >= -0.1) {
          stepProfile(-1);
        }
      } else if (mode === 'note-swipe' && activeEl && activeContainer) {
        activeEl.style.transition = 'transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)';
        activeEl.style.transform = '';
        const leftInd = $('.note-swipe-indicator.left-ind', activeContainer);
        const rightInd = $('.note-swipe-indicator.right-ind', activeContainer);
        if (leftInd) { leftInd.style.opacity = '0'; leftInd.classList.remove('triggered'); }
        if (rightInd) { rightInd.style.opacity = '0'; rightInd.classList.remove('triggered'); }

        const nid = activeContainer.dataset.nid;
        const prof = getProfile(state.activeProfileId);
        const note = (prof.notes || []).find(n => n.id === nid);
        if (note) {
          if (currentDx >= 108 && velocityX >= -0.15) {
            openForwardModal(prof, note);
          } else if (currentDx >= 58 && velocityX >= -0.15) {
            note.done = !note.done;
            triggerHaptic('success');
            if (note.done && window.soundMgr) window.soundMgr.playReadyChime();
            if (countPending(prof) === 0) {
              prof.isPinned = false;
              prof.pinnedAt = null;
            }
            saveState();
            renderSidebar();
            renderMainChat();
            showToast(note.done ? '✓ Marked note Done' : '↩ Reopened note');
          } else if (currentDx <= -58 && velocityX <= 0.15) {
            triggerHaptic('medium');
            const noteIdx = (prof.notes || []).findIndex(n => n.id === note.id);
            if (noteIdx !== -1) {
              const deletedNote = JSON.parse(JSON.stringify(prof.notes[noteIdx]));
              addToTrash(deletedNote, prof);
              historyMgr.record({
                type: 'DELETE_NOTE',
                profileId: prof.id,
                note: deletedNote,
                index: noteIdx
              });
              prof.notes.splice(noteIdx, 1);
              if (countPending(prof) === 0) {
                prof.isPinned = false;
                prof.pinnedAt = null;
              }
              if (!hasMessages(prof)) {
                prof.isUnread = false;
              }
              saveState();
              renderSidebar();
              renderMainChat();
              showActionToast({
                message: '🗑️ Deleted note',
                actionText: '↩ Undo',
                duration: 2000,
                onAction: () => historyMgr.undo()
              });
            }
          }
        }
      } else if (mode === 'profile-swipe' && activeEl && activeContainer) {
        activeEl.style.transition = 'transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)';
        activeEl.style.transform = '';
        const leftTray = $('.profile-swipe-tray.left-tray', activeContainer);
        const rightTray = $('.profile-swipe-tray.right-tray', activeContainer);
        if (leftTray) { leftTray.style.opacity = '0'; leftTray.classList.remove('triggered'); }
        if (rightTray) { rightTray.style.opacity = '0'; rightTray.classList.remove('triggered'); }

        const pid = activeContainer.dataset.swipePid;
        const prof = getProfile(pid);
        if (prof && Math.abs(currentDx) >= 64) {
          activeEl.dataset.justSwiped = '1';
          if (currentDx >= 64 && velocityX >= -0.15) {
            if (countPending(prof) > 0) {
              prof.isPinned = !prof.isPinned;
              prof.pinnedAt = prof.isPinned ? now() : null;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(prof.isPinned ? `📌 Pinned ${prof.name} to top` : `Returned ${prof.name} to ${prof.winShortcut}`);
            } else if (hasMessages(prof)) {
              prof.isUnread = !prof.isUnread;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(prof.isUnread ? `● Marked ${prof.name} as Unread` : `✓ Marked ${prof.name} as Read`);
            } else {
              openMobileChatWithSlide(prof.id);
            }
          } else if (currentDx <= -64 && velocityX <= 0.15) {
            const cur = now();
            if ((prof.timerUntil && prof.timerUntil > cur) || prof.isReset) {
              prof.timerUntil = null;
              prof.timerDurationMs = null;
              prof.isReset = false;
              saveState();
              renderSidebar();
              renderMainChat();
              showToast(`✕ Cleared timer on ${prof.name}`);
            } else {
              startCooldown(prof, 45, '45m');
            }
          }
        }
      } else if (mode === 'filter-page') {
        const order = ['all', 'pending', 'timers'];
        const idx = order.indexOf(state.currentFilter);
        if (currentDx <= -48 && idx < order.length - 1) {
          const nextTab = order[idx + 1];
          const btn = nextTab === 'pending' ? $('#tabPending') : $('#tabTimers');
          if (btn) btn.click();
        } else if (currentDx >= 48 && idx > 0) {
          const prevTab = order[idx - 1];
          const btn = prevTab === 'all' ? $('#tabAll') : $('#tabPending');
          if (btn) btn.click();
        }
      }

      mode = null;
      startX = 0;
      currentDx = 0;
      activeEl = null;
      activeContainer = null;
    };

    workspace.addEventListener('touchend', finishGesture, { passive: true });
    workspace.addEventListener('touchcancel', finishGesture, { passive: true });
  }

  // Initializer
  function init() {
    document.title = IS_BLANK_EDITION ? 'OrlandoChrome (Blank Canvas)' : 'OrlandoChrome (Main Version)'; // Immediate 0ms Title
    loadState();
    
    // Dynamic iOS Virtual Keyboard Viewport Handler
    if (window.visualViewport) {
      const handleVP = () => {
        if (window.innerWidth <= 768) {
          const vp = window.visualViewport;
          const workspace = $('#appWorkspace');
          const keyboardShowing = (window.innerHeight - vp.height) > 80;
          if (keyboardShowing) {
            document.body.classList.add('mobile-typing-mode');
            if (workspace) {
              workspace.style.height = `${vp.height}px`;
              workspace.style.maxHeight = `${vp.height}px`;
            }
            const stream = $('#notesStream');
            if (stream) stream.scrollTop = stream.scrollHeight;
          } else {
            if (!document.activeElement || document.activeElement.id !== 'composerInput') {
              document.body.classList.remove('mobile-typing-mode');
            }
            if (workspace) {
              workspace.style.height = '';
              workspace.style.maxHeight = '';
            }
          }
        }
      };
      window.visualViewport.addEventListener('resize', handleVP);
      window.visualViewport.addEventListener('scroll', handleVP);
    }
    if (window.innerWidth <= 768) {
      let savedView = 'inbox';
      try { savedView = localStorage.getItem('orlandochrome_mobile_view') || 'inbox'; } catch (e) {}
      if (savedView === 'chat') {
        document.body.classList.add('mobile-chat-open');
      } else {
        document.body.classList.remove('mobile-chat-open');
      }
    } else {
      document.body.classList.remove('mobile-chat-open');
    }
    initEvents();
    initGestureNavigation();
    initShakeToUndo();
    renderSidebar();
    renderMainChat();
    updateTrashBadge();
    renderClockBox();
    initCloudSync();
    initLiveBridge();
    broadcastLiveBridgeStatus();

    window.__ocState = state;
    window.__ocSaveState = saveState;
    window.__ocRenderMainChat = renderMainChat;
    window.__ocRenderSidebar = renderSidebar;
  window.__ocShowPendingPopover = showPendingTasksPopover;
    window.__ocSelectProfile = selectProfile;
    window.__ocSaveState = saveState;
    window.__ocUpdateDocumentTitle = updateDocumentTitle;
    window.__ocBroadcastLiveBridgeStatus = broadcastLiveBridgeStatus;

    setInterval(timerTick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
