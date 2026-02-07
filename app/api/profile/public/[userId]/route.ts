import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let profile: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // If contractor, fetch contractor profile
    if (user.role === 'contractor') {
      const contractorProfile = await prisma.contractorProfile.findUnique({
        where: { userId },
        include: {
          portfolio: {
            where: { isPublic: true },
            orderBy: { createdAt: 'desc' },
            take: 12
          }
        }
      });

      if (contractorProfile) {
        profile = {
          ...profile,
          companyName: contractorProfile.companyName,
          trade: contractorProfile.trade,
          bio: contractorProfile.bio,
          city: contractorProfile.city,
          phone: contractorProfile.phone,
          website: contractorProfile.website,
          profilePhoto: contractorProfile.profilePhoto,
          coverPhoto: contractorProfile.coverPhoto,
          verified: contractorProfile.verified,
          avgRating: contractorProfile.avgRating,
          reviewCount: contractorProfile.reviewCount,
          serviceRadiusKm: contractorProfile.serviceRadiusKm,
          isActive: contractorProfile.isActive
        };

        // Count completed jobs
        const completedJobs = await prisma.jobAcceptance.count({
          where: {
            contractorId: userId,
            status: 'completed'
          }
        });

        profile.completedJobs = completedJobs;

        return NextResponse.json({
          success: true,
          profile,
          portfolio: contractorProfile.portfolio
        });
      }
    }

    // If homeowner, fetch homeowner profile
    if (user.role === 'homeowner') {
      const homeownerProfile = await prisma.homeownerProfile.findUnique({
        where: { userId }
      });

      if (homeownerProfile) {
        profile = {
          ...profile,
          city: homeownerProfile.city,
          phone: homeownerProfile.phone,
          profilePhoto: homeownerProfile.profilePhoto,
          coverPhoto: homeownerProfile.coverPhoto
        };
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      portfolio: []
    });

  } catch (error) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
