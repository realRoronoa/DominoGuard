/**
 * Foundation models frequently wrap JSON in markdown fences or add a short
 * preamble. Strip that before parsing so a well-formed answer is not thrown
 * away as "invalid" and silently downgraded to the deterministic fallback.
 */
export function parseModelJson(raw: string): unknown {
  const text = raw.trim();
  if (!text) throw new Error("Empty model response");

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text;

  try {
    return JSON.parse(candidate);
  } catch {
    // Fall back to the outermost {...} or [...] span in the response.
    const start = candidate.search(/[{[]/);
    const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
    if (start === -1 || end <= start) throw new Error("No JSON found in model response");
    return JSON.parse(candidate.slice(start, end + 1));
  }
}

/**
 * Only allow http(s) links to reach the UI. Model-authored `actionUrl` values
 * are rendered as anchors, so an unvalidated `javascript:` or `data:` URL would
 * be a script-injection vector.
 */
export function safeHttpUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Collapse untrusted model text into a bounded, single-line string. */
export function safeText(value: unknown, fallback: string, maxLength = 400): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
}
