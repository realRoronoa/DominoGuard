"use client";

import { Mail, Camera, MessageCircle, Landmark, Cloud, ShoppingCart, ArrowRight, Check } from "lucide-react";
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
      if (selected.length === 1) return; // keep at least 1 service
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  function selectAll() {
    setSelected(["email", "google", "amazon", "bank", "whatsapp", "instagram"]);
  }

  return (
    <div id="channels-section" className="bg-[#e9f4f1] rounded-[28px] p-5 sm:p-6 border border-[#d6eae4] figma-shadow">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Label + Quick Select All Button */}
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-extrabold text-[#1c1917]">
              Channels
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#359381] border border-[#d6eae4]">
              {selected.length}/6 Active
            </span>
          </div>
          <div className="text-[11px] text-[#57534e] mt-0.5">
            Connected assets · Toggle to adjust scope
          </div>
          {selected.length < 6 && (
            <button
              type="button"
              onClick={selectAll}
              className="mt-1 text-[10px] font-bold text-[#359381] hover:underline"
            >
              + Select all channels
            </button>
          )}
        </div>

        {/* Horizontal Row of White Rounded Cards (Exact Crowz Channels Style) */}
        <div className="flex-1 flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full justify-start lg:justify-end">
          {CHANNELS.map((ch) => {
            const isSelected = selected.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggle(ch.id)}
                title={isSelected ? `Click to remove ${ch.name}` : `Click to add ${ch.name}`}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border transition-all figma-shadow shrink-0 active:scale-95 ${
                  isSelected
                    ? "border-[#359381]/40 ring-2 ring-[#359381]/20 hover:scale-105"
                    : "opacity-45 border-[#e8dfd5] hover:opacity-75 hover:border-[#a8a29e]"
                }`}
                style={{ width: 96, minWidth: 96, height: 116 }}
              >
                {/* Active Selection Pip */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#359381] text-white flex items-center justify-center">
                    <Check size={8} className="stroke-[3]" />
                  </div>
                )}

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
                    !isSelected
                      ? "text-[#a8a29e]"
                      : ch.isNegative
                      ? "text-[#e85d43]"
                      : "text-[#359381]"
                  }`}
                >
                  {isSelected ? ch.status : "Excluded"}
                </div>
              </button>
            );
          })}

          {/* Full Stats / Contain All Action Card (Exact Crowz Green Card) */}
          <button
            type="button"
            onClick={onContainAll}
            title="Open lockdown playbook"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#359381] text-white hover:bg-[#2c7d6e] transition-all shadow-md active:scale-95 shrink-0 hover:scale-105"
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
