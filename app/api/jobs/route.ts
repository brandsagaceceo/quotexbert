import { NextRequest, NextResponse } from 'next/server';
import { getAccessibleLeads } from '@/lib/subscription-access';

export async function GET(request: NextRequest) {
  try {
    // Get contractor ID from query parameters or headers
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || searchParams.get('userId') || 'demo-contractor';

    // Get leads that this contractor can access based on active subscriptions
    const leads = await getAccessibleLeads(contractorId);

    const jobs = leads.map(lead => ({
      id: lead.id,
      title: lead.title || `${lead.category} Project`,
      description: lead.description || 'No description available',
      category: lead.category || 'General',
      budget: `$${lead.budget || 0}`,
      location: lead.zipCode || 'Location TBD',
      status: lead.status || 'open',
      homeowner: lead.homeowner?.name || 'Anonymous',
      createdAt: lead.createdAt
    }));

    return NextResponse.json({
      jobs,
      total: jobs.length,
      message: jobs.length === 0 
        ? 'No jobs available. Subscribe to categories to access leads.' 
        : `Found ${jobs.length} jobs in your subscribed categories.`
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
