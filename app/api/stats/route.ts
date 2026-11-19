import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalJobs, totalContractors, reviews] = await Promise.all([
      prisma.lead.count({ where: { isSeeded: false, published: true, status: { in: ['open', 'claimed', 'accepted'] } } }),
      prisma.user.count({ where: { role: 'contractor' } }),
      prisma.review.aggregate({
        where: { status: 'published' },
        _avg: { rating: true },
        _count: { _all: true },
      })
    ]);

    const avgRating = reviews._avg.rating;

    return NextResponse.json({
      totalJobs,
      totalContractors,
      avgRating: avgRating === null ? null : Math.round(avgRating * 10) / 10,
      totalReviews: reviews._count._all,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[PUBLIC_STATS] Unable to load statistics', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({
      error: 'Statistics are temporarily unavailable',
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
