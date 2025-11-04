"use client";

import { useState } from "react";
import Link from "next/link";
import { StreamlinedEstimateForm } from "@/components/ui/StreamlinedEstimateForm";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const { authUser: user, isSignedIn } = useAuth();

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Toronto, ON",
      text: "Got quotes from GTA contractors in under 5 minutes using voice input. Saved over $2,000 on my downtown Toronto kitchen renovation!",
      rating: 5,
    },
    {
      name: "Mike R.",
      location: "Mississauga, ON",
      text: "Amazing service! Found a reliable Mississauga roofer through the instant estimator. The voice feature made it so easy to describe my project!",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      location: "North York, ON",
      text: "The photo upload and voice description made getting estimates for my North York condo renovation super simple. Highly recommend!",
      rating: 5,
    },
  ];

  const handleEstimateComplete = (result: any) => {
    setEstimateResult(result);
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('estimate-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 -mx-4 md:-mx-6 lg:-mx-8">
      {/* Hero Section with Prominent Estimator */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-900 to-orange-700 bg-clip-text text-transparent mb-4">
              Get Instant Home Improvement Estimates
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Use voice or photos to describe your project and get accurate estimates instantly
            </p>
            
            {/* Quick Action for Homeowners */}
            {isSignedIn && user?.role === 'homeowner' && (
              <div className="mt-6">
                <div className="bg-gradient-to-r from-green-50/80 to-orange-50/80 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-green-800 font-medium mb-3">Welcome back, {user.name}!</p>
                  <div className="flex gap-3 justify-center">
                    <Link 
                      href="/homeowner/estimates" 
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      📊 View My Estimates
                    </Link>
                    <Link 
                      href="/create-lead" 
                      className="inline-block bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      🚀 Post Project
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action for Contractors */}
            {isSignedIn && user?.role === 'contractor' && (
              <div className="mt-6">
                <div className="bg-gradient-to-r from-blue-50/80 to-teal-50/80 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-blue-800 font-medium mb-3">Welcome back, {user.name}!</p>
                  <Link 
                    href="/contractors" 
                    className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    🔨 View Job Board
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Estimator Form - Center of Attention */}
          <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 relative z-10">
            <StreamlinedEstimateForm 
              onEstimateComplete={handleEstimateComplete} 
              userId={user?.id}
            />
          </div>

          {/* Estimate Results */}
          {estimateResult && (
            <div id="estimate-results" className="mt-8 bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 relative z-10">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent">
                    Your {estimateResult.aiPowered ? 'AI-Powered' : 'Smart'} Estimate
                  </h2>
                  {estimateResult.aiPowered && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      🤖 AI
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
                  {estimateResult.aiPowered 
                    ? 'Generated using advanced AI analysis of your project details'
                    : 'Based on your project description using industry-standard calculations'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Cost Estimate */}
                <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">💰 Estimated Cost</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-800 mb-2">
                      ${estimateResult.min?.toLocaleString()} - ${estimateResult.max?.toLocaleString()}
                    </div>
                    <p className="text-green-700">Project cost range</p>
                    <div className="mt-3 text-sm text-green-600">
                      Confidence: {estimateResult.confidence}%
                    </div>
                  </div>
                </div>

                {/* Analysis Factors */}
                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-red-900 mb-4">🔍 Analysis Factors</h3>
                  <ul className="space-y-2">
                    {estimateResult.factors?.map((factor: string, index: number) => (
                      <li key={index} className="flex items-center text-red-800">
                        <span className="text-red-900 mr-2">✓</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Description */}
              {estimateResult.description && (
                <div className="mt-6 p-4 bg-gradient-to-br from-slate-50/80 to-slate-100/80 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">📋 Estimate Details</h4>
                  <p className="text-slate-700">{estimateResult.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-200">
                <button 
                  onClick={() => setEstimateResult(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Get New Estimate
                </button>
                <button
                  onClick={() => {
                    // Store estimate data for the create-lead form
                    localStorage.setItem('estimate_data', JSON.stringify(estimateResult));
                    // Navigate to create-lead page
                    window.location.href = '/create-lead';
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-lg hover:from-red-900 hover:to-red-950 transition-colors flex-1"
                >
                  Post on Job Board
                </button>
              </div>
            </div>
          )}

          {/* Test Button - Remove this after testing */}
          {!estimateResult && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => handleEstimateComplete({
                  min: 800,
                  max: 1200,
                  description: "Test estimate for kitchen faucet replacement including labor and materials",
                  confidence: 85,
                  factors: ["Project description analyzed", "Market rate analysis", "Material cost estimation", "Labor complexity assessment"]
                })}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                🧪 Test Estimate Display
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works - Below the fold */}
      <section className="py-16 bg-gradient-to-br from-orange-100/40 to-red-100/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get estimates in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-800 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                1. Speak or Upload
              </h3>
              <p className="text-slate-600">
                Use voice input or upload photos to describe your project
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-800 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75V4.5a1.5 1.5 0 00-1.5-1.5h-9A1.5 1.5 0 003.75 4.5v11.25m11.5-11.25L18 2.25m-4.25 2.5V18a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-13.5A.75.75 0 019 3.75h3.25M15.75 4.5L18 2.25m0 0L20.25 4.5M18 2.25v13.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                2. AI Analysis
              </h3>
              <p className="text-slate-600">
                Our AI analyzes your project details and calculates accurate estimates
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-800 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                3. Get Instant Results
              </h3>
              <p className="text-slate-600">
                Receive detailed estimates with material and labor breakdowns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands who get instant, accurate estimates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50/60 to-red-50/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="text-sm">
                  <div className="font-bold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
