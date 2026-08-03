import { NextRequest, NextResponse } from 'next/server';
import { getVisibleLeads } from '@/lib/subscription-access';
import { formatBudgetDisplay } from '@/lib/currency';
import { normalizeCategory } from '@/lib/categories';
import { resolveAuthUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

type AuthResult = Awaited<ReturnType<typeof resolveAuthUser>>;

interface JobsRouteDeps {
  resolveAuthUserFn: () => Promise<AuthResult>;
  getVisibleLeadsFn: typeof getVisibleLeads;
  findActorFn: (dbUserId: string) => Promise<{ id: string; role: string | null; isActive: boolean } | null>;
}

export function createJobsGetHandler(overrides: Partial<JobsRouteDeps> = {}) {
  const deps: JobsRouteDeps = {
    resolveAuthUserFn: resolveAuthUser,
    getVisibleLeadsFn: getVisibleLeads,
    findActorFn: async (dbUserId: string) =>
      prisma.user.findUnique({
        where: { id: dbUserId },
        select: { id: true, role: true, isActive: true },
      }),
    ...overrides,
  };

  return async function GET(request: NextRequest) {
  try {
    // Enforce server-side session auth and bind identity to Clerk session only.
    const authResult = await deps.resolveAuthUserFn();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const authenticatedContractorId = authResult.user.dbUserId;
    const actor = await deps.findActorFn(authenticatedContractorId);

    if (!actor) {
      return NextResponse.json({ error: 'Contractor record not found' }, { status: 404 });
    }

    if (actor.role !== 'contractor' || !actor.isActive) {
      return NextResponse.json({ error: 'Forbidden: contractor access required' }, { status: 403 });
    }

    // Ignore any contractorId/userId query params to prevent impersonation.
    const leads = await deps.getVisibleLeadsFn(authenticatedContractorId);

    const jobs = leads.map((lead: any) => {
      const hasAccess = Boolean(lead.hasAccess);
      const simpleCategory = normalizeCategory(lead.category || 'Handyman');
      const teaserLocation = lead.city || 'Your area';

      if (!hasAccess) {
        return {
          id: lead.id,
          title: `New ${simpleCategory} job available`,
          description: `A new ${simpleCategory} job is available in ${teaserLocation}. Subscribe to unlock the full scope and claim this lead.`,
          category: lead.category || 'General',
          simpleCategory,
          budget: 'Budget hidden until you subscribe',
          location: teaserLocation,
          status: lead.status || 'open',
          homeowner: null,
          photos: '[]',
          createdAt: lead.createdAt,
          hasAccess: false,
          isLocked: true,
          city: null,
          zipCode: null,
          claimed: false,
          claimedBy: null,
          claimedAt: null,
          _count: {
            applications: lead._count?.applications || 0,
          },
        };
      }

      return {
        id: lead.id,
        title: lead.title || `${lead.category} Project`,
        description: lead.description || 'No description available',
        category: lead.category || 'General',
        simpleCategory,
        budget: formatBudgetDisplay(lead.budget),
        location: [lead.city, lead.province].filter(Boolean).join(", ") || lead.zipCode || 'Location TBD',
        status: lead.status || 'open',
        homeowner: lead.homeowner?.name || 'Anonymous',
        photos: lead.photos || '[]',
        createdAt: lead.createdAt,
        hasAccess: true,
        isLocked: false,
        city: lead.city || null,
        zipCode: lead.zipCode || null,
        claimed: lead.claimed,
        claimedBy: lead.claimedBy,
        claimedAt: lead.claimedAt,
        _count: {
          applications: lead._count?.applications || 0
        }
      };
    });

    return NextResponse.json({
      jobs,
      total: jobs.length,
      message: jobs.length === 0
        ? 'No jobs are available right now.'
        : 'Available jobs loaded. Locked jobs require a matching category subscription.'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
  };
}

export const GET = createJobsGetHandler();
