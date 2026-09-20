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

export interface SimulationRequest {
  email?: string;
  services: ServiceId[];
  scenario: ThreatScenario;
  maxHops?: number;
}

export interface CascadeNode {
  id: string;
  label: string;
  status: "root" | "high" | "medium" | "low";
  reason: string;
  order: number;
}

export interface PlaybookItem {
  title: string;
  description: string;
  actionUrl?: string;
}

/** How a stage produced its answer. `bedrock` means a model call actually
 *  returned usable JSON; `live` means a non-model stage reached a real external
 *  service. Every other value means the deterministic engine served the result
 *  and the UI must not claim otherwise. */
export type AgentMode = "bedrock" | "live" | "fallback" | "disabled" | "error";

export interface AgentTelemetry {
  name: string;
  mode: AgentMode;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  summary: string;
  /** Present when a model call was attempted and rejected or failed. */
  note?: string;
}

export interface ThreatIntelResult {
  /** True only when a lookup completed and the verdict is trustworthy. */
  checked: boolean;
  email: string;
  pwned: boolean;
  breachCount: number;
  topBreaches: string[];
  source: string;
  latencyMs: number;
  /** Set when the lookup did not complete; UI shows "unavailable", not "clean". */
  unavailableReason?: string;
}

export interface SimulationResult {
  score: number;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  headline: string;
  rootCause: string;
  rootId: ServiceId;
  cascade: CascadeNode[];
  playbook: PlaybookItem[];
  threatIntel: ThreatIntelResult;
  agentTrace: AgentTelemetry[];
  metrics: {
    selectedCount: number;
    reachableCount: number;
    hopCount: number;
    /** Real wall-clock time for the whole pipeline. */
    totalLatencyMs: number;
    bedrockEnabled: boolean;
    modelId: string;
    /** Sum of real token usage across stages; 0 when no model call succeeded. */
    inputTokens: number;
    outputTokens: number;
  };
  privacyNote: string;
}
