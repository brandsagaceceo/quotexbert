"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BillingData {
  id: string;
  stripeCustomerId?: string;
  spendThisMonthCents: number;
  isPaused: boolean;
  resetOn: string;
  charges: Array<{
    id: string;
    amountCents: number;
    description: string;
    createdAt: string;
    stripePaymentIntentId?: string;
  }>;
}

function PaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser: user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create setup intent
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const { clientSecret } = await response.json();

      // Confirm setup intent with card
      const { error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: user.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment setup failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add Payment Method
        </h3>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!stripe || loading}
          className="mt-4 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
        >
          {loading ? 'Setting up...' : 'Add Payment Method'}
        </button>
      </div>
    </form>
  );
}

function BillingDashboard() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const { authUser: user } = useAuth();

  useEffect(() => {
    if (user?.role === 'contractor') {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const response = await fetch(`/api/billing?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setBilling(data.billing);
        setShowAddPayment(!data.billing?.stripeCustomerId);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBillingStatus = async () => {
    if (!billing) return;

    try {
      const response = await fetch('/api/billing/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        setBilling(prev => prev ? { ...prev, isPaused: !prev.isPaused } : null);
      }
    } catch (error) {
      console.error('Error toggling billing status:', error);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-slate-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Billing & Payments
          </h1>
          <p className="text-xl text-gray-600">
            Manage your payment methods and billing preferences
          </p>
        </div>

        {/* Billing Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Month Spend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                <p className="text-3xl font-bold text-burgundy-600">
                  {formatCurrency(billing?.spendThisMonthCents || 0)}
                </p>
                <p className="text-sm text-gray-500">Lead claims & fees</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>

          {/* Billing Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                <p className={`text-2xl font-bold ${billing?.isPaused ? 'text-red-600' : 'text-green-600'}`}>
                  {billing?.isPaused ? 'Paused' : 'Active'}
                </p>
                <p className="text-sm text-gray-500">
                  {billing?.isPaused ? 'Lead claims disabled' : 'Ready to claim leads'}
                </p>
              </div>
              <button
                onClick={toggleBillingStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  billing?.isPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {billing?.isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          {/* Next Reset */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Next Reset</h3>
                <p className="text-lg font-semibold text-teal-600">
                  {billing?.resetOn ? formatDate(billing.resetOn) : 'Not set'}
                </p>
                <p className="text-sm text-gray-500">Monthly billing cycle</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        {showAddPayment ? (
          <div className="mb-8">
            <PaymentMethodForm onSuccess={() => {
              setShowAddPayment(false);
              fetchBillingData();
            }} />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <p className="text-gray-600">•••• •••• •••• •••• Default card on file</p>
              </div>
              <button
                onClick={() => setShowAddPayment(true)}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Update
              </button>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <p className="text-gray-600">Your lead claims and payment history</p>
          </div>
          
          <div className="p-6">
            {billing?.charges && billing.charges.length > 0 ? (
              <div className="space-y-4">
                {billing.charges.map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{charge.description}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(charge.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(charge.amountCents)}
                      </p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-500">
                  Your lead claims and payments will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-burgundy-50 rounded-xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lead Claims</h4>
              <p className="text-gray-600 text-sm mb-2">Pay only for leads you claim</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Kitchen projects: $15 per lead</li>
                <li>• Bathroom projects: $12 per lead</li>
                <li>• General repairs: $8 per lead</li>
                <li>• Major renovations: $20 per lead</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">No Hidden Fees</h4>
              <p className="text-gray-600 text-sm mb-2">Transparent pricing</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• No monthly subscription</li>
                <li>• No setup fees</li>
                <li>• No cancellation fees</li>
                <li>• Full refund if lead doesn't respond</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { authUser: user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-slate-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Please sign in to access billing information.</p>
          <Link
            href="/sign-in"
            className="bg-gradient-to-r from-burgundy-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'contractor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-slate-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contractor Access Only</h1>
          <p className="text-gray-600 mb-6">This page is only accessible to contractors.</p>
          <Link
            href="/"
            className="bg-gradient-to-r from-burgundy-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <BillingDashboard />
    </Elements>
  );
}