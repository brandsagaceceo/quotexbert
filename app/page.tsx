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
import FoundingContractorBanner from "@/components/FoundingContractorBanner";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import {
  Sparkles,
  Gift,
  MapPin,
  Bookmark,
  Users,
  Star,
  CheckCircle2,
  Tag,
  Map,
  Lock,
  HeartHandshake,
  Camera,
  Calculator,
  BarChart3,
  Palette,
  Search,
  Briefcase,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";

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
  const [savingEstimate, setSavingEstimate] = useState(false);
  const { authUser: user, isSignedIn } = useAuth();
  const toast = useToast();

  // Read localStorage on mount to know if this visitor already used their free estimate
  useEffect(() => {
    setHasUsedFree(localStorage.getItem('estimateUsed') === '1');
  }, []);

  // When user signs in, clear the guest gate so returning users aren't blocked
  useEffect(() => {
    if (isSignedIn) {
      localStorage.removeItem('estimateUsed');
      setHasUsedFree(false);
    }
  }, [isSignedIn]);

  // Attach-after-auth: if the homeowner clicked "Save Estimate" while signed out,
  // the estimate was preserved in localStorage before redirecting to sign-in. Once
  // they're back and signed in, finish the save automatically — no need to redo
  // the estimate or click Save again.
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    const pendingRaw = localStorage.getItem('pending_save_estimate');
    if (!pendingRaw) return;
    let pending: any = null;
    try { pending = JSON.parse(pendingRaw); } catch { pending = null; }
    localStorage.removeItem('pending_save_estimate');
    if (!pending) return;

    (async () => {
      try {
        const response = await fetch('/api/ai-estimates/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...pending, homeownerId: user.id }),
        });
        const data = await response.json();
        if (data.success) {
          toast.success('Your estimate was saved to Profile > AI Estimates.');
        } else {
          toast.error(data.error || 'Failed to save your estimate. Please try again from Profile.');
        }
      } catch {
        toast.error('Failed to save your estimate. Please try again from Profile.');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id]);

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

  // Maps the current /api/estimate result (EstimateResultData shape) onto the
  // existing AI-estimate persistence system's expected save payload — reuses
  // /api/ai-estimates/save (creates an AIEstimate row) which is exactly what
  // Profile > AI Estimates reads from. No new persistence system is created.
  const buildSaveEstimatePayload = () => ({
    description: estimateResult?.summary || 'Renovation project estimate',
    minCost: estimateResult?.totals?.total_low || 0,
    maxCost: estimateResult?.totals?.total_high || 0,
    confidence: Math.round((estimateResult?.confidence || 0) * 100),
    aiPowered: true,
    enhancedDescription: estimateResult?.summary || null,
    factors: estimateResult?.scope || [],
    reasoning: null,
    hasVoice: false,
    imageCount: 0,
    images: [],
  });

  const handleSaveEstimate = async () => {
    if (!estimateResult) {
      toast.error('Generate an estimate first, then save it.');
      return;
    }

    if (!isSignedIn) {
      // Preserve the estimate so it isn't lost — attach it automatically once
      // the homeowner finishes signing in/up (see the effect above).
      try {
        localStorage.setItem('pending_save_estimate', JSON.stringify(buildSaveEstimatePayload()));
      } catch {
        // localStorage unavailable/full — non-fatal, sign-in flow still works
      }
      toast.error('Please sign in to save your estimate — we\'ll save it automatically once you\'re signed in.');
      setTimeout(() => { window.location.href = '/sign-in?redirect_url=%2F'; }, 1200);
      return;
    }

    setSavingEstimate(true);
    try {
      const response = await fetch('/api/ai-estimates/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buildSaveEstimatePayload(), homeownerId: user?.id }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Estimate saved! Find it anytime in Profile > AI Estimates.');
        trackCTAClick('estimate_results', 'Save Estimate');
      } else {
        toast.error(data.error || 'Failed to save your estimate. Please try again.');
      }
    } catch {
      toast.error('Failed to save your estimate. Please check your connection and try again.');
    } finally {
      setSavingEstimate(false);
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
                "📬  Post jobs to GTA-area verified contractors",
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
              href={`/sign-in?redirect_url=${encodeURIComponent('/')}`}
              className="block w-full text-slate-600 hover:text-rose-600 text-xs sm:text-sm font-medium transition"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
      )}

      {/* Founding Contractor floating urgency banner — shown to non-contractors */}
      {!(isSignedIn && user?.role === 'contractor') && <FoundingContractorBanner />}

      {/* Review Capture Modal */}
      <Suspense fallback={null}>
        <ReviewCaptureModal 
          isOpen={showReviewModal} 
          onClose={() => setShowReviewModal(false)}
          {...(process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ? { googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL } : {})}
        />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-safe md:pb-0">
        {/* Hero Section - 2 Column Layout - Mobile-Optimized */}
        {/* Dual anchor: both #get-estimate and #instant-quote scroll here */}
        <span id="instant-quote" aria-hidden="true" className="absolute" style={{ top: 0 }} />
        <section id="get-estimate" className="relative py-3 md:py-16 lg:py-24 overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Column - Headline & Benefits - Mobile-Optimized */}
              <div className="text-center lg:text-left space-y-2 md:space-y-6">
                <div className="inline-flex items-center gap-2 mb-2 md:mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm border border-rose-200/80 text-rose-800 rounded-full shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-600" strokeWidth={2} />
                  <span className="text-xs md:text-sm font-semibold tracking-wide">AI-Powered Estimates · Free to Start</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 md:mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
                  <span className="text-[#800020]">
                    Get an AI Renovation
                  </span>
                  <br />
                  <span className="text-[#800020]">
                    Estimate Before You Hire
                  </span>
                </h1>

                <p className="text-sm md:text-xl lg:text-2xl text-slate-600 mb-4 md:mb-10 leading-relaxed">
                  <span className="text-rose-700 font-semibold">Describe your project or upload photos</span> to get a
                  detailed renovation cost range based on <span className="text-rose-700 font-semibold">Ontario pricing</span>.
                  Free for homeowners — quick free account required.
                </p>

                {/* Mobile-only CTA — estimator sits below left column in single-column layout */}
                <a
                  href="#estimator-tool"
                  className="lg:hidden flex items-center justify-center gap-1.5 w-full bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm py-2.5 px-5 rounded-xl shadow-md active:scale-[0.98] transition-colors mb-3"
                >
                  <Camera className="w-4 h-4" strokeWidth={2} />
                  Upload Photos — Free AI Estimate
                </a>

                {/* Mobile-only compact benefits (desktop shows full cards below) */}
                <div className="lg:hidden flex flex-wrap gap-1.5 mb-2">
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">⚡ 30-sec estimate</span>
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">📷 Just upload photos</span>
                  <span className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">📍 Toronto, Durham &amp; GTA prices</span>
                </div>

                {/* Trust Points - Desktop only */}
                <div className="hidden lg:block space-y-2.5 md:space-y-3 mb-6 md:mb-10">
                  <Link href="#get-estimate" className="flex items-center gap-4 text-left bg-white/70 backdrop-blur-sm p-3.5 md:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-white transition-all duration-200 hover:translate-x-0.5 cursor-pointer">
                    <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center ring-1 ring-emerald-100">
                      <Gift className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-slate-900">Free for Homeowners</div>
                      <div className="text-slate-500 text-xs md:text-sm">No cost to get your estimate</div>
                    </div>
                  </Link>

                  <Link href="#get-estimate" className="flex items-center gap-4 text-left bg-white/70 backdrop-blur-sm p-3.5 md:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-white transition-all duration-200 hover:translate-x-0.5 cursor-pointer">
                    <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-rose-50 rounded-xl flex items-center justify-center ring-1 ring-rose-100">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-rose-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-slate-900">Ontario-Focused Pricing</div>
                      <div className="text-slate-500 text-xs md:text-sm">Real Toronto, Durham &amp; GTA rates</div>
                    </div>
                  </Link>

                  <Link href="#get-estimate" className="flex items-center gap-4 text-left bg-white/70 backdrop-blur-sm p-3.5 md:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-white transition-all duration-200 hover:translate-x-0.5 cursor-pointer">
                    <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-orange-50 rounded-xl flex items-center justify-center ring-1 ring-orange-100">
                      <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-orange-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-slate-900">Save Estimates to Your Account</div>
                      <div className="text-slate-500 text-xs md:text-sm">Revisit anytime after signing up</div>
                    </div>
                  </Link>

                  <Link href="#get-estimate" className="flex items-center gap-4 text-left bg-white/70 backdrop-blur-sm p-3.5 md:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-white transition-all duration-200 hover:translate-x-0.5 cursor-pointer">
                    <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center ring-1 ring-blue-100">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-slate-900">Connect With Contractors When Ready</div>
                      <div className="text-slate-500 text-xs md:text-sm">No pressure — you&apos;re always in control</div>
                    </div>
                  </Link>
                </div>

                {/* Social Proof - Real faces + badges */}
                <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center lg:justify-start items-center">
                  {/* Stacked real homeowner faces */}
                  <div className="flex items-center gap-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-slate-200">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&q=80" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover object-center border-2 border-white shadow-sm" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&q=80" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover object-center border-2 border-white shadow-sm" alt="homeowner" />
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces&q=80" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover object-center border-2 border-white shadow-sm" alt="homeowner" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-slate-700">500+ homeowners</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-slate-200">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs md:text-sm font-semibold text-slate-700">Top Rated GTA</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs md:text-sm font-semibold text-slate-700">GTA Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - iPhone Estimator */}
              <div className="relative lg:pl-8">
                <div className="hidden lg:block absolute -inset-6 bg-gradient-to-br from-rose-200/40 via-orange-200/30 to-transparent rounded-[2rem] blur-2xl -z-10" aria-hidden="true" />
                <div id="estimator-tool" data-estimator>
                  <EstimatorMain 
                    onEstimateComplete={handleEstimateComplete}
                    userId={user?.id || undefined}
                    isBlocked={isEstimatorBlocked}
                    onBlocked={handleShowSignUpGate}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Homes Photo Strip */}
        <section className="overflow-hidden">
          {/* 4-col photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 h-72 md:h-80">
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop&crop=center&q=80" alt="Kitchen renovation Toronto" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">Kitchen · $28k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=1000&fit=crop&crop=center&q=80" alt="Bathroom renovation" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">Bathroom · $9k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=1000&fit=crop&crop=center&q=80" alt="Living room renovation" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">Basement · $15k saved</span>
            </div>
            <div className="relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=1000&fit=crop&crop=top&q=80" alt="Toronto home exterior" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">Exterior · $22k saved</span>
            </div>
          </div>
          {/* Callout bar — sits below the photos, never overlaps */}
          <div className="bg-[#800020] px-4 py-2.5 md:py-5 text-center">
            <p className="text-white font-bold text-xs md:text-lg tracking-tight">Real GTA &amp; Durham Region Homes. Real Savings.</p>
            <p className="text-rose-200 text-[11px] md:text-sm mt-0.5 md:mt-1">Homeowners across Toronto, Durham Region &amp; the GTA avoid overpaying by knowing real prices <strong className="text-white font-semibold">before</strong> calling a contractor</p>
          </div>
        </section>

        {/* Trust Bar - compact facts, directly beneath hero */}
        <section className="py-5 md:py-10 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-5 md:gap-6">
              {[
                { Icon: Gift, tint: "text-emerald-600 bg-emerald-50 ring-emerald-100", label: "Free for Homeowners", sub: "$0, always" },
                { Icon: Tag, tint: "text-rose-600 bg-rose-50 ring-rose-100", label: "Ontario Renovation Pricing", sub: "Real regional rates" },
                { Icon: Sparkles, tint: "text-[#800020] bg-[#800020]/10 ring-[#800020]/20", label: "AI-Powered Estimates", sub: "Instant & detailed" },
                { Icon: Map, tint: "text-slate-600 bg-slate-100 ring-slate-200", label: "Durham Region & GTA", sub: "Toronto to Durham" },
                { Icon: Lock, tint: "text-slate-600 bg-slate-100 ring-slate-200", label: "Secure Accounts", sub: "Your data, protected" },
                { Icon: HeartHandshake, tint: "text-amber-600 bg-amber-50 ring-amber-100", label: "No Obligation to Hire", sub: "Estimates are always free" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 justify-center group">
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 transition-transform duration-200 group-hover:scale-105 ${item.tint}`}>
                    <item.Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 text-xs md:text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500 hidden md:block">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas We Serve Section */}
        <section className="py-10 md:py-14 bg-gradient-to-br from-white to-slate-50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Areas We Serve</h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto">
                QuoteXbert helps homeowners and contractors across Toronto, Durham Region, Clarington, and the GTA get fair renovation pricing.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2 text-base">🏙️ Toronto</h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li><Link href="/toronto" className="hover:text-rose-600 transition-colors">Toronto</Link></li>
                  <li><Link href="/renovation-estimates-scarborough" className="hover:text-rose-600 transition-colors">Scarborough</Link></li>
                  <li><Link href="/renovation-estimates-north-york" className="hover:text-rose-600 transition-colors">North York</Link></li>
                  <li><Link href="/renovation-estimates-etobicoke" className="hover:text-rose-600 transition-colors">Etobicoke</Link></li>
                  <li><Link href="/renovation-estimates-east-york" className="hover:text-rose-600 transition-colors">East York</Link></li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2 text-base">📍 Durham Region</h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li><Link href="/durham-region" className="hover:text-rose-600 transition-colors font-medium text-rose-700">Durham Region Hub</Link></li>
                  <li><Link href="/renovation-estimates-oshawa" className="hover:text-rose-600 transition-colors">Oshawa</Link></li>
                  <li><Link href="/renovation-estimates-whitby" className="hover:text-rose-600 transition-colors">Whitby</Link></li>
                  <li><Link href="/renovation-estimates-ajax" className="hover:text-rose-600 transition-colors">Ajax</Link></li>
                  <li><Link href="/renovation-estimates-pickering" className="hover:text-rose-600 transition-colors">Pickering</Link></li>
                  <li><Link href="/clarington" className="hover:text-rose-600 transition-colors">Clarington · Bowmanville · Newcastle</Link></li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2 text-base">🌆 GTA</h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li><Link href="/renovation-estimates-mississauga" className="hover:text-rose-600 transition-colors">Mississauga</Link></li>
                  <li><Link href="/renovation-estimates-brampton" className="hover:text-rose-600 transition-colors">Brampton</Link></li>
                  <li><Link href="/renovation-estimates-vaughan" className="hover:text-rose-600 transition-colors">Vaughan</Link></li>
                  <li><Link href="/renovation-estimates-markham" className="hover:text-rose-600 transition-colors">Markham</Link></li>
                  <li><Link href="/renovation-estimates-richmond-hill" className="hover:text-rose-600 transition-colors">Richmond Hill</Link></li>
                </ul>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-6">
              Don&apos;t see your city? <Link href="/#get-estimate" className="text-rose-600 font-semibold hover:underline">Get an estimate anyway</Link> — our AI covers all Ontario postal codes.
            </p>
          </div>
        </section>

        {/* Contractor CTA Banner - shown only to signed-in contractors, below trust strip */}
        {user?.role === 'contractor' && (
          <section className="relative bg-[#800020] text-white py-4 md:py-5 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="font-black text-base md:text-lg">🎯 Ready to Grow Your Business?</p>
                  <p className="text-sm text-rose-100">Browse active leads in Toronto, Durham Region &amp; the GTA &bull; Get qualified projects today</p>
                </div>
                <Link
                  href="/contractor/jobs"
                  className="flex-shrink-0 bg-white text-[#800020] font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm whitespace-nowrap"
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
                  <span className="text-[#800020]">Know before you sign.</span>
                </h2>
                <p className="text-slate-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
                  First-time homeowners in the GTA avoid costly surprises by getting an AI estimate <strong className="text-white">before</strong> hiring a contractor.
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
              savingEstimate={savingEstimate}
            />
          </section>
        )}

        {/* How It Works */}
        <HowItWorksSection />

        {/* Explore QuoteXbert — feature grid linking to existing tools */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-1.5 mb-4 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full">
                <span className="text-xs font-semibold tracking-wide uppercase">Explore QuoteXbert</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight">
                Everything You Need to Renovate Smarter
              </h2>
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
                One platform for AI estimates, cost guides, calculators, and contractor opportunities across Ontario.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { href: "#get-estimate", Icon: Camera, label: "AI Renovation Estimate", desc: "Upload photos or describe your project for an instant cost range." },
                { href: "/renovation-calculator", Icon: Calculator, label: "Renovation Calculators", desc: "Quick calculators for kitchens, bathrooms, basements & more." },
                { href: "/renovation-costs", Icon: BarChart3, label: "Renovation Cost Guides", desc: "Detailed cost guides by city and project type." },
                { href: "/visualizer", Icon: Palette, label: "AI Photo Visualizer", desc: "See what your space could look like before you renovate." },
                { href: "/ai-renovation-check", Icon: Search, label: "AI Renovation Inspector", desc: "Upload photos and let AI flag potential quality issues." },
                { href: "/contractor/jobs", Icon: Briefcase, label: "Find Contractor Opportunities", desc: "Contractors: browse renovation opportunities near you." },
                { href: "/contractor-leads", Icon: TrendingUp, label: "Contractor Leads", desc: "See how QuoteXbert connects contractors with homeowners." },
                { href: "/guides", Icon: BookOpen, label: "Learning Center", desc: "Guides, permit info, and ROI data for every project type." },
              ].map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-11 h-11 mb-4 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                    <card.Icon className="w-5 h-5 text-rose-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5 leading-tight group-hover:text-rose-700 transition-colors">{card.label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sample AI Estimates - Show Trust */}
        <Suspense fallback={<div className="py-12" />}>
          <ExampleEstimates />
        </Suspense>

        {/* Renovation Calculator Preview */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Free Renovation Calculators</h2>
                <p className="text-slate-500 mt-1">Get a rough budget in seconds — no photos required.</p>
              </div>
              <Link href="/renovation-calculator" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">Explore All Renovation Calculators →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {[
                { href: "/kitchen-renovation-calculator", emoji: "🍳", label: "Kitchen" },
                { href: "/bathroom-renovation-calculator", emoji: "🚿", label: "Bathroom" },
                { href: "/basement-renovation-calculator", emoji: "🏠", label: "Basement" },
                { href: "/flooring-calculator", emoji: "⬛", label: "Flooring" },
                { href: "/painting-calculator", emoji: "🖌", label: "Painting" },
                { href: "/deck-calculator", emoji: "🌲", label: "Deck" },
                { href: "/roof-replacement-calculator", emoji: "🏠", label: "Roof" },
                { href: "/window-replacement-calculator", emoji: "🪩", label: "Windows" },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-50 group-hover:bg-rose-50 flex items-center justify-center text-xl transition-colors">{c.emoji}</div>
                  <div className="text-xs font-semibold text-slate-700 group-hover:text-rose-700 transition-colors">{c.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Center Preview */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Learning Center</h2>
                <p className="text-slate-500 mt-1">In-depth guides on costs, permits, ROI, and hiring contractors.</p>
              </div>
              <Link href="/guides" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">Explore the Learning Center →</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[
                { href: "/ontario-renovation-cost-guide", label: "Ontario Renovation Cost Guide", desc: "Real pricing for every project type across Ontario cities." },
                { href: "/durham-region-renovation-guide", label: "Durham Region Renovation Guide", desc: "Everything homeowners need to renovate in Durham Region." },
                { href: "/contractor-growth-guide", label: "Contractor Growth Guide", desc: "How contractors get more leads and grow their business." },
                { href: "/renovation-permit-guide-durham-region", label: "Permit Guide", desc: "When you need a permit — and how to get one — in Durham Region." },
                { href: "/best-roi-renovations-durham-region", label: "Best ROI Renovations", desc: "Which projects add the most value before you sell." },
                { href: "/how-ai-works", label: "How AI Estimates Work", desc: "How QuoteXbert's AI calculates your renovation cost range." },
              ].map((g) => (
                <Link key={g.href} href={g.href} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-rose-700 transition-colors">{g.label}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 flex-shrink-0 mt-0.5 transition-all group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

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

        {/* Trust & Transparency */}
        <section className="py-14 md:py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Trust &amp; Transparency</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">How QuoteXbert estimates work — and what they don&apos;t promise.</p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-8">
              {[
                "Estimates are starting ranges, not binding contractor quotes",
                "Final pricing depends on site conditions, materials, labour, permits, and scope",
                "Homeowners can save and revisit their estimates",
                "Contractors provide the final, professional quote",
                "QuoteXbert does not guarantee project prices",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-200 text-sm text-slate-600 leading-relaxed hover:border-slate-300 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/how-ai-works" className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">How AI Works</Link>
              <Link href="/why-quotexbert" className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Why QuoteXbert</Link>
              <Link href="/privacy" className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Privacy</Link>
              <Link href="/terms" className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Terms</Link>
            </div>
          </div>
        </section>

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
                  Get Local Renovation<br />Opportunities Across Ontario
                </h2>
                <p className="text-base md:text-lg text-slate-300 mb-4 md:mb-6">
                  Create your contractor profile, choose your trades and service areas, and discover
                  relevant homeowner opportunities across Durham Region, Toronto, Clarington, and the GTA.
                </p>
                
                {/* Quick Stats */}
                <div className="flex gap-3 mb-6 justify-center md:justify-start">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700 text-center">
                    <div className="text-2xl font-black text-rose-500">GTA</div>
                    <div className="text-slate-400 text-xs">Coverage</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700 text-center">
                    <div className="text-2xl font-black text-orange-500">11</div>
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
                    className="inline-flex items-center justify-center gap-2 bg-[#800020] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#600018] transition-all transform hover:scale-105 shadow-xl"
                  >
                    {isSignedIn && user?.role === 'contractor' ? "Browse Leads Now" : "Join as Contractor"}
                  </Link>
                </div>
              </div>

              {/* Right: Key Benefits - desktop only to save mobile space */}
              <div className="hidden md:space-y-4 md:block">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#800020] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">Real Project Leads</h3>
                      <p className="text-slate-300 text-sm">Homeowners post jobs with project details and budgets</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#800020] rounded-lg flex items-center justify-center">
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
                    <div className="flex-shrink-0 w-10 h-10 bg-[#800020] rounded-lg flex items-center justify-center">
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

        {/* Founding Contractor Program */}
        {!(isSignedIn && user?.role === 'contractor') && <FoundingContractorSection />}

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-[#800020] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" aria-hidden="true" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/15 flex items-center justify-center ring-1 ring-white/20">
              <Camera className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
              Take a photo. Get your price.
            </h2>
            <p className="text-lg mb-8 text-rose-100">
              Free AI estimate in 30 seconds. Free account required.
            </p>
            <button
              onClick={() => {
                const estimatorElement = document.querySelector('[data-estimator]');
                if (estimatorElement) {
                  estimatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-10 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-xl hover:shadow-2xl text-lg"
            >
              <Camera className="w-5 h-5" strokeWidth={2} />
              Get Free AI Estimate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
