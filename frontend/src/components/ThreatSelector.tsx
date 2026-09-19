"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Link2, Zap, Flame, ShieldAlert } from "lucide-react";
import { ThreatScenario } from "../types";

export interface ScenarioMeta {
  id: ThreatScenario;
  title: string;
  technique: string;
  mitreId: string;
  probability: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

export const THREAT_SCENARIOS: ScenarioMeta[] = [
  {
    id: "email_compromise",
    title: "Targeted Spearphishing & SSO Takeover",
    technique: "Credential Access · Weaponized Auth Link",
    mitreId: "T1566.002",
    probability: "98.4%",
    description: "Primary corporate email compromised via crafted SAML SSO lure. Attacker gains master password reset authority.",
    icon: <Mail size={17} />,
    accentColor: "#ef4444",
  },
  {
    id: "sim_swap",
    title: "SIM Swapping Telephony Hijack",
    technique: "Initial Access · Carrier Porting Abuse",
    mitreId: "T1458",
    probability: "84.1%",
    description: "Telecom trust betrayed via social-engineered eSIM transfer. Attacker hijacks inbound SMS OTP verification codes.",
    icon: <Phone size={17} />,
    accentColor: "#f59e0b",
  },
  {
    id: "oauth_hijack",
    title: "OAuth Bearer Token Exfiltration",
    technique: "Persistence · Malicious App Consent",
    mitreId: "T1539",
    probability: "91.7%",
    description: "Rogue third-party app consent granted. Long-lived refresh tokens stolen without triggering password reset alarms.",
    icon: <Link2 size={17} />,
    accentColor: "#06b6d4",
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
  const current = THREAT_SCENARIOS.find((s) => s.id === scenario) ?? THREAT_SCENARIOS[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-[#ef4444]" />
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-zinc-300">
            02 · Threat Infiltration Vector
          </span>
        </div>
        <span className="font-code text-[10px] text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded">
          {current.mitreId}
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-zinc-400">
        Select initial attack vector to trigger Bedrock multi-agent red-team simulation:
      </p>

      {/* Scenario Cards */}
      <div className="space-y-2.5">
        {THREAT_SCENARIOS.map((s) => {
          const isActive = scenario === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className="group relative flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: isActive ? s.accentColor : "rgba(255, 255, 255, 0.08)",
                background: isActive
                  ? `linear-gradient(135deg, rgba(12, 14, 23, 0.95), ${s.accentColor}18)`
                  : "rgba(12, 14, 23, 0.6)",
                boxShadow: isActive ? `0 0 18px ${s.accentColor}30` : "none",
              }}
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all"
                    style={{
                      background: isActive ? `${s.accentColor}25` : "rgba(255, 255, 255, 0.04)",
                      borderColor: isActive ? s.accentColor : "rgba(255, 255, 255, 0.08)",
                      color: isActive ? s.accentColor : "#94a3b8",
                    }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="font-heading text-xs font-bold tracking-tight transition-colors"
                    style={{ color: isActive ? "#f1f5f9" : "#cbd5e1" }}
                  >
                    {s.title}
                  </span>
                </div>

                {/* Probability Badge */}
                <span
                  className="font-code text-[10px] px-1.5 py-0.5 rounded border"
                  style={{
                    color: s.accentColor,
                    borderColor: `${s.accentColor}40`,
                    background: `${s.accentColor}15`,
                  }}
                >
                  {s.probability} Breach Prob
                </span>
              </div>

              {/* Technique & Description */}
              <div className="text-[10px] text-zinc-400 leading-snug">
                {s.description}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-1.5 text-[9px] font-code">
                <span className="text-zinc-500">{s.technique}</span>
                {isActive && (
                  <span className="flex items-center gap-1 font-semibold" style={{ color: s.accentColor }}>
                    <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ background: s.accentColor }} />
                    SELECTED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* High-Impact AI Simulation Button */}
      <div className="pt-1">
        <motion.button
          onClick={onRun}
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          className="relative w-full overflow-hidden rounded-xl py-3.5 px-4 font-heading text-xs font-bold uppercase tracking-wider text-[#07080d] transition-all disabled:cursor-wait disabled:opacity-80"
          style={{
            background: loading
              ? "linear-gradient(135deg, #06b6d4, #10b981)"
              : "linear-gradient(135deg, #06b6d4 0%, #38bdf8 50%, #4ade80 100%)",
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.45), 0 4px 15px rgba(0, 0, 0, 0.5)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 text-white">
              <span className="animate-spin text-white">⟳</span>
              <span>Synthesizing Blast Radius...</span>
              <span className="flex gap-1 ml-1">
                <span className="agent-dot h-1.5 w-1.5 rounded-full bg-white inline-block" />
                <span className="agent-dot h-1.5 w-1.5 rounded-full bg-white inline-block" />
                <span className="agent-dot h-1.5 w-1.5 rounded-full bg-white inline-block" />
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap size={15} className="fill-[#07080d]" />
              <span>Run AI Red-Team Simulation</span>
            </span>
          )}
        </motion.button>
      </div>

      <p className="text-[10px] leading-relaxed text-zinc-500 text-center">
        Privacy Guaranteed · No real credentials queried · Amazon Bedrock Multi-Agent Model
      </p>
    </div>
  );
}
