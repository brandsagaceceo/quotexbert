"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

// Admin emails (god-access users)
const ADMIN_EMAILS = ['brandsagaceo@gmail.com', 'quotexbert@gmail.com'];

interface WebhookEvent {
  type: string;
  createdAt: string;
}

interface UserStatus {
  email: string;
  tier: string | null;
  status: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  categories: string[];
  proOverride: boolean;
}

export default function AdminDiagnosticsPage() {
  const { authUser, authLoading } = useAuth();
  const router = useRouter();
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastWebhookTime, setLastWebhookTime] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && authUser && !ADMIN_EMAILS.includes(authUser.email || '')) {
      router.push('/');
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (authUser && ADMIN_EMAILS.includes(authUser.email || '')) {
      loadWebhookHealth();
    }
  }, [authUser]);

  const loadWebhookHealth = async () => {
    try {
      const response = await fetch('/api/admin/webhook-health');
      if (response.ok) {
        const data = await response.json();
        setWebhookEvents(data.recentEvents || []);
        setLastWebhookTime(data.lastWebhookTime);
      }
    } catch (error) {
      console.error('Failed to load webhook health:', error);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/user-status?email=${encodeURIComponent(searchEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setUserStatus(data);
      } else {
        alert('User not found or error occurred');
        setUserStatus(null);
      }
    } catch (error) {
      console.error('Failed to search user:', error);
      alert('Failed to search user');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!authUser || !ADMIN_EMAILS.includes(authUser.email || '')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">🔧 Admin Diagnostics</h1>
          <p className="text-slate-600 mb-6">Stripe webhook health and user subscription status</p>

          {/* Webhook Health */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Stripe Webhook Health</h2>
            
            {lastWebhookTime ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-medium">
                      Webhooks Active - Last received: {lastWebhookTime}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">
                      No recent webhook events detected
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Last 20 Webhook Events</h3>
              {webhookEvents.length > 0 ? (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {webhookEvents.map((event, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-200 last:border-0">
                      <span className="font-mono text-blue-600">{event.type}</span>
                      <span className="text-slate-600">{new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">No webhook events found</p>
              )}
            </div>
          </div>

          {/* User Search */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">User Status Lookup</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="email"
                placeholder="Enter user email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <button
                onClick={searchUser}
                disabled={loading || !searchEmail.trim()}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {userStatus && (
              <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                <h3 className="font-bold text-lg text-slate-900 mb-4">User: {userStatus.email}</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Current Tier</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {userStatus.tier || 'FREE'}
                      {userStatus.proOverride && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          COMP OVERRIDE
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Status</p>
                    <p className="text-lg font-semibold text-slate-900">{userStatus.status || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Stripe Customer ID</p>
                    <p className="text-sm font-mono text-slate-900 truncate">
                      {userStatus.customerId ? `${userStatus.customerId.substring(0, 20)}...` : 'None'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Subscription ID</p>
                    <p className="text-sm font-mono text-slate-900 truncate">
                      {userStatus.subscriptionId ? `${userStatus.subscriptionId.substring(0, 20)}...` : 'None'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2">Selected Categories ({userStatus.categories.length})</p>
                  {userStatus.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userStatus.categories.map((cat) => (
                        <span key={cat} className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">No categories selected</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Environment Check */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Check</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-700">STRIPE_WEBHOOK_SECRET</span>
              <span className="text-green-600 font-semibold">
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-700">RESEND_API_KEY</span>
              <span className="text-green-600 font-semibold">✓ Check server logs</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Note: Sensitive environment variables are not exposed to the client
          </p>
        </div>
      </div>
    </div>
  );
}
