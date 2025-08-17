import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaymentIntent, createOrGetStripeCustomer } from "@/lib/stripe";
import {
  canClaimLead,
  getLeadPricing,
  createCharge,
  wouldExceedCap,
} from "@/lib/billing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, userId } = body;

    if (!leadId || !userId) {
      return NextResponse.json(
        { error: "Lead ID and User ID are required" },
        { status: 400 },
      );
    }

    // Get the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { homeowner: true },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (lead.status !== "open") {
      return NextResponse.json(
        { error: "Lead is no longer available" },
        { status: 400 },
      );
    }

    if (lead.contractorId) {
      return NextResponse.json(
        { error: "Lead has already been claimed" },
        { status: 400 },
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if contractor can claim lead
    const { canClaim, reason, billing } = await canClaimLead(userId);

    if (!canClaim) {
      return NextResponse.json({ error: reason }, { status: 400 });
    }

    // Get pricing for this lead
    const priceCents = await getLeadPricing(
      lead.category || "default",
      lead.zipCode,
    );

    // Check if this would exceed monthly cap
    if (
      wouldExceedCap(
        billing.spendThisMonthCents,
        billing.monthlyCapCents,
        priceCents,
      )
    ) {
      return NextResponse.json(
        { error: "This claim would exceed your monthly spending cap" },
        { status: 400 },
      );
    }

    // Create or get Stripe customer
    const stripeCustomerId = await createOrGetStripeCustomer(
      userId,
      user.email,
      user.email, // Using email as name for now
    );

    // Update billing record with Stripe customer ID if not set
    if (!billing.stripeCustomerId) {
      await prisma.contractorBilling.update({
        where: { id: billing.id },
        data: { stripeCustomerId },
      });
    }

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        stripeCustomerId,
        priceCents,
        leadId,
      );

      // Create charge record
      const charge = await createCharge(
        billing.id,
        leadId,
        priceCents,
        paymentIntent.id,
      );

      // If payment succeeded immediately, claim the lead
      if (paymentIntent.status === "succeeded") {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            status: "claimed",
            contractorId: userId,
            claimed: true,
          },
        });

        // Create thread for messaging
        await prisma.thread.create({
          data: {
            leadId: leadId,
          },
        });

        // Update charge status
        await prisma.charge.update({
          where: { id: charge.id },
          data: { status: "succeeded" },
        });

        // Update monthly spend
        await prisma.contractorBilling.update({
          where: { id: billing.id },
          data: {
            spendThisMonthCents: {
              increment: priceCents,
            },
          },
        });

        return NextResponse.json({
          success: true,
          message: "Lead claimed successfully",
          charge: {
            id: charge.id,
            amount: priceCents,
            status: "succeeded",
          },
        });
      }

      return NextResponse.json({
        success: false,
        message: "Payment failed",
        charge: {
          id: charge.id,
          amount: priceCents,
          status: "failed",
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);

      // Handle specific Stripe errors
      if (stripeError.code === "card_declined") {
        return NextResponse.json(
          {
            error: "Your card was declined. Please check your payment method.",
          },
          { status: 400 },
        );
      }

      if (stripeError.code === "authentication_required") {
        return NextResponse.json(
          {
            error:
              "Payment requires authentication. Please update your payment method.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Payment processing failed. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error claiming lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
