/**
 * BEEJ SANGH — PROJECT-WIDE DATE FORMAT (dd/mm/yy)
 * Data keeps ISO dates ("2026-08-25") so sorting, comparisons and <input type="date"> keep working.
 * Only what the user SEES is converted to dd/mm/yy:
 *   - App.fmtDate(value)      → one date ("2026-08-25", Date, "25/8/2026", ISO date-time) → "25/08/26"
 *   - App.fmtDateText(text)   → every date found inside a piece of text / HTML
 *   - a MutationObserver re-formats dates in any text that appears on the page (all pages, popups,
 *     success screens), so no page needs its own formatting code.
 * Downloads / print windows call App.fmtDateText on their content.
 */
'use strict';
(function () {
  if (typeof App === 'undefined') return;

  var pad = function (n) { return String(n).padStart(2, '0'); };
  var ok = function (d, m) { return d >= 1 && d <= 31 && m >= 1 && m <= 12; };
  var out = function (d, m, y) { return pad(d) + '/' + pad(m) + '/' + pad(Number(y) % 100); };

  // One value → "dd/mm/yy". Returns the input unchanged if it is not a recognisable date.
  App.fmtDate = function (v) {
    if (v === null || v === undefined || v === '' || v === '-' || v === '—') return v;
    if (Object.prototype.toString.call(v) === '[object Date]') return isNaN(v) ? '' : out(v.getDate(), v.getMonth() + 1, v.getFullYear());
    var s = String(v).trim(), m;
    if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ][\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/)) && ok(+m[3], +m[2])) {
      if (s.length > 10) { var d = new Date(s); if (!isNaN(d)) return out(d.getDate(), d.getMonth() + 1, d.getFullYear()); }
      return out(+m[3], +m[2], m[1]);
    }
    if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) && ok(+m[1], +m[2])) return out(+m[1], +m[2], m[3]);
    return v;
  };

  // Every date inside a text → "dd/mm/yy".
  //   2026-08-25 (optionally with a time part)  and  25/8/2026 (en-IN day/month/year).
  // Procurement years like "2024-25" / "2024-2025" and ids like "DEM-2024-001" are not touched.
  App.fmtDateText = function (text) {
    if (!text || typeof text !== 'string') return text;
    return text
      .replace(/(^|[^\d-])(\d{4})-(\d{2})-(\d{2})(T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?(?![\d-])/g, function (all, pre, y, mo, d, t) {
        if (!ok(+d, +mo)) return all;
        if (t) { var dt = new Date(y + '-' + mo + '-' + d + t); if (!isNaN(dt)) return pre + out(dt.getDate(), dt.getMonth() + 1, dt.getFullYear()); }
        return pre + out(+d, +mo, y);
      })
      .replace(/(^|[^\d/])(\d{1,2})\/(\d{1,2})\/(\d{4})(?![\d/])/g, function (all, pre, d, mo, y) {
        return ok(+d, +mo) ? pre + out(+d, +mo, y) : all;
      });
  };

  // For downloaded files / print windows (their content never passes through the page observer).
  App._fmtDl = function (text) { return App.fmtDateText(text); };

  // ── Format the dates in all text shown on the page ──
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1 };
  App._fmtDatesIn = function (root) {
    if (!root || typeof document === 'undefined' || !document.createTreeWalker) return;
    if (root.nodeType === 3) { // text node
      var p = root.parentNode;
      if (p && !SKIP[p.nodeName]) { var nv = App.fmtDateText(root.nodeValue); if (nv !== root.nodeValue) root.nodeValue = nv; }
      return;
    }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    var w = document.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      var par = t.parentNode;
      if (!par || SKIP[par.nodeName]) return;
      var v = App.fmtDateText(t.nodeValue);
      if (v !== t.nodeValue) t.nodeValue = v;
    });
  };

  if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
    var start = function () {
      App._fmtDatesIn(document.body);
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (m.type === 'characterData') App._fmtDatesIn(m.target);
          else for (var i = 0; i < m.addedNodes.length; i++) App._fmtDatesIn(m.addedNodes[i]);
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
  }
}());
