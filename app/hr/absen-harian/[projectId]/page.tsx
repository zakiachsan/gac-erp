import AbsenHarianClient from "./client";

export function generateStaticParams() {
  return [
    { projectId: "PRJ-2026-0001" },
    { projectId: "PRJ-2026-0002" },
    { projectId: "PRJ-2026-0003" },
  ];
}

export default function AbsenHarianPage() {
  return <AbsenHarianClient />;
}
