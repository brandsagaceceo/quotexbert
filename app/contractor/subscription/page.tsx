"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Sparkles, Shield, TrendingUp, Clock, CheckCircle, DollarSign } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-slate-700">Grow Your Business</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-6 animate-fade-in-up">
            Choose Your Plan
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Select service categories and start receiving <span className="font-bold text-rose-700">qualified leads</span> instantly
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Stripe Secured</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">500+ Active Contractors</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Cancel Anytime</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 p-8 mb-8 animate-fade-in-up hover-lift" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Select Your Services</h2>
                  <p className="text-slate-600 text-lg">Pick categories to receive instant job notifications</p>
                </div>
                {selectedCategories.length > 0 && (
                  <div className="hidden sm:block bg-gradient-to-r from-rose-600 to-orange-600 px-5 py-2 rounded-full shadow-lg animate-scale-in">
                    <span className="text-white font-bold text-lg">{selectedCategories.length} selected</span>
                  </div>
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((category, index) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in-up ${
                        isSelected
                          ? 'border-rose-500 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 shadow-xl'
                          : 'border-slate-200 bg-white hover:border-rose-400 hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-orange-50/50'
                      }`}
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      {/* Checkmark Badge with animation */}
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-rose-600 to-orange-600 rounded-full p-2 shadow-lg animate-scale-in">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isSelected ? 'opacity-5' : ''}`}></div>
                      
                      <div className="flex flex-col h-full relative z-10">
                        <h3 className={`font-bold text-base mb-2 leading-tight transition-colors ${isSelected ? 'text-rose-900' : 'text-slate-900 group-hover:text-rose-900'}`}>
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4 flex-grow">
                          {category.description}
                        </p>
                        <div className={`flex items-center justify-between pt-4 border-t-2 ${isSelected ? 'border-rose-300' : 'border-slate-200 group-hover:border-rose-200'}`}>
                          <div className="flex items-center gap-1">
                            <DollarSign className={`w-5 h-5 ${isSelected ? 'text-rose-700' : 'text-slate-700 group-hover:text-rose-600'}`} />
                            <span className={`text-2xl font-bold ${isSelected ? 'text-rose-700' : 'text-slate-700 group-hover:text-rose-600'}`}>
                              {category.price}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">per month</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Quick Select Options */}
              <div className="mt-10 pt-8 border-t-2 border-slate-200">
                <p className="text-base text-slate-700 mb-4 font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  Quick Select Options
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategories(categories.map(c => c.id))}
                    className="px-6 py-3 bg-gradient-to-r from-rose-700 to-orange-600 text-white text-sm font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    🌟 Select All (Save 15%)
                  </button>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="px-6 py-3 bg-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-300 hover:shadow-lg transition-all duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setSelectedCategories(['general', 'kitchen', 'bathroom', 'basement'])}
                    className="px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 text-orange-900 text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    ⭐ Popular Package
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 p-8 sticky top-24 animate-fade-in-up hover-lift" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-rose-600" />
                <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>
              </div>
              
              {selectedCategories.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                    {selectedCategories.map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return (
                        <div key={catId} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-700 font-medium">{category?.name}</span>
                          <span className="font-bold text-slate-900 text-base">${category?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t-2 border-slate-200 pt-5 mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-slate-600">Monthly Total</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">${calculateTotal()}</span>
                    </div>
                    <p className="text-xs text-slate-500 text-right">Billed monthly • Cancel anytime</p>
                  </div>
                  
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-700 via-red-600 to-orange-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          Subscribe Securely
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Cancel Anytime</p>
                        <p className="text-xs text-green-700">No long-term commitment required</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Unlimited Access</p>
                        <p className="text-xs text-blue-700">Receive all jobs in your categories</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Secure Payments</p>
                        <p className="text-xs text-purple-700">Protected by Stripe encryption</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-2">No categories selected</p>
                  <p className="text-sm text-slate-500">Choose services to view pricing</p>
                </div>
              )}
            </div>

            {/* Payout Section */}
            {payoutInfo && payoutInfo.availableBalance > 0 && (
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-2xl border-2 border-green-200 p-8 mt-8 animate-scale-in hover-lift">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-7 h-7 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Available Earnings</h3>
                </div>
                
                <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  ${payoutInfo.availableBalance.toFixed(2)}
                </div>
                
                <p className="text-sm text-green-700 font-medium mb-6">
                  Ready to withdraw
                </p>
                
                <button
                  onClick={handleRequestPayout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        Request Payout
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <Clock className="w-4 h-4" />
                    <p className="font-medium">Deposited in 2-3 business days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
