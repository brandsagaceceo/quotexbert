import OpenAI from "openai";

export const OPENAI_MODELS = {
  quickEstimator: "gpt-4o",
  homeownerAssistant: "gpt-6-astra",
  seoDrafting: "gpt-4o-mini",
  costEffective: "gpt-4o-mini",
  visualizer: "dall-e-3",
} as const;

let client: OpenAI | null | undefined;

export function getOpenAIClient(): OpenAI | null {
  if (client !== undefined) return client;

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  client =
    apiKey && !apiKey.toLowerCase().includes("demo")
      ? new OpenAI({ apiKey, timeout: 60_000 })
      : null;

  return client;
}

export function isAiFeatureEnabled(name: "QUOTEXBERT_AI_ENABLED" | "SEO_DRAFT_AUTOMATION_ENABLED") {
  return process.env[name] === "true";
}
