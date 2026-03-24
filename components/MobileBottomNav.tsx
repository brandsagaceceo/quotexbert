"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Home,
  Search,
  MessageCircle,
  Briefcase,
  User,
  Plus,
  Bell,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, authUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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

  if (!isSignedIn || !authUser) {
    return null;
  }

  if (authUser.role === "contractor") {
    const contractorItems = [
      { href: "/", label: "Home", icon: Home, active: pathname === "/" },
      { href: "/contractor/jobs", label: "Jobs", icon: Briefcase, active: pathname.startsWith("/contractor/jobs") },
      { href: "/notifications", label: "Alerts", icon: Bell, active: pathname === "/notifications", badge: unreadCount },
      { href: "/messages", label: "Messages", icon: MessageCircle, active: pathname === "/messages" },
      { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
    ];
    return (
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", "--bottom-nav-height": "64px" } as React.CSSProperties}
      >
        <div className="grid grid-cols-5 h-16">
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
    { href: "/jobs", label: "Jobs", icon: Search, active: pathname.startsWith("/jobs") },
  ];
  const rightItems = [
    { href: "/messages", label: "Messages", icon: MessageCircle, active: pathname === "/messages" },
    { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", "--bottom-nav-height": "64px" } as React.CSSProperties}
    >
      <div className="grid grid-cols-5 h-16 items-stretch">
        {/* Left two items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                item.active ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Post Job button */}
        <Link
          href="/create-lead"
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            pathname === "/create-lead" ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
          }`}
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="text-[10px] mt-0.5 font-medium leading-tight">Post Job</span>
        </Link>

        {/* Right two items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                item.active ? "text-[#800020]" : "text-gray-500 hover:text-[#800020]"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
