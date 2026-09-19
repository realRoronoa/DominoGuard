"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { RiskGauge } from "../components/RiskGauge";
import { CascadeGraph } from "../components/CascadeGraph";
import { FootprintForm } from "../components/FootprintForm";
import { Playbook } from "../components/Playbook";
import { ServiceId, SimulationResult, ThreatScenario } from "../types";
import { Bell, Settings, Zap, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);

  // Run simulation against backend
  async function runSimulation(targetScenario?: ThreatScenario) {
    const sc = targetScenario || scenario;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, services, scenario: sc }),
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
          : "Backend unavailable on port 4000."
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
    runSimulation(sc);
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
          onReset={() => runSimulation()}
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
              <div className="flex items-center gap-1.5 ml-1">
                <span className="w-5 h-5 rounded-full bg-[#e85d43] text-white flex items-center justify-center font-heading text-[10px] font-bold">
                  1
                </span>
                <button
                  onClick={() => setIsPlaybookOpen(true)}
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#78716c] transition-colors"
                  title="Settings & Playbook"
                >
                  <Settings size={17} />
                </button>
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
                onClick={() => runSimulation()}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#e85d43] hover:bg-[#d64e35] text-white font-heading text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-60"
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
            <div className="p-3.5 rounded-2xl bg-[#fceee9] border border-[#e85d43]/30 text-[#e85d43] text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Row 1: KPI Counters & Rainbow Concentric Arc Banner */}
          <RiskGauge
            score={result?.score ?? 97}
            severity={result?.severity ?? "CRITICAL"}
            onOpenPlaybook={() => setIsPlaybookOpen(true)}
          />

          {/* Row 2: Cascade Activity Spline Chart + Bedrock AI Telemetry */}
          <CascadeGraph
            nodes={result?.cascade ?? []}
            agentTrace={result?.agentTrace ?? []}
          />

          {/* Row 3: Channels / Connected Identity Footprint */}
          <FootprintForm
            selected={services}
            setSelected={(next) => {
              setServices(next);
              runSimulation();
            }}
            onContainAll={() => setIsPlaybookOpen(true)}
          />
        </main>
      </div>

      {/* Defensive Playbook Modal */}
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
    </div>
  );
}
