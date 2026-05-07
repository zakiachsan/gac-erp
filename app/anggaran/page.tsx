"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, X, Trash2 } from "lucide-react";

interface AnggaranItem {
  id: string;
  kategori: string;
  kategoriColor: string;
  item: string;
  anggaran: string;
  realisasi: string;
  selisih: string;
  selisihColor: string;
}

interface Project {
  id: string;
  name: string;
}

const projectList: Project[] = [
  { id: "PRJ-001", name: "Pengadaan & Pemasangan AC Kantor Pusat" },
  { id: "PRJ-002", name: "Pemasangan Pompa Industri" },
  { id: "PRJ-003", name: "Renovasi Gudang Medan" },
  { id: "PRJ-004", name: "Pengadaan IT Equipment" },
];

const initialItems: AnggaranItem[] = [
  { id: "A-001", kategori: "Material & Jasa", kategoriColor: "bg-blue-50 text-blue-700", item: "AC Split 2 PK", anggaran: "Rp 45.000.000", realisasi: "Rp 42.000.000", selisih: "+ Rp 3jt", selisihColor: "text-emerald-600" },
  { id: "A-002", kategori: "Material & Jasa", kategoriColor: "bg-blue-50 text-blue-700", item: "Pipa & Instalasi", anggaran: "Rp 15.000.000", realisasi: "Rp 12.000.000", selisih: "+ Rp 3jt", selisihColor: "text-emerald-600" },
  { id: "A-003", kategori: "Biaya Operasional", kategoriColor: "bg-amber-50 text-amber-700", item: "Transportasi", anggaran: "Rp 5.000.000", realisasi: "Rp 3.000.000", selisih: "+ Rp 2jt", selisihColor: "text-emerald-600" },
  { id: "A-004", kategori: "Pajak", kategoriColor: "bg-emerald-50 text-emerald-700", item: "PPN 11%", anggaran: "Rp 100.000.000", realisasi: "Rp 100.000.000", selisih: "Rp 0", selisihColor: "text-slate-500" },
];

const kategoriOptions = [
  { label: "Material & Jasa", color: "bg-blue-50 text-blue-700" },
  { label: "Biaya Operasional", color: "bg-amber-50 text-amber-700" },
  { label: "Pajak", color: "bg-emerald-50 text-emerald-700" },
];

const getKategoriColor = (kat: string) => kategoriOptions.find((k) => k.label === kat)?.color || "bg-slate-50 text-slate-700";

export default function AnggaranPage() {
  const [items, setItems] = useState<AnggaranItem[]>(initialItems);
  const [selectedProject, setSelectedProject] = useState(projectList[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [formProject, setFormProject] = useState(projectList[0].id);
  const [formKategori, setFormKategori] = useState("Material & Jasa");
  const [formItem, setFormItem] = useState("");
  const [formAnggaran, setFormAnggaran] = useState("");
  const [formRealisasi, setFormRealisasi] = useState("");

  const selectedProjectName = projectList.find((p) => p.id === selectedProject)?.name || "";

  const addItem = () => {
    if (!formItem || !formAnggaran) return;
    const anggaranNum = parseInt(formAnggaran.replace(/\D/g, "")) || 0;
    const realisasiNum = parseInt(formRealisasi.replace(/\D/g, "")) || 0;
    const selisih = anggaranNum - realisasiNum;
    const selisihText = selisih >= 0 ? `+ Rp ${(selisih / 1000000).toFixed(0)}jt` : `- Rp ${(Math.abs(selisih) / 1000000).toFixed(0)}jt`;
    const selisihColor = selisih > 0 ? "text-emerald-600" : selisih === 0 ? "text-slate-500" : "text-rose-600";

    const newItem: AnggaranItem = {
      id: `A-${String(items.length + 1).padStart(3, "0")}`,
      kategori: formKategori,
      kategoriColor: getKategoriColor(formKategori),
      item: formItem,
      anggaran: formAnggaran.startsWith("Rp") ? formAnggaran : `Rp ${formAnggaran}`,
      realisasi: formRealisasi ? (formRealisasi.startsWith("Rp") ? formRealisasi : `Rp ${formRealisasi}`) : "Rp 0",
      selisih: selisihText,
      selisihColor,
    };
    setItems((prev) => [...prev, newItem]);
    setModalOpen(false);
    setFormItem("");
    setFormAnggaran("");
    setFormRealisasi("");
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAnggaran = items.reduce((sum, i) => sum + (parseInt(i.anggaran.replace(/\D/g, "")) || 0), 0);
  const totalRealisasi = items.reduce((sum, i) => sum + (parseInt(i.realisasi.replace(/\D/g, "")) || 0), 0);
  const sisaBudget = totalAnggaran - totalRealisasi;

  const fmt = (n: number) => `Rp ${(n / 1000000).toFixed(0)}jt`;

  return (
    <SidebarLayout
      title="Manajemen Anggaran"
      subtitle={`${selectedProject} — ${selectedProjectName}`}
      action={
        <button
          onClick={() => { setFormProject(selectedProject); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Item
        </button>
      }
    >
      {/* Project Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-slate-500">Project:</span>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {projectList.map((p) => (
            <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Total Anggaran</div>
          <div className="text-2xl font-bold text-slate-900">{fmt(totalAnggaran)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Total Realisasi</div>
          <div className="text-2xl font-bold text-blue-600">{fmt(totalRealisasi)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Sisa Budget</div>
          <div className="text-2xl font-bold text-emerald-600">{fmt(sisaBudget)}</div>
        </div>
      </div>

      {/* Chart per Kategori */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Anggaran vs Realisasi per Kategori</h3>
        <div className="space-y-6 max-w-3xl">
          {[
            { label: "Material & Jasa", pct: 80, color: "bg-blue-500", anggaran: 600000000, realisasi: 480000000 },
            { label: "Biaya Operasional", pct: 60, color: "bg-amber-500", anggaran: 200000000, realisasi: 120000000 },
            { label: "Pajak", pct: 100, color: "bg-emerald-500", anggaran: 100000000, realisasi: 100000000 },
          ].map((cat) => (
            <div key={cat.label}>
              <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2"><span>{cat.label}</span><span className={`${cat.color.replace("bg-", "text-")}`}>{cat.pct}% tercapai</span></div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} /></div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5"><span>Anggaran: Rp {cat.anggaran.toLocaleString("id-ID")}</span><span>Realisasi: Rp {cat.realisasi.toLocaleString("id-ID")}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Detail Breakdown Anggaran</h3>
          <button
            onClick={() => { setFormProject(selectedProject); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="pb-3 font-medium">Kategori</th>
                <th className="pb-3 font-medium">Item</th>
                <th className="pb-3 font-medium text-right">Anggaran</th>
                <th className="pb-3 font-medium text-right">Realisasi</th>
                <th className="pb-3 font-medium text-right">Selisih</th>
                <th className="pb-3 font-medium text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50 transition">
                  <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.kategoriColor}`}>{row.kategori}</span></td>
                  <td className="py-3 font-medium text-slate-800">{row.item}</td>
                  <td className="py-3 text-right font-mono text-xs">{row.anggaran}</td>
                  <td className="py-3 text-right font-mono text-xs">{row.realisasi}</td>
                  <td className={`py-3 text-right font-semibold text-xs ${row.selisihColor}`}>{row.selisih}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteItem(i)}
                      className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-rose-500 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-slate-400">Belum ada data anggaran</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Tambah Item Anggaran</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project</label>
                <select
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projectList.map((p) => (
                    <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori</label>
                <select value={formKategori} onChange={(e) => setFormKategori(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {kategoriOptions.map((k) => <option key={k.label}>{k.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Item</label>
                <input type="text" value={formItem} onChange={(e) => setFormItem(e.target.value)} placeholder="Contoh: AC Split 2 PK" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nilai Anggaran</label>
                  <input type="text" value={formAnggaran} onChange={(e) => setFormAnggaran(e.target.value)} placeholder="Rp 0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Realisasi (Opsional)</label>
                  <input type="text" value={formRealisasi} onChange={(e) => setFormRealisasi(e.target.value)} placeholder="Rp 0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={addItem} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
