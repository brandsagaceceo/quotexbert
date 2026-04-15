'use client';

/**
 * QuoteMessageCard — renders a quote inline inside the chat message list.
 *
 * Used in: app/conversations/page.tsx
 *
 * The message.content for type="quote" is a JSON string with:
 *   { quoteId, title, totalCost, laborCost, materialCost, scope, itemCount }
 *
 * Roles:
 *  - Contractor: sees "Sent" badge + can re-open the builder
 *  - Homeowner:  sees Accept + Request Changes buttons
 */

import { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { QuoteAnalysisResult } from '@/lib/quote-analysis';

export interface QuoteCardPayload {
  quoteId: string;
  title: string;
  totalCost: number;
  laborCost: number;
  materialCost: number;
  scope: string;
  itemCount: number;
  version?: number;
}

interface QuoteMessageCardProps {
  payload: QuoteCardPayload;
  isOwn: boolean;
  /** Viewer's role — "contractor" or "homeowner" */
  viewerRole: string;
  /** Called when homeowner accepts the quote */
  onAccept?: (quoteId: string) => void;
  /** Called when homeowner requests changes — passes the note */
  onRequestChanges?: (quoteId: string, note: string) => void;
  /** Called when contractor wants to revise a revision_requested quote */
  onRevise?: (quoteId: string) => void;
  /** Current status of the quote (comes from conversations page quote status map) */
  quoteStatus?: string;
}

export default function QuoteMessageCard({
  payload,
  isOwn,
  viewerRole,
  onAccept,
  onRequestChanges,
  onRevise,
  quoteStatus = 'sent',
}: QuoteMessageCardProps) {
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeNote, setChangeNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localStatus, setLocalStatus] = useState(quoteStatus);

  // AI analysis state
  const [analysis, setAnalysis] = useState<QuoteAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Sync if parent provides an updated status (e.g. after conversationQuotes map refresh)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setLocalStatus(quoteStatus); }, [quoteStatus]);

  const handleAskAI = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch(`/api/quotes/${payload.quoteId}/analyze`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (process.env.NODE_ENV === 'development') {
          console.error('[QuoteMessageCard] AI analysis HTTP error:', res.status, errData);
        }
        if (res.status === 401) {
          setAnalysisError('Please sign in to analyze this quote.');
        } else if (res.status === 403) {
          setAnalysisError('Quote analysis is only available to the homeowner.');
        } else {
          setAnalysisError('We couldn\'t analyze this quote right now. Please try again.');
        }
        return;
      }
      const data: QuoteAnalysisResult = await res.json();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[QuoteMessageCard] AI analysis network error:', err);
      }
      setAnalysisError('Something went wrong. Please check your connection and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAccept = async () => {
    if (!onAccept) return;
    setSubmitting(true);
    try {
      await onAccept(payload.quoteId);
      setLocalStatus('accepted');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!onRequestChanges || !changeNote.trim()) return;
    setSubmitting(true);
    try {
      await onRequestChanges(payload.quoteId, changeNote.trim());
      setLocalStatus('revision_requested');
      setRequestingChanges(false);
      setChangeNote('');
    } finally {
      setSubmitting(false);
    }
  };

  const isAccepted = localStatus === 'accepted';
  const isRevisionRequested = localStatus === 'revision_requested';
  const isSuperseded = localStatus === 'superseded';

  // Superseded quote — show compact greyed-out card
  if (isSuperseded) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm opacity-60">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-400">
          <DocumentTextIcon className="w-5 h-5 text-white flex-shrink-0" />
          <span className="text-sm font-semibold text-white truncate">{payload.title}</span>
          {(payload.version ?? 1) > 1 && (
            <span className="ml-auto text-xs text-white/80 flex-shrink-0">v{payload.version}</span>
          )}
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500">This quote was revised. See the updated version below.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border overflow-hidden shadow-sm ${
        isOwn
          ? 'border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Card Header */}
      <div
        className={`flex items-center gap-2 px-4 py-3 ${
          isOwn ? 'bg-gradient-to-r from-rose-600 to-orange-500' : 'bg-gray-900'
        }`}
      >
        <DocumentTextIcon className="w-5 h-5 text-white flex-shrink-0" />
        <span className="text-sm font-semibold text-white truncate">{payload.title}</span>
        {/* Version badge — shown from v2 onwards */}
        {(payload.version ?? 1) > 1 && (
          <span className="ml-1 text-xs font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">
            v{payload.version}
          </span>
        )}
        {isAccepted && (
          <CheckCircleIconSolid className="w-5 h-5 text-green-300 flex-shrink-0 ml-auto" />
        )}
      </div>

      {/* Card Body */}
      <div className="px-4 pt-3 pb-3 space-y-2.5">
        {/* Total */}
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ${payload.totalCost.toLocaleString()}
          </span>
        </div>

        {/* Labor / Materials breakdown */}
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 rounded-lg px-2.5 py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Labor</p>
            <p className="text-sm font-semibold text-gray-800">
              ${payload.laborCost.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg px-2.5 py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Materials</p>
            <p className="text-sm font-semibold text-gray-800">
              ${payload.materialCost.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg px-2.5 py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Items</p>
            <p className="text-sm font-semibold text-gray-800">{payload.itemCount}</p>
          </div>
        </div>

        {/* Scope preview */}
        {payload.scope && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{payload.scope}</p>
        )}

        {/* Status badge */}
        {isAccepted && (
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-semibold">Accepted</span>
          </div>
        )}
        {isRevisionRequested && (
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
            <ArrowPathIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-semibold">Changes Requested</span>
          </div>
        )}

        {/* Homeowner actions */}
        {viewerRole === 'homeowner' && !isAccepted && !isRevisionRequested && (
          <div className="pt-1 space-y-2">
            {!requestingChanges ? (
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => setRequestingChanges(true)}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Request Changes
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="Describe what you'd like changed…"
                  rows={2}
                  className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestChanges}
                    disabled={submitting || !changeNote.trim()}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Sending…' : 'Send Request'}
                  </button>
                  <button
                    onClick={() => {
                      setRequestingChanges(false);
                      setChangeNote('');
                    }}
                    disabled={submitting}
                    className="px-3 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contractor view — awaiting or revision actions */}
        {viewerRole === 'contractor' && !isAccepted && !isSuperseded && (
          isRevisionRequested && onRevise ? (
            <button
              onClick={() => onRevise(payload.quoteId)}
              className="w-full flex items-center justify-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Revise Quote
            </button>
          ) : (
            <p className="text-xs text-gray-500 text-center pt-1">Awaiting homeowner response</p>
          )
        )}

        {/* AI Analysis — homeowner only, non-superseded */}
        {viewerRole === 'homeowner' && !isSuperseded && (
          <div className="pt-1">
            {/* Loading state */}
            {analyzing && (
              <div className="flex items-center gap-2.5 rounded-xl bg-violet-50 border border-violet-200 px-3 py-2.5">
                <div className="flex gap-0.5 flex-shrink-0">
                  {[0, 120, 240].map((d) => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-violet-700">Analyzing quote…</span>
              </div>
            )}

            {/* Error state */}
            {!analyzing && analysisError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-4v2h2V5H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-red-700 font-medium leading-snug">{analysisError}</p>
                  <button
                    onClick={() => { setAnalysisError(null); setShowAnalysis(false); }}
                    className="text-[10px] text-red-500 hover:text-red-700 font-semibold mt-0.5 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Trigger button — hidden while loading/showing result */}
            {!analyzing && !showAnalysis && !analysisError && (
              <button
                onClick={handleAskAI}
                className="w-full flex items-center justify-center gap-1.5 border border-violet-200 text-violet-700 bg-violet-50 active:bg-violet-100 hover:bg-violet-100 active:scale-[0.98] px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              >
                <SparklesIcon className="w-4 h-4" />
                Ask AI About This Quote
              </button>
            )}

            {/* Result card */}
            {!analyzing && showAnalysis && analysis && (() => {
              const verdictConfig = {
                fair: { border: 'border-green-200', bg: 'bg-green-50', chip: 'bg-green-200 text-green-800', icon: '✓', label: 'Fair Price' },
                high: { border: 'border-red-200',   bg: 'bg-red-50',   chip: 'bg-red-200 text-red-800',   icon: '↑', label: 'Priced High' },
                low:  { border: 'border-amber-200', bg: 'bg-amber-50', chip: 'bg-amber-200 text-amber-800', icon: '↓', label: 'Priced Low' },
                unknown: { border: 'border-gray-200', bg: 'bg-gray-50', chip: 'bg-gray-200 text-gray-700', icon: '?', label: 'Unknown' },
              } as const;
              const cfg = verdictConfig[analysis.verdict] ?? verdictConfig.unknown;
              return (
                <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 space-y-2`}>
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-xs font-bold text-gray-800">AI Price Analysis</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.chip}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* Fair range — prominent */}
                  {(analysis.fairRangeLow > 0 || analysis.fairRangeHigh > 0) && (
                    <div className="flex items-center justify-between bg-white/70 rounded-lg px-2.5 py-1.5">
                      <span className="text-[11px] text-gray-500 font-medium">Fair market range</span>
                      <span className="text-xs font-bold text-gray-900">
                        ${analysis.fairRangeLow.toLocaleString()} – ${analysis.fairRangeHigh.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Short explanation — clamp to 3 lines to stay skimmable */}
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{analysis.explanation}</p>

                  {/* Tips */}
                  {analysis.suggestions.length > 0 && (
                    <ul className="space-y-1">
                      {analysis.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1.5 leading-snug">
                          <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => { setShowAnalysis(false); setAnalysis(null); }}
                    className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
