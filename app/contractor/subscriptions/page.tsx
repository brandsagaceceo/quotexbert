"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CATEGORY_GROUPS, getCategoryById } from "@/lib/categories";

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

  // Check for success/cancel URL parameters
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const tier = searchParams.get('tier');

    if (success === 'true') {
      setShowSuccessMessage(true);
      // Auto-hide after 10 seconds
      setTimeout(() => setShowSuccessMessage(false), 10000);
      
      // Clean URL
      window.history.replaceState({}, '', '/contractor/subscriptions');
    }

    if (canceled === 'true') {
      setShowCancelMessage(true);
      // Auto-hide after 8 seconds
      setTimeout(() => setShowCancelMessage(false), 8000);
      
      // Clean URL
      window.history.replaceState({}, '', '/contractor/subscriptions');
    }
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

  // Subscribe to a tier (create Stripe Checkout session)
  const handleTierSubscription = async (tier: 'handyman' | 'renovation' | 'general') => {
    console.log('[Subscription] Button clicked for tier:', tier);
    
    if (!authUser) {
      console.error('[Subscription] No authUser found');
      alert('Please sign in to subscribe to a plan');
      return;
    }

    console.log('[Subscription] Auth user:', authUser.id, authUser.email);

    try {
      setCheckoutLoading(tier);
      setError(null);
      console.log('[Subscription] Calling API...');
      
      // Create Stripe Checkout session
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: authUser.id,
          tier: tier,
          email: authUser.email
        })
      });

      console.log('[Subscription] API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Subscription] HTTP error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[Subscription] API response data:', data);

      if (data.success && data.checkoutUrl) {
        console.log('[Subscription] Redirecting to Stripe:', data.checkoutUrl);
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        console.error('[Subscription] API error:', data.error);
        alert(data.error || 'Failed to create checkout session. Please try again.');
        setCheckoutLoading(null);
      }
    } catch (err) {
      console.error('[Subscription] Catch error:', err);
      alert('Failed to start checkout process. Please check your connection and try again.');
      setCheckoutLoading(null);
    }
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

          {/* Introduction Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border-2 border-rose-100">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-6 shadow-lg">
                  <span className="text-2xl">👷</span>
                  <span>Welcome, Contractor!</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  Get More Jobs, Keep 100% of Your Profits
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Unlike other platforms, we <span className="font-bold text-rose-600">never take a percentage of your job earnings</span>. 
                  Pay a simple monthly subscription per category and keep every dollar you earn.
                </p>
              </div>

              {/* Key Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                      <span className="text-3xl">💰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Zero Commission</h3>
                      <p className="text-gray-700">
                        Keep 100% of your earnings. We only charge for category access, never per job or commission.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Choose Your Categories</h3>
                      <p className="text-gray-700">
                        Select 3, 6, or 10 job categories based on your expertise. From roofing to electrical, plumbing to landscaping.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500 rounded-full p-3 flex-shrink-0">
                      <span className="text-3xl">📬</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Unlimited Applications</h3>
                      <p className="text-gray-700">
                        Apply to as many jobs as you want in your selected categories. No per-lead fees, ever.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 rounded-full p-3 flex-shrink-0">
                      <span className="text-3xl">💬</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Direct Messaging</h3>
                      <p className="text-gray-700">
                        Chat directly with homeowners, negotiate terms, and close deals—all through our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-black mb-6 text-center">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white border-opacity-30">
                      <span className="text-4xl">📋</span>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-full px-4 py-1 mx-auto w-fit mb-3">
                      <span className="text-sm font-black">STEP 1</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Choose Your Plan</h4>
                    <p className="text-white text-opacity-90">Select how many categories you want access to (3, 6, or 10)</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white border-opacity-30">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-full px-4 py-1 mx-auto w-fit mb-3">
                      <span className="text-sm font-black">STEP 2</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Pick Categories</h4>
                    <p className="text-white text-opacity-90">After subscribing, select your job categories from 30+ options</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white border-opacity-30">
                      <span className="text-4xl">🚀</span>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-full px-4 py-1 mx-auto w-fit mb-3">
                      <span className="text-sm font-black">STEP 3</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Start Bidding</h4>
                    <p className="text-white text-opacity-90">Apply to unlimited jobs and keep 100% of what you earn</p>
                  </div>
                </div>
              </div>

              {/* Category Examples */}
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Available Categories Include:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    '🏠 Roofing', '⚡ Electrical', '🚰 Plumbing', '🎨 Painting', 
                    '🌳 Landscaping', '❄️ HVAC', '🪟 Windows & Doors', '🧱 Masonry',
                    '🛠️ General Repairs', '🏗️ Renovations', '🔧 Carpentry', '☃️ Snow Removal'
                  ].map((cat) => (
                    <span key={cat} className="bg-gray-100 hover:bg-rose-100 border border-gray-300 hover:border-rose-300 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 transition-colors">
                      {cat}
                    </span>
                  ))}
                  <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    + 18 More!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tiers - CATEGORY BUNDLE DESIGN */}
          <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
            {/* Background Decorative Bubbles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="inline-block mb-4">
                  <span className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm font-bold shadow-lg">
                    💎 One Price, Multiple Categories
                  </span>
                </div>
                <h2 className="text-5xl font-black bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-gray-700 font-semibold max-w-2xl mx-auto">
                  Pay one monthly fee to access multiple job categories. No per-lead charges!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Handyman Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border-4 border-green-400">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg">
                        STARTER
                      </span>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-4xl">🔧</span>
                      </div>
                      
                      <h3 className="text-3xl font-black text-gray-900 mb-3">Handyman</h3>
                      
                      <div className="mb-4">
                        <span className="text-6xl font-black bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">$49</span>
                        <span className="text-gray-600 font-bold text-xl">/month</span>
                      </div>
                      
                      <div className="bg-green-50 rounded-2xl p-4 mb-6 border-2 border-green-200">
                        <p className="text-sm font-black text-green-800 mb-2">Access to 3 Categories</p>
                        <p className="text-xs text-green-700">Perfect for solo contractors</p>
                      </div>
                      
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Choose any 3 job categories</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Unlimited job applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Direct homeowner messaging</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Profile on contractor directory</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Cancel anytime</span>
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleTierSubscription('handyman')}
                        disabled={checkoutLoading !== null}
                        className="group/btn relative w-full overflow-hidden rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-[length:200%_100%]"></div>
                        <div className="relative px-6 py-4 text-white flex items-center justify-center gap-2">
                          {checkoutLoading === 'handyman' ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Get Started</span>
                              <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Renovation Xbert Tier */}
                <div className="group relative scale-105">
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border-4 border-orange-400">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-8 py-2.5 rounded-full text-sm font-black shadow-2xl border-2 border-white">
                        ⭐ MOST POPULAR
                      </span>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-4xl">🏗️</span>
                      </div>
                      
                      <h3 className="text-3xl font-black text-gray-900 mb-3">Renovation Xbert</h3>
                      
                      <div className="mb-4">
                        <span className="text-6xl font-black bg-gradient-to-r from-orange-500 to-rose-700 bg-clip-text text-transparent">$99</span>
                        <span className="text-gray-600 font-bold text-xl">/month</span>
                      </div>
                      
                      <div className="bg-orange-50 rounded-2xl p-4 mb-6 border-2 border-orange-200">
                        <p className="text-sm font-black text-orange-800 mb-2">Access to 6 Categories</p>
                        <p className="text-xs text-orange-700">Best value for growing businesses</p>
                      </div>
                      
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Choose any 6 job categories</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Unlimited job applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Priority in search results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Featured contractor badge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Portfolio showcase</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Everything in Handyman</span>
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleTierSubscription('renovation')}
                        disabled={checkoutLoading !== null}
                        className="group/btn relative w-full overflow-hidden rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 bg-[length:200%_100%]"></div>
                        <div className="relative px-6 py-4 text-white flex items-center justify-center gap-2">
                          {checkoutLoading === 'renovation' ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">🚀</span>
                              <span>Get Started</span>
                              <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* General Contractor Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border-4 border-purple-400">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg">
                        PRO
                      </span>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-4xl">👷</span>
                      </div>
                      
                      <h3 className="text-3xl font-black text-gray-900 mb-3">General Contractor</h3>
                      
                      <div className="mb-4">
                        <span className="text-6xl font-black bg-gradient-to-r from-purple-500 to-indigo-700 bg-clip-text text-transparent">$149</span>
                        <span className="text-gray-600 font-bold text-xl">/month</span>
                      </div>
                      
                      <div className="bg-purple-50 rounded-2xl p-4 mb-6 border-2 border-purple-200">
                        <p className="text-sm font-black text-purple-800 mb-2">Access to ALL 10+ Categories</p>
                        <p className="text-xs text-purple-700">Complete access for full-service contractors</p>
                      </div>
                      
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">ALL job categories included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Unlimited job applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Top priority in search results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Premium contractor badge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Featured homepage placement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Dedicated account manager</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 text-xl">✓</span>
                          <span className="text-sm font-semibold text-gray-700">Everything in Renovation Xbert</span>
                        </li>
                      </ul>
                      
                      <button 
                        onClick={() => handleTierSubscription('general')}
                        disabled={checkoutLoading !== null}
                        className="group/btn relative w-full overflow-hidden rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_100%]"></div>
                        <div className="relative px-6 py-4 text-white flex items-center justify-center gap-2">
                          {checkoutLoading === 'general' ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">👑</span>
                              <span>Get Started</span>
                              <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-gray-300">
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span className="font-semibold">No Hidden Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span className="font-semibold">Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span className="font-semibold">Switch Categories Monthly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span className="font-semibold">No Per-Lead Charges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
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
                
                <div className="overflow-x-auto">
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
                        <td className="text-center py-4 px-4 font-black text-purple-600">ALL 10+ Categories</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Job Applications</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Direct Messaging</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Profile Directory</td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-green-600">✓</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Priority in Search</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Featured Badge</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-4 font-semibold">Portfolio Showcase</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-2xl text-orange-600">✓</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Homepage Placement</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-4 font-semibold">Account Manager</td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4 bg-orange-50 rounded-b-xl"><span className="text-gray-400">—</span></td>
                        <td className="text-center py-4 px-4"><span className="text-2xl text-purple-600">✓</span></td>
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
    </Elements>
  );
}