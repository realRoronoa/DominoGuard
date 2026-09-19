"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Link2, Zap } from "lucide-react";
import { ThreatScenario } from "../types";

const SCENARIOS: {
  id: ThreatScenario;
  label: string;
  sublabel: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}[] = [
  {
    id: "email_compromise",
    label: "Email Leaked",
    sublabel: "email_compromise",
    description: "Primary email password exposed via phishing or credential dump.",
    icon: <Mail size={18} />,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.2)",
  },
  {
    id: "sim_swap",
    label: "SIM Swap",
    sublabel: "sim_swap",
    description: "Phone / SIM trust hijacked. Attacker controls your number.",
    icon: <Phone size={18} />,
    color: "#f97316",
    glow: "rgba(249,115,22,0.2)",
  },
  {
    id: "oauth_hijack",
    label: "OAuth Hijack",
    sublabel: "oauth_hijack",
    description: "Connected OAuth session stolen. Trusted app access abused.",
    icon: <Link2 size={18} />,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.2)",
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
  const selected = SCENARIOS.find((s) => s.id === scenario)!;

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">02 · Trigger a scenario</div>

      {/* Scenario cards */}
      <div className="space-y-2">
        {SCENARIOS.map((s) => {
          const isActive = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className="flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: isActive ? s.color + "50" : "rgba(255,255,255,0.06)",
                background: isActive ? s.color + "0d" : "rgba(0,0,0,0.15)",
                boxShadow: isActive ? `0 0 16px ${s.glow}` : "none",
              }}
            >
              {/* Icon */}
              <div
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-all duration-200"
                style={{
                  background: isActive ? s.color + "20" : "rgba(255,255,255,0.05)",
                  color: isActive ? s.color : "#71717a",
                  borderColor: isActive ? s.color + "40" : "rgba(255,255,255,0.06)",
                }}
              >
                {s.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold transition-colors duration-200"
                  style={{ color: isActive ? "#f4f4f5" : "#a1a1aa" }}
                >
                  {s.label}
                </div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{s.description}</div>
              </div>

              {/* Selected indicator */}
              <div
                className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 grid place-items-center"
                style={{
                  borderColor: isActive ? s.color : "#52525b",
                  background: isActive ? s.color : "transparent",
                }}
              >
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Run button */}
      <motion.button
        onClick={onRun}
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        className="relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold text-black transition-all duration-200 disabled:cursor-wait disabled:opacity-70"
        style={{
          background: loading
            ? "rgba(255,255,255,0.7)"
            : "linear-gradient(135deg, #fff 0%, #e4e4e7 100%)",
          boxShadow: loading ? "none" : "0 0 30px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span>Simulating cascade</span>
            <span className="flex gap-1">
              <span className="agent-dot h-1.5 w-1.5 rounded-full bg-black/60 inline-block" />
              <span className="agent-dot h-1.5 w-1.5 rounded-full bg-black/60 inline-block" />
              <span className="agent-dot h-1.5 w-1.5 rounded-full bg-black/60 inline-block" />
            </span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap size={15} />
            Run AI Red-Team Simulation
          </span>
        )}
      </motion.button>

      {/* Privacy note */}
      <p className="text-[10px] leading-5 text-zinc-600">
        Defensive simulation only · No passwords, tokens, or live account access · Powered by{" "}
        <span className="text-zinc-500">Amazon Bedrock</span>
      </p>
    </div>
  );
}
