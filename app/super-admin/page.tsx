"use client";

import SidebarLayout from "@/components/SidebarLayout";
import { useState } from "react";
import { Building2, Users, ToggleLeft, ToggleRight, Plus } from "lucide-react";

const tenants = [
  { id: 1, nama: "PT Gemilang Agung Cemerlang", slug: "gemilang-agung", isActive: true, jumlahUser: 12, pic: "Bapak Rizal" },
  { id: 2, nama: "PT Mitra Sejahtera", slug: "mitra-sejahtera", isActive: true, jumlahUser: 5, pic: "Ibu Sari" },
  { id: 3, nama: "CV Karya Mandiri", slug: "karya-mandiri", isActive: false, jumlahUser: 0, pic: "-" },
];

export default function SuperAdminPage() {
  const [data, setData] = useState(tenants);

  const toggle = (id: number) => {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  return (
    <SidebarLayout
      title="Kelola Perusahaan (Tenant)"
      subtitle="Super Admin — Aktivasi & monitoring seluruh perusahaan dalam sistem."
      action={
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95">
          <Plus className="w-4 h-4" /> Tambah Perusahaan
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Nama Perusahaan</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">PIC</th>
                <th className="px-6 py-3 font-medium">Jumlah User</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{t.nama}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">{t.slug}</td>
                  <td className="px-6 py-3 text-slate-700">{t.pic}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Users className="w-3.5 h-3.5" /> {t.jumlahUser}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {t.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => toggle(t.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {t.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      {t.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
