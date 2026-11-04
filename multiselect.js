/**
 * BEEJ SANGH — SHARED VARIETY MULTI-SELECT (checkbox dropdown)
 * A reusable "multi-select with checkboxes" control used everywhere a form
 * lets the user pick one or more Varieties for a given Crop. One quantity /
 * rate / value entered on the form applies to ALL selected varieties; the
 * calling form is responsible for creating one record per selected variety
 * on save (see App.msValues()).
 *
 * Usage in a render() string:
 *   App.msRender('nd-variety', varietyOptionsArray, isDisabled, placeholder, onChangeFn)
 *
 * Usage on save:
 *   var varieties = App.msValues('nd-variety'); // array of selected names
 *   varieties.forEach(function (variety) { ...create one record... });
 *
 * The dropdown updates itself in place (only its own HTML is replaced) so
 * other inputs on the form keep whatever the user has typed.
 *
 * State: App.state._ms = { [key]: { open, selected[], options[], disabled, placeholder, onChange } }
 */
(function () {
  if (typeof App === 'undefined') return;
  App.state._ms = App.state._ms || {};

  // Ensure state exists for a key and refresh its option list. Previously
  // selected values that are no longer valid options are dropped (this is
  // what clears the selection when the Crop changes).
  App._msEnsure = function (key, options) {
    var st = this.state._ms[key];
    options = options || [];
    if (!st) {
      st = this.state._ms[key] = { open: false, selected: [], options: options };
    } else {
      st.options = options;
      st.selected = st.selected.filter(function (s) { return options.indexOf(s) !== -1; });
    }
    return st;
  };

  // Array of currently selected values for a multi-select key.
  App.msValues = function (key) {
    var st = this.state._ms[key];
    return st ? st.selected.slice() : [];
  };

  // Programmatically set the selection (e.g. when editing an existing record).
  App.msSetValues = function (key, values) {
    var st = this.state._ms[key] || (this.state._ms[key] = { open: false, selected: [], options: [] });
    st.selected = (values || []).slice();
  };

  // Forget a multi-select's state completely (call after a successful save).
  App.msReset = function (key) { delete this.state._ms[key]; };

  // Build the HTML for one multi-select from its stored state.
  App._msHtml = function (key) {
    var st = this.state._ms[key];
    if (!st) return '';
    var options = st.options, sel = st.selected, disabled = !!st.disabled;
    var summary;
    if (sel.length === 0) summary = disabled ? (st.placeholder || 'Select Crop first') : 'Select Variety';
    else if (sel.length === options.length && options.length > 1) summary = 'All Varieties (' + sel.length + ')';
    else summary = sel.join(', ');
    var allChecked = options.length > 0 && sel.length === options.length;
    var rows = options.map(function (o) {
      return '<label class="ms-option">'
        + '<input type="checkbox" value="' + o + '"' + (sel.indexOf(o) !== -1 ? ' checked' : '') + ' onchange="App.msToggleValue(\'' + key + '\',this.value)">'
        + '<span>' + o + '</span></label>';
    }).join('');
    var panel = '';
    if (st.open && !disabled) {
      panel = '<div class="ms-panel">'
        + (options.length === 0
          ? '<div class="ms-empty">No varieties available</div>'
          : '<label class="ms-option ms-select-all"><input type="checkbox"' + (allChecked ? ' checked' : '') + ' onchange="App.msToggleAll(\'' + key + '\')"><span>Select All</span></label>'
          + '<div class="ms-divider"></div>' + rows)
        + '</div>';
    }
    return '<div class="multi-select' + (disabled ? ' disabled' : '') + (st.open ? ' open' : '') + '" data-ms-key="' + key + '">'
      + '<div class="ms-control" role="button" aria-haspopup="true" aria-expanded="' + (st.open && !disabled ? 'true' : 'false') + '"'
      + (disabled ? ' aria-disabled="true" tabindex="-1" onclick=""' : ' tabindex="0" onclick="App.msToggleOpen(\'' + key + '\')" onkeydown="App.msKey(event,\'' + key + '\')"') + '>'
      + '<span class="ms-summary' + (sel.length === 0 ? ' placeholder' : '') + '">' + summary + '</span>'
      + '<span class="material-icons ms-caret">' + (st.open ? 'expand_less' : 'expand_more') + '</span>'
      + '</div>' + panel + '</div>';
  };

  // Replace just this control's HTML in the DOM (keeps other form inputs intact).
  App._msRefresh = function (key) {
    if (typeof document === 'undefined' || !document.querySelector) return;
    var el = document.querySelector('[data-ms-key="' + key + '"]');
    if (!el || el.outerHTML === undefined) return;
    // Remember the option list's scroll position so ticking a lower option doesn't jump back to the top.
    var oldPanel = el.querySelector ? el.querySelector('.ms-panel') : null;
    var top = oldPanel ? oldPanel.scrollTop : 0;
    el.outerHTML = this._msHtml(key);
    if (top) {
      var newPanel = document.querySelector('[data-ms-key="' + key + '"] .ms-panel');
      if (newPanel) newPanel.scrollTop = top;
    }
  };

  // Keyboard support for the closed control: Enter / Space toggles, Escape closes.
  App.msKey = function (e, key) {
    var st = this.state._ms[key];
    if (!st || !e) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.msToggleOpen(key); }
    else if (e.key === 'Escape' && st.open) { st.open = false; this._msRefresh(key); }
  };

  // Render the checkbox multi-select. `options` = variety names;
  // `disabled` greys it out (e.g. before a Crop is chosen);
  // `onChange(selectedArray)` is optional and fires after any selection change.
  App.msRender = function (key, options, disabled, placeholderWhenDisabled, onChange) {
    var st = this._msEnsure(key, options || []);
    st.disabled = !!disabled;
    st.placeholder = placeholderWhenDisabled;
    st.onChange = typeof onChange === 'function' ? onChange : null;
    return this._msHtml(key);
  };

  App._msChanged = function (key) {
    var st = this.state._ms[key];
    this._msRefresh(key);
    if (st && st.onChange) st.onChange(st.selected.slice());
  };

  App.msToggleOpen = function (key) {
    var st = this.state._ms[key];
    if (!st) return;
    var self = this;
    Object.keys(this.state._ms).forEach(function (k) {
      if (k !== key && self.state._ms[k].open) { self.state._ms[k].open = false; self._msRefresh(k); }
    });
    st.open = !st.open;
    this._msRefresh(key);
  };

  App.msToggleValue = function (key, value) {
    var st = this.state._ms[key];
    if (!st) return;
    var i = st.selected.indexOf(value);
    if (i === -1) st.selected.push(value); else st.selected.splice(i, 1);
    // Keep selection in the same order as the option list.
    st.selected = st.options.filter(function (o) { return st.selected.indexOf(o) !== -1; });
    this._msChanged(key);
  };

  App.msToggleAll = function (key) {
    var st = this.state._ms[key];
    if (!st) return;
    st.selected = (st.selected.length === st.options.length) ? [] : st.options.slice();
    this._msChanged(key);
  };

  // Close all open dropdowns when clicking outside any multi-select.
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', function (e) {
      var t = e && e.target;
      if (t && t.closest && t.closest('.multi-select')) return;
      Object.keys(App.state._ms).forEach(function (k) {
        if (App.state._ms[k].open) { App.state._ms[k].open = false; App._msRefresh(k); }
      });
    }, true);
  }

  // ── Crop-wise variety source shared by all forms ──
  // Static list of well-known varieties per crop (same data the Raise Demand form always used)…
  App._cropVarietyMap = {
    'Wheat': ['GW-322', 'GW-496', 'HD-2967', 'K-307', 'HD-2733', 'HD-3086', 'PBW-343', 'DBW-17'],
    'Paddy (Rice)': ['IR-36', 'MTU-7029', 'Pusa Basmati-1121', 'Pusa-44', 'Swarna', 'IR-64', 'Samba Mahsuri'],
    'Maize': ['DHM-117', 'Vivek Hybrid-27', 'HQPM-1', 'Pro-311', 'Kaveri-50', 'DHM-121'],
    'Bajra (Pearl Millet)': ['HHB-67', 'HHB-197', 'Proagro-9444', 'RHB-177', 'GHB-558'],
    'Jowar (Sorghum)': ['CSH-16', 'CSV-15', 'M-35-1', 'SPV-462', 'Pusa Chari-6'],
    'Gram (Chickpea)': ['JG-315', 'JG-14', 'JAKI-9218', 'JG-16', 'BG-372', 'GNG-1581'],
    'Pigeon Pea (Arhar)': ['UPAS-120', 'Pusa-992', 'Asha (ICPL-87)', 'Narendra Arhar-1', 'BDN-711'],
    'Soybean': ['JS-335', 'NRC-37', 'JS-9560', 'JS-95-60', 'MACS-1407', 'PS-1092'],
    'Groundnut': ['TAG-24', 'TG-37A', 'Girnar-2', 'GG-20', 'ICGS-76'],
    'Mustard': ['Pusa Bold', 'RH-30', 'Varuna', 'Pusa Mustard-27', 'Kranti'],
    'Sunflower': ['KBSH-1', 'MSFH-17', 'PSH-569', 'CO-4', 'Phule Bhaskar'],
    'Cotton': ['Suraj (H-777)', 'H-1098', 'Bunny Bt', 'Ajeet-155', 'RCH-2'],
    'Sugarcane': ['CO-86032', 'CO-0238', 'CoJ-64', 'Co-98014', 'CO-0118'],
    'Moong (Green Gram)': ['K-851', 'IPM-2-3', 'HUM-1', 'Pusa-105', 'ML-613'],
    'Urad (Black Gram)': ['T-9', 'PU-31', 'Pant-U-19', 'IPU-94-1', 'Pusa-1003'],
    'Lentil (Masoor)': ['L-4076', 'PL-406', 'IPL-81', 'JL-3', 'Pusa-4'],
    'Barley': ['RD-2035', 'BH-393', 'K-603', 'PL-426', 'Jyoti'],
    'Oat': ['OS-6', 'Kent', 'UPO-94', 'Sabzar', 'HFO-114']
  };
  // Normalise crop names so "Paddy (Rice)", "Paddy" and "paddy" all match.
  App._cropKey = function (c) { return String(c || '').split('(')[0].trim().toLowerCase(); };
  // Variety names for a crop: the static list above plus any active varieties from the Variety Master.
  // Order: Variety Master entries first, then the rest, no duplicates.
  App.varietiesForCrop = function (crop) {
    var key = App._cropKey(crop);
    if (!key) return [];
    var out = [];
    var add = function (n) { if (n && out.indexOf(n) === -1) out.push(n); };
    var sm = App.state.sm;
    if (sm && sm.varieties) {
      sm.varieties.forEach(function (v) { if (v.status === 'Active' && App._cropKey(v.crop) === key) add(v.name); });
    }
    Object.keys(App._cropVarietyMap).forEach(function (k) { if (App._cropKey(k) === key) App._cropVarietyMap[k].forEach(add); });
    return out;
  };
  // Standard hint shown under every variety multi-select.
  App.msHint = function (text) {
    return '<div style="font-size:0.72rem;color:#757575;margin-top:4px;">' + (text || 'Select one or more varieties. Same values apply to each selected variety.') + '</div>';
  };

  // Selections should never leak between pages: clear them on navigation.
  var _navPrev = App.navigate.bind(App);
  App.navigate = function (page) {
    App.state._ms = {};
    return _navPrev(page);
  };
}());
