"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, piutangList, hutangList } from "@/lib/keuanganData";

function AgingTable({ title, data, total }: { title: string; data: typeof piutangList; total: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-sm font-bold text-slate-800">Total: {fmt(total)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="pb-2 font-medium">Pihak</th>
              <th className="pb-2 font-medium">No Dokumen</th>
              <th className="pb-2 font-medium text-right">Jatuh Tempo</th>
              <th className="pb-2 font-medium text-right">Sisa</th>
              <th className="pb-2 font-medium text-right">Current</th>
              <th className="pb-2 font-medium text-right">1-30</th>
              <th className="pb-2 font-medium text-right">31-60</th>
              <th className="pb-2 font-medium text-right">61-90</th>
              <th className="pb-2 font-medium text-right">90+</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="py-2 font-medium text-slate-800">{item.pihak}</td>
                <td className="py-2 font-mono text-xs text-slate-600">{item.noDokumen}</td>
                <td className="py-2 text-right text-xs text-slate-500">{item.jatuhTempo}</td>
                <td className="py-2 text-right font-mono font-semibold">{fmt(item.sisa)}</td>
                <td className="py-2 text-right font-mono text-xs">{item.current ? fmt(item.current) : "—"}</td>
                <td className="py-2 text-right font-mono text-xs">{item.d130 ? fmt(item.d130) : "—"}</td>
                <td className="py-2 text-right font-mono text-xs">{item.d3160 ? fmt(item.d3160) : "—"}</td>
                <td className="py-2 text-right font-mono text-xs">{item.d6190 ? fmt(item.d6190) : "—"}</td>
                <td className="py-2 text-right font-mono text-xs">{item.d90plus ? fmt(item.d90plus) : "—"}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HutangPiutangPage() {
  const [period, setPeriod] = useState({ from: "2026-01-01", to: "2026-12-31", quick: "thisYear" });
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [pihakSearch, setPihakSearch] = useState("");
  const [agingFilter, setAgingFilter] = useState("Semua");

  const subtitle = `Aging report — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const filterData = (data: typeof piutangList) => {
    return data.filter((item) => {
      if (item.tanggal < period.from || item.tanggal > period.to) return false;
      if (statusFilter !== "Semua" && item.status !== statusFilter) return false;
      if (pihakSearch && !item.pihak.toLowerCase().includes(pihakSearch.toLowerCase())) return false;
      if (agingFilter !== "Semua") {
        if (agingFilter === "current" && item.current === 0) return false;
        if (agingFilter === "d130" && item.d130 === 0) return false;
        if (agingFilter === "d3160" && item.d3160 === 0) return false;
        if (agingFilter === "d6190" && item.d6190 === 0) return false;
        if (agingFilter === "d90plus" && item.d90plus === 0) return false;
      }
      return true;
    });
  };

  const piutangFiltered = useMemo(() => filterData(piutangList), [period, statusFilter, pihakSearch, agingFilter]);
  const hutangFiltered = useMemo(() => filterData(hutangList), [period, statusFilter, pihakSearch, agingFilter]);

  const totalPiutangFiltered = piutangFiltered.reduce((s, i) => s + i.sisa, 0);
  const totalHutangFiltered = hutangFiltered.reduce((s, i) => s + i.sisa, 0);

  return (
    <SidebarLayout title="Hutang / Piutang" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Hutang Piutang")}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Belum Lunas</option>
                <option>Jatuh Tempo</option>
                <option>Lunas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Pihak</label>
              <input type="text" placeholder="Cari nama..." value={pihakSearch} onChange={(e) => setPihakSearch(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Aging</label>
              <select value={agingFilter} onChange={(e) => setAgingFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="Semua">Semua</option>
                <option value="current">Current</option>
                <option value="d130">1–30 hari</option>
                <option value="d3160">31–60 hari</option>
                <option value="d6190">61–90 hari</option>
                <option value="d90plus">90+ hari</option>
              </select>
            </div>
          </div>
        }
      />
      <div className="space-y-5">
        <AgingTable title="Piutang Usaha (AR Aging)" data={piutangFiltered} total={totalPiutangFiltered} />
        <AgingTable title="Hutang Usaha (AP Aging)" data={hutangFiltered} total={totalHutangFiltered} />
      </div>
    </SidebarLayout>
  );
}
