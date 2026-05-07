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
}

export const neracaAktivaLancar: NeracaItem[] = [
  { kode: "111", nama: "Kas & Bank", jumlah: 1250000000 },
  { kode: "112", nama: "Piutang Usaha", jumlah: 730000000 },
  { kode: "113", nama: "Persediaan Bahan", jumlah: 420000000 },
  { kode: "114", nama: "Uang Muka", jumlah: 150000000 },
];

export const neracaAktivaTetap: NeracaItem[] = [
  { kode: "121", nama: "Tanah", jumlah: 500000000 },
  { kode: "122", nama: "Bangunan (netto)", jumlah: 1200000000 },
  { kode: "123", nama: "Kendaraan (netto)", jumlah: 350000000 },
  { kode: "124", nama: "Peralatan Kantor (netto)", jumlah: 180000000 },
];

export const neracaKewajiban: NeracaItem[] = [
  { kode: "211", nama: "Hutang Usaha", jumlah: 890000000 },
  { kode: "212", nama: "Hutang Bank", jumlah: 750000000 },
  { kode: "213", nama: "Hutang Pajak", jumlah: 220000000 },
];

export const neracaEkuitas: NeracaItem[] = [
  { kode: "311", nama: "Modal Disetor", jumlah: 2000000000 },
  { kode: "312", nama: "Laba Ditahan", jumlah: 950000000 },
  { kode: "313", nama: "Laba Tahun Berjalan", jumlah: 1800000000 },
];

// ═══════════════════════════════════════════
// LABA RUGI
// ═══════════════════════════════════════════
export interface LabaRugiItem {
  nama: string;
  jumlah: number;
}

export const labaRugiPendapatan: LabaRugiItem[] = [
  { nama: "Jasa Konstruksi", jumlah: 3200000000 },
  { nama: "Jasa Maintenance", jumlah: 850000000 },
  { nama: "Penjualan Barang", jumlah: 450000000 },
];

export const labaRugiCogs: LabaRugiItem[] = [
  { nama: "Pembelian Material", jumlah: 1200000000 },
  { nama: "Upah Langsung", jumlah: 650000000 },
  { nama: "Subkontraktor", jumlah: 480000000 },
];

export const labaRugiBeban: LabaRugiItem[] = [
  { nama: "Gaji & Tunjangan", jumlah: 420000000 },
  { nama: "Transportasi", jumlah: 85000000 },
  { nama: "Listrik & Air", jumlah: 45000000 },
  { nama: "Sewa Kantor", jumlah: 120000000 },
  { nama: "Biaya Admin & Umum", jumlah: 65000000 },
  { nama: "Marketing", jumlah: 95000000 },
  { nama: "Penyusutan Aset", jumlah: 180000000 },
];

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
}

export const danaList: DanaItem[] = [
  { id: "DM-001", tanggal: "2026-05-01", tipe: "Masuk", sumber: "PT Maju Jaya", kategori: "Pendapatan", deskripsi: "Pembayaran Invoice INV-2026-0045 (DP 50%)", jumlah: 240000000, metode: "Transfer BCA", referensi: "TRF-20260501-001" },
  { id: "DM-002", tanggal: "2026-05-02", tipe: "Keluar", sumber: "PT CoolTech", kategori: "Pembelian", deskripsi: "Pembayaran PO-2026-0011 (AC Split 2 PK)", jumlah: 420000000, metode: "Transfer BCA", referensi: "TRF-20260502-002" },
  { id: "DM-003", tanggal: "2026-05-03", tipe: "Keluar", sumber: "Karyawan", kategori: "Gaji", deskripsi: "Gaji bulan Mei 2026", jumlah: 180000000, metode: "Transfer", referensi: "PAY-20260503-001" },
  { id: "DM-004", tanggal: "2026-05-04", tipe: "Masuk", sumber: "CV Karya Mandiri", kategori: "Pendapatan", deskripsi: "Pembayaran Invoice INV-2026-0051 (Lunas)", jumlah: 125000000, metode: "Transfer Mandiri", referensi: "TRF-20260504-003" },
  { id: "DM-005", tanggal: "2026-05-05", tipe: "Keluar", sumber: "Bank", kategori: "Cicilan", deskripsi: "Cicilan pinjaman bank bulan Mei", jumlah: 125000000, metode: "Auto Debit", referensi: "LOAN-20260505-001" },
  { id: "DM-006", tanggal: "2026-05-06", tipe: "Keluar", sumber: "Karyawan", kategori: "Biaya Operasional", deskripsi: "Reimburse transportasi & konsumsi", jumlah: 8500000, metode: "Kas", referensi: "REIM-20260506-001" },
  { id: "DM-007", tanggal: "2026-05-07", tipe: "Masuk", sumber: "Bank", kategori: "Bunga", deskripsi: "Bunga deposito 3 bulan", jumlah: 12500000, metode: "Auto", referensi: "BG-20260507-001" },
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
