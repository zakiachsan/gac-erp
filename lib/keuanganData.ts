// ─── Shared Data Layer for Keuangan Module ───
// Aggregated mock data representing auto-rekap from all modules

export const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ═══════════════════════════════════════════
// NERACA
// ═══════════════════════════════════════════
export interface NeracaItem {
  kode: string;
  nama: string;
  jumlah: number;
  kodeAkun?: string[]; // link to COA for drill-down
}

export const neracaAktivaLancar: NeracaItem[] = [
  { kode: "111", nama: "Kas & Bank", jumlah: 1250000000, kodeAkun: ["1110", "1120"] },
  { kode: "112", nama: "Piutang Usaha", jumlah: 730000000, kodeAkun: ["1130"] },
  { kode: "113", nama: "Persediaan Bahan", jumlah: 420000000, kodeAkun: ["1140"] },
  { kode: "114", nama: "Uang Muka", jumlah: 150000000, kodeAkun: ["1150"] },
];

export const neracaAktivaTetap: NeracaItem[] = [
  { kode: "121", nama: "Tanah", jumlah: 500000000, kodeAkun: ["1210"] },
  { kode: "122", nama: "Bangunan (netto)", jumlah: 1200000000, kodeAkun: ["1220", "1310"] },
  { kode: "123", nama: "Kendaraan (netto)", jumlah: 350000000, kodeAkun: ["1230", "1320"] },
  { kode: "124", nama: "Peralatan Kantor (netto)", jumlah: 180000000, kodeAkun: ["1240", "1330"] },
];

export const neracaKewajiban: NeracaItem[] = [
  { kode: "211", nama: "Hutang Usaha", jumlah: 890000000, kodeAkun: ["2110"] },
  { kode: "212", nama: "Hutang Bank", jumlah: 750000000, kodeAkun: ["2120"] },
  { kode: "213", nama: "Hutang Pajak", jumlah: 220000000, kodeAkun: ["2130", "2140"] },
];

export const neracaEkuitas: NeracaItem[] = [
  { kode: "311", nama: "Modal Disetor", jumlah: 2000000000, kodeAkun: ["3110"] },
  { kode: "312", nama: "Laba Ditahan", jumlah: 950000000, kodeAkun: ["3120"] },
  { kode: "313", nama: "Laba Tahun Berjalan", jumlah: 1800000000, kodeAkun: ["3130"] },
];

// Komparasi periode sebelumnya (bulan lalu) — mock
export const neracaAktivaLancarPrev: NeracaItem[] = neracaAktivaLancar.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.92) }));
export const neracaAktivaTetapPrev: NeracaItem[] = neracaAktivaTetap.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.98) }));
export const neracaKewajibanPrev: NeracaItem[] = neracaKewajiban.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.95) }));
export const neracaEkuitasPrev: NeracaItem[] = neracaEkuitas.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.88) }));

// ═══════════════════════════════════════════
// LABA RUGI
// ═══════════════════════════════════════════
export interface LabaRugiItem {
  nama: string;
  jumlah: number;
  kodeAkun?: string[]; // link to COA for drill-down
}

export const labaRugiPendapatan: LabaRugiItem[] = [
  { nama: "Jasa Konstruksi", jumlah: 3200000000, kodeAkun: ["4110"] },
  { nama: "Jasa Maintenance", jumlah: 850000000, kodeAkun: ["4120"] },
  { nama: "Penjualan Barang", jumlah: 450000000, kodeAkun: ["4130"] },
];

export const labaRugiCogs: LabaRugiItem[] = [
  { nama: "Pembelian Material", jumlah: 1200000000, kodeAkun: ["5110"] },
  { nama: "Upah Langsung", jumlah: 650000000, kodeAkun: ["5120"] },
  { nama: "Subkontraktor", jumlah: 480000000, kodeAkun: ["5130"] },
];

export const labaRugiBeban: LabaRugiItem[] = [
  { nama: "Gaji & Tunjangan", jumlah: 420000000, kodeAkun: ["6110"] },
  { nama: "Transportasi", jumlah: 85000000, kodeAkun: ["6120"] },
  { nama: "Listrik & Air", jumlah: 45000000, kodeAkun: ["6130"] },
  { nama: "Sewa Kantor", jumlah: 120000000, kodeAkun: ["6140"] },
  { nama: "Biaya Admin & Umum", jumlah: 65000000, kodeAkun: ["6150"] },
  { nama: "Marketing", jumlah: 95000000, kodeAkun: ["6160"] },
  { nama: "Penyusutan Aset", jumlah: 180000000, kodeAkun: ["6170"] },
];

// Komparasi periode sebelumnya — mock
export const labaRugiPendapatanPrev: LabaRugiItem[] = labaRugiPendapatan.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.90) }));
export const labaRugiCogsPrev: LabaRugiItem[] = labaRugiCogs.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.93) }));
export const labaRugiBebanPrev: LabaRugiItem[] = labaRugiBeban.map((i) => ({ ...i, jumlah: Math.round(i.jumlah * 0.95) }));

// ═══════════════════════════════════════════
// CASHFLOW
// ═══════════════════════════════════════════
export interface CashflowItem {
  nama: string;
  jumlah: number;
  tipe: "masuk" | "keluar";
}

export const cashflowOperasional: CashflowItem[] = [
  { nama: "Dari Pelanggan (Invoice)", jumlah: 2850000000, tipe: "masuk" },
  { nama: "Ke Supplier (Pembelian)", jumlah: -1150000000, tipe: "keluar" },
  { nama: "Ke Karyawan (Gaji)", jumlah: -420000000, tipe: "keluar" },
  { nama: "Ke Pemerintah (Pajak)", jumlah: -180000000, tipe: "keluar" },
  { nama: "Biaya Operasional Lain", jumlah: -320000000, tipe: "keluar" },
];

export const cashflowInvestasi: CashflowItem[] = [
  { nama: "Pembelian Kendaraan", jumlah: -250000000, tipe: "keluar" },
  { nama: "Pembelian Peralatan", jumlah: -85000000, tipe: "keluar" },
  { nama: "Penjualan Aset Lama", jumlah: 45000000, tipe: "masuk" },
];

export const cashflowPendanaan: CashflowItem[] = [
  { nama: "Pinjaman Bank Masuk", jumlah: 500000000, tipe: "masuk" },
  { nama: "Pembayaran Cicilan Pinjaman", jumlah: -125000000, tipe: "keluar" },
  { nama: "Modal Pemegang Saham", jumlah: 300000000, tipe: "masuk" },
];

// ═══════════════════════════════════════════
// HUTANG PIUTANG — AGING
// ═══════════════════════════════════════════
export interface AgingItem {
  id: string;
  pihak: string;
  noDokumen: string;
  tanggal: string;
  jatuhTempo: string;
  total: number;
  sisa: number;
  current: number;
  d130: number;
  d3160: number;
  d6190: number;
  d90plus: number;
  status: "Lunas" | "Belum Lunas" | "Jatuh Tempo";
}

export const piutangList: AgingItem[] = [
  { id: "AR-001", pihak: "PT Maju Jaya", noDokumen: "INV-2026-0045", tanggal: "2026-04-15", jatuhTempo: "2026-05-15", total: 480000000, sisa: 480000000, current: 480000000, d130: 0, d3160: 0, d6190: 0, d90plus: 0, status: "Belum Lunas" },
  { id: "AR-002", pihak: "PT Sejahtera Abadi", noDokumen: "INV-2026-0038", tanggal: "2026-03-20", jatuhTempo: "2026-04-20", total: 250000000, sisa: 250000000, current: 0, d130: 0, d3160: 250000000, d6190: 0, d90plus: 0, status: "Jatuh Tempo" },
  { id: "AR-003", pihak: "PT Delta Konstruksi", noDokumen: "INV-2026-0032", tanggal: "2026-02-10", jatuhTempo: "2026-03-12", total: 175000000, sisa: 100000000, current: 0, d130: 0, d3160: 0, d6190: 0, d90plus: 100000000, status: "Jatuh Tempo" },
  { id: "AR-004", pihak: "CV Karya Mandiri", noDokumen: "INV-2026-0051", tanggal: "2026-05-01", jatuhTempo: "2026-06-01", total: 125000000, sisa: 0, current: 0, d130: 0, d3160: 0, d6190: 0, d90plus: 0, status: "Lunas" },
];

export const hutangList: AgingItem[] = [
  { id: "AP-001", pihak: "PT CoolTech", noDokumen: "PO-2026-0011", tanggal: "2026-04-10", jatuhTempo: "2026-05-10", total: 420000000, sisa: 420000000, current: 420000000, d130: 0, d3160: 0, d6190: 0, d90plus: 0, status: "Belum Lunas" },
  { id: "AP-002", pihak: "PT Maju Bersama", noDokumen: "PO-2026-0012", tanggal: "2026-03-25", jatuhTempo: "2026-04-25", total: 195000000, sisa: 195000000, current: 0, d130: 195000000, d3160: 0, d6190: 0, d90plus: 0, status: "Jatuh Tempo" },
  { id: "AP-003", pihak: "PT Sejahtera Abadi", noDokumen: "PO-2026-0013", tanggal: "2026-05-02", jatuhTempo: "2026-06-02", total: 907000000, sisa: 0, current: 0, d130: 0, d3160: 0, d6190: 0, d90plus: 0, status: "Lunas" },
];

// ═══════════════════════════════════════════
// PERPAJAKAN
// ═══════════════════════════════════════════
export interface PajakItem {
  id: string;
  jenis: "Pajak Keluaran" | "Pajak Masukan";
  noFaktur: string;
  tanggal: string;
  dpp: number;
  ppn: number;
  pph: number;
  total: number;
  status: "Normal" | "Dibatalkan" | "Direvisi";
}

export const pajakList: PajakItem[] = [
  { id: "PK-001", jenis: "Pajak Keluaran", noFaktur: "010.123-45.67890123", tanggal: "2026-04-15", dpp: 3200000000, ppn: 352000000, pph: 64000000, total: 3616000000, status: "Normal" },
  { id: "PK-002", jenis: "Pajak Keluaran", noFaktur: "010.123-45.67890124", tanggal: "2026-05-05", dpp: 450000000, ppn: 49500000, pph: 9000000, total: 508500000, status: "Normal" },
  { id: "PM-001", jenis: "Pajak Masukan", noFaktur: "020.987-65.43210987", tanggal: "2026-04-20", dpp: 850000000, ppn: 93500000, pph: 0, total: 943500000, status: "Normal" },
  { id: "PM-002", jenis: "Pajak Masukan", noFaktur: "020.987-65.43210988", tanggal: "2026-05-03", dpp: 420000000, ppn: 46200000, pph: 0, total: 466200000, status: "Normal" },
  { id: "PM-003", jenis: "Pajak Masukan", noFaktur: "020.987-65.43210989", tanggal: "2026-05-06", dpp: 195000000, ppn: 21450000, pph: 0, total: 216450000, status: "Normal" },
];

// ═══════════════════════════════════════════
// DANA MASUK & KELUAR
// ═══════════════════════════════════════════
export interface DanaItem {
  id: string;
  tanggal: string;
  tipe: "Masuk" | "Keluar";
  sumber: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  metode: string;
  referensi: string;
  noJurnal?: string;
}

export const danaList: DanaItem[] = [
  { id: "DM-001", tanggal: "2026-05-01", tipe: "Masuk", sumber: "PT Maju Jaya", kategori: "Pendapatan", deskripsi: "Pembayaran Invoice INV-2026-0045 (DP 50%)", jumlah: 240000000, metode: "Transfer BCA", referensi: "TRF-20260501-001", noJurnal: "JU/2026/05/001" },
  { id: "DM-002", tanggal: "2026-05-02", tipe: "Keluar", sumber: "PT CoolTech", kategori: "Pembelian", deskripsi: "Pembayaran PO-2026-0011 (AC Split 2 PK)", jumlah: 420000000, metode: "Transfer BCA", referensi: "TRF-20260502-002", noJurnal: "JU/2026/05/002" },
  { id: "DM-003", tanggal: "2026-05-03", tipe: "Keluar", sumber: "Karyawan", kategori: "Gaji", deskripsi: "Gaji bulan Mei 2026", jumlah: 180000000, metode: "Transfer", referensi: "PAY-20260503-001", noJurnal: "JU/2026/05/003" },
  { id: "DM-004", tanggal: "2026-05-04", tipe: "Masuk", sumber: "CV Karya Mandiri", kategori: "Pendapatan", deskripsi: "Pembayaran Invoice INV-2026-0051 (Lunas)", jumlah: 125000000, metode: "Transfer Mandiri", referensi: "TRF-20260504-003", noJurnal: "JU/2026/05/004" },
  { id: "DM-005", tanggal: "2026-05-05", tipe: "Keluar", sumber: "Bank", kategori: "Cicilan", deskripsi: "Cicilan pinjaman bank bulan Mei", jumlah: 125000000, metode: "Auto Debit", referensi: "LOAN-20260505-001", noJurnal: "JU/2026/05/005" },
  { id: "DM-006", tanggal: "2026-05-06", tipe: "Keluar", sumber: "Karyawan", kategori: "Biaya Operasional", deskripsi: "Reimburse transportasi & konsumsi", jumlah: 8500000, metode: "Kas", referensi: "REIM-20260506-001", noJurnal: "JU/2026/05/006" },
  { id: "DM-007", tanggal: "2026-05-07", tipe: "Masuk", sumber: "Bank", kategori: "Bunga", deskripsi: "Bunga deposito 3 bulan", jumlah: 12500000, metode: "Auto", referensi: "BG-20260507-001", noJurnal: "JU/2026/05/007" },
];

// ═══════════════════════════════════════════
// INVOICE & KWITANSI
// ═══════════════════════════════════════════
export interface InvoiceItem {
  id: string;
  no: string;
  tipe: "Invoice" | "Kwitansi";
  tanggal: string;
  jatuhTempo: string;
  customer: string;
  project: string;
  total: number;
  status: "Draft" | "Terbit" | "Dikirim" | "Dibayar" | "Dibatalkan";
}

export const invoiceList: InvoiceItem[] = [
  { id: "INV-001", no: "INV-2026-0045", tipe: "Invoice", tanggal: "2026-04-15", jatuhTempo: "2026-05-15", customer: "PT Maju Jaya", project: "Pemasangan AC Kantor Pusat", total: 480000000, status: "Terbit" },
  { id: "INV-002", no: "INV-2026-0038", tipe: "Invoice", tanggal: "2026-03-20", jatuhTempo: "2026-04-20", customer: "PT Sejahtera Abadi", project: "Renovasi Gudang Medan", total: 250000000, status: "Dibayar" },
  { id: "INV-003", no: "INV-2026-0051", tipe: "Invoice", tanggal: "2026-05-01", jatuhTempo: "2026-06-01", customer: "CV Karya Mandiri", project: "Pemasangan Pompa Industri", total: 125000000, status: "Dibayar" },
  { id: "INV-004", no: "INV-2026-0055", tipe: "Invoice", tanggal: "2026-05-06", jatuhTempo: "2026-06-06", customer: "PT Delta Konstruksi", project: "Pengadaan IT Equipment", total: 175000000, status: "Draft" },
  { id: "KW-001", no: "KW-2026-0012", tipe: "Kwitansi", tanggal: "2026-04-25", jatuhTempo: "—", customer: "PT Maju Jaya", project: "Pemasangan AC Kantor Pusat", total: 240000000, status: "Dibayar" },
  { id: "KW-002", no: "KW-2026-0013", tipe: "Kwitansi", tanggal: "2026-05-04", jatuhTempo: "—", customer: "CV Karya Mandiri", project: "Pemasangan Pompa Industri", total: 125000000, status: "Dibayar" },
];

// ═══════════════════════════════════════════
// CHART OF ACCOUNTS (COA)
// ═══════════════════════════════════════════
export type CoaCategory =
  | "Aset Lancar"
  | "Aset Tetap"
  | "Akumulasi Penyusutan"
  | "Hutang Jangka Pendek"
  | "Hutang Jangka Panjang"
  | "Ekuitas"
  | "Pendapatan"
  | "COGS"
  | "Beban Operasional"
  | "Pendapatan Lain"
  | "Beban Lain"
  | "Pajak";

export interface CoaItem {
  kode: string;
  nama: string;
  kategori: CoaCategory;
  tipe: "Debit" | "Kredit";
  saldoAwal: number;
  saldoAkhir: number;
  status: "Aktif" | "Arsip";
}

export const coaList: CoaItem[] = [
  // ASET LANCAR
  { kode: "1110", nama: "Kas", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 250000000, saldoAkhir: 500000000, status: "Aktif" },
  { kode: "1120", nama: "Bank BCA", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 500000000, saldoAkhir: 750000000, status: "Aktif" },
  { kode: "1130", nama: "Piutang Usaha", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 600000000, saldoAkhir: 730000000, status: "Aktif" },
  { kode: "1140", nama: "Persediaan Bahan", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 350000000, saldoAkhir: 420000000, status: "Aktif" },
  { kode: "1150", nama: "Uang Muka", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 100000000, saldoAkhir: 150000000, status: "Aktif" },
  { kode: "1160", nama: "PPN Masukan", kategori: "Aset Lancar", tipe: "Debit", saldoAwal: 120000000, saldoAkhir: 161150000, status: "Aktif" },
  // ASET TETAP
  { kode: "1210", nama: "Tanah", kategori: "Aset Tetap", tipe: "Debit", saldoAwal: 500000000, saldoAkhir: 500000000, status: "Aktif" },
  { kode: "1220", nama: "Bangunan", kategori: "Aset Tetap", tipe: "Debit", saldoAwal: 1500000000, saldoAkhir: 1500000000, status: "Aktif" },
  { kode: "1230", nama: "Kendaraan", kategori: "Aset Tetap", tipe: "Debit", saldoAwal: 500000000, saldoAkhir: 500000000, status: "Aktif" },
  { kode: "1240", nama: "Peralatan Kantor", kategori: "Aset Tetap", tipe: "Debit", saldoAwal: 250000000, saldoAkhir: 250000000, status: "Aktif" },
  // AKUMULASI PENYUSUTAN
  { kode: "1310", nama: "Akum. Penyusutan Bangunan", kategori: "Akumulasi Penyusutan", tipe: "Kredit", saldoAwal: 200000000, saldoAkhir: 300000000, status: "Aktif" },
  { kode: "1320", nama: "Akum. Penyusutan Kendaraan", kategori: "Akumulasi Penyusutan", tipe: "Kredit", saldoAwal: 100000000, saldoAkhir: 150000000, status: "Aktif" },
  { kode: "1330", nama: "Akum. Penyusutan Peralatan", kategori: "Akumulasi Penyusutan", tipe: "Kredit", saldoAwal: 50000000, saldoAkhir: 70000000, status: "Aktif" },
  // HUTANG JANGKA PENDEK
  { kode: "2110", nama: "Hutang Usaha", kategori: "Hutang Jangka Pendek", tipe: "Kredit", saldoAwal: 800000000, saldoAkhir: 890000000, status: "Aktif" },
  { kode: "2120", nama: "Hutang Bank", kategori: "Hutang Jangka Pendek", tipe: "Kredit", saldoAwal: 800000000, saldoAkhir: 750000000, status: "Aktif" },
  { kode: "2130", nama: "Hutang Pajak", kategori: "Hutang Jangka Pendek", tipe: "Kredit", saldoAwal: 180000000, saldoAkhir: 220000000, status: "Aktif" },
  { kode: "2140", nama: "PPN Keluaran", kategori: "Hutang Jangka Pendek", tipe: "Kredit", saldoAwal: 300000000, saldoAkhir: 401500000, status: "Aktif" },
  // HUTANG JANGKA PANJANG
  { kode: "2210", nama: "Pinjaman Jangka Panjang", kategori: "Hutang Jangka Panjang", tipe: "Kredit", saldoAwal: 1200000000, saldoAkhir: 1125000000, status: "Aktif" },
  // EKUITAS
  { kode: "3110", nama: "Modal Disetor", kategori: "Ekuitas", tipe: "Kredit", saldoAwal: 2000000000, saldoAkhir: 2000000000, status: "Aktif" },
  { kode: "3120", nama: "Laba Ditahan", kategori: "Ekuitas", tipe: "Kredit", saldoAwal: 800000000, saldoAkhir: 950000000, status: "Aktif" },
  { kode: "3130", nama: "Laba Tahun Berjalan", kategori: "Ekuitas", tipe: "Kredit", saldoAwal: 1200000000, saldoAkhir: 1800000000, status: "Aktif" },
  // PENDAPATAN
  { kode: "4110", nama: "Pendapatan Jasa Konstruksi", kategori: "Pendapatan", tipe: "Kredit", saldoAwal: 0, saldoAkhir: 3200000000, status: "Aktif" },
  { kode: "4120", nama: "Pendapatan Maintenance", kategori: "Pendapatan", tipe: "Kredit", saldoAwal: 0, saldoAkhir: 850000000, status: "Aktif" },
  { kode: "4130", nama: "Penjualan Barang", kategori: "Pendapatan", tipe: "Kredit", saldoAwal: 0, saldoAkhir: 450000000, status: "Aktif" },
  // COGS
  { kode: "5110", nama: "Pembelian Material", kategori: "COGS", tipe: "Debit", saldoAwal: 0, saldoAkhir: 1200000000, status: "Aktif" },
  { kode: "5120", nama: "Upah Langsung", kategori: "COGS", tipe: "Debit", saldoAwal: 0, saldoAkhir: 650000000, status: "Aktif" },
  { kode: "5130", nama: "Subkontraktor", kategori: "COGS", tipe: "Debit", saldoAwal: 0, saldoAkhir: 480000000, status: "Aktif" },
  // BEBAN OPERASIONAL
  { kode: "6110", nama: "Gaji & Tunjangan", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 420000000, status: "Aktif" },
  { kode: "6120", nama: "Transportasi", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 85000000, status: "Aktif" },
  { kode: "6130", nama: "Listrik & Air", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 45000000, status: "Aktif" },
  { kode: "6140", nama: "Sewa Kantor", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 120000000, status: "Aktif" },
  { kode: "6150", nama: "Biaya Admin & Umum", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 65000000, status: "Aktif" },
  { kode: "6160", nama: "Marketing", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 95000000, status: "Aktif" },
  { kode: "6170", nama: "Penyusutan Aset", kategori: "Beban Operasional", tipe: "Debit", saldoAwal: 0, saldoAkhir: 180000000, status: "Aktif" },
  // PENDAPATAN LAIN
  { kode: "7110", nama: "Pendapatan Bunga", kategori: "Pendapatan Lain", tipe: "Kredit", saldoAwal: 0, saldoAkhir: 12500000, status: "Aktif" },
  // BEBAN LAIN
  { kode: "8110", nama: "Beban Bunga", kategori: "Beban Lain", tipe: "Debit", saldoAwal: 0, saldoAkhir: 45000000, status: "Aktif" },
];

export const coaCategories: CoaCategory[] = [
  "Aset Lancar", "Aset Tetap", "Akumulasi Penyusutan",
  "Hutang Jangka Pendek", "Hutang Jangka Panjang",
  "Ekuitas", "Pendapatan", "COGS", "Beban Operasional",
  "Pendapatan Lain", "Beban Lain", "Pajak",
];

// ═══════════════════════════════════════════
// COA TREE STRUCTURE (for UI tree view)
// ═══════════════════════════════════════════
export interface CoaTreeNode {
  kode: string;
  nama: string;
  kategori: CoaCategory;
  tipe: "Debit" | "Kredit";
  saldoAwal: number;
  saldoAkhir: number;
  status: "Aktif" | "Arsip";
  children?: CoaTreeNode[];
  isGroup?: boolean;
}

function getGroupPrefix(kode: string): string {
  if (kode.length >= 1) return kode.substring(0, 1) + "000";
  return kode;
}

function getSubgroupPrefix(kode: string): string {
  if (kode.length >= 2) return kode.substring(0, 2) + "00";
  return kode;
}

export function buildCoaTree(accounts: CoaItem[]): CoaTreeNode[] {
  const roots: Record<string, CoaTreeNode> = {};
  const groups: Record<string, CoaTreeNode> = {};

  // Sort by kode ascending
  const sorted = [...accounts].sort((a, b) => a.kode.localeCompare(b.kode));

  sorted.forEach((acc) => {
    const groupPrefix = getGroupPrefix(acc.kode);
    const subgroupPrefix = getSubgroupPrefix(acc.kode);

    // Ensure root group exists
    if (!roots[groupPrefix]) {
      const groupName = getRootGroupName(groupPrefix);
      roots[groupPrefix] = {
        kode: groupPrefix,
        nama: groupName,
        kategori: acc.kategori,
        tipe: "Debit",
        saldoAwal: 0,
        saldoAkhir: 0,
        status: "Aktif",
        isGroup: true,
        children: [],
      };
    }

    // Ensure subgroup exists
    if (subgroupPrefix !== groupPrefix && !groups[subgroupPrefix]) {
      const subgroupNode: CoaTreeNode = {
        kode: subgroupPrefix,
        nama: getSubgroupName(subgroupPrefix),
        kategori: acc.kategori,
        tipe: "Debit",
        saldoAwal: 0,
        saldoAkhir: 0,
        status: "Aktif",
        isGroup: true,
        children: [],
      };
      groups[subgroupPrefix] = subgroupNode;
      roots[groupPrefix].children!.push(subgroupNode);
    }

    // Add leaf account
    const leaf: CoaTreeNode = {
      ...acc,
      isGroup: false,
    };

    if (groups[subgroupPrefix]) {
      groups[subgroupPrefix].children!.push(leaf);
    } else {
      roots[groupPrefix].children!.push(leaf);
    }
  });

  // Recalculate group balances from children
  Object.values(roots).forEach((root) => {
    recalcGroupBalance(root);
  });

  return Object.values(roots).sort((a, b) => a.kode.localeCompare(b.kode));
}

function recalcGroupBalance(node: CoaTreeNode): number {
  if (!node.children || node.children.length === 0) {
    return node.saldoAkhir;
  }
  let total = 0;
  node.children.forEach((child) => {
    total += recalcGroupBalance(child);
  });
  node.saldoAkhir = total;
  node.saldoAwal = total; // simplified
  return total;
}

function getRootGroupName(prefix: string): string {
  const map: Record<string, string> = {
    "1000": "1 - ASET",
    "2000": "2 - HUTANG",
    "3000": "3 - EKUITAS",
    "4000": "4 - PENDAPATAN",
    "5000": "5 - BEBAN POKOK PENDAPATAN",
    "6000": "6 - BEBAN OPERASIONAL",
    "7000": "7 - PENDAPATAN LAIN",
    "8000": "8 - BEBAN LAIN",
  };
  return map[prefix] || `${prefix} - AKUN`;
}

function getSubgroupName(prefix: string): string {
  const map: Record<string, string> = {
    "1100": "11 - Aset Lancar",
    "1200": "12 - Aset Tetap",
    "1300": "13 - Akumulasi Penyusutan",
    "2100": "21 - Hutang Jangka Pendek",
    "2200": "22 - Hutang Jangka Panjang",
    "3100": "31 - Ekuitas",
    "4100": "41 - Pendapatan Usaha",
    "4200": "42 - Pendapatan Maintenance",
    "4300": "43 - Penjualan Barang",
    "5100": "51 - Pembelian Material",
    "5200": "52 - Upah Langsung",
    "5300": "53 - Subkontraktor",
    "6100": "61 - Beban Operasional",
    "7100": "71 - Pendapatan Lain",
    "8100": "81 - Beban Lain",
  };
  return map[prefix] || `${prefix} - Sub Grup`;
}

// ═══════════════════════════════════════════
// JURNAL UMUM (GENERAL JOURNAL)
// ═══════════════════════════════════════════
export interface JurnalUmumItem {
  id: string;
  tanggal: string;
  noBukti: string;
  keterangan: string;
  referensi?: { tipe: string; noDokumen: string };
  detail: { kodeAkun: string; namaAkun: string; debit: number; kredit: number }[];
}

export const jurnalUmumList: JurnalUmumItem[] = [
  {
    id: "JU-001",
    tanggal: "2026-05-01",
    noBukti: "JU/2026/05/001",
    keterangan: "Penerimaan pembayaran invoice PT Maju Jaya",
    referensi: { tipe: "Invoice", noDokumen: "INV-2026-0045" },
    detail: [
      { kodeAkun: "1120", namaAkun: "Bank BCA", debit: 240000000, kredit: 0 },
      { kodeAkun: "1130", namaAkun: "Piutang Usaha", debit: 0, kredit: 240000000 },
    ],
  },
  {
    id: "JU-002",
    tanggal: "2026-05-02",
    noBukti: "JU/2026/05/002",
    keterangan: "Pembayaran pembelian material PT CoolTech",
    referensi: { tipe: "PO", noDokumen: "PO-2026-0011" },
    detail: [
      { kodeAkun: "2110", namaAkun: "Hutang Usaha", debit: 420000000, kredit: 0 },
      { kodeAkun: "1120", namaAkun: "Bank BCA", debit: 0, kredit: 420000000 },
    ],
  },
  {
    id: "JU-003",
    tanggal: "2026-05-03",
    noBukti: "JU/2026/05/003",
    keterangan: "Pembayaran gaji karyawan Mei 2026",
    detail: [
      { kodeAkun: "6110", namaAkun: "Gaji & Tunjangan", debit: 180000000, kredit: 0 },
      { kodeAkun: "1120", namaAkun: "Bank BCA", debit: 0, kredit: 180000000 },
    ],
  },
  {
    id: "JU-004",
    tanggal: "2026-05-04",
    noBukti: "JU/2026/05/004",
    keterangan: "Penerimaan pelunasan invoice CV Karya Mandiri",
    detail: [
      { kodeAkun: "1120", namaAkun: "Bank BCA", debit: 125000000, kredit: 0 },
      { kodeAkun: "1130", namaAkun: "Piutang Usaha", debit: 0, kredit: 125000000 },
    ],
  },
  {
    id: "JU-005",
    tanggal: "2026-05-05",
    noBukti: "JU/2026/05/005",
    keterangan: "Pembayaran cicilan pinjaman bank",
    referensi: { tipe: "BAP", noDokumen: "BAP-2026-0003" },
    detail: [
      { kodeAkun: "2210", namaAkun: "Pinjaman Jangka Panjang", debit: 75000000, kredit: 0 },
      { kodeAkun: "8110", namaAkun: "Beban Bunga", debit: 45000000, kredit: 0 },
      { kodeAkun: "1120", namaAkun: "Bank BCA", debit: 0, kredit: 120000000 },
    ],
  },
  {
    id: "JU-006",
    tanggal: "2026-05-10",
    noBukti: "JU/2026/05/006",
    keterangan: "Penyusutan aset tetap bulan Mei",
    detail: [
      { kodeAkun: "6170", namaAkun: "Penyusutan Aset", debit: 15000000, kredit: 0 },
      { kodeAkun: "1310", namaAkun: "Akum. Penyusutan Bangunan", debit: 0, kredit: 8333333 },
      { kodeAkun: "1320", namaAkun: "Akum. Penyusutan Kendaraan", debit: 0, kredit: 4166667 },
    ],
  },
  {
    id: "JU-007",
    tanggal: "2026-05-15",
    noBukti: "JU/2026/05/007",
    keterangan: "Pendapatan jasa konstruksi PT Delta Konstruksi",
    detail: [
      { kodeAkun: "1130", namaAkun: "Piutang Usaha", debit: 175000000, kredit: 0 },
      { kodeAkun: "4110", namaAkun: "Pendapatan Jasa Konstruksi", debit: 0, kredit: 175000000 },
    ],
  },
  {
    id: "JU-008",
    tanggal: "2026-05-20",
    noBukti: "JU/2026/05/008",
    keterangan: "Pembelian material proyek dari PT Maju Bersama",
    detail: [
      { kodeAkun: "5110", namaAkun: "Pembelian Material", debit: 195000000, kredit: 0 },
      { kodeAkun: "1160", namaAkun: "PPN Masukan", debit: 21450000, kredit: 0 },
      { kodeAkun: "2110", namaAkun: "Hutang Usaha", debit: 0, kredit: 216450000 },
    ],
  },
];

// ═══════════════════════════════════════════
// BUKU BESAR (GENERAL LEDGER) — aggregated entries
// ═══════════════════════════════════════════
export interface BukuBesarItem {
  id: string;
  tanggal: string;
  noBukti: string;
  keterangan: string;
  kodeAkun: string;
  namaAkun: string;
  debit: number;
  kredit: number;
  saldo: number;
}

function generateBukuBesar(): BukuBesarItem[] {
  const entries: BukuBesarItem[] = [];
  const saldoMap: Record<string, number> = {};

  // init saldo from COA saldo awal
  coaList.forEach((a) => {
    saldoMap[a.kode] = a.saldoAwal;
  });

  let counter = 1;
  jurnalUmumList.forEach((ju) => {
    ju.detail.forEach((d) => {
      const prevSaldo = saldoMap[d.kodeAkun] ?? 0;
      const newSaldo = prevSaldo + d.debit - d.kredit;
      saldoMap[d.kodeAkun] = newSaldo;
      entries.push({
        id: `BB-${String(counter++).padStart(4, "0")}`,
        tanggal: ju.tanggal,
        noBukti: ju.noBukti,
        keterangan: ju.keterangan,
        kodeAkun: d.kodeAkun,
        namaAkun: d.namaAkun,
        debit: d.debit,
        kredit: d.kredit,
        saldo: newSaldo,
      });
    });
  });

  return entries.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime() || a.id.localeCompare(b.id));
}

export const bukuBesarList = generateBukuBesar();

// ═══════════════════════════════════════════
// ASET TETAP (FIXED ASSETS)
// ═══════════════════════════════════════════
export interface AsetTetapItem {
  id: string;
  nama: string;
  kategori: string;
  tanggalBeli: string;
  nilaiPerolehan: number;
  umurEkonomis: number; // dalam bulan
  metodePenyusutan: "Garis Lurus" | "Saldo Menurun";
  penyusutanBulanan: number;
  akumulasiPenyusutan: number;
  nilaiBuku: number;
  kodeAkun: string;
  kodeAkumulasi: string;
  kodeBeban: string;
  status: "Aktif" | "Dijual" | "Dihapuskan";
}

export const asetTetapList: AsetTetapItem[] = [
  {
    id: "AST-001",
    nama: "Tanah Kavling Jakarta",
    kategori: "Tanah",
    tanggalBeli: "2020-01-15",
    nilaiPerolehan: 500000000,
    umurEkonomis: 0,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 0,
    akumulasiPenyusutan: 0,
    nilaiBuku: 500000000,
    kodeAkun: "1210",
    kodeAkumulasi: "",
    kodeBeban: "",
    status: "Aktif",
  },
  {
    id: "AST-002",
    nama: "Gudang & Kantor Medan",
    kategori: "Bangunan",
    tanggalBeli: "2021-06-20",
    nilaiPerolehan: 1500000000,
    umurEkonomis: 240,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 6250000,
    akumulasiPenyusutan: 300000000,
    nilaiBuku: 1200000000,
    kodeAkun: "1220",
    kodeAkumulasi: "1310",
    kodeBeban: "6170",
    status: "Aktif",
  },
  {
    id: "AST-003",
    nama: "Pickup Toyota Hilux",
    kategori: "Kendaraan",
    tanggalBeli: "2023-03-10",
    nilaiPerolehan: 350000000,
    umurEkonomis: 96,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 3645833,
    akumulasiPenyusutan: 100000000,
    nilaiBuku: 250000000,
    kodeAkun: "1230",
    kodeAkumulasi: "1320",
    kodeBeban: "6170",
    status: "Aktif",
  },
  {
    id: "AST-004",
    nama: "Pickup Isuzu D-Max",
    kategori: "Kendaraan",
    tanggalBeli: "2024-01-15",
    nilaiPerolehan: 320000000,
    umurEkonomis: 96,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 3333333,
    akumulasiPenyusutan: 53333328,
    nilaiBuku: 266666672,
    kodeAkun: "1230",
    kodeAkumulasi: "1320",
    kodeBeban: "6170",
    status: "Aktif",
  },
  {
    id: "AST-005",
    nama: "Genset 100KVA",
    kategori: "Peralatan",
    tanggalBeli: "2023-08-10",
    nilaiPerolehan: 180000000,
    umurEkonomis: 120,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 1500000,
    akumulasiPenyusutan: 30000000,
    nilaiBuku: 150000000,
    kodeAkun: "1240",
    kodeAkumulasi: "1330",
    kodeBeban: "6170",
    status: "Aktif",
  },
  {
    id: "AST-006",
    nama: "Mesin Las Industri",
    kategori: "Peralatan",
    tanggalBeli: "2024-02-20",
    nilaiPerolehan: 85000000,
    umurEkonomis: 120,
    metodePenyusutan: "Garis Lurus",
    penyusutanBulanan: 708333,
    akumulasiPenyusutan: 9916663,
    nilaiBuku: 75083337,
    kodeAkun: "1240",
    kodeAkumulasi: "1330",
    kodeBeban: "6170",
    status: "Aktif",
  },
];

// ═══════════════════════════════════════════
// BANK RECONCILIATION
// ═══════════════════════════════════════════
export interface BankRecItem {
  id: string;
  tanggal: string;
  keterangan: string;
  jumlah: number;
  tipe: "Masuk" | "Keluar";
  status: "Cleared" | "Uncleared" | "Reconciled";
  sumber: "Jurnal" | "Bank";
  noReferensi: string;
}

export const bankRecList: BankRecItem[] = [
  { id: "BR-001", tanggal: "2026-05-01", keterangan: "Penerimaan PT Maju Jaya", jumlah: 240000000, tipe: "Masuk", status: "Reconciled", sumber: "Jurnal", noReferensi: "TRF-20260501-001" },
  { id: "BR-002", tanggal: "2026-05-01", keterangan: "Penerimaan PT Maju Jaya", jumlah: 240000000, tipe: "Masuk", status: "Reconciled", sumber: "Bank", noReferensi: "TRF-20260501-001" },
  { id: "BR-003", tanggal: "2026-05-02", keterangan: "Pembayaran PT CoolTech", jumlah: 420000000, tipe: "Keluar", status: "Reconciled", sumber: "Jurnal", noReferensi: "TRF-20260502-002" },
  { id: "BR-004", tanggal: "2026-05-02", keterangan: "Pembayaran PT CoolTech", jumlah: 420000000, tipe: "Keluar", status: "Reconciled", sumber: "Bank", noReferensi: "TRF-20260502-002" },
  { id: "BR-005", tanggal: "2026-05-03", keterangan: "Transfer Gaji Karyawan", jumlah: 180000000, tipe: "Keluar", status: "Reconciled", sumber: "Jurnal", noReferensi: "PAY-20260503-001" },
  { id: "BR-006", tanggal: "2026-05-03", keterangan: "Transfer Gaji Karyawan", jumlah: 180000000, tipe: "Keluar", status: "Reconciled", sumber: "Bank", noReferensi: "PAY-20260503-001" },
  { id: "BR-007", tanggal: "2026-05-04", keterangan: "Penerimaan CV Karya Mandiri", jumlah: 125000000, tipe: "Masuk", status: "Reconciled", sumber: "Jurnal", noReferensi: "TRF-20260504-003" },
  { id: "BR-008", tanggal: "2026-05-04", keterangan: "Penerimaan CV Karya Mandiri", jumlah: 125000000, tipe: "Masuk", status: "Reconciled", sumber: "Bank", noReferensi: "TRF-20260504-003" },
  { id: "BR-009", tanggal: "2026-05-05", keterangan: "Auto Debit Cicilan Bank", jumlah: 125000000, tipe: "Keluar", status: "Reconciled", sumber: "Jurnal", noReferensi: "LOAN-20260505-001" },
  { id: "BR-010", tanggal: "2026-05-05", keterangan: "Auto Debit Cicilan Bank", jumlah: 125000000, tipe: "Keluar", status: "Reconciled", sumber: "Bank", noReferensi: "LOAN-20260505-001" },
  { id: "BR-011", tanggal: "2026-05-08", keterangan: "Biaya Admin Bank", jumlah: 25000, tipe: "Keluar", status: "Uncleared", sumber: "Bank", noReferensi: "ADM-20260508-001" },
  { id: "BR-012", tanggal: "2026-05-10", keterangan: "Transfer Modal dari Pemegang Saham", jumlah: 300000000, tipe: "Masuk", status: "Cleared", sumber: "Jurnal", noReferensi: "MOD-20260510-001" },
  { id: "BR-013", tanggal: "2026-05-12", keterangan: "Penerimaan PT Sejahtera (Angsuran)", jumlah: 100000000, tipe: "Masuk", status: "Cleared", sumber: "Jurnal", noReferensi: "TRF-20260512-004" },
];

// ═══════════════════════════════════════════
// SUMMARY HELPERS
// ═══════════════════════════════════════════
export const totalAset = [...neracaAktivaLancar, ...neracaAktivaTetap].reduce((s, i) => s + i.jumlah, 0);
export const totalKewajiban = neracaKewajiban.reduce((s, i) => s + i.jumlah, 0);
export const totalEkuitas = neracaEkuitas.reduce((s, i) => s + i.jumlah, 0);

export const totalPendapatan = labaRugiPendapatan.reduce((s, i) => s + i.jumlah, 0);
export const totalCogs = labaRugiCogs.reduce((s, i) => s + i.jumlah, 0);
export const totalBeban = labaRugiBeban.reduce((s, i) => s + i.jumlah, 0);
export const labaKotor = totalPendapatan - totalCogs;
export const labaBersih = labaKotor - totalBeban;

export const totalCashflowOperasional = cashflowOperasional.reduce((s, i) => s + i.jumlah, 0);
export const totalCashflowInvestasi = cashflowInvestasi.reduce((s, i) => s + i.jumlah, 0);
export const totalCashflowPendanaan = cashflowPendanaan.reduce((s, i) => s + i.jumlah, 0);
export const totalCashflow = totalCashflowOperasional + totalCashflowInvestasi + totalCashflowPendanaan;

export const totalPiutang = piutangList.reduce((s, i) => s + i.sisa, 0);
export const totalHutang = hutangList.reduce((s, i) => s + i.sisa, 0);

export const totalPajakKeluaran = pajakList.filter((p) => p.jenis === "Pajak Keluaran").reduce((s, p) => s + p.ppn, 0);
export const totalPajakMasukan = pajakList.filter((p) => p.jenis === "Pajak Masukan").reduce((s, p) => s + p.ppn, 0);
export const selisihPajak = totalPajakKeluaran - totalPajakMasukan;


// ═══════════════════════════════════════════
// PPh REPORT (WITHHOLDING TAX)
// ═══════════════════════════════════════════
export interface PphItem {
  id: string;
  noBukti: string;
  tanggal: string;
  pihak: string;
  npwp: string;
  jenisPph: string;
  tarif: number;
  dpp: number;
  pph: number;
  status: "Normal" | "Dibatalkan";
}

export const pphList: PphItem[] = [
  { id: "PPH-001", noBukti: "BUPOT-001", tanggal: "2026-05-05", pihak: "PT Maju Jaya", npwp: "09.123.456.7-123.000", jenisPph: "PPh 23 (Jasa)", tarif: 2, dpp: 3200000000, pph: 64000000, status: "Normal" },
  { id: "PPH-002", noBukti: "BUPOT-002", tanggal: "2026-05-05", pihak: "CV Karya Mandiri", npwp: "02.987.654.3-210.000", jenisPph: "PPh 23 (Jasa)", tarif: 2, dpp: 450000000, pph: 9000000, status: "Normal" },
  { id: "PPH-003", noBukti: "BUPOT-003", tanggal: "2026-05-10", pihak: "PT Delta Konstruksi", npwp: "01.234.567.8-901.000", jenisPph: "PPh 23 (Jasa)", tarif: 2, dpp: 175000000, pph: 3500000, status: "Normal" },
  { id: "PPH-004", noBukti: "BUPOT-004", tanggal: "2026-05-15", pihak: "PT CoolTech", npwp: "03.456.789.0-123.000", jenisPph: "PPh 23 (Jasa)", tarif: 2, dpp: 850000000, pph: 17000000, status: "Normal" },
  { id: "PPH-005", noBukti: "BUPOT-005", tanggal: "2026-05-20", pihak: "PT Maju Bersama", npwp: "07.654.321.0-987.000", jenisPph: "PPh 22 (Pembelian)", tarif: 1.5, dpp: 420000000, pph: 6300000, status: "Normal" },
  { id: "PPH-006", noBukti: "BUPOT-006", tanggal: "2026-05-25", pihak: "PT Sejahtera Abadi", npwp: "08.765.432.1-098.000", jenisPph: "PPh 23 (Jasa)", tarif: 2, dpp: 250000000, pph: 5000000, status: "Normal" },
];

// ═══════════════════════════════════════════
// PPN REPORT (SALES TAX)
// ═══════════════════════════════════════════
export interface PpnItem {
  id: string;
  noFaktur: string;
  tanggal: string;
  pihak: string;
  npwp: string;
  jenis: "Keluaran" | "Masukan";
  dpp: number;
  ppn: number;
  status: "Normal" | "Dibatalkan" | "Direvisi";
}

export const ppnList: PpnItem[] = [
  { id: "PPN-001", noFaktur: "010.123-45.67890123", tanggal: "2026-04-15", pihak: "PT Maju Jaya", npwp: "09.123.456.7-123.000", jenis: "Keluaran", dpp: 3200000000, ppn: 352000000, status: "Normal" },
  { id: "PPN-002", noFaktur: "010.123-45.67890124", tanggal: "2026-05-05", pihak: "CV Karya Mandiri", npwp: "02.987.654.3-210.000", jenis: "Keluaran", dpp: 450000000, ppn: 49500000, status: "Normal" },
  { id: "PPN-003", noFaktur: "020.987-65.43210987", tanggal: "2026-04-20", pihak: "PT CoolTech", npwp: "03.456.789.0-123.000", jenis: "Masukan", dpp: 850000000, ppn: 93500000, status: "Normal" },
  { id: "PPN-004", noFaktur: "020.987-65.43210988", tanggal: "2026-05-03", pihak: "PT Maju Bersama", npwp: "07.654.321.0-987.000", jenis: "Masukan", dpp: 420000000, ppn: 46200000, status: "Normal" },
  { id: "PPN-005", noFaktur: "020.987-65.43210989", tanggal: "2026-05-06", pihak: "PT Sejahtera Abadi", npwp: "08.765.432.1-098.000", jenis: "Masukan", dpp: 195000000, ppn: 21450000, status: "Normal" },
  { id: "PPN-006", noFaktur: "010.123-45.67890125", tanggal: "2026-05-15", pihak: "PT Delta Konstruksi", npwp: "01.234.567.8-901.000", jenis: "Keluaran", dpp: 175000000, ppn: 19250000, status: "Normal" },
];

// ═══════════════════════════════════════════
// BUDGET VS ACTUAL
// ═══════════════════════════════════════════
export interface BudgetActualItem {
  id: string;
  kodeAkun: string;
  namaAkun: string;
  kategori: string;
  anggaran: number;
  realisasi: number;
  selisih: number;
  persentase: number;
}

export const budgetActualList: BudgetActualItem[] = [
  { id: "BA-001", kodeAkun: "4110", namaAkun: "Pendapatan Jasa Konstruksi", kategori: "Pendapatan", anggaran: 3500000000, realisasi: 3200000000, selisih: 300000000, persentase: 91.4 },
  { id: "BA-002", kodeAkun: "4120", namaAkun: "Pendapatan Maintenance", kategori: "Pendapatan", anggaran: 900000000, realisasi: 850000000, selisih: 50000000, persentase: 94.4 },
  { id: "BA-003", kodeAkun: "4130", namaAkun: "Penjualan Barang", kategori: "Pendapatan", anggaran: 500000000, realisasi: 450000000, selisih: 50000000, persentase: 90.0 },
  { id: "BA-004", kodeAkun: "5110", namaAkun: "Pembelian Material", kategori: "COGS", anggaran: 1100000000, realisasi: 1200000000, selisih: -100000000, persentase: 109.1 },
  { id: "BA-005", kodeAkun: "5120", namaAkun: "Upah Langsung", kategori: "COGS", anggaran: 600000000, realisasi: 650000000, selisih: -50000000, persentase: 108.3 },
  { id: "BA-006", kodeAkun: "5130", namaAkun: "Subkontraktor", kategori: "COGS", anggaran: 450000000, realisasi: 480000000, selisih: -30000000, persentase: 106.7 },
  { id: "BA-007", kodeAkun: "6110", namaAkun: "Gaji & Tunjangan", kategori: "Beban Operasional", anggaran: 400000000, realisasi: 420000000, selisih: -20000000, persentase: 105.0 },
  { id: "BA-008", kodeAkun: "6120", namaAkun: "Transportasi", kategori: "Beban Operasional", anggaran: 80000000, realisasi: 85000000, selisih: -5000000, persentase: 106.3 },
  { id: "BA-009", kodeAkun: "6130", namaAkun: "Listrik & Air", kategori: "Beban Operasional", anggaran: 40000000, realisasi: 45000000, selisih: -5000000, persentase: 112.5 },
  { id: "BA-010", kodeAkun: "6140", namaAkun: "Sewa Kantor", kategori: "Beban Operasional", anggaran: 120000000, realisasi: 120000000, selisih: 0, persentase: 100.0 },
  { id: "BA-011", kodeAkun: "6150", namaAkun: "Biaya Admin & Umum", kategori: "Beban Operasional", anggaran: 60000000, realisasi: 65000000, selisih: -5000000, persentase: 108.3 },
  { id: "BA-012", kodeAkun: "6160", namaAkun: "Marketing", kategori: "Beban Operasional", anggaran: 100000000, realisasi: 95000000, selisih: 5000000, persentase: 95.0 },
  { id: "BA-013", kodeAkun: "6170", namaAkun: "Penyusutan Aset", kategori: "Beban Operasional", anggaran: 180000000, realisasi: 180000000, selisih: 0, persentase: 100.0 },
];

// ═══════════════════════════════════════════
// EXECUTIVE SUMMARY — TREND DATA (6 bulan)
// ═══════════════════════════════════════════
export interface TrendItem {
  bulan: string;
  pendapatan: number;
  cogs: number;
  beban: number;
  labaBersih: number;
}

export const trendData: TrendItem[] = [
  { bulan: "Des 2025", pendapatan: 2800000000, cogs: 1800000000, beban: 650000000, labaBersih: 350000000 },
  { bulan: "Jan 2026", pendapatan: 3100000000, cogs: 1950000000, beban: 700000000, labaBersih: 450000000 },
  { bulan: "Feb 2026", pendapatan: 2900000000, cogs: 1850000000, beban: 680000000, labaBersih: 370000000 },
  { bulan: "Mar 2026", pendapatan: 3300000000, cogs: 2100000000, beban: 720000000, labaBersih: 480000000 },
  { bulan: "Apr 2026", pendapatan: 3500000000, cogs: 2200000000, beban: 750000000, labaBersih: 550000000 },
  { bulan: "Mei 2026", pendapatan: 4500000000, cogs: 2330000000, beban: 1015000000, labaBersih: 1155000000 },
];

export const totalPphDipotong = pphList.reduce((s, p) => s + p.pph, 0);
export const totalPpnKeluaran = ppnList.filter((p) => p.jenis === "Keluaran").reduce((s, p) => s + p.ppn, 0);
export const totalPpnMasukan = ppnList.filter((p) => p.jenis === "Masukan").reduce((s, p) => s + p.ppn, 0);
export const totalAnggaran = budgetActualList.reduce((s, b) => s + b.anggaran, 0);
export const totalRealisasi = budgetActualList.reduce((s, b) => s + b.realisasi, 0);
export const totalSelisihBudget = totalAnggaran - totalRealisasi;

// ═══════════════════════════════════════════
// PAJAK TREND (for chart)
// ═══════════════════════════════════════════
export interface PajakTrendItem {
  bulan: string;
  ppnKeluaran: number;
  ppnMasukan: number;
  pph: number;
  status: "Sudah Lapor" | "Belum Lapor" | "Jatuh Tempo";
}

export const pajakTrend: PajakTrendItem[] = [
  { bulan: "Jan 2026", ppnKeluaran: 280000000, ppnMasukan: 120000000, pph: 45000000, status: "Sudah Lapor" },
  { bulan: "Feb 2026", ppnKeluaran: 310000000, ppnMasukan: 135000000, pph: 52000000, status: "Sudah Lapor" },
  { bulan: "Mar 2026", ppnKeluaran: 295000000, ppnMasukan: 110000000, pph: 48000000, status: "Sudah Lapor" },
  { bulan: "Apr 2026", ppnKeluaran: 352000000, ppnMasukan: 93500000, pph: 64000000, status: "Sudah Lapor" },
  { bulan: "Mei 2026", ppnKeluaran: 49500000, ppnMasukan: 46200000, pph: 9000000, status: "Belum Lapor" },
];
