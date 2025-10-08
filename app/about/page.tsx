"use client";

import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About QuotexBert - AI Home Repair Platform Mission</title>
        <meta name="description" content="QuotexBert connects homeowners with verified contractors using AI-powered estimates. Our mission: transparent pricing, quality work, trusted connections." />
        <meta property="og:title" content="About QuotexBert - AI Home Repair Platform" />
        <meta property="og:description" content="Our mission: connecting homeowners with verified contractors using AI-powered estimates." />
        <meta property="og:image" content="/og-about.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              About <span className="bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent">QuotexBert</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Revolutionizing home repairs through AI-powered estimates and trusted contractor connections
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              To revolutionize home repairs by connecting homeowners with trusted contractors through AI-powered estimates and transparent pricing. We believe every homeowner deserves accurate pricing information and access to quality contractors who deliver exceptional work.
            </p>
          </div>

          {/* Brand Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Our Story</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 shadow-lg">
              <p className="text-slate-600 leading-relaxed mb-6">
                QuotexBert was founded by home improvement professionals who experienced firsthand the frustration of unclear pricing and unreliable contractor connections. We built an AI-powered platform that provides instant, accurate estimates while connecting homeowners with verified, reviewed contractors in their area.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our technology eliminates guesswork from home repair pricing, giving homeowners confidence in their investment decisions and helping contractors focus on what they do best: quality craftsmanship.
              </p>
            </div>
          </div>

          {/* Credibility Boosters */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Why Choose QuotexBert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">Secure Payments</h3>
                <p className="text-slate-600">Bank-level security through Stripe encryption. Your payment information is always protected.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">AI Accuracy</h3>
                <p className="text-slate-600">Machine learning trained on 100,000+ completed projects for precise estimates.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">Verified Reviews</h3>
                <p className="text-slate-600">All reviews from confirmed completed projects - no fake feedback.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">Background Checks</h3>
                <p className="text-slate-600">Every contractor undergoes comprehensive verification before joining.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">Transparent Pricing</h3>
                <p className="text-slate-600">No hidden fees for homeowners or contractors - everything is upfront.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-3">Quality Guarantee</h3>
                <p className="text-slate-600">All work backed by our quality standards and customer satisfaction guarantee.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-red-50 to-teal-50 border border-teal-200 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Ready to Get Started?</h2>
            <p className="text-slate-600 mb-6">
              Join thousands of homeowners and contractors who trust QuotexBert for their home improvement projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-red-800 to-teal-600 hover:from-red-900 hover:to-teal-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
              >
                Get My Estimate
              </Link>
              <Link
                href="/contractor/jobs"
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Join as Contractor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
