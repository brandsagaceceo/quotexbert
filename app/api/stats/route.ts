import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalJobs, totalContractors, reviews] = await Promise.all([
      prisma.lead.count({ where: { status: { in: ['OPEN', 'PENDING', 'ACCEPTED'] } } }),
      prisma.user.count({ where: { role: 'contractor' } }),
      prisma.review.aggregate({
        where: { status: 'published' },
        _avg: { rating: true }
      })
    ]);

    const avgRating = reviews._avg.rating || 4.8;

    return NextResponse.json({
      totalJobs,
      totalContractors,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: await prisma.review.count({ where: { status: 'published' } })
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalJobs: 50,
      totalContractors: 15,
      avgRating: 4.8,
      totalReviews: 45
    });
  }
}
