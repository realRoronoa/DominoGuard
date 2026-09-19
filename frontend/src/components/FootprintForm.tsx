"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart, Check } from "lucide-react";
import { ServiceId } from "../types";

export interface ServiceItem {
  id: ServiceId;
  name: string;
  category: string;
  icon: React.ReactNode;
  riskColor: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "email",
    name: "Primary Email",
    category: "Master SSO Hub",
    icon: <Mail size={16} />,
    riskColor: "#ef4444",
  },
  {
    id: "google",
    name: "Google Workspace",
    category: "Drive & Cloud Docs",
    icon: <Cloud size={16} />,
    riskColor: "#f59e0b",
  },
  {
    id: "amazon",
    name: "AWS & Amazon",
    category: "Cloud Infrastructure",
    icon: <ShoppingCart size={16} />,
    riskColor: "#ef4444",
  },
  {
    id: "bank",
    name: "Banking & Treasury",
    category: "Payment Rails",
    icon: <Landmark size={16} />,
    riskColor: "#ef4444",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "SMS & 2FA Routing",
    icon: <MessageCircle size={16} />,
    riskColor: "#10b981",
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social & Brand",
    icon: <Camera size={16} />,
    riskColor: "#06b6d4",
  },
];

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
    } else {
      setSelected([...selected, id]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Connected Accounts
        </span>
        <span className="font-code text-xs text-zinc-500">
          {selected.length} of {SERVICES.length} active
        </span>
      </div>

      {/* Clean 2-column or 1-column grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {SERVICES.map((s) => {
          const isSelected = selected.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                isSelected
                  ? "border-white/20 bg-white/[0.05] text-white shadow-sm"
                  : "border-white/[0.04] bg-white/[0.01] text-zinc-500 hover:border-white/10 hover:text-zinc-300"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  isSelected
                    ? "border-white/20 bg-white/[0.08] text-white"
                    : "border-white/[0.06] bg-transparent text-zinc-600"
                }`}
              >
                {s.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium leading-tight">{s.name}</div>
                <div className="truncate text-[10px] text-zinc-500">{s.category}</div>
              </div>

              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-400 text-black"
                    : "border-zinc-700 bg-transparent"
                }`}
              >
                {isSelected && <Check size={10} className="stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
