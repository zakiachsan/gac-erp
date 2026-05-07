import PenawaranDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "QT-2026-0017" },
    { id: "QT-2026-0018" },
    { id: "QT-2026-0019" },
    { id: "QT-2026-0020" },
  ];
}

export default function Page() {
  return <PenawaranDetailClient />;
}
