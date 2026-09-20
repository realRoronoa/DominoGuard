"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { CascadeNode, ServiceId, SimulationResult } from "../types";

interface Props {
  selected: ServiceId[];
  setSelected: (services: ServiceId[]) => void;
  result: SimulationResult | null;
  onContainAll?: () => void;
}

const ALL_SERVICES: ServiceId[] = ["email", "google", "amazon", "bank", "whatsapp", "instagram"];

const CHANNELS: {
  id: ServiceId;
  name: string;
  hint: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "email",
    name: "Primary Email",
    hint: "password resets",
    icon: <Mail size={16} />,
    iconBg: "#fceee9",
    iconColor: "#e85d43",
  },
  {
    id: "google",
    name: "Google Drive",
    hint: "files & photos",
    icon: <Cloud size={16} />,
    iconBg: "#e6f4f1",
    iconColor: "#359381",
  },
  {
    id: "amazon",
    name: "Amazon",
    hint: "orders & addresses",
    icon: <ShoppingCart size={16} />,
    iconBg: "#fef5ea",
    iconColor: "#e59b38",
  },
  {
    id: "bank",
    name: "Banking",
    hint: "money",
    icon: <Landmark size={16} />,
    iconBg: "#fceee9",
    iconColor: "#e85d43",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    hint: "messages & codes",
    icon: <MessageCircle size={16} />,
    iconBg: "#e6f4f1",
    iconColor: "#359381",
  },
  {
    id: "instagram",
    name: "Instagram",
    hint: "social",
    icon: <Camera size={16} />,
    iconBg: "#eef2ff",
    iconColor: "#6366f1",
  },
];

const STATUS_LABEL: Record<CascadeNode["status"], { text: string; color: string }> = {
  root: { text: "Start", color: "#e85d43" },
  high: { text: "High risk", color: "#e07a3f" },
  medium: { text: "Medium", color: "#e59b38" },
  low: { text: "Low", color: "#359381" },
};

export function FootprintForm({ selected, setSelected, result, onContainAll }: Props) {
  const byId = new Map(result?.cascade.map((n) => [n.id, n]) ?? []);
  const reachableCount = result?.metrics.reachableCount ?? 0;

  function toggle(id: ServiceId) {
    if (selected.includes(id)) {
      if (selected.length === 1) return; // the backend needs at least one account
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  return (
    <div
      id="channels-section"
      className="bg-[#e9f4f1] rounded-[28px] p-5 sm:p-6 border border-[#d6eae4] figma-shadow"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-extrabold text-[#1c1917]">Your Accounts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#359381] border border-[#d6eae4]">
              {selected.length}/{ALL_SERVICES.length} included
            </span>
          </div>
          <div className="text-[11px] text-[#57534e] mt-0.5">
            Tap an account to include or exclude it from the simulation
          </div>
          {selected.length < ALL_SERVICES.length && (
            <button
              type="button"
              onClick={() => setSelected(ALL_SERVICES)}
              className="mt-1 text-[10px] font-bold text-[#359381] hover:underline"
            >
              + Include all accounts
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full justify-start lg:justify-end">
          {CHANNELS.map((ch) => {
            const isSelected = selected.includes(ch.id);
            const node = byId.get(ch.id);
            const reachable = node ? node.order < reachableCount : false;
            const status = node ? STATUS_LABEL[node.status] : null;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggle(ch.id)}
                title={
                  node
                    ? node.reason
                    : isSelected
                    ? `Click to exclude ${ch.name}`
                    : `Click to include ${ch.name}`
                }
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border transition-all figma-shadow shrink-0 active:scale-95 ${
                  isSelected
                    ? "border-[#359381]/40 ring-2 ring-[#359381]/20 hover:scale-105"
                    : "opacity-45 border-[#e8dfd5] hover:opacity-75 hover:border-[#a8a29e]"
                }`}
                style={{ width: 96, minWidth: 96, height: 116 }}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#359381] text-white flex items-center justify-center">
                    <Check size={8} className="stroke-[3]" />
                  </div>
                )}

                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5"
                  style={{ background: ch.iconBg, color: ch.iconColor }}
                >
                  {ch.icon}
                </div>

                <div className="font-heading text-[11px] font-bold text-[#1c1917] truncate max-w-[85px]">
                  {ch.name}
                </div>
                <div className="text-[9px] text-[#78716c] truncate max-w-[80px]">{ch.hint}</div>

                <div
                  className="mt-1.5 font-heading text-[11px] font-bold"
                  style={{
                    color: !isSelected
                      ? "#a8a29e"
                      : !status
                      ? "#a8a29e"
                      : reachable
                      ? status.color
                      : "#a8a29e",
                  }}
                >
                  {!isSelected ? "Excluded" : !status ? "—" : reachable ? status.text : "Unreached"}
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onContainAll}
            title="Open the lockdown plan"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#359381] text-white hover:bg-[#2c7d6e] transition-all shadow-md active:scale-95 shrink-0 hover:scale-105"
            style={{ width: 96, minWidth: 96, height: 116 }}
          >
            <div className="font-heading text-[11px] font-extrabold text-center leading-tight mb-2">
              Lockdown Plan
            </div>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight size={12} className="stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
