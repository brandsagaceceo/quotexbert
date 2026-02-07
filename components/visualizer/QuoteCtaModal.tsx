"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface QuoteCtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationId: string;
  beforeImage: string;
  afterImage: string;
}

export function QuoteCtaModal({ isOpen, onClose, generationId, beforeImage, afterImage }: QuoteCtaModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendToQuote = async () => {
    setLoading(true);
    // Store the images in sessionStorage to pass to quote form
    sessionStorage.setItem("visualizer_before_image", beforeImage);
    sessionStorage.setItem("visualizer_after_image", afterImage);
    sessionStorage.setItem("visualizer_generation_id", generationId);
    
    // Navigate to the quote form
    router.push("/");
    onClose();
  };

  const handleStartNewQuote = () => {
    router.push("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-rose-600 via-orange-600 to-rose-600 p-8 text-white rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-black mb-3">Love This Look?</h2>
            <p className="text-xl text-white text-opacity-90">
              Make it a reality with professional contractors!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Preview Images */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Image
                src={beforeImage}
                alt="Before"
                width={300}
                height={225}
                className="rounded-xl shadow-lg w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-bold">
                Before
              </div>
            </div>
            <div className="relative">
              <Image
                src={afterImage}
                alt="After"
                width={300}
                height={225}
                className="rounded-xl shadow-lg w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-green-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-bold">
                ✨ After
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-4">Why Get a Real Quote from QuoteXbert?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">AI Fair-Price Estimates</div>
                  <div className="text-sm text-gray-600">Know what you should pay before contractors quote</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">100% Free for Homeowners</div>
                  <div className="text-sm text-gray-600">No hidden fees, no commissions, completely free</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Verified Contractors Only</div>
                  <div className="text-sm text-gray-600">All contractors are screened and rated</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Your Vision Images Included</div>
                  <div className="text-sm text-gray-600">These before/after images will be sent to contractors</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSendToQuote}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">📋</span>
                  <span>Send These Images to QuoteXbert AI</span>
                  <span className="text-2xl">→</span>
                </>
              )}
            </button>

            <button
              onClick={handleStartNewQuote}
              className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg border-2 border-gray-300 hover:border-rose-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Or Start a Fresh Quote</span>
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 py-3 font-semibold transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
