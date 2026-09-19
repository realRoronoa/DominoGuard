"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { FootprintForm } from "../components/FootprintForm";
import { ThreatSelector } from "../components/ThreatSelector";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { Playbook } from "../components/Playbook";
import { SimulationSkeleton } from "../components/SimulationSkeleton";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";
import { ShieldCheck, Zap, FileDown, Lock, Check } from "lucide-react";

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
  const [email, setEmail] = useState("demo@example.com");
  const [loading, setLoading] = useState(false);
  const [agentStage, setAgentStage] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  // Agent progress simulation during loading
  useEffect(() => {
    if (!loading) {
      setAgentStage(0);
      return;
    }
    setAgentStage(0);
    const t1 = setTimeout(() => setAgentStage(1), 1000);
    const t2 = setTimeout(() => setAgentStage(2), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  // Run simulation against backend
  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, services, scenario }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Simulation failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "Backend unavailable. Ensure port 4000 is online."
      );
    } finally {
      setLoading(false);
    }
  }

  // Pre-load default simulation on initial mount
  useEffect(() => {
    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* Sleek Top Navbar */}
      <Header onExportReport={() => setShowExportModal(true)} />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Hero Title (Clean, Simple, Not Overcrowded) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-zinc-400 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Cyber Cascade & Blast Radius Simulator</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              See the cascade before the damage starts.
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
              When one account falls, which dominoes drop next? DominoGuard maps systemic account
              dependencies and delivers a prioritized containment playbook powered by Amazon Bedrock.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-right">
              <div className="text-[10px] uppercase font-code text-zinc-500">Active Identity</div>
              <div className="text-xs font-semibold text-cyan-400 font-code truncate max-w-[200px]">
                {email}
              </div>
            </div>
          </div>
        </div>

        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError("")} className="underline hover:text-white">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Sleek Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Threat Setup Console (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Identity & Threat Scenario Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Target Account Identity
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@enterprise.com"
                  className="w-full rounded-xl border border-white/10 bg-[#07080d] px-3.5 py-2.5 text-xs font-code text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <span className="mt-1 block text-[10px] text-zinc-500">
                  Demo identity only · No real passwords or live accounts accessed
                </span>
              </div>

              <ThreatSelector
                scenario={scenario}
                setScenario={setScenario}
                onRun={run}
                loading={loading}
              />
            </div>

            {/* Connected Accounts Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e17]/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              <FootprintForm selected={services} setSelected={setServices} />
            </div>

            {/* Privacy Guarantee Note */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 text-xs text-zinc-500 leading-relaxed">
              <strong className="text-zinc-400 block mb-1">Privacy & Safety Guaranteed</strong>
              DominoGuard is a safe synthetic simulator built for hackathons and security awareness.
              Zero credentials, cookies, or real identity tokens are ever requested or stored.
            </div>
          </div>

          {/* Right Column: Simulation Results & Impact (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <SimulationSkeleton stage={agentStage} />
            ) : result ? (
              <div className="space-y-6">
                {/* 1. KPI Telemetry & AI Agent Summary */}
                <RiskGauge
                  score={result.score}
                  severity={result.severity}
                  agentTrace={result.agentTrace}
                />

                {/* 2. Visual Attack Path Cascade */}
                <CascadeGraph nodes={result.cascade} />

                {/* 3. Lockdown Playbook */}
                <Playbook items={result.playbook} />
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
                <ShieldCheck size={40} className="text-cyan-400 mb-3" />
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  Ready to Simulate
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mb-4">
                  Select your threat scenario and connected accounts, then click Simulate Cascade to
                  inspect the blast radius.
                </p>
                <button
                  onClick={run}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
                >
                  Run Simulation Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Export Report Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0e17] p-6 shadow-2xl font-code text-xs text-zinc-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white font-bold">
                <span className="flex items-center gap-2">
                  <FileDown size={16} className="text-cyan-400" />
                  Incident Audit Report
                </span>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-2 text-zinc-400 text-xs">
                <div>Target Identity: <span className="text-white font-semibold">{email}</span></div>
                <div>Risk Severity: <span className="text-red-400 font-semibold">{result?.score ?? 94}/100 ({result?.severity ?? "CRITICAL"})</span></div>
                <div>Compromised Surfaces: <span className="text-white">{result?.cascade.length ?? 6} accounts</span></div>
              </div>
              <pre className="mt-4 p-3 rounded-xl bg-[#040508] border border-white/[0.06] text-[11px] text-zinc-300 max-h-48 overflow-y-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    alert("Report copied to clipboard!");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                >
                  Copy JSON
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clean Minimal Footer */}
      <footer className="mt-16 border-t border-white/[0.06] py-6 text-center text-xs text-zinc-600">
        <div className="flex items-center justify-center gap-4">
          <span>DominoGuard</span>
          <span>•</span>
          <span>WeMakeDevs × AWS Hackathon 2026</span>
          <span>•</span>
          <a
            href="https://github.com/realRoronoa/DominoGuard"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
