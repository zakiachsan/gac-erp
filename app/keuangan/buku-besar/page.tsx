"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, bukuBesarList, coaList, type BukuBesarItem } from "@/lib/keuanganData";
import { BookOpen, Search, Filter } from "lucide-react";

export default function BukuBesarPage() {
  const [kodeAkun, setKodeAkun] = useState("Semua");
  const [periodFrom, setPeriodFrom] = useState("2026-05-01");
  const [periodTo, setPeriodTo] = useState("2026-05-31");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let data = bukuBesarList.filter((b) => {
      if (b.tanggal < periodFrom || b.tanggal > periodTo) return false;
      if (kodeAkun !== "Semua" && b.kodeAkun !== kodeAkun) return false;
      if (search && !b.keterangan.toLowerCase().includes(search.toLowerCase()) && !b.noBukti.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    return data;
  }, [kodeAkun, periodFrom, periodTo, search]);

  const grouped = useMemo(() => {
    const map: Record<string, BukuBesarItem[]> = {};
    filtered.forEach((b) => {
      if (!map[b.kodeAkun]) map[b.kodeAkun] = [];
      map[b.kodeAkun].push(b);
    });
    return map;
  }, [filtered]);

  const selectedAccount = coaList.find((a) => a.kode === kodeAkun);

  return (
    <SidebarLayout title="Buku Besar" subtitle="General Ledger — semua transaksi per akun">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Pilih Akun</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={kodeAkun} onChange={(e) => setKodeAkun(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Semua">Semua Akun</option>
                {coaList.map((a) => (
                  <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
            <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
            <input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="No bukti / keterangan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={() => alert("Export Buku Besar")} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition">
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      {kodeAkun !== "Semua" && selectedAccount ? (
        <SingleAccountView account={selectedAccount} entries={grouped[kodeAkun] || []} />
      ) : (
        <AllAccountsView grouped={grouped} />
      )}
    </SidebarLayout>
  );
}

function SingleAccountView({ account, entries }: { account: typeof coaList[0]; entries: BukuBesarItem[] }) {
  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalKredit = entries.reduce((s, e) => s + e.kredit, 0);
  const saldoAkhir = entries.length > 0 ? entries[entries.length - 1].saldo : account.saldoAwal;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{account.kode} — {account.nama}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kategori: {account.kategori} | Tipe: {account.tipe}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Saldo Awal</div>
            <div className="text-lg font-bold text-slate-800">{fmt(account.saldoAwal)}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-blue-500 uppercase tracking-wide font-semibold">Total Debit</div>
            <div className="text-lg font-bold text-blue-700">{fmt(totalDebit)}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-emerald-500 uppercase tracking-wide font-semibold">Total Kredit</div>
            <div className="text-lg font-bold text-emerald-700">{fmt(totalKredit)}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Saldo Akhir</div>
            <div className="text-lg font-bold text-slate-800">{fmt(saldoAkhir)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">No Bukti</th>
                <th className="px-6 py-3 font-medium">Keterangan</th>
                <th className="px-6 py-3 font-medium text-right">Debit</th>
                <th className="px-6 py-3 font-medium text-right">Kredit</th>
                <th className="px-6 py-3 font-medium text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50/50">
                <td className="px-6 py-3 text-xs text-slate-400" colSpan={5}>Saldo Awal</td>
                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">{fmt(account.saldoAwal)}</td>
              </tr>
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 text-slate-700 text-xs">{e.tanggal}</td>
                  <td className="px-6 py-3 font-mono text-xs text-blue-700">{e.noBukti}</td>
                  <td className="px-6 py-3 text-slate-800">{e.keterangan}</td>
                  <td className="px-6 py-3 text-right font-mono text-xs text-blue-600">{e.debit ? fmt(e.debit) : "—"}</td>
                  <td className="px-6 py-3 text-right font-mono text-xs text-emerald-600">{e.kredit ? fmt(e.kredit) : "—"}</td>
                  <td className="px-6 py-3 text-right font-mono font-semibold text-slate-800">{fmt(e.saldo)}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-400">Tidak ada transaksi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AllAccountsView({ grouped }: { grouped: Record<string, BukuBesarItem[]> }) {
  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([kode, entries]) => {
        const account = coaList.find((a) => a.kode === kode);
        if (!account) return null;
        const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
        const totalKredit = entries.reduce((s, e) => s + e.kredit, 0);
        const saldoAkhir = entries.length > 0 ? entries[entries.length - 1].saldo : account.saldoAwal;
        return (
          <div key={kode} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{kode} — {account.nama}</h3>
                <p className="text-xs text-slate-500">{account.kategori}</p>
              </div>
              <div className="flex gap-6 text-xs">
                <div className="text-right"><div className="text-slate-400">Debit</div><div className="font-mono font-semibold text-blue-700">{fmt(totalDebit)}</div></div>
                <div className="text-right"><div className="text-slate-400">Kredit</div><div className="font-mono font-semibold text-emerald-700">{fmt(totalKredit)}</div></div>
                <div className="text-right"><div className="text-slate-400">Saldo</div><div className="font-mono font-semibold text-slate-900">{fmt(saldoAkhir)}</div></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left text-slate-500 border-b border-slate-200">
                  <tr><th className="px-6 py-2 font-medium">Tanggal</th><th className="px-6 py-2 font-medium">No Bukti</th><th className="px-6 py-2 font-medium">Keterangan</th><th className="px-6 py-2 font-medium text-right">Debit</th><th className="px-6 py-2 font-medium text-right">Kredit</th><th className="px-6 py-2 font-medium text-right">Saldo</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-2 text-slate-600">{e.tanggal}</td>
                      <td className="px-6 py-2 font-mono text-blue-600">{e.noBukti}</td>
                      <td className="px-6 py-2 text-slate-700">{e.keterangan}</td>
                      <td className="px-6 py-2 text-right font-mono text-blue-600">{e.debit ? fmt(e.debit) : "—"}</td>
                      <td className="px-6 py-2 text-right font-mono text-emerald-600">{e.kredit ? fmt(e.kredit) : "—"}</td>
                      <td className="px-6 py-2 text-right font-mono font-medium text-slate-800">{fmt(e.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {Object.keys(grouped).length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-sm text-slate-400">Tidak ada transaksi untuk periode ini</div>
      )}
    </div>
  );
}
