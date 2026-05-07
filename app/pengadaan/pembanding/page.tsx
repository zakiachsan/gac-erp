"use client";

import { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, CheckCircle, XCircle, Upload, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface ItemRow {
  nama: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
}

interface VendorItem {
  id: string;
  supplier: string;
  harga: string;
  fileName: string;
  fileSize: string;
  pilihan: "Dipilih" | "Alternatif";
  items: ItemRow[];
}

interface ProjectPembanding {
  id: string;
  nomor: string;
  projectId: string;
  nama: string;
  vendors: VendorItem[];
}

const satuanList = ["unit", "set", "pcs", "tabung", "sak", "batang", "lembar", "kaleng", "kg", "m", "m2", "m3", "ls", "hr", "bln", "thn", "orang", "lot", "batch", "roll", "buah", "pack", "box", "dus", "rim", "gln", "liter", "ton", "kwintal", "meter"];

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];

const ACTIVE_STEP_INDEX = 1;

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const ribuan = (n: number) => {
  if (n === 0) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const parseNum = (s: string) => parseInt(String(s).replace(/\D/g, "")) || 0;

const recalcVendor = (v: VendorItem): VendorItem => {
  const total = v.items.reduce((sum, it) => sum + it.qty * it.hargaSatuan, 0);
  return { ...v, harga: fmt(total) };
};

const initialProjects: ProjectPembanding[] = [
  {
    id: "PB-001",
    nomor: "Rev.014/RPHP.MRC-ME/TKN.ASYA/IX/2024",
    projectId: "PRJ-2026-0001",
    nama: "Pengadaan AC Kantor Pusat",
    vendors: [
      {
        id: "VND-001", supplier: "PT CoolTech", harga: "Rp 63.800.000", fileName: "Penawaran_CoolTech.pdf", fileSize: "1.2 MB", pilihan: "Dipilih",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
        ],
      },
      {
        id: "VND-002", supplier: "PT AirSolutions", harga: "Rp 68.650.000", fileName: "Penawaran_AirSolutions.pdf", fileSize: "980 KB", pilihan: "Alternatif",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4550000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3350000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 900000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 370000 },
        ],
      },
      {
        id: "VND-005", supplier: "CV Karya Mandiri", harga: "Rp 65.200.000", fileName: "Penawaran_KaryaMandiri.pdf", fileSize: "1.1 MB", pilihan: "Alternatif",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4350000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3200000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 875000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 307500 },
        ],
      },
    ],
  },
  {
    id: "PB-002",
    nomor: "Rev.015/RPHP.MRC-ME/TKN.BETA/X/2024",
    projectId: "PRJ-2026-0002",
    nama: "Pemasangan Pompa Industri",
    vendors: [
      {
        id: "VND-003", supplier: "PT Delta Jaya", harga: "Rp 32.500.000", fileName: "Penawaran_DeltaJaya.pdf", fileSize: "850 KB", pilihan: "Alternatif",
        items: [
          { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 14000000 },
          { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4500000 },
        ],
      },
      {
        id: "VND-004", supplier: "PT Maju Bersama", harga: "Rp 30.750.000", fileName: "Penawaran_MajuBersama.pdf", fileSize: "720 KB", pilihan: "Dipilih",
        items: [
          { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
          { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
        ],
      },
    ],
  },
  {
    id: "PB-003",
    nomor: "Rev.016/RPHP.MRC-ME/TKN.GAMA/XI/2024",
    projectId: "PRJ-2026-0003",
    nama: "Renovasi & Material Gudang",
    vendors: [
      {
        id: "VND-006", supplier: "PT Sejahtera Abadi", harga: "Rp 125.500.000", fileName: "Penawaran_Sejahtera.pdf", fileSize: "1.5 MB", pilihan: "Dipilih",
        items: [
          { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
          { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
          { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
          { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
          { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
        ],
      },
      {
        id: "VND-007", supplier: "PT Delta Jaya", harga: "Rp 132.000.000", fileName: "Penawaran_DeltaJaya_Gudang.pdf", fileSize: "1.3 MB", pilihan: "Alternatif",
        items: [
          { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 75000 },
          { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 98000 },
          { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 88000 },
          { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 200000 },
          { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 96000000 },
        ],
      },
    ],
  },
];

export default function PembandingPage() {
  const [projects, setProjects] = useState<ProjectPembanding[]>(initialProjects);
  const [expandedId, setExpandedId] = useState<string>(initialProjects[0].id);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialProjects[0].id);
  const [form, setForm] = useState({ supplier: "", harga: "" });
  const [confirmDelete, setConfirmDelete] = useState<{ projectId: string; vendorIndex: number; vendorName: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? "" : id));
  };

  const extractNumber = (harga: string) => parseNum(harga);

  const getCheapest = (vendors: VendorItem[]) => {
    if (vendors.length === 0) return null;
    return vendors.reduce((min, item) => (extractNumber(item.harga) < extractNumber(min.harga) ? item : min));
  };

  const getSelected = (vendors: VendorItem[]) => vendors.find((v) => v.pilihan === "Dipilih");

  const handlePilih = (projectId: string, vendorIndex: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v, i) => (i === vendorIndex ? { ...v, pilihan: "Dipilih" as const } : { ...v, pilihan: "Alternatif" as const })),
        };
      })
    );
  };

  const openConfirmDelete = (projectId: string, vendorIndex: number, vendorName: string) => {
    setConfirmDelete({ projectId, vendorIndex, vendorName });
  };

  const executeDeleteVendor = () => {
    if (!confirmDelete) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== confirmDelete.projectId) return p;
        return { ...p, vendors: p.vendors.filter((_, i) => i !== confirmDelete.vendorIndex) };
      })
    );
    setConfirmDelete(null);
  };

  const updateQty = (projectId: string, itemIdx: number, qty: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v) => {
            const newItems = v.items.map((it, i) => (i === itemIdx ? { ...it, qty: Math.max(0, qty) } : it));
            return recalcVendor({ ...v, items: newItems });
          }),
        };
      })
    );
  };

  const updateNama = (projectId: string, itemIdx: number, nama: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v) => ({
            ...v,
            items: v.items.map((it, i) => (i === itemIdx ? { ...it, nama } : it)),
          })),
        };
      })
    );
  };

  const updateSatuan = (projectId: string, itemIdx: number, satuan: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v) => ({
            ...v,
            items: v.items.map((it, i) => (i === itemIdx ? { ...it, satuan } : it)),
          })),
        };
      })
    );
  };

  const updateHargaSatuan = (projectId: string, vendorIdx: number, itemIdx: number, hargaSatuan: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v, vi) => {
            if (vi !== vendorIdx) return v;
            const newItems = v.items.map((it, i) => (i === itemIdx ? { ...it, hargaSatuan: Math.max(0, hargaSatuan) } : it));
            return recalcVendor({ ...v, items: newItems });
          }),
        };
      })
    );
  };

  const addItemRow = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v) => recalcVendor({ ...v, items: [...v.items, { nama: "Item Baru", qty: 1, satuan: "unit", hargaSatuan: 0 }] })),
        };
      })
    );
  };

  const removeItemRow = (projectId: string, itemIdx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          vendors: p.vendors.map((v) => recalcVendor({ ...v, items: v.items.filter((_, i) => i !== itemIdx) })),
        };
      })
    );
  };

  const openAddVendor = (projectId: string) => {
    setActiveProjectId(projectId);
    setForm({ supplier: "", harga: "" });
    setAddVendorOpen(true);
  };

  const handleSaveVendor = () => {
    if (!form.supplier) return;
    const project = projects.find((p) => p.id === activeProjectId);
    const templateItems = project && project.vendors.length > 0
      ? project.vendors[0].items.map((it) => ({ ...it, hargaSatuan: 0 }))
      : [{ nama: "Item Baru", qty: 1, satuan: "unit", hargaSatuan: 0 }];
    const newVendor: VendorItem = {
      id: `VND-${String(Date.now()).slice(-3)}`,
      supplier: form.supplier,
      harga: "Rp 0",
      fileName: "",
      fileSize: "—",
      pilihan: "Alternatif",
      items: templateItems,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, vendors: [...p.vendors, newVendor] } : p))
    );
    setForm({ supplier: "", harga: "" });
    setAddVendorOpen(false);
  };

  return (
    <SidebarLayout title="Pembanding Harga Vendor" subtitle="Pilih project untuk melihat perbandingan harga vendor.">
      {/* Stage / Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      {/* Project List with Expandable Table */}
      <div className="space-y-3">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id;
          const cheapest = getCheapest(project.vendors);
          const selected = getSelected(project.vendors);

          return (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Project Row (Clickable Header) */}
              <button
                onClick={() => toggleExpand(project.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isExpanded ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {project.id.replace("PB-", "")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{project.nama}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-400">{project.nomor}</span>
                      <span className="mx-1">·</span>
                      {project.vendors.length} vendor
                      <span className="mx-1">·</span>
                      Harga terendah: <span className="font-semibold text-emerald-600">{cheapest?.harga || "—"}</span>
                      {selected && <span className="ml-2 text-blue-600">· Terpilih: {selected.supplier}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${selected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {selected ? "Sudah Dipilih" : "Belum Dipilih"}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Expandable Comparison Table */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                  {/* Table toolbar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Perbandingan Harga</div>
                    <button
                      onClick={() => openAddVendor(project.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Vendor
                    </button>
                  </div>

                  {project.vendors.length > 0 && project.vendors[0].items.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden min-w-max">
                        <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                          <tr>
                            <th className="px-3 py-2.5 text-left font-medium border-b border-slate-200 w-48">Item</th>
                            <th className="px-3 py-2.5 text-center font-medium border-b border-slate-200 w-20">Qty</th>
                            <th className="px-3 py-2.5 text-center font-medium border-b border-slate-200 w-20">Satuan</th>
                            {project.vendors.map((v, vi) => (
                              <th key={v.id} className={`px-3 py-2.5 text-center font-medium border-b border-slate-200 min-w-[140px] ${v.pilihan === "Dipilih" ? "bg-emerald-50 text-emerald-700" : ""}`}>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="font-semibold">{v.supplier}</div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {v.pilihan === "Dipilih" ? (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">✓ Dipilih</span>
                                    ) : (
                                      <button
                                        onClick={() => handlePilih(project.id, vi)}
                                        className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium transition"
                                      >
                                        Pilih
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openConfirmDelete(project.id, vi, v.supplier)}
                                      className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                      title="Hapus vendor"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </th>
                            ))}
                            <th className="px-2 py-2.5 text-center font-medium border-b border-slate-200 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {project.vendors[0].items.map((it, idx) => {
                            const rowLowest = Math.min(...project.vendors.map((vv) => vv.items[idx]?.hargaSatuan || Infinity));
                            return (
                              <tr key={idx}>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    value={it.nama}
                                    onChange={(e) => updateNama(project.id, idx, e.target.value)}
                                    className="w-full text-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={ribuan(it.qty)}
                                    onChange={(e) => updateQty(project.id, idx, parseNum(e.target.value))}
                                    className="w-full text-center text-xs font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <select
                                    value={it.satuan}
                                    onChange={(e) => updateSatuan(project.id, idx, e.target.value)}
                                    className="w-full text-center text-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1 py-1 transition cursor-pointer"
                                  >
                                    {satuanList.map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </td>
                                {project.vendors.map((v, vi) => {
                                  const viItem = v.items[idx];
                                  const isLowest = viItem && viItem.hargaSatuan === rowLowest && viItem.hargaSatuan > 0;
                                  return (
                                    <td key={v.id} className={`px-3 py-2 ${isLowest ? "bg-emerald-50/40" : ""}`}>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={ribuan(viItem?.hargaSatuan || 0)}
                                        onChange={(e) => updateHargaSatuan(project.id, vi, idx, parseNum(e.target.value))}
                                        className={`w-full text-center text-xs font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition ${isLowest ? "text-emerald-700 font-bold" : "text-slate-700"}`}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-2 py-2 text-center">
                                  <button
                                    onClick={() => removeItemRow(project.id, idx)}
                                    className="text-slate-300 hover:text-red-500 transition"
                                    title="Hapus baris"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Total row */}
                          <tr className="bg-slate-50 font-semibold">
                            <td className="px-3 py-2.5 text-slate-700">Total</td>
                            <td className="px-3 py-2.5"></td>
                            <td className="px-3 py-2.5"></td>
                            {project.vendors.map((v) => {
                              const isLowest = cheapest && v.id === cheapest.id;
                              return (
                                <td key={v.id} className={`px-3 py-2.5 text-center font-mono text-xs ${isLowest ? "text-emerald-700 font-bold" : "text-slate-700"}`}>
                                  {v.harga}
                                </td>
                              );
                            })}
                            <td className="px-2 py-2.5"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Add item row button */}
                  <button
                    onClick={() => addItemRow(project.id)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-500 text-xs font-medium rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Vendor */}
      {addVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Tambah Vendor</h3>
              <button onClick={() => setAddVendorOpen(false)} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={projects.find((p) => p.id === activeProjectId)?.nama || ""} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Supplier</label>
                <input type="text" value={form.supplier} onChange={(e) => setForm((prev) => ({ ...prev, supplier: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: PT Sejahtera Abadi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Dokumen</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Klik atau seret file PDF/Excel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setAddVendorOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={handleSaveVendor} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Vendor */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Konfirmasi Hapus</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">
                Yakin mau menghapus vendor <span className="font-semibold text-slate-800">{confirmDelete.vendorName}</span>? Data penawaran dari vendor ini akan hilang.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={executeDeleteVendor} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
