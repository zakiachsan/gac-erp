"use client";

import { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface PRItem {
  no: string;
  project: string;
  projectId: string;
  pengaju: string;
  total: string;
  step: number; // 1=Pengaju, 2=Mengetahui, 3=Menyetujui
  maxStep: number;
  approvers: string[]; // [Pengaju, Mengetahui, Menyetujui]
}

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];

const approvalLabels = ["Pengaju", "Mengetahui", "Menyetujui"];

function ApprovalTracker({ step, maxStep, approvers }: { step: number; maxStep: number; approvers: string[] }) {
  return (
    <div className="flex items-center">
      {[0, 1, 2].map((i) => {
        const s = i + 1;
        const isDone = step > s || step === maxStep;
        const isCurrent = step === s && step < maxStep;
        const isPending = step < s;
        const circleColor = isDone
          ? "bg-emerald-500 text-white border-emerald-500"
          : isCurrent
          ? "bg-amber-500 text-white border-amber-500"
          : "bg-white text-slate-400 border-slate-300";
        const nameColor = isDone
          ? "text-emerald-700 font-semibold"
          : isCurrent
          ? "text-amber-700 font-semibold"
          : "text-slate-400";

        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center min-w-[70px]">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${circleColor}`}>
                {isDone ? "✓" : s}
              </div>
              <div className={`text-[10px] mt-0.5 text-center leading-tight ${nameColor}`}>
                {approvers[i] || approvalLabels[i]}
              </div>
            </div>
            {i < 2 && (
              <div className={`w-4 h-0.5 ${isDone ? "bg-emerald-500" : "bg-slate-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PRPage() {
  const [items, setItems] = useState<PRItem[]>([
    {
      no: "PR-2026-0041",
      project: "Pengadaan AC Kantor Pusat",
      projectId: "PRJ-2026-0001",
      pengaju: "Andi Wijaya",
      total: "Rp 45.000.000",
      step: 2,
      maxStep: 3,
      approvers: ["Andi Wijaya", "Budi Santoso", "Direktur"],
    },
    {
      no: "PR-2026-0042",
      project: "Pemasangan Pompa Industri",
      projectId: "PRJ-2026-0002",
      pengaju: "Siti Aminah",
      total: "Rp 28.500.000",
      step: 1,
      maxStep: 3,
      approvers: ["Siti Aminah", "Budi Santoso", "Direktur"],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    no: "",
    project: "",
    projectId: "",
    pengaju: "",
    total: "",
    mengetahui: "",
    menyetujui: "",
  });

  const handleApprove = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index && item.step < item.maxStep
          ? { ...item, step: item.step + 1 }
          : item
      )
    );
  };

  const handleReject = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!form.no || !form.project || !form.pengaju || !form.total) return;
    const newItem: PRItem = {
      no: form.no,
      project: form.project,
      projectId: form.projectId || "PRJ-2026-0000",
      pengaju: form.pengaju,
      total: form.total,
      step: 1,
      maxStep: 3,
      approvers: [form.pengaju, form.mengetahui || "Mengetahui", form.menyetujui || "Menyetujui"],
    };
    setItems((prev) => [...prev, newItem]);
    setForm({ no: "", project: "", projectId: "", pengaju: "", total: "", mengetahui: "", menyetujui: "" });
    setModalOpen(false);
  };

  return (
    <SidebarLayout
      title="Pengajuan Barang & Jasa (PR)"
      subtitle="Pengajuan kebutuhan barang/jasa dengan approval berjenjang."
    >
      {/* Stage / Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1">
            <Link
              href={step.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                i === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {step.label}
            </Link>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Daftar Pengajuan</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Ajukan PR
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">No PR</th>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Pengaju</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Approval</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada data pengajuan.
                  </td>
                </tr>
              )}
              {items.map((item, index) => (
                <tr key={item.no} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-mono text-xs text-slate-700">{item.no}</td>
                  <td className="px-6 py-3">
                    <Link href={`/project/${item.projectId}`} className="text-blue-600 hover:underline font-medium">
                      {item.project}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-slate-700">{item.pengaju}</td>
                  <td className="px-6 py-3 text-slate-700 font-medium">{item.total}</td>
                  <td className="px-6 py-3">
                    <ApprovalTracker step={item.step} maxStep={item.maxStep} approvers={item.approvers} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {item.step < item.maxStep && (
                        <button
                          onClick={() => handleApprove(index)}
                          className="inline-flex items-center justify-center p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Setujui"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(index)}
                        className="inline-flex items-center justify-center p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Tolak"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Ajukan PR Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No PR</label>
                <input type="text" value={form.no} onChange={(e) => setForm((prev) => ({ ...prev, no: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: PR-2026-0043" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={form.project} onChange={(e) => setForm((prev) => ({ ...prev, project: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama project" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project ID</label>
                <input type="text" value={form.projectId} onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: PRJ-2026-0003" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pengaju</label>
                  <input type="text" value={form.pengaju} onChange={(e) => setForm((prev) => ({ ...prev, pengaju: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama pengaju" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total</label>
                  <input type="text" value={form.total} onChange={(e) => setForm((prev) => ({ ...prev, total: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rp 10.000.000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mengetahui</label>
                  <input type="text" value={form.mengetahui} onChange={(e) => setForm((prev) => ({ ...prev, mengetahui: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama approver" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Menyetujui</label>
                  <input type="text" value={form.menyetujui} onChange={(e) => setForm((prev) => ({ ...prev, menyetujui: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama approver" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
