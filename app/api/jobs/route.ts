import { NextRequest, NextResponse } from 'next/server';
import { getAccessibleLeads } from '@/lib/subscription-access';
import { formatBudgetDisplay } from '@/lib/currency';

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

    const leads = await getAccessibleLeads(contractorId);

    const jobs = leads.map((lead: any) => ({
      id: lead.id,
      title: lead.title || `${lead.category} Project`,
      description: lead.description || 'No description available',
      category: lead.category || 'General',
      budget: formatBudgetDisplay(lead.budget),
      location: [lead.city, lead.province].filter(Boolean).join(", ") || lead.zipCode || 'Location TBD',
      status: lead.status || 'open',
      homeowner: lead.homeowner?.name || 'Anonymous',
      photos: lead.photos || '[]', // Include photos from lead
      createdAt: lead.createdAt,
      _count: {
        applications: lead._count?.applications || 0
      }
    }));

    return NextResponse.json({
      jobs,
      total: jobs.length,
      message: jobs.length === 0
        ? 'No leads available in your active categories at the moment.'
        : 'Jobs available in your active categories.'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
