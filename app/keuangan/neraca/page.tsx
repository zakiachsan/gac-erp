"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar from "@/components/FinanceFilterBar";
import { Scale, Landmark, X, Eye, BookOpen } from "lucide-react";
import {
  fmt,
  neracaAktivaLancar,
  neracaAktivaTetap,
  neracaKewajiban,
  neracaEkuitas,
  neracaAktivaLancarPrev,
  neracaAktivaTetapPrev,
  neracaKewajibanPrev,
  neracaEkuitasPrev,
  bukuBesarList,
  type NeracaItem,
} from "@/lib/keuanganData";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

export default function NeracaPage() {
  const [period, setPeriod] = useState<{ from: string; to: string; quick: string }>({
    from: "2026-05-31",
    to: "2026-05-31",
    quick: "custom",
  });
  const [showCompare, setShowCompare] = useState(true);
  const [drillDown, setDrillDown] = useState<{ open: boolean; item: NeracaItem | null }>({
    open: false,
    item: null,
  });

  const subtitle = `Laporan posisi keuangan per ${new Date(period.from).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  return (
    <SidebarLayout title="Neraca" subtitle={subtitle}>
      <FinanceFilterBar
        singleDate
        singleDateLabel="Per Tanggal"
        defaultQuick="custom"
        hideQuickFilter
        onChange={setPeriod}
        onExport={() => handleNeracaExport(neracaAktivaLancar, neracaAktivaTetap, neracaKewajiban, neracaEkuitas)}
        extraFilters={
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompare}
              onChange={(e) => setShowCompare(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Bandingkan dengan bulan lalu
          </label>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AKTIVA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" /> AKTIVA
          </h3>

          <NeracaSection
            title="Aktiva Lancar"
            items={neracaAktivaLancar}
            prevItems={showCompare ? neracaAktivaLancarPrev : undefined}
            onDrillDown={(item) => setDrillDown({ open: true, item })}
          />
          <NeracaSection
            title="Aktiva Tetap"
            items={neracaAktivaTetap}
            prevItems={showCompare ? neracaAktivaTetapPrev : undefined}
            onDrillDown={(item) => setDrillDown({ open: true, item })}
          />

          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex justify-between font-bold text-base">
            <span className="text-slate-900">TOTAL AKTIVA</span>
            <div className="text-right">
              <span className="text-blue-700 font-mono">{fmt(totalAset)}</span>
              {showCompare && (
                <div className="text-xs font-normal text-slate-400">
                  vs {fmt(totalAsetPrev)} ({percentChange(totalAset, totalAsetPrev)})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PASIVA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-500" /> PASIVA
          </h3>

          <NeracaSection
            title="Kewajiban"
            items={neracaKewajiban}
            prevItems={showCompare ? neracaKewajibanPrev : undefined}
            onDrillDown={(item) => setDrillDown({ open: true, item })}
          />
          <NeracaSection
            title="Ekuitas"
            items={neracaEkuitas}
            prevItems={showCompare ? neracaEkuitasPrev : undefined}
            onDrillDown={(item) => setDrillDown({ open: true, item })}
          />

          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex justify-between font-bold text-base">
            <span className="text-slate-900">TOTAL PASIVA</span>
            <div className="text-right">
              <span className="text-emerald-700 font-mono">{fmt(totalKewajiban + totalEkuitas)}</span>
              {showCompare && (
                <div className="text-xs font-normal text-slate-400">
                  vs {fmt(totalKewajibanPrev + totalEkuitasPrev)} ({percentChange(totalKewajiban + totalEkuitas, totalKewajibanPrev + totalEkuitasPrev)})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down Modal */}
      {drillDown.open && drillDown.item && (
        <NeracaDrillDownModal item={drillDown.item} onClose={() => setDrillDown({ open: false, item: null })} />
      )}
    </SidebarLayout>
  );
}

/* ───────────── Helper Components ───────────── */

function NeracaSection({
  title,
  items,
  prevItems,
  onDrillDown,
}: {
  title: string;
  items: NeracaItem[];
  prevItems?: NeracaItem[];
  onDrillDown: (item: NeracaItem) => void;
}) {
  const total = items.reduce((s, i) => s + i.jumlah, 0);
  const totalPrev = prevItems?.reduce((s, i) => s + i.jumlah, 0);

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{title}</div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {items.map((a, idx) => {
            const prev = prevItems?.[idx];
            return (
              <tr key={a.kode} className="group hover:bg-slate-50 transition">
                <td className="py-2 text-slate-600 flex items-center gap-2">
                  {a.nama}
                  {a.kodeAkun && (
                    <button
                      onClick={() => onDrillDown(a)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-blue-500 hover:bg-blue-50 rounded transition"
                      title="Lihat Buku Besar"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
                <td className="py-2 text-right font-mono font-medium">
                  {fmt(a.jumlah)}
                  {prev && (
                    <div className="text-[10px] text-slate-400 font-normal">
                      vs {fmt(prev.jumlah)} ({percentChange(a.jumlah, prev.jumlah)})
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          <tr className="font-bold">
            <td className="py-2 text-slate-800">Total {title}</td>
            <td className="py-2 text-right font-mono text-blue-700">
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

function NeracaDrillDownModal({ item, onClose }: { item: NeracaItem; onClose: () => void }) {
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
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
function handleNeracaExport(
  aktivaLancar: NeracaItem[],
  aktivaTetap: NeracaItem[],
  kewajiban: NeracaItem[],
  ekuitas: NeracaItem[]
) {
  const headers = ["Kategori", "Akun", "Jumlah (Rp)"];
  const rows: (string | number)[][] = [
    ["AKTIVA", "", ""],
    ["", "Aktiva Lancar", ""],
    ...aktivaLancar.map((i) => ["", i.nama, i.jumlah]),
    ["", "Aktiva Tetap", ""],
    ...aktivaTetap.map((i) => ["", i.nama, i.jumlah]),
    ["KEWAJIBAN", "", ""],
    ...kewajiban.map((i) => ["", i.nama, i.jumlah]),
    ["EKUITAS", "", ""],
    ...ekuitas.map((i) => ["", i.nama, i.jumlah]),
  ];
  exportToPDF("Neraca", headers, rows, "neraca.pdf");
}

/* ───────────── Totals ───────────── */
const totalAset = [...neracaAktivaLancar, ...neracaAktivaTetap].reduce((s, i) => s + i.jumlah, 0);
const totalKewajiban = neracaKewajiban.reduce((s, i) => s + i.jumlah, 0);
const totalEkuitas = neracaEkuitas.reduce((s, i) => s + i.jumlah, 0);

const totalAsetPrev = [...neracaAktivaLancarPrev, ...neracaAktivaTetapPrev].reduce((s, i) => s + i.jumlah, 0);
const totalKewajibanPrev = neracaKewajibanPrev.reduce((s, i) => s + i.jumlah, 0);
const totalEkuitasPrev = neracaEkuitasPrev.reduce((s, i) => s + i.jumlah, 0);
