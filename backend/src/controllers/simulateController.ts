import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { runMapper } from "../agents/graphAgent";
import { runRedTeam } from "../agents/redTeamAgent";
import { runRemediation } from "../agents/remediationAgent";

const schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  services: z.array(z.enum(["email", "instagram", "whatsapp", "bank", "google", "amazon"])).min(1, "Select at least one service."),
  scenario: z.enum(["email_compromise", "sim_swap", "oauth_hijack"]),
});

function severity(score: number) {
  if (score >= 80) return "CRITICAL" as const;
  if (score >= 65) return "HIGH" as const;
  if (score >= 45) return "MODERATE" as const;
  return "LOW" as const;
}

export async function simulate(req: Request, res: Response) {
  const start = Date.now();
  try {
    const input = schema.parse(req.body);
    console.log(`[simulate] ${new Date().toISOString()} | scenario=${input.scenario} | services=[${input.services.join(",")}]`);

    const mapper = await runMapper(input.services, input.scenario);
    const red = await runRedTeam(mapper.graph.ordered, input.scenario);
    const remediation = await runRemediation(red.cascade);
    const sev = severity(red.score);

    console.log(`[simulate] done in ${Date.now() - start}ms | score=${red.score} | severity=${sev} | mapper=${mapper.mode} | redteam=${red.mode} | remediation=${remediation.mode}`);

    res.json({
      score: red.score,
      severity: sev,
      headline:
        sev === "CRITICAL"
          ? "One compromised hub can expose several downstream paths."
          : "Your account graph contains connected recovery paths worth hardening.",
      rootCause:
        input.scenario === "sim_swap"
          ? "Phone / messaging trust is the initial weak point in this simulation."
          : input.scenario === "oauth_hijack"
          ? "A connected session is the initial weak point in this simulation."
          : "Primary email is the initial recovery hub in this simulation.",
      cascade: red.cascade,
      playbook: remediation.playbook,
      agentTrace: [
        { name: "Mapper", status: mapper.mode === "bedrock" ? "complete" : "fallback", summary: "Built a dependency graph from your selected services." },
        { name: "Red-Team Simulator", status: red.mode === "bedrock" ? "complete" : "fallback", summary: "Simulated a defensive attack cascade without executing an attack." },
        { name: "Remediator", status: remediation.mode === "bedrock" ? "complete" : "fallback", summary: "Generated a prioritized account-lockdown sequence." },
      ],
      privacyNote:
        "Demo-safe design: no passwords, tokens, or account access are requested, and this simulation uses only the services you selected.",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.errors.map((e) => e.message).join(", ");
      console.warn(`[simulate] validation error: ${message}`);
      return res.status(400).json({ error: `Invalid request: ${message}` });
    }
    console.error(`[simulate] unexpected error after ${Date.now() - start}ms:`, err);
    res.status(500).json({ error: "Simulation failed. Please try again." });
  }
}
