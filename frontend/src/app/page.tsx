"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "../components/Sidebar";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { FootprintForm } from "../components/FootprintForm";
import { Playbook } from "../components/Playbook";
import { AuditLogModal } from "../components/AuditLogModal";
import { SettingsModal } from "../components/SettingsModal";
import { NotificationsPopover, buildAlerts } from "../components/NotificationsPopover";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";
import { Bell, Settings, Zap } from "lucide-react";

const INITIAL_API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const DEFAULT_SERVICES: ServiceId[] = ["email", "google", "amazon", "bank", "whatsapp", "instagram"];
const DEFAULT_SCENARIO: ThreatScenario = "email_compromise";

const SCENARIOS: { id: ThreatScenario; label: string; hint: string; color: string }[] = [
  { id: "email_compromise", label: "Email Breach", hint: "inbox taken over", color: "#e85d43" },
  { id: "sim_swap", label: "SIM Swap", hint: "phone number stolen", color: "#e59b38" },
  { id: "oauth_hijack", label: "Session Hijack", hint: "signed-in session stolen", color: "#3ea6c8" },
];

type RunOverrides = {
  scenario?: ThreatScenario;
  services?: ServiceId[];
  email?: string;
  apiUrl?: string;
  maxHops?: number | null;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [services, setServices] = useState<ServiceId[]>(DEFAULT_SERVICES);
  const [scenario, setScenario] = useState<ThreatScenario>(DEFAULT_SCENARIO);
  // Empty by default. The breach lookup sends this address to a third party, so
  // it only runs once the user has typed one in themselves.
  const [email, setEmail] = useState("");
  const [apiUrl, setApiUrl] = useState(INITIAL_API);
  const [maxHops, setMaxHops] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");

  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readAlerts, setReadAlerts] = useState(false);

  // Latest state, readable from callbacks without making them re-fire effects.
  const latest = useRef({ scenario, services, email, apiUrl, maxHops });
  latest.current = { scenario, services, email, apiUrl, maxHops };

  // Out-of-order responses would otherwise let a slow earlier run overwrite a
  // faster later one — rapid scenario switching makes that easy to hit.
  const runId = useRef(0);

  const runSimulation = useCallback(async (overrides: RunOverrides = {}) => {
    const { scenario: sc, services: sv, email: em, apiUrl: host, maxHops: hops } = {
      ...latest.current,
      ...overrides,
    };

    const ticket = ++runId.current;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${host}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          services: sv,
          scenario: sc,
          ...(hops ? { maxHops: hops } : {}),
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || `Simulation failed (HTTP ${res.status}).`);
      if (!body) throw new Error("Backend returned an unreadable response.");

      if (ticket === runId.current) {
        setResult(body as SimulationResult);
        setReadAlerts(false);
      }
    } catch (e: unknown) {
      if (ticket !== runId.current) return;
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : `Backend unavailable on ${host}.`
      );
    } finally {
      if (ticket === runId.current) setLoading(false);
    }
  }, []);

  // React 18 StrictMode mounts effects twice in development; without the guard
  // the dashboard fires two identical simulations on every page load.
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    runSimulation();
  }, [runSimulation]);

  function handleScenarioChange(sc: ThreatScenario) {
    setScenario(sc);
    runSimulation({ scenario: sc });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleReset() {
    setEmail("");
    setScenario(DEFAULT_SCENARIO);
    setServices(DEFAULT_SERVICES);
    setMaxHops(null);
    setActiveTab("dashboard");
    runSimulation({
      scenario: DEFAULT_SCENARIO,
      services: DEFAULT_SERVICES,
      email: "",
      maxHops: null,
    });
  }

  // Same derivation the popover uses, so the badge can never disagree with the list.
  const unreadAlerts = readAlerts ? 0 : buildAlerts(result).length;

  return (
    <div className="min-h-screen bg-[#f2eae2] py-4 sm:py-8 px-3 sm:px-6 lg:px-8 flex items-center justify-center font-body text-[#1c1917]">
      <div className="w-full max-w-[1400px] bg-[#faf8f5] rounded-[32px] border border-[#e8dfd5] shadow-2xl overflow-hidden flex flex-col md:flex-row figma-shadow">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          email={email}
          setEmail={setEmail}
          onReset={handleReset}
          onTriggerSimulation={() => runSimulation()}
          onOpenPlaybook={() => setIsPlaybookOpen(true)}
          onScrollToAttackPath={() => scrollTo("attack-path-section")}
          threatIntel={result?.threatIntel}
          metrics={result?.metrics}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-7 overflow-hidden">
          {/* Header: title, alerts, settings, scenario switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0e7dd] pb-5">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                Dashboard
              </h1>
              <div className="flex items-center gap-1.5 ml-1 relative">
                <button
                  type="button"
                  data-bell
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#78716c] hover:text-[#1c1917] transition-colors"
                  title="What this simulation found"
                >
                  <Bell size={17} />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#e85d43] text-white flex items-center justify-center font-heading text-[9px] font-bold shadow-sm">
                      {unreadAlerts}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#78716c] hover:text-[#1c1917] transition-colors"
                  title="Settings"
                >
                  <Settings size={17} />
                </button>

                <NotificationsPopover
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  onOpenPlaybook={() => setIsPlaybookOpen(true)}
                  onFocusAttackPath={() => scrollTo("attack-path-section")}
                  result={result}
                  onMarkRead={() => setReadAlerts(true)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#f4ede4] p-1 rounded-2xl border border-[#e8dfd5]">
                {SCENARIOS.map((sc) => {
                  const isActive = scenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleScenarioChange(sc.id)}
                      title={`Simulate: ${sc.hint}`}
                      className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white text-[#1c1917] figma-shadow"
                          : "text-[#78716c] hover:text-[#1c1917]"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isActive ? sc.color : "#d6cec4" }}
                      />
                      <span>{sc.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => runSimulation()}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#e85d43] hover:bg-[#d64e35] text-white font-heading text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-white">⟳</span>
                    <span>Simulating...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="fill-white" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#fceee9] border border-[#e85d43]/30 text-[#e85d43] text-xs font-semibold flex items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => runSimulation()}
                className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold border border-[#e85d43]/30 hover:bg-[#fceee9] shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          <RiskGauge
            result={result}
            loading={loading}
            onOpenPlaybook={() => setIsPlaybookOpen(true)}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
            onScrollToChannels={() => scrollTo("channels-section")}
            onScrollToTimeline={() => scrollTo("attack-path-section")}
          />

          <CascadeGraph
            result={result}
            loading={loading}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          />

          <FootprintForm
            selected={services}
            setSelected={(next) => {
              setServices(next);
              runSimulation({ services: next });
            }}
            result={result}
            onContainAll={() => setIsPlaybookOpen(true)}
          />
        </main>
      </div>

      <Playbook
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
        items={result?.playbook ?? []}
        rootLabel={result?.cascade[0]?.label}
      />

      <AuditLogModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        result={result}
        scenario={scenario}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiUrl={apiUrl}
        onUpdateApiUrl={(url) => {
          setApiUrl(url);
          runSimulation({ apiUrl: url });
        }}
        maxHops={maxHops}
        onUpdateMaxHops={(hops) => {
          setMaxHops(hops);
          runSimulation({ maxHops: hops });
        }}
        serviceCount={services.length}
        metrics={result?.metrics}
        onResetDefaults={handleReset}
      />
    </div>
  );
}
