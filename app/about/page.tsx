"use client";

import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About QuoteXbert - AI Home Repair Platform Mission</title>
        <meta name="description" content="QuoteXbert connects homeowners with verified contractors using AI-powered estimates. Our mission: transparent pricing, quality work, trusted connections." />
        <meta property="og:title" content="About QuoteXbert - AI Home Repair Platform" />
        <meta property="og:description" content="Our mission: connecting homeowners with verified contractors using AI-powered estimates." />
        <meta property="og:image" content="/og-about.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              About <span className="bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent">QuoteXbert</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Revolutionizing home repairs through AI-powered estimates and trusted contractor connections
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              To <strong>stop homeowners from being taken advantage of</strong> by bringing transparency to home repair pricing. 
              We believe every homeowner deserves to know what a fair price looks like <em>before</em> contractors submit quotes.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              QuoteXbert uses AI to analyze your project and provide instant, accurate cost estimates based on real Toronto market data. 
              Then we connect you with verified, reliable contractors who deliver quality work at fair prices.
            </p>
          </div>

          {/* The Problem */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">The Problem We're Solving</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-xl p-8 shadow-lg">
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">💸</div>
                  <div>
                    <h3 className="text-xl font-bold text-rose-800 mb-2">Homeowners Are Overpaying</h3>
                    <p className="leading-relaxed">
                      Without knowing fair market rates, homeowners often accept inflated quotes. Some contractors exploit this information gap, 
                      charging 30-50% above reasonable prices simply because customers don't know better.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">❓</div>
                  <div>
                    <h3 className="text-xl font-bold text-rose-800 mb-2">Pricing Is Completely Unclear</h3>
                    <p className="leading-relaxed">
                      Traditional home repair: get 3 quotes that range from $2,000 to $8,000 for the same job. 
                      No one explains why. No transparency. Just guessing which contractor to trust.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">🚫</div>
                  <div>
                    <h3 className="text-xl font-bold text-rose-800 mb-2">Finding Reliable Contractors Is Hard</h3>
                    <p className="leading-relaxed">
                      Homeowners waste weeks calling contractors who don't respond, show up late, or disappear mid-project. 
                      Reviews are fake or outdated. There's no easy way to find verified, accountable professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Solution */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">How QuoteXbert Solves This</h2>
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-xl p-8 shadow-lg">
              <div className="space-y-6 text-slate-700">
                <div className="flex items-start gap-4">
                  <div className="text-4xl mt-1">🤖</div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 mb-2">AI-Powered Price Intelligence BEFORE You Get Quotes</h3>
                    <p className="leading-relaxed mb-3">
                      Our AI analyzes your project description and photos, then provides an instant cost estimate based on:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Real Toronto/GTA market rates (updated monthly)</li>
                      <li>Material costs and labor complexity</li>
                      <li>100,000+ completed projects in our database</li>
                      <li>Seasonal pricing trends and contractor availability</li>
                    </ul>
                    <p className="mt-3 leading-relaxed">
                      <strong>You walk into quotes armed with knowledge.</strong> No more being blindsided by inflated prices.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-4xl mt-1">🏆</div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 mb-2">Verified, Reliable Contractors Only</h3>
                    <p className="leading-relaxed">
                      Every contractor on QuoteXbert undergoes background checks, license verification, and insurance confirmation. 
                      We track response times, project completion rates, and real customer reviews. 
                      <strong> No fake reviews. No unreliable contractors. Just professionals who show up and deliver quality work.</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-4xl mt-1">⚡</div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 mb-2">Fast, Transparent Connections</h3>
                    <p className="leading-relaxed">
                      Post your project once. Multiple pre-qualified contractors see it instantly and submit competitive quotes. 
                      Compare proposals side-by-side. Read verified reviews. Choose confidently. 
                      <strong>The whole process takes hours instead of weeks.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Can Estimate ANYTHING */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">QuoteXbert Can Estimate ANY Home Job</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 shadow-lg">
              <p className="text-lg text-slate-700 mb-6 text-center">
                From <strong>snow removal</strong> to <strong>full home renovations</strong>, our AI handles it all:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-4">
                  <h4 className="font-bold text-rose-800 mb-2">🏠 Interior Projects</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Kitchen & bathroom renovations</li>
                    <li>• Basement finishing & waterproofing</li>
                    <li>• Flooring installation (hardwood, tile, carpet)</li>
                    <li>• Interior painting & drywall repair</li>
                    <li>• Electrical upgrades & lighting</li>
                    <li>• Plumbing repairs & installations</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-4">
                  <h4 className="font-bold text-rose-800 mb-2">🌳 Exterior Projects</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Roofing repairs & replacement</li>
                    <li>• Deck building & fence installation</li>
                    <li>• Landscaping & yard maintenance</li>
                    <li>• Exterior painting & siding</li>
                    <li>• Window & door replacement</li>
                    <li>• Snow removal & driveway sealing</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-4">
                  <h4 className="font-bold text-rose-800 mb-2">⚙️ Systems & Utilities</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• HVAC installation & repair</li>
                    <li>• Furnace & water heater replacement</li>
                    <li>• Energy efficiency upgrades</li>
                    <li>• Smart home installations</li>
                    <li>• Foundation repairs</li>
                    <li>• Home additions & extensions</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-4">
                  <h4 className="font-bold text-rose-800 mb-2">🔧 Specialty Services</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Garage conversions</li>
                    <li>• Accessibility modifications</li>
                    <li>• Pest control & remediation</li>
                    <li>• Fire safety upgrades</li>
                    <li>• Home office renovations</li>
                    <li>• Outdoor kitchens & patios</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-center text-slate-600 mt-6 italic">
                If it's a home improvement project in Toronto or the GTA, QuoteXbert can estimate it accurately.
              </p>
            </div>
          </div>

          {/* Brand Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Our Story</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 shadow-lg">
              <p className="text-slate-700 leading-relaxed mb-6">
                QuoteXbert was founded by home improvement professionals who experienced firsthand the frustration of unclear pricing and unreliable contractor connections. 
                We watched homeowners get quoted $15,000 for a $6,000 bathroom renovation. We saw skilled contractors struggle to find quality leads. 
                <strong> We knew there had to be a better way.</strong>
              </p>
              <p className="text-slate-700 leading-relaxed mb-6">
                We built an AI-powered platform that provides <em>instant, accurate estimates</em> while connecting homeowners with verified, reviewed contractors in their area. 
                Our technology eliminates the guesswork from home repair pricing, giving homeowners confidence in their investment decisions.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For contractors, QuoteXbert means <strong>more qualified leads, less time wasted, and fair pricing expectations from day one.</strong> 
                Everyone wins when pricing is transparent and connections are trustworthy.
              </p>
            </div>
          </div>

          {/* Credibility Boosters */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Why Choose QuoteXbert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">Secure Payments</h3>
                <p className="text-slate-600">Bank-level security through Stripe encryption. Your payment information is always protected.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">AI Accuracy</h3>
                <p className="text-slate-600">Machine learning trained on 100,000+ completed projects for precise estimates.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">Verified Reviews</h3>
                <p className="text-slate-600">All reviews from confirmed completed projects - no fake feedback.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">Background Checks</h3>
                <p className="text-slate-600">Every contractor undergoes comprehensive verification before joining.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">Transparent Pricing</h3>
                <p className="text-slate-600">No hidden fees for homeowners or contractors - everything is upfront.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent mb-3">Quality Guarantee</h3>
                <p className="text-slate-600">All work backed by our quality standards and customer satisfaction guarantee.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-orange-200 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Ready to Get Started?</h2>
            <p className="text-slate-600 mb-6">
              Join thousands of homeowners and contractors who trust QuoteXbert for their home improvement projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 hover:from-rose-950 hover:via-rose-800 hover:to-orange-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
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
