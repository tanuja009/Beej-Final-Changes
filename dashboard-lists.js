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
    'as-hybrid': 'Hybrid Seed Stock Report',
    'as-distributed': 'Total Distributed Seed Quantity'
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
  // Plain text of a cell / fragment (icons and tags removed).
  text: function (h) {
    return String(h == null ? '' : h).replace(/<span class="material-icons"[^>]*>.*?<\/span>/g, '').replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsaquo;/g, '>').replace(/\s+/g, ' ').trim();
  },
  // <tr> html strings -> array of text rows (colspan cells are padded with empty cells).
  matrix: function (trHtml) {
    var out = [];
    String(trHtml || '').replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, function (m, inner) {
      var row = [];
      inner.replace(/<td([^>]*)>([\s\S]*?)<\/td>/g, function (mm, attrs, cell) {
        var cs = /colspan="(\d+)"/.exec(attrs);
        row.push(DL.text(cell));
        for (var i = 1; i < (cs ? +cs[1] : 1); i++) row.push('');
        return '';
      });
      out.push(row);
      return '';
    });
    return out;
  },
  shell: function (title, subtitle, head, rows, footer, emptyMsg) {
    // Keep the report data so Excel / PDF export uses exactly what is on screen (action columns are left out).
    var keep = head.map(function (h, i) { return /^(Actions|Report)$/.test(h) ? -1 : i; }).filter(function (i) { return i >= 0; });
    var pick = function (r) { return keep.map(function (i) { return r[i] == null ? '' : r[i]; }); };
    DL.current = {
      title: title, subtitle: DL.text(subtitle), head: pick(head),
      rows: DL.matrix(rows.join('')).map(pick), foot: DL.matrix(footer || '').map(pick)
    };
    return '<div style="margin-bottom:16px;"><button class="btn btn-gray btn-sm" onclick="App.navigate(\'dashboard\')"><span class="material-icons" style="font-size:16px;">arrow_back</span> Back to Dashboard</button></div>'
      + '<div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;"><div><h1>' + title + '</h1><p>' + subtitle + '</p></div>'
      + App.reportButtons()
      + '</div>'
      + '<div class="card"><div class="card-body" style="padding:0;"><div class="table-wrap"><table>'
      + '<thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>'
      + (rows.length ? rows.join('') : '<tr><td colspan="' + head.length + '" style="text-align:center;padding:30px;color:#9E9E9E;">' + emptyMsg + '</td></tr>')
      + (footer || '') + '</tbody></table></div></div></div>';
  }
};

// ───────────── Excel / PDF download (shared by every report) ─────────────
App.reportButtons = function (key) {
  var k = key ? "'" + key + "'" : '';
  return '<div style="display:flex;gap:8px;">'
    + '<button class="btn btn-success btn-sm" title="Download Excel" onclick="App.reportExport(\'excel\'' + (k ? ',' + k : '') + ')"><span class="material-icons" style="font-size:16px;">table_chart</span> Excel</button>'
    + '<button class="btn btn-danger btn-sm" title="Download PDF" onclick="App.reportExport(\'pdf\'' + (k ? ',' + k : '') + ')"><span class="material-icons" style="font-size:16px;">picture_as_pdf</span> PDF</button></div>';
};
App.reportExport = function (kind, key) {
  var r = key ? App._reportData && App._reportData[key] : DL.current;
  if (!r || !r.rows.length) { App.showToast('No records to export.'); return; }
  var fmt = function (v) { return App.fmtDateText ? App.fmtDateText(String(v == null ? '' : v)) : String(v == null ? '' : v); };
  var slug = r.title.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + new Date().toISOString().slice(0, 10);
  var all = r.rows.concat(r.foot || []);
  if (kind === 'excel') {
    var esc = function (v) { return '"' + fmt(v).replace(/"/g, '""') + '"'; };
    var lines = [[r.title], [r.subtitle], [], r.head].concat(all).map(function (row) { return row.map(esc).join(','); });
    App._saveFile('\uFEFF' + lines.join('\r\n'), slug + '.csv', 'text/csv;charset=utf-8');
    App.showToast('Excel file downloaded.');
    return;
  }
  var h = function (v) { return fmt(v).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var footStart = r.rows.length;
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + h(r.title) + '</title>'
    + '<style>body{font-family:Arial,sans-serif;margin:24px;color:#222}h2{color:#1B5E20;margin:0 0 4px}p{color:#666;margin:0 0 14px;font-size:.85rem}'
    + 'table{width:100%;border-collapse:collapse;font-size:.72rem}th{background:#E8F5E9;color:#1B5E20;text-align:left}th,td{border:1px solid #ddd;padding:5px 7px}tr.f td{background:#F1F8E9;font-weight:700}'
    + '@page{size:landscape;margin:12mm}</style></head><body>'
    + '<h2>' + h(r.title) + '</h2><p>Rampur Krishi Samiti (SOC-001) · ' + h(r.subtitle) + ' · Generated on ' + App.fmtDate(new Date()) + '</p>'
    + '<table><thead><tr>' + r.head.map(function (x) { return '<th>' + h(x) + '</th>'; }).join('') + '</tr></thead><tbody>'
    + all.map(function (row, i) { return '<tr' + (i >= footStart ? ' class="f"' : '') + '>' + row.map(function (c) { return '<td>' + h(c) + '</td>'; }).join('') + '</tr>'; }).join('')
    + '</tbody></table><script>window.onload=function(){window.print();}<\/script></body></html>';
  var w = window.open('', '_blank');
  if (!w) { App.showToast('Please allow popups to download the PDF.'); return; }
  w.document.write(html); w.document.close();
  App.showToast('Choose "Save as PDF" in the print window.');
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
    return '<tr>' + demoTds() + '<td>' + d.date + '</td><td>' + d.season + '</td><td>' + d.crop + '</td>' + App._choiceTds(d) + ''
      + '<td style="font-weight:600;">' + d.qty + ' Qt</td>'
      + '<td style="color:#2E7D32;font-weight:600;">' + (ap > 0 ? ap + ' Qt' : '—') + '</td>'
      + '<td style="color:' + (pe > 0 ? '#E65100' : '#9E9E9E') + ';font-weight:600;">' + (pe > 0 ? pe + ' Qt' : '—') + '</td>'
      + '<td><span class="badge ' + (d.fullyPaid ? 'badge-success' : pay === 'Pending' ? 'badge-warning' : 'badge-info') + '">' + pay + '</span></td>'
      + '<td>' + DL.statusBadge(st) + '</td></tr>';
  });
  return DL.shell('Total Demand Raised', 'Demands raised by your society: ' + ds.length,
    ['District', 'Block', 'Village', 'Date', 'Season', 'Crop', 'First Choice Variety', 'Second Choice Variety', 'Third Choice Variety', 'Requested', 'Approved', 'Pending', 'Payment', 'Status'], rows, '', 'No demands raised yet.');
};

DL.approvedList = function () {
  var ds = App.state.demands.filter(function (d) { return DL.approved(d) > 0; });
  var total = ds.reduce(function (s, d) { return s + DL.approved(d); }, 0);
  var rows = ds.map(function (d) {
    return '<tr>' + demoTds() + '<td>' + d.date + '</td><td>' + d.season + '</td><td>' + d.crop + '</td>' + App._choiceTds(d) + ''
      + '<td>' + d.qty + ' Qt</td><td style="color:#2E7D32;font-weight:700;">' + DL.approved(d) + ' Qt</td>'
      + '<td>' + DL.statusBadge(App._demandStatus(d)) + '</td></tr>';
  });
  var foot = ds.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="10">Total Approved Seed Quantity</td><td style="color:#2E7D32;">' + total + ' Qt</td><td></td></tr>' : '';
  return DL.shell('Total Approved Seed Quantity', 'Demands with approved quantity: ' + ds.length + ' | Total: ' + total + ' Qt',
    ['District', 'Block', 'Village', 'Date', 'Season', 'Crop', 'First Choice Variety', 'Second Choice Variety', 'Third Choice Variety', 'Requested', 'Approved Qty', 'Status'], rows, foot, 'No approved quantity yet.');
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
    return '<tr><td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td>'
      + '<td style="color:#1565C0;font-weight:600;">' + r.allocatedQty + '</td><td style="color:#2E7D32;font-weight:600;">' + r.distributedQty + '</td>'
      + '<td style="color:' + (bal > 0 ? '#E65100' : '#757575') + ';font-weight:600;">' + bal + '</td><td>' + r.receivedDate + '</td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="3">Total</td><td style="color:#1565C0;">' + alloc + '</td><td style="color:#2E7D32;">' + dist + '</td><td style="color:#E65100;">' + avail + '</td><td></td></tr>' : '';
  return DL.backToStock(DL.shell('Breeder Stock Report', 'District: ' + SOC_DEMO.district + ' | Block: ' + SOC_DEMO.block + ' | Village: ' + SOC_DEMO.village + ' | Available: ' + avail + ' Qt (Allocated ' + alloc + ' Qt, Distributed ' + dist + ' Qt)',
    ['Season', 'Crop', 'Variety', 'Allocated (Qt)', 'Distributed (Qt)', 'Available (Qt)', 'Received On'], rows, foot, 'No breeder seed stock received yet.'));
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

// Society confirms the hybrid seed allocated by Admin has reached it: Allocated -> Received.
App.hybridMarkReceived = function (id) {
  var h = (App.state.hybridAllocs || []).find(function (x) { return x.id === id; });
  if (!h) return;
  h.received = true;
  h.receivedDate = new Date().toISOString().slice(0, 10);
  App.showToast('Hybrid seed marked as Received.');
  App.render();
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
      + '<td>' + (h.received ? '<span class="badge badge-success">Received</span>' : '<span class="badge badge-info">Allocated</span>') + '</td>'
      + '<td>' + (h.received ? '<span style="font-size:0.78rem;color:#9E9E9E;">' + (h.receivedDate || '—') + '</span>' : '<button class="btn btn-primary btn-sm" onclick="App.hybridMarkReceived(\'' + h.id + '\')"><span class="material-icons" style="font-size:14px;">inventory</span> Mark Received</button>') + '</td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="9">Total</td><td style="color:#2E7D32;">' + total + ' Qt</td><td>' + exp + ' Qt</td><td colspan="2"></td></tr>' : '';
  return DL.backToStock(DL.shell('Hybrid Seed Stock Report',
    'Allocated directly by Admin (no demand required) | Stock: ' + total + ' Qt',
    ['Allocation ID', 'District', 'Block', 'Village', 'Allocation Date', 'Proc. Year', 'Season', 'Hybrid Variety', 'Parent Variety', 'Allocated Qty', 'Expected Production', 'Status', 'Actions'],
    rows, foot, 'No hybrid seed allocated by Admin yet.'));
};

// Total: stock details by seed type.
DL.totalReport = function () {
  var uniq = function (a) { return a.filter(function (x, i) { return x && a.indexOf(x) === i; }); };
  var maxDate = function (a) { return a.filter(Boolean).sort().pop() || '—'; };
  var list = function (a) { return a.length ? a.join(', ') : '—'; };
  var br = DL.breederRows();
  var brAlloc = br.reduce(function (s, r) { return s + (r.allocatedQty || 0); }, 0);
  var brDist = br.reduce(function (s, r) { return s + (r.distributedQty || 0); }, 0);
  var fcRow = function (type) {
    var l = DL.fcEntries(type);
    var q = r2(l.reduce(function (s, e) { return s + toQt(e.produceQty, e.unit); }, 0));
    return { type: type, crops: list(uniq(l.map(function (e) { return e.crop; }))), varieties: list(uniq(l.map(function (e) { return e.variety; }))),
      entries: l.length, total: q, dist: null, avail: q, last: maxDate(l.map(function (e) { return e.updatedAt; })), page: 'as-' + type.toLowerCase() };
  };
  var hy = DL.hybridEntries();
  var hyQ = r2(hy.reduce(function (s, h) { return s + (Number(h.allocQty) || 0); }, 0));
  var items = [
    { type: 'Breeder', crops: list(uniq(br.map(function (r) { return r.crop; }))), varieties: list(uniq(br.map(function (r) { return r.variety; }))),
      entries: br.length, total: r2(brAlloc), dist: r2(brDist), avail: r2(brAlloc - brDist), last: maxDate(br.map(function (r) { return r.receivedDate; })), page: 'as-breeder' },
    fcRow('Foundation'), fcRow('Certified'),
    { type: 'Hybrid', crops: '—', varieties: list(uniq(hy.map(function (h) { return h.variety; }))),
      entries: hy.length, total: hyQ, dist: null, avail: hyQ, last: maxDate(hy.map(function (h) { return h.updatedAt || h.allocDate; })), page: 'as-hybrid' }
  ];
  var sum = function (k) { return r2(items.reduce(function (s, i) { return s + (i[k] || 0); }, 0)); };
  var rows = items.map(function (i) {
    return '<tr><td><b>' + i.type + '</b></td><td>' + i.crops + '</td><td>' + i.varieties + '</td>'
      + '<td style="color:#1565C0;font-weight:600;">' + i.total + '</td>'
      + '<td style="color:#2E7D32;font-weight:600;">' + (i.dist == null ? '—' : i.dist) + '</td>'
      + '<td style="color:#E65100;font-weight:700;">' + i.avail + '</td><td>' + i.last + '</td>'
      + '<td><button class="btn btn-outline btn-sm" onclick="App.navigate(\'' + i.page + '\')"><span class="material-icons" style="font-size:14px;">visibility</span> View Report</button></td></tr>';
  });
  var foot = '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="3">Total Stock</td><td style="color:#1565C0;">' + sum('total') + '</td><td style="color:#2E7D32;">' + sum('dist') + '</td><td style="color:#E65100;">' + sum('avail') + '</td><td colspan="2"></td></tr>';
  return DL.backToStock(DL.shell('Total Stock Report', 'District: ' + SOC_DEMO.district + ' | Block: ' + SOC_DEMO.block + ' | Village: ' + SOC_DEMO.village + ' | Available: ' + sum('avail') + ' Qt',
    ['Seed Type', 'Crops', 'Varieties', 'Received / Produced (Qt)', 'Distributed (Qt)', 'Available (Qt)', 'Last Updated', 'Report'], rows, foot, ''));
};

// Seed distributed to society members (Breeder seed).
DL.distributedReport = function () {
  var list = (App.state.distributionRecords || []).filter(function (r) { return (r.seedType || 'Breeder') === 'Breeder'; });
  var qt = function (r) { return (Number(r.qty) || 0) / (r.unit === 'Kg' ? 100 : 1); };
  var total = r2(list.reduce(function (s, r) { return s + qt(r); }, 0));
  var rows = list.map(function (r) {
    var mb = App.state.members.find(function (m) { return m.id === r.memberId; }) || {};
    return '<tr><td>' + r.memberName + '<div style="font-size:0.72rem;color:#9E9E9E;">' + r.memberId + '</div></td>'
      + '<td>' + (mb.district || '—') + '</td><td>' + (mb.block || '—') + '</td><td>' + (r.village || mb.village || '—') + '</td>'
      + '<td>' + (r.finYear || '—') + '</td><td>' + r.season + '</td><td><b>' + r.crop + '</b></td><td>' + r.variety + '</td>'
      + '<td style="color:#2E7D32;font-weight:700;">' + r.qty + ' ' + (r.unit === 'Kg' ? 'Kg' : 'Quintal') + '</td><td>' + r.date + '</td></tr>';
  });
  var foot = list.length ? '<tr style="background:#F1F8E9;font-weight:700;"><td colspan="8">Total (in Quintal)</td><td style="color:#2E7D32;">' + total + ' Qt</td><td></td></tr>' : '';
  return DL.backToStock(DL.shell('Total Distributed Seed Quantity', 'Breeder seed distributed to members: ' + total + ' Qt across ' + list.length + ' distributions',
    ['Member', 'District', 'Block', 'Village', 'Proc. Year', 'Season', 'Crop', 'Variety', 'Quantity', 'Distribution Date'], rows, foot, 'No seed distributed to members yet.'));
};

DL.stockReport = function (page) {
  switch (page) {
    case 'as-breeder': return DL.breederReport();
    case 'as-foundation': return DL.fcReport('Foundation');
    case 'as-certified': return DL.fcReport('Certified');
    case 'as-hybrid': return DL.hybridReport();
    case 'as-distributed': return DL.distributedReport();
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
      case 'as-total': case 'as-breeder': case 'as-foundation': case 'as-certified': case 'as-hybrid': case 'as-distributed': return DL.stockReport(this.state.currentPage);
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
