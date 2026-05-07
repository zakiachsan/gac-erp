"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import {
  fmt, labaRugiPendapatan, labaRugiCogs, labaRugiBeban,
} from "@/lib/keuanganData";

export default function LabaRugiPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [showPendapatan, setShowPendapatan] = useState(true);
  const [showCogs, setShowCogs] = useState(true);
  const [showBeban, setShowBeban] = useState(true);

  const subtitle = `Laporan laba rugi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const pendapatanFiltered = showPendapatan ? labaRugiPendapatan : [];
  const cogsFiltered = showCogs ? labaRugiCogs : [];
  const bebanFiltered = showBeban ? labaRugiBeban : [];

  const totalPendapatanFiltered = pendapatanFiltered.reduce((s, i) => s + i.jumlah, 0);
  const totalCogsFiltered = cogsFiltered.reduce((s, i) => s + i.jumlah, 0);
  const totalBebanFiltered = bebanFiltered.reduce((s, i) => s + i.jumlah, 0);
  const labaKotorFiltered = totalPendapatanFiltered - totalCogsFiltered;
  const labaBersihFiltered = labaKotorFiltered - totalBebanFiltered;

  return (
    <SidebarLayout title="Laba Rugi" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Laba Rugi")}
        extraFilters={
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showPendapatan} onChange={(e) => setShowPendapatan(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Pendapatan
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showCogs} onChange={(e) => setShowCogs(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              COGS
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showBeban} onChange={(e) => setShowBeban(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Beban Operasional
            </label>
          </div>
        }
      />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 text-center mb-6">LAPORAN LABA RUGI</h3>
          <div className="space-y-6">
            {showPendapatan && (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">PENDAPATAN</div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {pendapatanFiltered.map((p, i) => (
                      <tr key={i}><td className="py-2 pl-4 text-slate-700">{p.nama}</td><td className="py-2 text-right font-mono">{fmt(p.jumlah)}</td></tr>
                    ))}
                    <tr className="font-bold border-t-2 border-slate-200"><td className="py-2 text-slate-800">Total Pendapatan</td><td className="py-2 text-right font-mono text-slate-900">{fmt(totalPendapatanFiltered)}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {showCogs && (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">BEBAN POKOK PENDAPATAN (COGS)</div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {cogsFiltered.map((c, i) => (
                      <tr key={i}><td className="py-2 pl-4 text-slate-700">{c.nama}</td><td className="py-2 text-right font-mono">{fmt(c.jumlah)}</td></tr>
                    ))}
                    <tr className="font-bold"><td className="py-2 text-slate-800">Total COGS</td><td className="py-2 text-right font-mono text-rose-600">({fmt(totalCogsFiltered)})</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {showPendapatan && showCogs && (
              <div className="flex justify-between py-3 px-4 bg-slate-50 rounded-lg font-bold text-sm">
                <span className="text-slate-800">LABA KOTOR</span>
                <span className="font-mono text-emerald-700">{fmt(labaKotorFiltered)}</span>
              </div>
            )}
            {showBeban && (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">BEBAN OPERASIONAL</div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {bebanFiltered.map((b, i) => (
                      <tr key={i}><td className="py-2 pl-4 text-slate-700">{b.nama}</td><td className="py-2 text-right font-mono">{fmt(b.jumlah)}</td></tr>
                    ))}
                    <tr className="font-bold"><td className="py-2 text-slate-800">Total Beban Operasional</td><td className="py-2 text-right font-mono text-rose-600">({fmt(totalBebanFiltered)})</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between py-4 px-4 bg-emerald-50 rounded-lg font-bold text-base border border-emerald-200">
              <span className="text-emerald-900">LABA BERSIH</span>
              <span className="font-mono text-emerald-700">{fmt(labaBersihFiltered)}</span>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
