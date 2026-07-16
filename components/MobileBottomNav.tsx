"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Home,
  Search,
  MessageCircle,
  Briefcase,
  User,
  Plus,
  Bell,
  Sparkles,
  FileEdit,
  X,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, authUser } = useAuth();
  const [showPostChoice, setShowPostChoice] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Close the post-job choice sheet whenever navigation happens
  useEffect(() => {
    setShowPostChoice(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSignedIn || !authUser?.id) return;

    const fetchUnread = () => {
      fetch(`/api/notifications?userId=${authUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Use server-computed unreadCount directly — avoids being limited by client-side take:100
          setUnreadCount(data.unreadCount ?? 0);
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);

    // Clear badge immediately when the notifications page marks all as read
    const handleAllRead = () => setUnreadCount(0);
    window.addEventListener('notifications:allRead', handleAllRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications:allRead', handleAllRead);
    };
  }, [isSignedIn, authUser?.id]);

  useEffect(() => {
    if (!isSignedIn || !authUser?.id) return;
    const fetchMessageUnread = () => {
      fetch(`/api/threads?userId=${authUser.id}`)
        .then((r) => r.json())
        .then((data) => {
          const total: number = (data.threads ?? []).reduce(
            (sum: number, t: { unreadCount?: number }) => sum + (t.unreadCount ?? 0),
            0
          );
          setUnreadMessageCount(total);
        })
        .catch(() => {});
    };
    fetchMessageUnread();
    const interval = setInterval(fetchMessageUnread, 30000);
    return () => clearInterval(interval);
  }, [isSignedIn, authUser?.id]);

  if (!isSignedIn || !authUser) {
    return null;
  }

  if (authUser.role === "contractor") {
    const contractorItems = [
      { href: "/", label: "Home", icon: Home, active: pathname === "/" },
      { href: "/contractor/jobs", label: "Jobs", icon: Briefcase, active: pathname.startsWith("/contractor/jobs") },
      { href: "/notifications", label: "Alerts", icon: Bell, active: pathname === "/notifications", badge: unreadCount },
      { href: "/messages", label: "Messages", icon: MessageCircle, active: pathname === "/messages", badge: unreadMessageCount },
      { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
    ];
    return (
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", "--bottom-nav-height": "56px" } as React.CSSProperties}
      >
        <div className="grid grid-cols-5 h-14">
          {contractorItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center h-full transition-colors ${
                  item.active ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5 shrink-0" />
                  {"badge" in item && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-rose-600 text-white text-[10px] font-bold rounded-full leading-none">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] mt-0.5 font-medium leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Homeowner: Home | Jobs | [Post Job center] | Messages | Profile
  const leftItems = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    { href: "/notifications", label: "Alerts", icon: Bell, active: pathname === "/notifications", badge: unreadCount },
  ];
  const rightItems = [
    { href: "/messages", label: "Messages", icon: MessageCircle, active: pathname === "/messages", badge: unreadMessageCount },
    { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", "--bottom-nav-height": "56px" } as React.CSSProperties}
    >
      <div className="grid grid-cols-5 h-14 items-stretch">
        {/* Left two items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center h-full transition-colors ${
                item.active ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5 shrink-0" />
                {"badge" in item && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-rose-600 text-white text-[10px] font-bold rounded-full leading-none">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-0.5 font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Post Job button — opens a compact AI-first-vs-manual choice
            instead of jumping straight to the manual form (item 8). Reuses the
            existing estimator ("/") and manual form ("/create-lead") — no new
            pages are created. */}
        <button
          type="button"
          onClick={() => setShowPostChoice(true)}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            pathname === "/create-lead" ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
          }`}
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="text-[10px] mt-0.5 font-medium leading-tight">Post Job</span>
        </button>

        {/* Right two items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center h-full transition-colors ${
                item.active ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5 shrink-0" />
                {"badge" in item && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-rose-600 text-white text-[10px] font-bold rounded-full leading-none">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-0.5 font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Post Job entry choice — compact bottom sheet, reuses existing pages only */}
      {showPostChoice && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPostChoice(false); }}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 pb-6"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Post a Job</h3>
              <button
                type="button"
                onClick={() => setShowPostChoice(false)}
                aria-label="Close"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Primary: AI Estimate First */}
            <button
              type="button"
              onClick={() => { setShowPostChoice(false); router.push("/"); }}
              className="w-full flex items-start gap-3 text-left bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-2xl p-4 mb-3 active:scale-[0.98] transition-transform"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Get an AI Estimate First</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Upload photos or describe your project and see an estimated cost before posting.
                </p>
              </div>
            </button>

            {/* Secondary: Manual Post */}
            <button
              type="button"
              onClick={() => { setShowPostChoice(false); router.push("/create-lead"); }}
              className="w-full flex items-center gap-3 text-left border border-slate-200 rounded-2xl p-4 active:scale-[0.98] transition-transform hover:bg-slate-50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileEdit className="h-5 w-5 text-slate-600" />
              </div>
              <p className="font-semibold text-slate-700 text-sm">Post a Job Manually</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
