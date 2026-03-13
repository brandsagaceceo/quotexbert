"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Logo from "@/components/Logo";
import NotificationBell from "@/components/NotificationBell";
import { useClerk } from "@clerk/nextjs";

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, authUser: user } = useAuth();
  const { signOut } = useClerk();

  // Navigation links - updated March 12, 2026
  const navLinks = [
    { href: "/", label: "AI Estimate" },
    { href: "/second-opinion", label: "Second Opinion" },
    { href: "/renovation-costs", label: "Renovation Costs" },
    { href: "/contractors/join", label: "For Contractors" },
    { href: "/affiliates", label: "Affiliates" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <header 
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl"
      style={{ '--header-height': '64px' } as React.CSSProperties}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20 px-3 md:px-4">
          {/* Brand - BIGGER & MORE PROMINENT */}
          <div className="flex-shrink-0 transform transition-transform hover:scale-105">
            <Logo size="responsive-header" showText={true} />
          </div>

          {/* Desktop Navigation - BIGGER & MORE MODERN */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-rose-700 font-semibold text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Support - Desktop: Contact Page, Mobile calls handled in mobile menu */}
            <Link
              href="/contact"
              className="flex items-center gap-2 text-gray-700 hover:text-rose-700 font-semibold text-sm transition-colors duration-200 border-l border-gray-200 pl-6"
            >
              <span className="text-xs text-gray-500 font-normal">Need Help?</span>
              <span>📞 Contact Us</span>
            </Link>
          </nav>

          {/* Right Side Actions - BIGGER & MORE PROMINENT */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* For Contractors CTA - visible to everyone */}
            {!isSignedIn && (
              <Link
                href="/contractors/join"
                className="text-rose-700 hover:text-rose-900 px-4 py-2 text-sm font-bold border-2 border-rose-600 hover:border-rose-800 rounded-lg transition-all duration-200"
              >
                For Contractors
              </Link>
            )}
            
            {/* Authentication */}
            {isSignedIn && user ? (
              <>
                {/* Primary Action Button */}
                {user.role === 'homeowner' ? (
                  <Link
                    href="/create-lead"
                    className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Post Project
                  </Link>
                ) : (
                  <Link
                    href="/contractor/jobs"
                    className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Browse Jobs
                  </Link>
                )}

                {/* Secondary Navigation */}
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-rose-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Messages
                </Link>

                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-rose-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-rose-700 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-ink-700 hover:text-[var(--brand)] hover:bg-ink-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Slide down panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 pt-3 pb-5">
              {/* Main Nav Links */}
              <div className="space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-3 px-2 text-sm font-semibold text-gray-800 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-gray-100" />

              {/* Mobile Help - Direct Phone Call */}
              <a
                href="tel:9052429460"
                className="flex items-center gap-2 py-3 px-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Need Help? Call Us              </a>
              {/* Mobile Auth */}
              {isSignedIn && user ? (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  {/* User greeting */}
                  <p className="px-2 pb-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    {user.name || 'My Account'} &middot; {user.role === 'contractor' ? 'Contractor' : 'Homeowner'}
                  </p>

                  {/* Primary Action */}
                  {user.role === 'homeowner' ? (
                    <Link
                      href="/create-lead"
                      className="block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-center px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      + Post Project
                    </Link>
                  ) : (
                    <Link
                      href="/contractor/jobs"
                      className="block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-center px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse Jobs
                    </Link>
                  )}
                  
                  <Link
                    href="/messages"
                    className="flex items-center gap-2 py-3 px-2 text-sm font-semibold text-gray-700 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 py-3 px-2 text-sm font-semibold text-gray-700 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-3 px-2 text-sm font-semibold text-gray-700 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full py-3 px-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <Link
                    href="/sign-in"
                    className="block text-center py-3 px-4 text-sm font-semibold text-gray-700 border-2 border-gray-200 hover:border-rose-400 hover:text-rose-700 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block text-center bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
