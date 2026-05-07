"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, Banknote, XCircle, Trash2, AlertTriangle, CheckCircle, Search, ChevronDown } from "lucide-react";

interface BayarItem {
  id: string;
  noBap: string;
  vendor: string;
  jumlah: number;
  jatuhTempo: string;
  status: "Menunggu" | "Dibayar";
}

interface BAPSource {
  id: string;
  noBap: string;
  vendor: string;
  jumlahDibayarkan: number;
}

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const bapSourceList: BAPSource[] = [
  { id: "BAP-001", noBap: "011/BAP.BLM/PT CoolTech/KEU.PW/VIII/2024", vendor: "PT CoolTech", jumlahDibayarkan: 59846012 },
  { id: "BAP-002", noBap: "012/BAP.BLM/PT Maju Bersama/KEU.PW/IX/2024", vendor: "PT Maju Bersama", jumlahDibayarkan: 29932925 },
  { id: "BAP-003", noBap: "013/BAP.BLM/PT Sejahtera Abadi/KEU.PW/X/2024", vendor: "PT Sejahtera Abadi", jumlahDibayarkan: 117777772 },
];

const initialItems: BayarItem[] = [
  { id: "BAP-001", noBap: "011/BAP.BLM/PT CoolTech/KEU.PW/VIII/2024", vendor: "PT CoolTech", jumlah: 59846012, jatuhTempo: "10 Mei 2026", status: "Menunggu" },
  { id: "BAP-002", noBap: "012/BAP.BLM/PT Maju Bersama/KEU.PW/IX/2024", vendor: "PT Maju Bersama", jumlah: 29932925, jatuhTempo: "05 Mei 2026", status: "Dibayar" },
  { id: "BAP-003", noBap: "013/BAP.BLM/PT Sejahtera Abadi/KEU.PW/X/2024", vendor: "PT Sejahtera Abadi", jumlah: 117777772, jatuhTempo: "15 Mei 2026", status: "Menunggu" },
];

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];

const ACTIVE_STEP_INDEX = 4;

interface ConfirmModal {
  open: boolean;
  title: string;
  message: string;
  variant: "danger" | "primary";
  onConfirm: () => void;
}

export default function BayarPage() {
  const [items, setItems] = useState<BayarItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModal>({ open: false, title: "", message: "", variant: "primary", onConfirm: () => {} });

  // Modal form state
  const [selectedBapId, setSelectedBapId] = useState("");
  const [bapSearch, setBapSearch] = useState("");
  const [bapDropdownOpen, setBapDropdownOpen] = useState(false);
  const [formVendor, setFormVendor] = useState("");
  const [formJumlah, setFormJumlah] = useState("");
  const [formJatuhTempo, setFormJatuhTempo] = useState("");

  const formatTanggalID = (isoDate: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const filteredBapList = useMemo(() => {
    const q = bapSearch.toLowerCase();
    return bapSourceList.filter(
      (b) => b.noBap.toLowerCase().includes(q) || b.vendor.toLowerCase().includes(q)
    );
  }, [bapSearch]);

  const selectedBap = useMemo(() => bapSourceList.find((b) => b.id === selectedBapId), [selectedBapId]);

  const handleSelectBap = (bap: BAPSource) => {
    setSelectedBapId(bap.id);
    setBapSearch(bap.noBap);
    setBapDropdownOpen(false);
    setFormVendor(bap.vendor);
    setFormJumlah(fmt(bap.jumlahDibayarkan));
  };

  const resetModal = () => {
    setSelectedBapId("");
    setBapSearch("");
    setBapDropdownOpen(false);
    setFormVendor("");
    setFormJumlah("");
    setFormJatuhTempo("");
  };

  const openConfirm = (title: string, message: string, variant: "danger" | "primary", onConfirm: () => void) => {
    setConfirm({ open: true, title, message, variant, onConfirm });
  };

  const closeConfirm = () => setConfirm(prev => ({ ...prev, open: false }));

  const handlePay = (index: number) => {
    openConfirm(
      "Konfirmasi Pembayaran",
      `Apakah Anda yakin ingin membayar pembayaran untuk vendor ${items[index].vendor}?`,
      "primary",
      () => {
        setItems((prev) =>
          prev.map((item, i) =>
            i === index && item.status === "Menunggu"
              ? { ...item, status: "Dibayar" as const }
              : item
          )
        );
        closeConfirm();
      }
    );
  };

  const handleDelete = (index: number) => {
    openConfirm(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus pembayaran ${items[index].noBap}?`,
      "danger",
      () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
        closeConfirm();
      }
    );
  };

  const handleSave = () => {
    if (!selectedBapId || !formJatuhTempo) return;
    const jumlahNum = parseInt(formJumlah.replace(/[^0-9]/g, ""), 10) || 0;
    const newItem: BayarItem = {
      id: selectedBapId,
      noBap: selectedBap?.noBap || selectedBapId,
      vendor: formVendor,
      jumlah: jumlahNum,
      jatuhTempo: formatTanggalID(formJatuhTempo),
      status: "Menunggu",
    };
    setItems((prev) => [...prev, newItem]);
    resetModal();
    setModalOpen(false);
  };

  return (
    <SidebarLayout
      title="Listing Pembayaran"
      subtitle="List yang harus dibayarkan setelah BAP di-approve."
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link
            key={step.id}
            href={step.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              i === ACTIVE_STEP_INDEX
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {step.label}
          </Link>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            Daftar Pembayaran
          </h2>
          <button
            onClick={() => { resetModal(); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Proses Bayar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">No BAP</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Jumlah</th>
                <th className="px-6 py-3">Jatuh Tempo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada data pembayaran.
                  </td>
                </tr>
              )}
              {items.map((item, index) => {
                const statusClass =
                  item.status === "Dibayar"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

                return (
                  <tr key={item.id + index} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <Link
                        href={`/pengadaan/bap/${item.id}`}
                        className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.noBap}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-slate-700">{item.vendor}</td>
                    <td className="px-6 py-3 text-slate-700 font-medium">
                      {fmt(item.jumlah)}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{item.jatuhTempo}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusClass}`}>
                        {item.status === "Dibayar" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {item.status === "Menunggu" && (
                          <button
                            onClick={() => handlePay(index)}
                            className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Bayar"
                          >
                            <Banknote className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(index)}
                          className="inline-flex items-center justify-center p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">
                Proses Pembayaran Baru
              </h3>
              <button
                onClick={() => { setModalOpen(false); resetModal(); }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* No BAP searchable dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">No BAP <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={bapSearch}
                    onChange={(e) => { setBapSearch(e.target.value); setBapDropdownOpen(true); if (selectedBapId) { setSelectedBapId(""); setFormVendor(""); setFormJumlah(""); } }}
                    onFocus={() => setBapDropdownOpen(true)}
                    placeholder="Cari No BAP atau vendor..."
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setBapDropdownOpen((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className={`w-4 h-4 transition ${bapDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {bapDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredBapList.length === 0 && (
                      <div className="px-3 py-2 text-sm text-slate-400">Tidak ditemukan.</div>
                    )}
                    {filteredBapList.map((bap) => (
                      <button
                        key={bap.id}
                        onClick={() => handleSelectBap(bap)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                      >
                        <div className="font-medium text-slate-800 text-xs">{bap.noBap}</div>
                        <div className="text-xs text-slate-500">{bap.vendor} · {fmt(bap.jumlahDibayarkan)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  readOnly={!!selectedBapId}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedBapId ? "bg-slate-50 text-slate-500" : ""}`}
                  placeholder={selectedBapId ? "" : "Nama vendor"}
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah</label>
                <input
                  type="text"
                  value={formJumlah}
                  onChange={(e) => setFormJumlah(e.target.value)}
                  readOnly={!!selectedBapId}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedBapId ? "bg-slate-50 text-slate-500" : ""}`}
                  placeholder={selectedBapId ? "" : "Contoh: 10.000.000"}
                />
              </div>

              {/* Jatuh Tempo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jatuh Tempo <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formJatuhTempo}
                  onChange={(e) => setFormJatuhTempo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => { setModalOpen(false); resetModal(); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedBapId || !formJatuhTempo}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-sm">
            <div className="px-6 py-5 text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${confirm.variant === "danger" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
                {confirm.variant === "danger" ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">{confirm.title}</h3>
              <p className="text-sm text-slate-500">{confirm.message}</p>
            </div>
            <div className="flex items-center justify-center gap-2 px-6 pb-5">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={confirm.onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                  confirm.variant === "danger" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {confirm.variant === "danger" ? "Ya, Hapus" : "Ya, Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
