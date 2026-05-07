import BAPDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "BAP-001" },
    { id: "BAP-002" },
    { id: "BAP-003" },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <BAPDetailClient id={params.id} />;
}
