import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contractorId = searchParams.get('contractorId');

    if (!contractorId || contractorId !== userId) {
      return NextResponse.json({ error: 'Invalid contractor ID' }, { status: 403 });
    }

    // Fetch all applications where this contractor was accepted
    const acceptedApplications = await prisma.jobApplication.findMany({
      where: {
        contractorId,
        status: {
          in: ['accepted', 'in_progress', 'completed']
        }
      },
      include: {
        job: {
          include: {
            homeowner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform to job format
    const jobs = acceptedApplications.map(app => ({
      id: app.job.id,
      title: app.job.title,
      description: app.job.description,
      budget: app.job.budget,
      location: app.job.location || 'Not specified',
      status: app.status,
      acceptedAt: app.updatedAt.toISOString(),
      homeownerName: app.job.homeowner.name || app.job.homeowner.email,
      homeownerEmail: app.job.homeowner.email,
      category: app.job.category,
      deadline: app.job.deadline?.toISOString(),
    }));

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching accepted jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch accepted jobs' }, { status: 500 });
  }
}
