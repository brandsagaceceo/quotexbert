/**
 * GET /api/quotes/price-suggestion?jobId=X
 *
 * Returns a coarse category-wide range only to a contractor participating in
 * the requested project. Location-level estimates and small cohorts are
 * suppressed to avoid exposing individual customer or contractor pricing.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const LOOKBACK_DAYS = 90;
const MAX_SIGNALS = 500;
const MIN_QUOTES = 10;
const MIN_OTHER_CONTRACTORS = 5;
const MIN_HOMEOWNERS = 5;
const PRICE_INCREMENT = 500;

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))] ?? 0;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json({ suggestion: null });
    }

    const contractorId = authResult.user.dbUserId;
    const [user, conversation] = await Promise.all([
      prisma.user.findUnique({
        where: { id: contractorId },
        select: { role: true, isActive: true },
      }),
      prisma.conversation.findFirst({
        where: { jobId, contractorId },
        select: { job: { select: { category: true } } },
      }),
    ]);

    if (user?.role !== "contractor" || !user.isActive) {
      return NextResponse.json(
        { error: "Active contractor access required" },
        { status: 403 },
      );
    }
    if (!conversation?.job.category) {
      return NextResponse.json(
        { error: "You do not have access to this project" },
        { status: 403 },
      );
    }

    const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
    const signals = await prisma.quoteLearningSignal.findMany({
      where: {
        event: "quote_accepted",
        outcome: "accepted",
        isAcceptedVersion: true,
        quoteId: { not: null },
        quoteTotalCost: { not: null, gt: 0 },
        category: { equals: conversation.job.category, mode: "insensitive" },
        createdAt: { gte: since },
      },
      select: { quoteId: true, quoteTotalCost: true },
      orderBy: { createdAt: "desc" },
      take: MAX_SIGNALS,
    });

    const costsByQuote = new Map<string, number>();
    for (const signal of signals) {
      if (
        signal.quoteId &&
        signal.quoteTotalCost != null &&
        Number.isFinite(signal.quoteTotalCost) &&
        signal.quoteTotalCost > 0 &&
        !costsByQuote.has(signal.quoteId)
      ) {
        costsByQuote.set(signal.quoteId, signal.quoteTotalCost);
      }
    }

    if (costsByQuote.size < MIN_QUOTES) {
      return NextResponse.json({ suggestion: null });
    }

    const quotes = await prisma.quote.findMany({
      where: { id: { in: Array.from(costsByQuote.keys()) } },
      select: {
        id: true,
        contractorId: true,
        jobId: true,
        job: { select: { category: true } },
        conversation: { select: { homeownerId: true, jobId: true } },
      },
    });

    const validQuotes = quotes.filter(
      (quote) =>
        quote.jobId !== jobId &&
        quote.jobId === quote.conversation.jobId &&
        quote.job.category.trim().toLowerCase() ===
          conversation.job.category.trim().toLowerCase(),
    );
    const otherContractorIds = new Set(
      validQuotes
        .filter((quote) => quote.contractorId !== contractorId)
        .map((quote) => quote.contractorId),
    );
    const homeownerIds = new Set(
      validQuotes.map((quote) => quote.conversation.homeownerId),
    );

    if (
      validQuotes.length < MIN_QUOTES ||
      otherContractorIds.size < MIN_OTHER_CONTRACTORS ||
      homeownerIds.size < MIN_HOMEOWNERS
    ) {
      return NextResponse.json({ suggestion: null });
    }

    const sorted = validQuotes
      .map((quote) => costsByQuote.get(quote.id))
      .filter((cost): cost is number => cost !== undefined)
      .sort((a, b) => a - b);
    if (sorted.length < MIN_QUOTES) {
      return NextResponse.json({ suggestion: null });
    }

    const low =
      Math.floor(percentile(sorted, 0.25) / PRICE_INCREMENT) * PRICE_INCREMENT;
    const high =
      Math.ceil(percentile(sorted, 0.75) / PRICE_INCREMENT) * PRICE_INCREMENT;
    const count = Math.floor(sorted.length / 5) * 5;

    return NextResponse.json({
      suggestion: { low, high, count, scope: "category" as const },
    });
  } catch (err) {
    console.error("[GET /api/quotes/price-suggestion]", err);
    return NextResponse.json({ suggestion: null });
  }
}
