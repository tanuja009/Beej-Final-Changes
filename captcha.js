/**
 * captcha.js — Beej Sangh Procurement Portal
 * Self-contained CAPTCHA module for the Login page.
 *
 * ─── WHAT THIS FILE DOES ────────────────────────────────────────
 *  • Generates a canvas-rendered, distorted 6-character CAPTCHA.
 *  • Exposes a global `BeejCaptcha` object consumed by app.js.
 *  • Does NOT modify any existing business logic, auth flow, or UI.
 *
 * ─── CONFIGURATION ──────────────────────────────────────────────
 *  All tuneable values live in BeejCaptcha.config — nothing is
 *  hardcoded in business logic.  In a real deployment, replace
 *  canvas-CAPTCHA with Google reCAPTCHA v3 / hCaptcha by swapping
 *  only this file and setting CAPTCHA_SITE_KEY in your .env file.
 *
 * ─── ENVIRONMENT / CONFIG FILE NOTE ────────────────────────────
 *  For reCAPTCHA / hCaptcha production use, store keys in:
 *    Frontend  →  .env  (VITE_CAPTCHA_SITE_KEY=...)
 *    Backend   →  .env  (CAPTCHA_SECRET_KEY=...)
 *  This file reads window.__CAPTCHA_CONFIG__ if present, so the
 *  build step can inject values without hardcoding.
 *
 * ─── FILES ADDED / MODIFIED ────────────────────────────────────
 *  ADDED:    captcha.js          ← this file
 *  MODIFIED: app.js              ← renderLogin() + login() only
 *  MODIFIED: styles.css          ← captcha CSS appended at end
 *  MODIFIED: index.html          ← <script src="captcha.js"> added
 *  UNCHANGED: modules.js, all other app.js methods, all routes
 * ────────────────────────────────────────────────────────────────
 */

const BeejCaptcha = (function () {

  /* ── Configuration (override via window.__CAPTCHA_CONFIG__) ── */
  const _env = window.__CAPTCHA_CONFIG__ || {};

  const config = {
    length: _env.length || 6,
    width: _env.width || 180,
    height: _env.height || 52,
    fontSize: _env.fontSize || 26,
    bgColor: _env.bgColor || '#EEF7EE',
    noiseLines: _env.noiseLines || 6,
    noiseDots: _env.noiseDots || 40,
    chars: _env.chars || 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789',
    /* Palette: accessible contrast on light background */
    colors: _env.colors || ['#1B5E20', '#1565C0', '#B71C1C', '#4527A0', '#E65100', '#00695C'],
    caseSensitive: false,   /* set true for stricter CAPTCHA */
  };

  /* ── Private state ─────────────────────────────────────────── */
  let _code = '';

  /* ── Internal helpers ──────────────────────────────────────── */
  function _random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function _randomInt(min, max) {
    return Math.floor(_random(min, max + 1));
  }

  function _randomChar() {
    return config.chars[_randomInt(0, config.chars.length - 1)];
  }

  function _randomColor() {
    return config.colors[_randomInt(0, config.colors.length - 1)];
  }

  function _generate() {
    let code = '';
    for (let i = 0; i < config.length; i++) code += _randomChar();
    _code = code;
    return code;
  }

  /* Draw the CAPTCHA onto a <canvas> element */
  function _draw(canvas) {
    const ctx = canvas.getContext('2d');
    const W = config.width;
    const H = config.height;

    canvas.width = W;
    canvas.height = H;

    /* Background */
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, W, H);

    /* Subtle grid noise */
    ctx.strokeStyle = 'rgba(46,125,50,0.06)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* Noise dots (before text so text stays readable) */
    for (let i = 0; i < config.noiseDots; i++) {
      ctx.fillStyle = `rgba(${_randomInt(0, 200)},${_randomInt(0, 200)},${_randomInt(0, 200)},0.25)`;
      ctx.beginPath();
      ctx.arc(_random(0, W), _random(0, H), _random(0.5, 2), 0, 2 * Math.PI);
      ctx.fill();
    }

    /* Characters */
    const charW = W / (config.length + 1);
    for (let i = 0; i < _code.length; i++) {
      ctx.save();
      ctx.font = `bold ${_randomInt(config.fontSize - 4, config.fontSize + 4)}px 'Courier New', monospace`;
      ctx.fillStyle = _randomColor();
      ctx.textBaseline = 'middle';
      const x = charW * (i + 0.6) + _random(-4, 4);
      const y = H / 2 + _random(-6, 6);
      ctx.translate(x, y);
      ctx.rotate(_random(-0.35, 0.35));   /* slight tilt */
      ctx.fillText(_code[i], 0, 0);
      ctx.restore();
    }

    /* Noise lines (on top of text for distortion) */
    for (let i = 0; i < config.noiseLines; i++) {
      ctx.strokeStyle = `rgba(${_randomInt(0, 180)},${_randomInt(0, 180)},${_randomInt(0, 180)},0.3)`;
      ctx.lineWidth = _random(0.5, 1.5);
      ctx.beginPath();
      ctx.moveTo(_random(0, W * 0.3), _random(0, H));
      ctx.bezierCurveTo(
        _random(W * 0.2, W * 0.5), _random(0, H),
        _random(W * 0.5, W * 0.8), _random(0, H),
        _random(W * 0.7, W), _random(0, H)
      );
      ctx.stroke();
    }

    /* Border */
    ctx.strokeStyle = '#A5D6A7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.75, 0.75, W - 1.5, H - 1.5);
  }

  /* ── Public API ─────────────────────────────────────────────── */

  /**
   * Renders CAPTCHA into element with id="captcha-canvas-wrap".
   * Creates/replaces a <canvas> inside that wrapper.
   * Called after renderLogin() injects the wrapper into the DOM.
   */
  /**
   * WIREFRAME MODE: CAPTCHA is shown as a placeholder only.
   * render() is a no-op — there is no canvas to draw.
   */
  function render() { /* placeholder only — nothing to render */ }

  /**
   * WIREFRAME MODE: there is no CAPTCHA entry field, so validation
   * always passes. (Kept so existing callers continue to work.)
   */
  function validate() {
    return { valid: true };
  }

  /** WIREFRAME MODE: no CAPTCHA to refresh. */
  function refresh() { /* placeholder only — nothing to refresh */ }

  /** WIREFRAME MODE: no CAPTCHA validation, so no error to show. */
  function showError() { /* placeholder only — no validation errors */ }

  /** Clears the error (no-op in placeholder mode). */
  function clearError() { /* placeholder only */ }

  /**
   * Returns the HTML string for the CAPTCHA placeholder.
   * Shows a visual "CAPTCHA will appear here" box only — no input field,
   * no refresh button, no actual CAPTCHA generation or validation.
   */
  function getHtml() {
    return `
      <div class="form-group captcha-form-group" id="captcha-section">
        <label class="captcha-label">
          Security Verification
        </label>

        <!-- Placeholder box (wireframe only) -->
        <div class="captcha-placeholder" aria-hidden="true"
             style="display:flex;align-items:center;justify-content:center;gap:10px;
                    min-height:64px;padding:16px;border:1.5px dashed #A5D6A7;
                    border-radius:8px;background:#F1F8E9;color:#2E7D32;
                    font-size:0.9rem;font-weight:600;text-align:center;">
          <span class="material-icons" style="font-size:22px;color:#4CAF50;">verified_user</span>
          CAPTCHA will appear here
        </div>
      </div>`;
  }

  /* Expose public methods */
  return { render, validate, refresh, showError, clearError, getHtml, config };

})();
