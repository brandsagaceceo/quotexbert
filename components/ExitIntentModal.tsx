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
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="relative bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 transform animate-scale-in">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-rose-500 to-orange-500 rounded-full p-5">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Wait! Don't Get Ripped Off 💰
            </h2>
            <p className="text-xl text-gray-700 font-semibold">
              See <span className="text-rose-600">what your project should actually cost</span> before hiring anyone
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Free • 30 seconds • Based on 1,000+ real GTA projects</span>
            </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (optional)"
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none text-lg transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Optional: Get your estimate sent to your inbox
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                📸 Upload Photos → Get Free Estimate
              </button>
            </form>

            {/* Skip option */}
            <button
              onClick={handleSkipToEstimate}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors text-sm"
            >
              Skip and continue to estimate →
            </button>

            {/* Social Proof */}
            <div className="bg-white/80 rounded-xl p-4 text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 font-medium">
                Join 2,500+ happy Toronto homeowners
              </p>
              <p className="text-xs text-gray-500 mt-1">
                "Got my bathroom estimate in under 3 minutes!" - Sarah, Midtown Toronto
              </p>
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
