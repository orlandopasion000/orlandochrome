# ⚡ OrlandoChrome (OC) · Chrome Taskbar Notes & Waitboard

> **Live Web App**: [https://orlandopasion000.github.io/orlandochrome](https://orlandopasion000.github.io/orlandochrome)

![Chrome Taskbar Command Center](https://img.shields.io/badge/Chrome_Profiles-25_Detected-gold?style=for-the-badge&logo=googlechrome)
![Windows Taskbar Sync](https://img.shields.io/badge/Windows-Taskbar_Synced-0078D4?style=for-the-badge&logo=windows)
![Real-time WebSockets](https://img.shields.io/badge/WebSockets-Live_Bidirectional-3DDC97?style=for-the-badge)

---

## 💡 The Core Problem

When working with **22+ Chrome profiles** pinned side-by-side across the Windows taskbar (for AI models, dissertation research, DepEd school administration, lesson planning, and ministry work):
1. **AI Rate Limits & Cooldowns**: You hit message limits on ChatGPT, Claude, Perplexity, or Gemini, and need to know exactly when each profile becomes ready again.
2. **Taskbar Guesswork**: It's hard to remember which taskbar icon (#1 through #25) belongs to which task, email, or project.
3. **Lost Context**: When a profile hits a limit, you need to seamlessly hand off the prompt to the next free profile without losing your place.
4. **Window Switching Friction**: Alt-tabbing or guessing which pinned Chrome icon to click wastes valuable focus.

---

## ⚡ The Solution

**Chrome Taskbar Command Center & Live Waitboard** unifies your 22+ taskbar profiles into an intelligent, live-synced desktop system:

```mermaid
flowchart TD
    subgraph Windows_Desktop [Windows Desktop & Taskbar]
        TB[Windows Taskbar: 22+ Pinned Chrome Icons]
        P1["Taskbar #1: Orlando (A2 000)"]
        P2["Taskbar #2: Orlando (A1 001 DepEd)"]
        P6["Taskbar #6: Nash (Nash Reviewer)"]
        P16["Taskbar #16: Orlando (A6 scite002)"]
    end

    subgraph Hub [Command Center Local Service (Node.js :48100)]
        Scanner[Profile & Shortcut Auto-Scanner]
        WinMgr[Win32 Window Manager & Focus Engine]
        WSHub[Real-time WebSocket Hub]
        Store[State Store & Cooldown Engine]
    end

    subgraph Dashboard [Command Center Visual UI]
        Adv["Open This Next" Advisor Card]
        Dock[22+ Taskbar Visual Dock Bar]
        Countdowns[Live Cooldown Tickers]
        Handoffs[Handoff Cards & Prompt Queue]
    end

    subgraph Companion [Chrome Companion Extension]
        Ext1[Rate Limit Auto-Detector]
        Ext2[1-Click Cooldown Toolbar Popup]
        Ext3[Active Tab & Focus Heartbeat]
    end

    TB --> Scanner
    Scanner --> Store
    Store <--> WSHub
    WSHub <--> Dashboard
    WSHub <--> Companion
    Dashboard --> WinMgr
    WinMgr --> Windows_Desktop
```

---

## ✨ Key Features

### 1. 🎯 Windows Taskbar Alignment (#1 to #25)
- Automatically scans your Windows `ImplicitAppShortcuts` and Chrome `Local State`.
- Discovers and maps all 25 pinned profiles from left to right with their exact profile directories (`Profile 1`, `Profile 16`, `Profile 39`...), display names, and Google account emails.
- Every profile in the dock displays its exact taskbar position badge (`#1`, `#2`, ..., `#25`) corresponding to `Win + 1`, `Win + 2`, etc.

### 2. ⏱️ Real-Time Cooldown Waitboard
- Live countdown timers (hh:mm:ss) updating every second.
- Preset 1-click cooldown buttons: `30m`, `1h`, `2h`, `3h` (Standard), `5h` (Claude), and `24h`.
- Clear status rings:
  - 🟢 **Ready**: Free to work, cooldown expired.
  - 🟡 **In Cooldown**: Active timer counting down.
  - 🔵 **Working**: Active task in progress.
  - 🟣 **Focused**: Currently open in the foreground.
- Synthesized Web Audio chimes and Windows desktop notifications when a profile becomes ready.

### 3. 🧠 "Open This Next" Smart Advisor
- Intelligently recommends the best profile to open next based on:
  - Which profiles are free right now.
  - Queued prompts and saved handoffs.
  - Upcoming deadlines with automatic urgency risk scoring.
- Displays a prominent hero card with one-click **"Launch / Focus Chrome"** and **"Copy Prompt"**.

### 4. ⚡ Live Bidirectional Communication Bridge
- **Local WebSocket Server (`ws://127.0.0.1:48100/ws`)**: Zero-latency broadcast of state updates.
- **Chrome Companion Extension (Manifest V3)**:
  - Injected on Claude, ChatGPT, Gemini, and Perplexity.
  - Detects AI rate-limit messages automatically and surfaces a 1-click floating button to start a cooldown.
  - Toolbar popup lets you trigger cooldowns or check the next ready profile without leaving your current tab.
- **System Window Manager**: Clicking any profile in the dashboard uses Windows Win32 APIs to bring that specific Chrome profile window directly to the front.

### 5. 📌 Handoff Cards & Prompt Queue
- Never lose context: record "Done so far", "Next step", and a "Paste-ready continuation prompt".
- Transfer prompts into the next ready profile in a single click.

### 6. 📅 Auto Day Plan
- Automatically schedules your day into time blocks (e.g. 08:00 to 18:00 in 60-minute blocks), interleaving profiles so waiting time on one profile becomes active work time on another.

### 7. 📝 DepEd & Institutional File Name Checker
- Enforces institutional file naming rules: 39-character limit, spaces only, no forbidden tags (`FINAL`, `COPY`, `(1)`), and lowercase versioning (`v2`).

---

## 🚀 Quick Start (1-Click Run)

### Prerequisites
- Windows 10 or 11
- [Node.js](https://nodejs.org/) (v18+)

### Running the App
1. Clone or download this repository:
   ```bash
   git clone https://github.com/orlandopasion000/chrome-taskbar-command-center.git
   cd chrome-taskbar-command-center
   ```
2. Double-click **`start.bat`** (or run `npm start`).
3. The server starts at `http://127.0.0.1:48100` and automatically opens the Command Center in your browser!

---

## 🧩 Installing the Chrome Companion Extension

To enable live rate-limit detection and toolbar controls across your Chrome profiles:
1. Open Chrome and navigate to:
   ```text
   chrome://extensions
   ```
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left).
4. Select the **`extension`** folder inside this repository.
5. In the extension popup, select which taskbar profile this window belongs to (e.g. `Taskbar #2: Orlando A1 DepEd`).
6. A green live dot will appear on that profile in your Command Center dock!

---

## 📂 Repository Structure

```text
chrome-taskbar-command-center/
├── start.bat                   # 1-Click Windows launcher
├── package.json                # Project configuration & dependencies
├── server/
│   ├── server.js               # Node.js HTTP & WebSocket server (:48100)
│   ├── profileScanner.js       # Auto-scans Chrome Local State & Windows Taskbar pins
│   ├── windowManager.js        # Launches & focuses Chrome profile windows via Windows APIs
│   └── stateStore.js           # State persistence and live update manager
├── public/
│   ├── index.html              # Unified Command Center & Waitboard dashboard
│   ├── app.js                  # Frontend client engine, WebSocket sync & tickers
│   ├── styles.css              # Dark theme with gold accents & taskbar dock styling
│   └── sound.js                # Synthesized Web Audio notification chime
├── extension/
│   ├── manifest.json           # Manifest V3 extension
│   ├── background.js           # Background service worker connected to WebSocket
│   ├── content.js              # Auto rate-limit detector on AI platforms
│   ├── popup.html              # Toolbar popup UI
│   └── popup.js                # Toolbar popup logic
└── bin/
    └── start.cmd               # Command-line launcher
```

---

## 📡 REST & WebSocket API Reference

The local server exposes standard endpoints on port `48100`:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/state` | GET | Returns full system state, all profiles, and active running processes. |
| `POST /api/launch` | POST | `{ profileDir, url }` - Focuses or launches a Chrome profile window. |
| `POST /api/action` | POST | Handles state actions (`hitLimit`, `markReady`, `refreshProfiles`, `addTodo`...). |
| `POST /api/extension/event` | POST | Receives heartbeats and active tab reports from the companion extension. |
| `ws://127.0.0.1:48100/ws` | WS | Real-time bidirectional WebSocket event stream. |

---

## 👤 Author
- **Orlando V. Pasion, Jr.** ([@orlandopasion000](https://github.com/orlandopasion000))
- Built for power-users running 22+ parallel Chrome profiles on Windows.
