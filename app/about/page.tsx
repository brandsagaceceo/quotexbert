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

      <div className="min-h-screen bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-teal-400">QuotexBert</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Revolutionizing home repairs through AI-powered estimates and trusted contractor connections
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Our Mission</h2>
            <p className="text-lg text-neutral-300 leading-relaxed">
              To revolutionize home repairs by connecting homeowners with trusted contractors through AI-powered estimates and transparent pricing. We believe every homeowner deserves accurate pricing information and access to quality contractors who deliver exceptional work.
            </p>
          </div>

          {/* Brand Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8">
              <p className="text-neutral-300 leading-relaxed mb-6">
                QuotexBert was founded by home improvement professionals who experienced firsthand the frustration of unclear pricing and unreliable contractor connections. We built an AI-powered platform that provides instant, accurate estimates while connecting homeowners with verified, reviewed contractors in their area.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Our technology eliminates guesswork from home repair pricing, giving homeowners confidence in their investment decisions and helping contractors focus on what they do best: quality craftsmanship.
              </p>
            </div>
          </div>

          {/* Credibility Boosters */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose QuotexBert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">Secure Payments</h3>
                <p className="text-neutral-400">Bank-level security through Stripe encryption. Your payment information is always protected.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">AI Accuracy</h3>
                <p className="text-neutral-400">Machine learning trained on 100,000+ completed projects for precise estimates.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">Verified Reviews</h3>
                <p className="text-neutral-400">All reviews from confirmed completed projects - no fake feedback.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">Background Checks</h3>
                <p className="text-neutral-400">Every contractor undergoes comprehensive verification before joining.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">Transparent Pricing</h3>
                <p className="text-neutral-400">No hidden fees for homeowners or contractors - everything is upfront.</p>
              </div>
              
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold text-teal-400 mb-3">Quality Guarantee</h3>
                <p className="text-neutral-400">All work backed by our quality standards and customer satisfaction guarantee.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-300 mb-6">
              Join thousands of homeowners and contractors who trust QuotexBert for their home improvement projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get My Estimate
              </Link>
              <Link
                href="/contractor/jobs"
                className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg font-medium transition-colors"
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
