"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, pajakList } from "@/lib/keuanganData";

const statusBadge = (status: string) => {
  switch (status) {
    case "Normal": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Dibatalkan": return "bg-rose-50 text-rose-700 border-rose-200";
    case "Direvisi": return "bg-amber-50 text-amber-700 border-amber-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function PerpajakanPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const subtitle = `Monitoring pajak — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const filtered = useMemo(() => {
    return pajakList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenis !== jenisFilter) return false;
      if (statusFilter !== "Semua" && p.status !== statusFilter) return false;
      return true;
    });
  }, [period, jenisFilter, statusFilter]);

  const totalKeluaran = filtered.filter((p) => p.jenis === "Pajak Keluaran").reduce((s, p) => s + p.ppn, 0);
  const totalMasukan = filtered.filter((p) => p.jenis === "Pajak Masukan").reduce((s, p) => s + p.ppn, 0);
  const selisih = totalKeluaran - totalMasukan;

  return (
    <SidebarLayout title="Perpajakan" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Perpajakan")}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Pajak</label>
              <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Pajak Keluaran</option>
                <option>Pajak Masukan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status Faktur</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Normal</option>
                <option>Dibatalkan</option>
                <option>Direvisi</option>
              </select>
            </div>
          </div>
        }
      />
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Pajak Keluaran</div>
            <div className="text-xl font-bold text-rose-600 mt-1">{fmt(totalKeluaran)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Pajak Masukan</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{fmt(totalMasukan)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{selisih >= 0 ? "Kurang Bayar" : "Lebih Bayar"}</div>
            <div className={`text-xl font-bold mt-1 ${selisih >= 0 ? "text-amber-600" : "text-emerald-600"}`}>{fmt(Math.abs(selisih))}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Monitoring Pajak</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-medium">Jenis</th>
                  <th className="pb-3 font-medium">No Faktur</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium text-right">DPP</th>
                  <th className="pb-3 font-medium text-right">PPN</th>
                  <th className="pb-3 font-medium text-right">PPh</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.jenis === "Pajak Keluaran" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{p.jenis}</span></td>
                    <td className="py-3 font-mono text-xs text-slate-600">{p.noFaktur}</td>
                    <td className="py-3 text-slate-700 text-xs">{p.tanggal}</td>
                    <td className="py-3 text-right font-mono text-xs">{fmt(p.dpp)}</td>
                    <td className="py-3 text-right font-mono text-xs">{fmt(p.ppn)}</td>
                    <td className="py-3 text-right font-mono text-xs">{p.pph ? fmt(p.pph) : "—"}</td>
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(p.status)}`}>{p.status}</span></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
