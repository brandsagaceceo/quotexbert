/**
 * Shared contractor metrics computation.
 *
 * Single source of truth for Jobs Accepted / Jobs Completed / Conversion Rate.
 * Used by: /api/contractors/profile, /api/profile, contractor profile pages.
 */

import { prisma } from '@/lib/prisma';

export interface ContractorMetrics {
  jobsAccepted: number;
  jobsCompleted: number;
  conversionRate: number; // 0–1 (completed / accepted)
}

/**
 * Compute contractor metrics from the database.
 *
 * - jobsAccepted  = leads where this contractor is acceptedById OR contractorId with status != 'open'
 * - jobsCompleted = leads tied to this contractor with status 'completed'
 * - conversionRate = completed / accepted (0 if no accepted)
 */
export async function getContractorMetrics(contractorDbId: string): Promise<ContractorMetrics> {
  const [acceptedCount, completedCount] = await Promise.all([
    prisma.lead.count({
      where: {
        OR: [
          { acceptedById: contractorDbId },
          { contractorId: contractorDbId, status: { not: 'open' } },
        ],
      },
    }),
    prisma.lead.count({
      where: {
        OR: [
          { acceptedById: contractorDbId, status: 'completed' },
          { contractorId: contractorDbId, status: 'completed' },
        ],
      },
    }),
  ]);

  return {
    jobsAccepted: acceptedCount,
    jobsCompleted: completedCount,
    conversionRate: acceptedCount > 0 ? completedCount / acceptedCount : 0,
  };
}
