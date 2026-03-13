"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FileText,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Camera,
  TrendingUp,
  Clock,
  BookOpen
} from "lucide-react";

export default function HomeownerDashboard() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    savedEstimates: 0,
    postedJobs: 0,
    activeProjects: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (authUser?.role !== "homeowner") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [authUser, isSignedIn]);

  const fetchStats = async () => {
    try {
      // Fetch saved estimates
      const estimatesRes = await fetch("/api/saved-projects");
      const estimatesData = await estimatesRes.json();
      
      // Fetch posted jobs
      const jobsRes = await fetch("/api/homeowner/jobs");
      const jobsData = await jobsRes.json();

      // Fetch real unread message count from notifications
      const notifRes = await fetch(`/api/notifications?userId=${authUser?.id}`);
      const notifData = await notifRes.json();
      const unreadMsgCount = (notifData.notifications || []).filter(
        (n: any) => !n.read && n.type === 'NEW_MESSAGE'
      ).length;

      setStats({
        savedEstimates: estimatesData.projects?.length || 0,
        postedJobs: jobsData.jobs?.length || 0,
        activeProjects: jobsData.jobs?.filter((j: any) => j.status === 'open').length || 0,
        unreadMessages: unreadMsgCount
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const dashboardCards = [
    {
      title: "Get AI Estimate",
      description: "Upload photos and get instant renovation quotes",
      href: "/",
      icon: Home,
      color: "from-rose-600 to-orange-600",
      stat: null
    },
    {
      title: "Renovation Cost Guides",
      description: "Explore real renovation costs across every GTA city",
      href: "/renovation-costs",
      icon: BookOpen,
      color: "from-teal-600 to-emerald-600",
      stat: "112 guides"
    },
    {
      title: "My Saved Estimates",
      description: "View and manage your saved project estimates",
      href: "/homeowner/saved-projects",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
      stat: stats.savedEstimates > 0 ? `${stats.savedEstimates} saved` : null
    },
    {
      title: "My Posted Jobs",
      description: "Track your posted jobs and contractor responses",
      href: "/homeowner/jobs",
      icon: Briefcase,
      color: "from-green-600 to-emerald-600",
      stat: stats.postedJobs > 0 ? `${stats.postedJobs} jobs` : null
    },
    {
      title: "Active Projects",
      description: "Monitor in-progress renovation projects",
      href: "/homeowner/jobs?filter=active",
      icon: TrendingUp,
      color: "from-purple-600 to-violet-600",
      stat: stats.activeProjects > 0 ? `${stats.activeProjects} active` : null
    },
    {
      title: "Messages",
      description: "Chat with contractors about your projects",
      href: "/messages",
      icon: MessageSquare,
      color: "from-indigo-600 to-blue-600",
      stat: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : null
    },
    {
      title: "AI Renovation Inspector",
      description: "Upload progress photos for AI quality check",
      href: "/ai-renovation-check",
      icon: Camera,
      color: "from-amber-600 to-orange-600",
      stat: "New!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 -mt-[var(--header-height,64px)] pt-[calc(var(--header-height,64px)+2rem)] pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Welcome back, {authUser?.name || 'Homeowner'}!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your renovation projects and estimates
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-rose-200 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>

                {/* Badge */}
                {card.stat && (
                  <div className="absolute top-0 right-0 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">
                    {card.stat}
                  </div>
                )}

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {card.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-rose-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  Go <span className="ml-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/create-lead"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Briefcase className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">Post a Project</div>
                <div className="text-sm text-rose-100">Get quotes from contractors</div>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <FileText className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">New Estimate</div>
                <div className="text-sm text-blue-100">Get instant AI quote</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
