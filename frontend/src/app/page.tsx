"use client";

import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { FootprintForm } from "../components/FootprintForm";
import { ThreatSelector } from "../components/ThreatSelector";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { Playbook } from "../components/Playbook";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const [services, setServices] = useState<ServiceId[]>(["email", "instagram", "whatsapp", "bank", "google", "amazon"]);
  const [scenario, setScenario] = useState<ThreatScenario>("email_compromise");
  const [email, setEmail] = useState("demo@example.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");

  const subtitle = useMemo(() => result ? result.headline : "See the cascade before the damage starts.", [result]);

  async function run() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/v1/simulate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, services, scenario }) });
      if (!res.ok) throw new Error("API request failed");
      setResult(await res.json());
    } catch {
      setError("Backend unavailable. Start the API on port 4000, then run again.");
    } finally { setLoading(false); }
  }

  return <main className="min-h-screen grid-bg">
    <Header />
    <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-10">
      <div className="mb-8 max-w-3xl"><div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">Privacy-first · no passwords · no live breach claims</div><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your accounts are a <span className="text-zinc-500">system.</span></h1><p className="mt-3 text-base leading-7 text-zinc-400">{subtitle}</p></div>
      <div className="grid gap-5 xl:grid-cols-[320px_320px_1fr]">
        <section className="glass rounded-2xl p-5"><FootprintForm selected={services} setSelected={setServices} /><div className="mt-5 border-t border-white/8 pt-5"><label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Demo identity</label><input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none" placeholder="demo@example.com" /></div></section>
        <section className="glass rounded-2xl p-5"><ThreatSelector scenario={scenario} setScenario={setScenario} onRun={run} loading={loading} />{error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">{error}</div>}{result && <div className="mt-5 border-t border-white/8 pt-5"><div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Agent trace</div><div className="mt-3 space-y-2">{result.agentTrace.map((a) => <div key={a.name} className="flex items-start justify-between gap-2 text-xs"><div><div className="text-zinc-300">{a.name}</div><div className="mt-0.5 text-zinc-600">{a.summary}</div></div><span className={a.status === "complete" ? "text-emerald-300" : "text-amber-300"}>{a.status}</span></div>)}</div></div>}</section>
        <section className="space-y-5">{result ? <><RiskGauge score={result.score} severity={result.severity} /><CascadeGraph nodes={result.cascade} /><Playbook items={result.playbook} /><div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-zinc-600">{result.privacyNote}</div></> : <div className="glass min-h-[520px] rounded-2xl p-7 flex items-end"><div><div className="text-sm font-medium text-zinc-200">Run a simulation</div><div className="mt-2 max-w-md text-sm leading-6 text-zinc-500">The results panel will animate the simulated dependency chain, explain every hop, and turn it into a recovery sequence.</div></div></div>}</section>
      </div>
    </div>
  </main>;
}
