/**
 * society-registration.js
 * ─────────────────────────────────────────────────────────────
 * Society Registration Module — Beej Sangh Procurement Portal
 *
 * ARCHITECTURE NOTES
 * ──────────────────
 * • Follows the exact same pattern as modules.js (IIFE patches).
 * • Does NOT modify app.js, styles.css, index.html, or modules.js.
 * • All state is namespaced under App.state.socReg* / App.state.regSocieties.
 * • All methods are added directly onto App (no class, no module system).
 * • Routing, sidebar, and header titles are extended via the same
 *   monkey-patch decorators already used in modules.js.
 * • Validation logic lives in SocRegValidation (separated per spec).
 * • Service/API layer lives in SocRegService (separated per spec).
 *
 * FILES ADDED
 * ───────────
 *   society-registration.js   ← this file  (new)
 *
 * FILES MODIFIED (minimum touch)
 * ───────────────────────────────
 *   index.html                ← <script src="society-registration.js"> added
 *   (modules.js NOT touched)
 *
 * PAGES / ROUTES
 * ──────────────
 *   admin-soc-reg             → Dashboard / entry point
 *   admin-soc-reg-list        → Society Registration List
 *   admin-soc-reg-add         → New Registration Form
 *   admin-soc-reg-edit        → Edit Form
 *   admin-soc-reg-view        → View (read-only)
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — SERVICE LAYER  (SocRegService)
// Simulates backend API calls.  Replace the internals with real
// fetch() / axios calls when a backend is available.
// ═══════════════════════════════════════════════════════════════
const SocRegService = (function () {

  /** Generate auto Society ID  */
  function _nextSocietyId(list) {
    const nums = list
      .map(s => parseInt((s.societyId || '').replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 1000;
    return 'SREG-' + String(max + 1).padStart(4, '0');
  }

  /** Simulate async save — returns { success, data, error } */
  function save(formData, existingList, editId) {
    // Uniqueness checks (simulated backend rule)
    const others = editId
      ? existingList.filter(s => s.societyId !== editId)
      : existingList;

    if (others.some(s => s.societyCode === formData.societyCode)) {
      return { success: false, error: `Society Code "${formData.societyCode}" is already registered.` };
    }
    if (others.some(s => s.registrationNumber === formData.registrationNumber)) {
      return { success: false, error: `Registration Number "${formData.registrationNumber}" already exists.` };
    }

    const now = new Date().toISOString().slice(0, 10);
    if (editId) {
      const record = { ...formData, societyId: editId, updatedAt: now };
      return { success: true, data: record, mode: 'edit' };
    }
    const record = {
      ...formData,
      societyId: _nextSocietyId(existingList),
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
    return { success: true, data: record, mode: 'add' };
  }

  /** Soft-delete: mark deleted, do not splice */
  function softDelete(id, list) {
    const item = list.find(s => s.societyId === id);
    if (!item) return { success: false, error: 'Record not found.' };
    item.deleted = true;
    item.status = 'Deleted';
    item.updatedAt = new Date().toISOString().slice(0, 10);
    return { success: true };
  }

  return { save, softDelete };
})();


// ═══════════════════════════════════════════════════════════════
// SECTION 2 — VALIDATION LAYER  (SocRegValidation)
// ═══════════════════════════════════════════════════════════════
const SocRegValidation = (function () {

  const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const MOBILE_RE = /^\d{10}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PIN_RE = /^\d{6}$/;

  /**
   * Validate a complete form data object.
   * Returns { valid: true } or { valid: false, errors: { fieldId: 'message' } }
   */
  function validate(d) {
    const errors = {};

    // ── Mandatory text fields ──────────────────────────────────
    if (!d.societyName?.trim()) errors['sr-society-name'] = 'Society Name is required.';
    if (!d.societyCode?.trim()) errors['sr-society-code'] = 'Society Code is required.';
    if (!d.registrationNumber?.trim()) errors['sr-reg-number'] = 'Registration Number is required.';
    if (!d.registrationDate) errors['sr-reg-date'] = 'Registration Date is required.';
    if (!d.district?.trim()) errors['sr-district'] = 'District is required.';
    if (!d.block?.trim()) errors['sr-block'] = 'Block is required.';
    if (!d.societyHeadName?.trim()) errors['sr-head-name'] = 'Society Head Name is required.';
    if (!d.mobileNumber?.trim()) errors['sr-mobile'] = 'Mobile Number is required.';

    // ── Format checks ──────────────────────────────────────────
    if (d.mobileNumber && !MOBILE_RE.test(d.mobileNumber.trim())) {
      errors['sr-mobile'] = 'Mobile Number must be exactly 10 digits.';
    }
    if (d.emailId?.trim() && !EMAIL_RE.test(d.emailId.trim())) {
      errors['sr-email'] = 'Enter a valid Email address.';
    }
    if (d.pinCode?.trim() && !PIN_RE.test(d.pinCode.trim())) {
      errors['sr-pin'] = 'PIN Code must be exactly 6 digits.';
    }
    if (d.ifscCode?.trim() && !IFSC_RE.test(d.ifscCode.trim().toUpperCase())) {
      errors['sr-ifsc'] = 'Invalid IFSC format (e.g. SBIN0001234).';
    }

    const hasErrors = Object.keys(errors).length > 0;
    return hasErrors ? { valid: false, errors } : { valid: true, errors: {} };
  }

  /**
   * Apply inline error styles to form fields.
   * Pass in the errors object returned by validate().
   */
  function applyErrors(errors) {
    // Clear previous
    document.querySelectorAll('.sr-field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-control.sr-error')
      .forEach(el => el.classList.remove('sr-error'));

    Object.entries(errors).forEach(([id, msg]) => {
      const field = document.getElementById(id);
      if (!field) return;
      field.classList.add('sr-error');
      const errEl = document.createElement('div');
      errEl.className = 'sr-field-error';
      errEl.textContent = msg;
      field.parentNode.insertBefore(errEl, field.nextSibling);
    });

    // Focus first errored field
    const firstId = Object.keys(errors)[0];
    if (firstId) document.getElementById(firstId)?.focus();
  }

  function clearErrors() {
    document.querySelectorAll('.sr-field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-control.sr-error')
      .forEach(el => el.classList.remove('sr-error'));
  }

  return { validate, applyErrors, clearErrors, IFSC_RE, MOBILE_RE, EMAIL_RE };
})();


// ═══════════════════════════════════════════════════════════════
// SECTION 3 — STATE INJECTION
// Follows the exact injectState() IIFE pattern from modules.js
// ═══════════════════════════════════════════════════════════════
(function injectSocRegState() {
  // Seed data — mirrors the existing App.state.societies shape
  // plus the extended fields required by the registration form.
  App.state.regSocieties = [
    {
      societyId: 'SREG-1001',
      societyName: 'Rampur Krishi Samiti',
      societyCode: 'SOC-001',
      registrationNumber: 'REG-MP-2020-001',
      registrationDate: '2020-04-15',
      societyType: 'Farmers Cooperative',
      district: 'Chhindwara',
      block: 'Patan',
      village: 'Rampur',
      address: 'Main Road, Rampur, Patan',
      pinCode: '480001',
      societyHeadName: 'Ramesh Kumar Verma',
      mobileNumber: '9876543210',
      emailId: 'ramesh.rampur@gmail.com',
      bankName: 'State Bank of India',
      branch: 'Patan Branch',
      ifscCode: 'SBIN0001234',
      accountNumber: '12345678901',
      status: 'Active',
      remarks: 'Pioneer society in the region',
      createdAt: '2020-04-15',
      updatedAt: '2024-10-01',
      deleted: false,
    },
    {
      societyId: 'SREG-1002',
      societyName: 'Sehora Kisan Sabha',
      societyCode: 'SOC-002',
      registrationNumber: 'REG-MP-2021-007',
      registrationDate: '2021-06-10',
      societyType: 'Seed Production Society',
      district: 'Seoni',
      block: 'Sehora',
      village: 'Sehora',
      address: 'Gram Panchayat Building, Sehora',
      pinCode: '480661',
      societyHeadName: 'Sunita Devi',
      mobileNumber: '9823401234',
      emailId: '',
      bankName: 'Bank of India',
      branch: 'Seoni Branch',
      ifscCode: 'BKID0008821',
      accountNumber: '98765432101',
      status: 'Active',
      remarks: '',
      createdAt: '2021-06-10',
      updatedAt: '2024-09-20',
      deleted: false,
    },
    {
      societyId: 'SREG-1003',
      societyName: 'Bargaon Beej Samiti',
      societyCode: 'SOC-003',
      registrationNumber: 'REG-MP-2022-015',
      registrationDate: '2022-03-22',
      societyType: 'Farmers Cooperative',
      district: 'Narsinghpur',
      block: 'Harrai',
      village: 'Bargaon',
      address: 'Near Primary School, Bargaon',
      pinCode: '487661',
      societyHeadName: 'Dinesh Patel',
      mobileNumber: '9765432109',
      emailId: 'bargaon.beej@mp.gov.in',
      bankName: 'Punjab National Bank',
      branch: 'Narsinghpur Branch',
      ifscCode: 'PUNB0123456',
      accountNumber: '11223344556',
      status: 'Pending',
      remarks: 'Documents pending verification',
      createdAt: '2022-03-22',
      updatedAt: '2024-11-10',
      deleted: false,
    },
  ];

  // UI state for this module
  App.state.socRegView = 'list';   // 'list' | 'add' | 'edit' | 'view'
  App.state.socRegSelectedId = null;     // societyId of selected record
  App.state.socRegFilter = { district: '', status: '', search: '' };
  App.state.socRegFormLoading = false;
  App.state.socRegFormError = null;
  App.state.socRegSuccessMsg = null;
})();


// ═══════════════════════════════════════════════════════════════
// SECTION 4 — EXTEND ADMIN SIDEBAR
// Patches the sidebar that modules.js already patched, adding the
// Society Registration item under a new "Registration" section.
// ═══════════════════════════════════════════════════════════════
// DISABLED: Society Registration removed from Admin sidebar (bottom section)
/*
(function patchSidebarForSocReg() {
  const _prev = App.renderAdminSidebar.bind(App);

  App.renderAdminSidebar = function () {
    const p = this.state.currentPage;
    const ni = (icon, label, page, sub) => `
      <div class="nav-item${sub ? ' nav-sub-item' : ''} ${p === page ? 'active' : ''}"
           onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;

    // Get the sidebar HTML from previous patch (modules.js)
    const prevHtml = _prev();

    // Inject a new nav-section before the closing </nav> tag
    const newSection = `
        <div class="nav-section">
          <div class="nav-section-title">Registration</div>
          ${ni('app_registration', 'Society Registration', 'admin-soc-reg')}
          ${ni('list_alt', 'Registration List', 'admin-soc-reg-list', true)}
          ${ni('add_circle', 'New Registration', 'admin-soc-reg-add', true)}
        </div>`;

    return prevHtml.replace(
      /(<div class="sidebar-footer")/,
      newSection + '\n      $1'
    );
  };
})();
*/



// ═══════════════════════════════════════════════════════════════
// SECTION 5 — EXTEND PAGE ROUTER
// Wraps the router that modules.js already wrapped.
// ═══════════════════════════════════════════════════════════════
(function patchRouterForSocReg() {
  const _prev = App.renderPage.bind(App);

  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'admin-soc-reg': return this.renderSocRegDashboard();
      case 'admin-soc-reg-list': return this.renderSocRegList();
      case 'admin-soc-reg-add': return this.renderSocRegForm('add');
      case 'admin-soc-reg-edit': return this.renderSocRegForm('edit');
      case 'admin-soc-reg-view': return this.renderSocRegView();
      default: return _prev();
    }
  };
})();


// ═══════════════════════════════════════════════════════════════
// SECTION 6 — EXTEND HEADER TITLES
// ═══════════════════════════════════════════════════════════════
(function patchHeaderForSocReg() {
  const _prev = App.renderHeader.bind(App);
  const titles = {
    'admin-soc-reg': 'Society Registration',
    'admin-soc-reg-list': 'Society Registration List',
    'admin-soc-reg-add': 'New Society Registration',
    'admin-soc-reg-edit': 'Edit Society Registration',
    'admin-soc-reg-view': 'Society Registration Details',
  };

  App.renderHeader = function () {
    const html = _prev();
    const title = titles[this.state.currentPage];
    if (!title) return html;
    return html.replace(
      /<span class="header-title">.*?<\/span>/,
      `<span class="header-title">${title}</span>`
    );
  };
})();


// ═══════════════════════════════════════════════════════════════
// SECTION 7 — PAGE RENDERERS
// ═══════════════════════════════════════════════════════════════

// ── Helper: status badge (reuses existing .badge classes) ──────
App._socRegBadge = function (status) {
  const map = {
    Active: 'badge-success',
    Pending: 'badge-warning',
    Inactive: 'badge-danger',
    Rejected: 'badge-danger',
    Deleted: 'badge-gray',
    Suspended: 'badge-purple',
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
};

// ── Helper: get filtered & non-deleted societies ───────────────
App._socRegFiltered = function () {
  const f = this.state.socRegFilter;
  return this.state.regSocieties.filter(s =>
    !s.deleted &&
    (!f.district || s.district === f.district) &&
    (!f.status || s.status === f.status) &&
    (!f.search ||
      s.societyName.toLowerCase().includes(f.search.toLowerCase()) ||
      s.societyCode.toLowerCase().includes(f.search.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(f.search.toLowerCase()) ||
      s.societyHeadName.toLowerCase().includes(f.search.toLowerCase()) ||
      s.mobileNumber.includes(f.search)
    )
  );
};


// ─────────────────────────────────────────────────────────────
// 7-A  DASHBOARD  (admin-soc-reg)
// ─────────────────────────────────────────────────────────────
App.renderSocRegDashboard = function () {
  const list = this.state.regSocieties.filter(s => !s.deleted);
  const active = list.filter(s => s.status === 'Active').length;
  const pending = list.filter(s => s.status === 'Pending').length;
  const others = list.filter(s => s.status !== 'Active' && s.status !== 'Pending').length;
  const recent = list.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return `
  <div class="page-header">
    <h1>Society Registration</h1>
    <p>Register and manage seed producer societies for the Beej Sangh programme</p>
  </div>

  <!-- Stat Cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon"><span class="material-icons">account_balance</span></div>
      <div class="stat-info">
        <div class="value">${list.length}</div>
        <div class="label">Total Societies</div>
        <div class="change">↑ Registered</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><span class="material-icons">check_circle</span></div>
      <div class="stat-info">
        <div class="value">${active}</div>
        <div class="label">Active Societies</div>
      </div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon"><span class="material-icons">pending_actions</span></div>
      <div class="stat-info">
        <div class="value">${pending}</div>
        <div class="label">Pending Approval</div>
      </div>
    </div>
    <div class="stat-card red">
      <div class="stat-icon"><span class="material-icons">cancel</span></div>
      <div class="stat-info">
        <div class="value">${others}</div>
        <div class="label">Inactive / Rejected</div>
      </div>
    </div>
  </div>

  <!-- Quick Actions + Recent List -->
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
    <div class="card">
      <div class="card-header">
        <h3>Recent Registrations</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm"
            onclick="App.navigate('admin-soc-reg-add')">
            <span class="material-icons">add</span> New Registration
          </button>
          <button class="btn btn-outline btn-sm"
            onclick="App.navigate('admin-soc-reg-list')">
            View All
          </button>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Society ID</th>
                <th>Society Name</th>
                <th>District</th>
                <th>Head Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${recent.length === 0
      ? `<tr><td colspan="6" style="text-align:center;padding:32px;color:#9E9E9E;">
                     No registrations yet.
                   </td></tr>`
      : recent.map(s => `
                  <tr>
                    <td><b>${s.societyId}</b></td>
                    <td>${s.societyName}</td>
                    <td>${s.district}</td>
                    <td>${s.societyHeadName}</td>
                    <td>${this._socRegBadge(s.status)}</td>
                    <td>
                      <button class="btn btn-info btn-sm"
                        onclick="App.state.socRegSelectedId='${s.societyId}';App.navigate('admin-soc-reg-view')">
                        <span class="material-icons" style="font-size:14px;">visibility</span>
                      </button>
                    </td>
                  </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3>Quick Actions</h3></div>
      <div class="card-body" style="display:grid;gap:10px;">
        <button class="btn btn-primary"
          onclick="App.navigate('admin-soc-reg-add')">
          <span class="material-icons">add_circle</span> New Registration
        </button>
        <button class="btn btn-outline"
          onclick="App.navigate('admin-soc-reg-list')">
          <span class="material-icons">list_alt</span> View All Societies
        </button>
        <button class="btn btn-gray"
          onclick="App.navigate('admin-societies')">
          <span class="material-icons">business</span> Existing Society Mgmt
        </button>
      </div>
    </div>
  </div>

  <!-- Registration Status Chart -->
  <div class="card" style="margin-top:0;">
    <div class="card-header"><h3>Registrations by District</h3></div>
    <div class="card-body">
      ${(function () {
      const districtCounts = {};
      list.forEach(s => {
        districtCounts[s.district] = (districtCounts[s.district] || 0) + 1;
      });
      const maxCnt = Math.max(...Object.values(districtCounts), 1);
      return Object.entries(districtCounts).map(([dist, cnt]) => `
          <div class="chart-bar-group" style="margin-bottom:8px;">
            <span class="chart-label">${dist}</span>
            <div class="chart-bar-bg">
              <div class="chart-bar" style="width:${Math.round(cnt / maxCnt * 100)}%"></div>
            </div>
            <span class="chart-val">${cnt} societies</span>
          </div>`).join('') || '<p style="color:#9E9E9E;font-size:0.85rem;">No data yet.</p>';
    })()}
    </div>
  </div>`;
};


// ─────────────────────────────────────────────────────────────
// 7-B  SOCIETY REGISTRATION LIST  (admin-soc-reg-list)
// ─────────────────────────────────────────────────────────────
App.renderSocRegList = function () {
  const f = this.state.socRegFilter;
  const rows = this._socRegFiltered();

  // Unique districts for filter dropdown
  const districts = [...new Set(
    this.state.regSocieties.filter(s => !s.deleted).map(s => s.district)
  )].sort();

  return `
  <div class="page-header">
    <h1>Society Registration List</h1>
    <p>All registered societies with search, filter, and management actions</p>
  </div>

  <!-- Show deferred success message if redirected from form save -->
  ${this.state.socRegSuccessMsg ? `
    <div class="alert alert-success" id="sr-success-alert">
      <span class="material-icons">check_circle</span>
      <div>${this.state.socRegSuccessMsg}</div>
    </div>` : ''}

  <!-- Search & Filter Bar — reuses .search-bar pattern -->
  <div class="search-bar" style="margin-bottom:16px;">
    <div class="search-field">
      <label>Search</label>
      <input class="form-control"
        placeholder="Name, Code, Reg. No., Head Name…"
        value="${f.search}"
        oninput="App.state.socRegFilter.search=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>District</label>
      <select class="form-control"
        onchange="App.state.socRegFilter.district=this.value;App.render()">
        <option value="">All Districts</option>
        ${districts.map(d => `<option ${f.district === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>Status</label>
      <select class="form-control"
        onchange="App.state.socRegFilter.status=this.value;App.render()">
        <option value="">All Status</option>
        ${['Active', 'Pending', 'Inactive', 'Rejected', 'Suspended']
      .map(s => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="search-field" style="align-self:flex-end;">
      <button class="btn btn-gray btn-sm"
        onclick="App.state.socRegFilter={district:'',status:'',search:''};App.render()">
        <span class="material-icons">clear</span> Reset
      </button>
    </div>
    <div style="margin-left:auto;align-self:flex-end;">
      <button class="btn btn-primary"
        onclick="App.navigate('admin-soc-reg-add')">
        <span class="material-icons">add</span> New Registration
      </button>
    </div>
  </div>

  <!-- Table Card -->
  <div class="card">
    <div class="card-header">
      <h3>Registered Societies
        <span style="color:#757575;font-weight:400;font-size:0.85rem;">
          (${rows.length} record${rows.length !== 1 ? 's' : ''})
        </span>
      </h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-success btn-sm">
          <span class="material-icons">table_chart</span> Export Excel
        </button>
        <button class="btn btn-danger btn-sm">
          <span class="material-icons">picture_as_pdf</span> Export PDF
        </button>
        <button class="btn btn-gray btn-sm">
          <span class="material-icons">print</span> Print
        </button>
      </div>
    </div>

    <div class="card-body" style="padding:0;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Society ID</th>
              <th>Society Name</th>
              <th>Society Code</th>
              <th>Reg. Number</th>
              <th>District</th>
              <th>Block</th>
              <th>Society Head</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0
      ? `<tr>
                   <td colspan="11"
                     style="text-align:center;padding:48px;color:#9E9E9E;">
                     <span class="material-icons"
                       style="font-size:40px;display:block;margin-bottom:8px;">
                       search_off
                     </span>
                     No records match the current filters.
                   </td>
                 </tr>`
      : rows.map(s => `
                <tr>
                  <td><b>${s.societyId}</b></td>
                  <td>
                    <div style="font-weight:500;">${s.societyName}</div>
                    <div style="font-size:0.75rem;color:#757575;">${s.societyType || ''}</div>
                  </td>
                  <td>${s.societyCode}</td>
                  <td style="font-size:0.82rem;">${s.registrationNumber}</td>
                  <td>${s.district}</td>
                  <td>${s.block}</td>
                  <td>
                    <div>${s.societyHeadName}</div>
                    <div style="font-size:0.75rem;color:#757575;">${s.emailId || ''}</div>
                  </td>
                  <td>${s.mobileNumber}</td>
                  <td>${this._socRegBadge(s.status)}</td>
                  <td style="font-size:0.8rem;">${s.createdAt}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-info btn-sm" title="View"
                        onclick="App.state.socRegSelectedId='${s.societyId}';
                                 App.navigate('admin-soc-reg-view')">
                        <span class="material-icons" style="font-size:14px;">
                          visibility
                        </span>
                      </button>
                      <button class="btn btn-warning btn-sm" title="Edit"
                        onclick="App.state.socRegSelectedId='${s.societyId}';
                                 App.navigate('admin-soc-reg-edit')">
                        <span class="material-icons" style="font-size:14px;">
                          edit
                        </span>
                      </button>
                      <button class="btn btn-${s.status === 'Active' ? 'danger' : 'success'} btn-sm"
                        title="${s.status === 'Active' ? 'Deactivate' : 'Activate'}"
                        onclick="App.socRegToggleStatus('${s.societyId}')">
                        <span class="material-icons" style="font-size:14px;">
                          ${s.status === 'Active' ? 'toggle_off' : 'toggle_on'}
                        </span>
                      </button>
                      <button class="btn btn-danger btn-sm" title="Delete"
                        onclick="App.socRegDelete('${s.societyId}')">
                        <span class="material-icons" style="font-size:14px;">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination bar -->
      <div style="padding:12px 16px;display:flex;justify-content:space-between;
                  align-items:center;border-top:1px solid #E0E0E0;">
        <span style="font-size:0.82rem;color:#757575;">
          Showing ${rows.length} of
          ${this.state.regSocieties.filter(s => !s.deleted).length} records
        </span>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-gray btn-sm">‹ Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-gray btn-sm">Next ›</button>
        </div>
      </div>
    </div>
  </div>`;
};


// ═══════════════════════════════════════════════════════════════
// SECTION 8 — PUBLIC REGISTRATION PAGE (no login required)
// Route: soc-register  |  Accessible from Login page link
// ═══════════════════════════════════════════════════════════════
App.renderPublicSocRegForm = function () {
  return `
  <div class="login-page" style="min-height:100vh;align-items:flex-start;padding:30px 16px;">
    <!-- Page Header -->
    <div style="width:100%;max-width:900px;margin:0 auto 20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:52px;height:52px;background:#fff;border-radius:50%;
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:26px;">🌾</div>
          <div>
            <div style="color:#fff;font-size:1.2rem;font-weight:700;line-height:1.2;">
              Beej Sangh Procurement Portal
            </div>
            <div style="color:rgba(255,255,255,.8);font-size:0.8rem;">
              New Society Registration — Madhya Pradesh Agriculture Department
            </div>
          </div>
        </div>
        <button onclick="App.navigate('login')"
          style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;
                 background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.4);
                 color:#fff;border-radius:8px;cursor:pointer;font-size:0.88rem;font-weight:600;
                 backdrop-filter:blur(4px);">
          <span class="material-icons" style="font-size:18px;">arrow_back</span> Back to Login
        </button>
      </div>
    </div>

    <!-- Registration Card -->
    <div style="width:100%;max-width:900px;margin:0 auto;background:#fff;border-radius:16px;
                box-shadow:0 8px 32px rgba(0,0,0,.18);overflow:hidden;">

      <!-- Card Header -->
      <div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);
                  padding:20px 28px;display:flex;align-items:center;gap:12px;">
        <span class="material-icons" style="color:#fff;font-size:26px;">app_registration</span>
        <div>
          <div style="color:#fff;font-size:1.1rem;font-weight:700;">New Society Registration</div>
          <div style="color:rgba(255,255,255,.8);font-size:0.78rem;">
            Fill in all required details to register your society
          </div>
        </div>
      </div>

      <div style="padding:28px;">

        <!-- Society Code Lookup (NEW) -->
        <div style="margin-bottom:28px;background:#E3F2FD;padding:20px;border-radius:12px;
                    border:2px solid #2196F3;">
          <div style="font-size:0.9rem;font-weight:700;color:#1565C0;margin-bottom:16px;
                      display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#2196F3;">search</span>
            Society Code Lookup (Optional)
          </div>
          <div style="display:flex;gap:12px;align-items:flex-end;">
            <div class="form-group" style="flex:1;">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Enter Society Code
              </label>
              <input type="text" id="society-code-lookup" class="form-control"
                placeholder="e.g., SOC-001" style="text-transform:uppercase;"/>
              <div style="font-size:0.72rem;color:#616161;margin-top:4px;">
                💡 If your society is already registered, enter the code to auto-fill details
              </div>
            </div>
            <button onclick="App.fetchSocietyByCode()"
              style="padding:10px 20px;background:#2196F3;color:#fff;border:none;
                     border-radius:8px;cursor:pointer;font-weight:600;font-size:0.88rem;
                     display:flex;align-items:center;gap:6px;height:fit-content;">
              <span class="material-icons" style="font-size:18px;">search</span>
              Fetch Data
            </button>
          </div>
          <div id="society-lookup-message" style="margin-top:12px;font-size:0.82rem;font-weight:500;"></div>
        </div>

        <!-- Society Information -->
        <div style="margin-bottom:28px;">
          <div style="font-size:0.9rem;font-weight:700;color:#2E7D32;margin-bottom:16px;
                      padding-bottom:10px;border-bottom:2px solid #E8F5E9;display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#4CAF50;">business</span>
            Society Information
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
            <!-- Society Code Field (with auto-fetch on blur/change) -->
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Society Code <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-code" class="form-control"
                placeholder="e.g., SOC-001"
                style="text-transform:uppercase;"
                onblur="App.autoFetchSocietyData()"
                onchange="App.autoFetchSocietyData()"/>
              <small style="font-size:0.72rem;color:#616161;margin-top:2px;">
                Enter code to auto-fill data
              </small>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Society Name <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-name" class="form-control"
                placeholder="e.g., Rampur Krishi Samiti"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Society Type <span style="color:#F44336">*</span>
              </label>
              <select id="new-soc-type" class="form-control">
                <option value="">Select Type</option>
                <option>Farmers Cooperative</option>
                <option>Seed Production Society</option>
                <option>Krishi Utpadak Samiti</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Registration Number <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-regnum" class="form-control"
                placeholder="e.g., REG-MP-2024-001"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Registration Date <span style="color:#F44336">*</span>
              </label>
              <input type="date" id="new-soc-date" class="form-control"/>
            </div>
          </div>
        </div>

        <!-- Location Details -->
        <div style="margin-bottom:28px;">
          <div style="font-size:0.9rem;font-weight:700;color:#2E7D32;margin-bottom:16px;
                      padding-bottom:10px;border-bottom:2px solid #E8F5E9;display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#4CAF50;">location_on</span>
            Location Details
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:16px;">
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Address <span style="color:#F44336">*</span>
              </label>
              <textarea id="new-soc-address" class="form-control" rows="2"
                placeholder="Full address of society office"></textarea>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Village <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-village" class="form-control" placeholder="Village"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Block <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-block" class="form-control" placeholder="Block"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                District <span style="color:#F44336">*</span>
              </label>
              <select id="new-soc-district" class="form-control">
                <option value="">Select District</option>
                <option>Chhindwara</option>
                <option>Seoni</option>
                <option>Narsinghpur</option>
                <option>Betul</option>
                <option>Jabalpur</option>
                <option>Bhopal</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                PIN Code <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-pin" class="form-control" 
                placeholder="6-digit PIN" maxlength="6"/>
            </div>
          </div>
        </div>

        <!-- Contact Person Details -->
        <div style="margin-bottom:28px;">
          <div style="font-size:0.9rem;font-weight:700;color:#2E7D32;margin-bottom:16px;
                      padding-bottom:10px;border-bottom:2px solid #E8F5E9;display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#4CAF50;">contact_phone</span>
            Contact Person Details
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Contact Person Name <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-contact" class="form-control" 
                placeholder="Full name"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Designation <span style="color:#F44336">*</span>
              </label>
              <select id="new-soc-designation" class="form-control">
                <option value="">Select Designation</option>
                <option>President</option>
                <option>Secretary</option>
                <option>Treasurer</option>
                <option>Chairman</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Mobile Number <span style="color:#F44336">*</span>
              </label>
              <input type="tel" id="new-soc-mobile" class="form-control" 
                placeholder="10-digit mobile" maxlength="10"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Email ID <span style="color:#F44336">*</span>
              </label>
              <input type="email" id="new-soc-email" class="form-control" 
                placeholder="email@example.com"/>
            </div>
          </div>
        </div>

        <!-- Bank Details -->
        <div style="margin-bottom:28px;">
          <div style="font-size:0.9rem;font-weight:700;color:#2E7D32;margin-bottom:16px;
                      padding-bottom:10px;border-bottom:2px solid #E8F5E9;display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#4CAF50;">account_balance</span>
            Bank Details
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Bank Name <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-bank" class="form-control" 
                placeholder="e.g., State Bank of India"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Branch Name <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-branch" class="form-control" 
                placeholder="Branch name"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Account Number <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-account" class="form-control" 
                placeholder="Account number"/>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                IFSC Code <span style="color:#F44336">*</span>
              </label>
              <input type="text" id="new-soc-ifsc" class="form-control" 
                placeholder="e.g., SBIN0001234" maxlength="11"/>
            </div>
          </div>
        </div>

        <!-- Document Upload -->
        <div style="margin-bottom:28px;">
          <div style="font-size:0.9rem;font-weight:700;color:#2E7D32;margin-bottom:16px;
                      padding-bottom:10px;border-bottom:2px solid #E8F5E9;display:flex;align-items:center;gap:8px;">
            <span class="material-icons" style="font-size:20px;color:#4CAF50;">upload_file</span>
            Document Upload
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Registration Certificate <span style="color:#F44336">*</span>
              </label>
              <input type="file" id="new-soc-reg-cert" class="form-control" 
                accept=".pdf,.jpg,.jpeg,.png" style="padding:10px;"/>
              <small style="font-size:0.75rem;color:#757575;">PDF, JPG, PNG up to 2MB</small>
            </div>
            <div class="form-group">
              <label style="font-size:0.82rem;font-weight:500;color:#424242;margin-bottom:6px;display:block;">
                Bank Passbook/Cancelled Cheque
              </label>
              <input type="file" id="new-soc-bank-doc" class="form-control" 
                accept=".pdf,.jpg,.jpeg,.png" style="padding:10px;"/>
              <small style="font-size:0.75rem;color:#757575;">PDF, JPG, PNG up to 1MB</small>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:20px;
                    border-top:1px solid #E0E0E0;">
          <button class="btn btn-gray" onclick="App.navigate('login')" 
            style="display:inline-flex;align-items:center;gap:6px;">
            <span class="material-icons" style="font-size:18px;">close</span> Cancel
          </button>
          <button class="btn btn-outline" onclick="App.saveSocietyDraft()"
            style="display:inline-flex;align-items:center;gap:6px;background:#fff;border:2px solid #4CAF50;color:#2E7D32;">
            <span class="material-icons" style="font-size:18px;">save</span> Save as Draft
          </button>
          <button class="btn btn-primary" onclick="App.submitSocietyRegistration()"
            style="display:inline-flex;align-items:center;gap:6px;background:#4CAF50;">
            <span class="material-icons" style="font-size:18px;">send</span> Submit Application
          </button>
        </div>

      </div>
    </div>
  </div>`;
};

// Save as Draft
App.saveSocietyDraft = function () {
  // Show success alert popup
  alert('✓ Application saved as draft successfully!');
  // Stay on the same page (no navigation)
};

// Submit Registration
App.submitSocietyRegistration = function () {
  // Show success alert popup
  alert('✓ Registration submitted successfully!\n\nOur team will review your application and contact you soon.');

  // Navigate to login page immediately
  App.navigate('login');
};

// Fetch Society Data by Code (from Society Code Lookup section at top)
App.fetchSocietyByCode = function () {
  const codeInput = document.getElementById('society-code-lookup');
  const messageDiv = document.getElementById('society-lookup-message');

  if (!codeInput || !messageDiv) return;

  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    messageDiv.innerHTML = '<span style="color:#F44336;">⚠ Please enter a society code</span>';
    return;
  }

  // Find society in the system
  const society = this.state.societies.find(s => s.code.toUpperCase() === code);

  if (!society) {
    messageDiv.innerHTML = '<span style="color:#F44336;">❌ Society code not found. Please register as a new society.</span>';
    return;
  }

  // Check if society is already registered
  if (society.status === 'Active') {
    messageDiv.innerHTML = `<span style="color:#FF9800;">⚠ Society "${society.name}" is already registered and active. Please contact admin for updates.</span>`;
    return;
  }

  // Auto-fill form fields
  const nameField = document.getElementById('new-soc-name');
  const districtField = document.getElementById('new-soc-district');

  if (nameField) nameField.value = society.name;
  if (districtField) districtField.value = society.district;

  // Show success message
  messageDiv.innerHTML = `<span style="color:#4CAF50;">✓ Society data found! Details have been auto-filled. Please complete remaining fields.</span>`;

  // Scroll to form
  setTimeout(() => {
    const formStart = document.querySelector('[style*="Society Information"]');
    if (formStart) {
      formStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 500);
};

// Auto-fetch Society Data when Society Code field is filled
App.autoFetchSocietyData = function () {
  const codeInput = document.getElementById('new-soc-code');
  if (!codeInput) return;

  const code = codeInput.value.trim().toUpperCase();
  codeInput.value = code; // Update to uppercase

  if (!code) return;

  // Find society in the system from regSocieties (full registration data)
  const society = this.state.regSocieties.find(s => s.societyCode?.toUpperCase() === code);

  if (society && !society.deleted) {
    // Check if society is already registered
    if (society.status === 'Active') {
      alert(`⚠ Society "${society.societyName}" (${code}) is already registered and active.\n\nPlease contact admin for updates.`);
      // Clear the code field
      codeInput.value = '';
      return;
    }

    // Auto-fill all available fields from registered society data
    const fields = {
      'new-soc-name': society.societyName,
      'new-soc-type': society.societyType,
      'new-soc-regnum': society.registrationNumber,
      'new-soc-date': society.registrationDate,
      'new-soc-address': society.address,
      'new-soc-village': society.village,
      'new-soc-block': society.block,
      'new-soc-district': society.district,
      'new-soc-pin': society.pinCode,
      'new-soc-contact': society.societyHeadName,
      'new-soc-mobile': society.mobileNumber,
      'new-soc-email': society.emailId,
      'new-soc-bank': society.bankName,
      'new-soc-branch': society.branch,
      'new-soc-account': society.accountNumber,
      'new-soc-ifsc': society.ifscCode,
    };

    // Fill all fields that have values
    Object.entries(fields).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field && value) {
        field.value = value;
      }
    });

    // Show success notification
    alert(`✓ Society data found for ${code}!\n\n"${society.societyName}" details have been auto-filled.\n\nPlease review and update as needed.`);

    // Highlight the code field briefly to show success
    codeInput.style.background = '#E8F5E9';
    codeInput.style.border = '2px solid #4CAF50';
    setTimeout(() => {
      codeInput.style.background = '';
      codeInput.style.border = '';
    }, 2000);
  } else {
    // Try to find in basic societies list
    const basicSoc = this.state.societies.find(s => s.code?.toUpperCase() === code);

    if (basicSoc) {
      // Auto-fill basic fields
      const nameField = document.getElementById('new-soc-name');
      const districtField = document.getElementById('new-soc-district');

      if (nameField) nameField.value = basicSoc.name;
      if (districtField) districtField.value = basicSoc.district;

      alert(`✓ Society code ${code} found!\n\nBasic details have been auto-filled.\nPlease complete remaining fields.`);

      // Highlight the code field
      codeInput.style.background = '#E8F5E9';
      codeInput.style.border = '2px solid #4CAF50';
      setTimeout(() => {
        codeInput.style.background = '';
        codeInput.style.border = '';
      }, 2000);
    }
    // If not found, do nothing (user might be entering a new code)
  }
};

// Modal Helper Functions
App.showModal = function (config) {
  const modal = document.getElementById('app-modal');
  if (!modal) {
    // Create modal if it doesn't exist
    const modalHtml = `
      <div id="app-modal" class="modal-overlay" style="display:none;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-icon" id="modal-icon">
              <span class="material-icons" id="modal-icon-symbol">check_circle</span>
            </div>
            <h3 id="modal-title">Title</h3>
            <p id="modal-message">Message</p>
            <div class="modal-actions" id="modal-actions"></div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const modalEl = document.getElementById('app-modal');
  const iconEl = document.getElementById('modal-icon');
  const iconSymbol = document.getElementById('modal-icon-symbol');
  const titleEl = document.getElementById('modal-title');
  const messageEl = document.getElementById('modal-message');
  const actionsEl = document.getElementById('modal-actions');

  // Update content
  iconSymbol.textContent = config.icon || 'info';
  iconEl.style.color = config.iconColor || '#2196F3';
  titleEl.textContent = config.title;
  messageEl.textContent = config.message;

  // Create buttons
  actionsEl.innerHTML = '';
  (config.buttons || []).forEach(btn => {
    const button = document.createElement('button');
    button.className = `btn ${btn.class || 'btn-primary'}`;
    button.textContent = btn.label;
    button.onclick = btn.action;
    actionsEl.appendChild(button);
  });

  // Show modal
  modalEl.style.display = 'flex';
  setTimeout(() => modalEl.classList.add('active'), 10);
};

App.closeModal = function () {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
  }
};


// ═══════════════════════════════════════════════════════════════
// END OF PUBLIC REGISTRATION FORM
// ═══════════════════════════════════════════════════════════════
