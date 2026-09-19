"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart, Check, ShieldAlert } from "lucide-react";
import { ServiceId } from "../types";

export interface ServiceMeta {
  id: ServiceId;
  label: string;
  detail: string;
  role: string;
  mitreTag: string;
  icon: React.ReactNode;
  risk: "critical" | "high" | "medium";
}

export const SERVICES_CONFIG: ServiceMeta[] = [
  {
    id: "email",
    label: "Work Email (SAML SSO)",
    detail: "Primary authentication hub & password reset target",
    role: "Breach Root",
    mitreTag: "T1566.002",
    icon: <Mail size={16} />,
    risk: "critical",
  },
  {
    id: "google",
    label: "Google Workspace & Cloud",
    detail: "Central OAuth token provider & shared drives",
    role: "OAuth Hub",
    mitreTag: "T1539",
    icon: <Cloud size={16} />,
    risk: "critical",
  },
  {
    id: "amazon",
    label: "AWS Cloud Console & IAM",
    detail: "Production microservices, IAM roles, and storage",
    role: "Cloud Infra",
    mitreTag: "T1078",
    icon: <ShoppingCart size={16} />,
    risk: "critical",
  },
  {
    id: "bank",
    label: "Corporate Banking Portal",
    detail: "Treasury ledger, automated ACH & wire transfers",
    role: "Financial Rails",
    mitreTag: "T1020",
    icon: <Landmark size={16} />,
    risk: "critical",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Business & SIM",
    detail: "SMS OTP intercept & identity verification channel",
    role: "Telephony Trust",
    mitreTag: "T1458",
    icon: <MessageCircle size={16} />,
    risk: "high",
  },
  {
    id: "instagram",
    label: "Instagram Enterprise",
    detail: "Public brand reputation & customer communications",
    role: "Brand Channel",
    mitreTag: "T1586",
    icon: <Camera size={16} />,
    risk: "medium",
  },
];

const RISK_THEMES = {
  critical: {
    color: "#ef4444",
    border: "rgba(239, 68, 68, 0.4)",
    bg: "rgba(239, 68, 68, 0.08)",
    badgeBg: "rgba(239, 68, 68, 0.15)",
    glow: "0 0 14px rgba(239, 68, 68, 0.25)",
  },
  high: {
    color: "#f59e0b",
    border: "rgba(245, 158, 11, 0.4)",
    bg: "rgba(245, 158, 11, 0.08)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    glow: "0 0 14px rgba(245, 158, 11, 0.2)",
  },
  medium: {
    color: "#06b6d4",
    border: "rgba(6, 182, 212, 0.4)",
    bg: "rgba(6, 182, 212, 0.08)",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    glow: "0 0 14px rgba(6, 182, 212, 0.2)",
  },
};

export function FootprintForm({
  selected,
  setSelected,
}: {
  selected: ServiceId[];
  setSelected: (next: ServiceId[]) => void;
}) {
  function toggle(id: ServiceId) {
    if (selected.includes(id)) {
      if (selected.length === 1) return; // Keep at least one
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  function selectAll() {
    setSelected(SERVICES_CONFIG.map((s) => s.id));
  }

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-[#06b6d4]" />
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-zinc-300">
            01 · Digital Footprint Perimeter
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-[10px] font-code text-zinc-500 hover:text-[#06b6d4] transition-colors"
          >
            Select All
          </button>
          <span className="font-code text-[11px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#06b6d4]">
            {selected.length}/{SERVICES_CONFIG.length} Active
          </span>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-zinc-400">
        Connected identity assets in scope for simulated red-team compromise and lateral blast radius mapping:
      </p>

      {/* Service Cards Grid */}
      <div className="space-y-2">
        {SERVICES_CONFIG.map((s) => {
          const isSelected = selected.includes(s.id);
          const theme = RISK_THEMES[s.risk];

          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="group relative flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: isSelected ? theme.border : "rgba(255, 255, 255, 0.06)",
                background: isSelected ? theme.bg : "rgba(12, 14, 23, 0.6)",
                boxShadow: isSelected ? theme.glow : "none",
              }}
            >
              {/* Icon Container */}
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200"
                style={{
                  background: isSelected ? theme.badgeBg : "rgba(255, 255, 255, 0.04)",
                  borderColor: isSelected ? theme.border : "rgba(255, 255, 255, 0.08)",
                  color: isSelected ? theme.color : "#94a3b8",
                }}
              >
                {s.icon}
              </div>

              {/* Label & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="font-heading text-xs font-semibold tracking-wide transition-colors"
                    style={{ color: isSelected ? "#f1f5f9" : "#94a3b8" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="font-code text-[9px] uppercase px-1.5 py-0.2 rounded border"
                    style={{
                      color: theme.color,
                      borderColor: theme.border,
                      background: theme.badgeBg,
                    }}
                  >
                    {s.role}
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] leading-tight text-zinc-400">
                  {s.detail}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-code text-[9px] text-zinc-500">MITRE: {s.mitreTag}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="font-code text-[9px] uppercase" style={{ color: theme.color }}>
                    {s.risk} risk
                  </span>
                </div>
              </div>

              {/* Selection Checkbox */}
              <div
                className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200"
                style={{
                  borderColor: isSelected ? theme.color : "rgba(255, 255, 255, 0.2)",
                  background: isSelected ? theme.color : "transparent",
                }}
              >
                {isSelected && <Check size={11} className="text-[#07080d] stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
