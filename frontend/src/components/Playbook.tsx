"use client";

import { useState } from "react";
import { Check, ShieldCheck, Lock, X, ArrowUpRight, Terminal } from "lucide-react";
import { SimulationResult } from "../types";

interface PlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SimulationResult["playbook"];
}

export function Playbook({ isOpen, onClose, items }: PlaybookModalProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: false, 1: false });
  const [contained, setContained] = useState(false);

  if (!isOpen) return null;

  function toggle(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleQuarantine() {
    setContained(true);
    setChecked({ 0: true, 1: true, 2: true });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f4ede4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e6f4f1] text-[#359381] flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#1c1917]">
                Defensive Lockdown Playbook
              </h3>
              <p className="text-xs text-[#78716c]">
                Execute in order to halt the cascade immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4ede4] hover:bg-[#e8dfd5] flex items-center justify-center text-[#78716c] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Action Steps */}
        <div className="my-5 space-y-3">
          {items.map((item, index) => {
            const isDone = !!checked[index];
            return (
              <div
                key={index}
                onClick={() => toggle(index)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? "bg-[#e9f4f1] border-[#359381]/40 text-[#1c1917]"
                    : "bg-[#faf8f5] border-[#e8dfd5] text-[#1c1917] hover:border-[#d6c9bc]"
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isDone
                      ? "bg-[#359381] border-[#359381] text-white"
                      : "border-[#a8a29e] bg-white"
                  }`}
                >
                  {isDone && <Check size={12} className="stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold">
                      Step {index + 1}: {item.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-[#e85d43]">
                      {index === 0 ? "P0 Urgent" : "P1 High"}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716c] mt-0.5 leading-snug">
                    {item.description}
                  </p>
                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#359381] hover:underline"
                    >
                      <span>Open account console</span>
                      <ArrowUpRight size={11} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Containment CTA */}
        <button
          onClick={handleQuarantine}
          className={`w-full py-3.5 px-5 rounded-2xl font-heading text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md ${
            contained
              ? "bg-[#359381] shadow-[#359381]/30"
              : "bg-[#e85d43] hover:bg-[#d64e35] shadow-[#e85d43]/30"
          }`}
        >
          {contained ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={15} />
              <span>Perimeter Locked · All Sessions Revoked in 218ms</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock size={15} />
              <span>Execute One-Click Automated Lockdown</span>
            </span>
          )}
        </button>

        {/* CLI Script helper */}
        <div className="mt-4 pt-3 border-t border-[#f4ede4] flex items-center justify-between text-[11px] text-[#78716c]">
          <span className="font-code">dominoguard-cli revoke --all</span>
          <span className="font-semibold text-[#359381]">MITRE ATT&CK v14.1</span>
        </div>
      </div>
    </div>
  );
}
