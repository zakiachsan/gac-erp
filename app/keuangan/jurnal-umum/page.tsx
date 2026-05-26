"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import { fmt, jurnalUmumList, type JurnalUmumItem } from "@/lib/keuanganData";
import { Plus, X, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import DatePicker from "@/components/DatePicker";

export default function JurnalUmumPage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [journals, setJournals] = useState<JurnalUmumItem[]>(jurnalUmumList);
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    noBukti: "",
    keterangan: "",
    detail: [{ kodeAkun: "", namaAkun: "", debit: "", kredit: "" }],
  });

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      if (j.tanggal < period.from || j.tanggal > period.to) return false;
      if (search && !j.noBukti.toLowerCase().includes(search.toLowerCase()) && !j.keterangan.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [journals, period, search]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalDebit = (detail: JurnalUmumItem["detail"]) => detail.reduce((s, d) => s + d.debit, 0);
  const totalKredit = (detail: JurnalUmumItem["detail"]) => detail.reduce((s, d) => s + d.kredit, 0);

  const addRow = () => {
    setForm((prev) => ({ ...prev, detail: [...prev.detail, { kodeAkun: "", namaAkun: "", debit: "", kredit: "" }] }));
  };

  const removeRow = (idx: number) => {
    setForm((prev) => ({ ...prev, detail: prev.detail.filter((_, i) => i !== idx) }));
  };

  const updateRow = (idx: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      detail: prev.detail.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
    }));
  };

  const saveJournal = () => {
    const totalD = form.detail.reduce((s, d) => s + (Number(d.debit.replace(/\D/g, "")) || 0), 0);
    const totalK = form.detail.reduce((s, d) => s + (Number(d.kredit.replace(/\D/g, "")) || 0), 0);
    if (totalD !== totalK) {
      alert("Total Debit harus sama dengan Total Kredit!");
      return;
    }
    if (!form.noBukti || !form.keterangan) return;

    const newJournal: JurnalUmumItem = {
      id: `JU-${String(journals.length + 1).padStart(3, "0")}`,
      tanggal: form.tanggal,
      noBukti: form.noBukti,
      keterangan: form.keterangan,
      detail: form.detail.map((d) => ({
        kodeAkun: d.kodeAkun,
        namaAkun: d.namaAkun,
        debit: Number(d.debit.replace(/\D/g, "")) || 0,
        kredit: Number(d.kredit.replace(/\D/g, "")) || 0,
      })),
    };
    setJournals((prev) => [...prev, newJournal]);
    setModalOpen(false);
    setForm({ tanggal: new Date().toISOString().split("T")[0], noBukti: "", keterangan: "", detail: [{ kodeAkun: "", namaAkun: "", debit: "", kredit: "" }] });
  };

  const subtitle = `Jurnal umum — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  return (
    <SidebarLayout title="Jurnal Umum" subtitle={subtitle} action={
      <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition active:scale-95">
        <Plus className="w-4 h-4" /> Buat Jurnal
      </button>
    }>
      <FinanceFilterBar
        onChange={setPeriod}
        onExport={() => alert("Export Jurnal Umum")}
        extraFilters={
          <div className="flex items-center gap-3">
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari no bukti / keterangan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-medium w-10"></th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">No Bukti</th>
                <th className="px-6 py-3 font-medium">Keterangan</th>
                <th className="px-6 py-3 font-medium text-right">Total Debit</th>
                <th className="px-6 py-3 font-medium text-right">Total Kredit</th>
                <th className="px-6 py-3 font-medium text-center">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => {
                const d = totalDebit(j.detail);
                const k = totalKredit(j.detail);
                const isBalanced = d === k;
                const isOpen = expanded[j.id];
                return (
                  <>
                    <tr key={j.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => toggleExpand(j.id)}>
                      <td className="px-6 py-3">{isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}</td>
                      <td className="px-6 py-3 text-slate-700 text-xs">{j.tanggal}</td>
                      <td className="px-6 py-3 font-mono text-xs font-semibold text-blue-700">{j.noBukti}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">{j.keterangan}</td>
                      <td className="px-6 py-3 text-right font-mono text-xs text-slate-700">{fmt(d)}</td>
                      <td className="px-6 py-3 text-right font-mono text-xs text-slate-700">{fmt(k)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${isBalanced ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                          {isBalanced ? "Balance" : "Unbalance"}
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="px-6 py-3 bg-slate-50">
                          <table className="w-full text-xs">
                            <thead className="text-left text-slate-500 border-b border-slate-200">
                              <tr><th className="pb-2 font-medium">Kode Akun</th><th className="pb-2 font-medium">Nama Akun</th><th className="pb-2 font-medium text-right">Debit</th><th className="pb-2 font-medium text-right">Kredit</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {j.detail.map((det, i) => (
                                <tr key={i}><td className="py-2 font-mono text-slate-600">{det.kodeAkun}</td><td className="py-2 text-slate-700">{det.namaAkun}</td><td className="py-2 text-right font-mono text-slate-700">{det.debit ? fmt(det.debit) : "—"}</td><td className="py-2 text-right font-mono text-slate-700">{det.kredit ? fmt(det.kredit) : "—"}</td></tr>
                              ))}
                              <tr className="font-bold border-t-2 border-slate-200">
                                <td colSpan={2} className="py-2 text-slate-800">Total</td>
                                <td className="py-2 text-right font-mono text-slate-900">{fmt(d)}</td>
                                <td className="py-2 text-right font-mono text-slate-900">{fmt(k)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-400">Tidak ada data jurnal</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Jurnal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Buat Jurnal Umum Baru</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal</label>
                  <DatePicker value={form.tanggal} onChange={(val) => setForm({ ...form, tanggal: val })} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">No Bukti</label>
                  <input type="text" value={form.noBukti} onChange={(e) => setForm({ ...form, noBukti: e.target.value })} placeholder="JU/2026/05/xxx" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keterangan</label>
                  <input type="text" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Keterangan transaksi" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Detail Jurnal</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr><th className="px-3 py-2 font-medium text-left">Kode Akun</th><th className="px-3 py-2 font-medium text-left">Nama Akun</th><th className="px-3 py-2 font-medium text-right">Debit</th><th className="px-3 py-2 font-medium text-right">Kredit</th><th className="px-3 py-2 w-10"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {form.detail.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-2"><input type="text" value={row.kodeAkun} onChange={(e) => updateRow(idx, "kodeAkun", e.target.value)} placeholder="Kode" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" /></td>
                          <td className="px-2 py-2"><input type="text" value={row.namaAkun} onChange={(e) => updateRow(idx, "namaAkun", e.target.value)} placeholder="Nama" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs" /></td>
                          <td className="px-2 py-2"><input type="text" value={row.debit} onChange={(e) => updateRow(idx, "debit", e.target.value)} placeholder="0" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-right" /></td>
                          <td className="px-2 py-2"><input type="text" value={row.kredit} onChange={(e) => updateRow(idx, "kredit", e.target.value)} placeholder="0" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-right" /></td>
                          <td className="px-2 py-2 text-center">
                            {form.detail.length > 1 && (
                              <button onClick={() => removeRow(idx)} className="text-slate-400 hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addRow} className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">+ Tambah Baris</button>

                <div className="flex justify-between items-center bg-slate-50 rounded-lg p-3 mt-3">
                  <div className="text-xs text-slate-500">Total Debit: <span className="font-mono font-semibold text-slate-800">{fmt(form.detail.reduce((s, d) => s + (Number(d.debit.replace(/\D/g, "")) || 0), 0))}</span></div>
                  <div className="text-xs text-slate-500">Total Kredit: <span className="font-mono font-semibold text-slate-800">{fmt(form.detail.reduce((s, d) => s + (Number(d.kredit.replace(/\D/g, "")) || 0), 0))}</span></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={saveJournal} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">Simpan Jurnal</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
