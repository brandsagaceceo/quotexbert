import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getOrCreateContractorBilling } from '@/lib/billing';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const billing = await getOrCreateContractorBilling(userId);
    return NextResponse.json({ billing });
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 });
  }
}