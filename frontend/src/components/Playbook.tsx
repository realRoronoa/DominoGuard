import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SimulationResult } from "../types";

export function Playbook({ items }: { items: SimulationResult["playbook"] }) {
  return <div className="glass rounded-2xl p-5">
    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">03 · Lockdown playbook</div>
    <div className="mt-1 text-sm text-zinc-300">Three actions, in order</div>
    <div className="mt-5 space-y-3">
      {items.map((item, index) => <div key={index} className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
        <div className="flex gap-3"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-black">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div className="text-sm font-medium">{item.title}</div>{index === 0 && <CheckCircle2 size={15} className="text-emerald-300" />}</div><div className="mt-1 text-xs leading-5 text-zinc-500">{item.description}</div>{item.actionUrl && <a href={item.actionUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white">Open security settings <ArrowUpRight size={13} /></a>}</div></div>
      </div>)}
    </div>
  </div>;
}
