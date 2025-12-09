"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUnreadMessageCount } from "@/lib/hooks/useUnreadMessageCount";
import {
  Home,
  Search,
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
  badge?: number;
  isAction?: boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, authUser } = useAuth();
  const { unreadCount } = useUnreadMessageCount();

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
      href: "/contractors",
      label: "Find Pros",
      icon: Search,
      active: pathname === "/contractors"
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
      active: pathname === "/messages",
      badge: unreadCount
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
      href: "/contractor/quotes",
      label: "Quotes",
      icon: FileText,
      active: pathname.startsWith("/contractor/quotes")
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
      active: pathname === "/messages",
      badge: unreadCount
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center h-full px-1 transition-colors relative
                ${item.active 
                  ? "text-rose-600" 
                  : "text-gray-500 hover:text-rose-600"
                }
                ${item.isAction 
                  ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 mx-2 my-1 rounded-xl" 
                  : ""
                }
              `}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${item.isAction ? "h-6 w-6" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {item.badge > 99 ? "99+" : item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${item.isAction ? "text-xs" : "text-[10px]"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}