import { runBedrock, useBedrock } from "../config/aws";
import { CascadeNode, ServiceId, ThreatScenario } from "../types";

const reasons: Record<ServiceId, string> = {
  email: "Recovery hub: control of this account can expose reset and notification paths for connected services.",
  instagram: "A connected social account can amplify identity exposure and social-engineering risk.",
  whatsapp: "A messaging account can expose trusted contacts and increase impersonation risk.",
  bank: "Financial accounts are high-impact targets, but this simulation does not assume email alone bypasses bank controls.",
  google: "Cloud files and photos can contain identity and recovery information useful to an attacker.",
  amazon: "Shopping accounts can expose saved addresses, orders, and payment-related metadata."
};

function scoreFor(ordered: ServiceId[], scenario: ThreatScenario): number {
  const base = scenario === "email_compromise" ? 54 : scenario === "sim_swap" ? 62 : 58;
  const sensitive = ordered.filter((s) => ["bank", "google", "whatsapp"].includes(s)).length * 9;
  const breadth = Math.max(0, ordered.length - 2) * 6;
  return Math.min(97, Math.max(18, base + sensitive + breadth));
}

export async function runRedTeam(ordered: ServiceId[], scenario: ThreatScenario) {
  const fallbackScore = scoreFor(ordered, scenario);
  const fallbackCascade: CascadeNode[] = ordered.map((id, index) => ({
    id,
    label: id === "bank" ? "Banking" : id === "google" ? "Google Drive / Photos" : id === "email" ? "Primary Email" : id === "instagram" ? "Instagram" : id === "whatsapp" ? "WhatsApp" : "Amazon",
    status: index === 0 ? "root" : fallbackScore >= 75 ? "high" : "medium",
    reason: reasons[id],
    order: index
  }));

  if (!useBedrock) return { score: fallbackScore, cascade: fallbackCascade, mode: "fallback" as const };
  try {
    const response = await runBedrock(
      "You are the Red-Team Simulator agent in a defensive cyber-risk product. Simulate only. Do not provide exploit instructions, credentials, bypass steps, or unsupported claims. Return JSON with score 0-100 and cascade [{id,label,status,reason,order}].",
      JSON.stringify({ ordered, scenario, deterministicScore: fallbackScore, deterministicCascade: fallbackCascade })
    );
    const parsed = JSON.parse(response);
    if (typeof parsed.score !== "number" || !Array.isArray(parsed.cascade)) throw new Error("Invalid Red-Team JSON");
    return { score: Math.min(100, Math.max(0, Math.round(parsed.score))), cascade: fallbackCascade.map((node) => ({ ...node, ...(parsed.cascade.find((x: { id?: string }) => x.id === node.id) || {}) })), mode: "bedrock" as const };
  } catch {
    return { score: fallbackScore, cascade: fallbackCascade, mode: "fallback" as const };
  }
}
