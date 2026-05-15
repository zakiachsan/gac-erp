"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  Users,
  Mail,
  KeyRound,
  Shield,
  Calendar,
  User,
  CircleUser,
  Eye,
  EyeOff,
} from "lucide-react";

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

interface UserItem {
  id: number;
  nama: string;
  email: string;
  role: string;
  status: string;
}

const STORAGE_KEY = "gac-tenants";

function loadTenants(): Tenant[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

function generateUsers(tenant: Tenant): UserItem[] {
  const users: UserItem[] = [
    {
      id: 1,
      nama: "Admin",
      email: tenant.adminEmail,
      role: "Admin Perusahaan",
      status: "Aktif",
    },
  ];
  const firstNames = [
    "Budi", "Andi", "Sari", "Rina", "Dewi", "Agus", "Yuni",
    "Fajar", "Lestari", "Hadi", "Wulan", "Bayu",
  ];
  const lastNames = [
    "Santoso", "Wijaya", "Kusuma", "Putri", "Nugroho", "Pratama",
    "Sari", "Budiman", "Hartono", "Susanti",
  ];

  for (let i = 2; i <= tenant.jumlahUser; i++) {
    const fn = firstNames[(i * 3) % firstNames.length];
    const ln = lastNames[(i * 7) % lastNames.length];
    users.push({
      id: i,
      nama: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${tenant.slug}.id`,
      role: "Staff",
      status: Math.random() > 0.1 ? "Aktif" : "Nonaktif",
    });
  }
  return users;
}

export default function CompanyDetailClient() {
  const params = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const tenants = loadTenants();
    const id = Number(params.id);
    const found = tenants.find((t) => t.id === id) || null;
    setTenant(found);
    if (found) {
      setUsers(generateUsers(found));
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <SidebarLayout title="Detail Perusahaan" subtitle="Memuat data...">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 text-sm">Memuat...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (!tenant) {
    return (
      <SidebarLayout title="Detail Perusahaan">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-slate-500 text-sm">
            Perusahaan tidak ditemukan.
          </div>
          <Link
            href="/super-admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout title="Detail Perusahaan" subtitle={tenant.nama}>
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/super-admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Perusahaan
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total User
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {tenant.jumlahUser}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg ${tenant.isActive ? "bg-emerald-50" : "bg-slate-100"}`}
            >
              <Shield
                className={`w-5 h-5 ${tenant.isActive ? "text-emerald-600" : "text-slate-500"}`}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </div>
              <div
                className={`text-2xl font-bold mt-0.5 ${tenant.isActive ? "text-emerald-700" : "text-slate-600"}`}
              >
                {tenant.isActive ? "Aktif" : "Nonaktif"}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tanggal Dibuat
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {tenant.createdAt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Informasi Perusahaan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Informasi Perusahaan
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Nama Perusahaan
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {tenant.nama}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Slug
              </div>
              <div className="text-sm font-mono text-slate-700">
                {tenant.slug}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">PIC</div>
              <div className="text-sm text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {tenant.pic}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Status
              </div>
              <div>
                {tenant.isActive ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Akun Admin */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Akun Admin
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Email
              </div>
              <div className="text-sm text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{tenant.adminEmail}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Password
              </div>
              <div className="text-sm text-slate-700 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{showPass ? tenant.adminPassword : "••••••••"}</span>
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 transition ml-1"
                  title={showPass ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Role
              </div>
              <div className="text-sm text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  Admin Perusahaan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar User */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            Daftar User
          </h2>
          <span className="text-xs text-slate-500">{users.length} user</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Nama</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Belum ada user terdaftar.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <CircleUser className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {u.nama}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{u.email}</td>
                  <td className="px-6 py-3">
                    {u.role === "Admin Perusahaan" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {u.role}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">{u.role}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {u.status === "Aktif" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Nonaktif
                      </span>
                    )}
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
