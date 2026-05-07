"use client";

import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { FileText, Download } from "lucide-react";

interface LaporanItem {
  no: number;
  jenis: string;
  noDokumen: string;
  vendorProject: string;
  jumlah: string;
  tanggal: string;
}

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];

const ACTIVE_STEP_INDEX = 5;

const summaryCards = [
  { label: "Total PR", value: "2", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Disetujui", value: "1", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Pembayaran", value: "2", color: "text-violet-600", bg: "bg-violet-50" },
];

const initialData: LaporanItem[] = [
  { no: 1, jenis: "PR", noDokumen: "PR-2026-0041", vendorProject: "AC Kantor Pusat", jumlah: "Rp 45.000.000", tanggal: "28 Apr 2026" },
  { no: 2, jenis: "PO", noDokumen: "PO-2026-0021", vendorProject: "PT CoolTech", jumlah: "Rp 42.000.000", tanggal: "29 Apr 2026" },
  { no: 3, jenis: "BAP", noDokumen: "BAP-2026-0012", vendorProject: "PT CoolTech", jumlah: "Rp 21.000.000", tanggal: "28 Apr 2026" },
  { no: 4, jenis: "Bayar", noDokumen: "BAP-2026-0008", vendorProject: "CV SteelWorks", jumlah: "Rp 15.000.000", tanggal: "05 Mei 2026" },
];

export default function LaporanPage() {
  return (
    <SidebarLayout
      title="Laporan Transaksi"
      subtitle="Rekapitulasi seluruh transaksi pengadaan."
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            Rekapitulasi Transaksi
          </h2>
          <div className="flex items-center gap-2">
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
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Jenis</th>
                <th className="px-6 py-3">No Dokumen</th>
                <th className="px-6 py-3">Vendor / Project</th>
                <th className="px-6 py-3">Jumlah</th>
                <th className="px-6 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada data transaksi.
                  </td>
                </tr>
              )}
              {initialData.map((item) => {
                const jenisClass =
                  item.jenis === "PR"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : item.jenis === "PO"
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : item.jenis === "BAP"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200";

                return (
                  <tr key={item.no} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 text-slate-700">{item.no}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${jenisClass}`}>
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-700">
                      {item.noDokumen}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{item.vendorProject}</td>
                    <td className="px-6 py-3 text-slate-700 font-medium">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{item.tanggal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
