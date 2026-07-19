"use client";

import { useEffect, useState } from 'react';
import { X, Camera, Sparkles } from 'lucide-react';

interface ExitIntentModalProps {
  onCaptureEmail?: (email: string) => void;
}

export function ExitIntentModal({ onCaptureEmail }: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [isVisible]);

  useEffect(() => {
    // Don't show if already shown in this session
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Add delay to avoid triggering immediately on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCaptureEmail && email) {
      onCaptureEmail(email);
    }
    // Redirect to estimate flow
    window.location.href = '/create-lead';
  };

  const handleSkipToEstimate = () => {
    window.location.href = '/create-lead';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal - mobile-optimized */}
      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center p-3 sm:p-4" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="relative flex max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-white to-orange-50 shadow-2xl sm:rounded-3xl animate-scale-in">
          {/* Close button - larger tap target for mobile */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg bg-white/80 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto overscroll-contain px-5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-8 md:px-10 md:pb-10 md:pt-9">
          <div className="space-y-4 sm:space-y-5">
            {/* Icon */}
            <div className="flex justify-center pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-[#800020] rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-[#800020] rounded-full p-5">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Wait! Don't Get Ripped Off 💰
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold leading-relaxed">
              See <span className="text-rose-600">what your project should actually cost</span> before hiring anyone
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Free • 30 seconds • Based on 1,000+ real GTA projects</span>
            </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (optional)"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none text-base transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Optional: Get your estimate sent to your inbox
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800020] hover:bg-[#600018] text-white font-bold py-4 sm:py-5 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                📸 Upload Photos → Get Free Estimate
              </button>
            </form>

            {/* Skip option */}
            <button
              onClick={handleSkipToEstimate}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors text-xs sm:text-sm"
            >
              Skip and continue to estimate →
            </button>

            {/* Social Proof */}
            <div className="bg-white/80 rounded-xl p-3 sm:p-4 text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-amber-400 text-lg sm:text-xl">★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Built for Toronto homeowners comparing renovation quotes
              </p>
              <p className="text-xs text-gray-500 mt-1">
                "Got my bathroom estimate in under 3 minutes!" - Sarah, Midtown Toronto
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
