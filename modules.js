// ============================================================
// BEEJ SANGH PROCUREMENT PORTAL
// Extension Module: Beej Price Management + Stock Management
// Extends App object — does NOT modify existing functionality
// ============================================================

// ── 1. INJECT NEW STATE ──────────────────────────────────────
(function injectState() {
  // Beej Price Management data
  App.state.beejPrices = [
    { id: 'PRC-001', category: 'Breeder Seed', crop: 'Wheat', variety: 'GW-322', seedClass: 'Foundation I', season: 'Rabi', cropYear: '2024-25', unit: 'Quintal', basePrice: 5200, subsidy: 800, sellingPrice: 4400, effectiveFrom: '2024-10-01', effectiveTo: '2025-03-31', status: 'Active', createdBy: 'Admin Sharma', remarks: 'Revised for Rabi 2024-25' },
    { id: 'PRC-002', category: 'Foundation Seed', crop: 'Soybean', variety: 'JS-335', seedClass: 'Certified', season: 'Kharif', cropYear: '2024-25', unit: 'Quintal', basePrice: 7800, subsidy: 1200, sellingPrice: 6600, effectiveFrom: '2024-06-01', effectiveTo: '2024-09-30', status: 'Expired', createdBy: 'Admin Sharma', remarks: '' },
    { id: 'PRC-003', category: 'Certified Seed', crop: 'Gram', variety: 'JG-315', seedClass: 'Foundation II', season: 'Rabi', cropYear: '2024-25', unit: 'Quintal', basePrice: 9200, subsidy: 1500, sellingPrice: 7700, effectiveFrom: '2024-11-01', effectiveTo: '2025-03-31', status: 'Active', createdBy: 'Dept User', remarks: 'New variety pricing' },
    { id: 'PRC-004', category: 'Breeder Seed', crop: 'Mustard', variety: 'Pusa Bold', seedClass: 'Breeder', season: 'Rabi', cropYear: '2024-25', unit: 'Quintal', basePrice: 8400, subsidy: 1000, sellingPrice: 7400, effectiveFrom: '2024-11-15', effectiveTo: '2025-02-28', status: 'Active', createdBy: 'Admin Sharma', remarks: '' },
    { id: 'PRC-005', category: 'Foundation Seed', crop: 'Paddy', variety: 'MTU-7029', seedClass: 'Foundation I', season: 'Kharif', cropYear: '2025-26', unit: 'Quintal', basePrice: 6500, subsidy: 900, sellingPrice: 5600, effectiveFrom: '2025-06-01', effectiveTo: '2025-09-30', status: 'Upcoming', createdBy: 'Dept User', remarks: 'Pre-approved for next Kharif' },
  ];

  App.state.priceHistory = [
    { priceId: 'PRC-001', oldPrice: 5000, newPrice: 5200, modifiedBy: 'Admin Sharma', modifiedDate: '2024-09-15', reason: 'Annual price revision as per department order' },
    { priceId: 'PRC-001', oldPrice: 4800, newPrice: 5000, modifiedBy: 'Admin Sharma', modifiedDate: '2024-04-01', reason: 'Kharif season adjustment' },
    { priceId: 'PRC-003', oldPrice: 9000, newPrice: 9200, modifiedBy: 'Dept User', modifiedDate: '2024-10-20', reason: 'Input cost increase' },
  ];

  App.state.priceAuditLog = [
    { action: 'Create', priceId: 'PRC-005', performedBy: 'Dept User', date: '2024-12-01', detail: 'New price created for Paddy MTU-7029' },
    { action: 'Update', priceId: 'PRC-001', performedBy: 'Admin Sharma', date: '2024-09-15', detail: 'Base price updated from ₹5000 to ₹5200' },
    { action: 'Publish', priceId: 'PRC-003', performedBy: 'Admin Sharma', date: '2024-11-01', detail: 'Price published and made active' },
    { action: 'Delete', priceId: 'PRC-OLD', performedBy: 'Admin Sharma', date: '2024-05-10', detail: 'Expired price record soft-deleted' },
  ];

  // Price form state
  App.state.priceForm = null;   // null = list view | 'add' | 'edit' | 'view' | 'history' | 'bulk' | 'audit'
  App.state.selectedPriceId = null;
  App.state.priceFilter = { season: '', crop: '', category: '', variety: '', status: '', search: '' };

  // Stock Management data
  App.state.stockItems = [
    { id: 'STK-001', category: 'Breeder Seed', crop: 'Wheat', variety: 'GW-322', seedClass: 'Foundation I', warehouse: 'Central Warehouse, Bhopal', lotNo: 'LOT-2024-W01', batchNo: 'BAT-001', available: 850, reserved: 200, damaged: 10, dispatched: 180, unit: 'Quintal', status: 'In Stock', updated: '2024-11-20', mfgDate: '2024-07-15', expiryDate: '2026-07-14', minQty: 100 },
    { id: 'STK-002', category: 'Foundation Seed', crop: 'Soybean', variety: 'JS-335', seedClass: 'Certified', warehouse: 'Divisional Store, Jabalpur', lotNo: 'LOT-2024-S01', batchNo: 'BAT-002', available: 320, reserved: 80, damaged: 5, dispatched: 120, unit: 'Quintal', status: 'Low Stock', updated: '2024-11-18', mfgDate: '2024-05-10', expiryDate: '2026-05-09', minQty: 350 },
    { id: 'STK-003', category: 'Certified Seed', crop: 'Gram', variety: 'JG-315', seedClass: 'Foundation II', warehouse: 'Regional Depot, Indore', lotNo: 'LOT-2024-G01', batchNo: 'BAT-003', available: 400, reserved: 100, damaged: 0, dispatched: 80, unit: 'Quintal', status: 'In Stock', updated: '2024-11-15', mfgDate: '2024-09-01', expiryDate: '2026-08-31', minQty: 150 },
    { id: 'STK-004', category: 'Breeder Seed', crop: 'Mustard', variety: 'Pusa Bold', seedClass: 'Breeder', warehouse: 'Central Warehouse, Bhopal', lotNo: 'LOT-2024-M01', batchNo: 'BAT-004', available: 0, reserved: 0, damaged: 20, dispatched: 40, unit: 'Quintal', status: 'Out of Stock', updated: '2024-11-22', mfgDate: '2024-08-20', expiryDate: '2026-08-19', minQty: 80 },
    { id: 'STK-005', category: 'Foundation Seed', crop: 'Paddy', variety: 'MTU-7029', seedClass: 'Foundation I', warehouse: 'Divisional Store, Jabalpur', lotNo: 'LOT-2024-P01', batchNo: 'BAT-005', available: 600, reserved: 150, damaged: 8, dispatched: 0, unit: 'Quintal', status: 'In Stock', updated: '2024-11-10', mfgDate: '2024-06-01', expiryDate: '2026-05-31', minQty: 200 },
  ];

  App.state.stockLedger = [
    { stockId: 'STK-001', date: '2024-07-20', txnType: 'Opening Balance', qty: +1200, balance: 1200, reference: 'OPEN-2024', narration: 'Season opening stock' },
    { stockId: 'STK-001', date: '2024-08-05', txnType: 'Received', qty: +200, balance: 1400, reference: 'GRN-001', narration: 'Stock received from IARI' },
    { stockId: 'STK-001', date: '2024-09-01', txnType: 'Reserved', qty: -200, balance: 1200, reference: 'DEM-2024-004', narration: 'Reserved for Sehora Kisan Sabha' },
    { stockId: 'STK-001', date: '2024-10-12', txnType: 'Dispatched', qty: -180, balance: 1020, reference: 'DO-2024-001', narration: 'Dispatched to Rampur Krishi Samiti' },
    { stockId: 'STK-001', date: '2024-11-01', txnType: 'Adjusted', qty: -10, balance: 1010, reference: 'ADJ-001', narration: 'Damaged stock write-off' },
    { stockId: 'STK-001', date: '2024-11-20', txnType: 'Closing Balance', qty: 0, balance: 850, reference: 'CLOSE-NOV', narration: 'Month-end closing balance' },
  ];

  App.state.stockAdjustments = [];
  App.state.stockTransfers = [
    { id: 'TRF-001', from: 'Central Warehouse, Bhopal', to: 'Regional Depot, Indore', crop: 'Wheat', variety: 'GW-322', qty: 100, date: '2024-10-05', status: 'Completed', approvedBy: 'Admin Sharma' },
    { id: 'TRF-002', from: 'Divisional Store, Jabalpur', to: 'Central Warehouse, Bhopal', crop: 'Soybean', variety: 'JS-335', qty: 50, date: '2024-11-15', status: 'Pending', approvedBy: '-' },
  ];

  // Stock UI state
  App.state.stockView = 'list';    // 'list' | 'entry' | 'adjust' | 'transfer' | 'ledger' | 'alerts' | 'reports'
  App.state.selectedStockId = null;
  App.state.stockFilter = { warehouse: '', crop: '', variety: '', status: '', search: '' };
  App.state.stockAlerts = App.state.stockItems.filter(s => s.available <= s.minQty).map(s => ({
    stockId: s.id, crop: s.crop, variety: s.variety, warehouse: s.warehouse,
    available: s.available, minQty: s.minQty, status: s.status
  }));
})();

// ── 2. EXTEND ADMIN SIDEBAR (patch renderAdminSidebar) ──────
(function patchAdminSidebar() {
  const _orig = App.renderAdminSidebar.bind(App);
  App.renderAdminSidebar = function () {
    const p = this.state.currentPage;
    const ni = (icon, label, page, sub = false) => `
      <div class="nav-item ${sub ? 'nav-sub-item' : ''} ${p === page ? 'active' : ''}" onclick="App.navigate('${page}')">
        <span class="material-icons">${icon}</span><span>${label}</span>
      </div>`;
    // Rebuild full sidebar with new sections injected
    return `
    <nav class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🏛️</div>
        <div class="logo-text"><h3>Beej Sangh Admin</h3><p>Admin Module</p></div>
      </div>
      <div class="sidebar-nav">
        <div class="nav-section">
          ${ni('dashboard', 'Dashboard', 'admin-dashboard')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Price &amp; Stock</div>
          ${ni('sell', 'Seeds Rate Management', 'admin-beej-price')}
          ${ni('warehouse', 'Stock Management', 'admin-stock-mgmt')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Management</div>
          ${ni('business', 'Society Management', 'admin-societies')}
          ${ni('receipt_long', 'Demand Management', 'admin-demands')}
          ${ni('local_shipping', 'Distribution', 'admin-distribution')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Distribution Workflow</div>
          ${ni('assignment_turned_in', 'Society Allocation', 'admin-society-allocation')}
          ${ni('local_shipping', 'Dispatch Orders', 'admin-dispatch-orders')}
          ${ni('track_changes', 'Distribution Tracking', 'admin-dist-tracking')}
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Reports &amp; Users</div>
          ${ni('bar_chart', 'Reports', 'admin-reports')}
          ${ni('manage_accounts', 'Users', 'profile')}
        </div>
      </div>
      <div class="sidebar-footer" onclick="App.logout()">
        <span class="material-icons">logout</span><span>Logout</span>
      </div>
    </nav>`;
  };
})();

// ── 3. EXTEND renderPage ROUTER ─────────────────────────────
(function patchRouter() {
  const _origRenderPage = App.renderPage.bind(App);
  App.renderPage = function () {
    const page = this.state.currentPage;
    switch (page) {
      // Beej Price Management
      case 'admin-beej-price': return this.renderBeejPriceDashboard();
      case 'admin-price-list': return this.renderPriceList();
      case 'admin-price-add': return this.renderPriceForm('add');
      case 'admin-price-edit': return this.renderPriceForm('edit');
      case 'admin-price-view': return this.renderPriceView();
      case 'admin-price-history': return this.renderPriceHistory();
      case 'admin-price-bulk': return this.renderPriceBulkUpload();
      case 'admin-price-audit': return this.renderPriceAuditLog();
      // Stock Management
      case 'admin-stock-mgmt': return this.renderStockDashboard();
      case 'admin-stock-list': return this.renderStockList();
      case 'admin-stock-entry': return this.renderStockEntry();
      case 'admin-stock-adjust': return this.renderStockAdjustment();
      case 'admin-stock-transfer': return this.renderStockTransfer();
      case 'admin-stock-ledger': return this.renderStockLedger();
      case 'admin-stock-alerts': return this.renderStockAlerts();
      case 'admin-stock-reports': return this.renderStockReports();
      default: return _origRenderPage();
    }
  };
})();

// ── 4. EXTEND renderHeader titles ───────────────────────────
(function patchHeader() {
  const _orig = App.renderHeader.bind(App);
  App.renderHeader = function () {
    const extra = {
      'admin-beej-price': 'Seeds Rate Management',
      'admin-price-list': 'Price List',
      'admin-price-add': 'Add New Price',
      'admin-price-edit': 'Edit Price',
      'admin-price-view': 'Price Details',
      'admin-price-history': 'Price History',
      'admin-price-bulk': 'Bulk Price Upload',
      'admin-price-audit': 'Price Audit Log',
      'admin-stock-mgmt': 'Stock Management',
      'admin-stock-list': 'Stock List',
      'admin-stock-entry': 'Stock Entry',
      'admin-stock-adjust': 'Stock Adjustment',
      'admin-stock-transfer': 'Stock Transfer',
      'admin-stock-ledger': 'Stock Ledger',
      'admin-stock-alerts': 'Low Stock Alerts',
      'admin-stock-reports': 'Stock Reports',
    };
    // Temporarily inject into titles map via override
    const origPage = this.state.currentPage;
    const html = _orig();
    // Replace title text if our page
    if (extra[origPage]) {
      return html.replace(
        /<span class="header-title">.*?<\/span>/,
        `<span class="header-title">${extra[origPage]}</span>`
      );
    }
    return html;
  };
})();

// ════════════════════════════════════════════════════════════
// MODULE 1 — BEEJ PRICE MANAGEMENT
// ════════════════════════════════════════════════════════════

// ── helpers shared across price pages ────────────────────────
App._priceBadge = function (status) {
  const map = { Active: 'badge-success', Expired: 'badge-danger', Upcoming: 'badge-info', Draft: 'badge-gray', Inactive: 'badge-warning' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
};

App._priceFiltered = function () {
  const f = this.state.priceFilter;
  return this.state.beejPrices.filter(p =>
    (!f.season || p.season === f.season) &&
    (!f.crop || p.crop === f.crop) &&
    (!f.category || p.category === f.category) &&
    (!f.variety || p.variety.toLowerCase().includes(f.variety.toLowerCase())) &&
    (!f.status || p.status === f.status) &&
    (!f.search || p.id.toLowerCase().includes(f.search.toLowerCase()) ||
      p.crop.toLowerCase().includes(f.search.toLowerCase()) ||
      p.variety.toLowerCase().includes(f.search.toLowerCase()))
  );
};

// ── 4a. Beej Price Dashboard ──────────────────────────────────
App.renderBeejPriceDashboard = function () {
  const prices = this.state.beejPrices;
  const active = prices.filter(p => p.status === 'Active').length;
  const upcoming = prices.filter(p => p.status === 'Upcoming').length;
  const expired = prices.filter(p => p.status === 'Expired').length;
  return `
  <div class="page-header">
    <h1>Seeds Rate Management</h1>
    <p>Manage breeder seed prices, revisions, and audit history</p>
  </div>
  </div>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
    <div class="card">
      <div class="card-header">
        <h3>Recent Price Entries</h3>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap"><table>
          <thead><tr><th>Price ID</th><th>Crop</th><th>Variety</th><th>Season</th><th>Selling Price</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${prices.slice(0, 5).map(p => `<tr>
              <td><b>${p.id}</b></td>
              <td>${p.crop}</td>
              <td>${p.variety}</td>
              <td>${p.season} ${p.cropYear}</td>
              <td style="font-weight:600;color:#2E7D32;">₹${p.sellingPrice.toLocaleString()}</td>
              <td>${this._priceBadge(p.status)}</td>
              <td><button class="btn btn-outline btn-sm" onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-view')"><span class="material-icons">visibility</span></button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Quick Actions</h3></div>
      <div class="card-body" style="display:grid;gap:10px;">
        <button class="btn btn-primary" onclick="App.navigate('admin-price-add')"><span class="material-icons">add_circle</span> Add New Price</button>
        <button class="btn btn-outline" onclick="App.navigate('admin-price-list')"><span class="material-icons">list</span> View Price List</button>
        <button class="btn btn-info" onclick="App.navigate('admin-price-bulk')"><span class="material-icons">upload_file</span> Bulk Upload</button>
        <button class="btn btn-gray" onclick="App.navigate('admin-price-audit')"><span class="material-icons">manage_search</span> Audit Log</button>
        <button class="btn btn-gray" onclick="App.navigate('admin-price-history')"><span class="material-icons">history</span> Price History</button>
      </div>
    </div>
  </div>
    </div>
  </div>`;
};

// ── 4b. Price List ────────────────────────────────────────────
App.renderPriceList = function () {
  const f = this.state.priceFilter;
  const rows = this._priceFiltered();
  return `
  <div class="page-header">
    <h1>Price List</h1>
    <p>All breeder seed prices with filters and export options</p>
  </div>
  <!-- Search & Filter Bar -->
  <div class="search-bar" style="margin-bottom:16px;">
    <div class="search-field">
      <label>Search</label>
      <input class="form-control" placeholder="Price ID, Crop, Variety…" value="${f.search}"
        oninput="App.state.priceFilter.search=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>Season</label>
      <select class="form-control" onchange="App.state.priceFilter.season=this.value;App.render()">
        <option value="">All Seasons</option>
        <option ${f.season === 'Kharif' ? 'selected' : ''}>Kharif</option>
        <option ${f.season === 'Rabi' ? 'selected' : ''}>Rabi</option>
        <option ${f.season === 'Summer' ? 'selected' : ''}>Summer</option>
      </select>
    </div>
    <div class="search-field">
      <label>Crop</label>
      <select class="form-control" onchange="App.state.priceFilter.crop=this.value;App.render()">
        <option value="">All Crops</option>
        ${['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy'].map(c => `<option ${f.crop === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>Status</label>
      <select class="form-control" onchange="App.state.priceFilter.status=this.value;App.render()">
        <option value="">All Status</option>
        ${['Active', 'Upcoming', 'Expired', 'Draft', 'Inactive'].map(s => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>&nbsp;</label>
      <button class="btn btn-gray btn-sm" onclick="App.state.priceFilter={season:'',crop:'',category:'',variety:'',status:'',search:''};App.render()">
        <span class="material-icons">clear</span> Reset
      </button>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Price Entries <span style="color:#757575;font-weight:400;font-size:0.85rem;">(${rows.length} records)</span></h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="App.navigate('admin-price-add')"><span class="material-icons">add</span> Add Price</button>
        <button class="btn btn-info btn-sm" onclick="App.navigate('admin-price-bulk')"><span class="material-icons">upload_file</span> Bulk Upload</button>
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Excel</button>
        <button class="btn btn-danger btn-sm"><span class="material-icons">picture_as_pdf</span> PDF</button>
        <button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Price ID</th><th>Category</th><th>Crop</th><th>Variety</th><th>Class</th>
          <th>Season</th><th>Unit</th><th>Base Price</th><th>Subsidy</th><th>Selling Price</th>
          <th>Effective From</th><th>Effective To</th><th>Status</th><th>Created By</th><th>Actions</th>
        </tr></thead>
        <tbody>
          ${rows.length === 0
      ? `<tr><td colspan="15" style="text-align:center;padding:40px;color:#9E9E9E;">No records found</td></tr>`
      : rows.map(p => `<tr>
            <td><b>${p.id}</b></td>
            <td>${p.category}</td>
            <td>${p.crop}</td>
            <td>${p.variety}</td>
            <td><span style="font-size:0.78rem;color:#555;">${p.seedClass}</span></td>
            <td>${p.season} ${p.cropYear}</td>
            <td>${p.unit}</td>
            <td>₹${p.basePrice.toLocaleString()}</td>
            <td style="color:#E65100;">₹${p.subsidy.toLocaleString()}</td>
            <td style="font-weight:700;color:#2E7D32;">₹${p.sellingPrice.toLocaleString()}</td>
            <td>${p.effectiveFrom}</td>
            <td>${p.effectiveTo}</td>
            <td>${this._priceBadge(p.status)}</td>
            <td style="font-size:0.8rem;">${p.createdBy}</td>
            <td>
              <div class="action-btns">
                <button class="btn btn-outline btn-sm" title="View"
                  onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-view')">
                  <span class="material-icons">visibility</span>
                </button>
                <button class="btn btn-warning btn-sm" title="Edit" ${p.status === 'Expired' ? 'disabled style="opacity:0.4"' : ''}
                  onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-edit')">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn btn-gray btn-sm" title="History"
                  onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-history')">
                  <span class="material-icons">history</span>
                </button>
                <button class="btn ${p.status === 'Active' ? 'btn-danger' : 'btn-success'} btn-sm" title="${p.status === 'Active' ? 'Deactivate' : 'Activate'}"
                  onclick="App.togglePriceStatus('${p.id}')">
                  <span class="material-icons">${p.status === 'Active' ? 'toggle_off' : 'toggle_on'}</span>
                </button>
                <button class="btn btn-danger btn-sm" title="Delete"
                  onclick="App.deletePrice('${p.id}')">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>
      <!-- Pagination placeholder -->
      <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E0E0E0;">
        <span style="font-size:0.82rem;color:#757575;">Showing ${rows.length} of ${this.state.beejPrices.length} records</span>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-gray btn-sm">‹ Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-gray btn-sm">Next ›</button>
        </div>
      </div>
    </div>
  </div>`;
};

App.togglePriceStatus = function (id) {
  const p = this.state.beejPrices.find(x => x.id === id);
  if (!p) return;
  const next = p.status === 'Active' ? 'Inactive' : 'Active';
  if (confirm(`${next === 'Inactive' ? 'Deactivate' : 'Activate'} price ${id}?`)) {
    p.status = next;
    this.state.priceAuditLog.unshift({ action: next === 'Active' ? 'Publish' : 'Update', priceId: id, performedBy: this.state.currentUser.name, date: new Date().toISOString().slice(0, 10), detail: `Status changed to ${next}` });
    this.render();
  }
};

App.deletePrice = function (id) {
  if (confirm(`Soft-delete price record ${id}? This cannot be undone.`)) {
    this.state.beejPrices = this.state.beejPrices.filter(p => p.id !== id);
    this.state.priceAuditLog.unshift({ action: 'Delete', priceId: id, performedBy: this.state.currentUser.name, date: new Date().toISOString().slice(0, 10), detail: `Price ${id} soft-deleted` });
    this.render();
  }
};

// ── 4c. Add / Edit Price Form ─────────────────────────────────
App.renderPriceForm = function (mode) {
  const isEdit = mode === 'edit';
  const p = isEdit ? this.state.beejPrices.find(x => x.id === this.state.selectedPriceId) : null;
  const v = (field, def = '') => p ? p[field] : def;
  const title = isEdit ? `Edit Price — ${p?.id}` : 'Add New Price';

  return `
  <div class="page-header">
    <h1>${title}</h1>
    <p>${isEdit ? 'Update price details. Editing is locked if procurement has started.' : 'Create a new seed price entry for a season.'}</p>
  </div>
  ${isEdit && p?.status === 'Expired' ? `
  <div class="alert alert-danger">
    <span class="material-icons">lock</span>
    <div>This price is <b>Expired</b>. Editing is not allowed. Price history is preserved for audit purposes.</div>
  </div>` : ''}
  <div class="card">
    <div class="card-body">
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">category</span> Seed Classification</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Seed Category <span style="color:#F44336">*</span></label>
            <select class="form-control" id="pf-category" ${isEdit && p?.status === 'Expired' ? 'disabled' : ''}>
              <option value="">Select Category</option>
              ${['Breeder Seed', 'Foundation Seed', 'Certified Seed'].map(c => `<option ${v('category') === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Crop <span style="color:#F44336">*</span></label>
            <select class="form-control" id="pf-crop" ${isEdit && p?.status === 'Expired' ? 'disabled' : ''}>
              <option value="">Select Crop</option>
              ${['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy', 'Maize'].map(c => `<option ${v('crop') === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Seed Variety <span style="color:#F44336">*</span></label>
            <input type="text" class="form-control" id="pf-variety" placeholder="e.g. GW-322" value="${v('variety')}">
          </div>
          <div class="form-group">
            <label>Seed Class <span style="color:#F44336">*</span></label>
            <select class="form-control" id="pf-class">
              <option value="">Select Class</option>
              ${['Breeder', 'Foundation I', 'Foundation II', 'Certified'].map(c => `<option ${v('seedClass') === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">event</span> Season &amp; Validity</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Season <span style="color:#F44336">*</span></label>
            <select class="form-control" id="pf-season">
              ${['Kharif', 'Rabi', 'Summer'].map(s => `<option ${v('season') === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Crop Year <span style="color:#F44336">*</span></label>
            <input type="text" class="form-control" id="pf-year" placeholder="e.g. 2024-25" value="${v('cropYear')}">
          </div>
          <div class="form-group">
            <label>Effective From <span style="color:#F44336">*</span></label>
            <input type="date" class="form-control" id="pf-from" value="${v('effectiveFrom')}">
          </div>
          <div class="form-group">
            <label>Effective To <span style="color:#F44336">*</span></label>
            <input type="date" class="form-control" id="pf-to" value="${v('effectiveTo')}">
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">currency_rupee</span> Pricing</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Unit <span style="color:#F44336">*</span></label>
            <select class="form-control" id="pf-unit">
              ${['Quintal', 'Kg', 'Bag (40Kg)', 'Bag (50Kg)'].map(u => `<option ${v('unit') === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Base Price (₹) <span style="color:#F44336">*</span></label>
            <input type="number" class="form-control" id="pf-base" placeholder="e.g. 5200" value="${v('basePrice')}"
              oninput="App._calcSellingPrice()">
          </div>
          <div class="form-group">
            <label>Subsidy (₹) <span style="color:#F44336">*</span></label>
            <input type="number" class="form-control" id="pf-subsidy" placeholder="e.g. 800" value="${v('subsidy')}"
              oninput="App._calcSellingPrice()">
          </div>
          <div class="form-group">
            <label>Selling Price (₹) <span style="color:#F44336">*</span></label>
            <input type="number" class="form-control" id="pf-selling" placeholder="Auto calculated" value="${v('sellingPrice')}"
              style="background:#f9fbe7;font-weight:600;" readonly>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">tune</span> Status &amp; Remarks</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Status</label>
            <select class="form-control" id="pf-status">
              ${['Draft', 'Active', 'Upcoming', 'Inactive'].map(s => `<option ${v('status') === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <label>Remarks</label>
            <textarea class="form-control" id="pf-remarks" rows="2" placeholder="Optional notes">${v('remarks')}</textarea>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-gray" onclick="App.navigate('admin-price-list')"><span class="material-icons">close</span> Cancel</button>
        <button class="btn btn-outline" onclick="App.savePriceForm('draft','${mode}')"><span class="material-icons">save</span> Save Draft</button>
        <button class="btn btn-primary" onclick="App.savePriceForm('publish','${mode}')"><span class="material-icons">publish</span> Publish</button>
      </div>
    </div>
  </div>`;
};

App._calcSellingPrice = function () {
  const base = parseFloat(document.getElementById('pf-base')?.value) || 0;
  const sub = parseFloat(document.getElementById('pf-subsidy')?.value) || 0;
  const sel = document.getElementById('pf-selling');
  if (sel) sel.value = Math.max(0, base - sub);
};

App.savePriceForm = function (action, mode) {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  const required = ['pf-category', 'pf-crop', 'pf-variety', 'pf-class', 'pf-season', 'pf-year', 'pf-base', 'pf-subsidy', 'pf-from', 'pf-to'];
  for (const id of required) {
    if (!get(id)) { alert('Please fill all required fields.'); document.getElementById(id)?.focus(); return; }
  }
  const newPrice = {
    id: mode === 'add' ? `PRC-${String(this.state.beejPrices.length + 1).padStart(3, '0')}` : this.state.selectedPriceId,
    category: get('pf-category'), crop: get('pf-crop'), variety: get('pf-variety'),
    seedClass: get('pf-class'), season: get('pf-season'), cropYear: get('pf-year'),
    unit: get('pf-unit'), basePrice: +get('pf-base'), subsidy: +get('pf-subsidy'),
    sellingPrice: +get('pf-selling'), effectiveFrom: get('pf-from'), effectiveTo: get('pf-to'),
    status: action === 'publish' ? 'Active' : 'Draft',
    createdBy: this.state.currentUser?.name || 'Admin',
    remarks: get('pf-remarks'),
  };
  if (mode === 'add') {
    this.state.beejPrices.unshift(newPrice);
    this.state.priceAuditLog.unshift({ action: action === 'publish' ? 'Publish' : 'Create', priceId: newPrice.id, performedBy: newPrice.createdBy, date: new Date().toISOString().slice(0, 10), detail: `Price created for ${newPrice.crop} ${newPrice.variety}` });
  } else {
    const idx = this.state.beejPrices.findIndex(p => p.id === this.state.selectedPriceId);
    if (idx > -1) { this.state.beejPrices[idx] = newPrice; }
    this.state.priceAuditLog.unshift({ action: 'Update', priceId: newPrice.id, performedBy: newPrice.createdBy, date: new Date().toISOString().slice(0, 10), detail: `Price updated — selling price ₹${newPrice.sellingPrice}` });
  }
  alert(`Price ${action === 'publish' ? 'published' : 'saved as draft'} successfully!`);
  this.navigate('admin-price-list');
};

// ── 4d. Price View (read-only) ────────────────────────────────
App.renderPriceView = function () {
  const p = this.state.beejPrices.find(x => x.id === this.state.selectedPriceId);
  if (!p) return '<p style="padding:24px">Price not found.</p>';
  const row = (label, value) => `<div class="invoice-row"><span class="label">${label}</span><span class="value">${value}</span></div>`;
  return `
  <div class="page-header">
    <h1>Price Details — ${p.id}</h1>
    <p>Read-only view of price record</p>
  </div>
  <div class="card" style="max-width:760px;">
    <div class="card-header">
      <h3>${p.crop} — ${p.variety}</h3>
      ${this._priceBadge(p.status)}
    </div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        <div>
          <p style="font-size:0.78rem;font-weight:600;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Seed Details</p>
          ${row('Price ID', `<b>${p.id}</b>`)}
          ${row('Seed Category', p.category)}
          ${row('Crop', p.crop)}
          ${row('Variety', p.variety)}
          ${row('Seed Class', p.seedClass)}
          ${row('Season', `${p.season} ${p.cropYear}`)}
          ${row('Unit', p.unit)}
        </div>
        <div>
          <p style="font-size:0.78rem;font-weight:600;color:#2E7D32;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Pricing</p>
          ${row('Base Price', `₹${p.basePrice.toLocaleString()}`)}
          ${row('Subsidy', `<span style="color:#E65100;">₹${p.subsidy.toLocaleString()}</span>`)}
          ${row('Selling Price', `<b style="color:#2E7D32;font-size:1.1rem;">₹${p.sellingPrice.toLocaleString()}</b>`)}
          ${row('Effective From', p.effectiveFrom)}
          ${row('Effective To', p.effectiveTo)}
          ${row('Created By', p.createdBy)}
          ${row('Remarks', p.remarks || '—')}
        </div>
      </div>
    </div>
    <div class="card-header" style="border-top:1px solid #E0E0E0;border-bottom:none;justify-content:flex-end;">
      <div style="display:flex;gap:8px;">
        <button class="btn btn-gray" onclick="App.navigate('admin-price-list')"><span class="material-icons">arrow_back</span> Back</button>
        <button class="btn btn-warning" onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-edit')"><span class="material-icons">edit</span> Edit</button>
        <button class="btn btn-outline" onclick="App.state.selectedPriceId='${p.id}';App.navigate('admin-price-history')"><span class="material-icons">history</span> History</button>
        <button class="btn btn-gray"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
  </div>`;
};

// ── 4e. Price History ─────────────────────────────────────────
App.renderPriceHistory = function () {
  const id = this.state.selectedPriceId;
  const p = this.state.beejPrices.find(x => x.id === id);
  const hist = this.state.priceHistory.filter(h => h.priceId === id);
  return `
  <div class="page-header">
    <h1>Price History — ${id}</h1>
    <p>${p ? `${p.crop} / ${p.variety} · ${p.season} ${p.cropYear}` : ''}</p>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Revision Log</h3>
      <button class="btn btn-gray btn-sm" onclick="App.navigate('admin-price-list')"><span class="material-icons">arrow_back</span> Back</button>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr><th>#</th><th>Old Price (₹)</th><th>New Price (₹)</th><th>Change</th><th>Modified By</th><th>Modified Date</th><th>Reason</th></tr></thead>
        <tbody>
          ${hist.length === 0
      ? `<tr><td colspan="7" style="text-align:center;padding:30px;color:#9E9E9E;">No revision history found</td></tr>`
      : hist.map((h, i) => `<tr>
              <td>${i + 1}</td>
              <td>₹${h.oldPrice.toLocaleString()}</td>
              <td style="font-weight:600;">₹${h.newPrice.toLocaleString()}</td>
              <td><span class="badge ${h.newPrice > h.oldPrice ? 'badge-danger' : 'badge-success'}">
                ${h.newPrice > h.oldPrice ? '▲' : '▼'} ₹${Math.abs(h.newPrice - h.oldPrice).toLocaleString()}
              </span></td>
              <td>${h.modifiedBy}</td>
              <td>${h.modifiedDate}</td>
              <td style="font-size:0.82rem;">${h.reason}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>
    </div>
  </div>`;
};

// ── 4f. Bulk Price Upload ─────────────────────────────────────
App.renderPriceBulkUpload = function () {
  return `
  <div class="page-header">
    <h1>Bulk Price Upload</h1>
    <p>Upload multiple price records via Excel template</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div class="card">
      <div class="card-header"><h3><span class="material-icons">upload_file</span> Upload Excel File</h3></div>
      <div class="card-body">
        <div class="upload-zone" style="margin-bottom:16px;">
          <span class="material-icons" style="font-size:48px;color:#4CAF50;">cloud_upload</span>
          <p>Drag &amp; drop Excel file here</p>
          <span>or click to browse (.xlsx, .xls)</span>
          <input type="file" accept=".xlsx,.xls" style="display:none" id="bulk-file">
        </div>
        <div class="alert alert-info">
          <span class="material-icons">info</span>
          <div>Use the sample template to ensure correct column format. Maximum 500 rows per upload.</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="alert('Downloading sample template…')">
            <span class="material-icons">download</span> Download Template
          </button>
          <button class="btn btn-primary" onclick="App._simulateBulkValidate()">
            <span class="material-icons">check_circle</span> Validate &amp; Preview
          </button>
        </div>
      </div>
    </div>
    <div class="card" id="bulk-preview-panel">
      <div class="card-header"><h3>Preview / Error Log</h3></div>
      <div class="card-body" style="padding:40px;text-align:center;color:#9E9E9E;">
        <span class="material-icons" style="font-size:40px;display:block;margin-bottom:8px;">table_chart</span>
        Upload a file to see preview here
      </div>
    </div>
  </div>`;
};

App._simulateBulkValidate = function () {
  const panel = document.getElementById('bulk-preview-panel');
  if (!panel) return;
  panel.innerHTML = `
  <div class="card-header"><h3>Preview (3 valid, 1 error)</h3></div>
  <div class="card-body" style="padding:0;">
    <div class="alert alert-warning" style="margin:12px;"><span class="material-icons">warning</span> 1 row has validation errors (Row 4 — missing Effective To date).</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Row</th><th>Crop</th><th>Variety</th><th>Base Price</th><th>Selling Price</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>2</td><td>Wheat</td><td>HD-2967</td><td>₹4,800</td><td>₹4,000</td><td><span class="badge badge-success">Valid</span></td></tr>
        <tr><td>3</td><td>Maize</td><td>HHM-3</td><td>₹3,200</td><td>₹2,600</td><td><span class="badge badge-success">Valid</span></td></tr>
        <tr><td>4</td><td>Paddy</td><td>IR-36</td><td>₹5,000</td><td>—</td><td><span class="badge badge-danger">Error</span></td></tr>
        <tr><td>5</td><td>Gram</td><td>JG-16</td><td>₹8,900</td><td>₹7,500</td><td><span class="badge badge-success">Valid</span></td></tr>
      </tbody>
    </table></div>
    <div style="padding:12px 16px;border-top:1px solid #E0E0E0;display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-gray btn-sm"><span class="material-icons">download</span> Error Log</button>
      <button class="btn btn-primary btn-sm" onclick="alert('3 valid records imported successfully!')"><span class="material-icons">publish</span> Import Valid Rows</button>
    </div>
  </div>`;
};

// ── 4g. Audit Log ─────────────────────────────────────────────
App.renderPriceAuditLog = function () {
  const logs = this.state.priceAuditLog;
  const actionBadge = a => ({ Create: 'badge-success', Update: 'badge-info', Delete: 'badge-danger', Publish: 'badge-warning' }[a] || 'badge-gray');
  return `
  <div class="page-header">
    <h1>Price Audit Log</h1>
    <p>Full audit trail for all price create, update, publish, and delete actions</p>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Audit Trail <span style="color:#757575;font-weight:400;font-size:0.85rem;">(${logs.length} entries)</span></h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Export</button>
        <button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr><th>#</th><th>Action</th><th>Price ID</th><th>Performed By</th><th>Date</th><th>Detail</th></tr></thead>
        <tbody>
          ${logs.map((l, i) => `<tr>
            <td>${i + 1}</td>
            <td><span class="badge ${actionBadge(l.action)}">${l.action}</span></td>
            <td><b>${l.priceId}</b></td>
            <td>${l.performedBy}</td>
            <td>${l.date}</td>
            <td style="font-size:0.82rem;color:#555;">${l.detail}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>
  </div>`;
};

// ════════════════════════════════════════════════════════════
// MODULE 2 — STOCK MANAGEMENT
// ════════════════════════════════════════════════════════════

App._stockBadge = function (status) {
  const map = { 'In Stock': 'badge-success', 'Low Stock': 'badge-warning', 'Out of Stock': 'badge-danger', 'Reserved': 'badge-info' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
};

App._stockFiltered = function () {
  const f = this.state.stockFilter;
  return this.state.stockItems.filter(s =>
    (!f.warehouse || s.warehouse.toLowerCase().includes(f.warehouse.toLowerCase())) &&
    (!f.crop || s.crop === f.crop) &&
    (!f.variety || s.variety.toLowerCase().includes(f.variety.toLowerCase())) &&
    (!f.status || s.status === f.status) &&
    (!f.search || s.id.toLowerCase().includes(f.search.toLowerCase()) ||
      s.crop.toLowerCase().includes(f.search.toLowerCase()) ||
      s.variety.toLowerCase().includes(f.search.toLowerCase()) ||
      s.lotNo.toLowerCase().includes(f.search.toLowerCase()))
  );
};

// ── 5a. Stock Dashboard ───────────────────────────────────────
App.renderStockDashboard = function () {
  const items = this.state.stockItems;
  const totalAvail = items.reduce((s, i) => s + i.available, 0);
  const totalRes = items.reduce((s, i) => s + i.reserved, 0);
  const totalDisp = items.reduce((s, i) => s + i.dispatched, 0);
  const lowStock = items.filter(i => i.status === 'Low Stock').length;
  const outOfStock = items.filter(i => i.status === 'Out of Stock').length;
  const totalDamaged = items.reduce((s, i) => s + i.damaged, 0);

  return `
  <div class="page-header">
    <h1>Stock Management</h1>
    <p>Monitor warehouse inventory, movements, and alerts</p>
  </div>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon"><span class="material-icons">warehouse</span></div>
      <div class="stat-info"><div class="value">${items.length}</div><div class="label">Total Stock Items</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><span class="material-icons">inventory</span></div>
      <div class="stat-info"><div class="value">${totalAvail.toLocaleString()} Qt</div><div class="label">Available Stock</div></div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon"><span class="material-icons">lock</span></div>
      <div class="stat-info"><div class="value">${totalRes} Qt</div><div class="label">Reserved Stock</div></div>
    </div>
    <div class="stat-card teal">
      <div class="stat-icon"><span class="material-icons">local_shipping</span></div>
      <div class="stat-info"><div class="value">${totalDisp} Qt</div><div class="label">Dispatched Stock</div></div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon"><span class="material-icons">warning</span></div>
      <div class="stat-info"><div class="value">${lowStock}</div><div class="label">Low Stock Items</div></div>
    </div>
    <div class="stat-card red">
      <div class="stat-icon"><span class="material-icons">remove_shopping_cart</span></div>
      <div class="stat-info"><div class="value">${outOfStock}</div><div class="label">Out of Stock</div></div>
    </div>
  </div>

  <!-- Stock Banner -->
  <div class="stock-banner" style="margin-bottom:20px;">
    <div class="stock-banner-item"><div class="sb-icon">📦</div><div class="sb-val">${(totalAvail + totalRes + totalDisp).toLocaleString()} Qt</div><div class="sb-label">Total Stock Ever</div></div>
    <div class="stock-banner-divider"></div>
    <div class="stock-banner-item"><div class="sb-icon">✅</div><div class="sb-val">${totalAvail} Qt</div><div class="sb-label">Available Now</div></div>
    <div class="stock-banner-divider"></div>
    <div class="stock-banner-item"><div class="sb-icon">🚚</div><div class="sb-val">${totalDisp} Qt</div><div class="sb-label">Dispatched</div></div>
    <div class="stock-banner-divider"></div>
    <div class="stock-banner-item"><div class="sb-icon">⚠️</div><div class="sb-val">${totalDamaged} Qt</div><div class="sb-label">Damaged</div></div>
  </div>

  <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
    <div class="card">
      <div class="card-header">
        <h3>Stock Summary by Crop</h3>
        <button class="btn btn-outline btn-sm" onclick="App.navigate('admin-stock-list')">View Full List</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap"><table>
          <thead><tr><th>Crop</th><th>Variety</th><th>Available</th><th>Reserved</th><th>Dispatched</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${items.map(s => `<tr>
              <td><b>${s.crop}</b></td>
              <td>${s.variety}</td>
              <td style="font-weight:600;color:#2E7D32;">${s.available} Qt</td>
              <td style="color:#1565C0;">${s.reserved} Qt</td>
              <td style="color:#757575;">${s.dispatched} Qt</td>
              <td>${this._stockBadge(s.status)}</td>
              <td><button class="btn btn-outline btn-sm" onclick="App.state.selectedStockId='${s.id}';App.navigate('admin-stock-ledger')">
                <span class="material-icons">receipt_long</span>
              </button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
    </div>
    <div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header"><h3>Quick Actions</h3></div>
        <div class="card-body" style="display:grid;gap:10px;">
          <button class="btn btn-primary" onclick="App.navigate('admin-stock-entry')"><span class="material-icons">add_box</span> Stock Entry</button>
          <button class="btn btn-warning" onclick="App.navigate('admin-stock-adjust')"><span class="material-icons">tune</span> Stock Adjustment</button>
          <button class="btn btn-info" onclick="App.navigate('admin-stock-transfer')"><span class="material-icons">swap_horiz</span> Stock Transfer</button>
          <button class="btn btn-outline" onclick="App.navigate('admin-stock-ledger')"><span class="material-icons">receipt_long</span> Stock Ledger</button>
          <button class="btn btn-danger" onclick="App.navigate('admin-stock-alerts')"><span class="material-icons">notifications_active</span> Alerts (${this.state.stockAlerts.length})</button>
          <button class="btn btn-gray" onclick="App.navigate('admin-stock-reports')"><span class="material-icons">bar_chart</span> Reports</button>
        </div>
      </div>
      ${this.state.stockAlerts.length > 0 ? `
      <div class="card">
        <div class="card-header"><h3 style="color:#E65100;">⚠️ Active Alerts</h3></div>
        <div class="card-body" style="padding:12px;">
          ${this.state.stockAlerts.map(a => `
          <div style="padding:8px 10px;background:${a.status === 'Out of Stock' ? '#FFEBEE' : '#FFF8E1'};border-radius:6px;margin-bottom:8px;font-size:0.82rem;">
            <b>${a.crop} – ${a.variety}</b><br>
            <span style="color:#757575;">${a.warehouse.split(',')[0]}</span><br>
            Available: <b style="color:${a.status === 'Out of Stock' ? '#C62828' : '#E65100'};">${a.available} Qt</b> / Min: ${a.minQty} Qt
          </div>`).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>`;
};

// ── 5b. Stock List ────────────────────────────────────────────
App.renderStockList = function () {
  const f = this.state.stockFilter;
  const rows = this._stockFiltered();
  return `
  <div class="page-header">
    <h1>Stock List</h1>
    <p>Complete inventory of all seed stock items across warehouses</p>
  </div>
  <div class="search-bar" style="margin-bottom:16px;">
    <div class="search-field">
      <label>Search</label>
      <input class="form-control" placeholder="ID, Crop, Lot No…" value="${f.search}"
        oninput="App.state.stockFilter.search=this.value;App.render()">
    </div>
    <div class="search-field">
      <label>Crop</label>
      <select class="form-control" onchange="App.state.stockFilter.crop=this.value;App.render()">
        <option value="">All Crops</option>
        ${['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy'].map(c => `<option ${f.crop === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>Status</label>
      <select class="form-control" onchange="App.state.stockFilter.status=this.value;App.render()">
        <option value="">All Status</option>
        ${['In Stock', 'Low Stock', 'Out of Stock'].map(s => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="search-field">
      <label>&nbsp;</label>
      <button class="btn btn-gray btn-sm" onclick="App.state.stockFilter={warehouse:'',crop:'',variety:'',status:'',search:''};App.render()">
        <span class="material-icons">clear</span> Reset
      </button>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Stock Items <span style="color:#757575;font-weight:400;font-size:0.85rem;">(${rows.length} records)</span></h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="App.navigate('admin-stock-entry')"><span class="material-icons">add</span> Stock Entry</button>
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Excel</button>
        <button class="btn btn-danger btn-sm"><span class="material-icons">picture_as_pdf</span> PDF</button>
        <button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Stock ID</th><th>Category</th><th>Crop</th><th>Variety</th><th>Class</th>
          <th>Warehouse</th><th>Lot No</th><th>Batch No</th>
          <th>Available</th><th>Reserved</th><th>Damaged</th><th>Dispatched</th>
          <th>Unit</th><th>Status</th><th>Updated</th><th>Actions</th>
        </tr></thead>
        <tbody>
          ${rows.length === 0
      ? `<tr><td colspan="16" style="text-align:center;padding:40px;color:#9E9E9E;">No stock records found</td></tr>`
      : rows.map(s => `<tr>
              <td><b>${s.id}</b></td>
              <td>${s.category}</td>
              <td>${s.crop}</td>
              <td>${s.variety}</td>
              <td><span style="font-size:0.78rem;color:#555;">${s.seedClass}</span></td>
              <td style="font-size:0.8rem;">${s.warehouse.split(',')[0]}</td>
              <td style="font-size:0.8rem;">${s.lotNo}</td>
              <td style="font-size:0.8rem;">${s.batchNo}</td>
              <td style="font-weight:700;color:${s.available > 0 ? '#2E7D32' : '#C62828'};">${s.available} ${s.unit}</td>
              <td style="color:#1565C0;">${s.reserved}</td>
              <td style="color:${s.damaged > 0 ? '#E65100' : '#757575'};">${s.damaged}</td>
              <td>${s.dispatched}</td>
              <td>${s.unit}</td>
              <td>${this._stockBadge(s.status)}</td>
              <td style="font-size:0.78rem;">${s.updated}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-outline btn-sm" title="View" onclick="App.state.selectedStockId='${s.id}';App.navigate('admin-stock-ledger')">
                    <span class="material-icons">receipt_long</span>
                  </button>
                  <button class="btn btn-warning btn-sm" title="Adjust" onclick="App.state.selectedStockId='${s.id}';App.navigate('admin-stock-adjust')">
                    <span class="material-icons">tune</span>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table></div>
      <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E0E0E0;">
        <span style="font-size:0.82rem;color:#757575;">Showing ${rows.length} of ${this.state.stockItems.length} records</span>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-gray btn-sm">‹ Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-gray btn-sm">Next ›</button>
        </div>
      </div>
    </div>
  </div>`;
};

// ── 5c. Stock Entry Form ──────────────────────────────────────
App.renderStockEntry = function () {
  return `
  <div class="page-header">
    <h1>Stock Entry</h1>
    <p>Add new seed stock to warehouse inventory</p>
  </div>
  <div class="card">
    <div class="card-body">
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">warehouse</span> Warehouse &amp; Classification</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Warehouse <span style="color:#F44336">*</span></label>
            <select class="form-control" id="se-warehouse">
              <option value="">Select Warehouse</option>
              <option>Central Warehouse, Bhopal</option>
              <option>Divisional Store, Jabalpur</option>
              <option>Regional Depot, Indore</option>
              <option>District Store, Chhindwara</option>
            </select>
          </div>
          <div class="form-group">
            <label>Seed Category <span style="color:#F44336">*</span></label>
            <select class="form-control" id="se-category">
              <option value="">Select Category</option>
              <option>Breeder Seed</option><option>Foundation Seed</option><option>Certified Seed</option>
            </select>
          </div>
          <div class="form-group">
            <label>Crop <span style="color:#F44336">*</span></label>
            <select class="form-control" id="se-crop">
              <option value="">Select Crop</option>
              ${['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy', 'Maize'].map(c => `<option>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Variety <span style="color:#F44336">*</span></label>
            <input type="text" class="form-control" id="se-variety" placeholder="e.g. GW-322">
          </div>
          <div class="form-group">
            <label>Seed Class <span style="color:#F44336">*</span></label>
            <select class="form-control" id="se-class">
              <option value="">Select Class</option>
              <option>Breeder</option><option>Foundation I</option><option>Foundation II</option><option>Certified</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">tag</span> Lot &amp; Batch Details</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Lot Number <span style="color:#F44336">*</span></label>
            <input type="text" class="form-control" id="se-lot" placeholder="e.g. LOT-2024-W02">
          </div>
          <div class="form-group">
            <label>Batch Number <span style="color:#F44336">*</span></label>
            <input type="text" class="form-control" id="se-batch" placeholder="e.g. BAT-006">
          </div>
          <div class="form-group">
            <label>Manufacturing Date</label>
            <input type="date" class="form-control" id="se-mfg">
          </div>
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="date" class="form-control" id="se-expiry">
          </div>
          <div class="form-group">
            <label>Storage Location</label>
            <input type="text" class="form-control" id="se-location" placeholder="e.g. Bay A, Rack 3">
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title"><span class="material-icons">scale</span> Quantity</div>
        <div class="form-grid">
          <div class="form-group">
            <label>Opening Stock <span style="color:#F44336">*</span></label>
            <input type="number" class="form-control" id="se-opening" placeholder="Quintal">
          </div>
          <div class="form-group">
            <label>Current Stock <span style="color:#F44336">*</span></label>
            <input type="number" class="form-control" id="se-current" placeholder="Quintal">
          </div>
          <div class="form-group">
            <label>Unit <span style="color:#F44336">*</span></label>
            <select class="form-control" id="se-unit">
              <option>Quintal</option><option>Kg</option><option>Bag (40Kg)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Minimum Stock Alert Qty</label>
            <input type="number" class="form-control" id="se-min" placeholder="Alert when stock falls below">
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <label>Remarks</label>
            <textarea class="form-control" id="se-remarks" rows="2" placeholder="Optional notes about this stock entry"></textarea>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-gray" onclick="App.navigate('admin-stock-list')"><span class="material-icons">close</span> Cancel</button>
        <button class="btn btn-primary" onclick="App.saveStockEntry()"><span class="material-icons">save</span> Save Stock Entry</button>
      </div>
    </div>
  </div>`;
};

App.saveStockEntry = function () {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  const required = ['se-warehouse', 'se-category', 'se-crop', 'se-variety', 'se-class', 'se-lot', 'se-batch', 'se-opening', 'se-current'];
  for (const id of required) {
    if (!get(id)) { alert('Please fill all required fields.'); document.getElementById(id)?.focus(); return; }
  }
  const newItem = {
    id: `STK-${String(this.state.stockItems.length + 1).padStart(3, '0')}`,
    category: get('se-category'), crop: get('se-crop'), variety: get('se-variety'),
    seedClass: get('se-class'), warehouse: get('se-warehouse'),
    lotNo: get('se-lot'), batchNo: get('se-batch'),
    available: +get('se-current'), reserved: 0, damaged: 0, dispatched: 0,
    unit: get('se-unit'), status: +get('se-current') > 0 ? 'In Stock' : 'Out of Stock',
    updated: new Date().toISOString().slice(0, 10),
    mfgDate: get('se-mfg'), expiryDate: get('se-expiry'),
    minQty: +get('se-min') || 0,
  };
  this.state.stockItems.unshift(newItem);
  // Add opening ledger entry
  this.state.stockLedger.unshift({ stockId: newItem.id, date: newItem.updated, txnType: 'Opening Balance', qty: +get('se-opening'), balance: +get('se-current'), reference: 'OPEN-NEW', narration: get('se-remarks') || 'New stock entry' });
  alert('Stock entry saved successfully!');
  this.navigate('admin-stock-list');
};

// ── 5d. Stock Adjustment ──────────────────────────────────────
App.renderStockAdjustment = function () {
  const sel = this.state.selectedStockId;
  const s = sel ? this.state.stockItems.find(x => x.id === sel) : null;
  return `
  <div class="page-header">
    <h1>Stock Adjustment</h1>
    <p>Increase, decrease or write off stock quantity with reason</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div class="card">
      <div class="card-header"><h3>Select Stock Item</h3></div>
      <div class="card-body">
        <div class="form-group">
          <label>Stock Item</label>
          <select class="form-control" onchange="App.state.selectedStockId=this.value;App.render()">
            <option value="">-- Select --</option>
            ${this.state.stockItems.map(i => `<option value="${i.id}" ${sel === i.id ? 'selected' : ''}>${i.id} — ${i.crop} ${i.variety}</option>`).join('')}
          </select>
        </div>
        ${s ? `
        <div style="background:#F9FBE7;border-radius:8px;padding:14px;font-size:0.85rem;margin-top:12px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div><span style="color:#757575;">Crop</span><br><b>${s.crop}</b></div>
            <div><span style="color:#757575;">Variety</span><br><b>${s.variety}</b></div>
            <div><span style="color:#757575;">Warehouse</span><br><b>${s.warehouse.split(',')[0]}</b></div>
            <div><span style="color:#757575;">Current Stock</span><br><b style="color:#2E7D32;">${s.available} ${s.unit}</b></div>
          </div>
        </div>` : ''}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Adjustment Details</h3></div>
      <div class="card-body">
        <div class="form-group">
          <label>Adjustment Type <span style="color:#F44336">*</span></label>
          <div style="display:flex;gap:10px;margin-top:4px;">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.88rem;">
              <input type="radio" name="adj-type" value="increase" checked> <span style="color:#2E7D32;font-weight:600;">▲ Increase Stock</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.88rem;">
              <input type="radio" name="adj-type" value="decrease"> <span style="color:#E65100;font-weight:600;">▼ Decrease Stock</span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>Quantity <span style="color:#F44336">*</span></label>
          <input type="number" class="form-control" id="adj-qty" placeholder="Enter quantity to adjust">
        </div>
        <div class="form-group">
          <label>Adjustment Reason <span style="color:#F44336">*</span></label>
          <select class="form-control" id="adj-reason">
            <option value="">Select Reason</option>
            <option>Physical Verification</option>
            <option>Damaged / Write-off</option>
            <option>Stock Return</option>
            <option>Data Correction</option>
            <option>Quality Rejection</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Remarks</label>
          <textarea class="form-control" id="adj-remarks" rows="2" placeholder="Additional notes"></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-gray" onclick="App.navigate('admin-stock-list')"><span class="material-icons">close</span> Cancel</button>
          <button class="btn btn-primary" onclick="App.saveAdjustment()"><span class="material-icons">tune</span> Apply Adjustment</button>
        </div>
      </div>
    </div>
  </div>`;
};

App.saveAdjustment = function () {
  const id = this.state.selectedStockId;
  const qty = parseFloat(document.getElementById('adj-qty')?.value) || 0;
  const type = document.querySelector('input[name="adj-type"]:checked')?.value;
  const reason = document.getElementById('adj-reason')?.value;
  if (!id) { alert('Please select a stock item.'); return; }
  if (!qty) { alert('Please enter a valid quantity.'); return; }
  if (!reason) { alert('Please select a reason.'); return; }

  const item = this.state.stockItems.find(s => s.id === id);
  if (!item) return;
  const delta = type === 'increase' ? +qty : -qty;
  const newQty = item.available + delta;
  if (newQty < 0) { alert('Adjustment would result in negative stock. Please check quantity.'); return; }

  item.available = newQty;
  item.status = newQty === 0 ? 'Out of Stock' : newQty <= item.minQty ? 'Low Stock' : 'In Stock';
  item.updated = new Date().toISOString().slice(0, 10);

  this.state.stockLedger.unshift({ stockId: id, date: item.updated, txnType: 'Adjusted', qty: delta, balance: newQty, reference: `ADJ-${Date.now()}`, narration: reason });
  alert(`Stock adjusted successfully! New balance: ${newQty} ${item.unit}`);
  this.state.selectedStockId = null;
  this.navigate('admin-stock-list');
};

// ── 5e. Stock Transfer ────────────────────────────────────────
App.renderStockTransfer = function () {
  const transfers = this.state.stockTransfers;
  return `
  <div class="page-header">
    <h1>Stock Transfer</h1>
    <p>Transfer stock between warehouses with approval workflow</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
    <div class="card">
      <div class="card-header"><h3>New Transfer Request</h3></div>
      <div class="card-body">
        <div class="form-group">
          <label>Transfer From <span style="color:#F44336">*</span></label>
          <select class="form-control" id="trf-from">
            <option value="">Select Source Warehouse</option>
            <option>Central Warehouse, Bhopal</option>
            <option>Divisional Store, Jabalpur</option>
            <option>Regional Depot, Indore</option>
          </select>
        </div>
        <div class="form-group">
          <label>Transfer To <span style="color:#F44336">*</span></label>
          <select class="form-control" id="trf-to">
            <option value="">Select Destination Warehouse</option>
            <option>Central Warehouse, Bhopal</option>
            <option>Divisional Store, Jabalpur</option>
            <option>Regional Depot, Indore</option>
            <option>District Store, Chhindwara</option>
          </select>
        </div>
        <div class="form-group">
          <label>Crop / Variety <span style="color:#F44336">*</span></label>
          <select class="form-control" id="trf-stock">
            <option value="">Select Stock Item</option>
            ${this.state.stockItems.map(s => `<option value="${s.id}">${s.crop} — ${s.variety} (${s.available} Qt available)</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Transfer Quantity (Quintal) <span style="color:#F44336">*</span></label>
          <input type="number" class="form-control" id="trf-qty" placeholder="Enter quantity">
        </div>
        <div class="form-group">
          <label>Transfer Date</label>
          <input type="date" class="form-control" id="trf-date" value="${new Date().toISOString().slice(0, 10)}">
        </div>
        <div class="form-group">
          <label>Remarks</label>
          <textarea class="form-control" id="trf-remarks" rows="2" placeholder="Reason for transfer"></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-gray" onclick="App.navigate('admin-stock-list')"><span class="material-icons">close</span> Cancel</button>
          <button class="btn btn-primary" onclick="App.saveTransfer()"><span class="material-icons">swap_horiz</span> Submit Transfer</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Transfer History</h3></div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrap"><table>
          <thead><tr><th>ID</th><th>From</th><th>To</th><th>Crop</th><th>Qty</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${transfers.map(t => `<tr>
              <td><b>${t.id}</b></td>
              <td style="font-size:0.78rem;">${t.from.split(',')[0]}</td>
              <td style="font-size:0.78rem;">${t.to.split(',')[0]}</td>
              <td>${t.crop} / ${t.variety}</td>
              <td>${t.qty} Qt</td>
              <td style="font-size:0.78rem;">${t.date}</td>
              <td><span class="badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'Pending' ? 'badge-warning' : 'badge-info'}">${t.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
    </div>
  </div>`;
};

App.saveTransfer = function () {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  if (!get('trf-from') || !get('trf-to') || !get('trf-stock') || !get('trf-qty')) {
    alert('Please fill all required fields.'); return;
  }
  if (get('trf-from') === get('trf-to')) { alert('Source and destination warehouse cannot be the same.'); return; }
  const stockItem = this.state.stockItems.find(s => s.id === get('trf-stock'));
  if (stockItem && +get('trf-qty') > stockItem.available) { alert(`Insufficient stock. Available: ${stockItem.available} Qt`); return; }
  this.state.stockTransfers.unshift({
    id: `TRF-${String(this.state.stockTransfers.length + 1).padStart(3, '0')}`,
    from: get('trf-from'), to: get('trf-to'),
    crop: stockItem?.crop || '-', variety: stockItem?.variety || '-',
    qty: +get('trf-qty'), date: get('trf-date'), status: 'Pending', approvedBy: '-',
  });
  alert('Transfer request submitted! Awaiting approval.');
  this.navigate('admin-stock-list');
};

// ── 5f. Stock Ledger ──────────────────────────────────────────
App.renderStockLedger = function () {
  const id = this.state.selectedStockId;
  const entries = id
    ? this.state.stockLedger.filter(l => l.stockId === id)
    : this.state.stockLedger;
  const item = id ? this.state.stockItems.find(s => s.id === id) : null;

  const txnColor = t => ({ 'Opening Balance': '#1565C0', 'Received': '#2E7D32', 'Transferred': '#E65100', 'Reserved': '#6A1B9A', 'Dispatched': '#757575', 'Returned': '#00695C', 'Adjusted': '#E65100', 'Closing Balance': '#1B5E20' }[t] || '#333');

  return `
  <div class="page-header">
    <h1>Stock Ledger</h1>
    <p>${item ? `${item.crop} — ${item.variety} | ${item.warehouse.split(',')[0]}` : 'All stock transactions'}</p>
  </div>
  ${item ? `
  <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));margin-bottom:20px;">
    <div class="stat-card"><div class="stat-icon"><span class="material-icons">inventory</span></div><div class="stat-info"><div class="value">${item.available} Qt</div><div class="label">Available</div></div></div>
    <div class="stat-card blue"><div class="stat-icon"><span class="material-icons">lock</span></div><div class="stat-info"><div class="value">${item.reserved} Qt</div><div class="label">Reserved</div></div></div>
    <div class="stat-card orange"><div class="stat-icon"><span class="material-icons">warning</span></div><div class="stat-info"><div class="value">${item.damaged} Qt</div><div class="label">Damaged</div></div></div>
    <div class="stat-card teal"><div class="stat-icon"><span class="material-icons">local_shipping</span></div><div class="stat-info"><div class="value">${item.dispatched} Qt</div><div class="label">Dispatched</div></div></div>
  </div>` : ''}

  <div class="card">
    <div class="card-header">
      <h3>Ledger Entries <span style="color:#757575;font-weight:400;font-size:0.85rem;">(${entries.length} transactions)</span></h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${id ? `<button class="btn btn-gray btn-sm" onclick="App.state.selectedStockId=null;App.render()"><span class="material-icons">list</span> All Items</button>` : ''}
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Export</button>
        <button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Date</th><th>Transaction Type</th><th>Stock ID</th><th>Quantity</th><th>Balance</th><th>Reference</th><th>Narration</th>
        </tr></thead>
        <tbody>
          ${entries.length === 0
      ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:#9E9E9E;">No ledger entries found</td></tr>`
      : entries.map(e => `<tr>
              <td>${e.date}</td>
              <td><b style="color:${txnColor(e.txnType)}">${e.txnType}</b></td>
              <td><b>${e.stockId}</b></td>
              <td style="font-weight:600;color:${e.qty > 0 ? '#2E7D32' : e.qty < 0 ? '#C62828' : '#757575'};">
                ${e.qty > 0 ? '+' : ''}${e.qty !== 0 ? e.qty + ' Qt' : '—'}
              </td>
              <td style="font-weight:700;">${e.balance} Qt</td>
              <td style="font-size:0.78rem;">${e.reference}</td>
              <td style="font-size:0.82rem;color:#555;">${e.narration}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>
    </div>
  </div>`;
};

// ── 5g. Low Stock Alerts ──────────────────────────────────────
App.renderStockAlerts = function () {
  const alerts = this.state.stockAlerts;
  return `
  <div class="page-header">
    <h1>Low Stock Alerts</h1>
    <p>Items at or below minimum stock threshold</p>
  </div>
  ${alerts.length === 0
      ? `<div class="alert alert-success"><span class="material-icons">check_circle</span><div>All stock items are above minimum threshold. No alerts at this time.</div></div>`
      : `
  <div class="alert alert-warning">
    <span class="material-icons">warning</span>
    <div><b>${alerts.length} alert(s)</b> require immediate attention. Review and reorder stock as necessary.</div>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Alert Items</h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="App.navigate('admin-stock-entry')"><span class="material-icons">add_box</span> Add Stock</button>
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Export</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr><th>Stock ID</th><th>Crop</th><th>Variety</th><th>Warehouse</th><th>Min Qty</th><th>Available</th><th>Deficit</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${alerts.map(a => `<tr>
            <td><b>${a.stockId}</b></td>
            <td>${a.crop}</td>
            <td>${a.variety}</td>
            <td style="font-size:0.8rem;">${a.warehouse.split(',')[0]}</td>
            <td>${a.minQty} Qt</td>
            <td style="font-weight:700;color:${a.available === 0 ? '#C62828' : '#E65100'};">${a.available} Qt</td>
            <td style="font-weight:600;color:#C62828;">${Math.max(0, a.minQty - a.available)} Qt</td>
            <td>${this._stockBadge(a.status)}</td>
            <td><button class="btn btn-warning btn-sm" onclick="App.state.selectedStockId='${a.stockId}';App.navigate('admin-stock-adjust')">
              <span class="material-icons">tune</span> Adjust
            </button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>
  </div>`}
  <div class="card" style="margin-top:16px;">
    <div class="card-header"><h3>Set Minimum Quantity</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;align-items:end;">
        <div class="form-group" style="margin:0;">
          <label>Stock Item</label>
          <select class="form-control" id="alert-stock">
            <option value="">-- Select --</option>
            ${this.state.stockItems.map(s => `<option value="${s.id}">${s.crop} — ${s.variety}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin:0;">
          <label>Min Qty (Quintal)</label>
          <input type="number" class="form-control" id="alert-min" placeholder="e.g. 100">
        </div>
        <button class="btn btn-primary" onclick="App.setMinQty()"><span class="material-icons">save</span> Save Alert Level</button>
      </div>
    </div>
  </div>`;
};

App.setMinQty = function () {
  const id = document.getElementById('alert-stock')?.value;
  const qty = parseFloat(document.getElementById('alert-min')?.value) || 0;
  if (!id || !qty) { alert('Please select a stock item and enter a valid quantity.'); return; }
  const item = this.state.stockItems.find(s => s.id === id);
  if (item) { item.minQty = qty; }
  this.state.stockAlerts = this.state.stockItems.filter(s => s.available <= s.minQty).map(s => ({
    stockId: s.id, crop: s.crop, variety: s.variety, warehouse: s.warehouse,
    available: s.available, minQty: s.minQty, status: s.status
  }));
  alert(`Minimum alert level set to ${qty} Qt for ${item?.crop} — ${item?.variety}`);
  this.render();
};

// ── 5h. Stock Reports ─────────────────────────────────────────
App.renderStockReports = function () {
  const items = this.state.stockItems;
  const cropGroups = ['Wheat', 'Soybean', 'Gram', 'Mustard', 'Paddy'];
  const warehouses = [...new Set(items.map(i => i.warehouse.split(',')[0]))];

  return `
  <div class="page-header">
    <h1>Stock Reports</h1>
    <p>Comprehensive stock analysis and export options</p>
  </div>
  <!-- Report Cards -->
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
    ${[
      { icon: 'inventory', label: 'Current Stock', color: '#2E7D32' },
      { icon: 'warehouse', label: 'Warehouse-wise', color: '#1565C0' },
      { icon: 'grass', label: 'Crop-wise Report', color: '#00695C' },
      { icon: 'eco', label: 'Variety-wise Report', color: '#6A1B9A' },
      { icon: 'calendar_month', label: 'Monthly Movement', color: '#E65100' },
      { icon: 'event_busy', label: 'Expiry Report', color: '#C62828' },
      { icon: 'history', label: 'Stock Aging', color: '#37474F' },
    ].map(r => `
    <div class="card" style="cursor:pointer;border-left:4px solid ${r.color};" onclick="alert('${r.label} report — Export feature coming soon.')">
      <div class="card-body" style="display:flex;align-items:center;gap:12px;padding:16px;">
        <div style="width:44px;height:44px;border-radius:10px;background:${r.color}20;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span class="material-icons" style="color:${r.color};font-size:22px;">${r.icon}</span>
        </div>
        <div>
          <div style="font-weight:600;font-size:0.88rem;">${r.label}</div>
          <div style="font-size:0.75rem;color:#757575;margin-top:2px;">View / Export</div>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <!-- Current Stock Summary -->
  <div class="card" style="margin-bottom:20px;">
    <div class="card-header">
      <h3>Current Stock Summary</h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-success btn-sm"><span class="material-icons">table_chart</span> Excel</button>
        <button class="btn btn-danger btn-sm"><span class="material-icons">picture_as_pdf</span> PDF</button>
        <button class="btn btn-gray btn-sm"><span class="material-icons">print</span> Print</button>
      </div>
    </div>
    <div class="card-body" style="padding:0;">
      <div class="table-wrap"><table>
        <thead><tr><th>Crop</th><th>Variety</th><th>Warehouse</th><th>Available</th><th>Reserved</th><th>Damaged</th><th>Dispatched</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          ${items.map(s => `<tr>
            <td><b>${s.crop}</b></td>
            <td>${s.variety}</td>
            <td style="font-size:0.8rem;">${s.warehouse.split(',')[0]}</td>
            <td style="font-weight:600;color:#2E7D32;">${s.available}</td>
            <td style="color:#1565C0;">${s.reserved}</td>
            <td style="color:${s.damaged > 0 ? '#E65100' : '#757575'};">${s.damaged}</td>
            <td>${s.dispatched}</td>
            <td style="font-weight:700;">${s.available + s.reserved + s.damaged + s.dispatched}</td>
            <td>${this._stockBadge(s.status)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr style="background:#E8F5E9;font-weight:700;">
            <td colspan="3">Total</td>
            <td>${items.reduce((s, i) => s + i.available, 0)} Qt</td>
            <td>${items.reduce((s, i) => s + i.reserved, 0)} Qt</td>
            <td>${items.reduce((s, i) => s + i.damaged, 0)} Qt</td>
            <td>${items.reduce((s, i) => s + i.dispatched, 0)} Qt</td>
            <td>${items.reduce((s, i) => s + i.available + i.reserved + i.damaged + i.dispatched, 0)} Qt</td>
            <td></td>
          </tr>
        </tfoot>
      </table></div>
    </div>
  </div>

  <!-- Crop-wise Bar Chart -->
  <div class="card">
    <div class="card-header"><h3>Crop-wise Available Stock</h3></div>
    <div class="card-body">
      ${cropGroups.map(crop => {
      const total = items.filter(s => s.crop === crop).reduce((s, i) => s + i.available, 0);
      const max = Math.max(...cropGroups.map(c => items.filter(s => s.crop === c).reduce((s, i) => s + i.available, 0)));
      const pct = max > 0 ? Math.round(total / max * 100) : 0;
      return `<div class="chart-bar-group" style="margin-bottom:10px;">
          <div class="chart-label">${crop}</div>
          <div class="chart-bar-bg"><div class="chart-bar" style="width:${pct}%"></div></div>
          <div class="chart-val">${total} Qt</div>
        </div>`;
    }).join('')}
    </div>
  </div>`;
};

// ── 5i. Refresh alerts when stock changes ─────────────────────
App._refreshAlerts = function () {
  this.state.stockAlerts = this.state.stockItems
    .filter(s => s.available <= s.minQty)
    .map(s => ({ stockId: s.id, crop: s.crop, variety: s.variety, warehouse: s.warehouse, available: s.available, minQty: s.minQty, status: s.status }));
};
