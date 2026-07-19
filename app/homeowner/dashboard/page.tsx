// LIVE PRODUCTION ROUTE — /homeowner/dashboard
// Homeowner dashboard: overview of jobs, estimates, activity.
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
  const [statsLoaded, setStatsLoaded] = useState(false);
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
      setStatsLoaded(true);
    } catch (error) {
      console.error("Error fetching stats:");
      setStatsLoaded(true);
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
    <div className="min-h-screen bg-gray-50 -mt-[var(--header-height,64px)] pt-[calc(var(--header-height,64px)+1.25rem)] sm:pt-[calc(var(--header-height,64px)+1.75rem)]" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 tracking-tight">
            Welcome back, {authUser?.name || 'Homeowner'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your renovation projects and estimates
          </p>
        </div>

        {/* First-time onboarding banner */}
        {statsLoaded && stats.postedJobs === 0 && (
          <div className="mb-6 bg-[#800020] rounded-xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🏠</span>
                <h2 className="text-lg font-bold">Ready to start your renovation?</h2>
              </div>
              <p className="text-sm text-white/80 leading-snug">
                Get a free AI estimate, then post your project to get quotes from verified local contractors — it only takes 2 minutes.
              </p>
            </div>
            <Link
              href="/"
              className="flex-shrink-0 bg-white hover:bg-gray-50 text-[#800020] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm hover:shadow whitespace-nowrap"
            >
              Get AI Estimate →
            </Link>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-rose-200 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${card.color} mb-3 group-hover:-translate-y-0.5 transition-transform duration-200`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>

                {/* Badge */}
                {card.stat && (
                  <div className="absolute top-0 right-0 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">
                    {card.stat}
                  </div>
                )}

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
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
        <div className="mt-8 bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:shadow-md transition-all duration-200"
            >
              <FileText className="w-6 h-6" />
              <div>
                <div className="font-bold text-base">Get AI Estimate</div>
                <div className="text-sm text-white/80">Instant quote, then post to job board</div>
              </div>
            </Link>

            <Link
              href="/create-lead"
              className="flex items-center gap-3 p-3.5 bg-[#800020] text-white rounded-lg hover:bg-[#600018] transition-colors"
            >
              <Briefcase className="w-6 h-6" />
              <div>
                <div className="font-bold text-base">Post a Job Manually</div>
                <div className="text-sm text-white/80">Skip the AI and fill out the form yourself</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
