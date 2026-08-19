const tenants = [
  "SIER PUSPA UTAMA PT",
  "GREAT MICROTAMA ELECTRONICS INDONESIA, PT",
  "RAPID PLAST INDONESIA. PT",
  "CLASSIC AUTOMOTIVE MANUFACTURING. PT",
  "UNIVERSITAS MUHAMMADIYAH MALANG",
  "PRASAD SEEDS INDONESIA, PT",
  "HARIJANTO SANTOSO. TN",
  "KANTOR PELAYANAN BEA & CUKAI",
  "BANK MANDIRI PT",
  "BANK NEGARA INDONESIA (PERSERO) Tbk PT"
];

const lahanPenjualanRows = [
  { NO: 1, KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut", KATEGORI: "Commercial Land", SUB_KATEGORI: "Ijin Penggunaan Sebagian/Seluruh Lahan", KETERANGAN: "Ijin Penggunaan Sebagian/Seluruh Lahan", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 m²", TOTAL_HA: "0.00 Ha" },
  { NO: 2, KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut", KATEGORI: "Service", SUB_KATEGORI: "SPBU Berbek", KETERANGAN: "SPBU Berbek", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 m²", TOTAL_HA: "0.00 Ha" },
  { NO: 3, KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut", KATEGORI: "Commercial Building", SUB_KATEGORI: "Open Yard PIER", KETERANGAN: "Sewa Open Yard PIER (Kraton)", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "12,000 m²", TOTAL: "12,000 m²", TOTAL_HA: "1.20 Ha" },
  { NO: 4, KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut", KATEGORI: "PPTI", SUB_KATEGORI: "PPTI PIER I", KETERANGAN: "PPTI PIER I", SALEABLE: "3,010,000 m²", NON_SALEABLE: "1,290,000 m²", SPACE_RENT: "0 m²", TOTAL: "4,300,000 m²", TOTAL_HA: "430.00 Ha" },
  { NO: 5, KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut", KATEGORI: "PPTI", SUB_KATEGORI: "PPTI Rungkut", KETERANGAN: "PPTI Rungkut", SALEABLE: "1,715,000 m²", NON_SALEABLE: "735,000 m²", SPACE_RENT: "0 m²", TOTAL: "2,450,000 m²", TOTAL_HA: "245.00 Ha" }
];

const menu = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "tenant-menu", label: "Tenant", icon: "users", children: [
    { id: "tenant", label: "Daftar Tenant" },
    { id: "lahan", label: "Lahan" },
    { id: "kawasan", label: "Kawasan Industri" },
    { id: "master-usaha", label: "Jenis Usaha" }
  ] },
  { id: "kontrak", label: "Kontrak", icon: "file-text", children: [
    { id: "kontrak-tenant", label: "Daftar Kontrak" },
    { id: "proses-tagihan", label: "Proses Tagihan" },
    { id: "riwayat-kontrak", label: "Riwayat Kontrak" }
  ] },
  { id: "transaksi", label: "Keuangan", icon: "wallet-cards", children: [
    { id: "permohonan-invoice", label: "Permohonan Invoice" },
    { id: "invoice", label: "Invoice" },
    { id: "kwitansi", label: "Kwitansi" },
    { id: "tanda-terima", label: "Tanda Terima" },
    { id: "finance-control", label: "Finance Control" }
  ] },
  { id: "laporan", label: "Laporan", icon: "file-bar-chart", children: [
    { id: "laporan-lahan", label: "Laporan Lahan" },
    { id: "laporan-kontrak", label: "Laporan Kontrak" },
    { id: "laporan-invoice", label: "Laporan Invoice" },
    { id: "laporan-pembayaran", label: "Laporan Pembayaran" }
  ] },
  { id: "master-ppi", label: "Master PPI", icon: "clipboard-list", children: [
    { id: "ppi-customer", label: "Daftar Customer" },
    { id: "ppi-rekening", label: "Daftar Rekening" },
    { id: "ppi-pic", label: "PIC Direktorat" },
    { id: "ppi-pph", label: "Master PPH" },
    { id: "ppi-ppn", label: "Master PPN" }
  ] },
  { id: "pengaturan", label: "Pengaturan", icon: "database", children: [
    { id: "ppi-template", label: "User" },
    { id: "ppi-komponen", label: "Hak Akses" },
    { id: "master-utilitas", label: "Profil" },
    { id: "master-sdm", label: "Log Aktivitas" }
  ] }
];

let active = "dashboard";
let isAuthenticated = localStorage.getItem("tms-sier-auth") === "true";
const dashboardFilter = {
  from: "2025-01",
  to: "2026-06",
  area: "Semua Kawasan Industri"
};

function monthDistance(from, to) {
  const [fromYear, fromMonth] = String(from || "").split("-").map(Number);
  const [toYear, toMonth] = String(to || "").split("-").map(Number);
  if (!fromYear || !fromMonth || !toYear || !toMonth) return 18;
  return Math.max(1, (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1);
}

function getDashboardMetrics() {
  const months = monthDistance(dashboardFilter.from, dashboardFilter.to);
  const areaKey = dashboardFilter.area;
  const areaFactor = areaKey.includes("Surabaya") ? 1 : areaKey.includes("Semua") ? 1.08 : 0.72;
  const periodFactor = Math.max(.45, Math.min(1.18, months / 18));
  const tenant = Math.round(829 * areaFactor);
  const luas = (653.6 * areaFactor).toFixed(2);
  const terpakai = (Math.max(0.8, months * areaFactor * 1.72)).toFixed(2);
  const sisa = Math.max(0, Number(luas) - Number(terpakai)).toFixed(2);
  const riskFactor = Math.max(.55, Math.min(1.35, periodFactor * areaFactor));

  return {
    kpis: [
      ["Total Tenant", String(tenant), "building-2", "blue"],
      ["Luas Lahan", `${luas} Ha`, "map", "green"],
      ["Lahan Terpakai", `${terpakai} Ha`, "badge-check", "orange"],
      ["Sisa Lahan", `${sisa} Ha`, "pie-chart", "red"]
    ],
    warnings: [
      ["Kontrak hampir habis", String(Math.round(12 * riskFactor)), "Tenant perlu follow-up renewal", "contract", "calendar-clock"],
      ["Invoice overdue", String(Math.round(8 * riskFactor)), "Tagihan melewati jatuh tempo", "invoice", "receipt"],
      ["Dokumen belum lengkap", String(Math.round(5 * riskFactor)), "Legalitas tenant perlu dilengkapi", "document", "file-warning"],
      ["Lahan idle", String(Math.round(3 * riskFactor)), "Aset belum termonetisasi", "land", "map-pin"]
    ],
    utils: [["Listrik", Math.min(100, Math.round(85 * periodFactor)), "MWh"], ["Air Bersih", Math.min(100, Math.round(62 * periodFactor)), "m3"], ["Pengolahan Limbah", Math.min(100, Math.round(40 * periodFactor)), "L/s"], ["Telepon", Math.min(100, Math.round(95 * periodFactor)), "Line"], ["Gas", Math.min(100, Math.round(20 * periodFactor)), "MMBTU"], ["Internet", Math.min(100, Math.round(75 * periodFactor)), "Gbps"], ["Gudang", Math.min(100, Math.round(50 * areaFactor)), "Unit"], ["BBM", Math.min(100, Math.round(12 * periodFactor)), "KL"]],
    bbm: [3.2, 2.8, 4.1, 3.5, 2.9, 3.8].map(value => {
      const base = Math.min(5, Math.max(.4, +(value * periodFactor * areaFactor).toFixed(1)));
      return {
        solar: base,
        pertalite: Math.min(5, Math.max(.3, +(base * .72).toFixed(1))),
        pertamax: Math.min(5, Math.max(.3, +(base * .48).toFixed(1)))
      };
    })
  };
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function renderNav() {
  document.getElementById("nav").innerHTML = menu.map(item => {
  const open = item.children && item.children.some(child => child.id === active);
    if (!item.children) {
      return `<div class="nav-group"><button class="nav-item ${active === item.id ? "active" : ""}" data-route="${item.id}">${icon(item.icon)}<span>${item.label}</span></button></div>`;
    }
    return `<div class="nav-group ${open ? "open" : ""}">
      <button class="nav-item ${open ? "active" : ""}" data-toggle="${item.id}" data-collapsed-route="${item.children[0].id}" title="${item.label}">${icon(item.icon)}<span>${item.label}</span>${icon("chevron-down").replace("<i", "<i class='chev'")}</button>
      <div class="sub-list">${item.children.map(child => `<button class="sub-item ${active === child.id ? "active" : ""}" data-route="${child.id}">${child.label}</button>`).join("")}</div>
    </div>`;
  }).join("");
  bindNav();
  refreshIcons();
}

function bindNav() {
  document.querySelectorAll("[data-route]").forEach(btn => btn.onclick = () => {
    active = btn.dataset.route;
    document.body.classList.remove("menu-open");
    render();
  });
  document.querySelectorAll("[data-toggle]").forEach(btn => btn.onclick = () => {
    if (document.body.classList.contains("sidebar-collapsed")) {
      active = btn.dataset.collapsedRoute;
      document.body.classList.remove("menu-open");
      render();
      return;
    }
    btn.closest(".nav-group").classList.toggle("open");
  });
}

function field(label, html, required = false) {
  return `<div class="form-field"><label>${label}${required ? " <span class='required'>*</span>" : ""}</label>${html}</div>`;
}

function select(value = "Select value") {
  const options = [
    value,
    "- Semua Kawasan -",
    "PT Kawasan Industri Medan",
    "PT Kawasan Industri Makassar",
    "PT Kawasan Industri Wijayakusuma",
    "PT Kawasan Industri Terpadu Batang",
    "PT Kawasan Berikat Nusantara",
    "PT Jakarta Industrial Estate Pulogadung",
    "PT Surabaya Industrial Estate Rungkut",
    "- Semua Tenant -",
    "SIER PUSPA UTAMA PT"
  ].filter((item, index, list) => item && list.indexOf(item) === index);
  return `<div class="search-select" data-value="${value}">
    <button type="button" class="search-select-trigger"><span>${value}</span>${icon("chevron-down")}</button>
    <div class="search-select-menu">
      <input class="input search-select-input" aria-label="Cari pilihan" />
      <div class="search-select-options">${options.map(option => `<button type="button" class="search-select-option">${option}</button>`).join("")}</div>
    </div>
  </div>`;
}

function optionSelect(value, options) {
  const normalizedOptions = value === "Aktif" ? ["Aktif", "Tidak Aktif", ...options] : [value, ...options];
  const uniqueOptions = normalizedOptions.filter((item, index, list) => item && list.indexOf(item) === index);
  return `<div class="search-select" data-value="${value}">
    <button type="button" class="search-select-trigger"><span>${value}</span>${icon("chevron-down")}</button>
    <div class="search-select-menu">
      <input class="input search-select-input" aria-label="Cari pilihan" />
      <div class="search-select-options">${uniqueOptions.map(option => `<button type="button" class="search-select-option">${option}</button>`).join("")}</div>
    </div>
  </div>`;
}

function categoryBadge(category) {
  const tone = category.toLowerCase().replaceAll(" ", "-");
  return `<span class="category-badge ${tone}">${category}</span>`;
}

function warningBadge(type) {
  const labels = {
    none: ["Aman", "check-circle"],
    contract: ["Kontrak < 60 hari", "calendar-clock"],
    invoice: ["Invoice overdue", "receipt"],
    document: ["Dokumen belum lengkap", "file-warning"]
  };
  const [label, ico] = labels[type] || labels.none;
  return `<span class="warning-badge ${type}">${icon(ico)}${label}</span>`;
}

function contractPeriod(start, end) {
  if (!start && !end) return "";
  return `<span class="period-cell"><b>${start || "-"}</b><small>s.d. ${end || "-"}</small></span>`;
}

function updateStatus() {
  return `<div class="contract-status-cell"><span class='status lapsed'>LAPSED</span><button class="update-chip contract-update" title="Update tanggal selesai">${icon("calendar-plus")}Update</button></div>`;
}

function actions(buttons) {
  return `<div class="actions">${buttons.map(b => `<button class="btn ${b.kind || ""}" ${b.route ? `data-route-action="${b.route}"` : ""}>${b.icon ? icon(b.icon) : ""}${b.label}</button>`).join("")}</div>`;
}

function backLink(route, label = "Kembali") {
  return `<div class="form-nav"><button class="back-link" data-route-action="${route}">${icon("arrow-left")}${label}</button></div>`;
}

function cardHeader(title = "", buttons = []) {
  if (!title && !buttons.length) return "";
  return `<div class="card-top">${title ? `<h2>${title}</h2>` : "<span></span>"}${buttons.length ? actions(buttons) : ""}</div>`;
}

function pageIntro(parent, current, description) {
  const title = current ? `<span class="breadcrumb-parent">${parent}</span><span class="breadcrumb-separator">/</span><span>${current}</span>` : `<span>${parent}</span>`;
  return `<div class="page-intro"><div><h1 class="page-title">${title}</h1></div></div>`;
}

function wizardForm(id, backRoute, steps, saveId) {
  return `${backLink(backRoute)}
  <div class="card form-card wizard-form" data-wizard="${id}" data-back-route="${backRoute}">
    <div class="wizard-tabs">${steps.map((step, index) => `<button class="wizard-tab ${index === 0 ? "active" : ""}" data-step="${index}" ${index > 0 ? "disabled" : ""}><span>${index + 1}</span>${step.title}</button>`).join("")}</div>
    ${steps.map((step, index) => `<div class="wizard-panel ${index === 0 ? "active" : ""}" data-step-panel="${index}">${step.content}</div>`).join("")}
    <div class="form-actions wizard-actions">
      <button class="btn wizard-save" type="button" id="${saveId}">${icon("save")}Simpan</button>
      <button class="btn secondary wizard-next" type="button" disabled>${icon("arrow-right")}Berikutnya</button>
    </div>
  </div>`;
}

function inputField(label, placeholder, required = false, type = "text") {
  return field(label, `<input class="input" type="${type}" placeholder="${placeholder}" />`, required);
}

function readonlyInputField(label, value, required = false) {
  return field(label, `<input class="input" value="${value}" readonly />`, required);
}

function textareaField(label, placeholder, required = false) {
  return `<div class="form-field wide"><label>${label}${required ? " <span class='required'>*</span>" : ""}</label><textarea class="input textarea" placeholder="${placeholder}"></textarea></div>`;
}

function filterLine(content) {
  return `<div class="filter-line"><div class="filter-grid">${content}</div><div class="filter-spacer"></div></div>`;
}

function table(columns, rows, total = rows.length || 0, tableClass = "") {
  const compactEmpty = tableClass.includes("compact-empty");
  const plainEmpty = tableClass.includes("plain-empty");
  const body = rows.length
    ? rows.map((row, idx) => `<tr>${columns.map(col => `<td class="${tableCellClass(col)}" title="${cellTitle(row[col])}">${tableCellContent(col, row[col])}</td>`).join("")}</tr>`).join("")
    : `<tr><td class="empty ${compactEmpty ? "compact-empty-cell" : ""} ${plainEmpty ? "plain-empty-cell" : ""}" colspan="${columns.length}">
        ${plainEmpty ? "No matching records found" : `<div class="empty-state"><div class="empty-illustration"></div><b>Belum ada data</b><p>Gunakan filter pencarian atau tambahkan data baru untuk menampilkan informasi pada tabel ini.</p></div>`}
      </td></tr>`;
  return `<div class="table-toolbar">
    <div class="entries">Show <input class="input" value="10" aria-label="Jumlah entri" /> entries</div>
    <div class="search">Cari di tabel: <input class="input table-search" aria-label="Cari di tabel" /></div>
  </div>
  <div class="table-wrap ${tableClass}"><table><thead><tr>${columns.map(c => `<th class="${tableCellClass(c)}">${c.replaceAll("_", " ")}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>
  <div class="table-footer"><span>Showing ${rows.length ? "1 to " + rows.length : "0 to 0"} of ${total} entries</span><div class="pagination"><button class="page-btn" disabled>Previous</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn" ${total < 11 ? "disabled" : ""}>Next</button></div></div>`;
}

function lahanDetailTable(rows) {
  const headers = ["NO", "KATEGORI", "SUB KATEGORI", "KETERANGAN", "SALEABLE (M²)", "NON SALEABLE (M²)", "SPACE RENT", "TOTAL (M²)", "TOTAL (HA)", "KETERANGAN", "AKSI"];
  const body = rows.map(row => `<tr>
    <td class="col-no">${row.NO}</td>
    <td class="col-category">${row.KATEGORI}</td>
    <td class="col-text"><span class="cell-lines">${row.SUB_KATEGORI}</span></td>
    <td class="col-text"><span class="cell-lines">${row.KETERANGAN}</span></td>
    <td class="col-number">${row.SALEABLE}</td>
    <td class="col-number">${row.NON_SALEABLE}</td>
    <td class="col-number">${row.SPACE_RENT}</td>
    <td class="col-number"><span class="mini-pill">${row.TOTAL}</span></td>
    <td class="col-number"><span class="mini-pill">${row.TOTAL_HA}</span></td>
    <td class="col-text"><span class="cell-lines">${row.CATATAN}</span></td>
    <td class="col-center col-action">${actionButtons()}</td>
  </tr>`).join("");
  return `<div class="table-toolbar">
    <div class="entries">Show <input class="input" value="10" aria-label="Jumlah entri" /> entries</div>
    <div class="search">Search: <input class="input table-search" aria-label="Cari tabel" /></div>
  </div>
  <div class="table-wrap"><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>
  <div class="table-footer"><span>Showing 1 to 10 of 68 entries</span><div class="pagination"><button class="page-btn" disabled>Previous</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">4</button><button class="page-btn">5</button><button class="page-btn">6</button><button class="page-btn">7</button><button class="page-btn">Next</button></div></div>`;
}

function tableCellContent(column, value) {
  const content = value ?? "";
  if (/KETERANGAN|SUB_KATEGORI|KAWASAN_INDUSTRI|TGL_KONTRAK|NO_KONTRAK|NAMA_TENANT|NAMA_CUSTOMER|TGL_MULAI|TGL_SELESAI|TGL_INVOICE|PIC|UNTUK_PEMBAYARAN|PENERIMA|PENGIRIM/.test(column)) return `<span class="cell-lines">${content}</span>`;
  return content;
}

function cellTitle(value) {
  const text = String(value ?? "").replace(/<[^>]*>/g, "").replaceAll('"', "&quot;");
  return text;
}

function getRowData(button) {
  const row = button.closest("tr");
  const tableEl = button.closest("table");
  if (!row || !tableEl) return {};
  const headers = [...tableEl.querySelectorAll("thead th")].map(th => th.textContent.trim().replace(/\s+/g, "_"));
  return [...row.children].reduce((data, cell, index) => {
    const key = headers[index] || `COL_${index + 1}`;
    data[key] = cell.textContent.trim().replace(/\s+/g, " ");
    return data;
  }, {});
}

function firstRowValue(rowData, keys) {
  return keys.map(key => rowData[key]).find(value => value && !/^(AKTIF|NON AKTIF|DRAFT|ACTION|AKSI)$/i.test(value)) || "";
}

function tableCellClass(column) {
  if (column === "NO") return "col-no";
  if (/STATUS/.test(column)) return "col-center col-status";
  if (/ACTION|AKSI/.test(column)) return "col-center col-action";
  if (/KATEGORI/.test(column)) return "col-category";
  if (/SALEABLE|SPACE_RENT|TOTAL/.test(column)) return "col-number";
  if (/KAWASAN_INDUSTRI/.test(column)) return "col-area";
  if (/KETERANGAN|SUB_KATEGORI/.test(column)) return "col-text";
  return "";
}

function actionButtons(extra = false) {
  return `<div class="row-actions"><button class="square edit" title="Edit">${icon("pencil")}</button>${extra ? `<button class="square add" data-route-action="kontrak-tagihan" title="Tambah tagihan">${icon("plus")}</button>` : ""}<button class="square delete" title="Hapus">${icon("trash-2")}</button></div>`;
}

function routeActions(buttons) {
  return `<div class="row-actions">${buttons.map(button => `<button class="square ${button.kind}" ${button.route ? `data-route-action="${button.route}"` : ""} title="${button.title}">${icon(button.icon)}</button>`).join("")}</div>`;
}

function contractActions() {
  return routeActions([
    { kind: "view", icon: "eye", title: "Detail Kontrak", route: "kontrak-detail" },
    { kind: "edit", icon: "pencil", title: "Edit Kontrak", route: "kontrak-edit" },
    { kind: "add", icon: "plus", title: "Tambah tagihan", route: "kontrak-tagihan" },
    { kind: "delete", icon: "trash-2", title: "Hapus Kontrak" }
  ]);
}

function dashboard() {
  let kpis = [
    ["Total Tenant", "829 Tenant", "users", "blue"],
    ["Luas Lahan", "653.60 Ha", "map", "green"],
    ["Lahan Terpakai", "0.00 Ha", "badge-check", "orange"],
    ["Sisa Lahan", "652.50 Ha", "pie-chart", "red"]
  ];
  let warnings = [
    ["Kontrak hampir habis", "12", "Tenant perlu follow-up renewal", "contract", "calendar-clock"],
    ["Invoice overdue", "8", "Tagihan melewati jatuh tempo", "invoice", "receipt"],
    ["Dokumen belum lengkap", "5", "Legalitas tenant perlu dilengkapi", "document", "file-warning"],
    ["Lahan idle", "3", "Aset belum termonetisasi", "land", "map-pin"]
  ];
  const followUps = [
    ["BANK MANDIRI PT", "Invoice INV-2026-071 overdue 14 hari", "Keuangan", "Tinggi"],
    ["PRASAD SEEDS INDONESIA, PT", "Kontrak berakhir dalam 45 hari", "Kontrak", "Sedang"],
    ["RAPID PLAST INDONESIA. PT", "Dokumen NIB belum tervalidasi", "Legal", "Sedang"],
    ["Open Yard PIER", "Lahan idle perlu review harga sewa", "Lahan", "Rendah"]
  ];
  const riskTrend = [
    ["Jan", 10, 7, 4],
    ["Feb", 12, 8, 5],
    ["Mar", 9, 10, 5],
    ["Apr", 14, 9, 6],
    ["Mei", 13, 11, 7],
    ["Jun", 16, 8, 5],
    ["Jul", 12, 9, 5],
    ["Agu", 15, 8, 6]
  ];
  const donuts = [
    ["SDM Kawasan Industri", "265", [["Kontrak",160,"#286ee9"],["Tetap",75,"#12b6c9"],["Outsourcing",30,"#ff7a21"]]],
    ["SDM Tenant", "45", [["Kontrak",25,"#286ee9"],["Outsourcing",12,"#12b6c9"],["Tetap",8,"#45c5f4"]]],
    ["Grafik Usaha Tenant", "12", [["Kernel Crushing Plant",4,"#13aa7a"],["Logistik",3,"#ff7a21"],["Pertanian",3,"#286ee9"],["Perkebunan",2,"#12b6c9"]]]
  ];
  let utils = [["Listrik",85,"MWh"],["Air Bersih",62,"m3"],["Pengolahan Limbah",40,"L/s"],["Telepon",95,"Line"],["Gas",20,"MMBTU"],["Internet",75,"Gbps"],["Gudang",50,"Unit"],["BBM",0,"KL"]];
  const dashboardMetrics = getDashboardMetrics();
  kpis = dashboardMetrics.kpis;
  warnings = dashboardMetrics.warnings;
  utils = dashboardMetrics.utils;
  return `${pageIntro("Dashboard", "Utama", "Command center untuk pemantauan tenant, lahan, utilitas, dan operasional kawasan SIER.")}<section class="hero">
    <div class="hero-copy"><span class="eyebrow">SIER Tenant Management</span><h2>Dashboard Operasional Kawasan</h2><p>Pantau tenant, kontrak, lahan, penagihan, dan aktivitas kawasan industri dalam satu tampilan terpadu.</p><div class="hero-pills"><span>${icon("activity")}Live monitoring</span><span>${icon("shield-check")}Data tervalidasi</span><span>${icon("factory")}Industrial estate</span></div></div>
    <div class="hero-visual"><img class="hero-image" src="assets/hero-industrial-estate-final.png" alt="" /><div class="estate-card"><b>829</b><span>tenant aktif</span></div><div class="weather">${icon("sun")}<b>Surabaya, 31°C</b></div></div>
  </section>
  <section class="filter-panel">
    <label for="dashboardFrom">From</label><div class="date-chip"><input id="dashboardFrom" type="month" value="${dashboardFilter.from}" /></div>
    <label for="dashboardTo">To</label><div class="date-chip"><input id="dashboardTo" type="month" value="${dashboardFilter.to}" /></div>
    <div id="dashboardArea">${select(dashboardFilter.area)}</div>
    <button class="btn" id="dashboardSubmit">SUBMIT</button>
  </section>
  <section class="kpis">${kpis.map(([label,value,ico,tone]) => `<button class="card kpi modern kpi-action" data-dashboard-focus="${label}"><div><span>${label}</span><strong>${value}</strong></div><div class="kpi-icon ${tone}">${icon(ico)}</div></button>`).join("")}</section>
  <section class="warning-grid">${warnings.map(([title,total,desc,tone,ico]) => `<button class="card warning-card ${tone} warning-action" data-dashboard-focus="${title}"><div><span>${title}</span><strong>${total}</strong><small>${desc}</small></div><div class="warning-icon">${icon(ico)}</div></button>`).join("")}</section>
  <section class="risk-insight-grid">
    <div class="card risk-trend-card">
      <div class="card-heading"><div><h2>Trend Risiko Tenant</h2><p>Pergerakan risiko kontrak, tagihan, dan dokumen berdasarkan tahun.</p></div><div class="year-filter">${icon("calendar")}<select id="riskYearFilter" aria-label="Filter tahun"><option>2026</option><option>2025</option><option>2024</option></select></div></div>
      <div class="risk-summary"><button class="active" data-risk-filter="all">Semua Risiko</button><button data-risk-filter="contract">Kontrak</button><button data-risk-filter="invoice">Tagihan</button><button data-risk-filter="document">Dokumen</button><span>Total warning <i id="riskYearLabel">2026</i>: <b id="riskTotalLabel">96</b></span></div>
      <div class="risk-line-chart" id="riskLineChart" data-filter="all">
        <svg viewBox="0 0 760 220" role="img" aria-label="Trend risiko tenant">
          <polyline class="grid-line" points="36,42 728,42"></polyline><polyline class="grid-line" points="36,88 728,88"></polyline><polyline class="grid-line" points="36,134 728,134"></polyline><polyline class="grid-line" points="36,180 728,180"></polyline><text class="axis-label" x="10" y="46">16</text><text class="axis-label" x="10" y="92">12</text><text class="axis-label" x="10" y="138">8</text><text class="axis-label" x="10" y="184">4</text>
          <path class="area contract" d="M36 126 C76 116 95 112 134 108 C174 104 194 153 232 144 C272 134 290 88 330 84 C370 80 388 99 428 96 C468 92 488 65 526 60 C566 56 586 108 624 108 C664 108 690 80 728 72 L728 180 L36 180 Z"></path>
          <path class="area invoice" d="M36 150 C76 146 94 142 134 138 C174 134 192 112 232 114 C272 116 290 128 330 126 C370 124 388 104 428 102 C468 100 486 136 526 138 C566 140 586 126 624 126 C664 126 688 136 728 138 L728 180 L36 180 Z"></path>
          <path class="line contract" d="M36 126 C76 116 95 112 134 108 C174 104 194 153 232 144 C272 134 290 88 330 84 C370 80 388 99 428 96 C468 92 488 65 526 60 C566 56 586 108 624 108 C664 108 690 80 728 72"></path>
          <path class="line invoice" d="M36 150 C76 146 94 142 134 138 C174 134 192 112 232 114 C272 116 290 128 330 126 C370 124 388 104 428 102 C468 100 486 136 526 138 C566 140 586 126 624 126 C664 126 688 136 728 138"></path>
          <path class="line document" d="M36 174 C76 170 94 164 134 162 C174 160 192 164 232 162 C272 160 290 152 330 150 C370 148 388 140 428 138 C468 136 486 160 526 162 C566 164 586 164 624 162 C664 160 688 154 728 150"></path>
          <g class="points contract"><circle data-risk-point="Kontrak|Jan|9" cx="36" cy="126" r="5"></circle><circle data-risk-point="Kontrak|Feb|10" cx="134" cy="108" r="5"></circle><circle data-risk-point="Kontrak|Mar|7" cx="232" cy="144" r="5"></circle><circle data-risk-point="Kontrak|Apr|13" cx="330" cy="84" r="5"></circle><circle data-risk-point="Kontrak|Mei|12" cx="428" cy="96" r="5"></circle><circle data-risk-point="Kontrak|Jun|16" cx="526" cy="60" r="6"></circle><circle data-risk-point="Kontrak|Jul|10" cx="624" cy="108" r="5"></circle><circle data-risk-point="Kontrak|Agu|14" cx="728" cy="72" r="5"></circle></g>
          <g class="points invoice"><circle data-risk-point="Tagihan|Jan|7" cx="36" cy="150" r="5"></circle><circle data-risk-point="Tagihan|Feb|8" cx="134" cy="138" r="5"></circle><circle data-risk-point="Tagihan|Mar|10" cx="232" cy="114" r="5"></circle><circle data-risk-point="Tagihan|Apr|9" cx="330" cy="126" r="5"></circle><circle data-risk-point="Tagihan|Mei|11" cx="428" cy="102" r="5"></circle><circle data-risk-point="Tagihan|Jun|8" cx="526" cy="138" r="5"></circle><circle data-risk-point="Tagihan|Jul|9" cx="624" cy="126" r="5"></circle><circle data-risk-point="Tagihan|Agu|8" cx="728" cy="138" r="5"></circle></g>
          <g class="chart-callout" id="riskCallout"><path class="callout-pointer" d="M552 72 L542 82 L564 72 Z"></path><rect x="552" y="18" width="132" height="54" rx="10"></rect><text id="riskCalloutTitle" x="568" y="40"></text><text id="riskCalloutValue" x="568" y="58"></text></g>
          ${riskTrend.map(([month], index) => `<text x="${36 + index * 98}" y="207">${month}</text>`).join("")}
        </svg>
      </div>
      <div class="risk-legend"><span><i class="contract"></i>Kontrak</span><span><i class="invoice"></i>Tagihan</span><span><i class="document"></i>Dokumen</span></div>
    </div>
    <div class="card priority-card compact"><div class="card-heading"><div><h2>Prioritas Real Time</h2><p>Draft tindak lanjut terbaru dari early warning.</p></div><span class="live-chip">${icon("radio")}Live</span></div><div class="priority-ticker"><span></span><b>4 task aktif</b><small>Auto refresh 30 detik</small></div><div class="priority-list"><div class="priority-track">${[...followUps, ...followUps, ...followUps, ...followUps].map(([name,note,area,level], index) => `<div class="priority-row"><span class="priority-no">${String(index % followUps.length + 1).padStart(2, "0")}</span><i class="${level.toLowerCase()}"></i><div><b>${name}</b><span>${note}</span></div><em>${area}</em><strong class="${level.toLowerCase()}">${level}</strong></div>`).join("")}</div></div></div>
  </section>
  <section class="donut-grid">${donuts.map(([title,total,items], cardIndex) => `<div class="card donut-card" data-donut-card="${cardIndex}"><h2>${title}</h2><div class="donut-content"><button class="donut multi" data-dashboard-focus="${title}"><span><small>TOTAL ${title.includes("Usaha") ? "SEKTOR" : "SDM"}</small><b>${total}</b></span></button><div class="legend">${items.map(([n,v,c], itemIndex) => `<button data-donut-item="${cardIndex}-${itemIndex}" data-donut-label="${n}" data-donut-value="${v}" data-donut-color="${c}" data-donut-total="${total}"><i style="background:${c}"></i><span>${n}</span><b>${v}</b></button>`).join("")}</div></div><div class="donut-detail" aria-live="polite"><i></i><span>Pilih kategori</span><b>-</b></div></div>`).join("")}</section>
  <section class="lower-grid">
    <div class="card util-card"><div class="card-heading"><div><h2>Laporan Penggunaan Utilitas</h2><p>Data pemakaian & sisa kapasitas utilitas kawasan</p></div><div class="mini-legend"><i></i>Terpakai <i class="muted"></i>Tersedia</div></div>${utils.map(([n,p,u]) => `<button class="util-row" data-util-name="${n}" data-util-value="${p}"><b>${n}</b><div class="progress"><span style="width:${p}%"></span></div><strong>${p}%</strong><em>${u}</em></button>`).join("")}</div>
    <div class="card bbm-card"><div class="card-heading"><div><h2>Penggunaan BBM</h2><p>Total penggunaan BBM per kategori (0-5)</p></div><div class="mini-legend bbm-legend"><i class="solar"></i>Solar <i class="pertalite"></i>Pertalite <i class="pertamax"></i>Pertamax</div></div><div class="bar-chart">${dashboardMetrics.bbm.map((item,i) => `<button class="bar-col" data-bbm-month="${["Jan","Feb","Mar","Apr","Mei","Jun"][i]}" data-bbm-solar="${item.solar}" data-bbm-pertalite="${item.pertalite}" data-bbm-pertamax="${item.pertamax}"><div class="bar-group"><span class="solar" style="height:${item.solar/5*100}%"></span><span class="pertalite" style="height:${item.pertalite/5*100}%"></span><span class="pertamax" style="height:${item.pertamax/5*100}%"></span></div><b>${["Jan","Feb","Mar","Apr","Mei","Jun"][i]}</b><small>${item.solar}</small></button>`).join("")}</div><div class="bbm-detail" aria-live="polite"><b>Pilih bulan</b><span><i class="solar"></i>Solar <strong>-</strong></span><span><i class="pertalite"></i>Pertalite <strong>-</strong></span><span><i class="pertamax"></i>Pertamax <strong>-</strong></span></div></div>
  </section>`;
}

function tenantPage() {
  const warningTypes = ["none", "contract", "none", "invoice", "none", "document", "none", "invoice", "contract", "none"];
  const rows = tenants.map((name, i) => ({
    NO: i + 1,
    KODE_TENANT: `TNT-${String(i + 1).padStart(3, "0")}`,
    NAMA_TENANT: name,
    KAWASAN_INDUSTRI: "PT Surabaya Industrial Estate Rungkut",
    STATUS_TENANT: "<span class='status active'>AKTIF</span>",
    WARNING: warningBadge(warningTypes[i]),
    ACTION: routeActions([{ kind: "view", icon: "eye", title: "Detail Tenant", route: "tenant-detail" }, { kind: "edit", icon: "pencil", title: "Edit Tenant", route: "tenant-edit" }, { kind: "delete", icon: "trash-2", title: "Hapus Tenant" }])
  }));
  return `${pageIntro("Tenant", "Daftar Tenant", "Kelola daftar tenant, status operasional, dan akses aksi utama dari satu tabel.")}<div class="card">
    ${cardHeader("Daftar Tenant", [{ label: "Tambah Tenant", icon: "plus", route: "tenant-add" }])}
    ${filterLine(`${field("Kawasan Industri", select("- Semua Kawasan -"))}${field("Status Tenant", optionSelect("- Semua Status -", ["Aktif", "Tidak Aktif"]))}${actions([{ label: "Cari", icon: "search", kind: "secondary" }])}`)}
    <div class="divider"></div>${table(["NO","KODE_TENANT","NAMA_TENANT","KAWASAN_INDUSTRI","STATUS_TENANT","WARNING","ACTION"], rows, 829)}</div>`;
}

function tenantFormPage(mode = "Tambah") {
  const isDetail = mode === "Detail";
  const title = `${mode} Tenant`;
  const steps = [
    { title: "Identitas", content: `<div class="form-section">
        <div class="form-section-head"><span>${icon("id-card")}</span><div><h2>Identitas Tenant</h2><p>Informasi dasar perusahaan dan kode tenant.</p></div></div>
        <div class="tenant-form">
          <div class="npwp-field">${inputField("Nomor NPWP", "NPWP...", true)}<button class="btn npwp-search" title="Cari NPWP">${icon("search")}</button></div>
          ${inputField("Nama Tenant", "Nama Tenant...", true)}
          ${inputField("Singkatan Tenant", "Singkatan Tenant...", true)}
          ${inputField("Kode Tenant", "Kode Tenant...", true)}
          ${field("Jenis Badan Hukum", select("Select value"), true)}
          ${field("Kategori (Kontrak Tenant)", select("Select value"), true)}
        </div>
      </div>` },
    { title: "Legal & Kontak", content: `<div class="form-section">
        <div class="form-section-head"><span>${icon("phone")}</span><div><h2>Legal & Kontak</h2><p>Alamat, kontak perusahaan, dan detail operasional.</p></div></div>
        <div class="tenant-form">
          ${inputField("No Telepon / Fax Perusahaan", "No Telepon / Fax...", true)}
          ${inputField("Email Tenant", "Email Tenant...")}
          ${inputField("No Telepon Pimpinan", "No Telepon...", true)}
          ${inputField("Tahun Berdiri", "Tahun Berdiri...", true)}
          ${inputField("Tahun Beroperasi", "Tahun Beroperasi...")}
          ${inputField("Nomor Induk Berusaha (NIB)", "Nomor Induk Berusaha (NIB)...")}
          ${field("Tipe Tenant", select("Select value"), true)}
          ${field("Status Pemodalan", select("Select value"), true)}
          ${field("Jenis Kegiatan", select("Select value"))}
          ${field("Negara", select("Select value"), true)}
          ${textareaField("Alamat Perusahaan", "Alamat Perusahaan...", true)}
        </div>
      </div>` },
    { title: "Data Kawasan", content: `<div class="form-section">
        <div class="form-section-head"><span>${icon("map-pinned")}</span><div><h2>Data Kawasan</h2><p>Lokasi tenant di kawasan dan ukuran fasilitas.</p></div></div>
        <div class="tenant-form">
          ${field("Kode Kawasan", select("PT Surabaya Industrial Estate Rungkut"), true)}
          ${inputField("Alamat dalam kawasan", "Alamat Fasilitas Pabrik...")}
          ${inputField("Luas Bangunan", "Luas Bangunan...", true)}
          ${inputField("Luas Tanah", "Luas Tanah...", true)}
        </div>
      </div>` },
    { title: "Kepatuhan", content: `<div class="form-section">
        <div class="form-section-head"><span>${icon("shield-check")}</span><div><h2>Kepatuhan</h2><p>KBLI dan kewajiban dokumen lingkungan.</p></div></div>
        <div class="tenant-form">
          ${textareaField("Klasifikasi Buku Lapangan Usaha Indonesia (KBLI)", "Klasifikasi Buku Lapangan Usaha Indonesia (KBLI)...")}
          <div class="radio-field wide"><label>Apakah wajib mengisi RKL RPL? <span class="required">*</span></label><div><label><input type="radio" name="rkl" /> Wajib</label><label><input type="radio" name="rkl" /> Tidak Wajib</label></div></div>
        </div>
      </div>` }
  ];
  return `${pageIntro("Tenant", title, "Lengkapi identitas tenant, legalitas, kontak, kategori, dan informasi lahan dalam kawasan.")}
  <div class="tenant-form-layout single ${isDetail ? "detail-form" : ""}">
    ${isDetail ? `${backLink("tenant")}<div class="card form-card">${steps.map(step => step.content).join("")}</div>` : wizardForm("tenant", "tenant", steps, "saveTenant")}
  </div>`;
}

function tambahTenantPage() {
  return tenantFormPage("Tambah");
}

function kawasanPage() {
  const rows = [
    { NO: 1, NAMA: "PT Surabaya Industrial Estate Rungkut", NIK: "SIER", ALAMAT: "Jl. Rungkut Industri Raya No.10, Rungkut Tengah, Surabaya, Jawa Timur 60293", STATUS: "<span class='status active'>AKTIF</span>", ACTION: routeActions([{ kind: "view", icon: "eye", title: "Detail Kawasan", route: "kawasan-detail" }, { kind: "edit", icon: "pencil", title: "Edit Kawasan", route: "kawasan-edit" }, { kind: "delete", icon: "trash-2", title: "Hapus Kawasan" }]) }
  ];
  return `${pageIntro("Tenant", "Kawasan Industri", "Kelola data kawasan sebagai referensi tenant, lahan, kontrak, utilitas, pengurus, dan karyawan.")}<div class="card">${cardHeader("List Kawasan Industri", [{ label: "Tambah Kawasan", icon: "plus", route: "kawasan-add" }])}<div class="divider"></div>${table(["NO","NAMA","NIK","ALAMAT","STATUS","ACTION"], rows, 1)}</div>`;
}

function kawasanFormPage(mode = "Tambah") {
  const detailLahan = [
    { NO: 1, KATEGORI: "Commercial Land", SUB_KATEGORI: "Ijin Penggunaan Sebagian/Seluruh Lahan", KETERANGAN: "Ijin Penggunaan Sebagian/Seluruh Lahan", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "" },
    { NO: 2, KATEGORI: "Service", SUB_KATEGORI: "SPBU Berbek", KETERANGAN: "SPBU Berbek", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "SPBU Berbek" },
    { NO: 3, KATEGORI: "Service", SUB_KATEGORI: "SPBU Rungkut", KETERANGAN: "SPBU Rungkut", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "SPBU Rungkut" },
    { NO: 4, KATEGORI: "Service", SUB_KATEGORI: "Pengangkutan Sampah PIER", KETERANGAN: "Pengangkutan Sampah PIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "Pengangkutan Sampah PIER" },
    { NO: 5, KATEGORI: "Service", SUB_KATEGORI: "BPO PIER", KETERANGAN: "BPO PIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "BPO PIER" },
    { NO: 6, KATEGORI: "Service", SUB_KATEGORI: "BFU PIER", KETERANGAN: "BFU PIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "BFU PIER" },
    { NO: 7, KATEGORI: "Service", SUB_KATEGORI: "Pengangkutan Sampah SIER", KETERANGAN: "Pengangkutan Sampah SIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "Pengangkutan Sampah SIER" },
    { NO: 8, KATEGORI: "Service", SUB_KATEGORI: "BPO SIER", KETERANGAN: "BPO SIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "BPO SIER" },
    { NO: 9, KATEGORI: "Service", SUB_KATEGORI: "BFU SIER", KETERANGAN: "BFU SIER", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "BFU SIER" },
    { NO: 10, KATEGORI: "Service", SUB_KATEGORI: "Jasa Lain Logistik", KETERANGAN: "Jasa Lain Logistik", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", SPACE_RENT: "0 m2", TOTAL: "0 M2", TOTAL_HA: "0.00 HA", CATATAN: "Jasa Lain Logistik" }
  ];
  const pengurus = [
    { NO: 1, KODE_JABATAN: "Direktur", KODE_IDENTITAS: "Kartu Tanda Penduduk", NAMA_PENGURUS: "Lussi Erniawati", KODE_STATUS: "Kontrak", PERIODE: "2022-09-09 s.d. 2027-09-08", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus pengurus">${icon("trash-2")}</button></div>` },
    { NO: 2, KODE_JABATAN: "Direktur", KODE_IDENTITAS: "Kartu Tanda Penduduk", NAMA_PENGURUS: "Rizka Syafitri Siregar", KODE_STATUS: "Kontrak", PERIODE: "2021-03-26 s.d. 2026-03-25", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus pengurus">${icon("trash-2")}</button></div>` }
  ];
  const karyawan = [
    { NO: 1, STATUS_KARYAWAN: "Kontrak", JUMLAH: "67", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus karyawan">${icon("trash-2")}</button></div>` },
    { NO: 2, STATUS_KARYAWAN: "Tetap", JUMLAH: "198", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus karyawan">${icon("trash-2")}</button></div>` }
  ];
  const utilitas = [
    { NO: 1, KODE_UTILITAS: "Listrik", KAPASITAS: "10000 (Watt)", JUMLAH_PENGGUNAAN: "0 (Watt)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 2, KODE_UTILITAS: "Internet", KAPASITAS: "10000 (Gigabyte)", JUMLAH_PENGGUNAAN: "0 (Gigabyte)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 3, KODE_UTILITAS: "Gudang", KAPASITAS: "10 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 4, KODE_UTILITAS: "FO", KAPASITAS: "10000 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 5, KODE_UTILITAS: "Egate", KAPASITAS: "10000 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 6, KODE_UTILITAS: "Pengolahan Limbah", KAPASITAS: "10000 (Liter)", JUMLAH_PENGGUNAAN: "0 (Liter)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 7, KODE_UTILITAS: "Air Bersih", KAPASITAS: "10000 (Liter)", JUMLAH_PENGGUNAAN: "0 (Liter)", PERIODE: "2024", AKSI: actionButtons() }
  ];
  const steps = [
    { title: "Entitas", content: `<div class="form-section"><div class="entity-form">
      ${inputField("Nama Entitas", "PT Surabaya Industrial Estate Rungkut", true)}
      ${inputField("Singkatan Entitas", "SIER", true)}
      ${inputField("Kode Entitas", "006", true)}
      ${inputField("Alamat Entitas", "Jl. Rungkut Industri Raya No.10, Rungkut Tengah, Kec. Gn. Anyar, Surabaya, Jawa Timur 60293", true)}
      ${inputField("Kota Entitas", "Surabaya", true)}
      ${inputField("Latitude", "-7.330097128052672", true)}
      ${inputField("Longitude", "112.75825088255117", true)}
    </div></div>` },
    { title: "Lahan Penjualan", content: `<div class="form-section no-pad">${cardHeader("Lahan Penjualan", [{ label: "Tambah Lahan Penjualan", icon: "plus", route: "lahan-add" }])}<div class="section-label">Filter Pencarian</div>${filterLine(`${field("Kategori", optionSelect("Semua Kategori", ["Commercial Land", "Service", "Commercial Building", "PPTI"]))}${actions([{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary export-lahan" }])}`)}<div class="divider"></div>${lahanDetailTable(detailLahan)}</div>` },
    { title: "Pengurus", content: `<div class="form-section no-pad">${cardHeader("Pengurus", [{ label: "Tambah Pengurus", icon: "plus" }])}${table(["NO","KODE_JABATAN","KODE_IDENTITAS","NAMA_PENGURUS","KODE_STATUS","PERIODE","AKSI"], pengurus, pengurus.length)}</div>` },
    { title: "Karyawan", content: `<div class="form-section no-pad">${cardHeader("Karyawan", [{ label: "Tambah Karyawan", icon: "plus" }])}${table(["NO","STATUS_KARYAWAN","JUMLAH","AKSI"], karyawan, karyawan.length)}</div>` },
    { title: "Utilitas", content: `<div class="form-section no-pad">${cardHeader("Utilitas", [{ label: "Tambah Utilitas", icon: "plus" }])}${table(["NO","KODE_UTILITAS","KAPASITAS","JUMLAH_PENGGUNAAN","PERIODE","AKSI"], utilitas, utilitas.length)}</div>` },
    { title: "Supplier", content: `<div class="form-section no-pad">${cardHeader("Supplier", [{ label: "Tambah Supplier", icon: "plus" }])}${table(["NO","KODE_SUPPLIER","LAYANAN","AKSI"], [], 0)}</div>` }
  ];
  return `${pageIntro("Kawasan Industri", `${mode} Kawasan`, "Rapikan identitas kawasan industri sebelum dipakai di data tenant dan lahan.")}
  ${wizardForm("kawasan", "kawasan", steps, "saveKawasan")}`;
}

function kawasanDetailPage() {
  const detailLahan = [
    { NO: 1, KATEGORI: "Commercial Land", SUB_KATEGORI: "Ijin Penggunaan Sebagian/Seluruh Lahan", KETERANGAN: "Ijin Penggunaan Sebagian/Seluruh Lahan", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "" },
    { NO: 2, KATEGORI: "Service", SUB_KATEGORI: "SPBU Berbek", KETERANGAN: "SPBU Berbek", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "SPBU Berbek" },
    { NO: 3, KATEGORI: "Service", SUB_KATEGORI: "SPBU Rungkut", KETERANGAN: "SPBU Rungkut", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "SPBU Rungkut" },
    { NO: 4, KATEGORI: "Service", SUB_KATEGORI: "Pengangkutan Sampah PIER", KETERANGAN: "Pengangkutan Sampah PIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "Pengangkutan Sampah PIER" },
    { NO: 5, KATEGORI: "Service", SUB_KATEGORI: "BPO PIER", KETERANGAN: "BPO PIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "BPO PIER" },
    { NO: 6, KATEGORI: "Service", SUB_KATEGORI: "BFU PIER", KETERANGAN: "BFU PIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "BFU PIER" },
    { NO: 7, KATEGORI: "Service", SUB_KATEGORI: "Pengangkutan Sampah SIER", KETERANGAN: "Pengangkutan Sampah SIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "Pengangkutan Sampah SIER" },
    { NO: 8, KATEGORI: "Service", SUB_KATEGORI: "BPO SIER", KETERANGAN: "BPO SIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "BPO SIER" },
    { NO: 9, KATEGORI: "Service", SUB_KATEGORI: "BFU SIER", KETERANGAN: "BFU SIER", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "BFU SIER" },
    { NO: 10, KATEGORI: "Service", SUB_KATEGORI: "Jasa Lain Logistik", KETERANGAN: "Jasa Lain Logistik", SALEABLE: "0 m²", NON_SALEABLE: "0 m²", SPACE_RENT: "0 m²", TOTAL: "0 M²", TOTAL_HA: "0.00 HA", CATATAN: "Jasa Lain Logistik" }
  ];
  const pengurus = [
    { NO: 1, KODE_JABATAN: "Direktur", KODE_IDENTITAS: "Kartu Tanda Penduduk", NAMA_PENGURUS: "Lussi Erniawati", KODE_STATUS: "Kontrak", PERIODE: "2022-09-09 s.d. 2027-09-08", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus pengurus">${icon("trash-2")}</button></div>` },
    { NO: 2, KODE_JABATAN: "Direktur", KODE_IDENTITAS: "Kartu Tanda Penduduk", NAMA_PENGURUS: "Rizka Syafitri Siregar", KODE_STATUS: "Kontrak", PERIODE: "2021-03-26 s.d. 2026-03-25", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus pengurus">${icon("trash-2")}</button></div>` }
  ];
  const karyawan = [
    { NO: 1, STATUS_KARYAWAN: "Kontrak", JUMLAH: "67", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus karyawan">${icon("trash-2")}</button></div>` },
    { NO: 2, STATUS_KARYAWAN: "Tetap", JUMLAH: "198", AKSI: `<div class="row-actions"><button class="square delete" title="Hapus karyawan">${icon("trash-2")}</button></div>` }
  ];
  const utilitas = [
    { NO: 1, KODE_UTILITAS: "Listrik", KAPASITAS: "10000 (Watt)", JUMLAH_PENGGUNAAN: "0 (Watt)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 2, KODE_UTILITAS: "Internet", KAPASITAS: "10000 (Gigabyte)", JUMLAH_PENGGUNAAN: "0 (Gigabyte)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 3, KODE_UTILITAS: "Gudang", KAPASITAS: "10 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 4, KODE_UTILITAS: "FO", KAPASITAS: "10000 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 5, KODE_UTILITAS: "Egate", KAPASITAS: "10000 (Tidak Ada)", JUMLAH_PENGGUNAAN: "0 (Tidak Ada)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 6, KODE_UTILITAS: "Pengolahan Limbah", KAPASITAS: "10000 (Liter)", JUMLAH_PENGGUNAAN: "0 (Liter)", PERIODE: "2024", AKSI: actionButtons() },
    { NO: 7, KODE_UTILITAS: "Air Bersih", KAPASITAS: "10000 (Liter)", JUMLAH_PENGGUNAAN: "0 (Liter)", PERIODE: "2024", AKSI: actionButtons() }
  ];
  const supplier = [
  ];
  return `${pageIntro("Kawasan Industri", "Detail", "Detail kawasan, pengurus, karyawan, dan utilitas sesuai struktur aksi kawasan industri.")}
  ${backLink("kawasan")}
  <div class="card tab-card">
    <div class="tab-strip">
      <button class="tab-btn active" data-tab-target="tab-entitas">Entitas</button>
      <button class="tab-btn" data-tab-target="tab-lahan">Lahan Penjualan</button>
      <button class="tab-btn" data-tab-target="tab-pengurus">Pengurus</button>
      <button class="tab-btn" data-tab-target="tab-karyawan">Karyawan</button>
      <button class="tab-btn" data-tab-target="tab-utilitas">Utilitas</button>
      <button class="tab-btn" data-tab-target="tab-supplier">Supplier</button>
    </div>
    <div class="tab-panel active" id="tab-entitas">
      <div class="entity-form readonly-form">
        ${readonlyInputField("Nama Entitas", "PT Surabaya Industrial Estate Rungkut", true)}
        ${readonlyInputField("Singkatan Entitas", "SIER", true)}
        ${readonlyInputField("Kode Entitas", "006", true)}
        ${readonlyInputField("Alamat Entitas", "Jl. Rungkut Industri Raya No.10, Rungkut Tengah, Kec. Gn. Anyar, Surabaya, Jawa Timur 60293", true)}
        ${readonlyInputField("Kota Entitas", "Surabaya", true)}
        ${readonlyInputField("Latitude", "-7.330097128052672", true)}
        ${readonlyInputField("Longitude", "112.75825088255117", true)}
      </div>
    </div>
    <div class="tab-panel" id="tab-lahan">${cardHeader("Lahan Penjualan", [{ label: "Tambah Lahan Penjualan", icon: "plus", route: "lahan-add" }])}<div class="section-label">Filter Pencarian</div>${filterLine(`${field("Kategori", optionSelect("Semua Kategori", ["Commercial Land", "Service", "Commercial Building", "PPTI"]))}${actions([{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary export-lahan" }])}`)}<div class="divider"></div>${lahanDetailTable(detailLahan)}</div>
    <div class="tab-panel" id="tab-pengurus">${cardHeader("Pengurus", [{ label: "Tambah Pengurus", icon: "plus" }])}${table(["NO","KODE_JABATAN","KODE_IDENTITAS","NAMA_PENGURUS","KODE_STATUS","PERIODE","AKSI"], pengurus, pengurus.length)}</div>
    <div class="tab-panel" id="tab-karyawan">${cardHeader("Karyawan", [{ label: "Tambah Karyawan", icon: "plus" }])}${table(["NO","STATUS_KARYAWAN","JUMLAH","AKSI"], karyawan, karyawan.length)}</div>
    <div class="tab-panel" id="tab-utilitas">${cardHeader("Utilitas", [{ label: "Tambah Utilitas", icon: "plus" }])}${table(["NO","KODE_UTILITAS","KAPASITAS","JUMLAH_PENGGUNAAN","PERIODE","AKSI"], utilitas, utilitas.length)}</div>
    <div class="tab-panel" id="tab-supplier">${cardHeader("Supplier", [{ label: "Tambah Supplier", icon: "plus" }])}${table(["NO","KODE_SUPPLIER","LAYANAN","AKSI"], supplier, supplier.length)}</div>
  </div>`;
}

function lahanPage() {
  const lahanActions = routeActions([{ kind: "edit", icon: "pencil", title: "Edit Lahan", route: "lahan-edit" }, { kind: "delete", icon: "trash-2", title: "Hapus Lahan" }]);
  const rows = lahanPenjualanRows.map(row => ({ ...row, KATEGORI: categoryBadge(row.KATEGORI), ACTION: lahanActions }));
  return `${pageIntro("Tenant", "Lahan", "Monitoring komposisi lahan penjualan lintas kawasan berdasarkan kategori, sub kategori, dan luas saleable/non-saleable.")}
  <section class="land-overview lahan-overview">
    <div class="card kpi modern"><div><span>Total Lahan</span><strong>653.60 Ha</strong></div><div class="kpi-icon blue">${icon("map")}</div></div>
    <div class="card kpi modern"><div><span>Saleable</span><strong>4,725,000 m²</strong></div><div class="kpi-icon green">${icon("badge-check")}</div></div>
    <div class="card kpi modern"><div><span>Space Rent</span><strong>12,000 m²</strong></div><div class="kpi-icon orange">${icon("warehouse")}</div></div>
  </section>
  <div class="card lahan-page">
    ${cardHeader("Data Lahan Penjualan", [{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary export-lahan" }, { label: "Tambah Lahan", icon: "plus", route: "lahan-add" }])}
    <div class="lahan-filter">${filterLine(`${field("Kawasan Industri", select("- Semua Kawasan -"))}${field("Kategori", optionSelect("- Semua Kategori -", ["Commercial Land", "Commercial Building", "Service", "PPTI"]))}${actions([{ label: "Cari", icon: "search", kind: "secondary" }])}`)}</div>
    <div class="divider"></div>${table(["NO","KAWASAN_INDUSTRI","KATEGORI","SUB_KATEGORI","KETERANGAN","SALEABLE","NON_SALEABLE","SPACE_RENT","TOTAL","TOTAL_HA","ACTION"], rows, 68, "lahan-table")}
  </div>`;
}

function lahanFormPage(mode = "Tambah") {
  const steps = [
    { title: "Kategori", content: `<div class="form-section">
      <div class="form-section-head"><span>${icon("map")}</span><div><h2>Informasi Kategori</h2><p>Identitas kawasan dan pengelompokan lahan penjualan.</p></div></div>
      <div class="tenant-form">
        ${field("Kawasan Industri", select("Select Kawasan"), true)}
        ${field("Kategori", optionSelect("Commercial Land", ["Commercial Building", "Service", "PPTI"]), true)}
        ${inputField("Sub Kategori", "Contoh: SPBU Berbek", true)}
        ${textareaField("Keterangan", "Keterangan lahan penjualan...", true)}
      </div>
    </div>` },
    { title: "Komponen Luas", content: `<div class="form-section">
      <div class="form-section-head"><span>${icon("ruler")}</span><div><h2>Komponen Luas</h2><p>Masukkan luas dalam meter persegi. Total dan hektar bisa dihitung oleh sistem.</p></div></div>
      <div class="tenant-form">
        ${inputField("Saleable (m2)", "0", true, "number")}
        ${inputField("Non Saleable (m2)", "0", true, "number")}
        ${inputField("Space Rent (m2)", "0", true, "number")}
        ${inputField("Total (m2)", "Otomatis / isi manual", false, "number")}
        ${inputField("Total (Ha)", "Otomatis", false, "number")}
      </div>
    </div>` }
  ];
  return `${pageIntro("Lahan", `${mode} Lahan Penjualan`, `${mode === "Tambah" ? "Tambah" : "Ubah"} data lahan penjualan sesuai struktur file lahan_penjualan: kategori, sub kategori, keterangan, dan luas.`)}
  ${wizardForm("lahan", "lahan", steps, "saveLahan")}`;
}

function tambahLahanPage() {
  return lahanFormPage("Tambah");
}

function reportPage(title = "Laporan") {
  const configs = {
    "Laporan Lahan": {
      icon: "map",
      filter: `${field("Kawasan Industri", select("PT Surabaya Industrial Estate Rungkut"))}${field("Kategori", optionSelect("- Semua Kategori -", ["Commercial Land", "Service", "PPTI"]))}`,
      stats: [["Total Lahan", "9,997,573 m2"], ["Saleable", "4,725,000 m2"], ["Total HA", "999.76 Ha"]],
      columns: ["KATEGORI", "TOTAL_ITEM", "SALEABLE", "NON_SALEABLE", "TOTAL_HA"],
      rows: [{ KATEGORI: "Commercial Land", TOTAL_ITEM: "12", SALEABLE: "0 m2", NON_SALEABLE: "0 m2", TOTAL_HA: "0.00 Ha" }, { KATEGORI: "PPTI", TOTAL_ITEM: "2", SALEABLE: "4,725,000 m2", NON_SALEABLE: "2,025,000 m2", TOTAL_HA: "675.00 Ha" }]
    },
    "Laporan Kontrak": {
      icon: "file-text",
      filter: `${field("Tanggal Mulai", `<input class="input" type="date" />`)}${field("Tanggal Selesai", `<input class="input" type="date" />`)}`,
      stats: [["Total Kontrak", "829"], ["Lapsed", "10"], ["Perlu Update", "12"]],
      columns: ["STATUS", "JUMLAH", "NILAI_KONTRAK", "KETERANGAN"],
      rows: [{ STATUS: "<span class='status lapsed'>LAPSED</span>", JUMLAH: "10", NILAI_KONTRAK: "0", KETERANGAN: "Kontrak perlu update periode" }, { STATUS: "<span class='status active'>AKTIF</span>", JUMLAH: "819", NILAI_KONTRAK: "125,000,000", KETERANGAN: "Kontrak berjalan" }]
    },
    "Laporan Invoice": {
      icon: "receipt",
      filter: `${field("No. Invoice", `<input class="input" placeholder="Isi No. Invoice" />`)}${field("Tanggal Mulai", `<input class="input" placeholder="dd/mm/tttt" />`)}${field("Tanggal Selesai", `<input class="input" placeholder="dd/mm/tttt" />`)}`,
      stats: [["Total Invoice", "2"], ["Paid", "1"], ["Overdue", "1"]],
      columns: ["STATUS", "JUMLAH_INVOICE", "TOTAL_TAGIHAN"],
      rows: [{ STATUS: "<span class='status active'>PAID</span>", JUMLAH_INVOICE: "1", TOTAL_TAGIHAN: "125,000,000" }, { STATUS: "<span class='status lapsed'>OVERDUE</span>", JUMLAH_INVOICE: "1", TOTAL_TAGIHAN: "84,500,000" }]
    },
    "Laporan Pembayaran": {
      icon: "wallet-cards",
      filter: `${field("No. PPI", `<input class="input" placeholder="Isi No. PPI" />`)}${field("Tanggal Mulai", `<input class="input" placeholder="dd/mm/tttt" />`)}${field("Tanggal Selesai", `<input class="input" placeholder="dd/mm/tttt" />`)}`,
      stats: [["Total PPI", "2"], ["Approved", "1"], ["Pending", "1"]],
      columns: ["STATUS", "JUMLAH_PPI", "TOTAL_TAGIHAN"],
      rows: [{ STATUS: "<span class='status active'>APPROVED</span>", JUMLAH_PPI: "1", TOTAL_TAGIHAN: "125,000,000" }, { STATUS: "<span class='status lapsed'>PENDING</span>", JUMLAH_PPI: "1", TOTAL_TAGIHAN: "43,200,000" }]
    }
  };
  const config = configs[title] || configs["Laporan Lahan"];
  return `${pageIntro("Laporan", title, "Rekap data untuk audit, monitoring, dan export dokumen.")}
  <div class="card report-card">
    <div class="report-head"><div><span>${icon(config.icon)}</span><h2>${title}</h2></div>${actions([{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary" }, { label: "Export PDF", icon: "file-text", kind: "ghost" }])}</div>
    <div class="section-label">Parameter Laporan</div>
    ${filterLine(`${config.filter}${actions([{ label: "Tampilkan Rekap", icon: "search", kind: "secondary" }])}`)}
    <div class="report-summary">${config.stats.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("")}</div>
    <div class="divider"></div>
    ${table(config.columns, config.rows, config.rows.length, "report-table")}
  </div>`;
}

function kontrakPage(mode = "Daftar Kontrak") {
  const filter = `<div class="section-label">Filter Pencarian</div>${filterLine(`${field("Tenant", select("- Semua Tenant -"))}${field("Tanggal Mulai", `<input class="input" type="date" />`)}${field("Tanggal Selesai", `<input class="input" type="date" />`)}${actions([{ label: "Cari", icon: "search", kind: "secondary" }])}`)}<div class="divider"></div>`;
  const dateFilter = `<div class="section-label">Filter Pencarian</div>${filterLine(`${field("Tanggal Mulai", `<input class="input" type="date" />`)}${field("Tanggal Selesai", `<input class="input" type="date" />`)}${actions([{ label: "Cari", icon: "search", kind: "secondary" }])}`)}<div class="divider"></div>`;
  if (mode === "Proses Tagihan") {
    return `${pageIntro("Kontrak", "Proses Tagihan", "Kelola proses pembuatan dan pengiriman PPI dari kontrak tenant.")}<div class="card">${dateFilter}${table(["NO","KODE_KONTRAK","PERIODE_FROM","PERIODE_TO","TENANT","LIST_TAGIHAN","CREATED_BY","TANGGAL_DIBUAT","STATUS","SEND_PPI"], [], 1, "process-table plain-empty")}</div>`;
  }
  if (mode === "Riwayat Kontrak") {
    const historyRows = [
      { NO: 1, KODE_KONTRAK: "KTR-2025-008", NAMA_TENANT: "BANK MANDIRI PT", TGL_KONTRAK: "19 Maret 2025", PERIODE_KONTRAK: contractPeriod("19 Maret 2024", "19 Maret 2025"), STATUS: "<span class='status lapsed'>BERAKHIR</span>", AKSI: routeActions([{ kind: "view", icon: "eye", title: "Lihat riwayat" }]) },
      { NO: 2, KODE_KONTRAK: "KTR-2024-009", NAMA_TENANT: "BANK NEGARA INDONESIA (PERSERO) Tbk PT", TGL_KONTRAK: "19 November 2024", PERIODE_KONTRAK: contractPeriod("19 November 2023", "19 November 2024"), STATUS: "<span class='status lapsed'>BERAKHIR</span>", AKSI: routeActions([{ kind: "view", icon: "eye", title: "Lihat riwayat" }]) },
      { NO: 3, KODE_KONTRAK: "KTR-2024-010", NAMA_TENANT: "RAPID PLAST INDONESIA. PT", TGL_KONTRAK: "30 Agustus 2024", PERIODE_KONTRAK: contractPeriod("30 Agustus 2023", "30 Agustus 2024"), STATUS: "<span class='status active'>DIARSIPKAN</span>", AKSI: routeActions([{ kind: "view", icon: "eye", title: "Lihat riwayat" }]) }
    ];
    return `${pageIntro("Kontrak", "Riwayat Kontrak", "Arsip kontrak yang sudah selesai atau telah diperbarui.")}<div class="card">${cardHeader("Riwayat Kontrak", [{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary" }])}${dateFilter}${table(["NO","KODE_KONTRAK","NAMA_TENANT","TGL_KONTRAK","PERIODE_KONTRAK","STATUS","AKSI"], historyRows, 829)}</div>`;
  }
  const contractRows = [
    ["6 November 2025", "7", "KANTOR PELAYANAN BEA & CUKAI", "", ""],
    ["12 November 2025", "7", "KANTOR PELAYANAN BEA & CUKAI", "", ""],
    ["19 Maret 2025", "No. 24", "SIER PUSPA UTAMA PT", "", "19 Maret 2025"],
    ["19 November 2024", "No. 18", "BANK MANDIRI PT", "", ""],
    ["30 Agustus 2024", "No. 29", "BANK SYARIAH INDONESIA TBK", "", ""],
    ["10 Februari 2023", "No. 18", "BANK PEMBANGUNAN DAERAH JAWA TIMUR TBK PT", "", ""],
    ["28 Mei 2025", "No. 27", "BANK NEGARA INDONESIA (PERSERO) Tbk PT", "", ""],
    ["4 Maret 2025", "BAK No. 072/SIER-BA/DP.1/III/2025", "INDONESIA COMNETS PLUS PT", "", ""],
    ["15 Agustus 2024", "No. 14", "TEKNINDO GEOSISTEM UNGGUL PT", "", ""],
    ["15 Agustus 2024", "No. 15", "TEKNINDO GEOSISTEM UNGGUL PT", "", ""]
  ];
  const rows = contractRows.map(([date, number, tenant, start, end], i) => ({
    NO: i + 1,
    TGL_KONTRAK: date,
    NO_KONTRAK: number,
    NAMA_TENANT: tenant,
    TGL_MULAI: start,
    TGL_SELESAI: end,
    STATUS_KONTRAK: updateStatus(),
    ACTION: contractActions()
  }));
  return `${pageIntro("Kontrak", mode, "Pantau status kontrak, masa berlaku, dan tindakan lanjutan per tenant.")}<div class="card">${cardHeader("Daftar Kontrak", [{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary" }, { label: "Tambah Data", icon: "plus", route: "kontrak-add" }])}${filter}${table(["NO","TGL_KONTRAK","NO_KONTRAK","NAMA_TENANT","TGL_MULAI","TGL_SELESAI","STATUS_KONTRAK","ACTION"], rows, 829, "contract-table")}</div>`;
}

function kontrakFormPage(mode = "Tambah") {
  const isDetail = mode === "Detail";
  const filled = mode !== "Tambah";
  const steps = [
    { title: "Data Kontrak", content: `<div class="form-section">
      <div class="form-section-head"><span>${icon("file-text")}</span><div><h2>Form Kontrak</h2></div></div>
      <div class="tenant-form">
        ${field("Pilih Tenant", filled ? select("KANTOR PELAYANAN BEA & CUKAI") : select("- Pilih -"), true)}
        ${filled ? readonlyInputField("Tanggal Dibuat", "2025-11-06", true) : inputField("Tanggal Dibuat", "2026-08-10", true, "date")}
        ${filled ? readonlyInputField("No. Kontrak", "7", true) : inputField("No. Kontrak", "No Kontrak", true)}
        ${field("Jenis Kontrak", optionSelect(filled ? "Sewa Lahan" : "- Pilih -", ["Sewa Lahan", "Utilitas", "Jasa"]), true)}
        ${field("Status Kontrak", optionSelect(filled ? "Lapsed" : "Aktif", ["Aktif", "Tidak Aktif", "Lapsed"]), true)}
      </div>
    </div>` },
    { title: "Periode & Nilai", content: `<div class="form-section">
      <div class="form-section-head"><span>${icon("calendar-days")}</span><div><h2>Periode & Nilai</h2></div></div>
      <div class="tenant-form">
        ${filled ? readonlyInputField("Tanggal Penandatanganan", "2025-11-06", true) : inputField("Tanggal Penandatanganan", "yyyy-mm-dd", true, "date")}
        ${filled ? readonlyInputField("Tanggal Mulai Berlaku", "", true) : inputField("Tanggal Mulai Berlaku", "yyyy-mm-dd", true, "date")}
        ${filled ? readonlyInputField("Tanggal Berakhir", "", true) : inputField("Tanggal Berakhir", "yyyy-mm-dd", true, "date")}
        ${filled ? readonlyInputField("Durasi Kontrak", "", true) : inputField("Durasi Kontrak", "Durasi kontrak", true)}
        ${field("Mata Uang", optionSelect("Rupiah", ["Dollar"]), true)}
        ${filled ? readonlyInputField("Nilai Kontrak", "0", true) : inputField("Nilai Kontrak", "Nilai kontrak", true, "number")}
        ${field("Skema Pembayaran", optionSelect("Bulan", ["Tahun", "Termin"]), true)}
        ${textareaField("Keterangan", filled ? "Kontrak sewa tenant" : "Keterangan")}
      </div>
    </div>` }
  ];
  return `${pageIntro("Kontrak", `${mode} Data`, "Form kontrak tenant sesuai struktur data kontrak utama.")}
  <div class="${isDetail ? "detail-form" : ""}">
    ${isDetail ? `${backLink("kontrak-tenant")}<div class="card form-card">${steps.map(step => step.content).join("")}</div>` : wizardForm("kontrak", "kontrak-tenant", steps, "saveKontrak")}
  </div>`;
}

function kontrakTagihanPage() {
  return `${pageIntro("Kontrak", "Tagihan", "Kelola tagihan berkala berdasarkan kode kontrak.")}
  ${backLink("kontrak-tenant")}
  <div class="card">${cardHeader("Kode Kontrak : 7", [
    { label: "Upload", icon: "upload", kind: "ghost", route: "kontrak-upload" },
    { label: "Tambah", icon: "plus", kind: "add-tagihan" }
  ])}
  <div class="divider"></div>${table(["NO","TANGGAL_PENAGIHAN_SEWA","KETERANGAN","JENIS_TAGIHAN","NILAI_TAGIHAN","PPN","PPH","STATUS","ACTION"], [], 0, "billing-table compact-empty")}</div>`;
}

function kontrakUploadPage() {
  return `${pageIntro("Kontrak", "Upload Tagihan", "Upload data tagihan massal sesuai template dan master referensi.")}
  ${backLink("kontrak-tagihan")}
  <div class="card upload-card">
    <h2>Upload File</h2>
    <div class="download-links">
      <button type="button">Download Template Excel</button>
      <button type="button">Download Master PPN</button>
      <button type="button">Download Master PPH</button>
      <button type="button">Download Jenis Tagihan</button>
    </div>
    <div class="form-field wide">
      <label>Pilih File</label>
      <div class="file-control"><label for="tagihanExcel">Pilih File</label><span id="tagihanFileName">Tidak ada file yang dipilih</span><input id="tagihanExcel" type="file" accept=".xls,.xlsx" /></div>
    </div>
    <div class="actions upload-actions"><button class="btn upload-tagihan">${icon("upload")}Upload</button></div>
  </div>`;
}

function transaksiPage(title, cols) {
  const headerActions = title === "Invoice" || title === "Laporan Invoice"
    ? [{ label: "Export Excel", icon: "file-spreadsheet", kind: "secondary" }]
    : [];
  const financeRows = {
    "Invoice": [
      { NO: 1, STATUS: "<span class='status active'>PAID</span>", NO_INVOICE: "INV-2026-071", NAMA_CUSTOMER: "BANK MANDIRI PT", PIC: "Admin Finance", TGL_INVOICE: "2026-08-01", MATA_UANG: "IDR", TOTAL_TAGIHAN: "125,000,000", ACTION: actionButtons() },
      { NO: 2, STATUS: "<span class='status lapsed'>OVERDUE</span>", NO_INVOICE: "INV-2026-068", NAMA_CUSTOMER: "PRASAD SEEDS INDONESIA, PT", PIC: "Admin Finance", TGL_INVOICE: "2026-07-15", MATA_UANG: "IDR", TOTAL_TAGIHAN: "84,500,000", ACTION: actionButtons() }
    ],
    "Permohonan Invoice": [
      { NO: 1, STATUS: "<span class='status active'>APPROVED</span>", NO_PPI: "PPI-2026-018", TANGGAL: "2026-08-03", NAMA_TENANT: "BANK MANDIRI PT", TOTAL_TAGIHAN: "125,000,000", ACTION: actionButtons() },
      { NO: 2, STATUS: "<span class='status lapsed'>PENDING</span>", NO_PPI: "PPI-2026-019", TANGGAL: "2026-08-06", NAMA_TENANT: "RAPID PLAST INDONESIA. PT", TOTAL_TAGIHAN: "43,200,000", ACTION: actionButtons() }
    ],
    "Kwitansi": [
      { NO: 1, TANGGAL: "2026-08-04", KODE_KWITANSI: "KWT-2026-011", KODE_INVOICE: "INV-2026-071", KETERANGAN: "Pembayaran sewa lahan", UNTUK_PEMBAYARAN: "Sewa lahan Agustus", PENERIMA: "SIER", JUMLAH: "125,000,000", ACTION: actionButtons() }
    ],
    "Tanda Terima": [
      { NO: 1, TANGGAL: "2026-08-04", KODE_TANDA_TERIMA: "TT-2026-009", PENERIMA: "SIER", PENGIRIM: "BANK MANDIRI PT", ACTION: actionButtons() }
    ],
    "Finance Control": [
      { NO: 1, NO_INVOICE: "INV-2026-068", TANGGAL_TEMPO: "2026-08-15", TOTAL: "84,500,000", ACTION: actionButtons() }
    ]
  };
  const rows = financeRows[title] || financeRows[title.replace("Laporan ", "")] || [];
  const tableClass = title === "Invoice" || title === "Laporan Invoice" ? "invoice-table" : title === "Permohonan Invoice" ? "ppi-table plain-empty" : title === "Kwitansi" ? "receipt-table" : title === "Tanda Terima" ? "handover-table plain-empty" : title === "Finance Control" ? "finance-control-table plain-empty" : "";
  const filterContent = title === "Permohonan Invoice"
    ? `${field("Tenant", select("- Semua Tenant -"))}${field("No. PPI", `<input class="input" placeholder="Isi No. PPI" />`)}${field("Tanggal Mulai", `<input class="input" placeholder="dd/mm/tttt" />`)}${field("Tanggal Selesai", `<input class="input" placeholder="dd/mm/tttt" />`)}${actions([{ label: "Cari Data", kind: "secondary", icon: "search" }])}`
    : title === "Kwitansi"
    ? `${field("Tanggal Mulai", `<input class="input" placeholder="dd/mm/tttt" />`)}${field("Tanggal Selesai", `<input class="input" placeholder="dd/mm/tttt" />`)}${actions([{ label: "Cari Data", kind: "secondary", icon: "search" }])}`
    : title === "Tanda Terima"
    ? `${field("Dari", `<input class="input" placeholder="tanggal" />`, true)}${field("Sampai", `<input class="input" placeholder="tanggal" />`, true)}`
    : title === "Finance Control"
    ? `${field("Dari", `<input class="input" placeholder="tanggal" />`, true)}${field("Sampai", `<input class="input" placeholder="tanggal" />`, true)}`
    : `${field(title === "Invoice" || title === "Laporan Invoice" ? "No. Invoice" : title === "Kwitansi" ? "Dari" : "Tenant", title === "Kwitansi" ? `<input class="input" placeholder="tanggal" />` : `<input class="input" placeholder="${title === "Invoice" || title === "Laporan Invoice" ? "Isi No. Invoice" : "- Semua Tenant -"}" />`)}${field(title === "Laporan Pembayaran" ? "No. PPI" : "Tanggal Mulai", `<input class="input" placeholder="${title === "Laporan Pembayaran" ? "Isi No. PPI" : "dd/mm/tttt"}" />`)}${field(title === "Kwitansi" ? "Sampai" : "Tanggal Selesai", `<input class="input" placeholder="dd/mm/tttt" />`)}${actions([{ label: title === "Invoice" || title === "Laporan Invoice" ? "Cari Data" : "Search", kind: "secondary", icon: "search" }])}`;
  return `${pageIntro("Keuangan", title, `Kelola ${title.toLowerCase()} dengan filter, pencarian, dan status yang mudah dipindai.`)}<div class="card">${cardHeader(title, headerActions)}<div class="section-label">Filter Pencarian</div>
  ${filterLine(filterContent)}
  <div class="divider"></div>${table(cols, rows, rows.length, tableClass)}</div>`;
}

function masterPage(title) {
  return `${pageIntro("Master", title, "Atur data referensi agar form dan laporan tetap konsisten.")}<div class="card">${cardHeader("", [{ label: "Tambah Data", icon: "plus" }])}<div class="divider"></div>${table(["NO","NAMA","STATUS","ACTION"], [{ NO: 1, NAMA: title, STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }], 1)}</div>`;
}

function jenisUsahaPage() {
  const rows = [
    { NO: 1, KODE_JENIS_USAHA: "003", NAMA_JENIS_USAHA: "Kernel Crushing Plant", CREATED_AT: "2024-04-24 09:58:16", ACTION: `<div class="row-actions"><button class="square edit jenis-usaha-edit" title="Edit Jenis Usaha">${icon("pencil")}</button><button class="square delete" title="Hapus Jenis Usaha">${icon("trash-2")}</button></div>` },
    { NO: 2, KODE_JENIS_USAHA: "BA", NAMA_JENIS_USAHA: "Logistik", CREATED_AT: "2024-03-21 16:13:17", ACTION: `<div class="row-actions"><button class="square edit jenis-usaha-edit" title="Edit Jenis Usaha">${icon("pencil")}</button><button class="square delete" title="Hapus Jenis Usaha">${icon("trash-2")}</button></div>` },
    { NO: 3, KODE_JENIS_USAHA: "002", NAMA_JENIS_USAHA: "Pertanian", CREATED_AT: "2024-03-21 16:00:50", ACTION: `<div class="row-actions"><button class="square edit jenis-usaha-edit" title="Edit Jenis Usaha">${icon("pencil")}</button><button class="square delete" title="Hapus Jenis Usaha">${icon("trash-2")}</button></div>` },
    { NO: 4, KODE_JENIS_USAHA: "001", NAMA_JENIS_USAHA: "Perkebunan", CREATED_AT: "2024-02-13 17:05:13", ACTION: `<div class="row-actions"><button class="square edit jenis-usaha-edit" title="Edit Jenis Usaha">${icon("pencil")}</button><button class="square delete" title="Hapus Jenis Usaha">${icon("trash-2")}</button></div>` }
  ];
  return `${pageIntro("Master", "Jenis Usaha", "Kelola daftar jenis usaha tenant sebagai referensi klasifikasi operasional.")}<div class="card">${cardHeader("List Jenis Usaha", [{ label: "Tambah Jenis Usaha", icon: "plus", kind: "jenis-usaha-add" }])}<div class="divider"></div>${table(["NO","KODE_JENIS_USAHA","NAMA_JENIS_USAHA","CREATED_AT","ACTION"], rows, rows.length)}</div>`;
}

function ppiPage(title, columns, rows, addKind = "") {
  const addButton = addKind ? { label: "Tambah Data", icon: "plus", kind: addKind } : { label: "Tambah Data", icon: "plus" };
  return `${pageIntro("Master PPI", title, "Kelola referensi PPI untuk kebutuhan penagihan, customer, rekening, pajak, dan PIC direktorat.")}<div class="card">${cardHeader("", [addButton])}<div class="divider"></div>${table(columns, rows, rows.length)}</div>`;
}

function ppiCustomerPage() {
  const rows = [
    { NO: 1, NAMA: "Test SIER Tenant", ALAMAT: "-", PIC: "Indra widjaja", NPWP: "00", KET: "pembayaran sewa", ACTION: `<div class="row-actions"><button class="square edit customer-add" title="Edit Customer">${icon("pencil")}</button><button class="square delete" title="Hapus Customer">${icon("trash-2")}</button></div>` }
  ];
  return `${pageIntro("Master", "Customer", "Kelola data customer untuk kebutuhan PPI dan invoice.")}
  <div class="card">${cardHeader("", [{ label: "Tambah", icon: "plus", kind: "customer-add" }])}<div class="divider"></div>${table(["NO","NAMA","ALAMAT","PIC","NPWP","KET","ACTION"], rows, rows.length, "customer-table")}</div>`;
}

function ppiRekeningPage() {
  return `${pageIntro("Master PPI", "Daftar Rekening", "Kelola rekening bank untuk kebutuhan PPI dan pembayaran.")}
  <div class="card">${cardHeader("", [{ label: "Tambah", icon: "plus", kind: "rekening-add" }])}<div class="divider"></div>${table(["NO","NAMA_BANK","NAMA","REKENING","CABANG","ALAMAT","ACTION"], [], 0, "rekening-table plain-empty")}</div>`;
}

function settingsUserPage() {
  const rows = [
    { NO: 1, NAMA: "Admin", EMAIL: "admin@sier.co.id", ROLE: "Super Admin", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }
  ];
  return `${pageIntro("Pengaturan", "User", "Kelola akun pengguna, role, dan status akses sistem.")}
  <div class="card settings-page">${cardHeader("Daftar User", [{ label: "Tambah User", icon: "plus", kind: "user-add" }])}<div class="divider"></div>${table(["NO","NAMA","EMAIL","ROLE","STATUS","ACTION"], rows, rows.length, "settings-table")}</div>`;
}

function settingsAccessPage() {
  const rows = [
    { NO: 1, NAMA: "Super Admin", KETERANGAN: "Akses penuh seluruh modul", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }
  ];
  return `${pageIntro("Pengaturan", "Hak Akses", "Kelola grup akses dan izin menu untuk pengguna.")}
  <div class="card settings-page">${cardHeader("Daftar Hak Akses", [{ label: "Tambah Hak Akses", icon: "plus", kind: "access-add" }])}<div class="divider"></div>${table(["NO","NAMA","KETERANGAN","STATUS","ACTION"], rows, rows.length, "settings-table")}</div>`;
}

function settingsProfilePage() {
  const rows = [
    { NO: 1, NAMA: "Admin SIER", EMAIL: "admin@sier.co.id", JABATAN: "SIER Super Admin", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }
  ];
  return `${pageIntro("Pengaturan", "Profil", "Kelola profil pengguna dan informasi akun.")}
  <div class="card settings-page">${cardHeader("Profil Pengguna", [{ label: "Edit Profil", icon: "pencil", kind: "profile-edit" }])}<div class="divider"></div>${table(["NO","NAMA","EMAIL","JABATAN","STATUS","ACTION"], rows, rows.length, "settings-table")}</div>`;
}

function settingsLogPage() {
  const rows = [
    { NO: 1, WAKTU: "2026-08-18 09:17", USER: "Admin", AKTIVITAS: "Login Admin", IP: "127.0.0.1", STATUS: "<span class='status active'>BERHASIL</span>" }
  ];
  return `${pageIntro("Pengaturan", "Log Aktivitas", "Pantau riwayat aktivitas pengguna di dalam sistem.")}
  <div class="card settings-page">${cardHeader("Log Aktivitas")}<div class="divider"></div>${table(["NO","WAKTU","USER","AKTIVITAS","IP","STATUS"], rows, rows.length, "settings-table")}</div>`;
}

function renderPage() {
  const pages = {
    dashboard,
    lahan: () => lahanPage(),
    "lahan-add": tambahLahanPage,
    "lahan-edit": () => lahanFormPage("Edit"),
    "laporan-lahan": () => reportPage("Laporan Lahan"),
    "laporan-kontrak": () => reportPage("Laporan Kontrak"),
    "laporan-invoice": () => reportPage("Laporan Invoice"),
    "laporan-pembayaran": () => reportPage("Laporan Pembayaran"),
    "riwayat-kontrak": () => kontrakPage("Riwayat Kontrak"),
    report: () => reportPage("Laporan"),
    tenant: tenantPage,
    "tenant-add": tambahTenantPage,
    "tenant-edit": () => tenantFormPage("Edit"),
    "tenant-detail": () => tenantFormPage("Detail"),
    kawasan: kawasanPage,
    "kawasan-add": () => kawasanFormPage("Tambah"),
    "kawasan-edit": () => kawasanFormPage("Edit"),
    "kawasan-detail": kawasanDetailPage,
    "kontrak-tenant": () => kontrakPage("Daftar Kontrak"),
    "kontrak-add": () => kontrakFormPage("Tambah"),
    "kontrak-edit": () => kontrakFormPage("Edit"),
    "kontrak-detail": () => kontrakFormPage("Detail"),
    "kontrak-tagihan": kontrakTagihanPage,
    "kontrak-upload": kontrakUploadPage,
    "proses-tagihan": () => kontrakPage("Proses Tagihan"),
    "permohonan-invoice": () => transaksiPage("Permohonan Invoice", ["NO","STATUS","NO_PPI","TANGGAL","NAMA_TENANT","TOTAL_TAGIHAN","ACTION"]),
    invoice: () => transaksiPage("Invoice", ["NO","STATUS","NO_INVOICE","NAMA_CUSTOMER","PIC","TGL_INVOICE","MATA_UANG","TOTAL_TAGIHAN","ACTION"]),
    kwitansi: () => transaksiPage("Kwitansi", ["NO","TANGGAL","KODE_KWITANSI","KODE_INVOICE","KETERANGAN","UNTUK_PEMBAYARAN","PENERIMA","JUMLAH","ACTION"]),
    "tanda-terima": () => transaksiPage("Tanda Terima", ["NO","TANGGAL","KODE_TANDA_TERIMA","PENERIMA","PENGIRIM","ACTION"]),
    "finance-control": () => transaksiPage("Finance Control", ["NO","NO_INVOICE","TANGGAL_TEMPO","TOTAL","ACTION"]),
    "master-utilitas": settingsProfilePage,
    "master-usaha": jenisUsahaPage,
    "master-sdm": settingsLogPage,
    "ppi-customer": ppiCustomerPage,
    "ppi-rekening": ppiRekeningPage,
    "ppi-pic": () => ppiPage("PIC Direktorat", ["NO","NAMA_PIC","DIREKTORAT","EMAIL","STATUS","ACTION"], [{ NO: 1, NAMA_PIC: "Admin Direktorat", DIREKTORAT: "Keuangan", EMAIL: "pic@sier.co.id", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }], "pic-add"),
    "ppi-pph": () => ppiPage("Master PPH", ["NO","KODE_PPH","NAMA_PPH","TARIF","STATUS","ACTION"], [{ NO: 1, KODE_PPH: "PPH-23", NAMA_PPH: "PPh Pasal 23", TARIF: "2%", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }], "tax-add"),
    "ppi-ppn": () => ppiPage("Master PPN", ["NO","KODE_PPN","NAMA_PPN","TARIF","STATUS","ACTION"], [{ NO: 1, KODE_PPN: "PPN-11", NAMA_PPN: "PPN 11%", TARIF: "11%", STATUS: "<span class='status active'>AKTIF</span>", ACTION: actionButtons() }], "tax-add"),
    "ppi-template": settingsUserPage,
    "ppi-komponen": settingsAccessPage
  };
  document.getElementById("page").innerHTML = (pages[active] || pages.dashboard)();
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function updateAuthView() {
  document.body.classList.toggle("logged-out", !isAuthenticated);
}

function bindAuthControls() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = event => {
      event.preventDefault();
      isAuthenticated = true;
      localStorage.setItem("tms-sier-auth", "true");
      updateAuthView();
      render();
      showToast("Berhasil masuk ke TMS SIER");
    };
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.onclick = event => {
      event.stopPropagation();
      openConfirmDialog({
        title: "Logout dari sistem?",
        message: "Sesi Anda akan ditutup dan kembali ke halaman login.",
        confirmText: "Ya, logout",
        type: "logout",
        onConfirm: () => {
          isAuthenticated = false;
          localStorage.removeItem("tms-sier-auth");
          document.querySelector(".user-menu")?.classList.remove("open");
          active = "dashboard";
          updateAuthView();
          showToast("Anda berhasil logout");
        }
      });
    };
  }
}

let pendingConfirmAction = null;

function openConfirmDialog({ title, message, confirmText, type = "delete", onConfirm }) {
  const dialog = document.getElementById("confirmDialog");
  if (!dialog) return;
  const iconBox = document.getElementById("confirmIcon");
  document.getElementById("confirmTitle").textContent = title || "Konfirmasi Aksi";
  document.getElementById("confirmMessage").textContent = message || "Apakah Anda yakin ingin melanjutkan?";
  document.getElementById("confirmOk").textContent = confirmText || "Ya, lanjutkan";
  iconBox.classList.toggle("logout", type === "logout");
  iconBox.innerHTML = type === "logout" ? icon("log-out") : icon("trash-2");
  pendingConfirmAction = onConfirm;
  dialog.classList.add("open");
  dialog.setAttribute("aria-hidden", "false");
  refreshIcons();
}

function closeConfirmDialog() {
  const dialog = document.getElementById("confirmDialog");
  if (!dialog) return;
  dialog.classList.remove("open");
  dialog.setAttribute("aria-hidden", "true");
  pendingConfirmAction = null;
}

function bindConfirmDialog() {
  const dialog = document.getElementById("confirmDialog");
  const cancel = document.getElementById("confirmCancel");
  const ok = document.getElementById("confirmOk");
  if (!dialog || !cancel || !ok) return;
  cancel.onclick = closeConfirmDialog;
  dialog.onclick = event => {
    if (event.target === dialog) closeConfirmDialog();
  };
  ok.onclick = () => {
    const action = pendingConfirmAction;
    closeConfirmDialog();
    if (action) action();
  };
}

function render() {
  updateAuthView();
  bindAuthControls();
  bindConfirmDialog();
  if (!isAuthenticated) {
    refreshIcons();
    return;
  }
  renderNav();
  renderPage();
  bindLayoutControls();
  bindPageControls();
  bindAuthControls();
  bindConfirmDialog();
  refreshIcons();
}

function toggleSidebar() {
  if (window.matchMedia("(max-width: 980px)").matches) {
    document.body.classList.toggle("menu-open");
    return;
  }
  document.body.classList.toggle("sidebar-collapsed");
}

function bindLayoutControls() {
  document.getElementById("mobileMenu").onclick = toggleSidebar;
  const closeUpdateContract = document.getElementById("closeUpdateContract");
  const saveUpdateContract = document.getElementById("saveUpdateContract");
  const updateContractModal = document.getElementById("updateContractModal");
  const closeQuickEdit = document.getElementById("closeQuickEdit");
  const saveQuickEdit = document.getElementById("saveQuickEdit");
  const quickEditModal = document.getElementById("quickEditModal");
  const closeJenisUsaha = document.getElementById("closeJenisUsaha");
  const jenisUsahaModal = document.getElementById("jenisUsahaModal");
  const closeCustomer = document.getElementById("closeCustomer");
  const customerModal = document.getElementById("customerModal");
  const saveCustomer = document.getElementById("saveCustomer");
  const closeRekening = document.getElementById("closeRekening");
  const rekeningModal = document.getElementById("rekeningModal");
  const saveRekening = document.getElementById("saveRekening");
  const closePic = document.getElementById("closePic");
  const picModal = document.getElementById("picModal");
  const savePic = document.getElementById("savePic");
  const closeTax = document.getElementById("closeTax");
  const taxModal = document.getElementById("taxModal");
  const saveTax = document.getElementById("saveTax");
  const closeUser = document.getElementById("closeUser");
  const userModalSettings = document.getElementById("userModal");
  const saveUser = document.getElementById("saveUser");
  const closeAccess = document.getElementById("closeAccess");
  const accessModal = document.getElementById("accessModal");
  const saveAccess = document.getElementById("saveAccess");
  const closeProfile = document.getElementById("closeProfile");
  const profileModal = document.getElementById("profileModal");
  const saveProfile = document.getElementById("saveProfile");
  const closeTagihan = document.getElementById("closeTagihan");
  const saveTagihan = document.getElementById("saveTagihan");
  const tagihanModal = document.getElementById("tagihanModal");
  if (closeUpdateContract) closeUpdateContract.onclick = closeUpdateContractModal;
  if (closeQuickEdit) closeQuickEdit.onclick = closeQuickEditModal;
  if (closeJenisUsaha) closeJenisUsaha.onclick = closeJenisUsahaModal;
  if (closeCustomer) closeCustomer.onclick = closeCustomerModal;
  if (closeRekening) closeRekening.onclick = closeRekeningModal;
  if (closePic) closePic.onclick = closePicModal;
  if (closeTax) closeTax.onclick = closeTaxModal;
  if (closeUser) closeUser.onclick = closeUserModal;
  if (closeAccess) closeAccess.onclick = closeAccessModal;
  if (closeProfile) closeProfile.onclick = closeProfileModal;
  if (closeTagihan) closeTagihan.onclick = closeTagihanModal;
  if (updateContractModal) {
    updateContractModal.onclick = event => {
      if (event.target === updateContractModal) closeUpdateContractModal();
    };
  }
  if (saveUpdateContract) {
    saveUpdateContract.onclick = () => {
      const value = document.getElementById("newEndPeriod").value;
      showToast(value ? `Periode akhir disimpan: ${value}` : "Isi periode akhir baru dulu");
      if (value) closeUpdateContractModal();
    };
  }
  if (quickEditModal) {
    quickEditModal.onclick = event => {
      if (event.target === quickEditModal) closeQuickEditModal();
    };
  }
  if (jenisUsahaModal) {
    jenisUsahaModal.onclick = event => {
      if (event.target === jenisUsahaModal) closeJenisUsahaModal();
    };
  }
  if (customerModal) {
    customerModal.onclick = event => {
      if (event.target === customerModal) closeCustomerModal();
    };
  }
  if (rekeningModal) {
    rekeningModal.onclick = event => {
      if (event.target === rekeningModal) closeRekeningModal();
    };
  }
  if (picModal) {
    picModal.onclick = event => {
      if (event.target === picModal) closePicModal();
    };
  }
  if (taxModal) {
    taxModal.onclick = event => {
      if (event.target === taxModal) closeTaxModal();
    };
  }
  if (userModalSettings) {
    userModalSettings.onclick = event => {
      if (event.target === userModalSettings) closeUserModal();
    };
  }
  if (accessModal) {
    accessModal.onclick = event => {
      if (event.target === accessModal) closeAccessModal();
    };
  }
  if (profileModal) {
    profileModal.onclick = event => {
      if (event.target === profileModal) closeProfileModal();
    };
  }
  if (tagihanModal) {
    tagihanModal.onclick = event => {
      if (event.target === tagihanModal) closeTagihanModal();
    };
  }
  if (saveQuickEdit) {
    saveQuickEdit.onclick = () => {
      showToast("Perubahan berhasil disimpan");
      closeQuickEditModal();
    };
  }
  if (saveCustomer) {
    saveCustomer.onclick = () => {
      showToast("Data customer berhasil disimpan");
      closeCustomerModal();
    };
  }
  if (saveRekening) {
    saveRekening.onclick = () => {
      showToast("Data rekening berhasil disimpan");
      closeRekeningModal();
    };
  }
  if (savePic) {
    savePic.onclick = () => {
      showToast("Data PIC direktorat berhasil disimpan");
      closePicModal();
    };
  }
  if (saveTax) {
    saveTax.onclick = () => {
      showToast("Data pajak berhasil disimpan");
      closeTaxModal();
    };
  }
  if (saveUser) {
    saveUser.onclick = () => {
      showToast("Data user berhasil disimpan");
      closeUserModal();
    };
  }
  if (saveAccess) {
    saveAccess.onclick = () => {
      showToast("Data hak akses berhasil disimpan");
      closeAccessModal();
    };
  }
  if (saveProfile) {
    saveProfile.onclick = () => {
      showToast("Profil berhasil disimpan");
      closeProfileModal();
    };
  }
  if (saveTagihan) {
    saveTagihan.onclick = () => {
      showToast("Data tagihan berhasil disimpan");
      closeTagihanModal();
    };
  }
  const userMenu = document.querySelector(".user-menu");
  const userButton = document.getElementById("userMenuButton");
  if (userButton && userMenu) {
    userButton.onclick = event => {
      event.stopPropagation();
      document.querySelector(".notification-menu")?.classList.remove("open");
      const open = userMenu.classList.toggle("open");
      userButton.setAttribute("aria-expanded", String(open));
    };
  }
  const notificationMenu = document.querySelector(".notification-menu");
  const notificationButton = document.getElementById("notificationButton");
  if (notificationButton && notificationMenu) {
    notificationButton.onclick = event => {
      event.stopPropagation();
      document.querySelector(".user-menu")?.classList.remove("open");
      const open = notificationMenu.classList.toggle("open");
      notificationButton.setAttribute("aria-expanded", String(open));
    };
  }
}

function bindPageControls() {
  const quickEditStatus = document.getElementById("quickEditStatus");
  if (quickEditStatus && !quickEditStatus.innerHTML) quickEditStatus.innerHTML = optionSelect("Aktif", ["Tidak Aktif", "Draft"]);
  const jenisUsahaStatus = document.getElementById("jenisUsahaStatus");
  if (jenisUsahaStatus && !jenisUsahaStatus.innerHTML) jenisUsahaStatus.innerHTML = optionSelect("Aktif", ["Tidak Aktif"]);
  bindSearchSelects();
  bindTabs();
  bindWizards();
  document.querySelectorAll(".table-search").forEach(tableSearch => {
    tableSearch.oninput = event => {
      const query = event.target.value.toLowerCase();
      const card = event.target.closest(".card") || document;
      card.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    };
  });

  document.querySelectorAll(".page-btn:not(:disabled)").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll(".page-btn").forEach(item => item.classList.remove("active"));
      if (/^\d+$/.test(button.textContent.trim())) button.classList.add("active");
      showToast(`Halaman ${button.textContent.trim()} dipilih`);
    };
  });

  document.querySelectorAll("[data-route-action]").forEach(button => {
    button.onclick = () => {
      active = button.dataset.routeAction;
      render();
    };
  });

  const saveTenant = document.getElementById("saveTenant");
  if (saveTenant) saveTenant.onclick = () => handleWizardSave(saveTenant, "Data tenant berhasil disimpan");
  const saveLahan = document.getElementById("saveLahan");
  if (saveLahan) saveLahan.onclick = () => handleWizardSave(saveLahan, "Data lahan penjualan berhasil disimpan");
  const saveKawasan = document.getElementById("saveKawasan");
  if (saveKawasan) saveKawasan.onclick = () => handleWizardSave(saveKawasan, "Data kawasan berhasil disimpan");
  const saveKontrak = document.getElementById("saveKontrak");
  if (saveKontrak) saveKontrak.onclick = () => handleWizardSave(saveKontrak, "Data kontrak berhasil disimpan");
  const saveJenisUsaha = document.getElementById("saveJenisUsaha");
  if (saveJenisUsaha) saveJenisUsaha.onclick = () => {
    showToast("Data jenis usaha berhasil disiapkan");
    closeJenisUsahaModal();
  };

  document.querySelectorAll(".export-lahan").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      exportLahanExcel();
    };
  });

  document.querySelectorAll(".add-tagihan").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openTagihanModal();
    };
  });

  const tagihanExcel = document.getElementById("tagihanExcel");
  if (tagihanExcel) {
    tagihanExcel.onchange = event => {
      const fileName = event.target.files[0]?.name || "Tidak ada file yang dipilih";
      document.getElementById("tagihanFileName").textContent = fileName;
    };
  }
  document.querySelectorAll(".upload-tagihan").forEach(button => {
    button.onclick = () => showToast("File tagihan siap diunggah dan divalidasi sesuai template");
  });

  document.querySelectorAll(".jenis-usaha-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openJenisUsahaModal("Tambah Jenis Usaha");
    };
  });

  document.querySelectorAll(".jenis-usaha-edit").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openJenisUsahaModal("Edit Jenis Usaha", getRowData(button));
    };
  });

  document.querySelectorAll(".customer-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openCustomerModal(button.title?.includes("Edit") ? "Edit Data" : "Tambah Data", getRowData(button));
    };
  });

  document.querySelectorAll(".rekening-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openRekeningModal("Tambah Data");
    };
  });

  document.querySelectorAll(".pic-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openPicModal("Tambah Data");
    };
  });

  document.querySelectorAll(".tax-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openTaxModal("Tambah Data");
    };
  });

  document.querySelectorAll(".user-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openUserModal("Tambah User");
    };
  });

  document.querySelectorAll(".access-add").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openAccessModal("Tambah Hak Akses");
    };
  });

  document.querySelectorAll(".profile-edit").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      document.querySelector(".user-menu")?.classList.remove("open");
      openProfileModal("Profil Saya");
    };
  });

  document.querySelectorAll(".user-config-save").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      showToast("User config berhasil disimpan");
    };
  });

  document.querySelectorAll(".contract-update").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openUpdateContractModal();
    };
  });

  document.querySelectorAll(".quick-edit:not([data-route-action])").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openQuickEditModal(button.title || "Edit Data", getRowData(button));
    };
  });

  document.querySelectorAll(".square.edit:not([data-route-action]):not(.jenis-usaha-edit):not(.customer-add)").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      openQuickEditModal(button.title || "Edit Data", getRowData(button));
    };
  });

  document.querySelectorAll(".btn").forEach(button => {
    const label = button.textContent.trim();
    const alreadyHandled = button.onclick || button.dataset.routeAction;
    const specialAdd = button.classList.contains("add-tagihan") ||
      button.classList.contains("jenis-usaha-add") ||
      button.classList.contains("customer-add") ||
      button.classList.contains("rekening-add") ||
      button.classList.contains("pic-add") ||
      button.classList.contains("tax-add") ||
      button.classList.contains("user-add") ||
      button.classList.contains("access-add") ||
      button.classList.contains("profile-edit") ||
      button.classList.contains("export-lahan");
    if (alreadyHandled || specialAdd || !/^Tambah/i.test(label)) return;
    button.onclick = event => {
      event.stopPropagation();
      openQuickEditModal(label);
    };
  });

  document.querySelectorAll(".square.delete").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      const title = button.title || "Hapus Data";
      openConfirmDialog({
        title,
        message: "Data yang dipilih akan dihapus dari tampilan. Pastikan data sudah benar sebelum melanjutkan.",
        confirmText: "Ya, hapus",
        type: "delete",
        onConfirm: () => showToast(`${title} berhasil`)
      });
    };
  });

  document.querySelectorAll(".btn, .square, .dropdown-item").forEach(button => {
    button.onclick ??= () => showToast(button.textContent.trim() || button.title || "Aksi dipilih");
  });

  const dashboardSubmit = document.getElementById("dashboardSubmit");
  if (dashboardSubmit) {
    dashboardSubmit.onclick = () => {
      const from = document.getElementById("dashboardFrom").value || "-";
      const to = document.getElementById("dashboardTo").value || "-";
      const area = document.querySelector("#dashboardArea .search-select")?.dataset.value || "Semua Kawasan Industri";
      if (from !== "-" && to !== "-" && from > to) {
        showToast("Periode awal tidak boleh melebihi periode akhir");
        return;
      }
      dashboardFilter.from = from;
      dashboardFilter.to = to;
      dashboardFilter.area = area;
      render();
      showToast(`Dashboard difilter: ${formatMonth(from)} - ${formatMonth(to)} | ${area}`);
    };
  }

  bindRiskChartControls();
  bindDashboardInteractions();
}

function exportLahanExcel() {
  const columns = [
    ["NO", "No"],
    ["KAWASAN_INDUSTRI", "Kawasan Industri"],
    ["KATEGORI", "Kategori"],
    ["SUB_KATEGORI", "Sub Kategori"],
    ["KETERANGAN", "Keterangan"],
    ["SALEABLE", "Saleable (m²)"],
    ["NON_SALEABLE", "Non Saleable (m²)"],
    ["SPACE_RENT", "Space Rent (m²)"],
    ["TOTAL", "Total (m²)"],
    ["TOTAL_HA", "Total (Ha)"]
  ];
  const rows = lahanPenjualanRows.map(row => `<tr>${columns.map(([key]) => `<td>${escapeHtml(row[key])}</td>`).join("")}</tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8" />
    <title>Tenant Management System</title>
    <style>
      body{font-family:Verdana,Arial,sans-serif;font-size:12px;color:#000}
      h4{text-align:center;margin:10px 0}
      table{border-collapse:collapse}
      .no-border td{border:0;padding:4px 6px}
      .gridtable th{background:#1f4e79;color:#fff;font-weight:bold;text-align:center;vertical-align:middle}
      .gridtable th,.gridtable td{border:1px solid #777;padding:6px;vertical-align:top}
      .center{text-align:center}
    </style></head><body>
    <h4>Kawasan Industri</h4>
    <table width="100%" class="no-border">
      <tr><td colspan="2">Kawasan Industri</td><td>:</td><td colspan="5">Surabaya Industrial Estate Rungkut</td></tr>
      <tr><td colspan="2">NIK</td><td>:</td><td colspan="5">SIER</td></tr>
      <tr><td colspan="2">Alamat</td><td>:</td><td colspan="5">Jl. Rungkut Industri Raya No.10, Rungkut Tengah, Kec. Gn. Anyar, Surabaya, Jawa Timur 60293</td></tr>
    </table>
    <h4>Data Lahan Penjualan</h4>
    <table border="1" width="100%" class="gridtable">
      <thead><tr>${columns.map(([, label]) => `<th>${label}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lahan_penjualan.xls";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Export Excel lahan disiapkan");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bindWizards() {
  document.querySelectorAll(".wizard-form").forEach(wizard => {
    const tabs = [...wizard.querySelectorAll(".wizard-tab")];
    const panels = [...wizard.querySelectorAll(".wizard-panel")];
    const next = wizard.querySelector(".wizard-next");

    tabs.forEach(tab => {
      tab.onclick = () => {
        if (tab.disabled) return;
        activateWizardStep(wizard, Number(tab.dataset.step));
      };
    });

    if (next) {
      next.onclick = () => {
        const current = Number(wizard.dataset.currentStep || 0);
        const nextStep = Math.min(current + 1, panels.length - 1);
        if (!tabs[nextStep].disabled) activateWizardStep(wizard, nextStep);
      };
    }

    wizard.dataset.currentStep = "0";
  });
}

function activateWizardStep(wizard, step) {
  wizard.dataset.currentStep = String(step);
  wizard.querySelectorAll(".wizard-tab").forEach(tab => tab.classList.toggle("active", Number(tab.dataset.step) === step));
  wizard.querySelectorAll(".wizard-panel").forEach(panel => panel.classList.toggle("active", Number(panel.dataset.stepPanel) === step));
  const next = wizard.querySelector(".wizard-next");
  if (next) {
    const last = step >= wizard.querySelectorAll(".wizard-panel").length - 1;
    next.disabled = last || wizard.querySelector(`.wizard-tab[data-step="${step + 1}"]`)?.disabled;
    next.innerHTML = `${icon("arrow-right")}Berikutnya`;
    refreshIcons();
  }
}

function handleWizardSave(button, message) {
  const wizard = button.closest(".wizard-form");
  showToast(message);
  if (!wizard) return;
  const current = Number(wizard.dataset.currentStep || 0);
  const nextTab = wizard.querySelector(`.wizard-tab[data-step="${current + 1}"]`);
  if (nextTab) {
    nextTab.disabled = false;
    nextTab.classList.add("unlocked");
    const next = wizard.querySelector(".wizard-next");
    if (next) next.disabled = false;
  }
}

function bindTabs() {
  document.querySelectorAll(".tab-btn").forEach(button => {
    button.onclick = () => {
      const card = button.closest(".tab-card");
      card.querySelectorAll(".tab-btn").forEach(item => item.classList.remove("active"));
      card.querySelectorAll(".tab-panel").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      card.querySelector(`#${button.dataset.tabTarget}`).classList.add("active");
      refreshIcons();
    };
  });
}

function bindRiskChartControls() {
  const chart = document.getElementById("riskLineChart");
  if (!chart) return;

  document.querySelectorAll("[data-risk-filter]").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll("[data-risk-filter]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      chart.dataset.filter = button.dataset.riskFilter;
    };
  });

  const totals = { "2026": 96, "2025": 82, "2024": 74 };
  const yearFilter = document.getElementById("riskYearFilter");
  if (yearFilter) {
    yearFilter.onchange = () => {
      document.getElementById("riskYearLabel").textContent = yearFilter.value;
      document.getElementById("riskTotalLabel").textContent = totals[yearFilter.value] || 0;
      showToast(`Trend risiko tahun ${yearFilter.value} ditampilkan`);
    };
  }

  document.querySelectorAll("[data-risk-point]").forEach(point => {
    point.onclick = () => {
      const [type, month, value] = point.dataset.riskPoint.split("|");
      const x = Number(point.getAttribute("cx"));
      const y = Number(point.getAttribute("cy"));
      const callout = document.getElementById("riskCallout");
      const rect = callout.querySelector("rect");
      const pointer = callout.querySelector(".callout-pointer");
      const texts = callout.querySelectorAll("text");
      const boxX = Math.min(Math.max(x + 14, 44), 594);
      const boxY = Math.min(Math.max(y - 46, 12), 148);
      rect.setAttribute("x", boxX);
      rect.setAttribute("y", boxY);
      pointer.setAttribute("d", `M${boxX + 18} ${boxY + 54} L${x} ${y - 8} L${boxX + 42} ${boxY + 54} Z`);
      texts[0].setAttribute("x", boxX + 16);
      texts[0].setAttribute("y", boxY + 22);
      texts[1].setAttribute("x", boxX + 16);
      texts[1].setAttribute("y", boxY + 40);
      document.getElementById("riskCalloutTitle").textContent = `${type} - ${month}`;
      document.getElementById("riskCalloutValue").textContent = `${value} warning`;
      callout.classList.add("show");
      document.querySelectorAll("[data-risk-point]").forEach(item => item.classList.remove("selected"));
      point.classList.add("selected");
    };
  });
}

function bindDashboardInteractions() {
  document.querySelectorAll("[data-dashboard-focus]").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      document.querySelectorAll(".kpi-action.active, .warning-action.active").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      showToast(`${button.dataset.dashboardFocus} dipilih`);
    };
  });

  document.querySelectorAll("[data-donut-item]").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      const card = button.closest(".donut-card");
      card.querySelectorAll("[data-donut-item]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const label = button.dataset.donutLabel || button.querySelector("span")?.textContent || "Kategori";
      const value = Number(button.dataset.donutValue || button.querySelector("b")?.textContent || 0);
      const total = Number(button.dataset.donutTotal || 0) || value;
      const percent = Math.round((value / total) * 100);
      const detail = card.querySelector(".donut-detail");
      if (detail) {
        detail.classList.add("show");
        detail.style.setProperty("--detail-color", button.dataset.donutColor || "#286ee9");
        detail.querySelector("span").textContent = label;
        detail.querySelector("b").textContent = `${value} (${percent}%)`;
      }
      showToast(`${label}: ${value} (${percent}%)`);
    };
  });

  document.querySelectorAll("[data-util-name]").forEach(row => {
    row.onclick = event => {
      event.stopPropagation();
      document.querySelectorAll("[data-util-name]").forEach(item => item.classList.remove("active"));
      row.classList.add("active");
      showToast(`${row.dataset.utilName}: ${row.dataset.utilValue}% terpakai`);
    };
  });

  document.querySelectorAll("[data-bbm-month]").forEach(bar => {
    bar.onclick = event => {
      event.stopPropagation();
      document.querySelectorAll("[data-bbm-month]").forEach(item => item.classList.remove("active"));
      bar.classList.add("active");
      const detail = document.querySelector(".bbm-detail");
      if (detail) {
        detail.classList.add("show");
        detail.querySelector("b").textContent = bar.dataset.bbmMonth;
        detail.querySelector(".solar strong").textContent = bar.dataset.bbmSolar;
        detail.querySelector(".pertalite strong").textContent = bar.dataset.bbmPertalite;
        detail.querySelector(".pertamax strong").textContent = bar.dataset.bbmPertamax;
      }
      showToast(`BBM ${bar.dataset.bbmMonth}: Solar ${bar.dataset.bbmSolar}, Pertalite ${bar.dataset.bbmPertalite}, Pertamax ${bar.dataset.bbmPertamax}`);
    };
  });
}

function bindSearchSelects() {
  document.querySelectorAll(".search-select").forEach(selectEl => {
    const trigger = selectEl.querySelector(".search-select-trigger");
    const input = selectEl.querySelector(".search-select-input");
    const options = [...selectEl.querySelectorAll(".search-select-option")];

    trigger.onclick = event => {
      event.stopPropagation();
      document.querySelectorAll(".search-select.open").forEach(item => {
        if (item !== selectEl) item.classList.remove("open");
      });
      selectEl.classList.toggle("open");
      if (selectEl.classList.contains("open")) {
        input.value = "";
        options.forEach(option => option.hidden = false);
        input.focus();
      }
    };

    input.onclick = event => event.stopPropagation();
    input.oninput = () => {
      const query = input.value.toLowerCase();
      options.forEach(option => {
        option.hidden = !option.textContent.toLowerCase().includes(query);
      });
    };

    options.forEach(option => {
      option.onclick = event => {
        event.stopPropagation();
        selectEl.dataset.value = option.textContent;
        trigger.querySelector("span").textContent = option.textContent;
        selectEl.classList.remove("open");
      };
    });
  });
}

function openUpdateContractModal() {
  const modal = document.getElementById("updateContractModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("newEndPeriod").focus();
}

function closeUpdateContractModal() {
  const modal = document.getElementById("updateContractModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openQuickEditModal(title, rowData = {}) {
  const modal = document.getElementById("quickEditModal");
  document.getElementById("quickEditTitle").textContent = title || "Edit Data";
  const nameValue = firstRowValue(rowData, [
    "NAMA",
    "NAMA_TENANT",
    "NAMA_CUSTOMER",
    "NAMA_PIC",
    "KODE_UTILITAS",
    "KODE_PPH",
    "KODE_PPN",
    "KETERANGAN",
    "KAWASAN_INDUSTRI",
    "NO_INVOICE",
    "NO_PPI",
    "KODE_KWITANSI",
    "KODE_TANDA_TERIMA"
  ]);
  const statusValue = firstRowValue(rowData, ["STATUS"]) || "Aktif";
  const nameInput = document.getElementById("quickEditName");
  nameInput.value = nameValue;
  nameInput.placeholder = nameValue ? "" : "Masukkan perubahan...";
  const statusEl = document.getElementById("quickEditStatus");
  if (statusEl) statusEl.innerHTML = optionSelect(statusValue, ["Aktif", "Tidak Aktif", "Draft", "Paid", "Overdue", "Pending", "Approved"]);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  nameInput.focus();
  bindSearchSelects();
}

function closeQuickEditModal() {
  const modal = document.getElementById("quickEditModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openJenisUsahaModal(title, rowData = {}) {
  const modal = document.getElementById("jenisUsahaModal");
  document.getElementById("jenisUsahaTitle").textContent = title || "Tambah Jenis Usaha";
  document.getElementById("jenisUsahaKode").value = rowData.KODE_JENIS_USAHA || "";
  document.getElementById("jenisUsahaNama").value = rowData.NAMA_JENIS_USAHA || "";
  const statusEl = document.getElementById("jenisUsahaStatus");
  if (statusEl) statusEl.innerHTML = optionSelect(rowData.STATUS || "Aktif", ["Tidak Aktif"]);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  document.getElementById("jenisUsahaKode").focus();
}

function closeJenisUsahaModal() {
  const modal = document.getElementById("jenisUsahaModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openCustomerModal(title, rowData = {}) {
  const modal = document.getElementById("customerModal");
  document.getElementById("customerTitle").textContent = title || "Tambah Data";
  const inputs = modal.querySelectorAll("input.input:not(.search-select-input)");
  if (inputs[0]) inputs[0].value = rowData.PIC || rowData.NAMA || "";
  if (inputs[1]) inputs[1].value = rowData.JABATAN || "";
  if (inputs[2]) inputs[2].value = rowData.EMAIL || "";
  if (inputs[3]) inputs[3].value = rowData.NO_TELP || "";
  const tenantSelect = modal.querySelector(".search-select");
  if (tenantSelect && rowData.NAMA) {
    tenantSelect.dataset.value = rowData.NAMA;
    tenantSelect.querySelector(".search-select-trigger span").textContent = rowData.NAMA;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeCustomerModal() {
  const modal = document.getElementById("customerModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openRekeningModal(title) {
  const modal = document.getElementById("rekeningModal");
  document.getElementById("rekeningTitle").textContent = title || "Tambah Data";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeRekeningModal() {
  const modal = document.getElementById("rekeningModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openPicModal(title) {
  const modal = document.getElementById("picModal");
  document.getElementById("picTitle").textContent = title || "Tambah Data";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closePicModal() {
  const modal = document.getElementById("picModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openTaxModal(title) {
  const modal = document.getElementById("taxModal");
  document.getElementById("taxTitle").textContent = title || "Tambah Data";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeTaxModal() {
  const modal = document.getElementById("taxModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openUserModal(title) {
  const modal = document.getElementById("userModal");
  document.getElementById("userTitle").textContent = title || "Tambah User";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeUserModal() {
  const modal = document.getElementById("userModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openAccessModal(title) {
  const modal = document.getElementById("accessModal");
  document.getElementById("accessTitle").textContent = title || "Tambah Hak Akses";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeAccessModal() {
  const modal = document.getElementById("accessModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openProfileModal(title) {
  const modal = document.getElementById("profileModal");
  document.getElementById("profileTitle").textContent = title || "Edit Profil";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  refreshIcons();
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openTagihanModal() {
  const modal = document.getElementById("tagihanModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  bindSearchSelects();
  refreshIcons();
}

function closeTagihanModal() {
  const modal = document.getElementById("tagihanModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function formatMonth(value) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const [year, month] = value.split("-");
  return `${month}-${year}`;
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.addEventListener("click", event => {
  document.querySelectorAll(".search-select.open").forEach(item => item.classList.remove("open"));
  const userMenu = document.querySelector(".user-menu");
  if (userMenu && !userMenu.contains(event.target)) userMenu.classList.remove("open");
  const userButton = document.getElementById("userMenuButton");
  if (userButton) userButton.setAttribute("aria-expanded", "false");
  const notificationMenu = document.querySelector(".notification-menu");
  if (notificationMenu && !notificationMenu.contains(event.target)) notificationMenu.classList.remove("open");
  const notificationButton = document.getElementById("notificationButton");
  if (notificationButton) notificationButton.setAttribute("aria-expanded", "false");
});

render();
