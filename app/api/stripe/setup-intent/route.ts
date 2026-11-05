import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSetupIntent, stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import {
  resolveOwnedStripeCustomerId,
  StripeCustomerOwnershipError,
  type StripeCustomerReference,
} from "@/lib/stripe-customer-ownership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        billing: { select: { stripeCustomerId: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripeCustomerId = await resolveOwnedStripeCustomerId({
      userId: user.id,
      email: user.email,
      name: user.name,
      userStripeCustomerId: user.stripeCustomerId,
      billingStripeCustomerId: user.billing?.stripeCustomerId ?? null,
      retrieveCustomer: async (
        customerId,
      ): Promise<StripeCustomerReference> => {
        const customer = await stripe.customers.retrieve(customerId);
        if ("deleted" in customer && customer.deleted) {
          return { id: customer.id, deleted: true, metadata: {} };
        }
        return { id: customer.id, metadata: customer.metadata };
      },
      createCustomer: async (params): Promise<StripeCustomerReference> => {
        const customer = await stripe.customers.create(params);
        return { id: customer.id, metadata: customer.metadata };
      },
    });

    await prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { stripeCustomerId: true },
      });
      const currentBilling = await tx.contractorBilling.findUnique({
        where: { userId: user.id },
        select: { stripeCustomerId: true },
      });

      if (
        !currentUser ||
        (currentUser.stripeCustomerId &&
          currentUser.stripeCustomerId !== stripeCustomerId) ||
        (currentBilling?.stripeCustomerId &&
          currentBilling.stripeCustomerId !== stripeCustomerId)
      ) {
        throw new StripeCustomerOwnershipError(
          "Stripe customer records changed or conflict for this account.",
        );
      }

      if (!currentUser.stripeCustomerId) {
        await tx.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      }

      await tx.contractorBilling.upsert({
        where: { userId: user.id },
        create: { userId: user.id, stripeCustomerId },
        update: currentBilling?.stripeCustomerId ? {} : { stripeCustomerId },
      });
    });

    const setupIntent = await createSetupIntent(stripeCustomerId);
    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    if (error instanceof StripeCustomerOwnershipError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error creating setup intent:", error);
    return NextResponse.json(
      { error: "Failed to create setup intent" },
      { status: 500 },
    );
  }
}
