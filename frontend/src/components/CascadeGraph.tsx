"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowDown } from "lucide-react";
import { SimulationResult } from "../types";

const SERVICE_ICONS: Record<string, string> = {
  email: "✉",
  google: "☁",
  amazon: "🛒",
  bank: "🏦",
  whatsapp: "💬",
  instagram: "📸",
};

const SEVERITY_STYLES: Record<string, { badge: string; color: string; bg: string; border: string }> = {
  root: {
    badge: "INITIAL COMPROMISE",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.35)",
  },
  high: {
    badge: "CRITICAL HOP",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.06)",
    border: "rgba(239, 68, 68, 0.25)",
  },
  medium: {
    badge: "LATERAL EXPOSURE",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.06)",
    border: "rgba(245, 158, 11, 0.25)",
  },
  low: {
    badge: "MONITORED",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.06)",
    border: "rgba(6, 182, 212, 0.25)",
  },
};

interface Props {
  nodes: SimulationResult["cascade"];
}

export function CascadeGraph({ nodes }: Props) {
  if (!nodes.length) return null;

  const root = nodes[0];
  const rest = nodes.slice(1);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-5 sm:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-heading text-sm font-bold text-white tracking-wide">
            Attack Path Cascade
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            How one breach systematically cascades across your accounts
          </p>
        </div>
        <span className="font-code text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
          {nodes.length} Accounts Impacted
        </span>
      </div>

      {/* Root Breach Node */}
      <div className="mt-5 flex flex-col items-center">
        <div
          className="w-full max-w-md rounded-xl border p-4 text-center transition-all"
          style={{
            background: SEVERITY_STYLES.root.bg,
            borderColor: SEVERITY_STYLES.root.border,
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-red-500/15">
            <span className="flex items-center gap-1.5 font-code text-[10px] font-bold text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
              GROUND ZERO · INITIAL BREACH
            </span>
            <span className="font-code text-[10px] text-zinc-500">T+00:00</span>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-xl">
              {SERVICE_ICONS[root.id] ?? "✉"}
            </div>
            <div className="flex flex-col text-left min-w-0 flex-1">
              <div className="font-heading text-sm font-bold text-white truncate">
                {root.label}
              </div>
              <div className="text-xs text-zinc-400 leading-snug">
                Password compromised — attacker controls recovery flow
              </div>
            </div>
          </div>
        </div>

        {/* Downward Connector Arrow */}
        {rest.length > 0 && (
          <div className="my-3 flex flex-col items-center">
            <div className="h-6 w-px bg-gradient-to-b from-red-500/60 to-zinc-600" />
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-zinc-400">
              <ArrowDown size={11} />
            </div>
          </div>
        )}
      </div>

      {/* Downstream Impact Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rest.map((node, i) => {
          const style = SEVERITY_STYLES[node.status] ?? SEVERITY_STYLES.medium;
          return (
            <div
              key={node.id}
              className="flex flex-col justify-between rounded-xl border p-3.5 transition-all hover:border-white/20"
              style={{
                background: style.bg,
                borderColor: style.border,
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04]">
                  <span
                    className="font-code text-[9px] font-bold uppercase"
                    style={{ color: style.color }}
                  >
                    Hop {i + 1} · {node.status}
                  </span>
                  <span className="font-code text-[9px] text-zinc-500">
                    T+0{i + 1}:{(20 * (i + 1)).toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <span className="text-base">{SERVICE_ICONS[node.id] ?? "🔗"}</span>
                  <span className="font-heading text-xs font-bold text-zinc-200">
                    {node.label}
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
                  {node.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
