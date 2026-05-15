"use client";

import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { FileText, Download, CheckCircle, Clock, Ban, ArrowRight } from "lucide-react";

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];
const ACTIVE_STEP_INDEX = 5;

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface ProgressStep {
  label: string;
  status: "done" | "current" | "pending";
  detail?: string;
  href?: string;
}

interface LaporanProject {
  id: string;
  nama: string;
  projectId: string;
  steps: ProgressStep[];
  totalNilai: number;
}

const laporanData: LaporanProject[] = [
  {
    id: "PB-001",
    nama: "Pengadaan AC Kantor Pusat",
    projectId: "PRJ-2026-0001",
    totalNilai: 70781800,
    steps: [
      { label: "PR", status: "done", detail: "PR-2026-0041", href: "/pengadaan/pr" },
      { label: "Pembanding", status: "done", detail: "PT CoolTech", href: "/pengadaan/pembanding/PB-001" },
      { label: "PO", status: "done", detail: "011/PO.BLM/...", href: "/pengadaan/po" },
      { label: "BAP", status: "done", detail: "Disetujui", href: "/pengadaan/bap/BAP-001" },
      { label: "Bayar", status: "current", detail: "Menunggu", href: "/pengadaan/bayar" },
    ],
  },
  {
    id: "PB-002",
    nama: "Pemasangan Pompa Industri",
    projectId: "PRJ-2026-0002",
    totalNilai: 34132500,
    steps: [
      { label: "PR", status: "done", detail: "PR-2026-0042", href: "/pengadaan/pr" },
      { label: "Pembanding", status: "done", detail: "PT Maju Bersama", href: "/pengadaan/pembanding/PB-002" },
      { label: "PO", status: "done", detail: "012/PO.BLM/...", href: "/pengadaan/po" },
      { label: "BAP", status: "done", detail: "Disetujui", href: "/pengadaan/bap/BAP-002" },
      { label: "Bayar", status: "done", detail: "Dibayar", href: "/pengadaan/bayar" },
    ],
  },
  {
    id: "PB-003",
    nama: "Renovasi & Material Gudang",
    projectId: "PRJ-2026-0003",
    totalNilai: 139305000,
    steps: [
      { label: "PR", status: "pending", detail: "—", href: "/pengadaan/pr" },
      { label: "Pembanding", status: "done", detail: "PT Sejahtera Abadi", href: "/pengadaan/pembanding/PB-003" },
      { label: "PO", status: "done", detail: "013/PO.BLM/...", href: "/pengadaan/po" },
      { label: "BAP", status: "current", detail: "Draft", href: "/pengadaan/bap/BAP-003" },
      { label: "Bayar", status: "pending", detail: "—", href: "/pengadaan/bayar" },
    ],
  },
];

const summaryCards = [
  { label: "Total Pengajuan", value: "2", sub: "2 Menunggu", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Total PO", value: "3", sub: "3 Aktif", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { label: "BAP Disetujui", value: "2", sub: "1 Draft", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { label: "Sudah Dibayar", value: "1", sub: "2 Menunggu", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

const totalNilai = laporanData.reduce((s, p) => s + p.totalNilai, 0);

function StepBadge({ status }: { status: "done" | "current" | "pending" }) {
  if (status === "done")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Selesai</span>;
  if (status === "current")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3 mr-1" />Berjalan</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200"><Ban className="w-3 h-3 mr-1" />Belum</span>;
}

function ProgressBar({ steps }: { steps: ProgressStep[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  const total = steps.length;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
        <span>{done}/{total} tahap</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function LaporanPage() {
  return (
    <SidebarLayout title="Laporan Pengadaan" subtitle="Rekapitulasi progres dan ringkasan seluruh tahap pengadaan.">
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-xl border ${card.border} shadow-sm p-4`}>
            <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Progres Pengadaan per Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tracking end-to-end dari PR, Pembanding, PO, BAP, hingga Pembayaran.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-slate-400">Total Nilai Pengadaan</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{fmt(totalNilai)}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3 text-center">PR</th>
                <th className="px-6 py-3 text-center">Pembanding</th>
                <th className="px-6 py-3 text-center">PO</th>
                <th className="px-6 py-3 text-center">BAP</th>
                <th className="px-6 py-3 text-center">Bayar</th>
                <th className="px-6 py-3 text-right">Total Nilai</th>
                <th className="px-6 py-3 w-40">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {laporanData.map((project) => {
                const isComplete = project.steps.every((s) => s.status === "done");
                return (
                  <tr key={project.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{project.nama}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <Link href={`/project/${project.projectId}`} className="text-blue-600 hover:underline font-mono">{project.projectId}</Link>
                        <span className="mx-1">·</span>
                        <Link href={`/pengadaan/pembanding/${project.id}`} className="text-blue-600 hover:underline font-mono">{project.id}</Link>
                      </div>
                    </td>
                    {project.steps.map((step, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        {step.status !== "pending" && step.href ? (
                          <Link href={step.href} className="flex flex-col items-center gap-1 group">
                            <StepBadge status={step.status} />
                            <span className="text-[10px] text-slate-500 group-hover:text-blue-600 transition">{step.detail}</span>
                          </Link>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <StepBadge status={step.status} />
                            <span className="text-[10px] text-slate-500">{step.detail}</span>
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 font-mono text-xs">{fmt(project.totalNilai)}</td>
                    <td className="px-6 py-4">
                      <ProgressBar steps={project.steps} />
                      {isComplete && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Selesai
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {laporanData.length} project pengadaan</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Selesai</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Berjalan</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Belum</span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
