"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SimulationResult } from "../types";

const SERVICE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  root:   { bg: "rgba(239,68,68,0.15)",   border: "#ef4444", text: "#fca5a5" },
  high:   { bg: "rgba(251,146,60,0.12)",  border: "#f97316", text: "#fdba74" },
  medium: { bg: "rgba(234,179,8,0.1)",    border: "#eab308", text: "#fde047" },
  low:    { bg: "rgba(113,113,122,0.08)", border: "#52525b", text: "#a1a1aa" },
};

const SERVICE_ICONS: Record<string, string> = {
  email:     "✉",
  instagram: "📸",
  whatsapp:  "💬",
  bank:      "🏦",
  google:    "☁",
  amazon:    "🛒",
};

interface Props { nodes: SimulationResult["cascade"]; }

export function CascadeGraph({ nodes }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!nodes.length) return null;

  // Layout: root top-center, then arranged in 2-col grid below
  const root = nodes[0];
  const rest = nodes.slice(1);

  return (
    <div className="glass rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Attack cascade</div>
          <div className="mt-1 text-sm text-zinc-300">Simulated blast radius path</div>
        </div>
        <div className="text-xs font-mono text-zinc-600">{nodes.length} nodes</div>
      </div>

      {/* SVG Pipeline Graph */}
      <div ref={canvasRef} className="relative overflow-x-auto pb-2">
        <div className="flex flex-col items-center gap-0 min-w-[280px]">

          {/* Root node — always top and centered */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <div
              className="relative rounded-2xl px-6 py-4 text-center min-w-[180px] border"
              style={{
                background: SERVICE_COLORS.root.bg,
                borderColor: SERVICE_COLORS.root.border,
                boxShadow: `0 0 24px rgba(239,68,68,0.2)`,
              }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-red-500/40"
                animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="text-2xl mb-1">{SERVICE_ICONS[root.id] ?? "🔴"}</div>
              <div className="text-sm font-semibold text-white">{root.label}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest font-bold" style={{ color: SERVICE_COLORS.root.text }}>
                ⚠ COMPROMISED
              </div>
            </div>
          </motion.div>

          {/* Connector arrow down */}
          {rest.length > 0 && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex flex-col items-center"
              style={{ transformOrigin: "top" }}
            >
              <div className="w-px h-6 bg-gradient-to-b from-red-500/60 to-zinc-700/40" />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-zinc-600">
                <path d="M6 8L0 0h12L6 8z" fill="currentColor" fillOpacity="0.5" />
              </svg>
            </motion.div>
          )}

          {/* Cascade nodes grid */}
          <div className={`grid gap-3 w-full mt-0 ${rest.length === 1 ? "grid-cols-1" : rest.length <= 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
            {rest.map((node, i) => {
              const colors = SERVICE_COLORS[node.status] ?? SERVICE_COLORS.low;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.1, duration: 0.35, type: "spring" }}
                >
                  <div
                    className="rounded-xl border p-3 h-full flex flex-col gap-1.5 transition-all duration-200 hover:scale-[1.02] cursor-default"
                    style={{
                      background: colors.bg,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg leading-none">{SERVICE_ICONS[node.id] ?? "🔗"}</span>
                      <span
                        className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full"
                        style={{ color: colors.text, background: colors.bg, border: `1px solid ${colors.border}` }}
                      >
                        {node.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200">{node.label}</div>
                    <div className="text-[10px] leading-4 text-zinc-500">{node.reason}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-3">
        {(["root", "high", "medium", "low"] as const).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: SERVICE_COLORS[s].border }} />
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
