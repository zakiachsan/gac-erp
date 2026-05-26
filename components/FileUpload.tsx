"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText, Download } from "lucide-react";

interface FileUploadProps {
  value?: string;
  fileName?: string;
  onChange?: (file: File | null, previewUrl: string) => void;
  accept?: string;
}

export default function FileUpload({ value, fileName, onChange, accept = ".pdf,.jpg,.jpeg,.png" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(
    value && fileName ? { url: value, name: fileName } : null
  );

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview({ url, name: file.name });
    onChange?.(file, url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    onChange?.(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800 truncate">{preview.name}</div>
          <div className="text-xs text-slate-500">File siap diupload</div>
        </div>
        <a href={preview.url} download={preview.name} className="p-1.5 text-slate-400 hover:text-blue-600 transition">
          <Download className="w-4 h-4" />
        </a>
        <button onClick={clearFile} className="p-1.5 text-slate-400 hover:text-rose-600 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer"
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} />
      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
      <p className="text-sm text-slate-600 font-medium">Klik atau seret file ke sini</p>
      <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (maks. 10MB)</p>
    </div>
  );
}
