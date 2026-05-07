"use client";

import { ReactNode } from "react";
import AiChatWidget from "./AiChatWidget";

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  hideChat?: boolean;
}

export default function SidebarLayout({ children, title, subtitle, action, hideChat }: Props) {
  return (
    <>
      <header className="h-14 lg:h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </header>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      {hideChat === true ? null : <AiChatWidget />}
    </>
  );
}
