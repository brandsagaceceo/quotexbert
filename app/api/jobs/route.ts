import { NextRequest, NextResponse } from 'next/server';
import { getAllOpenLeads } from '@/lib/subscription-access';

export async function GET(request: NextRequest) {
  try {
    // Get contractor ID from query parameters or headers
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || searchParams.get('userId') || 'demo-contractor';

    // Get all open leads - contractors can view all but only apply to subscribed categories
    const leads = await getAllOpenLeads();

    const jobs = leads.map(lead => ({
      id: lead.id,
      title: lead.title || `${lead.category} Project`,
      description: lead.description || 'No description available',
      category: lead.category || 'General',
      budget: lead.budget ? `$${lead.budget}` : '$0',
      location: lead.zipCode || 'Location TBD',
      status: lead.status || 'open',
      homeowner: lead.homeowner?.name || 'Anonymous',
      createdAt: lead.createdAt
    }));

    return NextResponse.json({
      jobs,
      total: jobs.length,
      message: jobs.length === 0 
        ? 'No jobs available at the moment.' 
        : `Found ${jobs.length} available jobs. Subscribe to categories to apply for jobs.`
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
