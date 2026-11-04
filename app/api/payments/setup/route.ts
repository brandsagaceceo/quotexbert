import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import {
  isStripePaymentMethodOwnedByCustomer,
  resolveOwnedStripeCustomerId,
  StripeCustomerOwnershipError,
  type StripeCustomerReference,
} from "@/lib/stripe-customer-ownership";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type PaymentAccount = {
  id: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
  billing: { stripeCustomerId: string | null } | null;
};

function getStripeCustomerId(
  customer: string | { id: string } | null,
): string | null {
  return typeof customer === "string" ? customer : (customer?.id ?? null);
}

async function getAccount(userId: string): Promise<PaymentAccount | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      stripeCustomerId: true,
      billing: { select: { stripeCustomerId: true } },
    },
  });
}

async function getOwnedStripeCustomerId(account: PaymentAccount) {
  return resolveOwnedStripeCustomerId({
    userId: account.id,
    email: account.email,
    name: account.name,
    userStripeCustomerId: account.stripeCustomerId,
    billingStripeCustomerId: account.billing?.stripeCustomerId ?? null,
    retrieveCustomer: async (customerId): Promise<StripeCustomerReference> => {
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
}

async function persistStripeCustomerId(userId: string, customerId: string) {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    const billing = await tx.contractorBilling.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (
      !user ||
      (user.stripeCustomerId && user.stripeCustomerId !== customerId) ||
      (billing?.stripeCustomerId && billing.stripeCustomerId !== customerId)
    ) {
      throw new StripeCustomerOwnershipError(
        "Stripe customer records changed or conflict for this account.",
      );
    }

    if (!user.stripeCustomerId) {
      await tx.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }
    if (billing && !billing.stripeCustomerId) {
      await tx.contractorBilling.update({
        where: { userId },
        data: { stripeCustomerId: customerId },
      });
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const body = await request.json();
    const paymentMethodId = body?.paymentMethodId;
    const isDefault = body?.isDefault ?? false;
    if (
      typeof paymentMethodId !== "string" ||
      !paymentMethodId ||
      typeof isDefault !== "boolean"
    ) {
      return NextResponse.json(
        { error: "A valid payment method ID and default flag are required" },
        { status: 400 },
      );
    }

    const account = await getAccount(authResult.user.dbUserId);
    if (!account) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripePaymentMethod =
      await stripe.paymentMethods.retrieve(paymentMethodId);
    const linkedCustomerId =
      account.stripeCustomerId ?? account.billing?.stripeCustomerId ?? null;
    const attachedCustomerId = getStripeCustomerId(
      stripePaymentMethod.customer,
    );
    if (
      attachedCustomerId &&
      !isStripePaymentMethodOwnedByCustomer(
        attachedCustomerId,
        linkedCustomerId ?? "",
      )
    ) {
      return NextResponse.json(
        { error: "Payment method belongs to another customer" },
        { status: 403 },
      );
    }

    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
      where: { stripePaymentMethodId: paymentMethodId },
      select: { userId: true },
    });
    if (existingPaymentMethod && existingPaymentMethod.userId !== account.id) {
      return NextResponse.json(
        { error: "Payment method belongs to another account" },
        { status: 403 },
      );
    }

    const stripeCustomerId = await getOwnedStripeCustomerId(account);
    await persistStripeCustomerId(account.id, stripeCustomerId);

    if (!attachedCustomerId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });
    }

    if (isDefault) {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const paymentMethod = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.paymentMethod.updateMany({
          where: { userId: account.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.paymentMethod.upsert({
        where: { stripePaymentMethodId: paymentMethodId },
        create: {
          userId: account.id,
          stripePaymentMethodId: paymentMethodId,
          type: stripePaymentMethod.type,
          last4:
            stripePaymentMethod.card?.last4 ??
            stripePaymentMethod.us_bank_account?.last4 ??
            null,
          brand: stripePaymentMethod.card?.brand ?? null,
          expMonth: stripePaymentMethod.card?.exp_month ?? null,
          expYear: stripePaymentMethod.card?.exp_year ?? null,
          isDefault,
          isActive: true,
        },
        update: {
          type: stripePaymentMethod.type,
          last4:
            stripePaymentMethod.card?.last4 ??
            stripePaymentMethod.us_bank_account?.last4 ??
            null,
          brand: stripePaymentMethod.card?.brand ?? null,
          expMonth: stripePaymentMethod.card?.exp_month ?? null,
          expYear: stripePaymentMethod.card?.exp_year ?? null,
          ...(isDefault ? { isDefault: true } : {}),
          isActive: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand,
        expMonth: paymentMethod.expMonth,
        expYear: paymentMethod.expYear,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
      },
    });
  } catch (error) {
    if (error instanceof StripeCustomerOwnershipError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error setting up payment method:", error);

    if (error instanceof Error && "type" in error) {
      return NextResponse.json(
        { error: `Setup failed: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to setup payment method" },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId: authResult.user.dbUserId,
        isActive: true,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods.map((paymentMethod) => ({
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand,
        expMonth: paymentMethod.expMonth,
        expYear: paymentMethod.expYear,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
        stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
      })),
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get("paymentMethodId");
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 },
      );
    }

    const account = await getAccount(authResult.user.dbUserId);
    if (!account) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: account.id,
        isActive: true,
      },
    });
    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 },
      );
    }

    const linkedCustomerId =
      account.stripeCustomerId ?? account.billing?.stripeCustomerId ?? null;
    if (!linkedCustomerId) {
      throw new StripeCustomerOwnershipError(
        "Stripe customer ownership could not be verified for this account.",
      );
    }

    const stripeCustomerId = await getOwnedStripeCustomerId(account);
    const stripePaymentMethod = await stripe.paymentMethods.retrieve(
      paymentMethod.stripePaymentMethodId,
    );
    const attachedCustomerId = getStripeCustomerId(
      stripePaymentMethod.customer,
    );
    if (
      !isStripePaymentMethodOwnedByCustomer(
        attachedCustomerId,
        stripeCustomerId,
      )
    ) {
      return NextResponse.json(
        { error: "Payment method belongs to another customer" },
        { status: 403 },
      );
    }

    if (attachedCustomerId === stripeCustomerId) {
      await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);
    }
    await prisma.paymentMethod.update({
      where: { id: paymentMethod.id },
      data: { isActive: false, isDefault: false },
    });

    return NextResponse.json({
      success: true,
      message: "Payment method removed",
    });
  } catch (error) {
    if (error instanceof StripeCustomerOwnershipError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error removing payment method:", error);

    if (error instanceof Error && "type" in error) {
      return NextResponse.json(
        { error: `Removal failed: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to remove payment method" },
      { status: 500 },
    );
  }
}
