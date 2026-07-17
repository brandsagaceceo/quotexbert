"use client";

import { useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export function StickyCTA() {
  const { isSignedIn } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [estimatorInView, setEstimatorInView] = useState(false);

  // Dismiss persists for the tab session only (not permanently) — the CTA reappears
  // on the homeowner's next visit/tab.
  useEffect(() => {
    if (sessionStorage.getItem('stickyCtaDismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  // Hide the CTA whenever the actual estimator tool is already visible on screen —
  // it would otherwise duplicate/obstruct the live form (item 12 requirement).
  useEffect(() => {
    const target = document.querySelector('[data-estimator]');
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => entry && setEstimatorInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (isSignedIn || dismissed || estimatorInView) {
    return null;
  }

  return (
    <>
      {/* Mobile Only - Sticky Bottom Bar */}
      <div className="sticky-cta-bar md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-[#800020] rounded-t-2xl shadow-lg flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <Link
            href="/#estimator-tool"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white font-bold text-sm active:opacity-90 transition-opacity min-w-0"
          >
            <Camera className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Upload Photos — Free Estimate</span>
            <span className="flex-shrink-0 bg-amber-400 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
              FREE
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem('stickyCtaDismissed', '1');
            }}
            aria-label="Dismiss"
            className="flex-shrink-0 flex items-center justify-center w-10 text-white/70 hover:text-white border-l border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add padding to body to prevent content from being hidden */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px));
          }
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}
