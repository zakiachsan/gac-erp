"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { ArrowLeft, FileText, Calendar, User, Building2, CheckCircle, XCircle, Clock, RotateCcw, Download } from "lucide-react";
import Link from "next/link";

const items = [
  { nama: "AC Split 2 PK", qty: 10, harga: "Rp 4.500.000", total: "Rp 45.000.000" },
  { nama: "Jasa Instalasi", qty: 1, harga: "Rp 12.000.000", total: "Rp 12.000.000" },
];

const history = [
  { date: "05 Mei 2026 10:30", action: "Penawaran diajukan", oleh: "Siti Aminah", status: "Submit" },
  { date: "04 Mei 2026 14:15", action: "Negosiasi harga", oleh: "Siti Aminah", status: "Negosiasi" },
  { date: "04 Mei 2026 16:00", action: "Update harga (revisi 1)", oleh: "Siti Aminah", status: "Negosiasi" },
];

export default function PenawaranDetailPage() {
  const [currentStatus, setCurrentStatus] = useState("Negosiasi");

  return (
    <SidebarLayout
      title="Detail Penawaran"
      subtitle="Informasi lengkap quotation & riwayat negosiasi."
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/penawaran" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
              <span className="font-mono text-xs text-slate-500">QT-2026-0020</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Pengadaan AC Kantor Pusat</h2>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 05 Mei 2026</span>
              <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> PT Sejahtera Abadi</span>
              <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5" /> Budi Santoso</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
              currentStatus === "Menang" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
              currentStatus === "Tidak Menang" ? "bg-rose-50 text-rose-700 border-rose-100" :
              currentStatus === "Negosiasi" ? "bg-amber-50 text-amber-700 border-amber-100" :
              "bg-blue-50 text-blue-700 border-blue-100"
            }`}>
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Item Penawaran</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr><th className="pb-3 font-medium">Nama Barang / Jasa</th><th className="pb-3 font-medium text-right">Qty</th><th className="pb-3 font-medium text-right">Harga Satuan</th><th className="pb-3 font-medium text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-medium text-slate-800">{item.nama}</td>
                    <td className="py-3 text-right">{item.qty}</td>
                    <td className="py-3 text-right font-mono text-xs">{item.harga}</td>
                    <td className="py-3 text-right font-semibold">{item.total}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="py-3 font-bold text-slate-900" colSpan={3}>Grand Total</td>
                  <td className="py-3 text-right font-bold text-slate-900">Rp 57.000.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Lampiran Dokumen</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">Penawaran_AC_KantorPusat.pdf</div>
                <div className="text-xs text-slate-500">PDF • 2.4 MB</div>
              </div>
              <button className="text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Aksi Penawaran</h3>
            <p className="text-xs text-slate-500 mb-4">Maksimal 2x submit (penawaran awal & negosiasi).</p>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentStatus("Menang")}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Menang
              </button>
              <button
                onClick={() => setCurrentStatus("Tidak Menang")}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Tidak Menang
              </button>
              <button
                onClick={() => setCurrentStatus("Negosiasi")}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Negosiasi
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Status</h3>
            <div className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{h.action}</div>
                    <div className="text-xs text-slate-500">{h.date} • {h.oleh}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${
                      h.status === "Submit" ? "bg-blue-50 text-blue-700" :
                      h.status === "Negosiasi" ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>{h.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
