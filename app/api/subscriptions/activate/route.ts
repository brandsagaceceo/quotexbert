import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/subscriptions/activate
 * Called after successful Stripe checkout to create ContractorSubscription
 * records for each selected category.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, contractorId, selectedCategories } = await request.json();

    if (!sessionId || !contractorId || !Array.isArray(selectedCategories) || selectedCategories.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the Stripe session is paid
    let session: any;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid Stripe session" },
        { status: 400 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 402 }
      );
    }

    // Resolve DB user (try id then clerkUserId)
    let user = await prisma.user.findUnique({ where: { id: contractorId } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { clerkUserId: contractorId } });
    }
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Contractor not found" },
        { status: 404 }
      );
    }

    const dbUserId = user.id;
    const tier = session.metadata?.tier || "handyman";
    const stripeSubscriptionId = session.subscription as string | null;
    const stripeCustomerId = session.customer as string | null;

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Try to get real period end from Stripe subscription
    let currentPeriodEnd = periodEnd;
    if (stripeSubscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        if (sub && "current_period_end" in sub) {
          currentPeriodEnd = new Date((sub.current_period_end as number) * 1000);
        }
      } catch {
        // Use fallback date
      }
    }

    // Create ContractorSubscription records for each selected category
    const created: string[] = [];
    const skipped: string[] = [];

    for (const category of selectedCategories) {
      try {
        await prisma.contractorSubscription.upsert({
          where: {
            contractorId_category: {
              contractorId: dbUserId,
              category,
            },
          },
          create: {
            contractorId: dbUserId,
            category,
            status: "active",
            monthlyPrice: 0, // Included in tier price
            stripeSubscriptionId,
            stripeCustomerId,
            currentPeriodStart: now,
            currentPeriodEnd,
            canClaimLeads: true,
            canViewLeads: true,
          },
          update: {
            status: "active",
            stripeSubscriptionId,
            stripeCustomerId,
            currentPeriodStart: now,
            currentPeriodEnd,
            canClaimLeads: true,
            canViewLeads: true,
          },
        });
        created.push(category);
      } catch {
        skipped.push(category);
      }
    }

    // Update user's selectedCategories field
    const existing: string[] = (() => {
      try { return JSON.parse(user.selectedCategories || "[]"); } catch { return []; }
    })();
    const merged = Array.from(new Set([...existing, ...selectedCategories]));
    await prisma.user.update({
      where: { id: dbUserId },
      data: { selectedCategories: JSON.stringify(merged) },
    });

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          userId: dbUserId,
          type: "SUBSCRIPTION_CREATED",
          title: "Categories Activated!",
          message: `Your ${created.length} selected categories are now active. Start applying to jobs!`,
          read: false,
        },
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      activated: created,
      skipped,
      tier,
    });
  } catch (error) {
    console.error("[ACTIVATE] Error activating categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to activate categories" },
      { status: 500 }
    );
  }
}
