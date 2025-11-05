'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from "next/link";

export default function DashboardPage() {
  const { authUser, isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to QuoteXpert</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
          <Link 
            href="/sign-in"
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {authUser?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h3>
          <p className="text-gray-600 mb-4">Welcome to your QuoteXpert dashboard!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/create-lead"
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all text-center block"
            >
               Post New Job
            </Link>
            <Link
              href="/contractor/jobs"
              className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
               Browse Jobs
            </Link>
            <Link
              href="/showcase"
              className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
               Platform Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
