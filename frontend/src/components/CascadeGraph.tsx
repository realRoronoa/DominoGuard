"use client";

import { useState } from "react";
import { ChevronDown, ArrowUpRight, Check, AlertCircle, ShieldAlert } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  nodes: SimulationResult["cascade"];
  agentTrace?: SimulationResult["agentTrace"];
  onOpenAuditLogs?: () => void;
}

export function CascadeGraph({ nodes, agentTrace, onOpenAuditLogs }: Props) {
  const [selectedHopIdx, setSelectedHopIdx] = useState<number>(2); // Default to Hop 03 (AWS)
  const [filterMode, setFilterMode] = useState<"all" | "critical">("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // 6 timeline points for the Activity wave with exact SVG coordinates
  const hops = [
    { num: "01", label: "Email", status: "Root", sub: "Initial Breach", value: 95, cx: 45, cy: 80, color: "#e85d43", isCritical: false },
    { num: "02", label: "Google", status: "SSO", sub: "OAuth Relay", value: 78, cx: 135, cy: 68, color: "#3ea6c8", isCritical: false },
    { num: "03", label: "AWS", status: "Admin", sub: "PrivEsc Verified", value: 98, cx: 250, cy: 25, color: "#e59b38", isCritical: true },
    { num: "04", label: "Bank", status: "ACH", sub: "Treasury Route", value: 88, cx: 335, cy: 62, color: "#e85d43", isCritical: true },
    { num: "05", label: "WhatsApp", status: "2FA", sub: "SMS Intercept", value: 65, cx: 415, cy: 82, color: "#359381", isCritical: false },
    { num: "06", label: "Instagram", status: "Social", sub: "Session Stolen", value: 45, cx: 475, cy: 60, color: "#6366f1", isCritical: false },
  ];

  const currentHop = hops[selectedHopIdx] || hops[2];

  return (
    <div id="attack-path-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left Card: Cascade Activity Path (Exact Crowz Activity Card Style) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 relative">
          <div>
            <div className="font-heading text-base font-bold text-[#1c1917]">
              Cascade Activity
            </div>
            <div className="text-[11px] text-[#78716c]">
              Interactive attack path · Select any hop to inspect
            </div>
          </div>

          {/* Interactive Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-[#1c1917] bg-[#f5ede2] hover:bg-[#ede3d6] px-3 py-1.5 rounded-xl border border-[#e8dfd5] transition-colors"
            >
              <span>{filterMode === "all" ? "Hops 01 - 06 (All)" : "Critical Pivots Only"}</span>
              <ChevronDown size={12} className={`transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl p-1.5 border border-[#e8dfd5] shadow-xl z-20 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setFilterMode("all");
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    filterMode === "all" ? "bg-[#f5ede2] text-[#1c1917]" : "text-[#78716c] hover:bg-[#faf8f5]"
                  }`}
                >
                  <span>All 6 Hops</span>
                  {filterMode === "all" && <Check size={13} className="text-[#e85d43]" />}
                </button>
                <button
                  onClick={() => {
                    setFilterMode("critical");
                    setSelectedHopIdx(2); // Jump to critical AWS hop
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    filterMode === "critical" ? "bg-[#f5ede2] text-[#1c1917]" : "text-[#78716c] hover:bg-[#faf8f5]"
                  }`}
                >
                  <span>Critical Only</span>
                  {filterMode === "critical" && <Check size={13} className="text-[#e85d43]" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Smooth SVG Spline Wave Chart */}
        <div className="relative my-3 h-40 w-full flex items-center justify-center">
          <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
            {/* Grid Guidelines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#f4ede4" strokeDasharray="3 3" />
            <line x1="0" y1="70" x2="500" y2="70" stroke="#f4ede4" strokeDasharray="3 3" />
            <line x1="0" y1="110" x2="500" y2="110" stroke="#f4ede4" strokeDasharray="3 3" />

            {/* Smooth Spline Curve */}
            <path
              d="M 10 90 Q 60 40 120 70 T 250 25 T 370 85 T 490 60"
              fill="none"
              stroke="#e59b38"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Clickable points along the curve */}
            {hops.map((h, idx) => {
              const isSelected = selectedHopIdx === idx;
              return (
                <g key={h.num} onClick={() => setSelectedHopIdx(idx)} className="cursor-pointer">
                  {isSelected && (
                    <>
                      <circle cx={h.cx} cy={h.cy} r="12" fill={h.color} opacity="0.2" className="animate-ping" />
                      <circle cx={h.cx} cy={h.cy} r="8" fill={h.color} opacity="0.3" />
                    </>
                  )}
                  <circle
                    cx={h.cx}
                    cy={h.cy}
                    r={isSelected ? "5.5" : "3.5"}
                    fill={isSelected ? h.color : "#d6c9bc"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all hover:scale-125"
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Dynamic Tooltip Badge (Points directly to selected hop) */}
          <div
            className="absolute top-0 bg-white px-3 py-1.5 rounded-xl border border-[#e8dfd5] shadow-lg text-center transition-all duration-300 pointer-events-none"
            style={{
              left: `${(currentHop.cx / 500) * 100}%`,
              transform: "translate(-50%, -10%)",
            }}
          >
            <div className="font-heading text-xs font-extrabold text-[#1c1917] whitespace-nowrap">
              Hop {currentHop.num}: {currentHop.label} {currentHop.status}
            </div>
            <div
              className="text-[9px] font-bold"
              style={{ color: currentHop.color }}
            >
              {currentHop.sub} · {currentHop.value}% Exposure
            </div>
          </div>
        </div>

        {/* Bottom Interactive Timeline Hop Buttons */}
        <div className="flex items-center justify-between border-t border-[#f4ede4] pt-3 text-center gap-1">
          {hops.map((h, idx) => {
            const isSelected = selectedHopIdx === idx;
            const isDimmed = filterMode === "critical" && !h.isCritical;
            return (
              <button
                key={h.num}
                type="button"
                onClick={() => setSelectedHopIdx(idx)}
                className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
                  isSelected
                    ? "bg-[#f5ede2] text-[#1c1917] scale-105 figma-shadow"
                    : isDimmed
                    ? "opacity-30 hover:opacity-70"
                    : "hover:bg-[#faf8f5] text-[#78716c]"
                }`}
              >
                <span className={`font-heading text-xs font-bold ${isSelected ? "text-[#e85d43]" : "text-[#1c1917]"}`}>
                  {h.num}
                </span>
                <span className="text-[10px] truncate max-w-[50px] font-medium">{h.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Card: Bedrock AI Telemetry (Exact Crowz Top Performers Style) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <div className="font-heading text-base font-bold text-[#1c1917]">
              AI Agent Telemetry
            </div>
            <span className="text-[10px] font-code px-2 py-0.5 rounded-full bg-[#e6f4f1] text-[#359381] font-bold">
              Bedrock Active
            </span>
          </div>
          <div className="text-[11px] text-[#78716c] mb-4">
            Amazon Bedrock Multi-Agent Pipeline · Click any agent to inspect
          </div>

          {/* 3 Clean Agent Rows - Now Clickable to View Telemetry */}
          <div className="space-y-3">
            {/* Agent 1: Mapper */}
            <button
              type="button"
              onClick={onOpenAuditLogs}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#faf8f5] transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e6f4f1] text-[#359381] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  M
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917] group-hover:text-[#359381] transition-colors">
                    Agent Mapper
                  </div>
                  <div className="text-[10px] text-[#78716c]">@identity-graph · 412ms</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#359381]">99% Confidence</span>
            </button>

            {/* Agent 2: Red-Team */}
            <button
              type="button"
              onClick={onOpenAuditLogs}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#faf8f5] transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fceee9] text-[#e85d43] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  R
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917] group-hover:text-[#e85d43] transition-colors">
                    Agent Red-Team
                  </div>
                  <div className="text-[10px] text-[#78716c]">@privilege-escalation · Verified</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#e85d43]">Critical Exploit</span>
            </button>

            {/* Agent 3: Remediator */}
            <button
              type="button"
              onClick={onOpenAuditLogs}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#faf8f5] transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fef5ea] text-[#e59b38] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  P
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917] group-hover:text-[#e59b38] transition-colors">
                    Agent Remediator
                  </div>
                  <div className="text-[10px] text-[#78716c]">@lockdown-playbook · 3 Steps</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#e59b38]">Ready to Deploy</span>
            </button>
          </div>
        </div>

        {/* Audit Logs CTA Button */}
        <div className="mt-4 pt-3 border-t border-[#f4ede4] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#78716c]">Claude 3.5 Haiku model</span>
          <button
            type="button"
            onClick={onOpenAuditLogs}
            className="font-heading font-bold text-[#e85d43] flex items-center gap-1 hover:underline active:scale-95 transition-all"
          >
            <span>Full Audit Logs</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
