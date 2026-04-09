"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Logo from "@/components/Logo";
import NotificationBell from "@/components/NotificationBell";
import { useClerk } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { isSignedIn, authLoading, authUser: user } = useAuth();
  const { signOut } = useClerk();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify AIAssistantPopup when mobile menu opens/closes so it can hide
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("mobileMenuToggle", { detail: { open: isMobileMenuOpen } })
      );
    }
  }, [isMobileMenuOpen]);

  const toggle = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="responsive-header" showText={true} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* AI Estimate - primary highlighted */}
            <Link
              href="/"
              className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#6d001b] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mr-1"
            >
              <span className="text-xs">✨</span>
              AI Estimate
            </Link>

            {/* Renovation Costs */}
            <Link
              href="/renovation-costs"
              className="text-gray-700 hover:text-[#800020] px-3 py-2 text-sm font-semibold rounded-lg hover:bg-rose-50 transition-colors"
            >
              Renovation Costs
            </Link>

            {/* For Contractors */}
            <Link
              href="/contractors/join"
              className="text-gray-700 hover:text-[#800020] px-3 py-2 text-sm font-semibold rounded-lg hover:bg-rose-50 transition-colors"
            >
              For Contractors
            </Link>

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle("more")}
                className="flex items-center gap-1 text-gray-700 hover:text-[#800020] px-3 py-2 text-sm font-semibold rounded-lg hover:bg-rose-50 transition-colors"
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openDropdown === "more" ? "rotate-180" : ""}`}
                />
              </button>
              {openDropdown === "more" && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 z-50">
                  <Link href="/blog" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-[#800020] transition-colors">Blog</Link>
                  <Link href="/about" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-[#800020] transition-colors">About</Link>
                  <Link href="/contact" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-[#800020] transition-colors">Contact Us</Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/affiliates" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-[#800020] transition-colors">💰 Affiliate Program</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {isSignedIn && user ? (
              <>
                {user.role === "homeowner" ? (
                  <Link
                    href="/create-lead"
                    className="bg-gradient-to-r from-[#800020] to-orange-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-opacity"
                  >
                    Post Project
                  </Link>
                ) : (
                  <Link
                    href="/contractor/jobs"
                    className="bg-gradient-to-r from-[#800020] to-orange-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-opacity"
                  >
                    Browse Jobs
                  </Link>
                )}

                <Link
                  href="/messages"
                  className="text-gray-600 hover:text-[#800020] text-sm font-semibold transition-colors px-2 py-2"
                >
                  Messages
                </Link>

                <NotificationBell />

                {/* Account dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggle("account")}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-[#800020] text-sm font-semibold border border-gray-200 hover:border-[#800020] px-3 py-2 rounded-lg transition-colors"
                  >
                    {user.name?.split(" ")[0] || "Account"}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === "account" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "account" && (
                    <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 z-50">
                      <Link href="/profile" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Profile</Link>
                      <button
                        onClick={() => { signOut(); setOpenDropdown(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-600 hover:text-[#800020] px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#800020] hover:bg-[#6d001b] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Sign In shortcut — gated on authLoading to prevent Sign In ↔ bell flicker */}
          {!authLoading && !isSignedIn && (
            <div className="lg:hidden flex items-center mr-1">
              <Link
                href="/sign-in"
                className="text-[#800020] border border-[#800020] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-[#800020] hover:bg-rose-50 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
            <div className="px-2 pt-2 space-y-0.5">
              {/* GET A QUOTE */}
              <p className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Get a Quote</p>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 text-sm font-bold text-[#800020] bg-rose-50 rounded-lg">
                ✨ AI Estimate
              </Link>
              <Link href="/renovation-costs" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">Renovation Cost Guides</Link>

              {/* FOR CONTRACTORS */}
              <p className="px-3 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">For Contractors</p>
              <Link href="/contractors/join" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">🔧 Join as Contractor</Link>
              <Link href="/contractor/jobs" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">📋 Browse Jobs</Link>

              {/* ACCOUNT */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {isSignedIn && user ? (
                  <>
                    <p className="px-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                    <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-700 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">💬 Messages</Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-700 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">👤 Profile</Link>
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left py-3 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <p className="px-3 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-[#800020] hover:bg-[#6d001b] text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors mb-1">
                      Create Free Account
                    </Link>
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="block text-center py-3 px-4 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-[#800020] hover:text-[#800020] rounded-xl transition-colors">
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* COMPANY */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</p>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-gray-600 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">Blog</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-gray-600 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">About</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-gray-600 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">Contact</Link>
                <Link href="/affiliates" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-gray-600 hover:text-[#800020] hover:bg-rose-50 rounded-lg transition-colors">💰 Affiliate Program</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}