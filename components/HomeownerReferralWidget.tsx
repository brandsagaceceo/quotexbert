"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Mail, MessageCircle, Users } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  estimatesGenerated: number;
  referralLink: string;
}

export function HomeownerReferralWidget() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/homeowner-referral');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!stats?.referralLink) return;
    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareEmail = () => {
    if (!stats?.referralLink) return;
    const subject = encodeURIComponent('Check out QuoteXbert - Free Renovation Estimates');
    const body = encodeURIComponent(
      `I just used QuoteXbert to get an instant renovation estimate and thought you might find it useful!\n\nGet your free AI-powered renovation estimate here:\n${stats.referralLink}\n\nIt takes 2 minutes and you can connect with verified contractors in the GTA.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareSMS = () => {
    if (!stats?.referralLink) return;
    const message = encodeURIComponent(
      `Check out QuoteXbert for free renovation estimates! ${stats.referralLink}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg">Refer Friends</h3>
          <p className="text-sm text-slate-600">Share QuoteXbert & help others</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4">
          <p className="text-2xl font-black text-purple-600">{stats?.totalReferrals || 0}</p>
          <p className="text-xs text-slate-600 font-semibold">Friends Invited</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-2xl font-black text-pink-600">{stats?.estimatesGenerated || 0}</p>
          <p className="text-xs text-slate-600 font-semibold">Estimates Generated</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-2">Your Referral Link</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 font-mono overflow-x-auto whitespace-nowrap">
            {stats?.referralLink || 'Loading...'}
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-4 py-3 rounded-lg font-bold transition flex items-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShareEmail}
          className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-purple-400 text-slate-700 font-semibold py-3 px-4 rounded-lg transition text-sm"
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={handleShareSMS}
          className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-purple-400 text-slate-700 font-semibold py-3 px-4 rounded-lg transition text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Text
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 bg-purple-100 border border-purple-300 rounded-lg p-3">
        <p className="text-xs text-purple-900">
          <strong>How it works:</strong> Share your link with friends planning renovations. 
          When they generate an estimate, we'll track it here!
        </p>
      </div>
    </div>
  );
}
