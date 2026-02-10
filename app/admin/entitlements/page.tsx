'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ADMIN_EMAILS = ['brandsagaceo@gmail.com', 'quotexbert@gmail.com'];

interface WebhookLog {
  id: string;
  type: string;
  eventId: string;
  processed: boolean;
  error: string | null;
  createdAt: string;
}

interface UserEntitlements {
  userId: string;
  email: string;
  tier: string;
  isPro: boolean;
  isGod: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  currentPeriodEnd: string | null;
  categoryLimit: number;
  selectedCategories: string[];
  canBrowseJobs: boolean;
  canAcceptJobs: boolean;
  canPickCategories: boolean;
  canViewAllLeads: boolean;
  features: string[];
}

export default function EntitlementsDebugPage() {
  const { authUser: user, isSignedIn } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<UserEntitlements | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [searchUserId, setSearchUserId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (!isSignedIn || !user) {
      router.push('/sign-in');
      return;
    }

    const isAdmin = ADMIN_EMAILS.some(
      email => email.toLowerCase() === user.email.toLowerCase()
    );

    if (!isAdmin) {
      router.push('/');
      return;
    }

    setAuthorized(true);
    // Load current user's entitlements
    loadEntitlements(user.id);
    loadWebhookLogs();
  }, [user, isSignedIn, router]);

  async function loadEntitlements(userId: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/entitlements?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setEntitlements(data);
      }
    } catch (error) {
      console.error('Failed to load entitlements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadWebhookLogs() {
    try {
      const response = await fetch('/api/admin/webhook-logs');
      if (response.ok) {
        const data = await response.json();
        setWebhookLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load webhook logs:', error);
    }
  }

  async function searchUser() {
    if (searchUserId) {
      await loadEntitlements(searchUserId);
    } else if (searchEmail) {
      try {
        const response = await fetch(`/api/admin/user-lookup?email=${encodeURIComponent(searchEmail)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.userId) {
            await loadEntitlements(data.userId);
          } else {
            alert('User not found');
          }
        }
      } catch (error) {
        console.error('Failed to look up user:', error);
        alert('Error looking up user');
      }
    }
  }

  function maskId(id: string | null): string {
    if (!id) return 'N/A';
    if (id.length <= 6) return id;
    return '...' + id.slice(-6);
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Entitlements Debug Dashboard</h1>
          <p className="text-gray-600">Admin-only visibility into subscription tiers, permissions, and webhook events</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search User</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="User ID..."
              value={searchUserId}
              onChange={(e) => {
                setSearchUserId(e.target.value);
                setSearchEmail('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <span className="text-gray-500 self-center">OR</span>
            <input
              type="email"
              placeholder="Email..."
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                setSearchUserId('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <button
              onClick={searchUser}
              className="px-6 py-2 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Entitlements Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading entitlements...</p>
          </div>
        ) : entitlements ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Entitlements</h2>
            
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-bold">{entitlements.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">User ID:</span>
                <p className="font-mono text-sm">{maskId(entitlements.userId)}</p>
              </div>
            </div>

            {/* Tier & Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Current Tier</span>
                <p className="text-2xl font-bold text-rose-700">{entitlements.tier}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Pro Status</span>
                <p className="text-2xl font-bold text-green-700">{entitlements.isPro ? '✓ Yes' : '✗ No'}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">God Mode</span>
                <p className="text-2xl font-bold text-purple-700">{entitlements.isGod ? '👑 Yes' : '✗ No'}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Subscription Status</span>
                <p className="text-lg font-bold text-blue-700">{entitlements.subscriptionStatus || 'None'}</p>
              </div>
            </div>

            {/* Stripe IDs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Stripe Customer ID</span>
                <p className="font-mono text-sm">{maskId(entitlements.stripeCustomerId)}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Stripe Subscription ID</span>
                <p className="font-mono text-sm">{maskId(entitlements.stripeSubscriptionId)}</p>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Permissions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <PermissionBadge label="Browse Jobs" enabled={entitlements.canBrowseJobs} />
                <PermissionBadge label="Accept Jobs" enabled={entitlements.canAcceptJobs} />
                <PermissionBadge label="Pick Categories" enabled={entitlements.canPickCategories} />
                <PermissionBadge label="View All Leads" enabled={entitlements.canViewAllLeads} />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Categories ({entitlements.selectedCategories.length} / {entitlements.categoryLimit === 999 ? '∞' : entitlements.categoryLimit})
              </h3>
              <div className="flex flex-wrap gap-2">
                {entitlements.selectedCategories.length > 0 ? (
                  entitlements.selectedCategories.map((cat, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No categories selected</span>
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {entitlements.features.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Period End */}
            {entitlements.currentPeriodEnd && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <span className="text-sm text-yellow-800">
                  <strong>Current Period Ends:</strong> {new Date(entitlements.currentPeriodEnd).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Search for a user to view their entitlements</p>
          </div>
        )}

        {/* Webhook Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Webhook Events (Last 20)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {webhookLogs.length > 0 ? (
                  webhookLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.type}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{maskId(log.eventId)}</td>
                      <td className="px-4 py-3 text-sm">
                        {log.processed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Processed</span>
                        ) : log.error ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Error</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No webhook logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className={`p-3 rounded-lg text-center ${enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
      <div className="text-2xl mb-1">{enabled ? '✓' : '✗'}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}
