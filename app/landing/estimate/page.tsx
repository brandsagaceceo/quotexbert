"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EstimatorMain } from "@/components/EstimatorMain";
import { EstimateResults } from "@/components/EstimateResults";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  trackEstimateStarted,
  trackEstimateCompleted,
  trackCreateAccountClicked,
  trackContractorJoinClicked,
  trackContactSupportClicked,
} from "@/lib/tracking";
import { CheckCircle, Star, Phone, ArrowRight, Shield, Zap, DollarSign } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EstimateGateProps {
  onClose: () => void;
}

// ─── Sign-up Gate (lighter version for landing page) ─────────────────────────

function EstimateGate({ onClose }: EstimateGateProps) {
  const router = useRouter();

  const getRedirectUrl = () =>
    encodeURIComponent(window.location.pathname + window.location.search);

  const handleSignUp = () => {
    trackCreateAccountClicked("landing_gate");
    router.push(`/sign-up?redirect_url=${getRedirectUrl()}`);
  };

  const handleSignIn = () => {
    router.push(`/sign-in?redirect_url=${getRedirectUrl()}`);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-7 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >×</button>

        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">You've used your free estimate!</h2>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Create a free account to unlock unlimited AI estimates, save your results, and get bids from verified GTA contractors.
        </p>

        <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
          {[
            "♾️  Unlimited AI renovation estimates",
            "💾  Save & share your estimate",
            "📬  Post your job to 500+ verified contractors",
            "💬  Message contractors directly",
          ].map((b) => <li key={b}>{b}</li>)}
        </ul>

        <button
          type="button"
          onClick={handleSignUp}
          data-track="create_account_clicked"
          className="block w-full bg-brand text-white font-bold py-3.5 rounded-xl text-base transition hover:bg-brand-dark mb-3"
        >
          Create Free Account →
        </button>
        <button
          type="button"
          onClick={handleSignIn}
          className="block w-full text-gray-500 hover:text-brand text-sm font-medium transition"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingEstimatePage() {
  const { isSignedIn, authUser } = useAuth();
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [showGate, setShowGate] = useState(false);
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [startTracked, setStartTracked] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasUsedFree(localStorage.getItem("estimateUsed") === "1");
  }, []);

  // When user signs in, clear the guest gate so returning users aren't blocked
  useEffect(() => {
    if (isSignedIn) {
      localStorage.removeItem('estimateUsed');
      setHasUsedFree(false);
    }
  }, [isSignedIn]);

  const isBlocked = !isSignedIn && hasUsedFree;

  const handleEstimateComplete = (result: any) => {
    setEstimateResult(result);
    trackEstimateCompleted(result?.totals?.total_high, "landing_estimate");
    if (!isSignedIn) {
      localStorage.setItem("estimateUsed", "1");
      setHasUsedFree(true);
    }
  };

  const handleToolFocus = () => {
    if (!startTracked) {
      trackEstimateStarted("landing_estimate");
      setStartTracked(true);
    }
  };

  const handleGetBids = () => {
    if (estimateResult) {
      const data = {
        projectDescription: estimateResult.summary,
        min: estimateResult.totals?.total_low || 0,
        max: estimateResult.totals?.total_high || 0,
        lineItems: estimateResult.line_items || [],
      };
      localStorage.setItem("estimate_data", JSON.stringify(data));
    }
    window.location.href = isSignedIn ? "/create-lead" : "/sign-up";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Minimal top bar ─────────────────────────────────────────────── */}
      <div className="bg-brand text-white py-2.5 px-4 text-center text-xs font-semibold tracking-wide">
        🎯 GTA Homeowners — Get Your Free AI Renovation Estimate in 30 Seconds
      </div>

      {/* ── Hero section ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* LEFT — copy */}
            <div className="order-2 lg:order-1 lg:pt-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 bg-brand/10 text-brand rounded-full px-3 py-1 text-xs font-bold mb-4 uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5" /> AI-Powered · Free · No Sign-Up Required
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                Check If Your<br />
                <span className="text-brand">Contractor Quote</span><br />
                Is Fair
              </h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Upload a photo or describe your renovation and get an AI-powered price estimate
                in seconds — so you know what's reasonable <em>before</em> you sign anything.
              </p>

              {/* Trust bullets */}
              <ul className="space-y-2.5 mb-7">
                {[
                  "GTA-accurate 2026 pricing data",
                  "AI estimate in under 30 seconds",
                  "Compare multiple contractor quotes",
                  "No sign-up required for first estimate",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-brand flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Proof strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="ml-1 font-semibold text-gray-600">500+ GTA homeowners helped</span>
                </div>
                <span>·</span>
                <span className="font-semibold text-gray-600">100% Free to Use</span>
              </div>

              {/* Testimonial */}
              <blockquote className="mt-6 bg-brand/5 border-l-4 border-brand rounded-r-xl p-4 text-sm text-gray-700 italic">
                "I thought my kitchen quote was normal — QuoteXbert showed me I was being overcharged
                by $14,000. I posted the job and got a better contractor within 2 days."
                <footer className="mt-1.5 not-italic font-semibold text-gray-900 text-xs">
                  — Sarah M., North York homeowner
                </footer>
              </blockquote>
            </div>

            {/* RIGHT — tool (above fold anchor) */}
            <div
              className="order-1 lg:order-2"
              ref={toolRef}
              onFocus={handleToolFocus}
              onClickCapture={handleToolFocus}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-brand px-5 py-3 flex items-center justify-between">
                  <span className="text-white font-bold text-sm">✨ Get Instant Estimate</span>
                  <span className="text-white/70 text-xs">Powered by AI</span>
                </div>
                <div className="p-4">
                  <EstimatorMain
                    onEstimateComplete={handleEstimateComplete}
                    userId={authUser?.id}
                    isBlocked={isBlocked}
                    onBlocked={() => setShowGate(true)}
                  />
                </div>
              </div>

              {/* Immediate CTA below tool */}
              {!estimateResult && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  No account needed · Results in ~30 seconds · 100% free
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Estimate Results ──────────────────────────────────────────────── */}
      {estimateResult && (
        <section className="bg-white py-8 border-b">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-black text-gray-900 mb-5 text-center">Your AI Cost Estimate</h2>
            <EstimateResults
              data={estimateResult}
              onGetContractorBids={handleGetBids}
            />
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/create-lead"
                onClick={() => trackCreateAccountClicked("landing_results")}
                data-track="create_account_clicked"
                className="inline-flex items-center justify-center gap-2 bg-brand text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-dark transition-colors shadow-md"
              >
                Post Your Project — Get Real Bids <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section className="bg-brand/5 border-y border-brand/10 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-brand">
            {[
              "✓ 500+ GTA homeowners",
              "✓ Verified contractors only",
              "✓ Free to post your project",
              "✓ No obligation",
              "✓ AI-accurate pricing",
            ].map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Three steps to know if your price is fair</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "📸",
                title: "Upload a Photo",
                desc: "Take a photo of your project area or describe the renovation in a few words.",
              },
              {
                step: "2",
                icon: "🤖",
                title: "Get AI Estimate",
                desc: "Our AI analyses the scope and generates a detailed GTA-accurate cost breakdown.",
              },
              {
                step: "3",
                icon: "✅",
                title: "Compare & Hire",
                desc: "Know your number. Then post your project and receive real bids from verified contractors.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why homeowners trust QuoteXbert ─────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-black text-gray-900 text-center mb-7">
            Why GTA Homeowners Trust QuoteXbert
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Verified Contractors",
                desc: "Every contractor is verified for licence, insurance, and WSIB before joining.",
              },
              {
                icon: <DollarSign className="w-5 h-5" />,
                title: "Real Price Data",
                desc: "AI trained on 2026 GTA renovation costs — kitchens, bathrooms, basements and more.",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Instant Results",
                desc: "Detailed line-item breakdown in under 30 seconds. No waiting, no back-and-forth.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center text-white mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-brand py-12 text-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-black mb-3">
          Ready to Know If Your Quote Is Fair?
        </h2>
        <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
          Free AI estimate for GTA homeowners. No account needed. No obligation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toolRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 bg-white text-brand font-bold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            <Zap className="w-4 h-4" /> Get Instant Estimate
          </a>
          <a
            href="/contractors/join"
            onClick={() => trackContractorJoinClicked("landing_footer")}
            data-track="contractor_join_clicked"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
          >
            Are You a Contractor? Join for Free
          </a>
        </div>

        {/* Support link */}
        <p className="mt-6 text-white/60 text-xs">
          Questions?{" "}
          <a
            href="tel:9052429460"
            onClick={() => trackContactSupportClicked("phone")}
            data-track="contact_support_clicked"
            className="text-white/90 hover:text-white underline"
          >
            Call 905-242-9460
          </a>
          {" "}or{" "}
          <a
            href="/contact"
            onClick={() => trackContactSupportClicked("contact_page")}
            className="text-white/90 hover:text-white underline"
          >
            contact support
          </a>
        </p>
      </section>

      {/* ── Sign-up gate modal ───────────────────────────────────────────── */}
      {showGate && <EstimateGate onClose={() => setShowGate(false)} />}
    </div>
  );
}
