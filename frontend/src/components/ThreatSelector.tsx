import { ThreatScenario } from "../types";

export function ThreatSelector({ scenario, setScenario, onRun, loading }: { scenario: ThreatScenario; setScenario: (s: ThreatScenario) => void; onRun: () => void; loading: boolean }) {
  return <div className="space-y-4">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">02 · Trigger a scenario</div>
    <select value={scenario} onChange={(e) => setScenario(e.target.value as ThreatScenario)} className="w-full rounded-xl border border-white/10 bg-[#0d0f13] px-4 py-3 text-sm outline-none">
      <option value="email_compromise">Primary email password leaked</option>
      <option value="sim_swap">Phone / SIM trust compromised</option>
      <option value="oauth_hijack">Connected OAuth session hijacked</option>
    </select>
    <button onClick={onRun} disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black shadow-glow transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60">
      {loading ? "Simulating cascade…" : "Run AI red-team simulation"}
    </button>
    <p className="text-xs leading-5 text-zinc-500">Defensive simulation only. No passwords, tokens, or live account access.</p>
  </div>;
}
