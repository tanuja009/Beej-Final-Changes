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
  function render() {
    const wrap = document.getElementById('captcha-canvas-wrap');
    if (!wrap) return;

    _generate();

    /* Remove old canvas if re-rendering */
    let canvas = wrap.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'captcha-canvas';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Visual CAPTCHA — type the characters shown into the field below');
      canvas.title = 'CAPTCHA — type the characters you see';
      wrap.prepend(canvas);
    }

    _draw(canvas);

    /* Clear input & hide any previous error */
    const inp = document.getElementById('captcha-answer');
    if (inp) inp.value = '';
    _hideError();
  }

  /**
   * Validates user's answer.
   * Returns { valid: true } or { valid: false, message: '…' }
   */
  function validate() {
    const inp = document.getElementById('captcha-answer');
    if (!inp) return { valid: false, message: 'CAPTCHA field not found.' };

    const answer = inp.value.trim();

    if (!answer) {
      return { valid: false, message: 'Please complete the CAPTCHA before logging in.' };
    }

    const isMatch = config.caseSensitive
      ? answer === _code
      : answer.toLowerCase() === _code.toLowerCase();

    if (!isMatch) {
      return { valid: false, message: 'Incorrect CAPTCHA. Please try again.' };
    }

    return { valid: true };
  }

  /**
   * Re-generates and redraws the CAPTCHA (refresh button).
   */
  function refresh() {
    render();
    /* Re-focus the answer input for accessibility */
    const inp = document.getElementById('captcha-answer');
    if (inp) { inp.value = ''; inp.focus(); }
  }

  /**
   * Shows a CAPTCHA validation error message in the UI.
   * Also triggers a refresh so the old code cannot be retried.
   */
  function showError(message) {
    const el = document.getElementById('captcha-error-msg');
    if (el) {
      el.textContent = message;
      el.style.display = 'flex';
    }
    refresh();   /* invalidate current code on failure */
  }

  /** Hides the CAPTCHA error message. */
  function _hideError() {
    const el = document.getElementById('captcha-error-msg');
    if (el) el.style.display = 'none';
  }

  /** Clears the error (called when user starts typing). */
  function clearError() { _hideError(); }

  /**
   * Returns the HTML string to embed in renderLogin().
   * Insert this just above the Login button.
   */
  function getHtml() {
    return `
      <div class="form-group captcha-form-group" id="captcha-section">
        <label class="captcha-label">
          Security Verification
          <span class="captcha-required" aria-hidden="true">*</span>
        </label>

        <!-- Canvas wrapper + refresh -->
        <div class="captcha-image-row">
          <div id="captcha-canvas-wrap" class="captcha-canvas-wrap" aria-hidden="true">
            <!-- Canvas injected by BeejCaptcha.render() -->
          </div>
          <button
            type="button"
            class="captcha-refresh-btn"
            id="captcha-refresh-btn"
            onclick="BeejCaptcha.refresh()"
            title="Get a new CAPTCHA"
            aria-label="Refresh CAPTCHA"
          >
            <span class="material-icons">refresh</span>
          </button>
        </div>

        <!-- Answer input -->
        <div class="input-icon-wrap captcha-input-wrap">
          <span class="material-icons">security</span>
          <input
            type="text"
            id="captcha-answer"
            class="form-control"
            placeholder="Type the characters shown above"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            maxlength="10"
            oninput="BeejCaptcha.clearError()"
            aria-label="Enter CAPTCHA text"
            aria-required="true"
            aria-describedby="captcha-error-msg"
          />
        </div>

        <!-- Error message — hidden until needed -->
        <div
          id="captcha-error-msg"
          class="captcha-error-msg"
          role="alert"
          aria-live="polite"
          style="display:none;"
        >
          <span class="material-icons captcha-err-icon">error_outline</span>
          <span class="captcha-err-text"></span>
        </div>

      </div>`;
  }

  /* Expose public methods */
  return { render, validate, refresh, showError, clearError, getHtml, config };

})();
