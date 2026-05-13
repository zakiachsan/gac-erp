"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, bankRecList, type BankRecItem } from "@/lib/keuanganData";
import { Landmark, Search, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function RekonsiliasiPage() {
  const [periodFrom, setPeriodFrom] = useState("2026-05-01");
  const [periodTo, setPeriodTo] = useState("2026-05-31");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [sumberFilter, setSumberFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<BankRecItem[]>(bankRecList);

  const filtered = useMemo(() => {
    return items.filter((b) => {
      if (b.tanggal < periodFrom || b.tanggal > periodTo) return false;
      if (statusFilter !== "Semua" && b.status !== statusFilter) return false;
      if (sumberFilter !== "Semua" && b.sumber !== sumberFilter) return false;
      if (search && !b.keterangan.toLowerCase().includes(search.toLowerCase()) && !b.noReferensi.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, periodFrom, periodTo, statusFilter, sumberFilter, search]);

  const jurnalItems = filtered.filter((b) => b.sumber === "Jurnal");
  const bankItems = filtered.filter((b) => b.sumber === "Bank");

  const saldoJurnal = jurnalItems.reduce((s, b) => s + (b.tipe === "Masuk" ? b.jumlah : -b.jumlah), 0);
  const saldoBank = bankItems.reduce((s, b) => s + (b.tipe === "Masuk" ? b.jumlah : -b.jumlah), 0);
  const difference = saldoJurnal - saldoBank;

  const reconciledCount = filtered.filter((b) => b.status === "Reconciled").length;
  const unclearedCount = filtered.filter((b) => b.status === "Uncleared").length;
  const clearedCount = filtered.filter((b) => b.status === "Cleared").length;

  const toggleStatus = (id: string) => {
    setItems((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const next = b.status === "Uncleared" ? "Cleared" : b.status === "Cleared" ? "Reconciled" : "Uncleared";
      return { ...b, status: next };
    }));
  };

  return (
    <SidebarLayout title="Rekonsiliasi Bank" subtitle="Bank Reconciliation — matching Jurnal vs Bank Statement">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
            <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
            <input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
              <option value="Semua">Semua</option>
              <option value="Reconciled">Reconciled</option>
              <option value="Cleared">Cleared</option>
              <option value="Uncleared">Uncleared</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sumber</label>
            <select value={sumberFilter} onChange={(e) => setSumberFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
              <option value="Semua">Semua</option>
              <option value="Jurnal">Jurnal</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Keterangan / no referensi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Saldo per Jurnal</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{fmt(Math.abs(saldoJurnal))}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{saldoJurnal >= 0 ? "Positif" : "Negatif"}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Saldo per Bank</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{fmt(Math.abs(saldoBank))}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{saldoBank >= 0 ? "Positif" : "Negatif"}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Selisih</div>
          <div className={`text-xl font-bold mt-1 ${difference === 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmt(Math.abs(difference))}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{difference === 0 ? "Balance ✅" : "Unbalance ❌"}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Status</div>
          <div className="flex justify-center gap-3 mt-2">
            <span className="text-[10px] text-emerald-600 font-medium">{reconciledCount} Rec</span>
            <span className="text-[10px] text-blue-600 font-medium">{clearedCount} Cleared</span>
            <span className="text-[10px] text-amber-600 font-medium">{unclearedCount} Uncleared</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium w-10">#</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Keterangan</th>
                <th className="px-4 py-3 font-medium">No Referensi</th>
                <th className="px-4 py-3 font-medium">Sumber</th>
                <th className="px-4 py-3 font-medium text-right">Jumlah</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(b.id)} className="focus:outline-none">
                      {b.status === "Reconciled" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                       b.status === "Cleared" ? <Circle className="w-5 h-5 text-blue-500" /> :
                       <AlertCircle className="w-5 h-5 text-amber-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{b.tanggal}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{b.keterangan}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{b.noReferensi}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${b.sumber === "Jurnal" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{b.sumber}</span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-xs font-semibold ${b.tipe === "Masuk" ? "text-blue-600" : "text-rose-600"}`}>
                    {b.tipe === "Masuk" ? "+" : "-"}{fmt(b.jumlah)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-pointer transition ${
                      b.status === "Reconciled" ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" :
                      b.status === "Cleared" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" :
                      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    }`} onClick={() => toggleStatus(b.id)}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
