"use client";

import { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { Search } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  noPenawaran: string;
  nama: string;
  customer: string;
  nilai: string;
  kontrak: string;
  status: string;
  statusColor: string;
}

const baseProjects: Project[] = [
  { id: "PRJ-2026-0001", noPenawaran: "QT-2026-0019", nama: "Pengadaan & Pemasangan AC Kantor Pusat", customer: "PT Maju Jaya", nilai: "Rp 1.200.000.000", kontrak: "01/GAC/IV/2026", status: "Aktif", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "PRJ-2026-0002", noPenawaran: "QT-2026-0017", nama: "Pemasangan Pompa Industri", customer: "PT Sejahtera Abadi", nilai: "Rp 450.000.000", kontrak: "02/GAC/III/2026", status: "Aktif", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "PRJ-2026-0003", noPenawaran: "QT-2026-0015", nama: "Renovasi Furniture Kantor", customer: "CV Karya Mandiri", nilai: "Rp 85.000.000", kontrak: "03/GAC/II/2026", status: "Selesai", statusColor: "bg-blue-50 text-blue-700 border-blue-100" },
];

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>(baseProjects);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gac-projects");
      if (stored) {
        const parsed: Project[] = JSON.parse(stored);
        setProjects((prev) => {
          const merged = [...prev];
          parsed.forEach((p) => {
            if (!merged.find((m) => m.id === p.id)) merged.push(p);
          });
          return merged;
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <SidebarLayout
      title="Detail Project"
      subtitle="Daftar project yang status penawarannya Menang."
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari nama project atau customer..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Semua Status</option>
          <option>Aktif</option>
          <option>Selesai</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">ID Project</th>
                <th className="px-6 py-3 font-medium">No Penawaran</th>
                <th className="px-6 py-3 font-medium">Nama Project</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Nilai Project</th>
                <th className="px-6 py-3 font-medium">No Kontrak</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href={`/project/${p.id}`} className="font-mono text-sm text-blue-700 hover:text-blue-800 hover:underline font-bold tracking-wide">
                      {p.id}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <Link href={`/penawaran/${p.noPenawaran}`} className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold">
                      {p.noPenawaran}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">{p.nama}</td>
                  <td className="px-6 py-3 text-slate-700">{p.customer}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{p.nilai}</td>
                  <td className="px-6 py-3 text-slate-600">{p.kontrak || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${p.statusColor}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {projects.length} dari {projects.length} project</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>←</button>
            <button className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">1</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">2</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">3</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">→</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
