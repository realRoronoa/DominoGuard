"use client";

import { ArrowUpRight } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  result: SimulationResult | null;
  loading?: boolean;
  onOpenPlaybook?: () => void;
  onOpenAuditLogs?: () => void;
  onScrollToChannels?: () => void;
  onScrollToTimeline?: () => void;
}

const SEVERITY_COLOR: Record<string, string> = {
  LOW: "#359381",
  MODERATE: "#e59b38",
  HIGH: "#e07a3f",
  CRITICAL: "#e85d43",
};

/**
 * A deterministic run finishes in a couple of milliseconds, which reads as a
 * broken "0.0 s" if everything is forced into seconds. Split the unit instead,
 * and show sub-millisecond runs as "<1" rather than a placeholder-looking "0".
 */
function formatLatency(ms: number): { value: string; unit: string } {
  if (ms >= 1000) return { value: (ms / 1000).toFixed(1), unit: "s" };
  return { value: ms < 1 ? "<1" : String(Math.round(ms)), unit: "ms" };
}

function Stat({
  label,
  dot,
  onClick,
  title,
  children,
}: {
  label: string;
  dot: string;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex flex-col text-left group hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-[#78716c] group-hover:text-[#1c1917]">{label}</span>
        <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      </div>
      <div className="font-heading text-3xl font-extrabold text-[#1c1917] tracking-tight flex items-baseline">
        {children}
      </div>
    </button>
  );
}

export function RiskGauge({
  result,
  loading,
  onOpenPlaybook,
  onOpenAuditLogs,
  onScrollToChannels,
  onScrollToTimeline,
}: Props) {
  const color = result ? SEVERITY_COLOR[result.severity] ?? "#e85d43" : "#a8a29e";
  const placeholder = <span className="text-[#d6cec4]">—</span>;

  // How many accounts the attacker actually reaches beyond the starting one.
  const spread = result ? Math.max(0, result.metrics.reachableCount - 1) : 0;

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-5 justify-between">
      <div className="flex flex-wrap items-center gap-6 sm:gap-8 py-2">
        <Stat
          label="Risk Score"
          dot={color}
          onClick={onOpenAuditLogs}
          title="See how this score was produced"
        >
          {result ? (
            <>
              {result.score}
              <span className="text-sm font-bold text-[#a8a29e] ml-1">/100</span>
              <span className="text-[10px] font-bold ml-2" style={{ color }}>
                {result.severity}
              </span>
            </>
          ) : (
            placeholder
          )}
        </Stat>

        <Stat
          label="Accounts Reached"
          dot="#e59b38"
          onClick={onScrollToChannels}
          title="Jump to your connected accounts"
        >
          {result ? (
            <>
              {result.metrics.reachableCount}
              <span className="text-sm font-semibold text-[#78716c] ml-1.5">
                of {result.metrics.selectedCount}
              </span>
            </>
          ) : (
            placeholder
          )}
        </Stat>

        <Stat
          label="Analysis Time"
          dot="#359381"
          onClick={onScrollToTimeline}
          title="Jump to the simulated chain"
        >
          {result ? (
            <>
              {formatLatency(result.metrics.totalLatencyMs).value}
              <span className="text-xl font-bold text-[#359381] ml-0.5">
                {formatLatency(result.metrics.totalLatencyMs).unit}
              </span>
            </>
          ) : (
            placeholder
          )}
        </Stat>
      </div>

      {/* Blast-radius summary card */}
      <div
        onClick={onOpenPlaybook}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenPlaybook?.();
          }
        }}
        className="flex items-center justify-between gap-5 bg-[#f5ede2] hover:bg-[#ede3d6] cursor-pointer rounded-2xl p-4 sm:px-5 border border-[#e8dfd5] figma-shadow min-w-[280px] transition-colors group"
      >
        <div>
          <div className="font-heading text-sm font-bold text-[#1c1917] leading-tight">Blast Radius</div>
          <div className="text-[11px] text-[#78716c] mt-0.5">
            {loading && !result
              ? "Running simulation…"
              : result
              ? spread === 0
                ? "No onward reach in this scenario"
                : `${spread} further account${spread === 1 ? "" : "s"} reachable`
              : "No simulation yet"}
          </div>
          <div
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-heading font-bold group-hover:underline"
            style={{ color: result ? color : "#a8a29e" }}
          >
            <span>View Lockdown Plan</span>
            <ArrowUpRight
              size={12}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </div>

        {/* Semicircular gauge; the sweep is the real score. */}
        <div className="relative w-20 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
            <path
              d="M 10 70 A 40 40 0 0 1 90 70"
              fill="none"
              stroke="#e4d9cb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {result && (
              <path
                d="M 10 70 A 40 40 0 0 1 90 70"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${result.score} 100`}
                className="transition-all duration-700 ease-out"
              />
            )}
          </svg>

          <div
            className="absolute -bottom-1 px-2 py-0.5 rounded-full text-white font-heading text-[10px] font-bold shadow-sm"
            style={{ background: result ? color : "#a8a29e" }}
          >
            {result ? result.score : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
