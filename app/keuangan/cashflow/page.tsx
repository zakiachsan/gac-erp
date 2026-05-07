"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { Banknote, Scale, Landmark } from "lucide-react";
import {
  fmt, cashflowOperasional, cashflowInvestasi, cashflowPendanaan,
} from "@/lib/keuanganData";

export default function CashflowPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [showOperasional, setShowOperasional] = useState(true);
  const [showInvestasi, setShowInvestasi] = useState(true);
  const [showPendanaan, setShowPendanaan] = useState(true);

  const subtitle = `Laporan arus kas — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const sections = useMemo(() => {
    const result = [];
    if (showOperasional) result.push({ title: "Aktivitas Operasional", data: cashflowOperasional, icon: Banknote, color: "blue" });
    if (showInvestasi) result.push({ title: "Aktivitas Investasi", data: cashflowInvestasi, icon: Scale, color: "amber" });
    if (showPendanaan) result.push({ title: "Aktivitas Pendanaan", data: cashflowPendanaan, icon: Landmark, color: "emerald" });
    return result;
  }, [showOperasional, showInvestasi, showPendanaan]);

  const totals = useMemo(() => {
    let op = 0, inv = 0, pen = 0;
    if (showOperasional) op = cashflowOperasional.reduce((s, i) => s + i.jumlah, 0);
    if (showInvestasi) inv = cashflowInvestasi.reduce((s, i) => s + i.jumlah, 0);
    if (showPendanaan) pen = cashflowPendanaan.reduce((s, i) => s + i.jumlah, 0);
    return { op, inv, pen, total: op + inv + pen };
  }, [showOperasional, showInvestasi, showPendanaan]);

  return (
    <SidebarLayout title="Cashflow" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Cashflow")}
        extraFilters={
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showOperasional} onChange={(e) => setShowOperasional(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Operasional
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showInvestasi} onChange={(e) => setShowInvestasi(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Investasi
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showPendanaan} onChange={(e) => setShowPendanaan(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Pendanaan
            </label>
          </div>
        }
      />
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Operasional", value: totals.op, color: "text-blue-600" },
            { label: "Investasi", value: totals.inv, color: "text-amber-600" },
            { label: "Pendanaan", value: totals.pen, color: "text-emerald-600" },
            { label: "Total Cashflow", value: totals.total, color: totals.total >= 0 ? "text-emerald-600" : "text-rose-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{s.label}</div>
              <div className={`text-xl font-bold mt-1 ${s.color}`}>{fmt(Math.abs(s.value))}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.value >= 0 ? "Masuk" : "Keluar"}</div>
            </div>
          ))}
        </div>
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><section.icon className={`w-4 h-4 text-${section.color}-500`} /> {section.title}</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200"><tr><th className="pb-2 font-medium">Keterangan</th><th className="pb-2 font-medium text-right">Jumlah</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {section.data.map((item, i) => (
                  <tr key={i}><td className="py-2 text-slate-700">{item.nama}</td><td className={`py-2 text-right font-mono font-medium ${item.tipe === "masuk" ? "text-emerald-600" : "text-rose-600"}`}>{item.tipe === "masuk" ? "" : "("}{fmt(Math.abs(item.jumlah))}{item.tipe === "masuk" ? "" : ")"}</td></tr>
                ))}
                <tr className="font-bold border-t-2 border-slate-200">
                  <td className="py-2 text-slate-800">Subtotal</td>
                  <td className={`py-2 text-right font-mono ${section.data.reduce((s, i) => s + i.jumlah, 0) >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fmt(Math.abs(section.data.reduce((s, i) => s + i.jumlah, 0)))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}
