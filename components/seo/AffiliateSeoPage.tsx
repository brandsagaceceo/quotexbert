"use client";

import { useState } from "react";

interface EarningExample {
  contractors: string;
  monthly: string;
  annual: string;
  highlight?: boolean;
}

interface AffiliateSeoPageProps {
  badge: string;
  headline: string;
  subheadline: string;
  introText: string;
  earnings: EarningExample[];
  steps: { icon: string; title: string; desc: string }[];
  ctaHeadline: string;
  ctaText: string;
}

export default function AffiliateSeoPage({
  badge,
  headline,
  subheadline,
  introText,
  earnings,
  steps,
  ctaHeadline,
  ctaText,
}: AffiliateSeoPageProps) {
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsJoining(true);
    try {
      const res = await fetch("/api/affiliate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          landingUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.success && data.referralUrl) {
        setReferralUrl(data.referralUrl);
        setEmail("");
      } else {
        alert("Failed to join. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopy = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = referralUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 -mt-[var(--header-height,64px)] pt-[calc(var(--header-height,64px)+3rem)]">
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white rounded-full font-bold text-sm shadow-lg">
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-rose-900 via-orange-700 to-amber-900 bg-clip-text text-transparent leading-tight">
            {headline}
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">
            {subheadline}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">
          <p className="text-lg text-slate-700 leading-relaxed">{introText}</p>
        </div>

        {/* Earnings Table */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-6 bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">
            Your Earning Potential
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-orange-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-rose-700 to-orange-600 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-bold text-sm">
                      Referrals
                    </th>
                    <th className="px-5 py-4 text-left font-bold text-sm">
                      Monthly Income
                    </th>
                    <th className="px-5 py-4 text-left font-bold text-sm">
                      Annual Income
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {earnings.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.highlight
                          ? "bg-gradient-to-r from-rose-50 to-orange-50 font-bold"
                          : "hover:bg-rose-50/50 transition-colors"
                      }
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {row.contractors}
                      </td>
                      <td className="px-5 py-4 font-bold text-rose-700 text-lg">
                        {row.monthly}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {row.annual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-slate-50 text-sm text-slate-600 border-t border-slate-200">
              💡 Based on average contractor subscription of $149/month CAD with
              20% commission for 12 months.
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-6 text-slate-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900">
            {ctaHeadline}
          </h2>
          <p className="text-lg text-slate-600 mb-6 max-w-xl mx-auto">
            {ctaText}
          </p>

          {referralUrl ? (
            <div className="bg-white rounded-xl p-6 max-w-lg mx-auto shadow-md">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-700 mb-1">
                Your Referral Link Is Ready
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Share this link to start earning monthly income.
              </p>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 bg-transparent text-slate-800 text-sm font-mono truncate outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:shadow-md"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href="/affiliate-dashboard"
                  className="text-rose-700 hover:text-rose-800 font-semibold text-sm underline"
                >
                  View your dashboard →
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to join"
                  required
                  className="flex-1 bg-white/90 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <button
                  type="submit"
                  disabled={isJoining}
                  className="bg-gradient-to-r from-red-800 to-orange-600 hover:from-red-900 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-white"
                >
                  {isJoining ? "Joining..." : "Join Free →"}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Free to join. No fees. Start earning immediately.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
