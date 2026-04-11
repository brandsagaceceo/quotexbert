/**
 * GET /api/quotes/price-suggestion?jobId=X&contractorId=Y
 *
 * Returns a suggested price range for the contractor based on recent accepted
 * quotes in the same category (narrowed to city when possible).
 *
 * Lookup strategy (narrowest-first):
 *  1. category + city  (≥ 3 accepted signals)
 *  2. category only    (≥ 3 accepted signals)
 *  3. null             (not enough data — UI hides the card)
 *
 * Response (200):
 *  { low: number, high: number, count: number, scope: "city" | "category" }
 * or { suggestion: null } when insufficient data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MIN_SIGNALS = 3;
const LOOKBACK_DAYS = 90;

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const contractorId = searchParams.get('contractorId');

    if (!jobId || !contractorId) {
      return NextResponse.json({ suggestion: null });
    }

    // Resolve job category and contractor city in parallel
    const [job, contractor] = await Promise.all([
      prisma.lead.findUnique({
        where: { id: jobId },
        select: { category: true },
      }),
      prisma.user.findFirst({
        where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
        select: { contractorProfile: { select: { city: true } } },
      }),
    ]);

    const category = job?.category ?? null;
    const city = contractor?.contractorProfile?.city ?? null;

    if (!category) {
      return NextResponse.json({ suggestion: null });
    }

    const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    // Helper: query accepted signals and extract costs
    const fetchCosts = async (whereExtra: Record<string, unknown>): Promise<number[]> => {
      const rows = await prisma.quoteLearningSignal.findMany({
        where: {
          event: 'quote_accepted',
          outcome: 'accepted',
          quoteTotalCost: { not: null },
          category: { equals: category, mode: 'insensitive' },
          createdAt: { gte: since },
          ...whereExtra,
        },
        select: { quoteTotalCost: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return rows.map((r) => r.quoteTotalCost as number);
    };

    // Try city-scoped first
    let costs: number[] = [];
    let scope: 'city' | 'category' = 'city';

    if (city) {
      costs = await fetchCosts({ city: { equals: city, mode: 'insensitive' } });
    }

    // Fall back to category-only
    if (costs.length < MIN_SIGNALS) {
      costs = await fetchCosts({});
      scope = 'category';
    }

    if (costs.length < MIN_SIGNALS) {
      return NextResponse.json({ suggestion: null });
    }

    const sorted = [...costs].sort((a, b) => a - b);
    const low = Math.round(percentile(sorted, 0.25));
    const high = Math.round(percentile(sorted, 0.75));

    return NextResponse.json({ suggestion: { low, high, count: sorted.length, scope } });
  } catch (err) {
    console.error('[GET /api/quotes/price-suggestion]', err);
    return NextResponse.json({ suggestion: null });
  }
}
