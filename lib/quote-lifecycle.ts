import { prisma } from "@/lib/prisma";

export const HOMEOWNER_VISIBLE_QUOTE_STATUSES = [
  "sent",
  "accepted",
  "rejected",
  "expired",
  "revision_requested",
];

export function isHomeownerVisibleQuoteStatus(status: string): boolean {
  return HOMEOWNER_VISIBLE_QUOTE_STATUSES.includes(status.toLowerCase());
}

export class QuoteAcceptanceConflictError extends Error {
  constructor() {
    super("The quote or project has already changed.");
    this.name = "QuoteAcceptanceConflictError";
  }
}

export async function acceptQuoteForHomeowner({
  quoteId,
  jobId,
  conversationId,
  homeownerId,
  contractorId,
}: {
  quoteId: string;
  jobId: string;
  conversationId: string;
  homeownerId: string;
  contractorId: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const leadUpdate = await tx.lead.updateMany({
        where: {
          id: jobId,
          homeownerId,
          OR: [
            {
              status: { in: ["open", "claimed", "reviewing"] },
              acceptedById: null,
            },
            { status: "assigned", acceptedById: contractorId },
            { status: "assigned", acceptedById: null, contractorId },
          ],
        },
        data: {
          status: "in_progress",
          contractorId,
          acceptedById: contractorId,
        },
      });

      if (leadUpdate.count !== 1) {
        return null;
      }

      const quoteUpdate = await tx.quote.updateMany({
        where: {
          id: quoteId,
          jobId,
          conversationId,
          contractorId,
          status: "sent",
          conversation: {
            is: { homeownerId, jobId },
          },
        },
        data: { status: "accepted", acceptedAt: new Date() },
      });

      if (quoteUpdate.count !== 1) {
        throw new QuoteAcceptanceConflictError();
      }

      return tx.quote.findUnique({ where: { id: quoteId } });
    });
  } catch (error) {
    if (error instanceof QuoteAcceptanceConflictError) {
      return null;
    }
    throw error;
  }
}
