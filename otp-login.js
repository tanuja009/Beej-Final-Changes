/**
 * otp-login.js — Login with OTP (Mobile + CAPTCHA) for Beej Sangh Portal
 *
 * Flow:  Mobile Number + CAPTCHA  →  Send OTP  →  Enter 6-digit OTP  →  Verify  →  Dashboard
 *
 * Wireframe/demo only:
 *   • CAPTCHA reuses the existing BeejCaptcha module.
 *   • OTP is a dynamically generated 6-digit mock (no SMS/backend), shown
 *     in a clearly-labelled development-only box and logged to the console.
 *   • On success, uses the SAME login result as the password login
 *     (role-based currentUser + navigate to dashboard).
 *
 * Nothing in the existing password login is modified.
 */

'use strict';

// ── Session state for OTP login ───────────────────────────────
if (!App.state.otpLogin) {
  App.state.otpLogin = {
    step: 1,          // 1 = mobile+captcha, 2 = enter OTP
    mobile: '',
    otp: '',          // dynamic mock OTP
    otpExpiry: 0,
    resendAt: 0,
    attempts: 0
  };
}

App.OTP_LOGIN_CONFIG = {
  OTP_LENGTH: 6,
  OTP_TTL_MS: 30 * 1000,        // valid for 30s (tied to countdown)
  RESEND_COOLDOWN_MS: 30 * 1000, // 30-second resend countdown
  MAX_ATTEMPTS: 5
};

// ── Entry point (called by the "Login with OTP" link) ─────────
App.startOtpLogin = function () {
  const s = App.state.otpLogin;
  s.step = 1;
  s.mobile = '';
  s.otp = '';
  s.otpExpiry = 0;
  s.resendAt = 0;
  s.attempts = 0;
  App.navigate('otp-login');
};

// ── Render the OTP login page (both steps in one card) ────────
App.renderOtpLogin = function () {
  const s = App.state.otpLogin;
  const masked = s.mobile ? s.mobile.replace(/(\d{5})(\d{5})/, '$1 $2') : '';

  const stepMobile = `
    <!-- Mobile Number -->
    <div class="form-group" style="margin-bottom:18px;">
      <label>Mobile Number <span style="color:#F44336;">*</span></label>
      <div class="input-icon-wrap">
        <span class="material-icons">phone_android</span>
        <input type="tel" id="otpl-mobile" class="form-control" inputmode="numeric" maxlength="10"
               placeholder="Enter 10-digit mobile number" value="${s.mobile || ''}"
               oninput="this.value=this.value.replace(/[^0-9]/g,'');App.otplClearError('otpl-mobile-error')"
               onkeypress="if(event.key==='Enter') App.otpLoginSendOTP()"/>
      </div>
      <div id="otpl-mobile-error" class="otpl-error" style="display:none;">
        <span class="material-icons" style="font-size:14px;">error_outline</span>
        <span class="otpl-error-text"></span>
      </div>
    </div>

    <!-- CAPTCHA (reused component) -->
    ${BeejCaptcha.getHtml()}

    <button class="btn btn-primary btn-full btn-lg" style="margin-top:6px;" onclick="App.otpLoginSendOTP()">
      <span class="material-icons">sms</span> Send OTP
    </button>`;

  const stepOtp = `
    <!-- OTP sent confirmation -->
    <div style="background:#E8F5E9;border-left:4px solid #4CAF50;border-radius:8px;
         padding:12px 16px;margin-bottom:14px;color:#1B5E20;font-size:0.85rem;
         display:flex;align-items:center;gap:8px;">
      <span class="material-icons" style="color:#2E7D32;font-size:20px;">mark_email_read</span>
      <span>OTP sent successfully to <strong>+91 ${masked}</strong></span>
    </div>

    <!-- DEV/DEMO ONLY: dynamically generated OTP for wireframe testing (not a real SMS). -->
    <div style="background:#FFF8E1;border:1px dashed #FFB300;border-radius:8px;
         padding:12px 16px;margin-bottom:18px;color:#8D6E00;font-size:0.85rem;
         display:flex;align-items:center;gap:8px;">
      <span class="material-icons" style="color:#F9A825;font-size:20px;">bug_report</span>
      <span>Demo OTP (development only): <strong id="otpl-demo-value"
            style="letter-spacing:2px;font-size:1rem;color:#E65100;">${s.otp || '------'}</strong></span>
    </div>

    <!-- OTP input -->
    <div class="form-group" style="margin-bottom:14px;">
      <label>Enter OTP <span style="color:#F44336;">*</span></label>
      <div class="input-icon-wrap">
        <span class="material-icons">password</span>
        <input type="text" id="otpl-otp" class="form-control" inputmode="numeric" maxlength="6"
               placeholder="Enter 6-digit OTP"
               style="letter-spacing:8px;font-size:1.15rem;text-align:center;"
               oninput="this.value=this.value.replace(/[^0-9]/g,'');App.otplClearError('otpl-otp-error')"
               onkeypress="if(event.key==='Enter') App.otpLoginVerify()"/>
      </div>
      <div id="otpl-otp-error" class="otpl-error" style="display:none;">
        <span class="material-icons" style="font-size:14px;">error_outline</span>
        <span class="otpl-error-text"></span>
      </div>
    </div>

    <!-- Resend row with countdown -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;font-size:0.82rem;">
      <span style="color:#757575;">Didn't receive the OTP?</span>
      <span>
        <a href="#" id="otpl-resend-link" onclick="App.otpLoginResend();return false;"
           style="color:#2E7D32;font-weight:600;text-decoration:none;">Resend OTP</a>
        <span id="otpl-resend-timer" style="color:#9E9E9E;"></span>
      </span>
    </div>

    <button class="btn btn-primary btn-full btn-lg" onclick="App.otpLoginVerify()">
      <span class="material-icons">verified_user</span> Verify & Login
    </button>

    <div style="margin-top:14px;text-align:center;">
      <a href="#" onclick="App.state.otpLogin.step=1;App.render();return false;"
         style="color:#666;font-size:0.85rem;text-decoration:none;">
        <span class="material-icons" style="font-size:16px;vertical-align:middle;">arrow_back</span>
        Change Mobile Number
      </a>
    </div>`;

  return `
    <div class="login-page">
      <div class="login-header">
        <div class="emblem">🌾</div>
        <h1>Beej Sangh Procurement Portal</h1>
        <p>Madhya Pradesh State Agriculture Department</p>
      </div>
      <div class="login-card">
        <h2>📱 Login with OTP</h2>

        <!-- Role tabs (reuse existing role selection) -->
        <div class="role-tabs">
          <button class="role-tab ${this.state.currentRole === 'society' ? 'active' : ''}" onclick="App.setRole('society')">
            🧑‍🌾 Society Head
          </button>
          <button class="role-tab ${this.state.currentRole === 'admin' ? 'active' : ''}" onclick="App.setRole('admin')">
            🏛️ Beej Sangh Admin
          </button>
        </div>

        ${s.step === 1 ? stepMobile : stepOtp}

        <div style="margin-top:18px;text-align:center;padding-top:16px;border-top:1px solid #e8f5e9;">
          <a href="#" onclick="App.navigate('login');return false;"
             style="color:#2E7D32;font-weight:500;font-size:0.85rem;text-decoration:none;">
            <span class="material-icons" style="font-size:16px;vertical-align:middle;">lock</span>
            Login with Password instead
          </a>
        </div>
      </div>
    </div>`;
};

// ── Error helpers ─────────────────────────────────────────────
App.otplShowError = function (boxId, msg) {
  const box = document.getElementById(boxId);
  if (!box) return;
  const txt = box.querySelector('.otpl-error-text');
  if (txt) txt.textContent = msg;
  box.style.display = 'flex';
};
App.otplClearError = function (boxId) {
  const box = document.getElementById(boxId);
  if (box) box.style.display = 'none';
};

// ── Generate a fresh dynamic mock OTP ─────────────────────────
App.otpLoginIssueOTP = function () {
  const s = App.state.otpLogin;
  const cfg = App.OTP_LOGIN_CONFIG;
  const min = Math.pow(10, cfg.OTP_LENGTH - 1);
  const max = Math.pow(10, cfg.OTP_LENGTH) - 1;
  s.otp = String(Math.floor(min + Math.random() * (max - min + 1)));
  s.otpExpiry = Date.now() + cfg.OTP_TTL_MS;
  s.resendAt = Date.now() + cfg.RESEND_COOLDOWN_MS;
  s.attempts = 0;
  console.log(`[DEMO OTP - LOGIN] Sent to +91 ${s.mobile}: ${s.otp} (valid ${cfg.OTP_TTL_MS / 1000}s)`);
};

// ── Send OTP: validate mobile + CAPTCHA, then issue OTP ───────
App.otpLoginSendOTP = function () {
  const s = App.state.otpLogin;
  const mobileEl = document.getElementById('otpl-mobile');
  const mobile = mobileEl ? mobileEl.value.trim() : '';

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    App.otplShowError('otpl-mobile-error', 'Enter a valid 10-digit Indian mobile number (starts with 6-9).');
    return;
  }

  const captcha = BeejCaptcha.validate();
  if (!captcha.valid) {
    BeejCaptcha.showError(captcha.message);
    return;
  }

  s.mobile = mobile;
  App.otpLoginIssueOTP();
  s.step = 2;
  App.render();
};

// ── Countdown timer for resend ────────────────────────────────
App._otplTimer = null;
App.otpLoginStartCountdown = function () {
  const s = App.state.otpLogin;
  const link = document.getElementById('otpl-resend-link');
  const timer = document.getElementById('otpl-resend-timer');
  if (!link || !timer) return;

  if (App._otplTimer) { clearInterval(App._otplTimer); App._otplTimer = null; }

  const tick = () => {
    const remaining = Math.max(0, Math.ceil((s.resendAt - Date.now()) / 1000));
    if (remaining > 0) {
      link.style.pointerEvents = 'none';
      link.style.color = '#BDBDBD';
      timer.style.color = '#9E9E9E';
      timer.textContent = ` in ${remaining}s`;
    } else {
      link.style.pointerEvents = 'auto';
      link.style.color = '#2E7D32';
      timer.style.color = '#F44336';
      timer.textContent = ' (OTP expired)';
      if (App._otplTimer) { clearInterval(App._otplTimer); App._otplTimer = null; }
    }
  };
  tick();
  App._otplTimer = setInterval(tick, 1000);
};

// ── Resend OTP: new dynamic OTP, old becomes invalid ──────────
App.otpLoginResend = function () {
  const s = App.state.otpLogin;
  if (Date.now() < s.resendAt) return;
  App.otpLoginIssueOTP();
  App.otplClearError('otpl-otp-error');
  const otpEl = document.getElementById('otpl-otp');
  if (otpEl) otpEl.value = '';
  const demo = document.getElementById('otpl-demo-value');
  if (demo) demo.textContent = s.otp;
  App.otpLoginStartCountdown();
  App.showToast('A new OTP has been sent.');
};

// ── Verify OTP → login (same result as password login) ────────
App.otpLoginVerify = function () {
  const s = App.state.otpLogin;
  const cfg = App.OTP_LOGIN_CONFIG;
  const otpEl = document.getElementById('otpl-otp');
  const entered = otpEl ? otpEl.value.trim() : '';

  if (entered.length !== cfg.OTP_LENGTH) {
    App.otplShowError('otpl-otp-error', 'Please enter the 6-digit OTP.');
    return;
  }
  if (Date.now() > s.otpExpiry) {
    App.otplShowError('otpl-otp-error', 'OTP has expired. Please resend OTP.');
    return;
  }
  if (s.attempts >= cfg.MAX_ATTEMPTS) {
    App.otplShowError('otpl-otp-error', 'Maximum attempts reached. Please resend OTP.');
    return;
  }
  if (entered !== s.otp) {
    s.attempts += 1;
    const left = cfg.MAX_ATTEMPTS - s.attempts;
    App.otplShowError('otpl-otp-error', 'Invalid OTP. Please enter the correct OTP.' + (left > 0 ? ` (${left} attempt${left === 1 ? '' : 's'} left)` : ''));
    return;
  }

  // Success — clear timer and log in with the same role-based result
  if (App._otplTimer) { clearInterval(App._otplTimer); App._otplTimer = null; }
  App.state.currentUser = App.state.currentRole === 'admin'
    ? { name: 'Admin User', role: 'Beej Sangh Admin', initials: 'AU' }
    : { name: 'Ramesh Verma', role: 'Society Head - SOC-001', initials: 'RV' };
  App.showToast('Mobile number verified. Logged in successfully.');
  App.navigate(App.state.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard');
};

console.log('[OTP Login] Login-with-OTP module loaded');
