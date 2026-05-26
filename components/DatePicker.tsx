"use client";

import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
  <div className="relative">
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      placeholder={placeholder}
      className="w-full px-3 py-2 pr-9 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    />
    <Calendar className="absolute right-2.5 top-2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
));
CustomInput.displayName = "CustomInput";

export default function DatePicker({ value, onChange, placeholder = "Pilih tanggal...", className = "" }: DatePickerProps) {
  const selected = value ? new Date(value + "T00:00:00") : null;

  return (
    <div className={className}>
      <ReactDatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          if (date) {
            const iso = date.toLocaleDateString("en-CA");
            onChange?.(iso);
          }
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        customInput={<CustomInput />}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}
