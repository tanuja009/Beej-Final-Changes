/**
 * BEEJ SANGH — PAYMENT HISTORY & TRANSACTIONS
 * Society (President) page  : soc-payments   → only this society's payments
 * Admin page                : admin-payments → payments of all societies
 *
 * Every payment made in the app is recorded in App.state.payments:
 *   - Advance (25%) when a demand is raised and paid
 *   - Balance (75%) when the full payment is made
 *   - Refund when the admin refunds a rejected demand
 * Demo transactions are built once from the existing demand data.
 */
'use strict';
(function () {
  if (typeof App === 'undefined') return;

  var MODES = { upi: 'UPI Payment', netbanking: 'Net Banking', card: 'Debit Card', challan: 'Bank Challan' };
  var MODE_LIST = ['UPI Payment', 'Net Banking', 'Debit Card', 'Bank Challan'];
  // The logged-in society (the society module always runs as SOC-001 in this wireframe).
  var MY_SOC = { code: 'SOC-001', name: 'Rampur Krishi Samiti' };

  App.state.payFilter = { society: '', type: '', mode: '', search: '' };

  // ── Helpers ──
  var addDays = function (iso, n) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  App._payNextId = function () {
    var nums = App.state.payments.map(function (p) { return parseInt(String(p.id).replace(/\D/g, ''), 10) || 0; });
    return 'APP-' + String((nums.length ? Math.max.apply(null, nums) : 0) + 1).padStart(5, '0');
  };
  App._payAdd = function (p) {
    p.id = App._payNextId();
    p.status = p.status || 'Success';
    App.state.payments.unshift(p);
    return p;
  };

  // ── Demo transactions from existing demands ──
  App.state.payments = [];
  (function seed() {
    var list = [];
    var i = 0;
    var push = function (p) { list.push(p); };
    // Society SOC-001 demands (Breeder Seed Demand list).
    (App.state.demands || []).forEach(function (d) {
      var total = Math.round((d.qty || 0) * (d.rate || 2400));
      var paid = /Advance|Fully/.test(d.payStatus || '') || d.fullyPaid;
      if (!paid) return;
      var mode = MODE_LIST[i++ % MODE_LIST.length];
      push({ date: d.date, socCode: MY_SOC.code, society: MY_SOC.name, demandId: d.id, crop: d.crop, variety: d.variety, type: 'Advance (25%)', amount: Math.round(total * 0.25), mode: mode });
      if (d.fullyPaid) push({ date: addDays(d.date, 30), socCode: MY_SOC.code, society: MY_SOC.name, demandId: d.id, crop: d.crop, variety: d.variety, type: 'Balance (75%)', amount: total - Math.round(total * 0.25), mode: MODE_LIST[i++ % MODE_LIST.length] });
    });
    // Other demands seen by the admin (skip ids already covered above).
    var seen = {};
    list.forEach(function (p) { seen[p.demandId] = true; });
    (App.state.adminDemands || []).forEach(function (d) {
      if (seen[d.id]) return;
      var total = Math.round((d.requestedQty || 0) * 2400);
      push({ date: d.date, socCode: d.socCode, society: d.society, demandId: d.id, crop: d.crop, variety: d.variety, type: 'Advance (25%)', amount: Math.round(total * 0.25), mode: MODE_LIST[i++ % MODE_LIST.length] });
      if (d.refunded) push({ date: addDays(d.date, 7), socCode: d.socCode, society: d.society, demandId: d.id, crop: d.crop, variety: d.variety, type: 'Refund', amount: Math.round(total * 0.25), mode: MODES[d.refundMode] || 'Net Banking' });
    });
    list.sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
    list.forEach(function (p) { App._payAdd(p); });
  }());

  // ── Record real payments made in the app ──
  var _processPayment = App.processPayment;
  App.processPayment = function () {
    var mode = this.state.paymentMode;
    var cd = this.state.currentDemand || {};
    var isFull = cd.mode === 'full';
    var prevIds = (this.state._lastDemandIds || []).slice();
    var res = _processPayment.apply(this, arguments);
    if (!mode) return res;                        // validation failed, nothing was paid
    var today = new Date().toISOString().slice(0, 10);
    if (isFull) {
      if (cd.id) App._payAdd({ date: today, socCode: MY_SOC.code, society: MY_SOC.name, demandId: cd.id, crop: cd.crop, variety: cd.variety, type: 'Balance (75%)', amount: cd.balance != null ? cd.balance : 0, mode: MODES[mode] || mode });
    } else {
      var ids = this.state._lastDemandIds || [];
      if (ids.join() !== prevIds.join() || !prevIds.length) {
        ids.forEach(function (id) {
          var dm = App.state.demands.find(function (x) { return x.id === id; });
          if (!dm) return;
          var amt = cd.advance != null && ids.length === 1 ? cd.advance : Math.round((dm.qty || 0) * (dm.rate || 2400) * 0.25);
          App._payAdd({ date: today, socCode: MY_SOC.code, society: MY_SOC.name, demandId: id, crop: dm.crop, variety: dm.variety, type: 'Advance (25%)', amount: amt, mode: MODES[mode] || mode });
        });
      }
    }
    return res;
  };

  var _processRefund = App.processRefund;
  App.processRefund = function () {
    var rf = this.state.refundFlow;
    var had = rf && rf.receipt;
    var res = _processRefund.apply(this, arguments);
    rf = this.state.refundFlow;
    if (rf && rf.receipt && !had) {
      var r = rf.receipt;
      App._payAdd({ date: new Date().toISOString().slice(0, 10), socCode: r.socCode, society: r.society, demandId: r.demandId, crop: r.crop, variety: r.variety, type: 'Refund', amount: r.amount, mode: MODES[r.mode] || r.mode });
    }
    return res;
  };

  // ── Page ──
  App.renderPayments = function (isAdmin) {
    var f = this.state.payFilter;
    var base = isAdmin ? this.state.payments : this.state.payments.filter(function (p) { return p.socCode === MY_SOC.code; });
    var q = (f.search || '').toLowerCase();
    var rows = base.filter(function (p) {
      return (!isAdmin || !f.society || p.socCode === f.society)
        && (!f.type || p.type === f.type)
        && (!f.mode || p.mode === f.mode)
        && (!q || [p.id, p.crop, p.variety, p.society].join(' ').toLowerCase().indexOf(q) !== -1);
    });
    var sum = function (arr, fn) { return arr.filter(fn).reduce(function (s, p) { return s + (Number(p.amount) || 0); }, 0); };
    // Summary boxes cover all of the society's payments (admin: the selected society), independent of the type / mode / search filters.
    var scope = base.filter(function (p) { return !isAdmin || !f.society || p.socCode === f.society; });
    var paid = sum(scope, function (p) { return p.type !== 'Refund'; });
    var adv = sum(scope, function (p) { return p.type === 'Advance (25%)'; });
    var ref = sum(scope, function (p) { return p.type === 'Refund'; });
    // Group by demand to find fully paid demands and the balance still pending on the rest.
    var perDemand = {};
    scope.forEach(function (p) {
      var g = perDemand[p.demandId] || (perDemand[p.demandId] = { adv: 0, bal: 0, ref: 0 });
      if (p.type === 'Advance (25%)') g.adv += Number(p.amount) || 0;
      else if (p.type === 'Balance (75%)') g.bal += Number(p.amount) || 0;
      else if (p.type === 'Refund') g.ref += Number(p.amount) || 0;
    });
    var totalOf = function (id, advAmt) {
      var d = App.state.demands.find(function (x) { return x.id === id; });
      if (d) return Math.round((d.qty || 0) * (d.rate || 2400));
      var a = (App.state.adminDemands || []).find(function (x) { return x.id === id; });
      return a ? Math.round((a.requestedQty || 0) * 2400) : advAmt * 4;
    };
    var isRejected = function (id) {
      var a = (App.state.adminDemands || []).find(function (x) { return x.id === id; });
      var d = App.state.demands.find(function (x) { return x.id === id; });
      return (a && a.approvalStatus === 'Rejected') || (d && d.approvalStatus === 'Rejected');
    };
    var fullPaid = 0, pending = 0;
    Object.keys(perDemand).forEach(function (id) {
      var g = perDemand[id];
      if (g.bal > 0) fullPaid += g.adv + g.bal;                                  // advance + balance both paid
      else if (g.adv > 0 && !g.ref && !isRejected(id)) pending += Math.max(0, totalOf(id, g.adv) - g.adv);   // advance paid, balance still due
    });
    var rs = function (n) { return '\u20B9' + Number(n).toLocaleString('en-IN'); };
    var card = function (cls, icon, value, label) {
      return '<div class="stat-card ' + cls + '"><div class="stat-icon"><span class="material-icons">' + icon + '</span></div>'
        + '<div class="stat-info"><div class="value">' + value + '</div><div class="label">' + label + '</div></div></div>';
    };
    var typeBadge = function (t) {
      var c = t === 'Refund' ? 'badge-danger' : t === 'Balance (75%)' ? 'badge-success' : 'badge-info';
      return '<span class="badge ' + c + '">' + t + '</span>';
    };
    var opt = function (v, sel, label) { return '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + (label || v) + '</option>'; };
    var setF = function (k) { return 'App.state.payFilter.' + k + '=this.value;App.render()'; };
    var societies = (this.state.societies || []).map(function (s) { return opt(s.code, f.society, s.name + ' (' + s.code + ')'); }).join('');

    var body = rows.length === 0
      ? '<tr><td colspan="' + (isAdmin ? 9 : 8) + '" style="text-align:center;padding:40px;color:#9E9E9E;">No transactions found</td></tr>'
      : rows.map(function (p) {
        return '<tr>'
          + '<td><b>' + p.id + '</b></td>'
          + '<td>' + p.date + '</td>'
          + (isAdmin ? '<td><div style="font-weight:500;">' + p.society + '</div><div style="font-size:0.72rem;color:#9E9E9E;">' + p.socCode + '</div></td>' : '')
          + '<td>' + p.crop + '<div style="font-size:0.72rem;color:#9E9E9E;">' + p.variety + '</div></td>'
          + '<td>' + typeBadge(p.type) + '</td>'
          + '<td>' + p.mode + '</td>'
          + '<td style="font-weight:700;color:' + (p.type === 'Refund' ? '#C62828' : '#2E7D32') + ';">' + (p.type === 'Refund' ? '\u2212 ' : '') + rs(p.amount) + '</td>'
          + '<td><span class="badge badge-success">' + p.status + '</span></td>'
          + '<td><button class="btn btn-outline btn-sm" title="View Receipt" onclick="App.openPayReceipt(\'' + p.id + '\')"><span class="material-icons" style="font-size:14px;">receipt_long</span></button></td>'
          + '</tr>';
      }).join('');

    // Data for the Excel / PDF download (what is currently listed, with the summary boxes at the end).
    var exportKey = isAdmin ? 'admin-payments' : 'soc-payments';
    App._reportData = App._reportData || {};
    App._reportData[exportKey] = {
      title: isAdmin ? 'Payment Transactions' : 'Payment History',
      subtitle: 'Total Paid ' + rs(paid) + ' | Advance ' + rs(adv) + ' | Pending Balance ' + rs(pending) + ' | Full Paid ' + rs(fullPaid) + ' | Refunded ' + rs(ref),
      head: ['Application ID', 'Date'].concat(isAdmin ? ['Society'] : [], ['Crop', 'Variety', 'Type', 'Mode', 'Amount (Rs)', 'Status']),
      rows: rows.map(function (p) { return [p.id, p.date].concat(isAdmin ? [p.society + ' (' + p.socCode + ')'] : [], [p.crop, p.variety, p.type, p.mode, (p.type === 'Refund' ? '-' : '') + p.amount, p.status]); }),
      foot: []
    };
    return '<div class="page-header"><h1>' + (isAdmin ? 'Payment Transactions' : 'Payment History') + '</h1>'
      + '<p>' + (isAdmin ? 'All payments and refunds of every society' : 'All payments made by ' + MY_SOC.name + ' (' + MY_SOC.code + ')') + '</p></div>'
      + '<div class="stats-grid">'
      + card('', 'payments', rs(paid), 'Total Paid Amount')
      + card('blue', 'account_balance_wallet', rs(adv), 'Total Advance Paid Amount')
      + card('orange', 'pending_actions', rs(pending), 'Total Pending Balance Amount')
      + card('teal', 'task_alt', rs(fullPaid), 'Total Full Paid Amount')
      + card('red', 'currency_exchange', rs(ref), 'Total Refunded Amount')
      + '</div>'
      + '<div class="search-bar">'
      + '<div class="search-field"><label>Search</label><input class="form-control" placeholder="Application ID, Crop…" value="' + (f.search || '') + '" onchange="' + setF('search') + '"/></div>'
      + (isAdmin ? '<div class="search-field"><label>Society</label><select class="form-control" onchange="' + setF('society') + '">' + opt('', f.society, 'All Societies') + societies + '</select></div>' : '')
      + '<div class="search-field"><label>Payment Type</label><select class="form-control" onchange="' + setF('type') + '">' + opt('', f.type, 'All Types') + ['Advance (25%)', 'Balance (75%)', 'Refund'].map(function (t) { return opt(t, f.type); }).join('') + '</select></div>'
      + '<div class="search-field"><label>Payment Mode</label><select class="form-control" onchange="' + setF('mode') + '">' + opt('', f.mode, 'All Modes') + MODE_LIST.map(function (m) { return opt(m, f.mode); }).join('') + '</select></div>'
      + '<div class="search-field"><label>&nbsp;</label><button class="btn btn-gray btn-sm" onclick="App.state.payFilter={society:\'\',type:\'\',mode:\'\',search:\'\'};App.render()"><span class="material-icons">clear</span> Reset</button></div>'
      + '</div>'
      + '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><h3>Transactions <span style="color:#757575;font-weight:400;font-size:.85rem;">(' + rows.length + ' records)</span></h3>' + App.reportButtons(exportKey) + '</div>'
      + '<div class="card-body" style="padding:0;"><div class="table-wrap"><table><thead><tr>'
      + '<th>Application ID</th><th>Date</th>' + (isAdmin ? '<th>Society</th>' : '') + '<th>Crop / Variety</th><th>Type</th><th>Mode</th><th>Amount</th><th>Status</th><th>Receipt</th>'
      + '</tr></thead><tbody>' + body + '</tbody></table></div></div></div>'
      + (this.state.payReceiptId ? this.renderPayReceipt() : '');
  };

  // ── Receipt popup ──
  App.openPayReceipt = function (id) { this.state.payReceiptId = id; this.render(); };
  App.closePayReceipt = function () { this.state.payReceiptId = null; this.render(); };
  App.renderPayReceipt = function () {
    var id = this.state.payReceiptId;
    var p = this.state.payments.find(function (x) { return x.id === id; });
    if (!p) return '';
    var row = function (l, v) { return '<div class="invoice-row"><span class="label">' + l + '</span><span class="value">' + v + '</span></div>'; };
    return '<div class="modal-overlay" onclick="if(event.target===this)App.closePayReceipt()"><div class="modal-box" style="max-width:480px;">'
      + '<div class="modal-header"><h3>' + (p.type === 'Refund' ? 'Refund Receipt' : 'Payment Receipt') + '</h3><button class="modal-close" onclick="App.closePayReceipt()">\u2715</button></div>'
      + '<div class="modal-body">'
      + row('Application ID', '<b>' + p.id + '</b>')
      + row('Date', p.date)
      + row('Society', p.society + ' (' + p.socCode + ')')
      + row('Crop / Variety', p.crop + ' / ' + p.variety)
      + row('Payment Type', p.type)
      + row('Payment Mode', p.mode)
      + row('Amount', '<b style="color:' + (p.type === 'Refund' ? '#C62828' : '#2E7D32') + ';">\u20B9' + Number(p.amount).toLocaleString('en-IN') + '</b>')
      + row('Status', p.status)
      + '</div>'
      + '<div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;"><button class="btn btn-primary" onclick="window.print()"><span class="material-icons">print</span> Print</button>'
      + '<button class="btn btn-gray" onclick="App.closePayReceipt()">Close</button></div>'
      + '</div></div>';
  };

  // ── Router ──
  var _renderPage = App.renderPage.bind(App);
  App.renderPage = function () {
    var p = this.state.currentPage;
    if (p === 'soc-payments') return this.renderPayments(false);
    if (p === 'admin-payments') return this.renderPayments(true);
    return _renderPage();
  };

  // ── Header title ──
  var _renderHeader = App.renderHeader.bind(App);
  App.renderHeader = function () {
    var html = _renderHeader();
    var T = { 'soc-payments': 'Payment History', 'admin-payments': 'Payment Transactions' };
    var t = T[this.state.currentPage];
    return t ? html.replace(/<span class="header-title">.*?<\/span>/, '<span class="header-title">' + t + '</span>') : html;
  };

  // ── Sidebar items ──
  var navItem = function (icon, label, page, active) {
    return '<div class="nav-item' + (active ? ' active' : '') + '" onclick="App.navigate(\'' + page + '\')"><span class="material-icons">' + icon + '</span><span>' + label + '</span></div>';
  };
  var _socSidebar = App.renderSocietySidebar.bind(App);
  App.renderSocietySidebar = function () {
    var html = _socSidebar();
    var item = navItem('receipt_long', 'Payment History', 'soc-payments', this.state.currentPage === 'soc-payments');
    // Put it right after "Breeder Seed Demand" (Demand Management section).
    var re = /(<div class="nav-item[^"]*" onclick="App\.navigate\('raise-demand'\)">[\s\S]*?<\/div>)/;
    return re.test(html) ? html.replace(re, '$1' + item) : html;
  };
  var _adminSidebar = App.renderAdminSidebar.bind(App);
  App.renderAdminSidebar = function () {
    var html = _adminSidebar();
    var item = navItem('receipt_long', 'Payment Transactions', 'admin-payments', this.state.currentPage === 'admin-payments');
    // Put it right after "Demand Management".
    var re = /(<div class="nav-item[^"]*" onclick="App\.navigate\('admin-demands'\)">[\s\S]*?<\/div>)/;
    return re.test(html) ? html.replace(re, '$1' + item) : html;
  };

  // Filters / popup should not carry over between pages.
  var _navigate = App.navigate.bind(App);
  App.navigate = function (page) {
    if (page === 'soc-payments' || page === 'admin-payments') {
      this.state.payFilter = { society: '', type: '', mode: '', search: '' };
      this.state.payReceiptId = null;
    }
    return _navigate(page);
  };
}());
