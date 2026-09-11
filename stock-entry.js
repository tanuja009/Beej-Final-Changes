/**
 * BEEJ SANGH — STOCK ENTRY MODULE
 * One common Stock Entry page supporting 4 seed types with dynamic fields:
 *   Breeder Seed, Foundation Seed, Certified Seed, Hybrid Seed.
 * Plus a Stock Entry listing with filters. Reuses App.state.sm masters
 * (seasons/crops/varieties/subVarieties) and existing UI classes.
 */
'use strict';

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
if (!App.state.stockEntry) {
  App.state.stockEntry = {
    // Working form buffer (kept in state so re-renders preserve dropdowns)
    form: null,
    editId: null,
    confirmOpen: false,
    // Listing filters
    filter: { seedType: '', season: '', crop: '', variety: '', lot: '', location: '', quality: '', from: '', to: '', search: '' }
  };
}
if (!App.state.stockEntries) {
  App.state.stockEntries = [
    {
      id: 'SE-2026-001', seedType: 'Breeder Seed', season: 'Kharif 2026', crop: 'Paddy', variety: 'IR-64', seedClass: 'Breeder', sourceType: 'Production', availableQty: 1000, addQty: 500, unit: 'Quintal',
      prodYear: '2026', prodDate: '2026-06-15', receiptDate: '2026-06-20', storage: 'Cold Storage A', warehouse: 'Central Warehouse, Bhopal',
      rack: 'R-12', quality: 'Approved', certStatus: 'Certified', germination: 92, purity: 98, moisture: 11,
      lab: 'State Seed Testing Lab, Bhopal', reportNo: 'TR-2026-001', reportDate: '2026-06-18',
      specific: { institute: 'IARI, New Delhi', parentDetails: 'Nucleus seed', prodArea: '5 ha', prodYear: '2026', lot: 'BS-P-001' },
      documents: [{ name: 'Seed_Test_Report.pdf', type: 'Seed Test Report', date: '2026-06-18' }],
      remarks: 'Initial breeder seed production', status: 'Submitted', entryDate: '2026-06-20'
    },
    {
      id: 'SE-2026-002', seedType: 'Foundation Seed', season: 'Rabi 2025-26', crop: 'Wheat', variety: 'GW-322',
      seedClass: 'Foundation I', sourceType: 'Procurement', availableQty: 800, addQty: 300, unit: 'Quintal',
      prodYear: '2025', prodDate: '2025-11-10', receiptDate: '2025-11-20', storage: 'Godown B', warehouse: 'Divisional Store, Jabalpur',
      rack: 'R-05', quality: 'Tested', certStatus: 'Under Process', germination: 88, purity: 97, moisture: 12,
      lab: 'Regional Seed Lab, Jabalpur', reportNo: 'TR-2025-045', reportDate: '2025-11-15',
      specific: { parentLot: 'BS-W-010', agency: 'Rampur Krishi Samiti', prodArea: '10 ha', prodYear: '2025', lot: 'FS-W-001' },
      documents: [], remarks: '', status: 'Approved', entryDate: '2025-11-20'
    },
    {
      id: 'SE-2026-003', seedType: 'Certified Seed', season: 'Kharif 2026', crop: 'Soybean', variety: 'JS-335',
      seedClass: 'Certified', sourceType: 'Production', availableQty: 500, addQty: 250, unit: 'Quintal',
      prodYear: '2026', prodDate: '2026-05-20', receiptDate: '2026-05-28', storage: 'Godown C', warehouse: 'Regional Depot, Indore',
      rack: 'R-08', quality: 'Pending Testing', certStatus: 'Not Certified', germination: 0, purity: 0, moisture: 0,
      lab: '', reportNo: '', reportDate: '',
      specific: { foundationLot: 'FS-S-002', society: 'Sehora Kisan Sabha', certAgency: 'MP State Seed Cert Agency', certNo: 'CERT-2026-100', lot: 'CS-S-001' },
      documents: [], remarks: 'Awaiting lab results', status: 'Draft', entryDate: '2026-05-28'
    }
  ];
}

// Seed-class options per seed type
App._seSeedClasses = function (seedType) {
  var map = {
    'Breeder Seed': ['Breeder Seed'],
    'Foundation Seed': ['Foundation Seed Stage-I', 'Foundation Seed Stage-II'],
    'Certified Seed': ['Certified Seed'],
    'Hybrid Seed': ['Hybrid Seed']
  };
  return map[seedType] || [];
};
App._seSeedTypes = ['Breeder Seed', 'Foundation Seed', 'Certified Seed', 'Hybrid Seed'];
App._seSourceTypes = ['Production', 'Procurement', 'Return', 'Opening Stock', 'Transfer', 'Other'];
App._seUnits = ['Kg', 'Quintal', 'Metric Ton'];
App._seWarehouses = ['Central Warehouse, Bhopal', 'Divisional Store, Jabalpur', 'Regional Depot, Indore', 'District Store, Chhindwara'];
App._seStorageLocations = ['Cold Storage A', 'Godown B', 'Godown C', 'Ambient Store', 'Reserve Store'];
App._seLabs = ['State Seed Testing Lab, Bhopal', 'Regional Seed Lab, Jabalpur', 'District Seed Lab, Indore'];

// Compute existing stock for a Seed Type + Season + Crop + Variety + Sub-Variety + Lot combination
App._seExistingStock = function (f) {
  if (!f) return 0;
  return SEList().filter(function (e) {
    return e.id !== SE().editId
      && e.seedType === f.seedType && e.season === f.season && e.crop === f.crop
      && e.variety === f.variety && (e.subVariety || '') === (f.subVariety || '')
      && e.lot === f.lot && e.lot;
  }).reduce(function (sum, e) { return sum + (Number(e.addQty) || 0); }, 0);
};

// Blank form buffer
App._seBlankForm = function () {
  return {
    seedType: '', season: '', crop: '', variety: '', seedClass: '', sourceType: '', addQty: '', unit: 'Quintal', finYear: '', prodDate: '',
    prodYear: '', receiptDate: '', warehouse: '', storage: '', rack: '',
    quality: '', certStatus: '', germination: '', purity: '', moisture: '', lab: '', reportNo: '', reportDate: '',
    specific: {}, documents: [], remarks: ''
  };
};

var SE = function () { return App.state.stockEntry; };
var SEList = function () { return App.state.stockEntries; };

App._seNextId = function () {
  var yr = new Date().getFullYear();
  var n = SEList().filter(function (e) { return String(e.id).indexOf('SE-' + yr) === 0; }).length + 1;
  // account for existing count regardless of year, keep unique
  var all = SEList().map(function (e) { return parseInt(String(e.id).replace(/\D/g, '').slice(-3), 10); }).filter(function (x) { return !isNaN(x); });
  var seq = (all.length ? Math.max.apply(null, all) : 0) + 1;
  return 'SE-' + yr + '-' + String(seq).padStart(3, '0');
};

App._seBadge = function (s) {
  var m = { Draft: 'badge-gray', Submitted: 'badge-info', Approved: 'badge-success', Rejected: 'badge-danger', 'Pending Testing': 'badge-warning', Tested: 'badge-info', Approved: 'badge-success', Rejected: 'badge-danger' };
  return '<span class="badge ' + (m[s] || 'badge-gray') + '">' + s + '</span>';
};

// Master dropdown helpers (reuse App.state.sm masters if present)
App._seSeasons = function () { return (App.state.sm ? App.state.sm.seasons : []).filter(function (s) { return s.status === 'Active'; }); };
App._seCrops = function (season) { return (App.state.sm ? App.state.sm.crops : []).filter(function (c) { return c.status === 'Active' && (!season || (c.seasons || []).indexOf(season) >= 0); }); };
App._seVarieties = function (crop, season) { return (App.state.sm ? App.state.sm.varieties : []).filter(function (v) { return v.status === 'Active' && (!crop || v.crop === crop) && (!season || v.season === season); }); };
App._seSubVarieties = function (variety) { return (App.state.sm ? App.state.sm.subVarieties : []).filter(function (sv) { return sv.status === 'Active' && (!variety || sv.variety === variety); }); };
App._seFinYears = function () { return (App.state.sm ? (App.state.sm.financialYears || []) : []).filter(function (fy) { return fy.status === 'Active'; }); };

// ═══════════════════════════════════════════════════════════
// SIDEBAR — add "Stock Entry" + "Stock Entry List" under Stock Management
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderAdminSidebar ? App.renderAdminSidebar.bind(App) : null;
  if (!_prev) return;
  App.renderAdminSidebar = function () {
    var html = _prev();
    var p = this.state.currentPage;
    var ni = function (icon, label, page) {
      var c = 'nav-item nav-sub-item' + (p === page ? ' active' : '');
      return '<div class="' + c + '" onclick="App.navigate(\'' + page + '\')"><span class="material-icons">' + icon + '</span><span>' + label + '</span></div>';
    };
    var items = ni('list', 'Stock Entry List', 'se-list');
    // Insert right after the "Stock Dashboard" item within Stock Management
    if (/App\.navigate\('sm-dashboard'\)/.test(html)) {
      return html.replace(/(<div class="nav-item[^"]*"[^>]*onclick="App\.navigate\('sm-dashboard'\)">.*?<\/div>)/,
        '$1' + items);
    }
    // Fallback: before the first Stock Management sub-item
    if (/App\.navigate\('sm-season'\)/.test(html)) {
      return html.replace(/(<div class="nav-item nav-sub-item[^"]*"[^>]*onclick="App\.navigate\('sm-season'\)">)/, items + '$1');
    }
    return html;
  };
})();

// ═══════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderPage.bind(App);
  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'se-form': return App.seRenderForm();
      case 'se-list': return App.seRenderList();
      case 'se-view': return App.seRenderView();
      default: return _prev();
    }
  };
})();

// ═══════════════════════════════════════════════════════════
// HEADER TITLES
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderHeader.bind(App);
  var T = { 'se-form': 'Stock Entry', 'se-list': 'Stock Entry List', 'se-view': 'Stock Entry Details' };
  App.renderHeader = function () {
    var html = _prev();
    var t = T[this.state.currentPage];
    if (!t) return html;
    return html.replace(/<span class="header-title">.*?<\/span>/, '<span class="header-title">' + t + '</span>');
  };
})();

// ═══════════════════════════════════════════════════════════
// FORM FIELD HELPERS — every field writes back to SE().form and re-renders
// ═══════════════════════════════════════════════════════════
App.seSet = function (key, val) {
  var f = SE().form; if (!f) return;
  f[key] = val;
  // Reset dependent children when a parent changes
  if (key === 'seedType') { f.seedClass = ''; f.specific = {}; }
  if (key === 'season') { f.crop = ''; f.variety = ''; f.subVariety = ''; }
  if (key === 'crop') { f.variety = ''; f.subVariety = ''; }
  if (key === 'variety') { f.subVariety = ''; }
  App.render();
};
App.seSetSpecific = function (key, val) {
  var f = SE().form; if (!f) return;
  f.specific = f.specific || {}; f.specific[key] = val;
  App.render();
};
// live update for typed inputs (no full re-render to keep focus) — updates summary node
App.seLive = function (key, val) {
  var f = SE().form; if (!f) return;
  f[key] = val;
  App.seRefreshSummary();
};
App.seLiveSpecific = function (key, val) {
  var f = SE().form; if (!f) return;
  f.specific = f.specific || {}; f.specific[key] = val;
};

function seOpt(list, sel, placeholder) {
  return '<option value="">' + (placeholder || 'Select') + '</option>'
    + list.map(function (x) {
      var v = (typeof x === 'string') ? x : x.name;
      return '<option value="' + v + '"' + (sel === v ? ' selected' : '') + '>' + v + '</option>';
    }).join('');
}

// ═══════════════════════════════════════════════════════════
// STOCK ENTRY FORM
// ═══════════════════════════════════════════════════════════
App.seRenderForm = function () {
  var st = SE();
  if (!st.form) st.form = App._seBlankForm();
  var f = st.form;
  var mode = st.editId ? 'Edit' : 'New';

  var crops = App._seCrops(f.season);
  var varieties = App._seVarieties(f.crop, f.season);
  var subs = App._seSubVarieties(f.variety);
  var classes = App._seSeedClasses(f.seedType);
  var varietyNote = (f.crop && varieties.length === 0)
    ? '<div style="color:#E65100;font-size:0.78rem;margin-top:4px;">No variety configured for ' + f.crop + '. Please add one in Variety Master.</div>' : '';

  var breadcrumb = '<div style="font-size:0.8rem;color:#757575;margin-bottom:6px;">Stock Management &rsaquo; Stock Entry</div>';

  // ── Section 4: seed-type-specific fields ──
  var sp = f.specific || {};
  function spField(label, key, req, ph) {
    return '<div class="form-group"><label>' + label + (req ? ' <span style="color:#F44336">*</span>' : '') + '</label>'
      + '<input class="form-control" value="' + (sp[key] || '') + '" placeholder="' + (ph || '') + '" oninput="App.seLiveSpecific(\'' + key + '\',this.value)">'
      + '<div class="se-err" id="err-sp-' + key + '"></div></div>';
  }
  var specificHtml = '';
  if (f.seedType === 'Breeder Seed') {
    specificHtml = spField('Breeder / Producing Institute', 'institute', true, 'e.g. IARI, New Delhi')
      + spField('Source / Parent Seed Details', 'parentDetails', false)
      + spField('Production Area', 'prodArea', false, 'e.g. 5 ha')
      + spField('Production Year', 'spProdYear', false, 'e.g. 2026')
      + spField('Breeder Seed Lot Number', 'lot', true);
  } else if (f.seedType === 'Foundation Seed') {
    specificHtml = spField('Parent Seed Lot Number', 'parentLot', true)
      + spField('Producing Agency / Farmer / Society', 'agency', true)
      + spField('Production Area', 'prodArea', false)
      + spField('Production Year', 'spProdYear', false)
      + spField('Foundation Seed Lot Number', 'lot', true);
  } else if (f.seedType === 'Certified Seed') {
    specificHtml = spField('Foundation Seed Lot Number', 'foundationLot', true)
      + spField('Producing Society / Agency', 'society', true)
      + spField('Certification Agency', 'certAgency', false)
      + spField('Certification Number', 'certNo', true)
      + spField('Certified Seed Lot Number', 'lot', true);
  } else if (f.seedType === 'Hybrid Seed') {
    specificHtml = spField('Parent Line Details', 'parentDetails', false)
      + spField('Male Parent Line', 'maleParent', false)
      + spField('Female Parent Line', 'femaleParent', false)
      + spField('Hybrid Type', 'hybridType', false)
      + spField('Producing Agency', 'agency', false)
      + spField('Hybrid Seed Lot Number', 'lot', true);
  }

  // ── Documents list ──
  var docsHtml = (f.documents && f.documents.length)
    ? '<div class="table-wrap"><table><thead><tr><th>Document Name</th><th>Type</th><th>Upload Date</th><th>Action</th></tr></thead><tbody>'
    + f.documents.map(function (d, i) {
      return '<tr><td>' + d.name + '</td><td>' + d.type + '</td><td>' + d.date + '</td>'
        + '<td><div class="action-btns"><button class="btn btn-outline btn-sm" onclick="App.showToast(\'Opening ' + d.name + '\')"><span class="material-icons" style="font-size:14px;">visibility</span></button>'
        + '<button class="btn btn-danger btn-sm" onclick="App.seRemoveDoc(' + i + ')"><span class="material-icons" style="font-size:14px;">delete</span></button></div></td></tr>';
    }).join('') + '</tbody></table></div>'
    : '<div style="color:#9E9E9E;font-size:0.82rem;padding:8px 0;">No documents uploaded yet.</div>';

  return breadcrumb
    + '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">'
    + '<div><h1>Stock Entry</h1><p>' + mode + ' stock entry for all seed types</p></div>'
    + '<button class="btn btn-outline btn-sm" onclick="App.navigate(\'se-list\')"><span class="material-icons">list</span> Stock Entry List</button></div>'

    + '<div>'  // form wrapper (full width)

    // Section 1: Seed Information
    + '<div class="card" style="margin-bottom:16px;"><div class="card-header"><h3>1. Seed Information</h3></div><div class="card-body"><div class="form-grid">'
    + '<div class="form-group"><label>Seed Type <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seSet(\'seedType\',this.value)">' + seOpt(App._seSeedTypes, f.seedType, 'Select Seed Type') + '</select><div class="se-err" id="err-seedType"></div></div>'
    + '<div class="form-group"><label>Season <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seSet(\'season\',this.value)">' + seOpt(App._seSeasons(), f.season, 'Select Season') + '</select><div class="se-err" id="err-season"></div></div>'
    + '<div class="form-group"><label>Crop <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seSet(\'crop\',this.value)"' + (f.season ? '' : ' disabled') + '>' + seOpt(crops, f.crop, f.season ? 'Select Crop' : 'Select Season first') + '</select><div class="se-err" id="err-crop"></div></div>'
    + '<div class="form-group"><label>Variety <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seSet(\'variety\',this.value)"' + (f.crop ? '' : ' disabled') + '>' + seOpt(varieties, f.variety, f.crop ? 'Select Variety' : 'Select Crop first') + '</select><div class="se-err" id="err-variety"></div>' + varietyNote + '</div>'
    + '<div class="form-group"><label>Sub-Variety</label><select class="form-control" onchange="App.seSet(\'subVariety\',this.value)"' + (f.variety ? '' : ' disabled') + '>' + seOpt(subs, f.subVariety, f.variety ? 'Select Sub-Variety (optional)' : 'Select Variety first') + '</select></div>'
    + '</div></div></div>'

    // Section 2: Stock Details
    + '<div class="card" style="margin-bottom:16px;"><div class="card-header"><h3>2. Stock Details</h3></div><div class="card-body"><div class="form-grid">'
    + '<div class="form-group"><label>Lot Number <span style="color:#F44336">*</span></label><input class="form-control" value="' + (f.lot || '') + '" placeholder="e.g. BS-P-002" oninput="App.seLive(\'lot\',this.value)"><div class="se-err" id="err-lot"></div></div>'
    + '<div class="form-group"><label>Available / Existing Stock</label><input class="form-control" id="se-existing" value="' + App._seExistingStock(f) + '" readonly style="background:#f5f5f5;"></div>'
    + '<div class="form-group"><label>Quantity to be Added <span style="color:#F44336">*</span></label><input type="number" class="form-control" value="' + (f.addQty || '') + '" placeholder="Enter quantity" oninput="App.seLive(\'addQty\',this.value)"><div class="se-err" id="err-addQty"></div></div>'
    + '<div class="form-group"><label>Total Stock</label><input class="form-control" id="se-total" value="' + (App._seExistingStock(f) + (Number(f.addQty) || 0)) + '" readonly style="background:#f5f5f5;font-weight:600;"></div>'
    + '<div class="form-group"><label>Unit <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seLive(\'unit\',this.value)">' + seOpt(App._seUnits, f.unit, 'Select Unit') + '</select><div class="se-err" id="err-unit"></div></div>'
    + '<div class="form-group"><label>Financial Year <span style="color:#F44336">*</span></label><select class="form-control" onchange="App.seLive(\'finYear\',this.value)">' + seOpt(App._seFinYears(), f.finYear, 'Select Financial Year') + '</select><div class="se-err" id="err-finYear"></div></div>'
    + '<div class="form-group"><label>Production Date</label><input type="date" class="form-control" value="' + (f.prodDate || '') + '" oninput="App.seLive(\'prodDate\',this.value)"><div class="se-err" id="err-prodDate"></div></div>'
    + '</div></div></div>'

    // Section 3: Remarks
    + '<div class="card" style="margin-bottom:16px;"><div class="card-header"><h3>3. Remarks</h3></div><div class="card-body">'
    + '<textarea class="form-control" rows="3" placeholder="Optional remarks" oninput="App.seLiveSpecific(\'__remarks\',this.value);App.state.stockEntry.form.remarks=this.value;">' + (f.remarks || '') + '</textarea></div></div>'

    // Buttons
    + '<div class="form-actions" style="justify-content:flex-end;gap:10px;">'
    + '<button class="btn btn-gray" onclick="App.seCancel()"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-outline" onclick="App.seReset()"><span class="material-icons">refresh</span> Reset</button>'
    + '<button class="btn btn-warning" onclick="App.seSaveDraft()"><span class="material-icons">save</span> Save as Draft</button>'
    + '<button class="btn btn-primary" onclick="App.seSubmit()"><span class="material-icons">check_circle</span> Submit Stock Entry</button>'
    + '</div>'

    + '</div>'  // end form wrapper

    + (st.confirmOpen ? App.seRenderConfirmModal() : '');
};

// Refresh the auto-computed Existing Stock + Total Stock fields during typing.
App.seRefreshSummary = function () {
  var f = SE().form || {};
  var existing = App._seExistingStock(f);
  var existingInput = document.getElementById('se-existing');
  if (existingInput) existingInput.value = existing;
  var totalInput = document.getElementById('se-total');
  if (totalInput) totalInput.value = existing + (Number(f.addQty) || 0);
};

// ── Documents ──
App.seAddDoc = function () {
  var f = SE().form; if (!f) return;
  var typeEl = document.getElementById('se-doc-type');
  var fileEl = document.getElementById('se-doc-file');
  var type = typeEl ? typeEl.value : '';
  var file = fileEl && fileEl.files && fileEl.files[0];
  if (!type) { App.showToast('Select a document type.'); return; }
  if (!file) { App.showToast('Choose a file to upload.'); return; }
  if (!/\.(pdf|jpg|jpeg|png)$/i.test(file.name)) { App.showToast('Only PDF, JPG, JPEG, PNG allowed.'); return; }
  f.documents = f.documents || [];
  f.documents.push({ name: file.name, type: type, date: new Date().toISOString().split('T')[0] });
  App.showToast('Document added.');
  App.render();
};
App.seRemoveDoc = function (i) {
  var f = SE().form; if (!f || !f.documents) return;
  f.documents.splice(i, 1);
  App.render();
};

// ═══════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════
App._seClearErrors = function () {
  document.querySelectorAll('.se-err').forEach(function (e) { e.textContent = ''; e.style.display = 'none'; });
};
App._seShowError = function (id, msg) {
  var e = document.getElementById('err-' + id);
  if (e) { e.textContent = msg; e.style.display = 'block'; }
};
App._seValidate = function (draft) {
  var f = SE().form; var errs = {};
  // Minimum for draft: seedType + lot
  if (!f.seedType) errs.seedType = 'Seed Type is required.';
  if (draft) {
    if (!f.lot) errs.lot = 'Lot Number is required.';
    return errs;
  }
  // Full validation
  if (!f.season) errs.season = 'Season is required.';
  if (!f.crop) errs.crop = 'Crop is required.';
  if (!f.variety) errs.variety = 'Variety is required.';
  if (!f.lot) errs.lot = 'Lot Number is required.';
  var qty = Number(f.addQty);
  if (!f.addQty || isNaN(qty) || qty <= 0) errs.addQty = 'Quantity must be a number greater than 0.';
  if (!f.unit) errs.unit = 'Unit is required.';
  if (!f.finYear) errs.finYear = 'Financial Year is required.';
  // Dates
  var today = new Date().toISOString().split('T')[0];
  if (f.prodDate && f.prodDate > today) errs.prodDate = 'Production Date cannot be in the future.';
  // Duplicate combination
  var dup = SEList().some(function (e) {
    return e.id !== SE().editId && e.seedType === f.seedType && e.season === f.season && e.crop === f.crop
      && e.variety === f.variety && (e.subVariety || '') === (f.subVariety || '') && e.lot === f.lot;
  });
  if (dup) errs.lot = 'A stock entry already exists for this Seed Type + Season + Crop + Variety + Lot.';
  return errs;
};
App._seRenderErrors = function (errs) {
  App._seClearErrors();
  Object.keys(errs).forEach(function (k) {
    var id = k.indexOf('sp-') === 0 ? 'sp-' + k.slice(3) : k;
    App._seShowError(id, errs[k]);
  });
};

// ═══════════════════════════════════════════════════════════
// SAVE / SUBMIT / DRAFT / RESET / CANCEL
// ═══════════════════════════════════════════════════════════
App.seSaveDraft = function () {
  var errs = App._seValidate(true);
  if (Object.keys(errs).length) { App.render(); setTimeout(function () { App._seRenderErrors(errs); }, 0); App.showToast('Enter at least Seed Type and Lot Number to save a draft.'); return; }
  App._sePersist('Draft');
  App.showToast('Stock entry saved as draft.');
  App.navigate('se-list');
};

App.seSubmit = function () {
  var errs = App._seValidate(false);
  if (Object.keys(errs).length) {
    App._seRenderErrors(errs);
    App.showToast('Please fix the highlighted fields before submitting.');
    return;
  }
  SE().confirmOpen = true;
  App.render();
};

App.seConfirmSubmit = function () {
  var rec = App._sePersist('Submitted');
  SE().confirmOpen = false;
  SE().lastSubmitted = rec;
  App.showToast('Stock entry successfully submitted.');
  App.navigate('se-view');
};

App.seCancelConfirm = function () { SE().confirmOpen = false; App.render(); };

App._sePersist = function (status) {
  var f = SE().form;
  var today = new Date().toISOString().split('T')[0];
  if (SE().editId) {
    var r = SEList().find(function (e) { return e.id === SE().editId; });
    if (r) {
      Object.assign(r, {
        seedType: f.seedType, season: f.season, crop: f.crop, variety: f.variety, subVariety: f.subVariety,
        seedClass: f.seedClass, sourceType: f.sourceType, addQty: Number(f.addQty) || 0, unit: f.unit, lot: f.lot,
        finYear: f.finYear, prodYear: f.prodYear, prodDate: f.prodDate, receiptDate: f.receiptDate, warehouse: f.warehouse, storage: f.storage,
        rack: f.rack, quality: f.quality, certStatus: f.certStatus, germination: f.germination, purity: f.purity,
        moisture: f.moisture, lab: f.lab, reportNo: f.reportNo, reportDate: f.reportDate,
        specific: f.specific, documents: f.documents, remarks: f.remarks, status: status
      });
      return r;
    }
  }
  var rec = {
    id: App._seNextId(), seedType: f.seedType, season: f.season, crop: f.crop, variety: f.variety, subVariety: f.subVariety,
    seedClass: f.seedClass, sourceType: f.sourceType, availableQty: App._seExistingStock(f), addQty: Number(f.addQty) || 0,
    unit: f.unit, lot: f.lot, finYear: f.finYear, prodYear: f.prodYear, prodDate: f.prodDate, receiptDate: f.receiptDate,
    warehouse: f.warehouse, storage: f.storage, rack: f.rack, quality: f.quality, certStatus: f.certStatus,
    germination: f.germination, purity: f.purity, moisture: f.moisture, lab: f.lab, reportNo: f.reportNo, reportDate: f.reportDate,
    specific: f.specific, documents: f.documents, remarks: f.remarks, status: status, entryDate: today
  };
  SEList().unshift(rec);
  return rec;
};

App.seReset = function () {
  SE().form = App._seBlankForm();
  App.render();
};
App.seCancel = function () {
  SE().form = null; SE().editId = null; SE().confirmOpen = false;
  App.navigate('se-list');
};

// ═══════════════════════════════════════════════════════════
// CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════
App.seRenderConfirmModal = function () {
  var f = SE().form || {};
  return '<div class="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;" onclick="if(event.target===this)App.seCancelConfirm()">'
    + '<div class="modal-box" style="background:#fff;border-radius:12px;max-width:460px;width:100%;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.3);">'
    + '<div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">'
    + '<h3 style="margin:0;color:#fff;font-size:1.05rem;">Add Stock</h3>'
    + '<button onclick="App.seCancelConfirm()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">&times;</button></div>'
    + '<div style="padding:22px;">'
    + '<p style="margin:0 0 14px;font-size:0.92rem;color:#333;">Are you sure you want to add this stock?</p>'
    + '<div style="background:#F5F5F5;border-radius:8px;padding:14px;font-size:0.85rem;">'
    + '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#757575;">Seed Type</span><b>' + (f.seedType || '—') + '</b></div>'
    + '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#757575;">Crop</span><b>' + (f.crop || '—') + '</b></div>'
    + '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#757575;">Variety</span><b>' + (f.variety || '—') + '</b></div>'
    + '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#757575;">Lot Number</span><b>' + (f.lot || '—') + '</b></div>'
    + '<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:#757575;">Quantity</span><b>' + (f.addQty || '—') + ' ' + (f.unit || '') + '</b></div>'
    + '</div></div>'
    + '<div style="padding:0 22px 22px;display:flex;justify-content:flex-end;gap:10px;">'
    + '<button class="btn btn-gray" onclick="App.seCancelConfirm()">Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.seConfirmSubmit()"><span class="material-icons" style="font-size:16px;">check_circle</span> Confirm &amp; Submit</button>'
    + '</div></div></div>';
};

// ═══════════════════════════════════════════════════════════
// SUCCESS / VIEW PAGE
// ═══════════════════════════════════════════════════════════
App.seRenderView = function () {
  var rec = SE().lastSubmitted || (SE().editId ? SEList().find(function (e) { return e.id === SE().editId; }) : SEList()[0]);
  if (!rec) return App.seRenderList();
  function row(label, val) {
    return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:0.85rem;"><span style="color:#757575;">' + label + '</span><span style="font-weight:600;">' + (val || '—') + '</span></div>';
  }
  var justSubmitted = SE().lastSubmitted && SE().lastSubmitted.id === rec.id;
  return '<div class="page-header"><h1>Stock Entry Details</h1><p>' + rec.id + '</p></div>'
    + (justSubmitted ? '<div class="card" style="margin-bottom:16px;border-left:4px solid #4CAF50;"><div class="card-body" style="display:flex;align-items:center;gap:12px;">'
      + '<span class="material-icons" style="color:#2E7D32;font-size:32px;">check_circle</span>'
      + '<div><div style="font-weight:700;color:#1B5E20;">Stock entry successfully submitted.</div>'
      + '<div style="font-size:0.85rem;color:#555;">ID: <b>' + rec.id + '</b> | ' + rec.seedType + ' | Qty: <b>' + rec.addQty + ' ' + rec.unit + '</b> | Lot: <b>' + rec.lot + '</b></div></div></div></div>' : '')
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">'
    + '<div class="card"><div class="card-header"><h3>Seed &amp; Stock</h3></div><div class="card-body">'
    + row('Seed Type', rec.seedType) + row('Seed Class', rec.seedClass) + row('Season', rec.season) + row('Crop', rec.crop)
    + row('Variety', rec.variety) + row('Sub-Variety', rec.subVariety) + row('Lot Number', rec.lot)
    + row('Source Type', rec.sourceType) + row('Quantity Added', rec.addQty + ' ' + rec.unit) + row('Status', rec.status) + '</div></div>'
    + '<div class="card"><div class="card-header"><h3>Quality &amp; Storage</h3></div><div class="card-body">'
    + row('Quality Status', rec.quality) + row('Certification', rec.certStatus) + row('Germination %', rec.germination)
    + row('Purity %', rec.purity) + row('Moisture %', rec.moisture) + row('Warehouse', rec.warehouse)
    + row('Storage', rec.storage) + row('Rack', rec.rack) + row('Entry Date', rec.entryDate) + '</div></div>'
    + '</div>'
    + '<div class="form-actions" style="justify-content:flex-end;gap:10px;margin-top:16px;">'
    + '<button class="btn btn-outline" onclick="App.navigate(\'se-list\')"><span class="material-icons">list</span> Go to Stock Entry List</button>'
    + '<button class="btn btn-primary" onclick="App.state.stockEntry.form=null;App.state.stockEntry.editId=null;App.navigate(\'se-form\')"><span class="material-icons">add_box</span> New Stock Entry</button>'
    + '</div>';
};

// ═══════════════════════════════════════════════════════════
// STOCK ENTRY LIST
// ═══════════════════════════════════════════════════════════
App._seFiltered = function () {
  var f = SE().filter;
  return SEList().filter(function (e) {
    return (!f.seedType || e.seedType === f.seedType)
      && (!f.season || e.season === f.season)
      && (!f.crop || e.crop === f.crop)
      && (!f.variety || e.variety === f.variety)
      && (!f.lot || (e.lot || '').toLowerCase().indexOf(f.lot.toLowerCase()) >= 0)
      && (!f.location || e.storage === f.location || e.warehouse === f.location)
      && (!f.quality || e.quality === f.quality)
      && (!f.from || (e.entryDate && e.entryDate >= f.from))
      && (!f.to || (e.entryDate && e.entryDate <= f.to))
      && (!f.search || (e.id + ' ' + e.seedType + ' ' + e.crop + ' ' + e.variety + ' ' + e.lot).toLowerCase().indexOf(f.search.toLowerCase()) >= 0);
  });
};

App.seRenderList = function () {
  var f = SE().filter;
  var rows = App._seFiltered();
  var seasons = App._seSeasons();
  var breadcrumb = '<div style="font-size:0.8rem;color:#757575;margin-bottom:6px;">Stock Management &rsaquo; Stock Entry List</div>';
  return breadcrumb
    + '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">'
    + '<div><h1>Stock Entry List</h1><p>All stock entries across seed types</p></div>'
    + '<button class="btn btn-primary" onclick="App.state.stockEntry.form=null;App.state.stockEntry.editId=null;App.navigate(\'se-form\')"><span class="material-icons">add_box</span> New Stock Entry</button></div>'

    // Filters
    + '<div class="search-bar" style="margin-bottom:16px;flex-wrap:wrap;">'
    + '<div class="search-field"><label>Search</label><input class="form-control" placeholder="ID, Crop, Lot…" value="' + (f.search || '') + '" oninput="App.state.stockEntry.filter.search=this.value;App.render()"></div>'
    + '<div class="search-field"><label>Seed Type</label><select class="form-control" onchange="App.state.stockEntry.filter.seedType=this.value;App.render()">' + seOpt(App._seSeedTypes, f.seedType, 'All') + '</select></div>'
    + '<div class="search-field"><label>Season</label><select class="form-control" onchange="App.state.stockEntry.filter.season=this.value;App.render()">' + seOpt(seasons, f.season, 'All') + '</select></div>'
    + '<div class="search-field"><label>Crop</label><select class="form-control" onchange="App.state.stockEntry.filter.crop=this.value;App.render()">' + seOpt(App._seCrops(f.season), f.crop, 'All') + '</select></div>'
    + '<div class="search-field"><label>Quality</label><select class="form-control" onchange="App.state.stockEntry.filter.quality=this.value;App.render()">' + seOpt(['Pending Testing', 'Tested', 'Approved', 'Rejected'], f.quality, 'All') + '</select></div>'
    + '<div class="search-field"><label>From</label><input type="date" class="form-control" value="' + (f.from || '') + '" onchange="App.state.stockEntry.filter.from=this.value;App.render()"></div>'
    + '<div class="search-field"><label>To</label><input type="date" class="form-control" value="' + (f.to || '') + '" onchange="App.state.stockEntry.filter.to=this.value;App.render()"></div>'
    + '<div class="search-field"><label>&nbsp;</label><button class="btn btn-gray btn-sm" onclick="App.seResetFilter()"><span class="material-icons">clear</span> Reset</button></div>'
    + '</div>'

    + '<div class="card"><div class="card-header"><h3>Stock Entries <span style="color:#757575;font-weight:400;font-size:0.85rem;">(' + rows.length + ' records)</span></h3>'
    + '<div style="display:flex;gap:8px;"><button class="btn btn-success btn-sm" onclick="App.showToast(\'Exported to Excel\')"><span class="material-icons">table_chart</span> Export</button></div>'
    + '</div><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Seed Type</th><th>Season</th><th>Crop</th><th>Variety</th><th>Qty</th><th>Unit</th><th>Source</th><th>Quality</th><th>Entry Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>'
    + (rows.length === 0 ? '<tr><td colspan="11" style="text-align:center;padding:30px;color:#9E9E9E;">No stock entries found.</td></tr>'
      : rows.map(function (e) {
        return '<tr><td>' + e.seedType + '</td><td>' + e.season + '</td><td>' + e.crop + '</td><td>' + e.variety + '</td>'
          + '<td style="font-weight:700;color:#2E7D32;">' + e.addQty + '</td><td>' + e.unit + '</td><td>' + e.sourceType + '</td>'
          + '<td>' + App._seBadge(e.quality) + '</td><td style="font-size:0.78rem;">' + e.entryDate + '</td><td>' + App._seBadge(e.status) + '</td>'
          + '<td><div class="action-btns">'
          + '<button class="btn btn-outline btn-sm" title="View" onclick="App.seViewEntry(\'' + e.id + '\')"><span class="material-icons" style="font-size:14px;">visibility</span></button>'
          + '<button class="btn btn-warning btn-sm" title="Edit" onclick="App.seEditEntry(\'' + e.id + '\')"><span class="material-icons" style="font-size:14px;">edit</span></button>'
          + '<button class="btn btn-danger btn-sm" title="Delete" onclick="App.seDeleteEntry(\'' + e.id + '\')"><span class="material-icons" style="font-size:14px;">delete</span></button>'
          + '</div></td></tr>';
      }).join(''))
    + '</tbody></table></div></div></div>';
};

App.seResetFilter = function () {
  SE().filter = { seedType: '', season: '', crop: '', variety: '', lot: '', location: '', quality: '', from: '', to: '', search: '' };
  App.render();
};
App.seViewEntry = function (id) {
  SE().editId = id; SE().lastSubmitted = null; App.navigate('se-view');
};
App.seEditEntry = function (id) {
  var e = SEList().find(function (x) { return x.id === id; });
  if (!e) return;
  SE().editId = id;
  SE().form = {
    seedType: e.seedType, season: e.season, crop: e.crop, variety: e.variety, subVariety: e.subVariety,
    seedClass: e.seedClass, sourceType: e.sourceType, lot: e.lot, addQty: e.addQty, unit: e.unit,
    finYear: e.finYear, prodYear: e.prodYear, prodDate: e.prodDate, receiptDate: e.receiptDate, warehouse: e.warehouse, storage: e.storage,
    rack: e.rack, quality: e.quality, certStatus: e.certStatus, germination: e.germination, purity: e.purity,
    moisture: e.moisture, lab: e.lab, reportNo: e.reportNo, reportDate: e.reportDate,
    specific: Object.assign({}, e.specific), documents: (e.documents || []).slice(), remarks: e.remarks
  };
  App.navigate('se-form');
};
App.seDeleteEntry = function (id) {
  var e = SEList().find(function (x) { return x.id === id; });
  if (!e) return;
  if (!confirm('Delete stock entry ' + id + '?')) return;
  var idx = SEList().indexOf(e);
  if (idx >= 0) SEList().splice(idx, 1);
  App.showToast('Stock entry deleted.');
  App.render();
};

console.log('[Stock Entry] module loaded');
