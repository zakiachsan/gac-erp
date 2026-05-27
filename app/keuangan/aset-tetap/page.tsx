"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { fmt, asetTetapList, type AsetTetapItem } from "@/lib/keuanganData";
import { Plus, X, Package, Search, Archive, Calendar, TrendingDown, Eye } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

const kategoriOptions = ["Tanah", "Bangunan", "Kendaraan", "Peralatan", "Mesin"];

interface DepScheduleItem {
  bulanKe: number;
  periode: string;
  penyusutan: number;
  akumulasi: number;
  nilaiBuku: number;
}

function generateSchedule(asset: AsetTetapItem): DepScheduleItem[] {
  if (!asset.umurEkonomis || asset.umurEkonomis === 0) return [];
  const schedule: DepScheduleItem[] = [];
  const startDate = new Date(asset.tanggalBeli + "T00:00:00");
  let akumulasi = 0;
  let nilaiBuku = asset.nilaiPerolehan;

  for (let i = 1; i <= asset.umurEkonomis; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    const periode = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    const penyusutan = asset.penyusutanBulanan;
    akumulasi += penyusutan;
    nilaiBuku = Math.max(0, asset.nilaiPerolehan - akumulasi);
    schedule.push({ bulanKe: i, periode, penyusutan, akumulasi, nilaiBuku });
  }
  return schedule;
}

export default function AsetTetapPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; asset: AsetTetapItem | null }>({
    open: false,
    asset: null,
  });
  const [assets, setAssets] = useState<AsetTetapItem[]>(asetTetapList);
  const [form, setForm] = useState({
    nama: "",
    kategori: "Kendaraan",
    tanggalBeli: "",
    nilaiPerolehan: "",
    umurEkonomis: "",
    metodePenyusutan: "Garis Lurus" as "Garis Lurus" | "Saldo Menurun",
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

  const handleExportPDF = () => {
    const headers = ["ID", "Nama", "Kategori", "Tanggal Beli", "Nilai Perolehan", "Penyusutan/Bln", "Akumulasi", "Nilai Buku", "Status"];
    const rows = filtered.map((a) => [
      a.id,
      a.nama,
      a.kategori,
      a.tanggalBeli,
      a.nilaiPerolehan,
      a.penyusutanBulanan,
      a.akumulasiPenyusutan,
      a.nilaiBuku,
      a.status,
    ]);
    exportToPDF("Aset Tetap", headers, rows, `aset-tetap.pdf`);
  };

  const handleExportExcel = () => {
    const headers = ["ID", "Nama", "Kategori", "Tanggal Beli", "Nilai Perolehan", "Penyusutan/Bln", "Akumulasi", "Nilai Buku", "Status"];
    const rows = filtered.map((a) => [
      a.id,
      a.nama,
      a.kategori,
      a.tanggalBeli,
      a.nilaiPerolehan,
      a.penyusutanBulanan,
      a.akumulasiPenyusutan,
      a.nilaiBuku,
      a.status,
    ]);
    exportToExcel("Aset Tetap", headers, rows, `aset-tetap.xlsx`);
  };

  return (
    <SidebarLayout
      title="Aset Tetap"
      subtitle="Fixed Asset Management & Depreciation Schedule"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-lg transition"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg transition"
          >
            Export Excel
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Aset
          </button>
        </div>
      }
    >
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
              <input
                type="text"
                placeholder="Nama atau ID aset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]"
            >
              <option value="Semua">Semua</option>
              {kategoriOptions.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]"
            >
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
                <th className="px-4 py-3 font-medium text-right">Akumulasi</th>
                <th className="px-4 py-3 font-medium text-right">Nilai Buku</th>
                <th className="px-4 py-3 font-medium w-32">Chart</th>
                <th className="px-4 py-3 font-medium text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const pctSisa = a.nilaiPerolehan > 0 ? (a.nilaiBuku / a.nilaiPerolehan) * 100 : 0;
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{a.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.nama}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{a.kategori}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.tanggalBeli}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-700">{fmt(a.nilaiPerolehan)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-amber-600">{fmt(a.akumulasiPenyusutan)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-emerald-700">{fmt(a.nilaiBuku)}</td>
                    <td className="px-4 py-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctSisa}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{pctSisa.toFixed(0)}% tersisa</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setScheduleModal({ open: true, asset: a })}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition"
                      >
                        <Calendar className="w-3 h-3" /> Jadwal
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-slate-400">
                    Tidak ada data aset
                  </td>
                </tr>
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
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Aset</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Mobil Operasional"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {kategoriOptions.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
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
                  <input
                    type="text"
                    value={form.nilaiPerolehan}
                    onChange={(e) => setForm({ ...form, nilaiPerolehan: e.target.value })}
                    placeholder="Rp 0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Umur Ekonomis (bulan)</label>
                  <input
                    type="number"
                    value={form.umurEkonomis}
                    onChange={(e) => setForm({ ...form, umurEkonomis: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Metode Penyusutan</label>
                <select
                  value={form.metodePenyusutan}
                  onChange={(e) => setForm({ ...form, metodePenyusutan: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Garis Lurus">Garis Lurus (Straight Line)</option>
                  <option value="Saldo Menurun">Saldo Menurun (Declining Balance)</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={addAsset}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal.open && scheduleModal.asset && (
        <ScheduleModal asset={scheduleModal.asset} onClose={() => setScheduleModal({ open: false, asset: null })} />
      )}
    </SidebarLayout>
  );
}

/* ───────────── Schedule Modal ───────────── */
function ScheduleModal({ asset, onClose }: { asset: AsetTetapItem; onClose: () => void }) {
  const schedule = useMemo(() => generateSchedule(asset), [asset]);

  const handleExportPDF = () => {
    const headers = ["Bulan Ke", "Periode", "Penyusutan", "Akumulasi", "Nilai Buku"];
    const rows = schedule.map((s) => [s.bulanKe, s.periode, s.penyusutan, s.akumulasi, s.nilaiBuku]);
    exportToPDF(`Jadwal Penyusutan - ${asset.nama}`, headers, rows, `penyusutan-${asset.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Jadwal Penyusutan</h3>
            <p className="text-xs text-slate-500">
              {asset.nama} — {fmt(asset.nilaiPerolehan)} / {asset.umurEkonomis} bulan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition"
            >
              Export PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Mini chart */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-end gap-4 h-24">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-slate-500">Nilai Perolehan</div>
                <div className="w-full bg-blue-200 rounded-t-lg flex items-end justify-center" style={{ height: "80%" }}>
                  <div className="text-[10px] font-bold text-blue-800 pb-1">{fmt(asset.nilaiPerolehan)}</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-slate-500">Akumulasi</div>
                <div className="w-full bg-amber-200 rounded-t-lg flex items-end justify-center" style={{ height: `${(asset.akumulasiPenyusutan / asset.nilaiPerolehan) * 80}%` }}>
                  <div className="text-[10px] font-bold text-amber-800 pb-1">{fmt(asset.akumulasiPenyusutan)}</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-slate-500">Nilai Buku</div>
                <div className="w-full bg-emerald-200 rounded-t-lg flex items-end justify-center" style={{ height: `${(asset.nilaiBuku / asset.nilaiPerolehan) * 80}%` }}>
                  <div className="text-[10px] font-bold text-emerald-800 pb-1">{fmt(asset.nilaiBuku)}</div>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-3 py-2 font-medium">Bulan Ke</th>
                <th className="px-3 py-2 font-medium">Periode</th>
                <th className="px-3 py-2 font-medium text-right">Penyusutan</th>
                <th className="px-3 py-2 font-medium text-right">Akumulasi</th>
                <th className="px-3 py-2 font-medium text-right">Nilai Buku</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((s) => (
                <tr key={s.bulanKe} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2 text-xs text-slate-600">{s.bulanKe}</td>
                  <td className="px-3 py-2 text-xs text-slate-700">{s.periode}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-slate-700">{fmt(s.penyusutan)}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-amber-600">{fmt(s.akumulasi)}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs font-semibold text-emerald-700">{fmt(s.nilaiBuku)}</td>
                </tr>
              ))}
              {schedule.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                    Tidak ada jadwal penyusutan (aset tanpa umur ekonomis)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
