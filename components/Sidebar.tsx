"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  LayoutDashboard, FileText, BarChart3, Wallet, ShoppingCart,
  Banknote, Users, LogOut, Box, Shield, UsersRound, Building2,
  ChevronRight, Circle, Truck, Receipt, Scale, TrendingUp,
  ArrowDownLeft, Landmark,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  group?: string;
  children?: { href: string; label: string }[];
}

const menus: Record<string, { section: string; items: MenuItem[] }[]> = {
  super_admin: [
    { section: "Menu Utama", items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/hr", label: "Absensi", icon: Users },
    ]},
    { section: "Penjualan", items: [
      { href: "/penawaran", label: "Penawaran", icon: FileText },
      { href: "/project", label: "Detail Project", icon: BarChart3 },
    ]},
    { section: "Operasional", items: [
      {
        href: "/pengadaan/pr",
        label: "Pengadaan",
        icon: ShoppingCart,
        group: "/pengadaan",
        children: [
          { href: "/pengadaan/pr", label: "1. Pengajuan Barang & Jasa" },
          { href: "/pengadaan/pembanding", label: "2. Pembanding" },
          { href: "/pengadaan/po", label: "3. PO" },
          { href: "/pengadaan/bap", label: "4. BAP" },
          { href: "/pengadaan/bayar", label: "5. Listing Bayar" },
          { href: "/pengadaan/laporan", label: "6. Laporan" },
        ],
      },
      { href: "/anggaran", label: "Anggaran", icon: Wallet },
      {
        href: "/operasional/pengajuan",
        label: "Biaya Operasional",
        icon: Receipt,
        group: "/operasional",
        children: [
          { href: "/operasional/pengajuan", label: "1. Pengajuan Biaya" },
          { href: "/operasional/bayar", label: "2. Listing Bayar" },
          { href: "/operasional/laporan", label: "3. Laporan" },
        ],
      },
    ]},
    { section: "Keuangan", items: [
      {
        href: "/keuangan/neraca",
        label: "Keuangan",
        icon: Banknote,
        group: "/keuangan",
        children: [
          { href: "/keuangan/neraca", label: "Neraca" },
          { href: "/keuangan/laba-rugi", label: "Laba Rugi" },
          { href: "/keuangan/cashflow", label: "Cashflow" },
          { href: "/keuangan/hutang-piutang", label: "Hutang / Piutang" },
          { href: "/keuangan/perpajakan", label: "Perpajakan" },
          { href: "/keuangan/dana", label: "Dana Masuk / Keluar" },
          { href: "/keuangan/invoice", label: "Invoice & Kwitansi" },
        ],
      },
    ]},
    { section: "Pengaturan", items: [
      { href: "/admin/user-management", label: "User Management", icon: UsersRound },
      { href: "/vendor", label: "Vendor", icon: Truck },
      { href: "/super-admin", label: "Kelola Perusahaan", icon: Shield },
    ]},
  ],
  admin_perusahaan: [
    { section: "Menu Utama", items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/hr", label: "Absensi", icon: Users },
    ]},
    { section: "Penjualan", items: [
      { href: "/penawaran", label: "Penawaran", icon: FileText },
      { href: "/project", label: "Detail Project", icon: BarChart3 },
      { href: "/customer", label: "Customer", icon: Building2 },
    ]},
    { section: "Operasional", items: [
      {
        href: "/pengadaan/pr",
        label: "Pengadaan",
        icon: ShoppingCart,
        group: "/pengadaan",
        children: [
          { href: "/pengadaan/pr", label: "1. Pengajuan Barang & Jasa" },
          { href: "/pengadaan/pembanding", label: "2. Pembanding" },
          { href: "/pengadaan/po", label: "3. PO" },
          { href: "/pengadaan/bap", label: "4. BAP" },
          { href: "/pengadaan/bayar", label: "5. Listing Bayar" },
          { href: "/pengadaan/laporan", label: "6. Laporan" },
        ],
      },
      { href: "/anggaran", label: "Anggaran", icon: Wallet },
      {
        href: "/operasional/pengajuan",
        label: "Biaya Operasional",
        icon: Receipt,
        group: "/operasional",
        children: [
          { href: "/operasional/pengajuan", label: "1. Pengajuan Biaya" },
          { href: "/operasional/bayar", label: "2. Listing Bayar" },
          { href: "/operasional/laporan", label: "3. Laporan" },
        ],
      },
    ]},
    { section: "Keuangan", items: [
      {
        href: "/keuangan/neraca",
        label: "Keuangan",
        icon: Banknote,
        group: "/keuangan",
        children: [
          { href: "/keuangan/neraca", label: "Neraca" },
          { href: "/keuangan/laba-rugi", label: "Laba Rugi" },
          { href: "/keuangan/cashflow", label: "Cashflow" },
          { href: "/keuangan/hutang-piutang", label: "Hutang / Piutang" },
          { href: "/keuangan/perpajakan", label: "Perpajakan" },
          { href: "/keuangan/dana", label: "Dana Masuk / Keluar" },
          { href: "/keuangan/invoice", label: "Invoice & Kwitansi" },
        ],
      },
    ]},
    { section: "Pengaturan", items: [
      { href: "/admin/user-management", label: "User Management", icon: UsersRound },
      { href: "/vendor", label: "Vendor", icon: Truck },
    ]},
  ],
  staff: [
    { section: "Menu", items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/hr", label: "Absensi", icon: Users },
      { href: "/penawaran", label: "Penawaran", icon: FileText },
      { href: "/project", label: "Detail Project", icon: BarChart3 },
      { href: "/customer", label: "Customer", icon: Building2 },
      {
        href: "/pengadaan/pr",
        label: "Pengadaan",
        icon: ShoppingCart,
        group: "/pengadaan",
        children: [
          { href: "/pengadaan/pr", label: "1. Pengajuan Barang & Jasa" },
          { href: "/pengadaan/pembanding", label: "2. Pembanding" },
          { href: "/pengadaan/po", label: "3. PO" },
          { href: "/pengadaan/bap", label: "4. BAP" },
          { href: "/pengadaan/bayar", label: "5. Listing Bayar" },
          { href: "/pengadaan/laporan", label: "6. Laporan" },
        ],
      },
      {
        href: "/operasional/pengajuan",
        label: "Biaya Operasional",
        icon: Receipt,
        group: "/operasional",
        children: [
          { href: "/operasional/pengajuan", label: "1. Pengajuan Biaya" },
          { href: "/operasional/bayar", label: "2. Listing Bayar" },
          { href: "/operasional/laporan", label: "3. Laporan" },
        ],
      },
      {
        href: "/keuangan/neraca",
        label: "Keuangan",
        icon: Banknote,
        group: "/keuangan",
        children: [
          { href: "/keuangan/neraca", label: "Neraca" },
          { href: "/keuangan/laba-rugi", label: "Laba Rugi" },
          { href: "/keuangan/cashflow", label: "Cashflow" },
          { href: "/keuangan/hutang-piutang", label: "Hutang / Piutang" },
          { href: "/keuangan/perpajakan", label: "Perpajakan" },
          { href: "/keuangan/dana", label: "Dana Masuk / Keluar" },
          { href: "/keuangan/invoice", label: "Invoice & Kwitansi" },
        ],
      },
      { href: "/anggaran", label: "Anggaran", icon: Wallet },
      { href: "/keuangan", label: "Keuangan", icon: Banknote },
    ]},
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const menu = menus[role] || menus["staff"];

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin_perusahaan: "Admin Perusahaan",
    staff: "Karyawan / Staf",
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white mr-3">
          <Box className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-tight">ERP GAC</div>
          <div className="text-[10px] text-slate-500 leading-tight">{roleLabels[role]}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menu.map((group) => (
          <div key={group.section}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2 px-3">
              {group.section}
            </div>
            {group.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const groupMatch = item.group ? pathname.startsWith(item.group) : false;
              const isParentActive = hasChildren && groupMatch;
              const isItemActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isItemActive || isParentActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="flex-1">{item.label}</span>
                    {hasChildren && (
                      <ChevronRight className={`w-4 h-4 transition-transform ${isParentActive ? "rotate-90" : ""}`} />
                    )}
                  </Link>
                  {hasChildren && groupMatch && (
                    <div className="ml-4 mt-0.5 mb-1 space-y-0.5">
                      {item.children!.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                              childActive
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            <Circle className={`w-1.5 h-1.5 ${childActive ? "fill-blue-600 text-blue-600" : "fill-slate-300 text-slate-300"}`} />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" className="w-9 h-9 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">User</div>
            <div className="text-xs text-slate-500 truncate">{roleLabels[role]}</div>
          </div>
          <Link href="/login" className="text-slate-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
