"use client";

import { useState } from "react";
import Link from "next/link";
import { IPhoneEstimatorMockup } from "@/components/IPhoneEstimatorMockup";
import { EstimateResults } from "@/components/EstimateResults";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ServiceAreaCities } from "@/components/ServiceAreaCities";
import { ReviewsSection, Review } from "@/components/ReviewsSection";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { TrustSignals } from "@/components/TrustSignals";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { StickyCTA } from "@/components/StickyCTA";
import { ReviewCaptureModal } from "@/components/ReviewCaptureModal";
import { useAuth } from "@/lib/hooks/useAuth";
import { trackEstimateComplete, trackCTAClick } from "@/components/GoogleAnalytics";

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { authUser: user, isSignedIn } = useAuth();

  // In production, fetch real reviews from API
  const realReviews: Review[] = []; // Empty for now - will show examples

  const handleGetContractorBids = () => {
    trackCTAClick('estimate_results', 'Get Contractor Bids');
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
      <ExitIntentModal onCaptureEmail={handleCaptureEmail} />

      {/* Sticky Mobile CTA */}
      <StickyCTA />

      {/* Review Capture Modal */}
      <ReviewCaptureModal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)}
        googleReviewUrl="YOUR_GOOGLE_REVIEW_URL_HERE"
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Hero Section - 2 Column Layout - BIGGER & MORE MODERN */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Headline & Benefits - BIGGER */}
              <div className="text-center lg:text-left space-y-6">
                <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 text-white rounded-full shadow-2xl animate-pulse-glow">
                  <span className="text-base font-bold">🤖 AI-POWERED ESTIMATES • 100% FREE</span>
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight animate-fade-in-up">
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Upload Photos.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Get Instant Quote.
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-slate-700 mb-10 leading-relaxed font-medium">
                  Stop overpaying for home repairs. Our AI analyzes your project and gives you a 
                  detailed contractor-style estimate in <span className="text-rose-700 font-bold">30 seconds</span>.
                </p>

                {/* Key Benefits - BIGGER & MORE MODERN */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4 text-left bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-900">Instant AI Estimates</div>
                      <div className="text-slate-600 text-base">Detailed line items, not vague ranges</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-900">Photo + Text Analysis</div>
                      <div className="text-slate-600 text-base">Upload photos or describe your project</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-900">Toronto & GTA Pricing</div>
                      <div className="text-slate-600 text-base">Accurate local labor and material costs</div>
                    </div>
                  </div>
                </div>

                {/* Social Proof - BIGGER */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border-2 border-rose-200">
                    <span className="text-base font-bold text-slate-700">⭐ 4.9/5 Rating</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border-2 border-orange-200">
                    <span className="text-base font-bold text-slate-700">🔒 100% Secure</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border-2 border-amber-200">
                    <span className="text-base font-bold text-slate-700">✓ GTA Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - iPhone Estimator Mockup */}
              <div className="lg:pl-8" data-estimator>
                <IPhoneEstimatorMockup 
                  onEstimateComplete={handleEstimateComplete}
                  userId={user?.id || undefined}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Estimate Results */}
        {estimateResult && (
          <section id="estimate-results" className="py-12 bg-white">
            <div className="max-w-5xl mx-auto px-4">
              <EstimateResults
                data={estimateResult}
                onGetContractorBids={handleGetContractorBids}
                onSaveEstimate={handleSaveEstimate}
              />
            </div>
          </section>
        )}

        {/* Trust Signals Section */}
        <TrustSignals />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Testimonials with Social Proof */}
        <TestimonialsSection />

        {/* Service Area Cities */}
        <ServiceAreaCities />

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

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 text-rose-100">
              Get your instant AI estimate now. No signup required.
            </p>
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
              Upload Photos & Get Quote
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
