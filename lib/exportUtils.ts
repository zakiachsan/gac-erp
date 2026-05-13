"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 22,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [22, 119, 255], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 248, 255] },
    margin: { top: 20, left: 10, right: 10, bottom: 10 },
  });
  doc.save(filename);
}

export function exportToExcel(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, filename);
}

export function fmtNum(n: number): string {
  return n.toLocaleString("id-ID");
}
