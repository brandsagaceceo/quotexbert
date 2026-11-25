// LIVE PRODUCTION ROUTE — /
// Homepage with AI estimator (EstimatorMain). Edit THIS file for homepage changes.
"use client";

import { useState, lazy, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import contractorTeam from "@/public/homepage/contractor-team.webp";
import projectConsultation from "@/public/homepage/project-consultation.webp";
import finishedKitchen from "@/public/homepage/finished-kitchen.webp";
import finishedLivingRoom from "@/public/homepage/finished-living-room.webp";
import HomepageJourneyCarousel from "@/components/HomepageJourneyCarousel";
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
const ExampleEstimates = lazy(() => import("@/components/ExampleEstimates"));
const TrustFAQ = lazy(() => import("@/components/TrustFAQ"));

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [showSignUpGate, setShowSignUpGate] = useState(false);
  const [savingEstimate, setSavingEstimate] = useState(false);
  const { authUser: user, isSignedIn } = useAuth();
  const toast = useToast();

  const handleOpenPlanning = () => {
    const panel = document.getElementById("quotexbert-ai-panel");
    if (panel) {
      panel.focus();
      return;
    }
    const launcher = document.getElementById("quotexbert-ai-launcher");
    if (!launcher) {
      toast.error("The assistant is still loading. Please try again in a moment.");
      return;
    }
    launcher.click();
  };

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

  const handleEstimateComplete = async (result: any) => {
    setEstimateResult(result);
    trackEstimateComplete(result?.total);

    // Track Custom EstimateCompleted event for Meta Pixel (Requirement 2)
    try {
      const { trackEstimateCompleted } = await import("@/lib/metaPixel");
      const estimateAmount = result?.totals?.total_high || result?.total || 0;
      trackEstimateCompleted(estimateAmount, result?.id || `est_${Date.now()}`);
    } catch (trackErr) {
      console.error("Meta Pixel EstimateCompleted tracking failed on homepage:", trackErr);
    }

    // Mark free estimate as used for unauthenticated visitors
    if (!isSignedIn) {
      localStorage.setItem('estimateUsed', '1');
      setHasUsedFree(true);
    }
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

      {/* New contractor offer banner — shown to non-contractors */}
      {!(isSignedIn && user?.role === 'contractor') && <FoundingContractorBanner />}


      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 pb-safe md:pb-0">
        {/* Dual anchor: both #get-estimate and #instant-quote scroll here */}
        <span id="instant-quote" aria-hidden="true" className="absolute" style={{ top: 0 }} />
        <section id="get-estimate" className="relative overflow-hidden py-3 md:py-6 lg:py-8">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
          <div className="relative z-10 mx-auto max-w-[1600px] sm:px-6 lg:px-8">
            <div className="min-w-0">
              <h1 className="sr-only">Get a renovation estimate from a photo or project details</h1>
              <HomepageJourneyCarousel onOpenAssistant={handleOpenPlanning} />
            </div>
            <div className="relative mx-auto mt-8 w-full max-w-3xl px-4 sm:px-0">
              <p className="mb-5 text-center text-sm text-slate-600">
                Get an estimate, review it, and choose whether to share your project with local contractors.
              </p>
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
        </section>

        {/* Illustrative renovation photo gallery */}
        <section className="overflow-hidden">
          {/* 4-col photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 h-72 md:h-80">
            <div className="relative overflow-hidden group">
              <Image src={contractorTeam} alt="Two renovation professionals reviewing plans in a newly built home." fill sizes="(min-width: 768px) 25vw, 50vw" loading="lazy" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="relative overflow-hidden group">
              <Image src={projectConsultation} alt="A couple discussing a renovation in a home under construction." fill sizes="(min-width: 768px) 25vw, 50vw" loading="lazy" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="relative overflow-hidden group">
              <Image src={finishedKitchen} alt="A bright renovated kitchen with white cabinetry and a large island." fill sizes="(min-width: 768px) 25vw, 50vw" loading="lazy" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="relative overflow-hidden group">
              <Image src={finishedLivingRoom} alt="A completed contemporary living room with a staircase and warm wood details." fill sizes="(min-width: 768px) 25vw, 50vw" loading="lazy" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
          </div>
          {/* Callout bar — sits below the photos, never overlaps */}
          <div className="bg-[#800020] px-4 py-2.5 md:py-5 text-center">
            <p className="text-white font-bold text-xs md:text-lg tracking-tight">Renovation ideas for homes across the GTA.</p>
            <p className="text-rose-200 text-[11px] md:text-sm mt-0.5 md:mt-1">Example photos, not customer projects.</p>
          </div>
        </section>

        {/* Trust Bar - compact facts, directly beneath hero */}
        <section className="py-5 md:py-10 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-5 md:gap-6">
              {[
                { Icon: Gift, tint: "text-emerald-600 bg-emerald-50 ring-emerald-100", label: "Free homeowner estimates", sub: "No charge" },
                { Icon: Tag, tint: "text-rose-600 bg-rose-50 ring-rose-100", label: "Ontario renovation costs", sub: "Local price ranges" },
                { Icon: Sparkles, tint: "text-[#800020] bg-[#800020]/10 ring-[#800020]/20", label: "Quick cost estimates", sub: "Photos or project details" },
                { Icon: Map, tint: "text-slate-600 bg-slate-100 ring-slate-200", label: "Serving the GTA", sub: "Toronto to Durham" },
                { Icon: Lock, tint: "text-slate-600 bg-slate-100 ring-slate-200", label: "Secure accounts", sub: "Your data, protected" },
                { Icon: HeartHandshake, tint: "text-amber-600 bg-amber-50 ring-amber-100", label: "Your choice", sub: "No pressure to hire" },
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
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Where we work</h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto">
                Get renovation estimates and connect with contractors in Toronto, Durham Region, Clarington and the GTA.
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
              Don&apos;t see your city? <Link href="/#get-estimate" className="text-rose-600 font-semibold hover:underline">Start with an estimate</Link>.
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
                  <p className="font-black text-base md:text-lg">Find local renovation jobs</p>
                  <p className="text-sm text-rose-100">Browse homeowner projects in Toronto, Durham Region and the GTA.</p>
                </div>
                <Link
                  href="/contractor/jobs"
                  className="flex-shrink-0 bg-white text-[#800020] font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm whitespace-nowrap"
                >
                  Find local jobs &rarr;
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
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Renovation costs across the GTA</h2>
                  <p className="text-slate-600 mt-1">Compare common renovation costs by city and project type.</p>
                </div>
                <Link href="/renovation-costs" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">See all cost guides →</Link>
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
                <p className="font-bold text-slate-800 text-sm">Looking for a contractor?</p>
                <Link href="/contractors/join" className="text-sky-700 font-bold text-sm hover:underline">Join as a contractor →</Link>
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

          {/* Illustrative stock-photo feature section */}
          <section className="relative overflow-hidden bg-slate-900">
            {/* Background image — slightly taller on mobile so content doesn't overflow */}
            <Image
              src={finishedLivingRoom}
              alt="Illustrative licensed stock photograph of a completed contemporary living room."
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
            {/* Content — normal flow on mobile so it never gets clipped */}
            <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 md:py-16">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-5xl font-black text-white leading-tight mb-3 md:mb-4">
                  Know what your renovation could cost.
                </h2>
                <p className="text-slate-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
                  Get a starting estimate before you speak with contractors. Review it before sharing your project.
                </p>
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight">
                Plan your renovation with QuoteXbert
              </h2>
              <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
                Estimate costs, explore design ideas and connect with local contractors.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { href: "#get-estimate", Icon: Camera, label: "Get an estimate", desc: "Upload a photo or describe your project." },
                { href: "/renovation-calculator", Icon: Calculator, label: "Use a cost calculator", desc: "Plan costs for a kitchen, bathroom, basement or more." },
                { href: "/renovation-costs", Icon: BarChart3, label: "Compare local costs", desc: "See renovation costs by city and project type." },
                { href: "/visualizer", Icon: Palette, label: "Visualize your space", desc: "See how your room could look after a renovation." },
                { href: "/ai-renovation-check", Icon: Search, label: "Check renovation quality", desc: "Upload photos to look for possible issues." },
                { href: "/contractor/jobs", Icon: Briefcase, label: "Find local jobs", desc: "Contractors can browse homeowner projects in their area." },
                { href: "/contractor-leads", Icon: TrendingUp, label: "Learn about contractor leads", desc: "See how contractors can find local projects." },
                { href: "/guides", Icon: BookOpen, label: "Read renovation guides", desc: "Learn about permits, costs and planning." },
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
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Estimate your renovation costs</h2>
                <p className="text-slate-500 mt-1">Build a rough budget with a few project details.</p>
              </div>
              <Link href="/renovation-calculator" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">See all calculators →</Link>
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
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Renovation guides</h2>
                <p className="text-slate-500 mt-1">Clear advice on costs, permits and choosing a contractor.</p>
              </div>
              <Link href="/guides" className="text-rose-700 font-bold text-sm hover:underline whitespace-nowrap">See all guides →</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[
                { href: "/ontario-renovation-cost-guide", label: "Ontario renovation costs", desc: "Compare costs by project type and city." },
                { href: "/durham-region-renovation-guide", label: "Durham Region renovation guide", desc: "What to know before renovating in Durham Region." },
                { href: "/contractor-growth-guide", label: "Contractor growth guide", desc: "Ways contractors can find more local jobs." },
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
              title="Recent estimates"
              description="Recent renovation activity from homeowners in Toronto and the GTA."
            />
          </div>
        </section>

        {/* Trust & Transparency */}
        <section className="py-14 md:py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">What to know about your estimate</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">A few things to keep in mind as you plan your project.</p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-8">
              {[
                "Your estimate is a starting range, not a contractor's final quote",
                "The final price depends on your project, materials, labour, permits and site conditions",
                "Save your estimate and come back to it",
                "Your contractor provides the final quote",
                "Project prices are not guaranteed",
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
                  <h3 className="text-xl font-black text-green-800">Free for homeowners</h3>
                  <p className="text-sm text-green-700">Create renovation estimates at no charge.</p>
                </div>
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
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Find renovation jobs in your area
                </h2>
                <p className="text-base md:text-lg text-slate-300 mb-4 md:mb-6">
                  Create a profile, choose your trades and service area, then browse jobs from local homeowners.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href={isSignedIn && user?.role === 'contractor' ? "/contractor/jobs" : "/contractors/join"}
                    className="inline-flex items-center justify-center gap-2 bg-[#800020] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#600018] transition-all transform hover:scale-105 shadow-xl"
                  >
                    {isSignedIn && user?.role === 'contractor' ? "Find local jobs" : "Join as a contractor"}
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
                      <h3 className="text-base font-bold text-white mb-0.5">Jobs from homeowners</h3>
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
                      <h3 className="text-base font-bold text-white mb-0.5">Local projects</h3>
                      <p className="text-slate-300 text-sm">Find jobs in your service area</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* New Contractor Offer */}
        {!(isSignedIn && user?.role === 'contractor') && <FoundingContractorSection />}

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-[#800020] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" aria-hidden="true" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/15 flex items-center justify-center ring-1 ring-white/20">
              <Camera className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
              Plan your next renovation.
            </h2>
            <p className="text-lg mb-8 text-rose-100">
              Start with a free estimate from a photo or project details.
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
              Get an estimate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
