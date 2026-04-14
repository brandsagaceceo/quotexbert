/**
 * extractQuoteContextFromConversation
 *
 * Server-side utility that reads a message thread and extracts structured
 * quote context: explicit prices, scope, materials, timing, etc.
 *
 * Used by: /api/quotes/generate
 */

export interface QuoteContext {
  suggestedTitle: string;
  scopeOfWork: string;
  explicitPrice: number | null;
  materialsEstimate: number | null;
  laborEstimate: number | null;
  confidence: number;          // 0–1
  sourceMessages: string[];    // message IDs or snippets that contributed
  notes: string;
}

interface MessageInput {
  id?: string;
  body?: string;
  content?: string;
  senderRole?: string;
  fromUserId?: string;
  createdAt?: string | Date;
}

// ─── Price extraction patterns ──────────────────────────────────────────────

/**
 * Matches money values in conversational text:
 *  - "$900", "$1,200", "$1200.50"
 *  - "900 dollars", "1200 bucks"
 *  - "I'll do it for 900", "my price is 1200"
 *  - "charge you 5000"
 *  - "1k", "2.5k", "$1.5k"
 */
const MONEY_REGEX = /\$\s?([\d,]+(?:\.\d{1,2})?k?)|(\d[\d,]*(?:\.\d{1,2})?k?)\s*(?:dollars?|bucks?)|(?:(?:price|cost|charge|quote|estimate|do it for|offer|rate)\s+(?:is\s+|of\s+|you\s+)?)\$?\s?([\d,]+(?:\.\d{1,2})?k?)/gi;

/**
 * Numbers we should IGNORE — phone numbers, zip codes, dates, dimensions, IDs
 */
function isNoisyNumber(fullMatch: string, value: number): boolean {
  // Phone patterns: 10+ digits, or text like "call me at", "phone", "cell"
  if (/(?:phone|call|cell|text|fax|contact)\s/i.test(fullMatch)) return true;
  // Zip codes: 5-digit standalone or preceded by zip-like context
  if (/\b\d{5}(?:-\d{4})?\b/.test(fullMatch) && value >= 10000 && value <= 99999) return true;
  // Dates: patterns like 1/15 or 2024
  if (/\d{1,2}\/\d{1,2}/.test(fullMatch)) return true;
  // Very large numbers without context (likely not a price)
  if (value > 500_000) return true;
  // Very small: under $10 is almost never a project price
  if (value < 10) return true;
  // Dimensions: feet, inches, sq ft
  if (/(?:ft|feet|inches?|sq\s*ft|square|yard|meter)/i.test(fullMatch)) return true;
  return false;
}

function parseMoneyValue(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, '');
  // Handle shorthand: "1k" → 1000, "2.5k" → 2500
  const kMatch = cleaned.match(/^(\d+(?:\.\d+)?)k$/i);
  if (kMatch && kMatch[1]) return parseFloat(kMatch[1]) * 1000;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

interface PriceCandidate {
  value: number;
  isContractor: boolean;
  recency: number;    // higher = more recent
  snippet: string;
  isFinalOffer: boolean;
}

// phrases that signal a "final offer" from a contractor
const FINAL_OFFER_PATTERNS = [
  /i(?:'ll| will| can) do (?:it|this|the job) for/i,
  /my (?:price|quote|estimate|rate|cost) (?:is|would be|will be)/i,
  /(?:total|final|all[- ]in) (?:price|cost|quote) (?:is|of|:)/i,
  /charge (?:you |)\$?[\d,]/i,
  /(?:offer|propose|quote) (?:of )?\$?[\d,]/i,
  /comes? (?:to|out to) \$?[\d,]/i,
  /all in for \$?[\d,]/i,
  /let(?:'s| us) do (?:it |this )?(?:for |at )?\$?[\d,]/i,
];

// ─── Scope extraction ───────────────────────────────────────────────────────

const SCOPE_KEYWORDS = [
  'paint', 'drywall', 'tile', 'flooring', 'plumbing', 'electrical',
  'roof', 'deck', 'fence', 'bathroom', 'kitchen', 'basement',
  'siding', 'window', 'door', 'hvac', 'insulation', 'concrete',
  'framing', 'demolition', 'cleanup', 'landscaping', 'cabinet',
  'countertop', 'backsplash', 'trim', 'molding',
];

// ─── Main extraction ────────────────────────────────────────────────────────

export function extractQuoteContextFromConversation(
  messages: MessageInput[],
  contractorUserId?: string,
): QuoteContext {
  const priceCandidates: PriceCandidate[] = [];
  const scopeHits = new Set<string>();
  const sourceSnippets: string[] = [];
  let latestBudgetMention: number | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];    if (!msg) continue;    const text = msg.body || msg.content || '';
    if (!text.trim()) continue;

    const isContractor = contractorUserId
      ? (msg.fromUserId === contractorUserId)
      : (msg.senderRole === 'contractor');
    const recency = i; // higher index = more recent

    // ── Extract prices ────────────────────────────────────────────────────
    let match: RegExpExecArray | null;
    MONEY_REGEX.lastIndex = 0;
    while ((match = MONEY_REGEX.exec(text)) !== null) {
      const rawVal = match[1] || match[2] || match[3];
      if (!rawVal) continue;
      const value = parseMoneyValue(rawVal);
      if (value <= 0) continue;

      // Get surrounding context for noise detection
      const start = Math.max(0, match.index - 30);
      const end = Math.min(text.length, match.index + match[0].length + 30);
      const context = text.slice(start, end);

      if (isNoisyNumber(context, value)) continue;

      const isFinalOffer = isContractor && FINAL_OFFER_PATTERNS.some(p => p.test(context));

      priceCandidates.push({
        value,
        isContractor,
        recency,
        snippet: context.trim(),
        isFinalOffer,
      });
    }

    // ── Budget mentions from homeowner ────────────────────────────────────
    if (!isContractor) {
      const budgetMatch = text.match(/budget\s+(?:is\s+|of\s+|around\s+)?\$?\s?([\d,]+)/i);
      if (budgetMatch && budgetMatch[1]) {
        const bv = parseMoneyValue(budgetMatch[1]);
        if (bv >= 100 && bv <= 500_000) latestBudgetMention = bv;
      }
    }

    // ── Scope keywords ──────────────────────────────────────────────────
    for (const kw of SCOPE_KEYWORDS) {
      if (text.toLowerCase().includes(kw)) scopeHits.add(kw);
    }
  }

  // ── Choose the best price ───────────────────────────────────────────────
  // Priority: most recent contractor final-offer > most recent contractor price > most recent any price
  let bestPrice: number | null = null;
  let confidence = 0.5;

  // Sort: final offers first, then contractor, then recency
  const sorted = [...priceCandidates].sort((a, b) => {
    if (a.isFinalOffer !== b.isFinalOffer) return a.isFinalOffer ? -1 : 1;
    if (a.isContractor !== b.isContractor) return a.isContractor ? -1 : 1;
    return b.recency - a.recency;
  });

  if (sorted.length > 0) {
    const best = sorted[0]!;
    bestPrice = best.value;
    sourceSnippets.push(best.snippet);
    confidence = best.isFinalOffer ? 0.95 : best.isContractor ? 0.85 : 0.65;
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const scopeList = Array.from(scopeHits);
  const suggestedTitle = scopeList.length > 0
    ? scopeList.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') + ' Work'
    : 'Project Quote';

  let laborEstimate: number | null = null;
  let materialsEstimate: number | null = null;
  if (bestPrice !== null) {
    laborEstimate = Math.round(bestPrice * 0.6 * 100) / 100;
    materialsEstimate = Math.round(bestPrice * 0.4 * 100) / 100;
  }

  const notes: string[] = [];
  if (latestBudgetMention) notes.push(`Homeowner budget: $${latestBudgetMention.toLocaleString()}`);
  if (sorted.length > 1) notes.push(`${sorted.length} price mentions found in conversation`);

  return {
    suggestedTitle,
    scopeOfWork: scopeList.length > 0
      ? `Scope includes: ${scopeList.join(', ')}`
      : '',
    explicitPrice: bestPrice,
    materialsEstimate,
    laborEstimate,
    confidence,
    sourceMessages: sourceSnippets,
    notes: notes.join('. '),
  };
}

// ─── Auto-draft detection ───────────────────────────────────────────────────

export interface AutoDraftState {
  shouldSuggestDraft: boolean;
  confidence: number;
  reason: string;
  draft: {
    suggestedTitle: string;
    scopeOfWork: string;
    totalCost: number;
    laborCost: number;
    materialCost: number;
  } | null;
  displayPrice: string | null;
  /** Short source snippets from conversation that contributed to the draft */
  sourceSnippets: string[];
  /** Notes from extraction (e.g. "Homeowner budget: $1,000") */
  notes: string;
  /** Hash of contributing messages — used to detect material changes */
  contextVersion: string;
}

/**
 * Determines whether the conversation has enough signal to suggest an
 * auto-draft quote to the contractor. Returns prefill data for the
 * QuoteBuilder when appropriate.
 *
 * Used client-side: pass the messages array and current user's role.
 * Only suggests drafts for contractors who have stated a price.
 */
export function getAutoDraftQuoteState(
  messages: MessageInput[],
  currentUserRole: string,
  contractorUserId?: string,
): AutoDraftState {
  const NO_DRAFT: AutoDraftState = {
    shouldSuggestDraft: false,
    confidence: 0,
    reason: '',
    draft: null,
    displayPrice: null,
    sourceSnippets: [],
    notes: '',
    contextVersion: '',
  };

  // Only suggest auto-drafts for contractors
  if (currentUserRole !== 'contractor') return NO_DRAFT;

  // Need at least 2 messages (some back-and-forth)
  if (messages.length < 2) return { ...NO_DRAFT, reason: 'Not enough messages' };

  const ctx = extractQuoteContextFromConversation(messages, contractorUserId);

  // Build a simple version hash from message IDs/timestamps
  const versionParts = messages.slice(-10).map(m => m.id || String(m.createdAt)).join('|');
  const contextVersion = simpleHash(versionParts);

  // Must have found an explicit price from the conversation
  if (ctx.explicitPrice == null) {
    return { ...NO_DRAFT, reason: 'No price discussed yet', contextVersion, sourceSnippets: [], notes: ctx.notes };
  }

  // Must have some scope signals
  const hasScope = ctx.scopeOfWork.length > 0;

  const draft = {
    suggestedTitle: ctx.suggestedTitle,
    scopeOfWork: ctx.scopeOfWork,
    totalCost: ctx.explicitPrice,
    laborCost: ctx.laborEstimate ?? Math.round(ctx.explicitPrice * 0.6 * 100) / 100,
    materialCost: ctx.materialsEstimate ?? Math.round(ctx.explicitPrice * 0.4 * 100) / 100,
  };

  const displayPrice = `$${ctx.explicitPrice.toLocaleString()}`;

  // Trim source snippets for display (max 2, each capped at 80 chars)
  const trimmedSnippets = ctx.sourceMessages
    .slice(0, 2)
    .map(s => s.length > 80 ? s.slice(0, 77) + '…' : s)
    .filter(Boolean);

  return {
    shouldSuggestDraft: true,
    confidence: ctx.confidence,
    reason: hasScope
      ? `Price of ${displayPrice} and scope detected in conversation`
      : `Price of ${displayPrice} detected in conversation`,
    draft,
    displayPrice,
    sourceSnippets: trimmedSnippets,
    notes: ctx.notes,
    contextVersion,
  };
}

/** Simple string hash for change detection (not cryptographic) */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}
