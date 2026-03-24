import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trade = searchParams.get('trade') || '';
    const city = searchParams.get('city') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const verifiedOnly = searchParams.get('verified') === 'true';

    const where: Record<string, unknown> = {};
    if (trade) where.trade = { contains: trade, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minRating > 0) where.avgRating = { gte: minRating };
    if (verifiedOnly) where.verified = true;

    const profiles = await prisma.contractorProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true } },
      },
      orderBy: [
        { verified: 'desc' },
        { avgRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: 100,
    });

    const contractors = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      companyName: p.companyName,
      trade: p.trade,
      bio: p.bio,
      city: p.city,
      serviceRadiusKm: p.serviceRadiusKm,
      website: p.website,
      phone: p.phone,
      verified: p.verified,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      profilePhoto: p.profilePhoto,
      completedJobs: p.completedJobs,
      responseTimeLabel: p.responseTimeLabel,
    }));

    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error listing contractors:', error);
    return NextResponse.json({ error: 'Failed to list contractors' }, { status: 500 });
  }
}
