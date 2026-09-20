export type ServiceId = "email" | "instagram" | "whatsapp" | "bank" | "google" | "amazon";
export type ThreatScenario = "email_compromise" | "sim_swap" | "oauth_hijack";

/** Mirrors the backend `AgentTelemetry` union — how a stage produced its answer. */
export type AgentMode = "bedrock" | "live" | "fallback" | "disabled" | "error";

export type AgentTelemetry = {
  name: string;
  mode: AgentMode;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  summary: string;
  note?: string;
};

export type ThreatIntel = {
  checked: boolean;
  email: string;
  pwned: boolean;
  breachCount: number;
  topBreaches: string[];
  source: string;
  latencyMs: number;
  /** Set when `checked` is false: why the lookup could not produce a verdict. */
  unavailableReason?: string;
};

export type CascadeNode = {
  id: ServiceId;
  label: string;
  status: "root" | "high" | "medium" | "low";
  reason: string;
  order: number;
};

export type PlaybookItem = {
  title: string;
  description: string;
  actionUrl?: string;
};

export type SimulationResult = {
  score: number;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  headline: string;
  rootCause: string;
  rootId: ServiceId;
  cascade: CascadeNode[];
  playbook: PlaybookItem[];
  agentTrace: AgentTelemetry[];
  metrics: {
    selectedCount: number;
    /** How many accounts the cascade can actually reach; the rest are shown but inert. */
    reachableCount: number;
    hopCount: number;
    totalLatencyMs: number;
    bedrockEnabled: boolean;
    modelId: string;
    inputTokens: number;
    outputTokens: number;
  };
  privacyNote: string;
  threatIntel?: ThreatIntel;
};
