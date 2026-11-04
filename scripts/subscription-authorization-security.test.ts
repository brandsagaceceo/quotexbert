import assert from "node:assert/strict";
import fs from "node:fs";
import {
  getSubscriptionEntitlements,
  isSubscriptionPaymentVerified,
} from "../lib/subscription-entitlements";

const checkout = fs.readFileSync(
  "app/api/subscriptions/create-checkout/route.ts",
  "utf8",
);
const activate = fs.readFileSync(
  "app/api/subscriptions/activate/route.ts",
  "utf8",
);
const subscriptionApi = fs.readFileSync(
  "app/api/subscriptions/route.ts",
  "utf8",
);
const userSubscriptionApi = fs.readFileSync(
  "app/api/user/subscription/route.ts",
  "utf8",
);

assert.deepEqual(
  getSubscriptionEntitlements(
    "handyman",
    JSON.stringify(["painting-interior-exterior"]),
  ),
  { tier: "handyman", categories: ["painting-interior-exterior"] },
  "paid Checkout metadata grants the selected valid category",
);
assert.equal(
  getSubscriptionEntitlements(
    "handyman",
    JSON.stringify([
      "painting-interior-exterior",
      "drywall-plastering",
      "flooring-installation-repair",
      "roofing",
    ]),
  ),
  null,
  "metadata exceeding the purchased plan category limit is rejected",
);
assert.equal(
  getSubscriptionEntitlements(
    "toString",
    JSON.stringify(["painting-interior-exterior"]),
  ),
  null,
  "prototype properties cannot be treated as valid subscription tiers",
);
assert.equal(
  getSubscriptionEntitlements("handyman", "not-a-category"),
  null,
  "invalid or empty category metadata cannot grant entitlements",
);
assert.equal(
  isSubscriptionPaymentVerified("paid", "active"),
  true,
  "paid active subscriptions are eligible for activation",
);
assert.equal(
  isSubscriptionPaymentVerified("no_payment_required", "trialing"),
  true,
  "valid Stripe trial subscriptions preserve their trial access",
);
assert.equal(
  isSubscriptionPaymentVerified("unpaid", "active"),
  false,
  "unpaid active-status records cannot activate entitlements",
);
assert.equal(
  isSubscriptionPaymentVerified("paid", "canceled"),
  false,
  "paid Checkout Sessions cannot reactivate canceled Stripe subscriptions",
);

assert.match(
  checkout,
  /resolveAuthUser\(\)/,
  "Checkout requires a server-authenticated user",
);
assert.match(
  checkout,
  /where: \{ id: authResult\.user\.dbUserId \}/,
  "Checkout derives the contractor account from the session",
);
assert.match(
  checkout,
  /contractor\.role !== "contractor" \|\| !contractor\.isActive/,
  "only active contractor accounts can purchase a plan",
);
assert.match(
  checkout,
  /new Set\(existingCustomerIds\)\.size > 1/,
  "conflicting Stripe customer records fail closed",
);
assert.match(
  checkout,
  /resolveOwnedStripeCustomerId\(/,
  "Checkout verifies an existing Stripe customer is owned by the account",
);
assert.match(
  checkout,
  /StripeCustomerOwnershipError[\s\S]*status: 409/,
  "unverified Stripe customer ownership fails closed",
);

assert.match(
  activate,
  /resolveAuthUser\(\)/,
  "activation requires authentication",
);
assert.match(
  activate,
  /session\.metadata\?\.contractorId !== contractor\.id/,
  "a Checkout Session must belong to the authenticated contractor",
);
assert.match(
  activate,
  /isSubscriptionPaymentVerified\(/,
  "activation accepts paid sessions or verified Stripe trials only",
);
assert.match(
  activate,
  /getSubscriptionEntitlements\(/,
  "activation derives category grants from server-verified metadata and plan limits",
);
assert.match(
  activate,
  /new Set\(linkedCustomerIds\)\.size > 1/,
  "activation rejects conflicting account customer IDs",
);
assert.match(
  activate,
  /stripeSubscription\.customer/,
  "activation verifies the subscription belongs to the Checkout Session customer",
);

assert.match(
  subscriptionApi,
  /resolveAuthUser\(\)/g,
  "subscription route handlers use server authentication",
);
assert.match(
  subscriptionApi,
  /where: \{ id: subscriptionId, contractorId: contractor\.id \}/,
  "cancellation only resolves subscriptions owned by the authenticated contractor",
);
assert.match(
  subscriptionApi,
  /process\.env\.NODE_ENV === "production"[\s\S]*status: 503/,
  "production cannot create paid entitlements through the demo-mode path",
);

assert.match(
  userSubscriptionApi,
  /resolveAuthUser\(\)/g,
  "account subscription reads and writes require authentication",
);
assert.match(
  userSubscriptionApi,
  /where: \{ id: authResult\.user\.dbUserId \}/,
  "account category updates target only the session-resolved user",
);

console.log("subscription authorization security tests passed");
