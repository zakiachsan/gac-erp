import PembandingDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "PB-001" },
    { id: "PB-002" },
    { id: "PB-003" },
  ];
}

export default function Page() {
  return <PembandingDetailClient />;
}
