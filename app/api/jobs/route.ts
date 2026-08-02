import { NextRequest, NextResponse } from 'next/server';
import { getVisibleLeads } from '@/lib/subscription-access';
import { formatBudgetDisplay } from '@/lib/currency';
import { normalizeCategory } from '@/lib/categories';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get contractor ID from query parameters or headers
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || searchParams.get('userId');

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID required. Please sign in." },
        { status: 401 }
      );
    }

    const leads = await getVisibleLeads(contractorId);

    const jobs = leads.map((lead: any) => {
      const hasAccess = Boolean(lead.hasAccess);
      const simpleCategory = normalizeCategory(lead.category || 'Handyman');
      const teaserLocation = lead.city || lead.zipCode || 'Your area';

      return {
        id: lead.id,
        title: hasAccess
          ? (lead.title || `${lead.category} Project`)
          : `New ${simpleCategory} job available`,
        description: hasAccess
          ? (lead.description || 'No description available')
          : `A new ${simpleCategory} job is available in ${teaserLocation}. Subscribe to unlock the full scope and claim this lead.`,
        category: lead.category || 'General',
        simpleCategory,
        budget: hasAccess ? formatBudgetDisplay(lead.budget) : 'Budget hidden until you subscribe',
        location: hasAccess
          ? ([lead.city, lead.province].filter(Boolean).join(", ") || lead.zipCode || 'Location TBD')
          : teaserLocation,
        status: lead.status || 'open',
        homeowner: lead.homeowner?.name || 'Anonymous',
        photos: hasAccess ? (lead.photos || '[]') : '[]',
        createdAt: lead.createdAt,
        hasAccess,
        isLocked: !hasAccess,
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
}
