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

  const navLinks = [
    { href: "/", label: "AI Estimate" },
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
          </nav>

          {/* Right Side Actions - BIGGER & MORE PROMINENT */}
          <div className="hidden lg:flex items-center space-x-4">
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
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-3 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-rose-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {isSignedIn && user ? (
                <div className="space-y-2.5 pt-3 border-t border-gray-200">
                  {/* Primary Action */}
                  {user.role === 'homeowner' ? (
                    <Link
                      href="/create-lead"
                      className="block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Post Project
                    </Link>
                  ) : (
                    <Link
                      href="/contractor/jobs"
                      className="block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Browse Jobs
                    </Link>
                  )}
                  
                  {/* Messages */}
                  <Link
                    href="/messages"
                    className="block text-gray-700 hover:text-rose-700 py-2 text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>

                  <Link
                    href="/notifications"
                    className="block text-gray-700 hover:text-rose-700 py-2 text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  
                  {/* Profile */}
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-rose-700 py-2 text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 border-t border-gray-200">
                  <Link
                    href="/sign-in"
                    className="block text-gray-700 hover:text-rose-700 py-2 text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
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
