"use client";

import { Camera } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export function StickyCTA() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null;
  }

  return (
    <>
      {/* Mobile Only - Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 shadow-2xl">
          <Link 
            href="/#get-estimate"
            className="flex items-center justify-center gap-3 px-6 py-4 text-white font-bold text-lg active:scale-95 transition-transform"
          >
            <Camera className="w-6 h-6" />
            <span>📸 Upload Photos – Free Estimate</span>
          </Link>
        </div>
        
        {/* Floating notification badge (optional) */}
        <div className="absolute -top-2 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
          100% FREE
        </div>
      </div>

      {/* Add padding to body to prevent content from being hidden */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 72px;
          }
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </>
  );
}
