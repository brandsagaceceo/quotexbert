// NEW COMPONENT: Provides helpful photo upload suggestions (non-blocking)
// Usage: <PhotoFeedbackHelper photoCount={1} onDismiss={() => {}} />
"use client";

import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface PhotoFeedbackHelperProps {
  photoCount: number;
  onDismiss?: () => void;
}

export default function PhotoFeedbackHelper({ photoCount, onDismiss }: PhotoFeedbackHelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show feedback after first photo upload
    if (photoCount === 1 && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (photoCount >= 2) {
      setIsVisible(false);
    }
  }, [photoCount, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    onDismiss?.();
  };

  if (!isVisible || photoCount !== 1) return null;

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
      <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Tip:</span> Try adding one closer photo for better accuracy
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
