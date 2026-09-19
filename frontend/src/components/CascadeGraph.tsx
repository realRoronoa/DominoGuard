"use client";

import { ChevronDown, ArrowUpRight } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  nodes: SimulationResult["cascade"];
  agentTrace?: SimulationResult["agentTrace"];
}

export function CascadeGraph({ nodes, agentTrace }: Props) {
  // 6 timeline points for the Activity wave
  const hops = [
    { num: "01", label: "Email", status: "Root", value: 95 },
    { num: "02", label: "Google", status: "SSO", value: 78 },
    { num: "03", label: "AWS", status: "Admin", value: 98 },
    { num: "04", label: "Bank", status: "ACH", value: 88 },
    { num: "05", label: "WhatsApp", status: "2FA", value: 65 },
    { num: "06", label: "Instagram", status: "Social", value: 45 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left Card: Cascade Activity Path (Exact Crowz Activity Card Style) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-heading text-base font-bold text-[#1c1917]">
              Cascade Activity
            </div>
            <div className="text-[11px] text-[#78716c]">
              Real-time lateral pivot propagation
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#78716c] bg-[#f5ede2] px-2.5 py-1 rounded-xl border border-[#e8dfd5]">
            <span>Hop 01 - 06</span>
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Smooth SVG Spline Wave Chart */}
        <div className="relative my-4 h-36 w-full flex items-center justify-center">
          <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
            {/* Grid Guideline */}
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

            {/* Glowing Accent Point on Peak (AWS Admin Hop) */}
            <circle cx="250" cy="25" r="5" fill="#e59b38" />
            <circle cx="250" cy="25" r="9" fill="#e59b38" opacity="0.25" />
          </svg>

          {/* Central Tooltip Badge (Exact Crowz Style) */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl border border-[#e8dfd5] shadow-lg text-center pointer-events-none">
            <div className="font-heading text-xs font-extrabold text-[#1c1917]">
              Hop 03: AWS IAM
            </div>
            <div className="text-[9px] text-[#e85d43] font-semibold">
              PrivEsc Verified
            </div>
          </div>
        </div>

        {/* Bottom Timeline Hops */}
        <div className="flex items-center justify-between border-t border-[#f4ede4] pt-3 text-center">
          {hops.map((h) => (
            <div key={h.num} className="flex flex-col">
              <span className="font-heading text-xs font-bold text-[#1c1917]">{h.num}</span>
              <span className="text-[10px] text-[#78716c]">{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card: Bedrock AI Telemetry (Exact Crowz Top Performers Style) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div>
          <div className="font-heading text-base font-bold text-[#1c1917] mb-0.5">
            AI Agent Telemetry
          </div>
          <div className="text-[11px] text-[#78716c] mb-4">
            Amazon Bedrock Multi-Agent Pipeline
          </div>

          {/* 3 Clean Agent Rows */}
          <div className="space-y-3.5">
            {/* Agent 1: Mapper */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e6f4f1] text-[#359381] flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917]">
                    Agent Mapper
                  </div>
                  <div className="text-[10px] text-[#78716c]">@identity-graph</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#359381]">99%</span>
            </div>

            {/* Agent 2: Red-Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fceee9] text-[#e85d43] flex items-center justify-center font-bold text-xs">
                  R
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917]">
                    Agent Red-Team
                  </div>
                  <div className="text-[10px] text-[#78716c]">@privilege-escalation</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#e85d43]">Critical</span>
            </div>

            {/* Agent 3: Remediator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fef5ea] text-[#e59b38] flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <div>
                  <div className="font-heading text-xs font-bold text-[#1c1917]">
                    Agent Remediator
                  </div>
                  <div className="text-[10px] text-[#78716c]">@lockdown-playbook</div>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-[#e59b38]">Ready</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f4ede4] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#78716c]">Claude 3.5 Haiku model</span>
          <span className="font-heading font-bold text-[#e85d43] flex items-center gap-1 cursor-pointer hover:underline">
            Full Audit Logs <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
