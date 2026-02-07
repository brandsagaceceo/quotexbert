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

  const defaultReviewUrl = googleReviewUrl || "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review";

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
      
      {/* Modal */}
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
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
              <h2 className="text-3xl font-bold text-gray-900">
                Was this helpful?
              </h2>
              <p className="text-lg text-gray-600">
                Share your experience with QuoteXbert!
              </p>
            </div>

            {/* Stars Display */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-8 h-8 text-amber-400 fill-current" 
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleLeaveReview}
                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Leave a Google Review ⭐
              </button>
              
              <button
                onClick={handleClose}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-gray-500 pt-4">
              Your feedback helps Toronto homeowners make better decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
