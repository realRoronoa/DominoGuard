export type ServiceId = "email" | "instagram" | "whatsapp" | "bank" | "google" | "amazon";
export type ThreatScenario = "email_compromise" | "sim_swap" | "oauth_hijack";

export type ThreatIntel = {
  checked: boolean;
  email: string;
  pwned: boolean;
  breachCount: number;
  topBreaches: string[];
  source: string;
  latencyMs: number;
};

export type SimulationResult = {
  score: number;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  headline: string;
  rootCause: string;
  cascade: { id: string; label: string; status: "root" | "high" | "medium" | "low"; reason: string; order: number }[];
  playbook: { title: string; description: string; actionUrl?: string }[];
  agentTrace: { name: string; status: "complete" | "fallback"; summary: string }[];
  privacyNote: string;
  threatIntel?: ThreatIntel;
};
