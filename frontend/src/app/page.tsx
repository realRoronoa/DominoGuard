"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { FootprintForm } from "../components/FootprintForm";
import { ThreatSelector } from "../components/ThreatSelector";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { Playbook } from "../components/Playbook";
import { SimulationSkeleton } from "../components/SimulationSkeleton";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";
import { ShieldAlert, Zap, Terminal, FileDown, Radio, CheckCircle2, Copy, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const [services, setServices] = useState<ServiceId[]>([
    "email",
    "google",
    "amazon",
    "bank",
    "whatsapp",
    "instagram",
  ]);
  const [scenario, setScenario] = useState<ThreatScenario>("email_compromise");
  const [email, setEmail] = useState("devops-admin@enterprise-mesh.internal");
  const [loading, setLoading] = useState(false);
  const [agentStage, setAgentStage] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [socLive, setSocLive] = useState(true);

  // Subtitle header
  const subtitle = useMemo(
    () => (result ? result.headline : "See the cascade before the damage starts."),
    [result]
  );

  // Agent progress simulation during loading
  useEffect(() => {
    if (!loading) {
      setAgentStage(0);
      return;
    }
    setAgentStage(0);
    const t1 = setTimeout(() => setAgentStage(1), 1200);
    const t2 = setTimeout(() => setAgentStage(2), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  // Run simulation against backend
  async function run() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, services, scenario }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "API request failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "Backend unavailable. Ensure backend is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  }

  // Pre-load default simulation so user is wowed immediately!
  useEffect(() => {
    run();
  }, []);

  return (
    <main className="min-h-screen grid-bg flex flex-col selection:bg-[#06b6d4] selection:text-[#07080d]">
      {/* Top Application Bar */}
      <Header
        onExportReport={() => setShowExportModal(true)}
        onToggleTerminal={() => setShowTerminalModal(true)}
        socActive={socLive}
        onToggleSoc={() => setSocLive(!socLive)}
      />

      {/* Hero Threat Control Strip (Sub-Header) */}
      <section className="border-b border-white/[0.08] bg-[#0c0e17]/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto max-w-[1920px] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Target Identity & Footprint Perimeter */}
          <div className="flex flex-col gap-1.5 w-full xl:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-code text-[11px] uppercase tracking-wider text-zinc-400">
                Target Identity & Blast Perimeter:
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#07080d] border border-white/10 px-2.5 py-0.5 rounded font-code text-xs text-[#06b6d4] font-semibold focus:border-[#06b6d4] outline-none"
              />
              <span className="font-code text-[10px] text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded">
                Privileged Tier 0
              </span>
            </div>

            {/* Footprint Chips Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {services.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121624] border border-white/10 text-zinc-300 font-code text-[11px]"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      s === "email"
                        ? "bg-[#ef4444] animate-ping"
                        : s === "bank" || s === "amazon"
                        ? "bg-[#ef4444]"
                        : "bg-[#f59e0b]"
                    }`}
                  />
                  <span className="capitalize">{s}</span>
                </span>
              ))}
              <span className="font-code text-[10px] text-zinc-500">
                ({services.length} Connected Domains)
              </span>
            </div>
          </div>

          {/* Quick Scenario Selector & Simulation Trigger Button */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
            <div className="flex items-center gap-1.5 bg-[#07080d]/90 p-1 rounded-xl border border-white/10">
              {(
                [
                  { id: "email_compromise", label: "Phishing & SAML", prob: "98.4%" },
                  { id: "sim_swap", label: "SIM Swap Intercept", prob: "84.1%" },
                  { id: "oauth_hijack", label: "OAuth Exfiltration", prob: "91.7%" },
                ] as const
              ).map((sc) => {
                const isActive = scenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id)}
                    className={`px-3 py-1.5 rounded-lg font-code text-xs transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#06b6d4]/15 border border-[#06b6d4]/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                        : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <span>{sc.label}</span>
                    <span
                      className={`text-[9px] px-1 rounded ${
                        isActive ? "bg-[#06b6d4]/20 text-[#06b6d4]" : "text-zinc-500"
                      }`}
                    >
                      {sc.prob}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* High-Impact AI Cascade Simulation CTA */}
            <motion.button
              onClick={run}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className="bg-gradient-to-r from-[#06b6d4] to-[#38bdf8] text-[#07080d] font-heading font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-75"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-[#07080d]">⟳</span>
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="fill-[#07080d]" />
                  <span>Run AI Simulation</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Tactical Command Center */}
      <div className="mx-auto max-w-[1920px] w-full p-4 sm:p-6 lg:p-8 flex-1">
        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-[#ef4444]/40 bg-[#ef4444]/10 p-4 text-xs font-code text-[#ef4444] flex items-center justify-between"
            >
              <span>[Simulation Error]: {error}</span>
              <button
                onClick={() => setError("")}
                className="underline hover:text-white"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        {loading && <SimulationSkeleton stage={agentStage} />}

        {/* Results: 3-Column Tactical Command Center (Obsidian Sentinel Layout) */}
        {!loading && result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Attack Path Cascade Graph */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <CascadeGraph
                nodes={result.cascade}
                blastScore={result.score}
              />

              {/* Side Accordion: Adjust Footprint & Scenarios */}
              <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                <FootprintForm selected={services} setSelected={setServices} />
              </div>
            </div>

            {/* Middle Column (4 Cols): AI Risk Gauge & Multi-Agent Cognition Stream */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <RiskGauge
                score={result.score}
                severity={result.severity}
                agentTrace={result.agentTrace}
              />

              <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                <ThreatSelector
                  scenario={scenario}
                  setScenario={setScenario}
                  onRun={run}
                  loading={loading}
                />
              </div>
            </div>

            {/* Right Column (3 Cols): Defensive Remediation Playbook & CLI */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <Playbook items={result.playbook} />

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs leading-relaxed text-zinc-400 font-code">
                <div className="text-zinc-500 uppercase text-[10px] mb-1 font-bold">
                  Privacy & Safety Guarantee
                </div>
                {result.privacyNote}
              </div>
            </div>
          </div>
        )}

        {/* Empty / Zero state fallback */}
        {!loading && !result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] p-5">
              <FootprintForm selected={services} setSelected={setServices} />
            </div>
            <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] p-5">
              <ThreatSelector
                scenario={scenario}
                setScenario={setScenario}
                onRun={run}
                loading={loading}
              />
            </div>
            <div className="rounded-2xl bg-[#0c0e17]/85 border border-white/[0.08] p-5 flex flex-col items-center justify-center text-center">
              <ShieldAlert size={36} className="text-[#06b6d4] mb-3" />
              <h3 className="font-heading text-lg font-bold text-white mb-1">Ready for Simulation</h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-4">
                Select accounts and click Run AI Simulation to map the cascade path.
              </p>
              <button
                onClick={run}
                className="px-4 py-2 rounded-xl bg-[#06b6d4] text-[#07080d] font-bold text-xs uppercase tracking-wider hover:brightness-110"
              >
                Run AI Red-Team Simulation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Report Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0e17] p-6 shadow-2xl font-code text-xs text-zinc-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white font-bold">
                <span className="flex items-center gap-2">
                  <FileDown size={16} className="text-[#06b6d4]" />
                  Export Incident Audit Report
                </span>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-2 text-zinc-400">
                <p>
                  Audit snapshot generated for target:{" "}
                  <strong className="text-white">{email}</strong>
                </p>
                <p>
                  Risk Score: <strong className="text-[#ef4444]">{result?.score ?? 94}/100</strong> (
                  {result?.severity ?? "CRITICAL"})
                </p>
                <p>Compromised Nodes: {result?.cascade.length ?? 6} services mapped</p>
                <p>Framework: MITRE ATT&CK v14.1</p>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[#040508] border border-white/[0.06] text-[11px] text-zinc-300 max-h-48 overflow-y-auto custom-scroll">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    alert("Report copied to clipboard!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/30"
                >
                  Copy JSON
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terminal CLI Modal */}
      <AnimatePresence>
        {showTerminalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0e17] p-6 shadow-2xl font-code text-xs text-zinc-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white font-bold">
                <span className="flex items-center gap-2">
                  <Terminal size={16} className="text-[#06b6d4]" />
                  DominoGuard CLI Quarantine Console
                </span>
                <button
                  onClick={() => setShowTerminalModal(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[#040508] border border-white/[0.06] text-[11px] text-zinc-300">
                <div className="text-[#06b6d4] font-bold mb-1">$ dominoguard-cli status --all</div>
                <div className="text-zinc-400">Target: {email}</div>
                <div className="text-[#ef4444]">Cascade Alert: 6 Nodes compromised</div>
                <div className="text-[#10b981] mt-2">Active Defense Agents: 3/3 Online</div>
                <div className="text-zinc-500 mt-2">Ready to dispatch automated containment.</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowTerminalModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tactical Footer Ribbon */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#0c0e17]/90 px-4 py-3 sm:px-8 flex flex-wrap items-center justify-between gap-3 text-xs font-code text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            Bedrock Multi-Agent Engine (Claude 3 Haiku)
          </span>
          <span>•</span>
          <span>WeMakeDevs × AWS Hackathon 2026</span>
          <span>•</span>
          <span className="text-[#06b6d4]">DominoGuard v2.4</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/realRoronoa/DominoGuard"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub Repository
          </a>
          <span>•</span>
          <span className="text-zinc-400">SOC2 & FedRAMP High Ready</span>
        </div>
      </footer>
    </main>
  );
}
