import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCategoryById, ALL_CATEGORIES } from "@/lib/categories";

// Helper function to generate Stripe price ID for a category
function getStripePriceId(categoryId: string, price: number): string {
  return `price_${categoryId.replace(/-/g, '_')}_${price}_monthly`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Subscription API called');
    const { contractorId, category } = await request.json();

    if (!contractorId || !category) {
      return NextResponse.json(
        { error: "Contractor ID and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    const categoryConfig = getCategoryById(category);
    if (!categoryConfig) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Get contractor
    const contractor = await prisma.user.findUnique({
      where: { id: contractorId },
      include: {
        contractorProfile: true
      }
    });

    if (!contractor || contractor.role !== "contractor") {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Check if already subscribed to this category
    const existingSubscription = await prisma.contractorSubscription.findUnique({
      where: {
        contractorId_category: {
          contractorId,
          category
        }
      }
    });

    if (existingSubscription && existingSubscription.status === 'active') {
      return NextResponse.json(
        { error: "Already subscribed to this category" },
        { status: 409 }
      );
    }

    const stripePriceId = getStripePriceId(category, categoryConfig.monthlyPrice);

    // Demo mode: Check if we have a valid Stripe key, if not use demo flow
    const isValidStripeKey = process.env.STRIPE_SECRET_KEY && 
                            process.env.STRIPE_SECRET_KEY.startsWith('sk_') && 
                            process.env.STRIPE_SECRET_KEY !== 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';

    if (!isValidStripeKey) {
      console.log('Using demo mode - no valid Stripe key found');
      
      // Create subscription record directly for demo
      const now = new Date();

      const subscription = await prisma.contractorSubscription.create({
        data: {
          contractorId,
          category,
          status: 'active',
          monthlyPrice: categoryConfig.monthlyPrice,
          stripeSubscriptionId: `demo_sub_${Date.now()}`,
          stripeCustomerId: `demo_cust_${contractorId}`,
          stripePriceId: stripePriceId,
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
          trialStart: null,
          trialEnd: null,
          canClaimLeads: true,
          canViewLeads: true
        }
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: contractorId,
          type: 'SUBSCRIPTION_CREATED',
          title: 'Subscription Created (Demo)',
          message:
            `Your subscription for ${category} category has been created. You now have access to leads in this category. (Demo Mode)`,
          relatedId: subscription.id,
          relatedType: 'subscription'
        }
      });

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          category: subscription.category,
          status: subscription.status,
          monthlyPrice: subscription.monthlyPrice,
          trialEnd: subscription.trialEnd,
          nextBillingDate: subscription.currentPeriodEnd
        },
        demoMode: true,
        message: 'Subscription created in demo mode'
      });
    }

    // Real Stripe flow would go here when valid keys are available
    return NextResponse.json({
      error: "Stripe integration not properly configured"
    }, { status: 500 });

  } catch (error) {
    console.error("Error creating subscription:", error);
    
    if (error instanceof Error && 'type' in error) {
      // Stripe error
      return NextResponse.json(
        { error: `Subscription creation failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId');

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 }
      );
    }

    // Get contractor's subscriptions
    const subscriptions = await prisma.contractorSubscription.findMany({
      where: { contractorId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate subscription summary
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const totalMonthlyAmount = activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
    const categories = activeSubscriptions.map(s => s.category);

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        category: sub.category,
        status: sub.status,
        monthlyPrice: sub.monthlyPrice,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        trialEnd: sub.trialEnd,
        canceledAt: sub.canceledAt,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        canClaimLeads: sub.canClaimLeads,
        leadsThisMonth: sub.leadsThisMonth,
        recentTransactions: sub.transactions
      })),
      summary: {
        activeSubscriptions: activeSubscriptions.length,
        totalMonthlyAmount,
        categories,
        availableCategories: ALL_CATEGORIES
          .map(cat => cat.id)
          .filter(cat => !categories.includes(cat))
      }
    });

  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');
    const immediate = searchParams.get('immediate') === 'true';

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Get subscription from database
    const subscription = await prisma.contractorSubscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Cancel in Stripe
    if (subscription.stripeSubscriptionId) {
      if (immediate) {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } else {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      }
    }

    // Update subscription in database
    const updatedSubscription = await prisma.contractorSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: immediate ? 'canceled' : 'active',
        cancelAtPeriodEnd: !immediate,
        canceledAt: immediate ? new Date() : null,
        canClaimLeads: immediate ? false : true
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: subscription.contractorId,
        type: 'SUBSCRIPTION_CANCELED',
        title: 'Subscription Canceled',
        message: immediate 
          ? `Your ${subscription.category} subscription has been canceled immediately.`
          : `Your ${subscription.category} subscription will be canceled at the end of the current billing period.`,
        relatedId: subscription.id,
        relatedType: 'subscription'
      }
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        canceledAt: updatedSubscription.canceledAt
      },
      message: immediate 
        ? "Subscription canceled immediately"
        : "Subscription will be canceled at the end of the billing period"
    });

  } catch (error) {
    console.error("Error canceling subscription:", error);
    
    if (error instanceof Error && 'type' in error) {
      // Stripe error
      return NextResponse.json(
        { error: `Cancellation failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}