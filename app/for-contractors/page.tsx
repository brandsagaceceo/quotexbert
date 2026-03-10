"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ForContractorsPage() {
  const { isSignedIn, authUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    "Plumbing", "Electrical", "HVAC", "Roofing",
    "Flooring", "Painting", "Landscaping", "Carpentry",
    "Masonry", "Drywall", "Fencing", "General Contractor"
  ];

  const faqs = [
    {
      q: "How do I get paid?",
      a: "You set your own prices and payment terms with homeowners. QuoteXbert connects you with leads but doesn't handle payments directly. We recommend using professional contracts and secure payment methods."
    },
    {
      q: "What's the monthly subscription cost?",
      a: "Plans start at $79/month for handymen (4 categories, 15 leads/month) and go up to $199/month for general contractors (all 12 categories, 50 leads/month). No per-lead fees."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes! Cancel anytime with no penalties. Your subscription remains active until the end of your billing period."
    },
    {
      q: "What verification do I need?",
      a: "We verify your business license, insurance, and WSIB coverage. This protects both you and homeowners, and builds trust in our platform."
    },
    {
      q: "How fast do I get leads?",
      a: "New leads are posted daily. You'll get instant notifications for projects matching your categories and service area. Most contractors see their first lead within 24 hours."
    },
    {
      q: "What areas do you serve?",
      a: "Toronto and the Greater Toronto Area (GTA) including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, and surrounding cities."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-rose-600/20 border border-rose-500/30 rounded-full px-5 py-2 mb-6">
              <span className="text-rose-400 font-semibold text-sm uppercase tracking-wide">For Toronto & GTA Contractors</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Get Toronto Renovation Leads<br />
              <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                Without Bidding Wars
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access pre-qualified homeowners ready to hire. Choose your categories, 
              set your radius, and get instant notifications for local projects.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href={isSignedIn && authUser?.role === 'contractor' ? '/contractor/jobs' : '/sign-up?role=contractor'}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-2xl text-lg w-full sm:w-auto"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isSignedIn && authUser?.role === 'contractor' ? 'Go to Dashboard' : 'Start as Contractor'}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-slate-700/50 border-2 border-slate-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-slate-600/50 transition-colors w-full sm:w-auto"
              >
                See How It Works
              </a>
            </div>
            
            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-3xl md:text-4xl font-black text-rose-400 mb-1">45+</div>
                <div className="text-slate-400 text-sm">Active Leads</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-3xl md:text-4xl font-black text-orange-400 mb-1">12</div>
                <div className="text-slate-400 text-sm">Categories</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1">GTA</div>
                <div className="text-slate-400 text-sm">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              How QuoteXbert Works for Contractors
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get quality leads faster than traditional methods. No cold calling. No dead ends.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-rose-300 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                  1
                </div>
                <div className="text-5xl mb-4 mt-2">📋</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Sign Up & Get Verified</h3>
                <p className="text-slate-600 leading-relaxed">
                  Create your profile, choose service categories, and set your coverage area. 
                  We verify your license, insurance, and credentials to build homeowner trust.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-rose-300 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                  2
                </div>
                <div className="text-5xl mb-4 mt-2">🔔</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Get Instant Notifications</h3>
                <p className="text-slate-600 leading-relaxed">
                  Receive real-time alerts when homeowners post projects matching your trades and location. 
                  View project details, photos, budgets, and timelines instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-rose-300 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                  3
                </div>
                <div className="text-5xl mb-4 mt-2">💼</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Accept & Connect</h3>
                <p className="text-slate-600 leading-relaxed">
                  Review leads, accept jobs you want, and message homeowners directly through our platform. 
                  Build your portfolio, get reviews, and grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contractors Join */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Why Contractors Choose QuoteXbert
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Stop wasting time on unqualified leads. Focus on what you do best: great work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pre-Qualified Homeowners</h3>
                <p className="text-slate-600">Every lead has a budget, timeline, and project details. No tire kickers or price shoppers—just serious homeowners ready to hire.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Per-Lead Fees</h3>
                <p className="text-slate-600">Flat monthly subscription. Accept unlimited leads in your categories without worrying about per-lead costs eating your margins.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Local Toronto & GTA Focus</h3>
                <p className="text-slate-600">All projects are in your service area. Set your coverage radius and only see leads you can actually service. No wasted time on out-of-area jobs.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Notifications</h3>
                <p className="text-slate-600">Get email and in-app alerts the moment a matching lead is posted. Be first to respond and win more jobs with fast turnaround times.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Reputation</h3>
                <p className="text-slate-600">Showcase your portfolio, collect verified reviews, and build credibility. Your profile helps homeowners choose you with confidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Full Control</h3>
                <p className="text-slate-600">Choose which leads to accept. Set your own prices. Control your workload. No bidding wars or pressure to underprice your services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Choose Your Service Categories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access leads in the trades you specialize in. Our plans include multiple categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-white rounded-lg p-4 text-center border-2 border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all"
              >
                <div className="font-semibold text-slate-900">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                  <svg
                    className={`w-6 h-6 text-slate-600 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Join Toronto contractors who are getting quality leads without the hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn && authUser?.role === 'contractor' ? '/contractor/jobs' : '/sign-up?role=contractor'}
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 font-black px-8 py-4 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl text-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isSignedIn && authUser?.role === 'contractor' ? 'Go to Dashboard' : 'Join as Contractor'}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-rose-700/50 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-rose-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
