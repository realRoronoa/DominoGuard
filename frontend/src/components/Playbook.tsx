"use client";

import { useEffect, useState } from "react";
import { Check, ShieldCheck, X, ArrowUpRight, ListChecks } from "lucide-react";
import { PlaybookItem } from "../types";

interface PlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PlaybookItem[];
  rootLabel?: string;
}

const ORDER_HINT = ["Do this first", "Then", "Finally"];

/**
 * Defence in depth: the backend already rejects non-http(s) `actionUrl` values,
 * but these links are model-authored, so re-check before putting one in an href.
 */
function safeHref(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function Playbook({ isOpen, onClose, items, rootLabel }: PlaybookModalProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  // A new simulation produces a new playbook; old ticks no longer apply.
  useEffect(() => setChecked({}), [items]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const doneCount = items.filter((_, i) => checked[i]).length;
  const allDone = items.length > 0 && doneCount === items.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 border border-[#e8dfd5] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Lockdown checklist"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#f4ede4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e6f4f1] text-[#359381] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#1c1917]">Lockdown Checklist</h3>
              <p className="text-xs text-[#78716c]">
                {rootLabel
                  ? `Work top to bottom, starting with ${rootLabel}.`
                  : "Work top to bottom — order matters."}
              </p>
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

        <div className="my-5 space-y-3">
          {items.length === 0 && (
            <p className="text-xs text-[#78716c] text-center py-8">
              Run a simulation to generate your checklist.
            </p>
          )}

          {items.map((item, index) => {
            const isDone = !!checked[index];
            const href = safeHref(item.actionUrl);
            return (
              <div
                key={index}
                onClick={() => setChecked((prev) => ({ ...prev, [index]: !prev[index] }))}
                role="checkbox"
                aria-checked={isDone}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
                  }
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? "bg-[#e9f4f1] border-[#359381]/40"
                    : "bg-[#faf8f5] border-[#e8dfd5] hover:border-[#d6c9bc]"
                } text-[#1c1917]`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                    isDone ? "bg-[#359381] border-[#359381] text-white" : "border-[#a8a29e] bg-white"
                  }`}
                >
                  {isDone && <Check size={12} className="stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-heading text-xs font-bold">
                      Step {index + 1}: {item.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-[#a8a29e] shrink-0">
                      {ORDER_HINT[index] ?? ""}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716c] mt-0.5 leading-snug">{item.description}</p>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#359381] hover:underline break-all"
                    >
                      <span>Open security settings</span>
                      <ArrowUpRight size={11} className="shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setChecked(allDone ? {} : Object.fromEntries(items.map((_, i) => [i, true])))
            }
            className={`w-full py-3.5 px-5 rounded-2xl font-heading text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md ${
              allDone ? "bg-[#359381] shadow-[#359381]/30" : "bg-[#e85d43] hover:bg-[#d64e35] shadow-[#e85d43]/30"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {allDone ? <Check size={15} /> : <ListChecks size={15} />}
              <span>
                {allDone ? "All steps marked done — clear checklist" : `Mark all ${items.length} steps done`}
              </span>
            </span>
          </button>
        )}

        <p className="mt-4 pt-3 border-t border-[#f4ede4] text-[11px] text-[#78716c] leading-relaxed">
          DominoGuard cannot change your accounts for you. These are steps to carry out yourself on each
          provider&apos;s own security page.
          {items.length > 0 && (
            <span className="font-semibold text-[#359381]">
              {" "}
              {doneCount} of {items.length} ticked off.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
