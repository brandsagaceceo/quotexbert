import { prisma } from "@/lib/prisma";
import { isActiveQuoteStatus } from "@/lib/quote-limits";

export const MAX_PENDING_ACCEPTED_LEADS_PER_CONTRACTOR = 3;

const ACTIVE_LEAD_STATUSES = new Set(["open", "reviewing", "claimed", "assigned", "pending_completion"]);
const REOPENABLE_LEAD_STATUSES = new Set(["open", "reviewing", "claimed"]);
const WITHDRAWABLE_ACCEPTANCE_STATUSES = new Set(["accepted", "quoted"]);

export function canRequestMoreQuotes(status: string, acceptedById: string | null): boolean {
  return !acceptedById && REOPENABLE_LEAD_STATUSES.has(status.toLowerCase());
}

export function canWithdrawFromJob(
  acceptanceStatus: string,
  acceptedById: string | null,
  contractorId: string,
): boolean {
  return acceptedById !== contractorId && WITHDRAWABLE_ACCEPTANCE_STATUSES.has(acceptanceStatus.toLowerCase());
}

export function isPendingAcceptedLead(
  leadStatus: string,
  acceptedById: string | null,
  hasActiveQuote: boolean,
): boolean {
  return ACTIVE_LEAD_STATUSES.has(leadStatus.toLowerCase()) && !acceptedById && !hasActiveQuote;
}

/**
 * Pending accepted leads = contractor accepted/interested, lead still active,
 * and contractor has not submitted an active quote on that project yet.
 */
export async function countPendingAcceptedLeads(contractorId: string): Promise<number> {
  const acceptances = await prisma.jobAcceptance.findMany({
    where: {
      contractorId,
      status: "accepted",
    },
    select: {
      leadId: true,
      lead: {
        select: {
          status: true,
          acceptedById: true,
        },
      },
    },
  });

  const activeLeadIds = acceptances
    .filter((acceptance) => {
      const leadStatus = (acceptance.lead.status || "").toLowerCase();
      if (!ACTIVE_LEAD_STATUSES.has(leadStatus)) return false;
      if (acceptance.lead.acceptedById) return false;
      return true;
    })
    .map((acceptance) => acceptance.leadId);

  if (activeLeadIds.length === 0) return 0;

  const quotes = await prisma.quote.findMany({
    where: {
      contractorId,
      jobId: { in: activeLeadIds },
    },
    select: {
      jobId: true,
      status: true,
    },
  });

  const jobsWithActiveQuotes = new Set(
    quotes.filter((quote) => isActiveQuoteStatus(quote.status)).map((quote) => quote.jobId)
  );

  return acceptances.filter((acceptance) =>
    isPendingAcceptedLead(
      acceptance.lead.status,
      acceptance.lead.acceptedById,
      jobsWithActiveQuotes.has(acceptance.leadId),
    )
  ).length;
}

export async function markAcceptanceQuoted(leadId: string, contractorId: string): Promise<void> {
  await prisma.jobAcceptance.updateMany({
    where: {
      leadId,
      contractorId,
      status: "accepted",
    },
    data: {
      status: "quoted",
    },
  });
}
