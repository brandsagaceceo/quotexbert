export interface StripeCustomerReference {
  id: string;
  deleted?: boolean;
  metadata: Record<string, string>;
}

export class StripeCustomerOwnershipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeCustomerOwnershipError";
  }
}

export function isStripePaymentMethodOwnedByCustomer(
  attachedCustomerId: string | null,
  expectedCustomerId: string,
): boolean {
  return (
    attachedCustomerId === null || attachedCustomerId === expectedCustomerId
  );
}

interface ResolveStripeCustomerInput {
  userId: string;
  email: string;
  name: string | null;
  userStripeCustomerId: string | null;
  billingStripeCustomerId: string | null;
  retrieveCustomer: (customerId: string) => Promise<StripeCustomerReference>;
  createCustomer: (params: {
    email: string;
    name?: string;
    metadata: { userId: string };
  }) => Promise<StripeCustomerReference>;
}

export async function resolveOwnedStripeCustomerId({
  userId,
  email,
  name,
  userStripeCustomerId,
  billingStripeCustomerId,
  retrieveCustomer,
  createCustomer,
}: ResolveStripeCustomerInput): Promise<string> {
  if (
    userStripeCustomerId &&
    billingStripeCustomerId &&
    userStripeCustomerId !== billingStripeCustomerId
  ) {
    throw new StripeCustomerOwnershipError(
      "Stripe customer records conflict for this account.",
    );
  }

  const linkedCustomerId = userStripeCustomerId ?? billingStripeCustomerId;
  const customer = linkedCustomerId
    ? await retrieveCustomer(linkedCustomerId)
    : await createCustomer({
        email,
        ...(name ? { name } : {}),
        metadata: { userId },
      });

  if (
    customer.deleted ||
    customer.metadata.userId !== userId ||
    (linkedCustomerId && customer.id !== linkedCustomerId)
  ) {
    throw new StripeCustomerOwnershipError(
      "Stripe customer ownership could not be verified for this account.",
    );
  }

  return customer.id;
}
