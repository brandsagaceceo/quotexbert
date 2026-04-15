'use client';

/**
 * QuoteBottomSheet — renders quote details in a mobile-safe bottom sheet.
 *
 * Features:
 *  - Slides in from the bottom with a CSS keyframe animation
 *  - Backdrop tap to dismiss
 *  - Drag handle + swipe-down to dismiss (≥100px drag triggers close)
 *  - Escape key to dismiss
 *  - Internal scroll for QuoteMessageCard content
 *  - Safe-area inset support (iPhone notch / home indicator)
 *  - Does NOT affect the chat layout underneath
 */

import { useEffect, useRef } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import QuoteMessageCard from '@/components/QuoteMessageCard';
import type { QuoteCardPayload } from '@/components/QuoteMessageCard';

interface QuoteBottomSheetProps {
  payload: QuoteCardPayload;
  quoteStatus: string;
  /** "contractor" or "homeowner" */
  viewerRole: string;
  onClose: () => void;
  onAccept?: (quoteId: string) => void;
  onRequestChanges?: (quoteId: string, note: string) => void;
  /** Closing the sheet before opening the builder is handled here */
  onRevise?: (quoteId: string) => void;
}

export default function QuoteBottomSheet({
  payload,
  quoteStatus,
  viewerRole,
  onClose,
  onAccept,
  onRequestChanges,
  onRevise,
}: QuoteBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const currentDragYRef = useRef(0);

  // Lock body scroll while sheet is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Dismiss on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Swipe-down to dismiss ─────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartYRef.current = touch.clientY;
    currentDragYRef.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || touchStartYRef.current === null || !sheetRef.current) return;
    const dy = touch.clientY - touchStartYRef.current;
    if (dy > 0) {
      currentDragYRef.current = dy;
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!sheetRef.current) return;
    if (currentDragYRef.current > 100) {
      onClose();
    } else {
      sheetRef.current.style.transition = '';
      sheetRef.current.style.transform = '';
    }
    touchStartYRef.current = null;
    currentDragYRef.current = 0;
  };

  return (
    <>
      <style>{`
        @keyframes qxb-sheet-in {
          from { transform: translateY(100%); opacity: 0.8; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes qxb-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .qxb-sheet-enter {
          animation: qxb-sheet-in 0.28s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        }
        .qxb-backdrop-enter {
          animation: qxb-backdrop-in 0.18s ease both;
        }
        .qxb-sheet-enter { will-change: transform; }
      `}</style>

      {/* Backdrop */}
      <div
        className="qxb-backdrop-enter fixed inset-0 z-40 bg-black/40"
        style={{ backdropFilter: 'blur(2px)' }}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quote details"
        className="qxb-sheet-enter fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{
          maxHeight: '88vh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          touchAction: 'none',
          transition: 'transform 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle — tappable hit area */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex-shrink-0 flex justify-center pt-3 pb-2 w-full"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </button>

        {/* Sheet header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <DocumentTextIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Quote Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 flex items-center justify-center transition-all duration-150 flex-shrink-0"
            aria-label="Close quote details"
          >
            <XMarkIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Scrollable content — internal scroll, never pushes layout */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <QuoteMessageCard
            payload={payload}
            isOwn={viewerRole === 'contractor'}
            viewerRole={viewerRole}
            quoteStatus={quoteStatus}
            {...(onAccept ? { onAccept } : {})}
            {...(onRequestChanges ? { onRequestChanges } : {})}
            onRevise={(quoteId) => {
              // Close sheet first, then open builder
              onClose();
              onRevise?.(quoteId);
            }}
          />
          {/* Bottom breathing room */}
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}
