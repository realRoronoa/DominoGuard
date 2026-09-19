"use client";

import { Shield, Sparkles, Github, Terminal, FileDown, Radio, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  onExportReport?: () => void;
  onToggleTerminal?: () => void;
  socActive?: boolean;
  onToggleSoc?: () => void;
}

export function Header({
  onExportReport,
  onToggleTerminal,
  socActive = true,
  onToggleSoc,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.08] px-4 py-3 lg:px-8 bg-[#0c0e17]/90 backdrop-blur-xl"
    >
      {/* Brand Anchor */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Glowing neon shield ring */}
            <div className="absolute inset-0 rounded-xl bg-[#06b6d4]/20 blur-md" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#06b6d4]/40 bg-[#07080d] text-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Shield size={20} className="stroke-[2.2]" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-ping" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-wider uppercase text-white">
                Domino<span className="text-[#ef4444]">Guard</span>
              </span>
              <span className="hidden sm:inline-flex items-center bg-[#181a24] text-[#06b6d4] font-code text-[10px] font-semibold px-2 py-0.5 rounded border border-white/10">
                CASCADE SENTINEL v2.4
              </span>
            </div>
            <span className="text-[10px] font-code text-zinc-400 tracking-tight">
              AWS Bedrock Multi-Agent AI Defense
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Bedrock Agent Telemetry Strip (Visible on Desktop) */}
      <div className="hidden xl:flex items-center gap-3.5 bg-[#07080d]/80 px-3.5 py-1.5 rounded-lg border border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
          </span>
          <span className="text-[11px] font-code text-zinc-300 font-medium">Bedrock Pipeline Active</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span className="bg-[#06b6d4]/10 text-[#06b6d4] px-2 py-0.5 rounded font-code text-[10px] border border-[#06b6d4]/30 font-semibold">
          Claude 3 Haiku
        </span>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 font-code text-[11px] text-zinc-400">
          <span>Latency: <strong className="text-[#10b981] font-normal">1.4s</strong></span>
          <span>•</span>
          <span className="text-zinc-300">Agents:</span>
          <span className="text-[#06b6d4]">Mapper</span>,
          <span className="text-[#ef4444]">Red-Team</span>,
          <span className="text-[#10b981]">Remediator</span>
        </div>
      </div>

      {/* Trailing Controls & Links */}
      <div className="flex items-center gap-2.5">
        {/* Terminal Toggle */}
        <button
          onClick={onToggleTerminal}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          title="Toggle CLI Sandbox"
        >
          <Terminal size={14} />
          <span className="hidden md:inline font-code text-[11px]">CLI Script</span>
        </button>

        {/* Export Report */}
        <button
          onClick={onExportReport}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          title="Export Incident Audit Report"
        >
          <FileDown size={14} />
          <span className="hidden md:inline font-code text-[11px]">Export Report</span>
        </button>

        {/* Live SOC Monitor Toggle */}
        <button
          onClick={onToggleSoc}
          className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-all ${
            socActive
              ? "border-[#06b6d4]/50 bg-[#06b6d4]/10 text-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Radio size={13} className={socActive ? "animate-pulse" : ""} />
          <span className="font-code text-[11px]">SOC Live</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/realRoronoa/DominoGuard"
          target="_blank"
          rel="noreferrer"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          title="View Source on GitHub"
        >
          <Github size={15} />
        </a>

        {/* SOC Operator Chip */}
        <div
          className="hidden sm:grid h-8 w-8 place-items-center rounded-lg border border-[#06b6d4]/30 bg-[#06b6d4]/10 font-code text-[11px] font-bold text-[#06b6d4]"
          title="Active Operator Session"
        >
          OP-1
        </div>
      </div>
    </header>
  );
}
