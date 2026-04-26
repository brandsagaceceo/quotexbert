// LIVE PRODUCTION ROUTE — /
// Homepage with AI estimator (EstimatorMain). Edit THIS file for homepage changes.
"use client";

import { useState, lazy, Suspense, useEffect } from "react";
import Link from "next/link";
import { EstimatorMain } from "@/components/EstimatorMain";
import { EstimateResults } from "@/components/EstimateResults";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ReviewsSection, Review } from "@/components/ReviewsSection";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { TrustSignals } from "@/components/TrustSignals";
import { StickyCTA } from "@/components/StickyCTA";
import { useAuth } from "@/lib/hooks/useAuth";
import { trackEstimateComplete, trackCTAClick } from "@/components/GoogleAnalytics";
import {
  trackEstimateStarted,
  trackSignUpModalShown,
  trackCreateAccountClicked,
  trackContractorJoinClicked,
} from "@/lib/tracking";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import { useToast } from "@/components/ToastProvider";

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
  const toast = useToast();

  // Read localStorage on mount to know if this visitor already used their free estimate
  useEffect(() => {
    setHasUsedFree(localStorage.getItem('qxb_guest_estimate_used') === 'true');
  }, []);

  // When user signs in, clear the guest gate so returning users aren't blocked
  useEffect(() => {
    if (isSignedIn) {
      localStorage.removeItem('qxb_guest_estimate_used');
      setHasUsedFree(false);
    }
  }, [isSignedIn]);

  // Block the estimator for unauthenticated visitors who have already used their 1 free estimate
  const isEstimatorBlocked = !isSignedIn && hasUsedFree;

  const handleShowSignUpGate = () => {
    setShowSignUpGate(true);
    trackSignUpModalShown('estimator_gate');
  };

  // In production, fetch real reviews from API
  const realReviews: Review[] = []; // Empty for now - will show examples

  const handleGetContractorBids = () => {
    trackCTAClick('estimate_results', 'Get Contractor Bids');
    trackCreateAccountClicked('estimate_results');
    
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
      toast.success('Coming soon — save & email estimates!');
    } else {
      toast.error('Please sign in to save your estimate');
      setTimeout(() => { window.location.href = '/sign-in'; }, 1200);
    }
  };

  const handleEstimateComplete = (result: any) => {
    setEstimateResult(result);
    trackEstimateComplete(result?.total);

    // Mark free estimate as used for unauthenticated visitors
    if (!isSignedIn) {
      localStorage.setItem('qxb_guest_estimate_used', 'true');
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto safe-area-top safe-area-bottom"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignUpGate(false); }}
        >
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-8 text-center my-6 sm:my-0">
            {/* Close */}
            <button
              onClick={() => setShowSignUpGate(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            {/* Icon */}
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              You've used your free estimate!
            </h2>
            <p className="text-slate-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
              Create a <strong>free account</strong> to unlock unlimited AI estimates, save your projects, and get bids from verified GTA contractors.
            </p>

            {/* Benefit list */}
            <ul className="text-left text-xs sm:text-sm text-slate-700 space-y-1.5 sm:space-y-2 mb-5 sm:mb-7">
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
              onClick={() => trackCreateAccountClicked('signup_gate_modal')}
              data-track="create_account_clicked"
              className="block w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base transition mb-2 sm:mb-3"
            >
              Create Free Account →
            </a>
            <a
              href="/sign-in"
              className="block w-full text-slate-600 hover:text-rose-600 text-xs sm:text-sm font-medium transition"
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
          googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || undefined}
        />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-safe md:pb-0">
        {/* Hero Section - 2 Column Layout - Mobile-Optimized */}
        {/* Dual anchor: both #get-estimate and #instant-quote scroll here */}
        <span id="instant-quote" aria-hidden="true" className="absolute" style={{ top: 0 }} />
        <section id="get-estimate" className="relative py-4 md:py-16 lg:py-24 overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
          <div className="hidden sm:block absolute top-20 left-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="hidden sm:block absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="hidden sm:block absolute bottom-20 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Column - Headline & Benefits - Mobile-Optimized */}
              <div className="text-center lg:text-left space-y-3 md:space-y-6">
                <div className="inline-block mb-3 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 text-white rounded-full shadow-lg md:shadow-2xl animate-pulse-glow">
                  <span className="text-xs md:text-sm lg:text-base font-bold">🤖 AI-POWERED ESTIMATES • 100% FREE</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-8 leading-tight animate-fade-in-up">
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Take a Photo.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Get Instant Price.
                  </span>
                </h1>

                <p className="text-lg md:text-2xl lg:text-3xl text-slate-700 mb-4 md:mb-10 leading-relaxed font-medium">
                  <span className="text-rose-700 font-bold">Upload photos</span> of your project —
                  get a real, contractor-style estimate in <span className="text-rose-700 font-bold">30 seconds</span>.
                  Free for homeowners. No signup needed.
                </p>

                {/* Mobile-only CTA — estimator sits below left column in single-column layout */}
                <a
                  href="#estimator-tool"
                  className="lg:hidden flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl active:scale-95 transition-all mb-6"
                >
                  📸 Upload Photos — Free AI Estimate ↓
                </a>

                {/* Mobile-only compact benefits (desktop shows full cards below) */}
                <div className="lg:hidden flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">⚡ 30-sec estimate</span>
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">📷 Just upload photos</span>
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">📍 Real Toronto prices</span>
                </div>

                {/* Key Benefits - Desktop only */}
                <div className="hidden lg:block space-y-3 md:space-y-6 mb-6 md:mb-10">
                  <Link href="#get-estimate" className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover cursor-pointer">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg md:shadow-xl">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base md:text-xl text-slate-900">Get Prices in 30 Seconds</div>
                      <div className="text-slate-600 text-sm md:text-base">Detailed breakdown, not guesswork</div>
                    </div>
                  </Link>

                  <Link href="#get-estimate" className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover cursor-pointer">
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
                  </Link>

                  <Link href="#get-estimate" className="flex items-center gap-3 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 card-hover cursor-pointer">
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
                  </Link>
                </div>

                {/* Social Proof - Real faces + badges */}
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start items-center">
                  {/* Stacked real homeowner faces */}
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2.5 rounded-full shadow-lg border-2 border-rose-200">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&q=80" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center border-2 border-white" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&q=80" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center border-2 border-white" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces&q=80" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center border-2 border-white" alt="homeowner" />
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

              {/* Right Column - iPhone Estimator */}
              <div className="lg:pl-8" id="estimator-tool" data-estimator>
                <EstimatorMain 
                  onEstimateComplete={handleEstimateComplete}
                  userId={user?.id || undefined}
                  isBlocked={isEstimatorBlocked}
                  onBlocked={handleShowSignUpGate}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Real Homes Photo Strip */}
        <section className="relative overflow-hidden">
          {/* Mobile: taller grid so faces aren't cropped; Desktop: 4-col strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 h-72 md:h-80">
            <div className="relative overflow-hidden group">
              {/* Kitchen — no person, center crop is fine */}
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop&crop=center&q=80" alt="Kitchen renovation Toronto" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">Kitchen · $28k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              {/* Bathroom — no person, center is fine */}
              <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=1000&fit=crop&crop=center&q=80" alt="Bathroom renovation" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">Bathroom · $9k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              {/* Basement — no person, center is fine */}
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=1000&fit=crop&crop=center&q=80" alt="Living room renovation" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">Basement · $15k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              {/* Exterior — person visible; object-top keeps the face in frame */}
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=1000&fit=crop&crop=top&q=80" alt="Toronto home exterior" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">Exterior · $22k saved</span>
            </div>
          </div>
          {/* Overlay callout — compact on mobile so it doesn't cover images */}
          <div className="absolute inset-0 flex items-end md:items-center justify-center pointer-events-none pb-3 md:pb-0">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl shadow-2xl border border-rose-100 text-center">
              <p className="text-rose-700 font-black text-sm md:text-xl">Real Toronto Homes. Real Savings.</p>
              <p className="text-slate-600 text-xs mt-0.5 hidden md:block">Homeowners saved an average of <strong>$16,400</strong> by comparing quotes first</p>
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

        {/* Contractor CTA Banner - shown only to signed-in contractors, below trust strip */}
        {user?.role === 'contractor' && (
          <section className="relative bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 text-white py-4 md:py-5 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="font-black text-base md:text-lg">🎯 Ready to Grow Your Business?</p>
                  <p className="text-sm text-rose-100">Browse active leads in Toronto &amp; GTA &bull; Get qualified projects today</p>
                </div>
                <Link
                  href="/contractor/jobs"
                  className="flex-shrink-0 bg-white text-rose-700 font-bold px-6 py-2.5 rounded-xl hover:bg-rose-50 transition-all shadow-xl text-sm whitespace-nowrap"
                >
                  Browse Available Leads &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Quick-start paths — desktop only, homeowner-first */}
        {!estimateResult && (
          <div className="hidden md:block">
          <section className="py-10 bg-gradient-to-br from-white to-orange-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  What would you like to do?
                </h2>
                <p className="text-base text-slate-600">
                  Pick a tool to get started — everything is free for homeowners
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                {/* Homeowner Path */}
                <Link
                  href="/#get-estimate"
                  className="group bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-200 hover:border-rose-400 hover:shadow-xl transition-all"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏠</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Get a Project Quote</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Upload photos, get instant AI estimates, and connect with verified GTA contractors.
                  </p>
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm group-hover:gap-4 transition-all">
                    <span>Get My Estimate</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>

                {/* AI Inspector */}
                <Link
                  href="/ai-renovation-check"
                  className="group bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl group-hover:scale-110 transition-transform">🔍</span>
                      <div className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                        QUALITY CHECK
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">AI Renovation Inspector</h3>
                    <p className="text-slate-600 text-sm leading-snug">
                      Upload photos — AI checks if the work looks correct and flags issues.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-purple-700 font-bold text-sm mt-4 group-hover:gap-2 transition-all">
                    Try Free →
                  </span>
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
            {/* Background image — slightly taller on mobile so content doesn't overflow */}
            <img
              src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1600&h=800&fit=crop&crop=top&q=80"
              alt="Happy homeowners in their renovated Toronto starter home"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
            {/* Content — normal flow on mobile so it never gets clipped */}
            <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 md:py-16">
              <div className="max-w-xl">
                <p className="text-rose-400 font-bold text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">Toronto GTA &mdash; First-Time Homeowners</p>
                <h2 className="text-2xl md:text-5xl font-black text-white leading-tight mb-3 md:mb-4">
                  Stop overpaying.<br />
                  <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Know before you sign.</span>
                </h2>
                <p className="text-slate-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
                  First-time homeowners in the GTA saved an average of <strong className="text-white">$16,400</strong> by getting an AI estimate before hiring a contractor.
                </p>
                {/* Stat cards — compact on mobile */}
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-3 text-center">
                    <div className="text-lg md:text-2xl font-black text-white">500+</div>
                    <div className="text-slate-400 text-xs">GTA Homeowners</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-3 text-center">
                    <div className="text-lg md:text-2xl font-black text-white">$16k</div>
                    <div className="text-slate-400 text-xs">Avg. Savings</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-3 text-center">
                    <div className="text-lg md:text-2xl font-black text-white">30 sec</div>
                    <div className="text-slate-400 text-xs">To get estimate</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
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
        <section className="py-6 md:py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <RecentActivityFeed
              maxItems={6}
              showTitle={true}
              title="Recent Renovation Estimates"
              description="Live activity from homeowners across Toronto & GTA"
            />
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
        <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <span className="text-4xl">🎉</span>
                <div>
                  <h3 className="text-xl font-black text-green-800">100% FREE for Homeowners</h3>
                  <p className="text-sm text-green-700">No hidden fees · No commissions · Forever free</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-xl px-6 py-3 border border-green-300 text-center">
                <div className="text-3xl font-black text-green-800">$0</div>
                <div className="text-xs font-semibold text-green-700">Always</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contractor Lead Generation Banner - Hidden from signed-in homeowners */}
        {!(isSignedIn && user?.role === 'homeowner') && (
        <section className="py-8 md:py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Get Quality Leads.<br />Grow Your Business.
                </h2>
                <p className="text-base md:text-lg text-slate-300 mb-4 md:mb-6">
                  Stop chasing leads. Access pre-qualified projects in Toronto &amp; GTA.
                  All homeowners are verified and ready to hire.
                </p>
                
                {/* Quick Stats */}
                <div className="flex gap-3 mb-6 justify-center md:justify-start">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700 text-center">
                    <div className="text-2xl font-black text-rose-500">GTA</div>
                    <div className="text-slate-400 text-xs">Coverage</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700 text-center">
                    <div className="text-2xl font-black text-orange-500">12</div>
                    <div className="text-slate-400 text-xs">Categories</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700 text-center">
                    <div className="text-2xl font-black text-amber-500">$0</div>
                    <div className="text-slate-400 text-xs">Commission</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href={isSignedIn && user?.role === 'contractor' ? "/contractor/jobs" : "/contractors/join"}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:from-rose-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl"
                  >
                    {isSignedIn && user?.role === 'contractor' ? "Browse Leads Now" : "Join as Contractor"}
                  </Link>
                </div>
              </div>

              {/* Right: Key Benefits - desktop only to save mobile space */}
              <div className="hidden md:space-y-4 md:block">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">Pre-Qualified Homeowners</h3>
                      <p className="text-slate-300 text-sm">All leads have budgets and are ready to hire</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">Zero Commission</h3>
                      <p className="text-slate-300 text-sm">Keep 100% of what you earn. Pay one flat monthly fee.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">Toronto &amp; GTA Projects</h3>
                      <p className="text-slate-300 text-sm">All projects are in your service area</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Final CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="text-4xl mb-4">📸</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Take a photo. Get your price.
            </h2>
            <p className="text-lg mb-6 text-rose-100">
              Free AI estimate in 30 seconds. No signup required.
            </p>
            <button
              onClick={() => {
                const estimatorElement = document.querySelector('[data-estimator]');
                if (estimatorElement) {
                  estimatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Free AI Estimate →
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
