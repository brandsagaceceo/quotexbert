"use client";

import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAILS = ["brandsagaceo@gmail.com", "quotexbert@gmail.com"];
import LoadingState from "@/components/ui/LoadingState";
import {
  ChartBarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  EyeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface DashboardData {
  generatedAt: string;
  overview: {
    users: {
      total: number;
      homeowners: number;
      contractors: number;
      new: number;
    };
    jobs: {
      total: number;
      new: number;
    };
    quotes: {
      total: number;
      new: number;
      pending: number;
    };
    subscriptions: {
      total: number;
      active: number;
      pastDue: number;
    };
    revenue: {
      total: number;
      transactions: number;
    };
    credits: {
      total: number;
      transactions: number;
    };
    pending: {
      applications: number;
      transactions: number;
      subscriptions: number;
      seoReview: number;
    };
    seo: {
      total: number;
      draft: number;
      approved: number;
      published: number;
      failed: number;
    };
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const { authUser: user, authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Guard: only admin emails may access this page
  useEffect(() => {
    if (!authLoading && (!user || !ADMIN_EMAILS.includes(user.email || ""))) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchDashboard = useCallback(async () => {
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "/api/admin/usage?metric=overview&period=30d",
        {
          cache: "no-store",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load administrator metrics");
      }
      setStats(data);
    } catch (cause) {
      console.error("[ADMIN] Failed to load dashboard metrics:", cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load administrator metrics",
      );
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) void fetchDashboard();
  }, [authLoading, fetchDashboard]);

  const adminSections = [
    {
      title: "Leads Management",
      description: "View and manage all leads in the system",
      href: "/admin/leads",
      icon: BriefcaseIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Contractors",
      description: "Verify and manage contractor profiles",
      href: "/admin/contractors",
      icon: UserGroupIcon,
      color: "from-green-500 to-green-600",
    },
    {
      title: "AI Blog Studio",
      description:
        "Review real SEO drafts and explicitly publish approved articles",
      href: "/admin/blog",
      icon: Cog6ToothIcon,
      color: "from-orange-600 to-orange-600",
    },
    {
      title: "Lead Pricing",
      description: "Configure lead pricing and categories",
      href: "/admin/lead-pricing",
      icon: CurrencyDollarIcon,
      color: "from-rose-500 to-rose-700",
    },
    {
      title: "Analytics & Insights",
      description: "View detailed analytics and insights",
      href: "/admin/insights",
      icon: ChartBarIcon,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "System Monitoring",
      description: "Monitor system performance and usage",
      href: "/admin/monitoring",
      icon: EyeIcon,
      color: "from-red-500 to-red-600",
    },
  ];

  if (authLoading || loading) {
    return (
      <LoadingState
        fullScreen
        title="Loading admin dashboard"
        subtitle="Fetching platform metrics and recent activity"
      />
    );
  }

  const formatRevenue = (amount: number) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#800020] mb-4">
            QuoteXbert Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Manage your platform, users, and business operations
          </p>
          {user && (
            <div className="mt-4 text-sm text-slate-500">
              Logged in as: <span className="font-medium">{user.email}</span>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
          >
            <p className="font-semibold">
              Administrator metrics are unavailable
            </p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              className="mt-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 text-sm font-medium">
                    Total Leads
                  </p>
                  <p className="text-3xl font-bold text-rose-950">
                    {stats.overview.jobs.total}
                  </p>
                  <p className="mt-1 text-xs text-rose-700">
                    +{stats.overview.jobs.new} in the last 30 days
                  </p>
                </div>
                <BriefcaseIcon className="h-8 w-8 text-rose-700" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Contractors
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats.overview.users.contractors}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50/80 to-rose-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 text-sm font-medium">
                    Homeowners
                  </p>
                  <p className="text-3xl font-bold text-rose-950">
                    {stats.overview.users.homeowners}
                  </p>
                  <p className="mt-1 text-xs text-rose-700">
                    {stats.overview.users.total} total accounts · +
                    {stats.overview.users.new} new
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-rose-700" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    Completed revenue
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {formatRevenue(stats.overview.revenue.total)}
                  </p>
                  <p className="mt-1 text-xs text-orange-700">
                    {stats.overview.revenue.transactions} in the last 30 days
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-slate-600">Quotes</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.overview.quotes.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats.overview.quotes.pending} active · +
                {stats.overview.quotes.new} new
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-slate-600">
                Subscriptions
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.overview.subscriptions.active}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats.overview.subscriptions.total} total ·{" "}
                {stats.overview.subscriptions.pastDue} past due
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-slate-600">
                Credit transactions
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.overview.credits.transactions}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatRevenue(stats.overview.credits.total)} recorded in the
                last 30 days
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-slate-600">
                Pending actions
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.overview.pending.applications +
                  stats.overview.pending.transactions +
                  stats.overview.pending.subscriptions +
                  stats.overview.pending.seoReview}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats.overview.pending.applications} applications ·{" "}
                {stats.overview.pending.transactions} transactions ·{" "}
                {stats.overview.pending.seoReview} SEO
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-slate-600">SEO activity</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.overview.seo.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats.overview.seo.draft} drafts ·{" "}
                {stats.overview.seo.approved} approved ·{" "}
                {stats.overview.seo.published} published
              </p>
            </div>
          </div>
        )}

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group block"
            >
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${section.color} mr-4`}
                  >
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-orange-700 transition-colors">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                  {section.description}
                </p>
                <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700 transition-colors">
                  Access →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        {stats && (
          <div className="bg-gradient-to-br from-slate-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              Recent Activity
            </h3>
            {stats.recentActivity.length === 0 ? (
              <p className="text-slate-600">
                No jobs, accounts or transactions were recorded in the last 30
                days.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0"
                  >
                    <div>
                      <p className="text-slate-900 font-medium">
                        {activity.description}
                      </p>
                      <p className="text-slate-500 text-sm capitalize">
                        {activity.type} • {activity.status} •{" "}
                        {new Date(activity.timestamp).toLocaleString("en-CA")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-5 text-xs text-slate-500">
              Database snapshot generated{" "}
              {new Date(stats.generatedAt).toLocaleString("en-CA")}. No sample
              activity is shown.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
