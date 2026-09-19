"use client";

import { useState, KeyboardEvent } from "react";
import {
  Shield,
  LayoutDashboard,
  Zap,
  Network,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onReset: () => void;
  onTriggerSimulation: () => void;
  onOpenPlaybook: () => void;
  onScrollToAttackPath: () => void;
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
}: SidebarProps) {
  const [emailSaved, setEmailSaved] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} />, hasBadge: true },
    { id: "simulation", label: "Threat Engine", icon: <Zap size={17} /> },
    { id: "cascade", label: "Attack Path", icon: <Network size={17} /> },
    { id: "playbook", label: "Lockdown", icon: <ShieldCheck size={17} /> },
  ];

  function handleNavClick(id: string) {
    setActiveTab(id);
    if (id === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "simulation") {
      onTriggerSimulation();
    } else if (id === "cascade") {
      onScrollToAttackPath();
    } else if (id === "playbook") {
      onOpenPlaybook();
    }
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
        {/* Brand Logo with 4 colored squares (Crowz / Figma style) */}
        <button
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

        {/* Profile Card (Robert Grant style) */}
        <div className="mb-7 flex flex-col items-center text-center p-4 rounded-2xl bg-white/70 border border-[#e8dfd5] figma-shadow">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f5a78c] to-[#e85d43] p-0.5">
              <div className="w-full h-full rounded-full bg-[#fceee9] flex items-center justify-center text-xl font-bold text-[#e85d43]">
                AC
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#359381] border-2 border-white" />
          </div>
          <div className="font-heading text-sm font-bold text-[#1c1917]">Alex Chen</div>
          <div className="text-[11px] text-[#78716c] mt-0.5">SecOps Lead Analyst</div>

          {/* Email Target Input with Enter hint */}
          <div className="mt-2 w-full relative">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              title="Press Enter to simulate target email"
              placeholder="name@domain.com"
              className="w-full text-center text-[10px] font-code py-1.5 px-2 rounded-lg bg-white border border-[#e8dfd5] text-[#57534e] focus:outline-none focus:border-[#e85d43] pr-6"
            />
            {emailSaved ? (
              <Check size={12} className="absolute right-2 top-2 text-[#359381]" />
            ) : (
              <span className="absolute right-2 top-2 text-[9px] text-[#a8a29e] pointer-events-none">↵</span>
            )}
          </div>
        </div>

        {/* Navigation Items - Every single button triggers a live action */}
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
                  <span className={isActive ? "text-[#e85d43]" : "text-[#a8a29e]"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-[#e85d43]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Reset */}
      <div className="pt-6 border-t border-[#e8dfd5] space-y-3">
        <div className="flex items-center gap-2 px-2 text-[11px] text-[#78716c]">
          <span className="w-2 h-2 rounded-full bg-[#359381] animate-pulse" />
          <span>AWS Bedrock (Claude 3)</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#78716c] hover:bg-white hover:text-[#1c1917] transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset Simulation</span>
        </button>
      </div>
    </aside>
  );
}
