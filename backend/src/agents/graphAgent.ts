import { runBedrock, useBedrock } from "../config/aws";
import { ServiceId, ThreatScenario } from "../types";

const serviceLabels: Record<ServiceId, string> = {
  email: "Primary Email",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  bank: "Banking",
  google: "Google Drive / Photos",
  amazon: "Amazon"
};

const dependencies: Record<ServiceId, ServiceId[]> = {
  email: [],
  instagram: ["email"],
  whatsapp: ["email"],
  bank: ["email"],
  google: ["email"],
  amazon: ["email"]
};

export function buildDeterministicGraph(services: ServiceId[], scenario: ThreatScenario) {
  const selected = new Set(services);
  const root: ServiceId = scenario === "sim_swap" ? (selected.has("whatsapp") ? "whatsapp" : "email") : scenario === "oauth_hijack" ? (selected.has("google") ? "google" : "instagram") : "email";
  const ordered: ServiceId[] = [root];
  const queue = [root];
  while (queue.length) {
    const current = queue.shift()!;
    for (const candidate of services) {
      if (!ordered.includes(candidate) && (dependencies[candidate] || []).includes(current)) {
        ordered.push(candidate);
        queue.push(candidate);
      }
    }
  }
  for (const candidate of services) if (!ordered.includes(candidate)) ordered.push(candidate);
  return { root, ordered, labels: serviceLabels };
}

export async function runMapper(services: ServiceId[], scenario: ThreatScenario) {
  const fallback = buildDeterministicGraph(services, scenario);
  if (!useBedrock) return { graph: fallback, mode: "fallback" as const };
  try {
    const response = await runBedrock(
      "You are the Mapper agent for a defensive consumer cybersecurity simulator. Only reason about the user-selected services. Never claim a real provider can be bypassed. Return compact JSON with ordered service ids and dependency notes.",
      JSON.stringify({ services, scenario, knownDependencies: dependencies })
    );
    const parsed = JSON.parse(response);
    if (!Array.isArray(parsed.ordered)) throw new Error("Invalid Mapper JSON");
    return { graph: { ...fallback, ordered: parsed.ordered.filter((id: unknown): id is ServiceId => services.includes(id as ServiceId)) }, mode: "bedrock" as const };
  } catch {
    return { graph: fallback, mode: "fallback" as const };
  }
}
