"use client";

import { motion } from "framer-motion";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SimulationSkeleton({ stage }: { stage: number }) {
  const stages = ["Mapper", "Red-Team Simulator", "Remediator"];

  return (
    <div className="space-y-5">
      {/* Agent pipeline progress */}
      <div className="glass rounded-2xl p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">AI pipeline running</div>
        <div className="space-y-3">
          {stages.map((name, i) => {
            const isDone = i < stage;
            const isActive = i === stage;
            return (
              <div key={name} className="flex items-center gap-3">
                {/* Status dot */}
                <div className="relative shrink-0">
                  {isActive ? (
                    <motion.div
                      className="h-3 w-3 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: isDone ? "#22c55e" : "rgba(255,255,255,0.08)" }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className="text-xs font-medium transition-colors duration-300"
                    style={{ color: isDone ? "#4ade80" : isActive ? "#f4f4f5" : "#52525b" }}
                  >
                    {name}
                  </div>
                </div>
                <div className="text-[10px] font-mono"
                  style={{ color: isDone ? "#4ade80" : isActive ? "#eab308" : "#3f3f46" }}>
                  {isDone ? "complete" : isActive ? "running…" : "waiting"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk gauge skeleton */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24 rounded" />
            <SkeletonBlock className="h-3 w-36 rounded" />
          </div>
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-6">
          <SkeletonBlock className="h-28 w-28 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-2 w-full rounded-full" />
            <SkeletonBlock className="h-3 w-3/4 rounded" />
            <SkeletonBlock className="h-3 w-1/2 rounded" />
          </div>
        </div>
      </div>

      {/* Cascade graph skeleton */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-28 rounded" />
            <SkeletonBlock className="h-3 w-40 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkeletonBlock className="h-20 w-48 rounded-2xl" />
          <div className="h-6 w-px bg-white/5" />
          <div className="grid grid-cols-2 gap-3 w-full">
            {[1, 2, 3, 4].map(i => (
              <SkeletonBlock key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Playbook skeleton */}
      <div className="glass rounded-2xl p-5">
        <SkeletonBlock className="h-3 w-32 rounded mb-5" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-white/5 p-4 flex gap-3">
              <SkeletonBlock className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3 w-3/4 rounded" />
                <SkeletonBlock className="h-3 w-full rounded" />
                <SkeletonBlock className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
