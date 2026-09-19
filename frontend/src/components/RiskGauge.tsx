export function RiskGauge({ score, severity }: { score: number; severity: string }) {
  const angle = Math.max(0, Math.min(100, score)) * 1.8 - 90;
  return <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Blast radius</div><div className="mt-1 text-sm text-zinc-300">Synthetic exposure score</div></div><div className="rounded-full border border-red-400/20 bg-red-400/5 px-2.5 py-1 text-xs text-red-300">{severity}</div></div>
    <div className="mt-6 flex items-center gap-5">
      <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: `conic-gradient(#ef4444 ${score}%, rgba(255,255,255,.08) ${score}% 100%)` }}>
        <div className="absolute inset-[7px] grid place-items-center rounded-full bg-[#0d0f13]"><div className="text-center"><div className="text-3xl font-bold">{score}</div><div className="text-[10px] uppercase text-zinc-500">/ 100</div></div></div>
      </div>
      <div className="text-sm leading-6 text-zinc-400">The score reflects the number and sensitivity of connected nodes in this simulation. It is not a probability of compromise.</div>
    </div>
  </div>;
}
