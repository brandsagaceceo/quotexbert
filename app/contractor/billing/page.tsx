"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface BillingData {
  id: string;
  monthlyCapCents: number;
  isPaused: boolean;
  spendThisMonthCents: number;
  stripeCustomerId?: string;
  paymentMethods: any[];
}

function SetupPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setError("");

    try {
      // Get setup intent
      const response = await fetch("/api/stripe/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-contractor-1", // TODO: Get from auth
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm setup intent
      const { error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        },
      );

      if (stripeError) {
        setError(stripeError.message || "An error occurred");
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to add payment method");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#800020] text-white py-2 px-4 rounded-lg hover:bg-[#600018] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding..." : "Add Payment Method"}
      </button>
    </form>
  );
}

function BillingContent() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);

  const fetchBilling = async () => {
    try {
      const response = await fetch("/api/contractor/billing");
      if (response.ok) {
        const data = await response.json();
        setBilling(data);
      }
    } catch (error) {
      console.error("Error fetching billing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleCapUpdate = async (newCapCents: number) => {
    try {
      const response = await fetch("/api/contractor/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyCapCents: newCapCents }),
      });

      if (response.ok) {
        setBilling((prev) =>
          prev ? { ...prev, monthlyCapCents: newCapCents } : null,
        );
      }
    } catch (error) {
      console.error("Error updating cap:", error);
    }
  };

  const handlePauseToggle = async () => {
    if (!billing) return;

    try {
      const response = await fetch("/api/contractor/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaused: !billing.isPaused }),
      });

      if (response.ok) {
        setBilling((prev) =>
          prev ? { ...prev, isPaused: !prev.isPaused } : null,
        );
      }
    } catch (error) {
      console.error("Error toggling pause:", error);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading billing information...</div>
    );
  }

  if (!billing) {
    return (
      <div className="text-center py-8">Unable to load billing information</div>
    );
  }

  const remainingBudget = billing.monthlyCapCents - billing.spendThisMonthCents;
  const usagePercent =
    (billing.spendThisMonthCents / billing.monthlyCapCents) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Billing & Payment
          </h1>
          <p className="text-neutral-600">
            Manage your payment methods and spending limits for lead claims
          </p>
        </div>

        {/* How Pay-Per-Lead Works */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How Our Pay-Per-Lead System Works</h2>
          <p className="text-neutral-600 mb-6">
            QuotexBert operates on a simple, transparent pay-per-lead model powered by secure Stripe payments. You only pay when you successfully connect with a homeowner who's ready to hire.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">1</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Add Payment Method</h3>
              <p className="text-sm text-neutral-600">Securely connect your credit card or bank account via Stripe. Setup takes less than 2 minutes.</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">2</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Browse & Claim Leads</h3>
              <p className="text-sm text-neutral-600">View detailed job descriptions and homeowner requirements. Claim leads that match your expertise.</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">3</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Pay When Connected</h3>
              <p className="text-sm text-neutral-600">Payment is automatically processed when you claim a lead. Typical cost: $15-$50 based on project size.</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-3">4</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Get Paid for Work</h3>
              <p className="text-sm text-neutral-600">Negotiate directly with homeowners. Complete projects on your terms and build your reputation.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">When am I charged for a lead?</h3>
              <p className="text-neutral-600">You're charged immediately when you claim a lead and receive the homeowner's contact information. This ensures serious commitment from both parties.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">What if the homeowner doesn't respond?</h3>
              <p className="text-neutral-600">We track response rates and provide credits for non-responsive leads. Our AI filtering ensures high-quality, engaged homeowners.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Are there any monthly fees?</h3>
              <p className="text-neutral-600">No monthly fees, subscription costs, or hidden charges. You only pay per lead claimed.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">How much do leads typically cost?</h3>
              <p className="text-neutral-600">Lead prices range from $15-$50 based on project complexity and value. Higher-value projects have higher lead costs but greater earning potential.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Is my payment information secure?</h3>
              <p className="text-neutral-600">Yes, all payments are processed through Stripe's bank-level security. We never store your payment details on our servers.</p>
            </div>
          </div>
        </div>

        {/* Monthly Spending Overview */}
        <div className="bg-white rounded-xl p-6 border shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Monthly Spending Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">
                {formatCurrency(billing.spendThisMonthCents)}
              </div>
              <div className="text-sm text-neutral-600">Spent This Month</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">
                {formatCurrency(billing.monthlyCapCents)}
              </div>
              <div className="text-sm text-neutral-600">Monthly Cap</div>
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold ${remainingBudget > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(remainingBudget)}
              </div>
              <div className="text-sm text-neutral-600">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Budget Usage</span>
              <span>{usagePercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  usagePercent >= 100
                    ? "bg-red-500"
                    : usagePercent >= 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Spending Cap
              </label>
              <select
                value={billing.monthlyCapCents}
                onChange={(e) => handleCapUpdate(Number(e.target.value))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2"
              >
                <option value={2500}>$25.00</option>
                <option value={5000}>$50.00</option>
                <option value={10000}>$100.00</option>
                <option value={20000}>$200.00</option>
                <option value={50000}>$500.00</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handlePauseToggle}
                className={`px-6 py-2 rounded-lg font-medium ${
                  billing.isPaused
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {billing.isPaused ? "Resume Billing" : "Pause Billing"}
              </button>
            </div>
          </div>

          {billing.isPaused && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-yellow-800">
                  ⚠️ <strong>Billing Paused:</strong> You cannot claim new leads
                  while billing is paused.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Payment Methods
          </h2>

          {billing.paymentMethods && billing.paymentMethods.length > 0 ? (
            <div className="space-y-4 mb-6">
              {billing.paymentMethods.map((pm: any) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                      💳
                    </div>
                    <div>
                      <div className="font-medium">
                        **** **** **** {pm.card?.last4}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {pm.card?.brand?.toUpperCase()} • Expires{" "}
                        {pm.card?.exp_month}/{pm.card?.exp_year}
                      </div>
                    </div>
                  </div>
                  {/* TODO: Add remove button */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-6">
              <div className="text-neutral-500 mb-4">
                No payment methods on file
              </div>
              <p className="text-sm text-neutral-600">
                Add a payment method to start claiming leads
              </p>
            </div>
          )}

          {!showAddCard ? (
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full border-2 border-dashed border-neutral-300 rounded-lg py-4 text-neutral-600 hover:border-neutral-400 hover:text-neutral-700"
            >
              + Add Payment Method
            </button>
          ) : (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Add Payment Method</h3>
              <SetupPaymentMethodForm
                onSuccess={() => {
                  setShowAddCard(false);
                  fetchBilling();
                }}
              />
              <button
                onClick={() => setShowAddCard(false)}
                className="mt-4 text-neutral-600 hover:text-neutral-800"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContractorBillingPage() {
  return (
    <>
      <Head>
        <title>Contractor Billing - Pay-Per-Lead System | QuotexBert</title>
        <meta name="description" content="Simple pay-per-lead billing for contractors. Secure Stripe payments. Only pay when you connect with homeowners. Transparent pricing, no monthly fees." />
        <meta property="og:title" content="Contractor Billing - Pay-Per-Lead System" />
        <meta property="og:description" content="Simple pay-per-lead billing with secure Stripe payments. Only pay when you connect." />
        <meta property="og:image" content="/og-billing.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <Elements stripe={stripePromise}>
        <BillingContent />
      </Elements>
    </>
  );
}
