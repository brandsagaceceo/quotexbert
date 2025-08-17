"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

interface EstimateResult {
  min: number;
  max: number;
  description: string;
}

export default function HomePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleEstimate = async () => {
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: jobDescription }),
      });

      const data = await response.json();
      setEstimate(data);
    } catch (error) {
      console.error("Error getting estimate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinBeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsJoining(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Thanks for joining our beta waitlist!");
        setEmail("");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <Head>
        <title>QuotexBert - AI-Powered Home Repair Estimates & Contractor Matching</title>
        <meta name="description" content="Get instant AI home repair estimates. Connect with verified contractors. Pay-per-lead system. Join 1000+ contractors earning more with QuotexBert." />
        <meta property="og:title" content="QuotexBert - AI Home Repair Estimates" />
        <meta property="og:description" content="Get instant AI home repair estimates and connect with verified contractors in your area." />
        <meta property="og:image" content="/og-homepage.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 text-[#800020]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect
                    x="30"
                    y="30"
                    width="40"
                    height="40"
                    fill="currentColor"
                    rx="4"
                  />
                  <circle cx="40" cy="40" r="3" fill="#ff6b35" />
                  <circle cx="60" cy="40" r="3" fill="#ff6b35" />
                  <rect
                    x="45"
                    y="50"
                    width="10"
                    height="4"
                    fill="#ff6b35"
                    rx="2"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">quotexbert</span>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/contractor/jobs"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                For Contractors
              </Link>
              <Link
                href="/sign-in"
                className="bg-[#800020] hover:bg-[#600018] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Get Instant AI Home Repair Estimates.</span>
            <br />
            <span className="text-teal-400">Connect with Verified Contractors.</span>
          </h1>

          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            QuotexBert uses advanced AI to provide accurate home repair estimates in seconds. Connect with verified, reviewed contractors in your area who are ready to complete your project with transparent pricing and quality guarantees.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="#estimate"
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Get My Estimate
            </Link>
            <Link
              href="/contractor/jobs"
              className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Join as Contractor
            </Link>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2 text-teal-400">Instant AI Estimates</h3>
              <p className="text-sm text-neutral-400">Get accurate pricing in seconds</p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold mb-2 text-teal-400">Verified Contractors</h3>
              <p className="text-sm text-neutral-400">All professionals are background-checked</p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2 text-teal-400">Transparent Pricing</h3>
              <p className="text-sm text-neutral-400">No hidden fees or surprise costs</p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold mb-2 text-teal-400">Quality Guaranteed</h3>
              <p className="text-sm text-neutral-400">Real reviews from verified homeowners</p>
            </div>
          </div>

          {/* AI Estimate Input */}
          <div id="estimate" className="max-w-2xl mx-auto mb-8">
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe your job... (e.g., 'Replace kitchen faucet' or 'Paint 2 bedroom walls')"
                className="w-full bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-white placeholder-neutral-500 min-h-[100px] resize-none focus:outline-none focus:border-teal-500"
              />

              <button
                onClick={handleEstimate}
                disabled={isLoading || !jobDescription.trim()}
                className="w-full mt-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isLoading ? "Getting estimate..." : "Get Instant Estimate"}
              </button>
            </div>

            {/* Estimate Result */}
            {estimate && (
              <div className="mt-6 bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">
                  Estimated Cost: ${estimate.min.toLocaleString()} - $
                  {estimate.max.toLocaleString()} CAD
                </h3>
                <p className="text-neutral-300 mb-4">{estimate.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/jobs"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-center px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Post This Job
                  </Link>
                  <Link
                    href="/contractor/jobs"
                    className="flex-1 border border-teal-500 hover:bg-teal-500/10 text-center px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Browse Contractors
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose quotexbert?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant AI Estimates</h3>
              <p className="text-neutral-400">
                Get accurate price ranges in seconds using our advanced AI
                technology.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Contractors</h3>
              <p className="text-neutral-400">
                Connect with licensed, insured, and highly-rated contractors in
                your area.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Trusted</h3>
              <p className="text-neutral-400">
                Your information is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Describe Your Job</h3>
              <p className="text-neutral-400">
                Tell us what you need fixed or built in plain English.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Get Instant Estimate</h3>
              <p className="text-neutral-400">
                Our AI provides accurate pricing in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Pros</h3>
              <p className="text-neutral-400">
                Get matched with qualified contractors who can do the job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor CTA */}
      <section className="py-20 bg-[#800020]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Contractor?</h2>
          <p className="text-xl text-red-100 mb-8">
            Get qualified leads delivered directly to you. Join thousands of
            contractors growing their business with quotexbert.
          </p>
          <Link
            href="/contractor/jobs"
            className="inline-block bg-white text-[#800020] px-8 py-4 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-colors"
          >
            Get Qualified Leads
          </Link>
        </div>
      </section>

      {/* Beta Waitlist */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Beta</h2>
          <p className="text-xl text-neutral-400 mb-8">
            Be among the first to experience the future of home repairs.
          </p>

          <form
            onSubmit={handleJoinBeta}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
              required
            />
            <button
              type="submit"
              disabled={isJoining}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isJoining ? "Joining..." : "Join Beta"}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">
                How accurate are the AI estimates?
              </h3>
              <p className="text-neutral-400">
                Our AI estimates are based on thousands of real project data
                points and are typically within 15-20% of actual costs. Final
                pricing will always depend on specific project details and
                contractor quotes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Is quotexbert free to use?
              </h3>
              <p className="text-neutral-400">
                Yes! Getting estimates and browsing contractors is completely
                free for homeowners. We only charge contractors a small fee when
                they successfully connect with clients.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                How do you verify contractors?
              </h3>
              <p className="text-neutral-400">
                All contractors on our platform are verified for licensing,
                insurance, and background checks. We also collect reviews and
                ratings from previous customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 text-[#800020]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect
                      x="30"
                      y="30"
                      width="40"
                      height="40"
                      fill="currentColor"
                      rx="4"
                    />
                    <circle cx="40" cy="40" r="3" fill="#ff6b35" />
                    <circle cx="60" cy="40" r="3" fill="#ff6b35" />
                    <rect
                      x="45"
                      y="50"
                      width="10"
                      height="4"
                      fill="#ff6b35"
                      rx="2"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">quotexbert</span>
              </div>
              <p className="text-neutral-400 text-sm">
                AI-powered home repair estimates and contractor matching.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Homeowners</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Get Estimates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Find Contractors
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Contractors</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="/contractor/jobs" className="hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Get Leads
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Grow Business
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2025 quotexbert. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
