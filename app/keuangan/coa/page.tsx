"use client";

import { useState, useMemo, useCallback } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import {
  fmt,
  coaList,
  coaCategories,
  buildCoaTree,
  type CoaItem,
  type CoaCategory,
  type CoaTreeNode,
} from "@/lib/keuanganData";
import {
  Search,
  Archive,
  Plus,
  X,
  CircleDollarSign,
  Landmark,
  Scale,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Truck,
  Briefcase,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileText,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "Aset Lancar": Wallet,
  "Aset Tetap": Package,
  "Akumulasi Penyusutan": Scale,
  "Hutang Jangka Pendek": Truck,
  "Hutang Jangka Panjang": Landmark,
  "Ekuitas": Briefcase,
  "Pendapatan": TrendingUp,
  "COGS": TrendingDown,
  "Beban Operasional": CircleDollarSign,
  "Pendapatan Lain": TrendingUp,
  "Beban Lain": TrendingDown,
  "Pajak": Scale,
};

const categoryColors: Record<string, string> = {
  "Aset Lancar": "bg-blue-50 text-blue-700 border-blue-200",
  "Aset Tetap": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Akumulasi Penyusutan": "bg-slate-50 text-slate-700 border-slate-200",
  "Hutang Jangka Pendek": "bg-amber-50 text-amber-700 border-amber-200",
  "Hutang Jangka Panjang": "bg-orange-50 text-orange-700 border-orange-200",
  "Ekuitas": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pendapatan": "bg-teal-50 text-teal-700 border-teal-200",
  "COGS": "bg-rose-50 text-rose-700 border-rose-200",
  "Beban Operasional": "bg-red-50 text-red-700 border-red-200",
  "Pendapatan Lain": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Beban Lain": "bg-pink-50 text-pink-700 border-pink-200",
  "Pajak": "bg-violet-50 text-violet-700 border-violet-200",
};

export default function CoaPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<"Semua" | CoaCategory>("Semua");
  const [showArsip, setShowArsip] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    kategori: coaCategories[0],
    tipe: "Debit" as "Debit" | "Kredit",
    saldoAwal: "",
  });
  const [accounts, setAccounts] = useState<CoaItem[]>(coaList);

  // Build tree from accounts (with search/kategori filter applied)
  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      if (!showArsip && a.status === "Arsip") return false;
      if (kategoriFilter !== "Semua" && a.kategori !== kategoriFilter) return false;
      if (
        search &&
        !a.kode.toLowerCase().includes(search.toLowerCase()) &&
        !a.nama.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [accounts, search, kategoriFilter, showArsip]);

  const tree = useMemo(() => buildCoaTree(filteredAccounts), [filteredAccounts]);

  // Summary from ALL accounts (not filtered) so totals remain accurate
  const summary = useMemo(() => {
    const map: Record<string, { count: number; saldo: number }> = {};
    coaCategories.forEach((c) => (map[c] = { count: 0, saldo: 0 }));
    accounts.forEach((a) => {
      if (!showArsip && a.status === "Arsip") return;
      map[a.kategori].count += 1;
      map[a.kategori].saldo += a.saldoAkhir;
    });
    return map;
  }, [accounts, showArsip]);

  const toggleExpand = useCallback((kode: string) => {
    setExpanded((prev) => ({ ...prev, [kode]: !prev[kode] }));
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    const walk = (nodes: CoaTreeNode[]) => {
      nodes.forEach((n) => {
        all[n.kode] = true;
        if (n.children) walk(n.children);
      });
    };
    walk(tree);
    setExpanded(all);
  }, [tree]);

  const collapseAll = useCallback(() => {
    setExpanded({});
  }, []);

  const addAccount = () => {
    if (!form.kode || !form.nama) return;
    const newAccount: CoaItem = {
      kode: form.kode,
      nama: form.nama,
      kategori: form.kategori as CoaCategory,
      tipe: form.tipe,
      saldoAwal: Number(form.saldoAwal.replace(/\D/g, "")) || 0,
      saldoAkhir: Number(form.saldoAwal.replace(/\D/g, "")) || 0,
      status: "Aktif",
    };
    setAccounts((prev) => [...prev, newAccount]);
    setModalOpen(false);
    setForm({ kode: "", nama: "", kategori: coaCategories[0], tipe: "Debit", saldoAwal: "" });
  };

  const toggleStatus = (kode: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.kode === kode ? { ...a, status: a.status === "Aktif" ? "Arsip" : "Aktif" } : a))
    );
  };

  return (
    <SidebarLayout
      title="Chart of Accounts"
      subtitle="Daftar akun perkiraan — tampilan tree structure (expandable)"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <FolderOpen className="w-3.5 h-3.5" /> Buka Semua
          </button>
          <button
            onClick={collapseAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <ChevronRight className="w-3.5 h-3.5" /> Tutup Semua
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Akun
          </button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {coaCategories.map((cat) => {
          const Icon = categoryIcons[cat] || Wallet;
          const s = summary[cat];
          if (s.count === 0) return null;
          return (
            <div
              key={cat}
              className={`bg-white rounded-xl border border-slate-200 shadow-sm p-3 cursor-pointer hover:border-blue-300 transition ${
                kategoriFilter === cat ? "ring-2 ring-blue-500 border-blue-500" : ""
              }`}
              onClick={() => setKategoriFilter(kategoriFilter === cat ? "Semua" : cat)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">{cat}</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {s.count} <span className="text-xs font-normal text-slate-400">akun</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{fmt(s.saldo)}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Cari Akun</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Kode atau nama akun..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value as any)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]"
            >
              <option value="Semua">Semua Kategori</option>
              {coaCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pb-1">
            <input
              type="checkbox"
              checked={showArsip}
              onChange={(e) => setShowArsip(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Archive className="w-3.5 h-3.5" /> Tampilkan Arsip
          </label>
        </div>
      </div>

      {/* Tree Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium w-1/2">Nama Akun</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium text-right">Saldo Awal</th>
                <th className="px-4 py-3 font-medium text-right">Saldo Akhir</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tree.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                    Tidak ada data akun
                  </td>
                </tr>
              )}
              {tree.map((node) => (
                <TreeRow
                  key={node.kode}
                  node={node}
                  depth={0}
                  expanded={expanded}
                  onToggle={toggleExpand}
                  onToggleStatus={toggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Akun */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Tambah Akun Baru</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kode Akun</label>
                  <input
                    type="text"
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    placeholder="Contoh: 6110"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipe</label>
                  <select
                    value={form.tipe}
                    onChange={(e) => setForm({ ...form, tipe: e.target.value as "Debit" | "Kredit" })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Debit">Debit</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Akun</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Gaji & Tunjangan"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value as CoaCategory })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {coaCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Saldo Awal</label>
                  <input
                    type="text"
                    value={form.saldoAwal}
                    onChange={(e) => setForm({ ...form, saldoAwal: e.target.value })}
                    placeholder="Rp 0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={addAccount}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

/* ───────────── Recursive Tree Row ───────────── */
function TreeRow({
  node,
  depth,
  expanded,
  onToggle,
  onToggleStatus,
}: {
  node: CoaTreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (kode: string) => void;
  onToggleStatus: (kode: string) => void;
}) {
  const isExpanded = !!expanded[node.kode];
  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 24;

  return (
    <>
      <tr className={`hover:bg-slate-50 transition ${node.status === "Arsip" ? "opacity-50" : ""}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: indent }}>
            {hasChildren ? (
              <button
                onClick={() => onToggle(node.kode)}
                className="p-0.5 rounded hover:bg-slate-200 text-slate-500 transition"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            {hasChildren ? (
              <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
            )}
            <div>
              <div className={`${node.isGroup ? "font-bold text-slate-900" : "font-medium text-slate-800"}`}>
                {node.nama}
              </div>
              <div className="text-[10px] font-mono text-slate-400">{node.kode}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
              categoryColors[node.kategori] || "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {node.kategori}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs font-medium ${node.tipe === "Debit" ? "text-blue-600" : "text-emerald-600"}`}>
            {node.tipe}
          </span>
        </td>
        <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">{fmt(node.saldoAwal)}</td>
        <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800">
          {fmt(node.saldoAkhir)}
        </td>
        <td className="px-4 py-3 text-center">
          {node.isGroup ? (
            <span className="text-[10px] text-slate-400">—</span>
          ) : (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                node.status === "Aktif"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {node.status}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {node.isGroup ? (
            <span className="text-[10px] text-slate-400">Group</span>
          ) : (
            <button
              onClick={() => onToggleStatus(node.kode)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {node.status === "Aktif" ? "Arsipkan" : "Aktifkan"}
            </button>
          )}
        </td>
      </tr>
      {hasChildren &&
        isExpanded &&
        node.children!.map((child) => (
          <TreeRow
            key={child.kode}
            node={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
            onToggleStatus={onToggleStatus}
          />
        ))}
    </>
  );
}
