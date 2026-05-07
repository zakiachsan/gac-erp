// Shared data layer for Biaya Operasional — persisted via localStorage

export interface ApprovalStep {
  level: number;
  role: string;
  name: string;
  status: "waiting" | "approved" | "rejected";
  date?: string;
  note?: string;
}

export interface BiayaItem {
  id: string;
  no: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  lampiran: string;
  steps: ApprovalStep[];
  status: "Draft" | "Menunggu" | "Disetujui" | "Ditolak";
  paid: boolean;
}

export const STORAGE_KEY = "gac-biaya-operasional";

export const approverConfig = [
  { level: 1, role: "Pengaju", name: "Admin", autoApprove: true },
  { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)" },
  { level: 3, role: "Menyetujui", name: "Direktur" },
];

export const kategoriList = [
  "Transportasi",
  "Makan",
  "Material Operasional",
  "Perjalanan Dinas",
  "Konsumsi Rapat",
  "Lainnya",
];

const generateNo = (index: number) =>
  `BO-${String(index + 1).padStart(3, "0")}/${new Date().getFullYear()}`;

export const initialItems: BiayaItem[] = [
  {
    id: "BO-001",
    no: generateNo(0),
    tanggal: "2026-05-01",
    kategori: "Transportasi",
    deskripsi: "Biaya bensin kunjungan proyek Semangat Teknik ke site Medan",
    jumlah: 2500000,
    lampiran: "kwitansi_bensin_001.pdf",
    steps: [
      { level: 1, role: "Pengaju", name: "Admin", status: "approved", date: "2026-05-01" },
      { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)", status: "approved", date: "2026-05-02" },
      { level: 3, role: "Menyetujui", name: "Direktur", status: "approved", date: "2026-05-03" },
    ],
    status: "Disetujui",
    paid: true,
  },
  {
    id: "BO-002",
    no: generateNo(1),
    tanggal: "2026-05-05",
    kategori: "Makan",
    deskripsi: "Konsumsi rapat koordinasi internal tim proyek",
    jumlah: 850000,
    lampiran: "nota_makan_002.pdf",
    steps: [
      { level: 1, role: "Pengaju", name: "Admin", status: "approved", date: "2026-05-05" },
      { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)", status: "approved", date: "2026-05-06" },
      { level: 3, role: "Menyetujui", name: "Direktur", status: "waiting" },
    ],
    status: "Menunggu",
    paid: false,
  },
  {
    id: "BO-003",
    no: generateNo(2),
    tanggal: "2026-05-06",
    kategori: "Perjalanan Dinas",
    deskripsi: "Tiket pesawat Jakarta – Medan untuk supervisi proyek",
    jumlah: 3200000,
    lampiran: "",
    steps: [
      { level: 1, role: "Pengaju", name: "Admin", status: "approved", date: "2026-05-06" },
      { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)", status: "waiting" },
      { level: 3, role: "Menyetujui", name: "Direktur", status: "waiting" },
    ],
    status: "Menunggu",
    paid: false,
  },
  {
    id: "BO-004",
    no: generateNo(3),
    tanggal: "2026-05-02",
    kategori: "Material Operasional",
    deskripsi: "Pembelian kabel LAN dan switch hub untuk kantor",
    jumlah: 1450000,
    lampiran: "invoice_elektronik_004.pdf",
    steps: [
      { level: 1, role: "Pengaju", name: "Admin", status: "approved", date: "2026-05-02" },
      { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)", status: "approved", date: "2026-05-03" },
      { level: 3, role: "Menyetujui", name: "Direktur", status: "approved", date: "2026-05-04" },
    ],
    status: "Disetujui",
    paid: false,
  },
  {
    id: "BO-005",
    no: generateNo(4),
    tanggal: "2026-05-03",
    kategori: "Transportasi",
    deskripsi: "Parkir harian kantor & tol mingguan",
    jumlah: 650000,
    lampiran: "",
    steps: [
      { level: 1, role: "Pengaju", name: "Admin", status: "approved", date: "2026-05-03" },
      { level: 2, role: "Mengetahui", name: "Andi Wijaya (SPV Ops)", status: "approved", date: "2026-05-04" },
      { level: 3, role: "Menyetujui", name: "Direktur", status: "approved", date: "2026-05-05" },
    ],
    status: "Disetujui",
    paid: false,
  },
];

export function calcOverallStatus(steps: ApprovalStep[]): BiayaItem["status"] {
  if (steps.some((s) => s.status === "rejected")) return "Ditolak";
  if (steps.every((s) => s.status === "approved")) return "Disetujui";
  return "Menunggu";
}

export function loadBiayaItems(): BiayaItem[] {
  if (typeof window === "undefined") return initialItems;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialItems;
    const parsed = JSON.parse(raw) as BiayaItem[];
    return parsed.length > 0 ? parsed : initialItems;
  } catch {
    return initialItems;
  }
}

export function saveBiayaItems(items: BiayaItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function resetBiayaItems() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function fmt(n: number) {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatTanggalID(isoDate: string) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
