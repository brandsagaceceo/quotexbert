// LIVE PRODUCTION ROUTE — /contractor/dashboard
// Contractor dashboard: overview, metrics, quick links.
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingState from "@/components/ui/LoadingState";
import { ContractorMetricsCard } from "@/components/ContractorMetricsCard";
import { ContractorOnboardingChecklist } from "@/components/ContractorOnboardingChecklist";
import { formatDistanceToNow } from "date-fns";
import { calculateUrgency } from "@/lib/urgency";
import { 
  Bell, 
  Briefcase, 
  MapPin, 
  FileText, 
  CreditCard, 
  Settings,
  TrendingUp,
  MessageSquare,
  Calendar,
  CheckCircle
} from "lucide-react";

const TRUST_MESSAGES = [
  "✨ New jobs posted daily in your area",
  "⚡ Be first to respond — fast replies win more jobs",
  "🎯 No bidding wars — direct access to homeowners",
];

export default function ContractorDashboard() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contractorProfile, setContractorProfile] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingQuotes, setPendingQuotes] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (authUser?.role !== "contractor") {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [authUser, isSignedIn]);

  // Rotate trust banner every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (i + 1) % TRUST_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch contractor profile
      const profileRes = await fetch(`/api/contractors/${authUser?.id}`);
      const profileData = await profileRes.json();
      
      if (profileData.success) {
        setContractorProfile(profileData.contractor);
      }

      // Fetch recent jobs (last 5)
      const jobsRes = await fetch("/api/jobs");
      const jobsData = await jobsRes.json();
      
      if (jobsData.success) {
        setRecentJobs(jobsData.jobs.slice(0, 5));
      }

      // Fetch real unread message count
      const notifRes = await fetch(`/api/notifications?userId=${authUser?.id}`);
      const notifData = await notifRes.json();
      const unreadMsgCount = (notifData.notifications || []).filter(
        (n: any) => !n.read && n.type === 'NEW_MESSAGE'
      ).length;
      setUnreadMessages(unreadMsgCount);
      setPendingQuotes(0);

      // Auto-mark onboarding checklist items from fetched data
      if (typeof window !== 'undefined') {
        if (unreadMsgCount > 0) {
          localStorage.setItem('checklist_sent_message', '1');
        }
        const hasAccepted = (jobsData.jobs || []).some(
          (j: any) => j.status === 'claimed' || j.status === 'completed'
        );
        if (hasAccepted) {
          localStorage.setItem('checklist_accepted_job', '1');
        }
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const quickActions = [
    {
      label: "Browse Jobs",
      href: "/contractor/jobs",
      icon: Briefcase,
      color: "bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700",
      description: "Find new renovation projects",
    },
    {
      label: "My Accepted Jobs",
      href: "/contractor/jobs?filter=accepted",
      icon: CheckCircle,
      color: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      description: "View your active projects",
    },
    {
      label: "Demand Heat Map",
      href: "/contractor/leads-map",
      icon: MapPin,
      color: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      description: "See where jobs are concentrated",
    },
    {
      label: "Estimate for Customer",
      href: "/",
      icon: FileText,
      color: "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700",
      description: "Generate an AI estimate to share",
    },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      color: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      description: "Chat with homeowners",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      label: "My Performance",
      href: "/contractor/profile",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
      description: "View metrics & reviews",
    },
    {
      label: "Subscription",
      href: "/contractor/subscriptions",
      icon: CreditCard,
      color: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
      description: "Manage your plan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {contractorProfile?.companyName || authUser?.name || "Contractor"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your performance overview and quick actions
          </p>
        </div>

        {/* Trust / Motivation Banner */}
        <div className="mb-6 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-xl px-4 py-3 text-center select-none">
          <p className="text-sm font-medium text-rose-800">
            {TRUST_MESSAGES[bannerIndex]}
          </p>
        </div>

        {/* Verification Banner */}
        {contractorProfile && !contractorProfile.verified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Verification Pending
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Complete your profile and submit for verification to access more features and build trust with clients.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Checklist */}
        <ContractorOnboardingChecklist />

        {/* Performance Metrics */}
        {authUser?.id && (
          <div className="mb-8">
            <ContractorMetricsCard contractorId={authUser.id} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{action.label}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                    <Icon className="h-8 w-8 opacity-80" />
                  </div>
                  {action.badge !== undefined && action.badge > 0 && (
                    <span className="absolute top-3 right-3 bg-white text-gray-900 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                      {action.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
              <Link 
                href="/contractor/jobs" 
                className="text-rose-700 hover:text-rose-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/contractor/jobs?highlight=${job.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {calculateUrgency(job.createdAt) === "hot" && (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            NEW
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                        <span>📍 {job.city || job.location || "Location not specified"}</span>
                        {job.budget && <span>💰 {job.budget}</span>}
                        {job.category && <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs">{job.category}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs text-gray-400 block">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-rose-600 font-medium mt-1 block">View Job →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentJobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet in your area</h3>
            <p className="text-gray-500 mb-2">
              We&apos;ll notify you as soon as new jobs are posted nearby.
            </p>
            <p className="text-sm text-gray-400 mb-6">New homeowner projects are added daily.</p>
            <Link
              href="/contractor/jobs"
              className="inline-flex items-center px-6 py-3 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors font-semibold"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Browse All Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
