"use client";

import { useState } from "react";
import { ArrowUpRight, Check, ShieldAlert, CheckCircle2, Lock, Terminal } from "lucide-react";
import { SimulationResult } from "../types";

export function Playbook({ items }: { items: SimulationResult["playbook"] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: false, 1: false });
  const [contained, setContained] = useState(false);
  const [showCli, setShowCli] = useState(false);

  function toggle(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleQuarantine() {
    setContained(true);
    setChecked({ 0: true, 1: true, 2: true });
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-5 sm:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-heading text-sm font-bold text-white tracking-wide">
            Lockdown Playbook
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Execute in order to halt the cascade immediately
          </p>
        </div>
        <span className="font-code text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          {items.length} Action Steps
        </span>
      </div>

      {/* Checklist Steps */}
      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => {
          const isDone = !!checked[index];
          return (
            <div
              key={index}
              onClick={() => toggle(index)}
              className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/[0.05] text-zinc-300"
                  : "border-white/[0.06] bg-white/[0.02] text-white hover:border-white/15"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                  isDone
                    ? "border-emerald-400 bg-emerald-400 text-black"
                    : "border-zinc-700 bg-transparent"
                }`}
              >
                {isDone && <Check size={11} className="stroke-[3]" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-heading text-xs font-bold leading-tight">
                    Step {index + 1}: {item.title}
                  </span>
                  <span className="font-code text-[9px] text-zinc-500 uppercase">
                    {index === 0 ? "P0 Urgent" : index === 1 ? "P1 High" : "P2 Moderate"}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 leading-snug mt-1">
                  {item.description}
                </div>

                {item.actionUrl && (
                  <a
                    href={item.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-1 font-code text-[10px] text-cyan-400 hover:underline"
                  >
                    <span>Open security settings</span>
                    <ArrowUpRight size={11} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* One-Click Containment CTA */}
      <button
        onClick={handleQuarantine}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] ${
          contained
            ? "bg-emerald-500 text-black shadow-emerald-500/30"
            : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-emerald-500/20 hover:brightness-110"
        }`}
      >
        {contained ? (
          <>
            <CheckCircle2 size={16} />
            <span>Perimeter Containment Active · All Sessions Revoked</span>
          </>
        ) : (
          <>
            <Lock size={14} />
            <span>One-Click Automated Containment</span>
          </>
        )}
      </button>

      {/* CLI Script Accordion */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-code text-zinc-500">
        <button
          onClick={() => setShowCli(!showCli)}
          className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
        >
          <Terminal size={12} />
          <span>{showCli ? "Hide CLI Command" : "View Quarantine CLI Script"}</span>
        </button>
        <span>MITRE ATT&CK v14.1</span>
      </div>

      {showCli && (
        <pre className="mt-2 p-2.5 rounded-lg bg-[#040508] border border-white/[0.06] font-code text-[10px] text-zinc-300 overflow-x-auto">
          dominoguard-cli revoke --identity "user@mesh.internal" --kill-sessions all --treasury-lockout true
        </pre>
      )}
    </div>
  );
}
