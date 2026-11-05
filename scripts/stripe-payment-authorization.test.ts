import assert from "node:assert/strict";
import fs from "node:fs";
import {
  isStripePaymentMethodOwnedByCustomer,
  resolveOwnedStripeCustomerId,
  StripeCustomerOwnershipError,
} from "../lib/stripe-customer-ownership";

const source = (path: string) => fs.readFileSync(path, "utf8");
const paymentSetup = source("app/api/payments/setup/route.ts");
const setupIntent = source("app/api/stripe/setup-intent/route.ts");
const serverAuth = source("lib/server-auth.ts");
const billingPage = source("app/billing/page.tsx");

assert.match(paymentSetup, /const authResult = await resolveAuthUser\(\)/);
assert.match(
  paymentSetup,
  /export async function GET[\s\S]*?resolveAuthUser\(\)/,
);
assert.match(
  paymentSetup,
  /export async function DELETE[\s\S]*?resolveAuthUser\(\)/,
);
assert.match(
  paymentSetup,
  /getAccount\(authResult\.user\.dbUserId\)/,
  "POST uses the authenticated database identity",
);
assert.match(
  paymentSetup,
  /userId: authResult\.user\.dbUserId,\s*isActive: true/,
  "GET lists only the authenticated account's active payment methods",
);
assert.match(
  paymentSetup,
  /userId: account\.id,\s*isActive: true/,
  "DELETE scopes the payment-method lookup to the authenticated owner",
);
assert.match(
  paymentSetup,
  /isStripePaymentMethodOwnedByCustomer/,
  "attachment and removal verify Stripe customer association",
);
assert.match(
  paymentSetup,
  /invoice_settings: \{ default_payment_method: paymentMethodId \}/,
  "default card changes target the verified owner customer",
);
assert.match(
  paymentSetup,
  /attachedCustomerId &&[\s\S]*isStripePaymentMethodOwnedByCustomer/,
  "default-card updates reject payment methods attached to another customer",
);
assert.match(
  paymentSetup,
  /attachedCustomerId === stripeCustomerId\)[\s\S]*?stripe\.paymentMethods\.detach\(paymentMethod\.stripePaymentMethodId\)/,
  "only the already-verified owner's payment method is detached",
);
assert.doesNotMatch(
  paymentSetup,
  /const \{ userId, paymentMethodId|searchParams\.get\(['"]userId['"]\)/,
  "client-provided identity is not used by payment-method operations",
);

assert.match(setupIntent, /const authResult = await resolveAuthUser\(\)/);
assert.match(
  setupIntent,
  /where: \{ id: authResult\.user\.dbUserId \}/,
  "SetupIntent account lookup uses the resolved Clerk identity",
);
assert.match(
  setupIntent,
  /resolveOwnedStripeCustomerId/,
  "SetupIntents require an ownership-verified Stripe customer",
);
assert.match(
  setupIntent,
  /contractorBilling\.upsert/,
  "billing customer persistence uses PostgreSQL-compatible Prisma",
);
assert.doesNotMatch(
  setupIntent,
  /\$executeRaw|randomblob|createOrGetStripeCustomer/,
  "SetupIntent no longer uses SQLite SQL or email-only customer lookup",
);
assert.match(
  setupIntent,
  /clientSecret: setupIntent\.client_secret,\s*customerId: stripeCustomerId/,
  "the existing client response contract remains available",
);

assert.match(
  serverAuth,
  /OR: \[\{ id: clerkId \}, \{ clerkUserId: clerkId \}\]/,
  "both legacy Clerk/database identity mappings are resolved",
);
assert.match(
  billingPage,
  /fetch\('\/api\/stripe\/setup-intent'/,
  "the existing billing page still calls the SetupIntent API",
);
assert.match(
  billingPage,
  /stripe\.confirmCardSetup\(clientSecret/,
  "the billing page can still confirm the returned SetupIntent",
);

async function testOwnedCustomerReuse() {
  let retrievedCustomerId: string | null = null;
  let createCalls = 0;
  const stripeCustomer = await resolveOwnedStripeCustomerId({
    userId: "db-user-1",
    email: "one@example.test",
    name: "One",
    userStripeCustomerId: "cus_user_1",
    billingStripeCustomerId: "cus_user_1",
    retrieveCustomer: async (customerId) => {
      retrievedCustomerId = customerId;
      return {
        id: customerId,
        metadata: { userId: "db-user-1" },
      };
    },
    createCustomer: async () => {
      createCalls += 1;
      return { id: "cus_created", metadata: { userId: "db-user-1" } };
    },
  });

  assert.equal(stripeCustomer, "cus_user_1");
  assert.equal(retrievedCustomerId, "cus_user_1");
  assert.equal(
    createCalls,
    0,
    "an owned customer is reused without creating another",
  );
}

async function testNewCustomerHasServerOwnedMetadata() {
  let createParams: {
    email: string;
    name?: string;
    metadata: { userId: string };
  } | null = null;
  const stripeCustomer = await resolveOwnedStripeCustomerId({
    userId: "db-user-2",
    email: "two@example.test",
    name: null,
    userStripeCustomerId: null,
    billingStripeCustomerId: null,
    retrieveCustomer: async () => {
      throw new Error("no linked customer should be retrieved");
    },
    createCustomer: async (params) => {
      createParams = params;
      return { id: "cus_new", metadata: params.metadata };
    },
  });

  assert.equal(stripeCustomer, "cus_new");
  assert.deepEqual(createParams, {
    email: "two@example.test",
    metadata: { userId: "db-user-2" },
  });
}

async function testConflictingCustomerIdsFailClosed() {
  let stripeCalls = 0;
  await assert.rejects(
    resolveOwnedStripeCustomerId({
      userId: "db-user-3",
      email: "three@example.test",
      name: null,
      userStripeCustomerId: "cus_user",
      billingStripeCustomerId: "cus_other",
      retrieveCustomer: async () => {
        stripeCalls += 1;
        return { id: "cus_user", metadata: { userId: "db-user-3" } };
      },
      createCustomer: async () => {
        stripeCalls += 1;
        return { id: "cus_new", metadata: { userId: "db-user-3" } };
      },
    }),
    StripeCustomerOwnershipError,
  );
  assert.equal(
    stripeCalls,
    0,
    "conflicts fail before Stripe access or mutation",
  );
}

async function testExistingCustomerMetadataMustMatchOwner() {
  await assert.rejects(
    resolveOwnedStripeCustomerId({
      userId: "db-user-4",
      email: "four@example.test",
      name: null,
      userStripeCustomerId: "cus_someone_else",
      billingStripeCustomerId: null,
      retrieveCustomer: async (id) => ({
        id,
        metadata: { userId: "db-user-victim" },
      }),
      createCustomer: async () => {
        throw new Error("must not replace an unverifiable linked customer");
      },
    }),
    StripeCustomerOwnershipError,
  );
}

function testPaymentMethodCustomerAssociation() {
  assert.equal(
    isStripePaymentMethodOwnedByCustomer("cus_owner", "cus_owner"),
    true,
  );
  assert.equal(
    isStripePaymentMethodOwnedByCustomer("cus_victim", "cus_owner"),
    false,
  );
  assert.equal(
    isStripePaymentMethodOwnedByCustomer(null, "cus_owner"),
    true,
    "an unattached payment method may be attached to its authenticated owner's customer",
  );
}

async function run() {
  await testOwnedCustomerReuse();
  await testNewCustomerHasServerOwnedMetadata();
  await testConflictingCustomerIdsFailClosed();
  await testExistingCustomerMetadataMustMatchOwner();
  testPaymentMethodCustomerAssociation();
  console.log("Stripe payment authorization tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
