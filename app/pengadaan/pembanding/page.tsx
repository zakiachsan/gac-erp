"use client";

import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus } from "lucide-react";
import { initialProjects } from "@/lib/pembandingData";

const steps = [
  { id: "pr", label: "1. Pengajuan", href: "/pengadaan/pr" },
  { id: "pembanding", label: "2. Pembanding", href: "/pengadaan/pembanding" },
  { id: "po", label: "3. PO", href: "/pengadaan/po" },
  { id: "bap", label: "4. BAP", href: "/pengadaan/bap" },
  { id: "bayar", label: "5. Bayar", href: "/pengadaan/bayar" },
  { id: "laporan", label: "6. Laporan", href: "/pengadaan/laporan" },
];
const ACTIVE_STEP_INDEX = 1;

const parseNum = (s: string) => parseInt(String(s).replace(/\D/g, "")) || 0;

export default function PembandingListPage() {
  return (
    <SidebarLayout title="Pembanding Harga Vendor" subtitle="Daftar project yang sedang dalam tahap perbandingan harga.">
      {/* Stage / Step Indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <Link key={step.id} href={step.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${i === ACTIVE_STEP_INDEX ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {step.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Daftar Pembanding</h2>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition">
            <Plus className="w-3.5 h-3.5" /> Tambah Pembanding
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nomor</th>
                <th className="px-6 py-3">Nama Project</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Nama Vendor</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialProjects.map((project) => {
                const selected = project.vendors.find((v) => v.pilihan === "Dipilih");
                return (
                  <tr key={project.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <Link href={`/pengadaan/pembanding/${project.id}`} className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold whitespace-nowrap">
                        {project.id}
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{project.nomor}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{project.nama}</td>
                    <td className="px-6 py-3 text-slate-700">{project.vendors.length}</td>
                    <td className="px-6 py-3 text-slate-700">
                      {selected ? selected.supplier : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${selected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {selected ? "Sudah Dipilih" : "Belum Dipilih"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {initialProjects.length} dari {initialProjects.length} data</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>←</button>
            <button className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">1</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">2</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">→</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
