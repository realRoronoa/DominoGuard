"use client";

import { ShieldAlert, X, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaybook: () => void;
  onFocusAttackPath: () => void;
  unreadCount: number;
  onMarkRead: () => void;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  onOpenPlaybook,
  onFocusAttackPath,
  unreadCount,
  onMarkRead,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 left-0 sm:left-auto sm:right-0 z-50 w-80 sm:w-96 rounded-2xl bg-white p-4 border border-[#e8dfd5] shadow-2xl animate-in fade-in duration-150 figma-shadow">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#f4ede4]">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xs font-bold text-[#1c1917]">
            Security Alerts & Signals
          </span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#e85d43] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={onMarkRead}
              className="text-[10px] text-[#78716c] hover:text-[#1c1917] font-semibold"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full hover:bg-[#f4ede4] flex items-center justify-center text-[#78716c]"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="py-2.5 space-y-2.5">
        {unreadCount > 0 ? (
          <div className="p-3 rounded-xl bg-[#fceee9] border border-[#e85d43]/20 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-[#e85d43] shrink-0 mt-0.5" />
              <div>
                <div className="font-heading text-xs font-bold text-[#1c1917]">
                  Privilege Escalation Verified
                </div>
                <div className="text-[11px] text-[#78716c] mt-0.5">
                  AWS IAM Admin permissions accessible via delegated Google SSO session token.
                </div>
                <div className="text-[9px] text-[#a8a29e] mt-1">2 mins ago · Bedrock Red-Team Agent</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#e85d43]/10">
              <button
                onClick={() => {
                  onFocusAttackPath();
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white text-[#1c1917] text-[10px] font-heading font-bold border border-[#e8dfd5] hover:bg-[#faf8f5] transition-colors"
              >
                Inspect Hop 03
              </button>
              <button
                onClick={() => {
                  onOpenPlaybook();
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#e85d43] text-white text-[10px] font-heading font-bold hover:bg-[#d64e35] transition-colors"
              >
                Contain Now
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-[#78716c] text-xs flex flex-col items-center gap-1.5">
            <CheckCircle2 size={20} className="text-[#359381]" />
            <span>No unread security alerts</span>
          </div>
        )}
      </div>
    </div>
  );
}
