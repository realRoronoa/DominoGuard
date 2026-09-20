import { runBedrock, useBedrock } from "../config/aws";
import { dependenciesFor, isServiceId, serviceLabels } from "../config/services";
import { parseModelJson } from "../lib/modelJson";
import { AgentTelemetry, ServiceId, ThreatScenario } from "../types";

export interface MapperResult {
  root: ServiceId;
  ordered: ServiceId[];
  labels: Record<ServiceId, string>;
  telemetry: AgentTelemetry;
}

/**
 * Breadth-first walk from the scenario's entry point through the recovery
 * dependencies, so `ordered` reflects reachability rather than input order.
 */
export function buildDeterministicGraph(services: ServiceId[], scenario: ThreatScenario) {
  const selected = new Set(services);
  const edges = dependenciesFor(scenario);

  const root: ServiceId =
    scenario === "sim_swap"
      ? selected.has("whatsapp")
        ? "whatsapp"
        : "email"
      : scenario === "oauth_hijack"
      ? selected.has("google")
        ? "google"
        : selected.has("instagram")
        ? "instagram"
        : "email"
      : "email";

  // The chosen root may not be among the user's selected services; only walk
  // from it if it is, otherwise start from the first selected service.
  const start: ServiceId = selected.has(root) ? root : services[0];

  const ordered: ServiceId[] = [start];
  const queue: ServiceId[] = [start];
  while (queue.length) {
    const current = queue.shift()!;
    for (const candidate of services) {
      if (!ordered.includes(candidate) && (edges[candidate] || []).includes(current)) {
        ordered.push(candidate);
        queue.push(candidate);
      }
    }
  }

  // Selected services with no path from the root still belong in the graph,
  // listed after the reachable set.
  const reachableCount = ordered.length;
  for (const candidate of services) if (!ordered.includes(candidate)) ordered.push(candidate);

  return { root: start, ordered, reachableCount, labels: serviceLabels };
}

export async function runMapper(
  services: ServiceId[],
  scenario: ThreatScenario
): Promise<MapperResult & { reachableCount: number }> {
  const started = Date.now();
  const fallback = buildDeterministicGraph(services, scenario);

  const base = {
    root: fallback.root,
    ordered: fallback.ordered,
    reachableCount: fallback.reachableCount,
    labels: serviceLabels,
  };

  const telemetry = (
    mode: AgentTelemetry["mode"],
    tokens: { inputTokens: number; outputTokens: number },
    note?: string
  ): AgentTelemetry => ({
    name: "Mapper",
    mode,
    latencyMs: Date.now() - started,
    ...tokens,
    summary: `Built a dependency graph across ${services.length} selected account${
      services.length === 1 ? "" : "s"
    }, rooted at ${serviceLabels[fallback.root]}.`,
    note,
  });

  const noTokens = { inputTokens: 0, outputTokens: 0 };

  if (!useBedrock) {
    return { ...base, telemetry: telemetry("disabled", noTokens, "Bedrock disabled (USE_BEDROCK=false).") };
  }

  try {
    const call = await runBedrock(
      "You are the Mapper agent for a defensive consumer cybersecurity simulator. Only reason about the user-selected services. Never claim a real provider can be bypassed. Respond with JSON only, no prose: {\"ordered\":[serviceId,...]} listing the user's services from most to least directly reachable.",
      JSON.stringify({ services, scenario, knownDependencies: dependenciesFor(scenario) })
    );

    const parsed = parseModelJson(call.text) as { ordered?: unknown };
    if (!Array.isArray(parsed.ordered)) throw new Error("Missing `ordered` array");

    // Keep only ids the user actually selected, and de-duplicate.
    const seen = new Set<ServiceId>();
    const ordered = parsed.ordered.filter((id): id is ServiceId => {
      if (!isServiceId(id) || !services.includes(id) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    // A model answer that drops services would silently shrink the cascade, so
    // append anything it omitted rather than trusting the list wholesale.
    for (const id of services) if (!seen.has(id)) ordered.push(id);
    if (!ordered.length) throw new Error("No valid service ids returned");

    return {
      root: ordered[0],
      ordered,
      reachableCount: fallback.reachableCount,
      labels: serviceLabels,
      telemetry: telemetry("bedrock", call),
    };
  } catch (err) {
    return {
      ...base,
      telemetry: telemetry(
        "fallback",
        noTokens,
        `Model output rejected, deterministic graph used: ${(err as Error).message}`
      ),
    };
  }
}
