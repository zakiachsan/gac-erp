import VendorDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "VND-001" },
    { id: "VND-002" },
    { id: "VND-003" },
    { id: "VND-004" },
    { id: "VND-005" },
    { id: "VND-006" },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <VendorDetailClient id={params.id} />;
}
