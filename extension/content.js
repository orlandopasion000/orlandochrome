// Content Script for Auto Rate-Limit Detection on AI Platforms
(function() {
  const PATTERNS = [
    /you(?:'ve| have) reached (?:your|the) (?:message )?limit/i,
    /out of messages until/i,
    /usage limit/i,
    /try again (?:in|after|at)/i,
    /rate limit reached/i,
    /too many requests/i
  ];

  let bannerShown = false;

  function checkForLimit() {
    if (bannerShown) return;

    const pageText = document.body ? document.body.innerText : '';
    const isLimited = PATTERNS.some(p => p.test(pageText));

    if (isLimited) {
      showLimitBanner();
    }
  }

  function showLimitBanner() {
    if (bannerShown) return;
    bannerShown = true;

    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #14213D;
      color: #EDF1FA;
      border: 2px solid #C9A227;
      border-radius: 12px;
      padding: 12px 18px;
      z-index: 9999999;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    bar.innerHTML = `
      <div>
        <b style="color:#E8C55A">⏱️ Limit Detected</b>
        <div style="font-size:12px;color:#9AA6C3;">Start cooldown in Taskbar Command Center?</div>
      </div>
      <button id="btnStartCooldown" style="background:#C9A227;color:#14213D;border:none;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer;">Start 3h Cooldown</button>
      <button id="btnCloseBanner" style="background:none;border:none;color:#9AA6C3;cursor:pointer;font-size:16px;">✕</button>
    `;

    document.body.appendChild(bar);

    bar.querySelector('#btnStartCooldown').onclick = () => {
      chrome.runtime.sendMessage({
        type: 'START_COOLDOWN',
        hours: 3.0,
        task: document.title || 'AI Task'
      }, () => {
        bar.innerHTML = '<b style="color:#3DDC97">✓ Cooldown started! Command Center notified.</b>';
        setTimeout(() => bar.remove(), 2500);
      });
    };

    bar.querySelector('#btnCloseBanner').onclick = () => {
      bar.remove();
    };
  }

  // Observe page mutations (e.g. dynamic message responses)
  const observer = new MutationObserver(() => {
    checkForLimit();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  setTimeout(checkForLimit, 2000);
})();
