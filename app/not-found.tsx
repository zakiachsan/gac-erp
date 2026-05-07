import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-lg text-slate-600 mb-6">Halaman tidak ditemukan.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
