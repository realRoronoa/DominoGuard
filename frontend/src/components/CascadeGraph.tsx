"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ArrowUpRight, Check } from "lucide-react";
import { AgentMode, CascadeNode, SimulationResult } from "../types";

interface Props {
  result: SimulationResult | null;
  loading?: boolean;
  onOpenAuditLogs?: () => void;
}

const STATUS_STYLE: Record<CascadeNode["status"], { color: string; y: number; label: string }> = {
  root: { color: "#e85d43", y: 28, label: "Starting point" },
  high: { color: "#e07a3f", y: 48, label: "High exposure" },
  medium: { color: "#e59b38", y: 78, label: "Medium exposure" },
  low: { color: "#359381", y: 106, label: "Low exposure" },
};

const MODE_STYLE: Record<AgentMode, { bg: string; fg: string; label: string }> = {
  bedrock: { bg: "#e6f4f1", fg: "#2d7a6a", label: "Bedrock" },
  live: { bg: "#e8f1f6", fg: "#2b6f8a", label: "Live" },
  fallback: { bg: "#fef5ea", fg: "#b9762a", label: "Fallback" },
  // The stage still ran — just without the model. "Offline" would misread as
  // "nothing happened here".
  disabled: { bg: "#f4ede4", fg: "#78716c", label: "No model" },
  error: { bg: "#fceee9", fg: "#c94a31", label: "Error" },
};

/** "anthropic.claude-3-haiku-20240307-v1:0" -> "Claude 3 Haiku" */
function prettyModel(id: string): string {
  const bare = id.split(".").pop() ?? id;
  const m = bare.match(/^claude-([\d.]+)-([a-z]+)/i);
  return m ? `Claude ${m[1]} ${m[2][0].toUpperCase()}${m[2].slice(1)}` : bare;
}

/**
 * Catmull-Rom spline through the hop points, converted to cubic Béziers so the
 * path curves through every node instead of past it.
 */
function splinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const at = (i: number) => points[Math.min(points.length - 1, Math.max(0, i))];

  let d = `M ${at(0).x} ${at(0).y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function CascadeGraph({ result, loading, onOpenAuditLogs }: Props) {
  const [selectedHopIdx, setSelectedHopIdx] = useState(0);
  const [reachableOnly, setReachableOnly] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const cascade = result?.cascade ?? [];
  const reachableCount = result?.metrics.reachableCount ?? 0;

  const hops = useMemo(() => {
    const visible = reachableOnly ? cascade.slice(0, reachableCount) : cascade;
    const span = 470 - 30;
    return visible.map((node, idx) => ({
      node,
      num: String(node.order + 1).padStart(2, "0"),
      reachable: node.order < reachableCount,
      x: visible.length === 1 ? 250 : 30 + (span * idx) / (visible.length - 1),
      y: STATUS_STYLE[node.status].y,
      color: STATUS_STYLE[node.status].color,
    }));
  }, [cascade, reachableCount, reachableOnly]);

  // The cascade length changes with the scenario and the selected accounts.
  const activeIdx = Math.min(selectedHopIdx, Math.max(0, hops.length - 1));
  const currentHop = hops[activeIdx];
  const path = useMemo(() => splinePath(hops.map((h) => ({ x: h.x, y: h.y }))), [hops]);

  const trace = result?.agentTrace ?? [];

  return (
    <div id="attack-path-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left: the simulated chain */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2 relative gap-3">
          <div>
            <div className="font-heading text-base font-bold text-[#1c1917]">Simulated Chain</div>
            <div className="text-[11px] text-[#78716c]">
              {hops.length ? "Select any step to see why it is reachable" : "No simulation yet"}
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              disabled={!cascade.length}
              className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-[#1c1917] bg-[#f5ede2] hover:bg-[#ede3d6] px-3 py-1.5 rounded-xl border border-[#e8dfd5] transition-colors disabled:opacity-50"
            >
              <span>
                {reachableOnly ? `Reachable (${reachableCount})` : `All steps (${cascade.length})`}
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl p-1.5 border border-[#e8dfd5] shadow-xl z-20">
                {[
                  { on: false, label: `All selected accounts (${cascade.length})` },
                  { on: true, label: `Reachable only (${reachableCount})` },
                ].map((opt) => (
                  <button
                    key={String(opt.on)}
                    type="button"
                    onClick={() => {
                      setReachableOnly(opt.on);
                      setSelectedHopIdx(0);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                      reachableOnly === opt.on
                        ? "bg-[#f5ede2] text-[#1c1917]"
                        : "text-[#78716c] hover:bg-[#faf8f5]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {reachableOnly === opt.on && <Check size={13} className="text-[#e85d43] shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative my-3 h-40 w-full flex items-center justify-center">
          {!hops.length ? (
            <div className="text-xs text-[#a8a29e] font-medium">
              {loading ? "Running simulation…" : "Run a simulation to see the chain."}
            </div>
          ) : (
            <>
              <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                <line x1="0" y1="28" x2="500" y2="28" stroke="#f4ede4" strokeDasharray="3 3" />
                <line x1="0" y1="67" x2="500" y2="67" stroke="#f4ede4" strokeDasharray="3 3" />
                <line x1="0" y1="106" x2="500" y2="106" stroke="#f4ede4" strokeDasharray="3 3" />

                {path && (
                  <path d={path} fill="none" stroke="#e0d3c3" strokeWidth="3.5" strokeLinecap="round" />
                )}

                {hops.map((h, idx) => {
                  const isSelected = activeIdx === idx;
                  return (
                    <g
                      key={h.node.id}
                      onClick={() => setSelectedHopIdx(idx)}
                      className="cursor-pointer"
                      opacity={h.reachable ? 1 : 0.4}
                    >
                      {isSelected && <circle cx={h.x} cy={h.y} r="9" fill={h.color} opacity="0.25" />}
                      <circle
                        cx={h.x}
                        cy={h.y}
                        r={isSelected ? "5.5" : "3.5"}
                        fill={isSelected ? h.color : "#d6c9bc"}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>

              {currentHop && (
                <div
                  className="absolute top-0 bg-white px-3 py-1.5 rounded-xl border border-[#e8dfd5] shadow-lg text-center transition-all duration-300 pointer-events-none max-w-[240px]"
                  style={{
                    left: `${Math.min(82, Math.max(18, (currentHop.x / 500) * 100))}%`,
                    transform: "translate(-50%, -10%)",
                  }}
                >
                  <div className="font-heading text-xs font-extrabold text-[#1c1917] whitespace-nowrap">
                    Step {currentHop.num}: {currentHop.node.label}
                  </div>
                  <div className="text-[9px] font-bold" style={{ color: currentHop.color }}>
                    {currentHop.reachable
                      ? STATUS_STYLE[currentHop.node.status].label
                      : "Not reachable in this scenario"}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {currentHop && (
          <p className="text-[11px] leading-relaxed text-[#57534e] bg-[#faf8f5] border border-[#f0e7dd] rounded-xl px-3 py-2 mb-3">
            {currentHop.node.reason}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-[#f4ede4] pt-3 text-center gap-1">
          {hops.length ? (
            hops.map((h, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={h.node.id}
                  type="button"
                  onClick={() => setSelectedHopIdx(idx)}
                  className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
                    isSelected
                      ? "bg-[#f5ede2] text-[#1c1917] scale-105 figma-shadow"
                      : h.reachable
                      ? "hover:bg-[#faf8f5] text-[#78716c]"
                      : "opacity-40 hover:opacity-70 text-[#78716c]"
                  }`}
                >
                  <span
                    className="font-heading text-xs font-bold"
                    style={{ color: isSelected ? h.color : "#1c1917" }}
                  >
                    {h.num}
                  </span>
                  <span className="text-[10px] truncate max-w-[60px] font-medium">{h.node.label}</span>
                </button>
              );
            })
          ) : (
            <span className="text-[10px] text-[#a8a29e] py-1.5">—</span>
          )}
        </div>
      </div>

      {/* Right: real agent telemetry */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8dfd5] figma-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="font-heading text-base font-bold text-[#1c1917]">Agent Telemetry</div>
            {result && (
              <span
                className="text-[10px] font-code px-2 py-0.5 rounded-full font-bold shrink-0"
                style={
                  result.metrics.bedrockEnabled
                    ? { background: "#e6f4f1", color: "#2d7a6a" }
                    : { background: "#f4ede4", color: "#78716c" }
                }
              >
                {result.metrics.bedrockEnabled ? "Bedrock on" : "Bedrock off"}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#78716c] mb-4">
            {result
              ? `${result.metrics.inputTokens + result.metrics.outputTokens} tokens across ${trace.length} stages`
              : "Waiting for the first simulation"}
          </div>

          <div className="space-y-2.5">
            {trace.length ? (
              trace.map((agent) => {
                const style = MODE_STYLE[agent.mode] ?? MODE_STYLE.error;
                const tokens = agent.inputTokens + agent.outputTokens;
                return (
                  <button
                    key={agent.name}
                    type="button"
                    onClick={onOpenAuditLogs}
                    title={agent.summary}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-[#faf8f5] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform"
                        style={{ background: style.bg, color: style.fg }}
                      >
                        {agent.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading text-xs font-bold text-[#1c1917] truncate">
                          {agent.name}
                        </div>
                        <div className="text-[10px] text-[#78716c]">
                          {agent.latencyMs}ms{tokens > 0 ? ` · ${tokens} tokens` : ""}
                        </div>
                      </div>
                    </div>
                    <span
                      className="font-heading text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: style.bg, color: style.fg }}
                    >
                      {style.label}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-xs text-[#a8a29e] py-6 text-center">
                {loading ? "Running agents…" : "No agent runs yet."}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f4ede4] flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-[#78716c] truncate" title={result?.metrics.modelId}>
            {result ? prettyModel(result.metrics.modelId) : "—"}
          </span>
          <button
            type="button"
            onClick={onOpenAuditLogs}
            className="font-heading font-bold text-[#e85d43] flex items-center gap-1 hover:underline active:scale-95 transition-all shrink-0"
          >
            <span>Full Audit Log</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
