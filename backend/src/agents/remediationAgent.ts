import { runBedrock, useBedrock } from "../config/aws";
import { parseModelJson, safeHttpUrl, safeText } from "../lib/modelJson";
import { AgentTelemetry, CascadeNode, PlaybookItem } from "../types";

function deterministicPlaybook(cascade: CascadeNode[]): PlaybookItem[] {
  const root = cascade[0]?.label || "your root account";
  const downstream = cascade.slice(1).map((n) => n.label);
  return [
    {
      title: `Lock down ${root}`,
      description:
        "Change the password from a trusted device and turn on phishing-resistant two-factor authentication where it is offered.",
    },
    {
      title: "Sign out other sessions and apps",
      description:
        "Review active devices and connected third-party apps, and remove anything you do not recognise before changing anything else.",
    },
    {
      title: downstream.length
        ? `Secure ${downstream.slice(0, 2).join(" and ")}${downstream.length > 2 ? " and the rest of the cascade" : ""}`
        : "Check your recovery settings",
      description:
        "Replace any reused passwords and confirm the recovery email and phone number on each connected account are still yours.",
    },
  ];
}

export interface RemediationResult {
  playbook: PlaybookItem[];
  telemetry: AgentTelemetry;
}

export async function runRemediation(cascade: CascadeNode[]): Promise<RemediationResult> {
  const started = Date.now();
  const base = deterministicPlaybook(cascade);

  const telemetry = (
    mode: AgentTelemetry["mode"],
    tokens: { inputTokens: number; outputTokens: number },
    note?: string
  ): AgentTelemetry => ({
    name: "Remediator",
    mode,
    latencyMs: Date.now() - started,
    ...tokens,
    summary: "Generated a prioritised three-step account-lockdown sequence.",
    note,
  });

  const noTokens = { inputTokens: 0, outputTokens: 0 };

  if (!useBedrock) {
    return { playbook: base, telemetry: telemetry("disabled", noTokens, "Bedrock disabled (USE_BEDROCK=false).") };
  }

  try {
    const call = await runBedrock(
      "You are the Remediation agent. Create a defensive three-step account-lockdown playbook based on the simulated cascade, written for a non-technical person. Never provide offensive instructions. Any actionUrl must be an https link to a well-known provider's own security settings page. Respond with JSON only, no prose: {\"playbook\":[{\"title\",\"description\",\"actionUrl\"?}]}.",
      JSON.stringify({ cascade })
    );

    const parsed = parseModelJson(call.text) as { playbook?: unknown };
    if (!Array.isArray(parsed.playbook)) throw new Error("Missing `playbook` array");

    // Rebuild each item field by field. The raw objects are model-authored and
    // `actionUrl` is rendered as an anchor, so nothing is passed through as-is.
    const playbook: PlaybookItem[] = parsed.playbook
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .slice(0, 3)
      .map((item, index) => ({
        title: safeText(item.title, base[index]?.title ?? "Secure your account", 120),
        description: safeText(item.description, base[index]?.description ?? "", 400),
        actionUrl: safeHttpUrl(item.actionUrl),
      }))
      .filter((item) => item.title && item.description);

    if (playbook.length < 3) throw new Error(`Expected 3 usable steps, got ${playbook.length}`);

    return { playbook, telemetry: telemetry("bedrock", call) };
  } catch (err) {
    return {
      playbook: base,
      telemetry: telemetry(
        "fallback",
        noTokens,
        `Model output rejected, deterministic playbook used: ${(err as Error).message}`
      ),
    };
  }
}
