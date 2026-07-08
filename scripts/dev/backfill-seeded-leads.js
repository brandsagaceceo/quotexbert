/**
 * One-time backfill script: marks all existing seeded/demo leads as isSeeded=true.
 * Safe to run multiple times (idempotent).
 * 
 * Run with: node backfill-seeded-leads.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillSeeded() {
  // Find all seeded homeowner accounts by well-known seed email patterns
  const seededHomeowners = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: '@example.com' } },
        { email: 'demo@homeowner.com' },
        { email: 'homeowner@quotexbert.com' },
        { email: 'demo-homeowner@quotexbert.com' },
        { email: { startsWith: 'demo_' } },
      ]
    },
    select: { id: true, email: true }
  });

  console.log('Seeded homeowner accounts found:', seededHomeowners.length);
  seededHomeowners.forEach(h => console.log(' -', h.email, '(id:', h.id + ')'));

  if (seededHomeowners.length === 0) {
    console.log('No seeded accounts found — nothing to backfill.');
    await prisma.$disconnect();
    return;
  }

  const seededIds = seededHomeowners.map(h => h.id);

  // Mark all their leads as isSeeded=true
  const result = await prisma.lead.updateMany({
    where: { homeownerId: { in: seededIds } },
    data: { isSeeded: true }
  });

  console.log('Leads marked as isSeeded=true:', result.count);
  console.log('Backfill complete. These leads will no longer appear on the production job board.');
  await prisma.$disconnect();
}

backfillSeeded().catch(e => {
  console.error('Backfill failed:', e);
  process.exit(1);
});
