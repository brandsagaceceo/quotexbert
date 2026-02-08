"use client";

import { useState } from "react";
import Link from "next/link";
import { InstantQuoteCard } from "@/components/InstantQuoteCard";
import { EstimateResults } from "@/components/EstimateResults";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ServiceAreaCities } from "@/components/ServiceAreaCities";
import { ReviewsSection, Review } from "@/components/ReviewsSection";
import { useAuth } from "@/lib/hooks/useAuth";

export default function HomeNew() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const { authUser: user, isSignedIn } = useAuth();

  // In production, fetch real reviews from API
  const realReviews: Review[] = []; // Empty for now - will show examples

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "QuoteXbert",
    "image": "https://www.quotexbert.com/og-image.jpg",
    "@id": "https://www.quotexbert.com",
    "url": "https://www.quotexbert.com",
    "telephone": "+1-416-XXX-XXXX",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6532,
      "longitude": -79.3832
    },
    "areaServed": [
      { "@type": "City", "name": "Toronto" },
      { "@type": "City", "name": "Oshawa" },
      { "@type": "City", "name": "Whitby" },
      { "@type": "City", "name": "Ajax" },
      { "@type": "City", "name": "Pickering" },
      { "@type": "City", "name": "Bowmanville" },
      { "@type": "City", "name": "Clarington" }
    ]
  };

  const handleGetContractorBids = () => {
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

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Hero Section - 2 Column Layout */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Headline & Benefits */}
              <div className="text-center lg:text-left">
                <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-full shadow-lg">
                  <span className="text-sm font-bold">🤖 AI-POWERED ESTIMATES</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Upload Photos.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                    Get Instant Quote.
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
                  Stop overpaying for home repairs. Our AI analyzes your project and gives you a 
                  detailed contractor-style estimate in seconds.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-900">Instant AI Estimates</div>
                      <div className="text-slate-600">Detailed line items, not vague ranges</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-700 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-900">Photo + Text Analysis</div>
                      <div className="text-slate-600">Upload photos or describe your project</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-700 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-slate-900">Toronto & GTA Pricing</div>
                      <div className="text-slate-600">Accurate local labor and material costs</div>
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-slate-700">⭐ 5.0/5 Rating</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-slate-700">🔒 100% Secure</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-slate-700">✓ GTA Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Instant Quote Card */}
              <div className="lg:pl-8" data-estimator>
                <InstantQuoteCard 
                  onEstimateComplete={setEstimateResult}
                  userId={user?.id}
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

        {/* How It Works */}
        <HowItWorksSection />

        {/* Service Area Cities */}
        <ServiceAreaCities />

        {/* Reviews/Testimonials */}
        <ReviewsSection reviews={realReviews} showExamples={true} />

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
