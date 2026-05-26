"use client";

import { useState, useMemo, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import FinanceFilterBar, { formatPeriodLabel } from "@/components/FinanceFilterBar";
import ExportButtons from "@/components/ExportButtons";
import { fmt, invoiceList as defaultInvoiceList, type InvoiceItem } from "@/lib/keuanganData";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import DatePicker from "@/components/DatePicker";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ChevronDown,
  X,
  CheckCircle2,
  Send,
  Ban,
  Download,
  Printer,
} from "lucide-react";

const STORAGE_KEY = "gac-invoice-kwitansi";

const statusBadge = (status: string) => {
  switch (status) {
    case "Dibayar":
    case "Lunas":
    case "Normal":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Terbit":
    case "Dikirim":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Draft":
      return "bg-slate-50 text-slate-600 border-slate-200";
    case "Belum Lunas":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Dibatalkan":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const statusFlow: Record<string, string[]> = {
  Draft: ["Terbit", "Dibatalkan"],
  Terbit: ["Dikirim", "Dibatalkan"],
  Dikirim: ["Dibayar", "Dibatalkan"],
  Dibayar: [],
  Dibatalkan: [],
};

function generateNo(tipe: "Invoice" | "Kwitansi", list: InvoiceItem[]) {
  const prefix = tipe === "Invoice" ? "INV" : "KW";
  const year = new Date().getFullYear();
  const existing = list.filter((i) => i.no.startsWith(`${prefix}-${year}`));
  const max = existing.reduce((m, i) => {
    const num = parseInt(i.no.split("-")[2] || "0", 10);
    return num > m ? num : m;
  }, 0);
  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`;
}

export default function InvoicePage() {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31", quick: "thisMonth" });
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [tipeFilter, setTipeFilter] = useState("Semua");
  const [customerSearch, setCustomerSearch] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return defaultInvoiceList;
  });

  const [customers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gac-customers");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [projects] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gac-projects");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<InvoiceItem>>({
    tipe: "Invoice",
    tanggal: new Date().toISOString().split("T")[0],
    jatuhTempo: "",
    customer: "",
    project: "",
    total: 0,
    status: "Draft",
  });

  const [detailItem, setDetailItem] = useState<InvoiceItem | null>(null);
  const [actionOpenId, setActionOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const subtitle = `Daftar invoice & kwitansi — ${formatPeriodLabel(period.from, period.to, period.quick)}`;

  const filtered = useMemo(() => {
    return items.filter((inv) => {
      if (inv.tanggal < period.from || inv.tanggal > period.to) return false;
      if (statusFilter !== "Semua" && inv.status !== statusFilter) return false;
      if (tipeFilter !== "Semua" && inv.tipe !== tipeFilter) return false;
      if (customerSearch && !inv.customer.toLowerCase().includes(customerSearch.toLowerCase())) return false;
      return true;
    });
  }, [items, period, statusFilter, tipeFilter, customerSearch]);

  const totalInvoice = filtered.filter((i) => i.tipe === "Invoice").reduce((s, i) => s + i.total, 0);
  const totalKwitansi = filtered.filter((i) => i.tipe === "Kwitansi").reduce((s, i) => s + i.total, 0);
  const totalBelumBayar = filtered
    .filter((i) => i.status !== "Dibayar" && i.status !== "Dibatalkan")
    .reduce((s, i) => s + i.total, 0);

  const openCreate = (tipe: "Invoice" | "Kwitansi") => {
    setEditingId(null);
    setForm({
      tipe,
      no: generateNo(tipe, items),
      tanggal: new Date().toISOString().split("T")[0],
      jatuhTempo: tipe === "Invoice" ? "" : "—",
      customer: "",
      project: "",
      total: 0,
      status: "Draft",
    });
    setShowModal(true);
  };

  const openEdit = (item: InvoiceItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowModal(true);
    setActionOpenId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.no || !form.customer || !form.total) return;
    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...(form as InvoiceItem) } : i)));
    } else {
      const newItem: InvoiceItem = {
        id: `INV-${Date.now()}`,
        no: form.no || generateNo(form.tipe as "Invoice" | "Kwitansi", items),
        tipe: (form.tipe as "Invoice" | "Kwitansi") || "Invoice",
        tanggal: form.tanggal || new Date().toISOString().split("T")[0],
        jatuhTempo: form.jatuhTempo || (form.tipe === "Invoice" ? "" : "—"),
        customer: form.customer || "",
        project: form.project || "",
        total: Number(form.total) || 0,
        status: (form.status as InvoiceItem["status"]) || "Draft",
      };
      setItems((prev) => [newItem, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDelete(null);
    setActionOpenId(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus as InvoiceItem["status"] } : i))
    );
    setActionOpenId(null);
  };

  const exportListPDF = () => {
    const headers = ["No", "Tipe", "Tanggal", "Jatuh Tempo", "Customer", "Project", "Total", "Status"];
    const rows = filtered.map((i) => [
      i.no,
      i.tipe,
      i.tanggal,
      i.jatuhTempo,
      i.customer,
      i.project,
      fmt(i.total),
      i.status,
    ]);
    exportToPDF("Daftar Invoice & Kwitansi", headers, rows, `Invoice-Kwitansi-${period.from}-${period.to}.pdf`);
  };

  const exportListExcel = () => {
    const headers = ["No", "Tipe", "Tanggal", "Jatuh Tempo", "Customer", "Project", "Total", "Status"];
    const rows = filtered.map((i) => [
      i.no,
      i.tipe,
      i.tanggal,
      i.jatuhTempo,
      i.customer,
      i.project,
      fmt(i.total),
      i.status,
    ]);
    exportToExcel("Daftar Invoice & Kwitansi", headers, rows, `Invoice-Kwitansi-${period.from}-${period.to}.xlsx`);
  };

  const printKwitansiPDF = async (item: InvoiceItem) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PT GEMILANG AGUNG CEMERLANG", 105, 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Jl. Sudirman No. 45, Jakarta Pusat", 105, 25, { align: "center" });
    doc.text("Telp: 0856-9466-2592", 105, 29, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("K W I T A N S I", 105, 45, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`No: ${item.no}`, 160, 55);

    autoTable(doc, {
      startY: 65,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ["Telah terima dari", `: ${item.customer}`],
        ["Uang sejumlah", `: ${fmt(item.total)}`],
        ["Terbilang", `: ${terbilang(item.total)} Rupiah`],
        ["Untuk pembayaran", `: ${item.project}`],
        ["Tanggal", `: ${new Date(item.tanggal).toLocaleDateString("id-ID")}`],
      ],
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
        1: { cellWidth: 130 },
      },
    });

    doc.text("Jakarta, " + new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), 160, 120, { align: "center" });
    doc.text("Yang menerima,", 160, 128, { align: "center" });
    doc.text("(_________________________)", 160, 148, { align: "center" });

    doc.save(`${item.no}.pdf`);
  };

  return (
    <SidebarLayout
      title="Invoice & Kwitansi"
      subtitle={subtitle}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreate("Invoice")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Invoice
          </button>
          <button
            onClick={() => openCreate("Kwitansi")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Kwitansi
          </button>
        </div>
      }
    >
      <FinanceFilterBar
        onChange={setPeriod}
        onExportPDF={exportListPDF}
        onExportExcel={exportListExcel}
        extraFilters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                <option>Draft</option>
                <option>Terbit</option>
                <option>Dikirim</option>
                <option>Dibayar</option>
                <option>Dibatalkan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipe</label>
              <select
                value={tipeFilter}
                onChange={(e) => setTipeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option>Semua</option>
                <option>Invoice</option>
                <option>Kwitansi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Customer</label>
              <input
                type="text"
                placeholder="Cari customer..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Invoice</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{fmt(totalInvoice)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Kwitansi</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{fmt(totalKwitansi)}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Belum Dibayar</div>
            <div className="text-xl font-bold text-amber-600 mt-1">{fmt(totalBelumBayar)}</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Daftar Invoice & Kwitansi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-medium">No</th>
                  <th className="pb-3 font-medium">Tipe</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Jatuh Tempo</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition group">
                    <td className="py-3 font-mono text-xs text-slate-600">{inv.no}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          inv.tipe === "Invoice" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {inv.tipe}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700 text-xs">{inv.tanggal}</td>
                    <td className="py-3 text-slate-700 text-xs">{inv.jatuhTempo}</td>
                    <td className="py-3 font-medium text-slate-800">{inv.customer}</td>
                    <td className="py-3 text-slate-600 text-xs max-w-xs truncate">{inv.project}</td>
                    <td className="py-3 text-right font-mono font-medium">{fmt(inv.total)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(inv.status)}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActionOpenId(actionOpenId === inv.id ? null : inv.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                        >
                          Aksi <ChevronDown className="w-3 h-3" />
                        </button>
                        {actionOpenId === inv.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                            <button
                              onClick={() => setDetailItem(inv)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5" /> Lihat Detail
                            </button>
                            <button
                              onClick={() => openEdit(inv)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            {statusFlow[inv.status]?.map((next) => (
                              <button
                                key={next}
                                onClick={() => handleStatusChange(inv.id, next)}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                {next === "Terbit" && <FileText className="w-3.5 h-3.5" />}
                                {next === "Dikirim" && <Send className="w-3.5 h-3.5" />}
                                {next === "Dibayar" && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {next === "Dibatalkan" && <Ban className="w-3.5 h-3.5" />}
                                Ubah ke {next}
                              </button>
                            ))}
                            {inv.tipe === "Kwitansi" && (
                              <button
                                onClick={() => printKwitansiPDF(inv)}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Printer className="w-3.5 h-3.5" /> Cetak Kwitansi PDF
                              </button>
                            )}
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => setConfirmDelete(inv.id)}
                              className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-slate-400">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? "Edit" : "Buat"} {form.tipe}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nomor</label>
                  <input
                    type="text"
                    value={form.no || ""}
                    onChange={(e) => setForm((f) => ({ ...f, no: e.target.value }))}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tipe</label>
                  <select
                    value={form.tipe}
                    onChange={(e) => {
                      const tipe = e.target.value as "Invoice" | "Kwitansi";
                      setForm((f) => ({
                        ...f,
                        tipe,
                        jatuhTempo: tipe === "Invoice" ? "" : "—",
                        no: generateNo(tipe, items),
                      }));
                    }}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="Kwitansi">Kwitansi</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal</label>
                  <DatePicker
                    value={form.tanggal || ""}
                    onChange={(d) => setForm((f) => ({ ...f, tanggal: d }))}
                  />
                </div>
                {form.tipe === "Invoice" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Jatuh Tempo</label>
                    <DatePicker
                      value={form.jatuhTempo === "—" ? "" : form.jatuhTempo || ""}
                      onChange={(d) => setForm((f) => ({ ...f, jatuhTempo: d }))}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Customer</label>
                <select
                  value={form.customer || ""}
                  onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Pilih customer...</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.nama}>{c.nama}</option>
                  ))}
                  {customers.length === 0 && (
                    <option value="" disabled>Belum ada data customer</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                <select
                  value={form.project || ""}
                  onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Pilih project...</option>
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.nama}>{p.nama}</option>
                  ))}
                  {projects.length === 0 && (
                    <option value="" disabled>Belum ada data project</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.total || ""}
                  onChange={(e) => setForm((f) => ({ ...f, total: Number(e.target.value) }))}
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {editingId && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as InvoiceItem["status"] }))}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Draft</option>
                    <option>Terbit</option>
                    <option>Dikirim</option>
                    <option>Dibayar</option>
                    <option>Dibatalkan</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {editingId ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Detail {detailItem.tipe}</h3>
              <button onClick={() => setDetailItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Nomor</div>
                  <div className="font-mono font-semibold">{detailItem.no}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Tipe</div>
                  <div className="font-semibold">{detailItem.tipe}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Tanggal</div>
                  <div>{detailItem.tanggal}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Jatuh Tempo</div>
                  <div>{detailItem.jatuhTempo}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Customer</div>
                  <div className="font-semibold">{detailItem.customer}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Project</div>
                  <div>{detailItem.project}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Total</div>
                  <div className="font-bold text-lg">{fmt(detailItem.total)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(detailItem.status)}`}
                  >
                    {detailItem.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              {detailItem.tipe === "Kwitansi" && (
                <button
                  onClick={() => printKwitansiPDF(detailItem)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Cetak Kwitansi PDF
                </button>
              )}
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Tutup
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Dokumen?</h3>
            <p className="text-sm text-slate-500 mb-5">Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

// Terbilang helper
function terbilang(n: number): string {
  const angka = [
    "", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan",
    "Sepuluh", "Sebelas",
  ];
  if (n < 12) return angka[n];
  if (n < 20) return terbilang(n - 10) + " Belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
  if (n < 200) return "Seratus " + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
  if (n < 2000) return "Seribu " + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
  if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " Miliar " + terbilang(n % 1000000000);
  return "Terlalu besar";
}
