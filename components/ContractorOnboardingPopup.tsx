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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-orange-600 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              Welcome to QuoteXbert{contractorName ? `, ${contractorName}` : ""}! 🎉
            </h2>
            <p className="text-lg text-white/90">
              Choose your plan and start receiving qualified leads today
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-green-900 mb-2">Quality Leads</h3>
              <p className="text-green-700 text-sm">
                Connect with verified homeowners actively seeking contractors in your area
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-rose-950 mb-2">Grow Your Business</h3>
              <p className="text-rose-900 text-sm">
                Consistent stream of projects to keep your schedule full year-round
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-orange-100 rounded-2xl">
              <div className="w-16 h-16 bg-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-rose-950 mb-2">Simple & Transparent</h3>
              <p className="text-rose-800 text-sm">
                One flat monthly rate. No hidden fees or commission on projects
              </p>
            </div>
          </div>

          {/* Pricing Tiers */}
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Choose Your Plan
          </h3>
          <p className="text-center text-slate-600 mb-8">
            Simple, transparent pricing. Cancel anytime. No contracts.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl border-4 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  tier.recommended
                    ? "border-rose-600 shadow-xl"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h4>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className={`text-5xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      ${tier.price}
                    </span>
                    <span className="text-lg text-slate-600 font-semibold">/month</span>
                  </div>
                  <div className={`bg-gradient-to-r ${tier.color} bg-opacity-10 px-4 py-3 rounded-xl`}>
                    <p className="text-lg font-bold text-slate-900">
                      {tier.categories} Trade Categories
                    </p>
                    <p className="text-sm text-slate-600 font-semibold">
                      Unlimited leads per month
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contractor/subscription"
                  onClick={onClose}
                  className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-all duration-300 ${
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
              ?? Money-back guarantee · Cancel anytime · No hidden fees
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
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

