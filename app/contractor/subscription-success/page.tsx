'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { authUser: user, refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your subscription...');

  useEffect(() => {
    async function refreshEntitlements() {
      if (!user) {
        setStatus('error');
        setMessage('User not found. Please sign in.');
        setTimeout(() => router.push('/sign-in'), 2000);
        return;
      }

      try {
        // Wait a bit for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Force refresh user data from server
        if (refreshUser) {
          await refreshUser();
        }

        // Fetch fresh entitlements
        const response = await fetch(`/api/user/entitlements?userId=${user.id}`);
        
        if (response.ok) {
          const entitlements = await response.json();
          
          setStatus('success');
          setMessage('Subscription activated successfully! 🎉');

          // Redirect based on whether they need to select categories
          setTimeout(() => {
            if (entitlements.canPickCategories && entitlements.selectedCategories.length === 0) {
              // Redirect to profile to select categories
              router.push('/profile?tab=categories&welcome=true');
            } else {
              // Redirect to contractor jobs page
              router.push('/contractor/jobs');
            }
          }, 2000);
        } else {
          throw new Error('Failed to fetch entitlements');
        }
      } catch (error) {
        console.error('Error refreshing entitlements:', error);
        setStatus('error');
        setMessage('There was an issue loading your subscription. Please contact support if this persists.');
        // Still redirect to profile after error
        setTimeout(() => router.push('/profile'), 3000);
      }
    }

    refreshEntitlements();
  }, [user, router, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-700 to-orange-600 px-8 py-12 text-center">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            )}
            {status === 'success' && (
              <div className="text-6xl mb-4">🎉</div>
            )}
            {status === 'error' && (
              <div className="text-6xl mb-4">⚠️</div>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">
              {status === 'loading' && 'Processing...'}
              {status === 'success' && 'All Set!'}
              {status === 'error' && 'Oops!'}
            </h1>
          </div>

          {/* Content */}
          <div className="px-8 py-8 text-center">
            <p className="text-lg text-gray-700 mb-6">{message}</p>
            
            {status === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-800">
                    ✓ Subscription activated<br />
                    ✓ Entitlements updated<br />
                    ✓ Redirecting you now...
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-800">
                    If you were charged, your subscription is active.<br />
                    Check your profile or contact support.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full bg-gradient-to-r from-rose-700 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-800 hover:to-orange-700 transition-all"
                >
                  Go to Profile
                </button>
              </div>
            )}

            {status === 'loading' && (
              <div className="animate-pulse text-gray-500 text-sm">
                Please wait while we activate your subscription...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
