"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SidebarLayout from "@/components/SidebarLayout";
import {
  Plus, CheckCircle, XCircle, Upload, Trash2, ArrowLeft,
} from "lucide-react";
import {
  initialProjects,
  satuanList,
  fmt,
  ribuan,
  parseNum,
  recalcVendor,
  type ProjectPembanding,
  type VendorItem,
} from "@/lib/pembandingData";

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];
const ACTIVE_STEP_INDEX = 1;

export default function PembandingDetailClient() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const baseProject = initialProjects.find((p) => p.id === id);
  const [project, setProject] = useState<ProjectPembanding | null>(
    baseProject ? { ...baseProject, vendors: baseProject.vendors.map((v) => ({ ...v, items: v.items.map((it) => ({ ...it })) })) } : null
  );

  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [form, setForm] = useState({ supplier: "" });
  const [confirmDelete, setConfirmDelete] = useState<{ vendorIndex: number; vendorName: string } | null>(null);

  if (!project) {
    return (
      <SidebarLayout title="Pembanding Harga Vendor" subtitle="Detail pembanding tidak ditemukan.">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-sm text-slate-500">
          Data pembanding dengan ID <strong>{id}</strong> tidak ditemukan.
          <div className="mt-4">
            <Link href="/pengadaan/pembanding" className="text-blue-600 hover:underline text-sm font-medium">
              ← Kembali ke Daftar Pembanding
            </Link>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const extractNumber = (harga: string) => parseNum(harga);

  const getCheapest = (vendors: VendorItem[]) => {
    if (vendors.length === 0) return null;
    return vendors.reduce((min, item) => (extractNumber(item.harga) < extractNumber(min.harga) ? item : min));
  };

  const getSelected = (vendors: VendorItem[]) => vendors.find((v) => v.pilihan === "Dipilih");

  const handlePilih = (vendorIndex: number) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v, i) => (i === vendorIndex ? { ...v, pilihan: "Dipilih" as const } : { ...v, pilihan: "Alternatif" as const })),
      };
    });
  };

  const openConfirmDelete = (vendorIndex: number, vendorName: string) => {
    setConfirmDelete({ vendorIndex, vendorName });
  };

  const executeDeleteVendor = () => {
    if (!confirmDelete) return;
    setProject((prev) => {
      if (!prev) return prev;
      return { ...prev, vendors: prev.vendors.filter((_, i) => i !== confirmDelete.vendorIndex) };
    });
    setConfirmDelete(null);
  };

  const updateQty = (itemIdx: number, qty: number) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v) => {
          const newItems = v.items.map((it, i) => (i === itemIdx ? { ...it, qty: Math.max(0, qty) } : it));
          return recalcVendor({ ...v, items: newItems });
        }),
      };
    });
  };

  const updateNama = (itemIdx: number, nama: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v) => ({
          ...v,
          items: v.items.map((it, i) => (i === itemIdx ? { ...it, nama } : it)),
        })),
      };
    });
  };

  const updateSatuan = (itemIdx: number, satuan: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v) => ({
          ...v,
          items: v.items.map((it, i) => (i === itemIdx ? { ...it, satuan } : it)),
        })),
      };
    });
  };

  const updateHargaSatuan = (vendorIdx: number, itemIdx: number, hargaSatuan: number) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v, vi) => {
          if (vi !== vendorIdx) return v;
          const newItems = v.items.map((it, i) => (i === itemIdx ? { ...it, hargaSatuan: Math.max(0, hargaSatuan) } : it));
          return recalcVendor({ ...v, items: newItems });
        }),
      };
    });
  };

  const addItemRow = () => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v) => recalcVendor({ ...v, items: [...v.items, { nama: "Item Baru", qty: 1, satuan: "unit", hargaSatuan: 0 }] })),
      };
    });
  };

  const removeItemRow = (itemIdx: number) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vendors: prev.vendors.map((v) => recalcVendor({ ...v, items: v.items.filter((_, i) => i !== itemIdx) })),
      };
    });
  };

  const openAddVendor = () => {
    setForm({ supplier: "" });
    setAddVendorOpen(true);
  };

  const handleSaveVendor = () => {
    if (!form.supplier) return;
    const templateItems = project.vendors.length > 0
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
    setProject((prev) => {
      if (!prev) return prev;
      return { ...prev, vendors: [...prev.vendors, newVendor] };
    });
    setForm({ supplier: "" });
    setAddVendorOpen(false);
  };

  const cheapest = getCheapest(project.vendors);
  const selected = getSelected(project.vendors);

  return (
    <SidebarLayout title="Detail Pembanding Harga" subtitle={`${project.nama} · ${project.nomor}`}>
      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/pengadaan/pembanding" className="text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <span className="font-mono text-xs text-slate-500">{project.id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{project.nama}</h2>
            <div className="text-xs text-slate-500">
              Nomor: <span className="font-mono">{project.nomor}</span>
              <span className="mx-2">·</span>
              Project: <Link href={`/project/${project.projectId}`} className="text-blue-600 hover:underline">{project.projectId}</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${selected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              {selected ? "Sudah Dipilih" : "Belum Dipilih"}
            </span>
            {selected && <span className="text-sm text-blue-700 font-medium">{selected.supplier}</span>}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Perbandingan Harga Vendor</h3>
        <button
          onClick={openAddVendor}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Vendor
        </button>
      </div>

      {/* Comparison Table */}
      {project.vendors.length > 0 && project.vendors[0].items.length > 0 && (
        <div className="overflow-x-auto mb-6">
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
                            onClick={() => handlePilih(vi)}
                            className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium transition"
                          >
                            Pilih
                          </button>
                        )}
                        <button
                          onClick={() => openConfirmDelete(vi, v.supplier)}
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
                        onChange={(e) => updateNama(idx, e.target.value)}
                        className="w-full text-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={ribuan(it.qty)}
                        onChange={(e) => updateQty(idx, parseNum(e.target.value))}
                        className="w-full text-center text-xs font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={it.satuan}
                        onChange={(e) => updateSatuan(idx, e.target.value)}
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
                            onChange={(e) => updateHargaSatuan(vi, idx, parseNum(e.target.value))}
                            className={`w-full text-center text-xs font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 transition ${isLowest ? "text-emerald-700 font-bold" : "text-slate-700"}`}
                          />
                        </td>
                      );
                    })}
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => removeItemRow(idx)}
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
        onClick={addItemRow}
        className="mb-8 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-500 text-xs font-medium rounded-lg transition"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Item
      </button>

      {/* Modal Tambah Vendor */}
      {addVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Tambah Vendor</h3>
              <button onClick={() => setAddVendorOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={project.nama} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
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
