"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, asetTetapList, type AsetTetapItem } from "@/lib/keuanganData";
import { Plus, X, Package, Search, Archive } from "lucide-react";
import DatePicker from "@/components/DatePicker";

const kategoriOptions = ["Tanah", "Bangunan", "Kendaraan", "Peralatan", "Mesin"];

export default function AsetTetapPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [assets, setAssets] = useState<AsetTetapItem[]>(asetTetapList);
  const [form, setForm] = useState({
    nama: "", kategori: "Kendaraan", tanggalBeli: "", nilaiPerolehan: "", umurEkonomis: "", metodePenyusutan: "Garis Lurus" as "Garis Lurus" | "Saldo Menurun",
  });

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (statusFilter !== "Semua" && a.status !== statusFilter) return false;
      if (kategoriFilter !== "Semua" && a.kategori !== kategoriFilter) return false;
      if (search && !a.nama.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [assets, search, kategoriFilter, statusFilter]);

  const totalPerolehan = filtered.reduce((s, a) => s + a.nilaiPerolehan, 0);
  const totalPenyusutan = filtered.reduce((s, a) => s + a.akumulasiPenyusutan, 0);
  const totalNilaiBuku = filtered.reduce((s, a) => s + a.nilaiBuku, 0);

  const addAsset = () => {
    if (!form.nama || !form.nilaiPerolehan) return;
    const np = Number(form.nilaiPerolehan.replace(/\D/g, "")) || 0;
    const umur = Number(form.umurEkonomis) || 0;
    const penyusutanBulanan = umur > 0 ? Math.floor(np / umur) : 0;
    const newAsset: AsetTetapItem = {
      id: `AST-${String(assets.length + 1).padStart(3, "0")}`,
      nama: form.nama,
      kategori: form.kategori,
      tanggalBeli: form.tanggalBeli,
      nilaiPerolehan: np,
      umurEkonomis: umur,
      metodePenyusutan: form.metodePenyusutan,
      penyusutanBulanan,
      akumulasiPenyusutan: 0,
      nilaiBuku: np,
      kodeAkun: "",
      kodeAkumulasi: "",
      kodeBeban: "",
      status: "Aktif",
    };
    setAssets((prev) => [...prev, newAsset]);
    setModalOpen(false);
    setForm({ nama: "", kategori: "Kendaraan", tanggalBeli: "", nilaiPerolehan: "", umurEkonomis: "", metodePenyusutan: "Garis Lurus" });
  };

  return (
    <SidebarLayout title="Aset Tetap" subtitle="Fixed Asset Management & Depreciation" action={
      <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition active:scale-95">
        <Plus className="w-4 h-4" /> Tambah Aset
      </button>
    }>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Nilai Perolehan</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{fmt(totalPerolehan)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Akumulasi Penyusutan</div>
          <div className="text-xl font-bold text-amber-700 mt-1">{fmt(totalPenyusutan)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Nilai Buku Bersih</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{fmt(totalNilaiBuku)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari Aset</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Nama atau ID aset..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]">
              <option value="Semua">Semua</option>
              {kategoriOptions.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]">
              <option value="Semua">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Dijual">Dijual</option>
              <option value="Dihapuskan">Dihapuskan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nama Aset</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Tanggal Beli</th>
                <th className="px-4 py-3 font-medium text-right">Nilai Perolehan</th>
                <th className="px-4 py-3 font-medium text-right">Penyusutan/Bln</th>
                <th className="px-4 py-3 font-medium text-right">Akumulasi</th>
                <th className="px-4 py-3 font-medium text-right">Nilai Buku</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{a.nama}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{a.kategori}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{a.tanggalBeli}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(a.nilaiPerolehan)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{a.penyusutanBulanan ? fmt(a.penyusutanBulanan) : "—"}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-amber-600">{fmt(a.akumulasiPenyusutan)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-emerald-700">{fmt(a.nilaiBuku)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      a.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      a.status === "Dijual" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>{a.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">Tidak ada data aset</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Aset */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Tambah Aset Tetap</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Aset</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Mobil Operasional" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {kategoriOptions.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Beli</label>
                  <DatePicker value={form.tanggalBeli} onChange={(val) => setForm({ ...form, tanggalBeli: val })} className="w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nilai Perolehan</label>
                  <input type="text" value={form.nilaiPerolehan} onChange={(e) => setForm({ ...form, nilaiPerolehan: e.target.value })} placeholder="Rp 0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Umur Ekonomis (bulan)</label>
                  <input type="number" value={form.umurEkonomis} onChange={(e) => setForm({ ...form, umurEkonomis: e.target.value })} placeholder="0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Metode Penyusutan</label>
                <select value={form.metodePenyusutan} onChange={(e) => setForm({ ...form, metodePenyusutan: e.target.value as any })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Garis Lurus">Garis Lurus (Straight Line)</option>
                  <option value="Saldo Menurun">Saldo Menurun (Declining Balance)</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={addAsset} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
