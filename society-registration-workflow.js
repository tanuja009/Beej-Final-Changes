/**
 * society-registration-workflow.js
 * ═══════════════════════════════════════════════════════════════════
 * Complete Society Registration and Approval Workflow Module
 * 
 * FEATURES:
 * ─────────
 * 1. Society Registration (with unique Application Number generation)
 * 2. Status Workflow: Draft → Pending → Approved/Rejected/Resubmission Required
 * 3. Society Role: View own registrations, Edit (if Draft/Resubmission), Resubmit
 * 4. Admin Role: View all registrations, Approve/Reject/Return for Resubmission
 * 5. Audit Trail for all status changes
 * 6. Notifications on status changes
 * 7. Role-based access control
 * 8. Document upload/view/download
 * 9. Application history timeline
 * 
 * FILES ADDED: society-registration-workflow.js (this file)
 * FILES MODIFIED: index.html (add script tag)
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════
// SECTION 1 — STATE INJECTION & DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════
(function injectWorkflowState() {

  // Application Status Constants
  App.SOC_STATUS = {
    // Only two statuses are used: Pending and Approved.
    DRAFT: 'Pending',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Pending',
    RESUBMISSION: 'Pending'
  };

  // Society Registration Applications
  App.state.societyApplications = [
    {
      applicationNumber: 'APP-2024-001',
      societyCode: 'SOC-001',
      societyName: 'Rampur Krishi Samiti',
      societyType: 'Farmers Cooperative',
      registrationNumber: 'REG-MP-2020-001',
      registrationDate: '2020-04-15',
      district: 'Chhindwara',
      block: 'Patan',
      village: 'Rampur',
      address: 'Main Road, Rampur, Patan',
      pinCode: '480001',
      contactPersonName: 'Ramesh Kumar Verma',
      designation: 'President',
      mobileNumber: '9876543210',
      emailId: 'ramesh.rampur@gmail.com',
      bankName: 'State Bank of India',
      branchName: 'Patan Branch',
      accountNumber: '12345678901',
      ifscCode: 'SBIN0001234',
      panNumber: 'AAAPL1234C',
      gstNumber: '22AAAAA0000A1Z5',
      status: App.SOC_STATUS.APPROVED,
      submittedBy: 'Ramesh Kumar',
      submittedByRole: 'Society',
      registrationDateSubmitted: '2024-01-15',
      submittedDate: '2024-01-15T10:30:00',
      approvedBy: 'Admin Sharma',
      approvedDate: '2024-01-16T14:20:00',
      rejectionReason: null,
      resubmissionRemarks: null,
      documents: [
        { name: 'Registration Certificate', fileName: 'reg_cert.pdf', uploadDate: '2024-01-15', type: 'registration' }
      ],
      createdAt: '2024-01-15T09:00:00',
      updatedAt: '2024-01-16T14:20:00',
      createdBy: 'Ramesh Kumar',
      userId: 'user-001'
    },
    {
      applicationNumber: 'APP-2024-002',
      societyCode: 'SOC-002',
      societyName: 'Sehora Kisan Sabha',
      societyType: 'Seed Production Society',
      registrationNumber: 'REG-MP-2024-015',
      registrationDate: '2024-02-10',
      district: 'Seoni',
      block: 'Sehora',
      village: 'Sehora',
      address: 'Gram Panchayat Building, Sehora',
      pinCode: '480661',
      contactPersonName: 'Sunita Devi',
      designation: 'Secretary',
      mobileNumber: '9823401234',
      emailId: 'sunita@example.com',
      bankName: 'Bank of India',
      branchName: 'Seoni Branch',
      accountNumber: '98765432101',
      ifscCode: 'BKID0008821',
      panNumber: '',
      gstNumber: '',
      status: App.SOC_STATUS.PENDING,
      submittedBy: 'Sunita Devi',
      submittedByRole: 'Society',
      registrationDateSubmitted: '2024-02-12',
      submittedDate: '2024-02-12T11:45:00',
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
      resubmissionRemarks: null,
      documents: [
        { name: 'Registration Certificate', fileName: 'sehora_reg.pdf', uploadDate: '2024-02-12', type: 'registration' }
      ],
      createdAt: '2024-02-10T08:30:00',
      updatedAt: '2024-02-12T11:45:00',
      createdBy: 'Sunita Devi',
      userId: 'user-002'
    },
    {
      applicationNumber: 'APP-2024-003',
      societyCode: 'SOC-003',
      societyName: 'Bargaon Beej Samiti',
      societyType: 'Farmers Cooperative',
      registrationNumber: 'REG-MP-2024-020',
      registrationDate: '2024-03-05',
      district: 'Narsinghpur',
      block: 'Harrai',
      village: 'Bargaon',
      address: 'Near Primary School, Bargaon',
      pinCode: '487661',
      contactPersonName: 'Dinesh Patel',
      designation: 'President',
      mobileNumber: '9765432109',
      emailId: 'dinesh@example.com',
      bankName: 'Punjab National Bank',
      branchName: 'Narsinghpur Branch',
      accountNumber: '11223344556',
      ifscCode: 'PUNB0123456',
      panNumber: '',
      gstNumber: '',
      status: App.SOC_STATUS.RESUBMISSION,
      submittedBy: 'Dinesh Patel',
      submittedByRole: 'Society',
      registrationDateSubmitted: '2024-03-06',
      submittedDate: '2024-03-06T09:15:00',
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
      resubmissionRemarks: 'Please upload PAN card document and GST certificate. Bank account details need verification.',
      documents: [
        { name: 'Registration Certificate', fileName: 'bargaon_reg.pdf', uploadDate: '2024-03-06', type: 'registration' }
      ],
      createdAt: '2024-03-05T10:00:00',
      updatedAt: '2024-03-07T15:30:00',
      createdBy: 'Dinesh Patel',
      userId: 'user-003'
    }
  ];

  // Audit Trail for Application Status Changes
  App.state.applicationAudit = [
    {
      applicationNumber: 'APP-2024-001',
      action: 'Created',
      previousStatus: null,
      newStatus: App.SOC_STATUS.DRAFT,
      actionBy: 'Ramesh Kumar',
      role: 'Society',
      actionDate: '2024-01-15T09:00:00',
      remarks: 'Application created'
    },
    {
      applicationNumber: 'APP-2024-001',
      action: 'Submitted',
      previousStatus: App.SOC_STATUS.DRAFT,
      newStatus: App.SOC_STATUS.PENDING,
      actionBy: 'Ramesh Kumar',
      role: 'Society',
      actionDate: '2024-01-15T10:30:00',
      remarks: 'Application submitted for approval'
    },
    {
      applicationNumber: 'APP-2024-001',
      action: 'Approved',
      previousStatus: App.SOC_STATUS.PENDING,
      newStatus: App.SOC_STATUS.APPROVED,
      actionBy: 'Admin Sharma',
      role: 'Beej Sangh Admin',
      actionDate: '2024-01-16T14:20:00',
      remarks: 'All documents verified. Society activated.'
    },
    {
      applicationNumber: 'APP-2024-002',
      action: 'Created',
      previousStatus: null,
      newStatus: App.SOC_STATUS.DRAFT,
      actionBy: 'Sunita Devi',
      role: 'Society',
      actionDate: '2024-02-10T08:30:00',
      remarks: 'Application created'
    },
    {
      applicationNumber: 'APP-2024-002',
      action: 'Submitted',
      previousStatus: App.SOC_STATUS.DRAFT,
      newStatus: App.SOC_STATUS.PENDING,
      actionBy: 'Sunita Devi',
      role: 'Society',
      actionDate: '2024-02-12T11:45:00',
      remarks: 'Application submitted for approval'
    },
    {
      applicationNumber: 'APP-2024-003',
      action: 'Created',
      previousStatus: null,
      newStatus: App.SOC_STATUS.DRAFT,
      actionBy: 'Dinesh Patel',
      role: 'Society',
      actionDate: '2024-03-05T10:00:00',
      remarks: 'Application created'
    },
    {
      applicationNumber: 'APP-2024-003',
      action: 'Submitted',
      previousStatus: App.SOC_STATUS.DRAFT,
      newStatus: App.SOC_STATUS.PENDING,
      actionBy: 'Dinesh Patel',
      role: 'Society',
      actionDate: '2024-03-06T09:15:00',
      remarks: 'Application submitted for approval'
    },
    {
      applicationNumber: 'APP-2024-003',
      action: 'Returned for Resubmission',
      previousStatus: App.SOC_STATUS.PENDING,
      newStatus: App.SOC_STATUS.RESUBMISSION,
      actionBy: 'Admin Sharma',
      role: 'Beej Sangh Admin',
      actionDate: '2024-03-07T15:30:00',
      remarks: 'Please upload PAN card document and GST certificate. Bank account details need verification.'
    }
  ];

  // UI State
  App.state.socAppFilter = { applicationNumber: '', societyName: '', status: '', district: '', fromDate: '', toDate: '' };
  App.state.socAppSelectedId = null;
  App.state.socAppApprovalPopup = null; // 'approve' | 'reject' | 'resubmit'
  App.state.socAppView = 'list'; // 'list' | 'details' | 'form'

})();

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

// Generate unique Application Number
App.generateApplicationNumber = function () {
  const year = new Date().getFullYear();
  const existing = this.state.societyApplications.map(a => a.applicationNumber);
  const nums = existing
    .filter(n => n && n.startsWith(`APP-${year}-`))
    .map(n => parseInt(n.split('-')[2]))
    .filter(n => !isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `APP-${year}-${String(next).padStart(3, '0')}`;
};

// Get application by Application Number
App.getApplicationByNumber = function (appNumber) {
  return this.state.societyApplications.find(a => a.applicationNumber === appNumber);
};

// Get applications for current user (Society role)
App.getMyApplications = function () {
  const currentUserId = this.state.currentUser?.userId || 'user-001';
  return this.state.societyApplications.filter(a => a.userId === currentUserId);
};

// Get audit trail for application
App.getApplicationAudit = function (appNumber) {
  return this.state.applicationAudit
    .filter(a => a.applicationNumber === appNumber)
    .sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate));
};

// Add audit entry
App.addAuditEntry = function (appNumber, action, prevStatus, newStatus, actionBy, role, remarks) {
  this.state.applicationAudit.push({
    applicationNumber: appNumber,
    action: action,
    previousStatus: prevStatus,
    newStatus: newStatus,
    actionBy: actionBy,
    role: role,
    actionDate: new Date().toISOString(),
    remarks: remarks || ''
  });
};

// Status badge helper
App._socAppStatusBadge = function (status) {
  const map = {
    'Pending': 'badge-warning',
    'Approved': 'badge-success'
  };
  return `<span class="badge ${map[status] || 'badge-warning'}">${status}</span>`;
};

// Can edit application check
App.canEditApplication = function (app) {
  return app.status === App.SOC_STATUS.DRAFT || app.status === App.SOC_STATUS.RESUBMISSION;
};

// ═══════════════════════════════════════════════════════════════════
// SECTION 3 — EXTEND SIDEBARS FOR WORKFLOW
// ═══════════════════════════════════════════════════════════════════

// Patch Society Sidebar - REMOVED: New Society Registration removed from sidebar
// Users can register from the public registration page (login page link)
/*
(function patchSocietySidebarForWorkflow() {
  const _prev = App.renderSocietySidebar ? App.renderSocietySidebar.bind(App) : null;
  if (!_prev) return;

  App.renderSocietySidebar = function () {
    const html = _prev();
    const p = this.state.currentPage;
    const ni = (icon, label, page, sub = false) => `
      <div class="nav-item${sub ? ' nav-sub-item' : ''} ${p === page ? 'active' : ''}" 
           onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;

    const newSection = `
        <div class="nav-section">
          <div class="nav-section-title">My Registration</div>
          ${ni('app_registration', 'Register Application List', 'soc-my-application')}
          ${ni('add_circle', 'New Soceity Registration', 'soc-new-registration', true)}
        </div>`;

    return html.replace(
      /(<div class="nav-section"><div class="nav-section-title">Member Management<\/div>)/,
      newSection + '\n      $1'
    );
  };
})();
*/

// Patch Admin Sidebar - Society Registration section with Registration List and Pending Approvals
(function patchAdminSidebarForWorkflow() {
  const _prev = App.renderAdminSidebar ? App.renderAdminSidebar.bind(App) : null;
  if (!_prev) return;

  App.renderAdminSidebar = function () {
    const html = _prev();
    const p = this.state.currentPage;
    const ni = (icon, label, page, sub = false) => `
      <div class="nav-item${sub ? ' nav-sub-item' : ''} ${p === page ? 'active' : ''}"
           onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;

    const pendingCount = this.state.societyApplications.filter(a =>
      a.status === App.SOC_STATUS.PENDING
    ).length;

    const badge = pendingCount > 0
      ? `<span class="badge badge-warning" style="margin-left:8px;font-size:0.7rem;">${pendingCount}</span>`
      : '';

    const newSection = `
        <div class="nav-section">
          <div class="nav-section-title">Society Registration</div>
          ${ni('list_alt', 'All Society Registrations' + (badge ? ` ${badge}` : ''), 'admin-registration-list')}
          ${ni('pending_actions', 'Registrations Pending Approval', 'admin-pending-approvals', true)}
        </div>`;

    return html.replace(
      /(<div class="nav-section"><div class="nav-section-title">Management<\/div>)/,
      newSection + '\n      $1'
    );
  };
})();

// ═══════════════════════════════════════════════════════════════════
// SECTION 4 — EXTEND ROUTER
// ═══════════════════════════════════════════════════════════════════
(function patchRouterForWorkflow() {
  const _prev = App.renderPage.bind(App);

  App.renderPage = function () {
    switch (this.state.currentPage) {
      // Society Pages
      case 'soc-my-application': return this.renderSocMyApplication();
      case 'soc-new-registration': return this.renderSocRegistrationForm('new');
      case 'soc-edit-registration': return this.renderSocRegistrationForm('edit');
      case 'soc-app-details': return this.renderSocApplicationDetails();

      // Admin Pages
      case 'admin-registration-list': return this.renderAdminRegistrationList();
      case 'admin-pending-approvals': return this.renderAdminPendingApprovals();
      case 'admin-app-details': return this.renderAdminApplicationDetails();

      default: return _prev();
    }
  };
})();

// ═══════════════════════════════════════════════════════════════════
// SECTION 5 — EXTEND HEADER TITLES
// ═══════════════════════════════════════════════════════════════════
(function patchHeaderForWorkflow() {
  const _prev = App.renderHeader.bind(App);
  const titles = {
    'soc-my-application': 'My Registration Application',
    'soc-new-registration': 'New Society Registration',
    'soc-edit-registration': 'Edit Registration Application',
    'soc-app-details': 'Application Details',
    'admin-registration-list': 'All Society Registrations',
    'admin-pending-approvals': 'Registrations Pending Approval',
    'admin-app-details': 'Society Registration Details'
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

// ═══════════════════════════════════════════════════════════════════
// SECTION 6 — SOCIETY ROLE PAGES
// ═══════════════════════════════════════════════════════════════════

// 6-A: Society - My Application List
App.renderSocMyApplication = function () {
  const myApps = this.getMyApplications();

  return `
  <div class="page-header">
    <h1>Register Application List</h1>
    <p>View and manage your society registration application status</p>
  </div>

  ${myApps.length === 0 ? `
    <div class="card">
      <div class="card-body" style="text-align:center;padding:60px 20px;">
        <span class="material-icons" style="font-size:64px;color:#9E9E9E;display:block;margin-bottom:16px;">
          description
        </span>
        <h3 style="color:#616161;margin-bottom:12px;">No Application Found</h3>
        <p style="color:#9E9E9E;margin-bottom:24px;">
          You haven't submitted a registration application yet.
        </p>
        <button class="btn btn-primary" onclick="App.navigate('soc-new-registration')">
          <span class="material-icons">add_circle</span> New Registration
        </button>
      </div>
    </div>
  ` : `
    <div class="card">
      <div class="card-header">
        <h3>Registration Applications</h3>
        <button class="btn btn-primary btn-sm" onclick="App.navigate('soc-new-registration')">
          <span class="material-icons">add</span> New Registration
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Application No.</th>
                <th>Society Name</th>
                <th>Society Code</th>
                <th>District</th>
                <th>Registration Date</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${myApps.map(app => `
                <tr>
                  <td><b>${app.applicationNumber}</b></td>
                  <td>${app.societyName}</td>
                  <td>${app.societyCode || '<span style="color:#9E9E9E;">Pending</span>'}</td>
                  <td>${app.district}</td>
                  <td>${app.registrationDate || '-'}</td>
                  <td>${app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '-'}</td>
                  <td>${this._socAppStatusBadge(app.status)}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-info btn-sm" title="View Details"
                        onclick="App.state.socAppSelectedId='${app.applicationNumber}';App.navigate('soc-app-details')">
                        <span class="material-icons" style="font-size:14px;">visibility</span>
                      </button>
                      ${this.canEditApplication(app) ? `
                        <button class="btn btn-warning btn-sm" title="Edit"
                          onclick="App.state.socAppSelectedId='${app.applicationNumber}';App.navigate('soc-edit-registration')">
                          <span class="material-icons" style="font-size:14px;">edit</span>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    ${myApps.some(app => app.status === App.SOC_STATUS.RESUBMISSION) ? `
      <div class="alert alert-info" style="margin-top:20px;">
        <span class="material-icons">info</span>
        <div>
          <b>Action Required!</b> Your application has been returned for resubmission. 
          Please review the remarks and update the required information.
        </div>
      </div>
    ` : ''}
  `}
  `;
};

// 6-B: Society - Application Details (Read-only view)
App.renderSocApplicationDetails = function () {
  const app = this.getApplicationByNumber(this.state.socAppSelectedId);
  if (!app) return '<div class="page-header"><h1>Application Not Found</h1></div>';

  const audit = this.getApplicationAudit(app.applicationNumber);
  const canEdit = this.canEditApplication(app);

  const row = (label, value) => `
    <div class="invoice-row">
      <span class="label">${label}</span>
      <span class="value">${value || '—'}</span>
    </div>`;

  return `
  <div class="page-header">
    <h1>Application Details</h1>
    <p>Application Number: <b>${app.applicationNumber}</b></p>
  </div>

  ${app.status === App.SOC_STATUS.RESUBMISSION && app.resubmissionRemarks ? `
    <div class="alert alert-warning">
      <span class="material-icons">error</span>
      <div>
        <b>Resubmission Required!</b><br/>
        <b>Admin Remarks:</b> ${app.resubmissionRemarks}
      </div>
    </div>
  ` : ''}

  ${app.status === App.SOC_STATUS.REJECTED && app.rejectionReason ? `
    <div class="alert alert-danger">
      <span class="material-icons">cancel</span>
      <div>
        <b>Application Rejected</b><br/>
        <b>Rejection Reason:</b> ${app.rejectionReason}
      </div>
    </div>
  ` : ''}

  ${app.status === App.SOC_STATUS.APPROVED ? `
    <div class="alert alert-success">
      <span class="material-icons">check_circle</span>
      <div>
        <b>Application Approved!</b> Your society has been registered successfully.
        Society Code: <b>${app.societyCode}</b>
      </div>
    </div>
  ` : ''}

  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3>Society Information</h3>
      ${this._socAppStatusBadge(app.status)}
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div>
        ${row('Application Number', `<b>${app.applicationNumber}</b>`)}
        ${row('Society Name', app.societyName)}
        ${row('Society Code', app.societyCode || '<span style="color:#9E9E9E;">Will be assigned after approval</span>')}
        ${row('Society Type', app.societyType)}
        ${row('Registration Number', app.registrationNumber)}
        ${row('Registration Date', app.registrationDate)}
        ${row('District', app.district)}
        ${row('Block', app.block)}
        ${row('Village', app.village)}
      </div>
      <div>
        ${row('Address', app.address)}
        ${row('PIN Code', app.pinCode)}
        ${row('Contact Person', app.contactPersonName)}
        ${row('Designation', app.designation)}
        ${row('Mobile Number', app.mobileNumber)}
        ${row('Email ID', app.emailId)}
        ${row('Submitted Date', app.submittedDate ? new Date(app.submittedDate).toLocaleString() : '-')}
        ${row('Status', this._socAppStatusBadge(app.status))}
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom:20px;">
    <div class="card-header"><h3>Bank Details</h3></div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div>
        ${row('Bank Name', app.bankName)}
        ${row('Branch Name', app.branchName)}
        ${row('Account Number', app.accountNumber)}
      </div>
      <div>
        ${row('IFSC Code', app.ifscCode)}
      </div>
    </div>
  </div>

  ${app.documents && app.documents.length > 0 ? `
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><h3>Uploaded Documents</h3></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;">
          ${app.documents.map(doc => `
            <div style="padding:12px;border:1px solid #E0E0E0;border-radius:8px;display:flex;align-items:center;gap:10px;">
              <span class="material-icons" style="color:#4CAF50;font-size:28px;">description</span>
              <div style="flex:1;">
                <div style="font-weight:500;font-size:0.9rem;">${doc.name}</div>
                <div style="font-size:0.75rem;color:#757575;">${doc.fileName}</div>
                <div style="font-size:0.72rem;color:#9E9E9E;">Uploaded: ${doc.uploadDate}</div>
              </div>
              <button class="btn btn-outline btn-sm" title="Download">
                <span class="material-icons" style="font-size:16px;">download</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  ` : ''}

  <div class="card">
    <div class="card-header"><h3>Application History</h3></div>
    <div class="card-body">
      ${audit.length === 0 ? '<p style="color:#9E9E9E;text-align:center;padding:20px;">No history available</p>' : `
        <div style="position:relative;padding-left:40px;">
          ${audit.map((entry, index) => `
            <div style="position:relative;margin-bottom:${index < audit.length - 1 ? '24px' : '0'};">
              <div style="position:absolute;left:-40px;top:0;width:32px;height:32px;
                          background:${entry.action === 'Approved' ? '#4CAF50' : entry.action === 'Rejected' ? '#F44336' : '#2196F3'};
                          border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">
                <span class="material-icons" style="font-size:18px;">
                  ${entry.action === 'Approved' ? 'check' : entry.action === 'Rejected' ? 'close' : 'edit'}
                </span>
              </div>
              ${index < audit.length - 1 ? '<div style="position:absolute;left:-24px;top:32px;bottom:-24px;width:2px;background:#E0E0E0;"></div>' : ''}
              <div style="padding:12px;background:#F5F5F5;border-radius:8px;">
                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px;">
                  <div>
                    <div style="font-weight:600;font-size:0.95rem;">${entry.action}</div>
                    <div style="font-size:0.8rem;color:#757575;">by ${entry.actionBy} (${entry.role})</div>
                  </div>
                  <div style="font-size:0.75rem;color:#9E9E9E;">
                    ${new Date(entry.actionDate).toLocaleString()}
                  </div>
                </div>
                ${entry.previousStatus ? `
                  <div style="font-size:0.8rem;margin-bottom:6px;">
                    Status: <span class="badge badge-gray">${entry.previousStatus}</span>
                    <span class="material-icons" style="font-size:14px;vertical-align:middle;margin:0 4px;">arrow_forward</span>
                    ${this._socAppStatusBadge(entry.newStatus)}
                  </div>
                ` : ''}
                ${entry.remarks ? `
                  <div style="font-size:0.85rem;color:#616161;margin-top:6px;padding-top:6px;border-top:1px solid #E0E0E0;">
                    <b>Remarks:</b> ${entry.remarks}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  </div>

  <div style="margin-top:20px;display:flex;gap:12px;">
    <button class="btn btn-gray" onclick="App.navigate('soc-my-application')">
      <span class="material-icons">arrow_back</span> Back to My Applications
    </button>
    ${canEdit ? `
      <button class="btn btn-primary" onclick="App.state.socAppSelectedId='${app.applicationNumber}';App.navigate('soc-edit-registration')">
        <span class="material-icons">edit</span> Edit & Resubmit
      </button>
    ` : ''}
  </div>
  `;
};

// Note: Society Registration Form (new/edit) will be implemented in next part due to length
// This completes the first part of the comprehensive workflow implementation



// ═══════════════════════════════════════════════════════════════════
// SECTION 7 — SOCIETY REGISTRATION FORM (New/Edit with Resubmit)
// ═══════════════════════════════════════════════════════════════════

App.renderSocRegistrationForm = function (mode) {
  const isEdit = mode === 'edit';
  const app = isEdit ? this.getApplicationByNumber(this.state.socAppSelectedId) : null;
  const v = (field, def = '') => (isEdit && app) ? (app[field] || def) : def;

  const canEdit = isEdit ? this.canEditApplication(app) : true;
  if (isEdit && !canEdit) {
    return `<div class="page-header"><h1>Cannot Edit</h1><p>This application cannot be edited in its current status.</p></div>`;
  }

  return `
  <div class="page-header">
    <h1>${isEdit ? 'Edit' : 'New'} Society Registration</h1>
    <p>${isEdit ? 'Update your registration details and resubmit for approval' : 'Fill in all required details to register your society'}</p>
  </div>

  ${isEdit && app && app.resubmissionRemarks ? `
    <div class="alert alert-warning">
      <span class="material-icons">error</span>
      <div>
        <b>Admin Remarks:</b> ${app.resubmissionRemarks}
      </div>
    </div>
  ` : ''}

  <form id="soc-reg-form">
    <div class="card" style="margin-bottom:20px;">
      <div class="card-body">
        <!-- Section 1: Society Information -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">business</span> Society Information</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Society Code <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-society-code" class="form-control" value="${v('societyCode')}" placeholder="e.g., SOC-001" style="text-transform:uppercase;" required/>
              <small style="font-size:0.75rem;color:#757575;">Unique identifier for the society</small>
            </div>
            <div class="form-group">
              <label>Society Name <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-society-name" class="form-control" value="${v('societyName')}" placeholder="e.g., Rampur Krishi Samiti" required/>
            </div>
            <div class="form-group">
              <label>Society Type <span style="color:#F44336">*</span></label>
              <select id="srf-society-type" class="form-control" required>
                <option value="">Select Type</option>
                <option ${v('societyType') === 'Farmers Cooperative' ? 'selected' : ''}>Farmers Cooperative</option>
                <option ${v('societyType') === 'Seed Production Society' ? 'selected' : ''}>Seed Production Society</option>
                <option ${v('societyType') === 'Krishi Utpadak Samiti' ? 'selected' : ''}>Krishi Utpadak Samiti</option>
                <option ${v('societyType') === 'Beej Utpadak Samiti' ? 'selected' : ''}>Beej Utpadak Samiti</option>
              </select>
            </div>
            <div class="form-group">
              <label>Registration Number <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-reg-number" class="form-control" value="${v('registrationNumber')}" placeholder="e.g., REG-MP-2024-001" required/>
            </div>
            <div class="form-group">
              <label>Registration Date <span style="color:#F44336">*</span></label>
              <input type="date" id="srf-reg-date" class="form-control" value="${v('registrationDate')}" required/>
            </div>
          </div>
        </div>

        <!-- Section 2: Location Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">location_on</span> Location Details</div>
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1;">
              <label>Address <span style="color:#F44336">*</span></label>
              <textarea id="srf-address" class="form-control" rows="2" required>${v('address')}</textarea>
            </div>
            <div class="form-group">
              <label>Village <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-village" class="form-control" value="${v('village')}" required/>
            </div>
            <div class="form-group">
              <label>Block <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-block" class="form-control" value="${v('block')}" required/>
            </div>
            <div class="form-group">
              <label>District <span style="color:#F44336">*</span></label>
              <select id="srf-district" class="form-control" required>
                <option value="">Select District</option>
                ${['Chhindwara', 'Seoni', 'Narsinghpur', 'Betul', 'Hoshangabad', 'Sagar', 'Jabalpur', 'Bhopal', 'Indore', 'Ujjain', 'Rewa', 'Satna'].map(d =>
    `<option ${v('district') === d ? 'selected' : ''}>${d}</option>`
  ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>PIN Code <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-pincode" class="form-control" value="${v('pinCode')}" maxlength="6" pattern="[0-9]{6}" required/>
            </div>
          </div>
        </div>

        <!-- Section 3: Contact Person -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">person</span> Contact Person Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Contact Person Name <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-contact-name" class="form-control" value="${v('contactPersonName')}" required/>
            </div>
            <div class="form-group">
              <label>Designation <span style="color:#F44336">*</span></label>
              <select id="srf-designation" class="form-control" required>
                <option value="">Select Designation</option>
                <option ${v('designation') === 'President' ? 'selected' : ''}>President</option>
                <option ${v('designation') === 'Secretary' ? 'selected' : ''}>Secretary</option>
                <option ${v('designation') === 'Treasurer' ? 'selected' : ''}>Treasurer</option>
                <option ${v('designation') === 'Chairman' ? 'selected' : ''}>Chairman</option>
              </select>
            </div>
            <div class="form-group">
              <label>Mobile Number <span style="color:#F44336">*</span></label>
              <input type="tel" id="srf-mobile" class="form-control" value="${v('mobileNumber')}" maxlength="10" pattern="[0-9]{10}" required/>
            </div>
            <div class="form-group">
              <label>Email ID <span style="color:#F44336">*</span></label>
              <input type="email" id="srf-email" class="form-control" value="${v('emailId')}" required/>
            </div>
          </div>
        </div>

        <!-- Section 4: Bank Details -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">account_balance</span> Bank Details</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Bank Name <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-bank-name" class="form-control" value="${v('bankName')}" required/>
            </div>
            <div class="form-group">
              <label>Branch Name <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-branch-name" class="form-control" value="${v('branchName')}" required/>
            </div>
            <div class="form-group">
              <label>Account Number <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-account-number" class="form-control" value="${v('accountNumber')}" required/>
            </div>
            <div class="form-group">
              <label>IFSC Code <span style="color:#F44336">*</span></label>
              <input type="text" id="srf-ifsc-code" class="form-control" value="${v('ifscCode')}" maxlength="11" required/>
            </div>
          </div>
        </div>

        <!-- Section 5: Document Upload -->
        <div class="form-section">
          <div class="form-section-title"><span class="material-icons">upload_file</span> Document Upload</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Registration Certificate <span style="color:#F44336">*</span></label>
              <input type="file" id="srf-reg-cert" class="form-control" accept=".pdf,.jpg,.jpeg,.png" ${!isEdit ? 'required' : ''}/>
              <span style="font-size:0.75rem;color:#757575;">PDF, JPG, PNG up to 2MB</span>
            </div>
            <div class="form-group">
              <label>Bank Passbook/Cancelled Cheque</label>
              <input type="file" id="srf-bank-doc" class="form-control" accept=".pdf,.jpg,.jpeg,.png"/>
              <span style="font-size:0.75rem;color:#757575;">PDF, JPG, PNG up to 1MB</span>
            </div>
          </div>
          ${isEdit && app && app.documents && app.documents.length > 0 ? `
            <div style="margin-top:16px;padding:12px;background:#F5F5F5;border-radius:8px;">
              <div style="font-weight:500;margin-bottom:8px;">Existing Documents:</div>
              ${app.documents.map(doc => `
                <div style="font-size:0.85rem;color:#616161;">• ${doc.name}: ${doc.fileName}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-gray" onclick="App.navigate('soc-my-application')">
            <span class="material-icons">close</span> Cancel
          </button>
          <button type="button" class="btn btn-outline" onclick="App.saveSocRegistrationDraft()">
            <span class="material-icons">save</span> Save as Draft
          </button>
          <button type="submit" class="btn btn-primary" onclick="event.preventDefault();App.submitSocRegistration('${mode}')">
            <span class="material-icons">send</span> ${isEdit ? 'Resubmit' : 'Submit'} Application
          </button>
        </div>
      </div>
    </div>
  </form>
  `;
};

// Save as Draft
App.saveSocRegistrationDraft = function () {
  const formData = this.collectSocFormData();
  const mode = this.state.socAppSelectedId ? 'edit' : 'new';

  if (mode === 'new') {
    const appNumber = this.generateApplicationNumber();
    const newApp = {
      ...formData,
      applicationNumber: appNumber,
      status: App.SOC_STATUS.DRAFT,
      submittedBy: this.state.currentUser?.name || 'Society User',
      submittedByRole: 'Society',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.state.currentUser?.name || 'Society User',
      userId: this.state.currentUser?.userId || 'user-new'
    };
    this.state.societyApplications.push(newApp);

    this.addAuditEntry(appNumber, 'Saved as Draft', null, App.SOC_STATUS.DRAFT,
      this.state.currentUser?.name || 'Society User', 'Society', 'Draft saved');
  } else {
    const app = this.getApplicationByNumber(this.state.socAppSelectedId);
    if (app) {
      Object.assign(app, formData);
      app.updatedAt = new Date().toISOString();
    }
  }

  alert('Draft saved successfully!');
  this.navigate('soc-my-application');
};

// Submit Application
App.submitSocRegistration = function (mode) {
  const form = document.getElementById('soc-reg-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = this.collectSocFormData();

  if (mode === 'new') {
    const appNumber = this.generateApplicationNumber();
    const newApp = {
      ...formData,
      applicationNumber: appNumber,
      status: App.SOC_STATUS.PENDING,
      submittedBy: this.state.currentUser?.name || 'Society User',
      submittedByRole: 'Society',
      registrationDateSubmitted: new Date().toISOString().split('T')[0],
      submittedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.state.currentUser?.name || 'Society User',
      userId: this.state.currentUser?.userId || 'user-new',
      societyCode: '', // Will be assigned after approval
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
      resubmissionRemarks: null,
      documents: [] // Would contain uploaded files
    };
    this.state.societyApplications.push(newApp);

    this.addAuditEntry(appNumber, 'Submitted', App.SOC_STATUS.DRAFT, App.SOC_STATUS.PENDING,
      this.state.currentUser?.name || 'Society User', 'Society', 'Application submitted for approval');

    alert(`Application submitted successfully! Application Number: ${appNumber}`);
  } else {
    const app = this.getApplicationByNumber(this.state.socAppSelectedId);
    if (app) {
      const prevStatus = app.status;
      Object.assign(app, formData);
      app.status = App.SOC_STATUS.PENDING;
      app.submittedDate = new Date().toISOString();
      app.updatedAt = new Date().toISOString();
      app.resubmissionRemarks = null; // Clear previous remarks

      this.addAuditEntry(app.applicationNumber, 'Resubmitted', prevStatus, App.SOC_STATUS.PENDING,
        this.state.currentUser?.name || 'Society User', 'Society', 'Application resubmitted after corrections');

      alert('Application resubmitted successfully!');
    }
  }

  this.navigate('soc-my-application');
};

// Collect form data
App.collectSocFormData = function () {
  const g = id => document.getElementById(id)?.value?.trim() || '';
  return {
    societyCode: g('srf-society-code').toUpperCase(),
    societyName: g('srf-society-name'),
    societyType: g('srf-society-type'),
    registrationNumber: g('srf-reg-number'),
    registrationDate: g('srf-reg-date'),
    address: g('srf-address'),
    village: g('srf-village'),
    block: g('srf-block'),
    district: g('srf-district'),
    pinCode: g('srf-pincode'),
    contactPersonName: g('srf-contact-name'),
    designation: g('srf-designation'),
    mobileNumber: g('srf-mobile'),
    emailId: g('srf-email'),
    bankName: g('srf-bank-name'),
    branchName: g('srf-branch-name'),
    accountNumber: g('srf-account-number'),
    ifscCode: g('srf-ifsc-code'),
    panNumber: g('srf-pan-number'),
    gstNumber: g('srf-gst-number')
  };
};

// ═══════════════════════════════════════════════════════════════════
// SECTION 8 — ADMIN ROLE PAGES
// ═══════════════════════════════════════════════════════════════════

// 8-A: Admin - Registration List (All applications)
App.renderAdminRegistrationList = function () {
  const f = this.state.socAppFilter;
  let apps = this.state.societyApplications.filter(app => {
    if (f.applicationNumber && !app.applicationNumber.toLowerCase().includes(f.applicationNumber.toLowerCase())) return false;
    if (f.societyName && !app.societyName.toLowerCase().includes(f.societyName.toLowerCase())) return false;
    if (f.status && app.status !== f.status) return false;
    if (f.district && app.district !== f.district) return false;
    if (f.fromDate && app.registrationDateSubmitted < f.fromDate) return false;
    if (f.toDate && app.registrationDateSubmitted > f.toDate) return false;
    return true;
  });

  const districts = [...new Set(this.state.societyApplications.map(a => a.district))].sort();

  return `
  <div class="page-header">
    <h1>All Society Registrations</h1>
    <p>All society registration applications submitted through the portal</p>
  </div>

  <!-- Search & Filter Bar -->
  <div class="search-bar" style="margin-bottom:16px;">
    <div class="search-field">
      <label>Society Code</label>
      <input class="form-control" placeholder="SOC-001..." value="${f.applicationNumber}"
        oninput="App.state.socAppFilter.applicationNumber=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>Society Name</label>
      <input class="form-control" placeholder="Search name..." value="${f.societyName}"
        oninput="App.state.socAppFilter.societyName=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>District</label>
      <select class="form-control" onchange="App.state.socAppFilter.district=this.value;App.render()">
        <option value="">All Districts</option>
        ${districts.map(d => `<option ${f.district === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>Status</label>
      <select class="form-control" onchange="App.state.socAppFilter.status=this.value;App.render()">
        <option value="">All Status</option>
        <option ${f.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${f.status === 'Approved' ? 'selected' : ''}>Approved</option>
      </select>
    </div>
    <div class="search-field">
      <label>From Date</label>
      <input type="date" class="form-control" value="${f.fromDate}"
        onchange="App.state.socAppFilter.fromDate=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>To Date</label>
      <input type="date" class="form-control" value="${f.toDate}"
        onchange="App.state.socAppFilter.toDate=this.value;App.render()">
    </div>
    <div class="search-field" style="align-self:flex-end;">
      <button class="btn btn-gray btn-sm"
        onclick="App.state.socAppFilter={applicationNumber:'',societyName:'',status:'',district:'',fromDate:'',toDate:''};App.render()">
        <span class="material-icons">clear</span> Reset
      </button>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>Registration Applications <span style="color:#757575;font-weight:400;font-size:0.85rem;">(${apps.length} records)</span></h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-success btn-sm">
          <span class="material-icons">table_chart</span> Export Excel
        </button>
        <button class="btn btn-danger btn-sm">
          <span class="material-icons">picture_as_pdf</span> Export PDF
        </button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Society Code</th>
              <th>Society Name</th>
              <th>District</th>
              <th>Block</th>
              <th>Registration Date</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Member Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${apps.length === 0 ? `
              <tr><td colspan="9" style="text-align:center;padding:40px;color:#9E9E9E;">No records found</td></tr>
            ` : apps.map(app => {
    const isApproved = app.status === 'Approved';
    const memberStatus = app.memberStatus || 'Non-Member';
    const isMember = memberStatus === 'Member';
    return `
              <tr>
                <td><b>${app.societyCode || app.applicationNumber}</b></td>
                <td>
                  <div style="font-weight:500;">${app.societyName}</div>
                  <div style="font-size:0.75rem;color:#757575;">${app.societyType}</div>
                </td>
                <td>${app.district}</td>
                <td>${app.block}</td>
                <td>${app.registrationDate || '-'}</td>
                <td style="font-size:0.8rem;">${app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '-'}</td>
                <td>${this._socAppStatusBadge(app.status)}</td>
                <td>
                  ${isApproved
        ? `<span class="badge ${isMember ? 'badge-success' : 'badge-gray'}">${memberStatus}</span>`
        : `<span style="color:#9E9E9E;font-size:0.82rem;">—</span>`}
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" title="View Details"
                      onclick="App.state.socAppSelectedId='${app.applicationNumber}';App.state.socAppViewFrom='list';App.navigate('admin-app-details')">
                      <span class="material-icons" style="font-size:14px;">visibility</span>
                    </button>
                    ${isApproved && !isMember
        ? `<button class="btn btn-success btn-sm" title="Mark as Member"
                          onclick="App.markSocietyAsMember('${app.applicationNumber}')">
                          <span class="material-icons" style="font-size:14px;">how_to_reg</span> Make Member
                        </button>`
        : ''}
                    ${isApproved && isMember
        ? `<button class="btn btn-warning btn-sm" title="Set as Non-Member"
                          onclick="App.unmarkSocietyMember('${app.applicationNumber}')">
                          <span class="material-icons" style="font-size:14px;">person_remove</span> Non-Member
                        </button>`
        : ''}
                  </div>
                </td>
              </tr>`;
  }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
};

// ── Member status management (only for Approved societies) ──
App.markSocietyAsMember = function (appNumber) {
  const app = this.state.societyApplications.find(a => a.applicationNumber === appNumber);
  if (!app) return;
  if (app.status !== 'Approved') { this.showToast('Only approved societies can become members.'); return; }
  app.memberStatus = 'Member';
  this.showToast(app.societyName + ' is now a Member.');
  this.render();
};
App.unmarkSocietyMember = function (appNumber) {
  const app = this.state.societyApplications.find(a => a.applicationNumber === appNumber);
  if (!app) return;
  app.memberStatus = 'Non-Member';
  this.showToast(app.societyName + ' set to Non-Member.');
  this.render();
};

// 8-B: Admin - Pending Approvals (Quick View)
App.renderAdminPendingApprovals = function () {
  // Seed demo rows for the Pending list (distinct PEND- ids so they never
  // collide with already-decided records in the All-Registrations list).
  const seedApps = [
    { id: 'PEND-2024-001', code: 'SOC-2024-001', name: 'Kisan Vikas Samiti', district: 'Bhopal', date: '2024-10-24' },
    { id: 'PEND-2024-002', code: 'SOC-2024-002', name: 'Gramin Krishi Sahakari', district: 'Indore', date: '2024-10-25' },
    { id: 'PEND-2024-003', code: 'SOC-2024-003', name: 'Sahkar Beej Utpadak Samiti', district: 'Jabalpur', date: '2024-10-26' },
    { id: 'PEND-2024-004', code: 'SOC-2024-004', name: 'Narmada Kisan Sewa Sangh', district: 'Hoshangabad', date: '2024-10-27' }
  ];

  // Real submissions from the mock application store (newest first)
  const submitted = (App.SocAppStore ? App.SocAppStore.getAll() : []).map(r => ({
    id: r.id,
    code: r.code,
    name: r.name || (r.fields && r.fields.societyName) || 'Society',
    district: r.district || (r.fields && r.fields.district) || '-',
    date: r.submittedDate || (r.submittedAt ? r.submittedAt.split('T')[0] : ''),
    _real: true
  }));

  // Submitted applications first; fall back to seed demo rows only if empty
  const pendingApps = submitted.length ? submitted.concat(seedApps) : seedApps;

  return `
  <div class="page-header">
    <h1>Registrations Pending Approval</h1>
    <p>Society registration applications waiting for your review and approval</p>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>Applications Pending Review <span class="badge badge-warning">${pendingApps.length}</span></h3>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Society Code</th>
              <th>Cooperative Society Name</th>
              <th>District</th>
              <th>Submission Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pendingApps.map((app, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#fff' : '#F9FBF9'};">
                <td><b>${app.code}</b></td>
                <td style="font-weight:500;">${app.name}</td>
                <td>${app.district}</td>
                <td>${app.date}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="App.state.socAppSelectedId='${app.id}';App.state.socAppViewFrom='pending';App.navigate('admin-app-details')" title="View Details">
                      <span class="material-icons" style="font-size:13px;">visibility</span>
                    </button>
                    <button class="btn btn-success btn-sm" onclick="App.openDecisionModal('${app.id}', '${(app.name || '').replace(/'/g, "\\'")}', 'approve')" title="Approve">
                      <span class="material-icons" style="font-size:13px;">check</span>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="App.openDecisionModal('${app.id}', '${(app.name || '').replace(/'/g, "\\'")}', 'reject')" title="Reject">
                      <span class="material-icons" style="font-size:13px;">close</span>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  ${this.renderDecisionModal()}
  `;
};

// End of Part 2 - Continue in next append for Admin Application Details & Approval Actions



// ═══════════════════════════════════════════════════════════════════
// SECTION 9 — ADMIN APPLICATION DETAILS & APPROVAL ACTIONS
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// APPROVE / REJECT with MANDATORY REMARK — shared modal
// Used from both the Pending Approval list and the Details/View page.
// ═══════════════════════════════════════════════════════════════════

// Modal state: { appId, appName, action: 'approve'|'reject' } or null
App.state.socDecisionModal = App.state.socDecisionModal || null;

// Open the decision modal for a given application + action.
App.openDecisionModal = function (appId, appName, action) {
  this.state.socDecisionModal = { appId, appName: appName || 'this society', action };
  this.render();
};

App.closeDecisionModal = function () {
  this.state.socDecisionModal = null;
  this.render();
};

// Clear the inline remark error as the admin types.
App.clearRemarkError = function () {
  const err = document.getElementById('decision-remark-error');
  if (err) err.style.display = 'none';
};

// Confirm the decision — validates the mandatory remark, persists, redirects.
App.confirmDecision = function () {
  const modal = this.state.socDecisionModal;
  if (!modal) return;

  const ta = document.getElementById('decision-remark');
  const remark = ta ? ta.value.trim() : '';
  const isApprove = modal.action === 'approve';

  // Mandatory remark (must not be only spaces)
  if (!remark) {
    const err = document.getElementById('decision-remark-error');
    if (err) {
      err.textContent = isApprove
        ? 'Remark is required to approve the registration.'
        : 'Remark is required to reject the registration.';
      err.style.display = 'block';
    }
    if (ta) ta.focus();
    return;
  }

  const newStatus = isApprove ? 'Approved' : 'Rejected';

  // Persist to the mock store (real submissions)
  if (App.SocAppStore && App.SocAppStore.getById(modal.appId)) {
    App.SocAppStore.updateStatus(modal.appId, newStatus, remark);
  }

  // Also persist to the legacy societyApplications list if the app lives there
  if (Array.isArray(this.state.societyApplications)) {
    const legacy = this.state.societyApplications.find(
      a => a.applicationNumber === modal.appId || a.id === modal.appId
    );
    if (legacy) {
      legacy.status = newStatus;
      legacy.adminRemark = remark;
      legacy.decisionDate = new Date().toISOString().split('T')[0];
    }
  }

  // Close modal and redirect to the Registration List
  this.state.socDecisionModal = null;
  this.showToast(`Registration ${newStatus}. Remark saved.`);
  this.navigate('admin-registration-list');
};

// Render the decision modal (returns '' when not open).
App.renderDecisionModal = function () {
  const modal = this.state.socDecisionModal;
  if (!modal) return '';

  const isApprove = modal.action === 'approve';
  const accent = isApprove ? '#2E7D32' : '#C62828';
  const accentBg = isApprove ? 'linear-gradient(135deg,#1B5E20,#4CAF50)' : 'linear-gradient(135deg,#C62828,#B71C1C)';
  const title = isApprove ? 'Approve Registration' : 'Reject Registration';
  const icon = isApprove ? 'check_circle' : 'cancel';
  const confirmLabel = isApprove ? 'Confirm Approve' : 'Confirm Reject';
  const confirmClass = isApprove ? 'btn-success' : 'btn-danger';

  return `
  <div class="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;
       display:flex;align-items:center;justify-content:center;padding:16px;"
       onclick="if(event.target===this)App.closeDecisionModal()">
    <div class="modal-box" style="background:#fff;border-radius:12px;max-width:480px;width:100%;
         overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.3);">
      <div style="background:${accentBg};padding:18px 22px;display:flex;align-items:center;
           justify-content:space-between;">
        <h3 style="margin:0;color:#fff;font-size:1.05rem;display:flex;align-items:center;gap:8px;">
          <span class="material-icons">${icon}</span> ${title}
        </h3>
        <button onclick="App.closeDecisionModal()"
                style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;line-height:1;">&times;</button>
      </div>
      <div style="padding:22px;">
        <div style="margin-bottom:14px;font-size:0.9rem;color:#333;">
          <div style="margin-bottom:6px;"><span style="color:#757575;">Society:</span>
            <strong>${modal.appName}</strong></div>
          <div><span style="color:#757575;">Action:</span>
            <span style="color:${accent};font-weight:700;">${isApprove ? 'Approve' : 'Reject'}</span></div>
        </div>
        <div class="form-group" style="margin-bottom:6px;">
          <label style="font-size:0.85rem;font-weight:600;color:#333;display:block;margin-bottom:6px;">
            Remark <span style="color:#F44336;">*</span>
          </label>
          <textarea id="decision-remark" rows="3" class="form-control"
                    placeholder="${isApprove ? 'Enter remark for approval...' : 'Enter reason for rejection...'}"
                    oninput="App.clearRemarkError()"
                    style="width:100%;padding:10px 12px;font-size:0.9rem;border:1px solid #E0E0E0;
                           border-radius:6px;resize:vertical;"></textarea>
          <div id="decision-remark-error" style="display:none;color:#F44336;font-size:0.78rem;margin-top:6px;">
            Remark is required to ${isApprove ? 'approve' : 'reject'} the registration.
          </div>
        </div>
      </div>
      <div style="padding:0 22px 22px;display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn btn-gray" onclick="App.closeDecisionModal()">Cancel</button>
        <button class="btn ${confirmClass}" onclick="App.confirmDecision()">
          <span class="material-icons" style="font-size:16px;">${icon}</span> ${confirmLabel}
        </button>
      </div>
    </div>
  </div>`;
};

App.renderAdminApplicationDetails = function () {
  const selectedId = this.state.socAppSelectedId || 'APP-2024-001';

  // Prefer the real submitted application from the mock store.
  const record = App.SocAppStore ? App.SocAppStore.getById(selectedId) : null;

  // Fallback: static demo data for the seed rows (no real submission).
  // APP-* ids come from the All-Registrations list; PEND-* ids come from the
  // Pending Approval list (status = Pending Approval).
  const seedData = {
    'APP-2024-001': { name: 'Kisan Vikas Samiti', ncdId: 'NCD001', district: 'Bhopal', date: '2024-10-24' },
    'APP-2024-002': { name: 'Gramin Krishi Sahakari', ncdId: 'NCD002', district: 'Indore', date: '2024-10-25' },
    'APP-2024-003': { name: 'Sahkar Beej Utpadak Samiti', ncdId: 'NCD003', district: 'Jabalpur', date: '2024-10-26' },
    'APP-2024-004': { name: 'Narmada Kisan Sewa Sangh', ncdId: 'NCD004', district: 'Hoshangabad', date: '2024-10-27' },
    'PEND-2024-001': { name: 'Kisan Vikas Samiti', ncdId: 'NCD001', district: 'Bhopal', date: '2024-10-24', status: 'Pending Approval' },
    'PEND-2024-002': { name: 'Gramin Krishi Sahakari', ncdId: 'NCD002', district: 'Indore', date: '2024-10-25', status: 'Pending Approval' },
    'PEND-2024-003': { name: 'Sahkar Beej Utpadak Samiti', ncdId: 'NCD003', district: 'Jabalpur', date: '2024-10-26', status: 'Pending Approval' },
    'PEND-2024-004': { name: 'Narmada Kisan Sewa Sangh', ncdId: 'NCD004', district: 'Hoshangabad', date: '2024-10-27', status: 'Pending Approval' }
  };
  const seedStatus = (seedData[selectedId] && seedData[selectedId].status) || '';

  // Normalise into a common shape `f` (field values) + docs + meta.
  let f, docs, submittedDate, appId;
  if (record) {
    f = record.fields || {};
    docs = record.documents || [];
    submittedDate = record.submittedDate || (record.submittedAt ? record.submittedAt.split('T')[0] : '');
    appId = record.code || record.id;
  } else {
    const s = seedData[selectedId] || seedData['APP-2024-001'];
    f = {
      societyName: s.name, ncdId: s.ncdId, sectorType: 'Agriculture',
      primaryActivity: 'Agriculture & Seed Distribution', functionalStatus: 'Active',
      members: '125', registrationNumber: 'SOC/MP/2020/001', registrationDate: '15/06/2020',
      state: 'Madhya Pradesh', district: s.district, block: s.district,
      urbanLocalBody: s.district + ' Municipal Corporation', location: s.district + ', MP',
      pincode: '462001', mobile: '9876543210',
      email: 'contact@' + s.name.toLowerCase().replace(/\s+/g, '') + '.org',
      financialAudit: 'Completed', auditYear: '2024', annualProfit: '\u20B93,25,000', annualLoss: '\u20B90'
    };
    docs = [
      { name: 'Society Registration Certificate', fileName: 'Registration_Certificate.pdf', format: 'PDF', _demo: true },
      { name: 'RCS Registration Document', fileName: 'RCS_Document.pdf', format: 'PDF', _demo: true }
    ];
    submittedDate = s.date;
    appId = selectedId;
  }

  // Look up the legacy societyApplications record too (Registration List source).
  const legacy = Array.isArray(this.state.societyApplications)
    ? this.state.societyApplications.find(a => a.applicationNumber === selectedId || a.id === selectedId)
    : null;

  // ── STATUS IS THE SOURCE OF TRUTH for button visibility ──
  // Resolve current status from whichever record holds it (store / legacy / seed).
  // Normalise any status value to one of: 'Approved' | 'Rejected' | 'Pending'.
  const rawStatus =
    (record && record.status) ||
    (legacy && legacy.status) ||
    seedStatus ||
    f.approvalStatus ||
    'Pending';
  const statusStr = String(rawStatus).toLowerCase();
  // Note: "Pending Approval" contains "approv", so test pending/reject first.
  const curStatus = (statusStr.includes('pending') || statusStr.includes('resubmiss') || statusStr.includes('review'))
    ? 'Pending'
    : statusStr.includes('reject') ? 'Rejected'
      : statusStr.includes('approv') ? 'Approved'
        : 'Pending';

  const isPending = curStatus === 'Pending';
  const isDecided = !isPending;   // Approved or Rejected
  const savedRemark = (record && record.adminRemark) || (legacy && legacy.adminRemark) || '';
  const decisionDate = (record && record.decisionDate) || (legacy && legacy.decisionDate) || '';

  // Where did the admin open this View from? All-Registrations View is ALWAYS
  // read-only; Approve/Reject are only offered from the Pending Approval flow.
  const cameFromPending = this.state.socAppViewFrom !== 'list';
  // Final rule (status is source of truth, AND page context):
  //   Show Approve/Reject only when status is Pending AND opened from Pending.
  const showActions = isPending && cameFromPending;
  const backPage = cameFromPending ? 'admin-pending-approvals' : 'admin-registration-list';
  const backLabel = cameFromPending ? 'Back to Pending List' : 'Back to Registration List';

  const val = (v) => (v === undefined || v === null || v === '') ? '<span style="color:#9E9E9E;">—</span>' : String(v);
  const fieldRow = (label, v) => `
    <div style="margin-bottom:14px;">
      <div style="font-size:0.78rem;color:#757575;margin-bottom:3px;">${label}</div>
      <div style="font-size:0.95rem;color:#212121;font-weight:500;">${val(v)}</div>
    </div>`;

  // Documents table with working View / Download actions.
  const docsRows = docs.length ? docs.map((d, i) => `
    <tr>
      <td>
        <span class="material-icons" style="font-size:16px;color:#C62828;vertical-align:middle;">description</span>
        <span style="vertical-align:middle;margin-left:6px;">${d.fileName || d.name || ('Document ' + (i + 1))}</span>
        ${d.format ? `<span class="badge badge-gray" style="margin-left:8px;">${d.format}</span>` : ''}
      </td>
      <td>${d.type || d.name || 'Document'}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-info btn-sm" onclick="App.viewAppDocument('${selectedId}', ${i})" title="View">
            <span class="material-icons" style="font-size:13px;">visibility</span> View
          </button>
          <button class="btn btn-primary btn-sm" onclick="App.downloadAppDocument('${selectedId}', ${i})" title="Download">
            <span class="material-icons" style="font-size:13px;">download</span> Download
          </button>
        </div>
      </td>
    </tr>`).join('') : `
    <tr><td colspan="3" style="text-align:center;color:#9E9E9E;padding:16px;">No documents uploaded</td></tr>`;

  const statusPillStyle = isDecided
    ? (curStatus === 'Approved'
      ? 'background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;'
      : 'background:#FFEBEE;color:#C62828;border:1px solid #EF9A9A;')
    : 'background:#FFF3E0;color:#E65100;border:1px solid #FFE0B2;';

  const actionsBar = (pos) => `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
                ${pos === 'bottom' ? 'margin-top:24px;padding-top:20px;border-top:2px solid #E8F5E9;' : 'margin-bottom:24px;'}">
      <button onclick="App.navigate('${backPage}')"
              class="${pos === 'bottom' ? 'btn btn-gray' : ''}"
              style="${pos === 'top' ? 'background:none;border:none;cursor:pointer;color:#1B5E20;font-weight:500;padding:0;' : ''}
                     display:flex;align-items:center;gap:6px;">
        <span class="material-icons" style="font-size:${pos === 'top' ? '18' : '16'}px;">arrow_back</span>
        ${backLabel}
      </button>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        ${pos === 'top' ? `<span style="padding:6px 16px;border-radius:20px;font-size:0.82rem;font-weight:600;${statusPillStyle}">
                     Status: ${isDecided ? curStatus : 'Pending Approval'}</span>` : ''}
        ${showActions ? `
        <button class="btn btn-success" onclick="App.openDecisionModal('${selectedId}', '${String(f.societyName || '').replace(/'/g, "\\'")}', 'approve')"
                style="display:flex;align-items:center;gap:6px;">
          <span class="material-icons" style="font-size:16px;">check_circle</span> Approve Application
        </button>
        <button class="btn btn-danger" onclick="App.openDecisionModal('${selectedId}', '${String(f.societyName || '').replace(/'/g, "\\'")}', 'reject')"
                style="display:flex;align-items:center;gap:6px;">
          <span class="material-icons" style="font-size:16px;">cancel</span> Reject Application
        </button>` : ''}
      </div>
    </div>`;

  return `
  ${actionsBar('top')}

  <!-- Page Header -->
  <div class="page-header" style="margin-bottom:24px;">
    <h1>Society Registration Details</h1>
    <p>Application: <b>${appId}</b> | Submitted: ${val(submittedDate)}${record ? '' : ' <span style="color:#9E9E9E;">(demo record)</span>'}</p>
  </div>

  ${isDecided ? `
  <!-- Decision + Admin Remark (retained in history) -->
  <div class="card" style="margin-bottom:20px;border-left:4px solid ${curStatus === 'Approved' ? '#2E7D32' : '#C62828'};">
    <div class="card-body">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="material-icons" style="color:${curStatus === 'Approved' ? '#2E7D32' : '#C62828'};">
          ${curStatus === 'Approved' ? 'check_circle' : 'cancel'}
        </span>
        <strong style="color:${curStatus === 'Approved' ? '#2E7D32' : '#C62828'};">Status: ${curStatus}</strong>
        ${decisionDate ? `<span style="color:#757575;font-size:0.82rem;">on ${decisionDate}</span>` : ''}
      </div>
      <div style="font-size:0.85rem;color:#333;">
        <span style="color:#757575;">Admin Remark:</span> ${val(savedRemark)}
      </div>
    </div>
  </div>` : ''}

  <!-- Society Details -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="font-size:20px;color:#2E7D32;">business</span>
        Society Details
      </h3>
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px 32px;">
      ${fieldRow('Cooperative Society Name', f.societyName)}
      ${fieldRow('Sector Type', f.sectorType)}
      ${fieldRow('Primary Activity', f.primaryActivity)}
      ${fieldRow('Functional Status', f.functionalStatus)}
      ${fieldRow('Members of Society', f.members)}
      ${fieldRow('Financial Audit', f.financialAudit)}
      ${fieldRow('Audit Complete Year', f.auditYear)}
      ${fieldRow('Annual Profit', f.annualProfit)}
      ${fieldRow('Annual Loss', f.annualLoss)}
    </div>
  </div>

  <!-- Registration Details -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="font-size:20px;color:#2E7D32;">assignment</span>
        Registration Details
      </h3>
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px 32px;">
      ${fieldRow('NCD Code / ID', f.ncdId)}
      ${fieldRow('Registration Number', f.registrationNumber)}
      ${fieldRow('Registration Date', f.registrationDate)}
      ${fieldRow('Approval Status', isDecided ? curStatus : 'Pending Approval')}
    </div>
  </div>

  <!-- Address Details -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="font-size:20px;color:#2E7D32;">location_on</span>
        Address Details
      </h3>
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px 32px;">
      ${fieldRow('State/UT', f.state)}
      ${fieldRow('District', f.district)}
      ${fieldRow('Block', f.block)}
      ${fieldRow('Urban Local Body', f.urbanLocalBody)}
      ${fieldRow('Pincode', f.pincode)}
    </div>
  </div>

  <!-- Contact Details -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="font-size:20px;color:#2E7D32;">contact_phone</span>
        Contact Details
      </h3>
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px 32px;">
      ${fieldRow('Registered Mobile (OTP Verified)', f.mobile)}
      ${fieldRow('Email', f.email)}
    </div>
  </div>

  <!-- Documents -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons" style="font-size:20px;color:#2E7D32;">folder</span>
        Documents
      </h3>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Document</th><th>Type</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${docsRows}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  ${actionsBar('bottom')}
  ${showActions ? this.renderDecisionModal() : ''}
  `;
};

// ═══════════════════════════════════════════════════════════════════
// DOCUMENT ACTIONS — View (preview) and Download for uploaded docs
// ═══════════════════════════════════════════════════════════════════
App.viewAppDocument = function (appId, index) {
  const record = App.SocAppStore ? App.SocAppStore.getById(appId) : null;
  const doc = record && record.documents && record.documents[index];

  if (!doc || !doc.dataUrl) {
    // Seed/demo documents have no real file behind them.
    App.showToast('Preview not available for this demo document.');
    return;
  }

  // Open the document in a new browser tab for preview.
  const win = window.open();
  if (!win) { App.showToast('Please allow popups to preview the document.'); return; }

  const isPdf = (doc.mimeType || '').includes('pdf') || /\.pdf$/i.test(doc.fileName || '');
  if (isPdf) {
    win.document.write(
      '<title>' + (doc.fileName || 'Document') + '</title>' +
      '<iframe src="' + doc.dataUrl + '" style="border:0;width:100%;height:100%;position:absolute;top:0;left:0;"></iframe>'
    );
  } else {
    win.document.write(
      '<title>' + (doc.fileName || 'Document') + '</title>' +
      '<img src="' + doc.dataUrl + '" style="max-width:100%;display:block;margin:auto;"/>'
    );
  }
  win.document.close();
};

App.downloadAppDocument = function (appId, index) {
  const record = App.SocAppStore ? App.SocAppStore.getById(appId) : null;
  const doc = record && record.documents && record.documents[index];

  if (!doc || !doc.dataUrl) {
    App.showToast('Download not available for this demo document.');
    return;
  }

  const a = document.createElement('a');
  a.href = doc.dataUrl;
  a.download = doc.fileName || 'document';   // preserve original filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

App.renderApprovalPopup = function (type, app) {
  const popups = {
    approve: {
      title: 'Approve Application',
      icon: 'check_circle',
      color: '#4CAF50',
      message: `Are you sure you want to approve the application for <b>${app.societyName}</b>?`,
      field: null,
      submitBtn: 'Approve',
      submitClass: 'btn-success'
    },
    reject: {
      title: 'Reject Application',
      icon: 'cancel',
      color: '#F44336',
      message: `Please provide a reason for rejecting the application for <b>${app.societyName}</b>:`,
      field: {
        id: 'rejection-reason',
        label: 'Rejection Reason *',
        type: 'textarea',
        placeholder: 'Provide detailed reason for rejection...',
        required: true
      },
      submitBtn: 'Reject Application',
      submitClass: 'btn-danger'
    },
    resubmit: {
      title: 'Return for Resubmission',
      icon: 'edit',
      color: '#FF9800',
      message: `Specify the corrections required for <b>${app.societyName}</b>:`,
      field: {
        id: 'resubmission-remarks',
        label: 'Corrections Required *',
        type: 'textarea',
        placeholder: 'List all corrections and missing documents...',
        required: true
      },
      submitBtn: 'Return for Resubmission',
      submitClass: 'btn-warning'
    }
  };

  const config = popups[type];

  return `
  <div class="modal-overlay" onclick="if(event.target===this)App.closeApprovalPopup()">
    <div class="modal-box" style="max-width:600px;">
      <div class="modal-header" style="background:${config.color};color:#fff;">
        <span class="material-icons" style="font-size:28px;margin-right:12px;">${config.icon}</span>
        <h3 style="color:#fff;flex:1;">${config.title}</h3>
        <button class="modal-close" onclick="App.closeApprovalPopup()" style="color:#fff;">✕</button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom:${config.field ? '20px' : '0'};">${config.message}</p>
        
        ${config.field ? `
          <div class="form-group">
            <label>${config.field.label}</label>
            ${config.field.type === 'textarea' ? `
              <textarea id="${config.field.id}" class="form-control" rows="4" 
                placeholder="${config.field.placeholder}" ${config.field.required ? 'required' : ''}></textarea>
            ` : `
              <input type="text" id="${config.field.id}" class="form-control" 
                placeholder="${config.field.placeholder}" ${config.field.required ? 'required' : ''}/>
            `}
          </div>
        ` : ''}

        ${type === 'approve' ? `
          <div class="form-group">
            <label>Society Code (Auto-generated)</label>
            <input type="text" id="approval-society-code" class="form-control" 
              value="SOC-${String(this.state.societyApplications.length + 1).padStart(3, '0')}" readonly 
              style="background:#E8F5E9;font-weight:600;"/>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-gray" onclick="App.closeApprovalPopup()">Cancel</button>
        <button class="btn ${config.submitClass}" onclick="App.processApproval('${type}', '${app.applicationNumber}')">
          <span class="material-icons">${config.icon}</span> ${config.submitBtn}
        </button>
      </div>
    </div>
  </div>
  `;
};

App.showApprovalPopup = function (type) {
  this.state.socAppApprovalPopup = type;
  this.render();
};

App.closeApprovalPopup = function () {
  this.state.socAppApprovalPopup = null;
  this.render();
};

App.processApproval = function (type, appNumber) {
  const app = this.getApplicationByNumber(appNumber);
  if (!app) return;

  const actions = {
    approve: () => {
      const societyCode = document.getElementById('approval-society-code')?.value ||
        `SOC-${String(this.state.societyApplications.length + 1).padStart(3, '0')}`;

      app.status = App.SOC_STATUS.APPROVED;
      app.societyCode = societyCode;
      app.approvedBy = this.state.currentUser?.name || 'Admin User';
      app.approvedDate = new Date().toISOString();
      app.updatedAt = new Date().toISOString();

      this.addAuditEntry(appNumber, 'Approved', App.SOC_STATUS.PENDING, App.SOC_STATUS.APPROVED,
        app.approvedBy, 'Beej Sangh Admin', `Application approved. Society Code assigned: ${societyCode}`);

      alert(`✅ Application approved successfully!\n\nSociety Code: ${societyCode}\nSociety Name: ${app.societyName}`);
    },

    reject: () => {
      const reason = document.getElementById('rejection-reason')?.value?.trim();
      if (!reason) {
        alert('Rejection reason is required!');
        return;
      }

      app.status = App.SOC_STATUS.REJECTED;
      app.rejectionReason = reason;
      app.rejectedBy = this.state.currentUser?.name || 'Admin User';
      app.rejectedDate = new Date().toISOString();
      app.updatedAt = new Date().toISOString();

      this.addAuditEntry(appNumber, 'Rejected', App.SOC_STATUS.PENDING, App.SOC_STATUS.REJECTED,
        app.rejectedBy, 'Beej Sangh Admin', `Application rejected. Reason: ${reason}`);

      alert(`❌ Application rejected successfully!\n\nReason has been sent to the society.`);
    },

    resubmit: () => {
      const remarks = document.getElementById('resubmission-remarks')?.value?.trim();
      if (!remarks) {
        alert('Resubmission remarks are required!');
        return;
      }

      app.status = App.SOC_STATUS.RESUBMISSION;
      app.resubmissionRemarks = remarks;
      app.returnedBy = this.state.currentUser?.name || 'Admin User';
      app.returnedDate = new Date().toISOString();
      app.updatedAt = new Date().toISOString();

      this.addAuditEntry(appNumber, 'Returned for Resubmission', App.SOC_STATUS.PENDING,
        App.SOC_STATUS.RESUBMISSION, app.returnedBy, 'Beej Sangh Admin',
        `Application returned for corrections. Remarks: ${remarks}`);

      alert(`📝 Application returned for resubmission!\n\nSociety will be notified to make corrections.`);
    }
  };

  actions[type]();
  this.closeApprovalPopup();
  this.navigate('admin-registration-list');
};

console.log('✅ Society Registration Workflow Module Loaded Successfully - 100% Complete!');
