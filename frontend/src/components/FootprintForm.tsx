"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart } from "lucide-react";
import { ServiceId } from "../types";

const services: { id: ServiceId; label: string; detail: string; icon: React.ReactNode; risk: string }[] = [
  { id: "email",     label: "Primary Email",    detail: "Recovery hub",  icon: <Mail size={16} />,          risk: "critical" },
  { id: "instagram", label: "Instagram",         detail: "Social",        icon: <Camera size={16} />,        risk: "high" },
  { id: "whatsapp",  label: "WhatsApp",           detail: "Messaging",     icon: <MessageCircle size={16} />, risk: "high" },
  { id: "bank",      label: "Banking",            detail: "High impact",   icon: <Landmark size={16} />,      risk: "critical" },
  { id: "google",    label: "Drive / Photos",     detail: "Cloud data",    icon: <Cloud size={16} />,         risk: "high" },
  { id: "amazon",    label: "Amazon",             detail: "Shopping",      icon: <ShoppingCart size={16} />,  risk: "medium" },
];

const RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
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
      if (selected.length === 1) return;
      setSelected(selected.filter((x) => x !== id));
    } else setSelected([...selected, id]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">01 · Digital footprint</div>
        <div className="text-xs font-mono text-zinc-600">
          <span className="text-zinc-400">{selected.length}</span>
          <span className="text-zinc-700">/{services.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((s) => {
          const isSelected = selected.includes(s.id);
          const riskColor = RISK_COLORS[s.risk];
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: isSelected ? riskColor + "50" : "rgba(255,255,255,0.06)",
                background: isSelected ? riskColor + "0d" : "rgba(0,0,0,0.15)",
                boxShadow: isSelected ? `0 0 12px ${riskColor}15` : "none",
              }}
            >
              {/* Icon */}
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all duration-200"
                style={{
                  background: isSelected ? riskColor + "20" : "rgba(255,255,255,0.05)",
                  color: isSelected ? riskColor : "#71717a",
                  border: `1px solid ${isSelected ? riskColor + "40" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {s.icon}
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: isSelected ? "#f4f4f5" : "#a1a1aa" }}
                >
                  {s.label}
                </div>
                <div className="text-[10px] text-zinc-600">{s.detail}</div>
              </div>

              {/* Risk dot + toggle */}
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: riskColor, opacity: isSelected ? 1 : 0.3 }}
                />
                <div
                  className="h-4 w-4 rounded-full border-2 transition-all duration-200 grid place-items-center"
                  style={{
                    borderColor: isSelected ? riskColor : "#52525b",
                    background: isSelected ? riskColor : "transparent",
                  }}
                >
                  {isSelected && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info note */}
      <div className="text-[10px] text-zinc-600 leading-4 pt-1">
        Select the accounts you use. More connected accounts = larger blast radius.
      </div>
    </div>
  );
}
