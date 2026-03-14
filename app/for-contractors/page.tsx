"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import { trackContractorJoinClicked } from "@/lib/tracking";

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
              <span className="text-white/90 font-semibold text-sm uppercase tracking-wide">For Toronto & GTA Contractors</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Get Toronto Renovation Leads<br />
              <span className="text-rose-200">
                Without Bidding Wars
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join contractors across Toronto receiving real homeowner renovation leads.
            </p>
            
            {/* Benefits List */}
            <div className="max-w-2xl mx-auto mb-10">
              <ul className="grid md:grid-cols-2 gap-4 text-left">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-slate-200 text-lg">Instant renovation leads</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-200 text-lg">Choose your service categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="text-slate-200 text-lg">No bidding wars</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-slate-200 text-lg">Build your contractor profile</span>
                </li>
                <li className="flex items-start gap-3 md:col-span-2 justify-center">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-slate-200 text-lg">Grow your renovation business</span>
                </li>
              </ul>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href={isSignedIn && authUser?.role === 'contractor' ? '/contractor/jobs' : '/sign-up?role=contractor'}
                onClick={() => trackContractorJoinClicked('for_contractors_hero')}
                data-track="contractor_join_clicked"
                className="inline-flex items-center justify-center gap-2 bg-brand text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-dark transition-all transform hover:scale-105 shadow-2xl text-lg w-full sm:w-auto"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isSignedIn && authUser?.role === 'contractor' ? 'Go to Dashboard' : 'Join as Contractor'}
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
                <div className="text-3xl md:text-4xl font-black text-white mb-1">45+</div>
                <div className="text-slate-400 text-sm">Active Leads</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-3xl md:text-4xl font-black text-rose-200 mb-1">12</div>
                <div className="text-slate-400 text-sm">Categories</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <div className="text-3xl md:text-4xl font-black text-rose-200 mb-1">GTA</div>
                <div className="text-slate-400 text-sm">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Strip */}
      <section className="bg-brand/5 border-b border-brand/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Badge 1 */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm md:text-base">AI-Powered</div>
                <div className="text-xs text-slate-600">Smart Estimates</div>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm md:text-base">Toronto-Focused</div>
                <div className="text-xs text-slate-600">GTA Leads Only</div>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm md:text-base">No Bidding Wars</div>
                <div className="text-xs text-slate-600">Fair Pricing</div>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm md:text-base">Instant Alerts</div>
                <div className="text-xs text-slate-600">Real-Time Notify</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-20 bg-brand/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Estimate Your Potential Earnings
            </h2>
            <p className="text-xl text-slate-600">
              See how much you could earn as a QuoteXbert contractor
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-brand/30">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Input 1: Jobs per month */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Number of jobs per month
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  defaultValue="3"
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  onChange={(e) => {
                    const jobs = parseInt(e.target.value);
                    const jobValue = parseInt((document.getElementById('jobValue') as HTMLInputElement)?.value || '5000');
                    const revenue = jobs * jobValue;
                    const revenueEl = document.getElementById('monthlyRevenue');
                    const jobsEl = document.getElementById('jobsDisplay');
                    if (revenueEl) revenueEl.textContent = `$${revenue.toLocaleString()}`;
                    if (jobsEl) jobsEl.textContent = jobs.toString();
                  }}
                  id="jobsInput"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-2">
                  <span>1</span>
                  <span id="jobsDisplay" className="font-bold text-brand">3</span>
                  <span>20</span>
                </div>
              </div>

              {/* Input 2: Average job value */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Average renovation value
                </label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  defaultValue="5000"
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  onChange={(e) => {
                    const jobValue = parseInt(e.target.value);
                    const jobs = parseInt((document.getElementById('jobsInput') as HTMLInputElement)?.value || '3');
                    const revenue = jobs * jobValue;
                    const revenueEl = document.getElementById('monthlyRevenue');
                    const valueEl = document.getElementById('valueDisplay');
                    if (revenueEl) revenueEl.textContent = `$${revenue.toLocaleString()}`;
                    if (valueEl) valueEl.textContent = `$${jobValue.toLocaleString()}`;
                  }}
                  id="jobValue"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-2">
                  <span>$500</span>
                  <span id="valueDisplay" className="font-bold text-brand">$5,000</span>
                  <span>$50,000</span>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="bg-brand rounded-xl p-8 text-center">
              <p className="text-rose-100 text-lg mb-2">Estimated Monthly Revenue</p>
              <p id="monthlyRevenue" className="text-6xl font-black text-white mb-4">
                $15,000
              </p>
              <p className="text-rose-100 text-sm">
                Based on completing <span id="jobsCalc">3</span> jobs per month
              </p>
            </div>

            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Actual earnings vary based on your trade, location, and business efficiency. 
                QuoteXbert provides leads - your success depends on your quality of work and customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor Success Stories */}
      <section className="py-20 bg-brand/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              What Contractors Are Saying
            </h2>
            <p className="text-xl text-slate-600">
              Real feedback from contractors growing their business with QuoteXbert
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed italic">
                "I started getting renovation leads within days of signing up. No more cold calling or expensive advertising. 
                The homeowners are serious and have realistic budgets. Best decision for my business."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div>
                  <div className="font-bold text-slate-900">John D.</div>
                  <div className="text-sm text-slate-600">General Contractor, Toronto</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed italic">
                "QuoteXbert sends real homeowners ready to hire, not tire kickers. Every lead comes with photos, 
                budget estimates, and clear project details. Way better than bidding sites where I waste time on lowball offers."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <div className="font-bold text-slate-900">Maria R.</div>
                  <div className="text-sm text-slate-600">Renovation Specialist, GTA</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed italic">
                "The flat monthly fee makes budgeting simple. I'm not worrying about per-lead costs eating my profit. 
                Plus the AI estimates help homeowners understand realistic pricing before they even contact me."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
                <div>
                  <div className="font-bold text-slate-900">Tom K.</div>
                  <div className="text-sm text-slate-600">Kitchen & Bath Specialist, North York</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed italic">
                "Finally, a platform that respects contractors. No bidding wars, no racing to the bottom on price. 
                I get to review leads and choose the projects that fit my schedule and expertise. Growing steadily every month."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <div className="font-bold text-slate-900">Alex P.</div>
                  <div className="text-sm text-slate-600">Handyman Services, Mississauga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Contact Section */}
      <section className="py-16 bg-brand/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Questions About Joining QuoteXbert?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Our team is here to help you get started
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:9052429460"
              className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-brand/30"
            >
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-600">Call us</div>
                <div className="text-lg font-black text-slate-900">📞 905-242-9460</div>
              </div>
            </a>
            <a
              href="mailto:quotexbert@gmail.com"
              className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-brand/30"
            >
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-600">Email us</div>
                <div className="text-base font-bold text-slate-900">QuoteXbert@gmail.com</div>
              </div>
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            <strong>Support Hours:</strong> Monday – Friday, 9 AM – 6 PM EST
          </p>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="py-20 bg-brand/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentActivityFeed
            maxItems={8}
            showTitle={true}
            title="Recent Renovation Leads"
            description="See real renovation leads being generated across Toronto & GTA"
          />
        </div>
      </section>

      {/* Example Renovation Leads */}
      <section className="py-20 bg-brand/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Example Renovation Leads
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real examples of the kinds of projects homeowners post on QuoteXbert
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Example Lead 1 */}
            <div className="bg-brand/5 rounded-xl p-6 border-2 border-brand/30 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚿</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Bathroom Renovation</h3>
              <div className="flex items-center gap-2 text-slate-600 mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-sm md:text-base">Toronto</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-brand-dark mb-3">$5,200</div>
              <p className="text-xs md:text-sm text-slate-600">Complete bathroom remodel including fixtures, tile, and vanity</p>
            </div>

            {/* Example Lead 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🍳</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Kitchen Remodel</h3>
              <div className="flex items-center gap-2 text-slate-600 mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-sm md:text-base">North York</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-blue-700 mb-3">$18,400</div>
              <p className="text-xs md:text-sm text-slate-600">Full kitchen renovation with new cabinets, countertops, and appliances</p>
            </div>

            {/* Example Lead 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏡</div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Deck Build</h3>
              <div className="flex items-center gap-2 text-slate-600 mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-sm md:text-base">Etobicoke</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-green-700 mb-3">$8,900</div>
              <p className="text-xs md:text-sm text-slate-600">New composite deck construction, 400 sq ft with railing</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href={isSignedIn && authUser?.role === 'contractor' ? '/contractor/jobs' : '/sign-up?role=contractor'}
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-dark transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Start Getting Leads Like These</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-brand/5">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-brand/40 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-brand/40 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-brand/40 transition-colors h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
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
      <section className="py-20 bg-brand/5">
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
            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pre-Qualified Homeowners</h3>
                <p className="text-slate-600">Every lead has a budget, timeline, and project details. No tire kickers or price shoppers—just serious homeowners ready to hire.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Per-Lead Fees</h3>
                <p className="text-slate-600">Flat monthly subscription. Accept unlimited leads in your categories without worrying about per-lead costs eating your margins.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
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

            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Notifications</h3>
                <p className="text-slate-600">Get email and in-app alerts the moment a matching lead is posted. Be first to respond and win more jobs with fast turnaround times.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Reputation</h3>
                <p className="text-slate-600">Showcase your portfolio, collect verified reviews, and build credibility. Your profile helps homeowners choose you with confidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-brand/5 rounded-xl p-6 border border-brand/30">
              <div className="flex-shrink-0 w-14 h-14 bg-brand rounded-xl flex items-center justify-center">
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
      <section className="py-20 bg-brand/5">
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
                className="bg-white rounded-lg p-4 text-center border-2 border-slate-200 hover:border-brand/50 hover:shadow-lg transition-all"
              >
                <div className="font-semibold text-slate-900">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand/5">
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
              className="inline-flex items-center justify-center gap-2 bg-white text-brand font-black px-8 py-4 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl text-lg"
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
