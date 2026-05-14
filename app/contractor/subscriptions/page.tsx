// PRODUCTION PRICING ROUTE — /contractor/subscriptions (plural)
// This is the LIVE subscription/pricing page. All internal links must point here.
// DO NOT confuse with /contractor/subscription (singular) — that is a deprecated redirect.
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CATEGORY_GROUPS, getCategoryById, normalizeCategory } from "@/lib/categories";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Subscription {
  id: string;
  category: string;
  status: string;
  monthlyPrice: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
  canClaimLeads: boolean;
  leadsThisMonth: number;
  monthlyLeadLimit: number;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  category: string;
  description: string;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const { authUser, authLoading } = useAuth();
  const { error: toastError } = useToast();
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'billing'>('subscriptions');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');  
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('all');

  // Selected plan for visual highlight before checkout
  const [selectedPlan, setSelectedPlan] = useState<'handyman' | 'renovation' | 'general' | null>(null);

  // Category picker modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [pendingTier, setPendingTier] = useState<'handyman' | 'renovation' | 'general' | null>(null);
  const [pickedCategories, setPickedCategories] = useState<string[]>([]);
  const [modalSearch, setModalSearch] = useState('');

  // Check for success/cancel URL parameters
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const tier = searchParams.get('tier');
    const sessionId = searchParams.get('session_id');

    if (success === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 10000);

      // Activate selected categories stored before Stripe redirect
      const pendingKey = `pending_categories_${tier}`;
      const pendingCategories = (() => {
        try { return JSON.parse(localStorage.getItem(pendingKey) || '[]'); } catch { return []; }
      })();

      if (sessionId && pendingCategories.length > 0) {
        // Wait for authUser to be available
        const activate = (userId: string) => {
          fetch('/api/subscriptions/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, contractorId: userId, selectedCategories: pendingCategories }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.success) {
                localStorage.removeItem(pendingKey);
                fetchSubscriptions();
              }
            })
            .catch((err) => console.error('[Activate] Error:', err));
        };

        // authUser may not be loaded yet — poll briefly
        if (authUser) {
          activate(authUser.id);
        } else {
          const poll = setInterval(() => {
            // Re-read authUser each tick to detect when it loads
            void (function check() {
              if (authUser) { clearInterval(poll); activate(authUser.id); }
            }());
          }, 300);
          setTimeout(() => clearInterval(poll), 5000);
        }
      }

      window.history.replaceState({}, '', '/contractor/subscriptions');
    }

    if (canceled === 'true') {
      setShowCancelMessage(true);
      setTimeout(() => setShowCancelMessage(false), 8000);
      window.history.replaceState({}, '', '/contractor/subscriptions');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch subscription data
  const fetchSubscriptions = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions?contractorId=${authUser.id}`);
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.subscriptions || []);
      } else {
        setError(data.error || 'Failed to fetch subscriptions');
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch billing history
  const fetchBillingHistory = async () => {
    if (!authUser) return;

    try {
      const response = await fetch(`/api/payments/dashboard?userId=${authUser.id}&role=contractor`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data.recentTransactions || []);
      }
    } catch (err) {
      console.error('Error fetching billing history:', err);
    }
  };

  useEffect(() => {
    if (authUser && !authLoading) {
      fetchSubscriptions();
      fetchBillingHistory();
    }
  }, [authUser, authLoading]);

  // Open category picker modal (or go straight to checkout for general tier)
  const handleTierSubscription = (tier: 'handyman' | 'renovation' | 'general') => {
    if (!authUser) {
      toastError('Please sign in to subscribe to a plan');
      return;
    }
    setSelectedPlan(tier);
    if (tier === 'general') {
      // All categories auto-selected — go directly to checkout
      const allCategories = CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => c.id));
      handleProceedToCheckout(tier, allCategories);
      return;
    }
    setPendingTier(tier);
    setPickedCategories([]);
    setModalSearch('');
    setShowCategoryModal(true);
  };

  // Called from modal "Continue to Payment" button
  const handleProceedToCheckout = async (tier: 'handyman' | 'renovation' | 'general', categories: string[]) => {
    if (!authUser) return;

    if (!selectedPlan) {
      alert("Please select a plan before proceeding to payment.");
      return;
    }

    setShowCategoryModal(false);

    try {
      setCheckoutLoading(tier);
      setError(null);

      // Save selected categories to localStorage before Stripe redirect
      // Store both raw IDs and normalized equivalents for failsafe matching
      localStorage.setItem(`pending_categories_${tier}`, JSON.stringify(categories));
      localStorage.setItem(`pending_categories_normalized_${tier}`, JSON.stringify(
        categories.map(c => normalizeCategory(c))
      ));

      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: authUser.id,
          tier,
          email: authUser.email,
          selectedCategories: categories,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Subscription] HTTP error:', response.status, errorText);
        let parsed: any = {};
        try { parsed = JSON.parse(errorText); } catch {}
        toastError(parsed.error || `Server error ${response.status}. Please try again.`);
        setCheckoutLoading(null);
        return;
      }

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toastError(data.error || 'Failed to create checkout session. Please try again.');
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error('[Subscription] Catch error:', err);
      toastError('Failed to start checkout process. Please check your connection and try again.');
      setCheckoutLoading(null);
    }
  };

  // Toggle a category in the picker modal
  const togglePickedCategory = (categoryId: string, maxAllowed: number) => {
    setPickedCategories((prev) => {
      if (prev.includes(categoryId)) return prev.filter((c) => c !== categoryId);
      if (prev.length >= maxAllowed) return prev; // at limit
      return [...prev, categoryId];
    });
  };

  // Subscribe to a category
  const handleSubscribe = async (category: string) => {
    if (!authUser) return;

    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: authUser.id,
          category
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe Checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          // Refresh data
          await fetchSubscriptions();
        }
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  // Cancel a subscription
  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? You will lose access to leads in this category at the end of your current billing period.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId })
      });

      const data = await response.json();

      if (data.success) {
        await fetchSubscriptions();
      } else {
        setError(data.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (!authUser || authUser.role !== 'contractor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only available to contractors.</p>
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalMonthlyFees = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyPrice, 0);
  const subscribedCategories = new Set(subscriptions.map(sub => sub.category));

  // Filter function for categories
  const getFilteredCategoryGroups = () => {
    return CATEGORY_GROUPS.map(group => ({
      ...group,
      categories: group.categories.filter(category => {
        // Search term filter
        if (searchTerm && !category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Price filter
        if (priceFilter !== 'all') {
          if (priceFilter === 'low' && category.monthlyPrice > 25) return false;
          if (priceFilter === 'medium' && (category.monthlyPrice <= 25 || category.monthlyPrice > 49)) return false;
          if (priceFilter === 'high' && category.monthlyPrice <= 49) return false;
        }
        
        // Status filter
        const subscription = subscriptions.find(sub => sub.category === category.id);
        if (statusFilter !== 'all') {
          if (statusFilter === 'subscribed' && !subscription) return false;
          if (statusFilter === 'unsubscribed' && subscription) return false;
          if (statusFilter === 'active' && (!subscription || subscription.status !== 'active')) return false;
          if (statusFilter === 'inactive' && subscription && subscription.status === 'active') return false;
        }
        
        return true;
      })
    })).filter(group => 
      categoryGroupFilter === 'all' || group.id === categoryGroupFilter
    ).filter(group => group.categories.length > 0);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="mt-2 text-gray-600">
              Manage your category subscriptions to access leads and grow your business.
            </p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-green-800 font-medium">Subscription Activated!</h3>
                <p className="text-green-700 mt-1">
                  Your subscription payment was successful. You can now select your categories below to start receiving leads.
                </p>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Cancel Message */}
          {showCancelMessage && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-yellow-800 font-medium">Checkout Canceled</h3>
                <p className="text-yellow-700 mt-1">
                  No payment was processed. You can try again anytime by selecting a subscription tier below.
                </p>
                <button
                  onClick={() => setShowCancelMessage(false)}
                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Compact intro banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 px-4 py-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-900">Get More Jobs — Keep 100% of Your Earnings</h2>
                <p className="text-sm text-gray-600 mt-1">No commission. Flat monthly fee. Unlimited job applications in your categories.</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                <span className="flex items-center gap-1">✓ <span className="font-medium">No hidden fees</span></span>
                <span className="flex items-center gap-1">✓ <span className="font-medium">Cancel anytime</span></span>
              </div>
            </div>
          </div>

          {/* ── Pricing Tiers ── */}
          <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-3xl shadow-xl p-4 md:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 text-sm md:text-base">One monthly fee · Pick your categories · Keep every dollar you earn</p>
              {selectedPlan && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ {selectedPlan === 'handyman' ? 'Handyman ($49/mo)' : selectedPlan === 'renovation' ? 'Renovation Xbert ($99/mo)' : 'General Contractor ($149/mo)'} selected — complete payment below
                </div>
              )}
            </div>
            
            {/* Mobile-only swipe hint */}
            <p className="md:hidden text-center text-xs text-gray-400 italic mb-2">← Swipe to view plans →</p>

            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:max-w-5xl md:mx-auto md:overflow-x-visible md:pb-0" style={{WebkitOverflowScrolling:'touch'}}>
                {/* Handyman Tier */}
                <div className="group relative flex-shrink-0 snap-center w-[85vw] max-w-[340px] md:w-auto md:max-w-none">
                  <div className={`absolute -inset-1 rounded-3xl blur-xl transition duration-500 ${selectedPlan === 'handyman' ? 'bg-green-400 opacity-80' : 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 opacity-50 group-hover:opacity-80'}`}></div>
                  <div className={`relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300 ${selectedPlan === 'handyman' ? 'border-4 border-green-500 ring-4 ring-green-200' : 'border-4 border-green-400 hover:scale-105 hover:shadow-3xl'}`}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg">
                        STARTER
                      </span>
                    </div>
                    
                      <div className="text-center mt-4">
                        <div className="text-5xl mb-4">🔧</div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Handyman</h3>
                        <div className="mb-3">
                          <span className="text-5xl font-black bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">$49</span>
                          <span className="text-gray-600 font-bold text-lg">/month</span>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 mb-5 border border-green-200">
                          <p className="text-sm font-black text-green-800">3 Categories — Perfect for solo contractors</p>
                        </div>
                      
                        <ul className="text-left space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600 font-bold">✓</span> Choose any 3 job categories</li>
                          <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600 font-bold">✓</span> Unlimited job applications</li>
                          <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600 font-bold">✓</span> Direct homeowner messaging</li>
                          <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600 font-bold">✓</span> Contractor directory listing</li>
                          <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600 font-bold">✓</span> Cancel anytime</li>
                        </ul>
                        
                        <button 
                          onClick={() => handleTierSubscription('handyman')}
                          disabled={checkoutLoading !== null}
                          className={`w-full rounded-xl font-black text-base py-3.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${selectedPlan === 'handyman' ? 'bg-green-600 text-white ring-2 ring-green-300' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}>
                          {checkoutLoading === 'handyman' ? (
                            <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Processing...</span>
                          ) : selectedPlan === 'handyman' ? '✓ Selected — Proceed to Payment' : 'Get Access →'}
                        </button>
                      </div>
                    </div>
                  </div>

                {/* Renovation Xbert Tier */}
                <div className="group relative flex-shrink-0 snap-center w-[85vw] max-w-[340px] md:w-auto md:max-w-none md:scale-105 z-20">
                  <div className={`absolute -inset-1 rounded-3xl blur-xl transition duration-500 ${selectedPlan === 'renovation' ? 'bg-orange-400 opacity-90' : 'bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 opacity-60 group-hover:opacity-90'}`}></div>
                  <div className={`relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300 ${selectedPlan === 'renovation' ? 'border-4 border-orange-500 ring-4 ring-orange-200' : 'border-4 border-orange-400 hover:scale-105 hover:shadow-3xl'}`}>
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30">
                      <span className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-8 py-2.5 rounded-full text-sm font-black shadow-2xl border-2 border-white whitespace-nowrap">
                        ⭐ MOST POPULAR
                      </span>
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-5xl mb-4">🏗️</div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">Renovation Xbert</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-orange-500 to-rose-700 bg-clip-text text-transparent">$99</span>
                        <span className="text-gray-600 font-bold text-lg">/month</span>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 mb-5 border border-orange-200">
                        <p className="text-sm font-black text-orange-800">6 Categories — Best value for growing businesses</p>
                      </div>
                      <ul className="text-left space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-orange-600 font-bold">✓</span> Choose any 6 job categories</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-orange-600 font-bold">✓</span> Unlimited job applications</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-orange-600 font-bold">✓</span> Priority in search results</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-orange-600 font-bold">✓</span> Featured contractor badge</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-orange-600 font-bold">✓</span> Portfolio showcase</li>
                      </ul>
                      <button 
                        onClick={() => handleTierSubscription('renovation')}
                        disabled={checkoutLoading !== null}
                        className={`w-full rounded-xl font-black text-base py-3.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${selectedPlan === 'renovation' ? 'bg-orange-600 text-white ring-2 ring-orange-300' : 'bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700'}`}>
                        {checkoutLoading === 'renovation' ? (
                          <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Processing...</span>
                        ) : selectedPlan === 'renovation' ? '✓ Selected — Proceed to Payment' : '🚀 Get Access →'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* General Contractor Tier */}
                <div className="group relative flex-shrink-0 snap-center w-[85vw] max-w-[340px] md:w-auto md:max-w-none">
                  <div className={`absolute -inset-1 rounded-3xl blur-xl transition duration-500 ${selectedPlan === 'general' ? 'bg-rose-400 opacity-80' : 'bg-gradient-to-br from-rose-400 via-orange-600 to-rose-600 opacity-50 group-hover:opacity-80'}`}></div>
                  <div className={`relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300 ${selectedPlan === 'general' ? 'border-4 border-rose-600 ring-4 ring-rose-200' : 'border-4 border-rose-400 hover:scale-105 hover:shadow-3xl'}`}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-rose-700 to-orange-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg">
                        PRO
                      </span>
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-5xl mb-4">👷</div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">General Contractor</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-rose-500 to-orange-700 bg-clip-text text-transparent">$149</span>
                        <span className="text-gray-600 font-bold text-lg">/month</span>
                      </div>
                      <div className="bg-rose-50 rounded-xl p-3 mb-5 border border-rose-200">
                        <p className="text-sm font-black text-rose-900">ALL 10+ Categories — Full-service contractors</p>
                      </div>
                      <ul className="text-left space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-rose-700 font-bold">✓</span> ALL job categories included</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-rose-700 font-bold">✓</span> Unlimited job applications</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-rose-700 font-bold">✓</span> Top priority in search results</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-rose-700 font-bold">✓</span> Premium contractor badge</li>
                        <li className="flex items-center gap-2 text-sm text-gray-700"><span className="text-rose-700 font-bold">✓</span> Featured homepage placement</li>
                      </ul>
                      <button 
                        onClick={() => handleTierSubscription('general')}
                        disabled={checkoutLoading !== null}
                        className={`w-full rounded-xl font-black text-base py-3.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${selectedPlan === 'general' ? 'bg-rose-700 text-white ring-2 ring-rose-300' : 'bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700'}`}>
                        {checkoutLoading === 'general' ? (
                          <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Processing...</span>
                        ) : selectedPlan === 'general' ? '✓ Selected — Proceed to Payment' : '👑 Get Access →'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile swipe dots */}
              <div className="flex md:hidden justify-center gap-2 mt-3 mb-2">
                <div className="w-4 h-2 rounded-full bg-green-500"></div>
                <div className="w-6 h-2 rounded-full bg-orange-500"></div>
                <div className="w-4 h-2 rounded-full bg-rose-700"></div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
                  <span>✓ <span className="font-semibold">No Hidden Fees</span></span>
                  <span>✓ <span className="font-semibold">Cancel Anytime</span></span>
                  <span>✓ <span className="font-semibold">Switch Categories Monthly</span></span>
                  <span>✓ <span className="font-semibold">No Per-Lead Charges</span></span>
                </div>
              </div>
          </div>

          {/* Summary Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-rose-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{activeSubscriptions.length}</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Monthly Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${totalMonthlyFees.toFixed(2)}</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-rose-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Leads This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {activeSubscriptions.reduce((sum, sub) => sum + sub.leadsThisMonth, 0)}
                  </p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Current Subscriptions - Streamlined */}
          {subscriptions.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-orange-50">
                <h2 className="text-xl font-bold text-gray-900">Your Active Categories</h2>
                <p className="text-sm text-gray-700 mt-1">Categories you can currently accept jobs from</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subscriptions.map((subscription) => {
                    const categoryConfig = getCategoryById(subscription.category);
                    return (
                      <div key={subscription.id} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition"></div>
                        <div className="relative bg-white rounded-xl shadow p-4 border-2 border-green-200 text-center transform hover:scale-105 transition-all">
                          <div className="text-3xl mb-2">✓</div>
                          <p className="text-sm font-bold text-gray-900">{categoryConfig?.name || subscription.category}</p>
                          <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full ${
                            subscription.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`py-4 px-1 border-b-4 font-bold text-base ${
                    activeTab === 'subscriptions'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📦 Plan Details
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`py-4 px-1 border-b-4 font-bold text-base ${
                    activeTab === 'billing'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  💳 Billing History
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Plan Comparison */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
                <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  What's Included in Each Plan
                </h2>
                
                {/* Mobile: stacked feature rows */}
                <div className="md:hidden space-y-0 border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Plan headers */}
                  <div className="grid grid-cols-4 bg-gray-50 border-b-2 border-gray-200">
                    <div className="py-3 px-2 text-xs font-bold text-gray-500 uppercase">Feature</div>
                    <div className="py-3 px-1 text-center border-l border-gray-200">
                      <div className="text-base">🔧</div>
                      <div className="text-xs font-black text-gray-800 leading-tight">Handyman</div>
                      <div className="text-xs font-bold text-green-700">$49/mo</div>
                    </div>
                    <div className="py-3 px-1 text-center border-l border-gray-200 bg-orange-50">
                      <div className="text-base">🏗️</div>
                      <div className="text-xs font-black text-gray-800 leading-tight">Renovation</div>
                      <div className="text-xs font-bold text-orange-700">$99/mo</div>
                    </div>
                    <div className="py-3 px-1 text-center border-l border-gray-200">
                      <div className="text-base">👷</div>
                      <div className="text-xs font-black text-gray-800 leading-tight">General</div>
                      <div className="text-xs font-bold text-rose-700">$149/mo</div>
                    </div>
                  </div>
                  {[
                    { label: 'Categories', vals: ['3', '6', 'ALL'] },
                    { label: 'Job Applications', vals: ['✓', '✓', '✓'] },
                    { label: 'Messaging', vals: ['✓', '✓', '✓'] },
                    { label: 'Profile Page', vals: ['✓', '✓', '✓'] },
                    { label: 'Priority Search', vals: ['—', '✓', '✓'] },
                    { label: 'Featured Badge', vals: ['—', '✓', '✓'] },
                    { label: 'Portfolio', vals: ['—', '✓', '✓'] },
                    { label: 'Homepage Spot', vals: ['—', '—', '✓'] },
                    { label: 'Acct Manager', vals: ['—', '—', '✓'] },
                  ].map((row, i) => (
                    <div key={row.label} className={`grid grid-cols-4 border-b border-gray-100 last:border-0 ${i % 2 === 1 ? 'bg-gray-50/60' : ''}`}>
                      <div className="py-3 px-2 text-xs font-semibold text-gray-700 flex items-center">{row.label}</div>
                      {row.vals.map((v, j) => (
                        <div key={j} className={`py-3 px-1 text-center border-l border-gray-100 flex items-center justify-center ${j === 1 ? 'bg-orange-50/60' : ''}`}>
                          <span className={`text-sm font-bold ${v === '✓' && j === 0 ? 'text-green-600' : v === '✓' && j === 1 ? 'text-orange-600' : v === '✓' ? 'text-rose-700' : v === '—' ? 'text-gray-300' : j === 0 ? 'text-green-700 text-xs' : j === 1 ? 'text-orange-700 text-xs' : 'text-rose-700 text-xs'}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Desktop: full table */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-600 uppercase">Feature</th>
                        <th className="text-center py-4 px-4">
                          <div className="text-2xl mb-1">🔧</div>
                          <div className="font-black text-lg">Handyman</div>
                          <div className="text-sm text-gray-600">$49/mo</div>
                        </th>
                        <th className="text-center py-4 px-4 bg-orange-50 rounded-t-xl">
                          <div className="text-2xl mb-1">🏗️</div>
                          <div className="font-black text-lg">Renovation Xbert</div>
                          <div className="text-sm text-gray-600">$99/mo</div>
                        </th>
                        <th className="text-center py-4 px-4">
                          <div className="text-2xl mb-1">👷</div>
                          <div className="font-black text-lg">General Contractor</div>
                          <div className="text-sm text-gray-600">$149/mo</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Job Categories</td>
                        <td className="text-center py-4 px-4 font-black text-green-600">3 Categories</td>
                        <td className="text-center py-4 px-4 bg-orange-50 font-black text-orange-600">6 Categories</td>
                        <td className="text-center py-4 px-4 font-black text-rose-700">ALL 10+ Categories</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Job Applications</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Direct Messaging</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Profile Directory</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Priority in Search</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Featured Badge</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Portfolio Showcase</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Homepage Placement</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Account Manager</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50 rounded-b-xl"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-rose-700">✓</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-sm">
                    💡 <span className="font-semibold">Switch categories anytime!</span> Change your selected categories monthly at no extra cost.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
                <p className="text-sm text-gray-600">Your recent subscription payments and transactions.</p>
              </div>
              <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">No billing history found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Category Picker Modal ───────────────────────────────── */}
      {showCategoryModal && pendingTier && (() => {
        const maxAllowed = pendingTier === 'handyman' ? 3 : 6;
        const tierLabel = pendingTier === 'handyman' ? 'Handyman' : 'Renovation Xbert';
        const tierColor = pendingTier === 'handyman' ? 'green' : 'orange';
        const filteredGroups = CATEGORY_GROUPS.map((g) => ({
          ...g,
          categories: g.categories.filter((c) =>
            !modalSearch || c.name.toLowerCase().includes(modalSearch.toLowerCase())
          ),
        })).filter((g) => g.categories.length > 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className={`px-6 py-5 border-b border-gray-200 bg-gradient-to-r ${
                tierColor === 'green' ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-rose-600'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">Pick Your {maxAllowed} Categories</h2>
                    <p className="text-sm text-white/80 mt-0.5">
                      {tierLabel} Plan — Choose exactly {maxAllowed} categories you want to receive jobs from
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="text-white/70 hover:text-white text-3xl leading-none ml-4"
                  >
                    ×
                  </button>
                </div>

                {/* Progress counter */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${(pickedCategories.length / maxAllowed) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-black whitespace-nowrap">
                    {pickedCategories.length} / {maxAllowed} selected
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="px-6 py-3 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Category list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {filteredGroups.map((group) => (
                  <div key={group.id}>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">{group.name}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.categories.map((cat) => {
                        const isSelected = pickedCategories.includes(cat.id);
                        const isDisabled = !isSelected && pickedCategories.length >= maxAllowed;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => togglePickedCategory(cat.id, maxAllowed)}
                            disabled={isDisabled}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm font-semibold ${
                              isSelected
                                ? tierColor === 'green'
                                  ? 'bg-green-50 border-green-500 text-green-800'
                                  : 'bg-orange-50 border-orange-500 text-orange-800'
                                : isDisabled
                                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                              isSelected
                                ? tierColor === 'green'
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-orange-500 border-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="flex-1">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {pickedCategories.length < maxAllowed && (
                    <p className="text-sm text-gray-500">
                      Select {maxAllowed - pickedCategories.length} more
                    </p>
                  )}
                  <button
                    onClick={() => handleProceedToCheckout(pendingTier, pickedCategories)}
                    disabled={pickedCategories.length !== maxAllowed}
                    className={`px-6 py-3 rounded-xl font-black text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      tierColor === 'green'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-200 hover:shadow-xl'
                        : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:shadow-orange-200 hover:shadow-xl'
                    }`}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </Elements>
  );
}

