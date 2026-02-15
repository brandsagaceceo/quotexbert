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
        lead: {
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

    // Also fetch JobAcceptance records (for jobs accepted directly without application)
    const jobAcceptances = await prisma.jobAcceptance.findMany({
      where: {
        contractorId,
        status: {
          in: ['accepted', 'quoted', 'selected']
        }
      },
      include: {
        lead: {
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

    // Fetch homeowner profiles to get phone numbers
    const homeownerIds = [
      ...acceptedApplications.map(app => app.lead.homeowner.id),
      ...jobAcceptances.map(acc => acc.lead.homeowner.id)
    ];
    const homeownerProfiles = await prisma.homeownerProfile.findMany({
      where: {
        userId: {
          in: homeownerIds
        }
      },
      select: {
        userId: true,
        phone: true
      }
    });

    const phoneMap = new Map(homeownerProfiles.map(profile => [profile.userId, profile.phone]));

    // Transform JobApplications to job format with phone numbers (only visible after acceptance)
    const jobsFromApplications = acceptedApplications.map(app => ({
      id: app.lead.id,
      title: app.lead.title,
      description: app.lead.description,
      budget: app.lead.budget,
      location: 'Toronto Area',
      status: app.status,
      acceptedAt: app.updatedAt.toISOString(),
      homeownerName: app.lead.homeowner.name || app.lead.homeowner.email,
      homeownerEmail: app.lead.homeowner.email,
      homeownerPhone: phoneMap.get(app.lead.homeowner.id) || null, // Phone revealed after acceptance
      homeownerId: app.lead.homeowner.id,
      category: app.lead.category,
    }));

    // Transform JobAcceptances to job format
    const jobsFromAcceptances = jobAcceptances.map(acc => ({
      id: acc.lead.id,
      title: acc.lead.title,
      description: acc.lead.description,
      budget: acc.lead.budget,
      location: 'Toronto Area',
      status: acc.status,
      acceptedAt: acc.updatedAt.toISOString(),
      homeownerName: acc.lead.homeowner.name || acc.lead.homeowner.email,
      homeownerEmail: acc.lead.homeowner.email,
      homeownerPhone: phoneMap.get(acc.lead.homeowner.id) || null,
      homeownerId: acc.lead.homeowner.id,
      category: acc.lead.category,
    }));

    // Combine both lists and remove duplicates (in case a job has both an application and acceptance)
    const allJobs = [...jobsFromApplications, ...jobsFromAcceptances];
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());
    
    // Sort by acceptedAt date (most recent first)
    uniqueJobs.sort((a, b) => new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime());

    return NextResponse.json({ success: true, jobs: uniqueJobs });
  } catch (error) {
    console.error('Error fetching accepted jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch accepted jobs' }, { status: 500 });
  }
}
