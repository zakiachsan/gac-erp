# UI/UX Assessment — GAC-ERP Project

**Tanggal Assessment:** 26 Mei 2026  
**Versi PRD:** 1.1 (April 2026)  
**Scope:** HTML Prototype (`ui/*.html`) + Next.js App (`gac-erp-ui/app/**`)

---

## 1. Executive Summary

Secara umum, UI sudah meng-cover **kerangka besar** dari 6 modul utama yang direncanakan di PRD:
1. Manajemen Penawaran
2. Dashboard Detail Project
3. Manajemen Anggaran
4. Pengadaan Barang & Jasa + Biaya Operasional
5. Manajemen Keuangan & Perpajakan
6. HR Absensi

Namun, **fungsionalitas masih sangat dasar** — banyak fitur yang hanya berupa UI placeholder (visual tanpa handler), data masih hardcoded/mock, dan beberapa fitur kritis dari PRD belum terimplementasi sama sekali.

### Skor Keseluruhan
| Aspek | Skor | Keterangan |
|-------|------|------------|
| Coverage Modul | 🟡 70% | 6 modul ada UI-nya, tapi beberapa fitur PRD belum tercover |
| Fungsionalitas | 🔴 35% | Banyak tombol/form hanya UI, belum ada handler/function |
| Data Integration | 🔴 20% | Hampir semua data hardcoded/mock, tidak terhubung ke API/DB |
| Export/Print | 🔴 25% | Hanya perpajakan yang export PDF/Excel fungsional |
| Date Input | 🟡 50% | Ada `type="date"` di beberapa form, tapi belum ada rich date picker |
| Upload File | 🔴 30% | Visual drag-drop ada di beberapa tempat, tapi belum berfungsi |
| Approval Flow | 🟡 60% | Visual stepper ada di PR & BAP, tapi notifikasi & logikanya belum lengkap |

---

## 2. Gap Analysis per Modul vs PRD

### 2.1 Manajemen Penawaran (Quotation)

**PRD Meminta:**
- ✅ Create penawaran dengan nomor otomatis
- ✅ Input nama barang/jasa dan harga penawaran
- ✅ Pilih marketing/sales yang menangani
- ✅ Pilih Customer (dengan data customer lengkap)
- ✅ Upload lampiran dokumen penawaran
- ✅ Maksimal 2x submit: penawaran awal & negosiasi
- ✅ Status: Submit → Negosiasi → Close (menang/kalah)
- ✅ Auto-generate project ketika menang
- ✅ Riwayat perubahan status penawaran
- ❌ **Performa sales terukur dari status Close (menang/kalah)** — belum ada dashboard/rekap performa sales

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| Create penawaran | 🟡 Partial | Modal ada, tapi tombol "Simpan Draft" & "Ajukan" hanya menutup modal |
| Nomor otomatis | ✅ Ada | Field readonly dengan nomor dummy |
| Date picker | ✅ Ada | Native `type="date"` untuk tanggal & periode |
| Upload lampiran | 🟡 Visual only | Area drag-drop ada, tapi tidak ada handler `onChange`/`onDrop` |
| Status tracking | ✅ Ada | Dropdown status + history timeline |
| Auto-generate project | 🟡 Partial | Hanya push ke `localStorage`, tidak terintegrasi dengan project detail |
| Export/Print penawaran | ❌ Tidak ada | Tidak ada tombol export/print PDF penawaran |
| Duplikat/Clone | ❌ Tidak ada | Fitur duplikat penawaran belum ada |
| Kirim email/share | ❌ Tidak ada | Tidak ada fitur kirim ke customer |

**Improvement Priority: HIGH**

---

### 2.2 Dashboard Detail Project

**PRD Meminta:**
- ✅ Detail pekerjaan — informasi lengkap project
- ✅ Nilai project / pengeluaran / pemasukan
- ✅ TAB Listing Pengajuan
- ✅ TAB Listing Pemasukan
- ✅ TAB Listing Pengeluaran
- ✅ TAB Hutang / Piutang
- ✅ TAB Anggaran vs Realisasi
- ✅ Dokumen — tempat simpan file arsip pekerjaan

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| 7 Tabs lengkap | ✅ Ada | Detail, Pengajuan, Pemasukan, Pengeluaran, Hutang, Anggaran, Dokumen |
| Detail pekerjaan | ✅ Ada | Info grid + summary cards (nilai kontrak, pemasukan, pengeluaran) |
| Listing Pengajuan | 🟡 Partial | Tabel + modal tambah, tapi data hanya state lokal |
| Listing Pemasukan | 🟡 Partial | Sama seperti di atas |
| Listing Pengeluaran | 🟡 Partial | Sama seperti di atas |
| Hutang/Piutang | 🟡 Partial | Sama seperti di atas |
| Anggaran vs Realisasi | ❌ Tidak ada | Tab ada tapi **belum diimplementasikan** (tidak ada konten di file) |
| Dokumen arsip | 🟡 Partial | Card list dokumen + modal tambah, tapi upload hanya visual |
| **Export detail project** | ❌ Tidak ada | Tidak ada tombol export PDF/Excel untuk seluruh detail project |
| Upload dokumen | 🟡 Visual only | Drag-drop area ada tapi tidak berfungsi |
| Gantt chart / timeline | ❌ Tidak ada | Tidak ada visualisasi progress project |
| Activity log / comment | ❌ Tidak ada | Tidak ada riwayat aktivitas per project |

**Improvement Priority: HIGH**

---

### 2.3 Manajemen Anggaran (Budgeting)

**PRD Meminta:**
- ✅ Create anggaran per proyek
- ✅ 3 sub-form: Material & Jasa, Biaya Operasional, Pajak
- ✅ Input manual breakdown harga
- ✅ Komparasi anggaran vs realisasi (otomatis dari data pengadaan)
- ✅ Monitoring budget real-time

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| Create anggaran | 🟡 Partial | Selector project + summary cards + breakdown table + modal tambah item |
| 3 sub-form (Material, Ops, Pajak) | 🟡 Partial | Modal tambah item tidak membedakan kategori secara eksplisit |
| Progress bar | 🟡 Hardcoded | Progress bar chart masih menggunakan data statis, tidak dinamis dari `items` |
| Komparasi anggaran vs realisasi | ❌ Tidak ada | Hanya menampilkan total & realisasi, tidak ada tabel komparasi detail |
| Export anggaran | ❌ Tidak ada | Tidak ada tombol export |
| Alert overbudget | ❌ Tidak ada | Tidak ada warning ketika realisasi mendekati/melebihi anggaran |
| Versioning anggaran | ❌ Tidak ada | Tidak ada fitur revisi/RAB |

**Improvement Priority: MEDIUM**

---

### 2.4 Pengadaan Barang & Jasa + Biaya Operasional

**PRD Meminta:**
- ✅ Pengajuan Barang & Jasa (PR) → Approval berjenjang
- ✅ Pembanding harga vendor (≥2 supplier) → Approval
- ✅ Purchase Order (PO) → Approval
- ✅ BAP (Berita Acara Pembayaran) → Approval berjenjang
- ✅ Listing Pembayaran
- ✅ Laporan Transaksi
- ✅ Pengajuan Biaya Operasional → Approval → Listing Bayar → Laporan
- ✅ Approval berjenjang: Pengaju → Mengetahui → Menyetujui
- ✅ Notifikasi approval ke pengguna yang bersangkutan

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| PR (Pengajuan) | 🟡 Partial | Tabel list + modal tambah + approval tracker 3 level, tapi form PR tidak ada field tanggal |
| Pembanding harga | 🟡 Partial | Tabel komparasi multi-vendor + edit inline + highlight harga termurah + tombol pilih vendor. **Upload dokumen hanya visual** |
| PO | 🟡 Partial | Expandable row + modal buat PO + auto-calculate pajak & diskon. **Tombol "Cetak PO" hanya UI** |
| BAP | 🟡 Partial | Expandable row + modal submit + auto-calculate retensi & PPN. **Upload lampiran hanya visual** |
| Detail BAP | 🟡 Partial | Halaman detail full-page read-only. **Tidak ada tombol export/print BAP ke PDF** |
| Listing Bayar | 🟡 Partial | Tabel + modal proses bayar + auto-fill dari BAP. **Tidak ada upload bukti pembayaran** |
| Laporan Transaksi | 🟡 Partial | Ada halaman laporan tapi data hardcoded |
| Biaya Operasional | 🟡 Partial | Ada halaman pengajuan, pembayaran, dan laporan tapi data hardcoded |
| Approval 3 level | 🟡 Partial | Visual stepper ada di PR & BAP, tapi **notifikasi belum ada**, alur approval belum terintegrasi end-to-end |
| Export laporan pengadaan | ❌ Tidak ada | Tidak ada export di semua halaman pengadaan |
| Terbilang otomatis | ❌ Tidak ada | Field "Terbilang" di BAP masih placeholder ("nol") |
| Vendor scoring | ❌ Tidak ada | Tidak ada fitur scoring/rating vendor |

**Improvement Priority: HIGH**

---

### 2.5 Manajemen Keuangan & Perpajakan

**PRD Meminta:**
- ✅ Neraca
- ✅ Laba Rugi
- ✅ Cashflow
- ✅ Hutang Piutang
- ✅ Monitoring Pajak Keluaran & Masukan
- ✅ Monitoring pajak lebih bayar / kurang bayar
- ✅ Dana Masuk & Dana Keluar
- ✅ Pembuatan Invoice & Kwitansi
- ✅ Rekap otomatis

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| Neraca | ✅ Ada | Laporan posisi keuangan 2 kolom (Aktiva vs Pasiva) |
| Laba Rugi | ✅ Ada | Pendapatan, COGS, Beban Operasional, auto-calculate laba |
| Cashflow | ✅ Ada | 3 kategori (Operasional, Investasi, Pendanaan) dengan toggle |
| Hutang Piutang | ✅ Ada | Aging report dengan kategori (current, 1-30, 31-60, 61-90, 90+ hari) |
| Perpajakan | ✅ Ada | 3 tab (Overview, PPh Detail, PPN Detail) + summary + selisih PPN |
| Invoice & Kwitansi | ✅ Ada | Daftar invoice & kwitansi dengan filter periode & status |
| Jurnal Umum | ✅ Ada | Ada halaman |
| Buku Besar | ✅ Ada | Ada halaman |
| COA | ✅ Ada | Ada halaman |
| Rekonsiliasi | ✅ Ada | Ada halaman |
| Neraca Saldo | ✅ Ada | Ada halaman |
| Aset Tetap | ✅ Ada | Ada halaman |
| Date picker | ✅ Ada | Semua halaman keuangan pakai `FinanceFilterBar` dengan `type="date"` |
| **Export laporan keuangan** | 🟡 Partial | **Hanya Perpajakan yang export PDF/Excel fungsional** (menggunakan `exportUtils.ts`). Halaman lain (Neraca, Laba Rugi, Cashflow, Hutang Piutang, Invoice) hanya tombol export dengan `alert()` stub |
| **Export kwitansi** | ❌ Tidak ada | Tidak ada tombol export/print kwitansi individual |
| Grafik/chart | ❌ Tidak ada | Tidak ada visualisasi chart di semua halaman keuangan |
| AI Asisten | 🟡 Mockup | `AiChatWidget.tsx` ada tapi hanya UI statis, tidak terhubung ke API |

**Improvement Priority: HIGH** (khusus export kwitansi & export laporan keuangan)

---

### 2.6 HR — Absensi

**PRD Meminta:**
- ✅ Staff — data dari database karyawan
- ✅ Pekerja Harian — input manual via formulir tanpa login
- ✅ Face ID Attendance — deteksi kesamaan wajah
- ✅ Absensi Manual (untuk pekerja harian)
- ✅ Rekap Absensi per periode

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| Absensi Staff | 🟡 Partial | Tab Staff dengan simulasi Face ID (`setTimeout`), riwayat pribadi, summary card |
| Absensi Pekerja Harian | 🟡 Partial | Form publik per project (`/hr/absen-harian/[projectId]`), data disimpan ke `localStorage` |
| Rekap Absensi | 🟡 Partial | Tab rekap admin dengan date range picker (native `type="date"`) |
| Export rekap | ❌ Tidak ada | Tidak ada tombol export Excel/PDF rekap absensi |
| Face ID real | ❌ Tidak ada | Hanya simulasi loading, tidak ada integrasi library face recognition |
| Kalender kerja / hari libur | ❌ Tidak ada | Tidak ada manajemen hari libur |
| Lembur (OT) | ❌ Tidak ada | Tidak ada tracking lembur |
| Manajemen cuti | ❌ Tidak ada | Tidak ada pengajuan cuti & saldo cuti |
| Payslip / gaji | ❌ Tidak ada | Tidak ada modul payroll |

**Improvement Priority: MEDIUM**

---

### 2.7 Multi-Perusahaan (SaaS) & Admin

**PRD Meminta:**
- ✅ Super Admin → mengelola seluruh perusahaan
- ✅ Admin Perusahaan → mengelola data & user per perusahaan
- ✅ Karyawan/Staf → user operasional
- ✅ Tenant isolation — data antar perusahaan terisolasi
- ✅ Aktivasi manual oleh Super Admin (tanpa payment gateway)

**Temuan UI Saat Ini:**
| Fitur | Status | Catatan |
|-------|--------|---------|
| Login | ✅ Ada | Form login + tenant selection (multi-perusahaan) |
| Super Admin Dashboard | 🟡 Partial | Ada stats tenant & daftar perusahaan, tapi data dari `localStorage` saja |
| Admin Perusahaan | 🟡 Partial | Ada user management page |
| Tenant isolation | ❌ Belum terlihat | Tidak ada mekanisme isolasi data yang terlihat di UI |
| Role-based access | ❌ Tidak jelas | Tidak ada indikasi pembatasan menu berdasarkan role |
| Forgot password | ❌ Tidak ada | Tidak ada fitur reset password |
| 2FA/MFA | ❌ Tidak ada | Tidak ada autentikasi tambahan |

**Improvement Priority: MEDIUM**

---

## 3. Daftar Improvement yang Sudah Diidentifikasi User

### 3.1 Field Tanggal harus pakai Date Picker yang proper

**Status saat ini:**
- Sebagian form sudah menggunakan native HTML `<input type="date">` (Penawaran, PO, BAP, Bayar, Keuangan, HR Rekap)
- Namun native date picker terbatas dalam UX — tidak ada kalender visual yang baik, tidak ada range picker, tidak ada preset (hari ini, minggu ini, bulan ini)
- Beberapa modul **sama sekali tidak ada date picker** (PR, Pembanding, Anggaran, Customer, Project List)

**Rekomendasi:**
- Ganti semua field tanggal dengan library date picker yang lebih kaya fitur (misal: `react-datepicker`, MUI DatePicker, atau shadcn/ui Calendar + Popover)
- Tambahkan preset filter periode: Hari Ini, Minggu Ini, Bulan Ini, Kuartal Ini, Tahun Ini, Custom Range
- Konsistenkan format tanggal di seluruh aplikasi (DD MMM YYYY)

**Priority: HIGH**

---

### 3.2 Kwitansi harus bisa di-export

**Status saat ini:**
- Halaman Invoice & Kwitansi (`keuangan/invoice/page.tsx`) menampilkan daftar kwitansi dengan status
- Tombol export di header hanya `alert("Export Invoice")` — **tidak berfungsi**
- Tidak ada tombol export/print untuk kwitansi individual

**Rekomendasi:**
- Tambahkan tombol **"Cetak Kwitansi"** di setiap row/item kwitansi
- Implementasi export kwitansi ke **PDF** dengan format standar kwitansi Indonesia (nomor, terima dari, uang sejumlah, untuk pembayaran, tanggal, tanda tangan)
- Export daftar kwitansi ke **Excel** untuk keperluan laporan
- Gunakan `exportUtils.ts` yang sudah ada (menggunakan `jsPDF` + `jspdf-autotable` dan `xlsx`)

**Priority: HIGH**

---

### 3.3 Tiap Project Detail bisa di-export

**Status saat ini:**
- Halaman Detail Project (`project/[id]/client.tsx`) memiliki 7 tabs lengkap
- Tidak ada tombol export/print untuk keseluruhan detail project
- Summary cards (nilai kontrak, pemasukan, pengeluaran) ada tapi hanya untuk 1 project

**Rekomendasi:**
- Tambahkan tombol **"Export Project Report"** di header halaman detail project
- Export ke **PDF** yang mencakup:
  - Informasi pekerjaan (detail project)
  - Summary finansial (nilai kontrak, pemasukan, pengeluaran, sisa)
  - Tabel pengajuan, pemasukan, pengeluaran, hutang/piutang
  - Daftar dokumen arsip
- Export ke **Excel** dengan multiple sheets (1 sheet per tab)
- Tambahkan juga tombol **"Print"** untuk print-friendly view

**Priority: HIGH**

---

## 4. Temuan Tambahan (Critical Issues)

### 4.1 Upload File Belum Berfungsi di Semua Modul

**Lokasi:** Penawaran, Pembanding, BAP, Detail Project (Dokumen)
**Status:** Visual drag-drop area ada, tapi tidak ada handler `onChange`/`onDrop`
**Impact:** User tidak bisa upload dokumen lampiran (kontrak, BAST, invoice, kwitansi, penawaran)
**Rekomendasi:** Implementasi upload handler + storage (localStorage untuk demo, atau API untuk production)

### 4.2 Data Hardcoded di Hampir Semua Halaman

**Lokasi:** Semua halaman kecuali beberapa yang menggunakan `localStorage`
**Impact:** Aplikasi tidak bisa digunakan untuk data riil; setiap refresh kembali ke data awal
**Rekomendasi:** Integrasi dengan backend API/database

### 4.3 Tidak Ada Export/Print di Modul Pengadaan

**Lokasi:** PR, Pembanding, PO, BAP, Listing Bayar
**Impact:** User tidak bisa mencetak/mengekspor dokumen-dokumen penting
**Rekomendasi:**
- **PR:** Export daftar PR ke Excel
- **Pembanding:** Export tabel komparasi harga ke PDF/Excel
- **PO:** Cetak PO ke PDF (format standar PO)
- **BAP:** Cetak BAP ke PDF (format standar BAP)
- **Listing Bayar:** Export daftar pembayaran ke Excel

### 4.4 Terbilang Otomatis Belum Ada di BAP

**Lokasi:** `pengadaan/bap/page.tsx` dan `pengadaan/bap/[id]/client.tsx`
**Status:** Field "Terbilang" masih placeholder ("-" atau "nol")
**Impact:** BAP tidak bisa digunakan untuk pembayaran riil
**Rekomendasi:** Tambahkan fungsi konversi angka ke terbilang Bahasa Indonesia

### 4.5 AI Asisten Hanya Mockup Statis

**Lokasi:** `components/AiChatWidget.tsx`, `keuangan.html`
**Status:** UI chat ada tapi tidak terhubung ke API/LLM
**Rekomendasi:** Integrasi dengan OpenAI API atau local LLM untuk tanya data keuangan & history harga barang

### 4.6 Face ID Hanya Simulasi Loading

**Lokasi:** `hr/page.tsx`
**Status:** `setTimeout` untuk simulasi scanning, tidak ada deteksi wajah nyata
**Rekomendasi:** Integrasi dengan library face recognition (Face API.js atau backend face recognition)

### 4.7 Tidak Ada Notifikasi Approval

**PRD Meminta:** Notifikasi approval ke pengguna yang bersangkutan
**Status:** Approval tracker visual ada, tapi tidak ada sistem notifikasi (in-app, email, atau push)
**Rekomendasi:** Implementasi notifikasi in-app + badge counter di sidebar

### 4.8 Grafik/Chart Tidak Ada di Semua Dashboard & Laporan

**Lokasi:** Dashboard, Keuangan, Anggaran, Project
**Status:** Tidak ada library chart (Recharts, Chart.js, ApexCharts) yang digunakan
**Rekomendasi:** Tambahkan chart untuk visualisasi data:
- Dashboard: trend project, penawaran, cashflow
- Keuangan: trend neraca, laba rugi, cashflow per periode
- Anggaran: donut chart kategori anggaran
- Project: progress bar yang dinamis

### 4.9 Tab "Anggaran vs Realisasi" di Project Detail Kosong

**Lokasi:** `project/[id]/client.tsx` — tab `anggaran`
**Status:** Tab ada di navigation tapi **konten tidak diimplementasikan**
**Impact:** Salah satu fitur kunci PRD tidak ada
**Rekomendasi:** Implementasi tabel komparasi anggaran vs realisasi per kategori (Material, Operasional, Pajak) dengan progress bar & selisih

---

## 5. Prioritas Perbaikan (Recommended Roadmap)

### Phase 1 — Critical (Wajib Sebelum UAT)

| No | Improvement | Modul | Effort |
|----|-------------|-------|--------|
| 1 | **Date picker proper** (ganti native `type="date"` dengan library) | Semua modul | Medium |
| 2 | **Export kwitansi** ke PDF (format standar kwitansi) | Keuangan | Medium |
| 3 | **Export detail project** ke PDF/Excel | Project | Medium |
| 4 | **Upload file berfungsi** (handler + preview) | Penawaran, Pembanding, BAP, Project | Medium |
| 5 | **Terbilang otomatis** di BAP | Pengadaan | Low |
| 6 | **Tombol Cetak PO** berfungsi | Pengadaan | Low |
| 7 | **Export BAP** ke PDF | Pengadaan | Medium |
| 8 | **Tab Anggaran vs Realisasi** di Project Detail | Project | Medium |
| 9 | **Export laporan keuangan** (Neraca, Laba Rugi, Cashflow, Hutang Piutang) | Keuangan | Low |

### Phase 2 — Important (Sebelum Go-Live)

| No | Improvement | Modul | Effort |
|----|-------------|-------|--------|
| 10 | **Export Pembanding** ke PDF/Excel | Pengadaan | Low |
| 11 | **Export daftar PR** ke Excel | Pengadaan | Low |
| 12 | **Export daftar pembayaran** ke Excel | Pengadaan | Low |
| 13 | **Export rekap absensi** ke Excel | HR | Low |
| 14 | **Notifikasi approval** (in-app badge + counter) | Pengadaan, Operasional | High |
| 15 | **Grafik/chart** di dashboard & laporan | Dashboard, Keuangan, Anggaran | Medium |
| 16 | **Upload bukti pembayaran** di Listing Bayar | Pengadaan | Low |
| 17 | **Alert overbudget** di Anggaran | Anggaran | Low |

### Phase 3 — Enhancement (Post Go-Live)

| No | Improvement | Modul | Effort |
|----|-------------|-------|--------|
| 18 | **AI Asisten** terintegrasi dengan API | Keuangan | High |
| 19 | **Face ID** dengan library face recognition | HR | High |
| 20 | **Gantt chart / timeline** project | Project | Medium |
| 21 | **Activity log / comment** per project | Project | Low |
| 22 | **Vendor scoring** & history | Pengadaan | Medium |
| 23 | **Manajemen cuti & lembur** | HR | Medium |
| 24 | **Forgot password & 2FA** | Auth | Medium |
| 25 | **Role-based access control** (RBAC) di UI | Auth | High |

---

## 6. Catatan Teknis

### Library Export yang Sudah Tersedia
```typescript
// lib/exportUtils.ts
export function exportToPDF(title, headers, rows, filename)
export function exportToExcel(title, headers, rows, filename)
```

Library sudah terinstall:
- `jspdf` + `jspdf-autotable` untuk PDF
- `xlsx` untuk Excel

Komponen `ExportButtons.tsx` juga sudah ada. Hanya perlu dihubungkan ke data yang sesuai di setiap halaman.

### Date Picker Recommendation
Gunakan **shadcn/ui Calendar + Popover** atau **react-datepicker** untuk pengalaman yang lebih baik daripada native `type="date"`.

### Upload File Recommendation
Untuk MVP, bisa menggunakan upload ke `localStorage` (base64) atau simulated upload. Untuk production, gunakan API endpoint dengan storage (S3, Cloudflare R2, atau local server storage).

---

## 7. Kesimpulan

UI GAC-ERP sudah memiliki **struktur modul yang lengkap** dan **visual yang cukup baik**, namun **fungsionalitas masih banyak yang berupa placeholder**. Tiga improvement utama yang user sebutkan (date picker, export kwitansi, export detail project) adalah kebutuhan yang valid dan **sangat penting** untuk kelancaran operasional.

**Rekomendasi utama:**
1. Fokus pada **Phase 1** terlebih dahulu — fitur export, date picker, upload file, dan terbilang otomatis adalah low-hanging fruits yang sangat berdampak.
2. Gunakan `exportUtils.ts` dan `ExportButtons.tsx` yang sudah ada untuk mempercepat implementasi export di semua modul.
3. Jangan lupa mengisi tab **"Anggaran vs Realisasi"** di Project Detail karena ini adalah fitur kunci dari PRD.

---

*Assessment ini disusun berdasarkan PRD v1.1 dan codebase per 26 Mei 2026.*
