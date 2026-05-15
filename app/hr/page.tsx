"use client";

import { useState, useMemo, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { useRole } from "@/context/RoleContext";
import {
  Download, Calendar, Filter, ScanFace, CheckCircle, Clock, MapPin,
  Link2, ArrowLeft, Eye, Copy, Check,
} from "lucide-react";

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
interface RawRecord {
  nama: string;
  tipe: "Staff" | "Harian";
  tanggal: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Sakit" | "Alfa";
}

interface RekapRow {
  nama: string;
  tipe: "Staff" | "Harian";
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
  terlambat: number;
}

// ═══════════════════════════════════════════
// MOCK DATA (admin view)
// ═══════════════════════════════════════════
const rawData: RawRecord[] = [
  // Rizal — Staff
  ...[1,2,3,4,5].map((d) => ({ nama: "Rizal", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 5 ? "Terlambat" as const : "Hadir" as const })),
  // Andi Wijaya
  ...[1,2,3,4,5].map((d) => ({ nama: "Andi Wijaya", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 3 ? "Izin" as const : "Hadir" as const })),
  // Siti Aminah
  ...[1,2,3,4,5].map((d) => ({ nama: "Siti Aminah", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 4 || d === 5 ? "Alfa" as const : d === 3 ? "Sakit" as const : "Hadir" as const })),
  // Budi Santoso
  ...[1,2,3,4,5].map((d) => ({ nama: "Budi Santoso", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 2 ? "Izin" as const : "Hadir" as const })),
  // Dewi Lestari
  ...[1,2,3,4,5].map((d) => ({ nama: "Dewi Lestari", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: "Hadir" as const })),
  // Ahmad Fauzi
  ...[1,2,3,4,5].map((d) => ({ nama: "Ahmad Fauzi", tipe: "Staff" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 2 || d === 5 ? "Izin" as const : d === 3 ? "Sakit" as const : "Hadir" as const })),
  // Pak Tarno — Harian
  ...[1,2,3,4,5].map((d) => ({ nama: "Pak Tarno", tipe: "Harian" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 1 || d === 5 ? "Alfa" as const : "Hadir" as const })),
  // Pak Sujono
  ...[1,2,3,4,5].map((d) => ({ nama: "Pak Sujono", tipe: "Harian" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 4 ? "Izin" as const : d === 5 ? "Alfa" as const : "Hadir" as const })),
  // Pak Joko
  ...[1,2,3,4,5].map((d) => ({ nama: "Pak Joko", tipe: "Harian" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 3 ? "Sakit" as const : "Hadir" as const })),
  // Pak Budi
  ...[1,2,3,4,5].map((d) => ({ nama: "Pak Budi", tipe: "Harian" as const, tanggal: `2026-05-${String(d).padStart(2,"0")}`, status: d === 1 ? "Alfa" as const : d === 3 || d === 4 ? "Izin" as const : d === 2 ? "Sakit" as const : "Hadir" as const })),
];

const tabs = [
  { id: "staff", label: "Absensi Staff" },
  { id: "harian", label: "Pekerja Harian" },
  { id: "rekap", label: "Rekap Absensi" },
];

const projects = [
  { id: "PRJ-2026-0001", nama: "Pengadaan & Pemasangan AC Kantor Pusat", customer: "PT Maju Jaya", lokasi: "Jakarta" },
  { id: "PRJ-2026-0002", nama: "Pemasangan Pompa Industri", customer: "PT Sejahtera Abadi", lokasi: "Medan" },
  { id: "PRJ-2026-0003", nama: "Renovasi Furniture Kantor", customer: "CV Karya Mandiri", lokasi: "Bandung" },
];

interface AbsensiHarianRecord {
  id: string;
  projectId: string;
  nama: string;
  tanggal: string;
  jamMasuk: string;
  status: "Hadir" | "Terlambat";
}

const HARIAN_STORAGE_KEY = "absensiHarian";

function loadHarianAbsensi(): AbsensiHarianRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(HARIAN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const STORAGE_KEY = "absensiData";
const DEMO_TODAY = "2026-05-06";
const CURRENT_STAFF = "Rizal";

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function loadExtra(): RawRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveExtra(data: RawRecord[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

const statusBadge = (status: string) => {
  switch (status) {
    case "Hadir": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Terlambat": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Izin": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Sakit": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Alfa": return "bg-rose-50 text-rose-700 border-rose-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

function calcRekap(filtered: RawRecord[]): RekapRow[] {
  const map = new Map<string, RekapRow>();
  filtered.forEach((r) => {
    const existing = map.get(r.nama);
    if (existing) {
      if (r.status === "Hadir") existing.hadir++;
      if (r.status === "Terlambat") existing.terlambat++;
      if (r.status === "Izin") existing.izin++;
      if (r.status === "Sakit") existing.sakit++;
      if (r.status === "Alfa") existing.alfa++;
    } else {
      map.set(r.nama, {
        nama: r.nama,
        tipe: r.tipe,
        hadir: r.status === "Hadir" ? 1 : 0,
        terlambat: r.status === "Terlambat" ? 1 : 0,
        izin: r.status === "Izin" ? 1 : 0,
        sakit: r.status === "Sakit" ? 1 : 0,
        alfa: r.status === "Alfa" ? 1 : 0,
      });
    }
  });
  return Array.from(map.values());
}

function jamMasuk(status: string) {
  if (status === "Alfa" || status === "Izin" || status === "Sakit") return "—";
  if (status === "Terlambat") return "09:15";
  return "08:00";
}

function jamKeluar(status: string) {
  if (status === "Alfa" || status === "Izin" || status === "Sakit") return "—";
  return "17:00";
}

// ═══════════════════════════════════════════
// STAFF VIEW
// ═══════════════════════════════════════════
function StaffView({
  data,
  scanning,
  alreadyCheckedIn,
  todayRecord,
  onAbsen,
}: {
  data: RawRecord[];
  scanning: boolean;
  alreadyCheckedIn: boolean;
  todayRecord?: RawRecord;
  onAbsen: () => void;
}) {
  const counts = useMemo(() => {
    return {
      hadir: data.filter((r) => r.status === "Hadir").length,
      terlambat: data.filter((r) => r.status === "Terlambat").length,
      izin: data.filter((r) => r.status === "Izin").length,
      sakit: data.filter((r) => r.status === "Sakit").length,
      alfa: data.filter((r) => r.status === "Alfa").length,
    };
  }, [data]);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data]);

  const todayLabel = new Date(DEMO_TODAY + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      {/* Profile + Face ID Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{CURRENT_STAFF}</h2>
            <p className="text-sm text-slate-500">Staff Teknik — ID: KRY-001</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3" />
              Kantor Pusat, Jakarta
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">{todayLabel}</p>
            <div className="flex items-center gap-1 text-sm text-slate-600 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {alreadyCheckedIn && todayRecord ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Anda sudah absen hari ini — {todayRecord.status}
              </p>
              <p className="text-xs text-emerald-600">
                Jam masuk: {jamMasuk(todayRecord.status)} · Metode: Face ID
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={onAbsen}
            disabled={scanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <ScanFace className="w-5 h-5" />
            {scanning ? "Memproses..." : "Absen dengan Face ID"}
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Hadir", value: counts.hadir, color: "emerald" },
          { label: "Terlambat", value: counts.terlambat, color: "amber" },
          { label: "Izin", value: counts.izin, color: "blue" },
          { label: "Sakit", value: counts.sakit, color: "indigo" },
          { label: "Alfa", value: counts.alfa, color: "rose" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wide font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Riwayat Absensi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Absensi</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Hari</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Jam Masuk</th>
                <th className="pb-3 font-medium">Jam Keluar</th>
                <th className="pb-3 font-medium">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((r, i) => {
                const d = new Date(r.tanggal + "T00:00:00");
                const hari = d.toLocaleDateString("id-ID", { weekday: "long" });
                const tgl = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                const isToday = r.tanggal === DEMO_TODAY;
                return (
                  <tr key={i} className={`hover:bg-slate-50 transition ${isToday ? "bg-blue-50/50" : ""}`}>
                    <td className="py-3 font-medium text-slate-800">
                      {tgl}
                      {isToday && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">HARI INI</span>}
                    </td>
                    <td className="py-3 text-slate-600 text-xs capitalize">{hari}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-700">{jamMasuk(r.status)}</td>
                    <td className="py-3 font-mono text-xs text-slate-700">{jamKeluar(r.status)}</td>
                    <td className="py-3 text-xs text-slate-500">
                      {r.tanggal === DEMO_TODAY && alreadyCheckedIn ? "Face ID" : "—"}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-400">Belum ada riwayat absensi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scanning Modal */}
      {scanning && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4 shadow-2xl">
            <div className="relative w-32 h-32 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <ScanFace className="absolute inset-0 m-auto w-10 h-10 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Memindai Wajah...</h4>
            <p className="text-sm text-slate-500">Mohon hadapkan wajah Anda ke kamera</p>
            <div className="mt-5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-[shimmer_2s_ease-in-out_infinite] w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════
// ADMIN VIEW
// ═══════════════════════════════════════════
function AdminView({ allData }: { allData: RawRecord[] }) {
  const [active, setActive] = useState("staff");
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-05");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [harianData, setHarianData] = useState<AbsensiHarianRecord[]>([]);
  const [rekapProjectId, setRekapProjectId] = useState<string | null>(null);

  useEffect(() => {
    setHarianData(loadHarianAbsensi());
  }, [active]);

  const handleCopyLink = (projectId: string) => {
    const url = `${window.location.origin}/hr/absen-harian/${projectId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(projectId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const projectAbsensi = useMemo(() => {
    if (!selectedProject) return [];
    return harianData.filter((h) => h.projectId === selectedProject && h.tanggal === DEMO_TODAY);
  }, [harianData, selectedProject]);

  const filteredRaw = useMemo(() => {
    return allData.filter((r) => r.tanggal >= dateFrom && r.tanggal <= dateTo);
  }, [allData, dateFrom, dateTo]);

  const rekapStaff = useMemo(() => calcRekap(filteredRaw.filter((r) => r.tipe === "Staff")), [filteredRaw]);

  const rekapHarianProject = useMemo(() => {
    if (!rekapProjectId) return [];
    const filtered = harianData.filter((h) => h.projectId === rekapProjectId && h.tanggal >= dateFrom && h.tanggal <= dateTo);
    const map = new Map<string, { nama: string; hadir: number; terlambat: number }>();
    filtered.forEach((r) => {
      const existing = map.get(r.nama);
      if (existing) {
        if (r.status === "Hadir") existing.hadir++;
        if (r.status === "Terlambat") existing.terlambat++;
      } else {
        map.set(r.nama, {
          nama: r.nama,
          hadir: r.status === "Hadir" ? 1 : 0,
          terlambat: r.status === "Terlambat" ? 1 : 0,
        });
      }
    });
    return Array.from(map.values());
  }, [harianData, rekapProjectId, dateFrom, dateTo]);
  const staffToday = allData.filter((r) => r.tanggal === "2026-05-05" && r.tipe === "Staff");
  const harianToday = allData.filter((r) => r.tanggal === "2026-05-05" && r.tipe === "Harian");

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${active === t.id ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Staff */}
      {active === "staff" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Daftar Hadir Staff — 05 Mei 2026</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <tr><th className="pb-3 font-medium">Nama</th><th className="pb-3 font-medium">Jam Masuk</th><th className="pb-3 font-medium">Jam Keluar</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Verifikasi</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffToday.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{s.nama}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-700">{jamMasuk(s.status)}</td>
                    <td className="py-3 font-mono text-xs text-slate-700">{jamKeluar(s.status)}</td>
                    <td className="py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(s.status)}`}>{s.status}</span></td>
                    <td className="py-3 text-xs text-slate-500">{s.status === "Alfa" || s.status === "Izin" || s.status === "Sakit" ? "—" : "Face ID"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Harian */}
      {active === "harian" && (
        <>
          {!selectedProject ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Daftar Project</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="pb-3 font-medium">ID Project</th>
                      <th className="pb-3 font-medium">Nama Project</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Lokasi</th>
                      <th className="pb-3 font-medium text-center">Hadir Hari Ini</th>
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => {
                      const hadirCount = harianData.filter((h) => h.projectId === p.id && h.tanggal === DEMO_TODAY).length;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-mono text-xs text-blue-700 font-semibold">{p.id}</td>
                          <td className="py-3 font-medium text-slate-800">{p.nama}</td>
                          <td className="py-3 text-slate-600 text-xs">{p.customer}</td>
                          <td className="py-3 text-slate-600 text-xs">{p.lokasi}</td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {hadirCount} hadir
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedProject(p.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Detail
                              </button>
                              <button
                                onClick={() => handleCopyLink(p.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
                                  copiedId === p.id
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }`}
                                title="Copy link absen"
                              >
                                {copiedId === p.id ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                                {copiedId === p.id ? "Copied" : "Link"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              {(() => {
                const p = projects.find((pr) => pr.id === selectedProject)!;
                return (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali
                      </button>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{p.nama}</h3>
                        <p className="text-xs text-slate-500">{p.customer} · {p.lokasi}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="pb-3 font-medium">Nama</th>
                            <th className="pb-3 font-medium">Jam Masuk</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {projectAbsensi.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                                Belum ada pekerja yang absen hari ini.
                                <br />
                                <span className="text-xs text-slate-300">Bagikan link absen ke pekerja harian.</span>
                              </td>
                            </tr>
                          )}
                          {projectAbsensi.map((h) => (
                            <tr key={h.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 font-medium text-slate-800">{h.nama}</td>
                              <td className="py-3 font-mono text-xs text-slate-700">{h.jamMasuk}</td>
                              <td className="py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(h.status)}`}>
                                  {h.status}
                                </span>
                              </td>
                              <td className="py-3 text-xs text-slate-500">{h.tanggal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}

      {/* Tab: Rekap */}
      {active === "rekap" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {/* Filter Date Range */}
          <div className="flex flex-wrap items-end gap-3 mb-5 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="w-4 h-4" />
              Filter Periode
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Dari Tanggal</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Sampai Tanggal</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="text-xs text-slate-500 pb-2">{filteredRaw.length} record ditemukan</div>
          </div>

          {/* Rekap Staff */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Rekap Staff — {dateFrom} s/d {dateTo}</h3>
              <span className="text-xs text-slate-500">{rekapStaff.length} orang</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <tr><th className="pb-3 font-medium">Nama</th><th className="pb-3 font-medium text-center">Hadir</th><th className="pb-3 font-medium text-center">Izin</th><th className="pb-3 font-medium text-center">Sakit</th><th className="pb-3 font-medium text-center">Alfa</th><th className="pb-3 font-medium text-center">Terlambat</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rekapStaff.length === 0 && (
                    <tr><td colSpan={6} className="py-6 text-center text-sm text-slate-400">Tidak ada data staff.</td></tr>
                  )}
                  {rekapStaff.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-medium text-slate-800">{r.nama}</td>
                      <td className="py-3 text-center font-bold text-emerald-700">{r.hadir}</td>
                      <td className="py-3 text-center text-blue-600">{r.izin || "—"}</td>
                      <td className="py-3 text-center text-indigo-600">{r.sakit || "—"}</td>
                      <td className={`py-3 text-center font-bold ${r.alfa ? "text-rose-600" : "text-slate-400"}`}>{r.alfa || "—"}</td>
                      <td className={`py-3 text-center ${r.terlambat ? "text-amber-600" : "text-slate-400"}`}>{r.terlambat || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekap Pekerja Harian */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Rekap Pekerja Harian — {dateFrom} s/d {dateTo}</h3>
            </div>

            {!rekapProjectId ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="pb-3 font-medium">ID Project</th>
                      <th className="pb-3 font-medium">Nama Project</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Lokasi</th>
                      <th className="pb-3 font-medium text-center">Hadir Periode Ini</th>
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => {
                      const count = harianData.filter((h) => h.projectId === p.id && h.tanggal >= dateFrom && h.tanggal <= dateTo).length;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-mono text-xs text-blue-700 font-semibold">{p.id}</td>
                          <td className="py-3 font-medium text-slate-800">{p.nama}</td>
                          <td className="py-3 text-slate-600 text-xs">{p.customer}</td>
                          <td className="py-3 text-slate-600 text-xs">{p.lokasi}</td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {count} hadir
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setRekapProjectId(p.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Lihat Rekap
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {(() => {
                  const p = projects.find((pr) => pr.id === rekapProjectId)!;
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => setRekapProjectId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Kembali
                        </button>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{p.nama}</h4>
                          <p className="text-xs text-slate-500">{p.customer} · {p.lokasi}</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                            <tr><th className="pb-3 font-medium">Nama</th><th className="pb-3 font-medium text-center">Hadir</th><th className="pb-3 font-medium text-center">Terlambat</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rekapHarianProject.length === 0 && (
                              <tr><td colSpan={3} className="py-6 text-center text-sm text-slate-400">Tidak ada data pekerja harian untuk project ini di periode yang dipilih.</td></tr>
                            )}
                            {rekapHarianProject.map((r, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition">
                                <td className="py-3 font-medium text-slate-800">{r.nama}</td>
                                <td className="py-3 text-center font-bold text-emerald-700">{r.hadir}</td>
                                <td className={`py-3 text-center ${r.terlambat ? "text-amber-600" : "text-slate-400"}`}>{r.terlambat || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function HrPage() {
  const { role } = useRole();
  const isStaff = role === "staff";

  const [extraData, setExtraData] = useState<RawRecord[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setExtraData(loadExtra());
  }, []);

  const allData = useMemo(() => [...rawData, ...extraData], [extraData]);

  const staffData = useMemo(() => {
    if (!isStaff) return allData;
    return allData.filter((r) => r.nama === CURRENT_STAFF);
  }, [allData, isStaff]);

  const alreadyCheckedIn = staffData.some((r) => r.tanggal === DEMO_TODAY);
  const todayRecord = staffData.find((r) => r.tanggal === DEMO_TODAY);

  const handleFaceID = () => {
    setScanning(true);
    setTimeout(() => {
      const hour = new Date().getHours();
      const status: RawRecord["status"] = hour >= 8 ? "Terlambat" : "Hadir";

      const newRecord: RawRecord = {
        nama: CURRENT_STAFF,
        tipe: "Staff",
        tanggal: DEMO_TODAY,
        status,
      };

      const updated = [...extraData, newRecord];
      setExtraData(updated);
      saveExtra(updated);
      setScanning(false);
    }, 2500);
  };

  return (
    <SidebarLayout
      title={isStaff ? "Absensi Saya" : "Absensi Karyawan"}
      subtitle={isStaff ? "Kelola kehadiran dan lihat riwayat absensi Anda." : "Monitoring kehadiran staff & pekerja harian."}
      action={
        !isStaff ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Senin, 05 Mei 2026
          </div>
        ) : undefined
      }
    >
      {isStaff ? (
        <StaffView
          data={staffData}
          scanning={scanning}
          alreadyCheckedIn={alreadyCheckedIn}
          todayRecord={todayRecord}
          onAbsen={handleFaceID}
        />
      ) : (
        <AdminView allData={allData} />
      )}
    </SidebarLayout>
  );
}
