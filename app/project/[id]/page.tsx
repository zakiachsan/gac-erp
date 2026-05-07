import ProjectDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "PRJ-2026-0001" },
    { id: "PRJ-2026-0002" },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailClient id={params.id} />;
}
