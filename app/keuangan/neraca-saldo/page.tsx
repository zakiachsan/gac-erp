"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, coaList, bukuBesarList, type CoaItem } from "@/lib/keuanganData";
import { Scale, Search } from "lucide-react";
import ExportButtons from "@/components/ExportButtons";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function NeracaSaldoPage() {
  const [periodFrom, setPeriodFrom] = useState("2026-05-01");
  const [periodTo, setPeriodTo] = useState("2026-05-31");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
    return coaList.map((a) => {
      const entries = bukuBesarList.filter((b) => b.kodeAkun === a.kode && b.tanggal >= periodFrom && b.tanggal <= periodTo);
      const debit = entries.reduce((s, e) => s + e.debit, 0);
      const kredit = entries.reduce((s, e) => s + e.kredit, 0);
      const saldoAwal = a.saldoAwal;
      const netMovement = debit - kredit;
      const saldoAkhir = saldoAwal + netMovement;
      return {
        ...a,
        saldoAwal,
        debit,
        kredit,
        saldoAkhir,
      };
    });
  }, [periodFrom, periodTo]);

  const filtered = useMemo(() => {
    return data.filter((a) => {
      if (kategoriFilter !== "Semua" && a.kategori !== kategoriFilter) return false;
      if (search && !a.kode.toLowerCase().includes(search.toLowerCase()) && !a.nama.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, kategoriFilter, search]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, a) => {
        if (a.saldoAwal >= 0) acc.saldoAwalDebit += a.saldoAwal;
        else acc.saldoAwalKredit += Math.abs(a.saldoAwal);
        acc.debit += a.debit;
        acc.kredit += a.kredit;
        if (a.saldoAkhir >= 0) acc.saldoAkhirDebit += a.saldoAkhir;
        else acc.saldoAkhirKredit += Math.abs(a.saldoAkhir);
        return acc;
      },
      { saldoAwalDebit: 0, saldoAwalKredit: 0, debit: 0, kredit: 0, saldoAkhirDebit: 0, saldoAkhirKredit: 0 }
    );
  }, [filtered]);

  return (
    <SidebarLayout title="Neraca Saldo" subtitle="Trial Balance — saldo awal, pergerakan, dan saldo akhir per akun">
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
              <option value="Semua">Semua</option>
              {Array.from(new Set(coaList.map((a) => a.kategori))).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari Akun</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Kode atau nama akun..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <ExportButtons
            onExportPDF={() => {
              const headers = ["Kode", "Nama Akun", "Kategori", "Saldo Awal D", "Saldo Awal K", "Debit", "Kredit", "Saldo Akhir D", "Saldo Akhir K"];
              const rows = filtered.map((a) => [
                a.kode,
                a.nama,
                a.kategori,
                a.saldoAwal >= 0 ? a.saldoAwal : "",
                a.saldoAwal < 0 ? Math.abs(a.saldoAwal) : "",
                a.debit || "",
                a.kredit || "",
                a.saldoAkhir >= 0 ? a.saldoAkhir : "",
                a.saldoAkhir < 0 ? Math.abs(a.saldoAkhir) : "",
              ]);
              exportToPDF("Neraca Saldo", headers, rows, `neraca-saldo_${periodFrom}_${periodTo}.pdf`);
            }}
            onExportExcel={() => {
              const headers = ["Kode", "Nama Akun", "Kategori", "Saldo Awal D", "Saldo Awal K", "Debit", "Kredit", "Saldo Akhir D", "Saldo Akhir K"];
              const rows = filtered.map((a) => [
                a.kode,
                a.nama,
                a.kategori,
                a.saldoAwal >= 0 ? a.saldoAwal : "",
                a.saldoAwal < 0 ? Math.abs(a.saldoAwal) : "",
                a.debit || "",
                a.kredit || "",
                a.saldoAkhir >= 0 ? a.saldoAkhir : "",
                a.saldoAkhir < 0 ? Math.abs(a.saldoAkhir) : "",
              ]);
              exportToExcel("Neraca Saldo", headers, rows, `neraca-saldo_${periodFrom}_${periodTo}.xlsx`);
            }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Debit</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{fmt(totals.debit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Kredit</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{fmt(totals.kredit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Balance</div>
          <div className={`text-xl font-bold mt-1 ${totals.debit === totals.kredit ? "text-emerald-600" : "text-rose-600"}`}>
            {totals.debit === totals.kredit ? "Balance ✅" : "Unbalance ❌"}
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
                <th className="px-4 py-3 font-medium text-right" colSpan={2}>Saldo Awal</th>
                <th className="px-4 py-3 font-medium text-right" colSpan={2}>Pergerakan</th>
                <th className="px-4 py-3 font-medium text-right" colSpan={2}>Saldo Akhir</th>
              </tr>
              <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                <th className="px-4 py-1 font-medium"></th>
                <th className="px-4 py-1 font-medium"></th>
                <th className="px-4 py-1 font-medium"></th>
                <th className="px-4 py-1 font-medium text-right">Debit</th>
                <th className="px-4 py-1 font-medium text-right">Kredit</th>
                <th className="px-4 py-1 font-medium text-right">Debit</th>
                <th className="px-4 py-1 font-medium text-right">Kredit</th>
                <th className="px-4 py-1 font-medium text-right">Debit</th>
                <th className="px-4 py-1 font-medium text-right">Kredit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const saDebit = a.saldoAwal >= 0 ? a.saldoAwal : 0;
                const saKredit = a.saldoAwal < 0 ? Math.abs(a.saldoAwal) : 0;
                const sakDebit = a.saldoAkhir >= 0 ? a.saldoAkhir : 0;
                const sakKredit = a.saldoAkhir < 0 ? Math.abs(a.saldoAkhir) : 0;
                return (
                  <tr key={a.kode} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{a.kode}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.nama}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.kategori}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{saDebit ? fmt(saDebit) : "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{saKredit ? fmt(saKredit) : "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-blue-600">{a.debit ? fmt(a.debit) : "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600">{a.kredit ? fmt(a.kredit) : "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">{sakDebit ? fmt(sakDebit) : "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">{sakKredit ? fmt(sakKredit) : "—"}</td>
                  </tr>
                );
              })}
              {/* Total Row */}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan={3} className="px-4 py-3 text-slate-800">TOTAL</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-slate-800">{fmt(totals.saldoAwalDebit)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-slate-800">{fmt(totals.saldoAwalKredit)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-blue-700">{fmt(totals.debit)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-emerald-700">{fmt(totals.kredit)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-slate-900">{fmt(totals.saldoAkhirDebit)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-slate-900">{fmt(totals.saldoAkhirKredit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
