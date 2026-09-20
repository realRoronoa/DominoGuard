"use client";

import { useState, KeyboardEvent } from "react";
import {
  LayoutDashboard,
  Zap,
  Network,
  ShieldCheck,
  RotateCcw,
  Check,
  ShieldQuestion,
} from "lucide-react";

import { SimulationResult, ThreatIntel } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onReset: () => void;
  onTriggerSimulation: () => void;
  onOpenPlaybook: () => void;
  onScrollToAttackPath: () => void;
  threatIntel?: ThreatIntel;
  metrics?: SimulationResult["metrics"];
}

export function Sidebar({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  onReset,
  onTriggerSimulation,
  onOpenPlaybook,
  onScrollToAttackPath,
  threatIntel,
  metrics,
}: SidebarProps) {
  const [emailSaved, setEmailSaved] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { id: "simulation", label: "Run Simulation", icon: <Zap size={17} /> },
    { id: "cascade", label: "Chain", icon: <Network size={17} /> },
    { id: "playbook", label: "Lockdown Plan", icon: <ShieldCheck size={17} /> },
  ];

  function handleNavClick(id: string) {
    setActiveTab(id);
    if (id === "dashboard") window.scrollTo({ top: 0, behavior: "smooth" });
    else if (id === "simulation") onTriggerSimulation();
    else if (id === "cascade") onScrollToAttackPath();
    else if (id === "playbook") onOpenPlaybook();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setEmailSaved(true);
      onTriggerSimulation();
      setTimeout(() => setEmailSaved(false), 1500);
    }
  }

  return (
    <aside className="w-full md:w-64 shrink-0 bg-[#f4ede4] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e8dfd5]">
      <div>
        <button
          type="button"
          onClick={() => handleNavClick("dashboard")}
          className="flex items-center gap-3 mb-8 text-left hover:opacity-80 transition-opacity"
        >
          <div className="grid grid-cols-2 gap-1 w-6 h-6">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#e85d43]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#e59b38]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#359381]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#3ea6c8]" />
          </div>
          <span className="font-heading text-lg font-extrabold tracking-tight text-[#1c1917]">
            Domino<span className="text-[#e85d43]">Guard</span>
          </span>
        </button>

        {/* Optional breach check. Nothing runs here until the user types an address. */}
        <div className="mb-7 flex flex-col items-center text-center p-4 rounded-2xl bg-white/70 border border-[#e8dfd5] figma-shadow">
          <div className="w-12 h-12 rounded-full bg-[#fceee9] flex items-center justify-center text-[#e85d43] mb-2">
            <ShieldQuestion size={22} />
          </div>
          <div className="font-heading text-sm font-bold text-[#1c1917]">Breach check</div>
          <div className="text-[11px] text-[#78716c] mt-0.5 leading-snug">
            Optional. Your address is sent to a public breach database to look for past leaks.
          </div>

          <div className="mt-2.5 w-full relative">
            <label htmlFor="intel-email" className="sr-only">
              Email address to check against public breach records
            </label>
            <input
              id="intel-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              title="Press Enter to check this address"
              placeholder="you@example.com"
              className="w-full text-center text-[10px] font-code py-1.5 px-2 rounded-lg bg-white border border-[#e8dfd5] text-[#57534e] focus:outline-none focus:border-[#e85d43] pr-6"
            />
            {emailSaved ? (
              <Check size={12} className="absolute right-2 top-2 text-[#359381]" />
            ) : (
              <span className="absolute right-2 top-2 text-[9px] text-[#a8a29e] pointer-events-none">
                ↵
              </span>
            )}
          </div>

          {threatIntel && (
            <div className="mt-2 w-full">
              {threatIntel.checked ? (
                threatIntel.pwned ? (
                  <div
                    title={`Named in: ${threatIntel.topBreaches.join(", ")}`}
                    className="px-2 py-1 rounded-lg bg-[#fceee9] border border-[#e85d43]/30 text-[9px] text-[#e85d43] font-semibold text-center flex items-center justify-center gap-1 cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e85d43] shrink-0" />
                    <span className="truncate">
                      {threatIntel.breachCount} past breach
                      {threatIntel.breachCount === 1 ? "" : "es"}
                    </span>
                  </div>
                ) : (
                  <div className="px-2 py-1 rounded-lg bg-[#e6f4f1] border border-[#359381]/30 text-[9px] text-[#359381] font-semibold text-center flex items-center justify-center gap-1 cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#359381] shrink-0" />
                    <span>No public breach records</span>
                  </div>
                )
              ) : (
                // An outage must not read as an all-clear.
                <div
                  title={threatIntel.unavailableReason}
                  className="px-2 py-1 rounded-lg bg-[#f4ede4] border border-[#d6cec4] text-[9px] text-[#78716c] font-semibold text-center flex items-center justify-center gap-1 cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8a29e] shrink-0" />
                  <span className="truncate">
                    {email ? "Check unavailable" : "Not checked"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-[#1c1917] figma-shadow"
                    : "text-[#78716c] hover:bg-white/50 hover:text-[#1c1917]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-[#e85d43]" : "text-[#a8a29e]"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#e8dfd5] space-y-3">
        <div className="flex items-center gap-2 px-2 text-[11px] text-[#78716c]">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: metrics?.bedrockEnabled ? "#359381" : "#a8a29e" }}
          />
          <span className="truncate" title={metrics?.modelId}>
            {metrics ? (metrics.bedrockEnabled ? "Bedrock connected" : "Deterministic mode") : "Not connected"}
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#78716c] hover:bg-white hover:text-[#1c1917] transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset simulation</span>
        </button>
      </div>
    </aside>
  );
}
