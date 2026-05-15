"use client";

import SidebarLayout from "@/components/SidebarLayout";
import { useRole } from "@/context/RoleContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bell, Briefcase, FileText, Coins, TrendingDown, TrendingUp,
  Plus, Building2, Users, Shield, ArrowRight,
  Calendar, CircleUser, Eye,
} from "lucide-react";

/* ─── Shared types ─── */
interface Tenant {
  id: number;
  nama: string;
  slug: string;
  isActive: boolean;
  jumlahUser: number;
  pic: string;
  adminEmail: string;
  adminPassword: string;
  createdAt: string;
}

/* ─── Super Admin Dashboard ─── */
function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("gac-tenants");
    if (raw) {
      try { setTenants(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const activeCount = tenants.filter((t) => t.isActive).length;
  const inactiveCount = tenants.length - activeCount;
  const totalUsers = tenants.reduce((sum, t) => sum + (t.isActive ? t.jumlahUser : 0), 0);

  return (
    <SidebarLayout
      title="Dashboard"
      subtitle="Selamat datang kembali, berikut ringkasan seluruh perusahaan."
      action={
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{activeCount} aktif</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{tenants.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total Perusahaan</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Perusahaan Aktif</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{inactiveCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Perusahaan Nonaktif</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total User Aktif</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daftar Perusahaan */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Daftar Perusahaan</h3>
            <Link href="/super-admin" className="text-xs text-blue-600 font-medium hover:underline">Lihat Semua</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Nama Perusahaan</th>
                  <th className="pb-3 font-medium">PIC</th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tenants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Belum ada perusahaan terdaftar.
                    </td>
                  </tr>
                )}
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3">
                      <Link href={`/super-admin/${t.id}`} className="flex items-center gap-2 group">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-800 group-hover:text-blue-600 transition">{t.nama}</span>
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600">{t.pic}</td>
                    <td className="py-3 text-slate-600">{t.jumlahUser}</td>
                    <td className="py-3">
                      {t.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Nonaktif</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/super-admin/${t.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-2">
              <Link href="/super-admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                <div className="text-sm font-medium text-slate-700">Tambah Perusahaan</div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Aktif
                </div>
                <span className="text-sm font-semibold text-slate-900">{activeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  Nonaktif
                </div>
                <span className="text-sm font-semibold text-slate-900">{inactiveCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

/* ─── Default Dashboard (non-super-admin) ─── */
const stats = [
  { label: "Project Aktif", value: "12", change: "+2 minggu ini", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
  { label: "Penawaran Menunggu", value: "8", change: "3 urgent", icon: FileText, color: "bg-amber-50 text-amber-600" },
  { label: "Total Hutang Vendor", value: "Rp 2.4M", change: "", icon: TrendingDown, color: "bg-rose-50 text-rose-600" },
  { label: "Total Piutang Customer", value: "Rp 1.8M", change: "", icon: Coins, color: "bg-emerald-50 text-emerald-600" },
];

const activities = [
  { date: "05 Mei 2026", title: "Pengajuan Barang & Jasa", doc: "PR-2026-0041", status: "Menunggu Approval", statusColor: "bg-amber-50 text-amber-700 border-amber-100" },
  { date: "04 Mei 2026", title: "Penawaran Diclose Menang", doc: "QT-2026-0019", status: "Menang", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { date: "04 Mei 2026", title: "Pembayaran BAP", doc: "BAP-2026-0012", status: "Dibayar", statusColor: "bg-blue-50 text-blue-700 border-blue-100" },
  { date: "03 Mei 2026", title: "Absensi Staff", doc: "Face ID — 24 hadir", status: "Tercatat", statusColor: "bg-slate-100 text-slate-700 border-slate-200" },
];

function DefaultDashboard() {
  return (
    <SidebarLayout
      title="Dashboard"
      subtitle="Selamat datang kembali, berikut ringkasan hari ini."
      action={
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              {s.change && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{s.change}</span>}
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h3>
          <button className="text-xs text-blue-600 font-medium hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Aktivitas</th>
                <th className="pb-3 font-medium">No. Dokumen</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 text-slate-600">{a.date}</td>
                  <td className="py-3 font-medium text-slate-800">{a.title}</td>
                  <td className="py-3 text-slate-600 font-mono text-xs">{a.doc}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${a.statusColor}`}>{a.status}</span>
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

/* ─── Entry point ─── */
export default function DashboardPage() {
  const { role } = useRole();
  if (role === "super_admin") return <SuperAdminDashboard />;
  return <DefaultDashboard />;
}
