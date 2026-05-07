"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Minimize2, Bot, User } from "lucide-react";

interface Message {
  id: number;
  from: "user" | "ai";
  text: string;
}

const initialMessages: Message[] = [
  { id: 1, from: "ai", text: "Halo! Saya AI Asisten ERP GAC. Ada yang bisa saya bantu terkait data keuangan atau history harga barang?" },
  { id: 2, from: "user", text: "Berapa harga beli AC 2 PK terakhir?" },
  { id: 3, from: "ai", text: "Berdasarkan data sistem, harga pembelian AC Split 2 PK terakhir adalah Rp 4.200.000/unit dari supplier PT CoolTech pada 28 April 2026 (PR-2026-0011)." },
];

const quickReplies = ["History harga barang", "Status project", "Neraca hari ini"];

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const nextId = messages.length + 1;
    setMessages((prev) => [...prev, { id: nextId, from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId + 1, from: "ai", text: "Maaf, saya masih dalam mode demo. Silakan hubungi admin untuk data lengkap." },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl shadow-blue-600/30 flex items-center justify-center hover:scale-110 transition active:scale-95"
          aria-label="Buka AI Asisten"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[32rem] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">AI Asisten</div>
                <div className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.from === "user" ? "justify-end" : ""}`}>
                {m.from === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                    m.from === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
            {quickReplies.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInput(tag);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] text-slate-600 font-medium whitespace-nowrap transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tanya data keuangan..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
