"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Globe, Briefcase, FileText, XCircle, Pencil, X, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CustomerDetailPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"project" | "penawaran">("project");
  const [customer, setCustomer] = useState({
    nama: "PT Maju Jaya",
    alamat: "Jl. Sudirman No. 45, Jakarta Pusat",
    contact: "Bapak Hendra",
    email: "hendra@majujaya.co.id",
    vms: "https://vms.majujaya.co.id",
    totalProject: 3,
    totalNilai: "Rp 2.1M",
  });

  const [form, setForm] = useState({ ...customer });

  const handleSave = () => {
    setCustomer({ ...form });
    setEditOpen(false);
  };

  return (
    <SidebarLayout
      title="Detail Customer"
      subtitle="Informasi lengkap & history project customer."
      action={
        <button
          onClick={() => { setForm({ ...customer }); setEditOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition"
        >
          <Pencil className="w-4 h-4" /> Edit Customer
        </button>
      }
    >
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Link href="/customer" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{customer.nama}</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>{customer.alamat}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.contact} (Contact Person)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={customer.vms} target="_blank" className="text-blue-600 hover:underline">{customer.vms}</a>
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-right shrink-0">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[140px]">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Project</div>
              <div className="text-2xl font-bold text-slate-900">{customer.totalProject}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[140px]">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Nilai Kontrak</div>
              <div className="text-2xl font-bold text-slate-900">{customer.totalNilai}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 px-6">
          <button
            onClick={() => setActiveTab("project")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "project"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Project Berjalan
          </button>
          <button
            onClick={() => setActiveTab("penawaran")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "penawaran"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Penawaran Kalah
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "project" ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium whitespace-nowrap">ID Project</th>
                  <th className="px-6 py-3 font-medium">No Kontrak</th>
                  <th className="px-6 py-3 font-medium">Nama Project</th>
                  <th className="px-6 py-3 font-medium text-right">Nilai</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href="/project/PRJ-2026-0001" className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold whitespace-nowrap">
                      PRJ-2026-0001
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">01/GAC/IV/2026</td>
                  <td className="px-6 py-3 font-medium text-slate-800">Pengadaan & Pemasangan AC Kantor Pusat</td>
                  <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp 1.2M</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href="/project/PRJ-2026-0004" className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold whitespace-nowrap">
                      PRJ-2026-0004
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">04/GAC/V/2026</td>
                  <td className="px-6 py-3 font-medium text-slate-800">Maintenance AC Bulanan</td>
                  <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp 15jt</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium whitespace-nowrap">ID Penawaran</th>
                  <th className="px-6 py-3 font-medium">Nama Project</th>
                  <th className="px-6 py-3 font-medium text-right">Nilai</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href="/penawaran/QT-2026-0010" className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold whitespace-nowrap">
                      QT-2026-0010
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-800">Pengadaan Mesin Produksi</td>
                  <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp 350jt</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">Kalah</span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">20 Mar 2026</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href="/penawaran/QT-2026-0008" className="font-mono text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold whitespace-nowrap">
                      QT-2026-0008
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-800">Renovasi Ruang Meeting</td>
                  <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp 45jt</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">Kalah</span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">15 Feb 2026</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Edit Customer */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Edit Customer</h2>
              <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Customer</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat</label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">VMS Link (Web Rekanan)</label>
                <input
                  type="url"
                  value={form.vms}
                  onChange={(e) => setForm({ ...form, vms: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">
                <CheckCircle className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
