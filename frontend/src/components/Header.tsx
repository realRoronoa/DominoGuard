"use client";

import { ShieldCheck, Sparkles, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/8 px-6 py-4 lg:px-10"
      style={{ background: "rgba(5,6,8,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Glow behind logo */}
          <div className="absolute inset-0 rounded-xl blur-md opacity-60" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white text-black shadow-lg">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div>
          <div className="font-bold tracking-tight">DominoGuard</div>
          <div className="text-[10px] text-zinc-500 tracking-wider">Consumer cyber cascade simulator</div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Bedrock badge */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300"
        >
          <Sparkles size={12} />
          <span>3-stage AI · Amazon Bedrock</span>
        </motion.div>

        {/* GitHub link */}
        <a
          href="https://github.com/realRoronoa/DominoGuard"
          target="_blank"
          rel="noreferrer"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Github size={16} />
        </a>
      </div>
    </header>
  );
}
