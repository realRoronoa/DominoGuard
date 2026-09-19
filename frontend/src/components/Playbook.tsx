"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { SimulationResult } from "../types";

const STEP_ICONS = [ShieldCheck, AlertTriangle, CheckCircle2];
const STEP_COLORS = [
  { ring: "#22c55e", bg: "rgba(34,197,94,0.12)", text: "#4ade80" },
  { ring: "#f97316", bg: "rgba(249,115,22,0.1)",  text: "#fb923c" },
  { ring: "#a78bfa", bg: "rgba(167,139,250,0.1)", text: "#c4b5fd" },
];

export function Playbook({ items }: { items: SimulationResult["playbook"] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">03 · Lockdown playbook</div>
        <div className="text-xs text-zinc-600 font-mono">3 actions</div>
      </div>
      <div className="mt-1 text-sm text-zinc-300">Execute in order — fastest path to containment</div>

      <div className="mt-5 flex flex-col gap-3">
        {items.slice(0, 3).map((item, index) => {
          const colors = STEP_COLORS[index] ?? STEP_COLORS[2];
          const Icon = STEP_ICONS[index] ?? CheckCircle2;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4, type: "spring" }}
            >
              <div
                className="rounded-xl p-4 border transition-all duration-200 hover:scale-[1.01]"
                style={{ background: colors.bg, borderColor: colors.ring + "40" }}
              >
                <div className="flex gap-3">
                  {/* Step number circle */}
                  <div className="shrink-0">
                    <div
                      className="h-8 w-8 rounded-full grid place-items-center text-xs font-bold border-2"
                      style={{
                        borderColor: colors.ring,
                        background: colors.bg,
                        color: colors.text,
                        boxShadow: `0 0 12px ${colors.ring}40`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-zinc-100">{item.title}</div>
                      <Icon size={14} style={{ color: colors.text }} className="shrink-0 mt-0.5" />
                    </div>
                    <div className="mt-1.5 text-xs leading-5 text-zinc-400">{item.description}</div>
                    {item.actionUrl && (
                      <a
                        href={item.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium rounded-lg px-2.5 py-1.5 border transition-all duration-150 hover:scale-105"
                        style={{
                          color: colors.text,
                          borderColor: colors.ring + "40",
                          background: colors.bg,
                        }}
                      >
                        Open security settings <ArrowUpRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-zinc-600 leading-4">
        These actions are defensive recommendations based on the simulated cascade above. Prioritise step 1 before proceeding.
      </div>
    </div>
  );
}
