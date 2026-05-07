"use client";

import { useState, useRef, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { useRole } from "@/context/RoleContext";
import { Plus, Search, X, Upload, CheckCircle, XCircle, RotateCcw, History, ArrowRight } from "lucide-react";
import Link from "next/link";

type QuotationStatus = "Submit" | "Negosiasi" | "Menang" | "Tidak Menang";

interface StatusLog {
  date: string;
  time: string;
  from: QuotationStatus;
  to: QuotationStatus;
  by: string;
}

interface Quotation {
  no: string;
  customer: string;
  loc: string;
  marketing: string;
  total: string;
  status: QuotationStatus;
  history: StatusLog[];
}

const initialData: Quotation[] = [
  { 
    no: "QT-2026-0020", 
    customer: "PT Sejahtera Abadi", 
    loc: "Jakarta Selatan", 
    marketing: "Budi Santoso", 
    total: "Rp 450.000.000", 
    status: "Negosiasi",
    history: [
      { date: "05 Mei 2026", time: "10:30", from: "Submit", to: "Negosiasi", by: "Budi Santoso" },
      { date: "03 Mei 2026", time: "09:15", from: "Submit", to: "Submit", by: "Budi Santoso" },
    ]
  },
  { 
    no: "QT-2026-0019", 
    customer: "PT Maju Jaya", 
    loc: "Jakarta Pusat", 
    marketing: "Siti Aminah", 
    total: "Rp 1.200.000.000", 
    status: "Menang",
    history: [
      { date: "04 Mei 2026", time: "14:20", from: "Negosiasi", to: "Menang", by: "Siti Aminah" },
      { date: "02 Mei 2026", time: "11:00", from: "Submit", to: "Negosiasi", by: "Siti Aminah" },
      { date: "01 Mei 2026", time: "08:45", from: "Submit", to: "Submit", by: "Siti Aminah" },
    ]
  },
  { 
    no: "QT-2026-0018", 
    customer: "CV Karya Mandiri", 
    loc: "Tangerang", 
    marketing: "Budi Santoso", 
    total: "Rp 85.000.000", 
    status: "Tidak Menang",
    history: [
      { date: "03 Mei 2026", time: "16:00", from: "Negosiasi", to: "Tidak Menang", by: "Budi Santoso" },
      { date: "02 Mei 2026", time: "13:30", from: "Submit", to: "Negosiasi", by: "Budi Santoso" },
    ]
  },
  { 
    no: "QT-2026-0017", 
    customer: "PT Delta Prima", 
    loc: "Bandung", 
    marketing: "Andi Wijaya", 
    total: "Rp 320.000.000", 
    status: "Submit",
    history: [
      { date: "05 Mei 2026", time: "09:00", from: "Submit", to: "Submit", by: "Andi Wijaya" },
    ]
  },
];

const statusConfig: Record<QuotationStatus, string> = {
  Submit: "bg-blue-50 text-blue-700 border-blue-100",
  Negosiasi: "bg-amber-50 text-amber-700 border-amber-100",
  Menang: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Tidak Menang": "bg-rose-50 text-rose-700 border-rose-100",
};

const statusDot: Record<QuotationStatus, string> = {
  Submit: "bg-blue-500",
  Negosiasi: "bg-amber-500",
  Menang: "bg-emerald-500",
  "Tidak Menang": "bg-rose-500",
};

export default function PenawaranPage() {
  const { role } = useRole();
  const isStaff = role === "staff";
  const currentStaffName = "Rizal";

  const [open, setOpen] = useState(false);
  const [addCustomer, setAddCustomer] = useState(false);
  const [data, setData] = useState<Quotation[]>(initialData);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const [historyOpen, setHistoryOpen] = useState<string | null>(null);
  const [historyPos, setHistoryPos] = useState({ x: 0, y: 0 });
  const historyRef = useRef<HTMLDivElement>(null);

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
        return { ...q, status: newStatus, history: [log, ...q.history] };
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

  const openHistory = (e: React.MouseEvent<HTMLButtonElement>, no: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const panelWidth = 320;
    const x = Math.max(8, rect.right - panelWidth);
    const y = rect.bottom + 4;
    setHistoryPos({ x, y });
    setHistoryOpen(no);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(null);
      }
    };
    if (menuOpen || historyOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen, historyOpen]);

  const selectedHistory = data.find((q) => q.no === historyOpen)?.history ?? [];

  return (
    <SidebarLayout
      title="Manajemen Penawaran"
      subtitle="Kelola quotation, negosiasi, dan closing penawaran."
      action={
        <button
          onClick={() => setOpen(true)}
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
          <option>Submit</option>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={(e) => openHistory(e, row.no)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Riwayat Perubahan Status"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => openMenu(e, row.no)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                      >
                        Pilih
                      </button>
                    </div>
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
          <button onClick={() => setStatus(menuOpen, "Menang")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition">
            <CheckCircle className="w-3.5 h-3.5" /> Menang
          </button>
          <button onClick={() => setStatus(menuOpen, "Tidak Menang")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition">
            <XCircle className="w-3.5 h-3.5" /> Tidak Menang
          </button>
          <button onClick={() => setStatus(menuOpen, "Negosiasi")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition">
            <RotateCcw className="w-3.5 h-3.5" /> Negosiasi
          </button>
          <button onClick={() => setStatus(menuOpen, "Submit")} className="w-full text-left px-3 py-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition">
            <RotateCcw className="w-3.5 h-3.5" /> Submit
          </button>
        </div>
      )}

      {/* Fixed Position History Panel */}
      {historyOpen && (
        <div
          ref={historyRef}
          className="fixed z-[100] w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
          style={{ left: historyPos.x, top: historyPos.y }}
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Riwayat Status</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{historyOpen}</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {selectedHistory.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Belum ada riwayat perubahan</div>
            ) : (
              <div className="relative px-4 py-3">
                {/* Timeline line */}
                <div className="absolute left-[27px] top-3 bottom-3 w-px bg-slate-200" />
                {selectedHistory.map((log, idx) => (
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
        </div>
      )}

      {/* Modal Create Penawaran */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-base font-bold text-slate-900">Buat Penawaran Baru</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Penawaran</label>
                  <input type="text" defaultValue="QT-2026-0021" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal</label>
                  <input type="date" defaultValue="2026-05-05" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value === "add-new") {
                        (e.target as HTMLSelectElement).value = "";
                        setAddCustomer(true);
                      }
                    }}
                  >
                    <option value="">Pilih customer...</option>
                    <option>PT Sejahtera Abadi</option>
                    <option>PT Maju Jaya</option>
                    <option>CV Karya Mandiri</option>
                    <option value="add-new" className="font-semibold text-blue-600">+ Tambah Customer Baru</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Marketing / Sales</label>
                  {isStaff ? (
                    <input
                      type="text"
                      value={currentStaffName}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
                    />
                  ) : (
                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Budi Santoso</option>
                      <option>Siti Aminah</option>
                      <option>Andi Wijaya</option>
                      <option>Rizal</option>
                      <option>Dewi Lestari</option>
                      <option>Ahmad Fauzi</option>
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload Lampiran</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Klik atau seret file ke sini</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (maks. 10MB)</p>
                </div>
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
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Submit Penawaran</button>
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
                <input type="text" placeholder="Contoh: PT Maju Jaya" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat</label>
                <textarea placeholder="Alamat lengkap..." rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Person</label>
                  <input type="text" placeholder="Nama contact person" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" placeholder="email@customer.co.id" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">VMS Link (Web Rekanan)</label>
                <input type="url" placeholder="https://..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setAddCustomer(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button onClick={() => setAddCustomer(false)} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition">Simpan Customer</button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
