"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
// import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import ProBadge from "@/app/_components/pro-badge";

export default function ContractorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-50 flex items-center justify-center">Loading...</div>}>
      <ContractorsPageContent />
    </Suspense>
  )
}

function ContractorsPageContent() {
  // const { isSignedIn } = useAuth();
  const isSignedIn = false; // Mock for demo
  const searchParams = useSearchParams();
  const showUpgrade = searchParams.get('upgrade') === 'true';
  
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    tradeType: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tradeTypes = [
    "General Contractor",
    "Kitchen & Bath",
    "Flooring Specialist",
    "Painter",
    "Roofer",
    "Plumber",
    "Electrician",
    "HVAC Technician",
    "Landscaper",
    "Handyman",
    "Other",
  ];

  const benefits = [
    "Lead alerts delivered instantly to your phone",
    "Professional contractor dashboard with analytics",
    "Customer review management system",
    "Dedicated customer support team",
    "Marketing materials and resources",
  ];

  const proBenefits = [
    "Priority placement in search results",
    "Verified contractor badge with quotexbert Pro logo",
    "Advanced lead analytics and reporting",
    "Premium customer support with dedicated rep",
    "Custom marketing materials with your branding",
    "Early access to new features and tools"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track Clarity event
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('event', 'contractor_signup', {
        tradeType: formData.tradeType
      });
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpgradeToPro = async () => {
    // Track Clarity event
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('event', 'pro_upgrade_click');
    }

    // TODO: Implement Stripe Checkout
    alert('Stripe integration coming soon! This will redirect to Stripe Checkout.');
  };

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
              Thank you for your interest in joining quotexbert. We&apos;ll review your application and get back to you within 2-3 business days.
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
          <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-4">
            Join quotexbert Contractors
          </h1>
          <p className="text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Connect with homeowners in your area and grow your business with qualified leads delivered directly to you.
          </p>
          
          {isSignedIn && (
            <Link
              href="/contractor/portal"
              className="inline-flex items-center bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
            >
              Go to Contractor Portal
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Pro Upgrade Section */}
        {showUpgrade && (
          <div className="mb-16 bg-gradient-to-r from-brand/5 to-brand/10 border border-brand/20 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <ProBadge size="lg" />
                <h2 className="text-3xl font-bold text-ink-900 ml-4">Upgrade to Pro</h2>
              </div>
              <p className="text-xl text-ink-600 max-w-2xl mx-auto">
                Get priority placement, verified badge, and advanced features to grow your business faster.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-ink-900 mb-4">Standard (Free)</h3>
                <ul className="space-y-2 text-ink-600 mb-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-bold text-ink-900">Free</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-brand">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-ink-900">Pro</h3>
                  <ProBadge size="md" />
                </div>
                <ul className="space-y-2 text-ink-600 mb-6">
                  {proBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-brand mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-bold text-brand mb-4">$99/month</div>
                <button
                  onClick={handleUpgradeToPro}
                  className="w-full bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-bold transition-colors duration-200"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Card */}
          <div className="bg-white border border-ink-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-ink-900 mb-6">What you get:</h3>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 bg-brand rounded-full">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-ink-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-200 pt-6">
              <h4 className="text-lg font-bold text-ink-900 mb-4">Additional Benefits:</h4>
              <ul className="space-y-2 text-sm text-ink-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-brand mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No upfront costs or monthly fees
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-brand mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Fast payment processing
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-brand mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Marketing and business tools
                </li>
              </ul>
            </div>
          </div>

          {/* Application Form Card */}
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-ink-900 mb-2">Apply Now</h3>
            <p className="text-ink-600 mb-6">Fill out the form below to get started.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-ink-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                  placeholder="Your company name"
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

              {/* Trade Type */}
              <div>
                <label htmlFor="tradeType" className="block text-sm font-semibold text-ink-900 mb-2">
                  Primary Trade <span className="text-red-500">*</span>
                </label>
                <select
                  name="tradeType"
                  id="tradeType"
                  required
                  value={formData.tradeType}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                >
                  <option value="">Select your primary trade</option>
                  {tradeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
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
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
