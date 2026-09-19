export type ThreatScenario =
  | "email_compromise"
  | "sim_swap"
  | "oauth_hijack";

export type ServiceId =
  | "email"
  | "instagram"
  | "whatsapp"
  | "bank"
  | "google"
  | "amazon";

export interface ServiceInput {
  id: ServiceId;
  label: string;
  recovery: string[];
  priority: number;
}

export interface SimulationRequest {
  email?: string;
  services: ServiceId[];
  scenario: ThreatScenario;
}

export interface CascadeNode {
  id: string;
  label: string;
  status: "root" | "high" | "medium" | "low";
  reason: string;
  order: number;
}

export interface SimulationResult {
  score: number;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  headline: string;
  rootCause: string;
  cascade: CascadeNode[];
  playbook: { title: string; description: string; actionUrl?: string }[];
  agentTrace: { name: string; status: "complete" | "fallback"; summary: string }[];
  privacyNote: string;
}
