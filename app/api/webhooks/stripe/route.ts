import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";
import { activateCheckoutSubscription, getSubscriptionBillingPeriod } from "@/lib/subscription-activation";
import { TIER_PRICING } from "@/lib/subscription-plans";
import {
  sendSubscriptionCreatedEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
  sendSubscriptionRenewalEmail,
} from "@/lib/email";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  let event: Stripe.Event | undefined;
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature")!;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Log webhook event for admin dashboard (using raw SQL to avoid schema sync issues)
    try {
      await prisma.$executeRaw`
        INSERT INTO stripe_webhook_logs (id, type, "eventId", processed, "createdAt")
        VALUES (gen_random_uuid()::text, ${event.type}, ${event.id}, false, NOW())
        ON CONFLICT ("eventId") DO NOTHING
      `;
    } catch (logError) {
      console.error('Failed to log webhook event:', logError);
      // Continue processing even if logging fails
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

    // Mark webhook as processed
    try {
      await prisma.$executeRaw`
        UPDATE stripe_webhook_logs
        SET processed = true
        WHERE "eventId" = ${event.id}
      `;
    } catch (updateError) {
      console.error('Failed to mark webhook as processed:', updateError);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    
    if (event?.id) {
      try {
        await prisma.$executeRaw`
          UPDATE stripe_webhook_logs
          SET error = ${(error as Error).message || 'Unknown error'}
          WHERE "eventId" = ${event.id}
        `;
      } catch (logError) {
        console.error('Failed to log webhook error:', logError);
      }
    }
    
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle checkout session completed (new tier-based subscriptions)
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    if (session.mode !== "subscription") return;
    console.log("[STRIPE WEBHOOK] Checkout session completed:", session.id);
    const result = await activateCheckoutSubscription(session);
    const { contractorId } = result;
    const tierName = result.tier ? TIER_PRICING[result.tier].name : "Category";
    const normalizedTier = result.tier?.toUpperCase() ?? "LEGACY";

    const foundingOfferApplied = session.metadata?.foundingOfferApplied === "true";
    const notificationMessage = `Your ${tierName} subscription is confirmed with ${result.categories.length} categories activated. Review billing for charges and renewal terms.${foundingOfferApplied ? " Your founding offer terms are recorded in checkout and billing history." : ""}`;

    await prisma.notification.create({
      data: {
        userId: contractorId,
        type: 'SUBSCRIPTION_CREATED',
        title: 'Subscription Activated! 🎉',
        message: notificationMessage,
        read: false
      }
    });

    console.log(`[STRIPE WEBHOOK] Confirmed ${normalizedTier} subscription for contractor ${contractorId}`);

    // Send subscription confirmation email
    const contractorEmailUser = await prisma.user.findUnique({
      where: { id: contractorId },
      select: { id: true, email: true, name: true, displayName: true, selectedCategories: true, subscriptionCurrentPeriodEnd: true }
    });
    if (contractorEmailUser?.email) {
      let activatedCategories: string[] = [];
      try { activatedCategories = JSON.parse(contractorEmailUser.selectedCategories || '[]'); } catch {}
      await sendSubscriptionCreatedEmail({
        contractor: { id: contractorEmailUser.id, email: contractorEmailUser.email, name: contractorEmailUser.displayName ?? contractorEmailUser.name },
        tier: normalizedTier,
        categories: activatedCategories,
        nextBillingDate: contractorEmailUser.subscriptionCurrentPeriodEnd,
      }).catch(err => console.error('[EMAIL] sendSubscriptionCreatedEmail error:', err));
    }

  } catch (error) {
    console.error("[STRIPE WEBHOOK] Error handling checkout session completed:", error);
    throw error;
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
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
    const { currentPeriodStart, currentPeriodEnd } = getSubscriptionBillingPeriod(subscription);
    const existingSubscription = await prisma.contractorSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (existingSubscription) {
      // Update existing record
      await prisma.contractorSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart,
          currentPeriodEnd,
          nextBillingDate: currentPeriodEnd
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
          stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
          currentPeriodStart,
          currentPeriodEnd,
          nextBillingDate: currentPeriodEnd,
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
    throw error;
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log("[STRIPE WEBHOOK] Subscription updated:", subscription.id);
    
    const { currentPeriodStart, currentPeriodEnd } = getSubscriptionBillingPeriod(subscription);
    const canAccessLeads = ["active", "trialing"].includes(subscription.status);
    await prisma.$transaction(async transaction => {
      await transaction.contractorSubscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart,
          currentPeriodEnd,
          nextBillingDate: currentPeriodEnd,
          canClaimLeads: canAccessLeads,
          canViewLeads: canAccessLeads,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
        }
      });

      await transaction.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionCurrentPeriodEnd: currentPeriodEnd
        }
      });
    });

    console.log(`[STRIPE WEBHOOK] Updated subscription status to ${subscription.status}`);

  } catch (error) {
    console.error("[STRIPE WEBHOOK] Error handling subscription updated:", error);
    throw error;
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Subscription deleted:", subscription.id);
    
    // Update the subscription record in our database
    const cancelledSub = await prisma.contractorSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      include: { contractor: { select: { id: true, email: true, name: true, displayName: true } } }
    });

    await prisma.contractorSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
        canClaimLeads: false,
        canViewLeads: false
      }
    });

    if (cancelledSub?.contractor?.email) {
      await sendSubscriptionCancelledEmail({
        contractor: { id: cancelledSub.contractor.id, email: cancelledSub.contractor.email, name: cancelledSub.contractor.displayName ?? cancelledSub.contractor.name },
        category: cancelledSub.category ?? undefined,
        accessUntil: cancelledSub.currentPeriodEnd ?? null,
      }).catch(err => console.error('[EMAIL] sendSubscriptionCancelledEmail error:', err));
    }

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
      const entitlementRows = await prisma.contractorSubscription.findMany({
        where: { stripeSubscriptionId: invoice.subscription },
        select: { id: true }
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
        await prisma.contractorSubscription.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: {
            leadsThisMonth: 0,
            status: 'active',
            canClaimLeads: true,
            canViewLeads: true,
            currentPeriodStart: new Date(invoice.period_start * 1000),
            currentPeriodEnd: new Date(invoice.period_end * 1000),
            nextBillingDate: new Date(invoice.period_end * 1000)
          }
        });
        console.log(`[STRIPE WEBHOOK] Renewed ${entitlementRows.length} entitlement rows for subscription ${invoice.subscription}`);

        // AFFILIATE COMMISSION: 20% recurring
        // Find the contractor user via Stripe subscription ID and check for affiliate attribution
        try {
          const contractorUser = await prisma.user.findFirst({
            where: {
              OR: [
                { stripeCustomerId: invoice.customer as string },
                { stripeSubscriptionId: invoice.subscription as string },
              ],
            },
            select: { id: true, referredByAffiliateId: true },
          });

          if (contractorUser?.referredByAffiliateId) {
            const affiliate = await prisma.affiliate.findUnique({
              where: { id: contractorUser.referredByAffiliateId },
            });

            if (affiliate) {
              const rate = affiliate.payoutPercent / 100; // e.g. 20 → 0.20
              const commissionAmount =
                Math.round((invoice.amount_paid / 100) * rate * 100) / 100; // CAD, 2dp

              await prisma.affiliateCommission.upsert({
                where: { stripeInvoiceId: invoice.id as string },
                create: {
                  affiliateId: affiliate.id,
                  userId: contractorUser.id,
                  subscriptionId: subscription?.id ?? null,
                  stripeInvoiceId: invoice.id as string,
                  amount: commissionAmount,
                  rate,
                  period: new Date((invoice.period_start as number) * 1000),
                  status: "pending",
                },
                update: {},  // Already recorded — no-op on retry
              });

              console.log(
                `[Affiliate] Commission $${commissionAmount} CAD queued → ${affiliate.referralCode} (invoice ${invoice.id})`
              );
            }
          }
        } catch (affiliateError) {
          console.error('[Affiliate] Error creating commission record:', affiliateError);
          // Never fail the webhook over affiliate tracking
        }
      }

      // Send renewal receipt email
      if (subscription) {
        const contractorUser = await prisma.user.findUnique({
          where: { id: subscription.contractorId },
          select: { id: true, email: true, name: true, displayName: true, subscriptionPlan: true }
        });
        if (contractorUser?.email) {
          await sendSubscriptionRenewalEmail({
            contractor: { id: contractorUser.id, email: contractorUser.email, name: contractorUser.displayName ?? contractorUser.name },
            tier: contractorUser.subscriptionPlan ?? 'HANDYMAN',
            amountPaid: (invoice.amount_paid as number) / 100,
            nextBillingDate: invoice.period_end ? new Date((invoice.period_end as number) * 1000) : null,
          }).catch(err => console.error('[EMAIL] sendSubscriptionRenewalEmail error:', err));
        }
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
      const entitlementRows = await prisma.contractorSubscription.findMany({
        where: { stripeSubscriptionId: invoice.subscription },
        select: { id: true }
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
        await prisma.contractorSubscription.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: { 
            status: 'past_due',
            canClaimLeads: false // Restrict access until payment is resolved
          }
        });
        console.log(`[STRIPE WEBHOOK] Marked ${entitlementRows.length} entitlement rows past_due for subscription ${invoice.subscription}`);

        // Send payment-failed email to contractor
        const contractorUser = await prisma.user.findUnique({
          where: { id: subscription.contractorId },
          select: { id: true, email: true, name: true, displayName: true }
        });
        if (contractorUser?.email) {
          await sendPaymentFailedEmail({
            contractor: { id: contractorUser.id, email: contractorUser.email, name: contractorUser.displayName ?? contractorUser.name },
            category: subscription.category ?? undefined,
            amountDue: (invoice.amount_due as number) / 100,
          }).catch(err => console.error('[EMAIL] sendPaymentFailedEmail error:', err));
        }
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