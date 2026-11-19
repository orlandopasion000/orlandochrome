/**
 * RelativeTimeEngine — Universal Live Relative Timestamp Formatter
 * Seamlessly formats & live-updates relative times ('just now', '3m ago', '2h ago', '4d ago')
 * across all OVPJ ecosystem apps with zero page reloads, 60s background tick,
 * and immediate re-calculation on tab focus & user interactions.
 *
 * @author Sir Orlando V. Pasion, Jr. & Antigravity
 */
(function(global) {
  'use strict';

  function parseTime(input) {
    if (!input && input !== 0) return null;
    if (typeof input === 'number') return input;
    if (input instanceof Date) return input.getTime();
    var num = Number(input);
    if (!isNaN(num) && isFinite(num) && num > 1000000000) return num;
    var parsed = Date.parse(input);
    return isNaN(parsed) ? null : parsed;
  }

  function formatRelativeTime(input, options) {
    var time = parseTime(input);
    if (time === null) return '';
    var now = Date.now();
    var diffSec = Math.floor((now - time) / 1000);
    var compact = options && options.compact;

    if (diffSec < 0) {
      var absDiff = Math.abs(diffSec);
      if (absDiff < 45) return compact ? 'now' : 'in a moment';
      var mins = Math.floor(absDiff / 60);
      if (mins < 60) return compact ? ('in ' + mins + 'm') : ('in ' + mins + ' min' + (mins > 1 ? 's' : ''));
      var hours = Math.floor(mins / 60);
      if (hours < 24) return compact ? ('in ' + hours + 'h') : ('in ' + hours + ' hr' + (hours > 1 ? 's' : ''));
      var days = Math.floor(hours / 24);
      return compact ? ('in ' + days + 'd') : ('in ' + days + ' day' + (days > 1 ? 's' : ''));
    }

    if (diffSec < 45) return compact ? 'just now' : 'just now';
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return compact ? (diffMin + 'm') : (diffMin + 'm ago');
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return compact ? (diffHr + 'h') : (diffHr + 'h ago');
    var diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return compact ? (diffDay + 'd') : (diffDay + 'd ago');
    var diffWk = Math.floor(diffDay / 7);
    if (diffWk < 4) return compact ? (diffWk + 'w') : (diffWk + 'w ago');
    var diffMo = Math.floor(diffDay / 30);
    if (diffMo < 12) return compact ? (diffMo + 'mo') : (diffMo + 'mo ago');
    var diffYr = Math.floor(diffDay / 365);
    return compact ? (diffYr + 'y') : (diffYr + 'y ago');
  }

  function updateAll(root) {
    var context = root || (typeof document !== 'undefined' ? document : null);
    if (!context || !context.querySelectorAll) return;
    var elements = context.querySelectorAll('[data-relative-time]');
    elements.forEach(function(el) {
      var raw = el.getAttribute('data-relative-time');
      if (!raw) return;
      var compact = el.getAttribute('data-relative-compact') === 'true' || el.getAttribute('data-relative-format') === 'compact';
      var prefix = el.getAttribute('data-relative-prefix') || '';
      var suffix = el.getAttribute('data-relative-suffix') || '';
      var formatted = formatRelativeTime(raw, { compact: compact });
      if (formatted) {
        el.textContent = prefix + formatted + suffix;
      }
    });
  }

  var intervalId = null;
  function startTicker(intervalMs) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(function() {
      updateAll();
    }, intervalMs || 60000);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        updateAll();
        startTicker(60000);
      });
    } else {
      updateAll();
      startTicker(60000);
    }

    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        updateAll();
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', function() {
        updateAll();
      });
    }
  }

  var RelativeTime = {
    parseTime: parseTime,
    format: formatRelativeTime,
    updateAll: updateAll,
    startTicker: startTicker
  };

  global.RelativeTime = RelativeTime;
  global.formatRelativeTime = formatRelativeTime;
  global.updateRelativeTimestamps = updateAll;

})(typeof window !== 'undefined' ? window : this);
