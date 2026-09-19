"use client";

import { AlertTriangle, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  score: number;
  severity: string;
  agentTrace?: SimulationResult["agentTrace"];
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  CRITICAL: {
    label: "Critical Risk",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
  },
  HIGH: {
    label: "High Risk",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  MODERATE: {
    label: "Moderate Risk",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.3)",
  },
  LOW: {
    label: "Low Risk",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
  },
};

export function RiskGauge({ score, severity, agentTrace }: Props) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.CRITICAL;

  return (
    <div className="space-y-4">
      {/* 3 Clean KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Risk Score */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-medium text-zinc-400">Risk Score</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-white">{score}</span>
            <span className="text-xs text-zinc-500">/100</span>
          </div>
          <span
            className="mt-2 inline-flex w-fit font-code text-[10px] font-semibold px-2 py-0.5 rounded border"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Card 2: Blast Radius */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-medium text-zinc-400">Blast Radius</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-3xl font-extrabold text-red-400">5</span>
            <span className="text-xs text-zinc-500">of 6 exposed</span>
          </div>
          <span className="mt-2 text-[10px] text-zinc-400">Cross-account cascade</span>
        </div>

        {/* Card 3: Est. Breach Speed */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-medium text-zinc-400">Propagation Time</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-3xl font-extrabold text-cyan-400">4m</span>
            <span className="text-xs text-zinc-400">12s</span>
          </div>
          <span className="mt-2 text-[10px] text-zinc-400">Automated lateral hops</span>
        </div>
      </div>

      {/* Bedrock AI Agent Pipeline Summary */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-400" />
            <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
              Amazon Bedrock AI Analysis
            </span>
          </div>
          <span className="font-code text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            3/3 Agents Complete
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="flex items-start gap-2.5 text-xs">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
            <div className="flex-1">
              <span className="font-semibold text-zinc-200">Mapper Agent: </span>
              <span className="text-zinc-400">
                Mapped 6 connected service dependencies and identified email as the master SSO recovery node.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
            <div className="flex-1">
              <span className="font-semibold text-zinc-200">Red-Team Agent: </span>
              <span className="text-zinc-400">
                Simulated lateral movement: password reset links used to breach banking and AWS cloud console.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
            <div className="flex-1">
              <span className="font-semibold text-zinc-200">Remediator Agent: </span>
              <span className="text-zinc-400">
                Generated prioritized 3-step containment sequence to isolate breached sessions immediately.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
