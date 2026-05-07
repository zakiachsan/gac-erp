import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RoleProvider } from "@/context/RoleContext";
import AppShell from "./AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERP GAC — PT Gemilang Agung Cemerlang",
  description: "ERP SCM & Keuangan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-800 font-[family-name:var(--font-inter)]">
        <RoleProvider>
          <AppShell>{children}</AppShell>
        </RoleProvider>
      </body>
    </html>
  );
}
