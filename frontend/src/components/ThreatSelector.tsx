"use client";

import { Mail, Phone, Link2, Zap } from "lucide-react";
import { ThreatScenario } from "../types";

export interface ThreatOption {
  id: ThreatScenario;
  title: string;
  detail: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

const SCENARIOS: ThreatOption[] = [
  {
    id: "email_compromise",
    title: "Email Password Breach",
    detail: "Attacker gains master email credentials via phishing or data dump",
    icon: <Mail size={16} />,
    badge: "Most Common",
    badgeColor: "#ef4444",
  },
  {
    id: "sim_swap",
    title: "SIM Swap Hijack",
    detail: "Mobile phone number ported; attacker intercepts 2FA SMS codes",
    icon: <Phone size={16} />,
    badge: "High Impact",
    badgeColor: "#f59e0b",
  },
  {
    id: "oauth_hijack",
    title: "OAuth Token Theft",
    detail: "Active session or refresh token stolen via third-party integration",
    icon: <Link2 size={16} />,
    badge: "Stealthy",
    badgeColor: "#06b6d4",
  },
];

export function ThreatSelector({
  scenario,
  setScenario,
  onRun,
  loading,
}: {
  scenario: ThreatScenario;
  setScenario: (s: ThreatScenario) => void;
  onRun: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Threat Scenario
        </span>
        <span className="text-xs text-zinc-500">Pick starting vector</span>
      </div>

      <div className="space-y-2">
        {SCENARIOS.map((s) => {
          const isActive = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-cyan-500/50 bg-cyan-500/[0.06] text-white shadow-sm shadow-cyan-500/10"
                  : "border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:border-white/10 hover:text-zinc-200"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  isActive
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                    : "border-white/[0.06] bg-transparent text-zinc-500"
                }`}
              >
                {s.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold">{s.title}</span>
                  <span
                    className="font-code text-[9px] px-1.5 py-0.5 rounded border"
                    style={{
                      color: s.badgeColor,
                      borderColor: `${s.badgeColor}30`,
                      background: `${s.badgeColor}10`,
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-0.5">{s.detail}</div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onRun}
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-4 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="animate-spin text-white">⟳</span>
            <span>Running AI Simulation...</span>
          </>
        ) : (
          <>
            <Zap size={14} className="fill-white" />
            <span>Simulate Cascade Blast Radius</span>
          </>
        )}
      </button>
    </div>
  );
}
