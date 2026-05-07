"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, FileText, Trash2, ChevronDown, ChevronUp, XCircle, Search, Check, AlertCircle } from "lucide-react";

// ─── Data Pembanding Reference (vendor terpilih) ───
interface RefItem { nama: string; qty: number; satuan: string; hargaSatuan: number; }
interface RefPembanding { id: string; nomor: string; supplier: string; items: RefItem[]; }

const pembandingRef: RefPembanding[] = [
  {
    id: "PB-001",
    nomor: "Rev.014/RPHP.MRC-ME/TKN.ASYA/IX/2024",
    supplier: "PT CoolTech",
    items: [
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
      { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
      { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
      { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
    ],
  },
  {
    id: "PB-002",
    nomor: "Rev.015/RPHP.MRC-ME/TKN.BETA/X/2024",
    supplier: "PT Maju Bersama",
    items: [
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
      { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
    ],
  },
  {
    id: "PB-003",
    nomor: "Rev.016/RPHP.MRC-ME/TKN.GAMA/XI/2024",
    supplier: "PT Sejahtera Abadi",
    items: [
      { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
      { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
      { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
      { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
      { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
    ],
  },
];

const shippingTermsOptions = ["Darat", "Laut", "Udara", "Ekspedisi", "Kurir"];
const shippingMethodOptions = ["Dijemput", "Diantar", "Pick Up", "Door to Door"];
const approverList = ["Andi Wijaya", "Budi Santoso", "Direktur", "Citra Lestari"];

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

const generateNoPO = (pembandingNomor: string, existingCount: number) => {
  const match = pembandingNomor.match(/TKN\.([A-Z]+)/);
  const projectCode = match ? `TKN.${match[1]}` : "TKN.XXX";
  const now = new Date();
  const counter = String(existingCount + 11).padStart(3, "0"); // start from 011
  return `${counter}/PO.BLM/Semangat Teknik/${projectCode}/${romanMonth(now.getMonth() + 1)}/${now.getFullYear()}`;
};

// ─── Types ───
interface POItemRow { nama: string; qty: number; satuan: string; hargaSatuan: number; }
interface POData {
  id: string;
  noPo: string;
  noPembanding: string;
  supplier: string;
  shippingTerms: string;
  shippingMethod: string;
  deliveryDate: string;
  approver: string;
  statusApproval: "draft" | "approved";
  items: POItemRow[];
  pajakPercent: number;
  diskon: number;
}

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];
const ACTIVE_STEP_INDEX = 2;

const initialPOs: POData[] = [
  {
    id: "PO-001",
    noPo: "011/PO.BLM/Semangat Teknik/TKN.ASYA/VIII/2024",
    noPembanding: "Rev.014/RPHP.MRC-ME/TKN.ASYA/IX/2024",
    supplier: "PT CoolTech",
    shippingTerms: "Darat",
    shippingMethod: "Dijemput",
    deliveryDate: "2024-09-15",
    approver: "Direktur",
    statusApproval: "approved",
    items: [
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
      { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
      { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
      { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
    ],
    pajakPercent: 11,
    diskon: 0,
  },
  {
    id: "PO-002",
    noPo: "012/PO.BLM/Semangat Teknik/TKN.BETA/IX/2024",
    noPembanding: "Rev.015/RPHP.MRC-ME/TKN.BETA/X/2024",
    supplier: "PT Maju Bersama",
    shippingTerms: "Darat",
    shippingMethod: "Dijemput",
    deliveryDate: "2024-10-20",
    approver: "Direktur",
    statusApproval: "approved",
    items: [
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
      { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
    ],
    pajakPercent: 11,
    diskon: 0,
  },
  {
    id: "PO-003",
    noPo: "013/PO.BLM/Semangat Teknik/TKN.GAMA/X/2024",
    noPembanding: "Rev.016/RPHP.MRC-ME/TKN.GAMA/XI/2024",
    supplier: "PT Sejahtera Abadi",
    shippingTerms: "Darat",
    shippingMethod: "Dijemput",
    deliveryDate: "2024-11-05",
    approver: "Budi Santoso",
    statusApproval: "draft",
    items: [
      { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
      { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
      { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
      { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
      { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
    ],
    pajakPercent: 11,
    diskon: 0,
  },
];

export default function POPage() {
  const [pos, setPos] = useState<POData[]>(initialPOs);
  const [expandedId, setExpandedId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Modal Form State ───
  const [selectedPembanding, setSelectedPembanding] = useState<RefPembanding | null>(null);
  const [pembandingSearch, setPembandingSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // noPo di-generate otomatis saat save, tidak ditampilkan di form
  const [supplier, setSupplier] = useState("");
  const [shippingTerms, setShippingTerms] = useState("Darat");
  const [shippingTermsInput, setShippingTermsInput] = useState("Darat");
  const [shippingMethod, setShippingMethod] = useState("Dijemput");
  const [shippingMethodInput, setShippingMethodInput] = useState("Dijemput");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [modalItems, setModalItems] = useState<(RefItem & { checked: boolean; processed: boolean })[]>([]);
  const [pajakPercent, setPajakPercent] = useState(11);
  const [diskon, setDiskon] = useState(0);

  const toggleExpand = (id: string) => setExpandedId((p) => (p === id ? "" : id));

  // ─── Helpers ───
  const filteredPembanding = useMemo(() => {
    if (!pembandingSearch.trim()) return pembandingRef;
    const q = pembandingSearch.toLowerCase();
    return pembandingRef.filter((p) => p.nomor.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [pembandingSearch]);

  const getProcessedItems = (noPembanding: string) => {
    const processed = new Set<string>();
    pos.forEach((po) => {
      if (po.noPembanding === noPembanding) {
        po.items.forEach((it) => processed.add(it.nama));
      }
    });
    return processed;
  };

  const selectPembanding = (ref: RefPembanding) => {
    setSelectedPembanding(ref);
    setPembandingSearch(ref.nomor);
    setDropdownOpen(false);
    setSupplier(ref.supplier);
    const processed = getProcessedItems(ref.nomor);
    setModalItems(ref.items.map((it) => ({ ...it, checked: !processed.has(it.nama), processed: processed.has(it.nama) })));
  };

  const toggleItemCheck = (idx: number) => {
    setModalItems((prev) => prev.map((it, i) => (i === idx ? { ...it, checked: !it.checked } : it)));
  };

  const calcSummary = (items: typeof modalItems, tax: number, disc: number) => {
    const subtotal = items.filter((it) => it.checked).reduce((s, it) => s + it.qty * it.hargaSatuan, 0);
    const pajak = Math.round(subtotal * (tax / 100));
    const total = subtotal + pajak - disc;
    return { subtotal, pajak, total };
  };

  const { subtotal, pajak, total } = calcSummary(modalItems, pajakPercent, diskon);

  const resetModal = () => {
    setSelectedPembanding(null);
    setPembandingSearch("");
    setDropdownOpen(false);
    // noPo di-generate otomatis saat save
    setSupplier("");
    setShippingTerms("Darat");
    setShippingTermsInput("Darat");
    setShippingMethod("Dijemput");
    setShippingMethodInput("Dijemput");
    setDeliveryDate("");
    setModalItems([]);
    setPajakPercent(11);
    setDiskon(0);
  };

  const openModal = () => {
    resetModal();
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedPembanding || !supplier || !deliveryDate) return;
    const checkedItems = modalItems.filter((it) => it.checked && !it.processed);
    if (checkedItems.length === 0) return;
    const generatedNoPo = generateNoPO(selectedPembanding.nomor, pos.length);
    const newPO: POData = {
      id: `PO-${String(pos.length + 1).padStart(3, "0")}`,
      noPo: generatedNoPo,
      noPembanding: selectedPembanding.nomor,
      supplier,
      shippingTerms: shippingTermsInput || shippingTerms,
      shippingMethod: shippingMethodInput || shippingMethod,
      deliveryDate,
      approver: approverList[Math.floor(Math.random() * approverList.length)],
      statusApproval: "draft",
      items: checkedItems.map((it) => ({ nama: it.nama, qty: it.qty, satuan: it.satuan, hargaSatuan: it.hargaSatuan })),
      pajakPercent,
      diskon,
    };
    setPos((prev) => [...prev, newPO]);
    setModalOpen(false);
    resetModal();
  };

  const handleRemove = (index: number) => {
    setPos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SidebarLayout title="Purchase Order (PO)" subtitle="Pembuatan PO untuk vendor terpilih.">
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      {/* PO List */}
      <div className="space-y-3">
        {pos.map((po, index) => {
          const isExpanded = expandedId === po.id;
          const total = po.items.reduce((sum, it) => sum + it.qty * it.hargaSatuan, 0);
          const pajak = Math.round(total * (po.pajakPercent / 100));
          const grandTotal = total + pajak - po.diskon;

          return (
            <div key={po.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button onClick={() => toggleExpand(po.id)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isExpanded ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{po.supplier}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-400">{po.noPo}</span>
                      <span className="mx-1">·</span>
                      Pembanding: <span className="font-mono text-slate-400">{po.noPembanding}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <span className={`text-xs font-medium ${po.statusApproval === "approved" ? "text-emerald-600" : "text-amber-600"}`}>
                      {po.approver}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-xs font-medium ${po.statusApproval === "approved" ? "text-emerald-600" : "text-amber-600"}`}>
                      {po.statusApproval === "approved" ? "Disetujui" : "Menunggu Approval"}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${po.statusApproval === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {po.statusApproval === "approved" ? "Disetujui" : "Draft"}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Shipping Terms</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5">{po.shippingTerms}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Shipping Method</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5">{po.shippingMethod}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Delivery Date</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5">{po.deliveryDate}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Approver</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5">{po.approver}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Total PO</div>
                      <div className="text-sm font-semibold text-emerald-700 mt-0.5">{fmt(grandTotal)}</div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-3 py-2.5 text-left font-medium border-b border-slate-200">Item</th>
                          <th className="px-3 py-2.5 text-center font-medium border-b border-slate-200 w-20">Qty</th>
                          <th className="px-3 py-2.5 text-center font-medium border-b border-slate-200 w-20">Satuan</th>
                          <th className="px-3 py-2.5 text-center font-medium border-b border-slate-200 w-32">Harga Satuan</th>
                          <th className="px-3 py-2.5 text-right font-medium border-b border-slate-200 w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {po.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 text-slate-800 font-medium">{it.nama}</td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-slate-600">{ribuan(it.qty)}</td>
                            <td className="px-3 py-2 text-center text-xs text-slate-600">{it.satuan}</td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-slate-600">{fmt(it.hargaSatuan)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs font-semibold text-slate-700">{fmt(it.qty * it.hargaSatuan)}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50">
                          <td className="px-3 py-2 text-slate-600 text-xs" colSpan={4}>Subtotal</td>
                          <td className="px-3 py-2 text-right font-mono text-xs text-slate-700">{fmt(total)}</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="px-3 py-2 text-slate-600 text-xs" colSpan={4}>Pajak ({po.pajakPercent}%)</td>
                          <td className="px-3 py-2 text-right font-mono text-xs text-slate-700">{fmt(pajak)}</td>
                        </tr>
                        {po.diskon > 0 && (
                          <tr className="bg-slate-50">
                            <td className="px-3 py-2 text-slate-600 text-xs" colSpan={4}>Diskon</td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-red-600">- {fmt(po.diskon)}</td>
                          </tr>
                        )}
                        <tr className="bg-slate-50 font-semibold">
                          <td className="px-3 py-2.5 text-slate-700" colSpan={4}>Grand Total</td>
                          <td className="px-3 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(grandTotal)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
                      <FileText className="w-3.5 h-3.5" /> Cetak PO
                    </button>
                    <button onClick={() => handleRemove(index)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5" /> Hapus PO
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button onClick={openModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
          <Plus className="w-4 h-4" /> Buat PO
        </button>
      </div>

      {/* ─── Modal Buat PO ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Buat PO Baru</h3>
              <button onClick={() => { setModalOpen(false); resetModal(); }} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* No Pembanding Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">No Pembanding</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={pembandingSearch}
                      onChange={(e) => { setPembandingSearch(e.target.value); setDropdownOpen(true); }}
                      onFocus={() => setDropdownOpen(true)}
                      placeholder="Cari no pembanding..."
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredPembanding.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => selectPembanding(p)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 last:border-0"
                        >
                          <div className="font-semibold text-slate-800">{p.nomor}</div>
                          <div className="text-slate-500">{p.supplier} · {p.items.length} item</div>
                        </button>
                      ))}
                      {filteredPembanding.length === 0 && (
                        <div className="px-3 py-2 text-xs text-slate-400">Tidak ditemukan</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                  <input type="text" value={supplier} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed" />
                </div>

                {/* Shipping Terms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Terms</label>
                  <input
                    type="text"
                    list="terms-list"
                    value={shippingTermsInput}
                    onChange={(e) => { setShippingTermsInput(e.target.value); setShippingTerms(e.target.value); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pilih atau ketik..."
                  />
                  <datalist id="terms-list">
                    {shippingTermsOptions.map((o) => (<option key={o} value={o} />))}
                  </datalist>
                </div>

                {/* Shipping Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Method</label>
                  <input
                    type="text"
                    list="method-list"
                    value={shippingMethodInput}
                    onChange={(e) => { setShippingMethodInput(e.target.value); setShippingMethod(e.target.value); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pilih atau ketik..."
                  />
                  <datalist id="method-list">
                    {shippingMethodOptions.map((o) => (<option key={o} value={o} />))}
                  </datalist>
                </div>

                {/* Delivery Date */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* ─── Item List ─── */}
              {selectedPembanding && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">Item dari Pembanding</label>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-slate-500"><AlertCircle className="w-3 h-3 text-amber-500" /> Sudah di-PO</span>
                      <span className="flex items-center gap-1 text-slate-500"><Check className="w-3 h-3 text-emerald-500" /> Belum di-PO</span>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left w-10"></th>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-center w-16">Qty</th>
                          <th className="px-3 py-2 text-center w-20">Satuan</th>
                          <th className="px-3 py-2 text-right w-28">Harga Satuan</th>
                          <th className="px-3 py-2 text-right w-28">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {modalItems.map((it, idx) => (
                          <tr key={idx} className={it.processed ? "bg-slate-50/60" : ""}>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={it.checked}
                                disabled={it.processed}
                                onChange={() => toggleItemCheck(idx)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-medium ${it.processed ? "text-slate-400" : "text-slate-800"}`}>{it.nama}</span>
                                {it.processed && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-medium">Sudah di-PO</span>}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-slate-600">{ribuan(it.qty)}</td>
                            <td className="px-3 py-2 text-center text-xs text-slate-600">{it.satuan}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-slate-600">{fmt(it.hargaSatuan)}</td>
                            <td className="px-3 py-2 text-right font-mono text-xs text-slate-600">{fmt(it.qty * it.hargaSatuan)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── Summary ─── */}
              {selectedPembanding && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-mono font-medium text-slate-800">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Pajak</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={pajakPercent}
                        onChange={(e) => setPajakPercent(parseInt(e.target.value) || 0)}
                        className="w-14 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                    <span className="font-mono text-slate-700">{fmt(pajak)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Diskon</span>
                      <input
                        type="number"
                        min={0}
                        value={diskon}
                        onChange={(e) => setDiskon(parseInt(e.target.value) || 0)}
                        className="w-24 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <span className="font-mono text-red-600">- {fmt(diskon)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Total</span>
                    <span className="font-mono font-bold text-emerald-700">{fmt(total)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => { setModalOpen(false); resetModal(); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button
                onClick={handleSave}
                disabled={!selectedPembanding || modalItems.filter((it) => it.checked && !it.processed).length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
