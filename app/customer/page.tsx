"use client";

import { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { Search, Plus, X, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  nama: string;
  alamat: string;
  contact: string;
  email: string;
  vms?: string;
  totalProject: number;
  totalNilai: string;
  status: "Aktif" | "Nonaktif";
}

const STORAGE_KEY = "gac-customers";

const initialCustomers: Customer[] = [
  { id: "CUST-001", nama: "PT Maju Jaya", alamat: "Jl. Sudirman No. 45, Jakarta Pusat", contact: "Bapak Hendra", email: "hendra@majujaya.co.id", vms: "", totalProject: 3, totalNilai: "Rp 2.1M", status: "Aktif" },
  { id: "CUST-002", nama: "PT Sejahtera Abadi", alamat: "Jl. Thamrin Kav. 10, Jakarta Selatan", contact: "Ibu Rina", email: "rina@sejahtera.co.id", vms: "", totalProject: 2, totalNilai: "Rp 850jt", status: "Aktif" },
  { id: "CUST-003", nama: "CV Karya Mandiri", alamat: "Jl. Gajah Mada No. 88, Tangerang", contact: "Pak Tono", email: "tono@karyamandiri.co.id", vms: "", totalProject: 1, totalNilai: "Rp 85jt", status: "Aktif" },
  { id: "CUST-004", nama: "PT Delta Prima", alamat: "Jl. Asia Afrika No. 120, Bandung", contact: "Mas Dika", email: "dika@deltaprima.co.id", vms: "", totalProject: 0, totalNilai: "Rp 0", status: "Nonaktif" },
];

function firstThreeWords(str: string) {
  const words = str.trim().split(/\s+/);
  if (words.length <= 3) return str;
  return words.slice(0, 3).join(" ") + "...";
}

function generateId(list: Customer[]) {
  const max = list.reduce((m, c) => {
    const num = parseInt(c.id.split("-")[1] || "0", 10);
    return num > m ? num : m;
  }, 0);
  return `CUST-${String(max + 1).padStart(3, "0")}`;
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({
    nama: "",
    alamat: "",
    contact: "",
    email: "",
    vms: "",
    status: "Aktif",
  });

  const filtered = customers.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ nama: "", alamat: "", contact: "", email: "", vms: "", status: "Aktif" });
    setShowModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nama || !form.email) return;
    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...(form as Customer) } : c))
      );
    } else {
      const newC: Customer = {
        id: generateId(customers),
        nama: form.nama || "",
        alamat: form.alamat || "",
        contact: form.contact || "",
        email: form.email || "",
        vms: form.vms || "",
        totalProject: 0,
        totalNilai: "Rp 0",
        status: (form.status as "Aktif" | "Nonaktif") || "Aktif",
      };
      setCustomers((prev) => [newC, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  return (
    <SidebarLayout
      title="Data Customer"
      subtitle="Kelola data pelanggan & monitoring history project."
      action={
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Customer
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau contact person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href={`/customer/${c.id}`} className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                      {c.nama}
                    </Link>
                    <div className="text-xs text-slate-500 mt-0.5">{c.totalProject} project · {c.totalNilai}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-600 max-w-[200px] truncate">{firstThreeWords(c.alamat)}</td>
                  <td className="px-6 py-3 text-slate-700">{c.contact}</td>
                  <td className="px-6 py-3 text-slate-600">{c.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      c.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/customer/${c.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                    Tidak ada data customer
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filtered.length} dari {customers.length} customer</span>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">{editingId ? "Edit" : "Tambah"} Customer</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nama Customer</label>
                <input
                  type="text"
                  value={form.nama || ""}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  placeholder="Contoh: PT Maju Jaya"
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Alamat</label>
                <textarea
                  value={form.alamat || ""}
                  onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                  placeholder="Alamat lengkap..."
                  rows={2}
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={form.contact || ""}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    placeholder="Nama contact person"
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@customer.co.id"
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">VMS Link (Web Rekanan)</label>
                <input
                  type="url"
                  value={form.vms || ""}
                  onChange={(e) => setForm((f) => ({ ...f, vms: e.target.value }))}
                  placeholder="https://..."
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={form.status || "Aktif"}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "Aktif" | "Nonaktif" }))}
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                {editingId ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Customer?</h3>
            <p className="text-sm text-slate-500 mb-5">Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
