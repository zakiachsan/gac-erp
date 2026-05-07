"use client";

import SidebarLayout from "@/components/SidebarLayout";
import { Plus, CheckCircle, UsersRound, Shield, UserCheck, CircleDot } from "lucide-react";

const users = [
  { id: 1, nama: "Rizal", email: "rizal@gemilangagung.co.id", jabatan: "Admin Perusahaan", approval: "-", status: "Aktif" },
  { id: 2, nama: "Andi Wijaya", email: "andi@gemilangagung.co.id", jabatan: "Staff", approval: "Pengaju", status: "Aktif" },
  { id: 3, nama: "Siti Aminah", email: "siti@gemilangagung.co.id", jabatan: "Staff", approval: "Marketing", status: "Aktif" },
  { id: 4, nama: "Budi Santoso", email: "budi@gemilangagung.co.id", jabatan: "SPV / Manager Ops", approval: "Mengetahui", status: "Aktif" },
  { id: 5, nama: "Dewi Lestari", email: "dewi@gemilangagung.co.id", jabatan: "Keuangan", approval: "Menyetujui", status: "Aktif" },
  { id: 6, nama: "Ahmad Fauzi", email: "ahmad@gemilangagung.co.id", jabatan: "Direktur", approval: "Menyetujui", status: "Aktif" },
];

const approvers = [
  { step: 1, label: "Pengaju", desc: "Otomatis approve saat submit", user: null, jabatan: "Staff", color: "bg-blue-50 border-blue-100", badge: "bg-blue-600" },
  { step: 2, label: "Mengetahui", desc: "Approval berjenjang ke-2", user: "Budi Santoso", jabatan: "SPV / Manager Ops", color: "bg-amber-50 border-amber-100", badge: "bg-amber-500" },
  { step: 3, label: "Menyetujui", desc: "Approval berjenjang ke-3", user: "Dewi Lestari", jabatan: "Keuangan", color: "bg-emerald-50 border-emerald-100", badge: "bg-emerald-600" },
];

export default function UserManagementPage() {
  return (
    <SidebarLayout
      title="User Management"
      subtitle="Admin — Kelola user & informasi approval berjenjang."
    >
      {/* Approval Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Approval Berjenjang</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Berikut user yang berwenang melakukan approval di setiap jenjang.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvers.map((a) => (
            <div key={a.step} className={`p-4 rounded-xl border ${a.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-full ${a.badge} text-white flex items-center justify-center text-[10px] font-bold`}>{a.step}</div>
                <div className="text-sm font-bold text-slate-900">{a.label}</div>
              </div>
              <div className="text-xs text-slate-500 mb-3">{a.desc}</div>
              {a.user ? (
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-100">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.user)}&background=0D8ABC&color=fff`}
                    alt={a.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{a.user}</div>
                    <div className="text-xs text-slate-500">{a.jabatan}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    S
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{a.jabatan}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Daftar User Perusahaan</h3>
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition">
            <Plus className="w-3.5 h-3.5" /> Tambah User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium">Approval Level</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-700">{u.jabatan}</td>
                  <td className="px-4 py-3">
                    {u.approval === "-" ? (
                      <span className="text-slate-400 text-xs">-</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        <Shield className="w-3 h-3" /> {u.approval}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{u.status}</span>
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
