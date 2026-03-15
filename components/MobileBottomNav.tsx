"use client";

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
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, authUser } = useAuth();

  if (!isSignedIn || !authUser) {
    return null;
  }

  if (authUser.role === "contractor") {
    const contractorItems = [
      { href: "/", label: "Home", icon: Home, active: pathname === "/" },
      { href: "/contractor/jobs", label: "Jobs", icon: Briefcase, active: pathname.startsWith("/contractor/jobs") },
      { href: "/messages", label: "Messages", icon: MessageCircle, active: pathname === "/messages" },
      { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
    ];
    return (
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", "--bottom-nav-height": "64px" } as React.CSSProperties}
      >
        <div className="grid grid-cols-4 h-16">
          {contractorItems.map((item) => {
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
