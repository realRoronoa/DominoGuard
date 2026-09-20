import { runBedrock, useBedrock } from "../config/aws";
import { serviceLabels, serviceReasons } from "../config/services";
import { parseModelJson, safeText } from "../lib/modelJson";
import { AgentTelemetry, CascadeNode, ServiceId, ThreatScenario } from "../types";

const VALID_STATUS = new Set<CascadeNode["status"]>(["root", "high", "medium", "low"]);

/** Entry-point difficulty per scenario: how much risk the starting foothold carries alone. */
const SCENARIO_BASE: Record<ThreatScenario, number> = {
  email_compromise: 40,
  sim_swap: 38,
  oauth_hijack: 36,
};

/** What losing each account is worth, once it is actually reachable. */
const IMPACT: Record<ServiceId, number> = {
  bank: 14,
  email: 12,
  google: 9,
  whatsapp: 7,
  amazon: 5,
  instagram: 4,
};

/**
 * Score the blast radius from the accounts the cascade can actually reach.
 *
 * Only reachable accounts contribute: selecting an account the scenario cannot
 * touch should not raise the score. Weights are tuned so a single account lands
 * in LOW and a fully-connected six-account footprint lands in the high 80s /
 * low 90s, leaving headroom rather than pinning every scenario to the cap.
 */
function scoreFor(ordered: ServiceId[], reachableCount: number, scenario: ThreatScenario): number {
  const reachable = ordered.slice(0, Math.max(1, reachableCount));
  const downstream = reachable.slice(1);
  const impact = downstream.reduce((sum, id) => sum + (IMPACT[id] ?? 4), 0);
  const breadth = downstream.length * 2;
  return Math.min(97, Math.max(12, SCENARIO_BASE[scenario] + impact + breadth));
}

export interface RedTeamResult {
  score: number;
  cascade: CascadeNode[];
  telemetry: AgentTelemetry;
}

export async function runRedTeam(
  ordered: ServiceId[],
  reachableCount: number,
  scenario: ThreatScenario
): Promise<RedTeamResult> {
  const started = Date.now();
  const fallbackScore = scoreFor(ordered, reachableCount, scenario);

  const fallbackCascade: CascadeNode[] = ordered.map((id, index) => {
    const reachable = index < reachableCount;
    return {
      id,
      label: serviceLabels[id],
      status: index === 0 ? "root" : !reachable ? "low" : (IMPACT[id] ?? 0) >= 9 ? "high" : "medium",
      reason: reachable
        ? serviceReasons[id]
        : `Not reachable from the starting point in this scenario — it shares no recovery path with the accounts above.`,
      order: index,
    };
  });

  const telemetry = (
    mode: AgentTelemetry["mode"],
    tokens: { inputTokens: number; outputTokens: number },
    note?: string
  ): AgentTelemetry => ({
    name: "Red-Team Simulator",
    mode,
    latencyMs: Date.now() - started,
    ...tokens,
    summary: `Simulated a ${ordered.length}-hop cascade for the ${scenario.replace(/_/g, " ")} scenario. No attack was executed.`,
    note,
  });

  const noTokens = { inputTokens: 0, outputTokens: 0 };

  if (!useBedrock) {
    return {
      score: fallbackScore,
      cascade: fallbackCascade,
      telemetry: telemetry("disabled", noTokens, "Bedrock disabled (USE_BEDROCK=false)."),
    };
  }

  try {
    const call = await runBedrock(
      "You are the Red-Team Simulator agent in a defensive cyber-risk product. Simulate only. Do not provide exploit instructions, credentials, or bypass steps, and never assert that a breach is verified. Respond with JSON only, no prose: {\"score\":0-100,\"cascade\":[{\"id\",\"status\":\"root\"|\"high\"|\"medium\"|\"low\",\"reason\"}]}.",
      JSON.stringify({ ordered, scenario, deterministicScore: fallbackScore, deterministicCascade: fallbackCascade })
    );

    const parsed = parseModelJson(call.text) as { score?: unknown; cascade?: unknown };
    if (typeof parsed.score !== "number" || !Number.isFinite(parsed.score)) {
      throw new Error("Missing numeric `score`");
    }
    if (!Array.isArray(parsed.cascade)) throw new Error("Missing `cascade` array");

    const byId = new Map<string, { status?: unknown; reason?: unknown }>();
    for (const entry of parsed.cascade) {
      if (entry && typeof entry === "object" && typeof (entry as { id?: unknown }).id === "string") {
        byId.set((entry as { id: string }).id, entry as { status?: unknown; reason?: unknown });
      }
    }

    // Merge only the two fields the model is allowed to influence, and keep our
    // own id/label/order so model output cannot reshape or reorder the graph.
    const cascade: CascadeNode[] = fallbackCascade.map((node) => {
      const proposed = byId.get(node.id);
      if (!proposed) return node;

      const status = proposed.status;
      return {
        ...node,
        status:
          node.order === 0
            ? "root"
            : typeof status === "string" && VALID_STATUS.has(status as CascadeNode["status"])
            ? (status as CascadeNode["status"])
            : node.status,
        reason: safeText(proposed.reason, node.reason),
      };
    });

    return {
      score: Math.min(100, Math.max(0, Math.round(parsed.score))),
      cascade,
      telemetry: telemetry("bedrock", call),
    };
  } catch (err) {
    return {
      score: fallbackScore,
      cascade: fallbackCascade,
      telemetry: telemetry(
        "fallback",
        noTokens,
        `Model output rejected, deterministic cascade used: ${(err as Error).message}`
      ),
    };
  }
}
