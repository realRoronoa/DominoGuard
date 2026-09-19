"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AlertTriangle, ShieldAlert, Cpu, Sparkles, Send, Radar, Bot, ShieldCheck, Activity } from "lucide-react";
import { SimulationResult } from "../types";

const SEVERITY_CONFIG = {
  CRITICAL: {
    label: "CRITICAL CASCADE RISK",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.45)",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.4)",
    pulse: true,
  },
  HIGH: {
    label: "HIGH EXPOSURE RISK",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.35)",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.4)",
    pulse: false,
  },
  MODERATE: {
    label: "MODERATE CONTAINMENT RISK",
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.3)",
    bg: "rgba(6, 182, 212, 0.12)",
    border: "rgba(6, 182, 212, 0.4)",
    pulse: false,
  },
  LOW: {
    label: "LOW SYSTEMIC EXPOSURE",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.3)",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.4)",
    pulse: false,
  },
};

interface RiskGaugeProps {
  score: number;
  severity: string;
  agentTrace?: SimulationResult["agentTrace"];
}

export function RiskGauge({ score, severity, agentTrace }: RiskGaugeProps) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.CRITICAL;
  const [queryInput, setQueryInput] = useState("");
  const [queryResponse, setQueryResponse] = useState<string | null>(null);

  // SVG Circular Gauge calculation
  // Radius: 54, Circumference: 2 * PI * 54 = ~339.292
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference * (1 - score / 100);

  // Multi-dimension metrics calculation based on score
  const metrics = [
    {
      label: "Vulnerability Propagation Speed",
      value: Math.min(99, Math.round(score * 1.01)),
      level: score > 75 ? "Extreme" : "Moderate",
      color: "#ef4444",
    },
    {
      label: "Identity Blast Radius Multiplier",
      value: Math.min(98, Math.round(score * 0.96)),
      level: score > 75 ? "High" : "Controlled",
      color: "#ef4444",
    },
    {
      label: "Financial Asset Direct Exposure",
      value: Math.min(95, Math.round(score * 0.92)),
      level: score > 60 ? "Severe" : "Low",
      color: "#f59e0b",
    },
    {
      label: "Brand Hijack & Reputational Impact",
      value: Math.min(96, Math.round(score * 0.98)),
      level: score > 70 ? "Critical" : "Isolated",
      color: "#06b6d4",
    },
  ];

  function handleQuery() {
    if (!queryInput.trim()) return;
    setQueryResponse(
      `[Bedrock Agent Remediator]: Analysis on "${queryInput}": Verified SAML/OAuth token replay vulnerability across 3 trust boundaries. Automated mitigation policy rule 0x9F will isolate federated sessions in <250ms.`
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Card: Circular Neon Risk Gauge & High-Level Telemetry */}
      <div className="relative flex flex-col rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-[2px] w-full absolute top-0 left-0" style={{ background: cfg.color }} />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} style={{ color: cfg.color }} />
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">
              Systemic Cascade Risk Index
            </h3>
          </div>
          <span
            className="font-code text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide"
            style={{
              color: cfg.color,
              borderColor: cfg.border,
              background: cfg.bg,
            }}
          >
            HIGH CONFIDENCE (AWS BEDROCK)
          </span>
        </div>

        {/* Circular Gauge Centerpiece */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-3">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background Inactive Ring */}
              <circle
                cx="65"
                cy="65"
                r={r}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="10"
              />
              <circle
                cx="65"
                cy="65"
                r={r}
                fill="none"
                stroke="#1e2230"
                strokeWidth="10"
              />
              {/* Active Glowing Colored Arc */}
              <motion.circle
                cx="65"
                cy="65"
                r={r}
                fill="none"
                stroke={cfg.color}
                strokeWidth="10.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: targetOffset }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 10px ${cfg.glow})` }}
              />
            </svg>

            {/* Gauge Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <AlertTriangle size={18} style={{ color: cfg.color }} className="animate-pulse mb-0.5" />
              <span className="font-heading text-3xl font-extrabold text-white leading-none tracking-tight">
                {score}
              </span>
              <span className="font-code text-[9px] uppercase tracking-wider text-zinc-400 mt-1">
                Cascade Score
              </span>
              <span
                className="font-code text-[9px] font-bold tracking-tight px-1.5 py-0.2 rounded mt-0.5"
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Right Side Summary */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <p className="text-zinc-300 leading-relaxed">
              Synthesized from interconnected session tokens, SAML federation rules, and cloud infrastructure policies.
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map((tier) => {
                const isSelected = tier === severity;
                const tierCfg = SEVERITY_CONFIG[tier];
                return (
                  <div
                    key={tier}
                    className="font-code text-[10px] uppercase tracking-wider py-1 px-2 rounded text-center transition-all"
                    style={{
                      background: isSelected ? tierCfg.bg : "rgba(255, 255, 255, 0.03)",
                      color: isSelected ? tierCfg.color : "#64748b",
                      border: `1px solid ${isSelected ? tierCfg.border : "transparent"}`,
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    {tier}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Multi-Dimension Telemetry Metric Bars */}
        <div className="mt-2 pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between font-code text-[11px] mb-1">
                <span className="text-zinc-400">{m.label}</span>
                <span className="font-semibold" style={{ color: m.color }}>
                  {m.value}% ({m.level})
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#07080d] rounded-full overflow-hidden border border-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${m.color}80, ${m.color})`,
                    boxShadow: `0 0 8px ${m.color}60`,
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Card: Live Bedrock Multi-Agent AI Telemetry Stream */}
      <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#06b6d4]" />
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">
              Bedrock Multi-Agent Cognition Stream
            </h3>
          </div>
          <span className="font-code text-[10px] text-[#06b6d4] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#06b6d4] animate-ping" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Reasoning Stream Cards */}
        <div className="flex flex-col gap-2.5 mt-3 max-h-[290px] overflow-y-auto custom-scroll pr-1">
          {/* Agent Mapper */}
          <div className="p-3 rounded-xl bg-[#07080d]/80 border-l-2 border-[#06b6d4] border border-white/[0.06] text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-code text-[#06b6d4] font-bold flex items-center gap-1.5">
                <Radar size={13} />
                [Agent Mapper]
              </span>
              <span className="font-code text-zinc-500 text-[10px]">T+01:14 UTC</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-[11px]">
              "Identity graph traversed. Work Email access leaked single-sign-on session tokens. Synthesized SAML trust relationship to <code className="font-code text-[#06b6d4] bg-white/[0.05] px-1 rounded">auth.google-cloud.io</code>."
            </p>
            <div className="mt-1.5 flex items-center gap-2 font-code text-[9px]">
              <span className="text-zinc-400">Confidence: 99.2%</span>
              <span className="text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-1 rounded">
                Entity: SSO Cookie
              </span>
            </div>
          </div>

          {/* Agent Red-Team Simulator */}
          <div className="p-3 rounded-xl bg-[#07080d]/80 border-l-2 border-[#ef4444] border border-white/[0.06] text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-code text-[#ef4444] font-bold flex items-center gap-1.5">
                <Bot size={13} />
                [Agent Red-Team]
              </span>
              <span className="font-code text-zinc-500 text-[10px]">T+02:08 UTC</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-[11px]">
              "Lateral pivot executed to AWS IAM Role via cached CLI credentials. Detected cross-account AssumeRole write access to <code className="font-code text-[#ef4444] bg-white/[0.05] px-1 rounded">s3://corp-treasury-production</code>. PrivEsc verified."
            </p>
            <div className="mt-1.5 flex items-center gap-2 font-code text-[9px]">
              <span className="text-zinc-400">Propagation: Critical</span>
              <span className="text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-1 rounded">
                MITRE T1078 Valid Accounts
              </span>
            </div>
          </div>

          {/* Agent Remediator */}
          <div className="p-3 rounded-xl bg-[#07080d]/80 border-l-2 border-[#10b981] border border-white/[0.06] text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-code text-[#10b981] font-bold flex items-center gap-1.5">
                <ShieldCheck size={13} />
                [Agent Remediator]
              </span>
              <span className="font-code text-zinc-500 text-[10px]">T+03:22 UTC</span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-[11px]">
              "Mitigation graph generated. Quarantine priority: Revoke active OAuth tokens immediately. Preparing micro-segmented IAM boundary policy to arrest ACH ledger traversal."
            </p>
            <div className="mt-1.5 flex items-center gap-2 font-code text-[9px]">
              <span className="text-[#10b981]">Containment Radius: 4 Assets</span>
              <span className="text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-1 rounded">
                Playbook 0x7F Loaded
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Bedrock Operator Query Terminal */}
        <div className="mt-3 pt-3 border-t border-white/[0.08]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuery()}
              placeholder="Prompt Bedrock Agent (e.g., 'simulate bypass on Okta MFA')..."
              className="w-full bg-[#040508] border border-white/10 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] font-code text-[11px] py-1.5 pl-3 pr-16 rounded-lg text-white placeholder:text-zinc-600 outline-none transition-all"
            />
            <button
              onClick={handleQuery}
              className="absolute right-1 text-[#06b6d4] font-code text-[10px] font-bold bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 border border-[#06b6d4]/30 px-2 py-1 rounded"
            >
              QUERY
            </button>
          </div>

          {/* Real-time Query Response */}
          {queryResponse && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/30 font-code text-[10px] text-[#06b6d4] leading-relaxed"
            >
              {queryResponse}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
