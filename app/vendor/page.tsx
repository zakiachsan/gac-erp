"use client";

import { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Plus, Search, Building2, Phone, Mail, MapPin, Package, ShoppingCart, FileText } from "lucide-react";

interface Vendor {
  id: string;
  nama: string;
  kategori: string;
  alamat: string;
  telp: string;
  email: string;
  pic: string;
  jumlahItem: number;
  totalPo: number;
  status: "Aktif" | "Nonaktif";
}

const initialVendors: Vendor[] = [
  { id: "VND-001", nama: "PT CoolTech", kategori: "AC & HVAC", alamat: "Jl. Teknologi No. 1, Jakarta", telp: "021-555-0101", email: "info@cooltech.co.id", pic: "Andi Wijaya", jumlahItem: 6, totalPo: 70781800, status: "Aktif" },
  { id: "VND-002", nama: "PT AirSolutions", kategori: "AC & HVAC", alamat: "Jl. Angin Segar No. 5, Bandung", telp: "022-555-0202", email: "sales@airsolutions.co.id", pic: "Budi Santoso", jumlahItem: 2, totalPo: 0, status: "Aktif" },
  { id: "VND-003", nama: "PT Delta Jaya", kategori: "Pompa & Mekanikal", alamat: "Jl. Industri Raya No. 10, Surabaya", telp: "031-555-0303", email: "contact@deltajaya.co.id", pic: "Citra Lestari", jumlahItem: 2, totalPo: 0, status: "Aktif" },
  { id: "VND-004", nama: "PT Maju Bersama", kategori: "Pompa & Mekanikal", alamat: "Jl. Progres No. 8, Bandung", telp: "022-555-0404", email: "hello@majubersama.co.id", pic: "Dedi Pratama", jumlahItem: 2, totalPo: 34132500, status: "Aktif" },
  { id: "VND-005", nama: "CV Karya Mandiri", kategori: "Material & Jasa", alamat: "Jl. Karya No. 3, Medan", telp: "061-555-0505", email: "karya@mandiri.co.id", pic: "Eko Setyawan", jumlahItem: 1, totalPo: 0, status: "Aktif" },
  { id: "VND-006", nama: "PT Sejahtera Abadi", kategori: "Material & Konstruksi", alamat: "Jl. Abadi No. 7, Surabaya", telp: "031-555-0606", email: "sejahtera@abadi.co.id", pic: "Fani Rahmawati", jumlahItem: 3, totalPo: 139305000, status: "Aktif" },
];

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function VendorListPage() {
  const [vendors] = useState<Vendor[]>(initialVendors);
  const [search, setSearch] = useState("");

  const filtered = vendors.filter((v) =>
    v.nama.toLowerCase().includes(search.toLowerCase()) ||
    v.kategori.toLowerCase().includes(search.toLowerCase()) ||
    v.pic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout title="Data Vendor" subtitle="Daftar supplier dan kontraktor yang terdaftar.">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari vendor, kategori, PIC..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Tambah Vendor
        </button>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <Link key={v.id} href={`/vendor/${v.id}`} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${v.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                {v.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition">{v.nama}</h3>
            <p className="text-xs text-slate-500 mb-4">{v.kategori}</p>

            <div className="space-y-2 text-xs text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{v.alamat}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{v.telp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{v.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Package className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-700">{v.jumlahItem}</span> item
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-700">{fmt(v.totalPo)}</span> PO
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">Tidak ada vendor ditemukan.</div>
      )}
    </SidebarLayout>
  );
}
