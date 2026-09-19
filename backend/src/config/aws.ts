import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION || "us-east-1";
export const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";
export const useBedrock = (process.env.USE_BEDROCK || "true").toLowerCase() === "true";

export const bedrock = new BedrockRuntimeClient({ region });

export async function runBedrock(system: string, user: string): Promise<string> {
  const command = new ConverseCommand({
    modelId,
    system: [{ text: system }],
    messages: [{ role: "user", content: [{ text: user }] }],
    inferenceConfig: { maxTokens: 900, temperature: 0.2 }
  });
  const result = await bedrock.send(command);
  return result.output?.message?.content?.map((part) => part.text ?? "").join("").trim() || "";
}
