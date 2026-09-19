"use client";

import { Shield, Sparkles, Github, FileDown, Radio } from "lucide-react";

interface HeaderProps {
  onExportReport?: () => void;
}

export function Header({ onExportReport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-bold tracking-tight text-white">
              Domino<span className="text-red-500">Guard</span>
            </span>
            <span className="hidden sm:inline-block rounded-full bg-white/[0.05] px-2.5 py-0.5 font-code text-[10px] text-zinc-400 border border-white/10">
              v2.4
            </span>
          </div>
        </div>

        {/* Center: Clean Status Pill */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1 text-xs text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-zinc-300">AWS Bedrock Active</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-500">Claude 3 Haiku Multi-Agent</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {onExportReport && (
            <button
              onClick={onExportReport}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <FileDown size={14} className="text-zinc-400" />
              <span>Export Report</span>
            </button>
          )}

          <a
            href="https://github.com/realRoronoa/DominoGuard"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            title="GitHub Repository"
          >
            <Github size={15} />
          </a>
        </div>
      </div>
    </header>
  );
}
