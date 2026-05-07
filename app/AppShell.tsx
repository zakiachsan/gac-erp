"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="flex h-screen overflow-hidden">
      {!isLogin && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
