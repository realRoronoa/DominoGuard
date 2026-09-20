import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION || "us-east-1";
export const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";
export const useBedrock = (process.env.USE_BEDROCK || "true").toLowerCase() === "true";

/** Per-call ceiling. Three agents run per request, so keep this well under the
 *  platform request timeout to guarantee the deterministic fallback can serve. */
const timeoutMs = Number(process.env.BEDROCK_TIMEOUT_MS || 8000);

export const bedrock = new BedrockRuntimeClient({ region, maxAttempts: 2 });

export interface BedrockCall {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export async function runBedrock(system: string, user: string): Promise<BedrockCall> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await bedrock.send(
      new ConverseCommand({
        modelId,
        system: [{ text: system }],
        messages: [{ role: "user", content: [{ text: user }] }],
        inferenceConfig: { maxTokens: 900, temperature: 0.2 },
      }),
      { abortSignal: controller.signal }
    );

    return {
      text: result.output?.message?.content?.map((part) => part.text ?? "").join("").trim() || "",
      inputTokens: result.usage?.inputTokens ?? 0,
      outputTokens: result.usage?.outputTokens ?? 0,
    };
  } finally {
    clearTimeout(timer);
  }
}
