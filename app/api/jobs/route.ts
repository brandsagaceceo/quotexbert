import { NextRequest, NextResponse } from 'next/server';
import { getAllOpenLeads } from '@/lib/subscription-access';

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

    // Get all open leads - contractors can view all but only apply to subscribed categories
    const leads = await getAllOpenLeads();

    const jobs = leads.map((lead: any) => ({
      id: lead.id,
      title: lead.title || `${lead.category} Project`,
      description: lead.description || 'No description available',
      category: lead.category || 'General',
      budget: lead.budget ? `$${lead.budget}` : '$0',
      location: lead.zipCode || 'Location TBD',
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
        ? 'No leads available at the moment.'
        : 'Jobs available in your categories — subscribe to a category to apply.'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
