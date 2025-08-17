"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function AffiliatePage() {
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsJoining(true);
    
    // Simulate affiliate signup
    setTimeout(() => {
      setIsJoining(false);
      setJoined(true);
      setEmail("");
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Affiliate Program - Earn 50% Commission | QuotexBert</title>
        <meta name="description" content="Earn 50% commission referring contractors to QuotexBert. Passive income potential: $500-$5000+ monthly. Join our affiliate program today." />
        <meta property="og:title" content="Affiliate Program - Earn 50% Commission" />
        <meta property="og:description" content="Earn 50% commission referring contractors. Passive income potential up to $5000+ monthly." />
        <meta property="og:image" content="/og-affiliate.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Earn <span className="text-teal-400">50% Commission</span> with QuotexBert's Affiliate Program
            </h1>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Turn your network into passive income by referring contractors to QuotexBert. Our generous 50% commission structure means you earn substantial recurring revenue for every successful referral.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-teal-400 mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">Share Your Link</h3>
                <p className="text-neutral-400 text-sm">Share your unique referral link with contractors in your network</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">They Sign Up</h3>
                <p className="text-neutral-400 text-sm">Contractors register and start claiming leads through your referral</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Earn 50%</h3>
                <p className="text-neutral-400 text-sm">You earn 50% of their lead fees for 12 months automatically</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-semibold mb-2">Get Paid</h3>
                <p className="text-neutral-400 text-sm">Monthly payments via direct deposit or PayPal</p>
              </div>
            </div>
          </div>

          {/* Earning Potential Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Your Earning Potential</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-teal-400">Active Contractors</th>
                      <th className="px-6 py-4 text-left font-semibold text-teal-400">Avg. Monthly Leads</th>
                      <th className="px-6 py-4 text-left font-semibold text-teal-400">Lead Value</th>
                      <th className="px-6 py-4 text-left font-semibold text-teal-400">Your Monthly Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    <tr className="hover:bg-neutral-750">
                      <td className="px-6 py-4 font-medium">5 contractors</td>
                      <td className="px-6 py-4 text-neutral-300">40 leads</td>
                      <td className="px-6 py-4 text-neutral-300">$1,200</td>
                      <td className="px-6 py-4 font-semibold text-teal-400">$600</td>
                    </tr>
                    <tr className="hover:bg-neutral-750">
                      <td className="px-6 py-4 font-medium">10 contractors</td>
                      <td className="px-6 py-4 text-neutral-300">80 leads</td>
                      <td className="px-6 py-4 text-neutral-300">$2,400</td>
                      <td className="px-6 py-4 font-semibold text-teal-400">$1,200</td>
                    </tr>
                    <tr className="hover:bg-neutral-750 bg-teal-900/20">
                      <td className="px-6 py-4 font-medium">25 contractors</td>
                      <td className="px-6 py-4 text-neutral-300">200 leads</td>
                      <td className="px-6 py-4 text-neutral-300">$6,000</td>
                      <td className="px-6 py-4 font-semibold text-teal-400 text-lg">$3,000</td>
                    </tr>
                    <tr className="hover:bg-neutral-750">
                      <td className="px-6 py-4 font-medium">50 contractors</td>
                      <td className="px-6 py-4 text-neutral-300">400 leads</td>
                      <td className="px-6 py-4 text-neutral-300">$12,000</td>
                      <td className="px-6 py-4 font-semibold text-teal-400 text-lg">$6,000</td>
                    </tr>
                    <tr className="hover:bg-neutral-750 bg-gradient-to-r from-teal-900/30 to-emerald-900/30">
                      <td className="px-6 py-4 font-medium">100 contractors</td>
                      <td className="px-6 py-4 text-neutral-300">800 leads</td>
                      <td className="px-6 py-4 text-neutral-300">$24,000</td>
                      <td className="px-6 py-4 font-bold text-teal-400 text-xl">$12,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-neutral-700 text-sm text-neutral-400">
                *Based on average lead value of $30 and 2 leads per contractor per week
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-teal-400 mb-3">High Commission Rate</h3>
              <p className="text-neutral-400">50% commission on all lead fees - one of the highest rates in the industry</p>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Recurring Revenue</h3>
              <p className="text-neutral-400">Earn from each contractor for 12 months - true passive income potential</p>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Real-Time Tracking</h3>
              <p className="text-neutral-400">Dashboard with live stats, earnings, and detailed analytics</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Earning with QuotexBert Today</h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Turn your contractor network into consistent passive income. Join our affiliate program and start earning 50% commission on every referral.
            </p>
            
            {joined ? (
              <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-3xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">Welcome to the Program!</h3>
                <p className="text-neutral-300">Check your email for your affiliate dashboard access and referral link.</p>
              </div>
            ) : (
              <form onSubmit={handleJoinAffiliate} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to join"
                    required
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    disabled={isJoining}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    {isJoining ? "Joining..." : "Join Program"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">How much can I earn?</h3>
                <p className="text-neutral-400">With 50% commission, your earnings depend on how many contractors you refer. Our top affiliates earn $5,000+ monthly.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">When do I get paid?</h3>
                <p className="text-neutral-400">Monthly payments on the 15th via direct deposit or PayPal. Minimum payout threshold is $50.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">How long do I earn from referrals?</h3>
                <p className="text-neutral-400">You earn 50% commission for 12 months from each contractor you refer.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">Is there a cost to join?</h3>
                <p className="text-neutral-400">No cost to join. No monthly fees. You just earn commission on successful referrals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
