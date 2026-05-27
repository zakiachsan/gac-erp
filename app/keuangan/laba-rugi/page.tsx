"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import {
  fmt,
  labaRugiPendapatan,
  labaRugiCogs,
  labaRugiBeban,
  labaRugiPendapatanPrev,
  labaRugiCogsPrev,
  labaRugiBebanPrev,
  bukuBesarList,
  type LabaRugiItem,
} from "@/lib/keuanganData";
import { Eye, X } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function LabaRugiPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [showPendapatan, setShowPendapatan] = useState(true);
  const [showCogs, setShowCogs] = useState(true);
  const [showBeban, setShowBeban] = useState(true);
  const [showCompare, setShowCompare] = useState(true);
  const [drillDown, setDrillDown] = useState<{ open: boolean; item: LabaRugiItem | null }>({
    open: false,
    item: null,
  });

  const subtitle = `Laporan laba rugi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const pendapatanFiltered = showPendapatan ? labaRugiPendapatan : [];
  const cogsFiltered = showCogs ? labaRugiCogs : [];
  const bebanFiltered = showBeban ? labaRugiBeban : [];

  const pendapatanPrevFiltered = showPendapatan && showCompare ? labaRugiPendapatanPrev : undefined;
  const cogsPrevFiltered = showCogs && showCompare ? labaRugiCogsPrev : undefined;
  const bebanPrevFiltered = showBeban && showCompare ? labaRugiBebanPrev : undefined;

  const totalPendapatan = pendapatanFiltered.reduce((s, i) => s + i.jumlah, 0);
  const totalCogs = cogsFiltered.reduce((s, i) => s + i.jumlah, 0);
  const totalBeban = bebanFiltered.reduce((s, i) => s + i.jumlah, 0);
  const labaKotor = totalPendapatan - totalCogs;
  const labaBersih = labaKotor - totalBeban;

  const totalPendapatanPrev = pendapatanPrevFiltered?.reduce((s, i) => s + i.jumlah, 0);
  const totalCogsPrev = cogsPrevFiltered?.reduce((s, i) => s + i.jumlah, 0);
  const totalBebanPrev = bebanPrevFiltered?.reduce((s, i) => s + i.jumlah, 0);
  const labaKotorPrev = totalPendapatanPrev !== undefined && totalCogsPrev !== undefined ? totalPendapatanPrev - totalCogsPrev : undefined;
  const labaBersihPrev = labaKotorPrev !== undefined && totalBebanPrev !== undefined ? labaKotorPrev - totalBebanPrev : undefined;

  return (
    <SidebarLayout title="Laba Rugi" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => handleLabaRugiExport(labaRugiPendapatan, labaRugiCogs, labaRugiBeban)}
        extraFilters={
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showPendapatan}
                onChange={(e) => setShowPendapatan(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Pendapatan
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showCogs}
                onChange={(e) => setShowCogs(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              COGS
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showBeban}
                onChange={(e) => setShowBeban(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Beban Operasional
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompare}
                onChange={(e) => setShowCompare(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Bandingkan bulan lalu
            </label>
          </div>
        }
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 text-center mb-6">LAPORAN LABA RUGI</h3>

          {showPendapatan && (
            <LabaRugiSection
              title="PENDAPATAN"
              items={labaRugiPendapatan}
              prevItems={pendapatanPrevFiltered}
              onDrillDown={(item) => setDrillDown({ open: true, item })}
            />
          )}

          {showCogs && (
            <LabaRugiSection
              title="BEBAN POKOK PENDAPATAN (COGS)"
              items={labaRugiCogs}
              prevItems={cogsPrevFiltered}
              onDrillDown={(item) => setDrillDown({ open: true, item })}
            />
          )}

          {showPendapatan && showCogs && (
            <SummaryRow label="LABA KOTOR" value={labaKotor} prevValue={labaKotorPrev} theme="emerald" />
          )}

          {showBeban && (
            <LabaRugiSection
              title="BEBAN OPERASIONAL"
              items={labaRugiBeban}
              prevItems={bebanPrevFiltered}
              onDrillDown={(item) => setDrillDown({ open: true, item })}
            />
          )}

          <SummaryRow label="LABA BERSIH" value={labaBersih} prevValue={labaBersihPrev} theme="blue" />
        </div>
      </div>

      {/* Drill-down Modal */}
      {drillDown.open && drillDown.item && (
        <LabaRugiDrillDownModal item={drillDown.item} onClose={() => setDrillDown({ open: false, item: null })} />
      )}
    </SidebarLayout>
  );
}

/* ───────────── Components ───────────── */

function LabaRugiSection({
  title,
  items,
  prevItems,
  onDrillDown,
}: {
  title: string;
  items: LabaRugiItem[];
  prevItems?: LabaRugiItem[];
  onDrillDown: (item: LabaRugiItem) => void;
}) {
  const total = items.reduce((s, i) => s + i.jumlah, 0);
  const totalPrev = prevItems?.reduce((s, i) => s + i.jumlah, 0);

  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{title}</div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {items.map((p, idx) => {
            const prev = prevItems?.[idx];
            return (
              <tr key={idx} className="group hover:bg-slate-50 transition">
                <td className="py-2 pl-4 text-slate-700 flex items-center gap-2">
                  {p.nama}
                  {p.kodeAkun && (
                    <button
                      onClick={() => onDrillDown(p)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-blue-500 hover:bg-blue-50 rounded transition"
                      title="Lihat Buku Besar"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
                <td className="py-2 text-right font-mono">
                  {fmt(p.jumlah)}
                  {prev && (
                    <div className="text-[10px] text-slate-400 font-normal">
                      vs {fmt(prev.jumlah)} ({percentChange(p.jumlah, prev.jumlah)})
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          <tr className="font-bold border-t-2 border-slate-200">
            <td className="py-2 text-slate-800">Total {title.split(" ")[0]}</td>
            <td className="py-2 text-right font-mono text-slate-900">
              {fmt(total)}
              {totalPrev !== undefined && (
                <div className="text-[10px] text-slate-400 font-normal">
                  vs {fmt(totalPrev)} ({percentChange(total, totalPrev)})
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  prevValue,
  theme,
}: {
  label: string;
  value: number;
  prevValue?: number;
  theme: "emerald" | "blue";
}) {
  const colorClass = theme === "emerald" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-blue-700 bg-blue-50 border-blue-200";
  return (
    <div className={`flex justify-between py-4 px-4 rounded-lg font-bold text-base border mb-6 ${colorClass}`}>
      <span>{label}</span>
      <div className="text-right">
        <span className="font-mono">{fmt(value)}</span>
        {prevValue !== undefined && (
          <div className="text-xs font-normal opacity-70">
            vs {fmt(prevValue)} ({percentChange(value, prevValue)})
          </div>
        )}
      </div>
    </div>
  );
}

function LabaRugiDrillDownModal({ item, onClose }: { item: LabaRugiItem; onClose: () => void }) {
  const relatedEntries = bukuBesarList.filter((b) => item.kodeAkun?.includes(b.kodeAkun));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Detail Buku Besar</h3>
            <p className="text-xs text-slate-500">
              {item.nama} ({item.kodeAkun?.join(", ")})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {relatedEntries.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-8">Tidak ada transaksi untuk akun ini di periode ini.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2 font-medium">Tanggal</th>
                  <th className="px-3 py-2 font-medium">No Bukti</th>
                  <th className="px-3 py-2 font-medium">Keterangan</th>
                  <th className="px-3 py-2 font-medium text-right">Debit</th>
                  <th className="px-3 py-2 font-medium text-right">Kredit</th>
                  <th className="px-3 py-2 font-medium text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relatedEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2 text-xs text-slate-600">{e.tanggal}</td>
                    <td className="px-3 py-2 font-mono text-xs text-blue-700">{e.noBukti}</td>
                    <td className="px-3 py-2 text-slate-700">{e.keterangan}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{e.debit ? fmt(e.debit) : "—"}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{e.kredit ? fmt(e.kredit) : "—"}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold">{fmt(e.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function percentChange(current: number, previous: number): string {
  if (!previous) return "—";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/* ───────────── Export helpers ───────────── */
function handleLabaRugiExport(
  pendapatan: LabaRugiItem[],
  cogs: LabaRugiItem[],
  beban: LabaRugiItem[]
) {
  const headers = ["Kategori", "Akun", "Jumlah (Rp)"];
  const totalPendapatan = pendapatan.reduce((s, i) => s + i.jumlah, 0);
  const totalCogs = cogs.reduce((s, i) => s + i.jumlah, 0);
  const totalBeban = beban.reduce((s, i) => s + i.jumlah, 0);
  const labaKotor = totalPendapatan - totalCogs;
  const labaBersih = labaKotor - totalBeban;
  const rows: (string | number)[][] = [
    ["PENDAPATAN", "", ""],
    ...pendapatan.map((i) => ["", i.nama, i.jumlah]),
    ["", "Total Pendapatan", totalPendapatan],
    ["COGS", "", ""],
    ...cogs.map((i) => ["", i.nama, i.jumlah]),
    ["", "Total COGS", totalCogs],
    ["", "Laba Kotor", labaKotor],
    ["BEBAN OPERASIONAL", "", ""],
    ...beban.map((i) => ["", i.nama, i.jumlah]),
    ["", "Total Beban", totalBeban],
    ["", "Laba Bersih", labaBersih],
  ];
  exportToPDF("Laba Rugi", headers, rows, "laba-rugi.pdf");
}
