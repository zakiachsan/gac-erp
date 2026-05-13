"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, pphList, type PphItem } from "@/lib/keuanganData";
import { Receipt, Search } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function PphReportPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return pphList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenisPph !== jenisFilter) return false;
      if (search && !p.pihak.toLowerCase().includes(search.toLowerCase()) && !p.noBukti.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [period, jenisFilter, search]);

  const totalDpp = filtered.reduce((s, p) => s + p.dpp, 0);
  const totalPph = filtered.reduce((s, p) => s + p.pph, 0);

  const jenisOptions = useMemo(() => [...new Set(pphList.map((p) => p.jenisPph))], []);

  const subtitle = `Laporan PPh — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  return (
    <SidebarLayout title="PPh Report" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExportPDF={() => {
          const headers = ["No Bukti", "Tanggal", "Pihak", "NPWP", "Jenis PPh", "Tarif %", "DPP", "PPh", "Status"];
          const rows = filtered.map((p) => [
            p.noBukti, p.tanggal, p.pihak, p.npwp, p.jenisPph, p.tarif, p.dpp, p.pph, p.status,
          ]);
          exportToPDF("Laporan PPh", headers, rows, `pph-report_${period.from}_${period.to}.pdf`);
        }}
        onExportExcel={() => {
          const headers = ["No Bukti", "Tanggal", "Pihak", "NPWP", "Jenis PPh", "Tarif %", "DPP", "PPh", "Status"];
          const rows = filtered.map((p) => [
            p.noBukti, p.tanggal, p.pihak, p.npwp, p.jenisPph, p.tarif, p.dpp, p.pph, p.status,
          ]);
          exportToExcel("Laporan PPh", headers, rows, `pph-report_${period.from}_${period.to}.xlsx`);
        }}
        extraFilters={
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Jenis PPh</label>
              <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
                <option value="Semua">Semua</option>
                {jenisOptions.map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari pihak / no bukti..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Jumlah Bupot</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{filtered.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total DPP</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{fmt(totalDpp)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total PPh Dipotong</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{fmt(totalPph)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">No Bukti</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Pihak</th>
                <th className="px-4 py-3 font-medium">NPWP</th>
                <th className="px-4 py-3 font-medium">Jenis PPh</th>
                <th className="px-4 py-3 font-medium text-right">Tarif (%)</th>
                <th className="px-4 py-3 font-medium text-right">DPP</th>
                <th className="px-4 py-3 font-medium text-right">PPh</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{p.noBukti}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.tanggal}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{p.pihak}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.npwp}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.jenisPph}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{p.tarif}%</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(p.dpp)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-rose-600">{fmt(p.pph)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${p.status === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">Tidak ada data PPh</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
