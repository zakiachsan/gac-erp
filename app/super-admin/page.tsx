"use client";

import SidebarLayout from "@/components/SidebarLayout";
import { useState, useEffect } from "react";
import { Building2, Users, ToggleLeft, ToggleRight, Plus, X, Eye, EyeOff, Copy, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AdminAccount {
  email: string;
  password: string;
}

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
  const defaults: Tenant[] = [
    { id: 1, nama: "PT Gemilang Agung Cemerlang", slug: "gemilang-agung", isActive: true, jumlahUser: 12, pic: "Bapak Rizal", adminEmail: "admin@gac.co.id", adminPassword: "admin123", createdAt: "2025-01-15" },
    { id: 2, nama: "PT Mitra Sejahtera", slug: "mitra-sejahtera", isActive: true, jumlahUser: 5, pic: "Ibu Sari", adminEmail: "admin@mitrasejahtera.id", adminPassword: "admin123", createdAt: "2025-03-10" },
    { id: 3, nama: "CV Karya Mandiri", slug: "karya-mandiri", isActive: false, jumlahUser: 0, pic: "-", adminEmail: "-", adminPassword: "-", createdAt: "2025-04-01" },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveTenants(data: Tenant[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateSlug(nama: string): string {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function SuperAdminPage() {
  const [data, setData] = useState<Tenant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nama: "",
    slug: "",
    pic: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    setData(loadTenants());
  }, []);

  const toggle = (id: number) => {
    setData((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
      saveTenants(next);
      return next;
    });
  };

  const handleNamaChange = (v: string) => {
    setForm((prev) => ({ ...prev, nama: v, slug: generateSlug(v) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.adminEmail.trim() || !form.adminPassword.trim()) return;

    const newTenant: Tenant = {
      id: Date.now(),
      nama: form.nama.trim(),
      slug: form.slug || generateSlug(form.nama),
      isActive: true,
      jumlahUser: 1,
      pic: form.pic.trim() || "-",
      adminEmail: form.adminEmail.trim(),
      adminPassword: form.adminPassword,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setData((prev) => {
      const next = [newTenant, ...prev];
      saveTenants(next);
      return next;
    });

    setForm({ nama: "", slug: "", pic: "", adminEmail: "", adminPassword: "" });
    setShowPass(false);
    setModalOpen(false);
  };

  const copyCredentials = (tenant: Tenant) => {
    const text = `Perusahaan: ${tenant.nama}\nAdmin Email: ${tenant.adminEmail}\nPassword: ${tenant.adminPassword}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(tenant.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const activeCount = data.filter((t) => t.isActive).length;
  const totalUsers = data.reduce((sum, t) => sum + (t.isActive ? t.jumlahUser : 0), 0);

  return (
    <SidebarLayout
      title="Kelola Perusahaan (Tenant)"
      subtitle="Super Admin — Aktivasi, monitoring, dan pembuatan perusahaan beserta akun admin-nya."
      action={
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Perusahaan
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Perusahaan</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{data.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Aktif</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total User Aktif</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalUsers}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Nama Perusahaan</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">PIC</th>
                <th className="px-6 py-3 font-medium">Akun Admin</th>
                <th className="px-6 py-3 font-medium">Jumlah User</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    Belum ada perusahaan terdaftar.
                  </td>
                </tr>
              )}
              {data.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link
                      href={`/super-admin/${t.id}`}
                      className="flex items-center gap-2 group"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-blue-600 group-hover:text-blue-700 transition">{t.nama}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition" />
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">{t.slug}</td>
                  <td className="px-6 py-3 text-slate-700">{t.pic}</td>
                  <td className="px-6 py-3">
                    {t.adminEmail && t.adminEmail !== "-" ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-700 font-medium">{t.adminEmail}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-mono">{t.adminPassword}</span>
                          <button
                            onClick={() => copyCredentials(t)}
                            className="text-slate-400 hover:text-blue-600 transition"
                            title="Salin kredensial"
                          >
                            {copiedId === t.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tambah Perusahaan Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Perusahaan <span className="text-red-500">*</span></label>
                <input
                  value={form.nama}
                  onChange={(e) => handleNamaChange(e.target.value)}
                  placeholder="Contoh: PT Abadi Jaya"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="auto-generate"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama PIC</label>
                  <input
                    value={form.pic}
                    onChange={(e) => setForm((p) => ({ ...p, pic: e.target.value }))}
                    placeholder="Contoh: Bapak Andi"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Akun Admin Perusahaan</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Admin <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => setForm((p) => ({ ...p, adminEmail: e.target.value }))}
                      placeholder="admin@perusahaan.id"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password Admin <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={form.adminPassword}
                        onChange={(e) => setForm((p) => ({ ...p, adminPassword: e.target.value }))}
                        placeholder="Minimal 6 karakter"
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Password ini akan diberikan ke admin perusahaan untuk login pertama kali.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
