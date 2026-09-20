"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Terminal, Shield, Cpu, Activity, Clock } from "lucide-react";
import { AgentMode, SimulationResult, ThreatScenario } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult | null;
  scenario: ThreatScenario;
}

const MODE_STYLE: Record<AgentMode, { dot: string; bg: string; fg: string; label: string }> = {
  bedrock: { dot: "#359381", bg: "#e6f4f1", fg: "#2d7a6a", label: "BEDROCK" },
  live: { dot: "#3ea6c8", bg: "#e8f1f6", fg: "#2b6f8a", label: "LIVE LOOKUP" },
  fallback: { dot: "#e59b38", bg: "#fef5ea", fg: "#b9762a", label: "FALLBACK" },
  disabled: { dot: "#a8a29e", bg: "#f4ede4", fg: "#78716c", label: "NO MODEL" },
  error: { dot: "#e85d43", bg: "#fceee9", fg: "#c94a31", label: "ERROR" },
};

/**
 * Reference mapping only. These are the techniques each scenario is *modelled
 * on* — DominoGuard does not observe your accounts and cannot detect activity.
 */
const TECHNIQUES: Record<ThreatScenario, { id: string; name: string; tactic: string }[]> = {
  email_compromise: [
    { id: "T1586.002", name: "Compromise Accounts: Email Accounts", tactic: "Resource Development" },
    { id: "T1098.005", name: "Account Manipulation: Device Registration", tactic: "Persistence" },
    { id: "T1114.002", name: "Email Collection: Remote Email Collection", tactic: "Collection" },
  ],
  sim_swap: [
    { id: "T1451", name: "SIM Card Swap", tactic: "Credential Access (Mobile)" },
    { id: "T1111", name: "Multi-Factor Authentication Interception", tactic: "Credential Access" },
    { id: "T1098.005", name: "Account Manipulation: Device Registration", tactic: "Persistence" },
  ],
  oauth_hijack: [
    { id: "T1539", name: "Steal Web Session Cookie", tactic: "Credential Access" },
    { id: "T1550.001", name: "Use Alternate Material: Application Access Token", tactic: "Lateral Movement" },
    { id: "T1528", name: "Steal Application Access Token", tactic: "Credential Access" },
  ],
};

export function AuditLogModal({ isOpen, onClose, result, scenario }: Props) {
  const [activeTab, setActiveTab] = useState<"trace" | "mitre" | "raw">("trace");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function copyRaw() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access needs a secure context; leave the button state alone
      // rather than claiming a copy that did not happen.
    }
  }

  const intel = result?.threatIntel;

  const tabs = [
    { id: "trace" as const, icon: <Activity size={13} />, label: "Agent Trace" },
    { id: "mitre" as const, icon: <Shield size={13} />, label: "Technique Reference" },
    { id: "raw" as const, icon: <Cpu size={13} />, label: "Raw JSON" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Audit log"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#f4ede4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fceee9] text-[#e85d43] flex items-center justify-center shrink-0">
              <Terminal size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1c1917]">Audit Log</h3>
              <p className="text-xs text-[#78716c]">
                Exactly what each stage did, and whether the model was involved
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#f4ede4] hover:bg-[#e8dfd5] flex items-center justify-center text-[#78716c] transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === t.id
                  ? "bg-[#1c1917] text-white"
                  : "bg-[#f4ede4] text-[#78716c] hover:text-[#1c1917]"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {!result && (
            <p className="text-xs text-[#78716c] text-center py-10">
              Run a simulation to populate the audit log.
            </p>
          )}

          {result && activeTab === "trace" && (
            <>
              {result.agentTrace.map((agent) => {
                const style = MODE_STYLE[agent.mode] ?? MODE_STYLE.error;
                const tokens = agent.inputTokens + agent.outputTokens;
                return (
                  <div
                    key={agent.name}
                    className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: style.dot }}
                        />
                        <span className="font-heading text-xs font-bold text-[#1c1917] truncate">
                          {agent.name}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-code px-2 py-0.5 rounded font-bold shrink-0"
                        style={{ background: style.bg, color: style.fg }}
                      >
                        {style.label} · {agent.latencyMs}ms
                      </span>
                    </div>

                    <p className="text-xs text-[#78716c] leading-relaxed">{agent.summary}</p>

                    {agent.note && (
                      <p className="text-[11px] text-[#a8a29e] italic leading-relaxed">{agent.note}</p>
                    )}

                    <div className="text-[10px] font-code text-[#a8a29e] bg-white p-2 rounded-xl border border-[#f0e7dd]">
                      {tokens > 0
                        ? `Input tokens: ${agent.inputTokens} | Output tokens: ${agent.outputTokens}`
                        : "No model tokens consumed by this stage."}
                    </div>
                  </div>
                );
              })}

              {intel?.checked && intel.pwned && intel.topBreaches.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-[#e8dfd5] space-y-2">
                  <div className="font-heading text-xs font-bold text-[#1c1917]">
                    Breaches named for {intel.email}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.topBreaches.map((b) => (
                      <span
                        key={b}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#faf8f5] border border-[#e8dfd5] text-[#1c1917]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#78716c]">
                    Historical disclosures from {intel.source}. This is not proof that the account is
                    compromised today.
                  </p>
                </div>
              )}
            </>
          )}

          {result && activeTab === "mitre" && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-[#78716c] leading-relaxed bg-[#faf8f5] border border-[#f0e7dd] rounded-xl p-3">
                Reference only. These are the MITRE ATT&amp;CK techniques this scenario is modelled on.
                DominoGuard does not monitor your accounts and has not detected any of them.
              </p>
              {TECHNIQUES[scenario].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-code text-xs font-bold text-[#78716c] px-2 py-1 rounded bg-white border border-[#e8dfd5] shrink-0">
                      {item.id}
                    </span>
                    <div className="min-w-0">
                      <div className="font-heading text-xs font-bold text-[#1c1917] truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#78716c]">{item.tactic}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result && activeTab === "raw" && (
            <div className="relative">
              <button
                type="button"
                onClick={copyRaw}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#292524] text-white text-[10px] font-code flex items-center gap-1 hover:bg-[#44403c] transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
              <pre className="p-4 rounded-2xl bg-[#1c1917] text-[#e7e5e4] text-[11px] font-code overflow-x-auto max-h-[300px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#f4ede4] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[#78716c]">
            <Clock size={12} className="shrink-0" />
            <span>
              {result
                ? `Total: ${(result.metrics.totalLatencyMs / 1000).toFixed(2)}s · ${
                    result.metrics.inputTokens + result.metrics.outputTokens
                  } tokens`
                : "No run yet"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f4ede4] hover:bg-[#e8dfd5] text-[#1c1917] font-heading text-xs font-bold transition-colors shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
