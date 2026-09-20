import { ServiceId, ThreatScenario } from "../types";

/** Single source of truth for the consumer services DominoGuard can model. */
export const SERVICE_IDS: ServiceId[] = ["email", "instagram", "whatsapp", "bank", "google", "amazon"];

export const serviceLabels: Record<ServiceId, string> = {
  email: "Primary Email",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  bank: "Banking",
  google: "Google Drive / Photos",
  amazon: "Amazon",
};

/**
 * Base consumer recovery model: the primary email inbox is the reset hub for
 * everything else. Values are the accounts a service can be reached *from*.
 */
export const dependencies: Record<ServiceId, ServiceId[]> = {
  email: [],
  instagram: ["email"],
  whatsapp: ["email"],
  bank: ["email"],
  google: ["email"],
  amazon: ["email"],
};

/**
 * Scenario-specific edges layered on top of the base model.
 *
 * Without these, a SIM swap or a stolen OAuth session has nothing downstream —
 * nothing in the base model is reached *from* the phone or a Google session —
 * so both scenarios would collapse to a single node.
 */
const scenarioEdges: Record<ThreatScenario, Partial<Record<ServiceId, ServiceId[]>>> = {
  email_compromise: {},
  sim_swap: {
    // Control of the number means SMS password resets and SMS one-time codes.
    email: ["whatsapp"],
    bank: ["whatsapp"],
  },
  oauth_hijack: {
    // A live Google session typically covers the Gmail inbox and Drive, and
    // any account that uses "Sign in with Google".
    email: ["google"],
    instagram: ["google"],
    amazon: ["google"],
  },
};

/** Prerequisite map for a scenario: which accounts each service is reachable from. */
export function dependenciesFor(scenario: ThreatScenario): Record<ServiceId, ServiceId[]> {
  const extra = scenarioEdges[scenario];
  const merged = {} as Record<ServiceId, ServiceId[]>;
  for (const id of SERVICE_IDS) {
    merged[id] = [...dependencies[id], ...(extra[id] ?? [])];
  }
  return merged;
}

export const serviceReasons: Record<ServiceId, string> = {
  email:
    "Recovery hub: control of this account can expose reset and notification paths for connected services.",
  instagram:
    "A connected social account can amplify identity exposure and social-engineering risk.",
  whatsapp:
    "A messaging account can expose trusted contacts and increase impersonation risk.",
  bank:
    "Financial accounts are high-impact targets, but this simulation does not assume email alone bypasses bank controls.",
  google:
    "Cloud files and photos can contain identity and recovery information useful to an attacker.",
  amazon:
    "Shopping accounts can expose saved addresses, orders, and payment-related metadata.",
};

export function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && (SERVICE_IDS as string[]).includes(value);
}
