import { motion } from "framer-motion";
import { ArrowDown, ShieldAlert } from "lucide-react";
import { SimulationResult } from "../types";

export function CascadeGraph({ nodes }: { nodes: SimulationResult["cascade"] }) {
  return <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Attack cascade</div><div className="mt-1 text-sm text-zinc-300">What could fall next</div></div><ShieldAlert size={18} className="text-red-300" /></div>
    <div className="mt-5 space-y-3">
      {nodes.map((node, index) => <div key={node.id}>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.12 }} className={`rounded-xl border p-4 ${node.status === "root" ? "border-red-400/30 bg-red-400/5" : "border-white/10 bg-white/[0.025]"}`}>
          <div className="flex items-start justify-between gap-4"><div><div className="text-sm font-medium">{node.label}</div><div className="mt-1 text-xs leading-5 text-zinc-500">{node.reason}</div></div><div className="text-[10px] uppercase tracking-widest text-zinc-600">{node.status}</div></div>
        </motion.div>
        {index < nodes.length - 1 && <div className="grid place-items-center py-1 text-zinc-700"><ArrowDown size={15} /></div>}
      </div>)}
    </div>
  </div>;
}
