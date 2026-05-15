"use client";

import SidebarLayout from "@/components/SidebarLayout";
import { Search } from "lucide-react";
import Link from "next/link";

function firstThreeWords(str: string) {
  const words = str.trim().split(/\s+/);
  if (words.length <= 3) return str;
  return words.slice(0, 3).join(" ") + "...";
}

const customers = [
  { id: 1, nama: "PT Maju Jaya", alamat: "Jl. Sudirman No. 45, Jakarta Pusat", contact: "Bapak Hendra", email: "hendra@majujaya.co.id", totalProject: 3, totalNilai: "Rp 2.1M", status: "Aktif" },
  { id: 2, nama: "PT Sejahtera Abadi", alamat: "Jl. Thamrin Kav. 10, Jakarta Selatan", contact: "Ibu Rina", email: "rina@sejahtera.co.id", totalProject: 2, totalNilai: "Rp 850jt", status: "Aktif" },
  { id: 3, nama: "CV Karya Mandiri", alamat: "Jl. Gajah Mada No. 88, Tangerang", contact: "Pak Tono", email: "tono@karyamandiri.co.id", totalProject: 1, totalNilai: "Rp 85jt", status: "Aktif" },
  { id: 4, nama: "PT Delta Prima", alamat: "Jl. Asia Afrika No. 120, Bandung", contact: "Mas Dika", email: "dika@deltaprima.co.id", totalProject: 0, totalNilai: "Rp 0", status: "Nonaktif" },
];

export default function CustomerListPage() {
  return (
    <SidebarLayout
      title="Data Customer"
      subtitle="Kelola data pelanggan & monitoring history project."
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari nama customer..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Nama Customer</th>
                <th className="px-6 py-3 font-medium">Alamat</th>
                <th className="px-6 py-3 font-medium">Contact Person</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Total Project</th>
                <th className="px-6 py-3 font-medium">Total Nilai Kontrak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href={`/customer/${c.id}`} className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                      {c.nama}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-slate-600 max-w-[200px] truncate">{firstThreeWords(c.alamat)}</td>
                  <td className="px-6 py-3 text-slate-700">{c.contact}</td>
                  <td className="px-6 py-3 text-slate-600">{c.email}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{c.totalProject}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{c.totalNilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan 4 dari 24 customer</span>
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
