"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Category {
  id: string;
  name: string;
  description: string;
  price: number;
}

const categories: Category[] = [
  { id: "general", name: "General Contracting", description: "Full home renovations, additions, remodeling", price: 49 },
  { id: "plumbing", name: "Plumbing", description: "Pipes, fixtures, water heaters, drains", price: 39 },
  { id: "electrical", name: "Electrical", description: "Wiring, panels, lighting, outlets", price: 39 },
  { id: "hvac", name: "HVAC", description: "Heating, cooling, ventilation systems", price: 39 },
  { id: "roofing", name: "Roofing", description: "Roof repairs, replacement, gutters", price: 39 },
  { id: "flooring", name: "Flooring", description: "Hardwood, tile, carpet installation", price: 29 },
  { id: "painting", name: "Painting", description: "Interior and exterior painting", price: 29 },
  { id: "kitchen", name: "Kitchen Remodeling", description: "Cabinets, countertops, backsplash", price: 49 },
  { id: "bathroom", name: "Bathroom Remodeling", description: "Showers, vanities, tile work", price: 39 },
  { id: "basement", name: "Basement Finishing", description: "Framing, drywall, flooring, lighting", price: 39 },
  { id: "deck", name: "Decks & Patios", description: "Outdoor living spaces, pergolas", price: 39 },
  { id: "landscaping", name: "Landscaping", description: "Gardens, hardscaping, irrigation", price: 29 },
];

export default function ContractorSubscription() {
  const { authUser: user, isLoading } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [payoutInfo, setPayoutInfo] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      fetchPayoutInfo();
    }
  }, [user]);

  const fetchPayoutInfo = async () => {
    try {
      const response = await fetch(`/api/contractor/payout?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setPayoutInfo(data);
        if (data.categories) {
          setSelectedCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching payout info:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const calculateTotal = () => {
    return selectedCategories.reduce((total, catId) => {
      const category = categories.find(c => c.id === catId);
      return total + (category?.price || 0);
    }, 0);
  };

  const handleSubscribe = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
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
          amount: calculateTotal()
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

  const handleRequestPayout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contractor/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        alert('Payout request submitted! Funds will be transferred within 2-3 business days.');
        fetchPayoutInfo();
      } else {
        alert('Failed to request payout. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role !== 'contractor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Contractor Access Only</h1>
          <p className="text-slate-600 mb-6">This page is only available to contractors.</p>
          <Link href="/" className="text-blue-600 hover:underline">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-900 to-orange-900 bg-clip-text text-transparent mb-4">
            Contractor Subscription
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your categories and start receiving qualified leads
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Your Categories</h2>
              <p className="text-slate-600 mb-6">Choose the services you offer to receive relevant job leads</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
                      selectedCategories.includes(category.id)
                        ? 'border-rose-500 bg-rose-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{category.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-700 font-bold">${category.price}/mo</span>
                        {selectedCategories.includes(category.id) && (
                          <svg className="w-6 h-6 text-rose-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Subscription Summary</h3>
              
              {selectedCategories.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {selectedCategories.map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return (
                        <div key={catId} className="flex justify-between text-sm">
                          <span className="text-slate-700">{category?.name}</span>
                          <span className="font-medium text-slate-900">${category?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Monthly Total</span>
                      <span className="text-2xl font-bold text-rose-700">${calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-700 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Subscribe Now'}
                  </button>
                  
                  <div className="mt-6 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Unlimited job access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Stripe-secured payments</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-600 text-center py-8">
                  Select categories to see pricing
                </p>
              )}
            </div>

            {/* Payout Section */}
            {payoutInfo && payoutInfo.availableBalance > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Available Earnings</h3>
                <div className="text-4xl font-bold text-green-600 mb-6">
                  ${payoutInfo.availableBalance.toFixed(2)}
                </div>
                <button
                  onClick={handleRequestPayout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Request Payout'}
                </button>
                <p className="text-sm text-slate-600 mt-4">
                  Funds will be deposited to your bank account within 2-3 business days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
