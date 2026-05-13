"use client";

import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  className?: string;
}

export default function ExportButtons({ onExportPDF, onExportExcel, className = "" }: ExportButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-lg transition"
        title="Export PDF"
      >
        <FileText className="w-3.5 h-3.5" />
        PDF
      </button>
      <button
        onClick={onExportExcel}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg transition"
        title="Export Excel"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Excel
      </button>
    </div>
  );
}
