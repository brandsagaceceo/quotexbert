"use client";

import { useState } from "react";
import Head from "next/head";

export default function AffiliatePage() {
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsJoining(true);
    
    try {
      const response = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setJoined(true);
        setEmail("");
      } else {
        alert('Failed to join. Please try again.');
      }
    } catch (error) {
      console.error('Error joining affiliate program:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsJoining(false);
    }
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section with Image */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg">
              ✨ AFFILIATE PROGRAM
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-900 via-pink-700 to-orange-900 bg-clip-text text-transparent leading-tight">
              Earn Recurring Income
              <br />
              Referring Contractors
            </h1>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto mb-8 font-medium">
              Join our affiliate program and earn <span className="text-purple-600 font-black">50% commission</span> for every contractor you refer. Turn your network into <span className="text-pink-600 font-black">passive income</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-slate-800">50% Commission</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">🔄</span>
                <span className="font-bold text-slate-800">12 Months Recurring</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-2xl">📈</span>
                <span className="font-bold text-slate-800">Unlimited Referrals</span>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 shadow-2xl border-2 border-purple-100">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-12 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Share Your Link</h3>
                <p className="text-slate-600">Get your unique referral link from your dashboard and share it with contractors</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">They Subscribe</h3>
                <p className="text-slate-600">Contractors sign up and choose their subscription plan through your link</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-pink-600 to-orange-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Earn 50%</h3>
                <p className="text-slate-600">You automatically earn 50% of their subscription fees for 12 full months</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  4
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Get Paid</h3>
                <p className="text-slate-600">Monthly direct deposits to your bank account or PayPal—hassle-free</p>
              </div>
            </div>
          </div>

          {/* Earning Potential Table */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Income Potential</h2>
            <p className="text-center text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Real numbers. Real income. Based on average contractor subscription of $149/month.
            </p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-5 text-left font-bold text-base">Contractors</th>
                      <th className="px-6 py-5 text-left font-bold text-base">Their Revenue</th>
                      <th className="px-6 py-5 text-left font-bold text-base">Your Commission (50%)</th>
                      <th className="px-6 py-5 text-left font-bold text-base">Annual Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">5 contractors</td>
                      <td className="px-6 py-5 text-slate-700">$745/mo</td>
                      <td className="px-6 py-5 font-bold text-purple-600 text-lg">$372/mo</td>
                      <td className="px-6 py-5 font-bold text-slate-900">$4,464/yr</td>
                    </tr>
                    <tr className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">10 contractors</td>
                      <td className="px-6 py-5 text-slate-700">$1,490/mo</td>
                      <td className="px-6 py-5 font-bold text-purple-600 text-lg">$745/mo</td>
                      <td className="px-6 py-5 font-bold text-slate-900">$8,940/yr</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                      <td className="px-6 py-5 font-black text-slate-900 text-lg">25 contractors ⭐</td>
                      <td className="px-6 py-5 text-slate-700 font-semibold">$3,725/mo</td>
                      <td className="px-6 py-5 font-black text-purple-600 text-xl">$1,862/mo</td>
                      <td className="px-6 py-5 font-black text-slate-900 text-lg">$22,344/yr</td>
                    </tr>
                    <tr className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">50 contractors</td>
                      <td className="px-6 py-5 text-slate-700">$7,450/mo</td>
                      <td className="px-6 py-5 font-bold text-purple-600 text-lg">$3,725/mo</td>
                      <td className="px-6 py-5 font-bold text-slate-900">$44,700/yr</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 transition-colors">
                      <td className="px-6 py-5 font-black text-slate-900 text-xl">100 contractors 🚀</td>
                      <td className="px-6 py-5 text-slate-700 font-bold text-lg">$14,900/mo</td>
                      <td className="px-6 py-5 font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl">$7,450/mo</td>
                      <td className="px-6 py-5 font-black text-slate-900 text-xl">$89,400/yr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-slate-50 text-sm text-slate-600 border-t border-slate-200">
                💡 <strong>Pro tip:</strong> Most successful affiliates refer 2-3 contractors per month and reach $2,000+ monthly income within 12 months.
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">High Commission Rate</h3>
              <p className="text-slate-600">50% commission on all lead fees - one of the highest rates in the industry</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">Recurring Revenue</h3>
              <p className="text-slate-600">Earn from each contractor for 12 months - true passive income potential</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">Real-Time Tracking</h3>
              <p className="text-slate-600">Dashboard with live stats, earnings, and detailed analytics</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Start Earning with QuotexBert Today</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Turn your contractor network into consistent passive income. Join our affiliate program and start earning 50% commission on every referral.
            </p>
            
            {joined ? (
              <div className="bg-gradient-to-br from-green-50/80 to-orange-50/80 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-3xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Welcome to the Program!</h3>
                <p className="text-slate-600">Check your email for your affiliate dashboard access and referral link.</p>
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
                    className="flex-1 bg-white/90 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    type="submit"
                    disabled={isJoining}
                    className="bg-gradient-to-r from-red-800 to-orange-600 hover:from-red-900 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-white"
                  >
                    {isJoining ? "Joining..." : "Join Program"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">How much can I earn?</h3>
                <p className="text-slate-600">With 50% commission, your earnings depend on how many contractors you refer. Our top affiliates earn $5,000+ monthly.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">When do I get paid?</h3>
                <p className="text-slate-600">Monthly payments on the 15th via direct deposit or PayPal. Minimum payout threshold is $50.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">How long do I earn from referrals?</h3>
                <p className="text-slate-600">You earn 50% commission for 12 months from each contractor you refer.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">Is there a cost to join?</h3>
                <p className="text-slate-600">No cost to join. No monthly fees. You just earn commission on successful referrals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
