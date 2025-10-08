import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Toggle the billing pause status
    const billing = await prisma.contractorBilling.findUnique({
      where: { userId }
    });

    if (!billing) {
      return NextResponse.json({ error: 'Billing record not found' }, { status: 404 });
    }

    const updatedBilling = await prisma.contractorBilling.update({
      where: { userId },
      data: { isPaused: !billing.isPaused }
    });

    return NextResponse.json({ 
      success: true, 
      isPaused: updatedBilling.isPaused 
    });
  } catch (error) {
    console.error('Error toggling billing status:', error);
    return NextResponse.json({ error: 'Failed to update billing status' }, { status: 500 });
  }
}