/**
 * BEEJ SANGH — SOCIETY DASHBOARD DRILL-DOWN LISTS
 * Each summary box on the Society Head dashboard opens its own list page:
 *   Total Members            -> dl-total-members
 *   Active Members           -> dl-active-members
 *   Total Demand Raised      -> dl-total-demands
 *   Total Approved Qty       -> dl-approved
 */
'use strict';

// Demography of the logged-in society (SOC-001), shown in every society-level report.
var SOC_DEMO = { district: 'Chhindwara', block: 'Patan', village: 'Rampur' };
var demoTds = function () { return '<td>' + SOC_DEMO.district + '</td><td>' + SOC_DEMO.block + '</td><td>' + SOC_DEMO.village + '</td>'; };
var DEMO_HEAD = ['District', 'Block', 'Village'];

var DL = {
  TITLES: {
    'dl-total-members': 'Total Members',
    'dl-active-members': 'Active Members',
    'dl-total-demands': 'Total Demand Raised',
    'dl-approved': 'Total Approved Seed Quantity',
    'as-total': 'Total Stock Report',
    'as-breeder': 'Breeder Stock Report',
    'as-foundation': 'Foundation Seed Stock Report',
    'as-certified': 'Certified Seed Stock Report',
    'as-hybrid': 'Hybrid Seed Stock Report'
  },
  approved: function (d) {
    var adm = App.state.adminDemands.find(function (x) { return x.id === d.id; });
    return adm ? (adm.approvedQty || 0) : (d.approvedQty != null ? d.approvedQty : (d.approvalStatus === 'Approved' ? d.qty : 0));
  },
  pending: function (d) {
    var adm = App.state.adminDemands.find(function (x) { return x.id === d.id; });
    return adm ? (adm.pendingQty || 0) : (d.pendingQty != null ? d.pendingQty : (d.approvalStatus === 'Approved' ? 0 : d.qty));
  },
  statusBadge: function (s) {
    var c = (s === 'Approved' || s === 'Received') ? 'badge-success' : (s === 'Partially Approved' || s === 'Dispatched') ? 'badge-info'
      : (s === 'Pending' || s === 'Under Review') ? 'badge-warning' : s === 'Rejected' ? 'badge-danger' : 'badge-purple';
    return '<span class="badge ' + c + '">' + s + '</span>';
  },
  variety: function (d) {
    var alt = [(d.secondChoice || []).length ? '2nd: ' + d.secondChoice.join(', ') : '', (d.thirdChoice || []).length ? '3rd: ' + d.thirdChoice.join(', ') : ''].filter(Boolean).join(' · ');
    return d.variety + (alt ? '<div style="font-size:0.72rem;color:#757575;">' + alt + '</div>' : '');
  },
  shell: function (title, subtitle, head, rows, footer, emptyMsg) {
    return '<div style="margin-bottom:16px;"><button class="btn btn-gray btn-sm" onclick="App.navigate(\'dashboard\')"><span class="material-icons" style="font-size:16px;">arrow_back</span> Back to Dashboard</button></div>'
      + '<div class="page-header"><h1>' + title + '</h1><p>' + subtitle + '</p></div>'
      + '<div class="card"><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
      + '<thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>'
      + (rows.length ? rows.join('') : '<tr><td colspan="' + head.length + '" style="text-align:center;padding:30px;color:#9E9E9E;">' + emptyMsg + '</td></tr>')
      + (footer || '') + '</tbody></table></div></div></div>';
  }
};

// ───────────── Members (Total / Active) ─────────────
DL.members = function (activeOnly) {
  var list = App.state.members.filter(function (m) { return !activeOnly || m.status === 'Active'; });
  var rows = list.map(function (m, i) {
    return '<tr><td>' + (i + 1) + '</td><td><b>' + m.name + '</b></td><td>' + m.id + '</td><td>' + (m.mobile || '—') + '</td>'
      + '<td>' + (m.district || '—') + '</td><td>' + (m.block || '—') + '</td><td>' + (m.village || '—') + '</td>'
      + '<td><span class="badge badge-gray">' + (m.category || '—') + '</span></td>'
      + '<td><span class="badge ' + (m.status === 'Active' ? 'badge-success' : 'badge-danger') + '">' + m.status + '</span></td>'
      + '<td>' + (m.joiningDate || '—') + '</td>'
      + '<td><div class="action-btns"><button class="btn btn-info btn-sm" title="View" onclick="App.state.memberViewId=\'' + m.id + '\';App.navigate(\'member-view\')"><span class="material-icons" style="font-size:14px;">visibility</span></button></div></td></tr>';
  });
  return DL.shell(activeOnly ? 'Active Members' : 'Total Members',
    (activeOnly ? 'Members with Active status: ' : 'All registered members: ') + list.length,
    ['#', 'Member Name', 'Member ID', 'Mobile', 'District', 'Block', 'Village', 'Category', 'Status', 'Joining Date', 'Actions'],
    rows, '', 'No members found.');
};

// ───────────── Demands ─────────────
DL.allDemands = function () {
  var ds = App.state.demands;
  var rows = ds.map(function (d) {
    var st = App._demandStatus(d);
    var pay = st === 'Rejected' ? 'Pending' : (d.fullyPaid ? 'Fully Paid' : d.payStatus);
    var ap = DL.approved(d), pe = DL.pending(d);
    return '<tr><td><b>' + d.id + '</b></td>' + demoTds() + '<td>' + d.date + '</td><td>' + d.season + '</td><td>' + d.crop + '</td><td>' + DL.variety(d) + '</td>'
      + '<td style="font-weight:600;">' + d.qty + ' Qt</td>'
      + '<td style="color:#2E7D32;font-weight:600;">' + (ap > 0 ? ap + ' Qt' : '—') + '</td>'
      + '<td style="color:' + (pe > 0 ? '#E65100' : '#9E9E9E') + ';font-weight:600;">' + (pe > 0 ? pe + ' Qt' : '—') + '</td>'
      + '<td><span class="badge ' + (d.fullyPaid ? 'badge-success' : pay === 'Pending' ? 'badge-warning' : 'badge-info') + '">' + pay + '</span></td>'
      + '<td>' + DL.statusBadge(st) + '</td></tr>';
  });
  return DL.shell('Total Demand Raised', 'Demands raised by your society: ' + ds.length,
    ['Demand ID', 'District', 'Block', 'Village', 'Date', 'Season', 'Crop', 'Variety', 'Requested', 'Approved', 'Pending', 'Payment', 'Status'], rows, '', 'No demands raised yet.');
};

DL.approvedList = function () {
  var ds = App.state.demands.filter(function (d) { return DL.approved(d) > 0; });
  var total = ds.reduce(function (s, d) { return s + DL.approved(d); }, 0);
  var rows = ds.map(function (d) {
    return '<tr><td><b>' + d.id + '</b></td>' + demoTds() + '<td>' + d.date + '</td><td>' + d.season + '</td><td>' + d.crop + '</td><td>' + DL.variety(d) + '</td>'
      + '<td>' + d.qty + ' Qt</td><td style="color:#2E7D32;font-weight:700;">' + DL.approved(d) + ' Qt</td>'
      + '<td>' + DL.statusBadge(App._demandStatus(d)) + '</td></tr>';
  });
  var foot = ds.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="9">Total Approved Seed Quantity</td><td style="color:#2E7D32;">' + total + ' Qt</td><td></td></tr>' : '';
  return DL.shell('Total Approved Seed Quantity', 'Demands with approved quantity: ' + ds.length + ' | Total: ' + total + ' Qt',
    ['Demand ID', 'District', 'Block', 'Village', 'Date', 'Season', 'Crop', 'Variety', 'Requested', 'Approved Qty', 'Status'], rows, foot, 'No approved quantity yet.');
};

// ───────────── Available Stock boxes: one report per seed type ─────────────
// Stock sources:
//   Breeder    : seed received from Beej Sangh against the society's demands (App.state.receivedStock)
//   Foundation : entered by the Society President (Foundation & Certified Seed page) - stock = Produce Quantity procured
//   Certified  : same as Foundation
//   Hybrid     : allocated directly by Admin to the society (no demand needed) - App.state.hybridAllocs
var MY_SOC_CODE = 'SOC-001', MY_SOC_NAME = 'Rampur Krishi Samiti';
var r2 = function (n) { return Math.round((Number(n) || 0) * 100) / 100; };
var toQt = function (q, unit) { return (Number(q) || 0) / (unit === 'Kg' ? 100 : 1); };

DL.fcEntries = function (type) {
  return (App.state.fcSeedStock || []).filter(function (e) { return e.seedType === type && (e.activeStatus || 'Active') === 'Active'; });
};
DL.hybridEntries = function () {
  return (App.state.hybridAllocs || []).filter(function (h) {
    return h.status === 'Allocated' && (h.socCode === MY_SOC_CODE || h.society === MY_SOC_NAME);
  });
};
// Stock (in Quintal) per seed type, used by the Available Stock boxes.
App.stockByType = function () {
  var fc = function (type) { return r2(DL.fcEntries(type).reduce(function (s, e) { return s + toQt(e.produceQty, e.unit); }, 0)); };
  return {
    Foundation: fc('Foundation'),
    Certified: fc('Certified'),
    Hybrid: r2(DL.hybridEntries().reduce(function (s, h) { return s + (Number(h.allocQty) || 0); }, 0))
  };
};
DL.breederRows = function () { return App.state.receivedStock.filter(function (r) { return r.seedType === 'Breeder'; }); };
DL.breederQt = function () { return r2(DL.breederRows().reduce(function (s, r) { return s + (r.allocatedQty || 0) - (r.distributedQty || 0); }, 0)); };

DL.backToStock = function (html) {
  return html.replace("App.navigate('dashboard')", "App.navigate('soc-available-stock')").replace('Back to Dashboard', 'Back to Available Stock');
};

DL.breederReport = function () {
  var list = DL.breederRows();
  var sum = function (k) { return list.reduce(function (s, r) { return s + (Number(r[k]) || 0); }, 0); };
  var alloc = sum('allocatedQty'), dist = sum('distributedQty'), avail = r2(alloc - dist);
  var rows = list.map(function (r) {
    var bal = (r.allocatedQty || 0) - (r.distributedQty || 0);
    return '<tr>' + demoTds() + '<td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td>'
      + '<td style="color:#1565C0;font-weight:600;">' + r.allocatedQty + '</td><td style="color:#2E7D32;font-weight:600;">' + r.distributedQty + '</td>'
      + '<td style="color:' + (bal > 0 ? '#E65100' : '#757575') + ';font-weight:600;">' + bal + '</td><td>' + r.receivedDate + '</td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="6">Total</td><td style="color:#1565C0;">' + alloc + '</td><td style="color:#2E7D32;">' + dist + '</td><td style="color:#E65100;">' + avail + '</td><td></td></tr>' : '';
  return DL.backToStock(DL.shell('Breeder Stock Report', 'Seed received from Beej Sangh | Available: ' + avail + ' Qt (Allocated ' + alloc + ' Qt, Distributed ' + dist + ' Qt)',
    ['District', 'Block', 'Village', 'Season', 'Crop', 'Variety', 'Allocated (Qt)', 'Distributed (Qt)', 'Available (Qt)', 'Received On'], rows, foot, 'No breeder seed stock received yet.'));
};

// Foundation / Certified: stock entered by the Society President = what the society's members produced (Produce Quantity).
DL.fcReport = function (type) {
  var list = DL.fcEntries(type);
  var stockQt = r2(list.reduce(function (s, e) { return s + toQt(e.produceQty, e.unit); }, 0));
  var pendingN = list.filter(function (e) { return e.produceQty == null || e.produceQty === ''; }).length;
  var rows = list.map(function (e) {
    var procured = e.produceQty != null && e.produceQty !== '';
    var mb = App.state.members.find(function (m) { return m.id === e.memberId; }) || {};
    return '<tr><td><b>' + e.id + '</b></td><td>' + e.memberName + '<div style="font-size:0.72rem;color:#9E9E9E;">' + e.memberId + '</div></td>'
      + '<td>' + (mb.district || '—') + '</td><td>' + (mb.block || '—') + '</td><td>' + (mb.village || '—') + '</td>'
      + '<td>' + e.finYear + '</td><td>' + e.season + '</td><td>' + e.crop + '</td><td>' + e.variety + '</td>'
      + '<td>' + (e.procDate || '—') + '</td>'
      + '<td style="color:#2E7D32;font-weight:700;">' + (procured ? e.produceQty + ' ' + e.unit : '—') + '</td>'
      + '<td><span class="badge ' + (procured ? 'badge-success' : 'badge-warning') + '">' + (procured ? 'Procured' : 'Pending Procurement') + '</span></td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="10">Total (in Quintal)</td><td style="color:#2E7D32;">' + stockQt + ' Qt</td><td></td></tr>' : '';
  return DL.backToStock(DL.shell(type + ' Seed Stock Report',
    'Entered by Society President (produced by members) | Stock: ' + stockQt + ' Qt' + (pendingN ? ' | Pending procurement: ' + pendingN : ''),
    ['Entry ID', 'Member', 'District', 'Block', 'Village', 'Proc. Year', 'Season', 'Crop', 'Variety', 'Procurement Date', 'Stock (Produce Qty)', 'Status'],
    rows, foot, 'No ' + type.toLowerCase() + ' seed entries added yet. Add them from Foundation & Certified Seed.'));
};

// Hybrid: allocated directly by Admin, no demand.
DL.hybridReport = function () {
  var list = DL.hybridEntries();
  var total = r2(list.reduce(function (s, h) { return s + (Number(h.allocQty) || 0); }, 0));
  var exp = r2(list.reduce(function (s, h) { return s + (Number(h.expectedProd) || 0); }, 0));
  var rows = list.map(function (h) {
    return '<tr><td><b>' + h.id + '</b></td>' + demoTds() + '<td>' + h.allocDate + '</td><td>' + h.finYear + '</td><td>' + h.season + '</td>'
      + '<td>' + h.variety + '</td><td>' + (h.parentVariety || '—') + '</td>'
      + '<td style="color:#2E7D32;font-weight:700;">' + h.allocQty + ' Qt</td><td>' + h.expectedProd + ' Qt</td>'
      + '<td><span class="badge badge-success">' + h.status + '</span></td><td>' + (h.remarks || '—') + '</td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="9">Total</td><td style="color:#2E7D32;">' + total + ' Qt</td><td>' + exp + ' Qt</td><td colspan="2"></td></tr>' : '';
  return DL.backToStock(DL.shell('Hybrid Seed Stock Report',
    'Allocated directly by Admin (no demand required) | Stock: ' + total + ' Qt',
    ['Allocation ID', 'District', 'Block', 'Village', 'Allocation Date', 'Proc. Year', 'Season', 'Hybrid Variety', 'Parent Variety', 'Allocated Qty', 'Expected Production', 'Status', 'Remarks'],
    rows, foot, 'No hybrid seed allocated by Admin yet.'));
};

// Total: stock by seed type and where it comes from.
DL.totalReport = function () {
  var st = App.stockByType(), b = DL.breederQt();
  var items = [
    ['Breeder', 'Received from Beej Sangh against demand', b, 'as-breeder'],
    ['Foundation', 'Entered by Society President', st.Foundation, 'as-foundation'],
    ['Certified', 'Entered by Society President', st.Certified, 'as-certified'],
    ['Hybrid', 'Allocated directly by Admin', st.Hybrid, 'as-hybrid']
  ];
  var total = r2(items.reduce(function (s, i) { return s + i[2]; }, 0));
  var rows = items.map(function (i) {
    return '<tr>' + demoTds() + '<td><b>' + i[0] + '</b></td><td>' + i[1] + '</td><td style="color:#2E7D32;font-weight:700;">' + i[2] + ' Qt</td>'
      + '<td><button class="btn btn-outline btn-sm" onclick="App.navigate(\'' + i[3] + '\')"><span class="material-icons" style="font-size:14px;">visibility</span> View Report</button></td></tr>';
  });
  var foot = '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="5">Total Stock</td><td style="color:#2E7D32;">' + total + ' Qt</td><td></td></tr>';
  return DL.backToStock(DL.shell('Total Stock Report', 'Stock by seed type: ' + total + ' Qt', ['District', 'Block', 'Village', 'Seed Type', 'Source', 'Stock (Qt)', 'Report'], rows, foot, ''));
};

DL.stockReport = function (page) {
  switch (page) {
    case 'as-breeder': return DL.breederReport();
    case 'as-foundation': return DL.fcReport('Foundation');
    case 'as-certified': return DL.fcReport('Certified');
    case 'as-hybrid': return DL.hybridReport();
    default: return DL.totalReport();
  }
};

// ───────────── Router + header title ─────────────
(function () {
  var _page = App.renderPage.bind(App);
  App.renderPage = function () {
    switch (this.state.currentPage) {
      case 'dl-total-members': return DL.members(false);
      case 'dl-active-members': return DL.members(true);
      case 'dl-total-demands': return DL.allDemands();
      case 'dl-approved': return DL.approvedList();
      case 'as-total': case 'as-breeder': case 'as-foundation': case 'as-certified': case 'as-hybrid': return DL.stockReport(this.state.currentPage);
      default: return _page();
    }
  };
  var _head = App.renderHeader.bind(App);
  App.renderHeader = function () {
    var html = _head();
    var t = DL.TITLES[this.state.currentPage];
    return t ? html.replace(/<span class="header-title">.*?<\/span>/, '<span class="header-title">' + t + '</span>') : html;
  };
})();

console.log('[Dashboard Lists] module loaded');
