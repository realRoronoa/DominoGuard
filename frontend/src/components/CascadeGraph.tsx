"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Info, ExternalLink } from "lucide-react";
import { SimulationResult } from "../types";

const NODE_METADATA: Record<
  string,
  {
    icon: string;
    typeLabel: string;
    mitreCode: string;
    mitreName: string;
    vector: string;
    financialExposure?: string;
  }
> = {
  email: {
    icon: "✉",
    typeLabel: "Identity Root (SAML SSO)",
    mitreCode: "T1566.002",
    mitreName: "Spearphishing Link",
    vector: "Weaponized authentication lure bypassed MFA token prompt",
  },
  google: {
    icon: "☁",
    typeLabel: "Cloud Identity Provider",
    mitreCode: "T1539",
    mitreName: "Steal Web Session Cookie",
    vector: "Stolen Bearer refresh token replayed to extract Google Drive docs",
  },
  amazon: {
    icon: "🛒",
    typeLabel: "AWS Cloud Infrastructure",
    mitreCode: "T1078",
    mitreName: "Valid Cloud Accounts",
    vector: "AssumeRole privilege escalation into production IAM container",
    financialExposure: "$450K Cloud compute risk",
  },
  bank: {
    icon: "🏦",
    typeLabel: "Corporate Financial Rails",
    mitreCode: "T1020",
    mitreName: "Automated Exfiltration",
    vector: "Infiltrated ACH payment routing API via compromised session",
    financialExposure: "$2.4M Direct exposure",
  },
  whatsapp: {
    icon: "💬",
    typeLabel: "Telephony Trust & 2FA",
    mitreCode: "T1458",
    mitreName: "SIM Swap / SMS Intercept",
    vector: "Inbound security verification codes forwarded to attacker device",
  },
  instagram: {
    icon: "📸",
    typeLabel: "Public Brand Identity",
    mitreCode: "T1586",
    mitreName: "Compromise Accounts",
    vector: "Password reset initiated via compromised recovery email",
    financialExposure: "Reputational defacement",
  },
};

const STATUS_THEMES = {
  root: {
    badge: "ROOT BREACH (EPOCH 0)",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "#ef4444",
    shadow: "0 0 24px rgba(239, 68, 68, 0.4)",
    pulse: true,
  },
  high: {
    badge: "CRITICAL LATERAL HOP",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.7)",
    shadow: "0 0 16px rgba(239, 68, 68, 0.25)",
    pulse: false,
  },
  medium: {
    badge: "LATERAL EXPOSURE",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.7)",
    shadow: "0 0 16px rgba(245, 158, 11, 0.2)",
    pulse: false,
  },
  low: {
    badge: "CONTAINED / PERIMETER",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.6)",
    shadow: "0 0 14px rgba(6, 182, 212, 0.15)",
    pulse: false,
  },
};

interface Props {
  nodes: SimulationResult["cascade"];
  blastScore?: number;
}

export function CascadeGraph({ nodes, blastScore = 94 }: Props) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  if (!nodes.length) return null;

  const root = nodes[0];
  const rest = nodes.slice(1);
  const lateralHops = Math.max(1, Math.min(rest.length, 4));

  return (
    <div className="relative flex flex-col rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* High-Intensity Top-Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#06b6d4]" />

      {/* Panel Header & Blast Radius Metric Ribbon */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444]">
              <span className="font-code text-sm font-bold">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm sm:text-base font-bold text-white tracking-wide">
                  Attack Path Cascade Graph
                </h2>
                <span className="hidden sm:inline font-code text-[10px] text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2 py-0.5 rounded">
                  WIZ-STYLE TOPOLOGY
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Simulated toxic combination & lateral blast radius across identity mesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-code text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-ping" />
            <span className="text-[#ef4444] font-semibold">{nodes.length} Targets Breached</span>
          </div>
        </div>

        {/* Telemetry Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#07080d]/80 p-2.5 rounded-xl border border-white/[0.08]">
          <div className="flex flex-col border-r border-white/[0.06] pr-2">
            <span className="font-code text-[10px] uppercase text-zinc-500">Compromised</span>
            <span className="font-code text-base font-bold text-[#ef4444]">
              {nodes.length} Services
            </span>
          </div>
          <div className="flex flex-col sm:border-r border-white/[0.06] px-2">
            <span className="font-code text-[10px] uppercase text-zinc-500">Lateral Hops</span>
            <span className="font-code text-base font-bold text-[#f59e0b]">
              {lateralHops} Hops Deep
            </span>
          </div>
          <div className="flex flex-col border-r border-white/[0.06] pr-2 sm:px-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
            <span className="font-code text-[10px] uppercase text-zinc-500">Propagation Time</span>
            <span className="font-code text-base font-bold text-[#06b6d4]">
              4m 12s
            </span>
          </div>
          <div className="flex flex-col pl-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
            <span className="font-code text-[10px] uppercase text-zinc-500">Blast Radius</span>
            <span className="font-code text-base font-bold text-[#ef4444]">
              {blastScore}
              <span className="text-xs font-normal text-zinc-500">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div className="relative p-5 sm:p-6 overflow-hidden min-h-[460px] bg-gradient-to-b from-[#07080d]/80 via-[#0c0e17]/40 to-[#07080d]/90 flex flex-col justify-between">
        {/* Tactical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* SVG Connector Filter */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="glow-crimson" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="grad-root-lateral" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top Centered Root Node (Epoch 0) */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            onClick={() => setSelectedNode(selectedNode === root.id ? null : root.id)}
            className="w-full max-w-md cursor-pointer rounded-2xl border-2 p-3.5 sm:p-4 text-center transition-all hover:scale-[1.02]"
            style={{
              background: STATUS_THEMES.root.bg,
              borderColor: STATUS_THEMES.root.border,
              boxShadow: STATUS_THEMES.root.shadow,
            }}
          >
            {/* Animated Beacon Ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-red-500/40"
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 font-code text-[11px] font-bold text-[#ef4444]">
                <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-ping" />
                ROOT COMPROMISE (EPOCH 0)
              </span>
              <span className="font-code text-[11px] text-zinc-400">T+00:00 · Infiltration</span>
            </div>

            <div className="relative z-10 flex items-center gap-3 pt-2.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/50 text-2xl text-white">
                {NODE_METADATA[root.id]?.icon ?? "✉"}
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="font-heading text-sm sm:text-base font-bold text-white truncate">
                  {root.label}
                </span>
                <span className="font-code text-[11px] text-zinc-400 truncate">
                  {NODE_METADATA[root.id]?.typeLabel ?? "Primary SAML Anchor"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-code text-[10px] uppercase font-bold text-[#ef4444] bg-[#ef4444]/20 border border-[#ef4444]/40 px-2 py-0.5 rounded">
                  100% Breached
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-2.5 flex items-center justify-between font-code text-[10px] text-zinc-400">
              <span className="text-zinc-300">
                MITRE: <strong className="text-[#ef4444]">{NODE_METADATA[root.id]?.mitreCode ?? "T1566.002"}</strong> ({NODE_METADATA[root.id]?.mitreName ?? "Spearphishing"})
              </span>
              <span className="text-[#06b6d4] text-[10px]">Click node for forensic trace</span>
            </div>
          </motion.div>

          {/* Animated Connecting Arrow Vector */}
          {rest.length > 0 && (
            <div className="relative z-10 my-3 flex flex-col items-center">
              <div className="h-8 w-[2px] bg-gradient-to-b from-[#ef4444] to-[#f59e0b] attack-flow-line" />
              <div className="font-code text-[9px] uppercase tracking-wider text-zinc-500 bg-[#07080d] px-2 py-0.5 rounded border border-white/10 mt-1">
                Lateral Pivots Triggered
              </div>
            </div>
          )}
        </div>

        {/* Lateral Nodes Grid (Hops 1 & 2) */}
        <div className="relative z-10 grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((node, i) => {
            const theme = STATUS_THEMES[node.status] ?? STATUS_THEMES.medium;
            const meta = NODE_METADATA[node.id] ?? {
              icon: "🔗",
              typeLabel: "Connected Cloud Asset",
              mitreCode: "T1078",
              mitreName: "Privilege Escalation",
              vector: node.reason,
            };
            const isSelected = selectedNode === node.id;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.35, type: "spring" }}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className="group relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: isSelected ? "rgba(18, 22, 36, 0.95)" : theme.bg,
                  borderColor: isSelected ? "#06b6d4" : theme.border,
                  boxShadow: isSelected ? "0 0 20px rgba(6, 182, 212, 0.35)" : theme.shadow,
                }}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                    <span className="font-code text-[10px] font-semibold flex items-center gap-1" style={{ color: theme.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.color }} />
                      HOP {i + 1}: {node.status.toUpperCase()}
                    </span>
                    <span className="font-code text-[9px] text-zinc-500">
                      T+0{i + 1}:{(15 * (i + 1)).toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg"
                      style={{
                        background: `${theme.color}20`,
                        borderColor: `${theme.color}40`,
                        color: theme.color,
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-heading text-xs sm:text-sm font-bold text-white truncate">
                        {node.label}
                      </span>
                      <span className="font-code text-[10px] text-zinc-400 truncate">
                        {meta.typeLabel}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] leading-snug text-zinc-300">
                    {node.reason}
                  </p>
                </div>

                {/* Card Footer: MITRE Code & Financial Exposure */}
                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between font-code text-[10px]">
                  <span className="text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">
                    {meta.mitreCode}
                  </span>
                  {meta.financialExposure ? (
                    <span className="font-semibold text-[#ef4444]">{meta.financialExposure}</span>
                  ) : (
                    <span className="text-zinc-500">Breached Token</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Node Expanded Forensic Drawer */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-20 mt-4 rounded-xl border border-[#06b6d4]/40 bg-[#07080d]/95 p-3.5 font-code text-xs text-zinc-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between text-[#06b6d4] font-semibold pb-1.5 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Info size={14} />
                  FORENSIC INVESTIGATION TRACE: {selectedNode.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
                <div>
                  <span className="text-zinc-500">Infiltration Vector:</span>
                  <p className="text-zinc-200 mt-0.5">{NODE_METADATA[selectedNode]?.vector ?? "Automated credential spray & lateral pivot."}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Mitigation Directive:</span>
                  <p className="text-[#10b981] mt-0.5">Revoke active sessions and force FIDO2 hardware challenge immediately.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-footer Graph Legend */}
        <div className="relative z-10 mt-5 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] font-code text-zinc-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              Direct Root Exploit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              Credential Re-use & SSO Replay
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#06b6d4]" />
              Perimeter Containment Boundary
            </span>
          </div>
          <span className="text-zinc-500">Bedrock Red-Team Agent v2.4</span>
        </div>
      </div>
    </div>
  );
}
