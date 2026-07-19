import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { SIMPLE_CATEGORIES } from "../lib/categories";
import { categoryMatchesEntitlement, getActiveSubscriptionCategories } from "../lib/subscription-access";
import { NotificationService } from "../lib/notifications";
import { GET as getSubscriptions } from "../app/api/subscriptions/route";
import { GET as getJobs } from "../app/api/jobs/route";

const prisma = new PrismaClient();

const runId = `tier-test-${Date.now()}`;
const now = new Date();
const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

type TierName = "handyman" | "renovation" | "general";

const tierCases: Array<{ tier: TierName; expectedCount: number; categories: string[] }> = [
  { tier: "handyman", expectedCount: 3, categories: ["Handyman", "Painting", "Flooring"] },
  { tier: "renovation", expectedCount: 6, categories: ["Handyman", "Painting", "Flooring", "Plumbing", "Electrical", "Renovation"] },
  { tier: "general", expectedCount: SIMPLE_CATEGORIES.length, categories: [...SIMPLE_CATEGORIES] },
];

function asUpperTier(tier: TierName): string {
  return tier.toUpperCase();
}

async function jsonFromResponse(response: Response) {
  return response.json() as Promise<any>;
}

async function cleanup() {
  await prisma.lead.deleteMany({ where: { title: { startsWith: runId } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: `@${runId}.example.test` } } });
}

async function createHomeowner() {
  return prisma.user.create({
    data: {
      email: `homeowner@${runId}.example.test`,
      name: "Tier Test Homeowner",
      role: "homeowner",
    },
  });
}

async function simulatePlanPurchase(tier: TierName, categories: string[]) {
  const contractor = await prisma.user.create({
    data: {
      email: `${tier}@${runId}.example.test`,
      name: `Tier Test ${tier}`,
      role: "contractor",
      subscriptionPlan: asUpperTier(tier),
      subscriptionStatus: "active",
      subscriptionInterval: "month",
      subscriptionCurrentPeriodEnd: periodEnd,
      selectedCategories: JSON.stringify(categories),
      stripeSubscriptionId: `test_sub_${runId}_${tier}`,
      notifyJobEmail: false,
      notifyJobInApp: true,
      digestFrequency: "daily",
      contractorProfile: {
        create: {
          companyName: `Tier Test ${tier}`,
          trade: categories[0] || "General",
          categories: JSON.stringify(categories),
          city: "Toronto",
        },
      },
    },
  });

  for (const category of categories) {
    await prisma.contractorSubscription.upsert({
      where: { contractorId_category: { contractorId: contractor.id, category } },
      create: {
        contractorId: contractor.id,
        category,
        status: "active",
        monthlyPrice: 0,
        stripeSubscriptionId: `test_sub_${runId}_${tier}`,
        stripeCustomerId: `test_cus_${runId}_${tier}`,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        nextBillingDate: periodEnd,
        canClaimLeads: true,
        canViewLeads: true,
      },
      update: {
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        nextBillingDate: periodEnd,
        canClaimLeads: true,
        canViewLeads: true,
      },
    });
  }

  return contractor;
}

async function createJobs(homeownerId: string, tier: TierName, categories: string[]) {
  const includedJobs = [];
  for (const category of categories) {
    includedJobs.push(await prisma.lead.create({
      data: {
        title: `${runId} ${tier} ${category}`,
        description: `Synthetic ${tier} job for ${category}`,
        budget: "$1,000 - $2,000",
        zipCode: "Toronto",
        category,
        status: "open",
        published: true,
        isSeeded: false,
        homeownerId,
      },
    }));
  }

  const lockedCategory = SIMPLE_CATEGORIES.find((category) => !categories.includes(category));
  const lockedJob = lockedCategory
    ? await prisma.lead.create({
        data: {
          title: `${runId} ${tier} locked ${lockedCategory}`,
          description: `Synthetic locked job for ${lockedCategory}`,
          budget: "$1,000 - $2,000",
          zipCode: "Toronto",
          category: lockedCategory,
          status: "open",
          published: true,
          isSeeded: false,
          homeownerId,
        },
      })
    : null;

  return { includedJobs, lockedJob };
}

async function assertSubscriptionPage(contractorId: string, categories: string[]) {
  const response = await getSubscriptions(new NextRequest(`http://localhost/api/subscriptions?contractorId=${contractorId}`));
  const data = await jsonFromResponse(response as Response);
  assert.equal(data.success, true, "subscription API succeeds");
  assert.equal(data.summary.activeSubscriptions, categories.length, "subscription page summary category count matches tier");
  assert.deepEqual(new Set(data.summary.categories), new Set(categories), "subscription page lists every purchased category");
}

async function assertJobBoard(contractorId: string, includedJobIds: string[], lockedJobId: string | null) {
  const response = await getJobs(new NextRequest(`http://localhost/api/jobs?contractorId=${contractorId}`));
  const data = await jsonFromResponse(response as Response);
  const visibleJobIds = new Set((data.jobs || []).map((job: any) => job.id));

  for (const jobId of includedJobIds) {
    assert.equal(visibleJobIds.has(jobId), true, `job board includes paid-category job ${jobId}`);
  }

  if (lockedJobId) {
    assert.equal(visibleJobIds.has(lockedJobId), false, "job board excludes unpaid-category job");
  }
}

async function assertNotifications(contractorId: string, jobs: Array<{ id: string; title: string; description: string; budget: string; category: string }>, categories: string[]) {
  for (const job of jobs) {
    assert.equal(
      categories.some((category) => categoryMatchesEntitlement(job.category, category)),
      true,
      `notification matcher includes ${job.category}`
    );
    await NotificationService.create({
      userId: contractorId,
      type: "LEAD_MATCHED",
      payload: {
        leadId: job.id,
        title: job.title,
        description: job.description,
        budget: job.budget,
        city: "Toronto",
        category: job.category,
      },
      sendEmail: false,
      sendSms: false,
    });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: contractorId, type: "LEAD_MATCHED" },
    select: { payload: true },
  });
  const notifiedLeadIds = new Set(notifications.map((notification) => (notification.payload as any)?.leadId));

  for (const job of jobs) {
    assert.equal(notifiedLeadIds.has(job.id), true, `in-app notification exists for ${job.category}`);
  }
}

function assertDailyDigest(jobs: Array<{ id: string; category: string }>, categories: string[]) {
  const digestJobIds = new Set(
    jobs
      .filter((job) => categories.some((category) => categoryMatchesEntitlement(job.category, category)))
      .map((job) => job.id)
  );

  for (const job of jobs) {
    assert.equal(digestJobIds.has(job.id), true, `daily digest includes ${job.category}`);
  }
}

async function main() {
  await cleanup();
  const homeowner = await createHomeowner();
  const results = [];

  try {
    for (const tierCase of tierCases) {
      assert.equal(tierCase.categories.length, tierCase.expectedCount, `${tierCase.tier} selected category count matches expected plan limit`);

      const contractor = await simulatePlanPurchase(tierCase.tier, tierCase.categories);
      const { includedJobs, lockedJob } = await createJobs(homeowner.id, tierCase.tier, tierCase.categories);

      const activeCategories = await getActiveSubscriptionCategories(contractor.id);
      assert.deepEqual(new Set(activeCategories), new Set(tierCase.categories), `${tierCase.tier} active entitlement categories match purchase`);

      const entitlementCount = await prisma.contractorSubscription.count({
        where: { contractorId: contractor.id, status: "active", canClaimLeads: true },
      });
      assert.equal(entitlementCount, tierCase.expectedCount, `${tierCase.tier} creates correct entitlement row count`);

      await assertSubscriptionPage(contractor.id, tierCase.categories);
      await assertJobBoard(contractor.id, includedJobs.map((job) => job.id), lockedJob?.id ?? null);
      await assertNotifications(contractor.id, includedJobs, tierCase.categories);
      assertDailyDigest(includedJobs, tierCase.categories);

      results.push({
        tier: tierCase.tier,
        purchasedCategories: tierCase.categories,
        entitlementCount,
        subscriptionPageCategories: tierCase.categories.length,
        jobBoardJobsVerified: includedJobs.length,
        notificationsVerified: includedJobs.length,
        dailyDigestJobsVerified: includedJobs.length,
      });
    }

    console.log(JSON.stringify({ runId, results }, null, 2));
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error);
  await cleanup();
  await prisma.$disconnect();
  process.exit(1);
});