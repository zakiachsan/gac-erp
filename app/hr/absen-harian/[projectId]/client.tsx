"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, MapPin, ScanFace, LogOut } from "lucide-react";

const projects = [
  { id: "PRJ-2026-0001", nama: "Pengadaan & Pemasangan AC Kantor Pusat", customer: "PT Maju Jaya" },
  { id: "PRJ-2026-0002", nama: "Pemasangan Pompa Industri", customer: "PT Sejahtera Abadi" },
  { id: "PRJ-2026-0003", nama: "Renovasi Furniture Kantor", customer: "CV Karya Mandiri" },
];

const STORAGE_KEY = "absensiHarian";
const DEMO_TODAY = "2026-05-06";

interface AbsensiHarianRecord {
  id: string;
  projectId: string;
  nama: string;
  tanggal: string;
  jamMasuk: string;
  jamKeluar?: string;
  status: "Hadir" | "Terlambat";
}

function loadAbsensi(): AbsensiHarianRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveAbsensi(data: AbsensiHarianRecord[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export default function AbsenHarianClient() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);

  const [nama, setNama] = useState("");
  const [scanning, setScanning] = useState(false);
  const [checkoutScanning, setCheckoutScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AbsensiHarianRecord | null>(null);

  useEffect(() => {
    const all = loadAbsensi();
    const found = all.find((a) => a.projectId === projectId && a.tanggal === DEMO_TODAY);
    if (found) {
      setTodayRecord(found);
      setDone(true);
      setNama(found.nama);
    }
  }, [projectId]);

  const handleAbsen = () => {
    if (!nama.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const hour = new Date().getHours();
      const status: AbsensiHarianRecord["status"] = hour >= 8 ? "Terlambat" : "Hadir";
      const jamMasuk = hour >= 8 ? "09:15" : "08:00";

      const newRecord: AbsensiHarianRecord = {
        id: Math.random().toString(36).slice(2, 9),
        projectId,
        nama: nama.trim(),
        tanggal: DEMO_TODAY,
        jamMasuk,
        status,
      };

      const all = loadAbsensi();
      const filtered = all.filter((a) => !(a.projectId === projectId && a.tanggal === DEMO_TODAY));
      const updated = [...filtered, newRecord];
      saveAbsensi(updated);
      setTodayRecord(newRecord);
      setDone(true);
      setScanning(false);
    }, 2500);
  };

  const handleCheckout = () => {
    if (!todayRecord) return;
    setCheckoutScanning(true);
    setTimeout(() => {
      const jamKeluar = "17:00";
      const all = loadAbsensi();
      const updated = all.map((a) => {
        if (a.id === todayRecord.id) {
          return { ...a, jamKeluar };
        }
        return a;
      });
      saveAbsensi(updated);
      setTodayRecord((prev) => (prev ? { ...prev, jamKeluar } : prev));
      setCheckoutScanning(false);
    }, 2000);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center max-w-sm w-full">
          <h1 className="text-lg font-bold text-slate-900 mb-2">Project Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500">Link absen ini tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 text-white">
          <div className="text-xs font-medium text-blue-100 mb-1">Absensi Pekerja Harian</div>
          <h1 className="text-lg font-bold leading-tight">{project.nama}</h1>
          <div className="flex items-center gap-1 text-xs text-blue-100 mt-2">
            <MapPin className="w-3 h-3" />
            {project.customer}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {done && todayRecord ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                {todayRecord.jamKeluar ? "Checkout Berhasil!" : "Absensi Berhasil!"}
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                {todayRecord.nama} — {todayRecord.status}
              </p>
              <div className="bg-slate-50 rounded-lg p-3 text-left text-sm space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Tanggal</span>
                  <span className="font-medium text-slate-800">{DEMO_TODAY}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Jam Masuk</span>
                  <span className="font-medium text-slate-800">{todayRecord.jamMasuk}</span>
                </div>
                {todayRecord.jamKeluar && (
                  <div className="flex justify-between text-slate-600">
                    <span>Jam Keluar</span>
                    <span className="font-medium text-slate-800">{todayRecord.jamKeluar}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Project</span>
                  <span className="font-medium text-slate-800">{project.nama}</span>
                </div>
              </div>

              {!todayRecord.jamKeluar && (
                <div className="mt-5">
                  {checkoutScanning ? (
                    <div className="text-center py-2">
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                        <ScanFace className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Memverifikasi Checkout...</h4>
                      <p className="text-xs text-slate-500">Mohon tunggu sebentar</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Checkout / Pulang
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {scanning ? (
                <div className="text-center py-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    <ScanFace className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Memverifikasi...</h4>
                  <p className="text-xs text-slate-500">Mohon tunggu sebentar</p>
                </div>
              ) : (
                <button
                  onClick={handleAbsen}
                  disabled={!nama.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition"
                >
                  <ScanFace className="w-5 h-5" />
                  Absen Hadir
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
