import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  getSubscriptionEntitlements,
  isSubscriptionPaymentVerified,
} from "@/lib/subscription-entitlements";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/subscriptions/activate
 * Called after successful Stripe checkout to create ContractorSubscription
 * records for each selected category.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status },
      );
    }

    const { sessionId } = await request.json();

    if (typeof sessionId !== "string" || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      include: { billing: true },
    });
    if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json(
        { success: false, error: "An active contractor account is required" },
        { status: 403 }
      );
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid Stripe session" },
        { status: 400 }
      );
    }

    if (
      session.mode !== "subscription" ||
      session.status !== "complete"
    ) {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 402 }
      );
    }

    if (session.metadata?.contractorId !== contractor.id) {
      return NextResponse.json(
        { success: false, error: "Checkout session does not belong to this contractor" },
        { status: 403 }
      );
    }

    const entitlements = getSubscriptionEntitlements(
      session.metadata?.tier,
      session.metadata?.selectedCategories,
    );
    if (!entitlements) {
      return NextResponse.json(
        { success: false, error: "Checkout session has invalid subscription entitlements" },
        { status: 400 }
      );
    }

    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    if (!stripeSubscriptionId || !stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: "Checkout session is missing its subscription or customer" },
        { status: 400 }
      );
    }

    const linkedCustomerIds = [
      contractor.stripeCustomerId,
      contractor.billing?.stripeCustomerId,
    ].filter((customerId): customerId is string => Boolean(customerId));
    if (
      linkedCustomerIds.length === 0 ||
      new Set(linkedCustomerIds).size > 1 ||
      linkedCustomerIds[0] !== stripeCustomerId
    ) {
      return NextResponse.json(
        { success: false, error: "Checkout customer does not match this contractor's billing account" },
        { status: 403 }
      );
    }

    let stripeSubscription;
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid Stripe subscription" },
        { status: 400 }
      );
    }

    const subscriptionCustomerId =
      typeof stripeSubscription.customer === "string"
        ? stripeSubscription.customer
        : stripeSubscription.customer.id;
    if (subscriptionCustomerId !== stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: "Checkout session customer does not match its subscription" },
        { status: 403 }
      );
    }

    if (!["active", "trialing"].includes(stripeSubscription.status)) {
      return NextResponse.json(
        { success: false, error: "Stripe subscription is not active" },
        { status: 409 }
      );
    }

    if (
      !isSubscriptionPaymentVerified(
        session.payment_status,
        stripeSubscription.status,
      )
    ) {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 402 }
      );
    }

    const subscriptionItem = stripeSubscription.items.data[0];
    if (!subscriptionItem) {
      return NextResponse.json(
        { success: false, error: "Stripe subscription has no billing period" },
        { status: 409 }
      );
    }

    const currentPeriodStart = new Date(subscriptionItem.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscriptionItem.current_period_end * 1000);

    // Create ContractorSubscription records for each selected category
    const created: string[] = [];
    const skipped: string[] = [];

    for (const category of entitlements.categories) {
      try {
        await prisma.contractorSubscription.upsert({
          where: {
            contractorId_category: {
              contractorId: contractor.id,
              category,
            },
          },
          create: {
            contractorId: contractor.id,
            category,
            status: "active",
            monthlyPrice: 0, // Included in tier price
            stripeSubscriptionId,
            stripeCustomerId,
            currentPeriodStart,
            currentPeriodEnd,
            canClaimLeads: true,
            canViewLeads: true,
          },
          update: {
            status: "active",
            stripeSubscriptionId,
            stripeCustomerId,
            currentPeriodStart,
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
      try { return JSON.parse(contractor.selectedCategories || "[]"); } catch { return []; }
    })();
    const merged = Array.from(new Set([...existing, ...entitlements.categories]));
    await prisma.user.update({
      where: { id: contractor.id },
      data: { selectedCategories: JSON.stringify(merged) },
    });

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          userId: contractor.id,
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
      tier: entitlements.tier,
    });
  } catch (error) {
    console.error("[ACTIVATE] Error activating categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to activate categories" },
      { status: 500 }
    );
  }
}
