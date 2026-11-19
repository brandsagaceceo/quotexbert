"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function SubscriptionSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setVerificationError(null);
    if (!sessionId) {
      setVerificationError("No checkout session was provided. Your subscription has not been verified.");
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`/api/contractor/verify-subscription?session_id=${encodeURIComponent(sessionId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Subscription verification returned HTTP ${response.status}`);
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("success" in data) || data.success !== true) {
          throw new Error("Subscription verification was not confirmed");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error verifying subscription:", error);
        setVerificationError("We could not confirm your subscription. Review your subscriptions before starting another checkout.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void verifySession();
    return () => controller.abort();
  }, [sessionId, attempt]);

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

  if (verificationError) {
    return (
      <div className="min-h-screen bg-rose-50 px-4 py-12">
        <div role="alert" className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-2xl font-bold text-[#800020]">Subscription not confirmed</h1>
          <p className="mb-6 text-slate-700">{verificationError}</p>
          <Link href="/contractor/subscriptions" className="font-semibold text-[#800020] underline">Review subscriptions</Link>
          {sessionId && <button className="ml-4 font-semibold text-[#800020] underline" onClick={() => setAttempt(value => value + 1)}>Retry verification</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 48px)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in">
          {/* Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <CheckCircle className="relative w-24 h-24 text-green-500 mx-auto animate-bounce" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#800020] mb-4">
            Subscription Activated!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8">
            Your contractor subscription has been confirmed.
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
              className="inline-flex items-center justify-center gap-2 bg-[#800020] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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

          <p className="mt-8 text-sm text-slate-500">
            Review your current subscription details on the <Link href="/contractor/subscriptions" className="underline">subscriptions page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
