"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contractorName?: string;
}

export function ContractorOnboardingPopup({ isOpen, onClose, contractorName }: OnboardingPopupProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tiers = [
    {
      id: "handyman",
      name: "Handyman",
      price: 79,
      leadLimit: 15,
      categories: 4,
      features: [
        "4 Trade Categories",
        "Up to 15 leads/month",
        "Professional profile",
        "Email & phone support",
        "Portfolio showcase",
        "Customer reviews"
      ],
      color: "from-rose-600 to-orange-600",
      recommended: false
    },
    {
      id: "renovation",
      name: "Renovation Expert",
      price: 139,
      leadLimit: 30,
      categories: 8,
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
      color: "from-rose-600 to-orange-600",
      recommended: true
    },
    {
      id: "general-contractor",
      name: "General Contractor",
      price: 199,
      leadLimit: 50,
      categories: 12,
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
      ],
      color: "from-rose-700 to-orange-700",
      recommended: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="min-h-full flex items-start justify-center p-3 sm:p-4 py-6 sm:py-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full animate-scale-in">
          {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-orange-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="text-center pr-8 sm:pr-12">
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
              Welcome to QuoteXbert{contractorName ? `, ${contractorName}` : ""}! 🎉
            </h2>
            <p className="text-sm sm:text-lg text-white/90">
              Choose your plan and start receiving qualified leads today
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {/* Benefits Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-green-900 mb-2">Quality Leads</h3>
              <p className="text-green-700 text-xs sm:text-sm">
                Connect with verified homeowners actively seeking contractors in your area
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-rose-950 mb-2">Grow Your Business</h3>
              <p className="text-rose-900 text-xs sm:text-sm">
                Consistent stream of projects to keep your schedule full year-round
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-rose-50 to-orange-100 rounded-xl sm:rounded-2xl">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-rose-950 mb-2">Simple & Transparent</h3>
              <p className="text-rose-800 text-xs sm:text-sm">
                One flat monthly rate. No hidden fees or commission on projects
              </p>
            </div>
          </div>

          {/* Pricing Tiers */}
          <h3 className="text-lg sm:text-2xl font-bold text-center text-slate-900 mb-1 sm:mb-2">
            Choose Your Plan
          </h3>
          <p className="text-center text-xs sm:text-sm text-slate-600 mb-4 sm:mb-8">
            Simple, transparent pricing. Cancel anytime. No contracts.
          </p>

          {/* Mobile: horizontal snap-scroll carousel, Desktop: 3-col grid */}
          {/* pt-4 gives room for the absolute "MOST POPULAR" badge (absolute -top-3) on mobile */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory sm:overflow-visible pb-4 sm:pb-0 pt-4 sm:pt-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' as any }}>
            {tiers.map((tier, idx) => (
              <div
                key={tier.id}
                style={{ touchAction: 'pan-x' }}
                className={`relative bg-white rounded-xl sm:rounded-2xl border-2 sm:border-4 p-4 sm:p-6 transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-2xl snap-center flex-shrink-0 w-[85vw] sm:w-auto ${
                  tier.recommended
                    ? "border-rose-600 shadow-lg sm:shadow-xl"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-4 sm:mb-6">
                  <h4 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">{tier.name}</h4>
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <span className={`text-3xl sm:text-5xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      ${tier.price}
                    </span>
                    <span className="text-xs sm:text-lg text-slate-600 font-semibold">/month</span>
                  </div>
                  <div className={`bg-gradient-to-r ${tier.color} bg-opacity-10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl`}>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      {tier.categories} Trade Categories
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                      Unlimited leads per month
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contractor/subscription"
                  onClick={onClose}
                  className={`block w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg text-center transition-all duration-300 ${
                    tier.recommended
                      ? `bg-gradient-to-r ${tier.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-4">
              Not ready to subscribe yet?{" "}
              <button
                onClick={onClose}
                className="text-rose-600 hover:text-rose-700 font-semibold underline"
              >
                Browse the platform first
              </button>
            </p>
            <p className="text-sm text-slate-500">
              ✅ Money-back guarantee · Cancel anytime · No hidden fees
            </p>
          </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

