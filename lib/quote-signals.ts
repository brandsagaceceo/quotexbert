/**
 * Quote Learning Signal emitter — Phase 6 data tracking for AI learning.
 *
 * Writes a typed row to `QuoteLearningSignal` (Prisma model) and fires the
 * existing PostHog server event. Never throws into the caller.
 *
 * Usage (always non-blocking):
 *   void emitQuoteSignal({ event: 'quote_sent', quoteId }).catch(() => {});
 *
 * If quoteId is provided and enrichment fields (category, city, aiEstimate…)
 * are omitted, a lightweight DB look-up fills them automatically. Enrichment
 * failures never prevent the signal from being written.
 */

import { prisma } from '@/lib/prisma';
import { logEventServer } from '@/lib/analytics';

// ─── Types ──────────────────────────────────────────────────────────────────

export type QuoteSignalEvent =
  | 'ai_estimate_shown'
  | 'quote_sent'
  | 'quote_revision_requested'
  | 'quote_revision_created'
  | 'quote_accepted'
  | 'quote_rejected';

export interface QuoteSignalInput {
  event: QuoteSignalEvent;
  quoteId?: string;
  conversationId?: string;
  leadId?: string;
  category?: string;
  city?: string;
  aiEstimateLow?: number;
  aiEstimateHigh?: number;
  quoteTotalCost?: number;
  version?: number;
  isRevision?: boolean;
  outcome?: string;
  createdByRole?: 'contractor' | 'homeowner' | 'system';
  isAcceptedVersion?: boolean;
}

// ─── Enrichment ─────────────────────────────────────────────────────────────

/**
 * If quoteId is provided, fill any missing fields from the DB.
 * Runs a single lightweight select — never throws.
 */
async function enrich(input: QuoteSignalInput): Promise<QuoteSignalInput> {
  if (!input.quoteId) return input;

  // Only look up if at least one enrichable field is missing
  const needsEnrichment =
    !input.category ||
    !input.city ||
    input.aiEstimateLow == null ||
    input.quoteTotalCost == null ||
    input.version == null;

  if (!needsEnrichment) return input;

  try {
    const q = await prisma.quote.findUnique({
      where: { id: input.quoteId },
      select: {
        conversationId: true,
        version: true,
        parentQuoteId: true,
        totalCost: true,
        job: {
          select: {
            id: true,
            category: true,
            zipCode: true,
            aiEstimate: { select: { minCost: true, maxCost: true } },
          },
        },
        contractor: {
          select: {
            contractorProfile: { select: { city: true } },
          },
        },
      },
    });

    if (!q) return input;

    return {
      ...input,
      conversationId: input.conversationId ?? q.conversationId,
      leadId: input.leadId ?? q.job?.id ?? undefined,
      category: input.category ?? q.job?.category ?? undefined,
      // Prefer contractor profile city; fall back to job zipCode as a proxy
      city: input.city ?? q.contractor?.contractorProfile?.city ?? q.job?.zipCode ?? undefined,
      aiEstimateLow: input.aiEstimateLow ?? q.job?.aiEstimate?.minCost ?? undefined,
      aiEstimateHigh: input.aiEstimateHigh ?? q.job?.aiEstimate?.maxCost ?? undefined,
      quoteTotalCost: input.quoteTotalCost ?? q.totalCost,
      version: input.version ?? q.version ?? 1,
      isRevision: input.isRevision ?? (q.parentQuoteId != null),
    };
  } catch {
    // Enrichment failed — return original input so signal still fires
    return input;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Emit a quote learning signal.
 *
 * - Enriches missing fields from the DB when quoteId is present.
 * - Computes `priceDelta` (quoteTotalCost − AI midpoint) if both are available.
 * - Writes to `QuoteLearningSignal`.
 * - Fires PostHog event via `logEventServer`.
 * - NEVER throws.
 */
export async function emitQuoteSignal(input: QuoteSignalInput): Promise<void> {
  try {
    const e = await enrich(input);

    // priceDelta: how much the quote deviates from the AI estimate midpoint
    let priceDelta: number | undefined;
    if (e.quoteTotalCost != null && e.aiEstimateLow != null && e.aiEstimateHigh != null) {
      const midpoint = (e.aiEstimateLow + e.aiEstimateHigh) / 2;
      priceDelta = e.quoteTotalCost - midpoint;
    }

    await prisma.quoteLearningSignal.create({
      data: {
        event: e.event,
        quoteId: e.quoteId ?? null,
        conversationId: e.conversationId ?? null,
        leadId: e.leadId ?? null,
        category: e.category ?? null,
        city: e.city ?? null,
        aiEstimateLow: e.aiEstimateLow ?? null,
        aiEstimateHigh: e.aiEstimateHigh ?? null,
        quoteTotalCost: e.quoteTotalCost ?? null,
        version: e.version ?? null,
        isRevision: e.isRevision ?? false,
        outcome: e.outcome ?? null,
        createdByRole: e.createdByRole ?? null,
        priceDelta: priceDelta ?? null,
        isAcceptedVersion: e.isAcceptedVersion ?? false,
      },
    });

    // PostHog (already safe inside logEventServer if key is absent)
    void logEventServer('system', e.event, {
      quoteId: e.quoteId,
      conversationId: e.conversationId,
      leadId: e.leadId,
      category: e.category,
      city: e.city,
      aiEstimateLow: e.aiEstimateLow,
      aiEstimateHigh: e.aiEstimateHigh,
      quoteTotalCost: e.quoteTotalCost,
      version: e.version,
      isRevision: e.isRevision,
      outcome: e.outcome,
      priceDelta,
    });
  } catch (err) {
    // Log the failure but never re-throw — signals must never block user flows
    console.error('[quote-signals] Failed to emit signal:', err);
  }
}
