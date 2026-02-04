import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Schema for validating the request
const compSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address'),
  tier: z.enum(['FREE', 'HANDYMAN', 'RENOVATION', 'GENERAL'], {
    errorMap: () => ({ message: 'Tier must be one of: FREE, HANDYMAN, RENOVATION, GENERAL' })
  }),
  expiresAt: z.string().datetime().optional().nullable(),
  reason: z.string().max(500).optional(),
});

// Authentication helper
function isAuthorized(adminEmail: string | null, adminToken: string | null): boolean {
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

  // Check if user email is in admin list
  if (adminEmail && ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return true;
  }

  // Check if admin token matches
  if (adminToken && ADMIN_TOKEN && adminToken === ADMIN_TOKEN) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    // Get authentication info
    const { userId } = await auth();
    const headerToken = req.headers.get('x-admin-token');
    
    let adminEmail: string | null = null;
    
    // If authenticated with Clerk, get user email
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { email: true }
      });
      adminEmail = user?.email || null;
    }

    // Check authorization
    if (!isAuthorized(adminEmail, headerToken)) {
      console.warn('[COMP] Unauthorized access attempt', { 
        hasUserId: !!userId, 
        hasToken: !!headerToken,
        email: adminEmail 
      });
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = compSubscriptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.issues.map(i => i.message) 
        },
        { status: 400 }
      );
    }

    const { email, tier, expiresAt, reason } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { 
        id: true, 
        email: true, 
        name: true,
        proOverrideEnabled: true,
        proOverrideTier: true,
        proOverrideExpiresAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    // Update user with override
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        proOverrideEnabled: true,
        proOverrideTier: tier,
        proOverrideExpiresAt: expiresAt ? new Date(expiresAt) : null,
        proOverrideReason: reason || 'Admin override',
        proOverrideSetBy: adminEmail || 'Admin Token',
        proOverrideSetAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        proOverrideEnabled: true,
        proOverrideTier: true,
        proOverrideExpiresAt: true,
        proOverrideReason: true,
        proOverrideSetBy: true,
        proOverrideSetAt: true,
      }
    });

    console.log('[COMP] Subscription override set successfully', {
      userId: user.id,
      email: user.email,
      tier,
      setBy: adminEmail || 'Token',
      expiresAt: expiresAt || 'Never'
    });

    return NextResponse.json({
      success: true,
      message: `COMP subscription granted to ${email}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('[COMP] Error setting subscription override:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check current override status
export async function GET(req: Request) {
  try {
    // Get authentication info
    const { userId } = await auth();
    const headerToken = req.headers.get('x-admin-token');
    
    let adminEmail: string | null = null;
    
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { email: true }
      });
      adminEmail = user?.email || null;
    }

    // Check authorization
    if (!isAuthorized(adminEmail, headerToken)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get email from query params
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    // Find user with override info
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        proOverrideEnabled: true,
        proOverrideTier: true,
        proOverrideExpiresAt: true,
        proOverrideReason: true,
        proOverrideSetBy: true,
        proOverrideSetAt: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    // Check if override is active
    const isOverrideActive = user.proOverrideEnabled && 
      (!user.proOverrideExpiresAt || user.proOverrideExpiresAt > new Date());

    return NextResponse.json({
      user,
      isOverrideActive,
      effectiveTier: isOverrideActive ? user.proOverrideTier : user.subscriptionPlan,
      message: isOverrideActive 
        ? `Override active: ${user.proOverrideTier}` 
        : 'No active override (using Stripe subscription)'
    });

  } catch (error) {
    console.error('[COMP] Error checking override status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove override
export async function DELETE(req: Request) {
  try {
    // Get authentication info
    const { userId } = await auth();
    const headerToken = req.headers.get('x-admin-token');
    
    let adminEmail: string | null = null;
    
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { email: true }
      });
      adminEmail = user?.email || null;
    }

    // Check authorization
    if (!isAuthorized(adminEmail, headerToken)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get email from body
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    // Remove override
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        proOverrideEnabled: false,
        proOverrideTier: null,
        proOverrideExpiresAt: null,
        proOverrideReason: null,
        proOverrideSetBy: null,
        proOverrideSetAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      }
    });

    console.log('[COMP] Override removed successfully', {
      userId: updatedUser.id,
      email: updatedUser.email,
      removedBy: adminEmail || 'Token'
    });

    return NextResponse.json({
      success: true,
      message: `Override removed for ${email}. User now using Stripe subscription.`,
      user: updatedUser
    });

  } catch (error) {
    console.error('[COMP] Error removing override:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
