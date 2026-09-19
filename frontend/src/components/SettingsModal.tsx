"use client";

import { useState } from "react";
import { X, Settings, Check, Sliders, Shield, Cpu, RefreshCw } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  onUpdateApiUrl: (url: string) => void;
  onResetDefaults: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  apiUrl,
  onUpdateApiUrl,
  onResetDefaults,
}: Props) {
  const [model, setModel] = useState("anthropic.claude-3-haiku-20240307-v1:0");
  const [depth, setDepth] = useState("6");
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  function handleSave() {
    onUpdateApiUrl(localApiUrl);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f4ede4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f4ede4] text-[#1c1917] flex items-center justify-center font-bold">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1c1917]">
                System & Simulation Settings
              </h3>
              <p className="text-xs text-[#78716c]">
                Configure AI engine, graph depth, and API parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4ede4] hover:bg-[#e8dfd5] flex items-center justify-center text-[#78716c] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* AI Model */}
          <div>
            <label className="block font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5">
              <Cpu size={14} className="text-[#e85d43]" />
              <span>Foundation Model Provider</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-xs font-medium py-2.5 px-3 rounded-xl bg-[#faf8f5] border border-[#e8dfd5] text-[#1c1917] focus:outline-none focus:border-[#e85d43]"
            >
              <option value="anthropic.claude-3-haiku-20240307-v1:0">
                AWS Bedrock: Anthropic Claude 3.5 Haiku (Fast & Precise)
              </option>
              <option value="meta.llama3-70b-instruct-v1:0">
                AWS Bedrock: Meta Llama 3 70B Instruct
              </option>
              <option value="mock-heuristic">
                Local Fast Fallback (Zero Latency Heuristic Engine)
              </option>
            </select>
          </div>

          {/* Simulation Graph Depth */}
          <div>
            <label className="block font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5">
              <Sliders size={14} className="text-[#359381]" />
              <span>Cascade Depth Limit</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "3", label: "3 Hops (Direct)" },
                { id: "6", label: "6 Hops (Full)" },
                { id: "10", label: "Deep Enterprise" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDepth(d.id)}
                  className={`py-2 px-3 rounded-xl font-heading text-xs font-bold transition-all text-center border ${
                    depth === d.id
                      ? "bg-[#359381] text-white border-[#359381]"
                      : "bg-[#faf8f5] text-[#78716c] border-[#e8dfd5] hover:text-[#1c1917]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backend API Endpoint */}
          <div>
            <label className="block font-heading text-xs font-bold text-[#1c1917] mb-1.5 flex items-center gap-1.5">
              <Shield size={14} className="text-[#e59b38]" />
              <span>Backend API Host</span>
            </label>
            <input
              type="text"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder="http://localhost:4000"
              className="w-full text-xs font-code py-2.5 px-3 rounded-xl bg-[#faf8f5] border border-[#e8dfd5] text-[#1c1917] focus:outline-none focus:border-[#e85d43]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#f4ede4] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              setLocalApiUrl("http://localhost:4000");
              setDepth("6");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#78716c] hover:bg-[#f4ede4] transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset Defaults</span>
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
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
