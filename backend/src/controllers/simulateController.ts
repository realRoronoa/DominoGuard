import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { modelId, useBedrock } from "../config/aws";
import { SERVICE_IDS } from "../config/services";
import { runMapper } from "../agents/graphAgent";
import { runRedTeam } from "../agents/redTeamAgent";
import { runRemediation } from "../agents/remediationAgent";
import { checkEmailThreatIntel } from "../services/threatIntelService";
import { AgentTelemetry, SimulationResult } from "../types";

const schema = z.object({
  email: z.union([z.string().email(), z.literal("")]).optional(),
  services: z
    .array(z.enum(["email", "instagram", "whatsapp", "bank", "google", "amazon"]))
    .min(1, "Select at least one account.")
    .max(SERVICE_IDS.length),
  scenario: z.enum(["email_compromise", "sim_swap", "oauth_hijack"]),
  maxHops: z.number().int().min(1).max(SERVICE_IDS.length).optional(),
});

function severityFor(score: number): SimulationResult["severity"] {
  if (score >= 80) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 45) return "MODERATE";
  return "LOW";
}

function headlineFor(severity: SimulationResult["severity"], hops: number): string {
  if (severity === "CRITICAL") {
    return `One compromised account can reach ${hops - 1} more in this simulation.`;
  }
  if (severity === "HIGH") {
    return "Several of your accounts share a recovery path worth separating.";
  }
  if (severity === "MODERATE") {
    return "Your accounts are partly connected — a few changes would reduce the spread.";
  }
  return "Your selected accounts show limited onward reach in this simulation.";
}

export async function simulate(req: Request, res: Response) {
  const start = Date.now();

  try {
    const input = schema.parse(req.body);
    const email = input.email ?? "";

    // The graph walk and the breach lookup are independent; overlap them so the
    // third-party call does not add to the critical path.
    const [mapper, threatIntel] = await Promise.all([
      runMapper(input.services, input.scenario),
      checkEmailThreatIntel(email),
    ]);

    const ordered = input.maxHops ? mapper.ordered.slice(0, input.maxHops) : mapper.ordered;
    // Trimming the cascade can also trim reachable accounts off the end.
    const reachableCount = Math.min(mapper.reachableCount, ordered.length);

    const red = await runRedTeam(ordered, reachableCount, input.scenario);
    // The playbook should name the accounts actually in the blast radius, so
    // only the reachable slice is handed to the remediator.
    const remediation = await runRemediation(red.cascade.slice(0, reachableCount));

    // Public breach exposure nudges the score, capped so a long historical tail
    // cannot dominate the structural risk the simulation actually measured.
    const breachAdjustment =
      threatIntel.checked && threatIntel.pwned ? Math.min(6, threatIntel.breachCount) : 0;
    const score = Math.min(100, red.score + breachAdjustment);
    const severity = severityFor(score);

    const intelTelemetry: AgentTelemetry = {
      name: "OSINT Breach Lookup",
      // This stage is an HTTP lookup, not a model call — it must never be
      // reported as "bedrock" or the badge would credit the wrong system.
      mode: threatIntel.checked ? "live" : "disabled",
      latencyMs: threatIntel.latencyMs,
      inputTokens: 0,
      outputTokens: 0,
      summary: !threatIntel.checked
        ? threatIntel.unavailableReason || "Breach lookup did not run."
        : threatIntel.pwned
        ? `Found ${threatIntel.breachCount} public breach record${
            threatIntel.breachCount === 1 ? "" : "s"
          } for this address (${threatIntel.topBreaches.join(", ")}).`
        : "No public breach records found for this address.",
      note: threatIntel.checked
        ? `Source: ${threatIntel.source}. Historical disclosures only — not proof of current compromise.`
        : undefined,
    };

    // Only stages that genuinely reached the model contribute token counts.
    const agentTrace = [intelTelemetry, mapper.telemetry, red.telemetry, remediation.telemetry];
    const inputTokens = agentTrace.reduce((sum, a) => sum + a.inputTokens, 0);
    const outputTokens = agentTrace.reduce((sum, a) => sum + a.outputTokens, 0);

    const result: SimulationResult = {
      score,
      severity,
      headline: headlineFor(severity, reachableCount),
      rootCause:
        input.scenario === "sim_swap"
          ? "Phone / messaging trust is the starting point in this simulation."
          : input.scenario === "oauth_hijack"
          ? "A connected app session is the starting point in this simulation."
          : "Your primary email is the recovery hub in this simulation.",
      rootId: mapper.root,
      cascade: red.cascade,
      playbook: remediation.playbook,
      threatIntel,
      agentTrace,
      metrics: {
        selectedCount: input.services.length,
        reachableCount,
        hopCount: red.cascade.length,
        totalLatencyMs: Date.now() - start,
        bedrockEnabled: useBedrock,
        modelId,
        inputTokens,
        outputTokens,
      },
      privacyNote:
        "No passwords, tokens, or account access are requested. This simulation uses only the accounts you selected.",
    };

    console.log(
      `[simulate] ${result.metrics.totalLatencyMs}ms | score=${score} (${severity}) | hops=${result.metrics.hopCount} | ` +
        `intel=${threatIntel.checked ? `${threatIntel.breachCount} breaches` : "unavailable"} | ` +
        `modes=${agentTrace.map((a) => `${a.name}:${a.mode}`).join(",")}`
    );

    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.errors.map((e) => e.message).join(", ");
      console.warn(`[simulate] validation error: ${message}`);
      return res.status(400).json({ error: `Invalid request: ${message}` });
    }
    console.error(`[simulate] failed after ${Date.now() - start}ms:`, err);
    res.status(500).json({ error: "Simulation failed. Please try again." });
  }
}
