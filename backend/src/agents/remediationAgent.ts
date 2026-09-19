import { runBedrock, useBedrock } from "../config/aws";
import { CascadeNode } from "../types";

const fallback = (cascade: CascadeNode[]) => {
  const root = cascade[0]?.label || "root account";
  return [
    { title: `Lock down ${root}`, description: "Change the password from a trusted device and enable phishing-resistant MFA where available.", actionUrl: "https://myaccount.google.com/security" },
    { title: "Revoke active sessions", description: "Sign out unknown devices and remove suspicious connected applications before changing anything else." },
    { title: "Protect the downstream accounts", description: "Change reused passwords and verify recovery email/phone settings on the accounts shown in the cascade." }
  ];
};

export async function runRemediation(cascade: CascadeNode[]) {
  const base = fallback(cascade);
  if (!useBedrock) return { playbook: base, mode: "fallback" as const };
  try {
    const response = await runBedrock(
      "You are the Remediation agent. Create a defensive three-step account-lockdown playbook based on the simulated cascade. Be specific but never provide offensive instructions. Return JSON {playbook:[{title,description,actionUrl?}]}.",
      JSON.stringify({ cascade })
    );
    const parsed = JSON.parse(response);
    if (!Array.isArray(parsed.playbook) || parsed.playbook.length < 3) throw new Error("Invalid Remediation JSON");
    return { playbook: parsed.playbook.slice(0, 3), mode: "bedrock" as const };
  } catch {
    return { playbook: base, mode: "fallback" as const };
  }
}
