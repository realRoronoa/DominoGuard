"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, ShieldCheck, Terminal, Copy, Lock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { SimulationResult } from "../types";

const PLAYBOOK_PRIORITIES = [
  {
    tier: "1. CRITICAL",
    priority: "P0 Priority",
    color: "#ef4444",
    border: "rgba(239, 68, 68, 0.4)",
    bg: "rgba(239, 68, 68, 0.08)",
  },
  {
    tier: "2. HIGH",
    priority: "P1 Priority",
    color: "#06b6d4",
    border: "rgba(6, 182, 212, 0.4)",
    bg: "rgba(6, 182, 212, 0.08)",
  },
  {
    tier: "3. HIGH",
    priority: "P1 Priority",
    color: "#f59e0b",
    border: "rgba(245, 158, 11, 0.4)",
    bg: "rgba(245, 158, 11, 0.08)",
  },
  {
    tier: "4. MEDIUM",
    priority: "P2 Priority",
    color: "#10b981",
    border: "rgba(16, 185, 129, 0.4)",
    bg: "rgba(16, 185, 129, 0.08)",
  },
];

const CLI_SCRIPT = `# Execute DominoGuard Containment Pipeline
dominoguard-cli revoke \\
  --identity "devops-admin@mesh.internal" \\
  --kill-sessions all \\
  --aws-role "AdminSecOpsMaster" \\
  --enforce-fido2 \\
  --treasury-lockout true

[*] [OK] 14 OAuth tokens invalidated in 218ms
[*] [OK] Perimeter isolation active.`;

export function Playbook({ items }: { items: SimulationResult["playbook"] }) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });
  const [contained, setContained] = useState(false);
  const [copied, setCopied] = useState(false);

  function toggleCheck(idx: number) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleContainment() {
    setContained(true);
    setCheckedItems({ 0: true, 1: true, 2: true, 3: true });
    setTimeout(() => {
      // Keep contained state active
    }, 4000);
  }

  function copyScript() {
    navigator.clipboard.writeText(CLI_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Remediation Playbook Card */}
      <div className="relative flex flex-col rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-2xl overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-[2px] w-full absolute top-0 left-0 bg-[#10b981]" />

        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#10b981]" />
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">
              Defensive Containment Playbook
            </h3>
          </div>
          <span className="font-code text-[10px] text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-0.5 rounded font-semibold">
            AUTOMATED TRIAGE
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
          Prioritized sequence to arrest lateral blast radius and isolate breached tokens:
        </p>

        {/* Ordered Action Checklist */}
        <div className="flex flex-col gap-2.5 my-3">
          {items.map((item, index) => {
            const priority = PLAYBOOK_PRIORITIES[index] ?? PLAYBOOK_PRIORITIES[1];
            const isChecked = !!checkedItems[index];

            return (
              <label
                key={index}
                onClick={() => toggleCheck(index)}
                className="group relative flex items-start gap-3 rounded-xl border p-2.5 sm:p-3 cursor-pointer transition-all duration-150 hover:scale-[1.01]"
                style={{
                  background: isChecked ? priority.bg : "rgba(12, 14, 23, 0.6)",
                  borderColor: isChecked ? priority.border : "rgba(255, 255, 255, 0.06)",
                }}
              >
                {/* Custom Checkbox */}
                <div
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all"
                  style={{
                    background: isChecked ? priority.color : "rgba(0, 0, 0, 0.5)",
                    borderColor: isChecked ? priority.color : "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {isChecked && <Check size={12} className="text-[#07080d] stroke-[3]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="font-code text-[9px] font-bold px-1.5 py-0.2 rounded border"
                      style={{
                        color: priority.color,
                        borderColor: priority.border,
                        background: `${priority.color}15`,
                      }}
                    >
                      {priority.tier}
                    </span>
                    <span className="font-code text-[9px] text-zinc-500">{priority.priority}</span>
                  </div>

                  <span
                    className={`font-heading text-xs font-semibold block mt-1 transition-colors ${
                      isChecked ? "text-white line-through opacity-80" : "text-white"
                    }`}
                  >
                    {item.title}
                  </span>

                  <span className="text-[11px] leading-tight text-zinc-400 block mt-0.5">
                    {item.description}
                  </span>

                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 font-code text-[10px] text-[#06b6d4] hover:text-white transition-colors"
                    >
                      <span>Open console settings</span>
                      <ArrowUpRight size={11} />
                    </a>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* One-Click Automated Containment CTA */}
        <button
          onClick={handleContainment}
          className={`w-full py-3 px-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
            contained
              ? "bg-[#10b981] text-[#07080d] shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              : "bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:brightness-110 text-[#07080d] shadow-[0_0_22px_rgba(16,185,129,0.35)]"
          }`}
        >
          {contained ? (
            <>
              <CheckCircle2 size={16} className="text-[#07080d]" />
              <span>Perimeter Containment Active (14 Tokens Revoked)</span>
            </>
          ) : (
            <>
              <Lock size={15} className="text-[#07080d]" />
              <span>One-Click Automated Containment</span>
            </>
          )}
        </button>

        {contained && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 font-code text-[10px] text-[#10b981] text-center"
          >
            ✓ Cryptographic perimeter lock enforced. Active sessions terminated across Google, AWS IAM & Bank rails.
          </motion.div>
        )}
      </div>

      {/* CLI Quarantine Terminal Box */}
      <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            </div>
            <span className="font-code text-[11px] text-zinc-400">quarantine-isolate.sh</span>
          </div>
          <button
            onClick={copyScript}
            className="flex items-center gap-1 font-code text-[10px] text-[#06b6d4] hover:text-white transition-colors"
          >
            <Copy size={12} />
            <span>{copied ? "Copied!" : "Copy CLI"}</span>
          </button>
        </div>

        {/* Code Block */}
        <pre className="mt-2.5 p-3 rounded-lg bg-[#040508] border border-white/[0.06] font-code text-[11px] text-zinc-300 overflow-x-auto custom-scroll leading-relaxed">
          <span className="text-zinc-500"># Execute DominoGuard Containment Pipeline</span>{"\n"}
          <span className="text-[#06b6d4]">dominoguard-cli</span> revoke \{"\n"}
          {"  "}--identity <span className="text-[#f59e0b]">"devops-admin@mesh.internal"</span> \{"\n"}
          {"  "}--kill-sessions <span className="text-[#10b981]">all</span> \{"\n"}
          {"  "}--aws-role <span className="text-[#ef4444]">"AdminSecOpsMaster"</span> \{"\n"}
          {"  "}--enforce-fido2 \{"\n"}
          {"  "}--treasury-lockout <span className="text-[#06b6d4]">true</span>{"\n\n"}
          <span className="text-[#10b981]">[*] [OK] 14 OAuth tokens invalidated in 218ms</span>{"\n"}
          <span className="text-[#10b981]">[*] [OK] Perimeter isolation active.</span>
        </pre>
      </div>

      {/* MITRE ATT&CK v14.1 Status Card */}
      <div className="p-3 rounded-xl bg-[#07080d]/80 border border-white/[0.08] flex items-center justify-between text-xs font-code">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#06b6d4]" />
          <span className="text-zinc-400">MITRE Framework:</span>
          <span className="text-white font-medium">ATT&CK v14.1</span>
        </div>
        <span className="text-[#10b981] font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          Synced
        </span>
      </div>
    </div>
  );
}
