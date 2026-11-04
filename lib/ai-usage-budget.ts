import { prisma } from "@/lib/prisma";

const DAILY_USAGE_EVENT = "ai_application_usage";

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
            eventName: DAILY_USAGE_EVENT,
            timestamp: { gte: utcDayStart },
          },
        });
        if (used >= limit) return false;

        await transaction.analytics.create({
          data: {
            eventName: DAILY_USAGE_EVENT,
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
    console.error("[AI_USAGE_BUDGET] Reservation failed; inference denied", errorType);
    return false;
  }
}
