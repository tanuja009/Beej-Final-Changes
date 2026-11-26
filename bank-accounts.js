/**
 * BEEJ SANGH — SOCIETY BANK ACCOUNTS FOR DEMAND PAYMENT
 *
 * Society President flow (Demand Preview -> Payment):
 *  - Bank Details section above "Payment Now" with an "Add Account" option.
 *  - "Payment Now" stays disabled until at least one account is added.
 *  - With several accounts, clicking "Payment Now" asks the user to select one.
 *  - If the payment fails 3 times, the user is offered "Add Another Account"
 *    (or "Select Another Account") to retry.
 *
 * Wireframe note: there is no real gateway, so a small "Payment Gateway (Demo)"
 * popup lets the reviewer choose Success or Failure.
 */
'use strict';

if (!App.state.socBankAccounts) App.state.socBankAccounts = [];
App.state.bankUi = App.state.bankUi || { modal: null, pick: null, mode: 'pay' };
App.state.payAccountId = App.state.payAccountId || null;
App.state.payFailCount = App.state.payFailCount || 0;

// Bank / branch master for the dropdowns.
var BANK_LIST = {
  'State Bank of India': ['Bhopal Main Branch', 'Indore Main Branch', 'Jabalpur Main Branch', 'Chhindwara Branch', 'Seoni Branch'],
  'Punjab National Bank': ['Bhopal New Market', 'Indore Rajwada', 'Jabalpur Napier Town', 'Chhindwara Branch'],
  'Bank of Baroda': ['Bhopal MP Nagar', 'Indore Palasia', 'Jabalpur Wright Town', 'Seoni Branch'],
  'Bank of India': ['Bhopal Hamidia Road', 'Indore Main Branch', 'Jabalpur Main Branch'],
  'Central Bank of India': ['Bhopal Main Branch', 'Indore Main Branch', 'Chhindwara Branch'],
  'Union Bank of India': ['Bhopal Main Branch', 'Indore Main Branch', 'Jabalpur Main Branch'],
  'HDFC Bank': ['Bhopal Arera Colony', 'Indore Vijay Nagar', 'Jabalpur Napier Town'],
  'ICICI Bank': ['Bhopal MP Nagar', 'Indore Vijay Nagar', 'Jabalpur Civil Lines'],
  'Axis Bank': ['Bhopal Arera Colony', 'Indore Palasia', 'Jabalpur Wright Town'],
  'Madhya Pradesh Gramin Bank': ['Chhindwara Branch', 'Seoni Branch', 'Rampur Branch', 'Patan Branch'],
  'District Central Co-operative Bank': ['Chhindwara Branch', 'Seoni Branch', 'Rampur Branch']
};

var BK = {
  esc: function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
  mask: function (n) { n = String(n || ''); return 'XXXX XXXX ' + n.slice(-4); },
  accounts: function () { return App.state.socBankAccounts; },
  byId: function (id) { return App.state.socBankAccounts.filter(function (a) { return a.id === id; })[0]; },
  ui: function () { return App.state.bankUi; },
  selected: function () { return BK.byId(App.state.payAccountId); }
};

// ───────────── Modal shell ─────────────
BK.modal = function (title, body, footer, onClose) {
  return '<div class="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">'
    + '<div class="modal-box" style="background:#fff;border-radius:12px;max-width:520px;width:100%;overflow:hidden;max-height:calc(100vh - 32px);display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,0.3);">'
    + '<div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:16px 22px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">'
    + '<h3 style="margin:0;color:#fff;font-size:1.05rem;">' + title + '</h3>'
    + '<button onclick="' + onClose + '" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">&times;</button></div>'
    + '<div style="padding:22px;overflow-y:auto;flex:1 1 auto;min-height:0;">' + body + '</div>'
    + '<div style="padding:12px 22px 18px;display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;flex-shrink:0;border-top:1px solid #eee;">' + footer + '</div>'
    + '</div></div>';
};

BK.bankOpts = function (sel) {
  return '<option value="">Select Bank</option>' + Object.keys(BANK_LIST).map(function (b) { return '<option' + (b === sel ? ' selected' : '') + '>' + b + '</option>'; }).join('');
};
BK.branchOpts = function (bank) {
  return '<option value="">' + (bank ? 'Select Branch' : 'Select Bank first') + '</option>' + (BANK_LIST[bank] || []).map(function (b) { return '<option>' + b + '</option>'; }).join('');
};
// Branch list follows the chosen bank (updates only the branch dropdown, so typed values are kept).
App.bankOnBankChange = function (bank) {
  var el = document.getElementById('bk-branch');
  if (el) { el.innerHTML = BK.branchOpts(bank); el.disabled = !bank; el.value = ''; }
};

BK.accountCard = function (a, opts) {
  opts = opts || {};
  return '<div style="display:flex;align-items:center;gap:12px;border:1px solid ' + (opts.selected ? '#4CAF50' : '#E0E0E0') + ';background:' + (opts.selected ? '#F1F8E9' : '#fff') + ';border-radius:8px;padding:10px 12px;margin-bottom:8px;">'
    + (opts.radio ? '<input type="radio" name="bk-pick" ' + (opts.selected ? 'checked' : '') + ' onclick="App.bankPick(\'' + a.id + '\')" style="flex-shrink:0;">' : '<span class="material-icons" style="color:#2E7D32;">account_balance</span>')
    + '<div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:0.88rem;color:#1B5E20;">' + BK.esc(a.bank) + (a.branch ? ' <span style="font-weight:400;color:#757575;">· ' + BK.esc(a.branch) + '</span>' : '') + '</div>'
    + '<div style="font-size:0.78rem;color:#555;">' + 'A/c ' + BK.mask(a.accNo) + ' · IFSC ' + BK.esc(a.ifsc) + '</div></div>'
    + (opts.remove ? '<button class="btn btn-danger btn-sm" title="Remove" onclick="App.bankRemove(\'' + a.id + '\')"><span class="material-icons" style="font-size:14px;">delete</span></button>' : '')
    + '</div>';
};

// ───────────── Add account ─────────────
App.bankOpenAdd = function () { BK.ui().modal = 'add'; App.render(); };
App.bankCloseModal = function () { BK.ui().modal = null; App.render(); };

App.bankSaveAccount = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; };
  var bank = g('bk-bank'), branch = g('bk-branch'), acc = g('bk-acc'), acc2 = g('bk-acc2'), ifsc = g('bk-ifsc').toUpperCase();
  var err = '';
  if (!bank) err = 'Bank Name is required.';
  else if (!/^[0-9]{9,18}$/.test(acc)) err = 'Account Number must be 9 to 18 digits.';
  else if (acc !== acc2) err = 'Account Number and Confirm Account Number do not match.';
  else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) err = 'Enter a valid 11-character IFSC Code (e.g. SBIN0001234).';
  else if (BK.accounts().some(function (a) { return a.accNo === acc && a.ifsc === ifsc; })) err = 'This account is already added.';
  if (err) {
    var e = document.getElementById('bk-err');
    if (e) { e.textContent = err; e.style.display = 'block'; }
    return;
  }
  var n = BK.accounts().reduce(function (m, a) { return Math.max(m, parseInt(String(a.id).replace(/\D/g, ''), 10) || 0); }, 0) + 1;
  var rec = { id: 'ACC-' + n, bank: bank, branch: branch, accNo: acc, ifsc: ifsc };
  BK.accounts().push(rec);
  BK.ui().modal = null;
  // Adding while a payment is in progress (e.g. after failures) switches to the new account and resets the failure count.
  if (App.state.currentPage === 'payment') { App.state.payAccountId = rec.id; App.state.payFailCount = 0; }
  App.showToast('Bank account added.');
  App.render();
};

App.bankRemove = function (id) {
  App.state.socBankAccounts = BK.accounts().filter(function (a) { return a.id !== id; });
  if (App.state.payAccountId === id) App.state.payAccountId = null;
  App.showToast('Bank account removed.');
  App.render();
};

// ───────────── Select account ─────────────
App.bankPick = function (id) { BK.ui().pick = id; };
App.bankOpenSelect = function (mode) {
  BK.ui().mode = mode || 'pay';
  BK.ui().pick = App.state.payAccountId || (BK.accounts()[0] || {}).id || null;
  BK.ui().modal = 'select';
  App.render();
};
App.bankConfirmSelect = function () {
  var id = BK.ui().pick;
  if (!id || !BK.byId(id)) { App.showToast('Please select a bank account.'); return; }
  App.state.payAccountId = id;
  BK.ui().modal = null;
  if (BK.ui().mode === 'pay') { App.state.payFailCount = 0; App.navigate('payment'); }
  else { App.state.payFailCount = 0; App.render(); }
};

// "Payment Now" on the preview page.
App.bankPayNow = function () {
  var list = BK.accounts();
  if (!list.length) { App.showToast('Please add a bank account to continue.'); return; }
  App.state.payFailCount = 0;
  if (list.length === 1) { App.state.payAccountId = list[0].id; App.navigate('payment'); return; }
  App.bankOpenSelect('pay');
};

// ───────────── Payment gateway demo + failure handling ─────────────
var _origProcess = App.processPayment.bind(App);
App.processPayment = function () {
  if (!this.state.paymentMode) { this.showToast('Please select a payment mode'); return; }
  if (!BK.selected()) { this.showToast('Please select a bank account.'); return; }
  BK.ui().modal = 'gateway';
  this.render();
};
App.bankGatewayResult = function (ok) {
  if (ok) {
    BK.ui().modal = null;
    App.state.payFailCount = 0;
    _origProcess();
    return;
  }
  App.state.payFailCount = (App.state.payFailCount || 0) + 1;
  BK.ui().modal = App.state.payFailCount >= 3 ? 'failed3' : 'failed';
  App.render();
};
App.bankRetry = function () { BK.ui().modal = 'gateway'; App.render(); };

// ───────────── Modals HTML ─────────────
BK.modalsHtml = function () {
  var m = BK.ui().modal;
  if (!m) return '';
  var req = ' <span style="color:#F44336">*</span>';
  if (m === 'add') {
    var f = function (label, id, ph, extra, r) { return '<div class="form-group"><label>' + label + (r ? req : '') + '</label><input class="form-control" id="' + id + '" placeholder="' + ph + '" ' + (extra || '') + '></div>'; };
    var body = '<div class="form-grid">'
      + '<div class="form-group"><label>Bank Name' + req + '</label><select class="form-control" id="bk-bank" onchange="App.bankOnBankChange(this.value)">' + BK.bankOpts('') + '</select></div>'
      + '<div class="form-group"><label>Branch Name</label><select class="form-control" id="bk-branch" disabled>' + BK.branchOpts('') + '</select></div>'
      + f('IFSC Code', 'bk-ifsc', 'e.g. SBIN0001234', 'maxlength="11" style="text-transform:uppercase;"', true)
      + f('Account Number', 'bk-acc', '9 to 18 digits', 'inputmode="numeric" maxlength="18" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')"', true)
      + f('Confirm Account Number', 'bk-acc2', 'Re-enter account number', 'inputmode="numeric" maxlength="18" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')"', true)
      + '</div><div id="bk-err" style="display:none;color:#F44336;font-size:0.8rem;margin-top:6px;"></div>';
    return BK.modal(BK.accounts().length ? 'Add Another Account' : 'Add Bank Account', body,
      '<button class="btn btn-gray" onclick="App.bankCloseModal()">Cancel</button>'
      + '<button class="btn btn-primary" onclick="App.bankSaveAccount()"><span class="material-icons" style="font-size:16px;">save</span> Save Account</button>', 'App.bankCloseModal()');
  }
  if (m === 'select') {
    var list = BK.accounts().map(function (a) { return BK.accountCard(a, { radio: true, selected: BK.ui().pick === a.id }); }).join('');
    return BK.modal('Select Bank Account',
      '<p style="margin:0 0 12px;font-size:0.88rem;color:#555;">You have more than one account. Select the account to use for this payment.</p>' + list,
      '<button class="btn btn-gray" onclick="App.bankCloseModal()">Cancel</button>'
      + '<button class="btn btn-outline" onclick="App.bankOpenAdd()"><span class="material-icons" style="font-size:16px;">add</span> Add Another Account</button>'
      + '<button class="btn btn-primary" onclick="App.bankConfirmSelect()">Continue</button>', 'App.bankCloseModal()');
  }
  var acc = BK.selected();
  var accLine = acc ? '<div style="margin-top:12px;">' + BK.accountCard(acc) + '</div>' : '';
  if (m === 'gateway') {
    return BK.modal('Payment Gateway (Demo)',
      '<p style="margin:0;font-size:0.88rem;color:#555;">Wireframe only: choose the outcome of this payment attempt.</p>' + accLine,
      '<button class="btn btn-gray" onclick="App.bankCloseModal()">Cancel</button>'
      + '<button class="btn btn-danger" onclick="App.bankGatewayResult(false)"><span class="material-icons" style="font-size:16px;">error</span> Payment Failed</button>'
      + '<button class="btn btn-primary" onclick="App.bankGatewayResult(true)"><span class="material-icons" style="font-size:16px;">check_circle</span> Payment Successful</button>', 'App.bankCloseModal()');
  }
  if (m === 'failed') {
    return BK.modal('Payment Failed',
      '<p style="margin:0;font-size:0.9rem;color:#C62828;font-weight:600;">Payment could not be completed.</p>'
      + '<p style="margin:6px 0 0;font-size:0.85rem;color:#555;">Attempt ' + App.state.payFailCount + ' of 3. Please try again.</p>' + accLine,
      '<button class="btn btn-gray" onclick="App.bankCloseModal()">Close</button>'
      + '<button class="btn btn-primary" onclick="App.bankRetry()"><span class="material-icons" style="font-size:16px;">refresh</span> Try Again</button>', 'App.bankCloseModal()');
  }
  if (m === 'failed3') {
    return BK.modal('Payment Failed 3 Times',
      '<p style="margin:0;font-size:0.9rem;color:#C62828;font-weight:600;">Payment failed 3 times with this account.</p>'
      + '<p style="margin:6px 0 0;font-size:0.85rem;color:#555;">You can add another bank account' + (BK.accounts().length > 1 ? ' or select a different one' : '') + ' and try again.</p>' + accLine,
      '<button class="btn btn-gray" onclick="App.bankCloseModal()">Close</button>'
      + (BK.accounts().length > 1 ? '<button class="btn btn-outline" onclick="App.bankOpenSelect(\'switch\')">Select Another Account</button>' : '')
      + '<button class="btn btn-primary" onclick="App.bankOpenAdd()"><span class="material-icons" style="font-size:16px;">add</span> Add Another Account</button>', 'App.bankCloseModal()');
  }
  return '';
};

// ───────────── Demand Preview: Bank Details above "Payment Now" ─────────────
var _prevPreview = App.renderDemandPreview.bind(App);
App.renderDemandPreview = function () {
  var html = _prevPreview();
  var list = BK.accounts();
  var section = '<div class="card" style="margin-bottom:16px;"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><h3>Bank Details</h3>'
    + '<button class="btn btn-outline btn-sm" onclick="App.bankOpenAdd()"><span class="material-icons" style="font-size:16px;">add</span> Add Account</button></div><div class="card-body">'
    + (list.length
      ? list.map(function (a) { return BK.accountCard(a, { remove: true }); }).join('')
      + (list.length > 1 ? '<div style="font-size:0.78rem;color:#757575;">You will be asked to select an account when you click Payment Now.</div>' : '')
      : '<div style="color:#E65100;font-size:0.85rem;">No bank account added. Add at least one account to enable Payment Now.</div>')
    + '</div></div>';
  html = html.replace(/(<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">\s*<button class="btn btn-gray" onclick="App\.navigate\('raise-demand'\)">)/, section + '$1');
  html = html.replace(/<button class="btn btn-primary btn-lg" onclick="App\.navigate\('payment'\)">/,
    '<button class="btn btn-primary btn-lg" onclick="App.bankPayNow()"' + (list.length ? '' : ' disabled title="Add a bank account first" style="opacity:0.5;cursor:not-allowed;"') + '>');
  return html + BK.modalsHtml();
};

// ───────────── Payment page: show chosen account ─────────────
var _prevPayment = App.renderPayment.bind(App);
App.renderPayment = function () {
  var html = _prevPayment();
  var acc = BK.selected();
  var box = '<div class="card" style="margin-top:16px;"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><h3>Bank Account</h3>'
    + (BK.accounts().length > 1 ? '<button class="btn btn-outline btn-sm" onclick="App.bankOpenSelect(\'switch\')">Change Account</button>' : '')
    + '</div><div class="card-body">' + (acc ? BK.accountCard(acc, { selected: true }) : '<div style="color:#E65100;font-size:0.85rem;">No bank account selected. Go back and add one.</div>') + '</div></div>';
  html = html.replace('<div class="card" style="margin-top:16px;">\n        <div class="card-header"><h3>Select Payment Mode</h3>', box + '<div class="card" style="margin-top:16px;">\n        <div class="card-header"><h3>Select Payment Mode</h3>');
  return html + BK.modalsHtml();
};

// ───────────── Success page: show the account used ─────────────
var _prevSuccess = App.showPaymentSuccess.bind(App);
App.showPaymentSuccess = function (mode) {
  _prevSuccess(mode);
  var acc = BK.selected(), el = document.getElementById('app');
  if (acc && el && typeof el.innerHTML === 'string') {
    var row = '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#666;font-size:0.85rem;">Bank Account</span><span style="font-weight:600;font-size:0.85rem;">' + BK.esc(acc.bank) + ' · ' + BK.mask(acc.accNo) + '</span></div>';
    el.innerHTML = el.innerHTML.replace(/(Payment Mode<\/span>\s*<span[^>]*>[^<]*<\/span>\s*<\/div>)/, '$1' + row);
  }
};

console.log('[Bank Accounts] module loaded');
