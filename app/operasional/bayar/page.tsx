"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Banknote, CheckCircle, AlertTriangle, Clock, ArrowLeft } from "lucide-react";
import { BiayaItem, loadBiayaItems, saveBiayaItems, fmt, formatTanggalID } from "@/lib/biayaData";

const stepsNav = [
  { id: "pengajuan", label: "1. Pengajuan Biaya", href: "/operasional/pengajuan" },
  { id: "bayar", label: "2. Listing Bayar", href: "/operasional/bayar" },
  { id: "laporan", label: "3. Laporan", href: "/operasional/laporan" },
];
const ACTIVE_STEP_INDEX = 1;

export default function BayarOperasionalPage() {
  const [items, setItems] = useState<BiayaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean; itemId: string;
  } | null>(null);

  useEffect(() => {
    const data = loadBiayaItems();
    setItems(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBiayaItems(items);
  }, [items, loaded]);

  // Hanya item yang disetujui yang masuk ke listing bayar
  const bayarItems = items.filter((i) => i.status === "Disetujui");

  const openConfirm = (itemId: string) => setConfirm({ open: true, itemId });
  const closeConfirm = () => setConfirm(null);

  const handlePay = () => {
    if (!confirm) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === confirm.itemId ? { ...item, paid: true } : item
      )
    );
    closeConfirm();
  };

  const totalMenunggu = bayarItems.filter((i) => !i.paid).reduce((s, i) => s + i.jumlah, 0);
  const totalDibayar = bayarItems.filter((i) => i.paid).reduce((s, i) => s + i.jumlah, 0);

  return (
    <SidebarLayout
      title="Listing Pembayaran Biaya"
      subtitle="Daftar biaya operasional yang telah disetujui dan siap dibayarkan."
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {stepsNav.map((step, i) => (
          <Link
            key={step.id}
            href={step.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              i === ACTIVE_STEP_INDEX
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {step.label}
          </Link>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Total Menunggu</div>
          <div className="text-lg font-bold text-amber-700">{fmt(totalMenunggu)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Total Dibayar</div>
          <div className="text-lg font-bold text-emerald-700">{fmt(totalDibayar)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Jumlah Item</div>
          <div className="text-lg font-bold text-slate-800">{bayarItems.length}</div>
        </div>
      </div>

      {/* Back link */}
      <div className="mb-4">
        <Link href="/operasional/pengajuan" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Pengajuan Biaya
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Daftar Pembayaran</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">No Pengajuan</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Deskripsi</th>
                <th className="px-6 py-3">Jumlah</th>
                <th className="px-6 py-3">Status Bayar</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bayarItems.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">Tidak ada biaya yang siap dibayar. Pastikan pengajuan sudah disetujui.</td></tr>
              )}
              {bayarItems.map((item) => {
                const statusClass = item.paid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200";
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-mono text-xs text-slate-700">{item.no}</td>
                    <td className="px-6 py-3 text-slate-700">{formatTanggalID(item.tanggal)}</td>
                    <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{item.kategori}</span></td>
                    <td className="px-6 py-3 text-slate-700 max-w-xs truncate">{item.deskripsi}</td>
                    <td className="px-6 py-3 font-medium text-slate-800">{fmt(item.jumlah)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusClass}`}>
                        {item.paid && <CheckCircle className="w-3 h-3 mr-1" />}
                        {item.paid ? "Dibayar" : "Menunggu"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {!item.paid && (
                        <button
                          onClick={() => openConfirm(item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          Bayar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm?.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-sm">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-blue-50 text-blue-600">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-slate-500">
                Bayar {items.find(i => i.id === confirm.itemId)?.no} sebesar {fmt(items.find(i => i.id === confirm.itemId)?.jumlah || 0)}?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 px-6 pb-5">
              <button onClick={closeConfirm} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={handlePay} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Ya, Bayar</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
