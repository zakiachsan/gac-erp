"use client";

import { useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  fmt, totalAset, totalKewajiban, labaBersih, totalCashflow, totalPiutang, totalHutang,
  totalPphDipotong, totalPpnKeluaran, totalPpnMasukan, selisihPajak,
  trendData, piutangList, hutangList,
} from "@/lib/keuanganData";
import {
  TrendingUp, TrendingDown, Scale, Wallet, Landmark, Receipt,
  AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3,
} from "lucide-react";
import ExportButtons from "@/components/ExportButtons";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function RingkasanKeuanganPage() {
  const maxVal = useMemo(() => Math.max(...trendData.map((t) => Math.max(t.pendapatan, t.cogs, t.beban))), []);

  const topPiutangJatuhTempo = useMemo(() => {
    return piutangList
      .filter((p) => p.status === "Jatuh Tempo")
      .sort((a, b) => b.sisa - a.sisa)
      .slice(0, 5);
  }, []);

  const topHutangJatuhTempo = useMemo(() => {
    return hutangList
      .filter((h) => h.status === "Jatuh Tempo")
      .sort((a, b) => b.sisa - a.sisa)
      .slice(0, 5);
  }, []);

  return (
    <SidebarLayout title="Ringkasan Keuangan" subtitle="Executive Summary — overview KPI & trend">
      <div className="flex justify-end mb-4">
        <ExportButtons
          onExportPDF={() => {
            const headers = ["Bulan", "Pendapatan", "COGS", "Beban", "Laba Bersih"];
            const rows = trendData.map((t) => [t.bulan, t.pendapatan, t.cogs, t.beban, t.labaBersih]);
            exportToPDF("Ringkasan Keuangan", headers, rows, `ringkasan-keuangan.pdf`);
          }}
          onExportExcel={() => {
            const headers = ["Bulan", "Pendapatan", "COGS", "Beban", "Laba Bersih"];
            const rows = trendData.map((t) => [t.bulan, t.pendapatan, t.cogs, t.beban, t.labaBersih]);
            exportToExcel("Ringkasan Keuangan", headers, rows, `ringkasan-keuangan.xlsx`);
          }}
        />
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Total Aset" value={totalAset} icon={Scale} color="blue" />
        <KpiCard label="Total Hutang" value={totalKewajiban} icon={Landmark} color="amber" />
        <KpiCard label="Laba Bersih" value={labaBersih} icon={TrendingUp} color="emerald" />
        <KpiCard label="Cash Balance" value={totalCashflow} icon={Wallet} color="cyan" />
        <KpiCard label="PPh Terutang" value={totalPphDipotong} icon={Receipt} color="rose" />
        <KpiCard label="PPN Kurang Bayar" value={selisihPajak} icon={AlertTriangle} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-500" /> Trend Keuangan (6 Bulan Terakhir)</h3>
          </div>
          <div className="space-y-5">
            {trendData.map((t) => (
              <div key={t.bulan}>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                  <span>{t.bulan}</span>
                  <span className="text-emerald-600 font-bold">Laba: {fmt(t.labaBersih)}</span>
                </div>
                <div className="flex gap-1 h-6 items-end">
                  <div className="bg-blue-500 rounded-sm min-w-[4px]" style={{ width: `${(t.pendapatan / maxVal) * 100}%`, height: "100%" }} title={`Pendapatan: ${fmt(t.pendapatan)}`} />
                  <div className="bg-rose-400 rounded-sm min-w-[4px]" style={{ width: `${(t.cogs / maxVal) * 100}%`, height: "100%" }} title={`COGS: ${fmt(t.cogs)}`} />
                  <div className="bg-amber-400 rounded-sm min-w-[4px]" style={{ width: `${(t.beban / maxVal) * 100}%`, height: "100%" }} title={`Beban: ${fmt(t.beban)}`} />
                </div>
                <div className="flex gap-3 mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Pendapatan {fmt(t.pendapatan)}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> COGS {fmt(t.cogs)}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Beban {fmt(t.beban)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Piutang & Hutang</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Piutang</span>
                <span className="text-sm font-bold text-blue-700">{fmt(totalPiutang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Hutang</span>
                <span className="text-sm font-bold text-amber-700">{fmt(totalHutang)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-medium text-slate-700">Net Working Capital</span>
                <span className={`text-sm font-bold ${totalPiutang - totalHutang >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fmt(totalPiutang - totalHutang)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Pajak Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">PPN Keluaran</span>
                <span className="text-sm font-bold text-rose-600">{fmt(totalPpnKeluaran)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">PPN Masukan</span>
                <span className="text-sm font-bold text-emerald-600">{fmt(totalPpnMasukan)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">PPh Dipotong</span>
                <span className="text-sm font-bold text-amber-600">{fmt(totalPphDipotong)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-medium text-slate-700">Status PPN</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selisihPajak >= 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {selisihPajak >= 0 ? `Kurang Bayar ${fmt(selisihPajak)}` : `Lebih Bayar ${fmt(Math.abs(selisihPajak))}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jatuh Tempo Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-rose-500" /> Piutang Jatuh Tempo (Top 5)
          </h3>
          {topPiutangJatuhTempo.length > 0 ? (
            <table className="w-full text-xs">
              <thead className="text-left text-slate-500 border-b border-slate-200">
                <tr><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">No Invoice</th><th className="pb-2 font-medium text-right">Sisa</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPiutangJatuhTempo.map((p) => (
                  <tr key={p.id}><td className="py-2 text-slate-700 font-medium">{p.pihak}</td><td className="py-2 font-mono text-slate-500">{p.noDokumen}</td><td className="py-2 text-right font-mono font-bold text-rose-600">{fmt(p.sisa)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Tidak ada piutang jatuh tempo</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-amber-500" /> Hutang Jatuh Tempo (Top 5)
          </h3>
          {topHutangJatuhTempo.length > 0 ? (
            <table className="w-full text-xs">
              <thead className="text-left text-slate-500 border-b border-slate-200">
                <tr><th className="pb-2 font-medium">Supplier</th><th className="pb-2 font-medium">No PO</th><th className="pb-2 font-medium text-right">Sisa</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topHutangJatuhTempo.map((h) => (
                  <tr key={h.id}><td className="py-2 text-slate-700 font-medium">{h.pihak}</td><td className="py-2 font-mono text-slate-500">{h.noDokumen}</td><td className="py-2 text-right font-mono font-bold text-amber-600">{fmt(h.sisa)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Tidak ada hutang jatuh tempo</p>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function KpiCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700" },
    amber: { bg: "bg-amber-50", text: "text-amber-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-700" },
    rose: { bg: "bg-rose-50", text: "text-rose-700" },
    violet: { bg: "bg-violet-50", text: "text-violet-700" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${c.text}`} />
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{label}</span>
      </div>
      <div className={`text-lg font-bold ${c.text}`}>{fmt(Math.abs(value))}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{value >= 0 ? "Positif" : "Negatif"}</div>
    </div>
  );
}
