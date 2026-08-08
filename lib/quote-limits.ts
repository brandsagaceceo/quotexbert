import { prisma } from '@/lib/prisma';

/** Maximum number of distinct contractors that may have an active submitted quote on one job. */
export const MAX_ACTIVE_QUOTES_PER_JOB = 5;

// Statuses (case-insensitive) that mean a quote is actively submitted and occupies a slot.
export const ACTIVE_QUOTE_STATUSES = new Set(['sent', 'revision_requested', 'accepted']);

export function isActiveQuoteStatus(status: string | null | undefined): boolean {
  return ACTIVE_QUOTE_STATUSES.has((status || '').toLowerCase());
}

export interface QuoteSlotRecord {
  contractorId: string;
  status: string | null;
}

export function evaluateQuoteSlotAccess(
  quotes: QuoteSlotRecord[],
  contractorId: string,
): { allowed: boolean; activeCount: number } {
  const activeContractorIds = new Set(
    quotes.filter((quote) => isActiveQuoteStatus(quote.status)).map((quote) => quote.contractorId)
  );
  const activeCount = activeContractorIds.size;

  return {
    allowed: activeContractorIds.has(contractorId) || activeCount < MAX_ACTIVE_QUOTES_PER_JOB,
    activeCount,
  };
}

/**
 * Decide whether `contractorId` may submit/re-submit a quote for `jobId`.
 *
 * A contractor who already has an active quote can always resubmit or revise —
 * it replaces their existing slot rather than adding a new one. A *new* contractor
 * is blocked once MAX_ACTIVE_QUOTES_PER_JOB distinct contractors already hold an
 * active quote on the job. Slots reopen automatically when a quote leaves the
 * active set (withdrawn / declined / expired / superseded).
 */
export async function canSubmitQuote(
  jobId: string,
  contractorId: string
): Promise<{ allowed: boolean; activeCount: number }> {
  const quotes = await prisma.quote.findMany({
    where: { jobId },
    select: { contractorId: true, status: true },
  });

  return evaluateQuoteSlotAccess(quotes, contractorId);
}
