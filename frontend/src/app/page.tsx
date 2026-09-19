"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { FootprintForm } from "../components/FootprintForm";
import { Playbook } from "../components/Playbook";
import { AuditLogModal } from "../components/AuditLogModal";
import { SettingsModal } from "../components/SettingsModal";
import { NotificationsPopover } from "../components/NotificationsPopover";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";
import { Bell, Settings, Zap, ArrowRight } from "lucide-react";

const INITIAL_API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const SCENARIOS: { id: ThreatScenario; label: string; prob: string; color: string }[] = [
  { id: "email_compromise", label: "Email Breach", prob: "98.4%", color: "#e85d43" },
  { id: "sim_swap", label: "SIM Swap", prob: "84.1%", color: "#e59b38" },
  { id: "oauth_hijack", label: "OAuth Hijack", prob: "91.7%", color: "#3ea6c8" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [services, setServices] = useState<ServiceId[]>([
    "email",
    "google",
    "amazon",
    "bank",
    "whatsapp",
    "instagram",
  ]);
  const [scenario, setScenario] = useState<ThreatScenario>("email_compromise");
  const [email, setEmail] = useState("devops-admin@enterprise.com");
  const [apiUrl, setApiUrl] = useState(INITIAL_API);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");

  // Modals and Popovers
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(1);

  // Run simulation against backend with explicit arguments to avoid state closure race conditions
  async function runSimulation(
    targetScenario?: ThreatScenario,
    targetServices?: ServiceId[],
    targetEmail?: string,
    targetApiUrl?: string
  ) {
    const sc = targetScenario || scenario;
    const sv = targetServices || services;
    const em = targetEmail !== undefined ? targetEmail : email;
    const host = targetApiUrl || apiUrl;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${host}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, services: sv, scenario: sc }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Simulation failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : `Backend unavailable on ${host}.`
      );
    } finally {
      setLoading(false);
    }
  }

  // Pre-load default simulation on mount
  useEffect(() => {
    runSimulation();
  }, []);

  function handleScenarioChange(sc: ThreatScenario) {
    setScenario(sc);
    runSimulation(sc, services, email);
  }

  function scrollToAttackPath() {
    const el = document.getElementById("attack-path-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function scrollToChannels() {
    const el = document.getElementById("channels-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleReset() {
    const defaultServices: ServiceId[] = ["email", "google", "amazon", "bank", "whatsapp", "instagram"];
    const defaultScenario: ThreatScenario = "email_compromise";
    const defaultEmail = "devops-admin@enterprise.com";

    setEmail(defaultEmail);
    setScenario(defaultScenario);
    setServices(defaultServices);
    setActiveTab("dashboard");
    runSimulation(defaultScenario, defaultServices, defaultEmail);
  }

  return (
    <div className="min-h-screen bg-[#f2eae2] py-4 sm:py-8 px-3 sm:px-6 lg:px-8 flex items-center justify-center font-body text-[#1c1917]">
      {/* Master Figma Frame (Exact Crowz Dashboard Container) */}
      <div className="w-full max-w-[1400px] bg-[#faf8f5] rounded-[32px] border border-[#e8dfd5] shadow-2xl overflow-hidden flex flex-col md:flex-row figma-shadow">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          email={email}
          setEmail={setEmail}
          onReset={handleReset}
          onTriggerSimulation={() => runSimulation(scenario, services, email)}
          onOpenPlaybook={() => setIsPlaybookOpen(true)}
          onScrollToAttackPath={scrollToAttackPath}
          threatIntel={result?.threatIntel}
        />

        {/* Main Content Dashboard */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-7 overflow-hidden">
          {/* Header Row: Title + Notification Dot + Settings + Scenario Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0e7dd] pb-5">
            {/* Title & Notification (Crowz Header Style) */}
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1c1917] tracking-tight">
                Dashboard
              </h1>
              <div className="flex items-center gap-1.5 ml-1 relative">
                {/* Notification Bell with Red Badge */}
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#78716c] hover:text-[#1c1917] transition-colors"
                  title="Security Alerts & Notifications"
                >
                  <Bell size={17} />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#e85d43] text-white flex items-center justify-center font-heading text-[9px] font-bold shadow-sm">
                      {unreadAlerts}
                    </span>
                  )}
                </button>

                {/* Settings Gear Button */}
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#78716c] hover:text-[#1c1917] transition-colors"
                  title="System & AI Settings"
                >
                  <Settings size={17} />
                </button>

                {/* Notifications Popover Dropdown */}
                <NotificationsPopover
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  onOpenPlaybook={() => setIsPlaybookOpen(true)}
                  onFocusAttackPath={scrollToAttackPath}
                  unreadCount={unreadAlerts}
                  onMarkRead={() => setUnreadAlerts(0)}
                />
              </div>
            </div>

            {/* Scenario Switcher Tabs + Simulation CTA */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#f4ede4] p-1 rounded-2xl border border-[#e8dfd5]">
                {SCENARIOS.map((sc) => {
                  const isActive = scenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleScenarioChange(sc.id)}
                      className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white text-[#1c1917] figma-shadow"
                          : "text-[#78716c] hover:text-[#1c1917]"
                      }`}
                    >
                      <span>{sc.label}</span>
                      <span
                        className="text-[9px] px-1 py-0.2 rounded"
                        style={{
                          background: isActive ? `${sc.color}20` : "transparent",
                          color: isActive ? sc.color : "#a8a29e",
                        }}
                      >
                        {sc.prob}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => runSimulation(scenario, services, email)}
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
                    <span>Run Threat Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#fceee9] border border-[#e85d43]/30 text-[#e85d43] text-xs font-semibold flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => runSimulation()}
                className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold border border-[#e85d43]/30 hover:bg-[#fceee9]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Row 1: KPI Counters & Rainbow Concentric Arc Banner */}
          <RiskGauge
            score={result?.score ?? 97}
            severity={result?.severity ?? "CRITICAL"}
            onOpenPlaybook={() => setIsPlaybookOpen(true)}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
            onScrollToChannels={scrollToChannels}
            onScrollToTimeline={scrollToAttackPath}
          />

          {/* Row 2: Cascade Activity Spline Chart + Bedrock AI Telemetry */}
          <CascadeGraph
            nodes={result?.cascade ?? []}
            agentTrace={result?.agentTrace ?? []}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          />

          {/* Row 3: Channels / Connected Identity Footprint */}
          <FootprintForm
            selected={services}
            setSelected={(next) => {
              setServices(next);
              runSimulation(scenario, next, email);
            }}
            onContainAll={() => setIsPlaybookOpen(true)}
          />
        </main>
      </div>

      {/* 1. Defensive Playbook Modal */}
      <Playbook
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
        items={
          result?.playbook ?? [
            {
              title: "Revoke Active OAuth Session Tokens",
              description: "Terminate compromised SAML/SSO bearer cookies across identity domains.",
              actionUrl: "https://myaccount.google.com/permissions",
            },
            {
              title: "Enforce FIDO2 Hardware MFA",
              description: "Block SMS & telephony 2FA fallback to prevent SIM swapping pivots.",
              actionUrl: "https://aws.amazon.com/iam",
            },
            {
              title: "Freeze Corporate Treasury API Access",
              description: "Halt automated ACH and payment outbound requests from compromised identity.",
            },
          ]
        }
      />

      {/* 2. Bedrock Multi-Agent Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        result={result}
      />

      {/* 3. System & Simulation Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiUrl={apiUrl}
        onUpdateApiUrl={(url) => {
          setApiUrl(url);
          runSimulation(scenario, services, email, url);
        }}
        onResetDefaults={handleReset}
      />
    </div>
  );
}
