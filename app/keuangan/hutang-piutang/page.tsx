"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, piutangList, hutangList } from "@/lib/keuanganData";
import { Mail, CheckCircle, FileText, ExternalLink, AlertCircle } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

type AgingItem = (typeof piutangList)[number];

function AgingTable({
  title,
  data,
  total,
  onReminder,
  onReconcile,
}: {
  title: string;
  data: AgingItem[];
  total: number;
  onReminder: (item: AgingItem) => void;
  onReconcile: (item: AgingItem) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-sm font-bold text-slate-800">Total: {fmt(total)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-3 py-3 font-medium">Pihak</th>
              <th className="px-3 py-3 font-medium">No Dokumen</th>
              <th className="px-3 py-3 font-medium text-right">Jatuh Tempo</th>
              <th className="px-3 py-3 font-medium text-right">Sisa</th>
              <th className="px-3 py-3 font-medium text-right">Current</th>
              <th className="px-3 py-3 font-medium text-right">1-30</th>
              <th className="px-3 py-3 font-medium text-right">31-60</th>
              <th className="px-3 py-3 font-medium text-right">61-90</th>
              <th className="px-3 py-3 font-medium text-right">90+</th>
              <th className="px-3 py-3 font-medium text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50 transition">
                <td className="px-3 py-3 font-medium text-slate-800">{item.pihak}</td>
                <td className="px-3 py-3 font-mono text-xs text-slate-600">{item.noDokumen}</td>
                <td className="px-3 py-3 text-right text-xs text-slate-500">{item.jatuhTempo}</td>
                <td className="px-3 py-3 text-right font-mono font-semibold">{fmt(item.sisa)}</td>
                <td className="px-3 py-3 text-right font-mono text-xs">{item.current ? fmt(item.current) : "—"}</td>
                <td className="px-3 py-3 text-right font-mono text-xs">{item.d130 ? fmt(item.d130) : "—"}</td>
                <td className="px-3 py-3 text-right font-mono text-xs">{item.d3160 ? fmt(item.d3160) : "—"}</td>
                <td className="px-3 py-3 text-right font-mono text-xs">{item.d6190 ? fmt(item.d6190) : "—"}</td>
                <td className="px-3 py-3 text-right font-mono text-xs text-rose-600">{item.d90plus ? fmt(item.d90plus) : "—"}</td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onReminder(item)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Kirim Reminder"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => alert(`Detail Invoice: ${item.noDokumen}\nPihak: ${item.pihak}\nTotal: ${fmt(item.total)}\nSisa: ${fmt(item.sisa)}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Lihat Detail Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {item.status !== "Lunas" && (
                      <button
                        onClick={() => onReconcile(item)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Tandai Lunas (Reconcile)"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-sm text-slate-400">
                  Tidak ada data
                </td>
              </tr>
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
  const [toast, setToast] = useState<string | null>(null);

  const subtitle = `Aging report — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const filterData = (data: AgingItem[]) => {
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

  const handleReminder = (item: AgingItem) => {
    setToast(`Reminder email akan dikirim ke ${item.pihak} terkait ${item.noDokumen}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReconcile = (item: AgingItem) => {
    setToast(`${item.noDokumen} ditandai LUNAS. Jurnal otomatis dibuat.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportPDF = () => {
    const headers = ["Pihak", "No Dokumen", "Jatuh Tempo", "Sisa", "Current", "1-30", "31-60", "61-90", "90+", "Status"];
    const rows = [...piutangFiltered, ...hutangFiltered].map((i) => [
      i.pihak,
      i.noDokumen,
      i.jatuhTempo,
      i.sisa,
      i.current,
      i.d130,
      i.d3160,
      i.d6190,
      i.d90plus,
      i.status,
    ]);
    exportToPDF("Hutang Piutang Aging", headers, rows, `hutang-piutang_${period.from}_${period.to}.pdf`);
  };

  const handleExportExcel = () => {
    const headers = ["Pihak", "No Dokumen", "Jatuh Tempo", "Sisa", "Current", "1-30", "31-60", "61-90", "90+", "Status"];
    const rows = [...piutangFiltered, ...hutangFiltered].map((i) => [
      i.pihak,
      i.noDokumen,
      i.jatuhTempo,
      i.sisa,
      i.current,
      i.d130,
      i.d3160,
      i.d6190,
      i.d90plus,
      i.status,
    ]);
    exportToExcel("Hutang Piutang Aging", headers, rows, `hutang-piutang_${period.from}_${period.to}.xlsx`);
  };

  return (
    <SidebarLayout title="Hutang / Piutang" subtitle={subtitle}>
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          {toast}
        </div>
      )}

      <FinanceFilterBar
        onChange={setPeriod}
        onExport={handleExportPDF}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                <option>Belum Lunas</option>
                <option>Jatuh Tempo</option>
                <option>Lunas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Pihak</label>
              <input
                type="text"
                placeholder="Cari nama..."
                value={pihakSearch}
                onChange={(e) => setPihakSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Aging</label>
              <select
                value={agingFilter}
                onChange={(e) => setAgingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
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

      <div className="flex items-center gap-2 mb-4">
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

      <div className="space-y-5">
        <AgingTable
          title="Piutang Usaha (AR Aging)"
          data={piutangFiltered}
          total={totalPiutangFiltered}
          onReminder={handleReminder}
          onReconcile={handleReconcile}
        />
        <AgingTable
          title="Hutang Usaha (AP Aging)"
          data={hutangFiltered}
          total={totalHutangFiltered}
          onReminder={handleReminder}
          onReconcile={handleReconcile}
        />
      </div>
    </SidebarLayout>
  );
}
