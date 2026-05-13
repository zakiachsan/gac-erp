"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, budgetActualList, type BudgetActualItem } from "@/lib/keuanganData";
import { Search, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AnggaranVsActualPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");

  const filtered = useMemo(() => {
    return budgetActualList.filter((b) => {
      if (kategoriFilter !== "Semua" && b.kategori !== kategoriFilter) return false;
      if (search && !b.namaAkun.toLowerCase().includes(search.toLowerCase()) && !b.kodeAkun.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, kategoriFilter]);

  const kategories = useMemo(() => [...new Set(budgetActualList.map((b) => b.kategori))], []);

  const totalAnggaran = filtered.reduce((s, b) => s + b.anggaran, 0);
  const totalRealisasi = filtered.reduce((s, b) => s + b.realisasi, 0);
  const totalSelisih = totalAnggaran - totalRealisasi;

  const grouped = useMemo(() => {
    const map: Record<string, { anggaran: number; realisasi: number }> = {};
    filtered.forEach((b) => {
      if (!map[b.kategori]) map[b.kategori] = { anggaran: 0, realisasi: 0 };
      map[b.kategori].anggaran += b.anggaran;
      map[b.kategori].realisasi += b.realisasi;
    });
    return map;
  }, [filtered]);

  return (
    <SidebarLayout title="Anggaran vs Realisasi" subtitle="Budget vs Actual — perbandingan anggaran dan realisasi per akun">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Anggaran</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{fmt(totalAnggaran)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Realisasi</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{fmt(totalRealisasi)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Selisih</div>
          <div className={`text-2xl font-bold mt-1 ${totalSelisih >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmt(Math.abs(totalSelisih))}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{totalSelisih >= 0 ? "Under Budget ✅" : "Over Budget ❌"}</div>
        </div>
      </div>

      {/* Progress per Kategori */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Realisasi per Kategori</h3>
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, val]) => {
            const pct = val.anggaran > 0 ? (val.realisasi / val.anggaran) * 100 : 0;
            const color = pct > 100 ? "bg-rose-500" : pct >= 90 ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                  <span>{cat}</span>
                  <span className={pct > 100 ? "text-rose-600" : "text-emerald-600"}>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Anggaran: {fmt(val.anggaran)}</span>
                  <span>Realisasi: {fmt(val.realisasi)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari Akun</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Kode atau nama akun..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
              <option value="Semua">Semua</option>
              {kategories.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">Kode</th>
                <th className="px-4 py-3 font-medium">Nama Akun</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium text-right">Anggaran</th>
                <th className="px-4 py-3 font-medium text-right">Realisasi</th>
                <th className="px-4 py-3 font-medium text-right">Selisih</th>
                <th className="px-4 py-3 font-medium text-center">% Tercapai</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const Icon = b.selisih > 0 ? TrendingDown : b.selisih < 0 ? TrendingUp : Minus;
                const iconColor = b.selisih > 0 ? "text-emerald-500" : b.selisih < 0 ? "text-rose-500" : "text-slate-400";
                const pct = b.anggaran > 0 ? (b.realisasi / b.anggaran) * 100 : 0;
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{b.kodeAkun}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{b.namaAkun}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{b.kategori}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(b.anggaran)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(b.realisasi)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold">
                      <span className={b.selisih >= 0 ? "text-emerald-600" : "text-rose-600"}>{b.selisih >= 0 ? "+" : ""}{fmt(b.selisih)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 100 ? "bg-rose-500" : pct >= 90 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Icon className={`w-4 h-4 mx-auto ${iconColor}`} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
