export interface ItemRow {
  nama: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
}

export interface VendorItem {
  id: string;
  supplier: string;
  harga: string;
  fileName: string;
  fileSize: string;
  pilihan: "Dipilih" | "Alternatif";
  items: ItemRow[];
}

export interface ProjectPembanding {
  id: string;
  nomor: string;
  projectId: string;
  nama: string;
  vendors: VendorItem[];
}

export const satuanList = [
  "unit", "set", "pcs", "tabung", "sak", "batang", "lembar", "kaleng", "kg", "m", "m2", "m3",
  "ls", "hr", "bln", "thn", "orang", "lot", "batch", "roll", "buah", "pack", "box", "dus",
  "rim", "gln", "liter", "ton", "kwintal", "meter",
];

export const fmt = (n: number) => {
  if (n === 0) return "Rp 0";
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const ribuan = (n: number) => {
  if (n === 0) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseNum = (s: string) => parseInt(String(s).replace(/\D/g, "")) || 0;

export const recalcVendor = (v: VendorItem): VendorItem => {
  const total = v.items.reduce((sum, it) => sum + it.qty * it.hargaSatuan, 0);
  return { ...v, harga: fmt(total) };
};

export const initialProjects: ProjectPembanding[] = [
  {
    id: "PB-001",
    nomor: "Rev.014/RPHP.MRC-ME/TKN.ASYA/IX/2024",
    projectId: "PRJ-2026-0001",
    nama: "Pengadaan AC Kantor Pusat",
    vendors: [
      {
        id: "VND-001",
        supplier: "PT CoolTech",
        harga: "Rp 63.800.000",
        fileName: "Penawaran_CoolTech.pdf",
        fileSize: "1.2 MB",
        pilihan: "Dipilih",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4200000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3100000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 850000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 375000 },
        ],
      },
      {
        id: "VND-002",
        supplier: "PT AirSolutions",
        harga: "Rp 68.650.000",
        fileName: "Penawaran_AirSolutions.pdf",
        fileSize: "980 KB",
        pilihan: "Alternatif",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4550000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3350000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 900000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 370000 },
        ],
      },
      {
        id: "VND-005",
        supplier: "CV Karya Mandiri",
        harga: "Rp 65.200.000",
        fileName: "Penawaran_KaryaMandiri.pdf",
        fileSize: "1.1 MB",
        pilihan: "Alternatif",
        items: [
          { nama: "AC Split 2 PK", qty: 10, satuan: "unit", hargaSatuan: 4350000 },
          { nama: "AC Split 1 PK", qty: 5, satuan: "unit", hargaSatuan: 3200000 },
          { nama: "Freon R410A", qty: 3, satuan: "tabung", hargaSatuan: 875000 },
          { nama: "Pipa Set + Instalasi", qty: 10, satuan: "set", hargaSatuan: 307500 },
        ],
      },
    ],
  },
  {
    id: "PB-002",
    nomor: "Rev.015/RPHP.MRC-ME/TKN.BETA/X/2024",
    projectId: "PRJ-2026-0002",
    nama: "Pemasangan Pompa Industri",
    vendors: [
      {
        id: "VND-003",
        supplier: "PT Delta Jaya",
        harga: "Rp 32.500.000",
        fileName: "Penawaran_DeltaJaya.pdf",
        fileSize: "850 KB",
        pilihan: "Alternatif",
        items: [
          { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 14000000 },
          { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4500000 },
        ],
      },
      {
        id: "VND-004",
        supplier: "PT Maju Bersama",
        harga: "Rp 30.750.000",
        fileName: "Penawaran_MajuBersama.pdf",
        fileSize: "720 KB",
        pilihan: "Dipilih",
        items: [
          { nama: "Pompa Air Industri 5HP", qty: 2, satuan: "unit", hargaSatuan: 13250000 },
          { nama: "Pompa Submersible 3HP", qty: 1, satuan: "unit", hargaSatuan: 4250000 },
        ],
      },
    ],
  },
  {
    id: "PB-003",
    nomor: "Rev.016/RPHP.MRC-ME/TKN.GAMA/XI/2024",
    projectId: "PRJ-2026-0003",
    nama: "Renovasi & Material Gudang",
    vendors: [
      {
        id: "VND-006",
        supplier: "PT Sejahtera Abadi",
        harga: "Rp 125.500.000",
        fileName: "Penawaran_Sejahtera.pdf",
        fileSize: "1.5 MB",
        pilihan: "Dipilih",
        items: [
          { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 72000 },
          { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 95000 },
          { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 85000 },
          { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 195000 },
          { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 90700000 },
        ],
      },
      {
        id: "VND-007",
        supplier: "PT Delta Jaya",
        harga: "Rp 132.000.000",
        fileName: "Penawaran_DeltaJaya_Gudang.pdf",
        fileSize: "1.3 MB",
        pilihan: "Alternatif",
        items: [
          { nama: "Semen Portland 50kg", qty: 100, satuan: "sak", hargaSatuan: 75000 },
          { nama: "Besi Beton D10", qty: 50, satuan: "batang", hargaSatuan: 98000 },
          { nama: "Papan Gypsum 9mm", qty: 200, satuan: "lembar", hargaSatuan: 88000 },
          { nama: "Cat Tembok 5L", qty: 30, satuan: "kaleng", hargaSatuan: 200000 },
          { nama: "Jasa Renovasi", qty: 1, satuan: "ls", hargaSatuan: 96000000 },
        ],
      },
    ],
  },
];
