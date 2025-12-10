"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, TrendingUp, Clock, CheckCircle } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Package {
  id: string;
  name: string;
  price: number;
  leadLimit: number;
  categories: string[];
  features: string[];
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: "handyman",
    name: "Handyman",
    price: 79,
    leadLimit: 15,
    categories: ["plumbing", "electrical", "painting", "flooring"],
    features: [
      "4 Trade Categories",
      "Up to 15 leads/month",
      "Professional profile",
      "Email & phone support",
      "Portfolio showcase",
      "Customer reviews"
    ]
  },
  {
    id: "renovation",
    name: "Renovation Expert",
    price: 139,
    leadLimit: 30,
    categories: ["general", "plumbing", "electrical", "painting", "flooring", "kitchen", "bathroom", "basement"],
    features: [
      "8 Trade Categories",
      "Up to 30 leads/month",
      "Enhanced profile badge",
      "Priority support",
      "Featured in search",
      "Portfolio showcase",
      "Advanced analytics",
      "Lead notifications"
    ],
    popular: true
  },
  {
    id: "general-contractor",
    name: "General Contractor",
    price: 199,
    leadLimit: 50,
    categories: ["general", "plumbing", "electrical", "hvac", "roofing", "flooring", "painting", "kitchen", "bathroom", "basement", "deck", "landscaping"],
    features: [
      "ALL 12 Categories",
      "Up to 50 leads/month",
      "Premium profile badge",
      "24/7 priority support",
      "Top of search results",
      "Portfolio showcase",
      "Advanced analytics",
      "Instant lead alerts",
      "Dedicated account manager",
      "Custom branding"
    ]
  }
];

export default function ContractorSubscription() {
  const { authUser: user, authLoading } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);



  const handleSubscribe = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select a plan');
      return;
    }

    // Determine which package was selected based on categories
    const selectedPackage = packages.find(pkg => 
      pkg.categories.length === selectedCategories.length &&
      pkg.categories.every(cat => selectedCategories.includes(cat))
    );

    if (!selectedPackage) {
      alert('Please select one of the package plans');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contractor/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          categories: selectedCategories,
          packageId: selectedPackage.id,
          amount: selectedPackage.price,
        })
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      } else {
        alert('Failed to create subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (user?.role !== 'contractor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Contractor Access Only</h1>
          <p className="text-slate-600 mb-6">This page is only available to contractors.</p>
          <Link href="/" className="text-rose-700 hover:underline">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-6 leading-tight">
            Choose Your Plan
          </h1>
          
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
            Get qualified leads delivered directly to you. <span className="font-black text-rose-700">No bidding. No competition.</span>
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-7 h-7 text-green-600" />
              <span className="text-base font-bold">Stripe Secured</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <TrendingUp className="w-7 h-7 text-rose-600" />
              <span className="text-base font-bold">500+ Active Contractors</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-7 h-7 text-orange-600" />
              <span className="text-base font-bold">Cancel Anytime</span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers - Simplified */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-10">
            <p className="text-xl text-slate-600 font-semibold mb-2">
              Simple, transparent pricing. Choose the plan that fits your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl shadow-2xl border-4 p-10 transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-fade-in-up ${
                  pkg.popular
                    ? 'border-rose-500 ring-4 ring-rose-200 scale-105'
                    : 'border-slate-200 hover:border-rose-400'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-8 py-3 rounded-full text-base font-bold shadow-xl animate-pulse">
                    ⭐ MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-slate-900 mb-4">{pkg.name}</h3>
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-6xl font-black bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">
                        ${pkg.price}
                      </span>
                      <span className="text-xl text-slate-600 font-bold">/month</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-rose-50 to-orange-50 px-6 py-4 rounded-2xl border-2 border-rose-200">
                    <p className="text-2xl font-black text-rose-700 text-center mb-2">
                      {pkg.categories.length} Trade {pkg.categories.length === 1 ? 'Category' : 'Categories'}
                    </p>
                    <p className="text-sm text-slate-600 font-semibold text-center">
                      Unlimited leads per month
                    </p>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      One flat monthly rate
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-base font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => {
                    setSelectedCategories(pkg.categories);
                    handleSubscribe();
                  }}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'
                      : 'bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-rose-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Shield className="w-6 h-6" />
                    Get Started Now
                  </span>
                </button>
                
                <p className="text-center text-sm text-slate-500 mt-4 font-medium">
                  Cancel anytime • No contracts
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-10 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">What's Included in Each Plan</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Feature</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900">Handyman</th>
                  <th className="text-center py-4 px-4 font-bold text-rose-700">Renovation Expert</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900">General Contractor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50">
                  <td className="py-4 px-4 font-semibold text-slate-700">Trade Categories</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">4 Categories</td>
                  <td className="py-4 px-4 text-center font-bold text-rose-700">8 Categories</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">All 12 Categories</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-700">Monthly Price</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">$79/mo</td>
                  <td className="py-4 px-4 text-center font-bold text-rose-700">$139/mo</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">$199/mo</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-700">Profile Badge</td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-rose-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-4 px-4 font-semibold text-slate-700">Portfolio Showcase</td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-rose-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-700">Priority Support</td>
                  <td className="py-4 px-4 text-center"><span className="text-slate-400">—</span></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-rose-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-4 px-4 font-semibold text-slate-700">Featured in Search</td>
                  <td className="py-4 px-4 text-center"><span className="text-slate-400">—</span></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-rose-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-700">Analytics Dashboard</td>
                  <td className="py-4 px-4 text-center"><span className="text-slate-400">—</span></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-rose-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-4 px-4 font-semibold text-slate-700">Dedicated Account Manager</td>
                  <td className="py-4 px-4 text-center"><span className="text-slate-400">—</span></td>
                  <td className="py-4 px-4 text-center"><span className="text-slate-400">—</span></td>
                  <td className="py-4 px-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
