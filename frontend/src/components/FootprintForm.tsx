"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";
import { ServiceId } from "../types";

interface Props {
  selected: ServiceId[];
  setSelected: (services: ServiceId[]) => void;
  onContainAll?: () => void;
}

const CHANNELS = [
  {
    id: "email" as ServiceId,
    name: "Work Email",
    handle: "@primary-sso",
    status: "+Breached",
    isNegative: false,
    icon: <Mail size={16} />,
    iconBg: "#fceee9",
    iconColor: "#e85d43",
  },
  {
    id: "google" as ServiceId,
    name: "Google Drive",
    handle: "@cloud-storage",
    status: "-Exposed",
    isNegative: true,
    icon: <Cloud size={16} />,
    iconBg: "#e6f4f1",
    iconColor: "#359381",
  },
  {
    id: "amazon" as ServiceId,
    name: "AWS Console",
    handle: "@cloud-infra",
    status: "+Critical",
    isNegative: false,
    icon: <ShoppingCart size={16} />,
    iconBg: "#fef5ea",
    iconColor: "#e59b38",
  },
  {
    id: "bank" as ServiceId,
    name: "Bank Vault",
    handle: "@treasury-ach",
    status: "-$2.4M",
    isNegative: true,
    icon: <Landmark size={16} />,
    iconBg: "#fceee9",
    iconColor: "#e85d43",
  },
  {
    id: "whatsapp" as ServiceId,
    name: "WhatsApp",
    handle: "@sms-2fa",
    status: "+Routing",
    isNegative: false,
    icon: <MessageCircle size={16} />,
    iconBg: "#e6f4f1",
    iconColor: "#359381",
  },
  {
    id: "instagram" as ServiceId,
    name: "Instagram",
    handle: "@enterprise",
    status: "+Exposed",
    isNegative: false,
    icon: <Camera size={16} />,
    iconBg: "#eef2ff",
    iconColor: "#6366f1",
  },
];

export function FootprintForm({ selected, setSelected, onContainAll }: Props) {
  function toggle(id: ServiceId) {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  return (
    <div className="bg-[#e9f4f1] rounded-[28px] p-5 sm:p-6 border border-[#d6eae4] figma-shadow">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Label */}
        <div className="shrink-0">
          <div className="font-heading text-base font-extrabold text-[#1c1917]">
            Channels
          </div>
          <div className="text-[11px] text-[#57534e] mt-0.5">
            Connected assets · Toggle scope
          </div>
        </div>

        {/* Horizontal Row of White Rounded Cards (Exact Crowz Channels Style) */}
        <div className="flex-1 flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full justify-start lg:justify-end">
          {CHANNELS.map((ch) => {
            const isSelected = selected.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => toggle(ch.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border transition-all figma-shadow shrink-0 ${
                  isSelected
                    ? "border-transparent ring-2 ring-[#359381]/30 hover:scale-105"
                    : "opacity-50 border-[#e8dfd5] hover:opacity-80"
                }`}
                style={{ width: 96, minWidth: 96, height: 116 }}
              >
                {/* Rounded Colored Icon Circle */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5"
                  style={{ background: ch.iconBg, color: ch.iconColor }}
                >
                  {ch.icon}
                </div>

                {/* Name & Handle */}
                <div className="font-heading text-[11px] font-bold text-[#1c1917] truncate max-w-[85px]">
                  {ch.name}
                </div>
                <div className="text-[9px] text-[#78716c] truncate max-w-[80px]">
                  {ch.handle}
                </div>

                {/* Status Metric */}
                <div
                  className={`mt-1.5 font-heading text-[11px] font-bold ${
                    ch.isNegative ? "text-[#e85d43]" : "text-[#359381]"
                  }`}
                >
                  {ch.status}
                </div>
              </button>
            );
          })}

          {/* Full Stats / Contain All Action Card (Exact Crowz Green Card) */}
          <button
            onClick={onContainAll}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#359381] text-white hover:bg-[#2c7d6e] transition-all shadow-md active:scale-95 shrink-0"
            style={{ width: 96, minWidth: 96, height: 116 }}
          >
            <div className="font-heading text-[11px] font-extrabold text-center leading-tight mb-2">
              Full Stats & Lockdown
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
