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

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const [services, setServices] = useState<ServiceId[]>(["email", "instagram", "whatsapp", "bank", "google", "amazon"]);
  const [scenario, setScenario] = useState<ThreatScenario>("email_compromise");
  const [email, setEmail] = useState("demo@example.com");
  const [loading, setLoading] = useState(false);
  const [agentStage, setAgentStage] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");

  const subtitle = useMemo(
    () => (result ? result.headline : "See the cascade before the damage starts."),
    [result]
  );

  // Simulate agent progress bar while loading
  useEffect(() => {
    if (!loading) { setAgentStage(0); return; }
    setAgentStage(0);
    const t1 = setTimeout(() => setAgentStage(1), 1200);
    const t2 = setTimeout(() => setAgentStage(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

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
      setResult(await res.json());
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "Backend unavailable. Start the API on port 4000, then run again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid-bg">
      <Header />

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-3xl"
        >
          <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
            Privacy-first · no passwords · no live breach claims · AWS-powered
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your accounts are a{" "}
            <span className="text-zinc-500">system.</span>
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-400">{subtitle}</p>
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-5 xl:grid-cols-[320px_320px_1fr]">

          {/* Panel 1 — Digital Footprint */}
          <motion.section
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <FootprintForm selected={services} setSelected={setServices} />
            <div className="mt-5 border-t border-white/8 pt-5">
              <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Demo identity</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors duration-200"
                placeholder="demo@example.com"
              />
              <p className="mt-2 text-[10px] text-zinc-600">Used as demo identity only. Not stored or verified.</p>
            </div>
          </motion.section>

          {/* Panel 2 — Threat + Trace */}
          <motion.section
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="glass rounded-2xl p-5"
          >
            <ThreatSelector scenario={scenario} setScenario={setScenario} onRun={run} loading={loading} />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Agent trace */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 border-t border-white/8 pt-5"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Agent trace</div>
                <div className="mt-3 space-y-2.5">
                  {result.agentTrace.map((a, i) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: a.status === "complete" ? "#22c55e" : "#eab308" }}
                        />
                        <div>
                          <div className="text-zinc-300 font-medium">{a.name}</div>
                          <div className="mt-0.5 text-zinc-600">{a.summary}</div>
                        </div>
                      </div>
                      <span
                        className="shrink-0 text-[10px] font-mono"
                        style={{ color: a.status === "complete" ? "#4ade80" : "#fbbf24" }}
                      >
                        {a.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Panel 3 — Results */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-5"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SimulationSkeleton stage={agentStage} />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <RiskGauge score={result.score} severity={result.severity} />
                  <CascadeGraph nodes={result.cascade} />
                  <Playbook items={result.playbook} />
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-zinc-600">
                    {result.privacyNote}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass min-h-[520px] rounded-2xl p-7 flex flex-col items-start justify-end"
                  style={{
                    backgroundImage: "radial-gradient(ellipse at 60% 40%, rgba(239,68,68,0.03) 0%, transparent 70%)",
                  }}
                >
                  <div className="space-y-4 max-w-md">
                    {/* Decorative domino icons */}
                    <div className="flex gap-2 opacity-30">
                      {["✉", "📸", "💬", "🏦", "☁", "🛒"].map((icon, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="text-2xl"
                        >
                          {icon}
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-zinc-200">Run a simulation</div>
                    <div className="text-sm leading-6 text-zinc-500">
                      Select your accounts, pick a threat scenario, and click{" "}
                      <span className="text-zinc-300 font-medium">Run AI Red-Team Simulation</span>. The results panel will
                      animate the simulated dependency chain, explain every hop, and turn it into a recovery sequence.
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Blast radius score", "Animated cascade", "AI playbook"].map((tag) => (
                        <div key={tag} className="text-[10px] rounded-full border border-white/8 px-2.5 py-1 text-zinc-600">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-700">
          <div>WeMakeDevs × AWS · First Commit Hackathon 2026 · DominoGuard</div>
          <div className="flex gap-4">
            <span>MIT License</span>
            <a href="https://github.com/realRoronoa/DominoGuard" target="_blank" rel="noreferrer" className="hover:text-zinc-500 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </main>
  );
}
