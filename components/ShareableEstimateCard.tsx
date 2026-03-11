"use client";

import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, Mail } from "lucide-react";

interface ShareableEstimateCardProps {
  estimate: {
    id?: string;
    summary: string;
    category?: string;
    city?: string;
    totals?: {
      total_low: number;
      total_high: number;
    };
  };
}

export function ShareableEstimateCard({ estimate }: ShareableEstimateCardProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/shared-estimate/${estimate.id || 'demo'}`
    : '';

  const estimateRange = estimate.totals 
    ? `$${Math.round(estimate.totals.total_low).toLocaleString()} - $${Math.round(estimate.totals.total_high).toLocaleString()}`
    : 'Contact for quote';

  const shareTitle = `${estimate.category || 'Renovation'} Estimate - ${estimate.city || 'Toronto'}`;
  const shareText = `Check out this renovation estimate: ${estimateRange}. Get your own instant AI estimate at QuoteXbert!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Share This Estimate</h3>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {showShareMenu && (
        <div className="space-y-3 animate-fade-in">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-gray-700 font-medium">
              {copied ? 'Link Copied!' : 'Copy Link'}
            </span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleShareFacebook}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-all group"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600">
              Share on Facebook
            </span>
          </button>

          {/* Twitter */}
          <button
            onClick={handleShareTwitter}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-sky-50 transition-all group"
          >
            <Twitter className="w-5 h-5 text-sky-500" />
            <span className="text-gray-700 font-medium group-hover:text-sky-500">
              Share on Twitter
            </span>
          </button>

          {/* Email */}
          <button
            onClick={handleShareEmail}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium group-hover:text-gray-900">
              Share via Email
            </span>
          </button>
        </div>
      )}

      {/* Shareable Card Preview */}
      <div className="mt-6 p-4 bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg border-2 border-dashed border-rose-200">
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-900 mb-1">
            {estimate.category || 'Renovation'} Estimate
          </h4>
          <p className="text-gray-600 mb-2">{estimate.city || 'Toronto'}</p>
          <p className="text-2xl font-black text-rose-600 mb-3">
            {estimateRange}
          </p>
          <p className="text-sm text-gray-500">
            Generated with QuoteXbert AI
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Share your estimate with friends and family to help them plan their projects!
      </p>
    </div>
  );
}
