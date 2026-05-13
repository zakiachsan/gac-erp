"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, ppnList, type PpnItem } from "@/lib/keuanganData";
import { Search } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function PpnReportPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return ppnList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenis !== jenisFilter) return false;
      if (statusFilter !== "Semua" && p.status !== statusFilter) return false;
      if (search && !p.pihak.toLowerCase().includes(search.toLowerCase()) && !p.noFaktur.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [period, jenisFilter, statusFilter, search]);

  const totalKeluaran = filtered.filter((p) => p.jenis === "Keluaran").reduce((s, p) => s + p.ppn, 0);
  const totalMasukan = filtered.filter((p) => p.jenis === "Masukan").reduce((s, p) => s + p.ppn, 0);
  const selisih = totalKeluaran - totalMasukan;

  const subtitle = `Laporan PPN — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  return (
    <SidebarLayout title="PPN Report" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExportPDF={() => {
          const headers = ["No Faktur", "Tanggal", "Pihak", "NPWP", "Jenis", "DPP", "PPN", "Status"];
          const rows = filtered.map((p) => [
            p.noFaktur, p.tanggal, p.pihak, p.npwp, p.jenis, p.dpp, p.ppn, p.status,
          ]);
          exportToPDF("Laporan PPN", headers, rows, `ppn-report_${period.from}_${period.to}.pdf`);
        }}
        onExportExcel={() => {
          const headers = ["No Faktur", "Tanggal", "Pihak", "NPWP", "Jenis", "DPP", "PPN", "Status"];
          const rows = filtered.map((p) => [
            p.noFaktur, p.tanggal, p.pihak, p.npwp, p.jenis, p.dpp, p.ppn, p.status,
          ]);
          exportToExcel("Laporan PPN", headers, rows, `ppn-report_${period.from}_${period.to}.xlsx`);
        }}
        extraFilters={
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Jenis</label>
              <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
                <option value="Semua">Semua</option>
                <option value="Keluaran">Keluaran</option>
                <option value="Masukan">Masukan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
                <option value="Semua">Semua</option>
                <option value="Normal">Normal</option>
                <option value="Dibatalkan">Dibatalkan</option>
                <option value="Direvisi">Direvisi</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari pihak / no faktur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">PPN Keluaran</div>
          <div className="text-xl font-bold text-rose-700 mt-1">{fmt(totalKeluaran)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">PPN Masukan</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{fmt(totalMasukan)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{selisih >= 0 ? "Kurang Bayar" : "Lebih Bayar"}</div>
          <div className={`text-xl font-bold mt-1 ${selisih >= 0 ? "text-amber-700" : "text-emerald-700"}`}>{fmt(Math.abs(selisih))}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">No Faktur</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Pihak</th>
                <th className="px-4 py-3 font-medium">NPWP</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium text-right">DPP</th>
                <th className="px-4 py-3 font-medium text-right">PPN</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{p.noFaktur}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.tanggal}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{p.pihak}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.npwp}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.jenis === "Keluaran" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{p.jenis}</span></td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(p.dpp)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">{fmt(p.ppn)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${p.status === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "Dibatalkan" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm text-slate-400">Tidak ada data PPN</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
