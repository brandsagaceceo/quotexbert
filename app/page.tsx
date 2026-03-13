"use client";

import { useState, lazy, Suspense, useEffect } from "react";
import Link from "next/link";
import { IPhoneEstimatorMockup } from "@/components/IPhoneEstimatorMockup";
import { EstimateResults } from "@/components/EstimateResults";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ReviewsSection, Review } from "@/components/ReviewsSection";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { TrustSignals } from "@/components/TrustSignals";
import { StickyCTA } from "@/components/StickyCTA";
import { useAuth } from "@/lib/hooks/useAuth";
import { trackEstimateComplete, trackCTAClick } from "@/components/GoogleAnalytics";
import RecentActivityFeed from "@/components/RecentActivityFeed";

// Lazy load below-the-fold components for better performance
const ServiceAreaCities = lazy(() => import("@/components/ServiceAreaCities").then(mod => ({ default: mod.ServiceAreaCities })));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })));
const ExitIntentModal = lazy(() => import("@/components/ExitIntentModal").then(mod => ({ default: mod.ExitIntentModal })));
const ReviewCaptureModal = lazy(() => import("@/components/ReviewCaptureModal").then(mod => ({ default: mod.ReviewCaptureModal })));
const ExampleEstimates = lazy(() => import("@/components/ExampleEstimates"));
const TrustFAQ = lazy(() => import("@/components/TrustFAQ"));

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [showSignUpGate, setShowSignUpGate] = useState(false);
  const { authUser: user, isSignedIn } = useAuth();

  // Read localStorage on mount to know if this visitor already used their free estimate
  useEffect(() => {
    setHasUsedFree(localStorage.getItem('estimateUsed') === '1');
  }, []);

  // Block the estimator for unauthenticated visitors who have already used their 1 free estimate
  const isEstimatorBlocked = !isSignedIn && hasUsedFree;

  // In production, fetch real reviews from API
  const realReviews: Review[] = []; // Empty for now - will show examples

  const handleGetContractorBids = () => {
    trackCTAClick('estimate_results', 'Get Contractor Bids');
    
    // Save estimate data to localStorage before redirecting
    if (estimateResult) {
      const estimateData = {
        projectDescription: estimateResult.summary,
        min: estimateResult.totals?.total_low || 0,
        max: estimateResult.totals?.total_high || 0,
        photos: [], // Photos will be re-uploaded in create-lead page
        scope: estimateResult.scope || [],
        lineItems: estimateResult.line_items || [],
      };
      localStorage.setItem('estimate_data', JSON.stringify(estimateData));
    }
    
    if (isSignedIn) {
      window.location.href = '/create-lead';
    } else {
      window.location.href = '/sign-up';
    }
  };

  const handleSaveEstimate = () => {
    if (isSignedIn) {
      // Save to database
      alert("Feature coming soon: Save and email estimates!");
    } else {
      alert("Please sign in to save your estimate");
      window.location.href = '/sign-in';
    }
  };

  const handleEstimateComplete = (result: any) => {
    setEstimateResult(result);
    trackEstimateComplete(result?.total);

    // Mark free estimate as used for unauthenticated visitors
    if (!isSignedIn) {
      localStorage.setItem('estimateUsed', '1');
      setHasUsedFree(true);
    }
    
    // Show review modal after successful estimate (5 second delay)
    setTimeout(() => {
      setShowReviewModal(true);
    }, 5000);
  };

  const handleCaptureEmail = async (email: string) => {
    // Send email to backend
    console.log('Captured email:', email);
    // TODO: Implement email capture API call
  };

  return (
    <>
      {/* Enhanced JSON-LD Structured Data */}
      <LocalBusinessSchema googleBusinessUrl="YOUR_GOOGLE_BUSINESS_URL_HERE" />

      {/* Exit Intent Modal */}
      <Suspense fallback={null}>
        <ExitIntentModal onCaptureEmail={handleCaptureEmail} />
      </Suspense>

      {/* Sticky Mobile CTA */}
      <StickyCTA />

      {/* ── Sign-Up Gate Modal ── shown when a guest tries a 2nd estimate ── */}
      {showSignUpGate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignUpGate(false); }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {/* Close */}
            <button
              onClick={() => setShowSignUpGate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            {/* Icon */}
            <div className="text-5xl mb-4">🎉</div>

            {/* Heading */}
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              You've used your free estimate!
            </h2>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              Create a <strong>free account</strong> to unlock unlimited AI estimates, save your projects, and get bids from verified GTA contractors.
            </p>

            {/* Benefit list */}
            <ul className="text-left text-sm text-slate-700 space-y-2 mb-7">
              {[
                "♾️  Unlimited AI renovation estimates",
                "💾  Save & revisit past estimates",
                "📬  Post jobs to 500+ verified contractors",
                "💬  Direct messaging with contractors",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <a
              href="/sign-up"
              className="block w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl text-base transition mb-3"
            >
              Create Free Account →
            </a>
            <a
              href="/sign-in"
              className="block w-full text-slate-600 hover:text-rose-600 text-sm font-medium transition"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
      )}

      {/* Review Capture Modal */}
      <Suspense fallback={null}>
        <ReviewCaptureModal 
          isOpen={showReviewModal} 
          onClose={() => setShowReviewModal(false)}
          googleReviewUrl="YOUR_GOOGLE_REVIEW_URL_HERE"
        />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-safe md:pb-0">
        {/* Contractor CTA Banner - Above The Fold */}
        {user?.role === 'contractor' && (
          <section className="relative bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 text-white py-6 md:py-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-black mb-2">
                    🎯 Ready to Grow Your Business?
                  </h2>
                  <p className="text-lg md:text-xl text-rose-100">
                    Browse 45+ active leads in Toronto & GTA • Get qualified projects today
                  </p>
                </div>
                <Link
                  href="/contractor/jobs"
                  className="flex-shrink-0 bg-white text-rose-700 font-bold px-8 py-4 rounded-xl hover:bg-rose-50 transition-all transform hover:scale-105 shadow-2xl text-lg whitespace-nowrap"
                >
                  Browse Available Leads →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section - 2 Column Layout - Mobile-Optimized */}
        <section id="get-estimate" className="relative py-6 md:py-16 lg:py-24 overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Column - Headline & Benefits - Mobile-Optimized */}
              <div className="text-center lg:text-left space-y-4 md:space-y-6">
                <div className="inline-block mb-3 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 text-white rounded-full shadow-lg md:shadow-2xl animate-pulse-glow">
                  <span className="text-xs md:text-sm lg:text-base font-bold">🤖 AI-POWERED ESTIMATES • 100% FREE</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-8 leading-tight animate-fade-in-up">
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Is Your Quote
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Fair?
                  </span>
                </h1>

                <p className="text-lg md:text-2xl lg:text-3xl text-slate-700 mb-6 md:mb-10 leading-relaxed font-medium">
                  <span className="text-rose-700 font-bold">Upload photos</span> of your project. 
                  Get a detailed, contractor-style estimate in <span className="text-rose-700 font-bold">30 seconds</span>.
                  Compare before you commit, then post your project to the job board for contractor bids.
                </p>

                {/* Key Benefits - Compact for mobile */}
                <div className="space-y-3 md:space-y-6 mb-6 md:mb-10">
                  <div className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg md:shadow-xl">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base md:text-xl text-slate-900">Get Prices in 30 Seconds</div>
                      <div className="text-slate-600 text-sm md:text-base">Detailed breakdown, not guesswork</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-rose-700 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg md:shadow-xl">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base md:text-xl text-slate-900">Just Upload Photos</div>
                      <div className="text-slate-600 text-sm md:text-base">Or describe it—works both ways</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg md:shadow-xl">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base md:text-xl text-slate-900">Real Toronto Prices</div>
                      <div className="text-slate-600 text-sm md:text-base">What contractors actually charge here</div>
                    </div>
                  </div>
                </div>

                {/* Social Proof - Real faces + badges */}
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start items-center">
                  {/* Stacked real homeowner faces */}
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2.5 rounded-full shadow-lg border-2 border-rose-200">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&q=80" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover object-top border-2 border-white" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover object-top border-2 border-white" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&q=80" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover object-top border-2 border-white" alt="homeowner" />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-700">500+ homeowners</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-lg border-2 border-amber-200">
                    <span className="text-xs md:text-sm font-bold text-slate-700">⭐ 5.0/5 Rating</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-lg border-2 border-green-200">
                    <span className="text-xs md:text-sm font-bold text-slate-700">✓ GTA Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - iPhone Estimator Mockup */}
              <div className="lg:pl-8" data-estimator>
                <IPhoneEstimatorMockup 
                  onEstimateComplete={handleEstimateComplete}
                  userId={user?.id || undefined}
                  isBlocked={isEstimatorBlocked}
                  onBlocked={() => setShowSignUpGate(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Real Homes Photo Strip */}
        <section className="relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 h-48 md:h-64">
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop&crop=center&q=80" alt="Kitchen renovation Toronto" className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-bold">Kitchen · $28k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=800&fit=crop&crop=center&q=80" alt="Bathroom renovation" className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-bold">Bathroom · $9k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=800&fit=crop&crop=center&q=80" alt="Living room renovation" className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-bold">Basement · $15k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=800&fit=crop&crop=center&q=80" alt="Toronto home" className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-bold">Exterior · $22k saved</span>
            </div>
          </div>
          {/* Overlay callout */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-rose-100 text-center">
              <p className="text-rose-700 font-black text-base md:text-xl">Real Toronto Homes. Real Savings.</p>
              <p className="text-slate-600 text-xs md:text-sm mt-0.5">Homeowners saved an average of <strong>$16,400</strong> by comparing quotes first</p>
            </div>
          </div>
        </section>

        {/* Trust Strip - Added below hero */}
        <section className="py-8 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Badge 1 */}
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs md:text-sm">✔ AI Estimates</div>
                  <div className="text-xs text-gray-600 hidden md:block">Instant pricing</div>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs md:text-sm">✔ Verified Contractors</div>
                  <div className="text-xs text-gray-600 hidden md:block">Licensed pros</div>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs md:text-sm">✔ Real Reviews</div>
                  <div className="text-xs text-gray-600 hidden md:block">Verified feedback</div>
                </div>
              </div>

              {/* Badge 4 */}
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs md:text-sm">✔ Toronto Focused</div>
                  <div className="text-xs text-gray-600 hidden md:block">GTA marketplace</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Are You? Split Path Section */}
        {!estimateResult && (
          <>
          <section className="py-16 bg-gradient-to-br from-white to-orange-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  I'm here to...
                </h2>
                <p className="text-xl text-slate-600">
                  Choose your path to get started
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Homeowner Path */}
                <Link
                  href="/#get-estimate"
                  className="group bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 border-2 border-rose-200 hover:border-rose-400 hover:shadow-2xl transition-all"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Get a Project Quote</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Upload photos, get instant AI estimates, and connect with verified contractors in your area.
                  </p>
                  <div className="flex items-center gap-2 text-rose-700 font-bold group-hover:gap-4 transition-all">
                    <span>Get My Estimate</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>

                {/* Contractor Path */}
                <Link
                  href="/contractors/join"
                  className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border-2 border-sky-200 hover:border-sky-400 hover:shadow-2xl transition-all"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔧</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Find Quality Leads</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Get pre-qualified leads in Toronto &amp; GTA. No bidding wars. AI-screened homeowners with real budgets.
                  </p>
                  <div className="flex items-center gap-2 text-sky-700 font-bold group-hover:gap-4 transition-all">
                    <span>Join as Contractor</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Mid-Renovation Tools */}
              <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Second Opinion Card */}
                <Link
                  href="/second-opinion"
                  className="group bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-200 hover:border-rose-400 hover:shadow-2xl transition-all flex items-center gap-4"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform flex-shrink-0">⚖️</div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-1 rounded-full mb-1">
                      MID-RENOVATION
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">Is My Quote Fair?</h3>
                    <p className="text-slate-600 text-sm leading-snug">
                      Get a second opinion on your contractor's price — instantly.
                    </p>
                    <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-sm mt-2 group-hover:gap-2 transition-all">
                      Check Now →
                    </span>
                  </div>
                </Link>

                {/* AI Inspector Card */}
                <Link
                  href="/ai-renovation-check"
                  className="group bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all flex items-center gap-4"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform flex-shrink-0">🔍</div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full mb-1">
                      QUALITY CHECK
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">AI Renovation Inspector</h3>
                    <p className="text-slate-600 text-sm leading-snug">
                      Upload photos — AI checks if the work looks correct.
                    </p>
                    <span className="inline-flex items-center gap-1 text-purple-700 font-bold text-sm mt-2 group-hover:gap-2 transition-all">
                      Try Free →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Popular in the GTA — surfaces SEO pages */}
          <section className="py-14 bg-white border-t border-slate-100">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Popular in the GTA</h2>
                  <p className="text-slate-600 mt-1">Explore renovation costs and find contractors across every Toronto-area city.</p>
                </div>
                <Link href="/renovation-costs" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">View all cost guides →</Link>
              </div>

              {/* Cost guide chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {[
                  { href: "/renovation-cost/toronto/kitchen-renovation", emoji: "🍳", label: "Kitchen — Toronto", sub: "avg $35,000" },
                  { href: "/renovation-cost/toronto/bathroom-renovation", emoji: "🚿", label: "Bathroom — Toronto", sub: "avg $18,000" },
                  { href: "/renovation-cost/toronto/basement-finishing", emoji: "🏠", label: "Basement — Toronto", sub: "avg $45,000" },
                  { href: "/renovation-cost/mississauga/kitchen-renovation", emoji: "🍳", label: "Kitchen — Mississauga", sub: "avg $33,000" },
                  { href: "/renovation-cost/brampton/bathroom-renovation", emoji: "🚿", label: "Bathroom — Brampton", sub: "avg $17,000" },
                  { href: "/renovation-cost/scarborough/basement-finishing", emoji: "🏠", label: "Basement — Scarborough", sub: "avg $43,000" },
                  { href: "/renovation-cost/vaughan/deck-building", emoji: "🌳", label: "Deck — Vaughan", sub: "avg $19,000" },
                  { href: "/renovation-cost/markham/roof-replacement", emoji: "🏗️", label: "Roof — Markham", sub: "avg $12,000" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="bg-rose-50 border border-rose-100 rounded-xl p-3 hover:border-rose-300 hover:shadow-sm transition group">
                    <div className="text-lg mb-1">{item.emoji}</div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-rose-700 leading-tight">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
                  </Link>
                ))}
              </div>

              {/* Contractor city chips */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                <p className="font-bold text-slate-800 text-sm">Find contractors near you:</p>
                <Link href="/contractors/join" className="text-sky-700 font-bold text-sm hover:underline">Join as Contractor →</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { city: "toronto", label: "Toronto" },
                  { city: "mississauga", label: "Mississauga" },
                  { city: "brampton", label: "Brampton" },
                  { city: "vaughan", label: "Vaughan" },
                  { city: "scarborough", label: "Scarborough" },
                  { city: "markham", label: "Markham" },
                  { city: "richmond-hill", label: "Richmond Hill" },
                  { city: "oshawa", label: "Oshawa" },
                ].map((c) => (
                  <Link key={c.city} href={`/contractors/${c.city}`} className="bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-sky-100 hover:border-sky-400 transition">
                    🔧 {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Real Homeowner Hero Photo Section */}
          <section className="relative overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1400&h=900&fit=crop&crop=top&q=80"
              alt="Happy homeowners in their renovated Toronto starter home"
              className="w-full h-64 md:h-96 object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-6xl mx-auto px-6 w-full">
                <div className="max-w-xl">
                  <p className="text-rose-400 font-bold text-sm uppercase tracking-widest mb-3">Toronto GTA &mdash; First-Time Homeowners</p>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                    Stop overpaying.<br />
                    <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Know before you sign.</span>
                  </h2>
                  <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
                    First-time homeowners in the GTA saved an average of <strong className="text-white">$16,400</strong> by getting an AI estimate before hiring a contractor.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                      <div className="text-2xl font-black text-white">500+</div>
                      <div className="text-slate-400 text-xs">GTA Homeowners</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                      <div className="text-2xl font-black text-white">$16k</div>
                      <div className="text-slate-400 text-xs">Avg. Savings</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                      <div className="text-2xl font-black text-white">30 sec</div>
                      <div className="text-slate-400 text-xs">To get estimate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </>
        )}

        {/* Estimate Results */}
        {estimateResult && (
          <section id="estimate-results" className="py-8 sm:py-12 bg-white w-full overflow-hidden">
            <EstimateResults
              data={estimateResult}
              onGetContractorBids={handleGetContractorBids}
              onSaveEstimate={handleSaveEstimate}
            />
          </section>
        )}

        {/* Example Estimates - Show Trust */}
        <Suspense fallback={<div className="py-12" />}>
          <ExampleEstimates />
        </Suspense>

        {/* Trust Signals Section */}
        <TrustSignals />

        {/* Recent Activity Feed */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <RecentActivityFeed
              maxItems={10}
              showTitle={true}
              title="Real Renovation Estimates Happening Right Now"
              description="See live activity from homeowners and contractors across Toronto & GTA"
            />
          </div>
        </section>

        {/* Trust Indicators - Testimonials */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1,2,3,4,5].map(s => <svg key={s} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                <span className="text-slate-500 text-sm font-semibold ml-1">5.0 average</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Real homeowners. Real savings.
              </h2>
              <p className="text-xl text-slate-600">Trusted by 500+ Toronto &amp; GTA families</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Homeowner Testimonial 1 */}
              <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base text-slate-700 mb-6 leading-relaxed italic">
                  "Got a renovation quote in seconds. The AI estimate was spot-on and saved me so much time compared to waiting days for quotes."
                </p>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&q=80" alt="Sarah M." className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-rose-200" />
                  <div>
                    <div className="font-bold text-slate-900">Sarah M.</div>
                    <div className="text-sm text-slate-600">Homeowner, Toronto</div>
                  </div>
                </div>
              </div>

              {/* Couple Homeowner Testimonial */}
              <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border border-rose-100 relative overflow-hidden">
                {/* Subtle home photo background */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-10 rounded-bl-2xl">
                  <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop&q=60" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base text-slate-700 mb-6 leading-relaxed italic">
                  "We just bought our first home in Mississauga. QuoteXbert saved us from overpaying by $12,000 on our kitchen reno. The estimate matched what the winning contractor charged almost exactly."
                </p>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=96&h=96&fit=crop&crop=faces&q=80" alt="Jennifer K." className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-rose-300" />
                  <div>
                    <div className="font-bold text-slate-900">Jennifer &amp; Dave K.</div>
                    <div className="text-sm text-slate-600">First-time homeowners, Mississauga</div>
                  </div>
                </div>
              </div>

              {/* Contractor Testimonial */}
              <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base text-slate-700 mb-6 leading-relaxed italic">
                  "Better than bidding sites. I pick the jobs I want and homeowners already have realistic budgets. No more lowball offers wasting my time."
                </p>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces&q=80" alt="Mike R." className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-blue-200" />
                  <div>
                    <div className="font-bold text-slate-900">Mike R.</div>
                    <div className="text-sm text-slate-600">Contractor, GTA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* Trust FAQ - How Pricing Works, Contractor Verification */}
        <Suspense fallback={<div className="py-12" />}>
          <TrustFAQ />
        </Suspense>

        {/* Testimonials with Social Proof */}
        <Suspense fallback={<div className="py-12" />}>
          <TestimonialsSection />
        </Suspense>

        {/* Service Area Cities */}
        <Suspense fallback={<div className="py-12" />}>
          <ServiceAreaCities />
        </Suspense>

        {/* Free for Homeowners Banner */}
        <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="text-6xl">🎉</div>
                  <div>
                    <h3 className="text-3xl font-black text-green-800 mb-1">
                      100% FREE for Homeowners
                    </h3>
                    <p className="text-lg text-green-700">
                      No hidden fees • No commissions • Forever free
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 rounded-xl px-8 py-4 border-2 border-green-300">
                  <div className="text-5xl font-black text-green-800">$0</div>
                  <div className="text-sm font-semibold text-green-700 text-center">Always</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contractor Lead Generation Banner */}
        <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Value Prop */}
              <div className="text-center md:text-left">
                <div className="inline-block bg-rose-600/20 border border-rose-500/30 rounded-full px-4 py-2 mb-4">
                  <span className="text-rose-400 font-semibold text-sm">FOR CONTRACTORS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Get Quality Leads.<br />Grow Your Business.
                </h2>
                <p className="text-xl text-slate-300 mb-6">
                  Stop chasing leads. Access 45+ ready-to-quote projects in Toronto & GTA. 
                  All homeowners are verified and ready to hire.
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                    <div className="text-3xl font-black text-rose-500">45+</div>
                    <div className="text-slate-400 text-sm">Active Leads</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                    <div className="text-3xl font-black text-orange-500">12</div>
                    <div className="text-slate-400 text-sm">Categories</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                    <div className="text-3xl font-black text-amber-500">GTA</div>
                    <div className="text-slate-400 text-sm">Coverage</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href={isSignedIn && user?.role === 'contractor' ? "/contractor/jobs" : "/contractors/join"}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-2xl text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {isSignedIn && user?.role === 'contractor' ? "Browse Leads Now" : "Join as Contractor"}
                  </Link>
                  <Link
                    href="/showcase"
                    className="inline-flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-slate-600/50 transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>

              {/* Right: Key Benefits */}
              <div className="space-y-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Pre-Qualified Homeowners</h3>
                      <p className="text-slate-300 text-sm">All leads have budgets and are ready to hire</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Local Toronto & GTA Projects</h3>
                      <p className="text-slate-300 text-sm">All projects are in your service area</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">$350 - $120,000 Projects</h3>
                      <p className="text-slate-300 text-sm">Small repairs to full renovations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 text-rose-100">
              Use the instant AI estimate, then post on the job board to collect bids from verified contractors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  const estimatorElement = document.querySelector('[data-estimator]');
                  if (estimatorElement) {
                    estimatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-10 py-5 rounded-xl 
                         transition-all transform hover:scale-105 shadow-2xl text-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Instant AI Estimate
              </button>
              <Link
                href={isSignedIn ? '/create-lead' : '/sign-up'}
                className="inline-flex items-center gap-2 bg-rose-900/40 border border-white/40 text-white font-semibold px-6 py-4 rounded-xl hover:bg-rose-900/55 transition-colors"
              >
                Post on Job Board
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
