"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { QRCodeCanvas } from "qrcode.react";
import { 
  ClipboardDocumentIcon, 
  QrCodeIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface AffiliateStats {
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  referrals: number;
  clicks: number;
  conversionRate: number;
}

export default function AffiliateDashboard() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadAffiliateData();
    }
  }, [isLoaded, user]);

  const loadAffiliateData = async () => {
    try {
      // In a real implementation, this would fetch from your API
      // For now, generate a unique code based on user email
      const referralCode = user?.emailAddresses[0]?.emailAddress
        ?.split('@')[0]
        ?.toUpperCase()
        ?.replace(/[^A-Z0-9]/g, '') || 'HOMEOWNER';

      setStats({
        referralCode,
        totalEarnings: 0,
        pendingEarnings: 0,
        referrals: 0,
        clicks: 0,
        conversionRate: 0
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading affiliate data:", error);
      setLoading(false);
    }
  };

  const getReferralUrl = () => {
    if (!stats) return "";
    return `https://quotexbert.com/?ref=${stats.referralCode}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `quotexbert-affiliate-${stats?.referralCode}.png`;
    link.href = url;
    link.click();
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Sign In Required</h1>
          <p className="text-slate-600 mb-6">Please sign in to access your affiliate dashboard</p>
          <Link
            href="/sign-in"
            className="inline-block bg-gradient-to-r from-rose-700 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const referralUrl = getReferralUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-rose-900 via-rose-700 to-rose-600 bg-clip-text text-transparent">
            Affiliate Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Welcome back, {user.firstName || 'Affiliate'}! Here's your performance overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-rose-100">
            <div className="flex items-center justify-between mb-2">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              <span className="text-xs text-slate-500">Total Earned</span>
            </div>
            <div className="text-3xl font-black text-slate-900">${stats?.totalEarnings.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-slate-500 mt-1">All-time earnings</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <CurrencyDollarIcon className="w-8 h-8 text-orange-600" />
              <span className="text-xs text-slate-500">Pending</span>
            </div>
            <div className="text-3xl font-black text-slate-900">${stats?.pendingEarnings.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-slate-500 mt-1">Awaiting payout</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <UsersIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xs text-slate-500">Referrals</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{stats?.referrals || 0}</div>
            <div className="text-xs text-slate-500 mt-1">Successful signups</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
              <span className="text-xs text-slate-500">Conversion</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{stats?.conversionRate.toFixed(1) || '0.0'}%</div>
            <div className="text-xs text-slate-500 mt-1">{stats?.clicks || 0} clicks</div>
          </div>
        </div>

        {/* Referral Tools */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Referral Link */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center">
                <ClipboardDocumentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Referral Link</h2>
                <p className="text-sm text-slate-600">Share this link to earn 20% commission</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Referral Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stats?.referralCode || ''}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 font-mono text-lg font-bold"
                />
                <button
                  onClick={() => copyToClipboard(stats?.referralCode || '')}
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {copied ? <CheckCircleIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(referralUrl)}
                  className="px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg p-4 border border-rose-200">
              <p className="text-sm text-slate-700">
                <strong>💡 Pro Tip:</strong> Use this link in your email signature, social media bio, or share it directly with contractors you know!
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <QrCodeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">QR Code</h2>
                <p className="text-sm text-slate-600">Print and share anywhere</p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-rose-100 mb-4">
                <QRCodeCanvas
                  ref={qrRef}
                  value={referralUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg"
                />
              </div>
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download QR Code
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-slate-700">
                <strong>📱 Use Cases:</strong> Print on business cards, flyers, or display at networking events to make sharing easy!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/affiliate-university"
            className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <AcademicCapIcon className="w-12 h-12 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-2xl font-bold">Affiliate University</h3>
                <p className="text-purple-100">Learn how to maximize your earnings</p>
              </div>
            </div>
            <p className="text-purple-50 mb-4">
              Access free training, best practices, and proven strategies to find contractors and grow your affiliate income.
            </p>
            <div className="flex items-center gap-2 text-white font-semibold">
              Start Learning →
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <ChartBarIcon className="w-12 h-12 text-rose-600" />
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Commission Breakdown</h3>
                <p className="text-slate-600">How you earn</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div>
                  <p className="font-semibold text-slate-900">Contractor Subscriptions</p>
                  <p className="text-sm text-slate-600">Per month for 12 months</p>
                </div>
                <div className="text-2xl font-black text-rose-700">20%</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-slate-900">Homeowner Leads</p>
                  <p className="text-sm text-slate-600">Per qualified lead posted</p>
                </div>
                <div className="text-2xl font-black text-green-700">$15</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Tips */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Quick Marketing Ideas
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-rose-700">Online:</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Add your link to your email signature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Share on Facebook, LinkedIn, Instagram</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Create a blog post about finding contractors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Join contractor Facebook groups and forums</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Add a banner to your website/blog</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-rose-700">Offline:</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Print QR codes on business cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Display QR code at networking events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Share with contractor friends directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Mention to tradespeople you meet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Create flyers for local contractor supply stores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Referrals</h2>
          {stats?.referrals === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <UsersIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">No referrals yet</p>
              <p className="text-slate-500 mb-6">Start sharing your link to see your referrals here!</p>
              <Link
                href="/affiliate-university"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <AcademicCapIcon className="w-5 h-5" />
                Learn How to Get Referrals
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Future: Map through actual referral data */}
              <p className="text-slate-600">Your referrals will appear here once contractors sign up using your link.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
