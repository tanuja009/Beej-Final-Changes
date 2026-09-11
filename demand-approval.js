/**
 * BEEJ SANGH — DEMAND APPROVAL MODULE (Admin)
 * New admin tab listing all society-raised demands with an action button
 * that opens a form pre-filled with the demand data, where the admin enters
 * the approved quantity. Reuses App.state.adminDemands and existing UI classes.
 */
'use strict';

// UI state
if (!App.state.demandApproval) {
  App.state.demandApproval = { selectedId: null, filter: { season: '', crop: '', status: '', search: '' } };
}

App._daBadge = function (s) {
  var m = {
    Approved: 'badge-success', 'Partially Approved': 'badge-info', Pending: 'badge-warning',
    Rejected: 'badge-danger', Hold: 'badge-purple', 'Under Review': 'badge-warning'
  };
  return '<span class="badge ' + (m[s] || 'badge-gray') + '">' + s + '</span>';
};

// ═══════════════════════════════════════════════════════════
// SIDEBAR — add "Demand Approval" under Management
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderAdminSidebar ? App.renderAdminSidebar.bind(App) : null;
  if (!_prev) return;
  App.renderAdminSidebar = function () {
    var html = _prev();
    var p = this.state.currentPage;
    var item = '<div class="nav-item' + (p === 'da-list' ? ' active' : '') + '" onclick="App.navigate(\'da-list\')">'
      + '<span class="material-icons">fact_check</span><span>Demand Approval</span></div>';
    // Insert right after the "Demand Management" item
    if (/App\.navigate\('admin-demands'\)/.test(html)) {
      return html.replace(/(<div class="nav-item[^"]*"[^>]*onclick="App\.navigate\('admin-demands'\)">.*?<\/div>)/,
        '$1' + item);
    }
    // Fallback: before the Management section closes / before sidebar footer
    return html.replace(/(<div class="sidebar-footer)/, item + '$1');
  };
})();

// ═══════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderPage.bind(App);
  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'da-list': return App.daRenderList();
      case 'da-form': return App.daRenderForm();
      default: return _prev();
    }
  };
})();

// ═══════════════════════════════════════════════════════════
// HEADER TITLES
// ═══════════════════════════════════════════════════════════
(function () {
  var _prev = App.renderHeader.bind(App);
  var T = { 'da-list': 'Demand Approval', 'da-form': 'Approve Demand' };
  App.renderHeader = function () {
    var html = _prev();
    var t = T[this.state.currentPage];
    if (!t) return html;
    return html.replace(/<span class="header-title">.*?<\/span>/, '<span class="header-title">' + t + '</span>');
  };
})();

// ═══════════════════════════════════════════════════════════
// LIST — all demands raised by societies
// ═══════════════════════════════════════════════════════════
App._daFiltered = function () {
  var f = this.state.demandApproval.filter;
  return (this.state.adminDemands || []).filter(function (d) {
    return (!f.season || d.season === f.season)
      && (!f.crop || d.crop === f.crop)
      && (!f.status || d.approvalStatus === f.status)
      && (!f.search || (d.id + ' ' + d.society + ' ' + d.crop + ' ' + d.variety).toLowerCase().indexOf(f.search.toLowerCase()) >= 0);
  });
};

App.daRenderList = function () {
  var f = this.state.demandApproval.filter;
  var rows = this._daFiltered();
  var seasons = ['Kharif', 'Rabi', 'Summer'];
  var crops = ['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy'];
  var statuses = ['Pending', 'Approved', 'Partially Approved', 'Rejected', 'Hold'];
  function opt(list, sel) { return '<option value="">All</option>' + list.map(function (x) { return '<option' + (sel === x ? ' selected' : '') + '>' + x + '</option>'; }).join(''); }

  return '<div style="font-size:0.8rem;color:#757575;margin-bottom:6px;">Management &rsaquo; Demand Approval</div>'
    + '<div class="page-header"><h1>Demand Approval</h1><p>All breeder seed demands raised by societies</p></div>'

    // Filters
    + '<div class="search-bar" style="margin-bottom:16px;flex-wrap:wrap;">'
    + '<div class="search-field"><label>Search</label><input class="form-control" placeholder="ID, Society, Crop…" value="' + (f.search || '') + '" oninput="App.state.demandApproval.filter.search=this.value;App.render()"></div>'
    + '<div class="search-field"><label>Season</label><select class="form-control" onchange="App.state.demandApproval.filter.season=this.value;App.render()">' + opt(seasons, f.season) + '</select></div>'
    + '<div class="search-field"><label>Crop</label><select class="form-control" onchange="App.state.demandApproval.filter.crop=this.value;App.render()">' + opt(crops, f.crop) + '</select></div>'
    + '<div class="search-field"><label>Status</label><select class="form-control" onchange="App.state.demandApproval.filter.status=this.value;App.render()">' + opt(statuses, f.status) + '</select></div>'
    + '<div class="search-field"><label>&nbsp;</label><button class="btn btn-gray btn-sm" onclick="App.state.demandApproval.filter={season:\'\',crop:\'\',status:\'\',search:\'\'};App.render()"><span class="material-icons">clear</span> Reset</button></div>'
    + '</div>'

    + '<div class="card"><div class="card-header"><h3>Society Demands <span style="color:#757575;font-weight:400;font-size:0.85rem;">(' + rows.length + ' records)</span></h3></div>'
    + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
    + '<thead><tr><th>Society</th><th>District</th><th>Season</th><th>Crop</th><th>Variety</th><th>Requested</th><th>Approved</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody>'
    + (rows.length === 0 ? '<tr><td colspan="10" style="text-align:center;padding:30px;color:#9E9E9E;">No demands found.</td></tr>'
      : rows.map(function (d) {
        return '<tr><td><div style="font-weight:500;font-size:0.85rem;">' + d.society + '</div><div style="font-size:0.72rem;color:#9E9E9E;">' + d.socCode + '</div></td>'
          + '<td>' + d.district + '</td><td>' + d.season + '</td><td><b>' + d.crop + '</b></td><td>' + d.variety + '</td>'
          + '<td style="font-weight:600;">' + d.requestedQty + ' Qt</td>'
          + '<td style="color:#2E7D32;font-weight:600;">' + (d.approvedQty > 0 ? d.approvedQty + ' Qt' : '—') + '</td>'
          + '<td><span class="badge ' + (d.payStatus === 'Paid' ? 'badge-success' : 'badge-warning') + '">' + d.payStatus + '</span></td>'
          + '<td>' + App._daBadge(d.approvalStatus) + '</td>'
          + '<td><button class="btn btn-primary btn-sm" title="Approve / Review" onclick="App.daOpenForm(\'' + d.id + '\')"><span class="material-icons" style="font-size:14px;">rule</span> Approve</button></td>'
          + '</tr>';
      }).join(''))
    + '</tbody></table></div></div></div>';
};

// ═══════════════════════════════════════════════════════════
// FORM — pre-filled demand data + enter approved quantity
// ═══════════════════════════════════════════════════════════
App.daOpenForm = function (id) {
  this.state.demandApproval.selectedId = id;
  this.navigate('da-form');
};

App.daRenderForm = function () {
  var id = this.state.demandApproval.selectedId;
  var d = (this.state.adminDemands || []).find(function (x) { return x.id === id; });
  if (!d) return this.daRenderList();

  // Available stock for this crop/variety (if the stock array exists)
  var stk = (this.state.stock || []).find(function (s) { return s.crop === d.crop && s.variety === d.variety; });
  var avail = stk ? (stk.available - (stk.allocated || 0)) : 0;

  function ro(label, val) {
    return '<div class="form-group"><label>' + label + '</label>'
      + '<input class="form-control" value="' + (val == null || val === '' ? '' : val) + '" readonly style="background:#f5f5f5;"></div>';
  }

  return '<div style="font-size:0.8rem;color:#757575;margin-bottom:6px;">Management &rsaquo; Demand Approval &rsaquo; Approve Demand</div>'
    + '<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">'
    + '<div><h1>Approve Demand</h1><p>Demand ID: <b>' + d.id + '</b> | ' + d.society + '</p></div>'
    + '<button class="btn btn-outline btn-sm" onclick="App.navigate(\'da-list\')"><span class="material-icons">arrow_back</span> Back to List</button></div>'

    // Auto-filled demand details
    + '<div class="card" style="margin-bottom:16px;"><div class="card-header"><h3>Demand Details <span style="font-size:0.72rem;color:#2E7D32;font-weight:500;margin-left:8px;">(Auto-filled)</span></h3></div>'
    + '<div class="card-body"><div class="form-grid">'
    + ro('Demand ID', d.id)
    + ro('Society Name', d.society)
    + ro('Society Code', d.socCode)
    + ro('District', d.district)
    + ro('Demand Date', d.date)
    + ro('Season', d.season)
    + ro('Crop', d.crop)
    + ro('Variety', d.variety)
    + ro('Requested Quantity (Qt)', d.requestedQty)
    + ro('Members', d.members)
    + ro('Payment Status', d.payStatus)
    + ro('Available Stock (Qt)', avail)
    + '</div></div></div>'

    // Approval action
    + '<div class="card" style="margin-bottom:16px;"><div class="card-header"><h3>Approval</h3></div><div class="card-body"><div class="form-grid">'
    + '<div class="form-group"><label>Approval Status <span style="color:#F44336">*</span></label><select class="form-control" id="da-status">'
    + ['Approved', 'Partially Approved', 'Rejected', 'Hold'].map(function (s) { return '<option' + (d.approvalStatus === s ? ' selected' : '') + '>' + s + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="form-group"><label>Approved Quantity (Qt) <span style="color:#F44336">*</span></label><input type="number" class="form-control" id="da-approved" value="' + (d.approvedQty || '') + '" placeholder="Enter approved quantity" oninput="App.daCalcPending(' + d.requestedQty + ')"><div id="da-approved-err" style="display:none;color:#F44336;font-size:0.78rem;margin-top:4px;"></div></div>'
    + '<div class="form-group"><label>Pending Quantity (Qt)</label><input class="form-control" id="da-pending" value="' + (d.pendingQty != null ? d.pendingQty : (d.requestedQty - (d.approvedQty || 0))) + '" readonly style="background:#f5f5f5;"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Remarks</label><textarea class="form-control" id="da-remarks" rows="2" placeholder="Optional remarks">' + (d.remarks || '') + '</textarea></div>'
    + '</div></div></div>'

    + '<div class="form-actions" style="justify-content:flex-end;gap:10px;">'
    + '<button class="btn btn-gray" onclick="App.navigate(\'da-list\')"><span class="material-icons">close</span> Cancel</button>'
    + '<button class="btn btn-primary" onclick="App.daSaveApproval(\'' + d.id + '\')"><span class="material-icons">check_circle</span> Save Approval</button>'
    + '</div>';
};

App.daCalcPending = function (requested) {
  var app = Number(document.getElementById('da-approved') ? document.getElementById('da-approved').value : 0) || 0;
  var pendingEl = document.getElementById('da-pending');
  if (pendingEl) pendingEl.value = Math.max(0, requested - app);
};

App.daSaveApproval = function (id) {
  var d = (this.state.adminDemands || []).find(function (x) { return x.id === id; });
  if (!d) return;
  var status = document.getElementById('da-status') ? document.getElementById('da-status').value : '';
  var approvedEl = document.getElementById('da-approved');
  var approved = Number(approvedEl ? approvedEl.value : 0);
  var errEl = document.getElementById('da-approved-err');
  var showErr = function (m) { if (errEl) { errEl.textContent = m; errEl.style.display = 'block'; } };

  // Validation depends on status
  if (status === 'Approved' || status === 'Partially Approved') {
    if (!approvedEl.value || isNaN(approved) || approved <= 0) { showErr('Enter a valid approved quantity greater than 0.'); return; }
    if (approved > d.requestedQty) { showErr('Approved quantity cannot exceed requested (' + d.requestedQty + ' Qt).'); return; }
  } else {
    approved = 0; // Rejected / Hold
  }

  d.approvalStatus = status;
  d.approvedQty = approved;
  d.pendingQty = Math.max(0, d.requestedQty - approved);
  d.remarks = document.getElementById('da-remarks') ? document.getElementById('da-remarks').value : '';

  App.showToast('Demand ' + id + ' updated: ' + status + (approved ? ' (' + approved + ' Qt)' : '') + '.');
  App.navigate('da-list');
};

console.log('[Demand Approval] module loaded');
