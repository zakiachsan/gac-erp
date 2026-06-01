# Database Design (ERD)
## ERP SCM & Keuangan — PT Gemilang Agung Cemerlang

```mermaid
erDiagram
    TENANTS {
        uuid id PK
        string nama_perusahaan
        string slug
        string alamat
        string telepon
        string email
        string logo_url
        boolean is_active
        timestamp created_at
    }

    USERS {
        uuid id PK
        uuid tenant_id FK
        string nama
        string email
        string password
        enum role "super_admin|admin|staff"
        enum jabatan
        string telepon
        string face_embedding
        boolean is_active
        timestamp created_at
    }

    CUSTOMERS {
        uuid id PK
        uuid tenant_id FK
        string nama_customer
        string alamat
        string contact_person
        string email
        string vms_link
        int total_project
        decimal total_nilai_kontrak
        timestamp created_at
    }

    SUPPLIERS {
        uuid id PK
        uuid tenant_id FK
        string nama_supplier
        string alamat
        string contact_person
        string email
        string telepon
        timestamp created_at
    }

    PENAWARAN {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        uuid marketing_id FK
        string nomor_penawaran
        date tanggal
        decimal total_harga
        enum status "draft|submit|negosiasi|close_menang|close_kalah"
        boolean is_menang
        int versi_submit
        text keterangan
        timestamp created_at
    }

    PENAWARAN_ITEM {
        uuid id PK
        uuid penawaran_id FK
        string nama_barang_jasa
        int qty
        decimal harga_satuan
        decimal total
        text keterangan
    }

    PROJECTS {
        uuid id PK
        uuid tenant_id FK
        uuid penawaran_id FK
        uuid customer_id FK
        string nama_project
        string nomor_kontrak
        decimal nilai_project
        date tanggal_mulai
        date tanggal_selesai
        enum status "aktif|selesai|batal"
        text keterangan
        timestamp created_at
    }

    ANGGARAN {
        uuid id PK
        uuid tenant_id FK
        uuid project_id FK
        decimal total_material
        decimal total_biaya_ops
        decimal total_pajak
        decimal total_anggaran
        timestamp created_at
    }

    ANGGARAN_ITEM {
        uuid id PK
        uuid anggaran_id FK
        enum tipe "material|biaya_ops|pajak"
        string nama_item
        decimal nilai_anggaran
        decimal nilai_realisasi
        text keterangan
    }

    PENGADAAN {
        uuid id PK
        uuid tenant_id FK
        uuid project_id FK
        uuid pengaju_id FK
        enum jenis "barang_jasa|biaya_ops"
        string nomor_pengajuan
        date tanggal
        enum status "draft|menunggu_mengetahui|menunggu_menyetujui|disetujui|ditolak"
        decimal total_nilai
        text keterangan
        timestamp created_at
    }

    PENGADAAN_ITEM {
        uuid id PK
        uuid pengadaan_id FK
        string nama_barang_jasa
        int qty
        decimal harga_satuan
        decimal total
        text keterangan
    }

    PEMBANDING_VENDOR {
        uuid id PK
        uuid pengadaan_id FK
        uuid supplier_id FK
        decimal harga_penawaran
        string lampiran_url
        boolean is_dipilih
        text keterangan
    }

    PURCHASE_ORDERS {
        uuid id PK
        uuid tenant_id FK
        uuid pengadaan_id FK
        uuid supplier_id FK
        string nomor_po
        date tanggal
        decimal total
        enum status "draft|approved"
        text keterangan
    }

    BAP {
        uuid id PK
        uuid tenant_id FK
        uuid po_id FK
        string nomor_bap
        date tanggal
        string lampiran_ba_progres
        string lampiran_bast
        string lampiran_kwitansi
        string lampiran_invoice_vendor
        enum status "draft|approved"
        decimal nilai_pembayaran
    }

    LISTING_PEMBAYARAN {
        uuid id PK
        uuid tenant_id FK
        uuid bap_id FK
        uuid pengadaan_biaya_id FK
        enum jenis "pengadaan|biaya_ops"
        string keterangan
        decimal jumlah
        boolean is_dibayar
        date jatuh_tempo
    }

    TRANSAKSI_KEUANGAN {
        uuid id PK
        uuid tenant_id FK
        uuid project_id FK
        enum tipe "masuk|keluar"
        enum kategori "penjualan|pembelian|biaya_ops|pajak|lainnya"
        string nomor_transaksi
        date tanggal
        decimal jumlah
        string metode_pembayaran
        string keterangan
        uuid listing_pembayaran_id FK
        timestamp created_at
    }

    INVOICE {
        uuid id PK
        uuid tenant_id FK
        uuid project_id FK
        uuid customer_id FK
        string nomor_invoice
        date tanggal
        date jatuh_tempo
        decimal total
        decimal pajak
        decimal grand_total
        enum status "draft|terbit|dibayar|batal"
    }

    KWITANSI {
        uuid id PK
        uuid tenant_id FK
        uuid invoice_id FK
        string nomor_kwitansi
        date tanggal
        decimal jumlah
        string keterangan
    }

    PAJAK {
        uuid id PK
        uuid tenant_id FK
        uuid transaksi_id FK
        enum jenis "masukan|keluaran"
        string nomor_faktur
        date tanggal
        decimal dpp
        decimal ppn
        decimal total_pajak
        enum status "normal|lebih_bayar|kurang_bayar"
    }

    ABSENSI {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        enum tipe_karyawan "staff|harian"
        date tanggal
        time jam_masuk
        time jam_keluar
        enum status "hadir|izin|sakit|alfa"
        string face_match_score
        string nama_manual
        timestamp created_at
    }

    DOKUMEN_ARSIP {
        uuid id PK
        uuid tenant_id FK
        uuid project_id FK
        enum jenis "kontrak|bast|invoice|kwitansi|ba_progres|lainnya"
        string nama_file
        string file_url
        date tanggal_upload
        text keterangan
    }

    AI_CHAT {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        text pertanyaan
        text jawaban
        timestamp created_at
    }

    APPROVAL_LOG {
        uuid id PK
        uuid tenant_id FK
        uuid pengadaan_id FK
        uuid approver_id FK
        enum level "mengetahui|menyetujui"
        enum action "approve|reject"
        text catatan
        timestamp created_at
    }

    TENANTS ||--o{ USERS : employs
    TENANTS ||--o{ CUSTOMERS : has
    TENANTS ||--o{ SUPPLIERS : has
    TENANTS ||--o{ PROJECTS : manages
    TENANTS ||--o{ PENGADAAN : processes
    TENANTS ||--o{ TRANSAKSI_KEUANGAN : records
    TENANTS ||--o{ ABSENSI : tracks
    TENANTS ||--o{ DOKUMEN_ARSIP : stores
    TENANTS ||--o{ AI_CHAT : logs
    TENANTS ||--o{ INVOICE : issues
    TENANTS ||--o{ PAJAK : calculates

    CUSTOMERS ||--o{ PENAWARAN : receives
    USERS ||--o{ PENAWARAN : creates
    PENAWARAN ||--o{ PENAWARAN_ITEM : contains
    PENAWARAN ||--|| PROJECTS : generates
    CUSTOMERS ||--o{ PROJECTS : owns

    PROJECTS ||--o{ ANGGARAN : budgets
    ANGGARAN ||--o{ ANGGARAN_ITEM : details
    PROJECTS ||--o{ TRANSAKSI_KEUANGAN : finances
    PROJECTS ||--o{ DOKUMEN_ARSIP : archives

    PENGADAAN ||--o{ PENGADAAN_ITEM : lists
    PENGADAAN ||--o{ PEMBANDING_VENDOR : compares
    SUPPLIERS ||--o{ PEMBANDING_VENDOR : bids
    PEMBANDING_VENDOR ||--o{ PURCHASE_ORDERS : selected_for
    PURCHASE_ORDERS ||--o{ BAP : validates
    BAP ||--o{ LISTING_PEMBAYARAN : payable
    LISTING_PEMBAYARAN ||--o{ TRANSAKSI_KEUANGAN : paid_via

    INVOICE ||--o{ KWITANSI : receipts
    TRANSAKSI_KEUANGAN ||--o{ PAJAK : taxed

    USERS ||--o{ ABSENSI : attends
    PENGADAAN ||--o{ APPROVAL_LOG : audits
    USERS ||--o{ APPROVAL_LOG : approves
```

## Catatan Desain Database

1. **Multi-Tenancy**: Semua tabel memiliki `tenant_id` untuk isolasi data antar perusahaan.
2. **Approval Berjenjang**: `PENGADAAN` memiliki status bertahap. `APPROVAL_LOG` menyimpan jejak audit setiap approval/rejection.
3. **Face Recognition**: Kolom `face_embedding` di `USERS` menyimpan vektor wajah untuk Face ID attendance.
4. **Penawaran → Project**: Relasi 1:1 antara `PENAWARAN` (yang menang) dan `PROJECTS`.
5. **Anggaran Real-Time**: `ANGGARAN_ITEM.nilai_realisasi` diupdate otomatis dari transaksi pengadaan.
6. **Pajak**: Tabel `PAJAK` terpisah untuk monitoring Pajak Masukan & Keluaran per transaksi.
