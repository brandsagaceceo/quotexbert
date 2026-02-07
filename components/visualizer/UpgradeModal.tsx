"use client";

import { useState } from "react";
import Image from "next/image";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationsUsed: number;
  generationsLimit: number;
}

export function UpgradeModal({ isOpen, onClose, generationsUsed, generationsLimit }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/visualizer/subscribe", {
        method: "POST"
      });
      const data = await response.json();
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Failed to start subscription. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Failed to start subscription. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-8 text-white rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center relative z-10">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>
            <h2 className="text-4xl font-black mb-3">You've Reached Your Free Limit!</h2>
            <p className="text-xl text-white text-opacity-90">
              Used {generationsUsed} of {generationsLimit} free AI generations this month
            </p>
          </div>
          </div>

          {/* Content */}
          <div className="p-8">
          {/* Upgrade Offer */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">AI Visualizer Pro</h3>
                <p className="text-gray-600 font-semibold">Unlimited AI room transformations</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">
                  $6.99
                </div>
                <div className="text-sm font-semibold text-gray-600">/month CAD</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">♾️ Unlimited Generations</div>
                  <div className="text-sm text-gray-600">Transform as many rooms as you want, anytime</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">🎨 Premium AI Models</div>
                  <div className="text-sm text-gray-600">Access to the latest and most advanced AI</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">⚡ Priority Processing</div>
                  <div className="text-sm text-gray-600">Faster generation times, no waiting</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">💾 Save All Designs</div>
                  <div className="text-sm text-gray-600">Download and keep all your visualizations forever</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">❌ Cancel Anytime</div>
                  <div className="text-sm text-gray-600">No long-term commitment required</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
                <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
                <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Join 1,247+ Homeowners</div>
                <div className="text-sm text-gray-600">Already using AI Visualizer Pro</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              <span>⭐⭐⭐⭐⭐</span>
              <span className="text-gray-700 font-semibold ml-2">4.9/5 Rating</span>
            </div>
            <p className="text-gray-700 italic">"This tool helped me visualize my renovation before spending thousands. Worth every penny!" - Sarah M.</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-6 rounded-2xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="text-3xl">🚀</span>
                <span>Upgrade to Pro for $6.99/mo</span>
                <span className="text-3xl">→</span>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            Secure payment powered by Stripe • Cancel anytime
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
