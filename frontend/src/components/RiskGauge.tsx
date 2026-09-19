"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SEVERITY_CONFIG = {
  CRITICAL: { label: "CRITICAL", color: "#ef4444", glow: "rgba(239,68,68,0.35)", track: "#7f1d1d" },
  HIGH:     { label: "HIGH",     color: "#f97316", glow: "rgba(249,115,22,0.3)",  track: "#7c2d12" },
  MODERATE: { label: "MODERATE", color: "#eab308", glow: "rgba(234,179,8,0.25)", track: "#713f12" },
  LOW:      { label: "LOW",      color: "#22c55e", glow: "rgba(34,197,94,0.2)",  track: "#14532d" },
};

function AnimatedCounter({ target }: { target: number }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, v => Math.round(v).toString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    motionVal.set(target);
    const unsubscribe = spring.on("change", v => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
    return unsubscribe;
  }, [target]);

  return <span ref={ref}>0</span>;
}

export function RiskGauge({ score, severity }: { score: number; severity: string }) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.MODERATE;

  // SVG half-arc parameters
  const r = 80;
  const cx = 110;
  const cy = 100;
  const circumference = Math.PI * r; // half circle
  const offset = circumference * (1 - score / 100);

  return (
    <div className="glass rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Blast radius</div>
          <div className="mt-1 text-sm text-zinc-300">Synthetic exposure score</div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider ${severity === "CRITICAL" ? "severity-critical" : ""}`}
          style={{
            borderColor: cfg.color + "50",
            background: cfg.color + "15",
            color: cfg.color,
          }}
        >
          {cfg.label}
        </motion.div>
      </div>

      {/* Arc Gauge */}
      <div className="mt-4 flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: 220, height: 120 }}>
          <svg width="220" height="120" viewBox="0 0 220 120">
            {/* Track arc */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke={cfg.track}
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Animated fill arc */}
            <motion.path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke={cfg.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 8px ${cfg.glow})` }}
            />
            {/* Glow dot at tip */}
            <motion.circle
              cx={cx - r + 2}
              cy={cy}
              r="8"
              fill={cfg.color}
              opacity="0.6"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
            />

            {/* Score text */}
            <text x={cx} y={cy - 12} textAnchor="middle" className="tabular-nums">
              <tspan
                style={{
                  fontSize: "40px",
                  fontWeight: "700",
                  fill: "white",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {score}
              </tspan>
            </text>
            <text x={cx} y={cy + 6} textAnchor="middle"
              style={{ fontSize: "11px", fill: "#71717a", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em" }}
            >
              / 100
            </text>

            {/* Min/Max labels */}
            <text x={cx - r + 4} y={cy + 18} style={{ fontSize: "9px", fill: "#52525b", fontFamily: "Inter, sans-serif" }}>0</text>
            <text x={cx + r - 14} y={cy + 18} style={{ fontSize: "9px", fill: "#52525b", fontFamily: "Inter, sans-serif" }}>100</text>
          </svg>

          {/* Glow background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 90%, ${cfg.glow} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Right side info */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Score bar breakdown */}
          <div>
            <div className="text-xs text-zinc-500 mb-1.5">Exposure level</div>
            <div className="relative h-2 rounded-full overflow-hidden bg-white/[0.06]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${cfg.track}, ${cfg.color})` }}
                initial={{ width: "0%" }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>

          <div className="text-[11px] leading-5 text-zinc-500">
            Score reflects the number and sensitivity of connected nodes in this simulation. Not a probability of breach.
          </div>

          {/* Severity tiers */}
          <div className="grid grid-cols-2 gap-1">
            {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map(tier => (
              <div
                key={tier}
                className="text-[9px] uppercase tracking-wider px-2 py-1 rounded text-center"
                style={{
                  background: tier === severity ? SEVERITY_CONFIG[tier].color + "20" : "rgba(255,255,255,0.03)",
                  color: tier === severity ? SEVERITY_CONFIG[tier].color : "#52525b",
                  border: `1px solid ${tier === severity ? SEVERITY_CONFIG[tier].color + "40" : "transparent"}`,
                  fontWeight: tier === severity ? "700" : "400",
                }}
              >
                {tier}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
