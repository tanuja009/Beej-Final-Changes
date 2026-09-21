// ============================================================
// BEEJ SANGH PROCUREMENT PORTAL — Main App Controller
// ============================================================
const App = {
  state: {
    currentUser: null,
    currentPage: 'login',
    currentRole: 'society',  // 'society' | 'admin'
    sidebarOpen: false,
    // Mock data
    members: [
      { id: 'MBR-001', name: 'Ramesh Kumar', father: 'Suresh Kumar', mobile: '9876543210', aadhaar: '1234-5678-9012', gender: 'Male', category: 'General', email: 'ramesh@example.com', address: 'H.No. 123, Ward 2, Main Road', village: 'Rampur', gp: 'Rampur GP', block: 'Patan', district: 'Chhindwara', pincode: '480001', state: 'MP', totalLand: 4.5, irrigated: 2.5, nonIrrigated: 2.0, status: 'Active', joiningDate: '2023-04-15' },
      { id: 'MBR-002', name: 'Sunita Devi', father: 'Mohan Lal', mobile: '9876543211', aadhaar: '2345-6789-0123', gender: 'Female', category: 'OBC', email: 'sunita@example.com', address: 'Village Sehora, Near Temple', village: 'Sehora', gp: 'Sehora GP', block: 'Patan', district: 'Chhindwara', pincode: '480002', state: 'MP', totalLand: 3.2, irrigated: 1.5, nonIrrigated: 1.7, status: 'Active', joiningDate: '2023-06-20' },
      { id: 'MBR-003', name: 'Dinesh Patel', father: 'Kailash Patel', mobile: '9876543212', aadhaar: '3456-7890-1234', gender: 'Male', category: 'SC', email: 'dinesh@example.com', address: 'Ward 5, Bargaon Chowk', village: 'Bargaon', gp: 'Bargaon GP', block: 'Harrai', district: 'Chhindwara', pincode: '480003', state: 'MP', totalLand: 6.0, irrigated: 3.0, nonIrrigated: 3.0, status: 'Active', joiningDate: '2023-03-10' },
    ],
    demands: [
      { id: 'DEM-2024-001', date: '2024-06-15', season: 'Kharif', crop: 'Soybean', variety: 'JS-335', qty: 120, payStatus: 'Paid', approvalStatus: 'Approved' },
      { id: 'DEM-2024-002', date: '2024-10-10', season: 'Rabi', crop: 'Wheat', variety: 'GW-322', qty: 200, payStatus: 'Pending', approvalStatus: 'Under Review' },
      { id: 'DEM-2024-003', date: '2024-11-05', season: 'Rabi', crop: 'Gram', variety: 'JG-315', qty: 80, payStatus: 'Paid', approvalStatus: 'Approved' },
    ],
    societies: [
      { code: 'SOC-001', name: 'Rampur Krishi Samiti', district: 'Chhindwara', members: 65, status: 'Active' },
      { code: 'SOC-002', name: 'Sehora Kisan Sabha', district: 'Seoni', members: 72, status: 'Active' },
      { code: 'SOC-003', name: 'Bargaon Beej Samiti', district: 'Narsinghpur', members: 48, status: 'Inactive' },
      { code: 'SOC-004', name: 'Patan Krishi Vikas Samiti', district: 'Chhindwara', members: 91, status: 'Active' },
    ],
    adminDemands: [
      { id: 'DEM-2024-001', society: 'Rampur Krishi Samiti', socCode: 'SOC-001', district: 'Chhindwara', date: '2024-06-15', season: 'Kharif', crop: 'Soybean', variety: 'JS-335', requestedQty: 120, approvedQty: 120, pendingQty: 0, members: 65, payStatus: 'Paid', approvalStatus: 'Approved', remarks: '' },
      { id: 'DEM-2024-004', society: 'Sehora Kisan Sabha', socCode: 'SOC-002', district: 'Seoni', date: '2024-11-20', season: 'Rabi', crop: 'Wheat', variety: 'GW-322', requestedQty: 180, approvedQty: 0, pendingQty: 180, members: 72, payStatus: 'Paid', approvalStatus: 'Pending', remarks: '' },
      { id: 'DEM-2024-005', society: 'Patan Krishi Vikas Samiti', socCode: 'SOC-004', district: 'Chhindwara', date: '2024-11-22', season: 'Rabi', crop: 'Mustard', variety: 'Pusa Bold', requestedQty: 60, approvedQty: 0, pendingQty: 60, members: 91, payStatus: 'Paid', approvalStatus: 'Hold', remarks: 'Awaiting field verification' },
      { id: 'DEM-2024-006', society: 'Bargaon Beej Samiti', socCode: 'SOC-003', district: 'Narsinghpur', date: '2024-11-25', season: 'Rabi', crop: 'Gram', variety: 'JG-315', requestedQty: 100, approvedQty: 60, pendingQty: 40, members: 58, payStatus: 'Paid', approvalStatus: 'Partially Approved', remarks: 'Only 60 Qt available in stock' },
      { id: 'DEM-2024-007', society: 'Rampur Krishi Samiti', socCode: 'SOC-001', district: 'Chhindwara', date: '2024-11-28', season: 'Rabi', crop: 'Wheat', variety: 'HD-2967', requestedQty: 90, approvedQty: 0, pendingQty: 90, members: 65, payStatus: 'Paid', approvalStatus: 'Rejected', remarks: 'Duplicate demand for same season' },
    ],
    // UI: which demand is currently under review
    reviewDemandId: null,
    // UI: which popup is open — null | 'partial' | 'reject' | 'hold'
    demandActionPopup: null,
    stock: [
      { crop: 'Wheat', variety: 'GW-322', available: 850, allocated: 320, distributed: 180 },
      { crop: 'Soybean', variety: 'JS-335', available: 600, allocated: 240, distributed: 120 },
      { crop: 'Gram', variety: 'JG-315', available: 400, allocated: 150, distributed: 80 },
      { crop: 'Mustard', variety: 'Pusa Bold', available: 300, allocated: 80, distributed: 40 },
    ],
    distributions: [
      { society: 'Rampur Krishi Samiti', approvedQty: 120, dispatchQty: 120, dispatchDate: '2024-07-01', status: 'Delivered' },
      { society: 'Sehora Kisan Sabha', approvedQty: 180, dispatchQty: 0, dispatchDate: '-', status: 'Pending' },
    ],
    memberDistributions: [
      { member: 'Ramesh Kumar', crop: 'Soybean', variety: 'JS-335', approved: 2.5, distributed: 2.5, status: 'Done' },
      { member: 'Sunita Devi', crop: 'Soybean', variety: 'JS-335', approved: 2.0, distributed: 0, status: 'Pending' },
      { member: 'Dinesh Patel', crop: 'Soybean', variety: 'JS-335', approved: 3.0, distributed: 0, status: 'Pending' },
    ],
    currentDemand: null,
    paymentMode: null,

    // ── NEW: Allocation & Distribution Workflow ──
    // Admin: society-level allocations
    societyAllocations: [
      { id: 'ALLOC-001', society: 'Rampur Krishi Samiti', socCode: 'SOC-001', demandId: 'DEM-2024-001', crop: 'Soybean', variety: 'JS-335', requestedQty: 120, approvedQty: 120, availableStock: 600, allocatedQty: 120, status: 'Dispatched', season: 'Kharif' },
      { id: 'ALLOC-002', society: 'Sehora Kisan Sabha', socCode: 'SOC-002', demandId: 'DEM-2024-004', crop: 'Wheat', variety: 'GW-322', requestedQty: 180, approvedQty: 180, availableStock: 850, allocatedQty: 0, status: 'Pending', season: 'Rabi' },
      { id: 'ALLOC-003', society: 'Patan Krishi Vikas Samiti', socCode: 'SOC-004', demandId: 'DEM-2024-005', crop: 'Mustard', variety: 'Pusa Bold', requestedQty: 60, approvedQty: 60, availableStock: 300, allocatedQty: 0, status: 'Approved', season: 'Rabi' },
    ],

    // Admin: dispatch orders
    dispatchOrders: [
      { id: 'DO-2024-001', society: 'Rampur Krishi Samiti', crop: 'Soybean', variety: 'JS-335', qty: 120, dispatchDate: '2024-07-01', vehicleNo: 'MP-09-AB-1234', status: 'Received', allocId: 'ALLOC-001' },
    ],

    // Society: received stock
    receivedStock: [
      { id: 'RS-001', crop: 'Soybean', variety: 'JS-335', allocatedQty: 120, distributedQty: 2.5, season: 'Kharif', receivedDate: '2024-07-03', dispatchOrderId: 'DO-2024-001' },
    ],

    // Society: member distribution records
    distributionRecords: [
      { receiptNo: 'RCP-001', memberId: 'MBR-001', memberName: 'Ramesh Kumar', village: 'Rampur', crop: 'Soybean', variety: 'JS-335', qty: 2.5, date: '2024-07-05', status: 'Completed', stockId: 'RS-001' },
    ],

    // UI helpers
    selectedMemberIds: [],
    selectedMemberForDist: null,  // member object chosen for seed allotment
    activeDispatchTab: 'allocation',
    activeSocDistTab: 'stock',
    distributionPopup: null,
    receiptPopup: null,

    // ── Forgot Password & Profile Update OTP State ──
    forgotPwdStep: 1, // 1: Enter Mobile, 2: Verify OTP, 3: Reset Password
    forgotPwdMobile: '',
    forgotPwdOTP: '',
    forgotPwdGeneratedOTP: '',
    profileUpdateMode: false, // true when updating profile with OTP
    profileOTPSent: false,
    profileGeneratedOTP: '',
    changePasswordModal: false,

    // ── Reset Password Page State ──
    resetPwdOTPSent: false,
    resetPwdOTPVerified: false,
    resetPwdGeneratedOTP: '',
  },

  init() {
    this.render();
  },

  navigate(page) {
    // Reset the Member Onboarding flow whenever the page is opened fresh
    if (page === 'add-member' && this.state.currentPage !== 'add-member') {
      this.state.memberOnboarding = { samagraId: '', stage: 'idle', fetched: false, details: null };
    }
    this.state.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const app = document.getElementById('app');
    if (this.state.currentPage === 'login') {
      app.innerHTML = this.renderLogin();
    } else if (this.state.currentPage === 'soc-register') {
      app.innerHTML = this.renderPublicSocRegForm();
    } else if (this.state.currentPage === 'ncd-registration') {
      app.innerHTML = this.renderNCDRegistration();
    } else if (this.state.currentPage === 'forgot-password') {
      app.innerHTML = this.renderForgotPassword();
    } else if (this.state.currentPage === 'otp-login') {
      app.innerHTML = this.renderOtpLogin ? this.renderOtpLogin() : '';
    } else if (this.state.currentPage === 'mobile-verify') {
      app.innerHTML = this.renderMobileVerification ? this.renderMobileVerification() : '';
    } else if (this.state.currentPage === 'otp-verify') {
      app.innerHTML = this.renderOTPVerification ? this.renderOTPVerification() : '';
    } else if (this.state.currentPage === 'ncd-entry') {
      app.innerHTML = this.renderNCDEntry ? this.renderNCDEntry() : '';
    } else if (this.state.currentPage === 'ncd-registration-form') {
      app.innerHTML = this.renderNCDRegistrationForm ? this.renderNCDRegistrationForm() : '';
    } else if (this.state.currentPage === 'create-credentials') {
      app.innerHTML = this.renderCreateCredentials ? this.renderCreateCredentials() : '';
    } else {
      app.innerHTML = this.renderAppLayout();
    }
    this.bindEvents();
  },

  // ---- LOGIN ----
  renderLogin() {
    return `
    <div class="login-page">
      <div class="login-header">
        <div class="emblem">🌾</div>
        <h1>Beej Sangh Procurement Portal</h1>
        <p>Madhya Pradesh State Agriculture Department</p>
      </div>
      <div class="login-card">
        <h2>🔐 Sign In to Portal</h2>
        <div class="role-tabs">
          <button class="role-tab ${this.state.currentRole === 'society' ? 'active' : ''}" onclick="App.setRole('society')">
            🧑‍🌾 Society Head
          </button>
          <button class="role-tab ${this.state.currentRole === 'admin' ? 'active' : ''}" onclick="App.setRole('admin')">
            🏛️ Beej Sangh Admin
          </button>
        </div>
        ${this.state.currentRole === 'society' ? `
        <div class="form-group">
          <label>Society Code</label>
          <div class="input-icon-wrap">
            <span class="material-icons">business</span>
            <input type="text" class="form-control" placeholder="e.g. SOC-001" value="SOC-001"/>
          </div>
        </div>` : ''}
        <div class="form-group">
          <label>Username</label>
          <div class="input-icon-wrap">
            <span class="material-icons">person</span>
            <input type="text" class="form-control" placeholder="Enter username" value="admin"/>
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-icon-wrap">
            <span class="material-icons">lock</span>
            <input type="password" class="form-control" placeholder="Enter password" value="••••••••"/>
          </div>
        </div>
        ${BeejCaptcha.getHtml()}
        <button class="btn btn-primary btn-full btn-lg" id="login-submit-btn" onclick="App.login()">
          <span class="material-icons">login</span> Login to Portal
        </button>
        <div class="forgot-link">
          <a href="#" onclick="App.navigate('forgot-password');return false" style="color:#2E7D32;font-weight:500;">Forgot Password</a> &nbsp;|&nbsp;
          <a href="#" onclick="App.startOtpLogin();return false" style="color:#2E7D32;font-weight:500;">Login with OTP</a>
        </div>
        <div style="margin-top:16px;padding:12px;background:#f5f5f5;border-radius:8px;font-size:0.78rem;color:#666;text-align:center;">
          Demo: Click <b>Login</b> for ${this.state.currentRole === 'admin' ? 'Admin' : 'Society Head'} Dashboard
        </div>
        <div style="margin-top:14px;text-align:center;padding-top:14px;border-top:1px solid #e8f5e9;">
          <span style="font-size:0.85rem;color:#757575;">New Society? &nbsp;</span>
          <a href="#" onclick="App.startSocietyRegistration();return false;"
            style="padding:10px 24px;background:#4CAF50;color:#fff;border:none;border-radius:8px;
                   font-size:0.88rem;font-weight:600;cursor:pointer;text-decoration:none;
                   display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(76,175,80,0.3);">
            <span class="material-icons" style="font-size:18px;">app_registration</span>
            New Society Registration
          </a>
        </div>
      </div>
    </div>`;
  },

  setRole(role) {
    this.state.currentRole = role;
    this.render();
  },

  login() {
    /* ── Step 1: CAPTCHA validation (added; auth logic unchanged) ── */
    const captchaResult = BeejCaptcha.validate();
    if (!captchaResult.valid) {
      BeejCaptcha.showError(captchaResult.message);
      return;   /* Block login — existing auth logic never reached */
    }

    /* ── Step 2: Existing authentication logic — NOT modified ───── */
    this.state.currentUser = this.state.currentRole === 'admin'
      ? { name: 'Admin User', role: 'Beej Sangh Admin', initials: 'AU' }
      : { name: 'Ramesh Verma', role: 'Society Head - SOC-001', initials: 'RV' };
    this.navigate(this.state.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard');
  },

  // ---- FORGOT PASSWORD PAGE ----
  renderForgotPassword() {
    const step = this.state.forgotPwdStep;

    return `
    <div class="login-page">
      <div class="login-header">
        <div class="emblem">🌾</div>
        <h1>Beej Sangh Procurement Portal</h1>
        <p>Madhya Pradesh State Agriculture Department</p>
      </div>
      <div class="login-card" style="max-width:500px;">
        <h2>🔒 Reset Password</h2>
        <div style="text-align:center;margin-bottom:20px;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:16px;">
            <div class="step-indicator ${step >= 1 ? 'active' : ''}">1</div>
            <div class="step-line ${step >= 2 ? 'active' : ''}"></div>
            <div class="step-indicator ${step >= 2 ? 'active' : ''}">2</div>
            <div class="step-line ${step >= 3 ? 'active' : ''}"></div>
            <div class="step-indicator ${step >= 3 ? 'active' : ''}">3</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.75rem;color:#666;">
            <span>Mobile Number</span>
            <span>Verify OTP</span>
            <span>New Password</span>
          </div>
        </div>

        ${step === 1 ? `
          <div class="form-group">
            <label>Mobile Number <span style="color:#F44336;">*</span></label>
            <div class="input-icon-wrap">
              <span class="material-icons">phone</span>
              <input type="tel" id="forgot-mobile" class="form-control" placeholder="Enter registered mobile number" maxlength="10" pattern="[0-9]{10}"/>
            </div>
            <small style="color:#666;font-size:0.75rem;">We'll send an OTP to verify your identity</small>
          </div>
          <button class="btn btn-primary btn-full" onclick="App.sendForgotPasswordOTP()">
            <span class="material-icons">send</span> Send OTP
          </button>
        ` : step === 2 ? `
          <div class="alert alert-success" style="margin-bottom:20px;">
            <span class="material-icons">check_circle</span>
            <div>
              <b>OTP Sent Successfully!</b><br/>
              A 6-digit OTP has been sent to <b>+91 ${this.state.forgotPwdMobile}</b>
            </div>
          </div>
          <div class="form-group">
            <label>Enter OTP <span style="color:#F44336;">*</span></label>
            <div class="input-icon-wrap">
              <span class="material-icons">password</span>
              <input type="text" id="forgot-otp" class="form-control" placeholder="Enter 6-digit OTP" maxlength="6" pattern="[0-9]{6}" style="letter-spacing:8px;font-size:1.2rem;text-align:center;"/>
            </div>
          </div>
          <div style="text-align:center;margin:12px 0;">
            <a href="#" onclick="App.sendForgotPasswordOTP();return false" style="font-size:0.85rem;color:#2E7D32;">
              Didn't receive OTP? <b>Resend</b>
            </a>
          </div>
          <button class="btn btn-primary btn-full" onclick="App.verifyForgotPasswordOTP()">
            <span class="material-icons">verified_user</span> Verify OTP
          </button>
        ` : `
          <div class="alert alert-success" style="margin-bottom:20px;">
            <span class="material-icons">check_circle</span>
            <div><b>OTP Verified!</b> Now set your new password</div>
          </div>
          <div class="form-group">
            <label>New Password <span style="color:#F44336;">*</span></label>
            <div class="input-icon-wrap">
              <span class="material-icons">lock</span>
              <input type="password" id="forgot-new-password" class="form-control" placeholder="Enter new password" minlength="8"/>
            </div>
            <small style="color:#666;font-size:0.75rem;">Minimum 8 characters</small>
          </div>
          <div class="form-group">
            <label>Confirm Password <span style="color:#F44336;">*</span></label>
            <div class="input-icon-wrap">
              <span class="material-icons">lock</span>
              <input type="password" id="forgot-confirm-password" class="form-control" placeholder="Confirm new password"/>
            </div>
          </div>
          <button class="btn btn-primary btn-full" onclick="App.resetPassword()">
            <span class="material-icons">check_circle</span> Reset Password
          </button>
        `}

        <div style="margin-top:20px;text-align:center;padding-top:16px;border-top:1px solid #e0e0e0;">
          <a href="#" onclick="App.state.forgotPwdStep=1;App.navigate('login');return false" style="color:#666;font-size:0.85rem;">
            <span class="material-icons" style="font-size:16px;vertical-align:middle;">arrow_back</span> Back to Login
          </a>
        </div>
      </div>
    </div>`;
  },

  sendForgotPasswordOTP() {
    if (this.state.forgotPwdStep === 1) {
      const mobile = document.getElementById('forgot-mobile')?.value?.trim();
      if (!mobile || mobile.length !== 10 || !/^[0-9]{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
      }
      this.state.forgotPwdMobile = mobile;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.state.forgotPwdGeneratedOTP = otp;
    console.log(`[OTP] Forgot Password OTP for ${this.state.forgotPwdMobile}: ${otp}`);

    // In production: Send SMS via API
    alert(`OTP sent to +91 ${this.state.forgotPwdMobile}\n\n[Demo Mode] Your OTP is: ${otp}\n\n(In production, this will be sent via SMS)`);

    this.state.forgotPwdStep = 2;
    this.render();
  },

  verifyForgotPasswordOTP() {
    const otp = document.getElementById('forgot-otp')?.value?.trim();
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (otp !== this.state.forgotPwdGeneratedOTP) {
      alert('❌ Invalid OTP! Please try again.');
      return;
    }

    this.state.forgotPwdStep = 3;
    this.render();
  },

  resetPassword() {
    const newPwd = document.getElementById('forgot-new-password')?.value;
    const confirmPwd = document.getElementById('forgot-confirm-password')?.value;

    if (!newPwd || newPwd.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (newPwd !== confirmPwd) {
      alert('Passwords do not match!');
      return;
    }

    // In production: Update password via API
    alert('✅ Password reset successfully!\n\nYou can now login with your new password.');

    // Reset state and go to login
    this.state.forgotPwdStep = 1;
    this.state.forgotPwdMobile = '';
    this.state.forgotPwdOTP = '';
    this.state.forgotPwdGeneratedOTP = '';
    this.navigate('login');
  },

  // ---- APP LAYOUT ----
  renderAppLayout() {
    const isAdmin = this.state.currentRole === 'admin';
    return `
    <div class="app-layout">
      ${isAdmin ? this.renderAdminSidebar() : this.renderSocietySidebar()}
      <div class="main-content">
        ${this.renderHeader()}
        <div class="page-content">
          ${this.renderPage()}
        </div>
      </div>
    </div>`;
  },

  renderHeader() {
    const titles = {
      'dashboard': 'Society Head Dashboard', 'admin-dashboard': 'Admin Dashboard',
      'add-member': 'Add New Member', 'member-list': 'Society Member List',
      'member-view': 'Member Details', 'member-edit': 'Edit Member',
      'raise-demand': 'Raise Breeder Seed Demand', 'demand-preview': 'Demand Preview',
      'payment': 'Payment', 'demand-history': 'Breeder Seed Demand History',
      'seed-allocation': 'Seed Allocation', 'distribution-register': 'Distribution Register',
      'payment-history': 'Payment History', 'society-reports': 'Society Reports',
      'admin-societies': 'Society Management', 'admin-demands': 'Demand Management',
      'admin-stock': 'Stock Management', 'admin-distribution': 'Distribution Management',
      'admin-reports': 'Reports', 'demand-review': 'Demand Review',
      'profile': 'My Profile',
      'reset-password': 'Reset Password',
      // New pages
      'admin-society-allocation': 'Society Allocation',
      'admin-dispatch-orders': 'Dispatch Orders',
      'admin-dist-tracking': 'Distribution Tracking',
      'soc-available-stock': 'Available Stock',
      'soc-member-distribution': 'Breeder Seeds Distribution to Member',
      'soc-dist-register': 'Distribution Register',
    };
    const u = this.state.currentUser;
    return `
    <header class="app-header">
      <div class="header-left">
        <span class="header-title">${titles[this.state.currentPage] || 'Portal'}</span>
      </div>
      <div class="header-right">
        <div class="header-badge"><span class="material-icons">notifications</span><span class="badge-dot"></span></div>
        <div class="user-chip" onclick="App.toggleUserDropdown(event)">
          <div class="user-avatar">${u.initials}</div>
          <div class="user-info">
            <div class="name">${u.name}</div>
            <div class="role">${u.role}</div>
          </div>
          <span class="material-icons" style="font-size:20px;color:#666;margin-left:8px;">arrow_drop_down</span>
        </div>
        
        <!-- User Dropdown Menu -->
        <div class="user-dropdown" id="user-dropdown" style="display:none;">
          <div class="user-dropdown-header">
            <div class="user-avatar-large">${u.initials}</div>
            <div style="margin-left:12px;">
              <div style="font-weight:600;font-size:0.95rem;color:#212121;">${u.name}</div>
              <div style="font-size:0.8rem;color:#757575;margin-top:2px;">${u.role}</div>
            </div>
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" onclick="App.navigate('profile');App.closeUserDropdown();">
            <span class="material-icons">person</span>
            <span>Profile Update</span>
          </div>
          <div class="user-dropdown-item" onclick="App.navigate('reset-password');App.closeUserDropdown();">
            <span class="material-icons">lock_reset</span>
            <span>Reset Password</span>
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item logout" onclick="App.logout()">
            <span class="material-icons">logout</span>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </header>`;
  },

  toggleUserDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
  },

  closeUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  },

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.state.currentUser = null;
      this.state.currentPage = 'login';
      this.state.currentRole = 'society';
      this.closeUserDropdown();
      this.render();
      alert('✅ Logged out successfully!');
    }
  },

  // ---- SOCIETY SIDEBAR ----
  renderSocietySidebar() {
    const p = this.state.currentPage;
    const ni = (icon, label, page, sub = false) => `
      <div class="nav-item ${sub ? 'nav-sub' : ''} ${p === page ? 'active' : ''}" onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;
    return `
    <nav class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🌾</div>
        <div class="logo-text"><h3>Beej Sangh Portal</h3><p>Society Module</p></div>
      </div>
      <div class="sidebar-nav">
        <div class="nav-section">
          ${ni('dashboard', 'Dashboard', 'dashboard')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Member Management</div>
          ${ni('person_add', 'Society Member Onboarding', 'add-member')}
          ${ni('group', 'Society Member List', 'member-list')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Demand Management</div>
          ${ni('add_shopping_cart', 'Raise Breeder Seed Demand', 'raise-demand')}
          ${ni('history', 'Breeder Seed Demand History', 'demand-history')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Seed Distribution</div>
          ${ni('inventory_2', 'Available Stock', 'soc-available-stock')}     
          ${ni('how_to_reg', 'Breeder Seeds Distribution to Member', 'soc-member-distribution')}
          ${ni('receipt_long', 'Distribution Register', 'soc-dist-register')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Distribution (Legacy)</div>
          ${ni('agriculture', 'Seed Allocation', 'seed-allocation')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Payments</div>
          ${ni('payment', 'Payment History', 'payment-history')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Reports</div>
          ${ni('bar_chart', 'Society Reports', 'society-reports')}
        </div>
        <div class="nav-section">
          ${ni('account_circle', 'My Profile', 'profile')}
        </div>
      </div>
      <div class="sidebar-footer" onclick="App.logout()">
        <span class="material-icons">logout</span><span>Logout</span>
      </div>
    </nav>`;
  },

  // ---- ADMIN SIDEBAR ----
  renderAdminSidebar() {
    const p = this.state.currentPage;
    const ni = (icon, label, page) => `
      <div class="nav-item ${p === page ? 'active' : ''}" onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;
    return `
    <nav class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🏛️</div>
        <div class="logo-text"><h3>Beej Sangh Admin</h3><p>Admin Module</p></div>
      </div>
      <div class="sidebar-nav">
        <div class="nav-section">
          ${ni('dashboard', 'Dashboard', 'admin-dashboard')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Management</div>
          ${ni('business', 'Society Management', 'admin-societies')}
          ${ni('receipt_long', 'Demand Management', 'admin-demands')}
          ${ni('inventory', 'Stock  Management', 'admin-stock')}
          ${ni('local_shipping', 'Distribution (Old)', 'admin-distribution')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Distribution Management</div>
          ${ni('assignment_turned_in', 'Society Allocation', 'admin-society-allocation')}
          ${ni('local_shipping', 'Dispatch Orders', 'admin-dispatch-orders')}
          ${ni('track_changes', 'Distribution Tracking', 'admin-dist-tracking')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Reports</div>
          ${ni('bar_chart', 'Reports', 'admin-reports')}
        </div>
        <div class="nav-section">
          ${ni('manage_accounts', 'Users', 'profile')}
        </div>
      </div>
      <div class="sidebar-footer" onclick="App.logout()">
        <span class="material-icons">logout</span><span>Logout</span>
      </div>
    </nav>`;
  },

  logout() {
    this.state.currentUser = null;
    this.state.currentPage = 'login';
    this.render();
  },

  // ---- PAGE ROUTER (replaced by full version at bottom) ----

  // ============================
  // SCREEN 2: SOCIETY DASHBOARD
  // ============================
  renderDashboard() {
    const members = this.state.members.length;
    return `
    <div class="page-header">
      <h1>Welcome back, Ramesh Verma 👋</h1>
      <p>Rampur Krishi Samiti (SOC-001) | Kharif Season 2024-25</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">group</span></div>
        <div class="stat-info"><div class="value">${members}</div><div class="label">Total Members</div><div class="change">↑ 3 this month</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">how_to_reg</span></div>
        <div class="stat-info"><div class="value">65</div><div class="label">Active Members</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">shopping_cart</span></div>
        <div class="stat-info"><div class="value">3</div><div class="label">Demands Raised</div></div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info"><div class="value">200 Qt</div><div class="label">Approved Quantity</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">agriculture</span></div>
        <div class="stat-info"><div class="value">120 Qt</div><div class="label">Distributed Qty</div></div>
      </div>
      <div class="stat-card red">
        <div class="stat-icon"><span class="material-icons">pending_actions</span></div>
        <div class="stat-info"><div class="value">₹24,000</div><div class="label">Pending Payments</div></div>
      </div>
    </div>
    <!-- NEW: Stock cards for Society Dashboard -->
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">inventory_2</span></div>
        <div class="stat-info"><div class="value">120 Qt</div><div class="label">Allocated Stock</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">storefront</span></div>
        <div class="stat-info"><div class="value">117.5 Qt</div><div class="label">Available Stock</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info"><div class="value">2.5 Qt</div><div class="label">Distributed Stock</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">account_balance_wallet</span></div>
        <div class="stat-info"><div class="value">117.5 Qt</div><div class="label">Balance Stock</div></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="card">
        <div class="card-header"><h3>Recent Demands</h3><button class="btn btn-outline btn-sm" onclick="App.navigate('demand-history')">View All</button></div>
        <div class="card-body" style="padding:0;">
          <table>
            <thead><tr><th>Demand ID</th><th>Crop</th><th>Qty</th><th>Status</th></tr></thead>
            <tbody>
              ${this.state.demands.map(d => `<tr>
                <td>${d.id}</td><td>${d.crop}</td><td>${d.qty} Qt</td>
                <td><span class="badge ${d.approvalStatus === 'Approved' ? 'badge-success' : d.approvalStatus === 'Under Review' ? 'badge-warning' : 'badge-info'}">${d.approvalStatus}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Quick Actions</h3></div>
        <div class="card-body" style="display:grid;gap:12px;">
          <button class="btn btn-primary" onclick="App.navigate('add-member')"><span class="material-icons">person_add</span> Soceity Member Onboarding</button>
          <button class="btn btn-outline" onclick="App.navigate('raise-demand')"><span class="material-icons">add_shopping_cart</span> Raise Breeder Seed Demand</button>
          <button class="btn btn-info" onclick="App.navigate('distribution-register')"><span class="material-icons">agriculture</span> Distribute Seeds</button>
          <button class="btn btn-gray" onclick="App.navigate('society-reports')"><span class="material-icons">bar_chart</span> View Reports</button>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:20px;">
      <div class="card-header"><h3>Breeder Seeds Distribution Progress</h3></div>
      <div class="card-body">
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:0.85rem;color:#666;">Active Members (65 / min. 50)</span>
            <span style="font-size:0.85rem;font-weight:600;color:#2E7D32;">✓ Eligible for Demand</span>
          </div>
          <div style="background:#E8F5E9;border-radius:4px;height:10px;overflow:hidden;">
            <div style="width:100%;height:100%;background:#4CAF50;border-radius:4px;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:0.85rem;color:#666;">Distribution Complete (120 / 200 Qt)</span>
            <span style="font-size:0.85rem;font-weight:600;">60%</span>
          </div>
          <div style="background:#E8F5E9;border-radius:4px;height:10px;overflow:hidden;">
            <div style="width:60%;height:100%;background:#4CAF50;border-radius:4px;"></div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 3: MEMBER ONBOARDING (Samagra ID → CAPTCHA → Fetch → auto-fill)
  // Same-page progressive flow. Reuses the existing BeejCaptcha component.
  // ============================
  renderAddMember() {
    const mo = this.state.memberOnboarding || (this.state.memberOnboarding = { samagraId: '', stage: 'idle', fetched: false, details: null });
    if (!mo.stage) mo.stage = mo.fetched ? 'verified' : 'idle';

    // ── OTP Verification section (shown after Fetch Details, before details) ──
    const maskedMobile = mo.otpMobile
      ? ('*'.repeat(Math.max(0, mo.otpMobile.length - 4)) + mo.otpMobile.slice(-4))
      : '******4321';
    const otpSection = (mo.stage === 'otp') ? `
      <div style="border-top:2px dashed #C8E6C9;margin:8px 0 24px;"></div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">verified_user</span> OTP Verification</div>
        <div style="max-width:420px;">
          <div style="background:#E8F5E9;border-left:4px solid #4CAF50;border-radius:8px;
               padding:12px 16px;margin-bottom:12px;color:#1B5E20;font-size:0.85rem;
               display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="color:#2E7D32;font-size:20px;">sms</span>
            <div>
              OTP has been sent to your registered mobile number.<br>
              <strong>+91 ${maskedMobile}</strong>
            </div>
          </div>
          <!-- DEMO ONLY: static wireframe OTP shown for testing (no real SMS). -->
          <div style="background:#FFF8E1;border:1px dashed #FFB300;border-radius:8px;
               padding:10px 14px;margin-bottom:16px;color:#8D6E00;font-size:0.85rem;
               display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="color:#F9A825;font-size:20px;">bug_report</span>
            <span>Demo OTP (wireframe): <strong style="letter-spacing:2px;font-size:1rem;color:#E65100;">${this.MEMBER_OTP_CONFIG.DEMO_OTP}</strong></span>
          </div>
          <div class="form-group">
            <label>Enter OTP <span style="color:#F44336;">*</span></label>
            <input type="text" class="form-control" id="mo-otp" inputmode="numeric" maxlength="6"
                   placeholder="Enter 6-digit OTP"
                   style="letter-spacing:8px;font-size:1.1rem;text-align:center;max-width:220px;"
                   oninput="this.value=this.value.replace(/[^0-9]/g,'');App.onMoOtpInput()"
                   onkeypress="if(event.key==='Enter'&&this.value.length===6) App.verifyMemberOtp()"/>
            <div id="mo-otp-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 16px;font-size:0.82rem;">
            <span style="color:#757575;">Didn't receive the OTP?</span>
            <span>
              <a href="#" id="mo-resend-link" onclick="App.resendMemberOtp();return false;"
                 style="color:#2E7D32;font-weight:600;text-decoration:none;">Resend OTP</a>
              <span id="mo-resend-timer" style="color:#9E9E9E;"></span>
            </span>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-primary" id="mo-verify-btn" disabled
                    onclick="App.verifyMemberOtp()"
                    style="display:inline-flex;align-items:center;gap:6px;opacity:0.6;">
              <span class="material-icons">check</span> Verify OTP
            </button>
            <button class="btn btn-outline" onclick="App.cancelMemberOtp()"
                    style="display:inline-flex;align-items:center;gap:6px;">
              <span class="material-icons">arrow_back</span> Change Samagra ID
            </button>
          </div>
        </div>
      </div>
    ` : '';

    // Auto-filled member details section (shown only after OTP verification)
    const detailsSection = (mo.stage === 'verified' && mo.details) ? `
      <div style="border-top:2px dashed #C8E6C9;margin:8px 0 20px;"></div>
      <div style="background:#E8F5E9;border-left:4px solid #4CAF50;border-radius:8px;
           padding:12px 16px;margin-bottom:20px;color:#1B5E20;font-size:0.9rem;font-weight:600;
           display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="color:#2E7D32;">check_circle</span>
        Mobile number verified successfully.
      </div>` : '';

    const detailsFields = (mo.stage === 'verified' && mo.details) ? `
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">badge</span> Member Details
          <span style="font-size:0.72rem;color:#2E7D32;font-weight:500;margin-left:8px;">
            (Auto-filled from Samagra ID)
          </span>
        </div>
        <div class="form-grid">
          ${this._moField('Member Name', 'm-name', mo.details.name)}
          ${this._moField('Samagra ID', 'm-samagra-display', mo.details.samagraId)}
          ${this._moField("Father's / Husband's Name", 'm-father', mo.details.father)}
          ${this._moField('Date of Birth', 'm-dob', mo.details.dob)}
          ${this._moField('Gender', 'm-gender', mo.details.gender)}
          ${this._moField('Mobile Number', 'm-mobile', mo.details.mobile)}
          ${this._moField('Address', 'm-address', mo.details.address, true)}
          ${this._moField('District', 'm-district', mo.details.district)}
          ${this._moField('Block', 'm-block', mo.details.block)}
          ${this._moField('Village', 'm-village', mo.details.village)}
          ${this._moField('Pincode', 'm-pincode', mo.details.pincode)}
          ${this._moField('Category', 'm-category', mo.details.category)}
          <div class="form-group">
            <label>eKYC Status</label>
            <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f5f5f5;border:1px solid #E0E0E0;border-radius:6px;">
              <span class="material-icons" style="font-size:18px;color:${mo.details.ekyc === 'Verified' ? '#2E7D32' : '#E65100'};">${mo.details.ekyc === 'Verified' ? 'verified' : 'gpp_maybe'}</span>
              <span class="badge ${mo.details.ekyc === 'Verified' ? 'badge-success' : 'badge-warning'}">${mo.details.ekyc || 'Not Verified'}</span>
            </div>
            <input type="hidden" id="m-ekyc" value="${mo.details.ekyc || 'Not Verified'}">
          </div>
        </div>
      </div>
      <div class="form-actions" style="justify-content:flex-end;">
        <button class="btn btn-outline" onclick="App.showToast('Draft saved.')">
          <span class="material-icons">save</span> Save
        </button>
        <button class="btn btn-primary" onclick="App.submitMemberOnboarding()">
          <span class="material-icons">check_circle</span> Continue / Submit
        </button>
      </div>
    ` : '';

    const inVerification = mo.stage === 'otp';   // lock Samagra/CAPTCHA during OTP

    return `
    <div class="page-header">
      <h1>Society Member Onboarding</h1>
      <p>Register a new farmer member for your society</p>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">fingerprint</span> Samagra Verification</div>

          <!-- Step 1: Samagra ID + eKYC Status (side by side) -->
          <div class="form-grid" style="max-width:640px;">
            <div class="form-group">
              <label>Samagra ID <span style="color:#F44336;">*</span></label>
              <input type="text" class="form-control" id="m-samagra-id" inputmode="numeric" maxlength="12"
                     placeholder="Enter Samagra ID" value="${mo.samagraId || ''}" ${inVerification ? 'readonly style="background:#f5f5f5;"' : ''}
                     oninput="this.value=this.value.replace(/[^0-9]/g,'');App.onSamagraIdInput(this.value)"/>
              <div id="m-samagra-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;">
                Please enter Samagra ID.
              </div>
            </div>
            <div class="form-group">
              <label>eKYC Status</label>
              <div id="m-ekyc-status" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f5f5f5;border:1px solid #E0E0E0;border-radius:6px;">
                <span class="material-icons" style="font-size:18px;color:${(mo.samagraId && mo.samagraId.length >= 9) ? '#2E7D32' : '#9E9E9E'};">${(mo.samagraId && mo.samagraId.length >= 9) ? 'verified' : 'gpp_maybe'}</span>
                <span class="badge ${(mo.samagraId && mo.samagraId.length >= 9) ? 'badge-success' : 'badge-gray'}">${(mo.samagraId && mo.samagraId.length >= 9) ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <!-- Step 2: CAPTCHA (revealed once a Samagra ID is entered) -->
          <div id="m-captcha-wrap" style="margin-top:18px;max-width:360px;
               ${(mo.samagraId && mo.samagraId.length >= 9 && mo.stage === 'idle') ? '' : 'display:none;'}">
            ${BeejCaptcha.getHtml()}
          </div>

          <!-- Step 3: Fetch Details -->
          ${mo.stage === 'idle' ? `
          <div style="margin-top:16px;">
            <button class="btn btn-primary btn-lg" onclick="App.fetchSamagraDetails()"
                    style="display:inline-flex;align-items:center;gap:8px;">
              <span class="material-icons">search</span> Fetch Details
            </button>
          </div>` : ''}
        </div>

        ${otpSection}
        ${detailsSection}
        ${detailsFields}
      </div>
    </div>`;
  },

  // Small helper to render an auto-filled (read-only) member detail field.
  _moField(label, id, value, full) {
    return `
      <div class="form-group" ${full ? 'style="grid-column:1/-1;"' : ''}>
        <label>${label}</label>
        <input type="text" class="form-control" id="${id}" value="${value != null ? value : ''}"
               readonly style="background:#f5f5f5;"/>
      </div>`;
  },

  // Show/hide CAPTCHA as the Samagra ID is typed (same-page, no re-render).
  onSamagraIdInput(value) {
    this.state.memberOnboarding = this.state.memberOnboarding || {};
    this.state.memberOnboarding.samagraId = value;
    const err = document.getElementById('m-samagra-error');
    if (err) err.style.display = 'none';
    // Live-update the eKYC status (Active once a valid-length Samagra ID is entered)
    const ekycBox = document.getElementById('m-ekyc-status');
    if (ekycBox) {
      const active = value && value.length >= 9;
      ekycBox.innerHTML = '<span class="material-icons" style="font-size:18px;color:' + (active ? '#2E7D32' : '#9E9E9E') + ';">' + (active ? 'verified' : 'gpp_maybe') + '</span>'
        + '<span class="badge ' + (active ? 'badge-success' : 'badge-gray') + '">' + (active ? 'Active' : 'Inactive') + '</span>';
    }
    const wrap = document.getElementById('m-captcha-wrap');
    if (!wrap) return;
    if (value && value.length >= 9) {
      if (wrap.style.display === 'none') {
        wrap.style.display = '';
        // Render the CAPTCHA canvas now that the wrapper is visible
        if (document.getElementById('captcha-canvas-wrap')) BeejCaptcha.render();
      }
    } else {
      wrap.style.display = 'none';
    }
  },

  // Demo/mock OTP config — replace DEMO_OTP with a real OTP API later.
  MEMBER_OTP_CONFIG: { DEMO_OTP: '123456', RESEND_SECONDS: 30 },

  // Step 3: validate Samagra ID + CAPTCHA, then OPEN OTP VERIFICATION.
  // Society/member details are NOT fetched until OTP is verified.
  fetchSamagraDetails() {
    const idEl = document.getElementById('m-samagra-id');
    const samagraId = idEl ? idEl.value.trim() : '';
    const err = document.getElementById('m-samagra-error');

    // 1) Samagra ID is mandatory
    if (!samagraId) {
      if (err) { err.textContent = 'Please enter Samagra ID.'; err.style.display = 'block'; }
      if (idEl) idEl.focus();
      return;
    }
    // Basic format check (numeric, 9-12 digits)
    if (!/^[0-9]{9,12}$/.test(samagraId)) {
      if (err) { err.textContent = 'Please enter a valid Samagra ID (9 to 12 digits).'; err.style.display = 'block'; }
      if (idEl) idEl.focus();
      return;
    }

    // 2) Validate CAPTCHA using the existing module
    const captcha = BeejCaptcha.validate();
    if (!captcha.valid) {
      BeejCaptcha.showError(captcha.message);
      return;
    }

    // 3) Move to OTP stage — an OTP is "sent" to the registered mobile.
    const registeredMobile = '9876543210';  // mock; would come from Samagra lookup
    this.state.memberOnboarding = {
      samagraId,
      stage: 'otp',
      otpMobile: registeredMobile,
      otpExpired: false,
      details: null,
      fetched: false
    };
    console.log('[DEMO OTP - MEMBER] OTP for +91 ' + registeredMobile + ': ' + this.MEMBER_OTP_CONFIG.DEMO_OTP);
    this.render();
    this.showToast('OTP sent to your registered mobile number.');
  },

  // Enable/disable Verify button based on 6-digit entry.
  onMoOtpInput() {
    const otpEl = document.getElementById('mo-otp');
    const btn = document.getElementById('mo-verify-btn');
    const errEl = document.getElementById('mo-otp-error');
    if (errEl) errEl.style.display = 'none';
    if (!otpEl || !btn) return;
    const ok = otpEl.value.length === 6;
    btn.disabled = !ok;
    btn.style.opacity = ok ? '1' : '0.6';
  },

  // Start/refresh the 30s resend countdown.
  _moResendTimer: null,
  startMemberOtpCountdown() {
    const mo = this.state.memberOnboarding;
    if (!mo) return;
    if (this._moResendTimer) { clearInterval(this._moResendTimer); this._moResendTimer = null; }
    mo.resendAt = Date.now() + this.MEMBER_OTP_CONFIG.RESEND_SECONDS * 1000;
    const link = document.getElementById('mo-resend-link');
    const timer = document.getElementById('mo-resend-timer');
    if (!link || !timer) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((mo.resendAt - Date.now()) / 1000));
      if (remaining > 0) {
        link.style.pointerEvents = 'none';
        link.style.color = '#BDBDBD';
        timer.style.color = '#9E9E9E';
        timer.textContent = ` in ${remaining}s`;
      } else {
        link.style.pointerEvents = 'auto';
        link.style.color = '#2E7D32';
        timer.textContent = '';
        if (this._moResendTimer) { clearInterval(this._moResendTimer); this._moResendTimer = null; }
      }
    };
    tick();
    this._moResendTimer = setInterval(tick, 1000);
  },

  resendMemberOtp() {
    const mo = this.state.memberOnboarding;
    if (!mo || (mo.resendAt && Date.now() < mo.resendAt)) return;
    mo.otpExpired = false;
    const errEl = document.getElementById('mo-otp-error');
    if (errEl) errEl.style.display = 'none';
    const otpEl = document.getElementById('mo-otp');
    if (otpEl) otpEl.value = '';
    this.onMoOtpInput();
    console.log('[DEMO OTP - MEMBER] Resent OTP: ' + this.MEMBER_OTP_CONFIG.DEMO_OTP);
    this.startMemberOtpCountdown();
    this.showToast('A new OTP has been sent.');
  },

  cancelMemberOtp() {
    if (this._moResendTimer) { clearInterval(this._moResendTimer); this._moResendTimer = null; }
    this.state.memberOnboarding = { samagraId: '', stage: 'idle', fetched: false, details: null };
    this.render();
  },

  // Verify OTP (mock), then fetch + display society/member details.
  verifyMemberOtp() {
    const mo = this.state.memberOnboarding;
    const otpEl = document.getElementById('mo-otp');
    const errEl = document.getElementById('mo-otp-error');
    const entered = otpEl ? otpEl.value.trim() : '';

    if (entered.length !== 6) {
      if (errEl) { errEl.textContent = 'Please enter the 6-digit OTP.'; errEl.style.display = 'block'; }
      return;
    }
    if (mo.otpExpired) {
      if (errEl) { errEl.textContent = 'OTP has expired. Please resend OTP.'; errEl.style.display = 'block'; }
      return;
    }
    if (entered !== this.MEMBER_OTP_CONFIG.DEMO_OTP) {
      if (errEl) { errEl.textContent = 'Invalid OTP. Please enter the correct OTP.'; errEl.style.display = 'block'; }
      return;
    }

    // Loading state on the Verify button
    const btn = document.getElementById('mo-verify-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; btn.innerHTML = '<span class="material-icons">hourglass_empty</span> Verifying...'; }
    if (this._moResendTimer) { clearInterval(this._moResendTimer); this._moResendTimer = null; }

    // Simulate verify + fetch latency, then reveal details.
    setTimeout(() => {
      const details = {
        name: 'Priya Sharma',
        samagraId: mo.samagraId,
        father: 'Ramesh Sharma',
        dob: '12/08/1990',
        gender: 'Female',
        mobile: mo.otpMobile || '9876543210',
        address: 'H.No. 12, Ward 4, Main Bazaar, Sehora',
        district: 'Chhindwara',
        block: 'Patan',
        village: 'Sehora',
        pincode: '480002',
        category: 'General',
        ekyc: 'Verified'
      };
      this.state.memberOnboarding = { samagraId: mo.samagraId, stage: 'verified', fetched: true, details };
      this.render();
      this.showToast('Mobile number verified successfully.');
    }, 600);
  },

  submitMemberOnboarding() {
    // Reset the onboarding flow state after submission
    if (this._moResendTimer) { clearInterval(this._moResendTimer); this._moResendTimer = null; }
    this.state.memberOnboarding = { samagraId: '', stage: 'idle', fetched: false, details: null };
    this.showToast('Member onboarding submitted successfully!');
    this.navigate('member-list');
  },

  saveMember(id) {
    const name = document.getElementById('m-name')?.value || '';
    const socName = document.getElementById('m-soc-name')?.value || '';
    const socId = document.getElementById('m-soc-id')?.value || '';
    const gender = document.getElementById('m-gender')?.value || '';
    const category = document.getElementById('m-category')?.value || '';
    const mobile = document.getElementById('m-mobile')?.value || '';
    const email = document.getElementById('m-email')?.value || '';
    const address = document.getElementById('m-address')?.value || '';
    const district = document.getElementById('m-district')?.value || '';
    const block = document.getElementById('m-block')?.value || '';
    const village = document.getElementById('m-village')?.value || '';
    const pincode = document.getElementById('m-pincode')?.value || '';
    const landArea = parseFloat(document.getElementById('m-land-area')?.value) || 0;
    const status = document.getElementById('m-status')?.value || 'Active';
    const joiningDate = document.getElementById('m-joining-date')?.value || '';

    if (!name.trim()) { alert('Please enter Member Name'); return; }
    if (!mobile.trim()) { alert('Please enter Mobile Number'); return; }
    if (!district) { alert('Please select District'); return; }

    this.state.members.push({
      id,
      societyName: socName,
      societyId: socId,
      name,
      gender,
      category,
      mobile,
      email,
      address,
      district,
      block,
      village,
      pincode,
      landArea,
      status,
      joiningDate,
      // Keep old fields for compatibility
      father: '-',
      aadhaar: 'XXXX-XXXX-XXXX',
      gp: block,
      state: 'MP',
      totalLand: landArea,
      irrigated: landArea * 0.6,
      nonIrrigated: landArea * 0.4
    });
    this.showToast('Member registered successfully!');
    this.navigate('member-list');
  },

  showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#2E7D32;color:#fff;padding:12px 20px;border-radius:8px;font-size:0.9rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  // ============================
  // SCREEN 4: SOCIETY MEMBER LIST
  // ============================
  renderMemberList() {
    return `
    <div class="page-header">
      <h1>Society Member List</h1>
      <p>Total ${this.state.members.length} registered members</p>
    </div>
    <div class="search-bar">
      <div class="search-field">
        <label>Village</label>
        <input type="text" class="form-control" placeholder="Search by village..."/>
      </div>
      <div class="search-field">
        <label>Member Name</label>
        <input type="text" class="form-control" placeholder="Search by name..."/>
      </div>
      <div class="search-field">
        <label>Mobile Number</label>
        <input type="text" class="form-control" placeholder="Search by mobile..."/>
      </div>
      <div class="search-field" style="align-self:flex-end;">
        <button class="btn btn-primary"><span class="material-icons">search</span> Search</button>
      </div>
      <div style="margin-left:auto;align-self:flex-end;">
        <button class="btn btn-primary" onclick="App.navigate('add-member')"><span class="material-icons">person_add</span> Society Member Onboarding</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Gender</th>
                <th>Category</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>District</th>
                <th>Block</th>
                <th>Village</th>
                <th>Pincode</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.state.members.map(m => `
              <tr>
                <td>${m.name}</td>
                <td>${m.gender || 'Male'}</td>
                <td><span class="badge badge-gray">${m.category}</span></td>
                <td>${m.mobile}</td>
                <td>${m.email || 'N/A'}</td>
                <td>${m.district}</td>
                <td>${m.block}</td>
                <td>${m.village}</td>
                <td>${m.pincode || 'N/A'}</td>
                <td><span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-danger'}">${m.status}</span></td>
                <td>${m.joiningDate || '2024-01-15'}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" title="View" onclick="App.openMemberView('${m.id}')"><span class="material-icons" style="font-size:16px;">visibility</span></button>
                    <button class="btn btn-warning btn-sm" title="Edit" onclick="App.openMemberEdit('${m.id}')"><span class="material-icons" style="font-size:16px;">edit</span></button>
                    <button class="btn btn-danger btn-sm" title="Delete" onclick="App.openMemberDelete('${m.id}')"><span class="material-icons" style="font-size:16px;">delete</span></button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${this.state.memberDeleteId ? this.renderMemberDeleteModal() : ''}
      </div>
      <div style="padding:12px 20px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.82rem;color:#666;">Showing ${this.state.members.length} of ${this.state.members.length} records</span>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-gray btn-sm">← Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-gray btn-sm">Next →</button>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // MEMBER — View / Edit / Delete
  // ============================
  openMemberView(id) { this.state.memberViewId = id; this.navigate('member-view'); },
  openMemberEdit(id) { this.state.memberEditId = id; this.navigate('member-edit'); },
  openMemberDelete(id) { this.state.memberDeleteId = id; this.render(); },
  closeMemberDelete() { this.state.memberDeleteId = null; this.render(); },

  confirmMemberDelete() {
    const m = this.state.members.find(x => x.id === this.state.memberDeleteId);
    if (m) {
      const idx = this.state.members.indexOf(m);
      if (idx >= 0) this.state.members.splice(idx, 1);
      this.showToast('Member "' + m.name + '" deleted.');
    }
    this.state.memberDeleteId = null;
    this.render();
  },

  // Member View page
  renderMemberView() {
    const m = this.state.members.find(x => x.id === this.state.memberViewId);
    if (!m) return this.renderMemberList();
    const row = (label, val) => `
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:0.88rem;">
        <span style="color:#757575;">${label}</span><span style="font-weight:600;color:#212121;">${val || '—'}</span>
      </div>`;
    return `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <button class="btn btn-gray btn-sm" onclick="App.navigate('member-list')"><span class="material-icons" style="font-size:16px;">arrow_back</span> Back to Member List</button>
      <button class="btn btn-warning btn-sm" onclick="App.openMemberEdit('${m.id}')"><span class="material-icons" style="font-size:16px;">edit</span> Edit</button>
    </div>
    <div class="page-header"><h1>Member Details</h1><p>${m.name}</p></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="card"><div class="card-header"><h3>Personal Information</h3></div><div class="card-body">
        ${row('Member Name', m.name)}
        ${row('Gender', m.gender)}
        ${row('Category', m.category)}
        ${row('Father / Husband Name', m.father)}
        ${row('Mobile', m.mobile)}
        ${row('Email', m.email)}
      </div></div>
      <div class="card"><div class="card-header"><h3>Address & Status</h3></div><div class="card-body">
        ${row('Address', m.address)}
        ${row('District', m.district)}
        ${row('Block', m.block)}
        ${row('Village', m.village)}
        ${row('Pincode', m.pincode)}
        ${row('Status', m.status)}
        ${row('Joining Date', m.joiningDate)}
      </div></div>
    </div>`;
  },

  // Member Edit page (pre-filled with existing details)
  renderMemberEdit() {
    const m = this.state.members.find(x => x.id === this.state.memberEditId);
    if (!m) return this.renderMemberList();
    const sel = (val, opt) => val === opt ? 'selected' : '';
    return `
    <div style="margin-bottom:16px;">
      <button class="btn btn-gray btn-sm" onclick="App.navigate('member-list')"><span class="material-icons" style="font-size:16px;">arrow_back</span> Back to Member List</button>
    </div>
    <div class="page-header"><h1>Edit Member</h1><p>Update details for ${m.name}</p></div>
    <div class="card"><div class="card-body">
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">person</span> Member Information</div>
        <div class="form-grid">
          <div class="form-group"><label>Member Name *</label><input class="form-control" id="me-name" value="${m.name || ''}"></div>
          <div class="form-group"><label>Gender</label><select class="form-control" id="me-gender">
            <option ${sel(m.gender, 'Male')}>Male</option><option ${sel(m.gender, 'Female')}>Female</option><option ${sel(m.gender, 'Other')}>Other</option>
          </select></div>
          <div class="form-group"><label>Category</label><select class="form-control" id="me-category">
            ${['General', 'OBC', 'SC', 'ST'].map(c => `<option ${sel(m.category, c)}>${c}</option>`).join('')}
          </select></div>
          <div class="form-group"><label>Mobile *</label><input class="form-control" id="me-mobile" value="${m.mobile || ''}"></div>
          <div class="form-group"><label>Email</label><input class="form-control" id="me-email" value="${m.email || ''}"></div>
          <div class="form-group"><label>Status</label><select class="form-control" id="me-status">
            <option ${sel(m.status, 'Active')}>Active</option><option ${sel(m.status, 'Inactive')}>Inactive</option>
          </select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">location_on</span> Address Details</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:1/-1;"><label>Address</label><input class="form-control" id="me-address" value="${m.address || ''}"></div>
          <div class="form-group"><label>District</label><input class="form-control" id="me-district" value="${m.district || ''}"></div>
          <div class="form-group"><label>Block</label><input class="form-control" id="me-block" value="${m.block || ''}"></div>
          <div class="form-group"><label>Village</label><input class="form-control" id="me-village" value="${m.village || ''}"></div>
          <div class="form-group"><label>Pincode</label><input class="form-control" id="me-pincode" value="${m.pincode || ''}"></div>
        </div>
      </div>
      <div class="form-actions" style="justify-content:flex-end;gap:10px;">
        <button class="btn btn-gray" onclick="App.navigate('member-list')"><span class="material-icons">close</span> Cancel</button>
        <button class="btn btn-primary" onclick="App.saveMemberEdit('${m.id}')"><span class="material-icons">save</span> Save Changes</button>
      </div>
    </div></div>`;
  },

  saveMemberEdit(id) {
    const m = this.state.members.find(x => x.id === id);
    if (!m) return;
    const g = fid => { const e = document.getElementById(fid); return e ? e.value.trim() : ''; };
    const name = g('me-name'), mobile = g('me-mobile');
    if (!name) { this.showToast('Member Name is required.'); return; }
    if (!mobile) { this.showToast('Mobile Number is required.'); return; }
    m.name = name; m.mobile = mobile;
    m.gender = g('me-gender'); m.category = g('me-category'); m.email = g('me-email'); m.status = g('me-status');
    m.address = g('me-address'); m.district = g('me-district'); m.block = g('me-block'); m.village = g('me-village'); m.pincode = g('me-pincode');
    this.showToast('Member "' + m.name + '" updated successfully.');
    this.navigate('member-list');
  },

  // Delete confirmation modal (not a browser alert)
  renderMemberDeleteModal() {
    const m = this.state.members.find(x => x.id === this.state.memberDeleteId);
    if (!m) return '';
    return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeMemberDelete()">
      <div class="modal-box" style="max-width:420px;">
        <div class="modal-header" style="background:linear-gradient(135deg,#C62828,#B71C1C);">
          <h3>Delete Member</h3>
          <button class="modal-close" onclick="App.closeMemberDelete()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <span class="material-icons" style="color:#C62828;font-size:32px;">warning</span>
            <div style="font-size:0.9rem;color:#333;">
              Are you sure you want to delete <b>${m.name}</b>?<br>
              <span style="color:#757575;font-size:0.82rem;">This action cannot be undone.</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeMemberDelete()">Cancel</button>
          <button class="btn btn-danger" onclick="App.confirmMemberDelete()"><span class="material-icons" style="font-size:16px;">delete</span> Delete</button>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 5: RAISE BREEDER SEED DEMAND
  // ============================
  renderRaiseDemand() {
    return `
    <div class="page-header">
      <h1>Raise Breeder Seed Demand</h1>
      <p>Submit seed demand for the current season</p>
    </div>
    <div class="card">
      <div class="card-body">
        <!-- SECTION 1: Society Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">business</span> Society Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Society Name *</label>
              <input type="text" class="form-control" value="Rampur Krishi Samiti" readonly style="background:#f5f5f5;"/>
            </div>
            <div class="form-group">
              <label>Society Code *</label>
              <input type="text" class="form-control" value="SOC-001" readonly style="background:#f5f5f5;"/>
            </div>
            <div class="form-group">
              <label>District *</label>
              <input type="text" class="form-control" value="Chhindwara" readonly style="background:#f5f5f5;"/>
            </div>
            <div class="form-group">
              <label>Block *</label>
              <input type="text" class="form-control" value="Patan" readonly style="background:#f5f5f5;"/>
            </div>
          </div>
        </div>

        <!-- SECTION 2: Demand Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">event</span> Demand Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Procurement Year *</label>
              <select class="form-control" id="d-proc-year">
                <option value="">Select Year</option>
                <option>2023-24</option>
                <option selected>2024-25</option>
                <option>2025-26</option>
              </select>
            </div>
            <div class="form-group">
              <label>Demand Date *</label>
              <input type="date" class="form-control" id="d-demand-date" value="${new Date().toISOString().split('T')[0]}"/>
            </div>
            <div class="form-group">
              <label>Season *</label>
              <select class="form-control" id="d-season">
                <option value="">Select Season</option>
                <option>Kharif</option>
                <option selected>Rabi</option>
                <option>Summer</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECTION 3: Crop Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">agriculture</span> Crop Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Crop *</label>
              <select class="form-control" id="d-crop" onchange="App.updateVarieties(this.value)">
                <option value="">Select Crop</option>
                <option>Wheat</option>
                <option>Paddy (Rice)</option>
                <option>Maize</option>
                <option>Bajra (Pearl Millet)</option>
                <option>Jowar (Sorghum)</option>
                <option>Gram (Chickpea)</option>
                <option>Pigeon Pea (Arhar)</option>
                <option>Soybean</option>
                <option>Groundnut</option>
                <option>Mustard</option>
                <option>Sunflower</option>
                <option>Cotton</option>
                <option>Sugarcane</option>
                <option>Moong (Green Gram)</option>
                <option>Urad (Black Gram)</option>
                <option>Lentil (Masoor)</option>
                <option>Barley</option>
                <option>Oat</option>
              </select>
            </div>
            <div class="form-group">
              <label>Crop Variety *</label>
              <select class="form-control" id="d-variety">
                <option value="">Select Crop First</option>
              </select>
            </div>
            <div class="form-group">
              <label>Seed Class *</label>
              <select class="form-control" id="d-seed-class">
                <option value="">Select Seed Class</option>
                <option>Breeder Seed</option>
                <option>Foundation Seed</option>
                <option>Certified Seed</option>
              </select>
            </div>
            <div class="form-group">
              <label>Available Stock</label>
              <input type="text" class="form-control" id="d-avail-stock" placeholder="Check stock" readonly style="background:#f5f5f5;"/>
            </div>
          </div>
        </div>

        <!-- SECTION 4: Quantity & Delivery Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">calculate</span> Quantity & Delivery Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Unit *</label>
              <select class="form-control" id="d-unit">
                <option value="">Select Unit</option>
                <option selected>Quintal</option>
                <option>Kilogram</option>
                <option>Metric Ton</option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantity Demanded (in Quintals or Kilograms) *</label>
              <input type="number" class="form-control" id="d-qty" placeholder="Enter quantity" min="1" oninput="App.calculateEstPrice(this.value)"/>
            </div>
            <div class="form-group">
              <label>Estimated Price (₹)</label>
              <input type="number" class="form-control" id="d-est-price" placeholder="Auto-calculated" readonly style="background:#f5f5f5;"/>
            </div>
            <div class="form-group">
              <label>Expected Date of Delivery *</label>
              <input type="date" class="form-control" id="d-expected-delivery" value="${new Date().toISOString().slice(0, 10)}"/>
            </div>
          </div>
        </div>

        <!-- SECTION 5: Demand Approval Letter -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">attach_file</span> Demand Approval Letter</div>
          <div class="form-group">
            <label>Upload Demand Approval Letter *</label>
            <input type="file" class="form-control" id="d-approval-letter"
              accept=".pdf,.jpg,.jpeg,.png" style="padding:10px;"/>
            <span style="font-size:0.75rem;color:#757575;margin-top:4px;display:block;">
              Upload the demand approval letter issued/approved by the competent authority - PDF, JPG up to 5MB
            </span>
          </div>
        </div>

        <!-- SECTION 6: Demand Status -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">flag</span> Demand Status</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Status * Draft</label>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button class="btn btn-gray" onclick="App.navigate('demand-history')">
            <span class="material-icons">arrow_back</span> Cancel
          </button>
          <button class="btn btn-outline" onclick="App.saveDemandDraft()">
            <span class="material-icons">save</span> Save Draft
          </button>
          <button class="btn btn-primary" onclick="App.previewDemand()">
            <span class="material-icons">preview</span> Preview & Submit
          </button>
        </div>
      </div>
    </div>`;
  },

  updateVarieties(crop) {
    const varieties = {
      'Wheat': ['GW-322', 'GW-496', 'HD-2967', 'K-307', 'HD-2733', 'HD-3086', 'PBW-343', 'DBW-17'],
      'Paddy (Rice)': ['IR-36', 'MTU-7029', 'Pusa Basmati-1121', 'Pusa-44', 'Swarna', 'IR-64', 'Samba Mahsuri'],
      'Maize': ['DHM-117', 'Vivek Hybrid-27', 'HQPM-1', 'Pro-311', 'Kaveri-50', 'DHM-121'],
      'Bajra (Pearl Millet)': ['HHB-67', 'HHB-197', 'Proagro-9444', 'RHB-177', 'GHB-558'],
      'Jowar (Sorghum)': ['CSH-16', 'CSV-15', 'M-35-1', 'SPV-462', 'Pusa Chari-6'],
      'Gram (Chickpea)': ['JG-315', 'JG-14', 'JAKI-9218', 'JG-16', 'BG-372', 'GNG-1581'],
      'Pigeon Pea (Arhar)': ['UPAS-120', 'Pusa-992', 'Asha (ICPL-87)', 'Narendra Arhar-1', 'BDN-711'],
      'Soybean': ['JS-335', 'NRC-37', 'JS-9560', 'JS-95-60', 'MACS-1407', 'PS-1092'],
      'Groundnut': ['TAG-24', 'TG-37A', 'Girnar-2', 'GG-20', 'ICGS-76'],
      'Mustard': ['Pusa Bold', 'RH-30', 'Varuna', 'Pusa Mustard-27', 'Kranti'],
      'Sunflower': ['KBSH-1', 'MSFH-17', 'PSH-569', 'CO-4', 'Phule Bhaskar'],
      'Cotton': ['Suraj (H-777)', 'H-1098', 'Bunny Bt', 'Ajeet-155', 'RCH-2'],
      'Sugarcane': ['CO-86032', 'CO-0238', 'CoJ-64', 'Co-98014', 'CO-0118'],
      'Moong (Green Gram)': ['K-851', 'IPM-2-3', 'HUM-1', 'Pusa-105', 'ML-613'],
      'Urad (Black Gram)': ['T-9', 'PU-31', 'Pant-U-19', 'IPU-94-1', 'Pusa-1003'],
      'Lentil (Masoor)': ['L-4076', 'PL-406', 'IPL-81', 'JL-3', 'Pusa-4'],
      'Barley': ['RD-2035', 'BH-393', 'K-603', 'PL-426', 'Jyoti'],
      'Oat': ['OS-6', 'Kent', 'UPO-94', 'Sabzar', 'HFO-114'],
    };
    const sel = document.getElementById('d-variety');
    if (!sel) return;
    const list = varieties[crop] || [];
    sel.innerHTML = list.length
      ? list.map((v, i) => `<option ${i === 0 ? 'selected' : ''}>${v}</option>`).join('')
      : '<option>Select Crop First</option>';

    // Update available stock based on crop and variety
    const stockEl = document.getElementById('d-avail-stock');
    if (stockEl && list.length > 0) {
      const mockStock = Math.floor(Math.random() * 500) + 100;
      stockEl.value = mockStock + ' Qt';
    }
  },

  calculateEstPrice(qty) {
    const priceEl = document.getElementById('d-est-price');
    if (!priceEl || !qty) return;
    // Mock price calculation: ₹5000 per quintal
    const pricePerQt = 5000;
    const totalPrice = parseFloat(qty) * pricePerQt;
    priceEl.value = totalPrice.toFixed(2);
  },

  saveDemandDraft() {
    alert('Demand saved as draft!');
    App.navigate('demand-history');
  },

  validateStock(qty) {
    const alertEl = document.getElementById('stock-alert');
    if (!alertEl) return;
    const available = 850;
    if (qty > available) {
      alertEl.className = 'alert alert-danger';
      alertEl.innerHTML = `<span class="material-icons">error</span> <div>Requested quantity <b>${qty} Qt</b> exceeds available stock of <b>${available} Qt</b>. Please enter minimum allowed quantity.</div>`;
    } else if (qty > 0) {
      alertEl.className = 'alert alert-success';
      alertEl.innerHTML = `<span class="material-icons">check_circle</span> <div>Quantity available! You can proceed to preview.</div>`;
    } else {
      alertEl.className = 'hidden';
    }
  },

  previewDemand() {
    const qty = parseInt(document.getElementById('d-qty')?.value) || 200;
    const crop = document.getElementById('d-crop')?.value || 'Wheat';
    const variety = document.getElementById('d-variety')?.value || 'GW-322';
    const season = document.getElementById('d-season')?.value || 'Rabi';
    this.state.currentDemand = { season, crop, variety, qty, cost: qty * 2400, advance: qty * 2400 * 0.25 };
    this.navigate('demand-preview');
  },

  // ============================
  // SCREEN 6: DEMAND PREVIEW
  // ============================
  renderDemandPreview() {
    const d = this.state.currentDemand || { season: 'Rabi', crop: 'Wheat', variety: 'GW-322', qty: 200, cost: 480000, advance: 120000 };
    return `
    <div class="page-header">
      <h1>Demand Preview</h1>
      <p>Review your demand before generating invoice</p>
    </div>
    <div style="max-width:700px;margin:0 auto;">
      <div class="preview-card">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:48px;height:48px;background:#4CAF50;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;">🌾</div>
          <div><h3 style="font-size:1.1rem;font-weight:700;color:#2E7D32;">Demand Application Summary</h3><p style="font-size:0.82rem;color:#666;">Rampur Krishi Samiti (SOC-001)</p></div>
          <div style="margin-left:auto;"><span class="badge badge-warning">Draft</span></div>
        </div>
        <div class="preview-grid">
          <div class="preview-item"><label>Season</label><span>${d.season} 2024-25</span></div>
          <div class="preview-item"><label>Crop</label><span>${d.crop}</span></div>
          <div class="preview-item"><label>Variety</label><span>${d.variety}</span></div>
          <div class="preview-item"><label>Requested Quantity</label><span>${d.qty} Quintal</span></div>
          <div class="preview-item"><label>Available Stock</label><span style="color:#2E7D32;">850 Qt ✓</span></div>
          <div class="preview-item"><label>Rate per Quintal</label><span>₹2,400/-</span></div>
          <div class="preview-item"><label>Total Members</label><span>65</span></div>
          <div class="preview-item"><label>Total Land Area</label><span>185.4 Ha</span></div>
        </div>
        <div class="preview-total">
          <div><div class="label">Estimated Total Cost</div><div class="value">₹${d.cost.toLocaleString()}</div></div>
          <div><div class="label">Advance Payment Required (25%)</div><div class="value" style="color:#FFD54F;">₹${d.advance.toLocaleString()}</div></div>
        </div>
      </div>
      <div class="alert alert-info">
        <span class="material-icons">info</span>
        <div>By submitting this demand, you agree to pay the advance amount of <b>₹${d.advance.toLocaleString()}</b> within 7 working days. Remaining payment to be made on delivery.</div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-gray" onclick="App.navigate('raise-demand')"><span class="material-icons">arrow_back</span> Back</button>
        <button class="btn btn-primary btn-lg" onclick="App.navigate('payment')"><span class="material-icons">receipt</span> Generate Invoice & Pay</button>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 7: PAYMENT
  // ============================
  renderPayment() {
    const d = this.state.currentDemand || { season: 'Rabi', crop: 'Wheat', variety: 'GW-322', qty: 200, cost: 480000, advance: 120000 };
    const pm = this.state.paymentMode;
    return `
    <div class="page-header">
      <h1>Payment</h1>
      <p>Pay advance amount to confirm your demand</p>
    </div>
    <div class="payment-wrap">
      <div class="invoice-box">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">🌾 INVOICE</div>
            <div class="invoice-no">Invoice #INV-2024-0089</div>
            <div class="invoice-no">Demand #DEM-2024-006</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.78rem;color:#666;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
            <div style="font-size:0.78rem;color:#666;">Season: ${d.season} 2024-25</div>
          </div>
        </div>
        <div class="invoice-row"><span class="label">Society</span><span class="value">Rampur Krishi Samiti</span></div>
        <div class="invoice-row"><span class="label">Crop / Variety</span><span class="value">${d.crop} / ${d.variety}</span></div>
        <div class="invoice-row"><span class="label">Quantity</span><span class="value">${d.qty} Quintal</span></div>
        <div class="invoice-row"><span class="label">Rate</span><span class="value">₹2,400 per Qt</span></div>
        <div class="invoice-row"><span class="label">Total Amount</span><span class="value">₹${d.cost.toLocaleString()}</span></div>
        <div class="invoice-row"><span class="label">Balance (75% on delivery)</span><span class="value">₹${(d.cost - d.advance).toLocaleString()}</span></div>
        <div class="invoice-total-row">
          <span class="label">Advance Payment (25%) Due Now</span>
          <span class="value">₹${d.advance.toLocaleString()}</span>
        </div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="card-header"><h3>Select Payment Mode</h3></div>
        <div class="card-body">
          <div class="payment-modes">
            <div class="payment-mode-btn ${pm === 'upi' ? 'selected' : ''}" onclick="App.selectPayMode('upi')">
              <span class="material-icons">qr_code_2</span><p>UPI Payment</p>
            </div>
            <div class="payment-mode-btn ${pm === 'netbanking' ? 'selected' : ''}" onclick="App.selectPayMode('netbanking')">
              <span class="material-icons">account_balance</span><p>Net Banking</p>
            </div>
            <div class="payment-mode-btn ${pm === 'card' ? 'selected' : ''}" onclick="App.selectPayMode('card')">
              <span class="material-icons">credit_card</span><p>Debit Card</p>
            </div>
            <div class="payment-mode-btn ${pm === 'challan' ? 'selected' : ''}" onclick="App.selectPayMode('challan')">
              <span class="material-icons">receipt</span><p>Bank Challan</p>
            </div>
          </div>
          ${pm === 'upi' ? `
          <div class="form-group">
            <label>Enter UPI ID</label>
            <input type="text" class="form-control" placeholder="yourname@upi" value="ramesh@okaxis"/>
          </div>` : pm === 'netbanking' ? `
          <div class="form-group">
            <label>Select Bank</label>
            <select class="form-control"><option>State Bank of India</option><option>Punjab National Bank</option><option>Bank of Baroda</option></select>
          </div>` : ''}
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">
            <button class="btn btn-gray" onclick="App.navigate('demand-preview')"><span class="material-icons">arrow_back</span> Back</button>
            <button class="btn btn-primary btn-lg" onclick="App.processPayment()" style="flex:1;">
              <span class="material-icons">payment</span> Pay ₹${d.advance.toLocaleString()} Now
            </button>
          </div>
        </div>
      </div>
    </div>`;
  },

  selectPayMode(mode) {
    this.state.paymentMode = mode;
    this.render();
  },

  processPayment() {
    if (!this.state.paymentMode) { this.showToast('Please select a payment mode'); return; }
    const d = this.state.currentDemand || { season: 'Rabi', crop: 'Wheat', variety: 'GW-322', qty: 200 };
    this.state.demands.unshift({
      id: `DEM-2024-00${this.state.demands.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      season: d.season, crop: d.crop, variety: d.variety, qty: d.qty,
      payStatus: 'Paid', approvalStatus: 'Under Review'
    });
    this.showPaymentSuccess();
  },

  showPaymentSuccess() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div style="min-height:100vh;background:#f1f8e9;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div style="background:#fff;border-radius:16px;padding:48px;text-align:center;max-width:480px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="width:80px;height:80px;background:#E8F5E9;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:40px;">✅</div>
        <h2 style="color:#2E7D32;font-size:1.5rem;margin-bottom:8px;">Payment Successful!</h2>
        <p style="color:#666;margin-bottom:20px;">Your demand has been submitted successfully. Admin will review and approve shortly.</p>
        <div style="background:#F1F8E9;border-radius:8px;padding:16px;margin-bottom:24px;text-align:left;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#666;font-size:0.85rem;">Transaction ID</span><span style="font-weight:600;font-size:0.85rem;">TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#666;font-size:0.85rem;">Payment Status</span><span class="badge badge-success">✓ Paid</span></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="btn btn-outline" onclick="App.showToast('Receipt downloaded!')"><span class="material-icons">download</span> Download Receipt</button>
          <button class="btn btn-primary" onclick="App.navigate('demand-history')"><span class="material-icons">history</span> View Demands</button>
        </div>
      </div>
    </div>`;
    this.bindEvents();
  },

  // ============================
  // SCREEN 8: BREEDER SEED DEMAND HISTORY
  // ============================
  renderDemandHistory() {
    return `
    <div class="page-header">
      <h1>Breeder Seed Demand History</h1>
      <p>All demands raised by your society</p>
    </div>
    <div class="search-bar">
      <div class="search-field">
        <label>Season</label>
        <select class="form-control"><option>All Seasons</option><option>Kharif</option><option>Rabi</option><option>Summer</option></select>
      </div>
      <div class="search-field">
        <label>Crop</label>
        <select class="form-control"><option>All Crops</option><option>Wheat</option><option>Soybean</option><option>Gram</option></select>
      </div>
      <div class="search-field">
        <label>From Date</label>
        <input type="date" class="form-control" value="2024-01-01"/>
      </div>
      <div class="search-field">
        <label>To Date</label>
        <input type="date" class="form-control" value="2024-12-31"/>
      </div>
      <div class="search-field" style="align-self:flex-end;">
        <button class="btn btn-primary"><span class="material-icons">filter_alt</span> Filter</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Crop</th><th>Date</th><th>Season</th><th>Variety</th><th>Requested</th><th>Approved</th><th>Pending</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${this.state.demands.map(d => {
      const adm = this.state.adminDemands.find(x => x.id === d.id);
      const approved = adm ? adm.approvedQty : (d.approvalStatus === 'Approved' ? d.qty : 0);
      const pending = adm ? adm.pendingQty : (d.approvalStatus === 'Approved' ? 0 : d.qty);
      const status = adm ? adm.approvalStatus : d.approvalStatus;
      const badgeCls = s => s === 'Approved' ? 'badge-success' : s === 'Partially Approved' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : s === 'Rejected' ? 'badge-danger' : 'badge-purple';
      return `<tr>
                <td>${d.crop}</td>
                <td>${d.date}</td>
                <td>${d.season}</td>
                <td>${d.variety}</td>
                <td style="font-weight:600;">${d.qty} Qt</td>
                <td style="color:#2E7D32;font-weight:600;">${approved > 0 ? approved + ' Qt' : '—'}</td>
                <td style="color:${pending > 0 ? '#E65100' : '#9E9E9E'};font-weight:600;">${pending > 0 ? pending + ' Qt' : '—'}</td>
                <td><span class="badge ${d.payStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${d.payStatus}</span></td>
                <td><span class="badge ${badgeCls(status)}">${status}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" title="View" onclick="App.viewDemandHistory('${d.id}')"><span class="material-icons" style="font-size:16px;">visibility</span></button>
                    <button class="btn btn-gray btn-sm" title="Download" onclick="App.downloadDemandHistory('${d.id}')"><span class="material-icons" style="font-size:16px;">download</span></button>
                  </div>
                </td>
              </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ${this.state.demandHistoryViewId ? this.renderDemandHistoryModal() : ''}`;
  },

  // ── Demand History actions ──
  viewDemandHistory(id) { this.state.demandHistoryViewId = id; this.render(); },
  closeDemandHistoryView() { this.state.demandHistoryViewId = null; this.render(); },
  downloadDemandHistory(id) {
    this.showToast('Demand ' + id + ' details downloaded.');
  },

  renderDemandHistoryModal() {
    const d = this.state.demands.find(x => x.id === this.state.demandHistoryViewId);
    if (!d) return '';
    const adm = this.state.adminDemands.find(x => x.id === d.id);
    const approved = adm ? adm.approvedQty : (d.approvalStatus === 'Approved' ? d.qty : 0);
    const pending = adm ? adm.pendingQty : (d.approvalStatus === 'Approved' ? 0 : d.qty);
    const status = adm ? adm.approvalStatus : d.approvalStatus;
    const remarks = adm && adm.remarks ? adm.remarks : '—';
    const row = (label, val) => `
      <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:0.88rem;">
        <span style="color:#757575;">${label}</span><span style="font-weight:600;color:#212121;">${val || '—'}</span>
      </div>`;
    return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeDemandHistoryView()">
      <div class="modal-box" style="max-width:480px;">
        <div class="modal-header">
          <h3>Demand Details — ${d.id}</h3>
          <button class="modal-close" onclick="App.closeDemandHistoryView()">✕</button>
        </div>
        <div class="modal-body">
          ${row('Demand ID', d.id)}
          ${row('Date', d.date)}
          ${row('Season', d.season)}
          ${row('Crop', d.crop)}
          ${row('Variety', d.variety)}
          ${row('Requested Qty', d.qty + ' Qt')}
          ${row('Approved Qty', approved > 0 ? approved + ' Qt' : '—')}
          ${row('Pending Qty', pending > 0 ? pending + ' Qt' : '—')}
          ${row('Payment Status', d.payStatus)}
          ${row('Approval Status', status)}
          ${row('Remarks', remarks)}
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeDemandHistoryView()">Close</button>
          <button class="btn btn-primary" onclick="App.downloadDemandHistory('${d.id}')"><span class="material-icons" style="font-size:16px;">download</span> Download</button>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN: SEED ALLOCATION (Society)
  // ============================
  renderSeedAllocation() {
    return `
    <div class="page-header"><h1>Seed Allocation</h1><p>Distribute approved seeds to members</p></div>
    <div class="alert alert-success">
      <span class="material-icons">check_circle</span>
      <div>Your society has received <b>120 Quintal</b> of Soybean (JS-335) from Beej Sangh. Please distribute to members.</div>
    </div>
    ${this.renderDistributionRegister()}`;
  },

  // ============================
  // SCREEN 14: DISTRIBUTION REGISTER
  // ============================
  renderDistributionRegister() {
    return `
    <div class="page-header"><h1>Distribution Register</h1><p>Member-wise seed distribution record</p></div>
    <div class="card">
      <div class="card-header">
        <h3>Soybean JS-335 Distribution — Kharif 2024</h3>
        <div style="display:flex;gap:8px;">
          <span class="badge badge-info">Approved: 120 Qt</span>
          <span class="badge badge-warning">Distributed: 2.5 Qt</span>
          <span class="badge badge-danger">Pending: 117.5 Qt</span>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member Name</th><th>Crop</th><th>Variety</th><th>Approved Qty</th><th>Distributed Qty</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${this.state.memberDistributions.map(m => `
              <tr>
                <td>${m.member}</td>
                <td>${m.crop}</td>
                <td>${m.variety}</td>
                <td>${m.approved} Qt</td>
                <td>${m.distributed} Qt</td>
                <td><span class="badge ${m.status === 'Done' ? 'badge-success' : 'badge-warning'}">${m.status}</span></td>
                <td>
                  <div class="action-btns">
                    ${m.status !== 'Done' ? `<button class="btn btn-primary btn-sm" onclick="App.distribute('${m.member}')"><span class="material-icons" style="font-size:14px;">agriculture</span> Distribute</button>` : ''}
                    <button class="btn btn-gray btn-sm"><span class="material-icons" style="font-size:14px;">print</span> Receipt</button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  distribute(memberName) {
    const m = this.state.memberDistributions.find(x => x.member === memberName);
    if (m) { m.distributed = m.approved; m.status = 'Done'; }
    this.showToast(`Seeds distributed to ${memberName}`);
    this.render();
  },

  // ============================
  // SCREEN: PAYMENT HISTORY
  // ============================
  renderPaymentHistory() {
    const payments = [
      { txn: 'TXN-2024-001', date: '2024-06-15', demandId: 'DEM-2024-001', amount: '₹28,800', type: 'Advance (25%)', status: 'Success' },
      { txn: 'TXN-2024-002', date: '2024-10-10', demandId: 'DEM-2024-002', amount: '₹48,000', type: 'Advance (25%)', status: 'Pending' },
      { txn: 'TXN-2024-003', date: '2024-11-05', demandId: 'DEM-2024-003', amount: '₹19,200', type: 'Advance (25%)', status: 'Success' },
    ];
    return `
    <div class="page-header"><h1>Payment History</h1><p>All payment transactions</p></div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Transaction ID</th><th>Date</th><th>Demand ID</th><th>Amount</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${payments.map(p => `<tr>
                <td><b>${p.txn}</b></td><td>${p.date}</td><td>${p.demandId}</td>
                <td style="font-weight:600;">${p.amount}</td><td>${p.type}</td>
                <td><span class="badge ${p.status === 'Success' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
                <td><button class="btn btn-gray btn-sm"><span class="material-icons" style="font-size:14px;">download</span></button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 15: SOCIETY REPORTS
  // ============================
  renderSocietyReports() {
    return `
    <div class="page-header"><h1>Society Reports</h1><p>Analytics and downloadable reports</p></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
      ${[
        { icon: 'group', title: 'Member Report', desc: 'Complete member list with land details', color: '#4CAF50' },
        { icon: 'shopping_cart', title: 'Demand Report', desc: 'All demands with status and quantity', color: '#2196F3' },
        { icon: 'agriculture', title: 'Distribution Report', desc: 'Member-wise distribution summary', color: '#FF9800' },
        { icon: 'payment', title: 'Payment Report', desc: 'Transaction history and receipts', color: '#9C27B0' },
      ].map(r => `
      <div class="card" style="border-left:4px solid ${r.color};cursor:pointer;transition:transform 0.2s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
        <div class="card-body" style="display:flex;align-items:center;gap:16px;">
          <div style="width:52px;height:52px;border-radius:12px;background:${r.color}22;display:flex;align-items:center;justify-content:center;">
            <span class="material-icons" style="color:${r.color};font-size:28px;">${r.icon}</span>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:0.95rem;font-weight:600;">${r.title}</h4>
            <p style="font-size:0.8rem;color:#757575;">${r.desc}</p>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-danger btn-sm" onclick="App.showToast('PDF downloaded!')"><span class="material-icons" style="font-size:14px;">picture_as_pdf</span> PDF</button>
            <button class="btn btn-success btn-sm" onclick="App.showToast('Excel downloaded!')"><span class="material-icons" style="font-size:14px;">grid_on</span> Excel</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><h3>Demand by Crop — Current Season</h3></div>
      <div class="card-body">
        ${[{ label: 'Wheat', pct: 65, val: '200 Qt' }, { label: 'Soybean', pct: 45, val: '120 Qt' }, { label: 'Gram', pct: 30, val: '80 Qt' }, { label: 'Mustard', pct: 20, val: '60 Qt' }].map(c => `
        <div class="chart-bar-group" style="margin-bottom:12px;">
          <span class="chart-label">${c.label}</span>
          <div class="chart-bar-bg"><div class="chart-bar" style="width:${c.pct}%"></div></div>
          <span class="chart-val">${c.val}</span>
        </div>`).join('')}
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 9: ADMIN DASHBOARD
  // ============================
  renderAdminDashboard() {
    return `
    <div class="page-header">
      <h1>Admin Dashboard</h1>
      <p>Beej Sangh Procurement Management — Rabi Season 2024-25</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">business</span></div>
        <div class="stat-info"><div class="value">24</div><div class="label">Total Societies</div><div class="change">↑ 2 this season</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">group</span></div>
        <div class="stat-info"><div class="value">1,842</div><div class="label">Total Members</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">receipt_long</span></div>
        <div class="stat-info"><div class="value">38</div><div class="label">Total Demands</div></div>
      </div>
      <div class="stat-card red">
        <div class="stat-icon"><span class="material-icons">pending_actions</span></div>
        <div class="stat-info"><div class="value">12</div><div class="label">Pending Demands</div></div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">inventory_2</span></div>
        <div class="stat-info"><div class="value">2,150 Qt</div><div class="label">Available Stock</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">local_shipping</span></div>
        <div class="stat-info"><div class="value">420 Qt</div><div class="label">Distributed Stock</div></div>
      </div>
    </div>
    <!-- NEW: Admin stock allocation cards -->
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">inventory_2</span></div>
        <div class="stat-info"><div class="value">2,150 Qt</div><div class="label">Total Stock</div></div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon"><span class="material-icons">assignment_turned_in</span></div>
        <div class="stat-info"><div class="value">540 Qt</div><div class="label">Allocated Stock</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">local_shipping</span></div>
        <div class="stat-info"><div class="value">120 Qt</div><div class="label">Dispatched Stock</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">account_balance_wallet</span></div>
        <div class="stat-info"><div class="value">1,490 Qt</div><div class="label">Balance Stock</div></div>
      </div>
    </div>
      <div class="card">
        <div class="card-header"><h3>Demand by Crop</h3></div>
        <div class="card-body">
          ${[{ label: 'Wheat', pct: 78, val: '850 Qt' }, { label: 'Soybean', pct: 55, val: '600 Qt' }, { label: 'Gram', pct: 37, val: '400 Qt' }, { label: 'Mustard', pct: 27, val: '300 Qt' }, { label: 'Moong', pct: 15, val: '160 Qt' }].map(c => `
          <div class="chart-bar-group" style="margin-bottom:10px;">
            <span class="chart-label">${c.label}</span>
            <div class="chart-bar-bg"><div class="chart-bar" style="width:${c.pct}%"></div></div>
            <span class="chart-val">${c.val}</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Distribution Status</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">
              <span>Stock Allocated</span><span style="font-weight:600;">790/2150 Qt (37%)</span>
            </div>
            <div style="background:#E8F5E9;border-radius:4px;height:12px;overflow:hidden;"><div style="width:37%;height:100%;background:#4CAF50;border-radius:4px;"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">
              <span>Dispatched to Societies</span><span style="font-weight:600;">420/790 Qt (53%)</span>
            </div>
            <div style="background:#E3F2FD;border-radius:4px;height:12px;overflow:hidden;"><div style="width:53%;height:100%;background:#2196F3;border-radius:4px;"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">
              <span>Demands Approved</span><span style="font-weight:600;">26/38 (68%)</span>
            </div>
            <div style="background:#FFF3E0;border-radius:4px;height:12px;overflow:hidden;"><div style="width:68%;height:100%;background:#FF9800;border-radius:4px;"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:20px;">
      <div class="card-header"><h3>Recent Demands Pending Review</h3>
        <button class="btn btn-primary btn-sm" onclick="App.navigate('admin-demands')">View All</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Demand ID</th><th>Society</th><th>Crop</th><th>Qty</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${this.state.adminDemands.map(d => `<tr>
                <td><b>${d.id}</b></td><td>${d.society}</td><td>${d.crop}</td>
                <td>${d.qty} Qt</td>
                <td><span class="badge ${d.payStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${d.payStatus}</span></td>
                <td><span class="badge ${d.approvalStatus === 'Approved' ? 'badge-success' : d.approvalStatus === 'Pending' ? 'badge-warning' : 'badge-purple'}">${d.approvalStatus}</span></td>
                <td><button class="btn btn-info btn-sm" onclick="App.navigate('demand-review')">Review</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 10: ADMIN SOCIETIES
  // ============================
  renderAdminSocieties() {
    return `
    <div class="page-header"><h1>Society Management</h1><p>Manage all registered societies</p></div>
    <div class="search-bar">
      <div class="search-field">
        <label>Society Name / Code</label>
        <input type="text" class="form-control" placeholder="Search societies..."/>
      </div>
      <div class="search-field">
        <label>District</label>
        <select class="form-control"><option>All Districts</option><option>Chhindwara</option><option>Seoni</option><option>Narsinghpur</option></select>
      </div>
      <div class="search-field">
        <label>Status</label>
        <select class="form-control"><option>All</option><option>Active</option><option>Inactive</option></select>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Society Code</th><th>Society Name</th><th>District</th><th>Members</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${this.state.societies.map(s => `<tr>
                <td><b>${s.code}</b></td>
                <td>${s.name}</td>
                <td>${s.district}</td>
                <td>${s.members} <span style="font-size:0.75rem;color:#666;">${s.members >= 50 ? '✓' : '⚠ <50'}</span></td>
                <td><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn ${s.status === 'Active' ? 'btn-danger' : 'btn-success'} btn-sm" onclick="App.toggleSociety('${s.code}')">
                      ${s.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  toggleSociety(code) {
    const s = this.state.societies.find(x => x.code === code);
    if (s) s.status = s.status === 'Active' ? 'Inactive' : 'Active';
    this.showToast(`Society ${code} status updated`);
    this.render();
  },

  // ============================
  // SCREEN: ADMIN DEMANDS LIST
  // ============================
  // SCREEN: ADMIN DEMANDS LIST — with full approval workflow
  // ============================
  renderAdminDemands() {
    const d = this.state.adminDemands;
    const counts = {
      all: d.length,
      pending: d.filter(x => x.approvalStatus === 'Pending').length,
      approved: d.filter(x => x.approvalStatus === 'Approved').length,
      partial: d.filter(x => x.approvalStatus === 'Partially Approved').length,
      rejected: d.filter(x => x.approvalStatus === 'Rejected').length,
      hold: d.filter(x => x.approvalStatus === 'Hold').length,
    };
    const badgeCls = s => s === 'Approved' ? 'badge-success' : s === 'Partially Approved' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : s === 'Rejected' ? 'badge-danger' : 'badge-purple';
    return `
    <!-- Demand Table -->
    <div class="card">
      <div class="card-header">
        <h3>All Society Demands</h3>
        <div style="display:flex;gap:8px;">
          <select class="form-control" style="padding:6px 10px;font-size:0.82rem;width:160px;" onchange="App.filterAdminDemands(this.value)">
            <option value="">All Status</option>
            <option>Pending</option><option>Approved</option>
            <option>Partially Approved</option><option>Rejected</option><option>Hold</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="admin-demand-table">
            <thead>
              <tr>
                <th>Demand ID</th><th>Society</th><th>Crop / Variety</th>
                <th>Requested</th><th>Approved</th><th>Pending</th>
                <th>Payment</th><th>Approval</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${d.map(dem => {
      const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
      const avail = stk ? (stk.available - stk.allocated) : 0;
      return `<tr>
                  <td><b>${dem.id}</b><div style="font-size:0.7rem;color:#9E9E9E;">${dem.date}</div></td>
                  <td><div style="font-weight:500;font-size:0.85rem;">${dem.society}</div>
                      <div style="font-size:0.72rem;color:#9E9E9E;">${dem.socCode} | ${dem.season}</div></td>
                  <td>${dem.crop}<div style="font-size:0.72rem;color:#9E9E9E;">${dem.variety}</div></td>
                  <td style="font-weight:600;">${dem.requestedQty} Qt</td>
                  <td style="color:#2E7D32;font-weight:600;">${dem.approvedQty > 0 ? dem.approvedQty + ' Qt' : '—'}</td>
                  <td style="color:${dem.pendingQty > 0 ? '#E65100' : '#9E9E9E'};font-weight:600;">${dem.pendingQty > 0 ? dem.pendingQty + ' Qt' : '—'}</td>
                  <td><span class="badge ${dem.payStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${dem.payStatus}</span></td>
                  <td><span class="badge ${badgeCls(dem.approvalStatus)}">${dem.approvalStatus}</span></td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-info btn-sm" onclick="App.openDemandReview('${dem.id}')" title="View Detail">
                        <span class="material-icons" style="font-size:13px;">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ${this.state.demandActionPopup ? this.renderDemandActionPopup() : ''}`;
  },

  filterAdminDemands(status) {
    document.querySelectorAll('#admin-demand-table tbody tr').forEach(row => {
      row.style.display = (!status || row.innerText.includes(status)) ? '' : 'none';
    });
  },

  // open detail review screen
  openDemandReview(id) {
    this.state.reviewDemandId = id;
    this.navigate('demand-review');
  },

  // Full Approve directly from table
  quickApproveDemand(id) {
    const dem = this.state.adminDemands.find(d => d.id === id);
    if (!dem) return;
    const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
    const avail = stk ? (stk.available - stk.allocated) : 0;
    if (dem.requestedQty > avail) {
      this.showToast(`Only ${avail} Qt available — use Partial Approve`); return;
    }
    dem.approvedQty = dem.requestedQty;
    dem.pendingQty = 0;
    dem.approvalStatus = 'Approved';
    dem.remarks = '';
    this.showToast(`✓ DEM ${id} fully approved (${dem.approvedQty} Qt)`);
    this.render();
  },

  // ─── Popup helpers ───────────────────────────────────────────
  openPartialPopup(id) {
    this.state.reviewDemandId = id;
    this.state.demandActionPopup = 'partial';
    this.render();
  },
  openHoldPopup(id) {
    this.state.reviewDemandId = id;
    this.state.demandActionPopup = 'hold';
    this.render();
  },
  openRejectPopup(id) {
    this.state.reviewDemandId = id;
    this.state.demandActionPopup = 'reject';
    this.render();
  },
  closeDemandPopup() {
    this.state.demandActionPopup = null;
    this.state.reviewDemandId = null;
    this.render();
  },

  renderDemandActionPopup() {
    const type = this.state.demandActionPopup;
    const dem = this.state.adminDemands.find(d => d.id === this.state.reviewDemandId);
    if (!dem) return '';
    const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
    const avail = stk ? (stk.available - stk.allocated) : 0;

    if (type === 'partial') return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeDemandPopup()">
      <div class="modal-box" style="max-width:500px;">
        <div class="modal-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1);">
          <h3>⚖️ Partial Approval — ${dem.id}</h3>
          <button class="modal-close" onclick="App.closeDemandPopup()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#E3F2FD;border-radius:8px;padding:14px;margin-bottom:18px;">
            <div><div style="font-size:0.72rem;color:#555;">Requested Qty</div><div style="font-size:1.3rem;font-weight:700;color:#1565C0;">${dem.requestedQty} Qt</div></div>
            <div><div style="font-size:0.72rem;color:#555;">Available Stock</div><div style="font-size:1.3rem;font-weight:700;color:${avail > 0 ? '#2E7D32' : '#C62828'};">${avail} Qt</div></div>
            <div><div style="font-size:0.72rem;color:#555;">Society</div><div style="font-size:0.85rem;font-weight:600;">${dem.society}</div></div>
            <div><div style="font-size:0.72rem;color:#555;">Crop / Variety</div><div style="font-size:0.85rem;font-weight:600;">${dem.crop} / ${dem.variety}</div></div>
          </div>
          <div class="form-group">
            <label>Approved Quantity (Quintal) *</label>
            <input type="number" class="form-control" id="partial-qty"
              placeholder="Max: ${Math.min(dem.requestedQty, avail)} Qt"
              min="1" max="${Math.min(dem.requestedQty, avail)}"
              oninput="App.updatePartialCalc(this.value,${dem.requestedQty},${avail})"/>
            <div id="partial-calc" style="font-size:0.78rem;color:#555;margin-top:6px;">
              Enter quantity to see pending calculation
            </div>
          </div>
          <div class="form-group">
            <label>Remarks *</label>
            <textarea class="form-control" rows="2" id="partial-remarks"
              placeholder="Reason for partial approval (e.g. only 60 Qt available in stock)..."></textarea>
          </div>
          <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:8px;padding:10px;font-size:0.78rem;color:#5D4037;">
            <b>Rules:</b> Approved ≤ Requested Qty &nbsp;|&nbsp; Approved ≤ Available Stock &nbsp;|&nbsp;
            Pending = Requested − Approved
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeDemandPopup()">Cancel</button>
          <button class="btn btn-primary" onclick="App.confirmPartialApproval()">
            <span class="material-icons" style="font-size:16px;">rule</span> Confirm Partial Approval
          </button>
        </div>
      </div>
    </div>`;

    if (type === 'reject') return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeDemandPopup()">
      <div class="modal-box" style="max-width:460px;">
        <div class="modal-header" style="background:linear-gradient(135deg,#C62828,#B71C1C);">
          <h3>❌ Reject Demand — ${dem.id}</h3>
          <button class="modal-close" onclick="App.closeDemandPopup()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:#FFEBEE;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.85rem;">
            <b>${dem.society}</b> | ${dem.crop} ${dem.variety} | Requested: <b>${dem.requestedQty} Qt</b>
          </div>
          <div class="form-group">
            <label>Rejection Reason *</label>
            <select class="form-control" id="reject-reason">
              <option value="">Select reason</option>
              <option>Duplicate demand for same season</option>
              <option>Society members below minimum threshold</option>
              <option>Payment not received</option>
              <option>Invalid crop/variety combination</option>
              <option>Society not eligible</option>
              <option>Other (see remarks)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Remarks *</label>
            <textarea class="form-control" rows="3" id="reject-remarks"
              placeholder="Provide detailed reason for rejection..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeDemandPopup()">Cancel</button>
          <button class="btn btn-danger" onclick="App.confirmRejectDemand()">
            <span class="material-icons" style="font-size:16px;">cancel</span> Confirm Rejection
          </button>
        </div>
      </div>
    </div>`;

    if (type === 'hold') return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeDemandPopup()">
      <div class="modal-box" style="max-width:460px;">
        <div class="modal-header" style="background:linear-gradient(135deg,#6A1B9A,#4A148C);">
          <h3>⏸️ Put On Hold — ${dem.id}</h3>
          <button class="modal-close" onclick="App.closeDemandPopup()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:#F3E5F5;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.85rem;">
            <b>${dem.society}</b> | ${dem.crop} ${dem.variety} | Requested: <b>${dem.requestedQty} Qt</b>
          </div>
          <div class="form-group">
            <label>Hold Reason *</label>
            <select class="form-control" id="hold-reason">
              <option value="">Select reason</option>
              <option>Awaiting field verification</option>
              <option>Stock under inspection</option>
              <option>Payment verification pending</option>
              <option>Additional documents required</option>
              <option>Other (see remarks)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Remarks *</label>
            <textarea class="form-control" rows="3" id="hold-remarks"
              placeholder="Reason for putting on hold..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeDemandPopup()">Cancel</button>
          <button class="btn btn-warning" onclick="App.confirmHoldDemand()" style="background:#9C27B0;color:#fff;">
            <span class="material-icons" style="font-size:16px;">pause_circle</span> Confirm Hold
          </button>
        </div>
      </div>
    </div>`;

    return '';
  },

  updatePartialCalc(val, requested, avail) {
    const el = document.getElementById('partial-calc');
    if (!el) return;
    const v = parseFloat(val);
    if (!v || v <= 0) { el.style.color = '#9E9E9E'; el.textContent = 'Enter quantity to see pending calculation'; return; }
    if (v > avail) { el.style.color = '#C62828'; el.textContent = `⚠ Exceeds available stock of ${avail} Qt`; return; }
    if (v > requested) { el.style.color = '#C62828'; el.textContent = `⚠ Cannot exceed requested qty of ${requested} Qt`; return; }
    const pending = requested - v;
    el.style.color = '#2E7D32';
    el.innerHTML = `✓ Approved: <b>${v} Qt</b> &nbsp;|&nbsp; Pending: <b>${pending} Qt</b> &nbsp;|&nbsp; Status → <b>Partially Approved</b>`;
  },

  confirmPartialApproval() {
    const dem = this.state.adminDemands.find(d => d.id === this.state.reviewDemandId);
    const qty = parseFloat(document.getElementById('partial-qty')?.value);
    const rmk = document.getElementById('partial-remarks')?.value?.trim();
    if (!dem) return;
    const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
    const avail = stk ? (stk.available - stk.allocated) : 0;
    if (!qty || qty <= 0) { this.showToast('Enter approved quantity'); return; }
    if (qty > dem.requestedQty) { this.showToast('Cannot exceed requested quantity'); return; }
    if (qty > avail) { this.showToast(`Only ${avail} Qt available`); return; }
    if (!rmk) { this.showToast('Remarks are required'); return; }
    dem.approvedQty = qty;
    dem.pendingQty = +(dem.requestedQty - qty).toFixed(2);
    dem.approvalStatus = qty === dem.requestedQty ? 'Approved' : 'Partially Approved';
    dem.remarks = rmk;
    this.state.demandActionPopup = null;
    this.state.reviewDemandId = null;
    this.showToast(`✓ Partial approval: ${qty} Qt approved, ${dem.pendingQty} Qt pending`);
    this.render();
  },

  confirmRejectDemand() {
    const dem = this.state.adminDemands.find(d => d.id === this.state.reviewDemandId);
    const rsn = document.getElementById('reject-reason')?.value;
    const rmk = document.getElementById('reject-remarks')?.value?.trim();
    if (!dem) return;
    if (!rsn) { this.showToast('Select rejection reason'); return; }
    if (!rmk) { this.showToast('Remarks are required'); return; }
    dem.approvalStatus = 'Rejected';
    dem.approvedQty = 0;
    dem.pendingQty = dem.requestedQty;
    dem.remarks = rsn + ': ' + rmk;
    this.state.demandActionPopup = null;
    this.state.reviewDemandId = null;
    this.showToast(`Demand ${dem.id} rejected`);
    this.render();
  },

  confirmHoldDemand() {
    const dem = this.state.adminDemands.find(d => d.id === this.state.reviewDemandId);
    const rsn = document.getElementById('hold-reason')?.value;
    const rmk = document.getElementById('hold-remarks')?.value?.trim();
    if (!dem) return;
    if (!rsn) { this.showToast('Select hold reason'); return; }
    if (!rmk) { this.showToast('Remarks are required'); return; }
    dem.approvalStatus = 'Hold';
    dem.remarks = rsn + ': ' + rmk;
    this.state.demandActionPopup = null;
    this.state.reviewDemandId = null;
    this.showToast(`Demand ${dem.id} put on hold`);
    this.render();
  },

  // ============================
  // SCREEN 11: DEMAND REVIEW — Full Detail
  // ============================
  renderDemandReview() {
    const id = this.state.reviewDemandId;
    const dem = this.state.adminDemands.find(d => d.id === id) || this.state.adminDemands[1];
    const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
    const avail = stk ? (stk.available - stk.allocated) : 0;
    const badgeCls = s => s === 'Approved' ? 'badge-success' : s === 'Partially Approved' ? 'badge-info' : s === 'Pending' ? 'badge-warning' : s === 'Rejected' ? 'badge-danger' : 'badge-purple';
    const checks = [
      { label: 'Minimum Members Rule', ok: dem.members >= 50, ok_txt: `${dem.members} members ≥ 50 ✓`, fail_txt: `Only ${dem.members} members — below minimum 50` },
      { label: 'Available Stock Rule', ok: avail >= dem.requestedQty, ok_txt: `${avail} Qt available ≥ ${dem.requestedQty} Qt ✓`, fail_txt: `Only ${avail} Qt available — insufficient` },
      { label: 'Advance Payment', ok: dem.payStatus === 'Paid', ok_txt: 'Advance payment received ✓', fail_txt: 'Advance payment not yet received' },
      { label: 'Duplicate Demand', ok: dem.approvalStatus !== 'Rejected', ok_txt: 'No duplicate demand found ✓', fail_txt: 'Duplicate demand detected' },
    ];
    return `
    <div class="page-header">
      <h1>Demand Review</h1>
      <p>Demand ID: <b>${dem.id}</b> — ${dem.society}</p>
    </div>
    <button class="btn btn-gray btn-sm" style="margin-bottom:16px;" onclick="App.navigate('admin-demands')">
      <span class="material-icons">arrow_back</span> Back to Demand List
    </button>

    <!-- Quantity Summary Banner -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;
                background:linear-gradient(135deg,#1B5E20,#2E7D32);border-radius:12px;
                padding:20px;margin-bottom:20px;">
      <div style="text-align:center;">
        <div style="font-size:1.5rem;font-weight:700;color:#fff;">${dem.requestedQty} Qt</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Requested</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:1.5rem;font-weight:700;color:#A5D6A7;">${dem.approvedQty || 0} Qt</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Approved</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:1.5rem;font-weight:700;color:#FFD54F;">${dem.pendingQty} Qt</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Pending</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:1.5rem;font-weight:700;color:${avail >= dem.requestedQty ? '#fff' : '#FF8A65'};">${avail} Qt</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Available Stock</div>
      </div>
      <div style="text-align:center;">
        <span class="badge ${badgeCls(dem.approvalStatus)}" style="font-size:0.82rem;padding:6px 12px;">${dem.approvalStatus}</span>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.7);margin-top:4px;">Current Status</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <!-- LEFT -->
      <div>
        <div class="card">
          <div class="card-header"><h3><span class="material-icons" style="font-size:18px;vertical-align:middle;color:#4CAF50;">business</span> Society Details</h3></div>
          <div class="card-body" style="display:grid;gap:10px;">
            ${[['Society Name', dem.society], ['Society Code', dem.socCode], ['District', dem.district], ['Total Members', dem.members], ['Season', dem.season], ['Date', dem.date]].map(([l, v]) => `
            <div style="display:flex;gap:8px;border-bottom:1px solid #f5f5f5;padding-bottom:8px;">
              <span style="font-size:0.8rem;color:#757575;width:130px;flex-shrink:0;">${l}</span>
              <span style="font-size:0.85rem;font-weight:500;">${v}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3><span class="material-icons" style="font-size:18px;vertical-align:middle;color:#4CAF50;">grass</span> Demand Details</h3></div>
          <div class="card-body" style="display:grid;gap:10px;">
            ${[['Demand ID', dem.id], ['Crop', dem.crop], ['Variety', dem.variety],
      ['Requested Qty', dem.requestedQty + ' Quintal'],
      ['Approved Qty', dem.approvedQty ? dem.approvedQty + ' Quintal' : '— Not yet approved'],
      ['Pending Qty', dem.pendingQty + ' Quintal'],
      ['Payment', dem.payStatus]].map(([l, v]) => `
            <div style="display:flex;gap:8px;border-bottom:1px solid #f5f5f5;padding-bottom:8px;">
              <span style="font-size:0.8rem;color:#757575;width:130px;flex-shrink:0;">${l}</span>
              <span style="font-size:0.85rem;font-weight:500;">${v}</span>
            </div>`).join('')}
            ${dem.remarks ? `<div style="background:#FFF8E1;border-radius:8px;padding:10px;font-size:0.8rem;color:#5D4037;margin-top:4px;">
              <b>Remarks:</b> ${dem.remarks}</div>` : ''}
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <div>
        <div class="card">
          <div class="card-header"><h3><span class="material-icons" style="font-size:18px;vertical-align:middle;color:#4CAF50;">fact_check</span> System Validation Checks</h3></div>
          <div class="card-body" style="display:grid;gap:10px;">
            ${checks.map(c => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;
                        background:${c.ok ? '#E8F5E9' : '#FFEBEE'};border-radius:8px;
                        border:1px solid ${c.ok ? '#A5D6A7' : '#EF9A9A'};">
              <span class="material-icons" style="color:${c.ok ? '#2E7D32' : '#C62828'};flex-shrink:0;">${c.ok ? 'check_circle' : 'error'}</span>
              <div>
                <div style="font-size:0.83rem;font-weight:600;color:${c.ok ? '#2E7D32' : '#C62828'};">${c.label}</div>
                <div style="font-size:0.75rem;color:#555;">${c.ok ? c.ok_txt : c.fail_txt}</div>
              </div>
            </div>`).join('')}
          </div>
        </div>
        ${dem.approvalStatus === 'Pending' || dem.approvalStatus === 'Hold' ? `
        <div class="card">
          <div class="card-header"><h3><span class="material-icons" style="font-size:18px;vertical-align:middle;color:#4CAF50;">gavel</span> Admin Decision</h3></div>
          <div class="card-body">
            <div style="display:grid;gap:12px;">
              <button class="btn btn-success" style="justify-content:flex-start;padding:12px 16px;"
                onclick="App.quickApproveDemand('${dem.id}');App.navigate('admin-demands')">
                <span class="material-icons">check_circle</span>
                <div style="text-align:left;margin-left:4px;">
                  <div style="font-weight:600;">Full Approve</div>
                  <div style="font-size:0.72rem;opacity:0.85;">Approve entire ${dem.requestedQty} Qt</div>
                </div>
              </button>
              <button class="btn btn-primary" style="justify-content:flex-start;padding:12px 16px;"
                onclick="App.openPartialPopup('${dem.id}')">
                <span class="material-icons">rule</span>
                <div style="text-align:left;margin-left:4px;">
                  <div style="font-weight:600;">Partial Approve</div>
                  <div style="font-size:0.72rem;opacity:0.85;">Approve less than ${dem.requestedQty} Qt</div>
                </div>
              </button>
              <button class="btn btn-warning" style="justify-content:flex-start;padding:12px 16px;background:#9C27B0;"
                onclick="App.openHoldPopup('${dem.id}')">
                <span class="material-icons">pause_circle</span>
                <div style="text-align:left;margin-left:4px;">
                  <div style="font-weight:600;">Put On Hold</div>
                  <div style="font-size:0.72rem;opacity:0.85;">Temporarily pause review</div>
                </div>
              </button>
              <button class="btn btn-danger" style="justify-content:flex-start;padding:12px 16px;"
                onclick="App.openRejectPopup('${dem.id}')">
                <span class="material-icons">cancel</span>
                <div style="text-align:left;margin-left:4px;">
                  <div style="font-weight:600;">Reject Demand</div>
                  <div style="font-size:0.72rem;opacity:0.85;">Decline with reason</div>
                </div>
              </button>
            </div>
          </div>
        </div>` : `
        <div class="card">
          <div class="card-body" style="text-align:center;padding:32px;">
            <span class="material-icons" style="font-size:48px;color:${dem.approvalStatus === 'Approved' ? '#4CAF50' : dem.approvalStatus === 'Rejected' ? '#F44336' : '#9C27B0'};">
              ${dem.approvalStatus === 'Approved' ? 'check_circle' : dem.approvalStatus === 'Rejected' ? 'cancel' : 'rule'}
            </span>
            <h3 style="margin-top:12px;color:#424242;">Status: ${dem.approvalStatus}</h3>
            ${dem.remarks ? `<p style="color:#757575;font-size:0.85rem;margin-top:8px;">${dem.remarks}</p>` : ''}
          </div>
        </div>`}
      </div>
    </div>
    ${this.state.demandActionPopup ? this.renderDemandActionPopup() : ''}`;
  },

  // ============================
  // SCREEN 12: STOCK MANAGEMENT / MIN QTY ALLOCATION
  // ============================
  renderAdminStock() {
    return `
    <div class="page-header"><h1>Stock Management & Quantity Allocation</h1><p>Manage seed inventory and allocate to societies</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon"><span class="material-icons">inventory_2</span></div><div class="stat-info"><div class="value">2,150 Qt</div><div class="label">Total Available Stock</div></div></div>
      <div class="stat-card blue"><div class="stat-icon"><span class="material-icons">assignment_turned_in</span></div><div class="stat-info"><div class="value">790 Qt</div><div class="label">Total Allocated</div></div></div>
      <div class="stat-card teal"><div class="stat-icon"><span class="material-icons">local_shipping</span></div><div class="stat-info"><div class="value">420 Qt</div><div class="label">Distributed</div></div></div>
      <div class="stat-card orange"><div class="stat-icon"><span class="material-icons">pending</span></div><div class="stat-info"><div class="value">1,360 Qt</div><div class="label">Remaining Stock</div></div></div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Current Stock Inventory</h3>
        <button class="btn btn-primary btn-sm"><span class="material-icons">add</span> Add Stock</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Crop</th><th>Variety</th><th>Available (Qt)</th><th>Allocated (Qt)</th><th>Distributed (Qt)</th><th>Balance (Qt)</th></tr></thead>
            <tbody>
              ${this.state.stock.map(s => `<tr>
                <td><b>${s.crop}</b></td><td>${s.variety}</td>
                <td style="color:#2E7D32;font-weight:600;">${s.available}</td>
                <td style="color:#1565C0;font-weight:600;">${s.allocated}</td>
                <td style="color:#E65100;font-weight:600;">${s.distributed}</td>
                <td style="font-weight:600;">${s.available - s.allocated}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Proportional Allocation Calculator</h3></div>
      <div class="card-body">
        <div class="form-grid" style="margin-bottom:20px;">
          <div class="form-group">
            <label>Select Crop</label>
            <select class="form-control"><option>Wheat</option><option>Soybean</option><option>Gram</option><option>Mustard</option></select>
          </div>
          <div class="form-group">
            <label>Select Variety</label>
            <select class="form-control"><option>GW-322</option><option>GW-496</option></select>
          </div>
          <div class="form-group">
            <label>Available Stock (Qt)</label>
            <input type="number" class="form-control" value="850"/>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Society Name</th><th>Requested Qty (Qt)</th><th>Approved Qty (Qt)</th><th>Allocation %</th><th>Status</th></tr></thead>
            <tbody>
              ${[
        { society: 'Rampur Krishi Samiti', req: 200, approved: 180, pct: '21.2', status: 'Calculated' },
        { society: 'Sehora Kisan Sabha', req: 180, approved: 162, pct: '19.1', status: 'Calculated' },
        { society: 'Patan Krishi Vikas Samiti', req: 220, approved: 198, pct: '23.3', status: 'Calculated' },
        { society: 'Bargaon Beej Samiti', req: 150, approved: 0, pct: '-', status: 'Ineligible (<50 members)' },
      ].map(r => `<tr>
                <td>${r.society}</td>
                <td>${r.req}</td>
                <td style="font-weight:600;color:#2E7D32;">${r.approved || '-'}</td>
                <td>${r.pct}%</td>
                <td><span class="badge ${r.status === 'Calculated' ? 'badge-info' : 'badge-danger'}">${r.status}</span></td>
              </tr>`).join('')}
              <tr style="background:#E8F5E9;font-weight:600;">
                <td>Total</td><td>750 Qt</td><td>540 Qt</td><td>63.5%</td><td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-actions" style="margin-top:16px;">
          <button class="btn btn-outline"><span class="material-icons">calculate</span> Calculate Allocation</button>
          <button class="btn btn-warning"><span class="material-icons">save</span> Save Allocation</button>
          <button class="btn btn-primary" onclick="App.showToast('Allocation submitted for dispatch!')"><span class="material-icons">send</span> Submit Allocation</button>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 13: ADMIN DISTRIBUTION
  // ============================
  renderAdminDistribution() {
    return `
    <div class="page-header"><h1>Distribution Management</h1><p>Manage dispatch of seeds to societies</p></div>
    <div class="card">
      <div class="card-header">
        <h3>Dispatch Orders — Rabi 2024-25</h3>
        <button class="btn btn-primary btn-sm" onclick="App.showToast('Dispatch orders generated!')"><span class="material-icons">receipt_long</span> Generate All Orders</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Society Name</th><th>Crop/Variety</th><th>Approved Qty (Qt)</th><th>Dispatch Qty (Qt)</th><th>Dispatch Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${[
        { society: 'Rampur Krishi Samiti', crop: 'Soybean/JS-335', approved: 120, dispatch: 120, date: '2024-07-01', status: 'Delivered' },
        { society: 'Sehora Kisan Sabha', crop: 'Wheat/GW-322', approved: 162, dispatch: 0, date: '-', status: 'Pending' },
        { society: 'Patan Krishi Vikas Samiti', crop: 'Mustard/Pusa Bold', approved: 198, dispatch: 0, date: '-', status: 'Pending' },
      ].map(d => `<tr>
                <td>${d.society}</td>
                <td>${d.crop}</td>
                <td style="font-weight:600;">${d.approved}</td>
                <td>
                  ${d.status === 'Pending' ? `<input type="number" class="form-control" value="${d.approved}" style="width:90px;padding:6px;"/>` : d.dispatch}
                </td>
                <td>
                  ${d.status === 'Pending' ? `<input type="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" style="width:140px;padding:6px;"/>` : d.date}
                </td>
                <td><span class="badge ${d.status === 'Delivered' ? 'badge-success' : d.status === 'Dispatched' ? 'badge-info' : 'badge-warning'}">${d.status}</span></td>
                <td>
                  <div class="action-btns">
                    ${d.status === 'Pending' ? `<button class="btn btn-primary btn-sm" onclick="App.showToast('Stock dispatched!')"><span class="material-icons" style="font-size:14px;">local_shipping</span> Dispatch</button>` : ''}
                    <button class="btn btn-gray btn-sm" onclick="App.showToast('Order downloaded!')"><span class="material-icons" style="font-size:14px;">download</span></button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  // ============================
  // SCREEN 15: ADMIN REPORTS
  // ============================
  renderAdminReports() {
    return `
    <div class="page-header"><h1>Reports & Analytics</h1><p>Comprehensive reports for demand, stock and distribution</p></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:20px;">
      ${[
        { icon: 'location_city', title: 'District Wise Demand Report', desc: 'Crop demand aggregated by district', color: '#4CAF50' },
        { icon: 'grass', title: 'Crop Wise Demand Report', desc: 'Total demand per crop and variety', color: '#2196F3' },
        { icon: 'inventory_2', title: 'Stock Report', desc: 'Current stock, allocations and balance', color: '#FF9800' },
        { icon: 'assignment_turned_in', title: 'Allocation Report', desc: 'Proportional allocation summary', color: '#9C27B0' },
        { icon: 'local_shipping', title: 'Distribution Report', desc: 'Society-wise dispatch and delivery', color: '#00BCD4' },
        { icon: 'group', title: 'Society Member Report', desc: 'Member count and eligibility status', color: '#F44336' },
      ].map(r => `
      <div class="card" style="border-top:4px solid ${r.color};">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="width:44px;height:44px;border-radius:10px;background:${r.color}22;display:flex;align-items:center;justify-content:center;">
              <span class="material-icons" style="color:${r.color};font-size:24px;">${r.icon}</span>
            </div>
            <div><h4 style="font-size:0.9rem;font-weight:600;">${r.title}</h4><p style="font-size:0.78rem;color:#757575;">${r.desc}</p></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-danger btn-sm" style="flex:1;" onclick="App.showToast('PDF report generated!')"><span class="material-icons" style="font-size:14px;">picture_as_pdf</span> PDF</button>
            <button class="btn btn-success btn-sm" style="flex:1;" onclick="App.showToast('Excel report generated!')"><span class="material-icons" style="font-size:14px;">grid_on</span> Excel</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><h3>District Wise Demand Summary</h3></div>
      <div class="card-body">
        ${[{ label: 'Chhindwara', pct: 82, val: '680 Qt' }, { label: 'Seoni', pct: 65, val: '540 Qt' }, { label: 'Narsinghpur', pct: 48, val: '400 Qt' }, { label: 'Betul', pct: 35, val: '290 Qt' }, { label: 'Balaghat', pct: 22, val: '180 Qt' }].map(c => `
        <div class="chart-bar-group" style="margin-bottom:12px;">
          <span class="chart-label">${c.label}</span>
          <div class="chart-bar-bg"><div class="chart-bar" style="width:${c.pct}%"></div></div>
          <span class="chart-val">${c.val}</span>
        </div>`).join('')}
      </div>
    </div>`;
  },

  // ============================
  // PROFILE PAGE
  // ============================
  renderProfile() {
    const u = this.state.currentUser;
    const isAdmin = this.state.currentRole === 'admin';
    const currentMobile = isAdmin ? '9876543200' : '9876543210';
    const currentEmail = isAdmin ? 'admin@beejsangh.mp.gov.in' : 'ramesh@rampur.mp.gov.in';

    return `
    <div class="page-header"><h1>My Profile</h1><p>Manage your account settings and security</p></div>
    
    <div style="display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start;">
      <!-- Profile Card -->
      <div class="card" style="text-align:center;">
        <div class="card-body">
          <div style="width:80px;height:80px;border-radius:50%;background:#4CAF50;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;font-weight:600;margin:0 auto 16px;">${u.initials}</div>
          <h3 style="font-size:1rem;font-weight:600;">${u.name}</h3>
          <p style="font-size:0.82rem;color:#666;margin-top:4px;">${u.role}</p>
          <span class="badge badge-success" style="margin-top:8px;">Active</span>
          <div style="margin-top:16px;">
            <button class="btn btn-outline btn-sm">
              <span class="material-icons" style="font-size:14px;">photo_camera</span> Change Photo
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="card">
        <div class="card-header">
          <h3>Account Details</h3>
          ${this.state.profileUpdateMode ?
        '<span class="badge badge-warning">OTP Verification Required</span>' :
        '<span class="badge badge-info">Click Update to Edit</span>'
      }
        </div>
        <div class="card-body">
          <form id="profile-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Full Name <span style="color:#F44336;">*</span></label>
                <input type="text" id="profile-name" class="form-control" value="${u.name}"/>
              </div>
              <div class="form-group">
                <label>Username</label>
                <input type="text" class="form-control" value="${isAdmin ? 'beejsangh_admin' : 'ramesh.verma'}" readonly style="background:#f5f5f5;"/>
              </div>
              <div class="form-group">
                <label>Mobile Number <span style="color:#F44336;">*</span></label>
                <input type="tel" id="profile-mobile" class="form-control" value="${currentMobile}" maxlength="10" pattern="[0-9]{10}"/>
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="profile-email" class="form-control" value="${currentEmail}"/>
              </div>
              ${!isAdmin ? `
                <div class="form-group">
                  <label>Society Code</label>
                  <input type="text" class="form-control" value="SOC-001" readonly style="background:#f5f5f5;"/>
                </div>
                <div class="form-group">
                  <label>Society Name</label>
                  <input type="text" class="form-control" value="Rampur Krishi Samiti" readonly style="background:#f5f5f5;"/>
                </div>
              ` : ''}
              <div class="form-group">
                <label>Role</label>
                <input type="text" class="form-control" value="${u.role}" readonly style="background:#f5f5f5;"/>
              </div>
              <div class="form-group">
                <label>Status</label>
                <input type="text" class="form-control" value="Active" readonly style="background:#f5f5f5;"/>
              </div>
            </div>

            ${this.state.profileUpdateMode ? `
              <div class="alert alert-warning" style="margin-top:20px;">
                <span class="material-icons">security</span>
                <div>
                  <b>OTP Verification Required</b><br/>
                  ${this.state.profileOTPSent ?
          `An OTP has been sent to your registered mobile <b>+91 ${currentMobile}</b>` :
          'Click "Send OTP" to verify your identity before updating profile'
        }
                </div>
              </div>

              ${this.state.profileOTPSent ? `
                <div class="form-group" style="margin-top:16px;">
                  <label>Enter OTP <span style="color:#F44336;">*</span></label>
                  <div class="input-icon-wrap">
                    <span class="material-icons">password</span>
                    <input type="text" id="profile-otp" class="form-control" placeholder="Enter 6-digit OTP" maxlength="6" pattern="[0-9]{6}" style="letter-spacing:6px;font-size:1.1rem;text-align:center;"/>
                  </div>
                  <small style="color:#666;font-size:0.75rem;">
                    Didn't receive OTP? 
                    <a href="#" onclick="App.sendProfileOTP();return false" style="color:#2E7D32;font-weight:600;">Resend</a>
                  </small>
                </div>
              ` : ''}
            ` : ''}

            <div class="form-actions" style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
              ${!this.state.profileUpdateMode ? `
                <button type="button" class="btn btn-primary" onclick="App.enableProfileUpdate()">
                  <span class="material-icons">edit</span> Update Profile
                </button>
                <button type="button" class="btn btn-outline" onclick="App.openChangePasswordModal()">
                  <span class="material-icons">lock</span> Change Password
                </button>
              ` : this.state.profileOTPSent ? `
                <button type="button" class="btn btn-success" onclick="App.verifyAndUpdateProfile()">
                  <span class="material-icons">check_circle</span> Verify & Save
                </button>
                <button type="button" class="btn btn-gray" onclick="App.cancelProfileUpdate()">
                  <span class="material-icons">close</span> Cancel
                </button>
              ` : `
                <button type="button" class="btn btn-warning" onclick="App.sendProfileOTP()">
                  <span class="material-icons">send</span> Send OTP
                </button>
                <button type="button" class="btn btn-gray" onclick="App.cancelProfileUpdate()">
                  <span class="material-icons">close</span> Cancel
                </button>
              `}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    ${this.state.changePasswordModal ? this.renderChangePasswordModal() : ''}
    `;
  },

  enableProfileUpdate() {
    this.state.profileUpdateMode = true;
    this.state.profileOTPSent = false;
    this.render();
  },

  cancelProfileUpdate() {
    this.state.profileUpdateMode = false;
    this.state.profileOTPSent = false;
    this.state.profileGeneratedOTP = '';
    this.render();
  },

  sendProfileOTP() {
    const mobile = document.getElementById('profile-mobile')?.value?.trim();
    if (!mobile || mobile.length !== 10 || !/^[0-9]{10}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.state.profileGeneratedOTP = otp;
    console.log(`[OTP] Profile Update OTP for ${mobile}: ${otp}`);

    // In production: Send SMS via API
    alert(`OTP sent to +91 ${mobile}\n\n[Demo Mode] Your OTP is: ${otp}\n\n(In production, this will be sent via SMS)`);

    this.state.profileOTPSent = true;
    this.render();
  },

  verifyAndUpdateProfile() {
    const otp = document.getElementById('profile-otp')?.value?.trim();
    const name = document.getElementById('profile-name')?.value?.trim();
    const mobile = document.getElementById('profile-mobile')?.value?.trim();
    const email = document.getElementById('profile-email')?.value?.trim();

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (otp !== this.state.profileGeneratedOTP) {
      alert('❌ Invalid OTP! Please try again.');
      return;
    }

    if (!name || !mobile || !email) {
      alert('Please fill all required fields');
      return;
    }

    // In production: Update profile via API
    this.state.currentUser.name = name;

    alert('✅ Profile updated successfully!\n\nYour changes have been saved.');

    this.state.profileUpdateMode = false;
    this.state.profileOTPSent = false;
    this.state.profileGeneratedOTP = '';
    this.render();
  },

  openChangePasswordModal() {
    this.state.changePasswordModal = true;
    this.render();
  },

  closeChangePasswordModal() {
    this.state.changePasswordModal = false;
    this.render();
  },

  renderChangePasswordModal() {
    return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeChangePasswordModal()">
      <div class="modal-box" style="max-width:500px;">
        <div class="modal-header">
          <h3>Change Password</h3>
          <button class="modal-close" onclick="App.closeChangePasswordModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Current Password <span style="color:#F44336;">*</span></label>
            <input type="password" id="current-password" class="form-control" placeholder="Enter current password"/>
          </div>
          <div class="form-group">
            <label>New Password <span style="color:#F44336;">*</span></label>
            <input type="password" id="new-password" class="form-control" placeholder="Enter new password" minlength="8"/>
            <small style="color:#666;font-size:0.75rem;">Minimum 8 characters</small>
          </div>
          <div class="form-group">
            <label>Confirm New Password <span style="color:#F44336;">*</span></label>
            <input type="password" id="confirm-password" class="form-control" placeholder="Confirm new password"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeChangePasswordModal()">Cancel</button>
          <button class="btn btn-primary" onclick="App.changePassword()">
            <span class="material-icons">check_circle</span> Change Password
          </button>
        </div>
      </div>
    </div>`;
  },

  changePassword() {
    const currentPwd = document.getElementById('current-password')?.value;
    const newPwd = document.getElementById('new-password')?.value;
    const confirmPwd = document.getElementById('confirm-password')?.value;

    if (!currentPwd || !newPwd || !confirmPwd) {
      alert('Please fill all fields');
      return;
    }

    if (newPwd.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    if (newPwd !== confirmPwd) {
      alert('New passwords do not match!');
      return;
    }

    // In production: Verify current password and update via API
    alert('✅ Password changed successfully!\n\nYour password has been updated.');
    this.closeChangePasswordModal();
  },

  // ============================
  // RESET PASSWORD PAGE (From Dashboard)
  // ============================
  renderResetPasswordPage() {
    const u = this.state.currentUser;
    const isAdmin = this.state.currentRole === 'admin';
    const currentMobile = isAdmin ? '9876543200' : '9876543210';

    return `
    <div class="page-header">
      <h1>Reset Password</h1>
      <p>Change your account password securely with OTP verification</p>
    </div>

    <div style="max-width:600px;margin:0 auto;">
      <div class="card">
        <div class="card-header">
          <h3>🔒 Password Reset</h3>
          ${this.state.resetPwdOTPSent ?
        '<span class="badge badge-warning">OTP Verification Required</span>' :
        '<span class="badge badge-info">Secure Password Change</span>'
      }
        </div>
        <div class="card-body">
          ${!this.state.resetPwdOTPSent ? `
            <!-- Step 1: Verify Identity -->
            <div class="alert alert-info" style="margin-bottom:20px;">
              <span class="material-icons">security</span>
              <div>
                <b>Security Check Required</b><br/>
                We'll send an OTP to your registered mobile number to verify your identity
              </div>
            </div>

            <div class="form-group">
              <label>Current Password <span style="color:#F44336;">*</span></label>
              <input type="password" id="reset-current-password" class="form-control" placeholder="Enter your current password"/>
            </div>

            <div class="form-group">
              <label>Registered Mobile Number</label>
              <input type="text" class="form-control" value="+91 ${currentMobile}" readonly style="background:#F5F5F5;"/>
              <small style="color:#666;font-size:0.75rem;">OTP will be sent to this number</small>
            </div>

            <div class="form-actions">
              <button class="btn btn-gray" onclick="App.navigate('${isAdmin ? 'admin-dashboard' : 'dashboard'}')">
                <span class="material-icons">close</span> Cancel
              </button>
              <button class="btn btn-warning" onclick="App.sendResetPasswordOTP()">
                <span class="material-icons">send</span> Send OTP
              </button>
            </div>
          ` : !this.state.resetPwdOTPVerified ? `
            <!-- Step 2: Verify OTP -->
            <div class="alert alert-success" style="margin-bottom:20px;">
              <span class="material-icons">check_circle</span>
              <div>
                <b>OTP Sent Successfully!</b><br/>
                A 6-digit OTP has been sent to <b>+91 ${currentMobile}</b>
              </div>
            </div>

            <div class="form-group">
              <label>Enter OTP <span style="color:#F44336;">*</span></label>
              <div class="input-icon-wrap">
                <span class="material-icons">password</span>
                <input type="text" id="reset-otp" class="form-control" placeholder="Enter 6-digit OTP" maxlength="6" pattern="[0-9]{6}" style="letter-spacing:6px;font-size:1.1rem;text-align:center;"/>
              </div>
              <small style="color:#666;font-size:0.75rem;">
                Didn't receive OTP? 
                <a href="#" onclick="App.sendResetPasswordOTP();return false" style="color:#2E7D32;font-weight:600;">Resend</a>
              </small>
            </div>

            <div class="form-actions">
              <button class="btn btn-gray" onclick="App.cancelResetPassword()">
                <span class="material-icons">close</span> Cancel
              </button>
              <button class="btn btn-primary" onclick="App.verifyResetPasswordOTP()">
                <span class="material-icons">verified_user</span> Verify OTP
              </button>
            </div>
          ` : `
            <!-- Step 3: Set New Password -->
            <div class="alert alert-success" style="margin-bottom:20px;">
              <span class="material-icons">check_circle</span>
              <div><b>OTP Verified!</b> Now set your new password</div>
            </div>

            <div class="form-group">
              <label>New Password <span style="color:#F44336;">*</span></label>
              <input type="password" id="reset-new-password" class="form-control" placeholder="Enter new password" minlength="8"/>
              <small style="color:#666;font-size:0.75rem;">Minimum 8 characters</small>
            </div>

            <div class="form-group">
              <label>Confirm New Password <span style="color:#F44336;">*</span></label>
              <input type="password" id="reset-confirm-password" class="form-control" placeholder="Confirm new password"/>
            </div>

            <div class="form-actions">
              <button class="btn btn-gray" onclick="App.cancelResetPassword()">
                <span class="material-icons">close</span> Cancel
              </button>
              <button class="btn btn-success" onclick="App.saveResetPassword()">
                <span class="material-icons">check_circle</span> Reset Password
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
    `;
  },

  sendResetPasswordOTP() {
    const currentPwd = document.getElementById('reset-current-password')?.value;

    if (!currentPwd) {
      alert('Please enter your current password');
      return;
    }

    // In production: Verify current password via API first

    const mobile = this.state.currentRole === 'admin' ? '9876543200' : '9876543210';

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.state.resetPwdGeneratedOTP = otp;
    console.log(`[OTP] Reset Password OTP for ${mobile}: ${otp}`);

    alert(`OTP sent to +91 ${mobile}\n\n[Demo Mode] Your OTP is: ${otp}\n\n(In production, this will be sent via SMS)`);

    this.state.resetPwdOTPSent = true;
    this.state.resetPwdOTPVerified = false;
    this.render();
  },

  verifyResetPasswordOTP() {
    const otp = document.getElementById('reset-otp')?.value?.trim();

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (otp !== this.state.resetPwdGeneratedOTP) {
      alert('❌ Invalid OTP! Please try again.');
      return;
    }

    this.state.resetPwdOTPVerified = true;
    this.render();
  },

  saveResetPassword() {
    const newPwd = document.getElementById('reset-new-password')?.value;
    const confirmPwd = document.getElementById('reset-confirm-password')?.value;

    if (!newPwd || newPwd.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (newPwd !== confirmPwd) {
      alert('Passwords do not match!');
      return;
    }

    // In production: Update password via API
    alert('✅ Password reset successfully!\n\nYour password has been updated.');

    // Reset state
    this.state.resetPwdOTPSent = false;
    this.state.resetPwdOTPVerified = false;
    this.state.resetPwdGeneratedOTP = '';

    this.navigate(this.state.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard');
  },

  cancelResetPassword() {
    this.state.resetPwdOTPSent = false;
    this.state.resetPwdOTPVerified = false;
    this.state.resetPwdGeneratedOTP = '';
    this.navigate(this.state.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard');
  },

  // ============================================================
  // AVAILABLE STOCK PAGE
  // ============================================================
  renderSocAvailableStock() {
    const rs = this.state.receivedStock;
    const totalAlloc = rs.reduce((s, r) => s + r.allocatedQty, 0);
    const totalDist = rs.reduce((s, r) => s + r.distributedQty, 0);
    const totalBal = totalAlloc - totalDist;
    return `
    <div class="page-header">
      <h1>Available Stock</h1>
      <p>Seed stock received from Beej Sangh — Rampur Krishi Samiti (SOC-001)</p>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-bottom:24px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">inventory_2</span></div>
        <div class="stat-info">
          <div class="value">${totalAlloc} Qt</div>
          <div class="label">Total Allocated Stock</div>
        </div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info">
          <div class="value">${totalDist} Qt</div>
          <div class="label">Distributed Stock</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">storefront</span></div>
        <div class="stat-info">
          <div class="value">${totalBal} Qt</div>
          <div class="label">Available Balance</div>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">pie_chart</span></div>
        <div class="stat-info">
          <div class="value">${totalAlloc > 0 ? Math.round(totalDist / totalAlloc * 100) : 0}%</div>
          <div class="label">Distribution Progress</div>
        </div>
      </div>
    </div>
    ${totalBal > 0 ? `
    <div class="alert alert-success">
      <span class="material-icons">check_circle</span>
      <div>You have <b>${totalBal} Quintal</b> of seed available for distribution to members.
        <a href="#" onclick="App.navigate('soc-member-distribution');return false;" style="color:#1B5E20;font-weight:600;margin-left:8px;">
          → Distribute Now
        </a>
      </div>
    </div>` : `
    <div class="alert alert-warning">
      <span class="material-icons">warning</span>
      <div>No stock available. Please wait for Beej Sangh to dispatch allocated seed.</div>
    </div>`}
    <div class="card">
      <div class="card-header">
        <h3>Stock Details — Crop & Variety Wise</h3>
        <button class="btn btn-primary btn-sm" onclick="App.navigate('soc-member-distribution')">
          <span class="material-icons">agriculture</span> Distribute to Members
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Crop</th><th>Variety</th><th>Season</th>
                <th>Allocated (Qt)</th><th>Distributed (Qt)</th>
                <th>Remaining (Qt)</th><th>Progress</th><th>Received On</th>
              </tr>
            </thead>
            <tbody>
              ${rs.map(r => {
      const bal = r.allocatedQty - r.distributedQty;
      const pct = r.allocatedQty > 0 ? Math.round(r.distributedQty / r.allocatedQty * 100) : 0;
      return `<tr>
                  <td><b>${r.crop}</b></td>
                  <td>${r.variety}</td>
                  <td>${r.season}</td>
                  <td style="color:#1565C0;font-weight:600;">${r.allocatedQty}</td>
                  <td style="color:#2E7D32;font-weight:600;">${r.distributedQty}</td>
                  <td style="color:${bal > 0 ? '#E65100' : '#757575'};font-weight:600;">${bal}</td>
                  <td style="min-width:120px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                      <div style="flex:1;height:8px;background:#E0E0E0;border-radius:4px;overflow:hidden;">
                        <div style="width:${pct}%;height:100%;background:#4CAF50;border-radius:4px;"></div>
                      </div>
                      <span style="font-size:0.75rem;font-weight:600;">${pct}%</span>
                    </div>
                  </td>
                  <td>${r.receivedDate}</td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Stock Balance Timeline</h3></div>
      <div class="card-body">
        ${rs.map(r => {
      const bal = r.allocatedQty - r.distributedQty;
      const pct = r.allocatedQty > 0 ? Math.round(r.distributedQty / r.allocatedQty * 100) : 0;
      return `
          <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-weight:600;font-size:0.88rem;">${r.crop} — ${r.variety}</span>
              <span style="font-size:0.8rem;color:#666;">${r.distributedQty} / ${r.allocatedQty} Qt distributed</span>
            </div>
            <div style="background:#E8F5E9;border-radius:6px;height:14px;overflow:hidden;position:relative;">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#4CAF50,#2E7D32);border-radius:6px;transition:width 0.6s;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;">
              <span style="font-size:0.72rem;color:#4CAF50;">Distributed: ${r.distributedQty} Qt</span>
              <span style="font-size:0.72rem;color:#E65100;">Remaining: ${bal} Qt</span>
            </div>
          </div>`;
    }).join('')}
      </div>
    </div>`;
  },

  // ============================================================
  // MEMBER DISTRIBUTION PAGE
  // ============================================================
  // MEMBER DISTRIBUTION PAGE — 2-step: Select Member → Allot Seed
  // ============================================================
  renderSocMemberDistribution() {
    const rs = this.state.receivedStock;
    const totalAvail = rs.reduce((s, r) => s + (r.allocatedQty - r.distributedQty), 0);
    const popup = this.state.distributionPopup;
    // Step 2: If a member is selected and we're in allot mode, show allotment form
    if (this.state.selectedMemberForDist) {
      return this.renderAllotSeedForm(totalAvail, rs);
    }
    return `
    <div class="page-header">
      <h1>Breeder Seeds Distribution to Member</h1>
      <p>Allocate seed from available stock to registered society members</p>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">inventory_2</span></div>
        <div class="stat-info"><div class="value">${rs.reduce((s, r) => s + r.allocatedQty, 0)} Qt</div><div class="label">Total Allocated</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">storefront</span></div>
        <div class="stat-info"><div class="value">${totalAvail} Qt</div><div class="label">Available to Distribute</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info"><div class="value">${rs.reduce((s, r) => s + r.distributedQty, 0)} Qt</div><div class="label">Already Distributed</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">group</span></div>
        <div class="stat-info"><div class="value">${this.state.members.filter(m => m.status === 'Active').length}</div><div class="label">Active Members</div></div>
      </div>
    </div>
    ${totalAvail <= 0 ? `
    <div class="alert alert-danger">
      <span class="material-icons">error</span>
      <div><b>No stock available.</b> All allocated seed has been distributed or no stock has been received yet.</div>
    </div>` : `
    <div class="alert alert-info">
      <span class="material-icons">info</span>
      <div><b>${totalAvail} Quintal</b> available. Select a member below and enter the quantity to distribute.</div>
    </div>`}
    <div class="search-bar">
      <div class="search-field">
        <label>Member Name</label>
        <input type="text" class="form-control" id="filter-name" placeholder="Search by name..." oninput="App.filterDistMembers()"/>
      </div>
      <div class="search-field">
        <label>Village</label>
        <input type="text" class="form-control" id="filter-village" placeholder="Search by village..." oninput="App.filterDistMembers()"/>
      </div>
      <div class="search-field">
        <label>Status</label>
        <select class="form-control" id="filter-status" onchange="App.filterDistMembers()">
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Distributed">Distributed</option>
        </select>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Select Member to Distribute Seed</h3>
        <span class="badge badge-info">${this.state.members.filter(m => m.status === 'Active').length} Active Members</span>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table id="dist-member-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Category</th>
                <th>Mobile</th>
                <th>District</th>
                <th>Block</th>
                <th>Village</th>
                <th>Pincode</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Already Received</th>
                <th>Eligibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.state.members.filter(m => m.status === 'Active').map(m => {
      const alreadyDist = this.state.distributionRecords
        .filter(r => r.memberId === m.id)
        .reduce((s, r) => s + r.qty, 0);
      const eligible = totalAvail > 0;
      return `<tr id="mrow-${m.id}" style="${alreadyDist > 0 ? 'background:#F1F8E9;' : ''}">
                  <td><b>${m.id}</b></td>
                  <td>
                    <div style="font-size:0.75rem;color:#757575;">${m.father}</div>
                  </td>
                  <td><span class="badge badge-gray">${m.category}</span></td>
                  <td>${m.mobile}</td>
                  <td>${m.district}</td>
                  <td>${m.block}</td>
                  <td>${m.village}</td>
                  <td>${m.pincode || 'N/A'}</td>
                  <td><span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-danger'}">${m.status}</span></td>
                  <td style="font-size:0.8rem;">${m.joiningDate || '2024-01-15'}</td>
                  <td>${alreadyDist > 0
          ? `<span style="color:#2E7D32;font-weight:600;">${alreadyDist} Qt</span>`
          : '<span style="color:#bbb;">—</span>'}</td>
                  <td>${eligible
          ? '<span style="color:#2E7D32;font-weight:600;font-size:0.8rem;">✓ Eligible</span>'
          : '<span style="color:#C62828;font-weight:600;font-size:0.8rem;">✗ No Stock</span>'}</td>
                  <td>
                    <button class="btn btn-primary btn-sm" ${!eligible ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}
                      onclick="App.openDistPopup('${m.id}','${m.name}','${m.village}')">
                      <span class="material-icons" style="font-size:14px;">agriculture</span> Distribute
                    </button>
                  </td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ${popup ? this.renderDistPopup(popup) : ''}`;
  },

  filterDistMembers() {
    const name = (document.getElementById('filter-name')?.value || '').toLowerCase();
    const village = (document.getElementById('filter-village')?.value || '').toLowerCase();
    document.querySelectorAll('#dist-member-table tbody tr').forEach(row => {
      const text = row.innerText.toLowerCase();
      const show = (!name || text.includes(name)) && (!village || text.includes(village));
      row.style.display = show ? '' : 'none';
    });
  },

  openDistPopup(memberId, memberName, village) {
    const rs = this.state.receivedStock;
    if (!rs.length) { this.showToast('No stock available!'); return; }
    this.state.distributionPopup = {
      memberId, memberName, village,
      crop: rs[0].crop,
      variety: rs[0].variety,
      stockId: rs[0].id,
      maxQty: rs[0].allocatedQty - rs[0].distributedQty,
      qty: ''
    };
    this.render();
  },

  renderDistPopup(p) {
    const rs = this.state.receivedStock;
    // Expanded crop list for popup
    const allCrops = [
      { id: 'crop-1', crop: 'Wheat', variety: 'GW-322', availableQty: 150 },
      { id: 'crop-2', crop: 'Paddy (Rice)', variety: 'IR-36', availableQty: 120 },
      { id: 'crop-3', crop: 'Maize', variety: 'DHM-117', availableQty: 180 },
      { id: 'crop-4', crop: 'Bajra (Pearl Millet)', variety: 'HHB-67', availableQty: 90 },
      { id: 'crop-5', crop: 'Jowar (Sorghum)', variety: 'CSH-16', availableQty: 100 },
      { id: 'crop-6', crop: 'Gram (Chickpea)', variety: 'JG-315', availableQty: 130 },
      { id: 'crop-7', crop: 'Pigeon Pea (Arhar)', variety: 'UPAS-120', availableQty: 75 },
      { id: 'crop-8', crop: 'Soybean', variety: 'JS-335', availableQty: 117.5 },
      { id: 'crop-9', crop: 'Groundnut', variety: 'TAG-24', availableQty: 95 },
      { id: 'crop-10', crop: 'Mustard', variety: 'Pusa Bold', availableQty: 110 },
      { id: 'crop-11', crop: 'Sunflower', variety: 'KBSH-1', availableQty: 85 },
      { id: 'crop-12', crop: 'Cotton', variety: 'Suraj (H-777)', availableQty: 200 },
      { id: 'crop-13', crop: 'Sugarcane', variety: 'CO-86032', availableQty: 250 },
      { id: 'crop-14', crop: 'Moong (Green Gram)', variety: 'K-851', availableQty: 70 },
      { id: 'crop-15', crop: 'Urad (Black Gram)', variety: 'T-9', availableQty: 65 },
      { id: 'crop-16', crop: 'Lentil (Masoor)', variety: 'L-4076', availableQty: 80 },
      { id: 'crop-17', crop: 'Barley', variety: 'RD-2035', availableQty: 105 },
      { id: 'crop-18', crop: 'Oat', variety: 'OS-6', availableQty: 60 },
    ];
    // Merge with existing received stock
    const allAvailable = [...rs, ...allCrops.filter(ac => !rs.find(r => r.crop === ac.crop))];

    return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeDistPopup()">
      <div class="modal-box">
        <div class="modal-header">
          <h3>🌾 Distribute Seed to Member</h3>
          <button class="modal-close" onclick="App.closeDistPopup()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:#E8F5E9;border-radius:8px;padding:14px;margin-bottom:18px;display:flex;align-items:center;gap:12px;">
            <div style="width:44px;height:44px;background:#4CAF50;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;font-weight:700;flex-shrink:0;">
              ${p.memberName.charAt(0)}
            </div>
            <div>
              <div style="font-weight:600;font-size:0.95rem;">${p.memberName}</div>
              <div style="font-size:0.8rem;color:#555;">Member ID: ${p.memberId} &nbsp;|&nbsp; Village: ${p.village}</div>
            </div>
          </div>
          <div class="form-group">
            <label>Select Crop *</label>
            <select class="form-control" id="pop-crop" onchange="App.updatePopupStock()">
              ${allAvailable.map(r => {
      const avail = r.allocatedQty ? (r.allocatedQty - r.distributedQty) : (r.availableQty || 0);
      return `<option value="${r.id}" ${r.id === p.stockId ? 'selected' : ''}>${r.crop} — ${r.variety} (Available: ${avail} Qt)</option>`;
    }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Available Stock</label>
            <input type="text" class="form-control" id="pop-avail" value="${p.maxQty} Quintal" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/>
          </div>
          <div class="form-group">
            <label>Demand Quantity by Member (Quintal)</label>
            <input type="number" class="form-control" id="pop-demand-qty" placeholder="Member's demand quantity" 
              min="0.1" step="0.1" value="${(Math.random() * 5 + 2).toFixed(1)}" readonly style="background:#FFF9C4;"/>
            <div style="font-size:0.75rem;color:#757575;margin-top:4px;">This is the quantity requested by the member</div>
          </div>
          <div class="form-group">
            <label>Quantity to Distribute (Quintal) *</label>
            <input type="number" class="form-control" id="pop-qty" placeholder="Enter quantity"
              min="0.1" max="${p.maxQty}" step="0.1" value="${p.qty}"
              oninput="App.validatePopupQty(this.value, ${p.maxQty})"/>
            <div id="pop-qty-msg" style="font-size:0.78rem;margin-top:4px;"></div>
          </div>
          <div class="form-group">
            <label>Distribution Date *</label>
            <input type="date" class="form-control" id="pop-date" value="${new Date().toISOString().split('T')[0]}" readonly style="background:#f5f5f5;"/>
          </div>
          <div class="form-group">
            <label>Remarks (Optional)</label>
            <input type="text" class="form-control" id="pop-remarks" placeholder="Any remarks..."/>
          </div>
          <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#5D4037;">
            <b>⚠ Validation:</b> Quantity cannot exceed available stock of <b>${p.maxQty} Qt</b>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeDistPopup()">Cancel</button>
          <button class="btn btn-primary" onclick="App.confirmDistribution()">
            <span class="material-icons" style="font-size:16px;">check_circle</span> Confirm Distribution
          </button>
        </div>
      </div>
    </div>`;
  },

  validatePopupQty(val, max) {
    const msg = document.getElementById('pop-qty-msg');
    if (!msg) return;
    const v = parseFloat(val);
    if (isNaN(v) || v <= 0) {
      msg.style.color = '#C62828';
      msg.textContent = '⚠ Please enter a valid quantity.';
    } else if (v > max) {
      msg.style.color = '#C62828';
      msg.textContent = `⚠ Exceeds available stock of ${max} Qt.`;
    } else {
      msg.style.color = '#2E7D32';
      msg.textContent = `✓ Valid quantity. ${(max - v).toFixed(1)} Qt will remain after distribution.`;
    }
  },

  updatePopupStock() {
    const sel = document.getElementById('pop-crop');
    if (!sel) return;
    const stockId = sel.value;
    const rs = this.state.receivedStock.find(r => r.id === stockId);
    if (!rs) return;
    const avail = rs.allocatedQty - rs.distributedQty;
    const availEl = document.getElementById('pop-avail');
    const qtyEl = document.getElementById('pop-qty');
    if (availEl) availEl.value = avail + ' Quintal';
    if (qtyEl) qtyEl.max = avail;
    if (this.state.distributionPopup) {
      this.state.distributionPopup.stockId = stockId;
      this.state.distributionPopup.maxQty = avail;
      this.state.distributionPopup.crop = rs.crop;
      this.state.distributionPopup.variety = rs.variety;
    }
  },

  closeDistPopup() {
    this.state.distributionPopup = null;
    this.render();
  },

  confirmDistribution() {
    const p = this.state.distributionPopup;
    if (!p) return;
    const qtyEl = document.getElementById('pop-qty');
    const qty = parseFloat(qtyEl?.value);
    const date = document.getElementById('pop-date')?.value || new Date().toISOString().split('T')[0];
    if (!qty || qty <= 0) { this.showToast('Please enter a valid quantity'); return; }
    if (qty > p.maxQty) { this.showToast('Quantity exceeds available stock!'); return; }

    const stockRow = this.state.receivedStock.find(r => r.id === p.stockId);
    if (stockRow) stockRow.distributedQty = +(stockRow.distributedQty + qty).toFixed(2);

    const rNo = 'RCP-' + String(this.state.distributionRecords.length + 1).padStart(3, '0');
    const record = {
      receiptNo: rNo,
      memberId: p.memberId,
      memberName: p.memberName,
      village: p.village,
      crop: stockRow ? stockRow.crop : p.crop,
      variety: stockRow ? stockRow.variety : p.variety,
      qty,
      date,
      status: 'Completed',
      stockId: p.stockId,
      societyName: 'Rampur Krishi Samiti',
      societyCode: 'SOC-001',
    };
    this.state.distributionRecords.push(record);
    this.state.distributionPopup = null;
    this.state.receiptPopup = record;
    this.render();
  },

  // ============================================================
  // RECEIPT MODAL — shown right after confirmDistribution
  // ============================================================
  renderReceiptModal(rec) {
    return `
    <div class="modal-overlay" onclick="if(event.target===this)App.closeReceipt()">
      <div class="modal-box" style="max-width:520px;">
        <div class="modal-header">
          <h3>🌾 Distribution Receipt</h3>
          <button class="modal-close" onclick="App.closeReceipt()">✕</button>
        </div>
        <div class="modal-body" style="padding:0;">
          <div class="receipt-card">
            <div class="receipt-header">
              <div>
                <div class="rh-title">SEED DISTRIBUTION RECEIPT</div>
                <div class="rh-sub">Beej Sangh Procurement Portal — MP Govt.</div>
              </div>
              <div class="rh-no">${rec.receiptNo}</div>
            </div>
            <div class="receipt-body">
              <div class="receipt-row">
                <span class="rl">Receipt No.</span>
                <span class="rv">${rec.receiptNo}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Date</span>
                <span class="rv">${rec.date}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Member ID</span>
                <span class="rv">${rec.memberId}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Member Name</span>
                <span class="rv">${rec.memberName}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Village</span>
                <span class="rv">${rec.village}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Crop</span>
                <span class="rv">${rec.crop}</span>
              </div>
              <div class="receipt-row">
                <span class="rl">Variety</span>
                <span class="rv">${rec.variety}</span>
              </div>
              <div class="receipt-total">
                <span class="rt-label">Quantity Distributed</span>
                <span class="rt-val">${rec.qty} Quintal</span>
              </div>
            </div>
            <div class="receipt-footer">
              ✓ Distribution Completed &nbsp;|&nbsp; Digitally Generated &nbsp;|&nbsp; No Signature Required
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-gray" onclick="App.closeReceipt()">Close</button>
          <button class="btn btn-outline" onclick="App.showToast('Receipt downloaded!')">
            <span class="material-icons" style="font-size:16px;">download</span> Download PDF
          </button>
          <button class="btn btn-primary" onclick="App.showToast('Sent to printer!')">
            <span class="material-icons" style="font-size:16px;">print</span> Print Receipt
          </button>
        </div>
      </div>
    </div>`;
  },

  closeReceipt() {
    this.state.receiptPopup = null;
    this.navigate('soc-dist-register');
  },

  // ============================================================
  // DISTRIBUTION REGISTER PAGE
  // ============================================================
  renderSocDistRegister() {
    const records = this.state.distributionRecords;
    const receipt = this.state.receiptPopup;
    return `
    <div class="page-header">
      <h1>Distribution Register</h1>
      <p>Complete record of all seed distributions to members</p>
    </div>
    ${receipt ? this.renderReceiptModal(receipt) : ''}
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">receipt_long</span></div>
        <div class="stat-info">
          <div class="value">${records.length}</div>
          <div class="label">Total Distributions</div>
        </div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info">
          <div class="value">${records.filter(r => r.status === 'Completed').length}</div>
          <div class="label">Completed</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">grass</span></div>
        <div class="stat-info">
          <div class="value">${records.reduce((s, r) => s + r.qty, 0).toFixed(1)} Qt</div>
          <div class="label">Total Qty Distributed</div>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">group</span></div>
        <div class="stat-info">
          <div class="value">${new Set(records.map(r => r.memberId)).size}</div>
          <div class="label">Members Served</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>All Distribution Records</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="App.navigate('soc-member-distribution')">
            <span class="material-icons" style="font-size:14px;">add</span> New Distribution
          </button>
          <button class="btn btn-outline btn-sm" onclick="App.showToast('Excel downloaded!')">
            <span class="material-icons" style="font-size:14px;">grid_on</span> Export
          </button>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        ${records.length === 0 ? `
        <div style="padding:48px;text-align:center;color:#9E9E9E;">
          <span class="material-icons" style="font-size:48px;display:block;margin-bottom:12px;">inbox</span>
          <p style="font-size:0.95rem;">No distributions yet.</p>
          <button class="btn btn-primary" style="margin-top:16px;" onclick="App.navigate('soc-member-distribution')">
            <span class="material-icons">agriculture</span> Start Distributing
          </button>
        </div>` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Member Name</th>
                <th>Village</th>
                <th>Crop</th>
                <th>Variety</th>
                <th>Quantity (Qt)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${records.slice().reverse().map(r => `
              <tr>
                <td><b style="color:#2E7D32;">${r.receiptNo}</b></td>
                <td>
                  <div style="font-weight:500;">${r.memberName}</div>
                  <div style="font-size:0.72rem;color:#757575;">${r.memberId}</div>
                </td>
                <td>${r.village}</td>
                <td>${r.crop}</td>
                <td>${r.variety}</td>
                <td><b>${r.qty}</b> Qt</td>
                <td>${r.date}</td>
                <td>
                  <span class="badge ${r.status === 'Completed' ? 'badge-success' : 'badge-warning'}">
                    ${r.status === 'Completed' ? '✓ ' : ''} ${r.status}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="App.viewReceipt('${r.receiptNo}')">
                      <span class="material-icons" style="font-size:14px;">visibility</span> View
                    </button>
                    <button class="btn btn-gray btn-sm" onclick="App.showToast('Printing receipt ${r.receiptNo}...')">
                      <span class="material-icons" style="font-size:14px;">print</span>
                    </button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>`;
  },

  viewReceipt(receiptNo) {
    const r = this.state.distributionRecords.find(x => x.receiptNo === receiptNo);
    if (!r) return;
    this.state.receiptPopup = r;
    this.render();
  },

  // ============================================================
  // RENDER PAGE — override to show receipt modal on top
  // ============================================================
  renderPage() {
    const page = this.state.currentPage;
    // Show receipt success screen after confirmDistribution
    if (this.state.receiptPopup && page === 'soc-member-distribution') {
      return this.renderSocDistRegister();
    }
    switch (page) {
      case 'dashboard': return this.renderDashboard();
      case 'add-member': return this.renderAddMember();
      case 'member-list': return this.renderMemberList();
      case 'member-view': return this.renderMemberView();
      case 'member-edit': return this.renderMemberEdit();
      case 'raise-demand': return this.renderRaiseDemand();
      case 'demand-preview': return this.renderDemandPreview();
      case 'payment': return this.renderPayment();
      case 'demand-history': return this.renderDemandHistory();
      case 'seed-allocation': return this.renderSeedAllocation();
      case 'distribution-register': return this.renderDistributionRegister();
      case 'payment-history': return this.renderPaymentHistory();
      case 'society-reports': return this.renderSocietyReports();
      case 'admin-dashboard': return this.renderAdminDashboard();
      case 'admin-societies': return this.renderAdminSocieties();
      case 'admin-demands': return this.renderAdminDemands();
      case 'demand-review': return this.renderDemandReview();
      case 'admin-stock': return this.renderAdminStock();
      case 'admin-distribution': return this.renderAdminDistribution();
      case 'admin-reports': return this.renderAdminReports();
      case 'profile': return this.renderProfile();
      case 'reset-password': return this.renderResetPasswordPage();
      // ── Admin Distribution Management ──
      case 'admin-society-allocation': return this.renderAdminSocietyAllocation();
      case 'admin-dispatch-orders': return this.renderAdminDispatchOrders();
      case 'admin-dist-tracking': return this.renderAdminDistTracking();
      // ── Society Seed Distribution Workflow ──
      case 'soc-available-stock': return this.renderSocAvailableStock();
      case 'soc-member-distribution': return this.renderSocMemberDistribution();
      case 'soc-dist-register': return this.renderSocDistRegister();
      default: return '<p>Page not found</p>';
    }
  },

  bindEvents() {
    // Events are handled inline via onclick attributes
    // Draw CAPTCHA canvas after login page (or verification pages) is injected into DOM
    if ((this.state.currentPage === 'login' ||
      this.state.currentPage === 'mobile-verify' ||
      this.state.currentPage === 'otp-login' ||
      this.state.currentPage === 'create-credentials') &&
      document.getElementById('captcha-canvas-wrap')) {
      BeejCaptcha.render();
    }

    // Start the resend OTP countdown on the society-registration OTP page
    if (this.state.currentPage === 'otp-verify' &&
      document.getElementById('reg-resend-link') && typeof this.startResendCountdown === 'function') {
      this.startResendCountdown();
    }

    // Start the resend OTP countdown on the OTP-login page (step 2)
    if (this.state.currentPage === 'otp-login' &&
      document.getElementById('otpl-resend-link') && typeof this.otpLoginStartCountdown === 'function') {
      this.otpLoginStartCountdown();
    }

    // Member Onboarding: render CAPTCHA if its wrapper is present and visible
    if (this.state.currentPage === 'add-member') {
      const wrap = document.getElementById('m-captcha-wrap');
      if (wrap && wrap.style.display !== 'none' && document.getElementById('captcha-canvas-wrap')) {
        BeejCaptcha.render();
      }
      // Start the OTP resend countdown when the OTP section is showing
      if (document.getElementById('mo-resend-link') && typeof this.startMemberOtpCountdown === 'function') {
        this.startMemberOtpCountdown();
      }
    }

    // Close user dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const dropdown = document.getElementById('user-dropdown');
      const userChip = event.target.closest('.user-chip');

      if (dropdown && !userChip && dropdown.style.display === 'block') {
        this.closeUserDropdown();
      }
    });
  },

  // ============================================================
  // ADMIN — Society Allocation Screen (Updated Workflow)
  // ============================================================
  renderAdminSocietyAllocation() {
    // Filter approved (fully or partially) demands for allocation
    const approvedDemands = this.state.adminDemands.filter(d => d.approvalStatus === 'Approved' || d.approvalStatus === 'Partially Approved');

    // Calculate statistics
    const totalApproved = approvedDemands.length;
    const totalAllocated = approvedDemands.filter(d => d.allocationStatus === 'Allocated').length;
    const totalPending = approvedDemands.filter(d => !d.allocationStatus || d.allocationStatus === 'Pending').length;
    const totalQty = approvedDemands.reduce((s, d) => s + d.approvedQty, 0);

    const statusColor = s => {
      if (s === 'Allocated') return 'badge-success';
      if (s === 'Hold') return 'badge-warning';
      if (s === 'Cancelled') return 'badge-danger';
      return 'badge-gray';
    };

    return `
    <div class="page-header">
      <h1>Society Allocation</h1>
      <p>Allocate approved seed demands to registered societies</p>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info"><div class="value">${totalApproved}</div><div class="label">Approved Demands</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">pending</span></div>
        <div class="stat-info"><div class="value">${totalPending}</div><div class="label">Pending Allocation</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">assignment_turned_in</span></div>
        <div class="stat-info"><div class="value">${totalAllocated}</div><div class="label">Allocated</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">grass</span></div>
        <div class="stat-info"><div class="value">${totalQty} Qt</div><div class="label">Total Approved Qty</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Approved Demands - Ready for Allocation</h3>
        <button class="btn btn-primary btn-sm" onclick="App.navigate('admin-dispatch-orders')">
          <span class="material-icons" style="font-size:14px;">local_shipping</span> View Dispatch Orders
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        ${approvedDemands.length === 0 ? `
        <div style="padding:40px;text-align:center;color:#757575;">
          <span class="material-icons" style="font-size:48px;color:#BDBDBD;">inbox</span>
          <p style="margin-top:10px;">No approved demands available for allocation</p>
        </div>` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Demand ID</th><th>Society</th><th>Crop / Variety</th>
                <th>Approved Qty</th><th>Available Stock</th>
                <th>Allocation Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${approvedDemands.map(dem => {
      const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
      const availStock = stk ? (stk.available - stk.allocated) : 0;
      const allocStatus = dem.allocationStatus || 'Pending';
      return `
                <tr>
                  <td>
                    <b>${dem.id}</b>
                    <div style="font-size:0.7rem;color:#9E9E9E;">${dem.date}</div>
                  </td>
                  <td>
                    <div style="font-weight:500;">${dem.society}</div>
                    <div style="font-size:0.72rem;color:#757575;">${dem.socCode} | ${dem.season}</div>
                  </td>
                  <td>
                    ${dem.crop}
                    <div style="font-size:0.72rem;color:#9E9E9E;">${dem.variety}</div>
                  </td>
                  <td style="font-weight:600;color:#2E7D32;">${dem.approvedQty} Qt</td>
                  <td style="color:${availStock >= dem.approvedQty ? '#2E7D32' : availStock > 0 ? '#E65100' : '#C62828'};font-weight:600;">
                    ${availStock} Qt
                  </td>
                  <td><span class="badge ${statusColor(allocStatus)}">${allocStatus}</span></td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-info btn-sm" onclick="App.openDemandReview('${dem.id}')" title="View Details">
                        <span class="material-icons" style="font-size:13px;">visibility</span>
                      </button>
                      ${allocStatus === 'Pending' || !allocStatus ? `
                      <button class="btn btn-success btn-sm" onclick="App.allocateDemand('${dem.id}')" title="Allocate">
                        <span class="material-icons" style="font-size:13px;">assignment_turned_in</span>
                      </button>
                      <button class="btn btn-warning btn-sm" onclick="App.holdAllocation('${dem.id}')" title="Hold">
                        <span class="material-icons" style="font-size:13px;">pause</span>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="App.cancelAllocation('${dem.id}')" title="Cancel">
                        <span class="material-icons" style="font-size:13px;">close</span>
                      </button>` : ''}
                      ${allocStatus === 'Allocated' ? `
                      <button class="btn btn-primary btn-sm" onclick="App.openDispatchForm('${dem.id}')" title="Generate Dispatch">
                        <span class="material-icons" style="font-size:13px;">local_shipping</span> Dispatch
                      </button>` : ''}
                      ${allocStatus === 'Dispatched' ? `
                      <span class="badge badge-info" style="align-self:center;">Dispatched</span>` : ''}
                      ${allocStatus === 'Hold' ? `
                      <button class="btn btn-success btn-sm" onclick="App.resumeAllocation('${dem.id}')" title="Resume">
                        <span class="material-icons" style="font-size:13px;">play_arrow</span>
                      </button>` : ''}
                    </div>
                  </td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>
    ${this.state.dispatchFormDemandId ? this.renderDispatchFormModal() : ''}`;
  },

  // ── Dispatch form (opens after Allocate) ──
  openDispatchForm(demandId) {
    this.state.dispatchFormDemandId = demandId;
    this.render();
  },
  closeDispatchForm() {
    this.state.dispatchFormDemandId = null;
    this.render();
  },
  renderDispatchFormModal() {
    const dem = this.state.adminDemands.find(d => d.id === this.state.dispatchFormDemandId);
    if (!dem) return '';
    const today = new Date().toISOString().split('T')[0];
    return `
    <div class="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;" onclick="if(event.target===this)App.closeDispatchForm()">
      <div class="modal-box" style="background:#fff;border-radius:12px;max-width:520px;width:100%;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;color:#fff;font-size:1.05rem;">Generate Dispatch Order</h3>
          <button onclick="App.closeDispatchForm()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">&times;</button>
        </div>
        <div style="padding:22px;">
          <div class="form-grid">
            <div class="form-group"><label>Society</label><input class="form-control" value="${dem.society}" readonly style="background:#f5f5f5;"></div>
            <div class="form-group"><label>Crop / Variety</label><input class="form-control" value="${dem.crop} / ${dem.variety}" readonly style="background:#f5f5f5;"></div>
            <div class="form-group"><label>Quantity (Qt)</label><input class="form-control" value="${dem.approvedQty}" readonly style="background:#f5f5f5;"></div>
            <div class="form-group"><label>Dispatch Date <span style="color:#F44336">*</span></label><input type="date" class="form-control" id="df-date" value="${today}"></div>
            <div class="form-group"><label>Vehicle Number <span style="color:#F44336">*</span></label><input class="form-control" id="df-vehicle" placeholder="MP-XX-XX-0000"></div>
            <div class="form-group"><label>Driver Name</label><input class="form-control" id="df-driver" placeholder="Driver name"></div>
            <div class="form-group" style="grid-column:1/-1;"><label>Remarks</label><textarea class="form-control" id="df-remarks" rows="2" placeholder="Optional remarks"></textarea></div>
          </div>
          <div id="df-err" style="display:none;color:#F44336;font-size:0.8rem;margin-top:6px;"></div>
        </div>
        <div style="padding:0 22px 22px;display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-gray" onclick="App.closeDispatchForm()">Cancel</button>
          <button class="btn btn-primary" onclick="App.confirmDispatchForm('${dem.id}')"><span class="material-icons" style="font-size:16px;">local_shipping</span> Create Dispatch Order</button>
        </div>
      </div>
    </div>`;
  },
  confirmDispatchForm(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem) return;
    const g = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
    const date = g('df-date'), vehicle = g('df-vehicle');
    const err = document.getElementById('df-err');
    if (!date || !vehicle) {
      if (err) { err.textContent = 'Dispatch Date and Vehicle Number are required.'; err.style.display = 'block'; }
      return;
    }
    // Prevent duplicate
    let existing = this.state.dispatchOrders.find(d => d.demandId === demandId);
    if (!existing) {
      const newId = 'DO-2024-00' + (this.state.dispatchOrders.length + 1);
      this.state.dispatchOrders.push({
        id: newId,
        society: dem.society,
        crop: dem.crop,
        variety: dem.variety,
        qty: dem.approvedQty,
        dispatchDate: date,
        vehicleNo: vehicle,
        driver: g('df-driver'),
        remarks: g('df-remarks'),
        status: 'Dispatched',
        demandId: demandId,
      });
      dem.dispatchOrderId = newId;
    }
    dem.allocationStatus = 'Dispatched';
    this.state.dispatchFormDemandId = null;
    this.showToast(`Dispatch order created for ${dem.society}.`);
    this.navigate('admin-dispatch-orders');
  },

  // Allocate approved demand
  allocateDemand(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem) return;

    // Check stock availability
    const stk = this.state.stock.find(s => s.crop === dem.crop && s.variety === dem.variety);
    if (!stk) {
      this.showToast('❌ Stock not found for this crop/variety');
      return;
    }

    const availStock = stk.available - stk.allocated;
    if (availStock < dem.approvedQty) {
      this.showToast(`❌ Insufficient stock! Available: ${availStock} Qt, Required: ${dem.approvedQty} Qt`);
      return;
    }

    // Update allocation
    dem.allocationStatus = 'Allocated';
    dem.allocatedDate = new Date().toISOString().split('T')[0];

    // Update stock allocation
    stk.allocated += dem.approvedQty;

    this.showToast(`✓ Allocated ${dem.approvedQty} Qt to ${dem.society}. Now generate a dispatch.`);
    this.render();
  },

  // Hold allocation with reason
  holdAllocation(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem) return;

    const reason = prompt('Enter reason for holding this allocation:');
    if (!reason || reason.trim() === '') {
      this.showToast('Hold reason is required');
      return;
    }

    dem.allocationStatus = 'Hold';
    dem.holdReason = reason.trim();
    dem.holdDate = new Date().toISOString().split('T')[0];

    this.showToast(`⏸ Allocation placed on hold for ${dem.society}`);
    this.render();
  },

  // Resume held allocation
  resumeAllocation(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem) return;

    dem.allocationStatus = 'Pending';
    delete dem.holdReason;
    delete dem.holdDate;

    this.showToast(`▶ Allocation resumed for ${dem.society}`);
    this.render();
  },

  // Cancel/Reject allocation
  cancelAllocation(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem) return;

    const reason = prompt('Enter reason for cancelling this allocation:');
    if (!reason || reason.trim() === '') {
      this.showToast('Cancellation reason is required');
      return;
    }

    dem.allocationStatus = 'Cancelled';
    dem.cancelReason = reason.trim();
    dem.cancelDate = new Date().toISOString().split('T')[0];

    this.showToast(`✕ Allocation cancelled for ${dem.society}`);
    this.render();
  },

  // Generate dispatch order from allocated demand
  generateDispatchFromDemand(demandId) {
    const dem = this.state.adminDemands.find(d => d.id === demandId);
    if (!dem || dem.allocationStatus !== 'Allocated') {
      this.showToast('❌ Demand not allocated yet');
      return;
    }

    // Check if dispatch already exists
    const existing = this.state.dispatchOrders.find(d => d.demandId === demandId);
    if (existing) {
      this.showToast('Dispatch order already exists!');
      this.navigate('admin-dispatch-orders');
      return;
    }

    const newId = 'DO-2024-00' + (this.state.dispatchOrders.length + 1);
    this.state.dispatchOrders.push({
      id: newId,
      society: dem.society,
      crop: dem.crop,
      variety: dem.variety,
      qty: dem.approvedQty,
      dispatchDate: new Date().toISOString().split('T')[0],
      vehicleNo: '',
      status: 'Pending',
      demandId: demandId,
    });

    dem.allocationStatus = 'Dispatched';
    dem.dispatchOrderId = newId;

    this.showToast(`✓ Dispatch order ${newId} created for ${dem.society}`);
    this.navigate('admin-dispatch-orders');
  },

  // ============================================================
  // ADMIN — Dispatch Orders Screen
  // ============================================================
  renderAdminDispatchOrders() {
    const orders = this.state.dispatchOrders;
    const statusCls = s => s === 'Received' ? 'dsp-received' : s === 'Dispatched' ? 'dsp-dispatched' : s === 'Allocated' ? 'dsp-dispatched' : 'dsp-pending';
    return `
    <div class="page-header">
      <h1>Dispatch Orders</h1>
      <p>Manage and track seed dispatch to societies</p>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));margin-bottom:20px;">
      <div class="stat-card"><div class="stat-icon"><span class="material-icons">receipt_long</span></div>
        <div class="stat-info"><div class="value">${orders.length}</div><div class="label">Total Orders</div></div></div>
      <div class="stat-card orange"><div class="stat-icon"><span class="material-icons">pending</span></div>
        <div class="stat-info"><div class="value">${orders.filter(o => o.status === 'Pending' || o.status === 'Allocated').length}</div><div class="label">Allocated / Pending</div></div></div>
      <div class="stat-card blue"><div class="stat-icon"><span class="material-icons">local_shipping</span></div>
        <div class="stat-info"><div class="value">${orders.filter(o => o.status === 'Dispatched').length}</div><div class="label">Dispatched</div></div></div>
      <div class="stat-card teal"><div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info"><div class="value">${orders.filter(o => o.status === 'Received').length}</div><div class="label">Received</div></div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Dispatch Order List</h3>
        <button class="btn btn-outline btn-sm" onclick="App.navigate('admin-society-allocation')">
          ← Back to Allocation
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        ${orders.length === 0 ? `
        <div style="padding:48px;text-align:center;color:#9E9E9E;">
          <span class="material-icons" style="font-size:48px;display:block;margin-bottom:12px;">local_shipping</span>
          <p>No dispatch orders yet.</p>
          <button class="btn btn-primary" style="margin-top:12px;" onclick="App.navigate('admin-society-allocation')">
            Create Allocation First
          </button>
        </div>` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dispatch Order No.</th><th>Society Name</th><th>Crop / Variety</th>
                <th>Quantity (Qt)</th><th>Dispatch Date</th>
                <th>Vehicle No.</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
              <tr>
                <td><b style="color:#2E7D32;">${o.id}</b></td>
                <td>${o.society}</td>
                <td>${o.crop} / ${o.variety}</td>
                <td style="font-weight:600;">${o.qty} Qt</td>
                <td>${o.dispatchDate}</td>
                <td>
                  ${(o.status === 'Pending' || o.status === 'Allocated')
        ? `<input type="text" class="form-control vehicle-input" style="width:140px;padding:6px;"
                        id="veh-${o.id}" placeholder="MP-XX-XX-0000" value="${o.vehicleNo}"/>`
        : `<b>${o.vehicleNo || '—'}</b>`}
                </td>
                <td><span class="dispatch-status-pill ${statusCls(o.status)}">${o.status}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="App.viewDispatchOrder('${o.id}')" title="View & Download">
                      <span class="material-icons" style="font-size:13px;">visibility</span>
                    </button>
                    ${(o.status === 'Pending' || o.status === 'Allocated') ? `
                    <button class="btn btn-primary btn-sm" onclick="App.dispatchOrder('${o.id}')" title="Dispatch">
                      <span class="material-icons" style="font-size:13px;">local_shipping</span> Dispatch
                    </button>` : ''}
                    ${o.status === 'Dispatched' ? `
                    <button class="btn btn-success btn-sm" onclick="App.markReceived('${o.id}')" title="Mark Received">
                      <span class="material-icons" style="font-size:13px;">check</span>
                    </button>` : ''}
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>`;
  },

  dispatchOrder(orderId) {
    const o = this.state.dispatchOrders.find(x => x.id === orderId);
    if (!o) return;
    const vehEl = document.getElementById(`veh-${orderId}`);
    const veh = vehEl?.value?.trim();
    if (!veh) { this.showToast('Please enter vehicle number before dispatching'); return; }
    o.vehicleNo = veh; o.status = 'Dispatched';
    o.dispatchDate = new Date().toISOString().split('T')[0];
    // Sync the linked demand's allocation status to Dispatched
    if (o.demandId) {
      const dem = this.state.adminDemands.find(d => d.id === o.demandId);
      if (dem) dem.allocationStatus = 'Dispatched';
    }
    this.showToast(`Order ${orderId} dispatched with vehicle ${veh}`);
    this.render();
  },

  markReceived(orderId) {
    const o = this.state.dispatchOrders.find(x => x.id === orderId);
    if (!o) return;
    o.status = 'Received';
    // Auto-add to society's received stock
    const existing = this.state.receivedStock.find(r => r.dispatchOrderId === orderId);
    if (!existing) {
      this.state.receivedStock.push({
        id: 'RS-' + String(this.state.receivedStock.length + 1).padStart(3, '0'),
        crop: o.crop, variety: o.variety,
        allocatedQty: o.qty, distributedQty: 0,
        season: 'Rabi', receivedDate: new Date().toISOString().split('T')[0],
        dispatchOrderId: orderId,
      });
    }
    this.showToast(`Order ${orderId} marked as Received by society`);
    this.render();
  },

  // View Dispatch Order with Download Option
  viewDispatchOrder(orderId) {
    const order = this.state.dispatchOrders.find(o => o.id === orderId);
    if (!order) return;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';

    modal.innerHTML = `
      <div class="modal-content" style="background:white;border-radius:12px;padding:0;width:90%;max-width:700px;max-height:90vh;overflow:auto;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
        <div class="modal-header" style="padding:24px;border-bottom:1px solid #E0E0E0;display:flex;justify-content:space-between;align-items:center;background:#2E7D32;color:white;border-radius:12px 12px 0 0;">
          <div>
            <h2 style="margin:0;font-size:1.5rem;color:white;">Dispatch Order Details</h2>
            <p style="margin:4px 0 0 0;font-size:0.9rem;opacity:0.9;">Order No: ${order.id}</p>
          </div>
          <button onclick="this.closest('.modal-overlay').remove()" style="background:none;border:none;color:white;font-size:28px;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
            ×
          </button>
        </div>
        
        <div class="modal-body" style="padding:24px;">
          <div class="order-details" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Society Name</div>
              <div style="font-size:1.1rem;font-weight:500;">${order.society}</div>
            </div>
            
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Status</div>
              <div><span class="badge ${order.status === 'Received' ? 'badge-success' : order.status === 'Dispatched' ? 'badge-info' : 'badge-warning'}">${order.status}</span></div>
            </div>
            
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Crop / Variety</div>
              <div style="font-size:1rem;font-weight:500;">${order.crop} / ${order.variety}</div>
            </div>
            
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Quantity</div>
              <div style="font-size:1.1rem;font-weight:600;color:#2E7D32;">${order.qty} Quintal</div>
            </div>
            
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Dispatch Date</div>
              <div style="font-size:1rem;">${order.dispatchDate}</div>
            </div>
            
            <div class="detail-group">
              <div style="font-size:0.75rem;color:#757575;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Vehicle Number</div>
              <div style="font-size:1rem;font-weight:500;color:${order.vehicleNo ? '#1565C0' : '#9E9E9E'};">${order.vehicleNo || 'Not Assigned'}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #E0E0E0;padding-top:20px;margin-top:20px;">
            <div style="display:flex;gap:12px;justify-content:flex-end;">
              <button onclick="App.downloadDispatchOrder('${order.id}')" class="btn btn-success" style="display:flex;align-items:center;gap:8px;">
                <span class="material-icons" style="font-size:18px;">download</span>
                Download Order
              </button>
              <button onclick="App.printDispatchOrder('${order.id}')" class="btn btn-primary" style="display:flex;align-items:center;gap:8px;">
                <span class="material-icons" style="font-size:18px;">print</span>
                Print
              </button>
              <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  // Download Dispatch Order as PDF/Text
  downloadDispatchOrder(orderId) {
    const order = this.state.dispatchOrders.find(o => o.id === orderId);
    if (!order) return;

    // Create download content
    const content = `
═══════════════════════════════════════════════════════════
           BEEJ SANGH MADHYA PRADESH
           DISPATCH ORDER DOCUMENT
═══════════════════════════════════════════════════════════

Order Number    : ${order.id}
Date            : ${order.dispatchDate}
Status          : ${order.status}

───────────────────────────────────────────────────────────
SOCIETY DETAILS
───────────────────────────────────────────────────────────
Society Name    : ${order.society}

───────────────────────────────────────────────────────────
SEED DETAILS
───────────────────────────────────────────────────────────
Crop            : ${order.crop}
Variety         : ${order.variety}
Quantity        : ${order.qty} Quintal

───────────────────────────────────────────────────────────
DISPATCH DETAILS
───────────────────────────────────────────────────────────
Vehicle Number  : ${order.vehicleNo || 'Not Assigned'}
Dispatch Date   : ${order.dispatchDate}

───────────────────────────────────────────────────────────
AUTHORIZED SIGNATURES
───────────────────────────────────────────────────────────

Dispatched By   : _____________________
                  Beej Sangh Admin

Received By     : _____________________
                  Society Representative

Date & Time     : _____________________

───────────────────────────────────────────────────────────
Note: This is a computer-generated document.
      For any queries, contact Beej Sangh MP Office.
═══════════════════════════════════════════════════════════
`;

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dispatch_Order_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`✓ Dispatch order ${order.id} downloaded successfully`);
  },

  // Print Dispatch Order
  printDispatchOrder(orderId) {
    const order = this.state.dispatchOrders.find(o => o.id === orderId);
    if (!order) return;

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dispatch Order - ${order.id}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header h2 { margin: 10px 0; font-size: 18px; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
          .detail-row { display: flex; margin: 8px 0; }
          .detail-label { width: 180px; font-weight: bold; }
          .detail-value { flex: 1; }
          .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; }
          .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 60px; padding-top: 10px; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BEEJ SANGH MADHYA PRADESH</h1>
          <h2>DISPATCH ORDER</h2>
          <p>Order No: ${order.id}</p>
        </div>
        
        <div class="section">
          <div class="section-title">ORDER DETAILS</div>
          <div class="detail-row">
            <div class="detail-label">Order Number:</div>
            <div class="detail-value">${order.id}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Dispatch Date:</div>
            <div class="detail-value">${order.dispatchDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value">${order.status}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">SOCIETY DETAILS</div>
          <div class="detail-row">
            <div class="detail-label">Society Name:</div>
            <div class="detail-value">${order.society}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">SEED DETAILS</div>
          <div class="detail-row">
            <div class="detail-label">Crop:</div>
            <div class="detail-value">${order.crop}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Variety:</div>
            <div class="detail-value">${order.variety}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Quantity:</div>
            <div class="detail-value">${order.qty} Quintal</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">DISPATCH DETAILS</div>
          <div class="detail-row">
            <div class="detail-label">Vehicle Number:</div>
            <div class="detail-value">${order.vehicleNo || 'Not Assigned'}</div>
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Dispatched By</div>
            <div>Beej Sangh Admin</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Received By</div>
            <div>Society Representative</div>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
          This is a computer-generated document. For queries, contact Beej Sangh MP Office.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);

    this.showToast('✓ Print dialog opened');
  },

  // ============================================================
  // ADMIN — Distribution Tracking Screen
  // ============================================================
  renderAdminDistTracking() {
    const allocs = this.state.societyAllocations;
    const orders = this.state.dispatchOrders;
    const records = this.state.distributionRecords;
    return `
    <div class="page-header">
      <h1>Distribution Tracking</h1>
      <p>End-to-end tracking of seed flow from Beej Sangh to members</p>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-bottom:20px;">
      <div class="stat-card blue">
        <div class="stat-icon"><span class="material-icons">assignment</span></div>
        <div class="stat-info"><div class="value">${allocs.length}</div><div class="label">Allocations Made</div></div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><span class="material-icons">local_shipping</span></div>
        <div class="stat-info"><div class="value">${orders.filter(o => o.status === 'Dispatched' || o.status === 'Received').length}</div><div class="label">Dispatched</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">store</span></div>
        <div class="stat-info"><div class="value">${orders.filter(o => o.status === 'Received').length}</div><div class="label">Received by Societies</div></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><span class="material-icons">people</span></div>
        <div class="stat-info"><div class="value">${records.length}</div><div class="label">Member Distributions</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Flow Status — Society Wise</h3></div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Society</th><th>Crop/Variety</th>
                <th>Allocated</th><th>Dispatch Status</th>
                <th>Received</th><th>Distributed to Members</th><th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${allocs.map(a => {
      const order = orders.find(o => o.allocId === a.id);
      const rs = this.state.receivedStock.find(r => order && r.dispatchOrderId === order.id);
      const distQty = rs ? rs.distributedQty : 0;
      const bal = rs ? (rs.allocatedQty - rs.distributedQty) : a.allocatedQty;
      const pct = a.allocatedQty > 0 ? Math.round(distQty / a.allocatedQty * 100) : 0;
      return `<tr>
                  <td><b>${a.society}</b><div style="font-size:0.72rem;color:#757575;">${a.socCode}</div></td>
                  <td>${a.crop} / ${a.variety}</td>
                  <td>${a.allocatedQty} Qt</td>
                  <td>
                    <span class="dispatch-status-pill ${order ? order.status === 'Received' ? 'dsp-received' : order.status === 'Dispatched' ? 'dsp-dispatched' : 'dsp-pending' : 'dsp-pending'}">
                      ${order ? order.status : 'Not Dispatched'}
                    </span>
                  </td>
                  <td>${rs ? rs.allocatedQty + ' Qt' : '—'}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div style="flex:1;min-width:80px;height:8px;background:#E0E0E0;border-radius:4px;overflow:hidden;">
                        <div style="width:${pct}%;height:100%;background:#4CAF50;border-radius:4px;"></div>
                      </div>
                      <span style="font-size:0.78rem;font-weight:600;">${distQty} Qt (${pct}%)</span>
                    </div>
                  </td>
                  <td style="font-weight:600;color:${bal > 0 ? '#E65100' : '#2E7D32'};">${bal} Qt</td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Member Distribution Log</h3></div>
      <div class="card-body" style="padding:0;">
        ${records.length === 0
        ? `<div style="padding:40px;text-align:center;color:#9E9E9E;"><span class="material-icons" style="font-size:40px;display:block;margin-bottom:8px;">inbox</span><p>No member distributions yet.</p></div>`
        : `<div class="table-wrap"><table>
              <thead><tr><th>Receipt No.</th><th>Society</th><th>Member</th><th>Crop</th><th>Qty (Qt)</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                ${records.slice().reverse().map(r => `<tr>
                  <td><b>${r.receiptNo}</b></td>
                  <td>${r.societyName}</td>
                  <td>${r.memberName}<div style="font-size:0.72rem;color:#757575;">${r.village}</div></td>
                  <td>${r.crop} / ${r.variety}</td>
                  <td style="font-weight:600;">${r.qty}</td>
                  <td>${r.date}</td>
                  <td><span class="badge badge-success">✓ ${r.status}</span></td>
                </tr>`).join('')}
              </tbody>
            </table></div>`}
      </div>
    </div>`;
  },
};

// Initialize
document.addEventListener('DOMContentLoaded', () => App.init());
