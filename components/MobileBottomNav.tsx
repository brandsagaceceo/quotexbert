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
  FileText,
  Scale
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
      href: "/second-opinion",
      label: "2nd Opinion",
      icon: Scale,
      active: pathname === "/second-opinion"
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

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        '--bottom-nav-height': '64px',
      } as React.CSSProperties}
    >
      <div className={`grid h-16 items-stretch ${navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center h-full px-0.5 transition-colors relative
                ${item.active 
                  ? "text-rose-600" 
                  : "text-gray-500 hover:text-rose-600"
                }
                ${item.isAction 
                  ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 mx-1 my-1.5 rounded-xl" 
                  : ""
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