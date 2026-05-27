"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, danaList } from "@/lib/keuanganData";
import { BookOpen, ExternalLink } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

const SALDO_AWAL = 750000000; // Mock saldo awal periode (dari Neraca bulan lalu)

export default function DanaPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [tipeFilter, setTipeFilter] = useState("Semua");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [metodeFilter, setMetodeFilter] = useState("Semua");

  const subtitle = `Jurnal transaksi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const kategories = useMemo(() => [...new Set(danaList.map((d) => d.kategori))], []);
  const metodes = useMemo(() => [...new Set(danaList.map((d) => d.metode))], []);

  const filtered = useMemo(() => {
    return danaList
      .filter((d) => {
        if (d.tanggal < period.from || d.tanggal > period.to) return false;
        if (tipeFilter !== "Semua" && d.tipe !== tipeFilter) return false;
        if (kategoriFilter !== "Semua" && d.kategori !== kategoriFilter) return false;
        if (metodeFilter !== "Semua" && d.metode !== metodeFilter) return false;
        return true;
      })
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  }, [period, tipeFilter, kategoriFilter, metodeFilter]);

  // Running balance
  const rowsWithBalance = useMemo(() => {
    let balance = SALDO_AWAL;
    return filtered.map((d) => {
      balance += d.tipe === "Masuk" ? d.jumlah : -d.jumlah;
      return { ...d, saldo: balance };
    });
  }, [filtered]);

  const totalMasuk = filtered.filter((d) => d.tipe === "Masuk").reduce((s, d) => s + d.jumlah, 0);
  const totalKeluar = filtered.filter((d) => d.tipe === "Keluar").reduce((s, d) => s + d.jumlah, 0);
  const saldoAkhir = SALDO_AWAL + totalMasuk - totalKeluar;

  const handleExportPDF = () => {
    const headers = ["Tanggal", "Tipe", "Sumber", "Kategori", "Deskripsi", "Jumlah", "Metode", "Referensi", "Saldo"];
    const rows = rowsWithBalance.map((d) => [
      d.tanggal,
      d.tipe,
      d.sumber,
      d.kategori,
      d.deskripsi,
      d.tipe === "Masuk" ? d.jumlah : -d.jumlah,
      d.metode,
      d.referensi,
      d.saldo,
    ]);
    exportToPDF("Kas & Bank", headers, rows, `kas-bank_${period.from}_${period.to}.pdf`);
  };

  const handleExportExcel = () => {
    const headers = ["Tanggal", "Tipe", "Sumber", "Kategori", "Deskripsi", "Jumlah", "Metode", "Referensi", "Saldo"];
    const rows = rowsWithBalance.map((d) => [
      d.tanggal,
      d.tipe,
      d.sumber,
      d.kategori,
      d.deskripsi,
      d.tipe === "Masuk" ? d.jumlah : -d.jumlah,
      d.metode,
      d.referensi,
      d.saldo,
    ]);
    exportToExcel("Kas & Bank", headers, rows, `kas-bank_${period.from}_${period.to}.xlsx`);
  };

  return (
    <SidebarLayout title="Kas & Bank" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={handleExportPDF}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Transaksi</label>
              <select
                value={tipeFilter}
                onChange={(e) => setTipeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                <option>Masuk</option>
                <option>Keluar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                {kategories.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Metode Pembayaran</label>
              <select
                value={metodeFilter}
                onChange={(e) => setMetodeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                {metodes.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Saldo Awal</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{fmt(SALDO_AWAL)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Masuk</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{fmt(totalMasuk)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Keluar</div>
            <div className="text-xl font-bold text-rose-600 mt-1">{fmt(totalKeluar)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Saldo Akhir</div>
            <div className="text-xl font-bold text-blue-700 mt-1">{fmt(saldoAkhir)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Jurnal Dana</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-lg transition"
              >
                Export PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg transition"
              >
                Export Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Tipe</th>
                  <th className="px-4 py-3 font-medium">Sumber</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Deskripsi</th>
                  <th className="px-4 py-3 font-medium text-right">Jumlah</th>
                  <th className="px-4 py-3 font-medium text-right">Saldo</th>
                  <th className="px-4 py-3 font-medium">Metode</th>
                  <th className="px-4 py-3 font-medium">Jurnal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowsWithBalance.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-700 text-xs">{d.tanggal}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          d.tipe === "Masuk" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {d.tipe}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{d.sumber}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{d.kategori}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{d.deskripsi}</td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-medium ${
                        d.tipe === "Masuk" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {fmt(d.jumlah)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-blue-700">{fmt(d.saldo)}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{d.metode}</td>
                    <td className="px-4 py-3">
                      {d.noJurnal ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <BookOpen className="w-3 h-3" />
                          {d.noJurnal}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {rowsWithBalance.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-slate-400">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
