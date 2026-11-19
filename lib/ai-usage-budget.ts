import { prisma } from "@/lib/prisma";

export const AI_USAGE_RESERVATION_EVENT = "ai_application_usage";
export const AI_USAGE_COST_EVENT = "ai_application_cost";

export type AiUsageFeature = "homeowner_assistant" | "seo_drafting";

export function getGlobalAiDailyRequestLimit(): number | null {
  const configuredLimit = process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;
  if (!configuredLimit || !/^[1-9]\d*$/.test(configuredLimit)) return null;

  const limit = Number(configuredLimit);
  return Number.isSafeInteger(limit) ? limit : null;
}

export async function reserveGlobalAiRequest(
  feature: AiUsageFeature,
): Promise<boolean> {
  const limit = getGlobalAiDailyRequestLimit();
  if (limit === null) return false;

  const now = new Date();
  const utcDayStart = new Date(now);
  utcDayStart.setUTCHours(0, 0, 0, 0);

  try {
    return await prisma.$transaction(
      async (transaction) => {
        const used = await transaction.analytics.count({
          where: {
            eventName: AI_USAGE_RESERVATION_EVENT,
            timestamp: { gte: utcDayStart },
          },
        });
        if (used >= limit) return false;

        await transaction.analytics.create({
          data: {
            eventName: AI_USAGE_RESERVATION_EVENT,
            eventData: { feature },
            timestamp: now,
          },
        });
        return true;
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    const errorType =
      error instanceof Error && /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
        ? error.name
        : "Error";
    console.error(
      "[AI_USAGE_BUDGET] Reservation failed; inference denied",
      errorType,
    );
    return false;
  }
}

export async function recordGlobalAiUsage(
  feature: AiUsageFeature,
  model: string,
  response: unknown,
) {
  const usage = parseResponseUsage(response);
  if (!usage) return false;

  const rates = getAiCostRates(feature);
  const estimatedCostUsd = rates
    ? roundCost(
        ((usage.inputTokens - usage.cachedInputTokens) / 1_000_000) *
          rates.inputPerMillionUsd +
          (usage.cachedInputTokens / 1_000_000) *
            rates.cachedInputPerMillionUsd +
          (usage.outputTokens / 1_000_000) * rates.outputPerMillionUsd,
      )
    : null;

  try {
    await prisma.analytics.create({
      data: {
        eventName: AI_USAGE_COST_EVENT,
        eventData: {
          feature,
          model,
          inputTokens: usage.inputTokens,
          cachedInputTokens: usage.cachedInputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.inputTokens + usage.outputTokens,
          estimatedCostUsd,
          pricingConfigured: Boolean(rates),
        },
      },
    });
    return true;
  } catch (error) {
    const errorType =
      error instanceof Error && /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
        ? error.name
        : "Error";
    console.error("[AI_USAGE_BUDGET] Usage recording failed", errorType);
    return false;
  }
}

export function getAiCostRates(feature: AiUsageFeature) {
  const prefix = feature === "seo_drafting" ? "AI_SEO" : "AI_ASSISTANT";
  const inputPerMillionUsd = parseRate(
    process.env[`${prefix}_INPUT_COST_PER_MILLION_USD`],
  );
  const outputPerMillionUsd = parseRate(
    process.env[`${prefix}_OUTPUT_COST_PER_MILLION_USD`],
  );
  if (inputPerMillionUsd === null || outputPerMillionUsd === null) {
    return null;
  }
  const cachedInputPerMillionUsd =
    parseRate(process.env[`${prefix}_CACHED_INPUT_COST_PER_MILLION_USD`]) ??
    inputPerMillionUsd;
  return {
    inputPerMillionUsd,
    cachedInputPerMillionUsd,
    outputPerMillionUsd,
  };
}

function parseResponseUsage(response: unknown) {
  if (!response || typeof response !== "object" || !("usage" in response)) {
    return null;
  }
  const usage = (response as { usage?: unknown }).usage;
  if (!usage || typeof usage !== "object") return null;
  const values = usage as {
    input_tokens?: unknown;
    output_tokens?: unknown;
    input_tokens_details?: { cached_tokens?: unknown };
  };
  const inputTokens = parseTokenCount(values.input_tokens);
  const outputTokens = parseTokenCount(values.output_tokens);
  if (inputTokens === null || outputTokens === null) return null;
  const cachedInputTokens =
    parseTokenCount(values.input_tokens_details?.cached_tokens) ?? 0;
  return {
    inputTokens,
    outputTokens,
    cachedInputTokens: Math.min(cachedInputTokens, inputTokens),
  };
}

function parseTokenCount(value: unknown) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

function parseRate(value: string | undefined) {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function roundCost(value: number) {
  return Math.round(value * 100_000_000) / 100_000_000;
}
