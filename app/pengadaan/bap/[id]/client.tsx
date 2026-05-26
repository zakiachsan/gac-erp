"use client";

import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { ArrowLeft, FileText, CheckCircle, User, Calendar, Building2 } from "lucide-react";

interface Pihak { nama: string; nik: string; alamat: string; }
interface POItemRef { nama: string; qty: number; satuan: string; hargaSatuan: number; }
interface PembayaranPeriode { ke: number; keterangan: string; jumlah: number; }
interface BAPData {
  id: string; noBap: string; tanggal: string;
  pihakPertama: Pihak; pihakKedua: Pihak;
  noKontrak: string; tanggalKontrak: string;
  invoiceFile: string; kwitansiFile: string; bastFile: string;
  vendor: { nama: string; nik: string; jabatan: string; alamat: string; };
  bank: string; noRekening: string; atasNama: string;
  nilaiKontrak: number; pembayaranBapSekarang: number; akumulasiSebelumnya: number;
  periodeIni: number; retensi: number; potonganLain: number; ppn: number;
  jumlahPotongan: number; periodeIniSetelahPotong: number;
  jumlahSetelahPotong: number; jumlahDibayarkan: number;
  terbilang: string; historyPembayaran: PembayaranPeriode[];
  poItems: POItemRef[]; approver: string; statusApproval: "draft" | "approved";
}

const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const ribuan = (n: number) => {
  if (n === 0) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

function terbilang(n: number): string {
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (n < 12) return angka[Math.floor(n)];
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

const bapMap: Record<string, BAPData> = {
  "BAP-001": {
    id: "BAP-001", noBap: "011/BAP.BLM/PT CoolTech/KEU.PW/VIII/2024", tanggal: "2024-08-20",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "011/PO.BLM/Semangat Teknik/TKN.ASYA/VIII/2024", tanggalKontrak: "2024-08-15",
    invoiceFile: "INV-011-CoolTech-2024.pdf", kwitansiFile: "KW-011-CoolTech-2024.pdf", bastFile: "BAST-011-CoolTech-2024.pdf",
    vendor: { nama: "PT CoolTech", nik: "-", jabatan: "Vendor", alamat: "Jl. Teknologi No. 1, Jakarta" },
    bank: "BCA", noRekening: "1234567890", atasNama: "PT CoolTech",
    nilaiKontrak: 70781800, pembayaranBapSekarang: 70781800, akumulasiSebelumnya: 0,
    periodeIni: 70781800, retensi: 3539090, potonganLain: 0, ppn: 7396698,
    jumlahPotongan: 3539090, periodeIniSetelahPotong: 67242710,
    jumlahSetelahPotong: 59846012, jumlahDibayarkan: 59846012,
    terbilang: terbilang(59846012),
    historyPembayaran: [{ ke: 1, keterangan: "Pembayaran ke 1 (DP 50%)", jumlah: 59846012 }],
    poItems: [
      { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
      { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
      { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
      { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
    ],
    approver: "Fahrul Rizal", statusApproval: "approved",
  },
  "BAP-002": {
    id: "BAP-002", noBap: "012/BAP.BLM/PT Maju Bersama/KEU.PW/IX/2024", tanggal: "2024-09-25",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "012/PO.BLM/Semangat Teknik/TKN.BETA/IX/2024", tanggalKontrak: "2024-09-20",
    invoiceFile: "INV-012-MajuBersama-2024.pdf", kwitansiFile: "KW-012-MajuBersama-2024.pdf", bastFile: "BAST-012-MajuBersama-2024.pdf",
    vendor: { nama: "PT Maju Bersama", nik: "-", jabatan: "Vendor", alamat: "Jl. Industri No. 5, Bandung" },
    bank: "Mandiri", noRekening: "9876543210", atasNama: "PT Maju Bersama",
    nilaiKontrak: 34132500, pembayaranBapSekarang: 34132500, akumulasiSebelumnya: 0,
    periodeIni: 34132500, retensi: 0, potonganLain: 500000, ppn: 3699575,
    jumlahPotongan: 500000, periodeIniSetelahPotong: 33632500,
    jumlahSetelahPotong: 29932925, jumlahDibayarkan: 29932925,
    terbilang: terbilang(29932925),
    historyPembayaran: [{ ke: 1, keterangan: "Pembayaran ke 1 (DP 60%)", jumlah: 29932925 }],
    poItems: [
      { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
      { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
    ],
    approver: "Fahrul Rizal", statusApproval: "approved",
  },
  "BAP-003": {
    id: "BAP-003", noBap: "013/BAP.BLM/PT Sejahtera Abadi/KEU.PW/X/2024", tanggal: "2024-10-30",
    pihakPertama: { nama: "Popy Wulandari", nik: "880011223344", alamat: "Medan" },
    pihakKedua: { nama: "Fahrul Rizal", nik: "990055667788", alamat: "Jakarta" },
    noKontrak: "013/PO.BLM/Semangat Teknik/TKN.GAMA/X/2024", tanggalKontrak: "2024-10-25",
    invoiceFile: "", kwitansiFile: "", bastFile: "",
    vendor: { nama: "PT Sejahtera Abadi", nik: "-", jabatan: "Vendor", alamat: "Jl. Konstruksi No. 10, Surabaya" },
    bank: "BRI", noRekening: "5544331122", atasNama: "PT Sejahtera Abadi",
    nilaiKontrak: 139305000, pembayaranBapSekarang: 139305000, akumulasiSebelumnya: 0,
    periodeIni: 139305000, retensi: 6965250, potonganLain: 0, ppn: 14561978,
    jumlahPotongan: 6965250, periodeIniSetelahPotong: 132339750,
    jumlahSetelahPotong: 117777772, jumlahDibayarkan: 117777772,
    terbilang: terbilang(117777772),
    historyPembayaran: [],
    poItems: [
      { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
      { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
      { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
      { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
      { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
    ],
    approver: "Direktur", statusApproval: "draft",
  },
};

interface Props {
  id: string;
}

export default function BAPDetailPage({ id }: Props) {
  const bap = bapMap[id || ""];

  if (!bap) {
    return (
      <SidebarLayout title="Detail BAP" subtitle="BAP tidak ditemukan.">
        <div className="text-center py-12 text-slate-400">
          <p>BAP tidak ditemukan.</p>
          <Link href="/pengadaan/bap" className="text-blue-600 text-sm mt-2 inline-block">← Kembali ke daftar BAP</Link>
        </div>
      </SidebarLayout>
    );
  }

  const sisaKontrak = bap.nilaiKontrak - bap.pembayaranBapSekarang - bap.retensi;

  return (
    <SidebarLayout title={bap.noBap} subtitle={`${bap.vendor.nama} · ${bap.tanggal}`}>
      {/* Back link */}
      <div className="mb-4">
        <Link href="/pengadaan/bap" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke daftar BAP
        </Link>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Vendor</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {bap.vendor.nama}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Status</div>
          <div className={`text-sm font-bold mt-0.5 ${bap.statusApproval === "approved" ? "text-emerald-700" : "text-amber-700"}`}>{bap.statusApproval === "approved" ? "Disetujui" : "Draft"}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Tanggal</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {bap.tanggal}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Jumlah Dibayar</div>
          <div className="text-sm font-bold text-emerald-700 mt-0.5">{fmt(bap.jumlahDibayarkan)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Kolom Kiri */}
        <div className="space-y-5">
          {/* Pihak */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Pihak-Pihak</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">PIHAK PERTAMA</div>
                  <div className="text-sm font-medium text-slate-800">{bap.pihakPertama.nama}</div>
                  <div className="text-xs text-slate-500">NIK: {bap.pihakPertama.nik}</div>
                  <div className="text-xs text-slate-500">{bap.pihakPertama.alamat}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">PIHAK KEDUA</div>
                  <div className="text-sm font-medium text-slate-800">{bap.pihakKedua.nama}</div>
                  <div className="text-xs text-slate-500">NIK: {bap.pihakKedua.nik}</div>
                  <div className="text-xs text-slate-500">{bap.pihakKedua.alamat}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Berdasarkan */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Berdasarkan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2"><FileText className="w-4 h-4 text-blue-500 mt-0.5" /><div><div className="text-xs text-slate-400">Kontrak</div><div className="font-medium text-slate-700">{bap.noKontrak}</div></div></div>
              <div className="flex items-start gap-2"><FileText className="w-4 h-4 text-emerald-500 mt-0.5" /><div><div className="text-xs text-slate-400">Invoice</div><div className="font-medium text-slate-700">{bap.invoiceFile || "—"}</div></div></div>
              <div className="flex items-start gap-2"><FileText className="w-4 h-4 text-amber-500 mt-0.5" /><div><div className="text-xs text-slate-400">Kwitansi</div><div className="font-medium text-slate-700">{bap.kwitansiFile || "—"}</div></div></div>
              <div className="flex items-start gap-2"><FileText className="w-4 h-4 text-rose-500 mt-0.5" /><div><div className="text-xs text-slate-400">BAST</div><div className="font-medium text-slate-700">{bap.bastFile || "—"}</div></div></div>
            </div>
          </div>

          {/* Bank */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Informasi Bank</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-medium text-slate-800">{bap.bank}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">No Rekening</span><span className="font-medium text-slate-800">{bap.noRekening}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Atas Nama</span><span className="font-medium text-slate-800">{bap.atasNama}</span></div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-5">
          {/* Perhitungan Pembayaran */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Perhitungan Pembayaran</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-4 py-2 text-slate-600">1. Jumlah Pembayaran BAP</td><td className="px-4 py-2 text-right font-mono text-xs">{fmt(bap.pembayaranBapSekarang)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600">2. Akumulasi Sebelumnya</td><td className="px-4 py-2 text-right font-mono text-xs">{fmt(bap.akumulasiSebelumnya)}</td></tr>
                <tr className="bg-slate-50/50"><td className="px-4 py-2 font-medium text-slate-700">3. Periode Ini (1 - 2)</td><td className="px-4 py-2 text-right font-mono text-xs font-bold">{fmt(bap.periodeIni)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600 pl-8">Retensi</td><td className="px-4 py-2 text-right font-mono text-xs">{fmt(bap.retensi)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600 pl-8">Potongan Lain</td><td className="px-4 py-2 text-right font-mono text-xs">{fmt(bap.potonganLain)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600">4. Jumlah Potongan</td><td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(bap.jumlahPotongan)}</td></tr>
                <tr className="bg-slate-50/50"><td className="px-4 py-2 font-medium text-slate-700">5. Setelah Dipotong</td><td className="px-4 py-2 text-right font-mono text-xs font-bold">{fmt(bap.periodeIniSetelahPotong)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600 pl-8">PPN</td><td className="px-4 py-2 text-right font-mono text-xs">{fmt(bap.ppn)}</td></tr>
                <tr className="bg-slate-50 font-semibold"><td className="px-4 py-2.5 text-slate-700">Jumlah BAP (5 - PPN)</td><td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(bap.jumlahSetelahPotong)}</td></tr>
                <tr className="bg-slate-50 font-semibold"><td className="px-4 py-2.5 text-slate-700">Jumlah Dibayarkan</td><td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(bap.jumlahDibayarkan)}</td></tr>
              </tbody>
            </table>
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
              <span className="font-semibold">Terbilang:</span> {terbilang(bap.jumlahDibayarkan)} Rupiah
            </div>
          </div>

          {/* Item PO */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Item dari PO</div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr><th className="px-4 py-2 text-left">Item</th><th className="px-4 py-2 text-center w-16">Qty</th><th className="px-4 py-2 text-center w-16">Sat</th><th className="px-4 py-2 text-right w-24">Harga</th><th className="px-4 py-2 text-right w-24">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bap.poItems.map((it, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-xs font-medium text-slate-800">{it.nama}</td>
                    <td className="px-4 py-2 text-center font-mono text-[10px] text-slate-600">{ribuan(it.qty)}</td>
                    <td className="px-4 py-2 text-center text-[10px] text-slate-600">{it.satuan}</td>
                    <td className="px-4 py-2 text-right font-mono text-[10px] text-slate-600">{fmt(it.hargaSatuan)}</td>
                    <td className="px-4 py-2 text-right font-mono text-[10px] font-medium text-slate-700">{fmt(it.qty * it.hargaSatuan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rekapitulasi */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">Rekapitulasi Kontrak</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-4 py-2 text-slate-600">Nilai Kontrak</td><td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(bap.nilaiKontrak)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600">Jumlah Pembayaran</td><td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(bap.pembayaranBapSekarang)}</td></tr>
                <tr><td className="px-4 py-2 text-slate-600">Retensi</td><td className="px-4 py-2 text-right font-mono text-xs font-medium">{fmt(bap.retensi)}</td></tr>
                <tr className="bg-slate-50 font-semibold"><td className="px-4 py-2.5 text-slate-700">Sisa Kontrak</td><td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-700">{fmt(sisaKontrak)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Approver */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Approval</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">{bap.approver}</div>
                <div className="text-xs text-slate-500">{bap.statusApproval === "approved" ? "Disetujui" : "Menunggu Persetujuan"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
