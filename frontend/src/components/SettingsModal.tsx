"use client";

import { useEffect, useState } from "react";
import { X, Settings, Check, Sliders, Shield, Cpu, RefreshCw } from "lucide-react";
import { SimulationResult } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  onUpdateApiUrl: (url: string) => void;
  maxHops: number | null;
  onUpdateMaxHops: (hops: number | null) => void;
  serviceCount: number;
  metrics?: SimulationResult["metrics"];
  onResetDefaults: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  apiUrl,
  onUpdateApiUrl,
  maxHops,
  onUpdateMaxHops,
  serviceCount,
  metrics,
  onResetDefaults,
}: Props) {
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl);
  const [saved, setSaved] = useState(false);

  // Reopening after a reset should show the URL actually in use, not a stale draft.
  useEffect(() => {
    if (isOpen) setLocalApiUrl(apiUrl);
  }, [isOpen, apiUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSave() {
    if (localApiUrl.trim() && localApiUrl.trim() !== apiUrl) {
      onUpdateApiUrl(localApiUrl.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  }

  // Only offer cuts that are shorter than the current account selection.
  const depthOptions: (number | null)[] = [
    null,
    ...Array.from({ length: Math.max(0, serviceCount - 2) }, (_, i) => i + 2),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#f4ede4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f4ede4] text-[#1c1917] flex items-center justify-center shrink-0">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1c1917]">Settings</h3>
              <p className="text-xs text-[#78716c]">Simulation depth and backend connection</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#f4ede4] hover:bg-[#e8dfd5] flex items-center justify-center text-[#78716c] transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Read-only: the model is chosen by the backend, not the browser. */}
          <div>
            <div className="font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5">
              <Cpu size={14} className="text-[#e85d43]" />
              <span>Reasoning engine</span>
            </div>
            <div className="rounded-xl bg-[#faf8f5] border border-[#e8dfd5] px-3 py-2.5 space-y-1">
              {metrics ? (
                <>
                  <div className="font-code text-[11px] text-[#1c1917] break-all">
                    {metrics.modelId}
                  </div>
                  <div className="text-[11px] text-[#78716c]">
                    {metrics.bedrockEnabled
                      ? "Bedrock enabled. If a call fails, that stage falls back to deterministic logic — the Audit Log shows which."
                      : "Bedrock is off on the server. Every stage uses deterministic logic."}
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-[#78716c]">
                  Run a simulation to see which engine the backend is using.
                </div>
              )}
            </div>
          </div>

          {/* Real: sent to the backend as maxHops. */}
          <div>
            <div className="font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5">
              <Sliders size={14} className="text-[#359381]" />
              <span>Chain length</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {depthOptions.map((d) => (
                <button
                  key={String(d)}
                  type="button"
                  onClick={() => onUpdateMaxHops(d)}
                  className={`py-2 px-3 rounded-xl font-heading text-xs font-bold transition-all border ${
                    maxHops === d
                      ? "bg-[#359381] text-white border-[#359381]"
                      : "bg-[#faf8f5] text-[#78716c] border-[#e8dfd5] hover:text-[#1c1917]"
                  }`}
                >
                  {d === null ? `All ${serviceCount} accounts` : `First ${d} steps`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#78716c] mt-1.5">
              Stops the simulation after a set number of steps. Applies on the next run.
            </p>
          </div>

          <div>
            <label
              htmlFor="api-host"
              className="font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5"
            >
              <Shield size={14} className="text-[#e59b38]" />
              <span>Backend API host</span>
            </label>
            <input
              id="api-host"
              type="text"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder="http://localhost:4000"
              className="w-full text-xs font-code py-2.5 px-3 rounded-xl bg-[#faf8f5] border border-[#e8dfd5] text-[#1c1917] focus:outline-none focus:border-[#e85d43]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#f4ede4] flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              setLocalApiUrl(apiUrl);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#78716c] hover:bg-[#f4ede4] transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716c] hover:bg-[#f4ede4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1c1917] text-white font-heading text-xs font-bold hover:bg-[#333] transition-all shadow-sm"
            >
              {saved ? (
                <>
                  <Check size={14} className="text-[#359381]" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
