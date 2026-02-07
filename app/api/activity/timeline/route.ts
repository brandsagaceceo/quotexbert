import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const activities = [];

    // Fetch job acceptances
    const jobAcceptances = await prisma.jobAcceptance.findMany({
      where: { contractorId: userId },
      include: {
        lead: {
          select: {
            title: true,
            budget: true,
            category: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    jobAcceptances.forEach(acceptance => {
      activities.push({
        id: `job-accepted-${acceptance.id}`,
        type: 'job_accepted',
        title: 'Accepted a new project',
        description: `Started working on "${acceptance.lead.title}"`,
        timestamp: acceptance.createdAt.toISOString(),
        metadata: {
          budget: acceptance.lead.budget,
          category: acceptance.lead.category
        }
      });
    });

    // Fetch portfolio items
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId },
      include: {
        portfolio: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (contractorProfile?.portfolio) {
      contractorProfile.portfolio.forEach(item => {
        activities.push({
          id: `portfolio-${item.id}`,
          type: 'portfolio_added',
          title: 'Added to portfolio',
          description: item.title,
          timestamp: item.createdAt.toISOString(),
          metadata: {
            projectType: item.projectType,
            cost: item.projectCost
          }
        });
      });
    }

    // Fetch reviews (if available)
    const reviews = await prisma.review.findMany({
      where: { contractorId: userId },
      include: {
        homeowner: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    reviews.forEach(review => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review_received',
        title: 'Received a review',
        description: `${review.rating} ⭐ from ${review.homeowner.name || 'a client'}`,
        timestamp: review.createdAt.toISOString(),
        metadata: {
          rating: review.rating,
          comment: review.comment?.substring(0, 100)
        }
      });
    });

    // Check if profile was verified
    if (contractorProfile?.verified) {
      activities.push({
        id: 'profile-verified',
        type: 'profile_verified',
        title: 'Profile Verified',
        description: 'Became a verified contractor',
        timestamp: contractorProfile.updatedAt.toISOString()
      });
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return top 20 activities
    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 20)
    });

  } catch (error) {
    console.error('Error fetching activity timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
