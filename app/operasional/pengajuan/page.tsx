"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Plus, XCircle, ChevronDown, CheckCircle2, X, AlertCircle,
  Clock, FileText, Banknote, UserCheck, ArrowRight, Eye
} from "lucide-react";
import DatePicker from "@/components/DatePicker";
import {
  BiayaItem, ApprovalStep,
  loadBiayaItems, saveBiayaItems,
  approverConfig, kategoriList,
  calcOverallStatus, fmt, formatTanggalID
} from "@/lib/biayaData";

const stepsNav = [
  { id: "pengajuan", label: "1. Pengajuan Biaya", href: "/operasional/pengajuan" },
  { id: "bayar", label: "2. Listing Bayar", href: "/operasional/bayar" },
  { id: "laporan", label: "3. Laporan", href: "/operasional/laporan" },
];
const ACTIVE_STEP_INDEX = 0;

export default function PengajuanBiayaPage() {
  const router = useRouter();
  const [items, setItems] = useState<BiayaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean; title: string; message: string; variant: "approve" | "reject";
    itemId: string; level: number;
  } | null>(null);
  const [historyModal, setHistoryModal] = useState<{ open: boolean; item: BiayaItem | null }>({ open: false, item: null });

  const [form, setForm] = useState({
    tanggal: "",
    kategori: "",
    deskripsi: "",
    jumlah: "",
    lampiran: "",
  });
  const [katDropdown, setKatDropdown] = useState(false);

  useEffect(() => {
    const data = loadBiayaItems();
    setItems(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBiayaItems(items);
  }, [items, loaded]);

  const openConfirm = (itemId: string, level: number, variant: "approve" | "reject") => {
    const item = items.find((i) => i.id === itemId);
    const step = item?.steps.find((s) => s.level === level);
    const title = variant === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan";
    const message = variant === "approve"
      ? `Setujui pengajuan ${item?.no} pada level ${step?.role}?`
      : `Tolak pengajuan ${item?.no} pada level ${step?.role}?`;
    setConfirm({ open: true, title, message, variant, itemId, level });
  };

  const closeConfirm = () => setConfirm(null);

  const executeApproval = () => {
    if (!confirm) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== confirm.itemId) return item;
        const newSteps = item.steps.map((s) => {
          if (s.level !== confirm.level) return s;
          return {
            ...s,
            status: confirm.variant === "approve" ? ("approved" as const) : ("rejected" as const),
            date: new Date().toISOString().slice(0, 10),
          };
        });
        return { ...item, steps: newSteps, status: calcOverallStatus(newSteps) };
      })
    );
    closeConfirm();
  };

  const handleSave = () => {
    if (!form.tanggal || !form.kategori || !form.deskripsi || !form.jumlah) return;
    const jumlahNum = parseInt(form.jumlah.replace(/[^0-9]/g, ""), 10) || 0;
    const newSteps: ApprovalStep[] = approverConfig.map((cfg) => ({
      level: cfg.level,
      role: cfg.role,
      name: cfg.name,
      status: cfg.autoApprove ? "approved" : "waiting",
      date: cfg.autoApprove ? form.tanggal : undefined,
    }));
    const newId = `BO-${String(items.length + 1).padStart(3, "0")}`;
    const newItem: BiayaItem = {
      id: newId,
      no: `${newId}/2026`,
      tanggal: form.tanggal,
      kategori: form.kategori,
      deskripsi: form.deskripsi,
      jumlah: jumlahNum,
      lampiran: form.lampiran,
      steps: newSteps,
      status: calcOverallStatus(newSteps),
      paid: false,
    };
    setItems((prev) => [newItem, ...prev]);
    setForm({ tanggal: "", kategori: "", deskripsi: "", jumlah: "", lampiran: "" });
    setModalOpen(false);
  };

  const statusBadge = (status: BiayaItem["status"]) => {
    switch (status) {
      case "Disetujui": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Ditolak": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Menunggu": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getWaitingStep = (item: BiayaItem) => {
    return item.steps.find((s) => s.status === "waiting" && (s.level === 1 || item.steps.find((p) => p.level === s.level - 1)?.status === "approved"));
  };

  return (
    <SidebarLayout
      title="Pengajuan Biaya Operasional"
      subtitle="Ajukan rincian biaya operasional dengan approval berjenjang."
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {stepsNav.map((step, i) => (
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Pengajuan", value: items.length, icon: FileText, color: "text-blue-600" },
          { label: "Menunggu", value: items.filter((i) => i.status === "Menunggu").length, icon: Clock, color: "text-amber-600" },
          { label: "Disetujui", value: items.filter((i) => i.status === "Disetujui").length, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Ditolak", value: items.filter((i) => i.status === "Ditolak").length, icon: X, color: "text-rose-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</div>
              <div className="text-lg font-bold text-slate-800">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Daftar Pengajuan Biaya</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Ajukan Biaya
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Deskripsi</th>
                <th className="px-6 py-3">Jumlah</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">Tidak ada data pengajuan.</td></tr>
              )}
              {items.map((item) => {
                const isFullyApproved = item.status === "Disetujui";
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-mono text-xs text-slate-700">{item.no}</td>
                    <td className="px-6 py-3 text-slate-700">{formatTanggalID(item.tanggal)}</td>
                    <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{item.kategori}</span></td>
                    <td className="px-6 py-3 text-slate-700 max-w-xs truncate">{item.deskripsi}</td>
                    <td className="px-6 py-3 font-medium text-slate-800">{fmt(item.jumlah)}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setHistoryModal({ open: true, item })}
                        className="flex flex-col gap-0.5 items-start text-left"
                      >
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border w-fit ${statusBadge(item.status)}`}>
                          {item.status}
                          <Eye className="w-3 h-3 ml-1 opacity-60" />
                        </span>
                        {item.status === "Menunggu" && (
                          <span className="text-[10px] text-amber-600 font-medium text-left">
                            {(() => {
                              const ws = getWaitingStep(item);
                              return ws ? ws.name : "";
                            })()}
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {isFullyApproved && !item.paid && (
                          <button
                            onClick={() => router.push("/operasional/bayar")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition mr-1"
                            title="Proses ke Pembayaran"
                          >
                            Bayar
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {isFullyApproved && item.paid && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg">
                            <Banknote className="w-3 h-3" />
                            Lunas
                          </span>
                        )}
                        {item.steps.map((step) => {
                          if (step.status !== "waiting") return null;
                          const prevApproved = step.level === 1 || item.steps.find((s) => s.level === step.level - 1)?.status === "approved";
                          if (!prevApproved) return null;
                          return (
                            <div key={step.level} className="flex items-center gap-1">
                              <button
                                onClick={() => openConfirm(item.id, step.level, "approve")}
                                className="inline-flex items-center justify-center p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title={`Setujui — ${step.role}`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openConfirm(item.id, step.level, "reject")}
                                className="inline-flex items-center justify-center p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title={`Tolak — ${step.role}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Ajukan Biaya Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                <DatePicker value={form.tanggal} onChange={(d) => setForm((p) => ({ ...p, tanggal: d }))} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                <button
                  onClick={() => setKatDropdown((p) => !p)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white hover:bg-slate-50 transition"
                >
                  <span className={form.kategori ? "text-slate-800" : "text-slate-400"}>{form.kategori || "Pilih kategori"}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition ${katDropdown ? "rotate-180" : ""}`} />
                </button>
                {katDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {kategoriList.map((k) => (
                      <button
                        key={k}
                        onClick={() => { setForm((p) => ({ ...p, kategori: k })); setKatDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Jelaskan rincian pengajuan biaya..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.jumlah}
                  onChange={(e) => setForm((p) => ({ ...p, jumlah: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2.500.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lampiran</label>
                <input
                  type="text"
                  value={form.lampiran}
                  onChange={(e) => setForm((p) => ({ ...p, lampiran: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama file lampiran"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button
                onClick={handleSave}
                disabled={!form.tanggal || !form.kategori || !form.deskripsi || !form.jumlah}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal — Riwayat Approval */}
      {historyModal.open && historyModal.item && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Riwayat Approval</h3>
                <p className="text-xs text-slate-500">{historyModal.item.no}</p>
              </div>
              <button onClick={() => setHistoryModal({ open: false, item: null })} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Stepper */}
              <div className="flex items-center justify-center gap-2">
                {historyModal.item.steps.map((step, idx) => {
                  const isLast = idx === historyModal.item!.steps.length - 1;
                  const iconClass =
                    step.status === "approved" ? "bg-emerald-500 text-white border-emerald-500" :
                    step.status === "rejected" ? "bg-rose-500 text-white border-rose-500" :
                    "bg-white text-slate-400 border-slate-300";
                  return (
                    <div key={step.level} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${iconClass}`}>
                          {step.status === "approved" ? <CheckCircle2 className="w-5 h-5" /> :
                           step.status === "rejected" ? <X className="w-5 h-5" /> :
                           step.level}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 text-center leading-tight">
                          <div className="font-medium">{step.role}</div>
                          <div>{step.name}</div>
                        </div>
                      </div>
                      {!isLast && (
                        <div className={`w-10 h-0.5 ${
                          step.status === "approved" ? "bg-emerald-400" : "bg-slate-200"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detail list */}
              <div className="space-y-2">
                {historyModal.item.steps.map((step) => (
                  <div key={step.level} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        step.status === "approved" ? "bg-emerald-500" :
                        step.status === "rejected" ? "bg-rose-500" :
                        "bg-slate-300"
                      }`} />
                      <span className="text-slate-700">
                        <span className="font-medium">Lv.{step.level}</span> {step.role} — {step.name}
                      </span>
                    </div>
                    <div className="text-right">
                      {step.date ? (
                        <span className={`text-xs font-medium ${
                          step.status === "approved" ? "text-emerald-600" :
                          step.status === "rejected" ? "text-rose-600" :
                          "text-slate-500"
                        }`}>
                          {step.status === "approved" ? "Disetujui" : step.status === "rejected" ? "Ditolak" : "Menunggu"} · {formatTanggalID(step.date)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Menunggu</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info row */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div><span className="font-medium text-slate-700">Kategori:</span> {historyModal.item.kategori}</div>
                <div><span className="font-medium text-slate-700">Jumlah:</span> {fmt(historyModal.item.jumlah)}</div>
                <div><span className="font-medium text-slate-700">Tanggal:</span> {formatTanggalID(historyModal.item.tanggal)}</div>
                <div><span className="font-medium text-slate-700">Lampiran:</span> {historyModal.item.lampiran || "—"}</div>
              </div>
            </div>
            <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setHistoryModal({ open: false, item: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirm?.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-sm">
            <div className="px-6 py-5 text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${confirm.variant === "approve" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {confirm.variant === "approve" ? <UserCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">{confirm.title}</h3>
              <p className="text-sm text-slate-500">{confirm.message}</p>
            </div>
            <div className="flex items-center justify-center gap-2 px-6 pb-5">
              <button onClick={closeConfirm} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button
                onClick={executeApproval}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${confirm.variant === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
              >
                {confirm.variant === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
