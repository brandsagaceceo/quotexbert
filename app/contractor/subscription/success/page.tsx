"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Verify the session and update user's subscription
      verifySession();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifySession = async () => {
    try {
      const response = await fetch(`/api/contractor/verify-subscription?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Subscription verified:", data);
      }
    } catch (error) {
      console.error("Error verifying subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in">
          {/* Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <CheckCircle className="relative w-24 h-24 text-green-500 mx-auto animate-bounce" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-4">
            Subscription Activated!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8">
            Your payment was successful and your contractor subscription is now active.
          </p>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold text-slate-900">What's Next?</h2>
            </div>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Start Receiving Leads</h3>
                  <p className="text-sm text-slate-600">You'll now receive job notifications in your selected categories</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Complete Your Profile</h3>
                  <p className="text-sm text-slate-600">Add your portfolio and services to attract more clients</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Browse Available Jobs</h3>
                  <p className="text-sm text-slate-600">Check out the job board and submit quotes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Go to Profile
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/contractor/jobs"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-rose-600 text-rose-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-rose-50 transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Confirmation Email Notice */}
          <p className="mt-8 text-sm text-slate-500">
            A confirmation email has been sent to your inbox with your subscription details.
          </p>
        </div>
      </div>
    </div>
  );
}
