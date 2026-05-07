"use client";

import { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { ArrowLeft, Building2, Phone, Mail, MapPin, User, Package, ShoppingCart, FileText, Banknote, CheckCircle } from "lucide-react";

interface Item { nama: string; qty: number; satuan: string; hargaSatuan: number; }
interface PORef { noPo: string; tanggal: string; nilai: number; status: string; items: Item[]; }
interface BAPRef { noBap: string; tanggal: string; nilai: number; status: string; }
interface VendorDetail {
  id: string;
  nama: string;
  kategori: string;
  alamat: string;
  telp: string;
  email: string;
  pic: string;
  bank: string;
  noRekening: string;
  atasNama: string;
  npwp: string;
  items: Item[];
  pos: PORef[];
  baps: BAPRef[];
}

const vendorMap: Record<string, VendorDetail> = {
  "VND-001": {
    id: "VND-001", nama: "PT CoolTech", kategori: "AC & HVAC",
    alamat: "Jl. Teknologi No. 1, Jakarta", telp: "021-555-0101", email: "info@cooltech.co.id",
    pic: "Andi Wijaya", bank: "BCA", noRekening: "1234567890", atasNama: "PT CoolTech", npwp: "09.123.456.7-123.000",
    items: [
      { nama: "AC Split 1 PK", qty: 10, satuan: "unit", hargaSatuan: 3500000 },
      { nama: "AC Split 1.5 PK", qty: 5, satuan: "unit", hargaSatuan: 4000000 },
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
      { nama: "AC Split 2.5 PK", qty: 3, satuan: "unit", hargaSatuan: 5200000 },
      { nama: "AC Cassette 3 PK", qty: 2, satuan: "unit", hargaSatuan: 6500000 },
      { nama: "Jasa Instalasi AC", qty: 1, satuan: "unit", hargaSatuan: 1200000 },
    ],
    pos: [
      { noPo: "011/PO.BLM/Semangat Teknik/TKN.ASYA/VIII/2024", tanggal: "2024-08-15", nilai: 70781800, status: "Disetujui", items: [
        { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
        { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
        { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
        { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
      ]},
    ],
    baps: [
      { noBap: "011/BAP.BLM/PT CoolTech/KEU.PW/VIII/2024", tanggal: "2024-08-20", nilai: 36907500, status: "Disetujui" },
    ],
  },
  "VND-002": {
    id: "VND-002", nama: "PT AirSolutions", kategori: "AC & HVAC",
    alamat: "Jl. Angin Segar No. 5, Bandung", telp: "022-555-0202", email: "sales@airsolutions.co.id",
    pic: "Budi Santoso", bank: "Mandiri", noRekening: "2233445566", atasNama: "PT AirSolutions", npwp: "09.234.567.8-234.000",
    items: [
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4550000 },
      { nama: "AC Split 2.5 PK", qty: 5, satuan: "unit", hargaSatuan: 5200000 },
    ],
    pos: [],
    baps: [],
  },
  "VND-003": {
    id: "VND-003", nama: "PT Delta Jaya", kategori: "Pompa & Mekanikal",
    alamat: "Jl. Industri Raya No. 10, Surabaya", telp: "031-555-0303", email: "contact@deltajaya.co.id",
    pic: "Citra Lestari", bank: "BRI", noRekening: "3344556677", atasNama: "PT Delta Jaya", npwp: "09.345.678.9-345.000",
    items: [
      { nama: "Pompa Air Industri 3HP", qty: 2, satuan: "unit", hargaSatuan: 12000000 },
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 14000000 },
    ],
    pos: [],
    baps: [],
  },
  "VND-004": {
    id: "VND-004", nama: "PT Maju Bersama", kategori: "Pompa & Mekanikal",
    alamat: "Jl. Progres No. 8, Bandung", telp: "022-555-0404", email: "hello@majubersama.co.id",
    pic: "Dedi Pratama", bank: "Mandiri", noRekening: "9876543210", atasNama: "PT Maju Bersama", npwp: "09.456.789.0-456.000",
    items: [
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
      { nama: "Pompa Air Industri 10HP", qty: 1, satuan: "unit", hargaSatuan: 22000000 },
    ],
    pos: [
      { noPo: "012/PO.BLM/Semangat Teknik/TKN.BETA/IX/2024", tanggal: "2024-09-20", nilai: 34132500, status: "Disetujui", items: [
        { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
        { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
      ]},
    ],
    baps: [
      { noBap: "012/BAP.BLM/PT Maju Bersama/KEU.PW/IX/2024", tanggal: "2024-09-25", nilai: 21645000, status: "Disetujui" },
    ],
  },
  "VND-005": {
    id: "VND-005", nama: "CV Karya Mandiri", kategori: "Material & Jasa",
    alamat: "Jl. Karya No. 3, Medan", telp: "061-555-0505", email: "karya@mandiri.co.id",
    pic: "Eko Setyawan", bank: "BNI", noRekening: "4455667788", atasNama: "CV Karya Mandiri", npwp: "02.567.890.1-567.000",
    items: [
      { nama: "Pipa PVC 4 inch", qty: 50, satuan: "meter", hargaSatuan: 85000 },
      { nama: "Kabel Listrik NYM 3x2.5", qty: 100, satuan: "meter", hargaSatuan: 12500 },
    ],
    pos: [],
    baps: [],
  },
  "VND-006": {
    id: "VND-006", nama: "PT Sejahtera Abadi", kategori: "Material & Konstruksi",
    alamat: "Jl. Abadi No. 7, Surabaya", telp: "031-555-0606", email: "sejahtera@abadi.co.id",
    pic: "Fani Rahmawati", bank: "BRI", noRekening: "5544331122", atasNama: "PT Sejahtera Abadi", npwp: "09.678.901.2-678.000",
    items: [
      { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
      { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
      { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
      { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
      { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
    ],
    pos: [
      { noPo: "013/PO.BLM/Semangat Teknik/TKN.GAMA/X/2024", tanggal: "2024-10-25", nilai: 139305000, status: "Draft", items: [
        { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
        { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
        { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
        { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
        { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
      ]},
    ],
    baps: [
      { noBap: "013/BAP.BLM/PT Sejahtera Abadi/KEU.PW/X/2024", tanggal: "2024-10-30", nilai: 0, status: "Draft" },
    ],
  },
};

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const ribuan = (n: number) => {
  if (n === 0) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const tabs = ["Info", "Items", "PO History", "BAP History"];

interface Props {
  id: string;
}

export default function VendorDetailPage({ id }: Props) {
  const [activeTab, setActiveTab] = useState("Info");
  const vendor = vendorMap[id || ""];

  if (!vendor) {
    return (
      <SidebarLayout title="Vendor" subtitle="Detail vendor tidak ditemukan.">
        <div className="text-center py-12 text-slate-400">
          <p>Vendor tidak ditemukan.</p>
          <Link href="/vendor" className="text-blue-600 text-sm mt-2 inline-block">← Kembali ke daftar vendor</Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout title={vendor.nama} subtitle={vendor.kategori}>
      {/* Back link */}
      <div className="mb-4">
        <Link href="/vendor" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke daftar vendor
        </Link>
      </div>

      {/* Info Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900">{vendor.nama}</h1>
            <p className="text-sm text-slate-500">{vendor.kategori}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {vendor.alamat}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {vendor.telp}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {vendor.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-slate-200 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === tab ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Informasi Vendor</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">PIC</span><span className="font-medium text-slate-800 flex items-center gap-1"><User className="w-3.5 h-3.5" /> {vendor.pic}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">NPWP</span><span className="font-medium text-slate-800">{vendor.npwp}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Telepon</span><span className="font-medium text-slate-800">{vendor.telp}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-800">{vendor.email}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Informasi Bank</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-medium text-slate-800 flex items-center gap-1"><Banknote className="w-3.5 h-3.5" /> {vendor.bank}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">No Rekening</span><span className="font-medium text-slate-800">{vendor.noRekening}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Atas Nama</span><span className="font-medium text-slate-800">{vendor.atasNama}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Ringkasan Transaksi</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{vendor.items.length}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">Item</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{vendor.pos.length}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">PO</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-amber-600">{vendor.baps.length}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">BAP</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Items" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-medium text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-center w-20">Qty</th>
                <th className="px-4 py-3 text-center w-20">Satuan</th>
                <th className="px-4 py-3 text-right w-32">Harga Satuan</th>
                <th className="px-4 py-3 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendor.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 font-medium text-slate-800">{it.nama}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-slate-600">{ribuan(it.qty)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600">{it.satuan}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{fmt(it.hargaSatuan)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-medium text-slate-700">{fmt(it.qty * it.hargaSatuan)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "PO History" && (
        <div className="space-y-3">
          {vendor.pos.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">Belum ada PO.</div>}
          {vendor.pos.map((po, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">{po.noPo}</div>
                  <div className="text-xs text-slate-500">{po.tanggal}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${po.status === "Disetujui" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{po.status}</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-center w-16">Qty</th><th className="px-3 py-2 text-center w-16">Satuan</th><th className="px-3 py-2 text-right w-24">Harga</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {po.items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-xs text-slate-700">{it.nama}</td>
                      <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-600">{ribuan(it.qty)}</td>
                      <td className="px-3 py-2 text-center text-[10px] text-slate-600">{it.satuan}</td>
                      <td className="px-3 py-2 text-right font-mono text-[10px] text-slate-600">{fmt(it.hargaSatuan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">{po.items.length} item</span>
                <span className="text-sm font-bold text-emerald-700">{fmt(po.nilai)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "BAP History" && (
        <div className="space-y-3">
          {vendor.baps.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">Belum ada BAP.</div>}
          {vendor.baps.map((bap, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{bap.noBap}</div>
                    <div className="text-xs text-slate-500">{bap.tanggal}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-700">{fmt(bap.nilai)}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border mt-1 ${bap.status === "Disetujui" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{bap.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SidebarLayout>
  );
}
