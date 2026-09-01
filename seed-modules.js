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
      id: 'HSA-001', season: 'Kharif 2024', variety: 'DKC-9144',
      parentVariety: 'DMRH-202', society: 'Rampur Krishi Samiti',
      socCode: 'SOC-001', allocQty: 120, expectedProd: 480,
      allocDate: '2024-05-10', lastDate: '2024-06-30',
      remarks: 'Priority allocation', status: 'Allocated',
      createdBy: 'Admin Sharma', createdAt: '2024-05-10', updatedAt: '2024-05-10'
    },
    {
      id: 'HSA-002', season: 'Rabi 2024-25', variety: 'PAC-749',
      parentVariety: '', society: 'Sehora Kisan Sabha',
      socCode: 'SOC-002', allocQty: 80, expectedProd: 320,
      allocDate: '2024-10-15', lastDate: '2024-12-15',
      remarks: '', status: 'Draft',
      createdBy: 'Admin Sharma', createdAt: '2024-10-15', updatedAt: '2024-10-15'
    },
    {
      id: 'HSA-003', season: 'Rabi 2024-25', variety: 'NK-6240',
      parentVariety: 'R-301', society: 'Bargaon Beej Samiti',
      socCode: 'SOC-003', allocQty: 60, expectedProd: 240,
      allocDate: '2024-11-01', lastDate: '2025-01-31',
      remarks: '', status: 'Draft',
      createdBy: 'Admin Sharma', createdAt: '2024-11-01', updatedAt: '2024-11-01'
    },
  ];

  App.state.fcSeedStock = [
    {
      id: 'FCS-001', season: 'Kharif 2024', category: 'Foundation',
      variety: 'GW-322', breederLotNo: 'BL-2024-001',
      producedQty: 500, availableQty: 380, processingDate: '2024-07-15',
      qualityStatus: 'Passed', certNumber: 'CERT-MP-001', certDate: '2024-08-01',
      packagingQty: 40, storageLocation: 'Warehouse A, Rack 3',
      remarks: 'First batch', societyId: 'SOC-001',
      createdBy: 'Ramesh Verma', createdAt: '2024-07-15', updatedAt: '2024-08-01'
    },
    {
      id: 'FCS-002', season: 'Rabi 2024-25', category: 'Certified',
      variety: 'JG-315', breederLotNo: 'BL-2024-008',
      producedQty: 200, availableQty: 200, processingDate: '2024-11-10',
      qualityStatus: 'Pending', certNumber: '', certDate: '',
      packagingQty: 40, storageLocation: 'Warehouse B',
      remarks: 'Testing in progress', societyId: 'SOC-001',
      createdBy: 'Ramesh Verma', createdAt: '2024-11-10', updatedAt: '2024-11-10'
    },
  ];

  App.state.hybridSelId = null;
  App.state.hybridFilter = { season: '', society: '', status: '', search: '' };
  App.state.fcSelId = null;
  App.state.fcFilter = { season: '', category: '', search: '' };
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

      '<div class="nav-section"><div class="nav-section-title">Price &amp; Stock</div>',
      ni('sell', 'Seeds Rate Management', 'admin-beej-price'),
      ni('warehouse', 'Stock Management', 'admin-stock-mgmt'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Management</div>',
      ni('business', 'Society Management', 'admin-societies'),
      ni('receipt_long', 'Demand Management', 'admin-demands'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Distribution Workflow</div>',
      ni('assignment_turned_in', 'Society Allocation', 'admin-society-allocation'),
      ni('local_shipping', 'Dispatch Orders', 'admin-dispatch-orders'),
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

      '<div class="nav-section"><div class="nav-section-title">Reports &amp; Users</div>',
      ni('bar_chart', 'Reports', 'admin-reports'),
      ni('manage_accounts', 'Users', 'profile'),
      '</div>',

      '</div>',
      '<div class="sidebar-footer" onclick="App.logout()">',
      '<span class="material-icons">logout</span><span>Logout</span>',
      '</div></nav>'
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
      ni('add_shopping_cart', 'Raise Breeder Seed Demand', 'raise-demand'),
      ni('history', 'Breeder Seed Demand History', 'demand-history'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Distribution</div>',
      ni('inventory_2', 'Available Stock', 'soc-available-stock'),
      ni('how_to_reg', 'Breeder Seeds Distribution to Member', 'soc-member-distribution'),
      ni('receipt_long', 'Distribution Register', 'soc-dist-register'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Stock</div>',
      ni('inventory_2', 'Foundation &amp; Certified Seed', 'soc-fc-list'),
      ni('add_circle', 'Foundation and Certified Seed Management', 'soc-fc-add', true),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Payments</div>',
      ni('payment', 'Payment History', 'payment-history'),
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
    'soc-fc-add': 'Foundation and Certified Seed Management',
    'soc-fc-edit': 'Foundation and Certified Seed Management',
    'soc-fc-view': 'Seed Stock Details',
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

  var seasons = Array.from(new Set(all.map(function (r) { return r.season; }))).sort();
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
    + '<thead><tr><th>ID</th><th>Season</th><th>Variety</th><th>Parent Variety</th>'
    + '<th>Society</th><th>Alloc Qty</th><th>Exp. Prod.</th><th>Alloc Date</th>'
    + '<th>Last Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>';

  if (rows.length === 0) {
    html += '<tr><td colspan="11" style="text-align:center;padding:40px;color:#9E9E9E;">No records found.</td></tr>';
  } else {
    rows.forEach(function (r) {
      html += '<tr>'
        + '<td><b>' + r.id + '</b></td>'
        + '<td>' + r.season + '</td>'
        + '<td>' + r.variety + '</td>'
        + '<td style="color:#757575;">' + (r.parentVariety || '—') + '</td>'
        + '<td>' + r.society + '</td>'
        + '<td style="font-weight:600;color:#2E7D32;">' + r.allocQty + ' Qt</td>'
        + '<td>' + r.expectedProd + ' Qt</td>'
        + '<td style="font-size:.8rem;">' + r.allocDate + '</td>'
        + '<td style="font-size:.8rem;">' + r.lastDate + '</td>'
        + '<td>' + App._smBadge(r.status) + '</td>'
        + '<td><div class="action-btns">'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-info btn-sm" title="View" onclick="App.state.hybridSelId=\'' + r.id + '\';App.navigate(\'admin-hybrid-view\')">'
        + '<span class="material-icons" style="font-size:14px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.state.hybridSelId=\'' + r.id + '\';App.navigate(\'admin-hybrid-edit\')">'
        + '<span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn btn-danger btn-sm" title="Delete" onclick="App.smHybridDelete(\'' + r.id + '\')">'
        + '<span class="material-icons" style="font-size:14px;">delete</span></button>'
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

  var seasons = ['Kharif 2024', 'Rabi 2024-25', 'Summer 2025', 'Kharif 2025'];
  var societies = ['Rampur Krishi Samiti', 'Sehora Kisan Sabha', 'Bargaon Beej Samiti', 'Patan Krishi Vikas Samiti'];

  return '<div class="page-header"><h1>' + (isEdit ? 'Edit' : 'New') + ' Hybrid Seed Allocation</h1>'
    + '<p>' + (isEdit ? 'Update allocation details.' : 'Create a new hybrid seed allocation for a society.') + '</p></div>'
    + '<div class="card"><div class="card-body">'

    /* Section 1 */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">grass</span> Allocation Details</div>'
    + '<div class="form-grid">'
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
    + App._smFld('Last Date', 'hf-lastdate', 'date', null, v('lastDate'), true)
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
    + (isEdit ? 'Update Allocation' : 'Save Allocation') + '</button>'
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
    + row('Season', r.season)
    + row('Hybrid Variety', r.variety)
    + row('Parent Variety', r.parentVariety)
    + row('Society', r.society)
    + row('Allocated Qty', r.allocQty + ' Quintal')
    + row('Expected Production', r.expectedProd + ' Quintal')
    + row('Allocation Date', r.allocDate)
    + row('Last Date', r.lastDate)
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
  var errIds = ['hf-season', 'hf-variety', 'hf-society', 'hf-allocqty', 'hf-expprod', 'hf-allocdate', 'hf-lastdate'];
  App._smClearErr(errIds);
  var season = App._smGet('hf-season');
  var variety = App._smGet('hf-variety');
  var society = App._smGet('hf-society');
  var allocQty = parseFloat(App._smGet('hf-allocqty')) || 0;
  var expProd = parseFloat(App._smGet('hf-expprod')) || 0;
  var aDate = App._smGet('hf-allocdate');
  var lDate = App._smGet('hf-lastdate');
  var ok = true;
  if (!season) { App._smErr('hf-season', 'Season is required.'); ok = false; }
  if (!variety) { App._smErr('hf-variety', 'Variety is required.'); ok = false; }
  if (!society) { App._smErr('hf-society', 'Society is required.'); ok = false; }
  if (!allocQty) { App._smErr('hf-allocqty', 'Allocated qty is required.'); ok = false; }
  if (!expProd) { App._smErr('hf-expprod', 'Expected production required.'); ok = false; }
  if (!aDate) { App._smErr('hf-allocdate', 'Allocation date is required.'); ok = false; }
  if (!lDate) { App._smErr('hf-lastdate', 'Last date is required.'); ok = false; }
  if (!ok) return;
  var now = new Date().toISOString().slice(0, 10);
  var existing = isEdit ? App.state.hybridAllocs.find(function (r) { return r.id === App.state.hybridSelId; }) : null;
  var rec = {
    id: isEdit ? App.state.hybridSelId : App._smNextId(App.state.hybridAllocs, 'HSA-'),
    season: season, variety: variety, parentVariety: App._smGet('hf-parent'),
    society: society, socCode: 'SOC-XXX', allocQty: allocQty, expectedProd: expProd,
    allocDate: aDate, lastDate: lDate, remarks: App._smGet('hf-remarks'),
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

// ══════════════════════════════════════════════
// 11. FOUNDATION & CERTIFIED — LIST
// ══════════════════════════════════════════════
App.smRenderFCList = function () {
  var f = this.state.fcFilter;
  var all = this.state.fcSeedStock;
  var rows = all.filter(function (r) {
    return (!f.season || r.season === f.season)
      && (!f.category || r.category === f.category)
      && (!f.search || r.id.toLowerCase().indexOf(f.search.toLowerCase()) > -1
        || r.variety.toLowerCase().indexOf(f.search.toLowerCase()) > -1
        || r.breederLotNo.toLowerCase().indexOf(f.search.toLowerCase()) > -1);
  });

  var seasons = Array.from(new Set(all.map(function (r) { return r.season; }))).sort();

  var html = '<div class="page-header"><h1>Foundation &amp; Certified Seed Management</h1>'
    + '<p>Track and manage foundation and certified seed stock</p></div>';

  /* Stats */
  html += '<div class="stats-grid">'
    + '<div class="stat-card"><div class="stat-icon"><span class="material-icons">inventory_2</span></div><div class="stat-info"><div class="value">' + all.length + '</div><div class="label">Total Records</div></div></div>'
    + '<div class="stat-card blue"><div class="stat-icon"><span class="material-icons">layers</span></div><div class="stat-info"><div class="value">' + all.filter(function (r) { return r.category === 'Foundation'; }).length + '</div><div class="label">Foundation Seed</div></div></div>'
    + '<div class="stat-card"><div class="stat-icon"><span class="material-icons">verified</span></div><div class="stat-info"><div class="value">' + all.filter(function (r) { return r.category === 'Certified'; }).length + '</div><div class="label">Certified Seed</div></div></div>'
    + '<div class="stat-card orange"><div class="stat-icon"><span class="material-icons">scale</span></div><div class="stat-info"><div class="value">' + all.reduce(function (s, r) { return s + r.availableQty; }, 0) + ' Qt</div><div class="label">Available Stock</div></div></div>'
    + '</div>';

  /* Filter bar */
  html += '<div class="search-bar" style="margin-bottom:16px;">'
    + '<div class="search-field"><label>Search</label>'
    + '<input class="form-control" placeholder="ID, Variety, Lot No..." value="' + (f.search || '') + '" oninput="App.state.fcFilter.search=this.value;App.render()"/></div>'
    + '<div class="search-field"><label>Season</label>'
    + '<select class="form-control" onchange="App.state.fcFilter.season=this.value;App.render()">'
    + '<option value="">All Seasons</option>'
    + seasons.map(function (s) { return '<option' + (f.season === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="search-field"><label>Seed Category</label>'
    + '<select class="form-control" onchange="App.state.fcFilter.category=this.value;App.render()">'
    + '<option value="">All Categories</option>'
    + ['Foundation', 'Certified'].map(function (c) { return '<option' + (f.category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="search-field" style="align-self:flex-end;">'
    + '<button class="btn btn-gray btn-sm" onclick="App.state.fcFilter={season:\'\',category:\'\',search:\'\'};App.render()">'
    + '<span class="material-icons">clear</span> Reset</button></div>'
    + '<div style="margin-left:auto;align-self:flex-end;">'
    + '<button class="btn btn-primary" onclick="App.navigate(\'soc-fc-add\')">'
    + '<span class="material-icons">add</span> Add Seed Details</button></div>'
    + '</div>';

  /* Table */
  html += '<div class="card"><div class="card-header">'
    + '<h3>Seed Stock Records <span style="color:#757575;font-weight:400;font-size:.85rem;">(' + rows.length + ' records)</span></h3>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Export</button>'
    + '<button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>'
    + '</div></div>'
    + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Stock ID</th><th>Season</th><th>Category</th><th>Variety</th>'
    + '<th>Lot No.</th><th>Produced</th><th>Available</th><th>Quality</th>'
    + '<th>Cert. No.</th><th>Cert. Date</th><th>Actions</th></tr></thead><tbody>';

  if (rows.length === 0) {
    html += '<tr><td colspan="11" style="text-align:center;padding:40px;color:#9E9E9E;">No records found.</td></tr>';
  } else {
    rows.forEach(function (r) {
      html += '<tr>'
        + '<td><b>' + r.id + '</b></td>'
        + '<td>' + r.season + '</td>'
        + '<td>' + App._smBadge(r.category) + '</td>'
        + '<td>' + r.variety + '</td>'
        + '<td style="font-size:.8rem;">' + r.breederLotNo + '</td>'
        + '<td style="font-weight:600;">' + r.producedQty + ' Qt</td>'
        + '<td style="font-weight:600;color:#2E7D32;">' + r.availableQty + ' Qt</td>'
        + '<td>' + App._smBadge(r.qualityStatus) + '</td>'
        + '<td style="font-size:.8rem;">' + (r.certNumber || '—') + '</td>'
        + '<td style="font-size:.8rem;">' + (r.certDate || '—') + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-info btn-sm" title="View" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-view\')">'
        + '<span class="material-icons" style="font-size:14px;">visibility</span></button>'
        + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-edit\')">'
        + '<span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn btn-danger btn-sm" title="Delete" onclick="App.smFCDelete(\'' + r.id + '\')">  '
        + '<span class="material-icons" style="font-size:14px;">delete</span></button>'
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
// 12. FOUNDATION & CERTIFIED — FORM (Add / Edit)
// ══════════════════════════════════════════════
// 12. FOUNDATION & CERTIFIED SEED — ADD/EDIT FORM
// ══════════════════════════════════════════════
App.smRenderFCForm = function (mode) {
  var isEdit = mode === 'edit';
  var rec = isEdit ? this.state.fcSeedStock.find(function (r) { return r.id === App.state.fcSelId; }) : null;
  var v = function (f, def) { return rec ? (rec[f] !== undefined ? String(rec[f]) : '') : (def || ''); };

  var seedClasses = ['Breeder', 'Foundation I', 'Foundation II', 'Certified'];
  var seasons = ['Kharif 2024', 'Rabi 2024-25', 'Summer 2025', 'Kharif 2025'];
  var crops = ['Wheat', 'Paddy (Rice)', 'Maize', 'Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Gram (Chickpea)', 'Pigeon Pea (Arhar)', 'Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Cotton', 'Sugarcane', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Lentil (Masoor)', 'Barley', 'Oat'];
  var varieties = ['GW-322', 'JS-335', 'JG-315', 'Pusa Bold', 'MTU-7029', 'IR-36', 'DHM-117', 'HHB-67', 'CSH-16', 'UPAS-120', 'TAG-24', 'KBSH-1', 'Suraj (H-777)', 'CO-86032', 'K-851', 'T-9', 'L-4076', 'RD-2035', 'OS-6'];
  var districts = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Chhindwara', 'Seoni', 'Narsinghpur', 'Betul'];
  var blocks = ['Patan', 'Harrai', 'Amarwara', 'Chaurai', 'Mohgaon', 'Sausar', 'Tamia'];
  var certAgencies = ['State Seed Certification Agency (SSCA)', 'Madhya Pradesh State Seed Certification Agency', 'Central Seed Certification Board', 'ICAR Seed Certification', 'Private Certification Agency'];
  var warehouses = ['Central Warehouse, Bhopal', 'Divisional Store, Jabalpur', 'Regional Depot, Indore', 'District Godown, Chhindwara', 'Taluka Store, Patan'];

  return '<div class="page-header"><h1>Foundation and Certified Seed Management</h1>'
    + '<p>' + (isEdit ? 'Update the seed stock record with production and certification details.' : 'Add new foundation or certified seed production details with complete certification information.') + '</p></div>'
    + '<div class="card"><div class="card-body">'

    /* Section 1: Seed Classification & Basic Information */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">category</span> Seed Classification & Basic Information</div>'
    + '<div class="form-grid">'
    + App._smFld('Seed Class', 'ff-seedclass', 'select', seedClasses, v('seedClass'), true)
    + App._smFld('Season', 'ff-season', 'select', seasons, v('season'), true)
    + App._smFld('Crop', 'ff-crop', 'select', crops, v('crop'), true)
    + App._smFld('Variety', 'ff-variety', 'select', varieties, v('variety'), true)
    + App._smFld('Variety Code', 'ff-varietycode', 'text', null, v('varietyCode'), false, 'Auto-populated or enter manually')
    + App._smFld('Seed Lot Number', 'ff-lotno', 'text', null, v('seedLotNo'), true, 'e.g. LOT-2024-W01')
    + App._smFld('Production Year', 'ff-prodyear', 'number', null, v('productionYear', new Date().getFullYear()), true, 'e.g. 2024')
    + '</div></div>'

    /* Section 2: Seed Producer Information */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">agriculture</span> Seed Producer Information</div>'
    + '<div class="form-grid">'
    + App._smFld('Seed Producer Name', 'ff-producername', 'text', null, v('producerName'), true, 'Full name of producer')
    + App._smFld('Producer Registration No.', 'ff-producerreg', 'text', null, v('producerRegNo'), true, 'e.g. PROD-MP-2024-001')
    + App._smFld('Production District', 'ff-proddistrict', 'select', districts, v('productionDistrict'), true)
    + App._smFld('Production Block', 'ff-prodblock', 'select', blocks, v('productionBlock'), true)
    + '</div></div>'

    /* Section 3: Production & Area Details */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">landscape</span> Production & Area Details</div>'
    + '<div class="form-grid">'
    + App._smFld('Area Under Seed Production (Hectare)', 'ff-prodarea', 'number', null, v('productionArea'), true, 'Must be > 0')
    + App._smFld('Expected Production Quantity (Quintal)', 'ff-expectedqty', 'number', null, v('expectedQty'), true, 'Estimated yield')
    + App._smFld('Actual Production Quantity (Quintal)', 'ff-actualqty', 'number', null, v('actualQty'), true, 'Actual harvested quantity')
    + App._smFld('Processing Quantity (Quintal)', 'ff-processingqty', 'number', null, v('processingQty'), false, 'Quantity sent for processing')
    + '</div></div>'

    /* Section 4: Quality & Approval Status */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">verified</span> Quality & Approval Status</div>'
    + '<div class="form-grid">'
    + App._smFld('Approved Quantity (Quintal)', 'ff-approvedqty', 'number', null, v('approvedQty'), true, 'Quantity approved for sale')
    + App._smFld('Rejected Quantity (Quintal)', 'ff-rejectedqty', 'number', null, v('rejectedQty', '0'), false, 'Quantity rejected due to quality')
    + App._smFld('Available Stock Quantity (Quintal)', 'ff-availqty', 'number', null, v('availableQty'), true, 'Current available stock')
    + '</div></div>'

    /* Section 5: Certification Details */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">workspace_premium</span> Certification Details</div>'
    + '<div class="form-grid">'
    + App._smFld('Certification Agency', 'ff-certagency', 'select', certAgencies, v('certAgency'), true)
    + App._smFld('Certification / Tag Number', 'ff-certno', 'text', null, v('certNumber'), true, 'e.g. CERT-MP-2024-001')
    + App._smFld('Certification Date', 'ff-certdate', 'date', null, v('certDate'), true)
    + '</div></div>'

    /* Section 6: Quality Parameters */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">science</span> Quality Parameters</div>'
    + '<div class="form-grid">'
    + App._smFld('Germination %', 'ff-germination', 'number', null, v('germination'), true, 'e.g. 85.5')
    + App._smFld('Physical Purity %', 'ff-purity', 'number', null, v('physicalPurity'), true, 'e.g. 98.0')
    + App._smFld('Moisture %', 'ff-moisture', 'number', null, v('moisture'), true, 'e.g. 12.5')
    + '</div></div>'

    /* Section 7: Storage & Packaging Details */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">warehouse</span> Storage & Packaging Details</div>'
    + '<div class="form-grid">'
    + App._smFld('Storage Warehouse', 'ff-warehouse', 'select', warehouses, v('storageWarehouse'), true)
    + App._smFld('Storage Location / Bin No.', 'ff-storage', 'text', null, v('storageLocation'), false, 'e.g. Rack A-3, Bin 15')
    + App._smFld('Bag Size (Kg)', 'ff-bagsize', 'number', null, v('bagSize', '40'), true, 'e.g. 40')
    + App._smFld('Number of Bags', 'ff-numbags', 'number', null, v('numberOfBags'), true, 'e.g. 250')
    + '<div class="form-group">'
    + '<label>Total Quantity (Kg) <span style="color:#2E7D32;font-size:0.8rem;">(Auto-calculated)</span></label>'
    + '<input type="text" id="ff-totalkg" class="form-control" value="' + v('totalQuantityKg', '0') + '" readonly style="background:#E8F5E9;font-weight:600;color:#2E7D32;"/>'
    + '</div>'
    + '</div></div>'

    /* Section 8: Supporting Documents */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">upload_file</span> Supporting Documents</div>'
    + '<div class="form-grid">'
    + '<div class="form-group" style="grid-column:1/-1;">'
    + '<label>Supporting Document (Certification Certificate, Test Report)</label>'
    + '<div class="upload-zone" style="cursor:pointer;" onclick="document.getElementById(\'ff-upload\').click()">'
    + '<span class="material-icons">cloud_upload</span>'
    + '<p>Click to Upload Document</p>'
    + '<span>PDF, JPG, PNG up to 5MB</span>'
    + '</div>'
    + '<input type="file" id="ff-upload" accept=".pdf,.jpg,.jpeg,.png" style="display:none;" onchange="App.smHandleFileUpload(this)"/>'
    + '<div id="ff-filename" style="margin-top:8px;font-size:0.85rem;color:#2E7D32;"></div>'
    + '</div>'
    + '</div></div>'

    /* Section 9: Remarks */
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">notes</span> Remarks</div>'
    + '<div class="form-group"><label>Remarks / Additional Notes</label>'
    + '<textarea id="ff-remarks" class="form-control" rows="3" placeholder="Any additional information about seed production, quality, or special conditions...">' + (v('remarks')) + '</textarea>'
    + '</div></div>'

    /* Actions */
    + '<div class="form-actions">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'soc-fc-list\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-outline" onclick="App.smFCSave(\'' + mode + '\',\'draft\')"><span class="material-icons">save</span> Save Draft</button>'
    + '<button class="btn btn-primary" onclick="App.smFCSave(\'' + mode + '\',\'final\')"><span class="material-icons">' + (isEdit ? 'update' : 'check_circle') + '</span> ' + (isEdit ? 'Update Record' : 'Submit Record') + '</button>'
    + '</div>'
    + '</div></div>'

    /* Auto-calculation script */
    + '<script>'
    + 'document.getElementById("ff-bagsize").addEventListener("input", function() { App.smCalculateTotalKg(); });'
    + 'document.getElementById("ff-numbags").addEventListener("input", function() { App.smCalculateTotalKg(); });'
    + '</script>';
};

// ══════════════════════════════════════════════
// 13. FOUNDATION & CERTIFIED — VIEW
// ══════════════════════════════════════════════
App.smRenderFCView = function () {
  var r = this.state.fcSeedStock.find(function (x) { return x.id === App.state.fcSelId; });
  if (!r) return '<div class="page-header"><h1>Record Not Found</h1></div>';
  var row = function (l, v) { return '<div class="invoice-row"><span class="label" style="color:#757575;font-size:.85rem;">' + l + '</span><span class="value" style="font-weight:500;">' + (v || '—') + '</span></div>'; };
  var catBadge = App._smBadge(r.category);

  return '<div class="page-header"><h1>Foundation and Certified Seed Details</h1><p>' + r.id + '</p></div>'
    + '<div class="card" style="max-width:1000px;">'
    + '<div class="card-header"><h3>' + r.variety + ' — ' + r.season + ' &nbsp;' + catBadge + '</h3>' + App._smBadge(r.qualityStatus || 'Passed') + '</div>'
    + '<div class="card-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">'

    /* Column 1: Seed Classification & Basic Info */
    + '<div>'
    + '<p style="font-size:.78rem;font-weight:700;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Seed Classification</p>'
    + row('Stock ID', '<b>' + r.id + '</b>')
    + row('Seed Class', r.seedClass || r.category)
    + row('Season', r.season)
    + row('Crop', r.crop || '—')
    + row('Variety', r.variety)
    + row('Variety Code', r.varietyCode || '—')
    + row('Seed Lot No.', r.seedLotNo || r.breederLotNo)
    + row('Production Year', r.productionYear || '—')
    + '</div>'

    /* Column 2: Production & Quality */
    + '<div>'
    + '<p style="font-size:.78rem;font-weight:700;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Production & Quality</p>'
    + row('Producer Name', r.producerName || '—')
    + row('Producer Reg. No.', r.producerRegNo || '—')
    + row('Production District', r.productionDistrict || '—')
    + row('Production Block', r.productionBlock || '—')
    + row('Production Area', (r.productionArea || 0) + ' Hectare')
    + row('Expected Qty', (r.expectedQty || 0) + ' Quintal')
    + row('Actual Qty', (r.actualQty || r.producedQty || 0) + ' Quintal')
    + row('Processing Qty', (r.processingQty || 0) + ' Quintal')
    + '</div>'

    /* Column 3: Certification & Stock */
    + '<div>'
    + '<p style="font-size:.78rem;font-weight:700;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Certification & Stock</p>'
    + row('Approved Qty', '<span style="color:#2E7D32;font-weight:700;">' + (r.approvedQty || 0) + ' Quintal</span>')
    + row('Rejected Qty', '<span style="color:#C62828;">' + (r.rejectedQty || 0) + ' Quintal</span>')
    + row('Available Qty', '<span style="color:#2E7D32;font-weight:700;">' + r.availableQty + ' Quintal</span>')
    + row('Cert. Agency', r.certAgency || r.certNumber || '—')
    + row('Cert. Number', r.certNumber || '—')
    + row('Cert. Date', r.certDate || r.processingDate || '—')
    + row('Quality Status', App._smBadge(r.qualityStatus || 'Passed'))
    + '</div>'

    + '</div>'

    /* Additional Details Section */
    + '<div class="card-body" style="border-top:1px solid #E0E0E0;padding-top:20px;">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">'

    /* Quality Parameters */
    + '<div>'
    + '<p style="font-size:.78rem;font-weight:700;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Quality Parameters</p>'
    + row('Germination %', (r.germination || '—') + (r.germination ? '%' : ''))
    + row('Physical Purity %', (r.physicalPurity || '—') + (r.physicalPurity ? '%' : ''))
    + row('Moisture %', (r.moisture || '—') + (r.moisture ? '%' : ''))
    + '</div>'

    /* Storage & Packaging */
    + '<div>'
    + '<p style="font-size:.78rem;font-weight:700;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Storage & Packaging</p>'
    + row('Storage Warehouse', r.storageWarehouse || '—')
    + row('Storage Location', r.storageLocation || '—')
    + row('Bag Size', (r.bagSize || r.packagingQty || '—') + ' Kg')
    + row('Number of Bags', r.numberOfBags || '—')
    + row('Total Quantity', (r.totalQuantityKg || 0) + ' Kg (' + ((r.totalQuantityKg || 0) / 100).toFixed(2) + ' Qt)')
    + '</div>'

    + '</div>'

    + (r.remarks ? '<div style="margin-top:16px;">' + row('Remarks', r.remarks) + '</div>' : '')
    + '</div>'

    + '<div class="card-header" style="border-top:1px solid #E0E0E0;border-bottom:none;justify-content:flex-end;">'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'soc-fc-list\')"><span class="material-icons">arrow_back</span> Back</button>'
    + '<button class="btn btn-warning" onclick="App.state.fcSelId=\'' + r.id + '\';App.navigate(\'soc-fc-edit\')"><span class="material-icons">edit</span> Edit</button>'
    + '<button class="btn btn-gray"><span class="material-icons">print</span> Print</button>'
    + '</div></div>'
    + '</div>';
};

// ══════════════════════════════════════════════
// 14. FOUNDATION & CERTIFIED — SAVE / DELETE
// ══════════════════════════════════════════════

// Helper: Auto-calculate Total Quantity in Kg
App.smCalculateTotalKg = function () {
  var bagSize = parseFloat(document.getElementById('ff-bagsize')?.value) || 0;
  var numBags = parseFloat(document.getElementById('ff-numbags')?.value) || 0;
  var totalKg = bagSize * numBags;
  var totalField = document.getElementById('ff-totalkg');
  if (totalField) {
    totalField.value = totalKg.toFixed(2) + ' Kg (' + (totalKg / 100).toFixed(2) + ' Quintal)';
  }
};

// Helper: Handle file upload
App.smHandleFileUpload = function (input) {
  if (input.files && input.files[0]) {
    var file = input.files[0];
    var fileSize = file.size / (1024 * 1024); // Convert to MB

    if (fileSize > 5) {
      alert('File size exceeds 5MB. Please upload a smaller file.');
      input.value = '';
      return;
    }

    var allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, JPG, or PNG only.');
      input.value = '';
      return;
    }

    var filenameDiv = document.getElementById('ff-filename');
    if (filenameDiv) {
      filenameDiv.innerHTML = '<span class="material-icons" style="font-size:16px;vertical-align:middle;">check_circle</span> File uploaded: <b>' + file.name + '</b> (' + fileSize.toFixed(2) + ' MB)';
    }
  }
};

App.smFCSave = function (mode, submitType) {
  var isEdit = mode === 'edit';
  var errIds = ['ff-seedclass', 'ff-season', 'ff-crop', 'ff-variety', 'ff-lotno', 'ff-prodyear', 'ff-producername', 'ff-producerreg', 'ff-proddistrict', 'ff-prodblock', 'ff-prodarea', 'ff-expectedqty', 'ff-actualqty', 'ff-approvedqty', 'ff-availqty', 'ff-certagency', 'ff-certno', 'ff-certdate', 'ff-germination', 'ff-purity', 'ff-moisture', 'ff-warehouse', 'ff-bagsize', 'ff-numbags'];
  App._smClearErr(errIds);

  // Get all field values
  var seedClass = App._smGet('ff-seedclass');
  var season = App._smGet('ff-season');
  var crop = App._smGet('ff-crop');
  var variety = App._smGet('ff-variety');
  var varietyCode = App._smGet('ff-varietycode');
  var seedLotNo = App._smGet('ff-lotno');
  var productionYear = App._smGet('ff-prodyear');
  var producerName = App._smGet('ff-producername');
  var producerRegNo = App._smGet('ff-producerreg');
  var productionDistrict = App._smGet('ff-proddistrict');
  var productionBlock = App._smGet('ff-prodblock');
  var productionArea = App._smGet('ff-prodarea');
  var expectedQty = App._smGet('ff-expectedqty');
  var actualQty = App._smGet('ff-actualqty');
  var processingQty = App._smGet('ff-processingqty');
  var approvedQty = App._smGet('ff-approvedqty');
  var rejectedQty = App._smGet('ff-rejectedqty');
  var availableQty = App._smGet('ff-availqty');
  var certAgency = App._smGet('ff-certagency');
  var certNumber = App._smGet('ff-certno');
  var certDate = App._smGet('ff-certdate');
  var germination = App._smGet('ff-germination');
  var physicalPurity = App._smGet('ff-purity');
  var moisture = App._smGet('ff-moisture');
  var storageWarehouse = App._smGet('ff-warehouse');
  var storageLocation = App._smGet('ff-storage');
  var bagSize = App._smGet('ff-bagsize');
  var numberOfBags = App._smGet('ff-numbags');
  var totalQuantityKg = App._smGet('ff-totalkg');
  var remarks = App._smGet('ff-remarks');

  // Validations
  if (!seedClass) { App._smErr('ff-seedclass', 'Seed class is required'); return; }
  if (!season) { App._smErr('ff-season', 'Season is required'); return; }
  if (!crop) { App._smErr('ff-crop', 'Crop is required'); return; }
  if (!variety) { App._smErr('ff-variety', 'Variety is required'); return; }
  if (!seedLotNo.trim()) { App._smErr('ff-lotno', 'Seed lot number is required'); return; }
  if (!productionYear || productionYear < 2000 || productionYear > 2100) { App._smErr('ff-prodyear', 'Valid production year is required'); return; }
  if (!producerName.trim()) { App._smErr('ff-producername', 'Producer name is required'); return; }
  if (!producerRegNo.trim()) { App._smErr('ff-producerreg', 'Producer registration no. is required'); return; }
  if (!productionDistrict) { App._smErr('ff-proddistrict', 'Production district is required'); return; }
  if (!productionBlock) { App._smErr('ff-prodblock', 'Production block is required'); return; }
  if (!productionArea || productionArea <= 0) { App._smErr('ff-prodarea', 'Production area must be > 0'); return; }
  if (!expectedQty || expectedQty <= 0) { App._smErr('ff-expectedqty', 'Expected quantity must be > 0'); return; }
  if (!actualQty || actualQty <= 0) { App._smErr('ff-actualqty', 'Actual quantity must be > 0'); return; }
  if (!approvedQty || approvedQty < 0) { App._smErr('ff-approvedqty', 'Approved quantity is required'); return; }
  if (!availableQty || availableQty < 0) { App._smErr('ff-availqty', 'Available quantity is required'); return; }
  if (!certAgency) { App._smErr('ff-certagency', 'Certification agency is required'); return; }
  if (!certNumber.trim()) { App._smErr('ff-certno', 'Certification number is required'); return; }
  if (!certDate) { App._smErr('ff-certdate', 'Certification date is required'); return; }
  if (!germination || germination < 0 || germination > 100) { App._smErr('ff-germination', 'Germination % must be 0-100'); return; }
  if (!physicalPurity || physicalPurity < 0 || physicalPurity > 100) { App._smErr('ff-purity', 'Physical purity % must be 0-100'); return; }
  if (!moisture || moisture < 0 || moisture > 100) { App._smErr('ff-moisture', 'Moisture % must be 0-100'); return; }
  if (!storageWarehouse) { App._smErr('ff-warehouse', 'Storage warehouse is required'); return; }
  if (!bagSize || bagSize <= 0) { App._smErr('ff-bagsize', 'Bag size must be > 0'); return; }
  if (!numberOfBags || numberOfBags <= 0) { App._smErr('ff-numbags', 'Number of bags must be > 0'); return; }

  var newRec = {
    id: isEdit ? App.state.fcSelId : 'FC-' + Date.now(),
    seedClass: seedClass,
    season: season,
    crop: crop,
    variety: variety,
    varietyCode: varietyCode,
    seedLotNo: seedLotNo,
    productionYear: productionYear,
    producerName: producerName,
    producerRegNo: producerRegNo,
    productionDistrict: productionDistrict,
    productionBlock: productionBlock,
    productionArea: parseFloat(productionArea),
    expectedQty: parseFloat(expectedQty),
    actualQty: parseFloat(actualQty),
    processingQty: parseFloat(processingQty || 0),
    approvedQty: parseFloat(approvedQty),
    rejectedQty: parseFloat(rejectedQty || 0),
    availableQty: parseFloat(availableQty),
    certAgency: certAgency,
    certNumber: certNumber,
    certDate: certDate,
    germination: parseFloat(germination),
    physicalPurity: parseFloat(physicalPurity),
    moisture: parseFloat(moisture),
    storageWarehouse: storageWarehouse,
    storageLocation: storageLocation,
    bagSize: parseFloat(bagSize),
    numberOfBags: parseInt(numberOfBags),
    totalQuantityKg: parseFloat(bagSize) * parseInt(numberOfBags),
    remarks: remarks,
    category: seedClass.includes('Foundation') ? 'Foundation' : (seedClass.includes('Certified') ? 'Certified' : seedClass),
    qualityStatus: 'Passed',
    breederLotNo: seedLotNo,
    producedQty: parseFloat(actualQty),
    processingDate: certDate,
    packagingQty: parseFloat(bagSize)
  };

  if (isEdit) {
    var idx = App.state.fcSeedStock.findIndex(function (r) { return r.id === App.state.fcSelId; });
    if (idx >= 0) App.state.fcSeedStock[idx] = newRec;
  } else {
    App.state.fcSeedStock.push(newRec);
  }

  alert((isEdit ? 'Record updated' : 'Record added') + ' successfully!');
  App.navigate('soc-fc-list');
};

App.smFCDelete = function (id) {
  if (!confirm('Delete seed stock record ' + id + '? This cannot be undone.')) return;
  App.state.fcSeedStock = App.state.fcSeedStock.filter(function (r) { return r.id !== id; });
  App._smToast('Record deleted.');
  App.render();
};
