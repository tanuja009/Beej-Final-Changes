/**
 * NCD-Based Society Registration Module
 * Enhanced flow with Mobile + CAPTCHA + OTP verification prepended:
 *   Mobile Verification → OTP Verification → NCD Entry → Registration Form → Submit
 * Reuses the existing BeejCaptcha module and existing NCD screens.
 * Demo/mock OTP only (no backend). OTP is never shown directly in the UI.
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// STATE — registration session (mobile, OTP, NCD, society details)
// ═══════════════════════════════════════════════════════════════
if (!App.state.ncdRegistration) {
  App.state.ncdRegistration = {
    // Mobile + OTP session
    mobileNumber: '',
    mobileVerified: false,
    otpVerified: false,
    otp: '',              // demo/mock OTP (isolated, not rendered to UI)
    otpExpiry: 0,         // epoch ms when the current OTP expires
    otpAttempts: 0,       // number of failed verify attempts
    resendAt: 0,          // epoch ms after which resend is allowed
    // NCD + society details
    enteredCode: '',
    formSubmitted: false
  };
}

// Config for the OTP/verification behaviour (isolated demo mechanism)
App.NCD_OTP_CONFIG = {
  OTP_LENGTH: 6,
  OTP_TTL_MS: 30 * 1000,       // OTP valid for 30s (tied to the countdown)
  RESEND_COOLDOWN_MS: 30 * 1000, // 30-second resend countdown
  MAX_ATTEMPTS: 5              // max failed verify attempts before lockout
};

// ═══════════════════════════════════════════════════════════════
// MOCK APPLICATION STORE (localStorage-backed)
// Persists submitted society registration applications + documents
// so Admin → Pending Approval → View shows the exact submitted data.
// ═══════════════════════════════════════════════════════════════
App.SocAppStore = {
  KEY: 'bs_soc_applications',

  _read() {
    try {
      const raw = window.localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  _write(list) {
    try {
      window.localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch (e) {
      // Storage may fail (e.g. quota exceeded with large data-URL docs);
      // keep an in-memory fallback so the current session still works.
      App._socAppMemory = list;
    }
  },

  getAll() {
    const stored = this._read();
    if (stored.length) return stored;
    return App._socAppMemory || [];
  },

  getById(id) {
    return this.getAll().find(a => a.id === id) || null;
  },

  add(record) {
    const list = this.getAll();
    list.unshift(record);       // newest first
    this._write(list);
    // Mirror to memory as a safety net for large payloads
    App._socAppMemory = list;
    return record;
  },

  // Update an application's status + admin remark (and decision timestamp).
  updateStatus(id, status, remark) {
    const list = this.getAll();
    const rec = list.find(a => a.id === id);
    if (!rec) return null;
    rec.status = status;                 // 'Approved' | 'Rejected'
    rec.adminRemark = remark;
    rec.decisionAt = new Date().toISOString();
    rec.decisionDate = rec.decisionAt.split('T')[0];
    if (rec.fields) rec.fields.approvalStatus = status;
    this._write(list);
    App._socAppMemory = list;
    return rec;
  },

  // Generate the next APP / SOC codes based on existing count
  nextCodes() {
    const count = this.getAll().length + 1;
    const seq = String(count).padStart(3, '0');
    const year = new Date().getFullYear();
    return {
      id: `APP-${year}-${seq}`,
      code: `SOC-${year}-${seq}`
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// MOCK USER/CREDENTIAL STORE (localStorage-backed)
// Persists username/password created during registration so the
// username can be checked for uniqueness and used later for login.
// ═══════════════════════════════════════════════════════════════
App.SocUserStore = {
  KEY: 'bs_soc_users',

  getAll() {
    try {
      const raw = window.localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : (App._socUserMemory || []);
    } catch (e) {
      return App._socUserMemory || [];
    }
  },

  // Case-insensitive username lookup
  exists(username) {
    const u = String(username || '').trim().toLowerCase();
    return this.getAll().some(x => String(x.username || '').toLowerCase() === u);
  },

  add(user) {
    const list = this.getAll();
    list.push(user);
    try { window.localStorage.setItem(this.KEY, JSON.stringify(list)); } catch (e) { /* fallback below */ }
    App._socUserMemory = list;
    return user;
  }
};

// ═══════════════════════════════════════════════════════════════
// PROGRESS INDICATOR (shared across all registration pages)
// Steps: 1 Mobile Verification → 2 NCD Code → 3 Society Details
//        → 4 Registration → 5 Submit
// `activeStep` is 1-based; steps before it render as completed.
// ═══════════════════════════════════════════════════════════════
App.renderRegProgress = function (activeStep) {
  const steps = [
    'Mobile Verification',
    'NCD Code',
    'Society Details',
    'Registration',
    'Create Login',
    'Submit'
  ];

  const items = steps.map((label, i) => {
    const stepNo = i + 1;
    const done = stepNo < activeStep;
    const active = stepNo === activeStep;
    const bg = done ? '#2E7D32' : active ? '#4CAF50' : '#E0E0E0';
    const fg = (done || active) ? '#fff' : '#9E9E9E';
    const labelColor = (done || active) ? '#1B5E20' : '#9E9E9E';
    const circle = done
      ? '<span class="material-icons" style="font-size:16px;">check</span>'
      : String(stepNo);
    const connector = i < steps.length - 1
      ? `<div style="flex:1;height:3px;min-width:16px;background:${stepNo < activeStep ? '#2E7D32' : '#E0E0E0'};margin:0 4px;"></div>`
      : '';
    return `
      <div style="display:flex;align-items:center;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;min-width:64px;">
          <div style="width:30px;height:30px;border-radius:50%;background:${bg};color:${fg};
                      display:flex;align-items:center;justify-content:center;font-size:0.82rem;
                      font-weight:700;flex-shrink:0;">${circle}</div>
          <div style="font-size:0.66rem;font-weight:600;color:${labelColor};text-align:center;
                      line-height:1.2;">${label}</div>
        </div>
      </div>
      ${connector}`;
  }).join('');

  return `
    <div style="background:#fff;border-radius:12px;padding:18px 20px;margin-bottom:20px;
                box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="display:flex;align-items:flex-start;justify-content:center;flex-wrap:nowrap;
                  overflow-x:auto;">
        ${items}
      </div>
    </div>`;
};

// ═══════════════════════════════════════════════════════════════
// ENTRY POINT — called by the "New Society Registration" button.
// Resets the verification session and opens the Mobile page first.
// ═══════════════════════════════════════════════════════════════
App.startSocietyRegistration = function () {
  const reg = App.state.ncdRegistration;
  reg.mobileNumber = '';
  reg.mobileVerified = false;
  reg.otpVerified = false;
  reg.otp = '';
  reg.otpExpiry = 0;
  reg.otpAttempts = 0;
  reg.resendAt = 0;
  reg.enteredCode = '';
  reg.formSubmitted = false;
  App.navigate('mobile-verify');
};

// ═══════════════════════════════════════════════════════════════
// PAGE: MOBILE NUMBER VERIFICATION (Step 1)
// Mobile input + CAPTCHA (reused) + Send OTP
// ═══════════════════════════════════════════════════════════════
App.renderMobileVerification = function () {
  const reg = App.state.ncdRegistration;
  return `
  <div style="min-height:100vh;background:#2E7D32;padding:30px 16px;">
    <div style="width:100%;max-width:560px;margin:0 auto;">

      ${this.renderRegProgress(1)}

      <div style="border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.25);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1B5E20 0%,#388E3C 50%,#4CAF50 100%);
                    padding:28px;text-align:center;">
          <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;
                      margin:0 auto 12px auto;display:flex;align-items:center;justify-content:center;
                      font-size:28px;border:2px solid rgba(255,255,255,0.3);">🌾</div>
          <h2 style="color:#fff;margin:0 0 6px 0;font-size:1.3rem;font-weight:700;">
            Mobile Number Verification
          </h2>
          <p style="color:rgba(255,255,255,0.85);margin:0;font-size:0.85rem;">
            Verify your mobile number to begin New Society Registration
          </p>
        </div>

        <!-- Body -->
        <div style="background:#fff;padding:30px 28px;">

          <!-- Mobile Number -->
          <div class="form-group" style="margin-bottom:20px;">
            <label style="font-size:0.88rem;font-weight:600;color:#333;display:block;margin-bottom:8px;">
              Mobile Number <span style="color:#F44336;">*</span>
            </label>
            <div class="input-icon-wrap">
              <span class="material-icons">phone_android</span>
              <input type="tel" id="reg-mobile" class="form-control" inputmode="numeric"
                     maxlength="10" placeholder="Enter 10-digit mobile number"
                     value="${reg.mobileNumber || ''}"
                     oninput="this.value=this.value.replace(/[^0-9]/g,'');App.clearMobileError()"
                     onkeypress="if(event.key==='Enter') App.sendRegistrationOTP()"/>
            </div>
            <div id="reg-mobile-error" style="display:none;color:#F44336;font-size:0.78rem;
                 margin-top:6px;align-items:center;gap:4px;">
              <span class="material-icons" style="font-size:14px;">error_outline</span>
              <span id="reg-mobile-error-text"></span>
            </div>
          </div>

          <!-- CAPTCHA (reused BeejCaptcha component) -->
          ${BeejCaptcha.getHtml()}

          <!-- Send OTP -->
          <button class="btn btn-primary btn-full btn-lg" style="margin-top:6px;"
                  onclick="App.sendRegistrationOTP()">
            <span class="material-icons">sms</span> Send OTP
          </button>

          <!-- Back to Login -->
          <div style="margin-top:18px;text-align:center;padding-top:16px;border-top:1px solid #E8F5E9;">
            <a href="#" onclick="App.navigate('login');return false;"
               style="color:#666;font-size:0.85rem;text-decoration:none;">
              <span class="material-icons" style="font-size:16px;vertical-align:middle;">arrow_back</span>
              Back to Login
            </a>
          </div>

        </div>
      </div>
    </div>
  </div>`;
};

// ═══════════════════════════════════════════════════════════════
// ACTION: Send OTP — validate mobile + CAPTCHA, then issue mock OTP
// ═══════════════════════════════════════════════════════════════
App.showMobileError = function (msg) {
  const box = document.getElementById('reg-mobile-error');
  const txt = document.getElementById('reg-mobile-error-text');
  if (box && txt) { txt.textContent = msg; box.style.display = 'flex'; }
};
App.clearMobileError = function () {
  const box = document.getElementById('reg-mobile-error');
  if (box) box.style.display = 'none';
};

App.sendRegistrationOTP = function () {
  const reg = App.state.ncdRegistration;
  const mobileEl = document.getElementById('reg-mobile');
  const mobile = mobileEl ? mobileEl.value.trim() : '';

  // 1) Validate Indian mobile number: 10 digits, starts 6-9
  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    App.showMobileError('Enter a valid 10-digit Indian mobile number (starts with 6-9).');
    return;
  }

  // 2) Validate CAPTCHA using the existing module
  const captchaResult = BeejCaptcha.validate();
  if (!captchaResult.valid) {
    BeejCaptcha.showError(captchaResult.message);
    return;
  }

  // 3) Both valid — generate/send mock OTP and preserve the mobile number
  reg.mobileNumber = mobile;
  App.issueRegistrationOTP();

  // 4) Move to OTP verification step
  App.navigate('otp-verify');
};

// Generate a fresh mock OTP (isolated demo mechanism; not rendered to UI)
App.issueRegistrationOTP = function () {
  const reg = App.state.ncdRegistration;
  const cfg = App.NCD_OTP_CONFIG;
  const min = Math.pow(10, cfg.OTP_LENGTH - 1);
  const max = Math.pow(10, cfg.OTP_LENGTH) - 1;
  reg.otp = String(Math.floor(min + Math.random() * (max - min + 1)));
  reg.otpExpiry = Date.now() + cfg.OTP_TTL_MS;
  reg.otpAttempts = 0;
  reg.resendAt = Date.now() + cfg.RESEND_COOLDOWN_MS;
  // Demo delivery: log to console only (simulates SMS gateway).
  console.log(`[DEMO OTP] Sent to +91 ${reg.mobileNumber}: ${reg.otp} (valid ${cfg.OTP_TTL_MS / 60000} min)`);
};

// ═══════════════════════════════════════════════════════════════
// PAGE: OTP VERIFICATION (Step 1 continued)
// 6-digit OTP + Verify + Resend (30s countdown) + Back
// ═══════════════════════════════════════════════════════════════
App.renderOTPVerification = function () {
  const reg = App.state.ncdRegistration;

  // Guard: cannot land here without a pending mobile number
  if (!reg.mobileNumber) {
    return App.renderMobileVerification();
  }

  const masked = reg.mobileNumber.replace(/(\d{5})(\d{5})/, '$1 $2');

  return `
  <div style="min-height:100vh;background:#2E7D32;padding:30px 16px;">
    <div style="width:100%;max-width:560px;margin:0 auto;">

      ${this.renderRegProgress(1)}

      <div style="border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.25);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1B5E20 0%,#388E3C 50%,#4CAF50 100%);
                    padding:28px;text-align:center;">
          <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;
                      margin:0 auto 12px auto;display:flex;align-items:center;justify-content:center;
                      font-size:28px;border:2px solid rgba(255,255,255,0.3);">🔐</div>
          <h2 style="color:#fff;margin:0 0 6px 0;font-size:1.3rem;font-weight:700;">
            Verify Mobile Number
          </h2>
          <p style="color:rgba(255,255,255,0.9);margin:0;font-size:0.85rem;">
            OTP sent successfully to <strong>+91 ${masked}</strong>
          </p>
        </div>

        <!-- Body -->
        <div style="background:#fff;padding:30px 28px;">

          <!-- Success message slot (hidden until verified) -->
          <div id="otp-success" style="display:none;background:#E8F5E9;border-left:4px solid #4CAF50;
               border-radius:8px;padding:14px 16px;margin-bottom:18px;color:#1B5E20;
               font-size:0.9rem;font-weight:600;align-items:center;gap:8px;">
            <span class="material-icons" style="color:#2E7D32;">check_circle</span>
            <span>Mobile number verified successfully.</span>
          </div>

          <!-- OTP sent confirmation -->
          <div style="background:#E8F5E9;border-left:4px solid #4CAF50;border-radius:8px;
               padding:12px 16px;margin-bottom:14px;color:#1B5E20;font-size:0.85rem;
               display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="color:#2E7D32;font-size:20px;">mark_email_read</span>
            <span>OTP sent successfully to <strong>+91 ${masked}</strong></span>
          </div>

          <!-- DEV/DEMO ONLY: shows the dynamically generated OTP for wireframe testing.
               This is NOT a real SMS and would be removed in production. -->
          <div id="demo-otp-box" style="background:#FFF8E1;border:1px dashed #FFB300;border-radius:8px;
               padding:12px 16px;margin-bottom:20px;color:#8D6E00;font-size:0.85rem;
               display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="color:#F9A825;font-size:20px;">bug_report</span>
            <span>Demo OTP (development only): <strong id="demo-otp-value" style="letter-spacing:2px;font-size:1rem;color:#E65100;">${reg.otp || '------'}</strong></span>
          </div>

          <!-- OTP input -->
          <div class="form-group" style="margin-bottom:16px;">
            <label style="font-size:0.88rem;font-weight:600;color:#333;display:block;margin-bottom:8px;">
              Enter OTP <span style="color:#F44336;">*</span>
            </label>
            <div class="input-icon-wrap">
              <span class="material-icons">password</span>
              <input type="text" id="reg-otp" class="form-control" inputmode="numeric"
                     maxlength="6" placeholder="Enter 6-digit OTP"
                     style="letter-spacing:8px;font-size:1.15rem;text-align:center;"
                     oninput="this.value=this.value.replace(/[^0-9]/g,'');App.clearOtpError()"
                     onkeypress="if(event.key==='Enter') App.verifyRegistrationOTP()"/>
            </div>
            <div id="reg-otp-error" style="display:none;color:#F44336;font-size:0.78rem;
                 margin-top:6px;align-items:center;gap:4px;">
              <span class="material-icons" style="font-size:14px;">error_outline</span>
              <span id="reg-otp-error-text"></span>
            </div>
          </div>

          <!-- Resend row with countdown -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;
                      font-size:0.82rem;">
            <span style="color:#757575;">Didn't receive the OTP?</span>
            <span>
              <a href="#" id="reg-resend-link" onclick="App.resendRegistrationOTP();return false;"
                 style="color:#2E7D32;font-weight:600;text-decoration:none;">Resend OTP</a>
              <span id="reg-resend-timer" style="color:#9E9E9E;"></span>
            </span>
          </div>

          <!-- Verify button -->
          <button class="btn btn-primary btn-full btn-lg" id="reg-verify-btn"
                  onclick="App.verifyRegistrationOTP()">
            <span class="material-icons">verified_user</span> Verify OTP
          </button>

          <!-- Back to Mobile Verification -->
          <div style="margin-top:18px;text-align:center;padding-top:16px;border-top:1px solid #E8F5E9;">
            <a href="#" onclick="App.navigate('mobile-verify');return false;"
               style="color:#666;font-size:0.85rem;text-decoration:none;">
              <span class="material-icons" style="font-size:16px;vertical-align:middle;">arrow_back</span>
              Back to Mobile Verification
            </a>
          </div>

        </div>
      </div>
    </div>
  </div>`;
};

App.showOtpError = function (msg) {
  const box = document.getElementById('reg-otp-error');
  const txt = document.getElementById('reg-otp-error-text');
  if (box && txt) { txt.textContent = msg; box.style.display = 'flex'; }
};
App.clearOtpError = function () {
  const box = document.getElementById('reg-otp-error');
  if (box) box.style.display = 'none';
};

// Countdown timer management for the Resend link
App._regResendTimer = null;
App.startResendCountdown = function () {
  const reg = App.state.ncdRegistration;
  const link = document.getElementById('reg-resend-link');
  const timer = document.getElementById('reg-resend-timer');
  if (!link || !timer) return;

  if (App._regResendTimer) { clearInterval(App._regResendTimer); App._regResendTimer = null; }

  const tick = () => {
    const remaining = Math.max(0, Math.ceil((reg.resendAt - Date.now()) / 1000));
    if (remaining > 0) {
      link.style.pointerEvents = 'none';
      link.style.color = '#BDBDBD';
      timer.textContent = ` in ${remaining}s`;
    } else {
      // Countdown finished — OTP is now expired; enable Resend.
      link.style.pointerEvents = 'auto';
      link.style.color = '#2E7D32';
      timer.textContent = ' (OTP expired)';
      timer.style.color = '#F44336';
      if (App._regResendTimer) { clearInterval(App._regResendTimer); App._regResendTimer = null; }
    }
  };
  timer.style.color = '#9E9E9E';
  tick();
  App._regResendTimer = setInterval(tick, 1000);
};

// ACTION: Verify the entered OTP
App.verifyRegistrationOTP = function () {
  const reg = App.state.ncdRegistration;
  const cfg = App.NCD_OTP_CONFIG;
  const otpEl = document.getElementById('reg-otp');
  const entered = otpEl ? otpEl.value.trim() : '';

  if (entered.length !== cfg.OTP_LENGTH) {
    App.showOtpError('Please enter the ' + cfg.OTP_LENGTH + '-digit OTP.');
    return;
  }

  // Expiry check — OTP is only valid within the 30s window
  if (Date.now() > reg.otpExpiry) {
    App.showOtpError('OTP has expired. Please resend OTP.');
    return;
  }

  // Attempt limit check
  if (reg.otpAttempts >= cfg.MAX_ATTEMPTS) {
    App.showOtpError('Maximum attempts reached. Please request a new OTP.');
    return;
  }

  // Match check
  if (entered !== reg.otp) {
    reg.otpAttempts += 1;
    const left = cfg.MAX_ATTEMPTS - reg.otpAttempts;
    App.showOtpError('Invalid OTP. Please enter the correct OTP.' + (left > 0 ? ` (${left} attempt${left === 1 ? '' : 's'} left)` : ''));
    return;
  }

  // Success — mark verified, show message, then proceed to NCD entry
  reg.mobileVerified = true;
  reg.otpVerified = true;
  if (App._regResendTimer) { clearInterval(App._regResendTimer); App._regResendTimer = null; }

  const success = document.getElementById('otp-success');
  const verifyBtn = document.getElementById('reg-verify-btn');
  if (success) success.style.display = 'flex';
  if (verifyBtn) { verifyBtn.disabled = true; verifyBtn.style.opacity = '0.6'; }

  setTimeout(() => { App.navigate('ncd-entry'); }, 1200);
};

// ACTION: Resend OTP (respects the cooldown)
App.resendRegistrationOTP = function () {
  const reg = App.state.ncdRegistration;
  if (Date.now() < reg.resendAt) return; // still cooling down

  // Generate a NEW random OTP — the previous one becomes invalid.
  App.issueRegistrationOTP();
  App.clearOtpError();

  // Clear the input and refresh the visible demo OTP box in place.
  const otpEl = document.getElementById('reg-otp');
  if (otpEl) otpEl.value = '';
  const demoVal = document.getElementById('demo-otp-value');
  if (demoVal) demoVal.textContent = reg.otp;

  App.startResendCountdown();
  App.showToast('A new OTP has been sent.');
};

// ═══════════════════════════════════════════════════════════════
// SCREEN: SOCIETY SEARCH CARD (NCD ENTRY) — existing, now gated
// Adds a progress indicator; keeps existing input + Fetch Details.
// ═══════════════════════════════════════════════════════════════
App.renderNCDEntry = function () {
  // Gate: NCD step is locked until OTP verification succeeds
  if (!App.state.ncdRegistration.otpVerified) {
    return App.renderMobileVerification();
  }

  return `
  <div style="min-height:100vh;background:#2E7D32;padding:30px 16px;">
    <div style="width:100%;max-width:560px;margin:0 auto;">

      ${this.renderRegProgress(2)}

      <div style="border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.3);">

        <!-- Top Half: Green Gradient with Logo & Title -->
        <div style="background:linear-gradient(135deg,#1B5E20 0%,#388E3C 50%,#4CAF50 100%);
                    padding:36px 28px;text-align:center;">
          <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;
                      margin:0 auto 14px auto;display:flex;align-items:center;justify-content:center;
                      font-size:32px;border:2px solid rgba(255,255,255,0.3);">🌾</div>
          <h2 style="color:#fff;margin:0 0 8px 0;font-size:1.4rem;font-weight:700;">
            New Society Registration
          </h2>
          <p style="color:rgba(255,255,255,0.85);margin:0;font-size:0.88rem;font-weight:400;">
            Enter your NCD ID / Society Code to proceed
          </p>
        </div>

        <!-- Bottom Half: White Background -->
        <div style="background:#fff;padding:32px 28px;">

          <!-- Verified mobile badge -->
          <div style="background:#E8F5E9;border-radius:8px;padding:10px 14px;margin-bottom:20px;
                      display:flex;align-items:center;gap:8px;font-size:0.82rem;color:#1B5E20;">
            <span class="material-icons" style="font-size:18px;color:#2E7D32;">verified</span>
            Mobile verified: <strong>+91 ${App.state.ncdRegistration.mobileNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}</strong>
          </div>

          <!-- Input Field -->
          <div style="margin-bottom:24px;">
            <label style="font-size:0.88rem;font-weight:600;color:#333;display:block;margin-bottom:8px;">
              NCD ID / Society Code <span style="color:#F44336;">*</span>
            </label>
            <input type="text"
                   id="ncd-code-input"
                   placeholder="ENTER ANY CODE (E.G., NCD001, ABC123, TEST001)"
                   style="width:100%;padding:14px 16px;font-size:0.95rem;border:2px solid #E0E0E0;
                          border-radius:8px;outline:none;text-transform:uppercase;
                          transition:border-color 0.2s;"
                   onfocus="this.style.borderColor='#4CAF50'"
                   onblur="this.style.borderColor='#E0E0E0'"
                   onkeypress="if(event.key==='Enter') App.proceedToRegistrationForm()"/>
            <div style="display:flex;align-items:center;gap:4px;margin-top:6px;">
              <span style="font-size:14px;">💡</span>
              <span style="font-size:0.8rem;color:#757575;">
                Enter any code - no validation required for this prototype
              </span>
            </div>
          </div>

          <!-- Two Buttons Side-by-Side -->
          <div style="display:flex;gap:12px;margin-bottom:24px;">
            <button onclick="App.proceedToRegistrationForm()"
                    style="flex:1;padding:14px 16px;background:#4CAF50;color:#fff;border:none;
                           border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer;
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           box-shadow:0 2px 8px rgba(76,175,80,0.3);transition:background 0.2s;"
                    onmouseover="this.style.background='#388E3C'"
                    onmouseout="this.style.background='#4CAF50'">
              <span style="font-size:16px;">&#8594;</span> Fetch Details
            </button>
            <button onclick="App.navigate('login')"
                    style="flex:1;padding:14px 16px;background:#F5F5F5;color:#555;border:none;
                           border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer;
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           transition:background 0.2s;"
                    onmouseover="this.style.background='#EEEEEE'"
                    onmouseout="this.style.background='#F5F5F5'">
              <span style="font-size:16px;">&#8592;</span> Back to Login
            </button>
          </div>

          <!-- Light Blue Info Box -->
          <div style="background:#E3F2FD;border-radius:10px;padding:16px 18px;
                      border-left:4px solid #2196F3;">
            <div style="font-weight:700;font-size:0.88rem;color:#1565C0;margin-bottom:8px;">
              &#128221; Demo Instructions
            </div>
            <ul style="margin:0;padding-left:18px;font-size:0.82rem;color:#1565C0;line-height:1.8;">
              <li>Enter ANY code (NCD001, ABC123, TEST001, etc.)</li>
              <li>Click "Fetch Details" to view the registration form</li>
              <li>All fields will be pre-filled with demo data</li>
              <li>This is a clickable wireframe - no backend required</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>`;
};

// ═══════════════════════════════════════════════════════════════
// FUNCTION: Proceed to Registration Form (existing, unchanged behaviour)
// ═══════════════════════════════════════════════════════════════
App.proceedToRegistrationForm = function () {
  const codeInput = document.getElementById('ncd-code-input');
  let code = codeInput ? codeInput.value.trim().toUpperCase() : '';

  // If no code entered, use default
  if (!code) {
    code = 'NCD001';
  }

  // Store the entered code
  App.state.ncdRegistration.enteredCode = code;

  // Navigate to the registration form
  App.navigate('ncd-registration-form');
};

// ═══════════════════════════════════════════════════════════════
// SCREEN: AUTO-FILLED SOCIETY REGISTRATION FORM (existing)
// Adds progress indicator (step 3/4). All 21 fields pre-filled.
// ═══════════════════════════════════════════════════════════════
App.renderNCDRegistrationForm = function () {
  // Gate: still require verification to reach the form
  if (!App.state.ncdRegistration.otpVerified) {
    return App.renderMobileVerification();
  }

  const ncdCode = App.state.ncdRegistration.enteredCode || 'NCD001';
  const regMobile = App.state.ncdRegistration.mobileNumber || '9876543210';

  // All registration fields. `key` = data key stored on the application;
  // fetched/auto values are pre-filled but the society can edit them.
  // NCD ID (the fetched key) and Approval Status stay read-only.
  const fields = [
    { key: 'ncdId', label: 'NCD ID', value: ncdCode, readonly: true },
    { key: 'societyName', label: 'Cooperative Society Name', value: 'Indore Cooperative Agricultural Society' },
    { key: 'location', label: 'Location Type', value: 'Rural' },
    { key: 'state', label: 'State/UT', value: 'Madhya Pradesh' },
    { key: 'district', label: 'District', value: 'Indore' },
    { key: 'block', label: 'Block', value: 'Indore' },
    { key: 'urbanLocalBody', label: 'Urban Local Body', value: 'Indore Municipal Corporation' },
    { key: 'sectorType', label: 'Sector Type', value: 'Agriculture' },
    { key: 'primaryActivity', label: 'Primary Activity', value: 'Agriculture & Seed Distribution' },
    { key: 'registrationNumber', label: 'Registration Number', value: 'SOC/MP/2020/001' },
    { key: 'registrationDate', label: 'Registration Date', value: '15/06/2020' },
    { key: 'functionalStatus', label: 'Functional Status', value: 'Active' },
    { key: 'members', label: 'Members of Society', value: '125' },
    { key: 'financialAudit', label: 'Financial Audit', value: 'Completed' },
    { key: 'auditYear', label: 'Audit Complete Year', value: '2025' },
    { key: 'annualProfit', label: 'Annual Profit', value: '\u20B92,50,000' },
    { key: 'pincode', label: 'Pincode', value: '452001' },
    { key: 'mobile', label: 'Mobile', value: regMobile, readonly: true },
    { key: 'email', label: 'Email', value: 'indore.coop@example.com' },
    { key: 'approvalStatus', label: 'Approval Status', value: 'Pending', readonly: true }
  ];

  // Build grid of input fields (each carries its data key for capture on submit)
  const fieldsHtml = fields.map(f => `
    <div style="margin-bottom:16px;">
      <label style="display:block;font-size:0.82rem;font-weight:600;color:#555;margin-bottom:5px;">
        ${f.label}
      </label>
      <input type="text" id="reg-fld-${f.key}" data-reg-key="${f.key}" data-reg-label="${f.label}"
             value="${f.value}" ${f.readonly ? 'readonly' : ''}
             style="width:100%;padding:11px 14px;font-size:0.92rem;color:#333;
                    background:${f.readonly ? '#F0F0F0' : '#F9F9F9'};border:1px solid #E0E0E0;border-radius:6px;"/>
    </div>
  `).join('');

  return `
  <div style="min-height:100vh;background:#F5F5F5;padding:30px 16px;">
    <div style="width:100%;max-width:900px;margin:0 auto;">

      ${this.renderRegProgress(4)}

      <!-- Header -->
      <div style="background:#fff;border-radius:12px;padding:24px 28px;margin-bottom:24px;
                  box-shadow:0 2px 8px rgba(0,0,0,0.08);display:flex;align-items:center;gap:16px;
                  flex-wrap:wrap;">
        <div style="width:44px;height:44px;background:linear-gradient(135deg,#1B5E20,#4CAF50);
                    border-radius:50%;display:flex;align-items:center;justify-content:center;
                    font-size:22px;flex-shrink:0;">🌾</div>
        <div style="flex:1;min-width:200px;">
          <h2 style="margin:0;font-size:1.3rem;color:#1B5E20;font-weight:700;">
            Society Registration Details
          </h2>
          <p style="margin:4px 0 0 0;font-size:0.82rem;color:#757575;">
            NCD Code: <strong>${ncdCode}</strong> &mdash; All fields pre-filled with demo data
          </p>
        </div>
        <button onclick="App.navigate('login')"
                style="padding:10px 18px;background:#F5F5F5;color:#555;border:none;border-radius:8px;
                       font-size:0.88rem;font-weight:600;cursor:pointer;transition:background 0.2s;
                       display:inline-flex;align-items:center;gap:6px;white-space:nowrap;"
                onmouseover="this.style.background='#EEEEEE'"
                onmouseout="this.style.background='#F5F5F5'">
          <span class="material-icons" style="font-size:16px;">arrow_back</span>
          Back to Login
        </button>
      </div>

      <!-- Form Card -->
      <div style="background:#fff;border-radius:12px;padding:32px 28px;
                  box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Fields Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0 24px;">
          ${fieldsHtml}
        </div>

        <!-- Upload RCS Document -->
        <div style="margin-top:8px;">
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#555;margin-bottom:6px;">
            Upload RCS Document <span style="color:#F44336;">*</span>
          </label>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;
                      border:1px dashed #A5D6A7;background:#F1F8E9;border-radius:8px;padding:14px 16px;">
            <span class="material-icons" style="color:#2E7D32;font-size:28px;">upload_file</span>
            <input type="file" id="rcs-document" accept=".pdf,.jpg,.jpeg,.png"
                   onchange="App.onRcsDocSelected(this)"
                   style="flex:1;min-width:200px;font-size:0.88rem;color:#333;"/>
            <span id="rcs-doc-name" style="font-size:0.8rem;color:#2E7D32;font-weight:600;"></span>
          </div>
          <small style="color:#757575;font-size:0.76rem;margin-top:6px;display:block;">
            Accepted formats: PDF, JPG, PNG (max 2MB). Upload the RCS registration document.
          </small>
        </div>

        <!-- Action Buttons -->
        <div style="margin-top:28px;padding-top:24px;border-top:2px solid #E8F5E9;
                    display:flex;justify-content:center;gap:14px;flex-wrap:wrap;">
          <button onclick="App.navigate('login')"
                  style="padding:15px 36px;background:#F5F5F5;color:#555;border:none;
                         border-radius:8px;font-size:1.05rem;font-weight:600;cursor:pointer;
                         transition:background 0.2s;display:inline-flex;align-items:center;gap:8px;"
                  onmouseover="this.style.background='#EEEEEE'"
                  onmouseout="this.style.background='#F5F5F5'">
            <span style="font-size:18px;">&#8592;</span>
            Back to Login
          </button>
          <button onclick="App.proceedToCreateCredentials()"
                  style="padding:15px 48px;background:#4CAF50;color:#fff;border:none;
                         border-radius:8px;font-size:1.05rem;font-weight:700;cursor:pointer;
                         box-shadow:0 4px 12px rgba(76,175,80,0.35);transition:background 0.2s;
                         display:inline-flex;align-items:center;gap:10px;"
                  onmouseover="this.style.background='#388E3C'"
                  onmouseout="this.style.background='#4CAF50'">
            <span style="font-size:18px;">&#10004;</span>
            Submit Application
          </button>
        </div>

      </div>
    </div>
  </div>`;
};

// ═══════════════════════════════════════════════════════════════
// FUNCTION: RCS document selection — reads the file as a data URL so
// it can be persisted with the application and later previewed/downloaded.
// ═══════════════════════════════════════════════════════════════
App._pendingRegDocs = [];  // documents captured for the current registration

App.onRcsDocSelected = function (input) {
  const label = document.getElementById('rcs-doc-name');
  const file = input && input.files && input.files[0];

  App._pendingRegDocs = [];
  if (!file) { if (label) label.textContent = ''; return; }

  if (label) label.textContent = 'Reading \u2026';
  const reader = new FileReader();
  reader.onload = function (e) {
    App._pendingRegDocs = [{
      name: 'RCS Registration Document',
      type: 'RCS Document',
      fileName: file.name,
      format: (file.name.split('.').pop() || '').toUpperCase(),
      mimeType: file.type || 'application/octet-stream',
      dataUrl: e.target.result,
      uploadedAt: new Date().toISOString()
    }];
    if (label) label.textContent = '\u2713 ' + file.name;
  };
  reader.onerror = function () {
    if (label) label.textContent = 'Could not read file';
  };
  reader.readAsDataURL(file);
};

// ═══════════════════════════════════════════════════════════════
// STEP: Capture the registration form + documents, then move to the
// "Create Username & Password" step (does NOT save the record yet).
// ═══════════════════════════════════════════════════════════════
App.proceedToCreateCredentials = function () {
  const reg = App.state.ncdRegistration;

  // Capture every registration field value by its data key
  const data = {};
  const labels = {};
  document.querySelectorAll('[data-reg-key]').forEach(el => {
    const key = el.getAttribute('data-reg-key');
    data[key] = el.value;
    labels[key] = el.getAttribute('data-reg-label') || key;
  });
  if (!data.mobile) data.mobile = reg.mobileNumber || '';
  data.approvalStatus = 'Pending';

  // Preserve captured registration data + documents while we collect creds.
  App._pendingRegData = {
    fields: data,
    fieldLabels: labels,
    documents: (App._pendingRegDocs || []).slice(),
    ncdCode: data.ncdId || reg.enteredCode || '',
    verifiedMobile: reg.mobileNumber || data.mobile || ''
  };

  App.navigate('create-credentials');
};

// ═══════════════════════════════════════════════════════════════
// PAGE: CREATE USERNAME & PASSWORD (new registration step)
// ═══════════════════════════════════════════════════════════════
App.renderCreateCredentials = function () {
  // Guard: must have completed the form first
  if (!App._pendingRegData) {
    return App.renderMobileVerification ? App.renderMobileVerification() : '';
  }
  const saved = App.state.pendingCredentials || {};

  return `
  <div style="min-height:100vh;background:#F5F5F5;padding:30px 16px;">
    <div style="width:100%;max-width:560px;margin:0 auto;">

      ${this.renderRegProgress(5)}

      <div style="background:#fff;border-radius:12px;overflow:hidden;
                  box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:24px 28px;
                    display:flex;align-items:center;gap:14px;">
          <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:50%;
                      display:flex;align-items:center;justify-content:center;font-size:22px;">🔐</div>
          <div>
            <h2 style="margin:0;font-size:1.25rem;color:#fff;font-weight:700;">Create Username &amp; Password</h2>
            <p style="margin:3px 0 0 0;font-size:0.82rem;color:rgba(255,255,255,0.85);">
              Set your login credentials to complete registration
            </p>
          </div>
        </div>

        <!-- Body -->
        <div style="padding:28px;">

          <!-- Full Name -->
          <div class="form-group" style="margin-bottom:18px;">
            <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
              Full Name <span style="color:#F44336;">*</span>
            </label>
            <input type="text" id="cred-fullname" class="form-control" placeholder="Enter Full Name"
                   value="${saved.fullName || ''}" autocomplete="off"
                   oninput="App.clearCredError('cred-fullname-error')"/>
            <div id="cred-fullname-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
          </div>

          <!-- Designation -->
          <div class="form-group" style="margin-bottom:18px;">
            <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
              Designation <span style="color:#F44336;">*</span>
            </label>
            <input type="text" id="cred-designation" class="form-control" placeholder="Enter Designation (e.g., President, Secretary)"
                   value="${saved.designation || ''}" autocomplete="off"
                   oninput="App.clearCredError('cred-designation-error')"/>
            <div id="cred-designation-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
          </div>

          <!-- Username -->
          <div class="form-group" style="margin-bottom:18px;">
            <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
              Username <span style="color:#F44336;">*</span>
            </label>
            <input type="text" id="cred-username" class="form-control" placeholder="Enter Username"
                   value="${saved.username || ''}" autocomplete="off"
                   oninput="App.clearCredError('cred-username-error')"/>
            <div id="cred-username-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
          </div>

          <!-- Password -->
          <div class="form-group" style="margin-bottom:18px;">
            <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
              Password <span style="color:#F44336;">*</span>
            </label>
            <div style="position:relative;">
              <input type="password" id="cred-password" class="form-control" placeholder="Enter Password"
                     autocomplete="new-password" style="padding-right:44px;"
                     oninput="App.clearCredError('cred-password-error')"/>
              <span class="material-icons" id="cred-password-eye" onclick="App.toggleCredPwd('cred-password','cred-password-eye')"
                    style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;
                           color:#757575;font-size:20px;">visibility_off</span>
            </div>
            <div id="cred-password-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
            <small style="color:#757575;font-size:0.74rem;margin-top:6px;display:block;line-height:1.5;">
              Min 8 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
            </small>
          </div>

          <!-- Confirm Password -->
          <div class="form-group" style="margin-bottom:24px;">
            <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
              Confirm Password <span style="color:#F44336;">*</span>
            </label>
            <div style="position:relative;">
              <input type="password" id="cred-confirm" class="form-control" placeholder="Re-enter Password"
                     autocomplete="new-password" style="padding-right:44px;"
                     oninput="App.clearCredError('cred-confirm-error')"/>
              <span class="material-icons" id="cred-confirm-eye" onclick="App.toggleCredPwd('cred-confirm','cred-confirm-eye')"
                    style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;
                           color:#757575;font-size:20px;">visibility_off</span>
            </div>
            <div id="cred-confirm-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
          </div>

          <!-- CAPTCHA (reused BeejCaptcha component) -->
          <div style="margin-bottom:20px;">
            ${BeejCaptcha.getHtml()}
          </div>

          <!-- Buttons -->
          <div style="display:flex;gap:12px;">
            <button onclick="App.navigate('ncd-registration-form')"
                    style="flex:1;padding:13px;background:#F5F5F5;color:#555;border:none;border-radius:8px;
                           font-size:0.95rem;font-weight:600;cursor:pointer;display:flex;align-items:center;
                           justify-content:center;gap:6px;"
                    onmouseover="this.style.background='#EEEEEE'" onmouseout="this.style.background='#F5F5F5'">
              <span class="material-icons" style="font-size:18px;">arrow_back</span> Back
            </button>
            <button onclick="App.createAccount()"
                    style="flex:2;padding:13px;background:#4CAF50;color:#fff;border:none;border-radius:8px;
                           font-size:0.95rem;font-weight:700;cursor:pointer;display:flex;align-items:center;
                           justify-content:center;gap:8px;box-shadow:0 2px 8px rgba(76,175,80,0.3);"
                    onmouseover="this.style.background='#388E3C'" onmouseout="this.style.background='#4CAF50'">
              <span class="material-icons" style="font-size:18px;">person_add</span> Create Account
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>`;
};

// Toggle password visibility + eye icon
App.toggleCredPwd = function (inputId, eyeId) {
  const inp = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    if (eye) eye.textContent = 'visibility';
  } else {
    inp.type = 'password';
    if (eye) eye.textContent = 'visibility_off';
  }
};

App.clearCredError = function (id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
};
App._showCredError = function (id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
};

// Validate credentials, then finalise the registration.
App.createAccount = function () {
  const fnEl = document.getElementById('cred-fullname');
  const dgEl = document.getElementById('cred-designation');
  const uEl = document.getElementById('cred-username');
  const pEl = document.getElementById('cred-password');
  const cEl = document.getElementById('cred-confirm');
  const fullName = fnEl ? fnEl.value.trim() : '';
  const designation = dgEl ? dgEl.value.trim() : '';
  const username = uEl ? uEl.value.trim() : '';
  const password = pEl ? pEl.value : '';
  const confirm = cEl ? cEl.value : '';

  // Keep entered values so they survive a re-render
  App.state.pendingCredentials = { fullName, designation, username };

  // Full Name: required
  if (!fullName) {
    App._showCredError('cred-fullname-error', 'Full Name is required.');
    return;
  }
  // Designation: required
  if (!designation) {
    App._showCredError('cred-designation-error', 'Designation is required.');
    return;
  }

  // Username: required + unique
  if (!username) {
    App._showCredError('cred-username-error', 'Username is required.');
    return;
  }
  if (App.SocUserStore.exists(username)) {
    App._showCredError('cred-username-error', 'This username already exists. Please choose another.');
    return;
  }

  // Password: required + strength rules
  if (!password) {
    App._showCredError('cred-password-error', 'Password is required.');
    return;
  }
  const rules = [
    [password.length >= 8, 'at least 8 characters'],
    [/[A-Z]/.test(password), '1 uppercase letter'],
    [/[a-z]/.test(password), '1 lowercase letter'],
    [/[0-9]/.test(password), '1 number'],
    [/[^A-Za-z0-9]/.test(password), '1 special character']
  ];
  const missing = rules.filter(r => !r[0]).map(r => r[1]);
  if (missing.length) {
    App._showCredError('cred-password-error', 'Password must contain ' + missing.join(', ') + '.');
    return;
  }

  // Confirm password must match
  if (confirm !== password) {
    App._showCredError('cred-confirm-error', 'Passwords do not match.');
    return;
  }

  // CAPTCHA must be valid
  const captcha = BeejCaptcha.validate();
  if (!captcha.valid) {
    BeejCaptcha.showError(captcha.message);
    return;
  }

  // Persist credentials against the registration + finalise the record.
  App.state.pendingCredentials = { fullName, designation, username, password };
  App.finaliseSocietyRegistration(username, password, fullName, designation);
};

// ═══════════════════════════════════════════════════════════════
// FINALISE: save the society application (with credentials) → Login
// ═══════════════════════════════════════════════════════════════
App.finaliseSocietyRegistration = function (username, password, fullName, designation) {
  const reg = App.state.ncdRegistration;
  const pending = App._pendingRegData || { fields: {}, fieldLabels: {}, documents: [] };

  const codes = App.SocAppStore.nextCodes();
  const now = new Date();
  const record = {
    id: codes.id,
    code: codes.code,
    status: 'Pending Approval',
    submittedAt: now.toISOString(),
    submittedDate: now.toISOString().split('T')[0],
    name: (pending.fields.societyName) || 'Society',
    district: pending.fields.district || '',
    ncdCode: pending.ncdCode || reg.enteredCode || '',
    verifiedMobile: pending.verifiedMobile || reg.mobileNumber || '',
    fields: pending.fields,
    fieldLabels: pending.fieldLabels,
    documents: pending.documents,
    // login credentials created by the society (password stored plainly for
    // the wireframe/mock only — replace with hashing + real auth for prod).
    fullName: fullName || '',
    designation: designation || '',
    username: username,
    password: password
  };
  App.SocAppStore.add(record);

  // Register the login credential so the username is unique + usable at login.
  App.SocUserStore.add({
    fullName: fullName || '',
    designation: designation || '',
    username: username,
    password: password,
    societyCode: record.code,
    applicationId: record.id,
    createdAt: now.toISOString()
  });

  // Success message
  alert('Username and password created successfully.\n\nSociety Registration submitted successfully for approval.');

  // Reset the whole verification + registration session
  reg.mobileNumber = '';
  reg.mobileVerified = false;
  reg.otpVerified = false;
  reg.otp = '';
  reg.otpExpiry = 0;
  reg.otpAttempts = 0;
  reg.resendAt = 0;
  reg.enteredCode = '';
  reg.formSubmitted = false;
  App._pendingRegDocs = [];
  App._pendingRegData = null;
  App.state.pendingCredentials = null;

  // Redirect to the Login Page — the user can log in with the new credentials.
  App.navigate('login');
};

// Backward-compatible alias (in case anything still calls the old name).
App.submitNCDRegistration = function () {
  App.proceedToCreateCredentials();
};

// ═══════════════════════════════════════════════════════════════
// ROUTER EXTENSION (fallback for renderPage inside app layout)
// ═══════════════════════════════════════════════════════════════
(function extendRouterForNCDFlow() {
  const originalRender = App.renderPage.bind(App);

  App.renderPage = function () {
    const page = this.state.currentPage;

    if (page === 'mobile-verify') return this.renderMobileVerification();
    if (page === 'otp-verify') return this.renderOTPVerification();
    if (page === 'ncd-entry') return this.renderNCDEntry();
    if (page === 'ncd-registration-form') return this.renderNCDRegistrationForm();
    if (page === 'create-credentials') return this.renderCreateCredentials();

    return originalRender();
  };
})();

console.log('[NCD Registration] Mobile + CAPTCHA + OTP verification flow loaded');
