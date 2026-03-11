"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingState from "@/components/ui/LoadingState";
import { ContractorMetricsCard } from "@/components/ContractorMetricsCard";
import { 
  Bell, 
  Briefcase, 
  MapPin, 
  FileText, 
  CreditCard, 
  Settings,
  TrendingUp,
  MessageSquare,
  Calendar
} from "lucide-react";

export default function ContractorDashboard() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contractorProfile, setContractorProfile] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingQuotes, setPendingQuotes] = useState(0);

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

      // Note: In production, fetch actual unread messages and pending quotes
      // For now, using placeholder values
      setUnreadMessages(0);
      setPendingQuotes(0);

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
      color: "bg-blue-500 hover:bg-blue-600",
      description: "View available jobs in your area",
    },
    {
      label: "Leads Map",
      href: "/contractor/leads-map",
      icon: MapPin,
      color: "bg-green-500 hover:bg-green-600",
      description: "See jobs on interactive map",
    },
    {
      label: "My Quotes",
      href: "/contractor/quotes",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Manage your quotes",
      badge: pendingQuotes > 0 ? pendingQuotes : undefined,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Chat with clients",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      label: "Portfolio",
      href: "/contractor/portfolio",
      icon: TrendingUp,
      color: "bg-indigo-500 hover:bg-indigo-600",
      description: "Showcase your work",
    },
    {
      label: "Subscription",
      href: "/contractor/subscriptions",
      icon: CreditCard,
      color: "bg-rose-500 hover:bg-rose-600",
      description: "Manage your plan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {contractorProfile?.companyName || authUser?.name || "Contractor"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your performance overview and quick actions
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
                  href={`/contractor/jobs`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>📍 {job.city || "Location not specified"}</span>
                        {job.budget && <span>💰 {job.budget}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-4">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentJobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing available jobs to grow your business
            </p>
            <Link
              href="/contractor/jobs"
              className="inline-flex items-center px-6 py-3 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
