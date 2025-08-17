import { prisma } from "./prisma";

/**
 * Get or create contractor billing record
 */
export async function getOrCreateContractorBilling(userId: string) {
  let billing = await prisma.contractorBilling.findUnique({
    where: { userId },
    include: { charges: true },
  });

  if (!billing) {
    billing = await prisma.contractorBilling.create({
      data: {
        userId,
        resetOn: getNextMonthStart(),
      },
      include: { charges: true },
    });
  }

  return billing;
}

/**
 * Check if contractor can claim a lead (not paused, under cap, has payment method)
 */
export async function canClaimLead(userId: string): Promise<{
  canClaim: boolean;
  reason?: string;
  billing?: any;
}> {
  const billing = await getOrCreateContractorBilling(userId);

  if (billing.isPaused) {
    return { canClaim: false, reason: "Billing is paused", billing };
  }

  if (!billing.stripeCustomerId) {
    return { canClaim: false, reason: "No payment method on file", billing };
  }

  // Check if we need to reset monthly spend
  if (new Date() >= billing.resetOn) {
    await resetMonthlySpend(billing.id);
    billing.spendThisMonthCents = 0;
  }

  return { canClaim: true, billing };
}

/**
 * Check if adding amount would exceed monthly cap
 */
export function wouldExceedCap(
  currentSpend: number,
  cap: number,
  amount: number,
): boolean {
  return currentSpend + amount > cap;
}

/**
 * Reset monthly spend and update reset date
 */
export async function resetMonthlySpend(billingId: string) {
  await prisma.contractorBilling.update({
    where: { id: billingId },
    data: {
      spendThisMonthCents: 0,
      resetOn: getNextMonthStart(),
    },
  });
}

/**
 * Get lead pricing for a specific trade/city
 */
export async function getLeadPricing(
  trade: string,
  city: string = "default",
): Promise<number> {
  // Try to find specific city pricing first
  let pricing = await prisma.leadPricing.findUnique({
    where: { trade_city: { trade, city } },
  });

  // Fall back to default pricing
  if (!pricing) {
    pricing = await prisma.leadPricing.findUnique({
      where: { trade_city: { trade, city: "default" } },
    });
  }

  // Fall back to general default if no trade-specific pricing
  if (!pricing) {
    pricing = await prisma.leadPricing.findFirst({
      where: { trade: "default", city: "default" },
    });
  }

  return pricing?.priceCents || 900; // $9.00 default
}

/**
 * Record a charge attempt
 */
export async function createCharge(
  contractorBillingId: string,
  leadId: string,
  amountCents: number,
  stripePaymentIntentId?: string,
) {
  const chargeData: {
    contractorId: string;
    leadId: string;
    amountCents: number;
    status: string;
    stripePaymentIntentId?: string;
  } = {
    contractorId: contractorBillingId,
    leadId,
    amountCents,
    status: "pending",
  };

  if (stripePaymentIntentId) {
    chargeData.stripePaymentIntentId = stripePaymentIntentId;
  }

  return await prisma.charge.create({
    data: chargeData,
  });
}

/**
 * Mark charge as succeeded and update monthly spend
 */
export async function completeCharge(chargeId: string) {
  const charge = await prisma.charge.update({
    where: { id: chargeId },
    data: { status: "succeeded" },
    include: { contractor: true },
  });

  // Update monthly spend
  await prisma.contractorBilling.update({
    where: { id: charge.contractorId },
    data: {
      spendThisMonthCents: {
        increment: charge.amountCents,
      },
    },
  });

  return charge;
}

/**
 * Get the start of next month
 */
function getNextMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}
