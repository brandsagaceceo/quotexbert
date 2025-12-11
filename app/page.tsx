"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StreamlinedEstimateForm } from "@/components/ui/StreamlinedEstimateForm";
import { useAuth } from "@/lib/hooks/useAuth";

// Build: v5 - AI Quote Estimator + Custom Cursor + Real Images - Dec 8 2025

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalContractors: 0, avgRating: 4.8 });
  const { authUser: user, isSignedIn } = useAuth();

  useEffect(() => {
    // Fetch recent reviews
    fetch('/api/reviews?limit=6')
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(err => console.error('Error fetching reviews:', err));

    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Toronto, ON",
      text: "Got quotes from GTA contractors in under 5 minutes using voice input. Saved over $2,000 on my downtown Toronto kitchen renovation!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      name: "Mike R.",
      location: "Mississauga, ON",
      text: "Amazing service! Found a reliable Mississauga roofer through the instant estimator. The voice feature made it so easy to describe my project!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      name: "Jennifer L.",
      location: "North York, ON",
      text: "The photo upload and voice description made getting estimates for my North York condo renovation super simple. Highly recommend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
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
      "streetAddress": "",
      "addressLocality": "Toronto",
      "addressRegion": "ON",
      "postalCode": "",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6532,
      "longitude": -79.3832
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://twitter.com/quotexbert",
      "https://facebook.com/quotexbert"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1247"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "geoRadius": "100000"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QuoteXbert",
    "alternateName": "QuoteXbert Home Services",
    "url": "https://www.quotexbert.com",
    "logo": "https://www.quotexbert.com/logo.svg",
    "description": "Connect homeowners with verified contractors across the Greater Toronto Area. Get instant AI-powered home repair estimates.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-416-XXX-XXXX",
      "contactType": "customer service",
      "areaServed": "CA",
      "availableLanguage": "en"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Home Repair Estimate Service",
    "provider": {
      "@type": "Organization",
      "name": "QuoteXbert"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Greater Toronto Area"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Improvement Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kitchen Renovation Estimates"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bathroom Remodeling Estimates"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roofing Repair Estimates"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flooring Installation Estimates"
          }
        }
      ]
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 -mx-4 md:-mx-6 lg:-mx-8">
        {/* Hero Section - AI Estimator */}
        <section className="relative py-8 sm:py-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Hero Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-block mb-3 px-5 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-full shadow-lg">
              <span className="text-sm font-bold">🤖 AI-POWERED ESTIMATES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-3 leading-tight">
              Get Your Project Estimate
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Upload photos or describe your project. Get instant AI-powered cost estimates.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">{stats.totalContractors}+ Contractors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">{stats.avgRating} ⭐ Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">🔒 Secure</span>
            </div>
          </div>

          {/* Main Estimator Form - NO CARD, CLEAN LAYOUT */}
          <div className="max-w-4xl mx-auto mb-6">
            <StreamlinedEstimateForm 
              onEstimateComplete={(result) => {
                setEstimateResult(result);
                setTimeout(() => {
                  document.getElementById('estimate-results')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }, 100);
              }}
              userId={user?.id}
            />
          </div>

          {/* Quick Action for Homeowners */}
          {isSignedIn && user?.role === 'homeowner' && (
            <div className="mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto shadow-sm border border-orange-200">
                <p className="text-slate-700 font-medium text-center mb-3">Welcome back, {user.name}!</p>
                <div className="flex gap-3 justify-center">
                  <Link 
                    href="/homeowner/estimates" 
                    className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm"
                  >
                    📋 My Estimates
                  </Link>
                  <Link 
                    href="/create-lead" 
                    className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm"
                  >
                    ➕ Post Project
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* AI Visualizer Banner - NO WHITE BORDER */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-6 max-w-4xl mx-auto mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div className="text-center md:text-left">
                <div className="text-2xl font-black mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-3xl">✨</span>
                  <span>NEW: AI Home Visualizer</span>
                </div>
                <p className="text-base text-white text-opacity-90">
                  See your renovation BEFORE you start! Upload a room photo, AI transforms it.
                </p>
              </div>
              <Link 
                href="/visualizer"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-black text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2"
              >
                <span>Try It Free</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>

          {/* Featured Contractors Section */}
          <div className="mb-12 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
              Trusted by Toronto's Top Contractors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <Image
                  src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop"
                  alt="Professional contractor installing kitchen cabinets"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold">Kitchen Pro</p>
                    <p className="text-sm text-white/80">150+ Projects</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop"
                  alt="Contractor doing electrical work"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold">Electrical Expert</p>
                    <p className="text-sm text-white/80">200+ Projects</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <Image
                  src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=400&fit=crop"
                  alt="Contractor doing plumbing work"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold">Plumbing Specialist</p>
                    <p className="text-sm text-white/80">180+ Projects</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover-lift">
                <Image
                  src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop&q=80"
                  alt="Roofing contractor at work"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold">Roofing Master</p>
                    <p className="text-sm text-white/80">120+ Projects</p>
                  </div>
                </div>
              </div>
            </div>
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
                  <h3 className="text-xl font-semibold text-green-900 mb-4">?? Estimated Cost</h3>
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
                  <h3 className="text-xl font-semibold text-red-900 mb-4">?? Analysis Factors</h3>
                  <ul className="space-y-2">
                    {estimateResult.factors?.map((factor: string, index: number) => (
                      <li key={index} className="flex items-center text-red-800">
                        <span className="text-red-900 mr-2">?</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Description */}
              {estimateResult.description && (
                <div className="mt-6 p-4 bg-gradient-to-br from-slate-50/80 to-slate-100/80 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">?? Estimate Details</h4>
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

      {/* Contractor Pricing Tiers Section - Only show to contractors */}
      {user?.role === 'contractor' && (
      <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Simple Contractor Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the plan that fits your business. One flat monthly rate. No commissions. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Handyman Tier */}
            <div className="relative bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Handyman</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    $79
                  </span>
                  <span className="text-lg text-slate-600 font-semibold">/month</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 rounded-xl">
                  <p className="text-lg font-bold text-blue-900">4 Trade Categories</p>
                  <p className="text-sm text-blue-700 font-semibold">Unlimited leads/month</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Professional profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Email & phone support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Portfolio showcase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Customer reviews</span>
                </li>
              </ul>
              <Link
                href="/contractor/subscription"
                className="block w-full py-4 rounded-xl font-bold text-center bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Renovation Expert Tier - MOST POPULAR */}
            <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-rose-600 p-8 transition-all duration-300 hover:scale-105 hover:shadow-3xl transform md:-translate-y-4">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Renovation Expert</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    $139
                  </span>
                  <span className="text-lg text-slate-600 font-semibold">/month</span>
                </div>
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 rounded-xl border-2 border-rose-200">
                  <p className="text-lg font-bold text-rose-900">8 Trade Categories</p>
                  <p className="text-sm text-rose-700 font-semibold">Unlimited leads/month</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Enhanced profile badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Featured in search</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Portfolio showcase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Lead notifications</span>
                </li>
              </ul>
              <Link
                href="/contractor/subscription"
                className="block w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* General Contractor Tier */}
            <div className="relative bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">General Contractor</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    $199
                  </span>
                  <span className="text-lg text-slate-600 font-semibold">/month</span>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-100 px-4 py-3 rounded-xl">
                  <p className="text-lg font-bold text-purple-900">ALL 12 Categories</p>
                  <p className="text-sm text-purple-700 font-semibold">Unlimited leads/month</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Premium profile badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">24/7 priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Top of search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Portfolio showcase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="font-semibold">Custom branding</span>
                </li>
              </ul>
              <Link
                href="/contractor/subscription"
                className="block w-full py-4 rounded-xl font-bold text-center bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-600 text-lg mb-2">
              ✓ Money-back guarantee · Cancel anytime · No commission on projects
            </p>
            <Link
              href="/contractor/subscription"
              className="inline-flex items-center text-rose-600 hover:text-rose-700 font-semibold text-lg"
            >
              View detailed comparison →
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Stop Overpaying Section - Near Bottom */}
      <section className="py-12 bg-gradient-to-r from-rose-50 to-orange-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-rose-200 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center md:text-left flex-1">
                <div className="text-red-600 font-bold text-xl mb-2">❌ The Old Problem</div>
                <p className="text-gray-700 text-lg">Contractors charging whatever they want. You have no idea if the price is fair.</p>
              </div>
              <div className="hidden md:block text-4xl text-rose-600">→</div>
              <div className="text-center md:text-left flex-1">
                <div className="text-green-600 font-bold text-xl mb-2">✅ Our Solution</div>
                <p className="text-gray-700 text-lg font-semibold">AI tells you what the job SHOULD cost before quotes come in!</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-3xl font-black bg-gradient-to-r from-rose-900 to-orange-900 bg-clip-text text-transparent mb-2">
                Stop Overpaying for Home Jobs
              </h3>
              <p className="text-slate-600 text-lg">
                Quote anything from ❄️ snow removal to ⚡ electrical work and everything in between
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 100% FREE Section - Subtle, Bottom Placement */}
      <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-3xl">🎉</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-green-800 mb-1">
                    100% FREE for All Homeowners
                  </div>
                  <p className="text-base text-green-700">No hidden fees • No commissions • Forever</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-xl px-6 py-3 border-2 border-green-300">
                <div className="text-3xl font-black text-green-800">$0</div>
                <div className="text-xs font-semibold text-green-700">Just great contractors</div>
              </div>
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
    </>
  );
}
