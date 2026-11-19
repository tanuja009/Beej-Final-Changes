/* seed-modules.js — Beej Sangh Portal
   Module 1: Hybrid Seed Management (Admin)
   Module 2: Foundation & Certified Seed (Society Head)
   No existing files are modified except index.html (already done).
*/
'use strict';

// ══════════════════════════════════════════════
// 1. STATE
// ══════════════════════════════════════════════
(function () {
  App.state.hybridAllocs = [
    {
      id: 'HSA-001', finYear: '2024-2025', season: 'Kharif', variety: 'DKC-9144',
      parentVariety: 'DMRH-202', society: 'Rampur Krishi Samiti',
      socCode: 'SOC-001', allocQty: 120, expectedProd: 480,
      allocDate: '2024-05-10',
      remarks: 'Priority allocation', status: 'Allocated',
      createdBy: 'Admin Sharma', createdAt: '2024-05-10', updatedAt: '2024-05-10'
    },
    {
      id: 'HSA-002', finYear: '2024-2025', season: 'Rabi', variety: 'PAC-749',
      parentVariety: '', society: 'Sehora Kisan Sabha',
      socCode: 'SOC-002', allocQty: 80, expectedProd: 320,
      allocDate: '2024-10-15',
      remarks: '', status: 'Draft',
      createdBy: 'Admin Sharma', createdAt: '2024-10-15', updatedAt: '2024-10-15'
    },
    {
      id: 'HSA-003', finYear: '2024-2025', season: 'Rabi', variety: 'NK-6240',
      parentVariety: 'R-301', society: 'Bargaon Beej Samiti',
      socCode: 'SOC-003', allocQty: 60, expectedProd: 240,
      allocDate: '2024-11-01',
      remarks: '', status: 'Draft',
      createdBy: 'Admin Sharma', createdAt: '2024-11-01', updatedAt: '2024-11-01'
    },
  ];

  App.state.fcSeedStock = [
    {
      id: 'FCS-001', memberId: 'MBR-001', memberName: 'Ramesh Kumar', seedType: 'Foundation', finYear: '2024-2025', season: 'Kharif',
      crop: 'Soybean', variety: 'JS-335', allocDate: '2024-06-20', procDate: '2024-10-25', unit: 'Quintal', allocQty: 2.5, produceQty: 18,
      activeStatus: 'Active', createdBy: 'Ramesh Verma', createdAt: '2024-06-20', updatedAt: '2024-10-25'
    },
    {
      id: 'FCS-002', memberId: 'MBR-002', memberName: 'Sunita Devi', seedType: 'Certified', finYear: '2024-2025', season: 'Rabi',
      crop: 'Wheat', variety: 'GW-322', allocDate: '2024-10-18', procDate: '2025-03-28', unit: 'Quintal', allocQty: 1.5, produceQty: 12,
      activeStatus: 'Active', createdBy: 'Ramesh Verma', createdAt: '2024-10-18', updatedAt: '2025-03-28'
    },
    {
      id: 'FCS-003', memberId: 'MBR-003', memberName: 'Dinesh Patel', seedType: 'Foundation', finYear: '2024-2025', season: 'Rabi',
      crop: 'Gram (Chickpea)', variety: 'JG-315', allocDate: '2024-11-05', procDate: '', unit: 'Kg', allocQty: 80, produceQty: null,
      activeStatus: 'Active', createdBy: 'Ramesh Verma', createdAt: '2024-11-05', updatedAt: '2024-11-05'
    },
  ];

  App.state.hybridSelId = null;
  App.state.hybridFilter = { season: '', society: '', status: '', search: '' };
  App.state.fcSelId = null;
  App.state.fcFilter = { season: '', seedType: '', search: '' };
}());

// ══════════════════════════════════════════════
// 2. ADMIN SIDEBAR — full rebuild + Hybrid menu
// ══════════════════════════════════════════════
(function () {
  App.renderAdminSidebar = function () {
    var p = this.state.currentPage;
    var ni = function (icon, label, page, sub) {
      var c = 'nav-item' + (sub ? ' nav-sub-item' : '') + (p === page ? ' active' : '');
      return '<div class="' + c + '" onclick="App.navigate(\'' + page + '\')">'
        + '<span class="material-icons">' + icon + '</span><span>' + label + '</span></div>';
    };
    return [
      '<nav class="sidebar">',
      '<div class="sidebar-logo">',
      '<div class="logo-icon">\uD83C\uDFDB\uFE0F</div>',
      '<div class="logo-text"><h3>Beej Sangh Admin</h3><p>Admin Module</p></div>',
      '</div>',
      '<div class="sidebar-nav">',

      '<div class="nav-section">' + ni('dashboard', 'Dashboard', 'admin-dashboard') + '</div>',


      '<div class="nav-section"><div class="nav-section-title">Management</div>',
      ni('groups', 'Society Members', 'admin-societies'),
      ni('receipt_long', 'Demand Management', 'admin-demands'),
      '</div>',



      // REMOVED: Registration section commented out
      // '<div class="nav-section"><div class="nav-section-title">Registration</div>',
      // ni('app_registration', 'Society Registration', 'admin-soc-reg'),
      // ni('list_alt', 'Registration List', 'admin-soc-reg-list', true),
      // ni('add_circle', 'New Registration', 'admin-soc-reg-add', true),
      // '</div>',

      '<div class="nav-section"><div class="nav-section-title">Hybrid Seeds</div>',
      ni('grass', 'Hybrid Seed Management', 'admin-hybrid-list'),
      ni('add_circle', 'New Allocation', 'admin-hybrid-add', true),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Reports</div>',
      ni('bar_chart', 'Reports', 'admin-reports'),
      '</div>',

      '</div>',
      '</nav>'
    ].join('');
  };
}());

// ══════════════════════════════════════════════
// 3. SOCIETY SIDEBAR — full rebuild + FC menu
// ══════════════════════════════════════════════
(function () {
  App.renderSocietySidebar = function () {
    var p = this.state.currentPage;
    var ni = function (icon, label, page, sub) {
      var c = 'nav-item' + (sub ? ' nav-sub' : '') + (p === page ? ' active' : '');
      return '<div class="' + c + '" onclick="App.navigate(\'' + page + '\')">'
        + '<span class="material-icons">' + icon + '</span><span>' + label + '</span></div>';
    };
    return [
      '<nav class="sidebar">',
      '<div class="sidebar-logo">',
      '<div class="logo-icon">\uD83C\uDF3E</div>',
      '<div class="logo-text"><h3>Beej Sangh Portal</h3><p>Society Module</p></div>',
      '</div>',
      '<div class="sidebar-nav">',

      '<div class="nav-section">' + ni('dashboard', 'Dashboard', 'dashboard') + '</div>',

      '<div class="nav-section"><div class="nav-section-title">Member Management</div>',
      ni('person_add', 'Society Member Onboarding', 'add-member'),
      ni('group', 'Society Member List', 'member-list'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Demand Management</div>',
      ni('add_shopping_cart', 'Breeder Seed Demand', 'raise-demand'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Distribution</div>',
      ni('inventory_2', 'Available Stock', 'soc-available-stock'),
      ni('how_to_reg', 'Breeder Seeds Distribution to Member', 'soc-member-distribution'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Stock</div>',
      (function () { var on = ['soc-fc-list', 'soc-fc-add', 'soc-fc-edit', 'soc-fc-view'].indexOf(p) > -1; return '<div class="nav-item' + (on ? ' active' : '') + '" onclick="App.navigate(\'soc-fc-list\')"><span class="material-icons">inventory_2</span><span>Foundation &amp; Certified Seed</span></div>'; }()),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Reports</div>',
      ni('bar_chart', 'Society Reports', 'society-reports'),
      '</div>',

      '<div class="nav-section">' + ni('account_circle', 'My Profile', 'profile') + '</div>',

      '</div>',
      '<div class="sidebar-footer" onclick="App.logout()">',
      '<span class="material-icons">logout</span><span>Logout</span>',
      '</div></nav>'
    ].join('');
  };
}());

// ══════════════════════════════════════════════
// 4. ROUTER PATCH
// ══════════════════════════════════════════════
(function () {
  var _prev = App.renderPage.bind(App);
  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'admin-hybrid-list': return App.smRenderHybridList();
      case 'admin-hybrid-add': return App.smRenderHybridForm('add');
      case 'admin-hybrid-edit': return App.smRenderHybridForm('edit');
      case 'admin-hybrid-view': return App.smRenderHybridView();
      case 'soc-fc-list': return App.smRenderFCList();
      case 'soc-fc-add': return App.smRenderFCForm('add');
      case 'soc-fc-edit': return App.smRenderFCForm('edit');
      case 'soc-fc-view': return App.smRenderFCView();
      case 'admin-seed-lines': return App.renderSeedLines();
      case 'admin-packaging': return App.renderPackaging();
      default: return _prev();
    }
  };
}());

// ══════════════════════════════════════════════
// 5. HEADER TITLES PATCH
// ══════════════════════════════════════════════
(function () {
  var _prev = App.renderHeader.bind(App);
  var T = {
    'admin-hybrid-list': 'Hybrid Seed Management',
    'admin-hybrid-add': 'New Hybrid Seed Allocation',
    'admin-hybrid-edit': 'Edit Hybrid Seed Allocation',
    'admin-hybrid-view': 'Hybrid Seed Allocation Details',
    'soc-fc-list': 'Foundation & Certified Seed Management',
    'soc-fc-add': 'New Foundation and Certified Seed Entry',
    'soc-fc-edit': 'Edit Foundation and Certified Seed Entry',
    'soc-fc-view': 'Foundation & Certified Seed Details',
    'admin-seed-lines': 'Seed Buying/Selling Line Management',
    'admin-packaging': 'Seed Packaging Management',
  };
  App.renderHeader = function () {
    var html = _prev();
    var title = T[this.state.currentPage];
    if (!title) return html;
    return html.replace(/<span class="header-title">.*?<\/span>/,
      '<span class="header-title">' + title + '</span>');
  };
}());

// ══════════════════════════════════════════════
// 6. SHARED HELPERS
// ══════════════════════════════════════════════
App._smBadge = function (s) {
  var m = {
    Allocated: 'badge-success', Draft: 'badge-gray', Cancelled: 'badge-danger',
    Passed: 'badge-success', Failed: 'badge-danger', Pending: 'badge-warning',
    Foundation: 'badge-info', Certified: 'badge-success'
  };
  return '<span class="badge ' + (m[s] || 'badge-gray') + '">' + s + '</span>';
};

App._smGet = function (id) {
  var el = document.getElementById(id);
  return el ? (el.value || '').trim() : '';
};

App._smErr = function (id, msg) {
  var el = document.getElementById('smerr-' + id);
  var inp = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  if (inp) { inp.style.borderColor = msg ? '#F44336' : ''; }
};

App._smClearErr = function (ids) {
  ids.forEach(function (id) { App._smErr(id, ''); });
};

App._smNextId = function (list, prefix) {
  var nums = list.map(function (r) {
    return parseInt((r.id || '').replace(/\D/g, ''), 10);
  }).filter(function (n) { return !isNaN(n); });
  return prefix + String((nums.length ? Math.max.apply(null, nums) : 0) + 1).padStart(3, '0');
};

App._smToast = function (msg, err) {
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 20px;'
    + 'background:' + (err ? '#c62828' : '#2E7D32') + ';color:#fff;border-radius:8px;'
    + 'font-size:.9rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 3000);
};

/* Build a form-group row */
App._smFld = function (label, id, type, opts, val, req, ph) {
  var star = req ? ' <span style="color:#F44336">*</span>' : '';
  var inp = '';
  if (type === 'select') {
    inp = '<select id="' + id + '" class="form-control">'
      + '<option value="">Select...</option>'
      + (opts || []).map(function (o) {
        return '<option value="' + o + '"' + (val === o ? ' selected' : '') + '>' + o + '</option>';
      }).join('')
      + '</select>';
  } else if (type === 'textarea') {
    inp = '<textarea id="' + id + '" class="form-control" rows="2" placeholder="' + (ph || '') + '">'
      + (val || '') + '</textarea>';
  } else {
    inp = '<input type="' + type + '" id="' + id + '" class="form-control"'
      + ' value="' + (val || '') + '" placeholder="' + (ph || '') + '"/>';
  }
  return '<div class="form-group"><label>' + label + star + '</label>'
    + inp
    + '<div id="smerr-' + id + '" style="display:none;color:#C62828;font-size:.78rem;margin-top:4px;"></div>'
    + '</div>';
};

// ══════════════════════════════════════════════
// 7. HYBRID SEED MANAGEMENT — LIST
// ══════════════════════════════════════════════
App.smRenderHybridList = function () {
  var f = this.state.hybridFilter;
  var all = this.state.hybridAllocs;
  var rows = all.filter(function (r) {
    return (!f.season || r.season === f.season)
      && (!f.status || r.status === f.status)
      && (!f.society || r.society.toLowerCase().indexOf(f.society.toLowerCase()) > -1)
      && (!f.search || r.id.toLowerCase().indexOf(f.search.toLowerCase()) > -1
        || r.variety.toLowerCase().indexOf(f.search.toLowerCase()) > -1
        || r.society.toLowerCase().indexOf(f.search.toLowerCase()) > -1);
  });

  var seasons = ['Kharif', 'Rabi', 'Summer'];
  var statuses = ['Allocated', 'Draft', 'Cancelled'];

  var html = '<div class="page-header"><h1>Hybrid Seed Management</h1>'
    + '<p>Manage hybrid seed allocations across registered societies</p></div>';

  /* Stats */

  /* Filter bar */
  html += '<div class="search-bar" style="margin-bottom:16px;">'
    + '<div class="search-field"><label>Search</label>'
    + '<input class="form-control" placeholder="ID, Variety, Society..." value="' + (f.search || '') + '" oninput="App.state.hybridFilter.search=this.value;App.render()"/></div>'
    + '<div class="search-field"><label>Season</label>'
    + '<select class="form-control" onchange="App.state.hybridFilter.season=this.value;App.render()">'
    + '<option value="">All Seasons</option>'
    + seasons.map(function (s) { return '<option' + (f.season === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="search-field"><label>Status</label>'
    + '<select class="form-control" onchange="App.state.hybridFilter.status=this.value;App.render()">'
    + '<option value="">All Status</option>'
    + statuses.map(function (s) { return '<option' + (f.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="search-field" style="align-self:flex-end;">'
    + '<button class="btn btn-gray btn-sm" onclick="App.state.hybridFilter={season:\'\',society:\'\',status:\'\',search:\'\'};App.render()">'
    + '<span class="material-icons">clear</span> Reset</button></div>'
    + '<div style="margin-left:auto;align-self:flex-end;">'
    + '<button class="btn btn-primary" onclick="App.navigate(\'admin-hybrid-add\')">'
    + '<span class="material-icons">add</span> Create New Allocation</button></div>'
    + '</div>';

  /* Table */
  html += '<div class="card"><div class="card-header">'
    + '<h3>Hybrid Seed Allocations <span style="color:#757575;font-weight:400;font-size:.85rem;">(' + rows.length + ' records)</span></h3>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Export</button>'
    + '<button class="btn btn-danger btn-sm"><span class="material-icons">picture_as_pdf</span> PDF</button>'
    + '</div></div>'
    + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>ID</th><th>Proc. Year</th><th>Season</th><th>Variety</th>'
    + '<th>Society</th><th>Alloc Qty</th><th>Exp. Prod.</th><th>Alloc Date</th>'
    + '<th>Status</th><th>Actions</th></tr></thead><tbody>';

  if (rows.length === 0) {
    html += '<tr><td colspan="10" style="text-align:center;padding:40px;color:#9E9E9E;">No records found.</td></tr>';
  } else {
    rows.forEach(function (r) {
      var act = (r.activeStatus || 'Active');
      html += '<tr>'
        + '<td><b>' + r.id + '</b></td>'
        + '<td>' + (r.finYear || '—') + '</td>'
        + '<td>' + r.season + '</td>'
        + '<td><div style="font-weight:500;">' + r.variety + '</div>'
        + (r.parentVariety ? '<div style="font-size:.72rem;color:#9E9E9E;">Parent: ' + r.parentVariety + '</div>' : '') + '</td>'
        + '<td>' + r.society + '</td>'
        + '<td style="font-weight:600;color:#2E7D32;">' + r.allocQty + ' Qt</td>'
        + '<td>' + r.expectedProd + ' Qt</td>'
        + '<td style="font-size:.82rem;">' + r.allocDate + '</td>'
        + '<td><span class="badge ' + (act === 'Active' ? 'badge-success' : 'badge-danger') + '">' + act + '</span></td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-info btn-sm" title="View" onclick="App.state.hybridSelId=\'' + r.id + '\';App.navigate(\'admin-hybrid-view\')">'
        + '<span class="material-icons" style="font-size:14px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.state.hybridSelId=\'' + r.id + '\';App.navigate(\'admin-hybrid-edit\')">'
        + '<span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (act === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smHybridToggleActive(\'' + r.id + '\')">' + (act === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    });
  }
  html += '</tbody></table></div>'
    + '<div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E0E0E0;">'
    + '<span style="font-size:.82rem;color:#757575;">Showing ' + rows.length + ' of ' + all.length + ' records</span>'
    + '<div style="display:flex;gap:6px;">'
    + '<button class="btn btn-gray btn-sm">&#8249; Prev</button>'
    + '<button class="btn btn-primary btn-sm">1</button>'
    + '<button class="btn btn-gray btn-sm">Next &#8250;</button>'
    + '</div></div></div></div>';

  return html;
};

// ══════════════════════════════════════════════
// 8. HYBRID SEED — FORM (Add / Edit)
// ══════════════════════════════════════════════
App.smRenderHybridForm = function (mode) {
  var isEdit = mode === 'edit';
  var rec = isEdit ? this.state.hybridAllocs.find(function (r) { return r.id === App.state.hybridSelId; }) : null;
  var v = function (f, def) { return rec ? (rec[f] !== undefined ? String(rec[f]) : '') : (def || ''); };

  var seasons = ['Kharif', 'Rabi', 'Summer'];
  var societies = ['Rampur Krishi Samiti', 'Sehora Kisan Sabha', 'Bargaon Beej Samiti', 'Patan Krishi Vikas Samiti'];
  // Procurement Year is auto-filled: current FY for a new allocation, the saved FY (or current, if none) when editing.
  var finYear = (rec && rec.finYear) || App._lineFinYear();

  return '<div class="page-header"><h1>' + (isEdit ? 'Edit' : 'New') + ' Hybrid Seed Allocation</h1>'
    + '<p>' + (isEdit ? 'Update allocation details.' : 'Create a new hybrid seed allocation for a society.') + '</p></div>'
    + '<div class="card"><div class="card-body">'

    /* Section 1 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">grass</span> Allocation Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Procurement Year</label>'
    + '<input type="text" id="hf-finyear" class="form-control" value="' + finYear + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>'
    + App._smFld('Season', 'hf-season', 'select', seasons, v('season'), true)
    + App._smFld('Hybrid Seed Variety', 'hf-variety', 'text', null, v('variety'), true, 'e.g. DKC-9144')
    + App._smFld('Parent Seed Variety (if applicable)', 'hf-parent', 'text', null, v('parentVariety'), false, 'e.g. DMRH-202')
    + App._smFld('Society Name', 'hf-society', 'select', societies, v('society'), true)
    + '</div></div>'

    /* Section 2 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">scale</span> Quantity &amp; Dates</div>'
    + '<div class="form-grid">'
    + App._smFld('Allocated Quantity (Qt)', 'hf-allocqty', 'number', null, v('allocQty'), true, 'Quintals')
    + App._smFld('Expected Production Qty (Qt)', 'hf-expprod', 'number', null, v('expectedProd'), true, 'Quintals')
    + App._smFld('Allocation Date', 'hf-allocdate', 'date', null, v('allocDate'), true)
    + '</div></div>'

    /* Section 3 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">tune</span> Status &amp; Remarks</div>'
    + '<div class="form-grid">'
    + App._smFld('Status', 'hf-status', 'select', ['Draft', 'Allocated'], v('status', 'Draft'), true)
    + '</div>'
    + '<div class="form-group" style="margin-top:12px;"><label>Remarks</label>'
    + '<textarea id="hf-remarks" class="form-control" rows="2" placeholder="Optional notes">' + v('remarks') + '</textarea>'
    + '</div></div>'

    /* Actions */
    + '<div class="form-actions">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'admin-hybrid-list\')">'
    + '<span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smHybridSave(\'' + mode + '\')">'
    + '<span class="material-icons">' + (isEdit ? 'save' : 'add_circle') + '</span> '
    + (isEdit ? 'Update Entry' : 'Save Entry') + '</button>'
    + '</div>'
    + '</div></div>';
};

// ══════════════════════════════════════════════
// 9. HYBRID SEED — VIEW
// ══════════════════════════════════════════════
App.smRenderHybridView = function () {
  var r = this.state.hybridAllocs.find(function (x) { return x.id === App.state.hybridSelId; });
  if (!r) return '<div class="page-header"><h1>Not Found</h1></div>';
  var row = function (l, v) { return '<div class="invoice-row"><span class="label">' + l + '</span><span class="value">' + (v || '—') + '</span></div>'; };
  return '<div class="page-header"><h1>Hybrid Seed Allocation Details</h1><p>' + r.id + '</p></div>'
    + '<div class="card" style="max-width:700px;">'
    + '<div class="card-header"><h3>' + r.variety + ' — ' + r.season + '</h3>' + App._smBadge(r.status) + '</div>'
    + '<div class="card-body">'
    + row('Allocation ID', '<b>' + r.id + '</b>')
    + row('Procurement Year', r.finYear)
    + row('Season', r.season)
    + row('Hybrid Variety', r.variety)
    + row('Parent Variety', r.parentVariety)
    + row('Society', r.society)
    + row('Allocated Qty', r.allocQty + ' Quintal')
    + row('Expected Production', r.expectedProd + ' Quintal')
    + row('Allocation Date', r.allocDate)
    + row('Remarks', r.remarks)
    + row('Status', App._smBadge(r.status))
    + row('Created By', r.createdBy)
    + row('Created At', r.createdAt)
    + '</div>'
    + '<div class="card-header" style="border-top:1px solid #E0E0E0;border-bottom:none;justify-content:flex-end;">'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'admin-hybrid-list\')"><span class="material-icons">arrow_back</span> Back</button>'
    + '<button class="btn btn-warning" onclick="App.state.hybridSelId=\'' + r.id + '\';App.navigate(\'admin-hybrid-edit\')"><span class="material-icons">edit</span> Edit</button>'
    + '</div></div></div>';
};

// ══════════════════════════════════════════════
// 10. HYBRID SEED — SAVE / DELETE
// ══════════════════════════════════════════════
App.smHybridSave = function (mode) {
  var isEdit = mode === 'edit';
  var errIds = ['hf-season', 'hf-variety', 'hf-society', 'hf-allocqty', 'hf-expprod', 'hf-allocdate'];
  App._smClearErr(errIds);
  var season = App._smGet('hf-season');
  var variety = App._smGet('hf-variety');
  var society = App._smGet('hf-society');
  var allocQty = parseFloat(App._smGet('hf-allocqty')) || 0;
  var expProd = parseFloat(App._smGet('hf-expprod')) || 0;
  var aDate = App._smGet('hf-allocdate');
  var finYear = App._smGet('hf-finyear') || App._lineFinYear();
  var ok = true;
  if (!season) { App._smErr('hf-season', 'Season is required.'); ok = false; }
  if (!variety) { App._smErr('hf-variety', 'Variety is required.'); ok = false; }
  if (!society) { App._smErr('hf-society', 'Society is required.'); ok = false; }
  if (!allocQty) { App._smErr('hf-allocqty', 'Allocated qty is required.'); ok = false; }
  if (!expProd) { App._smErr('hf-expprod', 'Expected production required.'); ok = false; }
  if (!aDate) { App._smErr('hf-allocdate', 'Allocation date is required.'); ok = false; }
  if (!ok) return;
  var now = new Date().toISOString().slice(0, 10);
  var existing = isEdit ? App.state.hybridAllocs.find(function (r) { return r.id === App.state.hybridSelId; }) : null;
  var rec = {
    id: isEdit ? App.state.hybridSelId : App._smNextId(App.state.hybridAllocs, 'HSA-'),
    finYear: finYear, season: season, variety: variety, parentVariety: App._smGet('hf-parent'),
    society: society, socCode: 'SOC-XXX', allocQty: allocQty, expectedProd: expProd,
    allocDate: aDate, remarks: App._smGet('hf-remarks'),
    status: App._smGet('hf-status') || 'Draft',
    createdBy: (App.state.currentUser && App.state.currentUser.name) || 'Admin',
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };
  if (isEdit) {
    var idx = App.state.hybridAllocs.findIndex(function (r) { return r.id === App.state.hybridSelId; });
    if (idx > -1) App.state.hybridAllocs[idx] = rec;
    App._smToast('Allocation updated successfully!');
  } else {
    App.state.hybridAllocs.unshift(rec);
    App._smToast('Allocation created successfully!');
  }
  App.state.hybridSelId = null;
  App.navigate('admin-hybrid-list');
};

App.smHybridDelete = function (id) {
  if (!confirm('Delete allocation ' + id + '? This cannot be undone.')) return;
  App.state.hybridAllocs = App.state.hybridAllocs.filter(function (r) { return r.id !== id; });
  App._smToast('Allocation deleted.');
  App.render();
};

App.smHybridToggleActive = function (id) {
  var r = (App.state.hybridAllocs || []).find(function (x) { return x.id === id; });
  if (!r) return;
  r.activeStatus = (r.activeStatus || 'Active') === 'Active' ? 'Inactive' : 'Active';
  App._smToast('Allocation marked ' + r.activeStatus + '.');
  App.render();
};

// ══════════════════════════════════════════════
// 11. FOUNDATION & CERTIFIED SEED — one combined page
//     List (with "New Allocation") + Add/Edit form + View.
//     A record = seed allocated to a member for one crop variety, plus the
//     produce procured back from that member. One Unit applies to both quantities.
// ══════════════════════════════════════════════
App._fcSeedTypes = ['Foundation', 'Certified'];
App._fcSeasons = ['Kharif', 'Rabi', 'Summer'];
App._fcCrops = ['Wheat', 'Paddy (Rice)', 'Maize', 'Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Gram (Chickpea)', 'Pigeon Pea (Arhar)', 'Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Cotton', 'Sugarcane', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Lentil (Masoor)', 'Barley', 'Oat'];
// Units follow the project-wide rule: Kg and Quintal only.
App._fcUnits = function () { return App._seUnits || ['Kg', 'Quintal']; };

// "2.5 Quintal", or "—" when nothing is recorded yet.
App._fcQtyText = function (qty, unit) {
  return (qty === null || qty === undefined || qty === '') ? '—' : qty + ' ' + (unit || '');
};

// Crop-wise variety names (keeps the record's current variety selectable when editing).
App._fcVarietyNames = function (crop, current) {
  var names = App.varietiesForCrop(crop);
  if (current && names.indexOf(current) === -1) names.unshift(current);
  return names;
};

// Crop changed on the form → rebuild the Variety control (single select when editing, multi-select when adding).
// ── Earlier seed given to the selected member (shown on the F&C form as soon as a member is picked) ──
// Everything given to a member before: distributions (Breeder Seeds Distribution to Member) + earlier F&C allocations.
App._fcMemberHistory = function (memberId, excludeId) {
  var rows = [];
  var add = function (r, date) {
    var qty = Number(r.qty !== undefined ? r.qty : r.allocQty) || 0;
    rows.push({ finYear: r.finYear, season: r.season, seedType: r.seedType, crop: r.crop, variety: r.variety, qty: qty, unit: r.unit || 'Quintal', date: date || '' });
  };
  (App.state.distributionRecords || []).forEach(function (r) { if (r.memberId === memberId) add(r, r.date); });
  (App.state.fcSeedStock || []).forEach(function (r) { if (r.memberId === memberId && r.id !== excludeId) add(r, r.allocDate); });
  rows.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  return rows;
};
App._fcMemberHistoryHtml = function (memberId, excludeId) {
  if (!memberId) return '';
  var rows = App._fcMemberHistory(memberId, excludeId);
  var m = (App.state.members || []).filter(function (x) { return x.id === memberId; })[0];
  var title = '<div style="font-weight:600;color:#2E7D32;margin-bottom:8px;font-size:.88rem;"><span class="material-icons" style="font-size:18px;vertical-align:middle;margin-right:4px;">history</span>Seed given earlier to ' + (m ? m.name : memberId) + '</div>';
  if (!rows.length) return '<div style="background:#F1F8E9;border:1px solid #C5E1A5;border-radius:8px;padding:12px 14px;">' + title + '<div style="color:#757575;font-size:.85rem;">No seed has been given to this member earlier.</div></div>';
  var fmt = function (n) { return String(Math.round(n * 10) / 10); };
  var body = rows.map(function (r) {
    return '<tr><td>' + r.finYear + '</td><td>' + r.season + '</td><td>' + r.seedType + '</td><td>' + r.crop + '</td><td>' + r.variety + '</td>'
      + '<td style="font-weight:600;">' + fmt(r.qty) + ' ' + r.unit + '</td></tr>';
  }).join('');
  return '<div style="background:#F1F8E9;border:1px solid #C5E1A5;border-radius:8px;padding:12px 14px;">' + title
    + '<div class="table-wrap"><table><thead><tr><th>Proc. Year</th><th>Season</th><th>Seed Type</th><th>Crop</th><th>Variety</th><th>Quantity</th></tr></thead><tbody>' + body + '</tbody></table></div></div>';
};
// Member picked / changed → show that member's earlier seed in the panel under the member fields.
App.onFCMemberChange = function () {
  var el = document.getElementById('fc-member'), box = document.getElementById('fc-member-history');
  if (!box) return;
  box.innerHTML = App._fcMemberHistoryHtml(el ? el.value : '', App.state.currentPage === 'soc-fc-edit' ? App.state.fcSelId : '');
};

App.onFCCropChange = function () {
  var crop = document.getElementById('fc-crop') ? document.getElementById('fc-crop').value : '';
  var el = document.getElementById('fc-variety');
  if (el && el.tagName === 'SELECT') {
    el.innerHTML = '<option value="">Select Variety</option>' + App._fcVarietyNames(crop, '').map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('');
    return;
  }
  App.msRender('fc-variety', App.varietiesForCrop(crop), !crop, 'Select Crop first', App._fcVarietiesChanged);
  App._msRefresh('fc-variety');
  App._fcVarietiesChanged();
};
// A variety was picked: clear the "Variety is required" error.
App._fcVarietiesChanged = function () {
  var err = document.getElementById('smerr-fc-variety');
  if (err) err.style.display = 'none';
};

App.smRenderFCList = function () {
  var f = this.state.fcFilter;
  var all = this.state.fcSeedStock;
  var q = (f.search || '').toLowerCase();
  var rows = all.filter(function (r) {
    return (!f.season || r.season === f.season)
      && (!f.seedType || r.seedType === f.seedType)
      && (!q || (r.memberName + ' ' + r.crop + ' ' + r.variety).toLowerCase().indexOf(q) > -1);
  });
  var opt = function (list, sel) { return list.map(function (s) { return '<option' + (sel === s ? ' selected' : '') + '>' + s + '</option>'; }).join(''); };

  var html = '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">'
    + '<div><h1>Foundation &amp; Certified Seed Management</h1>'
    + '<p>Allocate foundation and certified seed to members and track the produce procured</p></div>'
    + '<button class="btn btn-primary" onclick="App.navigate(\'soc-fc-add\')"><span class="material-icons">add</span> New Foundation and Certified Seed Entry</button>'
    + '</div>';

  /* Filter bar */
  html += '<div class="search-bar" style="margin-bottom:16px;">'
    + '<div class="search-field"><label>Search</label>'
    + '<input class="form-control" placeholder="Member, Crop, Variety..." value="' + (f.search || '') + '" oninput="App.state.fcFilter.search=this.value;App.render()"/></div>'
    + '<div class="search-field"><label>Season</label>'
    + '<select class="form-control" onchange="App.state.fcFilter.season=this.value;App.render()"><option value="">All Seasons</option>' + opt(App._fcSeasons, f.season) + '</select></div>'
    + '<div class="search-field"><label>Seed Type</label>'
    + '<select class="form-control" onchange="App.state.fcFilter.seedType=this.value;App.render()"><option value="">All</option>' + opt(App._fcSeedTypes, f.seedType) + '</select></div>'
    + '<div class="search-field" style="align-self:flex-end;">'
    + '<button class="btn btn-gray btn-sm" onclick="App.state.fcFilter={season:\'\',seedType:\'\',search:\'\'};App.render()"><span class="material-icons">clear</span> Reset</button></div>'
    + '</div>';

  /* Table */
  html += '<div class="card"><div class="card-header">'
    + '<h3>Entries <span style="color:#757575;font-weight:400;font-size:.85rem;">(' + rows.length + ' records)</span></h3></div>'
    + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Member Name</th><th>Seed Type</th><th>Proc. Year</th><th>Season</th><th>Crop</th><th>Variety</th>'
    + '<th>Allocated Date</th><th>Procurement Date</th><th>Allocated Qty</th><th>Produce Qty</th><th>Status</th><th>Actions</th></tr></thead><tbody>';

  if (rows.length === 0) {
    html += '<tr><td colspan="12" style="text-align:center;padding:40px;color:#9E9E9E;">No records found.</td></tr>';
  } else {
    rows.forEach(function (r) {
      var act = r.activeStatus || 'Active';
      html += '<tr>'
        + '<td><div style="font-weight:500;">' + r.memberName + '</div><div style="font-size:.72rem;color:#9E9E9E;">' + r.memberId + '</div></td>'
        + '<td><span class="badge ' + (r.seedType === 'Foundation' ? 'badge-info' : 'badge-success') + '">' + r.seedType + '</span></td>'
        + '<td>' + (r.finYear || '—') + '</td>'
        + '<td>' + r.season + '</td>'
        + '<td>' + r.crop + '</td>'
        + '<td>' + r.variety + '</td>'
        + '<td style="font-size:.82rem;">' + (r.allocDate || '—') + '</td>'
        + '<td style="font-size:.82rem;">' + (r.procDate || '—') + '</td>'
        + '<td style="font-weight:600;color:#1565C0;">' + App._fcQtyText(r.allocQty, r.unit) + '</td>'
        + '<td style="font-weight:600;color:#2E7D32;">' + App._fcQtyText(r.produceQty, r.unit) + '</td>'
        + '<td><span class="badge ' + (act === 'Active' ? 'badge-success' : 'badge-danger') + '">' + act + '</span></td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-info btn-sm" title="View" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-view\')"><span class="material-icons" style="font-size:14px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-edit\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (act === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smFCToggleActive(\'' + r.id + '\')">' + (act === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    });
  }
  html += '</tbody></table></div></div></div>';
  return html;
};

// ══════════════════════════════════════════════
// 12. FOUNDATION & CERTIFIED SEED — ADD / EDIT FORM
// ══════════════════════════════════════════════
App.smRenderFCForm = function (mode) {
  var isEdit = mode === 'edit';
  var rec = isEdit ? this.state.fcSeedStock.find(function (r) { return r.id === App.state.fcSelId; }) : null;
  if (isEdit && !rec) return '<div class="page-header"><h1>Not Found</h1></div>';
  var v = function (f, def) { return rec ? (rec[f] !== undefined && rec[f] !== null ? String(rec[f]) : '') : (def || ''); };
  var today = new Date().toISOString().slice(0, 10);
  var finYear = (rec && rec.finYear) || App._lineFinYear();   // auto-filled, read-only

  // Member dropdown (value = member id). Keep the record's member selectable even if now inactive.
  var members = (this.state.members || []).filter(function (m) { return m.status === 'Active'; }).map(function (m) { return { id: m.id, name: m.name }; });
  if (rec && !members.some(function (m) { return m.id === rec.memberId; })) members.unshift({ id: rec.memberId, name: rec.memberName });
  var memberField = '<div class="form-group"><label>Member Name <span style="color:#F44336">*</span></label>'
    + '<select id="fc-member" class="form-control" onchange="App.onFCMemberChange()"><option value="">Select Member</option>'
    + members.map(function (m) { return '<option value="' + m.id + '"' + (v('memberId') === m.id ? ' selected' : '') + '>' + m.name + ' (' + m.id + ')</option>'; }).join('')
    + '</select><div id="smerr-fc-member" style="display:none;color:#C62828;font-size:.78rem;margin-top:4px;"></div></div>';

  // Variety: single select when editing one record, crop-wise multi-select when adding (one record per variety).
  var varietyField = '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>'
    + (isEdit
      ? '<select id="fc-variety" class="form-control"><option value="">Select Variety</option>'
      + App._fcVarietyNames(v('crop'), v('variety')).map(function (o) { return '<option value="' + o + '"' + (v('variety') === o ? ' selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select>'
      : App.msRender('fc-variety', App.varietiesForCrop(v('crop')), !v('crop'), 'Select Crop first', App._fcVarietiesChanged)
      + App.msHint('Select one or more varieties. One record is created per variety with the same details.'))
    + '<div id="smerr-fc-variety" style="display:none;color:#C62828;font-size:.78rem;margin-top:4px;"></div></div>';

  var cropField = App._smFld('Crop', 'fc-crop', 'select', App._fcCrops, v('crop'), true)
    .replace('<select id="fc-crop" class="form-control">', '<select id="fc-crop" class="form-control" onchange="App.onFCCropChange()">');

  return '<div class="page-header"><h1>' + (isEdit ? 'Edit' : 'New') + ' Foundation and Certified Seed Entry</h1>'
    + '<p>' + (isEdit ? 'Update the seed entry and produce details.' : 'Record foundation or certified seed given to a member and the produce procured.') + '</p></div>'
    + '<div class="card"><div class="card-body">'

    /* Section 1 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">category</span> Member &amp; Seed Details</div>'
    + '<div class="form-grid">'
    + memberField
    + App._smFld('Seed Type', 'fc-seedtype', 'select', App._fcSeedTypes, v('seedType'), true)
    + '<div class="form-group"><label>Procurement Year</label>'
    + '<input type="text" id="fc-finyear" class="form-control" value="' + finYear + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>'
    + App._smFld('Season', 'fc-season', 'select', App._fcSeasons, v('season'), true)
    + cropField
    + varietyField
    + '<div id="fc-member-history" style="grid-column:1/-1;">' + App._fcMemberHistoryHtml(rec ? rec.memberId : '', rec ? rec.id : '') + '</div>'
    + '</div></div>'

    /* Section 2 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">scale</span> Dates &amp; Quantity</div>'
    + '<div class="form-grid">'
    + App._smFld('Allocated Date', 'fc-allocdate', 'date', null, v('allocDate', today), true)
    + App._smFld('Procurement Date', 'fc-procdate', 'date', null, v('procDate'), false)
    + App._smFld('Unit (for Allocated &amp; Produce Quantity)', 'fc-unit', 'select', App._fcUnits(), v('unit', 'Quintal'), true)
    + App._smFld('Allocated Quantity', 'fc-allocqty', 'number', null, v('allocQty'), true, 'e.g. 2.5')
    + App._smFld('Produce Quantity', 'fc-prodqty', 'number', null, v('produceQty'), false, 'e.g. 18')
    + '</div>'
    + '<div style="font-size:.75rem;color:#757575;margin-top:6px;">Procurement Date and Produce Quantity can be left blank until the produce is procured.</div></div>'

    /* Actions */
    + '<div class="form-actions">'
    + '<button class="btn btn-gray" onclick="App.msReset(\'fc-variety\');App.navigate(\'soc-fc-list\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smFCSave(\'' + mode + '\')"><span class="material-icons">' + (isEdit ? 'update' : 'check_circle') + '</span> ' + (isEdit ? 'Update Entry' : 'Save Entry') + '</button>'
    + '</div>'
    + '</div></div>';
};

// ══════════════════════════════════════════════
// 13. FOUNDATION & CERTIFIED SEED — VIEW
// ══════════════════════════════════════════════
App.smRenderFCView = function () {
  var r = this.state.fcSeedStock.find(function (x) { return x.id === App.state.fcSelId; });
  if (!r) return '<div class="page-header"><h1>Not Found</h1><p>The record could not be found.</p></div>';
  var act = r.activeStatus || 'Active';
  var row = function (l, val) { return '<div class="invoice-row"><span class="label">' + l + '</span><span class="value">' + (val || '—') + '</span></div>'; };
  return '<div class="page-header"><h1>Foundation &amp; Certified Seed Details</h1><p>' + r.memberName + ' — ' + r.crop + ' / ' + r.variety + '</p></div>'
    + '<div class="card" style="max-width:700px;">'
    + '<div class="card-header"><h3>' + r.seedType + ' Seed</h3><span class="badge ' + (act === 'Active' ? 'badge-success' : 'badge-danger') + '">' + act + '</span></div>'
    + '<div class="card-body">'
    + row('Member Name', r.memberName + ' (' + r.memberId + ')')
    + row('Seed Type', r.seedType)
    + row('Procurement Year', r.finYear)
    + row('Season', r.season)
    + row('Crop', r.crop)
    + row('Variety', r.variety)
    + row('Allocated Date', r.allocDate)
    + row('Procurement Date', r.procDate)
    + row('Unit', r.unit)
    + row('Allocated Quantity', App._fcQtyText(r.allocQty, r.unit))
    + row('Produce Quantity', App._fcQtyText(r.produceQty, r.unit))
    + '</div>'
    + '<div class="card-header" style="border-top:1px solid #E0E0E0;border-bottom:none;justify-content:flex-end;">'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'soc-fc-list\')"><span class="material-icons">arrow_back</span> Back</button>'
    + '<button class="btn btn-warning" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-edit\')"><span class="material-icons">edit</span> Edit</button>'
    + '</div></div></div>';
};

// ══════════════════════════════════════════════
// 14. FOUNDATION & CERTIFIED SEED — SAVE / ACTIVATE
// ══════════════════════════════════════════════
App.smFCSave = function (mode) {
  var isEdit = mode === 'edit';
  App._smClearErr(['fc-member', 'fc-seedtype', 'fc-season', 'fc-crop', 'fc-variety', 'fc-allocdate', 'fc-procdate', 'fc-unit', 'fc-allocqty', 'fc-prodqty']);

  var memberId = App._smGet('fc-member');
  var seedType = App._smGet('fc-seedtype');
  var finYear = App._smGet('fc-finyear') || App._lineFinYear();
  var season = App._smGet('fc-season');
  var crop = App._smGet('fc-crop');
  // Add: one or more varieties from the multi-select. Edit: the record's single variety.
  var varieties = isEdit ? [App._smGet('fc-variety')].filter(Boolean) : App.msValues('fc-variety');
  var allocDate = App._smGet('fc-allocdate');
  var procDate = App._smGet('fc-procdate');
  var unit = App._smGet('fc-unit');
  var allocQty = parseFloat(App._smGet('fc-allocqty'));
  var prodRaw = App._smGet('fc-prodqty');
  var produceQty = prodRaw === '' ? null : parseFloat(prodRaw);

  var existing = isEdit ? App.state.fcSeedStock.find(function (r) { return r.id === App.state.fcSelId; }) : null;
  var member = (App.state.members || []).find(function (m) { return m.id === memberId; });
  var memberName = member ? member.name : (existing && existing.memberId === memberId ? existing.memberName : '');

  var ok = true;
  if (!memberId || !memberName) { App._smErr('fc-member', 'Member is required.'); ok = false; }
  if (!seedType) { App._smErr('fc-seedtype', 'Seed type is required.'); ok = false; }
  if (!season) { App._smErr('fc-season', 'Season is required.'); ok = false; }
  if (!crop) { App._smErr('fc-crop', 'Crop is required.'); ok = false; }
  if (!varieties.length) { App._smErr('fc-variety', 'Variety is required.'); ok = false; }
  if (!allocDate) { App._smErr('fc-allocdate', 'Allocated date is required.'); ok = false; }
  if (!unit) { App._smErr('fc-unit', 'Unit is required.'); ok = false; }
  if (isNaN(allocQty) || allocQty <= 0) { App._smErr('fc-allocqty', 'Allocated quantity must be greater than 0.'); ok = false; }
  if (produceQty !== null && (isNaN(produceQty) || produceQty < 0)) { App._smErr('fc-prodqty', 'Produce quantity must be 0 or more.'); ok = false; }
  if (procDate && allocDate && procDate < allocDate) { App._smErr('fc-procdate', 'Procurement date cannot be before the allocated date.'); ok = false; }
  if (!ok) return;

  var now = new Date().toISOString().slice(0, 10);
  var by = (App.state.currentUser && App.state.currentUser.name) || 'Society Head';
  var list = App.state.fcSeedStock;
  if (isEdit) {
    if (!existing) return;
    Object.assign(existing, {
      memberId: memberId, memberName: memberName, seedType: seedType, finYear: finYear, season: season, crop: crop, variety: varieties[0],
      allocDate: allocDate, procDate: procDate, unit: unit, allocQty: allocQty, produceQty: produceQty, updatedAt: now
    });
    App._smToast('Entry updated successfully!');
  } else {
    // One record per selected variety; every other detail is shared.
    varieties.forEach(function (variety) {
      list.unshift({
        id: App._smNextId(list, 'FCS-'), memberId: memberId, memberName: memberName, seedType: seedType, finYear: finYear, season: season,
        crop: crop, variety: variety, allocDate: allocDate, procDate: procDate, unit: unit, allocQty: allocQty, produceQty: produceQty,
        activeStatus: 'Active', createdBy: by, createdAt: now, updatedAt: now
      });
    });
    App._smToast(varieties.length > 1 ? varieties.length + ' entries created successfully!' : 'Entry created successfully!');
  }
  App.msReset('fc-variety');
  App.state.fcSelId = null;
  App.navigate('soc-fc-list');
};

App.smFCToggleActive = function (id) {
  var r = (App.state.fcSeedStock || []).find(function (x) { return x.id === id; });
  if (!r) return;
  r.activeStatus = (r.activeStatus || 'Active') === 'Active' ? 'Inactive' : 'Active';
  App._smToast('Record marked ' + r.activeStatus + '.');
  App.render();
};

// ════════════════════════════════════════════════════════════
// MODULE — SEED BUYING / SELLING LINE MANAGEMENT (Admin)
// A "line" is an open window during which the portal buys seed from
// or sells seed to societies for a given seed type / season / crop / variety.
// ════════════════════════════════════════════════════════════
(function () {
  // ── State ──
  App.state.seedLines = [
    { id: 'LINE-001', lineType: 'Buying', seedType: 'Breeder', finYear: '2024-2025', season: 'Kharif', crop: 'Soybean', variety: 'JS-335', startDate: '2024-06-01', endDate: '2024-07-31' },
    { id: 'LINE-002', lineType: 'Buying/Selling', seedType: 'Certified', finYear: '2024-2025', season: 'Rabi', crop: 'Wheat', variety: 'GW-322', startDate: '2024-10-01', endDate: '2024-11-30' },
    { id: 'LINE-003', lineType: 'Buying/Selling', seedType: 'Foundation', finYear: '2024-2025', season: 'Rabi', crop: 'Gram', variety: 'JG-315', startDate: '2024-10-15', endDate: '2024-12-15' },
  ];
  App.state.showSeedLineForm = false;

  // ── Current Indian financial year (Apr–Mar), e.g. "2024-2025". ──
  App._lineFinYear = function () {
    var now = new Date();
    var y = now.getFullYear();
    var startY = now.getMonth() >= 3 ? y : y - 1;
    return startY + '-' + (startY + 1);
  };

  // ── A line's status, derived from today's date vs its window. ──
  App._lineStatus = function (line) {
    var today = new Date().toISOString().split('T')[0];
    if (line.endDate && today > line.endDate) return 'Closed';
    if (line.startDate && today < line.startDate) return 'Scheduled';
    return 'Open';
  };
  App._lineStatusBadge = function (s) {
    var c = s === 'Open' ? 'badge-success' : s === 'Scheduled' ? 'badge-info' : 'badge-gray';
    return '<span class="badge ' + c + '">' + s + '</span>';
  };

  // ── Dropdown option helpers (reuse stock-management option builders where present). ──
  App._lineCropOpts = function (sel) {
    if (App._smCropNameOpts) return App._smCropNameOpts(sel);
    var names = ['Paddy', 'Wheat', 'Soybean', 'Gram', 'Mustard', 'Maize'];
    return names.map(function (n) { return '<option value="' + n + '"' + (n === sel ? ' selected' : '') + '>' + n + '</option>'; }).join('');
  };
  // Line Type drives Seed Type:
  //   Buying             -> Breeder Seed
  //   Buying/Selling     -> Breeder, Foundation, Certified and Hybrid
  App._lineTypeList = [
    { value: 'Buying', label: 'Buying (Breeder Seed)', seedTypes: ['Breeder'] },
    { value: 'Buying/Selling', label: 'Buying/Selling (Foundation and Certified)', seedTypes: ['Breeder', 'Foundation', 'Certified', 'Hybrid'] }
  ];
  App._lineSeedTypesFor = function (lineType) {
    var lt = App._lineTypeList.filter(function (x) { return x.value === lineType; })[0];
    return lt ? lt.seedTypes : [];
  };
  App._lineTypeOpts = function (sel) {
    return App._lineTypeList.map(function (x) {
      return '<option value="' + x.value + '"' + (x.value === sel ? ' selected' : '') + '>' + x.label + '</option>';
    }).join('');
  };
  App._lineSeedTypeOpts = function (lineType, sel) {
    return App._lineSeedTypesFor(lineType).map(function (s) {
      return '<option' + (s === sel ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
  };
  // Line Type changed → rebuild the Seed Type options (keeps the current choice when still allowed).
  App.onLineTypeChange = function () {
    var lt = document.getElementById('sl-type'), st = document.getElementById('sl-seedtype');
    if (!st || !lt) return;
    st.innerHTML = App._lineSeedTypeOpts(lt.value, st.value);
  };
  // Crop names available for the line form's crop multi-select.
  App._lineCropNames = function () {
    var out = [], re = />([^<]+)<\/option>/g, m, html = App._lineCropOpts('');
    while ((m = re.exec(html))) out.push(m[1]);
    return out;
  };
  // Crop multi-select for the line form.
  App._lineCropMs = function () {
    return App.msRender('sl-crop', App._lineCropNames(), false, '', function () { App.onLineCropChange(); }, 'Crop');
  };
  // Variety multi-select for the line form: varieties of ALL selected crops.
  App._lineVarietyMs = function (crops) {
    var opts = [];
    (crops || []).forEach(function (c) {
      App.varietiesForCrop(c).forEach(function (v) { if (opts.indexOf(v) === -1) opts.push(v); });
    });
    return App.msRender('sl-variety', opts, !(crops && crops.length), 'Select Crop first');
  };
  // Crop selection changed → rebuild the variety list in place (stale selections are dropped).
  App.onLineCropChange = function () {
    App._lineVarietyMs(App.msValues('sl-crop'));
    App._msRefresh('sl-variety');
  };

  // ── Open / close the form ──
  App.openSeedLineForm = function () {
    this.state.seedLineEditId = null;
    this.msReset('sl-crop'); this.msReset('sl-variety');
    this.state.showSeedLineForm = true; this.render();
  };
  App.closeSeedLineForm = function () { this.msReset('sl-crop'); this.msReset('sl-variety'); this.state.seedLineEditId = null; this.state.showSeedLineForm = false; this.render(); };
  // Crops / varieties of a line as arrays (older lines only have the comma-joined text).
  App._lineList = function (arr, text) { return (arr && arr.length) ? arr.slice() : String(text || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean); };
  // Edit: open the form pre-filled with the line.
  App.openSeedLineEdit = function (id) {
    var l = this.state.seedLines.find(function (x) { return x.id === id; });
    if (!l) return;
    this.state.seedLineEditId = id;
    this.state.seedLineViewId = null;
    this.msReset('sl-crop'); this.msReset('sl-variety');
    this.msSetValues('sl-crop', App._lineList(l.crops, l.crop));
    this.msSetValues('sl-variety', App._lineList(l.varieties, l.variety));
    this.state.showSeedLineForm = true; this.render();
  };
  // View: read-only popup.
  App.openSeedLineView = function (id) { this.state.seedLineViewId = id; this.render(); };
  App.closeSeedLineView = function () { this.state.seedLineViewId = null; this.render(); };
  App.renderSeedLineView = function () {
    var l = this.state.seedLines.find(function (x) { return x.id === App.state.seedLineViewId; });
    if (!l) return '';
    var row = function (k, v) { return '<div class="invoice-row"><span class="label">' + k + '</span><span class="value">' + v + '</span></div>'; };
    return '<div class="modal-overlay" onclick="if(event.target===this)App.closeSeedLineView()"><div class="modal-box" style="max-width:520px;">'
      + '<div class="modal-header"><h3>Trade Line Details</h3><button class="modal-close" onclick="App.closeSeedLineView()">\u2715</button></div>'
      + '<div class="modal-body">'
      + row('Line Type', l.lineType)
      + row('Seed Type', l.seedType)
      + row('Procurement Year', l.finYear)
      + row('Season', l.season)
      + row('Crop', l.crop)
      + row('Variety', l.variety)
      + row('Start Date', l.startDate)
      + row('End Date', l.endDate)
      + row('Status', App._lineStatusBadge(App._lineStatus(l)))
      + '</div>'
      + '<div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;">'
      + '<button class="btn btn-warning" onclick="App.openSeedLineEdit(\'' + l.id + '\')"><span class="material-icons">edit</span> Edit</button>'
      + '<button class="btn btn-gray" onclick="App.closeSeedLineView()">Close</button></div>'
      + '</div></div>';
  };

  // ── Save a new line from the form ──
  App.saveSeedLine = function () {
    var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    var lineType = g('sl-type');
    var seedType = g('sl-seedtype');
    var editing = this.state.seedLineEditId ? this.state.seedLines.find(function (x) { return x.id === App.state.seedLineEditId; }) : null;
    var finYear = g('sl-finyear') || this._lineFinYear();
    var season = g('sl-season');
    // One line can cover several crops and several varieties.
    if (App._lineSeedTypesFor(lineType).indexOf(seedType) === -1) { this.showToast(lineType === 'Buying' ? 'Buying line is only for Breeder Seed' : 'Invalid Seed Type for this Line Type'); return; }
    var crops = this.msValues('sl-crop');
    var crop = crops.join(', ');
    var varieties = this.msValues('sl-variety');
    var variety = varieties.join(', ');
    var startDate = g('sl-start');
    var endDate = g('sl-end');
    if (!crops.length || !varieties.length) { this.showToast('Please select at least one crop and one variety'); return; }
    if (!startDate || !endDate) { this.showToast('Please set line start and end dates'); return; }
    if (endDate < startDate) { this.showToast('End date cannot be before start date'); return; }
    var data = { lineType: lineType, seedType: seedType, finYear: finYear, season: season, crop: crop, crops: crops, variety: variety, varieties: varieties, startDate: startDate, endDate: endDate };
    var msg;
    if (editing) {
      Object.keys(data).forEach(function (k) { editing[k] = data[k]; });
      msg = 'Line ' + editing.id + ' updated.';
    } else {
      var nums = this.state.seedLines.map(function (x) { return parseInt(String(x.id).replace(/\D/g, ''), 10) || 0; });
      var id = 'LINE-' + String((nums.length ? Math.max.apply(null, nums) : 0) + 1).padStart(3, '0');
      data.id = id;
      this.state.seedLines.unshift(data);
      msg = 'Seed ' + lineType.toLowerCase() + ' line ' + id + ' created.';
    }
    this.msReset('sl-crop');
    this.msReset('sl-variety');
    this.state.seedLineEditId = null;
    this.state.showSeedLineForm = false;
    this.showToast(msg);
    this.render();
  };

  // ── Page: list or form ──
  App.renderSeedLines = function () {
    if (this.state.showSeedLineForm) return this.renderSeedLineForm();
    var lines = this.state.seedLines;
    var typeBadge = function (t) { return '<span class="badge ' + (t === 'Buying' ? 'badge-info' : 'badge-purple') + '">' + t + '</span>'; };
    var rows = lines.map(function (l) {
      var st = App._lineStatus(l);
      return '<tr>'
        + '<td>' + typeBadge(l.lineType) + '</td>'
        + '<td>' + l.seedType + '</td>'
        + '<td>' + l.finYear + '</td>'
        + '<td>' + l.season + '</td>'
        + '<td>' + l.crop + '</td>'
        + '<td>' + l.variety + '</td>'
        + '<td>' + l.startDate + '</td>'
        + '<td>' + l.endDate + '</td>'
        + '<td>' + App._lineStatusBadge(st) + '</td>'
        + '<td><div style="display:flex;gap:6px;">'
        + '<button class="btn btn-outline btn-sm" title="View" onclick="App.openSeedLineView(\'' + l.id + '\')"><span class="material-icons" style="font-size:16px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.openSeedLineEdit(\'' + l.id + '\')"><span class="material-icons" style="font-size:16px;">edit</span></button>'
        + '</div></td>'
        + '</tr>';
    }).join('');
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>Seed Buying/Selling Line Management</h1><p>Open and manage seed buying and selling lines for societies</p></div>',
      '<button class="btn btn-primary" onclick="App.openSeedLineForm()"><span class="material-icons">add</span> New Line</button>',
      '</div>',
      '<div class="card"><div class="card-header"><h3>All Trade Lines</h3></div>',
      '<div class="card-body" style="padding:0;">',
      lines.length === 0
        ? '<div style="padding:48px;text-align:center;color:#9E9E9E;"><span class="material-icons" style="font-size:48px;display:block;margin-bottom:12px;">swap_horiz</span><p>No lines yet.</p></div>'
        : '<div class="table-wrap"><table><thead><tr>'
        + '<th>Type</th><th>Seed Type</th><th>Proc. Year</th><th>Season</th><th>Crop</th><th>Variety</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th>'
        + '</tr></thead><tbody>' + rows + '</tbody></table></div>',
      '</div></div>',
      this.state.seedLineViewId ? this.renderSeedLineView() : ''
    ].join('');
  };

  // ── Form ──
  App.renderSeedLineForm = function () {
    var e = this.state.seedLineEditId ? this.state.seedLines.find(function (x) { return x.id === App.state.seedLineEditId; }) : null;
    var fy = (e && e.finYear) || this._lineFinYear();
    var today = new Date().toISOString().split('T')[0];
    var lt = e ? e.lineType : 'Buying';
    var seasonOpts = ['Kharif', 'Rabi', 'Summer'].map(function (s) { return '<option' + (e && e.season === s ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>' + (e ? 'Edit Trade Line' : 'New Trade Line') + '</h1><p>' + (e ? 'Update the seed buying or selling line' : 'Open a new seed buying or selling line') + '</p></div>',
      '<button class="btn btn-gray" onclick="App.closeSeedLineForm()"><span class="material-icons">arrow_back</span> Back to List</button>',
      '</div>',
      '<div class="card" style="max-width:860px;"><div class="card-body">',
      '<div class="form-grid">',

      '<div class="form-group"><label>Line Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-type" onchange="App.onLineTypeChange()">' + App._lineTypeOpts(lt) + '</select></div>',

      '<div class="form-group"><label>Seed Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-seedtype">' + App._lineSeedTypeOpts(lt, e ? e.seedType : '') + '</select></div>',

      '<div class="form-group"><label>Procurement Year</label>',
      '<input type="text" class="form-control" id="sl-finyear" value="' + fy + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>',

      '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-season">' + seasonOpts + '</select></div>',

      '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label>',
      App._lineCropMs(),
      App.msHint('Select one or more crops for this line.'),
      '</div>',

      '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>',
      App._lineVarietyMs(App.msValues('sl-crop')),
      App.msHint('Select one or more varieties for this line.'),
      '</div>',

      '<div class="form-group"><label>Line Start Date <span style="color:#F44336">*</span></label>',
      '<input type="date" class="form-control" id="sl-start" value="' + (e ? e.startDate : today) + '"/></div>',

      '<div class="form-group"><label>Line End Date <span style="color:#F44336">*</span></label>',
      '<input type="date" class="form-control" id="sl-end" value="' + (e ? e.endDate : '') + '"/></div>',

      '</div>',
      '<div style="display:flex;gap:12px;margin-top:20px;">',
      '<button class="btn btn-gray" onclick="App.closeSeedLineForm()">Cancel</button>',
      '<button class="btn btn-primary btn-lg" style="flex:1;" onclick="App.saveSeedLine()"><span class="material-icons">check_circle</span> ' + (e ? 'Update Line' : 'Save Line') + '</button>',
      '</div>',
      '</div></div>'
    ].join('');
  };

  // Always land on the list (not the form) when opening the page.
  var _navPrev = App.navigate.bind(App);
  App.navigate = function (page) {
    if (page === 'admin-seed-lines') { this.state.showSeedLineForm = false; this.state.seedLineEditId = null; this.state.seedLineViewId = null; }
    if (page === 'admin-packaging') { this.state.showPackagingForm = false; this.state.pkEditId = null; this.state.pkViewId = null; }
    return _navPrev(page);
  };
}());


// ════════════════════════════════════════════════════════════
// MODULE — PACKAGING SET (Admin)
// Defines the pack size (unit + quantity) used when packing seed, per
// Procurement Year / Seed Type / Season / Crop / Variety. Picking several
// varieties applies the same unit + quantity to each; one record is saved
// per variety.
// ════════════════════════════════════════════════════════════
(function () {
  // ── State ──
  App.state.packagingSets = [
    { id: 'PKG-001', finYear: '2024-2025', seedType: 'Certified', season: 'Rabi', crop: 'Wheat', variety: 'GW-322', unit: 'Kg', quantity: 40 },
    { id: 'PKG-002', finYear: '2024-2025', seedType: 'Breeder', season: 'Kharif', crop: 'Soybean', variety: 'JS-335', unit: 'Kg', quantity: 25 },
    { id: 'PKG-003', finYear: '2024-2025', seedType: 'Foundation', season: 'Rabi', crop: 'Gram', variety: 'JG-315', unit: 'Kg', quantity: 30 }
  ];
  App.state.showPackagingForm = false;

  // Units follow the project-wide rule: Kg and Quintal only.
  App._pkUnits = function () { return App._seUnits || ['Kg', 'Quintal']; };

  App.openPackagingForm = function () { this.state.pkEditId = null; this.msReset('pk-crop'); this.msReset('pk-variety'); this.state.showPackagingForm = true; this.render(); };
  App.closePackagingForm = function () { this.msReset('pk-crop'); this.msReset('pk-variety'); this.state.pkEditId = null; this.state.showPackagingForm = false; this.render(); };
  // Edit one packaging record (single crop + single variety, like other edit forms).
  App.openPackagingEdit = function (id) {
    if (!this.state.packagingSets.some(function (p) { return p.id === id; })) return;
    this.state.pkEditId = id; this.state.pkViewId = null;
    this.state.showPackagingForm = true; this.render();
  };
  // Edit form: crop changed → refill the single variety select.
  App.onPkEditCropChange = function () {
    var c = document.getElementById('pk-crop-one'), v = document.getElementById('pk-variety-one');
    if (!c || !v) return;
    v.innerHTML = '<option value="">Select Variety</option>' + App.varietiesForCrop(c.value).map(function (n) { return '<option>' + n + '</option>'; }).join('');
  };
  // View: read-only popup.
  App.openPackagingView = function (id) { this.state.pkViewId = id; this.render(); };
  App.closePackagingView = function () { this.state.pkViewId = null; this.render(); };
  App.renderPackagingView = function () {
    var p = this.state.packagingSets.find(function (x) { return x.id === App.state.pkViewId; });
    if (!p) return '';
    var row = function (k, v) { return '<div class="invoice-row"><span class="label">' + k + '</span><span class="value">' + v + '</span></div>'; };
    return '<div class="modal-overlay" onclick="if(event.target===this)App.closePackagingView()"><div class="modal-box" style="max-width:480px;">'
      + '<div class="modal-header"><h3>Packaging Details</h3><button class="modal-close" onclick="App.closePackagingView()">\u2715</button></div>'
      + '<div class="modal-body">'
      + row('Procurement Year', p.finYear) + row('Seed Type', p.seedType) + row('Season', p.season)
      + row('Crop', p.crop) + row('Variety', p.variety) + row('Quantity', '<b>' + p.quantity + '</b>') + row('Unit', p.unit)
      + '</div>'
      + '<div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;">'
      + '<button class="btn btn-warning" onclick="App.openPackagingEdit(\'' + p.id + '\')"><span class="material-icons">edit</span> Edit</button>'
      + '<button class="btn btn-gray" onclick="App.closePackagingView()">Close</button></div>'
      + '</div></div>';
  };

  // Variety multi-select for the form (crop-wise).
  App._pkCropMs = function () {
    return App.msRender('pk-crop', App._lineCropNames(), false, '', function () { App.onPackagingCropChange(); }, 'Crop');
  };
  // Variety multi-select: varieties of ALL selected crops.
  App._pkVarietyMs = function (crops) {
    var opts = [];
    (crops || []).forEach(function (c) {
      App.varietiesForCrop(c).forEach(function (v) { if (opts.indexOf(v) === -1) opts.push(v); });
    });
    return App.msRender('pk-variety', opts, !(crops && crops.length), 'Select Crop first');
  };
  // Crop changed → rebuild the variety list in place (any stale selection is dropped).
  App.onPackagingCropChange = function () {
    App._pkVarietyMs(App.msValues('pk-crop'));
    App._msRefresh('pk-variety');
  };

  // ── Save: one packaging record per selected variety ──
  App.savePackaging = function () {
    var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    var finYear = g('pk-finyear') || this._lineFinYear();
    var seedType = g('pk-seedtype');
    var season = g('pk-season');
    var editRec = this.state.pkEditId ? this.state.packagingSets.find(function (p) { return p.id === App.state.pkEditId; }) : null;
    var crops = editRec ? [g('pk-crop-one')].filter(Boolean) : this.msValues('pk-crop');
    var varieties = editRec ? [g('pk-variety-one')].filter(Boolean) : this.msValues('pk-variety');
    var unit = g('pk-unit');
    var quantity = parseFloat(g('pk-qty'));
    if (!seedType || !season || !crops.length) { this.showToast('Please select seed type, season and crop'); return; }
    if (!varieties.length) { this.showToast('Please select at least one variety'); return; }
    if (!unit) { this.showToast('Please select a unit'); return; }
    if (!quantity || quantity <= 0) { this.showToast('Please enter a valid quantity'); return; }

    // Block exact duplicates (same year/type/season/crop/variety/unit/quantity). Check every variety first.
    var list = this.state.packagingSets;
    // One record per (crop, variety) pair: each selected variety is paired with the selected crop(s) it belongs to.
    var pairs = [];
    if (editRec) pairs.push({ crop: crops[0], variety: varieties[0] });
    else crops.forEach(function (c) {
      var cv = App.varietiesForCrop(c);
      varieties.forEach(function (v) { if (cv.indexOf(v) !== -1) pairs.push({ crop: c, variety: v }); });
    });
    var dups = pairs.filter(function (pr) {
      return list.some(function (p) {
        return p !== editRec && p.finYear === finYear && p.seedType === seedType && p.season === season && p.crop === pr.crop
          && p.variety === pr.variety && p.unit === unit && Number(p.quantity) === quantity;
      });
    }).map(function (pr) { return pr.variety; });
    if (dups.length) {
      this.showToast('Packaging of ' + quantity + ' ' + unit + ' already exists for: ' + dups.join(', '));
      return;
    }

    if (editRec) {
      editRec.seedType = seedType; editRec.season = season; editRec.crop = crops[0]; editRec.variety = varieties[0]; editRec.unit = unit; editRec.quantity = quantity;
      this.state.pkEditId = null;
      this.state.showPackagingForm = false;
      this.showToast('Packaging set updated.');
      this.render();
      return;
    }
    var nextNo = Math.max(0, Math.max.apply(null, list.map(function (p) { return parseInt(String(p.id).replace(/\D/g, ''), 10) || 0; })));
    pairs.forEach(function (pr) {
      nextNo += 1;
      list.unshift({ id: 'PKG-' + String(nextNo).padStart(3, '0'), finYear: finYear, seedType: seedType, season: season, crop: pr.crop, variety: pr.variety, unit: unit, quantity: quantity });
    });
    this.msReset('pk-crop');
    this.msReset('pk-variety');
    this.state.showPackagingForm = false;
    this.showToast(pairs.length > 1 ? 'Packaging set added for ' + pairs.length + ' crop-variety combinations.' : 'Packaging set added.');
    this.render();
  };

  // ── Page: list or form ──
  App.renderPackaging = function () {
    if (this.state.showPackagingForm) return this.renderPackagingForm();
    var rows = this.state.packagingSets.map(function (p) {
      return '<tr>'
        + '<td>' + p.finYear + '</td>'
        + '<td>' + p.seedType + '</td>'
        + '<td>' + p.season + '</td>'
        + '<td>' + p.crop + '</td>'
        + '<td>' + p.variety + '</td>'
        + '<td style="font-weight:700;color:#2E7D32;">' + p.quantity + '</td>'
        + '<td>' + p.unit + '</td>'
        + '<td><div style="display:flex;gap:6px;">'
        + '<button class="btn btn-outline btn-sm" title="View" onclick="App.openPackagingView(\'' + p.id + '\')"><span class="material-icons" style="font-size:16px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.openPackagingEdit(\'' + p.id + '\')"><span class="material-icons" style="font-size:16px;">edit</span></button>'
        + '</div></td>'
        + '</tr>';
    }).join('');
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>Seed Packaging Management</h1><p>Define pack size (unit and quantity) for each seed type, crop and variety</p></div>',
      '<button class="btn btn-primary" onclick="App.openPackagingForm()"><span class="material-icons">add</span> New Packaging</button>',
      '</div>',
      '<div class="card"><div class="card-header"><h3>All Packaging Sets</h3></div>',
      '<div class="card-body" style="padding:0;">',
      this.state.packagingSets.length === 0
        ? '<div style="padding:48px;text-align:center;color:#9E9E9E;"><span class="material-icons" style="font-size:48px;display:block;margin-bottom:12px;">inventory_2</span><p>No packaging sets yet.</p></div>'
        : '<div class="table-wrap"><table><thead><tr>'
        + '<th>Proc. Year</th><th>Seed Type</th><th>Season</th><th>Crop</th><th>Variety</th><th>Quantity</th><th>Unit</th><th>Actions</th>'
        + '</tr></thead><tbody>' + rows + '</tbody></table></div>',
      '</div></div>',
      this.state.pkViewId ? this.renderPackagingView() : ''
    ].join('');
  };

  // ── Form ──
  App.renderPackagingForm = function () {
    var e = this.state.pkEditId ? this.state.packagingSets.find(function (p) { return p.id === App.state.pkEditId; }) : null;
    var fy = (e && e.finYear) || this._lineFinYear();
    var opts = function (list, sel) { return list.map(function (x) { return '<option' + (x === sel ? ' selected' : '') + '>' + x + '</option>'; }).join(''); };
    var unitOpts = opts(App._pkUnits(), e ? e.unit : '');
    var cropField = e
      ? '<select class="form-control" id="pk-crop-one" onchange="App.onPkEditCropChange()"><option value="">Select Crop</option>' + App._lineCropOpts(e.crop) + '</select>'
      : App._pkCropMs() + App.msHint('Select one or more crops.');
    var varietyField = e
      ? '<select class="form-control" id="pk-variety-one"><option value="">Select Variety</option>' + opts(App.varietiesForCrop(e.crop), e.variety) + '</select>'
      : App._pkVarietyMs(App.msValues('pk-crop')) + App.msHint('Select one or more varieties. Same unit and quantity apply to each.');
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>' + (e ? 'Edit Packaging' : 'New Packaging') + '</h1><p>Set the pack size for a seed type, crop and variety</p></div>',
      '<button class="btn btn-gray" onclick="App.closePackagingForm()"><span class="material-icons">arrow_back</span> Back to List</button>',
      '</div>',
      '<div class="card" style="max-width:860px;"><div class="card-body">',
      '<div class="form-grid">',

      '<div class="form-group"><label>Procurement Year</label>',
      '<input type="text" class="form-control" id="pk-finyear" value="' + fy + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>',

      '<div class="form-group"><label>Seed Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-seedtype"><option value="">Select Seed Type</option>' + opts(['Breeder', 'Foundation', 'Certified', 'Hybrid'], e ? e.seedType : '') + '</select></div>',

      '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-season"><option value="">Select Season</option>' + opts(['Kharif', 'Rabi', 'Summer'], e ? e.season : '') + '</select></div>',

      '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label>',
      cropField,
      '</div>',

      '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>',
      varietyField,
      '</div>',

      '<div class="form-group"><label>Unit <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-unit"><option value="">Select Unit</option>' + unitOpts + '</select></div>',

      '<div class="form-group"><label>Quantity <span style="color:#F44336">*</span></label>',
      '<input type="number" class="form-control" id="pk-qty" min="0.1" step="any" placeholder="e.g. 40" value="' + (e ? e.quantity : '') + '"/>',
      '<div style="font-size:0.72rem;color:#757575;margin-top:4px;">Quantity of seed in one pack, in the selected unit.</div></div>',

      '</div>',
      '<div style="display:flex;gap:12px;margin-top:20px;">',
      '<button class="btn btn-gray" onclick="App.closePackagingForm()">Cancel</button>',
      '<button class="btn btn-primary btn-lg" style="flex:1;" onclick="App.savePackaging()"><span class="material-icons">check_circle</span> ' + (e ? 'Update Packaging' : 'Save Packaging') + '</button>',
      '</div>',
      '</div></div>'
    ].join('');
  };
}());
