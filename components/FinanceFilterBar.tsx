"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Download, ChevronDown, SlidersHorizontal, X } from "lucide-react";

const quickOptions = [
  { value: "today", label: "Hari Ini" },
  { value: "thisWeek", label: "Minggu Ini" },
  { value: "thisMonth", label: "Bulan Ini" },
  { value: "lastMonth", label: "Bulan Lalu" },
  { value: "thisYear", label: "Tahun Ini" },
  { value: "custom", label: "Custom Range" },
];

function getQuickDates(value: string) {
  switch (value) {
    case "today": return { from: "2026-05-06", to: "2026-05-06" };
    case "thisWeek": return { from: "2026-05-04", to: "2026-05-10" };
    case "thisMonth": return { from: "2026-05-01", to: "2026-05-31" };
    case "lastMonth": return { from: "2026-04-01", to: "2026-04-30" };
    case "thisYear": return { from: "2026-01-01", to: "2026-12-31" };
    default: return { from: "2026-05-01", to: "2026-05-31" };
  }
}

interface FinanceFilterBarProps {
  onChange?: (filters: { from: string; to: string; quick: string }) => void;
  onExport?: () => void;
  extraFilters?: React.ReactNode;
  defaultQuick?: string;
  hideQuickFilter?: boolean;
  hideDateRange?: boolean;
  singleDate?: boolean;
  singleDateLabel?: string;
}

export default function FinanceFilterBar({
  onChange,
  onExport,
  extraFilters,
  defaultQuick = "thisMonth",
  hideQuickFilter = false,
  hideDateRange = false,
  singleDate = false,
  singleDateLabel = "Per Tanggal",
}: FinanceFilterBarProps) {
  const [quick, setQuick] = useState(defaultQuick);
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-31");
  const [showExtra, setShowExtra] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!hideQuickFilter && quick !== "custom") {
      const d = getQuickDates(quick);
      setFrom(d.from);
      setTo(d.to);
      onChange?.({ from: d.from, to: d.to, quick });
    }
  }, [quick, hideQuickFilter, onChange]);

  const handleFromChange = (val: string) => {
    setFrom(val);
    setQuick("custom");
    onChange?.({ from: val, to, quick: "custom" });
  };

  const handleToChange = (val: string) => {
    setTo(val);
    setQuick("custom");
    onChange?.({ from, to: val, quick: "custom" });
  };

  const handleSingleDateChange = (val: string) => {
    setFrom(val);
    setTo(val);
    setQuick("custom");
    onChange?.({ from: val, to: val, quick: "custom" });
  };

  const activeLabel = quickOptions.find((o) => o.value === quick)?.label || "Custom";

  return (
    <div className="space-y-3 mb-5">
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Filter */}
        {!hideQuickFilter && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 transition min-w-[160px]"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="flex-1 text-left">{activeLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                {quickOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setQuick(opt.value); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition ${quick === opt.value ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-700"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date Range / Single Date */}
        {!hideDateRange && (
          singleDate ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={from}
                onChange={(e) => handleSingleDateChange(e.target.value)}
                className="border-none outline-none text-sm bg-transparent"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="border-none outline-none text-sm bg-transparent"
                />
              </div>
              <span className="text-slate-400 text-sm">s/d</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="border-none outline-none text-sm bg-transparent"
                />
              </div>
            </div>
          )
        )}

        {/* Extra Filters Toggle */}
        {extraFilters && (
          <button
            onClick={() => setShowExtra(!showExtra)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition ${
              showExtra ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Lanjutan</span>
            {showExtra && <X className="w-3 h-3" />}
          </button>
        )}

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 transition ml-auto"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Extra Filters Panel */}
      {showExtra && extraFilters && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          {extraFilters}
        </div>
      )}
    </div>
  );
}

export function formatPeriodLabel(from: string, to: string, quick: string) {
  if (quick === "today") return "Hari Ini";
  if (quick === "thisWeek") return "Minggu Ini";
  if (quick === "thisMonth") return "Bulan Ini";
  if (quick === "lastMonth") return "Bulan Lalu";
  if (quick === "thisYear") return "Tahun Ini";
  const fd = new Date(from).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const td = new Date(to).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return `${fd} s/d ${td}`;
}
