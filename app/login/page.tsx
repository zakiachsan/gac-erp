"use client";

import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/context/RoleContext";
import { Box, Mail, Lock, Shield, Building2, Users } from "lucide-react";

const roles: { id: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "super_admin", label: "Super Admin", desc: "Kelola seluruh tenant & sistem", icon: Shield },
  { id: "admin_perusahaan", label: "Admin Perusahaan", desc: "Kelola data, user & approval", icon: Building2 },
  { id: "staff", label: "Karyawan / Staf", desc: "Marketing, sales, pengaju, approval", icon: Users },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleLogin = (r: UserRole) => {
    setRole(r);
    if (r === "super_admin") {
      router.push("/super-admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ERP GAC</h1>
              <p className="text-xs text-slate-500">PT Gemilang Agung Cemerlang</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-2">Masukkan kredensial untuk mengakses sistem.</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="email" defaultValue="user@gemilangagung.co.id" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input type="password" defaultValue="password123" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pilih Role untuk Demo</p>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleLogin(r.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800">{r.label}</div>
                      <div className="text-xs text-slate-500">{r.desc}</div>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
