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
      '</div>',

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
      ni('add_shopping_cart', 'Breeder Seed Demand', 'raise-demand'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Distribution</div>',
      ni('inventory_2', 'Available Stock', 'soc-available-stock'),
      ni('how_to_reg', 'Breeder Seeds Distribution to Member', 'soc-member-distribution'),
      '</div>',

      '<div class="nav-section"><div class="nav-section-title">Seed Stock</div>',
      ni('inventory_2', 'Foundation &amp; Certified Seed', 'soc-fc-list'),
      ni('add_circle', 'Foundation and Certified Seed Management', 'soc-fc-add', true),
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
    'soc-fc-add': 'Foundation and Certified Seed Management',
    'soc-fc-edit': 'Foundation and Certified Seed Management',
    'soc-fc-view': 'Seed Stock Details',
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

// Map a seed variety name to its code (used to auto-populate Variety Code on the FC form).
App._fcVarietyCode = function (variety) {
  if (!variety) return '';
  var map = {
    'GW-322': 'GW322', 'JS-335': 'JS335', 'JG-315': 'JG315', 'Pusa Bold': 'PBOLD', 'MTU-7029': 'MTU7029',
    'IR-36': 'IR36', 'DHM-117': 'DHM117', 'HHB-67': 'HHB67', 'CSH-16': 'CSH16', 'UPAS-120': 'UPAS120',
    'TAG-24': 'TAG24', 'KBSH-1': 'KBSH1', 'Suraj (H-777)': 'H777', 'CO-86032': 'CO86032', 'K-851': 'K851',
    'T-9': 'T9', 'L-4076': 'L4076', 'RD-2035': 'RD2035', 'OS-6': 'OS6'
  };
  // Fall back: strip non-alphanumerics and uppercase.
  return map[variety] || variety.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};

// Crop-wise variety names for the FC form (keeps the record's current variety selectable when editing).
App._fcVarietyNames = function (crop, current) {
  var names = App.varietiesForCrop(crop);
  if (current && names.indexOf(current) === -1) names.unshift(current);
  return names;
};

// Crop changed on the FC form → rebuild the Variety control for that crop (single select in edit, multi-select when adding).
App.onFCCropChange = function () {
  var crop = document.getElementById('ff-crop') ? document.getElementById('ff-crop').value : '';
  var el = document.getElementById('ff-variety');
  if (el && el.tagName === 'SELECT') {
    el.innerHTML = '<option value="">Select...</option>' + App._fcVarietyNames(crop, '').map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('');
    return;
  }
  App.msRender('ff-variety', App.varietiesForCrop(crop), !crop, 'Select Crop first', App._fcVarietiesChanged);
  App._msRefresh('ff-variety');
  App._fcVarietiesChanged([]);
};

// Multi-select changed: clear the "Variety is required" error. (Variety Code is set per variety on save.)
App._fcVarietiesChanged = function () {
  var err = document.getElementById('smerr-ff-variety');
  if (err) err.style.display = 'none';
};

// When the Variety select changes, auto-fill the Variety Code field.
App._fcVarietyChanged = function (variety) {
  var el = document.getElementById('ff-varietycode');
  if (el) el.value = App._fcVarietyCode(variety);
  var err = document.getElementById('smerr-ff-variety');
  if (err) err.style.display = 'none';
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
    + '<thead><tr><th>ID</th><th>Season</th><th>Variety</th>'
    + '<th>Society</th><th>Alloc Qty</th><th>Exp. Prod.</th><th>Alloc / Last Date</th>'
    + '<th>Status</th><th>Actions</th></tr></thead><tbody>';

  if (rows.length === 0) {
    html += '<tr><td colspan="9" style="text-align:center;padding:40px;color:#9E9E9E;">No records found.</td></tr>';
  } else {
    rows.forEach(function (r) {
      var act = (r.activeStatus || 'Active');
      html += '<tr>'
        + '<td><b>' + r.id + '</b></td>'
        + '<td>' + r.season + '</td>'
        + '<td><div style="font-weight:500;">' + r.variety + '</div>'
        + (r.parentVariety ? '<div style="font-size:.72rem;color:#9E9E9E;">Parent: ' + r.parentVariety + '</div>' : '') + '</td>'
        + '<td>' + r.society + '</td>'
        + '<td style="font-weight:600;color:#2E7D32;">' + r.allocQty + ' Qt</td>'
        + '<td>' + r.expectedProd + ' Qt</td>'
        + '<td style="font-size:.78rem;"><div>' + r.allocDate + '</div><div style="color:#9E9E9E;">to ' + r.lastDate + '</div></td>'
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

App.smHybridToggleActive = function (id) {
  var r = (App.state.hybridAllocs || []).find(function (x) { return x.id === id; });
  if (!r) return;
  r.activeStatus = (r.activeStatus || 'Active') === 'Active' ? 'Inactive' : 'Active';
  App._smToast('Allocation marked ' + r.activeStatus + '.');
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
        + '<button class="btn ' + ((r.activeStatus || 'Active') === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smFCToggleActive(\'' + r.id + '\')">' + ((r.activeStatus || 'Active') === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
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
      .replace('<select id="ff-crop" class="form-control">', '<select id="ff-crop" class="form-control" onchange="App.onFCCropChange()">')
    + ('<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>'
      + (isEdit
        // Editing one record: single, crop-wise Variety select.
        ? '<select id="ff-variety" class="form-control" onchange="App._fcVarietyChanged(this.value)">'
        + '<option value="">Select...</option>'
        + App._fcVarietyNames(v('crop'), v('variety')).map(function (o) { return '<option value="' + o + '"' + (v('variety') === o ? ' selected' : '') + '>' + o + '</option>'; }).join('')
        + '</select>'
        // Adding: one or more varieties (crop-wise multi-select); one record is created per variety.
        : App.msRender('ff-variety', App.varietiesForCrop(v('crop')), !v('crop'), 'Select Crop first', App._fcVarietiesChanged)
        + App.msHint('Select one or more varieties. One record is created per variety with the same details.'))
      + '<div id="smerr-ff-variety" style="display:none;color:#C62828;font-size:.78rem;margin-top:4px;"></div></div>')
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
    + App._smFld('Expected Production Quantity (Quintal)', 'ff-expectedqty', 'number', null, v('expectedQty'), true, 'Estimated yield')
    + App._smFld('Actual Production Quantity (Quintal)', 'ff-actualqty', 'number', null, v('actualQty'), true, 'Actual harvested quantity')
    + App._smFld('Processing Quantity (Quintal)', 'ff-processingqty', 'number', null, v('processingQty'), false, 'Quantity sent for processing')
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
    + '</div></div>';
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
  // Add: one or more varieties from the multi-select. Edit: the record's single variety.
  var varieties = isEdit ? [App._smGet('ff-variety')].filter(Boolean) : App.msValues('ff-variety');
  var variety = varieties[0] || '';
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
  if (!varieties.length) { App._smErr('ff-variety', 'Variety is required'); return; }
  if (!productionYear || productionYear < 2000 || productionYear > 2100) { App._smErr('ff-prodyear', 'Valid production year is required'); return; }
  if (!producerName.trim()) { App._smErr('ff-producername', 'Producer name is required'); return; }
  if (!producerRegNo.trim()) { App._smErr('ff-producerreg', 'Producer registration no. is required'); return; }
  if (!productionDistrict) { App._smErr('ff-proddistrict', 'Production district is required'); return; }
  if (!productionBlock) { App._smErr('ff-prodblock', 'Production block is required'); return; }
  if (!expectedQty || expectedQty <= 0) { App._smErr('ff-expectedqty', 'Expected quantity must be > 0'); return; }
  if (!actualQty || actualQty <= 0) { App._smErr('ff-actualqty', 'Actual quantity must be > 0'); return; }

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
    productionArea: parseFloat(productionArea) || 0,
    expectedQty: parseFloat(expectedQty),
    actualQty: parseFloat(actualQty),
    processingQty: parseFloat(processingQty || 0),
    approvedQty: parseFloat(approvedQty) || 0,
    rejectedQty: parseFloat(rejectedQty || 0),
    availableQty: parseFloat(availableQty) || parseFloat(actualQty) || 0,
    certAgency: certAgency,
    certNumber: certNumber,
    certDate: certDate,
    germination: parseFloat(germination) || 0,
    physicalPurity: parseFloat(physicalPurity) || 0,
    moisture: parseFloat(moisture) || 0,
    storageWarehouse: storageWarehouse,
    storageLocation: storageLocation,
    bagSize: parseFloat(bagSize) || 0,
    numberOfBags: parseInt(numberOfBags) || 0,
    totalQuantityKg: (parseFloat(bagSize) || 0) * (parseInt(numberOfBags) || 0),
    remarks: remarks,
    category: seedClass.includes('Foundation') ? 'Foundation' : (seedClass.includes('Certified') ? 'Certified' : seedClass),
    qualityStatus: 'Passed',
    breederLotNo: seedLotNo,
    producedQty: parseFloat(actualQty),
    processingDate: certDate,
    packagingQty: parseFloat(bagSize) || 0
  };

  // One record per selected variety; every other detail is shared. Variety Code is looked up per variety.
  var recs = varieties.map(function (vr, i) {
    var r = Object.assign({}, newRec);
    r.variety = vr;
    r.varietyCode = varietyCode || App._fcVarietyCode(vr);
    if (!isEdit) r.id = 'FC-' + Date.now() + (varieties.length > 1 ? '-' + (i + 1) : '');
    return r;
  });

  if (isEdit) {
    var idx = App.state.fcSeedStock.findIndex(function (r) { return r.id === App.state.fcSelId; });
    if (idx >= 0) App.state.fcSeedStock[idx] = recs[0];
  } else {
    recs.forEach(function (r) { App.state.fcSeedStock.push(r); });
  }

  App.msReset('ff-variety');
  alert((isEdit ? 'Record updated' : (recs.length > 1 ? recs.length + ' records added' : 'Record added')) + ' successfully!');
  App.navigate('soc-fc-list');
};

App.smFCDelete = function (id) {
  if (!confirm('Delete seed stock record ' + id + '? This cannot be undone.')) return;
  App.state.fcSeedStock = App.state.fcSeedStock.filter(function (r) { return r.id !== id; });
  App._smToast('Record deleted.');
  App.render();
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
    { id: 'LINE-002', lineType: 'Selling', seedType: 'Certified', finYear: '2024-2025', season: 'Rabi', crop: 'Wheat', variety: 'GW-322', startDate: '2024-10-01', endDate: '2024-11-30' },
    { id: 'LINE-003', lineType: 'Buying', seedType: 'Foundation', finYear: '2024-2025', season: 'Rabi', crop: 'Gram', variety: 'JG-315', startDate: '2024-10-15', endDate: '2024-12-15' },
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
  // Variety multi-select for the line form (crop-wise).
  App._lineVarietyMs = function (crop) {
    return App.msRender('sl-variety', App.varietiesForCrop(crop), !crop, 'Select Crop first');
  };
  // Crop changed → rebuild the variety list in place (any stale selection is dropped).
  App.onLineCropChange = function () {
    var crop = document.getElementById('sl-crop') ? document.getElementById('sl-crop').value : '';
    App._lineVarietyMs(crop);
    App._msRefresh('sl-variety');
  };

  // ── Open / close the form ──
  App.openSeedLineForm = function () { this.state.showSeedLineForm = true; this.render(); };
  App.closeSeedLineForm = function () { this.msReset('sl-variety'); this.state.showSeedLineForm = false; this.render(); };

  // ── Save a new line from the form ──
  App.saveSeedLine = function () {
    var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    var lineType = g('sl-type');
    var seedType = g('sl-seedtype');
    var finYear = g('sl-finyear') || this._lineFinYear();
    var season = g('sl-season');
    var crop = g('sl-crop');
    // One line can cover several varieties of the crop.
    var varieties = this.msValues('sl-variety');
    var variety = varieties.join(', ');
    var startDate = g('sl-start');
    var endDate = g('sl-end');
    if (!crop || !varieties.length) { this.showToast('Please select crop and at least one variety'); return; }
    if (!startDate || !endDate) { this.showToast('Please set line start and end dates'); return; }
    if (endDate < startDate) { this.showToast('End date cannot be before start date'); return; }
    var id = 'LINE-' + String(this.state.seedLines.length + 1).padStart(3, '0');
    this.state.seedLines.unshift({ id: id, lineType: lineType, seedType: seedType, finYear: finYear, season: season, crop: crop, variety: variety, varieties: varieties, startDate: startDate, endDate: endDate });
    this.msReset('sl-variety');
    this.state.showSeedLineForm = false;
    this.showToast('Seed ' + lineType.toLowerCase() + ' line ' + id + ' created.');
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
        + '<th>Type</th><th>Seed Type</th><th>Fin. Year</th><th>Season</th><th>Crop</th><th>Variety</th><th>Start Date</th><th>End Date</th><th>Status</th>'
        + '</tr></thead><tbody>' + rows + '</tbody></table></div>',
      '</div></div>'
    ].join('');
  };

  // ── Form ──
  App.renderSeedLineForm = function () {
    var fy = this._lineFinYear();
    var today = new Date().toISOString().split('T')[0];
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>New Trade Line</h1><p>Open a new seed buying or selling line</p></div>',
      '<button class="btn btn-gray" onclick="App.closeSeedLineForm()"><span class="material-icons">arrow_back</span> Back to List</button>',
      '</div>',
      '<div class="card" style="max-width:860px;"><div class="card-body">',
      '<div class="form-grid">',

      '<div class="form-group"><label>Line Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-type"><option value="Buying">Buying (Procure from societies)</option><option value="Selling">Selling (Supply to societies)</option></select></div>',

      '<div class="form-group"><label>Seed Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-seedtype"><option>Breeder</option><option>Foundation</option><option>Certified</option><option>Hybrid</option></select></div>',

      '<div class="form-group"><label>Financial Year</label>',
      '<input type="text" class="form-control" id="sl-finyear" value="' + fy + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>',

      '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-season"><option>Kharif</option><option>Rabi</option><option>Summer</option></select></div>',

      '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="sl-crop" onchange="App.onLineCropChange()"><option value="">Select Crop</option>' + App._lineCropOpts('') + '</select></div>',

      '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>',
      App._lineVarietyMs(''),
      App.msHint('Select one or more varieties for this line.'),
      '</div>',

      '<div class="form-group"><label>Line Start Date <span style="color:#F44336">*</span></label>',
      '<input type="date" class="form-control" id="sl-start" value="' + today + '"/></div>',

      '<div class="form-group"><label>Line End Date <span style="color:#F44336">*</span></label>',
      '<input type="date" class="form-control" id="sl-end"/></div>',

      '</div>',
      '<div style="display:flex;gap:12px;margin-top:20px;">',
      '<button class="btn btn-gray" onclick="App.closeSeedLineForm()">Cancel</button>',
      '<button class="btn btn-primary btn-lg" style="flex:1;" onclick="App.saveSeedLine()"><span class="material-icons">check_circle</span> Save Line</button>',
      '</div>',
      '</div></div>'
    ].join('');
  };

  // Always land on the list (not the form) when opening the page.
  var _navPrev = App.navigate.bind(App);
  App.navigate = function (page) {
    if (page === 'admin-seed-lines') this.state.showSeedLineForm = false;
    if (page === 'admin-packaging') this.state.showPackagingForm = false;
    return _navPrev(page);
  };
}());


// ════════════════════════════════════════════════════════════
// MODULE — PACKAGING SET (Admin)
// Defines the pack size (unit + quantity) used when packing seed, per
// Financial Year / Seed Type / Season / Crop / Variety. Picking several
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

  App.openPackagingForm = function () { this.state.showPackagingForm = true; this.render(); };
  App.closePackagingForm = function () { this.msReset('pk-variety'); this.state.showPackagingForm = false; this.render(); };

  // Variety multi-select for the form (crop-wise).
  App._pkVarietyMs = function (crop) {
    return App.msRender('pk-variety', App.varietiesForCrop(crop), !crop, 'Select Crop first');
  };
  // Crop changed → rebuild the variety list in place (any stale selection is dropped).
  App.onPackagingCropChange = function () {
    var crop = document.getElementById('pk-crop') ? document.getElementById('pk-crop').value : '';
    App._pkVarietyMs(crop);
    App._msRefresh('pk-variety');
  };

  // ── Save: one packaging record per selected variety ──
  App.savePackaging = function () {
    var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    var finYear = g('pk-finyear') || this._lineFinYear();
    var seedType = g('pk-seedtype');
    var season = g('pk-season');
    var crop = g('pk-crop');
    var varieties = this.msValues('pk-variety');
    var unit = g('pk-unit');
    var quantity = parseFloat(g('pk-qty'));
    if (!seedType || !season || !crop) { this.showToast('Please select seed type, season and crop'); return; }
    if (!varieties.length) { this.showToast('Please select at least one variety'); return; }
    if (!unit) { this.showToast('Please select a unit'); return; }
    if (!quantity || quantity <= 0) { this.showToast('Please enter a valid quantity'); return; }

    // Block exact duplicates (same year/type/season/crop/variety/unit/quantity). Check every variety first.
    var list = this.state.packagingSets;
    var dups = varieties.filter(function (variety) {
      return list.some(function (p) {
        return p.finYear === finYear && p.seedType === seedType && p.season === season && p.crop === crop
          && p.variety === variety && p.unit === unit && Number(p.quantity) === quantity;
      });
    });
    if (dups.length) {
      this.showToast('Packaging of ' + quantity + ' ' + unit + ' already exists for: ' + dups.join(', '));
      return;
    }

    var nextNo = Math.max(0, Math.max.apply(null, list.map(function (p) { return parseInt(String(p.id).replace(/\D/g, ''), 10) || 0; })));
    varieties.forEach(function (variety) {
      nextNo += 1;
      list.unshift({ id: 'PKG-' + String(nextNo).padStart(3, '0'), finYear: finYear, seedType: seedType, season: season, crop: crop, variety: variety, unit: unit, quantity: quantity });
    });
    this.msReset('pk-variety');
    this.state.showPackagingForm = false;
    this.showToast(varieties.length > 1 ? 'Packaging set added for ' + varieties.length + ' varieties.' : 'Packaging set added.');
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
        + '<th>Fin. Year</th><th>Seed Type</th><th>Season</th><th>Crop</th><th>Variety</th><th>Quantity</th><th>Unit</th>'
        + '</tr></thead><tbody>' + rows + '</tbody></table></div>',
      '</div></div>'
    ].join('');
  };

  // ── Form ──
  App.renderPackagingForm = function () {
    var fy = this._lineFinYear();
    var unitOpts = App._pkUnits().map(function (u) { return '<option>' + u + '</option>'; }).join('');
    return [
      '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
      '<div><h1>New Packaging</h1><p>Set the pack size for a seed type, crop and variety</p></div>',
      '<button class="btn btn-gray" onclick="App.closePackagingForm()"><span class="material-icons">arrow_back</span> Back to List</button>',
      '</div>',
      '<div class="card" style="max-width:860px;"><div class="card-body">',
      '<div class="form-grid">',

      '<div class="form-group"><label>Financial Year</label>',
      '<input type="text" class="form-control" id="pk-finyear" value="' + fy + '" readonly style="background:#f5f5f5;color:#2E7D32;font-weight:600;"/></div>',

      '<div class="form-group"><label>Seed Type <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-seedtype"><option value="">Select Seed Type</option><option>Breeder</option><option>Foundation</option><option>Certified</option><option>Hybrid</option></select></div>',

      '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-season"><option value="">Select Season</option><option>Kharif</option><option>Rabi</option><option>Summer</option></select></div>',

      '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-crop" onchange="App.onPackagingCropChange()"><option value="">Select Crop</option>' + App._lineCropOpts('') + '</select></div>',

      '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label>',
      App._pkVarietyMs(''),
      App.msHint('Select one or more varieties. Same unit and quantity apply to each.'),
      '</div>',

      '<div class="form-group"><label>Unit <span style="color:#F44336">*</span></label>',
      '<select class="form-control" id="pk-unit"><option value="">Select Unit</option>' + unitOpts + '</select></div>',

      '<div class="form-group"><label>Quantity <span style="color:#F44336">*</span></label>',
      '<input type="number" class="form-control" id="pk-qty" min="0.1" step="any" placeholder="e.g. 40"/>',
      '<div style="font-size:0.72rem;color:#757575;margin-top:4px;">Quantity of seed in one pack, in the selected unit.</div></div>',

      '</div>',
      '<div style="display:flex;gap:12px;margin-top:20px;">',
      '<button class="btn btn-gray" onclick="App.closePackagingForm()">Cancel</button>',
      '<button class="btn btn-primary btn-lg" style="flex:1;" onclick="App.savePackaging()"><span class="material-icons">check_circle</span> Save Packaging</button>',
      '</div>',
      '</div></div>'
    ].join('');
  };
}());
