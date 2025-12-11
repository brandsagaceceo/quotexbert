"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'billing'>('subscriptions');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('all');

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

          {/* Pricing Tiers - 3D BUBBLE DESIGN */}
          <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
            {/* Background Decorative Bubbles */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-3">
                  Subscription Pricing Tiers
                </h2>
                <p className="text-lg text-gray-700 font-medium">Choose the categories that match your expertise. Pay per category, cancel anytime.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Basic Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-green-300">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-3xl font-black">B</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Basic</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">$15</span>
                        <span className="text-gray-600 font-semibold">/mo</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">per category</p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Perfect for starting out</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standard Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-rose-300">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-3xl font-black">S</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Standard</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-rose-500 to-pink-700 bg-clip-text text-transparent">$25</span>
                        <span className="text-gray-600 font-semibold">/mo</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">per category</p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Most popular choice</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-purple-300">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-3xl font-black">P</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Premium</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-purple-500 to-indigo-700 bg-clip-text text-transparent">$49</span>
                        <span className="text-gray-600 font-semibold">/mo</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">per category</p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">For serious contractors</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Tier */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-yellow-300">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-3xl font-black">P</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Professional</h3>
                      <div className="mb-3">
                        <span className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-700 bg-clip-text text-transparent">$79</span>
                        <span className="text-gray-600 font-semibold">/mo</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">per category</p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Maximum lead access</p>
                      </div>
                    </div>
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
                <h2 className="text-xl font-bold text-gray-900">Your Active Subscriptions</h2>
                <p className="text-sm text-gray-700 mt-1">Manage and monitor your category subscriptions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Monthly Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Leads Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Next Billing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((subscription) => {
                      const categoryConfig = getCategoryById(subscription.category);
                      return (
                        <tr key={subscription.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {categoryConfig?.name || subscription.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              subscription.status === 'active' 
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : subscription.status === 'past_due'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {subscription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">
                              ${subscription.monthlyPrice.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              <span className="font-bold text-rose-600">{subscription.leadsThisMonth}</span>
                              <span className="text-gray-500"> / {subscription.monthlyLeadLimit}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {subscription.nextBillingDate 
                              ? new Date(subscription.nextBillingDate).toLocaleDateString()
                              : '-'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Simplified Filters */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filter Categories</h3>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriceFilter('all');
                    setCategoryGroupFilter('all');
                  }}
                  className="text-sm text-rose-600 hover:text-rose-800 font-medium underline"
                >
                  Clear Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Search</label>
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Not Subscribed</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Basic ($15)</option>
                    <option value="medium">Standard-Premium ($25-$49)</option>
                    <option value="high">Professional ($79)</option>
                  </select>
                </div>

                {/* Category Group Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Category Group</label>
                  <select
                    value={categoryGroupFilter}
                    onChange={(e) => setCategoryGroupFilter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="all">All Groups</option>
                    {CATEGORY_GROUPS.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
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
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'subscriptions'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Subscriptions
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'billing'
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Billing History
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Available Categories */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-xl font-bold text-gray-900">Browse Available Categories</h2>
                  <p className="text-sm text-gray-700 mt-1">Subscribe to categories matching your expertise. Each category is billed separately.</p>
                </div>
                <div className="p-6">
                  {/* Category Groups */}
                  <div className="space-y-8">
                    {getFilteredCategoryGroups().length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-gray-400 text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters to see more categories.</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setPriceFilter('all');
                            setCategoryGroupFilter('all');
                          }}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      getFilteredCategoryGroups().map((group) => (
                        <div key={group.id}>
                          <div className="mb-4 pb-2 border-b-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.categories.map((category) => {
                              const subscription = subscriptions.find(sub => sub.category === category.id);
                              const isSubscribed = subscribedCategories.has(category.id);
                              
                              const getPriceColor = (price: number) => {
                                switch(price) {
                                  case 15: return 'bg-green-500 text-white border-green-600';
                                  case 25: return 'bg-rose-500 text-white border-rose-600';
                                  case 49: return 'bg-purple-500 text-white border-purple-600';
                                  case 79: return 'bg-yellow-500 text-white border-yellow-600';
                                  default: return 'bg-gray-500 text-white border-gray-600';
                                }
                              };

                              const getTierName = (price: number) => {
                                switch(price) {
                                  case 15: return 'Basic';
                                  case 25: return 'Standard';
                                  case 49: return 'Premium';
                                  case 79: return 'Professional';
                                  default: return 'Custom';
                                }
                              };
                            
                            return (
                              <div key={category.id} className={`border-2 rounded-lg p-5 hover:shadow-lg transition-all ${
                                isSubscribed ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                              }`}>
                                <div className="mb-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-gray-900 text-base flex-1 pr-2">{category.name}</h4>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1.5 text-sm font-bold rounded-lg border-2 ${getPriceColor(category.monthlyPrice)}`}>
                                      ${category.monthlyPrice}/mo
                                    </span>
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      {getTierName(category.monthlyPrice)} Tier
                                    </span>
                                  </div>
                                </div>

                                {isSubscribed && subscription ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        subscription.status === 'active' 
                                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                          : subscription.status === 'past_due'
                                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                          : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                      }`}>
                                        ✓ {subscription.status.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-700 bg-white p-3 rounded-lg border">
                                      <p className="font-semibold mb-1">
                                        Leads: <span className="text-rose-600">{subscription.leadsThisMonth}</span> / {subscription.monthlyLeadLimit}
                                      </p>
                                      {subscription.nextBillingDate && (
                                        <p className="text-gray-600">
                                          Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleCancel(subscription.id)}
                                      className="w-full px-4 py-2 text-sm font-semibold border-2 border-red-400 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                      disabled={loading}
                                    >
                                      {subscription.cancelAtPeriodEnd ? 'Canceling at period end' : 'Cancel Subscription'}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSubscribe(category.id)}
                                    className="group relative w-full overflow-hidden rounded-xl font-bold text-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                    disabled={loading}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 bg-[length:200%_100%] animate-gradient"></div>
                                    <div className="relative px-4 py-3 text-white flex items-center justify-center gap-2">
                                      <span className="text-lg">✨</span>
                                      <span>Subscribe Now</span>
                                      <span className="text-lg">✨</span>
                                    </div>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                    )}
                  </div>
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