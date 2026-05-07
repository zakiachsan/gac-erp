"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar from "@/components/FinanceFilterBar";
import { Scale, Landmark } from "lucide-react";
import {
  fmt, neracaAktivaLancar, neracaAktivaTetap, neracaKewajiban, neracaEkuitas,
  totalAset, totalKewajiban, totalEkuitas,
} from "@/lib/keuanganData";

export default function NeracaPage() {
  const [period, setPeriod] = useState<{ from: string; to: string; quick: string }>({
    from: "2026-05-31", to: "2026-05-31", quick: "custom",
  });

  const aktivaLancarTotal = neracaAktivaLancar.reduce((s, i) => s + i.jumlah, 0);
  const aktivaTetapTotal = neracaAktivaTetap.reduce((s, i) => s + i.jumlah, 0);
  const kewajibanTotal = neracaKewajiban.reduce((s, i) => s + i.jumlah, 0);
  const ekuitasTotal = neracaEkuitas.reduce((s, i) => s + i.jumlah, 0);

  const subtitle = `Laporan posisi keuangan per ${new Date(period.from).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <SidebarLayout title="Neraca" subtitle={subtitle}>
      <FinanceFilterBar
        singleDate
        singleDateLabel="Per Tanggal"
        defaultQuick="custom"
        hideQuickFilter
        onChange={setPeriod}
        onExport={() => alert("Export Neraca")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AKTIVA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-blue-500" /> AKTIVA</h3>
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Aktiva Lancar</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {neracaAktivaLancar.map((a) => (
                  <tr key={a.kode}><td className="py-2 text-slate-600">{a.kode} — {a.nama}</td><td className="py-2 text-right font-mono font-medium">{fmt(a.jumlah)}</td></tr>
                ))}
                <tr className="font-bold"><td className="py-2 text-slate-800">Total Aktiva Lancar</td><td className="py-2 text-right font-mono text-blue-700">{fmt(aktivaLancarTotal)}</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Aktiva Tetap</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {neracaAktivaTetap.map((a) => (
                  <tr key={a.kode}><td className="py-2 text-slate-600">{a.kode} — {a.nama}</td><td className="py-2 text-right font-mono font-medium">{fmt(a.jumlah)}</td></tr>
                ))}
                <tr className="font-bold"><td className="py-2 text-slate-800">Total Aktiva Tetap</td><td className="py-2 text-right font-mono text-blue-700">{fmt(aktivaTetapTotal)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex justify-between font-bold text-base">
            <span className="text-slate-900">TOTAL AKTIVA</span>
            <span className="text-blue-700 font-mono">{fmt(totalAset)}</span>
          </div>
        </div>

        {/* PASIVA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-500" /> PASIVA</h3>
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Kewajiban</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {neracaKewajiban.map((a) => (
                  <tr key={a.kode}><td className="py-2 text-slate-600">{a.kode} — {a.nama}</td><td className="py-2 text-right font-mono font-medium">{fmt(a.jumlah)}</td></tr>
                ))}
                <tr className="font-bold"><td className="py-2 text-slate-800">Total Kewajiban</td><td className="py-2 text-right font-mono text-emerald-700">{fmt(kewajibanTotal)}</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Ekuitas</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {neracaEkuitas.map((a) => (
                  <tr key={a.kode}><td className="py-2 text-slate-600">{a.kode} — {a.nama}</td><td className="py-2 text-right font-mono font-medium">{fmt(a.jumlah)}</td></tr>
                ))}
                <tr className="font-bold"><td className="py-2 text-slate-800">Total Ekuitas</td><td className="py-2 text-right font-mono text-emerald-700">{fmt(ekuitasTotal)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex justify-between font-bold text-base">
            <span className="text-slate-900">TOTAL PASIVA</span>
            <span className="text-emerald-700 font-mono">{fmt(totalKewajiban + totalEkuitas)}</span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
