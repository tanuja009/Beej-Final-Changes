/**
 * BEEJ SANGH — STOCK MANAGEMENT MODULE
 * Complete functional module with demo/mock data.
 * Season → Crop → Variety → Sub-Variety hierarchy.
 * Pages: Dashboard, Inventory, Inward, Outward, Adjustment, Ledger,
 *        Variety Master, Sub-Variety Master, Reports.
 */
'use strict';

// ═══════════════════════════════════════════════════════════
// 1. MASTER DATA (in-memory demo)
// ═══════════════════════════════════════════════════════════
if (!App.state.sm) {
  App.state.sm = {
    seasons: [
      { id: 'SEA-01', name: 'Kharif 2026', code: 'KH26', desc: 'Monsoon crop season', status: 'Active', created: '2026-01-01' },
      { id: 'SEA-02', name: 'Rabi 2025-26', code: 'RB2526', desc: 'Winter crop season', status: 'Active', created: '2025-10-01' },
      { id: 'SEA-03', name: 'Summer 2026', code: 'SM26', desc: 'Zaid crop season', status: 'Active', created: '2026-02-01' }
    ],
    crops: [
      { id: 'CRP-01', name: 'Paddy', code: 'PDY', seasons: ['Kharif 2026'], desc: 'Rice crop', status: 'Active', created: '2026-01-05' },
      { id: 'CRP-02', name: 'Wheat', code: 'WHT', seasons: ['Rabi 2025-26'], desc: 'Wheat crop', status: 'Active', created: '2026-01-05' },
      { id: 'CRP-03', name: 'Soybean', code: 'SYB', seasons: ['Kharif 2026'], desc: 'Oilseed crop', status: 'Active', created: '2026-01-05' },
      { id: 'CRP-04', name: 'Gram', code: 'GRM', seasons: ['Rabi 2025-26'], desc: 'Pulse crop', status: 'Active', created: '2026-01-05' },
      { id: 'CRP-05', name: 'Mustard', code: 'MST', seasons: ['Rabi 2025-26'], desc: 'Oilseed crop', status: 'Active', created: '2026-01-05' },
      { id: 'CRP-06', name: 'Maize', code: 'MZE', seasons: ['Kharif 2026', 'Summer 2026'], desc: 'Cereal crop', status: 'Active', created: '2026-01-05' }
    ],
    varieties: [
      { id: 'VAR-001', name: 'IR-64', code: 'IR64', crop: 'Paddy', season: 'Kharif 2026', desc: 'Medium-duration paddy', status: 'Active', created: '2026-01-10' },
      { id: 'VAR-002', name: 'MTU-7029', code: 'MTU7029', crop: 'Paddy', season: 'Kharif 2026', desc: 'Swarna variety', status: 'Active', created: '2026-01-12' },
      { id: 'VAR-003', name: 'GW-322', code: 'GW322', crop: 'Wheat', season: 'Rabi 2025-26', desc: 'High yield wheat', status: 'Active', created: '2026-01-15' },
      { id: 'VAR-004', name: 'HD-2967', code: 'HD2967', crop: 'Wheat', season: 'Rabi 2025-26', desc: 'Bread wheat', status: 'Active', created: '2026-01-16' },
      { id: 'VAR-005', name: 'JS-335', code: 'JS335', crop: 'Soybean', season: 'Kharif 2026', desc: 'Standard soybean', status: 'Active', created: '2026-01-18' },
      { id: 'VAR-006', name: 'JG-315', code: 'JG315', crop: 'Gram', season: 'Rabi 2025-26', desc: 'Desi gram', status: 'Active', created: '2026-01-20' },
      { id: 'VAR-007', name: 'Pusa Bold', code: 'PBOLD', crop: 'Mustard', season: 'Rabi 2025-26', desc: 'Popular mustard', status: 'Active', created: '2026-01-22' }
    ],
    subVarieties: [
      { id: 'SUB-001', name: 'IR-64 Premium', code: 'IR64-PR', variety: 'IR-64', crop: 'Paddy', season: 'Kharif 2026', desc: 'Premium grade', status: 'Active', created: '2026-02-01' },
      { id: 'SUB-002', name: 'IR-64 Standard', code: 'IR64-ST', variety: 'IR-64', crop: 'Paddy', season: 'Kharif 2026', desc: 'Standard grade', status: 'Active', created: '2026-02-02' },
      { id: 'SUB-003', name: 'GW-322 Bold', code: 'GW322-BD', variety: 'GW-322', crop: 'Wheat', season: 'Rabi 2025-26', desc: 'Bold grain', status: 'Active', created: '2026-02-05' },
      { id: 'SUB-004', name: 'JS-335 Improved', code: 'JS335-IM', variety: 'JS-335', crop: 'Soybean', season: 'Kharif 2026', desc: 'Improved yield', status: 'Active', created: '2026-02-08' }
    ],
    financialYears: [
      { id: 'FY-01', name: '2025-2026', code: 'FY2526', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Active', created: '2025-04-01' },
      { id: 'FY-02', name: '2026-2027', code: 'FY2627', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', created: '2026-04-01' },
      { id: 'FY-03', name: '2024-2025', code: 'FY2425', startDate: '2024-04-01', endDate: '2025-03-31', status: 'Inactive', created: '2024-04-01' }
    ],
    inventory: [
      { id: 'INV-001', season: 'Kharif 2026', crop: 'Paddy', variety: 'IR-64', subVariety: 'IR-64 Premium', lot: 'LOT-P-001', opening: 1000, inward: 500, outward: 200, adjustment: 0, unit: 'KG', updated: '2026-03-01' },
      { id: 'INV-002', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322', subVariety: 'GW-322 Bold', lot: 'LOT-W-001', opening: 800, inward: 300, outward: 350, adjustment: -20, unit: 'KG', updated: '2026-03-02' },
      { id: 'INV-003', season: 'Kharif 2026', crop: 'Soybean', variety: 'JS-335', subVariety: 'JS-335 Improved', lot: 'LOT-S-001', opening: 500, inward: 250, outward: 0, adjustment: 0, unit: 'KG', updated: '2026-03-03' },
      { id: 'INV-004', season: 'Rabi 2025-26', crop: 'Gram', variety: 'JG-315', subVariety: '', lot: 'LOT-G-001', opening: 400, inward: 0, outward: 150, adjustment: 10, unit: 'KG', updated: '2026-03-04' },
      { id: 'INV-005', season: 'Rabi 2025-26', crop: 'Mustard', variety: 'Pusa Bold', subVariety: '', lot: 'LOT-M-001', opening: 300, inward: 100, outward: 80, adjustment: 0, unit: 'KG', updated: '2026-03-05' }
    ],
    ledger: [
      { id: 'LG-001', date: '2026-03-01', type: 'Opening Stock', ref: 'OPEN-001', season: 'Kharif 2026', crop: 'Paddy', variety: 'IR-64', subVariety: 'IR-64 Premium', lot: 'LOT-P-001', opening: 0, inward: 1000, outward: 0, adj: 0, closing: 1000, remarks: 'Season opening' },
      { id: 'LG-002', date: '2026-03-05', type: 'Inward', ref: 'IN-001', season: 'Kharif 2026', crop: 'Paddy', variety: 'IR-64', subVariety: 'IR-64 Premium', lot: 'LOT-P-001', opening: 1000, inward: 500, outward: 0, adj: 0, closing: 1500, remarks: 'Received from supplier' },
      { id: 'LG-003', date: '2026-03-10', type: 'Outward', ref: 'OUT-001', season: 'Kharif 2026', crop: 'Paddy', variety: 'IR-64', subVariety: 'IR-64 Premium', lot: 'LOT-P-001', opening: 1500, inward: 0, outward: 200, adj: 0, closing: 1300, remarks: 'Dispatched to society' },
      { id: 'LG-004', date: '2026-03-02', type: 'Opening Stock', ref: 'OPEN-002', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322', subVariety: 'GW-322 Bold', lot: 'LOT-W-001', opening: 0, inward: 800, outward: 0, adj: 0, closing: 800, remarks: 'Season opening' },
      { id: 'LG-005', date: '2026-03-08', type: 'Inward', ref: 'IN-002', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322', subVariety: 'GW-322 Bold', lot: 'LOT-W-001', opening: 800, inward: 300, outward: 0, adj: 0, closing: 1100, remarks: 'Received' },
      { id: 'LG-006', date: '2026-03-12', type: 'Outward', ref: 'OUT-002', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322', subVariety: 'GW-322 Bold', lot: 'LOT-W-001', opening: 1100, inward: 0, outward: 350, adj: 0, closing: 750, remarks: 'Dispatched' },
      { id: 'LG-007', date: '2026-03-15', type: 'Adjustment Decrease', ref: 'ADJ-001', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322', subVariety: 'GW-322 Bold', lot: 'LOT-W-001', opening: 750, inward: 0, outward: 0, adj: -20, closing: 730, remarks: 'Damaged write-off' }
    ],
    // UI state
    filter: { season: '', crop: '', variety: '', subVariety: '', status: '', search: '', type: '' },
    editId: null,
    formMode: null // 'add' | 'edit'
  };
}

// ── Helpers ──
var SM = App.state.sm;
App._smAvail = function (r) { return (r.opening || 0) + (r.inward || 0) - (r.outward || 0) + (r.adjustment || 0); };
App._smBdg = function (s) {
  var m = { Active: 'badge-success', Inactive: 'badge-gray', 'In Stock': 'badge-success', 'Low Stock': 'badge-warning', 'Out of Stock': 'badge-danger' };
  return '<span class="badge ' + (m[s] || 'badge-gray') + '">' + s + '</span>';
};
App._smNextId = function (arr, pfx) {
  var n = arr.map(function (r) { return parseInt(String(r.id).replace(/\D/g, ''), 10); }).filter(function (x) { return !isNaN(x); });
  return pfx + String((n.length ? Math.max.apply(null, n) : 0) + 1).padStart(3, '0');
};
App._smCropsForSeason = function (season) {
  return SM.crops.filter(function (c) { return c.status === 'Active' && (!season || c.seasons.indexOf(season) >= 0); });
};
App._smVarietiesForCrop = function (crop, season) {
  return SM.varieties.filter(function (v) { return v.status === 'Active' && (!crop || v.crop === crop) && (!season || v.season === season); });
};
App._smSubVForVariety = function (variety) {
  return SM.subVarieties.filter(function (sv) { return sv.status === 'Active' && (!variety || sv.variety === variety); });
};
App._smSeasonOpts = function (sel) { return SM.seasons.filter(function (s) { return s.status === 'Active'; }).map(function (s) { return '<option value="' + s.name + '"' + (sel === s.name ? ' selected' : '') + '>' + s.name + '</option>'; }).join(''); };
App._smFinYearOpts = function (sel) { return SM.financialYears.filter(function (fy) { return fy.status === 'Active'; }).map(function (fy) { return '<option value="' + fy.name + '"' + (sel === fy.name ? ' selected' : '') + '>' + fy.name + '</option>'; }).join(''); };
App._smCropOpts = function (season, sel) { return App._smCropsForSeason(season).map(function (c) { return '<option value="' + c.name + '"' + (sel === c.name ? ' selected' : '') + '>' + c.name + '</option>'; }).join(''); };
App._smVarOpts = function (crop, season, sel) { return App._smVarietiesForCrop(crop, season).map(function (v) { return '<option value="' + v.name + '"' + (sel === v.name ? ' selected' : '') + '>' + v.name + '</option>'; }).join(''); };
App._smSubOpts = function (variety, sel) { return App._smSubVForVariety(variety).map(function (sv) { return '<option value="' + sv.name + '"' + (sel === sv.name ? ' selected' : '') + '>' + sv.name + '</option>'; }).join(''); };

// ═══════════════════════════════════════════════════════════
// 2. SIDEBAR — inject Stock Management section
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderAdminSidebar ? App.renderAdminSidebar.bind(App) : null;
  if (!_prev) return;
  App.renderAdminSidebar = function () {
    var html = _prev();
    var p = this.state.currentPage;
    var ni = function (icon, label, page, sub) {
      var c = 'nav-item' + (sub ? ' nav-sub-item' : '') + (p === page ? ' active' : '');
      return '<div class="' + c + '" onclick="App.navigate(\'' + page + '\')"><span class="material-icons">' + icon + '</span><span>' + label + '</span></div>';
    };
    var section = '<div class="nav-section"><div class="nav-section-title">Stock Management</div>'
      + ni('dashboard', 'Stock Dashboard', 'sm-dashboard')
      + ni('event', 'Season Master', 'sm-season', true)
      + ni('grass', 'Crop Master', 'sm-crop', true)
      + ni('date_range', 'Financial Year', 'sm-finyear', true)
      + ni('category', 'Variety Master', 'sm-variety', true)
      + '</div>';
    if (/nav-section-title">Management</.test(html)) {
      return html.replace(/(<div class="nav-section"><div class="nav-section-title">Management<\/div>)/, section + '\n$1');
    }
    return html.replace(/(<div class="sidebar-footer)/, section + '\n$1');
  };
})();

// ═══════════════════════════════════════════════════════════
// 3. ROUTER
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderPage.bind(App);
  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'sm-dashboard': return App.smDashboard();
      case 'sm-inventory': return App.smInventory();
      case 'sm-inventory-form': return App.smInventoryForm();
      case 'sm-inward': return App.smInward();
      case 'sm-outward': return App.smOutward();
      case 'sm-adjust': return App.smAdjust();
      case 'sm-ledger': return App.smLedger();
      case 'sm-variety': return App.smVarietyList();
      case 'sm-variety-form': return App.smVarietyForm();
      case 'sm-subvariety': return App.smSubVarietyList();
      case 'sm-subvariety-form': return App.smSubVarietyForm();
      case 'sm-season': return App.smSeasonList();
      case 'sm-season-form': return App.smSeasonForm();
      case 'sm-crop': return App.smCropList();
      case 'sm-crop-form': return App.smCropForm();
      case 'sm-finyear': return App.smFinYearList();
      case 'sm-finyear-form': return App.smFinYearForm();
      case 'sm-reports': return App.smReports();
      default: return _prev();
    }
  };
})();

// ═══════════════════════════════════════════════════════════
// 4. HEADER TITLES
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderHeader.bind(App);
  var T = {
    'sm-dashboard': 'Stock Dashboard', 'sm-inventory': 'Stock Inventory',
    'sm-inventory-form': 'Add Inventory / Stock',
    'sm-inward': 'Stock Inward', 'sm-outward': 'Stock Outward',
    'sm-adjust': 'Stock Adjustment', 'sm-ledger': 'Stock Ledger',
    'sm-variety': 'Variety Master', 'sm-variety-form': 'Variety Master',
    'sm-subvariety': 'Sub-Variety Master', 'sm-subvariety-form': 'Sub-Variety Master',
    'sm-season': 'Season Master', 'sm-season-form': 'Season Master',
    'sm-crop': 'Crop Master', 'sm-crop-form': 'Crop Master',
    'sm-finyear': 'Financial Year Master', 'sm-finyear-form': 'Financial Year Master',
    'sm-reports': 'Stock Reports'
  };
  App.renderHeader = function () {
    var html = _prev();
    var t = T[this.state.currentPage];
    if (!t) return html;
    return html.replace(/<span class="header-title">.*?<\/span>/, '<span class="header-title">' + t + '</span>');
  };
})();

// ═══════════════════════════════════════════════════════════
// 5. STOCK DASHBOARD
// ═══════════════════════════════════════════════════════════
App.smDashboard = function () {
  var inv = SM.inventory;
  var total = 0, avail = 0, allocated = 0, dispatched = 0, returned = 0, damaged = 0;
  inv.forEach(function (r) {
    var a = App._smAvail(r);
    total += r.opening + r.inward;
    avail += a;
    dispatched += r.outward;
  });
  return '<div class="page-header"><h1>Stock Dashboard</h1><p>Monitor stock summary and movements</p></div>'
    + '<div class="stats-grid">'
    + '<div class="stat-card"><div class="stat-icon"><span class="material-icons">warehouse</span></div><div class="stat-info"><div class="value">' + total.toLocaleString() + ' KG</div><div class="label">Total Stock</div></div></div>'
    + '<div class="stat-card"><div class="stat-icon"><span class="material-icons">inventory</span></div><div class="stat-info"><div class="value">' + avail.toLocaleString() + ' KG</div><div class="label">Available Stock</div></div></div>'
    + '<div class="stat-card blue"><div class="stat-icon"><span class="material-icons">lock</span></div><div class="stat-info"><div class="value">' + allocated + ' KG</div><div class="label">Allocated Stock</div></div></div>'
    + '<div class="stat-card teal"><div class="stat-icon"><span class="material-icons">local_shipping</span></div><div class="stat-info"><div class="value">' + dispatched.toLocaleString() + ' KG</div><div class="label">Dispatched Stock</div></div></div>'
    + '<div class="stat-card orange"><div class="stat-icon"><span class="material-icons">undo</span></div><div class="stat-info"><div class="value">' + returned + ' KG</div><div class="label">Returned Stock</div></div></div>'
    + '<div class="stat-card red"><div class="stat-icon"><span class="material-icons">broken_image</span></div><div class="stat-info"><div class="value">' + damaged + ' KG</div><div class="label">Damaged Stock</div></div></div>'
    + '</div>'
    + '<div class="card" style="margin-top:20px;"><div class="card-header"><h3>Stock Summary</h3></div>'
    + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Season</th><th>Crop</th><th>Variety</th><th>Sub-Variety</th><th>Opening</th><th>Inward</th><th>Outward</th><th>Available</th></tr></thead><tbody>'
    + inv.map(function (r) {
      var a = App._smAvail(r);
      return '<tr><td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td><td>' + (r.subVariety || '—') + '</td>'
        + '<td>' + r.opening + '</td><td style="color:#2E7D32;">' + r.inward + '</td><td style="color:#C62828;">' + r.outward + '</td>'
        + '<td style="font-weight:700;color:' + (a > 0 ? '#2E7D32' : '#C62828') + ';">' + a + ' ' + r.unit + '</td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};

// ═══════════════════════════════════════════════════════════
// 6. STOCK INVENTORY
// ═══════════════════════════════════════════════════════════
App.smInventory = function () {
  var inv = SM.inventory;
  return '<div class="page-header"><h1>Stock Inventory</h1><p>Complete inventory listing</p></div>'
    + '<div class="card"><div class="card-header"><h3>Inventory (' + inv.length + ' items)</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.state.sm.filter={season:\'\',crop:\'\',variety:\'\',subVariety:\'\',status:\'\',search:\'\',type:\'\'};App.navigate(\'sm-inventory-form\')"><span class="material-icons">add</span> Add Inventory / Stock</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Season</th><th>Crop</th><th>Variety</th><th>Sub-Variety</th><th>Lot/Batch</th><th>Available</th><th>Unit</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead><tbody>'
    + (inv.length === 0 ? '<tr><td colspan="11" style="text-align:center;padding:30px;color:#9E9E9E;">No inventory records. Click "Add Inventory / Stock" to create one.</td></tr>' : inv.map(function (r, i) {
      var a = App._smAvail(r);
      var st = a <= 0 ? 'Out of Stock' : a < 100 ? 'Low Stock' : 'In Stock';
      return '<tr><td>' + (i + 1) + '</td><td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td><td>' + (r.subVariety || '—') + '</td>'
        + '<td>' + r.lot + '</td>'
        + '<td style="font-weight:700;color:' + (a > 0 ? '#2E7D32' : '#C62828') + ';">' + a + '</td><td>' + r.unit + '</td>'
        + '<td>' + App._smBdg(st) + '</td><td style="font-size:0.78rem;">' + r.updated + '</td>'
        + '<td><button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-inventory-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button></td></tr>';
    }).join(''))
    + '</tbody></table></div></div></div>';
};

// ── Add / Edit Inventory (stock for a crop) ──
App.smInventoryForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.inventory.find(function (x) { return x.id === SM.editId; }) : null;
  var f = SM.filter;
  var season = r ? r.season : f.season;
  var crop = r ? r.crop : f.crop;
  var variety = r ? r.variety : f.variety;
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Add') + ' Inventory / Stock</h1><p>Add stock for a crop into inventory</p></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">inventory_2</span> Stock Classification</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Financial Year <span style="color:#F44336">*</span></label><select class="form-control" id="if-finyear"><option value="">Select Financial Year</option>' + App._smFinYearOpts(r ? r.finYear : '') + '</select></div>'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" id="if-season" onchange="App.state.sm.filter.season=this.value;App.state.sm.filter.crop=\'\';App.state.sm.filter.variety=\'\';App.render()"><option value="">Select Season</option>' + App._smSeasonOpts(season) + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="if-crop" onchange="App.state.sm.filter.crop=this.value;App.state.sm.filter.variety=\'\';App.render()"><option value="">Select Crop</option>' + App._smCropOpts(season, crop) + '</select></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" id="if-variety" onchange="App.state.sm.filter.variety=this.value;App.render()"><option value="">Select Variety</option>' + App._smVarOpts(crop, season, variety) + '</select></div>'
    + '</div></div>'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">scale</span> Lot &amp; Quantity</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Lot/Batch No. <span style="color:#F44336">*</span></label><input class="form-control" id="if-lot" value="' + (r ? r.lot : '') + '" placeholder="e.g. LOT-P-002"></div>'
    + '<div class="form-group"><label>Opening Quantity <span style="color:#F44336">*</span></label><input type="number" class="form-control" id="if-opening" value="' + (r ? r.opening : '') + '" placeholder="Opening stock"></div>'
    + '<div class="form-group"><label>Unit <span style="color:#F44336">*</span></label><select class="form-control" id="if-unit"><option' + (r && r.unit === 'KG' ? ' selected' : '') + '>KG</option><option' + (r && r.unit === 'Quintal' ? ' selected' : '') + '>Quintal</option><option' + (r && r.unit === 'Bag (40Kg)' ? ' selected' : '') + '>Bag (40Kg)</option></select></div>'
    + '<div class="form-group"><label>Inward Quantity</label><input type="number" class="form-control" id="if-inward" value="' + (r ? r.inward : '0') + '" placeholder="0"></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-inventory\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveInventory()"><span class="material-icons">save</span> Save Inventory</button></div>'
    + '</div></div>';
};

App.smSaveInventory = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? String(e.value).trim() : ''; };
  var finYear = g('if-finyear'), season = g('if-season'), crop = g('if-crop'), variety = g('if-variety'), lot = g('if-lot');
  var opening = parseFloat(g('if-opening'));
  if (!finYear || !season || !crop || !variety || !lot || isNaN(opening) || opening < 0) {
    alert('Please fill Financial Year, Season, Crop, Variety, Lot/Batch and a valid Opening Quantity.'); return;
  }
  var unit = g('if-unit') || 'KG', inward = parseFloat(g('if-inward')) || 0;
  var existingRec = SM.formMode === 'edit' ? SM.inventory.find(function (x) { return x.id === SM.editId; }) : null;
  var subVar = existingRec ? (existingRec.subVariety || '') : '';
  // Prevent duplicate lot for the same crop+variety (except the row being edited)
  var dup = SM.inventory.some(function (x) {
    return x.id !== SM.editId && x.lot === lot && x.crop === crop && x.variety === variety;
  });
  if (dup) { alert('Inventory for Lot "' + lot + '" under ' + crop + ' / ' + variety + ' already exists.'); return; }
  var today = new Date().toISOString().split('T')[0];
  if (SM.formMode === 'edit') {
    var r = SM.inventory.find(function (x) { return x.id === SM.editId; });
    if (r) { r.finYear = finYear; r.season = season; r.crop = crop; r.variety = variety; r.subVariety = subVar; r.lot = lot; r.opening = opening; r.inward = inward; r.unit = unit; r.updated = today; }
    App.showToast('Inventory updated successfully.');
  } else {
    var rec = { id: App._smNextId(SM.inventory, 'INV-'), finYear: finYear, season: season, crop: crop, variety: variety, subVariety: subVar, lot: lot, opening: opening, inward: inward, outward: 0, adjustment: 0, unit: unit, updated: today };
    SM.inventory.push(rec);
    // Opening ledger entry so the ledger stays consistent
    SM.ledger.push({ id: App._smNextId(SM.ledger, 'LG-'), date: today, type: 'Opening Stock', ref: App._smNextId(SM.ledger, 'OPEN-'), season: season, crop: crop, variety: variety, subVariety: subVar, lot: lot, opening: 0, inward: opening + inward, outward: 0, adj: 0, closing: opening + inward, remarks: 'Inventory added' });
    App.showToast('Inventory / stock added successfully.');
  }
  App.navigate('sm-inventory');
};

// ═══════════════════════════════════════════════════════════
// 7. STOCK INWARD
// ═══════════════════════════════════════════════════════════
App.smInward = function () {
  var f = SM.filter;
  return '<div class="page-header"><h1>Stock Inward</h1><p>Add new stock inward entry</p></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">login</span> Inward Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" id="si-season" onchange="App.state.sm.filter.season=this.value;App.render()"><option value="">Select Season</option>' + App._smSeasonOpts(f.season) + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="si-crop" onchange="App.state.sm.filter.crop=this.value;App.render()"><option value="">Select Crop</option>' + App._smCropOpts(f.season, f.crop) + '</select></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" id="si-variety" onchange="App.state.sm.filter.variety=this.value;App.render()"><option value="">Select Variety</option>' + App._smVarOpts(f.crop, f.season, f.variety) + '</select></div>'
    + '<div class="form-group"><label>Sub-Variety</label><select class="form-control" id="si-subvar"><option value="">Select Sub-Variety</option>' + App._smSubOpts(f.variety, '') + '</select></div>'
    + '<div class="form-group"><label>Lot/Batch No. <span style="color:#F44336">*</span></label><input class="form-control" id="si-lot" placeholder="e.g. LOT-P-002"></div>'
    + '<div class="form-group"><label>Inward Date <span style="color:#F44336">*</span></label><input type="date" class="form-control" id="si-date" value="' + new Date().toISOString().split('T')[0] + '"></div>'
    + '<div class="form-group"><label>Quantity <span style="color:#F44336">*</span></label><input type="number" class="form-control" id="si-qty" placeholder="Enter quantity"></div>'
    + '<div class="form-group"><label>Unit</label><select class="form-control" id="si-unit"><option>KG</option><option>Quintal</option><option>Bag (40Kg)</option></select></div>'
    + '<div class="form-group"><label>Source/Supplier</label><input class="form-control" id="si-source" placeholder="Supplier name"></div>'
    + '<div class="form-group"><label>Reference No.</label><input class="form-control" id="si-ref" placeholder="e.g. GRN-001"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Remarks</label><textarea class="form-control" id="si-remarks" rows="2" placeholder="Optional remarks"></textarea></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-inventory\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveInward()"><span class="material-icons">save</span> Save Inward</button></div>'
    + '</div></div>';
};
App.smSaveInward = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var season = g('si-season'), crop = g('si-crop'), variety = g('si-variety'), lot = g('si-lot'), qty = parseFloat(g('si-qty'));
  if (!season || !crop || !variety || !lot || !qty || qty <= 0) { alert('Please fill all required fields with valid data.'); return; }
  var subVar = g('si-subvar'), unit = g('si-unit'), source = g('si-source'), ref = g('si-ref') || App._smNextId(SM.ledger, 'IN-'), remarks = g('si-remarks');
  // Find or create inventory row
  var inv = SM.inventory.find(function (r) { return r.lot === lot && r.crop === crop && r.variety === variety; });
  if (inv) {
    inv.inward += qty; inv.updated = new Date().toISOString().split('T')[0];
  } else {
    SM.inventory.push({ id: App._smNextId(SM.inventory, 'INV-'), season: season, crop: crop, variety: variety, subVariety: subVar, lot: lot, opening: 0, inward: qty, outward: 0, adjustment: 0, unit: unit, updated: new Date().toISOString().split('T')[0] });
    inv = SM.inventory[SM.inventory.length - 1];
  }
  var closing = App._smAvail(inv);
  SM.ledger.push({ id: App._smNextId(SM.ledger, 'LG-'), date: g('si-date') || new Date().toISOString().split('T')[0], type: 'Inward', ref: ref, season: season, crop: crop, variety: variety, subVariety: subVar, lot: lot, opening: closing - qty, inward: qty, outward: 0, adj: 0, closing: closing, remarks: remarks || 'Stock inward — ' + source });
  App.showToast('Stock inward recorded successfully.');
  App.navigate('sm-inventory');
};

// ═══════════════════════════════════════════════════════════
// 8. STOCK OUTWARD
// ═══════════════════════════════════════════════════════════
App.smOutward = function () {
  var f = SM.filter;
  return '<div class="page-header"><h1>Stock Outward</h1><p>Record stock dispatched / outward</p></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">logout</span> Outward Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" id="so-season" onchange="App.state.sm.filter.season=this.value;App.render()"><option value="">Select</option>' + App._smSeasonOpts(f.season) + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="so-crop" onchange="App.state.sm.filter.crop=this.value;App.render()"><option value="">Select</option>' + App._smCropOpts(f.season, f.crop) + '</select></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" id="so-variety" onchange="App.state.sm.filter.variety=this.value;App.render()"><option value="">Select</option>' + App._smVarOpts(f.crop, f.season, f.variety) + '</select></div>'
    + '<div class="form-group"><label>Sub-Variety</label><select class="form-control" id="so-subvar"><option value="">Select</option>' + App._smSubOpts(f.variety, '') + '</select></div>'
    + '<div class="form-group"><label>Lot/Batch No. <span style="color:#F44336">*</span></label><input class="form-control" id="so-lot" placeholder="LOT-P-001"></div>'
    + '<div class="form-group"><label>Outward Date <span style="color:#F44336">*</span></label><input type="date" class="form-control" id="so-date" value="' + new Date().toISOString().split('T')[0] + '"></div>'
    + '<div class="form-group"><label>Quantity <span style="color:#F44336">*</span></label><input type="number" class="form-control" id="so-qty" placeholder="Quantity"></div>'
    + '<div class="form-group"><label>Destination</label><input class="form-control" id="so-dest" placeholder="Society / warehouse"></div>'
    + '<div class="form-group"><label>Reference No.</label><input class="form-control" id="so-ref" placeholder="DO-001"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Remarks</label><textarea class="form-control" id="so-remarks" rows="2"></textarea></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-inventory\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveOutward()"><span class="material-icons">save</span> Save Outward</button></div>'
    + '</div></div>';
};
App.smSaveOutward = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var crop = g('so-crop'), variety = g('so-variety'), lot = g('so-lot'), qty = parseFloat(g('so-qty'));
  if (!crop || !variety || !lot || !qty || qty <= 0) { alert('Please fill all required fields.'); return; }
  var inv = SM.inventory.find(function (r) { return r.lot === lot && r.crop === crop && r.variety === variety; });
  if (!inv) { alert('No matching inventory found for this Lot/Crop/Variety.'); return; }
  var avail = App._smAvail(inv);
  if (qty > avail) { alert('Insufficient stock. Available quantity is ' + avail + ' ' + inv.unit + '.'); return; }
  inv.outward += qty; inv.updated = new Date().toISOString().split('T')[0];
  var closing = App._smAvail(inv);
  SM.ledger.push({ id: App._smNextId(SM.ledger, 'LG-'), date: g('so-date') || new Date().toISOString().split('T')[0], type: 'Outward', ref: g('so-ref') || App._smNextId(SM.ledger, 'OUT-'), season: g('so-season'), crop: crop, variety: variety, subVariety: g('so-subvar'), lot: lot, opening: closing + qty, inward: 0, outward: qty, adj: 0, closing: closing, remarks: g('so-remarks') || 'Dispatched to ' + g('so-dest') });
  App.showToast('Stock outward recorded successfully.');
  App.navigate('sm-inventory');
};

// ═══════════════════════════════════════════════════════════
// 9. STOCK ADJUSTMENT
// ═══════════════════════════════════════════════════════════
App.smAdjust = function () {
  var f = SM.filter;
  return '<div class="page-header"><h1>Stock Adjustment</h1><p>Correct stock differences</p></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">tune</span> Adjustment Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season</label><select class="form-control" id="sa-season" onchange="App.state.sm.filter.season=this.value;App.render()"><option value="">Select</option>' + App._smSeasonOpts(f.season) + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="sa-crop" onchange="App.state.sm.filter.crop=this.value;App.render()"><option value="">Select</option>' + App._smCropOpts(f.season, f.crop) + '</select></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" id="sa-variety" onchange="App.state.sm.filter.variety=this.value;App.render()"><option value="">Select</option>' + App._smVarOpts(f.crop, f.season, f.variety) + '</select></div>'
    + '<div class="form-group"><label>Lot/Batch <span style="color:#F44336">*</span></label><input class="form-control" id="sa-lot" placeholder="LOT-P-001"></div>'
    + '<div class="form-group"><label>Adjustment Type <span style="color:#F44336">*</span></label><select class="form-control" id="sa-type"><option value="">Select</option><option value="increase">Increase</option><option value="decrease">Decrease</option></select></div>'
    + '<div class="form-group"><label>Quantity <span style="color:#F44336">*</span></label><input type="number" class="form-control" id="sa-qty" placeholder="Quantity"></div>'
    + '<div class="form-group"><label>Reason <span style="color:#F44336">*</span></label><input class="form-control" id="sa-reason" placeholder="Reason for adjustment"></div>'
    + '<div class="form-group"><label>Adjustment Date</label><input type="date" class="form-control" id="sa-date" value="' + new Date().toISOString().split('T')[0] + '"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Remarks</label><textarea class="form-control" id="sa-remarks" rows="2"></textarea></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-inventory\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-warning" onclick="App.smSaveAdjust()"><span class="material-icons">save</span> Save Adjustment</button></div>'
    + '</div></div>';
};
App.smSaveAdjust = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var crop = g('sa-crop'), variety = g('sa-variety'), lot = g('sa-lot'), qty = parseFloat(g('sa-qty')), type = g('sa-type'), reason = g('sa-reason');
  if (!crop || !variety || !lot || !qty || !type || !reason) { alert('Please fill all required fields.'); return; }
  var inv = SM.inventory.find(function (r) { return r.lot === lot && r.crop === crop && r.variety === variety; });
  if (!inv) { alert('No matching inventory found.'); return; }
  var delta = type === 'increase' ? qty : -qty;
  if (type === 'decrease' && App._smAvail(inv) < qty) { alert('Insufficient stock for decrease. Available: ' + App._smAvail(inv) + ' ' + inv.unit); return; }
  if (!confirm('Confirm stock adjustment: ' + type + ' ' + qty + ' ' + inv.unit + '?\nReason: ' + reason)) return;
  inv.adjustment += delta; inv.updated = new Date().toISOString().split('T')[0];
  var closing = App._smAvail(inv);
  SM.ledger.push({ id: App._smNextId(SM.ledger, 'LG-'), date: g('sa-date') || new Date().toISOString().split('T')[0], type: type === 'increase' ? 'Adjustment Increase' : 'Adjustment Decrease', ref: App._smNextId(SM.ledger, 'ADJ-'), season: g('sa-season'), crop: crop, variety: variety, subVariety: '', lot: lot, opening: closing - delta, inward: 0, outward: 0, adj: delta, closing: closing, remarks: reason + (g('sa-remarks') ? ' — ' + g('sa-remarks') : '') });
  App.showToast('Stock adjustment saved successfully.');
  App.navigate('sm-inventory');
};

// ═══════════════════════════════════════════════════════════
// 10. STOCK LEDGER
// ═══════════════════════════════════════════════════════════
App.smLedger = function () {
  var rows = SM.ledger;
  return '<div class="page-header"><h1>Stock Ledger</h1><p>Complete transaction history</p></div>'
    + '<div class="card"><div class="card-header"><h3>Ledger Entries (' + rows.length + ')</h3>'
    + '<div style="display:flex;gap:8px;"><button class="btn btn-success btn-sm" onclick="App.showToast(\'Excel exported\')"><span class="material-icons">table_chart</span> Excel</button>'
    + '<button class="btn btn-danger btn-sm" onclick="App.showToast(\'PDF exported\')"><span class="material-icons">picture_as_pdf</span> PDF</button></div>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Date</th><th>Type</th><th>Ref</th><th>Season</th><th>Crop</th><th>Variety</th><th>Sub-Variety</th><th>Lot</th><th>Opening</th><th>Inward</th><th>Outward</th><th>Adj</th><th>Closing</th><th>Remarks</th></tr></thead><tbody>'
    + rows.map(function (r) {
      return '<tr><td style="font-size:0.78rem;">' + r.date + '</td><td>' + App._smBdg(r.type === 'Inward' ? 'Active' : r.type === 'Outward' ? 'Out of Stock' : 'Low Stock').replace(/>.*?</, '>' + r.type + '<') + '</td>'
        + '<td>' + r.ref + '</td><td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td><td>' + (r.subVariety || '—') + '</td><td>' + r.lot + '</td>'
        + '<td>' + r.opening + '</td><td style="color:#2E7D32;">' + (r.inward || '') + '</td><td style="color:#C62828;">' + (r.outward || '') + '</td>'
        + '<td style="color:' + ((r.adj || 0) < 0 ? '#C62828' : '#2E7D32') + ';">' + (r.adj || '') + '</td>'
        + '<td style="font-weight:700;">' + r.closing + '</td><td style="font-size:0.78rem;max-width:150px;">' + (r.remarks || '') + '</td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};

// ═══════════════════════════════════════════════════════════
// 11. VARIETY MASTER — List + Form + Save
// ═══════════════════════════════════════════════════════════
App.smVarietyList = function () {
  var rows = SM.varieties;
  return '<div class="page-header"><h1>Variety Master</h1><p>Manage seed varieties</p></div>'
    + '<div class="card"><div class="card-header"><h3>Varieties (' + rows.length + ')</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.navigate(\'sm-variety-form\')"><span class="material-icons">add</span> Create Variety</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Variety Name</th><th>Code</th><th>Crop</th><th>Season</th><th>Description</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>'
    + rows.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td><b>' + r.name + '</b></td><td>' + r.code + '</td><td>' + r.crop + '</td><td>' + r.season + '</td><td style="font-size:0.78rem;max-width:150px;">' + (r.desc || '') + '</td>'
        + '<td>' + App._smBdg(r.status) + '</td><td style="font-size:0.78rem;">' + r.created + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-variety-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (r.status === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smToggleVariety(\'' + r.id + '\')">' + (r.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};
App.smToggleVariety = function (id) {
  var r = SM.varieties.find(function (v) { return v.id === id; });
  if (r) { r.status = r.status === 'Active' ? 'Inactive' : 'Active'; App.showToast('Variety status updated.'); App.render(); }
};
App.smVarietyForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.varieties.find(function (v) { return v.id === SM.editId; }) : null;
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Create') + ' Variety</h1></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">category</span> Variety Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" id="vf-season"><option value="">Select</option>' + App._smSeasonOpts(r ? r.season : '') + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="vf-crop"><option value="">Select</option>' + App._smCropOpts('', r ? r.crop : '') + '</select></div>'
    + '<div class="form-group"><label>Variety Name <span style="color:#F44336">*</span></label><input class="form-control" id="vf-name" value="' + (r ? r.name : '') + '" placeholder="e.g. IR-64"></div>'
    + '<div class="form-group"><label>Variety Code <span style="color:#F44336">*</span></label><input class="form-control" id="vf-code" value="' + (r ? r.code : '') + '" placeholder="e.g. IR64" style="text-transform:uppercase;"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Description</label><textarea class="form-control" id="vf-desc" rows="2">' + (r ? r.desc : '') + '</textarea></div>'
    + '<div class="form-group"><label>Status</label><select class="form-control" id="vf-status"><option value="Active"' + (r && r.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (r && r.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-variety\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveVariety()"><span class="material-icons">save</span> Save</button></div>'
    + '</div></div>';
};
App.smSaveVariety = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var season = g('vf-season'), crop = g('vf-crop'), name = g('vf-name'), code = g('vf-code').toUpperCase();
  if (!season || !crop || !name || !code) { alert('Please fill all required fields.'); return; }
  // Duplicate checks
  var existing = SM.varieties.filter(function (v) { return v.id !== SM.editId; });
  if (existing.some(function (v) { return v.code === code; })) { alert('Variety Code must be unique. "' + code + '" already exists.'); return; }
  if (existing.some(function (v) { return v.name === name && v.crop === crop; })) { alert('Variety "' + name + '" already exists under ' + crop + '.'); return; }
  if (SM.formMode === 'edit') {
    var r = SM.varieties.find(function (v) { return v.id === SM.editId; });
    if (r) { r.season = season; r.crop = crop; r.name = name; r.code = code; r.desc = g('vf-desc'); r.status = g('vf-status'); }
    App.showToast('Variety updated successfully.');
  } else {
    SM.varieties.push({ id: App._smNextId(SM.varieties, 'VAR-'), name: name, code: code, crop: crop, season: season, desc: g('vf-desc'), status: g('vf-status') || 'Active', created: new Date().toISOString().split('T')[0] });
    App.showToast('Variety created successfully.');
  }
  App.navigate('sm-variety');
};

// ═══════════════════════════════════════════════════════════
// 12. SUB-VARIETY MASTER — List + Form + Save
// ═══════════════════════════════════════════════════════════
App.smSubVarietyList = function () {
  var rows = SM.subVarieties;
  return '<div class="page-header"><h1>Sub-Variety Master</h1><p>Manage sub-varieties under each variety</p></div>'
    + '<div class="card"><div class="card-header"><h3>Sub-Varieties (' + rows.length + ')</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.navigate(\'sm-subvariety-form\')"><span class="material-icons">add</span> Create Sub-Variety</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Sub-Variety</th><th>Code</th><th>Season</th><th>Crop</th><th>Variety</th><th>Description</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>'
    + rows.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td><b>' + r.name + '</b></td><td>' + r.code + '</td><td>' + r.season + '</td><td>' + r.crop + '</td><td>' + r.variety + '</td><td style="font-size:0.78rem;">' + (r.desc || '') + '</td>'
        + '<td>' + App._smBdg(r.status) + '</td><td style="font-size:0.78rem;">' + r.created + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-subvariety-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (r.status === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smToggleSubVariety(\'' + r.id + '\')">' + (r.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};
App.smToggleSubVariety = function (id) {
  var r = SM.subVarieties.find(function (sv) { return sv.id === id; });
  if (r) { r.status = r.status === 'Active' ? 'Inactive' : 'Active'; App.showToast('Sub-Variety status updated.'); App.render(); }
};
App.smSubVarietyForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.subVarieties.find(function (sv) { return sv.id === SM.editId; }) : null;
  var f = SM.filter;
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Create') + ' Sub-Variety</h1></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">account_tree</span> Sub-Variety Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" id="sf-season" onchange="App.state.sm.filter.season=this.value;App.render()"><option value="">Select</option>' + App._smSeasonOpts(r ? r.season : f.season) + '</select></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" id="sf-crop" onchange="App.state.sm.filter.crop=this.value;App.render()"><option value="">Select</option>' + App._smCropOpts(r ? r.season : f.season, r ? r.crop : f.crop) + '</select></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" id="sf-variety" onchange="App.state.sm.filter.variety=this.value;App.render()"><option value="">Select</option>' + App._smVarOpts(r ? r.crop : f.crop, r ? r.season : f.season, r ? r.variety : f.variety) + '</select></div>'
    + '<div class="form-group"><label>Sub-Variety Name <span style="color:#F44336">*</span></label><input class="form-control" id="sf-name" value="' + (r ? r.name : '') + '" placeholder="e.g. IR-64 Premium"></div>'
    + '<div class="form-group"><label>Sub-Variety Code <span style="color:#F44336">*</span></label><input class="form-control" id="sf-code" value="' + (r ? r.code : '') + '" placeholder="e.g. IR64-PR" style="text-transform:uppercase;"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Description</label><textarea class="form-control" id="sf-desc" rows="2">' + (r ? r.desc : '') + '</textarea></div>'
    + '<div class="form-group"><label>Status</label><select class="form-control" id="sf-status"><option value="Active"' + (r && r.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (r && r.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-subvariety\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveSubVariety()"><span class="material-icons">save</span> Save</button></div>'
    + '</div></div>';
};
App.smSaveSubVariety = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var season = g('sf-season'), crop = g('sf-crop'), variety = g('sf-variety'), name = g('sf-name'), code = g('sf-code').toUpperCase();
  if (!season || !crop || !variety || !name || !code) { alert('Please fill all required fields.'); return; }
  var existing = SM.subVarieties.filter(function (sv) { return sv.id !== SM.editId; });
  if (existing.some(function (sv) { return sv.code === code; })) { alert('Sub-Variety Code "' + code + '" already exists.'); return; }
  if (existing.some(function (sv) { return sv.name === name && sv.variety === variety; })) { alert('Sub-Variety "' + name + '" already exists under ' + variety + '.'); return; }
  if (SM.formMode === 'edit') {
    var r = SM.subVarieties.find(function (sv) { return sv.id === SM.editId; });
    if (r) { r.season = season; r.crop = crop; r.variety = variety; r.name = name; r.code = code; r.desc = g('sf-desc'); r.status = g('sf-status'); }
    App.showToast('Sub-Variety updated successfully.');
  } else {
    SM.subVarieties.push({ id: App._smNextId(SM.subVarieties, 'SUB-'), name: name, code: code, variety: variety, crop: crop, season: season, desc: g('sf-desc'), status: g('sf-status') || 'Active', created: new Date().toISOString().split('T')[0] });
    App.showToast('Sub-Variety created successfully.');
  }
  App.navigate('sm-subvariety');
};

// ═══════════════════════════════════════════════════════════
// 13. STOCK REPORTS
// ═══════════════════════════════════════════════════════════
App.smReports = function () {
  var inv = SM.inventory;
  var reports = [
    { name: 'Season-wise Stock', desc: 'Stock grouped by season' },
    { name: 'Crop-wise Stock', desc: 'Stock grouped by crop' },
    { name: 'Variety-wise Stock', desc: 'Stock grouped by variety' },
    { name: 'Sub-Variety-wise Stock', desc: 'Stock grouped by sub-variety' },
    { name: 'Lot-wise Stock', desc: 'Stock grouped by lot/batch' },
    { name: 'Stock Inward Report', desc: 'All inward transactions' },
    { name: 'Stock Outward Report', desc: 'All outward transactions' },
    { name: 'Stock Ledger Report', desc: 'Complete ledger export' }
  ];
  return '<div class="page-header"><h1>Stock Reports</h1><p>Generate and export reports</p></div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">'
    + reports.map(function (rp) {
      return '<div class="card"><div class="card-body" style="text-align:center;padding:24px;">'
        + '<span class="material-icons" style="font-size:36px;color:#2E7D32;">description</span>'
        + '<h3 style="margin:10px 0 6px;">' + rp.name + '</h3>'
        + '<p style="font-size:0.82rem;color:#757575;margin-bottom:16px;">' + rp.desc + '</p>'
        + '<div style="display:flex;gap:8px;justify-content:center;">'
        + '<button class="btn btn-success btn-sm" onclick="App.showToast(\'' + rp.name + ' exported to Excel\')"><span class="material-icons">table_chart</span> Excel</button>'
        + '<button class="btn btn-danger btn-sm" onclick="App.showToast(\'' + rp.name + ' exported to PDF\')"><span class="material-icons">picture_as_pdf</span> PDF</button>'
        + '</div></div></div>';
    }).join('')
    + '</div>';
};

// ═══════════════════════════════════════════════════════════
// 14. SEASON MASTER — List + Form + Save + Toggle
// ═══════════════════════════════════════════════════════════
App.smSeasonList = function () {
  var rows = SM.seasons;
  return '<div class="page-header"><h1>Season Master</h1><p>Manage crop seasons</p></div>'
    + '<div class="card"><div class="card-header"><h3>Seasons (' + rows.length + ')</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.navigate(\'sm-season-form\')"><span class="material-icons">add</span> Create Season</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Season Name</th><th>Code</th><th>Description</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>'
    + rows.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td><b>' + r.name + '</b></td><td>' + (r.code || '—') + '</td><td style="font-size:0.78rem;">' + (r.desc || '') + '</td>'
        + '<td>' + App._smBdg(r.status) + '</td><td style="font-size:0.78rem;">' + (r.created || '') + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-season-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (r.status === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smToggleSeason(\'' + r.id + '\')">' + (r.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};
App.smToggleSeason = function (id) {
  var r = SM.seasons.find(function (s) { return s.id === id; });
  if (r) { r.status = r.status === 'Active' ? 'Inactive' : 'Active'; App.showToast('Season status updated.'); App.render(); }
};
App.smSeasonForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.seasons.find(function (s) { return s.id === SM.editId; }) : null;
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Create') + ' Season</h1></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">event</span> Season Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Season Name <span style="color:#F44336">*</span></label><input class="form-control" id="ss-name" value="' + (r ? r.name : '') + '" placeholder="e.g. Kharif 2026"></div>'
    + '<div class="form-group"><label>Season Code <span style="color:#F44336">*</span></label><input class="form-control" id="ss-code" value="' + (r ? r.code : '') + '" placeholder="e.g. KH26" style="text-transform:uppercase;"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Description</label><textarea class="form-control" id="ss-desc" rows="2">' + (r ? (r.desc || '') : '') + '</textarea></div>'
    + '<div class="form-group"><label>Status</label><select class="form-control" id="ss-status"><option value="Active"' + (r && r.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (r && r.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-season\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveSeason()"><span class="material-icons">save</span> Save</button></div>'
    + '</div></div>';
};
App.smSaveSeason = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var name = g('ss-name'), code = g('ss-code').toUpperCase();
  if (!name || !code) { alert('Please fill Season Name and Code.'); return; }
  var existing = SM.seasons.filter(function (s) { return s.id !== SM.editId; });
  if (existing.some(function (s) { return (s.code || '').toUpperCase() === code; })) { alert('Season Code "' + code + '" already exists.'); return; }
  if (existing.some(function (s) { return s.name.toLowerCase() === name.toLowerCase(); })) { alert('Season "' + name + '" already exists.'); return; }
  if (SM.formMode === 'edit') {
    var r = SM.seasons.find(function (s) { return s.id === SM.editId; });
    if (r) { r.name = name; r.code = code; r.desc = g('ss-desc'); r.status = g('ss-status'); }
    App.showToast('Season updated successfully.');
  } else {
    SM.seasons.push({ id: App._smNextId(SM.seasons, 'SEA-'), name: name, code: code, desc: g('ss-desc'), status: g('ss-status') || 'Active', created: new Date().toISOString().split('T')[0] });
    App.showToast('Season created successfully.');
  }
  App.navigate('sm-season');
};

// ═══════════════════════════════════════════════════════════
// 15. CROP MASTER — List + Form + Save + Toggle
// ═══════════════════════════════════════════════════════════
App.smCropList = function () {
  var rows = SM.crops;
  return '<div class="page-header"><h1>Crop Master</h1><p>Manage crops and their applicable seasons</p></div>'
    + '<div class="card"><div class="card-header"><h3>Crops (' + rows.length + ')</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.navigate(\'sm-crop-form\')"><span class="material-icons">add</span> Create Crop</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Crop Name</th><th>Code</th><th>Applicable Seasons</th><th>Description</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>'
    + rows.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td><b>' + r.name + '</b></td><td>' + (r.code || '—') + '</td><td style="font-size:0.8rem;">' + (r.seasons || []).join(', ') + '</td><td style="font-size:0.78rem;">' + (r.desc || '') + '</td>'
        + '<td>' + App._smBdg(r.status) + '</td><td style="font-size:0.78rem;">' + (r.created || '') + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-crop-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (r.status === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smToggleCrop(\'' + r.id + '\')">' + (r.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};
App.smToggleCrop = function (id) {
  var r = SM.crops.find(function (c) { return c.id === id; });
  if (r) { r.status = r.status === 'Active' ? 'Inactive' : 'Active'; App.showToast('Crop status updated.'); App.render(); }
};
App.smCropForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.crops.find(function (c) { return c.id === SM.editId; }) : null;
  var selSeasons = r ? (r.seasons || []) : [];
  var seasonChecks = SM.seasons.filter(function (s) { return s.status === 'Active'; }).map(function (s) {
    var chk = selSeasons.indexOf(s.name) >= 0 ? ' checked' : '';
    return '<label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer;margin-right:16px;">'
      + '<input type="checkbox" class="cf-season-chk" value="' + s.name + '"' + chk + '> ' + s.name + '</label>';
  }).join('');
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Create') + ' Crop</h1></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">grass</span> Crop Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Crop Name <span style="color:#F44336">*</span></label><input class="form-control" id="cf-name" value="' + (r ? r.name : '') + '" placeholder="e.g. Paddy"></div>'
    + '<div class="form-group"><label>Crop Code <span style="color:#F44336">*</span></label><input class="form-control" id="cf-code" value="' + (r ? r.code : '') + '" placeholder="e.g. PDY" style="text-transform:uppercase;"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Applicable Seasons</label><div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px 0;">' + (seasonChecks || '<span style="color:#9E9E9E;font-size:0.82rem;">No active seasons</span>') + '</div></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Description</label><textarea class="form-control" id="cf-desc" rows="2">' + (r ? (r.desc || '') : '') + '</textarea></div>'
    + '<div class="form-group"><label>Status</label><select class="form-control" id="cf-status"><option value="Active"' + (r && r.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (r && r.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-crop\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveCrop()"><span class="material-icons">save</span> Save</button></div>'
    + '</div></div>';
};
App.smSaveCrop = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var name = g('cf-name'), code = g('cf-code').toUpperCase();
  if (!name || !code) { alert('Please fill Crop Name and Code.'); return; }
  var seasons = [];
  var chks = document.querySelectorAll('.cf-season-chk');
  for (var i = 0; i < chks.length; i++) { if (chks[i].checked) seasons.push(chks[i].value); }
  var existing = SM.crops.filter(function (c) { return c.id !== SM.editId; });
  if (existing.some(function (c) { return (c.code || '').toUpperCase() === code; })) { alert('Crop Code "' + code + '" already exists.'); return; }
  if (existing.some(function (c) { return c.name.toLowerCase() === name.toLowerCase(); })) { alert('Crop "' + name + '" already exists.'); return; }
  if (SM.formMode === 'edit') {
    var r = SM.crops.find(function (c) { return c.id === SM.editId; });
    if (r) { r.name = name; r.code = code; r.seasons = seasons; r.desc = g('cf-desc'); r.status = g('cf-status'); }
    App.showToast('Crop updated successfully.');
  } else {
    SM.crops.push({ id: App._smNextId(SM.crops, 'CRP-'), name: name, code: code, seasons: seasons, desc: g('cf-desc'), status: g('cf-status') || 'Active', created: new Date().toISOString().split('T')[0] });
    App.showToast('Crop created successfully.');
  }
  App.navigate('sm-crop');
};

// ═══════════════════════════════════════════════════════════
// 16. FINANCIAL YEAR MASTER — List + Form + Save + Toggle
// ═══════════════════════════════════════════════════════════
App.smFinYearList = function () {
  var rows = SM.financialYears;
  return '<div class="page-header"><h1>Financial Year Master</h1><p>Manage financial years</p></div>'
    + '<div class="card"><div class="card-header"><h3>Financial Years (' + rows.length + ')</h3>'
    + '<button class="btn btn-primary btn-sm" onclick="App.state.sm.editId=null;App.state.sm.formMode=\'add\';App.navigate(\'sm-finyear-form\')"><span class="material-icons">add</span> Create Financial Year</button>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Sr.</th><th>Financial Year</th><th>Code</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>'
    + rows.map(function (r, i) {
      return '<tr><td>' + (i + 1) + '</td><td><b>' + r.name + '</b></td><td>' + (r.code || '—') + '</td><td style="font-size:0.8rem;">' + (r.startDate || '') + '</td><td style="font-size:0.8rem;">' + (r.endDate || '') + '</td>'
        + '<td>' + App._smBdg(r.status) + '</td><td style="font-size:0.78rem;">' + (r.created || '') + '</td>'
        + '<td><div class="action-btns">'
        + '<button class="btn btn-outline btn-sm" title="Edit" onclick="App.state.sm.editId=\'' + r.id + '\';App.state.sm.formMode=\'edit\';App.navigate(\'sm-finyear-form\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
        + '<button class="btn ' + (r.status === 'Active' ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="App.smToggleFinYear(\'' + r.id + '\')">' + (r.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>'
        + '</div></td></tr>';
    }).join('')
    + '</tbody></table></div></div></div>';
};
App.smToggleFinYear = function (id) {
  var r = SM.financialYears.find(function (fy) { return fy.id === id; });
  if (r) { r.status = r.status === 'Active' ? 'Inactive' : 'Active'; App.showToast('Financial Year status updated.'); App.render(); }
};
App.smFinYearForm = function () {
  var mode = SM.formMode || 'add';
  var r = mode === 'edit' ? SM.financialYears.find(function (fy) { return fy.id === SM.editId; }) : null;
  return '<div class="page-header"><h1>' + (mode === 'edit' ? 'Edit' : 'Create') + ' Financial Year</h1></div>'
    + '<div class="card"><div class="card-body">'
    + '<div class="form-section"><div class="form-section-title"><span class="material-icons">date_range</span> Financial Year Details</div>'
    + '<div class="form-grid">'
    + '<div class="form-group"><label>Financial Year <span style="color:#F44336">*</span></label><input class="form-control" id="fy-name" value="' + (r ? r.name : '') + '" placeholder="e.g. 2026-2027"></div>'
    + '<div class="form-group"><label>Code <span style="color:#F44336">*</span></label><input class="form-control" id="fy-code" value="' + (r ? r.code : '') + '" placeholder="e.g. FY2627" style="text-transform:uppercase;"></div>'
    + '<div class="form-group"><label>Start Date <span style="color:#F44336">*</span></label><input type="date" class="form-control" id="fy-start" value="' + (r ? r.startDate : '') + '"></div>'
    + '<div class="form-group"><label>End Date <span style="color:#F44336">*</span></label><input type="date" class="form-control" id="fy-end" value="' + (r ? r.endDate : '') + '"></div>'
    + '<div class="form-group"><label>Status</label><select class="form-control" id="fy-status"><option value="Active"' + (r && r.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (r && r.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>'
    + '</div></div>'
    + '<div class="form-actions"><button class="btn btn-gray" onclick="App.navigate(\'sm-finyear\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.smSaveFinYear()"><span class="material-icons">save</span> Save</button></div>'
    + '</div></div>';
};
App.smSaveFinYear = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
  var name = g('fy-name'), code = g('fy-code').toUpperCase(), start = g('fy-start'), end = g('fy-end');
  if (!name || !code || !start || !end) { alert('Please fill all required fields.'); return; }
  if (new Date(end) <= new Date(start)) { alert('End Date must be after Start Date.'); return; }
  var existing = SM.financialYears.filter(function (fy) { return fy.id !== SM.editId; });
  if (existing.some(function (fy) { return (fy.code || '').toUpperCase() === code; })) { alert('Financial Year Code "' + code + '" already exists.'); return; }
  if (existing.some(function (fy) { return fy.name.toLowerCase() === name.toLowerCase(); })) { alert('Financial Year "' + name + '" already exists.'); return; }
  if (SM.formMode === 'edit') {
    var r = SM.financialYears.find(function (fy) { return fy.id === SM.editId; });
    if (r) { r.name = name; r.code = code; r.startDate = start; r.endDate = end; r.status = g('fy-status'); }
    App.showToast('Financial Year updated successfully.');
  } else {
    SM.financialYears.push({ id: App._smNextId(SM.financialYears, 'FY-'), name: name, code: code, startDate: start, endDate: end, status: g('fy-status') || 'Active', created: new Date().toISOString().split('T')[0] });
    App.showToast('Financial Year created successfully.');
  }
  App.navigate('sm-finyear');
};

console.log('[Stock Management] Complete module loaded with demo data');
