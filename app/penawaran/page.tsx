"use client";

import { useState, useRef, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import DatePicker from "@/components/DatePicker";
import { useRole } from "@/context/RoleContext";
import { Plus, Search, X, Upload, CheckCircle, XCircle, RotateCcw, ArrowRight, Eye, Pencil, Trash2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";

type QuotationStatus = "Negosiasi" | "Menang" | "Tidak Menang";

interface StatusLog {
  date: string;
  time: string;
  from: QuotationStatus;
  to: QuotationStatus;
  by: string;
}

interface Quotation {
  no: string;
  tanggal?: string;
  namaPekerjaan: string;
  deskripsi: string;
  customer: string;
  loc: string;
  marketing: string;
  pic: string;
  periodeDari: string;
  periodeSampai: string;
  total: string;
  status: QuotationStatus;
  history: StatusLog[];
}

const initialData: Quotation[] = [
  { 
    no: "QT-2026-0020", 
    namaPekerjaan: "Pemasangan Pompa Industri",
    deskripsi: "Pemasangan dan commissioning pompa industri untuk kebutuhan pabrik PT Sejahtera Abadi.",
    customer: "PT Sejahtera Abadi", 
    loc: "Jakarta Selatan", 
    marketing: "Budi Santoso",
    pic: "Dewi Kusuma",
    periodeDari: "2026-04-15",
    periodeSampai: "2026-06-15",
    total: "Rp 450.000.000", 
    status: "Negosiasi",
    history: [
      { date: "05 Mei 2026", time: "10:30", from: "Negosiasi", to: "Negosiasi", by: "Budi Santoso" },
    ]
  },
  { 
    no: "QT-2026-0019", 
    namaPekerjaan: "Pengadaan & Pemasangan AC Kantor Pusat",
    deskripsi: "Pengadaan dan pemasangan 10 unit AC Split 2 PK beserta instalasi pipa dan wiring untuk kantor pusat PT Maju Jaya. Termasuk pekerjaan ducting, drainase, dan commissioning.",
    customer: "PT Maju Jaya", 
    loc: "Jakarta Pusat", 
    marketing: "Siti Aminah",
    pic: "Andi Wijaya",
    periodeDari: "2026-04-10",
    periodeSampai: "2026-06-10",
    total: "Rp 1.200.000.000", 
    status: "Menang",
    history: [
      { date: "04 Mei 2026", time: "14:20", from: "Negosiasi", to: "Menang", by: "Siti Aminah" },
      { date: "02 Mei 2026", time: "11:00", from: "Negosiasi", to: "Negosiasi", by: "Siti Aminah" },
    ]
  },
  { 
    no: "QT-2026-0018", 
    namaPekerjaan: "Renovasi Furniture Kantor",
    deskripsi: "Renovasi dan penggantian furniture kantor untuk CV Karya Mandiri.",
    customer: "CV Karya Mandiri", 
    loc: "Tangerang", 
    marketing: "Budi Santoso",
    pic: "Ahmad Fauzi",
    periodeDari: "2026-05-01",
    periodeSampai: "2026-05-30",
    total: "Rp 85.000.000", 
    status: "Tidak Menang",
    history: [
      { date: "03 Mei 2026", time: "16:00", from: "Negosiasi", to: "Tidak Menang", by: "Budi Santoso" },
      { date: "02 Mei 2026", time: "13:30", from: "Negosiasi", to: "Negosiasi", by: "Budi Santoso" },
    ]
  },
  { 
    no: "QT-2026-0017", 
    namaPekerjaan: "Pengadaan Genset 500 KVA",
    deskripsi: "Pengadaan dan instalasi genset 500 KVA untuk backup power PT Delta Prima.",
    customer: "PT Delta Prima", 
    loc: "Bandung", 
    marketing: "Andi Wijaya",
    pic: "Rizal",
    periodeDari: "2026-05-10",
    periodeSampai: "2026-07-10",
    total: "Rp 320.000.000", 
    status: "Negosiasi",
    history: [
      { date: "05 Mei 2026", time: "09:00", from: "Negosiasi", to: "Negosiasi", by: "Andi Wijaya" },
    ]
  },
];

const statusConfig: Record<QuotationStatus, string> = {
  Negosiasi: "bg-amber-50 text-amber-700 border-amber-100",
  Menang: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Tidak Menang": "bg-rose-50 text-rose-700 border-rose-100",
};

const statusDot: Record<QuotationStatus, string> = {
  Negosiasi: "bg-amber-500",
  Menang: "bg-emerald-500",
  "Tidak Menang": "bg-rose-500",
};

function addToProject(q: Quotation) {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(localStorage.getItem("gac-projects") || "[]");
  if (existing.find((p: any) => p.noPenawaran === q.no)) return;
  const count = existing.length + 4;
  const nextId = `PRJ-2026-${String(count).padStart(4, "0")}`;
  const formatDateID = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };
  const newProject = {
    id: nextId,
    noPenawaran: q.no,
    nama: q.namaPekerjaan || `Project ${q.customer}`,
    customer: q.customer,
    nilai: q.total,
    kontrak: "",
    status: "Aktif",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    description: q.deskripsi || "",
    location: q.loc || "",
    marketing: q.marketing || "",
    pic: q.pic || "",
    period: q.periodeDari && q.periodeSampai ? `${formatDateID(q.periodeDari)} — ${formatDateID(q.periodeSampai)}` : "",
  };
  localStorage.setItem("gac-projects", JSON.stringify([...existing, newProject]));
}

export default function PenawaranPage() {
  const { role } = useRole();
  const isStaff = role === "staff";
  const currentStaffName = "Rizal";

  const [open, setOpen] = useState(false);
  const [addCustomer, setAddCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ nama: "", alamat: "", contact: "", email: "", vms: "" });
  const [customers, setCustomers] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gac-customers");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [data, setData] = useState<Quotation[]>(initialData);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const [historyModal, setHistoryModal] = useState<{ open: boolean; item: Quotation | null }>({ open: false, item: null });

  const [editingNo, setEditingNo] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const [form, setForm] = useState<Partial<Quotation>>({
    no: "",
    namaPekerjaan: "",
    deskripsi: "",
    customer: "",
    loc: "",
    marketing: "",
    pic: "",
    periodeDari: "",
    periodeSampai: "",
    total: "",
    status: "Negosiasi",
    history: [],
  });

  const openCreate = () => {
    const nextNo = `QT-2026-${String(data.length + 19).padStart(4, "0")}`;
    setEditingNo(null);
    setForm({
      no: nextNo,
      namaPekerjaan: "",
      deskripsi: "",
      customer: "",
      loc: "",
      marketing: isStaff ? currentStaffName : "Budi Santoso",
      pic: "Andi Wijaya",
      periodeDari: "",
      periodeSampai: "",
      total: "",
      status: "Negosiasi",
      history: [],
    });
    setOpen(true);
  };

  const openEdit = (q: Quotation) => {
    setEditingNo(q.no);
    setForm({ ...q });
    setOpen(true);
    setMenuOpen(null);
  };

  const handleSave = () => {
    if (!form.no || !form.customer || !form.namaPekerjaan) return;
    if (editingNo) {
      setData((prev) =>
        prev.map((q) =>
          q.no === editingNo
            ? { ...q, ...(form as Quotation) }
            : q
        )
      );
    } else {
      const newQ: Quotation = {
        ...(form as Quotation),
        history: [],
      };
      setData((prev) => [newQ, ...prev]);
    }
    setOpen(false);
    setEditingNo(null);
  };

  const handleDelete = (no: string) => {
    setData((prev) => prev.filter((q) => q.no !== no));
    setConfirmDelete(null);
    setMenuOpen(null);
  };

  const setStatus = (no: string, newStatus: QuotationStatus) => {
    setData((prev) =>
      prev.map((q) => {
        if (q.no !== no) return q;
        if (q.status === newStatus) return q;
        const now = new Date();
        const date = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
        const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
        const log: StatusLog = {
          date,
          time,
          from: q.status,
          to: newStatus,
          by: q.marketing,
        };
        const updated = { ...q, status: newStatus, history: [log, ...q.history] };
        if (newStatus === "Menang") {
          addToProject(updated);
        }
        return updated;
      })
    );
    setMenuOpen(null);
  };

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, no: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 176;
    const x = Math.max(8, rect.right - menuWidth);
    const y = rect.bottom + 4;
    setMenuPos({ x, y });
    setMenuOpen(no);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  return (
    <SidebarLayout
      title="Manajemen Penawaran"
      subtitle="Kelola quotation, negosiasi, dan closing penawaran."
      action={
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Buat Penawaran
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari nomor, customer, atau marketing..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Semua Status</option>
          <option>Negosiasi</option>
          <option>Menang</option>
          <option>Tidak Menang</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">No Penawaran</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Marketing</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3">
                    <Link href={`/penawaran/${row.no}`} className="font-mono text-sm text-blue-700 hover:text-blue-800 hover:underline font-bold tracking-wide">
                      {row.no}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{row.customer}</div>
                    <div className="text-xs text-slate-500">{row.loc}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-700">{row.marketing}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{row.total}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setHistoryModal({ open: true, item: row })}
                      className="flex flex-col gap-0.5 items-start text-left"
                    >
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[row.status]}`}>
                        {row.status}
                        <Eye className="w-3 h-3 ml-1 opacity-60" />
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={(e) => openMenu(e, row.no)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {data.length} dari 24 data</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>←</button>
            <button className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">1</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">2</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">3</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">→</button>
          </div>
        </div>
      </div>

      {/* Fixed Position Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-[100] w-44 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          <button onClick={() => { const q = data.find((x) => x.no === menuOpen); if (q) openEdit(q); }} className="w-full text-left px-3 py-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition">
            <Pencil className="w-3.5 h-3.5" /> Edit Penawaran
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button onClick={() => setStatus(menuOpen, "Menang")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition">
            <CheckCircle className="w-3.5 h-3.5" /> Menang
          </button>
          <button onClick={() => setStatus(menuOpen, "Tidak Menang")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition">
            <XCircle className="w-3.5 h-3.5" /> Tidak Menang
          </button>
          <button onClick={() => setStatus(menuOpen, "Negosiasi")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition">
            <RotateCcw className="w-3.5 h-3.5" /> Negosiasi
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button onClick={() => setConfirmDelete(menuOpen)} className="w-full text-left px-3 py-2.5 text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition">
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}

      {/* History Modal */}
      {historyModal.open && historyModal.item && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Riwayat Status</h3>
                <p className="text-xs text-slate-500">{historyModal.item.no}</p>
              </div>
              <button onClick={() => setHistoryModal({ open: false, item: null })} className="text-slate-400 hover:text-slate-600 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              {historyModal.item.history.length === 0 ? (
                <div className="text-center text-sm text-slate-400">Belum ada riwayat perubahan</div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200" />
                  {historyModal.item.history.map((log, idx) => (
                    <div key={idx} className="relative flex gap-3 mb-4 last:mb-0">
                      <div className={`relative z-10 w-3 h-3 mt-1 rounded-full border-2 border-white shadow-sm ${statusDot[log.to]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusConfig[log.from]}`}>
                            {log.from}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusConfig[log.to]}`}>
                            {log.to}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {log.date} · {log.time}
                        </div>
                        <div className="text-xs text-slate-400">
                          oleh <span className="font-medium text-slate-600">{log.by}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setHistoryModal({ open: false, item: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Penawaran */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-base font-bold text-slate-900">{editingNo ? "Edit" : "Buat"} Penawaran</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Penawaran</label>
                  <input type="text" value={form.no} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal</label>
                  <DatePicker value={form.tanggal} onChange={(d) => setForm((f) => ({ ...f, tanggal: d }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Pekerjaan / Judul</label>
                  <input type="text" placeholder="Contoh: Pengadaan & Pemasangan AC Kantor Pusat" value={form.namaPekerjaan || ""} onChange={(e) => setForm((f) => ({ ...f, namaPekerjaan: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Pekerjaan</label>
                  <textarea placeholder="Jelaskan scope pekerjaan secara detail..." rows={3} value={form.deskripsi || ""} onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer</label>
                  <select
                    value={form.customer || ""}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value === "add-new") {
                        setAddCustomer(true);
                        return;
                      }
                      setForm((f) => ({ ...f, customer: e.target.value }));
                    }}
                  >
                    <option value="">Pilih customer...</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.nama}>{c.nama}</option>
                    ))}
                    {customers.length === 0 && (
                      <option value="" disabled>Belum ada data customer</option>
                    )}
                    <option value="add-new" className="font-semibold text-blue-600">+ Tambah Customer Baru</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi</label>
                  <input type="text" placeholder="Contoh: Jakarta Pusat" value={form.loc || ""} onChange={(e) => setForm((f) => ({ ...f, loc: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Marketing / Sales</label>
                  {isStaff ? (
                    <input
                      type="text"
                      value={form.marketing || currentStaffName}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
                    />
                  ) : (
                    <select value={form.marketing || "Budi Santoso"} onChange={(e) => setForm((f) => ({ ...f, marketing: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Budi Santoso</option>
                      <option>Siti Aminah</option>
                      <option>Andi Wijaya</option>
                      <option>Rizal</option>
                      <option>Dewi Lestari</option>
                      <option>Ahmad Fauzi</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">PIC Project</label>
                  <select value={form.pic || "Andi Wijaya"} onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Andi Wijaya</option>
                    <option>Budi Santoso</option>
                    <option>Dewi Kusuma</option>
                    <option>Rizal</option>
                    <option>Ahmad Fauzi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Periode Dari</label>
                  <DatePicker value={form.periodeDari} onChange={(d) => setForm((f) => ({ ...f, periodeDari: d }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Periode Sampai</label>
                  <DatePicker value={form.periodeSampai} onChange={(d) => setForm((f) => ({ ...f, periodeSampai: d }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload Lampiran</label>
                <FileUpload
                  onChange={(file, url) => {
                    if (file) setUploadedFile({ url, name: file.name });
                    else setUploadedFile(null);
                  }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">Item Penawaran</label>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">+ Tambah Item</button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                      <tr><th className="px-4 py-2 text-left font-medium">Nama Barang / Jasa</th><th className="px-4 py-2 text-left font-medium w-24">Qty</th><th className="px-4 py-2 text-left font-medium w-40">Harga Satuan</th><th className="px-4 py-2 text-left font-medium w-40">Total</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-2"><input placeholder="Nama item..." className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500" /></td>
                        <td className="px-4 py-2"><input type="number" defaultValue={1} className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500" /></td>
                        <td className="px-4 py-2"><input type="text" placeholder="0" className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500" /></td>
                        <td className="px-4 py-2 text-slate-500">Rp 0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Simpan Draft</button>
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Ajukan Penawaran</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Penawaran?</h3>
            <p className="text-sm text-slate-500 mb-5">Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Customer */}
      {addCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setAddCustomer(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Tambah Customer Baru</h2>
              <button onClick={() => setAddCustomer(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Customer</label>
                <input type="text" placeholder="Contoh: PT Maju Jaya" value={newCustomerForm.nama} onChange={(e) => setNewCustomerForm((f) => ({ ...f, nama: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat</label>
                <textarea placeholder="Alamat lengkap..." rows={2} value={newCustomerForm.alamat} onChange={(e) => setNewCustomerForm((f) => ({ ...f, alamat: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Person</label>
                  <input type="text" placeholder="Nama contact person" value={newCustomerForm.contact} onChange={(e) => setNewCustomerForm((f) => ({ ...f, contact: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" placeholder="email@customer.co.id" value={newCustomerForm.email} onChange={(e) => setNewCustomerForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">VMS Link (Web Rekanan)</label>
                <input type="url" placeholder="https://..." value={newCustomerForm.vms} onChange={(e) => setNewCustomerForm((f) => ({ ...f, vms: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setAddCustomer(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={() => {
                if (!newCustomerForm.nama.trim()) return;
                const newId = "CUST-" + Date.now().toString().slice(-4);
                const entry = {
                  id: newId,
                  nama: newCustomerForm.nama.trim(),
                  alamat: newCustomerForm.alamat.trim(),
                  contact: newCustomerForm.contact.trim(),
                  email: newCustomerForm.email.trim(),
                  vms: newCustomerForm.vms.trim(),
                  totalProject: 0,
                  totalNilai: "Rp 0",
                  status: "Aktif",
                };
                const updated = [...customers, entry];
                setCustomers(updated);
                localStorage.setItem("gac-customers", JSON.stringify(updated));
                setForm((f) => ({ ...f, customer: entry.nama }));
                setNewCustomerForm({ nama: "", alamat: "", contact: "", email: "", vms: "" });
                setAddCustomer(false);
              }} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Simpan Customer</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
