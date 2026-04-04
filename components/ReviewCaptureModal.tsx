"use client";

import { useEffect, useState } from 'react';
import { X, Star } from 'lucide-react';

interface ReviewCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleReviewUrl?: string;
}

export function ReviewCaptureModal({ isOpen, onClose, googleReviewUrl }: ReviewCaptureModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use env var if set; otherwise fall back to Google Maps search (set NEXT_PUBLIC_GOOGLE_REVIEW_URL in Vercel to the writereview URL)
  const defaultReviewUrl = (googleReviewUrl && !googleReviewUrl.includes('YOUR_'))
    ? googleReviewUrl
    : 'https://www.google.com/maps/search/QuoteXbert+Toronto+renovation+quotes';

  const handleLeaveReview = () => {
    window.open(defaultReviewUrl, '_blank');
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal - mobile-optimized */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 py-6 sm:py-8">
        <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all duration-300 max-h-[min(90vh,85vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] overflow-y-auto ${isVisible ? 'scale-100' : 'scale-95'}`}>
          {/* Close button - larger tap target for mobile */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Content */}
          <div className="text-center space-y-6">
            {/* Star Icon */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-4">
                <Star className="w-12 h-12 text-white fill-current" />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Was this helpful?
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Share your experience with QuoteXbert!
              </p>
            </div>

            {/* Stars Display */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-current" 
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleLeaveReview}
                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-base touch-target"
              >
                Leave a Google Review ⭐
              </button>
              
              <button
                onClick={handleClose}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 transition-colors text-sm touch-target"
              >
                Maybe later
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-xs sm:text-sm text-gray-500 pt-4">
              Your feedback helps Toronto homeowners make better decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
