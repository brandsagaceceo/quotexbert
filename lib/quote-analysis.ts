/**
 * Quote Analysis helper — "Is this quote fair?"
 *
 * Used by: POST /api/quotes/[id]/analyze
 *
 * Architecture:
 * - Fetches the Quote, its items, the linked Lead (job), and any existing
 *   AIEstimate for cross-reference.
 * - Calls gpt-4o with structured JSON mode so the response shape is guaranteed.
 * - Degrades gracefully: if OPENAI_API_KEY is absent, returns a fallback built
 *   from the AIEstimate min/max range if available, or a neutral "unable to
 *   analyze" response otherwise.
 * - All DB access is guarded with try/catch; failures produce degraded but
 *   safe output.
 */

import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ─── Public types ────────────────────────────────────────────────────────────

export type QuoteVerdict = "low" | "fair" | "high" | "unknown";

export interface QuoteAnalysisResult {
  fairRangeLow: number;
  fairRangeHigh: number;
  verdict: QuoteVerdict;
  explanation: string;
  suggestions: string[];
  /** True when analysis was built from real AI, false when degraded/fallback */
  aiGenerated: boolean;
}

// ─── Internals ───────────────────────────────────────────────────────────────

interface QuoteForAnalysis {
  id: string;
  title: string;
  scope: string;
  description: string;
  totalCost: number;
  laborCost: number;
  materialCost: number;
  version: number;
  items: Array<{
    category: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  job: {
    title: string;
    description: string;
    budget: string;
    category: string;
    zipCode: string;
  } | null;
  aiEstimate: {
    minCost: number;
    maxCost: number;
    reasoning: string | null;
  } | null;
}

async function loadQuoteData(quoteId: string): Promise<QuoteForAnalysis | null> {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: {
          select: {
            category: true,
            description: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            category: true,
            zipCode: true,
            aiEstimate: {
              select: {
                minCost: true,
                maxCost: true,
                reasoning: true,
              },
            },
          },
        },
      },
    });

    if (!quote) return null;

    return {
      id: quote.id,
      title: quote.title,
      scope: quote.scope,
      description: quote.description,
      totalCost: quote.totalCost,
      laborCost: quote.laborCost,
      materialCost: quote.materialCost,
      version: quote.version ?? 1,
      items: quote.items,
      job: quote.job
        ? {
            title: quote.job.title,
            description: quote.job.description,
            budget: quote.job.budget,
            category: quote.job.category,
            zipCode: quote.job.zipCode,
          }
        : null,
      aiEstimate: quote.job?.aiEstimate ?? null,
    };
  } catch (e) {
    console.error("[quote-analysis] loadQuoteData failed:", e);
    return null;
  }
}

function buildPrompt(q: QuoteForAnalysis): string {
  const itemLines = q.items
    .map(
      (i) =>
        `  - [${i.category}] ${i.description}: ${i.quantity} × $${i.unitPrice} = $${i.totalPrice}`
    )
    .join("\n");

  const estimateBlock = q.aiEstimate
    ? `ORIGINAL AI ESTIMATE FOR THIS JOB:
  Range: $${q.aiEstimate.minCost.toLocaleString()} – $${q.aiEstimate.maxCost.toLocaleString()}
  Reasoning: ${q.aiEstimate.reasoning ?? "N/A"}`
    : "No prior AI estimate available for this job.";

  const budgetBlock = q.job
    ? `Job budget (homeowner's stated budget): ${q.job.budget}
Job category: ${q.job.category}
Location (zip): ${q.job.zipCode}`
    : "Job details unavailable.";

  return `You are an expert home renovation cost analyst.
A homeowner received the following contractor quote and wants to know if it is fair.

QUOTE DETAILS (v${q.version}):
Title: ${q.title}
Total: $${q.totalCost.toLocaleString()}
Labor: $${q.laborCost.toLocaleString()}  |  Materials: $${q.materialCost.toLocaleString()}

Scope of work:
${q.scope}

Line items:
${itemLines || "  (no itemised breakdown provided)"}

${budgetBlock}

${estimateBlock}

Based on this information, return a JSON object ONLY (no markdown, no wrapping text) with this exact shape:
{
  "fairRangeLow": number,
  "fairRangeHigh": number,
  "verdict": "low" | "fair" | "high",
  "explanation": "2-3 sentence plain-English explanation of whether this quote is competitive",
  "suggestions": ["up to 3 short actionable suggestions for the homeowner"]
}

Rules:
- verdict "low" means the quote is meaningfully below fair market (potential red flags).
- verdict "fair" means it is within a reasonable market range.
- verdict "high" means it is noticeably above market.
- fairRangeLow and fairRangeHigh represent your estimated fair market range for this scope in this region.
- Be honest but constructive. Do not scaremonger.`;
}

const EMPTY_ANALYSIS: QuoteAnalysisResult = {
  fairRangeLow: 0,
  fairRangeHigh: 0,
  verdict: "unknown",
  explanation:
    "We couldn't analyze this quote right now. Consider getting 2–3 competing quotes to benchmark the price.",
  suggestions: [
    "Request an itemized breakdown from the contractor.",
    "Get at least one more quote to compare.",
    "Check local contractor review sites for typical pricing in your area.",
  ],
  aiGenerated: false,
};

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Analyze a quote for fairness relative to local market rates.
 *
 * @param quoteId — DB id of the Quote to analyze
 * @returns QuoteAnalysisResult — always returns a safe object, never throws
 */
export async function analyzeQuote(quoteId: string): Promise<QuoteAnalysisResult> {
  const data = await loadQuoteData(quoteId);

  if (!data) return EMPTY_ANALYSIS;

  // ── Fallback: no OpenAI key → use AIEstimate range if available ──────────

  if (!openai) {
    console.warn("[quote-analysis] OPENAI_API_KEY not set — using fallback");

    if (data.aiEstimate) {
      const { minCost, maxCost } = data.aiEstimate;
      const mid = (minCost + maxCost) / 2;
      let verdict: QuoteVerdict = "fair";
      if (data.totalCost < minCost * 0.85) verdict = "low";
      else if (data.totalCost > maxCost * 1.15) verdict = "high";

      return {
        fairRangeLow: minCost,
        fairRangeHigh: maxCost,
        verdict,
        explanation:
          verdict === "fair"
            ? `This quote of $${data.totalCost.toLocaleString()} falls within the estimated range of $${minCost.toLocaleString()}–$${maxCost.toLocaleString()} for this type of project.`
            : verdict === "high"
            ? `This quote of $${data.totalCost.toLocaleString()} is above the estimated range of $${minCost.toLocaleString()}–$${maxCost.toLocaleString()}. Request an itemized breakdown to understand the difference.`
            : `This quote of $${data.totalCost.toLocaleString()} is below the typical range of $${minCost.toLocaleString()}–$${maxCost.toLocaleString()}. Verify that the scope covers everything you need.`,
        suggestions:
          verdict === "high"
            ? [
                "Ask the contractor to break down the largest cost items.",
                "Compare with at least one other quote.",
                `The estimated fair range for this project is $${minCost.toLocaleString()}–$${maxCost.toLocaleString()}.`,
              ]
            : verdict === "low"
            ? [
                "Confirm the full scope is included — low quotes sometimes omit cleanup, permits, or materials.",
                "Ask about material quality and brand names being used.",
                "A very low quote can indicate inexperience or corner-cutting.",
              ]
            : [
                "The price is in a reasonable range.",
                "Review the itemized breakdown to confirm it matches your expectations.",
                "Consider timelines and reviews alongside price when choosing.",
              ],
        aiGenerated: false,
      };
    }

    return EMPTY_ANALYSIS;
  }

  // ── Full AI analysis ──────────────────────────────────────────────────────

  try {
    const prompt = buildPrompt(data);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You are a home renovation cost analyst. Always respond with valid JSON only — no markdown fences, no preamble.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";

    // Strip markdown fences if model adds them despite instructions
    const jsonText = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const parsed = JSON.parse(jsonText) as {
      fairRangeLow: number;
      fairRangeHigh: number;
      verdict: QuoteVerdict;
      explanation: string;
      suggestions: string[];
    };

    // Validate required fields
    if (
      typeof parsed.fairRangeLow !== "number" ||
      typeof parsed.fairRangeHigh !== "number" ||
      !["low", "fair", "high"].includes(parsed.verdict)
    ) {
      throw new Error("Invalid response shape");
    }

    return {
      fairRangeLow: parsed.fairRangeLow,
      fairRangeHigh: parsed.fairRangeHigh,
      verdict: parsed.verdict,
      explanation: parsed.explanation ?? "",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
      aiGenerated: true,
    };
  } catch (e) {
    console.error("[quote-analysis] AI analysis failed, returning fallback:", e);
    return EMPTY_ANALYSIS;
  }
}
