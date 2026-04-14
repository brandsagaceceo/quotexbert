/**
 * inspect-user.ts
 *
 * READ-ONLY admin/debug script — inspects a single user by email.
 * Does NOT write, update, or delete anything.
 *
 * Usage:
 *   npx tsx scripts/inspect-user.ts
 *   npx tsx scripts/inspect-user.ts someone@example.com
 *
 * The email defaults to the first CLI argument, or falls back to
 * DEFAULT_EMAIL below.
 */

import { PrismaClient } from '@prisma/client';

// ─── Config ──────────────────────────────────────────────────────────────────

const DEFAULT_EMAIL = 'nasaloron@gmail.com';

// Number of recent records to show for each section
const RECENT_LIMIT = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const prisma = new PrismaClient();

const targetEmail = process.argv[2] ?? DEFAULT_EMAIL;

/** Print a titled section divider */
function section(title: string) {
  console.log('\n' + '─'.repeat(60));
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

/** Format a nullable date to a readable string */
function fmt(d: Date | string | null | undefined): string {
  if (!d) return '(none)';
  return new Date(d).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

/** Format a money value */
function money(n: number | null | undefined): string {
  if (n == null) return '(none)';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍  QuoteXbert — User Inspector`);
  console.log(`    Target email: ${targetEmail}`);
  console.log(`    Timestamp   : ${new Date().toISOString()}`);
  console.log(`    Mode        : READ-ONLY — no data will be modified`);

  // ── 1. User record ──────────────────────────────────────────────────────────
  section('1 / USER IDENTITY');

  const user = await prisma.user.findUnique({
    where: { email: targetEmail },
    include: {
      contractorProfile: {
        select: {
          id: true,
          companyName: true,
          trade: true,
          city: true,
          verified: true,
          avgRating: true,
          reviewCount: true,
          completedJobs: true,
          createdAt: true,
        },
      },
      homeownerProfile: {
        select: {
          id: true,
          name: true,
          city: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    console.log(`\n  ❌  No user found with email: ${targetEmail}`);
    console.log(
      `      If this is a new signup, they may not have completed role selection yet.\n`,
    );
    await prisma.$disconnect();
    return;
  }

  console.log(`  id           : ${user.id}`);
  console.log(`  clerkUserId  : ${user.clerkUserId ?? '(null — role-selection created user or unfixed)'}`);
  console.log(`  email        : ${user.email}`);
  console.log(`  name         : ${user.name ?? '(none)'}`);
  console.log(`  role         : ${user.role ?? '(not set — not completed onboarding)'}`);
  console.log(`  isActive     : ${user.isActive}`);
  console.log(`  createdAt    : ${fmt(user.createdAt)}`);
  console.log(`  lastSeen     : ${fmt(user.lastSeen)}`);
  console.log(`  subscription : plan=${user.subscriptionPlan ?? 'none'}  status=${user.subscriptionStatus ?? 'none'}`);
  console.log(
    `  proOverride  : enabled=${user.proOverrideEnabled ?? false}  tier=${user.proOverrideTier ?? 'none'}  expires=${fmt(user.proOverrideExpiresAt)}`,
  );

  const userId = user.id;

  // ── 2. Profile info ─────────────────────────────────────────────────────────
  section('2 / PROFILE INFO');

  if (user.contractorProfile) {
    const cp = user.contractorProfile;
    console.log('  ✅  Has CONTRACTOR profile');
    console.log(`      profile id   : ${cp.id}`);
    console.log(`      companyName  : ${cp.companyName}`);
    console.log(`      trade        : ${cp.trade}`);
    console.log(`      city         : ${cp.city ?? '(none)'}`);
    console.log(`      verified     : ${cp.verified}`);
    console.log(`      avgRating    : ${cp.avgRating}  (${cp.reviewCount} reviews)`);
    console.log(`      completedJobs: ${cp.completedJobs}`);
    console.log(`      profileCreated: ${fmt(cp.createdAt)}`);
  } else {
    console.log('  —   No contractor profile');
  }

  if (user.homeownerProfile) {
    const hp = user.homeownerProfile;
    console.log('  ✅  Has HOMEOWNER profile');
    console.log(`      profile id   : ${hp.id}`);
    console.log(`      name         : ${hp.name ?? '(none)'}`);
    console.log(`      city         : ${hp.city ?? '(none)'}`);
    console.log(`      profileCreated: ${fmt(hp.createdAt)}`);
  } else {
    console.log('  —   No homeowner profile');
  }

  if (!user.contractorProfile && !user.homeownerProfile) {
    console.log('  ⚠️   No profile of either type — user may not have finished onboarding');
  }

  // ── 3. Quote activity ───────────────────────────────────────────────────────
  section('3 / QUOTE ACTIVITY');

  // Quotes where user is the contractor
  const quotesAsContractor = await prisma.quote.findMany({
    where: { contractorId: userId },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      title: true,
      status: true,
      totalCost: true,
      version: true,
      confidenceScore: true,
      isEdited: true,
      createdAt: true,
      sentAt: true,
      acceptedAt: true,
      conversationId: true,
      jobId: true,
    },
  });

  const totalQuotesAsContractor = await prisma.quote.count({ where: { contractorId: userId } });

  // Quotes on leads the user owns as homeowner (through job → conversation)
  const quotesOnMyLeads = await prisma.quote.findMany({
    where: { job: { homeownerId: userId } },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      title: true,
      status: true,
      totalCost: true,
      version: true,
      createdAt: true,
      sentAt: true,
      acceptedAt: true,
      conversationId: true,
      jobId: true,
    },
  });

  const totalQuotesOnMyLeads = await prisma.quote.count({
    where: { job: { homeownerId: userId } },
  });

  if (totalQuotesAsContractor === 0 && totalQuotesOnMyLeads === 0) {
    console.log('  —   No quote activity found for this user');
  }

  if (totalQuotesAsContractor > 0) {
    console.log(`  As CONTRACTOR — ${totalQuotesAsContractor} total quote(s) generated`);
    console.log(`  Showing latest ${Math.min(RECENT_LIMIT, quotesAsContractor.length)}:`);
    for (const q of quotesAsContractor) {
      console.log(`\n    quote id     : ${q.id}`);
      console.log(`    title        : ${q.title}`);
      console.log(`    status       : ${q.status}  (v${q.version ?? 1})`);
      console.log(`    totalCost    : ${money(q.totalCost)}`);
      console.log(`    aiConfidence : ${q.confidenceScore != null ? Math.round(q.confidenceScore * 100) + '%' : '(none)'}`);
      console.log(`    edited       : ${q.isEdited}`);
      console.log(`    createdAt    : ${fmt(q.createdAt)}`);
      console.log(`    sentAt       : ${fmt(q.sentAt)}`);
      console.log(`    acceptedAt   : ${fmt(q.acceptedAt)}`);
      console.log(`    conversationId: ${q.conversationId}`);
      console.log(`    jobId        : ${q.jobId}`);
    }
  }

  if (totalQuotesOnMyLeads > 0) {
    console.log(`\n  As HOMEOWNER — ${totalQuotesOnMyLeads} quote(s) on their lead(s)`);
    console.log(`  Showing latest ${Math.min(RECENT_LIMIT, quotesOnMyLeads.length)}:`);
    for (const q of quotesOnMyLeads) {
      console.log(`\n    quote id     : ${q.id}`);
      console.log(`    title        : ${q.title}`);
      console.log(`    status       : ${q.status}  (v${q.version ?? 1})`);
      console.log(`    totalCost    : ${money(q.totalCost)}`);
      console.log(`    createdAt    : ${fmt(q.createdAt)}`);
      console.log(`    sentAt       : ${fmt(q.sentAt)}`);
      console.log(`    acceptedAt   : ${fmt(q.acceptedAt)}`);
      console.log(`    conversationId: ${q.conversationId}`);
      console.log(`    jobId        : ${q.jobId}`);
    }
  }

  // ── 4. Lead / estimate activity ─────────────────────────────────────────────
  section('4 / LEAD & ESTIMATE ACTIVITY');

  // Leads they created as homeowner
  const leadsAsHomeowner = await prisma.lead.findMany({
    where: { homeownerId: userId },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      budget: true,
      published: true,
      zipCode: true,
      createdAt: true,
      contractorId: true,
    },
  });

  const totalLeadsAsHomeowner = await prisma.lead.count({ where: { homeownerId: userId } });

  // Leads they claimed/contracted
  const leadsAsContractor = await prisma.lead.findMany({
    where: {
      OR: [{ contractorId: userId }, { acceptedById: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      budget: true,
      createdAt: true,
      homeownerId: true,
    },
  });

  const totalLeadsAsContractor = await prisma.lead.count({
    where: { OR: [{ contractorId: userId }, { acceptedById: userId }] },
  });

  // AI estimates
  const aiEstimates = await prisma.aIEstimate.findMany({
    where: { homeownerId: userId },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      description: true,
      minCost: true,
      maxCost: true,
      confidence: true,
      status: true,
      isPublic: true,
      leadId: true,
      createdAt: true,
    },
  });

  const totalAiEstimates = await prisma.aIEstimate.count({ where: { homeownerId: userId } });

  // Job applications (contractor applying to leads)
  const totalApplications = await prisma.jobApplication.count({ where: { contractorId: userId } });

  if (totalLeadsAsHomeowner > 0) {
    console.log(`  As HOMEOWNER — ${totalLeadsAsHomeowner} lead(s) posted`);
    console.log(`  Showing latest ${Math.min(RECENT_LIMIT, leadsAsHomeowner.length)}:`);
    for (const l of leadsAsHomeowner) {
      console.log(`\n    lead id      : ${l.id}`);
      console.log(`    title        : ${l.title}`);
      console.log(`    category     : ${l.category}`);
      console.log(`    status       : ${l.status}`);
      console.log(`    budget       : ${l.budget}`);
      console.log(`    published    : ${l.published}`);
      console.log(`    zipCode      : ${l.zipCode}`);
      console.log(`    contractorId : ${l.contractorId ?? '(none — not yet assigned)'}`);
      console.log(`    createdAt    : ${fmt(l.createdAt)}`);
    }
  } else {
    console.log('  —   No leads posted as homeowner');
  }

  if (totalLeadsAsContractor > 0) {
    console.log(`\n  As CONTRACTOR — ${totalLeadsAsContractor} lead(s) claimed or accepted`);
    console.log(`  Showing latest ${Math.min(RECENT_LIMIT, leadsAsContractor.length)}:`);
    for (const l of leadsAsContractor) {
      console.log(`\n    lead id      : ${l.id}`);
      console.log(`    title        : ${l.title}`);
      console.log(`    category     : ${l.category}`);
      console.log(`    status       : ${l.status}`);
      console.log(`    homeownerId  : ${l.homeownerId}`);
      console.log(`    createdAt    : ${fmt(l.createdAt)}`);
    }
  } else {
    console.log('  —   No leads claimed/accepted as contractor');
  }

  if (totalApplications > 0) {
    console.log(`\n  Job applications submitted (contractor): ${totalApplications}`);
  }

  if (totalAiEstimates > 0) {
    console.log(`\n  AI Estimates — ${totalAiEstimates} estimate(s) generated`);
    console.log(`  Showing latest ${Math.min(RECENT_LIMIT, aiEstimates.length)}:`);
    for (const e of aiEstimates) {
      console.log(`\n    estimate id  : ${e.id}`);
      console.log(`    description  : ${e.description.slice(0, 80)}${e.description.length > 80 ? '…' : ''}`);
      console.log(`    range        : ${money(e.minCost)} – ${money(e.maxCost)}`);
      console.log(`    confidence   : ${Math.round(e.confidence)}%`);
      console.log(`    status       : ${e.status}  (public: ${e.isPublic})`);
      console.log(`    linkedLeadId : ${e.leadId ?? '(none)'}`);
      console.log(`    createdAt    : ${fmt(e.createdAt)}`);
    }
  } else {
    console.log('  —   No AI estimates found');
  }

  // ── 5. Messaging activity ───────────────────────────────────────────────────
  section('5 / MESSAGING ACTIVITY');

  // Resolve ALL DB ids for this user (handles id≠clerkUserId accounts)
  const allUserRows = await prisma.user.findMany({
    where: {
      OR: [
        { id: userId },
        ...(user.clerkUserId ? [{ clerkUserId: user.clerkUserId }] : []),
      ],
    },
    select: { id: true },
  });
  const allDbIds = [...new Set(allUserRows.map((r) => r.id))];

  // Threads where user is the homeowner or contractor on the lead
  const threads = await prisma.thread.findMany({
    where: {
      OR: [
        { lead: { homeownerId: { in: allDbIds } } },
        { lead: { contractorId: { in: allDbIds } } },
        {
          messages: {
            some: {
              OR: [
                { fromUserId: { in: allDbIds } },
                { toUserId: { in: allDbIds } },
              ],
            },
          },
        },
      ],
    },
    include: {
      lead: {
        select: { id: true, title: true, homeownerId: true, contractorId: true },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { id: true, body: true, fromUserId: true, createdAt: true, readAt: true },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Total messages sent and received across all threads
  const sentCount = await prisma.message.count({
    where: { fromUserId: { in: allDbIds } },
  });
  const receivedCount = await prisma.message.count({
    where: { toUserId: { in: allDbIds } },
  });
  const unreadCount = await prisma.message.count({
    where: { toUserId: { in: allDbIds }, readAt: null },
  });

  console.log(`  DB ids resolved : ${allDbIds.join(', ')}`);
  console.log(`  Threads found   : ${threads.length}`);
  console.log(`  Messages sent   : ${sentCount}`);
  console.log(`  Messages received: ${receivedCount}`);
  console.log(`  Unread (inbox)  : ${unreadCount}`);

  if (threads.length > 0) {
    console.log(`\n  Thread breakdown:`);
    for (const t of threads) {
      const latest = t.messages[0];
      const isMineLatest = latest ? allDbIds.includes(latest.fromUserId) : null;
      console.log(`\n    thread id    : ${t.id}`);
      console.log(`    lead         : [${t.lead.id}] ${t.lead.title}`);
      console.log(`    homeownerId  : ${t.lead.homeownerId}`);
      console.log(`    contractorId : ${t.lead.contractorId ?? '(none)'}`);
      console.log(`    totalMessages: ${t._count.messages}`);
      if (latest) {
        console.log(`    latestMsg at : ${fmt(latest.createdAt)}`);
        console.log(`    latestMsg by : ${latest.fromUserId}${isMineLatest ? ' (this user)' : ''}`);
        console.log(`    latestMsg    : "${latest.body.slice(0, 60)}${latest.body.length > 60 ? '…' : ''}"`);
        console.log(`    readAt       : ${fmt(latest.readAt)}`);
      } else {
        console.log(`    latestMsg    : (no messages yet)`);
      }
    }
  } else {
    console.log('  —   No threads found');
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  section('DONE');
  console.log(`  Inspection complete for: ${targetEmail}`);
  console.log(`  No data was modified.\n`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

main()
  .catch((err) => {
    console.error('\n❌  Unexpected error during inspection:');
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
