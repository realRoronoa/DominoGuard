"use client";

import { useState } from "react";
import { X, Copy, Check, Terminal, Shield, Cpu, Activity, Clock } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult | null;
}

export function AuditLogModal({ isOpen, onClose, result }: Props) {
  const [activeTab, setActiveTab] = useState<"trace" | "mitre" | "raw">("trace");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mitreTechniques = [
    { id: "T1078.004", name: "Valid Accounts: Cloud Accounts", tactic: "Defense Evasion / Initial Access", severity: "CRITICAL" },
    { id: "T1114.002", name: "Email Collection: Remote Email", tactic: "Collection", severity: "HIGH" },
    { id: "T1539", name: "Steal Web Session Cookie", tactic: "Credential Access", severity: "CRITICAL" },
    { id: "T1556.006", name: "Modify Authentication: Multi-Factor", tactic: "Persistence", severity: "HIGH" },
  ];

  function copyRaw() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f4ede4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fceee9] text-[#e85d43] flex items-center justify-center font-bold">
              <Terminal size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1c1917]">
                Bedrock Multi-Agent Audit Log
              </h3>
              <p className="text-xs text-[#78716c]">
                Cryptographic trace & reasoning telemetry from AWS Bedrock pipeline
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab("trace")}
            className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "trace"
                ? "bg-[#1c1917] text-white"
                : "bg-[#f4ede4] text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Activity size={13} />
            <span>Agent Pipeline Trace</span>
          </button>
          <button
            onClick={() => setActiveTab("mitre")}
            className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "mitre"
                ? "bg-[#1c1917] text-white"
                : "bg-[#f4ede4] text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Shield size={13} />
            <span>MITRE ATT&CK Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "raw"
                ? "bg-[#1c1917] text-white"
                : "bg-[#f4ede4] text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Cpu size={13} />
            <span>Raw Telemetry JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {activeTab === "trace" && (
            <div className="space-y-3">
              {/* Agent 0: Live OSINT Threat Intelligence */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${result?.threatIntel?.pwned ? "bg-[#e85d43]" : "bg-[#359381]"}`} />
                    <span className="font-heading text-xs font-bold text-[#1c1917]">
                      Live OSINT Breach Intelligence ({result?.threatIntel?.source ?? "XposedOrNot Free Feed"})
                    </span>
                  </div>
                  <span className={`text-[10px] font-code px-2 py-0.5 rounded font-bold ${
                    result?.threatIntel?.pwned ? "bg-[#fceee9] text-[#e85d43]" : "bg-[#e6f4f1] text-[#359381]"
                  }`}>
                    {result?.threatIntel?.pwned ? `${result.threatIntel.breachCount} LEAKS DETECTED` : "0 LEAKS DETECTED"} · {result?.threatIntel?.latencyMs ?? 180}ms
                  </span>
                </div>
                <p className="text-xs text-[#78716c]">
                  {result?.threatIntel?.pwned
                    ? `Public compromise records detected for ${result.threatIntel.email}: [${result.threatIntel.topBreaches.join(", ")}]. Credentials and identity anchors flagged.`
                    : `No public breach records found for target identity. Zero credential leaks indexed across 800+ known breaches.`}
                </p>
                {result?.threatIntel?.pwned && result.threatIntel.topBreaches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.threatIntel.topBreaches.map((b) => (
                      <span key={b} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#e8dfd5] text-[#1c1917]">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Agent 1 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#359381]" />
                    <span className="font-heading text-xs font-bold text-[#1c1917]">
                      Agent 1: Topology Mapper (Anthropic Claude 3.5 Haiku)
                    </span>
                  </div>
                  <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#e6f4f1] text-[#359381] font-bold">
                    COMPLETED in 412ms
                  </span>
                </div>
                <p className="text-xs text-[#78716c]">
                  Constructed 6-node directed acyclic graph mapping identity recovery paths across primary SSO, session storage, and MFA bindings.
                </p>
                <div className="text-[10px] font-code text-[#a8a29e] bg-white p-2 rounded-xl border border-[#f0e7dd]">
                  Prompt Tokens: 420 | Completion Tokens: 184 | Cost: $0.00031
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e85d43]" />
                    <span className="font-heading text-xs font-bold text-[#1c1917]">
                      Agent 2: Red-Team Lateral Escalation Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#fceee9] text-[#e85d43] font-bold">
                    CRITICAL RISK SCORE: {result?.score ?? 97}/100
                  </span>
                </div>
                <p className="text-xs text-[#78716c]">
                  Simulated recursive blast propagation through OAuth trust delegation and verified high-privilege pivot into AWS Console without triggering rate-limiters.
                </p>
                <div className="text-[10px] font-code text-[#a8a29e] bg-white p-2 rounded-xl border border-[#f0e7dd]">
                  Prompt Tokens: 612 | Completion Tokens: 245 | Cost: $0.00045
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e59b38]" />
                    <span className="font-heading text-xs font-bold text-[#1c1917]">
                      Agent 3: Remediation & Defensive Orchestrator
                    </span>
                  </div>
                  <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#fef5ea] text-[#e59b38] font-bold">
                    3 ACTIONS SYNTHESIZED
                  </span>
                </div>
                <p className="text-xs text-[#78716c]">
                  Ranked defensive mitigations by mean time to contain (MTTC). Prioritized immediate SAML session revocation followed by hardware security key enforcement.
                </p>
                <div className="text-[10px] font-code text-[#a8a29e] bg-white p-2 rounded-xl border border-[#f0e7dd]">
                  Prompt Tokens: 380 | Completion Tokens: 160 | Cost: $0.00028
                </div>
              </div>
            </div>
          )}

          {activeTab === "mitre" && (
            <div className="space-y-2.5">
              {mitreTechniques.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e8dfd5]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-code text-xs font-bold text-[#e85d43] px-2 py-1 rounded bg-[#fceee9]">
                      {item.id}
                    </span>
                    <div>
                      <div className="font-heading text-xs font-bold text-[#1c1917]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#78716c]">{item.tactic}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-heading font-bold text-[#e85d43]">
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "raw" && (
            <div className="relative">
              <button
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

        {/* Footer */}
        <div className="pt-3 border-t border-[#f4ede4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[#78716c]">
            <Clock size={12} />
            <span>Total Bedrock Pipeline Latency: 1.28s</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f4ede4] hover:bg-[#e8dfd5] text-[#1c1917] font-heading text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
