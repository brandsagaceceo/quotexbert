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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-3xl">📊</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-3xl">💰</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Total</p>
                  <p className="text-2xl font-bold text-gray-900">${totalMonthlyFees.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-3xl">🎯</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leads This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeSubscriptions.reduce((sum, sub) => sum + sub.leadsThisMonth, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Low ($15-$25)</option>
                    <option value="medium">Medium ($25-$49)</option>
                    <option value="high">High ($49+)</option>
                  </select>
                </div>

                {/* Category Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Group</label>
                  <select
                    value={categoryGroupFilter}
                    onChange={(e) => setCategoryGroupFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Groups</option>
                    {CATEGORY_GROUPS.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriceFilter('all');
                    setCategoryGroupFilter('all');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
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
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Available Categories</h2>
                  <p className="text-sm text-gray-600">Subscribe to categories to access leads. Pricing varies by category tier.</p>
                </div>
                <div className="p-6">
                  {/* Price Tier Legend */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Pricing Tiers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Basic - $15/month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                        <span>Standard - $25/month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span>Premium - $49/month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Professional - $79/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Groups */}
                  <div className="space-y-8">
                    {getFilteredCategoryGroups().length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
                        <p className="text-gray-600">Try adjusting your filters to see more categories.</p>
                      </div>
                    ) : (
                      getFilteredCategoryGroups().map((group) => (
                        <div key={group.id}>
                          <div className="mb-4">
                            <h3 className="text-md font-semibold text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.categories.map((category) => {
                              const subscription = subscriptions.find(sub => sub.category === category.id);
                              const isSubscribed = subscribedCategories.has(category.id);
                              
                              const getPriceColor = (price: number) => {
                                switch(price) {
                                  case 15: return 'bg-green-100 text-green-800';
                                  case 25: return 'bg-rose-100 text-rose-800';
                                  case 49: return 'bg-purple-100 text-purple-800';
                                  case 79: return 'bg-yellow-100 text-yellow-800';
                                  default: return 'bg-gray-100 text-gray-800';
                                }
                              };
                            
                            return (
                              <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                                      <span className={`px-2 py-1 text-xs rounded-full ${getPriceColor(category.monthlyPrice)}`}>
                                        ${category.monthlyPrice}/mo
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {isSubscribed && subscription ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        subscription.status === 'active' 
                                          ? 'bg-green-100 text-green-800'
                                          : subscription.status === 'past_due'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {subscription.status}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <p>Leads this month: {subscription.leadsThisMonth}/{subscription.monthlyLeadLimit}</p>
                                      {subscription.nextBillingDate && (
                                        <p>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleCancel(subscription.id)}
                                      className="w-full px-3 py-1 text-xs border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                                      disabled={loading}
                                    >
                                      {subscription.cancelAtPeriodEnd ? 'Canceling at period end' : 'Cancel'}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSubscribe(category.id)}
                                    className="w-full px-3 py-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs rounded-md hover:from-rose-700 hover:to-orange-700 disabled:opacity-50"
                                    disabled={loading}
                                  >
                                    Subscribe
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

              {/* Current Subscriptions */}
              {subscriptions.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Your Subscriptions</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Fee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Leads Used
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Next Billing
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscriptions.map((subscription) => {
                          const categoryConfig = getCategoryById(subscription.category);
                          return (
                            <tr key={subscription.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {categoryConfig?.name || subscription.category}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  subscription.status === 'active' 
                                    ? 'bg-green-100 text-green-800'
                                    : subscription.status === 'past_due'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {subscription.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${subscription.monthlyPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {subscription.leadsThisMonth}/{subscription.monthlyLeadLimit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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