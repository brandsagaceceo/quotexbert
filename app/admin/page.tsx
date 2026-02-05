"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalLeads: number;
  totalContractors: number;
  totalUsers: number;
  revenue: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const { authUser: user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we'll show mock data
    // In production, you'd fetch real stats from your API
    setTimeout(() => {
      setStats({
        totalLeads: 156,
        totalContractors: 89,
        totalUsers: 245,
        revenue: 12450,
        recentActivity: [
          { id: "1", type: "lead", description: "New kitchen renovation lead posted", timestamp: "2 hours ago" },
          { id: "2", type: "contractor", description: "Contractor verified: ABC Plumbing", timestamp: "4 hours ago" },
          { id: "3", type: "payment", description: "$45 payment processed", timestamp: "6 hours ago" },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const adminSections = [
    {
      title: "Leads Management",
      description: "View and manage all leads in the system",
      href: "/admin/leads",
      icon: BriefcaseIcon,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Contractors",
      description: "Verify and manage contractor profiles",
      href: "/admin/contractors",
      icon: UserGroupIcon,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Blog Management",
      description: "Create and manage blog posts for SEO",
      href: "/admin/blog",
      icon: Cog6ToothIcon,
      color: "from-orange-600 to-orange-600"
    },
    {
      title: "Lead Pricing",
      description: "Configure lead pricing and categories",
      href: "/admin/lead-pricing",
      icon: CurrencyDollarIcon,
      color: "from-rose-500 to-rose-700"
    },
    {
      title: "Analytics & Insights",
      description: "View detailed analytics and insights",
      href: "/admin/insights",
      icon: ChartBarIcon,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "System Monitoring",
      description: "Monitor system performance and usage",
      href: "/admin/monitoring",
      icon: EyeIcon,
      color: "from-red-500 to-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 to-orange-700 bg-clip-text text-transparent mb-4">
            QuotexBert Admin Dashboard
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

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 text-sm font-medium">Total Leads</p>
                  <p className="text-3xl font-bold text-rose-950">{stats.totalLeads}</p>
                </div>
                <BriefcaseIcon className="h-8 w-8 text-rose-700" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Contractors</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalContractors}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50/80 to-rose-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-rose-950">{stats.totalUsers}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-rose-700" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-orange-900">${stats.revenue.toLocaleString()}</p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
              </div>
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
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${section.color} mr-4`}>
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
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
                  <div>
                    <p className="text-slate-900 font-medium">{activity.description}</p>
                    <p className="text-slate-500 text-sm capitalize">{activity.type} • {activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

