import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const jobs = leads.map(lead => ({
      id: lead.id,
      title: lead.title || `${lead.category} Project`,
      description: lead.description || 'No description available',
      category: lead.category || 'General',
      budget: `$${lead.budget || 0}`,
      location: lead.zipCode || 'Location TBD',
      status: lead.status || 'open',
      createdAt: lead.createdAt
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
