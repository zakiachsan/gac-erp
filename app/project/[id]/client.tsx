"use client";

import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import DatePicker from "@/components/DatePicker";
import { ArrowLeft, Download, FileText, Plus, X, Upload, Printer } from "lucide-react";
import FileUpload from "@/components/FileUpload";
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
  anggaran: "Anggaran",
  dokumen: "Dokumen",
};

function parseRupiah(str: string): number {
  if (!str) return 0;
  return parseInt(str.replace(/[^0-9]/g, ""), 10) || 0;
}
function fmtRupiah(n: number): string {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);

  const [anggaranData, setAnggaranData] = useState([
    { kategori: "Material & Jasa", anggaran: 600000000, realisasi: 432000000, color: "blue" },
    { kategori: "Biaya Operasional", anggaran: 200000000, realisasi: 90000000, color: "amber" },
    { kategori: "Pajak", anggaran: 100000000, realisasi: 60000000, color: "emerald" },
  ]);

  const [customers] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gac-customers");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

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
        setDokumenData((prev) => [...prev, { name: form.name || "", type: form.type || "Kontrak", date: form.date || "", fileUrl: uploadedFile?.url || "" }]);
        setUploadedFile(null);
        break;
      case "anggaran":
        setAnggaranData((prev) =>
          prev.map((a) =>
            a.kategori === form.kategori
              ? { ...a, anggaran: parseInt(form.anggaran || "0", 10), realisasi: parseInt(form.realisasi || "0", 10) }
              : a
          )
        );
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

  const exportProjectPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    let y = 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`LAPORAN DETAIL PROJECT`, 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${project.name}`, 105, y, { align: "center" });
    y += 6;
    doc.text(`ID: ${id}  |  Customer: ${project.customer}  |  Kontrak: ${project.contract}`, 105, y, { align: "center" });
    y += 12;

    // Section: Informasi Pekerjaan
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("1. Informasi Pekerjaan", 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" } },
      body: [
        ["Nama Pekerjaan", project.name],
        ["Lokasi", project.location],
        ["Customer", project.customer],
        ["No Kontrak", project.contract],
        ["Periode", project.period],
        ["Marketing", project.marketing],
        ["PIC Project", project.pic],
        ["Deskripsi", project.description],
      ],
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Section: Anggaran
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("2. Anggaran vs Realisasi", 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [["Kategori", "Anggaran", "Realisasi", "Sisa", "%"]],
      body: anggaranData.map((a) => [
        a.kategori,
        fmtRupiah(a.anggaran),
        fmtRupiah(a.realisasi),
        fmtRupiah(a.anggaran - a.realisasi),
        `${a.anggaran > 0 ? Math.round((a.realisasi / a.anggaran) * 100) : 0}%`,
      ]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [22, 119, 255], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 248, 255] },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Section: Pengajuan
    if (pengajuanData.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("3. Listing Pengajuan", 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [["No PR", "Tanggal", "Keterangan", "Total", "Status"]],
        body: pengajuanData.map((i) => [i.no, i.tanggal, i.keterangan, i.total, i.status]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 255] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Section: Pemasukan
    if (pemasukanData.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("4. Listing Pemasukan", 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [["Tanggal", "Keterangan", "Jumlah", "Status"]],
        body: pemasukanData.map((i) => [i.tanggal, i.keterangan, i.jumlah, i.status]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 255] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Section: Pengeluaran
    if (pengeluaranData.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("5. Listing Pengeluaran", 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [["Tanggal", "Keperluan", "Vendor", "Jumlah"]],
        body: pengeluaranData.map((i) => [i.tanggal, i.keperluan, i.vendor, i.jumlah]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 255] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Section: Hutang/Piutang
    if (hutangData.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("6. Hutang / Piutang", 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [["Jenis", "Pihak", "Jumlah", "Jatuh Tempo", "Status"]],
        body: hutangData.map((i) => [i.jenis, i.pihak, i.jumlah, i.jatuhTempo, i.status]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 255] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Section: Dokumen
    if (dokumenData.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("7. Dokumen Arsip", 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [["Nama File", "Tipe", "Tanggal"]],
        body: dokumenData.map((i) => [i.name, i.type, i.date]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 119, 255], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 255] },
      });
    }

    doc.save(`Project-Report-${id}.pdf`);
  };

  return (
    <SidebarLayout
      title="Detail Project"
      subtitle="Dashboard lengkap project — finansial, pengajuan, dokumen, dan progress."
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={exportProjectPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Export Report PDF
          </button>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Aktif</span>
        </div>
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
            {(() => {
              const totalPemasukan = pemasukanData.reduce((s, i) => s + parseRupiah(i.jumlah), 0);
              const totalPengeluaran = pengeluaranData.reduce((s, i) => s + parseRupiah(i.jumlah), 0);
              const totalAnggaran = anggaranData.reduce((s, i) => s + i.anggaran, 0);
              return (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Anggaran</div>
                    <div className="text-2xl font-bold text-slate-900">{fmtRupiah(totalAnggaran)}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Pemasukan</div>
                    <div className="text-2xl font-bold text-emerald-600">{fmtRupiah(totalPemasukan)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{totalAnggaran > 0 ? Math.round((totalPemasukan / totalAnggaran) * 100) : 0}% dari anggaran</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">Total Pengeluaran</div>
                    <div className="text-2xl font-bold text-rose-600">{fmtRupiah(totalPengeluaran)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{totalAnggaran > 0 ? Math.round((totalPengeluaran / totalAnggaran) * 100) : 0}% dari anggaran</div>
                  </div>
                </>
              );
            })()}
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900">Anggaran vs Realisasi</h3>
            <button
              onClick={() => openModal("anggaran", { kategori: "", anggaran: "", realisasi: "" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Atur Anggaran
            </button>
          </div>
          <div className="space-y-6 max-w-2xl">
            {anggaranData.map((a) => {
              const pct = a.anggaran > 0 ? Math.min(100, Math.round((a.realisasi / a.anggaran) * 100)) : 0;
              const over = a.realisasi > a.anggaran;
              const color = a.color as "blue" | "amber" | "emerald";
              const barColor = over ? "bg-rose-500" : color === "blue" ? "bg-blue-500" : color === "amber" ? "bg-amber-500" : "bg-emerald-500";
              const textColor = over ? "text-rose-600" : color === "blue" ? "text-blue-600" : color === "amber" ? "text-amber-600" : "text-emerald-600";
              return (
                <div key={a.kategori}>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                    <span>{a.kategori}</span>
                    <span className={textColor}>{over ? `Overbudget ${fmtRupiah(a.realisasi - a.anggaran)}` : `${pct}% tercapai`}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${over ? 100 : pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                    <span>Anggaran: {fmtRupiah(a.anggaran)}</span>
                    <span>Realisasi: {fmtRupiah(a.realisasi)}</span>
                  </div>
                  {over && (
                    <div className="mt-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5">
                      ⚠️ Realisasi melebihi anggaran sebesar {fmtRupiah(a.realisasi - a.anggaran)}
                    </div>
                  )}
                </div>
              );
            })}
            {anggaranData.length === 0 && (
              <div className="text-center text-sm text-slate-400 py-6">Belum ada data anggaran</div>
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Ringkasan</h4>
            {(() => {
              const totalAnggaran = anggaranData.reduce((s, a) => s + a.anggaran, 0);
              const totalRealisasi = anggaranData.reduce((s, a) => s + a.realisasi, 0);
              const sisa = totalAnggaran - totalRealisasi;
              return (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Total Anggaran</div>
                    <div className="font-bold text-slate-900">{fmtRupiah(totalAnggaran)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Total Realisasi</div>
                    <div className="font-bold text-rose-600">{fmtRupiah(totalRealisasi)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Sisa</div>
                    <div className={`font-bold ${sisa < 0 ? "text-rose-600" : "text-emerald-600"}`}>{fmtRupiah(Math.abs(sisa))}</div>
                  </div>
                </div>
              );
            })()}
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
            {dokumenData.map((d: any, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition bg-white flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${getDocColor(d.type)} flex items-center justify-center`}><FileText className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.type} • {d.date}</div>
                </div>
                {d.fileUrl ? (
                  <a href={d.fileUrl} download={d.name} className="text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></a>
                ) : (
                  <button className="text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                )}
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
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal</label>
                  <DatePicker value={form.tanggal || ""} onChange={(d) => setForm((f) => ({ ...f, tanggal: d }))} />
                </div>
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
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal</label>
                  <DatePicker value={form.tanggal || ""} onChange={(d) => setForm((f) => ({ ...f, tanggal: d }))} />
                </div>
                {formField("Keperluan", "keperluan")}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Vendor</label>
                  <select
                    value={form.vendor || ""}
                    onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih vendor...</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.nama}>{c.nama}</option>
                    ))}
                    {customers.length === 0 && (
                      <option value="" disabled>Belum ada data customer</option>
                    )}
                  </select>
                </div>
                {formField("Jumlah", "jumlah")}
              </>
            )}

            {modalType === "hutang" && (
              <>
                {formField("Jenis", "jenis", "text", ["Piutang", "Hutang"])}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pihak</label>
                  <select
                    value={form.pihak || ""}
                    onChange={(e) => setForm((f) => ({ ...f, pihak: e.target.value }))}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih pihak...</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.nama}>{c.nama}</option>
                    ))}
                    {customers.length === 0 && (
                      <option value="" disabled>Belum ada data customer</option>
                    )}
                  </select>
                </div>
                {formField("Jumlah", "jumlah")}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Jatuh Tempo</label>
                  <DatePicker value={form.jatuhTempo || ""} onChange={(d) => setForm((f) => ({ ...f, jatuhTempo: d }))} />
                </div>
                {formField("Status", "status", "text", ["Belum Dibayar", "Sudah Dibayar"])}
              </>
            )}

            {modalType === "anggaran" && (
              <>
                {formField("Kategori", "kategori", "text", ["Material & Jasa", "Biaya Operasional", "Pajak"])}
                {formField("Anggaran (Rp)", "anggaran", "number")}
                {formField("Realisasi (Rp)", "realisasi", "number")}
              </>
            )}

            {modalType === "dokumen" && (
              <>
                {formField("Nama File", "name")}
                {formField("Tipe", "type", "text", ["Kontrak", "BAST", "Invoice", "Lainnya"])}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tanggal</label>
                  <DatePicker value={form.date || ""} onChange={(d) => setForm((f) => ({ ...f, date: d }))} />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload File</label>
                  <FileUpload
                    onChange={(file, url) => {
                      if (file) {
                        setUploadedFile({ url, name: file.name });
                        setForm((f) => ({ ...f, name: file.name }));
                      } else {
                        setUploadedFile(null);
                      }
                    }}
                  />
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
