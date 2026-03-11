"use client";

import { useState, useEffect } from "react";
import { UserPlus, Copy, Check, DollarSign, TrendingUp, Gift } from "lucide-react";

interface ContractorReferralStats {
  totalReferrals: number;
  signedUpCount: number;
  totalRewards: number;
  referralLink: string;
  referrals: Array<{
    id: string;
    referredEmail: string;
    status: string;
    rewardEarned: number;
    createdAt: string;
  }>;
}

export function ContractorReferralWidget() {
  const [stats, setStats] = useState<ContractorReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/contractor-referral');
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-20 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg">Refer Contractors</h3>
          <p className="text-sm text-slate-600">Earn rewards for every referral</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-black text-green-600">{stats?.totalReferrals || 0}</p>
          <p className="text-xs text-slate-600 font-semibold">Invited</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{stats?.signedUpCount || 0}</p>
          <p className="text-xs text-slate-600 font-semibold">Signed Up</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Gift className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-black text-orange-600">${stats?.totalRewards || 0}</p>
          <p className="text-xs text-slate-600 font-semibold">Earned</p>
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
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
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

      {/* Reward Info */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-900 text-sm mb-1">Earn $50 per Referral!</p>
            <p className="text-xs text-green-800">
              Invite contractors to join QuoteXbert. When they sign up and complete 
              their first job, you earn a $50 credit towards your subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      {stats && stats.referrals && stats.referrals.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-bold text-slate-900 text-sm mb-3">Recent Referrals</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.referrals.slice(0, 5).map((referral) => (
              <div key={referral.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {referral.referredEmail}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(referral.createdAt).toLocaleDateString('en-CA', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {referral.status === 'signed_up' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      Signed Up
                    </span>
                  )}
                  {referral.status === 'active' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      Active
                    </span>
                  )}
                  {referral.status === 'pending' && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                      Pending
                    </span>
                  )}
                  {referral.rewardEarned > 0 && (
                    <span className="text-xs font-bold text-green-600">+${referral.rewardEarned}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!stats || !stats.referrals || stats.referrals.length === 0) && (
        <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
          <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-900 mb-1">No referrals yet</p>
          <p className="text-xs text-slate-600">
            Share your link with other contractors to start earning rewards
          </p>
        </div>
      )}
    </div>
  );
}
