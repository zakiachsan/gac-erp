"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { FileText, CheckCircle2, Clock, Banknote, ChevronDown, BarChart3, XCircle } from "lucide-react";
import { BiayaItem, loadBiayaItems, saveBiayaItems, fmt, formatTanggalID } from "@/lib/biayaData";

const bulanList = [
  { value: "all", label: "Semua Periode" },
  { value: "2026-01", label: "Januari 2026" },
  { value: "2026-02", label: "Februari 2026" },
  { value: "2026-03", label: "Maret 2026" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-05", label: "Mei 2026" },
];

const stepsNav = [
  { id: "pengajuan", label: "1. Pengajuan Biaya", href: "/operasional/pengajuan" },
  { id: "bayar", label: "2. Listing Bayar", href: "/operasional/bayar" },
  { id: "laporan", label: "3. Laporan", href: "/operasional/laporan" },
];
const ACTIVE_STEP_INDEX = 2;

const statusBadge = (status: BiayaItem["status"]) => {
  switch (status) {
    case "Disetujui": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Ditolak": return "bg-rose-50 text-rose-700 border-rose-200";
    case "Menunggu": return "bg-amber-50 text-amber-700 border-amber-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function LaporanOperasionalPage() {
  const [items, setItems] = useState<BiayaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filterBulan, setFilterBulan] = useState("all");
  const [bulanOpen, setBulanOpen] = useState(false);

  useEffect(() => {
    const data = loadBiayaItems();
    setItems(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBiayaItems(items);
  }, [items, loaded]);

  const filtered = useMemo(() => {
    if (filterBulan === "all") return items;
    return items.filter((i) => i.tanggal.startsWith(filterBulan));
  }, [items, filterBulan]);

  const summary = useMemo(() => {
    const total = filtered.reduce((s, i) => s + i.jumlah, 0);
    const disetujui = filtered.filter((i) => i.status === "Disetujui").reduce((s, i) => s + i.jumlah, 0);
    const dibayar = filtered.filter((i) => i.paid).reduce((s, i) => s + i.jumlah, 0);
    const menunggu = filtered.filter((i) => i.status === "Menunggu").reduce((s, i) => s + i.jumlah, 0);
    return { total, disetujui, dibayar, menunggu };
  }, [filtered]);

  const byKategori = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((i) => { map[i.kategori] = (map[i.kategori] || 0) + i.jumlah; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const maxKategori = byKategori[0]?.[1] || 1;

  return (
    <SidebarLayout
      title="Laporan Transaksi Biaya"
      subtitle="Rekapitulasi biaya operasional per periode."
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
          { label: "Total Pengajuan", value: fmt(summary.total), icon: FileText, color: "text-blue-600" },
          { label: "Total Disetujui", value: fmt(summary.disetujui), icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Total Dibayar", value: fmt(summary.dibayar), icon: Banknote, color: "text-indigo-600" },
          { label: "Menunggu", value: fmt(summary.menunggu), icon: Clock, color: "text-amber-600" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Biaya per Kategori
            </h3>
            <div className="relative">
              <button
                onClick={() => setBulanOpen((p) => !p)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                {bulanList.find((b) => b.value === filterBulan)?.label}
                <ChevronDown className={`w-3 h-3 transition ${bulanOpen ? "rotate-180" : ""}`} />
              </button>
              {bulanOpen && (
                <div className="absolute right-0 z-10 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg">
                  {bulanList.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => { setFilterBulan(b.value); setBulanOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {byKategori.length === 0 ? (
            <div className="text-sm text-slate-400 py-8 text-center">Tidak ada data.</div>
          ) : (
            <div className="space-y-3">
              {byKategori.map(([kategori, jumlah]) => (
                <div key={kategori}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{kategori}</span>
                    <span className="font-mono text-slate-500">{fmt(jumlah)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (jumlah / maxKategori) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Rincian Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total Item</span>
              <span className="font-bold text-slate-800">{filtered.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Disetujui</span>
              <span className="font-bold text-emerald-700">{filtered.filter((i) => i.status === "Disetujui").length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Menunggu</span>
              <span className="font-bold text-amber-700">{filtered.filter((i) => i.status === "Menunggu").length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Ditolak</span>
              <span className="font-bold text-rose-700">{filtered.filter((i) => i.status === "Ditolak").length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Sudah Dibayar</span>
              <span className="font-bold text-indigo-700">{filtered.filter((i) => i.paid).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Detail Transaksi</h2>
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
                <th className="px-6 py-3">Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">Tidak ada data.</td></tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-mono text-xs text-slate-700">{item.no}</td>
                  <td className="px-6 py-3 text-slate-700">{formatTanggalID(item.tanggal)}</td>
                  <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{item.kategori}</span></td>
                  <td className="px-6 py-3 text-slate-700 max-w-xs truncate">{item.deskripsi}</td>
                  <td className="px-6 py-3 font-medium text-slate-800">{fmt(item.jumlah)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center text-xs font-medium ${item.paid ? "text-emerald-700" : "text-amber-700"}`}>
                      {item.paid ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {item.paid ? "Dibayar" : "Belum"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
