import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isSendableEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

/**
 * GET /api/admin/notification-diagnostics
 *
 * Read-only. Reports the health of the contractor job-notification pipeline so
 * delivery problems can be diagnosed without touching business logic. Mirrors the
 * exact selection + deliverability rules used by NotificationService.notifyAllContractors.
 */
export async function GET(_request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const caller = await prisma.user.findFirst({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { email: true },
  });
  if (!caller?.email || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const [totalContractors, activeContractors] = await Promise.all([
    prisma.user.count({ where: { role: 'contractor' } }),
    prisma.user.count({ where: { role: 'contractor', isActive: true } }),
  ]);

  // Deliverability breakdown over the SAME population the live broadcast selects.
  const active = await prisma.user.findMany({
    where: { role: 'contractor', isActive: true },
    select: { email: true, notifyJobEmail: true },
  });

  let deliverable = 0;
  let invalidEmail = 0;
  let seedAccounts = 0;
  let jobEmailDisabled = 0;

  for (const c of active) {
    const email = (c.email || '').toLowerCase().trim();
    if (c.notifyJobEmail === false) jobEmailDisabled++;
    const domain = email.split('@')[1] || '';
    if (domain === 'example.com' || domain === 'example.org' || domain === 'example.net') seedAccounts++;
    if (isSendableEmail(email)) deliverable++;
    else invalidEmail++;
  }

  const [lastSuccess, lastFailure] = await Promise.all([
    prisma.emailEvent.findFirst({
      where: { type: 'new_job', status: 'sent' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, to: true },
    }),
    prisma.emailEvent.findFirst({
      where: { type: 'new_job', status: 'failed' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, error: true },
    }),
  ]);

  // Rolling 14-day EmailEvent summary grouped by type + status.
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const grouped = await prisma.emailEvent.groupBy({
    by: ['type', 'status'],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  const emailEventSummary = grouped
    .map((g) => ({ type: g.type, status: g.status, count: g._count._all }))
    .sort((a, b) => a.type.localeCompare(b.type) || a.status.localeCompare(b.status));

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    contractors: {
      total: totalContractors,
      active: activeContractors,
      inactive: totalContractors - activeContractors,
    },
    emailDeliverability: {
      deliverable,
      invalidEmail,
      seedAccounts,
      jobEmailDisabled,
    },
    lastNotification: {
      lastSuccessAt: lastSuccess?.createdAt ?? null,
      lastFailureAt: lastFailure?.createdAt ?? null,
      lastFailureError: lastFailure?.error ?? null,
    },
    emailEventSummary,
  });
}
