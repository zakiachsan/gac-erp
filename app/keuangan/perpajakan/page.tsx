"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, pajakList, pphList, ppnList } from "@/lib/keuanganData";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { Search, Receipt, Calculator } from "lucide-react";

type TabKey = "overview" | "pph" | "ppn";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview Pajak" },
  { key: "pph", label: "PPh Detail" },
  { key: "ppn", label: "PPN Detail" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "Normal": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Dibatalkan": return "bg-rose-50 text-rose-700 border-rose-200";
    case "Direvisi": return "bg-amber-50 text-amber-700 border-amber-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function PerpajakanPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });

  const subtitle = `Monitoring pajak — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  return (
    <SidebarLayout title="Perpajakan" subtitle={subtitle}>
      <FinanceFilterBar onChange={setPeriod} hideQuickFilter={false} />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === t.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab period={period} />}
      {activeTab === "pph" && <PphTab period={period} />}
      {activeTab === "ppn" && <PpnTab period={period} />}
    </SidebarLayout>
  );
}

/* ───────────── Overview Tab ───────────── */
function OverviewTab({ period }: { period: { from: string; to: string } }) {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filtered = useMemo(() => {
    return pajakList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenis !== jenisFilter) return false;
      if (statusFilter !== "Semua" && p.status !== statusFilter) return false;
      return true;
    });
  }, [period, jenisFilter, statusFilter]);

  const totalKeluaran = filtered.filter((p) => p.jenis === "Pajak Keluaran").reduce((s, p) => s + p.ppn, 0);
  const totalMasukan = filtered.filter((p) => p.jenis === "Pajak Masukan").reduce((s, p) => s + p.ppn, 0);
  const totalPph = filtered.reduce((s, p) => s + p.pph, 0);
  const selisih = totalKeluaran - totalMasukan;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Pajak Keluaran</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{fmt(totalKeluaran)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Pajak Masukan</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{fmt(totalMasukan)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total PPh</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{fmt(totalPph)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{selisih >= 0 ? "Kurang Bayar" : "Lebih Bayar"}</div>
          <div className={`text-xl font-bold mt-1 ${selisih >= 0 ? "text-amber-600" : "text-emerald-600"}`}>{fmt(Math.abs(selisih))}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Pajak</label>
            <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
              <option>Semua</option>
              <option>Pajak Keluaran</option>
              <option>Pajak Masukan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
              <option>Semua</option>
              <option>Normal</option>
              <option>Dibatalkan</option>
              <option>Direvisi</option>
            </select>
          </div>
          <div className="ml-auto">
            <ExportPajakButtons
              filename={`perpajakan-overview_${period.from}_${period.to}`}
              headers={["Jenis", "No Faktur", "Tanggal", "DPP", "PPN", "PPh", "Total", "Status"]}
              rows={filtered.map((p) => [p.jenis, p.noFaktur, p.tanggal, p.dpp, p.ppn, p.pph || "—", p.total, p.status])}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">No Faktur</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium text-right">DPP</th>
                <th className="px-4 py-3 font-medium text-right">PPN</th>
                <th className="px-4 py-3 font-medium text-right">PPh</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.jenis === "Pajak Keluaran" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{p.jenis}</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.noFaktur}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.tanggal}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{fmt(p.dpp)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{fmt(p.ppn)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{p.pph ? fmt(p.pph) : "—"}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">{fmt(p.total)}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(p.status)}`}>{p.status}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────── PPh Tab ───────────── */
function PphTab({ period }: { period: { from: string; to: string } }) {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return pphList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenisPph !== jenisFilter) return false;
      if (search && !p.pihak.toLowerCase().includes(search.toLowerCase()) && !p.noBukti.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [period, jenisFilter, search]);

  const jenisOptions = useMemo(() => [...new Set(pphList.map((p) => p.jenisPph))], []);
  const totalDpp = filtered.reduce((s, p) => s + p.dpp, 0);
  const totalPph = filtered.reduce((s, p) => s + p.pph, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Jumlah Bupot</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{filtered.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total DPP</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{fmt(totalDpp)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total PPh Dipotong</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{fmt(totalPph)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Jenis PPh</label>
            <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]">
              <option value="Semua">Semua</option>
              {jenisOptions.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari pihak / no bukti..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="ml-auto">
            <ExportPajakButtons
              filename={`pph-report_${period.from}_${period.to}`}
              headers={["No Bukti", "Tanggal", "Pihak", "NPWP", "Jenis PPh", "Tarif %", "DPP", "PPh", "Status"]}
              rows={filtered.map((p) => [p.noBukti, p.tanggal, p.pihak, p.npwp, p.jenisPph, p.tarif, p.dpp, p.pph, p.status])}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">No Bukti</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Pihak</th>
                <th className="px-4 py-3 font-medium">NPWP</th>
                <th className="px-4 py-3 font-medium">Jenis PPh</th>
                <th className="px-4 py-3 font-medium text-right">Tarif (%)</th>
                <th className="px-4 py-3 font-medium text-right">DPP</th>
                <th className="px-4 py-3 font-medium text-right">PPh</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{p.noBukti}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.tanggal}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{p.pihak}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.npwp}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.jenisPph}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{p.tarif}%</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(p.dpp)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-rose-600">{fmt(p.pph)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${p.status === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">Tidak ada data PPh</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────── PPN Tab ───────────── */
function PpnTab({ period }: { period: { from: string; to: string } }) {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return ppnList.filter((p) => {
      if (p.tanggal < period.from || p.tanggal > period.to) return false;
      if (jenisFilter !== "Semua" && p.jenis !== jenisFilter) return false;
      if (statusFilter !== "Semua" && p.status !== statusFilter) return false;
      if (search && !p.pihak.toLowerCase().includes(search.toLowerCase()) && !p.noFaktur.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [period, jenisFilter, statusFilter, search]);

  const totalKeluaran = filtered.filter((p) => p.jenis === "Keluaran").reduce((s, p) => s + p.ppn, 0);
  const totalMasukan = filtered.filter((p) => p.jenis === "Masukan").reduce((s, p) => s + p.ppn, 0);
  const selisih = totalKeluaran - totalMasukan;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">PPN Keluaran</div>
          <div className="text-xl font-bold text-rose-700 mt-1">{fmt(totalKeluaran)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">PPN Masukan</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{fmt(totalMasukan)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{selisih >= 0 ? "Kurang Bayar" : "Lebih Bayar"}</div>
          <div className={`text-xl font-bold mt-1 ${selisih >= 0 ? "text-amber-700" : "text-emerald-700"}`}>{fmt(Math.abs(selisih))}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Jenis</label>
            <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
              <option value="Semua">Semua</option>
              <option value="Keluaran">Keluaran</option>
              <option value="Masukan">Masukan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[130px]">
              <option value="Semua">Semua</option>
              <option value="Normal">Normal</option>
              <option value="Dibatalkan">Dibatalkan</option>
              <option value="Direvisi">Direvisi</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari pihak / no faktur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="ml-auto">
            <ExportPajakButtons
              filename={`ppn-report_${period.from}_${period.to}`}
              headers={["No Faktur", "Tanggal", "Pihak", "NPWP", "Jenis", "DPP", "PPN", "Status"]}
              rows={filtered.map((p) => [p.noFaktur, p.tanggal, p.pihak, p.npwp, p.jenis, p.dpp, p.ppn, p.status])}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">No Faktur</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Pihak</th>
                <th className="px-4 py-3 font-medium">NPWP</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium text-right">DPP</th>
                <th className="px-4 py-3 font-medium text-right">PPN</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{p.noFaktur}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.tanggal}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{p.pihak}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.npwp}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.jenis === "Keluaran" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{p.jenis}</span></td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(p.dpp)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">{fmt(p.ppn)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${p.status === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : p.status === "Dibatalkan" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm text-slate-400">Tidak ada data PPN</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Export Buttons ───────────── */
function ExportPajakButtons({ filename, headers, rows }: { filename: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportToPDF("Laporan Pajak", headers, rows, `${filename}.pdf`)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-lg transition"
      >
        <Receipt className="w-3.5 h-3.5" />
        PDF
      </button>
      <button
        onClick={() => exportToExcel("Laporan Pajak", headers, rows, `${filename}.xlsx`)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg transition"
      >
        <Calculator className="w-3.5 h-3.5" />
        Excel
      </button>
    </div>
  );
}
