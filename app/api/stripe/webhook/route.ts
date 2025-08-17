import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { completeCharge } from "@/lib/billing";
import { logEventServer } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        // Find the charge record
        const charge = await prisma.charge.findUnique({
          where: { stripePaymentIntentId: paymentIntent.id },
          include: { lead: true, contractor: true },
        });

        if (!charge) {
          console.error(
            "Charge not found for payment intent:",
            paymentIntent.id,
          );
          return NextResponse.json({ received: true });
        }

        if (charge.status === "succeeded") {
          // Already processed
          return NextResponse.json({ received: true });
        }

        // Complete the charge
        await completeCharge(charge.id);

        // Claim the lead
        await prisma.lead.update({
          where: { id: charge.leadId },
          data: {
            status: "claimed",
            contractorId: charge.contractor.userId,
            claimed: true,
          },
        });

        // Track analytics for payment success
        await logEventServer("payment_completed", charge.contractor.userId, {
          leadId: charge.leadId,
          amountCents: charge.amountCents,
          paymentIntentId: paymentIntent.id,
        });

        console.log(
          `Lead ${charge.leadId} claimed by contractor ${charge.contractor.userId}`,
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        // Mark charge as failed
        await prisma.charge.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: "failed" },
        });

        console.log("Payment failed for payment intent:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
