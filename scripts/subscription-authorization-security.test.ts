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
  "lib/subscription-activation.ts",
  "utf8",
);
const activationApi = fs.readFileSync("app/api/subscriptions/activate/route.ts", "utf8");
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
  activationApi,
  /resolveAuthUser\(\)/,
  "activation requires authentication",
);
assert.match(
  activate,
  /entitlements\.contractorId !== expectedContractorId/,
  "a Checkout Session must belong to the authenticated contractor",
);
assert.match(
  activate,
  /isSubscriptionPaymentVerified\(/,
  "activation accepts paid sessions or verified Stripe trials only",
);
assert.match(
  activate,
  /getCheckoutSubscriptionEntitlements\(/,
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

import test from "node:test";
import { NextRequest } from "next/server";

const moduleConstructor = require("node:module").Module as new (id: string) => NodeModule;
function mockModule(specifier: string, exports: Record<string, unknown>) {
  const filename = require.resolve(specifier);
  const module = new moduleConstructor(filename);
  module.filename = filename;
  module.loaded = true;
  module.exports = exports;
  require.cache[filename] = module;
}

let actor: string | null = "owner";
let session = checkoutFixture();
let subscriptionStatus = "active";
let subscriptionCustomer = "cus_fixture";
let failCategory = "";
let user = userFixture();
let rows = new Map<string, Record<string, unknown>>();
let webhookType = "checkout.session.completed";
let periodEnd = 2_002_592_000;

function stripeSubscriptionFixture() {
  return {
    id: "sub_fixture", status: subscriptionStatus, customer: subscriptionCustomer,
    cancel_at_period_end: false, canceled_at: null,
    items: { data: [{ current_period_start: 2_000_000_000, current_period_end: periodEnd, price: { recurring: { interval: "month" } } }] },
  };
}

function checkoutFixture() {
  return {
    id: "cs_fixture", mode: "subscription", status: "complete", payment_status: "paid",
    customer: "cus_fixture", subscription: "sub_fixture",
    metadata: { contractorId: "owner", tier: "handyman", selectedCategories: '["Plumbing","Painting"]' } as Record<string, string>,
  };
}
function userFixture() {
  return { id: "owner", role: "contractor", isActive: true, stripeCustomerId: "cus_fixture",
    billing: { stripeCustomerId: "cus_fixture" }, selectedCategories: '["general"]', subscriptionPlan: "FREE" };
}
function reset() {
  actor = "owner"; session = checkoutFixture(); subscriptionStatus = "active";
  subscriptionCustomer = "cus_fixture"; failCategory = ""; user = userFixture(); rows = new Map();
  webhookType = "checkout.session.completed"; periodEnd = 2_002_592_000;
}
mockModule("@/lib/prisma", {
  prisma: {
    user: { findUnique: async () => ({ ...user }) },
    notification: { create: async () => ({ id: "notification_fixture" }) },
    $executeRaw: async () => 1,
    $transaction: async (run: (transaction: unknown) => Promise<void>) => {
      const previousUser = { ...user };
      const previousRows = new Map(rows);
      try {
        await run({
          contractorSubscription: {
            updateMany: async ({ where, data }: { where: { stripeSubscriptionId: string }; data: Record<string, unknown> }) => {
              assert.equal(where.stripeSubscriptionId, "sub_fixture");
              for (const [category, row] of rows) {
                if (category === failCategory) throw new Error("Isolated lifecycle write failure");
                rows.set(category, { ...row, ...data });
              }
            },
            upsert: async ({ where, create, update }: {
              where: { contractorId_category: { category: string } };
              create: Record<string, unknown>; update: Record<string, unknown>;
            }) => {
              const category = where.contractorId_category.category;
              if (category === failCategory) throw new Error("Isolated database write failure");
              rows.set(category, rows.has(category) ? { ...rows.get(category), ...update } : create);
            },
          },
          user: {
            findUniqueOrThrow: async () => ({ selectedCategories: user.selectedCategories }),
            update: async ({ data }: { data: Record<string, unknown> }) => { Object.assign(user, data); },
            updateMany: async ({ where, data }: { where: { stripeSubscriptionId: string }; data: Record<string, unknown> }) => {
              assert.equal(where.stripeSubscriptionId, "sub_fixture");
              Object.assign(user, data);
            },
          },
        });
      } catch (error) {
        user = previousUser; rows = previousRows;
        throw error;
      }
    },
  },
});
mockModule("@/lib/stripe", { stripe: {
  checkout: { sessions: { retrieve: async () => session } },
  subscriptions: { retrieve: async () => stripeSubscriptionFixture() },
  webhooks: { constructEvent: () => ({ id: "evt_fixture", type: webhookType,
    data: { object: webhookType === "checkout.session.completed" ? session : stripeSubscriptionFixture() } }) },
} });
mockModule("@/lib/server-auth", { resolveAuthUser: async () => actor
  ? { user: { dbUserId: actor } } : { error: "Authentication required", status: 401 } });
mockModule("next/headers", { headers: async () => new Headers({ "stripe-signature": "fixture-signature" }) });
mockModule("@/lib/email", {
  sendSubscriptionCreatedEmail: async () => {}, sendSubscriptionCancelledEmail: async () => {},
  sendPaymentFailedEmail: async () => {}, sendSubscriptionRenewalEmail: async () => {},
});
const activationRoute = require("../app/api/subscriptions/activate/route");
const webhookRoute = require("../app/api/webhooks/stripe/route");
const activateRequest = () => new NextRequest("http://fixture/api/subscriptions/activate", {
  method: "POST", body: JSON.stringify({ sessionId: session.id, contractorId: "ignored", selectedCategories: ["ignored"] }),
});

test("existing activation uses Stripe metadata without browser storage and repeats without duplicate category records", async () => {
  reset();
  for (let attempt = 0; attempt < 2; attempt++) {
    const response: Response = await activationRoute.POST(activateRequest());
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).activated, ["Plumbing", "Painting"]);
  }
  assert.equal(rows.size, 2);
  assert.equal(user.subscriptionPlan, "HANDYMAN");
  assert.deepEqual(JSON.parse(user.selectedCategories), ["general", "Plumbing", "Painting"]);
});

test("legacy checkout metadata confirms the original categories without migrating its plan or pricing", async () => {
  reset();
  session.metadata = { userId: "owner", pricingMode: "per_category", categories: '["plumbing","deck"]' };
  const response: Response = await activationRoute.POST(activateRequest());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).tier, null);
  assert.equal(rows.get("plumbing")?.monthlyPrice, 39);
  assert.equal(rows.get("deck")?.monthlyPrice, 39);
  assert.equal(user.subscriptionPlan, "FREE", "legacy purchases are not silently migrated to a priced tier");
});

test("the existing signed webhook uses the same confirmed entitlements and real Stripe item period", async () => {
  reset();
  const response: Response = await webhookRoute.POST(new NextRequest("http://fixture/api/webhooks/stripe", { method: "POST", body: "isolated event" }));
  assert.equal(response.status, 200);
  assert.equal(rows.size, 2);
  assert.equal(user.subscriptionPlan, "HANDYMAN");
  assert.equal(rows.get("Plumbing")?.currentPeriodEnd instanceof Date, true);
});
test("unauthorized, unpaid, inactive and cross-customer sessions cannot change entitlement records", async context => {
  context.mock.method(console, "error", () => {});
  const cases = [
    { status: 401, configure: () => { actor = null; } },
    { status: 403, configure: () => { actor = "someone-else"; } },
    { status: 403, configure: () => { subscriptionCustomer = "cus_other"; } },
    { status: 402, configure: () => { session.payment_status = "unpaid"; } },
    { status: 409, configure: () => { subscriptionStatus = "canceled"; } },
    { status: 400, configure: () => { session.metadata = { userId: "owner", pricingMode: "all_access", categories: '["plumbing"]' }; } },
  ];
  for (const entry of cases) {
    reset(); entry.configure();
    const response: Response = await activationRoute.POST(activateRequest());
    assert.equal(response.status, entry.status);
    assert.equal(rows.size, 0);
    assert.equal(user.subscriptionPlan, "FREE");
  }
});

test("category write failures roll back activation and webhook failure is retriable, not acknowledged as success", async context => {
  context.mock.method(console, "error", () => {});
  reset(); failCategory = "Painting";
  const response: Response = await activationRoute.POST(activateRequest());
  assert.equal(response.status, 500);
  assert.equal(rows.size, 0);
  assert.equal(user.subscriptionPlan, "FREE");
  const webhook: Response = await webhookRoute.POST(new NextRequest("http://fixture/api/webhooks/stripe", { method: "POST", body: "isolated event" }));
  assert.equal(webhook.status, 500);
  assert.equal(rows.size, 0);
});

test("subscription lifecycle updates use item periods for every entitlement and retry failed transactions", async context => {
  context.mock.method(console, "error", () => {});
  reset();
  assert.equal((await activationRoute.POST(activateRequest())).status, 200);
  webhookType = "customer.subscription.updated";
  periodEnd = 2_005_184_000;
  subscriptionStatus = "past_due";
  const request = () => new NextRequest("http://fixture/api/webhooks/stripe", { method: "POST", body: "isolated lifecycle" });
  failCategory = "Painting";
  assert.equal((await webhookRoute.POST(request())).status, 500);
  assert.equal(rows.get("Plumbing")?.status, "active", "failed multi-category updates roll back");
  failCategory = "";
  assert.equal((await webhookRoute.POST(request())).status, 200);
  for (const row of rows.values()) {
    assert.equal(row.status, "past_due");
    assert.equal(row.canClaimLeads, false);
    assert.equal(row.canViewLeads, false);
    assert.equal(row.currentPeriodEnd instanceof Date && row.currentPeriodEnd.getTime(), periodEnd * 1000);
  }
  periodEnd = Number.NaN;
  assert.equal((await webhookRoute.POST(request())).status, 500, "invalid provider periods are never acknowledged as applied");
});
