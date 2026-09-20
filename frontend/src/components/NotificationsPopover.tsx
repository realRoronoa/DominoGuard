"use client";

import { useEffect, useRef } from "react";
import { ShieldAlert, X, CheckCircle2, Info } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaybook: () => void;
  onFocusAttackPath: () => void;
  result: SimulationResult | null;
  onMarkRead: () => void;
}

export type Alert = {
  key: string;
  tone: "risk" | "info";
  title: string;
  detail: string;
  source: string;
};

/**
 * Every alert is derived from the simulation that just ran. Shared with the
 * dashboard so the bell badge and this list can never disagree.
 */
export function buildAlerts(result: SimulationResult | null): Alert[] {
  if (!result) return [];
  const alerts: Alert[] = [];

  const root = result.cascade[0];
  for (const node of result.cascade.slice(1, result.metrics.reachableCount)) {
    alerts.push({
      key: `hop-${node.id}`,
      tone: "risk",
      title: `${node.label} is reachable`,
      detail: node.reason,
      source: `Step ${node.order + 1} · from ${root?.label ?? "the starting account"}`,
    });
  }

  const intel = result.threatIntel;
  if (intel?.checked && intel.pwned) {
    alerts.push({
      key: "intel-pwned",
      tone: "risk",
      title: `${intel.breachCount} past breach${intel.breachCount === 1 ? "" : "es"} found`,
      detail: `${intel.email} appears in ${intel.topBreaches.join(", ")}. Historical disclosures only — not proof of current compromise.`,
      source: intel.source,
    });
  } else if (intel && !intel.checked && intel.unavailableReason) {
    alerts.push({
      key: "intel-unavailable",
      tone: "info",
      title: "Breach check did not complete",
      detail: intel.unavailableReason,
      source: "Breach lookup",
    });
  }

  return alerts;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  onOpenPlaybook,
  onFocusAttackPath,
  result,
  onMarkRead,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      // The bell toggles this popover; let its own handler run instead of
      // closing here and immediately reopening.
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target) && !(target as HTMLElement).closest?.("[data-bell]")) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alerts = buildAlerts(result);

  return (
    <div
      ref={ref}
      className="absolute top-12 left-0 sm:left-auto sm:right-0 z-50 w-80 sm:w-96 rounded-2xl bg-white p-4 border border-[#e8dfd5] shadow-2xl animate-in fade-in duration-150 figma-shadow"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#f4ede4]">
        <span className="font-heading text-xs font-bold text-[#1c1917]">What this run found</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {alerts.length > 0 && (
            <button
              type="button"
              onClick={onMarkRead}
              className="text-[10px] text-[#78716c] hover:text-[#1c1917] font-semibold"
            >
              Mark read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-6 h-6 rounded-full hover:bg-[#f4ede4] flex items-center justify-center text-[#78716c]"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="py-2.5 space-y-2 max-h-[320px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-[#78716c] text-xs flex flex-col items-center gap-1.5">
            <CheckCircle2 size={20} className="text-[#359381]" />
            <span>
              {result
                ? "Nothing downstream was reachable in this run."
                : "Run a simulation to see findings."}
            </span>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.key}
              className={`p-3 rounded-xl border ${
                a.tone === "risk" ? "bg-[#fceee9] border-[#e85d43]/20" : "bg-[#faf8f5] border-[#e8dfd5]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {a.tone === "risk" ? (
                  <ShieldAlert size={16} className="text-[#e85d43] shrink-0 mt-0.5" />
                ) : (
                  <Info size={16} className="text-[#78716c] shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-heading text-xs font-bold text-[#1c1917]">{a.title}</div>
                  <div className="text-[11px] text-[#78716c] mt-0.5 leading-snug">{a.detail}</div>
                  <div className="text-[9px] text-[#a8a29e] mt-1">{a.source}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className="flex items-center gap-2 pt-2.5 border-t border-[#f4ede4]">
          <button
            type="button"
            onClick={() => {
              onFocusAttackPath();
              onClose();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white text-[#1c1917] text-[10px] font-heading font-bold border border-[#e8dfd5] hover:bg-[#faf8f5] transition-colors"
          >
            View the chain
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenPlaybook();
              onClose();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[#e85d43] text-white text-[10px] font-heading font-bold hover:bg-[#d64e35] transition-colors"
          >
            Open lockdown plan
          </button>
        </div>
      )}
    </div>
  );
}
