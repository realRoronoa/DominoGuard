import { ShieldCheck, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><ShieldCheck size={20} /></div>
        <div><div className="font-semibold tracking-tight">DominoGuard</div><div className="text-xs text-zinc-500">Consumer cyber cascade simulator</div></div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300"><Sparkles size={14} /> 3-stage AI pipeline</div>
    </header>
  );
}
