"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, CheckCircle, XCircle, Upload, Trash2, ChevronDown, ChevronUp, FileText, Banknote, Search } from "lucide-react";
import DatePicker from "@/components/DatePicker";

// ─── Types ───
interface Pihak { nama: string; nik: string; alamat: string; }
interface PembayaranPeriode { ke: number; keterangan: string; jumlah: number; }
interface POItemRef { nama: string; qty: number; satuan: string; hargaSatuan: number; }
interface BAPData {
  id: string;
  noBap: string;
  tanggal: string;
  pihakPertama: Pihak;
  pihakKedua: Pihak;
  noKontrak: string;
  tanggalKontrak: string;
  invoiceFile: string;
  kwitansiFile: string;
  bastFile: string;
  vendor: { nama: string; nik: string; jabatan: string; alamat: string; };
  bank: string;
  noRekening: string;
  atasNama: string;
  nilaiKontrak: number;
  pembayaranBapSekarang: number;
  akumulasiSebelumnya: number;
  periodeIni: number;
  retensiPercent: number;
  retensi: number;
  potonganLain: number;
  ppnPercent: number;
  ppn: number;
  jumlahPotongan: number;
  periodeIniSetelahPotong: number;
  jumlahSetelahPotong: number;
  jumlahDibayarkan: number;
  terbilang: string;
  historyPembayaran: PembayaranPeriode[];
  poItems: POItemRef[];
  approver: string;
  statusApproval: "draft" | "approved";
}

// ─── Utils ───
const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const ribuan = (n: number) => {
  if (n === 0) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const romanMonth = (m: number) => ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][m - 1];

function terbilang(n: number): string {
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (n < 12) return angka[Math.floor(n)];
  if (n < 20) return terbilang(n - 10) + " Belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
  if (n < 200) return "Seratus " + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
  if (n < 2000) return "Seribu " + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
  if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " Miliar " + terbilang(n % 1000000000);
  return "Terlalu besar";
}
const generateNoBAP = (index: number, vendorName: string) => {
  const now = new Date();
  const counter = String(index + 11).padStart(3, "0");
  const shortName = vendorName.replace(/PT |CV /g, "").split(" ")[0];
  return `${counter}/BAP.BLM/${shortName}/KEU.PW/${romanMonth(now.getMonth() + 1)}/${now.getFullYear()}`;
};

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];
const ACTIVE_STEP_INDEX = 3;

const approverList = ["Popy Wulandari", "Fahrul Rizal", "Andi Wijaya", "Direktur"];

// ─── PO Reference for Dropdown ───
interface PORef { noPo: string; supplier: string; nilai: number; items: POItemRef[]; bank: string; rekening: string; atasNama: string; }
const poRefList: PORef[] = [
  { noPo: "011/PO.BLM/Semangat Teknik/TKN.ASYA/VIII/2024", supplier: "PT CoolTech", nilai: 70781800, items: [
    { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
    { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
    { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
    { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
  ], bank: "BCA", rekening: "1234567890", atasNama: "PT CoolTech" },
  { noPo: "012/PO.BLM/Semangat Teknik/TKN.BETA/IX/2024", supplier: "PT Maju Bersama", nilai: 34132500, items: [
    { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
    { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
  ], bank: "Mandiri", rekening: "9876543210", atasNama: "PT Maju Bersama" },
  { noPo: "013/PO.BLM/Semangat Teknik/TKN.GAMA/X/2024", supplier: "PT Sejahtera Abadi", nilai: 139305000, items: [
    { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
    { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
    { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
    { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
    { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
  ], bank: "BRI", rekening: "5544331122", atasNama: "PT Sejahtera Abadi" },
];

// Helper: calc BAP formula
const calcBAP = (nilaiKontrak: number, akumulasi: number, retensiPct: number, potonganLain: number, ppnPct: number) => {
  const pembayaranBapSekarang = nilaiKontrak;
  const periodeIni = Math.max(0, pembayaranBapSekarang - akumulasi);
  const retensi = Math.round(periodeIni * (retensiPct / 100));
  const jumlahPotongan = retensi + potonganLain;
  const periodeIniSetelahPotong = Math.max(0, periodeIni - jumlahPotongan);
  const ppn = Math.round(periodeIniSetelahPotong * (ppnPct / 100));
  const jumlahSetelahPotong = Math.max(0, periodeIniSetelahPotong - ppn);
  const jumlahDibayarkan = jumlahSetelahPotong;
  return { pembayaranBapSekarang, periodeIni, retensi, jumlahPotongan, periodeIniSetelahPotong, ppn, jumlahSetelahPotong, jumlahDibayarkan };
};

// ─── Initial Data ───
const c1 = calcBAP(70781800, 0, 5, 0, 11);
const c2 = calcBAP(34132500, 0, 0, 500000, 11);
const c3 = calcBAP(139305000, 0, 5, 0, 11);

const initialBAPs: BAPData[] = [
  {
    id: "BAP-001",
    noBap: "011/BAP.BLM/PT CoolTech/KEU.PW/VIII/2024",
    tanggal: "2024-08-20",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "011/PO.BLM/Semangat Teknik/TKN.ASYA/VIII/2024",
    tanggalKontrak: "2024-08-15",
    invoiceFile: "INV-011-CoolTech-2024.pdf",
    kwitansiFile: "KW-011-CoolTech-2024.pdf",
    bastFile: "BAST-011-CoolTech-2024.pdf",
    vendor: { nama: "PT CoolTech", nik: "-", jabatan: "Vendor", alamat: "Jl. Teknologi No. 1, Jakarta" },
    bank: "BCA",
    noRekening: "1234567890",
    atasNama: "PT CoolTech",
    nilaiKontrak: 70781800,
    ...c1,
    akumulasiSebelumnya: 0,
    potonganLain: 0,
    retensiPercent: 5,
    ppnPercent: 11,
    terbilang: terbilang(c1.jumlahDibayarkan),
    historyPembayaran: [
      { ke: 1, keterangan: "Pembayaran ke 1 (DP 50%)", jumlah: c1.jumlahDibayarkan },
    ],
    poItems: [
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
      { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
      { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
      { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
    ],
    approver: "Fahrul Rizal",
    statusApproval: "approved",
  },
  {
    id: "BAP-002",
    noBap: "012/BAP.BLM/PT Maju Bersama/KEU.PW/IX/2024",
    tanggal: "2024-09-25",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "012/PO.BLM/Semangat Teknik/TKN.BETA/IX/2024",
    tanggalKontrak: "2024-09-20",
    invoiceFile: "INV-012-MajuBersama-2024.pdf",
    kwitansiFile: "KW-012-MajuBersama-2024.pdf",
    bastFile: "BAST-012-MajuBersama-2024.pdf",
    vendor: { nama: "PT Maju Bersama", nik: "-", jabatan: "Vendor", alamat: "Jl. Industri No. 5, Bandung" },
    bank: "Mandiri",
    noRekening: "9876543210",
    atasNama: "PT Maju Bersama",
    nilaiKontrak: 34132500,
    ...c2,
    akumulasiSebelumnya: 0,
    potonganLain: 500000,
    retensiPercent: 0,
    ppnPercent: 11,
    terbilang: terbilang(c2.jumlahDibayarkan),
    historyPembayaran: [
      { ke: 1, keterangan: "Pembayaran ke 1 (DP 60%)", jumlah: c2.jumlahDibayarkan },
    ],
    poItems: [
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
      { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
    ],
    approver: "Fahrul Rizal",
    statusApproval: "approved",
  },
  {
    id: "BAP-003",
    noBap: "013/BAP.BLM/PT Sejahtera Abadi/KEU.PW/X/2024",
    tanggal: "2024-10-30",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "013/PO.BLM/Semangat Teknik/TKN.GAMA/X/2024",
    tanggalKontrak: "2024-10-25",
    invoiceFile: "",
    kwitansiFile: "",
    bastFile: "",
    vendor: { nama: "PT Sejahtera Abadi", nik: "-", jabatan: "Vendor", alamat: "Jl. Konstruksi No. 10, Surabaya" },
    bank: "BRI",
    noRekening: "5544331122",
    atasNama: "PT Sejahtera Abadi",
    nilaiKontrak: 139305000,
    ...c3,
    akumulasiSebelumnya: 0,
    potonganLain: 0,
    retensiPercent: 5,
    ppnPercent: 11,
    terbilang: terbilang(c3.jumlahDibayarkan),
    historyPembayaran: [],
    poItems: [
      { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
      { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
      { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
      { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
      { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
    ],
    approver: "Direktur",
    statusApproval: "draft",
  },
];

export default function BAPPage() {
  const [baps, setBaps] = useState<BAPData[]>(initialBAPs);
  const [expandedId, setExpandedId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [kontrakSearch, setKontrakSearch] = useState("");
  const [kontrakDropdownOpen, setKontrakDropdownOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PORef | null>(null);
  const [modalItems, setModalItems] = useState<POItemRef[]>([]);
  const [form, setForm] = useState({
    vendor: "", noKontrak: "", tanggal: "", akumulasi: "", periodeIni: "", retensiPercent: "0", potonganLain: "0", ppnPercent: "11",
    bank: "", noRekening: "", atasNama: "", nilaiKontrak: "",
  });
  const [drafts, setDrafts] = useState<Record<string, { akumulasi?: number; retensi?: number; potonganLain?: number; ppn?: number }>>({});

  const toggleExpand = (id: string) => setExpandedId((p) => (p === id ? "" : id));

  const handleApprove = (index: number) => {
    setBaps((prev) => prev.map((b, i) => (i === index ? { ...b, statusApproval: "approved" as const } : b)));
  };

  const handleRemove = (index: number) => {
    const removedId = baps[index]?.id;
    setBaps((prev) => prev.filter((_, i) => i !== index));
    if (removedId) {
      setDrafts((prev) => { const n = { ...prev }; delete n[removedId]; return n; });
    }
  };

  const getDisplay = (bap: BAPData) => {
    const d = drafts[bap.id] || {};
    const akumulasi = d.akumulasi !== undefined ? d.akumulasi : bap.akumulasiSebelumnya;
    const retensi = d.retensi !== undefined ? d.retensi : bap.retensi;
    const potonganLain = d.potonganLain !== undefined ? d.potonganLain : bap.potonganLain;
    const ppn = d.ppn !== undefined ? d.ppn : bap.ppn;
    const pembayaranBapSekarang = bap.nilaiKontrak;
    const periodeIni = Math.max(0, pembayaranBapSekarang - akumulasi);
    const jumlahPotongan = retensi + potonganLain;
    const periodeIniSetelahPotong = Math.max(0, periodeIni - jumlahPotongan);
    const jumlahSetelahPotong = Math.max(0, periodeIniSetelahPotong - ppn);
    const jumlahDibayarkan = jumlahSetelahPotong;
    return { pembayaranBapSekarang, akumulasi, periodeIni, retensi, potonganLain, jumlahPotongan, periodeIniSetelahPotong, ppn, jumlahSetelahPotong, jumlahDibayarkan };
  };

  const isDirty = (bapId: string) => {
    const d = drafts[bapId];
    if (!d) return false;
    return d.akumulasi !== undefined || d.retensi !== undefined || d.potonganLain !== undefined || d.ppn !== undefined;
  };

  const saveDraft = (bapId: string) => {
    const bap = baps.find((b) => b.id === bapId);
    if (!bap) return;
    const v = getDisplay(bap);
    setBaps((prev) => prev.map((b) => b.id === bapId ? { ...b, akumulasiSebelumnya: v.akumulasi, retensi: v.retensi, potonganLain: v.potonganLain, ppn: v.ppn, pembayaranBapSekarang: v.pembayaranBapSekarang, periodeIni: v.periodeIni, jumlahPotongan: v.jumlahPotongan, periodeIniSetelahPotong: v.periodeIniSetelahPotong, jumlahSetelahPotong: v.jumlahSetelahPotong, jumlahDibayarkan: v.jumlahDibayarkan, terbilang: terbilang(v.jumlahDibayarkan) } : b));
    setDrafts((prev) => { const n = { ...prev }; delete n[bapId]; return n; });
  };

  const cancelDraft = (bapId: string) => {
    setDrafts((prev) => { const n = { ...prev }; delete n[bapId]; return n; });
  };

  const updateDraft = (bapId: string, field: string, value: number) => {
    setDrafts((prev) => ({ ...prev, [bapId]: { ...prev[bapId], [field]: value } }));
  };

  const filteredPO = useMemo(() => {
    if (!kontrakSearch.trim()) return poRefList;
    const q = kontrakSearch.toLowerCase();
    return poRefList.filter((p) => p.noPo.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q));
  }, [kontrakSearch]);

  const selectKontrak = (po: PORef) => {
    setSelectedPO(po);
    setKontrakSearch(po.noPo);
    setKontrakDropdownOpen(false);
    setForm((p) => ({
      ...p,
      noKontrak: po.noPo,
      vendor: po.supplier,
      nilaiKontrak: fmt(po.nilai),
      bank: po.bank,
      noRekening: po.rekening,
      atasNama: po.atasNama,
    }));
    setModalItems(po.items);
  };

  const resetModal = () => {
    setSelectedPO(null);
    setKontrakSearch("");
    setKontrakDropdownOpen(false);
    setModalItems([]);
    setForm({ vendor: "", noKontrak: "", tanggal: "", akumulasi: "", periodeIni: "", retensiPercent: "0", potonganLain: "0", ppnPercent: "11", bank: "", noRekening: "", atasNama: "", nilaiKontrak: "" });
  };

  const handleSave = () => {
    if (!selectedPO || !form.tanggal) return;
    const nilai = selectedPO.nilai;
    const akumulasi = parseInt(form.akumulasi.replace(/\D/g, "")) || 0;
    const retensiPct = parseFloat(form.retensiPercent) || 0;
    const potonganLain = parseInt(form.potonganLain.replace(/\D/g, "")) || 0;
    const ppnPct = parseFloat(form.ppnPercent) || 0;

    const c = calcBAP(nilai, akumulasi, retensiPct, potonganLain, ppnPct);

    const newBAP: BAPData = {
      id: `BAP-${String(baps.length + 1).padStart(3, "0")}`,
      noBap: generateNoBAP(baps.length, selectedPO.supplier),
      tanggal: form.tanggal,
      pihakPertama: { nama: "Popy Wulandari", nik: "-", alamat: "Medan" },
      pihakKedua: { nama: "Fahrul Rizal", nik: "-", alamat: "Jakarta" },
      noKontrak: selectedPO.noPo,
      tanggalKontrak: form.tanggal,
      invoiceFile: "",
      kwitansiFile: "",
      bastFile: "",
      vendor: { nama: selectedPO.supplier, nik: "-", jabatan: "Vendor", alamat: "-" },
      bank: form.bank || selectedPO.bank,
      noRekening: form.noRekening || selectedPO.rekening,
      atasNama: form.atasNama || selectedPO.atasNama,
      nilaiKontrak: nilai,
      akumulasiSebelumnya: akumulasi,
      potonganLain,
      retensiPercent: retensiPct,
      ppnPercent: ppnPct,
      terbilang: terbilang(c.jumlahDibayarkan),
      historyPembayaran: [{ ke: 1, keterangan: "Pembayaran periode ini", jumlah: c.jumlahDibayarkan }],
      poItems: modalItems,
      approver: approverList[Math.floor(Math.random() * approverList.length)],
      statusApproval: "draft",
      ...c,
    };
    setBaps((prev) => [...prev, newBAP]);
    resetModal();
    setModalOpen(false);
  };

  return (
    <SidebarLayout title="Berita Acara Pembayaran (BAP)" subtitle="Submit dan approval BAP untuk pembayaran vendor.">
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      {/* BAP Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left w-12">No</th>
                <th className="px-4 py-3 text-left">No BAP</th>
                <th className="px-4 py-3 text-left">Vendor</th>
                <th className="px-4 py-3 text-left">No Kontrak</th>
                <th className="px-4 py-3 text-left w-32">Tanggal</th>
                <th className="px-4 py-3 text-right w-36">Jumlah Dibayar</th>
                <th className="px-4 py-3 text-center w-24">Status</th>
                <th className="px-4 py-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {baps.map((bap, index) => {
                const isExpanded = expandedId === bap.id;
                return (
                  <>
                    <tr key={bap.id} className={`transition ${isExpanded ? "bg-slate-50" : "hover:bg-slate-50/50"}`}>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{bap.noBap}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{bap.vendor.nama}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{bap.noKontrak}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{bap.tanggal}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-medium text-emerald-700">{fmt(bap.jumlahDibayarkan)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${bap.statusApproval === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                          {bap.statusApproval === "approved" ? "Disetujui" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleExpand(bap.id)} className="inline-flex items-center justify-center text-slate-400 hover:text-blue-600 transition">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${bap.id}-detail`}>
                        <td colSpan={8} className="px-6 py-5 bg-slate-50/50 border-t border-slate-100">
                          {/* Info Cards */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            <div className="bg-white rounded-lg border border-slate-200 p-3">
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide">Tanggal BAP</div>
                              <div className="text-sm font-semibold text-slate-800 mt-0.5">{bap.tanggal}</div>
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 p-3">
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide">Pihak Pertama</div>
                              <div className="text-sm font-semibold text-slate-800 mt-0.5">{bap.pihakPertama.nama}</div>
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 p-3">
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide">Pihak Kedua</div>
                              <div className="text-sm font-semibold text-slate-800 mt-0.5">{bap.pihakKedua.nama}</div>
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 p-3">
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide">Jumlah Dibayar</div>
                              <div className="text-sm font-semibold text-emerald-700 mt-0.5">{fmt(bap.jumlahDibayarkan)}</div>
                            </div>
                          </div>

                          {/* Berdasarkan */}
                          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-5">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Berdasarkan</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-xs text-slate-400">Kontrak</div>
                                  <div className="font-medium text-slate-700">{bap.noKontrak}</div>
                                  <div className="text-[10px] text-slate-400">Tgl: {bap.tanggalKontrak}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-xs text-slate-400">Invoice</div>
                                  <div className="font-medium text-slate-700">{bap.invoiceFile || "—"}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-xs text-slate-400">Kwitansi</div>
                                  <div className="font-medium text-slate-700">{bap.kwitansiFile || "—"}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-xs text-slate-400">BAST</div>
                                  <div className="font-medium text-slate-700">{bap.bastFile || "—"}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Perhitungan Pembayaran */}
                          {(() => {
                            const v = getDisplay(bap);
                            return (
                              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-5">
                                <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Perhitungan Pembayaran</div>
                                <table className="w-full text-sm">
                                  <tbody className="divide-y divide-slate-100">
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600">1. Jumlah Pembayaran BAP Jika Terbayar Dengan Saat Ini</td>
                                      <td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(v.pembayaranBapSekarang)}</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600">2. Jumlah Akumulasi Pembayaran Sebelumnya</td>
                                      <td className="px-4 py-2 text-right">
                                        <input
                                          type="number"
                                          min={0}
                                          value={v.akumulasi}
                                          onChange={(e) => updateDraft(bap.id, "akumulasi", parseInt(e.target.value) || 0)}
                                          className="w-32 text-right text-xs font-mono border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                        />
                                      </td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                      <td className="px-4 py-2 text-slate-700 font-medium">3. Jumlah Pembayaran Yang Akan Dibayar Periode Ini (1 - 2)</td>
                                      <td className="px-4 py-2 text-right font-mono text-xs font-bold text-slate-800">{fmt(v.periodeIni)}</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600 pl-8">Retensi (nominal)</td>
                                      <td className="px-4 py-2 text-right">
                                        <input
                                          type="number"
                                          min={0}
                                          value={v.retensi}
                                          onChange={(e) => updateDraft(bap.id, "retensi", parseInt(e.target.value) || 0)}
                                          className="w-32 text-right text-xs font-mono border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600 pl-8">Potongan Lainnya</td>
                                      <td className="px-4 py-2 text-right">
                                        <input
                                          type="number"
                                          min={0}
                                          value={v.potonganLain}
                                          onChange={(e) => updateDraft(bap.id, "potonganLain", parseInt(e.target.value) || 0)}
                                          className="w-32 text-right text-xs font-mono border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600">4. Jumlah Potongan Saat Ini</td>
                                      <td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(v.jumlahPotongan)}</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                      <td className="px-4 py-2 text-slate-700 font-medium">5. Jumlah Pembayaran Yang Akan Dibayar Periode Ini (Setelah Dipotong)</td>
                                      <td className="px-4 py-2 text-right font-mono text-xs font-bold text-slate-800">{fmt(v.periodeIniSetelahPotong)}</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-2 text-slate-600 pl-8">PPN (nominal)</td>
                                      <td className="px-4 py-2 text-right">
                                        <input
                                          type="number"
                                          min={0}
                                          value={v.ppn}
                                          onChange={(e) => updateDraft(bap.id, "ppn", parseInt(e.target.value) || 0)}
                                          className="w-32 text-right text-xs font-mono border border-slate-200 hover:border-blue-300 focus:border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                        />
                                      </td>
                                    </tr>
                                    <tr className="bg-slate-50 font-semibold">
                                      <td className="px-4 py-2.5 text-slate-700">Jumlah Pembayaran BAP Ini (Setelah Dipotong) = 5 - PPN</td>
                                      <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(v.jumlahSetelahPotong)}</td>
                                    </tr>
                                    <tr className="bg-slate-50 font-semibold">
                                      <td className="px-4 py-2.5 text-slate-700">Jumlah Dibayarkan</td>
                                      <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(v.jumlahDibayarkan)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                                  <span className="font-semibold">Terbilang:</span> {terbilang(v.jumlahDibayarkan)} Rupiah
                                </div>
                                <div className="px-4 py-2 border-t border-slate-200 text-xs text-slate-500">
                                  <Banknote className="w-3 h-3 inline mr-1" />
                                  Bank: <span className="font-medium text-slate-700">{bap.bank}</span> · No Rek: <span className="font-medium text-slate-700">{bap.noRekening}</span> · Atas Nama: <span className="font-medium text-slate-700">{bap.atasNama}</span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Item dari PO */}
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-5">
                            <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Item dari PO / Kontrak</div>
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 text-xs font-medium text-slate-500">
                                <tr>
                                  <th className="px-4 py-2 text-left">Item</th>
                                  <th className="px-4 py-2 text-center w-16">Qty</th>
                                  <th className="px-4 py-2 text-center w-20">Satuan</th>
                                  <th className="px-4 py-2 text-right w-28">Harga Satuan</th>
                                  <th className="px-4 py-2 text-right w-28">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {bap.poItems.map((it, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 text-slate-800 font-medium text-xs">{it.nama}</td>
                                    <td className="px-4 py-2 text-center font-mono text-xs text-slate-600">{ribuan(it.qty)}</td>
                                    <td className="px-4 py-2 text-center text-xs text-slate-600">{it.satuan}</td>
                                    <td className="px-4 py-2 text-right font-mono text-xs text-slate-600">{fmt(it.hargaSatuan)}</td>
                                    <td className="px-4 py-2 text-right font-mono text-xs font-medium text-slate-700">{fmt(it.qty * it.hargaSatuan)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Rekapitulasi Kontrak */}
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-5">
                            <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Rekapitulasi Kontrak dan Pembayaran</div>
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 text-xs font-medium text-slate-500">
                                <tr>
                                  <th className="px-4 py-2 text-left">No</th>
                                  <th className="px-4 py-2 text-left">Uraian</th>
                                  <th className="px-4 py-2 text-right">Jumlah (Rp)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr>
                                  <td className="px-4 py-2 text-slate-600">I</td>
                                  <td className="px-4 py-2 font-medium text-slate-700">Nilai Kontrak</td>
                                  <td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(bap.nilaiKontrak)}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 text-slate-600">II</td>
                                  <td className="px-4 py-2 font-medium text-slate-700">Jumlah Pembayaran</td>
                                  <td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(getDisplay(bap).pembayaranBapSekarang)}</td>
                                </tr>
                                {bap.historyPembayaran.map((h) => (
                                  <tr key={h.ke}>
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2 text-slate-600 text-xs pl-6">{h.keterangan}</td>
                                    <td className="px-4 py-2 text-right font-mono text-xs text-slate-600">{fmt(h.jumlah)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td className="px-4 py-2 text-slate-600">III</td>
                                  <td className="px-4 py-2 font-medium text-slate-700">Retensi</td>
                                  <td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(getDisplay(bap).retensi)}</td>
                                </tr>
                                <tr className="bg-slate-50 font-semibold">
                                  <td className="px-4 py-2.5 text-slate-700">IV</td>
                                  <td className="px-4 py-2.5 text-slate-700">Sisa Kontrak (I - II - III)</td>
                                  <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(bap.nilaiKontrak - getDisplay(bap).pembayaranBapSekarang - getDisplay(bap).retensi)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">
                              Penanggung Jawab: <span className="font-medium text-slate-600">{bap.pihakPertama.nama}</span>
                              <span className="mx-2">·</span>
                              Menyetujui: <span className="font-medium text-slate-600">{bap.pihakKedua.nama}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isDirty(bap.id) && (
                                <>
                                  <button onClick={() => saveDraft(bap.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition">
                                    Simpan
                                  </button>
                                  <button onClick={() => cancelDraft(bap.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
                                    Batal
                                  </button>
                                </>
                              )}
                              {!isDirty(bap.id) && bap.statusApproval === "draft" && (
                                <button onClick={() => handleApprove(index)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition">
                                  <CheckCircle className="w-3.5 h-3.5" /> Setujui
                                </button>
                              )}
                              <button onClick={() => handleRemove(index)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition">
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4">
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
          <Plus className="w-4 h-4" /> Submit BAP
        </button>
      </div>

      {/* ─── Modal Submit BAP ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Submit BAP Baru</h3>
              <button onClick={() => { setModalOpen(false); resetModal(); }} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* No Kontrak Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">No Kontrak / PO</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={kontrakSearch}
                    onChange={(e) => { setKontrakSearch(e.target.value); setKontrakDropdownOpen(true); }}
                    onFocus={() => setKontrakDropdownOpen(true)}
                    placeholder="Cari no kontrak / PO..."
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {kontrakDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredPO.map((po) => (
                      <button
                        key={po.noPo}
                        onClick={() => selectKontrak(po)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 last:border-0"
                      >
                        <div className="font-semibold text-slate-800">{po.noPo}</div>
                        <div className="text-slate-500">{po.supplier} · {fmt(po.nilai)}</div>
                      </button>
                    ))}
                    {filteredPO.length === 0 && (
                      <div className="px-3 py-2 text-xs text-slate-400">Tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>

              {/* Auto-fill fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                  <input type="text" value={form.vendor} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nilai Kontrak</label>
                  <input type="text" value={form.nilaiKontrak} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank</label>
                  <input type="text" value={form.bank} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No Rekening</label>
                  <input type="text" value={form.noRekening} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Atas Nama</label>
                  <input type="text" value={form.atasNama} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>
              </div>

              {/* Manual fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal BAP</label>
                  <DatePicker value={form.tanggal} onChange={(d) => setForm((p) => ({ ...p, tanggal: d }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Akumulasi Sebelumnya (Rp)</label>
                  <input type="text" value={form.akumulasi} onChange={(e) => setForm((p) => ({ ...p, akumulasi: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rp 0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Retensi (%)</label>
                  <input type="number" min={0} max={100} value={form.retensiPercent} onChange={(e) => setForm((p) => ({ ...p, retensiPercent: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Potongan Lain (Rp)</label>
                  <input type="text" value={form.potonganLain} onChange={(e) => setForm((p) => ({ ...p, potonganLain: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rp 0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PPN (%)</label>
                  <input type="number" min={0} max={100} value={form.ppnPercent} onChange={(e) => setForm((p) => ({ ...p, ppnPercent: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Item dari PO */}
              {selectedPO && modalItems.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Item dari PO</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-center w-16">Qty</th>
                          <th className="px-3 py-2 text-center w-20">Satuan</th>
                          <th className="px-3 py-2 text-right w-28">Harga Satuan</th>
                          <th className="px-3 py-2 text-right w-28">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {modalItems.map((it, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 text-slate-800 font-medium text-xs">{it.nama}</td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-slate-600">{ribuan(it.qty)}</td>
                            <td className="px-3 py-2 text-center text-xs text-slate-600">{it.satuan}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-slate-600">{fmt(it.hargaSatuan)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs font-medium text-slate-700">{fmt(it.qty * it.hargaSatuan)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Lampiran</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Klik atau seret file PDF/Excel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => { setModalOpen(false); resetModal(); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={handleSave} disabled={!selectedPO || !form.tanggal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
