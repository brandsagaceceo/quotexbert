"use client";

import { useState } from "react";
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function AffiliatesPage() {
  const { isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCallScript, setShowCallScript] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track Clarity event
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('event', 'affiliate_application', {
        email: formData.email
      });
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const benefits = [
    "Earn 50% commission on every successful referral",
    "Access to marketing materials and call scripts",
    "Real-time tracking of your referrals and earnings",
    "Monthly payouts with detailed reporting",
    "Dedicated affiliate support team",
    "No monthly fees or hidden costs"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-ink-100 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white border border-green-200 rounded-xl p-8 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-green-700 mb-6">
              Thank you for your interest in our affiliate program. We&apos;ll review your application and contact you within 1-2 business days with next steps.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-bold transition-colors duration-200"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            50% Commission Program
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-4">
            quotexbert Affiliate Program
          </h1>
          <p className="text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Partner with quotexbert and earn 50% commission by referring customers to our platform. 
            Help homeowners find trusted contractors while building your income.
          </p>
          
          {isSignedIn ? (
            <Link
              href="/affiliate"
              className="inline-flex items-center bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
            >
              Go to Affiliate Dashboard
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
              >
                Join Program
              </Link>
              <button
                onClick={() => setShowCallScript(!showCallScript)}
                className="border-2 border-brand text-brand hover:bg-brand hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
              >
                View Call Script
              </button>
            </div>
          )}
        </div>

        {/* Call Script Section */}
        {showCallScript && (
          <div className="mb-16 bg-gradient-to-r from-brand/5 to-brand/10 border border-brand/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Affiliate Call Script
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="prose max-w-none text-ink-700">
                <p className="mb-4"><strong>Hi [Name],</strong></p>
                <p className="mb-4">
                  I wanted to share something that could save you thousands on your next home improvement project. 
                  Have you been thinking about getting work done on your home lately - maybe roofing, renovation, or any other projects?
                </p>
                <p className="mb-4">
                  I found this amazing tool called quotexbert that gets you instant estimates from verified contractors 
                  in your area. The best part? It&apos;s completely free and takes less than 2 minutes.
                </p>
                <p className="mb-4">
                  <strong>Here&apos;s the link:</strong><br />
                  <code className="bg-brand/10 px-2 py-1 rounded text-sm">quotexbert.com</code>
                </p>
                <p className="mb-4">
                  They&apos;ll ask a few quick questions about your project and instantly show you what it should cost 
                  in your area. No pushy salespeople, no obligation - just honest pricing so you know if you&apos;re getting a fair deal.
                </p>
                <p className="mb-0">
                  <strong>Worth checking out if you&apos;re planning any home improvements!</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Card */}
          <div className="bg-white border border-ink-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">Program Benefits</h2>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 bg-brand rounded-full">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-ink-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-200 pt-6">
              <h3 className="text-lg font-bold text-ink-900 mb-4">Earning Potential</h3>
              <div className="bg-gradient-to-br from-brand-light to-brand rounded-xl p-6 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50%</div>
                  <div className="text-sm opacity-90">Commission on every successful referral</div>
                  <div className="text-xs opacity-75 mt-1">Average payout: $150-$500 per lead</div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form Card */}
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-ink-900 mb-2">Join Our Program</h2>
            <p className="text-ink-600 mb-6">Ready to start earning? Fill out the application below.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-ink-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-ink-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-ink-900 mb-2">
                  Website or Social Media Profile
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                  placeholder="https://your-website.com"
                />
                <p className="text-xs text-ink-500 mt-1">
                  Help us understand your audience and promotional channels
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-[var(--radius-button)] text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Apply to Affiliate Program"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-ink-50 rounded-[var(--radius-card)] p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-ink-900 mb-4">Questions About Our Program?</h3>
            <p className="text-ink-600 mb-6 max-w-2xl mx-auto">
              We&apos;re here to help you succeed. Reach out to our affiliate team for guidance on maximizing your earnings and getting the most out of our partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white hover:bg-ink-50 text-ink-900 border border-ink-300 px-6 py-3 rounded-[var(--radius-button)] font-semibold transition-colors duration-200">
                Contact Support
              </button>
              <button className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-6 py-3 rounded-[var(--radius-button)] font-semibold transition-colors duration-200">
                View Program Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
