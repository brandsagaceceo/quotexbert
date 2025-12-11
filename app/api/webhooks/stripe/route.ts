import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature")!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle checkout session completed (new tier-based subscriptions)
async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log("Checkout session completed:", session.id);
    
    const contractorId = session.metadata?.contractorId;
    const tier = session.metadata?.tier;
    const categoryCount = parseInt(session.metadata?.categoryCount || "0");
    
    if (!contractorId || !tier) {
      console.error("Missing contractor ID or tier in checkout session metadata");
      return;
    }

    // Map tier to pricing
    const tierPricing: Record<string, { name: string; price: number }> = {
      handyman: { name: 'Handyman', price: 49 },
      renovation: { name: 'Renovation Xbert', price: 99 },
      general: { name: 'General Contractor', price: 149 }
    };

    const tierInfo = tierPricing[tier];
    
    if (!tierInfo) {
      console.error(`Unknown tier: ${tier}`);
      return;
    }

    // Update user record with subscription info
    const stripeSubscriptionId = session.subscription as string;
    
    await prisma.user.update({
      where: { id: contractorId },
      data: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId,
        subscriptionPlan: tier,
        subscriptionStatus: 'active',
        subscriptionInterval: 'month'
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: contractorId,
        type: 'SUBSCRIPTION_CREATED',
        title: 'Subscription Activated!',
        message: `Your ${tierInfo.name} subscription is now active! You can now select up to ${categoryCount} categories to receive leads from.`,
        read: false
      }
    });

    console.log(`Successfully activated ${tier} subscription for contractor ${contractorId}`);

  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log("Subscription created:", subscription.id);
    
    // Get contractor info from metadata
    const contractorId = subscription.metadata?.contractorId;
    const category = subscription.metadata?.category;
    
    if (!contractorId || !category) {
      console.error("Missing contractor ID or category in subscription metadata");
      return;
    }

    // Check if subscription record already exists
    const existingSubscription = await prisma.contractorSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (existingSubscription) {
      // Update existing record
      await prisma.contractorSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          nextBillingDate: new Date(subscription.current_period_end * 1000)
        }
      });
    } else {
      // Create new subscription record
      const categoryMap: Record<string, { name: string; price: number }> = {
        plumbing: { name: 'Plumbing', price: 29.99 },
        electrical: { name: 'Electrical', price: 29.99 },
        general: { name: 'General Contracting', price: 29.99 },
        hvac: { name: 'HVAC', price: 29.99 },
        roofing: { name: 'Roofing', price: 29.99 },
        landscaping: { name: 'Landscaping', price: 29.99 },
        painting: { name: 'Painting', price: 29.99 },
        flooring: { name: 'Flooring', price: 29.99 },
        kitchen: { name: 'Kitchen Remodeling', price: 29.99 },
        bathroom: { name: 'Bathroom Remodeling', price: 29.99 }
      };
      
      const categoryInfo = categoryMap[category] || { name: category, price: 29.99 };

      const now = new Date();
      // Treat all subscriptions as standard paid subscriptions; trials are not used.
      const trialEnd = null;
      const isTrialing = false;

      await prisma.contractorSubscription.create({
        data: {
          contractorId,
          category,
          status: subscription.status,
          monthlyPrice: categoryInfo.price,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          nextBillingDate: new Date(subscription.current_period_end * 1000),
          trialStart: null,
          trialEnd: trialEnd,
          canClaimLeads: subscription.status === 'active',
          canViewLeads: true
        }
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: contractorId,
          type: 'SUBSCRIPTION_CREATED',
          title: 'Subscription Activated!',
          message:
            `Your subscription for ${categoryInfo.name} is now active. You can start claiming leads!`,
          read: false
        }
      });
    }

  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log("Subscription updated:", subscription.id);
    
    // Update the subscription record in our database
    await prisma.contractorSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
      }
    });

  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Subscription deleted:", subscription.id);
    
    // Update the subscription record in our database
    await prisma.contractorSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
        canClaimLeads: false,
        canViewLeads: false
      }
    });

  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log("Invoice payment succeeded:", invoice.id);
    
    if (invoice.subscription) {
      // Create a transaction record
      const subscription = await prisma.contractorSubscription.findFirst({
        where: { stripeSubscriptionId: invoice.subscription }
      });

      if (subscription) {
        await prisma.transaction.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.contractorId,
            type: 'subscription_payment',
            amount: invoice.amount_paid / 100, // Convert from cents
            status: 'completed',
            description: `Monthly subscription payment for ${subscription.category}`,
            category: subscription.category,
            stripeInvoiceId: invoice.id,
            stripeTransactionId: invoice.payment_intent,
            periodStart: new Date(invoice.period_start * 1000),
            periodEnd: new Date(invoice.period_end * 1000)
          }
        });

        // Reset monthly lead count for the new billing period
        await prisma.contractorSubscription.update({
          where: { id: subscription.id },
          data: { leadsThisMonth: 0 }
        });
      }
    }

  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log("Invoice payment failed:", invoice.id);
    
    if (invoice.subscription) {
      const subscription = await prisma.contractorSubscription.findFirst({
        where: { stripeSubscriptionId: invoice.subscription }
      });

      if (subscription) {
        await prisma.transaction.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.contractorId,
            type: 'subscription_payment',
            amount: invoice.amount_due / 100, // Convert from cents
            status: 'failed',
            description: `Failed payment for ${subscription.category} subscription`,
            category: subscription.category,
            stripeInvoiceId: invoice.id
          }
        });

        // Update subscription status to past_due
        await prisma.contractorSubscription.update({
          where: { id: subscription.id },
          data: { 
            status: 'past_due',
            canClaimLeads: false // Restrict access until payment is resolved
          }
        });
      }
    }

  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}

// Handle trial ending soon
async function handleTrialWillEnd(subscription: any) {
  try {
    console.log("Trial will end:", subscription.id);
    
    // You could send an email notification here
    // For now, just log it
    
  } catch (error) {
    console.error("Error handling trial will end:", error);
  }
}