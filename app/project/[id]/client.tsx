"use client";

import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { ArrowLeft, Download, FileText, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "detail", label: "Detail Pekerjaan" },
  { id: "pengajuan", label: "Listing Pengajuan" },
  { id: "pemasukan", label: "Listing Pemasukan" },
  { id: "pengeluaran", label: "Listing Pengeluaran" },
  { id: "hutang", label: "Hutang / Piutang" },
  { id: "anggaran", label: "Anggaran vs Realisasi" },
  { id: "dokumen", label: "Dokumen" },
];

const projectMap: Record<string, {
  name: string;
  customer: string;
  contract: string;
  period: string;
  quotation: string;
  description: string;
  location: string;
  marketing: string;
  pic: string;
}> = {
  "PRJ-2026-0001": {
    name: "Pengadaan & Pemasangan AC Kantor Pusat",
    customer: "PT Maju Jaya",
    contract: "01/GAC/IV/2026",
    period: "10 Apr — 10 Jun 2026",
    quotation: "QT-2026-0019",
    description:
      "Pengadaan dan pemasangan 10 unit AC Split 2 PK beserta instalasi pipa dan wiring untuk kantor pusat PT Maju Jaya. Termasuk pekerjaan ducting, drainase, dan commissioning.",
    location: "Jl. Sudirman No. 45, Jakarta Pusat",
    marketing: "Siti Aminah",
    pic: "Andi Wijaya",
  },
  "PRJ-2026-0002": {
    name: "Pemasangan Pompa Industri",
    customer: "PT Sejahtera Abadi",
    contract: "02/GAC/IV/2026",
    period: "15 Apr — 15 Jun 2026",
    quotation: "QT-2026-0020",
    description:
      "Pemasangan dan commissioning pompa industri untuk kebutuhan pabrik PT Sejahtera Abadi.",
    location: "Jl. Thamrin No. 88, Jakarta Selatan",
    marketing: "Budi Santoso",
    pic: "Dewi Kusuma",
  },
};

const initialPengajuan = [
  { no: "PR-2026-0041", tanggal: "28 Apr 2026", keterangan: "AC Split 2 PK x 10 unit", total: "Rp 45.000.000", status: "Disetujui" },
  { no: "PR-2026-0015", tanggal: "02 Mei 2026", keterangan: "Jasa Instalasi & Pipa", total: "Rp 12.000.000", status: "Menunggu" },
];

const initialPemasukan = [
  { tanggal: "15 Apr 2026", keterangan: "DP 30% Kontrak", jumlah: "Rp 360.000.000", status: "Diterima" },
  { tanggal: "05 Mei 2026", keterangan: "Termin 2 (BAST)", jumlah: "Rp 480.000.000", status: "Menunggu" },
];

const initialPengeluaran = [
  { tanggal: "29 Apr 2026", keperluan: "Pembayaran AC Supplier", vendor: "PT CoolTech", jumlah: "Rp 42.000.000" },
  { tanggal: "30 Apr 2026", keperluan: "Biaya Transportasi", vendor: "CV Transport", jumlah: "Rp 3.000.000" },
];

const initialHutang = [
  { jenis: "Piutang", pihak: "PT Maju Jaya", jumlah: "Rp 480.000.000", jatuhTempo: "10 Mei 2026", status: "Belum Dibayar" },
  { jenis: "Hutang", pihak: "PT CoolTech", jumlah: "Rp 8.000.000", jatuhTempo: "15 Mei 2026", status: "Belum Dibayar" },
];

const initialDokumen = [
  { name: "Kontrak_01_GAC_IV_2026.pdf", type: "Kontrak", date: "10 Apr 2026" },
  { name: "BAST_AC_KantorPusat.pdf", type: "BAST", date: "04 Mei 2026" },
  { name: "INV-2026-0045.pdf", type: "Invoice", date: "04 Mei 2026" },
];

const modalLabels: Record<string, string> = {
  pengajuan: "Pengajuan",
  pemasukan: "Pemasukan",
  pengeluaran: "Pengeluaran",
  hutang: "Hutang / Piutang",
  dokumen: "Dokumen",
};

function getDocColor(type: string) {
  if (type === "Kontrak") return "bg-rose-50 text-rose-600";
  if (type === "BAST") return "bg-blue-50 text-blue-600";
  if (type === "Invoice") return "bg-emerald-50 text-emerald-600";
  return "bg-slate-50 text-slate-600";
}

function statusBadge(status: string) {
  if (status === "Disetujui" || status === "Diterima")
    return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (status === "Menunggu")
    return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100";
  return "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200";
}

function jenisBadge(jenis: string) {
  if (jenis === "Piutang")
    return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700";
  return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700";
}

interface Props {
  id: string;
}

export default function ProjectDetailPage({ id }: Props) {
  const project = projectMap[id] || projectMap["PRJ-2026-0001"];
  const isAcProject = id === "PRJ-2026-0001";

  const [active, setActive] = useState("detail");

  const [pengajuanData, setPengajuanData] = useState(isAcProject ? initialPengajuan : []);
  const [pemasukanData, setPemasukanData] = useState(isAcProject ? initialPemasukan : []);
  const [pengeluaranData, setPengeluaranData] = useState(isAcProject ? initialPengeluaran : []);
  const [hutangData, setHutangData] = useState(isAcProject ? initialHutang : []);
  const [dokumenData, setDokumenData] = useState(isAcProject ? initialDokumen : []);

  const [modalType, setModalType] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const openModal = (type: string, defaults: Record<string, string>) => {
    setModalType(type);
    setForm(defaults);
  };

  const closeModal = () => {
    setModalType(null);
    setForm({});
  };

  const handleSubmit = () => {
    if (!modalType) return;
    switch (modalType) {
      case "pengajuan":
        setPengajuanData((prev) => [...prev, { no: form.no || "", tanggal: form.tanggal || "", keterangan: form.keterangan || "", total: form.total || "", status: form.status || "Menunggu" }]);
        break;
      case "pemasukan":
        setPemasukanData((prev) => [...prev, { tanggal: form.tanggal || "", keterangan: form.keterangan || "", jumlah: form.jumlah || "", status: form.status || "Menunggu" }]);
        break;
      case "pengeluaran":
        setPengeluaranData((prev) => [...prev, { tanggal: form.tanggal || "", keperluan: form.keperluan || "", vendor: form.vendor || "", jumlah: form.jumlah || "" }]);
        break;
      case "hutang":
        setHutangData((prev) => [...prev, { jenis: form.jenis || "Piutang", pihak: form.pihak || "", jumlah: form.jumlah || "", jatuhTempo: form.jatuhTempo || "", status: form.status || "Belum Dibayar" }]);
        break;
      case "dokumen":
        setDokumenData((prev) => [...prev, { name: form.name || "", type: form.type || "Kontrak", date: form.date || "" }]);
        break;
    }
    closeModal();
  };

  const formField = (label: string, key: string, type = "text", options?: string[]) => (
    <div key={key} className="mb-3">
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {options ? (
        <select
          value={form[key] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[key] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={label}
        />
      )}
    </div>
  );

  return (
    <SidebarLayout
      title="Detail Project"
      subtitle="Dashboard lengkap project — finansial, pengajuan, dokumen, dan progress."
      action={
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
      }
    >
      {/* Project Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/project" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
            <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span className="font-mono text-blue-700 font-bold tracking-wide">{id}</span>
            <span>|</span>
            <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" /> {project.customer}</span>
            <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" /> Kontrak: {project.contract}</span>
            <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" /> {project.period}</span>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-slate-400">No Penawaran: </span>
            <Link href={`/penawaran/${project.quotation}`} className="font-mono text-blue-600 hover:text-blue-700 hover:underline font-semibold">{project.quotation}</Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${
              active === t.id ? "bg-white text-blue-700 shadow-sm border border-slate-200 font-semibold" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {active === "detail" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Informasi Pekerjaan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><div className="text-xs text-slate-500 font-medium uppercase">Nama Pekerjaan</div><div className="font-semibold text-slate-900 mt-0.5">{project.name}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">Lokasi</div><div className="font-semibold text-slate-900 mt-0.5">{project.location}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">Customer</div><div className="font-semibold text-slate-900 mt-0.5">{project.customer}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">No Kontrak</div><div className="font-semibold text-slate-900 mt-0.5">{project.contract}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">Periode</div><div className="font-semibold text-slate-900 mt-0.5">{project.period}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">Marketing</div><div className="font-semibold text-slate-900 mt-0.5">{project.marketing}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">PIC Project</div><div className="font-semibold text-slate-900 mt-0.5">{project.pic}</div></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase">Status</div><div className="font-semibold text-emerald-700 mt-0.5">Aktif</div></div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Deskripsi Pekerjaan</div>
              <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Nilai Kontrak</div>
              <div className="text-2xl font-bold text-slate-900">Rp 1.200.000.000</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Pemasukan</div>
              <div className="text-2xl font-bold text-emerald-600">Rp 360.000.000</div>
              <div className="text-xs text-slate-400 mt-0.5">30% dari nilai kontrak</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Pengeluaran</div>
              <div className="text-2xl font-bold text-rose-600">Rp 840.000.000</div>
              <div className="text-xs text-slate-400 mt-0.5">70% dari nilai kontrak</div>
            </div>
          </div>
        </div>
      )}

      {active === "pengajuan" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Listing Pengajuan Barang & Jasa</h3>
            <button
              onClick={() => openModal("pengajuan", { no: "", tanggal: "", keterangan: "", total: "", status: "Menunggu" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200"><tr><th className="pb-3 font-medium">No PR</th><th className="pb-3 font-medium">Tanggal</th><th className="pb-3 font-medium">Keterangan</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {pengajuanData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono text-xs text-slate-600">{item.no}</td>
                  <td className="py-3 text-slate-600">{item.tanggal}</td>
                  <td className="py-3 font-medium text-slate-800">{item.keterangan}</td>
                  <td className="py-3 font-semibold">{item.total}</td>
                  <td className="py-3"><span className={statusBadge(item.status)}>{item.status}</span></td>
                </tr>
              ))}
              {pengajuanData.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-xs text-slate-400">Belum ada data pengajuan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {active === "pemasukan" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Listing Pemasukan</h3>
            <button
              onClick={() => openModal("pemasukan", { tanggal: "", keterangan: "", jumlah: "", status: "Menunggu" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200"><tr><th className="pb-3 font-medium">Tanggal</th><th className="pb-3 font-medium">Keterangan</th><th className="pb-3 font-medium">Jumlah</th><th className="pb-3 font-medium">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {pemasukanData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 text-slate-600">{item.tanggal}</td>
                  <td className="py-3 font-medium text-slate-800">{item.keterangan}</td>
                  <td className="py-3 font-semibold">{item.jumlah}</td>
                  <td className="py-3"><span className={statusBadge(item.status)}>{item.status}</span></td>
                </tr>
              ))}
              {pemasukanData.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-xs text-slate-400">Belum ada data pemasukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {active === "pengeluaran" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Listing Pengeluaran</h3>
            <button
              onClick={() => openModal("pengeluaran", { tanggal: "", keperluan: "", vendor: "", jumlah: "" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200"><tr><th className="pb-3 font-medium">Tanggal</th><th className="pb-3 font-medium">Keperluan</th><th className="pb-3 font-medium">Vendor</th><th className="pb-3 font-medium">Jumlah</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {pengeluaranData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 text-slate-600">{item.tanggal}</td>
                  <td className="py-3 font-medium text-slate-800">{item.keperluan}</td>
                  <td className="py-3 text-slate-700">{item.vendor}</td>
                  <td className="py-3 font-semibold">{item.jumlah}</td>
                </tr>
              ))}
              {pengeluaranData.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-xs text-slate-400">Belum ada data pengeluaran</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {active === "hutang" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Hutang / Piutang</h3>
            <button
              onClick={() => openModal("hutang", { jenis: "Piutang", pihak: "", jumlah: "", jatuhTempo: "", status: "Belum Dibayar" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200"><tr><th className="pb-3 font-medium">Jenis</th><th className="pb-3 font-medium">Pihak</th><th className="pb-3 font-medium">Jumlah</th><th className="pb-3 font-medium">Jatuh Tempo</th><th className="pb-3 font-medium">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {hutangData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3"><span className={jenisBadge(item.jenis)}>{item.jenis}</span></td>
                  <td className="py-3 font-medium text-slate-800">{item.pihak}</td>
                  <td className="py-3 font-semibold">{item.jumlah}</td>
                  <td className="py-3 text-slate-600">{item.jatuhTempo}</td>
                  <td className="py-3"><span className={statusBadge(item.status)}>{item.status}</span></td>
                </tr>
              ))}
              {hutangData.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-xs text-slate-400">Belum ada data hutang / piutang</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {active === "anggaran" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Anggaran vs Realisasi</h3>
          <div className="space-y-6 max-w-2xl">
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2"><span>Material & Jasa</span><span className="text-blue-600">72% tercapai</span></div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: "72%" }} /></div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5"><span>Anggaran: Rp 600.000.000</span><span>Realisasi: Rp 432.000.000</span></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2"><span>Biaya Operasional</span><span className="text-amber-600">45% tercapai</span></div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} /></div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5"><span>Anggaran: Rp 200.000.000</span><span>Realisasi: Rp 90.000.000</span></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2"><span>Pajak</span><span className="text-emerald-600">60% tercapai</span></div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }} /></div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5"><span>Anggaran: Rp 100.000.000</span><span>Realisasi: Rp 60.000.000</span></div>
            </div>
          </div>
        </div>
      )}

      {active === "dokumen" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Dokumen Arsip</h3>
            <button
              onClick={() => openModal("dokumen", { name: "", type: "Kontrak", date: "" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dokumenData.map((d, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition bg-white flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${getDocColor(d.type)} flex items-center justify-center`}><FileText className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.type} • {d.date}</div>
                </div>
                <button className="text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
              </div>
            ))}
            {dokumenData.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-slate-400">Belum ada dokumen</div>
            )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Tambah {modalLabels[modalType]}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {modalType === "pengajuan" && (
              <>
                {formField("No PR", "no")}
                {formField("Tanggal", "tanggal")}
                {formField("Keterangan", "keterangan")}
                {formField("Total", "total")}
                {formField("Status", "status", "text", ["Menunggu", "Disetujui", "Ditolak"])}
              </>
            )}

            {modalType === "pemasukan" && (
              <>
                {formField("Tanggal", "tanggal")}
                {formField("Keterangan", "keterangan")}
                {formField("Jumlah", "jumlah")}
                {formField("Status", "status", "text", ["Menunggu", "Diterima"])}
              </>
            )}

            {modalType === "pengeluaran" && (
              <>
                {formField("Tanggal", "tanggal")}
                {formField("Keperluan", "keperluan")}
                {formField("Vendor", "vendor")}
                {formField("Jumlah", "jumlah")}
              </>
            )}

            {modalType === "hutang" && (
              <>
                {formField("Jenis", "jenis", "text", ["Piutang", "Hutang"])}
                {formField("Pihak", "pihak")}
                {formField("Jumlah", "jumlah")}
                {formField("Jatuh Tempo", "jatuhTempo")}
                {formField("Status", "status", "text", ["Belum Dibayar", "Sudah Dibayar"])}
              </>
            )}

            {modalType === "dokumen" && (
              <>
                {formField("Nama File", "name")}
                {formField("Tipe", "type", "text", ["Kontrak", "BAST", "Invoice", "Lainnya"])}
                {formField("Tanggal", "date")}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload File</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium">Klik atau seret file ke sini</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (maks. 10MB)</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
