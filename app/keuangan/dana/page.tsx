"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, danaList } from "@/lib/keuanganData";

export default function DanaPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [tipeFilter, setTipeFilter] = useState("Semua");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [metodeFilter, setMetodeFilter] = useState("Semua");

  const subtitle = `Jurnal transaksi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const kategories = useMemo(() => [...new Set(danaList.map((d) => d.kategori))], []);
  const metodes = useMemo(() => [...new Set(danaList.map((d) => d.metode))], []);

  const filtered = useMemo(() => {
    return danaList.filter((d) => {
      if (d.tanggal < period.from || d.tanggal > period.to) return false;
      if (tipeFilter !== "Semua" && d.tipe !== tipeFilter) return false;
      if (kategoriFilter !== "Semua" && d.kategori !== kategoriFilter) return false;
      if (metodeFilter !== "Semua" && d.metode !== metodeFilter) return false;
      return true;
    });
  }, [period, tipeFilter, kategoriFilter, metodeFilter]);

  const totalMasuk = filtered.filter((d) => d.tipe === "Masuk").reduce((s, d) => s + d.jumlah, 0);
  const totalKeluar = filtered.filter((d) => d.tipe === "Keluar").reduce((s, d) => s + d.jumlah, 0);

  return (
    <SidebarLayout title="Dana Masuk / Keluar" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Dana")}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Transaksi</label>
              <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Masuk</option>
                <option>Keluar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
              <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                {kategories.map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Metode Pembayaran</label>
              <select value={metodeFilter} onChange={(e) => setMetodeFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                {metodes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        }
      />
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Dana Masuk</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{fmt(totalMasuk)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Dana Keluar</div>
            <div className="text-xl font-bold text-rose-600 mt-1">{fmt(totalKeluar)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Jurnal Dana</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Tipe</th>
                  <th className="pb-3 font-medium">Sumber</th>
                  <th className="pb-3 font-medium">Kategori</th>
                  <th className="pb-3 font-medium">Deskripsi</th>
                  <th className="pb-3 font-medium text-right">Jumlah</th>
                  <th className="pb-3 font-medium">Metode</th>
                  <th className="pb-3 font-medium">Referensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono text-xs text-slate-600">{d.id}</td>
                    <td className="py-3 text-slate-700 text-xs">{d.tanggal}</td>
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${d.tipe === "Masuk" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{d.tipe}</span></td>
                    <td className="py-3 text-slate-700 font-medium">{d.sumber}</td>
                    <td className="py-3 text-slate-600 text-xs">{d.kategori}</td>
                    <td className="py-3 text-slate-700 max-w-xs truncate">{d.deskripsi}</td>
                    <td className={`py-3 text-right font-mono font-medium ${d.tipe === "Masuk" ? "text-emerald-600" : "text-rose-600"}`}>{fmt(d.jumlah)}</td>
                    <td className="py-3 text-slate-600 text-xs">{d.metode}</td>
                    <td className="py-3 font-mono text-[10px] text-slate-500">{d.referensi}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
