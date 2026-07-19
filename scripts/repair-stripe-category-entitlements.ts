import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { parseSubscriptionMetadataCategories } from "../lib/subscription-categories";

const prisma = new PrismaClient();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const write = process.argv.includes("--write");
const targetSubscriptionArg = process.argv.find((arg) => arg.startsWith("--subscription="));
const targetSubscriptionId = targetSubscriptionArg?.split("=")[1];

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY is not configured.");
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

function redact(value: string | null | undefined): string | null {
  if (!value) return null;
  return `${value.slice(0, 8)}...`;
}

async function main() {
  const users = await prisma.user.findMany({
    where: {
      role: "contractor",
      stripeSubscriptionId: targetSubscriptionId ? targetSubscriptionId : { not: null },
    },
    select: {
      id: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
      subscriptions: { select: { category: true, status: true, canClaimLeads: true } },
    },
  });

  const now = new Date();
  const report = [];

  for (const user of users) {
    if (!user.stripeSubscriptionId) continue;

    const sessions = await stripe.checkout.sessions.list({
      subscription: user.stripeSubscriptionId,
      limit: 10,
    });

    const selectedCategories = Array.from(
      new Set(
        sessions.data.flatMap((session) => parseSubscriptionMetadataCategories(session.metadata?.selectedCategories))
      )
    );

    if (selectedCategories.length === 0) continue;

    const existingCategories = new Set(user.subscriptions.map((subscription) => subscription.category));
    const missingCategories = selectedCategories.filter((category) => !existingCategories.has(category));

    if (write) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currentPeriodStart = "current_period_start" in subscription
        ? new Date((subscription.current_period_start as number) * 1000)
        : now;
      const currentPeriodEnd = "current_period_end" in subscription
        ? new Date((subscription.current_period_end as number) * 1000)
        : user.subscriptionCurrentPeriodEnd;

      for (const category of selectedCategories) {
        await prisma.contractorSubscription.upsert({
          where: { contractorId_category: { contractorId: user.id, category } },
          create: {
            contractorId: user.id,
            category,
            status: subscription.status,
            monthlyPrice: 0,
            stripeSubscriptionId: user.stripeSubscriptionId,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodStart,
            currentPeriodEnd,
            nextBillingDate: currentPeriodEnd,
            canClaimLeads: subscription.status === "active" || subscription.status === "trialing",
            canViewLeads: subscription.status === "active" || subscription.status === "trialing",
          },
          update: {
            status: subscription.status,
            stripeSubscriptionId: user.stripeSubscriptionId,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodStart,
            currentPeriodEnd,
            nextBillingDate: currentPeriodEnd,
            canClaimLeads: subscription.status === "active" || subscription.status === "trialing",
            canViewLeads: subscription.status === "active" || subscription.status === "trialing",
          },
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { selectedCategories: JSON.stringify(selectedCategories) },
      });
    }

    report.push({
      contractorId: redact(user.id),
      stripeSubscriptionId: redact(user.stripeSubscriptionId),
      stripeSelectedCategories: selectedCategories,
      existingDbCategories: user.subscriptions.map((subscription) => subscription.category),
      missingCategories,
      writeApplied: write,
    });
  }

  console.log(JSON.stringify({ mode: write ? "write" : "dry-run", report }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });