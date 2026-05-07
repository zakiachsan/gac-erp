"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, invoiceList } from "@/lib/keuanganData";

const statusBadge = (status: string) => {
  switch (status) {
    case "Dibayar": case "Lunas": case "Normal": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Terbit": case "Dikirim": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Draft": return "bg-slate-50 text-slate-600 border-slate-200";
    case "Belum Lunas": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Dibatalkan": return "bg-rose-50 text-rose-700 border-rose-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function InvoicePage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [tipeFilter, setTipeFilter] = useState("Semua");
  const [customerSearch, setCustomerSearch] = useState("");

  const subtitle = `Daftar invoice & kwitansi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const filtered = useMemo(() => {
    return invoiceList.filter((inv) => {
      if (inv.tanggal < period.from || inv.tanggal > period.to) return false;
      if (statusFilter !== "Semua" && inv.status !== statusFilter) return false;
      if (tipeFilter !== "Semua" && inv.tipe !== tipeFilter) return false;
      if (customerSearch && !inv.customer.toLowerCase().includes(customerSearch.toLowerCase())) return false;
      return true;
    });
  }, [period, statusFilter, tipeFilter, customerSearch]);

  const totalInvoice = filtered.filter((i) => i.tipe === "Invoice").reduce((s, i) => s + i.total, 0);
  const totalKwitansi = filtered.filter((i) => i.tipe === "Kwitansi").reduce((s, i) => s + i.total, 0);
  const totalBelumBayar = filtered.filter((i) => i.status !== "Dibayar" && i.status !== "Dibatalkan").reduce((s, i) => s + i.total, 0);

  return (
    <SidebarLayout title="Invoice & Kwitansi" subtitle={subtitle}>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Invoice")}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Draft</option>
                <option>Terbit</option>
                <option>Dibayar</option>
                <option>Dibatalkan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipe</label>
              <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option>Semua</option>
                <option>Invoice</option>
                <option>Kwitansi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Customer</label>
              <input type="text" placeholder="Cari customer..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        }
      />
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Invoice</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{fmt(totalInvoice)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Kwitansi</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{fmt(totalKwitansi)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Belum Dibayar</div>
            <div className="text-xl font-bold text-amber-600 mt-1">{fmt(totalBelumBayar)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Daftar Invoice & Kwitansi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-medium">No</th>
                  <th className="pb-3 font-medium">Tipe</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Jatuh Tempo</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono text-xs text-slate-600">{inv.no}</td>
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${inv.tipe === "Invoice" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{inv.tipe}</span></td>
                    <td className="py-3 text-slate-700 text-xs">{inv.tanggal}</td>
                    <td className="py-3 text-slate-700 text-xs">{inv.jatuhTempo}</td>
                    <td className="py-3 font-medium text-slate-800">{inv.customer}</td>
                    <td className="py-3 text-slate-600 text-xs max-w-xs truncate">{inv.project}</td>
                    <td className="py-3 text-right font-mono font-medium">{fmt(inv.total)}</td>
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(inv.status)}`}>{inv.status}</span></td>
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
    </SidebarLayout>
  );
}
