import { ThreatIntelResult } from "../types";

const XPOSED_API = process.env.XPOSEDORNOT_API_URL || "https://api.xposedornot.com/v1/check-email";
const ENABLED = (process.env.THREAT_INTEL_ENABLED || "true").toLowerCase() === "true";
const TIMEOUT_MS = Number(process.env.THREAT_INTEL_TIMEOUT_MS || 3500);

function unavailable(email: string, reason: string, latencyMs: number): ThreatIntelResult {
  return {
    checked: false,
    email,
    pwned: false,
    breachCount: 0,
    topBreaches: [],
    source: "Breach lookup unavailable",
    latencyMs,
    unavailableReason: reason,
  };
}

/**
 * Look the address up in the free XposedOrNot public-breach index.
 *
 * This reports only what the upstream feed returns. It never synthesises a
 * breach verdict: if the lookup cannot complete we return `checked: false` so
 * the UI can say "not checked" rather than implying the address is clean.
 */
export async function checkEmailThreatIntel(email: string): Promise<ThreatIntelResult> {
  const start = Date.now();

  if (!ENABLED) return unavailable(email, "Breach lookup disabled by configuration.", 0);
  if (!email || !email.includes("@")) return unavailable(email, "No email address provided.", 0);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${XPOSED_API}/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "User-Agent": "DominoGuard-CyberSimulator/1.0",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const elapsed = Date.now() - start;

    // A non-200 means we do not know the answer. Saying "clean" here would be
    // a false all-clear, which is worse than admitting the lookup failed.
    if (!res.ok) {
      return unavailable(email, `Breach feed returned HTTP ${res.status}.`, elapsed);
    }

    const data = (await res.json().catch(() => null)) as
      | { breaches?: unknown; Error?: string }
      | null;

    if (!data) return unavailable(email, "Breach feed returned an unreadable response.", elapsed);

    // The feed answers 200 with {"Error":"Not found"} for an address it has no
    // records for. That is a genuine "no records" verdict, not a failure.
    if (typeof data.Error === "string") {
      if (/not found/i.test(data.Error)) {
        return {
          checked: true,
          email,
          pwned: false,
          breachCount: 0,
          topBreaches: [],
          source: "XposedOrNot public breach index",
          latencyMs: elapsed,
        };
      }
      return unavailable(email, `Breach feed error: ${data.Error}`, elapsed);
    }

    // Shape is {"breaches": [["Adobe", "LinkedIn", ...]]}.
    const outer = Array.isArray(data.breaches) ? data.breaches : null;
    if (!outer) return unavailable(email, "Breach feed returned an unexpected shape.", elapsed);

    const names = Array.isArray(outer[0]) ? (outer[0] as unknown[]) : [];
    const breaches = names.filter((n): n is string => typeof n === "string");

    return {
      checked: true,
      email,
      pwned: breaches.length > 0,
      breachCount: breaches.length,
      topBreaches: breaches.slice(0, 5),
      source: "XposedOrNot public breach index",
      latencyMs: elapsed,
    };
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? `Breach lookup timed out after ${TIMEOUT_MS}ms.`
        : "Breach feed unreachable (offline or blocked).";
    return unavailable(email, reason, Date.now() - start);
  } finally {
    clearTimeout(timer);
  }
}
