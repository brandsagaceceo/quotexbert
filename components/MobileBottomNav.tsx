"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Home,
  MessageCircle,
  Briefcase,
  User,
  Plus,
  FileText
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  isAction?: boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, authUser } = useAuth();

  if (!isSignedIn || !authUser) {
    return null;
  }

  const homeownerNavItems: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/"
    },
    {
      href: "/homeowner/jobs",
      label: "Jobs",
      icon: FileText,
      active: pathname.startsWith("/homeowner/jobs")
    },
    {
      href: "/create-lead",
      label: "Post Job",
      icon: Plus,
      active: pathname === "/create-lead",
      isAction: true
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
      active: pathname === "/messages"
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile"
    }
  ];

  const contractorNavItems: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/"
    },
    {
      href: "/contractor/jobs",
      label: "Jobs",
      icon: Briefcase,
      active: pathname.startsWith("/contractor/jobs")
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
      active: pathname === "/messages"
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile"
    }
  ];

  const navItems = authUser.role === "homeowner" ? homeownerNavItems : contractorNavItems;
  const colCount = navItems.length === 5 ? "grid-cols-5" : "grid-cols-4";

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        '--bottom-nav-height': '64px',
      } as React.CSSProperties}
    >
      <div className={`grid h-16 ${colCount}`}>
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="w-12 h-12 rounded-full bg-[#800020] flex items-center justify-center shadow-md -mt-4 border-2 border-white">
                  <Icon className="h-6 w-6 text-white shrink-0" />
                </div>
                <span className="text-[9px] mt-0.5 font-semibold text-[#800020] leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center h-full px-0.5 transition-colors
                ${item.active
                  ? "text-[#800020]"
                  : "text-gray-500 hover:text-[#800020]"
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-medium leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}