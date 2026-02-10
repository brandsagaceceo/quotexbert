import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['brandsagaceo@gmail.com', 'quotexbert@gmail.com'];

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email from Clerk
    const adminUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true }
    });

    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get search email from query params
    const { searchParams } = new URL(request.url);
    const searchEmail = searchParams.get('email');

    if (!searchEmail) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: searchEmail },
      select: {
        email: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        selectedCategories: true,
        proOverrideTier: true,
        proOverrideEnabled: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse selected categories (stored as JSON string)
    let categories: string[] = [];
    try {
      if (user.selectedCategories) {
        categories = JSON.parse(user.selectedCategories);
      }
    } catch (error) {
      console.error('Failed to parse selectedCategories:', error);
    }

    return NextResponse.json({
      email: user.email,
      tier: user.subscriptionPlan,
      status: user.subscriptionStatus,
      customerId: user.stripeCustomerId,
      subscriptionId: user.stripeSubscriptionId,
      categories,
      proOverride: user.proOverrideEnabled && !!user.proOverrideTier
    });
  } catch (error) {
    console.error('User status lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
