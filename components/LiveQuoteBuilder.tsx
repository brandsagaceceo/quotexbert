'use client';

/**
 * LiveQuoteBuilder — slide-in panel for contractors to generate, edit, and send quotes.
 *
 * Mounted in: app/conversations/page.tsx
 * Contractor-only (caller is responsible for the role gate).
 *
 * Flow:
 *  1. Contractor clicks "Generate Quote" → calls POST /api/quotes/generate
 *  2. AI returns a draft Quote with line items
 *  3. Contractor can edit title, scope, items, labor, materials
 *  4. "Save Draft" → calls PUT /api/quotes/[id]  (status stays "draft")
 *  5. "Send Quote" → calls PUT /api/quotes/[id]  (status = "sent")
 *     then calls POST /api/conversations/[id]/messages with type "quote"
 *     so a QuoteMessageCard appears inline in the chat
 */

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { normalizeQuoteDraft, sanitizeMoneyValue, RESIDENTIAL_CAP } from '@/lib/quote-validation';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuoteItem {
  id?: string;
  category: 'labor' | 'materials' | 'permits' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface QuoteData {
  id: string;
  title: string;
  description: string;
  scope: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  status: string;
  items: QuoteItem[];
  confidenceScore?: number;
  // Versioning (Phase 4)
  version?: number;
  parentQuoteId?: string;
  revisionNote?: string;
}

interface LiveQuoteBuilderProps {
  conversationId: string;
  contractorId: string;
  jobTitle: string;
  jobId: string;
  homeownerId: string;
  onClose: () => void;
  /** Called after a quote is sent so the chat can refresh messages */
  onQuoteSent: (quote: QuoteData) => void;
  /**
   * When set, opens in revision mode: bootstraps a new draft from the given
   * quote ID (via POST /api/quotes/[id]/revise) instead of generating from scratch.
   */
  reviseQuoteId?: string | undefined;
  /**
   * When set, loads this existing draft quote for editing instead of generating a new one.
   * The builder skips the generation step and pre-populates with the saved draft data.
   */
  editDraftQuoteId?: string | undefined;
  /**
   * Pre-fill data from auto-draft CTA. When provided, the quote builder
   * shows a "Based on your conversation" badge and populates fields.
   */
  autoDraftPrefill?: {
    suggestedTitle: string;
    scopeOfWork: string;
    totalCost: number;
    laborCost: number;
    materialCost: number;
    displayPrice: string;
    sourceSnippets?: string[];
  } | null;
}

// ─── Helper ─────────────────────────────────────────────────────────────────

function recalcTotal(items: QuoteItem[]): { labor: number; materials: number; total: number } {
  let labor = 0;
  let materials = 0;
  for (const item of items) {
    if (item.category === 'labor') labor += item.totalPrice;
    else if (item.category === 'materials') materials += item.totalPrice;
  }
  const other = items
    .filter((i) => i.category !== 'labor' && i.category !== 'materials')
    .reduce((s, i) => s + i.totalPrice, 0);
  return { labor, materials, total: labor + materials + other };
}

const EMPTY_ITEM = (): QuoteItem => ({
  category: 'labor',
  description: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
});

// ─── Component ──────────────────────────────────────────────────────────────

export default function LiveQuoteBuilder({
  conversationId,
  contractorId,
  jobTitle,
  jobId,
  homeownerId,
  onClose,
  onQuoteSent,
  reviseQuoteId,
  editDraftQuoteId,
  autoDraftPrefill,
}: LiveQuoteBuilderProps) {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Homeowner's change request text — displayed as context while editing a revision
  const [revisionContext, setRevisionContext] = useState<string | null>(null);

  // Quote under construction (null = not yet generated)
  const [quote, setQuote] = useState<QuoteData | null>(null);

  // Smart price suggestion from recent accepted signals
  const [priceSuggestion, setPriceSuggestion] = useState<{
    low: number;
    high: number;
    count: number;
    scope: 'city' | 'category';
  } | null>(null);

  // ── Bootstrap revision on mount when reviseQuoteId is provided ────────────

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (reviseQuoteId) createRevision(); }, []);
  // Load existing draft for editing (skips generation step)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!editDraftQuoteId) return;
    setGenerating(true);
    setError(null);
    fetch(`/api/quotes/${encodeURIComponent(editDraftQuoteId)}`)
      .then(r => r.json())
      .then(data => {
        if (data?.id) {
          setQuote({ ...data, items: data.items ?? [] } as QuoteData);
        } else {
          setError('Could not load draft. Please discard and generate a new quote.');
        }
      })
      .catch(() => setError('Failed to load draft quote. Please try again.'))
      .finally(() => setGenerating(false));
  }, []);
  // Auto-generate when opened from auto-draft CTA (prefill provided, no revision or edit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (autoDraftPrefill && !reviseQuoteId && !editDraftQuoteId) {
      generateQuote();
    }
  }, []);
  // Fetch price suggestion once on mount
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/quotes/price-suggestion?jobId=${encodeURIComponent(jobId)}&contractorId=${encodeURIComponent(contractorId)}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled && data?.suggestion) setPriceSuggestion(data.suggestion); })
      .catch(() => { /* non-critical */ });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, contractorId]);

  const createRevision = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes/${reviseQuoteId}/revise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create revision');
      if (data.revisionNote) setRevisionContext(data.revisionNote);
      setQuote(data.quote as QuoteData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  // ── Generate (fresh, no prior quote) ──────────────────────────────────────

  const generateQuote = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/quotes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, contractorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quote');

      const q = data.quote as QuoteData;
      setQuote(q);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  // ── Item helpers ──────────────────────────────────────────────────────────

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    if (!quote) return;
    const updated = (quote.items ?? []).map((item, i) => {
      if (i !== index) return item;
      const next = { ...item, [field]: value };
      // Auto-recalc totalPrice when quantity or unitPrice changes
      if (field === 'quantity' || field === 'unitPrice') {
        next.totalPrice = Number(next.quantity) * Number(next.unitPrice);
      }
      return next;
    });
    const { labor, materials, total } = recalcTotal(updated);
    setQuote({ ...quote, items: updated, laborCost: labor, materialCost: materials, totalCost: total });
  };

  const addItem = () => {
    if (!quote) return;
    const updated = [...(quote.items ?? []), EMPTY_ITEM()];
    const { labor, materials, total } = recalcTotal(updated);
    setQuote({ ...quote, items: updated, laborCost: labor, materialCost: materials, totalCost: total });
  };

  const removeItem = (index: number) => {
    if (!quote) return;
    const updated = (quote.items ?? []).filter((_, i) => i !== index);
    const { labor, materials, total } = recalcTotal(updated);
    setQuote({ ...quote, items: updated, laborCost: labor, materialCost: materials, totalCost: total });
  };

  // Directly edit labor / materials / total.
  // When items exist, changing totalCost scales them proportionally.
  const updateCostField = (field: 'laborCost' | 'materialCost' | 'totalCost', rawValue: number) => {
    if (!quote) return;
    const value = Math.max(0, Math.min(rawValue, RESIDENTIAL_CAP));
    if (field === 'totalCost') {
      if ((quote.items ?? []).length > 0 && quote.totalCost > 0) {
        const ratio = value / quote.totalCost;
        const scaled = quote.items.map(item => ({
          ...item,
          totalPrice: Math.round(item.totalPrice * ratio * 100) / 100,
          unitPrice: item.quantity > 0
            ? Math.round((item.totalPrice * ratio / item.quantity) * 100) / 100
            : 0,
        }));
        const { labor, materials } = recalcTotal(scaled);
        setQuote({ ...quote, items: scaled, laborCost: labor, materialCost: materials, totalCost: value });
        return;
      }
      // No items — distribute proportionally between labor and materials
      const currentSum = quote.laborCost + quote.materialCost;
      const laborRatio = currentSum > 0 ? quote.laborCost / currentSum : 0.6;
      const newLabor = Math.round(value * laborRatio * 100) / 100;
      const newMaterial = Math.round((value - newLabor) * 100) / 100;
      setQuote({ ...quote, totalCost: value, laborCost: newLabor, materialCost: newMaterial });
    } else if (field === 'laborCost') {
      setQuote({ ...quote, laborCost: value, totalCost: Math.round((value + quote.materialCost) * 100) / 100 });
    } else {
      setQuote({ ...quote, materialCost: value, totalCost: Math.round((quote.laborCost + value) * 100) / 100 });
    }
  };

  // ── Save/Send ─────────────────────────────────────────────────────────────

  const saveQuote = async (newStatus: 'draft' | 'sent') => {
    if (!quote) return;
    const isSending = newStatus === 'sent';
    isSending ? setSending(true) : setSaving(true);
    setError(null);

    // Normalize all values before persisting to catch any client-side math issues
    const normalized = normalizeQuoteDraft({
      totalCost: quote.totalCost,
      laborCost: quote.laborCost,
      materialCost: quote.materialCost,
      items: quote.items,
      scope: quote.scope,
    });

    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quote.title,
          description: quote.description,
          scope: quote.scope,
          laborCost: normalized.laborCost,
          materialCost: normalized.materialCost,
          totalCost: normalized.totalCost,
          items: normalized.items.length > 0 ? normalized.items : quote.items,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save quote');

      // Update local state with server response
      setQuote(data.quote as QuoteData);

      if (isSending) {
        // Quote status is now 'sent' — the quote panel in /messages picks it up
        // via fetchLatestQuotes. The homeowner is notified via the notification system.
        // (The old /api/conversations/[id]/messages route is not needed here.)
        onQuoteSent(data.quote as QuoteData);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
      setSending(false);
    }
  };

  // Discard a draft quote — deletes from DB and closes the builder
  const discardQuote = async () => {
    if (!quote || !window.confirm('Discard this draft quote? This cannot be undone.')) return;
    try {
      await fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' });
    } catch { /* best-effort */ }
    setQuote(null);
    onClose();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-rose-600 to-orange-500">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {reviseQuoteId ? 'Revise Quote' : 'Quote Builder'}
              </h2>
              <p className="text-xs text-rose-100 truncate max-w-[260px]">{jobTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-sm text-red-700 flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Generate state — only shown when not in revision mode */}
          {!quote && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-full p-6">
                {reviseQuoteId ? (
                  <ArrowPathIcon className="w-12 h-12 text-rose-600 animate-spin" />
                ) : (
                  <SparklesIcon className="w-12 h-12 text-rose-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {reviseQuoteId ? 'Preparing Revision…' : 'AI Quote Generator'}
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  {reviseQuoteId
                    ? 'Loading your previous quote for editing.'
                    : 'Analyzes your conversation to create a professional, itemized quote in seconds.'}
                </p>
              </div>
              {!reviseQuoteId && (
                <button
                  onClick={generateQuote}
                  disabled={generating}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-700 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Analyzing conversation…
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Quote with AI
                    </>
                  )}
                </button>
              )}

              {/* Phase C: Show price suggestion before generation if available */}
              {priceSuggestion && (
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 w-full max-w-xs text-left">
                  <ChartBarIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-blue-800">
                      Suggested range: ${priceSuggestion.low.toLocaleString()}–${priceSuggestion.high.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-blue-500 leading-snug">
                      Based on {priceSuggestion.count} accepted {priceSuggestion.scope === 'city' ? 'local ' : ''}quotes
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit state */}
          {quote && (
            <div className="space-y-5">
              {/* Homeowner's change request note (revision mode only) */}
              {revisionContext && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                  <ArrowPathIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-0.5">Homeowner's Change Request</p>
                    <p className="text-xs text-amber-700 leading-relaxed">{revisionContext}</p>
                  </div>
                </div>
              )}

              {/* "Based on your conversation" badge — shown when auto-draft prefill was used */}
              {autoDraftPrefill && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xs text-rose-800 font-medium">
                        Based on your conversation · Using {autoDraftPrefill.displayPrice} from chat
                      </p>
                    </div>
                  </div>
                  {/* Source snippets */}
                  {autoDraftPrefill.sourceSnippets && autoDraftPrefill.sourceSnippets.length > 0 && (
                    <div className="mt-1.5 space-y-0.5 pl-6">
                      {autoDraftPrefill.sourceSnippets.map((s, i) => (
                        <p key={i} className="text-[10px] text-rose-600/70 italic truncate">&ldquo;{s}&rdquo;</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI confidence badge */}
              {quote.confidenceScore != null && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <SparklesIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-green-800 font-medium">
                    AI confidence: {Math.round(quote.confidenceScore * 100)}% — Review and adjust before sending
                  </span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Quote Title
                </label>
                <input
                  type="text"
                  value={quote.title}
                  onChange={(e) => setQuote({ ...quote, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Scope */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Scope of Work
                </label>
                <textarea
                  value={quote.scope}
                  onChange={(e) => setQuote({ ...quote, scope: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Line Items
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {(quote.items ?? []).map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(index, 'category', e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                        >
                          <option value="labor">Labor</option>
                          <option value="materials">Materials</option>
                          <option value="permits">Permits</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-500 uppercase tracking-wide">Qty</label>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-500 uppercase tracking-wide">Unit Price</label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-500 uppercase tracking-wide">Total</label>
                          <div className="text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-100">
                            ${item.totalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {item.notes != null && (
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => updateItem(index, 'notes', e.target.value)}
                          placeholder="Notes (optional)"
                          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none text-gray-600"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Price Suggestion */}
              {priceSuggestion && (
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                  <ChartBarIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-blue-800">
                      Suggested range: ${priceSuggestion.low.toLocaleString()}–${priceSuggestion.high.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-blue-500 leading-snug">
                      Based on {priceSuggestion.count} accepted {priceSuggestion.scope === 'city' ? 'local ' : ''}quotes
                    </p>
                  </div>
                </div>
              )}

              {/* Cost Summary — all fields are directly editable */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Cost Summary
                  </h4>
                  {(quote.version ?? 1) > 1 && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                      Revision v{quote.version}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Labor</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">$</span>
                    <input
                      type="number" min={0} step={50}
                      value={quote.laborCost}
                      onChange={(e) => updateCostField('laborCost', parseFloat(e.target.value) || 0)}
                      className="w-28 text-right text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Materials</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">$</span>
                    <input
                      type="number" min={0} step={50}
                      value={quote.materialCost}
                      onChange={(e) => updateCostField('materialCost', parseFloat(e.target.value) || 0)}
                      className="w-28 text-right text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900">Total</label>
                  <div className="flex items-center gap-1">
                    <span className="text-rose-600 font-bold">$</span>
                    <input
                      type="number" min={0} step={50}
                      value={quote.totalCost}
                      onChange={(e) => updateCostField('totalCost', parseFloat(e.target.value) || 0)}
                      className="w-32 text-right text-lg font-bold text-rose-700 border-b-2 border-rose-200 focus:border-rose-500 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 text-right pt-0.5">All fields are editable — adjust before sending</p>
              </div>

              {/* Status badge */}
              {quote.status === 'sent' && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-800 font-medium">Quote sent to homeowner</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {quote && !['sent', 'accepted', 'superseded'].includes(quote.status) && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => saveQuote('draft')}
                disabled={saving || sending}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving…' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={() => saveQuote('sent')}
                disabled={saving || sending || !quote.title.trim() || !quote.scope.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {reviseQuoteId ? 'Send Revision' : 'Send Quote'}
                  </>
                )}
              </button>
            </div>
            {/* Discard — clearly visible but separated to avoid accidental taps */}
            <button
              type="button"
              onClick={discardQuote}
              disabled={saving || sending}
              className="w-full text-xs text-red-500 hover:text-red-700 font-medium py-1 disabled:opacity-40 transition-colors"
            >
              Discard Draft
            </button>
          </div>
        )}

        {/* Re-generate option after sent */}
        {quote && quote.status === 'sent' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
