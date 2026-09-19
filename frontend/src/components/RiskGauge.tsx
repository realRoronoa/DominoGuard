"use client";

import { ShieldAlert, ArrowUpRight, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  score: number;
  severity: string;
  onOpenPlaybook?: () => void;
  onOpenAuditLogs?: () => void;
  onScrollToChannels?: () => void;
  onScrollToTimeline?: () => void;
}

export function RiskGauge({
  score,
  severity,
  onOpenPlaybook,
  onOpenAuditLogs,
  onScrollToChannels,
  onScrollToTimeline,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-5 justify-between">
      {/* 3 Top Stat Counters (Views, Followers, Reposts style from Crowz) - Now Interactive */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-8 py-2">
        {/* Stat 1: Risk Score */}
        <button
          type="button"
          onClick={onOpenAuditLogs}
          title="Click to view score reasoning & audit log"
          className="flex flex-col text-left group hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#78716c] group-hover:text-[#1c1917]">Risk Score</span>
            <span className="w-2 h-2 rounded-full bg-[#e85d43] animate-pulse" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#1c1917] tracking-tight flex items-baseline">
            {score}
            <span className="text-sm font-bold text-[#a8a29e] ml-1">/100</span>
            <span className="text-[10px] text-[#e85d43] font-bold ml-2">▲ +12%</span>
          </div>
        </button>

        {/* Stat 2: Compromised Accounts */}
        <button
          type="button"
          onClick={onScrollToChannels}
          title="Click to inspect connected channels"
          className="flex flex-col text-left group hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#78716c] group-hover:text-[#1c1917]">Exposed Accounts</span>
            <span className="w-2 h-2 rounded-full bg-[#e59b38]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#1c1917] tracking-tight">
            5{" "}
            <span className="text-sm font-semibold text-[#78716c]">of 6</span>
          </div>
        </button>

        {/* Stat 3: Propagation Time */}
        <button
          type="button"
          onClick={onScrollToTimeline}
          title="Click to view cascade velocity timeline"
          className="flex flex-col text-left group hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#78716c] group-hover:text-[#1c1917]">Cascade Velocity</span>
            <span className="w-2 h-2 rounded-full bg-[#359381]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#1c1917] tracking-tight">
            4m <span className="text-xl font-bold text-[#359381]">12s</span>
          </div>
        </button>
      </div>

      {/* Right Banner Card (Upgrade Your Crowd style with Rainbow Concentric Arc Gauge) */}
      <div
        onClick={onOpenPlaybook}
        className="flex items-center justify-between gap-5 bg-[#f5ede2] hover:bg-[#ede3d6] cursor-pointer rounded-2xl p-4 sm:px-5 border border-[#e8dfd5] figma-shadow min-w-[280px] transition-colors group"
      >
        <div>
          <div className="font-heading text-sm font-bold text-[#1c1917] leading-tight">
            Blast Radius Index
          </div>
          <div className="text-[11px] text-[#78716c] mt-0.5">
            {severity} systemic exposure
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#e85d43] group-hover:underline">
            <span>View Lockdown Plan</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Multi-tier Rainbow Concentric Arcs */}
        <div className="relative w-20 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
            {/* Arc 1: Teal Outer Arc */}
            <path
              d="M 10 70 A 40 40 0 0 1 90 70"
              fill="none"
              stroke="#3ea6c8"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Arc 2: Amber Middle Arc */}
            <path
              d="M 22 70 A 28 28 0 0 1 78 70"
              fill="none"
              stroke="#e59b38"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Arc 3: Coral Red Inner Arc */}
            <path
              d="M 34 70 A 16 16 0 0 1 66 70"
              fill="none"
              stroke="#e85d43"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>

          {/* Central Pill Badge */}
          <div className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-[#e85d43] text-white font-heading text-[10px] font-bold shadow-sm">
            {score}%
          </div>
        </div>
      </div>
    </div>
  );
}
