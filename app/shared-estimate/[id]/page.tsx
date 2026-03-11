"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, MapPin, Calendar, TrendingUp } from "lucide-react";

interface SharedEstimate {
  id: string;
  summary: string;
  category: string;
  city: string;
  totals: {
    total_low: number;
    total_high: number;
  };
  createdAt: string;
}

export default function SharedEstimatePage() {
  const params = useParams();
  const [estimate, setEstimate] = useState<SharedEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from API: /api/shared-estimate/${params.id}
    // For now, show demo data
    setEstimate({
      id: params.id as string,
      summary: "Bathroom Renovation - Full Remodel",
      category: "Bathroom",
      city: "Toronto, ON",
      totals: {
        total_low: 8500,
        total_high: 15000,
      },
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading estimate...</div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Estimate Not Found</h1>
          <p className="text-slate-600 mb-6">This estimate may have expired or been removed.</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition"
          >
            Get Your Own Estimate
          </Link>
        </div>
      </div>
    );
  }

  const estimateRange = `$${Math.round(estimate.totals.total_low).toLocaleString()} - $${Math.round(estimate.totals.total_high).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">
            <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              QuoteXbert
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition"
          >
            Get Your Estimate
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Shared Estimate Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                AI Renovation Estimate
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">{estimate.summary}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {estimate.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(estimate.createdAt).toLocaleDateString('en-CA', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Estimate Range */}
          <div className="p-8 bg-gradient-to-br from-orange-50 to-rose-50">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Estimated Cost
              </p>
              <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-4">
                {estimateRange}
              </p>
              <p className="text-sm text-slate-600">
                Based on {estimate.category.toLowerCase()} renovations in the GTA
              </p>
            </div>
          </div>

          {/* QuoteXbert Branding */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Generated with QuoteXbert
                </p>
                <p className="text-xs text-slate-600">
                  AI-powered renovation estimates for Toronto & GTA
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Get Your Own AI Renovation Estimate
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Instant, accurate pricing for your renovation project
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-rose-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Try QuoteXbert Free →
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI-Powered Estimates</h3>
            <p className="text-sm text-slate-600">
              Get instant renovation pricing using advanced AI technology
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Verified Contractors</h3>
            <p className="text-sm text-slate-600">
              Connect with trusted, licensed contractors in your area
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-orange-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Local Toronto Focus</h3>
            <p className="text-sm text-slate-600">
              Pricing tailored to Toronto and GTA market rates
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            © 2026 QuoteXbert. AI-powered renovation estimates for the Greater Toronto Area.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <Link href="/about" className="hover:text-orange-400 transition">About</Link>
            <Link href="/contact" className="hover:text-orange-400 transition">Contact</Link>
            <Link href="/privacy" className="hover:text-orange-400 transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
